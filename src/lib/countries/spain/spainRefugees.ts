/**
 * UNHCR Spain population figures, mid-2025, published in 2026.
 * The headline follows UNHCR's Rights Mapping and Analysis Platform. The
 * origin chart uses the five named cohorts in UNHCR's Spain fact sheet.
 */
export const SPAIN_REFUGEES_2025 = 471_081;

export const SPAIN_REFUGEE_NOTE =
  'Spain, mid-2025 — UNHCR refugee population. Excludes 276,450 asylum-seekers, which UNHCR reports separately.';

export const SPAIN_REFUGEE_BREAKDOWN_2025 = [
  { country: 'Ukraine', count: 237_005 },
  { country: 'Venezuela', count: 156_037 },
  { country: 'Syria', count: 17_749 },
  { country: 'Mali', count: 13_865 },
  { country: 'Afghanistan', count: 5_047 },
  { country: 'Other origins', count: 41_378 },
] as const;

export const SPAIN_REFUGEE_SOURCE_URL =
  'https://rimap.unhcr.org/countries/spain';
