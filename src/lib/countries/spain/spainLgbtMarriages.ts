import type { LgbtUnionRow } from '../../../components/countries/germany/GermanyMarriagesSection';

/**
 * Definitive INE national counts by spouses' sex. Same-sex marriage became legal in Spain
 * on 3 July 2005, so the first observation covers only the second half of that year.
 */
export const SPAIN_SAME_SEX_MARRIAGE_SERIES: readonly LgbtUnionRow[] = [
  { year: '2005', total: 1269, gay: 914, lesbian: 355, type: 'Same-sex marriage (from July)' },
  { year: '2006', total: 4313, gay: 3000, lesbian: 1313, type: 'Same-sex marriage' },
  { year: '2007', total: 3193, gay: 2141, lesbian: 1052, type: 'Same-sex marriage' },
  { year: '2008', total: 3194, gay: 2051, lesbian: 1143, type: 'Same-sex marriage' },
  { year: '2009', total: 3082, gay: 1984, lesbian: 1098, type: 'Same-sex marriage' },
  { year: '2010', total: 3193, gay: 1955, lesbian: 1238, type: 'Same-sex marriage' },
  { year: '2011', total: 3540, gay: 2073, lesbian: 1467, type: 'Same-sex marriage' },
  { year: '2012', total: 3455, gay: 1935, lesbian: 1520, type: 'Same-sex marriage' },
  { year: '2013', total: 3071, gay: 1648, lesbian: 1423, type: 'Same-sex marriage' },
  { year: '2014', total: 3275, gay: 1679, lesbian: 1596, type: 'Same-sex marriage' },
  { year: '2015', total: 3738, gay: 1925, lesbian: 1813, type: 'Same-sex marriage' },
  { year: '2016', total: 4320, gay: 2188, lesbian: 2132, type: 'Same-sex marriage' },
  { year: '2017', total: 4637, gay: 2323, lesbian: 2314, type: 'Same-sex marriage' },
  { year: '2018', total: 4870, gay: 2358, lesbian: 2512, type: 'Same-sex marriage' },
  { year: '2019', total: 5141, gay: 2492, lesbian: 2649, type: 'Same-sex marriage' },
  { year: '2020', total: 3189, gay: 1504, lesbian: 1685, type: 'Same-sex marriage' },
  { year: '2021', total: 5073, gay: 2206, lesbian: 2867, type: 'Same-sex marriage' },
  { year: '2022', total: 6236, gay: 2856, lesbian: 3380, type: 'Same-sex marriage' },
  { year: '2023', total: 6772, gay: 3165, lesbian: 3607, type: 'Same-sex marriage' },
  { year: '2024', total: 7336, gay: 3544, lesbian: 3792, type: 'Same-sex marriage' },
];

export const SPAIN_MALE_COUPLE_MARRIAGES_INE_URL =
  'https://www.ine.es/jaxiT3/Tabla.htm?t=9107&L=0';

export const SPAIN_FEMALE_COUPLE_MARRIAGES_INE_URL =
  'https://www.ine.es/jaxiT3/Tabla.htm?t=9108&L=0';

export const SPAIN_MARRIAGES_2024_INE_PRESS_URL =
  'https://www.ine.es/dyngs/Prensa/MNP2024.htm';
