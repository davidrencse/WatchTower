/**
 * Italy — Government & politics.
 *
 * Like the France dataset, every figure here is a published number rather than a
 * modelled estimate. The generated `ita_government_politics.csv` that this
 * section used to read was population-scaled guesswork, so the section is now
 * driven by this hand-curated dataset instead.
 *
 * Sources, per block:
 *  · Seat counts — Camera dei Deputati (composizione dei gruppi, XIX legislatura)
 *    and Senato della Repubblica (riepilogo della composizione).
 *  · Elections — Ministero dell'Interno / official results of the 25 September
 *    2022 general election.
 *  · Trust — Eurispes, Rapporto Italia 2026 (published May 2026).
 *  · Citizenship — ISTAT "Cittadini non comunitari" / "Indicatori demografici"
 *    and Eurostat "Acquisition of citizenship".
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
  /** Change in points vs the previous survey, where published. */
  delta?: number;
  group: 'institutions' | 'political';
};

export type ElectionSection = {
  label: string;
  /** ShareBar max, so party and coalition panels can scale differently. */
  max: number;
  shares: readonly { label: string; value: number; color: string }[];
};

/* ------------------------------------------------------------------ overview */

export const ITALY_GOV_OVERVIEW: readonly GovStat[] = [
  {
    label: 'Head of state',
    value: 'Sergio Mattarella',
    sub: 'Independent · President since 3 Feb 2015, re-elected 29 Jan 2022 for a 2nd term',
  },
  {
    label: 'Head of government',
    value: 'Giorgia Meloni',
    sub: 'Fratelli d’Italia · Prime Minister since 22 October 2022',
  },
  {
    label: 'Cabinet',
    value: 'Meloni government',
    sub: '68th government of the Republic; centre-right coalition (FdI, Lega, FI, Noi Moderati)',
  },
  {
    label: 'Parliamentary base',
    value: 'Majority',
    sub: 'Centre-right holds 237 of 400 seats in the Chamber and 120 of 205 in the Senate',
  },
  {
    label: 'System',
    value: 'Parliamentary republic',
    sub: 'Constitution of 1 January 1948 — perfect bicameralism, the two houses hold equal powers',
  },
  {
    label: 'Corruption index',
    value: '53 / 100',
    sub: 'CPI 2025 — rank 52 of 180, down one point on 2024',
    accent: '#fbbf24',
  },
];

/* ---------------------------------------------------------------- parliament */

/** Standard Italian party colours, seated left → right as in the chamber. */
export const CAMERA_DEI_DEPUTATI: Chamber = {
  id: 'camera',
  title: 'Camera dei Deputati',
  subtitle: 'XIX legislature — elected 25 September 2022 (400 seats after the 2020 cut)',
  totalSeats: 400,
  majorityThreshold: 201,
  president: 'Lorenzo Fontana',
  presidentSince: 'since 2022',
  elected: '25 September 2022',
  nextElection: 'By 2027, or earlier on dissolution',
  groups: [
    { id: 'M5S', name: 'Movimento 5 Stelle', seats: 48, color: '#f6d000', bloc: 'left' },
    { id: 'AVS', name: 'Alleanza Verdi e Sinistra', seats: 10, color: '#74b74a', bloc: 'left' },
    { id: 'PD', name: 'Partito Democratico — Italia Democratica e Progressista', seats: 68, color: '#e4002b', bloc: 'left' },
    { id: 'IV', name: 'Italia Viva', seats: 7, color: '#e6007e', bloc: 'centre' },
    { id: 'AZ', name: 'Azione — Popolari Europeisti Riformatori', seats: 10, color: '#00a3c4', bloc: 'centre' },
    { id: 'Misto', name: 'Gruppo Misto', seats: 21, color: '#8a8a8a', bloc: 'other' },
    { id: 'NM', name: 'Noi Moderati (Noi Moderati–MAIE)', seats: 8, color: '#7a94a8', bloc: 'centre' },
    { id: 'FI', name: 'Forza Italia — Berlusconi Presidente — PPE', seats: 53, color: '#0a84d1', bloc: 'centre' },
    { id: 'Lega', name: 'Lega — Salvini Premier', seats: 57, color: '#1a7a3c', bloc: 'right' },
    { id: 'FdI', name: 'Fratelli d’Italia', seats: 118, color: '#17375e', bloc: 'right' },
  ],
  sourceLabel: 'Camera dei Deputati — composizione dei gruppi parlamentari',
  sourceUrl: 'https://www.camera.it/leg19/217?idlegislatura=19',
};

