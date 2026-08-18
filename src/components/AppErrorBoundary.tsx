import { Component, type ErrorInfo, type ReactNode } from 'react';

/**
 * Last line of defence for render-time failures.
 *
 * Two failure modes reach here, and they need different remedies:
 *  - a genuine render throw in a dossier section — recoverable by remounting the subtree, so the
 *    boundary offers "try again" and resets its own state;
 *  - a dynamic `import()` that 404s. Every dossier is a lazily-loaded chunk with a content-hashed
 *    filename, so a deploy that lands while a tab is open invalidates the URLs that tab still
 *    holds. Remounting cannot fix that — the browser has to re-fetch `index.html` — so the
 *    boundary detects it and offers a reload instead.
 *
 * Without this, either case unmounts the whole tree and leaves a blank page.
 */

/** A failed chunk request. Message text varies per browser, so match all the known shapes. */
function isChunkLoadError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return (
    error.name === 'ChunkLoadError' ||
    /Loading chunk|Importing a module script failed|error loading dynamically imported module|Failed to fetch dynamically imported module/i.test(
      error.message,
    )
  );
}

type AppErrorBoundaryProps = {
  children: ReactNode;
  /** Shown above the heading, e.g. the country being opened. */
  context?: string;
  /** Rendered instead of the default stage — used where a full-page takeover would be wrong. */
  fallback?: ReactNode;
};

type AppErrorBoundaryState = { error: Error | null };

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // No telemetry sink in this app yet; the console is the only place a report can go.
    console.error('[WatchTower] Unhandled render error', error, info.componentStack);
  }

  private reset = () => this.setState({ error: null });

  private reload = () => window.location.reload();

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    const stale = isChunkLoadError(error);

    return (
      <div className="wt-dark-stage min-h-screen min-h-[100dvh] overflow-x-hidden">
        <div className="relative z-10 flex min-h-screen min-h-[100dvh] flex-col">
          <header className="mx-auto flex w-full max-w-[1360px] items-center justify-between px-6 py-6 sm:px-10">
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.3em] text-neutral-600 sm:text-[10px]">
              WatchTower
            </p>
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.3em] text-neutral-600 sm:text-[10px]">
              {stale ? 'Update available' : 'Fault'}
            </p>
          </header>

          <main className="mx-auto flex w-full max-w-[1360px] flex-1 items-center px-6 pb-24 pt-10 sm:px-10">
            <section
              className="relative w-full border-y border-white/10 py-14 sm:py-20"
              aria-labelledby="error-title"
            >
              <div className="relative max-w-5xl">
                <div className="mb-8 flex items-center gap-4">
                  <span className="h-px w-10 bg-white/40" aria-hidden="true" />
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-neutral-500">
                    {this.props.context ? `${this.props.context} / ` : ''}
                    {stale ? 'Stale session' : 'Unexpected error'}
                  </p>
                </div>

                <h1
                  id="error-title"
                  className="max-w-5xl font-sans text-[clamp(3.4rem,10vw,9rem)] font-black uppercase leading-[0.82] tracking-[-0.065em] text-neutral-100"
                >
                  {stale ? (
                    <>
                      Reload
                      <br />
                      Required
                    </>
                  ) : (
                    <>
                      Something
                      <br />
                      Broke
                    </>
                  )}
                </h1>

                <p
                  role="alert"
                  className="mt-9 max-w-md font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-neutral-500 sm:text-[11px]"
                >
                  {stale
                    ? 'A new version was published while this page was open.'
                    : 'This view failed to render. The rest of the atlas is unaffected.'}
                </p>

                <button
                  type="button"
                  onClick={stale ? this.reload : this.reset}
                  className="mt-10 min-h-11 rounded-sm border border-white/20 px-5 font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-300 transition-colors hover:border-white/40 hover:text-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-focus)]"
                >
                  {stale ? 'Reload page' : 'Try again'}
                </button>
              </div>
            </section>
          </main>

          <footer className="mx-auto flex w-full max-w-[1360px] justify-between px-6 pb-7 font-mono text-[8px] uppercase tracking-[0.2em] text-neutral-600 sm:px-10">
            <span>WatchTower archive</span>
            <span>File status / error</span>
          </footer>
        </div>
      </div>
    );
  }
}
