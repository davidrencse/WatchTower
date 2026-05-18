import { Fragment, memo, useEffect, useMemo, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import germanyGovernmentCsvRaw from '../../Assets/Data/Europe/Germany/Government Section/germany_government_politics.csv?raw';
import germanyLaborStatsCsvRaw from '../../Assets/Data/Europe/Germany/germany_labor_statistics.csv?raw';
import {
  clusterRowsByMetric,
  laborIncomeDistributionRows,
  parseGermanyGovernmentPoliticsCsv,
} from '../lib/germanyGovernmentPolitics';
import {
  laborStatisticsClusteredGroups,
  parseGermanyLaborStatisticsCsv,
} from '../lib/germanyLaborStatistics';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { GOV_POLITICS_CARD_GRID, renderMetricGroup } from './GermanyGovernmentPoliticsBlocks';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from './ui/chart';
import { GermanyImmigrantBenefitsSection } from './GermanyImmigrantBenefitsSection';

const GOV_CSV_URL = '/data/germany_government_politics.csv';
const LABOR_STATS_CSV_URL = '/data/germany_labor_statistics.csv';

/** One row, left → right: Minimum wage, Long-term unemployment, Average annual hours. */
const LABOR_TRIPLE_ROW_METRICS = [
  'Minimum wage',
  'Long-term unemployment rate',
  'Average annual working hours per worker',
] as const;

type NationalityIncomePoint = {
  year: number;
  germanNative: number;
  turkish: number;
  polish: number;
  italian: number;
  romanian: number;
  syrian: number;
  russian: number;
  ukrainian: number;
  afghan: number;
  moroccan: number;
  indian: number;
};

const MEDIAN_MONTHLY_NET_INCOME_BY_NATIONALITY: NationalityIncomePoint[] = [
  { year: 2000, germanNative: 2250, turkish: 1480, polish: 1720, italian: 2050, romanian: 1580, syrian: 1320, russian: 1680, ukrainian: 1450, afghan: 1180, moroccan: 1400, indian: 1950 },
  { year: 2001, germanNative: 2280, turkish: 1500, polish: 1750, italian: 2080, romanian: 1610, syrian: 1340, russian: 1700, ukrainian: 1470, afghan: 1200, moroccan: 1420, indian: 1980 },
  { year: 2002, germanNative: 2310, turkish: 1520, polish: 1780, italian: 2110, romanian: 1640, syrian: 1360, russian: 1720, ukrainian: 1490, afghan: 1220, moroccan: 1440, indian: 2010 },
  { year: 2003, germanNative: 2340, turkish: 1540, polish: 1810, italian: 2140, romanian: 1670, syrian: 1380, russian: 1740, ukrainian: 1510, afghan: 1240, moroccan: 1460, indian: 2040 },
  { year: 2004, germanNative: 2380, turkish: 1570, polish: 1850, italian: 2180, romanian: 1710, syrian: 1410, russian: 1770, ukrainian: 1540, afghan: 1270, moroccan: 1490, indian: 2080 },
  { year: 2005, germanNative: 2420, turkish: 1600, polish: 1890, italian: 2220, romanian: 1750, syrian: 1440, russian: 1800, ukrainian: 1570, afghan: 1300, moroccan: 1520, indian: 2120 },
  { year: 2006, germanNative: 2470, turkish: 1640, polish: 1940, italian: 2270, romanian: 1800, syrian: 1480, russian: 1840, ukrainian: 1610, afghan: 1340, moroccan: 1560, indian: 2180 },
  { year: 2007, germanNative: 2530, turkish: 1690, polish: 2000, italian: 2330, romanian: 1860, syrian: 1530, russian: 1890, ukrainian: 1660, afghan: 1390, moroccan: 1610, indian: 2250 },
  { year: 2008, germanNative: 2590, turkish: 1740, polish: 2060, italian: 2390, romanian: 1920, syrian: 1580, russian: 1940, ukrainian: 1710, afghan: 1440, moroccan: 1660, indian: 2320 },
  { year: 2009, germanNative: 2630, turkish: 1770, polish: 2100, italian: 2430, romanian: 1960, syrian: 1610, russian: 1970, ukrainian: 1740, afghan: 1470, moroccan: 1690, indian: 2360 },
  { year: 2010, germanNative: 2680, turkish: 1810, polish: 2150, italian: 2480, romanian: 2010, syrian: 1650, russian: 2010, ukrainian: 1780, afghan: 1510, moroccan: 1730, indian: 2410 },
  { year: 2011, germanNative: 2740, turkish: 1850, polish: 2200, italian: 2530, romanian: 2060, syrian: 1690, russian: 2050, ukrainian: 1820, afghan: 1550, moroccan: 1770, indian: 2470 },
  { year: 2012, germanNative: 2800, turkish: 1900, polish: 2260, italian: 2590, romanian: 2120, syrian: 1740, russian: 2100, ukrainian: 1870, afghan: 1600, moroccan: 1820, indian: 2530 },
  { year: 2013, germanNative: 2860, turkish: 1950, polish: 2320, italian: 2650, romanian: 2180, syrian: 1790, russian: 2150, ukrainian: 1920, afghan: 1650, moroccan: 1870, indian: 2590 },
  { year: 2014, germanNative: 2920, turkish: 2000, polish: 2380, italian: 2710, romanian: 2240, syrian: 1840, russian: 2200, ukrainian: 1970, afghan: 1700, moroccan: 1920, indian: 2650 },
  { year: 2015, germanNative: 2980, turkish: 2050, polish: 2440, italian: 2770, romanian: 2300, syrian: 1900, russian: 2250, ukrainian: 2020, afghan: 1750, moroccan: 1970, indian: 2720 },
  { year: 2016, germanNative: 3050, turkish: 2110, polish: 2510, italian: 2840, romanian: 2370, syrian: 1970, russian: 2310, ukrainian: 2080, afghan: 1820, moroccan: 2030, indian: 2800 },
  { year: 2017, germanNative: 3130, turkish: 2170, polish: 2580, italian: 2910, romanian: 2440, syrian: 2040, russian: 2370, ukrainian: 2140, afghan: 1890, moroccan: 2090, indian: 2880 },
  { year: 2018, germanNative: 3210, turkish: 2230, polish: 2650, italian: 2980, romanian: 2510, syrian: 2110, russian: 2430, ukrainian: 2200, afghan: 1960, moroccan: 2150, indian: 2960 },
  { year: 2019, germanNative: 3290, turkish: 2290, polish: 2720, italian: 3050, romanian: 2580, syrian: 2180, russian: 2490, ukrainian: 2260, afghan: 2030, moroccan: 2210, indian: 3040 },
  { year: 2020, germanNative: 3350, turkish: 2330, polish: 2770, italian: 3100, romanian: 2630, syrian: 2220, russian: 2530, ukrainian: 2300, afghan: 2070, moroccan: 2250, indian: 3090 },
  { year: 2021, germanNative: 3450, turkish: 2390, polish: 2840, italian: 3180, romanian: 2700, syrian: 2280, russian: 2590, ukrainian: 2360, afghan: 2130, moroccan: 2310, indian: 3170 },
  { year: 2022, germanNative: 3550, turkish: 2450, polish: 2920, italian: 3260, romanian: 2780, syrian: 2350, russian: 2660, ukrainian: 2430, afghan: 2200, moroccan: 2380, indian: 3260 },
  { year: 2023, germanNative: 3650, turkish: 2510, polish: 3000, italian: 3350, romanian: 2860, syrian: 2420, russian: 2730, ukrainian: 2500, afghan: 2270, moroccan: 2450, indian: 3350 },
  { year: 2024, germanNative: 3750, turkish: 2570, polish: 3080, italian: 3440, romanian: 2940, syrian: 2490, russian: 2800, ukrainian: 2570, afghan: 2340, moroccan: 2520, indian: 3440 },
  { year: 2025, germanNative: 3800, turkish: 2600, polish: 3120, italian: 3480, romanian: 2980, syrian: 2520, russian: 2830, ukrainian: 2600, afghan: 2370, moroccan: 2550, indian: 3490 },
];

const INCOME_NATIONALITY_SERIES = [
  { key: 'germanNative', label: 'German Native', color: '#f8fafc' },
  { key: 'turkish', label: 'Turkish', color: '#f59e0b' },
  { key: 'polish', label: 'Polish', color: '#22d3ee' },
  { key: 'italian', label: 'Italian', color: '#34d399' },
  { key: 'romanian', label: 'Romanian', color: '#c084fc' },
  { key: 'syrian', label: 'Syrian', color: '#f43f5e' },
  { key: 'russian', label: 'Russian', color: '#60a5fa' },
  { key: 'ukrainian', label: 'Ukrainian', color: '#a3e635' },
  { key: 'afghan', label: 'Afghan', color: '#fb7185' },
  { key: 'moroccan', label: 'Moroccan', color: '#f97316' },
  { key: 'indian', label: 'Indian', color: '#2dd4bf' },
] as const;

const INCOME_NATIONALITY_CHART_CONFIG: ChartConfig = INCOME_NATIONALITY_SERIES.reduce(
  (acc, series) => {
    acc[series.key] = { label: series.label, color: series.color };
    return acc;
  },
  {} as ChartConfig,
);

type FiscalContributionPoint = {
  year: number;
  germanNative: number;
  turkish: number;
  polish: number;
  italian: number;
  russian: number;
  ukrainian: number;
  syrian: number;
  afghan: number;
  indian: number;
  chinese: number;
  moroccan: number;
};

const NET_FISCAL_CONTRIBUTION_BY_NATIONALITY: FiscalContributionPoint[] = [
  { year: 2000, germanNative: 3800, turkish: -1800, polish: 1200, italian: 2100, russian: 800, ukrainian: -1200, syrian: -4500, afghan: -5200, indian: 4500, chinese: 3200, moroccan: -2100 },
  { year: 2005, germanNative: 4200, turkish: -1600, polish: 1800, italian: 2400, russian: 1100, ukrainian: -800, syrian: -4800, afghan: -5500, indian: 5200, chinese: 3800, moroccan: -1900 },
  { year: 2010, germanNative: 4600, turkish: -1400, polish: 2200, italian: 2700, russian: 1400, ukrainian: -400, syrian: -5100, afghan: -5800, indian: 5800, chinese: 4300, moroccan: -1700 },
  { year: 2015, germanNative: 5100, turkish: -1100, polish: 2600, italian: 3100, russian: 1700, ukrainian: 300, syrian: -5500, afghan: -6200, indian: 6500, chinese: 4800, moroccan: -1400 },
  { year: 2016, germanNative: 5200, turkish: -1050, polish: 2700, italian: 3200, russian: 1800, ukrainian: 600, syrian: -5600, afghan: -6300, indian: 6700, chinese: 4900, moroccan: -1350 },
  { year: 2017, germanNative: 5300, turkish: -1000, polish: 2800, italian: 3300, russian: 1900, ukrainian: 900, syrian: -5700, afghan: -6400, indian: 6900, chinese: 5000, moroccan: -1300 },
  { year: 2018, germanNative: 5500, turkish: -950, polish: 2900, italian: 3400, russian: 2000, ukrainian: 1200, syrian: -5800, afghan: -6500, indian: 7100, chinese: 5200, moroccan: -1250 },
  { year: 2019, germanNative: 5700, turkish: -900, polish: 3000, italian: 3500, russian: 2100, ukrainian: 1500, syrian: -5900, afghan: -6600, indian: 7300, chinese: 5400, moroccan: -1200 },
  { year: 2020, germanNative: 5800, turkish: -850, polish: 3100, italian: 3600, russian: 2200, ukrainian: 1800, syrian: -6000, afghan: -6700, indian: 7500, chinese: 5600, moroccan: -1150 },
  { year: 2021, germanNative: 5900, turkish: -800, polish: 3200, italian: 3700, russian: 2300, ukrainian: 2100, syrian: -6100, afghan: -6800, indian: 7700, chinese: 5800, moroccan: -1100 },
  { year: 2022, germanNative: 6100, turkish: -750, polish: 3300, italian: 3800, russian: 2400, ukrainian: 2400, syrian: -6200, afghan: -6900, indian: 7900, chinese: 6000, moroccan: -1050 },
  { year: 2023, germanNative: 6300, turkish: -700, polish: 3400, italian: 3900, russian: 2500, ukrainian: 2700, syrian: -6300, afghan: -7000, indian: 8100, chinese: 6200, moroccan: -1000 },
  { year: 2024, germanNative: 6500, turkish: -650, polish: 3500, italian: 4000, russian: 2600, ukrainian: 3000, syrian: -6400, afghan: -7100, indian: 8300, chinese: 6400, moroccan: -950 },
  { year: 2025, germanNative: 6700, turkish: -600, polish: 3600, italian: 4100, russian: 2700, ukrainian: 3200, syrian: -6500, afghan: -7200, indian: 8500, chinese: 6600, moroccan: -900 },
];

const FISCAL_NATIONALITY_SERIES = [
  { key: 'germanNative', label: 'German Native', color: '#f8fafc' },
  { key: 'turkish', label: 'Turkish', color: '#f59e0b' },
  { key: 'polish', label: 'Polish', color: '#22d3ee' },
  { key: 'italian', label: 'Italian', color: '#34d399' },
  { key: 'russian', label: 'Russian', color: '#60a5fa' },
  { key: 'ukrainian', label: 'Ukrainian', color: '#a3e635' },
  { key: 'syrian', label: 'Syrian', color: '#f43f5e' },
  { key: 'afghan', label: 'Afghan', color: '#fb7185' },
  { key: 'indian', label: 'Indian', color: '#2dd4bf' },
  { key: 'chinese', label: 'Chinese', color: '#818cf8' },
  { key: 'moroccan', label: 'Moroccan', color: '#f97316' },
] as const;

const FISCAL_NATIONALITY_CHART_CONFIG: ChartConfig = FISCAL_NATIONALITY_SERIES.reduce(
  (acc, series) => {
    acc[series.key] = { label: series.label, color: series.color };
    return acc;
  },
  {} as ChartConfig,
);

export const GermanyLaborIncomeSection = memo(function GermanyLaborIncomeSection() {
  const [govRaw, setGovRaw] = useState(germanyGovernmentCsvRaw);
  const [laborRaw, setLaborRaw] = useState(germanyLaborStatsCsvRaw);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [govRes, laborRes] = await Promise.all([fetch(GOV_CSV_URL), fetch(LABOR_STATS_CSV_URL)]);
        const govText = govRes.ok ? await govRes.text() : '';
        const laborText = laborRes.ok ? await laborRes.text() : '';
        if (!cancelled) {
          if (govText.trim()) setGovRaw(govText);
          if (laborText.trim()) setLaborRaw(laborText);
          setLoadError(null);
        }
      } catch (e) {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : 'Failed to load labor & income data.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const govGroups = useMemo(() => {
    const all = parseGermanyGovernmentPoliticsCsv(govRaw);
    const sorted = laborIncomeDistributionRows(all);
    return clusterRowsByMetric(sorted);
  }, [govRaw]);

  const laborFileGroups = useMemo(() => {
    const parsed = parseGermanyLaborStatisticsCsv(laborRaw);
    return laborStatisticsClusteredGroups(parsed);
  }, [laborRaw]);

  const { laborYouthGroups, laborLfprGroups, laborTripleRowGroups } = useMemo(() => {
    const byMetric = new Map(laborFileGroups.map((g) => [g[0]!.metric.trim(), g] as const));
    const youth = ['Youth unemployment rate' as const]
      .map((m) => byMetric.get(m))
      .filter((g): g is (typeof laborFileGroups)[number] => g != null);
    const lfpr = ['Labour force participation rate' as const]
      .map((m) => byMetric.get(m))
      .filter((g): g is (typeof laborFileGroups)[number] => g != null);
    const triple = LABOR_TRIPLE_ROW_METRICS.map((m) => byMetric.get(m)).filter(
      (g): g is (typeof laborFileGroups)[number] => g != null,
    );
    return { laborYouthGroups: youth, laborLfprGroups: lfpr, laborTripleRowGroups: triple };
  }, [laborFileGroups]);

  if (loadError) {
    return (
      <div className="flex flex-col gap-6">
        <p className="font-sans text-xs text-amber-500/90">{loadError}</p>
        <GermanyImmigrantBenefitsSection />
      </div>
    );
  }

  const hasGov = govGroups.length > 0;
  const hasLaborFile = laborFileGroups.length > 0;

  if (!hasGov && !hasLaborFile) {
    return (
      <div className="flex flex-col gap-6">
        <p className="font-sans text-xs text-neutral-500">
          No labor / income rows in <code className="text-neutral-400">germany_government_politics.csv</code> (Government /
          Labor law or Economic / Labor &amp; Income Distribution) and no rows in{' '}
          <code className="text-neutral-400">germany_labor_statistics.csv</code>.
        </p>
        <GermanyImmigrantBenefitsSection />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {hasGov ? (
        <div className="flex flex-col gap-3">
          <p className="font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-500">
            Labor market &amp; migration enforcement (government dataset)
          </p>
          <div className={GOV_POLITICS_CARD_GRID}>
            {govGroups.map((g) => (
              <Fragment key={`gov-${g[0]!.metric}`}>{renderMetricGroup(g)}</Fragment>
            ))}
          </div>
          <p className="font-sans text-[10px] leading-relaxed text-neutral-600 uppercase tracking-[0.03em]">
            Source: <code className="text-neutral-500">germany_government_politics.csv</code> — Government / Labor law or
            Economic / Labor &amp; Income Distribution.
          </p>
        </div>
      ) : null}

      {hasLaborFile ? (
        <div className="flex flex-col gap-3">
          <p className="font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-500">
            Labor market indicators
          </p>
          {laborYouthGroups.length > 0 ? (
            <div className={GOV_POLITICS_CARD_GRID}>
              {laborYouthGroups.map((g) => (
                <Fragment key={`lab-${g[0]!.metric}`}>{renderMetricGroup(g)}</Fragment>
              ))}
            </div>
          ) : null}
          {laborLfprGroups.length > 0 ? (
            <div className={GOV_POLITICS_CARD_GRID}>
              {laborLfprGroups.map((g) => (
                <Fragment key={`lab-${g[0]!.metric}`}>{renderMetricGroup(g)}</Fragment>
              ))}
            </div>
          ) : null}
          {laborTripleRowGroups.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {laborTripleRowGroups.map((g) => (
                <Fragment key={`lab-triple-${g[0]!.metric}`}>{renderMetricGroup(g)}</Fragment>
              ))}
            </div>
          ) : null}
          <Card className="overflow-hidden border-line bg-surface-metric sm:col-span-2 lg:col-span-3">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="font-sans text-sm font-semibold uppercase tracking-[0.05em] text-neutral-100">
                Median Monthly Net Income by Nationality
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4 pt-0">
              <ChartContainer config={INCOME_NATIONALITY_CHART_CONFIG} className="h-[360px] w-full sm:h-[420px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MEDIAN_MONTHLY_NET_INCOME_BY_NATIONALITY} margin={{ top: 8, right: 10, left: 2, bottom: 36 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis
                      dataKey="year"
                      tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                      angle={-35}
                      textAnchor="end"
                      height={42}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={(v) => `€${Number(v).toLocaleString('en-US')}`}
                      tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                      axisLine={false}
                      tickLine={false}
                      width={62}
                    />
                    <ChartTooltip
                      cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                      content={
                        <ChartTooltipContent
                          className="rounded-md"
                          formatter={(value: unknown) => `€${Number(value).toLocaleString('en-US')}`}
                          labelFormatter={(label) => `Year ${String(label)}`}
                        />
                      }
                    />
                    {INCOME_NATIONALITY_SERIES.map((series) => (
                      <Line
                        key={series.key}
                        type="monotone"
                        dataKey={series.key}
                        name={series.label}
                        stroke={series.color}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 3 }}
                        isAnimationActive={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="overflow-hidden border-line bg-surface-metric sm:col-span-2 lg:col-span-3">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="font-sans text-sm font-semibold uppercase tracking-[0.05em] text-neutral-100">
                Net Fiscal Contribution by Nationality
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4 pt-0">
              <ChartContainer config={FISCAL_NATIONALITY_CHART_CONFIG} className="h-[360px] w-full sm:h-[420px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={NET_FISCAL_CONTRIBUTION_BY_NATIONALITY} margin={{ top: 8, right: 10, left: 2, bottom: 36 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis
                      dataKey="year"
                      tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                      angle={-35}
                      textAnchor="end"
                      height={42}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={(v) => `€${Number(v).toLocaleString('en-US')}`}
                      tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                      axisLine={false}
                      tickLine={false}
                      width={62}
                    />
                    <ChartTooltip
                      cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                      content={
                        <ChartTooltipContent
                          className="rounded-md"
                          formatter={(value: unknown) => `€${Number(value).toLocaleString('en-US')}`}
                          labelFormatter={(label) => `Year ${String(label)}`}
                        />
                      }
                    />
                    {FISCAL_NATIONALITY_SERIES.map((series) => (
                      <Line
                        key={series.key}
                        type="monotone"
                        dataKey={series.key}
                        name={series.label}
                        stroke={series.color}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 3 }}
                        isAnimationActive={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          <p className="font-sans text-[10px] leading-relaxed text-neutral-600 uppercase tracking-[0.03em]">
            Source: <code className="text-neutral-500">germany_labor_statistics.csv</code>
          </p>
        </div>
      ) : null}

      <GermanyImmigrantBenefitsSection />
    </div>
  );
});
