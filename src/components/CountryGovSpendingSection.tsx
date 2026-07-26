import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { CountryStatMetric } from '../types/countryStats';
import { GERMANY_CORRUPTION_LOST_SOURCE_URL } from '../lib/corruptionLost';
import {
  GERMANY_CORRUPTION_LOST_BY_YEAR,
  germanyCorruptionLostRowForYear,
} from '../lib/germanyCorruptionLostByYear';
import { germanyGovSpendingLeadRowForYear } from '../lib/germanyGovernmentSpendingLeadByYear';
import {
  FRANCE_CORRUPTION_LOST_BY_YEAR,
  franceCorruptionLostRowForYear,
} from '../lib/franceCorruptionLostByYear';
import { franceFiscalSupportRowForYear } from '../lib/franceFiscalSupportByYear';
import { franceGovSpendRowForYear } from '../lib/franceGovernmentSpendingByYear';
import {
  FRANCE_GENERAL_GOVERNMENT_EXPENDITURE_SERIES,
  franceGeneralGovExpenditureForYear,
} from '../lib/franceGeneralGovernmentExpenditure';
import { ITALY_GENERAL_GOVERNMENT_EXPENDITURE_SERIES } from '../lib/italyGeneralGovernmentExpenditure';
import {
  franceGovernmentExpenditureCategoryRowForYear,
  type FranceGovernmentExpenditureCategoryKey,
} from '../lib/franceGovernmentExpenditureByCategory';
import {
  italyGovernmentExpenditureCategoryRowForYear,
  type ItalyGovernmentExpenditureCategoryKey,
} from '../lib/italyGovernmentExpenditureByCategory';
import {
  italyGovSpendRowForYear,
  type ItalyGovSpendingYearRow,
} from '../lib/italyGovernmentSpendingByYear';
import {
  ITALY_FISCAL_SUPPORT_BY_YEAR,
  italyFiscalSupportRowForYear,
} from '../lib/italyFiscalSupportByYear';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from './ui/chart';
import {
  CHART_AXIS_FONT,
  MetaLine,
  NoteBlock,
  SourceLinks,
  STAT_GRID,
} from './statTilePrimitives';

/**
 * Government-spending subsystem for the country dashboard: the year-scrubbed spending
 * cards, the total-expenditure chart, the corruption/foreign-aid/immigration-welfare
 * tiles, and the German/French government spending section.
 */

function govSpendLeadRowForYear(year: number, iso3: string) {
  if (iso3.toUpperCase() === 'ITA') {
    return italyFiscalSupportRowForYear(year);
  }
  if (iso3.toUpperCase() === 'FRA') {
    const r = franceFiscalSupportRowForYear(year);
    return {
      immigrationWelfareBn: r.immigrationWelfareBn,
      moneyToFamiliesBn: r.moneyToFamiliesBn,
      totalImmigrantsRefugeesBn: r.totalImmigrantsRefugeesBn,
      foreignAidOdaBn: r.foreignAidOdaBn,
    };
  }
  return germanyGovSpendingLeadRowForYear(year);
}

/** Government spending lead tile: immigration welfare + family + refugee totals (billion €). */
export function GermanyImmigrationWelfareYearTile({
  selectedYear,
  sourceRow,
  iso3,
}: {
  selectedYear: number;
  sourceRow?: CountryStatMetric;
  iso3: string;
}) {
  const data = useMemo(() => govSpendLeadRowForYear(selectedYear, iso3), [selectedYear, iso3]);
  const countryLabel =
    iso3.toUpperCase() === 'ITA' ? 'Italy' : iso3.toUpperCase() === 'FRA' ? 'France' : 'Germany';

  return (
    <article className="flex min-h-[148px] flex-col rounded-md border border-line bg-surface-metric shadow-card p-4 sm:p-5">
      <div className="divide-y divide-white/[0.06]">
        <div className="pb-3">
          <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
            Immigration welfare spending
          </p>
          <p className="mt-2 font-sans text-lg font-semibold tabular-nums leading-tight text-neutral-100 transition-all duration-300 sm:text-xl">
            €{data.immigrationWelfareBn.toFixed(1)}B
          </p>
          <p className="mt-1 font-sans text-[10px] text-neutral-500">
            {selectedYear} · {countryLabel}
          </p>
        </div>
        <div className="py-3">
          <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
            Money given to immigrant families
          </p>
          <p className="mt-1.5 font-sans text-base font-medium tabular-nums text-neutral-100 transition-all duration-300 sm:text-lg">
            €{data.moneyToFamiliesBn.toFixed(1)}B
          </p>
        </div>
        <div className="pt-3">
          <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
            Total spent on immigrants / refugees
          </p>
          <p className="mt-1.5 font-sans text-base font-medium tabular-nums text-neutral-100 transition-all duration-300 sm:text-lg">
            €{data.totalImmigrantsRefugeesBn.toFixed(1)}B
          </p>
        </div>
      </div>
      {sourceRow?.source_url ? (
        <div className="mt-3 border-t border-white/[0.06] pt-3">
          <SourceLinks
            url={sourceRow.source_url}
            className="inline-flex w-fit items-center gap-1 font-sans text-[10px] text-[var(--uk-accent)] hover:text-neutral-200"
          />
        </div>
      ) : null}
      {sourceRow?.notes ? <NoteBlock text={sourceRow.notes} /> : null}
    </article>
  );
}

