/**
 * Representative mixed-movement corridors into the United Kingdom. Channel routes retain
 * their documented first-EU-entry and onward transit countries; the authorized route is a
 * separate UNHCR-linked resettlement example. These are schematic evidence paths, not
 * turn-by-turn instructions or claims that every journey follows the same itinerary.
 */

import type {
  MigrationCorridor,
  MigrationCorridorSource,
} from './migrationCorridors';
import { P, PATH, joinPaths } from './migrationCorridorPaths';

const UK_ILLEGAL_ENTRY_STATS: MigrationCorridorSource = {
  organization: 'UK Home Office',
  title: 'Illegal entry routes to the UK, year ending December 2025',
  url: 'https://www.gov.uk/government/statistics/immigration-system-statistics-year-ending-december-2025/how-many-people-come-to-the-uk-via-illegal-entry-routes',
};

const UK_SAFE_ROUTES: MigrationCorridorSource = {
  organization: 'UK Home Office',
  title: 'Safe and legal humanitarian routes, year ending December 2025',
  url: 'https://www.gov.uk/government/statistics/immigration-system-statistics-year-ending-december-2025/how-many-people-come-to-the-uk-via-safe-and-legal-humanitarian-routes',
};

const UK_RESETTLEMENT_POLICY: MigrationCorridorSource = {
  organization: 'UK Home Office',
  title: 'UK Resettlement Scheme policy guidance',
  url: 'https://www.gov.uk/government/publications/resettlement-policy-statement/resettlement-policy-guidance-accessible-version',
};

const UNHCR_HEATHROW_EXAMPLE: MigrationCorridorSource = {
  organization: 'UNHCR UK',
  title: 'Documented UNHCR resettlement arrival through Heathrow',
  url: 'https://www.unhcr.org/uk/news/unhcr-welcomes-acceptance-resettled-refugees-sheffield-uk',
};

const FRONTEX_ROUTE_MAP: MigrationCorridorSource = {
  organization: 'Frontex',
  title: 'Migratory routes map and detection methodology',
  url: 'https://www.frontex.europa.eu/what-we-do/monitoring-and-risk-analysis/migratory-map/',
};

const IOM_ROUTE_MONITORING: MigrationCorridorSource = {
  organization: 'IOM DTM',
  title: 'Mixed-movement and Western Balkans route monitoring',
  url: 'https://dtm.iom.int/component/migrants-presence',
};

const IOM_CENTRAL_MED: MigrationCorridorSource = {
  organization: 'IOM / UNHCR',
  title: 'Central Mediterranean annual overview 2024',
  url: 'https://dtm.iom.int/reports/migrant-and-refugee-movements-through-central-mediterranean-sea-joint-annual-overview-2024',
};

