import type { CountryStatMetric } from '../../../types/countryStats';

export type EconomicStructuralIndicator = {
  id: string;
  title: string;
  valueMain: string;
  valueSub: string;
  details: string;
  source: string;
};

/** Secondary economy tiles below the six lead metrics (France). */
export const FRANCE_ECONOMIC_STRUCTURAL_INDICATORS: readonly EconomicStructuralIndicator[] = [
  {
    id: 'public-debt-gdp',
    title: 'Public debt (% of GDP)',
    valueMain: '115.6%',
    valueSub: '(end 2025)',
    details:
      'General government debt remains among the highest in the euro area; consolidation and interest costs weigh on fiscal room.',
    source: 'End of 2025.',
  },
  {
    id: 'budget-deficit',
    title: 'Government budget deficit',
    valueMain: '5.1%',
    valueSub: 'of GDP (2025)',
    details:
      'Deficit above the EU reference level, reflecting spending pressures, energy support, and weaker growth.',
    source: 'European Commission (2025).',
  },
  {
    id: 'productivity',
    title: 'Labour productivity',
    valueMain: '+0.44%',
    valueSub: '(2024)',
    details:
      'Latest France-specific annual labour-productivity figure.',
    source: 'France-specific annual figure (2024).',
  },
  {
    id: 'youth-unemployment',
    title: 'Youth unemployment (15-24)',
    valueMain: '21.1%',
    valueSub: '(Q1 2026)',
    details:
      'Unemployment rate among people aged 15 to 24.',
    source: 'Q1 2026.',
  },
  {
    id: 'current-account',
    title: 'Current-account balance',
    valueMain: '≈−0.4%',
    valueSub: 'of GDP (2026 projection)',
    details:
      'Projected current-account deficit as a share of gross domestic product.',
    source: '2026 projection.',
  },
  {
    id: 'public-debt-total',
    title: 'Total public debt (absolute)',
    valueMain: '€3.536T',
    valueSub: '(Q1 2026)',
    details: 'General government gross debt stock (federal and social-security components per national accounts).',
    source: 'Q1 2026.',
  },
  {
    id: 'oil-dependency',
    title: 'Oil dependency',
    valueMain: '≈98%',
    valueSub: 'imported',
    details:
      'France produces about 0.8 Mt domestically versus roughly 46.5 Mt imported.',
    source: 'Official energy reports.',
  },
  {
    id: 'gold-reserves',
    title: 'Gold reserves',
    valueMain: '2,436.8',
    valueSub: 'tonnes (2026)',
    details: 'Among the largest official gold holdings globally; held as a reserve asset by the Banque de France.',
    source: 'Official holdings.',
  },
  {
    id: 'credit-rating',
    title: 'Credit rating',
    valueMain: 'A+ stable',
    valueSub: 'S&P (May 2026) · Fitch (March 2026)',
    details:
      'Moody’s: Aa3 negative (April 2026).',
    source: 'S&P / Fitch / Moody’s (2026).',
  },
];

export const FRANCE_ECONOMIC_STRUCTURAL_GROUP_COUNT = FRANCE_ECONOMIC_STRUCTURAL_INDICATORS.length;

function patchMetric(
  metrics: CountryStatMetric[],
  metric: string,
  patch: Partial<CountryStatMetric>,
): CountryStatMetric[] {
  const idx = metrics.findIndex((m) => m.metric === metric);
  const base: CountryStatMetric =
    idx >= 0
      ? { ...metrics[idx]! }
      : {
          metric,
          value: 'N/A',
          reference_period: '',
          geography_used: 'France',
          source_name: '',
          source_url: '',
          source_publication_or_access_date: '',
          notes: '',
        };
  const updated = { ...base, ...patch };
  if (idx >= 0) {
    const out = [...metrics];
    out[idx] = updated;
    return out;
  }
  return [...metrics, updated];
}

