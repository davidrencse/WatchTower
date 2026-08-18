import { safeExternalUrl } from '../lib/safeUrl';
import { formatShortDate } from '../lib/numberFormat';

/**
 * NASA EONET (Earth Observatory Natural Event Tracker) v3.
 * Public, key-less, CORS-open feed of active natural events — fetched directly from
 * the client so it works in Vite's standalone dev server and in production alike.
 *
 * Docs: https://eonet.gsfc.nasa.gov/docs/v3
 */

export type EonetCategoryId =
  | 'wildfires'
  | 'severeStorms'
  | 'volcanoes'
  | 'seaLakeIce';

export interface EonetCategoryMeta {
  /** EONET category id used as the `category=` query parameter. */
  id: EonetCategoryId;
  /** Human label shown in the layer picker. */
  title: string;
  /** Three-letter instrument code. */
  code: string;
  /** Marker colour — the one sanctioned use of hue on the monochrome globe. */
  color: string;
  /** Layers shown by default on first load. */
  defaultOn: boolean;
}

/**
 * Curated slice of EONET's category list — the four that carry data year-round and read
 * meaningfully on the globe. (The seasonal categories that sit at `0 active` for months
 * at a time were dropped from the picker rather than shown as permanently empty rows.)
 */
export const EONET_CATEGORIES: EonetCategoryMeta[] = [
  { id: 'wildfires', title: 'Wildfires', code: 'WFR', color: '#e58a3c', defaultOn: true },
  { id: 'severeStorms', title: 'Severe Storms', code: 'STM', color: '#57a8cf', defaultOn: true },
  { id: 'volcanoes', title: 'Volcanoes', code: 'VOL', color: '#d1553f', defaultOn: true },
  { id: 'seaLakeIce', title: 'Sea & Lake Ice', code: 'ICE', color: '#9fd0e0', defaultOn: true },
];

export const EONET_CATEGORY_BY_ID: Record<EonetCategoryId, EonetCategoryMeta> =
  EONET_CATEGORIES.reduce(
    (map, category) => {
      map[category.id] = category;
      return map;
    },
    {} as Record<EonetCategoryId, EonetCategoryMeta>,
  );

export interface EonetEventPoint {
  id: string;
  categoryId: EonetCategoryId;
  title: string;
  /** ISO timestamp of the most recent geometry. */
  date: string;
  /** Longitude of the most recent geometry (−180…180). */
  longitude: number;
  /** Latitude of the most recent geometry (−90…90). */
  latitude: number;
  magnitude: number | null;
  magnitudeUnit: string | null;
  sourceUrl: string;
  /**
   * Full ordered path `[lon, lat]` for events that move (storms, drifting icebergs).
   * Length 1 for stationary events. The most recent position is always last.
   */
  track: Array<[number, number]>;
}

const EONET_ENDPOINT = 'https://eonet.gsfc.nasa.gov/api/v3/events';
/** Upstream fetch ceiling per category (wildfires can run to thousands globally). */
const CATEGORY_FETCH_LIMIT = 300;
/**
 * Rendered-point ceiling per category. Kept deliberately low for the busy layers so the
 * globe shows the most recent, most significant events as legible beacons rather than a
 * peppering of dots. Sparse layers keep a higher ceiling since they never crowd.
 */
const CATEGORY_RENDER_LIMIT: Record<EonetCategoryId, number> = {
  wildfires: 140,
  seaLakeIce: 160,
  severeStorms: 160,
  volcanoes: 160,
};
const DEFAULT_RENDER_LIMIT = 120;

/**
 * Spatial-thinning grid, in degrees. One beacon is kept per cell (most recent wins) so a
 * globe-spanning layer stays spread across every hemisphere instead of piling onto the
 * region that reports most often (US wildfire feeds refresh constantly). Sparse layers use
 * a fine grid that only collapses exact duplicates.
 */
const CATEGORY_THIN_DEG: Record<EonetCategoryId, number> = {
  wildfires: 2,
  seaLakeIce: 1.25,
  severeStorms: 0.6,
  volcanoes: 0.6,
};
const DEFAULT_THIN_DEG = 1.5;

function isFiniteCoordinate(longitude: number, latitude: number): boolean {
  return (
    Number.isFinite(longitude) &&
    Number.isFinite(latitude) &&
    longitude >= -180 &&
    longitude <= 180 &&
    latitude >= -90 &&
    latitude <= 90
  );
}

