import {
  GERMANY_IMMIGRATION_POLICY_AREAS,
  GERMANY_IMMIGRATION_POLICY_CONTEXT,
} from '../data/germanyImmigrationPolicies';
import { ImmigrationPoliciesPanel } from './government/ImmigrationPoliciesPanel';

export function GermanyImmigrationPoliciesSection() {
  return (
    <ImmigrationPoliciesPanel
      context={GERMANY_IMMIGRATION_POLICY_CONTEXT}
      areas={GERMANY_IMMIGRATION_POLICY_AREAS}
    />
  );
}
