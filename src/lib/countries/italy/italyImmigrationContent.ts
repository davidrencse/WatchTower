import type {
  MigrantArrivalsRow,
  MigrationBackgroundRow,
} from '../../../components/countries/germany/GermanyImmigrationSection';
import type { AdvocateCard } from '../../../components/countries/germany/GermanyImmigrationAdvocatesSubsection';
import type {
  DeportationReentryRow,
  DeportationTrendRow,
} from '../../../components/countries/germany/GermanyMigrantCrimeSection';
import type { GermanyImmigrationTreemapItem } from '../germany/germanyImmigrationTreemapData';
import type {
  AsylumApplicationRow,
  ContributionRow,
  OriginCountRow,
  PublicOpinionRow,
  RegionAsylumRow,
  WelfareRow,
  YearShareRow,
} from '../france/franceImmigrationContent';

const EUROSTAT_FOREIGN_BORN_URL =
  'https://ec.europa.eu/eurostat/databrowser/view/migr_pop3ctb/default/table?lang=en';
const EUROSTAT_IMMIGRATION_URL =
  'https://ec.europa.eu/eurostat/databrowser/view/migr_imm1ctz/default/table?lang=en';
const EUROSTAT_RETURNS_URL =
  'https://ec.europa.eu/eurostat/databrowser/view/migr_eirtn/default/table?lang=en';
const EUROSTAT_ORDERS_URL =
  'https://ec.europa.eu/eurostat/databrowser/view/migr_eiord/default/table?lang=en';
const EUROSTAT_CITIZENSHIP_STOCK_URL =
  'https://ec.europa.eu/eurostat/databrowser/view/migr_pop1ctz/default/table?lang=en';
const EUROSTAT_HOUSING_URL =
  'https://ec.europa.eu/eurostat/databrowser/view/ilc_lvho15/default/table?lang=en';
const EUROSTAT_HOUSING_COST_URL =
  'https://ec.europa.eu/eurostat/databrowser/view/ilc_lvho25/default/table?lang=en';
const EUROSTAT_ASYLUM_URL =
  'https://ec.europa.eu/eurostat/databrowser/view/migr_asyappctza/default/table?lang=en';
const UNHCR_POPULATION_URL =
  'https://api.unhcr.org/population/v1/population/?limit=200&year=2025&coa=ITA&coo_all=TRUE';
const ISTAT_LANGUAGE_URL =
  'https://www.istat.it/comunicato-stampa/luso-della-lingua-italiana-dei-dialetti-e-delle-lingue-straniere-anno-2024/';
const ITALY_FISCAL_STUDY_URL =
  'https://home-affairs.ec.europa.eu/whats-new/publications/net-fiscal-position-migrants-europe-trends-and-insights_en';
const ITALY_WELFARE_REPORT_URL =
  'https://www.lavoro.gov.it/sites/default/files/temi-e-priorita%2C%20immigrazione/studi-e-statistiche/XV%20Rapporto%20MdL%20Stranieri%202025.pdf';

export const ITALY_REFUGEES_VALUE = 192_914;
export const ITALY_REFUGEES_NOTE =
  'Italy, end-2025. UNHCR refugees and people in refugee-like situations; excludes 234,144 pending asylum cases.';

export const ITALY_WORK_VISAS_VALUE = 40_451;
export const ITALY_WORK_VISAS_NOTE =
  'First residence permits for work issued to non-EU citizens in 2024 (Istat permit register).';

export const ITALY_FOREIGN_BORN_VALUE = 6_928_045;
export const ITALY_FOREIGN_BORN_NOTE =
  'Foreign-born residents on 1 January 2025 (Eurostat). This is a birthplace measure, not a complete descendant or ethnic-background count.';

