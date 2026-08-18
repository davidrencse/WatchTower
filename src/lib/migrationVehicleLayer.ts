import type {
  CustomLayerInterface,
  CustomRenderMethodInput,
  Map as MapLibreMap,
} from 'maplibre-gl';

import type { MigrationLegMode, MigrationRouteStatus } from '../data/migrationCorridors';

export interface MigrationVehicleUnit {
  coordinates: readonly [longitude: number, latitude: number];
  bearing: number;
  mode: MigrationLegMode;
  status: MigrationRouteStatus;
}

export interface MigrationVehicleLayer extends CustomLayerInterface {
  setUnits(units: readonly MigrationVehicleUnit[]): void;
}

type Point3 = readonly [x: number, y: number, z: number];

interface Mesh {
  vertices: Float32Array;
  count: number;
}

const EARTH_CIRCUMFERENCE_M = 40_075_016.686;
const INITIAL_MODEL_ZOOM = 1.4;
const MODEL_STRIDE = 5;
const INSTANCE_STRIDE = 8;
const MODES = ['land', 'sea', 'air'] as const;

const MODE_COLORS: Record<MigrationLegMode, readonly [number, number, number]> = {
  land: [0.97, 0.78, 0.36],
  sea: [0.32, 0.78, 0.96],
  air: [0.72, 0.68, 1],
};
const IRREGULAR_COLOR = [1, 0.41, 0.34] as const;

function mercatorX(longitude: number) {
  return (longitude + 180) / 360;
}

function mercatorY(latitude: number) {
  const clamped = Math.max(-85.051129, Math.min(85.051129, latitude));
  const radians = (clamped * Math.PI) / 180;
  return (1 - Math.log(Math.tan(Math.PI / 4 + radians / 2)) / Math.PI) / 2;
}

function pushTriangle(target: number[], a: Point3, b: Point3, c: Point3, tone = 1) {
  const ux = b[0] - a[0];
  const uy = b[1] - a[1];
  const uz = b[2] - a[2];
  const vx = c[0] - a[0];
  const vy = c[1] - a[1];
  const vz = c[2] - a[2];
  const nx = uy * vz - uz * vy;
  const ny = uz * vx - ux * vz;
  const nz = ux * vy - uy * vx;
  const length = Math.hypot(nx, ny, nz) || 1;
  const shade = Math.max(
    0.34,
    Math.min(1, 0.62 + ((nx * -0.35 + ny * 0.25 + nz * 0.9) / length) * 0.38),
  );
  for (const point of [a, b, c]) target.push(point[0], point[1], point[2], tone, shade);
}

function addBox(target: number[], min: Point3, max: Point3, tone = 1) {
  const [x0, y0, z0] = min;
  const [x1, y1, z1] = max;
  const corners: Point3[] = [
    [x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0],
    [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1],
  ];
  const faces = [
    [0, 2, 1], [0, 3, 2], [4, 5, 6], [4, 6, 7],
    [0, 1, 5], [0, 5, 4], [1, 2, 6], [1, 6, 5],
    [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7],
  ] as const;
  for (const [a, b, c] of faces) pushTriangle(target, corners[a], corners[b], corners[c], tone);
}

function addPrism(
  target: number[],
  polygon: readonly (readonly [number, number])[],
  z0: number,
  z1: number,
  tone = 1,
) {
  for (let index = 1; index < polygon.length - 1; index++) {
    const a = polygon[0];
    const b = polygon[index];
    const c = polygon[index + 1];
    pushTriangle(target, [a[0], a[1], z1], [b[0], b[1], z1], [c[0], c[1], z1], tone);
    pushTriangle(target, [a[0], a[1], z0], [c[0], c[1], z0], [b[0], b[1], z0], tone);
  }
  for (let index = 0; index < polygon.length; index++) {
    const a = polygon[index];
    const b = polygon[(index + 1) % polygon.length];
    pushTriangle(target, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], tone);
    pushTriangle(target, [a[0], a[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], tone);
  }
}

