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

      <div className="relative mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-6xl items-center justify-center">
        <section className="w-full max-w-3xl overflow-hidden rounded-[1.9rem] border border-white/[0.12] bg-[#0e0f11] shadow-[0_24px_70px_rgba(0,0,0,0.5)] ring-1 ring-white/[0.05]">
          <div className="border-b border-white/[0.07] px-6 py-5 sm:px-7">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">Project WatchTower</p>
            <p className="mt-1 font-sans text-[13px] text-neutral-300">Western-first-world country intelligence</p>
          </div>

          <div className="px-6 py-6 sm:px-7 sm:py-7">
            <h1 className="font-sans text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl">
              Global Reconnaissance 
            </h1>

            <p className="mt-6 font-sans text-[14px] leading-relaxed text-neutral-300">
              This project is a culmination of data and statistics for western first world countries. The project
              primarily focuses on indicators for countries which affect the common native individual. Data will be
              regularly updated for relevance.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.07] px-6 py-5 sm:px-7">
            <div>
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">Coverage</p>
              <p className="mt-1 font-sans text-[12px] text-neutral-300">Project is a work in progress, issues will be expected.</p>
            </div>
            <button
              type="button"
              onClick={onExplore}
              className="inline-flex items-center justify-center rounded-xl border border-white/[0.12] bg-[#f2f2f3] px-6 py-2.5 font-sans text-[15px] font-semibold text-black transition hover:bg-white"
            >
              Explore
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

