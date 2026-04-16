import { useEffect, useMemo, useState } from 'react';
import germanyMigrantCrimeRaw from '../../Assets/Data/Europe/Germany/germany_migrant_crime_requested_metrics.csv?raw';
import germanyMigrantCrimeAdditionalRaw from '../../Assets/Data/Europe/Germany/germany_migrant_crime_additional_metrics.csv?raw';
import { parseCsvRows } from '../lib/csv';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const CSV_URL = '/data/germany_migrant_crime_requested_metrics.csv';
const ADDITIONAL_CSV_URL = '/data/germany_migrant_crime_additional_metrics.csv';

type MigrantCrimeRow = {
  country: string;
  requested_metric: string;
  value: string;
  unit: string;
  year: string;
  what_this_number_is: string;
  best_official_substitute: string;
  source: string;
  source_url: string;
  note: string;
};

type AdditionalMetricRow = {
  country: string;
  metric: string;
  value: string;
  unit: string;
  reference_year: string;
  source: string;
  source_url: string;
  method_note: string;
};

type TileDef = { requestedMetric: string; title: string };

const TILES: TileDef[] = [
  { requestedMetric: 'Total Crime committed by migrants', title: 'Total crime' },
  { requestedMetric: 'Sex crime committed by migrants', title: 'Sex crime' },
  { requestedMetric: 'Rape committed by migrants', title: 'Rape' },
  { requestedMetric: 'Theft committed by migrants', title: 'Theft' },
  { requestedMetric: 'Murder committed by migrants', title: 'Murder' },
  { requestedMetric: 'drug_offenses_committed_by_migrants', title: 'Drug offences' },
];

/** Order and display titles (no “by migrants” in UI); keys match `metric` in additional CSV. */
const ADDITIONAL_METRICS: { metric: string; title: string }[] = [
  { metric: 'violent_crimes_by_migrants', title: 'Violent crimes' },
  { metric: 'property_crimes_by_migrants', title: 'Property crimes' },
  { metric: 'burglary_by_migrants', title: 'Burglary' },
  { metric: 'fraud_rate_by_migrants', title: 'Fraud rate' },
  { metric: 'court_dismissals_by_migrants', title: 'Court dismissals' },
  { metric: 'incarceration_percentage_by_migrants', title: 'Incarceration percentage' },
  { metric: 'juvenile_crimes_by_migrants', title: 'Juvenile crimes' },
  { metric: 'kidnapping_abduction_of_minors_by_migrants', title: 'Kidnapping/abduction of minors' },
  { metric: 'sexual_offenses_against_minors_by_migrants', title: 'Sexual offenses against minors' },
];

const CARD_GRID = 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3';

