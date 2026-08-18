import type { MarriageRatesChartRow } from '../../../components/countries/germany/GermanyMarriagesSection';

/**
 * Spain marriage indicators supplied from INE's marriage statistics.
 * Ages are mean age at marriage across all marriages, not mean age at first marriage.
 * INE has not yet published the requested 2025 observations, so the final row remains null.
 */
export const SPAIN_MARRIAGE_RATES_SERIES: readonly MarriageRatesChartRow[] = [
  { year: '2000', totalMarriages: 216451, crudeMarriageRate: 5.4, avgAgeMen: 31.1, avgAgeWomen: 28.7 },
  { year: '2001', totalMarriages: 208057, crudeMarriageRate: 5.1, avgAgeMen: 31.5, avgAgeWomen: 29.1 },
  { year: '2002', totalMarriages: 211522, crudeMarriageRate: 5.1, avgAgeMen: 31.8, avgAgeWomen: 29.5 },
  { year: '2003', totalMarriages: 212300, crudeMarriageRate: 5.0, avgAgeMen: 32.2, avgAgeWomen: 29.9 },
  { year: '2004', totalMarriages: 216149, crudeMarriageRate: 5.0, avgAgeMen: 32.6, avgAgeWomen: 30.3 },
  { year: '2005', totalMarriages: 208146, crudeMarriageRate: 4.8, avgAgeMen: 33.0, avgAgeWomen: 30.7 },
  { year: '2006', totalMarriages: 203453, crudeMarriageRate: 4.6, avgAgeMen: 33.3, avgAgeWomen: 31.0 },
  { year: '2007', totalMarriages: 201579, crudeMarriageRate: 4.5, avgAgeMen: 33.7, avgAgeWomen: 31.4 },
  { year: '2008', totalMarriages: 194022, crudeMarriageRate: 4.2, avgAgeMen: 34.1, avgAgeWomen: 31.8 },
  { year: '2009', totalMarriages: 174062, crudeMarriageRate: 3.7, avgAgeMen: 34.5, avgAgeWomen: 32.2 },
  { year: '2010', totalMarriages: 170815, crudeMarriageRate: 3.7, avgAgeMen: 34.8, avgAgeWomen: 32.5 },
  { year: '2011', totalMarriages: 163338, crudeMarriageRate: 3.5, avgAgeMen: 35.2, avgAgeWomen: 32.8 },
  { year: '2012', totalMarriages: 168835, crudeMarriageRate: 3.6, avgAgeMen: 35.5, avgAgeWomen: 33.2 },
  { year: '2013', totalMarriages: 156446, crudeMarriageRate: 3.3, avgAgeMen: 35.9, avgAgeWomen: 33.6 },
  { year: '2014', totalMarriages: 162554, crudeMarriageRate: 3.5, avgAgeMen: 36.2, avgAgeWomen: 33.9 },
  { year: '2015', totalMarriages: 168910, crudeMarriageRate: 3.6, avgAgeMen: 36.6, avgAgeWomen: 34.2 },
  { year: '2016', totalMarriages: 175343, crudeMarriageRate: 3.7, avgAgeMen: 36.9, avgAgeWomen: 34.5 },
  { year: '2017', totalMarriages: 173626, crudeMarriageRate: 3.7, avgAgeMen: 37.3, avgAgeWomen: 34.8 },
  { year: '2018', totalMarriages: 167613, crudeMarriageRate: 3.6, avgAgeMen: 37.7, avgAgeWomen: 35.1 },
  { year: '2019', totalMarriages: 166530, crudeMarriageRate: 3.5, avgAgeMen: 38.0, avgAgeWomen: 35.4 },
  { year: '2020', totalMarriages: 90670, crudeMarriageRate: 1.9, avgAgeMen: 38.5, avgAgeWomen: 35.8 },
  { year: '2021', totalMarriages: 148588, crudeMarriageRate: 3.1, avgAgeMen: 38.7, avgAgeWomen: 36.0 },
  { year: '2022', totalMarriages: 179107, crudeMarriageRate: 3.7, avgAgeMen: 39.0, avgAgeWomen: 36.3 },
  { year: '2023', totalMarriages: 172430, crudeMarriageRate: 3.5, avgAgeMen: 39.6, avgAgeWomen: 36.9 },
  { year: '2024', totalMarriages: 175364, crudeMarriageRate: 3.57, avgAgeMen: 39.9, avgAgeWomen: 37.2 },
  { year: '2025', totalMarriages: null, crudeMarriageRate: null, avgAgeMen: null, avgAgeWomen: null },
];

export const SPAIN_MARRIAGE_INDICATORS_URL =
  'https://www.ine.es/dynt3/inebase/es/index.htm?capsel=2068&padre=1157';

export const SPAIN_MARRIAGE_2024_RELEASE_URL =
  'https://ine.es/dyngs/Prensa/es/MNP2024.htm?print=1';
