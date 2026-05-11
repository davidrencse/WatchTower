import { Fragment, useEffect, useMemo, useState, type ReactNode } from 'react';
import lgbtCsvRaw from '../../Assets/Data/Europe/Germany/Health Section/germany_gender_care_statistics.csv?raw';
import type { GermanyGovernmentPoliticsRow } from '../lib/germanyGovernmentPolitics';
import {
  clusterMetricTable,
  GERMANY_LGBT_CHILDREN_METRIC_ORDER,
  GERMANY_LGBT_METRIC_ORDER,
  parseGermanyMetricTableCsv,
} from '../lib/germanyHealthCsv';
import { cn } from '../lib/utils';
import { formatValueDisplay, metaParts, splitUrls } from './GermanyGovernmentPoliticsBlocks';
import { CollapsibleFlagSection } from './CollapsibleFlagSection';

const CSV_URL = '/data/germany_gender_care_statistics.csv';

/** Metrics where the Year/Unit meta line is omitted from the left blurb and from value cells. */
const LGBT_METRICS_OMIT_META_LINE = new Set<string>([
  'Puberty blocker prescription rates',
  'Cross-sex hormone therapy initiation in minors',
  'Youth with gender dysphoria/incongruence receiving medical interventions',
]);

/** Metrics where CSV notes appear only under Notes, not in the left blurb. */
const LGBT_METRICS_NOTES_DETAILS_ONLY = new Set<string>([
  'Masculinizing genital surgeries',
  'Feminizing genital surgeries',
  'Detransition or desistance rates',
  'Regret rates after gender-affirming interventions in minors',
  'Age distribution of first medical intervention',
]);

const LGBT_SURGERY_TREND_META_HIDE = new Set<string>([
  'Total annual genital gender-affirming surgeries',
  'Masculinizing genital surgeries',
  'Feminizing genital surgeries',
]);

const LAW_CHILDHOOD_CARE_METRIC = 'Law on childhood gender-affirming care';

function lawMetaParts(row: GermanyGovernmentPoliticsRow): string {
  const y = row.referenceYear.trim();
  if (row.unit.trim().toLowerCase() === 'status') {
    return y ? `Year: ${y}` : '';
  }
  return metaParts(row);
}

function panelMeta(row: GermanyGovernmentPoliticsRow, metric: string): string {
  if (metric === LAW_CHILDHOOD_CARE_METRIC) return lawMetaParts(row);
  return metaParts(row);
}

/** Tight vertical stack of highlight panels. */
const LGBT_STACK = 'flex flex-col gap-2';

/** Three metric cells per row, minimal gutters (reference: compact Highlights grid). */
const HIGHLIGHTS_GRID = 'grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-3';

const HIGHLIGHTS_GRID_COMPACT = 'grid grid-cols-1 gap-x-1 gap-y-1';

/** Children metrics shown three-abreast (compressed). Order matches CSV / section flow. */
const CHILDREN_COMPACT_ROW_A = [
  'Puberty blocker prescription rates',
  'Cross-sex hormone therapy initiation in minors',
  'Youth with gender dysphoria/incongruence receiving medical interventions',
] as const;

const CHILDREN_COMPACT_ROW_B = [
  'Detransition or desistance rates',
  'Regret rates after gender-affirming interventions in minors',
  'Age distribution of first medical intervention',
] as const;

function rowLabel(r: GermanyGovernmentPoliticsRow, onlyRow: boolean): string {
  const parts = [r.submetric, r.breakdown].map((s) => s.trim()).filter(Boolean);
  if (parts.length > 0) return parts.join(' · ');
  return onlyRow ? 'Value' : '—';
}

function valueAccentClass(r: GermanyGovernmentPoliticsRow): string | undefined {
  const formatted = formatValueDisplay(r);
  const raw = r.value.trim();
  const u = r.unit.trim().toLowerCase();
  if (!u.includes('change')) return undefined;
  if (formatted.startsWith('+') || raw.startsWith('+')) return 'text-emerald-400';
  if (formatted.startsWith('-') || raw.startsWith('-')) return 'text-rose-400';
  return undefined;
}

