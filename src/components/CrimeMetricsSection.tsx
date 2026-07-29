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

import { CRIME_BOXES, type CrimeBoxConfig } from '../lib/crimeBoxes';

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

/**
 * France crime tables — imported from the Germany "Statistics" tables as a starting point so the
 * numbers/cities can be edited for France later. Only the country-name labels were switched to
 * France; every figure, city, and note is still the Germany placeholder value pending replacement.
 * (Graph/chart series for France are defined separately below and are NOT part of this import.)
 */
const FRANCE_CRIME_HEADLINE_CARDS: readonly GermanyCrimeHeadlineCard[] = [
  {
    id: 'nation-safety-rating',
    title: 'France Nation Safety Rating',
    value: '99th in the world',
    subtitle: 'Global Peace Index 2026: 99th in the world · Numbeo Safety Index 2026: 44.2 (128th of 163)',
  },
  { id: 'crime-rate', title: 'Crime Rate', value: '55.8' },
  { id: 'murder-rate', title: 'Murder', value: '1.3 per 100,000 inhabitants' },
  {
    id: 'rape-rate',
    title: 'Rape',
    value: '57.5 per 100,000 inhabitants',
  },
  {
    id: 'theft-rate',
    title: 'Theft',
    value: '990 per 100,000 inhabitants',
  },
  {
    id: 'petty-crime-rate',
    title: 'Petty Crime',
    value: '2,400 per 100,000 inhabitants',
  },
];

const FRANCE_MOST_DANGEROUS_CITIES: readonly GermanyCrimeTableRow[] = [
  { rank: 1, city: 'Marseille', value: '9,700' },
  { rank: 2, city: 'Saint-Denis', value: '9,200' },
  { rank: 3, city: 'Paris', value: '8,900' },
  { rank: 4, city: 'Lille', value: '8,500' },
  { rank: 5, city: 'Lyon', value: '8,200' },
  { rank: 6, city: 'Montpellier', value: '8,100' },
  { rank: 7, city: 'Grenoble', value: '7,900' },
  { rank: 8, city: 'Nice', value: '7,700' },
  { rank: 9, city: 'Nantes', value: '7,600' },
  { rank: 10, city: 'Toulouse', value: '7,400' },
];

const FRANCE_CITIES_MOST_IMMIGRANTS: readonly GermanyCrimeTableRow[] = [
  { rank: 1, city: 'Paris', value: '490,000' },
  { rank: 2, city: 'Marseille', value: '170,000' },
  { rank: 3, city: 'Lyon', value: '150,000' },
  { rank: 4, city: 'Toulouse', value: '90,000' },
  { rank: 5, city: 'Nice', value: '85,000' },
  { rank: 6, city: 'Lille', value: '80,000' },
  { rank: 7, city: 'Strasbourg', value: '75,000' },
  { rank: 8, city: 'Bordeaux', value: '65,000' },
  { rank: 9, city: 'Montpellier', value: '60,000' },
  { rank: 10, city: 'Nantes', value: '55,000' },
];

const FRANCE_CITIES_HIGHEST_MIGRANT_SHARE: readonly GermanyCrimeTableRow[] = [
  { rank: 1, city: 'Saint-Denis', value: '43.8%' },
  { rank: 2, city: 'Aubervilliers', value: '39.8%' },
  { rank: 3, city: 'La Courneuve', value: '38.5%' },
  { rank: 4, city: 'Clichy-sous-Bois', value: '37.9%' },
  { rank: 5, city: 'Bobigny', value: '36.9%' },
  { rank: 6, city: 'Montreuil', value: '35.4%' },
  { rank: 7, city: 'Paris', value: '22.5%' },
  { rank: 8, city: 'Argenteuil', value: '22.0%' },
  { rank: 9, city: 'Sarcelles', value: '21.5%' },
  { rank: 10, city: 'Marseille', value: '18.8%' },
];

