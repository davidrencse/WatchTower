import type {
  SocialSecurityRow,
  TaxBandRow,
  TaxRateRow,
  VatRateRow,
} from '../../../components/countries/germany/GermanyEconomicTaxesSection';

/**
 * France — tax reference data and payroll model.
 *
 * Sources: loi de finances 2026 (barème IR revenus 2025, revalorisé +0,9 %),
 * URSSAF / LFSS 2025–2026 contribution rates, economie.gouv.fr (IS, TVA, PFU),
 * service-public.fr (décote, abattement 10 %, quotient familial).
 */

/** Barème IR 2026 (revenus 2025) — thresholds on quotient familial, per part. */
export const FRANCE_IR_BANDS = [
  { upTo: 11_600, rate: 0 },
  { upTo: 29_579, rate: 0.11 },
  { upTo: 84_577, rate: 0.3 },
  { upTo: 181_917, rate: 0.41 },
  { upTo: Infinity, rate: 0.45 },
] as const;

/** Plafond annuel de la sécurité sociale — frozen at €48,060 for 2025 and 2026. */
export const FRANCE_PASS_ANNUAL = 48_060;

/** Abattement forfaitaire 10% for professional expenses (2026 bounds). */
export const FRANCE_ABATTEMENT_RATE = 0.1;
export const FRANCE_ABATTEMENT_MAX = 14_171;
export const FRANCE_ABATTEMENT_MIN = 495;

/** Décote (revenus 2025): applies below these gross-tax ceilings. */
export const FRANCE_DECOTE_SINGLE_CAP = 1_982;
export const FRANCE_DECOTE_SINGLE_BASE = 897;
export const FRANCE_DECOTE_COUPLE_CAP = 3_278;
export const FRANCE_DECOTE_COUPLE_BASE = 1_486;
export const FRANCE_DECOTE_RATE = 0.4525;

/** CSG/CRDS assessed on 98.25% of gross (1.75% déduction forfaitaire pour frais pro). */
export const FRANCE_CSG_BASE_RATE = 0.9825;

export const FRANCE_INCOME_BRACKETS: readonly TaxBandRow[] = [
  { band: '0 – 11,600', rate: '0%' },
  { band: '11,601 – 29,579', rate: '11%' },
  { band: '29,580 – 84,577', rate: '30%' },
  { band: '84,578 – 181,917', rate: '41%' },
  { band: '181,918+', rate: '45%' },
];

export const FRANCE_SOCIAL_SECURITY: readonly SocialSecurityRow[] = [
  { type: 'Vieillesse (capped at PASS)', employee: '6.90%', employer: '8.55%', total: '15.45%' },
  { type: 'Vieillesse (uncapped)', employee: '0.40%', employer: '2.11%', total: '2.51%' },
  { type: 'Agirc-Arrco T1 (+ CEG)', employee: '4.01%', employer: '6.01%', total: '10.02%' },
  { type: 'Agirc-Arrco T2 (+ CEG)', employee: '9.72%', employer: '14.57%', total: '24.29%' },
  { type: 'CSG (9.20%) + CRDS (0.50%)', employee: '9.70%', employer: '—', total: '9.70%' },
  { type: 'Maladie', employee: '—', employer: '13.00%', total: '13.00%' },
  { type: 'Allocations familiales', employee: '—', employer: '5.25%', total: '5.25%' },
  { type: 'Chômage', employee: '—', employer: '4.00%', total: '4.00%' },
  { type: 'Total Employee', employee: '~21–23%', employer: '—', total: '—' },
];

export const FRANCE_CORPORATE_TAXES: readonly TaxRateRow[] = [
  { tax: 'Impôt sur les sociétés (standard)', rate: '25%' },
  { tax: 'Reduced rate (SME, first €42,500)', rate: '15%' },
  { tax: 'CVAE / local production taxes', rate: '0% – 0.19%' },
];

export const FRANCE_VAT_RATES: readonly VatRateRow[] = [
  { type: 'Standard', rate: '20%' },
  { type: 'Intermediate (restaurants, transport)', rate: '10%' },
  { type: 'Reduced (food, books, energy)', rate: '5.5%' },
  { type: 'Super-reduced (press, reimbursed medicine)', rate: '2.1%' },
];

export const FRANCE_OTHER_TAXES: readonly TaxRateRow[] = [
  { tax: 'PFU / flat tax (dividends, interest)', rate: '31.4% (12.8% IR + 18.6% social)' },
  { tax: 'PFU — life insurance, PEL, rental income', rate: '30% (12.8% + 17.2%)' },
  { tax: 'Real-estate capital gains', rate: '19% + 17.2% social' },
  { tax: 'Droits de succession (direct line)', rate: '5% – 45% (€100k abatement/child)' },
  { tax: 'Droits de mutation (property transfer)', rate: '~5.8% – 6.3%' },
  { tax: 'IFI (real-estate wealth, above €1.3M)', rate: '0.5% – 1.5%' },
  { tax: 'CEHR (high-income surtax)', rate: '3% / 4%' },
];

export type FranceLedgerLine = { label: string; amount: number; detail?: string };

/** Progressive barème applied to one part (quotient familial). */
export function franceIncomeTaxPerPart(quotient: number): number {
  if (quotient <= 0) return 0;
  let tax = 0;
  let lower = 0;
  for (const band of FRANCE_IR_BANDS) {
    if (quotient <= lower) break;
    const slice = Math.min(quotient, band.upTo) - lower;
    if (slice > 0) tax += slice * band.rate;
    lower = band.upTo;
  }
  return tax;
}

