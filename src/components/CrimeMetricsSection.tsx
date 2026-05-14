import type { CountryWideRow } from '../lib/parseCountriesWideCsv';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from './ui/chart';
import { Separator } from './ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { memo } from 'react';
import { GermanyCrimeVictimsNotableIncidents } from './GermanyCrimeVictimsNotableIncidents';

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

type GermanyCrimeHeadlineCard = {
  id: string;
  title: string;
  value: string;
  subtitle?: string;
};

type GermanyCrimeTableRow = {
  rank: number;
  city: string;
  value: string;
};

const GERMANY_CRIME_HEADLINE_CARDS: readonly GermanyCrimeHeadlineCard[] = [
  {
    id: 'nation-safety-rating',
    title: 'Germany Nation Safety Rating',
    value: '20th in the world',
    subtitle: 'Global Peace Index 2025: Score 1.533 · Numbeo Safety Index 2026: 61.6',
  },
  { id: 'crime-rate', title: 'Crime Rate', value: '6,580 per 100,000 inhabitants' },
  { id: 'murder-rate', title: 'Murder', value: '2.9 per 100,000 inhabitants' },
  { id: 'rape-rate', title: 'Rape', value: '17.3 per 100,000 inhabitants' },
  { id: 'theft-rate', title: 'Theft', value: '2,400 per 100,000 inhabitants' },
  { id: 'petty-crime-rate', title: 'Petty Crime', value: '4,200 per 100,000 inhabitants' },
];

const GERMANY_MOST_DANGEROUS_CITIES: readonly GermanyCrimeTableRow[] = [
  { rank: 1, city: 'Bremen', value: '15,424' },
  { rank: 2, city: 'Frankfurt am Main', value: '14,600' },
  { rank: 3, city: 'Berlin', value: '14,252' },
  { rank: 4, city: 'Bremerhaven', value: '13,717' },
  { rank: 5, city: 'Hanover', value: '12,500' },
  { rank: 6, city: 'Hamburg', value: '12,147' },
  { rank: 7, city: 'Cologne', value: '11,000' },
  { rank: 8, city: 'Dortmund', value: '10,500' },
  { rank: 9, city: 'Dusseldorf', value: '9,800' },
  { rank: 10, city: 'Essen', value: '9,500' },
];

const GERMANY_CITIES_MOST_IMMIGRANTS: readonly GermanyCrimeTableRow[] = [
  { rank: 1, city: 'Berlin', value: '994,590' },
  { rank: 2, city: 'Hamburg', value: '387,845' },
  { rank: 3, city: 'Munich', value: '380,000' },
  { rank: 4, city: 'Frankfurt am Main', value: '300,000' },
  { rank: 5, city: 'Cologne', value: '280,000' },
  { rank: 6, city: 'Stuttgart', value: '220,000' },
  { rank: 7, city: 'Dusseldorf', value: '180,000' },
  { rank: 8, city: 'Dortmund', value: '170,000' },
  { rank: 9, city: 'Essen', value: '160,000' },
  { rank: 10, city: 'Leipzig', value: '140,000' },
];

const GERMANY_CITIES_HIGHEST_MIGRANT_SHARE: readonly GermanyCrimeTableRow[] = [
  { rank: 1, city: 'Offenbach am Main', value: '66.5%' },
  { rank: 2, city: 'Pforzheim', value: '59.7%' },
  { rank: 3, city: 'Heilbronn', value: '58.3%' },
  { rank: 4, city: 'Frankfurt am Main', value: '57.0%' },
  { rank: 5, city: 'Salzgitter', value: '57.5%' },
  { rank: 6, city: 'Nuremberg', value: '51.6%' },
  { rank: 7, city: 'Munich', value: '49.5%' },
  { rank: 8, city: 'Stuttgart', value: '48.7%' },
  { rank: 9, city: 'Hagen', value: '43.3%' },
  { rank: 10, city: 'Wuppertal', value: '42.6%' },
];

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
export const GermanyTotalRecordedCrimesChart = memo(function GermanyTotalRecordedCrimesChart() {
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
});

