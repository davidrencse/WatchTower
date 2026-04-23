import type { CountryWideRow } from '../lib/parseCountriesWideCsv';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from './ui/chart';
import { Separator } from './ui/separator';
import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

type CrimeBoxConfig = {
  id: string;
  title: string;
  valueKey: keyof CountryWideRow;
  yearKey: keyof CountryWideRow;
  unitKey: keyof CountryWideRow;
  definitionKey: keyof CountryWideRow;
  sourceUrlKey: keyof CountryWideRow;
  sourceLabelKey: keyof CountryWideRow;
  methodNoteKey: keyof CountryWideRow;
};

const CRIME_BOXES: CrimeBoxConfig[] = [
  {
    id: 'petty-latest',
    title: 'Petty crime statistics',
    valueKey: 'petty_latest_value',
    yearKey: 'petty_latest_year',
    unitKey: 'petty_latest_unit',
    definitionKey: 'petty_latest_definition',
    sourceUrlKey: 'petty_latest_source_url',
    sourceLabelKey: 'petty_latest_source_label',
    methodNoteKey: 'petty_latest_method_note',
  },
  {
    id: 'rape-latest',
    title: 'Rape crime statistics',
    valueKey: 'rape_latest_value',
    yearKey: 'rape_latest_year',
    unitKey: 'rape_latest_unit',
    definitionKey: 'rape_latest_definition',
    sourceUrlKey: 'rape_latest_source_url',
    sourceLabelKey: 'rape_latest_source_label',
    methodNoteKey: 'rape_latest_method_note',
  },
  {
    id: 'theft-latest',
    title: 'Theft crime statistics',
    valueKey: 'theft_latest_value',
    yearKey: 'theft_latest_year',
    unitKey: 'theft_latest_unit',
    definitionKey: 'theft_latest_definition',
    sourceUrlKey: 'theft_latest_source_url',
    sourceLabelKey: 'theft_latest_source_label',
    methodNoteKey: 'theft_latest_method_note',
  },
  {
    id: 'sexual-latest',
    title: 'Sexual crime statistics',
    valueKey: 'sexual_latest_value',
    yearKey: 'sexual_latest_year',
    unitKey: 'sexual_latest_unit',
    definitionKey: 'sexual_latest_definition',
    sourceUrlKey: 'sexual_latest_source_url',
    sourceLabelKey: 'sexual_latest_source_label',
    methodNoteKey: 'sexual_latest_method_note',
  },
];

type GermanyCrimeStatCard = {
  id: string;
  category: string;
  figure: string;
  metric: string;
  notes: string;
};

