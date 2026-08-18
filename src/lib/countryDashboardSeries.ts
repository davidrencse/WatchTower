import type { ChartConfig } from '../components/ui/chart';

/**
 * Static chart series and configs for the country dashboard (Germany + France).
 * Pure data — no JSX, no component imports — so it stays cheap to import.
 */

export type GermanyGdpRow = { year: string; gdp: number; gdpPerCapita: number };

export const GERMANY_GDP_SERIES: readonly GermanyGdpRow[] = [
  { year: '2015', gdp: 3425, gdpPerCapita: 41911 },
  { year: '2016', gdp: 3537, gdpPerCapita: 42961 },
  { year: '2017', gdp: 3765, gdpPerCapita: 45527 },
  { year: '2018', gdp: 4055, gdpPerCapita: 48916 },
  { year: '2019', gdp: 3960, gdpPerCapita: 47624 },
  { year: '2020', gdp: 3941, gdpPerCapita: 47380 },
  { year: '2021', gdp: 4355, gdpPerCapita: 52266 },
  { year: '2022', gdp: 4082, gdpPerCapita: 49686 },
  { year: '2023', gdp: 4456, gdpPerCapita: 54343 },
  { year: '2024', gdp: 4686, gdpPerCapita: 56104 },
  { year: '2025', gdp: 5014, gdpPerCapita: 60000 },
];

export type GermanyInflationSeriesRow = { year: string; inflation: number };

export const GERMANY_INFLATION_SERIES: readonly GermanyInflationSeriesRow[] = [
  { year: '2000', inflation: 1.44 },
  { year: '2001', inflation: 1.98 },
  { year: '2002', inflation: 1.42 },
  { year: '2003', inflation: 1.03 },
  { year: '2004', inflation: 1.67 },
  { year: '2005', inflation: 1.55 },
  { year: '2006', inflation: 1.58 },
  { year: '2007', inflation: 2.3 },
  { year: '2008', inflation: 2.63 },
  { year: '2009', inflation: 0.31 },
  { year: '2010', inflation: 1.1 },
  { year: '2011', inflation: 2.08 },
  { year: '2012', inflation: 2.01 },
  { year: '2013', inflation: 1.5 },
  { year: '2014', inflation: 0.91 },
  { year: '2015', inflation: 0.51 },
  { year: '2016', inflation: 0.49 },
  { year: '2017', inflation: 1.51 },
  { year: '2018', inflation: 1.73 },
  { year: '2019', inflation: 1.45 },
  { year: '2020', inflation: 0.14 },
  { year: '2021', inflation: 3.07 },
  { year: '2022', inflation: 6.87 },
  { year: '2023', inflation: 5.95 },
  { year: '2024', inflation: 2.26 },
  { year: '2025', inflation: 2.2 },
];

export type GermanyBirthsSeriesRow = {
  year: string;
  totalLiveBirths: number;
  birthsGermanMothers: number;
  birthsForeignMothers: number;
  shareGermanMothersPct: number;
  isEstimate?: boolean;
};

export type GermanyBirthRatesExtraCard = {
  title: string;
  value: string;
  details?: string;
  source?: string;
  category?: 'diseases';
};

export const GERMANY_TOTAL_BIRTHS_SERIES: readonly GermanyBirthsSeriesRow[] = [
  { year: '2000', totalLiveBirths: 766999, birthsGermanMothers: 629000, birthsForeignMothers: 137999, shareGermanMothersPct: 82.0 },
  { year: '2001', totalLiveBirths: 734475, birthsGermanMothers: 602000, birthsForeignMothers: 132475, shareGermanMothersPct: 82.0 },
  { year: '2002', totalLiveBirths: 719250, birthsGermanMothers: 589000, birthsForeignMothers: 130250, shareGermanMothersPct: 81.9 },
  { year: '2003', totalLiveBirths: 706721, birthsGermanMothers: 579000, birthsForeignMothers: 127721, shareGermanMothersPct: 81.9 },
  { year: '2004', totalLiveBirths: 705622, birthsGermanMothers: 577000, birthsForeignMothers: 128622, shareGermanMothersPct: 81.8 },
  { year: '2005', totalLiveBirths: 692239, birthsGermanMothers: 565000, birthsForeignMothers: 127239, shareGermanMothersPct: 81.6 },
  { year: '2006', totalLiveBirths: 672724, birthsGermanMothers: 548000, birthsForeignMothers: 124724, shareGermanMothersPct: 81.5 },
  { year: '2007', totalLiveBirths: 684862, birthsGermanMothers: 557000, birthsForeignMothers: 127862, shareGermanMothersPct: 81.3 },
  { year: '2008', totalLiveBirths: 682514, birthsGermanMothers: 554000, birthsForeignMothers: 128514, shareGermanMothersPct: 81.2 },
  { year: '2009', totalLiveBirths: 665126, birthsGermanMothers: 539000, birthsForeignMothers: 126126, shareGermanMothersPct: 81.0 },
  { year: '2010', totalLiveBirths: 677947, birthsGermanMothers: 540000, birthsForeignMothers: 137947, shareGermanMothersPct: 79.7 },
  { year: '2011', totalLiveBirths: 662685, birthsGermanMothers: 527000, birthsForeignMothers: 135685, shareGermanMothersPct: 79.5 },
  { year: '2012', totalLiveBirths: 673544, birthsGermanMothers: 533000, birthsForeignMothers: 140544, shareGermanMothersPct: 79.1 },
  { year: '2013', totalLiveBirths: 682069, birthsGermanMothers: 537000, birthsForeignMothers: 145069, shareGermanMothersPct: 78.7 },
  { year: '2014', totalLiveBirths: 714966, birthsGermanMothers: 558000, birthsForeignMothers: 156966, shareGermanMothersPct: 78.0 },
  { year: '2015', totalLiveBirths: 738819, birthsGermanMothers: 579000, birthsForeignMothers: 159819, shareGermanMothersPct: 78.4 },
  { year: '2016', totalLiveBirths: 792141, birthsGermanMothers: 610000, birthsForeignMothers: 182141, shareGermanMothersPct: 77.0 },
  { year: '2017', totalLiveBirths: 784901, birthsGermanMothers: 600000, birthsForeignMothers: 184901, shareGermanMothersPct: 76.4 },
  { year: '2018', totalLiveBirths: 787523, birthsGermanMothers: 595000, birthsForeignMothers: 192523, shareGermanMothersPct: 75.6 },
  { year: '2019', totalLiveBirths: 779000, birthsGermanMothers: 590000, birthsForeignMothers: 189000, shareGermanMothersPct: 75.7 },
  { year: '2020', totalLiveBirths: 773144, birthsGermanMothers: 582000, birthsForeignMothers: 191144, shareGermanMothersPct: 75.3 },
  { year: '2021', totalLiveBirths: 795492, birthsGermanMothers: 590000, birthsForeignMothers: 205492, shareGermanMothersPct: 74.2 },
  { year: '2022', totalLiveBirths: 738819, birthsGermanMothers: 545000, birthsForeignMothers: 193819, shareGermanMothersPct: 73.8 },
  { year: '2023', totalLiveBirths: 692989, birthsGermanMothers: 500670, birthsForeignMothers: 192319, shareGermanMothersPct: 72.3 },
  { year: '2024', totalLiveBirths: 677117, birthsGermanMothers: 482796, birthsForeignMothers: 194321, shareGermanMothersPct: 71.3 },
  { year: '2025', totalLiveBirths: 660000, birthsGermanMothers: 465000, birthsForeignMothers: 195000, shareGermanMothersPct: 70.5, isEstimate: true },
] as const;

export type GermanyBirthsByRaceRow = {
  year: string;
  germanNativeNoMigrationBg: number;
  europeanNonGerman: number;
  african: number;
  asian: number;
  southAmerican: number;
  northAmerican: number;
  otherUnknown: number;
};

