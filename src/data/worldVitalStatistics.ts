/**
 * World vital rates and the 2025 births distribution.
 *
 * The HUD counters are **elapsed-session projections**, not live feeds: there is no wire that
 * reports a birth as it happens. Each counter multiplies a published annual figure by the time
 * the session has been open. That makes them honest as rates and meaningless as events — the
 * panel labels them accordingly, and `RATE_BASIS_NOTE` is rendered with them.
 *
 * The births breakdown is the UN World Population Prospects 2024 projection for 2025, the same
 * revision Our World in Data publishes. Countries below roughly 400k births are folded into
 * their region's "Rest of" bucket, which is how the source aggregates them.
 */

export interface WorldVitalRate {
  id: 'births' | 'deaths' | 'suicide';
  label: string;
  /** Events per year, as published. */
  perYear: number;
  color: string;
  source: string;
  sourceUrl: string;
}

/** Mean tropical year in seconds — the divisor behind every per-second figure below. */
const SECONDS_PER_YEAR = 31_556_952;

export const WORLD_VITAL_RATES: readonly WorldVitalRate[] = [
  {
    id: 'births',
    label: 'Births',
    perYear: 132_300_000,
    color: '#7fc99a',
    source: 'UN World Population Prospects 2024 — 2025 projection',
    sourceUrl: 'https://population.un.org/wpp/',
  },
  {
    id: 'deaths',
    label: 'Deaths',
    perYear: 62_000_000,
    color: '#8fb4d9',
    source: 'UN World Population Prospects 2024 — 2025 projection',
    sourceUrl: 'https://population.un.org/wpp/',
  },
  {
    id: 'suicide',
    label: 'Suicide',
    perYear: 727_000,
    color: '#c07f8f',
    source: 'WHO — Suicide fact sheet',
    sourceUrl: 'https://www.who.int/news-room/fact-sheets/detail/suicide',
  },
];

/** Events per second for a rate, used by the HUD tick. */
export function perSecond(rate: WorldVitalRate): number {
  return rate.perYear / SECONDS_PER_YEAR;
}

/** Mean seconds between events, for the "one every N" readout. */
export function secondsBetween(rate: WorldVitalRate): number {
  return SECONDS_PER_YEAR / rate.perYear;
}

export const RATE_BASIS_NOTE =
  'Elapsed-session projection from published annual rates — not a live event feed.';

// --- Births by country, 2025 ------------------------------------------------

export type BirthRegionId =
  | 'asia'
  | 'africa'
  | 'europe'
  | 'northAmerica'
  | 'southAmerica'
  | 'oceania';

export interface BirthRegion {
  id: BirthRegionId;
  label: string;
  /** Regional total including the countries listed individually. */
  total: number;
  color: string;
}

export const BIRTH_REGIONS: readonly BirthRegion[] = [
  { id: 'asia', label: 'Asia', total: 65_100_000, color: '#d9536f' },
  { id: 'africa', label: 'Africa', total: 47_100_000, color: '#e0748c' },
  { id: 'northAmerica', label: 'North America', total: 7_600_000, color: '#a63f57' },
  { id: 'europe', label: 'Europe', total: 6_200_000, color: '#8f3549' },
  { id: 'southAmerica', label: 'South America', total: 5_600_000, color: '#c04a64' },
  { id: 'oceania', label: 'Oceania', total: 687_000, color: '#7a2c3d' },
];

export interface CountryBirths {
  iso3: string;
  label: string;
  region: BirthRegionId;
  births: number;
}

/** World total for 2025, as published. */
export const WORLD_BIRTHS_2025 = 132_300_000;

