import type { LgbtUnionRow } from '../../../components/countries/germany/GermanyMarriagesSection';

/**
 * Italian same-sex civil unions. Italy introduced civil unions in July 2016,
 * so the pre-2016 zeroes describe the legal series rather than social incidence.
 */
export const ITALY_LGBT_UNION_SERIES: readonly LgbtUnionRow[] = [
  { year: '2000', total: 0, gay: 0, lesbian: 0, type: 'No legal recognition' },
  { year: '2001', total: 0, gay: 0, lesbian: 0, type: 'No legal recognition' },
  { year: '2002', total: 0, gay: 0, lesbian: 0, type: 'No legal recognition' },
  { year: '2003', total: 0, gay: 0, lesbian: 0, type: 'No legal recognition' },
  { year: '2004', total: 0, gay: 0, lesbian: 0, type: 'No legal recognition' },
  { year: '2005', total: 0, gay: 0, lesbian: 0, type: 'No legal recognition' },
  { year: '2006', total: 0, gay: 0, lesbian: 0, type: 'No legal recognition' },
  { year: '2007', total: 0, gay: 0, lesbian: 0, type: 'No legal recognition' },
  { year: '2008', total: 0, gay: 0, lesbian: 0, type: 'No legal recognition' },
  { year: '2009', total: 0, gay: 0, lesbian: 0, type: 'No legal recognition' },
  { year: '2010', total: 0, gay: 0, lesbian: 0, type: 'No legal recognition' },
  { year: '2011', total: 0, gay: 0, lesbian: 0, type: 'No legal recognition' },
  { year: '2012', total: 0, gay: 0, lesbian: 0, type: 'No legal recognition' },
  { year: '2013', total: 0, gay: 0, lesbian: 0, type: 'No legal recognition' },
  { year: '2014', total: 0, gay: 0, lesbian: 0, type: 'No legal recognition' },
  { year: '2015', total: 0, gay: 0, lesbian: 0, type: 'No legal recognition' },
  { year: '2016', total: 2336, gay: 1629, lesbian: 707, type: 'Civil Union (from Jul; split est.)' },
  { year: '2017', total: 4376, gay: 3053, lesbian: 1323, type: 'Civil Union (split est.)' },
  { year: '2018', total: 2808, gay: 1802, lesbian: 1006, type: 'Civil Union' },
  { year: '2019', total: 2297, gay: 1428, lesbian: 869, type: 'Civil Union' },
  { year: '2020', total: 1539, gay: 961, lesbian: 578, type: 'Civil Union' },
  { year: '2021', total: 2148, gay: 1225, lesbian: 923, type: 'Civil Union' },
  { year: '2022', total: 2813, gay: 1594, lesbian: 1219, type: 'Civil Union' },
  { year: '2023', total: 3019, gay: 1694, lesbian: 1325, type: 'Civil Union' },
  { year: '2024', total: 2936, gay: 1608, lesbian: 1328, type: 'Civil Union' },
  { year: '2025', total: 2845, gay: 1558, lesbian: 1287, type: 'Civil Union (estimated)' },
];

export const ITALY_LGBT_UNIONS_ISTAT_TABLES_URL =
  'https://demo.istat.it/tavole/?t=unionicivili';

export const ITALY_LGBT_UNIONS_ISTAT_2024_URL =
  'https://www.istat.it/comunicato-stampa/matrimoni-unioni-civili-separazioni-e-divorzi-anno-2024/';

export const ITALY_LGBT_UNIONS_ISTAT_EARLY_URL =
  'https://www.istat.it/comunicato-stampa/popolazione-residente-per-stato-civile/';
