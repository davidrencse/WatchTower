/**
 * India-origin migration corridors into European and United States destinations.
 *
 * India is the single largest country of origin in the world migration stock, and in
 * Europe it is now the leading non-EU nationality for work and study permits in several
 * member states — so it gets its own corridor layer rather than a line buried in each
 * destination file. Corridors merge into the existing per-destination sets in
 * `lib/mapGlobeOverlays.ts`; East Asian India corridors live in
 * `eastAsiaMigrationCorridors.ts`, which owns those hub coordinates.
 *
 * Regular routes are the documented permit/recruitment pathways and the Gulf air hub
 * they overwhelmingly transit. Irregular routes are the Western Balkans pattern Frontex
 * recorded while Serbia's visa-free regime for Indian nationals was in force (2017 until
 * its suspension on 1 January 2023). Lines are schematic evidence paths — not turn-by-turn
 * instructions, flow-volume claims, or assertions that every journey is identical.
 */

import { corridorBuilders } from './migrationCorridorBuilders';
import type {
  MigrationCoordinate,
  MigrationCorridor,
  MigrationCorridorSource,
  MigrationTargetIso,
  MigrationTransitLabel,
} from './migrationCorridors';
import { P, PATH, joinPaths } from './migrationCorridorPaths';

const MEA_OVERSEAS_INDIANS: MigrationCorridorSource = {
  organization: 'Ministry of External Affairs (India)',
  title: 'Population of Overseas Indians — country-wise NRI and PIO estimates',
  url: 'https://www.mea.gov.in/images/attach/NRIs-and-PIOs_1.pdf',
};

const UN_MIGRANT_STOCK_2024: MigrationCorridorSource = {
  organization: 'UN DESA Population Division',
  title: 'International Migrant Stock 2024 — destination and origin dataset',
  url: 'https://www.un.org/development/desa/pd/content/international-migrant-stock',
};

const EUROSTAT_PERMITS: MigrationCorridorSource = {
  organization: 'Eurostat',
  title: 'First residence permits by reason, citizenship and issuing member state',
  url: 'https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Residence_permits_-_statistics_on_first_permits_issued_during_the_year',
};

const EUROSTAT_IMMIGRATION: MigrationCorridorSource = {
  organization: 'Eurostat',
  title: 'Migration and asylum in Europe — immigration from non-EU countries',
  url: 'https://ec.europa.eu/eurostat/web/interactive-publications/migration-2025',
};

const OECD_MIGRATION_OUTLOOK: MigrationCorridorSource = {
  organization: 'OECD',
  title: 'International Migration Outlook 2024 — labour migration by country of origin',
  url: 'https://www.oecd.org/en/publications/international-migration-outlook-2024_50b0353e-en.html',
};

const FRONTEX_ROUTE_MAP: MigrationCorridorSource = {
  organization: 'Frontex',
  title: 'Migratory routes map and detection methodology',
  url: 'https://www.frontex.europa.eu/what-we-do/monitoring-and-risk-analysis/migratory-map/',
};

const FRONTEX_2024: MigrationCorridorSource = {
  organization: 'Frontex',
  title: 'Irregular border crossings into the EU in 2024',
  url: 'https://www.frontex.europa.eu/media-centre/news/news-release/irregular-border-crossings-into-eu-drop-sharply-in-2024-oqpweX',
};

const IOM_ROUTE_MONITORING: MigrationCorridorSource = {
  organization: 'IOM DTM',
  title: 'Mixed-movement and Western Balkans route monitoring',
  url: 'https://dtm.iom.int/component/migrants-presence',
};

const DHS_YEARBOOK: MigrationCorridorSource = {
  organization: 'DHS Office of Homeland Security Statistics',
  title: 'Yearbook of Immigration Statistics — lawful permanent residents and nonimmigrants',
  url: 'https://ohss.dhs.gov/topics/immigration/yearbook',
};