/** Birth counts by parental / regional origin grouping (2000–2025). */
export const GERMANY_BIRTHS_BY_RACE_SERIES: readonly GermanyBirthsByRaceRow[] = [
  { year: '2000', germanNativeNoMigrationBg: 620000, europeanNonGerman: 85000, african: 12000, asian: 18000, southAmerican: 3500, northAmerican: 4500, otherUnknown: 28000 },
  { year: '2001', germanNativeNoMigrationBg: 590000, europeanNonGerman: 86000, african: 12500, asian: 18500, southAmerican: 3600, northAmerican: 4600, otherUnknown: 28500 },
  { year: '2002', germanNativeNoMigrationBg: 575000, europeanNonGerman: 87000, african: 13000, asian: 19000, southAmerican: 3700, northAmerican: 4700, otherUnknown: 29000 },
  { year: '2003', germanNativeNoMigrationBg: 560000, europeanNonGerman: 88000, african: 13500, asian: 20000, southAmerican: 3800, northAmerican: 4800, otherUnknown: 29500 },
  { year: '2004', germanNativeNoMigrationBg: 555000, europeanNonGerman: 90000, african: 14000, asian: 21000, southAmerican: 3900, northAmerican: 4900, otherUnknown: 30000 },
  { year: '2005', germanNativeNoMigrationBg: 535000, europeanNonGerman: 92000, african: 14500, asian: 22000, southAmerican: 4000, northAmerican: 5000, otherUnknown: 31000 },
  { year: '2006', germanNativeNoMigrationBg: 520000, europeanNonGerman: 95000, african: 15500, asian: 24000, southAmerican: 4200, northAmerican: 5200, otherUnknown: 32500 },
  { year: '2007', germanNativeNoMigrationBg: 520000, europeanNonGerman: 98000, african: 16500, asian: 26000, southAmerican: 4500, northAmerican: 5500, otherUnknown: 34000 },
  { year: '2008', germanNativeNoMigrationBg: 510000, europeanNonGerman: 102000, african: 17500, asian: 28000, southAmerican: 4800, northAmerican: 5800, otherUnknown: 35500 },
  { year: '2009', germanNativeNoMigrationBg: 495000, europeanNonGerman: 105000, african: 18500, asian: 30000, southAmerican: 5100, northAmerican: 6100, otherUnknown: 37000 },
  { year: '2010', germanNativeNoMigrationBg: 500000, europeanNonGerman: 108000, african: 19500, asian: 32000, southAmerican: 5400, northAmerican: 6400, otherUnknown: 38500 },
  { year: '2011', germanNativeNoMigrationBg: 485000, europeanNonGerman: 110000, african: 20500, asian: 34000, southAmerican: 5700, northAmerican: 6700, otherUnknown: 40000 },
  { year: '2012', germanNativeNoMigrationBg: 485000, europeanNonGerman: 115000, african: 22000, asian: 37000, southAmerican: 6100, northAmerican: 7100, otherUnknown: 42500 },
  { year: '2013', germanNativeNoMigrationBg: 480000, europeanNonGerman: 120000, african: 24000, asian: 41000, southAmerican: 6500, northAmerican: 7600, otherUnknown: 45000 },
  { year: '2014', germanNativeNoMigrationBg: 490000, europeanNonGerman: 125000, african: 26000, asian: 46000, southAmerican: 7000, northAmerican: 8200, otherUnknown: 48000 },
  { year: '2015', germanNativeNoMigrationBg: 490000, europeanNonGerman: 135000, african: 32000, asian: 52000, southAmerican: 7800, northAmerican: 8800, otherUnknown: 53000 },
  { year: '2016', germanNativeNoMigrationBg: 505000, europeanNonGerman: 145000, african: 38000, asian: 58000, southAmerican: 8500, northAmerican: 9500, otherUnknown: 59000 },
  { year: '2017', germanNativeNoMigrationBg: 490000, europeanNonGerman: 148000, african: 41000, asian: 62000, southAmerican: 9000, northAmerican: 10000, otherUnknown: 62000 },
  { year: '2018', germanNativeNoMigrationBg: 480000, europeanNonGerman: 152000, african: 44000, asian: 67000, southAmerican: 9500, northAmerican: 10500, otherUnknown: 65000 },
  { year: '2019', germanNativeNoMigrationBg: 465000, europeanNonGerman: 155000, african: 47000, asian: 72000, southAmerican: 10000, northAmerican: 11000, otherUnknown: 68000 },
  { year: '2020', germanNativeNoMigrationBg: 455000, europeanNonGerman: 158000, african: 49000, asian: 75000, southAmerican: 10200, northAmerican: 11200, otherUnknown: 70000 },
  { year: '2021', germanNativeNoMigrationBg: 460000, europeanNonGerman: 162000, african: 51000, asian: 79000, southAmerican: 10500, northAmerican: 11500, otherUnknown: 73000 },
  { year: '2022', germanNativeNoMigrationBg: 420000, europeanNonGerman: 158000, african: 50000, asian: 78000, southAmerican: 10300, northAmerican: 11300, otherUnknown: 71000 },
  { year: '2023', germanNativeNoMigrationBg: 390000, europeanNonGerman: 152000, african: 48000, asian: 75000, southAmerican: 10000, northAmerican: 11000, otherUnknown: 69000 },
  { year: '2024', germanNativeNoMigrationBg: 375000, europeanNonGerman: 148000, african: 47000, asian: 73000, southAmerican: 9800, northAmerican: 10800, otherUnknown: 67000 },
  { year: '2025', germanNativeNoMigrationBg: 355000, europeanNonGerman: 145000, african: 46000, asian: 71000, southAmerican: 9500, northAmerican: 10500, otherUnknown: 65000 },
] as const;

export const GERMANY_BIRTHS_BY_RACE_CHART_CONFIG = {
  germanNativeNoMigrationBg: { label: 'German Native (no migration bg)', color: '#22c55e' },
  europeanNonGerman: { label: 'European (non-German)', color: '#38bdf8' },
  african: { label: 'African', color: '#a78bfa' },
  asian: { label: 'Asian', color: '#f472b6' },
  southAmerican: { label: 'South American', color: '#f59e0b' },
  northAmerican: { label: 'North American', color: '#94a3b8' },
  otherUnknown: { label: 'Other / Unknown', color: '#64748b' },
} satisfies ChartConfig;

export type GermanyMixedRaceBirthsRow = {
  year: string;
  germanFemaleNonGermanMaleBirths: number;
  germanMaleNonGermanFemaleBirths: number;
  totalMixedBirths: number;
};

export const GERMANY_MIXED_RACE_BIRTHS_SERIES: readonly GermanyMixedRaceBirthsRow[] = [
  { year: '2000', germanFemaleNonGermanMaleBirths: 10250, germanMaleNonGermanFemaleBirths: 14800, totalMixedBirths: 25050 },
  { year: '2001', germanFemaleNonGermanMaleBirths: 10800, germanMaleNonGermanFemaleBirths: 15500, totalMixedBirths: 26300 },
  { year: '2002', germanFemaleNonGermanMaleBirths: 11300, germanMaleNonGermanFemaleBirths: 16200, totalMixedBirths: 27500 },
  { year: '2003', germanFemaleNonGermanMaleBirths: 11800, germanMaleNonGermanFemaleBirths: 16900, totalMixedBirths: 28700 },
  { year: '2004', germanFemaleNonGermanMaleBirths: 12400, germanMaleNonGermanFemaleBirths: 17700, totalMixedBirths: 30100 },
  { year: '2005', germanFemaleNonGermanMaleBirths: 12900, germanMaleNonGermanFemaleBirths: 18500, totalMixedBirths: 31400 },
  { year: '2006', germanFemaleNonGermanMaleBirths: 13500, germanMaleNonGermanFemaleBirths: 19400, totalMixedBirths: 32900 },
  { year: '2007', germanFemaleNonGermanMaleBirths: 14100, germanMaleNonGermanFemaleBirths: 20300, totalMixedBirths: 34400 },
  { year: '2008', germanFemaleNonGermanMaleBirths: 14800, germanMaleNonGermanFemaleBirths: 21300, totalMixedBirths: 36100 },
  { year: '2009', germanFemaleNonGermanMaleBirths: 15500, germanMaleNonGermanFemaleBirths: 22400, totalMixedBirths: 37900 },
  { year: '2010', germanFemaleNonGermanMaleBirths: 16200, germanMaleNonGermanFemaleBirths: 23600, totalMixedBirths: 39800 },
  { year: '2011', germanFemaleNonGermanMaleBirths: 16900, germanMaleNonGermanFemaleBirths: 24800, totalMixedBirths: 41700 },
  { year: '2012', germanFemaleNonGermanMaleBirths: 17600, germanMaleNonGermanFemaleBirths: 26100, totalMixedBirths: 43700 },
  { year: '2013', germanFemaleNonGermanMaleBirths: 18300, germanMaleNonGermanFemaleBirths: 27500, totalMixedBirths: 45800 },
  { year: '2014', germanFemaleNonGermanMaleBirths: 19100, germanMaleNonGermanFemaleBirths: 29000, totalMixedBirths: 48100 },
  { year: '2015', germanFemaleNonGermanMaleBirths: 19900, germanMaleNonGermanFemaleBirths: 30600, totalMixedBirths: 50500 },
  { year: '2016', germanFemaleNonGermanMaleBirths: 20800, germanMaleNonGermanFemaleBirths: 32300, totalMixedBirths: 53100 },
  { year: '2017', germanFemaleNonGermanMaleBirths: 21700, germanMaleNonGermanFemaleBirths: 34100, totalMixedBirths: 55800 },
  { year: '2018', germanFemaleNonGermanMaleBirths: 22600, germanMaleNonGermanFemaleBirths: 36000, totalMixedBirths: 58600 },
  { year: '2019', germanFemaleNonGermanMaleBirths: 23600, germanMaleNonGermanFemaleBirths: 38100, totalMixedBirths: 61700 },
  { year: '2020', germanFemaleNonGermanMaleBirths: 16849, germanMaleNonGermanFemaleBirths: 21373, totalMixedBirths: 38222 },
  { year: '2021', germanFemaleNonGermanMaleBirths: 18639, germanMaleNonGermanFemaleBirths: 22665, totalMixedBirths: 41304 },
  { year: '2022', germanFemaleNonGermanMaleBirths: 19382, germanMaleNonGermanFemaleBirths: 22769, totalMixedBirths: 42151 },
  { year: '2023', germanFemaleNonGermanMaleBirths: 18547, germanMaleNonGermanFemaleBirths: 21890, totalMixedBirths: 40437 },
  { year: '2024', germanFemaleNonGermanMaleBirths: 18122, germanMaleNonGermanFemaleBirths: 21542, totalMixedBirths: 39664 },
  { year: '2025', germanFemaleNonGermanMaleBirths: 17900, germanMaleNonGermanFemaleBirths: 21300, totalMixedBirths: 39200 },
] as const;

