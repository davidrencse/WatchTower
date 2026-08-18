import { memo } from 'react';
import { RUSSIA_STATIC_MARKET_STRIP } from '../../../data/countries/russia/russiaStaticMarketStrip';
import { GermanyDaxCarousel } from '../germany/GermanyDaxCarousel';

export const RussiaMoexCarousel = memo(function RussiaMoexCarousel() {
  return (
    <GermanyDaxCarousel
      items={RUSSIA_STATIC_MARKET_STRIP}
      ariaLabel="Leading Moscow Exchange equities (static MOEX snapshot, 13 August 2026)"
      locale="ru-RU"
      currency="RUB"
    />
  );
});
