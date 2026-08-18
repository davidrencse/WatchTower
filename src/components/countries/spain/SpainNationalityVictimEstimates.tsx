import { memo } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import {
  SPAIN_HATE_CRIME_NATIONALITY_CONTEXT_URL,
  SPAIN_INE_CRIME_NATIONALITY_CONTEXT_URL,
  SPAIN_NATIONALITY_ADULT_VICTIM_ESTIMATES,
  SPAIN_NATIONALITY_CHILD_VICTIM_ESTIMATES,
  type SpainNationalityAdultVictimEstimate,
  type SpainNationalityChildVictimEstimate,
} from '../../../lib/countries/spain/spainNationalityVictimEstimates';
import { formatCompact, formatGrouped } from '../../../lib/numberFormat';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '../../ui/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';

type SeriesDefinition<T> = {
  key: Extract<keyof T, string>;
  label: string;
  color: string;
};

const MEN_THEFT = '#38bdf8';
const WOMEN_THEFT = '#f472b6';
const MEN_KILLED = '#fb923c';
const WOMEN_KILLED = '#f87171';
const SEXUAL_ASSAULT = '#e879f9';
const CHILD_THEFT = '#38bdf8';

const ADULT_THEFT_SERIES: readonly SeriesDefinition<SpainNationalityAdultVictimEstimate>[] = [
  { key: 'menTheft', label: 'Spanish men — theft victims', color: MEN_THEFT },
  { key: 'womenTheft', label: 'Spanish women — theft victims', color: WOMEN_THEFT },
];

const ADULT_HOMICIDE_SERIES: readonly SeriesDefinition<SpainNationalityAdultVictimEstimate>[] = [
  { key: 'menKilled', label: 'Spanish men killed', color: MEN_KILLED },
  { key: 'womenKilled', label: 'Spanish women killed', color: WOMEN_KILLED },
];

const ADULT_SEXUAL_ASSAULT_SERIES: readonly SeriesDefinition<SpainNationalityAdultVictimEstimate>[] = [
  { key: 'womenRaped', label: 'Spanish women raped', color: SEXUAL_ASSAULT },
];

const CHILD_THEFT_SERIES: readonly SeriesDefinition<SpainNationalityChildVictimEstimate>[] = [
  { key: 'childrenTheft', label: 'Children theft victims', color: CHILD_THEFT },
];

const CHILD_HOMICIDE_SERIES: readonly SeriesDefinition<SpainNationalityChildVictimEstimate>[] = [
  { key: 'childrenKilled', label: 'Children killed', color: WOMEN_KILLED },
];

const CHILD_SEXUAL_ASSAULT_SERIES: readonly SeriesDefinition<SpainNationalityChildVictimEstimate>[] = [
  { key: 'childrenSexualAssault', label: 'Children raped / sexual-assault victims', color: SEXUAL_ASSAULT },
];

function chartConfig<T>(series: readonly SeriesDefinition<T>[]): ChartConfig {
  return Object.fromEntries(series.map((item) => [item.key, { label: item.label, color: item.color }]));
}

