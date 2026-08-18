import type {
  AgreementInsight,
  FtaImpactRow,
  MonthlyTradeRow,
  TradeKpi,
  TradePartnerRow,
  TradePieSlice,
  TradeSectionData,
  TradeTimeseriesRow,
} from '../../../components/countries/germany/GermanyTradeSection';
import type { ChartConfig } from '../../../components/ui/chart';

/**
 * Spain — foreign trade in goods.
 *
 * The complete 2016–2025 series, sector shares, regional shares, and bilateral
 * balances come from Spain's December 2025 Foreign Trade Report. The Ministry
 * compiles it from DataComex using Spanish Customs and Excise Department data.
 * Values for 2025 are provisional, as marked by the official release.
 */
export const SPAIN_TRADE_REPORT_URL =
  'https://comercio.gob.es/ImportacionExportacion/Informes_Estadisticas/Historico_Informes/Mensuales/2025/2025-12_Informe_Mensual_Comercio_Exterior.pdf';

const EU_AGREEMENTS_URL =
  'https://policy.trade.ec.europa.eu/eu-trade-relationships-country-and-region/negotiations-and-agreements_en';
const SPAIN_MERCOSUR_URL = 'https://comercio.gob.es/PoliticaComercialUE/AcuerdosComerciales/Paginas/Mercosur.aspx';

const linkClass =
  'font-medium text-sky-400/95 underline decoration-sky-500/50 underline-offset-2 transition hover:text-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70';

const SPAIN_KPIS: readonly TradeKpi[] = [
  {
    primary: '€387.1B',
    label: 'Exports (goods, 2025)',
    secondary: '+0.7% on 2024 · provisional Customs/DataComex total.',
  },
  {
    primary: '€444.1B',
    label: 'Imports (goods, 2025)',
    secondary: '+4.6% on 2024 · capital-goods imports grew fastest.',
  },
  {
    primary: '−€57.1B',
    label: 'Trade deficit (2025)',
    secondary: '87.2% coverage · energy and non-energy trade were both in deficit.',
  },
];

const SPAIN_TIMESERIES: readonly TradeTimeseriesRow[] = [
  { year: '2016', exports: 256.3934, imports: 273.7786, balance: -17.3852 },
  { year: '2017', exports: 276.1429, imports: 302.4312, balance: -26.2883 },
  { year: '2018', exports: 285.2605, imports: 319.6473, balance: -34.3868 },
  { year: '2019', exports: 290.8928, imports: 322.4369, balance: -31.5441 },
  { year: '2020', exports: 263.6283, imports: 276.9251, balance: -13.2969 },
  { year: '2021', exports: 314.8585, imports: 346.2834, balance: -31.4249 },
  { year: '2022', exports: 387.599, imports: 459.2026, balance: -71.6036 },
  { year: '2023', exports: 384.0984, imports: 423.7234, balance: -39.625 },
  { year: '2024', exports: 384.4649, imports: 424.7407, balance: -40.2759 },
  { year: '2025', exports: 387.0916, imports: 444.1464, balance: -57.0547 },
];

const SPAIN_MONTHLY: readonly MonthlyTradeRow[] = SPAIN_TIMESERIES.map((row) => ({
  year: row.year,
  avgMonthlyExports: Math.round((row.exports / 12) * 10) / 10,
  avgMonthlyImports: Math.round((row.imports / 12) * 10) / 10,
  avgMonthlySurplus: Math.round((row.balance / 12) * 10) / 10,
}));

const SPAIN_PARTNER_BALANCE: readonly Record<string, string | number>[] = [
  {
    year: '2024',
    france: 20.8473,
    portugal: 15.8495,
    italy: 3.8088,
    germany: -8.229,
    usa: -10.0135,
    china: -37.7066,
  },
  {
    year: '2025',
    france: 17.3416,
    portugal: 17.3801,
    italy: -0.3929,
    germany: -10.9544,
    usa: -13.4584,
    china: -42.278,
  },
];

const SPAIN_PARTNER_CONFIG = {
  france: { label: 'France (surplus)', color: 'hsl(199, 89%, 52%)' },
  portugal: { label: 'Portugal (surplus)', color: 'hsl(142, 60%, 46%)' },
  italy: { label: 'Italy', color: 'hsl(258, 55%, 62%)' },
  germany: { label: 'Germany (deficit)', color: 'hsl(0, 72%, 55%)' },
  usa: { label: 'USA (deficit)', color: 'hsl(38, 90%, 55%)' },
  china: { label: 'China (deficit)', color: 'hsl(14, 85%, 55%)' },
} satisfies ChartConfig;

