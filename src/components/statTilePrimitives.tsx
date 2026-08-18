import type { ReactNode } from 'react';
import type { CountryStatMetric } from '../types/countryStats';
import { isPendingSlot, isUnavailable } from '../lib/statTileValues';

/** Shared building blocks for the country dashboard's stat tiles. */

export const STAT_GRID = 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3';

/** Recharts SVG text does not inherit Tailwind `font-sans`; match the site Inter stack. */
export const CHART_AXIS_FONT = 'Inter, ui-sans-serif, system-ui, sans-serif';

export function PercentRing({ percent }: { percent: number }) {
  const r = 38;
  const c = 2 * Math.PI * r;
  const p = Math.min(100, Math.max(0, percent));
  const dash = (p / 100) * c;
  return (
    <svg viewBox="0 0 100 100" className="h-28 w-28 shrink-0 text-[var(--uk-accent)]" aria-hidden>
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        className="text-neutral-800"
      />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c}`}
        transform="rotate(-90 50 50)"
        className="text-[var(--uk-accent)]"
      />
      <text
        x="50"
        y="54"
        textAnchor="middle"
        className="fill-neutral-200 font-sans text-[15px] font-semibold"
      >
        {percent.toFixed(1)}%
      </text>
    </svg>
  );
}

export function SourceLinks({ url, className }: { url: string; className: string }) {
  const urls = url
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean);
  if (urls.length === 0) return null;
  if (urls.length === 1) {
    return (
      <a href={urls[0]} target="_blank" rel="noopener noreferrer" className={className}>
        Source ↗
      </a>
    );
  }
  return (
    <ul className="mt-2 flex flex-col gap-1">
      {urls.map((u, i) => (
        <li key={`${u}-${i}`}>
          <a href={u} target="_blank" rel="noopener noreferrer" className={className}>
            Source {i + 1} ↗
          </a>
        </li>
      ))}
    </ul>
  );
}

export function MetaLine({ row }: { row: CountryStatMetric }) {
  const parts = [row.reference_period, row.geography_used].filter(Boolean);
  if (parts.length === 0) return null;
  return (
    <p className="mt-3 font-sans text-[10px] leading-relaxed text-neutral-500">
      {parts.join(' · ')}
    </p>
  );
}

export function NoteBlock({ text }: { text: string }) {
  if (!text.trim()) return null;
  return (
    <details className="mt-3 border-t border-white/[0.06] pt-2">
      <summary className="cursor-pointer font-sans text-[10px] uppercase tracking-wider text-neutral-600 hover:text-neutral-400">
        Note
      </summary>
      <p className="mt-2 font-sans text-[10px] leading-relaxed text-neutral-500">{text}</p>
    </details>
  );
}

export function MetricTile({
  row,
  largeValue,
  accent,
  extra,
  minHeightClass,
  fixedHeightClass,
  clipOverflow,
}: {
  row: CountryStatMetric;
  largeValue?: boolean;
  accent?: boolean;
  extra?: ReactNode;
  minHeightClass?: string;
  fixedHeightClass?: string;
  clipOverflow?: boolean;
}) {
  const na = isUnavailable(row.value);
  const pending = isPendingSlot(row);
  const size = `${fixedHeightClass ?? minHeightClass ?? 'min-h-[148px]'} ${clipOverflow ? 'overflow-hidden' : ''}`;
  return (
    <article
      className={
        pending
          ? `flex ${size} flex-col rounded-md border border-dashed border-red-500/45 bg-red-500/[0.04] p-4 shadow-card sm:p-5`
          : accent
            ? `flex ${size} flex-col rounded-md border border-[var(--uk-accent-border)] bg-[var(--uk-accent-surface)] p-4 shadow-card ring-1 ring-[var(--uk-accent-dim)] sm:p-5`
            : `flex ${size} flex-col rounded-md border border-line bg-surface-metric p-4 shadow-card sm:p-5`
      }
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
          {row.metric}
        </p>
        {pending ? (
          <span className="shrink-0 rounded-sm border border-red-500/45 bg-red-500/[0.12] px-1.5 py-0.5 font-sans text-[9px] font-semibold uppercase tracking-[0.14em] text-red-300">
            Data needed
          </span>
        ) : null}
      </div>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <p
            className={
              largeValue
                ? `font-sans tabular-nums text-2xl font-semibold leading-none tracking-tight sm:text-3xl lg:text-4xl ${pending ? 'text-red-300/90' : na ? 'text-neutral-600' : 'text-neutral-100'}`
                : `font-sans tabular-nums text-lg font-medium leading-snug sm:text-xl ${pending ? 'text-red-300/90' : na ? 'text-neutral-600' : 'text-neutral-100'}`
            }
          >
            {na ? 'N/A' : row.value}
          </p>
          {row.value_subtitle && !na ? (
            <p className="mt-1.5 font-sans text-[10px] font-medium leading-snug text-neutral-500">
              {row.value_subtitle}
            </p>
          ) : null}
        </div>
        {extra ? <div className="shrink-0">{extra}</div> : null}
      </div>
      <div className="mt-auto">
        <MetaLine row={row} />
        {row.source_url ? (
          <div className="mt-2">
            <SourceLinks
              url={row.source_url}
              className="inline-flex w-fit items-center gap-1 font-sans text-[10px] text-[var(--uk-accent)] hover:text-neutral-200"
            />
          </div>
        ) : null}
        <NoteBlock text={row.notes} />
      </div>
    </article>
  );
}
