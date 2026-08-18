import type {
  PoliticsRightWingData,
  RightMetric,
  RightWingGroup,
  RightWingSource,
} from '../../../components/countries/germany/GermanyPoliticsRightWingSection';

const SPAIN_RIGHT_WING_METRICS: readonly RightMetric[] = [
  {
    title: 'PP vote share (2024 European election)',
    value: '34.21%',
    notes:
      '22 of Spain\'s 61 seats and first place — up roughly 14 points and 9 seats on 2019. EPP group.',
  },
  {
    title: 'PP seats in the Congreso',
    value: '137 of 350',
    notes:
      'Largest party at the 2023 general election on 33.1%, but short of a majority even with Vox, so it did not form a government.',
  },
  {
    title: 'Vox vote share (2024 European election)',
    value: '9.63%',
    notes: '6 seats. Founding member of the Patriots for Europe group formed in July 2024.',
  },
  {
    title: 'Vox seats in the Congreso',
    value: '33 of 350',
    notes:
      '12.4% in 2023 — down from the 52 seats and 15.1% it won in November 2019, its high-water mark.',
  },
  {
    title: 'Se Acabó La Fiesta (SALF)',
    value: '4.58%',
    notes:
      '3 seats at its first outing in 2024. Anti-establishment list built by agitator Alvise Pérez almost entirely through Telegram.',
  },
  {
    title: 'Adult right self-placement',
    value: '31.1%',
    notes: 'CIS March 2026; positions 6–10 on the 1–10 ideology scale, derived from published cell totals.',
  },
  {
    title: 'Right self-placement by sex',
    value: '32.4% men · 29.9% women',
    notes: 'CIS March 2026, reconstructed from the published ideology-cell totals and sex composition.',
  },
  {
    title: 'Far-right terror disruption',
    value: '3 arrests',
    notes:
      'Europol-supported operation against a suspected cell of The Base in Madrid and Valencia, 25 November 2025.',
  },
];

const SPAIN_RIGHT_WING_GROUPS: readonly RightWingGroup[] = [
  {
    rank: 1,
    group: 'Partido Popular (PP)',
    type: 'Mainstream centre-right party',
    memberPopulation: '137 Congreso seats',
    notes: 'Largest party in the Congreso and first in the 2024 European election; EPP group',
  },
  {
    rank: 2,
    group: 'Vox',
    type: 'National-conservative party',
    memberPopulation: '33 Congreso seats',
    notes: 'Third force nationally; founding member of Patriots for Europe',
  },
  {
    rank: 3,
    group: 'Se Acabó La Fiesta (SALF)',
    type: 'Anti-establishment electoral list',
    memberPopulation: '3 MEPs elected in 2024',
    notes: '4.59% and 3 MEPs in 2024, organised through Telegram rather than a party apparatus',
  },
  {
    rank: 4,
    group: 'Revuelta',
    type: 'Youth organisation (Vox-aligned)',
    memberPopulation: 'No audited public roll',
    notes: 'Vox\'s youth wing; campus and street mobilisation',
  },
  {
    rank: 5,
    group: 'Falange Española de las JONS',
    type: 'Historic falangist party',
    memberPopulation: 'No audited public roll',
    notes: 'Contests elections with negligible vote; retains commemorative and symbolic activity',
  },
  {
    rank: 6,
    group: 'Democracia Nacional',
    type: 'Ultranationalist party',
    memberPopulation: 'No audited public roll',
    notes: 'Marginal electoral presence; street activity',
  },
  {
    rank: 7,
    group: 'Hogar Social Madrid',
    type: 'Identitarian social-activism group',
    memberPopulation: 'No audited public roll',
    notes: 'Building occupations and "Spaniards-first" food distribution; largely dormant since 2020',
  },
  {
    rank: 8,
    group: 'Núcleo Nacional',
    type: 'Neo-fascist youth network',
    memberPopulation: 'No audited public roll',
    notes: 'Emerged 2023; the group most visible in the July 2025 Torre Pacheco disturbances',
  },
  {
    rank: 9,
    group: 'Fundación Francisco Franco',
    type: 'Historical-revisionist foundation',
    memberPopulation: 'Not disclosed',
    notes: 'Defends the Franco legacy; targeted by the 2022 Ley de Memoria Democrática',
  },
];

const SPAIN_RIGHT_WING_SOURCES: readonly RightWingSource[] = [
  {
    label: 'European Parliament — Spain 2024 national results',
    url: 'https://results.elections.europa.eu/en/national-results/spain/2024-2029/',
  },
  {
    label: 'BOE / Junta Electoral Central — 2024 European election',
    url: 'https://www.boe.es/boe/dias/2024/06/28/pdfs/BOE-A-2024-13092.pdf',
  },
  {
    label: 'BOE / Junta Electoral Central — 2023 general election',
    url: 'https://www.boe.es/buscar/doc.php?id=BOE-A-2023-18907',
  },
  {
    label: 'CIS study 3546 — March 2026 ideology cross-tabs',
    url: 'https://www.cis.es/documents/d/guest/es3546creenciasMT_a-pdf',
  },
  {
    label: 'Europol — disruption of The Base cell in Spain',
    url: 'https://www.europol.europa.eu/media-press/newsroom/news/europol-and-spanish-national-police-disrupt-activities-of-far-right-terrorist-group-base',
  },
];

export const SPAIN_POLITICS_RIGHT_WING: PoliticsRightWingData = {
  metrics: SPAIN_RIGHT_WING_METRICS,
  groupsTitle: 'SPANISH RIGHT-WING PARTIES & ORGANISATIONS',
  groupsDescription:
    'Vote shares and seat counts are official election results. Extra-parliamentary organisations have no independently audited public rolls; the table labels that absence instead of presenting guessed sizes.',
  groups: SPAIN_RIGHT_WING_GROUPS,
  sources: SPAIN_RIGHT_WING_SOURCES,
};

export const SPAIN_POLITICS_RIGHT_WING_GROUP_COUNT = SPAIN_RIGHT_WING_METRICS.length + 1;
