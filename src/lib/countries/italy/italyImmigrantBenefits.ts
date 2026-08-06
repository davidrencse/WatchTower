import type {
  ImmigrantBenefitsData,
  ImmigrantStatusClass,
  ImmigrantStockRow,
} from '../../../components/countries/germany/GermanyImmigrantBenefitsSection';

/**
 * Italy — immigrant benefits and services by residence status.
 *
 * Statistical baseline:
 * - Istat, "Cittadini non comunitari in Italia — Anno 2024" (28 Oct 2025).
 * - Istat, "Indicatori demografici — Anno 2024" (31 Mar 2025).
 *
 * Rules were rechecked against INPS, the Ministry of Labour's Integration
 * Portal, the Ministry of Health and EU sources in July 2026. Eligibility is
 * shown here; Italy does not publish one comparable dataset of actual benefit
 * take-up cross-tabulated by every residence status below.
 */

const ISTAT_PERMITS_URL =
  'https://www.istat.it/comunicato-stampa/cittadini-non-comunitari-in-italia-anno-2024/';
const ISTAT_DEMOGRAPHY_URL =
  'https://www.istat.it/comunicato-stampa/indicatori-demografici-anno-2024/';
const ADI_URL =
  'https://www.inps.it/it/it/dettaglio-scheda.it.schede-servizio-strumento.schede-servizi.assegno-di-inclusione-adi.html';
const EU_RESIDENCE_URL =
  'https://europa.eu/youreurope/citizens/residence/documents-formalities/eu-nationals-permanent-residence/index_it.htm';
const LONG_TERM_URL =
  'https://www.integrazionemigranti.gov.it/it-it/Altre-info/e/4/o/5/id/2/Il-permesso-di-soggiorno-UE-per-lungo-soggiornanti';
const ASYLUM_WORK_URL =
  'https://www.integrazionemigranti.gov.it/it-it/Altre-info/id/%203/I-permessi-di-soggiorno-che-abilitano-al-lavoro';
const PROTECTION_RIGHTS_URL =
  'https://www.integrazionemigranti.gov.it/it-it/Altre-info/e/4/o/11/id/21/I-diritti-riconosciuti';
const TEMPORARY_PROTECTION_URL =
  'https://www.integrazionemigranti.gov.it/Ricerca-news/Dettaglio-news/id/4550/Protezione-temporanea-per-gli-ucraini-permessi-rinnovabili-fino-a-marzo-2027';
const FAMILY_URL =
  'https://integrazionemigranti.gov.it/it-it/Ricerca-norme/Dettaglio-norma/id/7/Lunita-familiare';
const WORK_URL =
  'https://www.integrazionemigranti.gov.it/it-it/Altre-info/e/4/o/5/id/4/Il-permesso-unico-per-soggiorno-e-lavoro';
const STUDY_URL =
  'https://www.integrazionemigranti.gov.it/it-it/Ricerca-news/Dettaglio-news/id/3085/-possibile-lavorare-con-un-permesso-per-motivi-di-studio-E-svolgere-un-tirocinio';
const HEALTH_URL =
  'https://www.salute.gov.it/new/it/tema/iscrizione-al-ssn/iscrizione-dei-cittadini-stranieri-al-servizio-sanitario-nazionale-ssn/';
const RECEPTION_TERMS_URL =
  'https://prefettura.interno.gov.it/sites/default/files/76/2024-06/risposte_a_quesiti.pdf';
const SPECIAL_CASES_ADI_URL =
  'https://www.inps.it/it/it/inps-comunica/notizie/dettaglio-news-page.news.2026.05.adi-per-i-titolari-di-permesso-di-soggiorno-per-casi-speciali.html';

const NO_COMPLETE_ORIGIN_CROSSTAB =
  'No complete, comparable status-by-citizenship distribution is published for this category; no estimated regional mix is shown.';

