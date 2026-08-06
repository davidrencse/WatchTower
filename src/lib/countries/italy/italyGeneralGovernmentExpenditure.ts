export type ItalyGeneralGovExpenditureRow = {
  year: string;
  total: number;
};

/**
 * Italy — total general government (S13) expenditure, € billions, current prices.
 * Source: Eurostat gov_10a_exp COFOG total (na_item TE), extracted 21 Jul 2026.
 * 2000–2024 are published figures; 2025 is a provisional estimate. These totals are
 * the sum of the COFOG functions in `italyGovernmentExpenditureByCategory.ts`, so the
 * total-expenditure chart and the by-category section reconcile.
 */
export const ITALY_GENERAL_GOVERNMENT_EXPENDITURE_SERIES: readonly ItalyGeneralGovExpenditureRow[] = [
  { year: '2000', total: 577.2 },
  { year: '2001', total: 616.8 },
  { year: '2002', total: 630.2 },
  { year: '2003', total: 657.3 },
  { year: '2004', total: 680.1 },
  { year: '2005', total: 705.4 },
  { year: '2006', total: 741.9 },
  { year: '2007', total: 755.7 },
  { year: '2008', total: 784.9 },
  { year: '2009', total: 808.7 },
  { year: '2010', total: 805.7 },
  { year: '2011', total: 812.5 },
  { year: '2012', total: 824.3 },
  { year: '2013', total: 825.2 },
  { year: '2014', total: 829.6 },
  { year: '2015', total: 835.7 },
  { year: '2016', total: 835.0 },
  { year: '2017', total: 851.0 },
  { year: '2018', total: 859.0 },
  { year: '2019', total: 873.6 },
  { year: '2020', total: 948.3 },
  { year: '2021', total: 1032.5 },
  { year: '2022', total: 1097.6 },
  { year: '2023', total: 1149.2 },
  { year: '2024', total: 1109.2 },
  { year: '2025', total: 1129.5 },
] as const;
