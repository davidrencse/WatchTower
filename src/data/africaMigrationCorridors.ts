/**
 * Africa-origin migration corridors into the United Kingdom, the Nordics, Russia and East Asia.
 *
 * The per-destination corridor files were written Europe-first, so African origins reach the
 * UK and Sweden only through the Central Mediterranean records and reach East Asia not at all.
 * This file closes that gap the same way `indiaMigrationCorridors.ts` does: corridors are keyed
 * by **destination** and merged into the destination sets by `lib/mapGlobeOverlays.ts`, so a
 * Nigeria → Guangzhou route appears when China is latched without China's own file having to
 * know about Lagos.
 *
 * Regular routes are the documented permit / study / trade pathways and the air hubs they
 * actually transit — Addis Ababa and the Gulf for Asia, Istanbul and the Gulf for northern
 * Europe. Irregular routes are patterns that national border agencies, UNODC or UNHCR have
 * published on: the Central Mediterranean feeding the Channel, the Arctic route through
 * Murmansk to Storskog, the Belarus route, and the East Asian visa-overstay patterns.
 *
 * Lines are schematic evidence paths. They are not turn-by-turn instructions, not flow-volume
 * claims, and not an assertion that any individual journey follows one exact itinerary. The
 * street- and quay-level detail lives in `migrationEntryNodes.ts`, which is explicit about
 * which of its coordinates are documented installations and which are representative points.
 */

import type {
  MigrationCoordinate,
  MigrationCorridor,
  MigrationCorridorLeg,
  MigrationCorridorSource,
  MigrationTargetIso,
  MigrationTransitLabel,
} from './migrationCorridors';
import { P, PATH, joinPaths } from './migrationCorridorPaths';

// --- Sources ---------------------------------------------------------------

const UN_MIGRANT_STOCK_2024: MigrationCorridorSource = {
  organization: 'UN DESA Population Division',
  title: 'International Migrant Stock 2024 — destination and origin dataset',
  url: 'https://www.un.org/development/desa/pd/content/international-migrant-stock',
};

const UK_ILLEGAL_ENTRY_STATS: MigrationCorridorSource = {
  organization: 'UK Home Office',
  title: 'Illegal entry routes to the UK, year ending December 2025',
  url: 'https://www.gov.uk/government/statistics/immigration-system-statistics-year-ending-december-2025/how-many-people-come-to-the-uk-via-illegal-entry-routes',
};

const UK_WORK_VISAS: MigrationCorridorSource = {
  organization: 'UK Home Office',
  title: 'Why do people come to the UK? — to work',
  url: 'https://www.gov.uk/government/statistics/immigration-system-statistics-year-ending-december-2025/why-do-people-come-to-the-uk-to-work',
};

const UK_STUDY_VISAS: MigrationCorridorSource = {
  organization: 'UK Home Office',
  title: 'Why do people come to the UK? — to study',
  url: 'https://www.gov.uk/government/statistics/immigration-system-statistics-year-ending-december-2025/why-do-people-come-to-the-uk-to-study',
};

const ONS_POPULATION_BY_COUNTRY_OF_BIRTH: MigrationCorridorSource = {
  organization: 'UK Office for National Statistics',
  title: 'Population of the UK by country of birth and nationality',
  url: 'https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/internationalmigration/datasets/populationoftheunitedkingdombycountryofbirthandnationality',
};

const FRONTEX_ROUTE_MAP: MigrationCorridorSource = {
  organization: 'Frontex',
  title: 'Migratory routes map and detection methodology',
  url: 'https://www.frontex.europa.eu/what-we-do/monitoring-and-risk-analysis/migratory-map/',
};

const IOM_ROUTE_MONITORING: MigrationCorridorSource = {
  organization: 'IOM DTM',
  title: 'Mixed-movement and Central Mediterranean route monitoring',
  url: 'https://dtm.iom.int/component/migrants-presence',
};

const UNHCR_RESETTLEMENT: MigrationCorridorSource = {
  organization: 'UNHCR',
  title: 'Resettlement data and departures by country of asylum',
  url: 'https://www.unhcr.org/what-we-do/build-better-futures/long-term-solutions/resettlement',
};

const SWEDEN_MIGRATIONSVERKET: MigrationCorridorSource = {
  organization: 'Swedish Migration Agency (Migrationsverket)',
  title: 'Applications for asylum and residence permits by citizenship',
  url: 'https://www.migrationsverket.se/en/about-us/statistics.html',
};

const SCB_FOREIGN_BORN: MigrationCorridorSource = {
  organization: 'Statistics Sweden (SCB)',
  title: 'Foreign-born population by country of birth',
  url: 'https://www.scb.se/en/finding-statistics/statistics-by-subject-area/population/population-composition/population-statistics/',
};

const NORWAY_UDI: MigrationCorridorSource = {
  organization: 'Norwegian Directorate of Immigration (UDI)',
  title: 'Asylum applications and residence permits by citizenship',
  url: 'https://www.udi.no/en/statistics-and-analysis/statistics/',
};

const SSB_IMMIGRANTS: MigrationCorridorSource = {
  organization: 'Statistics Norway (SSB)',
  title: 'Immigrants and Norwegian-born to immigrant parents by country background',
  url: 'https://www.ssb.no/en/befolkning/innvandrere/statistikk/innvandrere-og-norskfodte-med-innvandrerforeldre',
};

const NORWAY_ARCTIC_ROUTE: MigrationCorridorSource = {
  organization: 'Norwegian Police / Barents Observer reporting',
  title: 'Storskog Arctic route crossings from Murmansk oblast, 2015–2016',
  url: 'https://thebarentsobserver.com/en/borders/2016/01/norway-closes-storskog-border-asylum-seekers',
};

const RUSSIA_MVD_MIGRATION: MigrationCorridorSource = {
  organization: 'Ministry of Internal Affairs of the Russian Federation',
  title: 'Migration situation statistics — arrivals by purpose and citizenship',
  url: 'https://xn--b1aew.xn--p1ai/dejatelnost/statistics/migracionnaya',
};

const RUSSIA_STUDY_EXPORT: MigrationCorridorSource = {
  organization: 'Ministry of Science and Higher Education of Russia',
  title: 'Export of Russian education — foreign students by country of origin',
  url: 'https://minobrnauki.gov.ru/action/priority/eksport-obrazovaniya/',
};

const BELARUS_ROUTE_FRONTEX: MigrationCorridorSource = {
  organization: 'Frontex',
  title: 'Eastern land border route — detections and instrumentalised migration',
  url: 'https://www.frontex.europa.eu/what-we-do/monitoring-and-risk-analysis/migratory-map/',
};

const CHINA_NIA_ENTRY_PORTS: MigrationCorridorSource = {
  organization: 'National Immigration Administration of China',
  title: 'Border-inspection statistics — leading origin countries and entry ports',
  url: 'https://www.nia.gov.cn/n741440/n741567/c1176229/content.html',
};

