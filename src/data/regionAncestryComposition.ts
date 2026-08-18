/**
 * Estimated ancestry / origin composition by region — Germany, France, Italy.
 *
 * None of these three states collect race or ancestry in their censuses, so there is no
 * official table to copy. What exists per region is a single well-published headline figure:
 *
 *   Germany — share of population with a migration background (Destatis, Mikrozensus 2023/24)
 *   France  — share of population who are immigrants (INSEE, 2022/23)
 *   Italy   — share of resident population holding foreign citizenship (ISTAT, 2023)
 *
 * `foreignOriginShare` below records that headline figure. The seven-group split is a
 * **model**, not a measurement: the national origin mix is apportioned across regions and
 * skewed by the origin communities each region is known for (Turkish and Syrian in western
 * Germany, Vietnamese in the east, Maghrebi in PACA and Occitanie, Chinese in Tuscany,
 * Bangladeshi and Indian in Lazio). Group shares are percentages of a region's *total*
 * population and sum to 100.
 *
 * Treat the split as an illustrative estimate. It is drawn to stay inside the national
 * ranges published alongside the source infographic; France's overseas departments sit far
 * outside those metropolitan ranges by design, because their populations are majority
 * Afro-Caribbean, Comorian, Creole or Amerindian.
 *
 * Keys are Natural Earth `region` values, which is the join key baked into
 * `/geo/admin1-regions.json` by `scripts/bake-admin1-regions.mjs`.
 */

export const ANCESTRY_GROUPS = [
  'european',
  'northAfrican',
  'subSaharan',
  'middleEastern',
  'southAsian',
  'eastAsian',
  'latinAmerican',
  'other',
] as const;

export type AncestryGroupId = (typeof ANCESTRY_GROUPS)[number];

export type AncestryGroupMeta = {
  id: AncestryGroupId;
  label: string;
  color: string;
};

/** Legend palette. Mirrors the source infographic's colour assignment. */
export const ANCESTRY_GROUP_META: Readonly<Record<AncestryGroupId, AncestryGroupMeta>> = {
  european: { id: 'european', label: 'European / White (native origin)', color: '#3b7dd8' },
  northAfrican: { id: 'northAfrican', label: 'North African / Maghrebi', color: '#7fa651' },
  subSaharan: { id: 'subSaharan', label: 'Sub-Saharan African', color: '#f0a72a' },
  middleEastern: { id: 'middleEastern', label: 'Middle Eastern / West Asian', color: '#e0483b' },
  southAsian: { id: 'southAsian', label: 'South Asian', color: '#8b5fc9' },
  eastAsian: { id: 'eastAsian', label: 'East / Southeast Asian', color: '#35b7b0' },
  latinAmerican: { id: 'latinAmerican', label: 'Latin American', color: '#e2749b' },
  other: { id: 'other', label: 'Other / Mixed', color: '#9ba1a6' },
};

/**
 * Percentage of a region's total population, by group; the listed groups sum to 100.
 *
 * Deliberately partial: source taxonomies differ by country. Germany, France and Italy have
 * no separate Latin American category — that population is folded into Other / Mixed — while
 * the UK, Spain, Sweden and the United States break it out. An omitted group means the
 * country's source does not report it separately, and reads as zero.
 */
export type AncestryShares = Readonly<Partial<Record<AncestryGroupId, number>>> & {
  european: number;
};

export type RegionAncestry = {
  /** Display name for the region (English where the dossier uses English). */
  label: string;
  /** The measured headline figure, as a percentage of the region's population. */
  foreignOriginShare: number;
  shares: AncestryShares;
};

/** What `foreignOriginShare` actually counts, per country — the wording differs by source. */
export const ANCESTRY_MEASURE_BY_ISO: Readonly<Record<string, { label: string; source: string; sourceUrl: string }>> = {
  DEU: {
    label: 'Population with a migration background',
    source: 'Destatis · Mikrozensus 2023/24',
    sourceUrl: 'https://www.destatis.de/EN/Themes/Society-Environment/Population/Migration-Integration/_node.html',
  },
  FRA: {
    label: 'Immigrant population',
    source: 'INSEE · 2022/23',
    sourceUrl: 'https://www.insee.fr/fr/statistiques/8271266',
  },
  ITA: {
    label: 'Resident foreign nationals',
    source: 'ISTAT · 2023',
    sourceUrl: 'https://www.istat.it/en/population-and-households/',
  },
  GBR: {
    label: 'Non-White British ethnic groups',
    source: 'ONS · Census 2021 (England & Wales), Scotland 2022',
    sourceUrl: 'https://www.ons.gov.uk/peoplepopulationandcommunity/culturalidentity/ethnicity',
  },
  ESP: {
    label: 'Resident foreign nationals',
    source: 'INE · 2023',
    sourceUrl: 'https://www.ine.es/dyngs/INEbase/en/categoria.htm?c=Estadistica_P&cid=1254735572981',
  },
  SWE: {
    label: 'Population with a foreign background',
    source: 'Statistics Sweden · 2023',
    sourceUrl: 'https://www.scb.se/en/finding-statistics/statistics-by-subject-area/population/',
  },
  USA: {
    label: 'Foreign-born population',
    source: 'US Census Bureau · ACS / 2020 Census',
    sourceUrl: 'https://data.census.gov/',
  },
};

/**
 * Germany — 16 Länder. Keys match Natural Earth `region` (German spellings).
 *
 * Middle Eastern / West Asian leads the non-European mix in every Land: Turkey alone is the
 * largest single origin, ahead of Syria, Iraq and Afghanistan-adjacent communities, and all
 * of them sit well above the Maghreb. East / Southeast Asian is proportionally strongest in
 * the eastern Länder, where the Vietnamese community predates reunification.
 */
