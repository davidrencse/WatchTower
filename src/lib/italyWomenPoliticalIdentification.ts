export type ItalyWomenPoliticalIdentificationRow = {
  year: string;
  womenLeftistPct: number;
  womenRightWingPct: number;
};

/**
 * Modeled annual proxy, not an official continuous polling series.
 *
 * The anchor shape follows Italian election-study and post-vote evidence:
 * - the older female electorate leaned more to the right around 2000;
 * - the traditional left/right blocs weakened as M5S expanded in 2013–2018;
 * - right identification recovered with the Lega/FdI realignment after 2018;
 * - the left recovered among women in the 2022 and 2024 studies.
 *
 * Years between research anchors are interpolated and rounded to whole points.
 */
export const ITALY_WOMEN_LEFT_RIGHT_IDENTIFICATION: readonly ItalyWomenPoliticalIdentificationRow[] = [
  { year: '2000', womenLeftistPct: 38, womenRightWingPct: 52 },
  { year: '2001', womenLeftistPct: 39, womenRightWingPct: 51 },
  { year: '2002', womenLeftistPct: 40, womenRightWingPct: 50 },
  { year: '2003', womenLeftistPct: 41, womenRightWingPct: 49 },
  { year: '2004', womenLeftistPct: 42, womenRightWingPct: 48 },
  { year: '2005', womenLeftistPct: 44, womenRightWingPct: 47 },
  { year: '2006', womenLeftistPct: 46, womenRightWingPct: 47 },
  { year: '2007', womenLeftistPct: 43, womenRightWingPct: 48 },
  { year: '2008', womenLeftistPct: 39, womenRightWingPct: 49 },
  { year: '2009', womenLeftistPct: 38, womenRightWingPct: 48 },
  { year: '2010', womenLeftistPct: 37, womenRightWingPct: 47 },
  { year: '2011', womenLeftistPct: 36, womenRightWingPct: 44 },
  { year: '2012', womenLeftistPct: 35, womenRightWingPct: 40 },
  { year: '2013', womenLeftistPct: 34, womenRightWingPct: 35 },
  { year: '2014', womenLeftistPct: 37, womenRightWingPct: 34 },
  { year: '2015', womenLeftistPct: 36, womenRightWingPct: 36 },
  { year: '2016', womenLeftistPct: 35, womenRightWingPct: 38 },
  { year: '2017', womenLeftistPct: 35, womenRightWingPct: 39 },
  { year: '2018', womenLeftistPct: 34, womenRightWingPct: 41 },
  { year: '2019', womenLeftistPct: 34, womenRightWingPct: 44 },
  { year: '2020', womenLeftistPct: 35, womenRightWingPct: 42 },
  { year: '2021', womenLeftistPct: 36, womenRightWingPct: 42 },
  { year: '2022', womenLeftistPct: 38, womenRightWingPct: 43 },
  { year: '2023', womenLeftistPct: 39, womenRightWingPct: 45 },
  { year: '2024', womenLeftistPct: 41, womenRightWingPct: 46 },
  { year: '2025', womenLeftistPct: 41, womenRightWingPct: 46 },
];

export const ITALY_WOMEN_LEFT_RIGHT_NOTE =
  'Modeled proxy, not a continuous official poll. Research anchors combine periodic left–right self-placement studies with women’s national and European election profiles; intervening years are interpolated around major electoral realignments. Left and right exclude centre or unplaced responses, so the two lines need not sum to 100%. The 2025 point is an estimate.';

export const ITALY_WOMEN_LEFT_RIGHT_SOURCES = [
  {
    label: 'ITANES archive',
    url: 'https://www.itanes.it/category/.data-portal/',
  },
  {
    label: 'Ipsos 2018',
    url: 'https://www.ipsos.com/sites/default/files/ct/news/documents/2018-03/italy-political_elections_2018.pdf',
  },
  {
    label: 'Ipsos 2022',
    url: 'https://www.ipsos.com/sites/default/files/ct/news/documents/2022-10/Elezioni%20politiche%202022_le%20analisi%20Ipsos%20post%20voto.pdf',
  },
  {
    label: 'CISE 2024',
    url: 'https://cise.luiss.it/2024/06/10/chi-ha-votato-chi-gruppi-sociali-e-voto/',
  },
  {
    label: 'Eurobarometer trend study',
    url: 'https://academic.oup.com/esr/article/41/6/862/8162736',
  },
] as const;

export const ITALY_WOMEN_LEFT_RIGHT_CHART = {
  data: ITALY_WOMEN_LEFT_RIGHT_IDENTIFICATION,
  methodologyNote: ITALY_WOMEN_LEFT_RIGHT_NOTE,
  sources: ITALY_WOMEN_LEFT_RIGHT_SOURCES,
  showDataTable: true,
} as const;
