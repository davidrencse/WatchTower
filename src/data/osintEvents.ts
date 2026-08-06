/**
 * X / OSINT event layer.
 *
 * Geolocated pins scraped from X (Twitter) by the standalone `X-search-api` ingestion
 * service (see that folder). The service runs the "global" preset — worldwide
 * geopolitical / conflict posts → geocoded map pins — and persists them to
 * `GET /pins`, which the globe polls here.
 *
 * The scraper is Node-only (it needs a real X session + usually a residential proxy),
 * so it cannot run in the browser. When the endpoint is unreachable this module falls
 * back to a small **sample fixture** so the layer still renders — and the UI flags it as
 * SAMPLE, never passing illustrative pins off as live intelligence.
 */

export type OsintCategoryId =
  | 'strikes'
  | 'clashes'
  | 'naval'
  | 'air'
  | 'unrest'
  | 'alerts';

export interface OsintCategoryMeta {
  id: OsintCategoryId;
  /** Human label in the layer picker. */
  title: string;
  /** Three-letter tactical code. */
  code: string;
  /** Marker colour. */
  color: string;
  /** On by default on first load. */
  defaultOn: boolean;
}

/** The Intel-layer taxonomy — must mirror the backend preset's category ids. */
export const OSINT_CATEGORIES: OsintCategoryMeta[] = [
  { id: 'strikes', title: 'Kinetic Strikes', code: 'STK', color: '#e0483b', defaultOn: true },
  { id: 'clashes', title: 'Ground Combat', code: 'GRD', color: '#e07b39', defaultOn: true },
  { id: 'naval', title: 'Maritime', code: 'NAV', color: '#4f9bd0', defaultOn: true },
  { id: 'air', title: 'Air & Defense', code: 'AIR', color: '#57c3d6', defaultOn: true },
  { id: 'unrest', title: 'Unrest', code: 'UNR', color: '#c86fd0', defaultOn: false },
  { id: 'alerts', title: 'Alerts', code: 'ALT', color: '#d8c24a', defaultOn: false },
];

export const OSINT_CATEGORY_BY_ID: Record<OsintCategoryId, OsintCategoryMeta> =
  OSINT_CATEGORIES.reduce(
    (map, category) => {
      map[category.id] = category;
      return map;
    },
    {} as Record<OsintCategoryId, OsintCategoryMeta>,
  );

const OSINT_CATEGORY_IDS = new Set<string>(OSINT_CATEGORIES.map((c) => c.id));

/** Raw pin as persisted by the X-search-api service (`GET /pins`). */
export interface OsintPin {
  postId: string;
  postUrl?: string;
  creatorHandle?: string | null;
  text: string;
  category: string;
  placeName?: string;
  lat: number;
  lng: number;
  mediaType?: string | null;
  engagementMetrics?: {
    like_count?: number;
    retweet_count?: number;
    reply_count?: number;
    view_count?: number;
  };
  createdAt?: string | null;
}

/** A pin normalized for rendering / the picker. */
export interface OsintEventPoint {
  id: string;
  categoryId: OsintCategoryId;
  /** Full post text. */
  text: string;
  handle: string | null;
  longitude: number;
  latitude: number;
  /** ISO timestamp of the post. */
  date: string;
  placeName: string;
  sourceUrl: string;
  /** likes + retweets, used for marker weighting. */
  engagement: number;
}

export interface OsintFeed {
  points: OsintEventPoint[];
  /** true when these came from the bundled fixture, not the live endpoint. */
  sample: boolean;
  /** ISO timestamp the endpoint reported, if any. */
  updatedAt: string | null;
}

const OSINT_PINS_ENDPOINT = (import.meta.env.VITE_OSINT_PINS_URL as string | undefined)?.trim();

function sampleFeed(): OsintFeed {
  return {
    points: normalizeMany(OSINT_SAMPLE_PINS),
    sample: true,
    updatedAt: null,
  };
}

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

