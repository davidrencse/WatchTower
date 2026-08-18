/**
 * Spain - general government (S13) expenditure recomposed into the dashboard's
 * category-card taxonomy, plus the fiscal-context indicators. EUR billions, current prices.
 * Primary source: Eurostat `gov_10a_exp` / `gov_10a_main`, pulled 10 Aug 2026.
 *
 * The nine spending columns reconcile exactly to `total` (the Eurostat total; the
 * generator asserts this for every year):
 *   generalPublicServices = GF01 - interest;  interestPayments = D.41 payable;
 *   transportInfrastructure = GF04.5;  economicAffairsSubsidies = GF04 - GF04.5;
 *   other = GF03 + GF05 + GF06 + GF08 (public order, environment, housing, culture).
 * `pensions` = old-age pensions (GF10.02); `publicInvestment` = gross fixed capital
 * formation (P.51g); `housing` = GF06 - these three are cross-cutting highlight boxes,
 * not additional partitions, and `housing` is already counted inside `other`.
 *
 * 2025 COFOG columns are estimated (see `spainGovernmentExpenditureByCategory.ts`);
 * 2025 `total`, `interestPayments` and `publicInvestment` are published `gov_10a_main`
 * figures, not estimates.
 *
 * gdpPerCapitaUsd: World Bank NY.GDP.PCAP.CD, nominal USD.
 * laborProductivityIndex: Eurostat `nama_10_lp_ulc` real labour productivity per hour
 * worked (RLPR_HW, index 2015 = 100), rebased here to 2000 = 100.
 * hdi: UNDP HDR 2025 composite time series; 2000-2023 published, 2024-2025 extrapolated
 * on the 2021-2023 trend because the published HDR series ends at 2023.
 */
export type SpainGovSpendingYearRow = {
  year: string;
  total: number;
  socialProtection: number;
  health: number;
  educationResearch: number;
  defence: number;
  transportInfrastructure: number;
  generalPublicServices: number;
  interestPayments: number;
  economicAffairsSubsidies: number;
  other: number;
  pensions: number;
  publicInvestment: number;
  housing: number;
  gdpPerCapitaUsd: number;
  laborProductivityIndex: number;
  hdi: number;
};

