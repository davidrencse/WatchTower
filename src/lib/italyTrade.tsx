import type { AgreementInsight, FtaImpactRow, MonthlyTradeRow, TradeKpi, TradePartnerRow, TradePieSlice, TradeSectionData, TradeTimeseriesRow } from '../components/GermanyTradeSection';
import type { ChartConfig } from '../components/ui/chart';

/** Italy — foreign trade in goods. Final 2025 figures are from Istat. */
const ISTAT_URL = 'https://www.istat.it/wp-content/uploads/2026/02/Foreign-trade-and-Import-prices_December2025.pdf';
const EUROSTAT_URL = 'https://ec.europa.eu/eurostat/web/international-trade-in-goods';
const MERCOSUR_URL = 'https://policy.trade.ec.europa.eu/eu-trade-relationships-country-and-region/countries-and-regions/mercosur/eu-mercosur-agreement/factsheet-eu-mercosur-partnership-agreement-italy_en';
const EU_US_URL = 'https://policy.trade.ec.europa.eu/news/joint-statement-united-states-european-union-framework-agreement-reciprocal-fair-and-balanced-trade-2025-08-21_en';

const ITALY_KPIS: readonly TradeKpi[] = [
  { primary: '€643.1B', label: 'Exports (goods, 2025)', secondary: '+3.3% on 2024 · a new nominal record.' },
  { primary: '€592.3B', label: 'Imports (goods, 2025)', secondary: '+3.1% on 2024 · import prices fell 1.7%.' },
  { primary: '+€50.7B', label: 'Trade surplus (2025)', secondary: '+€97.7B excluding energy · energy deficit −€46.9B.' },
];

const ITALY_TIMESERIES: readonly TradeTimeseriesRow[] = [
  { year: '2000', exports: 260.4, imports: 258.5, balance: 1.9 },
  { year: '2002', exports: 269.1, imports: 261.2, balance: 7.9 },
  { year: '2004', exports: 284.4, imports: 290.2, balance: -5.8 },
  { year: '2006', exports: 332.0, imports: 352.5, balance: -20.5 },
  { year: '2008', exports: 369.0, imports: 382.1, balance: -13.1 },
  { year: '2009', exports: 291.7, imports: 297.6, balance: -5.9 },
  { year: '2010', exports: 337.3, imports: 367.4, balance: -30.1 },
  { year: '2011', exports: 375.9, imports: 401.4, balance: -25.5 },
  { year: '2012', exports: 390.2, imports: 380.3, balance: 9.9 },
  { year: '2013', exports: 390.2, imports: 361.0, balance: 29.2 },
  { year: '2014', exports: 398.9, imports: 356.9, balance: 42.0 },
  { year: '2015', exports: 412.3, imports: 370.5, balance: 41.8 },
  { year: '2016', exports: 417.3, imports: 365.6, balance: 51.7 },
  { year: '2017', exports: 449.1, imports: 401.5, balance: 47.6 },
  { year: '2018', exports: 465.3, imports: 426.0, balance: 39.3 },
  { year: '2019', exports: 480.4, imports: 424.2, balance: 56.2 },
  { year: '2020', exports: 433.6, imports: 370.5, balance: 63.1 },
  { year: '2021', exports: 516.3, imports: 472.9, balance: 43.4 },
  { year: '2022', exports: 624.7, imports: 655.5, balance: -30.8 },
  { year: '2023', exports: 626.2, imports: 592.2, balance: 34.0 },
  { year: '2024', exports: 622.5, imports: 574.2, balance: 48.3 },
  { year: '2025', exports: 643.1, imports: 592.3, balance: 50.7 },
];

const ITALY_MONTHLY: readonly MonthlyTradeRow[] = ITALY_TIMESERIES.map((row) => ({
  year: row.year,
  avgMonthlyExports: Math.round((row.exports / 12) * 10) / 10,
  avgMonthlyImports: Math.round((row.imports / 12) * 10) / 10,
  avgMonthlySurplus: Math.round((row.balance / 12) * 10) / 10,
}));

const ITALY_PARTNER_BALANCE: readonly Record<string, string | number>[] = [
  { year: '2015', germany: -9.8, france: 10.2, usa: 21.4, china: -18.7, uk: 11.8, netherlands: -10.4 },
  { year: '2018', germany: -12.1, france: 12.9, usa: 25.6, china: -21.5, uk: 13.2, netherlands: -12.7 },
  { year: '2020', germany: -11.0, france: 11.6, usa: 24.1, china: -24.8, uk: 12.5, netherlands: -13.6 },
  { year: '2021', germany: -12.8, france: 13.7, usa: 28.5, china: -30.4, uk: 14.2, netherlands: -15.2 },
  { year: '2022', germany: -18.4, france: 12.1, usa: 31.8, china: -41.2, uk: 15.7, netherlands: -22.6 },
  { year: '2023', germany: -14.9, france: 15.6, usa: 32.7, china: -39.5, uk: 17.4, netherlands: -18.9 },
  { year: '2024', germany: -13.1, france: 16.3, usa: 31.5, china: -38.9, uk: 18.6, netherlands: -18.7 },
  { year: '2025', germany: -13.367, france: 17.594, usa: 34.191, china: -46.29, uk: 19.482, netherlands: -20.464 },
];

const ITALY_PARTNER_CONFIG = {
  germany: { label: 'Germany (deficit)', color: 'hsl(0, 72%, 55%)' },
  france: { label: 'France (surplus)', color: 'hsl(199, 89%, 52%)' },
  usa: { label: 'USA (surplus)', color: 'hsl(142, 60%, 46%)' },
  china: { label: 'China (deficit)', color: 'hsl(14, 85%, 55%)' },
  uk: { label: 'UK (surplus)', color: 'hsl(38, 90%, 55%)' },
  netherlands: { label: 'Netherlands (deficit)', color: 'hsl(258, 55%, 62%)' },
} satisfies ChartConfig;

const ITALY_MONTHLY_CONFIG = {
  avgMonthlyExports: { label: 'Avg monthly exports', color: 'hsl(199, 89%, 48%)' },
  avgMonthlyImports: { label: 'Avg monthly imports', color: 'hsl(215, 25%, 55%)' },
  avgMonthlySurplus: { label: 'Avg monthly balance', color: 'hsl(142, 71%, 45%)' },
} satisfies ChartConfig;