export type FranceNetIncomeInput = {
  grossAnnual: number;
  /** Parts fiscales (quotient familial): 1 single, 2 couple, +0.5 per child. */
  parts: number;
};

/**
 * Employee payroll + IR projection for France. Illustrative: omits plafonnement
 * du quotient familial, frais réels, PER deductions, and the CSG/CRDS 4-PASS
 * abatement cap.
 */
export function computeFranceNetIncome({ grossAnnual, parts }: FranceNetIncomeInput): {
  lines: FranceLedgerLine[];
} {
  const gross = Math.max(0, grossAnnual);
  const safeParts = Math.max(1, parts || 1);

  const baseT1 = Math.min(gross, FRANCE_PASS_ANNUAL);
  const baseT2 = Math.min(Math.max(gross - FRANCE_PASS_ANNUAL, 0), FRANCE_PASS_ANNUAL * 7);

  const round2 = (n: number) => Math.round(n * 100) / 100;

  const vieillessePlaf = round2(baseT1 * 0.069);
  const vieillesseDeplaf = round2(gross * 0.004);
  // Agirc-Arrco T1 3.15% + CEG 0.86% = 4.01%; T2 8.64% + CEG 1.08% = 9.72%
  const arrcoT1 = round2(baseT1 * 0.0401);
  const arrcoT2 = round2(baseT2 * 0.0972);

  const csgBase = gross * FRANCE_CSG_BASE_RATE;
  const csgDeductible = round2(csgBase * 0.068);
  const csgNonDeductible = round2(csgBase * 0.024);
  const crds = round2(csgBase * 0.005);

  const deductibleContribs = vieillessePlaf + vieillesseDeplaf + arrcoT1 + arrcoT2;
  const totalContribs = deductibleContribs + csgDeductible + csgNonDeductible + crds;
  const netVerse = round2(gross - totalContribs);

  // Net imposable excludes only deductible contributions and déductible CSG.
  const netImposableAvantAbattement = Math.max(0, gross - deductibleContribs - csgDeductible);
  const abattement = Math.min(
    Math.max(netImposableAvantAbattement * FRANCE_ABATTEMENT_RATE, FRANCE_ABATTEMENT_MIN),
    FRANCE_ABATTEMENT_MAX,
  );
  const revenuImposable = Math.max(0, netImposableAvantAbattement - abattement);

  const quotient = revenuImposable / safeParts;
  const impotBrut = round2(franceIncomeTaxPerPart(quotient) * safeParts);

  const isCouple = safeParts >= 2;
  const decoteCap = isCouple ? FRANCE_DECOTE_COUPLE_CAP : FRANCE_DECOTE_SINGLE_CAP;
  const decoteBase = isCouple ? FRANCE_DECOTE_COUPLE_BASE : FRANCE_DECOTE_SINGLE_BASE;
  const decote =
    impotBrut > 0 && impotBrut < decoteCap
      ? round2(Math.min(impotBrut, Math.max(0, decoteBase - FRANCE_DECOTE_RATE * impotBrut)))
      : 0;
  const impotNet = round2(Math.max(0, impotBrut - decote));

  const netApresImpot = round2(netVerse - impotNet);

  const lines: FranceLedgerLine[] = [
    { label: 'Gross annual salary', amount: gross, detail: 'Input' },
    {
      label: 'Vieillesse capped (employee)',
      amount: -vieillessePlaf,
      detail: `6.90% × min(gross, PASS €${FRANCE_PASS_ANNUAL.toLocaleString('fr-FR')})`,
    },
    { label: 'Vieillesse uncapped (employee)', amount: -vieillesseDeplaf, detail: '0.40% × gross' },
    { label: 'Agirc-Arrco T1 + CEG', amount: -arrcoT1, detail: '4.01% × bracket 1 (up to PASS)' },
    { label: 'Agirc-Arrco T2 + CEG', amount: -arrcoT2, detail: '9.72% × bracket 2 (1–8 PASS)' },
    { label: 'CSG déductible', amount: -csgDeductible, detail: '6.80% × 98.25% of gross' },
    { label: 'CSG non déductible', amount: -csgNonDeductible, detail: '2.40% × 98.25% of gross' },
    { label: 'CRDS', amount: -crds, detail: '0.50% × 98.25% of gross' },
    { label: 'Total employee contributions', amount: -totalContribs, detail: 'Sum of above' },
    { label: 'Net versé (before income tax)', amount: netVerse, detail: 'Gross − contributions' },
    {
      label: 'Abattement 10% frais pro',
      amount: -abattement,
      detail: `10% capped €${FRANCE_ABATTEMENT_MAX.toLocaleString('fr-FR')}, floor €${FRANCE_ABATTEMENT_MIN}`,
    },
    {
      label: 'Revenu net imposable',
      amount: revenuImposable,
      detail: 'Gross − deductible contributions − CSG déductible − abattement',
    },
    {
      label: 'Quotient familial',
      amount: round2(quotient),
      detail: `Revenu imposable ÷ ${safeParts} part(s)`,
    },
    { label: 'Impôt brut (barème 2026)', amount: -impotBrut, detail: 'Barème per part × parts' },
    {
      label: 'Décote',
      amount: decote,
      detail: decote > 0 ? `${decoteBase} − 45.25% × impôt brut` : 'Above décote ceiling',
    },
    { label: 'Impôt net sur le revenu', amount: -impotNet, detail: 'Impôt brut − décote' },
    { label: 'Estimated net annual (after IR)', amount: netApresImpot, detail: 'Illustration only' },
    {
      label: 'Estimated net monthly (after IR)',
      amount: round2(netApresImpot / 12),
      detail: 'Net ÷ 12',
    },
  ];

  return { lines };
}
