import type { CountryStatMetric } from '../../../types/countryStats';

const ISTAT_DEMOGRAPHIC_INDICATORS_URL =
  'https://www.istat.it/en/press-release/demographic-indicators-year-2025/';
const PEW_RELIGIOUS_COMPOSITION_URL =
  'https://www.pewresearch.org/religion/feature/religious-composition-by-country-2010-2020/';
const MUR_STUDENT_AID_REPORT_URL =
  'https://ustat.mur.gov.it/media/1313/focus-il-diritto-allo-studio-universitario-nellanno-accademico-2023-2024.pdf';
const EUROSTAT_CITIZENSHIP_DATA_URL =
  'https://ec.europa.eu/eurostat/databrowser/view/migr_pop1ctz/default/table?lang=en';
const EUROSTAT_MEDIAN_AGE_URL =
  'https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20260213-2';
const EUROSTAT_FOREIGN_BORN_URL =
  'https://ec.europa.eu/eurostat/databrowser/view/migr_pop3ctb/default/table?lang=en';
const MUR_UNIVERSITY_DATA_URL =
  'https://ustat.mur.gov.it/dati/didattica/italia/atenei';
const EUROSTAT_FOREIGN_STUDENTS_URL =
  'https://ec.europa.eu/eurostat/databrowser/view/educ_uoe_mobs02/default/table?lang=en';

const ITALY_FOREIGN_STUDENT_ORIGINS = [
  { country: 'Asia', count: 38_007, sharePct: 35.704 },
  { country: 'Europe', count: 34_284, sharePct: 32.207 },
  { country: 'Africa', count: 14_082, sharePct: 13.229 },
  { country: 'Caribbean, Central & South America', count: 8_857, sharePct: 8.32 },
  { country: 'Not specified', count: 8_996, sharePct: 8.451 },
  { country: 'Northern America', count: 2_095, sharePct: 1.968 },
  { country: 'Oceania', count: 129, sharePct: 0.121 },
];

const ITALY_STUDENT_AID_VALUE = JSON.stringify({
  totalAid: 278_810,
  origins: [
    { country: 'North-West', aidCount: 49_415, sharePct: 17.724 },
    { country: 'North-East', aidCount: 51_868, sharePct: 18.603 },
    { country: 'Centre', aidCount: 56_154, sharePct: 20.141 },
    { country: 'South', aidCount: 85_218, sharePct: 30.565 },
    { country: 'Islands', aidCount: 36_155, sharePct: 12.968 },
  ],
});

function patchOrAddMetric(
  metrics: CountryStatMetric[],
  metric: string,
  patch: Omit<CountryStatMetric, 'metric'>,
): CountryStatMetric[] {
  const idx = metrics.findIndex((item) => item.metric === metric);
  const replacement: CountryStatMetric = { metric, ...patch };

  if (idx < 0) return [...metrics, replacement];

  const next = [...metrics];
  next[idx] = replacement;
  return next;
}

/**
 * Italy-specific lead demographics tiles.
 *
 * Italy does not collect race in its population register, so the tile retained by
 * the shared UI as "White (native)" uses Italian citizenship as a clearly disclosed
 * proxy. The military-age measure likewise uses foreign citizenship, not the broader
 * and unavailable concept of migrant background.
 */
