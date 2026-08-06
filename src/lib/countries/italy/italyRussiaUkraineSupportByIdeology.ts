export type ItalyRussiaUkraineSupportByIdeologyRow = {
  year: string;
  leftWingSupportRussiaPct: number;
  leftWingSupportUkrainePct: number;
  rightWingSupportRussiaPct: number;
  rightWingSupportUkrainePct: number;
  basis: 'backcast' | 'historical proxy' | 'poll-derived estimate' | 'party anchor';
};

/**
 * Modeled ideological split, not a continuous annual poll.
 *
 * The series is constrained by Italy's overall Russia/Ukraine series and by
 * surveys reporting attitudes by party preference. Party results are mapped
 * approximately to left and right blocs; politically unaligned, centrist and
 * neutral respondents remain outside these two charts.
 */
export const ITALY_RUSSIA_UKRAINE_SUPPORT_BY_IDEOLOGY:
  readonly ItalyRussiaUkraineSupportByIdeologyRow[] = [
  { year: '2000', leftWingSupportRussiaPct: 28, leftWingSupportUkrainePct: 27, rightWingSupportRussiaPct: 38, rightWingSupportUkrainePct: 20, basis: 'backcast' },
  { year: '2001', leftWingSupportRussiaPct: 29, leftWingSupportUkrainePct: 27, rightWingSupportRussiaPct: 39, rightWingSupportUkrainePct: 20, basis: 'backcast' },
  { year: '2002', leftWingSupportRussiaPct: 30, leftWingSupportUkrainePct: 28, rightWingSupportRussiaPct: 40, rightWingSupportUkrainePct: 20, basis: 'backcast' },
  { year: '2003', leftWingSupportRussiaPct: 31, leftWingSupportUkrainePct: 28, rightWingSupportRussiaPct: 41, rightWingSupportUkrainePct: 20, basis: 'backcast' },
  { year: '2004', leftWingSupportRussiaPct: 32, leftWingSupportUkrainePct: 29, rightWingSupportRussiaPct: 42, rightWingSupportUkrainePct: 21, basis: 'backcast' },
  { year: '2005', leftWingSupportRussiaPct: 33, leftWingSupportUkrainePct: 29, rightWingSupportRussiaPct: 43, rightWingSupportUkrainePct: 21, basis: 'backcast' },
  { year: '2006', leftWingSupportRussiaPct: 34, leftWingSupportUkrainePct: 29, rightWingSupportRussiaPct: 44, rightWingSupportUkrainePct: 21, basis: 'backcast' },
  { year: '2007', leftWingSupportRussiaPct: 32, leftWingSupportUkrainePct: 30, rightWingSupportRussiaPct: 43, rightWingSupportUkrainePct: 22, basis: 'historical proxy' },
  { year: '2008', leftWingSupportRussiaPct: 30, leftWingSupportUkrainePct: 31, rightWingSupportRussiaPct: 40, rightWingSupportUkrainePct: 23, basis: 'historical proxy' },
  { year: '2009', leftWingSupportRussiaPct: 32, leftWingSupportUkrainePct: 31, rightWingSupportRussiaPct: 42, rightWingSupportUkrainePct: 23, basis: 'historical proxy' },
  { year: '2010', leftWingSupportRussiaPct: 34, leftWingSupportUkrainePct: 31, rightWingSupportRussiaPct: 44, rightWingSupportUkrainePct: 23, basis: 'historical proxy' },
  { year: '2011', leftWingSupportRussiaPct: 36, leftWingSupportUkrainePct: 31, rightWingSupportRussiaPct: 46, rightWingSupportUkrainePct: 23, basis: 'historical proxy' },
  { year: '2012', leftWingSupportRussiaPct: 38, leftWingSupportUkrainePct: 31, rightWingSupportRussiaPct: 48, rightWingSupportUkrainePct: 23, basis: 'historical proxy' },
  { year: '2013', leftWingSupportRussiaPct: 40, leftWingSupportUkrainePct: 31, rightWingSupportRussiaPct: 50, rightWingSupportUkrainePct: 23, basis: 'historical proxy' },
  { year: '2014', leftWingSupportRussiaPct: 18, leftWingSupportUkrainePct: 57, rightWingSupportRussiaPct: 35, rightWingSupportUkrainePct: 40, basis: 'poll-derived estimate' },
  { year: '2015', leftWingSupportRussiaPct: 22, leftWingSupportUkrainePct: 54, rightWingSupportRussiaPct: 39, rightWingSupportUkrainePct: 36, basis: 'historical proxy' },
  { year: '2016', leftWingSupportRussiaPct: 26, leftWingSupportUkrainePct: 51, rightWingSupportRussiaPct: 43, rightWingSupportUkrainePct: 33, basis: 'historical proxy' },
  { year: '2017', leftWingSupportRussiaPct: 30, leftWingSupportUkrainePct: 48, rightWingSupportRussiaPct: 47, rightWingSupportUkrainePct: 30, basis: 'historical proxy' },
  { year: '2018', leftWingSupportRussiaPct: 34, leftWingSupportUkrainePct: 45, rightWingSupportRussiaPct: 51, rightWingSupportUkrainePct: 27, basis: 'historical proxy' },
  { year: '2019', leftWingSupportRussiaPct: 38, leftWingSupportUkrainePct: 41, rightWingSupportRussiaPct: 56, rightWingSupportUkrainePct: 24, basis: 'historical proxy' },
  { year: '2020', leftWingSupportRussiaPct: 41, leftWingSupportUkrainePct: 38, rightWingSupportRussiaPct: 60, rightWingSupportUkrainePct: 21, basis: 'poll-derived estimate' },
  { year: '2021', leftWingSupportRussiaPct: 39, leftWingSupportUkrainePct: 41, rightWingSupportRussiaPct: 57, rightWingSupportUkrainePct: 24, basis: 'historical proxy' },
  { year: '2022', leftWingSupportRussiaPct: 5, leftWingSupportUkrainePct: 58, rightWingSupportRussiaPct: 12, rightWingSupportUkrainePct: 40, basis: 'poll-derived estimate' },
  { year: '2023', leftWingSupportRussiaPct: 5, leftWingSupportUkrainePct: 55, rightWingSupportRussiaPct: 12, rightWingSupportUkrainePct: 38, basis: 'party anchor' },
  { year: '2024', leftWingSupportRussiaPct: 6, leftWingSupportUkrainePct: 50, rightWingSupportRussiaPct: 14, rightWingSupportUkrainePct: 33, basis: 'party anchor' },
  { year: '2025', leftWingSupportRussiaPct: 6, leftWingSupportUkrainePct: 54, rightWingSupportRussiaPct: 15, rightWingSupportUkrainePct: 34, basis: 'party anchor' },
];

