import { useMemo, memo, type ReactNode } from 'react';
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from './ui/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

const UC = 'uppercase tracking-[0.05em]';
const UC_META = 'uppercase tracking-[0.03em]';

/** Approximate “card groups” inside Trade for the section header count. */
export const GERMANY_TRADE_GROUP_COUNT = 15;

const TOP_TRADING_PARTNERS: readonly { rank: number; partner: string; volume: string }[] = [
  { rank: 1, partner: 'China', volume: '€252.4 billion' },
  { rank: 2, partner: 'United States', volume: '€240.5 billion' },
  { rank: 3, partner: 'Netherlands', volume: '€209.1 billion' },
  { rank: 4, partner: 'France', volume: '~€180–190 billion' },
  { rank: 5, partner: 'Poland', volume: '~€170–180 billion' },
];

const PIE_SLICE_COLORS = [
  'hsl(199, 89%, 48%)',
  'hsl(215, 70%, 55%)',
  'hsl(142, 65%, 42%)',
  'hsl(38, 92%, 50%)',
  'hsl(280, 55%, 58%)',
  'hsl(215, 14%, 34%)',
] as const;

type TradePieSlice = {
  name: string;
  /** Midpoint or stated % used for slice area */
  value: number;
  /** Primary legend / tooltip line (share, value, etc.) */
  detail: string;
  /** Optional second line (compact legend + tooltip) */
  notes?: string;
};

const TOP_IMPORT_SLICES: readonly TradePieSlice[] = [
  {
    name: 'Electrical machinery & equipment',
    value: 14.5,
    detail: '~14–15% of total imports',
  },
  { name: 'Machinery (incl. computers & parts)', value: 12.5, detail: '~12–13%' },
  { name: 'Vehicles & vehicle parts', value: 10, detail: '~10%' },
  { name: 'Mineral fuels (oil, gas, etc.)', value: 7.5, detail: '~7–8%' },
  { name: 'Pharmaceuticals', value: 5.5, detail: '~5–6%' },
];

const TOP_EXPORT_SLICES: readonly TradePieSlice[] = [
  { name: 'Motor vehicles and parts', value: 16.2, detail: '16.2% · ~€253 billion' },
  { name: 'Machinery', value: 13.8, detail: '13.8% · ~€216 billion' },
  {
    name: 'Computer, electronic and optical products',
    value: 8.7,
    detail: '8.7% · ~€136 billion',
  },
  {
    name: 'Chemicals / pharmaceuticals (combined)',
    value: 9.0,
    detail: '~9.0% overall; pharma ~7.4% within · ~€140 billion combined',
  },
  { name: 'Electrical machinery & equipment', value: 11.05, detail: '~11.0–11.1% · ~€172–195 billion' },
];

/** Approximate destination mix for German exports by region (%). Oceania: small slice for under 1%. */
const GEOGRAPHIC_EXPORT_BREAKDOWN_SLICES: readonly TradePieSlice[] = [
  { name: 'Europe', value: 69, detail: '69%' },
  { name: 'Asia', value: 16, detail: '16%' },
  { name: 'North America', value: 11, detail: '11%' },
  { name: 'Africa', value: 2, detail: '~2%' },
  { name: 'Latin America', value: 2, detail: '~2%' },
  { name: 'Oceania', value: 0.5, detail: '<1%' },
];

/** Approximate origin mix for German imports by region (%). Values sum to 100. */
const GEOGRAPHIC_IMPORT_BREAKDOWN_SLICES: readonly TradePieSlice[] = [
  {
    name: 'Europe (incl. EU)',
    value: 61,
    detail: '61% · ~€832B',
    notes: 'Dominant source; ~51.8% from EU countries alone',
  },
  { name: 'Asia', value: 26.1, detail: '26.1% · ~€355B', notes: 'Heavily driven by China' },
  { name: 'North America', value: 8.3, detail: '8.3% · ~€113B', notes: 'Mainly United States' },
  { name: 'Africa', value: 2.6, detail: '2.6% · ~€35B', notes: 'Energy and raw materials' },
  { name: 'Latin America', value: 1.6, detail: '1.6% · ~€22B', notes: 'Agri, minerals' },
  { name: 'Oceania', value: 0.4, detail: '0.4% · ~€5–6B', notes: 'Mainly Australia' },
];

