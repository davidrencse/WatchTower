import { GermanyMarriagesSection } from '../germany/GermanyMarriagesSection';
import {
  ITALY_MARRIAGE_EUROSTAT_URL,
  ITALY_MARRIAGE_ISTAT_2025_URL,
  ITALY_MARRIAGE_RATES_SERIES,
} from '../../../lib/countries/italy/italyMarriageRates';
import {
  ITALY_FEMALE_MIXED_MARRIAGE_SERIES,
  ITALY_FEMALE_MIXED_MARRIAGE_TABLE,
  ITALY_MALE_MIXED_MARRIAGE_SERIES,
  ITALY_MALE_MIXED_MARRIAGE_TABLE,
  ITALY_MIXED_MARRIAGES_ISTAT_HISTORY_URL,
  ITALY_MIXED_MARRIAGES_ISTAT_TABLES_URL,
  ITALY_MIXED_MARRIAGES_ISTAT_URL,
} from '../../../lib/countries/italy/italyMixedMarriages';
import {
  ITALY_LGBT_UNION_SERIES,
  ITALY_LGBT_UNIONS_ISTAT_2024_URL,
  ITALY_LGBT_UNIONS_ISTAT_EARLY_URL,
  ITALY_LGBT_UNIONS_ISTAT_TABLES_URL,
} from '../../../lib/countries/italy/italyLgbtUnions';

/**
 * Italy's marriage subsection: Germany's layout driven entirely by Istat/Eurostat series.
 *
 * This wrapper exists so Italy's marriage tables (the largest single country data module in
 * the dossier) load with Italy's chunk instead of the shared dashboard chunk every country pays for.
 */
export function ItalyMarriagesSection() {
  return (
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
          . The Italian female and male tables use the supplied spouse citizenship series and
          origin breakdowns; ~ marks approximate values and (est.) marks estimates. Annual
          2018–2024 Italian/foreign spouse totals are official Istat counts. The Germany UI’s
          broad origin buckets are Italy-weighted estimates based on Istat’s published
          spouse-citizenship distribution; Istat defines “mixed” by citizenship, not race.
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
          . Italy’s legal category is same-sex civil unions, introduced in July 2016. “Gay” and
          “Lesbian” reproduce the Germany UI’s wording and map to Istat’s male-couple and
          female-couple series. The 2016–2017 sex split applies Istat’s combined two-year split
          to each annual total. The 2025 estimate applies Istat’s provisional first-nine-month
          decline of 3.1% to the 2024 total and retains the 2024 sex split.
        </>
      }
    />
  );
}