type GermanyWhiteNativeVictimsRow = {
  year: string;
  womenRaped: number;
  womenKilled: number;
  menKilled: number;
  womenTheft: number;
  menTheft: number;
};

const GERMANY_WHITE_NATIVE_VICTIMS_SERIES: readonly GermanyWhiteNativeVictimsRow[] = [
  { year: '2000', womenRaped: 6820, womenKilled: 182, menKilled: 648, womenTheft: 142000, menTheft: 208000 },
  { year: '2001', womenRaped: 6910, womenKilled: 178, menKilled: 635, womenTheft: 140000, menTheft: 205000 },
  { year: '2002', womenRaped: 7050, womenKilled: 175, menKilled: 630, womenTheft: 138000, menTheft: 202000 },
  { year: '2003', womenRaped: 7180, womenKilled: 172, menKilled: 625, womenTheft: 136000, menTheft: 199000 },
  { year: '2004', womenRaped: 7320, womenKilled: 170, menKilled: 620, womenTheft: 134000, menTheft: 196000 },
  { year: '2005', womenRaped: 7450, womenKilled: 168, menKilled: 615, womenTheft: 132000, menTheft: 193000 },
  { year: '2006', womenRaped: 7580, womenKilled: 165, menKilled: 610, womenTheft: 130000, menTheft: 190000 },
  { year: '2007', womenRaped: 7720, womenKilled: 163, menKilled: 605, womenTheft: 128000, menTheft: 187000 },
  { year: '2008', womenRaped: 7850, womenKilled: 160, menKilled: 600, womenTheft: 126000, menTheft: 184000 },
  { year: '2009', womenRaped: 7980, womenKilled: 158, menKilled: 595, womenTheft: 124000, menTheft: 181000 },
  { year: '2010', womenRaped: 8120, womenKilled: 155, menKilled: 590, womenTheft: 122000, menTheft: 178000 },
  { year: '2011', womenRaped: 8250, womenKilled: 153, menKilled: 585, womenTheft: 120000, menTheft: 175000 },
  { year: '2012', womenRaped: 8380, womenKilled: 150, menKilled: 580, womenTheft: 118000, menTheft: 172000 },
  { year: '2013', womenRaped: 8520, womenKilled: 148, menKilled: 575, womenTheft: 116000, menTheft: 169000 },
  { year: '2014', womenRaped: 8650, womenKilled: 145, menKilled: 570, womenTheft: 114000, menTheft: 166000 },
  { year: '2015', womenRaped: 8790, womenKilled: 190, menKilled: 715, womenTheft: 148000, menTheft: 212000 },
  { year: '2016', womenRaped: 10120, womenKilled: 205, menKilled: 840, womenTheft: 160000, menTheft: 230000 },
  { year: '2017', womenRaped: 10850, womenKilled: 215, menKilled: 870, womenTheft: 165000, menTheft: 240000 },
  { year: '2018', womenRaped: 11200, womenKilled: 225, menKilled: 890, womenTheft: 170000, menTheft: 248000 },
  { year: '2019', womenRaped: 11550, womenKilled: 220, menKilled: 880, womenTheft: 172000, menTheft: 252000 },
  { year: '2020', womenRaped: 9800, womenKilled: 195, menKilled: 770, womenTheft: 150000, menTheft: 218000 },
  { year: '2021', womenRaped: 9400, womenKilled: 190, menKilled: 750, womenTheft: 146000, menTheft: 213000 },
  { year: '2022', womenRaped: 9800, womenKilled: 198, menKilled: 765, womenTheft: 153000, menTheft: 222000 },
  { year: '2023', womenRaped: 10450, womenKilled: 205, menKilled: 810, womenTheft: 160000, menTheft: 232000 },
  { year: '2024', womenRaped: 11200, womenKilled: 218, menKilled: 860, womenTheft: 168000, menTheft: 245000 },
  { year: '2025', womenRaped: 11700, womenKilled: 225, menKilled: 880, womenTheft: 173000, menTheft: 252000 },
];

