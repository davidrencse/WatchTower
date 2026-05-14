/** Shared dashboard layout for CountryStatsDashboard (metrics grouping). */

/** Expenditure tiles + pie (nested under Economic → Government spending). */
export const GOVERNMENT_SPENDING_METRICS = [
  'Immigration welfare spending',
  'Lost to Corruption',
  'Foreign Aid',
  'Expenditure breakdown (pie)',
] as const;

/** Population tiles (Germany moves some into Immigration subsection). */
export const POPULATION_SECTION_METRICS = [
  'White (native) population',
  'Foreign Population',
  'Christian population',
  'Muslim population',
  'Jewish population',
  'Foreign students (total)',
  'Foreign students by origin (pie)',
  'How Many on Student Aid',
  'Immigrants',
  'Military-aged males (migrant background)',
  'Median age',
] as const;

/** Shown at top of Germany Immigration (same order as in population elsewhere). */
export const GERMANY_IMMIGRATION_TOP_METRICS = [
  'Immigrants',
  'Foreign students (total)',
  'Foreign students by origin (pie)',
] as const;

const GERMANY_IMMIGRATION_METRICS_SET = new Set<string>(GERMANY_IMMIGRATION_TOP_METRICS);

/** Former standalone “Birth rates” section; nested under Health → Birth rates (Germany). */
export const BIRTH_RATES_SUBSECTION_METRICS_DEU = [
  'Total birth rate',
  'White (native) birth rate',
  'Immigrant birth rate',
  'Migrant background M:F ratio',
  'Births to foreign-born mothers',
  'Infant mortality rate',
  'Child mortality rate',
  'Contraceptive use',
  'Abortion rate',
  'Teen birth rate',
  'Mean age of mothers at childbirth',
  'Childhood overweight and obesity (Germany)',
] as const;

export const BIRTH_RATES_SUBSECTION_METRICS_DEFAULT = [
  'Total birth rate',
  'White (native) birth rate',
  'Immigrant birth rate',
] as const;

export function getPopulationSectionMetrics(iso3: string): string[] {
  if (iso3.toUpperCase() !== 'DEU') return [...POPULATION_SECTION_METRICS];
  return POPULATION_SECTION_METRICS.filter((m) => !GERMANY_IMMIGRATION_METRICS_SET.has(m));
}

export type MetricSubsection = { id: string; title: string; metrics: readonly string[] };
export type CustomSubsection =
  | { id: string; title: string; kind: 'germany_immigration' }
  | { id: string; title: string; kind: 'germany_marriages' }
  | { id: string; title: string; kind: 'germany_labor_income' }
  | { id: string; title: string; kind: 'germany_economic_structural' }
  | { id: string; title: string; kind: 'germany_economic_taxes' }
  | { id: string; title: string; kind: 'germany_economy_trade' }
  | { id: string; title: string; kind: 'germany_health_suppression' }
  | { id: string; title: string; kind: 'germany_lgbt_stats' }
  | { id: string; title: string; kind: 'germany_politics_leftism' }
  | { id: string; title: string; kind: 'germany_politics_rightwing' }
  | { id: string; title: string; kind: 'germany_politics_zionism' }
  | { id: string; title: string; kind: 'germany_abortion_stats' };
export type SubsectionDef = MetricSubsection | CustomSubsection;

export type StatSectionDef = {
  id: string;
  title: string;
  metrics: readonly string[];
  subsections?: readonly SubsectionDef[];
};

export function getStatSections(iso3: string): StatSectionDef[] {
  const isDeu = iso3.toUpperCase() === 'DEU';
  return [
    {
      id: 'economic',
      title: 'Economy',
      metrics: ['GDP', 'GDP per capita', 'Inflation', 'Unemployment', 'Interest', 'Real Median Wage'],
      subsections: [
        {
          id: 'government_spending',
          title: 'Government spending',
          metrics: GOVERNMENT_SPENDING_METRICS,
        },
        ...(isDeu
          ? [
              {
                id: 'labor_income_distribution',
                title: 'Labor & Income Distribution',
                kind: 'germany_labor_income' as const,
              },
              {
                id: 'fiscal_structural_snapshot',
                title: 'Fiscal Snapshot',
                kind: 'germany_economic_structural' as const,
              },
              {
                id: 'germany_taxes',
                title: 'Taxes',
                kind: 'germany_economic_taxes' as const,
              },
              {
                id: 'trade',
                title: 'Trade',
                kind: 'germany_economy_trade' as const,
              },
            ]
          : []),
      ],
    },
    {
      id: 'politics',
      title: 'Politics',
      metrics: [],
      subsections: isDeu
        ? [
            { id: 'leftism', title: 'Leftism', kind: 'germany_politics_leftism' as const },
            { id: 'rightwing', title: 'Right-wing', kind: 'germany_politics_rightwing' as const },
            { id: 'zionism', title: 'Zionism', kind: 'germany_politics_zionism' as const },
          ]
        : undefined,
    },
    {
      id: 'population',
      title: 'Demographics',
      metrics: getPopulationSectionMetrics(iso3),
      subsections: isDeu
        ? [
            { id: 'germany_immigration', title: 'Immigration', kind: 'germany_immigration' as const },
            { id: 'marriages', title: 'Marriages', kind: 'germany_marriages' as const },
          ]
        : undefined,
    },
    {
      id: 'health',
      title: 'Health',
      metrics: [],
      subsections:
        iso3.toUpperCase() === 'DEU'
          ? [
              {
                id: 'birth_rates',
                title: 'Birth rates',
                metrics: [...BIRTH_RATES_SUBSECTION_METRICS_DEU],
              },
              { id: 'suppression', title: 'Tap Water', kind: 'germany_health_suppression' as const },
              { id: 'lgbt', title: 'LGBT', kind: 'germany_lgbt_stats' as const },
              { id: 'abortions', title: 'Abortions', kind: 'germany_abortion_stats' as const },
            ]
          : [
              {
                id: 'birth_rates',
                title: 'Birth rates',
                metrics: [...BIRTH_RATES_SUBSECTION_METRICS_DEFAULT],
              },
            ],
    },
  ];
}