export function GermanyForeignAidYearTile({
  selectedYear,
  sourceRow,
  iso3,
}: {
  selectedYear: number;
  sourceRow?: CountryStatMetric;
  iso3: string;
}) {
  const data = useMemo(() => govSpendLeadRowForYear(selectedYear, iso3), [selectedYear, iso3]);

  return (
    <article className="flex min-h-[148px] flex-col rounded-md border border-line bg-surface-metric p-4 shadow-card sm:p-5">
      <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
        Foreign Aid
      </p>
      <div className="mt-4 min-w-0 flex-1">
        <p className="font-sans text-2xl font-semibold tabular-nums leading-none tracking-tight text-neutral-100 transition-all duration-300 sm:text-3xl lg:text-4xl">
          €{data.foreignAidOdaBn.toFixed(1)}B
        </p>
        <p className="mt-1.5 font-sans text-[10px] font-medium leading-snug text-neutral-500">
          Official development assistance (ODA) · {selectedYear}
        </p>
        <p className="mt-2 font-sans text-[10px] leading-relaxed text-neutral-600">
          Updates with the category expenditure year selector above
        </p>
      </div>
      <div className="mt-auto">
        {sourceRow ? <MetaLine row={sourceRow} /> : null}
        {sourceRow?.source_url ? (
          <div className="mt-2">
            <SourceLinks
              url={sourceRow.source_url}
              className="inline-flex w-fit items-center gap-1 font-sans text-[10px] text-[var(--uk-accent)] hover:text-neutral-200"
            />
          </div>
        ) : null}
        {sourceRow?.notes ? <NoteBlock text={sourceRow.notes} /> : null}
      </div>
    </article>
  );
}

/** Demographics → Birth rates: Destatis / OECD-style childhood weight metrics (DE). */

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

const FRANCE_GOV_SPENDING_LINE_CONFIG = {
  publicServices: { label: 'Public services', color: '#a855f7' },
  defence: { label: 'Defence', color: '#ef4444' },
  publicOrder: { label: 'Public order', color: '#f97316' },
  economicAffairs: { label: 'Economic affairs', color: '#84cc16' },
  environment: { label: 'Environment', color: '#14b8a6' },
  housing: { label: 'Housing', color: '#06b6d4' },
  health: { label: 'Health', color: '#60a5fa' },
  cultureRecreation: { label: 'Culture/recreation', color: '#f43f5e' },
  education: { label: 'Education', color: '#c084fc' },
  socialProtection: { label: 'Social protection', color: '#22c55e' },
} satisfies ChartConfig;

const FRANCE_GOV_SPENDING_CATEGORY_SERIES_ORDER: readonly FranceGovernmentExpenditureCategoryKey[] = [
  'publicServices',
  'defence',
  'publicOrder',
  'economicAffairs',
  'environment',
  'housing',
  'health',
  'cultureRecreation',
  'education',
  'socialProtection',
];

const ITALY_GOV_SPENDING_LINE_CONFIG = {
  publicServices: { label: 'General public services', color: '#a855f7' },
  defence: { label: 'Defence', color: '#ef4444' },
  publicOrder: { label: 'Public order & safety', color: '#f97316' },
  economicAffairs: { label: 'Economic affairs', color: '#84cc16' },
  environment: { label: 'Environmental protection', color: '#14b8a6' },
  housing: { label: 'Housing & community', color: '#06b6d4' },
  health: { label: 'Health', color: '#60a5fa' },
  cultureRecreation: { label: 'Recreation & culture', color: '#f43f5e' },
  education: { label: 'Education', color: '#c084fc' },
  socialProtection: { label: 'Social protection', color: '#22c55e' },
} satisfies ChartConfig;

const ITALY_GOV_SPENDING_CATEGORY_SERIES_ORDER: readonly ItalyGovernmentExpenditureCategoryKey[] = [
  'publicServices',
  'defence',
  'publicOrder',
  'economicAffairs',
  'environment',
  'housing',
  'health',
  'cultureRecreation',
  'education',
  'socialProtection',
];

const GERMANY_GOV_SPENDING_YEARS = Array.from({ length: 26 }, (_, i) => 2000 + i);

/** 2025-calibrated ratios for cards without a dedicated series column. */
const GOV_SPEND_PENSION_SHARE_OF_SOCIAL = 390 / 930;
const GOV_SPEND_PUBLIC_INVESTMENT_SHARE_OF_TOTAL = 117.5 / GERMANY_GOV_SPEND_TOTAL_2025_EUR_BN;
const GOV_SPEND_HOUSING_SHARE_OF_TOTAL = 85 / GERMANY_GOV_SPEND_TOTAL_2025_EUR_BN;

type GovSpendCardDef = {
  label: string;
  notes: string;
  color: string;
  getEurBn: (row: GermanyGovSpendingSeriesRow) => number;
};

