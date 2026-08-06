/**
 * Representative migration corridors into Italy, compiled from official IOM, UNHCR,
 * Frontex, EU, and Italian-government reporting. These are schematic evidence paths, not
 * instructions or claims that every journey follows the exact same streets or disembarkation.
 */

import type {
  MigrationCorridor,
  MigrationCorridorSource,
} from '../../migrationCorridors';
import { P, PATH, joinPaths } from '../../migrationCorridorPaths';

export type ItalyMigrationCorridor = MigrationCorridor;

const IOM_CENTRAL_MED: MigrationCorridorSource = {
  organization: 'IOM / UNHCR',
  title: 'Central Mediterranean annual overview 2024',
  url: 'https://dtm.iom.int/reports/migrant-and-refugee-movements-through-central-mediterranean-sea-joint-annual-overview-2024',
};

const UNHCR_ITALY_ARRIVALS: MigrationCorridorSource = {
  organization: 'UNHCR',
  title: 'Italy sea-arrivals situation',
  url: 'https://data.unhcr.org/en/situations/europe-sea-arrivals/location/24521',
};

export const ITALY_MIGRATION_CORRIDORS: readonly ItalyMigrationCorridor[] = [
  {
    id: 'nigeria-central-mediterranean',
    label: 'Nigeria · Niger · Libya · Central Mediterranean',
    status: 'irregular',
    originLabel: 'Lagos, Nigeria',
    originCode: 'NGA',
    destinationLabel: 'Lampedusa',
    destinationType: 'sea entry',
    legs: [
      { mode: 'land', waypoints: PATH.nigeriaToTripoli },
      { mode: 'sea', waypoints: PATH.tripoliToLampedusaSea },
    ],
    transitLabels: [
      { code: 'NER', label: 'Agadez', coordinate: P.agadez },
      { code: 'LBY', label: 'Sabha', coordinate: P.sabha },
      { code: 'LBY', label: 'Tripoli', coordinate: P.tripoli },
      { code: 'ITA', label: 'Lampedusa', coordinate: P.lampedusa },
    ],
    sources: [
      {
        organization: 'IOM',
        title: 'Trans-Saharan route via Agadez and Sabha',
        url: 'https://migrantprotection.iom.int/sites/g/files/tmzbdl341/files/documents/iom_regional_assisted_voluntary_return_and_reintegration_for_stranded_migrants_in_libya_and_morocco_2010.pdf',
      },
      IOM_CENTRAL_MED,
      UNHCR_ITALY_ARRIVALS,
    ],
  },
  {
    id: 'sudan-libya-sicily',
    label: 'Sudan · Al Kufra · Libyan coast · Sicily',
    status: 'irregular',
    originLabel: 'Khartoum, Sudan',
    originCode: 'SDN',
    destinationLabel: 'Augusta',
    destinationType: 'sea entry',
    legs: [
      { mode: 'land', waypoints: PATH.sudanToBenghazi },
      { mode: 'sea', waypoints: PATH.benghaziToAugustaSea },
    ],
    transitLabels: [
      { code: 'LBY', label: 'Al Kufra', coordinate: P.alKufra },
      { code: 'LBY', label: 'Benghazi', coordinate: P.benghazi },
      { code: 'ITA', label: 'Augusta', coordinate: P.augusta },
    ],
    sources: [
      {
        organization: 'IOM',
        title: 'Profile of Sudanese migrants in Libya',
        url: 'https://dtm.iom.int/sites/g/files/tmzbdl1461/files/reports/DTM-Libya-Profile-of-Sudanese-Migrants_update_06_March_2024.pdf',
      },
      IOM_CENTRAL_MED,
      UNHCR_ITALY_ARRIVALS,
    ],
  },
  {
    id: 'tunisia-lampedusa',
    label: 'Tunisia · Central Mediterranean · Lampedusa',
    status: 'irregular',
    originLabel: 'Sfax, Tunisia',
    originCode: 'TUN',
    destinationLabel: 'Lampedusa',
    destinationType: 'sea entry',
    legs: [{ mode: 'sea', waypoints: PATH.sfaxToLampedusaSea }],
    transitLabels: [
      { code: 'TUN', label: 'Sfax', coordinate: P.sfax },
      { code: 'ITA', label: 'Lampedusa', coordinate: P.lampedusa },
    ],
    sources: [IOM_CENTRAL_MED, UNHCR_ITALY_ARRIVALS],
  },
  {
    id: 'algeria-sardinia',
    label: 'Algeria · Sardinia',
    status: 'irregular',
    originLabel: 'Annaba, Algeria',
    originCode: 'DZA',
    destinationLabel: "Sant'Antioco",
    destinationType: 'sea entry',
    legs: [{ mode: 'sea', waypoints: PATH.annabaToSardiniaSea }],
    transitLabels: [
      { code: 'DZA', label: 'Annaba', coordinate: P.annaba },
      { code: 'ITA', label: "Sant'Antioco", coordinate: P.santAntioco },
    ],
    sources: [UNHCR_ITALY_ARRIVALS],
  },
  {
    id: 'zuwara-lampedusa',
    label: 'Western Libya · Zuwara · Central Mediterranean · Lampedusa',
    status: 'irregular',
    originLabel: 'Zuwara, Libya',
    originCode: 'LBY',
    destinationLabel: 'Lampedusa',
    destinationType: 'sea entry',
    legs: [{ mode: 'sea', waypoints: PATH.zuwaraToLampedusaSea }],
    transitLabels: [
      { code: 'LBY', label: 'Zuwara', coordinate: P.zuwara },
      { code: 'ITA', label: 'Lampedusa', coordinate: P.lampedusa },
    ],
    sources: [
      IOM_CENTRAL_MED,
      UNHCR_ITALY_ARRIVALS,
      {
        organization: 'Frontex',
        title: 'Central Mediterranean departures from western Libya',
        url: 'https://www.frontex.europa.eu/what-we-do/monitoring-and-risk-analysis/migratory-map/',
      },
    ],
  },
  {
    id: 'tunisia-pozzallo',
    label: 'Tunisia · Central Mediterranean · Pozzallo / Sicily',
    status: 'irregular',
    originLabel: 'Sfax, Tunisia',
    originCode: 'TUN',
    destinationLabel: 'Pozzallo',
    destinationType: 'sea entry',
    legs: [{ mode: 'sea', waypoints: PATH.sfaxToPozzalloSea }],
    transitLabels: [
      { code: 'TUN', label: 'Sfax', coordinate: P.sfax },
      { code: 'ITA', label: 'Pozzallo', coordinate: P.pozzoallo },
    ],
    sources: [IOM_CENTRAL_MED, UNHCR_ITALY_ARRIVALS],
  },
  {
    id: 'zuwara-calabria-sea',
    label: 'Western Libya · Zuwara · Central Mediterranean · Calabria',
    status: 'irregular',
    originLabel: 'Zuwara, Libya',
    originCode: 'LBY',
    destinationLabel: 'Reggio Calabria',
    destinationType: 'sea entry',
    legs: [{ mode: 'sea', waypoints: PATH.zuwaraToCalabriaSea }],
    transitLabels: [
      { code: 'LBY', label: 'Zuwara', coordinate: P.zuwara },
      { code: 'ITA', label: 'Calabria coast', coordinate: P.calabriaCoast },
      { code: 'ITA', label: 'Reggio Calabria', coordinate: P.reggioCalabria },
    ],
    sources: [
      IOM_CENTRAL_MED,
      UNHCR_ITALY_ARRIVALS,
      {
        organization: 'Frontex',
        title: 'Central Mediterranean landings in southern Italy including Calabria',
        url: 'https://www.frontex.europa.eu/media-centre/news/news-release/irregular-border-crossings-into-eu-drop-sharply-in-2024-oqpweX',
      },
    ],
  },
  {
    id: 'syria-western-balkans-trieste',
    label: 'Syria · Türkiye · Western Balkans · Trieste',
    status: 'irregular',
    originLabel: 'Damascus, Syria',
    originCode: 'SYR',
    destinationLabel: 'Trieste',
    destinationType: 'land entry',
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
        ),
      },
    ],
    transitLabels: [
      { code: 'TUR', label: 'Istanbul', coordinate: P.istanbul },
      { code: 'GRC', label: 'Thessaloniki', coordinate: P.thessaloniki },
      { code: 'SRB', label: 'Belgrade', coordinate: P.belgrade },
      { code: 'HRV', label: 'Bajakovo', coordinate: P.bajakovo },
      { code: 'ITA', label: 'Trieste', coordinate: P.trieste },
    ],
    sources: [
      {
        organization: 'IOM',
        title: 'Western Balkan route monitoring',
        url: 'https://dtm.iom.int/component/migrants-presence',
      },
      {
        organization: 'UNHCR / IOM',
        title: 'North-east Italy and the Balkan route',
        url: 'https://www.unhcr.org/it/notizie/comunicati-stampa/missione-oim-unhcr-al-confine-nord-est-migliorare-assistenza-e-protezione',
      },
    ],
  },
  {
    id: 'afghanistan-western-balkans',
    label: 'Afghanistan · Türkiye · Western Balkans · Trieste',
    status: 'irregular',
    originLabel: 'Kabul, Afghanistan',
    originCode: 'AFG',
    destinationLabel: 'Trieste',
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
        ),
      },
    ],
    transitLabels: [
      { code: 'TUR', label: 'Istanbul', coordinate: P.istanbul },
      { code: 'GRC', label: 'Thessaloniki', coordinate: P.thessaloniki },
      { code: 'MKD', label: 'Skopje', coordinate: P.skopje },
      { code: 'SRB', label: 'Belgrade', coordinate: P.belgrade },
      { code: 'HRV', label: 'Bajakovo', coordinate: P.bajakovo },
      { code: 'ITA', label: 'Trieste', coordinate: P.trieste },
    ],
    sources: [
      {
        organization: 'IOM',
        title: 'Western Balkan route monitoring',
        url: 'https://dtm.iom.int/component/migrants-presence',
      },
      {
        organization: 'UNHCR / IOM',
        title: 'North-east Italy and the Balkan route',
        url: 'https://www.unhcr.org/it/notizie/comunicati-stampa/missione-oim-unhcr-al-confine-nord-est-migliorare-assistenza-e-protezione',
      },
    ],
  },
  {
    id: 'libya-humanitarian-corridor',
    label: 'Libya · UNHCR humanitarian evacuation · Rome',
    status: 'regular',
    originLabel: 'Tripoli, Libya',
    originCode: 'LBY',
    destinationLabel: 'Rome Fiumicino',
    destinationType: 'safe entry',
    legs: [
      {
        mode: 'air',
        waypoints: [P.mitiga, [12.7, 36.2], P.fiumicino],
      },
    ],
    transitLabels: [
      { code: 'ITA', label: 'Rome Fiumicino', coordinate: P.fiumicino },
    ],
    sources: [
      {
        organization: 'UNHCR',
        title: 'Humanitarian evacuation from Tripoli to Fiumicino',
        url: 'https://www.unhcr.org/it/notizie/comunicati-stampa/libia-arrivati-fiumicino-122-rifugiati-grazie-ad-un-evacuazione',
      },
    ],
  },
  {
    id: 'ethiopia-humanitarian-corridor',
    label: 'Ethiopia · humanitarian corridor · Rome',
    status: 'regular',
    originLabel: 'Addis Ababa, Ethiopia',
    originCode: 'ETH',
    destinationLabel: 'Rome Fiumicino',
    destinationType: 'safe entry',
    legs: [
      {
        mode: 'air',
        waypoints: [P.addis, [30.2, 22.0], [20.0, 32.2], P.fiumicino],
      },
    ],
    sources: [
      {
        organization: 'Italian Ministry of the Interior',
        title: 'Humanitarian corridor from Ethiopia to Fiumicino',
        url: 'https://www.interno.gov.it/it/notizie/corridoi-umanitari-italia-25-profughi-dalletiopia',
      },
    ],
  },
  {
    id: 'egypt-libya-central-mediterranean',
    label: 'Egypt · eastern Libya · Central Mediterranean · Sicily',
    status: 'irregular',
    originLabel: 'Cairo, Egypt',
    originCode: 'EGY',
    destinationLabel: 'Augusta',
    destinationType: 'sea entry',
    legs: [
      { mode: 'land', waypoints: PATH.cairoToBenghazi },
      { mode: 'sea', waypoints: PATH.benghaziToAugustaSea },
    ],
    transitLabels: [
      { code: 'LBY', label: 'Tobruk', coordinate: P.tobruk },
      { code: 'LBY', label: 'Benghazi', coordinate: P.benghazi },
      { code: 'ITA', label: 'Augusta', coordinate: P.augusta },
    ],
    sources: [
      IOM_CENTRAL_MED,
      UNHCR_ITALY_ARRIVALS,
      {
        organization: 'Frontex',
        title: 'Eastern Libya–Crete/Sicily corridor pressure in 2024',
        url: 'https://www.frontex.europa.eu/media-centre/news/news-release/irregular-border-crossings-into-eu-drop-sharply-in-2024-oqpweX',
      },
    ],
  },
  {
    id: 'albania-bari-ferry-regular',
    label: 'Albania · Adriatic ferry · Bari',
    status: 'regular',
    originLabel: 'Durrës, Albania',
    originCode: 'ALB',
    destinationLabel: 'Bari Port',
    destinationType: 'sea entry',
    legs: [{ mode: 'sea', waypoints: PATH.durresToBariSea }],
    transitLabels: [
      { code: 'ALB', label: 'Durrës', coordinate: P.durres },
      { code: 'ITA', label: 'Bari Port', coordinate: P.bari },
    ],
    sources: [
      {
        organization: 'Eurostat',
        title: 'Albanian citizens among large foreign communities in Italy',
        url: 'https://ec.europa.eu/eurostat/web/interactive-publications/migration-2025',
      },
      {
        organization: 'European Commission',
        title: 'Schengen border-crossing rules and official crossing-point register',
        url: 'https://home-affairs.ec.europa.eu/policies/schengen/border-crossing_en',
      },
    ],
  },
  {
    id: 'lebanon-humanitarian-corridor-rome',
    label: 'Lebanon · humanitarian corridor · Rome',
    status: 'regular',
    originLabel: 'Beirut, Lebanon',
    originCode: 'LBN',
    destinationLabel: 'Rome Fiumicino',
    destinationType: 'safe entry',
    legs: [
      {
        mode: 'air',
        waypoints: [P.beirut, P.istanbul, P.fiumicino],
      },
    ],
    transitLabels: [
      { code: 'TUR', label: 'Istanbul air hub', coordinate: P.istanbul },
    ],
    sources: [
      {
        organization: 'EUAA',
        title: 'Italy humanitarian corridors from Lebanon, Niger, Ethiopia and Jordan',
        url: 'https://dip.euaa.europa.eu/countries/italy/resettlement-and-humanitarian-admission-italy',
      },
      {
        organization: 'UNHCR',
        title: 'Humanitarian corridors complementary pathway',
        url: 'https://www.unhcr.org/what-we-do/build-better-futures/long-term-solutions/resettlement',
      },
    ],
  },
];
