import type {
  ImmigrantBenefitsData,
  ImmigrantStatusClass,
  ImmigrantStockRow,
} from '../components/GermanyImmigrantBenefitsSection';

/**
 * Italy — immigrant benefits by residence status.
 *
 * Statistical anchors:
 * - Istat: 3,810,741 non-EU citizens held a valid permit at 31 Dec 2024;
 *   52.8% were EU long-term residents.
 * - Istat: 290,119 first permits in 2024 — family 36.1%, asylum/protection
 *   35.9%, work 13.9%, study 6.9%, other 7.2%.
 * - Istat: 483,673 asylum/protection permits, including 151k+ asylum-request
 *   permits, 59,744 refugees, 54,771 subsidiary-protection holders and
 *   160,600 temporary-protection holders.
 * - Istat: 5.42M foreign residents at 1 Jan 2025. The ~1.6M EU/free-movement
 *   estimate is the residual against the non-EU permit stock and is flagged.
 */

const ITALY_STATUS_CLASSES: readonly ImmigrantStatusClass[] = [
  {
    index: 1,
    title: 'EU / EEA citizens & free movement',
    stockLabel: '~1.6M',
    stockDetail: 'Estimated EU/free-movement residents · no Italian residence permit required',
    benefits: [
      'Immediate labour-market access · no work permit',
      'SSN healthcare when working or otherwise qualifying',
      'ADI possible after 5 years’ Italian residence if household and means tests are met',
      'Family benefits and local services under equal-treatment rules',
      'Permanent residence after 5 years of lawful residence',
    ],
    origins: [{ key: 'europe', label: 'EU / EEA Europe', value: 100 }],
  },
  {
    index: 2,
    title: 'EU long-term resident status (non-EU)',
    stockLabel: '~2.01M',
    stockDetail: '52.8% of 3.81M valid non-EU permits at 31 Dec 2024',
    benefits: [
      'Broad work access and compulsory SSN coverage',
      'ADI eligible if the household meets residence, ISEE and vulnerability tests',
      'Family reunification · education and vocational training',
      'Public-housing access under applicable regional and income rules',
      'Status generally available after 5 years of lawful continuous residence',
    ],
    origins: [
      { key: 'africa', label: 'Sub-Saharan Africa', value: 24 },
      { key: 'mena', label: 'North Africa & Middle East', value: 30 },
      { key: 'europe', label: 'Non-EU Europe', value: 24 },
      { key: 'asia', label: 'Asia', value: 20 },
      { key: 'other', label: 'Other', value: 2 },
    ],
  },
  {
    index: 3,
    title: 'Asylum seekers (procedure)',
    stockLabel: '151k+',
    stockDetail: 'Asylum-request permits at end-2024 · 151,120 first applications during 2024',
    benefits: [
      'Reception place and essential services when without sufficient resources',
      'Pocket money €2.50/day in CPA/CAS reception',
      'SSN registration · schooling for minors',
      'Work permitted 60 days after lodging the asylum application',
      'No general ADI entitlement solely from pending-applicant status',
    ],
    origins: [
      { key: 'asia', label: 'South Asia', value: 36 },
      { key: 'mena', label: 'North Africa & Middle East', value: 28 },
      { key: 'other', label: 'Latin America / other', value: 17 },
      { key: 'africa', label: 'Sub-Saharan Africa', value: 14 },
      { key: 'europe', label: 'Europe', value: 5 },
    ],
  },
  {
    index: 4,
    title: 'Refugees & subsidiary protection',
    stockLabel: '~114.5k',
    stockDetail: '59,744 refugees + 54,771 subsidiary-protection holders at 31 Dec 2024',
    benefits: [
      'Equal access to welfare services, housing, education and employment',
      'Unrestricted work · SSN healthcare',
      'ADI possible after 5 years’ Italian residence when all other tests are met',
      'Family reunification without income or housing proof',
      'Refugees may seek citizenship after 5 years; subsidiary protection follows the ordinary route',
    ],
    origins: [
      { key: 'africa', label: 'Sub-Saharan Africa', value: 45 },
      { key: 'asia', label: 'Asia', value: 25 },
      { key: 'mena', label: 'North Africa & Middle East', value: 20 },
      { key: 'europe', label: 'Europe', value: 8 },
      { key: 'other', label: 'Other', value: 2 },
    ],
  },
  {
    index: 5,
    title: 'Temporary protection (Ukraine)',
    stockLabel: '~160.6k',
    stockDetail: 'Temporary-protection permit stock at 31 Dec 2024 · Ukraine displacement scheme',
    benefits: [
      'Immediate work and self-employment access',
      'SSN healthcare · education and schooling',
      'Reception or subsistence support when eligible',
      'Family unity and conversion options under applicable rules',
      'Protection permits renewable under the EU scheme through 4 March 2027',
    ],
    origins: [
      { key: 'europe', label: 'Europe (primarily Ukraine)', value: 99 },
      { key: 'other', label: 'Other eligible residents', value: 1 },
    ],
  },
  {
    index: 6,
    title: 'Family residence permits',
    stockLabel: '~104.7k/yr',
    stockDetail: '36.1% of 290,119 first permits issued in 2024',
    benefits: [
      'Employment or self-employment without a separate work permit',
      'SSN registration · education and vocational training',
      'Access to assistance services under the applicable residence and means tests',
      'Permit normally follows the sponsor’s duration',
      'May convert to work or study status after qualifying family changes',
    ],
    origins: [
      { key: 'mena', label: 'North Africa & Middle East', value: 30 },
      { key: 'europe', label: 'Non-EU Europe', value: 25 },
      { key: 'asia', label: 'Asia', value: 25 },
      { key: 'africa', label: 'Sub-Saharan Africa', value: 18 },
      { key: 'other', label: 'Other', value: 2 },
    ],
  },
  {
    index: 7,
    title: 'Workers & labour migrants',
    stockLabel: '40.5k/yr',
    stockDetail: '40,451 first work permits in 2024 · seasonal permits were the largest subtype',
    benefits: [
      'Equal labour rights and full social-insurance contributions',
      'Compulsory SSN registration',
      'Unemployment and contribution-based benefits when qualifying',
      'Family reunification with a permit of at least one year',
      'Public-housing access with a qualifying two-year permit and regular work',
    ],
    origins: [
      { key: 'asia', label: 'Asia (notably India)', value: 55 },
      { key: 'mena', label: 'North Africa & Middle East', value: 25 },
      { key: 'africa', label: 'Sub-Saharan Africa', value: 10 },
      { key: 'europe', label: 'Non-EU Europe', value: 8 },
      { key: 'other', label: 'Other', value: 2 },
    ],
  },
  {
    index: 8,
    title: 'Students & trainees',
    stockLabel: '20.1k/yr',
    stockDetail: '20,130 first study permits in 2024',
    benefits: [
      'Work up to 20 hours/week and 1,040 hours/year',
      'Healthcare through insurance or voluntary SSN enrolment',
      'May compete for study grants, housing and student services on equal terms',
      'Study permit can convert to work when legal conditions are met',
      'No automatic ADI entitlement from student status',
    ],
    origins: [
      { key: 'mena', label: 'Iran, Türkiye & MENA', value: 35 },
      { key: 'asia', label: 'Asia', value: 35 },
      { key: 'europe', label: 'Non-EU Europe', value: 20 },
      { key: 'africa', label: 'Africa', value: 8 },
      { key: 'other', label: 'Other', value: 2 },
    ],
  },
  {
    index: 9,
    title: 'Irregular or undocumented status',
    stockLabel: 'No official stock',
    stockDetail: 'Not included in the valid-permit register · estimates vary by method',
    benefits: [
      'Urgent and essential healthcare through the STP system',
      'Preventive, maternity and child healthcare protections',
      'Compulsory schooling for minors regardless of status',
      'No regular labour-market access or ADI',
      'Special permits may apply to trafficking, violence or labour-exploitation victims',
    ],
    origins: [{ key: 'other', label: 'No official origin classification', value: 100 }],
  },
];

