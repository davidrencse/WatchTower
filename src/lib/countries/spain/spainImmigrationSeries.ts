type SpainMigrantArrivalsRow = {
  year: string;
  total: number;
  totalDisplay: string;
  europe: number;
  europeDisplay: string;
  nonEurope: number;
  nonEuropeDisplay: string;
  africa: number;
  africaDisplay: string;
};

const approximate = (value: number) => `~${value.toLocaleString('en-US')}`;

const row = (
  year: number,
  total: number,
  europe: number,
  nonEurope: number,
  africa: number,
): SpainMigrantArrivalsRow => ({
  year: String(year),
  total,
  totalDisplay: approximate(total),
  europe,
  europeDisplay: approximate(europe),
  nonEurope,
  nonEuropeDisplay: approximate(nonEurope),
  africa,
  africaDisplay: approximate(africa),
});

/** Rounded annual migrant-arrival estimates for Spain; tooltip labels preserve approximation markers. */
export const SPAIN_MIGRANT_ARRIVALS_SERIES: readonly SpainMigrantArrivalsRow[] = [
  row(2000, 850_000, 650_000, 210_000, 60_000),
  row(2001, 900_000, 690_000, 220_000, 65_000),
  row(2002, 860_000, 670_000, 215_000, 68_000),
  row(2003, 780_000, 610_000, 190_000, 62_000),
  row(2004, 790_000, 610_000, 195_000, 64_000),
  row(2005, 720_000, 570_000, 190_000, 62_000),
  row(2006, 690_000, 550_000, 188_000, 60_000),
  row(2007, 680_000, 545_000, 185_000, 59_000),
  row(2008, 700_000, 540_000, 200_000, 64_000),
  row(2009, 670_000, 525_000, 190_000, 65_000),
  row(2010, 650_000, 515_000, 185_000, 65_000),
  row(2011, 690_000, 535_000, 195_000, 70_000),
  row(2012, 720_000, 555_000, 220_000, 72_000),
  row(2013, 780_000, 580_000, 250_000, 75_000),
  row(2014, 950_000, 690_000, 300_000, 80_000),
  row(2015, 2_150_000, 1_120_000, 1_100_000, 110_000),
  row(2016, 1_950_000, 1_090_000, 850_000, 130_000),
  row(2017, 1_550_000, 850_000, 700_000, 120_000),
  row(2018, 1_420_000, 760_000, 650_000, 110_000),
  row(2019, 1_340_000, 710_000, 620_000, 105_000),
  row(2020, 1_020_000, 590_000, 500_000, 70_000),
  row(2021, 1_220_000, 680_000, 600_000, 90_000),
  row(2022, 2_750_000, 2_000_000, 690_000, 120_000),
  row(2023, 1_950_000, 1_320_000, 650_000, 125_000),
  row(2024, 1_750_000, 1_180_000, 580_000, 115_000),
  row(2025, 1_520_000, 1_020_000, 530_000, 110_000),
];

/** Annual asylum applications in Spain, split by applicant sex. */
export const SPAIN_ASYLUM_APPLICATIONS_BY_GENDER = [
  { year: '2000', totalAsylumApplications: 7_926, men: 5_150, women: 2_776 },
  { year: '2001', totalAsylumApplications: 9_490, men: 6_169, women: 3_321 },
  { year: '2002', totalAsylumApplications: 6_309, men: 4_101, women: 2_208 },
  { year: '2003', totalAsylumApplications: 5_918, men: 3_847, women: 2_071 },
  { year: '2004', totalAsylumApplications: 5_401, men: 3_511, women: 1_890 },
  { year: '2005', totalAsylumApplications: 5_257, men: 3_417, women: 1_840 },
  { year: '2006', totalAsylumApplications: 5_297, men: 3_443, women: 1_854 },
  { year: '2007', totalAsylumApplications: 7_664, men: 4_982, women: 2_682 },
  { year: '2008', totalAsylumApplications: 4_517, men: 2_936, women: 1_581 },
  { year: '2009', totalAsylumApplications: 3_007, men: 1_955, women: 1_052 },
  { year: '2010', totalAsylumApplications: 2_744, men: 1_784, women: 960 },
  { year: '2011', totalAsylumApplications: 3_422, men: 2_224, women: 1_198 },
  { year: '2012', totalAsylumApplications: 2_588, men: 1_682, women: 906 },
  { year: '2013', totalAsylumApplications: 4_502, men: 2_926, women: 1_576 },
  { year: '2014', totalAsylumApplications: 5_947, men: 3_866, women: 2_081 },
  { year: '2015', totalAsylumApplications: 14_881, men: 9_673, women: 5_208 },
  { year: '2016', totalAsylumApplications: 16_544, men: 10_754, women: 5_790 },
  { year: '2017', totalAsylumApplications: 31_120, men: 20_228, women: 10_892 },
  { year: '2018', totalAsylumApplications: 55_749, men: 36_237, women: 19_512 },
  { year: '2019', totalAsylumApplications: 118_264, men: 76_872, women: 41_392 },
  { year: '2020', totalAsylumApplications: 88_762, men: 57_695, women: 31_067 },
  { year: '2021', totalAsylumApplications: 65_482, men: 42_563, women: 22_919 },
  { year: '2022', totalAsylumApplications: 118_842, men: 77_247, women: 41_595 },
  { year: '2023', totalAsylumApplications: 163_220, men: 106_093, women: 57_127 },
  { year: '2024', totalAsylumApplications: 167_366, men: 108_788, women: 58_578 },
  { year: '2025', totalAsylumApplications: 144_396, men: 93_857, women: 50_539 },
] as const;

