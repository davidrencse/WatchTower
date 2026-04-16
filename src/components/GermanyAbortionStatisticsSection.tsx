import { Fragment, useEffect, useMemo, useState } from 'react';
import abortionCsvRaw from '../../Assets/Data/Europe/Germany/Health Section/germany_abortion_statistics.csv?raw';
import {
  clusterMetricTable,
  GERMANY_ABORTION_METRIC_ORDER,
  parseGermanyMetricTableCsv,
} from '../lib/germanyHealthCsv';
import { GOV_POLITICS_CARD_GRID, renderMetricGroup } from './GermanyGovernmentPoliticsBlocks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const CSV_URL = '/data/germany_abortion_statistics.csv';

const TOTAL_ABORTIONS_METRIC = 'Total number of abortions';

const UC_TITLE = 'uppercase tracking-[0.05em]';
const UC_META = 'uppercase tracking-[0.03em]';

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

      <p className="font-sans text-[10px] leading-relaxed text-neutral-600 uppercase tracking-[0.03em]">
        Source: <code className="text-neutral-500">germany_abortion_statistics.csv</code> (other figures noted on-card).
      </p>
    </div>
  );
}
