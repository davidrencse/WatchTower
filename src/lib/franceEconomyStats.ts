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
    valueMain: '115.6%',
    valueSub: '(end 2025)',
    details:
      'General government debt remains among the highest in the euro area; consolidation and interest costs weigh on fiscal room.',
    source: 'End of 2025.',
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
    valueMain: '+0.44%',
    valueSub: '(2024)',
    details:
      'Latest France-specific annual labour-productivity figure.',
    source: 'France-specific annual figure (2024).',
  },
  {
    id: 'youth-unemployment',
    title: 'Youth unemployment (15-24)',
    valueMain: '21.1%',
    valueSub: '(Q1 2026)',
    details:
      'Unemployment rate among people aged 15 to 24.',
    source: 'Q1 2026.',
  },
  {
    id: 'current-account',
    title: 'Current-account balance',
    valueMain: '≈−0.4%',
    valueSub: 'of GDP (2026 projection)',
    details:
      'Projected current-account deficit as a share of gross domestic product.',
    source: '2026 projection.',
  },
  {
    id: 'public-debt-total',
    title: 'Total public debt (absolute)',
    valueMain: '€3.536T',
    valueSub: '(Q1 2026)',
    details: 'General government gross debt stock (federal and social-security components per national accounts).',
    source: 'Q1 2026.',
  },
  {
    id: 'oil-dependency',
    title: 'Oil dependency',
    valueMain: '≈98%',
    valueSub: 'imported',
    details:
      'France produces about 0.8 Mt domestically versus roughly 46.5 Mt imported.',
    source: 'Official energy reports.',
  },
  {
    id: 'gold-reserves',
    title: 'Gold reserves',
    valueMain: '2,436.8',
    valueSub: 'tonnes (2026)',
    details: 'Among the largest official gold holdings globally; held as a reserve asset by the Banque de France.',
    source: 'Official holdings.',
  },
  {
    id: 'credit-rating',
    title: 'Credit rating',
    valueMain: 'A+ stable',
    valueSub: 'S&P (May 2026) · Fitch (March 2026)',
    details:
      'Moody’s: Aa3 negative (April 2026).',
    source: 'S&P / Fitch / Moody’s (2026).',
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
    value: '$3.6 trillion',
    reference_period: 'IMF 2026 estimate',
    source_name: 'IMF',
    source_url: '',
    source_publication_or_access_date: '2026',
    notes: 'IMF 2026 estimate.',
  });
  m = patchMetric(m, 'GDP per capita', {
    value: '$52,080',
    reference_period: 'IMF 2026 estimate',
    source_name: 'IMF',
    source_url: '',
    source_publication_or_access_date: '2026',
    notes: 'IMF 2026 estimate.',
  });
  m = patchMetric(m, 'Inflation', {
    value: '1.8%',
    reference_period: 'June 2026',
    source_name: 'INSEE',
    source_url: '',
    source_publication_or_access_date: 'June 2026',
    notes: 'June 2026, year-on-year CPI.',
  });
  m = patchMetric(m, 'Unemployment', {
    value: '8.1%',
    reference_period: 'Q1 2026',
    source_name: 'INSEE',
    source_url: '',
    source_publication_or_access_date: 'Q1 2026',
    notes: 'INSEE (Q1 2026).',
  });
  m = patchMetric(m, 'Interest', {
    value: '2.40%',
    reference_period: 'Effective June 17, 2026',
    source_name: 'European Central Bank',
    source_url: '',
    source_publication_or_access_date: 'June 17, 2026',
    notes: 'ECB main refinancing rate.',
  });
  m = patchMetric(m, 'Real Median Wage', {
    value: '€2,180 net/month',
    reference_period: '2023',
    source_name: 'INSEE',
    source_url: '',
    source_publication_or_access_date: '2023',
    notes: 'Private-sector median; latest directly published figure.',
  });
  return m;
}
