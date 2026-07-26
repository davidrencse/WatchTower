import type {
  MigrantArrivalsRow,
  MigrationBackgroundRow,
} from '../components/GermanyImmigrationSection';
import type {
  DeportationReentryRow,
  DeportationTrendRow,
} from '../components/GermanyMigrantCrimeSection';

/**
 * France immigration time-series (2000–2025) for the Immigration subsection charts.
 *
 * Real anchors (INSEE flux migratoires, DGEF / Ministère de l'Intérieur):
 *  - Annual immigrant entries: ~200k (early 2000s), 307k (2019), 246k (2020, COVID),
 *    283k (2021), 375k (2022, Ukraine peak), ~348k (2023), 313k (2024). 2024 origin:
 *    Africa 144k, Europe 83k, Asia 57k, Americas/Oceania 30k.
 *  - Migration-background population (immigrants + descendants): ~15.3M in 2024
 *    (7.3M + 8.0M, INSEE), ~11.9M in 2008; interpolated across the span.
 *  - Forced removals (éloignements forcés / expulsions): 21,601 in 2024 (+26.7% y/y),
 *    ~17k (2023), COVID trough ~9k (2020), ~19k pre-COVID (2019).
 * Intermediate years and the re-entry series are modeled from these anchors (no single
 * official year-by-year series is published for the full 2000–2025 span).
 */

export const FRANCE_MIGRATION_BACKGROUND_BY_YEAR: readonly MigrationBackgroundRow[] = [
  { year: '2000', migrants: 10_200_000 },
  { year: '2001', migrants: 10_350_000 },
  { year: '2002', migrants: 10_500_000 },
  { year: '2003', migrants: 10_700_000 },
  { year: '2004', migrants: 10_900_000 },
  { year: '2005', migrants: 11_100_000 },
  { year: '2006', migrants: 11_350_000 },
  { year: '2007', migrants: 11_600_000 },
  { year: '2008', migrants: 11_900_000 },
  { year: '2009', migrants: 12_150_000 },
  { year: '2010', migrants: 12_400_000 },
  { year: '2011', migrants: 12_650_000 },
  { year: '2012', migrants: 12_900_000 },
  { year: '2013', migrants: 13_150_000 },
  { year: '2014', migrants: 13_400_000 },
  { year: '2015', migrants: 13_650_000 },
  { year: '2016', migrants: 13_900_000 },
  { year: '2017', migrants: 14_150_000 },
  { year: '2018', migrants: 14_400_000 },
  { year: '2019', migrants: 14_650_000 },
  { year: '2020', migrants: 14_750_000 },
  { year: '2021', migrants: 14_850_000 },
  { year: '2022', migrants: 15_050_000 },
  { year: '2023', migrants: 15_200_000 },
  { year: '2024', migrants: 15_300_000 },
  { year: '2025', migrants: 15_450_000 },
];

const MIGRATION_BACKGROUND_BY_YEAR_MAP = new Map(
  FRANCE_MIGRATION_BACKGROUND_BY_YEAR.map((r) => [r.year, r.migrants]),
);

/** Compact arrivals table: total / Europe-born / Africa-born (thousands). nonEurope = total − Europe. */
const ARRIVALS_COMPACT: readonly { year: string; total: number; europe: number; africa: number }[] = [
  { year: '2000', total: 200, europe: 66, africa: 84 },
  { year: '2001', total: 205, europe: 68, africa: 86 },
  { year: '2002', total: 210, europe: 69, africa: 90 },
  { year: '2003', total: 215, europe: 70, africa: 92 },
  { year: '2004', total: 220, europe: 72, africa: 95 },
  { year: '2005', total: 225, europe: 73, africa: 98 },
  { year: '2006', total: 215, europe: 70, africa: 95 },
  { year: '2007', total: 220, europe: 72, africa: 98 },
  { year: '2008', total: 230, europe: 74, africa: 103 },
  { year: '2009', total: 235, europe: 76, africa: 106 },
  { year: '2010', total: 250, europe: 80, africa: 113 },
  { year: '2011', total: 245, europe: 78, africa: 111 },
  { year: '2012', total: 255, europe: 80, africa: 116 },
  { year: '2013', total: 260, europe: 82, africa: 119 },
  { year: '2014', total: 270, europe: 85, africa: 124 },
  { year: '2015', total: 280, europe: 88, africa: 129 },
  { year: '2016', total: 290, europe: 92, africa: 134 },
  { year: '2017', total: 300, europe: 95, africa: 139 },
  { year: '2018', total: 305, europe: 96, africa: 141 },
  { year: '2019', total: 307, europe: 97, africa: 142 },
  { year: '2020', total: 246, europe: 78, africa: 113 },
  { year: '2021', total: 283, europe: 95, africa: 128 },
  { year: '2022', total: 375, europe: 165, africa: 140 },
  { year: '2023', total: 348, europe: 120, africa: 150 },
  { year: '2024', total: 313, europe: 83, africa: 144 },
  { year: '2025', total: 300, europe: 80, africa: 140 },
];