export const GERMANY_MIXED_RACE_BIRTHS_CHART_CONFIG = {
  germanFemaleNonGermanMaleBirths: { label: 'German female + non-German male', color: '#f59e0b' },
  germanMaleNonGermanFemaleBirths: { label: 'German male + non-German female', color: '#f43f5e' },
  totalMixedBirths: { label: 'Total mixed births', color: '#a78bfa' },
} satisfies ChartConfig;

export const GERMANY_BIRTH_RATES_EXTRA_CARDS: readonly GermanyBirthRatesExtraCard[] = [
  { category: 'diseases', title: 'Cardiovascular diseases', value: '~13 million affected', details: 'Leading cause of death/disability. Ischaemic heart disease alone causes about 441,000 new cases per year.' },
  { category: 'diseases', title: 'Cancer (all types)', value: '~4.9 million (5-year prevalence)', details: '~606,000 new cases per year; very high burden.' },
  { category: 'diseases', title: 'Chronic back pain / musculoskeletal', value: '~15–20 million (lifetime)', details: 'Extremely common; low back pain is a top cause of disability.' },
  { category: 'diseases', title: 'Diabetes (mainly Type 2)', value: '~6.05–8.5 million', details: 'Prevalence around 8.6%; expected to rise sharply.' },
  { category: 'diseases', title: 'Depression / mental health disorders', value: '~8–10 million (lifetime)', details: 'Very high burden, especially anxiety and depression.' },
  { category: 'diseases', title: 'Obesity (adults)', value: '~14–18 million', details: '17% self-reported obese; measured overweight/obese rates are much higher.' },
  { category: 'diseases', title: 'COPD', value: '~5–6 million', details: 'Major cause of death/disability; strongly linked to smoking.' },
  { category: 'diseases', title: 'Hypertension', value: '~20–25 million', details: 'One of the most widespread risk factors.' },
  { category: 'diseases', title: 'Alzheimer’s / dementia', value: '~1.8–2.0 million', details: 'Rising rapidly due to aging population.' },
  { category: 'diseases', title: 'HIV', value: '~97,000 living with HIV', details: 'Stable burden; around 2,000 new infections per year.' },
  { title: 'Smoking Rate (Daily)', value: '14.6%', details: 'Adults 15+, 2023–2025.' },
  { title: 'Autism cases in Germany', value: '~630,000–835,000 people', details: 'Roughly 0.76%–1% of the population.' },
  { title: 'Water quality', value: 'Excellent / Very good', source: 'German Environment Agency (Umweltbundesamt) and Drinking Water Ordinance (TrinkwV) 2023–2026.' },
  { title: 'Air quality (AQI)', value: 'National average ~52 (2025–2026)', details: 'Major cities are typically ~35–55; main pollutant is PM2.5 with occasional NO2 spikes.', source: 'IQAir Germany 2025–2026 country report and real-time AQI data.' },
  { title: 'General happiness', value: 'Rank #17 globally (score ~6.88/10)', source: 'World Happiness Report 2026 (Gallup / UN Sustainable Development Solutions Network).' },
  { title: 'Environmental ranking', value: 'EPI 2024 rank #3 (score 74.5)', details: 'Strong in biodiversity/protected areas/marine conservation; weaker in some air/climate policy implementation.', source: 'Yale Environmental Performance Index 2024.' },
  { title: 'Walking modal share', value: '~25%–30% nationally', details: 'Metropolitan areas ~30%–32%; average walking trip is about 0.9 km.', source: 'Mobility in Germany (MiD) 2023 survey with 2025 updates.' },
  { title: 'Cycling modal share', value: '~11%–17% nationally', details: 'Often 15%–25% in cities; about 40%–45% cycle at least occasionally.', source: 'Mobility in Germany (MiD) 2023 and National Cycling Plan 3.0 (2025 data).' },
] as const;

export const FRANCE_HEALTH_EXTRA_CARDS: readonly GermanyBirthRatesExtraCard[] = [
  { category: 'diseases', title: 'Cardiovascular disease', value: '≈15.0 million', details: '2025 · people · Estimated' },
  { category: 'diseases', title: 'Cancer (5-year prevalence)', value: '≈4.3 million', details: '2025 · people · Estimated' },
  { category: 'diseases', title: 'Chronic back pain / musculoskeletal', value: '≈18–20 million', details: '2025 · people · Estimated' },
  { category: 'diseases', title: 'Diabetes (mainly Type 2)', value: '≈3.0–3.6 million', details: '2025 · people · Estimated' },
  { category: 'diseases', title: 'Depression / mental disorders (lifetime)', value: '≈9–11 million', details: '2025 · people · Estimated' },
  { category: 'diseases', title: 'Adult obesity (absolute number)', value: '≈7.7 million', details: '2025 · people · Derived estimate' },
  { category: 'diseases', title: 'COPD', value: '≈3.8–4.5 million', details: '2025 · people · Estimated' },
  { category: 'diseases', title: 'Hypertension', value: '≈17–20 million', details: '2025 · people · Estimated' },
  { category: 'diseases', title: 'Alzheimer’s / dementia', value: '≈1.35–1.5 million', details: '2025 · people · Estimated' },
  { category: 'diseases', title: 'People living with HIV', value: '≈210,000', details: '2025 · people · Official estimate' },
  { title: 'Smoking Rate (Daily)', value: '23.1%', details: 'Adults 15+ · 2025 · Official' },
  { title: 'Autism spectrum disorder', value: '≈700,000–900,000', details: '2025 · people · Estimated' },
  { title: 'Water quality', value: 'Excellent / Very good', details: '2025 · Official rating' },
  { title: 'National AQI', value: '≈46', details: '2025 · AQI · Estimated national average' },
  { title: 'Environmental Performance Index', value: 'Rank #5 (Score ≈72.1)', details: '2024 · Official' },
  { title: 'World Happiness Report', value: 'Rank #33 (Score ≈6.59/10)', details: '2025 · Official' },
  { title: 'Walking modal share', value: '≈24%', details: '2025 · share of trips · Estimated' },
  { title: 'Cycling modal share', value: '≈5–7% nationally', details: '2025 · share of trips · Estimated' },
] as const;

export const FRANCE_HEALTH_BASIC_GROUP_COUNT = 12;

/** First index of the grid row that includes “Environmental ranking” (lg: 3 columns). */
export const GERMANY_HEALTH_EXTRAS_ENV_ROW_START_INDEX = 15;
/** Match Germany: five complete 3-card rows, then the final environment/mobility row. */
export const FRANCE_HEALTH_EXTRAS_ENV_ROW_START_INDEX = 15;

/**
 * Same 18 cards / same order as Germany and France so the 3-column grid fills exactly
 * six rows with no empty cell. Italy's Alzheimer's-vs-all-dementia split and its PM2.5
 * reading ride along in the `details` line of their parent card rather than claiming
 * cards of their own, which would leave a hole in the final row.
 */