export const BIRTHS_BY_COUNTRY_2025: readonly CountryBirths[] = [
  // Asia
  { iso3: 'IND', label: 'India', region: 'asia', births: 23_100_000 },
  { iso3: 'CHN', label: 'China', region: 'asia', births: 8_700_000 },
  { iso3: 'PAK', label: 'Pakistan', region: 'asia', births: 6_900_000 },
  { iso3: 'IDN', label: 'Indonesia', region: 'asia', births: 4_400_000 },
  { iso3: 'BGD', label: 'Bangladesh', region: 'asia', births: 3_400_000 },
  { iso3: 'PHL', label: 'Philippines', region: 'asia', births: 1_800_000 },
  { iso3: 'AFG', label: 'Afghanistan', region: 'asia', births: 1_500_000 },
  { iso3: 'YEM', label: 'Yemen', region: 'asia', births: 1_400_000 },
  { iso3: 'VNM', label: 'Vietnam', region: 'asia', births: 1_300_000 },
  { iso3: 'IRQ', label: 'Iraq', region: 'asia', births: 1_200_000 },
  { iso3: 'TUR', label: 'Türkiye', region: 'asia', births: 1_100_000 },
  { iso3: 'IRN', label: 'Iran', region: 'asia', births: 1_100_000 },
  { iso3: 'UZB', label: 'Uzbekistan', region: 'asia', births: 911_000 },
  { iso3: 'MMR', label: 'Myanmar', region: 'asia', births: 888_000 },
  { iso3: 'JPN', label: 'Japan', region: 'asia', births: 748_000 },
  { iso3: 'SAU', label: 'Saudi Arabia', region: 'asia', births: 565_000 },
  { iso3: 'NPL', label: 'Nepal', region: 'asia', births: 552_000 },
  { iso3: 'MYS', label: 'Malaysia', region: 'asia', births: 440_000 },
  { iso3: 'KAZ', label: 'Kazakhstan', region: 'asia', births: 395_000 },
  { iso3: 'XSA', label: 'Rest of Asia', region: 'asia', births: 769_000 },

  // Africa
  { iso3: 'NGA', label: 'Nigeria', region: 'africa', births: 7_600_000 },
  { iso3: 'COD', label: 'DR Congo', region: 'africa', births: 4_600_000 },
  { iso3: 'ETH', label: 'Ethiopia', region: 'africa', births: 4_200_000 },
  { iso3: 'EGY', label: 'Egypt', region: 'africa', births: 2_500_000 },
  { iso3: 'TZA', label: 'Tanzania', region: 'africa', births: 2_400_000 },
  { iso3: 'UGA', label: 'Uganda', region: 'africa', births: 1_700_000 },
  { iso3: 'SDN', label: 'Sudan', region: 'africa', births: 1_700_000 },
  { iso3: 'KEN', label: 'Kenya', region: 'africa', births: 1_500_000 },
  { iso3: 'AGO', label: 'Angola', region: 'africa', births: 1_400_000 },
  { iso3: 'MOZ', label: 'Mozambique', region: 'africa', births: 1_300_000 },
  { iso3: 'ZAF', label: 'South Africa', region: 'africa', births: 1_200_000 },
  { iso3: 'NER', label: 'Niger', region: 'africa', births: 1_100_000 },
  { iso3: 'CIV', label: "Côte d'Ivoire", region: 'africa', births: 1_000_000 },
  { iso3: 'CMR', label: 'Cameroon', region: 'africa', births: 1_000_000 },
  { iso3: 'MDG', label: 'Madagascar', region: 'africa', births: 1_000_000 },
  { iso3: 'MLI', label: 'Mali', region: 'africa', births: 1_000_000 },
  { iso3: 'TCD', label: 'Chad', region: 'africa', births: 907_000 },
  { iso3: 'GHA', label: 'Ghana', region: 'africa', births: 898_000 },
  { iso3: 'DZA', label: 'Algeria', region: 'africa', births: 855_000 },
  { iso3: 'SOM', label: 'Somalia', region: 'africa', births: 822_000 },
  { iso3: 'BFA', label: 'Burkina Faso', region: 'africa', births: 742_000 },
  { iso3: 'ZMB', label: 'Zambia', region: 'africa', births: 709_000 },
  { iso3: 'MWI', label: 'Malawi', region: 'africa', births: 685_000 },
  { iso3: 'MAR', label: 'Morocco', region: 'africa', births: 619_000 },
  { iso3: 'GIN', label: 'Guinea', region: 'africa', births: 495_000 },
  { iso3: 'BDI', label: 'Burundi', region: 'africa', births: 469_000 },
  { iso3: 'XAF', label: 'Rest of Africa', region: 'africa', births: 807_000 },

  // Europe
  { iso3: 'DEU', label: 'Germany', region: 'europe', births: 708_000 },
  { iso3: 'GBR', label: 'United Kingdom', region: 'europe', births: 680_000 },
  { iso3: 'RUS', label: 'Russia', region: 'europe', births: 1_200_000 },
  { iso3: 'XEU', label: 'Rest of Europe', region: 'europe', births: 1_400_000 },

  // North America
  { iso3: 'USA', label: 'United States', region: 'northAmerica', births: 3_700_000 },
  { iso3: 'MEX', label: 'Mexico', region: 'northAmerica', births: 2_000_000 },
  { iso3: 'XNA', label: 'Rest of N. America', region: 'northAmerica', births: 403_000 },

  // South America
  { iso3: 'BRA', label: 'Brazil', region: 'southAmerica', births: 2_500_000 },
  { iso3: 'COL', label: 'Colombia', region: 'southAmerica', births: 693_000 },
  { iso3: 'XSC', label: 'Rest of S. America', region: 'southAmerica', births: 68_000 },

  // Oceania
  { iso3: 'AUS', label: 'Australia', region: 'oceania', births: 304_000 },
  { iso3: 'XOC', label: 'Rest of Oceania', region: 'oceania', births: 125_000 },
];

export const BIRTHS_SOURCE = {
  organization: 'UN Population Division',
  title: 'World Population Prospects 2024 — births by country, 2025 projection',
  url: 'https://population.un.org/wpp/',
};
