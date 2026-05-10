import { parseCsvRows } from './csv';
import type { GermanyJewishGovernmentEntry } from '../data/germanyJewishGovernmentPeople';

export type GermanyJewishGovernmentPerson = {
  name: string;
  office: string;
  years: string;
  exactWikipediaWording: string;
  wikipediaPage: string;
  language: string;
  matchType: string;
  scopeNote: string;
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

export function parseGermanyJewishGovernmentCsv(raw: string): GermanyJewishGovernmentPerson[] {
  const rows = parseCsvRows(raw.replace(/^\uFEFF/, '').trim());
  if (rows.length < 2) return [];
  const idx = headerIndexMap(rows[0]!);
  const out: GermanyJewishGovernmentPerson[] = [];
  for (let r = 1; r < rows.length; r++) {
    const current = rows[r]!;
    const name = cell(current, idx, 'name');
    if (!name) continue;
    out.push({
      name,
      office: cell(current, idx, 'office'),
      years: cell(current, idx, 'years'),
      exactWikipediaWording: cell(current, idx, 'exact_wikipedia_wording'),
      wikipediaPage: cell(current, idx, 'wikipedia_page'),
      language: cell(current, idx, 'language'),
      matchType: cell(current, idx, 'match_type'),
      scopeNote: cell(current, idx, 'scope_note'),
    });
  }
  return out;
}

function normalizeNameKey(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');
}

/** Maps legacy Wikipedia-based CSV rows into the richer modal shape (federal tier). */
export function jewishGovernmentCsvToEntries(people: GermanyJewishGovernmentPerson[]): GermanyJewishGovernmentEntry[] {
  return people.map((person) => {
    const backgroundParts = [person.exactWikipediaWording, person.years ? `Tenure / period: ${person.years}` : ''].filter(
      Boolean,
    );
    const sourceParts = [
      person.wikipediaPage ? `Wikipedia: ${person.wikipediaPage}` : '',
      person.matchType ? `Heritage note: ${person.matchType}` : '',
      person.language ? `Article language: ${person.language}` : '',
      person.scopeNote ? `Scope: ${person.scopeNote}` : '',
    ].filter(Boolean);
    return {
      tier: 'federal',
      name: person.name,
      position: person.office || 'Office not listed',
      background: backgroundParts.join('\n\n') || '—',
      sourceNotes: sourceParts.join(' · ') || '—',
    } satisfies GermanyJewishGovernmentEntry;
  });
}

/** Append CSV-derived profiles after curated rows, skipping duplicate names. */
export function mergeCuratedAndLegacyJewishGovernment(
  curated: GermanyJewishGovernmentEntry[],
  legacyPeople: GermanyJewishGovernmentPerson[],
): GermanyJewishGovernmentEntry[] {
  const keys = new Set(curated.map((e) => normalizeNameKey(e.name)));
  const legacyEntries = jewishGovernmentCsvToEntries(legacyPeople).filter((e) => {
    const k = normalizeNameKey(e.name);
    if (keys.has(k)) return false;
    keys.add(k);
    return true;
  });
  return [...curated, ...legacyEntries];
}