export const ITALY_HEALTH_EXTRA_CARDS: readonly GermanyBirthRatesExtraCard[] = [
  { category: 'diseases', title: 'Cardiovascular disease', value: '≈9.5 million', details: '2025 · people · Modelled prevalence' },
  { category: 'diseases', title: 'Cancer (5-year prevalence)', value: '≈2.3 million', details: '2025 · people · Modelled estimate' },
  { category: 'diseases', title: 'Chronic back pain / musculoskeletal', value: '≈16 million', details: '2025 · people · Modelled estimate' },
  { category: 'diseases', title: 'Diabetes (mainly Type 2)', value: '≈4.0 million', details: '2025 · people · Estimated national prevalence' },
  { category: 'diseases', title: 'Depression / mental disorders (lifetime)', value: '≈10 million', details: '2025 · people · Modelled estimate' },
  { category: 'diseases', title: 'Adult obesity (absolute number)', value: '≈6.1 million', details: '2025 · people · Derived from self-reported obesity rate' },
  { category: 'diseases', title: 'COPD', value: '≈3.5 million', details: '2025 · people · Modelled prevalence' },
  { category: 'diseases', title: 'Hypertension', value: '≈14 million', details: '2025 · people · Derived from national examination data' },
  { category: 'diseases', title: 'Alzheimer’s / dementia', value: '≈1.2 million', details: '2025 · people · Official estimate · Alzheimer’s alone ≈600,000' },
  { category: 'diseases', title: 'People living with HIV', value: '≈110,000', details: '2024 · people · Followed by public clinical centres' },
  { title: 'Smoking Rate (Daily)', value: '19.5%', details: 'Adults 15+ · 2025 · OECD' },
  { title: 'Autism spectrum disorder', value: '≈600,000', details: '2025 · people · Modelled population estimate' },
  { title: 'Water quality', value: 'Very good — ≈98% compliant', details: '2025 · National dashboard estimate' },
  { title: 'National AQI', value: '≈55', details: '2025 · AQI · Derived national proxy from PM2.5 exposure of 14.3 µg/m³ (2025 OECD)' },
  { title: 'Environmental Performance Index', value: 'Rank #29 (Score 60.3)', details: 'EPI 2024' },
  { title: 'World Happiness Report', value: 'Rank #40 (Score 6.415/10)', details: '2025' },
  { title: 'Walking modal share', value: '≈21.8%', details: '2024 · share of trips · Derived national estimate' },
  { title: 'Cycling modal share', value: '5.2%', details: 'H1 2025 · share of trips' },
] as const;

export const ITALY_HEALTH_BASIC_GROUP_COUNT = 12;

/** Match Germany/France: five complete 3-card rows, then the final environment/mobility row. */
export const ITALY_HEALTH_EXTRAS_ENV_ROW_START_INDEX = 15;

/**
 * Same 18 cards / same order as Germany, France and Italy so the 3-column grid fills exactly
 * six rows with no empty cell. Spain's autism estimate is published alongside the disease
 * prevalence table rather than as a standalone indicator, so it keeps the `diseases` category.
 */
export const SPAIN_HEALTH_EXTRA_CARDS: readonly GermanyBirthRatesExtraCard[] = [
  { category: 'diseases', title: 'Cardiovascular diseases', value: '≈5.7 million', details: '2025 · people living with CVD · Modelled prevalence' },
  { category: 'diseases', title: 'Cancer (5-year prevalence)', value: '≈2.5–3 million', details: '2025 · people · New cases ≈280,000 per year' },
  { category: 'diseases', title: 'Chronic back pain / musculoskeletal', value: '≈10–15 million', details: '2025 · people · Lifetime high burden' },
  { category: 'diseases', title: 'Diabetes (mainly Type 2)', value: '≈5–6 million', details: '2025 · people · Modelled national prevalence' },
  { category: 'diseases', title: 'Depression / mental health disorders', value: '≈8–10 million', details: '2025 · people · Lifetime / high burden' },
  { category: 'diseases', title: 'Adult obesity (absolute number)', value: '≈7–8 million', details: '2025 · people · Derived from the 15% self-reported adult obesity rate' },
  { category: 'diseases', title: 'COPD', value: '≈2–3 million', details: '2025 · people · Modelled prevalence' },
  { category: 'diseases', title: 'Hypertension', value: '≈12–15 million', details: '2025 · people · Derived from national examination data' },
  { category: 'diseases', title: 'Alzheimer’s / dementia', value: '≈800,000–1.2 million', details: '2025 · people · Estimated range across sources' },
  { category: 'diseases', title: 'People living with HIV', value: '≈150,000–160,000', details: '2025 · people · Official estimate' },
  { category: 'diseases', title: 'Autism spectrum disorder', value: '≈400,000–600,000', details: '2025 · people · Modelled population estimate' },
  { title: 'Smoking Rate (Daily)', value: '19.8%', details: 'Adults 15+ · 2025 · OECD' },
  { title: 'Water quality', value: 'Excellent / Very good', details: '2025 · Official rating' },
  { title: 'Air quality (AQI)', value: 'National average ≈40–55', details: '2025 · AQI · Better than many European peers; major cities run higher' },
  { title: 'General happiness', value: 'Rank ≈#20–25 globally', details: '2025 · World Happiness Report score range ≈6.3–6.5/10' },
  { title: 'Environmental Performance Index', value: 'Rank #22 (Score 64.0)', details: 'EPI 2024' },
  { title: 'Walking modal share', value: '≈25–40% nationally', details: '2025 · share of trips · Higher in cities; 30–70% in the Madrid/Barcelona metros' },
  { title: 'Cycling modal share', value: '≈2–5% nationally', details: '2025 · share of trips · Higher in some cities' },
] as const;

export const SPAIN_HEALTH_BASIC_GROUP_COUNT = 12;

/** Match Germany/France/Italy: five complete 3-card rows, then the final environment/mobility row. */
export const SPAIN_HEALTH_EXTRAS_ENV_ROW_START_INDEX = 15;

export type GermanySuicideRateRow = { year: string; suicidePer100k: number };

export const GERMANY_SUICIDE_RATE_SERIES: readonly GermanySuicideRateRow[] = [
  { year: '2000', suicidePer100k: 13.9 },
  { year: '2001', suicidePer100k: 14.2 },
  { year: '2002', suicidePer100k: 14.6 },
  { year: '2003', suicidePer100k: 14.3 },
  { year: '2004', suicidePer100k: 13.8 },
  { year: '2005', suicidePer100k: 13.5 },
  { year: '2006', suicidePer100k: 13.2 },
  { year: '2007', suicidePer100k: 13.0 },
  { year: '2008', suicidePer100k: 12.8 },
  { year: '2009', suicidePer100k: 12.5 },
  { year: '2010', suicidePer100k: 12.3 },
  { year: '2011', suicidePer100k: 12.4 },
  { year: '2012', suicidePer100k: 12.3 },
  { year: '2013', suicidePer100k: 12.5 },
  { year: '2014', suicidePer100k: 12.1 },
  { year: '2015', suicidePer100k: 11.9 },
  { year: '2016', suicidePer100k: 12.0 },
  { year: '2017', suicidePer100k: 12.5 },
  { year: '2018', suicidePer100k: 12.8 },
  { year: '2019', suicidePer100k: 12.5 },
  { year: '2020', suicidePer100k: 12.9 },
  { year: '2021', suicidePer100k: 12.9 },
  { year: '2022', suicidePer100k: 12.8 },
  { year: '2023', suicidePer100k: 12.4 },
  { year: '2024', suicidePer100k: 12.3 },
  { year: '2025', suicidePer100k: 12.2 },
] as const;

export const FRANCE_SUICIDE_RATE_SERIES: readonly GermanySuicideRateRow[] = [
  { year: '2000', suicidePer100k: 20.8 },
  { year: '2001', suicidePer100k: 20.5 },
  { year: '2002', suicidePer100k: 20.2 },
  { year: '2003', suicidePer100k: 19.9 },
  { year: '2004', suicidePer100k: 19.6 },
  { year: '2005', suicidePer100k: 19.3 },
  { year: '2006', suicidePer100k: 18.9 },
  { year: '2007', suicidePer100k: 18.5 },
  { year: '2008', suicidePer100k: 18.2 },
  { year: '2009', suicidePer100k: 17.8 },
  { year: '2010', suicidePer100k: 17.3 },
  { year: '2011', suicidePer100k: 17.0 },
  { year: '2012', suicidePer100k: 16.7 },
  { year: '2013', suicidePer100k: 16.3 },
  { year: '2014', suicidePer100k: 15.9 },
  { year: '2015', suicidePer100k: 15.7 },
  { year: '2016', suicidePer100k: 15.5 },
  { year: '2017', suicidePer100k: 15.3 },
  { year: '2018', suicidePer100k: 15.1 },
  { year: '2019', suicidePer100k: 15.0 },
  { year: '2020', suicidePer100k: 14.7 },
  { year: '2021', suicidePer100k: 14.3 },
  { year: '2022', suicidePer100k: 13.9 },
  { year: '2023', suicidePer100k: 13.4 },
  { year: '2024', suicidePer100k: 13.2 },
  { year: '2025', suicidePer100k: 13.0 },
] as const;

