/** Approximate USD→EUR for combining modeled estimates with table € figures. */
const USD_TO_EUR = 0.92;

/**
 * Fallback if `table.csv` is empty at build time or parses to no rows.
 * Mirrors `Assets/Data/Europe/Germany/Economic Statistics Section/table.csv`.
 */
export const GERMANY_ECONOMIC_EXPENDITURE_TABLE_CSV_FALLBACK = `Category,% of Total Expenditure,€ billion (2025 estimate)
"Social Protection (pensions, unemployment, long-term care, family benefits, etc.)",39.0%,~€861
Health,15.0%,~€331
"Economic Affairs (transport, energy, business support, etc.)",12.0%,~€265
"Education (incl. science, research, culture)",10.0%,~€221
"General Public Services (administration, debt interest, etc.)",13.5%,~€298
Public Order & Safety + Defence,~3.5–4.0%,~€77–88
Environmental Protection + Housing & Community Amenities,~4.0%,~€88
"Recreation, Culture & Religion",~1.5%,~€33
"Other (agriculture, etc.)",~2.5%,~€55
`;

function normalizeTableCsvRaw(raw: string): string {
  return raw.replace(/^\uFEFF/, '').trim();
}

function effectiveTableCsv(raw: string): string {
  const n = normalizeTableCsvRaw(raw);
  if (n.length > 0) return n;
  return normalizeTableCsvRaw(GERMANY_ECONOMIC_EXPENDITURE_TABLE_CSV_FALLBACK);
}

export type ExpenditurePieSliceJson = {
  label: string;
  /** Share of combined €-weighted total (sums to 100). */
  value: number;
  /** Estimated € billions used for weighting. */
  detailEurBn?: number;
};

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuote = !inQuote;
      continue;
    }
    if (c === ',' && !inQuote) {
      out.push(cur);
      cur = '';
      continue;
    }
    cur += c;
  }
  out.push(cur);
  return out;
}

function parseEurBnColumn(cell: string): number | null {
  const t = cell.trim().replace(/^~\s*/, '');
  if (!t) return null;
  const range = t.match(/€\s*([\d.,]+)\s*[–-]\s*([\d.,]+)/);
  if (range) {
    const a = parseFloat(range[1]!.replace(/,/g, ''));
    const b = parseFloat(range[2]!.replace(/,/g, ''));
    if (Number.isFinite(a) && Number.isFinite(b)) return (a + b) / 2;
  }
  const single = t.match(/€\s*([\d.,]+)/);
  if (single) {
    const n = parseFloat(single[1]!.replace(/,/g, ''));
    return Number.isFinite(n) && n > 0 ? n : null;
  }
  return null;
}

export function parseGermanyEconomicExpenditureTableForPie(raw: string): Array<{ category: string; eurBn: number }> {
  const lines = normalizeTableCsvRaw(raw).split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const out: Array<{ category: string; eurBn: number }> = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]!);
    if (cols.length < 3) continue;
    const category = cols[0]!.trim();
    const eurBn = parseEurBnColumn(cols[2]!);
    if (!category || eurBn == null || eurBn <= 0) continue;
    out.push({ category, eurBn });
  }
  return out;
}

export function parseUsdBillionsFromDisplay(s: string): number | null {
  const t = s.trim();
  if (!t || t.toUpperCase() === 'N/A') return null;
  const m = t.match(/\$?\s*~?\s*([\d.]+)\s*B/i);
  if (m) {
    const n = Number(m[1]);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/** USD billions → EUR billions (same scale as table €bn column). */
export function usdBillionsToEurBillions(usdBn: number): number {
  return usdBn * USD_TO_EUR;
}

/**
 * Pie weight for the “Immigration welfare spending” slice (€bn), aligned with the 2025 spend line in the UI.
 */
export const GERMANY_IMMIGRATION_WELFARE_PIE_EUR_BN = 46.6;

export function buildGermanyCombinedExpenditurePie(
  tableCsvRaw: string,
  _immigrationWelfareDisplay: string,
  /** Modeled corruption cost in **billions USD** (not raw dollars). */
  corruptionUsdBillions: number | null,
): ExpenditurePieSliceJson[] {
  let tableRows = parseGermanyEconomicExpenditureTableForPie(effectiveTableCsv(tableCsvRaw));
  if (tableRows.length === 0) {
    tableRows = parseGermanyEconomicExpenditureTableForPie(
      normalizeTableCsvRaw(GERMANY_ECONOMIC_EXPENDITURE_TABLE_CSV_FALLBACK),
    );
  }
  const tableEur = tableRows.map((r) => ({ label: r.category, eurBn: r.eurBn }));

  const immEurBn = GERMANY_IMMIGRATION_WELFARE_PIE_EUR_BN;

  let corrEurBn = 0;
  if (corruptionUsdBillions != null && Number.isFinite(corruptionUsdBillions) && corruptionUsdBillions > 0) {
    corrEurBn = usdBillionsToEurBillions(corruptionUsdBillions);
  }

  const all: { label: string; eurBn: number }[] = [
    ...tableEur,
    { label: 'Immigration welfare spending', eurBn: immEurBn },
    ...(corrEurBn > 0 ? [{ label: 'Lost to Corruption', eurBn: corrEurBn }] : []),
  ];

  const total = all.reduce((s, x) => s + x.eurBn, 0);
  if (total <= 0) return [];

  return all.map((x) => ({
    label: x.label,
    value: (x.eurBn / total) * 100,
    detailEurBn: x.eurBn,
  }));
}