function addTaperedBody(
  target: number[],
  x: number,
  sections: readonly (readonly [forward: number, radius: number, height: number])[],
  sides = 8,
  tone = 1,
) {
  for (let section = 0; section < sections.length - 1; section++) {
    const current = sections[section];
    const next = sections[section + 1];
    for (let side = 0; side < sides; side++) {
      const angle0 = (side / sides) * Math.PI * 2;
      const angle1 = ((side + 1) / sides) * Math.PI * 2;
      const a: Point3 = [
        x + Math.cos(angle0) * current[1],
        current[0],
        current[2] + Math.sin(angle0) * current[1],
      ];
      const b: Point3 = [
        x + Math.cos(angle1) * current[1],
        current[0],
        current[2] + Math.sin(angle1) * current[1],
      ];
      const c: Point3 = [
        x + Math.cos(angle1) * next[1],
        next[0],
        next[2] + Math.sin(angle1) * next[1],
      ];
      const d: Point3 = [
        x + Math.cos(angle0) * next[1],
        next[0],
        next[2] + Math.sin(angle0) * next[1],
      ];
      pushTriangle(target, a, b, c, tone);
      pushTriangle(target, a, c, d, tone);
    }
  }
}

function mesh(vertices: number[]): Mesh {
  return { vertices: new Float32Array(vertices), count: vertices.length / MODEL_STRIDE };
}

function createAirbusMesh(): Mesh {
  const vertices: number[] = [];
  addTaperedBody(vertices, 0, [[3.8, 0.08, 0.55], [2.6, 0.54, 0.55], [-2.5, 0.58, 0.55], [-3.5, 0.12, 0.7]]);
  addPrism(vertices, [[-0.3, 1.25], [-4.3, -1], [-4.05, -1.65], [-0.35, -0.35]], 0.38, 0.55);
  addPrism(vertices, [[0.3, 1.25], [4.3, -1], [4.05, -1.65], [0.35, -0.35]], 0.38, 0.55);
  addPrism(vertices, [[-0.2, -2.15], [-1.75, -3.05], [-1.65, -3.38], [-0.2, -2.85]], 0.58, 0.75);
  addPrism(vertices, [[0.2, -2.15], [1.75, -3.05], [1.65, -3.38], [0.2, -2.85]], 0.58, 0.75);
  addPrism(vertices, [[-0.12, -2.3], [0.12, -2.3], [0.08, -3.35], [-0.08, -3.35]], 0.65, 1.75);
  addTaperedBody(vertices, -1.75, [[0.25, 0.22, 0.05], [-1.35, 0.27, 0.05], [-1.7, 0.08, 0.05]], 7, 0.78);
  addTaperedBody(vertices, 1.75, [[0.25, 0.22, 0.05], [-1.35, 0.27, 0.05], [-1.7, 0.08, 0.05]], 7, 0.78);
  addBox(vertices, [-0.34, 2.3, 0.92], [0.34, 2.72, 1.04], 0.12);
  return mesh(vertices);
}

function createFerryMesh(): Mesh {
  const vertices: number[] = [];
  addPrism(vertices, [[0, 3.6], [-1.45, 2.1], [-1.65, -2.6], [-1.05, -3.4], [1.05, -3.4], [1.65, -2.6], [1.45, 2.1]], 0, 0.72);
  addBox(vertices, [-1.25, -1.75, 0.72], [1.25, 1.55, 1.42]);
  addBox(vertices, [-0.96, -0.5, 1.42], [0.96, 1.68, 2.05], 0.88);
  addBox(vertices, [-0.78, 0.72, 2.05], [0.78, 1.58, 2.45], 0.16);
  addBox(vertices, [-0.32, -1.28, 1.42], [0.32, -0.58, 2.62], 0.52);
  return mesh(vertices);
}

function createCarMesh(): Mesh {
  const vertices: number[] = [];
  addPrism(vertices, [[-1.05, 2.35], [-1.22, 1.65], [-1.18, -2.05], [-0.85, -2.35], [0.85, -2.35], [1.18, -2.05], [1.22, 1.65], [1.05, 2.35]], 0.25, 0.82);
  addPrism(vertices, [[-0.82, 0.95], [-0.62, -1.25], [0.62, -1.25], [0.82, 0.95]], 0.82, 1.55, 0.9);
  addBox(vertices, [-0.68, 0.5, 1.31], [0.68, 1.02, 1.54], 0.12);
  addBox(vertices, [-0.67, -1.24, 1.3], [0.67, -0.86, 1.5], 0.16);
  for (const x of [-1.28, 1.05]) {
    for (const y of [-1.48, 1.35]) addBox(vertices, [x, y, 0.05], [x + 0.23, y + 0.68, 0.58], 0.08);
  }
  return mesh(vertices);
}

const MESHES: Record<MigrationLegMode, Mesh> = {
  land: createCarMesh(),
  sea: createFerryMesh(),
  air: createAirbusMesh(),
};

