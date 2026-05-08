import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { cn } from '../lib/utils';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { ChartContainer, type ChartConfig } from './ui/chart';
import type { GermanyGovernmentPoliticsRow } from '../lib/germanyGovernmentPolitics';

/** Metric titles and primary labels: all caps for government / economic politics data cards. */
const UC_TITLE = 'uppercase tracking-[0.05em]';
const UC_LABEL = 'uppercase tracking-[0.04em]';
const UC_META = 'uppercase tracking-[0.03em]';

export const GOV_POLITICS_CARD_GRID = 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3';

/** Multi-row labor / assistance metrics shown as a dense “panel” instead of a wide table. */
const LABOR_DISTRIBUTION_DETAIL_METRICS = new Set([
  'employment rates by nationality',
  'welfare dependency by nationality/status',
  'social assistance recipients by citizenship',
  'youth unemployment rate',
  'labour force participation rate',
]);

/** Title-case headings for the labor distribution panels (CSV `metric` stays lowercase). */
const LABOR_DISTRIBUTION_DISPLAY_TITLES: Record<string, string> = {
  'employment rates by nationality': 'Employment Rates by Nationality',
  'welfare dependency by nationality/status': 'Welfare Dependency by Nationality/Status',
  'social assistance recipients by citizenship': 'Social Assistance Recipients by Citizenship',
  'youth unemployment rate': 'Youth Unemployment Rate',
  'labour force participation rate': 'Labour Force Participation Rate',
};

const METRIC_SUBTITLES: Record<string, string> = {
  'Concurrent mental health comorbidities in youth referred for care':
    'When a young person is referred to a gender clinic in Germany, there is a very high chance (around 70%) they are already struggling with depression, anxiety, autism, trauma, or other serious mental health conditions at the same time.',
};

export function splitUrls(urlField: string): string[] {
  return String(urlField ?? '')
    .split('|')
    .map((u) => u.trim())
    .filter(Boolean);
}

export function formatValueDisplay(row: GermanyGovernmentPoliticsRow): string {
  const v = row.value.trim();
  if (!v) return 'N/A';
  const unit = row.unit.trim().toLowerCase();
  if (unit === 'percent' || unit.endsWith('percent')) {
    const n = parseFloat(v.replace(/,/g, ''));
    return Number.isFinite(n) ? `${n % 1 === 0 ? n.toFixed(0) : n.toFixed(1)}%` : v;
  }
  const asNum = Number(v.replace(/,/g, ''));
  if (Number.isFinite(asNum) && String(v).includes(',')) {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 3 }).format(asNum);
  }
  if (Number.isFinite(asNum) && /^[\d.]+$/.test(v)) {
    return asNum % 1 !== 0 ? asNum.toLocaleString('en-US', { maximumFractionDigits: 4 }) : asNum.toLocaleString('en-US');
  }
  return v;
}

export function metaParts(row: GermanyGovernmentPoliticsRow): string {
  return [row.referenceYear ? `Year: ${row.referenceYear}` : null, row.unit ? `Unit: ${row.unit}` : null]
    .filter(Boolean)
    .join(' · ');
}

export function GovStatCard({ row, title }: { row: GermanyGovernmentPoliticsRow; title?: string }) {
  const urls = splitUrls(row.sourceUrl);
  const label = title ?? row.metric;
  const extra = [row.breakdown, row.submetric].filter(Boolean).join(' · ');
  return (
    <Card className="flex flex-col overflow-hidden border-line bg-surface-metric">
      <CardHeader className="space-y-0.5 p-3 pb-0">
        <CardTitle className={`text-sm font-semibold leading-tight text-neutral-100 ${UC_TITLE}`}>{label}</CardTitle>
        {extra ? (
          <CardDescription className={`text-[10px] leading-snug text-neutral-300 ${UC_META}`}>{extra}</CardDescription>
        ) : null}
        <CardDescription className={`text-[10px] leading-snug text-neutral-500 ${UC_META}`}>{metaParts(row)}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-2 p-3 pt-2">
        <p className="font-sans text-xl font-semibold tabular-nums tracking-tight text-white sm:text-2xl">
          {formatValueDisplay(row)}
        </p>
        {urls.length > 0 ? (
          <div className="space-y-0.5">
            {urls.map((u, i) => (
              <a
                key={`${u}-${i}`}
                href={u}
                target="_blank"
                rel="noopener noreferrer"
                className={`block font-sans text-[10px] leading-snug text-[var(--uk-accent)] hover:text-neutral-200 ${UC_META}`}
              >
                {row.sourceName ? (urls.length > 1 ? `${row.sourceName} (${i + 1})` : row.sourceName) : `Source ${i + 1}`}{' '}
                ↗
              </a>
            ))}
          </div>
        ) : null}
        {row.notes ? (
          <details className="rounded-md border border-white/[0.06] bg-neutral-950/40 px-2 py-1.5">
            <summary className="cursor-pointer font-sans text-[9px] uppercase tracking-[0.12em] text-neutral-500 hover:text-neutral-400">
              Note
            </summary>
            <pre className="mt-1.5 max-h-40 overflow-y-auto whitespace-pre-wrap font-sans text-[10px] leading-relaxed text-neutral-500">
              {row.notes}
            </pre>
          </details>
        ) : null}
      </CardContent>
    </Card>
  );
}