export const SPAIN_ASYLUM_STACK_KEYS = ['men', 'women'] as const;

export const SPAIN_ASYLUM_TREND_CHART_CONFIG = {
  men: { label: 'Men', color: '#38bdf8' },
  women: { label: 'Women', color: '#c084fc' },
  totalAsylumApplications: { label: 'Total asylum applications', color: '#e2e8f0' },
} as const;

export const SPAIN_ASYLUM_CUMULATIVE_SUMMARY = {
  total: 1_320_000,
  men: 780_000,
  women: 540_000,
} as const;

/** Official provisional year-end applicant counts by nationality, Spain 2025. */
export const SPAIN_ASYLUM_APPLICATIONS_BY_ORIGIN_2025 = [
  { country: 'Venezuela', applications: 85_413 },
  { country: 'Mali', applications: 16_004 },
  { country: 'Colombia', applications: 14_524 },
  { country: 'Peru', applications: 3_511 },
  { country: 'Senegal', applications: 3_333 },
  { country: 'Other countries', applications: 21_611 },
] as const;

export const SPAIN_ASYLUM_APPLICATIONS_2025_SOURCE_URL =
  'https://www.lamoncloa.gob.es/serviciosdeprensa/notasprensa/interior/Paginas/2026/160126-balance-oficina-asilo-2025.aspx';

const SPAIN_DEPORTATION_TREND_VALUES = [
  [2000, 35_200, 275],
  [2001, 70_000, 250],
  [2002, 101_000, 225],
  [2003, 130_000, 205],
  [2004, 158_000, 180],
  [2005, 185_000, 155],
  [2006, 210_000, 148],
  [2007, 235_000, 138],
  [2008, 260_000, 128],
  [2009, 280_000, 118],
  [2010, 298_000, 110],
  [2011, 315_000, 98],
  [2012, 330_000, 88],
  [2013, 345_000, 75],
  [2014, 358_000, 70],
  [2015, 385_000, 120],
  [2016, 415_000, 135],
  [2017, 445_000, 118],
  [2018, 475_000, 115],
  [2019, 500_000, 105],
  [2020, 515_000, 49],
  [2021, 525_000, 55],
  [2022, 535_000, 57],
  [2023, 550_000, 68],
  [2024, 570_000, 78],
  [2025, 595_000, 88],
] as const;

/** Spain deportation totals and rates supplied for the 2000–2025 country-page trend. */
export const SPAIN_DEPORTATION_TREND_SERIES = SPAIN_DEPORTATION_TREND_VALUES.map(
  ([year, cumulativeDeported, deportationRate], index, values) => {
    const previousCumulative = index === 0 ? 0 : values[index - 1][1];
    const yearlyDeported = cumulativeDeported - previousCumulative;

    return {
      year: String(year),
      yearlyDeported,
      yearlyDeportedDisplay: yearlyDeported.toLocaleString('en-US'),
      cumulativeDeported,
      cumulativeDeportedDisplay: cumulativeDeported.toLocaleString('en-US'),
      deportationRate,
      deportationRateDisplay: deportationRate.toLocaleString('en-US'),
    };
  },
);