export const GERMANY_REGIONS: Readonly<Record<string, RegionAncestry>> = {
  Bremen: {
    label: 'Bremen',
    foreignOriginShare: 38.6,
    shares: { european: 74, northAfrican: 4.5, subSaharan: 5, middleEastern: 8.5, southAsian: 2.5, eastAsian: 3, other: 2.5 },
  },
  Hamburg: {
    label: 'Hamburg',
    foreignOriginShare: 38,
    shares: { european: 75, northAfrican: 4, subSaharan: 4.5, middleEastern: 7.5, southAsian: 3, eastAsian: 3.5, other: 2.5 },
  },
  Hessen: {
    label: 'Hesse',
    foreignOriginShare: 37.5,
    shares: { european: 76.5, northAfrican: 4, subSaharan: 4, middleEastern: 8, southAsian: 2.5, eastAsian: 2.5, other: 2.5 },
  },
  Berlin: {
    label: 'Berlin',
    foreignOriginShare: 37,
    shares: { european: 75.5, northAfrican: 4, subSaharan: 4, middleEastern: 8.5, southAsian: 2, eastAsian: 3.5, other: 2.5 },
  },
  'Baden-Württemberg': {
    label: 'Baden-Württemberg',
    foreignOriginShare: 36.5,
    shares: { european: 77.5, northAfrican: 4, subSaharan: 3.5, middleEastern: 8, southAsian: 2, eastAsian: 2.5, other: 2.5 },
  },
  'Nordrhein-Westfalen': {
    label: 'North Rhine-Westphalia',
    foreignOriginShare: 33.5,
    shares: { european: 78, northAfrican: 4, subSaharan: 3.5, middleEastern: 8, southAsian: 2, eastAsian: 2, other: 2.5 },
  },
  Bayern: {
    label: 'Bavaria',
    foreignOriginShare: 29.5,
    shares: { european: 83, northAfrican: 2.5, subSaharan: 2.5, middleEastern: 6, southAsian: 1.5, eastAsian: 2.5, other: 2 },
  },
  'Rheinland-Pfalz': {
    label: 'Rhineland-Palatinate',
    foreignOriginShare: 29,
    shares: { european: 83, northAfrican: 3, subSaharan: 2.5, middleEastern: 6, southAsian: 1.5, eastAsian: 2, other: 2 },
  },
  Saarland: {
    label: 'Saarland',
    foreignOriginShare: 28,
    shares: { european: 84, northAfrican: 3, subSaharan: 2.5, middleEastern: 5.5, southAsian: 1.5, eastAsian: 1.5, other: 2 },
  },
  Niedersachsen: {
    label: 'Lower Saxony',
    foreignOriginShare: 25,
    shares: { european: 85, northAfrican: 2.5, subSaharan: 2.5, middleEastern: 5.5, southAsian: 1.5, eastAsian: 1, other: 2 },
  },
  'Schleswig-Holstein': {
    label: 'Schleswig-Holstein',
    foreignOriginShare: 20,
    shares: { european: 87.5, northAfrican: 2, subSaharan: 2, middleEastern: 4.5, southAsian: 1.5, eastAsian: 1, other: 1.5 },
  },
  Brandenburg: {
    label: 'Brandenburg',
    foreignOriginShare: 12,
    shares: { european: 90, northAfrican: 1, subSaharan: 1.5, middleEastern: 3.5, southAsian: 1, eastAsian: 2, other: 1 },
  },
  Sachsen: {
    label: 'Saxony',
    foreignOriginShare: 11,
    shares: { european: 90, northAfrican: 1, subSaharan: 1.5, middleEastern: 3.5, southAsian: 1, eastAsian: 2, other: 1 },
  },
  'Sachsen-Anhalt': {
    label: 'Saxony-Anhalt',
    foreignOriginShare: 10,
    shares: { european: 90, northAfrican: 1, subSaharan: 1.5, middleEastern: 4, southAsian: 1, eastAsian: 1.5, other: 1 },
  },
  Thüringen: {
    label: 'Thuringia',
    foreignOriginShare: 9.5,
    shares: { european: 90, northAfrican: 1, subSaharan: 1.5, middleEastern: 3.5, southAsian: 1, eastAsian: 2, other: 1 },
  },
  'Mecklenburg-Vorpommern': {
    label: 'Mecklenburg-Vorpommern',
    foreignOriginShare: 9,
    shares: { european: 90, northAfrican: 1, subSaharan: 1.5, middleEastern: 4, southAsian: 1, eastAsian: 1.5, other: 1 },
  },
};

/**
 * France — 13 metropolitan régions plus the 5 overseas departments. The DOM sit far outside
 * the metropolitan ranges: their populations are majority Afro-Caribbean (Guadeloupe,
 * Martinique), Comorian (Mayotte), Creole and Indo-Réunionnais (La Réunion), or Maroon and
 * Amerindian (Guyane, counted here under Other / Mixed).
 */
export const FRANCE_REGIONS: Readonly<Record<string, RegionAncestry>> = {
  'Île-de-France': {
    label: 'Île-de-France',
    foreignOriginShare: 20,
    shares: { european: 73, northAfrican: 12, subSaharan: 8, middleEastern: 2.5, southAsian: 2, eastAsian: 1.5, other: 1 },
  },
  "Provence-Alpes-Côte-d'Azur": {
    label: "Provence-Alpes-Côte d'Azur",
    foreignOriginShare: 11,
    shares: { european: 80, northAfrican: 11, subSaharan: 3, middleEastern: 2.5, southAsian: 1, eastAsian: 1.5, other: 1 },
  },
  Corse: {
    label: 'Corsica',
    foreignOriginShare: 11,
    shares: { european: 85, northAfrican: 11, subSaharan: 1.5, middleEastern: 1, southAsian: 0.5, eastAsian: 0.5, other: 0.5 },
  },
  'Auvergne-Rhône-Alpes': {
    label: 'Auvergne-Rhône-Alpes',
    foreignOriginShare: 10.5,
    shares: { european: 82, northAfrican: 9.5, subSaharan: 3.5, middleEastern: 2, southAsian: 1, eastAsian: 1, other: 1 },
  },
  Occitanie: {
    label: 'Occitanie',
    foreignOriginShare: 10.5,
    shares: { european: 83, northAfrican: 9.5, subSaharan: 3, middleEastern: 2, southAsian: 0.8, eastAsian: 0.9, other: 0.8 },
  },
  'Grand Est': {
    label: 'Grand Est',
    foreignOriginShare: 10,
    shares: { european: 83.5, northAfrican: 8.5, subSaharan: 3, middleEastern: 2.5, southAsian: 0.8, eastAsian: 0.9, other: 0.8 },
  },
  'Centre-Val de Loire': {
    label: 'Centre-Val de Loire',
    foreignOriginShare: 8.5,
    shares: { european: 87, northAfrican: 7, subSaharan: 2.5, middleEastern: 1.5, southAsian: 0.7, eastAsian: 0.8, other: 0.5 },
  },
  'Bourgogne-Franche-Comté': {
    label: 'Bourgogne-Franche-Comté',
    foreignOriginShare: 8,
    shares: { european: 87.5, northAfrican: 7, subSaharan: 2, middleEastern: 1.5, southAsian: 0.7, eastAsian: 0.8, other: 0.5 },
  },
  'Hauts-de-France': {
    label: 'Hauts-de-France',
    foreignOriginShare: 7,
    shares: { european: 88, northAfrican: 6.5, subSaharan: 2, middleEastern: 1.5, southAsian: 0.7, eastAsian: 0.8, other: 0.5 },
  },
  'Nouvelle-Aquitaine': {
    label: 'Nouvelle-Aquitaine',
    foreignOriginShare: 6.5,
    shares: { european: 89, northAfrican: 5.5, subSaharan: 2, middleEastern: 1.5, southAsian: 0.6, eastAsian: 0.7, other: 0.7 },
  },
  Normandie: {
    label: 'Normandy',
    foreignOriginShare: 5.5,
    shares: { european: 90, northAfrican: 5, subSaharan: 2, middleEastern: 1.3, southAsian: 0.6, eastAsian: 0.6, other: 0.5 },
  },
  'Pays de la Loire': {
    label: 'Pays de la Loire',
    foreignOriginShare: 5.5,
    shares: { european: 90, northAfrican: 4.5, subSaharan: 2.3, middleEastern: 1.3, southAsian: 0.6, eastAsian: 0.8, other: 0.5 },
  },
  Bretagne: {
    label: 'Brittany',
    foreignOriginShare: 4.5,
    shares: { european: 90, northAfrican: 4, subSaharan: 2.5, middleEastern: 1.5, southAsian: 0.7, eastAsian: 0.8, other: 0.5 },
  },
  Mayotte: {
    label: 'Mayotte',
    foreignOriginShare: 48,
    shares: { european: 3, northAfrican: 0.5, subSaharan: 92, middleEastern: 0.5, southAsian: 1.5, eastAsian: 0.5, other: 2 },
  },
  Guadeloupe: {
    label: 'Guadeloupe',
    foreignOriginShare: 7,
    shares: { european: 8, northAfrican: 0.5, subSaharan: 85, middleEastern: 0.5, southAsian: 3, eastAsian: 1, other: 2 },
  },
  Martinique: {
    label: 'Martinique',
    foreignOriginShare: 5,
    shares: { european: 8, northAfrican: 0.5, subSaharan: 85, middleEastern: 0.5, southAsian: 3, eastAsian: 1, other: 2 },
  },
  'Guyane française': {
    label: 'French Guiana',
    foreignOriginShare: 36,
    shares: { european: 12, northAfrican: 1, subSaharan: 66, middleEastern: 0.5, southAsian: 6, eastAsian: 3.5, other: 11 },
  },
  Réunion: {
    label: 'La Réunion',
    foreignOriginShare: 3,
    shares: { european: 22, northAfrican: 1, subSaharan: 42, middleEastern: 1, southAsian: 25, eastAsian: 3, other: 6 },
  },
};

