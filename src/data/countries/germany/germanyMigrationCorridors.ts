/**
 * Representative mixed-movement corridors into Germany, compiled from Frontex, BAMF,
 * German Federal Police, European Commission, and IOM reporting. Germany is generally an
 * onward destination after an external Schengen entry, so these paths retain the actual
 * transit countries and named German border areas. They are schematic evidence paths, not
 * turn-by-turn instructions or claims that every journey is identical.
 */

import type {
  MigrationCorridor,
  MigrationCorridorSource,
} from '../../migrationCorridors';
import { P, PATH, joinPaths } from '../../migrationCorridorPaths';

export type GermanyMigrationCorridor = MigrationCorridor;

const FRONTEX_2024: MigrationCorridorSource = {
  organization: 'Frontex',
  title: 'Annual Brief 2024 — routes and origin countries',
  url: 'https://prd.frontex.europa.eu/wp-content/uploads/annual_brief_2024.pdf',
};

const IOM_ROUTE_DEFINITIONS: MigrationCorridorSource = {
  organization: 'IOM DTM',
  title: 'Mixed migration routes and Western Balkans monitoring',
  url: 'https://dtm.iom.int/component/migrants-presence',
};

const IOM_CENTRAL_MED: MigrationCorridorSource = {
  organization: 'IOM / UNHCR',
  title: 'Central Mediterranean annual overview 2024',
  url: 'https://dtm.iom.int/reports/migrant-and-refugee-movements-through-central-mediterranean-sea-joint-annual-overview-2024',
};

const GERMAN_LAND_BORDERS: MigrationCorridorSource = {
  organization: 'German Federal Ministry of the Interior',
  title: 'Controls at all German land borders',
  url: 'https://bundespolizei.de/fileadmin/user_upload/Downloads/Aktuelles/250212_PM_BMI_Binnengrenzkontrollen.pdf',
};

const BAMF_MIGRATION_REPORT: MigrationCorridorSource = {
  organization: 'BAMF',
  title: 'German Federal Government Migration Report 2023',
  url: 'https://www.bamf.de/SharedDocs/Anlagen/EN/Forschung/Migrationsberichte/migrationsbericht-2023.html',
};

const BAMF_RESETTLEMENT: MigrationCorridorSource = {
  organization: 'BAMF',
  title: 'Resettlement and the NesT programme',
  url: 'https://www.bamf.de/EN/Themen/AsylFluechtlingsschutz/ResettlementRelocation/Resettlement/resettlement-node.html',
};

const EU_BELARUS_BORDER: MigrationCorridorSource = {
  organization: 'European Commission',
  title: 'Migration pressure at the EU external border with Belarus',
  url: 'https://home-affairs.ec.europa.eu/document/download/a7eb5da4-ed82-4431-925b-0d71eaff93c6_en',
};