export const ITALY_FOREIGN_BORN_BY_YEAR: readonly MigrationBackgroundRow[] = [
  { year: '2002', migrants: 2_261_729 },
  { year: '2003', migrants: 2_417_218 },
  { year: '2004', migrants: 2_817_326 },
  { year: '2005', migrants: 3_169_038 },
  { year: '2006', migrants: 3_384_810 },
  { year: '2007', migrants: 3_563_728 },
  { year: '2008', migrants: 3_989_058 },
  { year: '2009', migrants: 4_358_808 },
  { year: '2010', migrants: 4_597_046 },
  { year: '2011', migrants: 4_834_495 },
  { year: '2012', migrants: 5_022_967 },
  { year: '2013', migrants: 5_220_823 },
  { year: '2014', migrants: 5_355_018 },
  { year: '2015', migrants: 5_383_252 },
  { year: '2016', migrants: 5_656_510 },
  { year: '2017', migrants: 5_770_263 },
  { year: '2018', migrants: 5_888_837 },
  { year: '2019', migrants: 6_069_000 },
  { year: '2020', migrants: 6_161_391 },
  { year: '2021', migrants: 6_262_207 },
  { year: '2022', migrants: 6_161_003 },
  { year: '2023', migrants: 6_417_206 },
  { year: '2024', migrants: 6_673_604 },
  { year: '2025', migrants: 6_928_045 },
];

const ITALY_ARRIVALS_COMPACT = [
  ['2008', 496_549, 315_827, 180_722, 75_831],
  ['2009', 406_725, 221_982, 184_743, 72_361],
  ['2010', 424_499, 216_957, 207_542, 75_669],
  ['2011', 354_327, 176_287, 178_040, 64_283],
  ['2012', 321_305, 150_163, 171_142, 65_025],
  ['2013', 279_021, 123_202, 155_819, 62_827],
  ['2014', 248_360, 103_145, 145_215, 57_644],
  ['2015', 250_026, 97_168, 152_858, 66_491],
  ['2016', 262_929, 96_625, 166_304, 78_666],
  ['2017', 301_071, 96_676, 204_395, 107_193],
  ['2018', 285_500, 95_476, 190_024, 89_866],
  ['2019', 264_571, 100_926, 163_645, 61_055],
  ['2020', 191_766, 79_410, 112_356, 45_878],
  ['2021', 243_607, 88_674, 154_933, 57_456],
  ['2022', 336_495, 126_072, 210_423, 71_572],
  ['2023', 378_372, 128_987, 249_385, 94_192],
  ['2024', 393_115, 111_297, 281_818, 113_572],
] as const;

const formatCount = (value: number) => value.toLocaleString('en-US');

export const ITALY_MIGRANT_ARRIVALS_SERIES: readonly MigrantArrivalsRow[] =
  ITALY_ARRIVALS_COMPACT.map(([year, total, europe, nonEurope, africa]) => ({
    year,
    total,
    totalDisplay: formatCount(total),
    europe,
    europeDisplay: formatCount(europe),
    nonEurope,
    nonEuropeDisplay: formatCount(nonEurope),
    africa,
    africaDisplay: formatCount(africa),
  }));

const ITALY_RETURNS_BY_YEAR = [
  ['2008', 7_140],
  ['2009', 5_315],
  ['2010', 4_890],
  ['2011', 6_180],
  ['2012', 7_365],
  ['2013', 5_860],
  ['2014', 5_310],
  ['2015', 4_670],
  ['2016', 5_715],
  ['2017', 7_045],
  ['2018', 5_615],
  ['2019', 6_470],
  ['2020', 2_815],
  ['2021', 975],
  ['2022', 2_790],
  ['2023', 3_275],
  ['2024', 4_480],
  ['2025', 4_780],
] as const;

const ITALY_FOREIGN_CITIZENS_BY_YEAR: Readonly<Record<string, number>> = {
  '2008': 3_151_553,
  '2009': 3_558_853,
  '2010': 3_836_349,
  '2011': 4_101_335,
  '2012': 4_319_201,
  '2013': 4_610_493,
  '2014': 4_787_166,
  '2015': 4_835_245,
  '2016': 4_831_042,
  '2017': 4_818_633,
  '2018': 4_883_451,
  '2019': 4_996_158,
  '2020': 5_039_637,
  '2021': 5_171_894,
  '2022': 5_030_716,
  '2023': 5_141_341,
  '2024': 5_253_658,
  '2025': 5_371_251,
};

