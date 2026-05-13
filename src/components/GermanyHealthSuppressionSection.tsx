import { memo } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from './ui/chart';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

type YearPoint = { year: number; value: number };

const YEARS_2000_2025 = Array.from({ length: 26 }, (_, i) => 2000 + i);

function seriesFromValues(values: readonly number[]): YearPoint[] {
  return YEARS_2000_2025.map((year, i) => ({ year, value: values[i]! }));
}

const EE2_VALUES = [
  1.8, 1.9, 1.7, 1.6, 1.7, 1.5, 1.4, 1.3, 1.2, 1.1, 1.1, 1.0, 0.9, 0.8, 0.7, 0.7, 0.6, 0.6, 0.5, 0.5, 0.4, 0.4, 0.5,
  0.5, 0.5, 0.5,
] as const;

const PFAS_VALUES = [
  45, 48, 52, 55, 58, 62, 65, 68, 72, 68, 65, 58, 52, 48, 42, 38, 35, 32, 28, 25, 22, 20, 23, 24, 25, 24,
] as const;

const ATRAZINE_VALUES = [
  85, 78, 72, 65, 58, 52, 48, 42, 38, 35, 32, 28, 25, 22, 20, 18, 16, 15, 14, 13, 12, 11, 12, 13, 13, 12,
] as const;

const FLUORIDE_VALUES = [
  0.25, 0.24, 0.23, 0.22, 0.23, 0.21, 0.2, 0.19, 0.18, 0.17, 0.17, 0.16, 0.15, 0.14, 0.13, 0.13, 0.12, 0.12,
  0.11, 0.11, 0.1, 0.1, 0.11, 0.11, 0.11, 0.11,
] as const;

const EE2_SERIES = seriesFromValues(EE2_VALUES);
const PFAS_SERIES = seriesFromValues(PFAS_VALUES);
const ATRAZINE_SERIES = seriesFromValues(ATRAZINE_VALUES);
const FLUORIDE_SERIES = seriesFromValues(FLUORIDE_VALUES);

const EE2_CHART_CONFIG: ChartConfig = {
  value: { label: 'Average EE2 concentration (ng/L)', color: '#ec4899' },
};
const PFAS_CHART_CONFIG: ChartConfig = {
  value: { label: 'Average national PFAS concentration (ng/L)', color: '#38bdf8' },
};
const ATRAZINE_CHART_CONFIG: ChartConfig = {
  value: { label: 'Average atrazine concentration (ng/L)', color: '#a3e635' },
};
const FLUORIDE_CHART_CONFIG: ChartConfig = {
  value: { label: 'Average fluoride concentration (mg/L)', color: '#c084fc' },
};

const EE2_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Berlin', value: '1.2' },
  { rank: 2, city: 'Frankfurt am Main', value: '1.1' },
  { rank: 3, city: 'Hamburg', value: '1.0' },
  { rank: 4, city: 'Munich', value: '0.9' },
  { rank: 5, city: 'Cologne', value: '0.9' },
  { rank: 6, city: 'Stuttgart', value: '0.8' },
  { rank: 7, city: 'Düsseldorf', value: '0.8' },
  { rank: 8, city: 'Dortmund', value: '0.7' },
  { rank: 9, city: 'Essen', value: '0.7' },
  { rank: 10, city: 'Leipzig', value: '0.6' },
];

const PFAS_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Rastatt (Baden-Württemberg)', value: '1,500+' },
  { rank: 2, city: 'Cologne', value: '80' },
  { rank: 3, city: 'Berlin', value: '57' },
  { rank: 4, city: 'Frankfurt am Main', value: '45' },
  { rank: 5, city: 'Hamburg', value: '38' },
  { rank: 6, city: 'Nuremberg', value: '35' },
  { rank: 7, city: 'Dortmund', value: '32' },
  { rank: 8, city: 'Düsseldorf', value: '30' },
  { rank: 9, city: 'Stuttgart', value: '28' },
  { rank: 10, city: 'Munich', value: '25' },
];

const ATRAZINE_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Rastatt Area (Baden-Württemberg)', value: '45' },
  { rank: 2, city: 'Cologne', value: '28' },
  { rank: 3, city: 'Frankfurt am Main', value: '25' },
  { rank: 4, city: 'Berlin', value: '22' },
  { rank: 5, city: 'Hamburg', value: '20' },
  { rank: 6, city: 'Nuremberg', value: '18' },
  { rank: 7, city: 'Stuttgart', value: '17' },
  { rank: 8, city: 'Dortmund', value: '16' },
  { rank: 9, city: 'Düsseldorf', value: '15' },
  { rank: 10, city: 'Munich', value: '14' },
];

const FLUORIDE_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Berlin', value: '0.22' },
  { rank: 2, city: 'Frankfurt am Main', value: '0.19' },
  { rank: 3, city: 'Hamburg', value: '0.18' },
  { rank: 4, city: 'Cologne', value: '0.17' },
  { rank: 5, city: 'Stuttgart', value: '0.16' },
  { rank: 6, city: 'Munich', value: '0.15' },
  { rank: 7, city: 'Düsseldorf', value: '0.15' },
  { rank: 8, city: 'Dortmund', value: '0.14' },
  { rank: 9, city: 'Nuremberg', value: '0.14' },
  { rank: 10, city: 'Essen', value: '0.13' },
];

type SuppressionBlockProps = {
  subheading: string;
  note: string;
  chartConfig: ChartConfig;
  stroke: string;
  data: YearPoint[];
  yTickFormatter?: (v: number) => string;
  valueDecimals?: number;
  tableTitle: string;
  locationHeader: string;
  estimateHeader: string;
  rows: { rank: number; city: string; value: string }[];
};

