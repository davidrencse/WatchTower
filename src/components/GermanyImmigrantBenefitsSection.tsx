import { memo, useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from './ui/chart';

/** UI card groups: 8 status classes + overview + notes. */
export const GERMANY_IMMIGRANT_BENEFITS_GROUP_COUNT = 10;

const ORIGIN_COLORS = {
  europe: 'hsl(199, 89%, 48%)',
  mena: 'hsl(38, 92%, 50%)',
  africa: 'hsl(142, 65%, 42%)',
  asia: 'hsl(280, 55%, 58%)',
  other: 'hsl(215, 14%, 38%)',
} as const;

type OriginKey = keyof typeof ORIGIN_COLORS;

type OriginSlice = { key: OriginKey; label: string; value: number };

type ImmigrantStatusClass = {
  index: number;
  title: string;
  stockLabel: string;
  stockDetail: string;
  benefits: readonly string[];
  origins: readonly OriginSlice[];
};

const IMMIGRANT_STATUS_CLASSES: readonly ImmigrantStatusClass[] = [
  {
    index: 1,
    title: 'EU citizens & free movement',
    stockLabel: '~5.23M',
    stockDetail: 'Foreigners with free-movement rights (2025)',
    benefits: [
      'Immediate full labor-market access',
      'Social security after contributions; Bürgergeld if eligible',
      'Child benefits · public education & healthcare',
      'Local & EU elections · citizenship path 5–8 years',
      'No proof of funds or job offer required',
    ],
    origins: [
      { key: 'europe', label: 'Europe', value: 99 },
      { key: 'other', label: 'Other', value: 1 },
    ],
  },
  {
    index: 2,
    title: 'Asylum seekers (procedure)',
    stockLabel: '~213k',
    stockDetail: 'Pending applications (end-2024) · ~230k first-time apps in 2024',
    benefits: [
      'AsylbLG support ~€441–563/mo (2025, reduced)',
      'Reception housing · acute/essential healthcare only',
      'Work after 3–9 months (restricted)',
      'Integration courses if ordered · no full Bürgergeld for 15–36 months',
    ],
    origins: [
      { key: 'mena', label: 'Middle East', value: 65 },
      { key: 'africa', label: 'Africa', value: 18 },
      { key: 'asia', label: 'Asia', value: 12 },
      { key: 'europe', label: 'Europe', value: 5 },
    ],
  },
  {
    index: 3,
    title: 'Recognized protection holders',
    stockLabel: '~2.6M',
    stockDetail: 'Non-EU refugee/subsidiary permits (end-2024) · ~46% of non-EU permits',
    benefits: [
      'Full Bürgergeld if needed (~€563 + housing/heat)',
      'Unrestricted work · statutory health insurance',
      'Mandatory integration (600h German + orientation)',
      'Privileged family reunification · settlement 3–5 years',
      'Fast citizenship track (3–5 years with language/income)',
    ],
    origins: [
      { key: 'mena', label: 'Middle East', value: 72 },
      { key: 'africa', label: 'Africa', value: 12 },
      { key: 'asia', label: 'Asia', value: 10 },
      { key: 'europe', label: 'Europe', value: 6 },
    ],
  },
  {
    index: 4,
    title: '§24 temporary protection (Ukraine)',
    stockLabel: '~1.08M',
    stockDetail: 'Stock as of Mar 2025 · no asylum application required',
    benefits: [
      'Near-refugee access: Bürgergeld-tier support if needed',
      'Unrestricted work & education · full healthcare',
      'Child benefits · family reunification · language support',
      'Renewable residence · path to other permits',
    ],
    origins: [
      { key: 'europe', label: 'Europe (Ukraine)', value: 98 },
      { key: 'other', label: 'Other', value: 2 },
    ],
  },
  {
    index: 5,
    title: 'Family reunification',
    stockLabel: '~97k/yr',
    stockDetail: 'New third-country titles 2024 · ~1M+ family-linked stock',
    benefits: [
      'Rights tied to sponsor (work, residence duration)',
      'Bürgergeld if low-income household',
      'Easier for Blue Card/skilled sponsors since 2024',
      'Privileged route when sponsor has protection status',
    ],
    origins: [
      { key: 'mena', label: 'Middle East', value: 42 },
      { key: 'europe', label: 'Europe', value: 26 },
      { key: 'asia', label: 'Asia', value: 22 },
      { key: 'africa', label: 'Africa', value: 10 },
    ],
  },
  {
    index: 6,
    title: 'Skilled workers & labor migrants',
    stockLabel: '~175k/yr',
    stockDetail: '~120k new employment permits + ~55k domestic titles (2024)',
    benefits: [
      'Job-tied permit · full social insurance & pensions',
      'Blue Card: easier family reunification (no housing proof since 2024)',
      'Settlement 21–48 months · opportunity card (18-mo job search)',
      'Self-supporting: livelihood proof required',
    ],
    origins: [
      { key: 'asia', label: 'Asia', value: 32 },
      { key: 'europe', label: 'Europe', value: 25 },
      { key: 'mena', label: 'Middle East', value: 18 },
      { key: 'africa', label: 'Africa', value: 8 },
      { key: 'other', label: 'Other', value: 17 },
    ],
  },
  {
    index: 7,
    title: 'Students & vocational trainees',
    stockLabel: '~288k',
    stockDetail: 'Educational permits stock · ~49k new titles 2024',
    benefits: [
      'Study/training permit · 120 full / 240 half days work per year',
      'Blocked account ~€11k+/year · mandatory health insurance',
      '18-month post-study job-seeker visa',
      'No automatic welfare · switch to skilled route after graduation',
    ],
    origins: [
      { key: 'asia', label: 'Asia', value: 52 },
      { key: 'mena', label: 'Middle East', value: 18 },
      { key: 'europe', label: 'Europe', value: 18 },
      { key: 'africa', label: 'Africa', value: 12 },
    ],
  },
  {
    index: 8,
    title: 'Spätaussiedler & special classes',
    stockLabel: '~4k/yr',
    stockDetail: 'Spätaussiedler new arrivals 2024 · plus Jewish/research/self-employed tracks',
    benefits: [
      'Spätaussiedler: near-immediate citizenship & full welfare',
      'Voting, pension credits, housing & job integration aid',
      'Jewish contingent: fast-track integration & citizenship',
      'Researchers/self-employed: standard permits, self-funding required',
    ],
    origins: [
      { key: 'europe', label: 'Europe / former USSR', value: 97 },
      { key: 'other', label: 'Other', value: 3 },
    ],
  },
];

const STATUS_STOCK_OVERVIEW = [
  { name: 'EU free movement', value: 5.23, fill: 'hsl(199, 89%, 48%)' },
  { name: 'Protection holders', value: 2.6, fill: 'hsl(142, 71%, 45%)' },
  { name: '§24 Ukraine', value: 1.08, fill: 'hsl(215, 70%, 55%)' },
  { name: 'Family-linked stock', value: 1.0, fill: 'hsl(280, 55%, 58%)' },
  { name: 'Students', value: 0.288, fill: 'hsl(38, 92%, 50%)' },
  { name: 'Asylum pending', value: 0.213, fill: 'hsl(0, 72%, 55%)' },
  { name: 'Skilled (annual flow)', value: 0.175, fill: 'hsl(258, 55%, 62%)' },
  { name: 'Spätaussiedler (annual)', value: 0.004, fill: 'hsl(215, 14%, 45%)' },
] as const;

const overviewChartConfig = STATUS_STOCK_OVERVIEW.reduce<ChartConfig>((acc, row, i) => {
  acc[`slice_${i}`] = { label: row.name, color: row.fill };
  return acc;
}, {});

function OriginMixChart({ slices, compact }: { slices: readonly OriginSlice[]; compact?: boolean }) {
  const { chartData, chartConfig } = useMemo(() => {
    const data = slices.map((s) => ({
      ...s,
      name: s.label,
      fill: ORIGIN_COLORS[s.key],
    }));
    const cfg = data.reduce<ChartConfig>((acc, row, i) => {
      acc[`o_${i}`] = { label: row.label, color: row.fill };
      return acc;
    }, {});
    return { chartData: data, chartConfig: cfg };
  }, [slices]);

  const size = compact ? 'h-[88px] w-[88px]' : 'h-[100px] w-[100px]';

  return (
    <div className="flex shrink-0 items-center gap-2.5">
      <ChartContainer config={chartConfig} className={`${size} shrink-0 font-sans`}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="rounded-md"
                  formatter={(value) => `${Number(value).toFixed(0)}%`}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius="52%"
              outerRadius="88%"
              paddingAngle={1.5}
              stroke="none"
              isAnimationActive={false}
            >
              {chartData.map((entry, i) => (
                <Cell key={`${entry.key}-${i}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
      <ul className="min-w-0 flex-1 space-y-0.5 font-sans text-[9px] leading-tight text-neutral-500">
        {chartData.map((row) => (
          <li key={row.key} className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 shrink-0 rounded-[2px]" style={{ backgroundColor: row.fill }} />
            <span className="truncate text-neutral-400">{row.label}</span>
            <span className="ml-auto tabular-nums text-neutral-500">{row.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatusClassCard({ item }: { item: ImmigrantStatusClass }) {
  return (
    <Card className="flex h-full flex-col border-line bg-surface-metric">
      <CardHeader className="space-y-2 p-3 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-white/[0.1] bg-white/[0.03] font-sans text-[9px] font-semibold tabular-nums text-neutral-500">
              {item.index}
            </span>
            <CardTitle className="font-sans text-[12px] font-semibold leading-snug text-neutral-100">
              {item.title}
            </CardTitle>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-sans text-sm font-semibold tabular-nums leading-none text-sky-400/95">{item.stockLabel}</p>
          </div>
        </div>
        <CardDescription className="font-sans text-[10px] leading-snug text-neutral-500">{item.stockDetail}</CardDescription>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-3 p-3 pt-0">
        <ul className="flex flex-wrap gap-1.5">
          {item.benefits.map((b) => (
            <li key={b}>
              <Badge variant="outline" className="max-w-full whitespace-normal text-left font-normal normal-case tracking-normal">
                {b}
              </Badge>
            </li>
          ))}
        </ul>
        <div className="mt-auto rounded-md border border-white/[0.06] bg-white/[0.02] p-2">
          <p className="mb-1.5 font-sans text-[8px] font-medium uppercase tracking-[0.12em] text-neutral-600">
            Origin mix (approx.)
          </p>
          <OriginMixChart slices={item.origins} compact />
        </div>
      </CardContent>
    </Card>
  );
}

export const GermanyImmigrantBenefitsSection = memo(function GermanyImmigrantBenefitsSection() {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1">
        <h3 className="font-sans text-sm font-semibold uppercase tracking-[0.05em] text-neutral-100">
          Immigrant benefits by status
        </h3>
        <p className="font-sans text-[11px] leading-relaxed text-neutral-500">
          Eight residence classes · benefits are status-based (not origin-based). Foreign population ~14.1M (2025);
          ~21M with migration background.
        </p>
      </div>

      <Card className="border-line bg-surface-metric">
        <CardHeader className="space-y-1 p-3 pb-2">
          <CardTitle className="font-sans text-[11px] font-semibold uppercase tracking-[0.05em] text-neutral-100">
            Stock &amp; flow overview
          </CardTitle>
          <CardDescription className="font-sans text-[10px] text-neutral-500">
            Relative scale of major groups (millions where noted · annual flows shown smaller)
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 p-3 pt-0 lg:grid-cols-[minmax(0,140px)_1fr] lg:items-center">
          <ChartContainer config={overviewChartConfig} className="mx-auto h-[140px] w-full max-w-[140px] font-sans">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="rounded-md"
                      formatter={(value) => `${Number(value).toFixed(2)}M`}
                    />
                  }
                />
                <Pie
                  data={[...STATUS_STOCK_OVERVIEW]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="46%"
                  outerRadius="92%"
                  paddingAngle={1}
                  stroke="none"
                  isAnimationActive={false}
                >
                  {STATUS_STOCK_OVERVIEW.map((entry, i) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
            {STATUS_STOCK_OVERVIEW.map((row) => (
              <li key={row.name} className="flex items-center gap-2 font-sans text-[10px]">
                <span className="h-2 w-2 shrink-0 rounded-[2px]" style={{ backgroundColor: row.fill }} />
                <span className="min-w-0 flex-1 truncate text-neutral-400">{row.name}</span>
                <span className="shrink-0 tabular-nums text-neutral-500">
                  {row.value >= 1 ? `${row.value}M` : row.value >= 0.1 ? `${row.value}M` : `${(row.value * 1000).toFixed(0)}k`}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {IMMIGRANT_STATUS_CLASSES.map((item) => (
          <StatusClassCard key={item.index} item={item} />
        ))}
      </div>

      <Card className="border-dashed border-white/[0.1] bg-transparent">
        <CardHeader className="p-3 pb-1">
          <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.08em] text-neutral-400">
            Notes &amp; sources
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 p-3 pt-0 font-sans text-[10px] leading-relaxed text-neutral-500">
          <p>
            BAMF Migration Reports 2023–2024 · Destatis Central Register of Foreigners (2025) · Eurostat. Germany does
            not track &ldquo;race&rdquo;; origin shares are illustrative regional approximations from official migration
            statistics.
          </p>
          <p>
            Recent policy shifts: Skilled Immigration Act (2024), AsylbLG cuts (2025), tighter integration funding.
            Humanitarian classes rely more on state support; labor and student routes require upfront self-sufficiency.
          </p>
        </CardContent>
      </Card>
    </div>
  );
});