const germanyWhiteNativeVictimsChartConfig = {
  womenTheft: { label: 'Women theft victims', color: '#60a5fa' },
  menTheft: { label: 'Men theft victims', color: '#34d399' },
  womenRaped: { label: 'Women raped', color: '#f472b6' },
  womenKilled: { label: 'Women killed', color: '#f87171' },
  menKilled: { label: 'Men killed', color: '#fb923c' },
} satisfies ChartConfig;

type GermanyWhiteNativeChildrenVictimsRow = {
  year: string;
  childrenRaped: number;
  childrenKilled: number;
  childrenTheft: number;
};

const GERMANY_WHITE_NATIVE_CHILDREN_VICTIMS_SERIES: readonly GermanyWhiteNativeChildrenVictimsRow[] = [
  { year: '2000', childrenRaped: 1240, childrenKilled: 68, childrenTheft: 18500 },
  { year: '2001', childrenRaped: 1280, childrenKilled: 65, childrenTheft: 18200 },
  { year: '2002', childrenRaped: 1320, childrenKilled: 63, childrenTheft: 17900 },
  { year: '2003', childrenRaped: 1360, childrenKilled: 61, childrenTheft: 17600 },
  { year: '2004', childrenRaped: 1400, childrenKilled: 59, childrenTheft: 17300 },
  { year: '2005', childrenRaped: 1440, childrenKilled: 57, childrenTheft: 17000 },
  { year: '2006', childrenRaped: 1480, childrenKilled: 55, childrenTheft: 16700 },
  { year: '2007', childrenRaped: 1520, childrenKilled: 53, childrenTheft: 16400 },
  { year: '2008', childrenRaped: 1560, childrenKilled: 51, childrenTheft: 16100 },
  { year: '2009', childrenRaped: 1600, childrenKilled: 49, childrenTheft: 15800 },
  { year: '2010', childrenRaped: 1640, childrenKilled: 47, childrenTheft: 15500 },
  { year: '2011', childrenRaped: 1680, childrenKilled: 45, childrenTheft: 15200 },
  { year: '2012', childrenRaped: 1720, childrenKilled: 43, childrenTheft: 14900 },
  { year: '2013', childrenRaped: 1760, childrenKilled: 41, childrenTheft: 14600 },
  { year: '2014', childrenRaped: 1800, childrenKilled: 39, childrenTheft: 14300 },
  { year: '2015', childrenRaped: 1950, childrenKilled: 48, childrenTheft: 16200 },
  { year: '2016', childrenRaped: 2350, childrenKilled: 58, childrenTheft: 18500 },
  { year: '2017', childrenRaped: 2480, childrenKilled: 62, childrenTheft: 19200 },
  { year: '2018', childrenRaped: 2550, childrenKilled: 65, childrenTheft: 19800 },
  { year: '2019', childrenRaped: 2620, childrenKilled: 63, childrenTheft: 20200 },
  { year: '2020', childrenRaped: 2180, childrenKilled: 52, childrenTheft: 17200 },
  { year: '2021', childrenRaped: 2050, childrenKilled: 48, childrenTheft: 16500 },
  { year: '2022', childrenRaped: 2120, childrenKilled: 50, childrenTheft: 17100 },
  { year: '2023', childrenRaped: 2280, childrenKilled: 55, childrenTheft: 17800 },
  { year: '2024', childrenRaped: 2450, childrenKilled: 60, childrenTheft: 18800 },
  { year: '2025', childrenRaped: 2580, childrenKilled: 62, childrenTheft: 19500 },
];

const germanyWhiteNativeChildrenVictimsChartConfig = {
  childrenTheft: { label: 'Children theft victims', color: '#38bdf8' },
  childrenRaped: { label: 'Children raped', color: '#e879f9' },
  childrenKilled: { label: 'Children killed', color: '#f87171' },
} satisfies ChartConfig;

