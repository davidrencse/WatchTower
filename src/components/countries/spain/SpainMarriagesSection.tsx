import { memo } from 'react';
import { CollapsibleFlagSection } from '../../CollapsibleFlagSection';
import {
  GermanyMarriagesSection,
  LgbtMarriagesSection,
  MarriageSummaryCard,
  type LgbtMarriageLabels,
} from '../germany/GermanyMarriagesSection';
import {
  SPAIN_MARRIAGE_2024_RELEASE_URL,
  SPAIN_MARRIAGE_INDICATORS_URL,
  SPAIN_MARRIAGE_RATES_SERIES,
} from '../../../lib/countries/spain/spainMarriageRates';
import {
  SPAIN_MARRIAGES_BY_NATIONALITY_URL,
  SPAIN_MARRIAGES_LATEST_DATA_URL,
} from '../../../lib/countries/spain/spainMarriagePies';
import { SpainMarriageCategoryDetail } from './SpainMarriageCategoryDetail';
import {
  SPAIN_FEMALE_COUPLE_MARRIAGES_INE_URL,
  SPAIN_MALE_COUPLE_MARRIAGES_INE_URL,
  SPAIN_MARRIAGES_2024_INE_PRESS_URL,
  SPAIN_SAME_SEX_MARRIAGE_SERIES,
} from '../../../lib/countries/spain/spainLgbtMarriages';

export const SPAIN_MARRIAGES_GROUP_COUNT = 16;

const SPAIN_SAME_SEX_MARRIAGE_LABELS: LgbtMarriageLabels = {
  totalSummary: 'Total same-sex marriages',
  maleSummary: 'Male-couple marriages',
  femaleSummary: 'Female-couple marriages',
  pieTitle: "Same-sex marriages by spouses' sex (pie)",
  trendTitle: 'Same-sex marriages by year (line)',
  totalSeries: 'Total same-sex marriages',
  maleSeries: 'Male-couple marriages',
  femaleSeries: 'Female-couple marriages',
};

export const SpainMarriagesSection = memo(function SpainMarriagesSection() {
  return (
    <div className="flex flex-col gap-3">
      <GermanyMarriagesSection
        ratesOnly
        marriageRatesSeries={SPAIN_MARRIAGE_RATES_SERIES}
        marriageRatesSourceNote={
          <>
            Source:{' '}
            <a className="text-[var(--uk-accent)] hover:text-neutral-200" href={SPAIN_MARRIAGE_2024_RELEASE_URL} target="_blank" rel="noreferrer">
              INE, Movimiento Natural de la Población 2024
            </a>
            . INE reports 175,364 marriages and a crude rate of 3.57 per 1,000 in 2024. The 2025 observation is not yet available and remains blank.
          </>
        }
        marriageAgeSourceNote={
          <>
            Average age at marriage across all marriages, not average age at first marriage. Source:{' '}
            <a className="text-[var(--uk-accent)] hover:text-neutral-200" href={SPAIN_MARRIAGE_INDICATORS_URL} target="_blank" rel="noreferrer">
              INE marriage indicators
            </a>
            . The 2025 observation is not yet available and remains blank.
          </>
        }
      />

      <CollapsibleFlagSection title="Nationality / origin marriages" count={9} defaultOpen>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <MarriageSummaryCard title="Total marriages" value="≈4,670,000" />
            <MarriageSummaryCard title="Total inter-nationality marriages (Spanish female)" value="≈390,000" />
            <MarriageSummaryCard title="Total inter-nationality marriages (Spanish male)" value="≈570,000" />
          </div>

          <SpainMarriageCategoryDetail />

          <p className="max-w-4xl font-sans text-[11px] leading-relaxed text-neutral-500">
            Cumulative totals and category shares are reconstructed dashboard estimates, not a verbatim INE 2000–2025 series. The underlying concept is spouse nationality/origin, not race or ethnicity. Source:{' '}
            <a className="text-[var(--uk-accent)] hover:text-neutral-200" href={SPAIN_MARRIAGES_BY_NATIONALITY_URL} target="_blank" rel="noreferrer">
              INE marriages by nationality of spouses
            </a>
            . As a consistency check, INE&apos;s{' '}
            <a className="text-[var(--uk-accent)] hover:text-neutral-200" href={SPAIN_MARRIAGES_LATEST_DATA_URL} target="_blank" rel="noreferrer">
              latest marriage data
            </a>{' '}
            records 175,364 marriages in 2024: 137,590 between two Spanish spouses and 37,774 with at least one foreign spouse.
          </p>
        </div>
      </CollapsibleFlagSection>

      <LgbtMarriagesSection
        series={SPAIN_SAME_SEX_MARRIAGE_SERIES}
        sectionTitle="LGBT marriages"
        rangeLabel="2005–2024"
        labels={SPAIN_SAME_SEX_MARRIAGE_LABELS}
        approximateTotals={false}
        sourceNote={
          <>
            Source: INE annual tables for{' '}
            <a
              className="text-[var(--uk-accent)] hover:text-neutral-200"
              href={SPAIN_MALE_COUPLE_MARRIAGES_INE_URL}
              target="_blank"
              rel="noreferrer"
            >
              marriages between men
            </a>{' '}
            and{' '}
            <a
              className="text-[var(--uk-accent)] hover:text-neutral-200"
              href={SPAIN_FEMALE_COUPLE_MARRIAGES_INE_URL}
              target="_blank"
              rel="noreferrer"
            >
              marriages between women
            </a>
            , definitive national counts for 2005–2024. The{' '}
            <a
              className="text-[var(--uk-accent)] hover:text-neutral-200"
              href={SPAIN_MARRIAGES_2024_INE_PRESS_URL}
              target="_blank"
              rel="noreferrer"
            >
              2024 INE release
            </a>{' '}
            confirms 7,336 same-sex marriages: 51.7% female couples and 48.3% male couples. The
            2005 point covers July–December because the law took effect on 3 July. INE classifies
            couples by spouses&apos; sex; it does not measure sexual orientation.
          </>
        }
      />
    </div>
  );
});
