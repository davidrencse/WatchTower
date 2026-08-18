/**
 * Spain — Government → Citizenship.
 *
 * The definitive acquisition series, age bands, routes and prior nationalities
 * come from INE's 2025 EANER release. Operational application/outcome figures
 * come from the Ministry of Justice extract updated 30 June 2026. These are
 * different administrative populations and are deliberately labelled as such.
 */

export const SPAIN_CITIZENSHIP_SERIES = [
  { year: 2013, total: 225793 },
  { year: 2014, total: 205880 },
  { year: 2015, total: 114351 },
  { year: 2016, total: 150944 },
  { year: 2017, total: 66498 },
  { year: 2018, total: 90774 },
  { year: 2019, total: 98954 },
  { year: 2020, total: 126266 },
  { year: 2021, total: 144012 },
  { year: 2022, total: 181581 },
  { year: 2023, total: 240208 },
  { year: 2024, total: 252476 },
  { year: 2025, total: 299732 },
] as const;

export const SPAIN_CITIZENSHIP_TOTAL_2013_2025 = SPAIN_CITIZENSHIP_SERIES.reduce(
  (sum, row) => sum + row.total,
  0,
);

export const SPAIN_CITIZENSHIP_AGE_GROUPS = [
  { group: '0–9', count: 44957, percentage: '15.00%', fill: '#60a5fa' },
  { group: '10–19', count: 41181, percentage: '13.74%', fill: '#38bdf8' },
  { group: '20–29', count: 39905, percentage: '13.31%', fill: '#2dd4bf' },
  { group: '30–39', count: 72023, percentage: '24.03%', fill: '#34d399' },
  { group: '40–49', count: 57750, percentage: '19.27%', fill: '#f59e0b' },
  { group: '50–59', count: 29910, percentage: '9.98%', fill: '#f472b6' },
  { group: '60+', count: 14006, percentage: '4.67%', fill: '#a78bfa' },
] as const;

export const SPAIN_CITIZENSHIP_ROUTES = [
  { group: 'Residence', count: 253836, percentage: '84.69%', fill: '#60a5fa' },
  { group: 'Option', count: 45715, percentage: '15.25%', fill: '#34d399' },
  { group: 'Other / unknown', count: 181, percentage: '0.06%', fill: '#f59e0b' },
] as const;

/** Legal residence period used for the 221,176 residence-route grants in 2025. */
export const SPAIN_RESIDENCE_GRANT_ROUTES = [
  { group: '2-year route', count: 124559, percentage: '56.32%', fill: '#38bdf8' },
  { group: 'General 10-year route', count: 37670, percentage: '17.03%', fill: '#a78bfa' },
  { group: 'Born in Spain · 1 year', count: 35197, percentage: '15.91%', fill: '#34d399' },
  { group: 'Marriage · 1 year', count: 19465, percentage: '8.80%', fill: '#f472b6' },
  { group: 'Other routes', count: 4285, percentage: '1.94%', fill: '#f59e0b' },
] as const;

/** Shares are percentages of all 299,732 resident acquisitions in 2025. */
export const SPAIN_PRIOR_NATIONALITY_DATA = [
  { name: 'Morocco', count: 42114, percentage: '14.05%' },
  { name: 'Colombia', count: 37712, percentage: '12.58%' },
  { name: 'Venezuela', count: 36271, percentage: '12.10%' },
  { name: 'Honduras', count: 20745, percentage: '6.92%' },
  { name: 'Peru', count: 15920, percentage: '5.31%' },
  { name: 'Cuba', count: 14390, percentage: '4.80%' },
  { name: 'Ecuador', count: 13689, percentage: '4.57%' },
  { name: 'Argentina', count: 11291, percentage: '3.77%' },
  { name: 'Dominican Republic', count: 9915, percentage: '3.31%' },
  { name: 'Nicaragua', count: 8951, percentage: '2.99%' },
] as const;

export const SPAIN_PRIOR_NATIONALITY_RING_COLORS = [
  '#a78bfa',
  '#38bdf8',
  '#2dd4bf',
  '#f472b6',
  '#f87171',
  '#e7e5e4',
  '#86efac',
  '#c084fc',
  '#fbbf24',
  '#fb7185',
] as const;

export const SPAIN_CITIZENSHIP_OPERATIONS_2025 = {
  applications: 296923,
  grants: 221284,
  denials: 24910,
  archived: 10025,
  totalResolutions: 256219,
  grantShare: 86.4,
  denialShare: 9.7,
  archivedShare: 3.9,
} as const;

export const SPAIN_CITIZENSHIP_PENDING_2026_H1 = 251223;

export const SPAIN_CITIZENSHIP_SOURCES = {
  ine: {
    name: 'INE — Acquisitions of Spanish nationality by residents, 2025',
    url: 'https://www.ine.es/dyngs/Prensa/es/EANER2025.htm',
  },
  justice: {
    name: 'Ministry of Justice — Basic nationality statistics, 30 June 2026',
    url: 'https://www.mjusticia.gob.es/es/Ciudadano/Nacionalidad/Documents/Estadisticas%20nacionalidad%2030-06-2026.pdf',
  },
  opi: {
    name: 'OPI — Grants of Spanish nationality by residence, 2025',
    url: 'https://www.inclusion.gob.es/web/opi/estadisticas/catalogo/concesiones_nacionalidad',
  },
  procedure: {
    name: 'BOE — Royal Decree 1004/2015, article 11',
    url: 'https://www.boe.es/eli/es/rd/2015/11/06/1004/con/20201202',
  },
  civilCode: {
    name: 'BOE — Spanish Civil Code, articles 17–26',
    url: 'https://www.boe.es/buscar/act.php?id=BOE-A-1889-4763',
  },
} as const;

/** Cards/visuals rendered inside the Spain Citizenship subsection. */
export const SPAIN_CITIZENSHIP_BLOCK_COUNT = 18;