export const ITALY_DEPORTATION_TREND_SERIES: readonly DeportationTrendRow[] = (() => {
  let cumulative = 0;
  return ITALY_RETURNS_BY_YEAR.map(([year, yearlyDeported]) => {
    cumulative += yearlyDeported;
    const denominator = ITALY_FOREIGN_CITIZENS_BY_YEAR[year]!;
    const rate = Math.round((yearlyDeported / denominator) * 100_000);
    return {
      year,
      yearlyDeported,
      yearlyDeportedDisplay: formatCount(yearlyDeported),
      cumulativeDeported: cumulative,
      cumulativeDeportedDisplay: formatCount(cumulative),
      deportationRate: rate,
      deportationRateDisplay: String(rate),
    };
  });
})();

const ITALY_ORDERS_TO_LEAVE: Readonly<Record<string, number>> = {
  '2008': 68_175,
  '2009': 53_440,
  '2010': 46_955,
  '2011': 29_505,
  '2012': 29_345,
  '2013': 23_945,
  '2014': 25_300,
  '2015': 27_305,
  '2016': 32_365,
  '2017': 36_240,
  '2018': 27_070,
  '2019': 26_900,
  '2020': 22_785,
  '2021': 11_095,
  '2022': 28_185,
  '2023': 26_460,
  '2024': 27_970,
  '2025': 21_295,
};

export const ITALY_RETURN_ORDER_ENFORCEMENT_SERIES: readonly DeportationReentryRow[] =
  ITALY_RETURNS_BY_YEAR.map(([year, returnedCount]) => ({
    year,
    returnedCount,
    returnPct: Math.round((returnedCount / ITALY_ORDERS_TO_LEAVE[year]!) * 1_000) / 10,
  }));

export const ITALY_DEPORTATION_NOTE =
  'Eurostat administrative series migr_eirtn and migr_eiord. Annual series begin in 2008; counts are rounded to the nearest five. Italy has a data-source break from 2025. The same-year return/order percentage is an operational ratio, not a cohort execution rate because an order and its return can occur in different years.';

export const ITALY_LANGUAGE_INTEGRATION_TITLE =
  'Predominant use of Italian among foreign-mother-tongue residents (2024)';
export const ITALY_LANGUAGE_INTEGRATION_DESC =
  'Share speaking only or predominantly Italian in each context. Istat survey data for residents aged 6+ whose mother tongue is not Italian; no official B1-after-five-years-by-origin series is available for Italy.';
export const ITALY_LANGUAGE_INTEGRATION = [
  { origin: 'With family', b1PlusRate: 26.0 },
  { origin: 'With friends', b1PlusRate: 46.4 },
  { origin: 'With strangers', b1PlusRate: 73.1 },
] as const;

