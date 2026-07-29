import type { CountryStatMetric } from '../types/countryStats';

const ISTAT_BIRTHS_2024_URL =
  'https://www.istat.it/en/press-release/births-and-fertility-of-the-resident-population-year-2024/';
const ISTAT_DEMOGRAPHIC_2025_URL =
  'https://www.istat.it/en/press-release/demographic-indicators-year-2025/';
const WORLD_BANK_INDICATORS_URL =
  'https://databank.worldbank.org/reports.aspx?country=ITA&source=2';
const UNFPA_DASHBOARD_URL =
  'https://www.unfpa.org/data/world-population-dashboard';
const HEALTH_MINISTRY_ABORTION_URL =
  'https://www.salute.gov.it/new/sites/default/files/2026-03/Relazione%20IVG-%20dati%202023-%20%20777166231.pdf';
const ISS_CHILD_WEIGHT_URL =
  'https://www.epicentro.iss.it/okkioallasalute/indagine-2023-dati';

function patchOrAddMetric(
  metrics: CountryStatMetric[],
  metric: string,
  patch: Omit<CountryStatMetric, 'metric'>,
): CountryStatMetric[] {
  const index = metrics.findIndex((item) => item.metric === metric);
  const replacement: CountryStatMetric = { metric, ...patch };
  if (index < 0) return [...metrics, replacement];
  const next = [...metrics];
  next[index] = replacement;
  return next;
}

function italyMetric(
  value: string,
  referencePeriod: string,
  sourceName: string,
  sourceUrl: string,
  publicationDate: string,
  notes: string,
): Omit<CountryStatMetric, 'metric'> {
  return {
    value,
    reference_period: referencePeriod,
    geography_used: 'Italy',
    source_name: sourceName,
    source_url: sourceUrl,
    source_publication_or_access_date: publicationDate,
    notes,
  };
}

/** Replace the France scaffold's Birth rates rows with a complete Italy dataset. */
export function applyItalyBirthRateMetricOverrides(
  metrics: CountryStatMetric[],
): CountryStatMetric[] {
  let next = metrics.filter(
    (item) =>
      item.metric !== 'France-born birth rate' &&
      item.metric !== 'Childhood overweight and obesity (France)',
  );

  next = patchOrAddMetric(next, 'Total birth rate', italyMetric(
    '1.14 children per woman',
    '2025 (provisional)',
    'Istat',
    ISTAT_DEMOGRAPHIC_2025_URL,
    '31 March 2026',
    'Official total fertility rate. Istat also reports 355,000 resident births and a crude birth rate of 6.0 per 1,000 residents in 2025.',
  ));
  next = patchOrAddMetric(next, 'Italian-citizen birth rate', italyMetric(
    '1.11 children per woman',
    '2024',
    'Istat',
    ISTAT_BIRTHS_2024_URL,
    '21 October 2025',
    'Official total fertility rate for women with Italian citizenship; citizenship is not ethnicity or birthplace.',
  ));
  next = patchOrAddMetric(next, 'Immigrant birth rate', italyMetric(
    '1.79 children per woman',
    '2024',
    'Istat',
    ISTAT_BIRTHS_2024_URL,
    '21 October 2025',
    'Official total fertility rate for women with foreign citizenship, used as the available proxy for the shared dashboard label "Immigrant".',
  ));
  next = patchOrAddMetric(next, 'Migrant background M:F ratio', italyMetric(
    '105.5 boys per 100 girls',
    '2024 modeled estimate',
    'Istat',
    ISTAT_BIRTHS_2024_URL,
    'Model produced 27 July 2026',
    'Modeled sex ratio at birth for births with at least one foreign-citizen parent. Italy does not publish a national migrant-background male:female birth ratio; this estimate applies the observed national sex ratio to the official 80,761 foreign-parent births.',
  ));
  next = patchOrAddMetric(next, 'Births to foreign-born mothers', italyMetric(
    '70,929 live births (19.2%)',
    '2024',
    'Istat',
    ISTAT_BIRTHS_2024_URL,
    '21 October 2025',
    'Citizenship proxy, not birthplace: 50,593 births had two foreign-citizen parents and 20,336 had a foreign-citizen mother and Italian-citizen father.',
  ));
  next = patchOrAddMetric(next, 'Infant mortality rate', italyMetric(
    '2.3 per 1,000 live births',
    '2024',
    'World Bank / UN IGME',
    WORLD_BANK_INDICATORS_URL,
    '2024 estimate; accessed 27 July 2026',
    'Probability of dying before age one per 1,000 live births.',
  ));
  next = patchOrAddMetric(next, 'Child mortality rate', italyMetric(
    '2.7 per 1,000 live births',
    '2024',
    'World Bank / UN IGME',
    WORLD_BANK_INDICATORS_URL,
    '2024 estimate; accessed 27 July 2026',
    'Under-five mortality: probability of dying before age five per 1,000 live births.',
  ));
  next = patchOrAddMetric(next, 'Contraceptive use', italyMetric(
    '60% of women aged 15–49',
    '2023 estimate',
    'UNFPA',
    UNFPA_DASHBOARD_URL,
    'State of World Population 2023',
    'Estimated contraceptive prevalence using any method among all women aged 15–49; the corresponding estimate for married or in-union women is 67%.',
  ));
  next = patchOrAddMetric(next, 'Abortion rate', italyMetric(
    '5.6 per 1,000 women aged 15–49',
    '2023',
    'Italian Ministry of Health',
    HEALTH_MINISTRY_ABORTION_URL,
    'March 2026',
    'Official rate based on 65,746 notified voluntary terminations of pregnancy.',
  ));
  next = patchOrAddMetric(next, 'Teen birth rate', italyMetric(
    '2.871 per 1,000 women aged 15–19',
    '2024',
    'World Bank',
    WORLD_BANK_INDICATORS_URL,
    '2024 estimate; accessed 27 July 2026',
    'Adolescent fertility rate, births per 1,000 women aged 15–19.',
  ));
  next = patchOrAddMetric(next, 'Mean age of mothers at childbirth', italyMetric(
    '32.7 years',
    '2025 (provisional)',
    'Istat',
    ISTAT_DEMOGRAPHIC_2025_URL,
    '31 March 2026',
    'Mean age at childbirth across all birth orders; up from 32.6 years in 2024.',
  ));
  next = patchOrAddMetric(next, 'Childhood overweight and obesity (Italy)', italyMetric(
    '19.0% overweight; 9.8% obese',
    '2023',
    'Istituto Superiore di Sanità — OKkio alla SALUTE',
    ISS_CHILD_WEIGHT_URL,
    'National survey 2023',
    'Measured national sample of children aged 8–9 using IOTF thresholds. Severe obesity was 2.6%; obesity was 10.3% among boys and 9.4% among girls.',
  ));

  return next;
}