const CBP_SOUTHWEST: MigrationCorridorSource = {
  organization: 'U.S. Customs and Border Protection',
  title: 'Southwest Land Border Encounters by citizenship',
  url: 'https://www.cbp.gov/newsroom/stats/southwest-land-border-encounters',
};

const CBP_NATIONWIDE: MigrationCorridorSource = {
  organization: 'U.S. Customs and Border Protection',
  title: 'Nationwide encounters, including northern-border sectors',
  url: 'https://www.cbp.gov/newsroom/stats/nationwide-encounters',
};

const UNHCR_DARIEN: MigrationCorridorSource = {
  organization: 'UNHCR / IOM',
  title: 'Darién Gap mixed movements toward North America',
  url: 'https://www.unhcr.org/emergencies/darien-gap',
};

const UK_WORK_VISAS: MigrationCorridorSource = {
  organization: 'UK Home Office',
  title: 'Why do people come to the UK? To work — visas granted by nationality',
  url: 'https://www.gov.uk/government/statistics/immigration-system-statistics-year-ending-december-2025/why-do-people-come-to-the-uk-to-work',
};

const PERMIT_SOURCES = [EUROSTAT_PERMITS, MEA_OVERSEAS_INDIANS, UN_MIGRANT_STOCK_2024] as const;
const LABOUR_SOURCES = [EUROSTAT_PERMITS, OECD_MIGRATION_OUTLOOK, MEA_OVERSEAS_INDIANS] as const;
const BALKAN_SOURCES = [FRONTEX_ROUTE_MAP, FRONTEX_2024, IOM_ROUTE_MONITORING] as const;

/** Gulf and Türkiye hubs that carry the overwhelming majority of India → Europe itineraries. */
const HUB = {
  dubai: { code: 'ARE', label: 'Dubai air hub', coordinate: P.dubai },
  doha: { code: 'QAT', label: 'Doha air hub', coordinate: P.doha },
  istanbul: { code: 'TUR', label: 'Istanbul air hub', coordinate: P.istanbul },
  delhi: { code: 'IND', label: 'Delhi air hub', coordinate: P.delhi },
} as const satisfies Record<string, MigrationTransitLabel>;

const { air, mixed } = corridorBuilders('IND');

/** Air hop to Belgrade, then the overland Western Balkans leg supplied by the caller. */
function balkanRoute(
  id: string,
  label: string,
  destinationLabel: string,
  onward: readonly MigrationCoordinate[],
  transitLabels: readonly MigrationTransitLabel[],
): MigrationCorridor {
  return mixed({
    id,
    label,
    status: 'irregular',
    originLabel: 'Delhi, India',
    legs: [
      { mode: 'air', waypoints: [...PATH.delhiToBelgradeAir] },
      { mode: 'land', waypoints: joinPaths(PATH.belgradeAirportToBelgrade, onward) },
    ],
    destinationLabel,
    destinationType: 'land entry',
    transitLabels: [
      HUB.dubai,
      { code: 'SRB', label: 'Belgrade (visa-free until 2023)', coordinate: P.belgradeAirport },
      ...transitLabels,
    ],
    sources: BALKAN_SOURCES,
  });
}

export const INDIA_MIGRATION_CORRIDORS_BY_ISO: Partial<
  Record<MigrationTargetIso, readonly MigrationCorridor[]>
