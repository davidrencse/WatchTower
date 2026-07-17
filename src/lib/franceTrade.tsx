import type {
  AgreementInsight,
  FtaImpactRow,
  MonthlyTradeRow,
  TradeKpi,
  TradePartnerRow,
  TradePieSlice,
  TradeSectionData,
  TradeTimeseriesRow,
} from '../components/GermanyTradeSection';
import type { ChartConfig } from '../components/ui/chart';

/**
 * France — foreign trade.
 *
 * Sourced (DG Trésor "Résultats du commerce extérieur" 2024 & 2025, Douanes):
 *  - 2025: exports €614.7B (+2.5%), imports €683.9B (+0.7%), deficit −€69.2B.
 *  - 2024: −€79.3B; 2023: −€98.4B; 2022: −€162.6B (energy shock).
 *  - 2025 energy bill €44.2B (−€11.2B). Aero/space surplus record +€32.6B (exports +18.3%).
 *    Agri-food surplus at historic low +€0.2B.
 *  - 2024 sector balances: aero +€28.7B, perfumes/cosmetics record +€17.3B,
 *    wine & spirits +€13.0B, electricity record +€5.1B, pharma +€4.3B, chemicals +€3.6B.
 *  - 2024 partners: Germany exports €86.7B (13.7%) / imports €97.6B (18.7%), balance −€10.9B;
 *    Italy exports €56.6B (8.9%), balance +€2.3B; Belgium €51.6B (8.1%); Spain €48.1B (7.6%);
 *    China imports €71B (13.6%) / exports €24B, balance −€47B.
 *  - US tariffs from Aug 2025 hit Q4 exports: spirits −47%, wine −39%, perfumes/cosmetics −25%.
 *
 * Estimated (flagged in UI): pre-2023 export/import levels and bilateral balance series are
 * reconstructed to match published balances; product and regional shares are approximations.
 */

const FRANCE_KPIS: readonly TradeKpi[] = [
  {
    primary: '€614.7B',
    label: 'Exports (goods, 2025)',
    secondary: '+2.5% on 2024 · DG Trésor / Douanes goods trade.',
  },
  {
    primary: '€683.9B',
    label: 'Imports (goods, 2025)',
    secondary: '+0.7% on 2024 · energy bill down to €44.2B.',
  },
  {
    primary: '−€69.2B',
    label: 'Trade deficit (2025)',
    secondary: 'Third straight narrowing: −162.6B (2022) → −98.4B → −79.3B → −69.2B.',
  },
];

/** Balances 2022–2025 are published; earlier years approximate the douanes FAB-FAB series. */
const FRANCE_TIMESERIES: readonly TradeTimeseriesRow[] = [
  { year: '2000', exports: 325.0, imports: 325.6, balance: -0.6 },
  { year: '2001', exports: 337.0, imports: 333.5, balance: 3.5 },
  { year: '2002', exports: 332.0, imports: 324.5, balance: 7.5 },
  { year: '2003', exports: 327.0, imports: 325.5, balance: 1.5 },
  { year: '2004', exports: 344.0, imports: 349.0, balance: -5.0 },
  { year: '2005', exports: 356.0, imports: 380.2, balance: -24.2 },
  { year: '2006', exports: 384.0, imports: 416.0, balance: -32.0 },
  { year: '2007', exports: 401.0, imports: 443.0, balance: -42.0 },
  { year: '2008', exports: 418.0, imports: 474.2, balance: -56.2 },
  { year: '2009', exports: 347.0, imports: 392.0, balance: -45.0 },
  { year: '2010', exports: 395.0, imports: 447.4, balance: -52.4 },
  { year: '2011', exports: 428.0, imports: 502.5, balance: -74.5 },
  { year: '2012', exports: 443.0, imports: 510.2, balance: -67.2 },
  { year: '2013', exports: 437.0, imports: 498.3, balance: -61.3 },
  { year: '2014', exports: 437.0, imports: 495.3, balance: -58.3 },
  { year: '2015', exports: 455.0, imports: 500.7, balance: -45.7 },
  { year: '2016', exports: 453.0, imports: 501.3, balance: -48.3 },
  { year: '2017', exports: 473.0, imports: 531.9, balance: -58.9 },
  { year: '2018', exports: 492.0, imports: 554.9, balance: -62.9 },
  { year: '2019', exports: 508.0, imports: 566.9, balance: -58.9 },
  { year: '2020', exports: 435.0, imports: 499.9, balance: -64.9 },
  { year: '2021', exports: 490.0, imports: 575.0, balance: -85.0 },
  { year: '2022', exports: 594.0, imports: 756.6, balance: -162.6 },
  { year: '2023', exports: 606.8, imports: 705.2, balance: -98.4 },
  { year: '2024', exports: 599.6, imports: 678.9, balance: -79.3 },
  { year: '2025', exports: 614.7, imports: 683.9, balance: -69.2 },
];

