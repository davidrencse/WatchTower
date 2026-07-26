export type ItalyGovernmentExpenditureCategoryRow = {
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

export type ItalyGovernmentExpenditureCategoryKey = Exclude<
  keyof ItalyGovernmentExpenditureCategoryRow,
  'year' | 'total'
>;

/**
 * Italy — general government (S13) expenditure by COFOG function, € billions,
 * current prices. Source: Eurostat gov_10a_exp (na_item TE), extracted 21 Jul 2026.
 * Real published data covers 2000–2024; 2025 is a provisional estimate (Eurostat
 * COFOG for 2025 is not yet released) and is flagged in the UI description.
 *
 * `publicServices` (GF01) includes public-debt interest, matching the COFOG
 * definition; the category cards below break interest out separately.
 */
export const ITALY_GOVERNMENT_EXPENDITURE_BY_CATEGORY: readonly ItalyGovernmentExpenditureCategoryRow[] = [
  { year: '2000', publicServices: 131.845, defence: 13.838, publicOrder: 24.625, economicAffairs: 45.502, environment: 10.551, housing: 7.225, health: 71.943, cultureRecreation: 8.813, education: 54.366, socialProtection: 208.46, total: 577.169 },
  { year: '2001', publicServices: 139.629, defence: 15.306, publicOrder: 24.132, economicAffairs: 55.915, environment: 10.74, housing: 7.6, health: 79.689, cultureRecreation: 9.522, education: 58.134, socialProtection: 216.111, total: 616.778 },
  { year: '2002', publicServices: 138.608, defence: 15.506, publicOrder: 25.736, economicAffairs: 57.521, environment: 11.563, housing: 8.009, health: 84.008, cultureRecreation: 9.451, education: 60.378, socialProtection: 219.446, total: 630.226 },
  { year: '2003', publicServices: 136.849, defence: 17.466, publicOrder: 27.531, economicAffairs: 56.864, environment: 11.593, housing: 8.038, health: 86.93, cultureRecreation: 9.932, education: 64.001, socialProtection: 238.067, total: 657.271 },
  { year: '2004', publicServices: 138.136, defence: 18.544, publicOrder: 27.611, economicAffairs: 56.953, environment: 11.862, housing: 8.622, health: 95.319, cultureRecreation: 10.877, education: 63.427, socialProtection: 248.75, total: 680.101 },
  { year: '2005', publicServices: 141.197, defence: 18.913, publicOrder: 28.678, economicAffairs: 59.535, environment: 12.106, housing: 8.474, health: 101.69, cultureRecreation: 10.81, education: 67.154, socialProtection: 256.809, total: 705.365 },
  { year: '2006', publicServices: 143.059, defence: 18.816, publicOrder: 28.462, economicAffairs: 77.135, environment: 11.634, housing: 8.805, health: 106.836, cultureRecreation: 10.585, education: 68.488, socialProtection: 268.05, total: 741.87 },
  { year: '2007', publicServices: 148.289, defence: 19.329, publicOrder: 29.222, economicAffairs: 64.061, environment: 12.877, housing: 9.29, health: 107.648, cultureRecreation: 11.422, education: 72.375, socialProtection: 281.212, total: 755.725 },
  { year: '2008', publicServices: 156.66, defence: 21.447, publicOrder: 28.846, economicAffairs: 63.078, environment: 13.763, housing: 9.402, health: 114.568, cultureRecreation: 11.426, education: 71.13, socialProtection: 294.57, total: 784.89 },
  { year: '2009', publicServices: 146.167, defence: 23.635, publicOrder: 30.861, economicAffairs: 71.212, environment: 13.926, housing: 9.878, health: 117.133, cultureRecreation: 11.566, education: 72.503, socialProtection: 311.847, total: 808.728 },
  { year: '2010', publicServices: 144.274, defence: 22.191, publicOrder: 31.114, economicAffairs: 64.631, environment: 14.115, housing: 10.395, health: 119.119, cultureRecreation: 10.632, education: 71.093, socialProtection: 318.154, total: 805.717 },
  { year: '2011', publicServices: 150.189, defence: 22.56, publicOrder: 31.744, economicAffairs: 65.65, environment: 14.662, housing: 9.086, health: 116.98, cultureRecreation: 10.524, education: 68.081, socialProtection: 323.073, total: 812.549 },
  { year: '2012', publicServices: 156.616, defence: 20.861, publicOrder: 30.632, economicAffairs: 70.542, environment: 14.447, housing: 9.683, health: 115.188, cultureRecreation: 9.946, education: 66.642, socialProtection: 329.745, total: 824.301 },
  { year: '2013', publicServices: 153.129, defence: 19.783, publicOrder: 30.675, economicAffairs: 68.356, environment: 15.679, housing: 8.252, health: 114.244, cultureRecreation: 10.777, education: 66.794, socialProtection: 337.544, total: 825.233 },
  { year: '2014', publicServices: 146.358, defence: 19.32, publicOrder: 30.317, economicAffairs: 74.246, environment: 15.185, housing: 7.486, health: 115.261, cultureRecreation: 10.628, education: 66.821, socialProtection: 344.01, total: 829.632 },
  { year: '2015', publicServices: 136.928, defence: 19.722, publicOrder: 30.784, economicAffairs: 78.454, environment: 15.461, housing: 7.526, health: 115.779, cultureRecreation: 11.374, education: 67.186, socialProtection: 352.48, total: 835.694 },
  { year: '2016', publicServices: 137.217, defence: 22.051, publicOrder: 30.887, economicAffairs: 71.412, environment: 15.617, housing: 6.923, health: 116.516, cultureRecreation: 13.253, education: 67.314, socialProtection: 353.847, total: 835.037 },
  { year: '2017', publicServices: 134.572, defence: 22.314, publicOrder: 31.68, economicAffairs: 80.551, environment: 15.372, housing: 6.719, health: 117.95, cultureRecreation: 13.309, education: 69.156, socialProtection: 359.393, total: 851.015 },
  { year: '2018', publicServices: 136.531, defence: 21.995, publicOrder: 32.503, economicAffairs: 75.126, environment: 15.334, housing: 7.256, health: 119.526, cultureRecreation: 14.137, education: 70.3, socialProtection: 366.31, total: 859.018 },
  { year: '2019', publicServices: 132.178, defence: 23.06, publicOrder: 32.921, economicAffairs: 75.919, environment: 16.378, housing: 7.371, health: 121.075, cultureRecreation: 14.415, education: 71.368, socialProtection: 378.914, total: 873.598 },
  { year: '2020', publicServices: 133.863, defence: 22.726, publicOrder: 33.513, economicAffairs: 98.82, environment: 16.187, housing: 9.722, health: 130.297, cultureRecreation: 13.965, education: 72.141, socialProtection: 417.062, total: 948.296 },
  { year: '2021', publicServices: 141.809, defence: 24.994, publicOrder: 33.899, economicAffairs: 124.309, environment: 17.583, housing: 44.994, health: 135.909, cultureRecreation: 16.254, education: 77.157, socialProtection: 415.621, total: 1032.529 },
  { year: '2022', publicServices: 162.393, defence: 24.037, publicOrder: 35.2, economicAffairs: 129.521, environment: 18.171, housing: 65.879, health: 137.431, cultureRecreation: 17.785, education: 80.066, socialProtection: 427.145, total: 1097.627 },
  { year: '2023', publicServices: 158.234, defence: 25.513, publicOrder: 36.209, economicAffairs: 124.434, environment: 18.627, housing: 95.037, health: 139.65, cultureRecreation: 17.81, education: 84.356, socialProtection: 449.337, total: 1149.206 },
  { year: '2024', publicServices: 170.414, defence: 28.301, publicOrder: 39.094, economicAffairs: 112.381, environment: 19.828, housing: 16.973, health: 146.075, cultureRecreation: 18.774, education: 89.18, socialProtection: 468.135, total: 1109.154 },
  { year: '2025', publicServices: 173, defence: 31, publicOrder: 40, economicAffairs: 108, environment: 20.5, housing: 13, health: 150, cultureRecreation: 19, education: 90, socialProtection: 485, total: 1129.5 },
] as const;

export function italyGovernmentExpenditureCategoryRowForYear(
  year: number,
): ItalyGovernmentExpenditureCategoryRow | null {
  return ITALY_GOVERNMENT_EXPENDITURE_BY_CATEGORY.find((row) => Number(row.year) === year) ?? null;
}
