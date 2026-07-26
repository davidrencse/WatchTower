import { useEffect, useRef, useState } from 'react';
import { CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '../ui/chart';
import { cn } from '../../lib/utils';
import { GOV_POLITICS_CARD_GRID, GovStatCard } from '../GermanyGovernmentPoliticsBlocks';
import type { GermanyGovernmentPoliticsRow } from '../../lib/germanyGovernmentPolitics';
import {
  FRANCE_CITIZENSHIP_ROUTES,
  FRANCE_CITIZENSHIP_SERIES,
  FRANCE_CITIZENSHIP_SOURCES,
  FRANCE_CITIZENSHIP_TOTAL_2021_2025,
  FRANCE_PRIOR_NATIONALITY_DATA,
  FRANCE_PRIOR_NATIONALITY_RING_COLORS,
} from '../../data/government/franceCitizenship';

/**
 * France — Government → Citizenship.
 *
 * Same layout as Germany's `CitizenshipGroups`: a stat-card row, a per-year line
 * chart, a donut with a cursor-following tooltip, the prior-nationality
 * donut + data grid, and a closing stat-card row. Data is French throughout;
 * see `data/government/franceCitizenship.ts` for the two dimensions that differ
 * because France does not publish Germany's equivalent.
 */

const UC_TITLE = 'uppercase tracking-[0.05em]';
const UC_LABEL = 'uppercase tracking-[0.04em]';
const UC_META = 'uppercase tracking-[0.03em]';

/** Builds the row shape `GovStatCard` renders, so the tiles match Germany's exactly. */
function statRow(
  metric: string,
  value: string,
  unit: string,
  referenceYear: string,
  sourceName: string,
  sourceUrl: string,
  notes = '',
): GermanyGovernmentPoliticsRow {
  return {
    section: 'Government',
    subsection: 'Citizenship',
    metric,
    submetric: '',
    breakdown: '',
    value,
    unit,
    referenceYear,
    sourceName,
    sourceUrl,
    notes,
  };
}

const seriesConfig = {
  total: { label: 'All acquisitions', color: '#60a5fa' },
  decree: { label: 'By decree', color: '#34d399' },
  anticipated: { label: 'Anticipated declaration', color: '#a78bfa' },
  marriage: { label: 'By marriage', color: '#f472b6' },
} satisfies ChartConfig;

const routeConfig = {
  count: { label: 'Acquisitions' },
  'Naturalisation by decree': { label: 'Naturalisation by decree', color: '#60a5fa' },
  'Anticipated declaration (born in France)': { label: 'Anticipated declaration (born in France)', color: '#34d399' },
  'Declaration by marriage': { label: 'Declaration by marriage', color: '#f59e0b' },
  'Other declarations': { label: 'Other declarations', color: '#f472b6' },
} satisfies ChartConfig;

/** Cursor-following tooltip shared by both donuts, matching Germany's behaviour. */
function useFollowTooltip<T>() {
  const chartRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const posRef = useRef<{ x: number; y: number } | null>(null);
  const [hover, setHover] = useState<T | null>(null);

  function getLocalChartPosition(eventLike: unknown): { x: number; y: number } | null {
    const e = eventLike as {
      chartX?: number;
      chartY?: number;
      x?: number;
      y?: number;
      clientX?: number;
      clientY?: number;
      pageX?: number;
      pageY?: number;
      nativeEvent?: { clientX?: number; clientY?: number };
    };
    if (typeof e.chartX === 'number' && typeof e.chartY === 'number') return { x: e.chartX, y: e.chartY };
    if (typeof e.x === 'number' && typeof e.y === 'number') return { x: e.x, y: e.y };
    const rect = chartRef.current?.getBoundingClientRect();
    const clientX = e.nativeEvent?.clientX ?? e.clientX ?? e.pageX;
    const clientY = e.nativeEvent?.clientY ?? e.clientY ?? e.pageY;
    if (!rect || typeof clientX !== 'number' || typeof clientY !== 'number') return null;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function move(pos: { x: number; y: number }) {
    posRef.current = pos;
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const el = tooltipRef.current;
      const p = posRef.current;
      if (!el || !p) return;
      el.style.left = `${p.x + 10}px`;
      el.style.top = `${p.y + 10}px`;
    });
  }

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { chartRef, tooltipRef, hover, setHover, getLocalChartPosition, move };
}

type SliceHover = { name: string; count: number; percentage: string; color: string };

