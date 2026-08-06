export type ItalyFiscalSupportYearRow = {
  year: number;
  immigrationWelfareBn: number;
  moneyToFamiliesBn: number;
  totalImmigrantsRefugeesBn: number;
  lostToCorruptionMn: number;
  foreignAidOdaBn: number;
};

/**
 * Italy fiscal-support series.
 *
 * WARNING — these are MODELED figures, not published Italian statistics. The series
 * is a smooth hand-built trend with no underlying source: Italy publishes no
 * consolidated annual series for immigration welfare spending, for money lost to
 * corruption in the immigration and asylum systems, or for these ODA totals on a
 * comparable basis. The dashboard tiles that read from this file render an explicit
 * "Modeled estimate" note and carry no source link (see `ItalyModelledEstimateNote`
 * in CountryGovSpendingSection). Replace with sourced Istat / MEF / OECD-DAC series
 * before treating any of it as fact.
 *
 * Spending and ODA are billion euros; corruption estimates are million euros.
 */
export const ITALY_FISCAL_SUPPORT_BY_YEAR: readonly ItalyFiscalSupportYearRow[] = [
  { year: 2000, immigrationWelfareBn: 1.2, moneyToFamiliesBn: 0.6, totalImmigrantsRefugeesBn: 0.3, lostToCorruptionMn: 20, foreignAidOdaBn: 3.2 },
  { year: 2001, immigrationWelfareBn: 1.5, moneyToFamiliesBn: 0.7, totalImmigrantsRefugeesBn: 0.4, lostToCorruptionMn: 30, foreignAidOdaBn: 3.5 },
  { year: 2002, immigrationWelfareBn: 1.8, moneyToFamiliesBn: 0.8, totalImmigrantsRefugeesBn: 0.5, lostToCorruptionMn: 40, foreignAidOdaBn: 3.8 },
  { year: 2003, immigrationWelfareBn: 2.1, moneyToFamiliesBn: 0.9, totalImmigrantsRefugeesBn: 0.6, lostToCorruptionMn: 50, foreignAidOdaBn: 4.1 },
  { year: 2004, immigrationWelfareBn: 2.4, moneyToFamiliesBn: 1.0, totalImmigrantsRefugeesBn: 0.7, lostToCorruptionMn: 60, foreignAidOdaBn: 4.3 },
  { year: 2005, immigrationWelfareBn: 2.7, moneyToFamiliesBn: 1.1, totalImmigrantsRefugeesBn: 0.8, lostToCorruptionMn: 70, foreignAidOdaBn: 4.5 },
  { year: 2006, immigrationWelfareBn: 3.0, moneyToFamiliesBn: 1.2, totalImmigrantsRefugeesBn: 0.9, lostToCorruptionMn: 80, foreignAidOdaBn: 4.7 },
  { year: 2007, immigrationWelfareBn: 3.4, moneyToFamiliesBn: 1.3, totalImmigrantsRefugeesBn: 1.0, lostToCorruptionMn: 90, foreignAidOdaBn: 4.9 },
  { year: 2008, immigrationWelfareBn: 3.8, moneyToFamiliesBn: 1.4, totalImmigrantsRefugeesBn: 1.2, lostToCorruptionMn: 100, foreignAidOdaBn: 5.0 },
  { year: 2009, immigrationWelfareBn: 4.1, moneyToFamiliesBn: 1.5, totalImmigrantsRefugeesBn: 1.3, lostToCorruptionMn: 110, foreignAidOdaBn: 5.0 },
  { year: 2010, immigrationWelfareBn: 4.5, moneyToFamiliesBn: 1.6, totalImmigrantsRefugeesBn: 1.5, lostToCorruptionMn: 120, foreignAidOdaBn: 5.1 },
  { year: 2011, immigrationWelfareBn: 5.0, moneyToFamiliesBn: 1.8, totalImmigrantsRefugeesBn: 1.7, lostToCorruptionMn: 130, foreignAidOdaBn: 5.2 },
  { year: 2012, immigrationWelfareBn: 5.4, moneyToFamiliesBn: 2.0, totalImmigrantsRefugeesBn: 1.9, lostToCorruptionMn: 140, foreignAidOdaBn: 5.0 },
  { year: 2013, immigrationWelfareBn: 5.8, moneyToFamiliesBn: 2.1, totalImmigrantsRefugeesBn: 2.1, lostToCorruptionMn: 150, foreignAidOdaBn: 4.8 },
  { year: 2014, immigrationWelfareBn: 6.3, moneyToFamiliesBn: 2.3, totalImmigrantsRefugeesBn: 2.4, lostToCorruptionMn: 160, foreignAidOdaBn: 4.9 },
  { year: 2015, immigrationWelfareBn: 7.0, moneyToFamiliesBn: 2.5, totalImmigrantsRefugeesBn: 2.7, lostToCorruptionMn: 180, foreignAidOdaBn: 5.0 },
  { year: 2016, immigrationWelfareBn: 7.8, moneyToFamiliesBn: 2.7, totalImmigrantsRefugeesBn: 3.1, lostToCorruptionMn: 200, foreignAidOdaBn: 5.0 },
  { year: 2017, immigrationWelfareBn: 8.5, moneyToFamiliesBn: 3.0, totalImmigrantsRefugeesBn: 3.5, lostToCorruptionMn: 220, foreignAidOdaBn: 5.1 },
  { year: 2018, immigrationWelfareBn: 9.0, moneyToFamiliesBn: 3.2, totalImmigrantsRefugeesBn: 3.9, lostToCorruptionMn: 240, foreignAidOdaBn: 5.2 },
  { year: 2019, immigrationWelfareBn: 9.5, moneyToFamiliesBn: 3.4, totalImmigrantsRefugeesBn: 4.2, lostToCorruptionMn: 260, foreignAidOdaBn: 5.3 },
  { year: 2020, immigrationWelfareBn: 8.8, moneyToFamiliesBn: 3.1, totalImmigrantsRefugeesBn: 3.8, lostToCorruptionMn: 220, foreignAidOdaBn: 5.5 },
  { year: 2021, immigrationWelfareBn: 9.2, moneyToFamiliesBn: 3.3, totalImmigrantsRefugeesBn: 4.0, lostToCorruptionMn: 230, foreignAidOdaBn: 5.6 },
  { year: 2022, immigrationWelfareBn: 10.0, moneyToFamiliesBn: 3.6, totalImmigrantsRefugeesBn: 4.5, lostToCorruptionMn: 260, foreignAidOdaBn: 5.8 },
  { year: 2023, immigrationWelfareBn: 10.8, moneyToFamiliesBn: 3.9, totalImmigrantsRefugeesBn: 4.9, lostToCorruptionMn: 280, foreignAidOdaBn: 6.0 },
  { year: 2024, immigrationWelfareBn: 11.5, moneyToFamiliesBn: 4.1, totalImmigrantsRefugeesBn: 5.3, lostToCorruptionMn: 300, foreignAidOdaBn: 6.2 },
  { year: 2025, immigrationWelfareBn: 12.2, moneyToFamiliesBn: 4.3, totalImmigrantsRefugeesBn: 5.7, lostToCorruptionMn: 320, foreignAidOdaBn: 6.5 },
] as const;

export function italyFiscalSupportRowForYear(year: number): ItalyFiscalSupportYearRow {
  return (
    ITALY_FISCAL_SUPPORT_BY_YEAR.find((row) => row.year === year) ??
    ITALY_FISCAL_SUPPORT_BY_YEAR[ITALY_FISCAL_SUPPORT_BY_YEAR.length - 1]!
  );
}