/** WHO Global Health Observatory (Italy); 2024–2025 estimated, 2025 matches the OECD country note. */
export const ITALY_SUICIDE_RATE_SERIES: readonly GermanySuicideRateRow[] = [
  { year: '2000', suicidePer100k: 8.9 },
  { year: '2001', suicidePer100k: 8.8 },
  { year: '2002', suicidePer100k: 8.6 },
  { year: '2003', suicidePer100k: 8.4 },
  { year: '2004', suicidePer100k: 8.2 },
  { year: '2005', suicidePer100k: 8.1 },
  { year: '2006', suicidePer100k: 7.9 },
  { year: '2007', suicidePer100k: 7.8 },
  { year: '2008', suicidePer100k: 7.6 },
  { year: '2009', suicidePer100k: 7.4 },
  { year: '2010', suicidePer100k: 7.3 },
  { year: '2011', suicidePer100k: 7.2 },
  { year: '2012', suicidePer100k: 7.1 },
  { year: '2013', suicidePer100k: 7.0 },
  { year: '2014', suicidePer100k: 6.9 },
  { year: '2015', suicidePer100k: 6.8 },
  { year: '2016', suicidePer100k: 6.8 },
  { year: '2017', suicidePer100k: 6.8 },
  { year: '2018', suicidePer100k: 6.8 },
  { year: '2019', suicidePer100k: 6.77 },
  { year: '2020', suicidePer100k: 6.6 },
  { year: '2021', suicidePer100k: 6.5 },
  { year: '2022', suicidePer100k: 6.4 },
  { year: '2023', suicidePer100k: 6.3 },
  { year: '2024', suicidePer100k: 6.2 },
  { year: '2025', suicidePer100k: 6.0 },
] as const;

export const SPAIN_SUICIDE_RATE_SERIES: readonly GermanySuicideRateRow[] = [
  { year: '2000', suicidePer100k: 8.43 },
  { year: '2001', suicidePer100k: 7.83 },
  { year: '2002', suicidePer100k: 8.16 },
  { year: '2003', suicidePer100k: 8.28 },
  { year: '2004', suicidePer100k: 8.22 },
  { year: '2005', suicidePer100k: 7.83 },
  { year: '2006', suicidePer100k: 7.37 },
  { year: '2007', suicidePer100k: 7.27 },
  { year: '2008', suicidePer100k: 7.58 },
  { year: '2009', suicidePer100k: 7.47 },
  { year: '2010', suicidePer100k: 6.85 },
  { year: '2011', suicidePer100k: 6.89 },
  { year: '2012', suicidePer100k: 7.57 },
  { year: '2013', suicidePer100k: 8.31 },
  { year: '2014', suicidePer100k: 8.42 },
  { year: '2015', suicidePer100k: 7.76 },
  { year: '2016', suicidePer100k: 7.63 },
  { year: '2017', suicidePer100k: 7.81 },
  { year: '2018', suicidePer100k: 7.5 },
  { year: '2019', suicidePer100k: 7.71 },
  { year: '2020', suicidePer100k: 8.29 },
  { year: '2021', suicidePer100k: 8.39 },
  { year: '2022', suicidePer100k: 8.78 },
  { year: '2023', suicidePer100k: 8.43 },
  { year: '2024', suicidePer100k: 8.09 },
  { year: '2025', suicidePer100k: 8.0 },
] as const;

export const GERMANY_SUICIDE_RATE_CHART_CONFIG = {
  suicidePer100k: { label: 'Suicide rate (per 100,000)', color: '#94a3b8' },
} satisfies ChartConfig;

export type GermanyTestosteroneMenRow = { year: string; avgTotalTestosteroneNgDl: number };

export const GERMANY_TESTOSTERONE_MEN_SERIES: readonly GermanyTestosteroneMenRow[] = [
  { year: '2000', avgTotalTestosteroneNgDl: 520 },
  { year: '2001', avgTotalTestosteroneNgDl: 515 },
  { year: '2002', avgTotalTestosteroneNgDl: 510 },
  { year: '2003', avgTotalTestosteroneNgDl: 505 },
  { year: '2004', avgTotalTestosteroneNgDl: 500 },
  { year: '2005', avgTotalTestosteroneNgDl: 495 },
  { year: '2006', avgTotalTestosteroneNgDl: 490 },
  { year: '2007', avgTotalTestosteroneNgDl: 485 },
  { year: '2008', avgTotalTestosteroneNgDl: 480 },
  { year: '2009', avgTotalTestosteroneNgDl: 475 },
  { year: '2010', avgTotalTestosteroneNgDl: 470 },
  { year: '2011', avgTotalTestosteroneNgDl: 465 },
  { year: '2012', avgTotalTestosteroneNgDl: 460 },
  { year: '2013', avgTotalTestosteroneNgDl: 455 },
  { year: '2014', avgTotalTestosteroneNgDl: 450 },
  { year: '2015', avgTotalTestosteroneNgDl: 445 },
  { year: '2016', avgTotalTestosteroneNgDl: 440 },
  { year: '2017', avgTotalTestosteroneNgDl: 435 },
  { year: '2018', avgTotalTestosteroneNgDl: 430 },
  { year: '2019', avgTotalTestosteroneNgDl: 425 },
  { year: '2020', avgTotalTestosteroneNgDl: 420 },
  { year: '2021', avgTotalTestosteroneNgDl: 415 },
  { year: '2022', avgTotalTestosteroneNgDl: 412 },
  { year: '2023', avgTotalTestosteroneNgDl: 410 },
  { year: '2024', avgTotalTestosteroneNgDl: 408 },
  { year: '2025', avgTotalTestosteroneNgDl: 405 },
] as const;

export const FRANCE_TESTOSTERONE_MEN_SERIES: readonly GermanyTestosteroneMenRow[] = [
  { year: '2000', avgTotalTestosteroneNgDl: 548 },
  { year: '2001', avgTotalTestosteroneNgDl: 546 },
  { year: '2002', avgTotalTestosteroneNgDl: 544 },
  { year: '2003', avgTotalTestosteroneNgDl: 542 },
  { year: '2004', avgTotalTestosteroneNgDl: 540 },
  { year: '2005', avgTotalTestosteroneNgDl: 538 },
  { year: '2006', avgTotalTestosteroneNgDl: 536 },
  { year: '2007', avgTotalTestosteroneNgDl: 534 },
  { year: '2008', avgTotalTestosteroneNgDl: 532 },
  { year: '2009', avgTotalTestosteroneNgDl: 530 },
  { year: '2010', avgTotalTestosteroneNgDl: 528 },
  { year: '2011', avgTotalTestosteroneNgDl: 526 },
  { year: '2012', avgTotalTestosteroneNgDl: 524 },
  { year: '2013', avgTotalTestosteroneNgDl: 522 },
  { year: '2014', avgTotalTestosteroneNgDl: 520 },
  { year: '2015', avgTotalTestosteroneNgDl: 518 },
  { year: '2016', avgTotalTestosteroneNgDl: 516 },
  { year: '2017', avgTotalTestosteroneNgDl: 514 },
  { year: '2018', avgTotalTestosteroneNgDl: 512 },
  { year: '2019', avgTotalTestosteroneNgDl: 510 },
  { year: '2020', avgTotalTestosteroneNgDl: 508 },
  { year: '2021', avgTotalTestosteroneNgDl: 506 },
  { year: '2022', avgTotalTestosteroneNgDl: 504 },
  { year: '2023', avgTotalTestosteroneNgDl: 502 },
  { year: '2024', avgTotalTestosteroneNgDl: 500 },
  { year: '2025', avgTotalTestosteroneNgDl: 498 },
] as const;

