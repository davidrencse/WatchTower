import { useEffect, useMemo, useState } from 'react';
import germanyMigrantCrimeRaw from '../../Assets/Data/Europe/Germany/germany_migrant_crime_requested_metrics.csv?raw';
import germanyMigrantCrimeAdditionalRaw from '../../Assets/Data/Europe/Germany/germany_migrant_crime_additional_metrics.csv?raw';
import { parseCsvRows } from '../lib/csv';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from './ui/chart';
import { CartesianGrid, ComposedChart, Line, ResponsiveContainer, XAxis, YAxis } from 'recharts';

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
type MigrantCrimeSeriesKey = 'totalCrimes' | 'theft' | 'propertyCrimes' | 'juvenileCrimes';

type MigrantCrimeTrendRow = {
  year: string;
  totalCrimes: number;
  totalCrimesDisplay: string;
  theft: number;
  theftDisplay: string;
  propertyCrimes: number;
  propertyCrimesDisplay: string;
  juvenileCrimes: number;
  juvenileCrimesDisplay: string;
};

const migrantCrimeTrendChartConfig = {
  totalCrimes: { label: 'Total crimes by immigrants', color: '#f97316' },
  theft: { label: 'Theft by immigrants', color: '#22c55e' },
  propertyCrimes: { label: 'Property crimes by immigrants', color: '#38bdf8' },
  juvenileCrimes: { label: 'Juvenile crimes by immigrants', color: '#c084fc' },
} satisfies ChartConfig;

