import type {
  ImmigrantBenefitsData,
  ImmigrantStatusClass,
  ImmigrantStockRow,
} from '../../../components/countries/germany/GermanyImmigrantBenefitsSection';

/**
 * Spain — immigrant entitlements by residence status.
 *
 * Sourced (Observatorio Permanente de la Inmigración, Ministerio de Inclusión, INE, and
 * the 2024 Reglamento de Extranjería, retrieved 10 Aug 2026):
 *  - 7,500,944 foreign nationals held valid residence documentation at 31 Dec 2025, +4.5%
 *    year on year: 3,804,191 EU/EFTA registration certificates, 3,497,284 authorisations
 *    under the régimen general, and 199,469 Withdrawal-Agreement TIEs for UK nationals.
 *  - The three largest EU/EFTA + Withdrawal-Agreement nationalities are Romania (1,135,212),
 *    Italy (506,957) and the United Kingdom (395,047) — 51% of that group between them.
 *  - RD 1155/2024, the new Reglamento de Extranjería, took effect 20 May 2025: it
 *    consolidated the arraigo routes into five, cut the residence requirement for arraigo
 *    social from three years to two, and gave asylum seekers work rights from month six.
 *  - Ingreso Mínimo Vital: foreign nationals are 17.5% of beneficiaries; regional Rentas
 *    Mínimas de Inserción, 28.9%.
 *
 * Estimated (flagged in the notes): the split of the general regime across family, work,
 * study and arraigo classes, and every origin-mix percentage. Spain publishes the stock by
 * regime and by nationality, but not a clean cross-tabulation of permit class by origin.
 * Spain collects no ethnic statistics, so origin shares are regional approximations.
 */
const SPAIN_STATUS_CLASSES: readonly ImmigrantStatusClass[] = [
  {
    index: 1,
    title: 'EU / EFTA citizens & free movement',
    stockLabel: '3.80M',
    stockDetail: 'Registration certificates in force, 31 Dec 2025 (OPI) — Romania and Italy lead',
    benefits: [
      'Immediate full labour-market access · registration certificate, not a permit',
      'Ingreso Mínimo Vital after 1 year of legal residence',
      'Full Sistema Nacional de Salud cover · family allowances',
      'Municipal and European election voting',
      'Permanent residence after 5 years · citizenship after 10',
    ],
    origins: [{ key: 'europe', label: 'Europe (EU/EFTA)', value: 100 }],
  },
  {
    index: 2,
    title: 'UK nationals (Withdrawal Agreement)',
    stockLabel: '199k',
    stockDetail: 'TIE cards issued under the Withdrawal Agreement, 31 Dec 2025 (OPI)',
    benefits: [
      'Pre-Brexit residence rights preserved for life',
      'Work and healthcare access as before withdrawal',
      'S1 pensioner healthcare for those covered by the UK scheme',
      'Municipal voting under the bilateral agreement',
    ],
    origins: [{ key: 'europe', label: 'United Kingdom', value: 100 }],
  },
  {
    index: 3,
    title: 'Family reunification (régimen general)',
    stockLabel: '~1.2M (est.)',
    stockDetail: 'Estimated share of the 3.50M general-regime stock — Spain publishes the stock by regime, not by class',
    benefits: [
      'Work authorisation attached to the residence card',
      'Full SNS healthcare · schooling for children regardless of status',
      'IMV eligible after 1 year of legal residence',
      'Renewal every 2 years, then long-term residence at 5',
    ],
    origins: [
      { key: 'other', label: 'Latin America', value: 44 },
      { key: 'mena', label: 'Maghreb & Middle East', value: 28 },
      { key: 'asia', label: 'Asia', value: 14 },
      { key: 'africa', label: 'Sub-Saharan Africa', value: 9 },
      { key: 'europe', label: 'Europe (non-EU)', value: 5 },
    ],
  },
  {
    index: 4,
    title: 'Work authorisations (cuenta ajena & propia)',
    stockLabel: '~1.0M (est.)',
    stockDetail: 'Employed and self-employed authorisations within the general regime',
    benefits: [
      'Contributory social security from the first day of registration',
      'Unemployment benefit on the same terms as Spanish workers',
      'Initial permit tied to occupation and region, then unrestricted',
      'Catálogo de Ocupaciones de Difícil Cobertura governs new hires from abroad',
    ],
    origins: [
      { key: 'other', label: 'Latin America', value: 40 },
      { key: 'mena', label: 'Maghreb & Middle East', value: 26 },
      { key: 'africa', label: 'Sub-Saharan Africa', value: 14 },
      { key: 'asia', label: 'Asia', value: 14 },
      { key: 'europe', label: 'Europe (non-EU)', value: 6 },
    ],
  },
  {
    index: 5,
    title: 'Arraigo (rooted-status regularisation)',
    stockLabel: '~500k (est.)',
    stockDetail: 'Spain\'s distinctive route: individual regularisation on proven residence, not an amnesty',
    benefits: [
      'RD 1155/2024 (in force 20 May 2025) cut arraigo social to 2 years\' residence',
      'Five consolidated routes: social, socio-laboral, socio-formativo, familiar, segunda oportunidad',
      'Grants a 1-year renewable residence-and-work authorisation',
      'No welfare entitlement before the grant — the route rewards prior undeclared work',
    ],
    origins: [
      { key: 'other', label: 'Latin America', value: 52 },
      { key: 'mena', label: 'Maghreb & Middle East', value: 22 },
      { key: 'africa', label: 'Sub-Saharan Africa', value: 16 },
      { key: 'asia', label: 'Asia', value: 8 },
      { key: 'europe', label: 'Europe (non-EU)', value: 2 },
    ],
  },
  {
    index: 6,
    title: 'International protection (asylum & subsidiary)',
    stockLabel: '~330k (est.)',
    stockDetail: 'Recognised refugees and subsidiary-protection holders plus pending applicants',
    benefits: [
      'Sistema de Acogida: reception place, allowance and Spanish classes, 6–18 months',
      'Work rights from month 6 of the procedure (reduced from 6 months at application)',
      'Full SNS healthcare from the moment of application',
      'Spain has one of the EU\'s largest caseloads but a low recognition rate — most Latin American claims are refused and resolved through arraigo instead',
    ],
    origins: [
      { key: 'other', label: 'Latin America (Venezuela, Colombia, Peru)', value: 68 },
      { key: 'mena', label: 'Maghreb & Middle East', value: 12 },
      { key: 'africa', label: 'Sub-Saharan Africa', value: 12 },
      { key: 'asia', label: 'Asia', value: 6 },
      { key: 'europe', label: 'Europe (non-EU)', value: 2 },
    ],
  },
  {
    index: 7,
    title: 'Temporary protection (Ukraine)',
    stockLabel: '~220k',
    stockDetail: 'Ukrainian beneficiaries of the EU temporary-protection directive',
    benefits: [
      'Immediate work authorisation, no waiting period',
      'Residence and work card valid for the duration of the directive',
      'Full SNS healthcare · schooling · reception-system support',
      'Fast-track processing through dedicated CREADE centres',
    ],
    origins: [{ key: 'europe', label: 'Ukraine', value: 100 }],
  },
  {
    index: 8,
    title: 'Students & irregular status',
    stockLabel: '~250k students (est.)',
    stockDetail: 'Student stay authorisations. The irregular population holds no document, so it is absent from the stock chart entirely — not a small slice of it',
    benefits: [
      'Students may work up to 30 h/week since the 2022 reform and convert to a work permit without leaving Spain',
      'Padrón registration gives healthcare and schooling regardless of legal status — Spain\'s key divergence from most of the EU',
      'No IMV, no unemployment benefit and no work rights while irregular',
      'The padrón registration is what later evidences residence for an arraigo claim',
    ],
    origins: [
      { key: 'other', label: 'Latin America', value: 46 },
      { key: 'mena', label: 'Maghreb & Middle East', value: 22 },
      { key: 'africa', label: 'Sub-Saharan Africa', value: 18 },
      { key: 'asia', label: 'Asia', value: 11 },
      { key: 'europe', label: 'Europe (non-EU)', value: 3 },
    ],
  },
];

