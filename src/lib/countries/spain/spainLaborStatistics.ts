import type { GermanyLaborCsvRow } from '../germany/germanyLaborStatistics';

function row(
  metric: string,
  breakdown: string,
  value: string,
  unit: string,
  referenceYear: string,
  sourceName: string,
  sourceUrl: string,
  notes = '',
  submetric = '',
): GermanyLaborCsvRow {
  return {
    country: 'Spain',
    metric,
    submetric,
    breakdown,
    value,
    unit,
    referenceYear,
    sourceName,
    sourceUrl,
    notes,
  };
}

const EUROSTAT_LFS = 'Eurostat EU-LFS';
const LFPR_URL = 'https://ec.europa.eu/eurostat/databrowser/view/lfsa_argan/default/table';
const URG_URL = 'https://ec.europa.eu/eurostat/databrowser/view/lfsa_urgan/default/table';

/**
 * Spain labour-market indicators, replacing the matching rows in
 * `public/data/esp_labor_statistics.csv`.
 *
 * The generated CSV carries several rows explicitly labelled "Modeled estimate
 * (population-scaled from published patterns)" for the participation-rate split by
 * migrant/native status. Eurostat publishes that split for Spain directly, so these rows
 * substitute the real figures. Rows the CSV holds that are not listed here are left alone
 * and still render — `laborRowsOverride` replaces by metric name and keeps the remainder.
 *
 * Sources, all pulled 10 Aug 2026:
 *  - Participation and unemployment by citizenship: Eurostat `lfsa_argan` / `lfsa_urgan`,
 *    ages 20–64, 2025. Eurostat's citizenship split is EU27 / non-EU, not the CSV's
 *    native-vs-foreign-born, so the breakdown labels say which is which.
 *  - Youth unemployment and long-term unemployment: Eurostat `une_rt_a` / `une_ltu_a`, 2025.
 *  - Minimum wage: SMI 2025, BOE — €1,184/month in 14 payments (€16,576/year), +4.4% on 2024.
 */
export const SPAIN_LABOR_STATISTICS_ROWS: readonly GermanyLaborCsvRow[] = [
  row('Youth unemployment rate', 'Ages 15–24', '24.9', 'percent', '2025', EUROSTAT_LFS, URG_URL,
    'Down from 26.5% in 2024 and 28.7% in 2023 — still among the highest rates in the EU.'),

  row('Long-term unemployment rate', 'Ages 15–74, unemployed 12 months or more', '3.4', 'percent of labour force', '2025', EUROSTAT_LFS, URG_URL,
    'Down from 3.8% in 2024. Long-term unemployment has more than halved since the 2013 peak.'),

  row('Labour force participation rate', 'Total (ages 20–64)', '80.7', 'percent', '2025', EUROSTAT_LFS, LFPR_URL,
    'Eurostat activity rate, ages 20–64. Men 84.8%, women 76.5%.'),
  row('Labour force participation rate', 'Spanish nationals — total', '81.0', 'percent', '2025', EUROSTAT_LFS, LFPR_URL,
    'Published Eurostat figure by citizenship (replaces the generated CSV\'s modeled native/foreign split).', 'By citizenship'),
  row('Labour force participation rate', 'EU27 nationals — total', '83.3', 'percent', '2025', EUROSTAT_LFS, LFPR_URL,
    'EU citizens resident in Spain participate at a higher rate than Spanish nationals.', 'By citizenship'),
  row('Labour force participation rate', 'Non-EU nationals — total', '77.5', 'percent', '2025', EUROSTAT_LFS, LFPR_URL,
    'The gap is driven almost entirely by women: non-EU men participate at 86.3%, above Spanish men.', 'By citizenship'),
  row('Labour force participation rate', 'Spanish nationals — men', '84.4', 'percent', '2025', EUROSTAT_LFS, LFPR_URL, '', 'By citizenship'),
  row('Labour force participation rate', 'Non-EU nationals — men', '86.3', 'percent', '2025', EUROSTAT_LFS, LFPR_URL, '', 'By citizenship'),
  row('Labour force participation rate', 'Spanish nationals — women', '77.6', 'percent', '2025', EUROSTAT_LFS, LFPR_URL, '', 'By citizenship'),
  row('Labour force participation rate', 'Non-EU nationals — women', '69.3', 'percent', '2025', EUROSTAT_LFS, LFPR_URL,
    'The widest participation gap in the Spanish labour market — 8.3 points below Spanish women.', 'By citizenship'),

  row('Minimum wage', '', '€1,184/month (14 payments · €16,576/year)', 'statutory minimum', '2025',
    'BOE — Salario Mínimo Interprofesional',
    'https://www.boe.es/buscar/doc.php?id=BOE-A-2025-2653',
    'Up 4.4% on 2024. Spain pays the SMI in 14 instalments, so the monthly headline understates the annual figure.'),

  row('Average annual working hours per worker', '', '1632', 'hours per year', '2024',
    'OECD / INE', 'https://data-explorer.oecd.org/', 'OECD-basis average annual hours actually worked per employed person.'),
] as const;