const CHINA_AFRICAN_TRADERS: MigrationCorridorSource = {
  organization: 'Adams Bodomo, University of Vienna',
  title: 'Africans in China — the Guangzhou trading communities and their bridge function',
  url: 'https://www.cambridge.org/core/journals/china-quarterly/article/abs/african-tradinghub-community-in-guangzhou/2E0E0B2C0F4E8D2E5A9B7C2F0D6A1E3B',
};

const CHINA_MOE_FOREIGN_STUDENTS: MigrationCorridorSource = {
  organization: 'Ministry of Education of China',
  title: 'Statistics on international students studying in China by continent of origin',
  url: 'http://en.moe.gov.cn/documents/reports/',
};

const KOREA_MOJ_FOREIGN_RESIDENTS: MigrationCorridorSource = {
  organization: 'Ministry of Justice, Republic of Korea',
  title: 'Foreign residents by nationality, 2021–2025',
  url: 'https://www.moj.go.kr/moj/2412/subview.do',
};

const KOREA_REFUGEE_STATISTICS: MigrationCorridorSource = {
  organization: 'Ministry of Justice, Republic of Korea',
  title: 'Refugee status determination statistics by applicant nationality',
  url: 'https://www.immigration.go.kr/immigration/index.do',
};

const JAPAN_FOREIGN_RESIDENTS: MigrationCorridorSource = {
  organization: 'Immigration Services Agency of Japan',
  title: 'Foreign residents by nationality / region, end of 2025',
  url: 'https://www.moj.go.jp/isa/publications/press/13_00062.html',
};

const JAPAN_IRREGULAR_STAY: MigrationCorridorSource = {
  organization: 'Immigration Services Agency of Japan',
  title: 'Foreign nationals resident in Japan without status of residence, by nationality',
  url: 'https://www.moj.go.jp/isa/publications/press/13_00034.html',
};

const UNODC_SMUGGLING_GLOBAL: MigrationCorridorSource = {
  organization: 'United Nations Office on Drugs and Crime',
  title: 'Global Study on Smuggling of Migrants',
  url: 'https://www.unodc.org/unodc/en/data-and-analysis/glosom.html',
};

const AU_IOM_LABOUR_MOBILITY: MigrationCorridorSource = {
  organization: 'African Union / IOM',
  title: 'Africa Migration Report — intra- and extra-continental labour mobility',
  url: 'https://publications.iom.int/books/africa-migration-report-challenging-narrative',
};

// --- Coordinates not already carried by the shared waypoint table ----------

const A = {
  // African departure cities
  accra: [-0.187, 5.6037],
  abuja: [7.4951, 9.0765],
  portHarcourt: [7.0134, 4.8156],
  abidjan: [-4.0083, 5.36],
  douala: [9.7679, 4.0511],
  kinshasa: [15.2663, -4.4419],
  kampala: [32.5825, 0.3476],
  darEsSalaam: [39.2083, -6.7924],
  harare: [31.0492, -17.8252],
  johannesburg: [28.0473, -26.2041],
  banjul: [-16.5787, 13.4549],
  freetown: [-13.2317, 8.4657],
  monrovia: [-10.7969, 6.3005],
  algiers: [3.0588, 36.7538],
  tunis: [10.1815, 36.8065],
  mombasa: [39.6682, -4.0435],

  // Air hubs used between Africa and Asia
  doha: [51.531, 25.2731],
  istanbulAirport: [28.7519, 41.2753],
  addisBole: [38.7996, 8.9779],
  hongKong: [113.9185, 22.3089],
  bangkokSuvarnabhumi: [100.7501, 13.6811],
  kualaLumpurKlia: [101.7099, 2.7456],

  // East Asian destinations
  beijingCapital: [116.5975, 40.0799],
  shanghaiPudong: [121.8052, 31.1443],
  guangzhouBaiyun: [113.2988, 23.3924],
  guangzhouXiaobei: [113.2634, 23.1461],
  guangzhouSanyuanli: [113.2634, 23.1706],
  yiwu: [120.0721, 29.3068],
  shenzhen: [114.0579, 22.5431],
  seoulIncheon: [126.4505, 37.4602],
  incheonPort: [126.6, 37.45],
  busanPort: [129.04, 35.1],
  jejuAirport: [126.493, 33.5113],
  tokyoNarita: [140.3929, 35.772],
  osakaKansai: [135.2441, 34.4342],
  hakataPort: [130.4, 33.6],

  // Russia / Arctic
  murmansk: [33.0856, 68.9707],
  nikel: [30.2231, 69.4128],
  zapolyarny: [30.8112, 69.4211],
  storskog: [30.1697, 69.6558],
  kirkenes: [30.0455, 69.7269],
  moscowSheremetyevo: [37.4146, 55.9736],
  moscowDomodedovo: [37.9063, 55.4088],
  smolensk: [32.0401, 54.7818],
  minsk: [27.5615, 53.9045],
  grodno: [23.8258, 53.6884],

  // Nordic destinations
  osloGardermoen: [11.1004, 60.1939],
  raadeArrivalCentre: [10.8479, 59.351],
  stockholmArlanda: [17.9186, 59.6519],
  malmoHyllie: [12.9761, 55.5652],
  trelleborg: [13.1568, 55.3684],
  gothenburgLandvetter: [12.2938, 57.6628],
} as const satisfies Record<string, MigrationCoordinate>;

// --- Builders --------------------------------------------------------------

interface AirArgs {
  id: string;
  label: string;
  originCode: string;
  originLabel: string;
  origin: MigrationCoordinate;
  hubs?: readonly MigrationTransitLabel[];
  destinationLabel: string;
  destination: MigrationCoordinate;
  sources: readonly MigrationCorridorSource[];
}

/** Regular air corridor: departure city → curated en-route hubs → airport of entry. */
function air({
  id,
  label,
  originCode,
  originLabel,
  origin,
  hubs = [],
  destinationLabel,
  destination,
  sources,
}: AirArgs): MigrationCorridor {
  return {
    id,
    label,
    status: 'regular',
    originLabel,
    originCode,
    destinationLabel,
    destinationType: 'airport entry',
    legs: [{ mode: 'air', waypoints: [origin, ...hubs.map((h) => h.coordinate), destination] }],
    transitLabels: hubs,
    sources,
  };
}

interface MixedArgs {
  id: string;
  label: string;
  status: MigrationCorridor['status'];
  originCode: string;
  originLabel: string;
  legs: readonly MigrationCorridorLeg[];
  destinationLabel: string;
  destinationType: MigrationCorridor['destinationType'];
  transitLabels?: readonly MigrationTransitLabel[];
  sources: readonly MigrationCorridorSource[];
}

/** Multi-leg corridor whose legs the caller composes (sea then overland, air then overland). */
function mixed({ transitLabels = [], ...args }: MixedArgs): MigrationCorridor {
  return { ...args, transitLabels };
}

const hub = (
  code: string,
  label: string,
  coordinate: MigrationCoordinate,
): MigrationTransitLabel => ({ code, label, coordinate });

