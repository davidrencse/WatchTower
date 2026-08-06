/// <reference lib="webworker" />
/**
 * SGP4 propagation off the main thread.
 *
 * Propagating ~12,000 satellites is far too much arithmetic to run inside a frame, so the worker
 * owns the element sets and re-propagates the whole catalogue on a tick, posting back one packed
 * Float32Array (transferred, not copied). The main thread only uploads that buffer to the GPU.
 *
 * Six floats per satellite: mercator X/Y (unclamped — MapLibre's globe shader runs an exact
 * inverse Mercator, so values outside 0..1 are correct for polar passes), altitude in metres, and
 * the unit-sphere ECEF vector. The ECEF triplet is emitted here so hover-picking on the main
 * thread never has to redo the trigonometry.
 */
import { eciToGeodetic, gstime, propagate, twoline2satrec } from 'satellite.js';

import { SAT_STRIDE } from './satelliteStride';

type SatRec = ReturnType<typeof twoline2satrec>;

interface LoadedSat {
  rec: SatRec;
  name: string;
  norad: number;
  group: number;
}

let sats: LoadedSat[] = [];
let positions = new Float32Array(0);

/** Web Mercator Y, unclamped. MapLibre inverts exactly this in `projectToSphere`. */
function mercatorY(latRad: number): number {
  return 0.5 - Math.log(Math.tan(Math.PI / 4 + latRad / 2)) / (2 * Math.PI);
}

function parseTle(text: string, group: number, nameFilter?: string): LoadedSat[] {
  const filter = nameFilter ? new RegExp(nameFilter, 'i') : null;
  const lines = text.split(/\r?\n/).map((line) => line.trimEnd());
  const out: LoadedSat[] = [];
  for (let i = 0; i + 2 < lines.length; i += 3) {
    const name = lines[i].trim();
    const line1 = lines[i + 1];
    const line2 = lines[i + 2];
    if (!name || !line1?.startsWith('1 ') || !line2?.startsWith('2 ')) {
      // Recover from a stray blank line rather than dropping the rest of the file.
      i -= 2;
      continue;
    }
    if (filter && !filter.test(name)) continue;
    try {
      const rec = twoline2satrec(line1, line2);
      if (!rec || rec.error) continue;
      out.push({ rec, name, norad: Number(line1.slice(2, 7)), group });
    } catch {
      /* a single malformed element set should not sink the group */
    }
  }
  return out;
}

/** Propagate one satellite; returns null when SGP4 rejects (decayed or numerically diverged). */
function propagateOne(rec: SatRec, when: Date, gmst: number) {
  const eci = propagate(rec, when);
  if (!eci?.position || typeof eci.position === 'boolean') return null;
  const geo = eciToGeodetic(eci.position, gmst);
  if (!Number.isFinite(geo.latitude) || !Number.isFinite(geo.longitude)) return null;
  return geo;
}

function propagateAll(timeMs: number): Float32Array {
  const when = new Date(timeMs);
  const gmst = gstime(when);
  if (positions.length !== sats.length * SAT_STRIDE) {
    positions = new Float32Array(sats.length * SAT_STRIDE);
  }
  for (let i = 0; i < sats.length; i++) {
    const offset = i * SAT_STRIDE;
    const geo = propagateOne(sats[i].rec, when, gmst);
    if (!geo) {
      // Park failures below the surface; the shader drops anything with a negative altitude.
      positions[offset + 2] = -1;
      continue;
    }
    const lat = geo.latitude;
    const lng = geo.longitude;
    const cosLat = Math.cos(lat);
    positions[offset] = (lng / Math.PI + 1) / 2;
    positions[offset + 1] = mercatorY(lat);
    positions[offset + 2] = geo.height * 1000; // km → m
    positions[offset + 3] = Math.sin(lng) * cosLat;
    positions[offset + 4] = Math.sin(lat);
    positions[offset + 5] = Math.cos(lng) * cosLat;
  }
  return positions;
}

/**
 * One full revolution of a single satellite, for the selected-orbit track. Mercator X is
 * unwrapped so a pass over the antimeridian draws straight through instead of snapping back
 * across the globe.
 */
function propagateTrack(index: number, samples: number, startMs: number): Float32Array {
  const sat = sats[index];
  if (!sat) return new Float32Array(0);
  // revs/day → ms per revolution.
  const periodMs = (24 * 60 * 60 * 1000) / (sat.rec.no * 1440 / (2 * Math.PI));
  const out = new Float32Array(samples * 3);
  let previousX = Number.NaN;
  let wraps = 0;
  for (let i = 0; i < samples; i++) {
    const when = new Date(startMs + (periodMs * i) / (samples - 1));
    const geo = propagateOne(sat.rec, when, gstime(when));
    if (!geo) continue;
    let x = (geo.longitude / Math.PI + 1) / 2;
    if (Number.isFinite(previousX)) {
      if (x + wraps - previousX > 0.5) wraps -= 1;
      else if (x + wraps - previousX < -0.5) wraps += 1;
    }
    x += wraps;
    previousX = x;
    out[i * 3] = x;
    out[i * 3 + 1] = mercatorY(geo.latitude);
    out[i * 3 + 2] = geo.height * 1000;
  }
  return out;
}

