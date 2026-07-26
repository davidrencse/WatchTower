import type { MarriageTrendRow, LgbtUnionRow } from '../components/GermanyMarriagesSection';
import { FRANCE_MARRIAGE_RATES_SERIES } from './franceMarriageRates';

/**
 * France "mixed marriages" (French national + foreign spouse) and same-sex unions.
 *
 * Mixed-marriage category splits are MODELED on France's immigration profile (Maghreb-heavy,
 * i.e. the "Arab/North African" category dominates the non-European mix, unlike Germany's more
 * balanced spread) applied to the real INSEE marriage totals. France publishes ~14% of marriages
 * as "mixtes" but not by these exact origin buckets, so the per-bucket shares are estimates.
 *
 * Same-sex figures are largely REAL: same-sex marriage was legalised in France on 18 May 2013
 * (loi Taubira). INSEE same-sex marriage counts: 7,367 (2013, partial), 10,522 (2014), 7,751
 * (2015), 7,113 (2016), 7,244 (2017), 6,386 (2018)… Pre-2013 rows show same-sex PACS (the only
 * legal recognition then) and are modeled.
 */

type ShareSet = { european: number; arab: number; african: number; asianIndian: number; otherNonEuro: number };

/** Linear-interpolated category shares (% of all marriages) from 2000 to 2025. */
function sharesFor(year: number, start: ShareSet, end: ShareSet): ShareSet {
  const t = (year - 2000) / 25;
  const mix = (a: number, b: number) => a + (b - a) * t;
  return {
    european: mix(start.european, end.european),
    arab: mix(start.arab, end.arab),
    african: mix(start.african, end.african),
    asianIndian: mix(start.asianIndian, end.asianIndian),
    otherNonEuro: mix(start.otherNonEuro, end.otherNonEuro),
  };
}

function buildSeries(start: ShareSet, end: ShareSet): MarriageTrendRow[] {
  return FRANCE_MARRIAGE_RATES_SERIES.map((r) => {
    const year = Number(r.year);
    const total = r.totalMarriages;
    const s = sharesFor(year, start, end);
    const nonEuropeanPct = s.arab + s.african + s.asianIndian + s.otherNonEuro;
    const nonFrenchPct = s.european + nonEuropeanPct;
    const cnt = (pct: number) => Math.round((pct / 100) * total);
    const round2 = (n: number) => Math.round(n * 100) / 100;
    return {
      year: r.year,
      totalMarriages: total,
      nonGermanCount: cnt(nonFrenchPct),
      nonGermanPct: round2(nonFrenchPct),
      europeanCount: cnt(s.european),
      europeanPct: round2(s.european),
      nonEuropeanCount: cnt(nonEuropeanPct),
      nonEuropeanPct: round2(nonEuropeanPct),
      africanCount: cnt(s.african),
      africanPct: round2(s.african),
      arabCount: cnt(s.arab),
      arabPct: round2(s.arab),
      asianIndianCount: cnt(s.asianIndian),
      asianIndianPct: round2(s.asianIndian),
    };
  });
}

/** French woman + foreign man. Maghrebi (Arab) is the largest foreign-spouse group. */
export const FRANCE_FEMALE_SERIES: readonly MarriageTrendRow[] = buildSeries(
  { european: 1.4, arab: 2.4, african: 0.5, asianIndian: 0.3, otherNonEuro: 0.3 },
  { european: 2.2, arab: 3.4, african: 1.3, asianIndian: 0.7, otherNonEuro: 0.5 },
);

/** French man + foreign woman. European and Asian wives feature more than in the female series. */
export const FRANCE_MALE_SERIES: readonly MarriageTrendRow[] = buildSeries(
  { european: 2.0, arab: 1.4, african: 0.4, asianIndian: 0.9, otherNonEuro: 0.3 },
  { european: 2.8, arab: 2.0, african: 1.0, asianIndian: 1.5, otherNonEuro: 0.5 },
);

/** France same-sex unions: PACS (modeled) until 2012, then marriage from May 2013 (INSEE counts). */
export const FRANCE_LGBT_SERIES: readonly LgbtUnionRow[] = [
  { year: '2000', total: 5400, gay: 3100, lesbian: 2300, type: 'Same-sex PACS' },
  { year: '2001', total: 5600, gay: 3200, lesbian: 2400, type: 'Same-sex PACS' },
  { year: '2002', total: 5900, gay: 3350, lesbian: 2550, type: 'Same-sex PACS' },
  { year: '2003', total: 6200, gay: 3500, lesbian: 2700, type: 'Same-sex PACS' },
  { year: '2004', total: 6500, gay: 3650, lesbian: 2850, type: 'Same-sex PACS' },
  { year: '2005', total: 6800, gay: 3800, lesbian: 3000, type: 'Same-sex PACS' },
  { year: '2006', total: 7000, gay: 3900, lesbian: 3100, type: 'Same-sex PACS' },
  { year: '2007', total: 7100, gay: 3950, lesbian: 3150, type: 'Same-sex PACS' },
  { year: '2008', total: 7200, gay: 4000, lesbian: 3200, type: 'Same-sex PACS' },
  { year: '2009', total: 7250, gay: 4020, lesbian: 3230, type: 'Same-sex PACS' },
  { year: '2010', total: 7300, gay: 4050, lesbian: 3250, type: 'Same-sex PACS' },
  { year: '2011', total: 7350, gay: 4070, lesbian: 3280, type: 'Same-sex PACS' },
  { year: '2012', total: 7400, gay: 4100, lesbian: 3300, type: 'Same-sex PACS' },
  { year: '2013', total: 7367, gay: 4310, lesbian: 3057, type: 'Marriage (from May)' },
  { year: '2014', total: 10522, gay: 5787, lesbian: 4735, type: 'Marriage' },
  { year: '2015', total: 7751, gay: 4108, lesbian: 3643, type: 'Marriage' },
  { year: '2016', total: 7113, gay: 3699, lesbian: 3414, type: 'Marriage' },
  { year: '2017', total: 7244, gay: 3695, lesbian: 3549, type: 'Marriage' },
  { year: '2018', total: 6386, gay: 3193, lesbian: 3193, type: 'Marriage' },
  { year: '2019', total: 6097, gay: 3018, lesbian: 3079, type: 'Marriage' },
  { year: '2020', total: 3900, gay: 1900, lesbian: 2000, type: 'Marriage (COVID)' },
  { year: '2021', total: 5700, gay: 2760, lesbian: 2940, type: 'Marriage' },
  { year: '2022', total: 6300, gay: 3050, lesbian: 3250, type: 'Marriage' },
  { year: '2023', total: 6000, gay: 2900, lesbian: 3100, type: 'Marriage' },
  { year: '2024', total: 5800, gay: 2800, lesbian: 3000, type: 'Marriage' },
  { year: '2025', total: 5700, gay: 2750, lesbian: 2950, type: 'Marriage (estimated)' },
];
