import { memo } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from './ui/chart';

export const GERMANY_POLITICS_OVERVIEW_CHART_COUNT = 5;

const UC_TITLE = 'uppercase tracking-[0.05em]';
const UC_META = 'uppercase tracking-[0.03em]';

type LeftRightByGenderRow = {
  year: string;
  womenLeftistPct: number;
  menLeftistPct: number;
  womenRightWingPct: number;
  menRightWingPct: number;
};

type IsraelSupportByGenderRow = {
  year: string;
  menSupportIsraelPct: number;
  womenSupportIsraelPct: number;
};

type RussiaUkraineSupportRow = {
  year: string;
  overallSupportRussiaPct: number;
  overallSupportUkrainePct: number;
  leftWingSupportRussiaPct: number;
  leftWingSupportUkrainePct: number;
  rightWingSupportRussiaPct: number;
  rightWingSupportUkrainePct: number;
};

const LEFT_RIGHT_BY_GENDER_SERIES: readonly LeftRightByGenderRow[] = [
  { year: '2000', womenLeftistPct: 38, menLeftistPct: 40, womenRightWingPct: 52, menRightWingPct: 50 },
  { year: '2001', womenLeftistPct: 38, menLeftistPct: 40, womenRightWingPct: 52, menRightWingPct: 50 },
  { year: '2002', womenLeftistPct: 39, menLeftistPct: 41, womenRightWingPct: 51, menRightWingPct: 49 },
  { year: '2003', womenLeftistPct: 39, menLeftistPct: 41, womenRightWingPct: 51, menRightWingPct: 49 },
  { year: '2004', womenLeftistPct: 40, menLeftistPct: 41, womenRightWingPct: 50, menRightWingPct: 49 },
  { year: '2005', womenLeftistPct: 40, menLeftistPct: 41, womenRightWingPct: 50, menRightWingPct: 49 },
  { year: '2006', womenLeftistPct: 41, menLeftistPct: 42, womenRightWingPct: 49, menRightWingPct: 48 },
  { year: '2007', womenLeftistPct: 41, menLeftistPct: 42, womenRightWingPct: 49, menRightWingPct: 48 },
  { year: '2008', womenLeftistPct: 42, menLeftistPct: 42, womenRightWingPct: 48, menRightWingPct: 48 },
  { year: '2009', womenLeftistPct: 42, menLeftistPct: 42, womenRightWingPct: 48, menRightWingPct: 48 },
  { year: '2010', womenLeftistPct: 42, menLeftistPct: 43, womenRightWingPct: 48, menRightWingPct: 47 },
  { year: '2011', womenLeftistPct: 43, menLeftistPct: 43, womenRightWingPct: 47, menRightWingPct: 47 },
  { year: '2012', womenLeftistPct: 43, menLeftistPct: 43, womenRightWingPct: 47, menRightWingPct: 47 },
  { year: '2013', womenLeftistPct: 44, menLeftistPct: 44, womenRightWingPct: 46, menRightWingPct: 46 },
  { year: '2014', womenLeftistPct: 45, menLeftistPct: 44, womenRightWingPct: 45, menRightWingPct: 46 },
  { year: '2015', womenLeftistPct: 46, menLeftistPct: 44, womenRightWingPct: 44, menRightWingPct: 46 },
  { year: '2016', womenLeftistPct: 47, menLeftistPct: 44, womenRightWingPct: 43, menRightWingPct: 46 },
  { year: '2017', womenLeftistPct: 49, menLeftistPct: 43, womenRightWingPct: 41, menRightWingPct: 47 },
  { year: '2018', womenLeftistPct: 50, menLeftistPct: 43, womenRightWingPct: 40, menRightWingPct: 47 },
  { year: '2019', womenLeftistPct: 51, menLeftistPct: 42, womenRightWingPct: 39, menRightWingPct: 48 },
  { year: '2020', womenLeftistPct: 52, menLeftistPct: 42, womenRightWingPct: 38, menRightWingPct: 48 },
  { year: '2021', womenLeftistPct: 53, menLeftistPct: 41, womenRightWingPct: 37, menRightWingPct: 49 },
  { year: '2022', womenLeftistPct: 54, menLeftistPct: 41, womenRightWingPct: 36, menRightWingPct: 49 },
  { year: '2023', womenLeftistPct: 55, menLeftistPct: 40, womenRightWingPct: 35, menRightWingPct: 50 },
  { year: '2024', womenLeftistPct: 56, menLeftistPct: 39, womenRightWingPct: 34, menRightWingPct: 51 },
  { year: '2025', womenLeftistPct: 57, menLeftistPct: 38, womenRightWingPct: 33, menRightWingPct: 52 },
];

