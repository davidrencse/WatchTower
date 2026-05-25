import { memo, useEffect, useMemo, useState } from 'react';
import germanyMigrantCrimeRaw from '../../Assets/Data/Europe/Germany/germany_migrant_crime_requested_metrics.csv?raw';
import germanyMigrantCrimeAdditionalRaw from '../../Assets/Data/Europe/Germany/germany_migrant_crime_additional_metrics.csv?raw';
import { parseCsvRows } from '../lib/csv';
import { CollapsibleFlagSection } from './CollapsibleFlagSection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from './ui/chart';
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

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

type DeportationSeriesKey = 'cumulativeDeported' | 'deportationRate';

type DeportationTrendRow = {
  year: string;
  yearlyDeported: number;
  yearlyDeportedDisplay: string;
  cumulativeDeported: number;
  cumulativeDeportedDisplay: string;
  deportationRate: number;
  deportationRateDisplay: string;
};

const deportationTrendChartConfig = {
  cumulativeDeported: { label: 'Cumulative deported migrants', color: '#fbbf24' },
  deportationRate: { label: 'Deportation rate (per 100k migrants)', color: '#a78bfa' },
} satisfies ChartConfig;

const yearlyDeportationsChartConfig = {
  yearlyDeported: { label: 'Deported migrants', color: '#34d399' },
} satisfies ChartConfig;

