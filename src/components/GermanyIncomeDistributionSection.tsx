import { memo, useCallback, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import {
  formatIncomeCount,
  formatIncomeEuro,
  GERMANY_INCOME_DISTRIBUTION_GROUPS,
  GERMANY_INCOME_QUINTILES,
  germanyIncomeGroupById,
  type GermanyIncomeGroupRow,
} from '../lib/germanyIncomeDistribution';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from './ui/chart';

const UC = 'font-sans text-[10px] font-semibold uppercase tracking-[0.18em]';

const INCOME_SHARE_CHART_CONFIG = GERMANY_INCOME_QUINTILES.reduce(
  (acc, g) => {
    acc[g.id] = { label: g.label, color: g.color };
    return acc;
  },
  { share: { label: 'Income share', color: '#f59e0b' } } as ChartConfig,
);

const AVG_INCOME_CHART_CONFIG = GERMANY_INCOME_DISTRIBUTION_GROUPS.reduce(
  (acc, g) => {
    acc[g.id] = { label: g.shortLabel, color: g.color };
    return acc;
  },
  { income: { label: 'Avg. net income', color: '#22d3ee' } } as ChartConfig,
);

function GroupSelector({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {GERMANY_INCOME_DISTRIBUTION_GROUPS.map((g) => {
        const active = g.id === selectedId;
        return (
          <button
            key={g.id}
            type="button"
            onClick={() => onSelect(g.id)}
            className={
              active
                ? 'rounded-md border px-2.5 py-1 font-sans text-[10px] font-medium tabular-nums shadow-sm transition'
                : 'rounded-md border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 font-sans text-[10px] font-medium text-neutral-500 transition hover:border-white/[0.14] hover:text-neutral-300'
            }
            style={
              active
                ? {
                    borderColor: `${g.color}66`,
                    backgroundColor: `${g.color}18`,
                    color: g.color,
                  }
                : undefined
            }
          >
            {g.shortLabel}
          </button>
        );
      })}
    </div>
  );
}

function SelectedGroupHero({ group }: { group: GermanyIncomeGroupRow }) {
  return (
    <Card className="border-line bg-surface-metric shadow-card" style={{ borderColor: `${group.color}33` }}>
      <CardHeader className="space-y-2 p-4 pb-2 sm:p-5 sm:pb-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="font-sans text-lg font-semibold tracking-tight text-neutral-100 sm:text-xl">
              {group.label}
            </CardTitle>
            <CardDescription className="mt-1 font-sans text-[11px] text-neutral-500">
              {group.tier === 'top_subset' ? 'Subset within top earners · ' : 'Population quintile · '}
              {formatIncomeCount(group.people)} people · {formatIncomeCount(group.households)} households
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="font-sans text-3xl font-semibold tabular-nums leading-none" style={{ color: group.color }}>
              {group.incomeSharePct}%
            </p>
            <p className="mt-1 font-sans text-[10px] uppercase tracking-wider text-neutral-500">of total income</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3 p-4 pt-0 sm:grid-cols-3 lg:grid-cols-6 sm:p-5 sm:pt-0">
        <StatPill label="Avg. net income" value={group.avgNetIncomeDisplay} accent={group.color} />
        <StatPill label="Migration background" value={`${group.migrationBackgroundPct}%`} />
        <StatPill label="Men / Women" value={`${group.menPct}% / ${group.womenPct}%`} />
        <StatPill label="Left-leaning" value={`${group.leftWingPct}%`} />
        <StatPill label="Right-leaning" value={`${group.rightWingPct}%`} />
        <StatPill
          label="People"
          value={formatIncomeCount(group.people)}
          sub={formatIncomeCount(group.households) + ' hh'}
        />
      </CardContent>
    </Card>
  );
}

function StatPill({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
      <p className="font-sans text-[9px] font-medium uppercase tracking-[0.12em] text-neutral-600">{label}</p>
      <p
        className="mt-1 font-sans text-sm font-semibold tabular-nums text-neutral-100"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </p>
      {sub ? <p className="mt-0.5 font-sans text-[9px] text-neutral-500">{sub}</p> : null}
    </div>
  );
}

function IncomeSharePie({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const chartData = useMemo(
    () =>
      GERMANY_INCOME_QUINTILES.map((g) => ({
        id: g.id,
        name: g.shortLabel,
        share: g.incomeSharePct,
        fill: g.color,
      })),
    [],
  );

  const quintileSelected = GERMANY_INCOME_QUINTILES.some((q) => q.id === selectedId);

  return (
    <Card className="flex h-full flex-col border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2">
        <CardTitle className={`${UC} text-neutral-400`}>Share of total income</CardTitle>
        <CardDescription className="font-sans text-[10px] text-neutral-500">
          Quintile breakdown (sums to 100%) · click a slice to inspect
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 p-4 pt-0 lg:flex-row lg:items-center">
        <ChartContainer config={INCOME_SHARE_CHART_CONFIG} className="mx-auto h-[220px] w-full max-w-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="rounded-md"
                    formatter={(value) => `${Number(value).toFixed(1)}%`}
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey="share"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="48%"
                outerRadius="82%"
                paddingAngle={2}
                stroke="none"
                isAnimationActive={false}
                onClick={(_, index) => {
                  const row = chartData[index];
                  if (row) onSelect(row.id);
                }}
                style={{ cursor: 'pointer' }}
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.id}
                    fill={entry.fill}
                    opacity={!quintileSelected || selectedId === entry.id ? 1 : 0.38}
                    stroke={selectedId === entry.id ? '#fafafa' : 'none'}
                    strokeWidth={selectedId === entry.id ? 2 : 0}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <ul className="min-w-0 flex-1 space-y-2">
          {GERMANY_INCOME_QUINTILES.map((g) => (
            <li key={g.id}>
              <button
                type="button"
                onClick={() => onSelect(g.id)}
                className="flex w-full items-center gap-2 rounded-md px-1 py-0.5 text-left transition hover:bg-white/[0.04]"
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: g.color }} />
                <span className="min-w-0 flex-1 truncate font-sans text-[11px] text-neutral-300">{g.label}</span>
                <span className="font-sans text-[11px] font-semibold tabular-nums text-neutral-100">
                  {g.incomeSharePct}%
                </span>
              </button>
            </li>
          ))}
          <li className="border-t border-white/[0.06] pt-2">
            <p className="font-sans text-[9px] leading-relaxed text-neutral-600">
              Top 10% holds {GERMANY_INCOME_DISTRIBUTION_GROUPS.find((g) => g.id === 'top-10')!.incomeSharePct}% · Top 1%
              holds {GERMANY_INCOME_DISTRIBUTION_GROUPS.find((g) => g.id === 'top-1')!.incomeSharePct}% (overlapping
              subsets)
            </p>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}

