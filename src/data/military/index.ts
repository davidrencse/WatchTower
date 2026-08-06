import { FRANCE_MILITARY_PROFILE } from './france';
import { GERMANY_MILITARY_PROFILE } from './germany';
import { ITALY_MILITARY_PROFILE } from './italy';
import { SPAIN_MILITARY_PROFILE } from './spain';
import type { MilitaryProfile } from './types';

/**
 * Countries with a hand-curated military section, keyed by ISO3.
 *
 * A country listed here renders `components/military/NationalMilitarySection`
 * with its own force structure, branch naming and country-specific panels.
 * Anything not listed falls back to the generic GlobalFirePower-driven
 * `CountryMilitarySection` — so this map, not `treatAsGermany`, decides which
 * military page a country gets.
 */
export const MILITARY_PROFILES: Readonly<Record<string, MilitaryProfile>> = {
  DEU: GERMANY_MILITARY_PROFILE,
  FRA: FRANCE_MILITARY_PROFILE,
  ITA: ITALY_MILITARY_PROFILE,
  ESP: SPAIN_MILITARY_PROFILE,
};

export function militaryProfileFor(iso3: string): MilitaryProfile | null {
  return MILITARY_PROFILES[iso3.toUpperCase()] ?? null;
}

export type { MilitaryProfile } from './types';
