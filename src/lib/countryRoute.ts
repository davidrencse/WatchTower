import { FLAGS } from '../data/flags';
import type { FlagEntry } from '../types/flag';

/**
 * URL routing between the browser path and the selected country. Each country dossier is a
 * shareable page such as `/germany` or `/france`, so a refresh, a direct link, or the browser
 * back/forward buttons all restore the same view. Slugs derive purely from the flag id, so no
 * separate table has to be kept in sync:
 *   `flag-of-France.png`         → `france`
 *   `flag-of-Czech-Republic.png` → `czech-republic`
 *   `flag-of-United-Kingdom.png` → `united-kingdom`
 */
export function slugForFlag(flag: FlagEntry): string {
  return flag.id
    .replace(/^flag-of-/i, '')
    .replace(/\.png$/i, '')
    .toLowerCase();
}

/** Absolute path for a country dossier, e.g. `/france`. Root (`/`) is the gallery/home. */
export function pathForFlag(flag: FlagEntry): string {
  return `/${slugForFlag(flag)}`;
}

/** Built once: slug → flag. */
const SLUG_TO_FLAG: ReadonlyMap<string, FlagEntry> = new Map(FLAGS.map((f) => [slugForFlag(f), f]));

/** Resolve a slug (e.g. `france`) to its flag, or null if unknown. Case-insensitive. */
export function flagForSlug(slug: string): FlagEntry | null {
  return SLUG_TO_FLAG.get(slug.toLowerCase()) ?? null;
}

/**
 * Resolve a full pathname (e.g. `/france`, `/`, or `/france/`) to a flag, or null for the
 * root/unknown paths. Only the first path segment is considered.
 */
export function flagForPath(pathname: string): FlagEntry | null {
  const segment = pathname.replace(/^\/+/, '').replace(/\/+$/, '').split('/')[0];
  if (!segment) return null;
  let decoded = segment;
  try {
    decoded = decodeURIComponent(segment);
  } catch {
    /* keep raw segment if it is not valid percent-encoding */
  }
  return flagForSlug(decoded);
}
