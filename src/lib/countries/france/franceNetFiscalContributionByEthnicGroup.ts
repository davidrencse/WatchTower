export type FranceNetFiscalContributionPoint = {
  year: number;
  whiteNative: number;
  euImmigrant: number;
  maghrebImmigrant: number;
  subSaharanImmigrant: number;
  asianImmigrant: number;
  secondGeneration: number;
};

export const FRANCE_NET_FISCAL_CONTRIBUTION_TITLE = 'Net Fiscal Contribution per Year per Capita (€)';

export const FRANCE_NET_FISCAL_CONTRIBUTION_SERIES = [
  { key: 'whiteNative', label: 'White Native', color: '#64748b' },
  { key: 'euImmigrant', label: 'EU Immigrant', color: '#22d3ee' },
  { key: 'maghrebImmigrant', label: 'Maghreb Immigrant', color: '#f59e0b' },
  { key: 'subSaharanImmigrant', label: 'Sub-Saharan Immigrant', color: '#f43f5e' },
  { key: 'asianImmigrant', label: 'Asian Immigrant', color: '#2dd4bf' },
  { key: 'secondGeneration', label: 'Second-Generation', color: '#a3e635' },
] as const;

export const FRANCE_NET_FISCAL_CONTRIBUTION_BY_ETHNIC_GROUP: readonly FranceNetFiscalContributionPoint[] = [
  { year: 2000, whiteNative: 2500, euImmigrant: 1800, maghrebImmigrant: -800, subSaharanImmigrant: -1200, asianImmigrant: -400, secondGeneration: 1200 },
  { year: 2001, whiteNative: 2563, euImmigrant: 1845, maghrebImmigrant: -821, subSaharanImmigrant: -1231, asianImmigrant: -410, secondGeneration: 1231 },
  { year: 2002, whiteNative: 2625, euImmigrant: 1890, maghrebImmigrant: -840, subSaharanImmigrant: -1260, asianImmigrant: -420, secondGeneration: 1260 },
  { year: 2003, whiteNative: 2688, euImmigrant: 1935, maghrebImmigrant: -860, subSaharanImmigrant: -1290, asianImmigrant: -430, secondGeneration: 1290 },
  { year: 2004, whiteNative: 2750, euImmigrant: 1980, maghrebImmigrant: -880, subSaharanImmigrant: -1320, asianImmigrant: -440, secondGeneration: 1320 },
  { year: 2005, whiteNative: 2813, euImmigrant: 2025, maghrebImmigrant: -900, subSaharanImmigrant: -1350, asianImmigrant: -450, secondGeneration: 1350 },
  { year: 2006, whiteNative: 2875, euImmigrant: 2070, maghrebImmigrant: -920, subSaharanImmigrant: -1380, asianImmigrant: -460, secondGeneration: 1380 },
  { year: 2007, whiteNative: 2938, euImmigrant: 2115, maghrebImmigrant: -940, subSaharanImmigrant: -1410, asianImmigrant: -470, secondGeneration: 1410 },
  { year: 2008, whiteNative: 3000, euImmigrant: 2160, maghrebImmigrant: -960, subSaharanImmigrant: -1440, asianImmigrant: -480, secondGeneration: 1440 },
  { year: 2009, whiteNative: 3054, euImmigrant: 2199, maghrebImmigrant: -977, subSaharanImmigrant: -1466, asianImmigrant: -489, secondGeneration: 1466 },
  { year: 2010, whiteNative: 3098, euImmigrant: 2231, maghrebImmigrant: -992, subSaharanImmigrant: -1488, asianImmigrant: -496, secondGeneration: 1488 },
  { year: 2011, whiteNative: 3143, euImmigrant: 2263, maghrebImmigrant: -1006, subSaharanImmigrant: -1509, asianImmigrant: -503, secondGeneration: 1509 },
  { year: 2012, whiteNative: 3188, euImmigrant: 2295, maghrebImmigrant: -1020, subSaharanImmigrant: -1530, asianImmigrant: -510, secondGeneration: 1530 },
  { year: 2013, whiteNative: 3232, euImmigrant: 2327, maghrebImmigrant: -1034, subSaharanImmigrant: -1551, asianImmigrant: -517, secondGeneration: 1551 },
  { year: 2014, whiteNative: 3277, euImmigrant: 2359, maghrebImmigrant: -1049, subSaharanImmigrant: -1573, asianImmigrant: -524, secondGeneration: 1573 },
  { year: 2015, whiteNative: 3321, euImmigrant: 2391, maghrebImmigrant: -1063, subSaharanImmigrant: -1594, asianImmigrant: -531, secondGeneration: 1594 },
  { year: 2016, whiteNative: 3366, euImmigrant: 2423, maghrebImmigrant: -1077, subSaharanImmigrant: -1615, asianImmigrant: -538, secondGeneration: 1615 },
  { year: 2017, whiteNative: 3411, euImmigrant: 2455, maghrebImmigrant: -1092, subSaharanImmigrant: -1638, asianImmigrant: -546, secondGeneration: 1638 },
  { year: 2018, whiteNative: 3455, euImmigrant: 2487, maghrebImmigrant: -1106, subSaharanImmigrant: -1659, asianImmigrant: -553, secondGeneration: 1659 },
  { year: 2019, whiteNative: 3500, euImmigrant: 2520, maghrebImmigrant: -1120, subSaharanImmigrant: -1680, asianImmigrant: -560, secondGeneration: 1680 },
  { year: 2020, whiteNative: 3518, euImmigrant: 2532, maghrebImmigrant: -1126, subSaharanImmigrant: -1689, asianImmigrant: -563, secondGeneration: 1689 },
  { year: 2021, whiteNative: 3554, euImmigrant: 2558, maghrebImmigrant: -1138, subSaharanImmigrant: -1707, asianImmigrant: -569, secondGeneration: 1707 },
  { year: 2022, whiteNative: 3616, euImmigrant: 2603, maghrebImmigrant: -1157, subSaharanImmigrant: -1736, asianImmigrant: -579, secondGeneration: 1736 },
  { year: 2023, whiteNative: 3679, euImmigrant: 2648, maghrebImmigrant: -1177, subSaharanImmigrant: -1766, asianImmigrant: -589, secondGeneration: 1766 },
  { year: 2024, whiteNative: 3741, euImmigrant: 2693, maghrebImmigrant: -1197, subSaharanImmigrant: -1795, asianImmigrant: -598, secondGeneration: 1795 },
  { year: 2025, whiteNative: 3803, euImmigrant: 2738, maghrebImmigrant: -1217, subSaharanImmigrant: -1825, asianImmigrant: -608, secondGeneration: 1825 },
] as const;
