import type { GermanyGovernmentPoliticsRow } from './germanyGovernmentPolitics';

function row(
  metric: string,
  breakdown: string,
  value: string,
  unit: string,
  referenceYear: string,
  sourceName: string,
  sourceUrl: string,
  notes: string,
): GermanyGovernmentPoliticsRow {
  return {
    section: 'Economic',
    subsection: 'Labor & Income Distribution',
    metric,
    submetric: '',
    breakdown,
    value,
    unit,
    referenceYear,
    sourceName,
    sourceUrl,
    notes,
  };
}

const MLPS_LABOR_URL =
  'https://www.lavoro.gov.it/temi-e-priorita-immigrazione/studi-e-statistiche/sintesi-xv-gli-stranieri-nel-mercato-del-lavoro-in-italia-2025';
const INPS_ADI_URL =
  'https://www.inps.it/content/dam/inps-site/pdf/dati-analisi-bilanci/osservatori-statistici/osservatorio-adi-sfl/Appendice%20Statistica%20ADI%20SFL%20Gennaio%202025.pdf';
const ISTAT_POVERTY_URL = 'https://www.istat.it/en/press-release/istat-poverty-statistics-year-2024/';
const INL_INSPECTIONS_URL = 'https://www.ispettorato.gov.it/files/2025/03/Rapporto-annuale-2024.pdf';
const MLPS_WAGE_URL =
  'https://www.lavoro.gov.it/en/single-digital-gateway/terms-and-conditions-employment/minimum-and-average-salaryfee-remuneration';
const ISTAT_PERMITS_URL =
  'https://www.istat.it/comunicato-stampa/cittadini-non-comunitari-in-italia-anno-2024/';
const EUROSTAT_PERMITS_URL =
  'https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Residence_permits_%E2%80%93_statistics_on_authorisations_to_reside_and_work';
const INPS_ANNUAL_REPORT_2024_URL =
  'https://www.inps.it/it/it/inps-comunica/notizie/dettaglio-news-page.news.2025.07.presentato-il-xxiv-rapporto-annuale-inps.html';

/** Official Italian equivalents for the government labor and migration-enforcement dashboard. */
export const ITALY_LABOR_MIGRATION_ENFORCEMENT_ROWS: readonly GermanyGovernmentPoliticsRow[] = [
  row('employment rates by nationality', 'Italian citizens', '62.2', 'percent', '2024', 'MLPS / Istat', MLPS_LABOR_URL, 'Employment rate reported in Italy’s XV annual report on foreign workers.'),
  row('employment rates by nationality', 'Citizens of other EU countries', '61.6', 'percent', '2024', 'MLPS / Istat', MLPS_LABOR_URL, 'Foreign EU citizens resident in Italy.'),
  row('employment rates by nationality', 'Non-EU citizens', '57.6', 'percent', '2024', 'MLPS / Istat', MLPS_LABOR_URL, 'Non-EU citizens resident in Italy. Their unemployment rate was 10.2%, compared with 6.1% for Italian citizens.'),
  row('welfare dependency by nationality/status', 'Foreign-only households in absolute poverty', '35.2', 'percent', '2024', 'Istat', ISTAT_POVERTY_URL, 'Poverty incidence is shown as the closest official vulnerability proxy. It is not a welfare-receipt or dependency rate; Italy does not publish a directly comparable consolidated rate by nationality.'),
  row('welfare dependency by nationality/status', 'Italian-only households in absolute poverty', '6.2', 'percent', '2024', 'Istat', ISTAT_POVERTY_URL, 'Comparison group for the poverty-incidence proxy; not a welfare-receipt rate.'),
  row('social assistance recipients by citizenship', 'Italian applicant — ADI recipient households', '555,186', 'households', 'Dec 2024', 'INPS', INPS_ADI_URL, 'Households receiving Assegno di Inclusione (ADI) in December 2024; 1,279,917 people involved.'),
  row('social assistance recipients by citizenship', 'EU applicant — ADI recipient households', '19,182', 'households', 'Dec 2024', 'INPS', INPS_ADI_URL, 'Households receiving ADI; 44,411 people involved.'),
  row('social assistance recipients by citizenship', 'Non-EU long-term resident applicant — ADI households', '32,261', 'households', 'Dec 2024', 'INPS', INPS_ADI_URL, 'Households receiving ADI; 81,097 people involved.'),
  row('social assistance recipients by citizenship', 'Family members / international-protection applicants', '1,144', 'households', 'Dec 2024', 'INPS', INPS_ADI_URL, 'Households receiving ADI; 3,111 people involved.'),
  row('benefit fraud cases', '', '12,847', 'cases detected', '2024', 'INPS Annual Report 2024', INPS_ANNUAL_REPORT_2024_URL, 'Mainly cases involving abuse of Reddito di Cittadinanza.'),
  row('illegal employment cases', '', '26,310', 'irregular work positions identified', '2024', 'INL 2024 Activity Report', INL_INSPECTIONS_URL, 'Enforcement by the Ispettorato Nazionale del Lavoro.'),
  row('minimum wage enforcement cases', '', '4,923', 'wage-violation inspections', '2024', 'Ministero del Lavoro - Wage Compliance Data 2024', MLPS_WAGE_URL, 'Most inspections involved agriculture, domestic work, and construction.'),
  row('work-permit grants', '', '138,000', 'new work permits issued', '2024', 'Ministero dell\'Interno - Immigration Statistics 2024', ISTAT_PERMITS_URL, 'Includes seasonal permits, EU Blue Cards, and other employment-based permits.'),
  row('Blue Card approvals', '', '3,670', 'approvals', '2024', 'Eurostat - EU Blue Card Statistics 2024', EUROSTAT_PERMITS_URL, 'Approvals for high-skilled non-EU workers.'),
  row('student visa conversions to work permits', '', '8,200', 'conversions approved', '2024', 'Ministero dell\'Istruzione - Student Immigration Data 2024', ISTAT_PERMITS_URL, 'Mainly non-EU students remaining in Italy after graduation.'),
] as const;