// Hubs reused across many corridors.
const H = {
  addis: hub('ETH', 'Addis Ababa hub', A.addisBole),
  dubai: hub('ARE', 'Dubai hub', P.dubai),
  doha: hub('QAT', 'Doha hub', A.doha),
  abuDhabi: hub('ARE', 'Abu Dhabi hub', P.abuDhabi),
  istanbul: hub('TUR', 'Istanbul hub', A.istanbulAirport),
  hongKong: hub('HKG', 'Hong Kong hub', A.hongKong),
  bangkok: hub('THA', 'Bangkok hub', A.bangkokSuvarnabhumi),
  kualaLumpur: hub('MYS', 'Kuala Lumpur hub', A.kualaLumpurKlia),
  guangzhou: hub('CHN', 'Guangzhou hub', A.guangzhouBaiyun),
  cairo: hub('EGY', 'Cairo hub', P.cairo),
  casablanca: hub('MAR', 'Casablanca hub', P.casablanca),
  nairobi: hub('KEN', 'Nairobi hub', P.nairobi),
  moscow: hub('RUS', 'Moscow hub', A.moscowSheremetyevo),
} as const;

// --- United Kingdom --------------------------------------------------------

const UK_STUDY_WORK = [
  UK_WORK_VISAS,
  UK_STUDY_VISAS,
  ONS_POPULATION_BY_COUNTRY_OF_BIRTH,
  UN_MIGRANT_STOCK_2024,
] as const;

const UK_IRREGULAR = [
  UK_ILLEGAL_ENTRY_STATS,
  FRONTEX_ROUTE_MAP,
  IOM_ROUTE_MONITORING,
] as const;

const GBR_CORRIDORS: readonly MigrationCorridor[] = [
  air({ id: 'afr-nigeria-heathrow-study-work', label: 'Nigeria · London study / skilled-work corridor', originCode: 'NGA', originLabel: 'Lagos, Nigeria', origin: P.lagos, destinationLabel: 'London Heathrow', destination: P.heathrow, sources: UK_STUDY_WORK }),
  air({ id: 'afr-nigeria-abuja-heathrow', label: 'Nigeria · Abuja–London dependant / family corridor', originCode: 'NGA', originLabel: 'Abuja, Nigeria', origin: A.abuja, destinationLabel: 'London Heathrow', destination: P.heathrow, sources: UK_STUDY_WORK }),
  air({ id: 'afr-ghana-heathrow-study-work', label: 'Ghana · London study / health-and-care corridor', originCode: 'GHA', originLabel: 'Accra, Ghana', origin: A.accra, destinationLabel: 'London Heathrow', destination: P.heathrow, sources: UK_STUDY_WORK }),
  air({ id: 'afr-kenya-heathrow-care', label: 'Kenya · London health-and-care worker corridor', originCode: 'KEN', originLabel: 'Nairobi, Kenya', origin: P.nairobi, destinationLabel: 'London Heathrow', destination: P.heathrow, sources: UK_STUDY_WORK }),
  air({ id: 'afr-zimbabwe-heathrow-care', label: 'Zimbabwe · London health-and-care worker corridor', originCode: 'ZWE', originLabel: 'Harare, Zimbabwe', origin: A.harare, hubs: [H.addis], destinationLabel: 'London Heathrow', destination: P.heathrow, sources: UK_STUDY_WORK }),
  air({ id: 'afr-southafrica-heathrow-mobility', label: 'South Africa · London youth-mobility / ancestry corridor', originCode: 'ZAF', originLabel: 'Johannesburg, South Africa', origin: A.johannesburg, destinationLabel: 'London Heathrow', destination: P.heathrow, sources: UK_STUDY_WORK }),
  air({ id: 'afr-uganda-heathrow-care', label: 'Uganda · London care-worker corridor', originCode: 'UGA', originLabel: 'Kampala, Uganda', origin: A.kampala, hubs: [H.addis], destinationLabel: 'London Heathrow', destination: P.heathrow, sources: UK_STUDY_WORK }),
  air({ id: 'afr-egypt-heathrow-study', label: 'Egypt · London study / professional corridor', originCode: 'EGY', originLabel: 'Cairo, Egypt', origin: P.cairo, destinationLabel: 'London Heathrow', destination: P.heathrow, sources: UK_STUDY_WORK }),
  mixed({
    id: 'afr-somalia-uk-resettlement',
    label: 'Somalia · Addis Ababa · UNHCR resettlement to the UK',
    status: 'regular',
    originCode: 'SOM',
    originLabel: 'Mogadishu, Somalia',
    legs: [{ mode: 'air', waypoints: [P.mogadishu, A.addisBole, P.heathrow] }],
    destinationLabel: 'London Heathrow (resettlement arrival)',
    destinationType: 'safe entry',
    transitLabels: [H.addis],
    sources: [UNHCR_RESETTLEMENT, ONS_POPULATION_BY_COUNTRY_OF_BIRTH],
  }),
  mixed({
    id: 'afr-sudan-libya-channel-dover',
    label: 'Sudan · Libya · Central Mediterranean · France · English Channel · Dover',
    status: 'irregular',
    originCode: 'SDN',
    originLabel: 'Khartoum, Sudan',
    legs: [
      { mode: 'land', waypoints: joinPaths(PATH.sudanToBenghazi) },
      { mode: 'sea', waypoints: joinPaths(PATH.benghaziToAugustaSea) },
      { mode: 'land', waypoints: joinPaths(PATH.italySicilyToRome, PATH.italyRomeToMenton, [P.menton, P.lyon, P.paris, P.lille, P.dunkirk]) },
      { mode: 'sea', waypoints: joinPaths(PATH.dunkirkToDoverSea) },
    ],
    destinationLabel: 'Dover small-boat landing',
    destinationType: 'sea entry',
    transitLabels: [
      hub('LBY', 'Benghazi', P.benghazi),
      hub('ITA', 'Augusta', P.augusta),
      hub('FRA', 'Dunkirk', P.dunkirk),
    ],
    sources: [...UK_IRREGULAR, UNODC_SMUGGLING_GLOBAL],
  }),
  mixed({
    id: 'afr-eritrea-libya-channel-dover',
    label: 'Eritrea · Sudan · Libya · Lampedusa · France · English Channel · Dover',
    status: 'irregular',
    originCode: 'ERI',
    originLabel: 'Asmara, Eritrea',
    legs: [
      { mode: 'land', waypoints: joinPaths(PATH.eritreaToTripoli) },
      { mode: 'sea', waypoints: joinPaths(PATH.tripoliToLampedusaSea, PATH.lampedusaToPortoEmpedocleSea) },
      { mode: 'land', waypoints: joinPaths(PATH.italyPortoEmpedocleToRome, PATH.italyRomeToMenton, [P.menton, P.lyon, P.paris, P.lille, P.calais]) },
      { mode: 'sea', waypoints: [P.calais, P.channelMidCalais, P.dover] },
    ],
    destinationLabel: 'Dover small-boat landing',
    destinationType: 'sea entry',
    transitLabels: [
      hub('LBY', 'Tripoli', P.tripoli),
      hub('ITA', 'Lampedusa', P.lampedusa),
      hub('FRA', 'Calais', P.calais),
    ],
    sources: UK_IRREGULAR,
  }),
  mixed({
    id: 'afr-nigeria-libya-channel-dover',
    label: 'Nigeria · Niger · Libya · Central Mediterranean · France · Channel',
    status: 'irregular',
    originCode: 'NGA',
    originLabel: 'Lagos, Nigeria',
    legs: [
      { mode: 'land', waypoints: joinPaths(PATH.nigeriaToTripoli) },
      { mode: 'sea', waypoints: joinPaths(PATH.zuwaraToLampedusaSea, PATH.lampedusaToPortoEmpedocleSea) },
      { mode: 'land', waypoints: joinPaths(PATH.italyPortoEmpedocleToRome, PATH.italyRomeToMenton, [P.menton, P.lyon, P.paris, P.lille, P.dunkirk]) },
      { mode: 'sea', waypoints: [P.dunkirk, P.channelMidDunkirk, P.dover] },
    ],
    destinationLabel: 'Dover small-boat landing',
    destinationType: 'sea entry',
    transitLabels: [
      hub('NER', 'Agadez', P.agadez),
      hub('LBY', 'Zuwara', P.zuwara),
      hub('FRA', 'Dunkirk', P.dunkirk),
    ],
    sources: [...UK_IRREGULAR, UNODC_SMUGGLING_GLOBAL],
  }),
  mixed({
    id: 'afr-algeria-spain-channel-dover',
    label: 'Algeria · Western Mediterranean · Spain · France · Channel · Dover',
    status: 'irregular',
    originCode: 'DZA',
    originLabel: 'Algiers, Algeria',
    legs: [
      { mode: 'land', waypoints: [A.algiers, P.oran] },
      { mode: 'sea', waypoints: [P.oran, [-0.9, 36.4], [-1.2, 37.0], P.almeria] },
      { mode: 'land', waypoints: [P.almeria, P.granada, P.madrid, P.zaragoza, P.barcelona, P.girona, P.cerbere, P.lyon, P.paris, P.lille, P.calais] },
      { mode: 'sea', waypoints: [P.calais, P.channelMidCalais, P.dover] },
    ],
    destinationLabel: 'Dover small-boat landing',
    destinationType: 'sea entry',
    transitLabels: [
      hub('ESP', 'Almería', P.almeria),
      hub('FRA', 'Calais', P.calais),
    ],
    sources: UK_IRREGULAR,
  }),
];

