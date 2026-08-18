/**
 * Verifies every maritime trade lane stays on water.
 *
 * The lanes in `src/data/maritimeTradeRoutes.ts` are hand-plotted through real traffic-separation
 * schemes, canals and straits. This densifies each lane exactly the way the globe does
 * (great-circle interpolation) and point-in-polygon tests every vertex against the baked
 * Natural Earth 10m land mask, so a waypoint chain that cuts a peninsula fails here instead of
 * shipping as a line drawn across Arabia.
 *
 * Run: node --experimental-strip-types scripts/check-trade-routes.mjs
 *
 * Two things the mask cannot answer, both allowed by exception below:
 *   - Canal and river transits (Suez, Panama, the Elbe, the Mississippi passes) are land in
 *     Natural Earth. Each is whitelisted as an explicit corridor box, not silently skipped.
 *   - The 10m coastline is simplified, so a berth sits a few hundred metres inland. Vertices
 *     within COAST_TOLERANCE_KM of open water are treated as harbour approaches.
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dir, '..');

const { TRADE_LANES, TRADE_CHOKEPOINTS, TRADE_PORTS, TRADE_PORT_BY_CODE } = await import(
  pathToFileURL(resolve(root, 'src/data/maritimeTradeRoutes.ts')).href
);

const land = JSON.parse(readFileSync(resolve(root, 'public/geo/world-land.json'), 'utf8'));

/** Berth and canal corridors the land mask cannot represent: [west, south, east, north]. */
const WATERWAY_EXCEPTIONS = [
  { name: 'Suez Canal', box: [32.2, 29.6, 32.75, 31.5] },
  { name: 'Panama Canal', box: [-80.1, 8.7, -79.4, 9.65] },
  { name: 'Elbe navigation channel', box: [8.0, 53.4, 10.05, 54.15] },
  { name: 'Mississippi Southwest Pass', box: [-89.6, 28.8, -89.1, 29.3] },
  { name: 'Sabine Pass', box: [-94.0, 29.6, -93.7, 29.8] },
  { name: 'Bosphorus / Dardanelles', box: [26.0, 39.9, 29.3, 41.35] },
  { name: 'Singapore Strait berths', box: [103.5, 1.1, 104.0, 1.35] },
  { name: 'Tokyo Bay', box: [139.6, 35.1, 140.15, 35.7] },
  { name: 'San Pedro Bay', box: [-118.35, 33.6, -118.1, 33.8] },
  { name: 'New York Harbor', box: [-74.25, 40.5, -73.8, 40.75] },
  { name: 'Santos estuary', box: [-46.45, -24.1, -46.2, -23.9] },
  { name: 'Bonny River', box: [7.0, 4.2, 7.3, 4.5] },
  { name: 'Vadinar / Gulf of Kachchh', box: [69.5, 22.2, 70.0, 22.5] },
  { name: 'Novorossiysk', box: [37.6, 44.6, 37.95, 44.78] },
  { name: 'Kozmino / Nakhodka', box: [132.2, 42.6, 132.6, 42.85] },
  { name: 'Murmansk / Kola Inlet', box: [32.9, 68.9, 33.6, 69.4] },
  { name: 'Port Hedland', box: [118.4, -20.45, 118.75, -20.2] },
  { name: 'Gladstone', box: [151.1, -23.95, 151.5, -23.7] },
  { name: 'Ras Tanura', box: [50.0, 26.6, 50.35, 26.85] },
  { name: 'Ras Laffan', box: [51.45, 25.85, 51.75, 26.05] },
  { name: 'Nhava Sheva', box: [72.8, 18.85, 73.05, 19.05] },
  { name: 'Rotterdam Maasvlakte', box: [3.9, 51.88, 4.2, 52.02] },
  { name: 'Qingdao', box: [120.1, 35.9, 120.45, 36.15] },
  { name: 'Busan', box: [128.9, 34.95, 129.2, 35.15] },
  { name: 'Yangshan / Hangzhou Bay', box: [121.9, 30.5, 122.3, 30.75] },
  { name: 'Ningbo-Zhoushan', box: [121.95, 29.8, 122.35, 30.05] },
  { name: 'Ponta da Madeira', box: [-44.5, -2.7, -44.25, -2.45] },
];

