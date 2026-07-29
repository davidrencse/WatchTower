import type {
  CancelCultureRow,
  LeftStatCard,
  LeftistGroup,
  PoliticsLeftismData,
} from '../components/GermanyPoliticsLeftismSection';

const EUROPEAN_ELECTION_SOURCE =
  'https://results.elections.europa.eu/en/national-results/italy/2024-2029/';
const IPSOS_PRIDE_2026_SOURCE =
  'https://www.ipsos.com/it-it/pride-opinioni-tendenze-diritti-lgbt-italia-mondo';
const EUROPOL_TE_SAT_2026_SOURCE =
  'https://www.europol.europa.eu/publication-events/main-reports/european-union-terrorism-situation-and-trend-report-2026-eu-te-sat';

const ITALY_STAT_CARDS: readonly LeftStatCard[] = [
  {
    title: 'Democratic Party (PD) vote share',
    value: '24.11%',
    subtitle: "2024 European election - 21 of Italy's 76 seats - S&D",
    sources: [
      {
        label: 'Source: European Parliament - final national results',
        href: EUROPEAN_ELECTION_SOURCE,
      },
    ],
  },
  {
    title: 'Five Star Movement (M5S) vote share',
    value: '9.98%',
    subtitle: '2024 European election - 8 seats; permanently joined The Left in February 2025',
    sources: [
      {
        label: 'Source: European Parliament - final national results',
        href: EUROPEAN_ELECTION_SOURCE,
      },
      {
        label: 'Source: The Left - permanent integration',
        href: 'https://left.eu/movimento-5-stelle-permanently-integrated-into-the-left-in-the-european-parliament/',
      },
    ],
  },
  {
    title: 'Greens and Left Alliance (AVS) vote share',
    value: '6.79%',
    subtitle: '2024 European election - 6 seats across Greens/EFA and The Left',
    sources: [
      {
        label: 'Source: European Parliament - final national results',
        href: EUROPEAN_ELECTION_SOURCE,
      },
    ],
  },
  {
    title: 'CGIL trade-union membership',
    value: '5,172,844',
    subtitle: 'Year-end 2024 - +22,959 members (+0.45%) from 2023',
    sources: [
      {
        label: 'Source: CGIL - 2024 final accounts, p. 5',
        href: 'https://files.cgil.it/version/c%3AZTZkYzYwMWItNzM3OS00%3AMWExZTgwMTMtOWQ0My00/Bilancio_Consuntivo_2024_CGIL_Nazionale.pdf',
      },
    ],
  },
  {
    title: 'Support for legal same-sex marriage',
    value: '60%',
    subtitle: 'Italian adults under 75 - fieldwork 24 April-8 May 2026',
    sources: [
      {
        label: 'Source: Ipsos LGBT+ Pride 2026',
        href: IPSOS_PRIDE_2026_SOURCE,
      },
    ],
  },
  {
    title: 'Support for brands promoting LGBT equality',
    value: '51%',
    subtitle: 'Italy, 2026 - 10 points lower than in 2021',
    sources: [
      {
        label: 'Source: Ipsos LGBT+ Pride 2026',
        href: IPSOS_PRIDE_2026_SOURCE,
      },
    ],
  },
];

const ITALY_EXTREMISM_ROWS: readonly CancelCultureRow[] = [
  {
    category: 'Attacks reported by Italy in 2025',
    value: '11 (10 completed, 1 failed)',
  },
  {
    category: 'EU left-wing and anarchist total in 2025',
    value: '12',
  },
  {
    category: 'Victims reported from those 12 EU attacks',
    value: '0',
  },
];

const ITALY_ELECTORAL_LISTS: readonly LeftistGroup[] = [
  {
    rank: 1,
    group: 'Partito Democratico (PD)',
    type: 'Centre-left / S&D',
    memberPopulation: '24.11%',
    notes: "21 MEPs elected in Italy's 2024 European election",
  },
  {
    rank: 2,
    group: 'Movimento 5 Stelle (M5S)',
    type: 'Progressive-populist / The Left',
    memberPopulation: '9.98%',
    notes: '8 MEPs; permanently integrated into The Left group in February 2025',
  },
  {
    rank: 3,
    group: 'Alleanza Verdi e Sinistra (AVS)',
    type: 'Green-left alliance',
    memberPopulation: '6.79%',
    notes: '6 MEPs across Greens/EFA and The Left',
  },
  {
    rank: 4,
    group: 'Pace Terra Dignit\u00e0',
    type: 'Radical-left electoral coalition',
    memberPopulation: '2.21%',
    notes: 'Included Communist Refoundation; won no seat',
  },
];

export const ITALY_POLITICS_LEFTISM: PoliticsLeftismData = {
  statCards: ITALY_STAT_CARDS,
  cancelCultureTitle: 'Left-wing & anarchist terrorism - Europol classification',
  cancelCultureRows: ITALY_EXTREMISM_ROWS,
  cancelCultureSource: {
    label: 'Source: Europol EU TE-SAT 2026 (2025 activity)',
    href: EUROPOL_TE_SAT_2026_SOURCE,
  },
  groupsTitle: 'LEFT / CENTRE-LEFT ELECTORAL LISTS',
  groupsDescription:
    "Italy's 2024 European-election vote shares; labels follow current European-group affiliation",
  groupsSource: {
    label: 'Source: European Parliament - Italy final national results',
    href: EUROPEAN_ELECTION_SOURCE,
  },
  groups: ITALY_ELECTORAL_LISTS,
};
