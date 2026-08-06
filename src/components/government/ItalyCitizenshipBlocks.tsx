import { useEffect, useRef, useState } from 'react';
import { CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '../ui/chart';
import { GOV_POLITICS_CARD_GRID, GovStatCard } from '../countries/germany/GermanyGovernmentPoliticsBlocks';
import type { GermanyGovernmentPoliticsRow } from '../../lib/countries/germany/germanyGovernmentPolitics';
import {
  ITALY_CITIZENSHIP_MODES,
  ITALY_CITIZENSHIP_ORIGINS,
  ITALY_CITIZENSHIP_ORIGINS_NOTE,
  ITALY_CITIZENSHIP_SERIES,
  ITALY_CITIZENSHIP_SOURCES,
  ITALY_CITIZENSHIP_TOTAL_2021_2024,
} from '../../data/government/italyCitizenship';

/**
 * Italy — Government → Citizenship.
 *
 * Same layout language as Germany/France: a stat-card row, a per-year line
 * chart, a mode donut with a cursor-following tooltip, a top-origins panel, and
 * a closing stat-card row. Data is Italian throughout; see
 * `data/government/italyCitizenship.ts` for the two dimensions ISTAT publishes
 * differently from France.
 */

const UC_TITLE = 'uppercase tracking-[0.05em]';
const UC_META = 'uppercase tracking-[0.03em]';

/** Builds the row shape `GovStatCard` renders, so the tiles match Germany/France exactly. */
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
} satisfies ChartConfig;

const modeConfig = {
  count: { label: 'Acquisitions' },
  'By residence (naturalisation)': { label: 'By residence (naturalisation)', color: '#60a5fa' },
  'Transmission to minors': { label: 'Transmission to minors', color: '#34d399' },
  'Iure sanguinis & election at 18': { label: 'Iure sanguinis & election at 18', color: '#a78bfa' },
  'By marriage': { label: 'By marriage', color: '#f59e0b' },
} satisfies ChartConfig;

/** Cursor-following tooltip, matching Germany/France behaviour. */
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