function normalizePin(pin: OsintPin): OsintEventPoint | null {
  if (!pin || !OSINT_CATEGORY_IDS.has(pin.category)) return null;
  const longitude = Number(pin.lng);
  const latitude = Number(pin.lat);
  if (!isFiniteCoordinate(longitude, latitude)) return null;

  const likes = pin.engagementMetrics?.like_count ?? 0;
  const retweets = pin.engagementMetrics?.retweet_count ?? 0;

  return {
    id: String(pin.postId),
    categoryId: pin.category as OsintCategoryId,
    text: String(pin.text ?? '').trim(),
    handle: pin.creatorHandle ? String(pin.creatorHandle) : null,
    longitude,
    latitude,
    date: pin.createdAt ? String(pin.createdAt) : new Date().toISOString(),
    placeName: pin.placeName ? String(pin.placeName) : '',
    sourceUrl:
      typeof pin.postUrl === 'string' && pin.postUrl ? pin.postUrl : 'https://x.com/',
    engagement: likes + retweets,
  };
}

function normalizeMany(pins: OsintPin[]): OsintEventPoint[] {
  return pins
    .map(normalizePin)
    .filter((p): p is OsintEventPoint => p !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Fetches the latest OSINT pins from the ingestion service. Falls back to the bundled
 * sample fixture (flagged `sample: true`) whenever the endpoint is unreachable, empty,
 * or malformed — the layer always has something to draw.
 */
export async function fetchOsintFeed(signal?: AbortSignal): Promise<OsintFeed> {
  // Live ingestion is optional. Avoid a guaranteed localhost request in production when the
  // deployment has not explicitly configured the standalone service.
  if (!OSINT_PINS_ENDPOINT) return sampleFeed();

  try {
    const response = await fetch(OSINT_PINS_ENDPOINT, {
      headers: { Accept: 'application/json' },
      signal,
    });
    if (!response.ok) throw new Error(`pins endpoint ${response.status}`);
    const payload = (await response.json()) as { pins?: OsintPin[]; updatedAt?: string };
    const rawPins = Array.isArray(payload.pins) ? payload.pins : [];
    const points = normalizeMany(rawPins);
    if (points.length === 0) throw new Error('no live pins');
    return { points, sample: false, updatedAt: payload.updatedAt ?? null };
  } catch (error) {
    if (signal?.aborted) throw error;
    return sampleFeed();
  }
}

/** Compact relative time, e.g. `5m`, `3h`, `2d`. */
export function formatOsintAge(iso: string, now = Date.now()): string {
  const time = new Date(iso).getTime();
  if (!Number.isFinite(time)) return '';
  const mins = Math.max(0, Math.round((now - time) / 60000));
  if (mins < 60) return `${mins}m`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
}

/** likes+retweets → compact string, e.g. `1.2k`. Empty when zero. */
/**
 * Illustrative sample pins — placeholder handles and paraphrased situational text, used
 * ONLY when the live endpoint is unreachable. Never presented as genuine posts: the UI
 * badges this layer SAMPLE whenever it is showing this fixture.
 */
export const OSINT_SAMPLE_PINS: OsintPin[] = [
  { postId: 's1', category: 'strikes', creatorHandle: 'OSINTdesk', text: 'Reports of overnight airstrikes near Khan Younis; heavy smoke reported over the eastern districts.', placeName: 'Khan Younis, Gaza', lat: 31.34, lng: 34.30, postUrl: 'https://x.com/', engagementMetrics: { like_count: 820, retweet_count: 240 }, createdAt: iso(-35) },
  { postId: 's2', category: 'strikes', creatorHandle: 'FieldSignal', text: 'Missile impact reported on the outskirts of Kharkiv, air-raid alert active across the region.', placeName: 'Kharkiv, Ukraine', lat: 49.99, lng: 36.23, postUrl: 'https://x.com/', engagementMetrics: { like_count: 610, retweet_count: 190 }, createdAt: iso(-72) },
  { postId: 's3', category: 'strikes', creatorHandle: 'WatchFloor', text: 'Shelling reported along the frontline south of Avdiivka in the last hour.', placeName: 'Avdiivka, Ukraine', lat: 48.14, lng: 37.75, postUrl: 'https://x.com/', engagementMetrics: { like_count: 430, retweet_count: 120 }, createdAt: iso(-150) },
  { postId: 's4', category: 'clashes', creatorHandle: 'FrontLedger', text: 'Heavy fighting reported around Bakhmut; both sides claim gains near the industrial zone.', placeName: 'Bakhmut, Ukraine', lat: 48.59, lng: 38.00, postUrl: 'https://x.com/', engagementMetrics: { like_count: 720, retweet_count: 260 }, createdAt: iso(-52) },
  { postId: 's5', category: 'clashes', creatorHandle: 'SahelWatch', text: 'Firefight reported near a checkpoint outside Bamako; roads into the city restricted.', placeName: 'Bamako, Mali', lat: 12.64, lng: -8.00, postUrl: 'https://x.com/', engagementMetrics: { like_count: 210, retweet_count: 70 }, createdAt: iso(-190) },
  { postId: 's6', category: 'clashes', creatorHandle: 'HornMonitor', text: 'Clashes reported in Omdurman as the offensive continues along the river.', placeName: 'Omdurman, Sudan', lat: 15.65, lng: 32.48, postUrl: 'https://x.com/', engagementMetrics: { like_count: 340, retweet_count: 95 }, createdAt: iso(-240) },
  { postId: 's7', category: 'naval', creatorHandle: 'GulfWatch', text: 'Tanker reportedly detained in the Strait of Hormuz; shipping advised to exercise caution.', placeName: 'Strait of Hormuz', lat: 26.57, lng: 56.25, postUrl: 'https://x.com/', engagementMetrics: { like_count: 980, retweet_count: 410 }, createdAt: iso(-28) },
  { postId: 's8', category: 'naval', creatorHandle: 'RedSeaDesk', text: 'Vessel reports being hailed then targeted off the coast near Hodeidah; crew reported safe.', placeName: 'Hodeidah, Yemen', lat: 14.80, lng: 42.95, postUrl: 'https://x.com/', engagementMetrics: { like_count: 560, retweet_count: 180 }, createdAt: iso(-90) },
  { postId: 's9', category: 'naval', creatorHandle: 'BlackSeaLog', text: 'Naval drone activity reported near the port of Sevastopol overnight.', placeName: 'Sevastopol, Crimea', lat: 44.62, lng: 33.53, postUrl: 'https://x.com/', engagementMetrics: { like_count: 470, retweet_count: 150 }, createdAt: iso(-125) },
  { postId: 's10', category: 'air', creatorHandle: 'SkyIntel', text: 'Air-defense engagement reported over Isfahan; multiple loud booms heard by residents.', placeName: 'Isfahan, Iran', lat: 32.65, lng: 51.67, postUrl: 'https://x.com/', engagementMetrics: { like_count: 1300, retweet_count: 520 }, createdAt: iso(-44) },
  { postId: 's11', category: 'air', creatorHandle: 'ScrambleNet', text: 'Fighters reportedly scrambled after an airspace violation near the Baltic coast.', placeName: 'Kaliningrad', lat: 54.71, lng: 20.51, postUrl: 'https://x.com/', engagementMetrics: { like_count: 380, retweet_count: 110 }, createdAt: iso(-165) },
  { postId: 's12', category: 'air', creatorHandle: 'PacificRadar', text: 'Multiple aircraft reported crossing the median line in the Taiwan Strait this morning.', placeName: 'Taiwan Strait', lat: 24.50, lng: 119.50, postUrl: 'https://x.com/', engagementMetrics: { like_count: 640, retweet_count: 210 }, createdAt: iso(-200) },
  { postId: 's13', category: 'unrest', creatorHandle: 'CivicWatch', text: 'Large protests reported in central Tbilisi; police deploy near parliament.', placeName: 'Tbilisi, Georgia', lat: 41.72, lng: 44.79, postUrl: 'https://x.com/', engagementMetrics: { like_count: 520, retweet_count: 160 }, createdAt: iso(-60) },
  { postId: 's14', category: 'unrest', creatorHandle: 'AndesDesk', text: 'Clashes between demonstrators and police reported in downtown Quito.', placeName: 'Quito, Ecuador', lat: -0.18, lng: -78.47, postUrl: 'https://x.com/', engagementMetrics: { like_count: 240, retweet_count: 80 }, createdAt: iso(-210) },
  { postId: 's15', category: 'unrest', creatorHandle: 'CaribMonitor', text: 'Reports of unrest and roadblocks across Port-au-Prince amid a general strike.', placeName: 'Port-au-Prince, Haiti', lat: 18.59, lng: -72.31, postUrl: 'https://x.com/', engagementMetrics: { like_count: 300, retweet_count: 100 }, createdAt: iso(-280) },
  { postId: 's16', category: 'alerts', creatorHandle: 'WireBreak', text: 'Developing: large explosion reported near the port district of Beirut; cause unclear.', placeName: 'Beirut, Lebanon', lat: 33.90, lng: 35.53, postUrl: 'https://x.com/', engagementMetrics: { like_count: 1100, retweet_count: 470 }, createdAt: iso(-20) },
  { postId: 's17', category: 'alerts', creatorHandle: 'AlertFloor', text: 'Sirens reported across Tel Aviv; residents advised to move to shelters.', placeName: 'Tel Aviv, Israel', lat: 32.08, lng: 34.78, postUrl: 'https://x.com/', engagementMetrics: { like_count: 890, retweet_count: 330 }, createdAt: iso(-15) },
  { postId: 's18', category: 'alerts', creatorHandle: 'DeskNorth', text: 'Reports of a large fire at an industrial site outside Rostov; emergency crews responding.', placeName: 'Rostov, Russia', lat: 47.24, lng: 39.71, postUrl: 'https://x.com/', engagementMetrics: { like_count: 410, retweet_count: 130 }, createdAt: iso(-110) },
  { postId: 's19', category: 'strikes', creatorHandle: 'LevantLog', text: 'Airstrikes reported near the southern suburbs; anti-air fire visible over the city.', placeName: 'Damascus, Syria', lat: 33.51, lng: 36.29, postUrl: 'https://x.com/', engagementMetrics: { like_count: 700, retweet_count: 250 }, createdAt: iso(-80) },
  { postId: 's20', category: 'clashes', creatorHandle: 'EastFront', text: 'Renewed clashes reported near Kherson along the river line.', placeName: 'Kherson, Ukraine', lat: 46.64, lng: 32.61, postUrl: 'https://x.com/', engagementMetrics: { like_count: 360, retweet_count: 105 }, createdAt: iso(-175) },
  { postId: 's21', category: 'naval', creatorHandle: 'SCSMonitor', text: 'Standoff reported near Scarborough Shoal after vessels shadowed a resupply mission.', placeName: 'Scarborough Shoal', lat: 15.15, lng: 117.76, postUrl: 'https://x.com/', engagementMetrics: { like_count: 430, retweet_count: 140 }, createdAt: iso(-230) },
  { postId: 's22', category: 'air', creatorHandle: 'GulfSky', text: 'Air-defense activity reported over Bandar Abbas; airport operations briefly paused.', placeName: 'Bandar Abbas, Iran', lat: 27.18, lng: 56.29, postUrl: 'https://x.com/', engagementMetrics: { like_count: 560, retweet_count: 175 }, createdAt: iso(-58) },
];

/** ISO timestamp `minutes` in the past (negative = earlier). */
function iso(minutes: number): string {
  return new Date(Date.now() + minutes * 60000).toISOString();
}
