/** One row of the "total births per year" chart (field names are the chart's dataKeys). */
export type BirthsSeriesRow = {
  year: string;
  totalLiveBirths: number;
  /** Births to native-national (here: French) mothers. */
  birthsGermanMothers: number;
  birthsForeignMothers: number;
  /** Native-mother share (%). */
  shareGermanMothersPct: number;
  isEstimate?: boolean;
};

/**
 * France total live births by mother's nationality (2000–2025).
 *
 * Sourced: total live births (France entière, INSEE Bilan démographique) — 807,405 (2000),
 * 832,799 (2010), 798,948 (2015), 753,383 (2019), 735,196 (2020), 678,000 (2023), ~663,000 (2024).
 * By nationality (INSEE, 2020): ~82.5% of births to a French-national mother, ~17.5% to a foreign
 * mother (of 696,664 métropole births: 523,203 both-French, 100,744 mixed, 72,717 both-foreign).
 *
 * Modeled: the French-mother SHARE trajectory (~88.5% in 2000 → ~80.5% in 2024) is interpolated on
 * that basis, and the per-year French/foreign split is computed from it (INSEE publishes the split
 * only for select years, and the reporting basis changed in 2023).
 */

/** Total live births, France entière (INSEE). */
const FRANCE_TOTAL_BIRTHS: Record<string, number> = {
  '2000': 807405, '2001': 803234, '2002': 792745, '2003': 793044, '2004': 799361,
  '2005': 806822, '2006': 829352, '2007': 818705, '2008': 828404, '2009': 824641,
  '2010': 832799, '2011': 823394, '2012': 821047, '2013': 811510, '2014': 818565,
  '2015': 798948, '2016': 783640, '2017': 769553, '2018': 758590, '2019': 753383,
  '2020': 735196, '2021': 742052, '2022': 726290, '2023': 677803, '2024': 660787, '2025': 643905,
};

/** French-national-mother share (%) anchors; interpolated between. */
const FRENCH_MOTHER_SHARE_ANCHORS: Record<string, number> = {
  '2000': 88.5, '2005': 87.5, '2010': 86.0, '2015': 84.5, '2019': 83.0,
  '2020': 75.8, '2021': 76.6, '2022': 75.7, '2023': 74.4, '2024': 74.0, '2025': 73.6,
};
const FOREIGN_BORN_MOTHER_COUNTS: Record<string, number> = {
  '2020': 177867, '2021': 173885, '2022': 176787,
  '2023': 173215, '2024': 172127, '2025': 169748,
};

function frenchMotherShare(year: number): number {
  if (FRENCH_MOTHER_SHARE_ANCHORS[String(year)] != null) return FRENCH_MOTHER_SHARE_ANCHORS[String(year)]!;
  const keys = Object.keys(FRENCH_MOTHER_SHARE_ANCHORS).map(Number).sort((a, b) => a - b);
  let lo = keys[0]!;
  let hi = keys[keys.length - 1]!;
  for (const k of keys) {
    if (k <= year) lo = k;
    if (k >= year) { hi = k; break; }
  }
  const a = FRENCH_MOTHER_SHARE_ANCHORS[String(lo)]!;
  const b = FRENCH_MOTHER_SHARE_ANCHORS[String(hi)]!;
  if (hi === lo) return a;
  return a + ((b - a) * (year - lo)) / (hi - lo);
}

export const FRANCE_TOTAL_BIRTHS_SERIES: readonly BirthsSeriesRow[] = Object.entries(FRANCE_TOTAL_BIRTHS).map(
  ([yearStr, total]) => {
    const year = Number(yearStr);
    const exactForeignBornCount = FOREIGN_BORN_MOTHER_COUNTS[yearStr];
    const birthsForeignMothers =
      exactForeignBornCount ?? Math.round(total * (1 - frenchMotherShare(year) / 100));
    const birthsGermanMothers = total - birthsForeignMothers;
    const share = Math.round((birthsGermanMothers / total) * 1000) / 10;
    return {
      year: yearStr,
      totalLiveBirths: total,
      birthsGermanMothers,
      birthsForeignMothers,
      shareGermanMothersPct: share,
    };
  },
);

export const FRANCE_BIRTHS_NOTE =
  'Mother birthplace is modeled for 2000–2019 and taken from INSEE civil-registration tables for 2020–2025. In 2025, 169,748 births (26.4%) were to foreign-born mothers.';
export const FRANCE_BIRTHS_SOURCE =
  'Source: INSEE (Bilan démographique; Naissances selon le pays de naissance des parents).';

/* ─── Births by regional origin (modeled) ─── */

export type BirthsByRaceRow = {
  year: string;
  germanNativeNoMigrationBg: number; // French native (no migration background)
  europeanNonGerman: number; // European (non-French)
  african: number; // Sub-Saharan African
  asian: number; // Asian
  southAmerican: number; // repurposed: North African (Maghreb) — France's largest immigrant-origin group
  northAmerican: number; // repurposed: Turkish / Middle East
  otherUnknown: number; // Other / Unknown
};