const FRANCE_MONTHLY: readonly MonthlyTradeRow[] = FRANCE_TIMESERIES.map((r) => ({
  year: r.year,
  avgMonthlyExports: Math.round((r.exports / 12) * 10) / 10,
  avgMonthlyImports: Math.round((r.imports / 12) * 10) / 10,
  avgMonthlySurplus: Math.round((r.balance / 12) * 10) / 10,
}));

/** 2024 anchors published (Germany −10.9, Italy +2.3, China −47); earlier years approximate. */
const FRANCE_PARTNER_BALANCE: readonly Record<string, string | number>[] = [
  { year: '2000', germany: -6.5, china: -8.0, usa: 6.8, italy: 1.2, belgium: -3.4, uk: 9.6 },
  { year: '2005', germany: -11.2, china: -17.5, usa: 4.2, italy: -0.8, belgium: -5.1, uk: 8.1 },
  { year: '2010', germany: -16.4, china: -27.0, usa: 2.1, italy: -1.6, belgium: -6.8, uk: 6.4 },
  { year: '2015', germany: -14.8, china: -30.4, usa: 5.6, italy: -0.4, belgium: -7.2, uk: 10.2 },
  { year: '2016', germany: -15.6, china: -31.8, usa: 5.1, italy: -0.7, belgium: -7.5, uk: 10.8 },
  { year: '2017', germany: -16.9, china: -34.2, usa: 4.6, italy: -1.2, belgium: -7.9, uk: 11.4 },
  { year: '2018', germany: -17.8, china: -36.5, usa: 4.1, italy: -1.5, belgium: -8.3, uk: 11.9 },
  { year: '2019', germany: -16.2, china: -37.8, usa: 5.3, italy: -0.9, belgium: -8.1, uk: 12.4 },
  { year: '2020', germany: -13.4, china: -39.6, usa: 3.8, italy: -0.6, belgium: -7.4, uk: 10.1 },
  { year: '2021', germany: -14.9, china: -43.2, usa: 4.9, italy: -0.2, belgium: -8.6, uk: 11.2 },
  { year: '2022', germany: -18.6, china: -48.5, usa: 3.2, italy: -2.8, belgium: -10.4, uk: 12.8 },
  { year: '2023', germany: -13.2, china: -47.3, usa: 6.4, italy: 1.1, belgium: -8.9, uk: 13.6 },
  { year: '2024', germany: -10.9, china: -47.0, usa: 7.1, italy: 2.3, belgium: -8.2, uk: 14.1 },
  { year: '2025', germany: -9.4, china: -46.2, usa: 5.8, italy: 2.8, belgium: -7.8, uk: 13.4 },
];

const FRANCE_PARTNER_BALANCE_CONFIG = {
  germany: { label: 'Germany (deficit)', color: 'hsl(0, 72%, 55%)' },
  china: { label: 'China (deficit)', color: 'hsl(14, 85%, 55%)' },
  usa: { label: 'USA (surplus)', color: 'hsl(199, 89%, 52%)' },
  italy: { label: 'Italy', color: 'hsl(142, 55%, 48%)' },
  belgium: { label: 'Belgium (deficit)', color: 'hsl(258, 55%, 62%)' },
  uk: { label: 'UK (surplus)', color: 'hsl(38, 90%, 55%)' },
} satisfies ChartConfig;

const FRANCE_MONTHLY_CONFIG = {
  avgMonthlyExports: { label: 'Avg. monthly exports', color: 'hsl(199, 89%, 48%)' },
  avgMonthlyImports: { label: 'Avg. monthly imports', color: 'hsl(215, 25%, 55%)' },
  avgMonthlySurplus: { label: 'Avg. monthly trade deficit', color: 'hsl(0, 72%, 55%)' },
} satisfies ChartConfig;

const FRANCE_TOP_PARTNERS: readonly TradePartnerRow[] = [
  { rank: 1, partner: 'Germany', volume: '€184.3 billion' },
  { rank: 2, partner: 'Italy', volume: '~€111 billion' },
  { rank: 3, partner: 'Belgium', volume: '~€107 billion' },
  { rank: 4, partner: 'China', volume: '~€95 billion' },
  { rank: 5, partner: 'Spain', volume: '~€93 billion' },
];

