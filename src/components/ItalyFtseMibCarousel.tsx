import { memo } from 'react';
import { ITALY_STATIC_MARKET_STRIP } from '../data/italyStaticMarketStrip';
import { StockCard } from './GermanyDaxCarousel';

export const ItalyFtseMibCarousel = memo(function ItalyFtseMibCarousel() {
  const items = ITALY_STATIC_MARKET_STRIP;

  return (
    <section
      className={'wt-dax-carousel group relative font-sans'}
      aria-label={'Leading FTSE MIB equities (static Borsa Italiana snapshot, July 2026)'}
    >
      <div className={'rounded-sm border border-white/[0.14] bg-black p-2.5 shadow-card ring-1 ring-white/[0.06]'}>
        <div className={'wt-dax-carousel-viewport max-w-full overflow-hidden border border-white/[0.12] bg-neutral-950/80'}>
          <div className={'wt-dax-carousel-track flex w-max gap-2 pb-1'}>
            {items.map((item) => (
              <StockCard key={item.ticker} item={item} />
            ))}
            {items.map((item) => (
              <StockCard key={item.ticker + '-dup'} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});