export const ITALY_IMMIGRATION_TREEMAP_ITEMS: readonly GermanyImmigrationTreemapItem[] = [
  { country: 'Romania', population: 1_053_042, malePct: 43.7, shareOfTotalPct: 19.6052, sourceUrl: EUROSTAT_CITIZENSHIP_STOCK_URL },
  { country: 'Albania', population: 414_622, malePct: 51.4, shareOfTotalPct: 7.7193, sourceUrl: EUROSTAT_CITIZENSHIP_STOCK_URL },
  { country: 'Morocco', population: 412_457, malePct: 54.8, shareOfTotalPct: 7.679, sourceUrl: EUROSTAT_CITIZENSHIP_STOCK_URL },
  { country: 'China', population: 311_250, malePct: 50.4, shareOfTotalPct: 5.7947, sourceUrl: EUROSTAT_CITIZENSHIP_STOCK_URL },
  { country: 'Ukraine', population: 287_187, malePct: 25.1, shareOfTotalPct: 5.3467, sourceUrl: EUROSTAT_CITIZENSHIP_STOCK_URL },
  { country: 'Bangladesh', population: 213_622, malePct: 74.1, shareOfTotalPct: 3.9771, sourceUrl: EUROSTAT_CITIZENSHIP_STOCK_URL },
  { country: 'Egypt', population: 174_141, malePct: 68.4, shareOfTotalPct: 3.2421, sourceUrl: EUROSTAT_CITIZENSHIP_STOCK_URL },
  { country: 'India', population: 171_429, malePct: 56.6, shareOfTotalPct: 3.1916, sourceUrl: EUROSTAT_CITIZENSHIP_STOCK_URL },
  { country: 'Pakistan', population: 171_179, malePct: 74.4, shareOfTotalPct: 3.1869, sourceUrl: EUROSTAT_CITIZENSHIP_STOCK_URL },
  { country: 'Philippines', population: 153_455, malePct: 43.1, shareOfTotalPct: 2.857, sourceUrl: EUROSTAT_CITIZENSHIP_STOCK_URL },
  { country: 'Nigeria', population: 132_129, malePct: 57.3, shareOfTotalPct: 2.4599, sourceUrl: EUROSTAT_CITIZENSHIP_STOCK_URL },
  { country: 'Tunisia', population: 123_828, malePct: 63.3, shareOfTotalPct: 2.3054, sourceUrl: EUROSTAT_CITIZENSHIP_STOCK_URL },
  { country: 'Senegal', population: 119_067, malePct: 73.1, shareOfTotalPct: 2.2167, sourceUrl: EUROSTAT_CITIZENSHIP_STOCK_URL },
  { country: 'Peru', population: 116_169, malePct: 42.9, shareOfTotalPct: 2.1628, sourceUrl: EUROSTAT_CITIZENSHIP_STOCK_URL },
  { country: 'Sri Lanka', population: 113_705, malePct: 52.2, shareOfTotalPct: 2.1169, sourceUrl: EUROSTAT_CITIZENSHIP_STOCK_URL },
  { country: 'Moldova', population: 94_141, malePct: 33.4, shareOfTotalPct: 1.7527, sourceUrl: EUROSTAT_CITIZENSHIP_STOCK_URL },
  { country: 'Poland', population: 72_212, malePct: 25.8, shareOfTotalPct: 1.3444, sourceUrl: EUROSTAT_CITIZENSHIP_STOCK_URL },
  { country: 'Ecuador', population: 57_980, malePct: 45.1, shareOfTotalPct: 1.0795, sourceUrl: EUROSTAT_CITIZENSHIP_STOCK_URL },
  { country: 'Brazil', population: 54_338, malePct: 31.9, shareOfTotalPct: 1.0116, sourceUrl: EUROSTAT_CITIZENSHIP_STOCK_URL },
  { country: 'Bulgaria', population: 47_465, malePct: 38.4, shareOfTotalPct: 0.8837, sourceUrl: EUROSTAT_CITIZENSHIP_STOCK_URL },
  { country: 'North Macedonia', population: 47_372, malePct: 50.8, shareOfTotalPct: 0.882, sourceUrl: EUROSTAT_CITIZENSHIP_STOCK_URL },
  { country: 'Ghana', population: 46_327, malePct: 68.5, shareOfTotalPct: 0.8625, sourceUrl: EUROSTAT_CITIZENSHIP_STOCK_URL },
  { country: 'Russia', population: 43_119, malePct: 21.7, shareOfTotalPct: 0.8028, sourceUrl: EUROSTAT_CITIZENSHIP_STOCK_URL },
  { country: 'Georgia', population: 36_490, malePct: 15.3, shareOfTotalPct: 0.6794, sourceUrl: EUROSTAT_CITIZENSHIP_STOCK_URL },
  { country: 'Germany', population: 36_427, malePct: 38.8, shareOfTotalPct: 0.6782, sourceUrl: EUROSTAT_CITIZENSHIP_STOCK_URL },
  { country: 'Kosovo', population: 36_180, malePct: 55.2, shareOfTotalPct: 0.6736, sourceUrl: EUROSTAT_CITIZENSHIP_STOCK_URL },
  { country: "Cote d'Ivoire", population: 35_436, malePct: 64.0, shareOfTotalPct: 0.6597, sourceUrl: EUROSTAT_CITIZENSHIP_STOCK_URL },
];

export const ITALY_TREEMAP_NOTE =
  'Largest foreign-citizen resident populations on 1 January 2025. Counts, male shares and shares of Italy\'s 5,371,251 foreign citizens are calculated directly from Eurostat migr_pop1ctz. Citizenship is not birthplace or ethnicity.';