const GERMANY_CRIME_2024_STATS: readonly GermanyCrimeStatCard[] = [
  {
    id: 'total-crime-suspects',
    category: 'Total Crime',
    figure: '2,184,834',
    metric: 'suspects',
    notes: '-2.8% (total recorded offences: 5,837,445)',
  },
  {
    id: 'sex-crime-total',
    category: 'Sex Crime',
    figure: '127,775',
    metric: 'offences',
    notes: '(total sexual offences against sexual self-determination)',
  },
  {
    id: 'rape-serious',
    category: 'Rape',
    figure: '13,320',
    metric: 'offences',
    notes: '(rape, sexual coercion & serious sexual assault incl. resulting in death)',
  },
  { id: 'theft', category: 'Theft', figure: '1,940,033', metric: 'offences', notes: '-' },
  {
    id: 'murder',
    category: 'Murder',
    figure: '2,303',
    metric: 'completed cases',
    notes: '(murder, manslaughter & killing on request)',
  },
  {
    id: 'drug-offences',
    category: 'Drug Offences',
    figure: '228,104',
    metric: 'offences',
    notes: '-34.2% (largely due to cannabis partial legalisation)',
  },
  { id: 'violent-crimes', category: 'Violent Crimes', figure: '217,277', metric: 'offences', notes: '-' },
  {
    id: 'property-crimes',
    category: 'Property Crimes',
    figure: '~2,700,000+',
    metric: 'offences',
    notes: '(theft + fraud + damage to property combined)',
  },
  {
    id: 'burglary',
    category: 'Burglary',
    figure: '78,436',
    metric: 'offences',
    notes: '(theft by burglary of a dwelling)',
  },
  {
    id: 'fraud-rate',
    category: 'Fraud Rate',
    figure: '12.7%',
    metric: '% of total offences',
    notes: '743,472 offences',
  },
  {
    id: 'court-dismissals',
    category: 'Court Dismissals',
    figure: '5.5 million criminal investigation proceedings',
    metric: '-',
    notes: 'Handled by Destatis / public prosecutor stats',
  },
  {
    id: 'incarceration-foreign',
    category: 'Incarceration Percentage (foreign nationals in prison)',
    figure: '48.8%',
    metric: '% of total prison population',
    notes: 'As of 31 Jan 2024 (World Prison Brief / official prison data)',
  },
  {
    id: 'juvenile-violent',
    category: 'Juvenile Crimes (violent crimes by juvenile suspects 14-<18)',
    figure: '31,383',
    metric: 'juvenile suspects',
    notes: 'Slight increase',
  },
  {
    id: 'kidnapping-minors',
    category: 'Kidnapping / Abduction of Minors',
    figure: '2,747',
    metric: 'cases (incl. attempts)',
    notes: 'Includes child abduction & trafficking in children',
  },
  {
    id: 'sex-offences-minors',
    category: 'Sexual Offences Against Minors',
    figure: '16,354',
    metric: 'offences',
    notes: 'Sexual abuse of children (slight decrease -0.1%)',
  },
  {
    id: 'clear-up-rate',
    category: 'Clear-up rate (Aufklarungsquote)',
    figure: '58.0% overall',
    metric: 'clear-up rate',
    notes: 'Very high for murder/manslaughter at 94.1%',
  },
  {
    id: 'violent-crime-juvenile-suspects',
    category: 'Violent crime by juvenile suspects',
    figure: '31,383',
    metric: 'cases',
    notes: 'Increased slightly',
  },
];

function parseCount(s: string): number | null {
  if (!s?.trim() || s.trim().toUpperCase() === 'N/A') return null;
  const n = Number(String(s).replace(/,/g, ''));
  return Number.isFinite(n) ? n : null;
}

function formatCount(n: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n);
}

type GermanyRecordedCrimesChartRow = {
  year: string;
  totalCrimes: number;
  totalCrimesDisplay: string;
  rapesSerious: number;
  rapesSeriousDisplay: string;
  totalSexCrimes: number;
  totalSexCrimesDisplay: string;
};

