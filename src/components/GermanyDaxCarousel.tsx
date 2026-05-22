import { memo, useMemo } from 'react';
import { GERMANY_STATIC_MARKET_STRIP, type GermanyStockStripRow } from '../data/germanyStaticMarketStrip';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const UC_TITLE = 'uppercase tracking-[0.05em]';
const UC_META = 'uppercase tracking-[0.03em]';

export type { GermanyStockStripRow };

function formatEur(n: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function formatSignedEur(n: number): string {
  const fmt = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  if (n > 0) return `+${fmt.format(n)}`;
  return fmt.format(n);
}

function formatPct(n: number): string {
  const sign = n > 0 ? '+' : '';
  return `${sign}${n.toFixed(2)}%`;
}

/** Lightweight SVG sparkline — avoids 50+ Recharts ResponsiveContainer instances. */
function sparklinePath(values: number[]): string {
  if (values.length < 2) return '';
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  return values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * 100;
      const y = 100 - ((v - min) / span) * 100;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

const StockSparkline = memo(function StockSparkline({
  path,
  positive,
}: {
  path: string;
  positive: boolean;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="h-[34px] w-full"
      aria-hidden
    >
      <path
        d={path}
        fill="none"
        stroke={positive ? '#fafafa' : '#9ca3af'}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
});

const StockCard = memo(function StockCard({ item }: { item: GermanyStockStripRow }) {
  const up = item.changePercent >= 0;
  const pctClass = up ? 'text-emerald-400' : 'text-red-400';
  const sparkPath = useMemo(
    () => sparklinePath(item.history.map((h) => h.close)),
    [item.history],
  );

  return (
    <Card className="w-[152px] shrink-0 overflow-hidden rounded-sm border border-white/[0.14] bg-black font-sans shadow-card ring-1 ring-white/[0.06]">
      <CardHeader className="space-y-0.5 border-b border-white/[0.12] bg-white/[0.03] p-2.5 pb-1.5">
        <CardTitle className={`font-sans text-[9px] font-semibold tabular-nums leading-tight text-neutral-100 ${UC_TITLE}`}>
          {item.ticker}
        </CardTitle>
        <CardDescription className={`font-sans line-clamp-2 min-h-[1.75rem] text-[8px] leading-snug text-neutral-400 ${UC_META}`}>
          {item.companyName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-1.5 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent_45%)] px-2.5 pb-2.5 pt-1.5">
        <div className="flex flex-col gap-0">
          <span className="font-sans text-[15px] font-semibold tabular-nums leading-none tracking-tight text-white">
            {formatEur(item.priceEur)}
          </span>
          <div className="flex flex-wrap items-baseline gap-x-1 font-sans text-[8px] tabular-nums">
            <span className={pctClass}>{formatSignedEur(item.changeEur)}</span>
            <span className={pctClass}>{formatPct(item.changePercent)}</span>
          </div>
        </div>
        <StockSparkline path={sparkPath} positive={up} />
        {item.highlight ? (
          <p
            className={`line-clamp-2 border-t border-white/[0.08] pt-1.5 font-sans text-[7px] leading-snug text-neutral-600 ${UC_META}`}
            title={item.highlight}
          >
            {item.highlight}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
});

export const GermanyDaxCarousel = memo(function GermanyDaxCarousel() {
  const items = GERMANY_STATIC_MARKET_STRIP;

  return (
    <section
      className="wt-dax-carousel group relative font-sans"
      aria-label="German equities and bond ETF (static snapshot)"
    >
      <div className="rounded-sm border border-white/[0.14] bg-black p-2.5 shadow-card ring-1 ring-white/[0.06]">
        <div className="wt-dax-carousel-viewport max-w-full overflow-hidden border border-white/[0.12] bg-neutral-950/80">
          <div className="wt-dax-carousel-track flex w-max gap-2 pb-1">
            {items.map((item) => (
              <StockCard key={item.ticker} item={item} />
            ))}
            {items.map((item) => (
              <StockCard key={`${item.ticker}-dup`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});