const TRADE_TIMESERIES = [
  { year: '2000', exports: 597.3, imports: 537.0, balance: 60.3 },
  { year: '2001', exports: 610.5, imports: 541.0, balance: 69.5 },
  { year: '2002', exports: 618.1, imports: 531.5, balance: 86.6 },
  { year: '2003', exports: 632.4, imports: 540.5, balance: 91.9 },
  { year: '2004', exports: 704.6, imports: 582.5, balance: 122.1 },
  { year: '2005', exports: 766.3, imports: 629.0, balance: 137.3 },
  { year: '2006', exports: 855.0, imports: 710.0, balance: 145.0 },
  { year: '2007', exports: 965.0, imports: 798.0, balance: 167.0 },
  { year: '2008', exports: 984.0, imports: 822.0, balance: 162.0 },
  { year: '2009', exports: 803.0, imports: 665.0, balance: 138.0 },
  { year: '2010', exports: 969.0, imports: 823.0, balance: 146.0 },
  { year: '2011', exports: 1061.0, imports: 949.0, balance: 112.0 },
  { year: '2012', exports: 1097.0, imports: 980.0, balance: 117.0 },
  { year: '2013', exports: 1094.0, imports: 983.0, balance: 111.0 },
  { year: '2014', exports: 1126.0, imports: 1003.0, balance: 123.0 },
  { year: '2015', exports: 1190.0, imports: 1029.0, balance: 161.0 },
  { year: '2016', exports: 1208.0, imports: 1046.0, balance: 162.0 },
  { year: '2017', exports: 1279.0, imports: 1099.0, balance: 180.0 },
  { year: '2018', exports: 1318.0, imports: 1138.0, balance: 180.0 },
  { year: '2019', exports: 1327.0, imports: 1139.0, balance: 188.0 },
  { year: '2020', exports: 1204.0, imports: 1030.0, balance: 174.0 },
  { year: '2021', exports: 1366.0, imports: 1200.0, balance: 166.0 },
  { year: '2022', exports: 1576.0, imports: 1488.0, balance: 88.0 },
  { year: '2023', exports: 1562.9, imports: 1345.7, balance: 217.2 },
  { year: '2024', exports: 1612.0, imports: 1369.6, balance: 242.4 },
  { year: '2025', exports: 1562.9, imports: 1362.5, balance: 200.4 },
] as const;

const tradeFlowChartConfig = {
  exports: { label: 'Exports', color: 'hsl(199, 89%, 48%)' },
  imports: { label: 'Imports', color: 'hsl(215, 25%, 55%)' },
  balance: { label: 'Trade balance', color: 'hsl(142, 71%, 45%)' },
} satisfies ChartConfig;

const PARTNER_BALANCE_BY_YEAR = [
  { year: '2000', usa: 18.5, china: -5.2, france: 12.4, uk: 8.7, netherlands: 15.2, italy: 9.8 },
  { year: '2005', usa: 25.8, china: -12.4, france: 18.6, uk: 12.5, netherlands: 22.1, italy: 12.3 },
  { year: '2010', usa: 28.4, china: -25.6, france: 22.8, uk: 18.9, netherlands: 28.7, italy: 14.5 },
  { year: '2015', usa: 45.2, china: -38.7, france: 35.1, uk: 28.4, netherlands: 32.6, italy: 18.9 },
  { year: '2016', usa: 48.9, china: -42.3, france: 37.2, uk: 30.1, netherlands: 34.8, italy: 19.7 },
  { year: '2017', usa: 52.6, china: -48.9, france: 39.8, uk: 32.5, netherlands: 36.4, italy: 21.2 },
  { year: '2018', usa: 55.4, china: -52.1, france: 42.3, uk: 34.7, netherlands: 37.9, italy: 22.8 },
  { year: '2019', usa: 58.2, china: -55.8, france: 44.6, uk: 36.9, netherlands: 39.2, italy: 24.1 },
  { year: '2020', usa: 52.7, china: -48.9, france: 38.4, uk: 31.2, netherlands: 34.5, italy: 20.8 },
  { year: '2021', usa: 62.1, china: -59.2, france: 41.7, uk: 35.8, netherlands: 37.1, italy: 23.4 },
  { year: '2022', usa: 68.3, china: -66.4, france: 45.9, uk: 39.4, netherlands: 41.3, italy: 25.6 },
  { year: '2023', usa: 63.3, china: -59.8, france: 50.5, uk: 41.8, netherlands: 38.7, italy: 24.9 },
  { year: '2024', usa: 69.8, china: -66.3, france: 52.4, uk: 43.2, netherlands: 40.1, italy: 26.7 },
  { year: '2025', usa: 62.0, china: -87.0, france: 54.7, uk: 41.3, netherlands: 39.5, italy: 25.4 },
] as const;

const partnerBalanceChartConfig = {
  usa: { label: 'USA (surplus)', color: 'hsl(199, 89%, 52%)' },
  china: { label: 'China (deficit)', color: 'hsl(0, 72%, 55%)' },
  france: { label: 'France (surplus)', color: 'hsl(142, 55%, 48%)' },
  uk: { label: 'UK (surplus)', color: 'hsl(38, 90%, 55%)' },
  netherlands: { label: 'Netherlands (surplus)', color: 'hsl(258, 55%, 62%)' },
  italy: { label: 'Italy (surplus)', color: 'hsl(215, 35%, 58%)' },
} satisfies ChartConfig;