const FRANCE_IMPORT_SLICES: readonly TradePieSlice[] = [
  { name: 'Machinery, electronics & computers', value: 17, detail: '~17% of total imports' },
  { name: 'Vehicles & parts', value: 11, detail: '~11%', notes: 'Mainly Germany, Spain, Italy' },
  { name: 'Chemicals & pharmaceuticals', value: 10, detail: '~10%' },
  { name: 'Energy (oil, gas, refined)', value: 6.5, detail: '~6.5% · €44.2B bill in 2025', notes: 'Down from €55.6B in 2024' },
  { name: 'Textiles & clothing', value: 5, detail: '~5%', notes: 'Heavily China / Bangladesh' },
];

const FRANCE_EXPORT_SLICES: readonly TradePieSlice[] = [
  {
    name: 'Aeronautics & space',
    value: 11,
    detail: '~11% · record surplus +€32.6B (2025)',
    notes: 'Exports +18.3% in 2025; Airbus-driven',
  },
  { name: 'Machinery & equipment', value: 13, detail: '~13%' },
  {
    name: 'Chemicals, perfumes & cosmetics',
    value: 14,
    detail: '~14% · perfumes/cosmetics surplus +€17.3B',
    notes: 'Record cosmetics surplus in 2024',
  },
  { name: 'Vehicles & parts', value: 9, detail: '~9%' },
  {
    name: 'Agri-food, wine & spirits',
    value: 10,
    detail: '~10% · wine & spirits +€13.0B',
    notes: 'Agri-food surplus at historic low +€0.2B in 2025',
  },
];

const FRANCE_GEO_EXPORT_SLICES: readonly TradePieSlice[] = [
  { name: 'Europe (incl. EU)', value: 63, detail: '~63%', notes: '~55% intra-EU alone' },
  { name: 'Asia', value: 15, detail: '~15%' },
  { name: 'North America', value: 11, detail: '~11%', notes: 'US tariffs from Aug 2025 cut Q4 flows' },
  { name: 'Africa', value: 7, detail: '~7%', notes: 'Maghreb and francophone West Africa' },
  { name: 'Latin America', value: 3, detail: '~3%' },
  { name: 'Oceania', value: 1, detail: '~1%' },
];

const FRANCE_GEO_IMPORT_SLICES: readonly TradePieSlice[] = [
  { name: 'Europe (incl. EU)', value: 65, detail: '~65%', notes: 'Germany alone 18.7% of imports' },
  { name: 'Asia', value: 20, detail: '~20%', notes: 'China €71B — 13.6% of all imports' },
  { name: 'North America', value: 7.5, detail: '~7.5%' },
  { name: 'Africa', value: 5, detail: '~5%', notes: 'Energy and raw materials' },
  { name: 'Latin America', value: 2, detail: '~2%' },
  { name: 'Oceania', value: 0.5, detail: '<1%' },
];

const FRANCE_FTA_IMPACTS: readonly FtaImpactRow[] = [
  { agreement: 'EU-Japan EPA', netBenefit: 1.4, jobsSupported: 18_000 },
  { agreement: 'CETA (Canada)', netBenefit: 0.9, jobsSupported: 11_000 },
  { agreement: 'EU-South Korea', netBenefit: 0.8, jobsSupported: 10_000 },
  { agreement: 'EU-Vietnam (EVFTA)', netBenefit: 0.5, jobsSupported: 6_000 },
  { agreement: 'EU-UK TCA', netBenefit: -1.6, jobsSupported: -19_000 },
  { agreement: 'US tariffs (from Aug 2025)', netBenefit: -2.4, jobsSupported: -28_000 },
];

