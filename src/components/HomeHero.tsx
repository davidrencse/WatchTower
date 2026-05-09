type HomeHeroProps = {
  onExplore: () => void;
};

export function HomeHero({ onExplore }: HomeHeroProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black px-5 py-16 text-neutral-100">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-45 grayscale"
        style={{ backgroundImage: 'url(/hero/europe.png), url(/hero/europe.svg)' }}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.10),rgba(0,0,0,0.0)_55%),linear-gradient(180deg,rgba(11,11,13,0.72)_0%,rgba(7,7,8,0.86)_40%,rgba(5,5,6,0.95)_100%)]"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-6xl">
        <div className="rounded-[2rem] border border-white/[0.10] bg-white/[0.04] p-2 shadow-[0_24px_80px_rgba(0,0,0,0.45)] ring-1 ring-white/[0.06]">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {/* Left (light) panel */}
            <section className="rounded-[1.6rem] bg-[#e9e9ea] p-6 text-neutral-900 shadow-[0_1px_0_rgba(255,255,255,0.65)_inset] sm:p-7">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-600">
                WatchTower
              </p>
              <h1 className="mt-3 font-sans text-3xl font-semibold leading-tight tracking-tight text-neutral-950 sm:text-4xl">
                Data & statistics for western first‑world countries
              </h1>
              <p className="mt-3 max-w-xl font-sans text-[13px] leading-relaxed text-neutral-600">
                This project is a culmination of data and statistics for western first world countries. The project
                primarily focuses on indicators for countries which affect the common native individual. Data will be
                regularly updated for relevance.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {['Cost of living', 'Safety', 'Health', 'Economy', 'Demographics', 'Policy'].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-black/10 bg-white/60 px-3 py-1 font-sans text-[11px] font-medium text-neutral-700 shadow-sm"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onExplore}
                  className="inline-flex items-center justify-center rounded-full border border-black/10 bg-neutral-950 px-5 py-2.5 font-sans text-[12px] font-semibold text-white shadow-[0_10px_26px_rgba(0,0,0,0.30)] transition hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e9e9ea]"
                >
                  Explore countries
                </button>
                <p className="font-sans text-[11px] text-neutral-600">
                  Browse flags, then drill into a country dashboard.
                </p>
              </div>
            </section>

            {/* Right (dark) panel */}
            <section className="relative overflow-hidden rounded-[1.6rem] bg-[#0f0f12] p-6 shadow-[0_1px_0_rgba(255,255,255,0.06)_inset] sm:p-7">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),rgba(0,0,0,0)_55%)]" />
              <div className="relative">
                <h2 className="font-sans text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  Built for clear comparisons
                </h2>
                <p className="mt-2 max-w-xl font-sans text-[12px] leading-relaxed text-neutral-400">
                  Focused, repeatable indicators that map to everyday outcomes. Each section is designed to be browsed
                  quickly and revisited as data updates.
                </p>

                <div className="mt-6 rounded-xl border border-white/[0.08] bg-black/20 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {['Economy', 'Safety', 'Health', 'Immigration', 'Taxes'].map((k) => (
                      <span
                        key={k}
                        className="rounded-full border border-white/[0.10] bg-white/[0.04] px-3 py-1 font-sans text-[10px] font-medium text-neutral-300"
                      >
                        {k}
                      </span>
                    ))}
                  </div>

                  {/* Decorative “diagram” (styling reference only) */}
                  <div className="mt-4 grid grid-cols-12 gap-3">
                    <div className="col-span-12 rounded-lg border border-white/[0.06] bg-white/[0.03] p-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="relative h-16 w-16 rounded-full border border-white/[0.14] bg-black/20">
                          <div className="absolute inset-2 rounded-full border border-white/[0.08]" />
                          <div className="absolute inset-0 rounded-full shadow-[0_0_0_8px_rgba(255,255,255,0.02)_inset]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
                            Snapshot
                          </p>
                          <p className="mt-1 font-sans text-[12px] text-neutral-300">
                            Fast tiles + deeper drill‑downs per section.
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {['Compare', 'Trends', 'Sources', 'Notes'].map((pill) => (
                          <div
                            key={pill}
                            className="rounded-md border border-white/[0.08] bg-black/20 px-3 py-2 font-sans text-[11px] text-neutral-300"
                          >
                            {pill}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.10] bg-white/[0.04] px-3 py-1 font-sans text-[11px] text-neutral-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/90" />
                    Regular updates
                  </span>
                  <button
                    type="button"
                    onClick={onExplore}
                    className="inline-flex items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.06] px-4 py-2 font-sans text-[11px] font-semibold text-white transition hover:bg-white/[0.10]"
                  >
                    Start exploring →
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>

        <p className="mt-8 text-center font-sans text-[11px] text-neutral-500">
          Built for reading, not doomscrolling.
        </p>
      </div>
    </div>
  );
}