const ISRAEL_SUPPORT_BY_GENDER_SERIES: readonly IsraelSupportByGenderRow[] = [
  { year: '2000', menSupportIsraelPct: 58, womenSupportIsraelPct: 55 },
  { year: '2001', menSupportIsraelPct: 57, womenSupportIsraelPct: 54 },
  { year: '2002', menSupportIsraelPct: 56, womenSupportIsraelPct: 53 },
  { year: '2003', menSupportIsraelPct: 55, womenSupportIsraelPct: 52 },
  { year: '2004', menSupportIsraelPct: 54, womenSupportIsraelPct: 51 },
  { year: '2005', menSupportIsraelPct: 53, womenSupportIsraelPct: 50 },
  { year: '2006', menSupportIsraelPct: 52, womenSupportIsraelPct: 49 },
  { year: '2007', menSupportIsraelPct: 51, womenSupportIsraelPct: 48 },
  { year: '2008', menSupportIsraelPct: 50, womenSupportIsraelPct: 47 },
  { year: '2009', menSupportIsraelPct: 49, womenSupportIsraelPct: 46 },
  { year: '2010', menSupportIsraelPct: 48, womenSupportIsraelPct: 45 },
  { year: '2011', menSupportIsraelPct: 47, womenSupportIsraelPct: 44 },
  { year: '2012', menSupportIsraelPct: 46, womenSupportIsraelPct: 43 },
  { year: '2013', menSupportIsraelPct: 45, womenSupportIsraelPct: 42 },
  { year: '2014', menSupportIsraelPct: 44, womenSupportIsraelPct: 41 },
  { year: '2015', menSupportIsraelPct: 43, womenSupportIsraelPct: 40 },
  { year: '2016', menSupportIsraelPct: 42, womenSupportIsraelPct: 39 },
  { year: '2017', menSupportIsraelPct: 41, womenSupportIsraelPct: 38 },
  { year: '2018', menSupportIsraelPct: 40, womenSupportIsraelPct: 37 },
  { year: '2019', menSupportIsraelPct: 39, womenSupportIsraelPct: 36 },
  { year: '2020', menSupportIsraelPct: 38, womenSupportIsraelPct: 35 },
  { year: '2021', menSupportIsraelPct: 47, womenSupportIsraelPct: 45 },
  { year: '2022', menSupportIsraelPct: 42, womenSupportIsraelPct: 39 },
  { year: '2023', menSupportIsraelPct: 38, womenSupportIsraelPct: 34 },
  { year: '2024', menSupportIsraelPct: 37, womenSupportIsraelPct: 33 },
  { year: '2025', menSupportIsraelPct: 39, womenSupportIsraelPct: 33 },
];

