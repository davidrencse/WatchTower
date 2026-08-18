import { GermanyTradeSection } from '../germany/GermanyTradeSection';
import { SPAIN_TRADE } from '../../../lib/countries/spain/spainTrade';

/** Spain's complete trade subsection, rendered through the shared country-trade surface. */
export function SpainTradeSection() {
  return <GermanyTradeSection {...SPAIN_TRADE} />;
}
