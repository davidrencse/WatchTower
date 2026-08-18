// @ts-check
/**
 * Regenerates `src/data/warFrontlineGeometry.ts` — the Russo-Ukrainian war control geometry.
 *
 * Source of record is the DeepState public history snapshot
 * (`https://deepstatemap.live/api/history/last`), the same assessment LiveUAMap and
 * militarysummary.com report against day to day. It is CC-BY-style crowd/OSINT geospatial
 * data published as GeoJSON — not a scrape of a proprietary tile API.
 *
 * Pipeline:
 *   1. Pull the snapshot; keep the polygons that fall inside the Ukrainian theatre.
 *   2. Rasterise `occupied` + `ordlo` + `crimea` onto a ~220 m grid and union them, so the two
 *      dozen overlapping source polygons collapse into the handful of shapes a map should show.
 *   3. Trace each connected component's boundary and simplify it (Ramer–Douglas–Peucker).
 *   4. Split every traced boundary into *contact line* and *not contact line*: a boundary that
 *      runs along Ukraine's own outline is an international border or a coast, everything else
 *      is the line of contact. The longest surviving runs become the frontline segments.
 *   5. Simplify DeepState's `unknown status` polygons into the contested gray zone.
 *   6. Re-derive which side each named settlement sits on by point-in-polygon.
 *
 * Run: `npm run update:frontline`
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SNAPSHOT_URL = 'https://deepstatemap.live/api/history/last';
const OUTPUT = resolve(ROOT, 'src/data/warFrontlineGeometry.ts');
/**
 * geoBoundaries ADM0 for Ukraine (OSM-derived, ~29k vertices, ODbL). Step 4 needs a border good
 * to well under a kilometre: the bundled `public/geo/country-shapes.json` ring is 783 vertices
 * and strays up to 5 km through Luhansk, which is enough to make a stretch of international
 * border read as contact line. Generate-time only — nothing fetched here reaches the bundle.
 */
const UKRAINE_OUTLINE_API = 'https://www.geoboundaries.org/api/current/gbOpen/UKR/ADM0/';
/**
 * Natural Earth 1:10m coastline. The geoBoundaries ring draws the Sea of Azov as Ukrainian
 * internal water, so its "boundary" there is a straight line across open sea and the real
 * Berdiansk–Mariupol shore is nowhere near it. A dedicated coastline covers what it misses.
 */
const COASTLINE_URL =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_coastline.geojson';

/** Raster cell size in degrees. 0.002° ≈ 222 m of latitude — finer than the source's own detail. */
const CELL = 0.002;
/** Theatre bounds: `[west, south, east, north]`. */
const BOUNDS = [30.8, 44.2, 40.6, 52.6];
/** RDP tolerance for the traced control outlines, in degrees (~450 m). */
const RING_TOLERANCE = 0.004;
/** RDP tolerance for the gray-zone pockets — they are smaller, so they get a finer budget. */
const POCKET_TOLERANCE = 0.003;
/** A boundary vertex this close to Ukraine's admin outline is international border, not front. */
const BORDER_MARGIN_KM = 1.6;
/** Same idea for the shoreline, with more slack: coastlines disagree between sources by ~2 km. */
const COAST_MARGIN_KM = 3;
/** Control components smaller than this are raster noise, not territory. */
const MIN_ZONE_AREA_KM2 = 40;
/** Gray-zone pockets smaller than this are dropped — they cannot be read at globe zoom anyway. */
const MIN_POCKET_AREA_KM2 = 6;
/** Frontline runs shorter than this are stubs where the line meets the border. */
const MIN_SEGMENT_KM = 12;
/** A run must be at least this fraction of its shape's longest run to count as contact line. */
const DOMINANT_RUN_RATIO = 0.4;

/**
 * Seeds used to name the traced components and frontline segments. Each is a real settlement;
 * the nearest seed to a shape's centroid (or a segment's midpoint) supplies its label.
 */
const COMPONENT_SEEDS = [
  { name: 'Occupied mainland', at: [37.0, 48.2] },
  { name: 'Vovchansk salient', at: [36.94, 50.29] },
  { name: 'Lyptsi salient', at: [36.45, 50.28] },
  { name: 'Velykyi Burluk salient', at: [37.72, 50.1] },
  { name: 'Krasnopillia border pocket', at: [35.0, 51.15] },
  { name: 'Vilcha border pocket', at: [35.42, 50.75] },
  { name: 'Kinburn Spit', at: [31.8, 46.3] },
];