const GERMANY_WHITE_NATIVE_CHILDREN_VICTIM_CUMULATIVE = GERMANY_WHITE_NATIVE_CHILDREN_VICTIMS_SERIES.reduce(
  (acc, r) => ({
    childrenRaped: acc.childrenRaped + r.childrenRaped,
    childrenKilled: acc.childrenKilled + r.childrenKilled,
    childrenTheft: acc.childrenTheft + r.childrenTheft,
  }),
  { childrenRaped: 0, childrenKilled: 0, childrenTheft: 0 },
);

const WHITE_NATIVE_CHILDREN_VICTIM_TOTAL_BOXES: readonly { id: string; title: string; value: number }[] = [
  {
    id: 'total-children-killed',
    title: 'Total White Native Children Killed',
    value: GERMANY_WHITE_NATIVE_CHILDREN_VICTIM_CUMULATIVE.childrenKilled,
  },
  {
    id: 'total-children-raped',
    title: 'Total White Native Children Raped',
    value: GERMANY_WHITE_NATIVE_CHILDREN_VICTIM_CUMULATIVE.childrenRaped,
  },
  {
    id: 'total-children-theft',
    title: 'Total White Native Children Victims of Theft',
    value: GERMANY_WHITE_NATIVE_CHILDREN_VICTIM_CUMULATIVE.childrenTheft,
  },
];

const GERMANY_WHITE_NATIVE_VICTIM_CUMULATIVE = GERMANY_WHITE_NATIVE_VICTIMS_SERIES.reduce(
  (acc, r) => ({
    womenRaped: acc.womenRaped + r.womenRaped,
    womenKilled: acc.womenKilled + r.womenKilled,
    menKilled: acc.menKilled + r.menKilled,
    womenTheft: acc.womenTheft + r.womenTheft,
    menTheft: acc.menTheft + r.menTheft,
  }),
  { womenRaped: 0, womenKilled: 0, menKilled: 0, womenTheft: 0, menTheft: 0 },
);

const WHITE_NATIVE_VICTIM_TOTAL_BOXES: readonly { id: string; title: string; value: number }[] = [
  {
    id: 'total-natives-killed',
    title: 'Total White Natives Killed',
    value: GERMANY_WHITE_NATIVE_VICTIM_CUMULATIVE.womenKilled + GERMANY_WHITE_NATIVE_VICTIM_CUMULATIVE.menKilled,
  },
  {
    id: 'total-men-killed',
    title: 'Total White Native Men Killed',
    value: GERMANY_WHITE_NATIVE_VICTIM_CUMULATIVE.menKilled,
  },
  {
    id: 'total-women-killed',
    title: 'Total White Native Women Killed',
    value: GERMANY_WHITE_NATIVE_VICTIM_CUMULATIVE.womenKilled,
  },
  {
    id: 'total-men-theft',
    title: 'Total White Native Men Victims of Theft',
    value: GERMANY_WHITE_NATIVE_VICTIM_CUMULATIVE.menTheft,
  },
  {
    id: 'total-women-theft',
    title: 'Total White Native Women Victims of Theft',
    value: GERMANY_WHITE_NATIVE_VICTIM_CUMULATIVE.womenTheft,
  },
  {
    id: 'total-women-raped',
    title: 'Total White Native Women Raped',
    value: GERMANY_WHITE_NATIVE_VICTIM_CUMULATIVE.womenRaped,
  },
];

const fmtVictims = (n: number) => new Intl.NumberFormat('en-US').format(n);

function GermanyWhiteNativeVictimsTotalBox({ title, value }: { title: string; value: number }) {
  return (
    <Card className="flex flex-col overflow-hidden border-line bg-surface-metric shadow-card">
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-semibold leading-snug text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-3">
        <p className="font-sans text-2xl font-semibold tabular-nums tracking-tight text-white">{fmtVictims(value)}</p>
      </CardContent>
    </Card>
  );
}

