import { getIso3ForFlagId, flagIdHasCountryStats } from './flagIsoMapping';

export type CountryRegion = 'Europe' | 'North America' | 'Oceania' | 'Africa' | 'Asia';

const EU_MEMBERS = new Set([
  'AUT', 'BEL', 'BGR', 'HRV', 'CYP', 'CZE', 'DNK', 'EST', 'FIN', 'FRA',
  'DEU', 'GRC', 'HUN', 'IRL', 'ITA', 'LVA', 'LTU', 'LUX', 'MLT', 'NLD',
  'POL', 'PRT', 'ROU', 'SVK', 'SVN', 'ESP', 'SWE',
]);

const REGION_BY_ISO3: Record<string, CountryRegion> = {
  AUS: 'Oceania', NZL: 'Oceania',
  USA: 'North America', CAN: 'North America',
  ZAF: 'Africa',
};

/** Derived region label — falls back to Europe for the rest of the curated set. */
export function regionForFlagId(flagId: string): CountryRegion {
  const iso3 = getIso3ForFlagId(flagId);
  if (iso3 && REGION_BY_ISO3[iso3]) return REGION_BY_ISO3[iso3];
  return 'Europe';
}

export function isEuMember(flagId: string): boolean {
  const iso3 = getIso3ForFlagId(flagId);
  return iso3 ? EU_MEMBERS.has(iso3) : false;
}

export type CountryBrief = {
  flagId: string;
  label: string;
  iso3: string | null;
  region: CountryRegion;
  euMember: boolean;
  hasDossier: boolean;
};

export function briefFor(flagId: string, label: string): CountryBrief {
  return {
    flagId,
    label,
    iso3: getIso3ForFlagId(flagId) ?? null,
    region: regionForFlagId(flagId),
    euMember: isEuMember(flagId),
    hasDossier: flagIdHasCountryStats(flagId),
  };
}