const GERMANY_RECORDED_CRIMES_SEXUAL_VIOLENCE_SERIES: readonly GermanyRecordedCrimesChartRow[] = [
  {
    year: '2000',
    totalCrimes: 6363865,
    totalCrimesDisplay: '6,363,865',
    rapesSerious: 7500,
    rapesSeriousDisplay: '~7,500',
    totalSexCrimes: 45000,
    totalSexCrimesDisplay: '~45,000',
  },
  {
    year: '2001',
    totalCrimes: 6363156,
    totalCrimesDisplay: '6,363,156',
    rapesSerious: 7600,
    rapesSeriousDisplay: '~7,600',
    totalSexCrimes: 46000,
    totalSexCrimesDisplay: '~46,000',
  },
  {
    year: '2002',
    totalCrimes: 6507394,
    totalCrimesDisplay: '6,507,394',
    rapesSerious: 7800,
    rapesSeriousDisplay: '~7,800',
    totalSexCrimes: 47000,
    totalSexCrimesDisplay: '~47,000',
  },
  {
    year: '2003',
    totalCrimes: 6572135,
    totalCrimesDisplay: '6,572,135',
    rapesSerious: 8000,
    rapesSeriousDisplay: '~8,000',
    totalSexCrimes: 48000,
    totalSexCrimesDisplay: '~48,000',
  },
  {
    year: '2004',
    totalCrimes: 6633156,
    totalCrimesDisplay: '6,633,156',
    rapesSerious: 8100,
    rapesSeriousDisplay: '~8,100',
    totalSexCrimes: 49000,
    totalSexCrimesDisplay: '~49,000',
  },
  {
    year: '2005',
    totalCrimes: 6391715,
    totalCrimesDisplay: '6,391,715',
    rapesSerious: 8000,
    rapesSeriousDisplay: '~8,000',
    totalSexCrimes: 48500,
    totalSexCrimesDisplay: '~48,500',
  },
  {
    year: '2006',
    totalCrimes: 6304223,
    totalCrimesDisplay: '6,304,223',
    rapesSerious: 7900,
    rapesSeriousDisplay: '~7,900',
    totalSexCrimes: 47500,
    totalSexCrimesDisplay: '~47,500',
  },
  {
    year: '2007',
    totalCrimes: 6284661,
    totalCrimesDisplay: '6,284,661',
    rapesSerious: 8389,
    rapesSeriousDisplay: '~8,389',
    totalSexCrimes: 48000,
    totalSexCrimesDisplay: '~48,000',
  },
  {
    year: '2008',
    totalCrimes: 6264723,
    totalCrimesDisplay: '6,264,723',
    rapesSerious: 8232,
    rapesSeriousDisplay: '~8,232',
    totalSexCrimes: 48500,
    totalSexCrimesDisplay: '~48,500',
  },
  {
    year: '2009',
    totalCrimes: 6054330,
    totalCrimesDisplay: '6,054,330',
    rapesSerious: 7986,
    rapesSeriousDisplay: '~7,986',
    totalSexCrimes: 47800,
    totalSexCrimesDisplay: '~47,800',
  },
  {
    year: '2010',
    totalCrimes: 5933278,
    totalCrimesDisplay: '5,933,278',
    rapesSerious: 7134,
    rapesSeriousDisplay: '~7,134',
    totalSexCrimes: 47000,
    totalSexCrimesDisplay: '~47,000',
  },
  {
    year: '2011',
    totalCrimes: 5990679,
    totalCrimesDisplay: '5,990,679',
    rapesSerious: 7539,
    rapesSeriousDisplay: '~7,539',
    totalSexCrimes: 47500,
    totalSexCrimesDisplay: '~47,500',
  },
  {
    year: '2012',
    totalCrimes: 5997040,
    totalCrimesDisplay: '5,997,040',
    rapesSerious: 7400,
    rapesSeriousDisplay: '~7,400',
    totalSexCrimes: 45824,
    totalSexCrimesDisplay: '~45,824',
  },
  {
    year: '2013',
    totalCrimes: 5961662,
    totalCrimesDisplay: '5,961,662',
    rapesSerious: 7300,
    rapesSeriousDisplay: '~7,300',
    totalSexCrimes: 46000,
    totalSexCrimesDisplay: '~46,000',
  },
  {
    year: '2014',
    totalCrimes: 6082064,
    totalCrimesDisplay: '6,082,064',
    rapesSerious: 7200,
    rapesSeriousDisplay: '~7,200',
    totalSexCrimes: 47000,
    totalSexCrimesDisplay: '~47,000',
  },
  {
    year: '2015',
    totalCrimes: 6330649,
    totalCrimesDisplay: '6,330,649',
    rapesSerious: 7400,
    rapesSeriousDisplay: '~7,400',
    totalSexCrimes: 48000,
    totalSexCrimesDisplay: '~48,000',
  },
  {
    year: '2016',
    totalCrimes: 6372526,
    totalCrimesDisplay: '6,372,526',
    rapesSerious: 8000,
    rapesSeriousDisplay: '~8,000+',
    totalSexCrimes: 52000,
    totalSexCrimesDisplay: '~52,000',
  },
  {
    year: '2017',
    totalCrimes: 5761984,
    totalCrimesDisplay: '5,761,984',
    rapesSerious: 9000,
    rapesSeriousDisplay: '~9,000+',
    totalSexCrimes: 61000,
    totalSexCrimesDisplay: '~61,000',
  },
  {
    year: '2018',
    totalCrimes: 5555520,
    totalCrimesDisplay: '5,555,520',
    rapesSerious: 9500,
    rapesSeriousDisplay: '~9,500',
    totalSexCrimes: 65000,
    totalSexCrimesDisplay: '~65,000',
  },
  {
    year: '2019',
    totalCrimes: 5436401,
    totalCrimesDisplay: '5,436,401',
    rapesSerious: 10000,
    rapesSeriousDisplay: '~10,000',
    totalSexCrimes: 70000,
    totalSexCrimesDisplay: '~70,000',
  },
  {
    year: '2020',
    totalCrimes: 5310621,
    totalCrimesDisplay: '5,310,621',
    rapesSerious: 10500,
    rapesSeriousDisplay: '~10,500',
    totalSexCrimes: 75000,
    totalSexCrimesDisplay: '~75,000',
  },
  {
    year: '2021',
    totalCrimes: 5047860,
    totalCrimesDisplay: '5,047,860',
    rapesSerious: 11000,
    rapesSeriousDisplay: '~11,000',
    totalSexCrimes: 106656,
    totalSexCrimesDisplay: '~106,656',
  },
  {
    year: '2022',
    totalCrimes: 5628584,
    totalCrimesDisplay: '5,628,584',
    rapesSerious: 12000,
    rapesSeriousDisplay: '~12,000+',
    totalSexCrimes: 115000,
    totalSexCrimesDisplay: '~115,000',
  },
  {
    year: '2023',
    totalCrimes: 5940667,
    totalCrimesDisplay: '5,940,667',
    rapesSerious: 12186,
    rapesSeriousDisplay: '12,186',
    totalSexCrimes: 120000,
    totalSexCrimesDisplay: '~120,000+',
  },
  {
    year: '2024',
    totalCrimes: 5837445,
    totalCrimesDisplay: '5,837,445',
    rapesSerious: 13320,
    rapesSeriousDisplay: '13,320',
    totalSexCrimes: 125000,
    totalSexCrimesDisplay: '~125,000+',
  },
  {
    year: '2025',
    totalCrimes: 5508559,
    totalCrimesDisplay: '5,508,559',
    rapesSerious: 14454,
    rapesSeriousDisplay: '14,454',
    totalSexCrimes: 131335,
    totalSexCrimesDisplay: '131,335',
  },
];

