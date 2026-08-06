import type { MarriageRatesRow } from '../../../components/countries/germany/GermanyMarriagesSection';

/**
 * Italy marriage indicators, 2000-2025.
 *
 * Eurostat demo_nind supplies marriages, crude rates and mean age at first
 * marriage through 2024. The missing 2012 and 2015 age observations are linear
 * interpolations. Istat supplies the provisional 2025 marriage count and crude
 * rate; 2025 ages extend the recent Eurostat trend and are estimates.
 */
export const ITALY_MARRIAGE_RATES_SERIES: readonly MarriageRatesRow[] = [
  { year: '2000', totalMarriages: 284_410, crudeMarriageRate: 5.0, avgAgeMen: 30.9, avgAgeWomen: 27.8 },
  { year: '2001', totalMarriages: 264_026, crudeMarriageRate: 4.6, avgAgeMen: 31.2, avgAgeWomen: 28.1 },
  { year: '2002', totalMarriages: 270_013, crudeMarriageRate: 4.7, avgAgeMen: 31.8, avgAgeWomen: 28.4 },
  { year: '2003', totalMarriages: 264_097, crudeMarriageRate: 4.6, avgAgeMen: 31.7, avgAgeWomen: 28.6 },
  { year: '2004', totalMarriages: 248_969, crudeMarriageRate: 4.3, avgAgeMen: 32.0, avgAgeWomen: 28.8 },
  { year: '2005', totalMarriages: 247_740, crudeMarriageRate: 4.3, avgAgeMen: 32.3, avgAgeWomen: 29.1 },
  { year: '2006', totalMarriages: 245_992, crudeMarriageRate: 4.2, avgAgeMen: 32.5, avgAgeWomen: 29.3 },
  { year: '2007', totalMarriages: 250_360, crudeMarriageRate: 4.3, avgAgeMen: 32.6, avgAgeWomen: 29.6 },
  { year: '2008', totalMarriages: 246_613, crudeMarriageRate: 4.2, avgAgeMen: 32.8, avgAgeWomen: 29.8 },
  { year: '2009', totalMarriages: 230_613, crudeMarriageRate: 3.9, avgAgeMen: 33.0, avgAgeWomen: 30.0 },
  { year: '2010', totalMarriages: 217_700, crudeMarriageRate: 3.7, avgAgeMen: 33.2, avgAgeWomen: 30.3 },
  { year: '2011', totalMarriages: 204_830, crudeMarriageRate: 3.4, avgAgeMen: 33.5, avgAgeWomen: 30.5 },
  { year: '2012', totalMarriages: 208_947, crudeMarriageRate: 3.5, avgAgeMen: 33.8, avgAgeWomen: 30.8 },
  { year: '2013', totalMarriages: 194_057, crudeMarriageRate: 3.2, avgAgeMen: 34.0, avgAgeWomen: 31.1 },
  { year: '2014', totalMarriages: 189_765, crudeMarriageRate: 3.1, avgAgeMen: 34.2, avgAgeWomen: 31.3 },
  { year: '2015', totalMarriages: 194_377, crudeMarriageRate: 3.2, avgAgeMen: 34.5, avgAgeWomen: 31.6 },
  { year: '2016', totalMarriages: 203_258, crudeMarriageRate: 3.4, avgAgeMen: 34.7, avgAgeWomen: 31.9 },
  { year: '2017', totalMarriages: 191_287, crudeMarriageRate: 3.2, avgAgeMen: 35.0, avgAgeWomen: 32.2 },
  { year: '2018', totalMarriages: 195_778, crudeMarriageRate: 3.2, avgAgeMen: 35.2, avgAgeWomen: 32.4 },
  { year: '2019', totalMarriages: 184_088, crudeMarriageRate: 3.1, avgAgeMen: 35.5, avgAgeWomen: 32.7 },
  { year: '2020', totalMarriages: 96_841, crudeMarriageRate: 1.6, avgAgeMen: 36.4, avgAgeWomen: 33.6 },
  { year: '2021', totalMarriages: 180_416, crudeMarriageRate: 3.1, avgAgeMen: 35.7, avgAgeWomen: 33.0 },
  { year: '2022', totalMarriages: 189_140, crudeMarriageRate: 3.2, avgAgeMen: 36.2, avgAgeWomen: 33.6 },
  { year: '2023', totalMarriages: 184_207, crudeMarriageRate: 3.1, avgAgeMen: 36.5, avgAgeWomen: 33.9 },
  { year: '2024', totalMarriages: 173_272, crudeMarriageRate: 2.9, avgAgeMen: 36.7, avgAgeWomen: 34.2 },
  { year: '2025', totalMarriages: 165_000, crudeMarriageRate: 2.8, avgAgeMen: 37.0, avgAgeWomen: 34.5 },
];

export const ITALY_MARRIAGE_EUROSTAT_URL =
  'https://ec.europa.eu/eurostat/databrowser/view/demo_nind/default/table?lang=en';

export const ITALY_MARRIAGE_ISTAT_2025_URL =
  'https://www.istat.it/en/press-release/demographic-indicators-year-2025/';