const ITALY_STATUS_CLASSES: readonly ImmigrantStatusClass[] = [
  {
    index: 1,
    title: 'EU / EEA citizens & free movement',
    stockLabel: '~1.6M',
    stockDetail: 'Analytical estimate for 1 Jan 2025 · no Italian residence permit required',
    benefits: [
      'Immediate employee or self-employed labour-market access',
      'SSN enrolment is compulsory and free for workers and qualifying family members',
      'Students and self-sufficient residents need comprehensive health cover',
      'ADI possible after 5 years’ Italian residence if household and means tests are met',
      'Permanent residence acquired after 5 years of continuous lawful residence',
    ],
    originHeading: 'Registry limitation',
    originSummary:
      'Istat’s residence register covers EU citizens, while its permit register excludes them. The ~1.6M scale is an analytical estimate, not a permit-register count.',
    source: { label: 'Your Europe — permanent residence', url: EU_RESIDENCE_URL },
  },
  {
    index: 2,
    title: 'EU long-term resident status (non-EU)',
    stockLabel: '~2.012M',
    stockDetail: '52.8% of 3,810,741 valid non-EU permits · 31 Dec 2024',
    benefits: [
      'Indefinite status with broad employee and self-employed work access',
      'Compulsory SSN coverage and equal treatment in education and social security',
      'ADI eligible if residence, vulnerable-household, ISEE, income and asset tests are met',
      'Equal public-housing access under the applicable regional and income rules',
      'Normally requires 5 years’ lawful stay, minimum income and A2 Italian',
    ],
    originHeading: 'Origin evidence',
    originSummary:
      'Istat publishes long-term-resident rates for selected citizenships, not a complete stock distribution by region. No synthetic regional estimate is used.',
    source: { label: 'Integration Portal — long-term residence', url: LONG_TERM_URL },
  },
  {
    index: 3,
    title: 'Asylum seekers (procedure)',
    stockLabel: '151k+',
    stockDetail: 'Asylum-request permits at end-2024 · 151,120 first applicants during 2024',
    benefits: [
      'Reception, food and essential services when lacking sufficient resources',
      'Pocket money €2.50/day in government reception centres',
      'SSN registration and compulsory schooling for minors',
      'Work permitted 60 days after the asylum application is lodged',
      'No ADI entitlement solely from pending-applicant status',
    ],
    originHeading: '2024 first asylum applicants · official',
    origins: [
      { key: 'bangladesh', label: 'Bangladesh', value: 21.7 },
      { key: 'peru', label: 'Peru', value: 10.3 },
      { key: 'pakistan', label: 'Pakistan', value: 7.8 },
      { key: 'egypt', label: 'Egypt', value: 7.7 },
      { key: 'morocco', label: 'Morocco', value: 6.6 },
      { key: 'other-asylum', label: 'Other', value: 45.9 },
    ],
    source: { label: 'Istat 2024 asylum and permit report', url: ISTAT_PERMITS_URL },
  },
  {
    index: 4,
    title: 'Refugees & subsidiary protection',
    stockLabel: '114,515',
    stockDetail: '59,744 refugees + 54,771 subsidiary-protection holders · 31 Dec 2024',
    benefits: [
      'Equal access to work, social assistance, housing, education and SSN healthcare',
      'Five-year renewable residence permit',
      'ADI possible after 5 years’ Italian residence when all other tests are met',
      'Family reunification without income or housing proof',
      'Citizenship route: 5 years for refugees; ordinary 10-year route for subsidiary protection',
    ],
    originHeading: 'Origin evidence',
    originSummary: NO_COMPLETE_ORIGIN_CROSSTAB,
    source: { label: 'Integration Portal — protection rights', url: PROTECTION_RIGHTS_URL },
  },
  {
    index: 5,
    title: 'Temporary protection (Ukraine)',
    stockLabel: '160,600',
    stockDetail: 'Temporary-protection permits in Istat’s 31 Dec 2024 stock',
    benefits: [
      'Immediate employee and self-employed work access',
      'SSN healthcare on the same basis as Italian residents',
      'Education, schooling and recognition-support measures',
      'Needs-tested reception continues; the earlier €300/month cash support ended for new permits',
      'Permits renewable under the EU scheme through 4 March 2027',
    ],
    originHeading: 'Origin evidence',
    originSummary:
      'Istat identifies Ukrainians as the predominant group but does not publish a complete nationality split for this stock in the 2024 summary.',
    source: { label: 'Italy temporary-protection extension', url: TEMPORARY_PROTECTION_URL },
  },
  {
    index: 6,
    title: 'Family residence permits',
    stockLabel: '~104.7k/yr',
    stockDetail: '36.1% of 290,119 first permits issued in 2024',
    benefits: [
      'Employee or self-employed work without a separate work permit',
      'Compulsory SSN registration, education and vocational training',
      'Access to assistance services under the relevant residence and means tests',
      'Permit normally has the same duration as the sponsor’s permit',
      'May convert to work or study after qualifying family changes',
    ],
    originHeading: 'Origin evidence',
    originSummary:
      'The Istat release reports citizenship-specific trends but not a complete family-permit distribution suitable for a part-to-whole chart.',
    source: { label: 'Integration Portal — family unity', url: FAMILY_URL },
  },
  {
    index: 7,
    title: 'Workers & labour migrants',
    stockLabel: '40,451/yr',
    stockDetail: 'First work permits in 2024 · 13.9% of all first permits',
    benefits: [
      'Equal employment conditions and contribution-based social-security rights',
      'Compulsory SSN registration',
      'Unemployment and pension benefits when contribution tests are met',
      'Family reunification subject to sponsor, residence, income and housing rules',
      'Public housing with long-term status or a qualifying two-year permit plus regular work',
    ],
    originHeading: '2024 first work permits · official',
    origins: [
      { key: 'india-work', label: 'India', value: 21.2 },
      { key: 'morocco-work', label: 'Morocco', value: 16.0 },
      { key: 'other-work', label: 'Other', value: 62.8 },
    ],
    source: { label: 'Istat 2024 work permits', url: ISTAT_PERMITS_URL },
  },
  {
    index: 8,
    title: 'Students & trainees',
    stockLabel: '20,130/yr',
    stockDetail: 'First study permits in 2024 · 6.9% of all first permits',
    benefits: [
      'Employee work up to 20 hours/week and 1,040 hours/year',
      'Healthcare through comprehensive insurance or voluntary SSN enrolment',
      'Access to study grants, housing and student services under programme rules',
      'Study permits may convert to work when legal conditions are met',
      'No automatic ADI entitlement from student status',
    ],
    originHeading: '2024 first study permits · official',
    origins: [
      { key: 'iran-study', label: 'Iran', value: 15.3 },
      { key: 'china-study', label: 'China', value: 12.7 },
      { key: 'turkiye-study', label: 'Türkiye', value: 8.6 },
      { key: 'india-study', label: 'India', value: 5.1 },
      { key: 'pakistan-study', label: 'Pakistan', value: 4.1 },
      { key: 'other-study', label: 'Other', value: 54.2 },
    ],
    source: { label: 'Istat 2024 study permits', url: ISTAT_PERMITS_URL },
  },
  {
    index: 9,
    title: 'Irregular or undocumented status',
    stockLabel: 'No official stock',
    stockDetail: 'Outside the valid-permit register · estimates vary by definition and method',
    benefits: [
      'Urgent and essential healthcare through the STP system',
      'Preventive, maternity and child healthcare without police reporting for seeking care',
      'Compulsory schooling for minors regardless of status',
      'No regular labour-market access or ordinary ADI entitlement',
      'Victims granted a “special cases” permit may access ADI if all other tests are met',
    ],
    originHeading: 'Administrative coverage',
    originSummary:
      'An irregular population cannot be measured from the valid-permit register, and no official status-by-origin administrative stock exists.',
    source: { label: 'Ministry of Health / INPS special-cases guidance', url: SPECIAL_CASES_ADI_URL },
  },
];