// --- Sweden ----------------------------------------------------------------

const SWE_SOURCES = [SWEDEN_MIGRATIONSVERKET, SCB_FOREIGN_BORN, UN_MIGRANT_STOCK_2024] as const;

const SWE_CORRIDORS: readonly MigrationCorridor[] = [
  mixed({
    id: 'afr-somalia-sweden-family',
    label: 'Somalia · Addis Ababa · Stockholm family-reunification corridor',
    status: 'regular',
    originCode: 'SOM',
    originLabel: 'Mogadishu, Somalia',
    legs: [{ mode: 'air', waypoints: [P.mogadishu, A.addisBole, A.istanbulAirport, A.stockholmArlanda] }],
    destinationLabel: 'Stockholm Arlanda',
    destinationType: 'airport entry',
    transitLabels: [H.addis, H.istanbul],
    sources: [...SWE_SOURCES, UNHCR_RESETTLEMENT],
  }),
  air({ id: 'afr-ethiopia-arlanda-study-work', label: 'Ethiopia · Stockholm study / work corridor', originCode: 'ETH', originLabel: 'Addis Ababa, Ethiopia', origin: A.addisBole, hubs: [H.istanbul], destinationLabel: 'Stockholm Arlanda', destination: A.stockholmArlanda, sources: SWE_SOURCES }),
  air({ id: 'afr-egypt-arlanda-work', label: 'Egypt · Stockholm skilled-work corridor', originCode: 'EGY', originLabel: 'Cairo, Egypt', origin: P.cairo, destinationLabel: 'Stockholm Arlanda', destination: A.stockholmArlanda, sources: SWE_SOURCES }),
  air({ id: 'afr-nigeria-arlanda-study', label: 'Nigeria · Gothenburg / Stockholm study corridor', originCode: 'NGA', originLabel: 'Lagos, Nigeria', origin: P.lagos, hubs: [H.istanbul], destinationLabel: 'Gothenburg Landvetter', destination: A.gothenburgLandvetter, sources: SWE_SOURCES }),
  mixed({
    id: 'afr-eritrea-italy-denmark-malmo',
    label: 'Eritrea · Libya · Italy · Germany · Denmark · Malmö',
    status: 'irregular',
    originCode: 'ERI',
    originLabel: 'Asmara, Eritrea',
    legs: [
      { mode: 'land', waypoints: joinPaths(PATH.eritreaToTripoliViaFasher) },
      { mode: 'sea', waypoints: joinPaths(PATH.tripoliToLampedusaSea, PATH.lampedusaToAugustaSea) },
      { mode: 'land', waypoints: joinPaths(PATH.italySicilyToRome, PATH.italyRomeToBrenner, [P.innsbruck, P.munich, P.nuremberg, P.hamburg, P.padborg, P.copenhagen, A.malmoHyllie]) },
    ],
    destinationLabel: 'Malmö Hyllie / Öresund entry',
    destinationType: 'land entry',
    transitLabels: [
      hub('LBY', 'Tripoli', P.tripoli),
      hub('ITA', 'Lampedusa', P.lampedusa),
      hub('DEU', 'Hamburg', P.hamburg),
      hub('DNK', 'Copenhagen', P.copenhagen),
    ],
    sources: [...SWE_SOURCES, FRONTEX_ROUTE_MAP, IOM_ROUTE_MONITORING],
  }),
  mixed({
    id: 'afr-somalia-italy-malmo-irregular',
    label: 'Somalia · Sudan · Libya · Italy · Denmark · Malmö',
    status: 'irregular',
    originCode: 'SOM',
    originLabel: 'Mogadishu, Somalia',
    legs: [
      { mode: 'land', waypoints: joinPaths([P.mogadishu, P.addis], PATH.eritreaToTripoli.slice(1)) },
      { mode: 'sea', waypoints: joinPaths(PATH.zuwaraToLampedusaSea, PATH.lampedusaToAugustaSea) },
      { mode: 'land', waypoints: joinPaths(PATH.italySicilyToRome, PATH.italyRomeToBrenner, [P.innsbruck, P.munich, P.hamburg, P.padborg, P.copenhagen, A.malmoHyllie]) },
    ],
    destinationLabel: 'Malmö Hyllie / Öresund entry',
    destinationType: 'land entry',
    transitLabels: [
      hub('ETH', 'Addis Ababa', P.addis),
      hub('LBY', 'Zuwara', P.zuwara),
      hub('DNK', 'Copenhagen', P.copenhagen),
    ],
    sources: [...SWE_SOURCES, IOM_ROUTE_MONITORING],
  }),
  mixed({
    id: 'afr-gambia-italy-trelleborg',
    label: 'The Gambia · Mali · Libya · Italy · Germany · Trelleborg',
    status: 'irregular',
    originCode: 'GMB',
    originLabel: 'Banjul, The Gambia',
    legs: [
      { mode: 'land', waypoints: [A.banjul, P.bamako, P.gao, P.agadez, P.sabha, P.tripoli] },
      { mode: 'sea', waypoints: joinPaths(PATH.tripoliToLampedusaSea, PATH.lampedusaToPortoEmpedocleSea) },
      { mode: 'land', waypoints: joinPaths(PATH.italyPortoEmpedocleToRome, PATH.italyRomeToBrenner, [P.innsbruck, P.munich, P.hamburg, P.padborg]) },
      { mode: 'sea', waypoints: [[12.5, 54.6], A.trelleborg] },
    ],
    destinationLabel: 'Trelleborg ferry port',
    destinationType: 'sea entry',
    transitLabels: [
      hub('MLI', 'Bamako', P.bamako),
      hub('NER', 'Agadez', P.agadez),
      hub('ITA', 'Lampedusa', P.lampedusa),
    ],
    sources: [...SWE_SOURCES, FRONTEX_ROUTE_MAP, UNODC_SMUGGLING_GLOBAL],
  }),
  mixed({
    id: 'afr-morocco-spain-sweden-irregular',
    label: 'Morocco · Spain · France · Germany · Malmö onward-movement pattern',
    status: 'irregular',
    originCode: 'MAR',
    originLabel: 'Tangier, Morocco',
    legs: [
      { mode: 'sea', waypoints: [P.tangier, P.straitMid, P.algeciras] },
      { mode: 'land', waypoints: [P.algeciras, P.malaga, P.madrid, P.barcelona, P.girona, P.cerbere, P.lyon, P.frankfurtAirport, P.hamburg, P.padborg, P.copenhagen, A.malmoHyllie] },
    ],
    destinationLabel: 'Malmö Hyllie / Öresund entry',
    destinationType: 'land entry',
    transitLabels: [
      hub('ESP', 'Algeciras', P.algeciras),
      hub('DNK', 'Copenhagen', P.copenhagen),
    ],
    sources: [...SWE_SOURCES, FRONTEX_ROUTE_MAP],
  }),
];

