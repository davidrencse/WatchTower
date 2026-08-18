import type { CountryStatMetric } from '../../../types/countryStats';

const SPAIN_STUDENT_AID_URL =
  'https://www.lamoncloa.gob.es/serviciosdeprensa/notasprensa/educacion-fp-deportes/paginas/2026/220726-becas-educacion.aspx';
const SPAIN_FOREIGN_STUDENTS_URL =
  'https://www.educacionfpydeportes.gob.es/prensa/actualidad/2025/06/20250627-datosavance.html';
const SPAIN_CONTINUOUS_POPULATION_URL =
  'https://www.ine.es/dyngs/Prensa/en/ECP2T26.htm';
const SPAIN_STUDY_PERMITS_URL =
  'https://www.inclusion.gob.es/web/opi/estadisticas/catalogo/flujo_estudios';
const INE_POPULATION_STRUCTURE_URL =
  'https://www.ine.es/dynt3/inebase/index.htm?capsel=11532&padre=11555';
const EUROSTAT_MEDIAN_AGE_URL =
  'https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20260213-2';

const SPAIN_FOREIGN_STUDENT_ORIGINS = [
  { country: 'Colombia', count: null, sharePct: 13, shareLabel: '≈12–14%' },
  { country: 'Peru', count: null, sharePct: 8.5, shareLabel: '≈8–9%' },
  { country: 'Morocco', count: null, sharePct: 7.5, shareLabel: '≈7–8%' },
  { country: 'China', count: null, sharePct: 7.5, shareLabel: '≈7–8%' },
  { country: 'United States', count: null, sharePct: 8, shareLabel: '≈7–9%' },
  { country: 'Mexico', count: null, sharePct: 5.5, shareLabel: '≈5–6%' },
  { country: 'Ecuador', count: null, sharePct: 5, shareLabel: '≈5%' },
  { country: 'Venezuela', count: null, sharePct: 3, shareLabel: '≈3%' },
  { country: 'Argentina', count: null, sharePct: 2.5, shareLabel: '≈2–3%' },
  { country: 'Others', count: null, sharePct: 39.5, shareLabel: 'remainder' },
];

const TOTAL_STUDENT_AID_RECIPIENTS = 3_079_706;
const CENTRAL_GOVERNMENT_AID_RECIPIENTS = 1_492_566;
const OTHER_EDUCATION_AUTHORITIES_AID_RECIPIENTS =
  TOTAL_STUDENT_AID_RECIPIENTS - CENTRAL_GOVERNMENT_AID_RECIPIENTS;

const SPAIN_STUDENT_AID_VALUE = JSON.stringify({
  totalAid: TOTAL_STUDENT_AID_RECIPIENTS,
  origins: [
    {
      country: 'Central government (MEC / ministries)',
      aidCount: CENTRAL_GOVERNMENT_AID_RECIPIENTS,
      sharePct: (CENTRAL_GOVERNMENT_AID_RECIPIENTS / TOTAL_STUDENT_AID_RECIPIENTS) * 100,
    },
    {
      country: 'Regional / other education authorities',
      aidCount: OTHER_EDUCATION_AUTHORITIES_AID_RECIPIENTS,
      sharePct: (OTHER_EDUCATION_AUTHORITIES_AID_RECIPIENTS / TOTAL_STUDENT_AID_RECIPIENTS) * 100,
    },
  ],
});

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

/** Spain-specific replacements for Germany-derived demographics slots. */
export function applySpainDemographicsMetricOverrides(
  metrics: CountryStatMetric[],
): CountryStatMetric[] {
  let next = metrics;

  next = patchOrAddMetric(next, 'Immigrants', {
    value: '10,291,807 (20.7%)',
    reference_period: '1 July 2026 (provisional)',
    geography_used: 'Spain',
    source_name: 'INE Continuous Population Statistics',
    source_url: SPAIN_CONTINUOUS_POPULATION_URL,
    source_publication_or_access_date: 'Published 6 August 2026',
    notes:
      'Official foreign-born resident population, regardless of current nationality. This birthplace measure includes naturalized Spanish citizens and is larger than the foreign-national population of 7,437,543.',
  });

  next = patchOrAddMetric(next, 'Foreign students (total)', {
    value: '1,124,767',
    reference_period: 'Academic year 2024/25',
    geography_used: 'Spain',
    source_name: 'Ministry of Education, Vocational Training and Sports',
    source_url: SPAIN_FOREIGN_STUDENTS_URL,
    source_publication_or_access_date: 'Published 27 June 2025',
    notes:
      'Official count of students without Spanish nationality enrolled in non-university General Education and Special-Regime Education. Foreign students represented 12.9% of all students in scope.',
  });

  next = patchOrAddMetric(next, 'Foreign students by origin (pie)', {
    value: JSON.stringify(SPAIN_FOREIGN_STUDENT_ORIGINS),
    reference_period: 'Recent study-permit / international-student data',
    geography_used: 'Spain',
    source_name: 'Permanent Immigration Observatory',
    source_url: SPAIN_STUDY_PERMITS_URL,
    source_publication_or_access_date: 'Recent data; accessed 8 August 2026',
    notes:
      'Approximate leading nationalities among study-permit holders / international students. The chart uses each published range midpoint only to size the slices; labels preserve the supplied ranges. This is a foreign-student profile, not a breakdown of scholarship recipients.',
  });

  next = patchOrAddMetric(next, 'How Many on Student Aid', {
    value: SPAIN_STUDENT_AID_VALUE,
    reference_period: 'Academic year 2024/25',
    geography_used: 'Spain',
    source_name: 'Ministry of Education / Government of Spain',
    source_url: SPAIN_STUDENT_AID_URL,
    source_publication_or_access_date: 'Published 22 July 2026',
    notes:
      '3,079,706 students received a scholarship or study aid across all education levels and administrations. Of these, 1,492,566 received aid financed directly by the central ministries; the remainder represents regional or other education-authority funding.',
  });

  next = patchOrAddMetric(next, 'Military-aged males (migrant background)', {
    value: '≈1.8–2.2 million',
    reference_period: '2024–2025 estimate',
    geography_used: 'Spain',
    source_name: 'INE population structure',
    source_url: INE_POPULATION_STRUCTURE_URL,
    source_publication_or_access_date: '2025 census tables; accessed 8 August 2026',
    notes:
      'Estimated foreign-born / foreign-national males roughly aged 18–45, derived from INE age, sex, nationality and birthplace tables. Spain does not publish a single official “military-aged migrant males” headline count; the range is a proxy, not an exact official measure.',
  });

  next = patchOrAddMetric(next, 'Median age', {
    value: '≈45.8–46.8 years',
    reference_period: '2025 estimate',
    geography_used: 'Spain',
    source_name: 'INE / Eurostat',
    source_url: `${INE_POPULATION_STRUCTURE_URL} | ${EUROSTAT_MEDIAN_AGE_URL}`,
    source_publication_or_access_date: '2025 population data; accessed 8 August 2026',
    notes:
      'Approximate range across recent INE, Eurostat and international estimates. Spain has one of Europe’s older populations, though it remains younger than Germany at roughly 47–48 years.',
  });

  return next;
}