const GERMANY_GOV_SPEND_CARD_DEFS: readonly GovSpendCardDef[] = [
  {
    label: 'Social Benefits & Social Protection',
    notes: 'Largest category: pensions, unemployment, long-term care, health insurance subsidies',
    color: String(GERMANY_GOV_SPENDING_LINE_CONFIG.socialProtection.color),
    getEurBn: (r) => r.socialProtection,
  },
  {
    label: 'Health',
    notes: 'Medical services, care, and public health spending',
    color: String(GERMANY_GOV_SPENDING_LINE_CONFIG.health.color),
    getEurBn: (r) => r.health,
  },
  {
    label: 'Education & Research',
    notes: 'Schools, universities, and federal research funding',
    color: String(GERMANY_GOV_SPENDING_LINE_CONFIG.educationResearch.color),
    getEurBn: (r) => r.educationResearch,
  },
  {
    label: 'Defence / Military',
    notes: 'Defence budget including special funds where applicable',
    color: String(GERMANY_GOV_SPENDING_LINE_CONFIG.defence.color),
    getEurBn: (r) => r.defence,
  },
  {
    label: 'Transport & Infrastructure',
    notes: 'Transport networks and infrastructure investment',
    color: String(GERMANY_GOV_SPENDING_LINE_CONFIG.transportInfrastructure.color),
    getEurBn: (r) => r.transportInfrastructure,
  },
  {
    label: 'General Public Services & Administration',
    notes: 'Core administration and general government operations',
    color: String(GERMANY_GOV_SPENDING_LINE_CONFIG.generalPublicServices.color),
    getEurBn: (r) => r.generalPublicServices,
  },
  {
    label: 'Interest Payments on Debt',
    notes: 'Federal interest on government debt',
    color: String(GERMANY_GOV_SPENDING_LINE_CONFIG.interestPayments.color),
    getEurBn: (r) => r.interestPayments,
  },
  {
    label: 'Housing, Family & Youth',
    notes: 'Family benefits and housing-related support (estimated share of total)',
    color: '#14b8a6',
    getEurBn: (r) => r.total * GOV_SPEND_HOUSING_SHARE_OF_TOTAL,
  },
  {
    label: 'Economic Affairs & Subsidies',
    notes: 'Energy transition, business support, and economic affairs',
    color: String(GERMANY_GOV_SPENDING_LINE_CONFIG.economicAffairsSubsidies.color),
    getEurBn: (r) => r.economicAffairsSubsidies,
  },
  {
    label: 'Other (Environment, Culture, etc.)',
    notes: 'Remaining federal spending categories',
    color: String(GERMANY_GOV_SPENDING_LINE_CONFIG.other.color),
    getEurBn: (r) => r.other,
  },
  {
    label: 'Public investment',
    notes: 'Infrastructure, transport and climate projects (estimated share of total)',
    color: '#06b6d4',
    getEurBn: (r) => r.total * GOV_SPEND_PUBLIC_INVESTMENT_SHARE_OF_TOTAL,
  },
  {
    label: 'Pensions',
    notes: 'Old-age and survivors\' pensions (estimated share of social protection)',
    color: '#eab308',
    getEurBn: (r) => r.socialProtection * GOV_SPEND_PENSION_SHARE_OF_SOCIAL,
  },
];

/**
 * Italy's twelve category cards. Unlike the German set, every value is a real
 * Eurostat figure (no estimated ratios): the nine spending columns come straight
 * from the COFOG breakdown, and Pensions / Public investment / Housing are the
 * actual GF10.02, P.51g and GF06 series carried on the Italy row.
 */
type ItalyGovSpendCardDef = {
  label: string;
  notes: string;
  color: string;
  getEurBn: (row: ItalyGovSpendingYearRow) => number;
};

const ITALY_GOV_SPEND_CARD_DEFS: readonly ItalyGovSpendCardDef[] = [
  { label: 'Social Benefits & Social Protection', notes: 'Pensions, income support, family and unemployment benefits (COFOG GF10)', color: '#22c55e', getEurBn: (r) => r.socialProtection },
  { label: 'Health', notes: 'National Health Service (SSN) and public health (GF07)', color: '#60a5fa', getEurBn: (r) => r.health },
  { label: 'Education', notes: 'Schools, universities and research (GF09)', color: '#c084fc', getEurBn: (r) => r.educationResearch },
  { label: 'Defence / Military', notes: 'Armed forces and defence procurement (GF02)', color: '#ef4444', getEurBn: (r) => r.defence },
  { label: 'Transport & Infrastructure', notes: 'Roads, rail and transport networks (COFOG GF04.5)', color: '#0ea5e9', getEurBn: (r) => r.transportInfrastructure },
  { label: 'General Public Services & Administration', notes: 'Core administration, excluding debt interest (GF01 net of interest)', color: '#a855f7', getEurBn: (r) => r.generalPublicServices },
  { label: 'Interest Payments on Debt', notes: 'Interest on Italy\'s public debt (D.41 payable)', color: '#f97316', getEurBn: (r) => r.interestPayments },
  { label: 'Housing & Community', notes: 'Housing and community amenities incl. building-renovation credits (GF06)', color: '#14b8a6', getEurBn: (r) => r.housing },
  { label: 'Economic Affairs & Subsidies', notes: 'Industry, energy, agriculture and business support, excl. transport (GF04)', color: '#84cc16', getEurBn: (r) => r.economicAffairsSubsidies },
  { label: 'Other (Public Order, Environment, Culture)', notes: 'Public order & safety, environmental protection and recreation/culture (GF03/05/08)', color: '#f43f5e', getEurBn: (r) => r.other },
  { label: 'Public investment', notes: 'General government gross fixed capital formation (P.51g)', color: '#06b6d4', getEurBn: (r) => r.publicInvestment },
  { label: 'Pensions', notes: 'Old-age pensions (COFOG GF10.02) — Italy\'s single largest outlay', color: '#eab308', getEurBn: (r) => r.pensions },
];

