/**
 * Bridge from Recon to the OSINT image-geolocation engine embedded at `osint/`.
 *
 * That engine is a separate Next app in this repo. It is not bundled here and cannot be: it
 * decodes pixels with `sharp`, reads tags with `exifr` and holds the vision-provider key — all
 * Node-side concerns. WatchTower reaches it over `POST /api/geolocate`, which `api/geolocate.js`
 * forwards to `OSINT_API_URL` (default `http://127.0.0.1:3000/api/geolocate`, i.e. the embedded
 * app under `cd osint && npm run dev`). Same sidecar arrangement the OSINT tweet layer uses.
 *
 * **Everything this returns is weaker evidence than the in-tab EXIF read**, and the caller is
 * expected to keep saying so. The engine fuses four kinds of signal and only the first is a
 * measurement:
 *
 *  - `gps`      — EXIF/XMP fix written by the capturing device. A measurement.
 *  - `geocoded` — a place *name* (IPTC tag, sign text, landmark) run through OpenStreetMap.
 *  - `estimate` — a vision model's read of the pixels. An inference, city-scale at best.
 *
 * Deep scan therefore **uploads a browser-rasterized surrogate** to the engine, which validates
 * and rewrites it again before it may hand pixels to a vision provider. That is still a materially
 * different bargain from the offline EXIF pass, so it is never
 * automatic — `ReconLocator` only calls this when the operator asks for it by name.
 */

/** Precision class of a fused point. Mirrors `GeoKind` in `osint/src/lib/osint/types.ts`. */
export type OsintGeoKind = 'gps' | 'estimate' | 'geocoded';

/** One fused, ranked location. Mirrors `GeoPoint` in the engine. */
export interface OsintGeoPoint {
  lat: number;
  lon: number;
  label: string;
  /** Engine source id that produced it (`exif`, `geovision`, `geocode`, `refine`, `scene`…). */
  source: string;
  /** 0..1, boosted by noisy-OR when independent sources agree. */
  confidence: number;
  kind?: OsintGeoKind;
  /** Accuracy radius in km — how wide the claim actually is. */
  radiusKm?: number;
  /** How many independent sources landed on this spot. */
  corroboration?: number;
  /** Labels of those sources. */
  sources?: string[];
  elevationM?: number;
}

/** A note the engine wants shown alongside the points (landmark hits, reverse-search links). */
export interface OsintFinding {
  source: string;
  title: string;
  detail?: string;
  url?: string;
  severity?: 'info' | 'low' | 'medium' | 'high';
}

export interface OsintImageSecurityReport {
  name: string;
  detectedType: 'jpeg' | 'png' | 'webp' | 'gif' | 'tiff' | 'avif';
  width: number;
  height: number;
  originalSha256: string;
  sanitizedSha256: string;
  malwareScan: 'clean' | 'not-configured' | 'unavailable';
  hashReputation: 'clean' | 'unknown' | 'not-configured' | 'unavailable';
  steganography: 'clear' | 'review';
  findings: string[];
  disposition: 'sanitized';
}

/** The subset of the engine's `GeolocateResult` Recon actually renders. */
export interface OsintGeolocateResult {
  images: string[];
  geo: OsintGeoPoint[];
  findings: OsintFinding[];
  /** Sources the engine skipped for want of a key — e.g. the AI estimate with no `VISION_API_KEY`. */
  skipped: { source: string; key: string }[];
  errors: { source: string; entity: string; message: string }[];
  security: OsintImageSecurityReport[];
  durationMs: number;
}

/**
 * Why a deep scan produced nothing. Separated because the operator's next move differs:
 * `offline` means start the sidecar, `unconfigured` means set a key, `error` means read the text.
 */
export type DeepScanFailure = 'offline' | 'unconfigured' | 'too-large' | 'unsafe-file' | 'error';

export type DeepScanOutcome =
  | { ok: true; result: OsintGeolocateResult }
  | { ok: false; reason: DeepScanFailure; message: string };

const ENDPOINT = '/api/geolocate';

/**
 * The engine's slow path is a vision call plus a second refining call, and `maxDuration` on the
 * Next route is 120 s. Give up a little after it does rather than hanging the panel forever.
 */
const DEEP_SCAN_TIMEOUT_MS = 130_000;

/** Matches the per-file cap enforced by both the proxy and the engine's own route. */
export const MAX_DEEP_SCAN_BYTES = 12 * 1024 * 1024;

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

/**
 * Rebuild the payload field by field. It arrives from a sidecar the browser does not control, and
 * a point with a missing coordinate would otherwise fly the camera to null island.
 */
