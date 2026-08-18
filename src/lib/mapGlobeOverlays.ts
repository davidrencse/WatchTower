import { MILITARY_BLOC_KEYS, type MilitaryBlocKey } from './militaryBaseIcon';
import {
  STRATEGIC_RADAR_MISSION_META,
  STRATEGIC_RADAR_STATIONS,
} from '../data/strategicRadarStations';
import { AFRICA_MIGRATION_CORRIDORS_BY_ISO } from '../data/africaMigrationCorridors';
import { EU_MIGRATION_CORRIDORS_BY_ISO } from '../data/euMigrationCorridors';
import { EAST_ASIA_MIGRATION_CORRIDORS_BY_ISO } from '../data/eastAsiaMigrationCorridors';
import { EXTRA_MIGRATION_CORRIDORS_BY_ISO } from '../data/extraMigrationCorridors';
import { FRANCE_MIGRATION_CORRIDORS } from '../data/countries/france/franceMigrationCorridors';
import { GERMANY_MIGRATION_CORRIDORS } from '../data/countries/germany/germanyMigrationCorridors';
import type { GlobeMarker } from '../data/globeCountries';
import { INDIA_MIGRATION_CORRIDORS_BY_ISO } from '../data/indiaMigrationCorridors';
import { PAKISTAN_MIGRATION_CORRIDORS_BY_ISO } from '../data/pakistanMigrationCorridors';
import { ITALY_MIGRATION_CORRIDORS } from '../data/countries/italy/italyMigrationCorridors';
import {
  estimateMigrationCorridorFlow,
  formatAnnualMigrationFlow,
  MIGRATION_FLOW_ESTIMATE_YEAR,
} from '../data/migrationFlowEstimates';
import {
  MIGRATION_TARGET_ISOS,
  type MigrationCorridor,
  type MigrationLegMode,
  type MigrationRouteStatus,
  type MigrationTargetIso,
} from '../data/migrationCorridors';
import {
  ENTRY_NODE_BY_ID,
  ENTRY_NODE_KINDS,
  MIGRATION_ENTRY_NODES,
  MIGRATION_MICROEVENTS,
} from '../data/migrationEntryNodes';
import { UK_MIGRATION_CORRIDORS } from '../data/ukMigrationCorridors';
import { GERMANY_MASS_SHOOTING_META } from '../data/germanyMassShootingMeta';
// `../data/worldMicroEvents` is ~515 KB / 87 KB gzip of records — the largest single module on
// the globe. It is loaded via a dynamic import inside `worldMicroEventsGeoJson()` so Rollup keeps
// it out of the MapGlobe boot chunk; the layer only reveals at mid zoom, so the data downloads as
// the camera approaches rather than on mount.
import {
  WAR_CATEGORY_BY_ID,
  WAR_CONTESTED_POCKETS,
  WAR_CONTROL_ZONES,
  WAR_EVENTS,
  WAR_FRONTLINE_SEGMENTS,
  WAR_SETTLEMENTS,
  type WarControlZone,
} from '../data/russoUkraineWar';
import {
  ISRAEL_IRAN_CATEGORY_BY_ID,
  ISRAEL_IRAN_EVENTS,
} from '../data/israelIranWar';
import {
  WAR_DEFENSIVE_LINES,
  WAR_FORMATIONS,
  WAR_GARRISONS,
  WAR_MILITARY_SITES,
  WAR_SIDE_META,
} from '../data/warOrderOfBattle';
import { warSiteIconId, warUnitIconId } from './warUnitIcon';
import { CYBER_CATEGORY_BY_ID, CYBER_EVENTS } from '../data/cyberEvents';
import {
  TRADE_CHOKEPOINTS,
  TRADE_CHOKEPOINT_BY_ID,
  TRADE_COMMODITY_META,
  TRADE_LANES,
  TRADE_PORTS,
  TRADE_PORT_BY_CODE,
} from '../data/maritimeTradeRoutes';
import { EONET_CATEGORY_BY_ID, type EonetEventPoint } from '../data/eonetEvents';
import { OSINT_CATEGORY_BY_ID, type OsintEventPoint } from '../data/osintEvents';
import {
  ANCESTRY_GROUP_META,
  ANCESTRY_OVERLAY_ISOS,
  REGION_ANCESTRY_BY_ISO,
  dominantMinorityGroup,
  minorityShareTotal,
} from '../data/regionAncestryComposition';

const MIGRATION_TARGET_SET = new Set<string>(MIGRATION_TARGET_ISOS);

const REGIONAL_MIGRATION_CORRIDORS_BY_ISO: Record<MigrationTargetIso, readonly MigrationCorridor[]> = {
  ...EU_MIGRATION_CORRIDORS_BY_ISO,
  ...EXTRA_MIGRATION_CORRIDORS_BY_ISO,
  ...EAST_ASIA_MIGRATION_CORRIDORS_BY_ISO,
  DEU: GERMANY_MIGRATION_CORRIDORS,
  FRA: FRANCE_MIGRATION_CORRIDORS,
  GBR: UK_MIGRATION_CORRIDORS,
  ITA: ITALY_MIGRATION_CORRIDORS,
};

/**
 * Africa, India and Pakistan are cross-cutting origins rather than destination regions, so
 * their corridors are curated per origin and appended to whichever destinations they reach.
 */
const ORIGIN_MIGRATION_CORRIDORS = [
  INDIA_MIGRATION_CORRIDORS_BY_ISO,
  PAKISTAN_MIGRATION_CORRIDORS_BY_ISO,
  AFRICA_MIGRATION_CORRIDORS_BY_ISO,
] as const;

const MIGRATION_CORRIDORS_BY_ISO = MIGRATION_TARGET_ISOS.reduce((byIso, iso) => {
  byIso[iso] = [
    ...REGIONAL_MIGRATION_CORRIDORS_BY_ISO[iso],
    ...ORIGIN_MIGRATION_CORRIDORS.flatMap((byOrigin) => byOrigin[iso] ?? []),
  ];
  return byIso;
}, {} as Record<MigrationTargetIso, readonly MigrationCorridor[]>);

const DEG = Math.PI / 180;

type Position = [number, number];

function closeRing(ring: number[]): Position[] {
  const coordinates: Position[] = [];
  for (let index = 0; index < ring.length; index += 2) {
    coordinates.push([ring[index], ring[index + 1]]);
  }
  const first = coordinates[0];
  const last = coordinates[coordinates.length - 1];
  if (first && last && (first[0] !== last[0] || first[1] !== last[1])) {
    coordinates.push(first);
  }
  return coordinates;
}

function flatLine(line: number[]): Position[] {
  const coordinates: Position[] = [];
  for (let index = 0; index < line.length; index += 2) {
    coordinates.push([line[index], line[index + 1]]);
  }
  return coordinates;
}