const ITALY_OVERCROWDING = [43.7, 47.9, 46.2, 52.9, 52.7, 55.6, 53.1, 52.4, 52.8, 54.9, 58.8, 52.9, 59.8, 51.1, 50.7, 44.9, 45.5];
const ITALY_HOUSING_OVERBURDEN = [30.0, 25.6, 25.6, 25.2, 29.2, 27.1, 25.5, 27.9, 24.8, 24.5, 24.3, 20.8, 21.3, 24.9, 22.0, 14.5, 15.2];

export const ITALY_HOUSING_DISADVANTAGE: readonly YearShareRow[] =
  ITALY_OVERCROWDING.map((socialHousingShare, index) => ({
    year: String(2009 + index),
    socialHousingShare,
    healthcareShare: ITALY_HOUSING_OVERBURDEN[index]!,
  }));

export const ITALY_HOUSING_TITLE =
  'Housing disadvantage among non-EU citizens in Italy';
export const ITALY_HOUSING_DESC =
  'Eurostat EU-SILC rates for non-EU citizens aged 18+: overcrowding and housing-cost overburden, 2009-2025. These are observed Italian indicators, not modelled healthcare or social-housing shares.';

export const ITALY_PUBLIC_OPINION: readonly PublicOpinionRow[] = [
  { year: '2000', publicOpinion: 8 },
  { year: '2001', publicOpinion: 9 },
  { year: '2002', publicOpinion: 11 },
  { year: '2003', publicOpinion: 8 },
  { year: '2004', publicOpinion: 12 },
  { year: '2005', publicOpinion: 10 },
  { year: '2006', publicOpinion: 15 },
  { year: '2007', publicOpinion: 22 },
  { year: '2008', publicOpinion: 16 },
  { year: '2009', publicOpinion: 14 },
  { year: '2010', publicOpinion: 11 },
  { year: '2011', publicOpinion: 9 },
  { year: '2012', publicOpinion: 2 },
  { year: '2013', publicOpinion: 4 },
  { year: '2014', publicOpinion: 10 },
  { year: '2015', publicOpinion: 28 },
  { year: '2016', publicOpinion: 42 },
  { year: '2017', publicOpinion: 36 },
  { year: '2018', publicOpinion: 28 },
  { year: '2019', publicOpinion: 22 },
  { year: '2020', publicOpinion: 12 },
  { year: '2021', publicOpinion: 9 },
  { year: '2022', publicOpinion: 14 },
  { year: '2023', publicOpinion: 17 },
  { year: '2024', publicOpinion: 12 },
  { year: '2025', publicOpinion: 12 },
];
export const ITALY_PUBLIC_OPINION_DESC =
  'Annual public-opinion percentage for Italy, 2000-2025.';

export const ITALY_CONTRIBUTION_ROWS: readonly ContributionRow[] = [
  {
    group: 'Native-born',
    paid: '€3,662',
    payerShare: '80%',
    overallPaid: '≈ €2,930',
    received: 'Not separately published',
    net: '−€1,672/year',
  },
  {
    group: 'Intra-EU migrants',
    paid: '€3,164',
    payerShare: '81%',
    overallPaid: '≈ €2,563',
    received: 'Not separately published',
    net: '+€580/year',
  },
  {
    group: 'Extra-EU migrants',
    paid: '€2,974',
    payerShare: '77%',
    overallPaid: '≈ €2,290',
    received: 'Not separately published',
    net: '+€767/year',
  },
];
export const ITALY_CONTRIBUTION_NOTES = {
  welfareUsage:
    'The pooled study measure subtracts cash transfers from personal taxes and social contributions. It does not claim that every migrant or native has the group average.',
  ageControlled:
    'The study reports that migrants\' younger age structure materially affects the balance; these displayed pooled means are not age-standardised.',
  rawView:
    'Pooled 2007-2018 annual means in real PPP-adjusted euros. Indirect taxes and in-kind services such as health care and education are excluded.',
  sourceLabel: 'European Commission / Boffi, Suari-Andreu & van Vliet (2024)',
  sourceHref: ITALY_FISCAL_STUDY_URL,
};

export const ITALY_WELFARE_TITLE =
  'Non-EU citizens receiving selected Italian social-security benefits';
