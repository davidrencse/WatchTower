import { Fragment, memo, useEffect, useMemo, useState } from 'react';
import healthBasicCsvRaw from '../../Assets/Data/Europe/Germany/Health Section/germany_health_statistics_basic.csv?raw';
import type { GermanyGovernmentPoliticsRow } from '../lib/germanyGovernmentPolitics';
import {
  clusterMetricTable,
  GERMANY_HEALTH_BASIC_METRIC_ORDER,
  parseGermanyMetricTableCsv,
} from '../lib/germanyHealthCsv';
import { GOV_POLITICS_CARD_GRID, GovStatCard, renderMetricGroup, splitUrls, formatValueDisplay } from './GermanyGovernmentPoliticsBlocks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const CSV_URL = '/data/germany_health_statistics_basic.csv';

/** These overview metrics use stat cards; Healthcare expenditure uses a grouped card with table layout. */
const HEALTH_OVERVIEW_BOX_METRICS = new Set([
  'Obesity rate',
  'Smoking prevalence',
  'Suicide Rate',
  'Physicians per 1,000 people',
  'Total number of doctors',
  'Healthy life expectancy',
  'Preventable mortality rate',
  'Alcohol consumption',
]);

const OECD_HAAG_GERMANY_HTML =
  'https://www.oecd.org/en/publications/health-at-a-glance-2025_15a55280-en/germany_99d672fb-en.html';
const OECD_HAAG_GERMANY_PDF =
  'https://www.oecd.org/content/dam/oecd/en/publications/reports/2025/11/health-at-a-glance-2025-country-notes_2f94481e/germany_461a6f3f/99d672fb-en.pdf';

/** OECD Health at a Glance 2025 – Germany (supplementary to CSV). */
const HEALTH_OVERVIEW_OECD_EXTRA_ROWS: GermanyGovernmentPoliticsRow[] = [
  {
    section: 'Health overview',
    subsection: '',
    metric: 'Life expectancy',
    submetric: '',
    breakdown: '',
    value: '81.1',
    unit: 'years',
    referenceYear: '2025',
    sourceName: 'OECD Health at a Glance 2025 – Germany',
    sourceUrl: OECD_HAAG_GERMANY_HTML,
    notes: '',
  },
  {
    section: 'Health overview',
    subsection: '',
    metric: 'Self-reported poor health',
    submetric: 'Population aged 15+',
    breakdown: 'Bad or very bad self-rated health',
    value: '10.9',
    unit: 'percent',
    referenceYear: '2025',
    sourceName: 'OECD Health at a Glance 2025 – Germany Country Note',
    sourceUrl: OECD_HAAG_GERMANY_PDF,
    notes: 'Share of the population aged 15+ rating their health as bad or very bad.',
  },
  {
    section: 'Health overview',
    subsection: '',
    metric: 'Insufficient physical activity',
    submetric: 'Adults',
    breakdown: '',
    value: '15',
    unit: 'percent',
    referenceYear: '2025',
    sourceName: 'OECD Health at a Glance 2025 – Germany Country Note',
    sourceUrl: OECD_HAAG_GERMANY_HTML,
    notes: 'Share of adults with insufficient physical activity (better than OECD average).',
  },
  {
    section: 'Health overview',
    subsection: '',
    metric: 'Healthy life expectancy (OECD country note)',
    submetric: 'At birth',
    breakdown: '',
    value: '57',
    unit: 'years',
    referenceYear: '2025',
    sourceName: 'OECD Health at a Glance 2025 – Germany Country Note (OECD Health Statistics 2025)',
    sourceUrl: OECD_HAAG_GERMANY_PDF,
    notes: 'Approximate HALE at birth in OECD country note; women slightly higher than men.',
  },
];

