import {
  Fragment,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type ComponentType,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { GERMANY_GOV_SPENDING_EXTRA_CARD_COUNT } from '../lib/govSpendingMeta';
import {
  type GermanyBirthRatesExtraCard,
  GERMANY_GDP_SERIES,
  GERMANY_INFLATION_SERIES,
  GERMANY_BIRTH_RATES_EXTRA_CARDS,
  FRANCE_HEALTH_EXTRA_CARDS,
  FRANCE_HEALTH_BASIC_GROUP_COUNT,
  GERMANY_HEALTH_EXTRAS_ENV_ROW_START_INDEX,
  FRANCE_HEALTH_EXTRAS_ENV_ROW_START_INDEX,
  FRANCE_SUICIDE_RATE_SERIES,
  FRANCE_TESTOSTERONE_MEN_SERIES,
  FRANCE_LGBT_IDENTIFICATION_SERIES,
} from '../lib/countryDashboardSeries';
import {
  MetaLine,
  MetricTile,
  NoteBlock,
  PercentRing,
  SourceLinks,
  STAT_GRID,
  extractLeadingPercent,
  isUnavailable,
} from './statTilePrimitives';
import type { FlagEntry } from '../types/flag';
import type { CountryStatMetric } from '../types/countryStats';
import { collectSourceUrlsFromWideRow, wideRowToStatMetrics } from '../lib/countryStatsMetrics';
import { findCorruptionLostRow, insertLostToCorruptionMetric } from '../lib/corruptionLost';
import { FRANCE_LABOR_MIGRATION_ENFORCEMENT_ROWS } from '../lib/franceLaborMigrationEnforcement';
import { ITALY_LABOR_MIGRATION_ENFORCEMENT_ROWS } from '../lib/italyLaborMigrationEnforcement';
import { FRANCE_LABOR_STATISTICS_ROWS } from '../lib/franceLaborStatistics';
import { ITALY_LABOR_STATISTICS_ROWS } from '../lib/italyLaborStatistics';
import {
  findExpenditureRow,
  metricsFromExpenditureRow,
  metricsGermanyGovernmentSpendingWithoutExpenditureCsv,
} from '../lib/expenditures';
import { findMacroIndicatorsRow, metricsFromMacroIndicatorsRow } from '../lib/macroIndicators';
import {
  fallbackGermanyForeignStudentsMetrics,
  findForeignStudentsRow,
  metricsFromForeignStudentsRow,
  metricsFromGermanyForeignStudentsCsv,
} from '../lib/foreignStudents';
import { metricsFromGermanyBirthHealthCsv } from '../lib/germanyBirthHealthIndicators';
import { metricsFromFranceBirthHealthCsv } from '../lib/franceBirthHealthIndicators';
import { crimeFromMergedRow, proxyFromMergedRow } from '../lib/mergedCountryStats';
import type { CountryWideRow } from '../lib/parseCountriesWideCsv';
import { indexCountriesByIso3, parseCountriesWideCsv } from '../lib/parseCountriesWideCsv';
import { collectCrimeSourceUrls } from '../lib/crimeBoxes';
import { CollapsibleFlagSection } from './CollapsibleFlagSection';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  GermanyNewsRail,
  useCountryNews,
  type GermanyNewsRailSection,
} from './GermanyNewsSidebar';
import { bucketGermanyNewsItems } from '../lib/germanyNews';
import { GERMANY_LABOR_INCOME_GROUP_COUNT } from '../lib/germanyGovernmentPolitics';
import {
  FRANCE_INCOME_DISTRIBUTION_GROUPS,
  FRANCE_INCOME_DISTRIBUTION_CAPTION,
} from '../lib/franceIncomeDistribution';
import {
  ITALY_INCOME_DISTRIBUTION_GROUPS,
  ITALY_INCOME_DISTRIBUTION_CAPTION,
} from '../lib/italyIncomeDistribution';
import { FRANCE_IMMIGRANT_BENEFITS } from '../lib/franceImmigrantBenefits';
import { ITALY_IMMIGRANT_BENEFITS } from '../lib/italyImmigrantBenefits';
import { FRANCE_TRADE } from '../lib/franceTrade';
import { ITALY_GENERAL_TRADE } from '../lib/italyTrade';
import { FRANCE_POLITICS_LEFTISM } from '../lib/francePoliticsLeftism';
import { ITALY_POLITICS_LEFTISM } from '../lib/italyPoliticsLeftism';
import { FRANCE_POLITICS_RIGHTWING } from '../lib/francePoliticsRightWing';
import { FRANCE_MARRIAGE_RATES_SERIES } from '../lib/franceMarriageRates';
import {
  FRANCE_TOTAL_BIRTHS_SERIES,
  FRANCE_BIRTHS_NOTE,
  FRANCE_BIRTHS_SOURCE,
  FRANCE_BIRTHS_BY_RACE_SERIES,
  FRANCE_BIRTHS_BY_RACE_LABELS,
  FRANCE_MIXED_BIRTHS_SERIES,
  FRANCE_MIXED_BIRTHS_LABELS,
} from '../lib/franceBirths';
import {
  ITALY_TOTAL_BIRTHS_SERIES,
  ITALY_BIRTHS_NOTE,
  ITALY_BIRTHS_SOURCE,
  ITALY_BIRTHS_BY_ORIGIN_SERIES,
  ITALY_BIRTHS_BY_ORIGIN_LABELS,
  ITALY_MIXED_BIRTHS_SERIES,
  ITALY_MIXED_BIRTHS_LABELS,
} from '../lib/italyBirths';
import {
  FRANCE_FEMALE_SERIES,
  FRANCE_MALE_SERIES,
  FRANCE_LGBT_SERIES,
} from '../lib/franceMarriageDetail';
import {
  ITALY_MARRIAGE_EUROSTAT_URL,
  ITALY_MARRIAGE_ISTAT_2025_URL,
  ITALY_MARRIAGE_RATES_SERIES,
} from '../lib/italyMarriageRates';
import {
  ITALY_FEMALE_MIXED_MARRIAGE_SERIES,
  ITALY_FEMALE_MIXED_MARRIAGE_TABLE,
  ITALY_MALE_MIXED_MARRIAGE_SERIES,
  ITALY_MALE_MIXED_MARRIAGE_TABLE,
  ITALY_MIXED_MARRIAGES_ISTAT_HISTORY_URL,
  ITALY_MIXED_MARRIAGES_ISTAT_TABLES_URL,
  ITALY_MIXED_MARRIAGES_ISTAT_URL,
} from '../lib/italyMixedMarriages';
import {
  ITALY_LGBT_UNION_SERIES,
  ITALY_LGBT_UNIONS_ISTAT_2024_URL,
  ITALY_LGBT_UNIONS_ISTAT_EARLY_URL,
  ITALY_LGBT_UNIONS_ISTAT_TABLES_URL,
} from '../lib/italyLgbtUnions';
import {
  FRANCE_MIGRATION_BACKGROUND_BY_YEAR,
  FRANCE_MIGRANT_ARRIVALS_SERIES,
  FRANCE_DEPORTATION_TREND_SERIES,
  FRANCE_DEPORTATION_REENTRY_BY_YEAR,
} from '../lib/franceImmigrationSeries';
import { parseGermanyTreemapCsv } from '../lib/germanyImmigrationTreemapData';
import {
  FRANCE_HEALTHCARE_SOCIAL_HOUSING_USAGE,
  FRANCE_PUBLIC_OPINION_IMMIGRATION,
  FRANCE_LANGUAGE_INTEGRATION,
  FRANCE_LANGUAGE_INTEGRATION_DESC,
  FRANCE_CONTRIBUTION_ROWS,
  FRANCE_CONTRIBUTION_NOTES,
  FRANCE_WELFARE_TITLE,
  FRANCE_WELFARE_DESC,
  FRANCE_WELFARE_ROWS,
  FRANCE_WELFARE_NOTE,
  FRANCE_REFUGEE_ORIGINS_TITLE,
  FRANCE_REFUGEE_BREAKDOWN,
  FRANCE_ASYLUM_BY_REGION,
  FRANCE_ASYLUM_SEEKERS_TOTAL,
  FRANCE_ASYLUM_SEEKERS_MEN,
  FRANCE_ASYLUM_SEEKERS_WOMEN,
  FRANCE_ASYLUM_APPLICATIONS_2025,
} from '../lib/franceImmigrationContent';
import {
  FRANCE_ADVOCATES,
  FRANCE_ADVOCATES_HEADING,
  FRANCE_ADVOCATES_INTRO,
  FRANCE_ADVOCATES_COALITION,
} from '../lib/franceImmigrationAdvocates';

/** France immigrant-origin treemap (PopulationPyramid.net / UN DESA 2024), parsed once. */
const FRANCE_IMMIGRATION_TREEMAP_ITEMS = parseGermanyTreemapCsv(franceImmigrationTreemapCsvRaw);
const FRANCE_TREEMAP_NOTE =
  'Immigrant counts by country of birth (foreign-born stock, 2024). Source: PopulationPyramid.net France Immigration Statistics; underlying reference UN DESA International Migrant Stock 2024. Chart scales to the panel width so the full treemap is visible without horizontal scrolling.';
import {
  FRANCE_CORPORATE_TAXES,
  FRANCE_INCOME_BRACKETS,
  FRANCE_OTHER_TAXES,
  FRANCE_SOCIAL_SECURITY,
  FRANCE_VAT_RATES,
} from '../lib/franceTaxes';
import {
  ITALY_CORPORATE_TAXES,
  ITALY_INCOME_BRACKETS,
  ITALY_OTHER_TAXES,
  ITALY_SOCIAL_SECURITY,
  ITALY_VAT_RATES,
} from '../lib/italyTaxes';
import {
  FRANCE_MEDIAN_MONTHLY_NET_INCOME_BY_ETHNIC_GROUP,
  FRANCE_MEDIAN_MONTHLY_NET_INCOME_SERIES,
  FRANCE_MEDIAN_MONTHLY_NET_INCOME_TITLE,
} from '../lib/franceMedianIncomeByEthnicGroup';
import {
  ITALY_AVERAGE_MONTHLY_NET_PAY_BY_CITIZENSHIP,
  ITALY_AVERAGE_MONTHLY_NET_PAY_NOTE,
  ITALY_AVERAGE_MONTHLY_NET_PAY_SERIES,
  ITALY_AVERAGE_MONTHLY_NET_PAY_SOURCE_URL,
  ITALY_AVERAGE_MONTHLY_NET_PAY_TITLE,
} from '../lib/italyMonthlyNetIncomeByCitizenship';
import {
  FRANCE_NET_FISCAL_CONTRIBUTION_BY_ETHNIC_GROUP,
  FRANCE_NET_FISCAL_CONTRIBUTION_SERIES,
  FRANCE_NET_FISCAL_CONTRIBUTION_TITLE,
} from '../lib/franceNetFiscalContributionByEthnicGroup';
import {
  ITALY_NET_FISCAL_CONTRIBUTION_BY_MIGRATION_BACKGROUND,
  ITALY_NET_FISCAL_CONTRIBUTION_NOTE,
  ITALY_NET_FISCAL_CONTRIBUTION_SERIES,
  ITALY_NET_FISCAL_CONTRIBUTION_SOURCE_LABEL,
  ITALY_NET_FISCAL_CONTRIBUTION_SOURCE_URL,
  ITALY_NET_FISCAL_CONTRIBUTION_TITLE,
} from '../lib/italyNetFiscalContributionByMigrationBackground';
import {
  FRANCE_REMITTANCES_OUTFLOW_2025,
  FRANCE_REMITTANCES_OUTFLOW_NOTE,
  FRANCE_REMITTANCES_OUTFLOW_TITLE,
} from '../lib/franceRemittancesOutflow';
import {
  ITALY_REMITTANCES_OUTFLOW_2025,
  ITALY_REMITTANCES_OUTFLOW_NOTE,
  ITALY_REMITTANCES_OUTFLOW_TITLE,
} from '../lib/italyRemittancesOutflow';
import { ITALY_MEN_LEFT_RIGHT_CHART } from '../lib/italyMenPoliticalIdentification';
import { ITALY_ISRAEL_SUPPORT_BY_GENDER_CHART } from '../lib/italyIsraelSupportByGender';
import { ITALY_RUSSIA_UKRAINE_SUPPORT_CHART } from '../lib/italyRussiaUkraineSupport';
import {
  ITALY_RUSSIA_UKRAINE_LEFT_WING_CHART,
  ITALY_RUSSIA_UKRAINE_RIGHT_WING_CHART,
} from '../lib/italyRussiaUkraineSupportByIdeology';
import { ITALY_POLITICS_RIGHT_WING } from '../lib/italyPoliticsRightWing';
import { ITALY_WOMEN_LEFT_RIGHT_CHART } from '../lib/italyWomenPoliticalIdentification';
import {
  GERMANY_ABORTION_SECTION_GROUP_COUNT,
  GERMANY_HEALTH_BASIC_GROUP_COUNT,
  GERMANY_HEALTH_SUPPRESSION_GROUP_COUNT,
  GERMANY_LGBT_SECTION_GROUP_COUNT,
} from '../lib/germanyHealthCsv';
import {
  applyFranceEconomyMetricOverrides,
  applyFranceDemographicsMetricOverrides,
  applyFranceImmigrationMetricOverrides,
  FRANCE_ECONOMIC_STRUCTURAL_GROUP_COUNT,
} from '../lib/franceEconomyStats';
import {
  applyItalyEconomyMetricOverrides,
  ITALY_ECONOMIC_STRUCTURAL_GROUP_COUNT,
} from '../lib/italyEconomyStats';
import { applyItalyDemographicsMetricOverrides } from '../lib/italyDemographicsStats';
import { applyItalyBirthRateMetricOverrides } from '../lib/italyBirthHealthIndicators';
import {
  GERMANY_ECONOMIC_STRUCTURAL_GROUP_COUNT,
  GERMANY_ECONOMIC_TAXES_GROUP_COUNT,
  GERMANY_MARRIAGES_GROUP_COUNT,
  GERMANY_POLITICS_LEFTISM_GROUP_COUNT,
  GERMANY_POLITICS_OVERVIEW_CHART_COUNT,
  GERMANY_POLITICS_RIGHT_WING_GROUP_COUNT,
  GERMANY_POLITICS_ZIONISM_GROUP_COUNT,
  GERMANY_SEXUAL_BEHAVIOR_GROUP_COUNT,
  GERMANY_TRADE_GROUP_COUNT,
} from '../lib/germanySectionCounts';
import germanyForeignStudentsRaw from '../../Assets/Data/countries/Germany/foreign_students.csv?raw';
import francePopulationByAgeCsvRaw from '../../Assets/Data/countries/France/france_2025_population_by_age_and_gender.csv?raw';
import franceImmigrationTreemapCsvRaw from '../../Assets/Data/countries/France/france_immigration_treemap_2024.csv?raw';
import germanyBirthHealthRaw from '../../Assets/Data/countries/Germany/germany_birth_health_indicators.csv?raw';
import franceBirthHealthRaw from '../../Assets/Data/countries/France/france_birth_health_indicators.csv?raw';
import fallbackForeignStudentsRaw from '../../Assets/Data/shared/foreign_student_population_screenshot_countries.csv?raw';
import { CountryPageIndustrialLoader } from './CountryPageIndustrialLoader';
import { CountryPageSectionRibbon } from './CountryPageSectionRibbon';
import { ThemeToggle } from './ThemeToggle';
import { buildCountryRibbonNav } from '../lib/countryRibbonNav';
import { scrollToCountryAnchor } from '../lib/countryRibbonScroll';
import { scheduleIdleTask, type CancelIdleTask } from '../lib/idleTask';
import {
  CountryRibbonExpandProvider,
  useCountryRibbonExpandController,
} from '../context/CountryRibbonExpandContext';
import { useCountryRibbonScrollSpy } from '../hooks/useCountryRibbonScrollSpy';
import {
  getStatSections,
  GERMANY_IMMIGRATION_TOP_METRICS,
  treatAsGermany,
  type CustomSubsection,
  type MetricSubsection,
} from '../lib/countryDashboardSections';
import { militaryProfileFor } from '../data/military';