const SEGMENT_SEEDS = [
  { name: 'Vovchansk', at: [36.94, 50.29] },
  { name: 'Lyptsi', at: [36.45, 50.28] },
  { name: 'Velykyi Burluk', at: [37.72, 50.1] },
  { name: 'Kupiansk', at: [37.62, 49.71] },
  { name: 'Borova', at: [37.62, 49.38] },
  { name: 'Lyman', at: [37.8, 48.99] },
  { name: 'Siversk', at: [38.1, 48.87] },
  { name: 'Kostiantynivka', at: [37.72, 48.53] },
  { name: 'Pokrovsk', at: [37.17, 48.28] },
  { name: 'Velyka Novosilka', at: [36.85, 47.81] },
  { name: 'Huliaipole', at: [36.26, 47.66] },
  { name: 'Orikhiv', at: [35.79, 47.57] },
  { name: 'Dnipro line', at: [33.6, 47.0] },
  { name: 'Kherson', at: [32.62, 46.64] },
  { name: 'Krasnopillia', at: [35.0, 51.15] },
  { name: 'Vilcha', at: [35.42, 50.75] },
];

/** Named places the globe labels. Coordinates are real; the side is recomputed from the snapshot. */
const SETTLEMENTS = [
  { name: 'Kharkiv', at: [36.23, 49.99], priority: 1 },
  { name: 'Zaporizhzhia', at: [35.14, 47.84], priority: 1 },
  { name: 'Kherson', at: [32.62, 46.64], priority: 1 },
  { name: 'Donetsk', at: [37.8, 48.0], priority: 1 },
  { name: 'Luhansk', at: [39.3, 48.57], priority: 1 },
  { name: 'Mariupol', at: [37.55, 47.1], priority: 1 },
  { name: 'Melitopol', at: [35.37, 46.84], priority: 1 },
  { name: 'Simferopol', at: [34.1, 44.95], priority: 1 },
  { name: 'Sevastopol', at: [33.53, 44.62], priority: 1 },
  { name: 'Sumy', at: [34.8, 50.91], priority: 1 },
  { name: 'Dnipro', at: [35.05, 48.47], priority: 1 },
  { name: 'Kramatorsk', at: [37.55, 48.73], priority: 2 },
  { name: 'Sloviansk', at: [37.6, 48.85], priority: 2 },
  { name: 'Druzhkivka', at: [37.53, 48.62], priority: 2 },
  { name: 'Kostiantynivka', at: [37.72, 48.53], priority: 2 },
  { name: 'Pokrovsk', at: [37.17, 48.28], priority: 2 },
  { name: 'Myrnohrad', at: [37.27, 48.31], priority: 2 },
  { name: 'Dobropillia', at: [37.08, 48.47], priority: 2 },
  { name: 'Kurakhove', at: [37.28, 47.99], priority: 2 },
  { name: 'Lyman', at: [37.8, 48.99], priority: 2 },
  { name: 'Izyum', at: [37.25, 49.21], priority: 2 },
  { name: 'Kupiansk', at: [37.62, 49.71], priority: 2 },
  { name: 'Huliaipole', at: [36.26, 47.66], priority: 2 },
  { name: 'Orikhiv', at: [35.79, 47.57], priority: 2 },
  { name: 'Nikopol', at: [34.4, 47.57], priority: 2 },
  { name: 'Bakhmut', at: [38.0, 48.6], priority: 2 },
  { name: 'Horlivka', at: [38.05, 48.33], priority: 2 },
  { name: 'Berdiansk', at: [36.79, 46.76], priority: 2 },
  { name: 'Nova Kakhovka', at: [33.37, 46.75], priority: 2 },
  { name: 'Kerch', at: [36.47, 45.36], priority: 2 },
  { name: 'Vovchansk', at: [36.94, 50.29], priority: 3 },
  { name: 'Velykyi Burluk', at: [37.37, 50.06], priority: 3 },
  { name: 'Borova', at: [37.62, 49.38], priority: 3 },
  { name: 'Svatove', at: [38.15, 49.41], priority: 3 },
  { name: 'Kreminna', at: [38.22, 49.05], priority: 3 },
  { name: 'Siverskodonetsk', at: [38.49, 48.95], priority: 3 },
  { name: 'Siversk', at: [38.1, 48.87], priority: 3 },
  { name: 'Chasiv Yar', at: [37.83, 48.59], priority: 3 },
  { name: 'Toretsk', at: [37.85, 48.4], priority: 3 },
  { name: 'Yenakiieve', at: [38.21, 48.23], priority: 3 },
  { name: 'Vuhledar', at: [37.25, 47.78], priority: 3 },
  { name: 'Velyka Novosilka', at: [36.85, 47.81], priority: 3 },
  { name: 'Pokrovske', at: [36.24, 48.07], priority: 3 },
  { name: 'Polohy', at: [36.25, 47.48], priority: 3 },
  { name: 'Tokmak', at: [35.71, 47.25], priority: 3 },
  { name: 'Enerhodar', at: [34.63, 47.5], priority: 3 },
  { name: 'Henichesk', at: [34.8, 46.17], priority: 3 },
  { name: 'Dzhankoi', at: [34.39, 45.71], priority: 3 },
  { name: 'Yevpatoria', at: [33.37, 45.19], priority: 3 },
  { name: 'Feodosia', at: [35.38, 45.03], priority: 3 },
  { name: 'Yalta', at: [34.17, 44.5], priority: 3 },
];

