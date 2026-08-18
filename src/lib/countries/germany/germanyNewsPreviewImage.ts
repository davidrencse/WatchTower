import { safeExternalUrl, safeImageUrl } from '../../safeUrl';

const CACHE_PREFIX = 'darkrecon:germany-news-img:';

/** Cached marker for "this article has no usable og:image", so the miss is only paid once. */
const NO_IMAGE = 'none';

function remember(target: string, value: string): void {
  try {
    sessionStorage.setItem(CACHE_PREFIX + target, value);
  } catch {
    /* private mode */
  }
}

/** Serialize Microlink calls so we stay under typical free-tier burst limits when many thumbs load. */
let tail = Promise.resolve();

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Resolves og:image (and similar) for an article URL via Microlink's public API.
 * Reuters blocks direct browser/server HTML fetch; Microlink prerenders the page.
 */
export async function resolveGermanyNewsImageViaMicrolink(articleUrl: string): Promise<string | null> {
  // Only ask Microlink about URLs we would be willing to link to in the first place.
  const target = safeExternalUrl(articleUrl);
  if (!target) return null;

  try {
    const cached = sessionStorage.getItem(CACHE_PREFIX + target);
    // A remembered miss short-circuits too: without it every remount of the news rail re-queued
    // a Microlink call for each article that has no og:image, at one request per gap interval.
    if (cached === NO_IMAGE) return null;
    const hit = safeImageUrl(cached);
    if (hit) return hit;
  } catch {
    /* private mode */
  }

  const api = `https://api.microlink.io/?url=${encodeURIComponent(target)}`;
  try {
    const res = await fetch(api);
    const json: { status?: string; data?: { image?: { url?: string } }; message?: string } = await res.json();
    // The og:image URL is chosen by the article's publisher and relayed by a third party —
    // vet the scheme before it becomes an <img src>.
    const u = safeImageUrl(json.data?.image?.url);
    if (json.status === 'success' && u) {
      remember(target, u);
      return u;
    }
    remember(target, NO_IMAGE);
  } catch {
    /* network / JSON */
  }
  return null;
}

/** Queue work with a gap between jobs. */
export function queueGermanyNewsMicrolink<T>(gapMs: number, fn: () => Promise<T>): Promise<T> {
  const job = tail.then(() => sleep(gapMs)).then(fn);
  tail = job.then(
    () => {},
    () => {},
  );
  return job;
}