/** Deported immigrants who returned to Spain, with the annual share of deportees who returned. */
export const SPAIN_DEPORTATION_REENTRY_SERIES = [
  { year: '2000', returnedCount: 420, returnPct: 12.4 },
  { year: '2001', returnedCount: 390, returnPct: 12.4 },
  { year: '2002', returnedCount: 370, returnPct: 12.5 },
  { year: '2003', returnedCount: 340, returnPct: 12.3 },
  { year: '2004', returnedCount: 320, returnPct: 12.3 },
  { year: '2005', returnedCount: 300, returnPct: 12.7 },
  { year: '2006', returnedCount: 270, returnPct: 12.4 },
  { year: '2007', returnedCount: 250, returnPct: 12.2 },
  { year: '2008', returnedCount: 230, returnPct: 12.0 },
  { year: '2009', returnedCount: 210, returnPct: 11.6 },
  { year: '2010', returnedCount: 190, returnPct: 12.0 },
  { year: '2011', returnedCount: 180, returnPct: 12.2 },
  { year: '2012', returnedCount: 170, returnPct: 12.6 },
  { year: '2013', returnedCount: 160, returnPct: 13.1 },
  { year: '2014', returnedCount: 150, returnPct: 13.6 },
  { year: '2015', returnedCount: 450, returnPct: 3.0 },
  { year: '2016', returnedCount: 650, returnPct: 4.0 },
  { year: '2017', returnedCount: 1_050, returnPct: 4.8 },
  { year: '2018', returnedCount: 1_200, returnPct: 5.2 },
  { year: '2019', returnedCount: 1_250, returnPct: 5.6 },
  { year: '2020', returnedCount: 1_600, returnPct: 12.0 },
  { year: '2021', returnedCount: 2_100, returnPct: 14.5 },
  { year: '2022', returnedCount: 2_850, returnPct: 21.5 },
  { year: '2023', returnedCount: 2_650, returnPct: 15.8 },
  { year: '2024', returnedCount: 2_900, returnPct: 14.5 },
  { year: '2025', returnedCount: 3_150, returnPct: 14.0 },
] as const;

/** Spanish-language proficiency after five years, by immigrant origin group (2025). */
export const SPAIN_LANGUAGE_INTEGRATION_2025 = [
  { origin: 'Moroccan', b1PlusRate: 48 },
  { origin: 'Other North African', b1PlusRate: 51 },
  { origin: 'Colombian', b1PlusRate: 91 },
  { origin: 'Venezuelan', b1PlusRate: 92 },
  { origin: 'Ecuadorian', b1PlusRate: 93 },
  { origin: 'Romanian', b1PlusRate: 76 },
  { origin: 'Ukrainian', b1PlusRate: 67 },
  { origin: 'Chinese', b1PlusRate: 59 },
  { origin: 'Pakistani', b1PlusRate: 45 },
  { origin: 'Senegalese', b1PlusRate: 52 },
] as const;

/** User-supplied long-run usage shares for recent immigrants in Spain. */
export const SPAIN_HEALTHCARE_SOCIAL_HOUSING_USAGE = [
  { year: '2000', healthcareShare: 8.0, socialHousingShare: 12.0 },
  { year: '2001', healthcareShare: 8.4, socialHousingShare: 12.7 },
  { year: '2002', healthcareShare: 8.8, socialHousingShare: 13.3 },
  { year: '2003', healthcareShare: 9.2, socialHousingShare: 14.0 },
  { year: '2004', healthcareShare: 9.7, socialHousingShare: 14.7 },
  { year: '2005', healthcareShare: 10.2, socialHousingShare: 15.5 },
  { year: '2006', healthcareShare: 10.8, socialHousingShare: 16.4 },
  { year: '2007', healthcareShare: 11.5, socialHousingShare: 17.3 },
  { year: '2008', healthcareShare: 12.2, socialHousingShare: 18.2 },
  { year: '2009', healthcareShare: 12.9, socialHousingShare: 19.0 },
  { year: '2010', healthcareShare: 13.5, socialHousingShare: 19.8 },
  { year: '2011', healthcareShare: 14.1, socialHousingShare: 20.5 },
  { year: '2012', healthcareShare: 14.7, socialHousingShare: 21.2 },
  { year: '2013', healthcareShare: 15.4, socialHousingShare: 22.0 },
  { year: '2014', healthcareShare: 16.2, socialHousingShare: 23.0 },
  { year: '2015', healthcareShare: 21.5, socialHousingShare: 29.5 },
  { year: '2016', healthcareShare: 26.8, socialHousingShare: 34.5 },
  { year: '2017', healthcareShare: 28.5, socialHousingShare: 36.8 },
  { year: '2018', healthcareShare: 28.8, socialHousingShare: 37.5 },
  { year: '2019', healthcareShare: 29.1, socialHousingShare: 38.0 },
  { year: '2020', healthcareShare: 29.7, socialHousingShare: 39.2 },
  { year: '2021', healthcareShare: 30.3, socialHousingShare: 40.5 },
  { year: '2022', healthcareShare: 30.8, socialHousingShare: 41.5 },
  { year: '2023', healthcareShare: 31.0, socialHousingShare: 42.0 },
  { year: '2024', healthcareShare: 31.0, socialHousingShare: 42.0 },
  { year: '2025', healthcareShare: 31.0, socialHousingShare: 42.0 },
] as const;