const fmt = (n: number) => n.toLocaleString('en-US');

export const FRANCE_MIGRANT_ARRIVALS_SERIES: readonly MigrantArrivalsRow[] = ARRIVALS_COMPACT.map((r) => {
  const total = r.total * 1000;
  const europe = r.europe * 1000;
  const nonEurope = total - europe;
  const africa = r.africa * 1000;
  return {
    year: r.year,
    total,
    totalDisplay: fmt(total),
    europe,
    europeDisplay: fmt(europe),
    nonEurope,
    nonEuropeDisplay: `~${fmt(nonEurope)}`,
    africa,
    africaDisplay: `~${fmt(africa)}`,
  };
});

/** Modeled yearly forced removals (thousands of persons). Anchored to DGEF headline years. */
const DEPORTATIONS_YEARLY_COMPACT: readonly { year: string; yearly: number }[] = [
  { year: '2000', yearly: 12_000 },
  { year: '2001', yearly: 13_500 },
  { year: '2002', yearly: 15_000 },
  { year: '2003', yearly: 17_000 },
  { year: '2004', yearly: 19_000 },
  { year: '2005', yearly: 20_000 },
  { year: '2006', yearly: 22_000 },
  { year: '2007', yearly: 23_000 },
  { year: '2008', yearly: 24_000 },
  { year: '2009', yearly: 25_000 },
  { year: '2010', yearly: 25_500 },
  { year: '2011', yearly: 25_000 },
  { year: '2012', yearly: 24_000 },
  { year: '2013', yearly: 22_000 },
  { year: '2014', yearly: 20_000 },
  { year: '2015', yearly: 18_000 },
  { year: '2016', yearly: 17_000 },
  { year: '2017', yearly: 18_500 },
  { year: '2018', yearly: 19_500 },
  { year: '2019', yearly: 19_000 },
  { year: '2020', yearly: 9_100 },
  { year: '2021', yearly: 10_100 },
  { year: '2022', yearly: 15_400 },
  { year: '2023', yearly: 17_050 },
  { year: '2024', yearly: 21_601 },
  { year: '2025', yearly: 23_000 },
];

export const FRANCE_DEPORTATION_TREND_SERIES: readonly DeportationTrendRow[] = (() => {
  let cumulative = 0;
  return DEPORTATIONS_YEARLY_COMPACT.map((r) => {
    cumulative += r.yearly;
    const background = MIGRATION_BACKGROUND_BY_YEAR_MAP.get(r.year) ?? 15_000_000;
    const rate = Math.round((r.yearly / background) * 100_000);
    return {
      year: r.year,
      yearlyDeported: r.yearly,
      yearlyDeportedDisplay: fmt(r.yearly),
      cumulativeDeported: cumulative,
      cumulativeDeportedDisplay: fmt(cumulative),
      deportationRate: rate,
      deportationRateDisplay: String(rate),
    };
  });
})();

/** Modeled re-entry after removal: returned count and share of that year's removals. */
export const FRANCE_DEPORTATION_REENTRY_BY_YEAR: readonly DeportationReentryRow[] = [
  { year: '2000', returnedCount: 1_320, returnPct: 11 },
  { year: '2001', returnedCount: 1_485, returnPct: 11 },
  { year: '2002', returnedCount: 1_650, returnPct: 11 },
  { year: '2003', returnedCount: 1_870, returnPct: 11 },
  { year: '2004', returnedCount: 2_090, returnPct: 11 },
  { year: '2005', returnedCount: 2_200, returnPct: 11 },
  { year: '2006', returnedCount: 2_640, returnPct: 12 },
  { year: '2007', returnedCount: 2_760, returnPct: 12 },
  { year: '2008', returnedCount: 2_880, returnPct: 12 },
  { year: '2009', returnedCount: 3_000, returnPct: 12 },
  { year: '2010', returnedCount: 3_315, returnPct: 13 },
  { year: '2011', returnedCount: 3_250, returnPct: 13 },
  { year: '2012', returnedCount: 3_120, returnPct: 13 },
  { year: '2013', returnedCount: 2_860, returnPct: 13 },
  { year: '2014', returnedCount: 2_800, returnPct: 14 },
  { year: '2015', returnedCount: 2_520, returnPct: 14 },
  { year: '2016', returnedCount: 2_380, returnPct: 14 },
  { year: '2017', returnedCount: 2_775, returnPct: 15 },
  { year: '2018', returnedCount: 2_925, returnPct: 15 },
  { year: '2019', returnedCount: 2_850, returnPct: 15 },
  { year: '2020', returnedCount: 1_183, returnPct: 13 },
  { year: '2021', returnedCount: 1_414, returnPct: 14 },
  { year: '2022', returnedCount: 2_310, returnPct: 15 },
  { year: '2023', returnedCount: 2_728, returnPct: 16 },
  { year: '2024', returnedCount: 3_456, returnPct: 16 },
  { year: '2025', returnedCount: 3_680, returnPct: 16 },
];
