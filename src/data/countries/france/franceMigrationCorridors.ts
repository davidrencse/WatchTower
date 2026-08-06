/**
 * Representative mixed-movement corridors into metropolitan France, compiled from UNHCR,
 * IOM, Frontex, European Commission, and French-government reporting. France is commonly an
 * onward destination after first arrival in Spain or Italy, so these paths preserve those
 * transit countries instead of drawing implausible direct rays to France. They are schematic
 * evidence paths, not turn-by-turn instructions or claims that every journey is identical.
 */

import type {
  MigrationCorridor,
  MigrationCorridorSource,
} from '../../migrationCorridors';
import { P, PATH, joinPaths } from '../../migrationCorridorPaths';

export type FranceMigrationCorridor = MigrationCorridor;

const IOM_ROUTE_DEFINITIONS: MigrationCorridorSource = {
  organization: 'IOM DTM',
  title: 'Mixed migration routes to Europe and Western Balkans monitoring',
  url: 'https://dtm.iom.int/component/migrants-presence',
};

const FRONTEX_2024: MigrationCorridorSource = {
  organization: 'Frontex',
  title: 'Annual Brief 2024 — routes and origin countries',
  url: 'https://prd.frontex.europa.eu/wp-content/uploads/annual_brief_2024.pdf',
};

const UNHCR_FRANCE_BORDERS: MigrationCorridorSource = {
  organization: 'UNHCR France',
  title: 'Borders and access to French territory',
  url: 'https://www.unhcr.org/fr-fr/en-france/le-hcr-en-france/frontieres-et-acces-au-territoire',
};

const EU_INTERNAL_CROSSINGS: MigrationCorridorSource = {
  organization: 'European Commission',
  title: 'French internal border-crossing points under temporary controls',
  url: 'https://home-affairs.ec.europa.eu/document/download/e9e9e193-3cb1-43da-99e0-ec29a91ec4d0_en?filename=List+of+internal+bcp_en_3.pdf',
};

const IOM_WEST_AFRICA: MigrationCorridorSource = {
  organization: 'IOM DTM',
  title: 'West and Central African routes through the Sahel',
  url: 'https://dtm.iom.int/sites/g/files/tmzbdl1461/files/reports/WCA%20Routes%20Through%20Sahel_December%202023.pdf',
};

const IOM_CENTRAL_MED: MigrationCorridorSource = {
  organization: 'IOM / UNHCR',
  title: 'Central Mediterranean annual overview 2024',
  url: 'https://dtm.iom.int/reports/migrant-and-refugee-movements-through-central-mediterranean-sea-joint-annual-overview-2024',
};

