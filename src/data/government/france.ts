/**
 * France — Government & politics.
 *
 * Every figure here is a published number, not a modelled estimate. The
 * generated `fra_government_politics.csv` that this section used to read was
 * largely population-scaled guesswork (it put annual naturalisations at 22,000
 * against a real 103,661 in 2024), so the section is now driven by this
 * hand-curated dataset instead.
 *
 * Sources, per block:
 *  · Seat counts — assemblee-nationale.fr group effectifs (17th legislature) and
 *    senat.fr group composition.
 *  · Trust — CEVIPOF / OpinionWay Baromètre de la confiance politique, wave 17
 *    (published 9 February 2026).
 *  · Elections — Ministère de l'Intérieur results for the 2024 legislative
 *    elections.
 *  · Citizenship — INSEE "Acquisitions de la nationalité française" and DGEF.
 *  · Corruption — Transparency International CPI 2025.
 */

export type GovStat = {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
};

export type ChamberGroup = {
  /** Short group label as used in the chamber. */
  id: string;
  name: string;
  seats: number;
  color: string;
  /** Left-to-right seating position in the hemicycle. */
  bloc: 'left' | 'centre' | 'right' | 'other';
  note?: string;
};

export type Chamber = {
  id: string;
  title: string;
  subtitle: string;
  totalSeats: number;
  majorityThreshold?: number;
  president: string;
  presidentSince: string;
  elected: string;
  nextElection: string;
  groups: readonly ChamberGroup[];
  sourceLabel: string;
  sourceUrl: string;
};

export type TrustItem = {
  label: string;
  value: number;
  /** Change in points vs the previous wave, where published. */
  delta?: number;
  group: 'institutions' | 'political';
};

export type ElectionRound = {
  label: string;
  turnout: number;
  shares: readonly { label: string; value: number; color: string }[];
};

export type PolicyItem = {
  id: string;
  title: string;
  date: string;
  status: 'in force' | 'partly struck down' | 'suspended' | 'pending review' | 'adopted';
  summary: string;
  detail: string;
  sourceLabel: string;
  sourceUrl: string;
};

export type CitizenshipYear = {
  year: number;
  total: number;
  /** Naturalisation par décret. */
  decree: number;
  /** Déclaration à raison du mariage. */
  marriage: number;
  /** Other declarations (art. 21-12 etc.). */
  otherDeclaration: number;
  /**
   * Anticipated declarations by minors born in France plus acquisitions without
   * formality — derived as the residual of the published total.
   */
  byBirthResidual: number;
};

/* ------------------------------------------------------------------ overview */

export const FRANCE_GOV_OVERVIEW: readonly GovStat[] = [
  { label: 'Head of state', value: 'Emmanuel Macron', sub: 'Renaissance · President since 14 May 2017, 2nd term ends May 2027' },
  { label: 'Head of government', value: 'Sébastien Lecornu', sub: 'Renaissance · PM since 9 Sept 2025, reappointed 10 Oct 2025' },
  { label: 'Cabinet', value: 'Lecornu II', sub: '48th government of the Fifth Republic; reshuffled 26 Feb 2026' },
  { label: 'Parliamentary base', value: 'Minority', sub: 'Hung Assembly since July 2024 — no bloc near the 289-seat majority' },
  { label: 'System', value: 'Semi-presidential', sub: 'Fifth Republic, constitution of 4 October 1958' },
  { label: 'Corruption index', value: '66 / 100', sub: 'CPI 2025 — rank 27 of 180', accent: '#fbbf24' },
];

/* ---------------------------------------------------------------- parliament */

