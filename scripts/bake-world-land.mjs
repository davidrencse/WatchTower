// Bakes Natural Earth 10m land into detailed world coastline rings for the globe backdrop.
// Output: public/geo/world-land.json   Run: node scripts/bake-world-land.mjs
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dir = dirname(fileURLToPath(import.meta.url));
const sourcePath = resolve(__dir, '_ne_10m_land.json');
const sourceUrl =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_land.geojson';
const geo = existsSync(sourcePath)
  ? JSON.parse(readFileSync(sourcePath, 'utf8'))
  : await fetch(sourceUrl).then((response) => {
      if (!response.ok) throw new Error(`Natural Earth download failed: ${response.status}`);
      return response.json();
    });

function perp(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const l2 = dx * dx + dy * dy;
  if (l2 === 0) return Math.hypot(p[0] - a[0], p[1] - a[1]);
  let t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
}
function dp(pts, tol) {
  if (pts.length < 4) return pts;
  let max = 0, idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = perp(pts[i], pts[0], pts[pts.length - 1]);
    if (d > max) { max = d; idx = i; }
  }
  if (max > tol) return dp(pts.slice(0, idx + 1), tol).slice(0, -1).concat(dp(pts.slice(idx), tol));
  return [pts[0], pts[pts.length - 1]];
}
function area(r) {
  let a = 0;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) a += (r[j][0] + r[i][0]) * (r[j][1] - r[i][1]);
  return Math.abs(a / 2);
}

const q = (n) => Math.round(n * 1000) / 1000;
const AREA_MIN = 0.03; // retain meaningful islands without projecting sub-pixel specks
const TOL = 0.055;

const rings = [];
let kept = 0, dropped = 0;
for (const f of geo.features) {
  const polygons =
    f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
  for (const polygon of polygons) {
    const ring = polygon[0];
    if (area(ring) < AREA_MIN) { dropped++; continue; }
    const s = dp(ring, TOL);
    if (s.length < 4) { dropped++; continue; }
    const flat = [];
    for (const [lng, lat] of s) flat.push(q(lng), q(lat));
    rings.push(flat);
    kept++;
  }
}

const total = rings.reduce((n, r) => n + r.length / 2, 0);

// Emitted as ready-to-serve GeoJSON so the MapLibre style can point `data` straight at the
// URL — the coordinates never enter the JavaScript bundle.
const out = JSON.stringify({
  type: 'FeatureCollection',
  features: rings.map((ring) => {
    const coordinates = [];
    for (let index = 0; index < ring.length; index += 2) {
      coordinates.push([ring[index], ring[index + 1]]);
    }
    const first = coordinates[0];
    const last = coordinates[coordinates.length - 1];
    if (first && last && (first[0] !== last[0] || first[1] !== last[1])) coordinates.push(first);
    return { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [coordinates] } };
  }),
});
const dest = resolve(__dir, '..', 'public', 'geo', 'world-land.json');
mkdirSync(dirname(dest), { recursive: true });
writeFileSync(dest, out);
console.log(`world land: kept ${kept} rings (dropped ${dropped}), ${total} vertices → public/geo/world-land.json (${(out.length / 1024).toFixed(1)} KB)`);