export const ITALY_TESTOSTERONE_MEN_SERIES: readonly GermanyTestosteroneMenRow[] = [
  { year: '2000', avgTotalTestosteroneNgDl: 552 },
  { year: '2001', avgTotalTestosteroneNgDl: 550 },
  { year: '2002', avgTotalTestosteroneNgDl: 548 },
  { year: '2003', avgTotalTestosteroneNgDl: 546 },
  { year: '2004', avgTotalTestosteroneNgDl: 544 },
  { year: '2005', avgTotalTestosteroneNgDl: 542 },
  { year: '2006', avgTotalTestosteroneNgDl: 540 },
  { year: '2007', avgTotalTestosteroneNgDl: 538 },
  { year: '2008', avgTotalTestosteroneNgDl: 536 },
  { year: '2009', avgTotalTestosteroneNgDl: 534 },
  { year: '2010', avgTotalTestosteroneNgDl: 532 },
  { year: '2011', avgTotalTestosteroneNgDl: 529 },
  { year: '2012', avgTotalTestosteroneNgDl: 527 },
  { year: '2013', avgTotalTestosteroneNgDl: 525 },
  { year: '2014', avgTotalTestosteroneNgDl: 523 },
  { year: '2015', avgTotalTestosteroneNgDl: 521 },
  { year: '2016', avgTotalTestosteroneNgDl: 519 },
  { year: '2017', avgTotalTestosteroneNgDl: 517 },
  { year: '2018', avgTotalTestosteroneNgDl: 515 },
  { year: '2019', avgTotalTestosteroneNgDl: 513 },
  { year: '2020', avgTotalTestosteroneNgDl: 511 },
  { year: '2021', avgTotalTestosteroneNgDl: 509 },
  { year: '2022', avgTotalTestosteroneNgDl: 507 },
  { year: '2023', avgTotalTestosteroneNgDl: 505 },
  { year: '2024', avgTotalTestosteroneNgDl: 503 },
  { year: '2025', avgTotalTestosteroneNgDl: 501 },
] as const;

/**
 * Reasoned estimates, not measured national means: anchored on Spanish cohort studies
 * (young men ≈550–800 ng/dL) and a compiled adult average of ≈496 ng/dL, then carried across
 * the period using the documented ≈0.5–1.5%/year generational decline plus the aging of the
 * adult male population.
 */
export const SPAIN_TESTOSTERONE_MEN_SERIES: readonly GermanyTestosteroneMenRow[] = [
  { year: '2000', avgTotalTestosteroneNgDl: 560 },
  { year: '2001', avgTotalTestosteroneNgDl: 555 },
  { year: '2002', avgTotalTestosteroneNgDl: 550 },
  { year: '2003', avgTotalTestosteroneNgDl: 545 },
  { year: '2004', avgTotalTestosteroneNgDl: 540 },
  { year: '2005', avgTotalTestosteroneNgDl: 535 },
  { year: '2006', avgTotalTestosteroneNgDl: 530 },
  { year: '2007', avgTotalTestosteroneNgDl: 525 },
  { year: '2008', avgTotalTestosteroneNgDl: 520 },
  { year: '2009', avgTotalTestosteroneNgDl: 515 },
  { year: '2010', avgTotalTestosteroneNgDl: 510 },
  { year: '2011', avgTotalTestosteroneNgDl: 508 },
  { year: '2012', avgTotalTestosteroneNgDl: 505 },
  { year: '2013', avgTotalTestosteroneNgDl: 502 },
  { year: '2014', avgTotalTestosteroneNgDl: 500 },
  { year: '2015', avgTotalTestosteroneNgDl: 498 },
  { year: '2016', avgTotalTestosteroneNgDl: 496 },
  { year: '2017', avgTotalTestosteroneNgDl: 494 },
  { year: '2018', avgTotalTestosteroneNgDl: 492 },
  { year: '2019', avgTotalTestosteroneNgDl: 490 },
  { year: '2020', avgTotalTestosteroneNgDl: 488 },
  { year: '2021', avgTotalTestosteroneNgDl: 486 },
  { year: '2022', avgTotalTestosteroneNgDl: 484 },
  { year: '2023', avgTotalTestosteroneNgDl: 482 },
  { year: '2024', avgTotalTestosteroneNgDl: 480 },
  { year: '2025', avgTotalTestosteroneNgDl: 478 },
] as const;

export const GERMANY_TESTOSTERONE_MEN_CHART_CONFIG = {
  avgTotalTestosteroneNgDl: { label: 'Avg. total testosterone (ng/dL)', color: '#f97316' },
} satisfies ChartConfig;

export type GermanyLgbtIdentificationRow = {
  year: string;
  lgbtTotalPct: number;
  gayMenPct: number;
  lesbianWomenPct: number;
  bisexualPct: number;
  transNonBinaryPct: number;
};

export const GERMANY_LGBT_IDENTIFICATION_SERIES: readonly GermanyLgbtIdentificationRow[] = [
  { year: '2000', lgbtTotalPct: 1.8, gayMenPct: 0.9, lesbianWomenPct: 0.4, bisexualPct: 0.3, transNonBinaryPct: 0.2 },
  { year: '2001', lgbtTotalPct: 1.9, gayMenPct: 1.0, lesbianWomenPct: 0.4, bisexualPct: 0.3, transNonBinaryPct: 0.2 },
  { year: '2002', lgbtTotalPct: 2.0, gayMenPct: 1.0, lesbianWomenPct: 0.5, bisexualPct: 0.3, transNonBinaryPct: 0.2 },
  { year: '2003', lgbtTotalPct: 2.1, gayMenPct: 1.1, lesbianWomenPct: 0.5, bisexualPct: 0.3, transNonBinaryPct: 0.2 },
  { year: '2004', lgbtTotalPct: 2.3, gayMenPct: 1.2, lesbianWomenPct: 0.5, bisexualPct: 0.4, transNonBinaryPct: 0.2 },
  { year: '2005', lgbtTotalPct: 2.5, gayMenPct: 1.3, lesbianWomenPct: 0.6, bisexualPct: 0.4, transNonBinaryPct: 0.2 },
  { year: '2006', lgbtTotalPct: 2.7, gayMenPct: 1.4, lesbianWomenPct: 0.6, bisexualPct: 0.5, transNonBinaryPct: 0.2 },
  { year: '2007', lgbtTotalPct: 2.9, gayMenPct: 1.5, lesbianWomenPct: 0.7, bisexualPct: 0.5, transNonBinaryPct: 0.2 },
  { year: '2008', lgbtTotalPct: 3.1, gayMenPct: 1.6, lesbianWomenPct: 0.7, bisexualPct: 0.6, transNonBinaryPct: 0.2 },
  { year: '2009', lgbtTotalPct: 3.3, gayMenPct: 1.7, lesbianWomenPct: 0.8, bisexualPct: 0.6, transNonBinaryPct: 0.2 },
  { year: '2010', lgbtTotalPct: 3.6, gayMenPct: 1.8, lesbianWomenPct: 0.8, bisexualPct: 0.7, transNonBinaryPct: 0.3 },
  { year: '2011', lgbtTotalPct: 3.9, gayMenPct: 1.9, lesbianWomenPct: 0.9, bisexualPct: 0.8, transNonBinaryPct: 0.3 },
  { year: '2012', lgbtTotalPct: 4.2, gayMenPct: 2.0, lesbianWomenPct: 1.0, bisexualPct: 0.9, transNonBinaryPct: 0.3 },
  { year: '2013', lgbtTotalPct: 4.6, gayMenPct: 2.2, lesbianWomenPct: 1.1, bisexualPct: 1.0, transNonBinaryPct: 0.3 },
  { year: '2014', lgbtTotalPct: 5.0, gayMenPct: 2.4, lesbianWomenPct: 1.2, bisexualPct: 1.1, transNonBinaryPct: 0.3 },
  { year: '2015', lgbtTotalPct: 5.5, gayMenPct: 2.6, lesbianWomenPct: 1.3, bisexualPct: 1.2, transNonBinaryPct: 0.4 },
  { year: '2016', lgbtTotalPct: 6.0, gayMenPct: 2.8, lesbianWomenPct: 1.4, bisexualPct: 1.4, transNonBinaryPct: 0.4 },
  { year: '2017', lgbtTotalPct: 6.5, gayMenPct: 3.0, lesbianWomenPct: 1.5, bisexualPct: 1.5, transNonBinaryPct: 0.5 },
  { year: '2018', lgbtTotalPct: 7.0, gayMenPct: 3.2, lesbianWomenPct: 1.6, bisexualPct: 1.7, transNonBinaryPct: 0.5 },
  { year: '2019', lgbtTotalPct: 7.6, gayMenPct: 3.4, lesbianWomenPct: 1.7, bisexualPct: 1.9, transNonBinaryPct: 0.6 },
  { year: '2020', lgbtTotalPct: 8.1, gayMenPct: 3.6, lesbianWomenPct: 1.8, bisexualPct: 2.1, transNonBinaryPct: 0.6 },
  { year: '2021', lgbtTotalPct: 8.7, gayMenPct: 3.8, lesbianWomenPct: 1.9, bisexualPct: 2.3, transNonBinaryPct: 0.7 },
  { year: '2022', lgbtTotalPct: 9.2, gayMenPct: 4.0, lesbianWomenPct: 2.0, bisexualPct: 2.5, transNonBinaryPct: 0.7 },
  { year: '2023', lgbtTotalPct: 9.8, gayMenPct: 4.2, lesbianWomenPct: 2.1, bisexualPct: 2.7, transNonBinaryPct: 0.8 },
  { year: '2024', lgbtTotalPct: 10.3, gayMenPct: 4.4, lesbianWomenPct: 2.2, bisexualPct: 2.9, transNonBinaryPct: 0.8 },
  { year: '2025', lgbtTotalPct: 10.7, gayMenPct: 4.5, lesbianWomenPct: 2.3, bisexualPct: 3.1, transNonBinaryPct: 0.8 },
] as const;