const SPAIN_MONTHLY_CONFIG = {
  avgMonthlyExports: { label: 'Avg. monthly exports', color: 'hsl(199, 89%, 48%)' },
  avgMonthlyImports: { label: 'Avg. monthly imports', color: 'hsl(215, 25%, 55%)' },
  avgMonthlySurplus: { label: 'Avg. monthly trade balance', color: 'hsl(0, 72%, 55%)' },
} satisfies ChartConfig;

const SPAIN_TOP_PARTNERS: readonly TradePartnerRow[] = [
  { rank: 1, partner: 'France', volume: '€94.2B' },
  { rank: 2, partner: 'Germany', volume: '€89.9B' },
  { rank: 3, partner: 'Italy', volume: '€63.8B' },
  { rank: 4, partner: 'China', volume: '€58.2B' },
  { rank: 5, partner: 'Portugal', volume: '€50.5B' },
];

const SPAIN_IMPORT_SLICES: readonly TradePieSlice[] = [
  { name: 'Capital goods', value: 23.7, detail: '23.7% of goods imports', notes: '+9.5% year on year' },
  { name: 'Chemicals', value: 16.2, detail: '16.2%', notes: '+6.0% year on year' },
  { name: 'Food, beverages & tobacco', value: 13.0, detail: '13.0%', notes: '+7.0% year on year' },
  { name: 'Energy products', value: 12.1, detail: '12.1%', notes: '−8.5% year on year' },
  { name: 'Consumer manufactures', value: 11.4, detail: '11.4%', notes: '+7.6% year on year' },
];

const SPAIN_EXPORT_SLICES: readonly TradePieSlice[] = [
  { name: 'Capital goods', value: 19.4, detail: '19.4% of goods exports', notes: '+0.8% year on year' },
  { name: 'Food, beverages & tobacco', value: 19.3, detail: '19.3%', notes: '+4.1% year on year' },
  { name: 'Chemicals', value: 17.1, detail: '17.1%', notes: '+5.2% year on year' },
  { name: 'Automotive sector', value: 12.8, detail: '12.8%', notes: '−7.1% year on year' },
  { name: 'Non-chemical semi-manufactures', value: 9.7, detail: '9.7%', notes: '+0.4% year on year' },
];

const SPAIN_GEO_EXPORT_SLICES: readonly TradePieSlice[] = [
  { name: 'Europe', value: 73.9, detail: '73.9% of goods exports', notes: 'EU27 alone: 61.8%' },
  { name: 'Americas', value: 9.9, detail: '9.9%' },
  { name: 'Asia', value: 8.1, detail: '8.1%' },
  { name: 'Africa', value: 5.8, detail: '5.8%' },
  { name: 'Other destinations', value: 1.7, detail: '1.7%', notes: 'Primarily provisioning trade' },
  { name: 'Oceania', value: 0.6, detail: '0.6%' },
];

const SPAIN_GEO_IMPORT_SLICES: readonly TradePieSlice[] = [
  { name: 'Europe', value: 56.6, detail: '56.6% of goods imports', notes: 'EU27 alone: 49.4%' },
  { name: 'Asia', value: 22.3, detail: '22.3%', notes: 'China alone: 11.3%' },
  { name: 'Americas', value: 13.0, detail: '13.0%' },
  { name: 'Africa', value: 7.9, detail: '7.9%' },
  { name: 'Oceania', value: 0.2, detail: '0.2%' },
];