/** Standard French party colours, seated left → right as in the chamber. */
export const ASSEMBLEE_NATIONALE: Chamber = {
  id: 'assemblee',
  title: 'Assemblée nationale',
  subtitle: '17th legislature — elected 30 June & 7 July 2024',
  totalSeats: 577,
  majorityThreshold: 289,
  president: 'Yaël Braun-Pivet',
  presidentSince: 'since 2022',
  elected: 'June–July 2024 (snap election after dissolution)',
  nextElection: 'By June 2027, or earlier on dissolution',
  groups: [
    { id: 'LFI-NFP', name: 'La France insoumise', seats: 71, color: '#cc2443', bloc: 'left' },
    { id: 'GDR', name: 'Gauche Démocrate et Républicaine', seats: 17, color: '#dd0000', bloc: 'left' },
    { id: 'ÉCOS', name: 'Écologiste et Social', seats: 38, color: '#00c000', bloc: 'left' },
    { id: 'SOC', name: 'Socialistes et apparentés', seats: 68, color: '#ff8080', bloc: 'left' },
    { id: 'LIOT', name: 'Libertés, Indépendants, Outre-mer et Territoires', seats: 23, color: '#b0b0b0', bloc: 'other' },
    { id: 'DEM', name: 'Les Démocrates (MoDem)', seats: 37, color: '#ff9900', bloc: 'centre' },
    { id: 'EPR', name: 'Ensemble pour la République', seats: 91, color: '#ffeb00', bloc: 'centre' },
    { id: 'HOR', name: 'Horizons & Indépendants', seats: 35, color: '#00b0f0', bloc: 'centre' },
    { id: 'DR', name: 'Droite Républicaine (LR)', seats: 48, color: '#0066cc', bloc: 'right' },
    { id: 'UDR', name: 'Union des droites pour la République', seats: 17, color: '#1d1d6b', bloc: 'right' },
    { id: 'RN', name: 'Rassemblement National', seats: 122, color: '#003366', bloc: 'right' },
    { id: 'NI', name: 'Non inscrits', seats: 10, color: '#777777', bloc: 'other' },
  ],
  sourceLabel: 'Assemblée nationale — effectifs des groupes',
  sourceUrl: 'https://www2.assemblee-nationale.fr/instances/liste/groupes_politiques/effectif',
};

export const SENAT: Chamber = {
  id: 'senat',
  title: 'Sénat',
  subtitle: 'Indirectly elected; renewed by halves every three years',
  totalSeats: 348,
  president: 'Gérard Larcher',
  presidentSince: 'since 2014',
  elected: 'Last renewal 24 September 2023',
  nextElection: 'September 2026 (partial renewal)',
  groups: [
    { id: 'CRCE-K', name: 'Communiste, Républicain, Citoyen et Écologiste', seats: 18, color: '#dd0000', bloc: 'left' },
    { id: 'SER', name: 'Socialiste, Écologiste et Républicain', seats: 65, color: '#ff8080', bloc: 'left' },
    { id: 'GEST', name: 'Écologiste — Solidarité et Territoires', seats: 16, color: '#00c000', bloc: 'left' },
    { id: 'RDSE', name: 'Rassemblement Démocratique et Social Européen', seats: 17, color: '#cccc44', bloc: 'centre' },
    { id: 'RDPI', name: 'Rassemblement des démocrates, progressistes et indépendants', seats: 19, color: '#ffeb00', bloc: 'centre' },
    { id: 'UC', name: 'Union Centriste', seats: 59, color: '#ff9900', bloc: 'centre' },
    { id: 'LIRT', name: 'Les Indépendants — République et Territoires', seats: 20, color: '#00b0f0', bloc: 'centre' },
    { id: 'LR', name: 'Les Républicains', seats: 130, color: '#0066cc', bloc: 'right' },
    { id: 'RASNAG', name: 'Réunion administrative des sénateurs non inscrits', seats: 4, color: '#777777', bloc: 'other' },
  ],
  sourceLabel: 'Sénat — groupes politiques',
  sourceUrl: 'https://www.senat.fr/',
};

/* --------------------------------------------------------------- 2024 result */

export const LEGISLATIVE_2024: readonly ElectionRound[] = [
  {
    label: 'First round — 30 June 2024',
    turnout: 66.71,
    shares: [
      { label: 'RN & allies', value: 33.21, color: '#003366' },
      { label: 'Nouveau Front Populaire', value: 28.21, color: '#cc2443' },
      { label: 'Ensemble', value: 21.28, color: '#ffeb00' },
      { label: 'Les Républicains', value: 6.57, color: '#0066cc' },
    ],
  },
  {
    label: 'Second round — 7 July 2024',
    turnout: 66.63,
    shares: [
      { label: 'RN & allies', value: 37.06, color: '#003366' },
      { label: 'Nouveau Front Populaire', value: 25.8, color: '#cc2443' },
      { label: 'Ensemble', value: 24.53, color: '#ffeb00' },
      { label: 'Les Républicains', value: 5.41, color: '#0066cc' },
    ],
  },
];

/** Seats won by bloc at the 2024 election (Interior Ministry classification). */
export const LEGISLATIVE_2024_SEATS: readonly { label: string; seats: number; color: string }[] = [
  { label: 'Nouveau Front Populaire', seats: 180, color: '#cc2443' },
  { label: 'Ensemble', seats: 159, color: '#ffeb00' },
  { label: 'RN & allies', seats: 142, color: '#003366' },
  { label: 'Les Républicains', seats: 39, color: '#0066cc' },
  { label: 'Others', seats: 57, color: '#888888' },
];

