import type {
  ImmigrantBenefitsData,
  ImmigrantStatusClass,
  ImmigrantStockRow,
} from '../components/GermanyImmigrantBenefitsSection';

/**
 * France — immigrant benefits by residence status.
 *
 * Sourced figures (DGEF/Ministère de l'Intérieur "Les titres de séjour en 2024",
 * OFPRA 2024, INSEE 2024–2025, DREES, CAF):
 *  - 4,331,326 valid third-country residence documents at 31 Dec 2024 (+3.9% y/y),
 *    split family 1.39M · humanitarian 639,324 · economic 450,789 · student 347,817.
 *  - 343,024 first permits issued in 2024; students 110,633 (≈1/3), family >1/4,
 *    economic ≈1/6, humanitarian ≈1/6 (+13.4%).
 *  - OFPRA 2024: ~153,600 applications (129,440 first-time); ~142,000 decisions;
 *    protection rate ≈39%; 70,225 people protected (record). Top origins:
 *    Afghanistan (~12.4k), Ukraine (~11.8k), Guinea, DR Congo, Côte d'Ivoire.
 *  - INSEE 2024: 6.0M foreigners (8.8% of population) — 35% European, 46% African,
 *    13% Asian; 7.3M immigrants (10.7%) plus 8.0M descendants of immigrants.
 *  - Benefit amounts: ADA €6.80/day single (≈€204/mo), +€7.40/day if no accommodation
 *    offered; RSA €646.52/mo single (since 1 Apr 2025); AME 465,744 beneficiaries
 *    (30 Sep 2024), ~€1.2bn budget.
 *
 * Estimated (no clean official series published — flagged in the UI notes):
 *  - EU/EEA free-movement stock (~2.1M) is derived from INSEE's 6.0M foreigners × 35%
 *    European; EU citizens need no permit so are not in the DGEF permit stock.
 *  - Asylum pending stock (~50k) inferred from 2024 applications vs. decisions.
 *  - Exceptional regularisations (~30k/yr) and origin-mix percentages are approximations.
 */

const FRANCE_STATUS_CLASSES: readonly ImmigrantStatusClass[] = [
  {
    index: 1,
    title: 'EU / EEA citizens & free movement',
    stockLabel: '~2.1M',
    stockDetail: 'EU nationals resident (INSEE 2024: 35% of 6.0M foreigners) · no permit required',
    benefits: [
      'Immediate full labour-market access · no permit',
      'RSA (€646.52/mo) immediately if worker; after 5 yrs if inactive',
      'CAF family allowances · APL housing aid · PUMa healthcare',
      'Municipal & European election voting',
      'Naturalisation possible after 5 years',
    ],
    origins: [{ key: 'europe', label: 'Europe (EU/EEA)', value: 100 }],
  },
  {
    index: 2,
    title: 'Asylum seekers (procedure)',
    stockLabel: '~50k',
    stockDetail: 'Pending at OFPRA (est.) · 129,440 first-time applications in 2024',
    benefits: [
      'ADA €6.80/day single (≈€204/mo) · +€7.40/day if unhoused',
      'CADA / HUDA reception housing · PUMa after 3 months',
      'Work only after 6 months if no OFPRA decision',
      'No RSA · children schooled regardless of status',
    ],
    origins: [
      { key: 'africa', label: 'Africa', value: 45 },
      { key: 'asia', label: 'Asia (Afghanistan…)', value: 24 },
      { key: 'europe', label: 'Europe (Ukraine…)', value: 16 },
      { key: 'mena', label: 'Maghreb & Middle East', value: 13 },
      { key: 'other', label: 'Other', value: 2 },
    ],
  },
  {
    index: 3,
    title: 'Refugees & subsidiary protection',
    stockLabel: '~639k',
    stockDetail: 'Valid humanitarian permits (31 Dec 2024) · 70,225 newly protected in 2024',
    benefits: [
      'Full RSA (€646.52/mo single) + APL · CAF benefits',
      'Unrestricted work · full assurance maladie',
      'Refugees: 10-yr carte de résident · subsidiary: 4-yr card',
      'Privileged family reunification (no delay/resource test for refugees)',
      'CIR integration contract · French courses · fast naturalisation',
    ],
    origins: [
      { key: 'africa', label: 'Africa', value: 30 },
      { key: 'asia', label: 'Asia (Afghanistan, Sri Lanka…)', value: 30 },
      { key: 'mena', label: 'Maghreb & Middle East', value: 28 },
      { key: 'europe', label: 'Europe (Russia, Balkans…)', value: 10 },
      { key: 'other', label: 'Other', value: 2 },
    ],
  },
  {
    index: 4,
    title: 'Temporary protection (Ukraine)',
    stockLabel: '~52k',
    stockDetail: 'Ukrainian adults holding APS (end-2025) · children not counted separately',
    benefits: [
      'ADA at asylum-seeker rate · €106.8M budget in 2025',
      'Immediate work authorisation · no asylum claim needed',
      'PUMa healthcare · schooling · housing support',
      '6-month APS, renewable while EU directive active',
    ],
    origins: [
      { key: 'europe', label: 'Europe (Ukraine)', value: 99 },
      { key: 'other', label: 'Other', value: 1 },
    ],
  },
  {
    index: 5,
    title: 'Family migration',
    stockLabel: '~1.39M',
    stockDetail: 'Largest permit stock (31 Dec 2024) · >1 in 4 first permits in 2024 (~88k)',
    benefits: [
      'Rights tied to sponsor · "vie privée et familiale" card allows work',
      'Regroupement familial: sponsor needs 18 mths residence, stable income, housing',
      'Family of French nationals: privileged route',
      'RSA & CAF benefits once resident conditions met',
    ],
    origins: [
      { key: 'mena', label: 'Maghreb & Middle East', value: 48 },
      { key: 'africa', label: 'Sub-Saharan Africa', value: 22 },
      { key: 'asia', label: 'Asia', value: 14 },
      { key: 'europe', label: 'Europe', value: 12 },
      { key: 'other', label: 'Other', value: 4 },
    ],
  },
  {
    index: 6,
    title: 'Economic & skilled workers',
    stockLabel: '~451k',
    stockDetail: 'Valid economic permits (31 Dec 2024) · ≈1/6 of first permits · renewals +8.1%',
    benefits: [
      'Passeport Talent: 4-yr card · family accompanies immediately',
      'Full social insurance & pension accrual',
      'Salarié / travailleur temporaire tied to contract',
      'Carte de résident after 5 yrs · livelihood proof required',
    ],
    origins: [
      { key: 'mena', label: 'Maghreb & Middle East', value: 30 },
      { key: 'asia', label: 'Asia', value: 24 },
      { key: 'africa', label: 'Sub-Saharan Africa', value: 20 },
      { key: 'europe', label: 'Europe (non-EU)', value: 16 },
      { key: 'other', label: 'Other', value: 10 },
    ],
  },
  {
    index: 7,
    title: 'Students & trainees',
    stockLabel: '~348k',
    stockDetail: 'Valid student permits · 110,633 first permits in 2024 (≈1 in 3, the top motive)',
    benefits: [
      'Work up to 964 h/year (60% of legal working time)',
      'Proof of ~€615/mo resources · free student health affiliation',
      'APL housing aid eligible · subsidised CROUS housing/meals',
      '12-month APS to seek work after graduation · no RSA under 25',
    ],
    origins: [
      { key: 'mena', label: 'Maghreb & Middle East', value: 38 },
      { key: 'africa', label: 'Sub-Saharan Africa', value: 30 },
      { key: 'asia', label: 'Asia (China, India…)', value: 22 },
      { key: 'europe', label: 'Europe (non-EU)', value: 6 },
      { key: 'other', label: 'Other', value: 4 },
    ],
  },
  {
    index: 8,
    title: 'Irregular status & regularisation',
    stockLabel: '~466k',
    stockDetail: 'AME beneficiaries (30 Sep 2024) · ~30k/yr exceptional regularisations (est.)',
    benefits: [
      'AME healthcare after 3 mths irregular residence (~€1.2bn/yr)',
      'No RSA · no work rights · no CAF benefits',
      'Regularisation via "métiers en tension" (2024 law): 3 yrs residence + 12 mths work',
      'Children schooled regardless of status · Retailleau circular (2025) tightened criteria',
    ],
    origins: [
      { key: 'africa', label: 'Sub-Saharan Africa', value: 42 },
      { key: 'mena', label: 'Maghreb & Middle East', value: 26 },
      { key: 'asia', label: 'Asia', value: 18 },
      { key: 'europe', label: 'Europe', value: 10 },
      { key: 'other', label: 'Other', value: 4 },
    ],
  },
];

