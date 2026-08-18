import { memo, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { cn } from '../../../lib/utils';
import {
  computeSpainNetIncome,
  SPAIN_SOCIAL_SECURITY_MAX_ANNUAL,
} from '../../../lib/countries/spain/spainTaxes';

const UC = 'uppercase tracking-[0.05em]';

export const SpainNetIncomeCalculator = memo(function SpainNetIncomeCalculator() {
  const [grossAnnualStr, setGrossAnnualStr] = useState('40000');
  const [childrenStr, setChildrenStr] = useState('0');
  const [contractType, setContractType] = useState<'indefinite' | 'temporary'>('indefinite');

  const ledger = useMemo(() => {
    const grossAnnual = Math.max(0, Number(grossAnnualStr.replace(/[\s.]/g, '').replace(',', '.')) || 0);
    const children = Math.min(10, Math.max(0, Number.parseInt(childrenStr, 10) || 0));
    return computeSpainNetIncome({ grossAnnual, children, contractType });
  }, [childrenStr, contractType, grossAnnualStr]);

  return (
    <Card className="overflow-hidden border-line bg-surface-metric">
      <CardHeader className="space-y-1 p-3 pb-2">
        <CardTitle className={cn('font-sans text-xs font-semibold text-neutral-100', UC)}>
          Net income calculator (illustration)
        </CardTitle>
        <CardDescription className="max-w-4xl font-sans text-[10px] leading-relaxed text-neutral-500">
          Approximate employee payroll for Spain using 2026 Social Security and the common-regime IRPF reference
          scale. Autonomous-community bands and personal deductions vary, so this is an orientation tool—not a tax
          return or withholding certificate.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-3 pt-0">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1 font-sans text-[11px] text-neutral-400">
            Gross annual salary (€)
            <input
              type="text"
              inputMode="decimal"
              value={grossAnnualStr}
              onChange={(event) => setGrossAnnualStr(event.target.value)}
              className="rounded-md border border-white/[0.08] bg-black/30 px-2 py-1.5 font-sans text-sm tabular-nums text-neutral-100 outline-none ring-[var(--uk-accent)]/40 focus:ring-2"
              aria-label="Gross annual salary in euros"
            />
          </label>

          <label className="flex flex-col gap-1 font-sans text-[11px] text-neutral-400">
            Qualifying children
            <input
              type="number"
              min="0"
              max="10"
              inputMode="numeric"
              value={childrenStr}
              onChange={(event) => setChildrenStr(event.target.value)}
              className="rounded-md border border-white/[0.08] bg-black/30 px-2 py-1.5 font-sans text-sm tabular-nums text-neutral-100 outline-none ring-[var(--uk-accent)]/40 focus:ring-2"
              aria-label="Number of qualifying children"
            />
          </label>

          <label className="flex flex-col gap-1 font-sans text-[11px] text-neutral-400">
            Contract type
            <select
              value={contractType}
              onChange={(event) => setContractType(event.target.value as 'indefinite' | 'temporary')}
              className="rounded-md border border-white/[0.08] bg-black/30 px-2 py-1.5 font-sans text-sm text-neutral-100 outline-none ring-[var(--uk-accent)]/40 focus:ring-2"
              aria-label="Employment contract type"
            >
              <option value="indefinite">Indefinite</option>
              <option value="temporary">Temporary</option>
            </select>
          </label>

          <p className="font-sans text-[10px] leading-relaxed text-neutral-600 lg:pt-6">
            Employee contributions use the €{SPAIN_SOCIAL_SECURITY_MAX_ANNUAL.toLocaleString('es-ES')} annual cap,
            then apply the 2026 solidarity bands above it.
          </p>
        </div>

        <div className="overflow-x-auto rounded-md border border-white/[0.06]">
          <Table className="table-fixed md:table-auto">
            <TableHeader>
              <TableRow className="border-white/[0.06] hover:bg-transparent">
                <TableHead className="h-9 w-[62%] text-[10px] font-semibold uppercase tracking-wide text-neutral-400 md:min-w-44 md:w-auto">
                  Ledger line
                </TableHead>
                <TableHead className="h-9 w-[38%] text-right text-[10px] font-semibold uppercase tracking-wide text-neutral-400 md:min-w-28 md:w-auto">
                  Amount (€)
                </TableHead>
                <TableHead className="hidden min-w-72 text-[10px] font-semibold uppercase tracking-wide text-neutral-400 md:table-cell">
                  Detail
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ledger.lines.map((line) => {
                const isReference =
                  line.label.includes('taxable base') || line.label.includes('minimum relief');
                const amountClass = isReference
                  ? 'py-2 text-right font-mono text-[12px] tabular-nums text-neutral-200'
                  : cn(
                      'py-2 text-right font-mono text-[12px] tabular-nums',
                      line.amount > 0
                        ? 'text-emerald-400/90'
                        : line.amount < 0
                          ? 'text-rose-400/90'
                          : 'text-neutral-400',
                    );

                return (
                  <TableRow key={line.label}>
                    <TableCell className="py-2 font-sans text-[12px] text-neutral-200">{line.label}</TableCell>
                    <TableCell className={amountClass}>
                      {line.amount.toLocaleString('es-ES', {
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

        <p className="max-w-5xl font-sans text-[10px] leading-relaxed text-neutral-600">
          The model assumes salary is earned evenly over 12 months, applies the €2,000 general employment expense,
          and models the standard personal and descendant minimums. It omits regional-scale differences, the
          low-income employment reduction, disability and age adjustments, joint-return reductions, benefits in kind,
          shared claims to descendant minimums, and other deductions.
        </p>
      </CardContent>
    </Card>
  );
});
