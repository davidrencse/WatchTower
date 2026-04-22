import { Fragment, useEffect, useMemo, useState } from 'react';
import abortionCsvRaw from '../../Assets/Data/Europe/Germany/Health Section/germany_abortion_statistics.csv?raw';
import {
  clusterMetricTable,
  GERMANY_ABORTION_METRIC_ORDER,
  parseGermanyMetricTableCsv,
} from '../lib/germanyHealthCsv';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { GOV_POLITICS_CARD_GRID, renderMetricGroup } from './GermanyGovernmentPoliticsBlocks';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from './ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const CSV_URL = '/data/germany_abortion_statistics.csv';

const TOTAL_ABORTIONS_METRIC = 'Total number of abortions';

const UC_TITLE = 'uppercase tracking-[0.05em]';
const UC_META = 'uppercase tracking-[0.03em]';

type AbortionTrendRow = {
  year: string;
  abortions: number;
  abortionsDisplay: string;
  notes: string;
};

const ABORTION_TREND_ROWS: readonly AbortionTrendRow[] = [
  { year: '2000', abortions: 134240, abortionsDisplay: '134,240', notes: 'High period (~135k range)' },
  { year: '2001', abortions: 134463, abortionsDisplay: '134,463', notes: 'Peak around here' },
  { year: '2002', abortions: 129925, abortionsDisplay: '129,925', notes: 'Slight decline' },
  { year: '2003', abortions: 127499, abortionsDisplay: '127,499', notes: '-' },
  { year: '2004', abortions: 129167, abortionsDisplay: '129,167', notes: '-' },
  { year: '2005', abortions: 123506, abortionsDisplay: '123,506', notes: 'Start of longer decline' },
  { year: '2006', abortions: 119201, abortionsDisplay: '119,201', notes: '-' },
  { year: '2007', abortions: 116315, abortionsDisplay: '116,315', notes: '-' },
  { year: '2008', abortions: 113764, abortionsDisplay: '113,764', notes: '-' },
  { year: '2009', abortions: 110037, abortionsDisplay: '110,037', notes: '-' },
  { year: '2010', abortions: 109506, abortionsDisplay: '109,506', notes: '-' },
  { year: '2011', abortions: 107861, abortionsDisplay: '107,861', notes: '-' },
  { year: '2012', abortions: 106815, abortionsDisplay: '106,815 (or 106,800)', notes: 'Highest in recent pre-2022 years' },
  { year: '2013', abortions: 102802, abortionsDisplay: '102,802', notes: '-' },
  { year: '2014', abortions: 99715, abortionsDisplay: '99,715', notes: '~100k plateau begins' },
  { year: '2015', abortions: 99237, abortionsDisplay: '99,237', notes: '-' },
  { year: '2016', abortions: 98721, abortionsDisplay: '98,721', notes: '-' },
  { year: '2017', abortions: 101209, abortionsDisplay: '101,209', notes: 'Slight increase' },
  { year: '2018', abortions: 100986, abortionsDisplay: '100,986', notes: '-' },
  { year: '2019', abortions: 100893, abortionsDisplay: '100,893', notes: '-' },
  { year: '2020', abortions: 99948, abortionsDisplay: '99,948', notes: 'Minor drop (-0.9%)' },
  {
    year: '2021',
    abortions: 94596,
    abortionsDisplay: '94,596',
    notes: 'Lowest since statistics began (pandemic impact, -5.4%)',
  },
  { year: '2022', abortions: 103927, abortionsDisplay: '103,927', notes: 'Strong rebound (+9.9%)' },
  { year: '2023', abortions: 106218, abortionsDisplay: '106,218', notes: 'Continued rise' },
  { year: '2024', abortions: 106455, abortionsDisplay: '106,455', notes: 'Almost unchanged (+0.2%)' },
];

const abortionTrendChartConfig = {
  abortions: { label: 'Number of abortions', color: '#f97316' },
} satisfies ChartConfig;

function ManualAbortionStatCard({
  title,
  valueDisplay,
  body,
}: {
  title: string;
  valueDisplay: string;
  body: string;
}) {
  return (
    <Card className="flex flex-col overflow-hidden border-line bg-surface-metric">
      <CardHeader className="space-y-0.5 p-3 pb-0">
        <CardTitle className={`text-sm font-semibold leading-tight text-neutral-100 ${UC_TITLE}`}>{title}</CardTitle>
        <CardDescription className={`text-[10px] leading-snug text-neutral-500 ${UC_META}`}>
          Entered manually (not from abortion CSV).
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-2 p-3 pt-2">
        <p className="font-sans text-xl font-semibold tabular-nums tracking-tight text-white sm:text-2xl">
          {valueDisplay}
        </p>
        <p className={`font-sans text-[10px] leading-relaxed text-neutral-400 ${UC_META}`}>{body}</p>
      </CardContent>
    </Card>
  );
}