const SPAIN_AGREEMENTS: readonly AgreementInsight[] = [
  {
    headerLead: 'Deep integration',
    headerSub: 'EU27 · goods & services',
    title: 'EU Single Market & Customs Union',
    tags: ['EU27', 'Customs union', 'Tariffs: 0%', 'Active'],
    summary:
      'Spain trades inside the EU customs union and Single Market, with no internal customs duties and common EU rules at the external border.',
    impact:
      'The EU27 received 61.8% of Spanish goods exports and supplied 49.4% of imports in 2025. Spain recorded a €19.8B intra-EU goods surplus.',
    status: 'Fully active · Spain has participated since joining the European Communities in 1986',
  },
  {
    headerLead: 'Post-Brexit trade',
    headerSub: 'TCA · in force May 2021',
    title: 'EU–UK Trade and Cooperation Agreement',
    tags: ['United Kingdom', 'TCA', 'Rules of origin', 'Active'],
    summary:
      'The TCA provides zero tariffs and zero quotas for qualifying goods, while customs declarations and origin requirements remain outside the Single Market.',
    impact:
      'Spain exported €24.9B of goods to the UK and imported €10.8B in 2025, producing a €14.2B Spanish surplus.',
    status: 'Active · preferential access with border formalities',
  },
  {
    headerLead: 'Southern neighbourhood',
    headerSub: 'Association Agreement · from 2000',
    title: 'EU–Morocco Free Trade Area',
    tags: ['Morocco', 'Industrial goods', 'Agriculture', 'Active'],
    summary:
      'The EU–Morocco Association Agreement liberalises industrial goods; a 2012 protocol expanded preferences for agricultural and fisheries trade.',
    impact:
      'Morocco was Spain’s largest African goods partner in 2025: €12.3B of exports, €10.4B of imports, and a €1.9B Spanish surplus.',
    status: 'Active · amended origin protocols provisionally applied from October 2025',
  },
  {
    headerLead: 'South America bloc',
    headerSub: 'Interim agreement · from May 2026',
    title: 'EU–Mercosur Interim Trade Agreement',
    tags: ['Mercosur', 'Tariff phase-downs', '59 Spanish GIs', 'Active'],
    summary:
      'Provisionally applied from 1 May 2026. The agreement phases down tariffs, opens services and procurement, and protects 59 Spanish geographical indications.',
    impact:
      'Spain’s 2025 pre-application baseline was €4.6B of exports and €9.9B of imports. The Spanish government estimates annual tariff savings near €500M.',
    status: 'Provisionally active · 2025 trade is the pre-agreement baseline',
  },
  {
    headerLead: 'Asia partnership',
    headerSub: 'EPA · in force February 2019',
    title: 'EU–Japan Economic Partnership Agreement',
    tags: ['Japan', 'EPA', 'Geographical indications', 'Active'],
    summary:
      'The EPA removes or phases down most tariffs and improves access for services, procurement, food, wine, machinery and other goods.',
    impact:
      'Spain exported €2.8B to Japan and imported €5.3B in 2025, leaving a €2.4B goods deficit and €8.1B in two-way trade.',
    status: 'Active · tariff reductions continue on staged lines',
  },
  {
    headerLead: 'Transatlantic FTA',
    headerSub: 'CETA · provisional since 2017',
    title: 'EU–Canada Comprehensive Economic and Trade Agreement',
    tags: ['Canada', 'CETA', 'Procurement', 'Provisional'],
    summary:
      'CETA provisionally applies most trade chapters, reducing tariffs and widening access to Canadian services and public procurement.',
    impact:
      'Spanish–Canadian goods trade reached €5.2B in 2025: €2.2B of exports and €2.9B of imports, a €0.7B Spanish deficit.',
    status: 'Provisionally active · full ratification remains incomplete',
  },
  {
    headerLead: 'Asia FTA',
    headerSub: 'In force · July 2011',
    title: 'EU–South Korea Free Trade Agreement',
    tags: ['South Korea', 'Industrial goods', 'Digital trade', 'Active'],
    summary:
      'The agreement removed most industrial tariffs and simplified customs. A complementary digital trade agreement was signed in June 2026.',
    impact:
      'Spain exported €2.0B to South Korea and imported €3.7B in 2025, for €5.7B of total goods trade and a €1.8B deficit.',
    status: 'FTA active · digital agreement signed and awaiting entry into force',
  },
];

const SPAIN_TRADE_REGIME_BALANCES: readonly FtaImpactRow[] = [
  { agreement: 'EU27 Single Market', netBenefit: 19.7619, jobsSupported: 458.3765 },
  { agreement: 'EU–UK TCA', netBenefit: 14.1648, jobsSupported: 35.7076 },
  { agreement: 'EU–Morocco', netBenefit: 1.9032, jobsSupported: 22.757 },
  { agreement: 'EU–Mercosur', netBenefit: -5.2763, jobsSupported: 14.5317 },
  { agreement: 'EU–Japan EPA', netBenefit: -2.4484, jobsSupported: 8.0749 },
  { agreement: 'CETA (Canada)', netBenefit: -0.6967, jobsSupported: 5.167 },
  { agreement: 'EU–South Korea', netBenefit: -1.7759, jobsSupported: 5.7224 },
];

