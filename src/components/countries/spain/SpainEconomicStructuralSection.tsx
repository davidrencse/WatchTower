import { memo } from 'react';
import {
  SPAIN_ECONOMIC_STRUCTURAL_GROUP_COUNT,
  SPAIN_ECONOMIC_STRUCTURAL_INDICATORS,
} from '../../../lib/countries/spain/spainEconomyStats';
import { EconomicStructuralSection } from '../../EconomicStructuralSection';

export { SPAIN_ECONOMIC_STRUCTURAL_GROUP_COUNT };

export const SpainEconomicStructuralSection = memo(function SpainEconomicStructuralSection() {
  return <EconomicStructuralSection indicators={SPAIN_ECONOMIC_STRUCTURAL_INDICATORS} />;
});
