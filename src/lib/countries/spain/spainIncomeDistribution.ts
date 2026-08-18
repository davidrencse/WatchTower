import type { GermanyIncomeGroupRow } from '../germany/germanyIncomeDistribution';
import type { IncomeConcentrationIndicators } from '../../../components/countries/germany/GermanyIncomeDistributionSection';

/**
 * Spain income distribution, measured on equivalised disposable income per consumption
 * unit — the standard EU-SILC inequality basis, published for Spain by INE (Encuesta de
 * Condiciones de Vida) and Eurostat.
 *
 * SOURCED (Eurostat EU-SILC, survey year 2025 = income reference year 2024, pulled from
 * the Eurostat dissemination API on 10 Aug 2026):
 *  - `ilc_di01`: quintile shares of national equivalised income — 7.3 / 13.2 / 17.8 /
 *    23.6 / 38.2 %; top decile 22.9 %.
 *  - `ilc_di03`: mean equivalised income €22,943, median €20,367.
 *  - `ilc_di12` Gini 30.8; `ilc_di11` S80/S20 5.24 (7.3 × 5.24 ≈ 38.2 — the shares and
 *    the published ratio reconcile).
 *  - Quintile averages here are derived as `mean × share ÷ 0.20`, not read off a separate
 *    table: Eurostat's `ilc_di01` "TC" column is the quantile's *upper threshold*
 *    (P20 €12,374 · P80 €31,569 · P90 €40,890), not its average.
 *  - `demo_pjan`: population 49,128,297 at 1 Jan 2025. Households: INE Encuesta Continua
 *    de Hogares, 19.44M (2024).
 *
 * ESTIMATED (flagged; Spain publishes no equivalised top-1% series in SILC):
 *  - The top-1% row. Its 6.0% share is an estimate on the equivalised post-transfer basis,
 *    consistent with the top-decile share; World Inequality Database top-1% figures are
 *    much higher because they are pre-tax and per-adult, not equivalised.
 *  - People and households are split evenly at 20% per quintile, as the German and French
 *    tables do. SILC quintiles rank *people*, and low-income households are smaller, so
 *    the true household counts tilt toward the lower quintiles.
 *  - Migration-background, gender and political-lean overlays are estimates grounded in
 *    known Spanish gradients (foreign-born residents are ~18.6% of the population but are
 *    heavily over-represented in the bottom two quintiles, where Eurostat puts the
 *    non-EU-national at-risk-of-poverty rate above 45%). They are not official
 *    per-quintile cross-tabulations.
 */
export const SPAIN_INCOME_DISTRIBUTION_GROUPS: readonly GermanyIncomeGroupRow[] = [
  {
    id: 'bottom-20',
    label: 'Bottom 20%',
    shortLabel: 'Bottom',
    tier: 'quintile',
    people: 9_825_660,
    households: 3_888_540,
    incomeSharePct: 7.3,
    avgNetIncomeEur: 8_374,
    avgNetIncomeDisplay: '€8,374',
    migrationBackgroundPct: 34,
    menPct: 45,
    womenPct: 55,
    leftWingPct: 58,
    rightWingPct: 42,
    color: '#ef4444',
  },
  {
    id: 'lower-middle-20',
    label: 'Lower-Middle 20%',
    shortLabel: 'Lower-Mid',
    tier: 'quintile',
    people: 9_825_660,
    households: 3_888_540,
    incomeSharePct: 13.2,
    avgNetIncomeEur: 15_142,
    avgNetIncomeDisplay: '€15,142',
    migrationBackgroundPct: 24,
    menPct: 47,
    womenPct: 53,
    leftWingPct: 55,
    rightWingPct: 45,
    color: '#f97316',
  },
  {
    id: 'middle-20',
    label: 'Middle 20%',
    shortLabel: 'Middle',
    tier: 'quintile',
    people: 9_825_660,
    households: 3_888_540,
    incomeSharePct: 17.8,
    avgNetIncomeEur: 20_419,
    avgNetIncomeDisplay: '€20,419',
    migrationBackgroundPct: 16,
    menPct: 49,
    womenPct: 51,
    leftWingPct: 50,
    rightWingPct: 50,
    color: '#eab308',
  },
  {
    id: 'upper-middle-20',
    label: 'Upper-Middle 20%',
    shortLabel: 'Upper-Mid',
    tier: 'quintile',
    people: 9_825_660,
    households: 3_888_540,
    incomeSharePct: 23.6,
    avgNetIncomeEur: 27_073,
    avgNetIncomeDisplay: '€27,073',
    migrationBackgroundPct: 12,
    menPct: 51,
    womenPct: 49,
    leftWingPct: 46,
    rightWingPct: 54,
    color: '#22c55e',
  },
  {
    id: 'top-20',
    label: 'Top 20%',
    shortLabel: 'Top 20',
    tier: 'quintile',
    people: 9_825_660,
    households: 3_888_540,
    incomeSharePct: 38.2,
    avgNetIncomeEur: 43_821,
    avgNetIncomeDisplay: '€43,821',
    migrationBackgroundPct: 9,
    menPct: 53,
    womenPct: 47,
    leftWingPct: 40,
    rightWingPct: 60,
    color: '#3b82f6',
  },
  {
    id: 'top-10',
    label: 'Top 10%',
    shortLabel: 'Top 10',
    tier: 'top_subset',
    people: 4_912_830,
    households: 1_944_270,
    incomeSharePct: 22.9,
    avgNetIncomeEur: 52_539,
    avgNetIncomeDisplay: '€52,539',
    migrationBackgroundPct: 8,
    menPct: 55,
    womenPct: 45,
    leftWingPct: 37,
    rightWingPct: 63,
    color: '#8b5cf6',
  },
  {
    id: 'top-1',
    label: 'Top 1%',
    shortLabel: 'Top 1',
    tier: 'top_subset',
    people: 491_283,
    households: 194_427,
    incomeSharePct: 6.0,
    avgNetIncomeEur: 137_658,
    avgNetIncomeDisplay: '€137,658',
    migrationBackgroundPct: 6,
    menPct: 62,
    womenPct: 38,
    leftWingPct: 31,
    rightWingPct: 69,
    color: '#ec4899',
  },
];

export const SPAIN_INCOME_DISTRIBUTION_CAPTION =
  'Equivalised disposable income per consumption unit — Eurostat EU-SILC 2025 (income year 2024). ' +
  'Mean €22,943 · median €20,367 · thresholds P20 €12,374, P80 €31,569, P90 €40,890. Quintile ' +
  'averages are derived from the published income shares (mean × share ÷ 0.20). The top-1% row and ' +
  'the migration/gender/political overlays are estimates, not published cross-tabulations.';

export const SPAIN_INCOME_CONCENTRATION_INDICATORS: IncomeConcentrationIndicators = {
  gini: '30.8',
  s80S20: '5.24',
  period: 'EU-SILC 2025 (income year 2024)',
  sourceLabel: 'Eurostat ilc_di12 / ilc_di11 · INE Encuesta de Condiciones de Vida',
  sourceUrl: 'https://ec.europa.eu/eurostat/databrowser/view/ilc_di12/default/table',
};
