/**
 * Italy — general government (S13) expenditure recomposed into the dashboard's
 * category-card taxonomy, plus the fiscal-context indicators. € billions, current
 * prices. Primary source: Eurostat gov_10a_exp / gov_10a_main, extracted 21 Jul 2026.
 *
 * The nine spending columns reconcile exactly to `total` (the Eurostat COFOG total):
 *   generalPublicServices = GF01 − interest;  interestPayments = D.41 payable;
 *   transportInfrastructure = GF04.5;  economicAffairsSubsidies = GF04 − GF04.5;
 *   other = GF03 + GF05 + GF06 + GF08 (public order, environment, housing, culture).
 * `pensions` = old-age pensions (GF10.02); `publicInvestment` = gross fixed capital
 * formation (P.51g); `housing` = GF06 — these are cross-cutting highlight boxes, not
 * additional partitions. 2000 GF04.5/GF10.02 and all of 2025 are estimates (see notes).
 *
 * gdpPerCapitaUsd: World Bank nominal USD. laborProductivityIndex: GDP per hour worked,
 * 2000 = 100 (Italy's near-flat trajectory). hdi: UNDP Human Development Index.
 */
export type ItalyGovSpendingYearRow = {
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

export const ITALY_GOV_SPENDING_SERIES: readonly ItalyGovSpendingYearRow[] = [
  { year: '2000', total: 577.169, socialProtection: 208.46, health: 71.943, educationResearch: 54.366, defence: 13.838, transportInfrastructure: 24, generalPublicServices: 55.884, interestPayments: 75.961, economicAffairsSubsidies: 21.502, other: 51.215, pensions: 143, publicInvestment: 34.605, housing: 7.225, gdpPerCapitaUsd: 20918, laborProductivityIndex: 100, hdi: 0.844 },
  { year: '2001', total: 616.778, socialProtection: 216.111, health: 79.689, educationResearch: 58.134, defence: 15.306, transportInfrastructure: 24.899, generalPublicServices: 60.547, interestPayments: 79.082, economicAffairsSubsidies: 31.016, other: 51.994, pensions: 147.985, publicInvestment: 38.68, housing: 7.6, gdpPerCapitaUsd: 20462, laborProductivityIndex: 100.7, hdi: 0.849 },
  { year: '2002', total: 630.226, socialProtection: 219.446, health: 84.008, educationResearch: 60.378, defence: 15.506, transportInfrastructure: 25.502, generalPublicServices: 65.131, interestPayments: 73.477, economicAffairsSubsidies: 32.019, other: 54.759, pensions: 148.793, publicInvestment: 33.102, housing: 8.009, gdpPerCapitaUsd: 22272, laborProductivityIndex: 100.4, hdi: 0.853 },
  { year: '2003', total: 657.271, socialProtection: 238.067, health: 86.93, educationResearch: 64.001, defence: 17.466, transportInfrastructure: 25.181, generalPublicServices: 67.711, interestPayments: 69.138, economicAffairsSubsidies: 31.683, other: 57.094, pensions: 161.206, publicInvestment: 42.394, housing: 8.038, gdpPerCapitaUsd: 27048, laborProductivityIndex: 100.6, hdi: 0.858 },
  { year: '2004', total: 680.101, socialProtection: 248.75, health: 95.319, educationResearch: 63.427, defence: 18.544, transportInfrastructure: 26.741, generalPublicServices: 71.387, interestPayments: 66.749, economicAffairsSubsidies: 30.212, other: 58.972, pensions: 168.548, publicInvestment: 45.373, housing: 8.622, gdpPerCapitaUsd: 31258, laborProductivityIndex: 101.8, hdi: 0.863 },
  { year: '2005', total: 705.365, socialProtection: 256.809, health: 101.69, educationResearch: 67.154, defence: 18.913, transportInfrastructure: 28.448, generalPublicServices: 73.973, interestPayments: 67.224, economicAffairsSubsidies: 31.087, other: 60.068, pensions: 174.619, publicInvestment: 47.123, housing: 8.474, gdpPerCapitaUsd: 32043, laborProductivityIndex: 102.3, hdi: 0.868 },
  { year: '2006', total: 741.87, socialProtection: 268.05, health: 106.836, educationResearch: 68.488, defence: 18.816, transportInfrastructure: 44.846, generalPublicServices: 74.188, interestPayments: 68.871, economicAffairsSubsidies: 32.289, other: 59.486, pensions: 182.605, publicInvestment: 48.847, housing: 8.805, gdpPerCapitaUsd: 33423, laborProductivityIndex: 102.9, hdi: 0.873 },
  { year: '2007', total: 755.725, socialProtection: 281.212, health: 107.648, educationResearch: 72.375, defence: 19.329, transportInfrastructure: 33.599, generalPublicServices: 71.612, interestPayments: 76.677, economicAffairsSubsidies: 30.462, other: 62.811, pensions: 191.883, publicInvestment: 50.752, housing: 9.29, gdpPerCapitaUsd: 38619, laborProductivityIndex: 103.1, hdi: 0.878 },
  { year: '2008', total: 784.89, socialProtection: 294.57, health: 114.568, educationResearch: 71.13, defence: 21.447, transportInfrastructure: 32.255, generalPublicServices: 75.982, interestPayments: 80.678, economicAffairsSubsidies: 30.823, other: 63.437, pensions: 200.587, publicInvestment: 51.494, housing: 9.402, gdpPerCapitaUsd: 40749, laborProductivityIndex: 101.5, hdi: 0.882 },
  { year: '2009', total: 808.728, socialProtection: 311.847, health: 117.133, educationResearch: 72.503, defence: 23.635, transportInfrastructure: 33.761, generalPublicServices: 76.668, interestPayments: 69.499, economicAffairsSubsidies: 37.451, other: 66.23, pensions: 207.276, publicInvestment: 57.351, housing: 9.878, gdpPerCapitaUsd: 37080, laborProductivityIndex: 99, hdi: 0.884 },
  { year: '2010', total: 805.717, socialProtection: 318.154, health: 119.119, educationResearch: 71.093, defence: 22.191, transportInfrastructure: 31.859, generalPublicServices: 75.417, interestPayments: 68.857, economicAffairsSubsidies: 32.772, other: 66.256, pensions: 213.681, publicInvestment: 49.425, housing: 10.395, gdpPerCapitaUsd: 36001, laborProductivityIndex: 101.5, hdi: 0.887 },
  { year: '2011', total: 812.549, socialProtection: 323.073, health: 116.98, educationResearch: 68.081, defence: 22.56, transportInfrastructure: 31.654, generalPublicServices: 73.623, interestPayments: 76.566, economicAffairsSubsidies: 33.996, other: 66.016, pensions: 218.204, publicInvestment: 47.416, housing: 9.086, gdpPerCapitaUsd: 38599, laborProductivityIndex: 101.7, hdi: 0.89 },
  { year: '2012', total: 824.301, socialProtection: 329.745, health: 115.188, educationResearch: 66.642, defence: 20.861, transportInfrastructure: 30.783, generalPublicServices: 73.034, interestPayments: 83.582, economicAffairsSubsidies: 39.759, other: 64.708, pensions: 220.007, publicInvestment: 42.859, housing: 9.683, gdpPerCapitaUsd: 35053, laborProductivityIndex: 100.9, hdi: 0.881 },
  { year: '2013', total: 825.233, socialProtection: 337.544, health: 114.244, educationResearch: 66.794, defence: 19.783, transportInfrastructure: 30.479, generalPublicServices: 75.47, interestPayments: 77.659, economicAffairsSubsidies: 37.876, other: 65.383, pensions: 223.699, publicInvestment: 40.367, housing: 8.252, gdpPerCapitaUsd: 35550, laborProductivityIndex: 101.2, hdi: 0.884 },
  { year: '2014', total: 829.632, socialProtection: 344.01, health: 115.261, educationResearch: 66.821, defence: 19.32, transportInfrastructure: 30.123, generalPublicServices: 71.916, interestPayments: 74.442, economicAffairsSubsidies: 44.123, other: 63.616, pensions: 223.481, publicInvestment: 37.617, housing: 7.486, gdpPerCapitaUsd: 35396, laborProductivityIndex: 101.5, hdi: 0.887 },
  { year: '2015', total: 835.694, socialProtection: 352.48, health: 115.779, educationResearch: 67.186, defence: 19.722, transportInfrastructure: 31.594, generalPublicServices: 68.812, interestPayments: 68.116, economicAffairsSubsidies: 46.86, other: 65.145, pensions: 227.408, publicInvestment: 40.168, housing: 7.526, gdpPerCapitaUsd: 30231, laborProductivityIndex: 102.3, hdi: 0.89 },
  { year: '2016', total: 835.037, socialProtection: 353.847, health: 116.516, educationResearch: 67.314, defence: 22.051, transportInfrastructure: 30.441, generalPublicServices: 70.959, interestPayments: 66.258, economicAffairsSubsidies: 40.971, other: 66.68, pensions: 227.363, publicInvestment: 38.582, housing: 6.923, gdpPerCapitaUsd: 30939, laborProductivityIndex: 102.6, hdi: 0.892 },
  { year: '2017', total: 851.015, socialProtection: 359.393, health: 117.95, educationResearch: 69.156, defence: 22.314, transportInfrastructure: 30.873, generalPublicServices: 69.239, interestPayments: 65.333, economicAffairsSubsidies: 49.678, other: 67.08, pensions: 231.813, publicInvestment: 37.911, housing: 6.719, gdpPerCapitaUsd: 32538, laborProductivityIndex: 103.2, hdi: 0.895 },
  { year: '2018', total: 859.018, socialProtection: 366.31, health: 119.526, educationResearch: 70.3, defence: 21.995, transportInfrastructure: 31.767, generalPublicServices: 72.165, interestPayments: 64.366, economicAffairsSubsidies: 43.359, other: 69.23, pensions: 236.729, publicInvestment: 37.823, housing: 7.256, gdpPerCapitaUsd: 34918, laborProductivityIndex: 103.4, hdi: 0.897 },
  { year: '2019', total: 873.598, socialProtection: 378.914, health: 121.075, educationResearch: 71.368, defence: 23.06, transportInfrastructure: 33.457, generalPublicServices: 71.964, interestPayments: 60.214, economicAffairsSubsidies: 42.462, other: 71.085, pensions: 244.532, publicInvestment: 41.865, housing: 7.371, gdpPerCapitaUsd: 33674, laborProductivityIndex: 103.6, hdi: 0.9 },
  { year: '2020', total: 948.296, socialProtection: 417.062, health: 130.297, educationResearch: 72.141, defence: 22.726, transportInfrastructure: 34.241, generalPublicServices: 76.737, interestPayments: 57.126, economicAffairsSubsidies: 64.579, other: 73.387, pensions: 252.214, publicInvestment: 43.885, housing: 9.722, gdpPerCapitaUsd: 31913, laborProductivityIndex: 100.8, hdi: 0.895 },
  { year: '2021', total: 1032.529, socialProtection: 415.621, health: 135.909, educationResearch: 77.157, defence: 24.994, transportInfrastructure: 41.617, generalPublicServices: 78.805, interestPayments: 63.004, economicAffairsSubsidies: 82.692, other: 112.73, pensions: 258.264, publicInvestment: 52.402, housing: 44.994, gdpPerCapitaUsd: 35657, laborProductivityIndex: 104.8, hdi: 0.903 },
  { year: '2022', total: 1097.627, socialProtection: 427.145, health: 137.431, educationResearch: 80.066, defence: 24.037, transportInfrastructure: 41.39, generalPublicServices: 80.779, interestPayments: 81.614, economicAffairsSubsidies: 88.13, other: 137.034, pensions: 269.71, publicInvestment: 52.789, housing: 65.879, gdpPerCapitaUsd: 34776, laborProductivityIndex: 105, hdi: 0.906 },
  { year: '2023', total: 1149.206, socialProtection: 449.337, health: 139.65, educationResearch: 84.356, defence: 25.513, transportInfrastructure: 47.485, generalPublicServices: 80.455, interestPayments: 77.779, economicAffairsSubsidies: 76.949, other: 167.682, pensions: 290.902, publicInvestment: 67.582, housing: 95.037, gdpPerCapitaUsd: 38373, laborProductivityIndex: 104.6, hdi: 0.908 },
  { year: '2024', total: 1109.154, socialProtection: 468.135, health: 146.075, educationResearch: 89.18, defence: 28.301, transportInfrastructure: 51.824, generalPublicServices: 84.931, interestPayments: 85.483, economicAffairsSubsidies: 60.557, other: 94.668, pensions: 306.359, publicInvestment: 79.108, housing: 16.973, gdpPerCapitaUsd: 39003, laborProductivityIndex: 104.9, hdi: 0.91 },
  { year: '2025', total: 1129.5, socialProtection: 485, health: 150, educationResearch: 90, defence: 31, transportInfrastructure: 52.5, generalPublicServices: 83, interestPayments: 90, economicAffairsSubsidies: 55.5, other: 92.5, pensions: 318, publicInvestment: 78, housing: 13, gdpPerCapitaUsd: 40200, laborProductivityIndex: 105.3, hdi: 0.911 },
] as const;

export function italyGovSpendRowForYear(year: number): ItalyGovSpendingYearRow {
  return (
    ITALY_GOV_SPENDING_SERIES.find((r) => Number(r.year) === year) ??
    ITALY_GOV_SPENDING_SERIES[ITALY_GOV_SPENDING_SERIES.length - 1]!
  );
}