export const FRANCE_MIGRATION_CORRIDORS: readonly FranceMigrationCorridor[] = [
  {
    id: 'mali-algeria-spain-cerbere',
    label: 'Mali · Algeria · Western Mediterranean · Spain · Cerbère',
    status: 'irregular',
    originLabel: 'Bamako, Mali',
    originCode: 'MLI',
    destinationLabel: 'Cerbère',
    destinationType: 'land entry',
    legs: [
      { mode: 'land', waypoints: PATH.bamakoToOran },
      { mode: 'sea', waypoints: PATH.oranToAlmeriaSea },
      { mode: 'land', waypoints: PATH.almeriaToCerbere },
    ],
    transitLabels: [
      { code: 'DZA', label: 'Tamanrasset', coordinate: P.tamanrasset },
      { code: 'DZA', label: 'Oran', coordinate: P.oran },
      { code: 'ESP', label: 'Almería', coordinate: P.almeria },
      { code: 'ESP', label: 'Barcelona', coordinate: P.barcelona },
      { code: 'FRA', label: 'Cerbère', coordinate: P.cerbere },
    ],
    sources: [
      IOM_WEST_AFRICA,
      IOM_ROUTE_DEFINITIONS,
      FRONTEX_2024,
      UNHCR_FRANCE_BORDERS,
      EU_INTERNAL_CROSSINGS,
    ],
  },
  {
    id: 'senegal-mauritania-morocco-hendaye',
    label: 'Senegal · Mauritania · Morocco · Spain · Hendaye',
    status: 'irregular',
    originLabel: 'Dakar, Senegal',
    originCode: 'SEN',
    destinationLabel: 'Hendaye',
    destinationType: 'land entry',
    legs: [
      { mode: 'land', waypoints: PATH.dakarToTangier },
      { mode: 'sea', waypoints: PATH.tangierToAlgecirasSea },
      { mode: 'land', waypoints: PATH.algecirasToHendaye },
    ],
    transitLabels: [
      { code: 'MRT', label: 'Nouakchott', coordinate: P.nouakchott },
      { code: 'MAR', label: 'Tangier', coordinate: P.tangier },
      { code: 'ESP', label: 'Algeciras', coordinate: P.algeciras },
      { code: 'ESP', label: 'Madrid', coordinate: P.madrid },
      { code: 'FRA', label: 'Hendaye', coordinate: P.hendaye },
    ],
    sources: [
      IOM_WEST_AFRICA,
      IOM_ROUTE_DEFINITIONS,
      FRONTEX_2024,
      UNHCR_FRANCE_BORDERS,
      EU_INTERNAL_CROSSINGS,
    ],
  },
  {
    id: 'nigeria-libya-italy-menton',
    label: 'Nigeria · Niger · Libya · Central Mediterranean · Italy · Menton',
    status: 'irregular',
    originLabel: 'Lagos, Nigeria',
    originCode: 'NGA',
    destinationLabel: 'Menton',
    destinationType: 'land entry',
    legs: [
      { mode: 'land', waypoints: PATH.nigeriaToTripoli },
      {
        mode: 'sea',
        waypoints: joinPaths(PATH.tripoliToLampedusaSea, PATH.lampedusaToPortoEmpedocleSea),
      },
      {
        mode: 'land',
        waypoints: joinPaths(
          [P.portoEmpedocle, P.catania, P.messina, P.villaSanGiovanni, P.naples, P.rome],
          PATH.italyRomeToMenton.slice(1),
        ),
      },
    ],
    transitLabels: [
      { code: 'NER', label: 'Agadez', coordinate: P.agadez },
      { code: 'LBY', label: 'Tripoli', coordinate: P.tripoli },
      { code: 'ITA', label: 'Lampedusa', coordinate: P.lampedusa },
      { code: 'ITA', label: 'Ventimiglia', coordinate: P.ventimiglia },
      { code: 'FRA', label: 'Menton', coordinate: P.menton },
    ],
    sources: [
      IOM_WEST_AFRICA,
      IOM_CENTRAL_MED,
      FRONTEX_2024,
      UNHCR_FRANCE_BORDERS,
      EU_INTERNAL_CROSSINGS,
    ],
  },
  {
    id: 'sudan-libya-italy-montgenevre',
    label: 'Sudan · Libya · Sicily · Italy · Montgenèvre',
    status: 'irregular',
    originLabel: 'Khartoum, Sudan',
    originCode: 'SDN',
    destinationLabel: 'Montgenèvre',
    destinationType: 'land entry',
    legs: [
      { mode: 'land', waypoints: PATH.sudanToBenghazi },
      { mode: 'sea', waypoints: PATH.benghaziToAugustaSea },
      {
        mode: 'land',
        waypoints: [P.augusta, P.catania, P.messina],
      },
      {
        mode: 'sea',
        waypoints: PATH.messinaStrait,
      },
      {
        mode: 'land',
        waypoints: [
          P.villaSanGiovanni,
          P.naples,
          P.rome,
          P.florence,
          P.bologna,
          P.milan,
          P.turin,
          P.oulx,
          P.montgenevre,
        ],
      },
    ],
    transitLabels: [
      { code: 'LBY', label: 'Al Kufra', coordinate: P.alKufra },
      { code: 'ITA', label: 'Augusta', coordinate: P.augusta },
      { code: 'ITA', label: 'Turin', coordinate: P.turin },
      { code: 'FRA', label: 'Montgenèvre', coordinate: P.montgenevre },
    ],
    sources: [
      IOM_CENTRAL_MED,
      FRONTEX_2024,
      UNHCR_FRANCE_BORDERS,
      EU_INTERNAL_CROSSINGS,
    ],
  },
  {
    id: 'afghanistan-western-balkans-france',
    label: 'Afghanistan · Türkiye · Greece · Western Balkans · Italy · Montgenèvre',
    status: 'irregular',
    originLabel: 'Kabul, Afghanistan',
    originCode: 'AFG',
    destinationLabel: 'Montgenèvre',
    destinationType: 'land entry',
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
          [P.trieste, P.milan, P.turin, P.oulx, P.montgenevre],
        ),
      },
    ],
    transitLabels: [
      { code: 'TUR', label: 'Istanbul', coordinate: P.istanbul },
      { code: 'GRC', label: 'Thessaloniki', coordinate: P.thessaloniki },
      { code: 'SRB', label: 'Belgrade', coordinate: P.belgrade },
      { code: 'ITA', label: 'Trieste', coordinate: P.trieste },
      { code: 'FRA', label: 'Montgenèvre', coordinate: P.montgenevre },
    ],
    sources: [
      IOM_ROUTE_DEFINITIONS,
      FRONTEX_2024,
      UNHCR_FRANCE_BORDERS,
      EU_INTERNAL_CROSSINGS,
    ],
  },
  {
    id: 'niger-university-corridor-cdg',
    label: 'Niger · UNHCR university corridor · Paris',
    status: 'regular',
    originLabel: 'Niamey, Niger',
    originCode: 'NER',
    destinationLabel: 'Paris Charles de Gaulle',
    destinationType: 'safe entry',
    legs: [
      {
        mode: 'air',
        waypoints: [P.niamey, [1.5, 28.0], P.cdg],
      },
    ],
    sources: [
      {
        organization: 'UNHCR France',
        title: 'Refugee students arrive from Niger at Paris Charles de Gaulle',
        url: 'https://www.unhcr.org/fr-fr/actualites/communiques-de-presse/grace-une-bourse-detude-en-france-deux-refugies-poursuivent-leurs',
      },
      {
        organization: 'French Ministry of the Interior',
        title: 'France refugee resettlement programme',
        url: 'https://www.immigration.interieur.gouv.fr/politique-de-lasile/programme-de-reinstallation-des-refugies',
      },
    ],
  },
  {
    id: 'morocco-casablanca-cdg-regular',
    label: 'Morocco · air arrival · Paris Charles de Gaulle',
    status: 'regular',
    originLabel: 'Casablanca, Morocco',
    originCode: 'MAR',
    destinationLabel: 'Paris Charles de Gaulle',
    destinationType: 'airport entry',
    legs: [
      {
        mode: 'air',
        waypoints: [P.casablanca, P.cdg],
      },
    ],
    transitLabels: [
      { code: 'FRA', label: 'Paris CDG', coordinate: P.cdg },
    ],
    sources: [
      {
        organization: 'Eurostat',
        title: 'Moroccan citizens among large non-EU communities in France / EU',
        url: 'https://ec.europa.eu/eurostat/web/interactive-publications/migration-2025',
      },
      EU_INTERNAL_CROSSINGS,
    ],
  },
  {
    id: 'tunisia-italy-menton',
    label: 'Tunisia · Central Mediterranean · Italy · Menton',
    status: 'irregular',
    originLabel: 'Sfax, Tunisia',
    originCode: 'TUN',
    destinationLabel: 'Menton',
    destinationType: 'land entry',
    legs: [
      {
        mode: 'sea',
        waypoints: joinPaths(PATH.sfaxToLampedusaSea, PATH.lampedusaToPortoEmpedocleSea),
      },
      {
        mode: 'land',
        waypoints: joinPaths(
          [P.portoEmpedocle, P.catania, P.messina, P.villaSanGiovanni, P.naples, P.rome],
          PATH.italyRomeToMenton.slice(1),
        ),
      },
    ],
    transitLabels: [
      { code: 'ITA', label: 'Lampedusa', coordinate: P.lampedusa },
      { code: 'ITA', label: 'Ventimiglia', coordinate: P.ventimiglia },
      { code: 'FRA', label: 'Menton', coordinate: P.menton },
    ],
    sources: [IOM_CENTRAL_MED, FRONTEX_2024, UNHCR_FRANCE_BORDERS, EU_INTERNAL_CROSSINGS],
  },
  {
    id: 'tunisia-italy-briancon',
    label: 'Tunisia · Central Mediterranean · Italy · Briançon alpine',
    status: 'irregular',
    originLabel: 'Sfax, Tunisia',
    originCode: 'TUN',
    destinationLabel: 'Briançon / Montgenèvre',
    destinationType: 'land entry',
    legs: [
      {
        mode: 'sea',
        waypoints: joinPaths(PATH.sfaxToLampedusaSea, PATH.lampedusaToAugustaSea),
      },
      {
        mode: 'land',
        waypoints: joinPaths(PATH.italySicilyToRome, [P.rome, P.florence, P.bologna, P.milan], PATH.milanToBriancon),
      },
    ],
    transitLabels: [
      { code: 'ITA', label: 'Lampedusa', coordinate: P.lampedusa },
      { code: 'ITA', label: 'Milan', coordinate: P.milan },
      { code: 'FRA', label: 'Briançon', coordinate: P.briancon },
    ],
    sources: [IOM_CENTRAL_MED, FRONTEX_2024, UNHCR_FRANCE_BORDERS, EU_INTERNAL_CROSSINGS],
  },
  {
    id: 'algeria-spain-cerbere-secondary',
    label: 'Algeria · Western Mediterranean · Spain · Cerbère',
    status: 'irregular',
    originLabel: 'Oran, Algeria',
    originCode: 'DZA',
    destinationLabel: 'Cerbère',
    destinationType: 'land entry',
    legs: [
      { mode: 'sea', waypoints: PATH.oranToAlmeriaSea },
      { mode: 'land', waypoints: PATH.almeriaToCerbere },
    ],
    transitLabels: [
      { code: 'DZA', label: 'Oran', coordinate: P.oran },
      { code: 'ESP', label: 'Almería', coordinate: P.almeria },
      { code: 'FRA', label: 'Cerbère', coordinate: P.cerbere },
    ],
    sources: [FRONTEX_2024, UNHCR_FRANCE_BORDERS, EU_INTERNAL_CROSSINGS],
  },
  {
    id: 'syria-jordan-resettlement-cdg',
    label: 'Jordan · UNHCR-linked resettlement · Paris Charles de Gaulle',
    status: 'regular',
    originLabel: 'Amman, Jordan',
    originCode: 'JOR',
    destinationLabel: 'Paris Charles de Gaulle',
    destinationType: 'safe entry',
    legs: [
      {
        mode: 'air',
        waypoints: [P.amman, P.istanbul, P.cdg],
      },
    ],
    transitLabels: [
      { code: 'TUR', label: 'Istanbul air hub', coordinate: P.istanbul },
    ],
    sources: [
      {
        organization: 'EUAA',
        title: 'Asylum Report 2025 — France among top EU resettlement destinations',
        url: 'https://www.euaa.europa.eu/asylum-report-2025/71-data-implementing-pledges',
      },
      {
        organization: 'French Ministry of the Interior',
        title: 'France refugee resettlement programme',
        url: 'https://www.immigration.interieur.gouv.fr/politique-de-lasile/programme-de-reinstallation-des-refugies',
      },
    ],
  },
];