export const ELECTION_NOTE =
  'Turnout was the highest at a legislative election since 1997. The "front républicain" — reciprocal withdrawals between NFP and Ensemble in three-way runoffs — held the RN to third place in seats despite leading both rounds on votes.';

/* -------------------------------------------------------------------- trust */

/** CEVIPOF / OpinionWay Baromètre de la confiance politique, wave 17 (Feb 2026). */
export const FRANCE_TRUST: readonly TrustItem[] = [
  { label: 'Hospitals', value: 79, group: 'institutions' },
  { label: 'Gendarmerie', value: 77, group: 'institutions' },
  { label: 'Armed forces', value: 75, group: 'institutions' },
  { label: 'Police', value: 73, group: 'institutions' },
  { label: 'Social Security', value: 68, group: 'institutions' },
  { label: 'Mayors', value: 60, group: 'institutions' },
  { label: 'Trade unions', value: 37, group: 'institutions' },
  { label: 'Media', value: 29, group: 'institutions' },
  { label: 'Politics (overall)', value: 22, delta: -4, group: 'political' },
  { label: 'National Assembly', value: 20, delta: -4, group: 'political' },
  { label: 'President of the Republic', value: 18, delta: -5, group: 'political' },
  { label: 'Political parties', value: 15, group: 'political' },
];

export const FRANCE_DEMOCRATIC_SENTIMENT: readonly { value: string; label: string }[] = [
  { value: '88%', label: 'say elected officials who fail face no consequences' },
  { value: '82%', label: 'remain attached to democratic government' },
  { value: '80%', label: 'say the government "navigates blindly"' },
  { value: '79%', label: 'want referendums held more often' },
  { value: '51%', label: 'are not proud of the French democratic system' },
  { value: '22%', label: 'trust politics at all — an all-time low' },
];

export const TRUST_SOURCE = {
  label: 'CEVIPOF / OpinionWay — Baromètre de la confiance politique, vague 17 (9 Feb 2026)',
  url: 'https://www.sciencespo.fr/cevipof/fr/actualites/barometre-de-la-confiance-politique-cevipof-2026-la-confiance-s-effondre-en-politique-la-proximite-fait-figure-de-refuge/',
};

/* ----------------------------------------------------------------- policies */

