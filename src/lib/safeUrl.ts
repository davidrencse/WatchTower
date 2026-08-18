/**
 * URL guards for values that arrive from outside the bundle.
 *
 * Anything reaching an `href` or a `src` after a network hop — Hacker News submissions, the
 * OSINT pins service, Microlink's og:image resolution — is attacker-influencable in principle.
 * React escapes *text*, but it does not vet URL schemes: `href="javascript:…"` still executes
 * on click. These helpers are the single place that decides which schemes are allowed, so the
 * answer cannot drift between call sites.
 */

/** Schemes that are safe to navigate to. Deliberately excludes `javascript:` and `data:`. */
const NAVIGABLE_PROTOCOLS = new Set(['http:', 'https:']);

/** Schemes an <img src> may use. `data:`/`blob:` are inert for images and are used by previews. */
const IMAGE_PROTOCOLS = new Set(['http:', 'https:', 'data:', 'blob:']);

function parse(value: unknown, base?: string): URL | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    return new URL(trimmed, base);
  } catch {
    return null;
  }
}

/**
 * Returns `value` when it is an http(s) URL safe to put in an `href`, otherwise `null`.
 * Callers should render the link only when this returns non-null.
 *
 * Relative URLs are rejected unless a `base` is supplied — a bare `/foo` from a remote feed is
 * far more likely to be a bug than an intentional same-origin link.
 */
export function safeExternalUrl(value: unknown, base?: string): string | null {
  const url = parse(value, base);
  if (!url || !NAVIGABLE_PROTOCOLS.has(url.protocol)) return null;
  return url.toString();
}

/** Same contract as {@link safeExternalUrl}, for `<img src>`. Allows `data:`/`blob:` previews. */
export function safeImageUrl(value: unknown): string | null {
  const url = parse(value);
  if (!url || !IMAGE_PROTOCOLS.has(url.protocol)) return null;
  return url.toString();
}
