import { parseCsvRows } from './csv';
import type { GermanyGovernmentPoliticsRow } from './germanyGovernmentPolitics';
import { clusterRowsByMetric } from './germanyGovernmentPolitics';

/** Same column layout as germany_labor_statistics.csv / government politics exports. */
export type GermanyMetricTableRow = {
  country: string;
  metric: string;
  submetric: string;
  breakdown: string;
  value: string;
  unit: string;
  referenceYear: string;
  sourceName: string;
  sourceUrl: string;
  notes: string;
};

function headerIndexMap(headerRow: string[]): Map<string, number> {
  const m = new Map<string, number>();
  headerRow.forEach((h, i) => {
    const k = h.replace(/\uFEFF/g, '').trim().toLowerCase();
    if (k) m.set(k, i);
  });
  return m;
}

function cell(row: string[], idx: Map<string, number>, ...names: string[]): string {
  for (const n of names) {
    const i = idx.get(n.toLowerCase());
    if (i !== undefined) return (row[i] ?? '').trim();
  }
  return '';
}

export function parseGermanyMetricTableCsv(raw: string): GermanyMetricTableRow[] {
  const rows = parseCsvRows(raw.replace(/^\uFEFF/, '').trim());
  if (rows.length < 2) return [];
  const idx = headerIndexMap(rows[0]!);
  const out: GermanyMetricTableRow[] = [];
  for (let r = 1; r < rows.length; r++) {
    const cells = rows[r]!;
    const country = cell(cells, idx, 'country');
    if (country && country.toLowerCase() !== 'germany') continue;
    const metric = cell(cells, idx, 'metric');
    if (!metric) continue;
    out.push({
      country: country || 'Germany',
      metric,
      submetric: cell(cells, idx, 'submetric'),
      breakdown: cell(cells, idx, 'breakdown'),
      value: cell(cells, idx, 'value'),
      unit: cell(cells, idx, 'unit'),
      referenceYear: cell(cells, idx, 'reference year', 'reference_year'),
      sourceName: cell(cells, idx, 'source name', 'source_name'),
      sourceUrl: cell(cells, idx, 'source url', 'source_url'),
      notes: cell(cells, idx, 'notes'),
    });
  }
  return out;
}

/**
 * Display order for germany_health_statistics_basic.csv (metric column).
 * Matches Overview: expenditure, obesity, smoking, suicide rate, physicians, doctors, HALE, preventable mortality, alcohol.
 */
export const GERMANY_HEALTH_BASIC_METRIC_ORDER = [
  'Healthcare expenditure',
  'Obesity rate',
  'Smoking prevalence',
  'Suicide Rate',
  'Physicians per 1,000 people',
  'Total number of doctors',
  'Healthy life expectancy',
  'Preventable mortality rate',
  'Alcohol consumption',
] as const;

/** Extra OECD country-note cards rendered in Overview (not from CSV). */
export const GERMANY_HEALTH_BASIC_STATIC_OECD_BOX_COUNT = 4;

export const GERMANY_HEALTH_BASIC_GROUP_COUNT =
  GERMANY_HEALTH_BASIC_METRIC_ORDER.length + GERMANY_HEALTH_BASIC_STATIC_OECD_BOX_COUNT;

/** Display order for germany_gender_care_statistics.csv (adult/general LGBT metrics). */
export const GERMANY_LGBT_METRIC_ORDER = [
  'Total annual genital gender-affirming surgeries',
  'Masculinizing genital surgeries',
  'Feminizing genital surgeries',
  'Number of facilities/hospitals performing gender-affirming surgeries',
] as const;

/** Display order for child-focused rows nested under Health -> LGBT -> Children. */
export const GERMANY_LGBT_CHILDREN_METRIC_ORDER = [
  'Law on childhood gender-affirming care',
  'Puberty blocker prescription rates',
  'Cross-sex hormone therapy initiation in minors',
  'Youth with gender dysphoria/incongruence receiving medical interventions',
  'Diagnostic stability of gender dysphoria in youth',
  'Detransition or desistance rates',
  'Regret rates after gender-affirming interventions in minors',
  'Age distribution of first medical intervention',
  'Concurrent mental health comorbidities in youth referred for care',
  'Genital surgery in minors',
] as const;

/** Health -> LGBT subsection card-count including nested Children metrics. */
export const GERMANY_LGBT_SECTION_GROUP_COUNT =
  GERMANY_LGBT_METRIC_ORDER.length + GERMANY_LGBT_CHILDREN_METRIC_ORDER.length;

function metricOrderIndex(metric: string, order: readonly string[]): number {
  const m = metric.trim();
  const i = order.indexOf(m);
  return i === -1 ? 999 + m.localeCompare('') : i;
}

export function metricTableToPoliticsRows(
  rows: GermanyMetricTableRow[],
  section: string,
  order: readonly string[],
): GermanyGovernmentPoliticsRow[] {
  const allowed = new Set(order.map((m) => m.trim()));
  const filtered = rows.filter((r) => allowed.has(r.metric.trim()));
  const sorted = [...filtered].sort((a, b) => {
    const d = metricOrderIndex(a.metric, order) - metricOrderIndex(b.metric, order);
    if (d !== 0) return d;
    const s = (a.submetric || '').localeCompare(b.submetric || '', undefined, { sensitivity: 'base' });
    if (s !== 0) return s;
    return (a.breakdown || '').localeCompare(b.breakdown || '', undefined, { sensitivity: 'base' });
  });
  return sorted.map(
    (r): GermanyGovernmentPoliticsRow => ({
      section,
      subsection: '',
      metric: r.metric,
      submetric: r.submetric,
      breakdown: r.breakdown,
      value: r.value,
      unit: r.unit,
      referenceYear: r.referenceYear,
      sourceName: r.sourceName,
      sourceUrl: r.sourceUrl,
      notes: r.notes,
    }),
  );
}

export function clusterMetricTable(
  rows: GermanyMetricTableRow[],
  section: string,
  order: readonly string[],
): GermanyGovernmentPoliticsRow[][] {
  const politics = metricTableToPoliticsRows(rows, section, order);
  return clusterRowsByMetric(politics);
}

/** Display order for germany_abortion_statistics.csv. Repeat abortions omitted (not shown). */
export const GERMANY_ABORTION_METRIC_ORDER = [
  'Total number of abortions',
  'Abortion ratio',
  'Trend in total abortions',
  'Abortion rate per 1,000 women of reproductive age',
  'Gestational age at abortion',
  'Method of abortion',
  'Late-term abortions',
  'Number of abortion-providing facilities',
] as const;

/** CSV metric groups plus one manual block (marital / relationship status). */
export const GERMANY_ABORTION_SECTION_GROUP_COUNT = GERMANY_ABORTION_METRIC_ORDER.length + 1;
