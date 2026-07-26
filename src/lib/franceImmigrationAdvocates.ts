import type { AdvocateCard } from '../components/GermanyImmigrationAdvocatesSubsection';

/** France pro-immigration / pro-asylum advocacy organizations (real orgs, public records). */
export const FRANCE_ADVOCATES: readonly AdvocateCard[] = [
  {
    id: 'la-cimade',
    title: 'La Cimade',
    tagline: 'Migrant & refugee solidarity NGO',
    metaLabel: 'Founded',
    metaValue: '1939 · NGO',
    badges: ['Asylum', 'Gauche', 'Détention', 'EU'],
    overview:
      'France’s best-known migrant-support NGO (founded 1939). Provides legal aid in detention centres (CRA), litigates against expulsions and OQTF, and campaigns against border tightening and the 2024 immigration law.',
    leftistTies:
      'Rooted in Protestant social-justice networks; aligned with the left (LFI/PS/EELV/Greens) on regularisation and against détention. Publishes the annual CRA report jointly with other associations.',
    affiliations:
      'Partners with UNHCR and EU-funded programmes; part of the Coordination française pour le droit d’asile (CFDA) coalition of ~20 associations.',
    impact:
      'Central voice against the 2024 “loi immigration”; its detention-centre reporting shapes national coverage of expulsion conditions.',
    sources: [
      { label: 'lacimade.org', href: 'https://www.lacimade.org/' },
      { label: 'CFDA (coalition)', href: 'https://www.lacimade.org/' },
    ],
  },
  {
    id: 'france-terre-dasile',
    title: 'France terre d’asile',
    tagline: 'Reception & integration of asylum seekers',
    metaLabel: 'Founded',
    metaValue: '1971 · association',
    badges: ['CADA', 'State €', 'Mineurs', 'Intégration'],
    overview:
      'Major operator of asylum-seeker reception (CADA/HUDA) and support for unaccompanied minors; advocates expansive protection and faster access to housing and work.',
    leftistTies:
      'Historically tied to social-democratic and human-rights milieus; large flows of public money move through its reception contracts, shaping “accueil” policy.',
    affiliations:
      'State-funded (OFII/DGEF contracts) and EU AMIF grants; works with UNHCR and municipal sanctuary initiatives.',
    impact:
      'Its statistics and position papers are widely cited in the asylum debate; lobbied against reception-condition cuts in the 2025–2026 budgets.',
    sources: [
      { label: 'france-terre-asile.org', href: 'https://www.france-terre-asile.org/' },
      { label: 'OFII (reception)', href: 'https://www.ofii.fr/' },
    ],
  },
  {
    id: 'gisti',
    title: 'GISTI',
    tagline: 'Groupe d’information et de soutien des immigré·es',
    metaLabel: 'Founded',
    metaValue: '1972 · legal group',
    badges: ['Contentieux', 'Sans-papiers', 'Gauche', 'Droit'],
    overview:
      'Legal-action group specialising in immigration law; files strategic litigation before the Conseil d’État and defends undocumented migrants (sans-papiers) and open-access to rights.',
    leftistTies:
      'Firmly on the radical/associative left; frequent co-plaintiff with La Cimade, LDH and unions against restrictive decrees and the “métiers en tension” limits.',
    affiliations:
      'Coalition litigation with LDH, Cimade, Amnesty France; funded by memberships, foundations and some EU/rights grants.',
    impact:
      'Repeatedly overturns or challenges prefectural practice via the Conseil d’État; a key technical driver of pro-migrant jurisprudence.',
    sources: [
      { label: 'gisti.org', href: 'https://www.gisti.org/' },
      { label: 'Conseil d’État (case law)', href: 'https://www.conseil-etat.fr/' },
    ],
  },
  {
    id: 'ldh-sos',
    title: 'LDH & SOS Racisme',
    tagline: 'Human-rights & anti-racism brands',
    metaLabel: 'Founded',
    metaValue: 'LDH 1898 · SOS 1984',
    badges: ['LFI', 'PS', 'Antiracisme', 'Frontières'],
    overview:
      'The Ligue des droits de l’Homme (1898) and SOS Racisme (1984) frame immigration as a rights and anti-discrimination issue, opposing border hardening and “délit de solidarité”.',
    leftistTies:
      'Deep ties to PS/LFI/Green networks; SOS Racisme was historically close to the Parti socialiste. Both mobilise against RN/Reconquête immigration platforms.',
    affiliations:
      'Members of national anti-racism coalitions; receive public subsidies and foundation funding; partner with unions (CGT, FSU) on demonstrations.',
    impact:
      'Organise large marches against immigration laws; LDH’s reports and legal complaints are routinely cited in policing and border-rights debates.',
    sources: [
      { label: 'ldh-france.org', href: 'https://www.ldh-france.org/' },
      { label: 'sos-racisme.org', href: 'https://sos-racisme.org/' },
    ],
  },
  {
    id: 'utopia-56',
    title: 'Utopia 56',
    tagline: 'Grassroots migrant field-aid network',
    metaLabel: 'Founded',
    metaValue: '2015 · association',
    badges: ['Terrain', 'Calais', 'No border', 'Bénévoles'],
    overview:
      'Volunteer field network (since 2015) providing shelter, transport and aid to migrants in Calais, Paris and Ouistreham; contests evictions and “non-accueil” of the state.',
    leftistTies:
      'Anchored in the associative and no-border left; frequently in legal conflict with the state over camp evictions and the “délit de solidarité”.',
    affiliations:
      'Coordinates with Secours Catholique, Emmaüs and Médecins du Monde on the northern coast; funded mainly by donations.',
    impact:
      'Highly visible in Calais/Channel-crossing coverage; its volunteers and litigation keep evictions and reception failures in the news.',
    sources: [
      { label: 'utopia56.org', href: 'https://utopia56.org/' },
      { label: 'Secours Catholique', href: 'https://www.secours-catholique.org/' },
    ],
  },
];

export const FRANCE_ADVOCATES_HEADING =
  'Major leftist groups pushing for immigration and open borders in France';
export const FRANCE_ADVOCATES_INTRO =
  'France’s immigration debate is heavily shaped by associations and rights groups that press for broad asylum access, regularisation of the undocumented, and lighter border enforcement. They describe the work as humanitarian solidarity; critics argue it weakens national control over who enters and settles. The five tiles below highlight leading players — legal-aid NGOs, the main reception operator, a strategic-litigation group, human-rights/anti-racism brands, and a grassroots field network — with expandable source links. Snapshot draws on public advocacy records through roughly 2024–2025.';
export const FRANCE_ADVOCATES_COALITION =
  'Coalition pattern: joint litigation and statements (CFDA, coordinated legal challenges), street mobilisations with unions (CGT, FSU), and mixed financing — state reception contracts (OFII/DGEF), EU AMIF grants, foundations and donations. These sit beside polarised arguments over integration costs and the execution rate of expulsion orders (OQTF).';