/** Central angle between two lon/lat points, in radians. */
function angularDistance(a: Position, b: Position): number {
  const lat1 = a[1] * DEG;
  const lat2 = b[1] * DEG;
  const dLat = lat2 - lat1;
  const dLon = (b[0] - a[0]) * DEG;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Great-circle interpolation. Straight lon/lat interpolation bends the wrong way once a leg
 * spans more than a few degrees, which on a globe reads as a route cutting through terrain it
 * never crosses.
 */
function interpolateGreatCircle(a: Position, b: Position, t: number): Position {
  const d = angularDistance(a, b);
  if (d < 1e-9) return [a[0], a[1]];

  const sinD = Math.sin(d);
  const A = Math.sin((1 - t) * d) / sinD;
  const B = Math.sin(t * d) / sinD;

  const lat1 = a[1] * DEG;
  const lon1 = a[0] * DEG;
  const lat2 = b[1] * DEG;
  const lon2 = b[0] * DEG;

  const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
  const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
  const z = A * Math.sin(lat1) + B * Math.sin(lat2);

  return [
    Math.atan2(y, x) / DEG,
    Math.atan2(z, Math.hypot(x, y)) / DEG,
  ];
}

/** Subdivide a polyline along great circles so it curves correctly and reads smoothly. */
function densify(points: readonly Position[], stepDegrees = 1.2): Position[] {
  if (points.length < 2) return points.map((p) => [p[0], p[1]] as Position);

  const out: Position[] = [[points[0][0], points[0][1]]];
  for (let index = 1; index < points.length; index++) {
    const from = points[index - 1];
    const to = points[index];
    const steps = Math.max(1, Math.ceil(angularDistance(from, to) / (stepDegrees * DEG)));
    for (let step = 1; step <= steps; step++) {
      out.push(interpolateGreatCircle(from, to, step / steps));
    }
  }
  return out;
}

/** Shortest signed longitude delta from `from` to `to`, in (-180, 180]. */
function shortestLonDelta(from: number, to: number): number {
  return ((((to - from) % 360) + 540) % 360) - 180;
}

/**
 * Split a densified lon/lat polyline at the antimeridian.
 *
 * Great-circle sampling returns longitudes via `atan2`, so a Pacific leg can step from
 * ~+179° to ~-179°. MapLibre then strokes that as a ~360° chord, which wraps the globe and
 * reads as a ring near the poles. Cutting at ±180 and emitting a MultiLineString keeps the
 * spherical path while preventing the wrap artifact.
 */
function splitAtAntimeridian(points: readonly Position[]): Position[][] {
  if (points.length === 0) return [];
  if (points.length === 1) return [[[points[0][0], points[0][1]]]];

  const parts: Position[][] = [];
  let current: Position[] = [[points[0][0], points[0][1]]];

  for (let index = 1; index < points.length; index++) {
    const prev = current[current.length - 1];
    const next: Position = [points[index][0], points[index][1]];
    const rawDelta = next[0] - prev[0];

    if (Math.abs(rawDelta) <= 180) {
      current.push(next);
      continue;
    }

    const unwrappedNext = prev[0] + shortestLonDelta(prev[0], next[0]);
    const meridian = unwrappedNext > prev[0] ? 180 : -180;
    const span = unwrappedNext - prev[0];
    const t = Math.abs(span) < 1e-12 ? 0.5 : (meridian - prev[0]) / span;
    const lat = prev[1] + t * (next[1] - prev[1]);

    current.push([meridian, lat]);
    parts.push(current);

    const otherMeridian = meridian === 180 ? -180 : 180;
    current = [[otherMeridian, lat], next];
  }

  if (current.length) parts.push(current);
  return parts;
}

/** Densify then antimeridian-split so MapLibre never draws a wrap-around chord. */
function densifiedLineParts(
  points: readonly Position[],
  stepDegrees = 1.2,
): Position[][] {
  return splitAtAntimeridian(densify(points, stepDegrees));
}

function lineGeometry(parts: Position[][]) {
  if (parts.length === 1) {
    return { type: 'LineString' as const, coordinates: parts[0] };
  }
  return { type: 'MultiLineString' as const, coordinates: parts };
}

function lineCollection(lines: number[][]) {
  return {
    type: 'FeatureCollection' as const,
    features: lines.map((line, index) => ({
      type: 'Feature' as const,
      id: index,
      properties: {},
      geometry: lineGeometry(
        // Densifying the baked Natural Earth borders removes the long straight chords that
        // otherwise cut visible corners across a curved globe.
        densifiedLineParts(flatLine(line), 0.8),
      ),
    })),
  };
}

/**
 * Globe geometry is served as static JSON from `/geo/` (see `scripts/bake-geo-json.mjs`)
 * instead of being imported, which keeps ~750 KB of coordinates out of the bundle. Each
 * payload is fetched at most once and the in-flight promise is shared by all callers.
 */
const geoCache = new Map<string, Promise<unknown>>();

function loadGeo<T>(file: string): Promise<T> {
  let pending = geoCache.get(file) as Promise<T> | undefined;
  if (!pending) {
    pending = fetch(`/geo/${file}`).then((response) => {
      if (!response.ok) throw new Error(`Globe geometry ${file} failed: ${response.status}`);
      return response.json() as Promise<T>;
    });
    // Let a failed fetch be retried rather than caching the rejection forever.
    pending.catch(() => geoCache.delete(file));
    geoCache.set(file, pending as Promise<unknown>);
  }
  return pending;
}

/** Global Natural Earth admin-0 borders retained from the original canvas globe. */
export async function worldBordersGeoJson() {
  return lineCollection(await loadGeo<number[][]>('world-borders.json'));
}

export async function disputedBordersGeoJson() {
  return lineCollection(await loadGeo<number[][]>('world-disputed-borders.json'));
}

/** Clickable dossier polygons and their precise Natural Earth country borders. */
export async function countryShapesGeoJson(markers: GlobeMarker[]) {
  const shapes = await loadGeo<Record<string, number[][]>>('country-shapes.json');
  return {
    type: 'FeatureCollection' as const,
    features: markers.flatMap((marker) => {
      const rings = shapes[marker.iso];
      if (!rings) return [];
      return rings.map((ring, ringIndex) => ({
        type: 'Feature' as const,
        id: `${marker.iso}-${ringIndex}`,
        properties: {
          id: marker.id,
          iso: marker.iso,
          label: marker.label,
          status: marker.status,
          migrationTarget: MIGRATION_TARGET_SET.has(marker.iso),
        },
        geometry: {
          type: 'Polygon' as const,
          coordinates: [densify(closeRing(ring), 0.6)],
        },
      }));
    }),
  };
}

/** One admin-1 unit as baked by `scripts/bake-admin1-regions.mjs`. */
type BakedAdmin1Unit = {
  code: string;
  name: string;
  /** Natural Earth `region` — the level `REGION_ANCESTRY_BY_ISO` is keyed on. */
  region: string;
  a: [number, number];
  r: number[][];
};

/**
 * Per-region ancestry choropleth for the countries in {@link ANCESTRY_OVERLAY_ISOS}.
 *
 * Units are drawn at Natural Earth admin-1 granularity (Länder / départements / province)
 * but coloured from region-level estimates, so France and Italy keep their fine internal
 * outlines without needing a polygon union.
 *
 * Colour is the region's largest **non-European** group — European is the majority nearly
 * everywhere, so shading by it would flatten the map to one tone. Fill strength follows the
 * total non-European share. Both are denormalised into feature properties so paint stays a
 * plain `['get', …]` lookup and no per-frame JS runs.
 */
export async function regionAncestryGeoJson() {
  // With every country switched off there is nothing to colour, so skip the ~780 KB
  // admin-1 geometry download rather than fetching it to produce an empty collection.
  if (ANCESTRY_OVERLAY_ISOS.length === 0) {
    return { type: 'FeatureCollection' as const, features: [] };
  }

  const baked = await loadGeo<Record<string, BakedAdmin1Unit[]>>('admin1-regions.json');
  return {
    type: 'FeatureCollection' as const,
    features: ANCESTRY_OVERLAY_ISOS.flatMap((iso) => {
      const units = baked[iso];
      const regions = REGION_ANCESTRY_BY_ISO[iso];
      if (!units || !regions) return [];

      return units.flatMap((unit) => {
        const composition = regions[unit.region];
        if (!composition) return [];

        const group = dominantMinorityGroup(composition.shares);
        const minorityShare = minorityShareTotal(composition.shares);

        return unit.r.map((ring, ringIndex) => ({
          type: 'Feature' as const,
          id: `${iso}-${unit.code ?? unit.name}-${ringIndex}`,
          properties: {
            iso,
            code: unit.code,
            unit: unit.name,
            region: unit.region,
            label: composition.label,
            group,
            groupLabel: ANCESTRY_GROUP_META[group].label,
            color: ANCESTRY_GROUP_META[group].color,
            minorityShare,
            europeanShare: composition.shares.european,
            foreignOriginShare: composition.foreignOriginShare,
          },
          geometry: {
            type: 'Polygon' as const,
            coordinates: [densify(closeRing(ring), 0.35)],
          },
        }));
      });
    }),
  };
}

/** Every researched migration leg, grouped by destination and transport mode. */
export function migrationCorridorsGeoJson() {
  return {
    type: 'FeatureCollection' as const,
    features: MIGRATION_TARGET_ISOS.flatMap((targetIso) => {
      const destinationCorridors = MIGRATION_CORRIDORS_BY_ISO[targetIso];
      return destinationCorridors.flatMap((corridor) => {
        const drawableLegs = corridor.legs.filter((leg) => leg.waypoints.length >= 2);
        const longestLeg = drawableLegs.reduce(
          (longest, leg, index) =>
            leg.waypoints.length > drawableLegs[longest]?.waypoints.length ? index : longest,
          0,
        );
        const estimate = estimateMigrationCorridorFlow(targetIso, corridor, destinationCorridors);
        return drawableLegs.map((leg, legIndex) => ({
            type: 'Feature' as const,
            id: `${targetIso}-${corridor.id}-${legIndex}`,
            properties: {
              targetIso,
              corridorId: corridor.id,
              label: corridor.label,
              shortRouteName: estimate.shortRouteName,
              status: corridor.status,
              mode: leg.mode,
              labelLeg: legIndex === longestLeg,
              annualEstimate: estimate.annualPeople,
              annualEstimateLabel: formatAnnualMigrationFlow(estimate.annualPeople),
              annualEstimateRange: `${estimate.lowerBound.toLocaleString('en-US')}–${estimate.upperBound.toLocaleString('en-US')} people/year`,
              estimateYear: MIGRATION_FLOW_ESTIMATE_YEAR,
              estimateMethod: estimate.method,
              estimateSourceOrg: estimate.sourceOrganization,
              estimateSourceTitle: estimate.sourceTitle,
              sourceUrl: estimate.sourceUrl,
            },
            geometry: lineGeometry(
              densifiedLineParts(
                leg.waypoints.map(([lng, lat]) => [lng, lat] as Position),
              ),
            ),
          }));
      });
    }),
  };
}

/**
 * Reported formations on both sides, anchored to the axis each is said to hold.
 *
 * `precision` rides on the feature so the hover card can print the caveat next to the name — a
 * sector anchor must never be readable off the map as a unit location.
 */
export function warFormationsGeoJson() {
  return {
    type: 'FeatureCollection' as const,
    features: WAR_FORMATIONS.map((formation) => ({
      type: 'Feature' as const,
      id: formation.id,
      properties: {
        formationId: formation.id,
        side: formation.side,
        sideLabel: WAR_SIDE_META[formation.side].label,
        color: WAR_SIDE_META[formation.side].color,
        echelon: formation.echelon,
        icon: warUnitIconId(formation.side, formation.echelon),
        name: formation.name,
        code: formation.code,
        sector: formation.sector,
        commander: formation.commander ?? '',
        subordinates: formation.subordinates.join(' · '),
        precision: formation.precision,
        precisionLabel:
          formation.precision === 'sector'
            ? 'Reported sector — not a unit position'
            : 'Published headquarters location',
        note: formation.note,
        sourceOrg: formation.sources[0]?.organization ?? '',
        sourceUrl: formation.sources[0]?.url ?? '',
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [...formation.coordinate] as Position,
      },
    })),
  };
}

/** Fortification belts, drawn schematically between the settlements reporting names. */
export function warDefensiveLinesGeoJson() {
  return {
    type: 'FeatureCollection' as const,
    features: WAR_DEFENSIVE_LINES.map((line) => ({
      type: 'Feature' as const,
      id: line.id,
      properties: {
        lineId: line.id,
        side: line.side,
        sideLabel: WAR_SIDE_META[line.side].label,
        color: WAR_SIDE_META[line.side].color,
        name: line.name,
        status: line.status,
        note: line.note,
        sourceOrg: line.sources[0]?.organization ?? '',
        sourceUrl: line.sources[0]?.url ?? '',
      },
      geometry: lineGeometry(
        densifiedLineParts(
          line.path.map(([lng, lat]) => [lng, lat] as Position),
          0.2,
        ),
      ),
    })),
  };
}

/** Airfields, fleet bases and the two general staffs — long-published fixed infrastructure. */
export function warMilitarySitesGeoJson() {
  return {
    type: 'FeatureCollection' as const,
    features: WAR_MILITARY_SITES.map((site) => ({
      type: 'Feature' as const,
      id: site.id,
      properties: {
        siteId: site.id,
        side: site.side,
        sideLabel: WAR_SIDE_META[site.side].label,
        color: WAR_SIDE_META[site.side].color,
        kind: site.kind,
        kindLabel:
          site.kind === 'airbase'
            ? 'Air base'
            : site.kind === 'naval'
              ? 'Naval base'
              : 'Headquarters',
        icon: warSiteIconId(site.side, site.kind),
        name: site.name,
        place: site.place,
        note: site.note,
        sourceOrg: site.sources[0]?.organization ?? '',
        sourceUrl: site.sources[0]?.url ?? '',
      },
      geometry: { type: 'Point' as const, coordinates: [...site.coordinate] as Position },
    })),
  };
}

/**
 * Home stations. Separate from the fixed-site layer because these are administrative basing
 * facts, not theatre infrastructure — and because half of them are thousands of kilometres from
 * Ukraine, so they need their own zoom band rather than appearing with the Donbas sites.
 */
export function warGarrisonsGeoJson() {
  return {
    type: 'FeatureCollection' as const,
    features: WAR_GARRISONS.map((garrison) => ({
      type: 'Feature' as const,
      id: garrison.id,
      properties: {
        garrisonId: garrison.id,
        side: garrison.side,
        sideLabel: WAR_SIDE_META[garrison.side].label,
        color: WAR_SIDE_META[garrison.side].color,
        icon: warSiteIconId(garrison.side, 'garrison'),
        formation: garrison.formation,
        code: garrison.code,
        place: garrison.place,
        committedTo: garrison.committedTo ?? '',
        note: garrison.note,
        sourceOrg: garrison.sources[0]?.organization ?? '',
        sourceUrl: garrison.sources[0]?.url ?? '',
      },
      geometry: { type: 'Point' as const, coordinates: [...garrison.coordinate] as Position },
    })),
  };
}

/** Chokepoints read as one alert hue: they constrain every cargo family, not just one. */
export const TRADE_CHOKEPOINT_COLOR = '#ff8f5e';
/** Berths stay neutral so the lane colour leaving them is what carries the meaning. */
export const TRADE_PORT_COLOR = '#dbe4ec';

/**
 * Major seaborne trade lanes, one feature per lane.
 *
 * Commodity colour is denormalised onto the feature so the paint expression is a plain
 * `['get','color']` — the same trick every other point layer here uses to keep per-frame JS out
 * of the render loop. Lane geometry is verified sea-only by `scripts/check-trade-routes.mjs`.
 */
export function tradeRoutesGeoJson() {
  return {
    type: 'FeatureCollection' as const,
    features: TRADE_LANES.map((lane) => {
      const from = TRADE_PORT_BY_CODE[lane.fromPort];
      const to = TRADE_PORT_BY_CODE[lane.toPort];
      return {
        type: 'Feature' as const,
        id: lane.id,
        properties: {
          laneId: lane.id,
          label: lane.label,
          commodity: lane.commodity,
          commodityLabel: TRADE_COMMODITY_META[lane.commodity].label,
          color: TRADE_COMMODITY_META[lane.commodity].color,
          status: lane.status,
          fromName: from?.name ?? lane.fromPort,
          fromCountry: from?.country ?? '',
          toName: to?.name ?? lane.toPort,
          toCountry: to?.country ?? '',
          distanceNm: lane.distanceNm,
          volume: lane.volume,
          note: lane.note,
          chokepoints: lane.chokepoints
            .map((id) => TRADE_CHOKEPOINT_BY_ID[id]?.name ?? id)
            .join(' · '),
          sourceOrg: lane.sources[0]?.organization ?? '',
          sourceUrl: lane.sources[0]?.url ?? '',
        },
        geometry: lineGeometry(
          densifiedLineParts(
            lane.waypoints.map(([lng, lat]) => [lng, lat] as Position),
            0.6,
          ),
        ),
      };
    }),
  };
}

/** Straits and canals every lane above has to thread, with their transit volumes. */
export function tradeChokepointsGeoJson() {
  return {
    type: 'FeatureCollection' as const,
    features: TRADE_CHOKEPOINTS.map((point) => ({
      type: 'Feature' as const,
      id: point.id,
      properties: {
        chokepointId: point.id,
        code: point.code,
        name: point.name,
        volume: point.volume,
        note: point.note,
        color: TRADE_CHOKEPOINT_COLOR,
        laneCount: TRADE_LANES.filter((lane) => lane.chokepoints.includes(point.id)).length,
        sourceOrg: point.sources[0]?.organization ?? '',
        sourceUrl: point.sources[0]?.url ?? '',
      },
      geometry: { type: 'Point' as const, coordinates: [...point.coordinate] as Position },
    })),
  };
}

/** The berths each lane runs between — one feature per port, deduplicated across lanes. */
export function tradePortsGeoJson() {
  return {
    type: 'FeatureCollection' as const,
    features: TRADE_PORTS.map((port) => {
      const lanes = TRADE_LANES.filter(
        (lane) => lane.fromPort === port.code || lane.toPort === port.code,
      );
      return {
        type: 'Feature' as const,
        id: port.code,
        properties: {
          portCode: port.code,
          name: port.name,
          country: port.country,
          iso3: port.iso3,
          note: port.note,
          // A port that anchors several lanes is a hub; the layer scales its dot by this.
          laneCount: lanes.length,
          commodities: [...new Set(lanes.map((lane) => lane.commodity))].join(','),
          color: TRADE_PORT_COLOR,
        },
        geometry: { type: 'Point' as const, coordinates: [...port.coordinate] as Position },
      };
    }),
  };
}

/**
 * Named departure cities, curated transit hubs (the real ports and airports each corridor
 * routes through), and the arrival port / airport of entry. These are the researched labels
 * carried on every corridor record — not derived guesses.
 */
export function migrationLabelsGeoJson() {
  const features: Array<{
    type: 'Feature';
    id: string;
    properties: Record<string, string | number>;
    geometry: { type: 'Point'; coordinates: Position };
  }> = [];

  for (const targetIso of MIGRATION_TARGET_ISOS) {
    for (const corridor of MIGRATION_CORRIDORS_BY_ISO[targetIso]) {
      const legs = corridor.legs.filter((leg) => leg.waypoints.length >= 2);
      if (!legs.length) continue;

      const firstWaypoint = legs[0].waypoints[0];
      const lastLeg = legs[legs.length - 1];
      const lastWaypoint = lastLeg.waypoints[lastLeg.waypoints.length - 1];
      // Transit hubs lean sea/air when the corridor carries those legs; otherwise land.
      const transitMode =
        legs.find((leg) => leg.mode === 'sea')?.mode ??
        legs.find((leg) => leg.mode === 'air')?.mode ??
        legs[0].mode;

      features.push({
        type: 'Feature',
        id: `${targetIso}-${corridor.id}-origin`,
        properties: {
          targetIso,
          kind: 'origin',
          code: corridor.originCode,
          label: corridor.originLabel.split(',')[0].toUpperCase(),
          title: `${corridor.originCode} · ${corridor.originLabel.split(',')[0].toUpperCase()}`,
          detail: 'DEPARTURE',
          status: corridor.status,
          mode: legs[0].mode,
          sort: 2,
        },
        geometry: { type: 'Point', coordinates: [firstWaypoint[0], firstWaypoint[1]] },
      });

      for (const [transitIndex, transit] of (corridor.transitLabels ?? []).entries()) {
        features.push({
          type: 'Feature',
          id: `${targetIso}-${corridor.id}-transit-${transitIndex}`,
          properties: {
            targetIso,
            kind: 'transit',
            code: transit.code,
            label: transit.label.toUpperCase(),
            title: `${transit.code} · ${transit.label.toUpperCase()}`,
            detail: 'TRANSIT HUB',
            status: corridor.status,
            mode: transitMode,
            sort: 3,
          },
          geometry: {
            type: 'Point',
            coordinates: [transit.coordinate[0], transit.coordinate[1]],
          },
        });
      }

      features.push({
        type: 'Feature',
        id: `${targetIso}-${corridor.id}-entry`,
        properties: {
          targetIso,
          kind: 'entry',
          code: targetIso,
          label: corridor.destinationLabel.toUpperCase(),
          title: corridor.destinationLabel.toUpperCase(),
          detail: corridor.destinationType.toUpperCase(),
          status: corridor.status,
          mode: lastLeg.mode,
          sort: 1,
        },
        geometry: { type: 'Point', coordinates: [lastWaypoint[0], lastWaypoint[1]] },
      });
    }
  }

  return { type: 'FeatureCollection' as const, features };
}

/**
 * Facility-precision terminal detail — the quay, beach sector, border station, reception
 * centre or district a corridor actually resolves into. Only meaningful once the camera is
 * inside a city, so `MapGlobe` gates the layer at {@link ENTRY_NODE_MIN_ZOOM}. The kind colour
 * is denormalised into properties so paint stays a `['get','color']` lookup.
 */
export function migrationEntryNodesGeoJson() {
  return {
    type: 'FeatureCollection' as const,
    features: MIGRATION_ENTRY_NODES.map((entry) => {
      const kind = ENTRY_NODE_KINDS[entry.kind];
      return {
        type: 'Feature' as const,
        id: entry.id,
        properties: {
          nodeId: entry.id,
          targetIso: entry.targetIso,
          name: entry.name,
          address: entry.address ?? '',
          city: entry.city,
          kind: entry.kind,
          kindTitle: kind.title,
          code: kind.code,
          color: kind.color,
          precision: entry.precision,
          summary: entry.summary,
          sourceOrg: entry.sources[0]?.organization ?? '',
          sourceUrl: entry.sources[0]?.url ?? '',
          // Sector coordinates are representative points, so the label says so rather than
          // letting a reader take a dune centroid for a location.
          detail: entry.precision === 'facility' ? 'FACILITY' : 'SECTOR · REPRESENTATIVE',
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [entry.coordinate[0], entry.coordinate[1]] as Position,
        },
      };
    }),
  };
}

/**
 * Reporting pinned to an entry node — mostly broadcast video. Offset slightly north-east of
 * its node so the two markers do not stack at city zoom.
 */
export function migrationMicroEventsGeoJson() {
  const features = [];
  for (const event of MIGRATION_MICROEVENTS) {
    const node = ENTRY_NODE_BY_ID.get(event.nodeId);
    if (!node) continue;
    // ~180 m at the equator; enough to unstack without moving the pin off its facility.
    const offset = 0.0016;
    features.push({
      type: 'Feature' as const,
      id: event.id,
      properties: {
        eventId: event.id,
        nodeId: event.nodeId,
        targetIso: event.targetIso,
        headline: event.headline,
        outlet: event.outlet,
        date: event.date,
        format: event.format,
        videoId: event.videoId ?? '',
        url: event.url,
        summary: event.summary,
        place: node.name,
        color: event.format === 'video' ? '#e0483b' : '#d8c24a',
        code: event.format === 'video' ? 'VID' : 'RPT',
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [node.coordinate[0] + offset, node.coordinate[1] + offset] as Position,
      },
    });
  }
  return { type: 'FeatureCollection' as const, features };
}

const MICROEVENT_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** `2026-08-04` → `4 Aug 2026`. Returns the input unchanged if it is not an ISO date. */
function formatMicroEventDate(iso: string): string {
  const parts = iso.split('-');
  if (parts.length !== 3) return iso;
  const month = MICROEVENT_MONTHS[Number(parts[1]) - 1];
  if (!month) return iso;
  return `${Number(parts[2])} ${month} ${parts[0]}`;
}

/**
 * Worldwide news microevents, one dot per reported event. Coordinates are rendered exactly as
 * stored. Coincident events deliberately remain coincident rather than being moved to invented
 * nearby positions; their precision label explains whether the point is a site, area or national
 * administrative anchor.
 */
export async function worldMicroEventsGeoJson() {
  const { WORLD_MICROEVENTS, WORLD_MICROEVENT_CATEGORY_META, WORLD_MICROEVENT_PRECISION_LABEL } =
    await import('../data/worldMicroEvents');
  const features = WORLD_MICROEVENTS.map((event) => {
    const meta = WORLD_MICROEVENT_CATEGORY_META[event.category];
    const [lng, lat] = event.coordinate;

    return {
      type: 'Feature' as const,
      id: event.id,
      properties: {
        eventId: event.id,
        category: event.category,
        categoryLabel: meta.label,
        code: meta.code,
        color: meta.color,
        headline: event.headline,
        summary: event.summary,
        place: event.place,
        date: event.date,
        dateLabel: formatMicroEventDate(event.date),
        precisionLabel: WORLD_MICROEVENT_PRECISION_LABEL[event.precision],
        outlet: event.source,
        url: event.url,
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [lng, lat] as Position,
      },
    };
  });
  return { type: 'FeatureCollection' as const, features };
}

/**
 * Germany's sourced mass-shooting history as one point per incident.
 *
 * Several records share a settlement centroid. A deterministic spiral keeps every record visible
 * and hoverable while staying inside the city-level precision the data promises. The incidents
 * live in a dynamically imported module so their summaries and source URLs do not inflate the
 * globe's boot chunk before a user approaches Germany.
 */
export async function germanyMassShootingsGeoJson() {
  const { GERMANY_MASS_SHOOTINGS } = await import('../data/germanyMassShootings');
  const seenAt = new Map<string, number>();
  const features = GERMANY_MASS_SHOOTINGS.map((event) => {
    const severity = event.killed > 0 ? 'fatal' : 'nonfatal';
    const meta = GERMANY_MASS_SHOOTING_META[severity];
    const [lng, lat] = event.coordinate;
    const key = `${lng},${lat}`;
    const repeat = seenAt.get(key) ?? 0;
    seenAt.set(key, repeat + 1);
    const angle = repeat * 2.399963;
    const radius = repeat === 0 ? 0 : 0.012 * Math.sqrt(repeat);
    const cosLat = Math.max(Math.cos((lat * Math.PI) / 180), 0.15);

    return {
      type: 'Feature' as const,
      id: event.id,
      properties: {
        eventId: event.id,
        severity,
        categoryLabel: 'Mass shooting',
        code: meta.code,
        color: meta.color,
        title: event.title,
        summary: event.summary,
        place: event.place,
        date: event.date,
        dateLabel: formatMicroEventDate(event.date),
        casualtyLabel: `${event.killed} reported dead · ${event.injured} injured`,
        precisionLabel:
          event.precision === 'area'
            ? 'Area-centroid plot — not an exact incident site'
            : 'City-level plot — not an exact incident site',
        outlet: event.source,
        url: event.url,
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [
          lng + (radius * Math.cos(angle)) / cosLat,
          lat + radius * Math.sin(angle),
        ] as Position,
      },
    };
  });

  return { type: 'FeatureCollection' as const, features };
}

/**
 * Every entry node as a flat search target for the Recon locator — name, address and city
 * folded into one lowercase haystack so a photo caption or a place name can be matched
 * without pulling the whole dataset into the component.
 */
export function reconSearchTargets() {
  return MIGRATION_ENTRY_NODES.map((entry) => ({
    id: entry.id,
    label: entry.name,
    detail: [entry.address, entry.city].filter(Boolean).join(' · '),
    coordinate: entry.coordinate,
    haystack: [entry.name, entry.address ?? '', entry.city, entry.targetIso]
      .join(' ')
      .toLowerCase(),
  }));
}

export interface CorridorPath {
  targetIso: MigrationTargetIso;
  corridorId: string;
  status: MigrationRouteStatus;
  /** Densified great-circle points for the whole corridor, first leg to last. */
  points: Position[];
  /** Transport mode active on the segment ending at the matching point index. */
  modes: MigrationLegMode[];
  /** Cumulative angular length at each point; last entry is the total. */
  cumulative: number[];
  total: number;
}

/** Per-corridor sampling geometry used to animate travellers along the active routes. */
export function buildCorridorPaths(): Map<string, CorridorPath[]> {
  const byIso = new Map<string, CorridorPath[]>();

  for (const targetIso of MIGRATION_TARGET_ISOS) {
    const paths: CorridorPath[] = [];

    for (const corridor of MIGRATION_CORRIDORS_BY_ISO[targetIso]) {
      const points: Position[] = [];
      const modes: MigrationLegMode[] = [];

      for (const leg of corridor.legs) {
        if (leg.waypoints.length < 2) continue;
        const legPoints = densify(
          leg.waypoints.map(([lng, lat]) => [lng, lat] as Position),
        );
        const startIndex = points.length ? 1 : 0;
        for (let index = startIndex; index < legPoints.length; index++) {
          points.push(legPoints[index]);
          if (points.length > 1) modes.push(leg.mode);
        }
      }

      if (points.length < 2) continue;

      const cumulative: number[] = [0];
      for (let index = 1; index < points.length; index++) {
        cumulative.push(cumulative[index - 1] + angularDistance(points[index - 1], points[index]));
      }

      paths.push({
        targetIso,
        corridorId: corridor.id,
        status: corridor.status,
        points,
        modes,
        cumulative,
        total: cumulative[cumulative.length - 1],
      });
    }

    byIso.set(targetIso, paths);
  }

  return byIso;
}

export interface SampledTraveller {
  coordinates: Position;
  bearing: number;
  mode: MigrationLegMode;
}

/** Position, heading, and transport mode at fractional progress `t` along a corridor. */
export function sampleCorridor(path: CorridorPath, t: number): SampledTraveller {
  const target = Math.min(Math.max(t, 0), 1) * path.total;

  // `cumulative` is sorted, and the traveller animation samples every corridor 18 times a frame
  // (three travellers, each trailing five). Binary search instead of walking the polyline: the
  // longest corridor carries 166 vertices, so the scan was the bulk of the per-frame cost.
  let low = 1;
  let high = path.cumulative.length - 1;
  while (low < high) {
    const mid = (low + high) >> 1;
    if (path.cumulative[mid] < target) low = mid + 1;
    else high = mid;
  }
  const index = low;

  const from = path.points[index - 1];
  const to = path.points[index];
  const spanStart = path.cumulative[index - 1];
  const span = path.cumulative[index] - spanStart || 1;
  const localT = Math.min(1, Math.max(0, (target - spanStart) / span));

  const coordinates = interpolateGreatCircle(from, to, localT);
  const bearing = initialBearing(from, to);

  return { coordinates, bearing, mode: path.modes[index - 1] ?? 'land' };
}

function initialBearing(a: Position, b: Position): number {
  const lat1 = a[1] * DEG;
  const lat2 = b[1] * DEG;
  const dLon = (b[0] - a[0]) * DEG;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  return (Math.atan2(y, x) / DEG + 360) % 360;
}

export function isMigrationTargetIso(iso: string): iso is MigrationTargetIso {
  return MIGRATION_TARGET_SET.has(iso);
}

/** True when the ISO is a destination that actually has curated corridors to show. */
export function hasMigrationCorridors(iso: string): iso is MigrationTargetIso {
  return isMigrationTargetIso(iso) && MIGRATION_CORRIDORS_BY_ISO[iso].length > 0;
}

/**
 * How square-on a point sits to the camera, as `cos(angle from map centre)`: 1 directly under
 * the camera, 0 on the limb, negative on the far side. The old canvas globe used the same
 * quantity to fade markers around the horizon, so panel gates keyed on `depth` keep working.
 */
export function sphericalDepth(center: Position, point: Position): number {
  return Math.cos(angularDistance(center, point));
}

// ── Russo-Ukraine war layer ──────────────────────────────────────────────────

function controlZoneCollection(zones: WarControlZone[], kind: string) {
  return {
    type: 'FeatureCollection' as const,
    features: zones.map((zone) => {
      const ring = zone.ring.map(([lng, lat]) => [lng, lat] as Position);
      const first = ring[0];
      const last = ring[ring.length - 1];
      if (first && last && (first[0] !== last[0] || first[1] !== last[1])) ring.push(first);
      return {
        type: 'Feature' as const,
        id: zone.id,
        properties: { id: zone.id, kind, label: zone.label },
        geometry: { type: 'Polygon' as const, coordinates: [densify(ring, 0.15)] },
      };
    }),
  };
}

/** Shaded occupied territory, exactly as curated in `russoUkraineWar.ts`. */
export function warControlZonesGeoJson() {
  return controlZoneCollection(WAR_CONTROL_ZONES, 'occupied');
}

/** Ground held cleanly by neither side, drawn as a third state straddling the line. */
export function warContestedGeoJson() {
  return controlZoneCollection(WAR_CONTESTED_POCKETS, 'contested');
}

/** Named places that make the line readable once the camera is over Ukraine. */
export function warSettlementsGeoJson() {
  return {
    type: 'FeatureCollection' as const,
    features: WAR_SETTLEMENTS.map((settlement) => ({
      type: 'Feature' as const,
      id: settlement.name,
      properties: {
        name: settlement.name.toUpperCase(),
        side: settlement.side,
        priority: settlement.priority,
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [settlement.coordinate[0], settlement.coordinate[1]] as Position,
      },
    })),
  };
}

/**
 * The line of contact. One feature per traced segment — the main run plus the arcs around the
 * border salients north of Kharkiv and in Sumy — densified so each reads as a continuous front
 * rather than a chain of chords.
 */
export function warFrontlineGeoJson() {
  return {
    type: 'FeatureCollection' as const,
    features: WAR_FRONTLINE_SEGMENTS.map((segment) => ({
      type: 'Feature' as const,
      id: `war-frontline-${segment.id}`,
      properties: { label: segment.id, lengthKm: segment.lengthKm },
      geometry: {
        type: 'LineString' as const,
        coordinates: densify(
          segment.path.map(([lng, lat]) => [lng, lat] as Position),
          0.25,
        ),
      },
    })),
  };
}

export function warEventsGeoJson() {
  return {
    type: 'FeatureCollection' as const,
    features: WAR_EVENTS.map((event) => {
      const category = WAR_CATEGORY_BY_ID[event.categoryId];
      return {
        type: 'Feature' as const,
        id: event.id,
        properties: {
          id: event.id,
          categoryId: event.categoryId,
          categoryTitle: category?.title ?? event.categoryId,
          code: category?.code ?? '',
          color: category?.color ?? '#ffffff',
          title: event.title,
          summary: event.summary,
          placeName: event.placeName,
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [event.longitude, event.latitude] as Position,
        },
      };
    }),
  };
}

/** Israel–Iran / Gulf theatre pins — curated incidents, no control-zone fills. */
export function israelIranEventsGeoJson() {
  return {
    type: 'FeatureCollection' as const,
    features: ISRAEL_IRAN_EVENTS.map((event) => {
      const category = ISRAEL_IRAN_CATEGORY_BY_ID[event.categoryId];
      return {
        type: 'Feature' as const,
        id: event.id,
        properties: {
          id: event.id,
          categoryId: event.categoryId,
          categoryTitle: category?.title ?? event.categoryId,
          code: category?.code ?? '',
          color: category?.color ?? '#ffffff',
          title: event.title,
          summary: event.summary,
          placeName: event.placeName,
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [event.longitude, event.latitude] as Position,
        },
      };
    }),
  };
}

// ── Live hazard / intel feeds ────────────────────────────────────────────────

export function eonetPointsGeoJson(points: EonetEventPoint[]) {
  return {
    type: 'FeatureCollection' as const,
    features: points.map((point) => {
      const category = EONET_CATEGORY_BY_ID[point.categoryId];
      return {
        type: 'Feature' as const,
        id: point.id,
        properties: {
          id: point.id,
          categoryId: point.categoryId,
          categoryTitle: category?.title ?? point.categoryId,
          code: category?.code ?? '',
          color: category?.color ?? '#ffffff',
          title: point.title,
          date: point.date,
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [point.longitude, point.latitude] as Position,
        },
      };
    }),
  };
}

export function osintPointsGeoJson(points: OsintEventPoint[]) {
  return {
    type: 'FeatureCollection' as const,
    features: points.map((point) => {
      const category = OSINT_CATEGORY_BY_ID[point.categoryId];
      return {
        type: 'Feature' as const,
        id: point.id,
        properties: {
          id: point.id,
          categoryId: point.categoryId,
          categoryTitle: category?.title ?? point.categoryId,
          code: category?.code ?? '',
          color: category?.color ?? '#ffffff',
          text: point.text,
          handle: point.handle ?? '',
          placeName: point.placeName,
          date: point.date,
          sourceUrl: point.sourceUrl ?? '',
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [point.longitude, point.latitude] as Position,
        },
      };
    }),
  };
}

// ── Cyberattacks / breaches ──────────────────────────────────────────────────

/**
 * Curated cyber micro-events. Static, so this is built once at source-registration time
 * rather than pushed in from state like the live EONET / OSINT feeds.
 *
 * The category colour is denormalised into feature properties, matching every other point
 * layer, so paint stays `['get','color']` and no per-frame JS runs.
 */
export function cyberEventsGeoJson() {
  return {
    type: 'FeatureCollection' as const,
    features: CYBER_EVENTS.map((event) => {
      const category = CYBER_CATEGORY_BY_ID[event.categoryId];
      return {
        type: 'Feature' as const,
        id: event.id,
        properties: {
          id: event.id,
          categoryId: event.categoryId,
          categoryTitle: category.title,
          code: category.code,
          color: category.color,
          title: event.title,
          summary: event.summary,
          impact: event.impact,
          placeName: event.placeName,
          reported: event.reported,
          sourceUrl: event.url,
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [event.longitude, event.latitude] as Position,
        },
      };
    }),
  };
}

// ── Military installations ───────────────────────────────────────────────────

/** One baked row from `/geo/military-bases.json` (see `scripts/bake-military-bases.mjs`). */
interface MilitaryBaseRecord {
  /** `[lng, lat]`, quantised to 4 dp. */
  g: [number, number];
  n: string;
  /** Operating power, ISO-2. */
  o: string;
  /** Bloc bucket used for colour. */
  b: string;
  /** `air` | `naval` | `missile` | `other`. */
  t: string;
  h?: string;
  w?: string;
  a?: string;
  x?: string;
  u?: string;
  /** Co-operators on a shared base (e.g. Camp Zama is US + JP). */
  s?: string[];
}

/**
 * Bloc palette, following the source map's own reading: US and NATO share the blue, since the
 * distinction the map is making is which power is present, not which flag flies over the gate.
 * Deliberately flatter than the alert pins — bases are standing infrastructure, not incidents.
 */
export const MILITARY_BLOC_COLOR: Record<string, string> = {
  us: '#4d90d8',
  nato: '#4d90d8',
  cn: '#d4635a',
  ru: '#a07fd0',
  prk: '#e0913f',
  other: '#9aa2ad',
};

/** Narrow a raw bloc code to a key that is guaranteed to have both a colour and an icon sprite. */
function militaryBlocKey(bloc: string): MilitaryBlocKey {
  return (MILITARY_BLOC_KEYS as readonly string[]).includes(bloc)
    ? (bloc as MilitaryBlocKey)
    : 'other';
}

/** The source's `A`/`N`/`I` codes, plus the 84 records that carry no type at all. */
const MILITARY_TYPE_LABEL: Record<string, string> = {
  air: 'Air base',
  naval: 'Naval base',
  missile: 'Missile site',
  other: 'Installation',
};

/** ISO-2 → display name for the operators present in the baked data. */
const MILITARY_OPERATOR_NAME: Record<string, string> = {
  AE: 'UAE', AF: 'Afghanistan', AL: 'Albania', AM: 'Armenia', AO: 'Angola', AR: 'Argentina',
  AT: 'Austria', AU: 'Australia', AZ: 'Azerbaijan', BA: 'Bosnia', BF: 'Burkina Faso',
  BG: 'Bulgaria', BN: 'Brunei', BO: 'Bolivia', BR: 'Brazil', BY: 'Belarus', CA: 'Canada',
  CD: 'DR Congo', CL: 'Chile', CN: 'China', CO: 'Colombia', CU: 'Cuba', CY: 'Cyprus',
  CZ: 'Czechia', DE: 'Germany', DK: 'Denmark', DO: 'Dominican Rep.', DZ: 'Algeria',
  EC: 'Ecuador', EG: 'Egypt', ER: 'Eritrea', ES: 'Spain', ET: 'Ethiopia', FI: 'Finland',
  FR: 'France', GA: 'Gabon', GB: 'United Kingdom', GF: 'French Guiana', GR: 'Greece',
  HN: 'Honduras', HR: 'Croatia', HU: 'Hungary', ID: 'Indonesia', IE: 'Ireland', IL: 'Israel',
  IN: 'India', IQ: 'Iraq', IR: 'Iran', IS: 'Iceland', IT: 'Italy', JM: 'Jamaica', JO: 'Jordan',
  JP: 'Japan', KE: 'Kenya', KG: 'Kyrgyzstan', KH: 'Cambodia', KP: 'North Korea',
  KR: 'South Korea', KZ: 'Kazakhstan', LA: 'Laos', LB: 'Lebanon', LK: 'Sri Lanka',
  LT: 'Lithuania', LV: 'Latvia', LY: 'Libya', MA: 'Morocco', MD: 'Moldova', MM: 'Myanmar',
  MX: 'Mexico', MY: 'Malaysia', MZ: 'Mozambique', NA: 'Namibia', NC: 'New Caledonia',
  NE: 'Niger', NG: 'Nigeria', NL: 'Netherlands', NO: 'Norway', NZ: 'New Zealand', OM: 'Oman',
  PE: 'Peru', PG: 'Papua New Guinea', PH: 'Philippines', PK: 'Pakistan', PL: 'Poland',
  PT: 'Portugal', PY: 'Paraguay', RO: 'Romania', RU: 'Russia', SA: 'Saudi Arabia', SD: 'Sudan',
  SE: 'Sweden', SG: 'Singapore', SK: 'Slovakia', SN: 'Senegal', SR: 'Suriname', SY: 'Syria',
  TH: 'Thailand', TJ: 'Tajikistan', TM: 'Turkmenistan', TN: 'Tunisia', TR: 'Türkiye',
  TW: 'Taiwan', TZ: 'Tanzania', UA: 'Ukraine', US: 'United States', UY: 'Uruguay',
  UZ: 'Uzbekistan', VE: 'Venezuela', VN: 'Vietnam', YE: 'Yemen', ZA: 'South Africa',
  ZM: 'Zambia',
};

/**
 * Active airbases, naval bases and ICBM silo groupings worldwide (1,525 after merging the
 * source's repeats). Compiled by ALC Press and baked to `/geo/` because their file sends no
 * CORS headers — see the bake script for provenance.
 */
export async function militaryBasesGeoJson() {
  const rows = await loadGeo<MilitaryBaseRecord[]>('military-bases.json');
  return {
    type: 'FeatureCollection' as const,
    features: rows.map((row, index) => ({
      type: 'Feature' as const,
      id: index,
      properties: {
        name: row.n,
        aka: row.a ?? '',
        note: row.x ?? '',
        typeLabel: MILITARY_TYPE_LABEL[row.t] ?? MILITARY_TYPE_LABEL.other,
        operatorCode: row.o,
        operatorName: MILITARY_OPERATOR_NAME[row.o] ?? row.o,
        sharedWith: (row.s ?? [])
          .map((code) => MILITARY_OPERATOR_NAME[code] ?? code)
          .join(' · '),
        hostName: row.h ?? '',
        bloc: row.b,
        blocKey: militaryBlocKey(row.b),
        color: MILITARY_BLOC_COLOR[row.b] ?? MILITARY_BLOC_COLOR.other,
        url: row.w ? `https://en.wikipedia.org/wiki/${encodeURIComponent(row.w)}` : (row.u ?? ''),
      },
      geometry: {
        type: 'Point' as const,
        coordinates: row.g as Position,
      },
    })),
  };
}

/** Publicly acknowledged fixed strategic-radar sites, kept in the boot bundle as 13 small points. */
export function strategicRadarStationsGeoJson() {
  return {
    type: 'FeatureCollection' as const,
    features: STRATEGIC_RADAR_STATIONS.map((station) => ({
      type: 'Feature' as const,
      id: station.id,
      properties: {
        stationId: station.id,
        name: station.name,
        shortName: station.shortName,
        system: station.system,
        mission: station.mission,
        missionLabel: STRATEGIC_RADAR_MISSION_META[station.mission].label,
        operator: station.operator,
        host: station.host,
        note: station.note,
        sourceOrg: station.sourceOrg,
        sourceUrl: station.sourceUrl,
        color: STRATEGIC_RADAR_MISSION_META[station.mission].color,
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [...station.coordinates] as Position,
      },
    })),
  };
}

export const EMPTY_FEATURE_COLLECTION: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [],
};
