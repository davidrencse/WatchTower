import { parseCsvRows } from './csv';

export type CountryWideRow = Record<string, string>;

export function parseCountriesWideCsv(raw: string): CountryWideRow[] {
  const rows = parseCsvRows(raw.trim());
  if (rows.length < 2) return [];

  const headers = rows[0]!.map((h) => h.trim());
  return rows.slice(1).map((cells) => {
    const o: CountryWideRow = {};
    headers.forEach((h, i) => {
      o[h] = (cells[i] ?? '').trim();
    });
    return o;
  });
}

/**
 * A row carrying every column of `rows` but no values, for a country the shared table has no
 * entry for yet. Lets the dashboard render its full template with the usual labeled placeholders
 * instead of collapsing to an error: no figure is invented, each slot simply reads blank.
 */
export function blankCountryWideRow(
  rows: CountryWideRow[],
  iso3: string,
  country: string,
): CountryWideRow {
  const blank: CountryWideRow = {};
  for (const key of Object.keys(rows[0] ?? {})) blank[key] = '';
  blank.iso3 = iso3;
  blank.country = country;
  return blank;
}

export function indexCountriesByIso3(rows: CountryWideRow[]): Map<string, CountryWideRow> {
  const m = new Map<string, CountryWideRow>();
  for (const r of rows) {
    const iso = r.iso3?.trim().toUpperCase();
    if (iso) m.set(iso, r);
  }
  return m;
}

