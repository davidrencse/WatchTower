import { memo } from 'react';
import {
  FRANCE_ECONOMIC_STRUCTURAL_INDICATORS,
  FRANCE_ECONOMIC_STRUCTURAL_GROUP_COUNT,
} from '../lib/franceEconomyStats';
import { EconomicStructuralSection } from './EconomicStructuralSection';

export { FRANCE_ECONOMIC_STRUCTURAL_GROUP_COUNT };

export const FranceEconomicStructuralSection = memo(function FranceEconomicStructuralSection() {
  return <EconomicStructuralSection indicators={FRANCE_ECONOMIC_STRUCTURAL_INDICATORS} />;
});