export const ITALY_WELFARE_DESC =
  'Administrative beneficiary counts, mainly 2024. Programmes overlap, so rows must not be summed.';
export const ITALY_WELFARE_ROWS: readonly WelfareRow[] = [
  { nationality: 'NASpI unemployment insurance', recipients: '496,576', share: '18.0%', notes: '2024; contribution-based benefit' },
  { nationality: 'Agricultural unemployment', recipients: '128,714', share: '25.0%', notes: '2023, latest reported in the 2025 review' },
  { nationality: 'Ordinary wage supplementation (CIGO)', recipients: '116,241', share: '17.5%', notes: '2024' },
  { nationality: 'Assistance pensions', recipients: '155,350', share: 'Not reported nationally', notes: '2024; sum of official regional counts' },
  { nationality: 'Mandatory maternity benefit', recipients: '30,756', share: '11.0%', notes: '2024' },
  { nationality: 'Family allowance — employees', recipients: '3,776', share: '7.1%', notes: '2024; residual ANF programme' },
];
export const ITALY_WELFARE_NOTE =
  'Source: Ministry of Labour, XV Annual Report on Foreigners in the Italian Labour Market (2025), using INPS administrative data. "Share" is the non-EU share of all beneficiaries of that programme, not a share of all foreign recipients.';

export const ITALY_REFUGEE_ORIGINS_TITLE =
  'Refugees in Italy by country of origin (end-2025)';
export const ITALY_REFUGEE_BREAKDOWN: readonly OriginCountRow[] = [
  { country: 'Ukraine', count: 64_721 },
  { country: 'Nigeria', count: 18_068 },
  { country: 'Afghanistan', count: 15_532 },
  { country: 'Mali', count: 13_463 },
  { country: 'Pakistan', count: 13_137 },
  { country: 'Burkina Faso', count: 7_183 },
  { country: 'Somalia', count: 6_486 },
  { country: 'Iraq', count: 5_133 },
  { country: 'Venezuela', count: 4_496 },
  { country: 'El Salvador', count: 3_818 },
  { country: 'Syria', count: 2_871 },
  { country: "Cote d'Ivoire", count: 2_735 },
  { country: 'Bangladesh', count: 2_467 },
  { country: 'Turkiye', count: 2_184 },
  { country: 'Eritrea', count: 2_132 },
  { country: 'Cameroon', count: 2_019 },
  { country: 'Colombia', count: 1_536 },
  { country: 'Gambia', count: 1_493 },
  { country: 'Sudan', count: 1_392 },
  { country: 'Morocco', count: 1_228 },
  { country: 'Iran', count: 1_185 },
  { country: 'Guinea', count: 1_149 },
  { country: 'Senegal', count: 1_119 },
  { country: 'Egypt', count: 1_077 },
  { country: 'Palestinian', count: 1_061 },
];

