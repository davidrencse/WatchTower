import type { CountryWideRow } from './parseCountriesWideCsv';

/**
 * Crime-tile column mapping and the source-link collector.
 *
 * These live outside `CrimeMetricsSection` so the dashboard can read crime
 * source URLs for its Sources list without statically importing that component
 * — which would drag recharts onto the country-page critical path.
 */
export type CrimeBoxConfig = {
  id: string;
  title: string;
  valueKey: keyof CountryWideRow;
  yearKey: keyof CountryWideRow;
  unitKey: keyof CountryWideRow;
  definitionKey: keyof CountryWideRow;
  sourceUrlKey: keyof CountryWideRow;
  sourceLabelKey: keyof CountryWideRow;
  methodNoteKey: keyof CountryWideRow;
};

export const CRIME_BOXES: CrimeBoxConfig[] = [
  {
    id: 'petty-latest',
    title: 'Petty crime statistics',
    valueKey: 'petty_latest_value',
    yearKey: 'petty_latest_year',
    unitKey: 'petty_latest_unit',
    definitionKey: 'petty_latest_definition',
    sourceUrlKey: 'petty_latest_source_url',
    sourceLabelKey: 'petty_latest_source_label',
    methodNoteKey: 'petty_latest_method_note',
  },
  {
    id: 'rape-latest',
    title: 'Rape crime statistics',
    valueKey: 'rape_latest_value',
    yearKey: 'rape_latest_year',
    unitKey: 'rape_latest_unit',
    definitionKey: 'rape_latest_definition',
    sourceUrlKey: 'rape_latest_source_url',
    sourceLabelKey: 'rape_latest_source_label',
    methodNoteKey: 'rape_latest_method_note',
  },
  {
    id: 'theft-latest',
    title: 'Theft crime statistics',
    valueKey: 'theft_latest_value',
    yearKey: 'theft_latest_year',
    unitKey: 'theft_latest_unit',
    definitionKey: 'theft_latest_definition',
    sourceUrlKey: 'theft_latest_source_url',
    sourceLabelKey: 'theft_latest_source_label',
    methodNoteKey: 'theft_latest_method_note',
  },
  {
    id: 'sexual-latest',
    title: 'Sexual crime statistics',
    valueKey: 'sexual_latest_value',
    yearKey: 'sexual_latest_year',
    unitKey: 'sexual_latest_unit',
    definitionKey: 'sexual_latest_definition',
    sourceUrlKey: 'sexual_latest_source_url',
    sourceLabelKey: 'sexual_latest_source_label',
    methodNoteKey: 'sexual_latest_method_note',
  },
];

export function collectCrimeSourceUrls(row: CountryWideRow | null): { url: string; label: string }[] {
  if (!row) return [];
  const out: { url: string; label: string }[] = [];
  const seen = new Set<string>();
  for (const cfg of CRIME_BOXES) {
    const u = String(row[cfg.sourceUrlKey] ?? '').trim();
    if (!u || seen.has(u)) continue;
    seen.add(u);
    const label = String(row[cfg.sourceLabelKey] ?? '').trim();
    try {
      const host = new URL(u).hostname.replace(/^www\./, '');
      out.push({ url: u, label: label || host });
    } catch {
      out.push({ url: u, label: label || u.slice(0, 48) });
    }
  }
  return out;
}