// ── geometry helpers ─────────────────────────────────────────────────────────

const COLS = Math.round((BOUNDS[2] - BOUNDS[0]) / CELL);
const ROWS = Math.round((BOUNDS[3] - BOUNDS[1]) / CELL);
/** Longitude degrees are this much shorter than latitude degrees at the theatre's mid-latitude. */
const LON_SCALE = Math.cos((((BOUNDS[1] + BOUNDS[3]) / 2) * Math.PI) / 180);
const KM_PER_DEG = 111.32;

const xOf = (lng) => (lng - BOUNDS[0]) / CELL;
const yOf = (lat) => (lat - BOUNDS[1]) / CELL;
const lngOf = (x) => BOUNDS[0] + x * CELL;
const latOf = (y) => BOUNDS[1] + y * CELL;

/** Planar distance in km, with longitude squashed so the result is not stretched east–west. */
function distanceKm(a, b) {
  return Math.hypot((a[0] - b[0]) * LON_SCALE, a[1] - b[1]) * KM_PER_DEG;
}

function pointToSegmentKm(p, a, b) {
  const dx = (b[0] - a[0]) * LON_SCALE;
  const dy = b[1] - a[1];
  const lengthSq = dx * dx + dy * dy;
  const t = lengthSq
    ? Math.max(0, Math.min(1, (((p[0] - a[0]) * LON_SCALE * dx + (p[1] - a[1]) * dy) / lengthSq)))
    : 0;
  return Math.hypot((p[0] - a[0]) * LON_SCALE - t * dx, p[1] - a[1] - t * dy) * KM_PER_DEG;
}

/** Signed area in km², via the shoelace formula with longitudes squashed to equal-area-ish. */
function ringAreaKm2(ring) {
  let sum = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    sum += (ring[j][0] * LON_SCALE) * ring[i][1] - (ring[i][0] * LON_SCALE) * ring[j][1];
  }
  return Math.abs(sum / 2) * KM_PER_DEG * KM_PER_DEG;
}

function pathLengthKm(path) {
  let total = 0;
  for (let i = 1; i < path.length; i += 1) total += distanceKm(path[i - 1], path[i]);
  return total;
}

function pointInRing(point, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > point[1] !== yj > point[1] && point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

/** Ramer–Douglas–Peucker, iterative so a 40k-vertex traced ring cannot blow the stack. */
function simplify(points, tolerance) {
  if (points.length < 3) return points.slice();
  const keep = new Uint8Array(points.length);
  keep[0] = 1;
  keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [first, last] = stack.pop();
    let index = -1;
    let furthest = tolerance;
    for (let i = first + 1; i < last; i += 1) {
      const distance = pointToSegmentKm(points[i], points[first], points[last]) / KM_PER_DEG;
      if (distance > furthest) {
        furthest = distance;
        index = i;
      }
    }
    if (index !== -1) {
      keep[index] = 1;
      stack.push([first, index], [index, last]);
    }
  }
  return points.filter((_, index) => keep[index]);
}