export const UK_MIGRATION_CORRIDORS: readonly MigrationCorridor[] = [
  {
    id: 'eritrea-central-mediterranean-channel',
    label: 'Eritrea · Sudan · Libya · Italy · France · English Channel · Dover',
    status: 'irregular',
    originLabel: 'Asmara, Eritrea',
    originCode: 'ERI',
    destinationLabel: 'Dover Harbour',
    destinationType: 'sea entry',
    legs: [
      { mode: 'land', waypoints: PATH.eritreaToTripoliViaFasher },
      {
        mode: 'sea',
        waypoints: joinPaths(PATH.tripoliToLampedusaSea, PATH.lampedusaToPortoEmpedocleSea),
      },
      {
        mode: 'land',
        waypoints: [P.portoEmpedocle, P.catania, P.messina],
      },
      {
        mode: 'sea',
        waypoints: PATH.messinaStrait,
      },
      {
        mode: 'land',
        waypoints: joinPaths(
          [P.villaSanGiovanni, P.naples, P.rome, P.florence, P.bologna, P.milan],
          PATH.triesteToMenton.slice(1),
          PATH.mentonToParis,
          PATH.parisToDunkirk,
        ),
      },
      { mode: 'sea', waypoints: PATH.dunkirkToDoverSea },
    ],
    transitLabels: [
      { code: 'LBY', label: 'Tripoli', coordinate: P.tripoli },
      { code: 'ITA', label: 'Lampedusa', coordinate: P.lampedusa },
      { code: 'ITA', label: 'Ventimiglia', coordinate: P.ventimiglia },
      { code: 'FRA', label: 'Dunkirk', coordinate: P.dunkirk },
      { code: 'GBR', label: 'Dover', coordinate: P.dover },
    ],
    sources: [IOM_CENTRAL_MED, FRONTEX_ROUTE_MAP, UK_ILLEGAL_ENTRY_STATS],
  },
  {
    id: 'afghanistan-western-balkans-channel',
    label: 'Afghanistan · Türkiye · Western Balkans · Italy · France · Channel · Dover',
    status: 'irregular',
    originLabel: 'Kabul, Afghanistan',
    originCode: 'AFG',
    destinationLabel: 'Dover Harbour',
    destinationType: 'sea entry',
    legs: [
      {
        mode: 'land',
        waypoints: joinPaths(
          PATH.kabulToIstanbul,
          PATH.istanbulToThessaloniki,
          PATH.thessalonikiToBelgrade,
          PATH.belgradeToBajakovo,
          PATH.bajakovoToZagreb,
          PATH.zagrebToTrieste,
          PATH.triesteToMenton,
          PATH.mentonToParis,
          PATH.parisToCalais,
        ),
      },
      { mode: 'sea', waypoints: PATH.calaisToDoverSea },
    ],
    transitLabels: [
      { code: 'TUR', label: 'Istanbul', coordinate: P.istanbul },
      { code: 'SRB', label: 'Belgrade', coordinate: P.belgrade },
      { code: 'ITA', label: 'Trieste', coordinate: P.trieste },
      { code: 'FRA', label: 'Calais', coordinate: P.calais },
      { code: 'GBR', label: 'Dover', coordinate: P.dover },
    ],
    sources: [IOM_ROUTE_MONITORING, FRONTEX_ROUTE_MAP, UK_ILLEGAL_ENTRY_STATS],
  },
  {
    id: 'jordan-uk-resettlement',
    label: 'Jordan · representative UNHCR-linked UK resettlement air entry',
    status: 'regular',
    originLabel: 'Amman, Jordan',
    originCode: 'JOR',
    destinationLabel: 'Heathrow (illustrative)',
    destinationType: 'safe entry',
    legs: [
      {
        mode: 'air',
        waypoints: [P.amman, [20, 40], P.heathrow],
      },
    ],
    sources: [UK_SAFE_ROUTES, UK_RESETTLEMENT_POLICY, UNHCR_HEATHROW_EXAMPLE],
  },
  {
    id: 'iran-western-balkans-channel',
    label: 'Iran · Türkiye · Western Balkans · France · Channel · Dover',
    status: 'irregular',
    originLabel: 'Tehran, Iran',
    originCode: 'IRN',
    destinationLabel: 'Dover Harbour',
    destinationType: 'sea entry',
    legs: [
      {
        mode: 'land',
        waypoints: joinPaths(
          PATH.tehranToIstanbul,
          PATH.istanbulToThessaloniki,
          PATH.thessalonikiToBelgrade,
          PATH.belgradeToBajakovo,
          PATH.bajakovoToZagreb,
          PATH.zagrebToTrieste,
          PATH.triesteToMenton,
          PATH.mentonToParis,
          PATH.parisToCalais,
        ),
      },
      { mode: 'sea', waypoints: PATH.calaisToDoverSea },
    ],
    transitLabels: [
      { code: 'TUR', label: 'Istanbul', coordinate: P.istanbul },
      { code: 'SRB', label: 'Belgrade', coordinate: P.belgrade },
      { code: 'FRA', label: 'Calais', coordinate: P.calais },
    ],
    sources: [IOM_ROUTE_MONITORING, FRONTEX_ROUTE_MAP, UK_ILLEGAL_ENTRY_STATS],
  },
  {
    id: 'vietnam-france-channel',
    label: 'Vietnam · air/land Europe transit · France · Channel · Dover',
    status: 'irregular',
    originLabel: 'Hanoi, Vietnam',
    originCode: 'VNM',
    destinationLabel: 'Dover Harbour',
    destinationType: 'sea entry',
    legs: [
      {
        mode: 'air',
        waypoints: [P.hanoi, P.istanbul, P.cdg],
      },
      {
        mode: 'land',
        waypoints: joinPaths([P.cdg, P.paris], PATH.parisToDunkirk),
      },
      { mode: 'sea', waypoints: PATH.dunkirkToDoverSea },
    ],
    transitLabels: [
      { code: 'TUR', label: 'Istanbul air hub', coordinate: P.istanbul },
      { code: 'FRA', label: 'Dunkirk', coordinate: P.dunkirk },
    ],
    sources: [UK_ILLEGAL_ENTRY_STATS, FRONTEX_ROUTE_MAP],
  },
  {
    id: 'syria-balkans-channel',
    label: 'Syria · Türkiye · Western Balkans · France · Channel · Dover',
    status: 'irregular',
    originLabel: 'Damascus, Syria',
    originCode: 'SYR',
    destinationLabel: 'Dover Harbour',
    destinationType: 'sea entry',
    legs: [
      {
        mode: 'land',
        waypoints: joinPaths(
          PATH.damascusToIstanbul,
          PATH.istanbulToThessaloniki,
          PATH.thessalonikiToBelgrade,
          PATH.belgradeToBajakovo,
          PATH.bajakovoToZagreb,
          PATH.zagrebToTrieste,
          PATH.triesteToMenton,
          PATH.mentonToParis,
          PATH.parisToCalais,
        ),
      },
      { mode: 'sea', waypoints: PATH.calaisToDoverSea },
    ],
    transitLabels: [
      { code: 'TUR', label: 'Istanbul', coordinate: P.istanbul },
      { code: 'SRB', label: 'Belgrade', coordinate: P.belgrade },
      { code: 'FRA', label: 'Calais', coordinate: P.calais },
    ],
    sources: [IOM_ROUTE_MONITORING, FRONTEX_ROUTE_MAP, UK_ILLEGAL_ENTRY_STATS],
  },
  {
    id: 'sudan-calais-channel',
    label: 'Sudan · Libya · Italy · France · English Channel · Dover',
    status: 'irregular',
    originLabel: 'Khartoum, Sudan',
    originCode: 'SDN',
    destinationLabel: 'Dover Harbour',
    destinationType: 'sea entry',
    legs: [
      { mode: 'land', waypoints: PATH.sudanToBenghazi },
      { mode: 'sea', waypoints: PATH.benghaziToAugustaSea },
      {
        mode: 'land',
        waypoints: joinPaths(
          PATH.italySicilyToRome,
          PATH.italyRomeToMenton.slice(1),
          PATH.mentonToParis,
          PATH.parisToCalais,
        ),
      },
      { mode: 'sea', waypoints: PATH.calaisToDoverSea },
    ],
    transitLabels: [
      { code: 'LBY', label: 'Benghazi', coordinate: P.benghazi },
      { code: 'ITA', label: 'Augusta', coordinate: P.augusta },
      { code: 'FRA', label: 'Calais', coordinate: P.calais },
      { code: 'GBR', label: 'Dover', coordinate: P.dover },
    ],
    sources: [IOM_CENTRAL_MED, FRONTEX_ROUTE_MAP, UK_ILLEGAL_ENTRY_STATS],
  },
  {
    id: 'albania-france-channel',
    label: 'Albania · Western Balkans · Italy · France · Channel · Dover',
    status: 'irregular',
    originLabel: 'Tirana, Albania',
    originCode: 'ALB',
    destinationLabel: 'Dover Harbour',
    destinationType: 'sea entry',
    legs: [
      {
        mode: 'land',
        waypoints: joinPaths(
          PATH.tiranaToBelgradeLand,
          PATH.belgradeToBajakovo,
          PATH.bajakovoToZagreb,
          PATH.zagrebToTrieste,
          PATH.triesteToMenton,
          PATH.mentonToParis,
          PATH.parisToCalais,
        ),
      },
      { mode: 'sea', waypoints: PATH.calaisToDoverSea },
    ],
    transitLabels: [
      { code: 'ALB', label: 'Shkodër', coordinate: P.shkoder },
      { code: 'SRB', label: 'Belgrade', coordinate: P.belgrade },
      { code: 'ITA', label: 'Trieste', coordinate: P.trieste },
      { code: 'FRA', label: 'Calais', coordinate: P.calais },
      { code: 'GBR', label: 'Dover', coordinate: P.dover },
    ],
    sources: [UK_ILLEGAL_ENTRY_STATS, IOM_ROUTE_MONITORING, FRONTEX_ROUTE_MAP],
  },
  {
    id: 'ukraine-uk-homes-scheme',
    label: 'Ukraine · Homes for Ukraine / visa pathway · Heathrow',
    status: 'regular',
    originLabel: 'Kyiv, Ukraine',
    originCode: 'UKR',
    destinationLabel: 'Heathrow',
    destinationType: 'airport entry',
    legs: [
      {
        mode: 'air',
        waypoints: [P.kyiv, P.warsawAirport, P.heathrow],
      },
    ],
    transitLabels: [
      { code: 'POL', label: 'Warsaw air hub', coordinate: P.warsawAirport },
    ],
    sources: [UK_SAFE_ROUTES, UK_RESETTLEMENT_POLICY],
  },
  {
    id: 'iran-inadequate-docs-heathrow',
    label: 'Iran · inadequately documented air arrival · Heathrow',
    status: 'irregular',
    originLabel: 'Tehran, Iran',
    originCode: 'IRN',
    destinationLabel: 'Heathrow',
    destinationType: 'airport entry',
    legs: [
      {
        mode: 'air',
        waypoints: [P.tehran, P.istanbul, P.heathrow],
      },
    ],
    transitLabels: [
      { code: 'TUR', label: 'Istanbul air hub', coordinate: P.istanbul },
    ],
    sources: [UK_ILLEGAL_ENTRY_STATS],
  },
];
