export type SpainGovernmentExpenditureCategoryRow = {
  year: string;
  publicServices: number;
  defence: number;
  publicOrder: number;
  economicAffairs: number;
  environment: number;
  housing: number;
  health: number;
  cultureRecreation: number;
  education: number;
  socialProtection: number;
  total: number;
};

export type SpainGovernmentExpenditureCategoryKey = Exclude<
  keyof SpainGovernmentExpenditureCategoryRow,
  'year' | 'total'
>;

/**
 * Spain - general government (S13) expenditure by COFOG function, EUR billions, current
 * prices. Source: Eurostat `gov_10a_exp` (na_item TE, sector S13, cofog99 GF01-GF10),
 * pulled from the Eurostat dissemination API on 10 Aug 2026.
 *
 * 2000-2024 are published figures (2024 provisional). **2025 is an estimate** - Eurostat
 * has not released COFOG for 2025. It is built by holding the two 2025 figures Eurostat
 * *has* published in `gov_10a_main` (total expenditure EUR 764.884bn, interest EUR
 * 40.314bn), growing GF10 by 6.2% for the 2025 pension revaluation and pensioner volume,
 * and distributing the remainder across the other functions in proportion to their 2024
 * shares. The UI description flags 2025 as provisional.
 *
 * `publicServices` (GF01) includes public-debt interest, matching the COFOG definition;
 * the category cards break interest out separately.
 */