/** Lead Economy tiles for France (GDP, macro indicators). */
export function applyFranceEconomyMetricOverrides(metrics: CountryStatMetric[]): CountryStatMetric[] {
  let m = metrics;
  m = patchMetric(m, 'GDP', {
    value: '$3.6 trillion',
    reference_period: 'IMF 2026 estimate',
    source_name: 'IMF',
    source_url: '',
    source_publication_or_access_date: '2026',
    notes: 'IMF 2026 estimate.',
  });
  m = patchMetric(m, 'GDP per capita', {
    value: '$52,080',
    reference_period: 'IMF 2026 estimate',
    source_name: 'IMF',
    source_url: '',
    source_publication_or_access_date: '2026',
    notes: 'IMF 2026 estimate.',
  });
  m = patchMetric(m, 'Inflation', {
    value: '1.8%',
    reference_period: 'June 2026',
    source_name: 'INSEE',
    source_url: '',
    source_publication_or_access_date: 'June 2026',
    notes: 'June 2026, year-on-year CPI.',
  });
  m = patchMetric(m, 'Unemployment', {
    value: '8.1%',
    reference_period: 'Q1 2026',
    source_name: 'INSEE',
    source_url: '',
    source_publication_or_access_date: 'Q1 2026',
    notes: 'INSEE (Q1 2026).',
  });
  m = patchMetric(m, 'Interest', {
    value: '2.40%',
    reference_period: 'Effective June 17, 2026',
    source_name: 'European Central Bank',
    source_url: '',
    source_publication_or_access_date: 'June 17, 2026',
    notes: 'ECB main refinancing rate.',
  });
  m = patchMetric(m, 'Real Median Wage', {
    value: '€2,180 net/month',
    reference_period: '2023',
    source_name: 'INSEE',
    source_url: '',
    source_publication_or_access_date: '2023',
    notes: 'Private-sector median; latest directly published figure.',
  });
  return m;
}

/**
 * Demographics tiles for France. Germany's builder only adds median age and the
 * military-aged-males proxy for ISO3 === 'DEU', so France (which shares Germany's
 * dashboard layout) is missing them and would otherwise show German figures.
 */
export function applyFranceDemographicsMetricOverrides(metrics: CountryStatMetric[]): CountryStatMetric[] {
  let m = metrics;
  m = patchMetric(m, 'Total birth rate', {
    value: '1.56 (TFR)',
    reference_period: '2025 (provisional)',
    geography_used: 'France',
    source_name: 'INSEE',
    source_url: 'https://www.insee.fr/fr/statistiques/8719824',
    source_publication_or_access_date: 'January 2026',
    notes: 'Official period total fertility rate: 1.56 children per woman in 2025.',
  });
  m = patchMetric(m, 'France-born birth rate', {
    value: '1.7 (TFR)',
    reference_period: '2021',
    geography_used: 'France',
    source_name: 'INSEE',
    source_url: 'https://www.insee.fr/fr/statistiques/6793238?sommaire=6793391',
    source_publication_or_access_date: '2023 edition',
    notes: 'Official TFR for women born in France; this is a birthplace measure.',
  });
  m = patchMetric(m, 'Immigrant birth rate', {
    value: '2.3 (TFR)',
    reference_period: '2021',
    geography_used: 'France',
    source_name: 'INSEE',
    source_url: 'https://www.insee.fr/fr/statistiques/6793238?sommaire=6793391',
    source_publication_or_access_date: '2023 edition',
    notes: 'Official corrected TFR for women born abroad; INSEE adjusts for lower fertility before arrival in France.',
  });
  m = patchMetric(m, 'Migrant background M:F ratio', {
    value: '0.943',
    reference_period: '2020',
    geography_used: 'France',
    source_name: 'INSEE',
    source_url: 'https://www.insee.fr/fr/statistiques/6047719',
    source_publication_or_access_date: 'March 2022',
    notes: 'Male:female ratio for immigrants plus second-generation descendants. Derived from INSEE totals of 6.83 million immigrants (52% women) and 7.62 million descendants of immigrants (51% women); source shares are rounded.',
  });
  m = patchMetric(m, 'Median age', {
    value: '42.1 years',
    reference_period: '2024',
    geography_used: 'France',
    source_name: 'INSEE',
    source_url: '',
    source_publication_or_access_date: '2024',
    notes:
      'INSEE / Eurostat, 2024 (median age 42.07). Younger than Germany (~46), Italy (~48) or Spain (~46), reflecting France’s comparatively high fertility.',
  });
  m = patchMetric(m, 'Military-aged males (migrant background)', {
    value: '~3,200,000',
    reference_period: '2024 (modeled)',
    geography_used: 'France',
    source_name: 'Modeled estimate (INSEE base)',
    source_url: '',
    source_publication_or_access_date: '2024',
    notes:
      'Modeled estimate: ~15.3M with a migrant background (7.3M immigrants + 8.0M descendants of immigrants, INSEE 2024); ≈48.5% male ≈ 7.4M; of whom ≈43% are aged 18–45 → ≈3.2M. No official French line item for this measure (France does not collect ethnic statistics); computed for cross-country comparability.',
  });
  return m;
}

