export type SpainBirthPoint = {
  year: number;
  births: number;
  provisional?: boolean;
};

export type SpainFertilityPoint = {
  year: number;
  total: number;
  spanish: number;
  foreign: number;
};

export type SpainMaternityAgePoint = {
  year: number;
  total: number;
  spanish: number;
  foreign: number;
};

export const SPAIN_BIRTH_SOURCES = {
  final2024: 'https://www.ine.es/dyngs/Prensa/MNP2024.htm',
  provisional2025: 'https://www.ine.es/dyngs/Prensa/en/EDES_EMN2025.htm',
  historical: 'https://www.ine.es/consul/serie.do?c=2&d=true&s=MNP162',
  eurostatFertility: 'https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20260306-1',
  eurostatDemography: 'https://ec.europa.eu/eurostat/web/interactive-publications/demography-2026',
} as const;

// Births occurring in Spain. 2000-2024 are final INE MNP observations; 2025 is the INE
// monthly-register estimate published on 18 February 2026 and remains provisional.
export const SPAIN_TOTAL_BIRTHS: readonly SpainBirthPoint[] = [
  { year: 2000, births: 397_632 },
  { year: 2001, births: 406_380 },
  { year: 2002, births: 418_846 },
  { year: 2003, births: 441_881 },
  { year: 2004, births: 454_591 },
  { year: 2005, births: 466_371 },
  { year: 2006, births: 482_957 },
  { year: 2007, births: 492_527 },
  { year: 2008, births: 519_779 },
  { year: 2009, births: 494_997 },
  { year: 2010, births: 486_575 },
  { year: 2011, births: 471_999 },
  { year: 2012, births: 454_648 },
  { year: 2013, births: 425_715 },
  { year: 2014, births: 427_595 },
  { year: 2015, births: 420_290 },
  { year: 2016, births: 410_583 },
  { year: 2017, births: 393_181 },
  { year: 2018, births: 372_777 },
  { year: 2019, births: 360_617 },
  { year: 2020, births: 341_315 },
  { year: 2021, births: 337_380 },
  { year: 2022, births: 329_251 },
  { year: 2023, births: 320_656 },
  { year: 2024, births: 318_005 },
  { year: 2025, births: 321_164, provisional: true },
];

export const SPAIN_FERTILITY_BY_NATIONALITY: readonly SpainFertilityPoint[] = [
  { year: 2014, total: 1.32, spanish: 1.27, foreign: 1.61 },
  { year: 2015, total: 1.33, spanish: 1.28, foreign: 1.65 },
  { year: 2016, total: 1.33, spanish: 1.28, foreign: 1.71 },
  { year: 2017, total: 1.31, spanish: 1.25, foreign: 1.70 },
  { year: 2018, total: 1.26, spanish: 1.20, foreign: 1.64 },
  { year: 2019, total: 1.23, spanish: 1.17, foreign: 1.58 },
  { year: 2020, total: 1.18, spanish: 1.13, foreign: 1.45 },
  { year: 2021, total: 1.18, spanish: 1.15, foreign: 1.35 },
  { year: 2022, total: 1.16, spanish: 1.12, foreign: 1.35 },
  { year: 2023, total: 1.12, spanish: 1.09, foreign: 1.28 },
  { year: 2024, total: 1.10, spanish: 1.07, foreign: 1.27 },
];

export const SPAIN_MATERNITY_AGE_BY_NATIONALITY: readonly SpainMaternityAgePoint[] = [
  { year: 2014, total: 31.8, spanish: 32.3, foreign: 29.3 },
  { year: 2015, total: 31.9, spanish: 32.4, foreign: 29.4 },
  { year: 2016, total: 32.0, spanish: 32.5, foreign: 29.5 },
  { year: 2017, total: 32.1, spanish: 32.6, foreign: 29.6 },
  { year: 2018, total: 32.2, spanish: 32.7, foreign: 29.8 },
  { year: 2019, total: 32.2, spanish: 32.8, foreign: 30.0 },
  { year: 2020, total: 32.3, spanish: 32.8, foreign: 30.1 },
  { year: 2021, total: 32.6, spanish: 33.1, foreign: 30.6 },
  { year: 2022, total: 32.6, spanish: 33.1, foreign: 30.5 },
  { year: 2023, total: 32.6, spanish: 33.1, foreign: 30.5 },
  { year: 2024, total: 32.6, spanish: 33.2, foreign: 30.5 },
];

export const SPAIN_MOTHER_AGE_COMPARISON = [
  { age: 'Under 25', births2015: 38_141, births2025: 30_497, share2015: 9.1, share2025: 9.5 },
  { age: '25-39', births2015: 349_420, births2025: 257_307, share2015: 83.1, share2025: 80.1 },
  { age: '40+', births2015: 32_729, births2025: 33_360, share2015: 7.8, share2025: 10.4 },
] as const;

export const SPAIN_2025_MONTHLY_BIRTHS = [
  { month: 'Jan', births: 26_830 },
  { month: 'Feb', births: 24_316 },
  { month: 'Mar', births: 26_366 },
  { month: 'Apr', births: 25_883 },
  { month: 'May', births: 25_967 },
  { month: 'Jun', births: 25_804 },
  { month: 'Jul', births: 27_197 },
  { month: 'Aug', births: 27_485 },
  { month: 'Sep', births: 28_256 },
  { month: 'Oct', births: 28_711 },
  { month: 'Nov', births: 27_075 },
  { month: 'Dec', births: 27_274 },
] as const;

export const SPAIN_NATURAL_BALANCE = [
  { year: 2015, balance: -1_976 },
  { year: 2016, balance: 503 },
  { year: 2017, balance: -30_772 },
  { year: 2018, balance: -54_326 },
  { year: 2019, balance: -57_355 },
  { year: 2020, balance: -151_812 },
  { year: 2021, balance: -112_326 },
  { year: 2022, balance: -133_250 },
  { year: 2023, balance: -113_590 },
  { year: 2024, balance: -116_056 },
  { year: 2025, balance: -125_818, provisional: true },
] as const;

export const SPAIN_2025_REGIONAL_BIRTHS = [
  { region: 'Andalusia', births: 60_177, change: 0.1 },
  { region: 'Catalonia', births: 54_214, change: 0.9 },
  { region: 'Madrid', births: 52_450, change: 3.3 },
  { region: 'Valencian Community', births: 35_822, change: 0.8 },
  { region: 'Castile-La Mancha', births: 14_560, change: 2.6 },
  { region: 'Galicia', births: 13_567, change: 1.6 },
  { region: 'Basque Country', births: 13_344, change: 3.0 },
  { region: 'Castile and Leon', births: 12_649, change: 0.9 },
  { region: 'Murcia', births: 12_604, change: 0.8 },
  { region: 'Canary Islands', births: 11_672, change: -0.2 },
] as const;

export const SPAIN_BIRTH_RATES_BLOCK_COUNT = 9;
