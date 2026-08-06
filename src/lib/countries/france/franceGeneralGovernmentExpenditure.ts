export type FranceGeneralGovExpenditureRow = {
  year: string;
  total: number;
};

export const FRANCE_GENERAL_GOVERNMENT_EXPENDITURE_SERIES: readonly FranceGeneralGovExpenditureRow[] = [
  { year: '2000', total: 738.4 },
  { year: '2001', total: 765.0 },
  { year: '2002', total: 799.5 },
  { year: '2003', total: 834.7 },
  { year: '2004', total: 870.8 },
  { year: '2005', total: 910.2 },
  { year: '2006', total: 948.6 },
  { year: '2007', total: 990.8 },
  { year: '2008', total: 1035.8 },
  { year: '2009', total: 1131.7 },
  { year: '2010', total: 1166.8 },
  { year: '2011', total: 1194.2 },
  { year: '2012', total: 1227.9 },
  { year: '2013', total: 1248.3 },
  { year: '2014', total: 1270.4 },
  { year: '2015', total: 1288.5 },
  { year: '2016', total: 1309.3 },
  { year: '2017', total: 1333.2 },
  { year: '2018', total: 1369.7 },
  { year: '2019', total: 1409.6 },
  { year: '2020', total: 1589.4 },
  { year: '2021', total: 1621.0 },
  { year: '2022', total: 1622.2 },
  { year: '2023', total: 1636.5 },
  { year: '2024', total: 1672.7 },
  { year: '2025', total: 1714.1 },
] as const;

export function franceGeneralGovExpenditureForYear(year: number): FranceGeneralGovExpenditureRow {
  return (
    FRANCE_GENERAL_GOVERNMENT_EXPENDITURE_SERIES.find((r) => Number(r.year) === year) ??
    FRANCE_GENERAL_GOVERNMENT_EXPENDITURE_SERIES.at(-1)!
  );
}
