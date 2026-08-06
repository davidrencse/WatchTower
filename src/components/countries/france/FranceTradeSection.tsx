import { GermanyTradeSection } from '../germany/GermanyTradeSection';
import { FRANCE_TRADE } from '../../../lib/countries/france/franceTrade';

/** France's trade subsection — keeps `FRANCE_TRADE` out of the shared dashboard chunk. */
export function FranceTradeSection() {
  return <GermanyTradeSection {...FRANCE_TRADE} />;
}
