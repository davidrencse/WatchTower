import type {
  SocialSecurityRow,
  TaxBandRow,
  TaxRateRow,
  VatRateRow,
} from '../../../components/countries/germany/GermanyEconomicTaxesSection';

/**
 * Spain — tax reference data and illustrative employee-payroll model.
 *
 * Primary references:
 * - Agencia Tributaria, 2025 IRPF manual (state scale, personal/family minimums,
 *   deductible employment expenses, savings scale, VAT and company-tax rates).
 * - BOE Order PJC/297/2026 (General Scheme contribution cap and rates, MEI and
 *   additional solidarity contribution for 2026).
 *
 * Spain's IRPF has both a state and an autonomous-community component. The
 * combined bands below mirror the state scale for the regional half to provide
 * a legible nationwide reference; an actual return must use the taxpayer's
 * autonomous-community scale and minimums.
 */

export const SPAIN_SOCIAL_SECURITY_MAX_MONTHLY = 5_101.2;
export const SPAIN_SOCIAL_SECURITY_MAX_ANNUAL = SPAIN_SOCIAL_SECURITY_MAX_MONTHLY * 12;
export const SPAIN_EMPLOYMENT_EXPENSE = 2_000;
export const SPAIN_PERSONAL_MINIMUM = 5_550;

export const SPAIN_REFERENCE_IRPF_BANDS = [
  { upTo: 12_450, rate: 0.19 },
  { upTo: 20_200, rate: 0.24 },
  { upTo: 35_200, rate: 0.3 },
  { upTo: 60_000, rate: 0.37 },
  { upTo: 300_000, rate: 0.45 },
  { upTo: Infinity, rate: 0.47 },
] as const;

export const SPAIN_INCOME_BRACKETS: readonly TaxBandRow[] = [
  { band: '0 – 12,450', rate: '19%' },
  { band: '12,451 – 20,200', rate: '24%' },
  { band: '20,201 – 35,200', rate: '30%' },
  { band: '35,201 – 60,000', rate: '37%' },
  { band: '60,001 – 300,000', rate: '45%' },
  { band: '300,001+', rate: '47%' },
];

export const SPAIN_SOCIAL_SECURITY: readonly SocialSecurityRow[] = [
  { type: 'Common contingencies', employee: '4.70%', employer: '23.60%', total: '28.30%' },
  { type: 'Unemployment (indefinite)', employee: '1.55%', employer: '5.50%', total: '7.05%' },
  { type: 'Vocational training', employee: '0.10%', employer: '0.60%', total: '0.70%' },
  { type: 'FOGASA', employee: '—', employer: '0.20%', total: '0.20%' },
  { type: 'MEI (pension equity)', employee: '0.15%', employer: '0.75%', total: '0.90%' },
  { type: 'Solidarity above €5,101.20/mo', employee: '0.19% – 0.24%', employer: '0.96% – 1.22%', total: '1.15% – 1.46%' },
  { type: 'Typical total, before work-injury rate', employee: '6.50%', employer: '30.65%', total: '37.15%' },
];

export const SPAIN_CORPORATE_TAXES: readonly TaxRateRow[] = [
  { tax: 'Corporate income tax (general)', rate: '25%' },
  { tax: 'Micro-enterprise: first €50,000', rate: '19%' },
  { tax: 'Micro-enterprise: remaining base', rate: '21%' },
  { tax: 'Small entities (art. 101 LIS)', rate: '23%' },
  { tax: 'New companies / qualifying startups', rate: '15%' },
];

export const SPAIN_VAT_RATES: readonly VatRateRow[] = [
  { type: 'Standard (general)', rate: '21%' },
  { type: 'Reduced (food, transport, hospitality)', rate: '10%' },
  { type: 'Super-reduced (staples, books, medicine)', rate: '4%' },
  { type: 'Zero-rated qualifying supplies', rate: '0%' },
];

export const SPAIN_OTHER_TAXES: readonly TaxRateRow[] = [
  { tax: 'Savings income / capital gains', rate: '19% – 30%' },
  { tax: 'Wealth tax (state scale)', rate: '0.2% – 3.5%' },
  { tax: 'General wealth-tax exemption', rate: '€700,000 (regional variation)' },
  { tax: 'Beckham regime: employment income', rate: '24% to €600k; 47% above' },
  { tax: 'Non-resident income tax', rate: '19% EU/EEA; 24% other' },
  { tax: 'Transfer / inheritance / gift taxes', rate: 'Autonomous-community rates' },
];

export type SpainLedgerLine = { label: string; amount: number; detail?: string };

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function progressiveIrpf(base: number): number {
  if (base <= 0) return 0;
  let tax = 0;
  let lower = 0;

  for (const band of SPAIN_REFERENCE_IRPF_BANDS) {
    if (base <= lower) break;
    const slice = Math.min(base, band.upTo) - lower;
    if (slice > 0) tax += slice * band.rate;
    lower = band.upTo;
  }

  return tax;
}

