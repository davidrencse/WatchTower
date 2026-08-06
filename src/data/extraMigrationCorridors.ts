/**
 * Representative migration corridors for non-EU destinations beyond the UK:
 * Norway, Switzerland, Iceland, Serbia, Bosnia and Herzegovina, Canada, the
 * United States, Russia, and Ukraine. Paths densify through documented hubs
 * (Frontex / IOM / UNHCR / CBP / IRCC / ICMPD / national stats). Schematic
 * evidence routes — not turn-by-turn instructions or claims that every journey
 * is identical.
 *
 * Ukraine note: since Feb 2022, documented mobility into Ukraine is dominated by
 * pendular / temporary returns and limited durable returns via western land POEs
 * (Poland, Romania, Slovakia, Hungary, Moldova). Commercial airspace into KBP/IEV
 * remains closed in the reporting period — pre-war air corridors are labeled as
 * historical. Do not treat Ukraine as a mass irregular-inflow destination.
 */

import type {
  MigrationCorridor,
  MigrationCorridorSource,
  MigrationTargetIso,
} from './migrationCorridors';
import { P, PATH, joinPaths } from './migrationCorridorPaths';

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

const IOM_CENTRAL_MED: MigrationCorridorSource = {
  organization: 'IOM / UNHCR',
  title: 'Central Mediterranean annual overview 2024',
  url: 'https://dtm.iom.int/reports/migrant-and-refugee-movements-through-central-mediterranean-sea-joint-annual-overview-2024',
};

const UNHCR_RESETTLEMENT: MigrationCorridorSource = {
  organization: 'UNHCR',
  title: 'Resettlement and complementary pathways',
  url: 'https://www.unhcr.org/what-we-do/build-better-futures/long-term-solutions/resettlement',
};

const UDI_NORWAY: MigrationCorridorSource = {
  organization: 'UDI (Norway)',
  title: 'Asylum applications and protection statistics',
  url: 'https://www.udi.no/en/statistics-and-analysis/statistics/',
};

const NORWAY_COLLECTIVE: MigrationCorridorSource = {
  organization: 'UDI (Norway)',
  title: 'Collective protection for people fleeing Ukraine',
  url: 'https://www.udi.no/en/situation-in-ukraine/',
};

const SEM_SWITZERLAND: MigrationCorridorSource = {
  organization: 'SEM (Switzerland)',
  title: 'Asylum statistics and migration reporting',
  url: 'https://www.sem.admin.ch/sem/en/home/publiservice/statistik/asylstatistik.html',
};

const SWISS_CHIASSO: MigrationCorridorSource = {
  organization: 'Swiss Federal Customs / SEM reporting',
  title: 'Chiasso as primary irregular land entry from Italy',
  url: 'https://www.sem.admin.ch/sem/en/home/publiservice/statistik/asylstatistik.html',
};

const ICELAND_DPI: MigrationCorridorSource = {
  organization: 'Iceland Directorate of Immigration',
  title: 'International protection applications at Keflavík and inland',
  url: 'https://island.is/en/o/directorate-of-immigration',
};

const SERBIA_CRM: MigrationCorridorSource = {
  organization: 'Commissariat for Refugees (Serbia) / UNHCR',
  title: 'Asylum and mixed-movement presence in Serbia',
  url: 'https://www.unhcr.org/countries/serbia',
};

const BIH_UNHCR: MigrationCorridorSource = {
  organization: 'UNHCR / IOM Bosnia and Herzegovina',
  title: 'Una-Sana canton and Bihać mixed-movement monitoring',
  url: 'https://www.unhcr.org/countries/bosnia-and-herzegovina',
};

const CBP_SOUTHWEST: MigrationCorridorSource = {
  organization: 'U.S. Customs and Border Protection',
  title: 'Southwest Land Border Encounters',
  url: 'https://www.cbp.gov/newsroom/stats/southwest-land-border-encounters',
};

const DHS_DARIEN: MigrationCorridorSource = {
  organization: 'DHS / UNHCR / IOM',
  title: 'Darién Gap mixed movements toward North America',
  url: 'https://www.unhcr.org/emergencies/darien-gap',
};

const IRCC_ASYLUM: MigrationCorridorSource = {
  organization: 'Immigration, Refugees and Citizenship Canada',
  title: 'Asylum claims by year and claim type (including land border)',
  url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/refugees/asylum-claims.html',
};

const IRCC_ROXHAM: MigrationCorridorSource = {
  organization: 'IRCC / Government of Canada',
  title: 'Safe Third Country Agreement expansion and Roxham Road closures (2023)',
  url: 'https://www.canada.ca/en/immigration-refugees-citizenship/news/2023/03/canada-and-the-united-states-expand-safe-third-country-agreement.html',
};

const IRCC_PERMANENT: MigrationCorridorSource = {
  organization: 'IRCC',
  title: 'Permanent residents and temporary residents by country of citizenship',
  url: 'https://www.canada.ca/en/immigration-refugees-citizenship/corporate/reports-statistics/statistics-open-data.html',
};

const IRCC_CUAET: MigrationCorridorSource = {
  organization: 'IRCC',
  title: 'Canada-Ukraine Authorization for Emergency Travel (CUAET)',
  url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/ukraine-measures.html',
};

const USCIS_REFUGEE: MigrationCorridorSource = {
  organization: 'U.S. Department of State / USCIS',
  title: 'U.S. Refugee Admissions Program',
  url: 'https://www.state.gov/refugee-admissions/',
};

const DHS_YEARBOOK: MigrationCorridorSource = {
  organization: 'DHS Office of Homeland Security Statistics',
  title: 'Yearbook of Immigration Statistics — lawful permanent residents and nonimmigrants',
  url: 'https://ohss.dhs.gov/topics/immigration/yearbook',
};

const IOM_UKR_RETURNS: MigrationCorridorSource = {
  organization: 'IOM DTM',
  title: 'Ukrainians crossing back to Ukraine — regional analysis (Poland, Moldova, Romania, Slovakia)',
  url: 'https://dtm.iom.int/reports/ukraine-response-regional-analysis-ukrainians-crossing-back-ukraine-july-december-2024',
};

const IOM_POLAND_RETURNS: MigrationCorridorSource = {
  organization: 'IOM DTM Poland',
  title: 'Ukrainian nationals crossing back to Ukraine via Medyka (July–November 2024)',
  url: 'https://dtm.iom.int/reports/poland-ukrainian-nationals-crossing-back-ukraine-july-november-2024',
};

const UNHCR_UKR_MOVEMENTS: MigrationCorridorSource = {
  organization: 'UNHCR',
  title: 'Ukraine refugee situation — population movements factsheet (border crossings and returns)',
  url: 'https://data.unhcr.org/en/situations/ukraine',
};

const ICMPD_CA_RUSSIA: MigrationCorridorSource = {
  organization: 'ICMPD',
  title: 'Central Asian labour migration to Russia — 2023–2024 policy brief',
  url: 'https://www.icmpd.org/file/download/61555/file/2024-06-28_Policy_Brief_EN_Print.pdf',
};

const IOM_UZBEKISTAN: MigrationCorridorSource = {
  organization: 'IOM Uzbekistan',
  title: 'Migration situation report — Russia as primary labour destination',
  url: 'https://uzbekistan.iom.int/sites/g/files/tmzbdl2566/files/documents/2025-01/uzbekistan-migration-situation-report-april-june-2024.pdf',
};

const MPI_CA_RUSSIA: MigrationCorridorSource = {
  organization: 'Migration Policy Institute',
  title: 'Central Asian migrants and the Russia labour corridor',
  url: 'https://www.migrationpolicy.org/journal/feature/central-asian-migrants-look-beyond-russia-yet-new-destinations-carry-challenges-too',
};

const COE_FINLAND_RUSSIA: MigrationCorridorSource = {
  organization: 'Council of Europe',
  title: 'Fact-finding mission to Finland — irregular arrivals via Russia (2023–2024)',
  url: 'https://rm.coe.int/report-of-the-fact-finding-mission-to-finland-by-mr-david-best/1680b18ac9',
};

const ROSSTAT_MIGRATION: MigrationCorridorSource = {
  organization: 'Rosstat / Russian MVD reporting (via IOM)',
  title: 'Foreign labour and residence statistics for Central Asian nationals in Russia',
  url: 'https://uzbekistan.iom.int/sites/g/files/tmzbdl2566/files/documents/2025-01/uzbekistan-migration-situation-report-july-sep-2024.pdf',
};

