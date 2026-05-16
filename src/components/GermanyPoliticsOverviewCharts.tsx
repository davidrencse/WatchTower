import { memo } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from './ui/chart';

export const GERMANY_POLITICS_OVERVIEW_CHART_COUNT = 2;

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

const LEFT_RIGHT_BY_GENDER_CONFIG = {
  womenLeftistPct: { label: 'Women — leftist', color: '#f472b6' },
  menLeftistPct: { label: 'Men — leftist', color: '#fb923c' },
  womenRightWingPct: { label: 'Women — right-wing', color: '#60a5fa' },
  menRightWingPct: { label: 'Men — right-wing', color: '#818cf8' },
} satisfies ChartConfig;

const ISRAEL_SUPPORT_BY_GENDER_CONFIG = {
  menSupportIsraelPct: { label: 'Men — support Israel', color: '#22c55e' },
  womenSupportIsraelPct: { label: 'Women — support Israel', color: '#f97316' },
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

export const GermanyPoliticsOverviewCharts = memo(function GermanyPoliticsOverviewCharts() {
  return (
    <div className="flex flex-col gap-4">
      <LeftRightByGenderChart />
      <IsraelSupportByGenderChart />
    </div>
  );
});