function descendantMinimum(children: number): number {
  const safeChildren = Math.max(0, Math.floor(children));
  const amounts = [2_400, 2_700, 4_000];
  let minimum = 0;

  for (let index = 0; index < safeChildren; index += 1) {
    minimum += amounts[index] ?? 4_500;
  }

  return minimum;
}

function employeeSolidarityContribution(grossAnnual: number): number {
  const tierOneEnd = 5_611.32 * 12;
  const tierTwoEnd = 7_651.8 * 12;
  const tierOne = Math.max(0, Math.min(grossAnnual, tierOneEnd) - SPAIN_SOCIAL_SECURITY_MAX_ANNUAL);
  const tierTwo = Math.max(0, Math.min(grossAnnual, tierTwoEnd) - tierOneEnd);
  const tierThree = Math.max(0, grossAnnual - tierTwoEnd);
  return tierOne * 0.0019 + tierTwo * 0.0021 + tierThree * 0.0024;
}

export type SpainNetIncomeInput = {
  grossAnnual: number;
  children: number;
  contractType: 'indefinite' | 'temporary';
};

/**
 * Illustrative annual employee calculation for the common regime. It assumes
 * salary is earned evenly across 12 months and uses a neutral combined IRPF
 * reference scale; regional bands, low-income reductions and individual
 * deductions can materially change the final assessment.
 */
export function computeSpainNetIncome({
  grossAnnual,
  children,
  contractType,
}: SpainNetIncomeInput): { lines: SpainLedgerLine[] } {
  const gross = Math.max(0, grossAnnual);
  const cappedBase = Math.min(gross, SPAIN_SOCIAL_SECURITY_MAX_ANNUAL);
  const unemploymentRate = contractType === 'temporary' ? 0.016 : 0.0155;

  const common = round2(cappedBase * 0.047);
  const unemployment = round2(cappedBase * unemploymentRate);
  const training = round2(cappedBase * 0.001);
  const mei = round2(cappedBase * 0.0015);
  const solidarity = round2(employeeSolidarityContribution(gross));
  const socialSecurity = round2(common + unemployment + training + mei + solidarity);

  const netWorkIncome = Math.max(0, gross - socialSecurity);
  const taxableBase = Math.max(0, netWorkIncome - SPAIN_EMPLOYMENT_EXPENSE);
  const familyMinimum = SPAIN_PERSONAL_MINIMUM + descendantMinimum(children);
  const grossIrpf = round2(progressiveIrpf(taxableBase));
  const minimumRelief = round2(progressiveIrpf(Math.min(taxableBase, familyMinimum)));
  const irpf = round2(Math.max(0, grossIrpf - minimumRelief));
  const netAnnual = round2(gross - socialSecurity - irpf);
  const asDeduction = (amount: number) => (amount > 0 ? -amount : 0);

  const lines: SpainLedgerLine[] = [
    { label: 'Gross annual salary', amount: gross, detail: 'Input; annualised over 12 months' },
    { label: 'Common contingencies', amount: asDeduction(common), detail: '4.70% employee share, capped base' },
    {
      label: `Unemployment (${contractType})`,
      amount: asDeduction(unemployment),
      detail: `${(unemploymentRate * 100).toFixed(2)}% employee share, capped base`,
    },
    { label: 'Vocational training', amount: asDeduction(training), detail: '0.10% employee share, capped base' },
    { label: 'MEI contribution', amount: asDeduction(mei), detail: '0.15% employee share for 2026' },
    {
      label: 'Solidarity contribution',
      amount: asDeduction(solidarity),
      detail: gross > SPAIN_SOCIAL_SECURITY_MAX_ANNUAL ? 'Progressive 0.19% / 0.21% / 0.24% above the cap' : 'Below the contribution cap',
    },
    { label: 'Total employee Social Security', amount: asDeduction(socialSecurity), detail: 'Sum of employee contributions' },
    {
      label: 'General taxable base (estimate)',
      amount: taxableBase,
      detail: `Gross − Social Security − €${SPAIN_EMPLOYMENT_EXPENSE.toLocaleString('es-ES')} general employment expense`,
    },
    { label: 'IRPF before personal minimum', amount: asDeduction(grossIrpf), detail: 'Combined reference scale' },
    {
      label: 'Personal + descendant minimum relief',
      amount: minimumRelief,
      detail: `€${familyMinimum.toLocaleString('es-ES')} minimum modelled`,
    },
    { label: 'Estimated IRPF', amount: asDeduction(irpf), detail: 'Before regional and individual deductions' },
    { label: 'Estimated net annual', amount: netAnnual, detail: 'Illustration only' },
    { label: 'Estimated net monthly (÷12)', amount: round2(netAnnual / 12), detail: 'Net ÷ 12' },
  ];

  return { lines };
}
