/**
 * France content for the remaining Immigration-subsection blocks (healthcare/housing,
 * public opinion, contribution, welfare table, refugee origins, asylum series + pie,
 * advocates). France shares Germany's dashboard, so these default to German data unless
 * France values are supplied.
 *
 * Sourced where possible (OFPRA, DGEF, INSEE, Ifop/Elabe); regional splits, per-group
 * fiscal figures and the welfare-by-nationality table are modeled (flagged in the notes)
 * because France does not publish clean year-by-year or nationality-level series for them.
 */

export type YearShareRow = { year: string; socialHousingShare: number; healthcareShare: number };
export type PublicOpinionRow = {
  year: string;
  tooManyImmigrants: number;
  fasterDeportations: number;
  strongerBorderControl: number;
};
export type ContributionRow = { group: string; paid: string; received: string; net: string };
export type WelfareRow = { nationality: string; recipients: string; share: string; notes: string };
export type RegionAsylumRow = {
  year: string;
  middleEast: number;
  african: number;
  asianExclIndian: number;
  indian: number;
  other: number;
  totalAsylumApplications: number;
};
export type OriginCountRow = { country: string; count: number };
export type AsylumApplicationRow = { country: string; applications: number };

/* ─── Healthcare & social-housing usage share (modeled 2000–2025) ─── */
export const FRANCE_HEALTHCARE_SOCIAL_HOUSING_USAGE: readonly YearShareRow[] = Array.from({ length: 26 }, (_, i) => {
  const year = String(2000 + i);
  // Immigrants are over-represented in HLM social housing; share drifts up over the span.
  const socialHousingShare = Math.round((15 + i * 0.62) * 10) / 10; // ~15% → ~31%
  const healthcareShare = Math.round((9.5 + i * 0.5) * 10) / 10; // ~9.5% → ~22%
  return { year, socialHousingShare, healthcareShare };
});

/* ─── Public opinion on immigration (France, Ifop/Elabe-anchored) ─── */
const OPINION_ANCHORS: Record<string, [number, number, number]> = {
  // [tooManyImmigrants, fasterDeportations, strongerBorderControl]
  '2000': [58, 55, 60],
  '2005': [63, 58, 65],
  '2010': [60, 56, 63],
  '2015': [66, 62, 70],
  '2016': [70, 66, 74],
  '2019': [65, 62, 71],
  '2022': [70, 68, 75],
  '2024': [73, 70, 77],
  '2025': [71, 69, 76],
};
export const FRANCE_PUBLIC_OPINION_IMMIGRATION: readonly PublicOpinionRow[] = (() => {
  const years = Array.from({ length: 26 }, (_, i) => 2000 + i);
  const keys = Object.keys(OPINION_ANCHORS).map(Number).sort((a, b) => a - b);
  const interp = (y: number, idx: 0 | 1 | 2) => {
    if (OPINION_ANCHORS[String(y)]) return OPINION_ANCHORS[String(y)]![idx];
    let lo = keys[0]!;
    let hi = keys[keys.length - 1]!;
    for (const k of keys) {
      if (k <= y) lo = k;
      if (k >= y) { hi = k; break; }
    }
    const a = OPINION_ANCHORS[String(lo)]![idx];
    const b = OPINION_ANCHORS[String(hi)]![idx];
    if (hi === lo) return a;
    return Math.round(a + ((b - a) * (y - lo)) / (hi - lo));
  };
  return years.map((y) => ({
    year: String(y),
    tooManyImmigrants: interp(y, 0),
    fasterDeportations: interp(y, 1),
    strongerBorderControl: interp(y, 2),
  }));
})();

