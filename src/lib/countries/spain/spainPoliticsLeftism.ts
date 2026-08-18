import type {
  CancelCultureRow,
  LeftStatCard,
  LeftistGroup,
  PoliticsLeftismData,
} from '../../../components/countries/germany/GermanyPoliticsLeftismSection';

const EP_2024_SOURCE = 'https://results.elections.europa.eu/en/national-results/spain/2024-2029/';
const GENERAL_2023_SOURCE = 'https://www.boe.es/buscar/doc.php?id=BOE-A-2023-18907';
const CIS_MARCH_2026_SOURCE = 'https://www.cis.es/documents/d/guest/es3546creenciasMT_a-pdf';
const EUROPOL_TE_SAT_SOURCE =
  'https://www.europol.europa.eu/publication-events/main-reports/european-union-terrorism-situation-and-trend-report-2025-eu-te-sat';

const SPAIN_STAT_CARDS: readonly LeftStatCard[] = [
  {
    title: 'PSOE vote share',
    value: '30.19%',
    subtitle: '2024 European election — 20 of Spain\'s 61 seats — S&D. Second place, two seats behind PP',
    sources: [{ label: 'Source: European Parliament — final national results', href: EP_2024_SOURCE }],
  },
  {
    title: 'Socialist-list seats in the Congreso',
    value: '121 of 350',
    subtitle: '2023 election: PSOE 102 + PSC–PSOE 19. Governs in minority coalition with Sumar',
    sources: [{ label: 'Source: BOE / Junta Electoral Central — definitive result', href: GENERAL_2023_SOURCE }],
  },
  {
    title: 'Sumar vote share',
    value: '4.67%',
    subtitle: '2024 European election — 3 seats. The 2023 Sumar coalition won 31 Congreso seats',
    sources: [{ label: 'Source: European Parliament — final national results', href: EP_2024_SOURCE }],
  },
  {
    title: 'Ahora Repúblicas vote share',
    value: '4.91%',
    subtitle: '2024 European election — 3 seats. Left-republican alliance of ERC, Bildu and BNG',
    sources: [{ label: 'Source: European Parliament — final national results', href: EP_2024_SOURCE }],
  },
  {
    title: 'Podemos vote share',
    value: '3.30%',
    subtitle: '2024 European election — 2 seats after running separately from Sumar',
    sources: [{ label: 'Source: European Parliament — final national results', href: EP_2024_SOURCE }],
  },
  {
    title: 'Left / centre-left EP vote',
    value: '43.07%',
    subtitle: 'Derived sum of PSOE, Ahora Repúblicas, Sumar and Podemos; 28 of 61 Spanish MEPs',
    sources: [{ label: 'Source: European Parliament — final national results', href: EP_2024_SOURCE }],
  },
  {
    title: 'Adult left self-placement',
    value: '42.4%',
    subtitle: 'CIS March 2026; positions 1–4 on the 1–10 ideology scale, derived from the published cell totals',
    sources: [{ label: 'Source: CIS study 3546 cross-tabs', href: CIS_MARCH_2026_SOURCE }],
  },
  {
    title: 'Coalition investiture mandate',
    value: '179 votes',
    subtitle: 'Pedro Sánchez was invested 179–171 in November 2023 with PSOE, Sumar and regional-party support',
    sources: [
      {
        label: 'Source: Congress of Deputies — investiture sessions',
        href: 'https://www.congreso.es/es/cem/sesiones-de-investidura',
      },
    ],
  },
];

const SPAIN_EXTREMISM_ROWS: readonly CancelCultureRow[] = [
  {
    category: 'EU terrorist attacks in 2024',
    value: '58 total across 14 Member States',
  },
  {
    category: 'EU left-wing & anarchist attacks in 2024',
    value: '21 — an EU-wide figure, not a Spanish party statistic',
  },
  {
    category: 'Spain-only left-wing attack count',
    value: 'Not isolated in Europol’s public executive summary',
  },
];

const SPAIN_ELECTORAL_LISTS: readonly LeftistGroup[] = [
  {
    rank: 1,
    group: 'PSOE (Partido Socialista Obrero Español)',
    type: 'Social democratic / S&D',
    memberPopulation: '30.19%',
    notes: '20 MEPs in 2024; 122 Congreso seats in 2023 and leads the governing coalition',
  },
  {
    rank: 2,
    group: 'Ahora Repúblicas (ERC · EH Bildu · BNG)',
    type: 'Left-republican / pro-independence alliance',
    memberPopulation: '4.91%',
    notes: '3 MEPs. Peripheral-nationalist left; supplies the government\'s parliamentary majority',
  },
  {
    rank: 3,
    group: 'Sumar',
    type: 'Broad left coalition / The Left & Greens',
    memberPopulation: '4.67%',
    notes: '3 MEPs. Yolanda Díaz\'s platform; the junior partner in the coalition government',
  },
  {
    rank: 4,
    group: 'Podemos',
    type: 'Left-populist / The Left',
    memberPopulation: '3.27%',
    notes: 'Ran separately from Sumar in 2024 after the split; 2 MEPs. Anti-NATO wing of the Spanish left',
  },
  {
    rank: 5,
    group: 'Izquierda Unida / PCE',
    type: 'Communist-led federation',
    memberPopulation: 'Within Sumar',
    notes: 'Contests elections inside Sumar; retains its own organisation and the PCE\'s structures',
  },
  {
    rank: 6,
    group: 'CCOO',
    type: 'Trade union confederation',
    memberPopulation: 'No audited public roll',
    notes: 'Largest trade-union confederation by its own reporting; founded in the clandestine communist labour movement under Franco',
  },
  {
    rank: 7,
    group: 'UGT',
    type: 'Trade union confederation',
    memberPopulation: 'No audited public roll',
    notes: 'Founded 1888 alongside the PSOE and still closely aligned with it',
  },
  {
    rank: 8,
    group: 'CGT / CNT',
    type: 'Anarcho-syndicalist unions',
    memberPopulation: 'No audited public roll',
    notes: 'Europe\'s largest surviving anarcho-syndicalist tradition; CNT led the 1936 collectivisations',
  },
];

export const SPAIN_POLITICS_LEFTISM: PoliticsLeftismData = {
  statCards: SPAIN_STAT_CARDS,
  cancelCultureTitle: 'Terrorism context — Europol classification',
  cancelCultureRows: SPAIN_EXTREMISM_ROWS,
  cancelCultureSource: {
    label: 'Source: Europol EU TE-SAT',
    href: EUROPOL_TE_SAT_SOURCE,
  },
  groupsTitle: 'LEFT / CENTRE-LEFT PARTIES & ORGANISATIONS',
  groupsDescription:
    'Vote shares are definitive 2024 European-election results. Unions publish activity and affiliation claims but no independently audited membership roll, so this table does not invent one.',
  groupsSource: {
    label: 'Source: European Parliament — Spain final national results',
    href: EP_2024_SOURCE,
  },
  groups: SPAIN_ELECTORAL_LISTS,
};

export const SPAIN_POLITICS_LEFTISM_GROUP_COUNT = SPAIN_STAT_CARDS.length + 2;