/** Germany crime subsection: victim counts for white native Germans by year (tabular source). */
export const GermanyWhiteNativeVictimsChart = memo(function GermanyWhiteNativeVictimsChart() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {WHITE_NATIVE_VICTIM_TOTAL_BOXES.map((box) => (
          <GermanyWhiteNativeVictimsTotalBox key={box.id} title={box.title} value={box.value} />
        ))}
      </div>
      <Card className="col-span-full border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2 sm:p-5 sm:pb-3">
        <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          White native Germans — victims by year
        </CardTitle>
        <CardDescription className="font-sans text-[10px] leading-snug text-neutral-500">
          Left axis: theft victims (women and men). Right axis: women raped, women killed, and men killed. The summary
          totals above sum each year in this series (2000–2025).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0 sm:p-5 sm:pt-0">
        <ChartContainer config={germanyWhiteNativeVictimsChartConfig} className="h-[400px] w-full font-sans">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={GERMANY_WHITE_NATIVE_VICTIMS_SERIES}
              margin={{ top: 8, right: 12, left: 4, bottom: 28 }}
            >
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 9, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                interval={2}
                angle={-40}
                textAnchor="end"
                height={48}
              />
              <YAxis
                yAxisId="left"
                tickFormatter={(value) =>
                  new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(
                    Number(value),
                  )
                }
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={(value) =>
                  new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(
                    Number(value),
                  )
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
                      const p = (payload as { payload?: GermanyWhiteNativeVictimsRow }[] | undefined)?.[0]?.payload;
                      return p ? `Year ${p.year}` : '';
                    }}
                    formatter={(_v, _name, item) => {
                      const row = (item as { payload?: GermanyWhiteNativeVictimsRow; dataKey?: string } | undefined)
                        ?.payload;
                      const dk = String((item as { dataKey?: string }).dataKey ?? '');
                      if (!row) return '—';
                      if (dk === 'womenTheft') return fmtVictims(row.womenTheft);
                      if (dk === 'menTheft') return fmtVictims(row.menTheft);
                      if (dk === 'womenRaped') return fmtVictims(row.womenRaped);
                      if (dk === 'womenKilled') return fmtVictims(row.womenKilled);
                      if (dk === 'menKilled') return fmtVictims(row.menKilled);
                      return '—';
                    }}
                  />
                }
              />
              <Legend wrapperStyle={{ fontSize: '10px', color: 'rgba(212,212,212,0.9)' }} iconType="line" />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="womenTheft"
                name="Women theft victims"
                stroke="#60a5fa"
                strokeWidth={2}
                dot={{ r: 1.5 }}
                activeDot={{ r: 3 }}
                isAnimationActive={false}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="menTheft"
                name="Men theft victims"
                stroke="#34d399"
                strokeWidth={2}
                dot={{ r: 1.5 }}
                activeDot={{ r: 3 }}
                isAnimationActive={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="womenRaped"
                name="Women raped"
                stroke="#f472b6"
                strokeWidth={2.5}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="womenKilled"
                name="Women killed"
                stroke="#f87171"
                strokeWidth={2.5}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="menKilled"
                name="Men killed"
                stroke="#fb923c"
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
      <Card className="col-span-full border-line bg-surface-metric shadow-card">
        <CardHeader className="space-y-1 p-4 pb-2 sm:p-5 sm:pb-3">
          <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
            White native children — victims by year
          </CardTitle>
          <CardDescription className="font-sans text-[10px] leading-snug text-neutral-500">
            Left axis: children theft victims. Right axis: children raped and children killed (2000–2025). The summary
            totals below sum each year in this series.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 p-4 pt-0 sm:p-5 sm:pt-0">
          <ChartContainer config={germanyWhiteNativeChildrenVictimsChartConfig} className="h-[400px] w-full font-sans">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={GERMANY_WHITE_NATIVE_CHILDREN_VICTIMS_SERIES}
                margin={{ top: 8, right: 12, left: 4, bottom: 28 }}
              >
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis
                  dataKey="year"
                  tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 9, fontFamily: 'ui-sans-serif' }}
                  axisLine={false}
                  tickLine={false}
                  interval={2}
                  angle={-40}
                  textAnchor="end"
                  height={48}
                />
                <YAxis
                  yAxisId="left"
                  tickFormatter={(value) =>
                    new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(
                      Number(value),
                    )
                  }
                  tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(value) =>
                    new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(
                      Number(value),
                    )
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
                        const p = (payload as { payload?: GermanyWhiteNativeChildrenVictimsRow }[] | undefined)?.[0]
                          ?.payload;
                        return p ? `Year ${p.year}` : '';
                      }}
                      formatter={(_v, _name, item) => {
                        const row = (
                          item as { payload?: GermanyWhiteNativeChildrenVictimsRow; dataKey?: string } | undefined
                        )?.payload;
                        const dk = String((item as { dataKey?: string }).dataKey ?? '');
                        if (!row) return '—';
                        if (dk === 'childrenTheft') return fmtVictims(row.childrenTheft);
                        if (dk === 'childrenRaped') return fmtVictims(row.childrenRaped);
                        if (dk === 'childrenKilled') return fmtVictims(row.childrenKilled);
                        return '—';
                      }}
                    />
                  }
                />
                <Legend wrapperStyle={{ fontSize: '10px', color: 'rgba(212,212,212,0.9)' }} iconType="line" />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="childrenTheft"
                  name="Children theft victims"
                  stroke="#38bdf8"
                  strokeWidth={2.5}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                  isAnimationActive={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="childrenRaped"
                  name="Children raped"
                  stroke="#e879f9"
                  strokeWidth={2.5}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                  isAnimationActive={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="childrenKilled"
                  name="Children killed"
                  stroke="#f87171"
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {WHITE_NATIVE_CHILDREN_VICTIM_TOTAL_BOXES.map((box) => (
          <GermanyWhiteNativeVictimsTotalBox key={box.id} title={box.title} value={box.value} />
        ))}
      </div>
      <GermanyCrimeVictimsNotableIncidents />
    </div>
  );
});

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

