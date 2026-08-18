/**
 * Session-level cache for the static `/data/*.csv` tables.
 *
 * Dossier sections live inside `CollapsibleFlagSection`, which unmounts its children when a
 * section is collapsed. Without a cache every expand re-ran the same fetch *and* re-parsed the
 * same text, so opening a section a second time cost exactly as much as the first. These
 * tables are build-time artifacts mirrored into `public/data`, so they never change within a
 * session and are safe to hold for the lifetime of the page.
 *
 * Two levels are cached:
 *  - the raw text, keyed by URL;
 *  - the parsed result, keyed by URL *and* parser identity, so each table is parsed once
 *    regardless of how many sections read it.
 */

/** In-flight and completed text requests, keyed by URL. */
const textRequests = new Map<string, Promise<string>>();

/** Resolved text, so a remount can read synchronously instead of flashing a loading state. */
const settledText = new Map<string, string>();

/**
 * Text for a already-loaded CSV, or `undefined` if it has not resolved yet.
 * Lets a remounting component render cached data on its very first paint.
 */
export function peekCsvText(url: string): string | undefined {
  return settledText.get(url);
}

/**
 * Fetch a static CSV, sharing one request across every caller.
 *
 * A non-OK response resolves to an empty string, matching the previous per-component
 * behaviour where callers keep their bundled fallback rather than surfacing an error.
 */
export function loadCsvText(url: string): Promise<string> {
  const cached = textRequests.get(url);
  if (cached) return cached;

  const request = fetch(url, { cache: 'force-cache' })
    .then((response) => (response.ok ? response.text() : ''))
    .then((text) => {
      settledText.set(url, text);
      return text;
    });

  // Drop failures so a transient network error can be retried on the next mount.
  request.catch(() => {
    textRequests.delete(url);
  });

  textRequests.set(url, request);
  return request;
}

/** Parsed results, keyed by URL then by parser identity. */
const parsed = new Map<string, Map<unknown, unknown>>();

/**
 * Parse a CSV once per (url, parser) pair. `parse` must be a stable module-level function —
 * an inline arrow would be a new identity on every call and defeat the cache.
 *
 * The shared country-agnostic tables (the merged stats table alone is ~190 KB) were re-parsed
 * from cached text on every country navigation. The text cache above saved the request; this
 * saves the parse, so switching dossiers no longer re-walks the same characters.
 */
export function parseCsvCached<T>(url: string, text: string, parse: (raw: string) => T): T {
  let byParser = parsed.get(url);
  if (!byParser) {
    byParser = new Map();
    parsed.set(url, byParser);
  }
  if (byParser.has(parse)) return byParser.get(parse) as T;
  const result = parse(text);
  byParser.set(parse, result);
  return result;
}

/** Testing/debug escape hatch — drops every cached table. */
export function clearCsvCache(): void {
  textRequests.clear();
  settledText.clear();
  parsed.clear();
}