function HealthcareExpenditureStyledCard({ rows }: { rows: GermanyGovernmentPoliticsRow[] }) {
  const perCapitaTotal = rows.find((r) => r.submetric.toLowerCase().includes('per capita') && r.breakdown === 'Total');
  const shareGdpTotal = rows.find((r) => r.submetric.toLowerCase().includes('share of gdp') && r.breakdown === 'Total');
  const privateShare = rows.find((r) => r.breakdown === 'Private financing share');
  const publicShare = rows.find((r) => r.breakdown === 'Public financing share');
  const referenceYear = rows.find((r) => r.referenceYear)?.referenceYear || '2024';

  const publicPct = Number(publicShare?.value) || 0;
  const privatePct = Number(privateShare?.value) || 0;
  const gdpPct = Number(shareGdpTotal?.value) || 0;

  const tableRows = [
    { label: 'Per capita expenditure', row: perCapitaTotal, unitFallback: 'EUR per person' },
    { label: 'Public financing share', row: publicShare, unitFallback: 'percent of current health expenditure' },
    { label: 'Private financing share', row: privateShare, unitFallback: 'percent of current health expenditure' },
    { label: 'Share of GDP', row: shareGdpTotal, unitFallback: 'percent of GDP' },
  ].filter((t) => t.row);

  const sourceLinks: { name: string; url: string }[] = [];
  const seenUrl = new Set<string>();
  for (const r of rows) {
    for (const u of splitUrls(r.sourceUrl)) {
      if (seenUrl.has(u)) continue;
      seenUrl.add(u);
      sourceLinks.push({
        url: u,
        name: (r.sourceName || '').trim() || 'Source',
      });
    }
  }

  const notes = rows.map((r) => r.notes.trim()).filter(Boolean);

  return (
    <Card className="flex flex-col overflow-hidden border-line bg-surface-metric sm:col-span-2 lg:col-span-3">
      <CardHeader className="space-y-0.5 p-3 pb-0">
        <CardTitle className="text-sm font-semibold leading-tight uppercase tracking-[0.05em] text-neutral-100">
          Healthcare expenditure
        </CardTitle>
        <CardDescription className="text-[10px] uppercase tracking-[0.03em] text-neutral-500">
          Reference year: {referenceYear}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 p-3 pt-2">
        <div className="overflow-x-auto rounded border border-line">
          <table className="w-full min-w-[280px] border-collapse font-sans text-[11px]">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.03] text-left text-[10px] uppercase tracking-[0.1em] text-neutral-500">
                <th className="px-3 py-2 font-medium">Measure</th>
                <th className="px-3 py-2 font-medium text-right">Value</th>
                <th className="px-3 py-2 font-medium">Unit</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((t) =>
                t.row ? (
                  <tr key={t.label} className="border-b border-white/[0.06] last:border-0">
                    <td className="px-3 py-2 uppercase tracking-[0.04em] text-neutral-200">{t.label}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-white">{formatValueDisplay(t.row!)}</td>
                    <td className="px-3 py-2 uppercase tracking-[0.03em] text-neutral-400">
                      {(t.row.unit || t.unitFallback).trim() || t.unitFallback}
                    </td>
                  </tr>
                ) : null,
              )}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 rounded border border-line p-3">
          <div>
            <div className="mb-1 flex items-center justify-between text-[11px] uppercase tracking-[0.04em] text-neutral-300">
              <span>Public financing share</span>
              <span className="font-semibold tabular-nums text-neutral-100">{publicPct.toFixed(0)}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/[0.08]">
              <div className="h-full rounded-full bg-[#3b82f6]" style={{ width: `${Math.max(2, Math.min(100, publicPct))}%` }} />
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-[11px] uppercase tracking-[0.04em] text-neutral-300">
              <span>Private financing share</span>
              <span className="font-semibold tabular-nums text-neutral-100">{privatePct.toFixed(0)}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/[0.08]">
              <div className="h-full rounded-full bg-[#fb923c]" style={{ width: `${Math.max(2, Math.min(100, privatePct))}%` }} />
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-[11px] uppercase tracking-[0.04em] text-neutral-300">
              <span>Share of GDP</span>
              <span className="font-semibold tabular-nums text-neutral-100">{gdpPct.toFixed(1)}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/[0.08]">
              <div className="h-full rounded-full bg-[#a3e635]" style={{ width: `${Math.max(2, Math.min(100, gdpPct * 4))}%` }} />
            </div>
          </div>
        </div>

        {sourceLinks.length > 0 ? (
          <div className="space-y-0.5">
            {sourceLinks.map(({ url, name }, i) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block font-sans text-[10px] uppercase tracking-[0.03em] text-[var(--uk-accent)] hover:text-neutral-200"
              >
                {sourceLinks.length > 1 ? `${name} (${i + 1})` : name} ↗
              </a>
            ))}
          </div>
        ) : null}

        {notes.length > 0 ? (
          <details className="rounded-md border border-white/[0.06] bg-neutral-950/40 px-2 py-1.5">
            <summary className="cursor-pointer font-sans text-[9px] uppercase tracking-[0.12em] text-neutral-500 hover:text-neutral-400">
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

export const GermanyHealthBasicSection = memo(function GermanyHealthBasicSection() {
  const [raw, setRaw] = useState(healthBasicCsvRaw);
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
        if (!cancelled) setLoadError(e instanceof Error ? e.message : 'Failed to load health statistics.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const groups = useMemo(() => {
    const parsed = parseGermanyMetricTableCsv(raw);
    return clusterMetricTable(parsed, 'Health overview', GERMANY_HEALTH_BASIC_METRIC_ORDER);
  }, [raw]);

  if (loadError) {
    return <p className="font-sans text-xs text-amber-500/90">{loadError}</p>;
  }

  if (groups.length === 0) {
    return (
      <p className="font-sans text-xs text-neutral-500">
        No rows in <code className="text-neutral-400">germany_health_statistics_basic.csv</code>.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className={GOV_POLITICS_CARD_GRID}>
        {groups.map((g) => {
          const metric = g[0]!.metric;
          if (metric === 'Healthcare expenditure') {
            return <HealthcareExpenditureStyledCard key={metric} rows={g} />;
          }
          if (HEALTH_OVERVIEW_BOX_METRICS.has(metric)) {
            return (
              <Fragment key={metric}>
                {g.map((row, i) => (
                  <GovStatCard key={`${metric}-${i}-${row.breakdown}-${row.submetric}`} row={row} />
                ))}
              </Fragment>
            );
          }
          return <Fragment key={metric}>{renderMetricGroup(g)}</Fragment>;
        })}
        {HEALTH_OVERVIEW_OECD_EXTRA_ROWS.map((row, i) => (
          <GovStatCard key={`health-overview-oecd-${i}-${row.metric}`} row={row} />
        ))}
      </div>
    </div>
  );
});
