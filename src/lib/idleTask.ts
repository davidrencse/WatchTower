export type CancelIdleTask = () => void;

/**
 * Schedule non-critical work without assuming `requestIdleCallback` exists.
 * Safari still lacks that API, so fall back to a short timer instead of
 * crashing when the gallery mounts.
 */
export function scheduleIdleTask(
  callback: IdleRequestCallback,
  timeout = 1000,
): CancelIdleTask {
  if (typeof window === 'undefined') return () => {};

  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(callback, { timeout });
    return () => {
      if (typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(id);
      }
    };
  }

  const startedAt = performance.now();
  const id = window.setTimeout(() => {
    callback({
      didTimeout: true,
      timeRemaining: () => Math.max(0, 16 - (performance.now() - startedAt)),
    });
  }, Math.min(timeout, 160));

  return () => window.clearTimeout(id);
}