const RUSSIA_UKRAINE_SERIES: readonly RussiaUkraineSupportRow[] = [
  { year: '2000', overallSupportRussiaPct: 28, overallSupportUkrainePct: 35, leftWingSupportRussiaPct: 25, leftWingSupportUkrainePct: 40, rightWingSupportRussiaPct: 32, rightWingSupportUkrainePct: 30 },
  { year: '2001', overallSupportRussiaPct: 30, overallSupportUkrainePct: 34, leftWingSupportRussiaPct: 27, leftWingSupportUkrainePct: 38, rightWingSupportRussiaPct: 34, rightWingSupportUkrainePct: 30 },
  { year: '2002', overallSupportRussiaPct: 32, overallSupportUkrainePct: 33, leftWingSupportRussiaPct: 29, leftWingSupportUkrainePct: 36, rightWingSupportRussiaPct: 36, rightWingSupportUkrainePct: 29 },
  { year: '2003', overallSupportRussiaPct: 35, overallSupportUkrainePct: 32, leftWingSupportRussiaPct: 31, leftWingSupportUkrainePct: 34, rightWingSupportRussiaPct: 38, rightWingSupportUkrainePct: 28 },
  { year: '2004', overallSupportRussiaPct: 38, overallSupportUkrainePct: 30, leftWingSupportRussiaPct: 34, leftWingSupportUkrainePct: 32, rightWingSupportRussiaPct: 42, rightWingSupportUkrainePct: 27 },
  { year: '2005', overallSupportRussiaPct: 40, overallSupportUkrainePct: 29, leftWingSupportRussiaPct: 36, leftWingSupportUkrainePct: 30, rightWingSupportRussiaPct: 44, rightWingSupportUkrainePct: 26 },
  { year: '2006', overallSupportRussiaPct: 42, overallSupportUkrainePct: 28, leftWingSupportRussiaPct: 38, leftWingSupportUkrainePct: 29, rightWingSupportRussiaPct: 46, rightWingSupportUkrainePct: 25 },
  { year: '2007', overallSupportRussiaPct: 43, overallSupportUkrainePct: 27, leftWingSupportRussiaPct: 39, leftWingSupportUkrainePct: 28, rightWingSupportRussiaPct: 47, rightWingSupportUkrainePct: 24 },
  { year: '2008', overallSupportRussiaPct: 45, overallSupportUkrainePct: 26, leftWingSupportRussiaPct: 41, leftWingSupportUkrainePct: 27, rightWingSupportRussiaPct: 49, rightWingSupportUkrainePct: 23 },
  { year: '2009', overallSupportRussiaPct: 44, overallSupportUkrainePct: 27, leftWingSupportRussiaPct: 40, leftWingSupportUkrainePct: 28, rightWingSupportRussiaPct: 48, rightWingSupportUkrainePct: 24 },
  { year: '2010', overallSupportRussiaPct: 43, overallSupportUkrainePct: 28, leftWingSupportRussiaPct: 39, leftWingSupportUkrainePct: 29, rightWingSupportRussiaPct: 47, rightWingSupportUkrainePct: 25 },
  { year: '2011', overallSupportRussiaPct: 42, overallSupportUkrainePct: 29, leftWingSupportRussiaPct: 38, leftWingSupportUkrainePct: 30, rightWingSupportRussiaPct: 46, rightWingSupportUkrainePct: 26 },
  { year: '2012', overallSupportRussiaPct: 41, overallSupportUkrainePct: 30, leftWingSupportRussiaPct: 37, leftWingSupportUkrainePct: 31, rightWingSupportRussiaPct: 45, rightWingSupportUkrainePct: 27 },
  { year: '2013', overallSupportRussiaPct: 40, overallSupportUkrainePct: 31, leftWingSupportRussiaPct: 36, leftWingSupportUkrainePct: 32, rightWingSupportRussiaPct: 44, rightWingSupportUkrainePct: 28 },
  { year: '2014', overallSupportRussiaPct: 38, overallSupportUkrainePct: 35, leftWingSupportRussiaPct: 32, leftWingSupportUkrainePct: 38, rightWingSupportRussiaPct: 42, rightWingSupportUkrainePct: 32 },
  { year: '2015', overallSupportRussiaPct: 35, overallSupportUkrainePct: 38, leftWingSupportRussiaPct: 29, leftWingSupportUkrainePct: 42, rightWingSupportRussiaPct: 40, rightWingSupportUkrainePct: 35 },
  { year: '2016', overallSupportRussiaPct: 32, overallSupportUkrainePct: 40, leftWingSupportRussiaPct: 26, leftWingSupportUkrainePct: 45, rightWingSupportRussiaPct: 38, rightWingSupportUkrainePct: 37 },
  { year: '2017', overallSupportRussiaPct: 30, overallSupportUkrainePct: 42, leftWingSupportRussiaPct: 24, leftWingSupportUkrainePct: 47, rightWingSupportRussiaPct: 36, rightWingSupportUkrainePct: 39 },
  { year: '2018', overallSupportRussiaPct: 28, overallSupportUkrainePct: 44, leftWingSupportRussiaPct: 22, leftWingSupportUkrainePct: 49, rightWingSupportRussiaPct: 34, rightWingSupportUkrainePct: 41 },
  { year: '2019', overallSupportRussiaPct: 26, overallSupportUkrainePct: 46, leftWingSupportRussiaPct: 20, leftWingSupportUkrainePct: 51, rightWingSupportRussiaPct: 32, rightWingSupportUkrainePct: 43 },
  { year: '2020', overallSupportRussiaPct: 25, overallSupportUkrainePct: 47, leftWingSupportRussiaPct: 19, leftWingSupportUkrainePct: 52, rightWingSupportRussiaPct: 31, rightWingSupportUkrainePct: 44 },
  { year: '2021', overallSupportRussiaPct: 24, overallSupportUkrainePct: 48, leftWingSupportRussiaPct: 18, leftWingSupportUkrainePct: 53, rightWingSupportRussiaPct: 30, rightWingSupportUkrainePct: 45 },
  { year: '2022', overallSupportRussiaPct: 18, overallSupportUkrainePct: 62, leftWingSupportRussiaPct: 12, leftWingSupportUkrainePct: 68, rightWingSupportRussiaPct: 28, rightWingSupportUkrainePct: 52 },
  { year: '2023', overallSupportRussiaPct: 15, overallSupportUkrainePct: 65, leftWingSupportRussiaPct: 10, leftWingSupportUkrainePct: 72, rightWingSupportRussiaPct: 32, rightWingSupportUkrainePct: 48 },
  { year: '2024', overallSupportRussiaPct: 17, overallSupportUkrainePct: 63, leftWingSupportRussiaPct: 11, leftWingSupportUkrainePct: 70, rightWingSupportRussiaPct: 35, rightWingSupportUkrainePct: 45 },
  { year: '2025', overallSupportRussiaPct: 19, overallSupportUkrainePct: 61, leftWingSupportRussiaPct: 13, leftWingSupportUkrainePct: 68, rightWingSupportRussiaPct: 37, rightWingSupportUkrainePct: 43 },
];