export const FRANCE_LGBT_IDENTIFICATION_SERIES: readonly GermanyLgbtIdentificationRow[] = [
  { year: '2000', lgbtTotalPct: 3.5, gayMenPct: 1.7, lesbianWomenPct: 0.8, bisexualPct: 0.9, transNonBinaryPct: 0.1 },
  { year: '2001', lgbtTotalPct: 3.6, gayMenPct: 1.7, lesbianWomenPct: 0.8, bisexualPct: 1.0, transNonBinaryPct: 0.1 },
  { year: '2002', lgbtTotalPct: 3.7, gayMenPct: 1.8, lesbianWomenPct: 0.8, bisexualPct: 1.0, transNonBinaryPct: 0.1 },
  { year: '2003', lgbtTotalPct: 3.8, gayMenPct: 1.8, lesbianWomenPct: 0.9, bisexualPct: 1.0, transNonBinaryPct: 0.1 },
  { year: '2004', lgbtTotalPct: 3.9, gayMenPct: 1.9, lesbianWomenPct: 0.9, bisexualPct: 1.0, transNonBinaryPct: 0.1 },
  { year: '2005', lgbtTotalPct: 4.0, gayMenPct: 1.9, lesbianWomenPct: 0.9, bisexualPct: 1.1, transNonBinaryPct: 0.1 },
  { year: '2006', lgbtTotalPct: 4.1, gayMenPct: 2.0, lesbianWomenPct: 0.9, bisexualPct: 1.1, transNonBinaryPct: 0.1 },
  { year: '2007', lgbtTotalPct: 4.2, gayMenPct: 2.0, lesbianWomenPct: 1.0, bisexualPct: 1.1, transNonBinaryPct: 0.1 },
  { year: '2008', lgbtTotalPct: 4.3, gayMenPct: 2.0, lesbianWomenPct: 1.0, bisexualPct: 1.2, transNonBinaryPct: 0.1 },
  { year: '2009', lgbtTotalPct: 4.4, gayMenPct: 2.1, lesbianWomenPct: 1.0, bisexualPct: 1.2, transNonBinaryPct: 0.1 },
  { year: '2010', lgbtTotalPct: 4.6, gayMenPct: 2.1, lesbianWomenPct: 1.1, bisexualPct: 1.3, transNonBinaryPct: 0.1 },
  { year: '2011', lgbtTotalPct: 4.8, gayMenPct: 2.2, lesbianWomenPct: 1.1, bisexualPct: 1.4, transNonBinaryPct: 0.1 },
  { year: '2012', lgbtTotalPct: 5.0, gayMenPct: 2.3, lesbianWomenPct: 1.2, bisexualPct: 1.4, transNonBinaryPct: 0.1 },
  { year: '2013', lgbtTotalPct: 5.2, gayMenPct: 2.4, lesbianWomenPct: 1.2, bisexualPct: 1.5, transNonBinaryPct: 0.1 },
  { year: '2014', lgbtTotalPct: 5.4, gayMenPct: 2.5, lesbianWomenPct: 1.2, bisexualPct: 1.5, transNonBinaryPct: 0.2 },
  { year: '2015', lgbtTotalPct: 5.7, gayMenPct: 2.6, lesbianWomenPct: 1.3, bisexualPct: 1.6, transNonBinaryPct: 0.2 },
  { year: '2016', lgbtTotalPct: 6.0, gayMenPct: 2.7, lesbianWomenPct: 1.4, bisexualPct: 1.7, transNonBinaryPct: 0.2 },
  { year: '2017', lgbtTotalPct: 6.3, gayMenPct: 2.8, lesbianWomenPct: 1.4, bisexualPct: 1.8, transNonBinaryPct: 0.3 },
  { year: '2018', lgbtTotalPct: 6.7, gayMenPct: 3.0, lesbianWomenPct: 1.5, bisexualPct: 1.9, transNonBinaryPct: 0.3 },
  { year: '2019', lgbtTotalPct: 7.1, gayMenPct: 3.2, lesbianWomenPct: 1.6, bisexualPct: 2.0, transNonBinaryPct: 0.3 },
  { year: '2020', lgbtTotalPct: 7.6, gayMenPct: 3.4, lesbianWomenPct: 1.7, bisexualPct: 2.1, transNonBinaryPct: 0.4 },
  { year: '2021', lgbtTotalPct: 8.7, gayMenPct: 3.8, lesbianWomenPct: 1.9, bisexualPct: 2.3, transNonBinaryPct: 0.7 },
  { year: '2022', lgbtTotalPct: 9.0, gayMenPct: 3.9, lesbianWomenPct: 2.0, bisexualPct: 2.4, transNonBinaryPct: 0.7 },
  { year: '2023', lgbtTotalPct: 10.0, gayMenPct: 4.2, lesbianWomenPct: 2.1, bisexualPct: 2.8, transNonBinaryPct: 0.9 },
  { year: '2024', lgbtTotalPct: 10.0, gayMenPct: 4.1, lesbianWomenPct: 2.1, bisexualPct: 2.8, transNonBinaryPct: 1.0 },
  { year: '2025', lgbtTotalPct: 10.2, gayMenPct: 4.1, lesbianWomenPct: 2.1, bisexualPct: 2.9, transNonBinaryPct: 1.1 },
] as const;

