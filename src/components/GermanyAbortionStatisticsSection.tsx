import { Fragment, useEffect, useMemo, useState } from 'react';
import abortionCsvRaw from '../../Assets/Data/Europe/Germany/Health Section/germany_abortion_statistics.csv?raw';
import type { GermanyGovernmentPoliticsRow } from '../lib/germanyGovernmentPolitics';
import {
  clusterMetricTable,
  GERMANY_ABORTION_METRIC_ORDER,
  parseGermanyMetricTableCsv,
} from '../lib/germanyHealthCsv';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { formatValueDisplay, GOV_POLITICS_CARD_GRID, splitUrls } from './GermanyGovernmentPoliticsBlocks';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from './ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const CSV_URL = '/data/germany_abortion_statistics.csv';

const ABORTION_RATIO_METRIC = 'Abortion ratio';
const GESTATIONAL_AGE_METRIC = 'Gestational age at abortion';
const METHOD_METRIC = 'Method of abortion';
const LATE_TERM_METRIC = 'Late-term abortions';
const FACILITIES_METRIC = 'Number of abortion-providing facilities';

/** Manual series replacing CSV “Abortion rate per 1,000 women of reproductive age”. */
const GERMANY_ABORTION_RATE_PER_1K_WRA: readonly { year: string; rate: number }[] = [
  { year: '2000', rate: 7.8 },
  { year: '2001', rate: 8.0 },
  { year: '2002', rate: 7.7 },
  { year: '2003', rate: 7.6 },
  { year: '2004', rate: 7.7 },
  { year: '2005', rate: 7.4 },
  { year: '2006', rate: 7.2 },
  { year: '2007', rate: 7.0 },
  { year: '2008', rate: 6.9 },
  { year: '2009', rate: 6.7 },
  { year: '2010', rate: 6.7 },
  { year: '2011', rate: 6.6 },
  { year: '2012', rate: 6.5 },
  { year: '2013', rate: 6.3 },
  { year: '2014', rate: 6.1 },
  { year: '2015', rate: 6.1 },
  { year: '2016', rate: 6.1 },
  { year: '2017', rate: 6.3 },
  { year: '2018', rate: 6.3 },
  { year: '2019', rate: 6.3 },
  { year: '2020', rate: 6.2 },
  { year: '2021', rate: 5.9 },
  { year: '2022', rate: 6.5 },
  { year: '2023', rate: 6.7 },
  { year: '2024', rate: 6.7 },
  { year: '2025', rate: 6.6 },
];

/** Annual totals for Germany — source for Total Abortions chart below top cards. */
const GERMANY_TOTAL_ABORTIONS_BY_YEAR: readonly { year: string; total: number }[] = [
  { year: '2000', total: 134240 },
  { year: '2001', total: 134463 },
  { year: '2002', total: 129925 },
  { year: '2003', total: 127499 },
  { year: '2004', total: 129167 },
  { year: '2005', total: 123506 },
  { year: '2006', total: 119201 },
  { year: '2007', total: 116315 },
  { year: '2008', total: 113764 },
  { year: '2009', total: 110037 },
  { year: '2010', total: 109506 },
  { year: '2011', total: 107861 },
  { year: '2012', total: 105727 },
  { year: '2013', total: 101710 },
  { year: '2014', total: 98465 },
  { year: '2015', total: 98127 },
  { year: '2016', total: 97773 },
  { year: '2017', total: 100146 },
  { year: '2018', total: 99905 },
  { year: '2019', total: 99804 },
  { year: '2020', total: 99366 },
  { year: '2021', total: 94596 },
  { year: '2022', total: 103927 },
  { year: '2023', total: 106218 },
  { year: '2024', total: 106455 },
  { year: '2025', total: 106000 },
];

const TOTAL_ABORTIONS_METRIC = 'Total number of abortions';

const UC_TITLE = 'uppercase tracking-[0.05em]';
const UC_META = 'uppercase tracking-[0.03em]';

/** Shadcn chart + Recharts line series (year vs count). */
const totalAbortionsChartData = GERMANY_TOTAL_ABORTIONS_BY_YEAR.map((r) => ({
  year: r.year,
  abortions: r.total,
}));

const TOTAL_ABORTIONS_LINE_COLOR = '#f97316';

const totalAbortionsChartConfig = {
  abortions: { label: 'Total abortions', color: TOTAL_ABORTIONS_LINE_COLOR },
} satisfies ChartConfig;

