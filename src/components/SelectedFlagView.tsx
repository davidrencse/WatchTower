import { lazy, Suspense } from 'react';
import { FLAGS } from '../data/flags';
import { getIso3ForFlagId, flagIdHasCountryStats } from '../lib/flagIsoMapping';
import type { FlagEntry } from '../types/flag';
import { CountryFocusCarousel } from './CountryFocusCarousel';
import { CountryPageIndustrialLoader } from './CountryPageIndustrialLoader';

const CountryStatsDashboard = lazy(() =>
  import('./CountryStatsDashboard').then((m) => ({ default: m.CountryStatsDashboard })),
);

type SelectedFlagViewProps = {
  flag: FlagEntry;
  onBack: () => void;
  onSelectFlag?: (flag: FlagEntry) => void;
};

export function SelectedFlagView({ flag, onBack, onSelectFlag }: SelectedFlagViewProps) {
  if (flagIdHasCountryStats(flag.id)) {
    const iso3 = getIso3ForFlagId(flag.id);
    if (iso3) {
      return (
        <Suspense fallback={<CountryPageIndustrialLoader countryLabel={flag.label} />}>
          <CountryStatsDashboard
            flag={flag}
            iso3={iso3}
            onBack={onBack}
            allFlags={FLAGS}
            onSelectFlag={onSelectFlag}
          />
        </Suspense>
      );
    }
  }

  return (
    <div className="wt-dark-stage min-h-screen">
      <div className="mx-auto flex w-full max-w-[1360px] items-center justify-between px-6 pt-6 sm:px-10">
        <button
          type="button"
          onClick={onBack}
          className="font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-500 transition-colors hover:text-neutral-200"
        >
          ← Back
        </button>
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.32em] text-neutral-600">
          No dossier · browse other countries
        </p>
      </div>
      <CountryFocusCarousel
        flags={FLAGS}
        activeFlagId={flag.id}
        onActiveChange={(f) => {
          if (f.id !== flag.id) onSelectFlag?.(f);
        }}
        onSelect={(f) => {
          if (flagIdHasCountryStats(f.id)) onSelectFlag?.(f);
        }}
        showOpenAction
      />
    </div>
  );
}
