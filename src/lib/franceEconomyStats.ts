import type { CountryStatMetric } from '../types/countryStats';

export type EconomicStructuralIndicator = {
  id: string;
  title: string;
  valueMain: string;
  valueSub: string;
  details: string;
  source: string;
};

/** Secondary economy tiles below the six lead metrics (France). */
export const FRANCE_ECONOMIC_STRUCTURAL_INDICATORS: readonly EconomicStructuralIndicator[] = [
  {
    id: 'public-debt-gdp',
    title: 'Public debt (% of GDP)',
    valueMain: '115.5%',
    valueSub: '(end 2025)',
    details:
      'General government debt remains among the highest in the euro area; consolidation and interest costs weigh on fiscal room.',
    source: 'INSEE / European Commission (end 2025).',
  },
  {
    id: 'budget-deficit',
    title: 'Government budget deficit',
    valueMain: '5.1%',
    valueSub: 'of GDP (2025)',
    details:
      'Deficit above the EU reference level, reflecting spending pressures, energy support, and weaker growth.',
    source: 'European Commission (2025).',
  },
  {
    id: 'productivity',
    title: 'Labour productivity',
    valueMain: 'Modest growth',
    valueSub: 'after years of stagnation; +0.6% early 2025',
    details:
      'France has performed better than Germany and most large Eurozone peers in the post-COVID recovery, though overall productivity remains below its pre-2019 trend.',
    source: 'Eurostat and INSEE (2025 data).',
  },
  {
    id: 'youth-unemployment',
    title: 'Youth unemployment (15-24)',
    valueMain: '10.2%',
    valueSub: '(2025 avg)',
    details:
      'Below the euro-area youth average in some years but still a structural challenge for entry-level hiring.',
    source: 'INSEE (2025 avg).',
  },
  {
    id: 'current-account',
    title: 'Current account surplus',
    valueMain: '+4.5%',
    valueSub: 'of GDP',
    details:
      'External balance supported by goods exports, tourism, and income flows; energy import costs remain a swing factor.',
    source: 'Deutsche Bundesbank / INSEE.',
  },
  {
    id: 'public-debt-total',
    title: 'Total public debt (absolute)',
    valueMain: '€2.84T',
    valueSub: '(end 2025)',
    details: 'General government gross debt stock (federal and social-security components per national accounts).',
    source: 'Deutsche Bundesbank (end 2025).',
  },
  {
    id: 'oil-dependency',
    title: 'Oil dependency',
    valueMain: '98%',
    valueSub: 'imported',
    details:
      'Domestic crude production is minimal; refining and strategic stocks buffer short-term shocks but imports dominate supply.',
    source: 'Official energy reports.',
  },
  {
    id: 'gold-reserves',
    title: 'Gold reserves',
    valueMain: '3,350',
    valueSub: 'tonnes',
    details: 'Among the largest official gold holdings globally; held as a reserve asset by the Banque de France.',
    source: 'Official holdings.',
  },
  {
    id: 'credit-rating',
    title: 'Credit rating',
    valueMain: 'AAA',
    valueSub: '(stable) — S&P, Moody’s, Fitch',
    details:
      'Top-tier sovereign ratings retained despite elevated debt, underpinned by deep markets and institutional capacity.',
    source: 'S&P / Moody’s / Fitch.',
  },
];

export const FRANCE_ECONOMIC_STRUCTURAL_GROUP_COUNT = FRANCE_ECONOMIC_STRUCTURAL_INDICATORS.length;

function patchMetric(
  metrics: CountryStatMetric[],
  metric: string,
  patch: Partial<CountryStatMetric>,
): CountryStatMetric[] {
  const idx = metrics.findIndex((m) => m.metric === metric);
  const base: CountryStatMetric =
    idx >= 0
      ? { ...metrics[idx]! }
      : {
          metric,
          value: 'N/A',
          reference_period: '',
          geography_used: 'France',
          source_name: '',
          source_url: '',
          source_publication_or_access_date: '',
          notes: '',
        };
  const updated = { ...base, ...patch };
  if (idx >= 0) {
    const out = [...metrics];
    out[idx] = updated;
    return out;
  }
  return [...metrics, updated];
}

/** Lead Economy tiles for France (GDP, macro indicators). */
export function applyFranceEconomyMetricOverrides(metrics: CountryStatMetric[]): CountryStatMetric[] {
  let m = metrics;
  m = patchMetric(m, 'GDP', {
    value: '$3,061 billion',
    reference_period: '2024',
    source_publication_or_access_date: '2024',
    notes: 'INSEE / IMF (2024 final).',
  });
  m = patchMetric(m, 'GDP per capita', {
    value: '$46,100',
    reference_period: '2024',
    source_publication_or_access_date: '2024',
    notes: 'IMF / World Bank (2024).',
  });
  m = patchMetric(m, 'Inflation', {
    value: '2.2%',
    reference_period: 'April 2026',
    source_publication_or_access_date: 'April 2026',
    notes: 'INSEE (April 2026).',
  });
  m = patchMetric(m, 'Unemployment', {
    value: '8.1%',
    reference_period: 'Q1 2026',
    source_publication_or_access_date: 'Q1 2026',
    notes: 'INSEE (Q1 2026).',
  });
  m = patchMetric(m, 'Interest', {
    value: '2.15%',
    reference_period: '2026',
    source_publication_or_access_date: '2026',
    notes: 'ECB / French 10-year bond.',
  });
  m = patchMetric(m, 'Real Median Wage', {
    value: '€2,830 monthly',
    reference_period: '2025',
    source_publication_or_access_date: '2025',
    notes: 'INSEE / Eurostat (latest 2025).',
  });
  return m;
}