function SuppressionBlock({
  subheading,
  note,
  chartConfig,
  stroke,
  data,
  yTickFormatter,
  valueDecimals = 1,
  tableTitle,
  locationHeader,
  estimateHeader,
  rows,
}: SuppressionBlockProps) {
  const dataKey = 'value';
  const formatTooltipValue = (v: unknown) => {
    const n = Number(v);
    if (!Number.isFinite(n)) return String(v ?? '');
    return valueDecimals > 0 && n % 1 !== 0 ? n.toFixed(valueDecimals) : String(n);
  };

  return (
    <Card className="border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2 sm:p-5 sm:pb-3">
        <CardTitle className="font-sans text-base font-semibold text-neutral-100">{subheading}</CardTitle>
        <CardDescription className="font-sans text-xs leading-relaxed text-neutral-400">{note}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-4 pt-0 sm:p-5 sm:pt-0">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-4">
          <div className="min-w-0 flex-1">
            <ChartContainer config={chartConfig} className="h-[400px] w-full sm:h-[440px] lg:h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 8, right: 10, left: 2, bottom: 64 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis
                    dataKey="year"
                    type="category"
                    interval={0}
                    tick={{
                      fill: 'rgba(163,163,163,0.9)',
                      fontSize: 9,
                      fontFamily: 'ui-sans-serif',
                    }}
                    tickFormatter={(value) => String(value)}
                    angle={-42}
                    textAnchor="end"
                    height={58}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={yTickFormatter ?? ((v) => String(v))}
                    tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                    axisLine={false}
                    tickLine={false}
                    width={44}
                  />
                  <ChartTooltip
                    cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                    content={
                      <ChartTooltipContent
                        className="rounded-md"
                        formatter={(value) => formatTooltipValue(value)}
                        labelFormatter={(label) => `Year ${String(label)}`}
                      />
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey={dataKey}
                    stroke={stroke}
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    activeDot={{ r: 4 }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div className="w-full shrink-0 lg:w-[min(380px,100%)] lg:-translate-y-[100px]">
            <div className="rounded-md border border-line">
              <div className="border-b border-white/[0.06] bg-surface-metric px-3 py-2 sm:px-3 sm:py-2.5">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-neutral-300">
                  {tableTitle}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full caption-bottom text-sm">
                  <TableHeader className="bg-surface-metric">
                    <TableRow className="border-white/[0.06] hover:bg-transparent">
                      <TableHead className="h-auto w-11 whitespace-nowrap py-2 text-neutral-400">Rank</TableHead>
                      <TableHead className="h-auto min-w-0 py-2 text-neutral-400">{locationHeader}</TableHead>
                      <TableHead className="h-auto max-w-[min(12rem,40vw)] py-2 text-right text-[10px] font-medium leading-snug text-neutral-400 sm:max-w-[14rem]">
                        {estimateHeader}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((r) => (
                      <TableRow key={r.rank} className="border-white/[0.06]">
                        <TableCell className="py-1.5 tabular-nums text-neutral-500">{r.rank}</TableCell>
                        <TableCell className="py-1.5 text-neutral-200">{r.city}</TableCell>
                        <TableCell className="py-1.5 text-right tabular-nums text-neutral-100">{r.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const GermanyHealthSuppressionSection = memo(function GermanyHealthSuppressionSection() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="font-sans text-lg font-semibold tracking-tight text-neutral-100">Main Chemicals</h3>
      </div>

      <SuppressionBlock
        subheading="Synthetic Estrogens"
        note="17α-Ethinylestradiol and EE2 from birth-control pills."
        chartConfig={EE2_CHART_CONFIG}
        stroke="#ec4899"
        data={EE2_SERIES}
        yTickFormatter={(v) => (Number.isInteger(v) ? String(v) : v.toFixed(1))}
        valueDecimals={1}
        tableTitle="Top 10 Worst Cities"
        locationHeader="City"
        estimateHeader="Estimated average EE2 (ng/L) in local rivers / STP effluent"
        rows={EE2_TOP_CITIES}
      />

      <SuppressionBlock
        subheading="Forever Chemicals"
        note="ΣPFAS in surface water / rivers, ng/L – main indicator for endocrine-disrupting potential."
        chartConfig={PFAS_CHART_CONFIG}
        stroke="#38bdf8"
        data={PFAS_SERIES}
        yTickFormatter={(v) => String(Math.round(v))}
        valueDecimals={0}
        tableTitle="Top 10 Worst Cities"
        locationHeader="City / area"
        estimateHeader="Estimated average PFAS level (ng/L in local rivers / groundwater)"
        rows={PFAS_TOP_CITIES}
      />

      <SuppressionBlock
        subheading="Atrazine Concentrations in Germany"
        note="ng/L – average national levels; Atrazine banned since 1991."
        chartConfig={ATRAZINE_CHART_CONFIG}
        stroke="#a3e635"
        data={ATRAZINE_SERIES}
        yTickFormatter={(v) => String(Math.round(v))}
        valueDecimals={0}
        tableTitle="Top 10 Worst Cities"
        locationHeader="City / region"
        estimateHeader="Estimated average atrazine (ng/L)"
        rows={ATRAZINE_TOP_CITIES}
      />

      <SuppressionBlock
        subheading="Fluoride Levels"
        note="Average national concentration in mg/L."
        chartConfig={FLUORIDE_CHART_CONFIG}
        stroke="#c084fc"
        data={FLUORIDE_SERIES}
        yTickFormatter={(v) => v.toFixed(2)}
        valueDecimals={2}
        tableTitle="Top 10 Worst Cities"
        locationHeader="City / region"
        estimateHeader="Average fluoride (mg/L)"
        rows={FLUORIDE_TOP_CITIES}
      />
    </div>
  );
});