const FRANCE_CRIME_2024_STATS: readonly GermanyCrimeStatCard[] = [
  {
    id: 'total-crime-suspects',
    category: 'Total Crime',
    figure: '3,820,000',
    metric: 'recorded crimes',
    notes: '',
  },
  { id: 'theft', category: 'Theft', figure: '1,003,800', metric: 'offences', notes: 'All recorded theft offences' },
  {
    id: 'murder',
    category: 'Murder',
    figure: '976',
    metric: 'intentional homicides',
    notes: '',
  },
  {
    id: 'drug-offences',
    category: 'Drug Offences',
    figure: '316,000',
    metric: 'offences',
    notes: 'Drug use and trafficking offences recorded',
  },
  {
    id: 'violent-crimes',
    category: 'Violent Crimes',
    figure: '430,000',
    metric: 'offences',
    notes: 'Violent offences against persons',
  },
  {
    id: 'property-crimes',
    category: 'Property Crimes',
    figure: '1,880,000',
    metric: 'offences',
    notes: '',
  },
  {
    id: 'burglary',
    category: 'Burglary',
    figure: '217,600',
    metric: 'residential burglary offences',
    notes: '',
  },
  {
    id: 'fraud',
    category: 'Fraud',
    figure: '411,700',
    metric: 'offences',
    notes: '',
  },
  {
    id: 'court-dismissals',
    category: 'Court Dismissals',
    figure: '53,802',
    metric: 'alternatives to prosecution',
    notes: 'Closest published national equivalent',
  },
  {
    id: 'incarceration-foreign',
    category: 'Foreign Nationals in Prison',
    figure: '24.2%',
    metric: 'of prisoners',
    notes: '',
  },
  {
    id: 'juvenile-violent',
    category: 'Juvenile Violent Crime',
    figure: '≈29,000',
    metric: 'juvenile suspects',
    notes: 'Suspects for violent offences',
  },
  {
    id: 'kidnapping-minors',
    category: 'Kidnapping / Abduction of Minors',
    figure: '3,600',
    metric: 'recorded cases',
    notes: 'Includes attempts',
  },
  {
    id: 'sex-offences-minors',
    category: 'Sexual Offences Against Minors',
    figure: '≈38,000',
    metric: 'recorded offences',
    notes: '',
  },
  {
    id: 'clearance-rate-overall',
    category: 'Overall Clearance Rate',
    figure: '≈16% overall',
    metric: 'clearance rate',
    notes: 'Varies greatly by offence',
  },
  {
    id: 'clearance-rate-homicide',
    category: 'Clearance Rate – Homicide',
    figure: '65%',
    metric: 'after one year',
    notes: '',
  },
  {
    id: 'sex-crime-total',
    category: 'Total Sexual Offences',
    figure: '114,600',
    metric: 'offences',
    notes: '',
  },
  {
    id: 'rape-serious',
    category: 'Rape',
    figure: '48,600',
    metric: 'offences',
    notes: '',
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
  totalCrimes?: number;
  totalCrimesDisplay?: string;
  rapesSerious?: number;
  rapesSeriousDisplay?: string;
  totalSexCrimes?: number;
  totalSexCrimesDisplay?: string;
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

const germanyRecordedTotalCrimesChartConfig = {
  totalCrimes: { label: 'Total recorded crimes', color: '#60a5fa' },
} satisfies ChartConfig;

const germanyRecordedRapesSeriousChartConfig = {
  rapesSerious: { label: 'Rapes & serious sexual assaults', color: '#f472b6' },
} satisfies ChartConfig;

const germanyRecordedTotalSexCrimesChartConfig = {
  totalSexCrimes: { label: 'Total sex crimes', color: '#a78bfa' },
} satisfies ChartConfig;

type GermanyRecordedSingleMetricKey = 'totalCrimes' | 'rapesSerious' | 'totalSexCrimes';

function GermanyRecordedSingleMetricChart({
  title,
  description,
  dataKey,
  chartConfig,
  yAxisMode,
  data = GERMANY_RECORDED_CRIMES_SEXUAL_VIOLENCE_SERIES,
}: {
  title: string;
  description: string;
  dataKey: GermanyRecordedSingleMetricKey;
  chartConfig: ChartConfig;
  yAxisMode: 'millions' | 'compact';
  data?: readonly GermanyRecordedCrimesChartRow[];
}) {
  const yTickFormatter =
    yAxisMode === 'millions'
      ? (value: number) => `${(Number(value) / 1_000_000).toFixed(1)}M`
      : (value: number) =>
          new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(Number(value));

  return (
    <Card className="col-span-full border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2 sm:p-5 sm:pb-3">
        <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          {title}
        </CardTitle>
        <CardDescription className="font-sans text-[10px] leading-snug text-neutral-500">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0 sm:p-5 sm:pt-0">
        <ChartContainer config={chartConfig} className="h-[320px] w-full font-sans">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
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
                tickFormatter={yTickFormatter}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                width={yAxisMode === 'millions' ? 44 : 40}
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
              <Legend wrapperStyle={{ fontSize: '11px', color: 'rgba(212,212,212,0.9)' }} iconType="line" />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={String(chartConfig[dataKey]?.color ?? '#fff')}
                strokeWidth={2.5}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
                name={String(chartConfig[dataKey]?.label ?? '')}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

/** Germany-only: national totals and sexual-offence series as separate charts (approximate values as entered). */
export const GermanyTotalRecordedCrimesChart = memo(function GermanyTotalRecordedCrimesChart() {
  return (
    <div className="flex flex-col gap-4">
      <GermanyRecordedSingleMetricChart
        title="Total recorded crimes (Germany)"
        description="All recorded criminal offences per year. Axis in millions for readability."
        dataKey="totalCrimes"
        chartConfig={germanyRecordedTotalCrimesChartConfig}
        yAxisMode="millions"
      />
      <GermanyRecordedSingleMetricChart
        title="Rapes & serious sexual assaults (Germany)"
        description="Rape, sexual coercion & serious sexual assault (incl. resulting in death) — numeric part of each label drives the line."
        dataKey="rapesSerious"
        chartConfig={germanyRecordedRapesSeriousChartConfig}
        yAxisMode="compact"
      />
      <GermanyRecordedSingleMetricChart
        title="Total sex crimes (Germany)"
        description="Total sexual offences against sexual self-determination (approximate annual totals)."
        dataKey="totalSexCrimes"
        chartConfig={germanyRecordedTotalSexCrimesChartConfig}
        yAxisMode="compact"
      />
    </div>
  );
});

const ITALY_TOTAL_RECORDED_CRIMES_SERIES: readonly GermanyRecordedCrimesChartRow[] = [
  { year: '2006', totalCrimes: 2771490, totalCrimesDisplay: '2,771,490' },
  { year: '2007', totalCrimes: 2933146, totalCrimesDisplay: '2,933,146' },
  { year: '2008', totalCrimes: 2709888, totalCrimesDisplay: '2,709,888' },
  { year: '2009', totalCrimes: 2629831, totalCrimesDisplay: '2,629,831' },
  { year: '2010', totalCrimes: 2621019, totalCrimesDisplay: '2,621,019' },
  { year: '2011', totalCrimes: 2763012, totalCrimesDisplay: '2,763,012' },
  { year: '2012', totalCrimes: 2818834, totalCrimesDisplay: '2,818,834' },
  { year: '2013', totalCrimes: 2892155, totalCrimesDisplay: '2,892,155' },
  { year: '2014', totalCrimes: 2812936, totalCrimesDisplay: '2,812,936' },
  { year: '2015', totalCrimes: 2687249, totalCrimesDisplay: '2,687,249' },
  { year: '2016', totalCrimes: 2487389, totalCrimesDisplay: '2,487,389' },
  { year: '2017', totalCrimes: 2429795, totalCrimesDisplay: '2,429,795' },
  { year: '2018', totalCrimes: 2371806, totalCrimesDisplay: '2,371,806' },
  { year: '2019', totalCrimes: 2301912, totalCrimesDisplay: '2,301,912' },
  { year: '2020', totalCrimes: 1900624, totalCrimesDisplay: '1,900,624' },
  { year: '2021', totalCrimes: 2104114, totalCrimesDisplay: '2,104,114' },
  { year: '2022', totalCrimes: 2255777, totalCrimesDisplay: '2,255,777' },
  { year: '2023', totalCrimes: 2341574, totalCrimesDisplay: '2,341,574' },
  { year: '2024', totalCrimes: 2399347, totalCrimesDisplay: '2,399,347' },
];

const italyRecordedTotalCrimesChartConfig = {
  totalCrimes: { label: 'Total recorded crimes', color: '#60a5fa' },
} satisfies ChartConfig;

/** Italy-only: official national police-recorded offences reported to judicial authorities (ISTAT). */
export const ItalyTotalRecordedCrimesChart = memo(function ItalyTotalRecordedCrimesChart() {
  return (
    <GermanyRecordedSingleMetricChart
      title="Total recorded crimes (Italy)"
      description="Offences reported by police to judicial authorities (ISTAT / Ministry of the Interior SDI). Includes citizen reports and offences detected by police; recorded offences are not an estimate of all crime."
      dataKey="totalCrimes"
      chartConfig={italyRecordedTotalCrimesChartConfig}
      yAxisMode="millions"
      data={ITALY_TOTAL_RECORDED_CRIMES_SERIES}
    />
  );
});

const FRANCE_TOTAL_SEX_CRIMES_SERIES: readonly GermanyRecordedCrimesChartRow[] = [
  { year: '2000', totalSexCrimes: 26000, totalSexCrimesDisplay: '26,000' },
  { year: '2001', totalSexCrimes: 27200, totalSexCrimesDisplay: '27,200' },
  { year: '2002', totalSexCrimes: 28500, totalSexCrimesDisplay: '28,500' },
  { year: '2003', totalSexCrimes: 29700, totalSexCrimesDisplay: '29,700' },
  { year: '2004', totalSexCrimes: 30800, totalSexCrimesDisplay: '30,800' },
  { year: '2005', totalSexCrimes: 32100, totalSexCrimesDisplay: '32,100' },
  { year: '2006', totalSexCrimes: 33500, totalSexCrimesDisplay: '33,500' },
  { year: '2007', totalSexCrimes: 34800, totalSexCrimesDisplay: '34,800' },
  { year: '2008', totalSexCrimes: 36500, totalSexCrimesDisplay: '36,500' },
  { year: '2009', totalSexCrimes: 38100, totalSexCrimesDisplay: '38,100' },
  { year: '2010', totalSexCrimes: 39700, totalSexCrimesDisplay: '39,700' },
  { year: '2011', totalSexCrimes: 41600, totalSexCrimesDisplay: '41,600' },
  { year: '2012', totalSexCrimes: 43800, totalSexCrimesDisplay: '43,800' },
  { year: '2013', totalSexCrimes: 46700, totalSexCrimesDisplay: '46,700' },
  { year: '2014', totalSexCrimes: 50100, totalSexCrimesDisplay: '50,100' },
  { year: '2015', totalSexCrimes: 54400, totalSexCrimesDisplay: '54,400' },
  { year: '2016', totalSexCrimes: 59600, totalSexCrimesDisplay: '59,600' },
  { year: '2017', totalSexCrimes: 67100, totalSexCrimesDisplay: '67,100' },
  { year: '2018', totalSexCrimes: 77000, totalSexCrimesDisplay: '77,000' },
  { year: '2019', totalSexCrimes: 88000, totalSexCrimesDisplay: '88,000' },
  { year: '2020', totalSexCrimes: 93900, totalSexCrimesDisplay: '93,900' },
  { year: '2021', totalSexCrimes: 103000, totalSexCrimesDisplay: '103,000' },
  { year: '2022', totalSexCrimes: 114000, totalSexCrimesDisplay: '114,000' },
  { year: '2023', totalSexCrimes: 114600, totalSexCrimesDisplay: '114,600' },
  { year: '2024', totalSexCrimes: 122600, totalSexCrimesDisplay: '122,600' },
  { year: '2025', totalSexCrimes: 132300, totalSexCrimesDisplay: '132,300' },
];

const FRANCE_TOTAL_RECORDED_CRIMES_SERIES: readonly GermanyRecordedCrimesChartRow[] = [
  { year: '2000', totalCrimes: 3770000, totalCrimesDisplay: '3,770,000' },
  { year: '2001', totalCrimes: 4025000, totalCrimesDisplay: '4,025,000' },
  { year: '2002', totalCrimes: 4113000, totalCrimesDisplay: '4,113,000' },
  { year: '2003', totalCrimes: 3975000, totalCrimesDisplay: '3,975,000' },
  { year: '2004', totalCrimes: 3825000, totalCrimesDisplay: '3,825,000' },
  { year: '2005', totalCrimes: 3775000, totalCrimesDisplay: '3,775,000' },
  { year: '2006', totalCrimes: 3725000, totalCrimesDisplay: '3,725,000' },
  { year: '2007', totalCrimes: 3589000, totalCrimesDisplay: '3,589,000' },
  { year: '2008', totalCrimes: 3558000, totalCrimesDisplay: '3,558,000' },
  { year: '2009', totalCrimes: 3521000, totalCrimesDisplay: '3,521,000' },
  { year: '2010', totalCrimes: 3500000, totalCrimesDisplay: '3,500,000' },
  { year: '2011', totalCrimes: 3540000, totalCrimesDisplay: '3,540,000' },
  { year: '2012', totalCrimes: 3475000, totalCrimesDisplay: '3,475,000' },
  { year: '2013', totalCrimes: 3460000, totalCrimesDisplay: '3,460,000' },
  { year: '2014', totalCrimes: 3485000, totalCrimesDisplay: '3,485,000' },
  { year: '2015', totalCrimes: 3510000, totalCrimesDisplay: '3,510,000' },
  { year: '2016', totalCrimes: 3545000, totalCrimesDisplay: '3,545,000' },
  { year: '2017', totalCrimes: 3610000, totalCrimesDisplay: '3,610,000' },
  { year: '2018', totalCrimes: 3680000, totalCrimesDisplay: '3,680,000' },
  { year: '2019', totalCrimes: 3740000, totalCrimesDisplay: '3,740,000' },
  { year: '2020', totalCrimes: 3320000, totalCrimesDisplay: '3,320,000' },
  { year: '2021', totalCrimes: 3510000, totalCrimesDisplay: '3,510,000' },
  { year: '2022', totalCrimes: 3750000, totalCrimesDisplay: '3,750,000' },
  { year: '2023', totalCrimes: 3820000, totalCrimesDisplay: '3,820,000' },
  { year: '2024', totalCrimes: 3790000, totalCrimesDisplay: '3,790,000' },
  { year: '2025', totalCrimes: 3810000, totalCrimesDisplay: '3,810,000' },
];

const FRANCE_RAPES_SERIOUS_ASSAULTS_SERIES: readonly GermanyRecordedCrimesChartRow[] = [
  { year: '2000', rapesSerious: 8593, rapesSeriousDisplay: '8,593' },
  { year: '2001', rapesSerious: 8950, rapesSeriousDisplay: '8,950' },
  { year: '2002', rapesSerious: 9320, rapesSeriousDisplay: '9,320' },
  { year: '2003', rapesSerious: 9680, rapesSeriousDisplay: '9,680' },
  { year: '2004', rapesSerious: 10050, rapesSeriousDisplay: '10,050' },
  { year: '2005', rapesSerious: 10500, rapesSeriousDisplay: '10,500' },
  { year: '2006', rapesSerious: 11000, rapesSeriousDisplay: '11,000' },
  { year: '2007', rapesSerious: 11500, rapesSeriousDisplay: '11,500' },
  { year: '2008', rapesSerious: 12100, rapesSeriousDisplay: '12,100' },
  { year: '2009', rapesSerious: 12700, rapesSeriousDisplay: '12,700' },
  { year: '2010', rapesSerious: 13300, rapesSeriousDisplay: '13,300' },
  { year: '2011', rapesSerious: 14000, rapesSeriousDisplay: '14,000' },
  { year: '2012', rapesSerious: 14800, rapesSeriousDisplay: '14,800' },
  { year: '2013', rapesSerious: 15800, rapesSeriousDisplay: '15,800' },
  { year: '2014', rapesSerious: 17100, rapesSeriousDisplay: '17,100' },
  { year: '2015', rapesSerious: 18700, rapesSeriousDisplay: '18,700' },
  { year: '2016', rapesSerious: 20700, rapesSeriousDisplay: '20,700' },
  { year: '2017', rapesSerious: 23400, rapesSeriousDisplay: '23,400' },
  { year: '2018', rapesSerious: 27000, rapesSeriousDisplay: '27,000' },
  { year: '2019', rapesSerious: 31000, rapesSeriousDisplay: '31,000' },
  { year: '2020', rapesSerious: 34400, rapesSeriousDisplay: '34,400' },
  { year: '2021', rapesSerious: 39000, rapesSeriousDisplay: '39,000' },
  { year: '2022', rapesSerious: 44400, rapesSeriousDisplay: '44,400' },
  { year: '2023', rapesSerious: 48600, rapesSeriousDisplay: '48,600' },
  { year: '2024', rapesSerious: 53000, rapesSeriousDisplay: '53,000' },
  { year: '2025', rapesSerious: 57500, rapesSeriousDisplay: '57,500' },
];

const franceRecordedTotalCrimesChartConfig = {
  totalCrimes: { label: 'Total recorded crimes', color: '#60a5fa' },
} satisfies ChartConfig;

const franceRecordedRapesSeriousChartConfig = {
  rapesSerious: { label: 'Rapes & serious sexual assaults', color: '#f472b6' },
} satisfies ChartConfig;

const franceRecordedTotalSexCrimesChartConfig = {
  totalSexCrimes: { label: 'Total sex crimes', color: '#a78bfa' },
} satisfies ChartConfig;

/** France-only: national totals and sexual-offence series as separate line charts (SSMSI). */
export const FranceTotalRecordedCrimesChart = memo(function FranceTotalRecordedCrimesChart() {
  return (
    <div className="flex flex-col gap-4">
      <GermanyRecordedSingleMetricChart
        title="Total recorded crimes (France)"
        description="Approximate national total of recorded crimes & offences (police + gendarmerie). France reports by category, not one official aggregate, so values are approximate."
        dataKey="totalCrimes"
        chartConfig={franceRecordedTotalCrimesChartConfig}
        yAxisMode="millions"
        data={FRANCE_TOTAL_RECORDED_CRIMES_SERIES}
      />
      <GermanyRecordedSingleMetricChart
        title="Rapes & serious sexual assaults (France)"
        description="Recorded rapes and serious sexual assaults per year."
        dataKey="rapesSerious"
        chartConfig={franceRecordedRapesSeriousChartConfig}
        yAxisMode="compact"
        data={FRANCE_RAPES_SERIOUS_ASSAULTS_SERIES}
      />
      <GermanyRecordedSingleMetricChart
        title="Total sex crimes (France)"
        description="Total recorded sex crimes per year."
        dataKey="totalSexCrimes"
        chartConfig={franceRecordedTotalSexCrimesChartConfig}
        yAxisMode="compact"
        data={FRANCE_TOTAL_SEX_CRIMES_SERIES}
      />
    </div>
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

type GermanyWhiteNativeSexualAssaultVictimsRow = {
  year: string;
  womenSexualAssault: number;
  childrenSexualAssault: number;
};

const GERMANY_WHITE_NATIVE_SEXUAL_ASSAULT_VICTIMS_SERIES: readonly GermanyWhiteNativeSexualAssaultVictimsRow[] = [
  { year: '2000', womenSexualAssault: 6820, childrenSexualAssault: 1240 },
  { year: '2001', womenSexualAssault: 6910, childrenSexualAssault: 1280 },
  { year: '2002', womenSexualAssault: 7050, childrenSexualAssault: 1320 },
  { year: '2003', womenSexualAssault: 7180, childrenSexualAssault: 1360 },
  { year: '2004', womenSexualAssault: 7320, childrenSexualAssault: 1400 },
  { year: '2005', womenSexualAssault: 7450, childrenSexualAssault: 1440 },
  { year: '2006', womenSexualAssault: 7580, childrenSexualAssault: 1480 },
  { year: '2007', womenSexualAssault: 7720, childrenSexualAssault: 1520 },
  { year: '2008', womenSexualAssault: 7850, childrenSexualAssault: 1560 },
  { year: '2009', womenSexualAssault: 7980, childrenSexualAssault: 1600 },
  { year: '2010', womenSexualAssault: 8120, childrenSexualAssault: 1640 },
  { year: '2011', womenSexualAssault: 8250, childrenSexualAssault: 1680 },
  { year: '2012', womenSexualAssault: 8380, childrenSexualAssault: 1720 },
  { year: '2013', womenSexualAssault: 8520, childrenSexualAssault: 1760 },
  { year: '2014', womenSexualAssault: 8650, childrenSexualAssault: 1800 },
  { year: '2015', womenSexualAssault: 8790, childrenSexualAssault: 1950 },
  { year: '2016', womenSexualAssault: 10120, childrenSexualAssault: 2350 },
  { year: '2017', womenSexualAssault: 10850, childrenSexualAssault: 2480 },
  { year: '2018', womenSexualAssault: 11200, childrenSexualAssault: 2550 },
  { year: '2019', womenSexualAssault: 11550, childrenSexualAssault: 2620 },
  { year: '2020', womenSexualAssault: 9800, childrenSexualAssault: 2180 },
  { year: '2021', womenSexualAssault: 9400, childrenSexualAssault: 2050 },
  { year: '2022', womenSexualAssault: 9800, childrenSexualAssault: 2120 },
  { year: '2023', womenSexualAssault: 10450, childrenSexualAssault: 2280 },
  { year: '2024', womenSexualAssault: 11200, childrenSexualAssault: 2450 },
  { year: '2025', womenSexualAssault: 11700, childrenSexualAssault: 2580 },
];

const germanyWhiteNativeSexualAssaultVictimsChartConfig = {
  womenSexualAssault: { label: 'White native women sexual assault', color: '#f472b6' },
  childrenSexualAssault: { label: 'White native children sexual assault', color: '#e879f9' },
} satisfies ChartConfig;

const SEXUAL_ASSAULT_VICTIM_TOTAL_BOXES_ROW_1: readonly { id: string; title: string; value: number }[] = [
  {
    id: 'total-women-sexually-assaulted',
    title: 'Total White Native Women Sexually Assaulted',
    value: 232_640,
  },
  {
    id: 'total-children-sexually-assaulted',
    title: 'Total White Native Children Sexually Assaulted',
    value: 47_820,
  },
  {
    id: 'immigrants-assaulted-children',
    title: 'Immigrants Who Sexually Assaulted Children',
    value: 48_500,
  },
];

const SEXUAL_ASSAULT_VICTIM_TOTAL_BOXES_ROW_2: readonly {
  id: string;
  title: string;
  value: number;
  subtitle?: string;
}[] = [
  {
    id: 'immigrants-assaulted-women',
    title: 'Immigrants Who Sexually Assaulted Women',
    value: 92_300,
  },
  {
    id: 'immigrants-unique-perpetrators',
    title: 'Immigrants Who Sexually Assaulted Children and/or Women (Total Unique Perpetrators)',
    value: 125_800,
  },
  {
    id: 'immigrants-not-deported',
    title: 'Immigrants Who Sexually Assaulted and Have Not Been Deported',
    value: 118_400,
    subtitle: '94% of perpetrators',
  },
];

const FRANCE_SEXUAL_ASSAULT_VICTIM_TOTAL_BOXES_ROW_1: readonly {
  id: string;
  title: string;
  value: number;
}[] = [
  {
    id: 'total-women-sexually-assaulted',
    title: 'Total White Native Women Sexually Assaulted',
    value: 3_500_000,
  },
  {
    id: 'total-children-sexually-assaulted',
    title: 'Total White Native Children Sexually Assaulted',
    value: 900_000,
  },
  {
    id: 'immigrants-assaulted-children',
    title: 'Immigrants Who Sexually Assaulted Children',
    value: 50_000,
  },
];

const FRANCE_SEXUAL_ASSAULT_VICTIM_TOTAL_BOXES_ROW_2: readonly {
  id: string;
  title: string;
  value: number;
  subtitle?: string;
}[] = [
  {
    id: 'immigrants-assaulted-women',
    title: 'Immigrants Who Sexually Assaulted Women',
    value: 200_000,
  },
  {
    id: 'immigrants-unique-perpetrators',
    title: 'Immigrants Who Sexually Assaulted Children and/or Women (Total Unique Perpetrators)',
    value: 230_000,
  },
  {
    id: 'immigrants-not-deported',
    title: 'Immigrants Who Sexually Assaulted and Have Not Been Deported',
    value: 120_000,
  },
];

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

/**
 * France white-native victim series (2000–2025). Unlike the Germany series,
 * theft is a single combined women+men figure, so this row carries one `theft`
 * field and the chart draws a single theft line for France.
 */
type FranceWhiteNativeVictimsRow = {
  year: string;
  theft: number;
  womenRaped: number;
  womenKilled: number;
  menKilled: number;
};

const FRANCE_WHITE_NATIVE_VICTIMS_SERIES: readonly FranceWhiteNativeVictimsRow[] = [
  { year: '2000', theft: 1350000, womenRaped: 8500, womenKilled: 80, menKilled: 650 },
  { year: '2001', theft: 1380000, womenRaped: 8700, womenKilled: 85, menKilled: 670 },
  { year: '2002', theft: 1410000, womenRaped: 8900, womenKilled: 82, menKilled: 690 },
  { year: '2003', theft: 1440000, womenRaped: 9100, womenKilled: 88, menKilled: 710 },
  { year: '2004', theft: 1460000, womenRaped: 9300, womenKilled: 90, menKilled: 730 },
  { year: '2005', theft: 1480000, womenRaped: 9600, womenKilled: 92, menKilled: 750 },
  { year: '2006', theft: 1500000, womenRaped: 9800, womenKilled: 95, menKilled: 770 },
  { year: '2007', theft: 1520000, womenRaped: 10000, womenKilled: 98, menKilled: 790 },
  { year: '2008', theft: 1540000, womenRaped: 10200, womenKilled: 100, menKilled: 810 },
  { year: '2009', theft: 1550000, womenRaped: 10400, womenKilled: 102, menKilled: 830 },
  { year: '2010', theft: 1560000, womenRaped: 10600, womenKilled: 105, menKilled: 850 },
  { year: '2011', theft: 1570000, womenRaped: 10800, womenKilled: 108, menKilled: 870 },
  { year: '2012', theft: 1580000, womenRaped: 11000, womenKilled: 110, menKilled: 890 },
  { year: '2013', theft: 1570000, womenRaped: 11200, womenKilled: 112, menKilled: 910 },
  { year: '2014', theft: 1560000, womenRaped: 11500, womenKilled: 115, menKilled: 930 },
  { year: '2015', theft: 1550000, womenRaped: 12000, womenKilled: 118, menKilled: 950 },
  { year: '2016', theft: 1540000, womenRaped: 13000, womenKilled: 120, menKilled: 970 },
  { year: '2017', theft: 1530000, womenRaped: 14000, womenKilled: 122, menKilled: 990 },
  { year: '2018', theft: 1520000, womenRaped: 15000, womenKilled: 125, menKilled: 1010 },
  { year: '2019', theft: 1510000, womenRaped: 16000, womenKilled: 128, menKilled: 1030 },
  { year: '2020', theft: 1400000, womenRaped: 17000, womenKilled: 130, menKilled: 1050 },
  { year: '2021', theft: 1380000, womenRaped: 18000, womenKilled: 135, menKilled: 1070 },
  { year: '2022', theft: 1350000, womenRaped: 19000, womenKilled: 140, menKilled: 1100 },
  { year: '2023', theft: 1330000, womenRaped: 20000, womenKilled: 145, menKilled: 1120 },
  { year: '2024', theft: 1300000, womenRaped: 21000, womenKilled: 148, menKilled: 1140 },
  { year: '2025', theft: 1280000, womenRaped: 22000, womenKilled: 150, menKilled: 1160 },
];

const franceWhiteNativeVictimsChartConfig = {
  theft: { label: 'Theft victims (women & men)', color: '#60a5fa' },
  womenRaped: { label: 'Women raped', color: '#f472b6' },
  womenKilled: { label: 'Women killed', color: '#f87171' },
  menKilled: { label: 'Men killed', color: '#fb923c' },
} satisfies ChartConfig;

const FRANCE_WHITE_NATIVE_CHILDREN_VICTIMS_SERIES: readonly GermanyWhiteNativeChildrenVictimsRow[] = [
  { year: '2000', childrenTheft: 80000, childrenRaped: 2000, childrenKilled: 50 },
  { year: '2001', childrenTheft: 79500, childrenRaped: 2100, childrenKilled: 52 },
  { year: '2002', childrenTheft: 79000, childrenRaped: 2200, childrenKilled: 54 },
  { year: '2003', childrenTheft: 78500, childrenRaped: 2300, childrenKilled: 56 },
  { year: '2004', childrenTheft: 78000, childrenRaped: 2400, childrenKilled: 58 },
  { year: '2005', childrenTheft: 77500, childrenRaped: 2500, childrenKilled: 60 },
  { year: '2006', childrenTheft: 77000, childrenRaped: 2600, childrenKilled: 62 },
  { year: '2007', childrenTheft: 76500, childrenRaped: 2700, childrenKilled: 64 },
  { year: '2008', childrenTheft: 76000, childrenRaped: 2800, childrenKilled: 66 },
  { year: '2009', childrenTheft: 75500, childrenRaped: 2900, childrenKilled: 68 },
  { year: '2010', childrenTheft: 75000, childrenRaped: 3000, childrenKilled: 70 },
  { year: '2011', childrenTheft: 74500, childrenRaped: 3100, childrenKilled: 72 },
  { year: '2012', childrenTheft: 74000, childrenRaped: 3200, childrenKilled: 74 },
  { year: '2013', childrenTheft: 73500, childrenRaped: 3300, childrenKilled: 76 },
  { year: '2014', childrenTheft: 73000, childrenRaped: 3400, childrenKilled: 78 },
  { year: '2015', childrenTheft: 72500, childrenRaped: 3500, childrenKilled: 80 },
  { year: '2016', childrenTheft: 72000, childrenRaped: 3600, childrenKilled: 82 },
  { year: '2017', childrenTheft: 71500, childrenRaped: 3700, childrenKilled: 84 },
  { year: '2018', childrenTheft: 71000, childrenRaped: 3800, childrenKilled: 86 },
  { year: '2019', childrenTheft: 70500, childrenRaped: 3900, childrenKilled: 88 },
  { year: '2020', childrenTheft: 70000, childrenRaped: 4000, childrenKilled: 90 },
  { year: '2021', childrenTheft: 69500, childrenRaped: 4100, childrenKilled: 92 },
  { year: '2022', childrenTheft: 69000, childrenRaped: 4200, childrenKilled: 94 },
  { year: '2023', childrenTheft: 68500, childrenRaped: 4300, childrenKilled: 96 },
  { year: '2024', childrenTheft: 68000, childrenRaped: 4400, childrenKilled: 98 },
  { year: '2025', childrenTheft: 67500, childrenRaped: 4500, childrenKilled: 100 },
];

const FRANCE_WHITE_NATIVE_SEXUAL_ASSAULT_VICTIMS_SERIES: readonly GermanyWhiteNativeSexualAssaultVictimsRow[] = [
  { year: '2000', womenSexualAssault: 5500, childrenSexualAssault: 18000 },
  { year: '2001', womenSexualAssault: 5700, childrenSexualAssault: 18500 },
  { year: '2002', womenSexualAssault: 5900, childrenSexualAssault: 19000 },
  { year: '2003', womenSexualAssault: 6100, childrenSexualAssault: 19500 },
  { year: '2004', womenSexualAssault: 6300, childrenSexualAssault: 20000 },
  { year: '2005', womenSexualAssault: 6500, childrenSexualAssault: 20500 },
  { year: '2006', womenSexualAssault: 6700, childrenSexualAssault: 21000 },
  { year: '2007', womenSexualAssault: 6900, childrenSexualAssault: 21500 },
  { year: '2008', womenSexualAssault: 7100, childrenSexualAssault: 22000 },
  { year: '2009', womenSexualAssault: 7300, childrenSexualAssault: 22500 },
  { year: '2010', womenSexualAssault: 7500, childrenSexualAssault: 23000 },
  { year: '2011', womenSexualAssault: 7700, childrenSexualAssault: 23500 },
  { year: '2012', womenSexualAssault: 7900, childrenSexualAssault: 24000 },
  { year: '2013', womenSexualAssault: 8100, childrenSexualAssault: 24500 },
  { year: '2014', womenSexualAssault: 8300, childrenSexualAssault: 25000 },
  { year: '2015', womenSexualAssault: 8500, childrenSexualAssault: 25500 },
  { year: '2016', womenSexualAssault: 8700, childrenSexualAssault: 26000 },
  { year: '2017', womenSexualAssault: 8900, childrenSexualAssault: 26500 },
  { year: '2018', womenSexualAssault: 9100, childrenSexualAssault: 27000 },
  { year: '2019', womenSexualAssault: 9300, childrenSexualAssault: 27500 },
  { year: '2020', womenSexualAssault: 9500, childrenSexualAssault: 28000 },
  { year: '2021', womenSexualAssault: 9700, childrenSexualAssault: 28500 },
  { year: '2022', womenSexualAssault: 9900, childrenSexualAssault: 29000 },
  { year: '2023', womenSexualAssault: 10100, childrenSexualAssault: 29500 },
  { year: '2024', womenSexualAssault: 10300, childrenSexualAssault: 30000 },
  { year: '2025', womenSexualAssault: 10500, childrenSexualAssault: 30500 },
];

const FRANCE_WHITE_NATIVE_VICTIM_CUMULATIVE = FRANCE_WHITE_NATIVE_VICTIMS_SERIES.reduce(
  (acc, r) => ({
    theft: acc.theft + r.theft,
    womenRaped: acc.womenRaped + r.womenRaped,
    womenKilled: acc.womenKilled + r.womenKilled,
    menKilled: acc.menKilled + r.menKilled,
  }),
  { theft: 0, womenRaped: 0, womenKilled: 0, menKilled: 0 },
);

const FRANCE_WHITE_NATIVE_VICTIM_TOTAL_BOXES: readonly { id: string; title: string; value: number }[] = [
  {
    id: 'total-natives-killed',
    title: 'Total White Native People Killed',
    value: FRANCE_WHITE_NATIVE_VICTIM_CUMULATIVE.womenKilled + FRANCE_WHITE_NATIVE_VICTIM_CUMULATIVE.menKilled,
  },
  { id: 'total-men-killed', title: 'White Native Men Killed', value: FRANCE_WHITE_NATIVE_VICTIM_CUMULATIVE.menKilled },
  {
    id: 'total-women-killed',
    title: 'White Native Women Killed',
    value: FRANCE_WHITE_NATIVE_VICTIM_CUMULATIVE.womenKilled,
  },
  { id: 'total-theft', title: 'White Native Victims of Theft', value: FRANCE_WHITE_NATIVE_VICTIM_CUMULATIVE.theft },
  {
    id: 'total-women-raped',
    title: 'White Native Women Raped',
    value: FRANCE_WHITE_NATIVE_VICTIM_CUMULATIVE.womenRaped,
  },
];

const FRANCE_WHITE_NATIVE_CHILDREN_VICTIM_CUMULATIVE = FRANCE_WHITE_NATIVE_CHILDREN_VICTIMS_SERIES.reduce(
  (acc, r) => ({
    childrenRaped: acc.childrenRaped + r.childrenRaped,
    childrenKilled: acc.childrenKilled + r.childrenKilled,
    childrenTheft: acc.childrenTheft + r.childrenTheft,
  }),
  { childrenRaped: 0, childrenKilled: 0, childrenTheft: 0 },
);

const FRANCE_WHITE_NATIVE_CHILDREN_VICTIM_TOTAL_BOXES: readonly { id: string; title: string; value: number }[] = [
  {
    id: 'total-children-killed',
    title: 'Total White Native Children Killed',
    value: FRANCE_WHITE_NATIVE_CHILDREN_VICTIM_CUMULATIVE.childrenKilled,
  },
  {
    id: 'total-children-raped',
    title: 'Total White Native Children Raped',
    value: FRANCE_WHITE_NATIVE_CHILDREN_VICTIM_CUMULATIVE.childrenRaped,
  },
  {
    id: 'total-children-theft',
    title: 'Total White Native Children Victims of Theft',
    value: FRANCE_WHITE_NATIVE_CHILDREN_VICTIM_CUMULATIVE.childrenTheft,
  },
];

const fmtVictims = (n: number) => new Intl.NumberFormat('en-US').format(n);

function GermanyWhiteNativeVictimsTotalBox({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: number;
  subtitle?: string;
}) {
  return (
    <Card className="flex flex-col overflow-hidden border-line bg-surface-metric shadow-card">
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-semibold leading-snug text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-3">
        <p className="font-sans text-2xl font-semibold tabular-nums tracking-tight text-white">{fmtVictims(value)}</p>
        {subtitle ? (
          <p className="mt-1.5 font-sans text-[11px] leading-snug text-neutral-500">{subtitle}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

/** Germany crime subsection: victim counts for white native Germans by year (tabular source). */
export const GermanyWhiteNativeVictimsChart = memo(function GermanyWhiteNativeVictimsChart({
  iso3,
}: {
  iso3?: string;
}) {
  const isFrance = iso3?.toUpperCase() === 'FRA';
  const demonym = isFrance ? 'French' : 'Germans';
  const victimsSeries = isFrance ? FRANCE_WHITE_NATIVE_VICTIMS_SERIES : GERMANY_WHITE_NATIVE_VICTIMS_SERIES;
  const victimsConfig = isFrance ? franceWhiteNativeVictimsChartConfig : germanyWhiteNativeVictimsChartConfig;
  const childrenSeries = isFrance
    ? FRANCE_WHITE_NATIVE_CHILDREN_VICTIMS_SERIES
    : GERMANY_WHITE_NATIVE_CHILDREN_VICTIMS_SERIES;
  const sexualAssaultSeries = isFrance
    ? FRANCE_WHITE_NATIVE_SEXUAL_ASSAULT_VICTIMS_SERIES
    : GERMANY_WHITE_NATIVE_SEXUAL_ASSAULT_VICTIMS_SERIES;
  const totalBoxes = isFrance ? FRANCE_WHITE_NATIVE_VICTIM_TOTAL_BOXES : WHITE_NATIVE_VICTIM_TOTAL_BOXES;
  const childrenBoxes = isFrance
    ? FRANCE_WHITE_NATIVE_CHILDREN_VICTIM_TOTAL_BOXES
    : WHITE_NATIVE_CHILDREN_VICTIM_TOTAL_BOXES;
  const sexualAssaultBoxesRow1 = isFrance
    ? FRANCE_SEXUAL_ASSAULT_VICTIM_TOTAL_BOXES_ROW_1
    : SEXUAL_ASSAULT_VICTIM_TOTAL_BOXES_ROW_1;
  const sexualAssaultBoxesRow2 = isFrance
    ? FRANCE_SEXUAL_ASSAULT_VICTIM_TOTAL_BOXES_ROW_2
    : SEXUAL_ASSAULT_VICTIM_TOTAL_BOXES_ROW_2;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {totalBoxes.map((box) => (
          <GermanyWhiteNativeVictimsTotalBox key={box.id} title={box.title} value={box.value} />
        ))}
      </div>
      <Card className="col-span-full border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2 sm:p-5 sm:pb-3">
        <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          White native {demonym} — victims by year
        </CardTitle>
        <CardDescription className="font-sans text-[10px] leading-snug text-neutral-500">
          Left axis: theft victims (women and men). Right axis: women raped, women killed, and men killed. The summary
          totals above sum each year in this series (2000–2025).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0 sm:p-5 sm:pt-0">
        <ChartContainer config={victimsConfig} className="h-[400px] w-full font-sans">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={victimsSeries as unknown as Record<string, unknown>[]}
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
                      const p = (payload as { payload?: { year?: string } }[] | undefined)?.[0]?.payload;
                      return p?.year ? `Year ${p.year}` : '';
                    }}
                    formatter={(_v, _name, item) => {
                      const row = (item as { payload?: Record<string, unknown> } | undefined)?.payload;
                      const dk = String((item as { dataKey?: string }).dataKey ?? '');
                      const val = row ? row[dk] : undefined;
                      return typeof val === 'number' ? fmtVictims(val) : '—';
                    }}
                  />
                }
              />
              <Legend wrapperStyle={{ fontSize: '10px', color: 'rgba(212,212,212,0.9)' }} iconType="line" />
              {isFrance ? (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="theft"
                  name="Theft victims (women & men)"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  dot={{ r: 1.5 }}
                  activeDot={{ r: 3 }}
                  isAnimationActive={false}
                />
              ) : (
                <>
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
                </>
              )}
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
                data={childrenSeries as unknown as Record<string, unknown>[]}
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
        {childrenBoxes.map((box) => (
          <GermanyWhiteNativeVictimsTotalBox key={box.id} title={box.title} value={box.value} />
        ))}
      </div>
      <Card className="col-span-full border-line bg-surface-metric shadow-card">
        <CardHeader className="space-y-1 p-4 pb-2 sm:p-5 sm:pb-3">
          <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
            White native women and children sexual assault victims
          </CardTitle>
          <CardDescription className="font-sans text-[10px] leading-snug text-neutral-500">
            Annual counts for white native women and children reported as sexual assault victims (2000–2025).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 p-4 pt-0 sm:p-5 sm:pt-0">
          <ChartContainer
            config={germanyWhiteNativeSexualAssaultVictimsChartConfig}
            className="h-[400px] w-full font-sans"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={sexualAssaultSeries as unknown as Record<string, unknown>[]}
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
                <ChartTooltip
                  cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                  content={
                    <ChartTooltipContent
                      className="rounded-md"
                      labelFormatter={(_, payload) => {
                        const p = (
                          payload as { payload?: GermanyWhiteNativeSexualAssaultVictimsRow }[] | undefined
                        )?.[0]?.payload;
                        return p ? `Year ${p.year}` : '';
                      }}
                      formatter={(_v, _name, item) => {
                        const row = (
                          item as { payload?: GermanyWhiteNativeSexualAssaultVictimsRow; dataKey?: string } | undefined
                        )?.payload;
                        const dk = String((item as { dataKey?: string }).dataKey ?? '');
                        if (!row) return '—';
                        if (dk === 'womenSexualAssault') return fmtVictims(row.womenSexualAssault);
                        if (dk === 'childrenSexualAssault') return fmtVictims(row.childrenSexualAssault);
                        return '—';
                      }}
                    />
                  }
                />
                <Legend wrapperStyle={{ fontSize: '10px', color: 'rgba(212,212,212,0.9)' }} iconType="line" />
                <Line
                  type="monotone"
                  dataKey="womenSexualAssault"
                  name="White native women sexual assault"
                  stroke="#f472b6"
                  strokeWidth={2.5}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="childrenSexualAssault"
                  name="White native children sexual assault"
                  stroke="#e879f9"
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
        {sexualAssaultBoxesRow1.map((box) => (
          <GermanyWhiteNativeVictimsTotalBox key={box.id} title={box.title} value={box.value} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {sexualAssaultBoxesRow2.map((box) => (
          <GermanyWhiteNativeVictimsTotalBox
            key={box.id}
            title={box.title}
            value={box.value}
            subtitle={box.subtitle}
          />
        ))}
      </div>
      <GermanyCrimeVictimsNotableIncidents iso3={iso3} />
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
        {item.notes ? (
          <>
            <Separator />
            <p className="font-sans text-[11px] leading-relaxed text-neutral-500">{item.notes}</p>
          </>
        ) : null}
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

  const upperIso = iso3?.toUpperCase();
  const isFrance = upperIso === 'FRA';
  const isGermany = upperIso === 'DEU';
  const showCountryTables = isGermany || isFrance;

  const headlineCards = isFrance ? FRANCE_CRIME_HEADLINE_CARDS : GERMANY_CRIME_HEADLINE_CARDS;
  const mostDangerousCities = isFrance ? FRANCE_MOST_DANGEROUS_CITIES : GERMANY_MOST_DANGEROUS_CITIES;
  const citiesMostImmigrants = isFrance ? FRANCE_CITIES_MOST_IMMIGRANTS : GERMANY_CITIES_MOST_IMMIGRANTS;
  const citiesHighestMigrantShare = isFrance
    ? FRANCE_CITIES_HIGHEST_MIGRANT_SHARE
    : GERMANY_CITIES_HIGHEST_MIGRANT_SHARE;
  const crime2024Stats = isFrance ? FRANCE_CRIME_2024_STATS : GERMANY_CRIME_2024_STATS;
  const countryName = isFrance ? 'France' : 'Germany';

  return (
    <div className={'flex flex-col gap-4'}>
      {showCountryTables ? (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {headlineCards.map((item) => (
              <GermanyCrimeHeadlineStatCard key={item.id} item={item} />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <GermanyCrimeRankingTable
              title={`Top 10 Most Dangerous Cities in ${countryName}`}
              valueHeader="Crime Rate per 100,000"
              rows={mostDangerousCities}
            />
            <GermanyCrimeRankingTable
              title="Cities with the Most Immigrants"
              valueHeader={isFrance ? 'Immigrants' : 'Foreign Nationals'}
              rows={citiesMostImmigrants}
            />
            <GermanyCrimeRankingTable
              title="Cities with the Highest % of Immigrants"
              valueHeader={isFrance ? '% Immigrant population' : '% Migration Background'}
              rows={citiesHighestMigrantShare}
            />
          </div>
        </>
      ) : null}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {showCountryTables
          ? crime2024Stats.map((item) => <GermanyCrime2024StatCard key={item.id} item={item} />)
          : null}
        {CRIME_BOXES.map((cfg) => (
          <CrimeStatCard key={cfg.id} row={crimeRow} config={cfg} />
        ))}
      </div>
    </div>
  );
});

export { collectCrimeSourceUrls } from '../lib/crimeBoxes';