const FRANCE_AGREEMENTS: readonly AgreementInsight[] = [
  {
    headerLead: 'Deep integration',
    headerSub: 'EU27 · goods & services',
    title: 'EU Single Market & Customs Union',
    tags: ['EU', 'Customs union', 'Tariffs: 0%', 'Active'],
    summary:
      'France is a founding member; the Single Market has underpinned its trade since 1993. Duty-free goods trade and lower friction in services with 26 EU partners — Germany, Italy, Belgium and Spain alone take roughly 38% of French exports.',
    impact:
      'Very large net benefit, but France runs deficits with its biggest EU partners (Germany −€10.9B, Belgium ~−€8B in 2024). ~55% of French trade is intra-EU.',
    status: 'Fully active · permanent',
  },
  {
    headerLead: 'Bilateral FTA',
    headerSub: 'EPA · in force 2019',
    title: 'EU–Japan Economic Partnership Agreement (EPA)',
    tags: ['Japan', 'EPA', 'Tariffs ~99% cut', 'Active'],
    summary:
      'In force since February 2019. Removed tariffs on ~99% of lines, including the 15% Japanese duty on wine — a direct win for French exporters.',
    impact:
      'Positive for France — commonly placed near €1–1.8B/year, concentrated in wine & spirits, luxury goods, agri-food and pharmaceuticals.',
    status: 'Active · notably favourable to French wine and luxury',
  },
  {
    headerLead: 'Transatlantic FTA',
    headerSub: 'CETA · provisional 2017',
    title: 'CETA (EU–Canada)',
    tags: ['Canada', 'CETA', 'Contested in France', 'Provisional'],
    summary:
      'Provisionally applied since September 2017. Politically contested in France: the Sénat voted against ratification in March 2024 over agricultural and standards concerns.',
    impact:
      'Modestly positive — roughly €0.7–1.1B/year, led by wine, cheese, machinery and pharmaceuticals. French beef and agriculture remain the flashpoint.',
    status: 'Provisionally active · French ratification rejected by the Sénat (2024)',
  },
  {
    headerLead: 'Asia FTA',
    headerSub: 'In force July 2011',
    title: 'EU–South Korea Free Trade Agreement',
    tags: ['South Korea', 'Industrial goods', 'Active'],
    summary:
      'In force since July 2011. Deep industrial tariff cuts; France exports aeronautics, luxury, cosmetics and agri-food.',
    impact:
      'Positive — around €0.6–1.0B/year for France, smaller than Germany’s gain because French industrial exports to Korea are more concentrated in aero and luxury.',
    status: 'Active · among the EU’s strongest Asian FTAs',
  },
  {
    headerLead: 'Post-Brexit deal',
    headerSub: 'TCA · from 2021',
    title: 'EU–UK Trade and Cooperation Agreement (TCA)',
    tags: ['United Kingdom', 'TCA', 'Rules of origin', 'Active'],
    summary:
      'In force from 1 January 2021. Preferential terms for qualifying goods but customs formalities, rules of origin and thinner services access than Single Market membership.',
    impact:
      'Net negative versus pre-2021 integration, though the UK remains one of France’s largest bilateral surpluses (~+€14B in 2024). Recurring loss estimates of €1–2B/year versus full access.',
    status: 'Active · materially narrower than Single Market access',
  },
  {
    headerLead: 'South America bloc',
    headerSub: 'Signed · France opposed',
    title: 'EU–Mercosur Trade Agreement',
    tags: ['Mercosur', 'Pending', 'France opposed', 'Agriculture'],
    summary:
      'Text agreed in 2019 and concluded in December 2024, but France has led opposition alongside farm unions over beef, poultry and mirror-clause standards. Ratification remains contested as of 2026.',
    impact:
      'Ambiguous for France: modelling suggests ~€0.5–1B/year upside for industry (vehicles, machinery, wine) set against concentrated losses in beef and poultry — the reason for French resistance.',
    status: 'Concluded · France actively opposing ratification',
  },
  {
    headerLead: 'Tariff shock',
    headerSub: 'US measures · from Aug 2025',
    title: 'United States tariffs on EU goods',
    tags: ['United States', 'Tariffs', 'Wine & spirits', 'Active'],
    summary:
      'New US duties took effect during August 2025 and bit hard in Q4: French spirits exports −47%, wine −39%, perfumes and cosmetics −25% — precisely France’s strongest surplus sectors.',
    impact:
      'Clearly negative and concentrated: the US is France’s largest non-EU market and the hit lands on wine & spirits (+€13.0B surplus) and cosmetics (+€17.3B surplus).',
    status: 'Active · principal downside risk to the 2026 balance',
  },
];

const FRANCE_RAIL_NOTE = (
  <>
    Germany: largest overall trade and largest deficit; China: largest single deficit (−€47B). Full partner tables:{' '}
    <a
      href="https://www.douane.gouv.fr/la-douane/opendata"
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-sky-400/95 underline decoration-sky-500/50 underline-offset-2 transition hover:text-sky-300"
    >
      Douanes
    </a>
    .
  </>
);