/** France international-student origin mix (Campus France 2024/25 ranking; counts modeled to shares). */
const FRANCE_FOREIGN_STUDENT_ORIGINS = [
  { country: 'Morocco', count: 44000, sharePct: 9.92 },
  { country: 'Algeria', count: 31500, sharePct: 7.1 },
  { country: 'China', count: 27500, sharePct: 6.2 },
  { country: 'Italy', count: 19000, sharePct: 4.28 },
  { country: 'Senegal', count: 16000, sharePct: 3.61 },
  { country: 'Tunisia', count: 15000, sharePct: 3.38 },
] as const;

/** France foreign students on state scholarships (bourses du gouvernement français), modeled origin split. */
const FRANCE_STUDENT_AID_PAYLOAD = {
  totalAid: 20000,
  origins: [
    { country: 'Morocco', aidCount: 2600, sharePct: 13 },
    { country: 'Algeria', aidCount: 1900, sharePct: 9.5 },
    { country: 'China', aidCount: 1500, sharePct: 7.5 },
    { country: 'Tunisia', aidCount: 1200, sharePct: 6 },
    { country: 'Senegal', aidCount: 1100, sharePct: 5.5 },
    { country: 'Vietnam', aidCount: 800, sharePct: 4 },
  ],
};

/**
 * Immigration leading tiles for France (Immigrants + foreign students). France shares Germany's
 * dashboard, so these metrics arrive with German data (foreign students from Germany's CSV);
 * patch them to France's figures. Refugees / Work Visas / Migrant Background tiles live inside
 * GermanyImmigrationSection and are overridden there via props.
 */
export function applyFranceImmigrationMetricOverrides(metrics: CountryStatMetric[]): CountryStatMetric[] {
  let m = metrics;
  m = patchMetric(m, 'Immigrants', {
    value: '7,300,000',
    reference_period: '2024',
    geography_used: 'France',
    source_name: 'INSEE',
    source_url: '',
    source_publication_or_access_date: '2024',
    notes: 'INSEE 2024: 7.3 million immigrés (foreign-born), 10.7% of the population; 2.5M have since acquired French nationality.',
  });
  m = patchMetric(m, 'Foreign students (total)', {
    value: '443,500',
    reference_period: '2024/25',
    geography_used: 'France',
    source_name: 'Campus France',
    source_url: '',
    source_publication_or_access_date: '2024/25',
    notes: 'Campus France, 2024/25: 443,500 international students (+3% y/y). Top origins: Morocco, Algeria, China, Italy, Senegal, Tunisia.',
  });
  m = patchMetric(m, 'Foreign students by origin (pie)', {
    value: JSON.stringify(FRANCE_FOREIGN_STUDENT_ORIGINS),
    reference_period: '2024/25',
    geography_used: 'France',
    source_name: 'Campus France',
    source_url: '',
    source_publication_or_access_date: '2024/25',
    notes: 'Campus France 2024/25 top-6 origins; per-country counts modeled from published shares (Morocco ≈10%).',
  });
  m = patchMetric(m, 'How Many on Student Aid', {
    value: JSON.stringify(FRANCE_STUDENT_AID_PAYLOAD),
    reference_period: '2024/25 (est.)',
    geography_used: 'France',
    source_name: 'Campus France / MEAE (modeled)',
    source_url: '',
    source_publication_or_access_date: '2024/25',
    notes: 'Modeled estimate: ~20,000 foreign students on French government scholarships (bourses du gouvernement français / Eiffel). Origin split approximated from overall student mix.',
  });
  return m;
}
