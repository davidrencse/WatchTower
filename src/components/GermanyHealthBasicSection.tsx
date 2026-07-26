import { Fragment, memo, useEffect, useMemo, useState } from 'react';
import healthBasicCsvRaw from '../../Assets/Data/countries/Germany/health/germany_health_statistics_basic.csv?raw';
import type { GermanyGovernmentPoliticsRow } from '../lib/germanyGovernmentPolitics';
import {
  clusterMetricTable,
  GERMANY_HEALTH_BASIC_METRIC_ORDER,
  parseGermanyMetricTableCsv,
} from '../lib/germanyHealthCsv';
import { GOV_POLITICS_CARD_GRID, GovStatCard, renderMetricGroup } from './GermanyGovernmentPoliticsBlocks';

const CSV_URL = '/data/germany_health_statistics_basic.csv';

/** These overview metrics use stat cards instead of the default grouped table layout. */
const HEALTH_OVERVIEW_BOX_METRICS = new Set([
  'Obesity rate',
  'Smoking prevalence',
  'Suicide Rate',
  'Physicians per 1,000 people',
  'Total number of doctors',
  'Healthy life expectancy',
  'Preventable mortality rate',
  'Alcohol consumption',
  'Life expectancy',
  'Self-reported poor health',
  'Insufficient physical activity',
  'Healthy life expectancy (OECD country note)',
]);

const OECD_HAAG_GERMANY_HTML =
  'https://www.oecd.org/en/publications/health-at-a-glance-2025_15a55280-en/germany_99d672fb-en.html';
const OECD_HAAG_GERMANY_PDF =
  'https://www.oecd.org/content/dam/oecd/en/publications/reports/2025/11/health-at-a-glance-2025-country-notes_2f94481e/germany_461a6f3f/99d672fb-en.pdf';

/** OECD Health at a Glance 2025 – Germany (supplementary to CSV). */
const HEALTH_OVERVIEW_OECD_EXTRA_ROWS: GermanyGovernmentPoliticsRow[] = [
  {
    section: 'Health overview',
    subsection: '',
    metric: 'Life expectancy',
    submetric: '',
    breakdown: '',
    value: '81.1',
    unit: 'years',
    referenceYear: '2025',
    sourceName: 'OECD Health at a Glance 2025 – Germany',
    sourceUrl: OECD_HAAG_GERMANY_HTML,
    notes: '',
  },
  {
    section: 'Health overview',
    subsection: '',
    metric: 'Self-reported poor health',
    submetric: 'Population aged 15+',
    breakdown: 'Bad or very bad self-rated health',
    value: '10.9',
    unit: 'percent',
    referenceYear: '2025',
    sourceName: 'OECD Health at a Glance 2025 – Germany Country Note',
    sourceUrl: OECD_HAAG_GERMANY_PDF,
    notes: 'Share of the population aged 15+ rating their health as bad or very bad.',
  },
  {
    section: 'Health overview',
    subsection: '',
    metric: 'Insufficient physical activity',
    submetric: 'Adults',
    breakdown: '',
    value: '15',
    unit: 'percent',
    referenceYear: '2025',
    sourceName: 'OECD Health at a Glance 2025 – Germany Country Note',
    sourceUrl: OECD_HAAG_GERMANY_HTML,
    notes: 'Share of adults with insufficient physical activity (better than OECD average).',
  },
  {
    section: 'Health overview',
    subsection: '',
    metric: 'Healthy life expectancy (OECD country note)',
    submetric: 'At birth',
    breakdown: '',
    value: '57',
    unit: 'years',
    referenceYear: '2025',
    sourceName: 'OECD Health at a Glance 2025 – Germany Country Note (OECD Health Statistics 2025)',
    sourceUrl: OECD_HAAG_GERMANY_PDF,
    notes: 'Approximate HALE at birth in OECD country note; women slightly higher than men.',
  },
];

type GermanyHealthBasicSectionProps = {
  /** Per-country CSV (same schema); defaults to Germany's. */
  csvUrl?: string;
  /** Country label used to select rows from a per-country CSV. */
  countryName?: string;
  /** Germany renders bundled fallback data + OECD extra cards; other countries skip both. */
  isGermany?: boolean;
};

export const GermanyHealthBasicSection = memo(function GermanyHealthBasicSection({
  csvUrl = CSV_URL,
  countryName = 'Germany',
  isGermany = true,
}: GermanyHealthBasicSectionProps) {
  const [raw, setRaw] = useState(isGermany ? healthBasicCsvRaw : '');
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(csvUrl);
        const text = res.ok ? await res.text() : '';
        if (!cancelled && text.trim()) {
          setRaw(text);
          setLoadError(null);
        }
      } catch (e) {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : 'Failed to load health statistics.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [csvUrl]);

  const groups = useMemo(() => {
    const parsed = parseGermanyMetricTableCsv(raw, countryName);
    return clusterMetricTable(parsed, 'Health overview', GERMANY_HEALTH_BASIC_METRIC_ORDER).filter(
      (g) => g[0]!.metric !== 'Healthcare expenditure',
    );
  }, [countryName, raw]);

  if (loadError) {
    return <p className="font-sans text-xs text-amber-500/90">{loadError}</p>;
  }

  if (groups.length === 0) {
    return (
      <p className="font-sans text-xs text-neutral-500">
        No rows in <code className="text-neutral-400">{csvUrl.split('/').pop()}</code>.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className={GOV_POLITICS_CARD_GRID}>
        {groups.map((g) => {
          const metric = g[0]!.metric;
          if (HEALTH_OVERVIEW_BOX_METRICS.has(metric)) {
            return (
              <Fragment key={metric}>
                {g.map((row, i) => (
                  <GovStatCard key={`${metric}-${i}-${row.breakdown}-${row.submetric}`} row={row} />
                ))}
              </Fragment>
            );
          }
          return <Fragment key={metric}>{renderMetricGroup(g)}</Fragment>;
        })}
        {isGermany
          ? HEALTH_OVERVIEW_OECD_EXTRA_ROWS.map((row, i) => (
              <GovStatCard key={`health-overview-oecd-${i}-${row.metric}`} row={row} />
            ))
          : null}
      </div>
    </div>
  );
});