const PRIOR_NATIONALITY_DATA = [
  { name: 'Syria', count: 685000, percentage: '18.74%' },
  { name: 'Turkey', count: 620000, percentage: '16.96%' },
  { name: 'Russia / Former Soviet Union', count: 285000, percentage: '7.80%' },
  { name: 'Poland', count: 195000, percentage: '5.33%' },
  { name: 'Romania', count: 165000, percentage: '4.51%' },
  { name: 'Italy', count: 145000, percentage: '3.96%' },
  { name: 'Ukraine', count: 125000, percentage: '3.42%' },
  { name: 'Iraq', count: 115000, percentage: '3.14%' },
  { name: 'Afghanistan', count: 95000, percentage: '2.60%' },
  { name: 'Iran', count: 85000, percentage: '2.33%' },
  { name: 'Greece', count: 75000, percentage: '2.05%' },
  { name: 'Other Europe', count: 320000, percentage: '8.75%' },
  { name: 'Africa (total)', count: 210000, percentage: '5.74%' },
  { name: 'Asia (excl. listed)', count: 480000, percentage: '13.13%' },
  { name: 'Americas + Other', count: 340000, percentage: '9.30%' },
] as const;

const PRIOR_NATIONALITY_RING_COLORS = [
  '#a78bfa',
  '#38bdf8',
  '#2dd4bf',
  '#f472b6',
  '#f87171',
  '#e7e5e4',
  '#86efac',
  '#c084fc',
  '#fbbf24',
  '#fb7185',
  '#4ade80',
  '#60a5fa',
  '#f9a8d4',
  '#34d399',
  '#94a3b8',
] as const;

const PRIOR_NATIONALITY_METRIC = 'naturalizations by prior nationality';

/**
 * Data-grid + donut for prior nationalities: static dataset, dark table grid, and ring chart (style similar to a dashboard donut).
 */
