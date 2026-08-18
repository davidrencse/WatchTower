// Bakes Natural Earth 10m admin-1 units for the countries that have a per-region ancestry
// overlay on the globe (Germany, France, Italy) into a compact ring table.
// Output: public/geo/admin1-regions.json
// Run: node scripts/bake-admin1-regions.mjs
//
// The unit drawn is the Natural Earth admin-1 feature itself — Länder for Germany,
// départements for France, province for Italy — but each feature carries the NE `region`
// value, which is the level the ancestry estimates are keyed on (Land / région / regione).
// Dissolving départements into régions would need a real polygon union; joining on `region`
// gives the same colouring with finer, more honest outlines and no union step.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dir = dirname(fileURLToPath(import.meta.url));
const sourcePath = resolve(__dir, '_ne10_admin1.json');
const sourceUrl =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson';
const geo = existsSync(sourcePath)
  ? JSON.parse(readFileSync(sourcePath, 'utf8'))
  : await fetch(sourceUrl).then((response) => {
      if (!response.ok) throw new Error(`Natural Earth download failed: ${response.status}`);
      return response.json();
    });

const NEED = ['DEU', 'FRA', 'ITA', 'GBR', 'ESP', 'SWE', 'USA'];

/**
 * Countries whose ancestry estimates are keyed on the admin-1 unit itself rather than on
 * Natural Earth's parent `region`. Germany's Länder and Sweden's län have no parent grouping
 * at all (NE leaves `region` null), and for the United States NE's `region` is the four
 * Census macro-regions — far coarser than the per-state level the overlay needs.
 */
const KEY_ON_UNIT_NAME = new Set(['DEU', 'SWE', 'USA']);

// --- Douglas–Peucker (planar on lng/lat; fine at this scale).
function perpDist(p, a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.hypot(p[0] - a[0], p[1] - a[1]);
  let t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
}

function dp(points, tol) {
  if (points.length < 3) return points;
  let maxD = 0;
  let idx = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const d = perpDist(points[i], points[0], points[points.length - 1]);
    if (d > maxD) {
      maxD = d;
      idx = i;
    }
  }
  if (maxD > tol) {
    return dp(points.slice(0, idx + 1), tol)
      .slice(0, -1)
      .concat(dp(points.slice(idx), tol));
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
  let x = 0;
  let y = 0;
  let a = 0;
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

/** Admin-1 units are far smaller than countries, so they need a finer tolerance budget. */
function simplifyUnit(polys) {
  const outers = polys.map((p) => ({ ring: p[0], area: ringArea(p[0]) }));
  const maxArea = Math.max(...outers.map((o) => o.area));
  // Keep the mainland plus any island large enough to read at dossier zoom.
  const areaThresh = Math.max(maxArea * 0.02, 0.0006);
  const kept = outers
    .filter((o) => o.area === maxArea || o.area >= areaThresh)
    .sort((a, b) => b.area - a.area);

  const simplify = (ring, tol) => {
    const s = dp(ring, tol);
    return s.length >= 4 ? s : ring;
  };

  let tol = 0.002;
  let ringsOut = [];
  for (let iter = 0; iter < 8; iter++) {
    ringsOut = kept.map((o) => simplify(o.ring, tol));
    const vertices = ringsOut.reduce((sum, r) => sum + r.length, 0);
    // These are choropleth fills, not the coastline — `world-land.json` draws the real
    // outline on top, so a coarse boundary here is invisible and keeps the payload small.
    if (vertices <= 150) break;
    tol *= 1.5;
  }
  return { kept, ringsOut };
}

const out = {};
let totalUnits = 0;
let totalVertices = 0;

for (const iso of NEED) {
  const features = geo.features.filter((f) => f.properties.adm0_a3 === iso);
  if (features.length === 0) throw new Error(`No admin-1 features found for ${iso}`);

  out[iso] = features.map((feature) => {
    const g = feature.geometry;
    const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
    const { kept, ringsOut } = simplifyUnit(polys);

    const rings = ringsOut
      .filter((r) => r.length >= 4)
      .map((r) => {
        const flat = [];
        for (const [lng, lat] of r) flat.push(q(lng), q(lat));
        return flat;
      });

    totalUnits += 1;
    totalVertices += rings.reduce((sum, r) => sum + r.length / 2, 0);
    const anchor = centroid(kept[0].ring);

    return {
      // `iso_3166_2` is stable and unique; NE names carry local spellings and typos.
      code: feature.properties.iso_3166_2,
      name: feature.properties.name,
      // The level the ancestry estimates are keyed on — see KEY_ON_UNIT_NAME.
      region: KEY_ON_UNIT_NAME.has(iso)
        ? feature.properties.name
        : (feature.properties.region ?? feature.properties.name),
      a: [q(anchor[0]), q(anchor[1])],
      r: rings,
    };
  });
}

const json = JSON.stringify(out);
const dest = resolve(__dir, '..', 'public', 'geo', 'admin1-regions.json');
mkdirSync(dirname(dest), { recursive: true });
writeFileSync(dest, json);

const perCountry = NEED.map((iso) => `${iso}:${out[iso].length}`).join(' ');
console.log(
  `baked ${totalUnits} admin-1 units (${perCountry}), ${totalVertices} vertices -> public/geo/admin1-regions.json (${(json.length / 1024).toFixed(1)} KB)`,
);