function OriginsPanel() {
  const max = Math.max(...ITALY_CITIZENSHIP_ORIGINS.map((o) => o.count));
  return (
    <Card className="border-line bg-surface-metric shadow-card sm:col-span-2 lg:col-span-3">
      <CardHeader className="space-y-1 p-4 pb-2">
        <CardTitle className={`font-sans text-sm font-semibold text-neutral-100 ${UC_TITLE}`}>
          Top origins of new citizens
        </CardTitle>
        <CardDescription className={`font-sans text-[10px] text-neutral-500 ${UC_META}`}>
          Acquisitions by prior nationality, 2024 (Eurostat / ISTAT)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-4 pt-2">
        <div className="space-y-3">
          {ITALY_CITIZENSHIP_ORIGINS.map((o) => (
            <div key={o.name}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-sans text-[11px] text-neutral-300">{o.name}</span>
                <span className="font-sans text-[11px] font-semibold tabular-nums text-neutral-100">
                  ≈{o.count.toLocaleString('en-US')}
                </span>
              </div>
              <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(o.count / max) * 100}%`, backgroundColor: '#38bdf8' }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="font-sans text-[10px] leading-relaxed text-neutral-500">{ITALY_CITIZENSHIP_ORIGINS_NOTE}</p>
      </CardContent>
    </Card>
  );
}

export function ItalyCitizenshipBlocks() {
  const modeTooltip = useFollowTooltip<SliceHover>();

  const onModeSlice = (sliceData: unknown, event: unknown) => {
    const d = sliceData as { group?: string; count?: number; percentage?: string; fill?: string };
    const pos = modeTooltip.getLocalChartPosition(event);
    if (!pos || typeof d.group !== 'string' || typeof d.count !== 'number') return;
    modeTooltip.move(pos);
    modeTooltip.setHover({
      name: d.group,
      count: d.count,
      percentage: d.percentage ?? '',
      color: d.fill ?? '#60a5fa',
    });
  };

  const istat = ITALY_CITIZENSHIP_SOURCES.istat;
  const eurostat = ITALY_CITIZENSHIP_SOURCES.eurostat;

  return (
    <div className="flex flex-col gap-4">
      <div className={GOV_POLITICS_CARD_GRID}>
        <GovStatCard
          row={statRow(
            'Total Acquisitions',
            String(ITALY_CITIZENSHIP_TOTAL_2021_2024),
            'acquisitions',
            '2021-2024',
            istat.name,
            istat.url,
            'Sum of all acquisitions of Italian citizenship from 2021 through 2024. Volumes doubled in 2022 and have stayed above 213,000 since.',
          )}
          title="Total Acquisitions"
        />
        <GovStatCard
          row={statRow(
            'Naturalisation Rate',
            '4.1',
            'percent',
            '2024',
            eurostat.name,
            eurostat.url,
            'New citizens as a share of resident foreign nationals — the third-highest rate in the EU after Sweden, above the EU average of 2.7%.',
          )}
          title="Naturalisation Rate"
        />
        <GovStatCard
          row={statRow(
            'EU Ranking',
            '3rd',
            'in the EU',
            '2024',
            eurostat.name,
            eurostat.url,
            '217,400 acquisitions in 2024 — 18.5% of the EU total, behind Germany (288,700) and Spain (252,500).',
          )}
          title="EU Ranking"
        />
      </div>

      <Card>
        <CardHeader className="space-y-1 p-3 pb-2">
          <CardTitle className={`text-sm text-neutral-100 ${UC_TITLE}`}>Acquisitions per year</CardTitle>
          <CardDescription className={`text-[10px] text-neutral-500 ${UC_META}`}>
            Total acquisitions of Italian citizenship (2021-2024) · the 2022 jump reflects cleared backlogs and rising iure sanguinis claims
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <ChartContainer config={seriesConfig} className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 320, height: 240 }}>
              <LineChart data={[...ITALY_CITIZENSHIP_SERIES]} margin={{ top: 10, right: 10, left: 8, bottom: 6 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={8} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={70}
                  domain={[0, 240000]}
                  tick={{ fill: '#9ca3af', fontSize: 10 }}
                  tickFormatter={(value) => Number(value).toLocaleString('en-US')}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#60a5fa"
                  strokeWidth={2.3}
                  dot={{ r: 3, fill: '#60a5fa' }}
                  activeDot={{ r: 4 }}
                  name="All acquisitions"
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

      <Card>
        <CardHeader className="space-y-1 p-3 pb-2">
          <CardTitle className={`text-sm text-neutral-100 ${UC_TITLE}`}>Acquisitions by mode</CardTitle>
          <CardDescription className={`text-[10px] text-neutral-500 ${UC_META}`}>
            2023 breakdown, non-EU citizens (~196,000) · the split ISTAT publishes
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div ref={modeTooltip.chartRef} className="relative" onMouseLeave={() => modeTooltip.setHover(null)}>
            <ChartContainer config={modeConfig} className="h-[210px] w-full">
              <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 320, height: 240 }}>
                <PieChart onMouseLeave={() => modeTooltip.setHover(null)}>
                  <Pie
                    data={[...ITALY_CITIZENSHIP_MODES]}
                    dataKey="count"
                    nameKey="group"
                    innerRadius={58}
                    outerRadius={95}
                    paddingAngle={2}
                    onMouseEnter={(d: unknown, _i: number, e: unknown) => onModeSlice(d, e)}
                    onMouseMove={(d: unknown, _i: number, e: unknown) => onModeSlice(d, e)}
                  >
                    {ITALY_CITIZENSHIP_MODES.map((entry) => (
                      <Cell key={entry.group} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            {modeTooltip.hover ? (
              <DonutTooltip tooltipRef={modeTooltip.tooltipRef} hover={modeTooltip.hover} metricLabel="Acquisitions" />
            ) : null}
          </div>
          <div className="mt-2 grid grid-cols-1 gap-x-3 gap-y-1 text-[10px] sm:grid-cols-2">
            {ITALY_CITIZENSHIP_MODES.map((entry) => (
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
          <p className="mt-2 font-sans text-[10px] leading-relaxed text-neutral-500">
            Iure sanguinis recognitions surged (+241% on 2021), overwhelmingly from Brazil and Argentina — the trend the 2025 reform
            was written to stop. Source:{' '}
            <a href={istat.url} target="_blank" rel="noopener noreferrer" className="text-[var(--uk-accent)] hover:text-neutral-200">
              {istat.name} ↗
            </a>
          </p>
        </CardContent>
      </Card>

      <div className={GOV_POLITICS_CARD_GRID}>
        <OriginsPanel />
      </div>

      <div className={GOV_POLITICS_CARD_GRID}>
        <GovStatCard
          row={statRow(
            'Residence Requirement',
            '10',
            'years',
            '2026',
            'Legge 91/1992',
            '',
            'Ten years of legal residence for non-EU nationals — among the strictest in the EU. A June 2025 referendum to cut it to five years failed on turnout.',
          )}
          title="Residence Requirement"
        />
        <GovStatCard
          row={statRow(
            '2025 Referendum Turnout',
            '30.6',
            'percent',
            '2025',
            'Ministero dell’Interno',
            'https://www.interno.gov.it/',
            'The 8-9 June 2025 referendum to ease naturalisation drew 30.6% turnout, well below the 50%+1 quorum, so it was void.',
          )}
          title="2025 Referendum Turnout"
        />
        <GovStatCard
          row={statRow(
            'Jure Sanguinis Reform',
            '2',
            'generations',
            '2025',
            'Legge 74/2025',
            'https://www.gazzettaufficiale.it/',
            'Law 74/2025 (in force 24 May 2025) limits citizenship by descent to those with an Italian parent or grandparent, ending indefinite transmission.',
          )}
          title="Jure Sanguinis Reform"
        />
      </div>
    </div>
  );
}