const SPAIN_TRADE_NOTES = (
  <>
    <p>
      Official totals, product shares, regions, and partner balances:{' '}
      <a href={SPAIN_TRADE_REPORT_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
        Spain Ministry of Economy — December 2025 Foreign Trade Report
      </a>
      . The Ministry states that its tables come from DataComex using Spanish Customs and Excise data; 2025 values are
      provisional.
    </p>
    <p>
      Spain applies the EU common commercial policy. Agreement status:{' '}
      <a href={EU_AGREEMENTS_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
        European Commission agreements hub
      </a>
      {' · '}
      <a href={SPAIN_MERCOSUR_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
        Spain’s EU–Mercosur briefing
      </a>
      .
    </p>
    <p>
      The agreement comparison reports observed 2025 goods balances, not GDP gains caused by each agreement. Mercosur
      is a pre-application baseline because provisional application began on 1 May 2026. Product-level eligibility and
      origin rules should be checked in{' '}
      <a
        href="https://trade.ec.europa.eu/access-to-markets/en/home"
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        Access2Markets
      </a>
      .
    </p>
  </>
);

export const SPAIN_TRADE: TradeSectionData = {
  kpis: SPAIN_KPIS,
  timeseries: SPAIN_TIMESERIES,
  timeseriesTitle: 'Spanish foreign trade development',
  timeseriesDescription:
    'Declared goods trade, current-value billions of euros. Exports and imports use the left scale; the trade balance uses the right scale. 2025 values are provisional.',
  partnerBalanceByYear: SPAIN_PARTNER_BALANCE,
  partnerBalanceConfig: SPAIN_PARTNER_CONFIG,
  partnerBalanceTitle: "Spain's trade balance with key partners",
  partnerBalanceDescription:
    'Official bilateral goods balances for 2024–2025, in billions of euros (positive = Spanish surplus; negative = Spanish deficit).',
  monthlyPerformance: SPAIN_MONTHLY,
  monthlyConfig: SPAIN_MONTHLY_CONFIG,
  monthlyTitle: "Spain's average monthly trade performance",
  monthlyDescription:
    'Annual goods totals divided by 12: average monthly exports and imports (left scale, B€) and average monthly balance (right scale, B€).',
  topPartners: SPAIN_TOP_PARTNERS,
  importSlices: SPAIN_IMPORT_SLICES,
  exportSlices: SPAIN_EXPORT_SLICES,
  geoExportSlices: SPAIN_GEO_EXPORT_SLICES,
  geoImportSlices: SPAIN_GEO_IMPORT_SLICES,
  importTitle: 'Imports by economic sector (2025 share)',
  exportTitle: 'Exports by economic sector (2025 share)',
  geoExportTitle: 'Export destinations by region (2025 share)',
  geoImportTitle: 'Import origins by region (2025 share)',
  importFootnote: 'Official DataComex sector groups; five largest groups shown, with the remainder combined.',
  exportFootnote: 'Official DataComex sector groups; five largest groups shown, with the remainder combined.',
  geoExportFootnote: 'Official annual regional shares; six non-overlapping destination groups sum to 100%.',
  geoImportFootnote: 'Official annual regional shares; values sum to 100% after rounding.',
  railNote: 'Partner totals are exports plus imports from the official 2025 country table.',
  railSourceUrl: SPAIN_TRADE_REPORT_URL,
  railSourceLabel: 'DataComex / Spanish Customs',
  summary:
    'Spain exported €387.1B and imported €444.1B of goods in 2025, leaving a €57.1B deficit and an 87.2% coverage ratio. The energy deficit was €29.3B; non-energy trade contributed a further €27.8B deficit. The EU27 remained the core market, taking 61.8% of exports and supplying 49.4% of imports. France was the largest two-way partner (€94.2B), while China produced the largest bilateral deficit (−€42.3B).',
  agreements: SPAIN_AGREEMENTS,
  ftaImpacts: SPAIN_TRADE_REGIME_BALANCES,
  ftaTitle: 'Observed Spanish goods balances under selected trade regimes (2025)',
  ftaDescription:
    'Official goods balances in billions of euros—not causal estimates of agreement effects. Hover for total two-way trade; Mercosur is the pre-application baseline.',
  ftaSeriesLabel: 'Observed goods balance (B€)',
  ftaValueFormatter: (value) => `${value >= 0 ? '+' : ''}${value.toFixed(1)} B€`,
  ftaSecondaryFormatter: (value) => `${value.toFixed(1)} B€ total trade`,
  notes: SPAIN_TRADE_NOTES,
};