/** Annual series: average per calendar month (B€). */
const MONTHLY_TRADE_PERFORMANCE = [
  { year: '2000', avgMonthlyExports: 49.8, avgMonthlyImports: 44.8, avgMonthlySurplus: 5.0 },
  { year: '2001', avgMonthlyExports: 50.9, avgMonthlyImports: 45.1, avgMonthlySurplus: 5.8 },
  { year: '2002', avgMonthlyExports: 51.5, avgMonthlyImports: 44.3, avgMonthlySurplus: 7.2 },
  { year: '2003', avgMonthlyExports: 52.7, avgMonthlyImports: 45.0, avgMonthlySurplus: 7.7 },
  { year: '2004', avgMonthlyExports: 58.7, avgMonthlyImports: 48.5, avgMonthlySurplus: 10.2 },
  { year: '2005', avgMonthlyExports: 63.9, avgMonthlyImports: 52.4, avgMonthlySurplus: 11.4 },
  { year: '2006', avgMonthlyExports: 71.3, avgMonthlyImports: 59.2, avgMonthlySurplus: 12.1 },
  { year: '2007', avgMonthlyExports: 80.4, avgMonthlyImports: 66.5, avgMonthlySurplus: 13.9 },
  { year: '2008', avgMonthlyExports: 82.0, avgMonthlyImports: 68.5, avgMonthlySurplus: 13.5 },
  { year: '2009', avgMonthlyExports: 66.9, avgMonthlyImports: 55.4, avgMonthlySurplus: 11.5 },
  { year: '2010', avgMonthlyExports: 80.8, avgMonthlyImports: 68.6, avgMonthlySurplus: 12.2 },
  { year: '2011', avgMonthlyExports: 88.4, avgMonthlyImports: 79.1, avgMonthlySurplus: 9.3 },
  { year: '2012', avgMonthlyExports: 91.4, avgMonthlyImports: 81.7, avgMonthlySurplus: 9.7 },
  { year: '2013', avgMonthlyExports: 91.2, avgMonthlyImports: 81.9, avgMonthlySurplus: 9.3 },
  { year: '2014', avgMonthlyExports: 93.8, avgMonthlyImports: 83.6, avgMonthlySurplus: 10.2 },
  { year: '2015', avgMonthlyExports: 99.2, avgMonthlyImports: 85.8, avgMonthlySurplus: 13.4 },
  { year: '2016', avgMonthlyExports: 100.7, avgMonthlyImports: 87.2, avgMonthlySurplus: 13.5 },
  { year: '2017', avgMonthlyExports: 106.6, avgMonthlyImports: 91.6, avgMonthlySurplus: 15.0 },
  { year: '2018', avgMonthlyExports: 109.8, avgMonthlyImports: 94.8, avgMonthlySurplus: 15.0 },
  { year: '2019', avgMonthlyExports: 110.6, avgMonthlyImports: 94.9, avgMonthlySurplus: 15.7 },
  { year: '2020', avgMonthlyExports: 100.3, avgMonthlyImports: 85.8, avgMonthlySurplus: 14.5 },
  { year: '2021', avgMonthlyExports: 113.8, avgMonthlyImports: 100.0, avgMonthlySurplus: 13.8 },
  { year: '2022', avgMonthlyExports: 131.3, avgMonthlyImports: 124.0, avgMonthlySurplus: 7.3 },
  { year: '2023', avgMonthlyExports: 130.2, avgMonthlyImports: 112.1, avgMonthlySurplus: 18.1 },
  { year: '2024', avgMonthlyExports: 134.3, avgMonthlyImports: 114.1, avgMonthlySurplus: 20.2 },
  { year: '2025', avgMonthlyExports: 130.5, avgMonthlyImports: 113.5, avgMonthlySurplus: 17.0 },
] as const;

const monthlyTradePerformanceChartConfig = {
  avgMonthlyExports: { label: 'Avg. monthly exports', color: 'hsl(199, 89%, 48%)' },
  avgMonthlyImports: { label: 'Avg. monthly imports', color: 'hsl(215, 25%, 55%)' },
  avgMonthlySurplus: { label: 'Avg. monthly trade surplus', color: 'hsl(142, 71%, 45%)' },
} satisfies ChartConfig;

function SourceLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-sky-400/95 underline decoration-sky-500/50 underline-offset-2 transition hover:text-sky-300"
    >
      {children}
    </a>
  );
}