export const SENATO_DELLA_REPUBBLICA: Chamber = {
  id: 'senato',
  title: 'Senato della Repubblica',
  subtitle: 'XIX legislature — 200 elected senators plus 5 senators for life',
  totalSeats: 205,
  majorityThreshold: 104,
  president: 'Ignazio La Russa',
  presidentSince: 'since 2022',
  elected: '25 September 2022',
  nextElection: 'By 2027, or earlier on dissolution',
  groups: [
    { id: 'M5S', name: 'Movimento 5 Stelle', seats: 26, color: '#f6d000', bloc: 'left' },
    { id: 'PD', name: 'Partito Democratico — Italia Democratica e Progressista', seats: 36, color: '#e4002b', bloc: 'left' },
    { id: 'IV', name: 'Italia Viva — Il Centro (Renew Europe)', seats: 8, color: '#e6007e', bloc: 'centre' },
    { id: 'Aut', name: 'Per le Autonomie (SVP-PATT, Campobase)', seats: 7, color: '#b08bd6', bloc: 'other' },
    { id: 'Misto', name: 'Gruppo Misto (incl. AVS senators, senators for life)', seats: 8, color: '#8a8a8a', bloc: 'other' },
    { id: 'CdI', name: 'Civici d’Italia — Noi Moderati — MAIE (supports the majority)', seats: 8, color: '#b9975b', bloc: 'centre' },
    { id: 'FI', name: 'Forza Italia — Berlusconi Presidente — PPE', seats: 20, color: '#0a84d1', bloc: 'centre' },
    { id: 'Lega', name: 'Lega — Salvini Premier — Partito Sardo d’Azione', seats: 29, color: '#1a7a3c', bloc: 'right' },
    { id: 'FdI', name: 'Fratelli d’Italia', seats: 63, color: '#17375e', bloc: 'right' },
  ],
  sourceLabel: 'Senato della Repubblica — riepilogo della composizione',
  sourceUrl: 'https://www.senato.it/composizione/gruppi-parlamentari/riepilogo-della-composizione',
};

export const SENATE_LIFE_NOTE =
  'The five senators for life are Mario Monti, Elena Cattaneo, Renzo Piano, Carlo Rubbia and Liliana Segre; they sit mostly in the Autonomie and Mixed groups. Group figures reflect the Senate’s published composition for the XIX legislature.';

/* --------------------------------------------------------------- 2022 result */

/** 2022 general election — party list vote (Chamber) and seats won by coalition. */
export const GENERAL_ELECTION_2022: readonly ElectionSection[] = [
  {
    label: 'Party list vote — Chamber',
    max: 28,
    shares: [
      { label: 'Fratelli d’Italia', value: 26.0, color: '#17375e' },
      { label: 'Partito Democratico', value: 19.0, color: '#e4002b' },
      { label: 'Movimento 5 Stelle', value: 15.4, color: '#f6d000' },
      { label: 'Lega', value: 8.8, color: '#1a7a3c' },
      { label: 'Forza Italia', value: 8.1, color: '#0a84d1' },
      { label: 'Azione – Italia Viva', value: 7.8, color: '#00a3c4' },
      { label: 'Alleanza Verdi e Sinistra', value: 3.6, color: '#74b74a' },
      { label: '+Europa', value: 2.8, color: '#f59e0b' },
    ],
  },
  {
    label: 'Coalition vote — Chamber',
    max: 50,
    shares: [
      { label: 'Centre-right coalition', value: 43.8, color: '#17375e' },
      { label: 'Centre-left coalition', value: 26.1, color: '#e4002b' },
      { label: 'Movimento 5 Stelle', value: 15.4, color: '#f6d000' },
      { label: 'Third Pole (Azione–IV)', value: 7.8, color: '#00a3c4' },
    ],
  },
];

