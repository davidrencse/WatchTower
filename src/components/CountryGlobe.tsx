import { useEffect, useMemo, useRef, useState } from 'react';
import { WORLD_LAND } from '../data/worldLand';
import { COUNTRY_SHAPES } from '../data/countryShapes';
import {
  GLOBE_LIVE_COUNT,
  GLOBE_SOON_COUNT,
  type GlobeMarker,
} from '../data/globeCountries';
import type { FlagEntry } from '../types/flag';

interface CountryGlobeProps {
  markers: GlobeMarker[];
  /** Opens the dossier for a `live` country. */
  onSelect: (flag: FlagEntry) => void;
}

const DEG = Math.PI / 180;
const MONO = "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace";

// Monochrome instrument palette — black sea, hairline ink.
const INK = {
  sea0: '#0b0b0d',
  sea1: '#030304',
  coast: 'rgba(255,255,255,0.34)',
  graticule: 'rgba(255,255,255,0.045)',
  limb: 'rgba(255,255,255,0.34)',
  live: 'rgba(244,244,246,0.92)',
  liveDim: 'rgba(244,244,246,0.55)',
  soon: 'rgba(232,232,236,0.42)',
  hi: 'rgba(255,255,255,1)',
};

function vec(lng: number, lat: number): [number, number, number] {
  const la = lat * DEG;
  const lo = lng * DEG;
  const cl = Math.cos(la);
  return [cl * Math.sin(lo), Math.sin(la), cl * Math.cos(lo)];
}

function ringsToVectors(flatRings: number[][]): Float64Array[] {
  return flatRings.map((flat) => {
    const arr = new Float64Array((flat.length / 2) * 3);
    let k = 0;
    for (let i = 0; i < flat.length; i += 2) {
      const v = vec(flat[i], flat[i + 1]);
      arr[k++] = v[0];
      arr[k++] = v[1];
      arr[k++] = v[2];
    }
    return arr;
  });
}

interface Country {
  m: GlobeMarker;
  rings: Float64Array[];
  anchor: [number, number, number];
}

function buildCountries(markers: GlobeMarker[]): Country[] {
  const out: Country[] = [];
  for (const m of markers) {
    const shape = COUNTRY_SHAPES[m.iso];
    if (!shape) continue;
    out.push({ m, rings: ringsToVectors(shape.r), anchor: vec(shape.a[0], shape.a[1]) });
  }
  return out;
}

function pointInFlatRing(px: number, py: number, r: number[]): boolean {
  let inside = false;
  const n = r.length / 2;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = r[i * 2], yi = r[i * 2 + 1];
    const xj = r[j * 2], yj = r[j * 2 + 1];
    if ((yi > py) !== (yj > py)) {
      const xint = ((xj - xi) * (py - yi)) / (yj - yi) + xi;
      if (px < xint) inside = !inside;
    }
  }
  return inside;
}

interface Projected {
  m: GlobeMarker;
  rings: number[][];
  area: number;
  anchor: { sx: number; sy: number; z: number } | null;
}