function compile(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`[migration vehicles] shader compile failed: ${log}`);
  }
  return shader;
}

export function createMigrationVehicleLayer(id: string, map: MapLibreMap): MigrationVehicleLayer {
  let gl: WebGL2RenderingContext | null = null;
  let program: WebGLProgram | null = null;
  let variant = '';
  let dirty = true;
  let units: readonly MigrationVehicleUnit[] = [];
  const modelBuffers = new Map<MigrationLegMode, WebGLBuffer>();
  const instanceBuffers = new Map<MigrationLegMode, WebGLBuffer>();
  const instanceData = new Map<MigrationLegMode, Float32Array>();
  const instanceCounts = new Map<MigrationLegMode, number>();
  const attributes: Record<string, number> = {};
  const uniforms: Record<string, WebGLUniformLocation | null> = {};

  const buildProgram = (input: CustomRenderMethodInput) => {
    if (!gl) return;
    const { vertexShaderPrelude, define } = input.shaderData;
    const vertexSource = `#version 300 es
${vertexShaderPrelude}
${define}
in vec3 a_local;
in float a_tone;
in float a_shade;
in vec3 a_center;
in vec2 a_rotation;
in vec3 a_color;
uniform float u_scale;
uniform float u_lift;
out vec3 v_color;
void main() {
  float east = a_local.x * a_rotation.y + a_local.y * a_rotation.x;
  float north = a_local.y * a_rotation.y - a_local.x * a_rotation.x;
  vec2 position = a_center.xy + vec2(east, -north) * u_scale * a_center.z;
  float altitude = (a_local.z + u_lift) * u_scale;
  gl_Position = projectTileFor3D(position, altitude);
  vec3 material = mix(vec3(0.035, 0.045, 0.052), a_color, a_tone);
  v_color = material * a_shade;
}`;
    const fragmentSource = `#version 300 es
precision mediump float;
in vec3 v_color;
out vec4 fragColor;
void main() {
  fragColor = vec4(v_color * 0.98, 0.98);
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
      throw new Error(`[migration vehicles] program link failed: ${gl.getProgramInfoLog(program)}`);
    }

    for (const name of ['a_local', 'a_tone', 'a_shade', 'a_center', 'a_rotation', 'a_color']) {
      attributes[name] = gl.getAttribLocation(program, name);
    }
    for (const name of [
      'u_projection_matrix',
      'u_projection_tile_mercator_coords',
      'u_projection_clipping_plane',
      'u_projection_transition',
      'u_projection_fallback_matrix',
      'u_scale',
      'u_lift',
    ]) uniforms[name] = gl.getUniformLocation(program, name);
    variant = input.shaderData.variantName;
  };

  const rebuildInstances = () => {
    const grouped: Record<MigrationLegMode, number[]> = { land: [], sea: [], air: [] };
    for (const unit of units) {
      const longitude = unit.coordinates[0];
      const latitude = Math.max(-85, Math.min(85, unit.coordinates[1]));
      const radians = (latitude * Math.PI) / 180;
      const bearing = (unit.bearing * Math.PI) / 180;
      const color = unit.status === 'irregular' ? IRREGULAR_COLOR : MODE_COLORS[unit.mode];
      grouped[unit.mode].push(
        mercatorX(longitude),
        mercatorY(latitude),
        1 / (EARTH_CIRCUMFERENCE_M * Math.max(0.08, Math.cos(radians))),
        Math.sin(bearing),
        Math.cos(bearing),
        color[0],
        color[1],
        color[2],
      );
    }
    for (const mode of MODES) {
      instanceData.set(mode, new Float32Array(grouped[mode]));
      instanceCounts.set(mode, grouped[mode].length / INSTANCE_STRIDE);
    }
    dirty = true;
  };

  const layer: MigrationVehicleLayer = {
    id,
    type: 'custom',
    renderingMode: '3d',

    onAdd(_map, context) {
      gl = context as WebGL2RenderingContext;
      for (const mode of MODES) {
        const modelBuffer = gl.createBuffer();
        const instanceBuffer = gl.createBuffer();
        if (modelBuffer) modelBuffers.set(mode, modelBuffer);
        if (instanceBuffer) instanceBuffers.set(mode, instanceBuffer);
        gl.bindBuffer(gl.ARRAY_BUFFER, modelBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, MESHES[mode].vertices, gl.STATIC_DRAW);
      }
      rebuildInstances();
    },

    onRemove() {
      if (!gl) return;
      if (program) gl.deleteProgram(program);
      for (const buffer of modelBuffers.values()) gl.deleteBuffer(buffer);
      for (const buffer of instanceBuffers.values()) gl.deleteBuffer(buffer);
      modelBuffers.clear();
      instanceBuffers.clear();
      program = null;
      gl = null;
    },

    render(context, input) {
      const glContext = context as WebGL2RenderingContext;
      gl = glContext;
      if (units.length === 0) return;
      if (!program || variant !== input.shaderData.variantName) buildProgram(input);
      if (!program) return;

      const projection = input.defaultProjectionData;
      glContext.useProgram(program);
      glContext.uniformMatrix4fv(uniforms.u_projection_matrix, false, projection.mainMatrix);
      glContext.uniform4fv(uniforms.u_projection_tile_mercator_coords, projection.tileMercatorCoords);
      glContext.uniform4fv(uniforms.u_projection_clipping_plane, projection.clippingPlane);
      glContext.uniform1f(uniforms.u_projection_transition, projection.projectionTransition);
      glContext.uniformMatrix4fv(uniforms.u_projection_fallback_matrix, false, projection.fallbackMatrix);
      glContext.uniform1f(uniforms.u_scale, 96_000 * Math.pow(2, INITIAL_MODEL_ZOOM - map.getZoom()));
      glContext.enable(glContext.DEPTH_TEST);
      glContext.depthFunc(glContext.LEQUAL);
      glContext.depthMask(false);
      glContext.enable(glContext.BLEND);
      glContext.blendFunc(glContext.ONE, glContext.ONE_MINUS_SRC_ALPHA);
      glContext.disable(glContext.CULL_FACE);

      for (const mode of MODES) {
        const count = instanceCounts.get(mode) ?? 0;
        if (count === 0) continue;
        const modelBuffer = modelBuffers.get(mode);
        const instanceBuffer = instanceBuffers.get(mode);
        if (!modelBuffer || !instanceBuffer) continue;

        glContext.uniform1f(uniforms.u_lift, mode === 'air' ? 1.35 : mode === 'sea' ? 0.08 : 0.14);
        glContext.bindBuffer(glContext.ARRAY_BUFFER, modelBuffer);
        glContext.enableVertexAttribArray(attributes.a_local);
        glContext.vertexAttribPointer(attributes.a_local, 3, glContext.FLOAT, false, MODEL_STRIDE * 4, 0);
        glContext.vertexAttribDivisor(attributes.a_local, 0);
        glContext.enableVertexAttribArray(attributes.a_tone);
        glContext.vertexAttribPointer(attributes.a_tone, 1, glContext.FLOAT, false, MODEL_STRIDE * 4, 12);
        glContext.vertexAttribDivisor(attributes.a_tone, 0);
        glContext.enableVertexAttribArray(attributes.a_shade);
        glContext.vertexAttribPointer(attributes.a_shade, 1, glContext.FLOAT, false, MODEL_STRIDE * 4, 16);
        glContext.vertexAttribDivisor(attributes.a_shade, 0);

        glContext.bindBuffer(glContext.ARRAY_BUFFER, instanceBuffer);
        if (dirty) {
          glContext.bufferData(
            glContext.ARRAY_BUFFER,
            instanceData.get(mode) ?? new Float32Array(),
            glContext.DYNAMIC_DRAW,
          );
        }
        const stride = INSTANCE_STRIDE * 4;
        glContext.enableVertexAttribArray(attributes.a_center);
        glContext.vertexAttribPointer(attributes.a_center, 3, glContext.FLOAT, false, stride, 0);
        glContext.vertexAttribDivisor(attributes.a_center, 1);
        glContext.enableVertexAttribArray(attributes.a_rotation);
        glContext.vertexAttribPointer(attributes.a_rotation, 2, glContext.FLOAT, false, stride, 12);
        glContext.vertexAttribDivisor(attributes.a_rotation, 1);
        glContext.enableVertexAttribArray(attributes.a_color);
        glContext.vertexAttribPointer(attributes.a_color, 3, glContext.FLOAT, false, stride, 20);
        glContext.vertexAttribDivisor(attributes.a_color, 1);
        glContext.drawArraysInstanced(glContext.TRIANGLES, 0, MESHES[mode].count, count);
      }
      dirty = false;
      glContext.depthMask(true);
    },

    setUnits(next) {
      units = next;
      rebuildInstances();
      map.triggerRepaint();
    },
  };

  return layer;
}
