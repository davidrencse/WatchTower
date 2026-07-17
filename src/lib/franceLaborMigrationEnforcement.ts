import type { GermanyGovernmentPoliticsRow } from './germanyGovernmentPolitics';

function row(
  metric: string,
  breakdown: string,
  value: string,
  unit: string,
  referenceYear: string,
  sourceName: string,
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
    sourceUrl: '',
    notes,
  };
}

/** Closest official French equivalents to the Germany government-labor dashboard groups. */
export const FRANCE_LABOR_MIGRATION_ENFORCEMENT_ROWS: readonly GermanyGovernmentPoliticsRow[] = [
  row('employment rates by nationality', 'French/non-immigrant residents', '70.5', 'percent', '2025', 'INSEE', 'Closest INSEE equivalent. France publishes this breakdown by immigrant origin rather than the exact German citizenship groups. The overall employment rate for ages 15–64 was 68.8% in 2024.'),
  row('employment rates by nationality', 'European immigrants', '65.8', 'percent', '2025', 'INSEE', 'Immigrants born in Europe, ages 15–64.'),
  row('employment rates by nationality', 'Non-European immigrants', '59.5', 'percent', '2025', 'INSEE', 'Closest dashboard equivalent to non-EU nationals. Official estimates vary by origin, approximately 58–61%.'),
  row('welfare dependency by nationality/status', 'Asylum-origin-country dependency rate', 'Not published', '', '—', 'CAF / French departmental systems', 'France does not publish a centralized SGB-II-style welfare-dependency rate by asylum nationality.'),
  row('welfare dependency by nationality/status', 'Ukrainian-national dependency rate', 'Not published', '', '—', 'French temporary-protection system', 'Temporary-protection beneficiaries receive several schemes, so no consolidated comparable dependency percentage exists. Approximately 60,000–70,000 people held temporary protection in 2024; this measures protection status, not welfare receipt.'),
  row('social assistance recipients by citizenship', 'Asylum-origin countries', 'No national consolidated count', '', '—', 'CAF / French departmental systems', 'Benefit totals are generally published without a consolidated TOP-8 nationality table.'),
  row('social assistance recipients by citizenship', 'Ukrainian nationals', 'No national consolidated count', '', '—', 'CAF / French departmental systems', 'International- or temporary-protection beneficiary counts measure immigration status, not welfare receipt.'),
  row('benefit fraud cases', '', '49,030', 'cases', '2024', 'CAF', 'Closest official equivalent. CAF conducted 31.5 million controls and detected approximately €449 million in fraud.'),
  row('illegal employment cases', '', '≈7,000', 'major cases', '2024', 'URSSAF', 'Closest rounded case estimate (official range approximately 6,000–8,000). France primarily reports inspections and financial adjustments; anti–illegal-work assessments were approximately €1.6 billion in 2024.'),
  row('minimum wage enforcement cases', '', 'Not separately available', '', '—', 'French labour inspectorate', 'Included within broader wage and employment-law inspections; no separate national case count is published.'),
  row('work-permit grants', '', '≈55,000', 'first permits', '2024', 'French Ministry of the Interior', 'First residence permits issued for economic or professional reasons. France issued roughly 336,700 first residence permits overall in 2024.'),
  row('Blue Card approvals', '', '2,800', 'approvals', '2024', 'Eurostat', 'Official French EU Blue Card count.'),
  row('student visa conversions to work permits', '', '≈24,000', 'conversions', '2024', 'French national approximation', 'Best national approximation; France does not publish a directly equivalent headline total in every annual release.'),
] as const;