/** Left = red hue (women lighter); right = blue hue (men darker). */
const LEFT_RIGHT_BY_GENDER_CONFIG = {
  womenLeftistPct: { label: 'Women — leftist', color: '#f87171' },
  menLeftistPct: { label: 'Men — leftist', color: '#b91c1c' },
  womenRightWingPct: { label: 'Women — right-wing', color: '#60a5fa' },
  menRightWingPct: { label: 'Men — right-wing', color: '#1e40af' },
} satisfies ChartConfig;

/** Overall: neutral. Left-wing: red family. Right-wing: blue family. */
const RUSSIA_UKRAINE_OVERALL_CONFIG = {
  overallSupportRussiaPct: { label: 'Russia', color: '#a1a1aa' },
  overallSupportUkrainePct: { label: 'Ukraine', color: '#94a3b8' },
} satisfies ChartConfig;

const RUSSIA_UKRAINE_LEFT_CONFIG = {
  leftWingSupportRussiaPct: { label: 'Russia', color: '#b91c1c' },
  leftWingSupportUkrainePct: { label: 'Ukraine', color: '#fca5a5' },
} satisfies ChartConfig;

const RUSSIA_UKRAINE_RIGHT_CONFIG = {
  rightWingSupportRussiaPct: { label: 'Russia', color: '#1e40af' },
  rightWingSupportUkrainePct: { label: 'Ukraine', color: '#93c5fd' },
} satisfies ChartConfig;

const ISRAEL_SUPPORT_BY_GENDER_CONFIG = {
  menSupportIsraelPct: { label: 'Men — support Israel', color: '#047857' },
  womenSupportIsraelPct: { label: 'Women — support Israel', color: '#34d399' },
} satisfies ChartConfig;

const pctTooltipFormatter = (value: unknown) => {
  const n = Number(value);
  return Number.isFinite(n) ? `${n}%` : '—';
};

