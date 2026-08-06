import type {
  MonthlyTradeRow,
  TradeKpi,
  TradePartnerRow,
  TradePieSlice,
  TradeSectionData,
  TradeTimeseriesRow,
} from '../../../components/countries/germany/GermanyTradeSection';
import type { ChartConfig } from '../../../components/ui/chart';
import { ITALY_TRADE_AGREEMENTS_DATA } from './italyTradeAgreements';

/** Italy — reusable foreign-trade data. Final 2025 figures are from Istat. */
export const ISTAT_URL = 'https://www.istat.it/wp-content/uploads/2026/02/Foreign-trade-and-Import-prices_December2025.pdf';
export const EUROSTAT_URL = 'https://ec.europa.eu/eurostat/web/international-trade-in-goods';
export const MERCOSUR_URL = 'https://policy.trade.ec.europa.eu/eu-trade-relationships-country-and-region/countries-and-regions/mercosur/eu-mercosur-agreement/factsheet-eu-mercosur-partnership-agreement-italy_en';
export const EU_US_URL = 'https://policy.trade.ec.europa.eu/news/joint-statement-united-states-european-union-framework-agreement-reciprocal-fair-and-balanced-trade-2025-08-21_en';

export const ITALY_KPIS: readonly TradeKpi[] = [
  { primary: '€643.1B', label: 'Exports (goods, 2025)', secondary: '+3.3% on 2024 · a new nominal record.' },
  { primary: '€592.3B', label: 'Imports (goods, 2025)', secondary: '+3.1% on 2024 · import prices fell 1.7%.' },
  { primary: '+€50.7B', label: 'Trade surplus (2025)', secondary: '+€97.7B excluding energy · energy deficit −€46.9B.' },
];