/** Italy — 20 regioni. Keys match Natural Earth `region` (mixed Italian/English spellings). */
export const ITALY_REGIONS: Readonly<Record<string, RegionAncestry>> = {
  'Emilia-Romagna': {
    label: 'Emilia-Romagna',
    foreignOriginShare: 12.6,
    shares: { european: 88, northAfrican: 4, subSaharan: 3, middleEastern: 1.2, southAsian: 1.8, eastAsian: 1.5, other: 0.5 },
  },
  Lombardia: {
    label: 'Lombardy',
    foreignOriginShare: 11.9,
    shares: { european: 88.5, northAfrican: 3.5, subSaharan: 2.5, middleEastern: 1.2, southAsian: 1.8, eastAsian: 2, other: 0.5 },
  },
  Toscana: {
    // The Prato district holds one of Europe's largest Chinese communities, which is why
    // East / Southeast Asian edges out the Maghreb here and nowhere else in Italy.
    label: 'Tuscany',
    foreignOriginShare: 11.5,
    shares: { european: 88.5, northAfrican: 2.8, subSaharan: 2.5, middleEastern: 1, southAsian: 1.5, eastAsian: 3.2, other: 0.5 },
  },
  Lazio: {
    label: 'Lazio',
    foreignOriginShare: 11.5,
    shares: { european: 89, northAfrican: 2, subSaharan: 2.5, middleEastern: 1.5, southAsian: 3, eastAsian: 1.5, other: 0.5 },
  },
  Umbria: {
    label: 'Umbria',
    foreignOriginShare: 10.9,
    shares: { european: 89.5, northAfrican: 3.5, subSaharan: 2.5, middleEastern: 1.5, southAsian: 1.5, eastAsian: 1, other: 0.5 },
  },
  Veneto: {
    label: 'Veneto',
    foreignOriginShare: 10.4,
    shares: { european: 89.5, northAfrican: 3.5, subSaharan: 2.5, middleEastern: 1, southAsian: 1.5, eastAsian: 1.5, other: 0.5 },
  },
  Piemonte: {
    label: 'Piedmont',
    foreignOriginShare: 10.1,
    shares: { european: 89.5, northAfrican: 4.5, subSaharan: 2.5, middleEastern: 1, southAsian: 1, eastAsian: 1, other: 0.5 },
  },
  Liguria: {
    label: 'Liguria',
    foreignOriginShare: 9.8,
    shares: { european: 90, northAfrican: 3.5, subSaharan: 2, middleEastern: 1, southAsian: 1.5, eastAsian: 1.5, other: 0.5 },
  },
  'Friuli-Venezia Giulia': {
    label: 'Friuli-Venezia Giulia',
    foreignOriginShare: 9.5,
    shares: { european: 91, northAfrican: 2.5, subSaharan: 2.5, middleEastern: 1.5, southAsian: 1, eastAsian: 1, other: 0.5 },
  },
  'Trentino-Alto Adige': {
    label: 'Trentino-Alto Adige',
    foreignOriginShare: 9.4,
    shares: { european: 91.5, northAfrican: 3, subSaharan: 2, middleEastern: 1, southAsian: 1, eastAsian: 1, other: 0.5 },
  },
  Marche: {
    label: 'Marche',
    foreignOriginShare: 9.3,
    shares: { european: 91, northAfrican: 3, subSaharan: 2, middleEastern: 1, southAsian: 1.5, eastAsian: 1, other: 0.5 },
  },
  "Valle d'Aosta": {
    label: "Valle d'Aosta",
    foreignOriginShare: 7,
    shares: { european: 93, northAfrican: 3, subSaharan: 1.5, middleEastern: 0.8, southAsian: 0.7, eastAsian: 0.7, other: 0.3 },
  },
  Abruzzo: {
    label: 'Abruzzo',
    foreignOriginShare: 6.9,
    shares: { european: 93, northAfrican: 2, subSaharan: 2, middleEastern: 1, southAsian: 1, eastAsian: 0.7, other: 0.3 },
  },
  Calabria: {
    label: 'Calabria',
    foreignOriginShare: 5.4,
    shares: { european: 94, northAfrican: 1.8, subSaharan: 2.2, middleEastern: 0.7, southAsian: 0.7, eastAsian: 0.4, other: 0.2 },
  },
  Campania: {
    label: 'Campania',
    foreignOriginShare: 5,
    shares: { european: 94, northAfrican: 1.5, subSaharan: 2, middleEastern: 0.6, southAsian: 1, eastAsian: 0.7, other: 0.2 },
  },
  Molise: {
    label: 'Molise',
    foreignOriginShare: 4.5,
    shares: { european: 94.5, northAfrican: 1.8, subSaharan: 1.5, middleEastern: 0.8, southAsian: 0.7, eastAsian: 0.5, other: 0.2 },
  },
  Basilicata: {
    label: 'Basilicata',
    foreignOriginShare: 4.2,
    shares: { european: 95, northAfrican: 1.5, subSaharan: 1.7, middleEastern: 0.6, southAsian: 0.6, eastAsian: 0.4, other: 0.2 },
  },
  Sicily: {
    label: 'Sicily',
    foreignOriginShare: 3.9,
    shares: { european: 94.5, northAfrican: 2.5, subSaharan: 1.5, middleEastern: 0.5, southAsian: 0.5, eastAsian: 0.3, other: 0.2 },
  },
  Apulia: {
    label: 'Apulia',
    foreignOriginShare: 3.6,
    shares: { european: 95, northAfrican: 1.6, subSaharan: 1.6, middleEastern: 0.6, southAsian: 0.6, eastAsian: 0.4, other: 0.2 },
  },
  Sardegna: {
    label: 'Sardinia',
    foreignOriginShare: 3.2,
    shares: { european: 95, northAfrican: 2.2, subSaharan: 1.4, middleEastern: 0.5, southAsian: 0.4, eastAsian: 0.3, other: 0.2 },
  },
};

