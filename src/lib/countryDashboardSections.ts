/** Shared dashboard layout for CountryStatsDashboard (metrics grouping). */

/**
 * Every routable country renders the full Germany-derived dashboard layout — ribbon nav, all
 * subsections, and every statistic slot.
 *
 * This used to be a four-country allowlist. It is now unconditional: the layout *is* the template,
 * and provenance is expressed separately by `usesGermanyTemplate` in `lib/countryTemplateStatus`,
 * which drives the red "Data needed" outlines on panels that still show Germany-bundled content.
 * Country datasets override the template wherever they exist; a missing value stays visible as a
 * labeled red placeholder rather than collapsing the section.
 *
 * Kept as a function (rather than inlining `true`) because it names the intent at ~35 call sites
 * and marks exactly which branches assume the rich layout.
 */
export function treatAsGermany(_iso3: string): boolean {
  return true;
}

/** Expenditure tiles (nested under Economic → Government spending). */
export const GOVERNMENT_SPENDING_METRICS = [
  'Immigration welfare spending',
  'Lost to Corruption',
  'Foreign Aid',
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

/** Germany: Birth rates subsection lives under Demographics (see `getStatSections`). */
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

export const BIRTH_RATES_SUBSECTION_METRICS_FRA = [
  'Total birth rate',
  'France-born birth rate',
  'Immigrant birth rate',
  'Migrant background M:F ratio',
  'Births to foreign-born mothers',
  'Infant mortality rate',
  'Child mortality rate',
  'Contraceptive use',
  'Abortion rate',
  'Teen birth rate',
  'Mean age of mothers at childbirth',
  'Childhood overweight and obesity (France)',
] as const;

export const BIRTH_RATES_SUBSECTION_METRICS_ITA = [
  'Total birth rate',
  'Italian-citizen birth rate',
  'Immigrant birth rate',
  'Migrant background M:F ratio',
  'Births to foreign-born mothers',
  'Infant mortality rate',
  'Child mortality rate',
  'Contraceptive use',
  'Abortion rate',
  'Teen birth rate',
  'Mean age of mothers at childbirth',
  'Childhood overweight and obesity (Italy)',
] as const;

export const BIRTH_RATES_SUBSECTION_METRICS_ESP = [
  'Total birth rate',
  'Spain-born birth rate',
  'Immigrant birth rate',
  'Migrant background M:F ratio',
  'Births to foreign-born mothers',
  'Infant mortality rate',
  'Child mortality rate',
  'Contraceptive use',
  'Abortion rate',
  'Teen birth rate',
  'Mean age of mothers at childbirth',
  'Childhood overweight and obesity (Spain)',
] as const;

export const BIRTH_RATES_SUBSECTION_METRICS_DEFAULT = [
  'Total birth rate',
  'White (native) birth rate',
  'Immigrant birth rate',
] as const;

/**
 * Template countries: Germany's full slot list with the Germany-named obesity slot replaced by its
 * country-neutral form (see `asTemplateSlotMetric`). Slots with no country figure still appear —
 * as red "Data needed" tiles.
 */
export const BIRTH_RATES_SUBSECTION_METRICS_TEMPLATE = [
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
  'Childhood overweight and obesity',
] as const;

export function getPopulationSectionMetrics(iso3: string): string[] {
  if (!treatAsGermany(iso3)) return [...POPULATION_SECTION_METRICS];
  return POPULATION_SECTION_METRICS.filter((m) => !GERMANY_IMMIGRATION_METRICS_SET.has(m));
}

export type MetricSubsection = { id: string; title: string; metrics: readonly string[] };
export type CustomSubsection =
  | { id: string; title: string; kind: 'germany_immigration' }
  | { id: string; title: string; kind: 'germany_marriages' }
  | { id: string; title: string; kind: 'germany_sexual_behavior' }
  | { id: string; title: string; kind: 'germany_labor_income' }
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

export function getStatSections(iso3: string, actualIso3 = iso3): StatSectionDef[] {
  const isDeu = treatAsGermany(iso3);
  const upper = iso3.toUpperCase();
  const actualUpper = actualIso3.toUpperCase();
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
        // Labor & Income Distribution renders per-country data for every country
        // (component is generalized + each country has a generated CSV).
        {
          id: 'labor_income_distribution',
          title: 'Labor & Income Distribution',
          kind: 'germany_labor_income' as const,
        },
        // Taxes/Trade use Germany-only bundled data; shown only for Germany/France.
        ...(isDeu
          ? [
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
            {
              id: 'birth_rates',
              title: 'Birth rates',
              metrics:
                actualUpper === 'ITA'
                  ? [...BIRTH_RATES_SUBSECTION_METRICS_ITA]
                  : actualUpper === 'ESP'
                  ? [...BIRTH_RATES_SUBSECTION_METRICS_ESP]
                  : upper === 'FRA'
                  ? [...BIRTH_RATES_SUBSECTION_METRICS_FRA]
                  : upper === 'DEU'
                  ? [...BIRTH_RATES_SUBSECTION_METRICS_DEU]
                  : [...BIRTH_RATES_SUBSECTION_METRICS_TEMPLATE],
            },
            { id: 'sexual_behavior', title: 'Sexual Behavior', kind: 'germany_sexual_behavior' as const },
          ]
        : undefined,
    },
    {
      id: 'health',
      title: 'Health',
      metrics: [],
      subsections:
        treatAsGermany(iso3)
          ? [
              { id: 'suppression', title: 'Tap Water', kind: 'germany_health_suppression' as const },
              { id: 'lgbt', title: 'LGBT', kind: 'germany_lgbt_stats' as const },
              { id: 'abortions', title: 'Abortions', kind: 'germany_abortion_stats' as const },
            ]
          : [
              // LGBT + Abortions render per-country generated data; birth rates from shared metrics.
              { id: 'lgbt', title: 'LGBT', kind: 'germany_lgbt_stats' as const },
              { id: 'abortions', title: 'Abortions', kind: 'germany_abortion_stats' as const },
              {
                id: 'birth_rates',
                title: 'Birth rates',
                metrics: [...BIRTH_RATES_SUBSECTION_METRICS_DEFAULT],
              },
            ],
    },
  ];
}