export const SPAIN_GOV_SPENDING_SERIES: readonly SpainGovSpendingYearRow[] = [
  { year: '2000', total: 253.267, socialProtection: 82.247, health: 33.324, educationResearch: 26.387, defence: 7.141, transportInfrastructure: 13.223, generalPublicServices: 19.646, interestPayments: 20.485, economicAffairsSubsidies: 18.905, other: 31.909, pensions: 40.602, publicInvestment: 23.928, housing: 7.552, gdpPerCapitaUsd: 14743, laborProductivityIndex: 100.0, hdi: 0.833 },
  { year: '2001', total: 269.195, socialProtection: 87.398, health: 35.37, educationResearch: 27.964, defence: 7.459, transportInfrastructure: 13.545, generalPublicServices: 21.845, interestPayments: 20.815, economicAffairsSubsidies: 19.68, other: 35.119, pensions: 42.627, publicInvestment: 26.536, housing: 7.074, gdpPerCapitaUsd: 15368, laborProductivityIndex: 100.0, hdi: 0.839 },
  { year: '2002', total: 289.527, socialProtection: 94.604, health: 38.354, educationResearch: 30.285, defence: 8.139, transportInfrastructure: 15.682, generalPublicServices: 23.732, interestPayments: 19.712, economicAffairsSubsidies: 20.838, other: 38.181, pensions: 46.159, publicInvestment: 30.487, housing: 7.782, gdpPerCapitaUsd: 17111, laborProductivityIndex: 100.2, hdi: 0.844 },
  { year: '2003', total: 307.796, socialProtection: 101.961, health: 41.512, educationResearch: 32.276, defence: 8.335, transportInfrastructure: 15.804, generalPublicServices: 26.329, interestPayments: 18.459, economicAffairsSubsidies: 21.642, other: 41.478, pensions: 49.248, publicInvestment: 33.265, housing: 8.455, gdpPerCapitaUsd: 21522, laborProductivityIndex: 100.5, hdi: 0.846 },
  { year: '2004', total: 333.666, socialProtection: 109.816, health: 46.914, educationResearch: 35.087, defence: 9.23, transportInfrastructure: 22.569, generalPublicServices: 27.158, interestPayments: 17.104, economicAffairsSubsidies: 24.071, other: 41.717, pensions: 51.879, publicInvestment: 34.404, housing: 6.855, gdpPerCapitaUsd: 24925, laborProductivityIndex: 100.8, hdi: 0.852 },
  { year: '2005', total: 356.785, socialProtection: 117.948, health: 52.462, educationResearch: 36.725, defence: 9.975, transportInfrastructure: 20.633, generalPublicServices: 31.151, interestPayments: 16.201, economicAffairsSubsidies: 26.219, other: 45.471, pensions: 56.076, publicInvestment: 39.134, housing: 7.943, gdpPerCapitaUsd: 26451, laborProductivityIndex: 101.1, hdi: 0.857 },
  { year: '2006', total: 385.757, socialProtection: 127.3, health: 56.708, educationResearch: 39.812, defence: 10.255, transportInfrastructure: 22.098, generalPublicServices: 34.581, interestPayments: 16.168, economicAffairsSubsidies: 28.331, other: 50.504, pensions: 61.243, publicInvestment: 43.832, housing: 7.803, gdpPerCapitaUsd: 28422, laborProductivityIndex: 101.7, hdi: 0.862 },
  { year: '2007', total: 422.164, socialProtection: 138.115, health: 61.27, educationResearch: 43.316, defence: 10.817, transportInfrastructure: 25.147, generalPublicServices: 36.361, interestPayments: 17.009, economicAffairsSubsidies: 32.496, other: 57.633, pensions: 65.71, publicInvestment: 50.418, housing: 9.876, gdpPerCapitaUsd: 32652, laborProductivityIndex: 102.7, hdi: 0.864 },
  { year: '2008', total: 459.813, socialProtection: 153.146, health: 67.347, educationResearch: 47.026, defence: 11.243, transportInfrastructure: 26.581, generalPublicServices: 39.7, interestPayments: 17.542, economicAffairsSubsidies: 34.648, other: 62.58, pensions: 70.164, publicInvestment: 51.712, housing: 11.867, gdpPerCapitaUsd: 35603, laborProductivityIndex: 102.8, hdi: 0.865 },
  { year: '2009', total: 494.353, socialProtection: 172.746, health: 72.993, educationResearch: 49.666, defence: 10.946, transportInfrastructure: 27.285, generalPublicServices: 42.599, interestPayments: 18.355, economicAffairsSubsidies: 34.784, other: 64.979, pensions: 75.516, publicInvestment: 55.353, housing: 13.963, gdpPerCapitaUsd: 32280, laborProductivityIndex: 105.2, hdi: 0.867 },
  { year: '2010', total: 493.817, socialProtection: 179.73, health: 71.145, educationResearch: 48.493, defence: 11.283, transportInfrastructure: 28.62, generalPublicServices: 40.005, interestPayments: 20.437, economicAffairsSubsidies: 34.181, other: 59.923, pensions: 80.022, publicInvestment: 50.959, housing: 7.546, gdpPerCapitaUsd: 30659, laborProductivityIndex: 107.8, hdi: 0.875 },
  { year: '2011', total: 490.908, socialProtection: 180.794, health: 69.312, educationResearch: 47.12, defence: 11.155, transportInfrastructure: 25.114, generalPublicServices: 40.155, interestPayments: 26.562, economicAffairsSubsidies: 35.215, other: 55.481, pensions: 83.897, publicInvestment: 40.001, housing: 6.048, gdpPerCapitaUsd: 31825, laborProductivityIndex: 109.4, hdi: 0.879 },
  { year: '2012', total: 509.936, socialProtection: 183.764, health: 64.721, educationResearch: 43.291, defence: 9.698, transportInfrastructure: 17.773, generalPublicServices: 37.691, interestPayments: 31.353, economicAffairsSubsidies: 72.688, other: 48.957, pensions: 87.831, publicInvestment: 32.549, housing: 5.843, gdpPerCapitaUsd: 28456, laborProductivityIndex: 111.6, hdi: 0.881 },
  { year: '2013', total: 473.398, socialProtection: 185.373, health: 63.338, educationResearch: 42.106, defence: 9.878, transportInfrastructure: 16.596, generalPublicServices: 38.938, interestPayments: 36.553, economicAffairsSubsidies: 34.518, other: 46.098, pensions: 92.135, publicInvestment: 24.651, housing: 4.703, gdpPerCapitaUsd: 29229, laborProductivityIndex: 113.3, hdi: 0.886 },
  { year: '2014', total: 467.841, socialProtection: 185.342, health: 63.499, educationResearch: 42.556, defence: 8.95, transportInfrastructure: 16.809, generalPublicServices: 36.997, interestPayments: 36.706, economicAffairsSubsidies: 30.064, other: 46.918, pensions: 95.35, publicInvestment: 22.079, housing: 5.166, gdpPerCapitaUsd: 29708, laborProductivityIndex: 113.8, hdi: 0.89 },
  { year: '2015', total: 474.893, socialProtection: 185.186, health: 66.484, educationResearch: 44.39, defence: 10.416, transportInfrastructure: 18.592, generalPublicServices: 36.988, interestPayments: 33.368, economicAffairsSubsidies: 30.207, other: 49.262, pensions: 98.901, publicInvestment: 28.002, housing: 5.55, gdpPerCapitaUsd: 25982, laborProductivityIndex: 115.0, hdi: 0.895 },
  { year: '2016', total: 472.717, socialProtection: 189.379, health: 67.713, educationResearch: 45.328, defence: 10.889, transportInfrastructure: 15.961, generalPublicServices: 37.091, interestPayments: 31.226, economicAffairsSubsidies: 27.213, other: 47.917, pensions: 102.579, publicInvestment: 22.199, housing: 4.876, gdpPerCapitaUsd: 26756, laborProductivityIndex: 115.4, hdi: 0.9 },
  { year: '2017', total: 479.908, socialProtection: 193.87, health: 69.298, educationResearch: 46.442, defence: 10.373, transportInfrastructure: 16.491, generalPublicServices: 35.028, interestPayments: 29.613, economicAffairsSubsidies: 29.765, other: 49.028, pensions: 106.655, publicInvestment: 23.118, housing: 5.031, gdpPerCapitaUsd: 28381, laborProductivityIndex: 116.2, hdi: 0.902 },
  { year: '2018', total: 503.193, socialProtection: 203.47, health: 72.146, educationResearch: 47.764, defence: 10.287, transportInfrastructure: 19.607, generalPublicServices: 37.927, interestPayments: 29.593, economicAffairsSubsidies: 31.925, other: 50.474, pensions: 112.641, publicInvestment: 25.889, housing: 5.13, gdpPerCapitaUsd: 30602, laborProductivityIndex: 116.2, hdi: 0.905 },
  { year: '2019', total: 526.769, socialProtection: 216.733, health: 75.917, educationResearch: 50.052, defence: 10.537, transportInfrastructure: 18.493, generalPublicServices: 39.44, interestPayments: 28.231, economicAffairsSubsidies: 34.268, other: 53.098, pensions: 118.714, publicInvestment: 27.206, housing: 5.19, gdpPerCapitaUsd: 29787, laborProductivityIndex: 116.4, hdi: 0.91 },
  { year: '2020', total: 580.164, socialProtection: 247.445, health: 85.545, educationResearch: 52.003, defence: 10.549, transportInfrastructure: 21.069, generalPublicServices: 40.932, interestPayments: 25.127, economicAffairsSubsidies: 44.72, other: 52.774, pensions: 122.744, publicInvestment: 29.694, housing: 5.149, gdpPerCapitaUsd: 27234, laborProductivityIndex: 116.5, hdi: 0.901 },
  { year: '2021', total: 611.124, socialProtection: 248.671, health: 88.541, educationResearch: 55.885, defence: 11.716, transportInfrastructure: 24.785, generalPublicServices: 44.806, interestPayments: 26.17, economicAffairsSubsidies: 54.158, other: 56.392, pensions: 129.584, publicInvestment: 33.591, housing: 5.78, gdpPerCapitaUsd: 30799, laborProductivityIndex: 115.9, hdi: 0.912 },
  { year: '2022', total: 637.117, socialProtection: 252.111, health: 93.327, educationResearch: 58.669, defence: 15.347, transportInfrastructure: 25.167, generalPublicServices: 46.043, interestPayments: 31.775, economicAffairsSubsidies: 51.964, other: 62.714, pensions: 137.505, publicInvestment: 37.35, housing: 6.461, gdpPerCapitaUsd: 30319, laborProductivityIndex: 117.3, hdi: 0.911 },
  { year: '2023', total: 680.225, socialProtection: 277.327, health: 98.63, educationResearch: 62.532, defence: 14.008, transportInfrastructure: 28.897, generalPublicServices: 48.874, interestPayments: 35.551, economicAffairsSubsidies: 45.954, other: 68.452, pensions: 153.051, publicInvestment: 44.696, housing: 7.821, gdpPerCapitaUsd: 33493, laborProductivityIndex: 117.1, hdi: 0.918 },
  { year: '2024', total: 725.001, socialProtection: 297.532, health: 102.942, educationResearch: 65.862, defence: 14.233, transportInfrastructure: 28.634, generalPublicServices: 53.758, interestPayments: 38.793, economicAffairsSubsidies: 52.274, other: 70.973, pensions: 165.05, publicInvestment: 43.485, housing: 7.613, gdpPerCapitaUsd: 35327, laborProductivityIndex: 118.5, hdi: 0.921 },
  { year: '2025', total: 764.884, socialProtection: 315.979, health: 108.217, educationResearch: 69.237, defence: 14.962, transportInfrastructure: 30.101, generalPublicServices: 56.512, interestPayments: 40.314, economicAffairsSubsidies: 54.952, other: 74.61, pensions: 175.283, publicInvestment: 49.632, housing: 8.003, gdpPerCapitaUsd: 38627, laborProductivityIndex: 119.4, hdi: 0.923 },
] as const;

export function spainGovSpendRowForYear(year: number): SpainGovSpendingYearRow {
  return (
    SPAIN_GOV_SPENDING_SERIES.find((r) => Number(r.year) === year) ??
    SPAIN_GOV_SPENDING_SERIES[SPAIN_GOV_SPENDING_SERIES.length - 1]!
  );
}
