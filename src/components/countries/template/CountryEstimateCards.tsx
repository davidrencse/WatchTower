import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';

/**
 * One broad-stroke figure in a template dossier: a rounded orientation number with the caveat
 * attached, never presented as an official statistic.
 */
export type EstimateCard = {
  title: string;
  value: string;
  /** Reference year / scope, e.g. "2024 · standard rate". */
  meta?: string;
  /** One line of context or the derivation. */
  note?: string;
};

/** Grid of broad-stroke estimate cards. Matches `STAT_GRID`'s column rhythm. */
export const CountryEstimateCards = memo(function CountryEstimateCards({
  cards,
}: {
  cards: readonly EstimateCard[];
}) {
  if (cards.length === 0) return null;
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title} className="flex min-w-0 flex-col border-amber-400/20 bg-surface-metric shadow-card">
          <CardHeader className="space-y-1 p-3 pb-2">
            <CardTitle className="font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-500">
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col p-3 pt-0">
            <p className="font-sans text-lg font-semibold leading-snug tracking-tight text-neutral-100 sm:text-xl">
              {card.value}
            </p>
            {card.meta ? (
              <p className="mt-1.5 font-sans text-[10px] uppercase tracking-[0.1em] text-amber-200/70">
                {card.meta}
              </p>
            ) : null}
            {card.note ? (
              <p className="mt-auto pt-3 font-sans text-[10px] leading-relaxed text-neutral-500">{card.note}</p>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
});