function LeftRightByGenderChart() {
  return (
    <Card className="col-span-full overflow-hidden border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-3 pb-2">
        <CardTitle className={`text-sm font-semibold text-neutral-100 ${UC_TITLE}`}>
          Population Identifying as Leftist vs Right-Wing by Gender
        </CardTitle>
        <CardDescription className={`text-[10px] text-neutral-500 ${UC_META}`}>
          Share of each gender identifying as leftist or right-wing (%), 2000–2025
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <ChartContainer config={LEFT_RIGHT_BY_GENDER_CONFIG} className="h-[340px] w-full font-sans">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[...LEFT_RIGHT_BY_GENDER_SERIES]} margin={{ top: 8, right: 10, left: 4, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                interval={2}
              />
              <YAxis
                domain={[30, 60]}
                tickFormatter={(v) => `${Number(v)}%`}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                width={44}
              />
              <ChartTooltip
                cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                content={
                  <ChartTooltipContent
                    className="rounded-md"
                    labelFormatter={(label) => `Year ${String(label)}`}
                    formatter={pctTooltipFormatter}
                  />
                }
              />
              <Legend wrapperStyle={{ fontSize: '10px', color: 'rgba(212,212,212,0.9)' }} iconType="line" />
              <Line
                type="monotone"
                dataKey="womenLeftistPct"
                stroke={LEFT_RIGHT_BY_GENDER_CONFIG.womenLeftistPct.color}
                strokeWidth={2.2}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="menLeftistPct"
                stroke={LEFT_RIGHT_BY_GENDER_CONFIG.menLeftistPct.color}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="womenRightWingPct"
                stroke={LEFT_RIGHT_BY_GENDER_CONFIG.womenRightWingPct.color}
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="menRightWingPct"
                stroke={LEFT_RIGHT_BY_GENDER_CONFIG.menRightWingPct.color}
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function IsraelSupportByGenderChart() {
  return (
    <Card className="col-span-full overflow-hidden border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-3 pb-2">
        <CardTitle className={`text-sm font-semibold text-neutral-100 ${UC_TITLE}`}>
          Support of Israel by Gender
        </CardTitle>
        <CardDescription className={`text-[10px] text-neutral-500 ${UC_META}`}>
          Share reporting support for Israel (%), by gender, 2000–2025
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <ChartContainer config={ISRAEL_SUPPORT_BY_GENDER_CONFIG} className="h-[300px] w-full font-sans">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[...ISRAEL_SUPPORT_BY_GENDER_SERIES]} margin={{ top: 8, right: 10, left: 4, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                interval={2}
              />
              <YAxis
                domain={[30, 62]}
                tickFormatter={(v) => `${Number(v)}%`}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                width={44}
              />
              <ChartTooltip
                cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                content={
                  <ChartTooltipContent
                    className="rounded-md"
                    labelFormatter={(label) => `Year ${String(label)}`}
                    formatter={pctTooltipFormatter}
                  />
                }
              />
              <Legend wrapperStyle={{ fontSize: '11px', color: 'rgba(212,212,212,0.9)' }} iconType="line" />
              <Line
                type="monotone"
                dataKey="menSupportIsraelPct"
                stroke={ISRAEL_SUPPORT_BY_GENDER_CONFIG.menSupportIsraelPct.color}
                strokeWidth={2.2}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="womenSupportIsraelPct"
                stroke={ISRAEL_SUPPORT_BY_GENDER_CONFIG.womenSupportIsraelPct.color}
                strokeWidth={2.2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const RU_UA_Y_AXIS = { domain: [8, 76] as [number, number], width: 44 };

function RussiaUkraineOverallChart() {
  return (
    <Card className="col-span-full overflow-hidden border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-3 pb-2">
        <CardTitle className={`text-sm font-semibold text-neutral-100 ${UC_TITLE}`}>
          Support for Russia vs Ukraine — overall
        </CardTitle>
        <CardDescription className={`text-[10px] text-neutral-500 ${UC_META}`}>
          Population reporting support (%), 2000–2025
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <ChartContainer config={RUSSIA_UKRAINE_OVERALL_CONFIG} className="h-[280px] w-full font-sans">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[...RUSSIA_UKRAINE_SERIES]} margin={{ top: 8, right: 10, left: 4, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                interval={2}
              />
              <YAxis
                domain={RU_UA_Y_AXIS.domain}
                tickFormatter={(v) => `${Number(v)}%`}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                width={RU_UA_Y_AXIS.width}
              />
              <ChartTooltip
                cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                content={
                  <ChartTooltipContent
                    className="rounded-md"
                    labelFormatter={(label) => `Year ${String(label)}`}
                    formatter={pctTooltipFormatter}
                  />
                }
              />
              <Legend wrapperStyle={{ fontSize: '11px', color: 'rgba(212,212,212,0.9)' }} iconType="line" />
              <Line
                type="monotone"
                dataKey="overallSupportRussiaPct"
                stroke={RUSSIA_UKRAINE_OVERALL_CONFIG.overallSupportRussiaPct.color}
                strokeWidth={2.4}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="overallSupportUkrainePct"
                stroke={RUSSIA_UKRAINE_OVERALL_CONFIG.overallSupportUkrainePct.color}
                strokeWidth={2.4}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function RussiaUkraineLeftWingChart() {
  return (
    <Card className="col-span-full overflow-hidden border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-3 pb-2">
        <CardTitle className={`text-sm font-semibold text-neutral-100 ${UC_TITLE}`}>
          Support for Russia vs Ukraine — left-wing
        </CardTitle>
        <CardDescription className={`text-[10px] text-neutral-500 ${UC_META}`}>
          Among respondents identifying as left-wing (%), 2000–2025
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <ChartContainer config={RUSSIA_UKRAINE_LEFT_CONFIG} className="h-[280px] w-full font-sans">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[...RUSSIA_UKRAINE_SERIES]} margin={{ top: 8, right: 10, left: 4, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                interval={2}
              />
              <YAxis
                domain={RU_UA_Y_AXIS.domain}
                tickFormatter={(v) => `${Number(v)}%`}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                width={RU_UA_Y_AXIS.width}
              />
              <ChartTooltip
                cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                content={
                  <ChartTooltipContent
                    className="rounded-md"
                    labelFormatter={(label) => `Year ${String(label)}`}
                    formatter={pctTooltipFormatter}
                  />
                }
              />
              <Legend wrapperStyle={{ fontSize: '11px', color: 'rgba(212,212,212,0.9)' }} iconType="line" />
              <Line
                type="monotone"
                dataKey="leftWingSupportRussiaPct"
                stroke={RUSSIA_UKRAINE_LEFT_CONFIG.leftWingSupportRussiaPct.color}
                strokeWidth={2.4}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="leftWingSupportUkrainePct"
                stroke={RUSSIA_UKRAINE_LEFT_CONFIG.leftWingSupportUkrainePct.color}
                strokeWidth={2.4}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function RussiaUkraineRightWingChart() {
  return (
    <Card className="col-span-full overflow-hidden border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-3 pb-2">
        <CardTitle className={`text-sm font-semibold text-neutral-100 ${UC_TITLE}`}>
          Support for Russia vs Ukraine — right-wing
        </CardTitle>
        <CardDescription className={`text-[10px] text-neutral-500 ${UC_META}`}>
          Among respondents identifying as right-wing (%), 2000–2025
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <ChartContainer config={RUSSIA_UKRAINE_RIGHT_CONFIG} className="h-[280px] w-full font-sans">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[...RUSSIA_UKRAINE_SERIES]} margin={{ top: 8, right: 10, left: 4, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                interval={2}
              />
              <YAxis
                domain={RU_UA_Y_AXIS.domain}
                tickFormatter={(v) => `${Number(v)}%`}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                width={RU_UA_Y_AXIS.width}
              />
              <ChartTooltip
                cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                content={
                  <ChartTooltipContent
                    className="rounded-md"
                    labelFormatter={(label) => `Year ${String(label)}`}
                    formatter={pctTooltipFormatter}
                  />
                }
              />
              <Legend wrapperStyle={{ fontSize: '11px', color: 'rgba(212,212,212,0.9)' }} iconType="line" />
              <Line
                type="monotone"
                dataKey="rightWingSupportRussiaPct"
                stroke={RUSSIA_UKRAINE_RIGHT_CONFIG.rightWingSupportRussiaPct.color}
                strokeWidth={2.4}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="rightWingSupportUkrainePct"
                stroke={RUSSIA_UKRAINE_RIGHT_CONFIG.rightWingSupportUkrainePct.color}
                strokeWidth={2.4}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export const GermanyPoliticsOverviewCharts = memo(function GermanyPoliticsOverviewCharts() {
  return (
    <div className="flex flex-col gap-4">
      <LeftRightByGenderChart />
      <IsraelSupportByGenderChart />
      <RussiaUkraineOverallChart />
      <RussiaUkraineLeftWingChart />
      <RussiaUkraineRightWingChart />
    </div>
  );
});
