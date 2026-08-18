import type { GermanyGovernmentPoliticsRow } from '../germany/germanyGovernmentPolitics';

function row(
  metric: string,
  breakdown: string,
  value: string,
  unit: string,
  referenceYear: string,
  sourceName: string,
  notes: string,
  sourceUrl = '',
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

const EUROSTAT_ERGAN = 'https://ec.europa.eu/eurostat/databrowser/view/lfsa_ergan/default/table';

/**
 * Closest official Spanish equivalents to the Germany government-labour dashboard groups.
 *
 * Spain's institutional split does not map one-to-one onto Germany's, and this table says
 * so rather than forcing a number: employment and unemployment by citizenship are published
 * cleanly by Eurostat and INE, but Spain publishes no SGB-II-style welfare-dependency rate
 * by nationality, and enforcement statistics come from the Inspección de Trabajo y
 * Seguridad Social on a different basis (actas de infracción, not "cases").
 *
 * Sourced 10 Aug 2026: Eurostat `lfsa_ergan` / `lfsa_urgan` (ages 20–64, 2025); Observatorio
 * Permanente de la Inmigración residence stock at 31 Dec 2025.
 */
export const SPAIN_LABOR_MIGRATION_ENFORCEMENT_ROWS: readonly GermanyGovernmentPoliticsRow[] = [
  row('employment rates by nationality', 'Spanish nationals', '73.5', 'percent', '2025', 'Eurostat EU-LFS',
    'Employment rate, ages 20–64. Up from 68.7% in 2019.', EUROSTAT_ERGAN),
  row('employment rates by nationality', 'EU27 nationals', '74.4', 'percent', '2025', 'Eurostat EU-LFS',
    'EU citizens resident in Spain are employed at a slightly higher rate than Spanish nationals.', EUROSTAT_ERGAN),
  row('employment rates by nationality', 'Non-EU nationals', '64.5', 'percent', '2025', 'Eurostat EU-LFS',
    'Nine points below Spanish nationals. The corresponding unemployment rates are 9.3% (Spanish), 10.7% (EU) and 16.7% (non-EU).', EUROSTAT_ERGAN),
  row('employment rates by nationality', 'All foreign nationals', '67.0', 'percent', '2025', 'Eurostat EU-LFS',
    'Foreign nationals are 3.5 million of Spain\'s employed population (Q3 2025, EPA).', EUROSTAT_ERGAN),

  row('welfare dependency by nationality/status', 'Foreign share of Ingreso Mínimo Vital beneficiaries', '17.5', 'percent', '2025',
    'Ministerio de Inclusión, Seguridad Social y Migraciones',
    'Spain publishes the foreign share of the minimum-income caseload, not a dependency *rate* by nationality — the two are different measures and only the former exists. Foreign nationals are 28.9% of the autonomous communities\' Rentas Mínimas de Inserción caseload.'),
  row('welfare dependency by nationality/status', 'Rate by nationality', 'Not published', '', '—',
    'Seguridad Social / autonomous communities',
    'No SGB-II-equivalent dependency rate by nationality exists. Minimum-income schemes are split between the state (IMV) and the 17 autonomous communities (RMI), with no consolidated national series by citizenship.'),

  row('social assistance recipients by citizenship', 'IMV — all beneficiaries', '~2.0M', 'people', '2025',
    'Seguridad Social',
    'Ingreso Mínimo Vital reached roughly 2 million people in about 730,000 households; annualised cost ≈ €2.5bn in 2023. No published TOP-8 nationality table.'),
  row('social assistance recipients by citizenship', 'By individual nationality', 'No consolidated count', '', '—',
    'Seguridad Social',
    'Published only as Spanish / foreign, not by country of citizenship.'),

  row('benefit fraud cases', '', 'Not published as case counts', '', '2024',
    'Inspección de Trabajo y Seguridad Social (ITSS)',
    'Spain reports enforcement as actas de infracción and recovered amounts rather than fraud "cases". The ITSS annual plan reports social-security fraud recoveries in the hundreds of millions of euros.'),

  row('illegal employment cases', '', 'Reported as infraction proceedings', '', '2024',
    'Inspección de Trabajo y Seguridad Social (ITSS)',
    'Undeclared work (empleo sumergido) is the ITSS\'s largest campaign area; results are published as inspections, uncovered contracts converted to registered employment and liquidation notices, not comparable case counts.'),

  row('minimum wage enforcement cases', '', 'Not separately published', '', '—',
    'Inspección de Trabajo y Seguridad Social (ITSS)',
    'Folded into general wage and working-time inspections; Spain publishes no separate SMI-enforcement case count.'),

  row('work-permit grants', 'Residence authorisations in force (general regime)', '3,497,284', 'people', '2025',
    'Observatorio Permanente de la Inmigración (OPI)',
    'Third-country nationals holding an authorisation under the régimen general at 31 Dec 2025. Spain\'s headline statistic is the stock in force, not annual first permits.'),
  row('work-permit grants', 'EU/EFTA registration certificates in force', '3,804,191', 'people', '2025',
    'Observatorio Permanente de la Inmigración (OPI)',
    'EU/EFTA citizens need a registration certificate, not a permit. Total foreign residents with valid documentation reached 7,500,944 at 31 Dec 2025, up 4.5% year on year.'),

  row('Blue Card approvals', '', 'Published under the Ley de Emprendedores highly-qualified route', '', '2024',
    'Unidad de Grandes Empresas y Colectivos Estratégicos (UGE-CE)',
    'Spain issues far more highly-qualified permits through its own national route (Ley 14/2013) than through the EU Blue Card, so the Blue Card count understates skilled migration here.'),

  row('student visa conversions to work permits', '', 'Permitted without leaving Spain since 2022', '', '2025',
    'Reglamento de Extranjería (RD 629/2022; RD 1155/2024 from May 2025)',
    'The 2022 reform let students switch to a work authorisation directly, and the 2024 regulation in force from 20 May 2025 further shortened the route. Conversion volumes are not published as a standalone series.'),
] as const;
