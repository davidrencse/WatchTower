/**
 * Sanity-checks the Russo-Ukrainian order of battle in `src/data/warOrderOfBattle.ts`.
 *
 * The realistic failure here is not a bad expression, it is a bad number: a transposed lon/lat
 * or a typo that quietly moves a formation into the sea, into the wrong country, or onto the
 * wrong side of the line of contact — all of which look fine in a diff and wrong on the globe.
 *
 * So each record is checked against three references already in the repo:
 *   • `public/geo/world-land.json` — nothing here is at sea.
 *   • `public/geo/country-shapes.json` — the Ukraine ring, to place a point inside or outside it.
 *   • `CONTROL_RINGS` + `CRIMEA_RINGS` from `warFrontlineGeometry.ts` — the occupied areas of the
 *     dated control snapshot.
 *
 * From those it asserts the one invariant that matters: a **Russian** formation anchor sits in
 * occupied territory or in Russia proper, and a **Ukrainian** one sits in Ukrainian-held ground.
 * Defensive belts are checked the same way, since a belt is built by the side that holds it.
 *
 * Run: node --experimental-strip-types scripts/check-war-oob.mjs
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dir, '..');
const load = (rel) => import(pathToFileURL(resolve(root, rel)).href);

const {
  WAR_FORMATIONS,
  WAR_DEFENSIVE_LINES,
  WAR_MILITARY_SITES,
  WAR_GARRISONS,
  OOB_ASSESSED_AT,
} = await load('src/data/warOrderOfBattle.ts');
const { CONTROL_RINGS, CRIMEA_RINGS } = await load('src/data/warFrontlineGeometry.ts');

const land = JSON.parse(readFileSync(resolve(root, 'public/geo/world-land.json'), 'utf8'));
const shapes = JSON.parse(readFileSync(resolve(root, 'public/geo/country-shapes.json'), 'utf8'));

/** Everything in this dataset belongs to the Ukrainian theatre and its immediate rear areas. */
const THEATRE = { west: 20, south: 43, east: 60, north: 71 };
/**
 * Garrisons are the exception: a home station legitimately sits anywhere in Russia or Ukraine,
 * including Ussuriysk on the Pacific. The box still has to bound *something*, or a transposed
 * pair would sail through, so it is Russia's own extent rather than the theatre's.
 */
const GARRISON_BOX = { west: 19, south: 41, east: 180, north: 78 };

// ── Point in polygon ────────────────────────────────────────────────────────

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

/** `country-shapes.json` stores each ring as a flat [lon, lat, lon, lat, …] array. */
function unflatten(flat) {
  const ring = [];
  for (let i = 0; i < flat.length; i += 2) ring.push([flat[i], flat[i + 1]]);
  return ring;
}

const ukraineRings = (shapes.UKR ?? []).map(unflatten);
const occupiedRings = [
  ...CONTROL_RINGS.map((shape) => shape.ring.map((p) => [p[0], p[1]])),
  ...CRIMEA_RINGS.map((ring) => ring.map((p) => [p[0], p[1]])),
];

const landRings = [];
for (const feature of land.features) {
  const polygons =
    feature.geometry.type === 'Polygon'
      ? [feature.geometry.coordinates]
      : feature.geometry.coordinates;
  for (const polygon of polygons) {
    for (const [index, ring] of polygon.entries()) landRings.push({ ring, hole: index > 0 });
  }
}

function onLand(point) {
  let hit = false;
  for (const { ring, hole } of landRings) {
    if (!inRing(point, ring)) continue;
    if (hole) return false;
    hit = true;
  }
  return hit;
}

const inUkraine = (point) => ukraineRings.some((ring) => inRing(point, ring));
const inOccupied = (point) => occupiedRings.some((ring) => inRing(point, ring));

/** `russian-held` · `ukrainian-held` · `outside-ukraine`. */
function controlAt(point) {
  if (inOccupied(point)) return 'russian-held';
  if (inUkraine(point)) return 'ukrainian-held';
  return 'outside-ukraine';
}