const COAST_TOLERANCE_KM = 12;
const DEG = Math.PI / 180;

// ── Geometry (mirrors src/lib/mapGlobeOverlays.ts) ──────────────────────────

function angularDistance(a, b) {
  const lat1 = a[1] * DEG;
  const lat2 = b[1] * DEG;
  const h =
    Math.sin((lat2 - lat1) / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(((b[0] - a[0]) * DEG) / 2) ** 2;
  return 2 * Math.asin(Math.min(1, Math.sqrt(h)));
}

function interpolateGreatCircle(a, b, t) {
  const d = angularDistance(a, b);
  if (d < 1e-9) return [a[0], a[1]];
  const sinD = Math.sin(d);
  const A = Math.sin((1 - t) * d) / sinD;
  const B = Math.sin(t * d) / sinD;
  const [lon1, lat1] = [a[0] * DEG, a[1] * DEG];
  const [lon2, lat2] = [b[0] * DEG, b[1] * DEG];
  const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
  const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
  const z = A * Math.sin(lat1) + B * Math.sin(lat2);
  return [Math.atan2(y, x) / DEG, Math.atan2(z, Math.hypot(x, y)) / DEG];
}

function densify(points, stepDegrees = 0.25) {
  const out = [[points[0][0], points[0][1]]];
  for (let i = 1; i < points.length; i++) {
    const from = points[i - 1];
    const to = points[i];
    const steps = Math.max(1, Math.ceil(angularDistance(from, to) / (stepDegrees * DEG)));
    for (let s = 1; s <= steps; s++) out.push(interpolateGreatCircle(from, to, s / steps));
  }
  return out;
}

// ── Land mask ───────────────────────────────────────────────────────────────

/** Rings with a bounding box, so a point test skips 99% of the 883 land polygons. */
const rings = [];
for (const feature of land.features) {
  const polygons =
    feature.geometry.type === 'Polygon'
      ? [feature.geometry.coordinates]
      : feature.geometry.coordinates;
  for (const polygon of polygons) {
    for (const [index, ring] of polygon.entries()) {
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      for (const [x, y] of ring) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
      rings.push({ ring, hole: index > 0, minX, minY, maxX, maxY });
    }
  }
}

function inRing(point, ring) {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function onLand(point) {
  let hit = false;
  for (const entry of rings) {
    if (
      point[0] < entry.minX ||
      point[0] > entry.maxX ||
      point[1] < entry.minY ||
      point[1] > entry.maxY
    ) {
      continue;
    }
    if (!inRing(point, entry.ring)) continue;
    if (entry.hole) return false; // inland sea / lake carved out of a landmass
    hit = true;
  }
  return hit;
}

/** Kilometres from a point to the nearest land-ring vertex — a cheap "how far inland" proxy. */
function kmToCoast(point) {
  let best = Infinity;
  const pad = 1.5;
  for (const entry of rings) {
    if (
      point[0] < entry.minX - pad ||
      point[0] > entry.maxX + pad ||
      point[1] < entry.minY - pad ||
      point[1] > entry.maxY + pad
    ) {
      continue;
    }
    for (const vertex of entry.ring) {
      const d = angularDistance(point, vertex) * 6371;
      if (d < best) best = d;
    }
  }
  return best;
}

function inException(point) {
  return WATERWAY_EXCEPTIONS.find(
    ({ box }) =>
      point[0] >= box[0] && point[0] <= box[2] && point[1] >= box[1] && point[1] <= box[3],
  );
}

// ── Checks ──────────────────────────────────────────────────────────────────

let failures = 0;
const note = (message) => {
  console.log(message);
};

note(`Checking ${TRADE_LANES.length} lanes, ${TRADE_PORTS.length} ports, ${TRADE_CHOKEPOINTS.length} chokepoints\n`);

for (const lane of TRADE_LANES) {
  const from = TRADE_PORT_BY_CODE[lane.fromPort];
  const to = TRADE_PORT_BY_CODE[lane.toPort];
  const problems = [];

  if (!from) problems.push(`unknown fromPort ${lane.fromPort}`);
  if (!to) problems.push(`unknown toPort ${lane.toPort}`);
  for (const id of lane.chokepoints) {
    if (!TRADE_CHOKEPOINTS.some((c) => c.id === id)) problems.push(`unknown chokepoint ${id}`);
  }

  const first = lane.waypoints[0];
  const last = lane.waypoints[lane.waypoints.length - 1];
  if (from && (first[0] !== from.coordinate[0] || first[1] !== from.coordinate[1])) {
    problems.push(`starts at ${first} but ${from.code} is at ${from.coordinate}`);
  }
  if (to && (last[0] !== to.coordinate[0] || last[1] !== to.coordinate[1])) {
    problems.push(`ends at ${last} but ${to.code} is at ${to.coordinate}`);
  }

  // A waypoint chain that doubles back reads on the globe as a route sailing backwards.
  for (let i = 2; i < lane.waypoints.length; i++) {
    const a = lane.waypoints[i - 2];
    const b = lane.waypoints[i - 1];
    const c = lane.waypoints[i];
    const back = angularDistance(a, c) < angularDistance(a, b) * 0.5;
    if (back && angularDistance(b, c) * 6371 > 200) {
      problems.push(`doubles back near ${b} → ${c}`);
    }
  }

  const dense = densify(lane.waypoints);
  const crossings = [];
  for (const point of dense) {
    if (!onLand(point)) continue;
    const exception = inException(point);
    if (exception) continue;
    if (kmToCoast(point) <= COAST_TOLERANCE_KM) continue;
    crossings.push(point);
  }

  if (crossings.length) {
    // Cluster consecutive offenders so one severed isthmus reports as one problem.
    const clusters = [];
    for (const point of crossings) {
      const previous = clusters[clusters.length - 1];
      if (previous && angularDistance(previous.at(-1), point) * 6371 < 200) previous.push(point);
      else clusters.push([point]);
    }
    for (const cluster of clusters) {
      const mid = cluster[Math.floor(cluster.length / 2)];
      problems.push(
        `crosses land near [${mid[0].toFixed(2)}, ${mid[1].toFixed(2)}] (${cluster.length} pts)`,
      );
    }
  }

  if (problems.length) {
    failures += problems.length;
    note(`FAIL  ${lane.id}`);
    for (const problem of problems) note(`        ${problem}`);
  } else {
    note(`ok    ${lane.id}  ${dense.length} pts`);
  }
}

note('');

for (const port of TRADE_PORTS) {
  if (!onLand(port.coordinate)) continue;
  if (inException(port.coordinate)) continue;
  if (kmToCoast(port.coordinate) <= COAST_TOLERANCE_KM) continue;
  failures++;
  note(`FAIL  port ${port.code} berth is inland at ${port.coordinate}`);
}

for (const chokepoint of TRADE_CHOKEPOINTS) {
  if (!onLand(chokepoint.coordinate)) continue;
  if (inException(chokepoint.coordinate)) continue;
  if (kmToCoast(chokepoint.coordinate) <= COAST_TOLERANCE_KM) continue;
  failures++;
  note(`FAIL  chokepoint ${chokepoint.id} is inland at ${chokepoint.coordinate}`);
}

const unused = TRADE_CHOKEPOINTS.filter(
  (c) => !TRADE_LANES.some((lane) => lane.chokepoints.includes(c.id)),
);
for (const chokepoint of unused) {
  note(`warn  chokepoint ${chokepoint.id} is not referenced by any lane`);
}

note(failures ? `\n${failures} problem(s)` : '\nAll lanes clear of land.');
process.exit(failures ? 1 : 0);