/** RDP on a closed ring: anchored at the two most distant vertices so the split is stable. */
function simplifyRing(ring, tolerance) {
  const open = ring.slice(0, -1);
  if (open.length < 4) return ring;
  let pivot = 0;
  let best = -1;
  for (let i = 1; i < open.length; i += 1) {
    const distance = distanceKm(open[0], open[i]);
    if (distance > best) {
      best = distance;
      pivot = i;
    }
  }
  const head = simplify([...open.slice(0, pivot + 1)], tolerance);
  const tail = simplify([...open.slice(pivot), open[0]], tolerance);
  const merged = [...head.slice(0, -1), ...tail.slice(0, -1)];
  return [...merged, merged[0]];
}

function centroid(ring) {
  let x = 0;
  let y = 0;
  for (const point of ring) {
    x += point[0];
    y += point[1];
  }
  return [x / ring.length, y / ring.length];
}

/** Makes ids unique in place: two pockets by the same town become `Vovchansk` and `Vovchansk 2`. */
function deduplicateIds(items) {
  const seen = new Map();
  for (const item of items) {
    const count = (seen.get(item.id) ?? 0) + 1;
    seen.set(item.id, count);
    if (count > 1) item.id = `${item.id} ${count}`;
  }
  return items;
}

function nearestSeed(point, seeds) {
  let best = seeds[0];
  let bestDistance = Infinity;
  for (const seed of seeds) {
    const distance = distanceKm(point, seed.at);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = seed;
    }
  }
  return best.name;
}

const round = (value) => Math.round(value * 1e4) / 1e4;

// ── rasterisation ────────────────────────────────────────────────────────────

/** Scanline-fills each ring into `mask`, sampling at cell centres. */
function rasterise(rings) {
  const mask = new Uint8Array(COLS * ROWS);
  for (const ring of rings) {
    let minY = Infinity;
    let maxY = -Infinity;
    for (const point of ring) {
      minY = Math.min(minY, point[1]);
      maxY = Math.max(maxY, point[1]);
    }
    const rowStart = Math.max(0, Math.floor(yOf(minY)));
    const rowEnd = Math.min(ROWS - 1, Math.ceil(yOf(maxY)));
    for (let row = rowStart; row <= rowEnd; row += 1) {
      const lat = latOf(row + 0.5);
      /** @type {number[]} */
      const crossings = [];
      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const [xi, yi] = ring[i];
        const [xj, yj] = ring[j];
        if (yi > lat !== yj > lat) crossings.push(xi + ((lat - yi) / (yj - yi)) * (xj - xi));
      }
      crossings.sort((a, b) => a - b);
      for (let k = 0; k + 1 < crossings.length; k += 2) {
        const from = Math.max(0, Math.ceil(xOf(crossings[k]) - 0.5));
        const to = Math.min(COLS - 1, Math.floor(xOf(crossings[k + 1]) - 0.5));
        for (let col = from; col <= to; col += 1) mask[row * COLS + col] = 1;
      }
    }
  }
  return mask;
}

/** Flood-fills the mask into connected components (4-connected). */
function components(mask) {
  const seen = new Uint8Array(mask.length);
  /** @type {number[][]} */
  const found = [];
  const queue = new Int32Array(mask.length);
  for (let start = 0; start < mask.length; start += 1) {
    if (!mask[start] || seen[start]) continue;
    let head = 0;
    let tail = 0;
    queue[tail++] = start;
    seen[start] = 1;
    /** @type {number[]} */
    const cells = [];
    while (head < tail) {
      const cell = queue[head++];
      cells.push(cell);
      const col = cell % COLS;
      const row = (cell - col) / COLS;
      if (col > 0 && mask[cell - 1] && !seen[cell - 1]) (seen[cell - 1] = 1), (queue[tail++] = cell - 1);
      if (col < COLS - 1 && mask[cell + 1] && !seen[cell + 1]) (seen[cell + 1] = 1), (queue[tail++] = cell + 1);
      if (row > 0 && mask[cell - COLS] && !seen[cell - COLS]) (seen[cell - COLS] = 1), (queue[tail++] = cell - COLS);
      if (row < ROWS - 1 && mask[cell + COLS] && !seen[cell + COLS]) (seen[cell + COLS] = 1), (queue[tail++] = cell + COLS);
    }
    found.push(cells);
  }
  return found;
}

/**
 * Traces the outer boundary of a set of filled cells as a closed ring of grid corners.
 *
 * Every filled cell contributes the sides whose neighbour is empty, wound counter-clockwise, so
 * each boundary corner has exactly as many outgoing edges as incoming ones. Chaining them from
 * the top-left cell walks the outline; at a diagonal pinch the turn that keeps hugging the shape
 * is preferred, which keeps the outer ring outer.
 */
