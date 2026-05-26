type HomeHeroProps = {
  onExplore: () => void;
};

export function HomeHero({ onExplore }: HomeHeroProps) {
  return (
    <div className="relative min-h-screen min-h-[100dvh] overflow-hidden px-5 py-12 text-neutral-100 sm:px-8 sm:py-16">
      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-6rem)] w-full max-w-6xl items-center justify-center sm:min-h-[calc(100vh-8rem)]">
        <section
          className={[
            'w-full max-w-3xl overflow-hidden rounded-[2rem] sm:rounded-[2.25rem]',
            'border border-white/[0.22]',
            'bg-white/[0.06] shadow-[0_32px_80px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.04)_inset,inset_0_1px_0_rgba(255,255,255,0.14)]',
            'backdrop-blur-[22px] backdrop-saturate-150',
            'supports-[backdrop-filter]:bg-white/[0.055]',
          ].join(' ')}
        >
          <div className="border-b border-white/[0.12] bg-gradient-to-b from-white/[0.07] to-transparent px-6 py-5 sm:px-8 sm:py-6">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-300/90">
              Project WatchTower
            </p>
            <p className="mt-1 font-sans text-[13px] text-neutral-200/85">
              Western-first-world country intelligence
            </p>
          </div>

          <div className="px-6 py-6 sm:px-8 sm:py-8">
            <h1 className="font-sans text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl">
              Global Reconnaissance
            </h1>

            <p className="mt-6 font-sans text-[14px] leading-relaxed text-neutral-200/88">
              This project is a culmination of data and statistics for western first world countries. The project
              primarily focuses on indicators for countries which affect the common native individual. Data will be
              regularly updated for relevance.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.12] bg-white/[0.03] px-6 py-5 backdrop-blur-sm sm:px-8 sm:py-6">
            <div>
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400/90">
                Coverage
              </p>
              <p className="mt-1 font-sans text-[12px] text-neutral-300/85">
                Project is a work in progress, issues will be expected.
              </p>
            </div>
            <button
              type="button"
              onClick={onExplore}
              className={[
                'inline-flex shrink-0 items-center justify-center rounded-2xl px-7 py-3',
                'font-sans text-[15px] font-semibold text-white',
                'border border-white/[0.28] bg-white/[0.12] shadow-[0_8px_24px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.2)]',
                'backdrop-blur-md transition',
                'hover:border-white/[0.38] hover:bg-white/[0.18] hover:shadow-[0_12px_32px_rgba(0,0,0,0.28)]',
                'active:scale-[0.98]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
              ].join(' ')}
            >
              Explore
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