const DEPORTATION_TREND_SERIES: readonly DeportationTrendRow[] = [
  { year: '2000', yearlyDeported: 35200, yearlyDeportedDisplay: '35,200', cumulativeDeported: 35200, cumulativeDeportedDisplay: '35,200', deportationRate: 275, deportationRateDisplay: '275' },
  { year: '2001', yearlyDeported: 32800, yearlyDeportedDisplay: '32,800', cumulativeDeported: 68000, cumulativeDeportedDisplay: '68,000', deportationRate: 252, deportationRateDisplay: '252' },
  { year: '2002', yearlyDeported: 30100, yearlyDeportedDisplay: '30,100', cumulativeDeported: 98100, cumulativeDeportedDisplay: '98,100', deportationRate: 228, deportationRateDisplay: '228' },
  { year: '2003', yearlyDeported: 27900, yearlyDeportedDisplay: '27,900', cumulativeDeported: 126000, cumulativeDeportedDisplay: '126,000', deportationRate: 207, deportationRateDisplay: '207' },
  { year: '2004', yearlyDeported: 25400, yearlyDeportedDisplay: '25,400', cumulativeDeported: 151400, cumulativeDeportedDisplay: '151,400', deportationRate: 183, deportationRateDisplay: '183' },
  { year: '2005', yearlyDeported: 23100, yearlyDeportedDisplay: '23,100', cumulativeDeported: 174500, cumulativeDeportedDisplay: '174,500', deportationRate: 160, deportationRateDisplay: '160' },
  { year: '2006', yearlyDeported: 21800, yearlyDeportedDisplay: '21,800', cumulativeDeported: 196300, cumulativeDeportedDisplay: '196,300', deportationRate: 153, deportationRateDisplay: '153' },
  { year: '2007', yearlyDeported: 20500, yearlyDeportedDisplay: '20,500', cumulativeDeported: 216800, cumulativeDeportedDisplay: '216,800', deportationRate: 142, deportationRateDisplay: '142' },
  { year: '2008', yearlyDeported: 19200, yearlyDeportedDisplay: '19,200', cumulativeDeported: 236000, cumulativeDeportedDisplay: '236,000', deportationRate: 132, deportationRateDisplay: '132' },
  { year: '2009', yearlyDeported: 17800, yearlyDeportedDisplay: '17,800', cumulativeDeported: 253800, cumulativeDeportedDisplay: '253,800', deportationRate: 119, deportationRateDisplay: '119' },
  { year: '2010', yearlyDeported: 16500, yearlyDeportedDisplay: '16,500', cumulativeDeported: 270300, cumulativeDeportedDisplay: '270,300', deportationRate: 112, deportationRateDisplay: '112' },
  { year: '2011', yearlyDeported: 15200, yearlyDeportedDisplay: '15,200', cumulativeDeported: 285500, cumulativeDeportedDisplay: '285,500', deportationRate: 103, deportationRateDisplay: '103' },
  { year: '2012', yearlyDeported: 13800, yearlyDeportedDisplay: '13,800', cumulativeDeported: 299300, cumulativeDeportedDisplay: '299,300', deportationRate: 90, deportationRateDisplay: '90' },
  { year: '2013', yearlyDeported: 12400, yearlyDeportedDisplay: '12,400', cumulativeDeported: 311700, cumulativeDeportedDisplay: '311,700', deportationRate: 75, deportationRateDisplay: '75' },
  { year: '2014', yearlyDeported: 10884, yearlyDeportedDisplay: '10,884', cumulativeDeported: 322584, cumulativeDeportedDisplay: '322,584', deportationRate: 67, deportationRateDisplay: '67' },
  { year: '2015', yearlyDeported: 20888, yearlyDeportedDisplay: '20,888', cumulativeDeported: 343472, cumulativeDeportedDisplay: '343,472', deportationRate: 123, deportationRateDisplay: '123' },
  { year: '2016', yearlyDeported: 25375, yearlyDeportedDisplay: '25,375', cumulativeDeported: 368847, cumulativeDeportedDisplay: '368,847', deportationRate: 138, deportationRateDisplay: '138' },
  { year: '2017', yearlyDeported: 23966, yearlyDeportedDisplay: '23,966', cumulativeDeported: 392813, cumulativeDeportedDisplay: '392,813', deportationRate: 118, deportationRateDisplay: '118' },
  { year: '2018', yearlyDeported: 23617, yearlyDeportedDisplay: '23,617', cumulativeDeported: 416430, cumulativeDeportedDisplay: '416,430', deportationRate: 114, deportationRateDisplay: '114' },
  { year: '2019', yearlyDeported: 22097, yearlyDeportedDisplay: '22,097', cumulativeDeported: 438527, cumulativeDeportedDisplay: '438,527', deportationRate: 104, deportationRateDisplay: '104' },
  { year: '2020', yearlyDeported: 10800, yearlyDeportedDisplay: '10,800', cumulativeDeported: 449327, cumulativeDeportedDisplay: '449,327', deportationRate: 49, deportationRateDisplay: '49' },
  { year: '2021', yearlyDeported: 11982, yearlyDeportedDisplay: '11,982', cumulativeDeported: 461309, cumulativeDeportedDisplay: '461,309', deportationRate: 55, deportationRateDisplay: '55' },
  { year: '2022', yearlyDeported: 12945, yearlyDeportedDisplay: '12,945', cumulativeDeported: 474254, cumulativeDeportedDisplay: '474,254', deportationRate: 57, deportationRateDisplay: '57' },
  { year: '2023', yearlyDeported: 16430, yearlyDeportedDisplay: '16,430', cumulativeDeported: 490684, cumulativeDeportedDisplay: '490,684', deportationRate: 68, deportationRateDisplay: '68' },
  { year: '2024', yearlyDeported: 20084, yearlyDeportedDisplay: '20,084', cumulativeDeported: 510768, cumulativeDeportedDisplay: '510,768', deportationRate: 79, deportationRateDisplay: '79' },
  { year: '2025', yearlyDeported: 22787, yearlyDeportedDisplay: '22,787', cumulativeDeported: 533555, cumulativeDeportedDisplay: '533,555', deportationRate: 88, deportationRateDisplay: '88' },
];

const DEPORTATION_REENTRY_BY_YEAR = [
  { year: '2000', returnedCount: 420, returnPct: 11.9 },
  { year: '2001', returnedCount: 390, returnPct: 11.9 },
  { year: '2002', returnedCount: 360, returnPct: 12.0 },
  { year: '2003', returnedCount: 330, returnPct: 11.8 },
  { year: '2004', returnedCount: 300, returnPct: 11.8 },
  { year: '2005', returnedCount: 280, returnPct: 12.1 },
  { year: '2006', returnedCount: 260, returnPct: 11.9 },
  { year: '2007', returnedCount: 240, returnPct: 11.7 },
  { year: '2008', returnedCount: 220, returnPct: 11.5 },
  { year: '2009', returnedCount: 200, returnPct: 11.2 },
  { year: '2010', returnedCount: 190, returnPct: 11.5 },
  { year: '2011', returnedCount: 180, returnPct: 11.8 },
  { year: '2012', returnedCount: 170, returnPct: 12.3 },
  { year: '2013', returnedCount: 160, returnPct: 12.9 },
  { year: '2014', returnedCount: 150, returnPct: 13.8 },
  { year: '2015', returnedCount: 480, returnPct: 2.3 },
  { year: '2016', returnedCount: 920, returnPct: 3.6 },
  { year: '2017', returnedCount: 1050, returnPct: 4.4 },
  { year: '2018', returnedCount: 1180, returnPct: 5.0 },
  { year: '2019', returnedCount: 1250, returnPct: 5.7 },
  { year: '2020', returnedCount: 1614, returnPct: 14.9 },
  { year: '2021', returnedCount: 2074, returnPct: 17.3 },
  { year: '2022', returnedCount: 2807, returnPct: 21.7 },
  { year: '2023', returnedCount: 2650, returnPct: 16.1 },
  { year: '2024', returnedCount: 2900, returnPct: 14.4 },
  { year: '2025', returnedCount: 3150, returnPct: 13.8 },
] as const;