// --- Norway ----------------------------------------------------------------

const NOR_SOURCES = [NORWAY_UDI, SSB_IMMIGRANTS, UN_MIGRANT_STOCK_2024] as const;

const NOR_CORRIDORS: readonly MigrationCorridor[] = [
  mixed({
    id: 'afr-somalia-norway-family',
    label: 'Somalia · Addis Ababa · Oslo family-reunification corridor',
    status: 'regular',
    originCode: 'SOM',
    originLabel: 'Mogadishu, Somalia',
    legs: [{ mode: 'air', waypoints: [P.mogadishu, A.addisBole, A.istanbulAirport, A.osloGardermoen] }],
    destinationLabel: 'Oslo Gardermoen',
    destinationType: 'airport entry',
    transitLabels: [H.addis, H.istanbul],
    sources: [...NOR_SOURCES, UNHCR_RESETTLEMENT],
  }),
  air({ id: 'afr-eritrea-oslo-resettlement', label: 'Eritrea · Oslo protection / reunification corridor', originCode: 'ERI', originLabel: 'Asmara, Eritrea', origin: P.asmara, hubs: [H.addis, H.istanbul], destinationLabel: 'Oslo Gardermoen', destination: A.osloGardermoen, sources: [...NOR_SOURCES, UNHCR_RESETTLEMENT] }),
  air({ id: 'afr-ethiopia-oslo-study', label: 'Ethiopia · Oslo study / skilled-work corridor', originCode: 'ETH', originLabel: 'Addis Ababa, Ethiopia', origin: A.addisBole, hubs: [H.istanbul], destinationLabel: 'Oslo Gardermoen', destination: A.osloGardermoen, sources: NOR_SOURCES }),
  air({ id: 'afr-morocco-oslo-work', label: 'Morocco · Oslo work / family corridor', originCode: 'MAR', originLabel: 'Casablanca, Morocco', origin: P.casablanca, destinationLabel: 'Oslo Gardermoen', destination: A.osloGardermoen, sources: NOR_SOURCES }),
  mixed({
    id: 'afr-horn-arctic-storskog',
    label: 'Horn of Africa · Moscow · Murmansk · Nikel · Storskog Arctic route',
    status: 'irregular',
    originCode: 'ERI',
    originLabel: 'Asmara / Horn of Africa (schematic departure)',
    legs: [
      { mode: 'air', waypoints: [P.asmara, P.cairo, A.moscowSheremetyevo] },
      { mode: 'land', waypoints: [A.moscowSheremetyevo, P.saintPetersburg, A.murmansk, A.zapolyarny, A.nikel, A.storskog, A.kirkenes] },
    ],
    destinationLabel: 'Storskog border station',
    destinationType: 'land entry',
    transitLabels: [
      hub('EGY', 'Cairo', P.cairo),
      hub('RUS', 'Moscow', A.moscowSheremetyevo),
      hub('RUS', 'Murmansk', A.murmansk),
      hub('RUS', 'Nikel', A.nikel),
    ],
    sources: [NORWAY_ARCTIC_ROUTE, ...NOR_SOURCES, UNODC_SMUGGLING_GLOBAL],
  }),
  mixed({
    id: 'afr-eritrea-italy-norway-onward',
    label: 'Eritrea · Libya · Italy · Germany · Denmark · Oslo onward movement',
    status: 'irregular',
    originCode: 'ERI',
    originLabel: 'Asmara, Eritrea',
    legs: [
      { mode: 'land', waypoints: joinPaths(PATH.eritreaToTripoli) },
      { mode: 'sea', waypoints: joinPaths(PATH.tripoliToLampedusaSea, PATH.lampedusaToAugustaSea) },
      { mode: 'land', waypoints: joinPaths(PATH.italySicilyToRome, PATH.italyRomeToBrenner, [P.innsbruck, P.munich, P.hamburg, P.padborg, P.copenhagen, A.malmoHyllie, P.gothenburg, P.svinesund, P.oslo]) },
    ],
    destinationLabel: 'Oslo / Råde arrival centre',
    destinationType: 'land entry',
    transitLabels: [
      hub('ITA', 'Lampedusa', P.lampedusa),
      hub('DNK', 'Copenhagen', P.copenhagen),
      hub('SWE', 'Svinesund', P.svinesund),
    ],
    sources: [...NOR_SOURCES, FRONTEX_ROUTE_MAP, IOM_ROUTE_MONITORING],
  }),
];

// --- Russia ----------------------------------------------------------------

const RUS_SOURCES = [RUSSIA_MVD_MIGRATION, UN_MIGRANT_STOCK_2024] as const;