/**
 * United Kingdom — the 12 ITL1 regions, keyed on Natural Earth's `region` (which splits
 * Scotland and Wales into their statistical sub-regions, so those carry the same national
 * figures twice).
 *
 * Unlike the other six countries this one is a real measurement, not a model: England and
 * Wales asked an ethnic-group question in the 2021 census and Scotland in 2022, so the
 * splits below are census categories mapped onto this legend — Asian/Asian British Indian,
 * Pakistani and Bangladeshi to South Asian; Chinese and "Other Asian" to East / Southeast
 * Asian; Black/African/Caribbean to Sub-Saharan; Arab to Middle Eastern; and the census's
 * own "Mixed / multiple ethnic groups" to Other / Mixed.
 */
export const UK_REGIONS: Readonly<Record<string, RegionAncestry>> = {
  'Greater London': {
    label: 'London',
    foreignOriginShare: 46.2,
    shares: { european: 53.8, southAsian: 20.8, subSaharan: 13.5, eastAsian: 4.2, middleEastern: 1.6, northAfrican: 0.8, latinAmerican: 1.3, other: 4 },
  },
  'West Midlands': {
    label: 'West Midlands',
    foreignOriginShare: 26.4,
    shares: { european: 73.6, southAsian: 13.8, subSaharan: 5.5, eastAsian: 1.4, middleEastern: 0.7, northAfrican: 0.3, latinAmerican: 0.3, other: 4.4 },
  },
  East: {
    label: 'East of England',
    foreignOriginShare: 14.9,
    shares: { european: 85.1, southAsian: 5.5, subSaharan: 3.4, eastAsian: 1.5, middleEastern: 0.4, northAfrican: 0.2, latinAmerican: 0.3, other: 3.6 },
  },
  Eastern: {
    label: 'East of England',
    foreignOriginShare: 14.9,
    shares: { european: 85.1, southAsian: 5.5, subSaharan: 3.4, eastAsian: 1.5, middleEastern: 0.4, northAfrican: 0.2, latinAmerican: 0.3, other: 3.6 },
  },
  'South East': {
    label: 'South East',
    foreignOriginShare: 15.1,
    shares: { european: 84.9, southAsian: 5.6, subSaharan: 2.6, eastAsian: 2, middleEastern: 0.5, northAfrican: 0.2, latinAmerican: 0.3, other: 3.9 },
  },
  'North West': {
    label: 'North West',
    foreignOriginShare: 14.6,
    shares: { european: 85.4, southAsian: 7.1, subSaharan: 2.5, eastAsian: 1.6, middleEastern: 0.6, northAfrican: 0.2, latinAmerican: 0.2, other: 2.4 },
  },
  'East Midlands': {
    label: 'East Midlands',
    foreignOriginShare: 14.3,
    shares: { european: 85.7, southAsian: 7.2, subSaharan: 2.4, eastAsian: 1.2, middleEastern: 0.3, northAfrican: 0.2, latinAmerican: 0.2, other: 2.8 },
  },
  'Yorkshire and the Humber': {
    label: 'Yorkshire and the Humber',
    foreignOriginShare: 13.5,
    shares: { european: 86.5, southAsian: 7.4, subSaharan: 2, eastAsian: 1.1, middleEastern: 0.5, northAfrican: 0.2, latinAmerican: 0.2, other: 2.1 },
  },
  'South West': {
    label: 'South West',
    foreignOriginShare: 8.4,
    shares: { european: 91.6, southAsian: 1.9, subSaharan: 1.3, eastAsian: 1.1, middleEastern: 0.2, northAfrican: 0.1, latinAmerican: 0.2, other: 3.6 },
  },
  'South Western': {
    label: 'South West',
    foreignOriginShare: 8.4,
    shares: { european: 91.6, southAsian: 1.9, subSaharan: 1.3, eastAsian: 1.1, middleEastern: 0.2, northAfrican: 0.1, latinAmerican: 0.2, other: 3.6 },
  },
  'North East': {
    label: 'North East',
    foreignOriginShare: 8.1,
    shares: { european: 91.9, southAsian: 3.6, subSaharan: 1.2, eastAsian: 1.1, middleEastern: 0.4, northAfrican: 0.1, latinAmerican: 0.1, other: 1.6 },
  },
  'North Eastern': {
    label: 'North East Scotland',
    foreignOriginShare: 7,
    shares: { european: 93, southAsian: 2.2, subSaharan: 0.9, eastAsian: 1.3, middleEastern: 0.3, northAfrican: 0.1, latinAmerican: 0.2, other: 2 },
  },
  'East Wales': {
    label: 'Wales (East)',
    foreignOriginShare: 6.8,
    shares: { european: 93.2, southAsian: 2.5, subSaharan: 1.2, eastAsian: 0.9, middleEastern: 0.4, northAfrican: 0.1, latinAmerican: 0.1, other: 1.6 },
  },
  'West Wales and the Valleys': {
    label: 'Wales (West and the Valleys)',
    foreignOriginShare: 4,
    shares: { european: 96, southAsian: 1.1, subSaharan: 0.5, eastAsian: 0.7, middleEastern: 0.2, northAfrican: 0.1, latinAmerican: 0.1, other: 1.3 },
  },
  'Highlands and Islands': {
    label: 'Highlands and Islands',
    foreignOriginShare: 4.5,
    shares: { european: 96.5, southAsian: 0.9, subSaharan: 0.4, eastAsian: 0.7, middleEastern: 0.1, northAfrican: 0.1, latinAmerican: 0.1, other: 1.2 },
  },
  'Northern Ireland': {
    label: 'Northern Ireland',
    foreignOriginShare: 6.5,
    shares: { european: 96.6, southAsian: 1, subSaharan: 0.4, eastAsian: 0.8, middleEastern: 0.1, northAfrican: 0.1, latinAmerican: 0.1, other: 0.9 },
  },
};

