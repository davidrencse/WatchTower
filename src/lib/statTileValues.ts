import type { CountryStatMetric } from '../types/countryStats';

export function extractLeadingPercent(value: string): number | null {
  const match = value.trim().match(/^([\d.]+)\s*%/);
  if (!match) return null;
  const percent = parseFloat(match[1]!);
  return Number.isFinite(percent) ? percent : null;
}

export function isUnavailable(value: string): boolean {
  const normalized = value.trim();
  return normalized === '' || normalized.toUpperCase() === 'N/A';
}

export function isPendingSlot(row: Pick<CountryStatMetric, 'value' | 'source_name'>): boolean {
  return row.value.trim() === 'Data needed' || row.source_name.trim() === 'Germany-template slot';
}