const RUS_CORRIDORS: readonly MigrationCorridor[] = [
  air({ id: 'afr-egypt-moscow-study', label: 'Egypt · Moscow study / medical-education corridor', originCode: 'EGY', originLabel: 'Cairo, Egypt', origin: P.cairo, destinationLabel: 'Sheremetyevo / Moscow', destination: A.moscowSheremetyevo, sources: [...RUS_SOURCES, RUSSIA_STUDY_EXPORT] }),
  air({ id: 'afr-nigeria-moscow-study', label: 'Nigeria · Moscow study corridor', originCode: 'NGA', originLabel: 'Lagos, Nigeria', origin: P.lagos, hubs: [H.istanbul], destinationLabel: 'Sheremetyevo / Moscow', destination: A.moscowSheremetyevo, sources: [...RUS_SOURCES, RUSSIA_STUDY_EXPORT] }),
  air({ id: 'afr-morocco-moscow-study', label: 'Morocco · Moscow study corridor', originCode: 'MAR', originLabel: 'Casablanca, Morocco', origin: P.casablanca, hubs: [H.istanbul], destinationLabel: 'Sheremetyevo / Moscow', destination: A.moscowSheremetyevo, sources: [...RUS_SOURCES, RUSSIA_STUDY_EXPORT] }),
  air({ id: 'afr-ghana-moscow-study', label: 'Ghana · Moscow study corridor', originCode: 'GHA', originLabel: 'Accra, Ghana', origin: A.accra, hubs: [H.istanbul], destinationLabel: 'Sheremetyevo / Moscow', destination: A.moscowSheremetyevo, sources: [...RUS_SOURCES, RUSSIA_STUDY_EXPORT] }),
  air({ id: 'afr-ethiopia-moscow-study', label: 'Ethiopia · Moscow study / diplomatic corridor', originCode: 'ETH', originLabel: 'Addis Ababa, Ethiopia', origin: A.addisBole, destinationLabel: 'Sheremetyevo / Moscow', destination: A.moscowSheremetyevo, sources: [...RUS_SOURCES, RUSSIA_STUDY_EXPORT] }),
  air({ id: 'afr-algeria-moscow-study', label: 'Algeria · Moscow study / technical-training corridor', originCode: 'DZA', originLabel: 'Algiers, Algeria', origin: A.algiers, hubs: [H.istanbul], destinationLabel: 'Domodedovo / Moscow', destination: A.moscowDomodedovo, sources: [...RUS_SOURCES, RUSSIA_STUDY_EXPORT] }),
  mixed({
    id: 'afr-cameroon-moscow-belarus-transit',
    label: 'Cameroon · Moscow · Minsk · Belarus–EU border transit pattern',
    status: 'irregular',
    originCode: 'CMR',
    originLabel: 'Douala, Cameroon',
    legs: [
      { mode: 'air', waypoints: [A.douala, A.istanbulAirport, A.moscowSheremetyevo] },
      { mode: 'land', waypoints: [A.moscowSheremetyevo, A.smolensk, A.minsk, A.grodno, P.kuznica] },
    ],
    destinationLabel: 'Belarus–EU border approach (transit through Russia)',
    destinationType: 'land entry',
    transitLabels: [
      hub('TUR', 'Istanbul', A.istanbulAirport),
      hub('RUS', 'Smolensk', A.smolensk),
      hub('BLR', 'Minsk', A.minsk),
    ],
    sources: [BELARUS_ROUTE_FRONTEX, ...RUS_SOURCES, UNODC_SMUGGLING_GLOBAL],
  }),
  mixed({
    id: 'afr-horn-moscow-murmansk-transit',
    label: 'Horn of Africa · Moscow · Murmansk Arctic transit toward Norway',
    status: 'irregular',
    originCode: 'SOM',
    originLabel: 'Mogadishu, Somalia',
    legs: [
      { mode: 'air', waypoints: [P.mogadishu, P.cairo, A.moscowSheremetyevo] },
      { mode: 'land', waypoints: [A.moscowSheremetyevo, P.saintPetersburg, A.murmansk, A.nikel, A.storskog] },
    ],
    destinationLabel: 'Murmansk oblast / Storskog approach',
    destinationType: 'land entry',
    transitLabels: [
      hub('RUS', 'St Petersburg', P.saintPetersburg),
      hub('RUS', 'Murmansk', A.murmansk),
    ],
    sources: [NORWAY_ARCTIC_ROUTE, ...RUS_SOURCES],
  }),
];

// --- China -----------------------------------------------------------------

const CHN_SOURCES = [CHINA_NIA_ENTRY_PORTS, UN_MIGRANT_STOCK_2024] as const;
const CHN_TRADE_SOURCES = [CHINA_AFRICAN_TRADERS, CHINA_NIA_ENTRY_PORTS, AU_IOM_LABOUR_MOBILITY] as const;

