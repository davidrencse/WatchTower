import { memo } from 'react';
import { FRANCE_STATIC_MARKET_STRIP } from '../../../data/countries/france/franceStaticMarketStrip';
import { StockCard } from '../germany/GermanyDaxCarousel';

export const FranceCac40Carousel = memo(function FranceCac40Carousel() {
  const items = FRANCE_STATIC_MARKET_STRIP;

  return (
    <section
      className={'wt-dax-carousel group relative font-sans'}
      aria-label={'Leading CAC 40 equities (static Euronext snapshot, June to July 2026)'}
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