/**
 * Section components are code-split so the initial dossier shell stays light. On open
 * the dashboard warms section chunks progressively during idle time (see `preloadCountrySections`),
 * and `CollapsibleFlagSection` renders a section's content in full the moment it is
 * expanded — no scroll/visibility gating — so nothing streams in section-by-section.
 * A lightweight sized placeholder holds layout only until the (already-warming) chunk resolves.
 */
/** Every section chunk's import loader, used for progressive idle-time warming. */
const SECTION_PRELOADERS: Array<() => Promise<unknown>> = [];

/** Warm one cached section import per idle period without competing with active scrolling. */
function preloadCountrySections(): () => void {
  const connection = (navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  }).connection;
  if (
    connection?.saveData ||
    connection?.effectiveType === 'slow-2g' ||
    connection?.effectiveType === '2g'
  ) {
    return () => {};
  }

  let cancelled = false;
  let index = 0;
  let cancelIdle: CancelIdleTask | null = null;

  const preloadNext = () => {
    if (cancelled || index >= SECTION_PRELOADERS.length) return;
    const load = SECTION_PRELOADERS[index++];
    void load?.()
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled && index < SECTION_PRELOADERS.length) {
          cancelIdle = scheduleIdleTask(preloadNext, 1200);
        }
      });
  };

  cancelIdle = scheduleIdleTask(preloadNext, 600);
  return () => {
    cancelled = true;
    cancelIdle?.();
  };
}

// React.lazy's current component constraint uses `any`; preserve prop inference at this code-splitting boundary.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lazySection<T extends ComponentType<any>>(
  loader: () => Promise<{ default: T }>,
  minHeight = 240,
) {
  SECTION_PRELOADERS.push(loader);
  const Lazy = lazy(loader);
  return function LazySection(props: ComponentProps<T>) {
    return (
      <Suspense
        fallback={<div aria-hidden className="animate-pulse rounded-md bg-white/[0.02]" style={{ minHeight }} />}
      >
        <Lazy {...(props as ComponentProps<typeof Lazy>)} />
      </Suspense>
    );
  };
}

const GermanyImmigrationSection = lazySection(() =>
  import('./GermanyImmigrationSection').then((m) => ({ default: m.GermanyImmigrationSection })),
);
const ItalyImmigrationSection = lazySection(() =>
  import('./ItalyImmigrationSection').then((m) => ({ default: m.ItalyImmigrationSection })),
);
const GermanyGovernmentSection = lazySection(() =>
  import('./GermanyGovernmentSection').then((m) => ({ default: m.GermanyGovernmentSection })),
);
const FranceGovernmentSection = lazySection(() =>
  import('./government/FranceGovernmentSection').then((m) => ({ default: m.FranceGovernmentSection })),
);
const NationalMilitarySection = lazySection(() =>
  import('./military/NationalMilitarySection').then((m) => ({ default: m.NationalMilitarySection })),
);
const CountryMilitarySection = lazySection(() =>
  import('./military/CountryMilitarySection').then((m) => ({ default: m.CountryMilitarySection })),
);
const GermanyMigrantCrimeSection = lazySection(() =>
  import('./GermanyMigrantCrimeSection').then((m) => ({ default: m.GermanyMigrantCrimeSection })),
);
const GermanyAbortionStatisticsSection = lazySection(() =>
  import('./GermanyAbortionStatisticsSection').then((m) => ({ default: m.GermanyAbortionStatisticsSection })),
);
const GermanyHealthBasicSection = lazySection(() =>
  import('./GermanyHealthBasicSection').then((m) => ({ default: m.GermanyHealthBasicSection })),
);
const GermanyHealthSuppressionSection = lazySection(() =>
  import('./GermanyHealthSuppressionSection').then((m) => ({ default: m.GermanyHealthSuppressionSection })),
);
const FranceTapWaterSection = lazySection(() =>
  import('./FranceTapWaterSection').then((m) => ({ default: m.FranceTapWaterSection })),
);
const FRANCE_TAP_WATER_GROUP_COUNT = 5;
const GermanyLgbtSection = lazySection(() =>
  import('./GermanyLgbtSection').then((m) => ({ default: m.GermanyLgbtSection })),
);
const GermanyPoliticsLeftismSection = lazySection(() =>
  import('./GermanyPoliticsLeftismSection').then((m) => ({ default: m.GermanyPoliticsLeftismSection })),
);
const GermanyPoliticsRightWingSection = lazySection(() =>
  import('./GermanyPoliticsRightWingSection').then((m) => ({ default: m.GermanyPoliticsRightWingSection })),
);
const GermanyPoliticsZionismSection = lazySection(() =>
  import('./GermanyPoliticsZionismSection').then((m) => ({ default: m.GermanyPoliticsZionismSection })),
);
const GermanyPoliticsOverviewCharts = lazySection(() =>
  import('./GermanyPoliticsOverviewCharts').then((m) => ({ default: m.GermanyPoliticsOverviewCharts })),
);
const GermanyLaborIncomeSection = lazySection(() =>
  import('./GermanyLaborIncomeSection').then((m) => ({ default: m.GermanyLaborIncomeSection })),
);
const GermanyEconomicStructuralSection = lazySection(() =>
  import('./GermanyEconomicStructuralSection').then((m) => ({ default: m.GermanyEconomicStructuralSection })),
);
const FranceEconomicStructuralSection = lazySection(() =>
  import('./FranceEconomicStructuralSection').then((m) => ({ default: m.FranceEconomicStructuralSection })),
);
const ItalyEconomicStructuralSection = lazySection(() =>
  import('./ItalyEconomicStructuralSection').then((m) => ({ default: m.ItalyEconomicStructuralSection })),
);
const GermanyEconomicTaxesSection = lazySection(() =>
  import('./GermanyEconomicTaxesSection').then((m) => ({ default: m.GermanyEconomicTaxesSection })),
);
const FranceNetIncomeCalculator = lazySection(() =>
  import('./FranceNetIncomeCalculator').then((m) => ({ default: m.FranceNetIncomeCalculator })),
);
const ItalyNetIncomeCalculator = lazySection(() =>
  import('./ItalyNetIncomeCalculator').then((m) => ({ default: m.ItalyNetIncomeCalculator })),
);
const GermanyTradeSection = lazySection(() =>
  import('./GermanyTradeSection').then((m) => ({ default: m.GermanyTradeSection })),
);
const GermanyPopulationPyramid = lazySection(() =>
  import('./GermanyPopulationPyramid').then((m) => ({ default: m.GermanyPopulationPyramid })),
);
const GermanyDaxCarousel = lazySection(
  () => import('./GermanyDaxCarousel').then((m) => ({ default: m.GermanyDaxCarousel })),
  120,
);
const FranceCac40Carousel = lazySection(
  () => import('./FranceCac40Carousel').then((m) => ({ default: m.FranceCac40Carousel })),
  120,
);
const ItalyFtseMibCarousel = lazySection(
  () => import('./ItalyFtseMibCarousel').then((m) => ({ default: m.ItalyFtseMibCarousel })),
  120,
);
const GermanyMarriagesSection = lazySection(() =>
  import('./GermanyMarriagesSection').then((m) => ({ default: m.GermanyMarriagesSection })),
);
const GermanySexualBehaviorSection = lazySection(() =>
  import('./GermanySexualBehaviorSection').then((m) => ({ default: m.GermanySexualBehaviorSection })),
);
const FranceSexualBehaviorSection = lazySection(() =>
  import('./FranceSexualBehaviorSection').then((m) => ({ default: m.FranceSexualBehaviorSection })),
);
const ItalySexualBehaviorSection = lazySection(() =>
  import('./ItalySexualBehaviorSection').then((m) => ({ default: m.ItalySexualBehaviorSection })),
);

const MERGED_CSV_URL = '/data/centralized_merged_country_stats.csv';
const EXPENDITURES_CSV_URL = '/data/expenditures.csv';
const FOREIGN_STUDENTS_CSV_URL = '/data/foreign_student_population_screenshot_countries.csv';
const FOREIGN_STUDENTS_GERMANY_CSV_URL = '/data/germany_foreign_students.csv';
const GERMANY_BIRTH_HEALTH_CSV_URL = '/data/germany_birth_health_indicators.csv';
const CORRUPTION_LOST_CSV_URL = '/data/corruption_money_lost_modeled_estimates.csv';
const MACRO_INDICATORS_CSV_URL = '/data/countries_latest_inflation_unemployment_interest_with_real_median_wage.csv';

/** Static public CSVs: prefer disk cache on repeat country views. */
const STATIC_FETCH_INIT: RequestInit = { cache: 'force-cache' };


const METRIC_ORDER = [
  'GDP',
  'GDP per capita',
  'Inflation',
  'Unemployment',
  'Interest',
  'Real Median Wage',
  'Immigration welfare spending',
  'Lost to Corruption',
  'Foreign Aid',
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
  'Total birth rate',
  'White (native) birth rate',
  'France-born birth rate',
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
  'Childhood overweight and obesity (Germany)',
  'Childhood overweight and obesity (France)',
  'Childhood overweight and obesity (Italy)',
] as const;

function ChildhoodObesityBirthRatesTile({ row }: { row: CountryStatMetric }) {
  return (
    <article className="flex min-h-[188px] flex-col rounded-md border border-line bg-surface-metric shadow-card p-4 sm:p-5">
      <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
        Childhood overweight and obesity
      </p>
      <div className="mt-3 divide-y divide-white/[0.06]">
        <div className="pb-3">
          <p className="font-sans text-[10px] leading-relaxed text-neutral-400">
            Overweight (incl. obesity) among children aged 7–9
          </p>
          <p className="mt-1.5 font-sans text-sm leading-snug text-neutral-100 sm:text-base">
            25.7% (boys 27.7%, girls 23.3%).
          </p>
        </div>
        <div className="py-3">
          <p className="font-sans text-[10px] leading-relaxed text-neutral-400">Obesity among children aged 7–9</p>
          <p className="mt-1.5 font-sans text-sm leading-snug text-neutral-100 sm:text-base">
            ~11% overall (boys higher at ~13%, girls ~9%).
          </p>
        </div>
        <div className="pt-3">
          <p className="font-sans text-[10px] leading-relaxed text-neutral-400">
            Overweight/obesity among children and adolescents (3–17 years)
          </p>
          <p className="mt-1.5 font-sans text-sm leading-snug text-neutral-100 sm:text-base">
            ~15% overweight, ~6% obese (older national data; rising trend).
          </p>
        </div>
      </div>
      {row.notes.trim() ? (
        <p className="mt-3 border-t border-white/[0.06] pt-3 font-sans text-[10px] leading-relaxed text-neutral-500">
          Source: {row.notes}
        </p>
      ) : null}
    </article>
  );
}

function FranceChildhoodObesityBirthRatesTile({ row }: { row: CountryStatMetric }) {
  const items = [
    ['Overweight (incl. obesity) among children aged 7–9 · 2016', '16.5% (boys 14.4%, girls 18.7%)'],
    ['Obesity among children aged 7–9 · 2016', '4.4% overall (boys 3.2%, girls 5.5%)'],
    ['Overweight (incl. obesity) among grade-9 adolescents · 2017', '18% overall; 5% obese'],
  ] as const;

  return (
    <article className={'flex min-h-[188px] flex-col rounded-md border border-line bg-surface-metric p-4 shadow-card sm:p-5'}>
      <p className={'font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500'}>
        Childhood overweight and obesity
      </p>
      <div className={'mt-3 divide-y divide-white/[0.06]'}>
        {items.map(([label, value], index) => (
          <div key={label} className={index === 0 ? 'pb-3' : index === items.length - 1 ? 'pt-3' : 'py-3'}>
            <p className={'font-sans text-[10px] leading-relaxed text-neutral-400'}>{label}</p>
            <p className={'mt-1.5 font-sans text-sm leading-snug text-neutral-100 sm:text-base'}>{value}</p>
          </div>
        ))}
      </div>
      <div className={'mt-auto border-t border-white/[0.06] pt-3'}>
        <MetaLine row={row} />
        {row.source_url ? (
          <SourceLinks
            url={row.source_url}
            className={'inline-flex w-fit items-center gap-1 font-sans text-[10px] text-[var(--uk-accent)] hover:text-neutral-200'}
          />
        ) : null}
        <NoteBlock text={row.notes} />
      </div>
    </article>
  );
}