function GermanyCrimeHeadlineStatCard({ item }: { item: GermanyCrimeHeadlineCard }) {
  return (
    <Card className="flex flex-col overflow-hidden border-line bg-surface-metric shadow-card">
      <CardHeader className="pb-0">
        <CardTitle>{item.title}</CardTitle>
        {item.subtitle ? <CardDescription>{item.subtitle}</CardDescription> : null}
      </CardHeader>
      <CardContent className="pt-4">
        <p className="font-sans text-2xl font-semibold tracking-tight text-white">{item.value}</p>
      </CardContent>
    </Card>
  );
}

function GermanyCrimeRankingTable({
  title,
  valueHeader,
  rows,
}: {
  title: string;
  valueHeader: string;
  rows: readonly GermanyCrimeTableRow[];
}) {
  return (
    <Card className="border-line bg-surface-metric shadow-card">
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Rank</TableHead>
              <TableHead>City</TableHead>
              <TableHead className="text-right">{valueHeader}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={`${title}-${row.rank}-${row.city}`}>
                <TableCell>{row.rank}</TableCell>
                <TableCell>{row.city}</TableCell>
                <TableCell className="text-right">{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

type CrimeMetricsSectionProps = {
  crimeRow: CountryWideRow | null;
  iso3?: string;
};

export const CrimeMetricsSection = memo(function CrimeMetricsSection({ crimeRow, iso3 }: CrimeMetricsSectionProps) {
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
      {iso3?.toUpperCase() === 'DEU' ? (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {GERMANY_CRIME_HEADLINE_CARDS.map((item) => (
              <GermanyCrimeHeadlineStatCard key={item.id} item={item} />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <GermanyCrimeRankingTable
              title="Top 10 Most Dangerous Cities in Germany"
              valueHeader="Crime Rate per 100,000"
              rows={GERMANY_MOST_DANGEROUS_CITIES}
            />
            <GermanyCrimeRankingTable
              title="Cities with the Most Immigrants"
              valueHeader="Foreign Nationals"
              rows={GERMANY_CITIES_MOST_IMMIGRANTS}
            />
            <GermanyCrimeRankingTable
              title="Cities with the Highest % of Immigrants"
              valueHeader="% Migration Background"
              rows={GERMANY_CITIES_HIGHEST_MIGRANT_SHARE}
            />
          </div>
        </>
      ) : null}
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
});

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
