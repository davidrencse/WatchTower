/**
 * MapLibre custom layer that draws satellites at their true orbital altitude.
 *
 * MapLibre's globe shader prelude exposes `projectTileFor3D(vec2 mercatorXY, float elevation)`,
 * where — under globe projection — elevation is metres above the sphere surface:
 *
 *     vec3 elevatedPos = spherePos * (1.0 + elevation / GLOBE_RADIUS);   // GLOBE_RADIUS 6371008.8
 *
 * So the whole catalogue draws in one call: hand the shader each satellite's sub-satellite point
 * in mercator space plus its altitude, and MapLibre puts it on the right shell. The same prelude
 * writes a clipping-plane Z, which is what makes satellites behind the planet disappear behind
 * the limb instead of showing through it.
 *
 * Picking is done on the CPU against `mainMatrix` (documented as "projects a unit sphere planet
 * to screen"), reusing the ECEF vectors the worker already computed — identical arithmetic to the
 * vertex shader, so what you hover is exactly what you see.
 */
import type { CustomLayerInterface, CustomRenderMethodInput, Map as MapLibreMap } from 'maplibre-gl';

import { SATELLITE_GROUPS } from '../data/satelliteGroups';
import { SAT_STRIDE } from '../workers/satelliteStride';

const MAX_GROUPS = 16;
const ORBIT_COLOR = new Float32Array([0.86, 0.9, 1]);

function hexToRgb(hex: string): [number, number, number] {
  const value = Number.parseInt(hex.replace('#', ''), 16);
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
}

const GROUP_COLORS = new Float32Array(MAX_GROUPS * 3);
SATELLITE_GROUPS.forEach((group, index) => {
  GROUP_COLORS.set(hexToRgb(group.color), index * 3);
});

/**
 * CPU twin of the vertex shader's `occludedByPlanet` — exact ray/sphere intersection between the
 * camera and the satellite, in unit-sphere space. Exported for tests.
 */
export function occludedByPlanet(
  x: number,
  y: number,
  z: number,
  camera: { dir: ArrayLike<number>; dist: number },
): boolean {
  const eye = [camera.dir[0] * camera.dist, camera.dir[1] * camera.dist, camera.dir[2] * camera.dist];
  const ray = [x - eye[0], y - eye[1], z - eye[2]];
  const a = ray[0] * ray[0] + ray[1] * ray[1] + ray[2] * ray[2];
  const b = 2 * (eye[0] * ray[0] + eye[1] * ray[1] + eye[2] * ray[2]);
  const c = eye[0] * eye[0] + eye[1] * eye[1] + eye[2] * eye[2] - 1;
  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) return false;
  const root = Math.sqrt(discriminant);
  const t0 = (-b - root) / (2 * a);
  const t1 = (-b + root) / (2 * a);
  return (t0 > 0 && t0 < 1) || (t1 > 0 && t1 < 1);
}

function compile(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`[satellites] shader compile failed: ${log}`);
  }
  return shader;
}

export interface SatelliteLayer extends CustomLayerInterface {
  /** Packed worker output: [mercX, mercY, altitudeMetres, ecefX, ecefY, ecefZ] per satellite. */
  setPositions(positions: Float32Array): void;
  setGroups(groups: Uint8Array): void;
  setVisibleGroups(visible: boolean[]): void;
  /** 0 hides the layer entirely; the caller fades this in as the camera pulls back. */
  setOpacity(opacity: number): void;
  setSelected(index: number | null): void;
  /** Orbit polyline for the selected satellite: [mercX, mercY, altitudeMetres] per sample. */
  setTrack(track: Float32Array | null): void;
  /** Nearest satellite within `radius` screen pixels, or null. */
  pick(x: number, y: number, radius: number): number | null;
  /** Screen position of one satellite, or null when it is behind the planet / off-screen. */
  project(index: number): { x: number; y: number } | null;
}