/**
 * CelesTrak refuses a repeat download of the same group inside its update window — it answers
 * `403` with a plain-text "GP data has not updated since your last successful download" body
 * rather than re-serving the file. So the cache is not an optimisation: without it, any reload
 * within two hours would leave the globe with no satellites at all.
 *
 * Elements are kept in the Cache Storage API (available in workers, and localhost counts as a
 * secure context), stamped with a fetch time. Fresh cache wins outright; a stale entry is still
 * used if the refresh fails.
 */
const TLE_CACHE = 'watchtower-tle-v1';
const STAMP_HEADER = 'x-wt-fetched';

/**
 * In-flight dedupe. Two catalogue rows can share one CelesTrak group (NOAA is a name-filtered
 * slice of `weather`), and CelesTrak answers a concurrent second request for the same group with
 * `403` — so the request must be shared, not merely cached after the fact.
 */
const inFlight = new Map<string, Promise<string>>();

function cachedTleOnce(url: string, ttlMs: number): Promise<string> {
  const pending = inFlight.get(url);
  if (pending) return pending;
  const request = cachedTle(url, ttlMs).finally(() => inFlight.delete(url));
  inFlight.set(url, request);
  return request;
}

async function cachedTle(url: string, ttlMs: number): Promise<string> {
  let cache: Cache | null = null;
  try {
    cache = await caches.open(TLE_CACHE);
  } catch {
    cache = null; // no Cache API (private mode, insecure context) — fall through to the network
  }

  const hit = cache ? await cache.match(url) : undefined;
  const stampedAt = Number(hit?.headers.get(STAMP_HEADER) ?? 0);
  const fresh = hit && Date.now() - stampedAt < ttlMs;
  if (hit && fresh) return hit.text();

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    if (!text.includes('\n1 ')) throw new Error('not TLE payload');
    if (cache) {
      const headers = new Headers({ 'content-type': 'text/plain' });
      headers.set(STAMP_HEADER, String(Date.now()));
      await cache.put(url, new Response(text, { headers }));
    }
    return text;
  } catch (error) {
    // Serve stale rather than nothing — a few hours of drift beats an empty sky.
    if (hit) return hit.text();
    throw error;
  }
}

type LoadRequest = {
  type: 'load';
  ttlMs: number;
  groups: { id: string; index: number; url: string; nameFilter?: string }[];
};
type TickRequest = { type: 'tick'; time: number };
type TrackRequest = { type: 'track'; index: number; samples: number; time: number };

self.onmessage = async (event: MessageEvent<LoadRequest | TickRequest | TrackRequest>) => {
  const message = event.data;

  if (message.type === 'load') {
    const loaded: LoadedSat[][] = message.groups.map(() => []);
    const failures: string[] = [];
    await Promise.all(
      message.groups.map(async (group) => {
        try {
          const parsed = parseTle(
            await cachedTleOnce(group.url, message.ttlMs),
            group.index,
            group.nameFilter,
          );
          // Groups overlap upstream (a GOES bird is also in `weather`); first group wins so a
          // satellite is only drawn — and only counted — once.
          loaded[group.index] = parsed;
        } catch (error) {
          failures.push(`${group.id}: ${String(error).slice(0, 80)}`);
        }
      }),
    );

    // Flatten in catalogue order (not completion order) so "first group wins" is deterministic:
    // a name-filtered group listed above the group it draws from claims its satellites, and
    // genuine cross-group overlaps (a GOES bird also listed under `weather`) resolve the same way
    // on every load.
    const seen = new Set<number>();
    sats = loaded.flat().filter((sat) => {
      if (seen.has(sat.norad)) return false;
      seen.add(sat.norad);
      return true;
    });

    const groups = new Uint8Array(sats.length);
    sats.forEach((sat, i) => {
      groups[i] = sat.group;
    });
    self.postMessage(
      {
        type: 'loaded',
        count: sats.length,
        names: sats.map((sat) => sat.name),
        norads: sats.map((sat) => sat.norad),
        groups,
        failures,
      },
      [groups.buffer],
    );
    return;
  }

  if (message.type === 'tick') {
    const packed = propagateAll(message.time);
    const copy = packed.slice();
    self.postMessage({ type: 'positions', time: message.time, positions: copy }, [copy.buffer]);
    return;
  }

  if (message.type === 'track') {
    const track = propagateTrack(message.index, message.samples, message.time);
    self.postMessage({ type: 'track', index: message.index, track }, [track.buffer]);
  }
};