function VictimTrendPanel<T extends { year: string }>({
  title,
  data,
  series,
}: {
  title: string;
  data: readonly T[];
  series: readonly SeriesDefinition<T>[];
}) {
  const config = chartConfig(series);

  return (
    <section className="min-w-0 border-t border-white/[0.06] pt-3" aria-label={title}>
      <h4 className="px-1 font-sans text-xs font-semibold text-neutral-200">{title}</h4>
      <ChartContainer config={config} className="mt-2 h-[250px] w-full font-sans">
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 320, height: 220 }}>
          <LineChart
            accessibilityLayer
            data={data as unknown as Record<string, unknown>[]}
            margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
          >
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="year"
              interval="preserveStartEnd"
              minTickGap={24}
              tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(value) => formatCompact(Number(value))}
              tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
              axisLine={false}
              tickLine={false}
              width={44}
            />
            <ChartTooltip
              cursor={{ stroke: 'rgba(255,255,255,0.14)' }}
              content={
                <ChartTooltipContent
                  className="rounded-md"
                  labelFormatter={(label) => `Year ${String(label)} · modeled estimate`}
                  formatter={(value) => {
                    const numericValue = Number(value);
                    return Number.isFinite(numericValue) ? formatGrouped(numericValue) : '—';
                  }}
                />
              }
            />
            <Legend wrapperStyle={{ fontSize: '10px', color: 'rgba(212,212,212,0.9)' }} iconType="line" />
            {series.map((item) => (
              <Line
                key={item.key}
                type="monotone"
                dataKey={item.key}
                name={item.label}
                stroke={item.color}
                strokeWidth={2.4}
                strokeDasharray="7 3"
                dot={{ r: 1.75 }}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </section>
  );
}

function EstimatesTable<T extends { year: string }>({
  data,
  series,
}: {
  data: readonly T[];
  series: readonly SeriesDefinition<T>[];
}) {
  return (
    <details className="border-t border-white/[0.06] pt-3">
      <summary className="w-fit cursor-pointer font-sans text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-400 hover:text-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--uk-accent)]">
        View annual estimates
      </summary>
      <div className="mt-3 max-h-[390px] overflow-auto rounded-md border border-white/[0.06]">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-neutral-950">
            <TableRow>
              <TableHead>Year</TableHead>
              {series.map((item) => (
                <TableHead key={item.key} className="min-w-40 text-right">
                  {item.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.year}>
                <TableCell className="font-sans tabular-nums text-neutral-300">{row.year}</TableCell>
                {series.map((item) => (
                  <TableCell key={item.key} className="text-right font-sans tabular-nums text-neutral-100">
                    {formatGrouped(Number(row[item.key]))}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </details>
  );
}

function ContextSources() {
  return (
    <div className="border-t border-white/[0.06] pt-3">
      <p className="font-sans text-[11px] leading-relaxed text-neutral-500">
        Context sources only; neither source publishes these reconstructed annual category values.
      </p>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        <a
          href={SPAIN_HATE_CRIME_NATIONALITY_CONTEXT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-[11px] text-[var(--uk-accent)] hover:text-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--uk-accent)]"
        >
          Interior Ministry · 2024 hate-crime victim nationality ↗
        </a>
        <a
          href={SPAIN_INE_CRIME_NATIONALITY_CONTEXT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-[11px] text-[var(--uk-accent)] hover:text-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--uk-accent)]"
        >
          INE · crime statistics by nationality ↗
        </a>
      </div>
    </div>
  );
}

function EstimateHeader({
  title,
  description,
  note,
}: {
  title: string;
  description: string;
  note: string;
}) {
  return (
    <CardHeader className="space-y-3 border-b border-white/[0.06] p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <CardTitle className="font-sans text-sm font-semibold uppercase tracking-[0.08em] text-neutral-100">
            {title}
          </CardTitle>
          <CardDescription className="max-w-3xl font-sans text-[11px] leading-relaxed text-neutral-400">
            {description}
          </CardDescription>
        </div>
        <span className="w-fit shrink-0 rounded-sm border border-amber-400/40 bg-amber-400/[0.1] px-2 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-200">
          Modeled estimates
        </span>
      </div>
      <p className="max-w-4xl border-t border-white/[0.06] pt-3 font-sans text-[11px] leading-relaxed text-neutral-400">
        {note}
      </p>
    </CardHeader>
  );
}

const ADULT_TABLE_SERIES = [
  ...ADULT_THEFT_SERIES,
  ...ADULT_HOMICIDE_SERIES,
  ...ADULT_SEXUAL_ASSAULT_SERIES,
] as const;

const CHILD_TABLE_SERIES = [
  ...CHILD_THEFT_SERIES,
  ...CHILD_HOMICIDE_SERIES,
  ...CHILD_SEXUAL_ASSAULT_SERIES,
] as const;

export const SpainNationalityVictimEstimates = memo(function SpainNationalityVictimEstimates() {
  return (
    <div className="flex flex-col gap-4">
      <Card className="overflow-hidden border-line bg-surface-metric shadow-card">
        <EstimateHeader
          title="Spanish-nationality victims — modeled trends"
          description="Dashboard reconstruction by sex and victim category, 2000–2025. Aligned small multiples preserve each category's scale."
          note="Spain does not publish a continuous ‘White native Spaniards’ victim series. Spanish nationality is the closest usable grouping, but it is a legal nationality—not a racial or ancestry category—and every value plotted below is a modeled dashboard estimate."
        />
        <CardContent className="space-y-4 p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <VictimTrendPanel
              title="Theft victims"
              data={SPAIN_NATIONALITY_ADULT_VICTIM_ESTIMATES}
              series={ADULT_THEFT_SERIES}
            />
            <VictimTrendPanel
              title="People killed"
              data={SPAIN_NATIONALITY_ADULT_VICTIM_ESTIMATES}
              series={ADULT_HOMICIDE_SERIES}
            />
            <VictimTrendPanel
              title="Women raped"
              data={SPAIN_NATIONALITY_ADULT_VICTIM_ESTIMATES}
              series={ADULT_SEXUAL_ASSAULT_SERIES}
            />
          </div>
          <ContextSources />
          <EstimatesTable data={SPAIN_NATIONALITY_ADULT_VICTIM_ESTIMATES} series={ADULT_TABLE_SERIES} />
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-line bg-surface-metric shadow-card">
        <EstimateHeader
          title="Spanish-nationality children — modeled trends"
          description="Dashboard reconstruction for child theft, sexual-assault, and homicide victims, 2000–2025."
          note="Spain does not publish child-victim statistics under a ‘White native children’ category. Spanish-nationality children is the closest usable label here; these are reconstructed dashboard estimates, not official Spanish race-specific observations."
        />
        <CardContent className="space-y-4 p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <VictimTrendPanel
              title="Theft victims"
              data={SPAIN_NATIONALITY_CHILD_VICTIM_ESTIMATES}
              series={CHILD_THEFT_SERIES}
            />
            <VictimTrendPanel
              title="Children killed"
              data={SPAIN_NATIONALITY_CHILD_VICTIM_ESTIMATES}
              series={CHILD_HOMICIDE_SERIES}
            />
            <VictimTrendPanel
              title="Rape / sexual-assault victims"
              data={SPAIN_NATIONALITY_CHILD_VICTIM_ESTIMATES}
              series={CHILD_SEXUAL_ASSAULT_SERIES}
            />
          </div>
          <ContextSources />
          <EstimatesTable data={SPAIN_NATIONALITY_CHILD_VICTIM_ESTIMATES} series={CHILD_TABLE_SERIES} />
        </CardContent>
      </Card>
    </div>
  );
});