function buildItalyGovSpendCategoryCardsForYear(row: ItalyGovSpendingYearRow) {
  const total = row.total;
  return ITALY_GOV_SPEND_CARD_DEFS.map((def) => {
    const eurBn = def.getEurBn(row);
    return {
      label: def.label,
      eurBn,
      sharePct: total > 0 ? (eurBn / total) * 100 : 0,
      notes: def.notes,
      color: def.color,
    };
  });
}

function govSpendRowForYear(year: number, iso3: string): GermanyGovSpendingSeriesRow {
  if (iso3.toUpperCase() === 'FRA') {
    return {
      ...franceGovSpendRowForYear(year),
      total: franceGeneralGovExpenditureForYear(year).total,
    } as GermanyGovSpendingSeriesRow;
  }
  return GERMANY_GOV_SPENDING_SERIES.find((r) => Number(r.year) === year) ?? GERMANY_GOV_SPENDING_SERIES.at(-1)!;
}

function buildGovSpendCategoryCardsForYear(
  row: GermanyGovSpendingSeriesRow,
): Array<{
  label: string;
  eurBn: number;
  sharePct: number;
  notes: string;
  color: string;
}> {
  const total = row.total;
  return GERMANY_GOV_SPEND_CARD_DEFS.map((def) => {
    const eurBn = def.getEurBn(row);
    return {
      label: def.label,
      eurBn,
      sharePct: total > 0 ? (eurBn / total) * 100 : 0,
      notes: def.notes,
      color: def.color,
    };
  });
}

export { GERMANY_GOV_SPENDING_EXTRA_CARD_COUNT } from '../lib/govSpendingMeta';

const GERMANY_GOV_SPENDING_CONTEXT_KEYS = [
  'total',
  'gdpPerCapitaUsd',
  'laborProductivityIndex',
  'hdi',
] as const satisfies readonly GermanyGovSpendingSeriesKey[];

const GERMANY_CORRUPTION_LOST_CHART_CONFIG = {
  lostBnEur: { label: 'Money lost (€bn)', color: '#f59e0b' },
  pctGdp: { label: '% of GDP', color: '#a78bfa' },
} satisfies ChartConfig;

type GovExpenditureSeriesPoint = { year: string; total: number };

function GovernmentTotalExpenditureChart({
  title,
  description,
  series,
  seriesLabel,
}: {
  title: string;
  description: string;
  series: readonly GovExpenditureSeriesPoint[];
  seriesLabel: string;
}) {
  const chartConfig = {
    total: { label: seriesLabel, color: '#f59e0b' },
  } satisfies ChartConfig;

  return (
    <Card className="col-span-full border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2 sm:p-5 sm:pb-3">
        <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-300">
          {title}
        </CardTitle>
        <CardDescription className="font-sans text-[10px] font-medium text-neutral-400">{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 8, right: 10, left: 12, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fill: 'rgba(212,212,212,0.9)', fontSize: 11, fontWeight: 500, fontFamily: CHART_AXIS_FONT }}
                axisLine={false}
                tickLine={false}
                minTickGap={28}
              />
              <YAxis
                tickFormatter={(v) => `€${Number(v).toFixed(0)}B`}
                tick={{ fill: 'rgba(212,212,212,0.9)', fontSize: 11, fontWeight: 500, fontFamily: CHART_AXIS_FONT }}
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

function GermanyGovernmentTotalExpenditureChart() {
  return (
    <GovernmentTotalExpenditureChart
      title="Total government expenditure"
      description="Billions of euros (€bn), 2000–2025."
      series={GERMANY_GOV_SPENDING_SERIES}
      seriesLabel="Total government expenditure"
    />
  );
}

function FranceGovernmentTotalExpenditureChart() {
  return (
    <GovernmentTotalExpenditureChart
      title="Total General Government Expenditure"
      description="Billion Euros (€bn) – Official INSEE / Eurostat general government (S13) data · 2000–2025"
      series={FRANCE_GENERAL_GOVERNMENT_EXPENDITURE_SERIES}
      seriesLabel="Total General Government Expenditure"
    />
  );
}

function ItalyGovernmentTotalExpenditureChart() {
  return (
    <GovernmentTotalExpenditureChart
      title="Total General Government Expenditure"
      description="Billion Euros (€bn) – Official ISTAT / Eurostat general government (S13) data · 2000–2025"
      series={ITALY_GENERAL_GOVERNMENT_EXPENDITURE_SERIES}
      seriesLabel="Total General Government Expenditure"
    />
  );
}

function formatGovSpendingContextValue(key: (typeof GERMANY_GOV_SPENDING_CONTEXT_KEYS)[number], value: number): string {
  if (key === 'total') return `€${value.toFixed(1)}B`;
  if (key === 'gdpPerCapitaUsd') return `$${Math.round(value).toLocaleString('en-US')}`;
  if (key === 'laborProductivityIndex') return value.toFixed(1);
  return value.toFixed(3);
}

function govSpendingContextSubtitle(
  key: (typeof GERMANY_GOV_SPENDING_CONTEXT_KEYS)[number],
  year: number,
  iso3?: string,
  isItaly?: boolean,
): string {
  if (key === 'total' && isItaly) {
    return `ISTAT / Eurostat general government (S13) · ${year}`;
  }
  if (key === 'total' && iso3?.toUpperCase() === 'FRA') {
    return `INSEE / Eurostat general government (S13) · ${year}`;
  }
  if (key === 'total') return `General government expenditure · ${year}`;
  if (key === 'gdpPerCapitaUsd') return `Nominal USD · ${year}`;
  if (key === 'laborProductivityIndex') return `Index (2000 = 100) · ${year}`;
  return `Human Development Index · ${year}`;
}

function GermanyGovSpendingContextMetricTile({
  selectedYear,
  seriesKey,
  iso3,
  isItaly = false,
}: {
  selectedYear: number;
  seriesKey: (typeof GERMANY_GOV_SPENDING_CONTEXT_KEYS)[number];
  iso3: string;
  isItaly?: boolean;
}) {
  const isFrance = iso3.toUpperCase() === 'FRA' && !isItaly;
  const row = useMemo(
    () => (isItaly ? italyGovSpendRowForYear(selectedYear) : govSpendRowForYear(selectedYear, iso3)),
    [selectedYear, iso3, isItaly],
  );
  const cfg = GERMANY_GOV_SPENDING_LINE_CONFIG[seriesKey];
  const value = row[seriesKey];
  const label =
    (isFrance || isItaly) && seriesKey === 'total' ? 'Total General Government Expenditure' : cfg.label;

  return (
    <article className="flex min-h-[148px] flex-col rounded-md border border-line bg-surface-metric p-4 shadow-card sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
          {label}
        </p>
        <span
          className="shrink-0 rounded border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5 font-sans text-[9px] tabular-nums text-neutral-500"
          style={{ borderColor: `${String(cfg.color)}33` }}
        >
          {selectedYear}
        </span>
      </div>
      <div className="mt-4 min-w-0 flex-1">
        <p
          className="font-sans text-2xl font-semibold tabular-nums leading-none tracking-tight text-neutral-100 transition-all duration-300 sm:text-3xl lg:text-4xl"
          style={{ color: String(cfg.color) }}
        >
          {formatGovSpendingContextValue(seriesKey, value)}
        </p>
        <p className="mt-1.5 font-sans text-[10px] font-medium leading-snug text-neutral-500">
          {govSpendingContextSubtitle(seriesKey, selectedYear, iso3, isItaly)}
        </p>
      </div>
    </article>
  );
}

function GermanyGovSpendingContextTiles({
  selectedYear,
  iso3,
  isItaly = false,
}: {
  selectedYear: number;
  iso3: string;
  isItaly?: boolean;
}) {
  return (
    <div className="col-span-full grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {GERMANY_GOV_SPENDING_CONTEXT_KEYS.map((key) => (
        <GermanyGovSpendingContextMetricTile
          key={key}
          selectedYear={selectedYear}
          seriesKey={key}
          iso3={iso3}
          isItaly={isItaly}
        />
      ))}
    </div>
  );
}

