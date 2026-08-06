/**
 * Italy — Citizenship data for the Government → Citizenship subsection.
 *
 * Italy grants more citizenships than almost any EU country, so this block leans
 * on that story. Two honest limits, flagged the way the France dataset flags its
 * own:
 *
 *  · The per-year line shows the TOTAL acquisitions ISTAT/Eurostat publish. The
 *    mode split (residence / minors / marriage / iure sanguinis) is only broken
 *    out by ISTAT for NON-EU citizens (~196,000 of the 213,567 total in 2023),
 *    so the donut is explicitly the non-EU 2023 subset — the dimension ISTAT
 *    actually publishes.
 *  · The origins panel uses the 2024 figures Eurostat/ISTAT released; Italy does
 *    not publish a stable cumulative top-10 comparable to France’s.
 */

export type CitizenshipYearPoint = {
  year: number;
  total: number;
};

/** ISTAT / Eurostat — total acquisitions of Italian citizenship. */
export const ITALY_CITIZENSHIP_SERIES: readonly CitizenshipYearPoint[] = [
  { year: 2021, total: 121457 },
  { year: 2022, total: 213716 },
  { year: 2023, total: 213567 },
  { year: 2024, total: 217000 },
];

export const ITALY_CITIZENSHIP_TOTAL_2021_2024 = ITALY_CITIZENSHIP_SERIES.reduce((n, y) => n + y.total, 0);

/**
 * 2023 mode split — non-EU citizens only (~196,000), the breakdown ISTAT
 * publishes. Percentages are ISTAT’s; the iure-sanguinis-and-election share is
 * the residual of the three itemised routes.
 */
export const ITALY_CITIZENSHIP_MODES = [
  { group: 'By residence (naturalisation)', count: 78213, percentage: '39.9%', fill: '#60a5fa' },
  { group: 'Transmission to minors', count: 57820, percentage: '29.5%', fill: '#34d399' },
  { group: 'Iure sanguinis & election at 18', count: 37240, percentage: '19.0%', fill: '#a78bfa' },
  { group: 'By marriage', count: 22736, percentage: '11.6%', fill: '#f59e0b' },
] as const;

/** Top origins of new Italian citizens, 2024 (Eurostat / ISTAT). */
export const ITALY_CITIZENSHIP_ORIGINS = [
  { name: 'Albania', count: 31700, share: '14.6%' },
  { name: 'Morocco', count: 28000, share: '12.9%' },
  { name: 'Romania', count: 15000, share: '6.9%' },
] as const;

export const ITALY_CITIZENSHIP_ORIGINS_NOTE =
  'Albania and Morocco are by far the largest origins, reflecting long-settled communities. In 2024 Romania overtook Argentina for third; acquisitions by Argentines (−11%) and Brazilians (−10%) fell as the jure sanguinis reform bit, while Indian (+30%) and Bangladeshi (+19%) acquisitions rose sharply. Nine nationalities account for about 64% of all acquisitions.';

export const ITALY_CITIZENSHIP_SOURCES = {
  istat: {
    name: 'ISTAT — Cittadini non comunitari / Indicatori demografici',
    url: 'https://www.istat.it/comunicato-stampa/cittadini-non-comunitari-in-italia-anno-2023/',
  },
  eurostat: {
    name: 'Eurostat — Acquisition of citizenship statistics',
    url: 'https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Acquisition_of_citizenship_statistics',
  },
  ismu: {
    name: 'Fondazione ISMU — Cittadinanza, banca dati sulle migrazioni',
    url: 'https://www.ismu.org/cittadinanza-banca-dati-sulle-migrazioni/',
  },
};