type OriginShareSet = {
  frenchNative: number;
  european: number;
  maghreb: number;
  subSaharan: number;
  asian: number;
  turkishMena: number;
  other: number;
};
const ORIGIN_START: OriginShareSet = { frenchNative: 78, european: 6.8, maghreb: 5.5, subSaharan: 2.5, asian: 2.2, turkishMena: 1.0, other: 4.0 };
const ORIGIN_END: OriginShareSet = { frenchNative: 66, european: 6.5, maghreb: 8.5, subSaharan: 7.5, asian: 4.2, turkishMena: 1.8, other: 5.5 };

/**
 * France births by regional origin of parents (2000–2025). France legally prohibits ethnic
 * statistics, so this is fully MODELED: the real total-birth series is split by origin shares that
 * reflect France's immigration profile — Maghreb (North African) is the largest immigrant-origin
 * group (~5.9% of newborns had a Maghrebi mother in 2020, INSEE), ahead of Sub-Saharan African.
 */
export const FRANCE_BIRTHS_BY_RACE_SERIES: readonly BirthsByRaceRow[] = Object.entries(FRANCE_TOTAL_BIRTHS).map(
  ([yearStr, total]) => {
    const t = (Number(yearStr) - 2000) / 24;
    const mix = (a: number, b: number) => a + (b - a) * Math.min(1, Math.max(0, t));
    const s = {
      frenchNative: mix(ORIGIN_START.frenchNative, ORIGIN_END.frenchNative),
      european: mix(ORIGIN_START.european, ORIGIN_END.european),
      maghreb: mix(ORIGIN_START.maghreb, ORIGIN_END.maghreb),
      subSaharan: mix(ORIGIN_START.subSaharan, ORIGIN_END.subSaharan),
      asian: mix(ORIGIN_START.asian, ORIGIN_END.asian),
      turkishMena: mix(ORIGIN_START.turkishMena, ORIGIN_END.turkishMena),
      other: mix(ORIGIN_START.other, ORIGIN_END.other),
    };
    const c = (pct: number) => Math.round((pct / 100) * total);
    return {
      year: yearStr,
      germanNativeNoMigrationBg: c(s.frenchNative),
      europeanNonGerman: c(s.european),
      african: c(s.subSaharan),
      asian: c(s.asian),
      southAmerican: c(s.maghreb),
      northAmerican: c(s.turkishMena),
      otherUnknown: c(s.other),
    };
  },
);

/** France labels for the by-origin chart's dataKeys. */
export const FRANCE_BIRTHS_BY_RACE_LABELS = {
  germanNativeNoMigrationBg: 'French native (no migration bg)',
  europeanNonGerman: 'European (non-French)',
  african: 'Sub-Saharan African',
  asian: 'Asian',
  southAmerican: 'North African (Maghreb)',
  northAmerican: 'Turkish / Middle East',
  otherUnknown: 'Other / Unknown',
};

/* ─── Mixed-origin births (French + foreign parent), INSEE-anchored ─── */

export type MixedBirthsRow = {
  year: string;
  germanFemaleNonGermanMaleBirths: number; // French mother + foreign father
  germanMaleNonGermanFemaleBirths: number; // French father + foreign mother
  totalMixedBirths: number;
};

/** Total "one French + one foreign parent" births per year (INSEE 2020: 100,744 métropole → ~106k entière). */
const FRANCE_MIXED_TOTAL: Record<string, number> = {
  '2020': 111971, '2021': 112587, '2022': 109024,
  '2023': 102033, '2024': 100151, '2025': 97358,
};
const FRANCE_BORN_MOTHER_FOREIGN_BORN_SECOND_PARENT: Record<string, number> = {
  '2020': 58811, '2021': 59254, '2022': 58237,
  '2023': 54511, '2024': 53464, '2025': 52286,
};
const FRANCE_BORN_SECOND_PARENT_FOREIGN_BORN_MOTHER: Record<string, number> = {
  '2020': 53160, '2021': 53333, '2022': 50787,
  '2023': 47522, '2024': 46687, '2025': 45072,
};

export const FRANCE_MIXED_BIRTHS_SERIES: readonly MixedBirthsRow[] = Object.entries(FRANCE_MIXED_TOTAL).map(
  ([year, total]) => {
    const frenchMotherForeignFather = FRANCE_BORN_MOTHER_FOREIGN_BORN_SECOND_PARENT[year]!;
    const frenchFatherForeignMother = FRANCE_BORN_SECOND_PARENT_FOREIGN_BORN_MOTHER[year]!;
    return {
      year,
      germanFemaleNonGermanMaleBirths: frenchMotherForeignFather,
      germanMaleNonGermanFemaleBirths: frenchFatherForeignMother,
      totalMixedBirths: total,
    };
  },
);

export const FRANCE_MIXED_BIRTHS_LABELS = {
  female: 'French mother + foreign father',
  male: 'French father + foreign mother',
};