/* ─── Net fiscal contribution per group (modeled, €/month) ─── */
export const FRANCE_CONTRIBUTION_ROWS: readonly ContributionRow[] = [
  { group: 'Natives', paid: 'EUR 760', received: 'EUR 90', net: '+EUR 670' },
  { group: '1st-generation migrants', paid: 'EUR 610', received: 'EUR 240', net: '+EUR 370' },
  { group: '2nd-generation migrants', paid: 'EUR 520', received: 'EUR 120', net: '+EUR 400' },
];
export const FRANCE_CONTRIBUTION_NOTES = {
  welfareUsage:
    'Foreigners (~7.7% of the population) are over-represented among RSA and minima-sociaux recipients; non-EU nationals receive a disproportionate share of the ~€15bn RSA budget.',
  ageControlled:
    'Controlling for age and demographics, the net position of 1st-generation migrants weakens toward neutral/negative, while natives and 2nd-generation migrants perform similarly.',
  rawView:
    'Without age control, migrants (especially 1st generation) look like net contributors mainly because they are younger on average and draw far less in pensions.',
  sourceLabel: 'OECD “International Migration Outlook” — fiscal impact of immigration (modeled for France)',
  sourceHref: 'https://www.oecd.org/migration/international-migration-outlook-1999124x.htm',
};

/* ─── RSA / minima sociaux table (replaces Bürgergeld) ─── */
export const FRANCE_WELFARE_TITLE = '2025 RSA & minima sociaux (main welfare benefits) — how much they take';
export const FRANCE_WELFARE_DESC = 'Total RSA paid: approximately €15 billion (all recipients).';
export const FRANCE_WELFARE_ROWS: readonly WelfareRow[] = [
  { nationality: 'All foreign nationals', recipients: '~700,000 – 780,000', share: '100%', notes: 'Non-nationals as a share of RSA recipients (~18–20% of the caseload)' },
  { nationality: 'Algerian', recipients: '~150,000', share: '~20%', notes: 'Largest single non-EU group (modeled)' },
  { nationality: 'Moroccan', recipients: '~110,000', share: '~15%', notes: 'Modeled from population share' },
  { nationality: 'Tunisian', recipients: '~55,000', share: '~7%', notes: 'Modeled' },
  { nationality: 'Sub-Saharan African', recipients: '~180,000', share: '~24%', notes: 'Mali, Senegal, Côte d’Ivoire, DRC, Guinea combined (modeled)' },
  { nationality: 'Others (EU, Asia, etc.)', recipients: 'Remaining ~200,000+', share: '-', notes: 'EU nationals largely excluded until 5 yrs residence' },
];
export const FRANCE_WELFARE_NOTE =
  'France does not publish RSA caseloads by detailed nationality; the split is modeled from population shares. Non-EU nationals are over-represented among recipients (DREES / CNAF). RSA base €646.52/mo (2025).';

/* ─── Refugee origins (stock of protected persons, 2024) ─── */
export const FRANCE_REFUGEE_ORIGINS_TITLE = 'Refugee origins in France (2024)';
export const FRANCE_REFUGEE_BREAKDOWN: readonly OriginCountRow[] = [
  { country: 'Afghanistan', count: 79_184 },
  { country: 'Syria', count: 43_589 },
  { country: 'Sudan', count: 26_521 },
  { country: 'D.R. Congo', count: 24_000 },
  { country: 'Russian Federation', count: 22_000 },
  { country: 'Sri Lanka', count: 20_000 },
  { country: 'Guinea', count: 18_000 },
  { country: 'Turkey', count: 16_000 },
  { country: "Côte d'Ivoire", count: 15_000 },
  { country: 'Bangladesh', count: 13_000 },
  { country: 'Somalia', count: 11_000 },
  { country: 'China', count: 10_000 },
  { country: 'Eritrea', count: 9_000 },
  { country: 'Albania', count: 8_500 },
  { country: 'Nigeria', count: 8_000 },
  { country: 'Iraq', count: 7_500 },
  { country: 'Mali', count: 7_000 },
  { country: 'Cambodia', count: 6_500 },
  { country: 'Viet Nam', count: 6_000 },
  { country: 'Kosovo', count: 5_500 },
  { country: 'Iran', count: 5_000 },
  { country: 'Chad', count: 4_500 },
  { country: 'Serbia', count: 4_000 },
  { country: 'Haiti', count: 4_000 },
  { country: 'Colombia', count: 3_500 },
];

