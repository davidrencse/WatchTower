/** Minimal RFC 4180-style parser (quoted fields, doubled quotes). */
export function parseCsvRows(raw: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let i = 0;
  let inQuotes = false;

  while (i < raw.length) {
    const c = raw[i]!;

    if (inQuotes) {
      if (c === '"') {
        if (raw[i + 1] === '"') {
          cell += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      cell += c;
      i += 1;
      continue;
    }

    if (c === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }
    if (c === ',') {
      row.push(cell);
      cell = '';
      i += 1;
      continue;
    }
    if (c === '\r') {
      i += 1;
      continue;
    }
    if (c === '\n') {
      row.push(cell);
      if (row.some((x) => x.length > 0)) rows.push(row);
      row = [];
      cell = '';
      i += 1;
      continue;
    }
    cell += c;
    i += 1;
  }

  row.push(cell);
  if (row.some((x) => x.length > 0)) rows.push(row);

  return rows;
}

/**
 * Case-insensitive header lookup table for a CSV header row.
 *
 * Keys are lowercased and stripped of the BOM that Excel-exported tables carry on their first
 * column, so `cell(row, idx, 'Metric')` resolves whatever casing the source file happens to use.
 */
export function headerIndexMap(headerRow: string[]): Map<string, number> {
  const m = new Map<string, number>();
  headerRow.forEach((h, i) => {
    const k = h.replace(/\uFEFF/g, '').trim().toLowerCase();
    if (k) m.set(k, i);
  });
  return m;
}

/**
 * First non-missing column value for a row, trying each candidate header name in order.
 * Returns `''` when none of the names exist, so callers never have to null-check.
 */
export function cell(row: string[], idx: Map<string, number>, ...names: string[]): string {
  for (const n of names) {
    const i = idx.get(n.toLowerCase());
    if (i !== undefined) return (row[i] ?? '').trim();
  }
  return '';
}

/**
 * Canonical form for matching a free-text label (country name, metric name) across tables:
 * trimmed, lowercased, and with runs of whitespace collapsed. Source CSVs disagree on casing
 * and spacing, so every row lookup normalises both sides before comparing.
 */
export function normalizeLabel(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}