const abortionRatePer1kChartData = GERMANY_ABORTION_RATE_PER_1K_WRA.map((r) => ({
  year: r.year,
  rate: r.rate,
}));

const ABORTION_RATE_PER_1K_LINE_COLOR = '#38bdf8';

const abortionRatePer1kChartConfig = {
  rate: { label: 'Per 1,000 women (15–49)', color: ABORTION_RATE_PER_1K_LINE_COLOR },
} satisfies ChartConfig;

function AbortionRateReproductiveAgeChart() {
  return (
    <Card className="col-span-full overflow-hidden border-line bg-surface-metric">
      <CardHeader className="space-y-1 p-3 pb-2">
        <CardTitle className={`text-sm font-semibold text-neutral-100 ${UC_TITLE}`}>
          Abortion Rate per 1,000 Women of Reproductive Age (15–49 years)
        </CardTitle>
        <CardDescription className={`text-[10px] text-neutral-500 ${UC_META}`}>
          Annual abortions per 1,000 women aged 15–49 (2000–2025), line chart.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 p-3 pt-0">
        <ChartContainer config={abortionRatePer1kChartConfig} className="h-[300px] w-full font-sans">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={abortionRatePer1kChartData} margin={{ top: 8, right: 10, left: 4, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={['dataMin - 0.2', 'dataMax + 0.2']}
                tickFormatter={(v) => (Number.isFinite(Number(v)) ? Number(v).toFixed(1) : '')}
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
                    formatter={(value) => {
                      const n = Number(value);
                      return Number.isFinite(n) ? n.toFixed(1) : '—';
                    }}
                    labelFormatter={(label) => `Year ${label}`}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="rate"
                name="Abortions per 1,000 women (15–49)"
                stroke={ABORTION_RATE_PER_1K_LINE_COLOR}
                strokeWidth={2.5}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        <p className="font-sans text-[10px] leading-relaxed text-neutral-500">
          Hover points for the rate (shadcn chart + Recharts).
        </p>
      </CardContent>
    </Card>
  );
}

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

function AbortionCleanMetricCard({ rows, className }: { rows: GermanyGovernmentPoliticsRow[]; className?: string }) {
  const first = rows[0]!;
  const urls = Array.from(new Set(rows.flatMap((r) => splitUrls(r.sourceUrl ?? ''))));
  const sourceName = first.sourceName || 'Source';
  const notes = rows.map((r) => r.notes.trim()).filter(Boolean);

  return (
    <Card className={`overflow-hidden border-line bg-surface-metric ${className ?? ''}`}>
      <CardHeader className="space-y-1 p-3 pb-2">
        <CardTitle className={`text-sm font-semibold text-neutral-100 ${UC_TITLE}`}>{first.metric}</CardTitle>
        {first.referenceYear ? (
          <CardDescription className={`text-[10px] text-neutral-500 ${UC_META}`}>Reference year: {first.referenceYear}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-2 p-3 pt-0">
        <div className="grid grid-cols-1 gap-1.5">
          {rows.map((r, i) => (
            <div key={`${r.submetric}-${r.breakdown}-${i}`} className="rounded-md border border-white/[0.06] bg-black/20 px-2.5 py-2">
              <p className="font-sans text-[10px] leading-snug text-neutral-400">
                {(r.breakdown || r.submetric || 'Value').trim() || 'Value'}
              </p>
              <p className="mt-0.5 font-sans text-[15px] font-semibold leading-tight text-white tabular-nums">
                {formatValueDisplay(r)}
                {r.unit && !String(formatValueDisplay(r)).includes('%') ? (
                  <span className="ml-1 text-[10px] font-normal text-neutral-500">{r.unit}</span>
                ) : null}
              </p>
            </div>
          ))}
        </div>
        {urls.length > 0 ? (
          <div className="space-y-0.5 border-t border-white/[0.06] pt-2">
            {urls.map((u, i) => (
              <a
                key={`${u}-${i}`}
                href={u}
                target="_blank"
                rel="noopener noreferrer"
                className={`block font-sans text-[10px] text-[var(--uk-accent)] hover:text-neutral-200 ${UC_META}`}
              >
                {urls.length > 1 ? `${sourceName} (${i + 1})` : sourceName} ↗
              </a>
            ))}
          </div>
        ) : null}
        {notes.length > 0 ? (
          <details className="rounded-md border border-white/[0.06] bg-neutral-950/40 px-2 py-1.5">
            <summary className="cursor-pointer font-sans text-[9px] uppercase tracking-[0.12em] text-neutral-500">Notes</summary>
            <pre className="mt-1.5 max-h-36 overflow-y-auto whitespace-pre-wrap font-sans text-[10px] leading-relaxed text-neutral-500">
              {notes.join('\n\n')}
            </pre>
          </details>
        ) : null}
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

  const otherByMetric = useMemo(() => {
    const m = new Map<string, GermanyGovernmentPoliticsRow[]>();
    for (const g of otherGroups) m.set(g[0]!.metric, g);
    return m;
  }, [otherGroups]);

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
        <>
          <div className={GOV_POLITICS_CARD_GRID}>
            <AbortionCleanMetricCard rows={totalGroup} />
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

          <Card className="overflow-hidden border-line bg-surface-metric">
            <CardHeader className="space-y-1 p-3 pb-2">
              <CardTitle className={`text-sm font-semibold text-neutral-100 ${UC_TITLE}`}>
                Total Abortions in Germany
              </CardTitle>
              <CardDescription className={`text-[10px] text-neutral-500 ${UC_META}`}>
                Annual national totals (2000–2025), line chart.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 p-3 pt-0">
              <ChartContainer config={totalAbortionsChartConfig} className="h-[300px] w-full font-sans">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={totalAbortionsChartData} margin={{ top: 8, right: 10, left: 4, bottom: 8 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis
                      dataKey="year"
                      tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                      axisLine={false}
                      tickLine={false}
                      interval="preserveStartEnd"
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
                          formatter={(value) => {
                            const n = Number(value);
                            return Number.isFinite(n) ? n.toLocaleString('en-US') : '—';
                          }}
                          labelFormatter={(label) => `Year ${label}`}
                        />
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="abortions"
                      name="Total abortions"
                      stroke={TOTAL_ABORTIONS_LINE_COLOR}
                      strokeWidth={2.5}
                      dot={{ r: 2 }}
                      activeDot={{ r: 4 }}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
              <p className="font-sans text-[10px] leading-relaxed text-neutral-500">
                Hover points for exact counts (shadcn chart + Recharts).
              </p>
            </CardContent>
          </Card>
        </>
      ) : (
        <div className={GOV_POLITICS_CARD_GRID}>
          {groups.map((g) => (
            <Fragment key={g[0]!.metric}>
              <AbortionCleanMetricCard rows={g} />
              {g[0]!.metric === ABORTION_RATIO_METRIC ? <AbortionRateReproductiveAgeChart /> : null}
            </Fragment>
          ))}
        </div>
      )}

      {splitTotal ? (
        <>
          {otherByMetric.get(ABORTION_RATIO_METRIC) ? (
            <div className={GOV_POLITICS_CARD_GRID}>
              <AbortionCleanMetricCard rows={otherByMetric.get(ABORTION_RATIO_METRIC)!} className="col-span-full" />
              <AbortionRateReproductiveAgeChart />
            </div>
          ) : null}

          {otherByMetric.get(GESTATIONAL_AGE_METRIC) ? (
            <div className={GOV_POLITICS_CARD_GRID}>
              <AbortionCleanMetricCard rows={otherByMetric.get(GESTATIONAL_AGE_METRIC)!} className="col-span-full" />
            </div>
          ) : null}

          <div className={GOV_POLITICS_CARD_GRID}>
            {otherByMetric.get(METHOD_METRIC) ? <AbortionCleanMetricCard rows={otherByMetric.get(METHOD_METRIC)!} /> : null}
            {otherByMetric.get(LATE_TERM_METRIC) ? (
              <AbortionCleanMetricCard rows={otherByMetric.get(LATE_TERM_METRIC)!} />
            ) : null}
            {otherByMetric.get(FACILITIES_METRIC) ? (
              <AbortionCleanMetricCard rows={otherByMetric.get(FACILITIES_METRIC)!} />
            ) : null}
          </div>
        </>
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

      <p className="font-sans text-[10px] leading-relaxed text-neutral-600 uppercase tracking-[0.03em]">
        Source: <code className="text-neutral-500">germany_abortion_statistics.csv</code> (other figures noted on-card).
      </p>
    </div>
  );
}
