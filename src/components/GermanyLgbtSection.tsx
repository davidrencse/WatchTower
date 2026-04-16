import { Fragment, useEffect, useMemo, useState } from 'react';
import lgbtCsvRaw from '../../Assets/Data/Europe/Germany/Health Section/germany_gender_care_statistics.csv?raw';
import {
  clusterMetricTable,
  GERMANY_LGBT_CHILDREN_METRIC_ORDER,
  GERMANY_LGBT_METRIC_ORDER,
  parseGermanyMetricTableCsv,
} from '../lib/germanyHealthCsv';
import { GOV_POLITICS_CARD_GRID, renderMetricGroup } from './GermanyGovernmentPoliticsBlocks';
import { CollapsibleFlagSection } from './CollapsibleFlagSection';

const CSV_URL = '/data/germany_gender_care_statistics.csv';

export function GermanyLgbtSection() {
  const [raw, setRaw] = useState(lgbtCsvRaw);
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
        if (!cancelled) setLoadError(e instanceof Error ? e.message : 'Failed to load LGBT care statistics.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const { adultGroups, childrenGroups } = useMemo(() => {
    const parsed = parseGermanyMetricTableCsv(raw);
    return {
      adultGroups: clusterMetricTable(parsed, 'LGBT', GERMANY_LGBT_METRIC_ORDER),
      childrenGroups: clusterMetricTable(parsed, 'LGBT children', GERMANY_LGBT_CHILDREN_METRIC_ORDER),
    };
  }, [raw]);

  if (loadError) {
    return <p className="font-sans text-xs text-amber-500/90">{loadError}</p>;
  }

  if (adultGroups.length === 0 && childrenGroups.length === 0) {
    return (
      <p className="font-sans text-xs text-neutral-500">
        No rows in <code className="text-neutral-400">germany_gender_care_statistics.csv</code>.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {adultGroups.length > 0 ? (
        <div className={GOV_POLITICS_CARD_GRID}>
          {adultGroups.map((g) => (
            <Fragment key={g[0]!.metric}>{renderMetricGroup(g)}</Fragment>
          ))}
        </div>
      ) : null}

      <CollapsibleFlagSection title="Children" count={childrenGroups.length} defaultOpen>
        {childrenGroups.length > 0 ? (
          <div className={GOV_POLITICS_CARD_GRID}>
            {childrenGroups.map((g) => (
              <Fragment key={g[0]!.metric}>{renderMetricGroup(g)}</Fragment>
            ))}
          </div>
        ) : (
          <p className="font-sans text-xs text-neutral-500">
            No child-focused rows found in <code className="text-neutral-400">germany_gender_care_statistics.csv</code>.
          </p>
        )}
      </CollapsibleFlagSection>

      <p className="font-sans text-[10px] leading-relaxed text-neutral-600 uppercase tracking-[0.03em]">
        Source: <code className="text-neutral-500">germany_gender_care_statistics.csv</code>
      </p>
    </div>
  );
}
