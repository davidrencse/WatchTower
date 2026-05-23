export type GermanyIncomeGroupTier = 'quintile' | 'top_subset';

export type GermanyIncomeGroupRow = {
  id: string;
  label: string;
  shortLabel: string;
  tier: GermanyIncomeGroupTier;
  people: number;
  households: number;
  incomeSharePct: number;
  avgNetIncomeEur: number;
  avgNetIncomeDisplay: string;
  migrationBackgroundPct: number;
  menPct: number;
  womenPct: number;
  leftWingPct: number;
  rightWingPct: number;
  color: string;
};

/** Germany income distribution by group (people, households, income share, demographics). */
export const GERMANY_INCOME_DISTRIBUTION_GROUPS: readonly GermanyIncomeGroupRow[] = [
  {
    id: 'bottom-20',
    label: 'Bottom 20%',
    shortLabel: 'Bottom',
    tier: 'quintile',
    people: 16_800_000,
    households: 8_200_000,
    incomeSharePct: 8.2,
    avgNetIncomeEur: 18_500,
    avgNetIncomeDisplay: '€18,500',
    migrationBackgroundPct: 52,
    menPct: 44,
    womenPct: 56,
    leftWingPct: 68,
    rightWingPct: 32,
    color: '#ef4444',
  },
  {
    id: 'lower-middle-20',
    label: 'Lower-Middle 20%',
    shortLabel: 'Lower-Mid',
    tier: 'quintile',
    people: 16_800_000,
    households: 8_200_000,
    incomeSharePct: 12.8,
    avgNetIncomeEur: 29_200,
    avgNetIncomeDisplay: '€29,200',
    migrationBackgroundPct: 41,
    menPct: 47,
    womenPct: 53,
    leftWingPct: 62,
    rightWingPct: 38,
    color: '#f97316',
  },
  {
    id: 'middle-20',
    label: 'Middle 20%',
    shortLabel: 'Middle',
    tier: 'quintile',
    people: 16_800_000,
    households: 8_200_000,
    incomeSharePct: 17.1,
    avgNetIncomeEur: 39_100,
    avgNetIncomeDisplay: '€39,100',
    migrationBackgroundPct: 32,
    menPct: 49,
    womenPct: 51,
    leftWingPct: 55,
    rightWingPct: 45,
    color: '#eab308',
  },
  {
    id: 'upper-middle-20',
    label: 'Upper-Middle 20%',
    shortLabel: 'Upper-Mid',
    tier: 'quintile',
    people: 16_800_000,
    households: 8_200_000,
    incomeSharePct: 23.4,
    avgNetIncomeEur: 53_400,
    avgNetIncomeDisplay: '€53,400',
    migrationBackgroundPct: 24,
    menPct: 52,
    womenPct: 48,
    leftWingPct: 48,
    rightWingPct: 52,
    color: '#84cc16',
  },
  {
    id: 'top-20',
    label: 'Top 20%',
    shortLabel: 'Top 20%',
    tier: 'quintile',
    people: 16_800_000,
    households: 8_200_000,
    incomeSharePct: 38.5,
    avgNetIncomeEur: 88_200,
    avgNetIncomeDisplay: '€88,200',
    migrationBackgroundPct: 18,
    menPct: 55,
    womenPct: 45,
    leftWingPct: 39,
    rightWingPct: 61,
    color: '#22c55e',
  },
  {
    id: 'top-10',
    label: 'Top 10%',
    shortLabel: 'Top 10%',
    tier: 'top_subset',
    people: 8_400_000,
    households: 4_100_000,
    incomeSharePct: 24.8,
    avgNetIncomeEur: 113_500,
    avgNetIncomeDisplay: '€113,500',
    migrationBackgroundPct: 15,
    menPct: 57,
    womenPct: 43,
    leftWingPct: 35,
    rightWingPct: 65,
    color: '#14b8a6',
  },
  {
    id: 'top-1',
    label: 'Top 1%',
    shortLabel: 'Top 1%',
    tier: 'top_subset',
    people: 840_000,
    households: 410_000,
    incomeSharePct: 9.2,
    avgNetIncomeEur: 285_000,
    avgNetIncomeDisplay: '€285,000+',
    migrationBackgroundPct: 12,
    menPct: 62,
    womenPct: 38,
    leftWingPct: 28,
    rightWingPct: 72,
    color: '#a78bfa',
  },
] as const;

export const GERMANY_INCOME_QUINTILES = GERMANY_INCOME_DISTRIBUTION_GROUPS.filter((g) => g.tier === 'quintile');

export function germanyIncomeGroupById(id: string): GermanyIncomeGroupRow {
  return (
    GERMANY_INCOME_DISTRIBUTION_GROUPS.find((g) => g.id === id) ??
    GERMANY_INCOME_DISTRIBUTION_GROUPS[GERMANY_INCOME_DISTRIBUTION_GROUPS.length - 1]!
  );
}

export function formatIncomeCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return n.toLocaleString('en-US');
}

export function formatIncomeEuro(n: number, compact = false): string {
  if (compact && n >= 1000) return `€${Math.round(n / 1000)}k`;
  return `€${n.toLocaleString('en-US')}`;
}

/** UI groups for Labor & Income subsection collapsible count. */
export const GERMANY_INCOME_DISTRIBUTION_GROUP_COUNT = 7;
