import type { GermanyLaborCsvRow } from './germanyLaborStatistics';

function row(
  metric: string,
  submetric: string,
  breakdown: string,
  value: string,
  unit: string,
  sourceName: string,
  sourceUrl: string,
  notes: string,
): GermanyLaborCsvRow {
  return {
    country: 'Italy',
    metric,
    submetric,
    breakdown,
    value,
    unit,
    referenceYear: '2024',
    sourceName,
    sourceUrl,
    notes,
  };
}

const ISTAT_SDG_URL = 'https://www.istat.it/en/publication/2025-sdgs-report/';
const MLPS_LABOR_URL =
  'https://www.lavoro.gov.it/temi-e-priorita-immigrazione/studi-e-statistiche/sintesi-xv-gli-stranieri-nel-mercato-del-lavoro-in-italia-2025';
const MLPS_WAGE_URL =
  'https://www.lavoro.gov.it/en/single-digital-gateway/terms-and-conditions-employment/minimum-and-average-salaryfee-remuneration';
const OECD_ITALY_URL =
  'https://www.oecd.org/content/dam/oecd/en/publications/reports/2026/04/oecd-economic-surveys-italy-2026_3fd3b6aa/539538b2-en.pdf';

/** Italy-specific annual labor indicators for the shared Labor & Income dashboard. */
export const ITALY_LABOR_STATISTICS_ROWS: readonly GermanyLaborCsvRow[] = [
  row('Youth unemployment rate', '', 'Ages 15–24', '20.3', 'percent', 'Istat', ISTAT_SDG_URL, 'Annual unemployment rate for the 15–24 labor force.'),
  row('Labour force participation rate', '', 'Overall · ages 15–64', '66.6', 'percent', 'MLPS / Istat', MLPS_LABOR_URL, 'The corresponding inactivity rate was 33.4%.'),
  row('Labour force participation rate', 'By citizenship', 'Italian citizens', '66.2', 'percent', 'MLPS / Istat', MLPS_LABOR_URL, 'Implied from the official 62.2% employment rate and 6.1% unemployment rate: employment ÷ (1 − unemployment).'),
  row('Labour force participation rate', 'By citizenship', 'Citizens of other EU countries', '68.4', 'percent', 'MLPS / Istat', MLPS_LABOR_URL, 'Implied from the official 61.6% employment rate and 10.0% unemployment rate.'),
  row('Labour force participation rate', 'By citizenship', 'Non-EU citizens', '64.1', 'percent', 'MLPS / Istat', MLPS_LABOR_URL, 'Implied from the official 57.6% employment rate and 10.2% unemployment rate.'),
  row('Minimum wage', '', '', 'No statutory national minimum', '', 'Italian Ministry of Labour', MLPS_WAGE_URL, 'Italy uses wage floors established by national sectoral collective agreements rather than one statutory hourly minimum.'),
  row('Long-term unemployment rate', '', 'Unemployed for 12 months or more', '3.3', 'percent', 'OECD / Eurostat', OECD_ITALY_URL, 'Share of the labor force unemployed for at least one year.'),
  row('Average annual working hours per worker', '', '', '1,709', 'hours per employed worker', 'OECD', OECD_ITALY_URL, 'Average annual hours actually worked per employed person.'),
] as const;