const MIGRANT_CRIME_TREND_SERIES: readonly MigrantCrimeTrendRow[] = [
  {
    year: '2000',
    totalCrimes: 480000,
    totalCrimesDisplay: '480,000',
    theft: 185000,
    theftDisplay: '185,000',
    propertyCrimes: 245000,
    propertyCrimesDisplay: '245,000',
    juvenileCrimes: 85000,
    juvenileCrimesDisplay: '85,000',
  },
  {
    year: '2001',
    totalCrimes: 490000,
    totalCrimesDisplay: '490,000',
    theft: 190000,
    theftDisplay: '190,000',
    propertyCrimes: 250000,
    propertyCrimesDisplay: '250,000',
    juvenileCrimes: 88000,
    juvenileCrimesDisplay: '88,000',
  },
  {
    year: '2002',
    totalCrimes: 510000,
    totalCrimesDisplay: '510,000',
    theft: 198000,
    theftDisplay: '198,000',
    propertyCrimes: 260000,
    propertyCrimesDisplay: '260,000',
    juvenileCrimes: 92000,
    juvenileCrimesDisplay: '92,000',
  },
  {
    year: '2003',
    totalCrimes: 520000,
    totalCrimesDisplay: '520,000',
    theft: 202000,
    theftDisplay: '202,000',
    propertyCrimes: 265000,
    propertyCrimesDisplay: '265,000',
    juvenileCrimes: 95000,
    juvenileCrimesDisplay: '95,000',
  },
  {
    year: '2004',
    totalCrimes: 530000,
    totalCrimesDisplay: '530,000',
    theft: 206000,
    theftDisplay: '206,000',
    propertyCrimes: 270000,
    propertyCrimesDisplay: '270,000',
    juvenileCrimes: 98000,
    juvenileCrimesDisplay: '98,000',
  },
  {
    year: '2005',
    totalCrimes: 550000,
    totalCrimesDisplay: '550,000',
    theft: 215000,
    theftDisplay: '215,000',
    propertyCrimes: 280000,
    propertyCrimesDisplay: '280,000',
    juvenileCrimes: 102000,
    juvenileCrimesDisplay: '102,000',
  },
  {
    year: '2006',
    totalCrimes: 570000,
    totalCrimesDisplay: '570,000',
    theft: 225000,
    theftDisplay: '225,000',
    propertyCrimes: 290000,
    propertyCrimesDisplay: '290,000',
    juvenileCrimes: 108000,
    juvenileCrimesDisplay: '108,000',
  },
  {
    year: '2007',
    totalCrimes: 580000,
    totalCrimesDisplay: '580,000',
    theft: 230000,
    theftDisplay: '230,000',
    propertyCrimes: 295000,
    propertyCrimesDisplay: '295,000',
    juvenileCrimes: 112000,
    juvenileCrimesDisplay: '112,000',
  },
  {
    year: '2008',
    totalCrimes: 590000,
    totalCrimesDisplay: '590,000',
    theft: 235000,
    theftDisplay: '235,000',
    propertyCrimes: 300000,
    propertyCrimesDisplay: '300,000',
    juvenileCrimes: 115000,
    juvenileCrimesDisplay: '115,000',
  },
  {
    year: '2009',
    totalCrimes: 600000,
    totalCrimesDisplay: '600,000',
    theft: 240000,
    theftDisplay: '240,000',
    propertyCrimes: 305000,
    propertyCrimesDisplay: '305,000',
    juvenileCrimes: 118000,
    juvenileCrimesDisplay: '118,000',
  },
  {
    year: '2010',
    totalCrimes: 610000,
    totalCrimesDisplay: '610,000',
    theft: 245000,
    theftDisplay: '245,000',
    propertyCrimes: 310000,
    propertyCrimesDisplay: '310,000',
    juvenileCrimes: 122000,
    juvenileCrimesDisplay: '122,000',
  },
  {
    year: '2011',
    totalCrimes: 620000,
    totalCrimesDisplay: '620,000',
    theft: 250000,
    theftDisplay: '250,000',
    propertyCrimes: 315000,
    propertyCrimesDisplay: '315,000',
    juvenileCrimes: 125000,
    juvenileCrimesDisplay: '125,000',
  },
  {
    year: '2012',
    totalCrimes: 630000,
    totalCrimesDisplay: '630,000',
    theft: 255000,
    theftDisplay: '255,000',
    propertyCrimes: 320000,
    propertyCrimesDisplay: '320,000',
    juvenileCrimes: 128000,
    juvenileCrimesDisplay: '128,000',
  },
  {
    year: '2013',
    totalCrimes: 640000,
    totalCrimesDisplay: '640,000',
    theft: 260000,
    theftDisplay: '260,000',
    propertyCrimes: 325000,
    propertyCrimesDisplay: '325,000',
    juvenileCrimes: 132000,
    juvenileCrimesDisplay: '132,000',
  },
  {
    year: '2014',
    totalCrimes: 650000,
    totalCrimesDisplay: '650,000',
    theft: 265000,
    theftDisplay: '265,000',
    propertyCrimes: 330000,
    propertyCrimesDisplay: '330,000',
    juvenileCrimes: 135000,
    juvenileCrimesDisplay: '135,000',
  },
  {
    year: '2015',
    totalCrimes: 720000,
    totalCrimesDisplay: '720,000',
    theft: 295000,
    theftDisplay: '295,000',
    propertyCrimes: 370000,
    propertyCrimesDisplay: '370,000',
    juvenileCrimes: 155000,
    juvenileCrimesDisplay: '155,000',
  },
  {
    year: '2016',
    totalCrimes: 850000,
    totalCrimesDisplay: '850,000',
    theft: 355000,
    theftDisplay: '355,000',
    propertyCrimes: 440000,
    propertyCrimesDisplay: '440,000',
    juvenileCrimes: 195000,
    juvenileCrimesDisplay: '195,000',
  },
  {
    year: '2017',
    totalCrimes: 900000,
    totalCrimesDisplay: '900,000',
    theft: 380000,
    theftDisplay: '380,000',
    propertyCrimes: 470000,
    propertyCrimesDisplay: '470,000',
    juvenileCrimes: 210000,
    juvenileCrimesDisplay: '210,000',
  },
  {
    year: '2018',
    totalCrimes: 950000,
    totalCrimesDisplay: '950,000',
    theft: 405000,
    theftDisplay: '405,000',
    propertyCrimes: 500000,
    propertyCrimesDisplay: '500,000',
    juvenileCrimes: 225000,
    juvenileCrimesDisplay: '225,000',
  },
  {
    year: '2019',
    totalCrimes: 980000,
    totalCrimesDisplay: '980,000',
    theft: 420000,
    theftDisplay: '420,000',
    propertyCrimes: 515000,
    propertyCrimesDisplay: '515,000',
    juvenileCrimes: 235000,
    juvenileCrimesDisplay: '235,000',
  },
  {
    year: '2020',
    totalCrimes: 850000,
    totalCrimesDisplay: '850,000',
    theft: 360000,
    theftDisplay: '360,000',
    propertyCrimes: 445000,
    propertyCrimesDisplay: '445,000',
    juvenileCrimes: 190000,
    juvenileCrimesDisplay: '190,000',
  },
  {
    year: '2021',
    totalCrimes: 780000,
    totalCrimesDisplay: '780,000',
    theft: 325000,
    theftDisplay: '325,000',
    propertyCrimes: 405000,
    propertyCrimesDisplay: '405,000',
    juvenileCrimes: 170000,
    juvenileCrimesDisplay: '170,000',
  },
  {
    year: '2022',
    totalCrimes: 784000,
    totalCrimesDisplay: '784,000',
    theft: 330000,
    theftDisplay: '330,000',
    propertyCrimes: 410000,
    propertyCrimesDisplay: '410,000',
    juvenileCrimes: 175000,
    juvenileCrimesDisplay: '175,000',
  },
  {
    year: '2023',
    totalCrimes: 800000,
    totalCrimesDisplay: '800,000',
    theft: 340000,
    theftDisplay: '340,000',
    propertyCrimes: 420000,
    propertyCrimesDisplay: '420,000',
    juvenileCrimes: 185000,
    juvenileCrimesDisplay: '185,000',
  },
  {
    year: '2024',
    totalCrimes: 823000,
    totalCrimesDisplay: '823,000',
    theft: 355000,
    theftDisplay: '355,000',
    propertyCrimes: 435000,
    propertyCrimesDisplay: '435,000',
    juvenileCrimes: 195000,
    juvenileCrimesDisplay: '195,000',
  },
  {
    year: '2025',
    totalCrimes: 824000,
    totalCrimesDisplay: '824,000',
    theft: 358000,
    theftDisplay: '358,000',
    propertyCrimes: 438000,
    propertyCrimesDisplay: '438,000',
    juvenileCrimes: 198000,
    juvenileCrimesDisplay: '198,000',
  },
];

