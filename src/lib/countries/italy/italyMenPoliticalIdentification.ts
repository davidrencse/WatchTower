export type ItalyMenPoliticalIdentificationRow = {
  year: string;
  menLeftistPct: number;
  menRightWingPct: number;
  status: 'observed' | 'interpolated' | 'backcast' | 'projected';
};

/**
 * Italy, men only. Observed points are post-stratification-weighted ESS
 * microdata estimates.
 *
 * ESS left/right self-placement:
 * - leftist: lrscale 0–4
 * - right-wing: lrscale 6–10
 * - midpoint 5 remains outside both series
 *
 * Observed survey rounds are joined with straight-line interpolation. The
 * 2000–01 values hold the first observation constant; 2024–25 continue the
 * 2020–23 slope. Values are percentages of valid male responses and are
 * rounded to one decimal place.
 */
export const ITALY_MEN_LEFT_RIGHT_IDENTIFICATION: readonly ItalyMenPoliticalIdentificationRow[] = [
  { year: '2000', menLeftistPct: 41.8, menRightWingPct: 33.7, status: 'backcast' },
  { year: '2001', menLeftistPct: 41.8, menRightWingPct: 33.7, status: 'backcast' },
  { year: '2002', menLeftistPct: 41.8, menRightWingPct: 33.7, status: 'observed' },
  { year: '2003', menLeftistPct: 42.8, menRightWingPct: 36.1, status: 'interpolated' },
  { year: '2004', menLeftistPct: 43.7, menRightWingPct: 38.6, status: 'observed' },
  { year: '2005', menLeftistPct: 43.2, menRightWingPct: 37.2, status: 'interpolated' },
  { year: '2006', menLeftistPct: 42.8, menRightWingPct: 35.9, status: 'interpolated' },
  { year: '2007', menLeftistPct: 42.4, menRightWingPct: 34.5, status: 'interpolated' },
  { year: '2008', menLeftistPct: 41.9, menRightWingPct: 33.2, status: 'interpolated' },
  { year: '2009', menLeftistPct: 41.5, menRightWingPct: 31.9, status: 'interpolated' },
  { year: '2010', menLeftistPct: 41.1, menRightWingPct: 30.5, status: 'interpolated' },
  { year: '2011', menLeftistPct: 40.6, menRightWingPct: 29.2, status: 'interpolated' },
  { year: '2012', menLeftistPct: 40.2, menRightWingPct: 27.8, status: 'observed' },
  { year: '2013', menLeftistPct: 38.8, menRightWingPct: 31.8, status: 'interpolated' },
  { year: '2014', menLeftistPct: 37.4, menRightWingPct: 35.7, status: 'interpolated' },
  { year: '2015', menLeftistPct: 36, menRightWingPct: 39.6, status: 'interpolated' },
  { year: '2016', menLeftistPct: 34.6, menRightWingPct: 43.5, status: 'observed' },
  { year: '2017', menLeftistPct: 33.2, menRightWingPct: 43.9, status: 'interpolated' },
  { year: '2018', menLeftistPct: 31.7, menRightWingPct: 44.2, status: 'observed' },
  { year: '2019', menLeftistPct: 33.5, menRightWingPct: 42.2, status: 'interpolated' },
  { year: '2020', menLeftistPct: 35.3, menRightWingPct: 40.1, status: 'observed' },
  { year: '2021', menLeftistPct: 35.2, menRightWingPct: 40.5, status: 'interpolated' },
  { year: '2022', menLeftistPct: 35, menRightWingPct: 40.8, status: 'interpolated' },
  { year: '2023', menLeftistPct: 34.9, menRightWingPct: 41.2, status: 'observed' },
  { year: '2024', menLeftistPct: 34.8, menRightWingPct: 41.5, status: 'projected' },
  { year: '2025', menLeftistPct: 34.6, menRightWingPct: 41.9, status: 'projected' },
];

export const ITALY_MEN_LEFT_RIGHT_NOTE =
  'Dots are post-stratification-weighted European Social Survey observations (2002, 2004, 2012, 2016, 2018, 2020 and 2023). Missing years are linearly interpolated, 2000–01 hold the 2002 level, and 2024–25 extend the 2020–23 trend. Leftist = 0–4 and right-wing = 6–10 on the ESS 0–10 self-placement scale; midpoint 5 is omitted, so the lines do not sum to 100%.';

export const ITALY_MEN_LEFT_RIGHT_SOURCES = [
  {
    label: 'European Social Survey Data Portal',
    url: 'https://www.europeansocialsurvey.org/data-portal',
  },
] as const;

export const ITALY_MEN_LEFT_RIGHT_CHART = {
  data: ITALY_MEN_LEFT_RIGHT_IDENTIFICATION,
  methodologyNote: ITALY_MEN_LEFT_RIGHT_NOTE,
  sources: ITALY_MEN_LEFT_RIGHT_SOURCES,
  showDataTable: true,
  yDomain: [25, 50] as [number, number],
} as const;
