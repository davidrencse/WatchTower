export type SpainGeneralGovExpenditureRow = {
  year: string;
  total: number;
};

/**
 * Spain - total general government (S13) expenditure, EUR billions, current prices.
 * Source: Eurostat `gov_10a_main`, na_item TE, sector S13, unit MIO_EUR (pulled from the
 * Eurostat dissemination API on 10 Aug 2026; table last updated 21 Jul 2026).
 *
 * 2000-2024 are published figures (2024 flagged provisional by Eurostat). 2025 is also a
 * published `gov_10a_main` figure - unlike the COFOG breakdown in
 * `spainGovernmentExpenditureByCategory.ts`, which Eurostat has not yet released for 2025.
 * For 2000-2024 this series equals the COFOG total exactly, so the total-expenditure chart
 * and the by-category section reconcile.
 */
export const SPAIN_GENERAL_GOVERNMENT_EXPENDITURE_SERIES: readonly SpainGeneralGovExpenditureRow[] = [
  { year: '2000', total: 253.267 },
  { year: '2001', total: 269.195 },
  { year: '2002', total: 289.527 },
  { year: '2003', total: 307.796 },
  { year: '2004', total: 333.666 },
  { year: '2005', total: 356.785 },
  { year: '2006', total: 385.757 },
  { year: '2007', total: 422.164 },
  { year: '2008', total: 459.813 },
  { year: '2009', total: 494.353 },
  { year: '2010', total: 493.817 },
  { year: '2011', total: 490.908 },
  { year: '2012', total: 509.936 },
  { year: '2013', total: 473.398 },
  { year: '2014', total: 467.841 },
  { year: '2015', total: 474.893 },
  { year: '2016', total: 472.717 },
  { year: '2017', total: 479.908 },
  { year: '2018', total: 503.193 },
  { year: '2019', total: 526.769 },
  { year: '2020', total: 580.164 },
  { year: '2021', total: 611.124 },
  { year: '2022', total: 637.117 },
  { year: '2023', total: 680.225 },
  { year: '2024', total: 725.001 },
  { year: '2025', total: 764.884 },
] as const;