const germanyTotalRecordedCrimesChartConfig = {
  totalCrimes: { label: 'Total recorded crimes', color: '#60a5fa' },
  rapesSerious: { label: 'Rapes & serious sexual assaults', color: '#f472b6' },
  totalSexCrimes: { label: 'Total sex crimes', color: '#a78bfa' },
} satisfies ChartConfig;

/** Germany-only: national totals vs. sexual-offence series (approximate values as entered). */
export function GermanyTotalRecordedCrimesChart() {
  return (
    <Card className="col-span-full border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2 sm:p-5 sm:pb-3">
        <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          Recorded crime vs. sexual violence (Germany)
        </CardTitle>
        <CardDescription className="font-sans text-[10px] leading-snug text-neutral-500">
          Left axis: all recorded crimes. Right axis: rapes/serious sexual assaults and total sex crimes (approximate
          values use the numeric part of each label for the line).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0 sm:p-5 sm:pt-0">
        <ChartContainer config={germanyTotalRecordedCrimesChartConfig} className="h-[360px] w-full font-sans">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={GERMANY_RECORDED_CRIMES_SEXUAL_VIOLENCE_SERIES}
              margin={{ top: 8, right: 10, left: 4, bottom: 8 }}
            >
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="left"
                tickFormatter={(value) => `${(Number(value) / 1_000_000).toFixed(1)}M`}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                width={44}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={(value) =>
                  new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(Number(value))
                }
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <ChartTooltip
                cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                content={
                  <ChartTooltipContent
                    className="rounded-md"
                    labelFormatter={(_, payload) => {
                      const p = (payload as { payload?: GermanyRecordedCrimesChartRow }[] | undefined)?.[0]?.payload;
                      return p ? `Year ${p.year}` : '';
                    }}
                    formatter={(_v, _entryLabel, item) => {
                      const row = (item as { payload?: GermanyRecordedCrimesChartRow; dataKey?: string } | undefined)
                        ?.payload;
                      const dk = String((item as { dataKey?: string }).dataKey ?? '');
                      if (!row) return '—';
                      if (dk === 'totalCrimes') return row.totalCrimesDisplay;
                      if (dk === 'rapesSerious') return row.rapesSeriousDisplay;
                      if (dk === 'totalSexCrimes') return row.totalSexCrimesDisplay;
                      return '—';
                    }}
                  />
                }
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', color: 'rgba(212,212,212,0.9)' }}
                iconType="line"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="totalCrimes"
                name="Total recorded crimes"
                stroke="#60a5fa"
                strokeWidth={2.5}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="rapesSerious"
                name="Rapes & serious sexual assaults"
                stroke="#f472b6"
                strokeWidth={2.5}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="totalSexCrimes"
                name="Total sex crimes"
                stroke="#a78bfa"
                strokeWidth={2.5}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function CrimeStatCard({ row, config }: { row: CountryWideRow; config: CrimeBoxConfig }) {
  const raw = String(row[config.valueKey] ?? '');
  const n = parseCount(raw);
  const year = String(row[config.yearKey] ?? '').trim();
  const unit = String(row[config.unitKey] ?? '').trim();
  const definition = String(row[config.definitionKey] ?? '').trim();
  const sourceUrl = String(row[config.sourceUrlKey] ?? '').trim();
  const sourceLabel = String(row[config.sourceLabelKey] ?? '').trim();
  const methodNote = String(row[config.methodNoteKey] ?? '').trim();

  const metaLine = [year ? `Year: ${year}` : null, unit || null].filter(Boolean).join(' · ');

  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="pb-0">
        <CardTitle>{config.title}</CardTitle>
        {metaLine ? <CardDescription>{metaLine}</CardDescription> : null}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 pt-4">
        <div className="space-y-3">
          <p className="font-sans text-3xl font-semibold tabular-nums tracking-tight text-white">
            {n != null ? formatCount(n) : 'N/A'}
          </p>
        </div>

        <Separator />

        {definition ? (
          <p className="font-sans text-[11px] leading-relaxed text-neutral-500">{definition}</p>
        ) : null}
        {sourceUrl ? (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[11px] text-[var(--uk-accent)] hover:text-neutral-200"
          >
            {sourceLabel || 'Source'} ↗
          </a>
        ) : null}
        {methodNote ? (
          <details className="rounded-md border border-white/[0.06] bg-neutral-950/40 px-3 py-2">
            <summary className="cursor-pointer font-sans text-[10px] uppercase tracking-[0.12em] text-neutral-500 hover:text-neutral-400">
              Method note
            </summary>
            <p className="mt-2 font-sans text-[11px] leading-relaxed text-neutral-500">{methodNote}</p>
          </details>
        ) : null}
      </CardContent>
    </Card>
  );
}

function GermanyCrime2024StatCard({ item }: { item: GermanyCrimeStatCard }) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="pb-0">
        <CardTitle>{item.category}</CardTitle>
        <CardDescription>{item.metric}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 pt-4">
        <p className="font-sans text-2xl font-semibold tabular-nums tracking-tight text-white break-words">
          {item.figure}
        </p>
        <Separator />
        <p className="font-sans text-[11px] leading-relaxed text-neutral-500">{item.notes}</p>
      </CardContent>
    </Card>
  );
}

