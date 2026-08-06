export type FranceGovernmentExpenditureCategoryRow = {
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

export type FranceGovernmentExpenditureCategoryKey = Exclude<
  keyof FranceGovernmentExpenditureCategoryRow,
  'year' | 'total'
>;

/** Euro billions, current prices — General Government (S13). */
export const FRANCE_GOVERNMENT_EXPENDITURE_BY_CATEGORY: readonly FranceGovernmentExpenditureCategoryRow[] = [
  { year: '2000', publicServices: 118.970, defence: 27.817, publicOrder: 20.203, economicAffairs: 74.550, environment: 9.785, housing: 16.588, health: 101.712, cultureRecreation: 17.467, education: 82.002, socialProtection: 306.255, total: 775.349 },
  { year: '2001', publicServices: 121.480, defence: 30.657, publicOrder: 22.545, economicAffairs: 72.408, environment: 10.856, housing: 17.058, health: 107.105, cultureRecreation: 19.873, education: 85.542, socialProtection: 320.703, total: 808.226 },
  { year: '2002', publicServices: 123.534, defence: 31.030, publicOrder: 24.499, economicAffairs: 78.219, environment: 11.282, housing: 19.398, health: 115.040, cultureRecreation: 21.678, education: 90.561, socialProtection: 335.867, total: 851.108 },
  { year: '2003', publicServices: 122.359, defence: 28.658, publicOrder: 25.681, economicAffairs: 82.109, environment: 12.347, housing: 19.296, health: 122.524, cultureRecreation: 23.243, education: 92.938, socialProtection: 352.631, total: 881.786 },
  { year: '2004', publicServices: 126.411, defence: 30.008, publicOrder: 26.161, economicAffairs: 85.079, environment: 13.352, housing: 20.317, health: 129.308, cultureRecreation: 23.950, education: 93.271, socialProtection: 368.050, total: 915.906 },
  { year: '2005', publicServices: 131.094, defence: 31.865, publicOrder: 26.854, economicAffairs: 90.788, environment: 14.274, housing: 20.245, health: 137.428, cultureRecreation: 25.633, education: 96.262, socialProtection: 381.700, total: 956.142 },
  { year: '2006', publicServices: 130.204, defence: 33.862, publicOrder: 27.415, economicAffairs: 91.706, environment: 15.428, housing: 22.124, health: 142.088, cultureRecreation: 27.615, education: 99.860, socialProtection: 401.939, total: 992.241 },
  { year: '2007', publicServices: 137.333, defence: 34.121, publicOrder: 28.477, economicAffairs: 97.222, environment: 15.813, housing: 24.691, health: 147.175, cultureRecreation: 28.803, education: 101.519, socialProtection: 424.131, total: 1039.288 },
  { year: '2008', publicServices: 145.096, defence: 35.909, publicOrder: 30.896, economicAffairs: 100.350, environment: 16.692, housing: 26.529, health: 150.665, cultureRecreation: 29.881, education: 105.750, socialProtection: 438.453, total: 1080.221 },
  { year: '2009', publicServices: 144.946, defence: 37.315, publicOrder: 32.292, economicAffairs: 102.505, environment: 17.977, housing: 29.603, health: 157.398, cultureRecreation: 30.942, education: 109.069, socialProtection: 460.562, total: 1122.608 },
  { year: '2010', publicServices: 146.048, defence: 39.359, publicOrder: 33.439, economicAffairs: 107.066, environment: 18.860, housing: 28.746, health: 162.526, cultureRecreation: 32.119, education: 110.381, socialProtection: 473.419, total: 1151.963 },
  { year: '2011', publicServices: 151.646, defence: 36.690, publicOrder: 33.749, economicAffairs: 106.157, environment: 19.232, housing: 28.961, health: 167.496, cultureRecreation: 32.948, education: 110.025, socialProtection: 488.800, total: 1175.704 },
  { year: '2012', publicServices: 155.457, defence: 37.478, publicOrder: 34.073, economicAffairs: 112.957, environment: 19.632, housing: 28.258, health: 170.537, cultureRecreation: 33.566, education: 111.041, socialProtection: 505.953, total: 1208.952 },
  { year: '2013', publicServices: 153.608, defence: 37.830, publicOrder: 34.523, economicAffairs: 128.007, environment: 20.302, housing: 28.086, health: 174.363, cultureRecreation: 34.693, education: 112.624, socialProtection: 518.323, total: 1242.359 },
  { year: '2014', publicServices: 149.560, defence: 35.974, publicOrder: 35.048, economicAffairs: 133.007, environment: 20.629, housing: 27.441, health: 179.572, cultureRecreation: 34.042, education: 114.290, socialProtection: 528.086, total: 1257.649 },
  { year: '2015', publicServices: 145.578, defence: 37.972, publicOrder: 35.770, economicAffairs: 136.666, environment: 20.687, housing: 26.917, health: 180.941, cultureRecreation: 32.437, education: 115.802, socialProtection: 535.237, total: 1268.006 },
  { year: '2016', publicServices: 144.288, defence: 43.660, publicOrder: 36.711, economicAffairs: 132.826, environment: 19.897, housing: 25.636, health: 184.631, cultureRecreation: 32.040, education: 115.328, socialProtection: 545.630, total: 1280.646 },
  { year: '2017', publicServices: 149.870, defence: 40.108, publicOrder: 37.847, economicAffairs: 149.243, environment: 20.290, housing: 25.245, health: 190.006, cultureRecreation: 33.081, education: 118.685, socialProtection: 557.070, total: 1321.445 },
  { year: '2018', publicServices: 146.092, defence: 41.288, publicOrder: 38.606, economicAffairs: 141.295, environment: 21.484, housing: 24.848, health: 193.539, cultureRecreation: 33.732, education: 120.513, socialProtection: 566.236, total: 1327.633 },
  { year: '2019', publicServices: 145.858, defence: 41.888, publicOrder: 40.211, economicAffairs: 129.806, environment: 23.012, housing: 26.978, health: 198.147, cultureRecreation: 35.443, education: 122.430, socialProtection: 582.386, total: 1346.158 },
  { year: '2020', publicServices: 140.897, defence: 43.283, publicOrder: 41.220, economicAffairs: 162.270, environment: 22.747, housing: 26.562, health: 208.024, cultureRecreation: 33.879, education: 120.102, socialProtection: 631.373, total: 1430.358 },
  { year: '2021', publicServices: 152.710, defence: 43.309, publicOrder: 42.776, economicAffairs: 177.419, environment: 24.570, housing: 30.017, health: 234.725, cultureRecreation: 36.149, education: 127.072, socialProtection: 622.635, total: 1491.381 },
  { year: '2022', publicServices: 173.222, defence: 47.675, publicOrder: 45.475, economicAffairs: 179.789, environment: 27.163, housing: 31.724, health: 240.773, cultureRecreation: 38.465, education: 134.017, socialProtection: 632.030, total: 1550.332 },
  { year: '2023', publicServices: 174.764, defence: 51.180, publicOrder: 48.712, economicAffairs: 177.620, environment: 28.936, housing: 35.602, health: 249.676, cultureRecreation: 41.417, education: 141.555, socialProtection: 657.931, total: 1607.393 },
  { year: '2024', publicServices: 181.103, defence: 54.199, publicOrder: 52.113, economicAffairs: 166.073, environment: 30.285, housing: 42.129, health: 261.156, cultureRecreation: 43.068, education: 148.640, socialProtection: 693.029, total: 1671.794 },
] as const;

export function franceGovernmentExpenditureCategoryRowForYear(
  year: number,
): FranceGovernmentExpenditureCategoryRow | null {
  return FRANCE_GOVERNMENT_EXPENDITURE_BY_CATEGORY.find((row) => Number(row.year) === year) ?? null;
}