function AvgIncomeBarChart({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  const chartData = useMemo(
    () =>
      [...GERMANY_INCOME_DISTRIBUTION_GROUPS].map((g) => ({
        id: g.id,
        label: g.shortLabel,
        income: g.avgNetIncomeEur,
        fill: g.color,
      })),
    [],
  );

  return (
    <Card className="flex h-full flex-col border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2">
        <CardTitle className={`${UC} text-neutral-400`}>Average annual net income</CardTitle>
        <CardDescription className="font-sans text-[10px] text-neutral-500">
          All income groups · click a bar to select
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-4 pt-0">
        <ChartContainer config={AVG_INCOME_CHART_CONFIG} className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: 4, bottom: 28 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 9, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => formatIncomeEuro(Number(v), true)}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <ChartTooltip
                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                content={
                  <ChartTooltipContent
                    className="rounded-md"
                    formatter={(value) => formatIncomeEuro(Number(value))}
                  />
                }
              />
              <Bar
                dataKey="income"
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
                style={{ cursor: 'pointer' }}
                onClick={(_data, index) => {
                  const row = chartData[index];
                  if (row) onSelect(row.id);
                }}
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.id}
                    fill={entry.fill}
                    opacity={selectedId === entry.id ? 1 : 0.45}
                    stroke={selectedId === entry.id ? '#fafafa' : 'none'}
                    strokeWidth={selectedId === entry.id ? 1.5 : 0}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function MigrationPoliticsChart({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  const chartData = useMemo(
    () =>
      GERMANY_INCOME_DISTRIBUTION_GROUPS.map((g) => ({
        id: g.id,
        label: g.shortLabel,
        migration: g.migrationBackgroundPct,
        left: g.leftWingPct,
        right: g.rightWingPct,
      })),
    [],
  );

  const config = {
    migration: { label: 'Migration background %', color: '#f59e0b' },
    left: { label: 'Left-leaning %', color: '#60a5fa' },
    right: { label: 'Right-leaning %', color: '#f43f5e' },
  } satisfies ChartConfig;

  return (
    <Card className="flex h-full flex-col border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2">
        <CardTitle className={`${UC} text-neutral-400`}>Migration &amp; political lean</CardTitle>
        <CardDescription className="font-sans text-[10px] text-neutral-500">
          By income group · higher quintiles trend lower migration share and higher right-leaning share
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-4 pt-0">
        <ChartContainer config={config} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: 4, bottom: 28 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 9, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 80]}
                tickFormatter={(v) => `${v}%`}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <ChartTooltip
                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                content={<ChartTooltipContent className="rounded-md" formatter={(v) => `${Number(v)}%`} />}
              />
              <Legend wrapperStyle={{ fontSize: 10, color: 'rgba(212,212,212,0.85)' }} />
              <Bar
                dataKey="migration"
                fill="#f59e0b"
                radius={[2, 2, 0, 0]}
                isAnimationActive={false}
                style={{ cursor: 'pointer' }}
                onClick={(_d, index) => {
                  const row = chartData[index];
                  if (row) onSelect(row.id);
                }}
              />
              <Bar dataKey="left" fill="#60a5fa" radius={[2, 2, 0, 0]} isAnimationActive={false} />
              <Bar dataKey="right" fill="#f43f5e" radius={[2, 2, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        <p className="mt-2 font-sans text-[9px] text-neutral-600">
          Selected: <span className="text-neutral-400">{germanyIncomeGroupById(selectedId).label}</span> — migration{' '}
          {germanyIncomeGroupById(selectedId).migrationBackgroundPct}%, left{' '}
          {germanyIncomeGroupById(selectedId).leftWingPct}%, right{' '}
          {germanyIncomeGroupById(selectedId).rightWingPct}%
        </p>
      </CardContent>
    </Card>
  );
}

function GenderBalanceChart({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  const chartData = useMemo(
    () =>
      GERMANY_INCOME_DISTRIBUTION_GROUPS.map((g) => ({
        id: g.id,
        label: g.shortLabel,
        men: g.menPct,
        women: g.womenPct,
      })),
    [],
  );

  const config = {
    men: { label: 'Men %', color: '#60a5fa' },
    women: { label: 'Women %', color: '#ec4899' },
  } satisfies ChartConfig;

  return (
    <Card className="flex h-full flex-col border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2">
        <CardTitle className={`${UC} text-neutral-400`}>Gender balance by income group</CardTitle>
        <CardDescription className="font-sans text-[10px] text-neutral-500">
          Share of men and women within each group · richer tiers skew slightly male
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-4 pt-0">
        <ChartContainer config={config} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 8, right: 12, left: 4, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 70]}
                tickFormatter={(v) => `${v}%`}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="label"
                width={72}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 9, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
              />
              <ChartTooltip
                content={<ChartTooltipContent className="rounded-md" formatter={(v) => `${Number(v)}%`} />}
              />
              <Legend wrapperStyle={{ fontSize: 10, color: 'rgba(212,212,212,0.85)' }} />
              <Bar
                dataKey="men"
                fill="#60a5fa"
                radius={[0, 2, 2, 0]}
                isAnimationActive={false}
                style={{ cursor: 'pointer' }}
                onClick={(_d, index) => {
                  const row = chartData[index];
                  if (row) onSelect(row.id);
                }}
              >
                {chartData.map((entry) => (
                  <Cell key={`m-${entry.id}`} opacity={selectedId === entry.id ? 1 : 0.5} />
                ))}
              </Bar>
              <Bar dataKey="women" fill="#ec4899" radius={[0, 2, 2, 0]} isAnimationActive={false}>
                {chartData.map((entry) => (
                  <Cell key={`w-${entry.id}`} opacity={selectedId === entry.id ? 1 : 0.5} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function IncomeConcentrationCard() {
  const top20 = germanyIncomeGroupById('top-20');
  const top10 = germanyIncomeGroupById('top-10');
  const top1 = germanyIncomeGroupById('top-1');
  const bottom = germanyIncomeGroupById('bottom-20');

  return (
    <Card className="border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2">
        <CardTitle className={`${UC} text-neutral-400`}>Income concentration</CardTitle>
        <CardDescription className="font-sans text-[10px] text-neutral-500">
          Bottom quintile vs top slices · nested top groups
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-4 pt-0">
        <div className="space-y-2">
          <div className="flex items-center justify-between font-sans text-[10px] text-neutral-500">
            <span>Bottom 20% income share</span>
            <span className="tabular-nums text-neutral-300">{bottom.incomeSharePct}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-red-500/80"
              style={{ width: `${bottom.incomeSharePct}%` }}
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between font-sans text-[10px] text-neutral-500">
            <span>Top 20% income share</span>
            <span className="tabular-nums text-neutral-300">{top20.incomeSharePct}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-emerald-500/80"
              style={{ width: `${top20.incomeSharePct}%` }}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 border-t border-white/[0.06] pt-3">
          <div className="rounded-md border border-teal-500/20 bg-teal-500/5 p-3">
            <p className="font-sans text-[9px] uppercase tracking-wider text-teal-400/90">Top 10%</p>
            <p className="mt-1 font-sans text-xl font-semibold tabular-nums text-neutral-100">
              {top10.incomeSharePct}%
            </p>
            <p className="mt-0.5 font-sans text-[10px] text-neutral-500">{formatIncomeCount(top10.people)} people</p>
          </div>
          <div className="rounded-md border border-violet-500/20 bg-violet-500/5 p-3">
            <p className="font-sans text-[9px] uppercase tracking-wider text-violet-400/90">Top 1%</p>
            <p className="mt-1 font-sans text-xl font-semibold tabular-nums text-neutral-100">{top1.incomeSharePct}%</p>
            <p className="mt-0.5 font-sans text-[10px] text-neutral-500">{formatIncomeCount(top1.people)} people</p>
          </div>
        </div>
        <p className="font-sans text-[9px] leading-relaxed text-neutral-600">
          Top 10% and Top 1% are overlapping subsets of the top earners; their income shares are not additive with
          quintiles.
        </p>
      </CardContent>
    </Card>
  );
}

function GroupComparisonCards({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
      {GERMANY_INCOME_DISTRIBUTION_GROUPS.map((g) => {
        const active = g.id === selectedId;
        return (
          <button
            key={g.id}
            type="button"
            onClick={() => onSelect(g.id)}
            className={
              active
                ? 'rounded-md border p-3 text-left shadow-card transition'
                : 'rounded-md border border-line bg-surface-metric p-3 text-left shadow-card transition hover:border-white/[0.12]'
            }
            style={
              active
                ? { borderColor: `${g.color}55`, backgroundColor: `${g.color}0d` }
                : undefined
            }
          >
            <p className="font-sans text-[10px] font-medium uppercase tracking-wider text-neutral-500">{g.shortLabel}</p>
            <p className="mt-1 font-sans text-lg font-semibold tabular-nums text-neutral-100" style={{ color: g.color }}>
              {g.avgNetIncomeDisplay}
            </p>
            <p className="mt-0.5 font-sans text-[10px] tabular-nums text-neutral-500">{g.incomeSharePct}% income</p>
            <div className="mt-2 flex flex-wrap gap-1">
              <Badge variant="outline" className="px-1.5 py-0 text-[9px] font-normal">
                Mig. {g.migrationBackgroundPct}%
              </Badge>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export const GermanyIncomeDistributionSection = memo(function GermanyIncomeDistributionSection() {
  const [selectedId, setSelectedId] = useState('middle-20');
  const selected = useMemo(() => germanyIncomeGroupById(selectedId), [selectedId]);
  const onSelect = useCallback((id: string) => setSelectedId(id), []);

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1">
        <h3 className="font-sans text-sm font-semibold uppercase tracking-[0.05em] text-neutral-100">
          Income distribution &amp; inequality
        </h3>
        <p className="font-sans text-[11px] leading-relaxed text-neutral-500">
          Seven income groups · ~84M people in quintiles (16.8M each) · income share, net income, migration background,
          gender, and reported political lean.
        </p>
      </div>

      <GroupSelector selectedId={selectedId} onSelect={onSelect} />
      <SelectedGroupHero group={selected} />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <IncomeSharePie selectedId={selectedId} onSelect={onSelect} />
        <AvgIncomeBarChart selectedId={selectedId} onSelect={onSelect} />
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <MigrationPoliticsChart selectedId={selectedId} onSelect={onSelect} />
        <GenderBalanceChart selectedId={selectedId} onSelect={onSelect} />
      </div>

      <IncomeConcentrationCard />
      <GroupComparisonCards selectedId={selectedId} onSelect={onSelect} />
    </div>
  );
});