function norm(s: string): string {
  return String(s ?? '')
    .replace(/\uFEFF/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function parseRows(raw: string): MigrantCrimeRow[] {
  const rows = parseCsvRows(raw.trim());
  if (rows.length < 2) return [];
  const headers = rows[0]!.map((h) => h.trim());
  return rows.slice(1).map((cells) => {
    const o: Record<string, string> = {};
    headers.forEach((h, i) => {
      o[h] = (cells[i] ?? '').trim();
    });
    return o as unknown as MigrantCrimeRow;
  });
}

function parseAdditionalRows(raw: string): AdditionalMetricRow[] {
  const rows = parseCsvRows(raw.trim());
  if (rows.length < 2) return [];
  const headers = rows[0]!.map((h) => h.trim());
  return rows.slice(1).map((cells) => {
    const o: Record<string, string> = {};
    headers.forEach((h, i) => {
      o[h] = (cells[i] ?? '').trim();
    });
    return o as unknown as AdditionalMetricRow;
  });
}

function parseCount(s: string): number | null {
  const v = String(s ?? '').trim();
  if (!v || v.toUpperCase() === 'N/A') return null;
  const n = Number(v.replace(/,/g, ''));
  return Number.isFinite(n) ? n : null;
}

function fmtCount(n: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n);
}

function formatAdditionalValue(valueRaw: string, unitRaw: string): string {
  const unit = unitRaw.trim().toLowerCase();
  const v = String(valueRaw ?? '').trim();
  if (!v || v.toUpperCase() === 'N/A') return 'N/A';
  if (unit === 'percent') {
    const n = parseFloat(v.replace(/,/g, ''));
    return Number.isFinite(n) ? `${n % 1 === 0 ? n.toFixed(0) : n.toFixed(1)}%` : v;
  }
  const n = parseCount(v);
  return n != null ? fmtCount(n) : v;
}

function normalizeSourceUrls(urlField: string): string[] {
  return String(urlField ?? '')
    .split('|')
    .map((u) => u.trim())
    .filter(Boolean);
}

function combineNotes(row: MigrantCrimeRow): string {
  return [
    row.what_this_number_is ? `What this is: ${row.what_this_number_is}` : '',
    row.best_official_substitute ? `Best official substitute: ${row.best_official_substitute}` : '',
    row.note ? `Note: ${row.note}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

function CompactMigrantCard({
  title,
  meta,
  valueDisplay,
  urls,
  sourceLabel,
  notes,
}: {
  title: string;
  meta: string;
  valueDisplay: string;
  urls: string[];
  sourceLabel: string;
  notes: string;
}) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="space-y-0.5 p-3 pb-0">
        <CardTitle className="text-sm font-semibold leading-tight text-neutral-100">{title}</CardTitle>
        {meta ? <CardDescription className="text-[10px] leading-snug">{meta}</CardDescription> : null}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-2 p-3 pt-2">
        <p className="font-sans text-xl font-semibold tabular-nums tracking-tight text-white sm:text-2xl">
          {valueDisplay}
        </p>
        {urls.length > 0 ? (
          <div className="space-y-0.5">
            {urls.map((u, i) => (
              <a
                key={`${u}-${i}`}
                href={u}
                target="_blank"
                rel="noopener noreferrer"
                className="block font-sans text-[10px] leading-snug text-[var(--uk-accent)] hover:text-neutral-200"
              >
                {sourceLabel ? (urls.length > 1 ? `${sourceLabel} (${i + 1})` : sourceLabel) : `Source ${i + 1}`} ↗
              </a>
            ))}
          </div>
        ) : null}
        {notes ? (
          <details className="rounded-md border border-white/[0.06] bg-neutral-950/40 px-2 py-1.5">
            <summary className="cursor-pointer font-sans text-[9px] uppercase tracking-[0.12em] text-neutral-500 hover:text-neutral-400">
              Note
            </summary>
            <pre className="mt-1.5 max-h-40 overflow-y-auto whitespace-pre-wrap font-sans text-[10px] leading-relaxed text-neutral-500">
              {notes}
            </pre>
          </details>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function GermanyMigrantCrimeSection() {
  const [raw, setRaw] = useState<string>(germanyMigrantCrimeRaw);
  const [additionalRaw, setAdditionalRaw] = useState<string>(germanyMigrantCrimeAdditionalRaw);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [resRequested, resAdditional] = await Promise.all([fetch(CSV_URL), fetch(ADDITIONAL_CSV_URL)]);
        let textRequested = '';
        let textAdditional = '';
        if (resRequested.ok) textRequested = await resRequested.text();
        if (resAdditional.ok) textAdditional = await resAdditional.text();
        if (!cancelled) {
          if (textRequested.trim()) setRaw(textRequested);
          if (textAdditional.trim()) setAdditionalRaw(textAdditional);
          setLoadError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setLoadError(e instanceof Error ? e.message : 'Failed to load migrant crime data.');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const rows = useMemo(() => parseRows(raw), [raw]);
  const byRequested = useMemo(() => {
    const m = new Map<string, MigrantCrimeRow>();
    for (const r of rows) {
      const k = norm(r.requested_metric);
      if (k) m.set(k, r);
    }
    return m;
  }, [rows]);

  const additionalRows = useMemo(() => parseAdditionalRows(additionalRaw), [additionalRaw]);
  const byAdditionalMetric = useMemo(() => {
    const m = new Map<string, AdditionalMetricRow>();
    for (const r of additionalRows) {
      const k = norm(r.metric);
      if (k) m.set(k, r);
    }
    return m;
  }, [additionalRows]);

  return (
    <div className="flex flex-col gap-3">
      {loadError ? <p className="font-sans text-xs text-amber-500/90">{loadError}</p> : null}
      <div className={CARD_GRID}>
        {TILES.map((t) => {
          const r = byRequested.get(norm(t.requestedMetric));
          const n = r ? parseCount(r.value) : null;
          const unit = r?.unit?.trim() ?? '';
          const year = r?.year?.trim() ?? '';
          const meta = [year ? `Year: ${year}` : null, unit || null].filter(Boolean).join(' · ');
          const urls = r ? normalizeSourceUrls(r.source_url) : [];
          const notes = r ? combineNotes(r) : '';
          const valueDisplay =
            n != null ? fmtCount(n) : r?.value?.trim() ? r.value.trim() : 'N/A';
          return (
            <CompactMigrantCard
              key={t.title}
              title={t.title}
              meta={meta}
              valueDisplay={valueDisplay}
              urls={urls}
              sourceLabel={r?.source?.trim() ?? ''}
              notes={notes}
            />
          );
        })}
        {ADDITIONAL_METRICS.map(({ metric, title }) => {
          const r = byAdditionalMetric.get(norm(metric));
          const unit = r?.unit?.trim() ?? '';
          const year = r?.reference_year?.trim() ?? '';
          const meta = [year ? `Year: ${year}` : null, unit || null].filter(Boolean).join(' · ');
          const urls = r ? normalizeSourceUrls(r.source_url) : [];
          const methodNote = r?.method_note?.trim() ?? '';
          const valueDisplay = r ? formatAdditionalValue(r.value, r.unit) : 'N/A';
          return (
            <CompactMigrantCard
              key={metric}
              title={title}
              meta={meta}
              valueDisplay={valueDisplay}
              urls={urls}
              sourceLabel={r?.source?.trim() ?? ''}
              notes={methodNote}
            />
          );
        })}
      </div>
    </div>
  );
}