const ITALY_STOCK_OVERVIEW: readonly ImmigrantStockRow[] = [
  { name: 'Long-term non-EU', value: 2.012, fill: 'hsl(142, 71%, 45%)' },
  { name: 'EU free movement (est.)', value: 1.6, fill: 'hsl(199, 89%, 48%)' },
  { name: 'Temporary protection', value: 0.1606, fill: 'hsl(215, 70%, 55%)' },
  { name: 'Asylum-request permits', value: 0.151, fill: 'hsl(0, 72%, 55%)' },
  { name: 'Refugee + subsidiary', value: 0.1145, fill: 'hsl(280, 55%, 58%)' },
  { name: 'Family permits (annual)', value: 0.1047, fill: 'hsl(38, 92%, 50%)' },
  { name: 'Work permits (annual)', value: 0.0405, fill: 'hsl(258, 55%, 62%)' },
  { name: 'Study permits (annual)', value: 0.0201, fill: 'hsl(215, 14%, 45%)' },
] as const;

export const ITALY_IMMIGRANT_BENEFITS: ImmigrantBenefitsData = {
  statusClasses: ITALY_STATUS_CLASSES,
  stockOverview: ITALY_STOCK_OVERVIEW,
  caption:
    'Nine residence situations · benefits depend on legal status, residence history, household composition and means tests—not nationality alone. Italy had 5.42M foreign residents at 1 Jan 2025.',
  notes: [
    'Stocks and flows: Istat, “Cittadini non comunitari in Italia — Anno 2024” (published 28 Oct 2025): 3,810,741 valid non-EU permits; 52.8% long-term; 483,673 asylum/protection permits; 290,119 first permits. Istat demographic indicators: 5.42M foreign residents at 1 Jan 2025.',
    'Benefit rules: INPS Assegno di Inclusione (ADI), updated 29 Dec 2025; Ministry of Labour Integration Portal on family, work, study, health and international-protection rights; Interior Ministry / EUAA reception rules. ADI generally requires an eligible status, 5 years’ Italian residence (last 2 continuous), a qualifying vulnerable household and the applicable ISEE/income/assets tests.',
    'The EU/free-movement stock and regional origin mixes are approximate analytical groupings because the permit register excludes EU citizens and official publications do not cross-tab every status by region. Annual-flow slices are not resident stocks and are labelled “/yr”. Irregular residents have no official administrative stock.',
  ],
};
