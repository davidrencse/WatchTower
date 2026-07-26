/**
 * Shape of the government → Policies → Immigration Policies panel.
 *
 * A context header plus one card per policy area. Germany and France both feed
 * `components/government/ImmigrationPoliciesPanel` with this shape.
 */

export type ImmigrationPolicyArea = {
  id: string;
  title: string;
  /** The current rule, rendered after a "Now ·" prefix. */
  current: string;
  details: string;
  /** Consequence, rendered after an "Effect ·" prefix. */
  impact: string;
  source: string;
};

export type ImmigrationPolicyContext = {
  headline: string;
  period: string;
  government: string;
  summary: string;
};
