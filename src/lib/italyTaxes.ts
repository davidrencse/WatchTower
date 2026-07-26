import type {
  SocialSecurityRow,
  TaxBandRow,
  TaxRateRow,
  VatRateRow,
} from '../components/GermanyEconomicTaxesSection';

/**
 * Italy — tax reference data and payroll model (2026).
 *
 * Sources: Legge di Bilancio 2026 (L. 199/2025) — IRPEF permanently on three
 * brackets with the middle rate cut 35% → 33%; Agenzia delle Entrate (detrazioni
 * da lavoro dipendente, addizionali, IRES/IRAP, IVA); INPS (aliquote contributive
 * dipendenti); the 2025 taglio del cuneo fiscale made structural for 2026 (a
 * tax-free "somma" up to €20,000 income and a €1,000 further deduction to €40,000).
 */

/** IRPEF 2026 — thresholds on taxable income (reddito complessivo), €. */
export const ITALY_IRPEF_BANDS = [
  { upTo: 28_000, rate: 0.23 },
  { upTo: 50_000, rate: 0.33 },
  { upTo: Infinity, rate: 0.43 },
] as const;

/** INPS employee (FPLD) — 9.19% on the first pension bracket, +1% above it. */
export const ITALY_INPS_EMPLOYEE_RATE = 0.0919;
export const ITALY_INPS_EMPLOYEE_EXTRA_RATE = 0.0119; // total 10.19% above the threshold
export const ITALY_INPS_FIRST_BRACKET = 55_008; // prima fascia di retribuzione pensionabile (2025 level)

export const ITALY_INCOME_BRACKETS: readonly TaxBandRow[] = [
  { band: '0 – 28,000', rate: '23%' },
  { band: '28,001 – 50,000', rate: '33%' },
  { band: '50,001+', rate: '43%' },
];

export const ITALY_SOCIAL_SECURITY: readonly SocialSecurityRow[] = [
  { type: 'IVS pension (FPLD)', employee: '9.19% (+1% over ~€55k)', employer: '23.81%', total: '~33%' },
  { type: 'Unemployment (NASpI)', employee: '—', employer: '1.61%', total: '1.61%' },
  { type: 'Sickness / maternity / CIG / funds', employee: '—', employer: '~3% – 5%', total: '~3% – 5%' },
  { type: 'Typical total (private sector)', employee: '~9.2% – 10.2%', employer: '~29% – 32%', total: '~38% – 42%' },
];

export const ITALY_CORPORATE_TAXES: readonly TaxRateRow[] = [
  { tax: 'IRES (corporate income tax)', rate: '24%' },
  { tax: 'IRES premiale (reinvested profits)', rate: '20%' },
  { tax: 'IRAP (regional production, standard)', rate: '3.9%' },
  { tax: 'IRAP (banks / insurance)', rate: '4.65% – 5.9%' },
];

export const ITALY_VAT_RATES: readonly VatRateRow[] = [
  { type: 'Standard (ordinaria)', rate: '22%' },
  { type: 'Reduced (hotels, restaurants, power)', rate: '10%' },
  { type: 'Reduced (some foods, social services)', rate: '5%' },
  { type: 'Super-reduced (staple foods, books, medical)', rate: '4%' },
];

export const ITALY_OTHER_TAXES: readonly TaxRateRow[] = [
  { tax: 'Capital gains / dividends / interest', rate: '26%' },
  { tax: 'Government bonds (titoli di Stato)', rate: '12.5%' },
  { tax: 'Cedolare secca (residential rent)', rate: '21% (10% canone concordato)' },
  { tax: 'Regime forfettario (self-employed ≤€85k)', rate: '15% (5% first 5 years)' },
  { tax: 'IMU (property, second homes)', rate: '0.46% – 1.06% (municipal)' },
  { tax: 'Imposta di registro (home purchase)', rate: '2% first home / 9% other' },
  { tax: 'Inheritance / gift (successione)', rate: '4% / 6% / 8% by relationship' },
  { tax: 'IRPEF regional + municipal surcharges', rate: '~1.23% – 3.33% + 0% – 0.9%' },
  { tax: 'Bollo on financial assets (IVAFE)', rate: '0.2%' },
  { tax: 'Canone RAI (TV licence)', rate: '€90 / year' },
];

export type ItalyLedgerLine = { label: string; amount: number; detail?: string };

/** Progressive IRPEF on taxable income (reddito complessivo). */
export function italyIrpefGross(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  let tax = 0;
  let lower = 0;
  for (const band of ITALY_IRPEF_BANDS) {
    if (taxableIncome <= lower) break;
    const slice = Math.min(taxableIncome, band.upTo) - lower;
    if (slice > 0) tax += slice * band.rate;
    lower = band.upTo;
  }
  return tax;
}

