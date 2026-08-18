export type SpainNetFiscalContributionPoint = {
  year: number;
  spanishBorn: number;
  euImmigrant: number;
  nonEuEuropeImmigrant: number;
  latinAmericanImmigrant: number;
  africanImmigrant: number;
  asianOtherImmigrant: number;
};

export const SPAIN_NET_FISCAL_CONTRIBUTION_TITLE =
  'Net Fiscal Contribution per Year per Capita (€) by Origin — modeled';

/**
 * The one thing this chart must say out loud: Spain does not publish it. The note is
 * rendered above the chart, and `showDataTable` is switched on for this country so a
 * reader can read the exact modeled numbers rather than eyeball them off a line.
 */
export const SPAIN_NET_FISCAL_CONTRIBUTION_NOTE =
  'Modeled estimate — Spain publishes no net fiscal balance by country of origin. The AEAT holds ' +
  'the tax microdata that would settle it, but no per-origin series is released, and academic work ' +
  'notes the public data lacks the detail to replicate the Northern-European studies. This series is ' +
  'therefore constructed, anchored on the one Spanish ratio study of the right shape (Universidad ' +
  'Politécnica de Cartagena, 2023: in the Region of Murcia immigrants returned €1.72 of public revenue ' +
  'per €1 of benefits received, against €1.32 for the Spanish-born) and on the direction of the wider ' +
  'literature, in which the balance tracks employment rate and education far more than origin. Treat ' +
  'the ordering as indicative and the levels as illustrative; do not quote these as Spanish statistics.';

export const SPAIN_NET_FISCAL_CONTRIBUTION_SOURCE_LABEL =
  'UPCT (2023) — fiscal contribution of immigrants, Region of Murcia';

export const SPAIN_NET_FISCAL_CONTRIBUTION_SOURCE_URL =
  'https://www.upct.es/noticias/2023-03-03-los-inmigrantes-aportan-al-estado-un-70-mas-de-lo-que-perciben-y-un-30-mas-que-los-nacidos-en-espantildea';

export const SPAIN_NET_FISCAL_CONTRIBUTION_SERIES = [
  { key: 'spanishBorn', label: 'Spanish-born', color: '#64748b' },
  { key: 'euImmigrant', label: 'EU27 immigrant', color: '#22d3ee' },
  { key: 'nonEuEuropeImmigrant', label: 'Non-EU European immigrant', color: '#a3e635' },
  { key: 'latinAmericanImmigrant', label: 'Latin American immigrant', color: '#f59e0b' },
  { key: 'africanImmigrant', label: 'African immigrant', color: '#f43f5e' },
  { key: 'asianOtherImmigrant', label: 'Asian & other immigrant', color: '#2dd4bf' },
] as const;

export const SPAIN_NET_FISCAL_CONTRIBUTION_BY_ORIGIN: readonly SpainNetFiscalContributionPoint[] = [
  { year: 2008, spanishBorn: 2100, euImmigrant: 2600, nonEuEuropeImmigrant: 2400, latinAmericanImmigrant: 1900, africanImmigrant: 500, asianOtherImmigrant: 2000 },
  { year: 2010, spanishBorn: 1500, euImmigrant: 1900, nonEuEuropeImmigrant: 1600, latinAmericanImmigrant: 1100, africanImmigrant: -300, asianOtherImmigrant: 1400 },
  { year: 2012, spanishBorn: 1200, euImmigrant: 1500, nonEuEuropeImmigrant: 1200, latinAmericanImmigrant: 700, africanImmigrant: -700, asianOtherImmigrant: 1100 },
  { year: 2014, spanishBorn: 1600, euImmigrant: 1900, nonEuEuropeImmigrant: 1600, latinAmericanImmigrant: 1100, africanImmigrant: -400, asianOtherImmigrant: 1500 },
  { year: 2016, spanishBorn: 2000, euImmigrant: 2400, nonEuEuropeImmigrant: 2100, latinAmericanImmigrant: 1500, africanImmigrant: 0, asianOtherImmigrant: 1900 },
  { year: 2018, spanishBorn: 2400, euImmigrant: 2900, nonEuEuropeImmigrant: 2600, latinAmericanImmigrant: 1900, africanImmigrant: 400, asianOtherImmigrant: 2300 },
  { year: 2019, spanishBorn: 2600, euImmigrant: 3100, nonEuEuropeImmigrant: 2800, latinAmericanImmigrant: 2100, africanImmigrant: 600, asianOtherImmigrant: 2500 },
  { year: 2020, spanishBorn: 1900, euImmigrant: 2300, nonEuEuropeImmigrant: 2000, latinAmericanImmigrant: 1300, africanImmigrant: -200, asianOtherImmigrant: 1700 },
  { year: 2021, spanishBorn: 2400, euImmigrant: 2900, nonEuEuropeImmigrant: 2600, latinAmericanImmigrant: 1900, africanImmigrant: 400, asianOtherImmigrant: 2300 },
  { year: 2022, spanishBorn: 2900, euImmigrant: 3400, nonEuEuropeImmigrant: 3100, latinAmericanImmigrant: 2400, africanImmigrant: 900, asianOtherImmigrant: 2700 },
  { year: 2023, spanishBorn: 3100, euImmigrant: 3700, nonEuEuropeImmigrant: 3400, latinAmericanImmigrant: 2700, africanImmigrant: 1100, asianOtherImmigrant: 2900 },
  { year: 2024, spanishBorn: 3400, euImmigrant: 3900, nonEuEuropeImmigrant: 3600, latinAmericanImmigrant: 2900, africanImmigrant: 1400, asianOtherImmigrant: 3100 },
  { year: 2025, spanishBorn: 3600, euImmigrant: 4100, nonEuEuropeImmigrant: 3800, latinAmericanImmigrant: 3100, africanImmigrant: 1600, asianOtherImmigrant: 3300 },
] as const;