export function GermanyAbortionStatisticsSection() {
  const [raw, setRaw] = useState(abortionCsvRaw);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(CSV_URL);
        const text = res.ok ? await res.text() : '';
        if (!cancelled && text.trim()) {
          setRaw(text);
          setLoadError(null);
        }
      } catch (e) {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : 'Failed to load abortion statistics.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const groups = useMemo(() => {
    const parsed = parseGermanyMetricTableCsv(raw);
    return clusterMetricTable(parsed, 'Abortions', GERMANY_ABORTION_METRIC_ORDER);
  }, [raw]);

  const splitTotal = groups[0]?.[0]?.metric === TOTAL_ABORTIONS_METRIC;
  const totalGroup = splitTotal ? groups[0]! : null;
  const otherGroups = splitTotal ? groups.slice(1) : groups;

  if (loadError) {
    return <p className="font-sans text-xs text-amber-500/90">{loadError}</p>;
  }

  if (groups.length === 0) {
    return (
      <p className="font-sans text-xs text-neutral-500">
        No rows in <code className="text-neutral-400">germany_abortion_statistics.csv</code>.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {totalGroup ? (
        <div className={GOV_POLITICS_CARD_GRID}>
          <Fragment key={totalGroup[0]!.metric}>{renderMetricGroup(totalGroup)}</Fragment>
          <ManualAbortionStatCard
            title="Prior live births (≥1)"
            valueDisplay="60,679"
            body="Abortions were performed on women who already had at least 1 previous live birth."
          />
          <ManualAbortionStatCard
            title="Prior live births (0)"
            valueDisplay="45,776"
            body="Abortions were performed on women with 0 previous live births."
          />
        </div>
      ) : (
        <div className={GOV_POLITICS_CARD_GRID}>
          {groups.map((g) => (
            <Fragment key={g[0]!.metric}>{renderMetricGroup(g)}</Fragment>
          ))}
        </div>
      )}

      {splitTotal ? (
        <div className={GOV_POLITICS_CARD_GRID}>
          {otherGroups.map((g) => (
            <Fragment key={g[0]!.metric}>{renderMetricGroup(g)}</Fragment>
          ))}
        </div>
      ) : null}

      <Card className="overflow-hidden border-line bg-surface-metric">
        <CardHeader className="space-y-1 p-3 pb-2">
          <CardTitle className={`text-sm font-semibold text-neutral-100 ${UC_TITLE}`}>
            Abortions by marital / relationship status [2021]
          </CardTitle>
          <CardDescription className={`text-[10px] text-neutral-500 ${UC_META}`}>
            Entered manually (not from abortion CSV).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 p-3 pt-0 font-sans text-[11px] leading-relaxed text-neutral-300">
          <p>
            <span className="tabular-nums text-base font-semibold text-white">55,075</span> abortions among single
            (unmarried) women.
          </p>
          <p>
            <span className="tabular-nums text-base font-semibold text-white">35,946</span> abortions among married
            women.
          </p>
          <p>
            <span className="tabular-nums text-base font-semibold text-white">3,575</span> abortions among widowed or
            divorced women.
          </p>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-line bg-surface-metric">
        <CardHeader className="space-y-1 p-3 pb-2">
          <CardTitle className={`text-sm font-semibold text-neutral-100 ${UC_TITLE}`}>Number of abortions</CardTitle>
          <CardDescription className={`text-[10px] text-neutral-500 ${UC_META}`}>
            Annual trend (2000-2024) with source highlights.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 p-3 pt-0">
          <ChartContainer config={abortionTrendChartConfig} className="h-[280px] w-full font-sans">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ABORTION_TREND_ROWS} margin={{ top: 8, right: 10, left: 4, bottom: 8 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis
                  dataKey="year"
                  tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(value) => `${Math.round(Number(value) / 1000)}k`}
                  tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                  axisLine={false}
                  tickLine={false}
                  width={48}
                />
                <ChartTooltip
                  cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                  content={
                    <ChartTooltipContent
                      className="rounded-md"
                      formatter={(value, _name, item: any) => {
                        const row = item?.payload as AbortionTrendRow | undefined;
                        const numericValue = Number(value);
                        const pretty = Number.isFinite(numericValue)
                          ? numericValue.toLocaleString('en-US')
                          : row?.abortionsDisplay ?? '—';
                        return [pretty, 'Number of abortions'];
                      }}
                      labelFormatter={(label, payload: any) => {
                        const row = payload?.[0]?.payload as AbortionTrendRow | undefined;
                        const note = row?.notes && row.notes !== '-' ? ` - ${row.notes}` : '';
                        return `Year ${String(label)}${note}`;
                      }}
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="abortions"
                  name="Number of abortions"
                  stroke="#f97316"
                  strokeWidth={2.5}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
          <p className="font-sans text-[10px] leading-relaxed text-neutral-500">
            Hover each year to see the related source highlight in the tooltip.
          </p>
        </CardContent>
      </Card>

      <p className="font-sans text-[10px] leading-relaxed text-neutral-600 uppercase tracking-[0.03em]">
        Source: <code className="text-neutral-500">germany_abortion_statistics.csv</code> (other figures noted on-card).
      </p>
    </div>
  );
}
