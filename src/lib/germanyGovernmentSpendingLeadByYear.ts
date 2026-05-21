export type GermanyGovSpendingLeadYearRow = {
  year: number;
  immigrationWelfareBn: number;
  moneyToFamiliesBn: number;
  totalImmigrantsRefugeesBn: number;
  foreignAidOdaBn: number;
};

/** Immigration welfare, family transfers, immigrant/refugee totals, and ODA (billion €). */
export const GERMANY_GOV_SPENDING_LEAD_BY_YEAR: readonly GermanyGovSpendingLeadYearRow[] = [
  { year: 2000, immigrationWelfareBn: 2.1, moneyToFamiliesBn: 1.8, totalImmigrantsRefugeesBn: 4.5, foreignAidOdaBn: 5.2 },
  { year: 2001, immigrationWelfareBn: 2.3, moneyToFamiliesBn: 2.0, totalImmigrantsRefugeesBn: 5.0, foreignAidOdaBn: 5.4 },
  { year: 2002, immigrationWelfareBn: 2.4, moneyToFamiliesBn: 2.1, totalImmigrantsRefugeesBn: 5.2, foreignAidOdaBn: 5.6 },
  { year: 2003, immigrationWelfareBn: 2.6, moneyToFamiliesBn: 2.3, totalImmigrantsRefugeesBn: 5.6, foreignAidOdaBn: 5.8 },
  { year: 2004, immigrationWelfareBn: 2.8, moneyToFamiliesBn: 2.5, totalImmigrantsRefugeesBn: 6.0, foreignAidOdaBn: 6.1 },
  { year: 2005, immigrationWelfareBn: 3.1, moneyToFamiliesBn: 2.7, totalImmigrantsRefugeesBn: 6.5, foreignAidOdaBn: 6.5 },
  { year: 2006, immigrationWelfareBn: 3.4, moneyToFamiliesBn: 3.0, totalImmigrantsRefugeesBn: 7.1, foreignAidOdaBn: 7.0 },
  { year: 2007, immigrationWelfareBn: 3.8, moneyToFamiliesBn: 3.4, totalImmigrantsRefugeesBn: 8.0, foreignAidOdaBn: 7.5 },
  { year: 2008, immigrationWelfareBn: 4.2, moneyToFamiliesBn: 3.8, totalImmigrantsRefugeesBn: 8.8, foreignAidOdaBn: 8.0 },
  { year: 2009, immigrationWelfareBn: 4.5, moneyToFamiliesBn: 4.1, totalImmigrantsRefugeesBn: 9.5, foreignAidOdaBn: 8.5 },
  { year: 2010, immigrationWelfareBn: 4.8, moneyToFamiliesBn: 4.4, totalImmigrantsRefugeesBn: 10.2, foreignAidOdaBn: 9.0 },
  { year: 2011, immigrationWelfareBn: 5.2, moneyToFamiliesBn: 4.8, totalImmigrantsRefugeesBn: 11.0, foreignAidOdaBn: 9.5 },
  { year: 2012, immigrationWelfareBn: 5.6, moneyToFamiliesBn: 5.2, totalImmigrantsRefugeesBn: 12.0, foreignAidOdaBn: 10.2 },
  { year: 2013, immigrationWelfareBn: 6.1, moneyToFamiliesBn: 5.7, totalImmigrantsRefugeesBn: 13.2, foreignAidOdaBn: 11.0 },
  { year: 2014, immigrationWelfareBn: 7.5, moneyToFamiliesBn: 7.0, totalImmigrantsRefugeesBn: 16.5, foreignAidOdaBn: 12.5 },
  { year: 2015, immigrationWelfareBn: 21.0, moneyToFamiliesBn: 18.5, totalImmigrantsRefugeesBn: 35.0, foreignAidOdaBn: 14.8 },
  { year: 2016, immigrationWelfareBn: 22.0, moneyToFamiliesBn: 19.5, totalImmigrantsRefugeesBn: 36.5, foreignAidOdaBn: 17.5 },
  { year: 2017, immigrationWelfareBn: 21.3, moneyToFamiliesBn: 19.0, totalImmigrantsRefugeesBn: 35.8, foreignAidOdaBn: 18.2 },
  { year: 2018, immigrationWelfareBn: 19.5, moneyToFamiliesBn: 17.5, totalImmigrantsRefugeesBn: 32.5, foreignAidOdaBn: 19.5 },
  { year: 2019, immigrationWelfareBn: 18.0, moneyToFamiliesBn: 16.0, totalImmigrantsRefugeesBn: 30.0, foreignAidOdaBn: 20.8 },
  { year: 2020, immigrationWelfareBn: 19.5, moneyToFamiliesBn: 17.0, totalImmigrantsRefugeesBn: 32.0, foreignAidOdaBn: 18.5 },
  { year: 2021, immigrationWelfareBn: 22.0, moneyToFamiliesBn: 19.0, totalImmigrantsRefugeesBn: 35.0, foreignAidOdaBn: 19.8 },
  { year: 2022, immigrationWelfareBn: 28.0, moneyToFamiliesBn: 24.0, totalImmigrantsRefugeesBn: 42.0, foreignAidOdaBn: 21.5 },
  { year: 2023, immigrationWelfareBn: 29.7, moneyToFamiliesBn: 25.5, totalImmigrantsRefugeesBn: 45.0, foreignAidOdaBn: 20.2 },
  { year: 2024, immigrationWelfareBn: 24.5, moneyToFamiliesBn: 21.0, totalImmigrantsRefugeesBn: 38.0, foreignAidOdaBn: 18.5 },
  { year: 2025, immigrationWelfareBn: 19.5, moneyToFamiliesBn: 17.0, totalImmigrantsRefugeesBn: 32.0, foreignAidOdaBn: 17.8 },
] as const;

export function germanyGovSpendingLeadRowForYear(year: number): GermanyGovSpendingLeadYearRow {
  return (
    GERMANY_GOV_SPENDING_LEAD_BY_YEAR.find((r) => r.year === year) ??
    GERMANY_GOV_SPENDING_LEAD_BY_YEAR[GERMANY_GOV_SPENDING_LEAD_BY_YEAR.length - 1]!
  );
}
