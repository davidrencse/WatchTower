import { useEffect } from 'react';
import { FLAGS } from '../data/flags';

/**
 * Warms the HTTP cache for every flag PNG so gallery / details load from disk cache.
 * Chunked via idle callbacks to avoid blocking the main thread.
 */
export function usePrefetchFlagImages(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const connection = (navigator as Navigator & {
      connection?: {
        saveData?: boolean;
        effectiveType?: string;
      };
    }).connection;
    if (connection?.saveData) return;
    if (connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g') return;

    const urls = FLAGS.map((f) => f.src);
    let cancelled = false;
    let i = 0;
    const chunk = 10;
    let idleId = 0;

    const step = () => {
      if (cancelled) return;
      const end = Math.min(i + chunk, urls.length);
      for (; i < end; i++) {
        const img = new Image();
        img.src = urls[i]!;
      }
      if (i < urls.length) {
        idleId = requestIdleCallback(step, { timeout: 2000 });
      }
    };

    idleId = requestIdleCallback(step, { timeout: 400 });
    return () => {
      cancelled = true;
      if (typeof cancelIdleCallback === 'function') {
        cancelIdleCallback(idleId);
      }
    };
  }, [enabled]);
}