> = {
  AUT: [
    air({
      id: 'india-austria-skilled-vienna',
      label: 'India · Red-White-Red card / skilled worker · Vienna Airport',
      originLabel: 'Delhi, India',
      origin: P.delhi,
      hubs: [HUB.dubai],
      destinationLabel: 'Vienna Airport',
      destination: P.viennaAirport,
      sources: PERMIT_SOURCES,
    }),
    balkanRoute(
      'india-serbia-hungary-austria-nickelsdorf',
      'India · Serbia visa-free hub · Hungary · Nickelsdorf',
      'Nickelsdorf',
      joinPaths(PATH.belgradeToRoszke, PATH.roszkeToBudapest, PATH.budapestToNickelsdorf),
      [
        { code: 'HUN', label: 'Röszke', coordinate: P.roszke },
        { code: 'HUN', label: 'Budapest', coordinate: P.budapest },
      ],
    ),
  ],
  BEL: [
    air({
      id: 'india-belgium-bluecard-brussels',
      label: 'India · EU Blue Card / Antwerp diamond trade · Brussels Airport',
      originLabel: 'Mumbai, India',
      origin: P.mumbai,
      hubs: [HUB.dubai],
      destinationLabel: 'Brussels Airport',
      destination: P.brusselsAirport,
      sources: PERMIT_SOURCES,
    }),
  ],
  BGR: [
    air({
      id: 'india-bulgaria-seasonal-sofia',
      label: 'India · seasonal hospitality / services permit · Sofia Airport',
      originLabel: 'Delhi, India',
      origin: P.delhi,
      hubs: [HUB.istanbul],
      destinationLabel: 'Sofia Airport',
      destination: P.sofiaAirport,
      sources: LABOUR_SOURCES,
    }),
  ],
  HRV: [
    air({
      id: 'india-croatia-work-permit-zagreb',
      label: 'India · construction / tourism work permit · Zagreb Airport',
      originLabel: 'Delhi, India',
      origin: P.delhi,
      hubs: [HUB.dubai],
      destinationLabel: 'Zagreb Airport',
      destination: P.zagrebAirport,
      sources: LABOUR_SOURCES,
    }),
    balkanRoute(
      'india-serbia-croatia-bajakovo',
      'India · Serbia visa-free hub · Bajakovo · Zagreb',
      'Zagreb',
      joinPaths(PATH.belgradeToBajakovo, PATH.bajakovoToZagreb),
      [{ code: 'HRV', label: 'Bajakovo', coordinate: P.bajakovo }],
    ),
  ],
  CYP: [
    air({
      id: 'india-cyprus-study-work-larnaca',
      label: 'India · study / services work permit · Larnaca',
      originLabel: 'Delhi, India',
      origin: P.delhi,
      hubs: [HUB.dubai],
      destinationLabel: 'Larnaca Airport',
      destination: P.larnaca,
      sources: PERMIT_SOURCES,
    }),
  ],
  CZE: [
    air({
      id: 'india-czechia-ict-prague',
      label: 'India · ICT / engineering employee card · Prague Airport',
      originLabel: 'Bengaluru, India',
      origin: P.bengaluru,
      hubs: [HUB.dubai],
      destinationLabel: 'Prague Airport',
      destination: P.pragueAirport,
      sources: PERMIT_SOURCES,
    }),
  ],
  DNK: [
    air({
      id: 'india-denmark-paylimit-copenhagen',
      label: 'India · pay-limit / positive-list scheme · Copenhagen Airport',
      originLabel: 'Delhi, India',
      origin: P.delhi,
      hubs: [HUB.doha],
      destinationLabel: 'Copenhagen Airport',
      destination: P.copenhagenAirport,
      sources: PERMIT_SOURCES,
    }),
  ],
  EST: [
    air({
      id: 'india-estonia-ict-tallinn',
      label: 'India · ICT specialist / study · Tallinn Airport',
      originLabel: 'Delhi, India',
      origin: P.delhi,
      hubs: [HUB.istanbul],
      destinationLabel: 'Tallinn Airport',
      destination: P.tallinnAirport,
      sources: PERMIT_SOURCES,
    }),
  ],
  FIN: [
    air({
      id: 'india-finland-ict-care-helsinki',
      label: 'India · ICT specialist / health-care recruitment · Helsinki Airport',
      originLabel: 'Kochi, India',
      origin: P.kochi,
      hubs: [HUB.doha],
      destinationLabel: 'Helsinki Airport',
      destination: P.helsinkiAirport,
      sources: LABOUR_SOURCES,
    }),
  ],
  GRC: [
    mixed({
      id: 'india-greece-agricultural-manolada',
      label: 'India · bilateral seasonal agriculture · Athens · Manolada farm belt',
      status: 'regular',
      originLabel: 'Amritsar, India',
      legs: [
        { mode: 'air', waypoints: [P.amritsar, P.delhi, P.dubai, P.athensAirport] },
        { mode: 'land', waypoints: [...PATH.athensToManolada] },
      ],
      destinationLabel: 'Manolada / Ilia farm belt',
      destinationType: 'land entry',
      transitLabels: [
        HUB.delhi,
        HUB.dubai,
        { code: 'GRC', label: 'Athens Airport', coordinate: P.athensAirport },
      ],
      sources: LABOUR_SOURCES,
    }),
  ],
  HUN: [
    air({
      id: 'india-hungary-guest-worker-budapest',
      label: 'India · guest-worker scheme · Budapest Airport',
      originLabel: 'Delhi, India',
      origin: P.delhi,
      hubs: [HUB.dubai],
      destinationLabel: 'Budapest Airport',
      destination: P.budapestAirport,
      sources: LABOUR_SOURCES,
    }),
    balkanRoute(
      'india-serbia-hungary-roszke',
      'India · Serbia visa-free hub · Subotica · Röszke',
      'Röszke',
      [...PATH.belgradeToRoszke],
      [{ code: 'SRB', label: 'Subotica', coordinate: P.subotica }],
    ),
  ],
  IRL: [
    air({
      id: 'india-ireland-critical-skills-dublin',
      label: 'India · critical-skills employment permit · Dublin Airport',
      originLabel: 'Delhi, India',
      origin: P.delhi,
      hubs: [HUB.dubai],
      destinationLabel: 'Dublin Airport',
      destination: P.dublinAirport,
      sources: PERMIT_SOURCES,
    }),
  ],
  LVA: [
    air({
      id: 'india-latvia-labour-riga',
      label: 'India · logistics / services work permit · Riga Airport',
      originLabel: 'Delhi, India',
      origin: P.delhi,
      hubs: [HUB.istanbul],
      destinationLabel: 'Riga Airport',
      destination: P.rigaAirport,
      sources: LABOUR_SOURCES,
    }),
  ],
  LTU: [
    air({
      id: 'india-lithuania-drivers-vilnius',
      label: 'India · long-haul driver / logistics recruitment · Vilnius Airport',
      originLabel: 'Delhi, India',
      origin: P.delhi,
      hubs: [HUB.istanbul],
      destinationLabel: 'Vilnius Airport',
      destination: P.vilniusAirport,
      sources: LABOUR_SOURCES,
    }),
  ],
  LUX: [
    air({
      id: 'india-luxembourg-finance-ict',
      label: 'India · finance / ICT salaried worker · Luxembourg Airport',
      originLabel: 'Delhi, India',
      origin: P.delhi,
      hubs: [HUB.dubai],
      destinationLabel: 'Luxembourg Airport',
      destination: P.luxembourgAirport,
      sources: PERMIT_SOURCES,
    }),
  ],
  MLT: [
    air({
      id: 'india-malta-services-luqa',
      label: 'India · third-country services / gaming and hospitality · Malta Airport',
      originLabel: 'Delhi, India',
      origin: P.delhi,
      hubs: [HUB.dubai],
      destinationLabel: 'Malta Airport',
      destination: P.maltaAirport,
      sources: LABOUR_SOURCES,
    }),
  ],
  NLD: [
    air({
      id: 'india-netherlands-knowledge-migrant-schiphol',
      label: 'India · highly skilled / knowledge migrant · Schiphol',
      originLabel: 'Bengaluru, India',
      origin: P.bengaluru,
      hubs: [HUB.dubai],
      destinationLabel: 'Schiphol',
      destination: P.schiphol,
      sources: PERMIT_SOURCES,
    }),
  ],
  POL: [
    air({
      id: 'india-poland-work-visa-warsaw',
      label: 'India · work visa / ICT and logistics · Warsaw Airport',
      originLabel: 'Delhi, India',
      origin: P.delhi,
      hubs: [HUB.dubai],
      destinationLabel: 'Warsaw Airport',
      destination: P.warsawAirport,
      sources: LABOUR_SOURCES,
    }),
  ],
  PRT: [
    mixed({
      id: 'india-portugal-odemira-agriculture',
      label: 'India · Alentejo greenhouse labour · Lisbon · Odemira',
      status: 'regular',
      originLabel: 'Mumbai, India',
      legs: [
        { mode: 'air', waypoints: [P.mumbai, P.dubai, P.lisbonAirport] },
        { mode: 'land', waypoints: [...PATH.lisbonToOdemira] },
      ],
      destinationLabel: 'Odemira / Alentejo greenhouse belt',
      destinationType: 'land entry',
      transitLabels: [
        HUB.dubai,
        { code: 'PRT', label: 'Lisbon Airport', coordinate: P.lisbonAirport },
      ],
      sources: LABOUR_SOURCES,
    }),
  ],
  ROU: [
    air({
      id: 'india-romania-construction-otopeni',
      label: 'India · construction / HORECA work permit · Bucharest Otopeni',
      originLabel: 'Delhi, India',
      origin: P.delhi,
      hubs: [HUB.istanbul],
      destinationLabel: 'Bucharest Otopeni',
      destination: P.otopeni,
      sources: LABOUR_SOURCES,
    }),
  ],
  SVK: [
    air({
      id: 'india-slovakia-industry-bratislava',
      label: 'India · industrial / agency labour permit · Bratislava Airport',
      originLabel: 'Delhi, India',
      origin: P.delhi,
      hubs: [HUB.istanbul],
      destinationLabel: 'Bratislava Airport',
      destination: P.bratislavaAirport,
      sources: LABOUR_SOURCES,
    }),
  ],
  SVN: [
    air({
      id: 'india-slovenia-logistics-ljubljana',
      label: 'India · construction / logistics work permit · Ljubljana Airport',
      originLabel: 'Delhi, India',
      origin: P.delhi,
      hubs: [HUB.istanbul],
      destinationLabel: 'Ljubljana Airport',
      destination: P.ljubljanaAirport,
      sources: LABOUR_SOURCES,
    }),
  ],
  ESP: [
    mixed({
      id: 'india-spain-catalonia-barajas',
      label: 'India · Punjabi and Sindhi settlement · Madrid · Catalonia',
      status: 'regular',
      originLabel: 'Jalandhar, India',
      legs: [
        { mode: 'air', waypoints: [P.jalandhar, P.delhi, P.dubai, P.barajas] },
        { mode: 'land', waypoints: [P.madrid, P.zaragoza, P.barcelona] },
      ],
      destinationLabel: 'Barcelona / Catalonia',
      destinationType: 'land entry',
      transitLabels: [
        HUB.delhi,
        HUB.dubai,
        { code: 'ESP', label: 'Madrid Barajas', coordinate: P.barajas },
      ],
      sources: [EUROSTAT_IMMIGRATION, MEA_OVERSEAS_INDIANS, UN_MIGRANT_STOCK_2024],
    }),
  ],
  SWE: [
    air({
      id: 'india-sweden-ict-arlanda',
      label: 'India · ICT work permit · Stockholm Arlanda',
      originLabel: 'Bengaluru, India',
      origin: P.bengaluru,
      hubs: [HUB.doha],
      destinationLabel: 'Stockholm Arlanda',
      destination: P.arlanda,
      sources: PERMIT_SOURCES,
    }),
  ],

  // --- Deep-dataset destinations -------------------------------------------
  DEU: [
    air({
      id: 'india-germany-bluecard-frankfurt',
      label: 'India · EU Blue Card / skilled-labour strategy · Frankfurt Airport',
      originLabel: 'Delhi, India',
      origin: P.delhi,
      hubs: [HUB.dubai],
      destinationLabel: 'Frankfurt Airport',
      destination: P.frankfurtAirport,
      sources: PERMIT_SOURCES,
    }),
    air({
      id: 'india-germany-students-munich',
      label: 'India · largest foreign student group · Munich Airport',
      originLabel: 'Hyderabad, India',
      origin: P.hyderabad,
      hubs: [HUB.doha],
      destinationLabel: 'Munich Airport',
      destination: P.munichAirport,
      sources: [EUROSTAT_PERMITS, OECD_MIGRATION_OUTLOOK, UN_MIGRANT_STOCK_2024],
    }),
    air({
      id: 'india-germany-nursing-frankfurt',
      label: 'India · Kerala nursing recruitment · Frankfurt Airport',
      originLabel: 'Kochi, India',
      origin: P.kochi,
      hubs: [HUB.doha],
      destinationLabel: 'Frankfurt Airport',
      destination: P.frankfurtAirport,
      sources: LABOUR_SOURCES,
    }),
  ],
  FRA: [
    air({
      id: 'india-france-students-ict-cdg',
      label: 'India · student mobility / ICT services · Paris Charles de Gaulle',
      originLabel: 'Delhi, India',
      origin: P.delhi,
      hubs: [HUB.dubai],
      destinationLabel: 'Paris Charles de Gaulle',
      destination: P.cdg,
      sources: PERMIT_SOURCES,
    }),
    air({
      id: 'india-france-intra-corporate-cdg',
      label: 'India · intra-corporate transfer / talent passport · Paris Charles de Gaulle',
      originLabel: 'Mumbai, India',
      origin: P.mumbai,
      hubs: [HUB.dubai],
      destinationLabel: 'Paris Charles de Gaulle',
      destination: P.cdg,
      sources: [EUROSTAT_PERMITS, OECD_MIGRATION_OUTLOOK, MEA_OVERSEAS_INDIANS],
    }),
  ],
  ITA: [
    mixed({
      id: 'india-italy-agro-pontino-latina',
      label: 'India · Punjabi farm labour · Rome Fiumicino · Agro Pontino',
      status: 'regular',
      originLabel: 'Amritsar, India',
      legs: [
        { mode: 'air', waypoints: [P.amritsar, P.delhi, P.dubai, P.fiumicino] },
        { mode: 'land', waypoints: [...PATH.fiumicinoToLatina] },
      ],
      destinationLabel: 'Latina / Agro Pontino',
      destinationType: 'land entry',
      transitLabels: [
        HUB.delhi,
        HUB.dubai,
        { code: 'ITA', label: 'Rome Fiumicino', coordinate: P.fiumicino },
      ],
      sources: [EUROSTAT_IMMIGRATION, OECD_MIGRATION_OUTLOOK, MEA_OVERSEAS_INDIANS],
    }),
    air({
      id: 'india-italy-lombardy-dairy-malpensa',
      label: 'India · Lombardy dairy and livestock labour · Milan Malpensa',
      originLabel: 'Jalandhar, India',
      origin: P.jalandhar,
      hubs: [HUB.delhi, HUB.dubai],
      destinationLabel: 'Milan Malpensa',
      destination: P.milanMalpensa,
      sources: LABOUR_SOURCES,
    }),
  ],
  GBR: [
    air({
      id: 'india-uk-skilled-worker-heathrow',
      label: 'India · leading skilled-worker and student nationality · Heathrow',
      originLabel: 'Delhi, India',
      origin: P.delhi,
      hubs: [HUB.dubai],
      destinationLabel: 'Heathrow',
      destination: P.heathrow,
      sources: [UK_WORK_VISAS, MEA_OVERSEAS_INDIANS, UN_MIGRANT_STOCK_2024],
    }),
    air({
      id: 'india-uk-health-care-kerala-heathrow',
      label: 'India · health and care worker visa (Kerala nursing) · Heathrow',
      originLabel: 'Kochi, India',
      origin: P.kochi,
      hubs: [HUB.dubai],
      destinationLabel: 'Heathrow',
      destination: P.heathrow,
      sources: [UK_WORK_VISAS, MEA_OVERSEAS_INDIANS],
    }),
    mixed({
      id: 'india-uk-punjabi-midlands-birmingham',
      label: 'India · Punjabi family and settlement · Heathrow · West Midlands',
      status: 'regular',
      originLabel: 'Amritsar, India',
      legs: [
        { mode: 'air', waypoints: [P.amritsar, P.delhi, P.dubai, P.heathrow] },
        { mode: 'land', waypoints: [...PATH.heathrowToBirmingham] },
      ],
      destinationLabel: 'Birmingham / West Midlands',
      destinationType: 'land entry',
      transitLabels: [
        HUB.delhi,
        HUB.dubai,
        { code: 'GBR', label: 'Heathrow', coordinate: P.heathrow },
      ],
      sources: [UK_WORK_VISAS, MEA_OVERSEAS_INDIANS, UN_MIGRANT_STOCK_2024],
    }),
    mixed({
      id: 'india-serbia-channel-dover',
      label: 'India · Serbia visa-free hub · Italy · France · English Channel · Dover',
      status: 'irregular',
      originLabel: 'Delhi, India',
      legs: [
        { mode: 'air', waypoints: [...PATH.delhiToBelgradeAir] },
        {
          mode: 'land',
          waypoints: joinPaths(
            PATH.belgradeAirportToBelgrade,
            PATH.belgradeToBajakovo,
            PATH.bajakovoToZagreb,
            PATH.zagrebToTrieste,
            PATH.triesteToMenton,
            PATH.mentonToParis,
            PATH.parisToCalais,
          ),
        },
        { mode: 'sea', waypoints: [...PATH.calaisToDoverSea] },
      ],
      destinationLabel: 'Dover',
      destinationType: 'sea entry',
      transitLabels: [
        HUB.dubai,
        { code: 'SRB', label: 'Belgrade (visa-free until 2023)', coordinate: P.belgradeAirport },
        { code: 'ITA', label: 'Trieste', coordinate: P.trieste },
        { code: 'FRA', label: 'Calais', coordinate: P.calais },
      ],
      sources: [UK_WORK_VISAS, FRONTEX_ROUTE_MAP, IOM_ROUTE_MONITORING],
    }),
  ],

  // --- United States --------------------------------------------------------
  // The extra-corridor set already carries Delhi → JFK for study / H-1B; these add the
  // other dominant lawful destinations plus the two documented irregular approaches.
  USA: [
    air({
      id: 'india-usa-h1b-bay-area-sfo',
      label: 'India · H-1B / tech employment · San Francisco',
      originLabel: 'Hyderabad, India',
      origin: P.hyderabad,
      hubs: [HUB.dubai],
      destinationLabel: 'San Francisco International',
      destination: P.sfo,
      sources: [DHS_YEARBOOK, MEA_OVERSEAS_INDIANS],
    }),
    air({
      id: 'india-usa-students-chicago',
      label: 'India · leading international-student nationality · Chicago O’Hare',
      originLabel: 'Delhi, India',
      origin: P.delhi,
      hubs: [HUB.doha],
      destinationLabel: 'Chicago O’Hare',
      destination: P.chicagoOHare,
      sources: [DHS_YEARBOOK, MEA_OVERSEAS_INDIANS],
    }),
    air({
      id: 'india-usa-family-newark',
      label: 'India · family-sponsored permanent residence · Newark',
      originLabel: 'Ahmedabad, India',
      origin: P.ahmedabad,
      hubs: [HUB.dubai],
      destinationLabel: 'Newark Liberty',
      destination: P.newark,
      sources: [DHS_YEARBOOK, MEA_OVERSEAS_INDIANS, UN_MIGRANT_STOCK_2024],
    }),
    mixed({
      id: 'india-usa-darien-southwest-border',
      label: 'India · Latin America staging · Darién Gap · Mexico · El Paso',
      status: 'irregular',
      originLabel: 'Delhi, India',
      legs: [
        { mode: 'air', waypoints: [P.delhi, P.dubai, P.bogota] },
        {
          mode: 'land',
          waypoints: joinPaths(
            PATH.bogotaToNecocli,
            PATH.necocliToTapachula,
            PATH.tapachulaToElPaso,
          ),
        },
      ],
      destinationLabel: 'El Paso',
      destinationType: 'land entry',
      transitLabels: [
        HUB.dubai,
        { code: 'COL', label: 'Necoclí', coordinate: P.necocli },
        { code: 'PAN', label: 'Darién Gap', coordinate: P.darienGap },
        { code: 'MEX', label: 'Tapachula', coordinate: P.tapachula },
      ],
      sources: [CBP_SOUTHWEST, UNHCR_DARIEN, IOM_ROUTE_MONITORING],
    }),
    mixed({
      id: 'india-usa-northern-border-niagara',
      label: 'India · Canada visa staging · northern border · Niagara',
      status: 'irregular',
      originLabel: 'Ahmedabad, India',
      legs: [
        { mode: 'air', waypoints: [P.ahmedabad, P.dubai, P.torontoPearson] },
        { mode: 'land', waypoints: [...PATH.torontoToNiagara] },
      ],
      destinationLabel: 'Niagara / northern border',
      destinationType: 'land entry',
      transitLabels: [
        HUB.dubai,
        { code: 'CAN', label: 'Toronto Pearson', coordinate: P.torontoPearson },
      ],
      sources: [CBP_NATIONWIDE, IOM_ROUTE_MONITORING],
    }),
  ],

  // --- Non-EU Europe --------------------------------------------------------
  NOR: [
    air({
      id: 'india-norway-skilled-oslo',
      label: 'India · skilled-worker residence permit · Oslo Airport',
      originLabel: 'Delhi, India',
      origin: P.delhi,
      hubs: [HUB.doha],
      destinationLabel: 'Oslo Airport',
      destination: P.osloAirport,
      sources: [OECD_MIGRATION_OUTLOOK, MEA_OVERSEAS_INDIANS, UN_MIGRANT_STOCK_2024],
    }),
  ],
  CHE: [
    air({
      id: 'india-switzerland-ict-pharma-zurich',
      label: 'India · ICT and pharma specialist permit · Zurich Airport',
      originLabel: 'Bengaluru, India',
      origin: P.bengaluru,
      hubs: [HUB.dubai],
      destinationLabel: 'Zurich Airport',
      destination: P.zurichAirport,
      sources: [OECD_MIGRATION_OUTLOOK, MEA_OVERSEAS_INDIANS, UN_MIGRANT_STOCK_2024],
    }),
  ],
  ISL: [
    air({
      id: 'india-iceland-services-keflavik',
      label: 'India · tourism and construction labour · Keflavík',
      originLabel: 'Delhi, India',
      origin: P.delhi,
      hubs: [HUB.dubai, { code: 'DNK', label: 'Copenhagen air hub', coordinate: P.copenhagenAirport }],
      destinationLabel: 'Keflavík',
      destination: P.keflavik,
      sources: [OECD_MIGRATION_OUTLOOK, UN_MIGRANT_STOCK_2024],
    }),
  ],
  SRB: [
    air({
      id: 'india-serbia-visa-free-belgrade',
      label: 'India · Belgrade visa-free air hub (suspended January 2023)',
      originLabel: 'Delhi, India',
      origin: P.delhi,
      hubs: [HUB.dubai],
      destinationLabel: 'Belgrade Airport',
      destination: P.belgradeAirport,
      sources: BALKAN_SOURCES,
    }),
  ],
  BIH: [
    balkanRoute(
      'india-serbia-bosnia-bihac',
      'India · Serbia visa-free hub · Tuzla · Una-Sana canton',
      'Bihać / Una-Sana canton',
      [...PATH.belgradeToBihac],
      [{ code: 'BIH', label: 'Tuzla', coordinate: P.tuzla }],
    ),
  ],
};
