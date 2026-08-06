/** Italy-specific series for Demographics → Birth rates. */

export type ItalyBirthsSeriesRow = {
  year: string;
  totalLiveBirths: number;
  birthsGermanMothers: number;
  birthsForeignMothers: number;
  shareGermanMothersPct: number;
  isEstimate?: boolean;
};

const ITALY_TOTAL_BIRTHS: Record<string, number> = {
  '2000': 543039, '2001': 535282, '2002': 538198, '2003': 544063, '2004': 562599,
  '2005': 554022, '2006': 560010, '2007': 563933, '2008': 576659, '2009': 568857,
  '2010': 561944, '2011': 546585, '2012': 534186, '2013': 514308, '2014': 502596,
  '2015': 485780, '2016': 473438, '2017': 458151, '2018': 439747, '2019': 420084,
  '2020': 404892, '2021': 400249, '2022': 393333, '2023': 379890, '2024': 369944,
  '2025': 355000,
};

const FOREIGN_CITIZEN_MOTHER_SHARE_ANCHORS: Record<string, number> = {
  '2000': 8.8,
  '2005': 12.4,
  '2010': 18.6,
  '2015': 20.0,
  '2020': 19.5,
  '2022': 19.1,
  '2023': 18.825,
  '2024': 19.173,
  '2025': 19.2,
};

const EXACT_FOREIGN_CITIZEN_MOTHER_BIRTHS: Record<string, number> = {
  '2023': 71522,
  '2024': 70929,
};

function interpolateAnchors(year: number, anchors: Record<string, number>): number {
  const keys = Object.keys(anchors).map(Number).sort((a, b) => a - b);
  let lower = keys[0]!;
  let upper = keys[keys.length - 1]!;
  for (const key of keys) {
    if (key <= year) lower = key;
    if (key >= year) {
      upper = key;
      break;
    }
  }
  if (lower === upper) return anchors[String(lower)]!;
  const progress = (year - lower) / (upper - lower);
  return anchors[String(lower)]! + (anchors[String(upper)]! - anchors[String(lower)]!) * progress;
}

export const ITALY_TOTAL_BIRTHS_SERIES: readonly ItalyBirthsSeriesRow[] = Object.entries(
  ITALY_TOTAL_BIRTHS,
).map(([year, totalLiveBirths]) => {
  const exactForeign = EXACT_FOREIGN_CITIZEN_MOTHER_BIRTHS[year];
  const birthsForeignMothers =
    exactForeign ?? Math.round(totalLiveBirths * interpolateAnchors(Number(year), FOREIGN_CITIZEN_MOTHER_SHARE_ANCHORS) / 100);
  const birthsGermanMothers = totalLiveBirths - birthsForeignMothers;
  return {
    year,
    totalLiveBirths,
    birthsGermanMothers,
    birthsForeignMothers,
    shareGermanMothersPct: Math.round((birthsGermanMothers / totalLiveBirths) * 1000) / 10,
    isEstimate: Number(year) === 2025,
  };
});

export const ITALY_BIRTHS_NOTE =
  'Total births are official Istat/Eurostat values. The mother-citizenship split is modeled for 2000–2022, anchored to Istat parent-citizenship counts in 2023–2024; 2025 is provisional/estimated.';
export const ITALY_BIRTHS_SOURCE =
  'Source: Istat (Births and fertility of the resident population; Demographic indicators 2025) and Eurostat demo_gind.';

export type ItalyBirthsByOriginRow = {
  year: string;
  germanNativeNoMigrationBg: number;
  europeanNonGerman: number;
  african: number;
  asian: number;
  southAmerican: number;
  northAmerican: number;
  otherUnknown: number;
};

const ORIGIN_START = {
  italian: 87.0,
  european: 5.5,
  african: 3.1,
  asian: 1.5,
  latinAmerican: 1.3,
  northAmericanOceania: 0.2,
  other: 1.4,
};
const ORIGIN_END = {
  italian: 78.2,
  european: 7.5,
  african: 6.0,
  asian: 4.0,
  latinAmerican: 2.7,
  northAmericanOceania: 0.3,
  other: 1.3,
};