export function CountryGlobe({ markers, onSelect }: CountryGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  const worldRings = useMemo(() => ringsToVectors(WORLD_LAND), []);
  const countries = useMemo(() => buildCountries(markers), [markers]);

  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  const view = useRef({ yaw: -0.26, pitch: 0.42, scale: 1.12 }); // faces Europe, tilted north
  const drag = useRef({ active: false, moved: false, px: 0, py: 0, vx: 0, vy: 0, lastT: 0 });
  const inertia = useRef({ vx: 0, vy: 0 });
  const lastInteract = useRef(0);
  const hovered = useRef<string | null>(null);
  const ripple = useRef<{ id: string; t: number } | null>(null);
  const projected = useRef<Projected[]>([]);

  const reduceMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  // Topmost (smallest) polygon under the point; falls back to the nearest anchor so that
  // microstates whose outline is sub-pixel at this zoom are still selectable.
  const pick = (mx: number, my: number): Projected | null => {
    let best: Projected | null = null;
    for (const p of projected.current) {
      let hit = false;
      for (const r of p.rings) if (pointInFlatRing(mx, my, r)) hit = true;
      if (hit && (!best || p.area < best.area)) best = p;
    }
    if (best) return best;
    let nearest: Projected | null = null;
    let nd = 13 * 13;
    for (const p of projected.current) {
      if (!p.anchor) continue;
      const d = (p.anchor.sx - mx) ** 2 + (p.anchor.sy - my) ** 2;
      if (d < nd) { nd = d; nearest = p; }
    }
    return nearest;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rel = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onDown = (e: PointerEvent) => {
      try { canvas.setPointerCapture(e.pointerId); } catch { /* synthetic pointer */ }
      const p = rel(e);
      hovered.current = null;
      drag.current = { active: true, moved: false, px: p.x, py: p.y, vx: 0, vy: 0, lastT: performance.now() };
      inertia.current = { vx: 0, vy: 0 };
      lastInteract.current = performance.now();
    };
    const onMove = (e: PointerEvent) => {
      const p = rel(e);
      if (drag.current.active) {
        const dx = p.x - drag.current.px;
        const dy = p.y - drag.current.py;
        if (Math.abs(dx) + Math.abs(dy) > 3) drag.current.moved = true;
        const k = 0.005 / view.current.scale;
        view.current.yaw += dx * k;
        view.current.pitch = Math.max(-1.3, Math.min(1.3, view.current.pitch + dy * k));
        const now = performance.now();
        const dt = Math.max(now - drag.current.lastT, 1);
        drag.current.vx = (dx * k) / dt;
        drag.current.vy = (dy * k) / dt;
        drag.current.px = p.x;
        drag.current.py = p.y;
        drag.current.lastT = now;
        lastInteract.current = now;
      } else {
        const hit = pick(p.x, p.y);
        hovered.current = hit ? hit.m.id : null;
        canvas.style.cursor = hit ? 'pointer' : 'grab';
      }
    };
    const onUp = (e: PointerEvent) => {
      if (!drag.current.active) return;
      try { canvas.releasePointerCapture(e.pointerId); } catch { /* already released */ }
      const wasClick = !drag.current.moved;
      const p = rel(e);
      drag.current.active = false;
      if (wasClick) {
        const hit = pick(p.x, p.y);
        if (hit) {
          ripple.current = { id: hit.m.id, t: performance.now() };
          if (hit.m.status === 'live' && hit.m.flag) onSelectRef.current(hit.m.flag);
        }
      } else if (!reduceMotion) {
        inertia.current = { vx: drag.current.vx * 16, vy: drag.current.vy * 16 };
      }
      lastInteract.current = performance.now();
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      view.current.scale = Math.max(0.8, Math.min(2.6, view.current.scale * (e.deltaY > 0 ? 0.92 : 1.08)));
      lastInteract.current = performance.now();
    };
    const onLeave = () => { if (!drag.current.active) hovered.current = null; };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('wheel', onWheel);
    };
  }, [reduceMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let W = 0, H = 0, dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = wrap.clientWidth;
      H = wrap.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    setReady(true);

    let prev = performance.now();

    const frame = (now: number) => {
      const dt = Math.min(now - prev, 50);
      prev = now;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const cx = W / 2, cy = H / 2;
      const R = Math.min(cx, cy) * 0.9 * view.current.scale;

      if (!drag.current.active) {
        if (Math.abs(inertia.current.vx) > 0.00002 || Math.abs(inertia.current.vy) > 0.00002) {
          view.current.yaw += inertia.current.vx;
          view.current.pitch = Math.max(-1.3, Math.min(1.3, view.current.pitch + inertia.current.vy));
          inertia.current.vx *= 0.94;
          inertia.current.vy *= 0.94;
        } else if (!reduceMotion && now - lastInteract.current > 1400) {
          view.current.yaw += 0.00009 * dt; // slow idle drift
        }
      }

      const { yaw, pitch } = view.current;
      const cyaw = Math.cos(yaw), syaw = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      const project = (x: number, y: number, z: number) => {
        const x1 = x * cyaw + z * syaw;
        const z1 = -x * syaw + z * cyaw;
        const y2 = y * cp - z1 * sp;
        const z2 = y * sp + z1 * cp;
        return { sx: cx + R * x1, sy: cy - R * y2, z: z2 };
      };

      // Void — near-black with a faint centre lift.
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();

      // Sea — matte black sphere with subtle edge falloff for volume.
      const sea = ctx.createRadialGradient(cx - R * 0.15, cy - R * 0.2, R * 0.2, cx, cy, R);
      sea.addColorStop(0, INK.sea0);
      sea.addColorStop(1, INK.sea1);
      ctx.fillStyle = sea;
      ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

      // World coastlines. Do not close partially visible land polygons across the horizon:
      // those closing chords become large, flickering wedges as the globe rotates.
      const coast = new Path2D();
      for (const ring of worldRings) {
        const n = ring.length / 3;
        const px = new Float64Array(n), py = new Float64Array(n);
        const front = new Uint8Array(n);
        for (let i = 0; i < n; i++) {
          const p = project(ring[i * 3], ring[i * 3 + 1], ring[i * 3 + 2]);
          px[i] = p.sx; py[i] = p.sy; front[i] = p.z > 0.02 ? 1 : 0;
        }
        for (let i = 0; i < n; i++) {
          const j = (i + 1) % n;
          if (front[i] && front[j]) { coast.moveTo(px[i], py[i]); coast.lineTo(px[j], py[j]); }
        }
      }
      ctx.lineJoin = 'round';
      ctx.lineWidth = Math.max(0.6, R * 0.0022);
      ctx.strokeStyle = INK.coast;
      ctx.stroke(coast);

      // Graticule.
      ctx.strokeStyle = INK.graticule;
      ctx.lineWidth = 1;
      const drawArc = (fn: (t: number) => [number, number], from: number, to: number, step: number) => {
        ctx.beginPath();
        let pen = false;
        for (let t = from; t <= to; t += step) {
          const [lng, lat] = fn(t);
          const v = vec(lng, lat);
          const p = project(v[0], v[1], v[2]);
          if (p.z <= 0) { pen = false; continue; }
          if (!pen) { ctx.moveTo(p.sx, p.sy); pen = true; } else ctx.lineTo(p.sx, p.sy);
        }
        ctx.stroke();
      };
      for (let lat = -60; lat <= 60; lat += 30) drawArc((lng) => [lng, lat], -180, 180, 4);
      for (let lng = -180; lng < 180; lng += 30) drawArc((lat) => [lng, lat], -85, 85, 4);

      // Highlighted countries — build projection cache + stroke paths.
      const hov = hovered.current;
      const cache: Projected[] = [];
      let hoveredDraw: { country: Country; anchor: { sx: number; sy: number; z: number } } | null = null;

      const liveStroke = new Path2D();
      const soonStroke = new Path2D();

      for (const c of countries) {
        const isLive = c.m.status === 'live';
        const screenRings: number[][] = [];
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        const target = isLive ? liveStroke : soonStroke;
        const isHover = hov === c.m.id;

        for (const ring of c.rings) {
          const n = ring.length / 3;
          const px = new Float64Array(n), py = new Float64Array(n);
          const front = new Uint8Array(n);
          for (let i = 0; i < n; i++) {
            const p = project(ring[i * 3], ring[i * 3 + 1], ring[i * 3 + 2]);
            px[i] = p.sx; py[i] = p.sy; front[i] = p.z > 0.02 ? 1 : 0;
          }
          const flat: number[] = [];
          for (let i = 0; i < n; i++) {
            if (!front[i]) continue;
            flat.push(px[i], py[i]);
            if (px[i] < minX) minX = px[i];
            if (px[i] > maxX) maxX = px[i];
            if (py[i] < minY) minY = py[i];
            if (py[i] > maxY) maxY = py[i];
          }
          if (flat.length >= 6) screenRings.push(flat);
          if (!isHover) {
            for (let i = 0; i < n; i++) {
              const j = (i + 1) % n;
              if (front[i] && front[j]) { target.moveTo(px[i], py[i]); target.lineTo(px[j], py[j]); }
            }
          }
        }
        const anchor = project(c.anchor[0], c.anchor[1], c.anchor[2]);
        cache.push({
          m: c.m,
          rings: screenRings,
          area: minX < maxX ? (maxX - minX) * (maxY - minY) : Infinity,
          anchor: anchor.z > 0 ? anchor : null,
        });
        if (isHover && !drag.current.active && anchor.z > 0.08) {
          hoveredDraw = { country: c, anchor };
        }
      }
      projected.current = cache;

      // Live outlines (solid hairline), soon outlines (fine dashed).
      ctx.lineWidth = Math.max(1, R * 0.0028);
      ctx.strokeStyle = INK.live;
      ctx.stroke(liveStroke);
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = Math.max(0.8, R * 0.0022);
      ctx.strokeStyle = INK.soon;
      ctx.stroke(soonStroke);
      ctx.setLineDash([]);

      // Precise square markers at each country anchor (locator, not glow).
      for (const p of cache) {
        if (!p.anchor || p.anchor.z <= 0.08) continue;
        const s = 3;
        const x = p.anchor.sx - s / 2, y = p.anchor.sy - s / 2;
        ctx.globalAlpha = 0.5 + p.anchor.z * 0.5;
        if (p.m.status === 'live') {
          ctx.fillStyle = INK.live;
          ctx.fillRect(x, y, s, s);
        } else {
          ctx.strokeStyle = INK.soon;
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, s, s);
        }
        ctx.globalAlpha = 1;

        if (ripple.current?.id === p.m.id) {
          const age = (now - ripple.current.t) / 600;
          if (age >= 1) ripple.current = null;
          else {
            ctx.globalAlpha = (1 - age) * 0.6;
            ctx.strokeStyle = INK.hi;
            ctx.lineWidth = 1;
            ctx.strokeRect(p.anchor.sx - age * 22, p.anchor.sy - age * 22, age * 44, age * 44);
            ctx.globalAlpha = 1;
          }
        }
      }

      // Hovered country — brighter outline + corner ticks.
      if (hoveredDraw) {
        const { country, anchor } = hoveredDraw;
        const stroke = new Path2D();
        for (const ring of country.rings) {
          const n = ring.length / 3;
          const px = new Float64Array(n), py = new Float64Array(n);
          const front = new Uint8Array(n);
          for (let i = 0; i < n; i++) {
            const p = project(ring[i * 3], ring[i * 3 + 1], ring[i * 3 + 2]);
            px[i] = p.sx; py[i] = p.sy; front[i] = p.z > 0.02 ? 1 : 0;
          }
          for (let i = 0; i < n; i++) {
            const j = (i + 1) % n;
            if (front[i] && front[j]) { stroke.moveTo(px[i], py[i]); stroke.lineTo(px[j], py[j]); }
          }
        }
        if (country.m.status === 'soon') ctx.setLineDash([3, 3]);
        ctx.strokeStyle = INK.hi;
        ctx.lineWidth = Math.max(1.2, R * 0.0038);
        ctx.stroke(stroke);
        ctx.setLineDash([]);
        drawTicks(ctx, anchor.sx, anchor.sy, 9);
      }

      ctx.restore(); // remove clip

      // Limb — crisp hairline edge.
      ctx.strokeStyle = INK.limb;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();

      // Hover annotation — leader line to a technical label.
      if (hov) {
        const p = cache.find((c) => c.m.id === hov);
        if (p && p.anchor) drawAnnotation(ctx, p.m, p.anchor.sx, p.anchor.sy, W);
      }

      raf = requestAnimationFrame(frame);
    };

    frame(performance.now());
    const onVisible = () => { if (!document.hidden) frame(performance.now()); };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [worldRings, countries, reduceMotion]);

  return (
    <div
      ref={wrapRef}
      data-theme="dark"
      className="relative h-[100dvh] w-full select-none overflow-hidden bg-black"
      style={{
        opacity: ready ? 1 : 0,
        transform: ready ? 'scale(1)' : 'scale(1.03)',
        transition: 'opacity 900ms cubic-bezier(0.16,1,0.3,1), transform 1100ms cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      <canvas ref={canvasRef} data-globe className="absolute inset-0 h-full w-full touch-none" style={{ cursor: 'grab' }} />

      {/* Corner registration ticks */}
      <div className="pointer-events-none absolute inset-5 sm:inset-7">
        {(['tl', 'tr', 'bl', 'br'] as const).map((c) => (
          <span
            key={c}
            className="absolute h-3 w-3 border-white/20"
            style={{
              top: c[0] === 't' ? 0 : undefined,
              bottom: c[0] === 'b' ? 0 : undefined,
              left: c[1] === 'l' ? 0 : undefined,
              right: c[1] === 'r' ? 0 : undefined,
              borderTopWidth: c[0] === 't' ? 1 : 0,
              borderBottomWidth: c[0] === 'b' ? 1 : 0,
              borderLeftWidth: c[1] === 'l' ? 1 : 0,
              borderRightWidth: c[1] === 'r' ? 1 : 0,
            }}
          />
        ))}
      </div>

      {/* HUD */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-1000"
        style={{ opacity: ready ? 1 : 0, fontFamily: MONO }}
      >
        <div className="absolute left-6 top-6 sm:left-9 sm:top-8">
          <div className="flex items-baseline gap-3">
            <span className="text-[13px] font-medium uppercase tracking-[0.42em] text-white/95">
              WATCHTOWER
            </span>
            <span className="text-[10px] tracking-[0.2em] text-white/35">v1.0</span>
          </div>
          <p className="mt-2 text-[10.5px] uppercase leading-relaxed tracking-[0.18em] text-white/40">
            Global intelligence atlas · orthographic
          </p>
        </div>

        <div className="absolute right-6 top-6 hidden text-right sm:right-9 sm:top-8 md:block">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
            {GLOBE_LIVE_COUNT + GLOBE_SOON_COUNT} nations tracked
          </p>
          <p className="mt-1 text-[10px] tracking-[0.18em] text-white/25">LAT 46.6°N · LON 15.0°E</p>
        </div>

        <div className="absolute bottom-6 left-6 flex flex-col gap-2.5 sm:bottom-8 sm:left-9">
          <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.16em]">
            <span className="inline-block h-px w-5 bg-white/90" />
            <span className="text-white/75">Live dossier</span>
            <span className="tabular-nums text-white/40">{String(GLOBE_LIVE_COUNT).padStart(2, '0')}</span>
          </div>
          <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.16em]">
            <span
              className="inline-block h-px w-5"
              style={{ backgroundImage: 'repeating-linear-gradient(90deg,rgba(255,255,255,0.5) 0 3px,transparent 3px 6px)' }}
            />
            <span className="text-white/75">In development</span>
            <span className="tabular-nums text-white/40">{String(GLOBE_SOON_COUNT).padStart(2, '0')}</span>
          </div>
        </div>

        <div className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 text-[10px] uppercase tracking-[0.28em] text-white/30 md:block">
          Drag&nbsp;·&nbsp;Scroll&nbsp;·&nbsp;Select
        </div>
      </div>
    </div>
  );
}

