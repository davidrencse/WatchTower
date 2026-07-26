/**
 * France — Citizenship data for the Government → Citizenship subsection.
 *
 * Mirrors the dimensions Germany's citizenship UI renders, with two deliberate
 * substitutions where France does not publish the equivalent series:
 *
 *  · Germany shows naturalisations by AGE BAND. The DGEF stopped publishing the
 *    age profile of new French citizens when SDANF's annual reports ended in
 *    2007, so the donut here shows acquisitions by LEGAL ROUTE instead — the
 *    dimension INSEE actually publishes.
 *  · Germany shows an application count and a refusal rate. France publishes
 *    outcomes (acquisitions), not the full decision breakdown, so those two
 *    tiles carry published figures instead of invented ones.
 *
 * The per-year series is short on purpose: INSEE's current table runs 2021–2025.
 * Older French figures circulate on a different basis (they exclude anticipated
 * declarations by minors born in France), so splicing them onto this series
 * would misstate the trend.
 */

export type CitizenshipYearPoint = {
  year: number;
  total: number;
  decree: number;
  anticipated: number;
  marriage: number;
  other: number;
};

/** INSEE, "Acquisitions de la nationalité française". `anticipated` is the published total less the three itemised routes. */
export const FRANCE_CITIZENSHIP_SERIES: readonly CitizenshipYearPoint[] = [
  { year: 2021, total: 128560, decree: 75249, anticipated: 33121, marriage: 17280, other: 2910 },
  { year: 2022, total: 114483, decree: 60556, anticipated: 34536, marriage: 16465, other: 2926 },
  { year: 2023, total: 97288, decree: 40064, anticipated: 34652, marriage: 19455, other: 3117 },
  { year: 2024, total: 103661, decree: 48829, anticipated: 35879, marriage: 15910, other: 3043 },
  // INSEE published the 2025 total on 9 July 2026; the route split is not out yet.
  { year: 2025, total: 98139, decree: 0, anticipated: 0, marriage: 0, other: 0 },
];

export const FRANCE_CITIZENSHIP_TOTAL_2021_2025 = FRANCE_CITIZENSHIP_SERIES.reduce((n, y) => n + y.total, 0);

/** 2024 route split — the latest year with a published breakdown. */
export const FRANCE_CITIZENSHIP_ROUTES = [
  { group: 'Naturalisation by decree', count: 48829, percentage: '47.10%', fill: '#60a5fa' },
  { group: 'Anticipated declaration (born in France)', count: 35879, percentage: '34.61%', fill: '#34d399' },
  { group: 'Declaration by marriage', count: 15910, percentage: '15.35%', fill: '#f59e0b' },
  { group: 'Other declarations', count: 3043, percentage: '2.94%', fill: '#f472b6' },
] as const;

/**
 * Top prior nationalities, cumulative 2010–2022 (collective effects included).
 * Percentages are shares of this top-10 total (473,308), not of all acquisitions.
 */
export const FRANCE_PRIOR_NATIONALITY_DATA = [
  { name: 'Morocco', count: 133758, percentage: '28.26%' },
  { name: 'Algeria', count: 122580, percentage: '25.90%' },
  { name: 'Tunisia', count: 52193, percentage: '11.03%' },
  { name: 'Cameroon', count: 26078, percentage: '5.51%' },
  { name: 'Russia', count: 25646, percentage: '5.42%' },
  { name: 'Côte d’Ivoire', count: 25200, percentage: '5.32%' },
  { name: 'Congo', count: 23623, percentage: '4.99%' },
  { name: 'Senegal', count: 23507, percentage: '4.97%' },
  { name: 'Turkey', count: 22581, percentage: '4.77%' },
  { name: 'Mali', count: 18142, percentage: '3.83%' },
] as const;

export const FRANCE_PRIOR_NATIONALITY_RING_COLORS = [
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

export const FRANCE_CITIZENSHIP_SOURCES = {
  insee: {
    name: 'INSEE — Acquisitions de la nationalité française',
    url: 'https://www.insee.fr/fr/statistiques/2381644',
  },
  dgef: {
    name: 'DGEF — Accès à la nationalité française',
    url: 'https://www.data.gouv.fr/datasets/acces-a-la-nationalite-francaise-publication-27-juin-2024',
  },
  histoire: {
    name: 'Musée de l’histoire de l’immigration — Qui accède à la nationalité française',
    url: 'https://www.histoire-immigration.fr/en/politics-and-immigration/who-acquires-french-nationality-today',
  },
  decret: {
    name: 'Décret n° 2025-648 du 15 juillet 2025',
    url: 'https://www.legifrance.gouv.fr/',
  },
};