/** Seats won by coalition at the 2022 election (Chamber of Deputies, 400 seats). */
export const GENERAL_ELECTION_2022_SEATS: readonly { label: string; seats: number; color: string }[] = [
  { label: 'Centre-right coalition', seats: 237, color: '#17375e' },
  { label: 'Centre-left coalition', seats: 84, color: '#e4002b' },
  { label: 'Movimento 5 Stelle', seats: 52, color: '#f6d000' },
  { label: 'Third Pole (Azione–IV)', seats: 21, color: '#00a3c4' },
  { label: 'Others', seats: 6, color: '#888888' },
];

export const ELECTION_2022_TURNOUT = 63.85;

export const ELECTION_NOTE =
  'Turnout of 63.85% was the lowest at any Italian general election. A first-past-the-post tier for a third of the seats turned the centre-right’s ~44% of the vote into 59% of the Chamber, delivering Giorgia Meloni a stable majority and Italy’s first woman prime minister.';

export const ELECTION_SOURCE = {
  label: 'Ministero dell’Interno — Elezioni politiche 25 settembre 2022',
  url: 'https://elezioni.interno.gov.it/camera/scrutini/20220925/scrutiniCI',
};

/* -------------------------------------------------------------------- trust */

/** Eurispes, Rapporto Italia 2026 (share of respondents expressing trust). */
export const ITALY_TRUST: readonly TrustItem[] = [
  { label: 'Fire Brigade (Vigili del Fuoco)', value: 85.8, group: 'institutions' },
  { label: 'Civil Protection', value: 78.5, group: 'institutions' },
  { label: 'Armed Forces (Army)', value: 71.9, group: 'institutions' },
  { label: 'Carabinieri', value: 70.2, group: 'institutions' },
  { label: 'School', value: 68.0, group: 'institutions' },
  { label: 'State Police', value: 66.8, group: 'institutions' },
  { label: 'Healthcare system', value: 58.0, group: 'institutions' },
  { label: 'Church', value: 50.3, group: 'institutions' },
  { label: 'Judiciary (Magistratura)', value: 43.9, group: 'institutions' },
  { label: 'President of the Republic', value: 61.8, group: 'political' },
  { label: 'Trade unions', value: 41.6, group: 'political' },
  { label: 'Public administration', value: 35.9, group: 'political' },
  { label: 'Government', value: 32.1, group: 'political' },
  { label: 'Parliament', value: 26.1, group: 'political' },
  { label: 'Political parties', value: 25.7, group: 'political' },
];

export const ITALY_DEMOCRATIC_SENTIMENT: readonly { value: string; label: string }[] = [
  { value: '61.8%', label: 'trust the President — the only political institution above 50%' },
  { value: '32.1%', label: 'trust the government; 26.1% trust Parliament' },
  { value: '25.7%', label: 'trust political parties — near a record low' },
  { value: '63.85%', label: 'turnout at the 2022 general election, the lowest ever' },
  { value: '30.6%', label: 'turnout at the June 2025 citizenship referendum — void below quorum' },
  { value: '53.2%', label: 'voted No to the judicial-careers reform, March 2026' },
];

export const TRUST_SOURCE = {
  label: 'Eurispes — Rapporto Italia 2026 (May 2026)',
  url: 'https://eurispes.eu/',
};
