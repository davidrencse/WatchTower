import type { FlagEntry } from '../types/flag';
import { briefFor } from '../lib/countryBriefStats';

type CountryHeroContentProps = {
  flag: FlagEntry;
  onOpen?: (flag: FlagEntry) => void;
  showOpenAction?: boolean;
};

/** Centerpiece panel — big flag, soft caption below. Matches "perfect dark shadow" reference. */
export function CountryHeroContent({ flag, onOpen, showOpenAction = false }: CountryHeroContentProps) {
  const brief = briefFor(flag.id, flag.label);

  return (
    <div
      key={flag.id}
      className="wt-focus-fade relative z-[1] flex h-full min-h-0 w-full flex-col px-8 pb-6 pt-8 sm:px-12 sm:pb-8 sm:pt-10"
    >
      <div className="relative flex min-h-0 flex-1 items-center justify-center">
        <img
          src={flag.src}
          alt={flag.label}
          draggable={false}
          className="max-h-full max-w-full object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.55)]"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      </div>

      <div className="mt-6 flex items-end justify-between gap-4 sm:mt-8">
        <div>
          <h2 className="font-sans text-[26px] font-semibold leading-none tracking-tight text-white sm:text-[30px]">
            {flag.label}
          </h2>
          <p className="mt-1.5 font-sans text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-500">
            {brief.region}
            {brief.euMember ? <span className="text-neutral-600"> · EU member</span> : null}
            {!brief.hasDossier ? <span className="text-neutral-600"> · No dossier</span> : null}
          </p>
        </div>

        {showOpenAction ? (
          <button
            type="button"
            onClick={() => onOpen?.(flag)}
            disabled={!brief.hasDossier}
            className={[
              'inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2',
              'font-sans text-[10px] font-semibold uppercase tracking-[0.18em]',
              'border border-white/[0.2] bg-white/[0.06] text-neutral-100',
              'shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-sm',
              'transition hover:enabled:border-white/30 hover:enabled:bg-white/[0.12]',
              'disabled:cursor-not-allowed disabled:opacity-30',
            ].join(' ')}
          >
            {brief.hasDossier ? 'Open dossier' : 'Unavailable'}
            <span aria-hidden className="text-neutral-500">→</span>
          </button>
        ) : null}
      </div>
    </div>
  );
}