function traceOutline(cells) {
  const filled = new Set(cells);
  const has = (col, row) => filled.has(row * COLS + col);
  /** @type {Map<string, string[]>} */
  const edges = new Map();
  const key = (x, y) => `${x},${y}`;
  const addEdge = (ax, ay, bx, by) => {
    const from = key(ax, ay);
    const list = edges.get(from);
    if (list) list.push(key(bx, by));
    else edges.set(from, [key(bx, by)]);
  };
  let startX = Infinity;
  let startY = Infinity;
  for (const cell of cells) {
    const col = cell % COLS;
    const row = (cell - col) / COLS;
    if (!has(col, row - 1)) addEdge(col, row, col + 1, row); // bottom, →
    if (!has(col + 1, row)) addEdge(col + 1, row, col + 1, row + 1); // right, ↑
    if (!has(col, row + 1)) addEdge(col + 1, row + 1, col, row + 1); // top, ←
    if (!has(col - 1, row)) addEdge(col, row + 1, col, row); // left, ↓
    if (row < startY || (row === startY && col < startX)) {
      startY = row;
      startX = col;
    }
  }
  const start = key(startX, startY);
  /** @type {[number, number][]} */
  const ring = [];
  let current = start;
  let previous = null;
  for (let guard = 0; guard < edges.size * 4 + 8; guard += 1) {
    const [cx, cy] = current.split(',').map(Number);
    ring.push([lngOf(cx), latOf(cy)]);
    const options = edges.get(current);
    if (!options || !options.length) break;
    let next = options[0];
    if (options.length > 1 && previous) {
      // Prefer the sharpest right turn relative to how we arrived: hug the shape.
      const [px, py] = previous.split(',').map(Number);
      const inbound = Math.atan2(cy - py, cx - px);
      let bestScore = -Infinity;
      for (const option of options) {
        const [ox, oy] = option.split(',').map(Number);
        let turn = Math.atan2(oy - cy, ox - cx) - inbound;
        while (turn <= -Math.PI) turn += 2 * Math.PI;
        while (turn > Math.PI) turn -= 2 * Math.PI;
        if (-turn > bestScore) {
          bestScore = -turn;
          next = option;
        }
      }
    }
    edges.set(current, options.filter((option) => option !== next));
    previous = current;
    current = next;
    if (current === start) break;
  }
  ring.push(ring[0]);
  return ring;
}

// ── snapshot ─────────────────────────────────────────────────────────────────

const STATUS = {
  occupied: /geoJSON\.status\.occupied/,
  unknown: /geoJSON\.status\.unknown/,
  ordlo: /geoJSON\.territories\.ordlo/,
  crimea: /geoJSON\.territories\.crimea/,
};

function inTheatre(ring) {
  return ring.every(
    (point) =>
      point[0] >= BOUNDS[0] && point[0] <= BOUNDS[2] && point[1] >= BOUNDS[1] && point[1] <= BOUNDS[3],
  );
}

async function loadSnapshot() {
  const response = await fetch(SNAPSHOT_URL, { headers: { 'user-agent': 'WatchTower/1.0' } });
  if (!response.ok) throw new Error(`DeepState snapshot failed: HTTP ${response.status}`);
  const payload = await response.json();
  if (!payload?.map?.features?.length) throw new Error('DeepState snapshot had no features');
  return payload;
}

async function ukraineOutline() {
  const index = await fetch(UKRAINE_OUTLINE_API, { headers: { 'user-agent': 'WatchTower/1.0' } });
  if (!index.ok) throw new Error(`geoBoundaries index failed: HTTP ${index.status}`);
  const { gjDownloadURL } = await index.json();
  if (!gjDownloadURL) throw new Error('geoBoundaries index had no gjDownloadURL');
  const response = await fetch(gjDownloadURL, { headers: { 'user-agent': 'WatchTower/1.0' } });
  if (!response.ok) throw new Error(`Ukraine outline failed: HTTP ${response.status}`);
  const collection = await response.json();
  const rings = collection?.features?.flatMap((feature) =>
    feature.geometry.type === 'MultiPolygon'
      ? feature.geometry.coordinates.flat()
      : feature.geometry.coordinates,
  );
  if (!rings?.length) throw new Error('Ukraine outline had no rings');
  // Only the stretches near the theatre matter, and dropping the rest keeps step 4 cheap. Split
  // rather than filter, so a discarded stretch never leaves a chord shortcutting across Ukraine.
  const near = (point) =>
    point[0] >= BOUNDS[0] - 1 &&
    point[0] <= BOUNDS[2] + 1 &&
    point[1] >= BOUNDS[1] - 1 &&
    point[1] <= BOUNDS[3] + 1;
  /** @type {[number, number][][]} */
  const kept = [];
  for (const ring of rings) {
    /** @type {[number, number][]} */
    let run = [];
    for (const point of ring) {
      if (near(point)) run.push(point);
      else if (run.length > 1) (kept.push(run), (run = []));
      else run = [];
    }
    if (run.length > 1) kept.push(run);
  }
  return kept;
}

