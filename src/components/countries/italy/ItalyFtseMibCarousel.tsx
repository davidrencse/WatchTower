import { memo } from 'react';
import { ITALY_STATIC_MARKET_STRIP } from '../../../data/countries/italy/italyStaticMarketStrip';
import { GermanyDaxCarousel } from '../germany/GermanyDaxCarousel';

export const ItalyFtseMibCarousel = memo(function ItalyFtseMibCarousel() {
  return (
    <GermanyDaxCarousel
      items={ITALY_STATIC_MARKET_STRIP}
      ariaLabel="Leading FTSE MIB equities (static Borsa Italiana snapshot, July 2026)"
    />
  );
});