export const ITALY_ASYLUM_BY_REGION: readonly RegionAsylumRow[] = [
  { year: '2008', middleEast: 3_380, african: 22_510, asianExclIndian: 3_210, indian: 210, other: 835, totalAsylumApplications: 30_145 },
  { year: '2009', middleEast: 2_000, african: 10_100, asianExclIndian: 2_695, indian: 75, other: 2_885, totalAsylumApplications: 17_755 },
  { year: '2010', middleEast: 2_595, african: 3_615, asianExclIndian: 1_430, indian: 45, other: 2_365, totalAsylumApplications: 10_050 },
  { year: '2011', middleEast: 3_415, african: 31_345, asianExclIndian: 4_570, indian: 35, other: 985, totalAsylumApplications: 40_350 },
  { year: '2012', middleEast: 3_055, african: 9_550, asianExclIndian: 3_450, indian: 65, other: 1_230, totalAsylumApplications: 17_350 },
  { year: '2013', middleEast: 4_410, african: 17_140, asianExclIndian: 4_020, indian: 30, other: 1_020, totalAsylumApplications: 26_620 },
  { year: '2014', middleEast: 5_510, african: 43_125, asianExclIndian: 12_110, indian: 80, other: 3_800, totalAsylumApplications: 64_625 },
  { year: '2015', middleEast: 5_740, african: 52_635, asianExclIndian: 17_175, indian: 250, other: 7_740, totalAsylumApplications: 83_540 },
  { year: '2016', middleEast: 6_435, african: 88_510, asianExclIndian: 21_815, indian: 535, other: 5_665, totalAsylumApplications: 122_960 },
  { year: '2017', middleEast: 5_085, african: 92_435, asianExclIndian: 23_795, indian: 510, other: 7_030, totalAsylumApplications: 128_855 },
  { year: '2018', middleEast: 2_940, african: 27_505, asianExclIndian: 16_665, indian: 930, other: 11_910, totalAsylumApplications: 59_950 },
  { year: '2019', middleEast: 2_620, african: 13_510, asianExclIndian: 13_885, indian: 1_070, other: 12_690, totalAsylumApplications: 43_775 },
  { year: '2020', middleEast: 1_640, african: 10_745, asianExclIndian: 9_160, indian: 215, other: 5_190, totalAsylumApplications: 26_950 },
  { year: '2021', middleEast: 6_545, african: 25_200, asianExclIndian: 16_205, indian: 155, other: 5_505, totalAsylumApplications: 53_610 },
  { year: '2022', middleEast: 4_865, african: 32_555, asianExclIndian: 31_000, indian: 545, other: 15_325, totalAsylumApplications: 84_290 },
  { year: '2023', middleEast: 4_700, african: 64_790, asianExclIndian: 46_080, indian: 1_800, other: 18_450, totalAsylumApplications: 135_820 },
  { year: '2024', middleEast: 5_650, african: 58_605, asianExclIndian: 57_370, indian: 4_885, other: 32_095, totalAsylumApplications: 158_605 },
  { year: '2025', middleEast: 5_955, african: 40_455, asianExclIndian: 52_480, indian: 7_315, other: 29_280, totalAsylumApplications: 135_485 },
];
export const ITALY_ASYLUM_SEEKERS_TOTAL = 1_240_735;
export const ITALY_ASYLUM_SEEKERS_MEN = 1_025_655;
export const ITALY_ASYLUM_SEEKERS_WOMEN = 213_470;

export const ITALY_ASYLUM_APPLICATIONS_2025: readonly AsylumApplicationRow[] = [
  { country: 'Bangladesh', applications: 28_365 },
  { country: 'Peru', applications: 15_655 },
  { country: 'Egypt', applications: 11_790 },
  { country: 'Pakistan', applications: 10_350 },
  { country: 'Morocco', applications: 9_485 },
  { country: 'India', applications: 7_315 },
  { country: 'Tunisia', applications: 6_290 },
  { country: 'Georgia', applications: 4_490 },
  { country: 'Sri Lanka', applications: 3_980 },
  { country: 'Nigeria', applications: 3_385 },
  { country: 'Other', applications: 34_380 },
];