async function coastline() {
  const response = await fetch(COASTLINE_URL, { headers: { 'user-agent': 'WatchTower/1.0' } });
  if (!response.ok) throw new Error(`Coastline failed: HTTP ${response.status}`);
  const collection = await response.json();
  const lines = collection.features.flatMap((feature) =>
    feature.geometry.type === 'MultiLineString'
      ? feature.geometry.coordinates
      : [feature.geometry.coordinates],
  );
  return lines.filter((line) =>
    line.some(
      (point) =>
        point[0] >= BOUNDS[0] - 1 &&
        point[0] <= BOUNDS[2] + 1 &&
        point[1] >= BOUNDS[1] - 1 &&
        point[1] <= BOUNDS[3] + 1,
    ),
  );
}

// ── main ─────────────────────────────────────────────────────────────────────

const snapshot = await loadSnapshot();
const polygons = snapshot.map.features.filter((feature) => feature.geometry?.type === 'Polygon');

/** @type {Record<'occupied'|'unknown'|'crimea', [number, number][][]>} */
const groups = { occupied: [], unknown: [], crimea: [] };
for (const feature of polygons) {
  const name = String(feature.properties?.name ?? '');
  const ring = feature.geometry.coordinates[0];
  if (!inTheatre(ring)) continue;
  if (STATUS.crimea.test(name)) groups.crimea.push(ring);
  else if (STATUS.occupied.test(name) || STATUS.ordlo.test(name)) groups.occupied.push(ring);
  else if (STATUS.unknown.test(name)) groups.unknown.push(ring);
}

const controlledRings = [...groups.occupied, ...groups.crimea];
const controlMask = rasterise(controlledRings);
const grayMask = rasterise(groups.unknown);

// Wherever a control boundary sits on Ukraine's admin outline or on the shore, that boundary is
// an international border or a coastline rather than a line of contact.
const [borderRefs, coastRefs] = await Promise.all([ukraineOutline(), coastline()]);

const zones = [];
const segments = [];

for (const cells of components(controlMask)) {
  if (cells.length * CELL * CELL * LON_SCALE * KM_PER_DEG * KM_PER_DEG < MIN_ZONE_AREA_KM2) continue;
  const ring = simplifyRing(traceOutline(cells), RING_TOLERANCE);
  const areaKm2 = ringAreaKm2(ring);
  if (areaKm2 < MIN_ZONE_AREA_KM2) continue;
  zones.push({
    id: nearestSeed(centroid(ring), COMPONENT_SEEDS),
    areaKm2,
    ring,
  });

  // Walk the ring and keep the stretches that are not border or coast.
  const isFront = ring
    .slice(0, -1)
    .map(
      (point) =>
        borderRefs.every((ref) => nearestRefKm(point, ref) > BORDER_MARGIN_KM) &&
        coastRefs.every((ref) => nearestRefKm(point, ref) > COAST_MARGIN_KM),
    );
  // Shoreline is the awkward case: the Syvash, the Azov spits and Crimea's coast are all finer
  // than any national outline resolves, so short stretches of them survive the border test. They
  // are always an order of magnitude shorter than the contact line on the same shape, so keep
  // each shape's dominant run and anything comparable to it, and drop the residue.
  const runs = contiguousRuns(isFront)
    .map((run) => run.map((index) => ring[index]))
    .map((path) => ({ path, lengthKm: pathLengthKm(path) }))
    .sort((a, b) => b.lengthKm - a.lengthKm);
  const dominant = runs[0]?.lengthKm ?? 0;
  for (const { path, lengthKm } of runs) {
    if (lengthKm < MIN_SEGMENT_KM || lengthKm < dominant * DOMINANT_RUN_RATIO) continue;
    // One run spans the whole Kharkiv-to-Kherson front; the rest are arcs around border pockets.
    const id =
      lengthKm > 300
        ? 'Main line of contact'
        : nearestSeed(path[Math.floor(path.length / 2)], SEGMENT_SEEDS);
    segments.push({ id, path });
  }
}
zones.sort((a, b) => b.areaKm2 - a.areaKm2);
segments.sort((a, b) => pathLengthKm(b.path) - pathLengthKm(a.path));
deduplicateIds(zones);
deduplicateIds(segments);