/** Dashboard estimates supplied for Spain; these are not an official fiscal dataset. */
export const SPAIN_CONTRIBUTION_ROWS = [
  { group: 'Spanish nationals', paid: '€10,300', received: '€8,900', net: '+€1,400' },
  { group: 'Foreign-born / immigrants', paid: '€8,100', received: '€6,900', net: '+€1,200' },
  { group: '2nd-generation immigrants', paid: '€9,700', received: '€7,900', net: '+€1,800' },
] as const;

export const SPAIN_CONTRIBUTION_NOTES = {
  welfareUsage:
    'Dashboard estimates only. Spain does not publish an exactly equivalent three-group table of taxes, social contributions, transfers and net fiscal contribution.',
  ageControlled:
    'These illustrative euro amounts are not age-standardised. Differences in age, employment and household structure can materially change comparisons between groups.',
  rawView:
    'Do not quote these values as official Spanish statistics. They are supplied dashboard estimates rather than an INE, AEAT or Social Security dataset.',
  sourceLabel: 'Dashboard estimates; contextual Spanish fiscal-contribution research from UPCT',
  sourceHref:
    'https://www.upct.es/noticias/2023-03-03-los-inmigrantes-aportan-al-estado-un-70-mas-de-lo-que-perciben-y-un-30-mas-que-los-nacidos-en-espantildea',
} as const;

/**
 * The 17.6% foreign-nationality anchor is official. The nationality splits and
 * approximately 138,000 foreign-holder total are supplied dashboard estimates.
 */
export const SPAIN_IMV_WELFARE_ROWS = [
  { nationality: 'All foreigners', recipients: '≈138,000', share: '100%', notes: '2025 dashboard estimate' },
  { nationality: 'Moroccans', recipients: '≈42,000', share: '30.4%', notes: 'Estimated nationality split' },
  { nationality: 'Romanians', recipients: '≈13,000', share: '9.4%', notes: 'Estimated nationality split' },
  { nationality: 'Colombians', recipients: '≈12,000', share: '8.7%', notes: 'Estimated nationality split' },
  { nationality: 'Venezuelans', recipients: '≈10,000', share: '7.2%', notes: 'Estimated nationality split' },
  { nationality: 'Ukrainians', recipients: '≈8,000', share: '5.8%', notes: 'Estimated nationality split' },
  { nationality: 'Others', recipients: '≈53,000', share: '38.4%', notes: 'Estimated remainder' },
] as const;

export const SPAIN_IMV_SOURCE_URL =
  'https://www.inclusion.gob.es/en/w/el-ingreso-minimo-vital-protege-a-mas-de-850.000-menores-en-enero-el-41-5-de-los-beneficiarios';

/** Approximate dashboard total for Spain's work visas / work-related residence permits. */
export const SPAIN_WORK_RELATED_RESIDENCE_PERMITS = 1_050_000;

export const SPAIN_WORK_RELATED_RESIDENCE_NOTE =
  'Spain — approximately 1.05 million work visas / work-related residence permits, cumulative 2021–2025 estimate.';

/** Residents born outside Spain at 1 January 2025 (INE Annual Population Census). */
export const SPAIN_MIGRANT_BACKGROUND_2025 = 9_464_210;

export const SPAIN_MIGRANT_BACKGROUND_NOTE =
  'Spain — 9,464,210 foreign-born residents at 1 January 2025. Official INE Annual Population Census; this measure is country of birth, not a broader ancestry category.';

export const SPAIN_FOREIGN_BORN_POPULATION_SERIES = [
  { year: '2025', migrants: SPAIN_MIGRANT_BACKGROUND_2025 },
] as const;

/** CIS Barometer 3517, July 2025: spontaneous first answer naming immigration as Spain's main problem. */
export const SPAIN_PUBLIC_OPINION_IMMIGRATION_2025 = [
  { year: 'Jul 2025', publicOpinion: 4.0 },
] as const;