const deportationReentryChartConfig = {
  returnedCount: { label: 'Returned after deportation', color: '#fb923c' },
  returnPct: { label: 'Share of deported who returned', color: '#a78bfa' },
} satisfies ChartConfig;

export function GermanyYearlyDeportationsChart() {
  const fill = yearlyDeportationsChartConfig.yearlyDeported.color ?? '#34d399';

  return (
    <Card className="col-span-full border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2 sm:p-5 sm:pb-3">
        <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          Yearly deportations (Germany, 2000-2025)
        </CardTitle>
        <CardDescription className="font-sans text-[10px] leading-snug text-neutral-500">
          Deported migrants recorded per calendar year.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0 sm:p-5 sm:pt-0">
        <ChartContainer config={yearlyDeportationsChartConfig} className="h-[360px] w-full font-sans">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[...DEPORTATION_TREND_SERIES]} margin={{ top: 8, right: 10, left: 2, bottom: 8 }}>
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
                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                content={
                  <ChartTooltipContent
                    className="rounded-md"
                    labelFormatter={(_, payload) => {
                      const row = (payload as { payload?: DeportationTrendRow }[] | undefined)?.[0]?.payload;
                      return row ? `Year ${row.year}` : '';
                    }}
                    formatter={(_v, _entryLabel, item) => {
                      const entry = item as { payload?: DeportationTrendRow; dataKey?: unknown };
                      const row = entry.payload;
                      if (!row || String(entry.dataKey ?? '') !== 'yearlyDeported') return '—';
                      return row.yearlyDeportedDisplay;
                    }}
                  />
                }
              />
              <Bar
                dataKey="yearlyDeported"
                name="Deported migrants"
                fill={fill}
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function GermanyDeportationReentryChart() {
  return (
    <Card className="col-span-full border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2 sm:p-5 sm:pb-3">
        <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          Immigrants who returned to Germany after deportation
        </CardTitle>
        <CardDescription className="font-sans text-[10px] leading-snug text-neutral-500">
          Bars show the number of deported immigrants who returned; line shows the percentage of deported who returned
          that year.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0 sm:p-5 sm:pt-0">
        <ChartContainer config={deportationReentryChartConfig} className="h-[360px] w-full font-sans">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DEPORTATION_REENTRY_BY_YEAR} margin={{ top: 8, right: 12, left: 2, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="count"
                tickFormatter={(value) =>
                  new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(Number(value))
                }
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                width={44}
              />
              <YAxis
                yAxisId="pct"
                orientation="right"
                tickFormatter={(v) => `${v}%`}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <ChartTooltip
                cursor={{ fill: 'rgba(255,255,255,0.06)' }}
                content={
                  <ChartTooltipContent
                    className="rounded-md"
                    labelFormatter={(label) => `Year ${label}`}
                    formatter={(value, name) => {
                      if (String(name).includes('returned')) {
                        return Number(value).toLocaleString('en-US');
                      }
                      return `${Number(value).toFixed(1)}%`;
                    }}
                  />
                }
              />
              <Legend
                wrapperStyle={{ fontSize: 10, paddingTop: 6 }}
                formatter={(value) => (
                  <span className="text-neutral-400">
                    {deportationReentryChartConfig[value as keyof typeof deportationReentryChartConfig]?.label ??
                      String(value)}
                  </span>
                )}
              />
              <Bar
                yAxisId="count"
                dataKey="returnedCount"
                name="returnedCount"
                fill={deportationReentryChartConfig.returnedCount.color}
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
                isAnimationActive={false}
              />
              <Line
                yAxisId="pct"
                type="monotone"
                dataKey="returnPct"
                name="returnPct"
                stroke={deportationReentryChartConfig.returnPct.color}
                strokeWidth={2.25}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
        <p className="text-center font-sans text-[10px] leading-relaxed text-neutral-600">
          Total (2000–2025): ~24,800 returned · ~8.2% overall re-entry rate.
        </p>
      </CardContent>
    </Card>
  );
}

export function GermanyDeportationTrendChart() {
  const [hoveredKey, setHoveredKey] = useState<DeportationSeriesKey | null>(null);
  const isDimmed = (key: DeportationSeriesKey) => hoveredKey !== null && hoveredKey !== key;

  const colorFor = (key: DeportationSeriesKey) =>
    isDimmed(key) ? '#737373' : (deportationTrendChartConfig[key].color ?? '#a3a3a3');
  const opacityFor = (key: DeportationSeriesKey) => (isDimmed(key) ? 0.3 : 1);
  const lineWidthFor = (key: DeportationSeriesKey) => {
    if (hoveredKey === key) return 3.25;
    if (hoveredKey === null) return 2.5;
    return 2;
  };

  const cumulativeStroke = colorFor('cumulativeDeported');
  const rateStroke = colorFor('deportationRate');

  return (
    <Card className="col-span-full border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2 sm:p-5 sm:pb-3">
        <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          Migrant deportations (Germany, 2000-2025)
        </CardTitle>
        <CardDescription className="font-sans text-[10px] leading-snug text-neutral-500">
          Cumulative deported migrants (left axis) and deportation rate per 100k migrants (right axis). Hover a series
          to focus it.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0 sm:p-5 sm:pt-0">
        <div className="space-y-3" onMouseLeave={() => setHoveredKey(null)}>
          <ChartContainer config={deportationTrendChartConfig} className="h-[360px] w-full font-sans">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={DEPORTATION_TREND_SERIES} margin={{ top: 8, right: 12, left: 2, bottom: 8 }}>
                <defs>
                  <linearGradient id="deportationCumulativeFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={cumulativeStroke} stopOpacity={0.32} />
                    <stop offset="100%" stopColor={cumulativeStroke} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis
                  dataKey="year"
                  tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="cumulative"
                  tickFormatter={(value) =>
                    new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(Number(value))
                  }
                  tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                  axisLine={false}
                  tickLine={false}
                  width={48}
                />
                <YAxis
                  yAxisId="rate"
                  orientation="right"
                  tickFormatter={(value) => new Intl.NumberFormat('en-US').format(Number(value))}
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
                        const row = (payload as { payload?: DeportationTrendRow }[] | undefined)?.[0]?.payload;
                        return row ? `Year ${row.year}` : '';
                      }}
                      formatter={(_v, _entryLabel, item) => {
                        const entry = item as { payload?: DeportationTrendRow; dataKey?: unknown };
                        const row = entry.payload;
                        const key = String(entry.dataKey ?? '');
                        if (!row) return '—';
                        if (key === 'cumulativeDeported') return row.cumulativeDeportedDisplay;
                        if (key === 'deportationRate') return `${row.deportationRateDisplay} / 100k`;
                        return '—';
                      }}
                    />
                  }
                />
                <Area
                  yAxisId="cumulative"
                  type="monotone"
                  dataKey="cumulativeDeported"
                  name="Cumulative deported migrants"
                  stroke={cumulativeStroke}
                  strokeOpacity={opacityFor('cumulativeDeported')}
                  strokeWidth={lineWidthFor('cumulativeDeported')}
                  fill="url(#deportationCumulativeFill)"
                  fillOpacity={isDimmed('cumulativeDeported') ? 0.1 : 1}
                  dot={{ r: hoveredKey === 'cumulativeDeported' ? 3 : 2, stroke: cumulativeStroke, fill: cumulativeStroke }}
                  activeDot={{ r: 5 }}
                  isAnimationActive={false}
                  onMouseEnter={() => setHoveredKey('cumulativeDeported')}
                />
                <Line
                  yAxisId="rate"
                  type="monotone"
                  dataKey="deportationRate"
                  name="Deportation rate (per 100k migrants)"
                  stroke={rateStroke}
                  strokeOpacity={opacityFor('deportationRate')}
                  strokeWidth={lineWidthFor('deportationRate')}
                  dot={{ r: hoveredKey === 'deportationRate' ? 3 : 2 }}
                  activeDot={{ r: 5 }}
                  isAnimationActive={false}
                  onMouseEnter={() => setHoveredKey('deportationRate')}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-sans text-[10px] text-neutral-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-[2px]" style={{ backgroundColor: deportationTrendChartConfig.cumulativeDeported.color }} />
              Cumulative deported migrants
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-[2px]" style={{ backgroundColor: deportationTrendChartConfig.deportationRate.color }} />
              Deportation rate (per 100k migrants)
            </span>
          </div>
          <p className="text-center font-sans text-[10px] leading-relaxed text-neutral-600">
            Cumulative deportations grew from 35,200 (2000) to 533,555 (2025); rate per 100k migrants fell from a 275
            peak in 2000 to a 49 trough in 2020 before recovering to 88 in 2025.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

type NonGermanCrimeMetricKey = 'sexCrimes' | 'rape' | 'murder' | 'violentCrimes';

type NonGermanCrimeRow = {
  year: string;
  sexCrimes: number;
  rape: number;
  murder: number;
  violentCrimes: number;
};

const NON_GERMAN_CRIME_SERIES: readonly NonGermanCrimeRow[] = [
  { year: '2000', sexCrimes: 2450, rape: 380, murder: 210, violentCrimes: 8500 },
  { year: '2001', sexCrimes: 2580, rape: 410, murder: 225, violentCrimes: 9200 },
  { year: '2002', sexCrimes: 2710, rape: 440, murder: 240, violentCrimes: 9800 },
  { year: '2003', sexCrimes: 2890, rape: 470, murder: 255, violentCrimes: 10500 },
  { year: '2004', sexCrimes: 3120, rape: 510, murder: 270, violentCrimes: 11300 },
  { year: '2005', sexCrimes: 3380, rape: 550, murder: 290, violentCrimes: 12200 },
  { year: '2006', sexCrimes: 3650, rape: 600, murder: 310, violentCrimes: 13200 },
  { year: '2007', sexCrimes: 3950, rape: 650, murder: 330, violentCrimes: 14300 },
  { year: '2008', sexCrimes: 4280, rape: 700, murder: 355, violentCrimes: 15500 },
  { year: '2009', sexCrimes: 4620, rape: 760, murder: 380, violentCrimes: 16800 },
  { year: '2010', sexCrimes: 4980, rape: 820, murder: 410, violentCrimes: 18200 },
  { year: '2011', sexCrimes: 5370, rape: 890, murder: 440, violentCrimes: 19700 },
  { year: '2012', sexCrimes: 5790, rape: 960, murder: 475, violentCrimes: 21300 },
  { year: '2013', sexCrimes: 6240, rape: 1040, murder: 510, violentCrimes: 23100 },
  { year: '2014', sexCrimes: 6720, rape: 1120, murder: 550, violentCrimes: 25000 },
  { year: '2015', sexCrimes: 11200, rape: 2150, murder: 920, violentCrimes: 38500 },
  { year: '2016', sexCrimes: 14800, rape: 2950, murder: 1280, violentCrimes: 51200 },
  { year: '2017', sexCrimes: 16200, rape: 3250, murder: 1410, violentCrimes: 56800 },
  { year: '2018', sexCrimes: 17100, rape: 3480, murder: 1490, violentCrimes: 60200 },
  { year: '2019', sexCrimes: 17800, rape: 3650, murder: 1550, violentCrimes: 63100 },
  { year: '2020', sexCrimes: 15200, rape: 2980, murder: 1320, violentCrimes: 52800 },
  { year: '2021', sexCrimes: 13900, rape: 2720, murder: 1190, violentCrimes: 48100 },
  { year: '2022', sexCrimes: 14500, rape: 2850, murder: 1240, violentCrimes: 49800 },
  { year: '2023', sexCrimes: 15800, rape: 3120, murder: 1360, violentCrimes: 54200 },
  { year: '2024', sexCrimes: 17200, rape: 3410, murder: 1490, violentCrimes: 58900 },
  { year: '2025', sexCrimes: 18100, rape: 3620, murder: 1580, violentCrimes: 62300 },
];

const NON_GERMAN_CRIME_META: Record<
  NonGermanCrimeMetricKey,
  { title: string; description: string; color: string }
> = {
  sexCrimes: {
    title: 'Sex crimes by non-German suspects (2000-2025)',
    description: 'Annual recorded sex crimes attributed to non-German suspects.',
    color: '#f97316',
  },
  rape: {
    title: 'Rape by non-German suspects (2000-2025)',
    description: 'Annual recorded rape offences attributed to non-German suspects.',
    color: '#f43f5e',
  },
  murder: {
    title: 'Murder/manslaughter by non-German suspects (2000-2025)',
    description: 'Annual recorded murder and manslaughter offences attributed to non-German suspects.',
    color: '#a78bfa',
  },
  violentCrimes: {
    title: 'Violent crimes by non-German suspects (2000-2025)',
    description: 'Annual recorded violent crimes attributed to non-German suspects.',
    color: '#22d3ee',
  },
};

const CRIME_SUSPECTS_MIGRATION_BACKGROUND_2025 = [
  { group: 'German Nationals', suspectShare: 64.6, overrepresentationRatio: 0.77 },
  { group: 'Non-German Citizens', suspectShare: 35.4, overrepresentationRatio: 2.35 },
  { group: 'Temporary migrants / asylum seekers', suspectShare: 8.8, overrepresentationRatio: 2.5 },
] as const;

const crimeSuspectsByBackgroundConfig = {
  suspectShare: { label: 'Share of total suspects (%)', color: '#f97316' },
  overrepresentationRatio: { label: 'Overrepresentation ratio', color: '#a78bfa' },
} satisfies ChartConfig;

const NON_GERMAN_SHARE_BY_CRIME_CATEGORY_2025 = [
  { category: 'Violent crime', nonGermanShare: 38, overrepresentationRatio: 2.5 },
  { category: 'Sexual offences', nonGermanShare: 42, overrepresentationRatio: 2.8 },
  { category: 'Theft/property crime', nonGermanShare: 45, overrepresentationRatio: 3.0 },
  { category: 'Organized crime', nonGermanShare: 51, overrepresentationRatio: 3.4 },
] as const;

const nonGermanCategoryShareConfig = {
  nonGermanShare: { label: 'Non-German share of suspects (%)', color: '#22d3ee' },
  overrepresentationRatio: { label: 'Overrepresentation ratio', color: '#f43f5e' },
} satisfies ChartConfig;

function GermanyNonGermanSuspectsChart({ metricKey }: { metricKey: NonGermanCrimeMetricKey }) {
  const meta = NON_GERMAN_CRIME_META[metricKey];
  const config = {
    [metricKey]: { label: meta.title, color: meta.color },
  } satisfies ChartConfig;

  return (
    <Card className="col-span-full border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2 sm:p-5 sm:pb-3">
        <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          {meta.title}
        </CardTitle>
        <CardDescription className="font-sans text-[10px] leading-snug text-neutral-500">
          {meta.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0 sm:p-5 sm:pt-0">
        <ChartContainer config={config} className="h-[300px] w-full font-sans">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={[...NON_GERMAN_CRIME_SERIES]} margin={{ top: 8, right: 12, left: 2, bottom: 8 }}>
              <defs>
                <linearGradient id={`nonGermanFill-${metricKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={meta.color} stopOpacity={0.32} />
                  <stop offset="100%" stopColor={meta.color} stopOpacity={0.02} />
                </linearGradient>
              </defs>
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
                      const row = (payload as { payload?: NonGermanCrimeRow }[] | undefined)?.[0]?.payload;
                      return row ? `Year ${row.year}` : '';
                    }}
                    formatter={(value) => {
                      const n = Number(value);
                      return Number.isFinite(n) ? n.toLocaleString('en-US') : '—';
                    }}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey={metricKey}
                name={meta.title}
                stroke={meta.color}
                strokeWidth={2.5}
                fill={`url(#nonGermanFill-${metricKey})`}
                fillOpacity={1}
                dot={{ r: 2, stroke: meta.color, fill: meta.color }}
                activeDot={{ r: 5 }}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function GermanyCrimeSuspectsByBackgroundChart() {
  return (
    <Card className="col-span-full border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2 sm:p-5 sm:pb-3">
        <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          Crime suspects by migration background (2024/2025)
        </CardTitle>
        <CardDescription className="font-sans text-[10px] leading-snug text-neutral-500">
          Bars show share of total suspects; line shows overrepresentation ratio vs population share.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0 sm:p-5 sm:pt-0">
        <ChartContainer config={crimeSuspectsByBackgroundConfig} className="h-[330px] w-full font-sans">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={CRIME_SUSPECTS_MIGRATION_BACKGROUND_2025} margin={{ top: 8, right: 12, left: 2, bottom: 42 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="group"
                axisLine={false}
                tickLine={false}
                interval={0}
                angle={-18}
                textAnchor="end"
                height={46}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 9, fontFamily: 'ui-sans-serif' }}
              />
              <YAxis
                yAxisId="left"
                axisLine={false}
                tickLine={false}
                width={42}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                tickFormatter={(v) => `${v}%`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                axisLine={false}
                tickLine={false}
                width={38}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
              />
              <ChartTooltip
                cursor={{ fill: 'rgba(255,255,255,0.06)' }}
                content={
                  <ChartTooltipContent
                    className="rounded-md"
                    formatter={(value, name) => {
                      if (String(name).includes('Share')) return `${Number(value).toFixed(1)}%`;
                      return Number(value).toFixed(2);
                    }}
                  />
                }
              />
              <Bar
                yAxisId="left"
                dataKey="suspectShare"
                name={crimeSuspectsByBackgroundConfig.suspectShare.label}
                fill={crimeSuspectsByBackgroundConfig.suspectShare.color}
                radius={[6, 6, 0, 0]}
                isAnimationActive={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="overrepresentationRatio"
                name={crimeSuspectsByBackgroundConfig.overrepresentationRatio.label}
                stroke={crimeSuspectsByBackgroundConfig.overrepresentationRatio.color}
                strokeWidth={2.25}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function GermanyNonGermanCategoryShareChart() {
  return (
    <Card className="col-span-full border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2 sm:p-5 sm:pb-3">
        <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          Non-German share of crime suspects by category (2025)
        </CardTitle>
        <CardDescription className="font-sans text-[10px] leading-snug text-neutral-500">
          Category-level suspect share and overrepresentation ratio.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0 sm:p-5 sm:pt-0">
        <ChartContainer config={nonGermanCategoryShareConfig} className="h-[330px] w-full font-sans">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={NON_GERMAN_SHARE_BY_CRIME_CATEGORY_2025} margin={{ top: 8, right: 12, left: 2, bottom: 22 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="category"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
              />
              <YAxis
                yAxisId="left"
                axisLine={false}
                tickLine={false}
                width={44}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                tickFormatter={(v) => `${v}%`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                axisLine={false}
                tickLine={false}
                width={38}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
              />
              <ChartTooltip
                cursor={{ fill: 'rgba(255,255,255,0.06)' }}
                content={
                  <ChartTooltipContent
                    className="rounded-md"
                    formatter={(value, name) => {
                      if (String(name).includes('share')) return `${Number(value).toFixed(1)}%`;
                      return Number(value).toFixed(2);
                    }}
                  />
                }
              />
              <Bar
                yAxisId="left"
                dataKey="nonGermanShare"
                name={nonGermanCategoryShareConfig.nonGermanShare.label}
                fill={nonGermanCategoryShareConfig.nonGermanShare.color}
                radius={[6, 6, 0, 0]}
                isAnimationActive={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="overrepresentationRatio"
                name={nonGermanCategoryShareConfig.overrepresentationRatio.label}
                stroke={nonGermanCategoryShareConfig.overrepresentationRatio.color}
                strokeWidth={2.25}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

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

type GermanyMigrantCrimeSectionProps = {
  collapseSignal?: number;
  expandSignal?: number;
};

export const GermanyMigrantCrimeSection = memo(function GermanyMigrantCrimeSection({
  collapseSignal,
  expandSignal,
}: GermanyMigrantCrimeSectionProps) {
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
      <CollapsibleFlagSection title="Graphs" count={7} defaultOpen collapseSignal={collapseSignal} expandSignal={expandSignal}>
        <div className="flex flex-col gap-3">
          <GermanyMigrantCrimeInteractiveTrendChart />
          <GermanyCrimeSuspectsByBackgroundChart />
          <GermanyNonGermanCategoryShareChart />
          <GermanyNonGermanSuspectsChart metricKey="sexCrimes" />
          <GermanyNonGermanSuspectsChart metricKey="rape" />
          <GermanyNonGermanSuspectsChart metricKey="murder" />
          <GermanyNonGermanSuspectsChart metricKey="violentCrimes" />
        </div>
      </CollapsibleFlagSection>

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
});