const FRANCE_STOCK_OVERVIEW: readonly ImmigrantStockRow[] = [
  { name: 'EU free movement', value: 2.1, fill: 'hsl(199, 89%, 48%)' },
  { name: 'Family permits', value: 1.39, fill: 'hsl(280, 55%, 58%)' },
  { name: 'Protection holders', value: 0.639, fill: 'hsl(142, 71%, 45%)' },
  { name: 'AME / irregular', value: 0.466, fill: 'hsl(0, 72%, 55%)' },
  { name: 'Economic permits', value: 0.451, fill: 'hsl(258, 55%, 62%)' },
  { name: 'Student permits', value: 0.348, fill: 'hsl(38, 92%, 50%)' },
  { name: 'Ukraine protection', value: 0.052, fill: 'hsl(215, 70%, 55%)' },
  { name: 'Asylum pending (est.)', value: 0.05, fill: 'hsl(215, 14%, 45%)' },
];

export const FRANCE_IMMIGRANT_BENEFITS: ImmigrantBenefitsData = {
  statusClasses: FRANCE_STATUS_CLASSES,
  stockOverview: FRANCE_STOCK_OVERVIEW,
  caption:
    'Eight residence classes · benefits are status-based (not origin-based). 6.0M foreigners (8.8% of population, 2024); 7.3M immigrants plus 8.0M descendants of immigrants.',
  notes: [
    'DGEF / Ministère de l’Intérieur “Les titres de séjour en 2024” (4,331,326 valid third-country permits at 31 Dec 2024; 343,024 first permits) · OFPRA 2024 (153,600 applications, 70,225 protected, ~39% protection rate) · INSEE 2024 · DREES/CAF for ADA, RSA and AME amounts.',
    'France does not collect ethnic statistics; origin shares are illustrative regional approximations. EU citizens need no permit, so their ~2.1M stock is estimated from INSEE’s foreign-population breakdown rather than the permit register. Asylum-pending (~50k) and regularisation (~30k/yr) counts are estimates.',
    'Policy context: the 26 Jan 2024 immigration law created the “métiers en tension” regularisation route; the 23 Jan 2025 Retailleau circular tightened it (regularisations −42% Jan–Sep 2025). Humanitarian classes depend on state support; labour and student routes require proven self-sufficiency.',
  ],
};
