import type { CountryStatMetric } from '../types/countryStats';
import type { EconomicStructuralIndicator } from './franceEconomyStats';

/** Secondary economy tiles below the six lead metrics (Italy). */
export const ITALY_ECONOMIC_STRUCTURAL_INDICATORS: readonly EconomicStructuralIndicator[] = [
  {
    id: 'public-debt-gdp',
    title: 'Public debt (% of GDP)',
    valueMain: '137.1%',
    valueSub: '(2025) · 138.5% forecast for 2026',
    details:
      'One of the euro area’s highest debt ratios; the Commission expects interest costs and tax-credit adjustments to lift it further in 2026.',
    source: 'European Commission, Spring 2026 forecast.',
  },
  {
    id: 'budget-deficit',
    title: 'Government budget deficit',
    valueMain: '2.9%',
    valueSub: 'of GDP (2026 forecast)',
    details:
      'Projected just below the EU reference level after a 3.1% deficit in 2025, supported by a positive primary balance.',
    source: 'European Commission, Spring 2026 forecast.',
  },
  {
    id: 'productivity',
    title: 'Labour productivity',
    valueMain: '−0.6%',
    valueSub: 'per hour worked (2025)',
    details:
      'Italy was one of only two EU countries to record a decline in hourly labour productivity in 2025.',
    source: 'Eurostat, Productivity trends in the EU (2026).',
  },
  {
    id: 'youth-unemployment',
    title: 'Youth unemployment (15-24)',
    valueMain: '15.1%',
    valueSub: '(May 2026)',
    details:
      'The youth rate fell by 1.3 percentage points during May, but remains about three times the national unemployment rate.',
    source: 'Istat, Employment and unemployment — May 2026.',
  },
  {
    id: 'current-account',
    title: 'Current-account balance',
    valueMain: '+0.5%',
    valueSub: 'of GDP (2026 forecast)',
    details:
      'A smaller but still positive external balance is expected as energy costs rise and net exports weaken.',
    source: 'European Commission, Spring 2026 forecast.',
  },
  {
    id: 'public-debt-total',
    title: 'Total public debt (absolute)',
    valueMain: '€3.155T',
    valueSub: '(April 2026)',
    details:
      'General government debt fell by €2.9 billion from March while remaining near its historic high.',
    source: 'Banca d’Italia, Public Finances — April 2026.',
  },
  {
    id: 'oil-dependency',
    title: 'Oil dependency',
    valueMain: '≈90%',
    valueSub: 'imported',
    details:
      'Domestic crude output covers only a small share of demand, leaving transport and refining exposed to external supply shocks.',
    source: 'Eurostat / Italy energy reporting, latest available.',
  },
  {
    id: 'gold-reserves',
    title: 'Gold reserves',
    valueMain: '2,452',
    valueSub: 'tonnes',
    details:
      'The Bank of Italy is the world’s fourth-largest official gold holder, behind the US, Germany, and the IMF.',
    source: 'Banca d’Italia, official gold-reserves statement.',
  },
  {
    id: 'credit-rating',
    title: 'Credit rating',
    valueMain: 'BBB+',
    valueSub: 'S&P positive · Fitch stable',
    details:
      'Moody’s rates Italy Baa2 stable. All three major agencies retain investment-grade assessments.',
    source: 'S&P (Jan 2026), Fitch (Mar 2026), Moody’s (Nov 2025).',
  },
];

export const ITALY_ECONOMIC_STRUCTURAL_GROUP_COUNT = ITALY_ECONOMIC_STRUCTURAL_INDICATORS.length;

function patchMetric(
  metrics: CountryStatMetric[],
  metric: string,
  patch: Partial<CountryStatMetric>,
): CountryStatMetric[] {
  const idx = metrics.findIndex((item) => item.metric === metric);
  if (idx < 0) return metrics;

  const next = [...metrics];
  next[idx] = { ...metrics[idx]!, ...patch };
  return next;
}

/** Italy-specific lead economy tiles, replacing France values inherited from the scaffold. */
export function applyItalyEconomyMetricOverrides(metrics: CountryStatMetric[]): CountryStatMetric[] {
  let next = metrics;
  next = patchMetric(next, 'GDP', {
    value: '$2.38 trillion',
    reference_period: '2024',
    geography_used: 'Italy',
    source_name: 'World Bank',
    source_url: 'https://data.worldbank.org/indicator/NY.GDP.MKTP.CD?locations=IT',
    source_publication_or_access_date: '2024',
    notes: 'Nominal GDP in current US dollars.',
  });
  next = patchMetric(next, 'GDP per capita', {
    value: '$40,385',
    reference_period: '2024',
    geography_used: 'Italy',
    source_name: 'World Bank',
    source_url: 'https://data.worldbank.org/indicator/NY.GDP.PCAP.CD?locations=IT',
    source_publication_or_access_date: '2024',
    notes: 'Nominal GDP per person in current US dollars.',
  });
  next = patchMetric(next, 'Inflation', {
    value: '3.0%',
    reference_period: 'June 2026',
    geography_used: 'Italy',
    source_name: 'Istat',
    source_url: 'https://www.istat.it/en/press-release/consumer-prices-provisional-data-june-2026/',
    source_publication_or_access_date: 'June 30, 2026',
    notes: 'National consumer-price index, year on year; provisional estimate.',
  });
  next = patchMetric(next, 'Unemployment', {
    value: '5.0%',
    reference_period: 'May 2026',
    geography_used: 'Italy',
    source_name: 'Istat',
    source_url: 'https://www.istat.it/en/press-release/employment-and-unemployment-provisional-data-may-2026/',
    source_publication_or_access_date: 'July 2, 2026',
    notes: 'Seasonally adjusted unemployment rate; provisional estimate.',
  });
  next = patchMetric(next, 'Interest', {
    value: '2.40%',
    reference_period: 'Effective June 17, 2026',
    geography_used: 'Italy / euro area',
    source_name: 'European Central Bank',
    source_url: 'https://www.ecb.europa.eu/stats/policy_and_exchange_rates/key_ecb_interest_rates/html/index.en.html',
    source_publication_or_access_date: 'June 17, 2026',
    notes: 'ECB main refinancing operations rate.',
  });
  next = patchMetric(next, 'Real Median Wage', {
    value: '$1,934 net/month',
    reference_period: '2026 current proxy',
    geography_used: 'Italy',
    source_name: 'Numbeo',
    source_url: 'https://www.numbeo.com/cost-of-living/country_result.jsp?country=Italy',
    source_publication_or_access_date: '2026',
    notes: 'Current average monthly net salary proxy; a directly comparable official real-median-wage series was not available.',
  });
  return next;
}