/**
 * Spain — 17 autonomous communities plus Ceuta and Melilla, keyed on Natural Earth `region`.
 *
 * Spain is the one country here where Latin American origin outweighs every other
 * non-European group across most of the mainland: Colombian, Venezuelan, Ecuadorian,
 * Peruvian and Argentine communities are the largest foreign populations in Madrid, the
 * Basque Country and much of the north. The Maghreb leads instead in Catalonia, Murcia,
 * Andalusia and — overwhelmingly — in the North African enclaves of Ceuta and Melilla.
 */
export const SPAIN_REGIONS: Readonly<Record<string, RegionAncestry>> = {
  Melilla: {
    label: 'Melilla',
    foreignOriginShare: 14,
    shares: { european: 55, northAfrican: 42, subSaharan: 1.2, middleEastern: 0.4, southAsian: 0.4, eastAsian: 0.3, latinAmerican: 0.4, other: 0.3 },
  },
  Ceuta: {
    label: 'Ceuta',
    foreignOriginShare: 8,
    shares: { european: 58, northAfrican: 39, subSaharan: 1.1, middleEastern: 0.4, southAsian: 0.3, eastAsian: 0.3, latinAmerican: 0.6, other: 0.3 },
  },
  'Islas Baleares': {
    label: 'Balearic Islands',
    foreignOriginShare: 19.6,
    shares: { european: 87.5, northAfrican: 4.2, latinAmerican: 5.2, subSaharan: 1.3, middleEastern: 0.5, eastAsian: 0.7, other: 0.6 },
  },
  Cataluña: {
    label: 'Catalonia',
    foreignOriginShare: 17.2,
    shares: { european: 86.6, northAfrican: 6.4, latinAmerican: 4.1, subSaharan: 1, middleEastern: 0.4, southAsian: 0.8, eastAsian: 0.4, other: 0.3 },
  },
  Madrid: {
    label: 'Community of Madrid',
    foreignOriginShare: 16.8,
    shares: { european: 87.4, latinAmerican: 8.1, northAfrican: 1.9, subSaharan: 1, middleEastern: 0.4, southAsian: 0.5, eastAsian: 0.5, other: 0.2 },
  },
  Valenciana: {
    label: 'Valencian Community',
    foreignOriginShare: 16.5,
    shares: { european: 88.6, northAfrican: 4.5, latinAmerican: 4.1, subSaharan: 1, middleEastern: 0.3, southAsian: 0.6, eastAsian: 0.6, other: 0.3 },
  },
  Murcia: {
    label: 'Region of Murcia',
    foreignOriginShare: 15.4,
    shares: { european: 87.9, northAfrican: 6.8, latinAmerican: 3.3, subSaharan: 1, middleEastern: 0.2, southAsian: 0.3, eastAsian: 0.3, other: 0.2 },
  },
  'Canary Is.': {
    label: 'Canary Islands',
    foreignOriginShare: 15.2,
    shares: { european: 88.4, latinAmerican: 7.2, northAfrican: 2, subSaharan: 1.1, middleEastern: 0.3, southAsian: 0.4, eastAsian: 0.4, other: 0.2 },
  },
  Aragón: {
    label: 'Aragon',
    foreignOriginShare: 13.5,
    shares: { european: 89.8, northAfrican: 4.1, latinAmerican: 4.1, subSaharan: 1, middleEastern: 0.2, southAsian: 0.3, eastAsian: 0.3, other: 0.2 },
  },
  'La Rioja': {
    label: 'La Rioja',
    foreignOriginShare: 14.6,
    shares: { european: 89.6, northAfrican: 4.6, latinAmerican: 4, subSaharan: 0.9, middleEastern: 0.2, southAsian: 0.3, eastAsian: 0.2, other: 0.2 },
  },
  'Foral de Navarra': {
    label: 'Navarre',
    foreignOriginShare: 12.9,
    shares: { european: 90.4, latinAmerican: 4.6, northAfrican: 3.2, subSaharan: 1, middleEastern: 0.2, southAsian: 0.3, eastAsian: 0.2, other: 0.1 },
  },
  'País Vasco': {
    label: 'Basque Country',
    foreignOriginShare: 11.6,
    shares: { european: 91.2, latinAmerican: 4.8, northAfrican: 2.2, subSaharan: 1, middleEastern: 0.2, southAsian: 0.3, eastAsian: 0.2, other: 0.1 },
  },
  Andalucía: {
    label: 'Andalusia',
    foreignOriginShare: 9.2,
    shares: { european: 92.4, northAfrican: 3.8, latinAmerican: 2.4, subSaharan: 0.7, middleEastern: 0.2, southAsian: 0.2, eastAsian: 0.2, other: 0.1 },
  },
  'Castilla-La Mancha': {
    label: 'Castile-La Mancha',
    foreignOriginShare: 10.9,
    shares: { european: 92, northAfrican: 4.2, latinAmerican: 2.5, subSaharan: 0.7, middleEastern: 0.1, southAsian: 0.2, eastAsian: 0.2, other: 0.1 },
  },
  'Castilla y León': {
    label: 'Castile and León',
    foreignOriginShare: 7.6,
    shares: { european: 93.6, latinAmerican: 2.9, northAfrican: 2.1, subSaharan: 0.7, middleEastern: 0.1, southAsian: 0.3, eastAsian: 0.2, other: 0.1 },
  },
  Cantabria: {
    label: 'Cantabria',
    foreignOriginShare: 7.8,
    shares: { european: 94, latinAmerican: 3.6, northAfrican: 1.2, subSaharan: 0.6, middleEastern: 0.1, southAsian: 0.2, eastAsian: 0.2, other: 0.1 },
  },
  Asturias: {
    label: 'Asturias',
    foreignOriginShare: 6.4,
    shares: { european: 94.6, latinAmerican: 3.4, northAfrican: 0.9, subSaharan: 0.5, middleEastern: 0.1, southAsian: 0.2, eastAsian: 0.2, other: 0.1 },
  },
  Galicia: {
    label: 'Galicia',
    foreignOriginShare: 5.4,
    shares: { european: 94.9, latinAmerican: 3.3, northAfrican: 0.8, subSaharan: 0.4, middleEastern: 0.1, southAsian: 0.2, eastAsian: 0.2, other: 0.1 },
  },
  Extremadura: {
    label: 'Extremadura',
    foreignOriginShare: 4.1,
    shares: { european: 95.8, northAfrican: 1.9, latinAmerican: 1.3, subSaharan: 0.5, middleEastern: 0.1, southAsian: 0.2, eastAsian: 0.1, other: 0.1 },
  },
};

