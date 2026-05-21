import type { CountryStatMetric } from '../types/countryStats';
import type { CountryWideRow } from './parseCountriesWideCsv';

function norm(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

const COUNTRY_ALIASES: Record<string, string> = {
  'bosnia herzegovina': 'bosnia and herzegovina',
  'united states': 'united states of america',
  usa: 'united states of america',
};

function toUrlOrEmpty(text: string): string {
  const t = text.trim();
  if (!t) return '';
  if (/^https?:\/\//i.test(t)) return t;
  return '';
}

function immigrationWelfareDisplay(row: CountryWideRow | null, iso3?: string): string {
  const raw = row ? String(row['Immigration Welfare Spending (latest estimate)'] ?? '').trim() : '';
  const missing = !raw || raw.toUpperCase() === 'N/A';
  if (iso3 === 'DEU' && missing) return 'See year selector (Government spending)';
  return raw || 'N/A';
}

function tile(metric: string, value: string, ref: string, geo: string, url: string, notes = ''): CountryStatMetric {
  return {
    metric,
    value,
    reference_period: ref,
    geography_used: geo,
    source_name: '',
    source_url: url,
    source_publication_or_access_date: ref,
    notes,
  };
}

export function findExpenditureRow(rows: CountryWideRow[], countryName: string): CountryWideRow | null {
  const targetNorm = norm(countryName);
  const target = COUNTRY_ALIASES[targetNorm] ?? targetNorm;
  for (const r of rows) {
    const c = norm(String(r.Country ?? r.country ?? ''));
    if (c === target) return r;
  }
  return null;
}

function foreignAidMetricGermany(): CountryStatMetric {
  return {
    metric: 'Foreign Aid',
    value: 'See year selector (Government spending)',
    reference_period: 'OECD development co-operation profile',
    geography_used: 'Germany',
    source_name: '',
    source_url:
      'https://www.oecd.org/en/publications/development-co-operation-profiles_04b376d7-en/germany_460a37b1-en.html|https://www.bundesregierung.de/breg-en/news/germany-aid-for-ukraine-2192480',
    source_publication_or_access_date: 'OECD / Federal Government',
    notes:
      'OECD: official development assistance and GNI share. Federal Government: context on support including Ukraine (humanitarian, financial, military, and related programmes).',
  };
}

/** When `expenditures.csv` has no row for Germany, still show immigration welfare from defaults. */
export function metricsGermanyGovernmentSpendingWithoutExpenditureCsv(
  _corruptionRow: CountryWideRow | null,
  countryLabel: string,
): CountryStatMetric[] {
  const ref = '2025 (est.)';
  const geo = countryLabel;
  const source = 'Germany Economic Statistics table.csv (2025 est.)';
  const sourceUrl = '';
  return [
    tile('Immigration welfare spending', immigrationWelfareDisplay(null, 'DEU'), ref, geo, sourceUrl, source),
    foreignAidMetricGermany(),
  ];
}

export function metricsFromExpenditureRow(
  row: CountryWideRow,
  iso3?: string,
  _corruptionRow?: CountryWideRow | null,
): CountryStatMetric[] {
  const geo = String(row.Country ?? '').trim();
  const ref = String(row['Latest Year'] ?? '').trim();
  const source = String(row['Spending Details & Source'] ?? '').trim();
  const sourceUrl = toUrlOrEmpty(source);

  const out: CountryStatMetric[] = [
    tile(
      'Immigration welfare spending',
      immigrationWelfareDisplay(row, iso3),
      ref,
      geo,
      sourceUrl,
      source,
    ),
  ];
  if (iso3?.toUpperCase() === 'DEU') {
    out.push(foreignAidMetricGermany());
  }
  return out;
}
