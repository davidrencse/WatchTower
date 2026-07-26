import { lazy, Suspense } from 'react';
import { slugForFlag } from '../lib/countryRoute';
import { getIso3ForFlagId } from '../lib/flagIsoMapping';
import type { FlagEntry } from '../types/flag';
import { CountryPageIndustrialLoader } from './CountryPageIndustrialLoader';
import { CountryToBeCompletedPage } from './CountryToBeCompletedPage';

const CountryStatsDashboard = lazy(() =>
  import('./CountryStatsDashboard').then((m) => ({ default: m.CountryStatsDashboard })),
);

const COMPLETED_COUNTRY_SLUGS = new Set(['germany', 'france', 'italy']);

/**
 * Warm the dashboard chunk (and its recharts dependency) ahead of selection so opening a
 * completed country dossier is instant. Safe to call repeatedly; the module cache dedupes it.
 */
export function prefetchCountryDashboard(): void {
  void import('./CountryStatsDashboard');
}

type SelectedFlagViewProps = {
  flag: FlagEntry;
  onBack: () => void;
};

/**
 * Countries scaffolded from France's page: they render France's dossier content verbatim under
 * their own flag/title shell, as clay to be sculpted into their own data section by section.
 * Identity (flag image, hero title, document title) comes from `flag`, so only the data `iso3`
 * is aliased here.
 */
const FRANCE_SCAFFOLD_SLUGS = new Set(['italy']);

export function SelectedFlagView({ flag, onBack }: SelectedFlagViewProps) {
  const slug = slugForFlag(flag);
  if (COMPLETED_COUNTRY_SLUGS.has(slug)) {
    const iso3 = getIso3ForFlagId(flag.id);
    if (iso3) {
      const dataIso3 = FRANCE_SCAFFOLD_SLUGS.has(slug) ? 'FRA' : iso3;
      return (
        <Suspense fallback={<CountryPageIndustrialLoader countryLabel={flag.label} />}>
          <CountryStatsDashboard
            flag={flag}
            iso3={dataIso3}
            actualIso3={iso3}
            crimeIso3={dataIso3}
            onBack={onBack}
          />
        </Suspense>
      );
    }
  }

  return <CountryToBeCompletedPage flag={flag} onBack={onBack} />;
}