function ItalyChildhoodObesityBirthRatesTile({ row }: { row: CountryStatMetric }) {
  const items = [
    ['Overweight among children aged 8–9 · 2023', '19.0%'],
    ['Obesity among children aged 8–9 · 2023', '9.8% (boys 10.3%, girls 9.4%)'],
    ['Severe obesity among children aged 8–9 · 2023', '2.6%'],
  ] as const;

  return (
    <article className="flex min-h-[188px] flex-col rounded-md border border-line bg-surface-metric p-4 shadow-card sm:p-5">
      <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
        Childhood overweight and obesity
      </p>
      <div className="mt-3 divide-y divide-white/[0.06]">
        {items.map(([label, value], index) => (
          <div key={label} className={index === 0 ? 'pb-3' : index === items.length - 1 ? 'pt-3' : 'py-3'}>
            <p className="font-sans text-[10px] leading-relaxed text-neutral-400">{label}</p>
            <p className="mt-1.5 font-sans text-sm leading-snug text-neutral-100 sm:text-base">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-auto border-t border-white/[0.06] pt-3">
        <MetaLine row={row} />
        {row.source_url ? (
          <SourceLinks
            url={row.source_url}
            className="inline-flex w-fit items-center gap-1 font-sans text-[10px] text-[var(--uk-accent)] hover:text-neutral-200"
          />
        ) : null}
        <NoteBlock text={row.notes} />
      </div>
    </article>
  );
}

function ForeignStudentsOriginTile({ row, compact }: { row: CountryStatMetric; compact?: boolean }) {
  let origins: { country: string; count: number | null; sharePct: number | null }[] = [];
  try {
    const parsed = JSON.parse(row.value) as { country: string; count: number | null; sharePct: number | null }[];
    if (Array.isArray(parsed)) origins = parsed.filter((o) => o.country);
  } catch {
    origins = [];
  }
  const palette = ['#d4d4d4', '#a3a3a3', '#737373', '#525252', '#404040', '#262626'];
  const pieValues = origins.map((o) => (o.count && o.count > 0 ? o.count : (o.sharePct ?? 0)));
  const total = pieValues.reduce((a, b) => a + b, 0);
  let acc = 0;
  const stops = pieValues.map((v, i) => {
    const start = total > 0 ? (acc / total) * 100 : 0;
    acc += v;
    const end = total > 0 ? (acc / total) * 100 : 0;
    return `${palette[i % palette.length]} ${start}% ${end}%`;
  });
  const bg = stops.length > 0 ? `conic-gradient(${stops.join(', ')})` : 'none';

  if (compact) {
    return (
      <article className="flex min-h-[148px] flex-col rounded-md border border-line bg-surface-metric shadow-card p-4 sm:p-5">
        <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">{row.metric}</p>
        {origins.length > 0 ? (
          <div className="mt-3 flex min-h-0 flex-1 flex-col gap-2">
            <div
              className="mx-auto h-16 w-16 shrink-0 self-center rounded-full border border-neutral-700 sm:self-start"
              style={{ background: bg }}
            />
            <ul className="scrollbar-none max-h-[7rem] min-h-0 w-full space-y-0.5 overflow-y-auto overflow-x-hidden overscroll-contain pr-0.5">
              {origins.map((o, i) => (
                <li key={o.country} className="break-words font-sans text-[10px] leading-snug text-neutral-300">
                  <span className="mr-1 inline-block h-2 w-2 shrink-0 rounded-sm align-middle" style={{ backgroundColor: palette[i % palette.length] }} />
                  <span className="font-medium">{o.country}</span>
                  {' — '}
                  <span>
                    {o.count != null ? o.count.toLocaleString('en-US') : 'N/A'}
                    {o.sharePct != null ? ` (${o.sharePct.toFixed(2)}%)` : ''}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-3 font-sans text-xs text-neutral-500">No country breakdown available.</p>
        )}
        <MetaLine row={row} />
        <NoteBlock text={row.notes} />
      </article>
    );
  }

  return (
    <article className="rounded-md border border-line bg-surface-metric shadow-card p-4 sm:p-5 lg:col-span-3">
      <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">{row.metric}</p>
      {origins.length > 0 ? (
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="h-28 w-28 rounded-full border border-neutral-700" style={{ background: bg }} />
          <ul className="space-y-2">
            {origins.map((o, i) => (
              <li key={o.country} className="font-sans text-xs text-neutral-300">
                <span className="mr-2 inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: palette[i % palette.length] }} />
                <span className="font-medium">{o.country}</span>
                {' — '}
                <span>
                  {o.count != null ? o.count.toLocaleString('en-US') : 'N/A'}
                  {o.sharePct != null ? ` (${o.sharePct.toFixed(2)}%)` : ''}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-4 font-sans text-sm text-neutral-500">No country breakdown available.</p>
      )}
      <MetaLine row={row} />
      <NoteBlock text={row.notes} />
    </article>
  );
}

/** Body of a metric card (no outer `article`); used inside merged tiles. */
function MetricTileColumn({
  row,
  largeValue,
}: {
  row: CountryStatMetric;
  largeValue?: boolean;
}) {
  const na = isUnavailable(row.value);
  return (
    <>
      <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">{row.metric}</p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p
          className={
            largeValue
              ? `min-w-0 flex-1 font-sans tabular-nums text-xl font-semibold leading-none tracking-tight sm:text-2xl ${na ? 'text-neutral-600' : 'text-neutral-100'}`
              : `min-w-0 flex-1 font-sans tabular-nums text-base font-medium leading-snug sm:text-lg ${na ? 'text-neutral-600' : 'text-neutral-100'}`
          }
        >
          {na ? 'N/A' : row.value}
        </p>
      </div>
      <MetaLine row={row} />
      {row.source_url ? (
        <div className="mt-2">
          <SourceLinks
            url={row.source_url}
            className="inline-flex w-fit items-center gap-1 font-sans text-[10px] text-[var(--uk-accent)] hover:text-neutral-200"
          />
        </div>
      ) : null}
      <NoteBlock text={row.notes} />
    </>
  );
}

function MedianAgeGermanyTile({
  row,
  subtitle = '(one of the oldest populations in Europe)',
}: {
  row: CountryStatMetric;
  subtitle?: string;
}) {
  const na = isUnavailable(row.value);
  return (
    <article className="flex min-h-[148px] flex-col rounded-md border border-line bg-surface-metric shadow-card p-4 sm:p-5">
      <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">{row.metric}</p>
      <p
        className={`mt-4 font-sans tabular-nums text-2xl font-semibold leading-none tracking-tight sm:text-3xl lg:text-4xl ${na ? 'text-neutral-600' : 'text-neutral-100'}`}
      >
        {na ? 'N/A' : row.value}
      </p>
      <p className="mt-2 font-sans text-sm leading-snug text-neutral-400">
        {subtitle}
      </p>
      <MetaLine row={row} />
      {row.source_url ? (
        <div className="mt-2">
          <SourceLinks
            url={row.source_url}
            className="inline-flex w-fit items-center gap-1 font-sans text-[10px] text-[var(--uk-accent)] hover:text-neutral-200"
          />
        </div>
      ) : null}
      <NoteBlock text={row.notes} />
    </article>
  );
}

function ReligionPopulationTriTile({
  christian,
  muslim,
  jewish,
}: {
  christian: CountryStatMetric;
  muslim: CountryStatMetric;
  jewish: CountryStatMetric;
}) {
  const rows = [christian, muslim, jewish];
  return (
    <article className="flex min-h-[148px] flex-col rounded-md border border-line bg-surface-metric shadow-card">
      {rows.map((row, index) => {
        const na = isUnavailable(row.value);
        const cleanedGeography = row.geography_used.replace(/\bGermany\b/gi, '').replace(/\s{2,}/g, ' ').trim();
        const rowMetaParts = [row.reference_period, cleanedGeography].filter(Boolean);
        return (
          <div
            key={row.metric}
            className={`p-4 sm:p-5 ${index > 0 ? 'border-t border-white/[0.06]' : ''}`}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                {row.metric}
              </p>
              <p
                className={`font-sans text-base font-semibold leading-snug sm:text-lg ${
                  na ? 'text-neutral-600' : 'text-neutral-100'
                }`}
              >
                {na ? 'N/A' : row.value}
              </p>
            </div>
            {rowMetaParts.length > 0 ? (
              <p className="mt-3 font-sans text-[10px] leading-relaxed text-neutral-500">{rowMetaParts.join(' · ')}</p>
            ) : null}
            {row.source_url ? (
              <div className="mt-2">
                <SourceLinks
                  url={row.source_url}
                  className="inline-flex w-fit items-center gap-1 font-sans text-[10px] text-[var(--uk-accent)] hover:text-neutral-200"
                />
              </div>
            ) : null}
            <NoteBlock text={row.notes} />
          </div>
        );
      })}
    </article>
  );
}

function StudentAidTileInner({ row }: { row: CountryStatMetric }) {
  const [open, setOpen] = useState(false);
  let totalAid = 0;
  let slices: { country: string; aidCount: number; sharePct: number }[] = [];
  try {
    const parsed = JSON.parse(row.value) as {
      totalAid: number;
      origins: { country: string; aidCount: number; sharePct: number }[];
    };
    totalAid = Number(parsed.totalAid ?? 0);
    slices = Array.isArray(parsed.origins) ? parsed.origins.filter((s) => s.country && s.aidCount > 0) : [];
  } catch {
    totalAid = 0;
    slices = [];
  }
  const palette = ['#d4d4d4', '#a3a3a3', '#737373', '#525252', '#404040', '#262626'];
  const total = slices.reduce((sum, s) => sum + s.aidCount, 0);
  let acc = 0;
  const stops = slices.map((s, i) => {
    const start = total > 0 ? (acc / total) * 100 : 0;
    acc += s.aidCount;
    const end = total > 0 ? (acc / total) * 100 : 0;
    return `${palette[i % palette.length]} ${start}% ${end}%`;
  });
  const bg = stops.length ? `conic-gradient(${stops.join(', ')})` : 'none';

  return (
    <>
      <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">{row.metric}</p>
      <p className="mt-4 font-sans tabular-nums text-2xl font-semibold leading-none tracking-tight text-neutral-100 sm:text-3xl">
        {totalAid.toLocaleString('en-US')}
      </p>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 inline-flex w-fit items-center rounded-md border border-white/[0.1] bg-card px-3 py-1.5 font-sans text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-200 shadow-sm transition hover:border-white/[0.18] hover:bg-card-hover"
      >
        View aid pie chart
      </button>
      <MetaLine row={row} />
      <NoteBlock text={row.notes} />

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-2xl rounded-md border border-line bg-card p-4 shadow-soft ring-1 ring-white/[0.04] sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-sans text-sm font-semibold text-neutral-100">Student Aid Breakdown</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md border border-white/[0.1] bg-surface-metric px-2 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-300 shadow-sm transition hover:border-white/[0.18] hover:bg-card-hover"
              >
                Close
              </button>
            </div>
            {slices.length > 0 ? (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="h-36 w-36 rounded-full border border-neutral-700" style={{ background: bg }} />
                <ul className="scrollbar-none max-h-72 flex-1 space-y-1 overflow-auto pr-1">
                  {slices.map((s, i) => (
                    <li key={s.country} className="flex items-center gap-2 font-sans text-xs text-neutral-300">
                      <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: palette[i % palette.length] }} />
                      <span>{s.country}</span>
                      <span className="text-neutral-500">
                        {s.aidCount.toLocaleString('en-US')} ({s.sharePct.toFixed(2)}%)
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="font-sans text-sm text-neutral-500">No student aid breakdown available.</p>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}

function ForeignStudentsAndStudentAidSplitTile({
  foreign,
  studentAid,
}: {
  foreign: CountryStatMetric;
  studentAid: CountryStatMetric;
}) {
  return (
    <article className="flex min-h-[148px] flex-col rounded-md border border-line bg-surface-metric shadow-card sm:flex-row sm:divide-x sm:divide-white/[0.06]">
      <div className="flex flex-1 flex-col p-4 sm:w-1/2 sm:min-w-0 sm:p-5">
        <MetricTileColumn row={foreign} largeValue />
      </div>
      <div className="flex flex-1 flex-col border-t border-white/[0.06] p-4 sm:w-1/2 sm:min-w-0 sm:border-t-0 sm:p-5">
        <StudentAidTileInner row={studentAid} />
      </div>
    </article>
  );
}

function StudentAidTile({ row }: { row: CountryStatMetric }) {
  return (
    <article className="rounded-md border border-line bg-surface-metric shadow-card p-4 sm:p-5">
      <StudentAidTileInner row={row} />
    </article>
  );
}

function germanyPopulationLeadingTileCount(rows: CountryStatMetric[]): number {
  const byMetric = new Map(rows.map((r) => [r.metric, r]));
  let skip = 0;
  if (
    byMetric.has('Christian population') &&
    byMetric.has('Muslim population') &&
    byMetric.has('Jewish population')
  ) {
    skip += 2;
  }
  if (byMetric.has('Foreign students (total)') && byMetric.has('How Many on Student Aid')) {
    skip += 1;
  }
  return rows.length - skip;
}

function renderGermanyPopulationLeadingTiles(leadingRows: CountryStatMetric[], iso3: string): ReactNode[] {
  const byMetric = new Map(leadingRows.map((r) => [r.metric, r]));
  const skip = new Set<string>();
  const out: ReactNode[] = [];
  for (const row of leadingRows) {
    if (skip.has(row.metric)) continue;
    if (row.metric === 'Christian population') {
      const m = byMetric.get('Muslim population');
      const j = byMetric.get('Jewish population');
      if (m && j) {
        skip.add('Muslim population');
        skip.add('Jewish population');
        out.push(
          <ReligionPopulationTriTile key="religion-tri" christian={row} muslim={m} jewish={j} />,
        );
        continue;
      }
    }
    if (row.metric === 'Foreign students (total)') {
      const aid = byMetric.get('How Many on Student Aid');
      if (aid) {
        skip.add('How Many on Student Aid');
        out.push(
          <ForeignStudentsAndStudentAidSplitTile key="foreign-student-aid" foreign={row} studentAid={aid} />,
        );
        continue;
      }
    }
    if (row.metric === 'Median age') {
      const subtitle =
        iso3.toUpperCase() === 'FRA'
          ? '(younger than most of Western Europe)'
          : '(one of the oldest populations in Europe)';
      out.push(<MedianAgeGermanyTile key={row.metric} row={row} subtitle={subtitle} />);
      continue;
    }
    out.push(<Fragment key={row.metric}>{renderStatTile(row, { iso3 })}</Fragment>);
  }
  return out;
}

function orderMetrics(rows: CountryStatMetric[]): CountryStatMetric[] {
  const byMetric = new Map(rows.map((r) => [r.metric, r]));
  const ordered: CountryStatMetric[] = [];
  for (const m of METRIC_ORDER) {
    const hit = byMetric.get(m);
    if (hit) ordered.push(hit);
  }
  const known = new Set<string>(METRIC_ORDER);
  for (const r of rows) {
    if (!known.has(r.metric)) ordered.push(r);
  }
  return ordered;
}

const GERMANY_IMMIGRATION_TREEMAP_COUNTRIES = 27;
/** Treemap countries + top metric tiles + non-EU arrivals line chart. */
const GERMANY_IMMIGRATION_SUBSECTION_COUNT =
  GERMANY_IMMIGRATION_TREEMAP_COUNTRIES + GERMANY_IMMIGRATION_TOP_METRICS.length + 1;


type RenderStatTileOpts = {
  foreignStudentsPieCompact?: boolean;
  iso3?: string;
  compactBirthRates?: boolean;
  /** Germany government spending subsection: syncs lead tiles with category year selector. */
  govSpendSelectedYear?: number;
};


function GermanyBirthRatesExtraCardTile({ card }: { card: GermanyBirthRatesExtraCard }) {
  return (
    <Card className="flex h-full min-h-[132px] flex-col overflow-hidden border-line bg-surface-metric">
      <CardHeader className="space-y-1 p-3 pb-1.5">
        <CardTitle className="font-sans text-sm font-semibold leading-tight text-neutral-100 uppercase tracking-[0.05em]">
          {card.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-2 p-3 pt-0">
        <p className="font-sans text-xl font-semibold tabular-nums tracking-tight text-white sm:text-2xl">{card.value}</p>
        {card.details ? (
          <p className="font-sans text-[10px] leading-relaxed text-neutral-400 uppercase tracking-[0.03em]">{card.details}</p>
        ) : null}
        {card.source ? (
          <p className="font-sans text-[10px] leading-relaxed text-neutral-500 uppercase tracking-[0.03em]">Source: {card.source}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

function GermanyBirthRatesExtrasGrid() {
  const split = GERMANY_HEALTH_EXTRAS_ENV_ROW_START_INDEX;
  const cardsBeforeEnvRow = GERMANY_BIRTH_RATES_EXTRA_CARDS.slice(0, split);
  const cardsEnvRowAndAfter = GERMANY_BIRTH_RATES_EXTRA_CARDS.slice(split);

  return (
    <div className="col-span-full flex flex-col gap-3">
      <div className="grid grid-cols-1 auto-rows-fr items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cardsBeforeEnvRow.map((card) => (
          <GermanyBirthRatesExtraCardTile key={card.title} card={card} />
        ))}
      </div>
      <div className="grid grid-cols-1 auto-rows-fr items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cardsEnvRowAndAfter.map((card) => (
          <GermanyBirthRatesExtraCardTile key={card.title} card={card} />
        ))}
      </div>
      <GermanySuicideRatesChartTile />
      <GermanyTestosteroneMenChartTile />
      <GermanyLgbtPopulationIdentificationChartTile />
    </div>
  );
}

function FranceHealthExtrasGrid() {
  const split = FRANCE_HEALTH_EXTRAS_ENV_ROW_START_INDEX;
  const cardsBeforeEnvRow = FRANCE_HEALTH_EXTRA_CARDS.slice(0, split);
  const cardsEnvRowAndAfter = FRANCE_HEALTH_EXTRA_CARDS.slice(split);

  return (
    <div className="col-span-full flex flex-col gap-3">
      <div className="grid grid-cols-1 auto-rows-fr items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cardsBeforeEnvRow.map((card) => (
          <GermanyBirthRatesExtraCardTile key={card.title} card={card} />
        ))}
      </div>
      <div className="grid grid-cols-1 auto-rows-fr items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cardsEnvRowAndAfter.map((card) => (
          <GermanyBirthRatesExtraCardTile key={card.title} card={card} />
        ))}
      </div>
      <GermanySuicideRatesChartTile
        series={FRANCE_SUICIDE_RATE_SERIES}
        description="Rate per 100,000 inhabitants (WHO for 2019; 2024–2025 estimated)"
      />
      <GermanyTestosteroneMenChartTile series={FRANCE_TESTOSTERONE_MEN_SERIES} />
      <GermanyLgbtPopulationIdentificationChartTile series={FRANCE_LGBT_IDENTIFICATION_SERIES} />
    </div>
  );
}

/**
 * Recharts-backed tiles live in their own chunk (see statTiles/CountryChartTiles).
 * Loading them lazily keeps the ~118 kB gzip recharts bundle off the country-page
 * critical path; `preloadCountrySections()` still warms the chunk in the background.
 */
const loadCrimeSection = () => import('./CrimeMetricsSection');
const CrimeMetricsSection = lazySection(() =>
  loadCrimeSection().then((m) => ({ default: m.CrimeMetricsSection })), 320,
);
const ItalyTotalRecordedCrimesChart = lazySection(() =>
  loadCrimeSection().then((m) => ({ default: m.ItalyTotalRecordedCrimesChart })), 320,
);
const FranceTotalRecordedCrimesChart = lazySection(() =>
  loadCrimeSection().then((m) => ({ default: m.FranceTotalRecordedCrimesChart })), 320,
);
const GermanyTotalRecordedCrimesChart = lazySection(() =>
  loadCrimeSection().then((m) => ({ default: m.GermanyTotalRecordedCrimesChart })), 320,
);
const GermanyWhiteNativeVictimsChart = lazySection(() =>
  loadCrimeSection().then((m) => ({ default: m.GermanyWhiteNativeVictimsChart })), 320,
);
const loadGovSpending = () => import('./CountryGovSpendingSection');
const GermanyForeignAidYearTile = lazySection(() =>
  loadGovSpending().then((m) => ({ default: m.GermanyForeignAidYearTile })), 200,
);
const GermanyGovernmentSpendingDESection = lazySection(() =>
  loadGovSpending().then((m) => ({ default: m.GermanyGovernmentSpendingDESection })), 320,
);
const GermanyImmigrationWelfareYearTile = lazySection(() =>
  loadGovSpending().then((m) => ({ default: m.GermanyImmigrationWelfareYearTile })), 200,
);
const loadChartTiles = () => import('./statTiles/CountryChartTiles');
const GermanySuicideRatesChartTile = lazySection(() =>
  loadChartTiles().then((m) => ({ default: m.GermanySuicideRatesChartTile })), 320,
);
const GermanyTestosteroneMenChartTile = lazySection(() =>
  loadChartTiles().then((m) => ({ default: m.GermanyTestosteroneMenChartTile })), 320,
);
const GermanyLgbtPopulationIdentificationChartTile = lazySection(() =>
  loadChartTiles().then((m) => ({ default: m.GermanyLgbtPopulationIdentificationChartTile })), 320,
);
const GermanyBirthsLineChartTile = lazySection(() =>
  loadChartTiles().then((m) => ({ default: m.GermanyBirthsLineChartTile })), 320,
);
const GermanyBirthsByRaceChartTile = lazySection(() =>
  loadChartTiles().then((m) => ({ default: m.GermanyBirthsByRaceChartTile })), 320,
);
const GermanyMixedRaceBirthsChartTile = lazySection(() =>
  loadChartTiles().then((m) => ({ default: m.GermanyMixedRaceBirthsChartTile })), 320,
);
const GermanyBirthRatesEducationTile = lazySection(() =>
  loadChartTiles().then((m) => ({ default: m.GermanyBirthRatesEducationTile })), 260,
);
const FranceBirthRatesEducationTile = lazySection(() =>
  loadChartTiles().then((m) => ({ default: m.FranceBirthRatesEducationTile })), 260,
);
const ItalyBirthRatesEducationTile = lazySection(() =>
  loadChartTiles().then((m) => ({ default: m.ItalyBirthRatesEducationTile })), 260,
);
const GermanyHoverSeriesTile = lazySection(() =>
  loadChartTiles().then((m) => ({ default: m.GermanyHoverSeriesTile })), 320,
);
function renderStatTile(row: CountryStatMetric, opts?: RenderStatTileOpts): ReactNode {
  if (
    row.metric === 'Immigration welfare spending' &&
    (opts?.iso3?.toUpperCase() === 'DEU' || opts?.iso3?.toUpperCase() === 'FRA')
  ) {
    return (
      <GermanyImmigrationWelfareYearTile
        selectedYear={opts?.govSpendSelectedYear ?? 2025}
        sourceRow={row}
        iso3={opts.iso3}
      />
    );
  }
  if (row.metric === 'Foreign Aid' && (opts?.iso3?.toUpperCase() === 'DEU' || opts?.iso3?.toUpperCase() === 'FRA')) {
    return (
      <GermanyForeignAidYearTile
        selectedYear={opts?.govSpendSelectedYear ?? 2025}
        sourceRow={row}
        iso3={opts.iso3}
      />
    );
  }
  if (row.metric === 'Childhood overweight and obesity (Germany)' && opts?.iso3?.toUpperCase() === 'DEU') {
    return <ChildhoodObesityBirthRatesTile row={row} />;
  }
  if (row.metric === 'Childhood overweight and obesity (France)' && opts?.iso3?.toUpperCase() === 'FRA') {
    return <FranceChildhoodObesityBirthRatesTile row={row} />;
  }
  if (row.metric === 'Childhood overweight and obesity (Italy)' && opts?.iso3?.toUpperCase() === 'ITA') {
    return <ItalyChildhoodObesityBirthRatesTile row={row} />;
  }
  if (row.metric === 'Foreign students by origin (pie)') {
    return <ForeignStudentsOriginTile row={row} compact={opts?.foreignStudentsPieCompact} />;
  }
  if (row.metric === 'How Many on Student Aid') {
    return <StudentAidTile row={row} />;
  }
  if (row.metric === 'Lost to Corruption') {
    return <MetricTile row={row} largeValue />;
  }
  if (row.metric === 'Foreign Aid') {
    return <MetricTile row={row} largeValue />;
  }
  if (row.metric === 'GDP') {
    if (opts?.iso3?.toUpperCase() === 'DEU') {
      return (
        <GermanyHoverSeriesTile
          row={row}
          accent
          data={GERMANY_GDP_SERIES}
          seriesKey="gdp"
          title="GDP (USD billions)"
          yearRangeLabel="2015–2025"
          yDomain={[3200, 5250]}
          yTicks={[3500, 4000, 4500, 5000]}
          yTickFormatter={(n) => `${(n / 1000).toFixed(1)}T`}
          tooltipFormatter={(v) => `$${v.toLocaleString()}B`}
          minHeightClass="min-h-[240px]"
          footnote="2025 is estimated"
        />
      );
    }
    return <MetricTile row={row} largeValue accent />;
  }
  if (row.metric === 'GDP per capita') {
    if (opts?.iso3?.toUpperCase() === 'DEU') {
      return (
        <GermanyHoverSeriesTile
          row={row}
          data={GERMANY_GDP_SERIES}
          seriesKey="gdpPerCapita"
          title="GDP per capita (USD)"
          yearRangeLabel="2015–2025"
          yDomain={[40000, 62000]}
          yTicks={[42000, 48000, 54000, 60000]}
          yTickFormatter={(n) => `${Math.round(n / 1000)}k`}
          tooltipFormatter={(v) => `$${Math.round(v).toLocaleString()}`}
          minHeightClass="min-h-[240px]"
          footnote="2025 is estimated"
        />
      );
    }
    return <MetricTile row={row} largeValue />;
  }
  if (row.metric === 'Inflation') {
    if (opts?.iso3?.toUpperCase() === 'DEU') {
      return (
        <GermanyHoverSeriesTile
          row={row}
          data={GERMANY_INFLATION_SERIES}
          seriesKey="inflation"
          title="Inflation rate (%)"
          yearRangeLabel="2000–2025"
          yTickFormatter={(n) => `${n.toFixed(1)}%`}
          tooltipFormatter={(v) => `${v.toFixed(2)}%`}
          minHeightClass="min-h-[240px]"
        />
      );
    }
    return <MetricTile row={row} largeValue />;
  }
  if (row.metric === 'Immigrant birth rate') {
    const p = extractLeadingPercent(row.value);
    return (
      <MetricTile
        row={row}
        extra={p !== null ? <PercentRing percent={p} /> : undefined}
        fixedHeightClass={opts?.compactBirthRates ? 'h-[216px]' : undefined}
        clipOverflow={opts?.compactBirthRates}
      />
    );
  }
  if (row.metric === 'White (native) birth rate') {
    const p = extractLeadingPercent(row.value);
    return (
      <MetricTile
        row={row}
        extra={p !== null ? <PercentRing percent={p} /> : undefined}
        fixedHeightClass={opts?.compactBirthRates ? 'h-[216px]' : undefined}
        clipOverflow={opts?.compactBirthRates}
      />
    );
  }
  if (opts?.compactBirthRates && row.metric !== 'Childhood overweight and obesity (Germany)') {
    return <MetricTile row={row} fixedHeightClass="h-[216px]" clipOverflow />;
  }
  return <MetricTile row={row} />;
}

type CountryStatsDashboardProps = {
  flag: FlagEntry;
  iso3: string;
  /** Country identity when iso3 points at another dossier used as a temporary scaffold. */
  actualIso3?: string;
  onBack: () => void;
  /**
    * ISO3 whose data/components drive the Crime → Statistics subsection. Defaults to `iso3`.
    * This can differ from the main dashboard ISO when a country-specific crime source is needed.
   */
  crimeIso3?: string;
};

const DRAGGABLE_TOP_SECTION_ORDER = ['economic', 'politics', 'population', 'health', 'crime', 'government', 'military'] as const;

/** Served URL of a generated per-country dossier CSV (see scripts/generate-country-dossiers.mjs). */
function countryCsvUrl(iso3: string, name: string): string {
  return `/data/${iso3.toLowerCase()}_${name}.csv`;
}

export function CountryStatsDashboard({ flag, iso3, actualIso3, onBack, crimeIso3 }: CountryStatsDashboardProps) {
  const effectiveCountryIso3 = (actualIso3 ?? iso3).toUpperCase();
  const isItalyScaffold = effectiveCountryIso3 === 'ITA';
  // Country driving the Crime → Statistics subsection. Identical to `iso3` by default.
  const effectiveCrimeIso3 = crimeIso3 ?? iso3;
  // Hand-curated military profile (Germany, France, Italy…); null falls back to the generic GFP
  // section. Keyed on the *actual* country so a scaffold (Italy renders France's data `iso3`)
  // still gets its own military section once one exists.
  const militaryProfile = militaryProfileFor(effectiveCountryIso3);
  const [ordered, setOrdered] = useState<CountryStatMetric[] | null>(null);
  const [statsRow, setStatsRow] = useState<CountryWideRow | null>(null);
  const [crimeRow, setCrimeRow] = useState<CountryWideRow | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [iso3]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const upper = iso3.toUpperCase();
        const isDeu = treatAsGermany(iso3);

        const [mergedRes, expendituresRes, corruptionRes, macroIndicatorsRes, foreignStudentsRes] = await Promise.all([
          fetch(MERGED_CSV_URL, STATIC_FETCH_INIT),
          fetch(EXPENDITURES_CSV_URL, STATIC_FETCH_INIT),
          fetch(CORRUPTION_LOST_CSV_URL, STATIC_FETCH_INIT),
          fetch(MACRO_INDICATORS_CSV_URL, STATIC_FETCH_INIT),
          isDeu
            ? Promise.resolve(new Response('', { status: 404 }))
            : fetch(FOREIGN_STUDENTS_CSV_URL, STATIC_FETCH_INIT),
        ]);
        if (!mergedRes.ok) throw new Error(`Could not load merged country data (${mergedRes.status})`);

        const [mergedText, corruptionText, expendituresText, macroText, foreignStudentsMergedText] = await Promise.all([
          mergedRes.text(),
          corruptionRes.ok ? corruptionRes.text() : Promise.resolve(''),
          expendituresRes.ok ? expendituresRes.text() : Promise.resolve(''),
          macroIndicatorsRes.ok ? macroIndicatorsRes.text() : Promise.resolve(''),
          !isDeu && foreignStudentsRes.ok ? foreignStudentsRes.text() : Promise.resolve(''),
        ]);

        const parsedMerged = parseCountriesWideCsv(mergedText);
        const byIso = indexCountriesByIso3(parsedMerged);
        const row = byIso.get(upper);
        if (cancelled) return;
        if (!row) {
          setError(`No statistics row for ISO3 “${iso3}”.`);
          setOrdered(null);
          setStatsRow(null);
          setCrimeRow(null);
          return;
        }

        const countryLabel = row.country || flag.label;

        // Crime → Statistics may use a separate country row when explicitly requested.
        const crimeUpper = effectiveCrimeIso3.toUpperCase();
        const crimeSourceRow = crimeUpper === upper ? row : byIso.get(crimeUpper) ?? row;

        let corruptionRow: CountryWideRow | null = null;
        if (corruptionText) {
          const corruptionRows = parseCountriesWideCsv(corruptionText);
          corruptionRow = findCorruptionLostRow(corruptionRows, countryLabel);
        }

        let expenditureMetrics: CountryStatMetric[] = [];
        if (expendituresRes.ok && expendituresText.trim()) {
          const expendituresRows = parseCountriesWideCsv(expendituresText);
          const eRow = findExpenditureRow(expendituresRows, row.country || flag.label);
          if (isDeu) {
            if (eRow) {
              expenditureMetrics = metricsFromExpenditureRow(eRow, upper, corruptionRow);
            } else {
              expenditureMetrics = metricsGermanyGovernmentSpendingWithoutExpenditureCsv(corruptionRow, countryLabel);
            }
          } else if (eRow) {
            expenditureMetrics = metricsFromExpenditureRow(eRow, upper, corruptionRow);
          }
        } else if (isDeu) {
          expenditureMetrics = metricsGermanyGovernmentSpendingWithoutExpenditureCsv(corruptionRow, countryLabel);
        }
        insertLostToCorruptionMetric(expenditureMetrics, corruptionRow, countryLabel, upper);

        let macroMetrics: CountryStatMetric[] = metricsFromMacroIndicatorsRow(null, countryLabel);
        if (macroIndicatorsRes.ok && macroText.trim()) {
          const macroRows = parseCountriesWideCsv(macroText);
          const macroRow = findMacroIndicatorsRow(macroRows, countryLabel);
          macroMetrics = metricsFromMacroIndicatorsRow(macroRow, countryLabel);
        }

        let foreignStudentMetrics: CountryStatMetric[] = [];
        if (isDeu) {
          const isFra = upper === 'FRA';
          // France reuses Germany's dashboard layout, but must not fetch Germany's national CSVs.
          // Its foreign-student tiles are built from the bundled Germany raw purely to establish the
          // correctly-ordered metric slots, then every value is overwritten by
          // applyFranceImmigrationMetricOverrides; its birth-health comes from France's own data.
          const [deTextRaw, bhTextRaw] = isFra
            ? ['', '']
            : await Promise.all([
                fetch(FOREIGN_STUDENTS_GERMANY_CSV_URL, STATIC_FETCH_INIT).then((r) => (r.ok ? r.text() : '')),
                fetch(GERMANY_BIRTH_HEALTH_CSV_URL, STATIC_FETCH_INIT)
                  .then((r) => (r.ok ? r.text() : ''))
                  .catch(() => ''),
              ]);
          let deText = deTextRaw;
          if (!deText.trim()) deText = germanyForeignStudentsRaw;
          foreignStudentMetrics = metricsFromGermanyForeignStudentsCsv(deText);
          if (foreignStudentMetrics.length === 0) {
            foreignStudentMetrics = fallbackGermanyForeignStudentsMetrics();
          }
          let bhText = bhTextRaw;
          if (!bhText.trim()) bhText = germanyBirthHealthRaw;
          const birthHealthMetrics = isFra
            ? metricsFromFranceBirthHealthCsv(franceBirthHealthRaw)
            : metricsFromGermanyBirthHealthCsv(bhText);

          if (cancelled) return;
          const proxy = proxyFromMergedRow(row);
          setStatsRow(row);
          setCrimeRow(crimeFromMergedRow(crimeSourceRow));
          setOrdered(
            orderMetrics([
              ...wideRowToStatMetrics(row, upper, proxy),
              ...macroMetrics,
              ...expenditureMetrics,
              ...foreignStudentMetrics,
              ...birthHealthMetrics,
            ]),
          );
          setError(null);
          return;
        }

        let fsText = foreignStudentsMergedText;
        if (!fsText.trim()) fsText = fallbackForeignStudentsRaw;
        const fsRows = parseCountriesWideCsv(fsText);
        const fsRow = findForeignStudentsRow(fsRows, row.country || flag.label);
        if (fsRow) foreignStudentMetrics = metricsFromForeignStudentsRow(fsRow);

        const birthHealthMetrics: CountryStatMetric[] = [];

        if (cancelled) return;
        const proxy = proxyFromMergedRow(row);
        setStatsRow(row);
        setCrimeRow(crimeFromMergedRow(crimeSourceRow));
        setOrdered(
          orderMetrics([
            ...wideRowToStatMetrics(row, upper, proxy),
            ...macroMetrics,
            ...expenditureMetrics,
            ...foreignStudentMetrics,
            ...birthHealthMetrics,
          ]),
        );
        setError(null);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load data.');
          setOrdered(null);
          setStatsRow(null);
          setCrimeRow(null);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [iso3, effectiveCrimeIso3, flag.label]);

  const displayOrdered = useMemo(() => {
    if (!ordered) return null;
    if (iso3.toUpperCase() === 'FRA') {
      const economyMetrics = isItalyScaffold
        ? applyItalyEconomyMetricOverrides(ordered)
        : applyFranceEconomyMetricOverrides(ordered);
      if (isItalyScaffold) {
        return applyItalyBirthRateMetricOverrides(
          applyItalyDemographicsMetricOverrides(economyMetrics),
        );
      }
      return applyFranceImmigrationMetricOverrides(
        applyFranceDemographicsMetricOverrides(economyMetrics),
      );
    }
    return ordered;
  }, [ordered, iso3, isItalyScaffold]);

  const sources = useMemo(() => {
    if (!displayOrdered) return [];
    const map = new Map<string, { name: string; url: string; date: string }>();
    for (const r of displayOrdered) {
      const urls = r.source_url
        .split('|')
        .map((s) => s.trim())
        .filter(Boolean);
      for (const u of urls) {
        if (map.has(u)) continue;
        let name = r.source_name.trim();
        if (!name) {
          try {
            name = new URL(u).hostname.replace(/^www\./, '');
          } catch {
            name = 'Source';
          }
        }
        map.set(u, {
          name,
          url: u,
          date: r.source_publication_or_access_date.trim(),
        });
      }
    }
    if (statsRow) {
      for (const c of collectSourceUrlsFromWideRow(statsRow)) {
        if (map.has(c.url)) continue;
        map.set(c.url, { name: c.label, url: c.url, date: '' });
      }
    }
    for (const c of collectCrimeSourceUrls(crimeRow)) {
      if (map.has(c.url)) continue;
      map.set(c.url, { name: c.label, url: c.url, date: '' });
    }
    return [...map.values()];
  }, [displayOrdered, statsRow, crimeRow]);

  const displayTitle = flag.label.toUpperCase();

  const metricsByName = useMemo(() => {
    if (!displayOrdered) return new Map<string, CountryStatMetric>();
    return new Map(displayOrdered.map((r) => [r.metric, r]));
  }, [displayOrdered]);

  const statSections = useMemo(
    () => getStatSections(iso3, effectiveCountryIso3),
    [iso3, effectiveCountryIso3],
  );

  // France shares Germany's rich dashboard structure, but country identity still controls
  // bundled news and genuinely Germany-only chrome such as the DAX carousel.
  const isGermany = iso3.toUpperCase() === 'DEU';
  const [sectionOrder, setSectionOrder] = useState<string[]>([...DRAGGABLE_TOP_SECTION_ORDER]);
  const [allExpanded, setAllExpanded] = useState(false);
  const [collapseSignal, setCollapseSignal] = useState(1);
  const crimeCollapseSignal = collapseSignal;
  const [expandSignal, setExpandSignal] = useState(0);
  const [ribbonActiveMainId, setRibbonActiveMainId] = useState<string | null>(null);
  const ribbonScrollSpyQuietUntilRef = useRef(0);
  const [ribbonBubbleMainId, setRibbonBubbleMainId] = useState<string | null>(null);
  const [ribbonPressedSubAnchorByMain, setRibbonPressedSubAnchorByMain] = useState<Record<string, string>>({});
  const ribbonExpand = useCountryRibbonExpandController();

  // Warm section chunks progressively while the browser is idle. Opening a section still
  // starts its lazy import immediately if background warming has not reached it yet.
  useEffect(() => {
    return preloadCountrySections();
  }, []);

  // Key the news rails on the *actual* country so a scaffold (Italy renders France's data `iso3`)
  // still loads its own /data/<iso3>_news.csv.
  const germanyNewsItems = useCountryNews(
    isGermany,
    isGermany ? null : countryCsvUrl(effectiveCountryIso3, 'news'),
  );
  const { germanyLeftNewsSections, germanyRightNewsSections } = useMemo(() => {
    const b = bucketGermanyNewsItems(germanyNewsItems);
    const left: GermanyNewsRailSection[] = [
      { heading: 'Economy', items: b.economy },
      { heading: 'Immigration', items: b.immigration },
    ];
    const right: GermanyNewsRailSection[] = [
      { heading: 'Crime', items: b.crime },
      { heading: 'Health', items: b.health },
    ];
    return { germanyLeftNewsSections: left, germanyRightNewsSections: right };
  }, [germanyNewsItems]);
  const germanyLeftRailVisible = germanyLeftNewsSections.some((s) => s.items.length > 0);
  const germanyRightRailVisible = germanyRightNewsSections.some((s) => s.items.length > 0);

  const ribbonNav = useMemo(
    () => buildCountryRibbonNav(iso3, effectiveCountryIso3),
    [iso3, effectiveCountryIso3],
  );
  const ribbonNavById = useMemo(() => new Map(ribbonNav.map((n) => [n.id, n])), [ribbonNav]);

  const dismissRibbonBubble = useCallback(() => {
    setRibbonBubbleMainId(null);
  }, []);

  const navigateFromRibbon = useCallback(
    (mainSectionId: string, subsectionAnchorId?: string) => {
      const entry = ribbonNavById.get(mainSectionId);
      if (!entry) return;

      if (subsectionAnchorId) {
        setRibbonPressedSubAnchorByMain((prev) => {
          if (prev[mainSectionId] === subsectionAnchorId) return prev;
          return { ...prev, [mainSectionId]: subsectionAnchorId };
        });
      } else {
        setRibbonPressedSubAnchorByMain((prev) => {
          if (!(mainSectionId in prev)) return prev;
          const next = { ...prev };
          delete next[mainSectionId];
          return next;
        });
      }

      const keys: string[] = [`main:${mainSectionId}`];
      if (subsectionAnchorId) {
        const sub = entry.subsections.find((s) => s.anchorId === subsectionAnchorId);
        if (sub) keys.push(`sub:${mainSectionId}:${sub.id}`);
      }
      ribbonExpand.expand(keys);

      ribbonScrollSpyQuietUntilRef.current = performance.now() + 320;

      scrollToCountryAnchor(subsectionAnchorId ?? entry.anchorId);
    },
    [ribbonNavById, ribbonExpand],
  );

  const handleRibbonMainClick = useCallback(
    (id: string) => {
      const entry = ribbonNavById.get(id);
      const hasSubs = Boolean(entry && entry.subsections.length > 0);

      if (ribbonActiveMainId === id) {
        if (hasSubs) {
          setRibbonBubbleMainId((b) => (b === id ? null : id));
        }
        return;
      }
      setRibbonActiveMainId(id);
      setRibbonBubbleMainId(hasSubs ? id : null);
      navigateFromRibbon(id);
    },
    [ribbonActiveMainId, navigateFromRibbon, ribbonNavById],
  );

  const handleRibbonSubClick = useCallback(
    (mainId: string, subsectionAnchorId: string) => {
      setRibbonActiveMainId(mainId);
      setRibbonBubbleMainId(null);
      navigateFromRibbon(mainId, subsectionAnchorId);
    },
    [navigateFromRibbon],
  );

  const ribbonNavOpen = ordered && ordered.length > 0;
  useCountryRibbonScrollSpy(
    Boolean(ribbonNavOpen),
    ribbonNav,
    setRibbonActiveMainId,
    ribbonScrollSpyQuietUntilRef,
  );

  function sectionOrderIndex(id: string): number {
    const i = sectionOrder.indexOf(id);
    return i === -1 ? 999 : i;
  }

  function moveSection(id: string, direction: 'up' | 'down') {
    const active = [...statSections.map((s) => s.id), 'crime', 'government', 'military'];
    setSectionOrder((prev) => {
      const orderedActive = active
        .map((sid) => ({ sid, idx: prev.indexOf(sid) }))
        .filter((x) => x.idx !== -1)
        .sort((a, b) => a.idx - b.idx)
        .map((x) => x.sid);
      const pos = orderedActive.indexOf(id);
      if (pos === -1) return prev;
      const targetPos = direction === 'up' ? pos - 1 : pos + 1;
      if (targetPos < 0 || targetPos >= orderedActive.length) return prev;
      const other = orderedActive[targetPos]!;
      const ia = prev.indexOf(id);
      const ib = prev.indexOf(other);
      if (ia === -1 || ib === -1) return prev;
      const next = [...prev];
      [next[ia], next[ib]] = [next[ib]!, next[ia]!];
      return next;
    });
  }

  function sectionControls(id: string) {
    const active = [...statSections.map((s) => s.id), 'crime', 'government', 'military']
      .map((sid) => ({ sid, idx: sectionOrderIndex(sid) }))
      .sort((a, b) => a.idx - b.idx)
      .map((x) => x.sid);
    const pos = active.indexOf(id);
    const disableUp = pos <= 0;
    const disableDown = pos === -1 || pos >= active.length - 1;
    return (
      <span className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => moveSection(id, 'up')}
          disabled={disableUp}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-white/[0.1] bg-card font-sans text-xs text-neutral-200 shadow-sm transition hover:border-white/[0.16] hover:bg-card-hover disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={`Move ${id} section up`}
        >
          ↑
        </button>
        <button
          type="button"
          onClick={() => moveSection(id, 'down')}
          disabled={disableDown}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-white/[0.1] bg-card font-sans text-xs text-neutral-200 shadow-sm transition hover:border-white/[0.16] hover:bg-card-hover disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={`Move ${id} section down`}
        >
          ↓
        </button>
      </span>
    );
  }

  return (
    <CountryRibbonExpandProvider value={ribbonExpand}>
      <div
        className="flex min-h-[100dvh] flex-col bg-surface-app font-sans text-neutral-200 antialiased"
      style={
        {
          '--country-nav-scroll-margin': ribbonBubbleMainId ? '14rem' : '7.5rem',
        } as CSSProperties
      }
    >
      <header className="sticky top-0 z-50 border-b border-line bg-[var(--shell-header)] shadow-header">
        <div className="grid h-16 w-full grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 sm:px-6">
          <button
            type="button"
            onClick={onBack}
            className="-ml-2 flex min-h-11 items-center justify-self-start rounded-md px-2 font-sans text-[11px] uppercase tracking-wider text-neutral-500 transition-colors hover:bg-white/[0.04] hover:text-white"
          >
            ← Back
          </button>
          <div className="justify-self-center text-center">
            <div className="flex items-center justify-center gap-3">
              <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-500">Watch Tower</p>
              <ThemeToggle className="scale-[0.92]" />
            </div>
          </div>
          <div className="flex items-center justify-self-end gap-3">
            <div className="hidden h-10 w-14 rounded-md border border-line bg-black/45 shadow-inset sm:flex sm:items-center sm:justify-center sm:px-2">
              <img src={flag.src} alt="" className="max-h-7 max-w-full object-contain" decoding="async" />
            </div>
            <h1 className="text-right text-sm font-semibold uppercase tracking-[0.12em] text-white sm:text-base">
              {displayTitle}
            </h1>
          </div>
        </div>
      </header>

      {ribbonNavOpen ? (
        <CountryPageSectionRibbon
          nav={ribbonNav}
          activeMainId={ribbonActiveMainId}
          bubbleMainId={ribbonBubbleMainId}
          pressedSubAnchorId={
            ribbonActiveMainId ? ribbonPressedSubAnchorByMain[ribbonActiveMainId] : undefined
          }
          onMainClick={handleRibbonMainClick}
          onSubClick={handleRibbonSubClick}
          onDismissBubble={dismissRibbonBubble}
        />
      ) : null}

      <div className="flex min-h-0 min-w-0 w-full flex-1 gap-0">
        {germanyLeftRailVisible ? (
          <GermanyNewsRail side="left" sections={germanyLeftNewsSections} countryLabel={flag.label} />
        ) : null}
        <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden">
          <div
            className={
              germanyLeftRailVisible || germanyRightRailVisible
                ? [
                    ribbonNavOpen
                      ? 'w-full max-w-none pt-[6.25rem] pb-8 sm:pt-[7rem] sm:pb-10'
                      : 'w-full max-w-none py-8 sm:py-10',
                    germanyLeftRailVisible ? 'pl-2 sm:pl-3 2xl:pl-[13rem]' : 'pl-2 sm:pl-3',
                    germanyRightRailVisible ? 'pr-2 sm:pr-3 2xl:pr-[13rem]' : 'pr-2 sm:pr-3',
                  ].join(' ')
                : ribbonNavOpen
                  ? 'mx-auto w-full max-w-6xl px-4 pt-[6.25rem] pb-8 sm:px-6 sm:pt-[7rem] sm:pb-10'
                  : 'mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10'
            }
          >
        {isGermany ? (
          <div className="mb-8">
            <GermanyDaxCarousel />
          </div>
        ) : null}

        {isItalyScaffold ? (
          <div className={'mb-8'}>
            <ItalyFtseMibCarousel />
          </div>
        ) : iso3.toUpperCase() === 'FRA' ? (
          <div className={'mb-8'}>
            <FranceCac40Carousel />
          </div>
        ) : null}

        {error ? (
          <p className="rounded-md border border-line bg-surface-metric shadow-card p-6 font-sans text-sm text-red-400/90">
            {error}
          </p>
        ) : null}

        {!error && ordered === null ? <CountryPageIndustrialLoader countryLabel={flag.label} /> : null}

        {ordered && ordered.length > 0 ? (
          <>
            {/* Removed top dataset/methodology notes to reduce visual density while preserving behavior. */}

            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (allExpanded) {
                    setCollapseSignal((n) => n + 1);
                    setAllExpanded(false);
                  } else {
                    setExpandSignal((n) => n + 1);
                    setAllExpanded(true);
                  }
                }}
                className="min-h-11 rounded-md border border-white/[0.1] bg-card px-3 py-2 font-sans text-[10px] font-medium uppercase tracking-[0.1em] text-neutral-200 shadow-sm transition hover:border-white/[0.16] hover:bg-card-hover"
              >
                {allExpanded ? 'Collapse all' : 'Expand all'}
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {statSections.map((section) => {
                const leadingRows = section.metrics
                  .map((name) => metricsByName.get(name))
                  .filter((r): r is CountryStatMetric => r != null);

                type NestedBlock =
                  | { type: 'metrics'; sub: MetricSubsection; subRows: CountryStatMetric[] }
                  | { type: 'germany_immigration'; sub: CustomSubsection }
                  | { type: 'germany_marriages'; sub: CustomSubsection }
                  | { type: 'germany_sexual_behavior'; sub: CustomSubsection }
                  | { type: 'germany_labor_income'; sub: CustomSubsection }
                  | { type: 'germany_economic_taxes'; sub: CustomSubsection }
                  | { type: 'germany_economy_trade'; sub: CustomSubsection }
                  | { type: 'germany_health_suppression'; sub: CustomSubsection }
                  | { type: 'germany_lgbt_stats'; sub: CustomSubsection }
                  | { type: 'germany_politics_leftism'; sub: CustomSubsection }
                  | { type: 'germany_politics_rightwing'; sub: CustomSubsection }
                  | { type: 'germany_politics_zionism'; sub: CustomSubsection }
                  | { type: 'germany_abortion_stats'; sub: CustomSubsection };

                const nestedBlocks: NestedBlock[] = [];
                for (const sub of section.subsections ?? []) {
                  if ('kind' in sub && sub.kind === 'germany_immigration') {
                    if (treatAsGermany(iso3)) {
                      nestedBlocks.push({ type: 'germany_immigration', sub });
                    }
                    continue;
                  }
                  if ('kind' in sub && sub.kind === 'germany_marriages') {
                    if (treatAsGermany(iso3)) {
                      nestedBlocks.push({ type: 'germany_marriages', sub });
                    }
                    continue;
                  }
                  if ('kind' in sub && sub.kind === 'germany_sexual_behavior') {
                    if (treatAsGermany(iso3)) {
                      nestedBlocks.push({ type: 'germany_sexual_behavior', sub });
                    }
                    continue;
                  }
                  if ('kind' in sub && sub.kind === 'germany_labor_income') {
                    nestedBlocks.push({ type: 'germany_labor_income', sub });
                    continue;
                  }
                  if ('kind' in sub && sub.kind === 'germany_economic_taxes') {
                    if (treatAsGermany(iso3)) {
                      nestedBlocks.push({ type: 'germany_economic_taxes', sub });
                    }
                    continue;
                  }
                  if ('kind' in sub && sub.kind === 'germany_economy_trade') {
                    if (treatAsGermany(iso3)) {
                      nestedBlocks.push({ type: 'germany_economy_trade', sub });
                    }
                    continue;
                  }
                  if ('kind' in sub && sub.kind === 'germany_health_suppression') {
                    if (treatAsGermany(iso3)) {
                      nestedBlocks.push({ type: 'germany_health_suppression', sub });
                    }
                    continue;
                  }
                  if ('kind' in sub && sub.kind === 'germany_lgbt_stats') {
                    nestedBlocks.push({ type: 'germany_lgbt_stats', sub });
                    continue;
                  }
                  if ('kind' in sub && sub.kind === 'germany_politics_leftism') {
                    if (treatAsGermany(iso3)) {
                      nestedBlocks.push({ type: 'germany_politics_leftism', sub });
                    }
                    continue;
                  }
                  if ('kind' in sub && sub.kind === 'germany_politics_rightwing') {
                    if (treatAsGermany(iso3)) {
                      nestedBlocks.push({ type: 'germany_politics_rightwing', sub });
                    }
                    continue;
                  }
                  if ('kind' in sub && sub.kind === 'germany_politics_zionism') {
                    if (treatAsGermany(iso3)) {
                      nestedBlocks.push({ type: 'germany_politics_zionism', sub });
                    }
                    continue;
                  }
                  if ('kind' in sub && sub.kind === 'germany_abortion_stats') {
                    nestedBlocks.push({ type: 'germany_abortion_stats', sub });
                    continue;
                  }
                  const metricSub = sub as MetricSubsection;
                  const subRows = metricSub.metrics
                    .map((name: string) => metricsByName.get(name))
                    .filter((r): r is CountryStatMetric => r != null);
                  if (subRows.length > 0) nestedBlocks.push({ type: 'metrics', sub: metricSub, subRows });
                }

                if (leadingRows.length === 0 && nestedBlocks.length === 0) return null;

                const leadingTileCount =
                  section.id === 'population' && treatAsGermany(iso3)
                    ? germanyPopulationLeadingTileCount(leadingRows)
                    : leadingRows.length;

                const germanyHealthOverviewTileCount =
                  section.id !== 'health'
                    ? 0
                    : iso3.toUpperCase() === 'FRA'
                      ? FRANCE_HEALTH_BASIC_GROUP_COUNT + FRANCE_HEALTH_EXTRA_CARDS.length + 3
                      : treatAsGermany(iso3)
                        ? GERMANY_HEALTH_BASIC_GROUP_COUNT + GERMANY_BIRTH_RATES_EXTRA_CARDS.length + 3
                        : 0;

                const germanyPoliticsOverviewChartCount =
                  section.id === 'politics' && treatAsGermany(iso3)
                    ? GERMANY_POLITICS_OVERVIEW_CHART_COUNT
                    : 0;

                const economicStructuralCount =
                  section.id === 'economic'
                    ? iso3.toUpperCase() === 'DEU'
                      ? GERMANY_ECONOMIC_STRUCTURAL_GROUP_COUNT
                      : iso3.toUpperCase() === 'FRA'
                        ? isItalyScaffold
                          ? ITALY_ECONOMIC_STRUCTURAL_GROUP_COUNT
                          : FRANCE_ECONOMIC_STRUCTURAL_GROUP_COUNT
                        : 0
                    : 0;

                const sectionCount =
                  leadingTileCount +
                  (section.id === 'population' && treatAsGermany(iso3) ? 1 : 0) +
                  germanyHealthOverviewTileCount +
                  germanyPoliticsOverviewChartCount +
                  economicStructuralCount +
                  nestedBlocks.reduce((acc, b) => {
                    if (b.type === 'germany_immigration') return acc + GERMANY_IMMIGRATION_SUBSECTION_COUNT;
                    if (b.type === 'germany_marriages') return acc + GERMANY_MARRIAGES_GROUP_COUNT;
                    if (b.type === 'germany_sexual_behavior') return acc + GERMANY_SEXUAL_BEHAVIOR_GROUP_COUNT;
                    if (b.type === 'germany_labor_income') return acc + GERMANY_LABOR_INCOME_GROUP_COUNT + (isItalyScaffold ? 1 : 0);
                    if (b.type === 'germany_economic_taxes') return acc + GERMANY_ECONOMIC_TAXES_GROUP_COUNT;
                    if (b.type === 'germany_economy_trade') return acc + GERMANY_TRADE_GROUP_COUNT;
                    if (b.type === 'germany_health_suppression') return acc + GERMANY_HEALTH_SUPPRESSION_GROUP_COUNT;
                    if (b.type === 'germany_lgbt_stats') return acc + GERMANY_LGBT_SECTION_GROUP_COUNT;
                    if (b.type === 'germany_politics_leftism') return acc + GERMANY_POLITICS_LEFTISM_GROUP_COUNT;
                    if (b.type === 'germany_politics_rightwing') return acc + GERMANY_POLITICS_RIGHT_WING_GROUP_COUNT;
                    if (b.type === 'germany_politics_zionism') return acc + GERMANY_POLITICS_ZIONISM_GROUP_COUNT;
                    if (b.type === 'germany_abortion_stats') return acc + GERMANY_ABORTION_SECTION_GROUP_COUNT;
                    if (b.type === 'metrics' && b.sub.id === 'birth_rates' && treatAsGermany(iso3)) {
                      return acc + b.subRows.length + 4;
                    }
                    if (b.type === 'metrics' && b.sub.id === 'government_spending' && treatAsGermany(iso3)) {
                      return acc + b.subRows.length + GERMANY_GOV_SPENDING_EXTRA_CARD_COUNT;
                    }
                    if (b.type === 'metrics') return acc + b.subRows.length;
                    return acc;
                  }, 0);

                return (
                  <div
                    key={section.id}
                    style={{ order: sectionOrderIndex(section.id) }}
                  >
                    <CollapsibleFlagSection
                      title={section.title}
                      count={sectionCount}
                      defaultOpen
                      anchorId={`country-section-${section.id}`}
                      ribbonExpandKey={`main:${section.id}`}
                      headerControls={sectionControls(section.id)}
                      collapseSignal={collapseSignal}
                      expandSignal={expandSignal}
                    >
                    <div className="flex flex-col gap-4">
                      {section.id === 'population' ? (
                        isItalyScaffold ? (
                          <GermanyPopulationPyramid
                            csvUrl={countryCsvUrl(effectiveCountryIso3, 'population_pyramid')}
                            countryLabel="Italy"
                            asOfLabel="As of 1 January 2025"
                            sourceLabel="Eurostat demo_pjan — population on 1 January by age and sex"
                            sourceUrl="https://ec.europa.eu/eurostat/databrowser/view/demo_pjan/default/table?lang=en"
                          />
                        ) : iso3.toUpperCase() === 'FRA' ? (
                          <GermanyPopulationPyramid rawCsv={francePopulationByAgeCsvRaw} countryLabel="France" />
                        ) : treatAsGermany(iso3) ? (
                          <GermanyPopulationPyramid />
                        ) : (
                          <GermanyPopulationPyramid
                            csvUrl={countryCsvUrl(iso3, 'population_pyramid')}
                            countryLabel={flag.label}
                          />
                        )
                      ) : null}
                      {leadingRows.length > 0 ? (
                        <div className={STAT_GRID}>
                          {section.id === 'population' && treatAsGermany(iso3)
                            ? renderGermanyPopulationLeadingTiles(leadingRows, effectiveCountryIso3)
                            : leadingRows.map((row) => (
                                <Fragment key={row.metric}>{renderStatTile(row, { iso3 })}</Fragment>
                              ))}
                        </div>
                      ) : null}
                      {section.id === 'economic' && iso3.toUpperCase() === 'DEU' ? (
                        <GermanyEconomicStructuralSection />
                      ) : null}
                      {section.id === 'economic' && iso3.toUpperCase() === 'FRA' && !isItalyScaffold ? (
                        <FranceEconomicStructuralSection />
                      ) : null}
                      {section.id === 'economic' && isItalyScaffold ? (
                        <ItalyEconomicStructuralSection />
                      ) : null}
                      {section.id === 'health' ? (
                        iso3.toUpperCase() === 'FRA' ? (
                          <div className="flex flex-col gap-3">
                            <GermanyHealthBasicSection
                              csvUrl={countryCsvUrl(iso3, 'health_statistics_basic')}
                              countryName="France"
                              isGermany={false}
                            />
                            <FranceHealthExtrasGrid />
                          </div>
                        ) : treatAsGermany(iso3) ? (
                          <div className="flex flex-col gap-3">
                            <GermanyHealthBasicSection />
                            <GermanyBirthRatesExtrasGrid />
                          </div>
                        ) : (
                          <div className="flex flex-col gap-3">
                            <GermanyHealthBasicSection
                              csvUrl={countryCsvUrl(iso3, 'health_statistics_basic')}
                              countryName={flag.label}
                              isGermany={false}
                            />
                          </div>
                        )
                      ) : null}
                      {section.id === 'politics' && treatAsGermany(iso3) ? (
                        <GermanyPoliticsOverviewCharts
                          menLeftRightChart={isItalyScaffold ? ITALY_MEN_LEFT_RIGHT_CHART : undefined}
                          womenLeftRightChart={isItalyScaffold ? ITALY_WOMEN_LEFT_RIGHT_CHART : undefined}
                          israelSupportByGenderChart={
                            isItalyScaffold ? ITALY_ISRAEL_SUPPORT_BY_GENDER_CHART : undefined
                          }
                          russiaUkraineOverallChart={
                            isItalyScaffold ? ITALY_RUSSIA_UKRAINE_SUPPORT_CHART : undefined
                          }
                          russiaUkraineLeftWingChart={
                            isItalyScaffold ? ITALY_RUSSIA_UKRAINE_LEFT_WING_CHART : undefined
                          }
                          russiaUkraineRightWingChart={
                            isItalyScaffold ? ITALY_RUSSIA_UKRAINE_RIGHT_WING_CHART : undefined
                          }
                        />
                      ) : null}
                      {nestedBlocks.map((block) =>
                        block.type === 'germany_immigration' ? (
                          <CollapsibleFlagSection
                            key={block.sub.id}
                            title={block.sub.title}
                            count={GERMANY_IMMIGRATION_SUBSECTION_COUNT}
                            defaultOpen
                            anchorId={`country-sub-${section.id}-${block.sub.id}`}
                            ribbonExpandKey={`sub:${section.id}:${block.sub.id}`}
                            collapseSignal={collapseSignal}
                              expandSignal={expandSignal}
                          >
                            <div className="flex flex-col gap-4">
                              <div className={STAT_GRID}>
                                {GERMANY_IMMIGRATION_TOP_METRICS.map((metric) => {
                                  const row = metricsByName.get(metric);
                                  return row ? (
                                    <Fragment key={metric}>
                                      {renderStatTile(row, {
                                        foreignStudentsPieCompact: metric === 'Foreign students by origin (pie)',
                                        iso3,
                                      })}
                                    </Fragment>
                                  ) : null;
                                })}
                              </div>
                              {isItalyScaffold ? (
                                <ItalyImmigrationSection />
                              ) : iso3.toUpperCase() === 'FRA' ? (
                                <GermanyImmigrationSection
                                  countryLabel="France"
                                  refugeesValue={639324}
                                  refugeesNote="France, 31 Dec 2024 — valid humanitarian (protection) permits."
                                  workVisasValue={260000}
                                  workVisasNote="Economic residence permits issued 2021–2025 (~55.6k/yr, est.)."
                                  migrantBackgroundValue={15300000}
                                  migrantBackgroundNote="France, 2024 — 7.3M immigrants + 8.0M descendants of immigrants (INSEE)."
                                  migrationBackgroundByYear={FRANCE_MIGRATION_BACKGROUND_BY_YEAR}
                                  migrantArrivalsSeries={FRANCE_MIGRANT_ARRIVALS_SERIES}
                                  deportationTrendSeries={FRANCE_DEPORTATION_TREND_SERIES}
                                  deportationReentrySeries={FRANCE_DEPORTATION_REENTRY_BY_YEAR}
                                  treemapItems={FRANCE_IMMIGRATION_TREEMAP_ITEMS}
                                  treemapNote={FRANCE_TREEMAP_NOTE}
                                  healthcareHousingSeries={FRANCE_HEALTHCARE_SOCIAL_HOUSING_USAGE}
                                  publicOpinionSeries={FRANCE_PUBLIC_OPINION_IMMIGRATION}
                                  publicOpinionDesc="Share agreeing with key immigration statements in France, 2000-2025."
                                  languageIntegrationSeries={FRANCE_LANGUAGE_INTEGRATION}
                                  languageIntegrationDesc={FRANCE_LANGUAGE_INTEGRATION_DESC}
                                  contributionRows={FRANCE_CONTRIBUTION_ROWS}
                                  contributionNotes={FRANCE_CONTRIBUTION_NOTES}
                                  welfareTitle={FRANCE_WELFARE_TITLE}
                                  welfareDesc={FRANCE_WELFARE_DESC}
                                  welfareRows={FRANCE_WELFARE_ROWS}
                                  welfareNote={<p className="font-sans text-[10px] leading-relaxed text-neutral-500">{FRANCE_WELFARE_NOTE}</p>}
                                  refugeeOriginsTitle={FRANCE_REFUGEE_ORIGINS_TITLE}
                                  refugeeBreakdown={FRANCE_REFUGEE_BREAKDOWN}
                                  asylumByRegion={FRANCE_ASYLUM_BY_REGION}
                                  asylumSeekersTotal={FRANCE_ASYLUM_SEEKERS_TOTAL}
                                  asylumSeekersMen={FRANCE_ASYLUM_SEEKERS_MEN}
                                  asylumSeekersWomen={FRANCE_ASYLUM_SEEKERS_WOMEN}
                                  asylumApplications={FRANCE_ASYLUM_APPLICATIONS_2025}
                                  advocates={FRANCE_ADVOCATES}
                                  advocatesHeading={FRANCE_ADVOCATES_HEADING}
                                  advocatesIntro={FRANCE_ADVOCATES_INTRO}
                                  advocatesCoalition={FRANCE_ADVOCATES_COALITION}
                                />
                              ) : (
                                <GermanyImmigrationSection />
                              )}
                            </div>
                          </CollapsibleFlagSection>
                        ) : block.type === 'germany_marriages' ? (
                          <CollapsibleFlagSection
                            key={block.sub.id}
                            title={block.sub.title}
                            count={GERMANY_MARRIAGES_GROUP_COUNT}
                            defaultOpen
                            anchorId={`country-sub-${section.id}-${block.sub.id}`}
                            ribbonExpandKey={`sub:${section.id}:${block.sub.id}`}
                            collapseSignal={collapseSignal}
                            expandSignal={expandSignal}
                          >
                            {isItalyScaffold ? (
                              <GermanyMarriagesSection
                                marriageRatesSeries={ITALY_MARRIAGE_RATES_SERIES}
                                femaleSeries={ITALY_FEMALE_MIXED_MARRIAGE_SERIES}
                                maleSeries={ITALY_MALE_MIXED_MARRIAGE_SERIES}
                                lgbtSeries={ITALY_LGBT_UNION_SERIES}
                                nativeAdj="Italian"
                                mixedMarriageRangeLabel="2018–2024"
                                femaleDetailedTableRows={ITALY_FEMALE_MIXED_MARRIAGE_TABLE}
                                femaleDetailedTableRangeLabel="2000–2025"
                                maleDetailedTableRows={ITALY_MALE_MIXED_MARRIAGE_TABLE}
                                maleDetailedTableRangeLabel="2000–2025"
                                detailedTableNativeShortLabel="It."
                                marriageRatesSourceNote={
                                  <>
                                    Source:{' '}
                                    <a
                                      className="text-[var(--uk-accent)] hover:text-neutral-200"
                                      href={ITALY_MARRIAGE_EUROSTAT_URL}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      Eurostat demo_nind
                                    </a>{' '}
                                    (2000–2024);{' '}
                                    <a
                                      className="text-[var(--uk-accent)] hover:text-neutral-200"
                                      href={ITALY_MARRIAGE_ISTAT_2025_URL}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      Istat
                                    </a>{' '}
                                    (2025 provisional).
                                  </>
                                }
                                marriageAgeSourceNote={
                                  <>
                                    Mean age at first marriage. Source:{' '}
                                    <a
                                      className="text-[var(--uk-accent)] hover:text-neutral-200"
                                      href={ITALY_MARRIAGE_EUROSTAT_URL}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      Eurostat demo_nind
                                    </a>
                                    . 2012 and 2015 are interpolated; 2025 is estimated.
                                  </>
                                }
                                mixedMarriageSourceNote={
                                  <>
                                    Source:{' '}
                                    <a
                                      className="text-[var(--uk-accent)] hover:text-neutral-200"
                                      href={ITALY_MIXED_MARRIAGES_ISTAT_URL}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      Istat 2024 marriage report
                                    </a>
                                    ,{' '}
                                    <a
                                      className="text-[var(--uk-accent)] hover:text-neutral-200"
                                      href={ITALY_MIXED_MARRIAGES_ISTAT_TABLES_URL}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      statistical tables
                                    </a>
                                    , and the{' '}
                                    <a
                                      className="text-[var(--uk-accent)] hover:text-neutral-200"
                                      href={ITALY_MIXED_MARRIAGES_ISTAT_HISTORY_URL}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      2011–2023 historical series
                                    </a>
                                    . The Italian female and male tables use the supplied spouse
                                    citizenship series and origin breakdowns; ~ marks approximate
                                    values and (est.) marks estimates. Annual 2018–2024
                                    Italian/foreign spouse totals are official Istat counts.
                                    The Germany UI’s broad origin buckets are Italy-weighted estimates
                                    based on Istat’s published spouse-citizenship distribution; Istat
                                    defines “mixed” by citizenship, not race.
                                  </>
                                }
                                lgbtSourceNote={
                                  <>
                                    Source:{' '}
                                    <a
                                      href={ITALY_LGBT_UNIONS_ISTAT_TABLES_URL}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-neutral-300 underline decoration-neutral-600 underline-offset-2 hover:text-white"
                                    >
                                      Istat annual civil-union tables
                                    </a>
                                    ,{' '}
                                    <a
                                      href={ITALY_LGBT_UNIONS_ISTAT_EARLY_URL}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-neutral-300 underline decoration-neutral-600 underline-offset-2 hover:text-white"
                                    >
                                      Istat 2016–2017 release
                                    </a>
                                    , and{' '}
                                    <a
                                      href={ITALY_LGBT_UNIONS_ISTAT_2024_URL}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-neutral-300 underline decoration-neutral-600 underline-offset-2 hover:text-white"
                                    >
                                      Istat 2024 release
                                    </a>
                                    . Italy’s legal category is same-sex civil unions, introduced
                                    in July 2016. “Gay” and “Lesbian” reproduce the Germany UI’s
                                    wording and map to Istat’s male-couple and female-couple series.
                                    The 2016–2017 sex split applies Istat’s combined two-year split
                                    to each annual total. The 2025 estimate applies Istat’s
                                    provisional first-nine-month decline of 3.1% to the 2024 total
                                    and retains the 2024 sex split.
                                  </>
                                }
                              />
                            ) : iso3.toUpperCase() === 'FRA' ? (
                              <GermanyMarriagesSection
                                marriageRatesSeries={FRANCE_MARRIAGE_RATES_SERIES}
                                femaleSeries={FRANCE_FEMALE_SERIES}
                                maleSeries={FRANCE_MALE_SERIES}
                                lgbtSeries={FRANCE_LGBT_SERIES}
                                nativeAdj="French"
                              />
                            ) : (
                              <GermanyMarriagesSection />
                            )}
                          </CollapsibleFlagSection>
                        ) : block.type === 'germany_sexual_behavior' ? (
                          <CollapsibleFlagSection
                            key={block.sub.id}
                            title={block.sub.title}
                            count={GERMANY_SEXUAL_BEHAVIOR_GROUP_COUNT}
                            defaultOpen
                            anchorId={`country-sub-${section.id}-${block.sub.id}`}
                            ribbonExpandKey={`sub:${section.id}:${block.sub.id}`}
                            collapseSignal={collapseSignal}
                            expandSignal={expandSignal}
                          >
                            {isItalyScaffold ? (
                              <ItalySexualBehaviorSection />
                            ) : iso3.toUpperCase() === 'FRA' ? (
                              <FranceSexualBehaviorSection />
                            ) : (
                              <GermanySexualBehaviorSection />
                            )}
                          </CollapsibleFlagSection>
                        ) : block.type === 'germany_labor_income' ? (
                          <CollapsibleFlagSection
                            key={block.sub.id}
                            title={block.sub.title}
                            count={GERMANY_LABOR_INCOME_GROUP_COUNT + (isItalyScaffold ? 1 : 0)}
                            defaultOpen
                            anchorId={`country-sub-${section.id}-${block.sub.id}`}
                            ribbonExpandKey={`sub:${section.id}:${block.sub.id}`}
                            collapseSignal={collapseSignal}
                              expandSignal={expandSignal}
                          >
                            {treatAsGermany(iso3) ? (
                              <GermanyLaborIncomeSection
                                govRowsOverride={
                                  iso3.toUpperCase() === 'FRA'
                                    ? isItalyScaffold
                                      ? ITALY_LABOR_MIGRATION_ENFORCEMENT_ROWS
                                      : FRANCE_LABOR_MIGRATION_ENFORCEMENT_ROWS
                                    : undefined
                                }
                                laborRowsOverride={
                                  iso3.toUpperCase() === 'FRA'
                                    ? isItalyScaffold
                                      ? ITALY_LABOR_STATISTICS_ROWS
                                      : FRANCE_LABOR_STATISTICS_ROWS
                                    : undefined
                                }
                                incomeDistribution={
                                  iso3.toUpperCase() === 'FRA'
                                    ? isItalyScaffold
                                      ? {
                                          groups: ITALY_INCOME_DISTRIBUTION_GROUPS,
                                          caption: ITALY_INCOME_DISTRIBUTION_CAPTION,
                                          concentrationIndicators: {
                                            gini: '0.310',
                                            s80S20: '5.1',
                                            period: 'Income year 2024',
                                            sourceLabel: 'Istat · Living conditions and household income',
                                            sourceUrl:
                                              'https://www.istat.it/en/press-release/living-conditions-and-household-income-year-2025/',
                                          },
                                        }
                                      : {
                                          groups: FRANCE_INCOME_DISTRIBUTION_GROUPS,
                                          caption: FRANCE_INCOME_DISTRIBUTION_CAPTION,
                                        }
                                    : undefined
                                }
                                incomeNationalityChart={
                                  iso3.toUpperCase() === 'FRA'
                                    ? isItalyScaffold
                                      ? {
                                          title: ITALY_AVERAGE_MONTHLY_NET_PAY_TITLE,
                                          data: ITALY_AVERAGE_MONTHLY_NET_PAY_BY_CITIZENSHIP,
                                          series: ITALY_AVERAGE_MONTHLY_NET_PAY_SERIES,
                                          note: ITALY_AVERAGE_MONTHLY_NET_PAY_NOTE,
                                          sourceUrl: ITALY_AVERAGE_MONTHLY_NET_PAY_SOURCE_URL,
                                        }
                                      : {
                                          title: FRANCE_MEDIAN_MONTHLY_NET_INCOME_TITLE,
                                          data: FRANCE_MEDIAN_MONTHLY_NET_INCOME_BY_ETHNIC_GROUP,
                                          series: FRANCE_MEDIAN_MONTHLY_NET_INCOME_SERIES,
                                        }
                                    : undefined
                                }
                                fiscalNationalityChart={
                                  iso3.toUpperCase() === 'FRA'
                                    ? isItalyScaffold
                                      ? {
                                          title: ITALY_NET_FISCAL_CONTRIBUTION_TITLE,
                                          data: ITALY_NET_FISCAL_CONTRIBUTION_BY_MIGRATION_BACKGROUND,
                                          series: ITALY_NET_FISCAL_CONTRIBUTION_SERIES,
                                          note: ITALY_NET_FISCAL_CONTRIBUTION_NOTE,
                                          sourceLabel: ITALY_NET_FISCAL_CONTRIBUTION_SOURCE_LABEL,
                                          sourceUrl: ITALY_NET_FISCAL_CONTRIBUTION_SOURCE_URL,
                                          showLegend: true,
                                          showDataTable: true,
                                        }
                                      : {
                                          title: FRANCE_NET_FISCAL_CONTRIBUTION_TITLE,
                                          data: FRANCE_NET_FISCAL_CONTRIBUTION_BY_ETHNIC_GROUP,
                                          series: FRANCE_NET_FISCAL_CONTRIBUTION_SERIES,
                                        }
                                    : undefined
                                }
                                remittancesChart={
                                  iso3.toUpperCase() === 'FRA'
                                    ? isItalyScaffold
                                      ? {
                                          title: ITALY_REMITTANCES_OUTFLOW_TITLE,
                                          data: ITALY_REMITTANCES_OUTFLOW_2025,
                                          note: ITALY_REMITTANCES_OUTFLOW_NOTE,
                                        }
                                      : {
                                          title: FRANCE_REMITTANCES_OUTFLOW_TITLE,
                                          data: FRANCE_REMITTANCES_OUTFLOW_2025,
                                          note: FRANCE_REMITTANCES_OUTFLOW_NOTE,
                                        }
                                    : undefined
                                }
                                immigrantBenefits={
                                  iso3.toUpperCase() === 'FRA'
                                    ? isItalyScaffold
                                      ? ITALY_IMMIGRANT_BENEFITS
                                      : FRANCE_IMMIGRANT_BENEFITS
                                    : undefined
                                }
                              />
                            ) : (
                              <GermanyLaborIncomeSection
                                govCsvUrl={countryCsvUrl(iso3, 'government_politics')}
                                laborCsvUrl={countryCsvUrl(iso3, 'labor_statistics')}
                                isGermany={false}
                              />
                            )}
                          </CollapsibleFlagSection>
                        ) : block.type === 'germany_economic_taxes' ? (
                          <CollapsibleFlagSection
                            key={block.sub.id}
                            title={block.sub.title}
                            count={GERMANY_ECONOMIC_TAXES_GROUP_COUNT}
                            defaultOpen
                            anchorId={`country-sub-${section.id}-${block.sub.id}`}
                            ribbonExpandKey={`sub:${section.id}:${block.sub.id}`}
                            collapseSignal={collapseSignal}
                            expandSignal={expandSignal}
                          >
                            {isItalyScaffold ? (
                              <GermanyEconomicTaxesSection
                                incomeBrackets={ITALY_INCOME_BRACKETS}
                                bracketsTitle="IRPEF Brackets 2026"
                                bracketsDescription="Taxable income (reddito complessivo, €); middle rate cut 35% → 33%."
                                socialSecurity={ITALY_SOCIAL_SECURITY}
                                socialTitle="Social Contributions 2026 (INPS)"
                                socialDescription="Employee / employer shares (private sector, illustrative)."
                                corporateTaxes={ITALY_CORPORATE_TAXES}
                                vatRates={ITALY_VAT_RATES}
                                otherTaxes={ITALY_OTHER_TAXES}
                                calculator={<ItalyNetIncomeCalculator />}
                                footnote="Reference figures are overview-only; verify against official Agenzia delle Entrate / INPS guidance for filing."
                              />
                            ) : iso3.toUpperCase() === 'FRA' ? (
                              <GermanyEconomicTaxesSection
                                incomeBrackets={FRANCE_INCOME_BRACKETS}
                                bracketsTitle="Income Tax Brackets 2026 (per part)"
                                bracketsDescription="Barème IR on 2025 income, applied to the quotient familial (€)."
                                socialSecurity={FRANCE_SOCIAL_SECURITY}
                                socialTitle="Social Contributions 2026"
                                socialDescription="Employee / employer shares (illustrative)."
                                corporateTaxes={FRANCE_CORPORATE_TAXES}
                                vatRates={FRANCE_VAT_RATES}
                                otherTaxes={FRANCE_OTHER_TAXES}
                                calculator={<FranceNetIncomeCalculator />}
                                footnote="Reference figures are overview-only; verify against official impots.gouv.fr / URSSAF guidance for filing."
                              />
                            ) : (
                              <GermanyEconomicTaxesSection />
                            )}
                          </CollapsibleFlagSection>
                        ) : block.type === 'germany_economy_trade' ? (
                          <CollapsibleFlagSection
                            key={block.sub.id}
                            title={block.sub.title}
                            count={GERMANY_TRADE_GROUP_COUNT}
                            defaultOpen
                            anchorId={`country-sub-${section.id}-${block.sub.id}`}
                            ribbonExpandKey={`sub:${section.id}:${block.sub.id}`}
                            collapseSignal={collapseSignal}
                            expandSignal={expandSignal}
                          >
                            {iso3.toUpperCase() === 'FRA' ? (
                              <GermanyTradeSection
                                {...FRANCE_TRADE}
                                {...(isItalyScaffold ? ITALY_GENERAL_TRADE : {})}
                              />
                            ) : (
                              <GermanyTradeSection />
                            )}
                          </CollapsibleFlagSection>
                        ) : block.type === 'germany_health_suppression' ? (
                          <CollapsibleFlagSection
                            key={block.sub.id}
                            title={block.sub.title}
                            count={iso3.toUpperCase() === 'FRA' ? FRANCE_TAP_WATER_GROUP_COUNT : GERMANY_HEALTH_SUPPRESSION_GROUP_COUNT}
                            defaultOpen
                            anchorId={`country-sub-${section.id}-${block.sub.id}`}
                            ribbonExpandKey={`sub:${section.id}:${block.sub.id}`}
                            collapseSignal={collapseSignal}
                            expandSignal={expandSignal}
                          >
                            {iso3.toUpperCase() === 'FRA' ? <FranceTapWaterSection /> : <GermanyHealthSuppressionSection />}
                          </CollapsibleFlagSection>
                        ) : block.type === 'germany_lgbt_stats' ? (
                          <CollapsibleFlagSection
                            key={block.sub.id}
                            title={block.sub.title}
                            count={GERMANY_LGBT_SECTION_GROUP_COUNT}
                            defaultOpen
                            anchorId={`country-sub-${section.id}-${block.sub.id}`}
                            ribbonExpandKey={`sub:${section.id}:${block.sub.id}`}
                            collapseSignal={collapseSignal}
                              expandSignal={expandSignal}
                          >
                            {iso3.toUpperCase() === 'DEU' ? (
                              <GermanyLgbtSection />
                            ) : (
                              <GermanyLgbtSection
                                csvUrl={countryCsvUrl(iso3, 'gender_care_statistics')}
                                isGermany={false}
                                countryLabel={iso3.toUpperCase() === 'FRA' ? 'France' : iso3.toUpperCase()}
                              />
                            )}
                          </CollapsibleFlagSection>
                        ) : block.type === 'germany_politics_leftism' ? (
                          <CollapsibleFlagSection
                            key={block.sub.id}
                            title={block.sub.title}
                            count={GERMANY_POLITICS_LEFTISM_GROUP_COUNT}
                            defaultOpen
                            anchorId={`country-sub-${section.id}-${block.sub.id}`}
                            ribbonExpandKey={`sub:${section.id}:${block.sub.id}`}
                            collapseSignal={collapseSignal}
                              expandSignal={expandSignal}
                          >
                            {isItalyScaffold ? (
                              <GermanyPoliticsLeftismSection {...ITALY_POLITICS_LEFTISM} />
                            ) : iso3.toUpperCase() === 'FRA' ? (
                              <GermanyPoliticsLeftismSection {...FRANCE_POLITICS_LEFTISM} />
                            ) : (
                              <GermanyPoliticsLeftismSection />
                            )}
                          </CollapsibleFlagSection>
                        ) : block.type === 'germany_politics_rightwing' ? (
                          <CollapsibleFlagSection
                            key={block.sub.id}
                            title={block.sub.title}
                            count={GERMANY_POLITICS_RIGHT_WING_GROUP_COUNT}
                            defaultOpen
                            anchorId={`country-sub-${section.id}-${block.sub.id}`}
                            ribbonExpandKey={`sub:${section.id}:${block.sub.id}`}
                            collapseSignal={collapseSignal}
                              expandSignal={expandSignal}
                          >
                            {isItalyScaffold ? (
                              <GermanyPoliticsRightWingSection {...ITALY_POLITICS_RIGHT_WING} />
                            ) : iso3.toUpperCase() === 'FRA' ? (
                              <GermanyPoliticsRightWingSection {...FRANCE_POLITICS_RIGHTWING} />
                            ) : (
                              <GermanyPoliticsRightWingSection />
                            )}
                          </CollapsibleFlagSection>
                        ) : block.type === 'germany_politics_zionism' ? (
                          <CollapsibleFlagSection
                            key={block.sub.id}
                            title={block.sub.title}
                            count={GERMANY_POLITICS_ZIONISM_GROUP_COUNT}
                            defaultOpen
                            anchorId={`country-sub-${section.id}-${block.sub.id}`}
                            ribbonExpandKey={`sub:${section.id}:${block.sub.id}`}
                            collapseSignal={collapseSignal}
                            expandSignal={expandSignal}
                          >
                            <GermanyPoliticsZionismSection iso3={iso3} actualIso3={effectiveCountryIso3} />
                          </CollapsibleFlagSection>
                        ) : block.type === 'germany_abortion_stats' ? (
                          <CollapsibleFlagSection
                            key={block.sub.id}
                            title={block.sub.title}
                            count={GERMANY_ABORTION_SECTION_GROUP_COUNT}
                            defaultOpen
                            anchorId={`country-sub-${section.id}-${block.sub.id}`}
                            ribbonExpandKey={`sub:${section.id}:${block.sub.id}`}
                            collapseSignal={collapseSignal}
                              expandSignal={expandSignal}
                          >
                            {iso3.toUpperCase() === 'DEU' ? (
                              <GermanyAbortionStatisticsSection />
                            ) : (
                              <GermanyAbortionStatisticsSection
                                csvUrl={countryCsvUrl(iso3, 'abortion_statistics')}
                                isGermany={false}
                                countryLabel={iso3.toUpperCase() === 'FRA' ? 'France' : iso3.toUpperCase()}
                                priorLiveBirthCards={
                                  iso3.toUpperCase() === 'FRA'
                                    ? {
                                        atLeastOneValue: '≈119,000 (47.4%)',
                                        atLeastOneBody:
                                          'Estimated 2024 abortions among women with at least one prior live birth.',
                                        zeroValue: '≈132,000 (52.6%)',
                                        zeroBody:
                                          'Estimated 2024 abortions among women with no prior live births.',
                                      }
                                    : undefined
                                }
                                relationshipStatus={
                                  iso3.toUpperCase() === 'FRA'
                                    ? {
                                        year: '2021',
                                        rows: [
                                          { label: 'Unmarried women', value: '145,145', share: '65.0%' },
                                          { label: 'Married women', value: '69,223', share: '31.0%' },
                                          { label: 'Widowed or divorced women', value: '8,932', share: '4.0%' },
                                          { label: 'Total', value: '223,300', share: '100.0%' },
                                        ],
                                      }
                                    : undefined
                                }
                              />
                            )}
                          </CollapsibleFlagSection>
                        ) : (
                          <CollapsibleFlagSection
                            key={block.sub.id}
                            title={block.sub.title}
                            count={
                              block.subRows.length +
                              (block.sub.id === 'birth_rates' && treatAsGermany(iso3) ? 4 : 0)
                              + (block.sub.id === 'government_spending' && treatAsGermany(iso3)
                                ? block.subRows.length + 1 + GERMANY_GOV_SPENDING_EXTRA_CARD_COUNT
                                : 0)
                            }
                            defaultOpen
                            anchorId={`country-sub-${section.id}-${block.sub.id}`}
                            ribbonExpandKey={`sub:${section.id}:${block.sub.id}`}
                            collapseSignal={collapseSignal}
                            expandSignal={expandSignal}
                          >
                            <div
                              className={
                                block.sub.id === 'birth_rates' && treatAsGermany(iso3)
                                  ? 'relative flex flex-col gap-4'
                                  : 'flex flex-col gap-4'
                              }
                            >
                              {block.sub.id === 'birth_rates' && treatAsGermany(iso3) ? (
                                <>
                                  {isItalyScaffold ? (
                                    <GermanyBirthsLineChartTile
                                      series={ITALY_TOTAL_BIRTHS_SERIES}
                                      title="Total births per year (Italy)"
                                      nativeLabel="Italian-citizen"
                                      foreignLabel="foreign-citizen"
                                      note={ITALY_BIRTHS_NOTE}
                                      sourceNote={ITALY_BIRTHS_SOURCE}
                                    />
                                  ) : iso3.toUpperCase() === 'FRA' ? (
                                    <GermanyBirthsLineChartTile
                                      series={FRANCE_TOTAL_BIRTHS_SERIES}
                                      title="Total births per year (France)"
                                      nativeLabel="French"
                                      note={FRANCE_BIRTHS_NOTE}
                                      sourceNote={FRANCE_BIRTHS_SOURCE}
                                    />
                                  ) : (
                                    <GermanyBirthsLineChartTile />
                                  )}
                                  {isItalyScaffold ? (
                                    <>
                                      <GermanyBirthsByRaceChartTile
                                        series={ITALY_BIRTHS_BY_ORIGIN_SERIES}
                                        title="Births by parents’ citizenship/origin (Italy)"
                                        description="Official totals with modeled regional allocation (2000–2025)"
                                        labels={ITALY_BIRTHS_BY_ORIGIN_LABELS}
                                      />
                                      <GermanyMixedRaceBirthsChartTile
                                        series={ITALY_MIXED_BIRTHS_SERIES}
                                        title="Mixed-citizenship births (Italy)"
                                        description="One Italian-citizen and one foreign-citizen parent; 2023–2024 official, other years modeled"
                                        femaleLabel={ITALY_MIXED_BIRTHS_LABELS.female}
                                        maleLabel={ITALY_MIXED_BIRTHS_LABELS.male}
                                      />
                                    </>
                                  ) : iso3.toUpperCase() === 'FRA' ? (
                                    <>
                                      <GermanyBirthsByRaceChartTile
                                        series={FRANCE_BIRTHS_BY_RACE_SERIES}
                                        title="Births by regional origin (France)"
                                        labels={FRANCE_BIRTHS_BY_RACE_LABELS}
                                      />
                                      <GermanyMixedRaceBirthsChartTile
                                        series={FRANCE_MIXED_BIRTHS_SERIES}
                                        title="Mixed-origin births (France)"
                                        description="Live births with one French and one foreign parent (2000–2025)"
                                        femaleLabel={FRANCE_MIXED_BIRTHS_LABELS.female}
                                        maleLabel={FRANCE_MIXED_BIRTHS_LABELS.male}
                                      />
                                    </>
                                  ) : (
                                    <>
                                      <GermanyBirthsByRaceChartTile />
                                      <GermanyMixedRaceBirthsChartTile />
                                    </>
                                  )}
                                </>
                              ) : null}
                              {block.sub.id === 'birth_rates' && treatAsGermany(iso3) ? (
                                <>
                                  {/* Masonry (CSS columns): tiles pack by height so a very tall tile
                                      (childhood obesity) never strands short tiles beside it — no gaps. */}
                                  <div className="gap-2 [column-gap:0.5rem] columns-1 sm:columns-2 lg:columns-3">
                                    {block.subRows.map((row) => (
                                      <div key={row.metric} className="mb-2 break-inside-avoid">
                                        {renderStatTile(row, { iso3: effectiveCountryIso3, compactBirthRates: true })}
                                      </div>
                                    ))}
                                  </div>
                                  {isItalyScaffold ? (
                                    <ItalyBirthRatesEducationTile />
                                  ) : iso3.toUpperCase() === 'FRA' ? (
                                    <FranceBirthRatesEducationTile />
                                  ) : iso3.toUpperCase() === 'DEU' ? (
                                    <GermanyBirthRatesEducationTile />
                                  ) : null}
                                </>
                              ) : block.sub.id === 'government_spending' && treatAsGermany(iso3) ? (
                                <GermanyGovernmentSpendingDESection
                                  subRows={block.subRows}
                                  iso3={iso3}
                                  actualIso3={effectiveCountryIso3}
                                />
                              ) : (
                                <div className={STAT_GRID}>
                                  {block.subRows.map((row) => (
                                    <Fragment key={row.metric}>{renderStatTile(row, { iso3 })}</Fragment>
                                  ))}
                                </div>
                              )}
                            </div>
                          </CollapsibleFlagSection>
                        ),
                      )}
                    </div>
                    </CollapsibleFlagSection>
                  </div>
                );
              })}

            <div
              style={{ order: sectionOrderIndex('crime') }}
            >
              <CollapsibleFlagSection
                title="Crime"
                count={crimeRow ? (treatAsGermany(iso3) ? 49 : 4) : 0}
                defaultOpen
                anchorId="country-section-crime"
                ribbonExpandKey="main:crime"
                headerControls={sectionControls('crime')}
                collapseSignal={crimeCollapseSignal}
                expandSignal={expandSignal}
              >
                <div className="flex flex-col gap-4">
                  <CollapsibleFlagSection
                    title="Statistics"
                    count={crimeRow ? (treatAsGermany(iso3) ? 15 + 4 + 3 : 4) : 0}
                    defaultOpen
                    anchorId="country-sub-crime-statistics"
                    ribbonExpandKey={'sub:crime:crime_statistics'}
                    collapseSignal={collapseSignal}
                    expandSignal={expandSignal}
                  >
                    <div className="flex flex-col gap-4">
                      {effectiveCrimeIso3.toUpperCase() === 'ITA' ? (
                        <ItalyTotalRecordedCrimesChart />
                      ) : effectiveCrimeIso3.toUpperCase() === 'FRA' ? (
                        <FranceTotalRecordedCrimesChart />
                      ) : treatAsGermany(effectiveCrimeIso3) ? (
                        <GermanyTotalRecordedCrimesChart />
                      ) : null}
                      <CrimeMetricsSection crimeRow={crimeRow} iso3={effectiveCrimeIso3} />
                    </div>
                  </CollapsibleFlagSection>
                  {treatAsGermany(iso3) ? (
                    <CollapsibleFlagSection
                      title="Victims"
                      count={19}
                      defaultOpen
                      anchorId="country-sub-crime-victims"
                      ribbonExpandKey="sub:crime:crime_victims"
                      collapseSignal={collapseSignal}
                      expandSignal={expandSignal}
                    >
                      <GermanyWhiteNativeVictimsChart iso3={iso3} />
                    </CollapsibleFlagSection>
                  ) : null}
                  <CollapsibleFlagSection
                    title="Migrant data"
                    count={isGermany ? 16 : iso3.toUpperCase() === 'FRA' ? 15 : 7}
                    defaultOpen
                    anchorId="country-sub-crime-migrant"
                    ribbonExpandKey={'sub:crime:crime_migrant'}
                    collapseSignal={crimeCollapseSignal}
                    expandSignal={expandSignal}
                  >
                    {isGermany ? (
                      <GermanyMigrantCrimeSection collapseSignal={collapseSignal} expandSignal={expandSignal} />
                    ) : (
                      <GermanyMigrantCrimeSection
                        collapseSignal={collapseSignal}
                        expandSignal={expandSignal}
                        csvUrl={countryCsvUrl(iso3, 'migrant_crime_requested_metrics')}
                        additionalCsvUrl={countryCsvUrl(iso3, 'migrant_crime_additional_metrics')}
                        isGermany={false}
                      />
                    )}
                  </CollapsibleFlagSection>
                </div>
              </CollapsibleFlagSection>
            </div>

            <div
              style={{ order: sectionOrderIndex('government') }}
            >
              {iso3.toUpperCase() === 'FRA' ? (
                <FranceGovernmentSection
                  collapseSignal={collapseSignal}
                  expandSignal={expandSignal}
                  headerControls={sectionControls('government')}
                />
              ) : treatAsGermany(iso3) ? (
                <GermanyGovernmentSection
                  collapseSignal={collapseSignal}
                  expandSignal={expandSignal}
                  headerControls={sectionControls('government')}
                />
              ) : (
                <GermanyGovernmentSection
                  collapseSignal={collapseSignal}
                  expandSignal={expandSignal}
                  headerControls={sectionControls('government')}
                  csvUrl={countryCsvUrl(iso3, 'government_politics')}
                  isGermany={false}
                />
              )}
            </div>

            <div style={{ order: sectionOrderIndex('military') }}>
              {militaryProfile ? (
                <NationalMilitarySection
                  profile={militaryProfile}
                  collapseSignal={collapseSignal}
                  expandSignal={expandSignal}
                  headerControls={sectionControls('military')}
                />
              ) : (
                <CountryMilitarySection
                  iso3={iso3}
                  countryName={flag.label}
                  collapseSignal={collapseSignal}
                  expandSignal={expandSignal}
                  headerControls={sectionControls('military')}
                />
              )}
            </div>
            </div>

            <section className="wt-deferred-section mt-10 rounded-md border border-line bg-surface-metric p-4 shadow-card ring-1 ring-white/[0.03] sm:p-6">
              <h2 className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
                Sources
              </h2>
              <ul className="mt-4 space-y-3">
                {sources.map((s) => (
                  <li
                    key={s.url}
                    className="flex flex-col gap-1 border-b border-white/[0.06] pb-3 last:border-0 last:pb-0"
                  >
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-xs text-[var(--uk-accent)] hover:text-neutral-200"
                    >
                      {s.name}
                    </a>
                    {s.date ? (
                      <span className="font-sans text-[10px] text-neutral-600">{s.date}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          </>
        ) : null}
          </div>
        </div>
        {germanyRightRailVisible ? (
          <GermanyNewsRail side="right" sections={germanyRightNewsSections} countryLabel={flag.label} />
        ) : null}
      </div>
    </div>
    </CountryRibbonExpandProvider>
  );
}
