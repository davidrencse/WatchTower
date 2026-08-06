import type { CountryStatMetric } from '../../../types/countryStats';
import { parseCsvRows } from '../../csv';

type IndicatorRow = {
  country: string; metric: string; value: string; unit: string;
  reference_year: string; source: string; source_url: string; method_note: string;
};

function parseRows(raw: string): IndicatorRow[] {
  const rows = parseCsvRows(raw.trim());
  if (rows.length < 2) return [];
  const headers = rows[0]!.map((header) => header.trim());
  return rows.slice(1).map((cells) => {
    const row: Record<string, string> = {};
    headers.forEach((header, index) => { row[header] = (cells[index] ?? '').trim(); });
    return row as unknown as IndicatorRow;
  });
}

function urls(value: string): string {
  return value.split(';').map((url) => url.trim()).filter(Boolean).join(' | ');
}

function number(value: string, digits = 1): string {
  const parsed = Number(value);
  return Number.isFinite(parsed)
    ? new Intl.NumberFormat('en-US', { maximumFractionDigits: digits }).format(parsed)
    : value;
}

function formatted(row: IndicatorRow): string {
  switch (row.unit) {
    case 'live_births_and_percent': return `${number(row.value, 0)} live births (26.4%)`;
    case 'deaths_per_1000_live_births': return `${number(row.value)} per 1,000 live births`;
    case 'percent': return `${number(row.value)}%`;
    case 'abortions_per_1000_women_15_49': return `${number(row.value)} per 1,000 women aged 15–49`;
    case 'births_per_1000_women_15_19': return `${number(row.value, 3)} per 1,000 women aged 15–19`;
    case 'years': return `${number(row.value)} years`;
    default: return row.value;
  }
}

function toMetric(metric: string, row: IndicatorRow, suffix = ''): CountryStatMetric {
  return {
    metric, value: `${formatted(row)}${suffix}`, reference_period: row.reference_year,
    geography_used: row.country || 'France', source_name: row.source,
    source_url: urls(row.source_url), source_publication_or_access_date: row.reference_year,
    notes: row.method_note,
  };
}

/** France-only metrics for Demographics → Birth rates. */
export function metricsFromFranceBirthHealthCsv(raw: string): CountryStatMetric[] {
  const byKey = new Map(parseRows(raw).map((row) => [row.metric, row]));
  const output: CountryStatMetric[] = [];
  const add = (key: string, label: string, suffix = '') => {
    const row = byKey.get(key);
    if (row) output.push(toMetric(label, row, suffix));
  };
  add('births_to_foreign_born_mothers', 'Births to foreign-born mothers');
  add('infant_mortality_rate', 'Infant mortality rate');
  add('child_mortality_rate_under_5', 'Child mortality rate', ' (under-5)');
  add('contraceptive_use', 'Contraceptive use');
  add('abortion_rate', 'Abortion rate');
  add('teen_birth_rate', 'Teen birth rate');
  add('mean_age_of_mothers_at_childbirth', 'Mean age of mothers at childbirth');
  add('childhood_overweight_and_obesity', 'Childhood overweight and obesity (France)');
  return output;
}
