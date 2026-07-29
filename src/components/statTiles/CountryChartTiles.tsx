import { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '../ui/chart';
import { CHART_AXIS_FONT, MetricTile, SourceLinks } from '../statTilePrimitives';
import type { CountryStatMetric } from '../../types/countryStats';
import {
  GERMANY_BIRTHS_BY_RACE_CHART_CONFIG,
  GERMANY_BIRTHS_BY_RACE_SERIES,
  GERMANY_LGBT_IDENTIFICATION_CHART_CONFIG,
  GERMANY_LGBT_IDENTIFICATION_SERIES,
  GERMANY_MIXED_RACE_BIRTHS_CHART_CONFIG,
  GERMANY_MIXED_RACE_BIRTHS_SERIES,
  GERMANY_SUICIDE_RATE_CHART_CONFIG,
  GERMANY_SUICIDE_RATE_SERIES,
  GERMANY_TESTOSTERONE_MEN_CHART_CONFIG,
  GERMANY_TESTOSTERONE_MEN_SERIES,
  GERMANY_TOTAL_BIRTHS_SERIES,
  type GermanyBirthsByRaceRow,
  type GermanyBirthsSeriesRow,
  type GermanyGdpRow,
  type GermanyInflationSeriesRow,
  type GermanyLgbtIdentificationRow,
  type GermanyMixedRaceBirthsRow,
  type GermanySuicideRateRow,
  type GermanyTestosteroneMenRow,
} from '../../lib/countryDashboardSeries';

/**
 * Recharts-backed metric tiles, split out of `CountryStatsDashboard` so the
 * ~118 kB gzip recharts bundle stays off the country-page critical path. The
 * dashboard pulls this module in through `React.lazy`, so recharts only
 * downloads once a section that actually plots something is rendered.
 */

export function GermanySuicideRatesChartTile({
  series = GERMANY_SUICIDE_RATE_SERIES,
  description = 'Rate per 100,000 inhabitants (official Destatis + WHO data)',
}: {
  series?: readonly GermanySuicideRateRow[];
  description?: string;
}) {
  return (
    <Card className="col-span-full border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2 sm:p-5 sm:pb-3">
        <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          Suicide rates
        </CardTitle>
        <CardDescription className="font-sans text-[10px] uppercase tracking-[0.03em] text-neutral-500">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0">
        <ChartContainer config={GERMANY_SUICIDE_RATE_CHART_CONFIG} className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[...series]} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                interval={2}
              />
              <YAxis
                domain={['dataMin - 0.5', 'dataMax + 0.5']}
                tickFormatter={(v) => Number(v).toFixed(1)}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <ChartTooltip
                cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                content={
                  <ChartTooltipContent
                    className="rounded-md"
                    labelFormatter={(label) => `Year ${String(label)}`}
                    formatter={(value) => [`${Number(value).toFixed(1)} per 100,000`, 'Suicide rate']}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="suicidePer100k"
                name="Suicide rate (per 100,000)"
                stroke="#94a3b8"
                strokeWidth={2.5}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function GermanyTestosteroneMenChartTile({
  series = GERMANY_TESTOSTERONE_MEN_SERIES,
}: {
  series?: readonly GermanyTestosteroneMenRow[];
}) {
  return (
    <Card className="col-span-full border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2 sm:p-5 sm:pb-3">
        <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          Testosterone in men
        </CardTitle>
        <CardDescription className="font-sans text-[10px] uppercase tracking-[0.03em] text-neutral-500">
          Average total testosterone (ng/dL)
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0">
        <ChartContainer config={GERMANY_TESTOSTERONE_MEN_CHART_CONFIG} className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[...series]} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                interval={2}
              />
              <YAxis
                domain={['dataMin - 8', 'dataMax + 8']}
                tickFormatter={(v) => String(Math.round(Number(v)))}
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
                    labelFormatter={(label) => `Year ${String(label)}`}
                    formatter={(value) => {
                      const n = Number(value);
                      return Number.isFinite(n) ? `${Math.round(n).toLocaleString('en-US')} ng/dL` : '—';
                    }}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="avgTotalTestosteroneNgDl"
                name="Avg. total testosterone (ng/dL)"
                stroke="#f97316"
                strokeWidth={2.5}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function GermanyLgbtPopulationIdentificationChartTile({
  series = GERMANY_LGBT_IDENTIFICATION_SERIES,
}: {
  series?: readonly GermanyLgbtIdentificationRow[];
}) {
  return (
    <Card className="col-span-full border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2 sm:p-5 sm:pb-3">
        <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          Population identifying as LGBT
        </CardTitle>
        <CardDescription className="font-sans text-[10px] uppercase tracking-[0.03em] text-neutral-500">
          Share of population (%) by identity (2000–2025)
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0">
        <ChartContainer config={GERMANY_LGBT_IDENTIFICATION_CHART_CONFIG} className="h-[360px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[...series]} margin={{ top: 8, right: 12, left: 4, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                interval={2}
              />
              <YAxis
                domain={[0, 'dataMax + 1']}
                tickFormatter={(v) => `${Number(v).toFixed(1)}%`}
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
                    labelFormatter={(label) => `Year ${String(label)}`}
                    formatter={(value) => `${Number(value).toFixed(1)}%`}
                  />
                }
              />
              <Legend wrapperStyle={{ fontSize: '10px', color: 'rgba(212,212,212,0.9)' }} iconType="line" />
              <Line
                type="monotone"
                dataKey="lgbtTotalPct"
                name="% LGBT total"
                stroke="#a78bfa"
                strokeWidth={2.8}
                strokeDasharray="6 4"
                dot={false}
                isAnimationActive={false}
              />
              <Line type="monotone" dataKey="gayMenPct" name="% Gay (men)" stroke="#38bdf8" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line
                type="monotone"
                dataKey="lesbianWomenPct"
                name="% Lesbian (women)"
                stroke="#e879f9"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
              <Line type="monotone" dataKey="bisexualPct" name="% Bisexual" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line
                type="monotone"
                dataKey="transNonBinaryPct"
                name="% Transgender / non-binary"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function GermanyBirthsLineChartTile({
  series = GERMANY_TOTAL_BIRTHS_SERIES,
  title = 'Total births per year (Germany)',
  nativeLabel = 'German',
  foreignLabel = 'foreign',
  note = 'German mothers are defined by citizenship at time of birth (includes naturalized immigrants and descendants). Share declines from about 82% in the early 2000s to 71.3% in 2024. 2025 values are estimated from the continuing trend.',
  sourceNote = 'Sources: Destatis (Federal Statistical Office), Statista, and Destatis statistical reports on births by citizenship.',
}: {
  series?: readonly GermanyBirthsSeriesRow[];
  title?: string;
  nativeLabel?: string;
  foreignLabel?: string;
  note?: string;
  sourceNote?: string;
} = {}) {
  const resolvedNativeLabel = title.includes('France') ? 'France-born' : nativeLabel;
  const chartConfig: ChartConfig = {
    totalLiveBirths: { label: 'Total live births', color: '#f59e0b' },
    birthsGermanMothers: { label: `Births to ${resolvedNativeLabel} mothers`, color: '#22c55e' },
    birthsForeignMothers: { label: `Births to ${foreignLabel} mothers`, color: '#60a5fa' },
  };

  return (
    <Card className="col-span-full border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2 sm:p-5 sm:pb-3">
        <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-0 sm:p-5 sm:pt-0">
        <ChartContainer config={chartConfig} className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[...series]} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(value) => `${Math.round(Number(value) / 1000)}k`}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                width={52}
              />
              <ChartTooltip
                cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                content={
                  <ChartTooltipContent
                    className="rounded-md"
                    formatter={(value, name, item) => {
                      const numericValue = Number(value);
                      const row = (item as { payload?: GermanyBirthsSeriesRow } | undefined)?.payload;
                      const pretty = Number.isFinite(numericValue) ? Math.round(numericValue).toLocaleString('en-US') : '—';
                      const label = String(name);
                      if (label === 'birthsGermanMothers') {
                        return [`${pretty}${row ? ` (${row.shareGermanMothersPct.toFixed(1)}%)` : ''}`, `${resolvedNativeLabel} mothers`];
                      }
                      if (label === 'birthsForeignMothers') {
                        return [`${pretty}`, `${foreignLabel} mothers`];
                      }
                      return [`${pretty}`, ' Total live births'];
                    }}
                    labelFormatter={(label, payload) => {
                      const row = (payload as { payload?: GermanyBirthsSeriesRow }[] | undefined)?.[0]?.payload;
                      return row?.isEstimate ? `Year ${String(label)} (estimate)` : `Year ${String(label)}`;
                    }}
                  />
                }
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', color: 'rgba(212,212,212,0.9)' }}
                iconType="line"
              />
              <Line
                type="monotone"
                dataKey="totalLiveBirths"
                name="Total live births"
                stroke="#f59e0b"
                strokeWidth={2.5}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="birthsGermanMothers"
                name={`Births to ${resolvedNativeLabel} mothers`}
                stroke="#22c55e"
                strokeWidth={2.5}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="birthsForeignMothers"
                name={`Births to ${foreignLabel} mothers`}
                stroke="#60a5fa"
                strokeWidth={2.5}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        <p className="font-sans text-[10px] leading-relaxed text-neutral-500">{note}</p>
        <p className="font-sans text-[10px] leading-relaxed text-neutral-600 uppercase tracking-[0.03em]">{sourceNote}</p>
      </CardContent>
    </Card>
  );
}

const GERMANY_BIRTHS_BY_RACE_LABELS = {
  germanNativeNoMigrationBg: 'German Native (no migration bg)',
  europeanNonGerman: 'European (non-German)',
  african: 'African',
  asian: 'Asian',
  southAmerican: 'South American',
  northAmerican: 'North American',
  otherUnknown: 'Other / Unknown',
};

export function GermanyBirthsByRaceChartTile({
  series = GERMANY_BIRTHS_BY_RACE_SERIES,
  title = 'Births by race / regional origin (Germany)',
  description = 'Live births by category, stacked (2000–2025)',
  labels = GERMANY_BIRTHS_BY_RACE_LABELS,
}: {
  series?: readonly GermanyBirthsByRaceRow[];
  title?: string;
  description?: string;
  labels?: typeof GERMANY_BIRTHS_BY_RACE_LABELS;
} = {}) {
  // Tooltip series names come from the config, so rebuild it from `labels` (keeping the colors).
  const chartConfig: ChartConfig = {
    germanNativeNoMigrationBg: { label: labels.germanNativeNoMigrationBg, color: GERMANY_BIRTHS_BY_RACE_CHART_CONFIG.germanNativeNoMigrationBg.color },
    europeanNonGerman: { label: labels.europeanNonGerman, color: GERMANY_BIRTHS_BY_RACE_CHART_CONFIG.europeanNonGerman.color },
    african: { label: labels.african, color: GERMANY_BIRTHS_BY_RACE_CHART_CONFIG.african.color },
    asian: { label: labels.asian, color: GERMANY_BIRTHS_BY_RACE_CHART_CONFIG.asian.color },
    southAmerican: { label: labels.southAmerican, color: GERMANY_BIRTHS_BY_RACE_CHART_CONFIG.southAmerican.color },
    northAmerican: { label: labels.northAmerican, color: GERMANY_BIRTHS_BY_RACE_CHART_CONFIG.northAmerican.color },
    otherUnknown: { label: labels.otherUnknown, color: GERMANY_BIRTHS_BY_RACE_CHART_CONFIG.otherUnknown.color },
  };
  return (
    <Card className="col-span-full border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2 sm:p-5 sm:pb-3">
        <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          {title}
        </CardTitle>
        <CardDescription className="font-sans text-[10px] uppercase tracking-[0.03em] text-neutral-500">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-0 sm:p-5 sm:pt-0">
        <ChartContainer config={chartConfig} className="h-[360px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[...series]} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                interval={2}
              />
              <YAxis
                tickFormatter={(value) => `${Math.round(Number(value) / 1000)}k`}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <ChartTooltip
                cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                content={
                  <ChartTooltipContent
                    className="rounded-md max-w-[min(100vw-2rem,22rem)]"
                    labelFormatter={(label) => `Year ${String(label)}`}
                    formatter={(value) => {
                      const n = Number(value);
                      return Number.isFinite(n) ? n.toLocaleString('en-US') : '—';
                    }}
                  />
                }
              />
              <Legend wrapperStyle={{ fontSize: '10px', color: 'rgba(212,212,212,0.9)' }} iconType="square" />
              <Area
                type="monotone"
                dataKey="germanNativeNoMigrationBg"
                name={labels.germanNativeNoMigrationBg}
                stackId="race"
                stroke="#15803d"
                fill="#22c55e"
                fillOpacity={0.9}
                strokeWidth={0.5}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="europeanNonGerman"
                name={labels.europeanNonGerman}
                stackId="race"
                stroke="#0284c7"
                fill="#38bdf8"
                fillOpacity={0.9}
                strokeWidth={0.5}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="african"
                name={labels.african}
                stackId="race"
                stroke="#7c3aed"
                fill="#a78bfa"
                fillOpacity={0.9}
                strokeWidth={0.5}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="asian"
                name={labels.asian}
                stackId="race"
                stroke="#db2777"
                fill="#f472b6"
                fillOpacity={0.9}
                strokeWidth={0.5}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="southAmerican"
                name={labels.southAmerican}
                stackId="race"
                stroke="#d97706"
                fill="#f59e0b"
                fillOpacity={0.9}
                strokeWidth={0.5}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="northAmerican"
                name={labels.northAmerican}
                stackId="race"
                stroke="#64748b"
                fill="#94a3b8"
                fillOpacity={0.9}
                strokeWidth={0.5}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="otherUnknown"
                name={labels.otherUnknown}
                stackId="race"
                stroke="#475569"
                fill="#64748b"
                fillOpacity={0.9}
                strokeWidth={0.5}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function GermanyMixedRaceBirthsChartTile({
  series = GERMANY_MIXED_RACE_BIRTHS_SERIES,
  title = 'Mixed race births (Germany)',
  description = 'Live births by German / non-German parent pairing (2000–2025)',
  femaleLabel = 'German female + non-German male',
  maleLabel = 'German male + non-German female',
}: {
  series?: readonly GermanyMixedRaceBirthsRow[];
  title?: string;
  description?: string;
  femaleLabel?: string;
  maleLabel?: string;
} = {}) {
  // Tooltip series names come from the config, so rebuild it from the label props.
  const chartConfig: ChartConfig = {
    germanFemaleNonGermanMaleBirths: { label: femaleLabel, color: GERMANY_MIXED_RACE_BIRTHS_CHART_CONFIG.germanFemaleNonGermanMaleBirths.color },
    germanMaleNonGermanFemaleBirths: { label: maleLabel, color: GERMANY_MIXED_RACE_BIRTHS_CHART_CONFIG.germanMaleNonGermanFemaleBirths.color },
    totalMixedBirths: { label: GERMANY_MIXED_RACE_BIRTHS_CHART_CONFIG.totalMixedBirths.label, color: GERMANY_MIXED_RACE_BIRTHS_CHART_CONFIG.totalMixedBirths.color },
  };
  const shownDescription = title.includes('France')
    ? 'Live births with one France-born and one foreign-born parent (official INSEE data, 2020–2025)'
    : description;
  return (
    <Card className="col-span-full border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2 sm:p-5 sm:pb-3">
        <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          {title}
        </CardTitle>
        <CardDescription className="font-sans text-[10px] uppercase tracking-[0.03em] text-neutral-500">
          {shownDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-0 sm:p-5 sm:pt-0">
        <ChartContainer config={chartConfig} className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[...series]} margin={{ top: 8, right: 10, left: 4, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                interval={2}
              />
              <YAxis
                tickFormatter={(value) => `${Math.round(Number(value) / 1000)}k`}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <ChartTooltip
                cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                content={
                  <ChartTooltipContent
                    className="rounded-md"
                    labelFormatter={(label) => `Year ${String(label)}`}
                    formatter={(value) => {
                      const n = Number(value);
                      return Number.isFinite(n) ? n.toLocaleString('en-US') : '—';
                    }}
                  />
                }
              />
              <Legend wrapperStyle={{ fontSize: '10px', color: 'rgba(212,212,212,0.9)' }} iconType="line" />
              <Line
                type="monotone"
                dataKey="germanFemaleNonGermanMaleBirths"
                name={femaleLabel}
                stroke="#f59e0b"
                strokeWidth={2.2}
                dot={{ r: 2 }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="germanMaleNonGermanFemaleBirths"
                name={maleLabel}
                stroke="#f43f5e"
                strokeWidth={2.2}
                dot={{ r: 2 }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="totalMixedBirths"
                name="Total mixed births"
                stroke="#a78bfa"
                strokeWidth={2.6}
                strokeDasharray="6 4"
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function GermanyBirthRatesEducationTile() {
  return (
    <Card className="overflow-hidden border-line bg-surface-metric shadow-card lg:col-span-2 lg:self-start">
      <div className="p-2 pb-0">
        <div className="font-sans text-[14px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
          Fertility by mothers&apos; education
        </div>
      </div>
      <div className="p-2 pt-1 pb-2 font-sans text-[16px] leading-tight text-neutral-200">
        <div>
          Low education (no upper secondary):{' '}
          <span className="font-bold text-neutral-50">1.68</span> children per woman
        </div>
        <div>
          Medium education:{' '}
          <span className="font-bold text-neutral-50">1.41</span> children per woman
        </div>
        <div>
          High education (university):{' '}
          <span className="font-bold text-neutral-50">1.12</span> children per woman
        </div>
      </div>
    </Card>
  );
}

export function FranceBirthRatesEducationTile() {
  const rows = [
    {
      education: 'Below baccalaureate / no diploma',
      immigrant: '2.71',
      descendant: '1.99',
      noDirectMigration: '2.05',
    },
    {
      education: 'Baccalaureate',
      immigrant: '2.19',
      descendant: '1.92',
      noDirectMigration: '1.87',
    },
    {
      education: 'Higher education',
      immigrant: '1.75',
      descendant: '1.74',
      noDirectMigration: '1.62',
    },
  ] as const;

  return (
    <Card className={'overflow-hidden border-line bg-surface-metric shadow-card lg:col-start-1 lg:col-span-3 lg:self-start'}>
      <CardHeader className={'p-4 pb-2 sm:p-5 sm:pb-2'}>
        <CardTitle className={'font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500'}>
          Fertility by mothers&apos; education
        </CardTitle>
        <CardDescription className={'font-sans text-[11px] leading-relaxed text-neutral-400'}>
          Completed fertility (children per woman), women born 1960–1974 · Metropolitan France · 2019–2020
        </CardDescription>
      </CardHeader>
      <CardContent className={'px-4 pb-4 sm:px-5 sm:pb-5'}>
        <div className={'overflow-x-auto'}>
          <div className={'min-w-[620px]'}>
            <div className={'grid grid-cols-[minmax(190px,1.5fr)_repeat(3,minmax(110px,1fr))] gap-x-4 border-b border-white/[0.08] pb-2 font-sans text-[10px] leading-tight text-neutral-500'}>
              <span>Education</span>
              <span>Immigrant</span>
              <span>Immigrant descendant</span>
              <span>No direct migration background</span>
            </div>
            <div className={'divide-y divide-white/[0.06]'}>
              {rows.map((item) => (
                <div
                  key={item.education}
                  className={'grid grid-cols-[minmax(190px,1.5fr)_repeat(3,minmax(110px,1fr))] items-center gap-x-4 py-2.5 font-sans'}
                >
                  <span className={'text-xs text-neutral-300'}>{item.education}</span>
                  <span className={'text-sm font-semibold text-neutral-50'}>{item.immigrant}</span>
                  <span className={'text-sm font-semibold text-neutral-50'}>{item.descendant}</span>
                  <span className={'text-sm font-semibold text-neutral-50'}>{item.noDirectMigration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={'mt-2 border-t border-white/[0.06] pt-2'}>
          <SourceLinks
            url={'https://www.insee.fr/fr/statistiques/6801884'}
            className={'inline-flex w-fit items-center gap-1 font-sans text-[10px] text-[var(--uk-accent)] hover:text-neutral-200'}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function ItalyBirthRatesEducationTile() {
  const rows = [
    { education: 'Lower secondary certificate', fertility: '1.59', meanAge: '29.6 years' },
    { education: 'Upper secondary diploma', fertility: '1.12', meanAge: '32.3 years' },
    { education: 'University degree', fertility: '1.12', meanAge: '34.8 years' },
  ] as const;

  return (
    <Card className="overflow-hidden border-line bg-surface-metric shadow-card lg:col-start-1 lg:col-span-3 lg:self-start">
      <CardHeader className="p-4 pb-2 sm:p-5 sm:pb-2">
        <CardTitle className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
          Fertility and maternal age by education
        </CardTitle>
        <CardDescription className="font-sans text-[11px] leading-relaxed text-neutral-400">
          Total fertility rate and mean age at childbirth by mothers&apos; highest qualification · Italy · 2024
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4 sm:px-5 sm:pb-5">
        <div className="overflow-x-auto">
          <div className="min-w-[520px]">
            <div className="grid grid-cols-[minmax(220px,1.5fr)_repeat(2,minmax(120px,1fr))] gap-x-4 border-b border-white/[0.08] pb-2 font-sans text-[10px] leading-tight text-neutral-500">
              <span>Education</span>
              <span>Children per woman</span>
              <span>Mean age</span>
            </div>
            <div className="divide-y divide-white/[0.06]">
              {rows.map((item) => (
                <div
                  key={item.education}
                  className="grid grid-cols-[minmax(220px,1.5fr)_repeat(2,minmax(120px,1fr))] items-center gap-x-4 py-2.5 font-sans"
                >
                  <span className="text-xs text-neutral-300">{item.education}</span>
                  <span className="text-sm font-semibold text-neutral-50">{item.fertility}</span>
                  <span className="text-sm font-semibold text-neutral-50">{item.meanAge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-2 border-t border-white/[0.06] pt-2">
          <SourceLinks
            url="https://www.istat.it/wp-content/uploads/2026/05/Capitolo-2-9giugno2026.pdf"
            className="inline-flex w-fit items-center gap-1 font-sans text-[10px] text-[var(--uk-accent)] hover:text-neutral-200"
          />
          <p className="mt-1 font-sans text-[10px] leading-relaxed text-neutral-500">
            Source: Istat, Annual Report 2026, chapter 2. Values are period fertility indicators for 2024.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function GermanyHoverSeriesTile({
  row,
  accent,
  data,
  seriesKey,
  title,
  yearRangeLabel,
  yTickFormatter,
  tooltipFormatter,
  yDomain,
  yTicks,
  minHeightClass,
  footnote,
}: {
  row: CountryStatMetric;
  accent?: boolean;
  data: readonly (GermanyGdpRow | GermanyInflationSeriesRow)[];
  seriesKey: 'gdp' | 'gdpPerCapita' | 'inflation';
  title: string;
  yearRangeLabel: string;
  yTickFormatter: (n: number) => string;
  tooltipFormatter: (v: number) => string;
  yDomain?: [number, number];
  yTicks?: number[];
  minHeightClass?: string;
  footnote?: string;
}) {
  const config: ChartConfig = {
    [seriesKey]: { label: title, color: 'var(--uk-accent)' },
  };
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <MetricTile row={row} largeValue accent={accent} minHeightClass={minHeightClass} />
      {hovered ? (
        <div className="pointer-events-none absolute inset-0 z-40">
          <Card className="flex h-full flex-col border-line bg-surface-metric shadow-card ring-1 ring-white/[0.04]">
            <CardHeader className="p-3 pb-1.5">
              <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-300">
                {title} ({yearRangeLabel})
              </CardTitle>
            </CardHeader>
            <CardContent className="flex min-h-0 flex-1 flex-col p-3 pt-0">
              <ChartContainer config={config} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 6, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis
                      dataKey="year"
                      tick={{ fill: 'rgba(212,212,212,0.9)', fontSize: 11, fontWeight: 500, fontFamily: CHART_AXIS_FONT }}
                      axisLine={false}
                      tickLine={false}
                      minTickGap={12}
                    />
                    <YAxis
                      domain={yDomain}
                      ticks={yTicks}
                      tickFormatter={(v) => yTickFormatter(Number(v))}
                      tick={{ fill: 'rgba(212,212,212,0.9)', fontSize: 11, fontWeight: 500, fontFamily: CHART_AXIS_FONT }}
                      axisLine={false}
                      tickLine={false}
                      width={46}
                    />
                    <ChartTooltip
                      cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
                      content={
                        <ChartTooltipContent
                          formatter={(value) => tooltipFormatter(Number(value))}
                          labelFormatter={(label) => `Year ${String(label)}`}
                          className="rounded-md"
                        />
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey={seriesKey}
                      stroke="var(--uk-accent)"
                      fill="var(--uk-accent)"
                      fillOpacity={0.12}
                      strokeWidth={2}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
              {footnote ? (
                <p className="mt-1.5 text-center font-sans text-[10px] font-medium leading-snug text-neutral-500">
                  {footnote}
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