function parseResult(payload: unknown): OsintGeolocateResult | null {
  if (!payload || typeof payload !== 'object') return null;
  const raw = payload as Record<string, unknown>;

  const geo: OsintGeoPoint[] = (Array.isArray(raw.geo) ? raw.geo : [])
    .map((entry): OsintGeoPoint | null => {
      if (!entry || typeof entry !== 'object') return null;
      const point = entry as Record<string, unknown>;
      const lat = asNumber(point.lat);
      const lon = asNumber(point.lon);
      if (lat === undefined || lon === undefined) return null;
      if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;

      const kind = asString(point.kind);
      return {
        lat,
        lon,
        label: asString(point.label) ?? 'Unnamed location',
        source: asString(point.source) ?? 'unknown',
        confidence: Math.min(1, Math.max(0, asNumber(point.confidence) ?? 0)),
        kind: kind === 'gps' || kind === 'estimate' || kind === 'geocoded' ? kind : undefined,
        radiusKm: asNumber(point.radiusKm),
        corroboration: asNumber(point.corroboration),
        sources: Array.isArray(point.sources)
          ? point.sources.filter((s): s is string => typeof s === 'string')
          : undefined,
        elevationM: asNumber(point.elevationM),
      };
    })
    .filter((point): point is OsintGeoPoint => point !== null);

  const findings: OsintFinding[] = (Array.isArray(raw.findings) ? raw.findings : [])
    .map((entry): OsintFinding | null => {
      if (!entry || typeof entry !== 'object') return null;
      const finding = entry as Record<string, unknown>;
      const title = asString(finding.title);
      if (!title) return null;
      // Only ever surface links the operator can safely click; the engine embeds reverse-image
      // search URLs here and a non-http scheme has no business in an anchor.
      const url = asString(finding.url);
      const safeUrl = url && /^https?:\/\//i.test(url) ? url : undefined;
      return {
        source: asString(finding.source) ?? 'unknown',
        title,
        detail: asString(finding.detail),
        url: safeUrl,
      };
    })
    .filter((finding): finding is OsintFinding => finding !== null);

  const skipped = (Array.isArray(raw.skipped) ? raw.skipped : [])
    .map((entry) => entry as Record<string, unknown>)
    .map((entry) => ({ source: asString(entry.source) ?? '', key: asString(entry.key) ?? '' }))
    .filter((entry) => entry.source);

  const errors = (Array.isArray(raw.errors) ? raw.errors : [])
    .map((entry) => entry as Record<string, unknown>)
    .map((entry) => ({
      source: asString(entry.source) ?? '',
      entity: asString(entry.entity) ?? '',
      message: asString(entry.message) ?? '',
    }))
    .filter((entry) => entry.message);

  const security = (Array.isArray(raw.security) ? raw.security : [])
    .map((entry): OsintImageSecurityReport | null => {
      if (!entry || typeof entry !== 'object') return null;
      const report = entry as Record<string, unknown>;
      const detectedType = asString(report.detectedType);
      const malwareScan = asString(report.malwareScan);
      const hashReputation = asString(report.hashReputation);
      const steganography = asString(report.steganography);
      const disposition = asString(report.disposition);
      const width = asNumber(report.width);
      const height = asNumber(report.height);
      const originalSha256 = asString(report.originalSha256);
      const sanitizedSha256 = asString(report.sanitizedSha256);
      if (
        !['jpeg', 'png', 'webp', 'gif', 'tiff', 'avif'].includes(detectedType ?? '') ||
        !['clean', 'not-configured', 'unavailable'].includes(malwareScan ?? '') ||
        !['clean', 'unknown', 'not-configured', 'unavailable'].includes(hashReputation ?? '') ||
        !['clear', 'review'].includes(steganography ?? '') ||
        disposition !== 'sanitized' || width === undefined || height === undefined ||
        !originalSha256 || !sanitizedSha256
      ) return null;
      return {
        name: asString(report.name) ?? 'image',
        detectedType: detectedType as OsintImageSecurityReport['detectedType'],
        width,
        height,
        originalSha256,
        sanitizedSha256,
        malwareScan: malwareScan as OsintImageSecurityReport['malwareScan'],
        hashReputation: hashReputation as OsintImageSecurityReport['hashReputation'],
        steganography: steganography as OsintImageSecurityReport['steganography'],
        findings: Array.isArray(report.findings)
          ? report.findings.filter((finding): finding is string => typeof finding === 'string')
          : [],
        disposition: 'sanitized',
      };
    })
    .filter((entry): entry is OsintImageSecurityReport => entry !== null);

  return {
    images: (Array.isArray(raw.images) ? raw.images : []).filter(
      (name): name is string => typeof name === 'string',
    ),
    geo,
    findings,
    skipped,
    errors,
    security,
    durationMs: asNumber(raw.durationMs) ?? 0,
  };
}

/**
 * Upload one pre-rasterized image surrogate to the engine and return its ranked, fused points.
 *
 * Never throws for an expected condition — a stopped sidecar, a missing key and a rejected file
 * all come back as `{ ok: false }` with a reason the panel can act on. Only a caller-triggered
 * abort propagates, because that one is not a result.
 */
export async function deepScanImage(
  file: File,
  signal?: AbortSignal,
): Promise<DeepScanOutcome> {
  if (file.size > MAX_DEEP_SCAN_BYTES) {
    return {
      ok: false,
      reason: 'too-large',
      message: `Image is ${(file.size / 1e6).toFixed(1)} MB — the engine caps uploads at ${
        MAX_DEEP_SCAN_BYTES / 1e6
      } MB.`,
    };
  }

  const body = new FormData();
  body.append('image', file, file.name);

  const timeout = AbortSignal.timeout(DEEP_SCAN_TIMEOUT_MS);
  const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;

  let response: Response;
  try {
    response = await fetch(ENDPOINT, { method: 'POST', body, signal: combined });
  } catch (error) {
    if (signal?.aborted) throw error;
    if (timeout.aborted) {
      return { ok: false, reason: 'error', message: 'The engine did not answer in time.' };
    }
    // A dev server with no proxy, or the sidecar refusing the connection, both land here.
    return {
      ok: false,
      reason: 'offline',
      message: 'Could not reach the OSINT engine.',
    };
  }

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const detail = payload as Record<string, unknown> | null;
    const reason = asString(detail?.reason);
    return {
      ok: false,
      reason:
        reason === 'offline' || reason === 'unconfigured' || reason === 'too-large' || reason === 'unsafe-file'
          ? reason
          : 'error',
      message: asString(detail?.error) ?? `Engine returned ${response.status}.`,
    };
  }

  const result = parseResult(payload);
  if (!result) {
    return { ok: false, reason: 'error', message: 'Engine returned an unreadable response.' };
  }
  return { ok: true, result };
}
