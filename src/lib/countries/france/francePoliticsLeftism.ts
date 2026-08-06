import type {
  CancelCultureRow,
  LeftStatCard,
  LeftistGroup,
  PoliticsLeftismData,
} from '../../../components/countries/germany/GermanyPoliticsLeftismSection';

/**
 * France — Politics / Leftism.
 *
 * Sourced:
 *  - 2024 legislative election: Nouveau Front Populaire (left bloc) ~28% first round,
 *    largest bloc; 180 seats. Assembly groups: LFI 71, PS 69, Écologistes 38, PCF 17.
 *  - Party membership: LFI ~370,000 claimed "insoumis" (movement, not dues-paying);
 *    PS ~47,000 (2024); PCF ~37,000; Les Écologistes/EELV ~9,000–10,000; LO ~7,000–8,000;
 *    NPA a few thousand across splits. (Wikipedia / party figures.)
 *  - CGT union ~600,000 members (left-aligned confederation).
 *  - Far-left militants: ~3,000 classified fiché S by intelligence (ultragauche / black bloc).
 *  - Écriture inclusive: 41% favourable nationally (Harris up to 75% with a softer question);
 *    65% support among under-35, but 58% want it banned at university (CSA/CNews 2023).
 *  - University teachers ~2× more likely to place themselves on the left than the general
 *    public (François & Magni-Berton survey of ~2,000 academics).
 *  - Transidentity (Ipsos LGBT+ Pride 2024): 50% support gender-identity access to
 *    single-sex facilities; 40% support a third option on official documents.
 *  - Immigration (Elabe/Ifop 2024): 52% say France has a duty to welcome war/poverty
 *    migrants (−8 pts vs 2023); among Nouveau Front Populaire voters 75% favour welcoming
 *    economic migrants; only ~48% back "zero immigration".
 *
 * Estimated (flagged in the UI): genuine "open borders" support is fringe (~5% nationally);
 * France keeps no cancel-culture registry, so those counts are rough estimates; smaller-party
 * and militant-network memberships are approximate.
 */

const FRANCE_STAT_CARDS: readonly LeftStatCard[] = [
  {
    title: 'Left bloc (Nouveau Front Populaire) vote share',
    value: '~28%',
    subtitle: 'First round, 2024 legislative election — largest bloc (180 seats)',
    sources: [
      {
        label: 'Source: Ministère de l’Intérieur / results 2024 ↗',
        href: 'https://www.touteleurope.eu/vie-politique-des-etats-membres/elections-legislatives-2024-quelle-repartition-des-sieges-dans-la-future-assemblee-nationale/',
      },
    ],
  },
  {
    title: 'University teachers left-leaning',
    value: '~2× national rate',
    subtitle: 'Academics place themselves on the left ~twice as often as the general public',
    sources: [{ label: 'Source: A. François & R. Magni-Berton — survey of ~2,000 French academics' }],
  },
  {
    title: 'Écriture inclusive (inclusive writing) — favourable',
    value: '41% (65% under-35)',
    subtitle: '58% want it banned at university (CSA 2023)',
    sources: [
      {
        label: 'Source: Harris Interactive / CSA-CNews polls ↗',
        href: 'https://www.cnews.fr/france/2023-06-14/sondage-6-francais-sur-10-pensent-quil-faut-interdire-lecriture-inclusive',
      },
    ],
  },
  {
    title: 'Third gender option on official documents — support',
    value: '40%',
    subtitle: 'Down 4 pts vs 2023',
    sources: [
      {
        label: 'Source: Ipsos LGBT+ Pride 2024 ↗',
        href: 'https://www.ipsos.com/fr-fr/lgbt-pride-2024-la-transidentite-un-sujet-qui-fractionne-les-francais',
      },
    ],
  },
  {
    title: 'Trans facility access by gender identity — support',
    value: '50%',
    subtitle: 'Down 3 pts vs 2023 · 75% still say trans people deserve protection',
    sources: [
      {
        label: 'Source: Ipsos LGBT+ Pride 2024 ↗',
        href: 'https://www.ipsos.com/fr-fr/lgbt-pride-2024-la-transidentite-un-sujet-qui-fractionne-les-francais',
      },
    ],
  },
  {
    title: 'Welcoming migrants / open borders',
    value: '75% of NFP voters (~5% nationally)',
    subtitle:
      '75% of Nouveau Front Populaire voters favour welcoming economic migrants; 52% of France sees a duty to welcome war/poverty migrants; genuine open-borders support is fringe (est.)',
    sources: [
      { label: 'Source: Elabe — Les Français et l’immigration ↗', href: 'https://elabe.fr/?p=11690' },
    ],
  },
];