function DonutTooltip({
  tooltipRef,
  hover,
  metricLabel,
}: {
  tooltipRef: React.RefObject<HTMLDivElement | null>;
  hover: SliceHover;
  metricLabel: string;
}) {
  return (
    <div
      ref={tooltipRef}
      className="pointer-events-none absolute z-20 min-w-[220px] rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs shadow-lg"
      style={{ left: 0, top: 0 }}
    >
      <p className="mb-1 font-sans text-neutral-200">{hover.name}</p>
      <div className="flex items-center justify-between gap-2 font-sans">
        <div className="flex items-center gap-2 text-neutral-400">
          <span className="h-2 w-2 rounded-[2px]" style={{ backgroundColor: hover.color }} />
          <span>{metricLabel}</span>
        </div>
        <span className="text-neutral-100">
          {hover.count.toLocaleString('en-US')} ({hover.percentage})
        </span>
      </div>
    </div>
  );
}

function PriorNationalityDataGrid() {
  const { chartRef, tooltipRef, hover, setHover, getLocalChartPosition, move } = useFollowTooltip<SliceHover>();
  const total = FRANCE_PRIOR_NATIONALITY_DATA.reduce((sum, row) => sum + row.count, 0);
  const chartConfig = FRANCE_PRIOR_NATIONALITY_DATA.reduce(
    (acc, row, i) => {
      acc[row.name] = {
        label: row.name,
        color: FRANCE_PRIOR_NATIONALITY_RING_COLORS[i % FRANCE_PRIOR_NATIONALITY_RING_COLORS.length],
      };
      return acc;
    },
    { count: { label: 'Acquisitions' } } as ChartConfig,
  );

  const onSlice = (sliceData: unknown, event: unknown) => {
    const d = sliceData as { name?: string; count?: number; percentage?: string; fill?: string };
    const pos = getLocalChartPosition(event);
    if (!pos || typeof d.name !== 'string' || typeof d.count !== 'number') return;
    move(pos);
    setHover({ name: d.name, count: d.count, percentage: d.percentage ?? '', color: d.fill ?? '#a78bfa' });
  };

  return (
    <Card className="overflow-hidden border-neutral-800 bg-black sm:col-span-2 lg:col-span-3">
      <CardHeader className="border-b border-neutral-800/90 p-4 pb-3">
        <CardTitle className={`text-sm font-semibold text-neutral-100 ${UC_TITLE}`}>
          acquisitions by prior nationality
        </CardTitle>
        <CardDescription className={`text-[10px] text-neutral-500 ${UC_META}`}>
          Top 10 prior nationalities, cumulative 2010–2022 (collective effects included)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-4 pt-4">
        <div ref={chartRef} className="relative mx-auto w-full max-w-md" onMouseLeave={() => setHover(null)}>
          <ChartContainer config={chartConfig} className="h-[min(56vw,280px)] w-full min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart onMouseLeave={() => setHover(null)}>
                <Pie
                  data={[...FRANCE_PRIOR_NATIONALITY_DATA]}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="52%"
                  outerRadius="78%"
                  paddingAngle={1.2}
                  stroke="rgba(0,0,0,0.4)"
                  strokeWidth={1}
                  labelLine={{ stroke: 'rgba(163, 163, 163, 0.45)', strokeWidth: 0.5 }}
                  onMouseEnter={(d: unknown, _i: number, e: unknown) => onSlice(d, e)}
                  onMouseMove={(d: unknown, _i: number, e: unknown) => onSlice(d, e)}
                >
                  {FRANCE_PRIOR_NATIONALITY_DATA.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={FRANCE_PRIOR_NATIONALITY_RING_COLORS[index % FRANCE_PRIOR_NATIONALITY_RING_COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          {hover ? <DonutTooltip tooltipRef={tooltipRef} hover={hover} metricLabel="Acquisitions" /> : null}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center text-center"
            style={{ maxWidth: '48%' }}
          >
            <p className="text-xl font-semibold tabular-nums text-white sm:text-2xl">{total.toLocaleString('en-US')}</p>
            <p className={`mt-0.5 text-[10px] text-neutral-500 ${UC_META}`}>Acquisitions</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
          {FRANCE_PRIOR_NATIONALITY_DATA.map((row, i) => (
            <div key={row.name} className="flex min-w-0 items-center gap-2 text-[10px] text-neutral-400">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                style={{
                  backgroundColor: FRANCE_PRIOR_NATIONALITY_RING_COLORS[i % FRANCE_PRIOR_NATIONALITY_RING_COLORS.length],
                }}
              />
              <span className="min-w-0 truncate" title={row.name}>
                {row.name}
              </span>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto rounded border border-neutral-800/80">
          <table className="w-full min-w-[320px] border-collapse text-[11px]">
            <thead>
              <tr className="text-left text-neutral-200">
                <th className="min-w-[140px] border border-neutral-800/90 bg-white/[0.04] px-4 py-3.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-neutral-400">
                  Prior Nationality
                </th>
                <th className="min-w-[100px] border border-neutral-800/90 bg-white/[0.04] px-4 py-3.5 text-right text-[10px] font-semibold uppercase tracking-[0.08em] text-neutral-400">
                  Number of Acquisitions
                </th>
                <th className="min-w-[88px] border border-neutral-800/90 bg-white/[0.04] px-4 py-3.5 text-right text-[10px] font-semibold uppercase tracking-[0.08em] text-neutral-400">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody>
              {FRANCE_PRIOR_NATIONALITY_DATA.map((row) => (
                <tr key={row.name} className="bg-black/20 text-neutral-100">
                  <td className={cn('border border-neutral-800/90 px-4 py-3.5 font-medium text-neutral-100', UC_LABEL)}>
                    {row.name}
                  </td>
                  <td className="border border-neutral-800/90 px-4 py-3.5 text-right tabular-nums text-neutral-50">
                    {row.count.toLocaleString('en-US')}
                  </td>
                  <td className="border border-neutral-800/90 px-4 py-3.5 text-right tabular-nums text-neutral-300">
                    {row.percentage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="font-sans text-[10px] leading-relaxed text-neutral-600">
          Percentages are shares of this top-10 total, not of all acquisitions. Source:{' '}
          <a
            href={FRANCE_CITIZENSHIP_SOURCES.histoire.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--uk-accent)] hover:text-neutral-200"
          >
            {FRANCE_CITIZENSHIP_SOURCES.histoire.name} ↗
          </a>
        </p>
      </CardContent>
    </Card>
  );
}

export function FranceCitizenshipBlocks() {
  const routeTooltip = useFollowTooltip<SliceHover>();

  const onRouteSlice = (sliceData: unknown, event: unknown) => {
    const d = sliceData as { group?: string; count?: number; percentage?: string; fill?: string };
    const pos = routeTooltip.getLocalChartPosition(event);
    if (!pos || typeof d.group !== 'string' || typeof d.count !== 'number') return;
    routeTooltip.move(pos);
    routeTooltip.setHover({
      name: d.group,
      count: d.count,
      percentage: d.percentage ?? '',
      color: d.fill ?? '#60a5fa',
    });
  };

  const insee = FRANCE_CITIZENSHIP_SOURCES.insee;

  return (
    <div className="flex flex-col gap-4">
      <div className={GOV_POLITICS_CARD_GRID}>
        <GovStatCard
          row={statRow(
            'Total Acquisitions',
            String(FRANCE_CITIZENSHIP_TOTAL_2021_2025),
            'acquisitions',
            '2021-2025',
            insee.name,
            insee.url,
            'Sum of all acquisitions of French nationality from 2021 through 2025.',
          )}
          title="Total Acquisitions"
        />
        <GovStatCard
          row={statRow(
            'Acquisition Rate',
            '1.7',
            'percent',
            '2024',
            insee.name,
            insee.url,
            '103,661 acquisitions in 2024 against the 6.0 million foreign nationals living in France (INSEE, 2024).',
          )}
          title="Acquisition Rate"
        />
        <GovStatCard
          row={statRow(
            'Average Processing Time',
            '18-30',
            'months',
            '2026',
            'Code civil / SDANF procedure',
            '',
            'The Civil Code caps the instruction period at 18 months from a complete file; total time to decree typically runs 18-30 months and longer in saturated departments.',
          )}
          title="Average Processing Time"
        />
      </div>

      <Card className="lg:col-span-1">
        <CardHeader className="space-y-1 p-3 pb-2">
          <CardTitle className={`text-sm text-neutral-100 ${UC_TITLE}`}>Acquisitions per year</CardTitle>
          <CardDescription className={`text-[10px] text-neutral-500 ${UC_META}`}>
            Acquisitions of French nationality by route (2021-2025) · 2025 route split not yet published
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <ChartContainer config={seriesConfig} className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[...FRANCE_CITIZENSHIP_SERIES]}
                margin={{ top: 10, right: 10, left: 8, bottom: 6 }}
              >
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={8} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={70}
                  tick={{ fill: '#9ca3af', fontSize: 10 }}
                  tickFormatter={(value) => Number(value).toLocaleString('en-US')}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#60a5fa"
                  strokeWidth={2.3}
                  dot={false}
                  activeDot={{ r: 3.5 }}
                  name="All acquisitions"
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="decree"
                  stroke="#34d399"
                  strokeWidth={1.8}
                  dot={false}
                  activeDot={{ r: 3 }}
                  name="By decree"
                  isAnimationActive={false}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="anticipated"
                  stroke="#a78bfa"
                  strokeWidth={1.8}
                  dot={false}
                  activeDot={{ r: 3 }}
                  name="Anticipated declaration"
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="marriage"
                  stroke="#f472b6"
                  strokeWidth={1.8}
                  dot={false}
                  activeDot={{ r: 3 }}
                  name="By marriage"
                  isAnimationActive={false}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(label) => `Year ${String(label ?? '')}`}
                      formatter={(value) => Number(value).toLocaleString('en-US')}
                    />
                  }
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-1">
        <CardHeader className="space-y-1 p-3 pb-2">
          <CardTitle className={`text-sm text-neutral-100 ${UC_TITLE}`}>Acquisitions by Route</CardTitle>
          <CardDescription className={`text-[10px] text-neutral-500 ${UC_META}`}>
            2024 breakdown · France does not publish an age profile of new citizens
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div ref={routeTooltip.chartRef} className="relative" onMouseLeave={() => routeTooltip.setHover(null)}>
            <ChartContainer config={routeConfig} className="h-[210px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart onMouseLeave={() => routeTooltip.setHover(null)}>
                  <Pie
                    data={[...FRANCE_CITIZENSHIP_ROUTES]}
                    dataKey="count"
                    nameKey="group"
                    innerRadius={58}
                    outerRadius={95}
                    paddingAngle={2}
                    onMouseEnter={(d: unknown, _i: number, e: unknown) => onRouteSlice(d, e)}
                    onMouseMove={(d: unknown, _i: number, e: unknown) => onRouteSlice(d, e)}
                  >
                    {FRANCE_CITIZENSHIP_ROUTES.map((entry) => (
                      <Cell key={entry.group} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            {routeTooltip.hover ? (
              <DonutTooltip tooltipRef={routeTooltip.tooltipRef} hover={routeTooltip.hover} metricLabel="Acquisitions" />
            ) : null}
          </div>
          <div className="mt-2 grid grid-cols-1 gap-x-3 gap-y-1 text-[10px] sm:grid-cols-2">
            {FRANCE_CITIZENSHIP_ROUTES.map((entry) => (
              <div key={entry.group} className="flex items-center justify-between gap-2 font-sans text-neutral-400">
                <span className="inline-flex min-w-0 items-center gap-1.5">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: entry.fill }} />
                  <span className="min-w-0 truncate" title={entry.group}>
                    {entry.group}
                  </span>
                </span>
                <span className="shrink-0 tabular-nums text-neutral-200">
                  {entry.count.toLocaleString('en-US')} ({entry.percentage})
                </span>
              </div>
            ))}
          </div>
          <div className="mt-1 font-sans text-[10px] text-neutral-500">
            <span className={UC_META}>Largest route: naturalisation by decree</span>
          </div>
        </CardContent>
      </Card>

      <div className={GOV_POLITICS_CARD_GRID}>
        <PriorNationalityDataGrid />
      </div>

      <div className={GOV_POLITICS_CARD_GRID}>
        <GovStatCard
          row={statRow(
            'Naturalisations by Decree',
            '48829',
            'people',
            '2024',
            insee.name,
            insee.url,
            'Up 21.9% on 2023, recovering from the backlog caused by digitalising the procedure.',
          )}
          title="Naturalisations by Decree"
        />
        <GovStatCard
          row={statRow(
            'Maghreb Share of Acquisitions',
            '32.5',
            'percent',
            '2024',
            FRANCE_CITIZENSHIP_SOURCES.dgef.name,
            FRANCE_CITIZENSHIP_SOURCES.dgef.url,
            'Morocco 14,454 + Algeria 12,002 + Tunisia 7,250 = 33,706 of 103,661 acquisitions.',
          )}
          title="Maghreb Share of Acquisitions"
        />
        <GovStatCard
          row={statRow(
            'Language Requirement',
            'B2',
            'CEFR level',
            '2026',
            FRANCE_CITIZENSHIP_SOURCES.decret.name,
            FRANCE_CITIZENSHIP_SOURCES.decret.url,
            'Raised from B1 for every application filed from 1 January 2026, spoken and written, including for spouses of French nationals. An official test (TCF IRN or DELF B2) is now required.',
          )}
          title="Language Requirement"
        />
      </div>
    </div>
  );
}
