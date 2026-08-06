import { memo } from 'react';
import {
  ITALY_ECONOMIC_STRUCTURAL_GROUP_COUNT,
  ITALY_ECONOMIC_STRUCTURAL_INDICATORS,
} from '../../../lib/countries/italy/italyEconomyStats';
import { EconomicStructuralSection } from '../../EconomicStructuralSection';

export { ITALY_ECONOMIC_STRUCTURAL_GROUP_COUNT };

export const ItalyEconomicStructuralSection = memo(function ItalyEconomicStructuralSection() {
  return <EconomicStructuralSection indicators={ITALY_ECONOMIC_STRUCTURAL_INDICATORS} />;
});
