import type { AdvocateCard } from '../../../components/countries/germany/GermanyImmigrationAdvocatesSubsection';

/** Spain migration, asylum, regularisation and anti-racism advocates. */
export const SPAIN_ADVOCATES: readonly AdvocateCard[] = [
  {
    id: 'cear',
    title: 'CEAR',
    tagline: 'Spanish Commission for Refugee Aid',
    metaLabel: 'Founded',
    metaValue: '1979 · NGO',
    badges: ['Asylum', 'Safe routes', 'Regularisation', 'Rights'],
    overview:
      'CEAR provides reception, legal, employment and psychosocial support to refugees, asylum seekers and migrants while campaigning for stronger access to international protection.',
    leftistTies:
      'CEAR does not present itself as a political party affiliate. Its calls for safe legal routes, limits on detention and forced returns, and broad access to asylum generally overlap with progressive and left-wing migration platforms.',
    affiliations:
      'Works across Spain’s asylum and reception system and participates in European refugee-rights networks, legal advocacy and institutional consultations.',
    impact:
      'Its annual asylum reports, strategic litigation and public campaigns make it one of Spain’s most visible voices against restrictive border and return policies.',
    sources: [
      { label: 'CEAR · Who we are', href: 'https://www.cear.es/conocenos/' },
      { label: 'CEAR · 2026 annual report', href: 'https://www.cear.es/informes/' },
    ],
  },
  {
    id: 'red-acoge',
    title: 'Red Acoge',
    tagline: 'National migrant-support federation',
    metaLabel: 'Network',
    metaValue: '35 years · federation',
    badges: ['Inclusion', 'Legal routes', 'Regularisation', 'EU'],
    overview:
      'A federation of local organisations providing legal, social, housing and integration support while conducting national and European policy advocacy on migration and asylum.',
    leftistTies:
      'Red Acoge defines itself as an independent social-justice actor rather than a party organisation. Its citizenship, anti-racism and regularisation agenda is most closely associated with progressive civil society.',
    affiliations:
      'Coordinates member organisations across Spain and reports a mix of European, national, regional, local and private funding for its programmes.',
    impact:
      'It presses for legal and safe routes, rights regardless of administrative status, and regularisation, pairing policy campaigns with a large service-delivery network.',
    sources: [
      { label: 'Red Acoge · Who we are', href: 'https://redacoge.org/la-federacion/quienes-somos/' },
      {
        label: 'Red Acoge · Migrants’ rights manifesto',
        href: 'https://redacoge.org/manifiesto-dia-internacional-de-las-personas-migrantes/',
      },
    ],
  },
  {
    id: 'sos-racismo',
    title: 'SOS Racismo',
    tagline: 'Federation of anti-racism associations',
    metaLabel: 'Federated',
    metaValue: '1995 · autonomous chapters',
    badges: ['Anti-racism', 'CIE', 'Regularisation', 'PICUM'],
    overview:
      'A federation of autonomous territorial organisations offering legal assistance, documenting discrimination and campaigning against racism and xenophobia in Spain.',
    leftistTies:
      'Its anti-racist, anti-detention and regularisation positions place it within Spain’s activist left, although the federation is organisationally separate from parties and from similarly named groups abroad.',
    affiliations:
      'The federation identifies membership in PICUM and Migreurop and coordinates annual reporting and campaigns across its autonomous Spanish chapters.',
    impact:
      'Its casework and annual reports give it a sustained public role in arguments over migrant discrimination, detention centres, expulsions and access to status.',
    sources: [
      { label: 'SOS Racismo · Who we are', href: 'https://sosracismo.eu/quienes-somos/' },
      { label: 'SOS Racismo · Annual reports', href: 'https://sosracismo.eu/' },
    ],
  },
  {
    id: 'regularizacion-ya',
    title: 'Regularización Ya',
    tagline: 'Migrant-led anti-racist movement',
    metaLabel: 'Organised',
    metaValue: '2020 · state-wide movement',
    badges: ['ILP', 'Migrant-led', 'Anti-racism', 'Status'],
    overview:
      'A self-organised movement of migrant collectives and anti-racist organisations created to secure legal status for people already living in Spain without regular documentation.',
    leftistTies:
      'The movement explicitly uses anti-racist and social-justice language and has pressed Spain’s governing and investiture-support parties to act on its regularisation programme.',
    affiliations:
      'Built a broad coalition of migrant associations, civil-society groups and local institutional supporters around a popular legislative initiative.',
    impact:
      'It drove the public campaign for an extraordinary regularisation and presents the measure approved in 2026 as the result of six years of migrant-led organising.',
    sources: [
      { label: 'Regularización Ya · Movement', href: 'https://regularizacionya.com/' },
      {
        label: 'Regularización Ya · Popular initiative',
        href: 'https://regularizacionya.com/ilp-regularizacion/',
      },
    ],
  },
  {
    id: 'open-arms',
    title: 'Open Arms',
    tagline: 'Spanish maritime rescue NGO',
    metaLabel: 'Founded',
    metaValue: '2015 · independent NGO',
    badges: ['Sea rescue', 'Safe passage', 'Mediterranean', 'Rights'],
    overview:
      'A Spanish humanitarian organisation conducting search and rescue in the Mediterranean, humanitarian corridors and education about migration and inequality.',
    leftistTies:
      'Open Arms explicitly describes itself as independent and without political or religious affiliation. Its rescue work and criticism of deterrence policies nevertheless place it alongside progressive migration-rights campaigns in public debate.',
    affiliations:
      'Operates with maritime professionals, volunteers, donors and humanitarian partners in Spain, Italy, the Mediterranean and countries along migration routes.',
    impact:
      'Its rescues, safe-disembarkation disputes and humanitarian corridors make it a prominent counterweight to European deterrence and port-closure policies.',
    sources: [
      { label: 'Open Arms · Who we are', href: 'https://www.openarms.es/es/quienes-somos' },
      {
        label: 'Open Arms · Political independence',
        href: 'https://www.openarms.es/es/actualidad/preguntas-frecuentes',
      },
    ],
  },
];

export const SPAIN_ADVOCATES_HEADING =
  'Major leftist groups pushing for immigration and open borders in Spain';

export const SPAIN_ADVOCATES_INTRO =
  'Spain’s migration debate is shaped by refugee-aid organisations, anti-racism federations, migrant-led regularisation campaigns and maritime rescuers. They advocate wider access to asylum, safe legal routes, regularisation and stronger rights for migrants. “Open borders” is a critical shorthand rather than a position every organisation claims: several are explicitly independent and frame their work as humanitarian or rights-based. The five profiles below separate documented activity from political characterisation and reflect public records available through 2026.';

export const SPAIN_ADVOCATES_COALITION =
  'Coalition pattern: shared campaigns for regularisation and safe legal routes, legal assistance and strategic advocacy, anti-discrimination reporting, and direct humanitarian or rescue work. Relationships and funding differ by organisation; inclusion here does not imply formal membership in one coalition or party.';
