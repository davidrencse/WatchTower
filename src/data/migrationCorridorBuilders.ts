/**
 * Shared constructors for origin-keyed corridor sets (India, Pakistan).
 *
 * The regional files each declare corridors literally because every record differs.
 * Origin-keyed files instead repeat one shape many times — same origin code, same
 * air-then-land structure — so they build through these helpers.
 */

import type {
  MigrationCoordinate,
  MigrationCorridor,
  MigrationCorridorLeg,
  MigrationCorridorSource,
  MigrationTransitLabel,
} from './migrationCorridors';

export interface AirCorridorArgs {
  id: string;
  label: string;
  originLabel: string;
  origin: MigrationCoordinate;
  /** Curated en-route hubs, in travel order; each also becomes a transit label. */
  hubs: readonly MigrationTransitLabel[];
  destinationLabel: string;
  destination: MigrationCoordinate;
  sources: readonly MigrationCorridorSource[];
}

export interface MixedCorridorArgs {
  id: string;
  label: string;
  status: MigrationCorridor['status'];
  originLabel: string;
  legs: readonly MigrationCorridorLeg[];
  destinationLabel: string;
  destinationType: MigrationCorridor['destinationType'];
  transitLabels: readonly MigrationTransitLabel[];
  sources: readonly MigrationCorridorSource[];
}

/** Corridor constructors bound to a single country of origin. */
export function corridorBuilders(originCode: string) {
  /** Regular air corridor: origin → curated hubs → airport of entry. */
  function air({
    id,
    label,
    originLabel,
    origin,
    hubs,
    destinationLabel,
    destination,
    sources,
  }: AirCorridorArgs): MigrationCorridor {
    return {
      id,
      label,
      status: 'regular',
      originLabel,
      originCode,
      destinationLabel,
      destinationType: 'airport entry',
      legs: [
        { mode: 'air', waypoints: [origin, ...hubs.map((hub) => hub.coordinate), destination] },
      ],
      transitLabels: hubs,
      sources,
    };
  }

  /** Multi-leg corridor whose legs the caller composes (air arrival then overland, etc.). */
  function mixed(args: MixedCorridorArgs): MigrationCorridor {
    return { ...args, originCode };
  }

  return { air, mixed };
}
