import type { FlagEntry } from '../types/flag';

type CountryToBeCompletedPageProps = {
  flag: FlagEntry;
  onBack: () => void;
};

export function CountryToBeCompletedPage({ flag, onBack }: CountryToBeCompletedPageProps) {
  return (
    <div className="wt-dark-stage min-h-screen min-h-[100dvh] overflow-x-hidden">
      <div className="relative z-10 flex min-h-screen min-h-[100dvh] flex-col">
        <header className="mx-auto flex w-full max-w-[1360px] items-center justify-between px-6 py-6 sm:px-10">
          <button
            type="button"
            onClick={onBack}
            className="min-h-11 rounded-sm px-2 font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-500 transition-colors hover:text-neutral-200 active:text-neutral-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-focus)]"
          >
            ← Back
          </button>
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.3em] text-neutral-600 sm:text-[10px]">
            Country dossier
          </p>
        </header>

        <main className="mx-auto flex w-full max-w-[1360px] flex-1 items-center px-6 pb-24 pt-10 sm:px-10">
          <section className="relative w-full border-y border-white/10 py-14 sm:py-20" aria-labelledby="completion-title">
            <img
              src={flag.src}
              alt=""
              className="pointer-events-none absolute right-0 top-1/2 h-48 w-72 -translate-y-1/2 object-contain opacity-[0.06] grayscale sm:h-72 sm:w-[28rem] lg:w-[38rem]"
              aria-hidden="true"
            />

            <div className="relative max-w-5xl">
              <div className="mb-8 flex items-center gap-4">
                <span className="h-px w-10 bg-white/40" aria-hidden="true" />
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-neutral-500">
                  {flag.label} / Pending publication
                </p>
              </div>

              <h1
                id="completion-title"
                className="max-w-5xl font-sans text-[clamp(3.4rem,10vw,9rem)] font-black uppercase leading-[0.82] tracking-[-0.065em] text-neutral-100"
              >
                To Be
                <br />
                Completed
              </h1>

              <p className="mt-9 max-w-md font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-neutral-500 sm:text-[11px]">
                Research and publication in progress.
              </p>
            </div>
          </section>
        </main>

        <footer className="mx-auto flex w-full max-w-[1360px] justify-between px-6 pb-7 font-mono text-[8px] uppercase tracking-[0.2em] text-neutral-600 sm:px-10">
          <span>WatchTower archive</span>
          <span>File status / incomplete</span>
        </footer>
      </div>
    </div>
  );
}