/** Four corner ticks framing a hovered country. */
function drawTicks(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.lineWidth = 1;
  const a = 4;
  ctx.beginPath();
  for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) {
    ctx.moveTo(x + sx * r, y + sy * r);
    ctx.lineTo(x + sx * r - sx * a, y + sy * r);
    ctx.moveTo(x + sx * r, y + sy * r);
    ctx.lineTo(x + sx * r, y + sy * r - sy * a);
  }
  ctx.stroke();
}

/** Leader line + monochrome instrument label for the hovered country. */
function drawAnnotation(
  ctx: CanvasRenderingContext2D,
  m: GlobeMarker,
  ax: number,
  ay: number,
  W: number,
) {
  const isLive = m.status === 'live';
  const name = m.label.toUpperCase();
  const status = isLive ? 'LIVE DOSSIER' : 'IN DEVELOPMENT';
  ctx.font = `500 12px ${MONO}`;
  const nameW = ctx.measureText(name).width;
  ctx.font = `400 9px ${MONO}`;
  const statusW = ctx.measureText(status).width;
  const padX = 11, cardH = 40;
  const cardW = padX * 2 + Math.max(nameW, statusW);
  const goRight = ax < W - cardW - 60;
  const lead = 26;
  const bx = goRight ? ax + lead : ax - lead - cardW;
  const by = ay - cardH - 14;

  // leader
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(goRight ? ax + lead : ax - lead, by + cardH);
  ctx.lineTo(goRight ? bx : bx + cardW, by + cardH);
  ctx.stroke();

  // card
  ctx.fillStyle = 'rgba(0,0,0,0.85)';
  ctx.fillRect(bx, by, cardW, cardH);
  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
  ctx.lineWidth = 1;
  ctx.strokeRect(bx + 0.5, by + 0.5, cardW - 1, cardH - 1);

  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#fafafa';
  ctx.font = `500 12px ${MONO}`;
  ctx.fillText(name, bx + padX, by + 18);
  // status with a small leading marker
  ctx.fillStyle = isLive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.55)';
  if (isLive) ctx.fillRect(bx + padX, by + 27, 4, 4);
  else ctx.strokeRect(bx + padX + 0.5, by + 27.5, 3, 3);
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = `400 9px ${MONO}`;
  ctx.fillText(status + (isLive ? '  →' : ''), bx + padX + 9, by + 31);
}