function rowValueParts(r: GermanyGovernmentPoliticsRow): { main: string; unitHint: string | null } {
  const main = formatValueDisplay(r);
  const u = r.unit.trim();
  if (!u) return { main, unitHint: null };
  const ul = u.toLowerCase();
  if (ul === 'percent' || ul.endsWith('percent') || main.endsWith('%')) return { main, unitHint: null };
  return { main, unitHint: u };
}

function aggregateSources(rows: GermanyGovernmentPoliticsRow[]): { url: string; label: string }[] {
  const out: { url: string; label: string }[] = [];
  const seen = new Set<string>();
  for (const r of rows) {
    for (const u of splitUrls(r.sourceUrl ?? '')) {
      if (seen.has(u)) continue;
      seen.add(u);
      const name = r.sourceName?.trim();
      out.push({ url: u, label: name || 'Source' });
    }
  }
  return out;
}

function leftColumnDescription(metric: string, headMeta: string, rows: GermanyGovernmentPoliticsRow[]): string {
  const parts: string[] = [];
  if (headMeta && !LGBT_METRICS_OMIT_META_LINE.has(metric)) parts.push(headMeta);
  const note = rows.map((r) => r.notes.trim()).find(Boolean);
  if (note && !LGBT_METRICS_NOTES_DETAILS_ONLY.has(metric)) {
    const short = note.length > 220 ? `${note.slice(0, 217)}…` : note;
    parts.push(short);
  }
  return parts.filter(Boolean).join('\n\n');
}

function rowMetaLine(
  r: GermanyGovernmentPoliticsRow,
  metric: string,
  headMeta: string,
): string | null {
  const line = panelMeta(r, metric);
  if (!line || line === headMeta) return null;
  if (LGBT_METRICS_OMIT_META_LINE.has(metric)) return null;
  if (LGBT_SURGERY_TREND_META_HIDE.has(metric) && r.unit.trim().toLowerCase() === 'percent change') return null;
  return line;
}

/**
 * Highlights-style block: black field, white type, left title + bottom copy, right 3-col grid
 * (value prominent above label; data from CSV only).
 */
