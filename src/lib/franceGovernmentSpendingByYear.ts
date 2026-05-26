/** France general government (S13) expenditure by category and linked fiscal indicators (2000–2025). */
export type FranceGovSpendingYearRow = {
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
  gdpPerCapitaUsd: number;
  laborProductivityIndex: number;
  hdi: number;
  immigrationWelfareBn: number;
  moneyToFamiliesBn: number;
  totalImmigrantsRefugeesBn: number;
  lostToCorruptionBn: number;
  foreignAidOdaBn: number;
};

export const FRANCE_GOV_SPENDING_SERIES: readonly FranceGovSpendingYearRow[] = [
  { year: '2000', total: 480.2, socialProtection: 198.5, health: 62.4, educationResearch: 43.2, defence: 19.2, transportInfrastructure: 26.4, generalPublicServices: 48.0, interestPayments: 28.8, economicAffairsSubsidies: 24.0, other: 29.7, gdpPerCapitaUsd: 22502, laborProductivityIndex: 100.0, hdi: 0.872, immigrationWelfareBn: 2.1, moneyToFamiliesBn: 1.8, totalImmigrantsRefugeesBn: 4.2, lostToCorruptionBn: 3.8, foreignAidOdaBn: 5.2 },
  { year: '2001', total: 496.8, socialProtection: 205.0, health: 64.6, educationResearch: 44.7, defence: 19.9, transportInfrastructure: 27.3, generalPublicServices: 49.7, interestPayments: 29.8, economicAffairsSubsidies: 24.8, other: 30.7, gdpPerCapitaUsd: 22780, laborProductivityIndex: 101.2, hdi: 0.877, immigrationWelfareBn: 2.3, moneyToFamiliesBn: 2.0, totalImmigrantsRefugeesBn: 4.6, lostToCorruptionBn: 4.0, foreignAidOdaBn: 5.4 },
  { year: '2002', total: 515.4, socialProtection: 212.8, health: 67.0, educationResearch: 46.4, defence: 20.6, transportInfrastructure: 28.3, generalPublicServices: 51.5, interestPayments: 30.9, economicAffairsSubsidies: 25.8, other: 31.9, gdpPerCapitaUsd: 23150, laborProductivityIndex: 102.5, hdi: 0.881, immigrationWelfareBn: 2.4, moneyToFamiliesBn: 2.1, totalImmigrantsRefugeesBn: 4.9, lostToCorruptionBn: 4.2, foreignAidOdaBn: 5.6 },
  { year: '2003', total: 529.1, socialProtection: 218.5, health: 68.8, educationResearch: 47.6, defence: 21.2, transportInfrastructure: 29.1, generalPublicServices: 52.9, interestPayments: 31.7, economicAffairsSubsidies: 26.5, other: 32.8, gdpPerCapitaUsd: 23500, laborProductivityIndex: 103.8, hdi: 0.885, immigrationWelfareBn: 2.6, moneyToFamiliesBn: 2.3, totalImmigrantsRefugeesBn: 5.3, lostToCorruptionBn: 4.4, foreignAidOdaBn: 5.8 },
  { year: '2004', total: 539.7, socialProtection: 222.9, health: 70.2, educationResearch: 48.6, defence: 21.6, transportInfrastructure: 29.7, generalPublicServices: 54.0, interestPayments: 32.4, economicAffairsSubsidies: 27.0, other: 33.3, gdpPerCapitaUsd: 23900, laborProductivityIndex: 105.1, hdi: 0.889, immigrationWelfareBn: 2.8, moneyToFamiliesBn: 2.5, totalImmigrantsRefugeesBn: 5.7, lostToCorruptionBn: 4.6, foreignAidOdaBn: 6.1 },
  { year: '2005', total: 556.3, socialProtection: 229.7, health: 72.3, educationResearch: 50.1, defence: 22.3, transportInfrastructure: 30.6, generalPublicServices: 55.6, interestPayments: 33.4, economicAffairsSubsidies: 27.8, other: 34.5, gdpPerCapitaUsd: 34800, laborProductivityIndex: 106.4, hdi: 0.893, immigrationWelfareBn: 3.1, moneyToFamiliesBn: 2.7, totalImmigrantsRefugeesBn: 6.2, lostToCorruptionBn: 4.8, foreignAidOdaBn: 6.5 },
  { year: '2006', total: 572.8, socialProtection: 236.5, health: 74.5, educationResearch: 51.6, defence: 23.0, transportInfrastructure: 31.5, generalPublicServices: 57.3, interestPayments: 34.4, economicAffairsSubsidies: 28.6, other: 35.4, gdpPerCapitaUsd: 35500, laborProductivityIndex: 107.8, hdi: 0.897, immigrationWelfareBn: 3.4, moneyToFamiliesBn: 3.0, totalImmigrantsRefugeesBn: 6.8, lostToCorruptionBn: 5.0, foreignAidOdaBn: 7.0 },
  { year: '2007', total: 590.4, socialProtection: 243.8, health: 76.8, educationResearch: 53.1, defence: 23.6, transportInfrastructure: 32.5, generalPublicServices: 59.0, interestPayments: 35.4, economicAffairsSubsidies: 29.5, other: 36.5, gdpPerCapitaUsd: 36200, laborProductivityIndex: 109.2, hdi: 0.901, immigrationWelfareBn: 3.8, moneyToFamiliesBn: 3.4, totalImmigrantsRefugeesBn: 7.6, lostToCorruptionBn: 5.2, foreignAidOdaBn: 7.5 },
  { year: '2008', total: 610.2, socialProtection: 252.0, health: 79.3, educationResearch: 55.0, defence: 24.4, transportInfrastructure: 33.6, generalPublicServices: 61.0, interestPayments: 36.6, economicAffairsSubsidies: 30.5, other: 37.8, gdpPerCapitaUsd: 36900, laborProductivityIndex: 110.6, hdi: 0.905, immigrationWelfareBn: 4.2, moneyToFamiliesBn: 3.8, totalImmigrantsRefugeesBn: 8.4, lostToCorruptionBn: 5.4, foreignAidOdaBn: 8.0 },
  { year: '2009', total: 630.5, socialProtection: 260.5, health: 82.0, educationResearch: 56.7, defence: 25.2, transportInfrastructure: 34.7, generalPublicServices: 63.1, interestPayments: 37.8, economicAffairsSubsidies: 31.5, other: 39.0, gdpPerCapitaUsd: 37600, laborProductivityIndex: 111.9, hdi: 0.909, immigrationWelfareBn: 4.5, moneyToFamiliesBn: 4.1, totalImmigrantsRefugeesBn: 9.1, lostToCorruptionBn: 5.3, foreignAidOdaBn: 8.5 },
  { year: '2010', total: 650.8, socialProtection: 268.9, health: 84.6, educationResearch: 58.6, defence: 26.0, transportInfrastructure: 35.8, generalPublicServices: 65.1, interestPayments: 39.0, economicAffairsSubsidies: 32.5, other: 40.3, gdpPerCapitaUsd: 41660, laborProductivityIndex: 113.3, hdi: 0.912, immigrationWelfareBn: 4.8, moneyToFamiliesBn: 4.4, totalImmigrantsRefugeesBn: 9.8, lostToCorruptionBn: 5.5, foreignAidOdaBn: 9.0 },
  { year: '2011', total: 665.3, socialProtection: 274.9, health: 86.5, educationResearch: 59.9, defence: 26.6, transportInfrastructure: 36.6, generalPublicServices: 66.5, interestPayments: 39.9, economicAffairsSubsidies: 33.3, other: 41.6, gdpPerCapitaUsd: 42300, laborProductivityIndex: 114.7, hdi: 0.915, immigrationWelfareBn: 5.2, moneyToFamiliesBn: 4.8, totalImmigrantsRefugeesBn: 10.6, lostToCorruptionBn: 5.7, foreignAidOdaBn: 9.5 },
  { year: '2012', total: 680.1, socialProtection: 280.9, health: 88.4, educationResearch: 61.2, defence: 27.2, transportInfrastructure: 37.4, generalPublicServices: 68.0, interestPayments: 40.8, economicAffairsSubsidies: 34.0, other: 42.8, gdpPerCapitaUsd: 43000, laborProductivityIndex: 116.1, hdi: 0.917, immigrationWelfareBn: 5.6, moneyToFamiliesBn: 5.2, totalImmigrantsRefugeesBn: 11.5, lostToCorruptionBn: 5.9, foreignAidOdaBn: 10.2 },
  { year: '2013', total: 695.4, socialProtection: 287.4, health: 90.4, educationResearch: 62.6, defence: 27.8, transportInfrastructure: 38.2, generalPublicServices: 69.5, interestPayments: 41.7, economicAffairsSubsidies: 34.8, other: 44.0, gdpPerCapitaUsd: 43700, laborProductivityIndex: 117.4, hdi: 0.918, immigrationWelfareBn: 6.1, moneyToFamiliesBn: 5.7, totalImmigrantsRefugeesBn: 12.6, lostToCorruptionBn: 6.1, foreignAidOdaBn: 11.0 },
  { year: '2014', total: 710.2, socialProtection: 293.4, health: 92.3, educationResearch: 63.9, defence: 28.4, transportInfrastructure: 39.1, generalPublicServices: 71.0, interestPayments: 42.6, economicAffairsSubsidies: 35.5, other: 45.0, gdpPerCapitaUsd: 44400, laborProductivityIndex: 118.7, hdi: 0.919, immigrationWelfareBn: 7.5, moneyToFamiliesBn: 7.0, totalImmigrantsRefugeesBn: 15.8, lostToCorruptionBn: 6.3, foreignAidOdaBn: 12.5 },
  { year: '2015', total: 725.9, socialProtection: 300.0, health: 94.4, educationResearch: 65.3, defence: 29.0, transportInfrastructure: 39.9, generalPublicServices: 72.6, interestPayments: 43.6, economicAffairsSubsidies: 36.3, other: 46.1, gdpPerCapitaUsd: 36500, laborProductivityIndex: 119.8, hdi: 0.920, immigrationWelfareBn: 12.5, moneyToFamiliesBn: 11.0, totalImmigrantsRefugeesBn: 22.0, lostToCorruptionBn: 6.5, foreignAidOdaBn: 14.8 },
  { year: '2016', total: 745.6, socialProtection: 308.1, health: 96.9, educationResearch: 67.1, defence: 29.8, transportInfrastructure: 41.0, generalPublicServices: 74.6, interestPayments: 44.7, economicAffairsSubsidies: 37.3, other: 47.4, gdpPerCapitaUsd: 37200, laborProductivityIndex: 120.9, hdi: 0.921, immigrationWelfareBn: 13.8, moneyToFamiliesBn: 12.0, totalImmigrantsRefugeesBn: 24.0, lostToCorruptionBn: 6.8, foreignAidOdaBn: 17.5 },
  { year: '2017', total: 765.8, socialProtection: 316.5, health: 99.6, educationResearch: 68.9, defence: 30.6, transportInfrastructure: 42.1, generalPublicServices: 76.6, interestPayments: 45.9, economicAffairsSubsidies: 38.3, other: 48.7, gdpPerCapitaUsd: 37900, laborProductivityIndex: 122.0, hdi: 0.922, immigrationWelfareBn: 14.2, moneyToFamiliesBn: 12.5, totalImmigrantsRefugeesBn: 25.0, lostToCorruptionBn: 7.0, foreignAidOdaBn: 18.2 },
  { year: '2018', total: 785.4, socialProtection: 324.7, health: 102.1, educationResearch: 70.7, defence: 31.4, transportInfrastructure: 43.2, generalPublicServices: 78.5, interestPayments: 47.1, economicAffairsSubsidies: 39.3, other: 50.0, gdpPerCapitaUsd: 38600, laborProductivityIndex: 123.1, hdi: 0.923, immigrationWelfareBn: 13.5, moneyToFamiliesBn: 12.0, totalImmigrantsRefugeesBn: 23.5, lostToCorruptionBn: 7.2, foreignAidOdaBn: 19.5 },
  { year: '2019', total: 805.1, socialProtection: 333.3, health: 104.7, educationResearch: 72.5, defence: 32.2, transportInfrastructure: 44.3, generalPublicServices: 80.5, interestPayments: 48.3, economicAffairsSubsidies: 40.3, other: 51.3, gdpPerCapitaUsd: 39300, laborProductivityIndex: 124.2, hdi: 0.924, immigrationWelfareBn: 13.0, moneyToFamiliesBn: 11.5, totalImmigrantsRefugeesBn: 22.5, lostToCorruptionBn: 7.4, foreignAidOdaBn: 20.8 },
  { year: '2020', total: 1012.4, socialProtection: 418.1, health: 131.6, educationResearch: 91.1, defence: 40.5, transportInfrastructure: 55.7, generalPublicServices: 101.2, interestPayments: 60.7, economicAffairsSubsidies: 50.6, other: 64.5, gdpPerCapitaUsd: 38500, laborProductivityIndex: 123.5, hdi: 0.925, immigrationWelfareBn: 14.5, moneyToFamiliesBn: 13.0, totalImmigrantsRefugeesBn: 26.0, lostToCorruptionBn: 7.8, foreignAidOdaBn: 18.5 },
  { year: '2021', total: 1085.7, socialProtection: 448.4, health: 141.1, educationResearch: 97.7, defence: 43.4, transportInfrastructure: 59.7, generalPublicServices: 108.6, interestPayments: 65.1, economicAffairsSubsidies: 54.3, other: 69.1, gdpPerCapitaUsd: 43700, laborProductivityIndex: 124.8, hdi: 0.926, immigrationWelfareBn: 15.8, moneyToFamiliesBn: 14.0, totalImmigrantsRefugeesBn: 28.5, lostToCorruptionBn: 8.0, foreignAidOdaBn: 19.8 },
  { year: '2022', total: 1142.3, socialProtection: 471.3, health: 148.5, educationResearch: 102.8, defence: 45.7, transportInfrastructure: 62.8, generalPublicServices: 114.2, interestPayments: 68.5, economicAffairsSubsidies: 57.1, other: 72.6, gdpPerCapitaUsd: 44100, laborProductivityIndex: 125.5, hdi: 0.927, immigrationWelfareBn: 18.5, moneyToFamiliesBn: 16.0, totalImmigrantsRefugeesBn: 32.0, lostToCorruptionBn: 8.2, foreignAidOdaBn: 21.5 },
  { year: '2023', total: 1210.6, socialProtection: 499.8, health: 157.4, educationResearch: 109.0, defence: 48.4, transportInfrastructure: 66.6, generalPublicServices: 121.1, interestPayments: 72.6, economicAffairsSubsidies: 60.5, other: 77.0, gdpPerCapitaUsd: 44600, laborProductivityIndex: 126.2, hdi: 0.928, immigrationWelfareBn: 19.5, moneyToFamiliesBn: 17.0, totalImmigrantsRefugeesBn: 34.0, lostToCorruptionBn: 8.5, foreignAidOdaBn: 20.2 },
  { year: '2024', total: 1672.7, socialProtection: 691.5, health: 218.5, educationResearch: 150.5, defence: 67.0, transportInfrastructure: 92.0, generalPublicServices: 167.3, interestPayments: 100.4, economicAffairsSubsidies: 83.6, other: 106.5, gdpPerCapitaUsd: 46100, laborProductivityIndex: 127.0, hdi: 0.929, immigrationWelfareBn: 17.5, moneyToFamiliesBn: 15.5, totalImmigrantsRefugeesBn: 30.5, lostToCorruptionBn: 8.8, foreignAidOdaBn: 18.5 },
  { year: '2025', total: 1714.1, socialProtection: 716.5, health: 229.7, educationResearch: 149.1, defence: 72.0, transportInfrastructure: 96.0, generalPublicServices: 138.8, interestPayments: 53.1, economicAffairsSubsidies: 90.8, other: 168.1, gdpPerCapitaUsd: 46100, laborProductivityIndex: 127.8, hdi: 0.930, immigrationWelfareBn: 16.5, moneyToFamiliesBn: 14.5, totalImmigrantsRefugeesBn: 28.5, lostToCorruptionBn: 9.0, foreignAidOdaBn: 17.8 },
] as const;

const FRANCE_POPULATION_MILLIONS = 67.75;

export function franceGovSpendRowForYear(year: number): FranceGovSpendingYearRow {
  return (
    FRANCE_GOV_SPENDING_SERIES.find((r) => Number(r.year) === year) ??
    FRANCE_GOV_SPENDING_SERIES[FRANCE_GOV_SPENDING_SERIES.length - 1]!
  );
}

/** Approximate nominal GDP (€bn) from per-capita USD for corruption % of GDP display. */
export function franceNominalGdpBnFromPerCapita(gdpPerCapitaUsd: number): number {
  return (gdpPerCapitaUsd * FRANCE_POPULATION_MILLIONS) / 1000;
}

export function franceCorruptionPctOfGdp(lostBnEur: number, gdpPerCapitaUsd: number): number {
  const gdpBn = franceNominalGdpBnFromPerCapita(gdpPerCapitaUsd);
  return gdpBn > 0 ? (lostBnEur / gdpBn) * 100 : 0;
}
