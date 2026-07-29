import type {
  PoliticsRightWingData,
  RightMetric,
  RightWingGroup,
  RightWingSource,
} from '../components/GermanyPoliticsRightWingSection';

/**
 * Italy — Politics / Right-wing.
 *
 * Electoral results and the three largest party-membership figures are recent.
 * Youth-wing figures are organization claims. CasaPound and Forza Nuova have
 * not published comparable current rolls, so their last widely cited figures
 * are retained with their original year and must not be read as 2025 totals.
 */
const ITALY_RIGHT_WING_METRICS: readonly RightMetric[] = [
  {
    title: 'GOVERNING-RIGHT SHARE — 2024 EUROPEAN ELECTION',
    value: '47.30%',
    notes:
      'Fratelli d’Italia 28.75% + Forza Italia–Noi Moderati 9.58% + Lega 8.97%; together they won 40 of Italy’s 76 European Parliament seats.',
  },
  {
    title: 'CENTRE-RIGHT SHARE — 2022 GENERAL ELECTION',
    value: '43.79%',
    notes:
      'The FdI–Lega–FI–Noi Moderati coalition received 12.30 million Chamber votes and formed the Meloni government.',
  },
  {
    title: 'CHAMBER OF DEPUTIES CONTROL',
    value: '237 / 400',
    notes:
      'The 2022 centre-right coalition won 59.25% of Chamber seats and 115 of 200 Senate seats, an absolute majority in both houses.',
  },
  {
    title: 'FRATELLI D’ITALIA — 2024 EUROPEAN RESULT',
    value: '28.75% · 24 MEPs',
    notes:
      'FdI finished first nationally, up from 6.44% and five seats in the 2019 European election.',
  },
  {
    title: 'FRATELLI D’ITALIA MEMBERSHIP',
    value: '254,000+',
    notes:
      'The party reported more than 254,000 memberships at the close of its 2024 campaign, up from 230,000 in 2023.',
  },
  {
    title: 'MAIN GOVERNING-RIGHT PARTY MEMBERSHIPS',
    value: '~504,000+',
    notes:
      'Scale indicator, not a contemporaneous total: FdI 254k+ and Forza Italia ~150k in 2024, plus Lega’s last disclosed 100k+ figure from 2020. Lega reported growth in 2024 without an absolute total.',
  },
];

const ITALY_RIGHT_WING_GROUPS: readonly RightWingGroup[] = [
  {
    rank: 1,
    group: 'Fratelli d’Italia (FdI)',
    type: 'National-conservative governing party',
    memberPopulation: '254000',
    notes: '2024 party-reported memberships; 28.75% and 24 MEPs in the 2024 European election',
  },
  {
    rank: 2,
    group: 'Forza Italia (FI)',
    type: 'Liberal-conservative governing party',
    memberPopulation: '~150000',
    notes: 'Reported 2024 membership; contested the European election with Noi Moderati at 9.58%',
  },
  {
    rank: 3,
    group: 'Lega per Salvini Premier',
    type: 'Right-populist / federalist governing party',
    memberPopulation: '100000+',
    notes: 'Last disclosed absolute figure (2020); the party reported 10%+ membership growth in 2024 without a total',
  },
  {
    rank: 4,
    group: 'Gioventù Nazionale',
    type: 'FdI youth organization',
    memberPopulation: '~50000',
    notes: 'Organization claim reported in 2025; national umbrella for members under 30',
  },
  {
    rank: 5,
    group: 'CasaPound Italia',
    type: 'Neo-fascist movement',
    memberPopulation: '~6000',
    notes: 'Last widely cited estimate is from 2017—not a current membership count',
  },
  {
    rank: 6,
    group: 'Lega Giovani',
    type: 'Lega youth organization',
    memberPopulation: '4000',
    notes: 'Current figure published by the organization; open to members aged 14–30',
  },
  {
    rank: 7,
    group: 'Forza Nuova',
    type: 'Extra-parliamentary neo-fascist party',
    memberPopulation: '~2500',
    notes: 'Last public national figure dates to 2001; retained only as a historical scale marker',
  },
  {
    rank: 8,
    group: 'Noi Moderati',
    type: 'Christian-democratic centre-right party',
    memberPopulation: 'Not disclosed',
    notes: 'Junior governing-coalition partner; ran with Forza Italia in the 2024 European election',
  },
  {
    rank: 9,
    group: 'Azione Studentesca',
    type: 'Nationalist secondary-school network',
    memberPopulation: 'Not disclosed',
    notes: 'Student organization associated with the FdI youth ecosystem; no audited national roll',
  },
  {
    rank: 10,
    group: 'Azione Universitaria',
    type: 'Conservative university network',
    memberPopulation: 'Not disclosed',
    notes: 'National university-representation network; active across major campuses',
  },
  {
    rank: 11,
    group: 'Lealtà Azione',
    type: 'Extra-parliamentary far-right network',
    memberPopulation: 'Not disclosed',
    notes: 'Lombardy-rooted activist and mutual-aid network; no reliable public national roll',
  },
  {
    rank: 12,
    group: 'Veneto Fronte Skinheads',
    type: 'Neo-Nazi skinhead organization',
    memberPopulation: 'Not disclosed',
    notes: 'Long-running north-eastern militant network; membership is not publicly documented',
  },
];

const ITALY_RIGHT_WING_SOURCES: readonly RightWingSource[] = [
  {
    label: 'European Parliament 2024 results',
    url: 'https://results.elections.europa.eu/en/national-results/italy/2024-2029/',
  },
  {
    label: 'IPU 2022 election results',
    url: 'https://data.ipu.org/parliament/IT/IT-LC01/election/IT-LC01-E20220925/',
  },
  {
    label: 'FdI 2024 membership',
    url: 'https://www.fratelli-italia.it/fdi-restare-coraggiosi-al-via-il-tesseramento-2025/',
  },
  {
    label: 'Forza Italia membership',
    url: 'https://www.ilfoglio.it/politica/2025/07/22/news/cambia-lo-statuto-evoca-il-congresso-cosi-tajani-si-blinda-e-prova-a-prendersi-fi--113526',
  },
  {
    label: 'Lega 2024 membership trend',
    url: 'https://agenparl.eu/2024/01/15/lega-salvini-tesserati-aumentati-del-10/',
  },
  {
    label: 'Lega Giovani',
    url: 'https://legagiovani.it/chi-siamo/',
  },
  {
    label: 'CasaPound research profile',
    url: 'https://www.populismstudies.org/casapound-italy-the-sui-generis-fascists-of-the-new-millennium/',
  },
  {
    label: 'Italian extreme-right organization map',
    url: 'https://dipot.ulb.ac.be/dspace/bitstream/2013/356369/3/2017_SESP.pdf',
  },
];

export const ITALY_POLITICS_RIGHT_WING: PoliticsRightWingData = {
  metrics: ITALY_RIGHT_WING_METRICS,
  groupsTitle: 'ITALIAN RIGHT-WING PARTIES & ORGANIZATIONS',
  groupsDescription:
    'Membership or activist footprint; current disclosures where available, estimates and older figures explicitly labeled',
  groups: ITALY_RIGHT_WING_GROUPS,
  sources: ITALY_RIGHT_WING_SOURCES,
};
