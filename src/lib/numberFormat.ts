/**
 * Shared `Intl` formatters.
 *
 * Building an `Intl.NumberFormat` costs roughly 57x what `format()` on an existing one does, and
 * these were being constructed *inside* Recharts `tickFormatter` / tooltip `formatter` callbacks —
 * so once per axis tick and once per tooltip row, on every chart render. Holding one instance per
 * shape at module scope turns that into a single construction per page load.
 *
 * Every helper keeps the exact option set of the call site it replaced; nothing here changes how a
 * figure reads.
 */

/** `12.3K`, `4.5M` — axis ticks and tooltip values on the dossier charts. */
const COMPACT = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });

/** Grouped with the `Intl` default of up to three decimals. */
const GROUPED = new Intl.NumberFormat('en-US');

/** Grouped, rounded to whole units. */
const WHOLE = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

const USD_2DP = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** `30 Jul 2026` — event feeds. */
const SHORT_DATE = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

/** Formatters that vary by precision, built on first use and kept for the session. */
const byMaxDigits = new Map<number, Intl.NumberFormat>();

export function formatCompact(value: number): string {
  return COMPACT.format(value);
}

export function formatGrouped(value: number): string {
  return GROUPED.format(value);
}

export function formatWhole(value: number): string {
  return WHOLE.format(value);
}

export function formatUsd2(value: number): string {
  return USD_2DP.format(value);
}

/** Grouped with at most `digits` decimals — the precision several callers pick per value. */
export function formatMaxDigits(value: number, digits: number): string {
  let formatter = byMaxDigits.get(digits);
  if (!formatter) {
    formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: digits,
    });
    byMaxDigits.set(digits, formatter);
  }
  return formatter.format(value);
}

export function formatShortDate(date: Date): string {
  return SHORT_DATE.format(date);
}