const ITALY_STOCK_OVERVIEW: readonly ImmigrantStockRow[] = [
  {
    name: 'Long-term non-EU permits',
    value: 2.012,
    valueLabel: '~2.012M',
    fill: 'hsl(142, 71%, 45%)',
    basis: 'stock',
  },
  {
    name: 'EU / EEA residents',
    value: 1.6,
    valueLabel: '~1.6M est.',
    fill: 'hsl(199, 89%, 48%)',
    basis: 'stock',
  },
  {
    name: 'Temporary protection',
    value: 0.1606,
    valueLabel: '160,600',
    fill: 'hsl(215, 70%, 55%)',
    basis: 'stock',
  },
  {
    name: 'Asylum-request permits',
    value: 0.151,
    valueLabel: '151k+',
    fill: 'hsl(0, 72%, 55%)',
    basis: 'stock',
  },
  {
    name: 'Refugee + subsidiary protection',
    value: 0.114515,
    valueLabel: '114,515',
    fill: 'hsl(280, 55%, 58%)',
    basis: 'stock',
  },
  {
    name: 'Family',
    value: 0.1047,
    valueLabel: '36.1% · ~104.7k',
    fill: 'hsl(38, 92%, 50%)',
    basis: 'annual-flow',
  },
  {
    name: 'Asylum & protection',
    value: 0.1042,
    valueLabel: '35.9% · ~104.2k',
    fill: 'hsl(0, 72%, 55%)',
    basis: 'annual-flow',
  },
  {
    name: 'Work',
    value: 0.040451,
    valueLabel: '13.9% · 40,451',
    fill: 'hsl(258, 55%, 62%)',
    basis: 'annual-flow',
  },
  {
    name: 'Study',
    value: 0.02013,
    valueLabel: '6.9% · 20,130',
    fill: 'hsl(215, 14%, 50%)',
    basis: 'annual-flow',
  },
  {
    name: 'Other',
    value: 0.0209,
    valueLabel: '7.2% · ~20.9k',
    fill: 'hsl(215, 14%, 38%)',
    basis: 'annual-flow',
  },
] as const;

