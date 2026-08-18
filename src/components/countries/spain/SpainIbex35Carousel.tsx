import { memo } from 'react';
import { SPAIN_STATIC_MARKET_STRIP } from '../../../data/countries/spain/spainStaticMarketStrip';
import { GermanyDaxCarousel } from '../germany/GermanyDaxCarousel';

export const SpainIbex35Carousel = memo(function SpainIbex35Carousel() {
  return (
    <GermanyDaxCarousel
      items={SPAIN_STATIC_MARKET_STRIP}
      ariaLabel="Leading IBEX 35 equities (static Madrid market snapshot, 27 July 2026)"
    />
  );
});