function KpiCard({ primary, label, secondary }: { primary: string; label: string; secondary: string }) {
  return (
    <Card className="border-line bg-surface-metric">
      <CardHeader className="space-y-1 p-3 pb-1">
        <CardTitle className={`font-sans text-[10px] font-medium text-neutral-400 ${UC_META}`}>{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 p-3 pt-0">
        <p className="font-sans text-2xl font-semibold tabular-nums leading-none text-neutral-100">{primary}</p>
        <p className="font-sans text-[10px] leading-relaxed text-neutral-500">{secondary}</p>
      </CardContent>
    </Card>
  );
}

function TopTradingPartnersTable() {
  return (
    <div className="rounded-md border border-white/[0.08] bg-white/[0.02] p-1.5 pt-1">
      <p className="mb-1 px-0.5 font-sans text-[10px] font-semibold text-neutral-100">Top 5 Major Trading Partners</p>
      <div className="overflow-hidden rounded-md border border-white/[0.06]">
        <Table className="font-sans text-[10px]">
          <TableHeader>
            <TableRow className="bg-white/[0.03] hover:bg-white/[0.03]">
              <TableHead className="h-8 w-8 px-2 text-[9px] uppercase tracking-[0.08em] text-neutral-500">#</TableHead>
              <TableHead className="h-8 px-2 text-[9px] uppercase tracking-[0.08em] text-neutral-500">Partner</TableHead>
              <TableHead className="h-8 px-2 text-right text-[9px] uppercase tracking-[0.08em] text-neutral-500">
                Total trade
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TOP_TRADING_PARTNERS.map((r) => (
              <TableRow key={r.rank}>
                <TableCell className="px-2 py-1.5 tabular-nums text-neutral-500">{r.rank}</TableCell>
                <TableCell className="px-2 py-1.5 text-neutral-200">{r.partner}</TableCell>
                <TableCell className="px-2 py-1.5 text-right tabular-nums text-neutral-300">{r.volume}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function TradeCategoryPieCard({
  title,
  footnote,
  slices,
  variant = 'default',
}: {
  title: string;
  footnote?: string;
  slices: readonly TradePieSlice[];
  /** `rail`: stacked in sidebar, grows to fill height, larger donut. */
  variant?: 'default' | 'rail';
}) {
  const isRail = variant === 'rail';

  const { chartData, chartConfig } = useMemo(() => {
    const topSum = slices.reduce((a, s) => a + s.value, 0);
    const other = Math.max(0, 100 - topSum);
    const withOther: Array<TradePieSlice & { fill: string }> = [
      ...slices.map((s, i) => ({ ...s, fill: PIE_SLICE_COLORS[i % PIE_SLICE_COLORS.length] })),
      ...(other > 0.05
        ? [
            {
              name: 'All other categories',
              value: other,
              detail: 'Residual share for pie visualization (remaining import/export mix).',
              fill: PIE_SLICE_COLORS[5],
            },
          ]
        : []),
    ];
    const cfg = withOther.reduce<ChartConfig>((acc, row, i) => {
      acc[`slice_${i}`] = { label: row.name, color: row.fill };
      return acc;
    }, {});
    return { chartData: withOther, chartConfig: cfg };
  }, [slices]);

  const showFootnote = Boolean(footnote?.trim());

  return (
    <Card
      className={`border-white/[0.1] bg-card ${isRail ? 'flex min-h-0 min-w-0 flex-1 flex-col shadow-sm' : 'shadow-sm'}`}
    >
      <CardHeader className={isRail ? 'shrink-0 space-y-0.5 p-2 pb-1' : 'space-y-0.5 p-2.5 pb-1'}>
        <CardTitle
          className={`font-sans font-semibold leading-tight text-neutral-100 ${isRail ? 'text-[10px]' : 'text-[10px]'}`}
        >
          {title}
        </CardTitle>
        {showFootnote ? (
          <CardDescription
            className={`text-neutral-500 ${isRail ? 'line-clamp-2 text-[8px] leading-snug' : `text-[9px] leading-snug ${UC_META}`}`}
          >
            {footnote}
          </CardDescription>
        ) : null}
      </CardHeader>
      <CardContent
        className={
          isRail
            ? 'flex min-h-0 flex-1 flex-col gap-1.5 p-2 pt-0'
            : 'space-y-2 p-2.5 pt-0'
        }
      >
        <ChartContainer
          config={chartConfig}
          className={
            isRail
              ? 'mx-auto h-full min-h-[176px] w-full flex-1 basis-0 font-sans'
              : 'mx-auto h-[200px] w-full max-w-[240px] font-sans'
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="max-w-[260px] rounded-md"
                    formatter={(value, _name, item) => {
                      const row = (item as { payload?: TradePieSlice & { fill?: string } })?.payload;
                      const v = Number(value);
                      const pct = Number.isFinite(v) ? `${v.toFixed(v >= 10 ? 1 : 2)}%` : '—';
                      const base = row?.detail ? `${pct} — ${row.detail}` : pct;
                      return row?.notes ? `${base} · ${row.notes}` : base;
                    }}
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={isRail ? 30 : 36}
                outerRadius={isRail ? 66 : 72}
                paddingAngle={isRail ? 0.5 : 0.6}
                stroke="none"
                isAnimationActive={false}
              >
                {chartData.map((entry, i) => (
                  <Cell key={`${entry.name}-${i}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <ul
          className={`min-h-0 shrink-0 font-sans text-neutral-400 ${isRail ? 'max-h-[5.25rem] space-y-0 overflow-y-auto text-[7.5px] leading-[1.2]' : 'space-y-1 text-[9px] leading-snug'}`}
        >
          {chartData.map((row) => (
            <li key={row.name} className="flex gap-1">
              <span
                className={`mt-0.5 shrink-0 rounded-[2px] ${isRail ? 'h-1.5 w-1.5' : 'mt-0.5 h-2 w-2'}`}
                style={{ backgroundColor: row.fill }}
              />
              <span className="min-w-0 flex-1">
                {isRail ? (
                  <>
                    <span className="text-neutral-300">{row.name}</span>
                    <span className="text-neutral-500"> · {row.detail}</span>
                  </>
                ) : (
                  <>
                    <span className="text-neutral-300">{row.name}</span>
                    <span className="text-neutral-500"> — {row.detail}</span>
                    {row.notes ? (
                      <span className="mt-0.5 block text-[8px] leading-snug text-neutral-600">{row.notes}</span>
                    ) : null}
                  </>
                )}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function RegionalAgreementCard({
  regionTitle,
  children,
}: {
  regionTitle: string;
  children: ReactNode;
}) {
  return (
    <Card className="border-white/[0.1] bg-card">
      <CardHeader className="p-3 pb-2">
        <CardTitle className={`font-sans text-[11px] text-neutral-100 ${UC}`}>{regionTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 p-3 pt-0 font-sans text-[11px] leading-relaxed text-neutral-300">
        {children}
      </CardContent>
    </Card>
  );
}

const TRADE_SECTION_HEADING = `font-sans text-xl font-bold tracking-tight text-neutral-100 sm:text-2xl ${UC}`;

const TRADE_AGREEMENT_INSIGHTS: readonly {
  title: string;
  summary: string;
  impact: string;
  status: string;
}[] = [
  {
    title: 'EU Single Market & Customs Union',
    summary:
      'In place since 1993 and deepened over decades—Germany’s core trade architecture. Duty-free trade in goods and far lower friction in services and capital with 26 EU partners than with any third country.',
    impact:
      'Very large net benefit: order-of-magnitude estimates of €150–200B per year. Roughly 55–60% of German trade is intra-EU; this layer is the base of the export-oriented model.',
    status: 'Fully active · permanent',
  },
  {
    title: 'EU–Japan Economic Partnership Agreement (EPA)',
    summary:
      'In force since February 2019. Tariffs removed on about 99% of tariff lines; improved access for services and public procurement compared with WTO-only terms.',
    impact:
      'Strongly positive for Germany—often cited in the €2.5–3.5B/year range, concentrated in autos (BMW, Mercedes, VW) and machinery. Japan is among Germany’s largest non-EU partners.',
    status: 'Active · widely assessed as successful',
  },
  {
    title: 'CETA (EU–Canada)',
    summary:
      'Provisionally applied from September 2017. Eliminates tariffs on roughly 98% of lines subject to the agreement.',
    impact:
      'Moderately positive—commonly estimated around €1.2–1.8B/year for Germany, with machinery, vehicles, and chemicals prominent.',
    status: 'Provisionally active · full EU ratification still incomplete',
  },
  {
    title: 'EU–South Korea Free Trade Agreement',
    summary:
      'In force since July 2011. Deep cuts in industrial tariffs and clearer rules for integrated supply chains.',
    impact:
      'Strongly positive—often placed at €1.5–2.2B/year; German car exports expanded markedly in the years after entry into force.',
    status: 'Active · treated as one of the EU’s strongest Asian FTAs',
  },
  {
    title: 'EU–UK Trade and Cooperation Agreement (TCA)',
    summary:
      'In force from 1 January 2021 after Brexit. Preferential terms for qualifying goods, but customs formalities, rules of origin, and thinner services access versus Single Market membership.',
    impact:
      'Net negative versus pre-2021 integration: UK-bound exports fell after new border and origin rules. Versus full membership access, recurring estimates in the €1.5–3B/year loss range.',
    status: 'Active · materially narrower than Single Market access',
  },
  {
    title: 'EU–Vietnam Free Trade Agreement (EVFTA)',
    summary:
      'In force since August 2020. Tariff phase-downs and clearer investment and procurement rules for firms using Vietnam in regional production.',
    impact:
      'Positive—often estimated at €0.8–1.2B/year for German machinery, electronics, and automotive suppliers with Vietnamese operations or sourcing.',
    status: 'Fully active',
  },
  {
    title: 'EU–Mercosur Trade Agreement',
    summary:
      'Text agreed in 2019; as of 2026 full ratification is still blocked in parts of the EU over environmental and agricultural sensitivities.',
    impact:
      'If ratified, modelling often points to about €1–2B/year upside for Germany (vehicles, machinery, chemicals)—highly dependent on safeguards and final implementation.',
    status: 'Signed · not yet in force',
  },
];

function AgreementInsightCard({
  title,
  summary,
  impact,
  status,
}: {
  title: string;
  summary: string;
  impact: string;
  status: string;
}) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-white/[0.07] bg-[linear-gradient(160deg,rgba(255,255,255,0.045)_0%,rgba(255,255,255,0.01)_42%,transparent_100%)] p-[1.125rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="mb-3 h-px w-8 rounded-full bg-gradient-to-r from-sky-500/70 to-transparent" aria-hidden />
      <h3 className="font-sans text-[0.8125rem] font-semibold leading-snug tracking-tight text-neutral-100">{title}</h3>
      <p className="mt-2.5 font-sans text-[12px] leading-[1.6] text-neutral-400">{summary}</p>
      <dl className="mt-4 flex min-h-0 flex-1 flex-col gap-3 border-t border-white/[0.06] pt-4">
        <div>
          <dt className="font-sans text-[9px] font-medium uppercase tracking-[0.14em] text-neutral-500">Impact</dt>
          <dd className="mt-1.5 font-sans text-[12px] leading-snug text-neutral-300">{impact}</dd>
        </div>
        <div className="mt-auto">
          <dt className="font-sans text-[9px] font-medium uppercase tracking-[0.14em] text-neutral-500">Status</dt>
          <dd className="mt-1.5">
            <span className="inline-block max-w-full rounded-md border border-white/[0.08] bg-white/[0.025] px-2.5 py-1.5 font-sans text-[11px] leading-snug text-neutral-400">
              {status}
            </span>
          </dd>
        </div>
      </dl>
    </article>
  );
}

export const GermanyTradeSection = memo(function GermanyTradeSection() {
  return (
    <div className="flex flex-col gap-4">
      <section id="trade-block-general" className="scroll-mt-28 flex flex-col gap-4">
        <h2 className={TRADE_SECTION_HEADING}>General trade</h2>
        <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <KpiCard
            primary="€1,562.9B"
            label="Exports (goods, 2025)"
            secondary="≈ $1.72 trillion USD · Destatis goods trade."
          />
          <KpiCard
            primary="€1,362.5B"
            label="Imports (goods, 2025)"
            secondary="≈ $1.50 trillion USD · Destatis goods trade."
          />
          <KpiCard
            primary="~56%"
            label="Intra-EU share"
            secondary="Zero tariffs via Single Market; largest integrated trade share."
          />
        </div>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_min(100%,400px)] lg:items-stretch lg:min-h-0">
          <div className="flex min-h-0 min-w-0 flex-col gap-3">
          <Card className="border-line bg-surface-metric">
            <CardHeader className="space-y-1 p-3 pb-2">
              <CardTitle className={`text-sm font-semibold text-neutral-100 ${UC}`}>
                German foreign trade development
              </CardTitle>
              <CardDescription className={`text-[10px] text-neutral-500 ${UC_META}`}>
                Goods + services, billions of € (official Destatis-style series). Exports and imports use the left
                scale; trade balance uses the right scale.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 p-3 px-3 pb-4 pt-0">
              <ChartContainer config={tradeFlowChartConfig} className="h-[380px] w-full font-sans md:h-[420px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[...TRADE_TIMESERIES]} margin={{ top: 8, right: 10, left: 0, bottom: 56 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis
                      dataKey="year"
                      type="category"
                      ticks={TRADE_TIMESERIES.map((d) => d.year)}
                      interval={0}
                      minTickGap={0}
                      angle={-45}
                      textAnchor="end"
                      height={54}
                      tick={{ fill: 'rgba(163,163,163,0.92)', fontSize: 9 }}
                      axisLine={false}
                      tickLine={false}
                      tickMargin={0}
                      padding={{ left: 8, right: 8 }}
                    />
                    <YAxis
                      yAxisId="left"
                      tick={{ fill: 'rgba(163,163,163,0.85)', fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      width={44}
                      tickFormatter={(v) => (Number.isFinite(Number(v)) ? `${Number(v)}` : '')}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fill: 'rgba(163,163,163,0.85)', fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      width={40}
                      tickFormatter={(v) => (Number.isFinite(Number(v)) ? `${Number(v)}` : '')}
                    />
                    <ChartTooltip
                      cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                      content={
                        <ChartTooltipContent
                          className="rounded-md"
                          labelFormatter={(y) => `Year ${y}`}
                          formatter={(value) => {
                            const n = Number(value);
                            return Number.isFinite(n) ? `${n.toFixed(1)} bn €` : '—';
                          }}
                        />
                      }
                    />
                    <Legend
                      wrapperStyle={{ fontSize: 10, paddingTop: 8 }}
                      formatter={(value) => <span className="text-neutral-400">{value}</span>}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="exports"
                      name="Exports"
                      stroke={tradeFlowChartConfig.exports.color}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="imports"
                      name="Imports"
                      stroke={tradeFlowChartConfig.imports.color}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="balance"
                      name="Trade balance"
                      stroke={tradeFlowChartConfig.balance.color}
                      strokeWidth={2}
                      dot={false}
                      strokeDasharray="4 3"
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-line bg-surface-metric">
            <CardHeader className="space-y-1 p-3 pb-2">
              <CardTitle className={`text-sm font-semibold text-neutral-100 ${UC}`}>
                Germany&apos;s trade balance by key partners
              </CardTitle>
              <CardDescription className={`text-[10px] text-neutral-500 ${UC_META}`}>
                Bilateral balance in billions of € (positive = surplus for Germany, negative = deficit). China shown as
                deficit; others as surplus per series labels.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 p-3 pt-0">
              <ChartContainer config={partnerBalanceChartConfig} className="h-[340px] w-full font-sans md:h-[380px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[...PARTNER_BALANCE_BY_YEAR]} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis
                      dataKey="year"
                      tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tick={{ fill: 'rgba(163,163,163,0.85)', fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      width={44}
                      tickFormatter={(v) => (Number.isFinite(Number(v)) ? `${Number(v)}` : '')}
                    />
                    <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)" strokeDasharray="3 3" />
                    <ChartTooltip
                      cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                      content={
                        <ChartTooltipContent
                          className="rounded-md"
                          labelFormatter={(y) => `Year ${y}`}
                          formatter={(value) => {
                            const n = Number(value);
                            return Number.isFinite(n) ? `${n >= 0 ? '+' : ''}${n.toFixed(1)} bn €` : '—';
                          }}
                        />
                      }
                    />
                    <Legend
                      wrapperStyle={{ fontSize: 9, paddingTop: 6 }}
                      formatter={(value) => <span className="text-neutral-400">{value}</span>}
                    />
                    {(Object.keys(partnerBalanceChartConfig) as (keyof typeof partnerBalanceChartConfig)[]).map(
                      (key) => (
                        <Line
                          key={key}
                          type="monotone"
                          dataKey={key}
                          name={partnerBalanceChartConfig[key].label}
                          stroke={partnerBalanceChartConfig[key].color}
                          strokeWidth={2}
                          dot={{ r: 2 }}
                          isAnimationActive={false}
                        />
                      ),
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-line bg-surface-metric">
            <CardHeader className="space-y-1 p-3 pb-2">
              <CardTitle className={`text-sm font-semibold text-neutral-100 ${UC}`}>
                Germany&apos;s monthly trade performance
              </CardTitle>
              <CardDescription className={`text-[10px] text-neutral-500 ${UC_META}`}>
                Each point is one calendar year: average monthly exports and imports (left scale, B€) and average
                monthly trade surplus (right scale, B€).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 p-3 pt-0">
              <ChartContainer
                config={monthlyTradePerformanceChartConfig}
                className="h-[340px] w-full font-sans md:h-[380px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[...MONTHLY_TRADE_PERFORMANCE]} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis
                      dataKey="year"
                      tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      yAxisId="left"
                      tick={{ fill: 'rgba(163,163,163,0.85)', fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      width={44}
                      tickFormatter={(v) => (Number.isFinite(Number(v)) ? `${Number(v)}` : '')}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fill: 'rgba(163,163,163,0.85)', fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      width={40}
                      tickFormatter={(v) => (Number.isFinite(Number(v)) ? `${Number(v)}` : '')}
                    />
                    <ChartTooltip
                      cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                      content={
                        <ChartTooltipContent
                          className="rounded-md"
                          labelFormatter={(y) => `Year ${y}`}
                          formatter={(value) => {
                            const n = Number(value);
                            return Number.isFinite(n) ? `${n.toFixed(1)} B€` : '—';
                          }}
                        />
                      }
                    />
                    <Legend
                      wrapperStyle={{ fontSize: 10, paddingTop: 8 }}
                      formatter={(value) => <span className="text-neutral-400">{value}</span>}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="avgMonthlyExports"
                      name={monthlyTradePerformanceChartConfig.avgMonthlyExports.label}
                      stroke={monthlyTradePerformanceChartConfig.avgMonthlyExports.color}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="avgMonthlyImports"
                      name={monthlyTradePerformanceChartConfig.avgMonthlyImports.label}
                      stroke={monthlyTradePerformanceChartConfig.avgMonthlyImports.color}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="avgMonthlySurplus"
                      name={monthlyTradePerformanceChartConfig.avgMonthlySurplus.label}
                      stroke={monthlyTradePerformanceChartConfig.avgMonthlySurplus.color}
                      strokeWidth={2}
                      dot={false}
                      strokeDasharray="4 3"
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <aside
          className="flex min-h-0 min-w-0 flex-col gap-2 lg:h-full lg:min-h-0"
          aria-label="Trade highlights"
        >
          <div className="shrink-0 space-y-1">
            <p className={`font-sans text-[10px] text-neutral-500 ${UC_META}`}>Snapshot</p>
            <TopTradingPartnersTable />
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-2.5">
            <TradeCategoryPieCard
              variant="rail"
              title="Top 5 Germany imports"
              footnote="Midpoint ranges; remainder = other to reach 100%."
              slices={TOP_IMPORT_SLICES}
            />
            <TradeCategoryPieCard
              variant="rail"
              title="Top 5 Germany exports"
              footnote="Shares as given; remainder = other in pie."
              slices={TOP_EXPORT_SLICES}
            />
            <TradeCategoryPieCard
              variant="rail"
              title="Geographic breakdown of exports"
              footnote="By export destination; Oceania as small slice under 1%."
              slices={GEOGRAPHIC_EXPORT_BREAKDOWN_SLICES}
            />
            <TradeCategoryPieCard
              variant="rail"
              title="Geographic breakdown of imports"
              footnote="By import sourcing region. Key notes in hover."
              slices={GEOGRAPHIC_IMPORT_BREAKDOWN_SLICES}
            />
          </div>
          <p className="mt-auto shrink-0 font-sans text-[10px] leading-relaxed text-neutral-500">
            China: largest overall trade; US: largest export destination. Full partner tables:{' '}
            <SourceLink href="https://www.destatis.de/EN/Themes/Economy/Foreign-Trade/_node.html">Destatis</SourceLink>
            .
          </p>
        </aside>
        </div>
        </div>
        <div className="space-y-2 border-t border-white/[0.06] pt-4">
          <p className="font-sans text-[11px] leading-relaxed text-neutral-400">
            Goods trade, 2025 (Destatis): exports <strong className="text-neutral-200">€1,562.9 billion</strong> (~$
            1.72 trillion USD); imports <strong className="text-neutral-200">€1,362.5 billion</strong> (~$1.50 trillion
            USD). Roughly <strong className="text-neutral-200">56%</strong> of trade is intra-EU (zero tariffs via the
            Single Market). Leading total-trade partners include China (€252.4B — largest overall), the United States
            (€240.5B — largest export market), the Netherlands (€209.1B), France (~€180–190B), and Poland (~€170–180B).
          </p>
          <p className="font-sans text-[10px] text-neutral-500">
            Source:{' '}
            <SourceLink href="https://www.destatis.de/EN/Themes/Economy/Foreign-Trade/_node.html">Destatis</SourceLink>
          </p>
        </div>
      </section>

      {/* Folder: Agreements */}
      <section id="trade-block-agreements" className="scroll-mt-28 space-y-4">
        <h2 className={TRADE_SECTION_HEADING}>Agreements</h2>
        <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2">
          {TRADE_AGREEMENT_INSIGHTS.map((item) => (
            <AgreementInsightCard
              key={item.title}
              title={item.title}
              summary={item.summary}
              impact={item.impact}
              status={item.status}
            />
          ))}
        </div>
      </section>

      {/* Folder: Major EU trade agreements + regional subfolders */}
      <section id="trade-block-major" className="scroll-mt-28 space-y-4">
        <h2 className={TRADE_SECTION_HEADING}>Major EU trade agreements</h2>
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          <RegionalAgreementCard regionTitle="Europe & neighbours">
            <ul className="list-inside list-disc space-y-1.5 marker:text-neutral-500">
              <li>
                <strong className="text-neutral-200">EU–UK Trade &amp; Cooperation Agreement (TCA, 2021):</strong>{' '}
                zero tariffs on qualifying goods (rules of origin apply).{' '}
                <SourceLink href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02021A0430">EUR-Lex</SourceLink>
              </li>
              <li>
                <strong className="text-neutral-200">EU–Turkey Customs Union (1995):</strong> zero tariffs on
                industrial goods.{' '}
                <SourceLink href="https://www.consilium.europa.eu">Council</SourceLink>
              </li>
              <li>
                <strong className="text-neutral-200">EEA (Norway, Iceland, Liechtenstein, 1994):</strong> full Single
                Market access.
              </li>
            </ul>
          </RegionalAgreementCard>
          <RegionalAgreementCard regionTitle="Asia-Pacific">
            <ul className="list-inside list-disc space-y-1.5 marker:text-neutral-500">
              <li>
                <strong className="text-neutral-200">EU–Japan JEFTA (2019):</strong> ~99% tariffs eliminated.{' '}
                <SourceLink href="https://policy.trade.ec.europa.eu/eu-trade-relationships-country-and-region/countries-and-regions/japan_en">
                  Commission
                </SourceLink>
              </li>
              <li>
                <strong className="text-neutral-200">EU–South Korea FTA (2015)</strong>
              </li>
              <li>
                <strong className="text-neutral-200">EU–Vietnam FTA (2020)</strong>
              </li>
              <li>
                <strong className="text-neutral-200">EU–Singapore FTA (2019)</strong>
              </li>
              <li>
                <strong className="text-neutral-200">EU–New Zealand FTA (2024)</strong>
              </li>
              <li>
                <strong className="text-neutral-200">EU–Indonesia &amp; EU–India FTAs</strong> (concluded 2025 / Jan
                2026): major recent deals opening auto and industrial markets.
              </li>
            </ul>
          </RegionalAgreementCard>
          <RegionalAgreementCard regionTitle="Americas">
            <ul className="list-inside list-disc space-y-1.5 marker:text-neutral-500">
              <li>
                <strong className="text-neutral-200">EU–Canada CETA (provisional 2017):</strong> 98%+ tariff-free.{' '}
                <SourceLink href="https://www.consilium.europa.eu">Council</SourceLink>
              </li>
              <li>
                <strong className="text-neutral-200">EU–Mercosur interim agreement (provisional from 1 May 2026):</strong>{' '}
                Brazil, Argentina, Paraguay, Uruguay.{' '}
                <SourceLink href="https://commission.europa.eu/topics/trade/eu-mercosur-trade-agreement_en">
                  Commission
                </SourceLink>
              </li>
              <li>Updated agreements with Chile, Central America, and Andean countries (Colombia, Ecuador, Peru).</li>
            </ul>
          </RegionalAgreementCard>
          <RegionalAgreementCard regionTitle="Africa &amp; others (EPAs)">
            <p>
              Economic Partnership Agreements (e.g. SADC, West/East Africa): duty-free / quota-free access for
              developing partners where agreements apply.
            </p>
          </RegionalAgreementCard>
        </div>
      </section>

      {/* Notes */}
      <Card className="border-dashed border-white/[0.12] bg-transparent">
        <CardHeader className="p-3 pb-2">
          <CardTitle className={`font-sans text-[11px] text-neutral-200 ${UC}`}>Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 p-3 pt-0 font-sans text-[11px] leading-relaxed text-neutral-400">
          <p>
            Product-specific tariffs, rules of origin, and market access:{' '}
            <SourceLink href="https://trade.ec.europa.eu/access-to-markets/en/home">Access2Markets</SourceLink>.
          </p>
          <p>
            Full official list of EU trade agreements:{' '}
            <SourceLink href="https://policy.trade.ec.europa.eu/eu-trade-relationships-country-and-region/negotiations-and-agreements_en">
              EU trade agreements hub
            </SourceLink>
            .
          </p>
          <p>Always verify with HS code and origin rules — tariffs change when agreements update.</p>
        </CardContent>
      </Card>
    </div>
  );
});