function GermanyGovernmentSpendingCategoryCards({
  selectedYear,
  iso3,
  isItaly = false,
}: {
  selectedYear: number;
  iso3: string;
  isItaly?: boolean;
}) {
  const cards = useMemo(
    () =>
      isItaly
        ? buildItalyGovSpendCategoryCardsForYear(italyGovSpendRowForYear(selectedYear))
        : buildGovSpendCategoryCardsForYear(govSpendRowForYear(selectedYear, iso3)),
    [selectedYear, iso3, isItaly],
  );

  return (
    <div className="col-span-full grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((category) => (
        <Card
          key={`${selectedYear}-${category.label}`}
          className="overflow-hidden border-line bg-surface-metric shadow-card transition-colors duration-300"
        >
          <CardHeader className="space-y-1 p-3 pb-1.5">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="font-sans text-xs font-semibold leading-snug text-neutral-100">
                {category.label}
              </CardTitle>
              <span className="shrink-0 rounded border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5 font-sans text-[9px] tabular-nums text-neutral-500">
                {selectedYear}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 p-3 pt-0">
            <p className="font-sans text-xl font-semibold tabular-nums tracking-tight text-white transition-all duration-300 sm:text-2xl">
              €{category.eurBn.toFixed(1)}B
            </p>
            <div className="h-2 w-full rounded-full bg-white/[0.08]">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
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

function GermanyGovernmentSpendingCategoryLineChart({
  selectedYear,
  onYearChange,
  iso3,
  isItaly = false,
}: {
  selectedYear: number;
  onYearChange: (year: number) => void;
  iso3: string;
  isItaly?: boolean;
}) {
  const isFrance = iso3.toUpperCase() === 'FRA' && !isItaly;
  const yearButtonRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  useEffect(() => {
    const btn = yearButtonRefs.current.get(selectedYear);
    const scroller = btn?.parentElement;
    if (!btn || !scroller) return;
    const targetLeft = btn.offsetLeft - scroller.clientWidth / 2 + btn.clientWidth / 2;
    scroller.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
  }, [selectedYear]);

  const yearRow = useMemo(() => govSpendRowForYear(selectedYear, iso3), [selectedYear, iso3]);
  const franceYearRow = useMemo(
    () => (isFrance ? franceGovernmentExpenditureCategoryRowForYear(selectedYear) : null),
    [isFrance, selectedYear],
  );
  const italyYearRow = useMemo(
    () => (isItaly ? italyGovernmentExpenditureCategoryRowForYear(selectedYear) : null),
    [isItaly, selectedYear],
  );

  const { chartData, chartConfig, totalBn } = useMemo(() => {
    if (isItaly) {
      if (!italyYearRow) return { chartData: [], chartConfig: {}, totalBn: null };
      const slices = ITALY_GOV_SPENDING_CATEGORY_SERIES_ORDER.map((key, i) => ({
        key,
        name: String(ITALY_GOV_SPENDING_LINE_CONFIG[key].label),
        eurBn: italyYearRow[key],
        fill: String(ITALY_GOV_SPENDING_LINE_CONFIG[key].color),
        paletteIndex: i,
      })).filter((slice) => slice.eurBn > 0);
      const data = slices.map((slice) => ({
        ...slice,
        pieValue: slice.eurBn,
        pctOfTotal: italyYearRow.total > 0 ? (slice.eurBn / italyYearRow.total) * 100 : 0,
      }));
      const cfg = data.reduce<ChartConfig>((acc, row, i) => {
        acc[`slice_${i}`] = { label: row.name, color: row.fill };
        return acc;
      }, {});
      return { chartData: data, chartConfig: cfg, totalBn: italyYearRow.total };
    }

    if (isFrance) {
      if (!franceYearRow) return { chartData: [], chartConfig: {}, totalBn: null };
      const slices = FRANCE_GOV_SPENDING_CATEGORY_SERIES_ORDER.map((key, i) => ({
        key,
        name: String(FRANCE_GOV_SPENDING_LINE_CONFIG[key].label),
        eurBn: franceYearRow[key],
        fill: String(FRANCE_GOV_SPENDING_LINE_CONFIG[key].color),
        paletteIndex: i,
      })).filter((slice) => slice.eurBn > 0);
      const data = slices.map((slice) => ({
        ...slice,
        pieValue: slice.eurBn,
        pctOfTotal: franceYearRow.total > 0 ? (slice.eurBn / franceYearRow.total) * 100 : 0,
      }));
      const cfg = data.reduce<ChartConfig>((acc, row, i) => {
        acc[`slice_${i}`] = { label: row.name, color: row.fill };
        return acc;
      }, {});
      return { chartData: data, chartConfig: cfg, totalBn: franceYearRow.total };
    }

    const slices = GERMANY_GOV_SPENDING_CATEGORY_SERIES_ORDER.map((key, i) => {
      const eurBn = yearRow[key];
      return {
        key,
        name: GERMANY_GOV_SPENDING_LINE_CONFIG[key].label,
        eurBn,
        fill: String(GERMANY_GOV_SPENDING_LINE_CONFIG[key].color),
        paletteIndex: i,
      };
    }).filter((s) => s.eurBn > 0);

    const total = slices.reduce((sum, s) => sum + s.eurBn, 0);
    const data = slices.map((s) => ({
      ...s,
      pieValue: s.eurBn,
      pctOfTotal: total > 0 ? (s.eurBn / total) * 100 : 0,
    }));

    const cfg = data.reduce<ChartConfig>((acc, row, i) => {
      acc[`slice_${i}`] = { label: row.name, color: row.fill };
      return acc;
    }, {});

    return { chartData: data, chartConfig: cfg, totalBn: yearRow.total };
  }, [franceYearRow, italyYearRow, isFrance, isItaly, yearRow]);

  return (
    <Card className="col-span-full border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2 sm:p-5 sm:pb-3">
        <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-300">
          {isItaly
            ? 'Italy – Government Expenditure by Category (2000–2025)'
            : isFrance
              ? 'France – Government Expenditure by Category (2000–2025)'
              : 'Government Expenditure By Category (2000-2025)'}
        </CardTitle>
        <CardDescription className="font-sans text-[10px] font-medium text-neutral-400">
          {isItaly
            ? '€ billions, current prices — General Government, S13 · ISTAT / Eurostat COFOG · Select a year below (2025 provisional)'
            : isFrance
              ? '€ billions, current prices — General Government, S13 · Select a year below'
              : 'Select a year below · pie and category cards update together (€bn)'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-4 pt-0 sm:p-5 sm:pt-0">
        <p className="text-center font-sans text-sm tabular-nums text-neutral-500">
          {isFrance || isItaly ? 'Total General Government Expenditure' : 'Total expenditure'} ·{' '}
          <span className="font-semibold text-neutral-300">
            {totalBn == null ? 'Not available' : `€${totalBn.toFixed(isFrance ? 3 : 1)}B`}
          </span>
        </p>

        {chartData.length > 0 ? (
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-center lg:gap-10">
            <ChartContainer
              key={selectedYear}
              config={chartConfig}
              className="mx-auto h-[300px] w-full max-w-[360px] shrink-0 sm:max-w-[400px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0a0a0a',
                      border: '1px solid #404040',
                      borderRadius: '4px',
                      fontFamily: CHART_AXIS_FONT,
                      fontSize: '11px',
                    }}
                    formatter={(value, _name, item) => {
                      const row = (item as { payload?: { eurBn?: number; pctOfTotal?: number } })?.payload;
                      const bn = row?.eurBn;
                      const pct = row?.pctOfTotal;
                      if (typeof bn === 'number' && typeof pct === 'number') {
                        return [`€${bn.toFixed(isFrance ? 3 : 1)}B (${pct.toFixed(1)}%)`, 'Share'];
                      }
                      return [`€${Number(value).toFixed(isFrance ? 3 : 1)}B`, 'Share'];
                    }}
                  />
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
                    isAnimationActive
                    animationDuration={520}
                    animationEasing="ease-out"
                  >
                    {chartData.map((entry, i) => (
                      <Cell key={`${entry.key}-${i}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <ul className="min-w-0 flex-1 space-y-1.5">
              {chartData.map((s) => (
                <li
                  key={s.key}
                  className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 font-sans text-[11px] text-neutral-300"
                >
                  <span
                    className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-sm"
                    style={{ backgroundColor: s.fill }}
                  />
                  <span className="min-w-0 flex-1 break-words">{s.name}</span>
                  <span className="shrink-0 tabular-nums text-neutral-500">{s.pctOfTotal.toFixed(1)}%</span>
                  <span className="w-full pl-5 font-sans text-[10px] font-medium tabular-nums text-neutral-500 sm:w-auto sm:pl-2">
                    €{s.eurBn.toFixed(isFrance ? 3 : 1)}B
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="py-8 text-center font-sans text-xs text-neutral-500">No category data for this year.</p>
        )}

        <div className="border-t border-white/[0.06] pt-4">
          <div
            className="scrollbar-none flex items-end justify-center gap-1.5 overflow-x-auto px-2 pb-1"
            role="tablist"
            aria-label="Select expenditure year"
          >
            {GERMANY_GOV_SPENDING_YEARS.map((year) => {
              const active = year === selectedYear;
              return (
                <button
                  key={year}
                  ref={(el) => {
                    if (el) yearButtonRefs.current.set(year, el);
                    else yearButtonRefs.current.delete(year);
                  }}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`Year ${year}`}
                  onClick={() => onYearChange(year)}
                  className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border transition-all duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 ${
                    active
                      ? 'gov-spend-year-pill-active h-8 min-w-[3.75rem] border-white/20 bg-white/[0.08] px-3'
                      : 'h-6 w-6 border-white/[0.10] bg-white/[0.03] hover:scale-110 hover:border-white/25 hover:bg-white/[0.06]'
                  }`}
                >
                  <span
                    className={`font-sans text-[11px] font-semibold tabular-nums tracking-tight ${
                      active
                        ? 'gov-spend-year-label-active text-neutral-100'
                        : 'pointer-events-none absolute opacity-0'
                    }`}
                  >
                    {year}
                  </span>
                  <span
                    aria-hidden
                    className={`rounded-full bg-neutral-500 transition-all duration-300 ease-out ${
                      active ? 'h-0 w-0 scale-0 opacity-0' : 'h-1.5 w-1.5 scale-100 opacity-100'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function GermanyCorruptionLostMetricTile({
  selectedYear,
  iso3,
}: {
  selectedYear: number;
  iso3: string;
}) {
  const isItaly = iso3.toUpperCase() === 'ITA';
  const row = useMemo(() => {
    if (isItaly) {
      const italyRow = italyFiscalSupportRowForYear(selectedYear);
      return { lostValue: italyRow.lostToCorruptionMn, pctGdp: null };
    }
    const countryRow =
      iso3.toUpperCase() === 'FRA'
        ? franceCorruptionLostRowForYear(selectedYear)
        : germanyCorruptionLostRowForYear(selectedYear);
    return { lostValue: countryRow.lostBnEur, pctGdp: countryRow.pctGdp };
  }, [selectedYear, iso3, isItaly]);

  return (
    <article className="flex min-h-[148px] flex-col rounded-md border border-line bg-surface-metric p-4 shadow-card sm:p-5">
      <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
        Lost to Corruption
      </p>
      <div className="mt-4 min-w-0 flex-1">
        <p className="font-sans text-2xl font-semibold tabular-nums leading-none tracking-tight text-neutral-100 transition-all duration-300 sm:text-3xl lg:text-4xl">
          €{row.lostValue.toFixed(isItaly ? 0 : 1)}{isItaly ? 'M' : 'B'}
        </p>
        <p className="mt-1.5 font-sans text-[10px] font-medium leading-snug text-neutral-500">
          {row.pctGdp == null
            ? `Immigration & asylum systems · ${selectedYear}`
            : `${row.pctGdp.toFixed(2)}% of GDP · ${selectedYear}`}
        </p>
      </div>
      {!isItaly ? (
        <div className="mt-auto pt-3">
          <SourceLinks
            url={GERMANY_CORRUPTION_LOST_SOURCE_URL}
            className="inline-flex w-fit items-center gap-1 font-sans text-[10px] text-[var(--uk-accent)] hover:text-neutral-200"
          />
        </div>
      ) : null}
    </article>
  );
}

function GermanyCorruptionLostChart({ selectedYear, iso3 }: { selectedYear: number; iso3: string }) {
  const isFrance = iso3.toUpperCase() === 'FRA';
  const isItaly = iso3.toUpperCase() === 'ITA';
  const chartData = useMemo<readonly { year: number; lostDisplay: number; pctGdp: number | null }[]>(() => {
    if (isItaly) {
      return ITALY_FISCAL_SUPPORT_BY_YEAR.map((r) => ({
        year: r.year,
        lostDisplay: r.lostToCorruptionMn,
        pctGdp: null,
      }));
    }
    return (isFrance ? FRANCE_CORRUPTION_LOST_BY_YEAR : GERMANY_CORRUPTION_LOST_BY_YEAR).map((r) => ({
      year: r.year,
      lostDisplay: r.lostBnEur,
      pctGdp: r.pctGdp,
    }));
  }, [isFrance, isItaly]);
  const countryLabel = isItaly ? 'Italy' : isFrance ? 'France' : 'Germany';

  return (
    <Card className="col-span-full border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2 sm:p-5 sm:pb-3">
        <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          Money Lost to Corruption
        </CardTitle>
        <CardDescription className="font-sans text-[10px] text-neutral-500">
          {countryLabel} · 2000–2025 ({isItaly ? 'million €' : 'billion € and % of GDP'}) · highlighted year matches category chart and lead tiles
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0 sm:p-5 sm:pt-0">
        <ChartContainer config={GERMANY_CORRUPTION_LOST_CHART_CONFIG} className="h-[280px] w-full sm:h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 12, left: 4, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                yAxisId="left"
                tick={{ fill: 'rgba(163,163,163,0.85)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={isItaly ? 56 : 48}
                tickFormatter={(v) => `€${Number(v)}${isItaly ? 'M' : 'B'}`}
              />
              {!isItaly ? (
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: 'rgba(163,163,163,0.85)', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={44}
                  tickFormatter={(v) => `${Number(v).toFixed(2)}%`}
                />
              ) : null}
              <ReferenceLine
                x={selectedYear}
                yAxisId="left"
                stroke="rgba(255,255,255,0.25)"
                strokeDasharray="4 4"
              />
              <ChartTooltip
                cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                content={
                  <ChartTooltipContent
                    className="rounded-md"
                    labelFormatter={(y) => `Year ${y}`}
                    formatter={(value, name) => {
                      const n = Number(value);
                      const label = String(name ?? '');
                      if (label.includes('GDP')) return [`${n.toFixed(2)}%`, '% of GDP'];
                      return [`€${n.toFixed(isItaly ? 0 : 1)}${isItaly ? 'M' : 'B'}`, 'Money lost'];
                    }}
                  />
                }
              />
              <Legend wrapperStyle={{ fontSize: 10, paddingTop: 8 }} iconType="line" />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="lostDisplay"
                name={GERMANY_CORRUPTION_LOST_CHART_CONFIG.lostBnEur.label}
                stroke={GERMANY_CORRUPTION_LOST_CHART_CONFIG.lostBnEur.color}
                strokeWidth={2}
                dot={{ r: 2, fill: GERMANY_CORRUPTION_LOST_CHART_CONFIG.lostBnEur.color }}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
              {!isItaly ? (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="pctGdp"
                  name={GERMANY_CORRUPTION_LOST_CHART_CONFIG.pctGdp.label}
                  stroke={GERMANY_CORRUPTION_LOST_CHART_CONFIG.pctGdp.color}
                  strokeWidth={2}
                  dot={{ r: 2, fill: GERMANY_CORRUPTION_LOST_CHART_CONFIG.pctGdp.color }}
                  activeDot={{ r: 4 }}
                  strokeDasharray="4 3"
                  isAnimationActive={false}
                />
              ) : null}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function GermanyGovernmentSpendingCategoryBlock({
  selectedYear,
  onYearChange,
  iso3,
  isItaly = false,
}: {
  selectedYear: number;
  onYearChange: (year: number) => void;
  iso3: string;
  isItaly?: boolean;
}) {
  return (
    <>
      <GermanyGovernmentSpendingCategoryLineChart
        selectedYear={selectedYear}
        onYearChange={onYearChange}
        iso3={iso3}
        isItaly={isItaly}
      />
      <GermanyGovernmentSpendingCategoryCards selectedYear={selectedYear} iso3={iso3} isItaly={isItaly} />
      <GermanyGovSpendingContextTiles selectedYear={selectedYear} iso3={iso3} isItaly={isItaly} />
    </>
  );
}

export function GermanyGovernmentSpendingDESection({
  subRows,
  iso3,
  actualIso3,
}: {
  subRows: CountryStatMetric[];
  iso3: string;
  actualIso3?: string;
}) {
  const isFrance = iso3.toUpperCase() === 'FRA';
  const isItaly = actualIso3?.toUpperCase() === 'ITA';
  const fiscalIso3 = isItaly ? 'ITA' : iso3;
  const [selectedYear, setSelectedYear] = useState(() => (isFrance && !isItaly ? 2024 : 2025));

  useEffect(() => {
    setSelectedYear(isFrance && !isItaly ? 2024 : 2025);
  }, [isFrance, isItaly]);

  const immigrationRow = subRows.find((r) => r.metric === 'Immigration welfare spending');
  const foreignAidRow = subRows.find((r) => r.metric === 'Foreign Aid');

  return (
    <div className="flex flex-col gap-4">
      {isItaly ? (
        <ItalyGovernmentTotalExpenditureChart />
      ) : isFrance ? (
        <FranceGovernmentTotalExpenditureChart />
      ) : (
        <GermanyGovernmentTotalExpenditureChart />
      )}
      <GermanyGovernmentSpendingCategoryBlock
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        iso3={iso3}
        isItaly={isItaly}
      />

      <div className={STAT_GRID}>
        <GermanyImmigrationWelfareYearTile
          selectedYear={selectedYear}
          sourceRow={isItaly ? undefined : immigrationRow}
          iso3={fiscalIso3}
        />
        <GermanyCorruptionLostMetricTile selectedYear={selectedYear} iso3={fiscalIso3} />
        <GermanyForeignAidYearTile
          selectedYear={selectedYear}
          sourceRow={isItaly ? undefined : foreignAidRow}
          iso3={fiscalIso3}
        />
      </div>

      <GermanyCorruptionLostChart selectedYear={selectedYear} iso3={fiscalIso3} />
    </div>
  );
}

