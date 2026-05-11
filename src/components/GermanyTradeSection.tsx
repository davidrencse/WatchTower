import { useCallback, useMemo, type ReactNode } from 'react';
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
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
export const GERMANY_TRADE_GROUP_COUNT = 16;

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
  /** Shown in tooltip / legend */
  detail: string;
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

function JumpToCard({
  title,
  description,
  targetId,
}: {
  title: string;
  description: string;
  targetId: string;
}) {
  const onClick = useCallback(() => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [targetId]);

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[4.5rem] w-full flex-col items-start gap-1 rounded-md border border-white/[0.1] bg-card p-3 text-left shadow-sm transition hover:border-sky-500/35 hover:bg-card-hover"
    >
      <span className={`font-sans text-[11px] font-semibold text-neutral-100 ${UC}`}>{title}</span>
      <span className="font-sans text-[10px] leading-snug text-neutral-500">{description}</span>
    </button>
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

function SideListItem({
  title,
  lines,
}: {
  title: string;
  lines: readonly { k: string; v: string }[];
}) {
  return (
    <div className="rounded-md border border-white/[0.08] bg-white/[0.02] p-2.5">
      <p className={`font-sans text-[11px] font-semibold text-neutral-100 ${UC}`}>{title}</p>
      <ul className="mt-1.5 space-y-0.5 font-sans text-[10px] text-neutral-400">
        {lines.map((l) => (
          <li key={l.k} className="flex justify-between gap-2">
            <span>{l.k}</span>
            <span className="shrink-0 tabular-nums text-neutral-300">{l.v}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TopTradingPartnersTable() {
  return (
    <div className="rounded-md border border-white/[0.08] bg-white/[0.02] p-2 pt-1">
      <p className="mb-2 px-1 font-sans text-[11px] font-semibold text-neutral-100">Top 5 Major Trading Partners</p>
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
}: {
  title: string;
  footnote: string;
  slices: readonly TradePieSlice[];
}) {
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

  return (
    <Card className="border-white/[0.1] bg-card">
      <CardHeader className="space-y-0.5 p-2.5 pb-1">
        <CardTitle className="font-sans text-[10px] font-semibold leading-tight text-neutral-100">{title}</CardTitle>
        <CardDescription className={`text-[9px] leading-snug text-neutral-500 ${UC_META}`}>{footnote}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 p-2.5 pt-0">
        <ChartContainer config={chartConfig} className="mx-auto h-[200px] w-full max-w-[220px] font-sans">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="rounded-md"
                    formatter={(value, _name, item) => {
                      const row = (item as { payload?: TradePieSlice & { fill?: string } })?.payload;
                      const v = Number(value);
                      const pct = Number.isFinite(v) ? `${v.toFixed(v >= 10 ? 1 : 2)}%` : '—';
                      return row?.detail ? `${pct} — ${row.detail}` : pct;
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
                innerRadius={36}
                outerRadius={72}
                paddingAngle={0.6}
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
        <ul className="space-y-1 font-sans text-[9px] leading-snug text-neutral-400">
          {chartData.map((row) => (
            <li key={row.name} className="flex gap-1.5">
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-[2px]" style={{ backgroundColor: row.fill }} />
              <span className="min-w-0 flex-1">
                <span className="text-neutral-300">{row.name}</span>
                <span className="text-neutral-500"> — {row.detail}</span>
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

export function GermanyTradeSection() {
  return (
    <div className="flex flex-col gap-4">
      {/* Application-style jump row (structure only; theme matches dashboard). */}
      <div>
        <p className={`mb-2 font-sans text-[10px] text-neutral-500 ${UC_META}`}>Within Trade</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <JumpToCard
            title="General trade"
            description="Goods totals, partners, intra-EU share (Destatis 2025)."
            targetId="trade-block-general"
          />
          <JumpToCard
            title="Agreements"
            description="Single Market, WTO baseline, EU common external tariff."
            targetId="trade-block-agreements"
          />
          <JumpToCard
            title="Major EU deals"
            description="Regional agreement map: Europe, Asia-Pacific, Americas, Africa."
            targetId="trade-block-major"
          />
        </div>
      </div>

      {/* KPI row + main chart + right column (dashboard-style grid). */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_min(100%,380px)] lg:items-start">
        <div className="flex min-w-0 flex-col gap-3">
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

          <Card className="overflow-hidden border-line bg-surface-metric">
            <CardHeader className="space-y-1 p-3 pb-2">
              <CardTitle className={`text-sm font-semibold text-neutral-100 ${UC}`}>
                German foreign trade development
              </CardTitle>
              <CardDescription className={`text-[10px] text-neutral-500 ${UC_META}`}>
                Goods + services, billions of € (official Destatis-style series). Exports and imports use the left
                scale; trade balance uses the right scale.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 p-3 pt-0">
              <ChartContainer config={tradeFlowChartConfig} className="h-[360px] w-full font-sans md:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[...TRADE_TIMESERIES]} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
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
        </div>

        <aside className="flex min-w-0 flex-col gap-2" aria-label="Trade highlights">
          <p className={`font-sans text-[10px] text-neutral-500 ${UC_META}`}>Snapshot</p>
          <TopTradingPartnersTable />
          <SideListItem
            title="US role"
            lines={[{ k: 'Largest export market', v: 'United States' }]}
          />
          <TradeCategoryPieCard
            title="Top 5 Germany imports"
            footnote="Approximate share of total imports (midpoints of ranges). “All other categories” fills the remainder to 100% for the chart."
            slices={TOP_IMPORT_SLICES}
          />
          <TradeCategoryPieCard
            title="Top 5 Germany exports"
            footnote="Stated % of total exports where given; electrical machinery uses ~11.05%. Remainder shown as other categories for the pie."
            slices={TOP_EXPORT_SLICES}
          />
          <SideListItem
            title="Sources & tools"
            lines={[
              { k: 'Destatis foreign trade', v: 'Link' },
              { k: 'Access2Markets', v: 'Tool' },
              { k: 'EU agreements hub', v: 'Link' },
            ]}
          />
          <p className="font-sans text-[10px] leading-relaxed text-neutral-500">
            China: largest overall trade; US: largest export destination. Full partner tables:{' '}
            <SourceLink href="https://www.destatis.de/EN/Themes/Economy/Foreign-Trade/_node.html">Destatis</SourceLink>
            .
          </p>
        </aside>
      </div>

      {/* Folder: General trade */}
      <section id="trade-block-general" className="scroll-mt-28 space-y-2">
        <h3 className={`font-sans text-xs font-semibold text-neutral-100 ${UC}`}>General trade</h3>
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
      </section>

      {/* Folder: Agreements */}
      <section id="trade-block-agreements" className="scroll-mt-28 space-y-3">
        <h3 className={`font-sans text-xs font-semibold text-neutral-100 ${UC}`}>Agreements</h3>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <Card className="border-white/[0.1] bg-card">
            <CardHeader className="p-3 pb-2">
              <CardTitle className="font-sans text-[11px] leading-snug text-neutral-100">
                EU Single Market + Customs Union (EU27)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-3 pt-0 font-sans text-[11px] leading-relaxed text-neutral-400">
              <p>
                Zero tariffs, quotas, and customs checks inside the EU plus a common external tariff. Deepest economic
                integration (goods, services, capital, people). Related: all 27 EU members.
              </p>
              <p className="text-[10px] text-neutral-500">
                Official text:{' '}
                <SourceLink href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:12012E/TXT">TFEU</SourceLink>
              </p>
            </CardContent>
          </Card>
          <Card className="border-white/[0.1] bg-card">
            <CardHeader className="p-3 pb-2">
              <CardTitle className="font-sans text-[11px] text-neutral-100">WTO agreements (GATT etc.)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-3 pt-0 font-sans text-[11px] leading-relaxed text-neutral-400">
              <p>Baseline Most-Favored-Nation (MFN) tariff rules for partners without preferential FTAs.</p>
              <p className="text-[10px] text-neutral-500">
                <SourceLink href="https://www.wto.org">WTO</SourceLink>
              </p>
            </CardContent>
          </Card>
          <Card className="border-white/[0.1] bg-card">
            <CardHeader className="p-3 pb-2">
              <CardTitle className="font-sans text-[11px] text-neutral-100">EU common external tariff (CET)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-3 pt-0 font-sans text-[11px] leading-relaxed text-neutral-400">
              <p>Uniform tariffs on imports from countries without preferential deals. Product-level rates via TARIC.</p>
              <p className="text-[10px] text-neutral-500">
                <SourceLink href="https://trade.ec.europa.eu/access-to-markets/en/home">Access2Markets tool</SourceLink>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Folder: Major EU trade agreements + regional subfolders */}
      <section id="trade-block-major" className="scroll-mt-28 space-y-3">
        <h3 className={`font-sans text-xs font-semibold text-neutral-100 ${UC}`}>Major EU trade agreements</h3>
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
}
