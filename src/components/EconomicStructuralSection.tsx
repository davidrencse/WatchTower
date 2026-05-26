import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { memo } from 'react';
import type { EconomicStructuralIndicator } from '../lib/franceEconomyStats';

const UC = 'uppercase tracking-[0.05em]';

type EconomicStructuralSectionProps = {
  indicators: readonly EconomicStructuralIndicator[];
  oilSuppliersButton?: boolean;
  onOilSuppliersClick?: () => void;
};

export const EconomicStructuralSection = memo(function EconomicStructuralSection({
  indicators,
  oilSuppliersButton = false,
  onOilSuppliersClick,
}: EconomicStructuralSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {indicators.map((item) => (
        <Card key={item.id}>
          <CardHeader className="space-y-1 p-3 pb-2">
            <CardTitle className={`font-sans text-[11px] leading-tight text-neutral-100 ${UC}`}>
              {item.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5 p-3 pt-0">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="font-sans text-xl font-semibold leading-none text-neutral-100 tabular-nums">
                {item.valueMain}
              </span>
              <span className="font-sans text-[10px] font-medium leading-snug text-neutral-500">
                {item.valueSub}
              </span>
            </div>
            <p className="font-sans text-[10px] leading-snug text-neutral-400">{item.details}</p>

            {oilSuppliersButton && item.id === 'oil-dependency' && onOilSuppliersClick ? (
              <div>
                <button
                  type="button"
                  onClick={onOilSuppliersClick}
                  className="mt-1 rounded-md border border-white/[0.1] bg-card px-2 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.1em] text-neutral-200 shadow-sm transition hover:border-white/[0.16] hover:bg-card-hover"
                >
                  Top suppliers
                </button>
              </div>
            ) : null}

            <p className="border-t border-white/[0.06] pt-1.5 font-sans text-[9px] leading-snug text-neutral-600">
              {item.source}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
});
