import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { Area, AreaChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { FlagEntry } from '../types/flag';
import type { CountryStatMetric } from '../types/countryStats';
import { collectSourceUrlsFromWideRow, wideRowToStatMetrics } from '../lib/countryStatsMetrics';
import { findCorruptionLostRow, insertLostToCorruptionMetric } from '../lib/corruptionLost';
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
import { crimeFromMergedRow, proxyFromMergedRow } from '../lib/mergedCountryStats';
import type { CountryWideRow } from '../lib/parseCountriesWideCsv';
import { indexCountriesByIso3, parseCountriesWideCsv } from '../lib/parseCountriesWideCsv';
import {
  collectCrimeSourceUrls,
  CrimeMetricsSection,
  GermanyTotalRecordedCrimesChart,
  GermanyWhiteNativeVictimsChart,
} from './CrimeMetricsSection';
import { CollapsibleFlagSection } from './CollapsibleFlagSection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from './ui/chart';
import { GermanyImmigrationSection } from './GermanyImmigrationSection';
import { GermanyGovernmentSection } from './GermanyGovernmentSection';
import { GermanyMigrantCrimeSection } from './GermanyMigrantCrimeSection';
import {
  GermanyNewsRail,
  useBundledGermanyNews,
  type GermanyNewsRailSection,
} from './GermanyNewsSidebar';
import { bucketGermanyNewsItems } from '../lib/germanyNews';
import { GERMANY_LABOR_INCOME_GROUP_COUNT } from '../lib/germanyGovernmentPolitics';
import {
  GERMANY_ABORTION_SECTION_GROUP_COUNT,
  GERMANY_HEALTH_BASIC_GROUP_COUNT,
  GERMANY_HEALTH_SUPPRESSION_GROUP_COUNT,
  GERMANY_LGBT_SECTION_GROUP_COUNT,
} from '../lib/germanyHealthCsv';
import { GermanyAbortionStatisticsSection } from './GermanyAbortionStatisticsSection';
import { GermanyHealthBasicSection } from './GermanyHealthBasicSection';
import { GermanyHealthSuppressionSection } from './GermanyHealthSuppressionSection';
import { GermanyLgbtSection } from './GermanyLgbtSection';
import {
  GermanyPoliticsLeftismSection,
  GERMANY_POLITICS_LEFTISM_GROUP_COUNT,
} from './GermanyPoliticsLeftismSection';
import {
  GermanyPoliticsRightWingSection,
  GERMANY_POLITICS_RIGHT_WING_GROUP_COUNT,
} from './GermanyPoliticsRightWingSection';
import {
  GermanyPoliticsZionismSection,
  GERMANY_POLITICS_ZIONISM_GROUP_COUNT,
} from './GermanyPoliticsZionismSection';
import { GermanyLaborIncomeSection } from './GermanyLaborIncomeSection';
import {
  GermanyEconomicStructuralSection,
  GERMANY_ECONOMIC_STRUCTURAL_GROUP_COUNT,
} from './GermanyEconomicStructuralSection';
import {
  GermanyEconomicTaxesSection,
  GERMANY_ECONOMIC_TAXES_GROUP_COUNT,
} from './GermanyEconomicTaxesSection';
import { GermanyTradeSection, GERMANY_TRADE_GROUP_COUNT } from './GermanyTradeSection';
import { GermanyPopulationPyramid } from './GermanyPopulationPyramid';
import { GermanyDaxCarousel } from './GermanyDaxCarousel';
import { GermanyMarriagesSection, GERMANY_MARRIAGES_GROUP_COUNT } from './GermanyMarriagesSection';
import { GermanySexualBehaviorSection, GERMANY_SEXUAL_BEHAVIOR_GROUP_COUNT } from './GermanySexualBehaviorSection';
import germanyForeignStudentsRaw from '../../Assets/Data/Europe/Germany/foreign_students.csv?raw';
import germanyBirthHealthRaw from '../../Assets/Data/Europe/Germany/germany_birth_health_indicators.csv?raw';
import fallbackForeignStudentsRaw from '../../Assets/Data/foreign_student_population_screenshot_countries.csv?raw';
import { CountryPageSectionRibbon } from './CountryPageSectionRibbon';
import { buildCountryRibbonNav } from '../lib/countryRibbonNav';
import {
  CountryRibbonExpandProvider,
  useCountryRibbonExpandController,
} from '../context/CountryRibbonExpandContext';
import {
  getStatSections,
  GERMANY_IMMIGRATION_TOP_METRICS,
  type CustomSubsection,
  type MetricSubsection,
} from '../lib/countryDashboardSections';

const MERGED_CSV_URL = '/data/centralized_merged_country_stats.csv';
const EXPENDITURES_CSV_URL = '/data/expenditures.csv';
const FOREIGN_STUDENTS_CSV_URL = '/data/foreign_student_population_screenshot_countries.csv';
const FOREIGN_STUDENTS_GERMANY_CSV_URL = '/data/germany_foreign_students.csv';
const GERMANY_BIRTH_HEALTH_CSV_URL = '/data/germany_birth_health_indicators.csv';
const CORRUPTION_LOST_CSV_URL = '/data/corruption_money_lost_modeled_estimates.csv';
const MACRO_INDICATORS_CSV_URL = '/data/countries_latest_inflation_unemployment_interest_with_real_median_wage.csv';

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
  'Expenditure breakdown (pie)',
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

function extractLeadingPercent(value: string): number | null {
  const m = value.trim().match(/^([\d.]+)\s*%/);
  if (!m) return null;
  const n = parseFloat(m[1]!);
  return Number.isFinite(n) ? n : null;
}

function isUnavailable(value: string): boolean {
  const v = value.trim();
  return v === '' || v.toUpperCase() === 'N/A';
}

function PercentRing({ percent }: { percent: number }) {
  const r = 38;
  const c = 2 * Math.PI * r;
  const p = Math.min(100, Math.max(0, percent));
  const dash = (p / 100) * c;
  return (
    <svg viewBox="0 0 100 100" className="h-28 w-28 shrink-0 text-[var(--uk-accent)]" aria-hidden>
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        className="text-neutral-800"
      />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c}`}
        transform="rotate(-90 50 50)"
        className="text-[var(--uk-accent)]"
      />
      <text
        x="50"
        y="54"
        textAnchor="middle"
        className="fill-neutral-200 font-sans text-[15px] font-semibold"
      >
        {percent.toFixed(1)}%
      </text>
    </svg>
  );
}

function SourceLinks({ url, className }: { url: string; className: string }) {
  const urls = url
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean);
  if (urls.length === 0) return null;
  if (urls.length === 1) {
    return (
      <a href={urls[0]} target="_blank" rel="noopener noreferrer" className={className}>
        Source ↗
      </a>
    );
  }
  return (
    <ul className="mt-2 flex flex-col gap-1">
      {urls.map((u, i) => (
        <li key={u}>
          <a href={u} target="_blank" rel="noopener noreferrer" className={className}>
            Source {i + 1} ↗
          </a>
        </li>
      ))}
    </ul>
  );
}

function MetaLine({ row }: { row: CountryStatMetric }) {
  const parts = [row.reference_period, row.geography_used].filter(Boolean);
  if (parts.length === 0) return null;
  return (
    <p className="mt-3 font-sans text-[10px] leading-relaxed text-neutral-500">
      {parts.join(' · ')}
    </p>
  );
}

function NoteBlock({ text }: { text: string }) {
  if (!text.trim()) return null;
  return (
    <details className="mt-3 border-t border-white/[0.06] pt-2">
      <summary className="cursor-pointer font-sans text-[10px] uppercase tracking-wider text-neutral-600 hover:text-neutral-400">
        Note
      </summary>
      <p className="mt-2 font-sans text-[10px] leading-relaxed text-neutral-500">{text}</p>
    </details>
  );
}

function MetricTile({
  row,
  largeValue,
  accent,
  extra,
  minHeightClass,
  fixedHeightClass,
  clipOverflow,
}: {
  row: CountryStatMetric;
  largeValue?: boolean;
  accent?: boolean;
  extra?: ReactNode;
  minHeightClass?: string;
  fixedHeightClass?: string;
  clipOverflow?: boolean;
}) {
  const na = isUnavailable(row.value);
  return (
    <article
      className={
        accent
          ? `flex ${fixedHeightClass ?? minHeightClass ?? 'min-h-[148px]'} ${clipOverflow ? 'overflow-hidden' : ''} flex-col rounded-md border border-[var(--uk-accent-border)] bg-[var(--uk-accent-surface)] p-4 shadow-card ring-1 ring-[var(--uk-accent-dim)] sm:p-5`
          : `flex ${fixedHeightClass ?? minHeightClass ?? 'min-h-[148px]'} ${clipOverflow ? 'overflow-hidden' : ''} flex-col rounded-md border border-line bg-surface-metric p-4 shadow-card sm:p-5`
      }
    >
      <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
        {row.metric}
      </p>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <p
            className={
              largeValue
                ? `font-sans tabular-nums text-2xl font-semibold leading-none tracking-tight sm:text-3xl lg:text-4xl ${na ? 'text-neutral-600' : 'text-neutral-100'}`
                : `font-sans tabular-nums text-lg font-medium leading-snug sm:text-xl ${na ? 'text-neutral-600' : 'text-neutral-100'}`
            }
          >
            {na ? 'N/A' : row.value}
          </p>
          {row.value_subtitle && !na ? (
            <p className="mt-1.5 font-sans text-[10px] font-medium leading-snug text-neutral-500">
              {row.value_subtitle}
            </p>
          ) : null}
        </div>
        {extra ? <div className="shrink-0">{extra}</div> : null}
      </div>
      <div className="mt-auto">
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
      </div>
    </article>
  );
}

/** Germany: one card, three stacked breakdown rows (Government spending). */
function ImmigrationWelfareGermanyTile({ row }: { row: CountryStatMetric }) {
  return (
    <article className="flex min-h-[148px] flex-col rounded-md border border-line bg-surface-metric shadow-card p-4 sm:p-5">
      <div className="divide-y divide-white/[0.06]">
        <div className="pb-3">
          <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
            Immigration welfare spending
          </p>
          <p className="mt-2 font-sans text-lg font-semibold leading-tight text-neutral-100 sm:text-xl">
            $28.6B USD
          </p>
          <p className="mt-1 font-sans text-[10px] leading-relaxed text-neutral-500">2023 · Germany</p>
        </div>
        <div className="py-3">
          <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
            Money Given to Immigrant Families
          </p>
          <p className="mt-1.5 font-sans text-base font-medium text-neutral-100 sm:text-lg">€21.7 billion</p>
        </div>
        <div className="pt-3">
          <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
            Money Spent on Immigrants/Refugees
          </p>
          <p className="mt-1.5 font-sans text-base font-medium text-neutral-100 sm:text-lg">€46.6 billion (2025)</p>
        </div>
      </div>
      {row.source_url ? (
        <div className="mt-3 border-t border-white/[0.06] pt-3">
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

/** Health → Birth rates: Destatis / OECD-style childhood weight metrics (DE). */
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

/** Distinct saturated hues (no greys) for expenditure pie + legend swatches. */
const EXPENDITURE_PIE_PALETTE = [
  '#f59e0b',
  '#10b981',
  '#3b82f6',
  '#a855f7',
  '#f43f5e',
  '#06b6d4',
  '#84cc16',
  '#f97316',
  '#8b5cf6',
  '#14b8a6',
  '#eab308',
  '#ec4899',
  '#6366f1',
  '#22d3ee',
  '#4ade80',
  '#fb7185',
];

type PieSlice = { label: string; value: number; detailEurBn?: number };

type GermanyGovSpendCategory = {
  label: string;
  expenditureText: string;
  sharePct: number;
  notes: string;
  color: string;
};

type GermanyGovSpendingSeriesKey =
  | 'total'
  | 'socialProtection'
  | 'health'
  | 'educationResearch'
  | 'defence'
  | 'transportInfrastructure'
  | 'generalPublicServices'
  | 'interestPayments'
  | 'economicAffairsSubsidies'
  | 'other'
  | 'gdpPerCapitaUsd'
  | 'laborProductivityIndex'
  | 'hdi';

type GermanyGovSpendingCategorySeriesKey =
  | 'socialProtection'
  | 'health'
  | 'educationResearch'
  | 'defence'
  | 'transportInfrastructure'
  | 'generalPublicServices'
  | 'interestPayments'
  | 'economicAffairsSubsidies'
  | 'other';

type GermanyGovSpendingSeriesRow = {
  year: string;
  total: number;
  socialProtection: number;
  health: number;
  educationResearch: number;
  defence: number;
  transportInfrastructure: number;
  generalPublicServices: number;
  interestPayments: number;
  economicAffairsSubsidies: number;
  other: number;
  gdpPerCapitaUsd: number;
  laborProductivityIndex: number;
  hdi: number;
};

const GERMANY_GOV_SPEND_TOTAL_2025_EUR_BN = 2259.341;
const GERMANY_GOV_SPEND_CATEGORIES_2025: readonly GermanyGovSpendCategory[] = [
  {
    label: 'Social Benefits & Social Protection',
    expenditureText: '~920 - 950',
    sharePct: 41,
    notes: 'Largest category: pensions, unemployment, long-term care, health insurance subsidies',
    color: '#f59e0b',
  },
  {
    label: 'Health',
    expenditureText: '~280 - 300',
    sharePct: 13,
    notes: 'Strong increase due to medical services and care',
    color: '#6366f1',
  },
  {
    label: 'Education & Research',
    expenditureText: '~205 - 210',
    sharePct: 9.1,
    notes: 'Includes schools, universities, and federal research funding',
    color: '#22c55e',
  },
  {
    label: 'Defence / Military',
    expenditureText: '~86 - 95',
    sharePct: 4,
    notes: 'Significant rise; includes special funds',
    color: '#ef4444',
  },
  {
    label: 'Transport & Infrastructure',
    expenditureText: '~120 - 130',
    sharePct: 5.5,
    notes: 'Major investments via special funds',
    color: '#0ea5e9',
  },
  {
    label: 'General Public Services & Administration',
    expenditureText: '~180 - 200',
    sharePct: 8,
    notes: 'Includes interest payments and general admin',
    color: '#a855f7',
  },
  {
    label: 'Interest Payments on Debt',
    expenditureText: '~50 - 55',
    sharePct: 2.3,
    notes: 'Up 8.1% from previous year',
    color: '#f97316',
  },
  {
    label: 'Housing, Family & Youth',
    expenditureText: '~80 - 90',
    sharePct: 4,
    notes: 'Family benefits, housing subsidies',
    color: '#14b8a6',
  },
  {
    label: 'Economic Affairs & Subsidies',
    expenditureText: '~110 - 120',
    sharePct: 5,
    notes: 'Includes energy transition and business support',
    color: '#84cc16',
  },
  {
    label: 'Other (Environment, Culture, etc.)',
    expenditureText: '~150 - 170',
    sharePct: 7,
    notes: 'Remaining categories',
    color: '#f43f5e',
  },
];

const GERMANY_GOV_SPEND_ADDITIONAL_CARDS: readonly GermanyGovSpendCategory[] = [
  {
    label: 'PUBLIC INVESTMENT',
    expenditureText: '115 - 120',
    sharePct: 5.1,
    notes:
      'Record investments in infrastructure, transport and climate projects (core budget + special funds). SOURCE: Federal Ministry of Finance / Destatis 2025',
    color: '#06b6d4',
  },
  {
    label: 'PENSIONS',
    expenditureText: '380 - 400',
    sharePct: 17,
    notes:
      'Old-age and survivors\' pensions (largest single component of social spending). SOURCE: Destatis / Federal Pension Insurance 2025',
    color: '#eab308',
  },
];

const GERMANY_GOV_SPENDING_SERIES: readonly GermanyGovSpendingSeriesRow[] = [
  { year: '2000', total: 1023.445, socialProtection: 380, health: 110, educationResearch: 85, defence: 28, transportInfrastructure: 45, generalPublicServices: 95, interestPayments: 45, economicAffairsSubsidies: 55, other: 118, gdpPerCapitaUsd: 23926, laborProductivityIndex: 100.0, hdi: 0.897 },
  { year: '2001', total: 1046.229, socialProtection: 385, health: 112, educationResearch: 87, defence: 28, transportInfrastructure: 46, generalPublicServices: 97, interestPayments: 46, economicAffairsSubsidies: 55, other: 120, gdpPerCapitaUsd: 23878, laborProductivityIndex: 101.2, hdi: 0.904 },
  { year: '2002', total: 1072.638, socialProtection: 395, health: 115, educationResearch: 89, defence: 29, transportInfrastructure: 47, generalPublicServices: 98, interestPayments: 45, economicAffairsSubsidies: 56, other: 119, gdpPerCapitaUsd: 25487, laborProductivityIndex: 102.5, hdi: 0.91 },
  { year: '2003', total: 1087.101, socialProtection: 400, health: 118, educationResearch: 90, defence: 29, transportInfrastructure: 48, generalPublicServices: 100, interestPayments: 44, economicAffairsSubsidies: 57, other: 117, gdpPerCapitaUsd: 30711, laborProductivityIndex: 103.8, hdi: 0.916 },
  { year: '2004', total: 1077.08, socialProtection: 395, health: 120, educationResearch: 91, defence: 28, transportInfrastructure: 47, generalPublicServices: 98, interestPayments: 42, economicAffairsSubsidies: 55, other: 117, gdpPerCapitaUsd: 34567, laborProductivityIndex: 105.1, hdi: 0.921 },
  { year: '2005', total: 1089.993, socialProtection: 400, health: 122, educationResearch: 92, defence: 28, transportInfrastructure: 48, generalPublicServices: 99, interestPayments: 40, economicAffairsSubsidies: 56, other: 117, gdpPerCapitaUsd: 35084, laborProductivityIndex: 106.5, hdi: 0.926 },
  { year: '2006', total: 1099.274, socialProtection: 400, health: 125, educationResearch: 93, defence: 28, transportInfrastructure: 48, generalPublicServices: 100, interestPayments: 38, economicAffairsSubsidies: 55, other: 118, gdpPerCapitaUsd: 36980, laborProductivityIndex: 108.4, hdi: 0.93 },
  { year: '2007', total: 1106.879, socialProtection: 405, health: 128, educationResearch: 95, defence: 28, transportInfrastructure: 49, generalPublicServices: 102, interestPayments: 38, economicAffairsSubsidies: 55, other: 118, gdpPerCapitaUsd: 42351, laborProductivityIndex: 110.2, hdi: 0.934 },
  { year: '2008', total: 1150.28, socialProtection: 415, health: 135, educationResearch: 98, defence: 29, transportInfrastructure: 52, generalPublicServices: 105, interestPayments: 40, economicAffairsSubsidies: 58, other: 124, gdpPerCapitaUsd: 46386, laborProductivityIndex: 110.8, hdi: 0.936 },
  { year: '2009', total: 1204.819, socialProtection: 450, health: 145, educationResearch: 105, defence: 30, transportInfrastructure: 55, generalPublicServices: 110, interestPayments: 38, economicAffairsSubsidies: 70, other: 110, gdpPerCapitaUsd: 42487, laborProductivityIndex: 107.5, hdi: 0.935 },
  { year: '2010', total: 1258.707, socialProtection: 445, health: 148, educationResearch: 107, defence: 31, transportInfrastructure: 54, generalPublicServices: 108, interestPayments: 35, economicAffairsSubsidies: 65, other: 113, gdpPerCapitaUsd: 42410, laborProductivityIndex: 110.0, hdi: 0.936 },
  { year: '2011', total: 1244.063, socialProtection: 460, health: 155, educationResearch: 110, defence: 32, transportInfrastructure: 58, generalPublicServices: 115, interestPayments: 38, economicAffairsSubsidies: 70, other: 136, gdpPerCapitaUsd: 47647, laborProductivityIndex: 112.5, hdi: 0.938 },
  { year: '2012', total: 1262.507, socialProtection: 465, health: 158, educationResearch: 112, defence: 33, transportInfrastructure: 58, generalPublicServices: 115, interestPayments: 35, economicAffairsSubsidies: 68, other: 132, gdpPerCapitaUsd: 44736, laborProductivityIndex: 113.2, hdi: 0.94 },
  { year: '2013', total: 1294.6, socialProtection: 480, health: 165, educationResearch: 115, defence: 33, transportInfrastructure: 60, generalPublicServices: 118, interestPayments: 32, economicAffairsSubsidies: 70, other: 139, gdpPerCapitaUsd: 47220, laborProductivityIndex: 114.0, hdi: 0.942 },
  { year: '2014', total: 1328.332, socialProtection: 490, health: 170, educationResearch: 118, defence: 33, transportInfrastructure: 62, generalPublicServices: 120, interestPayments: 30, economicAffairsSubsidies: 72, other: 142, gdpPerCapitaUsd: 48971, laborProductivityIndex: 115.1, hdi: 0.944 },
  { year: '2015', total: 1373.293, socialProtection: 505, health: 178, educationResearch: 122, defence: 34, transportInfrastructure: 65, generalPublicServices: 125, interestPayments: 28, economicAffairsSubsidies: 75, other: 141, gdpPerCapitaUsd: 41911, laborProductivityIndex: 116.3, hdi: 0.948 },
  { year: '2016', total: 1429.256, socialProtection: 525, health: 185, educationResearch: 128, defence: 35, transportInfrastructure: 68, generalPublicServices: 130, interestPayments: 25, economicAffairsSubsidies: 78, other: 152, gdpPerCapitaUsd: 42961, laborProductivityIndex: 117.8, hdi: 0.95 },
  { year: '2017', total: 1484.552, socialProtection: 540, health: 192, educationResearch: 132, defence: 37, transportInfrastructure: 70, generalPublicServices: 135, interestPayments: 25, economicAffairsSubsidies: 80, other: 157, gdpPerCapitaUsd: 45527, laborProductivityIndex: 119.5, hdi: 0.952 },
  { year: '2018', total: 1533.328, socialProtection: 560, health: 200, educationResearch: 138, defence: 40, transportInfrastructure: 75, generalPublicServices: 140, interestPayments: 28, economicAffairsSubsidies: 85, other: 163, gdpPerCapitaUsd: 48916, laborProductivityIndex: 120.8, hdi: 0.954 },
  { year: '2019', total: 1610.615, socialProtection: 585, health: 210, educationResearch: 145, defence: 43, transportInfrastructure: 80, generalPublicServices: 145, interestPayments: 30, economicAffairsSubsidies: 88, other: 172, gdpPerCapitaUsd: 47656, laborProductivityIndex: 121.5, hdi: 0.951 },
  { year: '2020', total: 1763.784, socialProtection: 650, health: 230, educationResearch: 155, defence: 45, transportInfrastructure: 95, generalPublicServices: 160, interestPayments: 25, economicAffairsSubsidies: 120, other: 199, gdpPerCapitaUsd: 47395, laborProductivityIndex: 118.0, hdi: 0.955 },
  { year: '2021', total: 1865.819, socialProtection: 700, health: 245, educationResearch: 165, defence: 48, transportInfrastructure: 105, generalPublicServices: 170, interestPayments: 28, economicAffairsSubsidies: 130, other: 229, gdpPerCapitaUsd: 52349, laborProductivityIndex: 122.0, hdi: 0.958 },
  { year: '2022', total: 1939.208, socialProtection: 720, health: 255, educationResearch: 170, defence: 55, transportInfrastructure: 110, generalPublicServices: 175, interestPayments: 35, economicAffairsSubsidies: 125, other: 230, gdpPerCapitaUsd: 50507, laborProductivityIndex: 122.8, hdi: 0.95 },
  { year: '2023', total: 2031.433, socialProtection: 780, health: 270, educationResearch: 185, defence: 70, transportInfrastructure: 115, generalPublicServices: 180, interestPayments: 45, economicAffairsSubsidies: 130, other: 225, gdpPerCapitaUsd: 54777, laborProductivityIndex: 123.5, hdi: 0.955 },
  { year: '2024', total: 2139.717, socialProtection: 810, health: 280, educationResearch: 195, defence: 80, transportInfrastructure: 120, generalPublicServices: 185, interestPayments: 50, economicAffairsSubsidies: 115, other: 235, gdpPerCapitaUsd: 56104, laborProductivityIndex: 124.2, hdi: 0.958 },
  { year: '2025', total: 2259.341, socialProtection: 930, health: 295, educationResearch: 205, defence: 92, transportInfrastructure: 125, generalPublicServices: 190, interestPayments: 53, economicAffairsSubsidies: 118, other: 251, gdpPerCapitaUsd: 57500, laborProductivityIndex: 124.8, hdi: 0.959 },
] as const;

const GERMANY_GOV_SPENDING_LINE_CONFIG = {
  total: { label: 'Total Expenditure', color: '#f59e0b' },
  socialProtection: { label: 'Social Protection', color: '#22c55e' },
  health: { label: 'Health', color: '#60a5fa' },
  educationResearch: { label: 'Education & Research', color: '#c084fc' },
  defence: { label: 'Defence', color: '#ef4444' },
  transportInfrastructure: { label: 'Transport & Infrastructure', color: '#0ea5e9' },
  generalPublicServices: { label: 'General Public Services', color: '#a855f7' },
  interestPayments: { label: 'Interest Payments', color: '#f97316' },
  economicAffairsSubsidies: { label: 'Economic Affairs & Subsidies', color: '#84cc16' },
  other: { label: 'Other', color: '#f43f5e' },
  gdpPerCapitaUsd: { label: 'GDP per Capita (USD, nominal)', color: '#22d3ee' },
  laborProductivityIndex: { label: 'Labor Productivity (Index 2000=100)', color: '#eab308' },
  hdi: { label: 'HDI', color: '#a78bfa' },
} satisfies ChartConfig;

const GERMANY_GOV_SPENDING_CATEGORY_SERIES_ORDER: readonly GermanyGovSpendingCategorySeriesKey[] = [
  'socialProtection',
  'health',
  'educationResearch',
  'defence',
  'transportInfrastructure',
  'generalPublicServices',
  'interestPayments',
  'economicAffairsSubsidies',
  'other',
];

const GERMANY_GOV_SPENDING_EXTRA_CARD_COUNT = 16;

function ExpenditurePieTile({ row }: { row: CountryStatMetric }) {
  let slices: PieSlice[] = [];
  try {
    if (row.value.trim() && row.value.trim() !== 'N/A') {
      const parsed = JSON.parse(row.value) as PieSlice[];
      if (Array.isArray(parsed))
        slices = parsed.filter((s) => s && Number.isFinite(s.value) && s.value > 0);
    }
  } catch {
    slices = [];
  }

  if (row.geography_used.toUpperCase().includes('GERMANY')) {
    slices = GERMANY_GOV_SPEND_CATEGORIES_2025.map((c) => ({
      label: c.label,
      value: c.sharePct,
      detailEurBn: (GERMANY_GOV_SPEND_TOTAL_2025_EUR_BN * c.sharePct) / 100,
    }));
  }

  /** Germany combined pie: weight slices by €bn (`detailEurBn`). Legacy OECD pie: `value` is already %. */
  const useEurBnWeights =
    slices.length > 0 &&
    slices.every((s) => typeof s.detailEurBn === 'number' && Number.isFinite(s.detailEurBn) && s.detailEurBn > 0);

  const chartData = slices.map((s, i) => ({
    name: s.label,
    pieValue: useEurBnWeights ? (s.detailEurBn as number) : s.value,
    pctOfTotal: s.value,
    detailEurBn: s.detailEurBn,
    fill: EXPENDITURE_PIE_PALETTE[i % EXPENDITURE_PIE_PALETTE.length],
  }));

  const chartConfig: ChartConfig = slices.reduce((acc, s, i) => {
    const key = `slice_${i}`;
    acc[key] = { label: s.label, color: EXPENDITURE_PIE_PALETTE[i % EXPENDITURE_PIE_PALETTE.length] };
    return acc;
  }, {} as ChartConfig);

  return (
    <article className="col-span-full w-full rounded-md border border-line bg-surface-metric shadow-card p-4 sm:p-5">
      <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
        {row.metric}
      </p>
      {slices.length > 0 ? (
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-center lg:gap-10">
          <ChartContainer config={chartConfig} className="mx-auto h-[300px] w-full max-w-[360px] shrink-0 sm:max-w-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="pieValue"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={116}
                  paddingAngle={0.4}
                  stroke="none"
                >
                  {chartData.map((entry, i) => (
                    <Cell key={`cell-${entry.name}-${i}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a0a0a',
                    border: '1px solid #404040',
                    borderRadius: '4px',
                    fontFamily: 'ui-monospace, monospace',
                    fontSize: '11px',
                  }}
                  formatter={(value, _name, item) => {
                    const payload = item?.payload as
                      | (PieSlice & { fill: string; pieValue?: number; pctOfTotal?: number })
                      | undefined;
                    const pct = payload?.pctOfTotal;
                    const d = payload?.detailEurBn;
                    if (typeof pct === 'number' && Number.isFinite(pct)) {
                      if (typeof d === 'number' && Number.isFinite(d)) {
                        return [`${pct.toFixed(2)}% of combined (~${d.toFixed(1)} €bn)`, 'Share'];
                      }
                      return [`${pct.toFixed(2)}%`, 'Share'];
                    }
                    const v = typeof value === 'number' ? value : Number(value);
                    return [`${Number.isFinite(v) ? v.toFixed(2) : '—'}%`, 'Share'];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <ul className="min-w-0 flex-1 space-y-1.5">
            {slices.map((s, i) => (
              <li key={s.label} className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 font-sans text-[11px] text-neutral-300">
                <span
                  className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-sm"
                  style={{ backgroundColor: EXPENDITURE_PIE_PALETTE[i % EXPENDITURE_PIE_PALETTE.length] }}
                />
                <span className="min-w-0 flex-1 break-words">{s.label}</span>
                <span className="shrink-0 text-neutral-500">{s.value.toFixed(1)}%</span>
                {typeof s.detailEurBn === 'number' && Number.isFinite(s.detailEurBn) ? (
                  <span className="w-full pl-5 font-sans text-[10px] text-neutral-600 sm:pl-0 sm:w-auto sm:pl-2">
                    ~{s.detailEurBn.toFixed(0)} €bn
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-4 font-sans text-sm text-neutral-500">No percentage split available.</p>
      )}
      <MetaLine row={row} />
      <NoteBlock text={row.notes} />
    </article>
  );
}

const GERMANY_GOV_TOTAL_EXPENDITURE_CHART_CONFIG = {
  total: { label: 'Total government expenditure', color: '#f59e0b' },
} satisfies ChartConfig;

function GermanyGovernmentSpendingSummaryTile() {
  return (
    <Card className="col-span-full border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2 sm:p-5 sm:pb-3">
        <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          Total Government Expenditure
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0 sm:p-5 sm:pt-0">
        <p className="font-sans text-2xl font-semibold tracking-tight text-neutral-100 sm:text-3xl">
          €2,259.3 billion
        </p>
        <p className="font-sans text-[10px] uppercase tracking-[0.03em] text-neutral-500">(2025)</p>
        <p className="font-sans text-[11px] leading-relaxed text-neutral-300">
          Spending increased by 5.6% (+€119.6 billion) compared to 2024.
        </p>
        <p className="font-sans text-[11px] leading-relaxed text-neutral-300">
          The year ended with a general government deficit of €119.1 billion.
        </p>
      </CardContent>
    </Card>
  );
}

function GermanyGovernmentTotalExpenditureChart() {
  return (
    <Card className="col-span-full border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2 sm:p-5 sm:pb-3">
        <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          Total government expenditure
        </CardTitle>
        <CardDescription className="font-sans text-[10px] text-neutral-500">
          Billions of euros (€bn), 2000–2025.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0">
        <ChartContainer config={GERMANY_GOV_TOTAL_EXPENDITURE_CHART_CONFIG} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={GERMANY_GOV_SPENDING_SERIES} margin={{ top: 8, right: 10, left: 12, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `€${Number(v).toFixed(0)}B`}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                width={76}
                domain={['auto', 'auto']}
              />
              <ChartTooltip
                cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                content={
                  <ChartTooltipContent
                    className="rounded-md"
                    formatter={(value) =>
                      `€${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 3 })}B`
                    }
                    labelFormatter={(label) => `Year ${String(label)}`}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.12}
                strokeWidth={2}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function GermanyGovernmentSpendingCategoryCards() {
  const cards = [...GERMANY_GOV_SPEND_CATEGORIES_2025, ...GERMANY_GOV_SPEND_ADDITIONAL_CARDS];
  return (
    <div className="col-span-full grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((category) => (
        <Card key={category.label} className="overflow-hidden border-line bg-surface-metric shadow-card">
          <CardHeader className="space-y-1 p-3 pb-1.5">
            <CardTitle className="font-sans text-xs font-semibold leading-snug text-neutral-100">
              {category.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-3 pt-0">
            <p className="font-sans text-xl font-semibold tabular-nums tracking-tight text-white sm:text-2xl">
              €{category.expenditureText}B
            </p>
            <div className="h-2 w-full rounded-full bg-white/[0.08]">
              <div
                className="h-full rounded-full"
                style={{ width: `${Math.max(2, Math.min(100, category.sharePct))}%`, backgroundColor: category.color }}
              />
            </div>
            <div className="flex items-center gap-2 font-sans text-[11px] text-neutral-300">
              <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: category.color }} />
              <span>{category.sharePct.toFixed(1)}% of total</span>
            </div>
            <p className="font-sans text-[10px] leading-relaxed text-neutral-500">{category.notes}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function GermanyGovernmentSpendingTotalLineChart() {
  const [hovered, setHovered] = useState<GermanyGovSpendingSeriesKey | null>(null);
  const activeKey: GermanyGovSpendingSeriesKey = hovered ?? 'total';
  const formatAxisByKey = (key: GermanyGovSpendingSeriesKey, value: number): string => {
    if (key === 'gdpPerCapitaUsd') return `$${Math.round(value).toLocaleString('en-US')}`;
    if (key === 'hdi') return value.toFixed(3);
    if (key === 'laborProductivityIndex') return value.toFixed(1);
    return `€${Math.round(value).toLocaleString('en-US')}B`;
  };
  const seriesKeys: readonly GermanyGovSpendingSeriesKey[] = [
    'total',
    'gdpPerCapitaUsd',
    'laborProductivityIndex',
    'hdi',
  ];

  const axisIdByKey: Record<GermanyGovSpendingSeriesKey, string> = {
    total: 'axis_total',
    socialProtection: 'axis_socialProtection',
    health: 'axis_health',
    educationResearch: 'axis_educationResearch',
    defence: 'axis_defence',
    transportInfrastructure: 'axis_transportInfrastructure',
    generalPublicServices: 'axis_generalPublicServices',
    interestPayments: 'axis_interestPayments',
    economicAffairsSubsidies: 'axis_economicAffairsSubsidies',
    other: 'axis_other',
    gdpPerCapitaUsd: 'axis_gdpPerCapitaUsd',
    laborProductivityIndex: 'axis_laborProductivityIndex',
    hdi: 'axis_hdi',
  };
  const axisLabelByKey: Record<GermanyGovSpendingSeriesKey, string> = {
    total: 'Government expenditure (€bn)',
    socialProtection: 'Government expenditure (€bn)',
    health: 'Government expenditure (€bn)',
    educationResearch: 'Government expenditure (€bn)',
    defence: 'Government expenditure (€bn)',
    transportInfrastructure: 'Government expenditure (€bn)',
    generalPublicServices: 'Government expenditure (€bn)',
    interestPayments: 'Government expenditure (€bn)',
    economicAffairsSubsidies: 'Government expenditure (€bn)',
    other: 'Government expenditure (€bn)',
    gdpPerCapitaUsd: 'GDP per capita (USD)',
    laborProductivityIndex: 'Labor productivity (Index 2000=100)',
    hdi: 'HDI',
  };
  const activeValues = GERMANY_GOV_SPENDING_SERIES.map((row) => Number(row[activeKey]));
  const activeMin = Math.min(...activeValues);
  const activeMax = Math.max(...activeValues);
  const padding = activeKey === 'hdi' ? 0.01 : Math.max((activeMax - activeMin) * 0.08, 1);
  const contextDomain: [number, number] = [activeMin - padding, activeMax + padding];
  const stroke = (k: GermanyGovSpendingSeriesKey) =>
    hovered !== null && hovered !== k ? '#737373' : String(GERMANY_GOV_SPENDING_LINE_CONFIG[k].color);
  const opacity = (k: GermanyGovSpendingSeriesKey) => (hovered !== null && hovered !== k ? 0.28 : 1);
  const width = (k: GermanyGovSpendingSeriesKey) => (hovered === k ? 3 : 2.2);

  return (
    <Card className="col-span-full border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2 sm:p-5 sm:pb-3">
        <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          Government Expenditure Trends in Context
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0 sm:p-5 sm:pt-0" onMouseLeave={() => setHovered(null)}>
        <ChartContainer config={GERMANY_GOV_SPENDING_LINE_CONFIG} className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={GERMANY_GOV_SPENDING_SERIES} margin={{ top: 8, right: 10, left: 20, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="year" tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }} axisLine={false} tickLine={false} />
              <YAxis
                tickFormatter={(v) => formatAxisByKey(activeKey, Number(v))}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                width={104}
                domain={contextDomain}
                allowDataOverflow
                label={{
                  value: axisLabelByKey[activeKey],
                  angle: -90,
                  position: 'insideLeft',
                  fill: 'rgba(163,163,163,0.65)',
                  fontSize: 9,
                }}
              />
              {seriesKeys.map((key) => (
                <YAxis
                  key={key}
                  yAxisId={axisIdByKey[key]}
                  hide
                  tickFormatter={(v) => formatAxisByKey(key, Number(v))}
                  tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                  axisLine={false}
                  tickLine={false}
                  width={104}
                  domain={['auto', 'auto']}
                />
              ))}
              <ChartTooltip
                cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                content={
                  <ChartTooltipContent
                    className="rounded-md"
                    formatter={(value, name) => {
                      const n = Number(value);
                      const lineName = String(name);
                      if (lineName.includes('GDP per Capita')) return `$${Math.round(n).toLocaleString('en-US')}`;
                      if (lineName.includes('Labor Productivity')) return n.toFixed(1);
                      if (lineName === 'HDI') return n.toFixed(3);
                      return `€${n.toFixed(1)}B`;
                    }}
                    labelFormatter={(label) => `Year ${String(label)}`}
                  />
                }
              />
              <Legend wrapperStyle={{ fontSize: '11px', color: 'rgba(212,212,212,0.9)' }} iconType="line" />
              <Line type="monotone" yAxisId={axisIdByKey.total} dataKey="total" name={GERMANY_GOV_SPENDING_LINE_CONFIG.total.label} stroke={stroke('total')} strokeOpacity={opacity('total')} strokeWidth={width('total')} dot={false} activeDot={{ r: 5 }} isAnimationActive={false} onMouseEnter={() => setHovered('total')} />
              <Line type="monotone" yAxisId={axisIdByKey.gdpPerCapitaUsd} dataKey="gdpPerCapitaUsd" name={GERMANY_GOV_SPENDING_LINE_CONFIG.gdpPerCapitaUsd.label} stroke={stroke('gdpPerCapitaUsd')} strokeOpacity={opacity('gdpPerCapitaUsd')} strokeWidth={width('gdpPerCapitaUsd')} dot={false} activeDot={{ r: 5 }} isAnimationActive={false} onMouseEnter={() => setHovered('gdpPerCapitaUsd')} />
              <Line type="monotone" yAxisId={axisIdByKey.laborProductivityIndex} dataKey="laborProductivityIndex" name={GERMANY_GOV_SPENDING_LINE_CONFIG.laborProductivityIndex.label} stroke={stroke('laborProductivityIndex')} strokeOpacity={opacity('laborProductivityIndex')} strokeWidth={width('laborProductivityIndex')} dot={false} activeDot={{ r: 5 }} isAnimationActive={false} onMouseEnter={() => setHovered('laborProductivityIndex')} />
              <Line type="monotone" yAxisId={axisIdByKey.hdi} dataKey="hdi" name={GERMANY_GOV_SPENDING_LINE_CONFIG.hdi.label} stroke={stroke('hdi')} strokeOpacity={opacity('hdi')} strokeWidth={width('hdi')} dot={false} activeDot={{ r: 5 }} isAnimationActive={false} onMouseEnter={() => setHovered('hdi')} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function GermanyGovernmentSpendingCategoryLineChart() {
  const [hovered, setHovered] = useState<GermanyGovSpendingSeriesKey | null>(null);
  const stroke = (k: GermanyGovSpendingSeriesKey) =>
    hovered !== null && hovered !== k ? '#737373' : String(GERMANY_GOV_SPENDING_LINE_CONFIG[k].color);
  const opacity = (k: GermanyGovSpendingSeriesKey) => (hovered !== null && hovered !== k ? 0.28 : 1);
  const width = (k: GermanyGovSpendingSeriesKey) => (hovered === k ? 3 : 2.1);

  return (
    <Card className="col-span-full border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2 sm:p-5 sm:pb-3">
        <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          Government Expenditure By Category (2000-2025)
        </CardTitle>
        <CardDescription className="font-sans text-[10px] text-neutral-500">
          Hover a line to focus it; other lines are greyed out.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0 sm:p-5 sm:pt-0" onMouseLeave={() => setHovered(null)}>
        <ChartContainer config={GERMANY_GOV_SPENDING_LINE_CONFIG} className="h-[420px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={GERMANY_GOV_SPENDING_SERIES} margin={{ top: 8, right: 10, left: 12, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="year" tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }} axisLine={false} tickLine={false} />
              <YAxis
                tickFormatter={(v) => `€${Number(v).toFixed(0)}B`}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                width={72}
                domain={['auto', 'auto']}
              />
              <ChartTooltip
                cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                content={<ChartTooltipContent className="rounded-md" formatter={(value) => `€${Number(value).toFixed(1)}B`} labelFormatter={(label) => `Year ${String(label)}`} />}
              />
              {GERMANY_GOV_SPENDING_CATEGORY_SERIES_ORDER.map((key) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={GERMANY_GOV_SPENDING_LINE_CONFIG[key].label}
                  stroke={stroke(key)}
                  strokeOpacity={opacity(key)}
                  strokeWidth={width(key)}
                  dot={false}
                  activeDot={{ r: hovered === key ? 5 : 4 }}
                  isAnimationActive={false}
                  onMouseEnter={() => setHovered(key)}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
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

function MedianAgeGermanyTile({ row }: { row: CountryStatMetric }) {
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
        (one of the oldest populations in Europe)
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
      out.push(<MedianAgeGermanyTile key={row.metric} row={row} />);
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

const STAT_GRID = 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3';

type RenderStatTileOpts = { foreignStudentsPieCompact?: boolean; iso3?: string; compactBirthRates?: boolean };

type GermanyGdpRow = { year: string; gdp: number; gdpPerCapita: number };

const GERMANY_GDP_SERIES: readonly GermanyGdpRow[] = [
  { year: '2015', gdp: 3425, gdpPerCapita: 41911 },
  { year: '2016', gdp: 3537, gdpPerCapita: 42961 },
  { year: '2017', gdp: 3765, gdpPerCapita: 45527 },
  { year: '2018', gdp: 4055, gdpPerCapita: 48916 },
  { year: '2019', gdp: 3960, gdpPerCapita: 47624 },
  { year: '2020', gdp: 3941, gdpPerCapita: 47380 },
  { year: '2021', gdp: 4355, gdpPerCapita: 52266 },
  { year: '2022', gdp: 4082, gdpPerCapita: 49686 },
  { year: '2023', gdp: 4456, gdpPerCapita: 54343 },
  { year: '2024', gdp: 4686, gdpPerCapita: 56104 },
  { year: '2025', gdp: 5014, gdpPerCapita: 60000 },
];

type GermanyInflationSeriesRow = { year: string; inflation: number };

const GERMANY_INFLATION_SERIES: readonly GermanyInflationSeriesRow[] = [
  { year: '2000', inflation: 1.44 },
  { year: '2001', inflation: 1.98 },
  { year: '2002', inflation: 1.42 },
  { year: '2003', inflation: 1.03 },
  { year: '2004', inflation: 1.67 },
  { year: '2005', inflation: 1.55 },
  { year: '2006', inflation: 1.58 },
  { year: '2007', inflation: 2.3 },
  { year: '2008', inflation: 2.63 },
  { year: '2009', inflation: 0.31 },
  { year: '2010', inflation: 1.1 },
  { year: '2011', inflation: 2.08 },
  { year: '2012', inflation: 2.01 },
  { year: '2013', inflation: 1.5 },
  { year: '2014', inflation: 0.91 },
  { year: '2015', inflation: 0.51 },
  { year: '2016', inflation: 0.49 },
  { year: '2017', inflation: 1.51 },
  { year: '2018', inflation: 1.73 },
  { year: '2019', inflation: 1.45 },
  { year: '2020', inflation: 0.14 },
  { year: '2021', inflation: 3.07 },
  { year: '2022', inflation: 6.87 },
  { year: '2023', inflation: 5.95 },
  { year: '2024', inflation: 2.26 },
  { year: '2025', inflation: 2.2 },
];

type GermanyBirthsSeriesRow = {
  year: string;
  totalLiveBirths: number;
  birthsGermanMothers: number;
  birthsForeignMothers: number;
  shareGermanMothersPct: number;
  isEstimate?: boolean;
};

type GermanyBirthRatesExtraCard = {
  title: string;
  value: string;
  details?: string;
  source?: string;
  category?: 'diseases';
};

const GERMANY_TOTAL_BIRTHS_SERIES: readonly GermanyBirthsSeriesRow[] = [
  { year: '2000', totalLiveBirths: 766999, birthsGermanMothers: 629000, birthsForeignMothers: 137999, shareGermanMothersPct: 82.0 },
  { year: '2001', totalLiveBirths: 734475, birthsGermanMothers: 602000, birthsForeignMothers: 132475, shareGermanMothersPct: 82.0 },
  { year: '2002', totalLiveBirths: 719250, birthsGermanMothers: 589000, birthsForeignMothers: 130250, shareGermanMothersPct: 81.9 },
  { year: '2003', totalLiveBirths: 706721, birthsGermanMothers: 579000, birthsForeignMothers: 127721, shareGermanMothersPct: 81.9 },
  { year: '2004', totalLiveBirths: 705622, birthsGermanMothers: 577000, birthsForeignMothers: 128622, shareGermanMothersPct: 81.8 },
  { year: '2005', totalLiveBirths: 692239, birthsGermanMothers: 565000, birthsForeignMothers: 127239, shareGermanMothersPct: 81.6 },
  { year: '2006', totalLiveBirths: 672724, birthsGermanMothers: 548000, birthsForeignMothers: 124724, shareGermanMothersPct: 81.5 },
  { year: '2007', totalLiveBirths: 684862, birthsGermanMothers: 557000, birthsForeignMothers: 127862, shareGermanMothersPct: 81.3 },
  { year: '2008', totalLiveBirths: 682514, birthsGermanMothers: 554000, birthsForeignMothers: 128514, shareGermanMothersPct: 81.2 },
  { year: '2009', totalLiveBirths: 665126, birthsGermanMothers: 539000, birthsForeignMothers: 126126, shareGermanMothersPct: 81.0 },
  { year: '2010', totalLiveBirths: 677947, birthsGermanMothers: 540000, birthsForeignMothers: 137947, shareGermanMothersPct: 79.7 },
  { year: '2011', totalLiveBirths: 662685, birthsGermanMothers: 527000, birthsForeignMothers: 135685, shareGermanMothersPct: 79.5 },
  { year: '2012', totalLiveBirths: 673544, birthsGermanMothers: 533000, birthsForeignMothers: 140544, shareGermanMothersPct: 79.1 },
  { year: '2013', totalLiveBirths: 682069, birthsGermanMothers: 537000, birthsForeignMothers: 145069, shareGermanMothersPct: 78.7 },
  { year: '2014', totalLiveBirths: 714966, birthsGermanMothers: 558000, birthsForeignMothers: 156966, shareGermanMothersPct: 78.0 },
  { year: '2015', totalLiveBirths: 738819, birthsGermanMothers: 579000, birthsForeignMothers: 159819, shareGermanMothersPct: 78.4 },
  { year: '2016', totalLiveBirths: 792141, birthsGermanMothers: 610000, birthsForeignMothers: 182141, shareGermanMothersPct: 77.0 },
  { year: '2017', totalLiveBirths: 784901, birthsGermanMothers: 600000, birthsForeignMothers: 184901, shareGermanMothersPct: 76.4 },
  { year: '2018', totalLiveBirths: 787523, birthsGermanMothers: 595000, birthsForeignMothers: 192523, shareGermanMothersPct: 75.6 },
  { year: '2019', totalLiveBirths: 779000, birthsGermanMothers: 590000, birthsForeignMothers: 189000, shareGermanMothersPct: 75.7 },
  { year: '2020', totalLiveBirths: 773144, birthsGermanMothers: 582000, birthsForeignMothers: 191144, shareGermanMothersPct: 75.3 },
  { year: '2021', totalLiveBirths: 795492, birthsGermanMothers: 590000, birthsForeignMothers: 205492, shareGermanMothersPct: 74.2 },
  { year: '2022', totalLiveBirths: 738819, birthsGermanMothers: 545000, birthsForeignMothers: 193819, shareGermanMothersPct: 73.8 },
  { year: '2023', totalLiveBirths: 692989, birthsGermanMothers: 500670, birthsForeignMothers: 192319, shareGermanMothersPct: 72.3 },
  { year: '2024', totalLiveBirths: 677117, birthsGermanMothers: 482796, birthsForeignMothers: 194321, shareGermanMothersPct: 71.3 },
  { year: '2025', totalLiveBirths: 660000, birthsGermanMothers: 465000, birthsForeignMothers: 195000, shareGermanMothersPct: 70.5, isEstimate: true },
] as const;

type GermanyBirthsByRaceRow = {
  year: string;
  germanNativeNoMigrationBg: number;
  europeanNonGerman: number;
  african: number;
  asian: number;
  southAmerican: number;
  northAmerican: number;
  otherUnknown: number;
};

/** Birth counts by parental / regional origin grouping (2000–2025). */
const GERMANY_BIRTHS_BY_RACE_SERIES: readonly GermanyBirthsByRaceRow[] = [
  { year: '2000', germanNativeNoMigrationBg: 620000, europeanNonGerman: 85000, african: 12000, asian: 18000, southAmerican: 3500, northAmerican: 4500, otherUnknown: 28000 },
  { year: '2001', germanNativeNoMigrationBg: 590000, europeanNonGerman: 86000, african: 12500, asian: 18500, southAmerican: 3600, northAmerican: 4600, otherUnknown: 28500 },
  { year: '2002', germanNativeNoMigrationBg: 575000, europeanNonGerman: 87000, african: 13000, asian: 19000, southAmerican: 3700, northAmerican: 4700, otherUnknown: 29000 },
  { year: '2003', germanNativeNoMigrationBg: 560000, europeanNonGerman: 88000, african: 13500, asian: 20000, southAmerican: 3800, northAmerican: 4800, otherUnknown: 29500 },
  { year: '2004', germanNativeNoMigrationBg: 555000, europeanNonGerman: 90000, african: 14000, asian: 21000, southAmerican: 3900, northAmerican: 4900, otherUnknown: 30000 },
  { year: '2005', germanNativeNoMigrationBg: 535000, europeanNonGerman: 92000, african: 14500, asian: 22000, southAmerican: 4000, northAmerican: 5000, otherUnknown: 31000 },
  { year: '2006', germanNativeNoMigrationBg: 520000, europeanNonGerman: 95000, african: 15500, asian: 24000, southAmerican: 4200, northAmerican: 5200, otherUnknown: 32500 },
  { year: '2007', germanNativeNoMigrationBg: 520000, europeanNonGerman: 98000, african: 16500, asian: 26000, southAmerican: 4500, northAmerican: 5500, otherUnknown: 34000 },
  { year: '2008', germanNativeNoMigrationBg: 510000, europeanNonGerman: 102000, african: 17500, asian: 28000, southAmerican: 4800, northAmerican: 5800, otherUnknown: 35500 },
  { year: '2009', germanNativeNoMigrationBg: 495000, europeanNonGerman: 105000, african: 18500, asian: 30000, southAmerican: 5100, northAmerican: 6100, otherUnknown: 37000 },
  { year: '2010', germanNativeNoMigrationBg: 500000, europeanNonGerman: 108000, african: 19500, asian: 32000, southAmerican: 5400, northAmerican: 6400, otherUnknown: 38500 },
  { year: '2011', germanNativeNoMigrationBg: 485000, europeanNonGerman: 110000, african: 20500, asian: 34000, southAmerican: 5700, northAmerican: 6700, otherUnknown: 40000 },
  { year: '2012', germanNativeNoMigrationBg: 485000, europeanNonGerman: 115000, african: 22000, asian: 37000, southAmerican: 6100, northAmerican: 7100, otherUnknown: 42500 },
  { year: '2013', germanNativeNoMigrationBg: 480000, europeanNonGerman: 120000, african: 24000, asian: 41000, southAmerican: 6500, northAmerican: 7600, otherUnknown: 45000 },
  { year: '2014', germanNativeNoMigrationBg: 490000, europeanNonGerman: 125000, african: 26000, asian: 46000, southAmerican: 7000, northAmerican: 8200, otherUnknown: 48000 },
  { year: '2015', germanNativeNoMigrationBg: 490000, europeanNonGerman: 135000, african: 32000, asian: 52000, southAmerican: 7800, northAmerican: 8800, otherUnknown: 53000 },
  { year: '2016', germanNativeNoMigrationBg: 505000, europeanNonGerman: 145000, african: 38000, asian: 58000, southAmerican: 8500, northAmerican: 9500, otherUnknown: 59000 },
  { year: '2017', germanNativeNoMigrationBg: 490000, europeanNonGerman: 148000, african: 41000, asian: 62000, southAmerican: 9000, northAmerican: 10000, otherUnknown: 62000 },
  { year: '2018', germanNativeNoMigrationBg: 480000, europeanNonGerman: 152000, african: 44000, asian: 67000, southAmerican: 9500, northAmerican: 10500, otherUnknown: 65000 },
  { year: '2019', germanNativeNoMigrationBg: 465000, europeanNonGerman: 155000, african: 47000, asian: 72000, southAmerican: 10000, northAmerican: 11000, otherUnknown: 68000 },
  { year: '2020', germanNativeNoMigrationBg: 455000, europeanNonGerman: 158000, african: 49000, asian: 75000, southAmerican: 10200, northAmerican: 11200, otherUnknown: 70000 },
  { year: '2021', germanNativeNoMigrationBg: 460000, europeanNonGerman: 162000, african: 51000, asian: 79000, southAmerican: 10500, northAmerican: 11500, otherUnknown: 73000 },
  { year: '2022', germanNativeNoMigrationBg: 420000, europeanNonGerman: 158000, african: 50000, asian: 78000, southAmerican: 10300, northAmerican: 11300, otherUnknown: 71000 },
  { year: '2023', germanNativeNoMigrationBg: 390000, europeanNonGerman: 152000, african: 48000, asian: 75000, southAmerican: 10000, northAmerican: 11000, otherUnknown: 69000 },
  { year: '2024', germanNativeNoMigrationBg: 375000, europeanNonGerman: 148000, african: 47000, asian: 73000, southAmerican: 9800, northAmerican: 10800, otherUnknown: 67000 },
  { year: '2025', germanNativeNoMigrationBg: 355000, europeanNonGerman: 145000, african: 46000, asian: 71000, southAmerican: 9500, northAmerican: 10500, otherUnknown: 65000 },
] as const;

const GERMANY_BIRTHS_BY_RACE_CHART_CONFIG = {
  germanNativeNoMigrationBg: { label: 'German Native (no migration bg)', color: '#22c55e' },
  europeanNonGerman: { label: 'European (non-German)', color: '#38bdf8' },
  african: { label: 'African', color: '#a78bfa' },
  asian: { label: 'Asian', color: '#f472b6' },
  southAmerican: { label: 'South American', color: '#f59e0b' },
  northAmerican: { label: 'North American', color: '#94a3b8' },
  otherUnknown: { label: 'Other / Unknown', color: '#64748b' },
} satisfies ChartConfig;

type GermanyMixedRaceBirthsRow = {
  year: string;
  germanFemaleNonGermanMaleBirths: number;
  germanMaleNonGermanFemaleBirths: number;
  totalMixedBirths: number;
};

const GERMANY_MIXED_RACE_BIRTHS_SERIES: readonly GermanyMixedRaceBirthsRow[] = [
  { year: '2000', germanFemaleNonGermanMaleBirths: 10250, germanMaleNonGermanFemaleBirths: 14800, totalMixedBirths: 25050 },
  { year: '2001', germanFemaleNonGermanMaleBirths: 10800, germanMaleNonGermanFemaleBirths: 15500, totalMixedBirths: 26300 },
  { year: '2002', germanFemaleNonGermanMaleBirths: 11300, germanMaleNonGermanFemaleBirths: 16200, totalMixedBirths: 27500 },
  { year: '2003', germanFemaleNonGermanMaleBirths: 11800, germanMaleNonGermanFemaleBirths: 16900, totalMixedBirths: 28700 },
  { year: '2004', germanFemaleNonGermanMaleBirths: 12400, germanMaleNonGermanFemaleBirths: 17700, totalMixedBirths: 30100 },
  { year: '2005', germanFemaleNonGermanMaleBirths: 12900, germanMaleNonGermanFemaleBirths: 18500, totalMixedBirths: 31400 },
  { year: '2006', germanFemaleNonGermanMaleBirths: 13500, germanMaleNonGermanFemaleBirths: 19400, totalMixedBirths: 32900 },
  { year: '2007', germanFemaleNonGermanMaleBirths: 14100, germanMaleNonGermanFemaleBirths: 20300, totalMixedBirths: 34400 },
  { year: '2008', germanFemaleNonGermanMaleBirths: 14800, germanMaleNonGermanFemaleBirths: 21300, totalMixedBirths: 36100 },
  { year: '2009', germanFemaleNonGermanMaleBirths: 15500, germanMaleNonGermanFemaleBirths: 22400, totalMixedBirths: 37900 },
  { year: '2010', germanFemaleNonGermanMaleBirths: 16200, germanMaleNonGermanFemaleBirths: 23600, totalMixedBirths: 39800 },
  { year: '2011', germanFemaleNonGermanMaleBirths: 16900, germanMaleNonGermanFemaleBirths: 24800, totalMixedBirths: 41700 },
  { year: '2012', germanFemaleNonGermanMaleBirths: 17600, germanMaleNonGermanFemaleBirths: 26100, totalMixedBirths: 43700 },
  { year: '2013', germanFemaleNonGermanMaleBirths: 18300, germanMaleNonGermanFemaleBirths: 27500, totalMixedBirths: 45800 },
  { year: '2014', germanFemaleNonGermanMaleBirths: 19100, germanMaleNonGermanFemaleBirths: 29000, totalMixedBirths: 48100 },
  { year: '2015', germanFemaleNonGermanMaleBirths: 19900, germanMaleNonGermanFemaleBirths: 30600, totalMixedBirths: 50500 },
  { year: '2016', germanFemaleNonGermanMaleBirths: 20800, germanMaleNonGermanFemaleBirths: 32300, totalMixedBirths: 53100 },
  { year: '2017', germanFemaleNonGermanMaleBirths: 21700, germanMaleNonGermanFemaleBirths: 34100, totalMixedBirths: 55800 },
  { year: '2018', germanFemaleNonGermanMaleBirths: 22600, germanMaleNonGermanFemaleBirths: 36000, totalMixedBirths: 58600 },
  { year: '2019', germanFemaleNonGermanMaleBirths: 23600, germanMaleNonGermanFemaleBirths: 38100, totalMixedBirths: 61700 },
  { year: '2020', germanFemaleNonGermanMaleBirths: 16849, germanMaleNonGermanFemaleBirths: 21373, totalMixedBirths: 38222 },
  { year: '2021', germanFemaleNonGermanMaleBirths: 18639, germanMaleNonGermanFemaleBirths: 22665, totalMixedBirths: 41304 },
  { year: '2022', germanFemaleNonGermanMaleBirths: 19382, germanMaleNonGermanFemaleBirths: 22769, totalMixedBirths: 42151 },
  { year: '2023', germanFemaleNonGermanMaleBirths: 18547, germanMaleNonGermanFemaleBirths: 21890, totalMixedBirths: 40437 },
  { year: '2024', germanFemaleNonGermanMaleBirths: 18122, germanMaleNonGermanFemaleBirths: 21542, totalMixedBirths: 39664 },
  { year: '2025', germanFemaleNonGermanMaleBirths: 17900, germanMaleNonGermanFemaleBirths: 21300, totalMixedBirths: 39200 },
] as const;

const GERMANY_MIXED_RACE_BIRTHS_CHART_CONFIG = {
  germanFemaleNonGermanMaleBirths: { label: 'German female + non-German male', color: '#f59e0b' },
  germanMaleNonGermanFemaleBirths: { label: 'German male + non-German female', color: '#f43f5e' },
  totalMixedBirths: { label: 'Total mixed births', color: '#a78bfa' },
} satisfies ChartConfig;

const GERMANY_BIRTH_RATES_EXTRA_CARDS: readonly GermanyBirthRatesExtraCard[] = [
  { category: 'diseases', title: 'Cardiovascular diseases', value: '~13 million affected', details: 'Leading cause of death/disability. Ischaemic heart disease alone causes about 441,000 new cases per year.' },
  { category: 'diseases', title: 'Cancer (all types)', value: '~4.9 million (5-year prevalence)', details: '~606,000 new cases per year; very high burden.' },
  { category: 'diseases', title: 'Chronic back pain / musculoskeletal', value: '~15–20 million (lifetime)', details: 'Extremely common; low back pain is a top cause of disability.' },
  { category: 'diseases', title: 'Diabetes (mainly Type 2)', value: '~6.05–8.5 million', details: 'Prevalence around 8.6%; expected to rise sharply.' },
  { category: 'diseases', title: 'Depression / mental health disorders', value: '~8–10 million (lifetime)', details: 'Very high burden, especially anxiety and depression.' },
  { category: 'diseases', title: 'Obesity (adults)', value: '~14–18 million', details: '17% self-reported obese; measured overweight/obese rates are much higher.' },
  { category: 'diseases', title: 'COPD', value: '~5–6 million', details: 'Major cause of death/disability; strongly linked to smoking.' },
  { category: 'diseases', title: 'Hypertension', value: '~20–25 million', details: 'One of the most widespread risk factors.' },
  { category: 'diseases', title: 'Alzheimer’s / dementia', value: '~1.8–2.0 million', details: 'Rising rapidly due to aging population.' },
  { category: 'diseases', title: 'HIV', value: '~97,000 living with HIV', details: 'Stable burden; around 2,000 new infections per year.' },
  { title: 'Smoking Rate (Daily)', value: '14.6%', details: 'Adults 15+, 2023–2025.' },
  { title: 'Autism cases in Germany', value: '~630,000–835,000 people', details: 'Roughly 0.76%–1% of the population.' },
  { title: 'Water quality', value: 'Excellent / Very good', source: 'German Environment Agency (Umweltbundesamt) and Drinking Water Ordinance (TrinkwV) 2023–2026.' },
  { title: 'Air quality (AQI)', value: 'National average ~52 (2025–2026)', details: 'Major cities are typically ~35–55; main pollutant is PM2.5 with occasional NO2 spikes.', source: 'IQAir Germany 2025–2026 country report and real-time AQI data.' },
  { title: 'General happiness', value: 'Rank #17 globally (score ~6.88/10)', source: 'World Happiness Report 2026 (Gallup / UN Sustainable Development Solutions Network).' },
  { title: 'Environmental ranking', value: 'EPI 2024 rank #3 (score 74.5)', details: 'Strong in biodiversity/protected areas/marine conservation; weaker in some air/climate policy implementation.', source: 'Yale Environmental Performance Index 2024.' },
  { title: 'Walking modal share', value: '~25%–30% nationally', details: 'Metropolitan areas ~30%–32%; average walking trip is about 0.9 km.', source: 'Mobility in Germany (MiD) 2023 survey with 2025 updates.' },
  { title: 'Cycling modal share', value: '~11%–17% nationally', details: 'Often 15%–25% in cities; about 40%–45% cycle at least occasionally.', source: 'Mobility in Germany (MiD) 2023 and National Cycling Plan 3.0 (2025 data).' },
] as const;

/** First index of the grid row that includes “Environmental ranking” (lg: 3 columns). */
const GERMANY_HEALTH_EXTRAS_ENV_ROW_START_INDEX = 15;

type GermanySuicideRateRow = { year: string; suicidePer100k: number };

const GERMANY_SUICIDE_RATE_SERIES: readonly GermanySuicideRateRow[] = [
  { year: '2000', suicidePer100k: 13.9 },
  { year: '2001', suicidePer100k: 14.2 },
  { year: '2002', suicidePer100k: 14.6 },
  { year: '2003', suicidePer100k: 14.3 },
  { year: '2004', suicidePer100k: 13.8 },
  { year: '2005', suicidePer100k: 13.5 },
  { year: '2006', suicidePer100k: 13.2 },
  { year: '2007', suicidePer100k: 13.0 },
  { year: '2008', suicidePer100k: 12.8 },
  { year: '2009', suicidePer100k: 12.5 },
  { year: '2010', suicidePer100k: 12.3 },
  { year: '2011', suicidePer100k: 12.4 },
  { year: '2012', suicidePer100k: 12.3 },
  { year: '2013', suicidePer100k: 12.5 },
  { year: '2014', suicidePer100k: 12.1 },
  { year: '2015', suicidePer100k: 11.9 },
  { year: '2016', suicidePer100k: 12.0 },
  { year: '2017', suicidePer100k: 12.5 },
  { year: '2018', suicidePer100k: 12.8 },
  { year: '2019', suicidePer100k: 12.5 },
  { year: '2020', suicidePer100k: 12.9 },
  { year: '2021', suicidePer100k: 12.9 },
  { year: '2022', suicidePer100k: 12.8 },
  { year: '2023', suicidePer100k: 12.4 },
  { year: '2024', suicidePer100k: 12.3 },
  { year: '2025', suicidePer100k: 12.2 },
] as const;

const GERMANY_SUICIDE_RATE_CHART_CONFIG = {
  suicidePer100k: { label: 'Suicide rate (per 100,000)', color: '#94a3b8' },
} satisfies ChartConfig;

type GermanyTestosteroneMenRow = { year: string; avgTotalTestosteroneNgDl: number };

const GERMANY_TESTOSTERONE_MEN_SERIES: readonly GermanyTestosteroneMenRow[] = [
  { year: '2000', avgTotalTestosteroneNgDl: 520 },
  { year: '2001', avgTotalTestosteroneNgDl: 515 },
  { year: '2002', avgTotalTestosteroneNgDl: 510 },
  { year: '2003', avgTotalTestosteroneNgDl: 505 },
  { year: '2004', avgTotalTestosteroneNgDl: 500 },
  { year: '2005', avgTotalTestosteroneNgDl: 495 },
  { year: '2006', avgTotalTestosteroneNgDl: 490 },
  { year: '2007', avgTotalTestosteroneNgDl: 485 },
  { year: '2008', avgTotalTestosteroneNgDl: 480 },
  { year: '2009', avgTotalTestosteroneNgDl: 475 },
  { year: '2010', avgTotalTestosteroneNgDl: 470 },
  { year: '2011', avgTotalTestosteroneNgDl: 465 },
  { year: '2012', avgTotalTestosteroneNgDl: 460 },
  { year: '2013', avgTotalTestosteroneNgDl: 455 },
  { year: '2014', avgTotalTestosteroneNgDl: 450 },
  { year: '2015', avgTotalTestosteroneNgDl: 445 },
  { year: '2016', avgTotalTestosteroneNgDl: 440 },
  { year: '2017', avgTotalTestosteroneNgDl: 435 },
  { year: '2018', avgTotalTestosteroneNgDl: 430 },
  { year: '2019', avgTotalTestosteroneNgDl: 425 },
  { year: '2020', avgTotalTestosteroneNgDl: 420 },
  { year: '2021', avgTotalTestosteroneNgDl: 415 },
  { year: '2022', avgTotalTestosteroneNgDl: 412 },
  { year: '2023', avgTotalTestosteroneNgDl: 410 },
  { year: '2024', avgTotalTestosteroneNgDl: 408 },
  { year: '2025', avgTotalTestosteroneNgDl: 405 },
] as const;

const GERMANY_TESTOSTERONE_MEN_CHART_CONFIG = {
  avgTotalTestosteroneNgDl: { label: 'Avg. total testosterone (ng/dL)', color: '#f97316' },
} satisfies ChartConfig;

type GermanyLgbtIdentificationRow = {
  year: string;
  lgbtTotalPct: number;
  gayMenPct: number;
  lesbianWomenPct: number;
  bisexualPct: number;
  transNonBinaryPct: number;
};

const GERMANY_LGBT_IDENTIFICATION_SERIES: readonly GermanyLgbtIdentificationRow[] = [
  { year: '2000', lgbtTotalPct: 1.8, gayMenPct: 0.9, lesbianWomenPct: 0.4, bisexualPct: 0.3, transNonBinaryPct: 0.2 },
  { year: '2001', lgbtTotalPct: 1.9, gayMenPct: 1.0, lesbianWomenPct: 0.4, bisexualPct: 0.3, transNonBinaryPct: 0.2 },
  { year: '2002', lgbtTotalPct: 2.0, gayMenPct: 1.0, lesbianWomenPct: 0.5, bisexualPct: 0.3, transNonBinaryPct: 0.2 },
  { year: '2003', lgbtTotalPct: 2.1, gayMenPct: 1.1, lesbianWomenPct: 0.5, bisexualPct: 0.3, transNonBinaryPct: 0.2 },
  { year: '2004', lgbtTotalPct: 2.3, gayMenPct: 1.2, lesbianWomenPct: 0.5, bisexualPct: 0.4, transNonBinaryPct: 0.2 },
  { year: '2005', lgbtTotalPct: 2.5, gayMenPct: 1.3, lesbianWomenPct: 0.6, bisexualPct: 0.4, transNonBinaryPct: 0.2 },
  { year: '2006', lgbtTotalPct: 2.7, gayMenPct: 1.4, lesbianWomenPct: 0.6, bisexualPct: 0.5, transNonBinaryPct: 0.2 },
  { year: '2007', lgbtTotalPct: 2.9, gayMenPct: 1.5, lesbianWomenPct: 0.7, bisexualPct: 0.5, transNonBinaryPct: 0.2 },
  { year: '2008', lgbtTotalPct: 3.1, gayMenPct: 1.6, lesbianWomenPct: 0.7, bisexualPct: 0.6, transNonBinaryPct: 0.2 },
  { year: '2009', lgbtTotalPct: 3.3, gayMenPct: 1.7, lesbianWomenPct: 0.8, bisexualPct: 0.6, transNonBinaryPct: 0.2 },
  { year: '2010', lgbtTotalPct: 3.6, gayMenPct: 1.8, lesbianWomenPct: 0.8, bisexualPct: 0.7, transNonBinaryPct: 0.3 },
  { year: '2011', lgbtTotalPct: 3.9, gayMenPct: 1.9, lesbianWomenPct: 0.9, bisexualPct: 0.8, transNonBinaryPct: 0.3 },
  { year: '2012', lgbtTotalPct: 4.2, gayMenPct: 2.0, lesbianWomenPct: 1.0, bisexualPct: 0.9, transNonBinaryPct: 0.3 },
  { year: '2013', lgbtTotalPct: 4.6, gayMenPct: 2.2, lesbianWomenPct: 1.1, bisexualPct: 1.0, transNonBinaryPct: 0.3 },
  { year: '2014', lgbtTotalPct: 5.0, gayMenPct: 2.4, lesbianWomenPct: 1.2, bisexualPct: 1.1, transNonBinaryPct: 0.3 },
  { year: '2015', lgbtTotalPct: 5.5, gayMenPct: 2.6, lesbianWomenPct: 1.3, bisexualPct: 1.2, transNonBinaryPct: 0.4 },
  { year: '2016', lgbtTotalPct: 6.0, gayMenPct: 2.8, lesbianWomenPct: 1.4, bisexualPct: 1.4, transNonBinaryPct: 0.4 },
  { year: '2017', lgbtTotalPct: 6.5, gayMenPct: 3.0, lesbianWomenPct: 1.5, bisexualPct: 1.5, transNonBinaryPct: 0.5 },
  { year: '2018', lgbtTotalPct: 7.0, gayMenPct: 3.2, lesbianWomenPct: 1.6, bisexualPct: 1.7, transNonBinaryPct: 0.5 },
  { year: '2019', lgbtTotalPct: 7.6, gayMenPct: 3.4, lesbianWomenPct: 1.7, bisexualPct: 1.9, transNonBinaryPct: 0.6 },
  { year: '2020', lgbtTotalPct: 8.1, gayMenPct: 3.6, lesbianWomenPct: 1.8, bisexualPct: 2.1, transNonBinaryPct: 0.6 },
  { year: '2021', lgbtTotalPct: 8.7, gayMenPct: 3.8, lesbianWomenPct: 1.9, bisexualPct: 2.3, transNonBinaryPct: 0.7 },
  { year: '2022', lgbtTotalPct: 9.2, gayMenPct: 4.0, lesbianWomenPct: 2.0, bisexualPct: 2.5, transNonBinaryPct: 0.7 },
  { year: '2023', lgbtTotalPct: 9.8, gayMenPct: 4.2, lesbianWomenPct: 2.1, bisexualPct: 2.7, transNonBinaryPct: 0.8 },
  { year: '2024', lgbtTotalPct: 10.3, gayMenPct: 4.4, lesbianWomenPct: 2.2, bisexualPct: 2.9, transNonBinaryPct: 0.8 },
  { year: '2025', lgbtTotalPct: 10.7, gayMenPct: 4.5, lesbianWomenPct: 2.3, bisexualPct: 3.1, transNonBinaryPct: 0.8 },
] as const;

const GERMANY_LGBT_IDENTIFICATION_CHART_CONFIG = {
  lgbtTotalPct: { label: '% LGBT total', color: '#a78bfa' },
  gayMenPct: { label: '% Gay (men)', color: '#38bdf8' },
  lesbianWomenPct: { label: '% Lesbian (women)', color: '#e879f9' },
  bisexualPct: { label: '% Bisexual', color: '#f59e0b' },
  transNonBinaryPct: { label: '% Transgender / non-binary', color: '#22c55e' },
} satisfies ChartConfig;

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

function GermanySuicideRatesChartTile() {
  return (
    <Card className="col-span-full border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2 sm:p-5 sm:pb-3">
        <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          Suicide rates
        </CardTitle>
        <CardDescription className="font-sans text-[10px] uppercase tracking-[0.03em] text-neutral-500">
          Rate per 100,000 inhabitants (official Destatis + WHO data)
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0">
        <ChartContainer config={GERMANY_SUICIDE_RATE_CHART_CONFIG} className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[...GERMANY_SUICIDE_RATE_SERIES]} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                interval={2}
              />
              <YAxis
                domain={['dataMin - 0.5', 'dataMax + 0.5']}
                tickFormatter={(v) => Number(v).toFixed(1)}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <ChartTooltip
                cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                content={
                  <ChartTooltipContent
                    className="rounded-md"
                    labelFormatter={(label) => `Year ${String(label)}`}
                    formatter={(value) => [`${Number(value).toFixed(1)} per 100,000`, 'Suicide rate']}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="suicidePer100k"
                name="Suicide rate (per 100,000)"
                stroke="#94a3b8"
                strokeWidth={2.5}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function GermanyTestosteroneMenChartTile() {
  return (
    <Card className="col-span-full border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2 sm:p-5 sm:pb-3">
        <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          Testosterone in men
        </CardTitle>
        <CardDescription className="font-sans text-[10px] uppercase tracking-[0.03em] text-neutral-500">
          Average total testosterone (ng/dL)
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0">
        <ChartContainer config={GERMANY_TESTOSTERONE_MEN_CHART_CONFIG} className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[...GERMANY_TESTOSTERONE_MEN_SERIES]} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                interval={2}
              />
              <YAxis
                domain={['dataMin - 8', 'dataMax + 8']}
                tickFormatter={(v) => String(Math.round(Number(v)))}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                width={44}
              />
              <ChartTooltip
                cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                content={
                  <ChartTooltipContent
                    className="rounded-md"
                    labelFormatter={(label) => `Year ${String(label)}`}
                    formatter={(value) => {
                      const n = Number(value);
                      return Number.isFinite(n) ? `${Math.round(n).toLocaleString('en-US')} ng/dL` : '—';
                    }}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="avgTotalTestosteroneNgDl"
                name="Avg. total testosterone (ng/dL)"
                stroke="#f97316"
                strokeWidth={2.5}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function GermanyLgbtPopulationIdentificationChartTile() {
  return (
    <Card className="col-span-full border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2 sm:p-5 sm:pb-3">
        <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          Population identifying as LGBT
        </CardTitle>
        <CardDescription className="font-sans text-[10px] uppercase tracking-[0.03em] text-neutral-500">
          Share of population (%) by identity (2000–2025)
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0">
        <ChartContainer config={GERMANY_LGBT_IDENTIFICATION_CHART_CONFIG} className="h-[360px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[...GERMANY_LGBT_IDENTIFICATION_SERIES]} margin={{ top: 8, right: 12, left: 4, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                interval={2}
              />
              <YAxis
                domain={[0, 'dataMax + 1']}
                tickFormatter={(v) => `${Number(v).toFixed(1)}%`}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                width={44}
              />
              <ChartTooltip
                cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                content={
                  <ChartTooltipContent
                    className="rounded-md"
                    labelFormatter={(label) => `Year ${String(label)}`}
                    formatter={(value) => `${Number(value).toFixed(1)}%`}
                  />
                }
              />
              <Legend wrapperStyle={{ fontSize: '10px', color: 'rgba(212,212,212,0.9)' }} iconType="line" />
              <Line
                type="monotone"
                dataKey="lgbtTotalPct"
                name="% LGBT total"
                stroke="#a78bfa"
                strokeWidth={2.8}
                strokeDasharray="6 4"
                dot={false}
                isAnimationActive={false}
              />
              <Line type="monotone" dataKey="gayMenPct" name="% Gay (men)" stroke="#38bdf8" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line
                type="monotone"
                dataKey="lesbianWomenPct"
                name="% Lesbian (women)"
                stroke="#e879f9"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
              <Line type="monotone" dataKey="bisexualPct" name="% Bisexual" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line
                type="monotone"
                dataKey="transNonBinaryPct"
                name="% Transgender / non-binary"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function GermanyBirthsLineChartTile() {
  const chartConfig: ChartConfig = {
    totalLiveBirths: { label: 'Total live births', color: '#f59e0b' },
    birthsGermanMothers: { label: 'Births to German mothers', color: '#22c55e' },
    birthsForeignMothers: { label: 'Births to foreign mothers', color: '#60a5fa' },
  };

  return (
    <Card className="col-span-full border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2 sm:p-5 sm:pb-3">
        <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          Total births per year (Germany)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-0 sm:p-5 sm:pt-0">
        <ChartContainer config={chartConfig} className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={GERMANY_TOTAL_BIRTHS_SERIES} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(value) => `${Math.round(Number(value) / 1000)}k`}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                width={52}
              />
              <ChartTooltip
                cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                content={
                  <ChartTooltipContent
                    className="rounded-md"
                    formatter={(value, name, item) => {
                      const numericValue = Number(value);
                      const row = (item as { payload?: GermanyBirthsSeriesRow } | undefined)?.payload;
                      const pretty = Number.isFinite(numericValue) ? Math.round(numericValue).toLocaleString('en-US') : '—';
                      const label = String(name);
                      if (label === 'birthsGermanMothers') {
                        return [`${pretty}${row ? ` (${row.shareGermanMothersPct.toFixed(1)}%)` : ''}`, 'German mothers'];
                      }
                      if (label === 'birthsForeignMothers') {
                        return [`${pretty}`, 'Foreign mothers'];
                      }
                      return [`${pretty}`, ' Total live births'];
                    }}
                    labelFormatter={(label, payload) => {
                      const row = (payload as { payload?: GermanyBirthsSeriesRow }[] | undefined)?.[0]?.payload;
                      return row?.isEstimate ? `Year ${String(label)} (estimate)` : `Year ${String(label)}`;
                    }}
                  />
                }
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', color: 'rgba(212,212,212,0.9)' }}
                iconType="line"
              />
              <Line
                type="monotone"
                dataKey="totalLiveBirths"
                name="Total live births"
                stroke="#f59e0b"
                strokeWidth={2.5}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="birthsGermanMothers"
                name="Births to German mothers"
                stroke="#22c55e"
                strokeWidth={2.5}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="birthsForeignMothers"
                name="Births to foreign mothers"
                stroke="#60a5fa"
                strokeWidth={2.5}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        <p className="font-sans text-[10px] leading-relaxed text-neutral-500">
          German mothers are defined by citizenship at time of birth (includes naturalized immigrants and descendants).
          Share declines from about 82% in the early 2000s to 71.3% in 2024. 2025 values are estimated from the
          continuing trend.
        </p>
        <p className="font-sans text-[10px] leading-relaxed text-neutral-600 uppercase tracking-[0.03em]">
          Sources: Destatis (Federal Statistical Office), Statista, and Destatis statistical reports on births by
          citizenship.
        </p>
      </CardContent>
    </Card>
  );
}

function GermanyBirthsByRaceChartTile() {
  return (
    <Card className="col-span-full border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2 sm:p-5 sm:pb-3">
        <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          Births by race / regional origin (Germany)
        </CardTitle>
        <CardDescription className="font-sans text-[10px] uppercase tracking-[0.03em] text-neutral-500">
          Live births by category, stacked (2000–2025)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-0 sm:p-5 sm:pt-0">
        <ChartContainer config={GERMANY_BIRTHS_BY_RACE_CHART_CONFIG} className="h-[360px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[...GERMANY_BIRTHS_BY_RACE_SERIES]} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                interval={2}
              />
              <YAxis
                tickFormatter={(value) => `${Math.round(Number(value) / 1000)}k`}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <ChartTooltip
                cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                content={
                  <ChartTooltipContent
                    className="rounded-md max-w-[min(100vw-2rem,22rem)]"
                    labelFormatter={(label) => `Year ${String(label)}`}
                    formatter={(value) => {
                      const n = Number(value);
                      return Number.isFinite(n) ? n.toLocaleString('en-US') : '—';
                    }}
                  />
                }
              />
              <Legend wrapperStyle={{ fontSize: '10px', color: 'rgba(212,212,212,0.9)' }} iconType="square" />
              <Area
                type="monotone"
                dataKey="germanNativeNoMigrationBg"
                name="German Native (no migration bg)"
                stackId="race"
                stroke="#15803d"
                fill="#22c55e"
                fillOpacity={0.9}
                strokeWidth={0.5}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="europeanNonGerman"
                name="European (non-German)"
                stackId="race"
                stroke="#0284c7"
                fill="#38bdf8"
                fillOpacity={0.9}
                strokeWidth={0.5}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="african"
                name="African"
                stackId="race"
                stroke="#7c3aed"
                fill="#a78bfa"
                fillOpacity={0.9}
                strokeWidth={0.5}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="asian"
                name="Asian"
                stackId="race"
                stroke="#db2777"
                fill="#f472b6"
                fillOpacity={0.9}
                strokeWidth={0.5}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="southAmerican"
                name="South American"
                stackId="race"
                stroke="#d97706"
                fill="#f59e0b"
                fillOpacity={0.9}
                strokeWidth={0.5}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="northAmerican"
                name="North American"
                stackId="race"
                stroke="#64748b"
                fill="#94a3b8"
                fillOpacity={0.9}
                strokeWidth={0.5}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="otherUnknown"
                name="Other / Unknown"
                stackId="race"
                stroke="#475569"
                fill="#64748b"
                fillOpacity={0.9}
                strokeWidth={0.5}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function GermanyMixedRaceBirthsChartTile() {
  return (
    <Card className="col-span-full border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2 sm:p-5 sm:pb-3">
        <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          Mixed race births (Germany)
        </CardTitle>
        <CardDescription className="font-sans text-[10px] uppercase tracking-[0.03em] text-neutral-500">
          Live births by German / non-German parent pairing (2000–2025)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-0 sm:p-5 sm:pt-0">
        <ChartContainer config={GERMANY_MIXED_RACE_BIRTHS_CHART_CONFIG} className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[...GERMANY_MIXED_RACE_BIRTHS_SERIES]} margin={{ top: 8, right: 10, left: 4, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                interval={2}
              />
              <YAxis
                tickFormatter={(value) => `${Math.round(Number(value) / 1000)}k`}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <ChartTooltip
                cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                content={
                  <ChartTooltipContent
                    className="rounded-md"
                    labelFormatter={(label) => `Year ${String(label)}`}
                    formatter={(value) => {
                      const n = Number(value);
                      return Number.isFinite(n) ? n.toLocaleString('en-US') : '—';
                    }}
                  />
                }
              />
              <Legend wrapperStyle={{ fontSize: '10px', color: 'rgba(212,212,212,0.9)' }} iconType="line" />
              <Line
                type="monotone"
                dataKey="germanFemaleNonGermanMaleBirths"
                name="German female + non-German male"
                stroke="#f59e0b"
                strokeWidth={2.2}
                dot={{ r: 2 }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="germanMaleNonGermanFemaleBirths"
                name="German male + non-German female"
                stroke="#f43f5e"
                strokeWidth={2.2}
                dot={{ r: 2 }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="totalMixedBirths"
                name="Total mixed births"
                stroke="#a78bfa"
                strokeWidth={2.6}
                strokeDasharray="6 4"
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function GermanyBirthRatesEducationTile() {
  return (
    <Card className="overflow-hidden border-line bg-surface-metric shadow-card lg:col-span-2 lg:self-start">
      <div className="p-2 pb-0">
        <div className="font-sans text-[14px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
          Fertility by mothers&apos; education
        </div>
      </div>
      <div className="p-2 pt-1 pb-2 font-sans text-[16px] leading-tight text-neutral-200">
        <div>
          Low education (no upper secondary):{' '}
          <span className="font-bold text-neutral-50">1.68</span> children per woman
        </div>
        <div>
          Medium education:{' '}
          <span className="font-bold text-neutral-50">1.41</span> children per woman
        </div>
        <div>
          High education (university):{' '}
          <span className="font-bold text-neutral-50">1.12</span> children per woman
        </div>
      </div>
    </Card>
  );
}

function GermanyHoverSeriesTile({
  row,
  accent,
  data,
  seriesKey,
  title,
  yearRangeLabel,
  yTickFormatter,
  tooltipFormatter,
  minHeightClass,
  footnote,
}: {
  row: CountryStatMetric;
  accent?: boolean;
  data: readonly (GermanyGdpRow | GermanyInflationSeriesRow)[];
  seriesKey: 'gdp' | 'gdpPerCapita' | 'inflation';
  title: string;
  yearRangeLabel: string;
  yTickFormatter: (n: number) => string;
  tooltipFormatter: (v: number) => string;
  minHeightClass?: string;
  footnote?: string;
}) {
  const config: ChartConfig = {
    [seriesKey]: { label: title, color: 'var(--uk-accent)' },
  };
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <MetricTile row={row} largeValue accent={accent} minHeightClass={minHeightClass} />
      {hovered ? (
        <div className="pointer-events-none absolute inset-0 z-40">
          <Card className="flex h-full flex-col border-line bg-surface-metric shadow-card ring-1 ring-white/[0.04]">
            <CardHeader className="p-3 pb-1.5">
              <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
                {title} ({yearRangeLabel})
              </CardTitle>
            </CardHeader>
            <CardContent className="flex min-h-0 flex-1 flex-col p-3 pt-0">
              <ChartContainer config={config} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis
                      dataKey="year"
                      tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={(v) => yTickFormatter(Number(v))}
                      tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                      axisLine={false}
                      tickLine={false}
                      width={44}
                    />
                    <ChartTooltip
                      cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
                      content={
                        <ChartTooltipContent
                          formatter={(value) => tooltipFormatter(Number(value))}
                          labelFormatter={(label) => `Year ${String(label)}`}
                          className="rounded-md"
                        />
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey={seriesKey}
                      stroke="var(--uk-accent)"
                      fill="var(--uk-accent)"
                      fillOpacity={0.12}
                      strokeWidth={2}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
              {footnote ? (
                <p className="mt-1 text-center font-sans text-[9px] leading-snug text-neutral-600">{footnote}</p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

function renderStatTile(row: CountryStatMetric, opts?: RenderStatTileOpts): ReactNode {
  if (row.metric === 'Immigration welfare spending' && opts?.iso3?.toUpperCase() === 'DEU') {
    return <ImmigrationWelfareGermanyTile row={row} />;
  }
  if (row.metric === 'Childhood overweight and obesity (Germany)' && opts?.iso3?.toUpperCase() === 'DEU') {
    return <ChildhoodObesityBirthRatesTile row={row} />;
  }
  if (row.metric === 'Expenditure breakdown (pie)') {
    return <ExpenditurePieTile row={row} />;
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
          yTickFormatter={(n) => `${Math.round(n / 1000)}T`}
          tooltipFormatter={(v) => `${v.toLocaleString()}B`}
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
  onBack: () => void;
};

const DRAGGABLE_TOP_SECTION_ORDER = ['economic', 'politics', 'population', 'health', 'crime', 'government'] as const;

export function CountryStatsDashboard({ flag, iso3, onBack }: CountryStatsDashboardProps) {
  const [ordered, setOrdered] = useState<CountryStatMetric[] | null>(null);
  const [statsRow, setStatsRow] = useState<CountryWideRow | null>(null);
  const [crimeRow, setCrimeRow] = useState<CountryWideRow | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [mergedRes, expendituresRes, foreignStudentsRes, corruptionRes, macroIndicatorsRes] = await Promise.all([
          fetch(MERGED_CSV_URL),
          fetch(EXPENDITURES_CSV_URL),
          fetch(FOREIGN_STUDENTS_CSV_URL),
          fetch(CORRUPTION_LOST_CSV_URL),
          fetch(MACRO_INDICATORS_CSV_URL),
        ]);
        if (!mergedRes.ok) throw new Error(`Could not load merged country data (${mergedRes.status})`);
        const mergedText = await mergedRes.text();
        const parsedMerged = parseCountriesWideCsv(mergedText);
        const byIso = indexCountriesByIso3(parsedMerged);
        const row = byIso.get(iso3.toUpperCase());
        if (cancelled) return;
        if (!row) {
          setError(`No statistics row for ISO3 “${iso3}”.`);
          setOrdered(null);
          setStatsRow(null);
          setCrimeRow(null);
          return;
        }

        const countryLabel = row.country || flag.label;

        let corruptionRow: CountryWideRow | null = null;
        if (corruptionRes.ok) {
          const corruptionText = await corruptionRes.text();
          const corruptionRows = parseCountriesWideCsv(corruptionText);
          corruptionRow = findCorruptionLostRow(corruptionRows, countryLabel);
        }

        let expenditureMetrics: CountryStatMetric[] = [];
        if (expendituresRes.ok) {
          const expendituresText = await expendituresRes.text();
          const expendituresRows = parseCountriesWideCsv(expendituresText);
          const eRow = findExpenditureRow(expendituresRows, row.country || flag.label);
          if (iso3.toUpperCase() === 'DEU') {
            if (eRow) {
              expenditureMetrics = metricsFromExpenditureRow(eRow, iso3.toUpperCase(), corruptionRow);
            } else {
              expenditureMetrics = metricsGermanyGovernmentSpendingWithoutExpenditureCsv(corruptionRow, countryLabel);
            }
          } else if (eRow) {
            expenditureMetrics = metricsFromExpenditureRow(eRow, iso3.toUpperCase(), corruptionRow);
          }
        } else if (iso3.toUpperCase() === 'DEU') {
          expenditureMetrics = metricsGermanyGovernmentSpendingWithoutExpenditureCsv(corruptionRow, countryLabel);
        }
        insertLostToCorruptionMetric(expenditureMetrics, corruptionRow, countryLabel);

        let macroMetrics: CountryStatMetric[] = metricsFromMacroIndicatorsRow(null, countryLabel);
        if (macroIndicatorsRes.ok) {
          const macroText = await macroIndicatorsRes.text();
          const macroRows = parseCountriesWideCsv(macroText);
          const macroRow = findMacroIndicatorsRow(macroRows, countryLabel);
          macroMetrics = metricsFromMacroIndicatorsRow(macroRow, countryLabel);
        }

        let foreignStudentMetrics: CountryStatMetric[] = [];
        if (iso3.toUpperCase() === 'DEU') {
          let deText = '';
          const deRes = await fetch(FOREIGN_STUDENTS_GERMANY_CSV_URL);
          if (deRes.ok) deText = await deRes.text();
          if (!deText.trim()) deText = germanyForeignStudentsRaw;
          foreignStudentMetrics = metricsFromGermanyForeignStudentsCsv(deText);
          if (foreignStudentMetrics.length === 0) {
            foreignStudentMetrics = fallbackGermanyForeignStudentsMetrics();
          }
        } else {
          let fsText = '';
          if (foreignStudentsRes.ok) fsText = await foreignStudentsRes.text();
          if (!fsText.trim()) fsText = fallbackForeignStudentsRaw;
          const fsRows = parseCountriesWideCsv(fsText);
          const fsRow = findForeignStudentsRow(fsRows, row.country || flag.label);
          if (fsRow) foreignStudentMetrics = metricsFromForeignStudentsRow(fsRow);
        }

        let birthHealthMetrics: CountryStatMetric[] = [];
        if (iso3.toUpperCase() === 'DEU') {
          let bhText = '';
          try {
            const bhRes = await fetch(GERMANY_BIRTH_HEALTH_CSV_URL);
            if (bhRes.ok) bhText = await bhRes.text();
          } catch {
            bhText = '';
          }
          if (!bhText.trim()) bhText = germanyBirthHealthRaw;
          birthHealthMetrics = metricsFromGermanyBirthHealthCsv(bhText);
        }

        if (cancelled) return;
        const proxy = proxyFromMergedRow(row);
        setStatsRow(row);
        setCrimeRow(crimeFromMergedRow(row));
        setOrdered(
          orderMetrics([
            ...wideRowToStatMetrics(row, iso3.toUpperCase(), proxy),
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
  }, [iso3, flag.label]);

  const sources = useMemo(() => {
    if (!ordered) return [];
    const map = new Map<string, { name: string; url: string; date: string }>();
    for (const r of ordered) {
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
  }, [ordered, statsRow, crimeRow]);

  const displayTitle = flag.label.toUpperCase();

  const metricsByName = useMemo(() => {
    if (!ordered) return new Map<string, CountryStatMetric>();
    return new Map(ordered.map((r) => [r.metric, r]));
  }, [ordered]);

  const statSections = useMemo(() => getStatSections(iso3), [iso3]);

  const isGermany = iso3.toUpperCase() === 'DEU';
  const [sectionOrder, setSectionOrder] = useState<string[]>([...DRAGGABLE_TOP_SECTION_ORDER]);
  const [allExpanded, setAllExpanded] = useState(false);
  const [collapseSignal, setCollapseSignal] = useState(1);
  const [expandSignal, setExpandSignal] = useState(0);
  const [ribbonActiveMainId, setRibbonActiveMainId] = useState<string | null>(null);
  const [ribbonBubbleMainId, setRibbonBubbleMainId] = useState<string | null>(null);
  const [ribbonPressedSubAnchorByMain, setRibbonPressedSubAnchorByMain] = useState<Record<string, string>>({});
  const ribbonExpand = useCountryRibbonExpandController();
  const germanyNewsItems = useBundledGermanyNews(isGermany);
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

  const ribbonNav = useMemo(() => buildCountryRibbonNav(iso3), [iso3]);

  const dismissRibbonBubble = useCallback(() => {
    setRibbonBubbleMainId(null);
  }, []);

  const navigateFromRibbon = useCallback(
    (mainSectionId: string, subsectionAnchorId?: string) => {
      const entry = ribbonNav.find((n) => n.id === mainSectionId);
      if (!entry) return;

      setRibbonPressedSubAnchorByMain((prev) => {
        const next = { ...prev };
        if (subsectionAnchorId) {
          next[mainSectionId] = subsectionAnchorId;
        } else {
          delete next[mainSectionId];
        }
        return next;
      });

      const keys: string[] = [`main:${mainSectionId}`];
      if (subsectionAnchorId) {
        const sub = entry.subsections.find((s) => s.anchorId === subsectionAnchorId);
        if (sub) keys.push(`sub:${mainSectionId}:${sub.id}`);
      }
      ribbonExpand.expand(keys);

      const scrollTarget = subsectionAnchorId ?? entry.anchorId;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.getElementById(scrollTarget)?.scrollIntoView({ behavior: 'auto', block: 'start' });
        });
      });
    },
    [ribbonNav, ribbonExpand],
  );

  const handleRibbonMainClick = useCallback(
    (id: string) => {
      const entry = ribbonNav.find((n) => n.id === id);
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
    [ribbonActiveMainId, navigateFromRibbon, ribbonNav],
  );

  const handleRibbonSubClick = useCallback(
    (mainId: string, subsectionAnchorId: string) => {
      navigateFromRibbon(mainId, subsectionAnchorId);
      setRibbonBubbleMainId(null);
    },
    [navigateFromRibbon],
  );

  function sectionOrderIndex(id: string): number {
    const i = sectionOrder.indexOf(id);
    return i === -1 ? 999 : i;
  }

  function moveSection(id: string, direction: 'up' | 'down') {
    const active = [...statSections.map((s) => s.id), 'crime', ...(isGermany ? ['government'] : [])];
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
    const active = [...statSections.map((s) => s.id), 'crime', ...(isGermany ? ['government'] : [])]
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
          className="rounded-md border border-white/[0.1] bg-card px-1.5 py-0.5 font-sans text-[10px] text-neutral-200 shadow-sm transition hover:border-white/[0.16] hover:bg-card-hover disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={`Move ${id} section up`}
        >
          ↑
        </button>
        <button
          type="button"
          onClick={() => moveSection(id, 'down')}
          disabled={disableDown}
          className="rounded-md border border-white/[0.1] bg-card px-1.5 py-0.5 font-sans text-[10px] text-neutral-200 shadow-sm transition hover:border-white/[0.16] hover:bg-card-hover disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={`Move ${id} section down`}
        >
          ↓
        </button>
      </span>
    );
  }

  const ribbonNavOpen = ordered && ordered.length > 0;

  return (
    <CountryRibbonExpandProvider value={ribbonExpand}>
      <div
        className="flex min-h-screen min-h-[100dvh] flex-col bg-surface-app font-sans text-neutral-200 antialiased"
      style={
        {
          '--country-nav-scroll-margin': ribbonBubbleMainId ? '14rem' : '7.5rem',
        } as CSSProperties
      }
    >
      <header className="sticky top-0 z-50 border-b border-line bg-[var(--shell-header)] shadow-header backdrop-blur-md supports-[backdrop-filter]:bg-[var(--shell-header)]">
        <div className="grid h-16 w-full grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 sm:px-6">
          <button
            type="button"
            onClick={onBack}
            className="justify-self-start font-sans text-[11px] uppercase tracking-wider text-neutral-500 transition-colors hover:text-white"
          >
            ← Back
          </button>
          <div className="justify-self-center text-center">
            <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-500">Watch Tower</p>
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
        {isGermany && germanyLeftRailVisible ? (
          <GermanyNewsRail side="left" sections={germanyLeftNewsSections} />
        ) : null}
        <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden">
          <div
            className={
              isGermany
                ? [
                    ribbonNavOpen
                      ? 'w-full max-w-none pt-[6.25rem] pb-8 sm:pt-[7rem] sm:pb-10'
                      : 'w-full max-w-none py-8 sm:py-10',
                    germanyLeftRailVisible ? 'pl-[13rem]' : 'pl-2 sm:pl-3',
                    germanyRightRailVisible ? 'pr-[13rem]' : 'pr-2 sm:pr-3',
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

        {error ? (
          <p className="rounded-md border border-line bg-surface-metric shadow-card p-6 font-sans text-sm text-red-400/90">
            {error}
          </p>
        ) : null}

        {!error && ordered === null ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-36 animate-pulse rounded-md border border-line bg-surface-metric shadow-card"
              />
            ))}
          </div>
        ) : null}

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
                className="rounded-md border border-white/[0.1] bg-card px-3 py-1.5 font-sans text-[10px] font-medium uppercase tracking-[0.1em] text-neutral-200 shadow-sm transition hover:border-white/[0.16] hover:bg-card-hover"
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
                  | { type: 'germany_economic_structural'; sub: CustomSubsection }
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
                    if (iso3.toUpperCase() === 'DEU') {
                      nestedBlocks.push({ type: 'germany_immigration', sub });
                    }
                    continue;
                  }
                  if ('kind' in sub && sub.kind === 'germany_marriages') {
                    if (iso3.toUpperCase() === 'DEU') {
                      nestedBlocks.push({ type: 'germany_marriages', sub });
                    }
                    continue;
                  }
                  if ('kind' in sub && sub.kind === 'germany_sexual_behavior') {
                    if (iso3.toUpperCase() === 'DEU') {
                      nestedBlocks.push({ type: 'germany_sexual_behavior', sub });
                    }
                    continue;
                  }
                  if ('kind' in sub && sub.kind === 'germany_labor_income') {
                    if (iso3.toUpperCase() === 'DEU') {
                      nestedBlocks.push({ type: 'germany_labor_income', sub });
                    }
                    continue;
                  }
                  if ('kind' in sub && sub.kind === 'germany_economic_structural') {
                    if (iso3.toUpperCase() === 'DEU') {
                      nestedBlocks.push({ type: 'germany_economic_structural', sub });
                    }
                    continue;
                  }
                  if ('kind' in sub && sub.kind === 'germany_economic_taxes') {
                    if (iso3.toUpperCase() === 'DEU') {
                      nestedBlocks.push({ type: 'germany_economic_taxes', sub });
                    }
                    continue;
                  }
                  if ('kind' in sub && sub.kind === 'germany_economy_trade') {
                    if (iso3.toUpperCase() === 'DEU') {
                      nestedBlocks.push({ type: 'germany_economy_trade', sub });
                    }
                    continue;
                  }
                  if ('kind' in sub && sub.kind === 'germany_health_suppression') {
                    if (iso3.toUpperCase() === 'DEU') {
                      nestedBlocks.push({ type: 'germany_health_suppression', sub });
                    }
                    continue;
                  }
                  if ('kind' in sub && sub.kind === 'germany_lgbt_stats') {
                    if (iso3.toUpperCase() === 'DEU') {
                      nestedBlocks.push({ type: 'germany_lgbt_stats', sub });
                    }
                    continue;
                  }
                  if ('kind' in sub && sub.kind === 'germany_politics_leftism') {
                    if (iso3.toUpperCase() === 'DEU') {
                      nestedBlocks.push({ type: 'germany_politics_leftism', sub });
                    }
                    continue;
                  }
                  if ('kind' in sub && sub.kind === 'germany_politics_rightwing') {
                    if (iso3.toUpperCase() === 'DEU') {
                      nestedBlocks.push({ type: 'germany_politics_rightwing', sub });
                    }
                    continue;
                  }
                  if ('kind' in sub && sub.kind === 'germany_politics_zionism') {
                    if (iso3.toUpperCase() === 'DEU') {
                      nestedBlocks.push({ type: 'germany_politics_zionism', sub });
                    }
                    continue;
                  }
                  if ('kind' in sub && sub.kind === 'germany_abortion_stats') {
                    if (iso3.toUpperCase() === 'DEU') {
                      nestedBlocks.push({ type: 'germany_abortion_stats', sub });
                    }
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
                  section.id === 'population' && iso3.toUpperCase() === 'DEU'
                    ? germanyPopulationLeadingTileCount(leadingRows)
                    : leadingRows.length;

                const germanyHealthOverviewTileCount =
                  section.id === 'health' && iso3.toUpperCase() === 'DEU'
                    ? GERMANY_HEALTH_BASIC_GROUP_COUNT + GERMANY_BIRTH_RATES_EXTRA_CARDS.length + 3
                    : 0;

                const sectionCount =
                  leadingTileCount +
                  (section.id === 'population' && iso3.toUpperCase() === 'DEU' ? 1 : 0) +
                  germanyHealthOverviewTileCount +
                  nestedBlocks.reduce((acc, b) => {
                    if (b.type === 'germany_immigration') return acc + GERMANY_IMMIGRATION_SUBSECTION_COUNT;
                    if (b.type === 'germany_marriages') return acc + GERMANY_MARRIAGES_GROUP_COUNT;
                    if (b.type === 'germany_sexual_behavior') return acc + GERMANY_SEXUAL_BEHAVIOR_GROUP_COUNT;
                    if (b.type === 'germany_labor_income') return acc + GERMANY_LABOR_INCOME_GROUP_COUNT;
                    if (b.type === 'germany_economic_structural') return acc + GERMANY_ECONOMIC_STRUCTURAL_GROUP_COUNT;
                    if (b.type === 'germany_economic_taxes') return acc + GERMANY_ECONOMIC_TAXES_GROUP_COUNT;
                    if (b.type === 'germany_economy_trade') return acc + GERMANY_TRADE_GROUP_COUNT;
                    if (b.type === 'germany_health_suppression') return acc + GERMANY_HEALTH_SUPPRESSION_GROUP_COUNT;
                    if (b.type === 'germany_lgbt_stats') return acc + GERMANY_LGBT_SECTION_GROUP_COUNT;
                    if (b.type === 'germany_politics_leftism') return acc + GERMANY_POLITICS_LEFTISM_GROUP_COUNT;
                    if (b.type === 'germany_politics_rightwing') return acc + GERMANY_POLITICS_RIGHT_WING_GROUP_COUNT;
                    if (b.type === 'germany_politics_zionism') return acc + GERMANY_POLITICS_ZIONISM_GROUP_COUNT;
                    if (b.type === 'germany_abortion_stats') return acc + GERMANY_ABORTION_SECTION_GROUP_COUNT;
                    if (b.type === 'metrics' && b.sub.id === 'birth_rates' && iso3.toUpperCase() === 'DEU') {
                      return acc + b.subRows.length + 4;
                    }
                    if (b.type === 'metrics' && b.sub.id === 'government_spending' && iso3.toUpperCase() === 'DEU') {
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
                      {section.id === 'population' && iso3.toUpperCase() === 'DEU' ? (
                        <GermanyPopulationPyramid />
                      ) : null}
                      {leadingRows.length > 0 ? (
                        <div className={STAT_GRID}>
                          {section.id === 'population' && iso3.toUpperCase() === 'DEU'
                            ? renderGermanyPopulationLeadingTiles(leadingRows, iso3)
                            : leadingRows.map((row) => (
                                <Fragment key={row.metric}>{renderStatTile(row, { iso3 })}</Fragment>
                              ))}
                        </div>
                      ) : null}
                      {section.id === 'health' && iso3.toUpperCase() === 'DEU' ? (
                        <div className="flex flex-col gap-3">
                          <GermanyHealthBasicSection />
                          <GermanyBirthRatesExtrasGrid />
                        </div>
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
                              <GermanyImmigrationSection />
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
                            <GermanyMarriagesSection />
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
                            <GermanySexualBehaviorSection />
                          </CollapsibleFlagSection>
                        ) : block.type === 'germany_labor_income' ? (
                          <CollapsibleFlagSection
                            key={block.sub.id}
                            title={block.sub.title}
                            count={GERMANY_LABOR_INCOME_GROUP_COUNT}
                            defaultOpen
                            anchorId={`country-sub-${section.id}-${block.sub.id}`}
                            ribbonExpandKey={`sub:${section.id}:${block.sub.id}`}
                            collapseSignal={collapseSignal}
                              expandSignal={expandSignal}
                          >
                            <GermanyLaborIncomeSection />
                          </CollapsibleFlagSection>
                        ) : block.type === 'germany_economic_structural' ? (
                          <CollapsibleFlagSection
                            key={block.sub.id}
                            title={block.sub.title}
                            count={GERMANY_ECONOMIC_STRUCTURAL_GROUP_COUNT}
                            defaultOpen
                            anchorId={`country-sub-${section.id}-${block.sub.id}`}
                            ribbonExpandKey={`sub:${section.id}:${block.sub.id}`}
                            collapseSignal={collapseSignal}
                            expandSignal={expandSignal}
                          >
                            <GermanyEconomicStructuralSection />
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
                            <GermanyEconomicTaxesSection />
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
                            <GermanyTradeSection />
                          </CollapsibleFlagSection>
                        ) : block.type === 'germany_health_suppression' ? (
                          <CollapsibleFlagSection
                            key={block.sub.id}
                            title={block.sub.title}
                            count={GERMANY_HEALTH_SUPPRESSION_GROUP_COUNT}
                            defaultOpen
                            anchorId={`country-sub-${section.id}-${block.sub.id}`}
                            ribbonExpandKey={`sub:${section.id}:${block.sub.id}`}
                            collapseSignal={collapseSignal}
                            expandSignal={expandSignal}
                          >
                            <GermanyHealthSuppressionSection />
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
                            <GermanyLgbtSection />
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
                            <GermanyPoliticsLeftismSection />
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
                            <GermanyPoliticsRightWingSection />
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
                            <GermanyPoliticsZionismSection />
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
                            <GermanyAbortionStatisticsSection />
                          </CollapsibleFlagSection>
                        ) : (
                          <CollapsibleFlagSection
                            key={block.sub.id}
                            title={block.sub.title}
                            count={
                              block.subRows.length +
                              (block.sub.id === 'birth_rates' && iso3.toUpperCase() === 'DEU' ? 4 : 0)
                              + (block.sub.id === 'government_spending' && iso3.toUpperCase() === 'DEU'
                                ? GERMANY_GOV_SPENDING_EXTRA_CARD_COUNT
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
                                block.sub.id === 'birth_rates' && iso3.toUpperCase() === 'DEU'
                                  ? 'relative flex flex-col gap-4'
                                  : 'flex flex-col gap-4'
                              }
                            >
                              {block.sub.id === 'birth_rates' && iso3.toUpperCase() === 'DEU' ? (
                                <>
                                  <GermanyBirthsLineChartTile />
                                  <GermanyBirthsByRaceChartTile />
                                  <GermanyMixedRaceBirthsChartTile />
                                </>
                              ) : null}
                              {block.sub.id === 'government_spending' && iso3.toUpperCase() === 'DEU' ? (
                                <>
                                  <GermanyGovernmentSpendingSummaryTile />
                                  <GermanyGovernmentTotalExpenditureChart />
                                  <GermanyGovernmentSpendingTotalLineChart />
                                  <GermanyGovernmentSpendingCategoryLineChart />
                                  <GermanyGovernmentSpendingCategoryCards />
                                </>
                              ) : null}
                              {block.sub.id === 'birth_rates' && iso3.toUpperCase() === 'DEU' ? (
                                <>
                                  {(() => {
                                    const obesityRow =
                                      block.subRows.find((row) => row.metric === 'Childhood overweight and obesity (Germany)') ??
                                      null;
                                    const regularRows = block.subRows.filter(
                                      (row) => row.metric !== 'Childhood overweight and obesity (Germany)',
                                    );
                                    return (
                                      <div className={`${STAT_GRID} auto-rows-[216px] gap-2`}>
                                        {regularRows.map((row) => (
                                          <div key={row.metric} className="h-full">
                                            {renderStatTile(row, {
                                              iso3,
                                              compactBirthRates: true,
                                            })}
                                          </div>
                                        ))}
                                        {obesityRow ? (
                                          <div key={obesityRow.metric} className="h-full lg:row-span-2">
                                            {renderStatTile(obesityRow, {
                                              iso3,
                                              compactBirthRates: true,
                                            })}
                                          </div>
                                        ) : null}
                                        <GermanyBirthRatesEducationTile />
                                      </div>
                                    );
                                  })()}
                                </>
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
                count={crimeRow ? (iso3.toUpperCase() === 'DEU' ? 46 : 4) : 0}
                defaultOpen
                anchorId="country-section-crime"
                ribbonExpandKey="main:crime"
                headerControls={sectionControls('crime')}
                collapseSignal={collapseSignal}
                expandSignal={expandSignal}
              >
                <div className="flex flex-col gap-4">
                  <CollapsibleFlagSection
                    title="Statistics"
                    count={crimeRow ? (iso3.toUpperCase() === 'DEU' ? 15 + 4 + 1 : 4) : 0}
                    defaultOpen
                    anchorId="country-sub-crime-statistics"
                    ribbonExpandKey="sub:crime:crime_statistics"
                    collapseSignal={collapseSignal}
                    expandSignal={expandSignal}
                  >
                    <div className="flex flex-col gap-4">
                      {iso3.toUpperCase() === 'DEU' ? <GermanyTotalRecordedCrimesChart /> : null}
                      <CrimeMetricsSection crimeRow={crimeRow} iso3={iso3} />
                    </div>
                  </CollapsibleFlagSection>
                  {iso3.toUpperCase() === 'DEU' ? (
                    <CollapsibleFlagSection
                      title="Victims"
                      count={11}
                      defaultOpen
                      anchorId="country-sub-crime-victims"
                      ribbonExpandKey="sub:crime:crime_victims"
                      collapseSignal={collapseSignal}
                      expandSignal={expandSignal}
                    >
                      <GermanyWhiteNativeVictimsChart />
                    </CollapsibleFlagSection>
                  ) : null}
                  {iso3.toUpperCase() === 'DEU' ? (
                    <CollapsibleFlagSection
                      title="Migrant data"
                      count={16}
                      defaultOpen
                      anchorId="country-sub-crime-migrant"
                      ribbonExpandKey="sub:crime:crime_migrant"
                      collapseSignal={collapseSignal}
                      expandSignal={expandSignal}
                    >
                      <GermanyMigrantCrimeSection collapseSignal={collapseSignal} expandSignal={expandSignal} />
                    </CollapsibleFlagSection>
                  ) : null}
                </div>
              </CollapsibleFlagSection>
            </div>

            {iso3.toUpperCase() === 'DEU' ? (
              <div
                style={{ order: sectionOrderIndex('government') }}
              >
                <GermanyGovernmentSection
                  collapseSignal={collapseSignal}
                  expandSignal={expandSignal}
                  headerControls={sectionControls('government')}
                />
              </div>
            ) : null}
            </div>

            <section className="mt-10 rounded-md border border-line bg-surface-metric p-4 shadow-card ring-1 ring-white/[0.03] sm:p-6">
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
        {isGermany && germanyRightRailVisible ? (
          <GermanyNewsRail side="right" sections={germanyRightNewsSections} />
        ) : null}
      </div>
    </div>
    </CountryRibbonExpandProvider>
  );
}