type ExtraTargetIso = Extract<
  MigrationTargetIso,
  'NOR' | 'CHE' | 'ISL' | 'SRB' | 'BIH' | 'CAN' | 'USA' | 'RUS' | 'UKR'
>;

export const EXTRA_MIGRATION_CORRIDORS_BY_ISO = {
  NOR: [
    {
      id: 'syria-balkans-svinesund',
      label: 'Syria · Western Balkans · Germany · Denmark · Sweden · Svinesund',
      status: 'irregular',
      originLabel: 'Damascus, Syria',
      originCode: 'SYR',
      destinationLabel: 'Svinesund / Oslo corridor',
      destinationType: 'land entry',
      legs: [{
        mode: 'land',
        waypoints: joinPaths(
          PATH.damascusToIstanbul,
          PATH.istanbulToThessaloniki,
          PATH.thessalonikiToBelgrade,
          PATH.belgradeToRoszke,
          PATH.roszkeToBudapest,
          PATH.budapestToVienna,
          PATH.viennaToFreilassing,
          PATH.freilassingToMunich,
          PATH.munichToPadborg,
          PATH.padborgToOslo,
        ),
      }],
      transitLabels: [
        { code: 'SRB', label: 'Subotica', coordinate: P.subotica },
        { code: 'DEU', label: 'Hamburg', coordinate: P.hamburg },
        { code: 'SWE', label: 'Gothenburg', coordinate: P.gothenburg },
        { code: 'NOR', label: 'Svinesund', coordinate: P.svinesund },
      ],
      sources: [FRONTEX_ROUTE_MAP, IOM_ROUTE_MONITORING, UDI_NORWAY],
    },
    {
      id: 'eritrea-italy-nordics-oslo',
      label: 'Eritrea · Libya · Italy · Germany · Denmark · Sweden · Oslo',
      status: 'irregular',
      originLabel: 'Asmara, Eritrea',
      originCode: 'ERI',
      destinationLabel: 'Oslo',
      destinationType: 'land entry',
      legs: [
        { mode: 'land', waypoints: PATH.eritreaToTripoli },
        { mode: 'sea', waypoints: joinPaths(PATH.tripoliToLampedusaSea, PATH.lampedusaToAugustaSea) },
        {
          mode: 'land',
          waypoints: joinPaths(
            [P.augusta, P.catania, P.messina, P.villaSanGiovanni, P.naples, P.rome, P.florence, P.bologna, P.brenner, P.innsbruck, P.munich],
            PATH.munichToPadborg,
            PATH.padborgToOslo,
          ),
        },
      ],
      transitLabels: [
        { code: 'ITA', label: 'Lampedusa', coordinate: P.lampedusa },
        { code: 'DEU', label: 'Munich', coordinate: P.munich },
        { code: 'SWE', label: 'Malmö', coordinate: P.malmo },
        { code: 'NOR', label: 'Oslo', coordinate: P.oslo },
      ],
      sources: [IOM_CENTRAL_MED, FRONTEX_ROUTE_MAP, UDI_NORWAY],
    },
    {
      id: 'afghanistan-balkans-oslo',
      label: 'Afghanistan · Western Balkans · Germany · Sweden · Svinesund',
      status: 'irregular',
      originLabel: 'Kabul, Afghanistan',
      originCode: 'AFG',
      destinationLabel: 'Svinesund / Oslo corridor',
      destinationType: 'land entry',
      legs: [{
        mode: 'land',
        waypoints: joinPaths(
          PATH.kabulToIstanbul,
          PATH.istanbulToThessaloniki,
          PATH.thessalonikiToBelgrade,
          PATH.belgradeToRoszke,
          PATH.roszkeToBudapest,
          PATH.budapestToVienna,
          PATH.viennaToFreilassing,
          PATH.freilassingToMunich,
          PATH.munichToPadborg,
          PATH.padborgToOslo,
        ),
      }],
      transitLabels: [
        { code: 'SRB', label: 'Belgrade', coordinate: P.belgrade },
        { code: 'DNK', label: 'Padborg', coordinate: P.padborg },
        { code: 'NOR', label: 'Svinesund', coordinate: P.svinesund },
      ],
      sources: [FRONTEX_ROUTE_MAP, IOM_ROUTE_MONITORING, UDI_NORWAY],
    },
    {
      id: 'ukraine-sweden-oslo-collective',
      label: 'Ukraine · Poland · Germany · Denmark · Sweden · Oslo (collective protection)',
      status: 'regular',
      originLabel: 'Lviv, Ukraine',
      originCode: 'UKR',
      destinationLabel: 'Oslo',
      destinationType: 'land entry',
      legs: [{
        mode: 'land',
        waypoints: joinPaths(
          PATH.lvivToMedyka,
          PATH.medykaToWarsaw,
          PATH.warsawToFrankfurtOder,
          [P.frankfurtOder, P.hamburg, P.padborg],
          PATH.padborgToOslo,
        ),
      }],
      transitLabels: [
        { code: 'POL', label: 'Medyka', coordinate: P.medyka },
        { code: 'SWE', label: 'Gothenburg', coordinate: P.gothenburg },
      ],
      sources: [NORWAY_COLLECTIVE, UDI_NORWAY],
    },
    {
      id: 'syria-resettlement-oslo',
      label: 'Jordan · UNHCR-linked resettlement · Oslo Airport',
      status: 'regular',
      originLabel: 'Amman, Jordan',
      originCode: 'JOR',
      destinationLabel: 'Oslo Airport (Gardermoen)',
      destinationType: 'safe entry',
      legs: [{ mode: 'air', waypoints: [P.amman, P.istanbul, P.osloAirport] }],
      transitLabels: [
        { code: 'TUR', label: 'Istanbul air hub', coordinate: P.istanbul },
        { code: 'NOR', label: 'Gardermoen', coordinate: P.osloAirport },
      ],
      sources: [UNHCR_RESETTLEMENT, UDI_NORWAY],
    },
    {
      id: 'poland-oslo-labor-regular',
      label: 'Poland · labor / mobility · Oslo Airport',
      status: 'regular',
      originLabel: 'Warsaw, Poland',
      originCode: 'POL',
      destinationLabel: 'Oslo Airport (Gardermoen)',
      destinationType: 'airport entry',
      legs: [{ mode: 'air', waypoints: [P.warsawAirport, P.osloAirport] }],
      transitLabels: [
        { code: 'NOR', label: 'Gardermoen', coordinate: P.osloAirport },
      ],
      sources: [UDI_NORWAY],
    },
    {
      id: 'philippines-oslo-regular',
      label: 'Philippines · air arrival · Oslo Airport',
      status: 'regular',
      originLabel: 'Manila, Philippines',
      originCode: 'PHL',
      destinationLabel: 'Oslo Airport (Gardermoen)',
      destinationType: 'airport entry',
      legs: [{ mode: 'air', waypoints: [P.manila, P.dubai, P.osloAirport] }],
      transitLabels: [
        { code: 'ARE', label: 'Dubai air hub', coordinate: P.dubai },
      ],
      sources: [UDI_NORWAY],
    },
  ],

  CHE: [
    {
      id: 'tunisia-italy-chiasso',
      label: 'Tunisia · Central Mediterranean · Italy · Chiasso',
      status: 'irregular',
      originLabel: 'Sfax, Tunisia',
      originCode: 'TUN',
      destinationLabel: 'Chiasso',
      destinationType: 'land entry',
      legs: [
        {
          mode: 'sea',
          waypoints: joinPaths(PATH.sfaxToLampedusaSea, PATH.lampedusaToAugustaSea),
        },
        {
          mode: 'land',
          waypoints: joinPaths(PATH.italySicilyToRome, PATH.romeToChiasso.slice(1)),
        },
      ],
      transitLabels: [
        { code: 'ITA', label: 'Lampedusa', coordinate: P.lampedusa },
        { code: 'ITA', label: 'Como', coordinate: P.como },
        { code: 'CHE', label: 'Chiasso', coordinate: P.chiasso },
      ],
      sources: [IOM_CENTRAL_MED, SWISS_CHIASSO, SEM_SWITZERLAND, FRONTEX_2024],
    },
    {
      id: 'eritrea-italy-chiasso',
      label: 'Eritrea · Libya · Central Mediterranean · Italy · Chiasso',
      status: 'irregular',
      originLabel: 'Asmara, Eritrea',
      originCode: 'ERI',
      destinationLabel: 'Chiasso',
      destinationType: 'land entry',
      legs: [
        { mode: 'land', waypoints: PATH.eritreaToTripoli },
        { mode: 'sea', waypoints: joinPaths(PATH.tripoliToLampedusaSea, PATH.lampedusaToAugustaSea) },
        {
          mode: 'land',
          waypoints: joinPaths(
            [P.augusta, P.catania, P.messina, P.villaSanGiovanni, P.naples, P.rome],
            PATH.romeToChiasso,
          ),
        },
      ],
      transitLabels: [
        { code: 'LBY', label: 'Tripoli', coordinate: P.tripoli },
        { code: 'ITA', label: 'Lampedusa', coordinate: P.lampedusa },
        { code: 'ITA', label: 'Milan', coordinate: P.milan },
        { code: 'CHE', label: 'Chiasso', coordinate: P.chiasso },
      ],
      sources: [IOM_CENTRAL_MED, SEM_SWITZERLAND, SWISS_CHIASSO],
    },
    {
      id: 'afghanistan-balkans-chiasso',
      label: 'Afghanistan · Western Balkans · Italy · Chiasso',
      status: 'irregular',
      originLabel: 'Kabul, Afghanistan',
      originCode: 'AFG',
      destinationLabel: 'Chiasso',
      destinationType: 'land entry',
      legs: [{
        mode: 'land',
        waypoints: joinPaths(
          PATH.kabulToIstanbul,
          PATH.istanbulToThessaloniki,
          PATH.thessalonikiToBelgrade,
          PATH.belgradeToBajakovo,
          PATH.bajakovoToZagreb,
          PATH.zagrebToTrieste,
          [P.trieste, P.milan, P.como, P.chiasso],
        ),
      }],
      transitLabels: [
        { code: 'SRB', label: 'Belgrade', coordinate: P.belgrade },
        { code: 'ITA', label: 'Trieste', coordinate: P.trieste },
        { code: 'CHE', label: 'Chiasso', coordinate: P.chiasso },
      ],
      sources: [IOM_ROUTE_MONITORING, FRONTEX_ROUTE_MAP, SEM_SWITZERLAND],
    },
    {
      id: 'syria-austria-basel',
      label: 'Syria · Western Balkans · Austria · St. Margrethen · Basel',
      status: 'irregular',
      originLabel: 'Damascus, Syria',
      originCode: 'SYR',
      destinationLabel: 'Basel',
      destinationType: 'land entry',
      legs: [{
        mode: 'land',
        waypoints: joinPaths(
          PATH.damascusToIstanbul,
          PATH.istanbulToThessaloniki,
          PATH.thessalonikiToBelgrade,
          PATH.belgradeToRoszke,
          PATH.roszkeToBudapest,
          PATH.budapestToVienna,
          PATH.viennaToBasel,
        ),
      }],
      transitLabels: [
        { code: 'AUT', label: 'Vienna', coordinate: P.vienna },
        { code: 'AUT', label: 'Bregenz', coordinate: P.bregenz },
        { code: 'CHE', label: 'St. Margrethen', coordinate: P.stMargrethen },
        { code: 'CHE', label: 'Basel', coordinate: P.basel },
      ],
      sources: [FRONTEX_ROUTE_MAP, IOM_ROUTE_MONITORING, SEM_SWITZERLAND],
    },
    {
      id: 'maghreb-france-geneva',
      label: 'Morocco · Spain · France · Geneva',
      status: 'irregular',
      originLabel: 'Tangier, Morocco',
      originCode: 'MAR',
      destinationLabel: 'Geneva',
      destinationType: 'land entry',
      legs: [
        { mode: 'sea', waypoints: PATH.tangierToAlgecirasSea },
        {
          mode: 'land',
          waypoints: joinPaths(PATH.algecirasToBarcelona, [P.barcelona, P.figueres, P.cerbere, P.lyon, P.geneva]),
        },
      ],
      transitLabels: [
        { code: 'ESP', label: 'Algeciras', coordinate: P.algeciras },
        { code: 'FRA', label: 'Lyon', coordinate: P.lyon },
        { code: 'CHE', label: 'Geneva', coordinate: P.geneva },
      ],
      sources: [FRONTEX_ROUTE_MAP, SEM_SWITZERLAND],
    },
    {
      id: 'eritrea-resettlement-zurich',
      label: 'Kenya · UNHCR-linked resettlement · Zurich Airport',
      status: 'regular',
      originLabel: 'Nairobi, Kenya',
      originCode: 'ERI',
      destinationLabel: 'Zurich Airport',
      destinationType: 'safe entry',
      legs: [{ mode: 'air', waypoints: [P.nairobi, P.istanbul, P.zurichAirport] }],
      transitLabels: [
        { code: 'TUR', label: 'Istanbul air hub', coordinate: P.istanbul },
        { code: 'CHE', label: 'Zurich Airport', coordinate: P.zurichAirport },
      ],
      sources: [UNHCR_RESETTLEMENT, SEM_SWITZERLAND],
    },
    {
      id: 'germany-zurich-labor-regular',
      label: 'Germany · air / Schengen mobility · Zurich Airport',
      status: 'regular',
      originLabel: 'Frankfurt, Germany',
      originCode: 'DEU',
      destinationLabel: 'Zurich Airport',
      destinationType: 'airport entry',
      legs: [{ mode: 'air', waypoints: [P.frankfurtAirport, P.zurichAirport] }],
      transitLabels: [
        { code: 'CHE', label: 'Zurich Airport', coordinate: P.zurichAirport },
      ],
      sources: [SEM_SWITZERLAND],
    },
    {
      id: 'portugal-geneva-regular',
      label: 'Portugal · air arrival · Geneva Airport',
      status: 'regular',
      originLabel: 'Lisbon, Portugal',
      originCode: 'PRT',
      destinationLabel: 'Geneva Airport',
      destinationType: 'airport entry',
      legs: [{ mode: 'air', waypoints: [P.lisbonAirport, P.genevaAirport] }],
      transitLabels: [
        { code: 'CHE', label: 'Geneva Airport', coordinate: P.genevaAirport },
      ],
      sources: [SEM_SWITZERLAND],
    },
  ],

  ISL: [
    {
      id: 'venezuela-keflavik-asylum',
      label: 'Venezuela · air arrival · Keflavík Airport (asylum claim)',
      status: 'irregular',
      originLabel: 'Caracas, Venezuela',
      originCode: 'VEN',
      destinationLabel: 'Keflavík Airport',
      destinationType: 'airport entry',
      legs: [{ mode: 'air', waypoints: [P.caracas, P.madrid, P.keflavik] }],
      transitLabels: [
        { code: 'ESP', label: 'Madrid air hub', coordinate: P.madrid },
        { code: 'ISL', label: 'Keflavík', coordinate: P.keflavik },
      ],
      sources: [ICELAND_DPI],
    },
    {
      id: 'palestine-europe-keflavik',
      label: 'Palestine / Levant · Europe hub · Keflavík Airport (asylum)',
      status: 'irregular',
      originLabel: 'Amman, Jordan',
      originCode: 'PSE',
      destinationLabel: 'Keflavík Airport',
      destinationType: 'airport entry',
      legs: [{ mode: 'air', waypoints: [P.amman, P.istanbul, P.keflavik] }],
      transitLabels: [
        { code: 'TUR', label: 'Istanbul air hub', coordinate: P.istanbul },
        { code: 'ISL', label: 'Keflavík', coordinate: P.keflavik },
      ],
      sources: [ICELAND_DPI],
    },
    {
      id: 'afghanistan-europe-keflavik',
      label: 'Afghanistan · Western Balkans · France · Keflavík Airport (secondary)',
      status: 'irregular',
      originLabel: 'Kabul, Afghanistan',
      originCode: 'AFG',
      destinationLabel: 'Keflavík Airport',
      destinationType: 'airport entry',
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
          ),
        },
        { mode: 'air', waypoints: [P.cdg, P.keflavik] },
      ],
      transitLabels: [
        { code: 'FRA', label: 'Paris CDG', coordinate: P.cdg },
        { code: 'ISL', label: 'Keflavík', coordinate: P.keflavik },
      ],
      sources: [ICELAND_DPI, IOM_ROUTE_MONITORING],
    },
    {
      id: 'ukraine-keflavik-protection',
      label: 'Ukraine · air arrival · Keflavík (temporary protection)',
      status: 'regular',
      originLabel: 'Kyiv, Ukraine',
      originCode: 'UKR',
      destinationLabel: 'Keflavík Airport',
      destinationType: 'airport entry',
      legs: [{ mode: 'air', waypoints: [P.kyiv, P.warsawAirport, P.keflavik] }],
      transitLabels: [
        { code: 'POL', label: 'Warsaw air hub', coordinate: P.warsawAirport },
      ],
      sources: [ICELAND_DPI],
    },
    {
      id: 'poland-keflavik-labor',
      label: 'Poland · labor migration · Keflavík Airport',
      status: 'regular',
      originLabel: 'Warsaw, Poland',
      originCode: 'POL',
      destinationLabel: 'Keflavík Airport',
      destinationType: 'airport entry',
      legs: [{ mode: 'air', waypoints: [P.warsawAirport, P.keflavik] }],
      transitLabels: [
        { code: 'ISL', label: 'Keflavík', coordinate: P.keflavik },
      ],
      sources: [ICELAND_DPI],
    },
    {
      id: 'philippines-keflavik-regular',
      label: 'Philippines · air arrival · Keflavík Airport',
      status: 'regular',
      originLabel: 'Manila, Philippines',
      originCode: 'PHL',
      destinationLabel: 'Keflavík Airport',
      destinationType: 'airport entry',
      legs: [{ mode: 'air', waypoints: [P.manila, P.dubai, P.keflavik] }],
      transitLabels: [
        { code: 'ARE', label: 'Dubai air hub', coordinate: P.dubai },
      ],
      sources: [ICELAND_DPI],
    },
    {
      id: 'syria-resettlement-keflavik',
      label: 'Jordan · UNHCR-linked resettlement · Keflavík Airport',
      status: 'regular',
      originLabel: 'Amman, Jordan',
      originCode: 'JOR',
      destinationLabel: 'Keflavík Airport',
      destinationType: 'safe entry',
      legs: [{ mode: 'air', waypoints: [P.amman, P.istanbul, P.keflavik] }],
      transitLabels: [
        { code: 'TUR', label: 'Istanbul air hub', coordinate: P.istanbul },
      ],
      sources: [UNHCR_RESETTLEMENT, ICELAND_DPI],
    },
  ],

  SRB: [
    {
      id: 'syria-western-balkans-belgrade',
      label: 'Syria · Türkiye · Greece · North Macedonia · Preševo · Belgrade',
      status: 'irregular',
      originLabel: 'Damascus, Syria',
      originCode: 'SYR',
      destinationLabel: 'Belgrade',
      destinationType: 'land entry',
      legs: [{
        mode: 'land',
        waypoints: joinPaths(
          PATH.damascusToIstanbul,
          PATH.istanbulToThessaloniki,
          PATH.thessalonikiToBelgrade,
        ),
      }],
      transitLabels: [
        { code: 'GRC', label: 'Idomeni', coordinate: P.idomeni },
        { code: 'MKD', label: 'Skopje', coordinate: P.skopje },
        { code: 'SRB', label: 'Preševo', coordinate: P.presevo },
        { code: 'SRB', label: 'Belgrade', coordinate: P.belgrade },
      ],
      sources: [FRONTEX_ROUTE_MAP, FRONTEX_2024, IOM_ROUTE_MONITORING, SERBIA_CRM],
    },
    {
      id: 'afghanistan-western-balkans-belgrade',
      label: 'Afghanistan · Iran · Türkiye · Western Balkans · Belgrade',
      status: 'irregular',
      originLabel: 'Kabul, Afghanistan',
      originCode: 'AFG',
      destinationLabel: 'Belgrade',
      destinationType: 'land entry',
      legs: [{
        mode: 'land',
        waypoints: joinPaths(
          PATH.kabulToIstanbul,
          PATH.istanbulToThessaloniki,
          PATH.thessalonikiToBelgrade,
        ),
      }],
      transitLabels: [
        { code: 'IRN', label: 'Tehran', coordinate: P.tehran },
        { code: 'MKD', label: 'Gevgelija', coordinate: P.gevgelija },
        { code: 'SRB', label: 'Niš', coordinate: P.nis },
      ],
      sources: [IOM_ROUTE_MONITORING, FRONTEX_ROUTE_MAP, SERBIA_CRM],
    },
    {
      id: 'iraq-western-balkans-belgrade',
      label: 'Iraq · Türkiye · Greece · North Macedonia · Belgrade',
      status: 'irregular',
      originLabel: 'Baghdad, Iraq',
      originCode: 'IRQ',
      destinationLabel: 'Belgrade',
      destinationType: 'land entry',
      legs: [{
        mode: 'land',
        waypoints: joinPaths(
          PATH.baghdadToIstanbul,
          PATH.istanbulToThessaloniki,
          PATH.thessalonikiToBelgrade,
        ),
      }],
      transitLabels: [
        { code: 'TUR', label: 'Istanbul', coordinate: P.istanbul },
        { code: 'SRB', label: 'Preševo', coordinate: P.presevo },
      ],
      sources: [FRONTEX_ROUTE_MAP, IOM_ROUTE_MONITORING, SERBIA_CRM],
    },
    {
      id: 'morocco-balkans-belgrade',
      label: 'Morocco · Türkiye air hub · Western Balkans · Belgrade',
      status: 'irregular',
      originLabel: 'Casablanca, Morocco',
      originCode: 'MAR',
      destinationLabel: 'Belgrade',
      destinationType: 'land entry',
      legs: [
        { mode: 'air', waypoints: [P.casablanca, P.istanbul] },
        {
          mode: 'land',
          waypoints: joinPaths(PATH.istanbulToThessaloniki, PATH.thessalonikiToBelgrade),
        },
      ],
      transitLabels: [
        { code: 'TUR', label: 'Istanbul', coordinate: P.istanbul },
        { code: 'GRC', label: 'Thessaloniki', coordinate: P.thessaloniki },
        { code: 'SRB', label: 'Belgrade', coordinate: P.belgrade },
      ],
      sources: [IOM_ROUTE_MONITORING, FRONTEX_2024, SERBIA_CRM],
    },
    {
      id: 'turkey-belgrade-airport-regular',
      label: 'Türkiye · air arrival · Belgrade Airport',
      status: 'regular',
      originLabel: 'Istanbul, Türkiye',
      originCode: 'TUR',
      destinationLabel: 'Belgrade Nikola Tesla Airport',
      destinationType: 'airport entry',
      legs: [{ mode: 'air', waypoints: [P.istanbul, P.belgradeAirport] }],
      transitLabels: [
        { code: 'SRB', label: 'Belgrade Airport', coordinate: P.belgradeAirport },
      ],
      sources: [SERBIA_CRM],
    },
    {
      id: 'russia-belgrade-airport-regular',
      label: 'Russia · air arrival · Belgrade Airport',
      status: 'regular',
      originLabel: 'Moscow / Saint Petersburg, Russia',
      originCode: 'RUS',
      destinationLabel: 'Belgrade Nikola Tesla Airport',
      destinationType: 'airport entry',
      legs: [{ mode: 'air', waypoints: [P.saintPetersburg, P.belgradeAirport] }],
      transitLabels: [
        { code: 'SRB', label: 'Belgrade Airport', coordinate: P.belgradeAirport },
      ],
      sources: [SERBIA_CRM],
    },
    {
      id: 'china-belgrade-airport-regular',
      label: 'China · air arrival · Belgrade Airport',
      status: 'regular',
      originLabel: 'Beijing / Shanghai, China',
      originCode: 'CHN',
      destinationLabel: 'Belgrade Nikola Tesla Airport',
      destinationType: 'airport entry',
      legs: [{ mode: 'air', waypoints: [[116.4074, 39.9042], P.dubai, P.belgradeAirport] }],
      transitLabels: [
        { code: 'ARE', label: 'Dubai air hub', coordinate: P.dubai },
      ],
      sources: [SERBIA_CRM],
    },
  ],

  BIH: [
    {
      id: 'syria-serbia-bihac',
      label: 'Syria · Western Balkans · Serbia · Bihać (Una-Sana)',
      status: 'irregular',
      originLabel: 'Damascus, Syria',
      originCode: 'SYR',
      destinationLabel: 'Bihać',
      destinationType: 'land entry',
      legs: [{
        mode: 'land',
        waypoints: joinPaths(
          PATH.damascusToIstanbul,
          PATH.istanbulToThessaloniki,
          PATH.thessalonikiToBelgrade,
          PATH.belgradeToBihac,
        ),
      }],
      transitLabels: [
        { code: 'SRB', label: 'Belgrade', coordinate: P.belgrade },
        { code: 'BIH', label: 'Banja Luka', coordinate: P.banjaLuka },
        { code: 'BIH', label: 'Bihać', coordinate: P.bihac },
      ],
      sources: [IOM_ROUTE_MONITORING, FRONTEX_ROUTE_MAP, BIH_UNHCR],
    },
    {
      id: 'afghanistan-serbia-bihac',
      label: 'Afghanistan · Western Balkans · Serbia · Bihać',
      status: 'irregular',
      originLabel: 'Kabul, Afghanistan',
      originCode: 'AFG',
      destinationLabel: 'Bihać',
      destinationType: 'land entry',
      legs: [{
        mode: 'land',
        waypoints: joinPaths(
          PATH.kabulToIstanbul,
          PATH.istanbulToThessaloniki,
          PATH.thessalonikiToBelgrade,
          PATH.belgradeToBihac,
        ),
      }],
      transitLabels: [
        { code: 'SRB', label: 'Loznica', coordinate: P.loznica },
        { code: 'BIH', label: 'Tuzla', coordinate: P.tuzla },
        { code: 'BIH', label: 'Bihać', coordinate: P.bihac },
      ],
      sources: [IOM_ROUTE_MONITORING, BIH_UNHCR],
    },
    {
      id: 'pakistan-serbia-velika-kladusa',
      label: 'Pakistan · Türkiye · Western Balkans · Velika Kladuša',
      status: 'irregular',
      originLabel: 'Islamabad, Pakistan',
      originCode: 'PAK',
      destinationLabel: 'Velika Kladuša',
      destinationType: 'land entry',
      legs: [
        { mode: 'air', waypoints: [P.islamabad, P.istanbul] },
        {
          mode: 'land',
          waypoints: joinPaths(
            PATH.istanbulToThessaloniki,
            PATH.thessalonikiToBelgrade,
            PATH.belgradeToBihac,
            [P.bihac, P.velikaKladusa],
          ),
        },
      ],
      transitLabels: [
        { code: 'TUR', label: 'Istanbul', coordinate: P.istanbul },
        { code: 'BIH', label: 'Bihać', coordinate: P.bihac },
        { code: 'BIH', label: 'Velika Kladuša', coordinate: P.velikaKladusa },
      ],
      sources: [IOM_ROUTE_MONITORING, BIH_UNHCR, FRONTEX_2024],
    },
    {
      id: 'iraq-serbia-sarajevo',
      label: 'Iraq · Western Balkans · Serbia · Sarajevo',
      status: 'irregular',
      originLabel: 'Baghdad, Iraq',
      originCode: 'IRQ',
      destinationLabel: 'Sarajevo',
      destinationType: 'land entry',
      legs: [{
        mode: 'land',
        waypoints: joinPaths(
          PATH.baghdadToIstanbul,
          PATH.istanbulToThessaloniki,
          PATH.thessalonikiToBelgrade,
          PATH.belgradeToSarajevo,
        ),
      }],
      transitLabels: [
        { code: 'SRB', label: 'Belgrade', coordinate: P.belgrade },
        { code: 'BIH', label: 'Zenica', coordinate: P.zenica },
        { code: 'BIH', label: 'Sarajevo', coordinate: P.sarajevo },
      ],
      sources: [IOM_ROUTE_MONITORING, BIH_UNHCR],
    },
    {
      id: 'turkey-sarajevo-airport-regular',
      label: 'Türkiye · air arrival · Sarajevo Airport',
      status: 'regular',
      originLabel: 'Istanbul, Türkiye',
      originCode: 'TUR',
      destinationLabel: 'Sarajevo International Airport',
      destinationType: 'airport entry',
      legs: [{ mode: 'air', waypoints: [P.istanbul, P.sarajevoAirport] }],
      transitLabels: [
        { code: 'BIH', label: 'Sarajevo Airport', coordinate: P.sarajevoAirport },
      ],
      sources: [BIH_UNHCR],
    },
    {
      id: 'germany-sarajevo-diaspora-regular',
      label: 'Germany · diaspora / family · Sarajevo Airport',
      status: 'regular',
      originLabel: 'Munich, Germany',
      originCode: 'DEU',
      destinationLabel: 'Sarajevo International Airport',
      destinationType: 'airport entry',
      legs: [{ mode: 'air', waypoints: [P.munich, P.sarajevoAirport] }],
      transitLabels: [
        { code: 'BIH', label: 'Sarajevo Airport', coordinate: P.sarajevoAirport },
      ],
      sources: [BIH_UNHCR],
    },
    {
      id: 'croatia-bihac-regular-crossing',
      label: 'Croatia · Maljevac corridor · Bihać (regular border traffic)',
      status: 'regular',
      originLabel: 'Zagreb, Croatia',
      originCode: 'HRV',
      destinationLabel: 'Bihać',
      destinationType: 'land entry',
      legs: [{
        mode: 'land',
        waypoints: [P.zagreb, P.karlovac, P.maljevac, P.velikaKladusa, P.bihac],
      }],
      transitLabels: [
        { code: 'HRV', label: 'Maljevac', coordinate: P.maljevac },
        { code: 'BIH', label: 'Bihać', coordinate: P.bihac },
      ],
      sources: [BIH_UNHCR],
    },
  ],

  CAN: [
    {
      id: 'venezuela-us-roxham-montreal',
      label: 'Venezuela · U.S. transit · Roxham Road · Montreal (historical irregular)',
      status: 'irregular',
      originLabel: 'Caracas, Venezuela',
      originCode: 'VEN',
      destinationLabel: 'Montreal (via Roxham)',
      destinationType: 'land entry',
      legs: [
        { mode: 'air', waypoints: [P.caracas, P.miamiAirport] },
        {
          mode: 'land',
          waypoints: joinPaths(PATH.miamiToRoxham, PATH.roxhamToMontreal),
        },
      ],
      transitLabels: [
        { code: 'USA', label: 'Miami', coordinate: P.miamiAirport },
        { code: 'USA', label: 'Albany', coordinate: P.albanyNy },
        { code: 'CAN', label: 'Roxham Road', coordinate: P.roxham },
        { code: 'CAN', label: 'Montreal', coordinate: P.montreal },
      ],
      sources: [IRCC_ASYLUM, IRCC_ROXHAM],
    },
    {
      id: 'haiti-us-roxham',
      label: 'Haiti · U.S. transit · Roxham Road · Montreal',
      status: 'irregular',
      originLabel: 'Port-au-Prince, Haiti',
      originCode: 'HTI',
      destinationLabel: 'Montreal (via Roxham)',
      destinationType: 'land entry',
      legs: [
        { mode: 'air', waypoints: [P.portAuPrince, P.miamiAirport] },
        {
          mode: 'land',
          waypoints: joinPaths(PATH.miamiToRoxham, PATH.roxhamToMontreal),
        },
      ],
      transitLabels: [
        { code: 'USA', label: 'Miami', coordinate: P.miamiAirport },
        { code: 'CAN', label: 'Roxham Road', coordinate: P.roxham },
      ],
      sources: [IRCC_ASYLUM, IRCC_ROXHAM],
    },
    {
      id: 'mexico-us-canada-land-asylum',
      label: 'Mexico / Central America · U.S. southwest · northern land POE · Canada',
      status: 'irregular',
      originLabel: 'Mexico City, Mexico',
      originCode: 'MEX',
      destinationLabel: 'Niagara / Windsor–Detroit corridor',
      destinationType: 'land entry',
      legs: [{
        mode: 'land',
        waypoints: joinPaths(
          PATH.tapachulaToElPaso,
          [P.elPaso, P.houston, P.chicagoOHare, P.detroitWindsor, P.niagaraFalls, P.toronto],
        ),
      }],
      transitLabels: [
        { code: 'MEX', label: 'Ciudad Juárez', coordinate: P.ciudadJuarez },
        { code: 'USA', label: 'Detroit–Windsor', coordinate: P.detroitWindsor },
        { code: 'CAN', label: 'Toronto', coordinate: P.toronto },
      ],
      sources: [IRCC_ASYLUM, CBP_SOUTHWEST],
    },
    {
      id: 'india-toronto-express-entry',
      label: 'India · Express Entry / study · Toronto Pearson',
      status: 'regular',
      originLabel: 'Delhi, India',
      originCode: 'IND',
      destinationLabel: 'Toronto Pearson',
      destinationType: 'airport entry',
      legs: [{ mode: 'air', waypoints: [P.delhi, P.dubai, P.torontoPearson] }],
      transitLabels: [
        { code: 'ARE', label: 'Dubai air hub', coordinate: P.dubai },
        { code: 'CAN', label: 'Toronto Pearson', coordinate: P.torontoPearson },
      ],
      sources: [IRCC_PERMANENT],
    },
    {
      id: 'philippines-vancouver-tfw',
      label: 'Philippines · temporary foreign worker / caregiving · Vancouver',
      status: 'regular',
      originLabel: 'Manila, Philippines',
      originCode: 'PHL',
      destinationLabel: 'Vancouver International',
      destinationType: 'airport entry',
      legs: [{ mode: 'air', waypoints: [P.manila, P.vancouverAirport] }],
      transitLabels: [
        { code: 'CAN', label: 'YVR', coordinate: P.vancouverAirport },
      ],
      sources: [IRCC_PERMANENT],
    },
    {
      id: 'ukraine-cuaet-toronto',
      label: 'Ukraine · CUAET emergency travel · Toronto Pearson',
      status: 'regular',
      originLabel: 'Kyiv, Ukraine',
      originCode: 'UKR',
      destinationLabel: 'Toronto Pearson',
      destinationType: 'airport entry',
      legs: [{ mode: 'air', waypoints: [P.kyiv, P.warsawAirport, P.torontoPearson] }],
      transitLabels: [
        { code: 'POL', label: 'Warsaw air hub', coordinate: P.warsawAirport },
      ],
      sources: [IRCC_CUAET, IRCC_PERMANENT],
    },
    {
      id: 'syria-resettlement-toronto',
      label: 'Jordan · UNHCR / GAR resettlement · Toronto Pearson',
      status: 'regular',
      originLabel: 'Amman, Jordan',
      originCode: 'SYR',
      destinationLabel: 'Toronto Pearson',
      destinationType: 'safe entry',
      legs: [{ mode: 'air', waypoints: [P.amman, P.istanbul, P.torontoPearson] }],
      transitLabels: [
        { code: 'TUR', label: 'Istanbul air hub', coordinate: P.istanbul },
      ],
      sources: [UNHCR_RESETTLEMENT, IRCC_PERMANENT],
    },
    {
      id: 'china-vancouver-students',
      label: 'China · study permit · Vancouver International',
      status: 'regular',
      originLabel: 'Beijing, China',
      originCode: 'CHN',
      destinationLabel: 'Vancouver International',
      destinationType: 'airport entry',
      legs: [{ mode: 'air', waypoints: [[116.4074, 39.9042], P.vancouverAirport] }],
      transitLabels: [
        { code: 'CAN', label: 'YVR', coordinate: P.vancouverAirport },
      ],
      sources: [IRCC_PERMANENT],
    },
  ],

  USA: [
    {
      id: 'venezuela-darien-el-paso',
      label: 'Venezuela · Colombia · Darién · Central America · Mexico · El Paso',
      status: 'irregular',
      originLabel: 'Caracas, Venezuela',
      originCode: 'VEN',
      destinationLabel: 'El Paso',
      destinationType: 'land entry',
      legs: [
        { mode: 'air', waypoints: [P.caracas, P.bogota] },
        {
          mode: 'land',
          waypoints: joinPaths(PATH.bogotaToNecocli, PATH.necocliToTapachula, PATH.tapachulaToElPaso),
        },
      ],
      transitLabels: [
        { code: 'COL', label: 'Necoclí', coordinate: P.necocli },
        { code: 'PAN', label: 'Darién Gap', coordinate: P.darienGap },
        { code: 'MEX', label: 'Tapachula', coordinate: P.tapachula },
        { code: 'USA', label: 'El Paso', coordinate: P.elPaso },
      ],
      sources: [DHS_DARIEN, CBP_SOUTHWEST, IOM_ROUTE_MONITORING],
    },
    {
      id: 'cuba-mexico-mcallen',
      label: 'Cuba · Nicaragua / Mexico transit · Rio Grande Valley · McAllen',
      status: 'irregular',
      originLabel: 'Havana, Cuba',
      originCode: 'CUB',
      destinationLabel: 'McAllen / Hidalgo',
      destinationType: 'land entry',
      legs: [
        { mode: 'air', waypoints: [P.havana, P.managua] },
        {
          mode: 'land',
          waypoints: joinPaths(
            [P.managua, P.tegucigalpa, P.sanSalvador, P.guatemalaCity, P.tapachula],
            PATH.tapachulaToMcAllen,
          ),
        },
      ],
      transitLabels: [
        { code: 'NIC', label: 'Managua', coordinate: P.managua },
        { code: 'MEX', label: 'Tapachula', coordinate: P.tapachula },
        { code: 'USA', label: 'McAllen', coordinate: P.mcallen },
      ],
      sources: [CBP_SOUTHWEST, DHS_DARIEN],
    },
    {
      id: 'haiti-darien-san-ysidro',
      label: 'Haiti · South America · Darién · Mexico · San Ysidro',
      status: 'irregular',
      originLabel: 'Port-au-Prince, Haiti',
      originCode: 'HTI',
      destinationLabel: 'San Ysidro',
      destinationType: 'land entry',
      legs: [
        { mode: 'air', waypoints: [P.portAuPrince, P.bogota] },
        {
          mode: 'land',
          waypoints: joinPaths(PATH.bogotaToNecocli, PATH.necocliToTapachula, PATH.tapachulaToSanYsidro),
        },
      ],
      transitLabels: [
        { code: 'COL', label: 'Necoclí', coordinate: P.necocli },
        { code: 'MEX', label: 'Tijuana', coordinate: P.tijuana },
        { code: 'USA', label: 'San Ysidro', coordinate: P.sanYsidro },
      ],
      sources: [DHS_DARIEN, CBP_SOUTHWEST],
    },
    {
      id: 'mexico-eagle-pass-direct',
      label: 'Mexico · Monterrey corridor · Eagle Pass',
      status: 'irregular',
      originLabel: 'Mexico City, Mexico',
      originCode: 'MEX',
      destinationLabel: 'Eagle Pass',
      destinationType: 'land entry',
      legs: [{
        mode: 'land',
        waypoints: PATH.mexicoToPiedrasNegrasLand,
      }],
      transitLabels: [
        { code: 'MEX', label: 'Monterrey', coordinate: P.monterrey },
        { code: 'MEX', label: 'Piedras Negras', coordinate: P.piedrasNegras },
        { code: 'USA', label: 'Eagle Pass', coordinate: P.eaglePass },
      ],
      sources: [CBP_SOUTHWEST],
    },
    {
      id: 'mexico-laredo-rio-grande',
      label: 'Mexico · Monterrey · Nuevo Laredo · Laredo',
      status: 'irregular',
      originLabel: 'Mexico City, Mexico',
      originCode: 'MEX',
      destinationLabel: 'Laredo',
      destinationType: 'land entry',
      legs: [{ mode: 'land', waypoints: PATH.mexicoToLaredoLand }],
      transitLabels: [
        { code: 'MEX', label: 'Nuevo Laredo', coordinate: P.nuevoLaredo },
        { code: 'USA', label: 'Laredo', coordinate: P.laredo },
      ],
      sources: [CBP_SOUTHWEST],
    },
    {
      id: 'cuba-florida-straits',
      label: 'Cuba · Florida Straits · Key West',
      status: 'irregular',
      originLabel: 'Havana, Cuba',
      originCode: 'CUB',
      destinationLabel: 'Key West',
      destinationType: 'sea entry',
      legs: [{ mode: 'sea', waypoints: PATH.cubaToKeyWestSea }],
      transitLabels: [
        { code: 'CUB', label: 'Havana', coordinate: P.havana },
        { code: 'USA', label: 'Key West', coordinate: P.keyWest },
      ],
      sources: [
        CBP_SOUTHWEST,
        {
          organization: 'U.S. Coast Guard / DHS',
          title: 'Florida Straits maritime interdiction and Cuban migrant voyages',
          url: 'https://www.cbp.gov/newsroom/stats/southwest-land-border-encounters',
        },
      ],
    },
    {
      id: 'haiti-bahamas-florida-sea',
      label: 'Haiti · Bahamas transit · South Florida maritime',
      status: 'irregular',
      originLabel: 'Port-au-Prince, Haiti',
      originCode: 'HTI',
      destinationLabel: 'Miami / South Florida',
      destinationType: 'sea entry',
      legs: [{ mode: 'sea', waypoints: PATH.haitiToFloridaSea }],
      transitLabels: [
        { code: 'HTI', label: 'Port-au-Prince', coordinate: P.portAuPrince },
        { code: 'BHS', label: 'Nassau', coordinate: P.nassau },
        { code: 'USA', label: 'Miami', coordinate: P.miamiAirport },
      ],
      sources: [
        CBP_SOUTHWEST,
        {
          organization: 'IOM / UNHCR',
          title: 'Caribbean maritime mixed movements toward Florida',
          url: 'https://www.unhcr.org/emergencies/darien-gap',
        },
      ],
    },
    {
      id: 'india-jfk-students-h1b',
      label: 'India · study / H-1B · JFK',
      status: 'regular',
      originLabel: 'Delhi, India',
      originCode: 'IND',
      destinationLabel: 'John F. Kennedy Airport',
      destinationType: 'airport entry',
      legs: [{ mode: 'air', waypoints: [P.delhi, P.dubai, P.jfk] }],
      transitLabels: [
        { code: 'ARE', label: 'Dubai air hub', coordinate: P.dubai },
        { code: 'USA', label: 'JFK', coordinate: P.jfk },
      ],
      sources: [DHS_YEARBOOK],
    },
    {
      id: 'china-lax-students',
      label: 'China · study · Los Angeles International',
      status: 'regular',
      originLabel: 'Beijing, China',
      originCode: 'CHN',
      destinationLabel: 'Los Angeles International',
      destinationType: 'airport entry',
      legs: [{ mode: 'air', waypoints: [[116.4074, 39.9042], P.lax] }],
      transitLabels: [
        { code: 'USA', label: 'LAX', coordinate: P.lax },
      ],
      sources: [DHS_YEARBOOK],
    },
    {
      id: 'mexico-houston-tn-regular',
      label: 'Mexico · TN / lawful air arrival · Houston',
      status: 'regular',
      originLabel: 'Mexico City, Mexico',
      originCode: 'MEX',
      destinationLabel: 'Houston Intercontinental',
      destinationType: 'airport entry',
      legs: [{ mode: 'air', waypoints: [P.mexicoCity, P.houston] }],
      transitLabels: [
        { code: 'USA', label: 'Houston', coordinate: P.houston },
      ],
      sources: [DHS_YEARBOOK],
    },
    {
      id: 'syria-resettlement-jfk',
      label: 'Jordan · U.S. Refugee Admissions · JFK',
      status: 'regular',
      originLabel: 'Amman, Jordan',
      originCode: 'SYR',
      destinationLabel: 'John F. Kennedy Airport',
      destinationType: 'safe entry',
      legs: [{ mode: 'air', waypoints: [P.amman, P.istanbul, P.jfk] }],
      transitLabels: [
        { code: 'TUR', label: 'Istanbul air hub', coordinate: P.istanbul },
      ],
      sources: [USCIS_REFUGEE, UNHCR_RESETTLEMENT],
    },
  ],

  /**
   * Russia as destination. Dominant flows are Central Asian labour (land + air into
   * Moscow airports), Caucasus mobility via Verkhny Lars, Chinese study/trade air,
   * and documented secondary irregularization (visa/patent overstay; Middle East
   * air staging reported in the 2023–24 Finland instrumentalization episode).
   * Air legs stay west of the Pacific (Beijing→Moscow) to avoid antimeridian wrap.
   */
  RUS: [
    {
      id: 'uzbekistan-orenburg-moscow-labor',
      label: 'Uzbekistan · Kazakhstan · Orenburg · Samara · Moscow (labour)',
      status: 'regular',
      originLabel: 'Tashkent, Uzbekistan',
      originCode: 'UZB',
      destinationLabel: 'Moscow',
      destinationType: 'land entry',
      legs: [{ mode: 'land', waypoints: PATH.tashkentToMoscowLand }],
      transitLabels: [
        { code: 'KAZ', label: 'Shymkent', coordinate: P.shymkent },
        { code: 'RUS', label: 'Orenburg', coordinate: P.orenburg },
        { code: 'RUS', label: 'Samara', coordinate: P.samara },
        { code: 'RUS', label: 'Moscow', coordinate: P.moscow },
      ],
      sources: [ICMPD_CA_RUSSIA, IOM_UZBEKISTAN, MPI_CA_RUSSIA],
    },
    {
      id: 'tajikistan-svo-labor-air',
      label: 'Tajikistan · labour air arrival · Sheremetyevo',
      status: 'regular',
      originLabel: 'Dushanbe, Tajikistan',
      originCode: 'TJK',
      destinationLabel: 'Sheremetyevo Airport (SVO)',
      destinationType: 'airport entry',
      legs: [{ mode: 'air', waypoints: [P.dushanbe, P.sheremetyevo] }],
      transitLabels: [
        { code: 'RUS', label: 'Sheremetyevo', coordinate: P.sheremetyevo },
      ],
      sources: [ICMPD_CA_RUSSIA, ROSSTAT_MIGRATION, MPI_CA_RUSSIA],
    },
    {
      id: 'kyrgyzstan-svo-eaeu-air',
      label: 'Kyrgyzstan · EAEU labour · Sheremetyevo',
      status: 'regular',
      originLabel: 'Bishkek, Kyrgyzstan',
      originCode: 'KGZ',
      destinationLabel: 'Sheremetyevo Airport (SVO)',
      destinationType: 'airport entry',
      legs: [{ mode: 'air', waypoints: [P.bishkek, P.sheremetyevo] }],
      transitLabels: [
        { code: 'RUS', label: 'Sheremetyevo', coordinate: P.sheremetyevo },
      ],
      sources: [ICMPD_CA_RUSSIA, MPI_CA_RUSSIA],
    },
    {
      id: 'kazakhstan-astana-moscow-labor',
      label: 'Kazakhstan · Orenburg corridor · Moscow (EAEU labour)',
      status: 'regular',
      originLabel: 'Astana, Kazakhstan',
      originCode: 'KAZ',
      destinationLabel: 'Moscow',
      destinationType: 'land entry',
      legs: [{ mode: 'land', waypoints: PATH.astanaToMoscowLand }],
      transitLabels: [
        { code: 'RUS', label: 'Orenburg', coordinate: P.orenburg },
        { code: 'RUS', label: 'Moscow', coordinate: P.moscow },
      ],
      sources: [ICMPD_CA_RUSSIA, ROSSTAT_MIGRATION],
    },
    {
      id: 'armenia-svo-mobility-air',
      label: 'Armenia · mobility / labour · Sheremetyevo',
      status: 'regular',
      originLabel: 'Yerevan, Armenia',
      originCode: 'ARM',
      destinationLabel: 'Sheremetyevo Airport (SVO)',
      destinationType: 'airport entry',
      legs: [{ mode: 'air', waypoints: [P.yerevan, P.sheremetyevo] }],
      transitLabels: [
        { code: 'RUS', label: 'Sheremetyevo', coordinate: P.sheremetyevo },
      ],
      sources: [ROSSTAT_MIGRATION, ICMPD_CA_RUSSIA],
    },
    {
      id: 'georgia-verkhny-lars-moscow',
      label: 'Georgia · Verkhny Lars · Vladikavkaz · Moscow',
      status: 'regular',
      originLabel: 'Tbilisi, Georgia',
      originCode: 'GEO',
      destinationLabel: 'Moscow via Verkhny Lars',
      destinationType: 'land entry',
      legs: [{
        mode: 'land',
        waypoints: joinPaths(PATH.tbilisiToVladikavkaz, PATH.vladikavkazToMoscow),
      }],
      transitLabels: [
        { code: 'GEO', label: 'Stepantsminda', coordinate: P.stepantsminda },
        { code: 'RUS', label: 'Verkhny Lars', coordinate: P.verkhnyLars },
        { code: 'RUS', label: 'Vladikavkaz', coordinate: P.vladikavkaz },
        { code: 'RUS', label: 'Moscow', coordinate: P.moscow },
      ],
      sources: [ROSSTAT_MIGRATION],
    },
    {
      id: 'china-svo-students-traders',
      label: 'China · study / trade · Sheremetyevo',
      status: 'regular',
      originLabel: 'Beijing, China',
      originCode: 'CHN',
      destinationLabel: 'Sheremetyevo Airport (SVO)',
      destinationType: 'airport entry',
      // Westbound Asia great-circle (≈116°E → 37°E); no Pacific / antimeridian split required.
      legs: [{ mode: 'air', waypoints: [P.beijing, P.sheremetyevo] }],
      transitLabels: [
        { code: 'RUS', label: 'Sheremetyevo', coordinate: P.sheremetyevo },
      ],
      sources: [ROSSTAT_MIGRATION],
    },
    {
      id: 'mideast-svo-visa-secondary-irregular',
      label: 'Syria · Türkiye · Sheremetyevo (visa entry → secondary irregular)',
      status: 'irregular',
      originLabel: 'Damascus, Syria',
      originCode: 'SYR',
      destinationLabel: 'Sheremetyevo / Moscow region',
      destinationType: 'airport entry',
      legs: [
        { mode: 'land', waypoints: PATH.damascusToIstanbul },
        { mode: 'air', waypoints: [P.istanbul, P.sheremetyevo] },
      ],
      transitLabels: [
        { code: 'TUR', label: 'Istanbul air hub', coordinate: P.istanbul },
        { code: 'RUS', label: 'Sheremetyevo', coordinate: P.sheremetyevo },
      ],
      sources: [COE_FINLAND_RUSSIA, ROSSTAT_MIGRATION],
    },
    {
      id: 'uzbekistan-moscow-patent-overstay',
      label: 'Uzbekistan · Moscow labour entry · patent / registration lapse (secondary irregular)',
      status: 'irregular',
      originLabel: 'Tashkent, Uzbekistan',
      originCode: 'UZB',
      destinationLabel: 'Moscow',
      destinationType: 'land entry',
      legs: [{ mode: 'land', waypoints: PATH.tashkentToMoscowLand }],
      transitLabels: [
        { code: 'RUS', label: 'Orenburg', coordinate: P.orenburg },
        { code: 'RUS', label: 'Moscow', coordinate: P.moscow },
      ],
      sources: [IOM_UZBEKISTAN, ICMPD_CA_RUSSIA, MPI_CA_RUSSIA],
    },
  ],

  /**
   * Ukraine as destination. Post-2022 evidence is overwhelmingly pendular and
   * return mobility at western land POEs — not mass irregular inflows. Air corridors
   * into Boryspil/Zhuliany are historical (airspace closed since Feb 2022).
   */
  UKR: [
    {
      id: 'poland-medyka-lviv-returns',
      label: 'Poland · Medyka · Lviv (pendular / return)',
      status: 'regular',
      originLabel: 'Warsaw, Poland',
      originCode: 'POL',
      destinationLabel: 'Lviv via Medyka',
      destinationType: 'land entry',
      legs: [{
        mode: 'land',
        waypoints: joinPaths(PATH.warsawToMedyka, PATH.medykaToLviv),
      }],
      transitLabels: [
        { code: 'POL', label: 'Medyka', coordinate: P.medyka },
        { code: 'UKR', label: 'Lviv', coordinate: P.lviv },
      ],
      sources: [IOM_POLAND_RETURNS, IOM_UKR_RETURNS, UNHCR_UKR_MOVEMENTS],
    },
    {
      id: 'germany-poland-medyka-kyiv-returns',
      label: 'Germany · Poland · Medyka · Kyiv (diaspora return / pendular)',
      status: 'regular',
      originLabel: 'Berlin corridor / Frankfurt (Oder), Germany',
      originCode: 'DEU',
      destinationLabel: 'Kyiv via Medyka',
      destinationType: 'land entry',
      legs: [{
        mode: 'land',
        waypoints: joinPaths(
          PATH.frankfurtOderToWarsaw,
          PATH.warsawToMedyka,
          PATH.medykaToLviv,
          PATH.lvivToKyiv,
        ),
      }],
      transitLabels: [
        { code: 'POL', label: 'Warsaw', coordinate: P.warsaw },
        { code: 'POL', label: 'Medyka', coordinate: P.medyka },
        { code: 'UKR', label: 'Kyiv', coordinate: P.kyiv },
      ],
      sources: [IOM_UKR_RETURNS, UNHCR_UKR_MOVEMENTS, IOM_POLAND_RETURNS],
    },
    {
      id: 'romania-siret-chernivtsi-returns',
      label: 'Romania · Siret · Chernivtsi (pendular / return)',
      status: 'regular',
      originLabel: 'Iași / Siret, Romania',
      originCode: 'ROU',
      destinationLabel: 'Chernivtsi via Siret',
      destinationType: 'land entry',
      legs: [{
        mode: 'land',
        waypoints: joinPaths([P.iasi, P.siret], PATH.siretToChernivtsi),
      }],
      transitLabels: [
        { code: 'ROU', label: 'Siret', coordinate: P.siret },
        { code: 'UKR', label: 'Chernivtsi', coordinate: P.chernivtsi },
      ],
      sources: [IOM_UKR_RETURNS, UNHCR_UKR_MOVEMENTS],
    },
    {
      id: 'slovakia-vysne-uzhhorod-returns',
      label: 'Slovakia · Vyšné Nemecké · Uzhhorod (pendular / return)',
      status: 'regular',
      originLabel: 'Vyšné Nemecké, Slovakia',
      originCode: 'SVK',
      destinationLabel: 'Uzhhorod',
      destinationType: 'land entry',
      legs: [{ mode: 'land', waypoints: PATH.vysneNemeckeToUzhhorod }],
      transitLabels: [
        { code: 'SVK', label: 'Vyšné Nemecké', coordinate: P.vysneNemecke },
        { code: 'UKR', label: 'Uzhhorod', coordinate: P.uzhhorod },
      ],
      sources: [IOM_UKR_RETURNS, UNHCR_UKR_MOVEMENTS],
    },
    {
      id: 'hungary-zahony-chop-returns',
      label: 'Hungary · Záhony · Chop · Uzhhorod (pendular / return)',
      status: 'regular',
      originLabel: 'Záhony, Hungary',
      originCode: 'HUN',
      destinationLabel: 'Chop / Uzhhorod',
      destinationType: 'land entry',
      legs: [{ mode: 'land', waypoints: PATH.zahonyToUzhhorod }],
      transitLabels: [
        { code: 'HUN', label: 'Záhony', coordinate: P.zahony },
        { code: 'UKR', label: 'Chop', coordinate: P.chop },
        { code: 'UKR', label: 'Uzhhorod', coordinate: P.uzhhorod },
      ],
      sources: [IOM_UKR_RETURNS, UNHCR_UKR_MOVEMENTS],
    },
    {
      id: 'moldova-ungheni-kyiv-returns',
      label: 'Moldova · Ungheni · Kyiv (pendular / return)',
      status: 'regular',
      originLabel: 'Chișinău, Moldova',
      originCode: 'MDA',
      destinationLabel: 'Kyiv via Ungheni',
      destinationType: 'land entry',
      legs: [{ mode: 'land', waypoints: PATH.chisinauToKyiv }],
      transitLabels: [
        { code: 'MDA', label: 'Ungheni', coordinate: P.ungheni },
        { code: 'UKR', label: 'Kyiv', coordinate: P.kyiv },
      ],
      sources: [IOM_UKR_RETURNS, UNHCR_UKR_MOVEMENTS],
    },
    {
      id: 'warsaw-boryspil-prewar-air',
      label: 'Poland · historical air arrival · Boryspil (pre-war; airspace closed since Feb 2022)',
      status: 'regular',
      originLabel: 'Warsaw, Poland',
      originCode: 'POL',
      destinationLabel: 'Boryspil Airport (KBP) — historical',
      destinationType: 'airport entry',
      legs: [{ mode: 'air', waypoints: [P.warsawAirport, P.boryspil] }],
      transitLabels: [
        { code: 'UKR', label: 'Boryspil (historical)', coordinate: P.boryspil },
      ],
      sources: [UNHCR_UKR_MOVEMENTS],
    },
    {
      id: 'moldova-ukraine-irregular-labor-historical',
      label: 'Moldova · Ungheni corridor · Kyiv (historical irregular labour / residual mixed mobility)',
      status: 'irregular',
      originLabel: 'Chișinău, Moldova',
      originCode: 'MDA',
      destinationLabel: 'Kyiv region',
      destinationType: 'land entry',
      legs: [{ mode: 'land', waypoints: PATH.chisinauToKyiv }],
      transitLabels: [
        { code: 'MDA', label: 'Ungheni', coordinate: P.ungheni },
        { code: 'UKR', label: 'Kyiv', coordinate: P.kyiv },
      ],
      sources: [IOM_UKR_RETURNS, UNHCR_UKR_MOVEMENTS],
    },
    {
      id: 'belarus-chernihiv-kyiv-northern',
      label: 'Belarus · Gomel · Chernihiv · Kyiv (limited northern approaches; not mass inflow)',
      status: 'irregular',
      originLabel: 'Minsk, Belarus',
      originCode: 'BLR',
      destinationLabel: 'Kyiv via Chernihiv',
      destinationType: 'land entry',
      legs: [{ mode: 'land', waypoints: PATH.minskToKyivNorth }],
      transitLabels: [
        { code: 'BLR', label: 'Gomel', coordinate: P.gomel },
        { code: 'UKR', label: 'Chernihiv', coordinate: P.chernihiv },
        { code: 'UKR', label: 'Kyiv', coordinate: P.kyiv },
      ],
      sources: [UNHCR_UKR_MOVEMENTS, IOM_UKR_RETURNS],
    },
  ],
} satisfies Record<ExtraTargetIso, readonly MigrationCorridor[]>;
