// Draws the East Asia flag PNGs the gallery needs (Assets/Flags is the source of truth, and
// vite.config.ts mirrors it into public/flags). Everything here is plain geometry rasterised
// with a 3x supersample and written as an 8-bit truecolour PNG — no image dependency.
//
// Output size matches every other flag in Assets/Flags: 204x120. Radii are derived from the
// flag height so discs stay circular in that slightly-wide box rather than becoming ellipses.
//
// Run: node scripts/generate-flag-art.mjs
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const OUT_W = 204;
const OUT_H = 120;
const SS = 3; // supersample factor
const W = OUT_W * SS;
const H = OUT_H * SS;

const __dir = dirname(fileURLToPath(import.meta.url));

// --- tiny raster canvas -------------------------------------------------------------------

function canvas(rgb) {
  const buf = new Uint8Array(W * H * 3);
  for (let i = 0; i < W * H; i++) {
    buf[i * 3] = rgb[0];
    buf[i * 3 + 1] = rgb[1];
    buf[i * 3 + 2] = rgb[2];
  }
  return buf;
}

function put(buf, x, y, rgb) {
  const i = (y * W + x) * 3;
  buf[i] = rgb[0];
  buf[i + 1] = rgb[1];
  buf[i + 2] = rgb[2];
}

/** Fill every pixel where `test(x, y)` is true, over the given bounding box. */
function fill(buf, box, rgb, test) {
  const x0 = Math.max(0, Math.floor(box[0]));
  const y0 = Math.max(0, Math.floor(box[1]));
  const x1 = Math.min(W - 1, Math.ceil(box[2]));
  const y1 = Math.min(H - 1, Math.ceil(box[3]));
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (test(x + 0.5, y + 0.5)) put(buf, x, y, rgb);
    }
  }
}

function rect(buf, x, y, w, h, rgb) {
  fill(buf, [x, y, x + w, y + h], rgb, () => true);
}

function disc(buf, cx, cy, r, rgb) {
  const r2 = r * r;
  fill(buf, [cx - r, cy - r, cx + r, cy + r], rgb, (x, y) => {
    const dx = x - cx;
    const dy = y - cy;
    return dx * dx + dy * dy <= r2;
  });
}

/** Even-odd polygon fill; `pts` is a flat [x0,y0,x1,y1,…] list. */
function polygon(buf, pts, rgb) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < pts.length; i += 2) {
    minX = Math.min(minX, pts[i]);
    maxX = Math.max(maxX, pts[i]);
    minY = Math.min(minY, pts[i + 1]);
    maxY = Math.max(maxY, pts[i + 1]);
  }
  fill(buf, [minX, minY, maxX, maxY], rgb, (px, py) => {
    let inside = false;
    for (let i = 0, j = pts.length - 2; i < pts.length; j = i, i += 2) {
      const xi = pts[i];
      const yi = pts[i + 1];
      const xj = pts[j];
      const yj = pts[j + 1];
      if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  });
}

/** Five-pointed star, `rot` = radians the first point is turned from straight up. */
function star(buf, cx, cy, outer, rot, rgb) {
  const inner = outer * Math.sin(Math.PI / 10) / Math.sin((7 * Math.PI) / 10);
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = -Math.PI / 2 + rot + (i * Math.PI) / 5;
    pts.push(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
  }
  polygon(buf, pts, rgb);
}

/** Rotated rectangle centred on (cx,cy): `len` along `angle`, `thick` across it. */
function bar(buf, cx, cy, len, thick, angle, rgb) {
  const ca = Math.cos(angle);
  const sa = Math.sin(angle);
  const hx = (ca * len) / 2;
  const hy = (sa * len) / 2;
  const tx = (-sa * thick) / 2;
  const ty = (ca * thick) / 2;
  polygon(
    buf,
    [
      cx - hx - tx, cy - hy - ty,
      cx + hx - tx, cy + hy - ty,
      cx + hx + tx, cy + hy + ty,
      cx - hx + tx, cy - hy + ty,
    ],
    rgb,
  );
}

// --- PNG encoding -------------------------------------------------------------------------

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(bytes) {
  let c = 0xffffffff;
  for (const b of bytes) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const out = Buffer.alloc(data.length + 12);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, 'ascii');
  Buffer.from(data).copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
  return out;
}