function GermanyMigrantCrimeInteractiveTrendChart() {
  const [hoveredKey, setHoveredKey] = useState<MigrantCrimeSeriesKey | null>(null);
  const isDimmed = (key: MigrantCrimeSeriesKey) => hoveredKey !== null && hoveredKey !== key;

  const colorFor = (key: MigrantCrimeSeriesKey) =>
    isDimmed(key) ? '#737373' : (migrantCrimeTrendChartConfig[key].color ?? '#a3a3a3');
  const opacityFor = (key: MigrantCrimeSeriesKey) => (isDimmed(key) ? 0.3 : 1);
  const widthFor = (key: MigrantCrimeSeriesKey) => {
    if (hoveredKey === key) return 3.25;
    if (hoveredKey === null) return 2.5;
    return 2;
  };

  return (
    <Card className="col-span-full border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2 sm:p-5 sm:pb-3">
        <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          Migrant crime trend (Germany, 2000-2025)
        </CardTitle>
        <CardDescription className="font-sans text-[10px] leading-snug text-neutral-500">
          Hover a line to focus that series while the others fade to grey.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0 sm:p-5 sm:pt-0">
        <div className="space-y-3" onMouseLeave={() => setHoveredKey(null)}>
          <ChartContainer config={migrantCrimeTrendChartConfig} className="h-[360px] w-full font-sans">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={MIGRANT_CRIME_TREND_SERIES} margin={{ top: 8, right: 10, left: 2, bottom: 8 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis
                  dataKey="year"
                  tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(value) =>
                    new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(Number(value))
                  }
                  tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                  axisLine={false}
                  tickLine={false}
                  width={42}
                />
                <ChartTooltip
                  cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                  content={
                    <ChartTooltipContent
                      className="rounded-md"
                      labelFormatter={(_, payload) => {
                        const row = (payload as { payload?: MigrantCrimeTrendRow }[] | undefined)?.[0]?.payload;
                        return row ? `Year ${row.year}` : '';
                      }}
                      formatter={(_v, _entryLabel, item) => {
                        const entry = item as { payload?: MigrantCrimeTrendRow; dataKey?: unknown };
                        const row = entry.payload;
                        const key = String(entry.dataKey ?? '');
                        if (!row) return '—';
                        if (key === 'totalCrimes') return row.totalCrimesDisplay;
                        if (key === 'theft') return row.theftDisplay;
                        if (key === 'propertyCrimes') return row.propertyCrimesDisplay;
                        if (key === 'juvenileCrimes') return row.juvenileCrimesDisplay;
                        return '—';
                      }}
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="totalCrimes"
                  name="Total crimes by immigrants"
                  stroke={colorFor('totalCrimes')}
                  strokeOpacity={opacityFor('totalCrimes')}
                  strokeWidth={widthFor('totalCrimes')}
                  dot={{ r: hoveredKey === 'totalCrimes' ? 3 : 2 }}
                  activeDot={{ r: 5 }}
                  isAnimationActive={false}
                  onMouseEnter={() => setHoveredKey('totalCrimes')}
                />
                <Line
                  type="monotone"
                  dataKey="theft"
                  name="Theft by immigrants"
                  stroke={colorFor('theft')}
                  strokeOpacity={opacityFor('theft')}
                  strokeWidth={widthFor('theft')}
                  dot={{ r: hoveredKey === 'theft' ? 3 : 2 }}
                  activeDot={{ r: 5 }}
                  isAnimationActive={false}
                  onMouseEnter={() => setHoveredKey('theft')}
                />
                <Line
                  type="monotone"
                  dataKey="propertyCrimes"
                  name="Property crimes by immigrants"
                  stroke={colorFor('propertyCrimes')}
                  strokeOpacity={opacityFor('propertyCrimes')}
                  strokeWidth={widthFor('propertyCrimes')}
                  dot={{ r: hoveredKey === 'propertyCrimes' ? 3 : 2 }}
                  activeDot={{ r: 5 }}
                  isAnimationActive={false}
                  onMouseEnter={() => setHoveredKey('propertyCrimes')}
                />
                <Line
                  type="monotone"
                  dataKey="juvenileCrimes"
                  name="Juvenile crimes by immigrants"
                  stroke={colorFor('juvenileCrimes')}
                  strokeOpacity={opacityFor('juvenileCrimes')}
                  strokeWidth={widthFor('juvenileCrimes')}
                  dot={{ r: hoveredKey === 'juvenileCrimes' ? 3 : 2 }}
                  activeDot={{ r: 5 }}
                  isAnimationActive={false}
                  onMouseEnter={() => setHoveredKey('juvenileCrimes')}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
          <p className="text-center font-sans text-[10px] leading-relaxed text-neutral-600">
            Totals for 2000-2025: total crimes ~18.7M, theft ~7.8M, property crimes ~9.8M, juvenile crimes ~4.1M.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

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
      <GermanyMigrantCrimeInteractiveTrendChart />
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