const FRANCE_SUMMARY = (
  <>
    <p className="font-sans text-[11px] leading-relaxed text-neutral-400">
      Goods trade, 2025 (DG Trésor / Douanes): exports <strong className="text-neutral-200">€614.7 billion</strong>{' '}
      (+2.5%); imports <strong className="text-neutral-200">€683.9 billion</strong> (+0.7%); deficit{' '}
      <strong className="text-neutral-200">−€69.2 billion</strong> — a third straight narrowing from the −€162.6B
      energy-shock peak of 2022. Roughly <strong className="text-neutral-200">55%</strong> of trade is intra-EU. France
      has run a goods deficit every year since 2004. Leading total-trade partners: Germany (€184.3B — largest overall
      and largest deficit at −€10.9B), Italy (~€111B), Belgium (~€107B), China (~€95B — largest deficit at −€47B) and
      Spain (~€93B). Surpluses concentrate in aeronautics (+€32.6B, record), perfumes &amp; cosmetics (+€17.3B) and wine
      &amp; spirits (+€13.0B).
    </p>
    <p className="font-sans text-[10px] text-neutral-500">
      Source:{' '}
      <a
        href="https://www.tresor.economie.gouv.fr/Articles/2026/02/06/rapport-2026-sur-le-commerce-exterieur-de-la-france"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-sky-400/95 underline decoration-sky-500/50 underline-offset-2 transition hover:text-sky-300"
      >
        DG Trésor — Rapport sur le commerce extérieur
      </a>
    </p>
  </>
);

const FRANCE_NOTES = (
  <>
    <p>
      Official French trade results and partner tables:{' '}
      <a
        href="https://www.douane.gouv.fr/actualites/resultats-du-commerce-exterieur-de-la-france-pour-lannee-2024"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-sky-400/95 underline decoration-sky-500/50 underline-offset-2 transition hover:text-sky-300"
      >
        Douanes
      </a>{' '}
      ·{' '}
      <a
        href="https://lekiosque.finances.gouv.fr/"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-sky-400/95 underline decoration-sky-500/50 underline-offset-2 transition hover:text-sky-300"
      >
        Le Kiosque
      </a>
      .
    </p>
    <p>
      Balances for 2022–2025 are as published (−162.6 / −98.4 / −79.3 / −69.2 B€). Export and import levels before 2023
      are reconstructed to match the published balance series; product and regional shares are approximations, not
      official line items.
    </p>
    <p>
      France applies EU trade policy — agreements are negotiated by the Commission, but ratification politics (CETA,
      Mercosur) are distinctly national. Always verify with HS code and origin rules.
    </p>
  </>
);

export const FRANCE_TRADE: TradeSectionData = {
  kpis: FRANCE_KPIS,
  timeseries: FRANCE_TIMESERIES,
  timeseriesTitle: 'French foreign trade development',
  timeseriesDescription:
    'Goods, billions of € (douanes FAB-FAB series). Exports and imports use the left scale; trade balance uses the right scale. France has been in deficit every year since 2004.',
  partnerBalanceByYear: FRANCE_PARTNER_BALANCE,
  partnerBalanceConfig: FRANCE_PARTNER_BALANCE_CONFIG,
  partnerBalanceTitle: "France's trade balance by key partners",
  partnerBalanceDescription:
    'Bilateral balance in billions of € (positive = surplus for France, negative = deficit). Germany and China are the two structural deficits; the UK and US are the main surpluses.',
  monthlyPerformance: FRANCE_MONTHLY,
  monthlyConfig: FRANCE_MONTHLY_CONFIG,
  monthlyTitle: "France's monthly trade performance",
  monthlyDescription:
    'Each point is one calendar year: average monthly exports and imports (left scale, B€) and average monthly trade balance (right scale, B€ — negative for France).',
  topPartners: FRANCE_TOP_PARTNERS,
  importSlices: FRANCE_IMPORT_SLICES,
  exportSlices: FRANCE_EXPORT_SLICES,
  geoExportSlices: FRANCE_GEO_EXPORT_SLICES,
  geoImportSlices: FRANCE_GEO_IMPORT_SLICES,
  importTitle: 'Top 5 France imports',
  exportTitle: 'Top 5 France exports',
  railNote: FRANCE_RAIL_NOTE,
  summary: FRANCE_SUMMARY,
  agreements: FRANCE_AGREEMENTS,
  ftaImpacts: FRANCE_FTA_IMPACTS,
  ftaTitle: 'Quantified net GDP impact of major trade regimes (annual, 2025)',
  notes: FRANCE_NOTES,
};