/**
 * Sums to exactly the published 7,500,944 total: the three regime figures are real, and the
 * five general-regime slices are estimates that partition its 3,497,284 rather than adding
 * to it. The irregular population is deliberately absent — by definition it holds no
 * document and is not in this register — and Ukrainian temporary-protection holders sit
 * inside the protection slice, not beside it, because their authorisation is already
 * counted in the general regime.
 */
const SPAIN_STOCK_OVERVIEW: readonly ImmigrantStockRow[] = [
  { name: 'EU/EFTA free movement', value: 3.804, fill: 'hsl(199, 89%, 48%)', basis: 'stock' },
  { name: 'Family reunification (est.)', value: 1.2, fill: 'hsl(280, 55%, 58%)', basis: 'stock' },
  { name: 'Work authorisations (est.)', value: 1.0, fill: 'hsl(258, 55%, 62%)', basis: 'stock' },
  { name: 'Protection incl. Ukraine (est.)', value: 0.547, fill: 'hsl(142, 71%, 45%)', basis: 'stock' },
  { name: 'Arraigo (est.)', value: 0.5, fill: 'hsl(38, 92%, 50%)', basis: 'stock' },
  { name: 'Students (est.)', value: 0.25, fill: 'hsl(0, 72%, 55%)', basis: 'stock' },
  { name: 'UK Withdrawal Agreement', value: 0.199, fill: 'hsl(215, 14%, 45%)', basis: 'stock' },
];

export const SPAIN_IMMIGRANT_BENEFITS: ImmigrantBenefitsData = {
  statusClasses: SPAIN_STATUS_CLASSES,
  stockOverview: SPAIN_STOCK_OVERVIEW,
  caption:
    'Eight residence classes · entitlements are status-based, not origin-based. 7,500,944 foreign nationals held valid residence documentation at 31 Dec 2025 (+4.5% y/y) — 53.8% of them EU/EFTA or British.',
  notes: [
    'Observatorio Permanente de la Inmigración, "Extranjeros con certificado de registro o tarjeta de residencia en vigor" at 31 Dec 2025: 3,804,191 EU/EFTA registration certificates · 3,497,284 general-regime authorisations · 199,469 Withdrawal-Agreement TIEs. Top nationalities in the first group: Romania 1,135,212 · Italy 506,957 · United Kingdom 395,047.',
    'Only the three regime totals are published stocks. The split of the general regime across family, work, arraigo, protection and student classes is estimated and partitions its 3,497,284 — those five slices do not add to the total, they divide one part of it. Every origin-mix percentage is likewise estimated: Spain collects no ethnic statistics and publishes no permit-class-by-origin cross-tabulation. The irregular population is excluded from the stock chart by definition, since it holds no residence document.',
    'Policy context: RD 1155/2024, in force since 20 May 2025, is the largest rewrite of the Reglamento de Extranjería in fifteen years — arraigo consolidated into five routes, the social route cut from three years\' residence to two, and asylum seekers given work rights at six months. Spain\'s padrón municipal grants healthcare and schooling irrespective of legal status, and simultaneously builds the residence record an arraigo claim later rests on.',
  ],
};