const pockets = [];
for (const cells of components(grayMask)) {
  const ring = simplifyRing(traceOutline(cells), POCKET_TOLERANCE);
  const areaKm2 = ringAreaKm2(ring);
  if (areaKm2 < MIN_POCKET_AREA_KM2) continue;
  pockets.push({ id: nearestSeed(centroid(ring), SEGMENT_SEEDS), areaKm2, ring });
}
pockets.sort((a, b) => b.areaKm2 - a.areaKm2);
deduplicateIds(pockets);

const settlements = SETTLEMENTS.map((settlement) => {
  const point = settlement.at;
  const occupied = controlledRings.some((ring) => pointInRing(point, ring));
  const gray = groups.unknown.some((ring) => pointInRing(point, ring));
  const side = gray ? 'contested' : occupied ? 'russian' : 'ukrainian';
  return { ...settlement, side };
});

/** Distance in km from a point to the nearest segment of a reference outline. */
function nearestRefKm(point, ref) {
  let best = Infinity;
  for (let i = 1; i < ref.length; i += 1) {
    // Cheap reject before the exact segment distance.
    if (Math.abs(ref[i][1] - point[1]) > 0.06 && Math.abs(ref[i - 1][1] - point[1]) > 0.06) {
      if ((ref[i][1] - point[1]) * (ref[i - 1][1] - point[1]) > 0) continue;
    }
    const distance = pointToSegmentKm(point, ref[i - 1], ref[i]);
    if (distance < best) best = distance;
    if (best < 0.05) break;
  }
  return best;
}

/** Index runs of `true`, treating the array as a closed ring so a run may wrap the seam. */
function contiguousRuns(flags) {
  const size = flags.length;
  if (flags.every(Boolean)) return [flags.map((_, index) => index)];
  let seam = flags.findIndex((flag, index) => flag && !flags[(index - 1 + size) % size]);
  if (seam === -1) return [];
  /** @type {number[][]} */
  const runs = [];
  /** @type {number[]} */
  let run = [];
  for (let step = 0; step <= size; step += 1) {
    const index = (seam + step) % size;
    if (step < size && flags[index]) run.push(index);
    else if (run.length) {
      runs.push(run);
      run = [];
    }
  }
  return runs;
}

// ── emit ─────────────────────────────────────────────────────────────────────

const coords = (path) =>
  path.map(([lng, lat]) => `[${round(lng)}, ${round(lat)}]`).join(', ');

function block(path, indent) {
  const pad = ' '.repeat(indent);
  const lines = [];
  for (let i = 0; i < path.length; i += 6) {
    lines.push(pad + coords(path.slice(i, i + 6)) + ',');
  }
  return lines.join('\n');
}

const vertexCount =
  zones.reduce((sum, zone) => sum + zone.ring.length, 0) +
  segments.reduce((sum, segment) => sum + segment.path.length, 0) +
  pockets.reduce((sum, pocket) => sum + pocket.ring.length, 0);

