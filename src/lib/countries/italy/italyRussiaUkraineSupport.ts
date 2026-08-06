export type ItalyRussiaUkraineSupportRow = {
  year: string;
  overallSupportRussiaPct: number;
  overallSupportUkrainePct: number;
  russiaAnchor: boolean;
  ukraineAnchor: boolean;
  basis: 'backcast' | 'modeled' | 'survey anchor' | 'direct poll' | 'interpolated';
};

/**
 * Modeled Italian public-opinion proxy, not a single continuous annual poll.
 *
 * Before 2022, comparable "which side are you on?" polling is unavailable.
 * Historical values therefore connect published Russia-favorability and
 * Ukraine-policy-support anchors. From 2022, the series follows Ipsos's direct
 * Russia / neither / Ukraine side-taking tracker. The unshown neutral response
 * means the two plotted shares do not add to 100%.
 */
export const ITALY_RUSSIA_UKRAINE_SUPPORT: readonly ItalyRussiaUkraineSupportRow[] = [
  { year: '2000', overallSupportRussiaPct: 32, overallSupportUkrainePct: 23, russiaAnchor: false, ukraineAnchor: false, basis: 'backcast' },
  { year: '2001', overallSupportRussiaPct: 33, overallSupportUkrainePct: 23, russiaAnchor: false, ukraineAnchor: false, basis: 'backcast' },
  { year: '2002', overallSupportRussiaPct: 34, overallSupportUkrainePct: 24, russiaAnchor: false, ukraineAnchor: false, basis: 'backcast' },
  { year: '2003', overallSupportRussiaPct: 35, overallSupportUkrainePct: 24, russiaAnchor: false, ukraineAnchor: false, basis: 'backcast' },
  { year: '2004', overallSupportRussiaPct: 36, overallSupportUkrainePct: 25, russiaAnchor: false, ukraineAnchor: false, basis: 'backcast' },
  { year: '2005', overallSupportRussiaPct: 37, overallSupportUkrainePct: 25, russiaAnchor: false, ukraineAnchor: false, basis: 'backcast' },
  { year: '2006', overallSupportRussiaPct: 38, overallSupportUkrainePct: 25, russiaAnchor: false, ukraineAnchor: false, basis: 'backcast' },
  { year: '2007', overallSupportRussiaPct: 37, overallSupportUkrainePct: 26, russiaAnchor: true, ukraineAnchor: false, basis: 'survey anchor' },
  { year: '2008', overallSupportRussiaPct: 34, overallSupportUkrainePct: 27, russiaAnchor: false, ukraineAnchor: false, basis: 'modeled' },
  { year: '2009', overallSupportRussiaPct: 36, overallSupportUkrainePct: 27, russiaAnchor: false, ukraineAnchor: false, basis: 'modeled' },
  { year: '2010', overallSupportRussiaPct: 38, overallSupportUkrainePct: 27, russiaAnchor: false, ukraineAnchor: false, basis: 'modeled' },
  { year: '2011', overallSupportRussiaPct: 40, overallSupportUkrainePct: 27, russiaAnchor: false, ukraineAnchor: false, basis: 'modeled' },
  { year: '2012', overallSupportRussiaPct: 42, overallSupportUkrainePct: 27, russiaAnchor: false, ukraineAnchor: false, basis: 'modeled' },
  { year: '2013', overallSupportRussiaPct: 44, overallSupportUkrainePct: 27, russiaAnchor: false, ukraineAnchor: false, basis: 'modeled' },
  { year: '2014', overallSupportRussiaPct: 26, overallSupportUkrainePct: 49, russiaAnchor: true, ukraineAnchor: true, basis: 'survey anchor' },
  { year: '2015', overallSupportRussiaPct: 30, overallSupportUkrainePct: 46, russiaAnchor: false, ukraineAnchor: false, basis: 'modeled' },
  { year: '2016', overallSupportRussiaPct: 34, overallSupportUkrainePct: 43, russiaAnchor: false, ukraineAnchor: false, basis: 'modeled' },
  { year: '2017', overallSupportRussiaPct: 38, overallSupportUkrainePct: 40, russiaAnchor: false, ukraineAnchor: false, basis: 'modeled' },
  { year: '2018', overallSupportRussiaPct: 42, overallSupportUkrainePct: 36, russiaAnchor: false, ukraineAnchor: false, basis: 'modeled' },
  { year: '2019', overallSupportRussiaPct: 46, overallSupportUkrainePct: 33, russiaAnchor: false, ukraineAnchor: false, basis: 'modeled' },
  { year: '2020', overallSupportRussiaPct: 50, overallSupportUkrainePct: 30, russiaAnchor: true, ukraineAnchor: false, basis: 'survey anchor' },
  { year: '2021', overallSupportRussiaPct: 48, overallSupportUkrainePct: 33, russiaAnchor: false, ukraineAnchor: false, basis: 'modeled' },
  { year: '2022', overallSupportRussiaPct: 8, overallSupportUkrainePct: 46, russiaAnchor: true, ukraineAnchor: true, basis: 'direct poll' },
  { year: '2023', overallSupportRussiaPct: 8, overallSupportUkrainePct: 45, russiaAnchor: true, ukraineAnchor: true, basis: 'direct poll' },
  { year: '2024', overallSupportRussiaPct: 9.5, overallSupportUkrainePct: 38.5, russiaAnchor: false, ukraineAnchor: false, basis: 'interpolated' },
  { year: '2025', overallSupportRussiaPct: 11, overallSupportUkrainePct: 32, russiaAnchor: true, ukraineAnchor: true, basis: 'direct poll' },
];

export const ITALY_RUSSIA_UKRAINE_SUPPORT_NOTE =
  'Modeled historical proxy, not a continuous annual poll. Markers are published survey anchors: Pew Russia favorability (2007 and 2020), Ipsos post-Crimea policy preferences (2014), and Ipsos direct side-taking from 2022 onward. Unmarked years are backcast, modeled or interpolated. Questions differ before 2022, and neutral respondents are omitted, so the two lines do not sum to 100%.';

export const ITALY_RUSSIA_UKRAINE_SUPPORT_SOURCES = [
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
    label: 'Ipsos tracker 2023',
    url: 'https://www.ipsos.com/sites/default/files/2023-04/IPSOS%20WAR%20TRACKER%20ITALIA_w21%2022-03-23.pdf',
  },
  {
    label: 'Demopolis 2024',
    url: 'https://www.rainews.it/photogallery/2024/02/gli-orientamenti-dellopinione-pubblica-italiana-dopo-2-anni-di-guerra-tra-russia-ed-ucraina-sondaggio-demopolis-791cce4a-2a69-45d7-9a78-900c8763f7f2.html',
  },
  {
    label: 'Ipsos 2025',
    url: 'https://eurofocus.adnkronos.com/politics/crolla-sostegno-italiani-kiev-sondaggio-ipsos-dati/',
  },
] as const;

export const ITALY_RUSSIA_UKRAINE_SUPPORT_CHART = {
  data: ITALY_RUSSIA_UKRAINE_SUPPORT,
  methodologyNote: ITALY_RUSSIA_UKRAINE_SUPPORT_NOTE,
  sources: ITALY_RUSSIA_UKRAINE_SUPPORT_SOURCES,
  showDataTable: true,
  yDomain: [0, 60] as [number, number],
} as const;