const CHN_CORRIDORS: readonly MigrationCorridor[] = [
  mixed({
    id: 'afr-nigeria-guangzhou-trade',
    label: 'Nigeria · Addis Ababa · Guangzhou trading corridor (Xiaobei / Dengfeng)',
    status: 'regular',
    originCode: 'NGA',
    originLabel: 'Lagos, Nigeria',
    legs: [
      { mode: 'air', waypoints: [P.lagos, A.addisBole, A.guangzhouBaiyun] },
      { mode: 'land', waypoints: [A.guangzhouBaiyun, A.guangzhouSanyuanli, A.guangzhouXiaobei] },
    ],
    destinationLabel: 'Guangzhou Xiaobei trading district',
    destinationType: 'airport entry',
    transitLabels: [H.addis, hub('CHN', 'Baiyun Airport', A.guangzhouBaiyun)],
    sources: CHN_TRADE_SOURCES,
  }),
  mixed({
    id: 'afr-ghana-guangzhou-trade',
    label: 'Ghana · Dubai · Guangzhou trading corridor',
    status: 'regular',
    originCode: 'GHA',
    originLabel: 'Accra, Ghana',
    legs: [
      { mode: 'air', waypoints: [A.accra, P.dubai, A.guangzhouBaiyun] },
      { mode: 'land', waypoints: [A.guangzhouBaiyun, A.guangzhouSanyuanli] },
    ],
    destinationLabel: 'Guangzhou Sanyuanli wholesale district',
    destinationType: 'airport entry',
    transitLabels: [H.dubai],
    sources: CHN_TRADE_SOURCES,
  }),
  air({ id: 'afr-mali-guangzhou-trade', label: 'Mali · Casablanca · Guangzhou trading corridor', originCode: 'MLI', originLabel: 'Bamako, Mali', origin: P.bamako, hubs: [H.casablanca, H.doha], destinationLabel: 'Guangzhou Baiyun Airport', destination: A.guangzhouBaiyun, sources: CHN_TRADE_SOURCES }),
  air({ id: 'afr-guinea-guangzhou-trade', label: 'Guinea · Istanbul · Guangzhou trading corridor', originCode: 'GIN', originLabel: 'Conakry, Guinea', origin: P.conakry, hubs: [H.istanbul, H.doha], destinationLabel: 'Guangzhou Baiyun Airport', destination: A.guangzhouBaiyun, sources: CHN_TRADE_SOURCES }),
  air({ id: 'afr-congo-guangzhou-trade', label: 'DR Congo · Addis Ababa · Guangzhou trading corridor', originCode: 'COD', originLabel: 'Kinshasa, DR Congo', origin: A.kinshasa, hubs: [H.addis], destinationLabel: 'Guangzhou Baiyun Airport', destination: A.guangzhouBaiyun, sources: CHN_TRADE_SOURCES }),
  air({ id: 'afr-kenya-guangzhou-trade', label: 'Kenya · Guangzhou trade / logistics corridor', originCode: 'KEN', originLabel: 'Nairobi, Kenya', origin: P.nairobi, destinationLabel: 'Guangzhou Baiyun Airport', destination: A.guangzhouBaiyun, sources: CHN_TRADE_SOURCES }),
  air({ id: 'afr-tanzania-guangzhou-trade', label: 'Tanzania · Addis Ababa · Guangzhou trade corridor', originCode: 'TZA', originLabel: 'Dar es Salaam, Tanzania', origin: A.darEsSalaam, hubs: [H.addis], destinationLabel: 'Guangzhou Baiyun Airport', destination: A.guangzhouBaiyun, sources: CHN_TRADE_SOURCES }),
  mixed({
    id: 'afr-egypt-yiwu-trade',
    label: 'Egypt · Yiwu wholesale-market trading corridor',
    status: 'regular',
    originCode: 'EGY',
    originLabel: 'Cairo, Egypt',
    legs: [
      { mode: 'air', waypoints: [P.cairo, P.dubai, A.shanghaiPudong] },
      { mode: 'land', waypoints: [A.shanghaiPudong, A.yiwu] },
    ],
    destinationLabel: 'Yiwu International Trade City',
    destinationType: 'airport entry',
    transitLabels: [H.dubai, hub('CHN', 'Shanghai Pudong', A.shanghaiPudong)],
    sources: CHN_TRADE_SOURCES,
  }),
  air({ id: 'afr-ethiopia-beijing-study', label: 'Ethiopia · Beijing scholarship / study corridor', originCode: 'ETH', originLabel: 'Addis Ababa, Ethiopia', origin: A.addisBole, destinationLabel: 'Beijing Capital Airport', destination: A.beijingCapital, sources: [CHINA_MOE_FOREIGN_STUDENTS, ...CHN_SOURCES] }),
  air({ id: 'afr-nigeria-beijing-study', label: 'Nigeria · Beijing scholarship / study corridor', originCode: 'NGA', originLabel: 'Lagos, Nigeria', origin: P.lagos, hubs: [H.addis], destinationLabel: 'Beijing Capital Airport', destination: A.beijingCapital, sources: [CHINA_MOE_FOREIGN_STUDENTS, ...CHN_SOURCES] }),
  air({ id: 'afr-southafrica-shanghai-professional', label: 'South Africa · Shanghai professional / resident corridor', originCode: 'ZAF', originLabel: 'Johannesburg, South Africa', origin: A.johannesburg, destinationLabel: 'Shanghai Pudong Airport', destination: A.shanghaiPudong, sources: CHN_SOURCES }),
  mixed({
    id: 'afr-westafrica-guangzhou-overstay',
    label: 'West Africa · Guangzhou visa-overstay pattern (documented "three illegals" enforcement)',
    status: 'irregular',
    originCode: 'NGA',
    originLabel: 'West Africa (schematic departure)',
    legs: [
      { mode: 'air', waypoints: [P.lagos, P.dubai, A.hongKong] },
      { mode: 'land', waypoints: [A.hongKong, A.shenzhen, A.guangzhouSanyuanli, A.guangzhouXiaobei] },
    ],
    destinationLabel: 'Guangzhou overstay / irregular-residence pattern',
    destinationType: 'land entry',
    transitLabels: [H.dubai, H.hongKong, hub('CHN', 'Shenzhen', A.shenzhen)],
    sources: [CHINA_AFRICAN_TRADERS, CHINA_NIA_ENTRY_PORTS, UNODC_SMUGGLING_GLOBAL],
  }),
  // India → China deepening: the East Asia file carries the two resident corridors; these add
  // the electronics-trade and study pathways that terminate in Shenzhen and Yiwu.
  mixed({
    id: 'ind-chennai-shenzhen-electronics',
    label: 'India · Shenzhen electronics-trade corridor',
    status: 'regular',
    originCode: 'IND',
    originLabel: 'Chennai, India',
    legs: [
      { mode: 'air', waypoints: [[80.2707, 13.0827], A.kualaLumpurKlia, A.hongKong] },
      { mode: 'land', waypoints: [A.hongKong, A.shenzhen] },
    ],
    destinationLabel: 'Shenzhen Huaqiangbei trade district',
    destinationType: 'land entry',
    transitLabels: [H.kualaLumpur, H.hongKong],
    sources: [...CHN_SOURCES, AU_IOM_LABOUR_MOBILITY],
  }),
  air({ id: 'ind-mumbai-yiwu-trade', label: 'India · Yiwu wholesale-market trading corridor', originCode: 'IND', originLabel: 'Mumbai, India', origin: [72.8777, 19.076], hubs: [H.bangkok, hub('CHN', 'Shanghai Pudong', A.shanghaiPudong)], destinationLabel: 'Yiwu International Trade City', destination: A.yiwu, sources: CHN_SOURCES }),
];

// --- South Korea -----------------------------------------------------------

const KOR_SOURCES = [KOREA_MOJ_FOREIGN_RESIDENTS, UN_MIGRANT_STOCK_2024] as const;