export const ITALY_TIMESERIES: readonly TradeTimeseriesRow[] = [
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

export const ITALY_MONTHLY: readonly MonthlyTradeRow[] = ITALY_TIMESERIES.map((row) => ({
  year: row.year,
  avgMonthlyExports: Math.round((row.exports / 12) * 10) / 10,
  avgMonthlyImports: Math.round((row.imports / 12) * 10) / 10,
  avgMonthlySurplus: Math.round((row.balance / 12) * 10) / 10,
}));

export const ITALY_PARTNER_BALANCE: readonly Record<string, string | number>[] = [
  { year: '2022', germany: -13.438, france: 14.082, usa: 40.217, china: -41.065, uk: 19.027, netherlands: -18.055 },
  { year: '2023', germany: -15.017, france: 16.834, usa: 42.093, china: -28.417, uk: 17.362, netherlands: -17.882 },
  { year: '2024', germany: -13.974, france: 16.582, usa: 38.870, china: -34.234, uk: 19.366, netherlands: -17.062 },
  { year: '2025', germany: -13.367, france: 17.594, usa: 34.191, china: -46.29, uk: 19.482, netherlands: -20.464 },
];

export const ITALY_PARTNER_CONFIG = {
  germany: { label: 'Germany (deficit)', color: 'hsl(0, 72%, 55%)' },
  france: { label: 'France (surplus)', color: 'hsl(199, 89%, 52%)' },
  usa: { label: 'USA (surplus)', color: 'hsl(142, 60%, 46%)' },
  china: { label: 'China (deficit)', color: 'hsl(14, 85%, 55%)' },
  uk: { label: 'UK (surplus)', color: 'hsl(38, 90%, 55%)' },
  netherlands: { label: 'Netherlands (deficit)', color: 'hsl(258, 55%, 62%)' },
} satisfies ChartConfig;

export const ITALY_MONTHLY_CONFIG = {
  avgMonthlyExports: { label: 'Avg monthly exports', color: 'hsl(199, 89%, 48%)' },
  avgMonthlyImports: { label: 'Avg monthly imports', color: 'hsl(215, 25%, 55%)' },
  avgMonthlySurplus: { label: 'Avg monthly balance', color: 'hsl(142, 71%, 45%)' },
} satisfies ChartConfig;

export const ITALY_TOP_PARTNERS: readonly TradePartnerRow[] = [
  { rank: 1, partner: 'Germany', volume: '~€157.6B' },
  { rank: 2, partner: 'France', volume: '~€112.3B' },
  { rank: 3, partner: 'United States', volume: '~€104.5B' },
  { rank: 4, partner: 'China', volume: '~€75.3B' },
  { rank: 5, partner: 'Spain', volume: '~€71.0B' },
];

/** Istat Main Industrial Groupings; shares are calculated on 2024 annual goods trade. */
export const ITALY_IMPORT_SLICES: readonly TradePieSlice[] = [
  { name: 'Intermediate goods', value: 34.6, detail: '34.6% of goods imports' },
  { name: 'Consumer non-durables', value: 25.7, detail: '25.7%' },
  { name: 'Capital goods', value: 24.0, detail: '24.0%' },
  { name: 'Energy', value: 12.5, detail: '12.5%' },
  { name: 'Consumer durables', value: 3.1, detail: '3.1%' },
];

/** Istat Main Industrial Groupings; shares are calculated on 2024 annual goods trade. */
export const ITALY_EXPORT_SLICES: readonly TradePieSlice[] = [
  { name: 'Consumer non-durables', value: 30.6, detail: '30.6% of goods exports' },
  { name: 'Capital goods', value: 30.3, detail: '30.3%' },
  { name: 'Intermediate goods', value: 29.9, detail: '29.9%' },
  { name: 'Consumer durables', value: 6.4, detail: '6.4%' },
  { name: 'Energy', value: 2.8, detail: '2.8%' },
];

/** Non-overlapping Istat regions combined into six readable chart groups. */
export const ITALY_GEO_EXPORT_SLICES: readonly TradePieSlice[] = [
  { name: 'EU27', value: 50.9, detail: '50.9% of goods exports' },
  { name: 'Non-EU Europe', value: 15.1, detail: '15.1%' },
  { name: 'Americas', value: 14.8, detail: '14.8%', notes: 'North America plus Central and South America' },
  { name: 'Asia & Middle East', value: 13.3, detail: '13.3%' },
  { name: 'Africa', value: 3.3, detail: '3.3%' },
  { name: 'Oceania & other', value: 2.6, detail: '2.6%' },
];

/** Non-overlapping Istat regions combined into six readable chart groups. */
export const ITALY_GEO_IMPORT_SLICES: readonly TradePieSlice[] = [
  { name: 'EU27', value: 56.8, detail: '56.8% of goods imports' },
  { name: 'Asia & Middle East', value: 20.8, detail: '20.8%' },
  { name: 'Non-EU Europe', value: 8.5, detail: '8.5%' },
  { name: 'Americas', value: 7.3, detail: '7.3%', notes: 'North America plus Central and South America' },
  { name: 'Africa', value: 6.3, detail: '6.3%' },
  { name: 'Oceania & other', value: 0.5, detail: '0.5%' },
];

/** Complete Italy override for both General Trade and Agreements. */
export const ITALY_GENERAL_TRADE = {
  kpis: ITALY_KPIS,
  timeseries: ITALY_TIMESERIES,
  timeseriesTitle: 'Italian goods-trade development',
  timeseriesDescription:
    'Goods, current-value billions of euros. Exports and imports use the left scale; trade balance uses the right scale. Historical series: Eurostat; latest annual totals: Istat.',
  partnerBalanceByYear: ITALY_PARTNER_BALANCE,
  partnerBalanceConfig: ITALY_PARTNER_CONFIG,
  partnerBalanceTitle: "Italy's trade balance with key partners",
  partnerBalanceDescription:
    'Official Istat annual balances, 2022–2025, in billions of euros (positive = Italian surplus; negative = Italian deficit).',
  monthlyPerformance: ITALY_MONTHLY,
  monthlyConfig: ITALY_MONTHLY_CONFIG,
  monthlyTitle: "Italy's average monthly trade performance",
  monthlyDescription:
    'Annual goods totals divided by 12: average monthly exports and imports (left scale, B€) and average monthly balance (right scale, B€).',
  topPartners: ITALY_TOP_PARTNERS,
  importSlices: ITALY_IMPORT_SLICES,
  exportSlices: ITALY_EXPORT_SLICES,
  geoExportSlices: ITALY_GEO_EXPORT_SLICES,
  geoImportSlices: ITALY_GEO_IMPORT_SLICES,
  importTitle: 'Imports by use group (2024 share)',
  exportTitle: 'Exports by use group (2024 share)',
  geoExportTitle: 'Export destinations by region (2024 share)',
  geoImportTitle: 'Import origins by region (2024 share)',
  importFootnote: 'Istat Main Industrial Groupings; total may differ by 0.1 point due to rounding.',
  exportFootnote: 'Istat Main Industrial Groupings; shares sum to 100%.',
  geoExportFootnote: 'Istat regions combined into six non-overlapping groups.',
  geoImportFootnote: 'Istat regions combined into six groups; total may vary slightly due to rounding.',
  railNote:
    'Partner totals are approximate reconstructions from Istat 2024 shares and 2025 growth rates; all balances and headline totals are published Istat figures.',
  railSourceUrl: ISTAT_URL,
  railSourceLabel: 'Istat annual release',
  summary:
    'Istat reports €643.055B of goods exports and €592.309B of imports in 2025, leaving a €50.746B surplus. The EU27 balance was −€5.501B, offset by a +€56.247B non-EU surplus. Excluding energy, the surplus reached €97.685B, implying a €46.939B energy deficit. Annual 2025 data are shown here without mixing in partial-year 2026 releases.',
  ...ITALY_TRADE_AGREEMENTS_DATA,
} satisfies Partial<TradeSectionData>;