type CrimeMetricsSectionProps = {
  crimeRow: CountryWideRow | null;
  iso3?: string;
};

export function CrimeMetricsSection({ crimeRow, iso3 }: CrimeMetricsSectionProps) {
  if (!crimeRow) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-neutral-400">No crime data</CardTitle>
          <CardDescription>
            No crime statistics columns were found for this country in the merged CSV.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {iso3?.toUpperCase() === 'DEU'
          ? GERMANY_CRIME_2024_STATS.map((item) => <GermanyCrime2024StatCard key={item.id} item={item} />)
          : null}
        {CRIME_BOXES.map((cfg) => (
          <CrimeStatCard key={cfg.id} row={crimeRow} config={cfg} />
        ))}
      </div>
    </div>
  );
}

export function collectCrimeSourceUrls(row: CountryWideRow | null): { url: string; label: string }[] {
  if (!row) return [];
  const out: { url: string; label: string }[] = [];
  const seen = new Set<string>();
  for (const cfg of CRIME_BOXES) {
    const u = String(row[cfg.sourceUrlKey] ?? '').trim();
    if (!u || seen.has(u)) continue;
    seen.add(u);
    const label = String(row[cfg.sourceLabelKey] ?? '').trim();
    try {
      const host = new URL(u).hostname.replace(/^www\./, '');
      out.push({ url: u, label: label || host });
    } catch {
      out.push({ url: u, label: label || u.slice(0, 48) });
    }
  }
  return out;
}
