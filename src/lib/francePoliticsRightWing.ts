import type {
  RightMetric,
  RightWingGroup,
  PoliticsRightWingData,
} from '../components/GermanyPoliticsRightWingSection';

/**
 * France — Politics / Right-wing.
 *
 * Sourced:
 *  - 2024 legislative election (1st round, 30 June): Rassemblement National + allies
 *    33.15% — the single largest party. RN ~110,000 members / supporters.
 *  - Les Républicains: ~85,000 members (2025), spiking to 122,264 in April 2025 for the
 *    Retailleau/Wauquiez leadership contest.
 *  - Reconquête (Zemmour): peaked at a claimed ~100,000 members in 2022, then collapsed —
 *    only 0.75% in the 2024 legislatives; membership and finances sharply down.
 *  - Border controls: 71% favour re-establishing them (CSA 2026), 77% in Sept 2024;
 *    91% of right-wing sympathisers and 96% of LR supporters approve.
 *  - Immigration: 67% say France cannot welcome more migrants because values differ too much;
 *    61–73% think there are too many immigrants.
 *  - Far-right militants: ~1,400 classified fiché S (2025), up sharply. Government dissolved
 *    Génération Identitaire (March 2021) and the GUD (June 2024).
 *
 * Estimated (flagged in the UI): academic right-share, traditional-gender-role and
 * biological-sex figures are inferred from adjacent polling (écriture-inclusive opposition,
 * Ipsos transidentity declines), not a single headline survey; smaller militant-group
 * memberships are approximate.
 */

const FRANCE_METRICS: readonly RightMetric[] = [
  {
    title: 'SELF-IDENTIFIED RIGHT-WING / NATIONAL-CONSERVATIVE SHARE',
    value: '~33% (RN) · ~40% right bloc',
    notes:
      'Rassemblement National led the 2024 legislative first round at 33.15% — the largest single party. With Les Républicains and Reconquête, the right/national bloc is roughly 40% of the vote.',
  },
  {
    title: 'UNIVERSITY TEACHERS / SELF-IDENTIFIED RIGHT-LEANING',
    value: '~10-15% (est.)',
    notes:
      'French academia leans strongly left (teachers place themselves left ~2× the national rate); the right is a small minority. No single headline survey — inferred.',
  },
  {
    title: 'OPPOSITION TO ÉCRITURE INCLUSIVE / GENDER-NEUTRAL MANDATES',
    value: '~58%',
    notes:
      '58% think écriture inclusive should be banned at university (CSA 2023); the Sénat voted to ban it in official documents. Opposition rises sharply with age.',
  },
  {
    title: 'IMMIGRATION: "VALUES TOO DIFFERENT TO WELCOME MORE"',
    value: '67%',
    notes:
      '67% say France cannot welcome more migrants because values differ too much; 61–73% think there are already too many immigrants (Elabe / Ifop 2024).',
  },
  {
    title: 'BELIEF IN BIOLOGICAL SEX / SCEPTICISM OF TRANS POLICY',
    value: '~50-60% (est.)',
    notes:
      'Support for gender-identity facility access fell to 50% and third-gender documents to 40% (Ipsos 2024); a growing plurality favours a biological-sex basis. Inferred from declines.',
  },
  {
    title: 'BELIEF IN CONTROLLED BORDERS / OPPOSITION TO OPEN BORDERS',
    value: '71-77%',
    notes:
      '71% favour re-establishing border controls (CSA), 77% in Sept 2024; 91% among right-wing sympathisers and 96% among LR voters.',
  },
];

const FRANCE_GROUPS: readonly RightWingGroup[] = [
  {
    rank: 1,
    group: 'Rassemblement National (RN)',
    type: 'Political party (national-populist)',
    memberPopulation: '~110000',
    notes: 'Largest single party (33.15% in the 2024 first round); ~125 deputies with allies',
  },
  {
    rank: 2,
    group: 'Les Républicains (LR)',
    type: 'Political party (conservative)',
    memberPopulation: '~85000',
    notes: 'Spiked to 122,264 members in April 2025 for the leadership contest',
  },
  {
    rank: 3,
    group: 'Reconquête (Zemmour)',
    type: 'Political party (far-right)',
    memberPopulation: '~30000',
    notes: 'Claimed ~100k at its 2022 peak, then collapsed to 0.75% in 2024 (est. current)',
  },
  {
    rank: 4,
    group: 'Action Française',
    type: 'Royalist / nationalist movement',
    memberPopulation: '~3000',
    notes: 'Oldest French far-right movement; marches and student sections (est.)',
  },
  {
    rank: 5,
    group: 'Ultradroite (identitarian militants)',
    type: 'Militant scene',
    memberPopulation: '~1400',
    notes: 'Classified fiché S; the second security concern after jihadism (2025)',
  },
  {
    rank: 6,
    group: 'Rassemblement National de la Jeunesse (RNJ)',
    type: 'Youth organisation',
    memberPopulation: '~25000',
    notes: 'RN youth wing; campus and social-media mobilisation (est.)',
  },
  {
    rank: 7,
    group: 'GUD (Groupe Union Défense)',
    type: 'Militant student group',
    memberPopulation: 'dissolved',
    notes: 'Violent neo-fascist student group; dissolved by government June 2024',
  },
  {
    rank: 8,
    group: 'Génération Identitaire (splinters)',
    type: 'Identitarian network',
    memberPopulation: 'dissolved',
    notes: 'Movement dissolved March 2021; local splinters (Les Natifs, Les Remparts…) persist',
  },
  {
    rank: 9,
    group: 'Les Natifs / Les Remparts / La Citadelle',
    type: 'Identitarian local groups',
    memberPopulation: '~800',
    notes: 'Post-GI regional identitarian scenes in Paris, Lyon, Lille (est.)',
  },
  {
    rank: 10,
    group: 'Civitas',
    type: 'Catholic traditionalist / integralist',
    memberPopulation: 'dissolved',
    notes: 'Traditionalist Catholic movement; dissolved by government October 2023',
  },
  {
    rank: 11,
    group: 'Némésis',
    type: 'Identitarian feminist collective',
    memberPopulation: '~300',
    notes: 'Links immigration to women’s safety; visible at demonstrations (est.)',
  },
  {
    rank: 12,
    group: 'Les Zouaves Paris',
    type: 'Militant street group',
    memberPopulation: 'dissolved',
    notes: 'Violent far-right street group; dissolved by government January 2022',
  },
];

export const FRANCE_POLITICS_RIGHTWING: PoliticsRightWingData = {
  metrics: FRANCE_METRICS,
  groupsTitle: 'RIGHT-WING GROUPS',
  groupsDescription: 'Ranked French right parties, youth wings and militant networks (membership; approximate where noted)',
  groups: FRANCE_GROUPS,
};