/** Box-downsample the supersampled canvas, then encode as an 8-bit RGB PNG. */
function encodePng(buf) {
  const raw = Buffer.alloc(OUT_H * (OUT_W * 3 + 1));
  let p = 0;
  for (let y = 0; y < OUT_H; y++) {
    raw[p++] = 0; // filter: none
    for (let x = 0; x < OUT_W; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const i = ((y * SS + sy) * W + (x * SS + sx)) * 3;
          r += buf[i];
          g += buf[i + 1];
          b += buf[i + 2];
        }
      }
      const n = SS * SS;
      raw[p++] = Math.round(r / n);
      raw[p++] = Math.round(g / n);
      raw[p++] = Math.round(b / n);
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(OUT_W, 0);
  ihdr.writeUInt32BE(OUT_H, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type: truecolour
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// --- the four flags -----------------------------------------------------------------------

/** Japan — white field, crimson disc of 3/5 the flag height, centred. */
function japan() {
  const buf = canvas([255, 255, 255]);
  disc(buf, W / 2, H / 2, H * 0.3, [188, 0, 45]);
  return buf;
}

/**
 * China — the canonical 30x20 unit grid: big star centred at (5,5) with a circumscribed radius
 * of 3 units, four 1-unit stars at (10,2), (12,4), (12,7) and (10,9), each turned so one point
 * aims at the big star.
 */
function china() {
  const buf = canvas([222, 41, 16]);
  const gold = [255, 222, 0];
  const u = H / 20;
  const big = [5 * u, 5 * u];
  star(buf, big[0], big[1], 3 * u, 0, gold);
  for (const [ux, uy] of [[10, 2], [12, 4], [12, 7], [10, 9]]) {
    const cx = ux * u;
    const cy = uy * u;
    // Turn the star so its top point faces the big star's centre.
    const rot = Math.atan2(big[1] - cy, big[0] - cx) + Math.PI / 2;
    star(buf, cx, cy, u, rot, gold);
  }
  return buf;
}

/**
 * South Korea — taegeuk of half the flag height, split along a 33.69° axis (red above, blue
 * below), plus the four trigrams on the diagonals: geon (3 solid) upper hoist, gon (3 broken)
 * lower fly, gam and ri on the other diagonal.
 */
function korea() {
  const buf = canvas([255, 255, 255]);
  const red = [205, 46, 58];
  const blue = [0, 71, 160];
  const black = [0, 0, 0];
  const cx = W / 2;
  const cy = H / 2;
  const R = H / 4;
  const theta = (-33.69 * Math.PI) / 180; // axis tilts up toward the fly

  // The taegeuk's S-curve is two half-radius semicircles on the dividing axis: the axis puts
  // red above and blue below, then the lower half of the hoist-side disc flips to red and the
  // upper half of the fly-side disc flips to blue.
  const ca = Math.cos(-theta);
  const sa = Math.sin(-theta);
  const isRed = (x, y) => {
    const dx = x - cx;
    const dy = y - cy;
    if (dx * dx + dy * dy > R * R) return null; // outside the taegeuk
    const u = dx * ca - dy * sa;
    const v = dx * sa + dy * ca;
    const half = (R / 2) ** 2;
    if (v < 0) return (u - R / 2) ** 2 + v * v > half; // top: blue inside the fly-side disc
    return (u + R / 2) ** 2 + v * v <= half; // bottom: red inside the hoist-side disc
  };
  const box = [cx - R, cy - R, cx + R, cy + R];
  fill(buf, box, red, (x, y) => isRed(x, y) === true);
  fill(buf, box, blue, (x, y) => isRed(x, y) === false);

  // Trigrams. `lines` runs from the bar nearest the taegeuk outward; true = solid.
  const t = H / 24; // bar thickness
  const len = H * 0.375;
  const gap = t * 1.5; // gap inside a broken bar
  const seg = (len - gap) / 2;
  const step = t * 1.55; // spacing between the three bars
  const first = R + t * 2; // radial distance of the innermost bar

  const trigrams = [
    { dir: Math.PI - theta, lines: [true, true, true] }, // geon — upper hoist
    { dir: -theta, lines: [false, false, false] }, // gon — lower fly
    { dir: theta, lines: [false, true, false] }, // gam — upper fly
    { dir: Math.PI + theta, lines: [true, false, true] }, // ri — lower hoist
  ];

  for (const { dir, lines } of trigrams) {
    const dx = Math.cos(dir);
    const dy = Math.sin(dir);
    lines.forEach((solid, i) => {
      const d = first + i * step;
      const bx = cx + dx * d;
      const by = cy + dy * d;
      const across = dir + Math.PI / 2; // bars sit perpendicular to the diagonal
      if (solid) {
        bar(buf, bx, by, len, t, across, black);
      } else {
        const off = (gap + seg) / 2;
        bar(buf, bx + Math.cos(across) * off, by + Math.sin(across) * off, seg, t, across, black);
        bar(buf, bx - Math.cos(across) * off, by - Math.sin(across) * off, seg, t, across, black);
      }
    });
  }
  return buf;
}

/** Taiwan — red field, blue canton, white sun: twelve rays, blue ring, white centre. */
function taiwan() {
  const buf = canvas([254, 0, 0]);
  const navy = [0, 0, 149];
  const white = [255, 255, 255];
  rect(buf, 0, 0, W / 2, H / 2, navy);

  const cx = W / 4;
  const cy = H / 4;
  const outer = (H / 2) * 0.4;
  for (let i = 0; i < 12; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 6;
    const half = Math.PI / 12; // 15° half-width base
    polygon(
      buf,
      [
        cx + Math.cos(a) * outer, cy + Math.sin(a) * outer,
        cx + Math.cos(a - half) * outer * 0.42, cy + Math.sin(a - half) * outer * 0.42,
        cx + Math.cos(a + half) * outer * 0.42, cy + Math.sin(a + half) * outer * 0.42,
      ],
      white,
    );
  }
  disc(buf, cx, cy, outer * 0.42, navy);
  disc(buf, cx, cy, outer * 0.34, white);
  return buf;
}

const FLAGS = [
  ['flag-of-China.png', china],
  ['flag-of-Japan.png', japan],
  ['flag-of-South-Korea.png', korea],
  ['flag-of-Taiwan.png', taiwan],
];

const dest = resolve(__dir, '..', 'Assets', 'Flags');
mkdirSync(dest, { recursive: true });
for (const [name, draw] of FLAGS) {
  const png = encodePng(draw());
  writeFileSync(resolve(dest, name), png);
  console.log(`${name} — ${OUT_W}x${OUT_H}, ${(png.length / 1024).toFixed(1)} KB`);
}