/** Detrazione per lavoro dipendente 2026 (employment tax credit), by reddito complessivo. */
export function italyEmploymentDeduction(reddito: number): number {
  if (reddito <= 0) return 0;
  if (reddito <= 15_000) return 1955;
  if (reddito <= 28_000) return 1910 + 1190 * ((28_000 - reddito) / 13_000);
  if (reddito <= 50_000) return 1910 * ((50_000 - reddito) / 22_000);
  return 0;
}

/** Ulteriore detrazione — cuneo fiscale tier 2: €1,000 to €32k, phasing to 0 at €40k. */
export function italyFurtherDeduction(reddito: number): number {
  if (reddito <= 20_000) return 0; // tier 1 is a tax-free sum, handled separately
  if (reddito <= 32_000) return 1000;
  if (reddito <= 40_000) return 1000 * ((40_000 - reddito) / 8_000);
  return 0;
}

/** Cuneo fiscale tier 1 — tax-free "somma" for reddito ≤ €20,000, as a % of income. */
export function italyCuneoBonus(reddito: number): number {
  if (reddito <= 0 || reddito > 20_000) return 0;
  const rate = reddito <= 8_500 ? 0.071 : reddito <= 15_000 ? 0.053 : 0.048;
  return reddito * rate;
}

export type ItalyNetIncomeInput = {
  grossAnnual: number;
  /** Combined regional + municipal IRPEF surcharge (addizionali), % of taxable income. */
  addizionaliPct: number;
};

/**
 * Employee payroll + IRPEF projection for Italy. Illustrative: treats reddito
 * complessivo as gross − INPS, omits family detrazioni, the trattamento integrativo
 * interplay, the INPS massimale, and comune-specific addizionale brackets.
 */
export function computeItalyNetIncome({ grossAnnual, addizionaliPct }: ItalyNetIncomeInput): {
  lines: ItalyLedgerLine[];
} {
  const gross = Math.max(0, grossAnnual);
  const round2 = (n: number) => Math.round(n * 100) / 100;

  const inpsBase = Math.min(gross, ITALY_INPS_FIRST_BRACKET);
  const inpsExtraBase = Math.max(0, gross - ITALY_INPS_FIRST_BRACKET);
  const inps = round2(inpsBase * ITALY_INPS_EMPLOYEE_RATE + inpsExtraBase * (ITALY_INPS_EMPLOYEE_RATE + ITALY_INPS_EMPLOYEE_EXTRA_RATE));

  const imponibile = Math.max(0, gross - inps);

  const irpefLorda = round2(italyIrpefGross(imponibile));
  const detrazione = round2(italyEmploymentDeduction(imponibile));
  const ulteriore = round2(italyFurtherDeduction(imponibile));
  const irpefNetta = round2(Math.max(0, irpefLorda - detrazione - ulteriore));

  const addRate = Math.max(0, addizionaliPct || 0) / 100;
  const addizionali = round2(imponibile * addRate);

  const cuneoBonus = round2(italyCuneoBonus(imponibile));

  const totalWithholdings = round2(inps + irpefNetta + addizionali);
  const netAnnual = round2(gross - totalWithholdings + cuneoBonus);

  const lines: ItalyLedgerLine[] = [
    { label: 'Gross annual salary (RAL)', amount: gross, detail: 'Input' },
    {
      label: 'INPS pension contribution',
      amount: -inps,
      detail: `9.19% up to €${ITALY_INPS_FIRST_BRACKET.toLocaleString('it-IT')}, 10.19% above`,
    },
    { label: 'Taxable income (imponibile IRPEF)', amount: imponibile, detail: 'Gross − INPS' },
    { label: 'IRPEF gross (23/33/43%)', amount: -irpefLorda, detail: 'Progressive on three brackets' },
    {
      label: 'Detrazione lavoro dipendente',
      amount: detrazione,
      detail: 'Employment tax credit (max €1,955, 0 above €50k)',
    },
    {
      label: 'Ulteriore detrazione (cuneo)',
      amount: ulteriore,
      detail: ulteriore > 0 ? '€1,000 to €32k, phasing out by €40k' : 'Outside €20k–40k band',
    },
    { label: 'IRPEF net', amount: -irpefNetta, detail: 'Gross IRPEF − credits (floored at 0)' },
    {
      label: 'Addizionali regionale + comunale',
      amount: -addizionali,
      detail: `${(addRate * 100).toFixed(2)}% × taxable income (illustrative)`,
    },
    {
      label: 'Cuneo fiscale bonus (tax-free)',
      amount: cuneoBonus,
      detail: cuneoBonus > 0 ? '7.1% / 5.3% / 4.8% of income ≤ €20k' : 'Income above €20k',
    },
    { label: 'Total withholdings', amount: -totalWithholdings, detail: 'INPS + IRPEF net + addizionali' },
    { label: 'Estimated net annual', amount: netAnnual, detail: 'Illustration only (before 13th/14th)' },
    { label: 'Estimated net monthly (÷12)', amount: round2(netAnnual / 12), detail: 'Net ÷ 12' },
  ];

  return { lines };
}
