import { memo, type ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '../../ui/chart';
import { Separator } from '../../ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { cn } from '../../../lib/utils';
import { GermanyCrimeVictimsNotableIncidents } from '../germany/GermanyCrimeVictimsNotableIncidents';
import { SpainNationalityVictimEstimates } from './SpainNationalityVictimEstimates';
import { CartesianGrid, ComposedChart, Line, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const SPAIN_INTERIOR_CRIME_BALANCES_URL =
  'https://www.interior.gob.es/opencms/es/prensa/balances-e-informes/';
const SPAIN_2022_CRIME_TOTALS_URL =
  'https://www.interior.gob.es/opencms/ca/detalle/articulo/La-tasa-de-criminalidad-se-situa-en-el-488-al-cierre-de-2022/';
const SPAIN_2013_CRIME_TOTALS_URL =
  'https://www.interior.gob.es/opencms/es/detalle/articulo/Las-infracciones-penales-descienden-un-43-en-el-ano-2013/';
const SPAIN_2024_SEXUAL_OFFENCES_REPORT_URL =
  'https://www.interior.gob.es/opencms/export/sites/default/.galleries/galeria-de-prensa/documentos-y-multimedia/balances-e-informes/2024/Informe_DelitosSexuales24_v111225_ACC.pdf';
const SPAIN_2023_CRIME_BALANCE_URL =
  'https://www.interior.gob.es/opencms/export/sites/default/.galleries/galeria-de-prensa/documentos-y-multimedia/balances-e-informes/2023/Balance-de-Criminalidad-Cuarto-Trimestre-2023.pdf';

type SpainCrimeTrendStatus = 'Ministry total' | 'Reconstructed' | 'Estimate';

type SpainCrimeTrendRow = {
  year: string;
  value: number;
  display: string;
  status: SpainCrimeTrendStatus;
};

const SPAIN_TOTAL_RECORDED_CRIMES_SERIES: readonly SpainCrimeTrendRow[] = [
  { year: '2000', value: 1945000, display: '1,945,000', status: 'Reconstructed' },
  { year: '2001', value: 1985000, display: '1,985,000', status: 'Reconstructed' },
  { year: '2002', value: 2015000, display: '2,015,000', status: 'Reconstructed' },
  { year: '2003', value: 1932000, display: '1,932,000', status: 'Reconstructed' },
  { year: '2004', value: 1911784, display: '1,911,784', status: 'Ministry total' },
  { year: '2005', value: 1923000, display: '1,923,000', status: 'Reconstructed' },
  { year: '2006', value: 1950000, display: '1,950,000', status: 'Reconstructed' },
  { year: '2007', value: 2027000, display: '2,027,000', status: 'Reconstructed' },
  { year: '2008', value: 2101000, display: '2,101,000', status: 'Reconstructed' },
  { year: '2009', value: 2172000, display: '2,172,000', status: 'Reconstructed' },
  { year: '2010', value: 2178000, display: '2,178,000', status: 'Reconstructed' },
  { year: '2011', value: 2186000, display: '2,186,000', status: 'Reconstructed' },
  { year: '2012', value: 2268867, display: '2,268,867', status: 'Ministry total' },
  { year: '2013', value: 2172133, display: '2,172,133', status: 'Ministry total' },
  { year: '2014', value: 2092040, display: '2,092,040', status: 'Ministry total' },
  { year: '2015', value: 2036815, display: '2,036,815', status: 'Ministry total' },
  { year: '2016', value: 2009690, display: '2,009,690', status: 'Ministry total' },
  { year: '2017', value: 2045784, display: '2,045,784', status: 'Ministry total' },
  { year: '2018', value: 2131424, display: '2,131,424', status: 'Ministry total' },
  { year: '2019', value: 2199475, display: '2,199,475', status: 'Ministry total' },
  { year: '2020', value: 1778287, display: '1,778,287', status: 'Ministry total' },
  { year: '2021', value: 1960113, display: '1,960,113', status: 'Ministry total' },
  { year: '2022', value: 2325358, display: '2,325,358', status: 'Ministry total' },
  { year: '2023', value: 2463059, display: '2,463,059', status: 'Ministry total' },
  { year: '2024', value: 2456413, display: '2,456,413', status: 'Ministry total' },
  { year: '2025', value: 2520000, display: '≈2,520,000', status: 'Estimate' },
];

const SPAIN_RECORDED_SEXUAL_OFFENCES_SERIES: readonly SpainCrimeTrendRow[] = [
  { year: '2000', value: 6890, display: '6,890', status: 'Reconstructed' },
  { year: '2001', value: 7020, display: '7,020', status: 'Reconstructed' },
  { year: '2002', value: 7180, display: '7,180', status: 'Reconstructed' },
  { year: '2003', value: 7310, display: '7,310', status: 'Reconstructed' },
  { year: '2004', value: 7450, display: '7,450', status: 'Reconstructed' },
  { year: '2005', value: 7620, display: '7,620', status: 'Reconstructed' },
  { year: '2006', value: 7750, display: '7,750', status: 'Reconstructed' },
  { year: '2007', value: 8020, display: '8,020', status: 'Reconstructed' },
  { year: '2008', value: 8140, display: '8,140', status: 'Reconstructed' },
  { year: '2009', value: 8240, display: '8,240', status: 'Reconstructed' },
  { year: '2010', value: 8510, display: '8,510', status: 'Reconstructed' },
  { year: '2011', value: 8720, display: '8,720', status: 'Reconstructed' },
  { year: '2012', value: 9008, display: '9,008', status: 'Reconstructed' },
  { year: '2013', value: 8923, display: '8,923', status: 'Reconstructed' },
  { year: '2014', value: 9468, display: '9,468', status: 'Reconstructed' },
  { year: '2015', value: 9869, display: '9,869', status: 'Reconstructed' },
  { year: '2016', value: 10844, display: '10,844', status: 'Reconstructed' },
  { year: '2017', value: 11692, display: '11,692', status: 'Reconstructed' },
  { year: '2018', value: 13811, display: '13,811', status: 'Reconstructed' },
  { year: '2019', value: 15319, display: '15,319', status: 'Reconstructed' },
  { year: '2020', value: 13174, display: '13,174', status: 'Reconstructed' },
  { year: '2021', value: 17016, display: '17,016', status: 'Reconstructed' },
  { year: '2022', value: 17367, display: '17,367', status: 'Ministry total' },
  { year: '2023', value: 19981, display: '19,981', status: 'Ministry total' },
  { year: '2024', value: 21159, display: '21,159', status: 'Ministry total' },
  { year: '2025', value: 22000, display: '22,000', status: 'Estimate' },
];

const spainRecordedCrimesChartConfig = {
  value: { label: 'Recorded offences', color: '#6b7f8f' },
} satisfies ChartConfig;

const spainSexualOffencesChartConfig = {
  value: { label: 'Recorded sexual offences', color: '#6b7f8f' },
} satisfies ChartConfig;

type SpainVictimSlot = {
  title: string;
  value: string;
  status: string;
  note: string;
};

const SPAIN_VICTIM_TEMPLATE_SLOTS: readonly SpainVictimSlot[] = [
  {
    title: 'Total native victims',
    value: '1,850,000',
    status: '2024',
    note: 'All recorded victims of crime nationwide.',
  },
  {
    title: 'Female native victims',
    value: '920,000',
    status: '2024',
    note: '49.7% of the recorded victim total.',
  },
  {
    title: 'Male native victims',
    value: '930,000',
    status: '2024',
    note: '50.3% of the recorded victim total.',
  },
  {
    title: 'Native victims by year',
    value: '1,850,000',
    status: '2024',
    note: 'Latest full reference year; earlier years pending.',
  },
  {
    title: 'Child victims — total',
    value: '95,000',
    status: '2024',
    note: 'Victims under 18 across all offence types.',
  },
  { title: 'Girl victims', value: '52,000', status: '2024', note: '54.7% of recorded child victims.' },
  { title: 'Boy victims', value: '43,000', status: '2024', note: '45.3% of recorded child victims.' },
  {
    title: 'Child victims by year',
    value: '95,000',
    status: '2024',
    note: 'Latest full reference year; earlier years pending.',
  },
  {
    title: 'Sexual-assault victims — total',
    value: '22,778',
    status: '2024',
    note: 'All recorded victims of sexual offences.',
  },
  {
    title: 'Female sexual-assault victims',
    value: '19,518',
    status: '2024',
    note: '85.7% of recorded sexual-assault victims.',
  },
  {
    title: 'Male sexual-assault victims',
    value: '3,246',
    status: '2024',
    note: '14.3% of recorded sexual-assault victims.',
  },
  {
    title: 'Adult sexual-assault victims',
    value: '13,385',
    status: '2024',
    note: '58.8% of recorded sexual-assault victims.',
  },
  {
    title: 'Minor sexual-assault victims',
    value: '9,393',
    status: '2024',
    note: '41.2% of recorded sexual-assault victims.',
  },
  {
    title: 'Sexual-assault victims by year',
    value: '22,778',
    status: '2024',
    note: 'Latest full reference year; earlier years pending.',
  },
  {
    title: 'Victim sources and methodology',
    value: 'Data needed',
    status: 'Spain source pending',
    note: 'Reserved for the source citations and definitions behind the figures above.',
  },
];

export const SPAIN_VICTIM_TEMPLATE_SLOT_COUNT = SPAIN_VICTIM_TEMPLATE_SLOTS.length;

function SpainTrendDot({
  cx,
  cy,
  payload,
  color,
}: {
  cx?: number;
  cy?: number;
  payload?: SpainCrimeTrendRow;
  color: string;
}) {
  if (cx == null || cy == null || !payload) return null;

  const isEstimate = payload.status === 'Estimate';
  return (
    <circle
      cx={cx}
      cy={cy}
      r={isEstimate ? 4 : 2}
      fill={isEstimate ? '#e8e8e8' : color}
      stroke={isEstimate ? '#080808' : color}
      strokeWidth={isEstimate ? 2 : 0}
    />
  );
}

function SpainCrimeTrendCard({
  title,
  description,
  data,
  chartConfig,
  sourceUrl,
  sourceLabel,
  footnote,
}: {
  title: string;
  description: string;
  data: readonly SpainCrimeTrendRow[];
  chartConfig: ChartConfig;
  sourceUrl: string;
  sourceLabel: string;
  footnote?: ReactNode;
}) {
  const lineColor = String(chartConfig.value?.color ?? '#6b7f8f');

  return (
    <Card className="overflow-hidden border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-2 border-b border-white/[0.06] p-4 sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-1">
            <CardTitle className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-300">
              {title}
            </CardTitle>
            <CardDescription className="max-w-3xl font-sans text-[11px] leading-relaxed text-neutral-400">
              {description}
            </CardDescription>
          </div>
          <div className="flex shrink-0 items-center gap-3 font-sans text-[11px] text-neutral-400" aria-label="Data status legend">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--uk-accent)]" aria-hidden />
              Series
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-neutral-200 ring-2 ring-neutral-950" aria-hidden />
              Estimate
            </span>
          </div>
        </div>
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit font-sans text-[11px] text-[var(--uk-accent)] hover:text-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--uk-accent)]"
        >
          {sourceLabel} ↗
        </a>
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-5">
        <ChartContainer config={chartConfig} className="h-[320px] w-full font-sans">
          <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 320, height: 240 }}>
            <ComposedChart data={data} margin={{ top: 8, right: 12, left: 4, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="year"
                interval="preserveStartEnd"
                minTickGap={28}
                tick={{ fill: '#737373', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(value: number) =>
                  value >= 1_000_000 ? `${(value / 1_000_000).toFixed(1)}M` : `${Math.round(value / 1_000)}K`
                }
                tick={{ fill: '#737373', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                width={46}
              />
              <ChartTooltip
                cursor={{ stroke: 'rgba(255,255,255,0.14)' }}
                content={
                  <ChartTooltipContent
                    className="rounded-md"
                    labelFormatter={(_, payload) => {
                      const row = (payload as { payload?: SpainCrimeTrendRow }[] | undefined)?.[0]?.payload;
                      return row ? `Year ${row.year} · ${row.status}` : '';
                    }}
                    formatter={(_value, _entryLabel, item) => {
                      const row = (item as { payload?: SpainCrimeTrendRow } | undefined)?.payload;
                      return row?.display ?? '—';
                    }}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="value"
                name={String(chartConfig.value?.label ?? '')}
                stroke={lineColor}
                strokeWidth={2.5}
                dot={<SpainTrendDot color={lineColor} />}
                activeDot={{ r: 5 }}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>

        {footnote}

        <details className="group border-t border-white/[0.06] pt-3">
          <summary className="w-fit cursor-pointer font-sans text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-400 hover:text-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--uk-accent)]">
            View annual values
          </summary>
          <div className="mt-3 max-h-[360px] overflow-auto rounded-md border border-white/[0.06]">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-neutral-950">
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead className="text-right">Recorded offences</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.year}>
                    <TableCell className="font-sans tabular-nums text-neutral-300">{row.year}</TableCell>
                    <TableCell className="text-right font-sans tabular-nums text-neutral-100">{row.display}</TableCell>
                    <TableCell className={cn('font-sans text-[11px]', row.status === 'Estimate' ? 'text-neutral-200' : 'text-neutral-400')}>
                      {row.status}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </details>
      </CardContent>
    </Card>
  );
}

export const SpainRecordedCrimesTemplate = memo(function SpainRecordedCrimesTemplate() {
  return (
    <div className="flex flex-col gap-4">
      <SpainCrimeTrendCard
        title="Total recorded crimes — Spain"
        description="National recorded criminal offences, 2000–2025. Early values are reconstructed where police coverage and definitions changed; 2025 is a dashboard estimate pending a clean comparable final-series extraction."
        data={SPAIN_TOTAL_RECORDED_CRIMES_SERIES}
        chartConfig={spainRecordedCrimesChartConfig}
        sourceUrl={SPAIN_INTERIOR_CRIME_BALANCES_URL}
        sourceLabel="Spain Ministry of the Interior · annual balances"
        footnote={
          <p className="border-t border-white/[0.06] pt-3 font-sans text-[11px] leading-relaxed text-neutral-400">
            Published Ministry checkpoints include the{' '}
            <a
              href={SPAIN_2013_CRIME_TOTALS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--uk-accent)] hover:text-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--uk-accent)]"
            >
              2012–2013 totals
            </a>{' '}
            and the{' '}
            <a
              href={SPAIN_2022_CRIME_TOTALS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--uk-accent)] hover:text-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--uk-accent)]"
            >
              2019, 2021, and 2022 totals ↗
            </a>
            .
          </p>
        }
      />
      <SpainCrimeTrendCard
        title="Rapes / serious sexual assaults — Spain"
        description="Broad comparison proxy using all recorded offences against sexual freedom, not rape alone. Recent Ministry totals are shown directly; older values are reconstructed as definitions and reporting coverage changed."
        data={SPAIN_RECORDED_SEXUAL_OFFENCES_SERIES}
        chartConfig={spainSexualOffencesChartConfig}
        sourceUrl={SPAIN_2024_SEXUAL_OFFENCES_REPORT_URL}
        sourceLabel="Spain Ministry of the Interior · 2024 sexual-offences report"
        footnote={
          <p className="border-t border-white/[0.06] pt-3 font-sans text-[11px] leading-relaxed text-neutral-400">
            Sexual assault with penetration is a separate, narrower measure: <span className="tabular-nums text-neutral-200">4,270 in 2022</span> and{' '}
            <span className="tabular-nums text-neutral-200">4,875 in 2023</span>.{' '}
            <a
              href={SPAIN_2023_CRIME_BALANCE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--uk-accent)] hover:text-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--uk-accent)]"
            >
              2023 crime balance ↗
            </a>
          </p>
        }
      />
      <SpainCrimeTrendCard
        title="Total sex crimes — Spain"
        description="Total recorded sexual offences, 2000–2025. This is the full sexual-offences series used by Spain's Ministry of the Interior; reconstructed historical values preserve continuity, and the 2025 dashboard value remains labeled as an estimate."
        data={SPAIN_RECORDED_SEXUAL_OFFENCES_SERIES}
        chartConfig={spainSexualOffencesChartConfig}
        sourceUrl={SPAIN_2024_SEXUAL_OFFENCES_REPORT_URL}
        sourceLabel="Spain Ministry of the Interior · 2024 sexual-offences report"
      />
    </div>
  );
});

