import type { GermanyGovernmentPoliticsRow } from './germanyGovernmentPolitics';
import { formatMaxDigits } from '../../numberFormat';

export function splitUrls(urlField: string): string[] {
  return String(urlField ?? '').split('|').map((url) => url.trim()).filter(Boolean);
}

export function formatValueDisplay(row: GermanyGovernmentPoliticsRow): string {
  const value = row.value.trim();
  if (!value) return 'N/A';
  const unit = row.unit.trim().toLowerCase();
  if (unit === 'percent' || unit.endsWith('percent')) {
    const number = parseFloat(value.replace(/,/g, ''));
    return Number.isFinite(number) ? `${number % 1 === 0 ? number.toFixed(0) : number.toFixed(1)}%` : value;
  }
  const number = Number(value.replace(/,/g, ''));
  if (Number.isFinite(number) && value.includes(',')) {
    return formatMaxDigits(number, 3);
  }
  if (Number.isFinite(number) && /^[\d.]+$/.test(value)) {
    return number % 1 !== 0
      ? number.toLocaleString('en-US', { maximumFractionDigits: 4 })
      : number.toLocaleString('en-US');
  }
  return value;
}

export function metaParts(row: GermanyGovernmentPoliticsRow): string {
  return [row.referenceYear ? `Year: ${row.referenceYear}` : null, row.unit ? `Unit: ${row.unit}` : null]
    .filter(Boolean)
    .join(' · ');
}