export const SPAIN_GOVERNMENT_EXPENDITURE_BY_CATEGORY: readonly SpainGovernmentExpenditureCategoryRow[] = [
  { year: '2000', publicServices: 40.131, defence: 7.141, publicOrder: 10.996, economicAffairs: 32.128, environment: 4.706, housing: 7.552, health: 33.324, cultureRecreation: 8.655, education: 26.387, socialProtection: 82.247, total: 253.267 },
  { year: '2001', publicServices: 42.66, defence: 7.459, publicOrder: 12.837, economicAffairs: 33.225, environment: 6.137, housing: 7.074, health: 35.37, cultureRecreation: 9.071, education: 27.964, socialProtection: 87.398, total: 269.195 },
  { year: '2002', publicServices: 43.444, defence: 8.139, publicOrder: 13.467, economicAffairs: 36.52, environment: 7.12, housing: 7.782, health: 38.354, cultureRecreation: 9.812, education: 30.285, socialProtection: 94.604, total: 289.527 },
  { year: '2003', publicServices: 44.788, defence: 8.335, publicOrder: 14.396, economicAffairs: 37.446, environment: 7.795, housing: 8.455, health: 41.512, cultureRecreation: 10.832, education: 32.276, socialProtection: 101.961, total: 307.796 },
  { year: '2004', publicServices: 44.262, defence: 9.23, publicOrder: 15.376, economicAffairs: 46.64, environment: 7.807, housing: 6.855, health: 46.914, cultureRecreation: 11.679, education: 35.087, socialProtection: 109.816, total: 333.666 },
  { year: '2005', publicServices: 47.352, defence: 9.975, publicOrder: 16.34, economicAffairs: 46.852, environment: 8.42, housing: 7.943, health: 52.462, cultureRecreation: 12.768, education: 36.725, socialProtection: 117.948, total: 356.785 },
  { year: '2006', publicServices: 50.749, defence: 10.255, publicOrder: 17.977, economicAffairs: 50.429, environment: 9.873, housing: 7.803, health: 56.708, cultureRecreation: 14.851, education: 39.812, socialProtection: 127.3, total: 385.757 },
  { year: '2007', publicServices: 53.37, defence: 10.817, publicOrder: 20.064, economicAffairs: 57.643, environment: 10.815, housing: 9.876, health: 61.27, cultureRecreation: 16.878, education: 43.316, socialProtection: 138.115, total: 422.164 },
  { year: '2008', publicServices: 57.242, defence: 11.243, publicOrder: 21.73, economicAffairs: 61.229, environment: 10.923, housing: 11.867, health: 67.347, cultureRecreation: 18.06, education: 47.026, socialProtection: 153.146, total: 459.813 },
  { year: '2009', publicServices: 60.954, defence: 10.946, publicOrder: 21.954, economicAffairs: 62.069, environment: 11.56, housing: 13.963, health: 72.993, cultureRecreation: 17.502, education: 49.666, socialProtection: 172.746, total: 494.353 },
  { year: '2010', publicServices: 60.442, defence: 11.283, publicOrder: 23.166, economicAffairs: 62.801, environment: 11.507, housing: 7.546, health: 71.145, cultureRecreation: 17.704, education: 48.493, socialProtection: 179.73, total: 493.817 },
  { year: '2011', publicServices: 66.717, defence: 11.155, publicOrder: 23.017, economicAffairs: 60.329, environment: 10.366, housing: 6.048, health: 69.312, cultureRecreation: 16.05, education: 47.12, socialProtection: 180.794, total: 490.908 },
  { year: '2012', publicServices: 69.044, defence: 9.698, publicOrder: 21.024, economicAffairs: 90.461, environment: 9.586, housing: 5.843, health: 64.721, cultureRecreation: 12.504, education: 43.291, socialProtection: 183.764, total: 509.936 },
  { year: '2013', publicServices: 75.491, defence: 9.878, publicOrder: 20.87, economicAffairs: 51.114, environment: 8.844, housing: 4.703, health: 63.338, cultureRecreation: 11.681, education: 42.106, socialProtection: 185.373, total: 473.398 },
  { year: '2014', publicServices: 73.703, defence: 8.95, publicOrder: 20.688, economicAffairs: 46.873, environment: 9.265, housing: 5.166, health: 63.499, cultureRecreation: 11.799, education: 42.556, socialProtection: 185.342, total: 467.841 },
  { year: '2015', publicServices: 70.356, defence: 10.416, publicOrder: 21.772, economicAffairs: 48.799, environment: 9.495, housing: 5.55, health: 66.484, cultureRecreation: 12.445, education: 44.39, socialProtection: 185.186, total: 474.893 },
  { year: '2016', publicServices: 68.317, defence: 10.889, publicOrder: 21.215, economicAffairs: 43.174, environment: 9.492, housing: 4.876, health: 67.713, cultureRecreation: 12.334, education: 45.328, socialProtection: 189.379, total: 472.717 },
  { year: '2017', publicServices: 64.641, defence: 10.373, publicOrder: 21.262, economicAffairs: 46.256, environment: 9.924, housing: 5.031, health: 69.298, cultureRecreation: 12.811, education: 46.442, socialProtection: 193.87, total: 479.908 },
  { year: '2018', publicServices: 67.52, defence: 10.287, publicOrder: 21.542, economicAffairs: 51.532, environment: 10.258, housing: 5.13, health: 72.146, cultureRecreation: 13.544, education: 47.764, socialProtection: 203.47, total: 503.193 },
  { year: '2019', publicServices: 67.671, defence: 10.537, publicOrder: 22.685, economicAffairs: 52.761, environment: 10.803, housing: 5.19, health: 75.917, cultureRecreation: 14.42, education: 50.052, socialProtection: 216.733, total: 526.769 },
  { year: '2020', publicServices: 66.059, defence: 10.549, publicOrder: 23.458, economicAffairs: 65.789, environment: 10.785, housing: 5.149, health: 85.545, cultureRecreation: 13.382, education: 52.003, socialProtection: 247.445, total: 580.164 },
  { year: '2021', publicServices: 70.976, defence: 11.716, publicOrder: 24.54, economicAffairs: 78.943, environment: 11.465, housing: 5.78, health: 88.541, cultureRecreation: 14.607, education: 55.885, socialProtection: 248.671, total: 611.124 },
  { year: '2022', publicServices: 77.818, defence: 15.347, publicOrder: 25.798, economicAffairs: 77.131, environment: 13.335, housing: 6.461, health: 93.327, cultureRecreation: 17.12, education: 58.669, socialProtection: 252.111, total: 637.117 },
  { year: '2023', publicServices: 84.425, defence: 14.008, publicOrder: 27.414, economicAffairs: 74.851, environment: 14.579, housing: 7.821, health: 98.63, cultureRecreation: 18.638, education: 62.532, socialProtection: 277.327, total: 680.225 },
  { year: '2024', publicServices: 92.551, defence: 14.233, publicOrder: 28.628, economicAffairs: 80.908, environment: 15.539, housing: 7.613, health: 102.942, cultureRecreation: 19.193, education: 65.862, socialProtection: 297.532, total: 725.001 },
  { year: '2025', publicServices: 96.826, defence: 14.962, publicOrder: 30.095, economicAffairs: 85.054, environment: 16.335, housing: 8.003, health: 108.217, cultureRecreation: 20.176, education: 69.237, socialProtection: 315.979, total: 764.884 },
] as const;

export function spainGovernmentExpenditureCategoryRowForYear(
  year: number,
): SpainGovernmentExpenditureCategoryRow | null {
  return SPAIN_GOVERNMENT_EXPENDITURE_BY_CATEGORY.find((row) => Number(row.year) === year) ?? null;
}