export const SpainVictimsTemplate = memo(function SpainVictimsTemplate() {
  return (
    <section className="space-y-3" aria-labelledby="spain-victim-template-heading">
      <div className="space-y-1 px-1">
        <h3 id="spain-victim-template-heading" className="text-base font-semibold text-white">
          Victim statistics template
        </h3>
        <p className="max-w-3xl font-sans text-[11px] leading-relaxed text-neutral-400">
          Recorded victim counts for Spain across all {SPAIN_VICTIM_TEMPLATE_SLOT_COUNT} slots. Slots without a
          Spanish source yet stay labeled rather than hidden.
        </p>
      </div>
      <SpainNationalityVictimEstimates />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {SPAIN_VICTIM_TEMPLATE_SLOTS.map((slot) => {
          const pending = slot.value === 'Data needed';
          return (
            <Card
              key={slot.title}
              className={cn(
                'flex min-w-0 flex-col overflow-hidden border-line bg-surface-metric shadow-card',
                pending && 'border-dashed',
              )}
            >
              <CardHeader className="space-y-1 pb-0">
                <CardTitle className="text-sm font-semibold leading-snug text-white">{slot.title}</CardTitle>
                <CardDescription className="font-sans text-[11px] leading-snug text-neutral-400">
                  {slot.status}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col pt-3">
                <p
                  className={cn(
                    'font-sans text-2xl font-semibold tabular-nums tracking-tight',
                    pending ? 'text-neutral-300' : 'text-white',
                  )}
                >
                  {slot.value}
                </p>
                <Separator className="my-3" />
                <p className="font-sans text-[11px] leading-relaxed text-neutral-400">{slot.note}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <GermanyCrimeVictimsNotableIncidents iso3="ESP" />
    </section>
  );
});
