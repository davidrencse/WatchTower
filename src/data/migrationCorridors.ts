export type MigrationLegMode = 'land' | 'sea' | 'air';
export type MigrationRouteStatus = 'irregular' | 'regular';
export type MigrationCoordinate = readonly [longitude: number, latitude: number];

export const EU_MEMBER_ISOS = [
  'AUT',
  'BEL',
  'BGR',
  'HRV',
  'CYP',
  'CZE',
  'DNK',
  'EST',
  'FIN',
  'FRA',
  'DEU',
  'GRC',
  'HUN',
  'IRL',
  'ITA',
  'LVA',
  'LTU',
  'LUX',
  'MLT',
  'NLD',
  'POL',
  'PRT',
  'ROU',
  'SVK',
  'SVN',
  'ESP',
  'SWE',
] as const;

export type EuMemberIso = (typeof EU_MEMBER_ISOS)[number];

export const MIGRATION_TARGET_ISOS = [
  ...EU_MEMBER_ISOS,
  'GBR',
  'NOR',
  'CHE',
  'ISL',
  'SRB',
  'BIH',
  'CAN',
  'USA',
  'RUS',
  'UKR',
  'CHN',
  'TWN',
  'KOR',
  'JPN',
] as const;
export type MigrationTargetIso = (typeof MIGRATION_TARGET_ISOS)[number];

export interface MigrationCorridorSource {
  organization: string;
  title: string;
  url: string;
}

export interface MigrationCorridorLeg {
  mode: MigrationLegMode;
  waypoints: readonly MigrationCoordinate[];
}

export interface MigrationTransitLabel {
  code: string;
  label: string;
  coordinate: MigrationCoordinate;
}

export interface MigrationCorridor {
  id: string;
  label: string;
  status: MigrationRouteStatus;
  originLabel: string;
  originCode: string;
  destinationLabel: string;
  destinationType: 'sea entry' | 'land entry' | 'airport entry' | 'safe entry';
  legs: readonly MigrationCorridorLeg[];
  transitLabels?: readonly MigrationTransitLabel[];
  sources: readonly MigrationCorridorSource[];
}