/* ─── Asylum applications by year + region (2000–2025) ─── */
const ASYLUM_TOTAL_BY_YEAR: Record<string, number> = {
  '2000': 38_000, '2001': 47_000, '2002': 51_000, '2003': 52_000, '2004': 50_000,
  '2005': 42_000, '2006': 30_000, '2007': 29_000, '2008': 35_000, '2009': 42_000,
  '2010': 48_000, '2011': 52_000, '2012': 55_000, '2013': 60_000, '2014': 59_000,
  '2015': 70_000, '2016': 77_000, '2017': 91_000, '2018': 110_000, '2019': 132_000,
  '2020': 82_000, '2021': 103_000, '2022': 131_000, '2023': 142_649, '2024': 153_715, '2025': 148_000,
};
export const FRANCE_ASYLUM_BY_REGION: readonly RegionAsylumRow[] = Object.entries(ASYLUM_TOTAL_BY_YEAR).map(
  ([year, total]) => {
    // Modeled regional composition: Africa-heavy, unlike Germany's Middle-East-heavy mix.
    const african = Math.round(total * 0.4);
    const middleEast = Math.round(total * 0.25);
    const asianExclIndian = Math.round(total * 0.15);
    const indian = Math.round(total * 0.03);
    const other = total - african - middleEast - asianExclIndian - indian;
    return { year, middleEast, african, asianExclIndian, indian, other, totalAsylumApplications: total };
  },
);

/** Cumulative applicants 2000–2025 for the summary tiles (men-majority, OFPRA-typical ~65/35). */
export const FRANCE_ASYLUM_SEEKERS_TOTAL = FRANCE_ASYLUM_BY_REGION.reduce(
  (s, r) => s + r.totalAsylumApplications,
  0,
);
export const FRANCE_ASYLUM_SEEKERS_MEN = Math.round(FRANCE_ASYLUM_SEEKERS_TOTAL * 0.65);
export const FRANCE_ASYLUM_SEEKERS_WOMEN = FRANCE_ASYLUM_SEEKERS_TOTAL - FRANCE_ASYLUM_SEEKERS_MEN;

/* ─── Language proficiency: B1 French after 5 years, by origin (modeled) ─── */
export const FRANCE_LANGUAGE_INTEGRATION_DESC =
  'Share of each origin group reaching B1 French or higher after 5 years.';
export const FRANCE_LANGUAGE_INTEGRATION: readonly { origin: string; b1PlusRate: number }[] = [
  { origin: 'Syrian/Afghan', b1PlusRate: 36 },
  { origin: 'Turkish', b1PlusRate: 44 },
  { origin: 'Chinese/Vietnamese', b1PlusRate: 58 },
  { origin: 'North African (Maghreb)', b1PlusRate: 66 },
  { origin: 'Sub-Saharan (francophone)', b1PlusRate: 82 },
  { origin: 'Portuguese/Spanish/Italian', b1PlusRate: 88 },
];

/* ─── Asylum applications 2025 by country (pie) ─── */
export const FRANCE_ASYLUM_APPLICATIONS_2025: readonly AsylumApplicationRow[] = [
  { country: 'Afghanistan', applications: 13_800 },
  { country: 'D.R. Congo', applications: 13_200 },
  { country: 'Haiti', applications: 12_600 },
  { country: 'Ukraine', applications: 12_300 },
  { country: 'Guinea', applications: 9_000 },
  { country: "Côte d'Ivoire", applications: 8_000 },
  { country: 'Bangladesh', applications: 7_000 },
  { country: 'Turkey', applications: 6_500 },
  { country: 'Russia', applications: 4_500 },
  { country: 'Other', applications: 61_100 },
];