export function createSatelliteLayer(id: string, map: MapLibreMap): SatelliteLayer {
  let gl: WebGL2RenderingContext | null = null;
  let program: WebGLProgram | null = null;
  let attributes = { pos: -1, alt: -1, group: -1, ecef: -1 };
  let variant = '';
  let uniforms: Record<string, WebGLUniformLocation | null> = {};

  let positionBuffer: WebGLBuffer | null = null;
  let groupBuffer: WebGLBuffer | null = null;
  let trackBuffer: WebGLBuffer | null = null;

  let positions = new Float32Array(0);
  let groups = new Uint8Array(0);
  let track: Float32Array | null = null;
  let count = 0;
  let trackSamples = 0;
  let dirtyPositions = false;
  let dirtyGroups = false;
  let dirtyTrack = false;

  const visible = new Float32Array(MAX_GROUPS).fill(1);
  let opacity = 0;
  let selected: number | null = null;

  // Captured every frame so CPU picking uses precisely the matrix the GPU just drew with.
  let mainMatrix: number[] | Float32Array | null = null;
  const camera = { dir: new Float32Array([0, 0, 1]), dist: 2 };

  const GLOBE_RADIUS_M = 6371008.8;

  /** Camera as the shader sees it: unit ECEF direction plus distance in globe radii. */
  const cameraInGlobeSpace = () => {
    const transform = (map as unknown as {
      transform?: { getCameraLngLat?: () => { lng: number; lat: number }; getCameraAltitude?: () => number };
    }).transform;
    const lngLat = transform?.getCameraLngLat?.();
    const altitude = transform?.getCameraAltitude?.();
    if (!lngLat || typeof altitude !== 'number') return camera;
    const lng = (lngLat.lng * Math.PI) / 180;
    const lat = (lngLat.lat * Math.PI) / 180;
    const cosLat = Math.cos(lat);
    camera.dir[0] = Math.sin(lng) * cosLat;
    camera.dir[1] = Math.sin(lat);
    camera.dir[2] = Math.cos(lng) * cosLat;
    camera.dist = Math.max(1.001, (GLOBE_RADIUS_M + altitude) / GLOBE_RADIUS_M);
    return camera;
  };

  const build = (input: CustomRenderMethodInput) => {
    if (!gl) return;
    const { vertexShaderPrelude, define } = input.shaderData;
    const vertexSource = `#version 300 es
${vertexShaderPrelude}
${define}
in vec2 a_pos;
in float a_alt;
in float a_group;
in vec3 a_ecef;
uniform float u_visible[${MAX_GROUPS}];
uniform vec3 u_colors[${MAX_GROUPS}];
uniform float u_size;
uniform float u_selected;
uniform vec3 u_override;
uniform float u_use_override;
uniform vec3 u_camera_dir;
uniform float u_camera_dist;
out vec3 v_color;
out float v_drop;

// MapLibre's 3D globe path returns a true perspective Z and skips the horizon clip its 2D path
// applies, so the planet does not hide anything by itself. Cull explicitly with an exact
// ray/sphere intersection: the satellite is hidden when the segment from the camera to it enters
// the unit sphere. (A horizon-plane-plus-cylinder approximation is tempting and cheaper, but it
// under-culls whenever the camera is close to the surface.)
bool occludedByPlanet(vec3 elevated) {
    vec3 eye = u_camera_dir * u_camera_dist;
    vec3 ray = elevated - eye;
    float a = dot(ray, ray);
    float b = 2.0 * dot(eye, ray);
    float c = dot(eye, eye) - 1.0;
    float discriminant = b * b - 4.0 * a * c;
    if (discriminant < 0.0) return false;
    float root = sqrt(discriminant);
    float t0 = (-b - root) / (2.0 * a);
    float t1 = (-b + root) / (2.0 * a);
    return (t0 > 0.0 && t0 < 1.0) || (t1 > 0.0 && t1 < 1.0);
}

void main() {
    int group = int(a_group + 0.5);
    vec3 elevated = a_ecef * (1.0 + a_alt / GLOBE_RADIUS);
    // Altitude is negative for satellites SGP4 could not propagate this tick.
    bool hidden = a_alt < 0.0
        || (u_use_override < 0.5 && u_visible[group] < 0.5)
        || occludedByPlanet(elevated);
    v_drop = hidden ? 1.0 : 0.0;
    v_color = u_use_override > 0.5 ? u_override : u_colors[group];
    gl_Position = projectTileFor3D(a_pos, a_alt);
    bool isSelected = abs(u_selected - float(gl_VertexID)) < 0.5 && u_use_override < 0.5;
    gl_PointSize = u_size * (isSelected ? 2.6 : 1.0);
    if (hidden) {
        gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    }
}`;
    const fragmentSource = `#version 300 es
precision mediump float;
in vec3 v_color;
in float v_drop;
uniform float u_opacity;
uniform float u_round;
out vec4 fragColor;
void main() {
    if (v_drop > 0.5) discard;
    float alpha = u_opacity;
    if (u_round > 0.5) {
        // Soft round dot instead of a hard GL square.
        vec2 offset = gl_PointCoord - vec2(0.5);
        float dist = length(offset);
        if (dist > 0.5) discard;
        alpha *= smoothstep(0.5, 0.32, dist);
    }
    fragColor = vec4(v_color * alpha, alpha);
}`;

    if (program) gl.deleteProgram(program);
    const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
    program = gl.createProgram()!;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(`[satellites] program link failed: ${gl.getProgramInfoLog(program)}`);
    }

    uniforms = {};
    for (const name of [
      'u_projection_matrix',
      'u_projection_tile_mercator_coords',
      'u_projection_clipping_plane',
      'u_projection_transition',
      'u_projection_fallback_matrix',
      'u_size',
      'u_opacity',
      'u_selected',
      'u_override',
      'u_use_override',
      'u_round',
      'u_camera_dir',
      'u_camera_dist',
      'u_visible[0]',
      'u_colors[0]',
    ]) {
      uniforms[name] = gl.getUniformLocation(program, name);
    }
    attributes = {
      pos: gl.getAttribLocation(program, 'a_pos'),
      alt: gl.getAttribLocation(program, 'a_alt'),
      group: gl.getAttribLocation(program, 'a_group'),
      ecef: gl.getAttribLocation(program, 'a_ecef'),
    };
    variant = input.shaderData.variantName;
  };

  const layer: SatelliteLayer = {
    id,
    type: 'custom',
    renderingMode: '3d',

    onAdd(_map, context) {
      gl = context as WebGL2RenderingContext;
      positionBuffer = gl.createBuffer();
      groupBuffer = gl.createBuffer();
      trackBuffer = gl.createBuffer();
      dirtyPositions = true;
      dirtyGroups = true;
    },

    onRemove() {
      if (!gl) return;
      if (program) gl.deleteProgram(program);
      if (positionBuffer) gl.deleteBuffer(positionBuffer);
      if (groupBuffer) gl.deleteBuffer(groupBuffer);
      if (trackBuffer) gl.deleteBuffer(trackBuffer);
      program = null;
      gl = null;
    },

    render(context, input) {
      const glContext = context as WebGL2RenderingContext;
      gl = glContext;
      if (opacity <= 0.01 || count === 0) return;
      if (!program || variant !== input.shaderData.variantName) build(input);
      if (!program) return;

      const projection = input.defaultProjectionData;
      mainMatrix = projection.mainMatrix as unknown as Float32Array;

      glContext.useProgram(program);
      glContext.uniformMatrix4fv(uniforms.u_projection_matrix, false, projection.mainMatrix);
      glContext.uniform4fv(uniforms.u_projection_tile_mercator_coords, projection.tileMercatorCoords);
      glContext.uniform4fv(uniforms.u_projection_clipping_plane, projection.clippingPlane);
      glContext.uniform1f(uniforms.u_projection_transition, projection.projectionTransition);
      glContext.uniformMatrix4fv(
        uniforms.u_projection_fallback_matrix,
        false,
        projection.fallbackMatrix,
      );
      glContext.uniform1fv(uniforms['u_visible[0]'], visible);
      glContext.uniform3fv(uniforms['u_colors[0]'], GROUP_COLORS);
      glContext.uniform1f(uniforms.u_opacity, opacity);
      glContext.uniform1f(uniforms.u_selected, selected ?? -1);

      cameraInGlobeSpace();
      glContext.uniform3fv(uniforms.u_camera_dir, camera.dir);
      glContext.uniform1f(uniforms.u_camera_dist, camera.dist);

      glContext.enable(glContext.BLEND);
      glContext.blendFunc(glContext.ONE, glContext.ONE_MINUS_SRC_ALPHA);
      glContext.disable(glContext.DEPTH_TEST);

      if (dirtyPositions) {
        glContext.bindBuffer(glContext.ARRAY_BUFFER, positionBuffer);
        glContext.bufferData(glContext.ARRAY_BUFFER, positions, glContext.DYNAMIC_DRAW);
        dirtyPositions = false;
      }
      if (dirtyGroups) {
        glContext.bindBuffer(glContext.ARRAY_BUFFER, groupBuffer);
        glContext.bufferData(
          glContext.ARRAY_BUFFER,
          Float32Array.from(groups),
          glContext.STATIC_DRAW,
        );
        dirtyGroups = false;
      }

      const posLocation = attributes.pos;
      const altLocation = attributes.alt;
      const groupLocation = attributes.group;
      const ecefLocation = attributes.ecef;
      const stride = SAT_STRIDE * 4;

      // ── satellites
      glContext.uniform1f(uniforms.u_use_override, 0);
      glContext.uniform1f(uniforms.u_round, 1);
      glContext.uniform1f(uniforms.u_size, map.getZoom() < 0 ? 2.4 : 3.2);
      glContext.bindBuffer(glContext.ARRAY_BUFFER, positionBuffer);
      glContext.enableVertexAttribArray(posLocation);
      glContext.vertexAttribPointer(posLocation, 2, glContext.FLOAT, false, stride, 0);
      glContext.enableVertexAttribArray(altLocation);
      glContext.vertexAttribPointer(altLocation, 1, glContext.FLOAT, false, stride, 8);
      // The worker already emitted the unit-sphere ECEF, so the horizon cull costs no extra maths.
      glContext.enableVertexAttribArray(ecefLocation);
      glContext.vertexAttribPointer(ecefLocation, 3, glContext.FLOAT, false, stride, 12);
      glContext.bindBuffer(glContext.ARRAY_BUFFER, groupBuffer);
      glContext.enableVertexAttribArray(groupLocation);
      glContext.vertexAttribPointer(groupLocation, 1, glContext.FLOAT, false, 4, 0);
      glContext.drawArrays(glContext.POINTS, 0, count);

      // ── selected orbit track
      if (track && trackSamples > 1) {
        if (dirtyTrack) {
          glContext.bindBuffer(glContext.ARRAY_BUFFER, trackBuffer);
          glContext.bufferData(glContext.ARRAY_BUFFER, track, glContext.DYNAMIC_DRAW);
          dirtyTrack = false;
        }
        glContext.uniform1f(uniforms.u_use_override, 1);
        glContext.uniform1f(uniforms.u_round, 0);
        glContext.uniform3fv(uniforms.u_override, ORBIT_COLOR);
        glContext.uniform1f(uniforms.u_opacity, opacity * 0.55);
        glContext.bindBuffer(glContext.ARRAY_BUFFER, trackBuffer);
        glContext.enableVertexAttribArray(posLocation);
        glContext.vertexAttribPointer(posLocation, 2, glContext.FLOAT, false, 12, 0);
        glContext.enableVertexAttribArray(altLocation);
        glContext.vertexAttribPointer(altLocation, 1, glContext.FLOAT, false, 12, 8);
        glContext.disableVertexAttribArray(groupLocation);
        glContext.vertexAttrib1f(groupLocation, 0);
        // The track carries no ECEF, so feed a constant that never trips the horizon cull —
        // the orbit line is meant to read as a whole ellipse, including its far half.
        glContext.disableVertexAttribArray(ecefLocation);
        glContext.vertexAttrib3f(ecefLocation, 0, 0, 0);
        glContext.drawArrays(glContext.LINE_STRIP, 0, trackSamples);
      }
    },

    setPositions(next) {
      positions = next;
      count = Math.floor(next.length / SAT_STRIDE);
      dirtyPositions = true;
      map.triggerRepaint();
    },

    setGroups(next) {
      groups = next;
      dirtyGroups = true;
    },

    setVisibleGroups(next) {
      for (let i = 0; i < MAX_GROUPS; i++) visible[i] = next[i] ? 1 : 0;
      map.triggerRepaint();
    },

    setOpacity(next) {
      if (opacity === next) return;
      opacity = next;
      map.triggerRepaint();
    },

    setSelected(index) {
      selected = index;
      map.triggerRepaint();
    },

    setTrack(next) {
      track = next;
      trackSamples = next ? Math.floor(next.length / 3) : 0;
      dirtyTrack = true;
      map.triggerRepaint();
    },

    project(index) {
      if (!mainMatrix || index < 0 || index >= count) return null;
      const offset = index * SAT_STRIDE;
      const altitude = positions[offset + 2];
      if (altitude < 0) return null;
      const scale = 1 + altitude / GLOBE_RADIUS_M;
      const x = positions[offset + 3] * scale;
      const y = positions[offset + 4] * scale;
      const z = positions[offset + 5] * scale;
      // Same ray/sphere cull the vertex shader runs, so hovering can never latch a satellite
      // that is hidden behind the planet.
      if (occludedByPlanet(x, y, z, camera)) return null;
      const m = mainMatrix;
      const clipX = m[0] * x + m[4] * y + m[8] * z + m[12];
      const clipY = m[1] * x + m[5] * y + m[9] * z + m[13];
      const clipW = m[3] * x + m[7] * y + m[11] * z + m[15];
      if (clipW <= 0) return null;
      const canvas = map.getCanvas();
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      return {
        x: ((clipX / clipW) * 0.5 + 0.5) * width,
        y: (1 - ((clipY / clipW) * 0.5 + 0.5)) * height,
      };
    },

    /**
     * Hot path: this runs once per pointer sample against the whole catalogue (~12k objects
     * with Starlink loaded), so nothing inside the loop may allocate or call into MapLibre.
     * The matrix, canvas size and camera eye are hoisted, and the ray/sphere occlusion test —
     * the only part with a `sqrt` — is deferred until a candidate is already within `radius`,
     * which drops it from ~12k evaluations per move to at most a handful.
     */
    pick(px, py, radius) {
      if (!mainMatrix || count === 0 || opacity <= 0.01) return null;
      const m = mainMatrix;
      const m0 = m[0], m4 = m[4], m8 = m[8], m12 = m[12];
      const m1 = m[1], m5 = m[5], m9 = m[9], m13 = m[13];
      const m3 = m[3], m7 = m[7], m11 = m[11], m15 = m[15];
      const canvas = map.getCanvas();
      const halfWidth = canvas.clientWidth * 0.5;
      const halfHeight = canvas.clientHeight * 0.5;
      const eyeX = camera.dir[0] * camera.dist;
      const eyeY = camera.dir[1] * camera.dist;
      const eyeZ = camera.dir[2] * camera.dist;
      const eyeLengthSquared = eyeX * eyeX + eyeY * eyeY + eyeZ * eyeZ - 1;

      let best: number | null = null;
      let bestDistance = radius * radius;

      for (let i = 0; i < count; i++) {
        if (!visible[groups[i] ?? 0]) continue;
        const offset = i * SAT_STRIDE;
        const altitude = positions[offset + 2];
        if (altitude < 0) continue;
        const scale = 1 + altitude / GLOBE_RADIUS_M;
        const x = positions[offset + 3] * scale;
        const y = positions[offset + 4] * scale;
        const z = positions[offset + 5] * scale;

        const clipW = m3 * x + m7 * y + m11 * z + m15;
        if (clipW <= 0) continue;
        const inverseW = 1 / clipW;
        const screenX = ((m0 * x + m4 * y + m8 * z + m12) * inverseW + 1) * halfWidth;
        const dx = screenX - px;
        if (dx * dx >= bestDistance) continue;
        const screenY = (1 - (m1 * x + m5 * y + m9 * z + m13) * inverseW) * halfHeight;
        const dy = screenY - py;
        const distance = dx * dx + dy * dy;
        if (distance >= bestDistance) continue;

        // Same ray/sphere cull the vertex shader runs, inlined so the loop stays allocation-free.
        const rayX = x - eyeX;
        const rayY = y - eyeY;
        const rayZ = z - eyeZ;
        const a = rayX * rayX + rayY * rayY + rayZ * rayZ;
        const b = 2 * (eyeX * rayX + eyeY * rayY + eyeZ * rayZ);
        const discriminant = b * b - 4 * a * eyeLengthSquared;
        if (discriminant >= 0) {
          const root = Math.sqrt(discriminant);
          const inverse2A = 1 / (2 * a);
          const t0 = (-b - root) * inverse2A;
          const t1 = (-b + root) * inverse2A;
          if ((t0 > 0 && t0 < 1) || (t1 > 0 && t1 < 1)) continue;
        }

        bestDistance = distance;
        best = i;
      }
      return best;
    },
  };

  return layer;
}