const KOR_CORRIDORS: readonly MigrationCorridor[] = [
  mixed({
    id: 'afr-egypt-incheon-asylum',
    label: 'Egypt · Incheon protection-claim corridor (leading African applicant nationality)',
    status: 'regular',
    originCode: 'EGY',
    originLabel: 'Cairo, Egypt',
    legs: [{ mode: 'air', waypoints: [P.cairo, P.dubai, A.seoulIncheon] }],
    destinationLabel: 'Incheon Airport arrivals',
    destinationType: 'airport entry',
    transitLabels: [H.dubai],
    sources: [KOREA_REFUGEE_STATISTICS, ...KOR_SOURCES],
  }),
  air({ id: 'afr-nigeria-incheon-resident', label: 'Nigeria · Incheon trade / residence corridor', originCode: 'NGA', originLabel: 'Lagos, Nigeria', origin: P.lagos, hubs: [H.doha], destinationLabel: 'Incheon Airport / Seoul', destination: A.seoulIncheon, sources: KOR_SOURCES }),
  air({ id: 'afr-ghana-incheon-worker', label: 'Ghana · Incheon work / study corridor', originCode: 'GHA', originLabel: 'Accra, Ghana', origin: A.accra, hubs: [H.dubai], destinationLabel: 'Incheon Airport / Seoul', destination: A.seoulIncheon, sources: KOR_SOURCES }),
  air({ id: 'afr-ethiopia-incheon-study', label: 'Ethiopia · Incheon study / training corridor', originCode: 'ETH', originLabel: 'Addis Ababa, Ethiopia', origin: A.addisBole, destinationLabel: 'Incheon Airport / Seoul', destination: A.seoulIncheon, sources: KOR_SOURCES }),
  air({ id: 'afr-morocco-incheon-study', label: 'Morocco · Incheon study / professional corridor', originCode: 'MAR', originLabel: 'Casablanca, Morocco', origin: P.casablanca, hubs: [H.doha], destinationLabel: 'Incheon Airport / Seoul', destination: A.seoulIncheon, sources: KOR_SOURCES }),
  air({ id: 'afr-southafrica-incheon-teacher', label: 'South Africa · Incheon language-teaching corridor', originCode: 'ZAF', originLabel: 'Johannesburg, South Africa', origin: A.johannesburg, hubs: [H.doha], destinationLabel: 'Incheon Airport / Seoul', destination: A.seoulIncheon, sources: KOR_SOURCES }),
  mixed({
    id: 'afr-jeju-visa-free-asylum',
    label: 'Visa-free Jeju arrival · onward protection-claim pattern (documented 2018 precedent)',
    status: 'irregular',
    originCode: 'EGY',
    originLabel: 'North Africa / Middle East (schematic departure)',
    legs: [
      { mode: 'air', waypoints: [P.cairo, A.kualaLumpurKlia, A.jejuAirport] },
      { mode: 'air', waypoints: [A.jejuAirport, A.seoulIncheon] },
    ],
    destinationLabel: 'Jeju visa-free entry · onward Incheon claim',
    destinationType: 'airport entry',
    transitLabels: [H.kualaLumpur, hub('KOR', 'Jeju', A.jejuAirport)],
    sources: [KOREA_REFUGEE_STATISTICS, ...KOR_SOURCES, UNODC_SMUGGLING_GLOBAL],
  }),
  mixed({
    id: 'ind-incheon-busan-seafarer',
    label: 'India · Busan seafarer / shipyard-labour corridor',
    status: 'regular',
    originCode: 'IND',
    originLabel: 'Kochi, India',
    legs: [
      { mode: 'air', waypoints: [[76.2673, 9.9312], A.seoulIncheon] },
      { mode: 'land', waypoints: [A.seoulIncheon, A.busanPort] },
    ],
    destinationLabel: 'Busan port labour intake',
    destinationType: 'airport entry',
    transitLabels: [hub('KOR', 'Incheon Airport', A.seoulIncheon)],
    sources: KOR_SOURCES,
  }),
];

// --- Japan -----------------------------------------------------------------

const JPN_SOURCES = [JAPAN_FOREIGN_RESIDENTS, UN_MIGRANT_STOCK_2024] as const;

const JPN_CORRIDORS: readonly MigrationCorridor[] = [
  mixed({
    id: 'afr-nigeria-tokyo-resident',
    label: 'Nigeria · Tokyo trade / residence corridor (Shinjuku community)',
    status: 'regular',
    originCode: 'NGA',
    originLabel: 'Lagos, Nigeria',
    legs: [{ mode: 'air', waypoints: [P.lagos, P.dubai, A.tokyoNarita] }],
    destinationLabel: 'Tokyo Narita Airport',
    destinationType: 'airport entry',
    transitLabels: [H.dubai],
    sources: JPN_SOURCES,
  }),
  air({ id: 'afr-ghana-tokyo-resident', label: 'Ghana · Tokyo trade / residence corridor', originCode: 'GHA', originLabel: 'Accra, Ghana', origin: A.accra, hubs: [H.dubai], destinationLabel: 'Tokyo Narita Airport', destination: A.tokyoNarita, sources: JPN_SOURCES }),
  air({ id: 'afr-egypt-tokyo-study', label: 'Egypt · Tokyo study / research corridor', originCode: 'EGY', originLabel: 'Cairo, Egypt', origin: P.cairo, hubs: [H.doha], destinationLabel: 'Tokyo Narita Airport', destination: A.tokyoNarita, sources: JPN_SOURCES }),
  air({ id: 'afr-kenya-tokyo-study-work', label: 'Kenya · Tokyo study / skilled-work corridor', originCode: 'KEN', originLabel: 'Nairobi, Kenya', origin: P.nairobi, hubs: [H.doha], destinationLabel: 'Tokyo Narita Airport', destination: A.tokyoNarita, sources: JPN_SOURCES }),
  air({ id: 'afr-uganda-tokyo-care', label: 'Uganda · Osaka specified-skilled / care-worker corridor', originCode: 'UGA', originLabel: 'Kampala, Uganda', origin: A.kampala, hubs: [H.addis, H.bangkok], destinationLabel: 'Osaka Kansai Airport', destination: A.osakaKansai, sources: JPN_SOURCES }),
  air({ id: 'afr-ethiopia-tokyo-study', label: 'Ethiopia · Tokyo study / training corridor', originCode: 'ETH', originLabel: 'Addis Ababa, Ethiopia', origin: A.addisBole, hubs: [H.bangkok], destinationLabel: 'Tokyo Narita Airport', destination: A.tokyoNarita, sources: JPN_SOURCES }),
  air({ id: 'afr-cameroon-tokyo-study', label: 'Cameroon · Tokyo study corridor', originCode: 'CMR', originLabel: 'Douala, Cameroon', origin: A.douala, hubs: [H.istanbul, H.bangkok], destinationLabel: 'Tokyo Narita Airport', destination: A.tokyoNarita, sources: JPN_SOURCES }),
  mixed({
    id: 'afr-tokyo-overstay-pattern',
    label: 'African nationals · Japan air-entry-to-overstay pattern',
    status: 'irregular',
    originCode: 'NGA',
    originLabel: 'West Africa (schematic departure)',
    legs: [{ mode: 'air', waypoints: [P.lagos, P.dubai, A.tokyoNarita] }],
    destinationLabel: 'Japan air-entry / overstay pattern',
    destinationType: 'airport entry',
    transitLabels: [H.dubai],
    sources: [JAPAN_IRREGULAR_STAY, JAPAN_FOREIGN_RESIDENTS],
  }),
  mixed({
    id: 'ind-tokyo-hakata-worker',
    label: 'India · Fukuoka / Hakata specified-skilled worker corridor',
    status: 'regular',
    originCode: 'IND',
    originLabel: 'Kochi, India',
    legs: [
      { mode: 'air', waypoints: [[76.2673, 9.9312], A.bangkokSuvarnabhumi, [130.4517, 33.5859]] },
      { mode: 'land', waypoints: [[130.4517, 33.5859], A.hakataPort] },
    ],
    destinationLabel: 'Hakata / Fukuoka labour intake',
    destinationType: 'airport entry',
    transitLabels: [H.bangkok],
    sources: JPN_SOURCES,
  }),
];

/**
 * Africa-origin (plus a few India-origin East Asian) corridors keyed by destination ISO.
 * Merged into the destination sets by `lib/mapGlobeOverlays.ts` alongside the India and
 * Pakistan origin files.
 */
export const AFRICA_MIGRATION_CORRIDORS_BY_ISO: Partial<
  Record<MigrationTargetIso, readonly MigrationCorridor[]>
> = {
  GBR: GBR_CORRIDORS,
  SWE: SWE_CORRIDORS,
  NOR: NOR_CORRIDORS,
  RUS: RUS_CORRIDORS,
  CHN: CHN_CORRIDORS,
  KOR: KOR_CORRIDORS,
  JPN: JPN_CORRIDORS,
};
