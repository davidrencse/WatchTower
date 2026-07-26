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
const GDF_FRAUD_URL =
  'https://www.milanofinanza.it/news/il-reddito-ingiusto-quel-miliardo-di-euro-sottratto-allo-stato-tra-frodi-e-omissioni-202604302008501801';

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
  row('benefit fraud cases', '', '≈€60M', 'fraud detected (ADI/SFL)', '2024', 'Guardia di Finanza / INPS', GDF_FRAUD_URL, 'Approx. fraud detected on the Assegno di Inclusione (ADI) and Supporto per Formazione e Lavoro (SFL) in 2024; roughly 10,000 positions were revoked for false declarations. Italy does not publish a single consolidated ADI benefit-fraud “case” count by citizenship comparable to Germany’s, so the detected-fraud amount is shown instead.'),
  row('illegal employment cases', 'Workers completely undeclared', '23,401', 'workers', '2024', 'INL / INPS / INAIL', INL_INSPECTIONS_URL, 'Across 108,267 completed inspections, 80,245 were irregular and 327,581 workers were linked to irregularities.'),
  row('minimum wage enforcement cases', '', 'No statutory national minimum', '', '2024', 'Italian Ministry of Labour', MLPS_WAGE_URL, 'Italy has no single statutory national minimum wage. Sectoral collective agreements establish contractual wage floors, enforced within broader labor inspections.'),
  row('work-permit grants', '', '40,451', 'new permits', '2024', 'Istat', ISTAT_PERMITS_URL, 'New residence permits issued for work, up 3.8% from 2023 and equal to 13.9% of Italy’s 290,119 new non-EU permits.'),
  row('Blue Card approvals', '', '600', 'cards', '2024', 'Eurostat', EUROSTAT_PERMITS_URL, 'EU Blue Cards issued by Italy in 2024 (Eurostat), down from about 747 in 2023 and a small fraction of the EU-wide 78,096. Italy’s Blue Card uptake stays low; the 2024 gross-salary threshold was about €33,500.'),
  row('student visa conversions to work permits', '', 'Not published', '', '2024', 'Istat / Ministry of the Interior', ISTAT_PERMITS_URL, 'Italy reported 20,130 new study permits in 2024. Study-to-work conversions are handled through decreto-flussi quotas (graduates of Italian universities convert outside the quota), but no directly comparable national annual total is published.'),
] as const;