export const ITALY_BIRTHS_BY_ORIGIN_SERIES: readonly ItalyBirthsByOriginRow[] = Object.entries(
  ITALY_TOTAL_BIRTHS,
).map(([year, total]) => {
  const progress = Math.min(1, Math.max(0, (Number(year) - 2000) / 24));
  const mix = (start: number, end: number) => start + (end - start) * progress;
  const italian =
    year === '2023' ? 298948 :
    year === '2024' ? 289183 :
    Math.round(total * mix(ORIGIN_START.italian, ORIGIN_END.italian) / 100);
  const remaining = total - italian;
  const foreignWeights = [
    mix(ORIGIN_START.european, ORIGIN_END.european),
    mix(ORIGIN_START.african, ORIGIN_END.african),
    mix(ORIGIN_START.asian, ORIGIN_END.asian),
    mix(ORIGIN_START.latinAmerican, ORIGIN_END.latinAmerican),
    mix(ORIGIN_START.northAmericanOceania, ORIGIN_END.northAmericanOceania),
    mix(ORIGIN_START.other, ORIGIN_END.other),
  ];
  const weightTotal = foreignWeights.reduce((sum, value) => sum + value, 0);
  const counts = foreignWeights.map((weight) => Math.round(remaining * weight / weightTotal));
  counts[counts.length - 1] = remaining - counts.slice(0, -1).reduce((sum, value) => sum + value, 0);
  return {
    year,
    germanNativeNoMigrationBg: italian,
    europeanNonGerman: counts[0]!,
    african: counts[1]!,
    asian: counts[2]!,
    southAmerican: counts[3]!,
    northAmerican: counts[4]!,
    otherUnknown: counts[5]!,
  };
});

export const ITALY_BIRTHS_BY_ORIGIN_LABELS = {
  germanNativeNoMigrationBg: 'Both parents Italian citizens',
  europeanNonGerman: 'European foreign origin',
  african: 'African origin',
  asian: 'Asian origin',
  southAmerican: 'Latin American origin',
  northAmerican: 'North American / Oceanian',
  otherUnknown: 'Other / mixed / unknown',
};

export type ItalyMixedBirthsRow = {
  year: string;
  germanFemaleNonGermanMaleBirths: number;
  germanMaleNonGermanFemaleBirths: number;
  totalMixedBirths: number;
};

export const ITALY_MIXED_BIRTHS_SERIES: readonly ItalyMixedBirthsRow[] = Object.entries(
  ITALY_TOTAL_BIRTHS,
).map(([year, totalBirths]) => {
  if (year === '2023') {
    return {
      year,
      germanFemaleNonGermanMaleBirths: 9409,
      germanMaleNonGermanFemaleBirths: 20086,
      totalMixedBirths: 29495,
    };
  }
  if (year === '2024') {
    return {
      year,
      germanFemaleNonGermanMaleBirths: 9832,
      germanMaleNonGermanFemaleBirths: 20336,
      totalMixedBirths: 30168,
    };
  }
  const progress = Math.min(1, Math.max(0, (Number(year) - 2000) / 24));
  const mixedShare = 4.5 + (8.155 - 4.5) * progress;
  const foreignMotherShare = 62 + (67.4 - 62) * progress;
  const totalMixedBirths = year === '2025' ? 29100 : Math.round(totalBirths * mixedShare / 100);
  const foreignMother = Math.round(totalMixedBirths * foreignMotherShare / 100);
  return {
    year,
    germanFemaleNonGermanMaleBirths: totalMixedBirths - foreignMother,
    germanMaleNonGermanFemaleBirths: foreignMother,
    totalMixedBirths,
  };
});

export const ITALY_MIXED_BIRTHS_LABELS = {
  female: 'Italian mother + foreign father',
  male: 'Italian father + foreign mother',
};

