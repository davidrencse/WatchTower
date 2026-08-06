import { useEffect, useState } from 'react';
import { loadCsvText, peekCsvText } from '../lib/csvCache';

export type CsvTextState = {
  /** CSV text, or the caller's fallback until the fetch resolves. */
  text: string;
  /** Non-null only when the request threw (offline, DNS, aborted transport). */
  error: string | null;
};

/**
 * Loads a static `/data/*.csv` through the shared cache.
 *
 * Replaces the fetch-effect that used to be copy-pasted into every dossier section. Because
 * collapsing a section unmounts it, the cache matters: a re-expand resolves synchronously from
 * `peekCsvText` and renders real data on the first paint instead of flashing the fallback.
 *
 * An empty or non-OK response leaves `fallback` in place — several sections ship a bundled
 * copy of their table and only upgrade to the fetched one when it actually has content.
 */
export function useCsvText(url: string, fallback = '', errorMessage?: string): CsvTextState {
  const [text, setText] = useState(() => (url ? peekCsvText(url) : undefined) ?? fallback);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // An empty URL means the caller supplied its table inline — fetching '' would request the
    // current document and hand back HTML.
    if (!url) return;

    const cached = peekCsvText(url);
    if (cached !== undefined) {
      if (cached.trim()) setText(cached);
      setError(null);
      return;
    }

    let cancelled = false;
    loadCsvText(url)
      .then((loaded) => {
        if (cancelled || !loaded.trim()) return;
        setText(loaded);
        setError(null);
      })
      .catch((cause: unknown) => {
        if (cancelled) return;
        setError(errorMessage ?? (cause instanceof Error ? cause.message : 'Failed to load data.'));
      });

    return () => {
      cancelled = true;
    };
  }, [url, errorMessage]);

  return { text, error };
}
