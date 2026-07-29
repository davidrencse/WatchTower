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
const OECD_EMPLOYMENT_OUTLOOK_ITALY_URL =
  'https://www.oecd.org/en/publications/2025/07/oecd-employment-outlook-2025-country-notes_5f33b4c5/italy_a775131b.html';
const OECD_HOURS_WORKED_URL = 'https://www.oecd.org/en/data/indicators/hours-worked.html';

/** Italy-specific annual labor indicators for the shared Labor & Income dashboard. */
export const ITALY_LABOR_STATISTICS_ROWS: readonly GermanyLaborCsvRow[] = [
  row('Youth unemployment rate', '', 'Ages 15–24', '20.3', 'percent', 'Istat', ISTAT_SDG_URL, 'Annual unemployment rate for the 15–24 labor force.'),
  row('Labour force participation rate', '', 'Overall · ages 15–64', '66.6', 'percent', 'MLPS / Istat', MLPS_LABOR_URL, 'The corresponding inactivity rate was 33.4%.'),
  row('Labour force participation rate', 'By citizenship', 'Italian citizens', '66.2', 'percent', 'MLPS / Istat', MLPS_LABOR_URL, 'Implied from the official 62.2% employment rate and 6.1% unemployment rate: employment ÷ (1 − unemployment).'),
  row('Labour force participation rate', 'By citizenship', 'Citizens of other EU countries', '68.4', 'percent', 'MLPS / Istat', MLPS_LABOR_URL, 'Implied from the official 61.6% employment rate and 10.0% unemployment rate.'),
  row('Labour force participation rate', 'By citizenship', 'Non-EU citizens', '64.1', 'percent', 'MLPS / Istat', MLPS_LABOR_URL, 'Implied from the official 57.6% employment rate and 10.2% unemployment rate.'),
  row('Minimum wage', '', '', 'No statutory national minimum wage', '', 'Italian Ministry of Labour', MLPS_WAGE_URL, 'Italy uses wage floors established by national sectoral collective agreements rather than one statutory hourly minimum.'),
  row('Long-term unemployment rate', '', '', '3.8', 'percent', 'OECD', OECD_EMPLOYMENT_OUTLOOK_ITALY_URL, 'Share of the labour force unemployed for 12 months or more; latest comparable OECD/Eurostat data.'),
  row('Average annual working hours per worker', '', '', '1,734', 'hours per worker', 'OECD', OECD_HOURS_WORKED_URL, 'Average annual hours actually worked per worker.'),
] as const;