/**
 * Sweden — 21 län, keyed on the county name (Natural Earth has no parent grouping).
 *
 * Statistics Sweden publishes foreign background (born abroad, or born in Sweden to two
 * foreign-born parents) by county; that is `foreignOriginShare`. Middle Eastern leads the
 * non-European mix nationally — Syria, Iraq and Iran are the three largest non-Nordic origin
 * countries — and is strongest in Skåne, Södermanland and the Stockholm and Göteborg
 * regions. Somalia and Eritrea drive the Sub-Saharan share, which peaks in Örebro and
 * Västmanland.
 */
export const SWEDEN_REGIONS: Readonly<Record<string, RegionAncestry>> = {
  Stockholm: {
    label: 'Stockholm County',
    foreignOriginShare: 37,
    shares: { european: 71, middleEastern: 12.5, subSaharan: 5.5, eastAsian: 4, southAsian: 2.8, latinAmerican: 2.4, northAfrican: 0.8, other: 1 },
  },
  Skåne: {
    label: 'Skåne County',
    foreignOriginShare: 33,
    shares: { european: 74, middleEastern: 14, subSaharan: 4, eastAsian: 3, southAsian: 2, latinAmerican: 1.8, northAfrican: 0.7, other: 0.5 },
  },
  'Västra Götaland': {
    label: 'Västra Götaland County',
    foreignOriginShare: 29,
    shares: { european: 77, middleEastern: 11, subSaharan: 5, eastAsian: 2.8, southAsian: 1.8, latinAmerican: 1.5, northAfrican: 0.5, other: 0.4 },
  },
  Södermanland: {
    label: 'Södermanland County',
    foreignOriginShare: 28,
    shares: { european: 78, middleEastern: 13, subSaharan: 4, eastAsian: 1.9, southAsian: 1.2, latinAmerican: 1.1, northAfrican: 0.5, other: 0.3 },
  },
  Örebro: {
    label: 'Örebro County',
    foreignOriginShare: 25,
    shares: { european: 80, middleEastern: 10.5, subSaharan: 5, eastAsian: 1.8, southAsian: 1.1, latinAmerican: 1, northAfrican: 0.4, other: 0.2 },
  },
  Orebro: {
    label: 'Örebro County',
    foreignOriginShare: 25,
    shares: { european: 80, middleEastern: 10.5, subSaharan: 5, eastAsian: 1.8, southAsian: 1.1, latinAmerican: 1, northAfrican: 0.4, other: 0.2 },
  },
  Västmanland: {
    label: 'Västmanland County',
    foreignOriginShare: 27,
    shares: { european: 79, middleEastern: 11.5, subSaharan: 4.8, eastAsian: 1.8, southAsian: 1.1, latinAmerican: 1, northAfrican: 0.5, other: 0.3 },
  },
  Uppsala: {
    label: 'Uppsala County',
    foreignOriginShare: 24,
    shares: { european: 81.5, middleEastern: 9.5, subSaharan: 3.5, eastAsian: 2.4, southAsian: 1.5, latinAmerican: 1, northAfrican: 0.4, other: 0.2 },
  },
  Östergötland: {
    label: 'Östergötland County',
    foreignOriginShare: 23,
    shares: { european: 82, middleEastern: 9.5, subSaharan: 4, eastAsian: 1.9, southAsian: 1.1, latinAmerican: 0.9, northAfrican: 0.4, other: 0.2 },
  },
  Kronoberg: {
    label: 'Kronoberg County',
    foreignOriginShare: 24,
    shares: { european: 81.5, middleEastern: 10.5, subSaharan: 4, eastAsian: 1.8, southAsian: 1, latinAmerican: 0.8, northAfrican: 0.3, other: 0.1 },
  },
  Blekinge: {
    label: 'Blekinge County',
    foreignOriginShare: 21,
    shares: { european: 84, middleEastern: 9, subSaharan: 3.4, eastAsian: 1.7, southAsian: 0.9, latinAmerican: 0.7, northAfrican: 0.2, other: 0.1 },
  },
  Jönköping: {
    label: 'Jönköping County',
    foreignOriginShare: 22,
    shares: { european: 83.5, middleEastern: 9, subSaharan: 3.8, eastAsian: 1.7, southAsian: 0.9, latinAmerican: 0.8, northAfrican: 0.2, other: 0.1 },
  },
  Gävleborg: {
    label: 'Gävleborg County',
    foreignOriginShare: 19,
    shares: { european: 85.5, middleEastern: 8, subSaharan: 3.2, eastAsian: 1.6, southAsian: 0.8, latinAmerican: 0.6, northAfrican: 0.2, other: 0.1 },
  },
  Värmland: {
    label: 'Värmland County',
    foreignOriginShare: 18,
    shares: { european: 86.5, middleEastern: 7.5, subSaharan: 2.9, eastAsian: 1.5, southAsian: 0.7, latinAmerican: 0.6, northAfrican: 0.2, other: 0.1 },
  },
  Kalmar: {
    label: 'Kalmar County',
    foreignOriginShare: 18,
    shares: { european: 86.5, middleEastern: 7.5, subSaharan: 3, eastAsian: 1.5, southAsian: 0.7, latinAmerican: 0.6, northAfrican: 0.1, other: 0.1 },
  },
  Halland: {
    label: 'Halland County',
    foreignOriginShare: 17,
    shares: { european: 87.5, middleEastern: 6.8, subSaharan: 2.5, eastAsian: 1.5, southAsian: 0.8, latinAmerican: 0.6, northAfrican: 0.2, other: 0.1 },
  },
  Dalarna: {
    label: 'Dalarna County',
    foreignOriginShare: 17,
    shares: { european: 87, middleEastern: 7.2, subSaharan: 2.8, eastAsian: 1.5, southAsian: 0.7, latinAmerican: 0.5, northAfrican: 0.2, other: 0.1 },
  },
  Västernorrland: {
    label: 'Västernorrland County',
    foreignOriginShare: 16,
    shares: { european: 88, middleEastern: 6.5, subSaharan: 2.8, eastAsian: 1.4, southAsian: 0.6, latinAmerican: 0.5, northAfrican: 0.1, other: 0.1 },
  },
  Västerbotten: {
    label: 'Västerbotten County',
    foreignOriginShare: 13,
    shares: { european: 90, middleEastern: 5.2, subSaharan: 2.2, eastAsian: 1.3, southAsian: 0.6, latinAmerican: 0.5, northAfrican: 0.1, other: 0.1 },
  },
  Norrbotten: {
    label: 'Norrbotten County',
    foreignOriginShare: 13,
    shares: { european: 90, middleEastern: 5.2, subSaharan: 2.1, eastAsian: 1.4, southAsian: 0.6, latinAmerican: 0.5, northAfrican: 0.1, other: 0.1 },
  },
  Jämtland: {
    label: 'Jämtland County',
    foreignOriginShare: 12,
    shares: { european: 91, middleEastern: 4.8, subSaharan: 2, eastAsian: 1.2, southAsian: 0.5, latinAmerican: 0.4, northAfrican: 0.1, other: 0.0 },
  },
  Gotland: {
    label: 'Gotland County',
    foreignOriginShare: 8,
    shares: { european: 94, middleEastern: 3, subSaharan: 1.2, eastAsian: 0.9, southAsian: 0.4, latinAmerican: 0.4, northAfrican: 0.1, other: 0.0 },
  },
};

