import { memo, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { cn } from '../lib/utils';
import { computeFranceNetIncome, FRANCE_PASS_ANNUAL } from '../lib/franceTaxes';

const UC = 'uppercase tracking-[0.05em]';

export const FranceNetIncomeCalculator = memo(function FranceNetIncomeCalculator() {
  const [grossAnnualStr, setGrossAnnualStr] = useState('45000');
  const [partsStr, setPartsStr] = useState('1');

  const ledger = useMemo(() => {
    const gross = Math.max(0, Number(String(grossAnnualStr).replace(/[\s,]/g, '')) || 0);
    const parts = Math.max(1, Number(String(partsStr).replace(',', '.')) || 1);
    return computeFranceNetIncome({ grossAnnual: gross, parts });
  }, [grossAnnualStr, partsStr]);

  return (
    <Card className="overflow-hidden border-line bg-surface-metric">
      <CardHeader className="space-y-1 p-3 pb-2">
        <CardTitle className={cn('font-sans text-xs font-semibold text-neutral-100', UC)}>
          Net income calculator (illustration)
        </CardTitle>
        <CardDescription className="font-sans text-[10px] leading-snug text-neutral-500">
          Approximate employee payroll projection for France (barème 2026 on 2025 income). Not tax advice; omits
          plafonnement du quotient familial, frais réels, PER deductions and the CSG 4-PASS abatement cap.
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
            Parts fiscales (quotient familial)
            <input
              type="text"
              inputMode="decimal"
              value={partsStr}
              onChange={(e) => setPartsStr(e.target.value)}
              className="rounded-md border border-white/[0.08] bg-black/30 px-2 py-1.5 font-sans text-sm tabular-nums text-neutral-100 outline-none ring-[var(--uk-accent)]/40 focus:ring-2"
              aria-label="Number of parts fiscales"
            />
          </label>
          <p className="font-sans text-[10px] leading-snug text-neutral-600 sm:col-span-2 sm:pt-6">
            1 part = single · 2 = married/PACS · +0.5 per child (+1 from the third). Décote applies automatically below
            the gross-tax ceiling.
          </p>
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
                const isInfo =
                  line.label.includes('Revenu net imposable') || line.label.includes('Quotient familial');
                const cls = isInfo
                  ? 'py-2 text-right font-mono text-[12px] tabular-nums text-neutral-200'
                  : cn(
                      'py-2 text-right font-mono text-[12px] tabular-nums',
                      line.amount > 0 ? 'text-emerald-400/90' : line.amount < 0 ? 'text-rose-400/90' : 'text-neutral-400',
                    );
                return (
                  <TableRow key={line.label}>
                    <TableCell className="py-2 font-sans text-[12px] text-neutral-200">{line.label}</TableCell>
                    <TableCell className={cls}>
                      {line.amount.toLocaleString('fr-FR', {
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
          Ceiling illustration: capped vieillesse and Agirc-Arrco T1 apply to the first €
          {FRANCE_PASS_ANNUAL.toLocaleString('fr-FR')} (PASS, frozen for 2026); T2 covers 1–8 PASS. Employees pay no
          health or unemployment contribution — those are employer-side; CSG/CRDS replace them on 98.25% of gross.
        </p>
      </CardContent>
    </Card>
  );
});
