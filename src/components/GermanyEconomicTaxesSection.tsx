import { memo, useMemo, useState, type ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { cn } from '../lib/utils';

const UC = 'uppercase tracking-[0.05em]';

/** Collapsible subsection badge count (logical blocks). */
export const GERMANY_ECONOMIC_TAXES_GROUP_COUNT = 7;

const INCOME_BRACKETS = [
  { band: '0 – 12,348', rate: '0%' },
  { band: '12,349 – 69,878', rate: '14% – 42%' },
  { band: '69,879 – 277,825', rate: '42%' },
  { band: '277,826+', rate: '45%' },
] as const;

const SOCIAL_SECURITY = [
  { type: 'Pension', employee: '9.3%', employer: '9.3%', total: '18.6%' },
  { type: 'Health', employee: '7.3% + extra', employer: '7.3% + extra', total: '~14.6%+' },
  { type: 'Unemployment', employee: '1.3%', employer: '1.3%', total: '2.6%' },
  { type: 'Long-term Care', employee: '1.7% (+0.6% childless)', employer: '1.7%', total: '3.4%+' },
  { type: 'Total Employee', employee: '20–21.5%', employer: '—', total: '—' },
] as const;

const CORPORATE_TAXES = [
  { tax: 'Corporate Income Tax', rate: '15.825%' },
  { tax: 'Trade Tax', rate: '7% – 20%' },
  { tax: 'Effective Total Rate', rate: '29% – 33%' },
] as const;

const VAT_RATES = [
  { type: 'Standard', rate: '19%' },
  { type: 'Reduced', rate: '7%' },
] as const;

const OTHER_TAXES = [
  { tax: 'Capital Gains / Dividends', rate: '26.375%' },
  { tax: 'Real Estate Transfer Tax', rate: '3.5% – 6.5%' },
  { tax: 'Inheritance / Gift Tax', rate: '7% – 50%' },
  { tax: 'Church Tax', rate: '8% or 9% of income tax' },
  { tax: 'Solidarity Surcharge', rate: '5.5% of income tax' },
] as const;

/** Western Germany typical annual ceilings (approximate; illustrative). */
const CEILING_RV_AV_ANNUAL = 90_600;
const CEILING_KV_PV_ANNUAL = 62_100;

/** Arbeitnehmer-Pauschbetrag illustration (approx.). */
const EMPLOYEE_FLAT_DEDUCTION = 1230;

/** Solidarity surcharge exemption threshold on income tax only (illustrative simplification). */
const SOLI_INCOME_TAX_EXEMPT_CAP = 972;

function marginalIncomeTaxRate(z: number): number {
  const z1 = 12348;
  const z2 = 69878;
  const z3 = 277825;
  if (z <= z1) return 0;
  if (z <= z2) {
    const span = z2 - z1;
    return 0.14 + ((0.42 - 0.14) * (z - z1)) / span;
  }
  if (z <= z3) return 0.42;
  return 0.45;
}

/** Progressive income tax via marginal slices (approximation for illustration). */
function computeIncomeTaxAnnual(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  const step = 50;
  let tax = 0;
  for (let z = 0; z < taxableIncome; z += step) {
    const slice = Math.min(step, taxableIncome - z);
    const mid = z + slice / 2;
    tax += slice * marginalIncomeTaxRate(mid);
  }
  return Math.round(tax * 100) / 100;
}

type LedgerLine = { label: string; amount: number; detail?: string };

function TaxReferenceTable({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn('overflow-hidden border-line bg-surface-metric', className)}>
      <CardHeader className="space-y-1 p-3 pb-2">
        <CardTitle className={cn('font-sans text-xs font-semibold text-neutral-100', UC)}>{title}</CardTitle>
        {description ? (
          <CardDescription className="font-sans text-[10px] leading-snug text-neutral-500">{description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="p-0 px-3 pb-3 pt-0">{children}</CardContent>
    </Card>
  );
}

function GermanyNetIncomeCalculator() {
  const [grossAnnualStr, setGrossAnnualStr] = useState('55000');
  const [healthExtraPctStr, setHealthExtraPctStr] = useState('1.1');
  const [churchMember, setChurchMember] = useState(false);
  const [churchRateHigh, setChurchRateHigh] = useState(false);
  const [childlessOver25, setChildlessOver25] = useState(false);

  const ledger = useMemo(() => {
    const gross = Math.max(0, Number(String(grossAnnualStr).replace(/,/g, '')) || 0);
    const healthExtra = Math.max(0, Number(healthExtraPctStr) || 0) / 100;

    const baseRv = Math.min(gross, CEILING_RV_AV_ANNUAL);
    const baseKv = Math.min(gross, CEILING_KV_PV_ANNUAL);

    const pensionEmp = Math.round(baseRv * 0.093 * 100) / 100;
    const unemploymentEmp = Math.round(baseRv * 0.013 * 100) / 100;
    const healthEmp = Math.round(baseKv * (0.073 + healthExtra) * 100) / 100;
    const careRate = childlessOver25 ? 0.023 : 0.017;
    const careEmp = Math.round(baseKv * careRate * 100) / 100;

    const totalSSC = pensionEmp + unemploymentEmp + healthEmp + careEmp;

    const taxableBeforeFlat = Math.max(0, gross - totalSSC);
    const taxableIncome = Math.max(0, taxableBeforeFlat - EMPLOYEE_FLAT_DEDUCTION);

    const incomeTax = computeIncomeTaxAnnual(taxableIncome);
    const soli = incomeTax > SOLI_INCOME_TAX_EXEMPT_CAP ? Math.round(incomeTax * 0.055 * 100) / 100 : 0;
    const churchRate = churchMember ? (churchRateHigh ? 0.09 : 0.08) : 0;
    const churchTax = churchMember ? Math.round(incomeTax * churchRate * 100) / 100 : 0;

    const totalDeductions = totalSSC + incomeTax + soli + churchTax;
    const netAnnual = Math.round((gross - totalDeductions) * 100) / 100;

    const lines: LedgerLine[] = [
      { label: 'Gross annual salary', amount: gross, detail: 'Input' },
      { label: 'Pension (employee)', amount: -pensionEmp, detail: `9.3% × min(gross, ${CEILING_RV_AV_ANNUAL.toLocaleString('de-DE')} €)` },
      { label: 'Unemployment (employee)', amount: -unemploymentEmp, detail: `1.3% × same ceiling as pension` },
      {
        label: 'Health (employee)',
        amount: -healthEmp,
        detail: `(7.3% + ${(healthExtra * 100).toFixed(2)}%) × min(gross, ${CEILING_KV_PV_ANNUAL.toLocaleString('de-DE')} €)`,
      },
      {
        label: 'Long-term care (employee)',
        amount: -careEmp,
        detail: childlessOver25 ? '2.3% (incl. childless surcharge)' : '1.7%',
      },
      { label: 'Total social security (employee)', amount: -totalSSC, detail: 'Sum of above' },
      {
        label: 'Approx. taxable income (for ESt)',
        amount: taxableIncome,
        detail: `After employee SSC and illustrative Arbeitnehmer-Pauschbetrag (€${EMPLOYEE_FLAT_DEDUCTION.toLocaleString('de-DE')})`,
      },
      { label: 'Income tax (approx.)', amount: -incomeTax, detail: 'Progressive marginal model matching bracket bands' },
      {
        label: 'Solidarity surcharge',
        amount: -soli,
        detail: incomeTax > SOLI_INCOME_TAX_EXEMPT_CAP ? '5.5% of income tax (above simplified exemption)' : 'Below exemption threshold',
      },
      {
        label: 'Church tax',
        amount: -churchTax,
        detail: churchMember ? `${churchRateHigh ? '9%' : '8%'} of income tax` : 'Not member',
      },
      { label: 'Total withholdings', amount: -totalDeductions, detail: 'SSC + income tax + SolZ + church' },
      { label: 'Estimated net annual', amount: netAnnual, detail: 'Illustration only' },
      { label: 'Estimated net monthly', amount: Math.round((netAnnual / 12) * 100) / 100, detail: 'Net ÷ 12' },
    ];

    return { lines };
  }, [grossAnnualStr, healthExtraPctStr, churchMember, churchRateHigh, childlessOver25]);

  return (
    <Card className="overflow-hidden border-line bg-surface-metric">
      <CardHeader className="space-y-1 p-3 pb-2">
        <CardTitle className={cn('font-sans text-xs font-semibold text-neutral-100', UC)}>
          Net income calculator (illustration)
        </CardTitle>
        <CardDescription className="font-sans text-[10px] leading-snug text-neutral-500">
          Approximate employee payroll projection for Germany (2026-style brackets). Not tax advice; rounding,
          ceilings, KV extras, and deductions differ by insurer and federal state.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-3 pt-0">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1 font-sans text-[11px] text-neutral-400">
            Gross annual (€)
            <input
              type="text"
              inputMode="decimal"
              value={grossAnnualStr}
              onChange={(e) => setGrossAnnualStr(e.target.value)}
              className="rounded-md border border-white/[0.08] bg-black/30 px-2 py-1.5 font-sans text-sm tabular-nums text-neutral-100 outline-none ring-[var(--uk-accent)]/40 focus:ring-2"
              aria-label="Gross annual salary in euros"
            />
          </label>
          <label className="flex flex-col gap-1 font-sans text-[11px] text-neutral-400">
            Health extra (employee %) — Zusatzbeitrag-style
            <input
              type="text"
              inputMode="decimal"
              value={healthExtraPctStr}
              onChange={(e) => setHealthExtraPctStr(e.target.value)}
              className="rounded-md border border-white/[0.08] bg-black/30 px-2 py-1.5 font-sans text-sm tabular-nums text-neutral-100 outline-none ring-[var(--uk-accent)]/40 focus:ring-2"
              aria-label="Additional employee health insurance percentage"
            />
          </label>
          <label className="flex items-center gap-2 pt-6 font-sans text-[11px] text-neutral-300">
            <input
              type="checkbox"
              checked={churchMember}
              onChange={(e) => setChurchMember(e.target.checked)}
              className="rounded border-neutral-600"
            />
            Church member (church tax)
          </label>
          <label className={cn('flex items-center gap-2 pt-6 font-sans text-[11px] text-neutral-300', !churchMember && 'opacity-40')}>
            <input
              type="checkbox"
              checked={churchRateHigh}
              onChange={(e) => setChurchRateHigh(e.target.checked)}
              disabled={!churchMember}
              className="rounded border-neutral-600"
            />
            9% rate (e.g. BY / BW); else 8%
          </label>
          <label className="flex items-center gap-2 font-sans text-[11px] text-neutral-300 sm:col-span-2">
            <input
              type="checkbox"
              checked={childlessOver25}
              onChange={(e) => setChildlessOver25(e.target.checked)}
              className="rounded border-neutral-600"
            />
            Childless 23+ (long-term care surcharge illustration)
          </label>
        </div>

        <div className="overflow-hidden rounded-md border border-white/[0.06]">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.06] hover:bg-transparent">
                <TableHead className="h-9 text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
                  Ledger line
                </TableHead>
                <TableHead className="h-9 text-right text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
                  Amount (€)
                </TableHead>
                <TableHead className="hidden text-[10px] font-semibold uppercase tracking-wide text-neutral-400 md:table-cell">
                  Detail
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ledger.lines.map((line) => {
                const isTaxableInfo = line.label.includes('taxable income');
                const cls = isTaxableInfo
                  ? 'py-2 text-right font-mono text-[12px] tabular-nums text-neutral-200'
                  : cn(
                      'py-2 text-right font-mono text-[12px] tabular-nums',
                      line.amount > 0 ? 'text-emerald-400/90' : line.amount < 0 ? 'text-rose-400/90' : 'text-neutral-400',
                    );
                return (
                  <TableRow key={line.label}>
                    <TableCell className="py-2 font-sans text-[12px] text-neutral-200">{line.label}</TableCell>
                    <TableCell className={cls}>
                      {line.amount.toLocaleString('de-DE', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="hidden py-2 font-sans text-[11px] text-neutral-500 md:table-cell">
                      {line.detail ?? '—'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <p className="font-sans text-[10px] leading-relaxed text-neutral-600">
          Ceiling illustration: pension & unemployment on first €{CEILING_RV_AV_ANNUAL.toLocaleString('de-DE')}; health &
          care on first €{CEILING_KV_PV_ANNUAL.toLocaleString('de-DE')}. Income tax uses a smoothed marginal curve between
          14% and 42% in the middle band to approximate progression (not official §32a coefficients).
        </p>
      </CardContent>
    </Card>
  );
}

export const GermanyEconomicTaxesSection = memo(function GermanyEconomicTaxesSection() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <TaxReferenceTable title="Income Tax Brackets 2026 (Single)" description="Taxable income (€).">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.06] hover:bg-transparent">
                <TableHead className="h-9 text-[10px] uppercase text-neutral-400">Taxable Income (€)</TableHead>
                <TableHead className="h-9 text-right text-[10px] uppercase text-neutral-400">Tax Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {INCOME_BRACKETS.map((row) => (
                <TableRow key={row.band}>
                  <TableCell className="py-2 font-sans text-[12px] text-neutral-200">{row.band}</TableCell>
                  <TableCell className="py-2 text-right font-sans text-[12px] tabular-nums text-white">{row.rate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TaxReferenceTable>

        <TaxReferenceTable title="Social Security Contributions 2026" description="Employee / employer shares (illustrative).">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.06] hover:bg-transparent">
                <TableHead className="h-9 text-[10px] uppercase text-neutral-400">Type</TableHead>
                <TableHead className="h-9 text-[10px] uppercase text-neutral-400">Employee %</TableHead>
                <TableHead className="h-9 text-[10px] uppercase text-neutral-400">Employer %</TableHead>
                <TableHead className="h-9 text-[10px] uppercase text-neutral-400">Total %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SOCIAL_SECURITY.map((row) => (
                <TableRow key={row.type}>
                  <TableCell className="py-2 font-sans text-[12px] text-neutral-200">{row.type}</TableCell>
                  <TableCell className="py-2 font-sans text-[11px] text-neutral-300">{row.employee}</TableCell>
                  <TableCell className="py-2 font-sans text-[11px] text-neutral-300">{row.employer}</TableCell>
                  <TableCell className="py-2 font-sans text-[11px] tabular-nums text-neutral-200">{row.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TaxReferenceTable>

        <TaxReferenceTable title="Corporate Taxes" description="Headline rates (overview).">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.06] hover:bg-transparent">
                <TableHead className="h-9 text-[10px] uppercase text-neutral-400">Tax</TableHead>
                <TableHead className="h-9 text-right text-[10px] uppercase text-neutral-400">Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CORPORATE_TAXES.map((row) => (
                <TableRow key={row.tax}>
                  <TableCell className="py-2 font-sans text-[12px] text-neutral-200">{row.tax}</TableCell>
                  <TableCell className="py-2 text-right font-sans text-[12px] tabular-nums text-white">{row.rate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TaxReferenceTable>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <TaxReferenceTable title="VAT" description="Value-added tax rates.">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.06] hover:bg-transparent">
                <TableHead className="h-9 text-[10px] uppercase text-neutral-400">Type</TableHead>
                <TableHead className="h-9 text-right text-[10px] uppercase text-neutral-400">Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {VAT_RATES.map((row) => (
                <TableRow key={row.type}>
                  <TableCell className="py-2 font-sans text-[12px] text-neutral-200">{row.type}</TableCell>
                  <TableCell className="py-2 text-right font-sans text-[12px] tabular-nums text-white">{row.rate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TaxReferenceTable>

        <TaxReferenceTable title="Other Important Taxes" description="Selected personal and transaction taxes.">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.06] hover:bg-transparent">
                <TableHead className="h-9 text-[10px] uppercase text-neutral-400">Tax</TableHead>
                <TableHead className="h-9 text-right text-[10px] uppercase text-neutral-400">Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {OTHER_TAXES.map((row) => (
                <TableRow key={row.tax}>
                  <TableCell className="py-2 font-sans text-[12px] text-neutral-200">{row.tax}</TableCell>
                  <TableCell className="py-2 text-right font-sans text-[11px] text-neutral-100">{row.rate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TaxReferenceTable>
      </div>

      <GermanyNetIncomeCalculator />

      <p className="font-sans text-[10px] leading-relaxed text-neutral-600 uppercase tracking-[0.03em]">
        Reference figures are overview-only; verify against official BMF / KV / DRV guidance for filing.
      </p>
    </div>
  );
});
