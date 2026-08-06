import { lazy, Suspense } from 'react';
import { slugForFlag } from '../lib/countryRoute';
import { getIso3ForFlagId } from '../lib/flagIsoMapping';
import type { FlagEntry } from '../types/flag';
import { CountryPageIndustrialLoader } from './CountryPageIndustrialLoader';
import { CountryToBeCompletedPage } from './CountryToBeCompletedPage';

let dashboardModulePromise: Promise<typeof import('./CountryStatsDashboard')> | null = null;
const loadCountryStatsDashboard = () => {
  dashboardModulePromise ??= import('./CountryStatsDashboard');
  return dashboardModulePromise;
};
const CountryStatsDashboard = lazy(() =>
  loadCountryStatsDashboard().then((m) => ({ default: m.CountryStatsDashboard })),
);

const COMPLETED_COUNTRY_SLUGS = new Set(['germany', 'france', 'italy', 'spain']);

/**
 * Warm the dashboard chunk (and its recharts dependency) ahead of selection so opening a
 * completed country dossier is instant. Safe to call repeatedly; the module cache dedupes it.
 */
export function prefetchCountryDashboard(): void {
  void loadCountryStatsDashboard();
}

type SelectedFlagViewProps = {
  flag: FlagEntry;
  onBack: () => void;
};

export function SelectedFlagView({ flag, onBack }: SelectedFlagViewProps) {
  const slug = slugForFlag(flag);
  if (COMPLETED_COUNTRY_SLUGS.has(slug)) {
    const iso3 = getIso3ForFlagId(flag.id);
    if (iso3) {
      return (
        <Suspense fallback={<CountryPageIndustrialLoader countryLabel={flag.label} />}>
          <CountryStatsDashboard
            flag={flag}
            iso3={iso3}
            actualIso3={iso3}
            crimeIso3={iso3}
            onBack={onBack}
          />
        </Suspense>
      );
    }
  }

  return <CountryToBeCompletedPage flag={flag} onBack={onBack} />;
}

