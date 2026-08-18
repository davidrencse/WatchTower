import type { EconomicStructuralIndicator } from '../france/franceEconomyStats';

/** Secondary economy tiles below the six lead metrics (Spain). */
export const SPAIN_ECONOMIC_STRUCTURAL_INDICATORS: readonly EconomicStructuralIndicator[] = [
  {
    id: 'public-debt-gdp',
    title: 'Public debt (% of GDP)',
    valueMain: '100.8%',
    valueSub: '(end 2025) · 99.6% forecast for 2026',
    details:
      'The ratio fell by 0.9 percentage points during 2025. Strong nominal growth is expected to take it below 100% in 2026.',
    source: 'Banco de España (Feb 2026); European Commission, Spring 2026 forecast.',
  },
  {
    id: 'budget-deficit',
    title: 'Government budget deficit',
    valueMain: '2.4%',
    valueSub: 'of GDP (2025; 2026 forecast also 2.4%)',
    details:
      'The deficit moved below the EU reference level in 2025; temporary energy and flood measures are expected to hold it flat in 2026.',
    source: 'European Commission, Spring 2026 forecast (May 2026).',
  },
  {
    id: 'productivity',
    title: 'Labour productivity',
    valueMain: '+0.6%',
    valueSub: 'per hour worked, year on year (Q1 2026)',
    details:
      'Hourly productivity increased, while productivity per full-time-equivalent job declined by 0.1% over the same period.',
    source: 'INE, Quarterly National Accounts, Q1 2026 (June 2026).',
  },
  {
    id: 'youth-unemployment',
    title: 'Youth unemployment (15-24)',
    valueMain: '23.7%',
    valueSub: '(May 2026, seasonally adjusted)',
    details:
      'The rate remains among the EU’s highest despite falling from 24.7% a year earlier.',
    source: 'Eurostat, monthly unemployment release (July 2026).',
  },
  {
    id: 'current-account',
    title: 'Current-account balance',
    valueMain: '+2.8%',
    valueSub: 'of GDP (2025) · +1.9% forecast for 2026',
    details:
      'Spain retained a sizeable external surplus in 2025, supported by services exports; the surplus is forecast to narrow in 2026.',
    source: 'European Commission, Spring 2026 forecast (May 2026).',
  },
  {
    id: 'public-debt-total',
    title: 'Total public debt (absolute)',
    valueMain: '€1.699T',
    valueSub: '(December 2025)',
    details:
      'General government debt increased by 4.8% year on year in nominal terms, even as the debt-to-GDP ratio declined.',
    source: 'Banco de España, Excessive Deficit Procedure debt (Feb 2026).',
  },
  {
    id: 'oil-dependency',
    title: 'Oil dependency',
    valueMain: '≈100%',
    valueSub: 'of crude oil imported',
    details:
      'Domestic crude output was only 597 tonnes in 2024, leaving Spain’s refinery system almost entirely reliant on imported feedstock.',
    source: 'MITECO, Mining Statistics 2024; CORES oil statistics.',
  },
  {
    id: 'gold-reserves',
    title: 'Gold reserves',
    valueMain: '281.6',
    valueSub: 'tonnes',
    details:
      'Banco de España holds 9.054 million fine troy ounces; the gold reserve was valued at €31.98 billion in July 2026.',
    source: 'Banco de España reserves template (July 2026); World Gold Council.',
  },
  {
    id: 'credit-rating',
    title: 'Credit rating',
    valueMain: 'A+',
    valueSub: 'S&P stable · Fitch A stable',
    details:
      'Moody’s rates Spain A3 stable. All three major agencies upgraded Spain into the A category during September 2025.',
    source: 'Spanish Treasury ratings table, latest available.',
  },
];

export const SPAIN_ECONOMIC_STRUCTURAL_GROUP_COUNT = SPAIN_ECONOMIC_STRUCTURAL_INDICATORS.length;