export const GERMANY_MIGRATION_CORRIDORS: readonly GermanyMigrationCorridor[] = [
  {
    id: 'syria-balkans-freilassing',
    label: 'Syria · Türkiye · Greece · Western Balkans · Austria · Freilassing',
    status: 'irregular',
    originLabel: 'Damascus, Syria',
    originCode: 'SYR',
    destinationLabel: 'Freilassing',
    destinationType: 'land entry',
    legs: [
      {
        mode: 'land',
        waypoints: joinPaths(
          PATH.damascusToIstanbul,
          PATH.istanbulToThessaloniki,
          PATH.thessalonikiToBelgrade,
          PATH.belgradeToRoszke,
          PATH.roszkeToBudapest,
          PATH.budapestToVienna,
          PATH.viennaToFreilassing,
        ),
      },
    ],
    transitLabels: [
      { code: 'TUR', label: 'Istanbul', coordinate: P.istanbul },
      { code: 'GRC', label: 'Thessaloniki', coordinate: P.thessaloniki },
      { code: 'SRB', label: 'Subotica', coordinate: P.subotica },
      { code: 'HUN', label: 'Röszke', coordinate: P.roszke },
      { code: 'AUT', label: 'Salzburg', coordinate: P.salzburg },
      { code: 'DEU', label: 'Freilassing', coordinate: P.freilassing },
    ],
    sources: [FRONTEX_2024, IOM_ROUTE_DEFINITIONS, GERMAN_LAND_BORDERS],
  },
  {
    id: 'afghanistan-bulgaria-passau',
    label: 'Afghanistan · Iran · Türkiye · Bulgaria · Western Balkans · Passau',
    status: 'irregular',
    originLabel: 'Kabul, Afghanistan',
    originCode: 'AFG',
    destinationLabel: 'Passau',
    destinationType: 'land entry',
    legs: [
      {
        mode: 'land',
        waypoints: joinPaths(
          PATH.kabulToIstanbul,
          PATH.istanbulToKapitanAndreevo,
          [P.kapitanAndreevo, P.plovdiv, P.sofia, P.dimitrovgrad, P.nis, P.belgrade],
          PATH.belgradeToRoszke,
          PATH.roszkeToBudapest,
          PATH.budapestToVienna,
          PATH.viennaToPassau,
        ),
      },
    ],
    transitLabels: [
      { code: 'IRN', label: 'Tehran', coordinate: P.tehran },
      { code: 'BGR', label: 'Kapitan Andreevo', coordinate: P.kapitanAndreevo },
      { code: 'BGR', label: 'Sofia', coordinate: P.sofia },
      { code: 'HUN', label: 'Röszke', coordinate: P.roszke },
      { code: 'AUT', label: 'Linz', coordinate: P.linz },
      { code: 'DEU', label: 'Passau', coordinate: P.passau },
    ],
    sources: [FRONTEX_2024, IOM_ROUTE_DEFINITIONS, GERMAN_LAND_BORDERS],
  },
  {
    id: 'eritrea-central-med-kiefersfelden',
    label: 'Eritrea · Sudan · Libya · Italy · Austria · Kiefersfelden',
    status: 'irregular',
    originLabel: 'Asmara, Eritrea',
    originCode: 'ERI',
    destinationLabel: 'Kiefersfelden',
    destinationType: 'land entry',
    legs: [
      { mode: 'land', waypoints: PATH.eritreaToTripoli },
      {
        mode: 'sea',
        waypoints: joinPaths(PATH.tripoliToLampedusaSea, PATH.lampedusaToAugustaSea),
      },
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
        waypoints: joinPaths(
          [P.villaSanGiovanni, P.naples, P.rome, P.florence, P.bologna, P.brenner, P.innsbruck],
          PATH.innsbruckToKiefersfelden,
        ),
      },
    ],
    transitLabels: [
      { code: 'SDN', label: 'Khartoum', coordinate: P.khartoum },
      { code: 'LBY', label: 'Tripoli', coordinate: P.tripoli },
      { code: 'ITA', label: 'Lampedusa', coordinate: P.lampedusa },
      { code: 'ITA', label: 'Augusta', coordinate: P.augusta },
      { code: 'AUT', label: 'Innsbruck', coordinate: P.innsbruck },
      { code: 'DEU', label: 'Kiefersfelden', coordinate: P.kiefersfelden },
    ],
    sources: [IOM_CENTRAL_MED, FRONTEX_2024, GERMAN_LAND_BORDERS],
  },
  {
    id: 'iraq-balkans-czechia-waidhaus',
    label: 'Iraq · Türkiye · Bulgaria · Serbia · Hungary · Czechia · Waidhaus',
    status: 'irregular',
    originLabel: 'Baghdad, Iraq',
    originCode: 'IRQ',
    destinationLabel: 'Waidhaus',
    destinationType: 'land entry',
    legs: [
      {
        mode: 'land',
        waypoints: joinPaths(
          PATH.baghdadToIstanbul,
          PATH.istanbulToKapitanAndreevo,
          [P.kapitanAndreevo, P.plovdiv, P.sofia, P.dimitrovgrad, P.nis, P.belgrade],
          PATH.belgradeToRoszke,
          PATH.roszkeToBudapest,
          [P.budapest, P.bratislava, P.prague, P.plzen, P.waidhaus],
        ),
      },
    ],
    transitLabels: [
      { code: 'BGR', label: 'Sofia', coordinate: P.sofia },
      { code: 'HUN', label: 'Röszke', coordinate: P.roszke },
      { code: 'SVK', label: 'Bratislava', coordinate: P.bratislava },
      { code: 'CZE', label: 'Prague', coordinate: P.prague },
      { code: 'DEU', label: 'Waidhaus', coordinate: P.waidhaus },
    ],
    sources: [FRONTEX_2024, IOM_ROUTE_DEFINITIONS, GERMAN_LAND_BORDERS],
  },
  {
    id: 'syria-belarus-poland-frankfurt-oder',
    label: 'Syria · Belarus · Poland · Frankfurt (Oder)',
    status: 'irregular',
    originLabel: 'Damascus, Syria',
    originCode: 'SYR',
    destinationLabel: 'Frankfurt (Oder)',
    destinationType: 'land entry',
    legs: [
      {
        mode: 'air',
        waypoints: [P.damascus, P.minsk],
      },
      {
        mode: 'land',
        waypoints: joinPaths(PATH.minskToTerespol, [P.terespol, P.warsaw, P.poznan, P.frankfurtOder]),
      },
    ],
    transitLabels: [
      { code: 'BLR', label: 'Minsk', coordinate: P.minsk },
      { code: 'POL', label: 'Terespol', coordinate: P.terespol },
      { code: 'POL', label: 'Warsaw', coordinate: P.warsaw },
      { code: 'DEU', label: 'Frankfurt (Oder)', coordinate: P.frankfurtOder },
    ],
    sources: [EU_BELARUS_BORDER, GERMAN_LAND_BORDERS],
  },
  {
    id: 'jordan-resettlement-frankfurt',
    label: 'Jordan · German resettlement programme · Frankfurt Airport',
    status: 'regular',
    originLabel: 'Amman, Jordan',
    originCode: 'JOR',
    destinationLabel: 'Frankfurt Airport',
    destinationType: 'safe entry',
    legs: [
      {
        mode: 'air',
        waypoints: [P.amman, [25.0, 39.5], [15.0, 46.0], P.frankfurtAirport],
      },
    ],
    sources: [BAMF_RESETTLEMENT, BAMF_MIGRATION_REPORT],
  },
  {
    id: 'turkey-frankfurt-family-regular',
    label: 'Türkiye · air arrival · Frankfurt Airport',
    status: 'regular',
    originLabel: 'Istanbul, Türkiye',
    originCode: 'TUR',
    destinationLabel: 'Frankfurt Airport',
    destinationType: 'airport entry',
    legs: [
      {
        mode: 'air',
        waypoints: [P.istanbul, P.frankfurtAirport],
      },
    ],
    transitLabels: [
      { code: 'DEU', label: 'Frankfurt Airport', coordinate: P.frankfurtAirport },
    ],
    sources: [
      BAMF_MIGRATION_REPORT,
      {
        organization: 'Eurostat',
        title: 'Turkish citizens among large non-EU communities in Germany / EU',
        url: 'https://ec.europa.eu/eurostat/web/interactive-publications/migration-2025',
      },
    ],
  },
  {
    id: 'ukraine-medyka-frankfurt-oder-tpd',
    label: 'Ukraine · Medyka · Poland · Frankfurt (Oder) (temporary protection)',
    status: 'regular',
    originLabel: 'Lviv, Ukraine',
    originCode: 'UKR',
    destinationLabel: 'Frankfurt (Oder)',
    destinationType: 'land entry',
    legs: [
      {
        mode: 'land',
        waypoints: joinPaths(PATH.lvivToMedyka, PATH.medykaToWarsaw, PATH.warsawToFrankfurtOder),
      },
    ],
    transitLabels: [
      { code: 'POL', label: 'Medyka', coordinate: P.medyka },
      { code: 'POL', label: 'Warsaw', coordinate: P.warsaw },
      { code: 'DEU', label: 'Frankfurt (Oder)', coordinate: P.frankfurtOder },
    ],
    sources: [
      {
        organization: 'European Commission',
        title: 'Temporary protection for people fleeing Ukraine',
        url: 'https://home-affairs.ec.europa.eu/policies/migration-and-asylum/common-european-asylum-system/temporary-protection_en',
      },
      BAMF_MIGRATION_REPORT,
      GERMAN_LAND_BORDERS,
    ],
  },
  {
    id: 'senegal-spain-france-aachen',
    label: 'Senegal · Morocco · Spain · France · Aachen',
    status: 'irregular',
    originLabel: 'Dakar, Senegal',
    originCode: 'SEN',
    destinationLabel: 'Aachen',
    destinationType: 'land entry',
    legs: [
      { mode: 'land', waypoints: PATH.dakarToTangier },
      { mode: 'sea', waypoints: PATH.tangierToAlgecirasSea },
      {
        mode: 'land',
        waypoints: joinPaths(
          PATH.algecirasToBarcelona,
          [P.barcelona, P.figueres, P.cerbere, P.lyon, P.paris, P.lille, P.aachen],
        ),
      },
    ],
    transitLabels: [
      { code: 'MAR', label: 'Tangier', coordinate: P.tangier },
      { code: 'ESP', label: 'Algeciras', coordinate: P.algeciras },
      { code: 'FRA', label: 'Paris', coordinate: P.paris },
      { code: 'DEU', label: 'Aachen', coordinate: P.aachen },
    ],
    sources: [
      {
        organization: 'IOM DTM',
        title: 'West and Central African routes through the Sahel',
        url: 'https://dtm.iom.int/sites/g/files/tmzbdl1461/files/reports/WCA%20Routes%20Through%20Sahel_December%202023.pdf',
      },
      FRONTEX_2024,
      GERMAN_LAND_BORDERS,
    ],
  },
  {
    id: 'tunisia-italy-austria-freilassing',
    label: 'Tunisia · Central Mediterranean · Italy · Austria · Freilassing',
    status: 'irregular',
    originLabel: 'Sfax, Tunisia',
    originCode: 'TUN',
    destinationLabel: 'Freilassing',
    destinationType: 'land entry',
    legs: [
      {
        mode: 'sea',
        waypoints: joinPaths(PATH.sfaxToLampedusaSea, PATH.lampedusaToAugustaSea),
      },
      {
        mode: 'land',
        waypoints: joinPaths(
          PATH.italySicilyToRome,
          PATH.italyRomeToBrenner,
          [P.innsbruck, P.salzburg, P.freilassing],
        ),
      },
    ],
    transitLabels: [
      { code: 'ITA', label: 'Lampedusa', coordinate: P.lampedusa },
      { code: 'AUT', label: 'Brenner / Innsbruck', coordinate: P.innsbruck },
      { code: 'DEU', label: 'Freilassing', coordinate: P.freilassing },
    ],
    sources: [IOM_CENTRAL_MED, FRONTEX_2024, GERMAN_LAND_BORDERS],
  },
];