const FRANCE_CANCEL_ROWS: readonly CancelCultureRow[] = [
  { category: 'University talks / events cancelled or blocked by activist pressure (annual, est.)', value: '~30–50 events' },
  { category: 'Far-left militants classified fiché S by intelligence (ultragauche / black bloc)', value: '~3,000' },
];

const FRANCE_GROUPS: readonly LeftistGroup[] = [
  {
    rank: 1,
    group: 'La France Insoumise (LFI)',
    type: 'Political party (radical left)',
    memberPopulation: '~370000',
    notes: 'Largest left force; 71 deputies. Membership is a claimed "movement" figure, not dues-paying',
  },
  {
    rank: 2,
    group: 'CGT (Confédération Générale du Travail)',
    type: 'Trade union confederation',
    memberPopulation: '~600000',
    notes: 'Historically communist-aligned; drives strikes and mass mobilisation',
  },
  {
    rank: 3,
    group: 'Parti Socialiste (PS)',
    type: 'Political party (social democratic)',
    memberPopulation: '~47000',
    notes: '69 deputies; recovered membership after 2017 collapse',
  },
  {
    rank: 4,
    group: 'Parti Communiste Français (PCF)',
    type: 'Communist political party',
    memberPopulation: '~37000',
    notes: '17 deputies; dues-paying members claimed in 2026',
  },
  {
    rank: 5,
    group: 'Les Écologistes (EELV)',
    type: 'Green political party',
    memberPopulation: '~10000',
    notes: '38 deputies in the Écologistes group; membership approximate',
  },
  {
    rank: 6,
    group: 'Lutte Ouvrière (LO)',
    type: 'Trotskyist party',
    memberPopulation: '~8000',
    notes: 'Long-standing revolutionary party; runs in presidential elections (est.)',
  },
  {
    rank: 7,
    group: 'Ultragauche / Black Bloc',
    type: 'Militant decentralised scene',
    memberPopulation: '~3000',
    notes: 'Classified fiché S; property damage and street clashes at demos',
  },
  {
    rank: 8,
    group: 'Nouveau Parti Anticapitaliste (NPA)',
    type: 'Anti-capitalist party',
    memberPopulation: '~2000',
    notes: 'Split into rival factions since 2022; activist rather than electoral (est.)',
  },
  {
    rank: 9,
    group: 'Les Soulèvements de la Terre',
    type: 'Ecological direct action',
    memberPopulation: '~1000',
    notes: 'Anti-megabasin blockades (Sainte-Soline); dissolution overturned by Conseil d’État 2023 (est.)',
  },
  {
    rank: 10,
    group: 'Action Antifasciste (antifa networks)',
    type: 'Decentralised Antifa',
    memberPopulation: '~800',
    notes: 'Local anti-fascist groups; counter-demonstrations and doxxing (est.)',
  },
  {
    rank: 11,
    group: 'Révolution Permanente',
    type: 'Trotskyist current',
    memberPopulation: '~500',
    notes: 'Split from the NPA (2021); active in strikes and universities (est.)',
  },
  {
    rank: 12,
    group: 'Jeunes Insoumis',
    type: 'Youth organisation',
    memberPopulation: '~500',
    notes: 'LFI youth wing; campus and climate mobilisation (est.)',
  },
];

export const FRANCE_POLITICS_LEFTISM: PoliticsLeftismData = {
  statCards: FRANCE_STAT_CARDS,
  cancelCultureTitle: 'Cancel culture & far-left militancy',
  cancelCultureRows: FRANCE_CANCEL_ROWS,
  cancelCultureSource: {
    label: 'Source: Le JDD — l’ultragauche (fichés S) ↗',
    href: 'https://www.lejdd.fr/societe/black-bloc-fiches-s-ecoterroristes-lultragauche-inquiete-les-autorites-147837',
  },
  groupsTitle: 'LEFTIST GROUPS',
  groupsDescription: 'Ranked French left parties, unions and militant networks (membership; approximate where noted)',
  groups: FRANCE_GROUPS,
};
