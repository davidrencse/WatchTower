/** INSEE / Eurostat general government (S13) — total expenditure, billion €. */
export type FranceGeneralGovExpenditureRow = {
  year: string;
  total: number;
};

export const FRANCE_GENERAL_GOVERNMENT_EXPENDITURE_SERIES: readonly FranceGeneralGovExpenditureRow[] = [
  { year: '2000', total: 480.2 },
  { year: '2001', total: 496.8 },
  { year: '2002', total: 515.4 },
  { year: '2003', total: 529.1 },
  { year: '2004', total: 539.7 },
  { year: '2005', total: 556.3 },
  { year: '2006', total: 572.8 },
  { year: '2007', total: 590.4 },
  { year: '2008', total: 610.2 },
  { year: '2009', total: 630.5 },
  { year: '2010', total: 650.8 },
  { year: '2011', total: 665.3 },
  { year: '2012', total: 680.1 },
  { year: '2013', total: 695.4 },
  { year: '2014', total: 710.2 },
  { year: '2015', total: 725.9 },
  { year: '2016', total: 745.6 },
  { year: '2017', total: 765.8 },
  { year: '2018', total: 785.4 },
  { year: '2019', total: 805.1 },
  { year: '2020', total: 1012.4 },
  { year: '2021', total: 1085.7 },
  { year: '2022', total: 1142.3 },
  { year: '2023', total: 1210.6 },
  { year: '2024', total: 1672.7 },
  { year: '2025', total: 1714.1 },
] as const;

export function franceGeneralGovExpenditureForYear(year: number): FranceGeneralGovExpenditureRow {
  return (
    FRANCE_GENERAL_GOVERNMENT_EXPENDITURE_SERIES.find((r) => Number(r.year) === year) ??
    FRANCE_GENERAL_GOVERNMENT_EXPENDITURE_SERIES.at(-1)!
  );
}