export const ITALY_RUSSIA_UKRAINE_SUPPORT_BY_IDEOLOGY_NOTE =
  'Modeled ideological proxy, not a continuous official poll. Pre-2022 values combine national Russia favorability and Ukraine-policy anchors with the documented positions of Italy’s political blocs. From 2022, Italy’s direct side-taking totals are apportioned using party-level surveys; PD/AVS approximate the left and FdI/Lega/FI the right. M5S, centrists, unaligned voters and neutral responses are not forced into either bloc, so Russia and Ukraine do not sum to 100%.';

export const ITALY_RUSSIA_UKRAINE_SUPPORT_BY_IDEOLOGY_SOURCES = [
  {
    label: 'Pew 2007',
    url: 'https://www.pewresearch.org/wp-content/uploads/sites/2/2007/06/Report-1-topline-trends-UPDATED.pdf',
  },
  {
    label: 'Ipsos 2014',
    url: 'https://www.ipsos.com/en-uk/eleven-eu-countries-surveyed-ukraine',
  },
  {
    label: 'Pew 2020',
    url: 'https://www.pewresearch.org/short-reads/2020/12/16/views-of-russia-and-putin-remain-negative-across-14-nations/',
  },
  {
    label: 'ECFR 2022',
    url: 'https://ecfr.eu/publication/peace-versus-justice-the-coming-european-split-over-the-war-in-ukraine/',
  },
  {
    label: 'Bocconi/eupinions 2023',
    url: 'https://iep.unibocconi.eu/publications/what-do-italian-and-european-voters-think-eu-policies-towards-ukraine',
  },
  {
    label: 'Demopolis 2024',
    url: 'https://www.rainews.it/photogallery/2024/02/gli-orientamenti-dellopinione-pubblica-italiana-dopo-2-anni-di-guerra-tra-russia-ed-ucraina-sondaggio-demopolis-791cce4a-2a69-45d7-9a78-900c8763f7f2.html',
  },
  {
    label: 'Ipsos 2025',
    url: 'https://www.corriere.it/politica/25_marzo_15/sondaggio-pagnoncelli-guerra-ucraina-russia-195f1554-c8f0-414b-83f6-d0f5861ecxlk.shtml',
  },
] as const;

const ITALY_RUSSIA_UKRAINE_IDEOLOGY_CHART_BASE = {
  data: ITALY_RUSSIA_UKRAINE_SUPPORT_BY_IDEOLOGY,
  methodologyNote: ITALY_RUSSIA_UKRAINE_SUPPORT_BY_IDEOLOGY_NOTE,
  sources: ITALY_RUSSIA_UKRAINE_SUPPORT_BY_IDEOLOGY_SOURCES,
  showDataTable: true,
  yDomain: [0, 65] as [number, number],
} as const;

export const ITALY_RUSSIA_UKRAINE_LEFT_WING_CHART = {
  ...ITALY_RUSSIA_UKRAINE_IDEOLOGY_CHART_BASE,
};

export const ITALY_RUSSIA_UKRAINE_RIGHT_WING_CHART = {
  ...ITALY_RUSSIA_UKRAINE_IDEOLOGY_CHART_BASE,
};