const file = `/**
 * GENERATED FILE — do not hand-edit. Run \`npm run update:frontline\`.
 *
 * Russo-Ukrainian War control geometry, derived from the DeepState public history snapshot
 * (${SNAPSHOT_URL}) — the assessment LiveUAMap and militarysummary.com
 * report against day to day. Overlapping source polygons are unioned on a ${Math.round(CELL * 111320)} m grid,
 * traced, and simplified to ~${Math.round(RING_TOLERANCE * 111)} km; boundary that runs along Ukraine's own outline is
 * classified as international border or coast and dropped from the contact line.
 *
 * Snapshot ${snapshot.id} · captured ${snapshot.datetime} · generated ${new Date().toISOString().slice(0, 10)}.
 * ${vertexCount} vertices across ${zones.length} control zones, ${segments.length} contact-line segments and ${pockets.length} gray-zone pockets.
 */

/** A \`[longitude, latitude]\` pair. */
export type LngLat = readonly [number, number];

export interface FrontlineSnapshotMeta {
  /** DeepState revision id the geometry was traced from. */
  readonly id: number;
  /** Revision timestamp exactly as the source publishes it (\`DD.MM o HH:mm\`, Kyiv time). */
  readonly capturedAt: string;
  /** ISO date this file was regenerated. */
  readonly generatedAt: string;
  readonly sourceUrl: string;
}

export const FRONTLINE_SNAPSHOT: FrontlineSnapshotMeta = {
  id: ${snapshot.id},
  capturedAt: ${JSON.stringify(snapshot.datetime)},
  generatedAt: ${JSON.stringify(new Date().toISOString().slice(0, 10))},
  sourceUrl: ${JSON.stringify(SNAPSHOT_URL)},
};

export interface TracedShape {
  /** Nearest named place to the shape's centroid — a label, not an official designation. */
  readonly id: string;
  /** Approximate enclosed area in km². */
  readonly areaKm2: number;
  readonly ring: readonly LngLat[];
}

export interface TracedSegment {
  readonly id: string;
  readonly lengthKm: number;
  readonly path: readonly LngLat[];
}

/** Russian-controlled territory, largest first. Rings are closed. */
export const CONTROL_RINGS: readonly TracedShape[] = [
${zones
  .map(
    (zone) => `  {
    id: ${JSON.stringify(zone.id)},
    areaKm2: ${Math.round(zone.areaKm2)},
    ring: [
${block(zone.ring, 6)}
    ],
  },`,
  )
  .join('\n')}
];

/** Occupied Crimea, traced separately so it can be shaded as longer-standing occupation. */
export const CRIMEA_RINGS: readonly (readonly LngLat[])[] = [
${groups.crimea
  .map((ring) => `  [\n${block(simplifyRing(ring.slice(), RING_TOLERANCE), 4)}\n  ],`)
  .join('\n')}
];

/** The line of contact, split where it runs onto an international border or a coastline. */
export const CONTACT_SEGMENTS: readonly TracedSegment[] = [
${segments
  .map(
    (segment) => `  {
    id: ${JSON.stringify(segment.id)},
    lengthKm: ${Math.round(pathLengthKm(segment.path))},
    path: [
${block(segment.path, 6)}
    ],
  },`,
  )
  .join('\n')}
];

/** DeepState's \`unknown status\` polygons — ground neither side holds cleanly. */
export const GRAY_ZONE_RINGS: readonly TracedShape[] = [
${pockets
  .map(
    (pocket) => `  {
    id: ${JSON.stringify(pocket.id)},
    areaKm2: ${Math.round(pocket.areaKm2)},
    ring: [
${block(pocket.ring, 6)}
    ],
  },`,
  )
  .join('\n')}
];

export type ControlSide = 'ukrainian' | 'russian' | 'contested';

export interface TracedSettlement {
  readonly name: string;
  readonly coordinate: LngLat;
  readonly side: ControlSide;
  /** 1 = label as soon as the war layer is readable; 3 = only at close zoom. */
  readonly priority: 1 | 2 | 3;
}

/** Named places, with the side re-derived by point-in-polygon against the snapshot. */
export const CONTROL_SETTLEMENTS: readonly TracedSettlement[] = [
${settlements
  .map(
    (settlement) =>
      `  { name: ${JSON.stringify(settlement.name)}, coordinate: [${settlement.at[0]}, ${settlement.at[1]}], side: ${JSON.stringify(settlement.side)}, priority: ${settlement.priority} },`,
  )
  .join('\n')}
];
`;

mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, file);

console.log(`DeepState snapshot ${snapshot.id} (${snapshot.datetime})`);
console.log(`  control zones      ${zones.length} (${zones.map((z) => `${z.id} ${Math.round(z.areaKm2)}km²`).join(', ')})`);
console.log(`  contact segments   ${segments.length}`);
for (const segment of segments) {
  console.log(`     ${segment.id.padEnd(24)} ${Math.round(pathLengthKm(segment.path)).toString().padStart(5)} km  ${segment.path.length} pts`);
}
console.log(`  gray-zone pockets  ${pockets.length}`);
console.log(`  settlements        ${settlements.filter((s) => s.side === 'russian').length} RU / ${settlements.filter((s) => s.side === 'contested').length} contested / ${settlements.filter((s) => s.side === 'ukrainian').length} UA`);
console.log(`  vertices           ${vertexCount}`);
console.log(`→ ${OUTPUT}`);