const ALLOWED = {
  RUS: new Set(['russian-held', 'outside-ukraine']),
  UKR: new Set(['ukrainian-held']),
};

// ── Checks ──────────────────────────────────────────────────────────────────

let failures = 0;
const fail = (what, why) => {
  failures++;
  console.log(`FAIL  ${what}\n        ${why}`);
};

function checkPoint(what, side, point, { requireControl, expectWater = false, box = THEATRE }) {
  const [lon, lat] = point;
  if (lon < box.west || lon > box.east || lat < box.south || lat > box.north) {
    fail(what, `[${lon}, ${lat}] is outside the bounding box — transposed lon/lat?`);
    return;
  }
  // A fleet base is an anchorage: its coordinate belongs in the harbour, not on the quay.
  if (!expectWater && !onLand(point)) {
    fail(what, `[${lon}, ${lat}] is at sea`);
    return;
  }
  if (expectWater && onLand(point)) {
    fail(what, `naval base at [${lon}, ${lat}] is inland — expected the harbour water`);
    return;
  }
  if (!requireControl) return;
  const control = controlAt(point);
  if (!ALLOWED[side].has(control)) {
    fail(what, `${side} anchor at [${lon}, ${lat}] falls in ${control}`);
  }
}

const ids = new Set();
const checkId = (what, id) => {
  if (ids.has(id)) fail(what, `duplicate id "${id}"`);
  ids.add(id);
};

const checkSources = (what, sources) => {
  if (!sources?.length) {
    fail(what, 'no source');
    return;
  }
  for (const source of sources) {
    if (!/^https:\/\//.test(source.url ?? '')) fail(what, `source "${source.title}" has no https url`);
  }
};

console.log(`Order of battle assessed ${OOB_ASSESSED_AT}\n`);

for (const formation of WAR_FORMATIONS) {
  const what = `formation ${formation.id}`;
  checkId(what, formation.id);
  checkSources(what, formation.sources);
  // A headquarters is a published address and can legitimately sit anywhere its state controls;
  // it is the *sector* anchors that must land on their own side of the contact line.
  checkPoint(what, formation.side, formation.coordinate, {
    requireControl: formation.precision === 'sector',
  });
}

for (const line of WAR_DEFENSIVE_LINES) {
  const what = `line ${line.id}`;
  checkId(what, line.id);
  checkSources(what, line.sources);
  if (line.path.length < 2) fail(what, 'needs at least two points');
  for (const point of line.path) {
    checkPoint(`${what} @ [${point}]`, line.side, point, { requireControl: true });
  }
}

for (const site of WAR_MILITARY_SITES) {
  const what = `site ${site.id}`;
  checkId(what, site.id);
  checkSources(what, site.sources);
  checkPoint(what, site.side, site.coordinate, {
    requireControl: false,
    expectWater: site.kind === 'naval',
  });
}

// A garrison is a home station, so the control test still applies — a Ukrainian corps is not
// based in occupied territory, and a Russian army is not based in free Ukraine — but the point
// may legitimately be anywhere from Odesa to the Pacific.
for (const garrison of WAR_GARRISONS) {
  const what = `garrison ${garrison.id}`;
  checkId(what, garrison.id);
  checkSources(what, garrison.sources);
  checkPoint(what, garrison.side, garrison.coordinate, {
    requireControl: true,
    box: GARRISON_BOX,
  });
}

const counts = {
  formations: WAR_FORMATIONS.length,
  lines: WAR_DEFENSIVE_LINES.length,
  sites: WAR_MILITARY_SITES.length,
  garrisons: WAR_GARRISONS.length,
};
console.log(
  `${counts.formations} formations · ${counts.lines} defensive lines · ${counts.sites} sites · ${counts.garrisons} garrisons`,
);
console.log(failures ? `\n${failures} problem(s)` : '\nAll records consistent.');
process.exit(failures ? 1 : 0);