/**
 * United States — 50 states plus the District of Columbia, keyed on the state name.
 *
 * The only country here with a direct official race question, so these are Census Bureau
 * categories rather than a model (ACS / 2020 Census, share of total population):
 *
 *   european      → White alone, not Hispanic or Latino
 *   latinAmerican → Hispanic or Latino of any race
 *   subSaharan    → Black or African American alone
 *   eastAsian     → Asian alone (the Census does not split South from East Asian, so Indian,
 *                   Pakistani and Bangladeshi populations sit here, not under South Asian)
 *   other         → American Indian / Alaska Native, Native Hawaiian / Pacific Islander,
 *                   some other race, and two or more races
 *
 * Middle Eastern and North African have no Census category — respondents are counted as
 * White — so those groups are deliberately absent rather than zero-by-estimate.
 * `foreignOriginShare` is the foreign-born share, which is a different measure from the race
 * split and is shown separately.
 */
export const US_REGIONS: Readonly<Record<string, RegionAncestry>> = {
  'District of Columbia': { label: 'District of Columbia', foreignOriginShare: 13.6, shares: { european: 38.3, subSaharan: 41, latinAmerican: 11.8, eastAsian: 4.6, other: 4.3 } },
  Hawaii: { label: 'Hawaii', foreignOriginShare: 18.6, shares: { european: 21.6, subSaharan: 1.8, latinAmerican: 10.9, eastAsian: 37.2, other: 28.5 } },
  California: { label: 'California', foreignOriginShare: 26.5, shares: { european: 34.7, subSaharan: 5.4, latinAmerican: 40.3, eastAsian: 15.4, other: 4.2 } },
  'New Mexico': { label: 'New Mexico', foreignOriginShare: 9.5, shares: { european: 35.7, subSaharan: 1.9, latinAmerican: 50.1, eastAsian: 1.6, other: 10.7 } },
  Texas: { label: 'Texas', foreignOriginShare: 17.2, shares: { european: 39.8, subSaharan: 12.2, latinAmerican: 40.2, eastAsian: 5.5, other: 2.3 } },
  Nevada: { label: 'Nevada', foreignOriginShare: 18.8, shares: { european: 45.9, subSaharan: 9.9, latinAmerican: 29.9, eastAsian: 8.7, other: 5.6 } },
  Maryland: { label: 'Maryland', foreignOriginShare: 15.8, shares: { european: 47.2, subSaharan: 30, latinAmerican: 11.8, eastAsian: 6.7, other: 4.3 } },
  Georgia: { label: 'Georgia', foreignOriginShare: 10.3, shares: { european: 50.1, subSaharan: 31.9, latinAmerican: 10.5, eastAsian: 4.4, other: 3.1 } },
  Arizona: { label: 'Arizona', foreignOriginShare: 13.2, shares: { european: 53.4, subSaharan: 4.7, latinAmerican: 32.3, eastAsian: 3.5, other: 6.1 } },
  Florida: { label: 'Florida', foreignOriginShare: 21.1, shares: { european: 51.5, subSaharan: 15.1, latinAmerican: 26.8, eastAsian: 3, other: 3.6 } },
  'New York': { label: 'New York', foreignOriginShare: 22.6, shares: { european: 53.6, subSaharan: 14.3, latinAmerican: 19.5, eastAsian: 9.5, other: 3.1 } },
  'New Jersey': { label: 'New Jersey', foreignOriginShare: 23.2, shares: { european: 52.8, subSaharan: 12.4, latinAmerican: 21.6, eastAsian: 10.2, other: 3 } },
  Louisiana: { label: 'Louisiana', foreignOriginShare: 4.4, shares: { european: 55.8, subSaharan: 31.4, latinAmerican: 6.9, eastAsian: 1.9, other: 4 } },
  Mississippi: { label: 'Mississippi', foreignOriginShare: 2.4, shares: { european: 55.4, subSaharan: 36.6, latinAmerican: 3.9, eastAsian: 1.1, other: 3 } },
  Illinois: { label: 'Illinois', foreignOriginShare: 13.9, shares: { european: 58.3, subSaharan: 13.9, latinAmerican: 18.6, eastAsian: 6.2, other: 3 } },
  Alabama: { label: 'Alabama', foreignOriginShare: 3.6, shares: { european: 63.1, subSaharan: 26.4, latinAmerican: 5.6, eastAsian: 1.5, other: 3.4 } },
  Virginia: { label: 'Virginia', foreignOriginShare: 12.6, shares: { european: 58.6, subSaharan: 18.9, latinAmerican: 10.5, eastAsian: 7.2, other: 4.8 } },
  'South Carolina': { label: 'South Carolina', foreignOriginShare: 5.4, shares: { european: 62.4, subSaharan: 25, latinAmerican: 6.9, eastAsian: 1.9, other: 3.8 } },
  Delaware: { label: 'Delaware', foreignOriginShare: 10.4, shares: { european: 58.6, subSaharan: 21.6, latinAmerican: 10.3, eastAsian: 4.3, other: 5.2 } },
  Alaska: { label: 'Alaska', foreignOriginShare: 8.1, shares: { european: 57.5, subSaharan: 3.3, latinAmerican: 7.5, eastAsian: 6.5, other: 25.2 } },
  Connecticut: { label: 'Connecticut', foreignOriginShare: 15.2, shares: { european: 63.3, subSaharan: 11, latinAmerican: 18, eastAsian: 4.9, other: 2.8 } },
  'North Carolina': { label: 'North Carolina', foreignOriginShare: 8.6, shares: { european: 60.5, subSaharan: 21, latinAmerican: 11, eastAsian: 3.4, other: 4.1 } },
  Washington: { label: 'Washington', foreignOriginShare: 15, shares: { european: 65.4, subSaharan: 4.2, latinAmerican: 13.7, eastAsian: 9.9, other: 6.8 } },
  Oklahoma: { label: 'Oklahoma', foreignOriginShare: 6.3, shares: { european: 60.8, subSaharan: 7.3, latinAmerican: 12.2, eastAsian: 2.4, other: 17.3 } },
  Massachusetts: { label: 'Massachusetts', foreignOriginShare: 17.6, shares: { european: 67.6, subSaharan: 7.2, latinAmerican: 12.8, eastAsian: 7.4, other: 5 } },
  Tennessee: { label: 'Tennessee', foreignOriginShare: 5.6, shares: { european: 70.9, subSaharan: 16.6, latinAmerican: 6.9, eastAsian: 2.1, other: 3.5 } },
  Arkansas: { label: 'Arkansas', foreignOriginShare: 5.2, shares: { european: 68.5, subSaharan: 15.1, latinAmerican: 8.5, eastAsian: 1.7, other: 6.2 } },
  Colorado: { label: 'Colorado', foreignOriginShare: 9.8, shares: { european: 66.4, subSaharan: 4, latinAmerican: 22.3, eastAsian: 3.4, other: 3.9 } },
  'Rhode Island': { label: 'Rhode Island', foreignOriginShare: 13.9, shares: { european: 67.9, subSaharan: 6.1, latinAmerican: 17.6, eastAsian: 3.5, other: 4.9 } },
  Michigan: { label: 'Michigan', foreignOriginShare: 7, shares: { european: 73.3, subSaharan: 13.6, latinAmerican: 5.7, eastAsian: 3.4, other: 4 } },
  Oregon: { label: 'Oregon', foreignOriginShare: 9.8, shares: { european: 72.5, subSaharan: 2.1, latinAmerican: 14.4, eastAsian: 4.7, other: 6.3 } },
  Pennsylvania: { label: 'Pennsylvania', foreignOriginShare: 7.5, shares: { european: 73.5, subSaharan: 11.2, latinAmerican: 8.6, eastAsian: 3.9, other: 2.8 } },
  Kansas: { label: 'Kansas', foreignOriginShare: 7.4, shares: { european: 71.8, subSaharan: 5.6, latinAmerican: 13, eastAsian: 3.1, other: 6.5 } },
  Minnesota: { label: 'Minnesota', foreignOriginShare: 8.8, shares: { european: 76.3, subSaharan: 7.4, latinAmerican: 6, eastAsian: 5.2, other: 5.1 } },
  Utah: { label: 'Utah', foreignOriginShare: 8.4, shares: { european: 74.7, subSaharan: 1.5, latinAmerican: 15.1, eastAsian: 2.7, other: 6 } },
  Wisconsin: { label: 'Wisconsin', foreignOriginShare: 5.1, shares: { european: 79, subSaharan: 6.3, latinAmerican: 7.6, eastAsian: 3, other: 4.1 } },
  Missouri: { label: 'Missouri', foreignOriginShare: 4.5, shares: { european: 76.9, subSaharan: 11.3, latinAmerican: 4.9, eastAsian: 2.2, other: 4.7 } },
  Nebraska: { label: 'Nebraska', foreignOriginShare: 7.6, shares: { european: 75.9, subSaharan: 5.1, latinAmerican: 12.1, eastAsian: 2.7, other: 4.2 } },
  Indiana: { label: 'Indiana', foreignOriginShare: 5.6, shares: { european: 77.6, subSaharan: 9.4, latinAmerican: 8, eastAsian: 2.6, other: 2.4 } },
  Ohio: { label: 'Ohio', foreignOriginShare: 4.8, shares: { european: 76.9, subSaharan: 12.4, latinAmerican: 4.5, eastAsian: 2.5, other: 3.7 } },
  Idaho: { label: 'Idaho', foreignOriginShare: 5.8, shares: { european: 79.5, subSaharan: 0.9, latinAmerican: 13.3, eastAsian: 1.5, other: 4.8 } },
  Wyoming: { label: 'Wyoming', foreignOriginShare: 3.4, shares: { european: 80.1, subSaharan: 1.1, latinAmerican: 10.6, eastAsian: 1.1, other: 7.1 } },
  Iowa: { label: 'Iowa', foreignOriginShare: 5.7, shares: { european: 82.7, subSaharan: 4.3, latinAmerican: 6.9, eastAsian: 2.7, other: 3.4 } },
  Kentucky: { label: 'Kentucky', foreignOriginShare: 4.1, shares: { european: 82.1, subSaharan: 8.5, latinAmerican: 4.4, eastAsian: 1.7, other: 3.3 } },
  'South Dakota': { label: 'South Dakota', foreignOriginShare: 4.3, shares: { european: 81.1, subSaharan: 2.5, latinAmerican: 4.9, eastAsian: 1.7, other: 9.8 } },
  Montana: { label: 'Montana', foreignOriginShare: 2.4, shares: { european: 84.2, subSaharan: 0.6, latinAmerican: 4.4, eastAsian: 1, other: 9.8 } },
  'North Dakota': { label: 'North Dakota', foreignOriginShare: 4.6, shares: { european: 82.5, subSaharan: 3.8, latinAmerican: 4.6, eastAsian: 1.7, other: 7.4 } },
  'New Hampshire': { label: 'New Hampshire', foreignOriginShare: 6.5, shares: { european: 88.4, subSaharan: 1.9, latinAmerican: 4.4, eastAsian: 3, other: 2.3 } },
  Maine: { label: 'Maine', foreignOriginShare: 3.9, shares: { european: 90.1, subSaharan: 1.9, latinAmerican: 2.1, eastAsian: 1.4, other: 4.5 } },
  Vermont: { label: 'Vermont', foreignOriginShare: 4.7, shares: { european: 89.8, subSaharan: 1.6, latinAmerican: 2.5, eastAsian: 2, other: 4.1 } },
  'West Virginia': { label: 'West Virginia', foreignOriginShare: 1.7, shares: { european: 89.8, subSaharan: 3.7, latinAmerican: 2, eastAsian: 0.9, other: 3.6 } },
};