function normalizeEvent(raw: unknown, categoryId: EonetCategoryId): EonetEventPoint | null {
  if (!raw || typeof raw !== 'object') return null;
  const event = raw as Record<string, unknown>;
  const geometries = Array.isArray(event.geometry) ? event.geometry : [];

  const track: Array<[number, number]> = [];
  let latest: { longitude: number; latitude: number; date: string } | null = null;
  let latestTime = -Infinity;
  let magnitude: number | null = null;
  let magnitudeUnit: string | null = null;

  for (const rawGeometry of geometries) {
    if (!rawGeometry || typeof rawGeometry !== 'object') continue;
    const geometry = rawGeometry as Record<string, unknown>;
    if (geometry.type !== 'Point') continue; // polygons (rare) are skipped
    const coordinates = geometry.coordinates;
    if (!Array.isArray(coordinates) || coordinates.length < 2) continue;
    const longitude = Number(coordinates[0]);
    const latitude = Number(coordinates[1]);
    if (!isFiniteCoordinate(longitude, latitude)) continue;

    track.push([longitude, latitude]);

    const time = new Date(String(geometry.date ?? '')).getTime();
    const effectiveTime = Number.isNaN(time) ? track.length : time;
    if (effectiveTime >= latestTime) {
      latestTime = effectiveTime;
      latest = { longitude, latitude, date: String(geometry.date ?? '') };
      const magnitudeValue = Number(geometry.magnitudeValue);
      magnitude = Number.isFinite(magnitudeValue) ? magnitudeValue : null;
      magnitudeUnit =
        typeof geometry.magnitudeUnit === 'string' ? geometry.magnitudeUnit : null;
    }
  }

  if (!latest || track.length === 0) return null;

  const sources = Array.isArray(event.sources) ? event.sources : [];
  const firstSource = sources[0] as Record<string, unknown> | undefined;
  const rawSourceUrl =
    typeof firstSource?.url === 'string'
      ? firstSource.url
      : typeof event.link === 'string'
        ? event.link
        : 'https://eonet.gsfc.nasa.gov/';
  const sourceUrl = safeExternalUrl(rawSourceUrl) ?? 'https://eonet.gsfc.nasa.gov/';

  return {
    id: String(event.id ?? `${categoryId}-${track[0][0]}-${track[0][1]}`),
    categoryId,
    title: String(event.title ?? 'Natural event').trim() || 'Natural event',
    date: latest.date,
    longitude: latest.longitude,
    latitude: latest.latitude,
    magnitude,
    magnitudeUnit,
    sourceUrl,
    track,
  };
}

/**
 * Fetch the open events for a single EONET category. Resolves to the newest events
 * first, capped for rendering. Rejects on network/HTTP failure so callers can flag it.
 */
export async function fetchEonetCategory(
  categoryId: EonetCategoryId,
  signal?: AbortSignal,
): Promise<EonetEventPoint[]> {
  const url = new URL(EONET_ENDPOINT);
  url.searchParams.set('status', 'open');
  url.searchParams.set('category', categoryId);
  url.searchParams.set('limit', String(CATEGORY_FETCH_LIMIT));

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal,
  });
  if (!response.ok) {
    throw new Error(`EONET ${categoryId} returned ${response.status}`);
  }

  const payload = (await response.json()) as { events?: unknown };
  const events = Array.isArray(payload.events) ? payload.events : [];
  const normalized = events
    .map((event) => normalizeEvent(event, categoryId))
    .filter((point): point is EonetEventPoint => point !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Keep one event per grid cell (list is newest-first, so the freshest in each cell wins).
  const grid = CATEGORY_THIN_DEG[categoryId] ?? DEFAULT_THIN_DEG;
  const seenCells = new Set<string>();
  const thinned: EonetEventPoint[] = [];
  for (const point of normalized) {
    const key = `${Math.round(point.longitude / grid)}:${Math.round(point.latitude / grid)}`;
    if (seenCells.has(key)) continue;
    seenCells.add(key);
    thinned.push(point);
  }
  return thinned.slice(0, CATEGORY_RENDER_LIMIT[categoryId] ?? DEFAULT_RENDER_LIMIT);
}

/** Compact human date, e.g. `30 Jul 2026`. Falls back to `Active` for bad input. */
export function formatEonetDate(iso: string): string {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return 'Active';
  return formatShortDate(parsed);
}

/** e.g. `130 kts`, `90 NM²`. Empty string when no magnitude is reported. */
