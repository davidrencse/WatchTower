// Bakes Natural Earth 10m admin-0 country borders for the ~52 WatchTower countries into a
// compact, simplified shape table for the interactive globe.
// Output: public/geo/country-shapes.json + src/data/countryAnchors.ts
// Run: node scripts/bake-country-shapes.mjs
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dir = dirname(fileURLToPath(import.meta.url));
const sourcePath = resolve(__dir, '_ne10_countries.json');
const sourceUrl =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_countries.geojson';
const geo = existsSync(sourcePath)
  ? JSON.parse(readFileSync(sourcePath, 'utf8'))
  : await fetch(sourceUrl).then((response) => {
      if (!response.ok) throw new Error(`Natural Earth download failed: ${response.status}`);
      return response.json();
    });

const NEED = [
  'AUS','AUT','BLR','BEL','BIH','BGR','CAN','HRV','CYP','CZE','DNK','EST','FIN','FRA','DEU',
  'GRC','HUN','ISL','IRL','ITA','LVA','LIE','LTU','LUX','MLT','MDA','MCO','MNE','NLD','NZL',
  'NOR','POL','PRT','ROU','RUS','SRB','ZAF','SVK','SVN','ESP','SWE','CHE','UKR','GBR','USA',
  'ALB','AND','ARM','AZE','GEO','MKD','SMR',
  // East Asia
  'CHN','JPN','KOR','TWN',
];

const byIso = {};
for (const f of geo.features) byIso[f.properties.ADM0_A3] = f;

// --- Douglas–Peucker (planar on lng/lat; fine at this scale).
function perpDist(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.hypot(p[0] - a[0], p[1] - a[1]);
  let t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
}
function dp(points, tol) {
  if (points.length < 3) return points;
  let maxD = 0, idx = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const d = perpDist(points[i], points[0], points[points.length - 1]);
    if (d > maxD) { maxD = d; idx = i; }
  }
  if (maxD > tol) {
    const left = dp(points.slice(0, idx + 1), tol);
    const right = dp(points.slice(idx), tol);
    return left.slice(0, -1).concat(right);
  }
  return [points[0], points[points.length - 1]];
}

function ringArea(ring) {
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    a += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1]);
  }
  return Math.abs(a / 2);
}
function centroid(ring) {
  let x = 0, y = 0, a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const cross = ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
    x += (ring[j][0] + ring[i][0]) * cross;
    y += (ring[j][1] + ring[i][1]) * cross;
    a += cross;
  }
  if (a === 0) return ring[0];
  a *= 0.5;
  return [x / (6 * a), y / (6 * a)];
}

const q = (n) => Math.round(n * 1000) / 1000; // ~0.001° quantization

// Large mainland countries need a stricter default so their many tiny coastal islets do not
// bloat the runtime payload. Keep country-specific exceptions for administratively significant
// islands that fall just below that relative cutoff. China's 0.3% floor retains Hainan while
// still excluding its much smaller offshore polygons.
const MIN_ISLAND_AREA_RATIO_BY_ISO = {
  CHN: 0.003,
};

const shapes = {};
let totalOut = 0;
for (const iso of NEED) {
  const f = byIso[iso];
  const g = f.geometry;
  const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;

  // outer rings with area; keep the biggest, plus any island bigger than threshold.
  const outers = polys.map((p) => ({ ring: p[0], area: ringArea(p[0]) }));
  const maxArea = Math.max(...outers.map((o) => o.area));
  const minIslandAreaRatio = MIN_ISLAND_AREA_RATIO_BY_ISO[iso] ?? 0.006;
  const areaThresh = Math.max(maxArea * minIslandAreaRatio, 0.008); // retain meaningful islands

  const kept = outers
    .filter((o) => o.area === maxArea || o.area >= areaThresh)
    .sort((a, b) => b.area - a.area);

  // Retain enough detail for the enlarged globe without making every-frame projection heavy.
  // Fall back to the original ring when DP would collapse a tiny country (e.g. Monaco).
  const simplify = (ring, tol) => {
    const s = dp(ring, tol);
    return s.length >= 4 ? s : ring;
  };
  let tol = 0.008;
  let ringsOut;
  for (let iter = 0; iter < 8; iter++) {
    ringsOut = kept.map((o) => simplify(o.ring, tol));
    const v = ringsOut.reduce((s, r) => s + r.length, 0);
    if (v <= 900) break;
    tol *= 1.45;
  }

  const flat = ringsOut
    .filter((r) => r.length >= 4)
    .map((r) => {
      const out = [];
      for (const [lng, lat] of r) out.push(q(lng), q(lat));
      return out;
    });
  totalOut += flat.reduce((s, r) => s + r.length / 2, 0);
  const anchor = centroid(kept[0].ring);
  shapes[iso] = { a: [q(anchor[0]), q(anchor[1])], r: flat };
}

const rings = {};
const anchorLines = [];
for (const [iso, s] of Object.entries(shapes)) {
  rings[iso] = s.r;
  anchorLines.push(`  ${iso}: [${s.a[0]}, ${s.a[1]}],`);
}

// Rings go to JSON (fetched at runtime); only the tiny anchor table stays importable,
// because globe markers need their label positions synchronously.
const out = JSON.stringify(rings);
const dest = resolve(__dir, '..', 'public', 'geo', 'country-shapes.json');
mkdirSync(dirname(dest), { recursive: true });
writeFileSync(dest, out);
writeFileSync(
  resolve(__dir, '..', 'src', 'data', 'countryAnchors.ts'),
  `// AUTO-GENERATED by scripts/bake-country-shapes.mjs — do not edit by hand.
// Label anchors only. The matching border rings are served from /geo/country-shapes.json
// so they never enter the JavaScript bundle.

/** ISO3 -> [lng, lat] label anchor for every country drawn on the globe. */
export const COUNTRY_ANCHORS: Record<string, [number, number]> = {
${anchorLines.join('\n')}
};
`,
);
console.log(`baked ${NEED.length} countries, ${totalOut} vertices -> public/geo/country-shapes.json (${(out.length / 1024).toFixed(1)} KB)`);