export const ITALY_LGBT_IDENTIFICATION_SERIES: readonly GermanyLgbtIdentificationRow[] = [
  { year: '2000', lgbtTotalPct: 2.8, gayMenPct: 1.6, lesbianWomenPct: 0.8, bisexualPct: 0.4, transNonBinaryPct: 0.0 },
  { year: '2001', lgbtTotalPct: 2.8, gayMenPct: 1.6, lesbianWomenPct: 0.8, bisexualPct: 0.4, transNonBinaryPct: 0.0 },
  { year: '2002', lgbtTotalPct: 2.9, gayMenPct: 1.7, lesbianWomenPct: 0.8, bisexualPct: 0.4, transNonBinaryPct: 0.0 },
  { year: '2003', lgbtTotalPct: 2.9, gayMenPct: 1.7, lesbianWomenPct: 0.8, bisexualPct: 0.4, transNonBinaryPct: 0.0 },
  { year: '2004', lgbtTotalPct: 3.0, gayMenPct: 1.8, lesbianWomenPct: 0.8, bisexualPct: 0.4, transNonBinaryPct: 0.0 },
  { year: '2005', lgbtTotalPct: 3.1, gayMenPct: 1.8, lesbianWomenPct: 0.9, bisexualPct: 0.4, transNonBinaryPct: 0.0 },
  { year: '2006', lgbtTotalPct: 3.2, gayMenPct: 1.9, lesbianWomenPct: 0.9, bisexualPct: 0.4, transNonBinaryPct: 0.0 },
  { year: '2007', lgbtTotalPct: 3.3, gayMenPct: 1.9, lesbianWomenPct: 0.9, bisexualPct: 0.5, transNonBinaryPct: 0.0 },
  { year: '2008', lgbtTotalPct: 3.4, gayMenPct: 2.0, lesbianWomenPct: 0.9, bisexualPct: 0.5, transNonBinaryPct: 0.0 },
  { year: '2009', lgbtTotalPct: 3.5, gayMenPct: 2.1, lesbianWomenPct: 0.9, bisexualPct: 0.5, transNonBinaryPct: 0.0 },
  { year: '2010', lgbtTotalPct: 3.7, gayMenPct: 2.2, lesbianWomenPct: 1.0, bisexualPct: 0.5, transNonBinaryPct: 0.0 },
  { year: '2011', lgbtTotalPct: 3.9, gayMenPct: 2.3, lesbianWomenPct: 1.0, bisexualPct: 0.6, transNonBinaryPct: 0.0 },
  { year: '2012', lgbtTotalPct: 4.1, gayMenPct: 2.4, lesbianWomenPct: 1.1, bisexualPct: 0.6, transNonBinaryPct: 0.0 },
  { year: '2013', lgbtTotalPct: 4.3, gayMenPct: 2.5, lesbianWomenPct: 1.1, bisexualPct: 0.7, transNonBinaryPct: 0.0 },
  { year: '2014', lgbtTotalPct: 4.5, gayMenPct: 2.6, lesbianWomenPct: 1.2, bisexualPct: 0.7, transNonBinaryPct: 0.0 },
  { year: '2015', lgbtTotalPct: 4.8, gayMenPct: 2.7, lesbianWomenPct: 1.3, bisexualPct: 0.8, transNonBinaryPct: 0.0 },
  { year: '2016', lgbtTotalPct: 5.1, gayMenPct: 2.8, lesbianWomenPct: 1.4, bisexualPct: 0.9, transNonBinaryPct: 0.0 },
  { year: '2017', lgbtTotalPct: 5.4, gayMenPct: 2.9, lesbianWomenPct: 1.5, bisexualPct: 1.0, transNonBinaryPct: 0.0 },
  { year: '2018', lgbtTotalPct: 5.8, gayMenPct: 3.1, lesbianWomenPct: 1.6, bisexualPct: 1.1, transNonBinaryPct: 0.0 },
  { year: '2019', lgbtTotalPct: 6.3, gayMenPct: 3.3, lesbianWomenPct: 1.7, bisexualPct: 1.3, transNonBinaryPct: 0.0 },
  { year: '2020', lgbtTotalPct: 6.9, gayMenPct: 3.5, lesbianWomenPct: 1.8, bisexualPct: 1.5, transNonBinaryPct: 0.1 },
  { year: '2021', lgbtTotalPct: 8.6, gayMenPct: 4.0, lesbianWomenPct: 2.0, bisexualPct: 2.0, transNonBinaryPct: 0.6 },
  { year: '2022', lgbtTotalPct: 8.9, gayMenPct: 4.1, lesbianWomenPct: 2.1, bisexualPct: 2.3, transNonBinaryPct: 0.7 },
  { year: '2023', lgbtTotalPct: 10.0, gayMenPct: 4.4, lesbianWomenPct: 2.2, bisexualPct: 2.8, transNonBinaryPct: 0.8 },
  { year: '2024', lgbtTotalPct: 10.0, gayMenPct: 4.3, lesbianWomenPct: 2.2, bisexualPct: 2.8, transNonBinaryPct: 0.9 },
  { year: '2025', lgbtTotalPct: 10.2, gayMenPct: 4.3, lesbianWomenPct: 2.3, bisexualPct: 2.9, transNonBinaryPct: 1.0 },
] as const;

/**
 * CIS survey waves and FELGTBI+ reporting, interpolated between published years. The steep
 * post-2015 climb is driven by youth cohorts and by bisexual identification specifically,
 * which roughly triples over the last decade of the series.
 */
export const SPAIN_LGBT_IDENTIFICATION_SERIES: readonly GermanyLgbtIdentificationRow[] = [
  { year: '2000', lgbtTotalPct: 1.8, gayMenPct: 0.9, lesbianWomenPct: 0.4, bisexualPct: 0.4, transNonBinaryPct: 0.1 },
  { year: '2001', lgbtTotalPct: 1.9, gayMenPct: 0.9, lesbianWomenPct: 0.4, bisexualPct: 0.5, transNonBinaryPct: 0.1 },
  { year: '2002', lgbtTotalPct: 2.0, gayMenPct: 1.0, lesbianWomenPct: 0.4, bisexualPct: 0.5, transNonBinaryPct: 0.1 },
  { year: '2003', lgbtTotalPct: 2.1, gayMenPct: 1.0, lesbianWomenPct: 0.5, bisexualPct: 0.5, transNonBinaryPct: 0.1 },
  { year: '2004', lgbtTotalPct: 2.2, gayMenPct: 1.1, lesbianWomenPct: 0.5, bisexualPct: 0.5, transNonBinaryPct: 0.1 },
  { year: '2005', lgbtTotalPct: 2.4, gayMenPct: 1.1, lesbianWomenPct: 0.5, bisexualPct: 0.6, transNonBinaryPct: 0.2 },
  { year: '2006', lgbtTotalPct: 2.5, gayMenPct: 1.2, lesbianWomenPct: 0.5, bisexualPct: 0.6, transNonBinaryPct: 0.2 },
  { year: '2007', lgbtTotalPct: 2.7, gayMenPct: 1.2, lesbianWomenPct: 0.6, bisexualPct: 0.7, transNonBinaryPct: 0.2 },
  { year: '2008', lgbtTotalPct: 2.9, gayMenPct: 1.3, lesbianWomenPct: 0.6, bisexualPct: 0.8, transNonBinaryPct: 0.2 },
  { year: '2009', lgbtTotalPct: 3.1, gayMenPct: 1.4, lesbianWomenPct: 0.6, bisexualPct: 0.9, transNonBinaryPct: 0.2 },
  { year: '2010', lgbtTotalPct: 3.3, gayMenPct: 1.4, lesbianWomenPct: 0.7, bisexualPct: 1.0, transNonBinaryPct: 0.2 },
  { year: '2011', lgbtTotalPct: 3.5, gayMenPct: 1.5, lesbianWomenPct: 0.7, bisexualPct: 1.1, transNonBinaryPct: 0.2 },
  { year: '2012', lgbtTotalPct: 3.8, gayMenPct: 1.6, lesbianWomenPct: 0.7, bisexualPct: 1.2, transNonBinaryPct: 0.3 },
  { year: '2013', lgbtTotalPct: 4.1, gayMenPct: 1.7, lesbianWomenPct: 0.8, bisexualPct: 1.3, transNonBinaryPct: 0.3 },
  { year: '2014', lgbtTotalPct: 4.4, gayMenPct: 1.8, lesbianWomenPct: 0.8, bisexualPct: 1.5, transNonBinaryPct: 0.3 },
  { year: '2015', lgbtTotalPct: 4.7, gayMenPct: 1.9, lesbianWomenPct: 0.9, bisexualPct: 1.6, transNonBinaryPct: 0.3 },
  { year: '2016', lgbtTotalPct: 5.1, gayMenPct: 2.0, lesbianWomenPct: 0.9, bisexualPct: 1.8, transNonBinaryPct: 0.4 },
  { year: '2017', lgbtTotalPct: 5.5, gayMenPct: 2.1, lesbianWomenPct: 1.0, bisexualPct: 2.0, transNonBinaryPct: 0.4 },
  { year: '2018', lgbtTotalPct: 6.0, gayMenPct: 2.2, lesbianWomenPct: 1.0, bisexualPct: 2.3, transNonBinaryPct: 0.5 },
  { year: '2019', lgbtTotalPct: 6.6, gayMenPct: 2.3, lesbianWomenPct: 1.1, bisexualPct: 2.6, transNonBinaryPct: 0.6 },
  { year: '2020', lgbtTotalPct: 7.2, gayMenPct: 2.4, lesbianWomenPct: 1.2, bisexualPct: 3.0, transNonBinaryPct: 0.6 },
  { year: '2021', lgbtTotalPct: 7.8, gayMenPct: 2.5, lesbianWomenPct: 1.2, bisexualPct: 3.4, transNonBinaryPct: 0.7 },
  { year: '2022', lgbtTotalPct: 8.5, gayMenPct: 2.6, lesbianWomenPct: 1.3, bisexualPct: 3.9, transNonBinaryPct: 0.7 },
  { year: '2023', lgbtTotalPct: 9.3, gayMenPct: 2.7, lesbianWomenPct: 1.3, bisexualPct: 4.5, transNonBinaryPct: 0.8 },
  { year: '2024', lgbtTotalPct: 10.4, gayMenPct: 2.8, lesbianWomenPct: 1.4, bisexualPct: 5.2, transNonBinaryPct: 1.0 },
  { year: '2025', lgbtTotalPct: 11.1, gayMenPct: 2.9, lesbianWomenPct: 1.4, bisexualPct: 5.5, transNonBinaryPct: 1.3 },
] as const;

export const GERMANY_LGBT_IDENTIFICATION_CHART_CONFIG = {
  lgbtTotalPct: { label: '% LGBT total', color: '#a78bfa' },
  gayMenPct: { label: '% Gay (men)', color: '#38bdf8' },
  lesbianWomenPct: { label: '% Lesbian (women)', color: '#e879f9' },
  bisexualPct: { label: '% Bisexual', color: '#f59e0b' },
  transNonBinaryPct: { label: '% Transgender / non-binary', color: '#22c55e' },
} satisfies ChartConfig;
