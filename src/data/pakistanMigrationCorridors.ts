/**
 * Pakistan-origin migration corridors into European and United States destinations.
 *
 * Like the India set, Pakistan is a cross-cutting origin rather than a destination
 * region, so its corridors live in one file and merge into the per-destination sets in
 * `lib/mapGlobeOverlays.ts`. Three Pakistan corridors already exist in the regional
 * files (Croatia and Bosnia on the Western Balkans route, and the Dublin air arrival);
 * these are additions, not replacements.
 *
 * Regular routes are the documented work, study, and family pathways and the Gulf or
 * Istanbul hub they transit. Irregular routes are the two long-documented patterns —
 * the Balochistan/Iran overland approach to Türkiye feeding the Eastern Mediterranean
 * and Western Balkans routes, and the eastern-Libya sea departure track that the June
 * 2023 Adriana sinking off Pylos put on the record. Lines are schematic evidence paths,
 * not turn-by-turn instructions or flow-volume claims.
 */

import { corridorBuilders } from './migrationCorridorBuilders';
import type {
  MigrationCorridor,
  MigrationCorridorSource,
  MigrationTargetIso,
  MigrationTransitLabel,
} from './migrationCorridors';
import { P, PATH, joinPaths } from './migrationCorridorPaths';

const BEOE_EMIGRATION: MigrationCorridorSource = {
  organization: 'Bureau of Emigration and Overseas Employment (Pakistan)',
  title: 'Emigration statistics — workers proceeding abroad by country of destination',
  url: 'https://beoe.gov.pk/reports-and-statistics',
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

const OECD_MIGRATION_OUTLOOK: MigrationCorridorSource = {
  organization: 'OECD',
  title: 'International Migration Outlook 2024 — labour migration by country of origin',
  url: 'https://www.oecd.org/en/publications/international-migration-outlook-2024_50b0353e-en.html',
};

const EUAA_TRENDS: MigrationCorridorSource = {
  organization: 'EUAA',
  title: 'Latest asylum trends — applications by citizenship',
  url: 'https://www.euaa.europa.eu/latest-asylum-trends',
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

const IOM_MISSING_MIGRANTS: MigrationCorridorSource = {
  organization: 'IOM Missing Migrants Project',
  title: 'Mediterranean incident records, including the June 2023 Pylos shipwreck',
  url: 'https://missingmigrants.iom.int/region/mediterranean',
};

const UNHCR_SEA_ARRIVALS: MigrationCorridorSource = {
  organization: 'UNHCR',
  title: 'Europe sea and land arrivals portal',
  url: 'https://data.unhcr.org/en/situations/europe-sea-arrivals',
};

const EU_BELARUS_ROUTE: MigrationCorridorSource = {
  organization: 'Council of the European Union',
  title: 'Belarus-organised flights and onward transit to the eastern EU border',
  url: 'https://www.consilium.europa.eu/en/policies/belarus/',
};

const UK_WORK_VISAS: MigrationCorridorSource = {
  organization: 'UK Home Office',
  title: 'Why do people come to the UK? To work — visas granted by nationality',
  url: 'https://www.gov.uk/government/statistics/immigration-system-statistics-year-ending-december-2025/why-do-people-come-to-the-uk-to-work',
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

const UNHCR_DARIEN: MigrationCorridorSource = {
  organization: 'UNHCR / IOM',
  title: 'Darién Gap mixed movements toward North America',
  url: 'https://www.unhcr.org/emergencies/darien-gap',
};

const PERMIT_SOURCES = [EUROSTAT_PERMITS, BEOE_EMIGRATION, UN_MIGRANT_STOCK_2024] as const;
const LABOUR_SOURCES = [EUROSTAT_PERMITS, OECD_MIGRATION_OUTLOOK, BEOE_EMIGRATION] as const;
const ASYLUM_SOURCES = [EUAA_TRENDS, FRONTEX_ROUTE_MAP, UN_MIGRANT_STOCK_2024] as const;
const OVERLAND_SOURCES = [FRONTEX_ROUTE_MAP, FRONTEX_2024, IOM_ROUTE_MONITORING] as const;

const HUB = {
  dubai: { code: 'ARE', label: 'Dubai air hub', coordinate: P.dubai },
  doha: { code: 'QAT', label: 'Doha air hub', coordinate: P.doha },
  istanbul: { code: 'TUR', label: 'Istanbul air hub', coordinate: P.istanbul },
  islamabad: { code: 'PAK', label: 'Islamabad air hub', coordinate: P.islamabad },
} as const satisfies Record<string, MigrationTransitLabel>;

const { air, mixed } = corridorBuilders('PAK');

/**
 * Karachi → Balochistan → the Taftan crossing → Iran → Türkiye, then the Evros land
 * approach into Greece and the Western Balkans corridor. Callers append their own
 * final legs; transit labels for the shared portion come from `OVERLAND_HUBS`.
 */
const overlandToBelgrade = joinPaths(
  PATH.pakistanToTehranLand,
  PATH.tehranToIstanbul,
  PATH.istanbulToThessaloniki,
  PATH.thessalonikiToBelgrade,
);

const OVERLAND_HUBS: readonly MigrationTransitLabel[] = [
  { code: 'PAK', label: 'Quetta', coordinate: P.quetta },
  { code: 'IRN', label: 'Taftan / Mirjaveh crossing', coordinate: P.taftan },
  { code: 'TUR', label: 'Istanbul', coordinate: P.istanbul },
  { code: 'SRB', label: 'Belgrade', coordinate: P.belgrade },
];

export const PAKISTAN_MIGRATION_CORRIDORS_BY_ISO: Partial<
  Record<MigrationTargetIso, readonly MigrationCorridor[]>
> = {
  GBR: [
    mixed({
      id: 'pakistan-uk-mirpur-west-midlands',
      label: 'Pakistan · Mirpur / Azad Kashmir family settlement · Heathrow · West Midlands',
      status: 'regular',
      originLabel: 'Mirpur, Pakistan',
      legs: [
        { mode: 'air', waypoints: [P.mirpur, P.islamabad, P.dubai, P.heathrow] },
        { mode: 'land', waypoints: [...PATH.heathrowToBirmingham] },
      ],
      destinationLabel: 'Birmingham / West Midlands',
      destinationType: 'land entry',
      transitLabels: [
        HUB.islamabad,
        HUB.dubai,
        { code: 'GBR', label: 'Heathrow', coordinate: P.heathrow },
      ],
      sources: [UK_WORK_VISAS, BEOE_EMIGRATION, UN_MIGRANT_STOCK_2024],
    }),
    air({
      id: 'pakistan-uk-health-care-heathrow',
      label: 'Pakistan · health and care worker / skilled worker visa · Heathrow',
      originLabel: 'Lahore, Pakistan',
      origin: P.lahore,
      hubs: [HUB.dubai],
      destinationLabel: 'Heathrow',
      destination: P.heathrow,
      sources: [UK_WORK_VISAS, BEOE_EMIGRATION],
    }),
    mixed({
      id: 'pakistan-overland-channel-dover',
      label: 'Pakistan · Iran · Türkiye · Western Balkans · France · Channel · Dover',
      status: 'irregular',
      originLabel: 'Karachi, Pakistan',
      legs: [
        {
          mode: 'land',
          waypoints: joinPaths(
            overlandToBelgrade,
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
        ...OVERLAND_HUBS,
        { code: 'ITA', label: 'Trieste', coordinate: P.trieste },
        { code: 'FRA', label: 'Calais', coordinate: P.calais },
      ],
      sources: [UK_WORK_VISAS, FRONTEX_ROUTE_MAP, IOM_ROUTE_MONITORING],
    }),
  ],
  ITA: [
    air({
      id: 'pakistan-italy-work-permit-malpensa',
      label: 'Pakistan · decreto flussi work permit · Milan Malpensa',
      originLabel: 'Lahore, Pakistan',
      origin: P.lahore,
      hubs: [HUB.dubai],
      destinationLabel: 'Milan Malpensa',
      destination: P.milanMalpensa,
      sources: LABOUR_SOURCES,
    }),
    mixed({
      id: 'pakistan-overland-trieste',
      label: 'Pakistan · Iran · Türkiye · Western Balkans · Trieste',
      status: 'irregular',
      originLabel: 'Karachi, Pakistan',
      legs: [
        {
          mode: 'land',
          waypoints: joinPaths(
            overlandToBelgrade,
            PATH.belgradeToBajakovo,
            PATH.bajakovoToZagreb,
            PATH.zagrebToTrieste,
          ),
        },
      ],
      destinationLabel: 'Trieste',
      destinationType: 'land entry',
      transitLabels: [...OVERLAND_HUBS, { code: 'HRV', label: 'Zagreb', coordinate: P.zagreb }],
      sources: OVERLAND_SOURCES,
    }),
  ],
  GRC: [
    mixed({
      id: 'pakistan-eastern-mediterranean-lesbos',
      label: 'Pakistan · Iran · Türkiye · Aegean crossing · Lesbos',
      status: 'irregular',
      originLabel: 'Karachi, Pakistan',
      legs: [
        {
          mode: 'land',
          waypoints: joinPaths(PATH.pakistanToTehranLand, PATH.tehranToIstanbul, [
            P.istanbul,
            P.izmir,
          ]),
        },
        { mode: 'sea', waypoints: [...PATH.izmirToLesbosSea] },
      ],
      destinationLabel: 'Mytilene / Lesbos',
      destinationType: 'sea entry',
      transitLabels: [
        { code: 'PAK', label: 'Quetta', coordinate: P.quetta },
        { code: 'IRN', label: 'Taftan / Mirjaveh crossing', coordinate: P.taftan },
        { code: 'TUR', label: 'İzmir', coordinate: P.izmir },
      ],
      sources: [FRONTEX_ROUTE_MAP, UNHCR_SEA_ARRIVALS, IOM_ROUTE_MONITORING],
    }),
    mixed({
      id: 'pakistan-libya-pylos-sea',
      label: 'Pakistan · Libya staging · Tobruk departure · Pylos approach (Adriana, 2023)',
      status: 'irregular',
      originLabel: 'Islamabad, Pakistan',
      legs: [
        { mode: 'air', waypoints: [P.islamabad, P.dubai, P.benghazi] },
        { mode: 'land', waypoints: [P.benghazi, P.tobruk] },
        { mode: 'sea', waypoints: [...PATH.tobrukToPylosSea] },
      ],
      destinationLabel: 'Pylos maritime approach',
      destinationType: 'sea entry',
      transitLabels: [
        HUB.dubai,
        { code: 'LBY', label: 'Benghazi', coordinate: P.benghazi },
        { code: 'LBY', label: 'Tobruk departure', coordinate: P.tobruk },
      ],
      sources: [IOM_MISSING_MIGRANTS, UNHCR_SEA_ARRIVALS, FRONTEX_ROUTE_MAP],
    }),
  ],
  ESP: [
    mixed({
      id: 'pakistan-spain-catalonia-barajas',
      label: 'Pakistan · Catalonia settlement / arraigo · Madrid · Barcelona',
      status: 'regular',
      originLabel: 'Karachi, Pakistan',
      legs: [
        { mode: 'air', waypoints: [P.karachi, P.dubai, P.barajas] },
        { mode: 'land', waypoints: [P.madrid, P.zaragoza, P.barcelona] },
      ],
      destinationLabel: 'Barcelona / Catalonia',
      destinationType: 'land entry',
      transitLabels: [
        HUB.dubai,
        { code: 'ESP', label: 'Madrid Barajas', coordinate: P.barajas },
      ],
      sources: [EUROSTAT_PERMITS, BEOE_EMIGRATION, UN_MIGRANT_STOCK_2024],
    }),
  ],
  FRA: [
    mixed({
      id: 'pakistan-france-protection-cdg',
      label: 'Pakistan · protection claim after air arrival · Paris Charles de Gaulle',
      status: 'irregular',
      originLabel: 'Islamabad, Pakistan',
      legs: [{ mode: 'air', waypoints: [P.islamabad, P.istanbul, P.cdg] }],
      destinationLabel: 'Paris Charles de Gaulle',
      destinationType: 'airport entry',
      transitLabels: [HUB.istanbul],
      sources: ASYLUM_SOURCES,
    }),
  ],
  DEU: [
    air({
      id: 'pakistan-germany-study-skilled-frankfurt',
      label: 'Pakistan · study / skilled-worker visa · Frankfurt Airport',
      originLabel: 'Lahore, Pakistan',
      origin: P.lahore,
      hubs: [HUB.dubai],
      destinationLabel: 'Frankfurt Airport',
      destination: P.frankfurtAirport,
      sources: PERMIT_SOURCES,
    }),
    mixed({
      id: 'pakistan-overland-germany-freilassing',
      label: 'Pakistan · Western Balkans · Slovenia · Austria · Freilassing',
      status: 'irregular',
      originLabel: 'Karachi, Pakistan',
      legs: [
        {
          mode: 'land',
          waypoints: joinPaths(
            overlandToBelgrade,
            PATH.belgradeToBajakovo,
            PATH.bajakovoToZagreb,
            PATH.zagrebToSpielfeld,
            [P.spielfeld, P.vienna],
            PATH.viennaToFreilassing,
          ),
        },
      ],
      destinationLabel: 'Freilassing',
      destinationType: 'land entry',
      transitLabels: [
        ...OVERLAND_HUBS,
        { code: 'SVN', label: 'Spielfeld', coordinate: P.spielfeld },
        { code: 'AUT', label: 'Salzburg', coordinate: P.salzburg },
      ],
      sources: OVERLAND_SOURCES,
    }),
  ],
  NLD: [
    air({
      id: 'pakistan-netherlands-family-schiphol',
      label: 'Pakistan · family reunification / knowledge migrant · Schiphol',
      originLabel: 'Islamabad, Pakistan',
      origin: P.islamabad,
      hubs: [HUB.dubai],
      destinationLabel: 'Schiphol',
      destination: P.schiphol,
      sources: PERMIT_SOURCES,
    }),
  ],
  BEL: [
    air({
      id: 'pakistan-belgium-brussels',
      label: 'Pakistan · family and protection caseload · Brussels Airport',
      originLabel: 'Lahore, Pakistan',
      origin: P.lahore,
      hubs: [HUB.istanbul],
      destinationLabel: 'Brussels Airport',
      destination: P.brusselsAirport,
      sources: ASYLUM_SOURCES,
    }),
  ],
  AUT: [
    air({
      id: 'pakistan-austria-vienna',
      label: 'Pakistan · protection and family caseload · Vienna Airport',
      originLabel: 'Islamabad, Pakistan',
      origin: P.islamabad,
      hubs: [HUB.dubai],
      destinationLabel: 'Vienna Airport',
      destination: P.viennaAirport,
      sources: ASYLUM_SOURCES,
    }),
  ],
  DNK: [
    air({
      id: 'pakistan-denmark-copenhagen',
      label: 'Pakistan · established diaspora / family · Copenhagen Airport',
      originLabel: 'Karachi, Pakistan',
      origin: P.karachi,
      hubs: [HUB.dubai],
      destinationLabel: 'Copenhagen Airport',
      destination: P.copenhagenAirport,
      sources: PERMIT_SOURCES,
    }),
  ],
  SWE: [
    air({
      id: 'pakistan-sweden-work-arlanda',
      label: 'Pakistan · ICT and labour work permit · Stockholm Arlanda',
      originLabel: 'Lahore, Pakistan',
      origin: P.lahore,
      hubs: [HUB.doha],
      destinationLabel: 'Stockholm Arlanda',
      destination: P.arlanda,
      sources: PERMIT_SOURCES,
    }),
  ],
  NOR: [
    air({
      id: 'pakistan-norway-oslo',
      label: 'Pakistan · long-established Oslo diaspora / family · Oslo Airport',
      originLabel: 'Islamabad, Pakistan',
      origin: P.islamabad,
      hubs: [HUB.dubai],
      destinationLabel: 'Oslo Airport',
      destination: P.osloAirport,
      sources: [OECD_MIGRATION_OUTLOOK, BEOE_EMIGRATION, UN_MIGRANT_STOCK_2024],
    }),
  ],
  PRT: [
    mixed({
      id: 'pakistan-portugal-odemira-agriculture',
      label: 'Pakistan · Alentejo greenhouse labour · Lisbon · Odemira',
      status: 'regular',
      originLabel: 'Karachi, Pakistan',
      legs: [
        { mode: 'air', waypoints: [P.karachi, P.dubai, P.lisbonAirport] },
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
      id: 'pakistan-romania-construction-otopeni',
      label: 'Pakistan · construction / HORECA work permit · Bucharest Otopeni',
      originLabel: 'Lahore, Pakistan',
      origin: P.lahore,
      hubs: [HUB.istanbul],
      destinationLabel: 'Bucharest Otopeni',
      destination: P.otopeni,
      sources: LABOUR_SOURCES,
    }),
  ],
  CYP: [
    air({
      id: 'pakistan-cyprus-study-larnaca',
      label: 'Pakistan · study and protection caseload · Larnaca',
      originLabel: 'Islamabad, Pakistan',
      origin: P.islamabad,
      hubs: [HUB.dubai],
      destinationLabel: 'Larnaca Airport',
      destination: P.larnaca,
      sources: ASYLUM_SOURCES,
    }),
  ],
  MLT: [
    air({
      id: 'pakistan-malta-services-luqa',
      label: 'Pakistan · third-country services and delivery labour · Malta Airport',
      originLabel: 'Karachi, Pakistan',
      origin: P.karachi,
      hubs: [HUB.dubai],
      destinationLabel: 'Malta Airport',
      destination: P.maltaAirport,
      sources: LABOUR_SOURCES,
    }),
  ],
  POL: [
    air({
      id: 'pakistan-poland-work-visa-warsaw',
      label: 'Pakistan · work visa / logistics and services · Warsaw Airport',
      originLabel: 'Lahore, Pakistan',
      origin: P.lahore,
      hubs: [HUB.istanbul],
      destinationLabel: 'Warsaw Airport',
      destination: P.warsawAirport,
      sources: LABOUR_SOURCES,
    }),
    mixed({
      id: 'pakistan-belarus-terespol',
      label: 'Pakistan · Minsk air staging · Belarus border · Terespol',
      status: 'irregular',
      originLabel: 'Islamabad, Pakistan',
      legs: [
        { mode: 'air', waypoints: [P.islamabad, P.dubai, P.minsk] },
        { mode: 'land', waypoints: [...PATH.minskToTerespol] },
      ],
      destinationLabel: 'Terespol',
      destinationType: 'land entry',
      transitLabels: [
        HUB.dubai,
        { code: 'BLR', label: 'Minsk', coordinate: P.minsk },
        { code: 'BLR', label: 'Brest', coordinate: P.brest },
      ],
      sources: [EU_BELARUS_ROUTE, FRONTEX_ROUTE_MAP, IOM_ROUTE_MONITORING],
    }),
  ],
  USA: [
    air({
      id: 'pakistan-usa-family-jfk',
      label: 'Pakistan · family-sponsored permanent residence · JFK',
      originLabel: 'Karachi, Pakistan',
      origin: P.karachi,
      hubs: [HUB.dubai],
      destinationLabel: 'John F. Kennedy Airport',
      destination: P.jfk,
      sources: [DHS_YEARBOOK, BEOE_EMIGRATION, UN_MIGRANT_STOCK_2024],
    }),
    air({
      id: 'pakistan-usa-students-houston',
      label: 'Pakistan · study and employment-based entry · Houston',
      originLabel: 'Lahore, Pakistan',
      origin: P.lahore,
      hubs: [HUB.doha],
      destinationLabel: 'Houston Intercontinental',
      destination: P.houston,
      sources: [DHS_YEARBOOK, BEOE_EMIGRATION],
    }),
    mixed({
      id: 'pakistan-usa-darien-san-ysidro',
      label: 'Pakistan · Latin America staging · Darién Gap · Mexico · San Ysidro',
      status: 'irregular',
      originLabel: 'Karachi, Pakistan',
      legs: [
        { mode: 'air', waypoints: [P.karachi, P.dubai, P.bogota] },
        {
          mode: 'land',
          waypoints: joinPaths(
            PATH.bogotaToNecocli,
            PATH.necocliToTapachula,
            PATH.tapachulaToSanYsidro,
          ),
        },
      ],
      destinationLabel: 'San Ysidro',
      destinationType: 'land entry',
      transitLabels: [
        HUB.dubai,
        { code: 'PAN', label: 'Darién Gap', coordinate: P.darienGap },
        { code: 'MEX', label: 'Tapachula', coordinate: P.tapachula },
        { code: 'MEX', label: 'Tijuana', coordinate: P.tijuana },
      ],
      sources: [CBP_SOUTHWEST, UNHCR_DARIEN, IOM_ROUTE_MONITORING],
    }),
  ],
};