export function NaturalizationsPriorNationalityDataGrid() {
  const priorNationalityChartRef = useRef<HTMLDivElement>(null);
  const priorNationalityTooltipRef = useRef<HTMLDivElement>(null);
  const priorTooltipRafRef = useRef<number | null>(null);
  const priorTooltipPosRef = useRef<{ x: number; y: number } | null>(null);
  const [hoveredSlice, setHoveredSlice] = useState<{
    name: string;
    count: number;
    percentage: string;
    color: string;
  } | null>(null);
  const total = PRIOR_NATIONALITY_DATA.reduce((sum, row) => sum + row.count, 0);
  const chartConfig = PRIOR_NATIONALITY_DATA.reduce(
    (acc, row, i) => {
      acc[row.name] = { label: row.name, color: PRIOR_NATIONALITY_RING_COLORS[i % PRIOR_NATIONALITY_RING_COLORS.length] };
      return acc;
    },
    { count: { label: 'Naturalizations' } } as ChartConfig,
  );

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
    const rect = priorNationalityChartRef.current?.getBoundingClientRect();
    const clientX = e.nativeEvent?.clientX ?? e.clientX ?? e.pageX;
    const clientY = e.nativeEvent?.clientY ?? e.clientY ?? e.pageY;
    if (!rect || typeof clientX !== 'number' || typeof clientY !== 'number') return null;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function movePriorTooltip(pos: { x: number; y: number }) {
    priorTooltipPosRef.current = pos;
    if (priorTooltipRafRef.current !== null) return;
    priorTooltipRafRef.current = requestAnimationFrame(() => {
      priorTooltipRafRef.current = null;
      const el = priorNationalityTooltipRef.current;
      const p = priorTooltipPosRef.current;
      if (!el || !p) return;
      el.style.left = `${p.x + 10}px`;
      el.style.top = `${p.y + 10}px`;
    });
  }

  useEffect(() => {
    return () => {
      if (priorTooltipRafRef.current !== null) cancelAnimationFrame(priorTooltipRafRef.current);
    };
  }, []);
  return (
    <Card className="overflow-hidden border-neutral-800 bg-black sm:col-span-2 lg:col-span-3">
      <CardHeader className="border-b border-neutral-800/90 p-4 pb-3">
        <CardTitle className={`text-sm font-semibold text-neutral-100 ${UC_TITLE}`}>
          {PRIOR_NATIONALITY_METRIC}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4 pt-4">
        <div ref={priorNationalityChartRef} className="relative mx-auto w-full max-w-md" onMouseLeave={() => setHoveredSlice(null)}>
          <ChartContainer config={chartConfig} className="h-[min(56vw,280px)] w-full min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart onMouseLeave={() => setHoveredSlice(null)}>
                <Pie
                  data={[...PRIOR_NATIONALITY_DATA]}
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
                  onMouseEnter={(sliceData: unknown, _idx: number, event: unknown) => {
                    const d = sliceData as { name?: string; count?: number; percentage?: string; fill?: string };
                    const pos = getLocalChartPosition(event);
                    if (!pos || typeof d.name !== 'string' || typeof d.count !== 'number') return;
                    movePriorTooltip(pos);
                    setHoveredSlice({
                      name: d.name,
                      count: d.count,
                      percentage: d.percentage ?? '',
                      color: d.fill ?? '#a78bfa',
                    });
                  }}
                  onMouseMove={(sliceData: unknown, _idx: number, event: unknown) => {
                    const d = sliceData as { name?: string; count?: number; percentage?: string; fill?: string };
                    const pos = getLocalChartPosition(event);
                    if (!pos || typeof d.name !== 'string' || typeof d.count !== 'number') return;
                    movePriorTooltip(pos);
                    setHoveredSlice((prev) => {
                      if (
                        prev &&
                        prev.name === d.name &&
                        prev.count === d.count &&
                        prev.percentage === (d.percentage ?? '') &&
                        prev.color === (d.fill ?? '#a78bfa')
                      ) {
                        return prev;
                      }
                      return {
                        name: d.name,
                        count: d.count,
                        percentage: d.percentage ?? '',
                        color: d.fill ?? '#a78bfa',
                      };
                    });
                  }}
                >
                  {PRIOR_NATIONALITY_DATA.map((entry, index) => (
                    <Cell key={entry.name} fill={PRIOR_NATIONALITY_RING_COLORS[index % PRIOR_NATIONALITY_RING_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          {hoveredSlice ? (
            <div
              ref={priorNationalityTooltipRef}
              className="pointer-events-none absolute z-20 min-w-[220px] rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs shadow-lg"
              style={{ left: 0, top: 0 }}
            >
              <p className="mb-1 font-sans text-neutral-200">{hoveredSlice.name}</p>
              <div className="flex items-center justify-between gap-2 font-sans">
                <div className="flex items-center gap-2 text-neutral-400">
                  <span className="h-2 w-2 rounded-[2px]" style={{ backgroundColor: hoveredSlice.color }} />
                  <span>Naturalizations</span>
                </div>
                <span className="text-neutral-100">
                  {hoveredSlice.count.toLocaleString('en-US')} ({hoveredSlice.percentage})
                </span>
              </div>
            </div>
          ) : null}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center text-center"
            style={{ maxWidth: '48%' }}
          >
            <p className="text-xl font-semibold tabular-nums text-white sm:text-2xl">
              {total.toLocaleString('en-US')}
            </p>
            <p className={`mt-0.5 text-[10px] text-neutral-500 ${UC_META}`}>Naturalizations</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
          {PRIOR_NATIONALITY_DATA.map((row, i) => (
            <div key={row.name} className="flex min-w-0 items-center gap-2 text-[10px] text-neutral-400">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                style={{ backgroundColor: PRIOR_NATIONALITY_RING_COLORS[i % PRIOR_NATIONALITY_RING_COLORS.length] }}
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
                  Number of Naturalizations
                </th>
                <th className="min-w-[88px] border border-neutral-800/90 bg-white/[0.04] px-4 py-3.5 text-right text-[10px] font-semibold uppercase tracking-[0.08em] text-neutral-400">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody>
              {PRIOR_NATIONALITY_DATA.map((row) => (
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
      </CardContent>
    </Card>
  );
}

function rowLabel(r: GermanyGovernmentPoliticsRow): string {
  return (r.breakdown || r.submetric || '—').trim() || '—';
}

function unitPillText(unit: string): string {
  const u = unit.trim();
  if (!u) return '—';
  const lower = u.toLowerCase();
  if (lower === 'percent' || lower.endsWith('percent')) return 'Share (%)';
  if (lower === 'people') return 'Recipients';
  return u;
}

/** Unique source URLs across all rows (LFPR uses two different publications). */
function uniqueSourceLinksFromRows(rows: GermanyGovernmentPoliticsRow[]): { url: string; label: string }[] {
  const seen = new Set<string>();
  const out: { url: string; label: string }[] = [];
  for (const r of rows) {
    const urls = splitUrls(r.sourceUrl);
    const base = (r.sourceName ?? '').trim();
    urls.forEach((u, i) => {
      if (!u || seen.has(u)) return;
      seen.add(u);
      const label = base && urls.length > 1 ? `${base} (${i + 1})` : base || `Source ${out.length + 1}`;
      out.push({ url: u, label });
    });
  }
  return out;
}

function referenceYearsLine(rows: GermanyGovernmentPoliticsRow[]): string | null {
  const ys = [...new Set(rows.map((r) => r.referenceYear.trim()).filter(Boolean))].sort();
  if (ys.length === 0) return null;
  if (ys.length === 1) return `Year ${ys[0]}`;
  return `Years ${ys.join(', ')}`;
}

/**
 * Dark panel layout: numbered breakdowns, red accent separators, unit pills — inspired by compact dashboard tiles (content still from CSV).
 */
function GovLaborDistributionPanel({
  metric,
  rows,
}: {
  metric: string;
  rows: GermanyGovernmentPoliticsRow[];
}) {
  const sourceLinks = uniqueSourceLinksFromRows(rows);
  const notes = rows.map((r) => r.notes).filter(Boolean);
  const refYearLabel = referenceYearsLine(rows);
  const subtitle = METRIC_SUBTITLES[metric];
  const displayTitle =
    LABOR_DISTRIBUTION_DISPLAY_TITLES[metric.trim().toLowerCase()] ?? metric;

  return (
    <article className="col-span-full overflow-hidden rounded-2xl border border-neutral-800/70 bg-[#161616] shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset] sm:col-span-2 lg:col-span-3">
      <div className="border-b border-white/[0.06] px-5 pb-4 pt-5">
        <h3 className="font-sans text-base font-semibold leading-snug tracking-tight text-neutral-100">
          {displayTitle}
        </h3>
        {subtitle ? (
          <p className="mt-2 max-w-3xl font-sans text-[11px] leading-relaxed text-neutral-500">{subtitle}</p>
        ) : null}
        {refYearLabel ? (
          <p className="mt-3 flex flex-wrap items-center gap-2 font-sans text-[10px] uppercase tracking-[0.16em] text-neutral-500">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500/90 shadow-[0_0_8px_rgba(239,68,68,0.35)]" />
              {refYearLabel}
            </span>
          </p>
        ) : null}
      </div>

      <ul className="divide-y divide-white/[0.05] px-5">
        {rows.map((r, i) => (
          <li key={i} className="flex gap-4 py-4 first:pt-5">
            <span
              className="w-9 shrink-0 select-none pt-0.5 text-right font-sans text-[11px] font-medium tabular-nums text-neutral-600"
              aria-hidden
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="min-w-0 font-sans text-[13px] leading-snug text-neutral-200">{rowLabel(r)}</span>
                <span className="h-1 w-1 shrink-0 rounded-full bg-red-500/85 translate-y-px" aria-hidden />
                <span className="font-sans text-lg font-semibold tabular-nums tracking-tight text-neutral-50 sm:ml-0.5">
                  {formatValueDisplay(r)}
                </span>
              </div>
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/[0.08] bg-black/35 px-2.5 py-0.5 font-sans text-[10px] text-neutral-400">
                  {unitPillText(r.unit)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="space-y-3 border-t border-white/[0.05] px-5 py-4">
        {sourceLinks.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            {sourceLinks.map(({ url: u, label }) => (
              <a
                key={u}
                href={u}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-white/[0.07] bg-black/25 px-3 py-1 font-sans text-[10px] uppercase tracking-[0.12em] text-neutral-400 transition-colors hover:border-red-500/25 hover:text-red-300/95"
              >
                <span className="h-1 w-1 shrink-0 rounded-full bg-red-500/80" />
                {label}
                <span aria-hidden className="text-neutral-600">
                  ↗
                </span>
              </a>
            ))}
          </div>
        ) : null}
        {notes.length > 0 ? (
          <details className="rounded-xl border border-white/[0.06] bg-black/30 px-3 py-2">
            <summary className="cursor-pointer list-none font-sans text-[9px] uppercase tracking-[0.14em] text-neutral-500 marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="inline-flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-red-500/75" />
                Notes
              </span>
            </summary>
            <pre className="mt-2 max-h-36 overflow-y-auto whitespace-pre-wrap border-t border-white/[0.05] pt-2 font-sans text-[10px] leading-relaxed text-neutral-500">
              {notes.join('\n\n')}
            </pre>
          </details>
        ) : null}
      </div>
    </article>
  );
}

export function GovMetricTable({ metric, rows }: { metric: string; rows: GermanyGovernmentPoliticsRow[] }) {
  const urls = splitUrls(rows[0]?.sourceUrl ?? '');
  const sourceName = rows[0]?.sourceName ?? '';
  const notes = rows.map((r) => r.notes).filter(Boolean);
  const subtitle = METRIC_SUBTITLES[metric];
  return (
    <Card className="overflow-hidden border-line bg-surface-metric sm:col-span-2 lg:col-span-3">
      <CardHeader className="p-3 pb-2">
        <CardTitle className={`text-sm font-semibold text-neutral-100 ${UC_TITLE}`}>{metric}</CardTitle>
        {subtitle ? <CardDescription className="text-[11px] normal-case text-neutral-300">{subtitle}</CardDescription> : null}
        {rows[0]?.referenceYear ? (
          <CardDescription className={`text-[10px] text-neutral-500 ${UC_META}`}>
            Reference year: {rows[0].referenceYear}
          </CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-3 p-3 pt-0">
        <div className="overflow-x-auto rounded border border-line">
          <table className="w-full min-w-[280px] border-collapse font-sans text-[11px]">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.03] text-left text-[10px] uppercase tracking-[0.1em] text-neutral-500">
                <th className="px-3 py-2 font-medium">Breakdown</th>
                <th className="px-3 py-2 font-medium text-right">Value</th>
                <th className="px-3 py-2 font-medium">Unit</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-b border-white/[0.06] last:border-0">
                  <td className={`px-3 py-2 text-neutral-200 ${UC_LABEL}`}>
                    {(r.breakdown || r.submetric || '—').trim() || '—'}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-white">{formatValueDisplay(r)}</td>
                  <td className={`px-3 py-2 text-neutral-400 ${UC_META}`}>{r.unit || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {urls.length > 0 ? (
          <div className="space-y-0.5">
            {urls.map((u, i) => (
              <a
                key={`${u}-${i}`}
                href={u}
                target="_blank"
                rel="noopener noreferrer"
                className={`block font-sans text-[10px] text-[var(--uk-accent)] hover:text-neutral-200 ${UC_META}`}
              >
                {sourceName ? (urls.length > 1 ? `${sourceName} (${i + 1})` : sourceName) : `Source ${i + 1}`} ↗
              </a>
            ))}
          </div>
        ) : null}
        {notes.length > 0 ? (
          <details className="rounded-md border border-white/[0.06] bg-neutral-950/40 px-2 py-1.5">
            <summary className="cursor-pointer font-sans text-[9px] uppercase tracking-[0.12em] text-neutral-500">
              Notes
            </summary>
            <pre className="mt-1.5 max-h-36 overflow-y-auto whitespace-pre-wrap font-sans text-[10px] leading-relaxed text-neutral-500">
              {notes.join('\n\n')}
            </pre>
          </details>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function renderMetricGroup(rows: GermanyGovernmentPoliticsRow[]) {
  const first = rows[0]!;
  const multi =
    rows.length > 1 || Boolean(first.breakdown?.trim()) || Boolean(first.submetric?.trim());
  const metricKey = first.metric.trim().toLowerCase();
  if (multi && LABOR_DISTRIBUTION_DETAIL_METRICS.has(metricKey)) {
    return <GovLaborDistributionPanel key={first.metric} metric={first.metric} rows={rows} />;
  }
  if (multi) return <GovMetricTable key={first.metric} metric={first.metric} rows={rows} />;
  return <GovStatCard key={first.metric} row={first} />;
}
