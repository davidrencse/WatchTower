import { lazy, Suspense } from 'react';
import { loadCountryStatsDashboard } from '../lib/countryDashboardLoader';
import { slugForFlag } from '../lib/countryRoute';
import { getIso3ForFlagId } from '../lib/flagIsoMapping';
import type { FlagEntry } from '../types/flag';
import { AppErrorBoundary } from './AppErrorBoundary';
import { CountryPageIndustrialLoader } from './CountryPageIndustrialLoader';
import { CountryToBeCompletedPage } from './CountryToBeCompletedPage';

const CountryStatsDashboard = lazy(() =>
  loadCountryStatsDashboard().then((m) => ({ default: m.CountryStatsDashboard })),
);

type SelectedFlagViewProps = {
  flag: FlagEntry;
  onBack: () => void;
};

export function SelectedFlagView({ flag, onBack }: SelectedFlagViewProps) {
  const slug = slugForFlag(flag);
  // Every mapped country renders the Germany-derived dashboard layout. Countries with their own
  // CSVs fill it in; the rest keep the template's labeled placeholders. A flag with no ISO-3 has
  // nothing to key data off at all, so it stays on the pending page.
  const iso3 = getIso3ForFlagId(flag.id);
  if (iso3) {
    return (
      // Keyed on the country so navigating to a different dossier clears a previous failure
      // instead of leaving the boundary latched open on the new page.
      <AppErrorBoundary key={slug} context={flag.label}>
        <Suspense fallback={<CountryPageIndustrialLoader countryLabel={flag.label} />}>
          <CountryStatsDashboard
            flag={flag}
            iso3={iso3}
            actualIso3={iso3}
            crimeIso3={iso3}
            onBack={onBack}
          />
        </Suspense>
      </AppErrorBoundary>
    );
  }

  return <CountryToBeCompletedPage flag={flag} onBack={onBack} />;
}