/**
 * ISO3 -> Natural Earth `region` -> composition.
 *
 * **Currently empty: the ancestry choropleth is switched off for every country.** Germany,
 * France, Italy, the UK, Spain, Sweden and the United States were all deliberately dropped
 * from the overlay. Their region tables are still exported below, so restoring any of them is
 * a one-line change here — and because nothing imports those exports, Rollup tree-shakes them
 * out of the globe chunk while they are unused.
 *
 * `regionAncestryGeoJson()` short-circuits on an empty map, so leaving it empty also skips the
 * ~780 KB `/geo/admin1-regions.json` download entirely.
 */
export const REGION_ANCESTRY_BY_ISO: Readonly<Record<string, Readonly<Record<string, RegionAncestry>>>> = {};

export const ANCESTRY_OVERLAY_ISOS = Object.keys(REGION_ANCESTRY_BY_ISO);

/**
 * The largest non-European group in a region, which is what the choropleth colours by —
 * "European" is the majority nearly everywhere, so shading by it would flatten the map.
 */
export function dominantMinorityGroup(shares: AncestryShares): AncestryGroupId {
  let best: AncestryGroupId = 'other';
  let bestValue = -1;
  for (const group of ANCESTRY_GROUPS) {
    if (group === 'european') continue;
    const value = shares[group] ?? 0;
    if (value > bestValue) {
      bestValue = value;
      best = group;
    }
  }
  return best;
}

/** Total non-European share, used to drive fill intensity. */
export function minorityShareTotal(shares: AncestryShares): number {
  return Math.round((100 - shares.european) * 10) / 10;
}
