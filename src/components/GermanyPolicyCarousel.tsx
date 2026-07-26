import { GERMANY_POLICY_INFOGRAPHICS } from '../data/germanyPolicyInfographicCards';
import type { GermanyGovernmentPoliticsRow } from '../lib/germanyGovernmentPolitics';
import { PolicyCarousel } from './government/PolicyCarousel';

type Props = {
  /** Kept for call-site compatibility; the carousel renders the bundled sector cards. */
  policyRows: GermanyGovernmentPoliticsRow[];
};

export function GermanyPolicyCarousel({ policyRows }: Props) {
  void policyRows;
  return <PolicyCarousel cards={GERMANY_POLICY_INFOGRAPHICS} label="Federal policy changes" />;
}