export const FRANCE_POLICIES: readonly PolicyItem[] = [
  {
    id: 'loi-immigration-2024',
    title: 'Loi immigration — "contrôler l’immigration, améliorer l’intégration"',
    date: '26 January 2024',
    status: 'partly struck down',
    summary: 'The Conseil constitutionnel struck down 35 of the law’s 86 articles the day before promulgation.',
    detail:
      'Passed in December 2023 after a hard-right rewrite in the Senate, the law was referred to the Conseil constitutionnel by President Macron and Assembly President Braun-Pivet. On 25 January 2024 the Council censured 35 of 86 articles — mostly the additions demanded by Les Républicains, including migration quotas, restrictions on family reunification and the delayed access of foreigners to welfare — largely as "cavaliers législatifs" unrelated to the bill. What survived is the government’s original core: streamlined expulsion of foreign offenders and regularisation of undocumented workers in shortage occupations.',
    sourceLabel: 'LCP — Assemblée nationale',
    sourceUrl: 'https://lcp.fr/actualites/loi-immigration-le-conseil-constitutionnel-censure-largement-le-texte-vote-en-fin-d',
  },
  {
    id: 'ivg-constitution',
    title: 'Abortion written into the Constitution',
    date: '4 March 2024',
    status: 'in force',
    summary: 'France became the first country in the world to constitutionalise the freedom to have an abortion.',
    detail:
      'Parliament met in Congress at Versailles and adopted the constitutional revision by 780 votes to 72 — far beyond the three-fifths threshold of 512. Article 34 of the Constitution now provides that the law determines the conditions in which the "liberté garantie" of women to have recourse to abortion is exercised.',
    sourceLabel: 'LCP — Assemblée nationale',
    sourceUrl: 'https://lcp.fr/actualites/apres-le-vote-du-congres-la-france-devient-le-premier-pays-au-monde-a-inscrire-l-ivg',
  },
  {
    id: 'retraites-suspension',
    title: 'Pension reform suspended',
    date: 'October 2025',
    status: 'suspended',
    summary: 'The 2023 rise in the retirement age from 62 to 64 is frozen until the 2027 presidential election.',
    detail:
      'Suspending Macron’s flagship 2023 reform was the Socialists’ condition for not bringing down the Lecornu government in the autumn 2025 no-confidence votes. The freeze is costed at €400 million in 2026 and €1.8 billion in 2027, to be offset by savings elsewhere in the budget.',
    sourceLabel: 'BBC News',
    sourceUrl: 'https://www.bbc.com/news/articles/crkldd02xg8o',
  },
  {
    id: 'budget-2026',
    title: '2026 budget forced through under Article 49.3',
    date: 'Adopted early 2026',
    status: 'in force',
    summary: 'Lecornu abandoned his pledge not to use 49.3 and engaged the government’s responsibility to pass the budget.',
    detail:
      'Having promised on taking office to govern without Article 49.3 — the clause that adopts a text without a vote unless the government is censured — Lecornu reversed course to get a slimmed-down 2026 budget through the hung Assembly. The government survived the resulting censure motions. A limited reshuffle followed on 26 February 2026, before the March municipal elections.',
    sourceLabel: 'franceinfo',
    sourceUrl: 'https://www.franceinfo.fr/politique/gouvernement-de-sebastien-lecornu/recit-on-savait-que-ca-finirait-comme-ca-comment-sebastien-lecornu-s-est-resolu-a-utiliser-le-49-3-avec-regret-et-amertume-pour-le-budget-2026_7751371.html',
  },
  {
    id: 'aide-a-mourir',
    title: 'Right to assisted dying',
    date: '15 July 2026',
    status: 'pending review',
    summary: 'Adopted on the Assembly’s final word after the Senate rejected it three times; now before the Conseil constitutionnel.',
    detail:
      'Tabled in April 2025 alongside a companion bill on palliative care, the aide à mourir bill was passed by the Assemblée nationale in May 2025, February 2026 and June 2026, and rejected by the Sénat in January, May and July 2026. A joint committee failed to agree on 2 June 2026 and the Senate carried a question préalable on 7 July, so the government gave the Assembly the last word in a solemn vote on 15 July 2026. The Prime Minister has said he will refer the text to the Conseil constitutionnel before promulgation.',
    sourceLabel: 'Sénat — dossier législatif',
    sourceUrl: 'https://www.senat.fr/dossier-legislatif/ppl24-661.html',
  },
];

/* -------------------------------------------------------------- citizenship */

/**
 * INSEE, "Acquisitions de la nationalité française". `byBirthResidual` is the
 * published total minus the three itemised routes — overwhelmingly anticipated
 * declarations by minors born in France.
 */
export const FRANCE_CITIZENSHIP_YEARS: readonly CitizenshipYear[] = [
  { year: 2021, total: 128560, decree: 75249, marriage: 17280, otherDeclaration: 2910, byBirthResidual: 33121 },
  { year: 2022, total: 114483, decree: 60556, marriage: 16465, otherDeclaration: 2926, byBirthResidual: 34536 },
  { year: 2023, total: 97288, decree: 40064, marriage: 19455, otherDeclaration: 3117, byBirthResidual: 34652 },
  { year: 2024, total: 103661, decree: 48829, marriage: 15910, otherDeclaration: 3043, byBirthResidual: 35879 },
];

/** 2025 total published 9 July 2026; the route breakdown is not yet released. */
export const FRANCE_CITIZENSHIP_2025_TOTAL = 98139;

export const FRANCE_CITIZENSHIP_ORIGINS: readonly { country: string; count: number; change: number }[] = [
  { country: 'Morocco', count: 14454, change: 8.7 },
  { country: 'Algeria', count: 12002, change: 5.2 },
  { country: 'Tunisia', count: 7250, change: 13.9 },
];

export const CITIZENSHIP_NOTE =
  'The three Maghreb countries together accounted for 33,706 new French citizens in 2024 — close to a third of all acquisitions. Roughly 28% of Moroccan and Algerian acquisitions came through anticipated declarations by minors born in France, against 27.5% for Tunisians.';

export const CITIZENSHIP_SOURCES: readonly { label: string; url: string }[] = [
  { label: 'INSEE — Acquisitions de la nationalité française', url: 'https://www.insee.fr/fr/statistiques/2381644' },
  { label: 'data.gouv.fr — Accès à la nationalité française', url: 'https://www.data.gouv.fr/datasets/acces-a-la-nationalite-francaise-publication-27-juin-2024' },
];