function LgbtHighlightsPanel({
  rows,
  density = 'default',
}: {
  rows: GermanyGovernmentPoliticsRow[];
  density?: 'default' | 'compact';
}) {
  const compact = density === 'compact';
  const first = rows[0]!;
  const metric = first.metric;
  const isLawChildcareMetric = metric === LAW_CHILDHOOD_CARE_METRIC;
  const sourceEntries = aggregateSources(rows);
  const notes = rows.map((r) => r.notes.trim()).filter(Boolean);
  const headMeta = panelMeta(first, metric);
  const leftBlurb = isLawChildcareMetric ? headMeta : leftColumnDescription(metric, headMeta, rows);
  const gridClass = compact ? HIGHLIGHTS_GRID_COMPACT : HIGHLIGHTS_GRID;

  return (
    <article
      className={cn(
        'min-w-0 bg-black text-white',
        compact ? 'px-2 py-2 ring-1 ring-white/10' : 'px-3 py-3 sm:px-4 sm:py-4',
      )}
    >
      <div
        className={cn(
          'flex flex-col',
          compact ? 'gap-2' : 'gap-4 lg:flex-row lg:items-stretch lg:gap-6',
        )}
      >
        <div
          className={cn(
            'flex flex-col justify-between gap-2',
            compact ? 'min-h-0' : 'min-h-[8rem] flex-1 lg:max-w-[min(100%,20rem)] lg:shrink-0',
          )}
        >
          <h3
            className={cn(
              'font-sans font-bold leading-tight tracking-tight',
              compact ? 'text-[13px] leading-snug sm:text-sm' : 'text-xl sm:text-2xl',
            )}
          >
            {metric}
          </h3>
          {leftBlurb ? (
            <p
              className={cn(
                'font-sans font-normal leading-snug text-white/75 whitespace-pre-line',
                compact ? 'line-clamp-5 text-[9px]' : 'text-[11px]',
              )}
            >
              {leftBlurb}
            </p>
          ) : (
            <span className={cn('font-sans text-white/50', compact ? 'text-[9px]' : 'text-[11px]')}>
              Germany · Health · LGBT
            </span>
          )}
        </div>

        <div className={cn('min-w-0', !compact && 'flex-[1.6] lg:flex-[2]')}>
          {isLawChildcareMetric ? (
            <div className="space-y-2">
              {rows.map((r, i) => {
                const label = rowLabel(r, rows.length === 1);
                const { main, unitHint } = rowValueParts(r);
                const metaLine = rowMetaLine(r, metric, headMeta);
                return (
                  <div
                    key={`${r.submetric}-${r.breakdown}-${i}`}
                    className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-2"
                  >
                    <p className="font-sans text-[11px] leading-snug text-white/65">{label}</p>
                    <p className="mt-1 font-sans text-base font-semibold leading-tight text-white sm:text-lg">
                      {main}
                      {unitHint ? <span className="ml-1 text-[11px] font-normal text-white/55">{unitHint}</span> : null}
                    </p>
                    {metaLine ? (
                      <p className="mt-1 font-sans text-[10px] leading-snug text-white/45">{metaLine}</p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={gridClass}>
              {rows.map((r, i) => {
                const label = rowLabel(r, rows.length === 1);
                const { main, unitHint } = rowValueParts(r);
                const accent = valueAccentClass(r);
                const metaLine = rowMetaLine(r, metric, headMeta);
                return (
                  <div key={`${r.submetric}-${r.breakdown}-${i}`} className="min-w-0 text-left">
                    <p
                      className={cn(
                        'font-sans font-bold leading-none tracking-tight tabular-nums',
                        compact ? 'text-lg sm:text-xl' : 'text-2xl sm:text-3xl',
                        accent ?? 'text-white',
                      )}
                    >
                      {main}
                      {unitHint ? (
                        <span
                          className={cn(
                            'ml-0.5 align-baseline font-sans font-normal text-white/55',
                            compact ? 'text-[9px]' : 'text-xs',
                          )}
                        >
                          {unitHint}
                        </span>
                      ) : null}
                    </p>
                    <p
                      className={cn(
                        'mt-0.5 font-sans font-normal leading-snug text-white/70',
                        compact ? 'text-[10px]' : 'text-[11px]',
                      )}
                    >
                      {label}
                    </p>
                    {metaLine ? (
                      <p
                        className={cn(
                          'mt-0.5 font-sans leading-snug text-white/45',
                          compact ? 'text-[9px]' : 'text-[10px]',
                        )}
                      >
                        {metaLine}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {sourceEntries.length > 0 ? (
        <div className={cn('border-t border-white/10', compact ? 'mt-2 pt-1.5' : 'mt-3 pt-2')}>
          <p
            className={cn(
              'mb-0.5 font-sans font-semibold uppercase tracking-[0.14em] text-white/45',
              compact ? 'text-[8px]' : 'text-[9px]',
            )}
          >
            Sources
          </p>
          <ul
            className={cn(
              'flex flex-wrap font-sans text-white/80',
              compact ? 'gap-x-2 gap-y-0.5 text-[9px]' : 'gap-x-3 gap-y-1 text-[10px]',
            )}
          >
            {sourceEntries.map(({ url, label: srcLabel }, i) => (
              <li key={url}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-white/30 underline-offset-2 hover:text-white"
                >
                  {sourceEntries.length > 1 ? `${srcLabel} (${i + 1})` : srcLabel} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {notes.length > 0 ? (
        <details className={cn('border-t border-white/10', compact ? 'mt-1.5 pt-1.5' : 'mt-2 pt-2')}>
          <summary
            className={cn(
              'cursor-pointer font-sans font-semibold uppercase tracking-[0.12em] text-white/45',
              compact ? 'text-[8px]' : 'text-[9px]',
            )}
          >
            Notes
          </summary>
          <pre
            className={cn(
              'mt-1.5 max-h-[min(24rem,55vh)] overflow-y-auto whitespace-pre-wrap font-sans leading-relaxed text-white/55',
              compact ? 'text-[9px]' : 'text-[10px]',
            )}
          >
            {notes.join('\n\n')}
          </pre>
        </details>
      ) : null}
    </article>
  );
}

const TRIPLE_ROW_WRAP = 'grid grid-cols-1 gap-1 sm:grid-cols-3 sm:gap-1';

const CHILD_ROW_A_SKIP = new Set(CHILDREN_COMPACT_ROW_A.slice(1));
const CHILD_ROW_B_SKIP = new Set(CHILDREN_COMPACT_ROW_B.slice(1));

function buildChildrenPanelNodes(byMetric: Map<string, GermanyGovernmentPoliticsRow[]>): ReactNode[] {
  const nodes: ReactNode[] = [];
  const rowAKey = CHILDREN_COMPACT_ROW_A[0]!;
  const rowBKey = CHILDREN_COMPACT_ROW_B[0]!;

  for (const metric of GERMANY_LGBT_CHILDREN_METRIC_ORDER) {
    if (metric === rowAKey) {
      nodes.push(
        <div key="lgbt-children-compact-row-a" className={TRIPLE_ROW_WRAP}>
          {CHILDREN_COMPACT_ROW_A.map((m) => {
            const g = byMetric.get(m);
            return g ? <LgbtHighlightsPanel key={m} rows={g} density="compact" /> : null;
          })}
        </div>,
      );
      continue;
    }
    if (CHILD_ROW_A_SKIP.has(metric)) continue;

    if (metric === rowBKey) {
      nodes.push(
        <div key="lgbt-children-compact-row-b" className={TRIPLE_ROW_WRAP}>
          {CHILDREN_COMPACT_ROW_B.map((m) => {
            const g = byMetric.get(m);
            return g ? <LgbtHighlightsPanel key={m} rows={g} density="compact" /> : null;
          })}
        </div>,
      );
      continue;
    }
    if (CHILD_ROW_B_SKIP.has(metric)) continue;

    const g = byMetric.get(metric);
    if (g) nodes.push(<LgbtHighlightsPanel key={metric} rows={g} />);
  }

  return nodes;
}

export function GermanyLgbtSection() {
  const [raw, setRaw] = useState(lgbtCsvRaw);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(CSV_URL);
        const text = res.ok ? await res.text() : '';
        if (!cancelled && text.trim()) {
          setRaw(text);
          setLoadError(null);
        }
      } catch (e) {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : 'Failed to load LGBT care statistics.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const { adultGroups, childrenGroups } = useMemo(() => {
    const parsed = parseGermanyMetricTableCsv(raw);
    return {
      adultGroups: clusterMetricTable(parsed, 'LGBT', GERMANY_LGBT_METRIC_ORDER),
      childrenGroups: clusterMetricTable(parsed, 'LGBT children', GERMANY_LGBT_CHILDREN_METRIC_ORDER),
    };
  }, [raw]);

  const childrenPanelNodes = useMemo(() => {
    const byMetric = new Map<string, GermanyGovernmentPoliticsRow[]>();
    for (const g of childrenGroups) {
      byMetric.set(g[0]!.metric, g);
    }
    return buildChildrenPanelNodes(byMetric);
  }, [childrenGroups]);

  if (loadError) {
    return <p className="font-sans text-xs text-amber-500/90">{loadError}</p>;
  }

  if (adultGroups.length === 0 && childrenGroups.length === 0) {
    return (
      <p className="font-sans text-xs text-neutral-500">
        No rows in <code className="text-neutral-400">germany_gender_care_statistics.csv</code>.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {adultGroups.length > 0 ? (
        <div className={LGBT_STACK}>
          {adultGroups.map((g) => (
            <Fragment key={g[0]!.metric}>
              <LgbtHighlightsPanel rows={g} />
            </Fragment>
          ))}
        </div>
      ) : null}

      <CollapsibleFlagSection title="Children" count={childrenGroups.length} defaultOpen uppercaseTitle>
        {childrenGroups.length > 0 ? (
          <div className={cn(LGBT_STACK, '-mx-1')}>{childrenPanelNodes}</div>
        ) : (
          <p className="font-sans text-xs text-neutral-500">
            No child-focused rows found in <code className="text-neutral-400">germany_gender_care_statistics.csv</code>.
          </p>
        )}
      </CollapsibleFlagSection>

      <p className="font-sans text-[10px] leading-relaxed text-neutral-600 uppercase tracking-[0.03em]">
        Source: <code className="text-neutral-500">germany_gender_care_statistics.csv</code>
      </p>
    </div>
  );
}
