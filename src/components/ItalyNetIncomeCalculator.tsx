import { memo, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { cn } from '../lib/utils';
import { computeItalyNetIncome } from '../lib/italyTaxes';

const UC = 'uppercase tracking-[0.05em]';

export const ItalyNetIncomeCalculator = memo(function ItalyNetIncomeCalculator() {
  const [grossAnnualStr, setGrossAnnualStr] = useState('35000');
  const [addizionaliStr, setAddizionaliStr] = useState('2.0');

  const ledger = useMemo(() => {
    const gross = Math.max(0, Number(String(grossAnnualStr).replace(/[\s.]/g, '').replace(',', '.')) || 0);
    const addizionaliPct = Math.max(0, Number(String(addizionaliStr).replace(',', '.')) || 0);
    return computeItalyNetIncome({ grossAnnual: gross, addizionaliPct });
  }, [grossAnnualStr, addizionaliStr]);

  return (
    <Card className="overflow-hidden border-line bg-surface-metric">
      <CardHeader className="space-y-1 p-3 pb-2">
        <CardTitle className={cn('font-sans text-xs font-semibold text-neutral-100', UC)}>
          Net income calculator (illustration)
        </CardTitle>
        <CardDescription className="font-sans text-[10px] leading-snug text-neutral-500">
          Approximate employee payroll projection for Italy (IRPEF 2026, three brackets). Not tax advice; omits family
          detrazioni, the trattamento integrativo interplay, the INPS massimale, and comune-specific addizionali.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-3 pt-0">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1 font-sans text-[11px] text-neutral-400">
            Gross annual — RAL (€)
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
            Local surcharges — addizionali (%)
            <input
              type="text"
              inputMode="decimal"
              value={addizionaliStr}
              onChange={(e) => setAddizionaliStr(e.target.value)}
              className="rounded-md border border-white/[0.08] bg-black/30 px-2 py-1.5 font-sans text-sm tabular-nums text-neutral-100 outline-none ring-[var(--uk-accent)]/40 focus:ring-2"
              aria-label="Combined regional and municipal surcharge percentage"
            />
          </label>
          <p className="font-sans text-[10px] leading-snug text-neutral-600 sm:col-span-2 sm:pt-6">
            Combined regional (1.23%–3.33%) + municipal (0%–0.9%) IRPEF surcharge; ~2% is a typical blend. The cuneo
            fiscale bonus and employment detrazione apply automatically by income.
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
                  line.label.includes('Taxable income') || line.label.includes('Detrazione') || line.label.includes('Ulteriore');
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
                      {line.amount.toLocaleString('it-IT', {
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
          Italian salaries are usually paid over 13 or 14 mensilità; this projection annualises a flat 12-month figure.
          Taxable income is approximated as gross − INPS; the 23/33/43% IRPEF brackets and the €1,955 employment credit
          follow the 2026 Budget Law (middle rate cut 35% → 33%).
        </p>
      </CardContent>
    </Card>
  );
});