export function applyItalyDemographicsMetricOverrides(
  metrics: CountryStatMetric[],
): CountryStatMetric[] {
  let next = metrics;

  next = patchOrAddMetric(next, 'Immigrants', {
    value: '6,928,045 (11.8%)',
    reference_period: '1 January 2025',
    geography_used: 'Italy',
    source_name: 'Eurostat',
    source_url: EUROSTAT_FOREIGN_BORN_URL,
    source_publication_or_access_date: 'Dataset migr_pop3ctb, accessed 26 July 2026',
    notes:
      'Foreign-born residents, regardless of current citizenship. This is the closest harmonised measure to the shared dashboard label "Immigrants"; it is broader than foreign citizenship and narrower than immigrants plus descendants.',
  });

  next = patchOrAddMetric(next, 'Foreign students (total)', {
    value: '110,553',
    reference_period: 'Academic year 2024/25',
    geography_used: 'Italy',
    source_name: 'MUR / USTAT',
    source_url: MUR_UNIVERSITY_DATA_URL,
    source_publication_or_access_date: '2024/25 final data; accessed 26 July 2026',
    notes:
      'International degree students enrolled at Italian universities. MUR defines an international student by a secondary-school qualification earned abroad, irrespective of citizenship or birthplace.',
  });

  next = patchOrAddMetric(next, 'Foreign students by origin (pie)', {
    value: JSON.stringify(ITALY_FOREIGN_STUDENT_ORIGINS),
    reference_period: '2023',
    geography_used: 'Italy',
    source_name: 'Eurostat',
    source_url: EUROSTAT_FOREIGN_STUDENTS_URL,
    source_publication_or_access_date: 'Dataset educ_uoe_mobs02, accessed 26 July 2026',
    notes:
      'Official origin-region distribution of 106,450 tertiary students from abroad. The pie uses the Eurostat learning-mobility definition and therefore differs slightly from MUR’s newer 2024/25 total.',
  });

  next = patchOrAddMetric(next, 'White (native) population', {
    value: '53.383 million (90.6%)',
    reference_period: '1 January 2026 (provisional)',
    geography_used: 'Italy',
    source_name: 'Istat',
    source_url: ISTAT_DEMOGRAPHIC_INDICATORS_URL,
    source_publication_or_access_date: '31 March 2026',
    notes:
      'Official Italian-citizen resident population, used only as a proxy because Italy does not publish a racial "White" population count. Citizenship is not race, ethnicity, or birthplace: the figure includes naturalized citizens and excludes foreign citizens born in Italy.',
  });

  next = patchOrAddMetric(next, 'Foreign Population', {
    value: '5.560 million (9.4%)',
    reference_period: '1 January 2026 (provisional)',
    geography_used: 'Italy',
    source_name: 'Istat',
    source_url: ISTAT_DEMOGRAPHIC_INDICATORS_URL,
    source_publication_or_access_date: '31 March 2026',
    notes:
      'Foreign citizens registered as residents. This is a citizenship measure, not the foreign-born population.',
  });

  next = patchOrAddMetric(next, 'Christian population', {
    value: '48.21 million (80.5%)',
    reference_period: '2020 estimate (published 2025)',
    geography_used: 'Italy',
    source_name: 'Pew Research Center',
    source_url: PEW_RELIGIOUS_COMPOSITION_URL,
    source_publication_or_access_date: '9 June 2025',
    notes:
      'Estimated religious affiliation, not attendance or practice. Italy does not enumerate religion in its population census; Pew synthesizes census and survey evidence and rounds country estimates.',
  });

  next = patchOrAddMetric(next, 'Muslim population', {
    value: '2.65 million (4.4%)',
    reference_period: '2020 estimate (published 2025)',
    geography_used: 'Italy',
    source_name: 'Pew Research Center',
    source_url: PEW_RELIGIOUS_COMPOSITION_URL,
    source_publication_or_access_date: '9 June 2025',
    notes:
      'Estimated religious affiliation, not attendance or practice. Italy does not enumerate religion in its population census; Pew synthesizes census and survey evidence and rounds country estimates.',
  });

  next = patchOrAddMetric(next, 'Jewish population', {
    value: 'about 40,000 (0.07%)',
    reference_period: '2020 estimate (published 2025)',
    geography_used: 'Italy',
    source_name: 'Pew Research Center',
    source_url: PEW_RELIGIOUS_COMPOSITION_URL,
    source_publication_or_access_date: '9 June 2025',
    notes:
      'Rounded estimate of religious affiliation (underlying estimate about 42,550), not synagogue membership or ancestry. Italy does not enumerate religion in its population census.',
  });

  next = patchOrAddMetric(next, 'How Many on Student Aid', {
    value: ITALY_STUDENT_AID_VALUE,
    reference_period: 'Academic year 2023/24',
    geography_used: 'Italy',
    source_name: 'MUR / USTAT',
    source_url: MUR_STUDENT_AID_REPORT_URL,
    source_publication_or_access_date: 'Data captured 31 October 2024',
    notes:
      '278,810 university DSU scholarships were awarded to 285,337 eligible students (97.7% coverage). The pie aggregates the official regional award counts into five macro-areas; it covers all recipients, not only foreign students.',
  });

  next = patchOrAddMetric(next, 'Military-aged males (migrant background)', {
    value: '1,299,484',
    reference_period: '1 January 2025',
    geography_used: 'Italy',
    source_name: 'Eurostat',
    source_url: EUROSTAT_CITIZENSHIP_DATA_URL,
    source_publication_or_access_date: 'Dataset migr_pop1ctz, accessed 26 July 2026',
    notes:
      'Exact sum of male foreign citizens and stateless residents aged 20-44 in Eurostat five-year age bands. This citizenship-based proxy is narrower than "migrant background": it excludes naturalized migrants and descendants who hold Italian citizenship.',
  });

  next = patchOrAddMetric(next, 'Median age', {
    value: '49.1 years',
    reference_period: '1 January 2025',
    geography_used: 'Italy',
    source_name: 'Eurostat',
    source_url: EUROSTAT_MEDIAN_AGE_URL,
    source_publication_or_access_date: '13 February 2026',
    notes: 'Median age of the resident population; the highest recorded among EU countries.',
  });

  return next;
}