export const ITALY_ADVOCATES: readonly AdvocateCard[] = [
  {
    id: 'asgi',
    title: 'ASGI',
    tagline: 'Association for Juridical Studies on Immigration',
    metaLabel: 'Founded',
    metaValue: '1990 - legal association',
    badges: ['Asylum law', 'Litigation', 'Borders', 'Rights'],
    overview:
      'A specialist network of lawyers and academics working on immigration, asylum, citizenship and anti-discrimination law.',
    leftistTies:
      'Its public advocacy generally supports stronger procedural safeguards and challenges restrictive migration measures through litigation and legal analysis.',
    affiliations:
      'Works with Italian and European rights organisations and participates in strategic cases before domestic and European courts.',
    impact:
      'A major technical source in litigation over detention, border procedures, safe-country rules and access to asylum.',
    sources: [{ label: 'asgi.it', href: 'https://www.asgi.it/' }],
  },
  {
    id: 'arci',
    title: 'ARCI',
    tagline: 'National social-promotion network',
    metaLabel: 'Founded',
    metaValue: '1957 - association',
    badges: ['Reception', 'Anti-racism', 'Integration', 'Civil society'],
    overview:
      'A large national association operating migrant help desks, reception and integration projects, and anti-racism campaigns.',
    leftistTies:
      'Historically rooted in Italy\'s democratic left and labour movement, while operating today as an autonomous social-promotion association.',
    affiliations:
      'Local clubs work with municipalities, unions, NGOs and EU-funded inclusion programmes.',
    impact:
      'Provides services nationally and is a recurring participant in debates over reception, citizenship and rescue at sea.',
    sources: [{ label: 'arci.it', href: 'https://www.arci.it/' }],
  },
  {
    id: 'mediterranea',
    title: 'Mediterranea Saving Humans',
    tagline: 'Civil sea-rescue platform',
    metaLabel: 'Founded',
    metaValue: '2018 - civil platform',
    badges: ['Sea rescue', 'Mediterranean', 'Advocacy', 'NGO'],
    overview:
      'Operates civil search-and-rescue missions in the central Mediterranean and campaigns for safe passage and lawful disembarkation.',
    leftistTies:
      'Built from activist, social-centre and progressive civil-society networks and openly contests deterrence-based border policy.',
    affiliations:
      'Coordinates volunteers, maritime professionals, associations and international rescue networks.',
    impact:
      'Its missions and court disputes make it a prominent actor in Italy\'s argument over NGO rescue ships and port access.',
    sources: [{ label: 'mediterranearescue.org', href: 'https://mediterranearescue.org/' }],
  },
  {
    id: 'emergency',
    title: 'EMERGENCY',
    tagline: 'Medical and humanitarian NGO',
    metaLabel: 'Founded',
    metaValue: '1994 - NGO',
    badges: ['Healthcare', 'SAR', 'Human rights', 'Clinics'],
    overview:
      'Provides free medical care to vulnerable people, including migrants, and operates search-and-rescue capacity in the central Mediterranean.',
    leftistTies:
      'Independent and non-partisan, with a public humanitarian and anti-war identity often aligned with rights-based criticism of restrictive migration policy.',
    affiliations:
      'Works through clinics, mobile units, volunteers and international humanitarian partnerships.',
    impact:
      'Combines direct health services with high-visibility reporting on access to care and Mediterranean rescue.',
    sources: [{ label: 'emergency.it', href: 'https://www.emergency.it/' }],
  },
  {
    id: 'centro-astalli',
    title: 'Centro Astalli',
    tagline: 'Jesuit Refugee Service in Italy',
    metaLabel: 'Network',
    metaValue: 'JRS Italy - faith-based NGO',
    badges: ['Refugees', 'Reception', 'Legal aid', 'Integration'],
    overview:
      'The Italian branch of Jesuit Refugee Service provides reception, legal support, education and integration services to asylum seekers and refugees.',
    leftistTies:
      'Faith-based rather than party-political; its advocacy emphasizes protection, legal pathways and social inclusion.',
    affiliations:
      'Part of the international Jesuit Refugee Service network and works with church, municipal and civil-society partners.',
    impact:
      'A longstanding national service provider and public voice on refugee reception and integration.',
    sources: [{ label: 'centroastalli.it', href: 'https://www.centroastalli.it/' }],
  },
];
export const ITALY_ADVOCATES_HEADING =
  'Major migration and refugee advocacy groups in Italy';
export const ITALY_ADVOCATES_INTRO =
  'Italian migration policy is shaped not only by government and EU institutions but also by legal associations, service providers, rescue organisations and faith-based networks. These cards identify prominent organisations and distinguish their documented work from political characterisation.';
export const ITALY_ADVOCATES_COALITION =
  'Coalition pattern: strategic litigation, reception and legal-aid delivery, anti-racism campaigns, and civil search-and-rescue. Funding and institutional relationships differ by organisation and project.';

export const ITALY_IMMIGRATION_SOURCE_URLS = {
  foreignBorn: EUROSTAT_FOREIGN_BORN_URL,
  arrivals: EUROSTAT_IMMIGRATION_URL,
  returns: EUROSTAT_RETURNS_URL,
  orders: EUROSTAT_ORDERS_URL,
  language: ISTAT_LANGUAGE_URL,
  housing: EUROSTAT_HOUSING_URL,
  housingCost: EUROSTAT_HOUSING_COST_URL,
  asylum: EUROSTAT_ASYLUM_URL,
  refugees: UNHCR_POPULATION_URL,
  welfare: ITALY_WELFARE_REPORT_URL,
} as const;
