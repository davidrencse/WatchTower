import type { GermanyIncomeGroupRow } from './germanyIncomeDistribution';

/**
 * France income distribution by group, measured on *niveau de vie* — equivalised
 * disposable income per consumption unit, the standard INSEE inequality measure.
 *
 * Core figures are real (INSEE "Revenu, niveau de vie et pauvreté" 2022 and
 * "Niveau de vie moyen par décile" 2024):
 *  - Quintile income shares derived from the INSEE per-decile average niveau de
 *    vie (2024, mean €30,900): bottom 20% ≈ 8.4%, top 20% ≈ 38.8% (INSEE reports
 *    8.7% / 38.3% for 2022, S80/S20 ≈ 4.4, Gini ≈ 0.294).
 *  - Average niveau de vie per quintile = mean of the two constituent deciles.
 *  - Top 10% average = D10 average (€76,970) → ≈ 24.9% of total niveau de vie.
 *  - Top 1% niveau de vie threshold (P99) ≈ €121k/UC (INSEE, 2021); average and
 *    share (≈ 6.3%) are estimated on the same equivalised basis.
 * Migration-background, gender and political-lean overlays are estimates grounded
 * in known French gradients (immigrants and single-parent/elderly-women households
 * over-represented in the lower quintiles), not official per-quintile cross-tabs.
 */
export const FRANCE_INCOME_DISTRIBUTION_GROUPS: readonly GermanyIncomeGroupRow[] = [
  {
    id: 'bottom-20',
    label: 'Bottom 20%',
    shortLabel: 'Bottom',
    tier: 'quintile',
    people: 13_720_000,
    households: 6_180_000,
    incomeSharePct: 8.4,
    avgNetIncomeEur: 12_900,
    avgNetIncomeDisplay: '€12,900',
    migrationBackgroundPct: 40,
    menPct: 45,
    womenPct: 55,
    leftWingPct: 60,
    rightWingPct: 40,
    color: '#ef4444',
  },
  {
    id: 'lower-middle-20',
    label: 'Lower-Middle 20%',
    shortLabel: 'Lower-Mid',
    tier: 'quintile',
    people: 13_720_000,
    households: 6_180_000,
    incomeSharePct: 13.5,
    avgNetIncomeEur: 20_900,
    avgNetIncomeDisplay: '€20,900',
    migrationBackgroundPct: 30,
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
    people: 13_720_000,
    households: 6_180_000,
    incomeSharePct: 17.4,
    avgNetIncomeEur: 26_800,
    avgNetIncomeDisplay: '€26,800',
    migrationBackgroundPct: 23,
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
    people: 13_720_000,
    households: 6_180_000,
    incomeSharePct: 21.9,
    avgNetIncomeEur: 33_900,
    avgNetIncomeDisplay: '€33,900',
    migrationBackgroundPct: 18,
    menPct: 51,
    womenPct: 49,
    leftWingPct: 46,
    rightWingPct: 54,
    color: '#84cc16',
  },
  {
    id: 'top-20',
    label: 'Top 20%',
    shortLabel: 'Top 20%',
    tier: 'quintile',
    people: 13_720_000,
    households: 6_180_000,
    incomeSharePct: 38.8,
    avgNetIncomeEur: 60_000,
    avgNetIncomeDisplay: '€60,000',
    migrationBackgroundPct: 14,
    menPct: 54,
    womenPct: 46,
    leftWingPct: 42,
    rightWingPct: 58,
    color: '#22c55e',
  },
  {
    id: 'top-10',
    label: 'Top 10%',
    shortLabel: 'Top 10%',
    tier: 'top_subset',
    people: 6_860_000,
    households: 3_090_000,
    incomeSharePct: 24.9,
    avgNetIncomeEur: 77_000,
    avgNetIncomeDisplay: '€77,000',
    migrationBackgroundPct: 12,
    menPct: 56,
    womenPct: 44,
    leftWingPct: 39,
    rightWingPct: 61,
    color: '#14b8a6',
  },
  {
    id: 'top-1',
    label: 'Top 1%',
    shortLabel: 'Top 1%',
    tier: 'top_subset',
    people: 686_000,
    households: 309_000,
    incomeSharePct: 6.3,
    avgNetIncomeEur: 195_000,
    avgNetIncomeDisplay: '€195,000+',
    migrationBackgroundPct: 10,
    menPct: 61,
    womenPct: 39,
    leftWingPct: 34,
    rightWingPct: 66,
    color: '#a78bfa',
  },
] as const;

export const FRANCE_INCOME_DISTRIBUTION_CAPTION =
  'Seven income groups · ~68.6M people in quintiles (13.7M each) · niveau de vie (equivalised disposable income) share, net income, migration background, gender, and reported political lean.';