export const ITALY_IMMIGRANT_BENEFITS: ImmigrantBenefitsData = {
  statusClasses: ITALY_STATUS_CLASSES,
  stockOverview: ITALY_STOCK_OVERVIEW,
  caption:
    'Nine legal situations · this subsection compares eligibility and services, not nationality or actual benefit take-up. Italy had 5.422M foreign residents at 1 Jan 2025.',
  overviewDescription:
    'Stocks and 2024 first-permit flows are separated because they have different denominators and must not be added together.',
  notes: [
    'Latest complete permit baseline: Istat, 31 Dec 2024 — 3,810,741 valid non-EU permits; 52.8% long-term; 483,673 asylum/protection permits; 290,119 first permits issued during 2024. Foreign-resident baseline: 5.422M at 1 Jan 2025.',
    'ADI is not a payment automatically attached to immigration status. Eligible legal categories must also satisfy 5 years’ Italian residence (last 2 continuous), vulnerable-household composition, ISEE, income and asset rules. Pending asylum, temporary protection, family, work and study permits do not by themselves meet the ordinary status test.',
    'Citizenship pies are shown only where the Istat release publishes an auditable 2024 flow breakdown. They describe citizenship among applicants or permit recipients, not benefit use. Missing cross-tabs are identified instead of being estimated.',
    'The EU/EEA scale is approximate because the residence register and non-EU permit register cover different populations. Annual flows are explicitly labelled “/yr”. No official administrative stock exists for irregular residents.',
  ],
  sources: [
    { label: 'Istat — non-EU citizens and permits, 2024', url: ISTAT_PERMITS_URL },
    { label: 'Istat — demographic indicators, 2024', url: ISTAT_DEMOGRAPHY_URL },
    { label: 'INPS — Assegno di Inclusione requirements', url: ADI_URL },
    { label: 'Ministry of Health — foreign residents and the SSN', url: HEALTH_URL },
    { label: 'Ministry of Interior — reception terms and €2.50 daily allowance', url: RECEPTION_TERMS_URL },
    { label: 'Integration Portal — protection holders’ rights', url: PROTECTION_RIGHTS_URL },
    { label: 'Integration Portal — work-enabled permits', url: ASYLUM_WORK_URL },
    { label: 'Integration Portal — family residence rights', url: FAMILY_URL },
    { label: 'Integration Portal — single work permit', url: WORK_URL },
    { label: 'Integration Portal — student work limits', url: STUDY_URL },
  ],
};
