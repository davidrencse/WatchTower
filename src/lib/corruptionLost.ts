import type { CountryStatMetric } from '../types/countryStats';
import type { CountryWideRow } from './parseCountriesWideCsv';

function norm(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

/** Aligns merged-stats country labels with `corruption_money_lost_modeled_estimates.csv` `Country` names. */
const COUNTRY_ALIASES: Record<string, string> = {
  'bosnia herzegovina': 'bosnia and herzegovina',
  'united states': 'united states of america',
  usa: 'united states of america',
  'russian federation': 'russia',
  uk: 'united kingdom',
};

function extractHttpsUrls(text: string): string {
  const urls = text.match(/https?:\/\/[^\s"'<>]+/g) ?? [];
  return [...new Set(urls)].join('|');
}

/** Germany modeled-estimate narrative from `corruption_money_lost_modeled_estimates.csv` (three source URLs). */
const GERMANY_CORRUPTION_MODELED_SOURCE =
  'Estimated from World Bank GDP (country page / GDP current US$, latest year shown) and Transparency International CPI 2024; formula: GDP × 5% × ((100−CPI)/57), where 5% is the widely cited global corruption-cost anchor and 57 = 100−43 using TI\'s 2024 global average CPI of 43. GDP source family: https://data.worldbank.org/indicator/NY.GDP.MKTP.CD ; CPI source: https://www.transparency.org/en/cpi/2024 ; global cost anchor: https://blogs.worldbank.org/en/governance/what-are-costs-corruption';

export const GERMANY_CORRUPTION_LOST_SOURCE_URL = extractHttpsUrls(GERMANY_CORRUPTION_MODELED_SOURCE);

function fmtUsdBillions(value: number): string {
  const inBillions = value / 1_000_000_000;
  return `$${inBillions.toFixed(1)}B`;
}

export function findCorruptionLostRow(rows: CountryWideRow[], countryName: string): CountryWideRow | null {
  const targetNorm = norm(countryName);
  const target = COUNTRY_ALIASES[targetNorm] ?? targetNorm;
  for (const r of rows) {
    const c = norm(String(r.Country ?? r.country ?? ''));
    if (c === target) return r;
  }
  return null;
}

export function lostToCorruptionMetric(row: CountryWideRow | null, geographyLabel: string): CountryStatMetric {
  if (!row) {
    return {
      metric: 'Lost to Corruption',
      value: 'N/A',
      reference_period: '',
      geography_used: geographyLabel,
      source_name: '',
      source_url: '',
      source_publication_or_access_date: '',
      notes: 'No modeled estimate in corruption_money_lost_modeled_estimates.csv for this country.',
    };
  }
  const rawMoney = String(row['Money Lost in Dollars'] ?? '').replace(/,/g, '');
  const n = Number(rawMoney);
  const value = Number.isFinite(n) ? fmtUsdBillions(n) : 'N/A';
  const sourceText = String(row.Source ?? '').trim();
  return {
    metric: 'Lost to Corruption',
    value,
    reference_period: '2024 (modeled)',
    geography_used: String(row.Country ?? geographyLabel).trim(),
    source_name: '',
    source_url: extractHttpsUrls(sourceText),
    source_publication_or_access_date: '2024 (modeled)',
    notes: sourceText,
  };
}

/**
 * Inserts after Immigration welfare spending so order is:
 * Immigration → Lost to Corruption → (Foreign Aid for DE).
 */
export function insertLostToCorruptionMetric(
  metrics: CountryStatMetric[],
  corruptionRow: CountryWideRow | null,
  geographyLabel: string,
  iso3?: string,
): void {
  /** Germany uses year-series tile + chart in Government spending (see germanyCorruptionLostByYear). */
  if (iso3?.toUpperCase() === 'DEU') return;

  const lost = lostToCorruptionMetric(corruptionRow, geographyLabel);
  const immIdx = metrics.findIndex((m) => m.metric === 'Immigration welfare spending');
  if (immIdx >= 0) {
    metrics.splice(immIdx + 1, 0, lost);
    return;
  }
  metrics.push(lost);
}
