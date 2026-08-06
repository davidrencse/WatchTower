/**
 * Orbital constellations drawn as shells around the globe.
 *
 * Elements come live from CelesTrak's GP endpoint (which does send CORS headers, so the browser
 * can read it directly — no bake step). Each group here is a real CelesTrak `GROUP=` slug; the
 * counts are not hard-coded because constellations change size weekly, so the legend reads its
 * numbers from whatever actually loaded.
 *
 * Positions are propagated with SGP4 in a worker (`src/workers/satellites.worker.ts`) and drawn
 * by a MapLibre custom layer that places each point at its true altitude above the globe.
 */

export type SatelliteOrbitClass = 'LEO' | 'MEO' | 'GEO' | 'mixed';

export interface SatelliteGroup {
  id: string;
  label: string;
  /** CelesTrak `GROUP=` slug. */
  celestrak: string;
  /** Dot colour on the dark globe. */
  color: string;
  orbit: SatelliteOrbitClass;
  /** Rough altitude band, for the legend. */
  altitude: string;
  /**
   * Claim only the satellites whose name matches, out of a shared CelesTrak group. Used because
   * CelesTrak has no `noaa` group (that slug answers HTTP 200 with "Invalid query") — the NOAA
   * birds sit inside `weather`. Groups are matched in declaration order and a satellite is only
   * claimed once, so a filtered group must be listed above the group it draws from.
   */
  nameFilter?: string;
}

export const SATELLITE_GROUPS: SatelliteGroup[] = [
  { id: 'stations', label: 'Space stations', celestrak: 'stations', color: '#7dd3fc', orbit: 'LEO', altitude: '~420 km' },
  { id: 'starlink', label: 'Starlink', celestrak: 'starlink', color: '#dfe6f2', orbit: 'LEO', altitude: '~550 km' },
  { id: 'oneweb', label: 'OneWeb', celestrak: 'oneweb', color: '#f5c14a', orbit: 'LEO', altitude: '~1,200 km' },
  { id: 'iridium', label: 'Iridium NEXT', celestrak: 'iridium-NEXT', color: '#e879f9', orbit: 'LEO', altitude: '~780 km' },
  { id: 'noaa', label: 'NOAA', celestrak: 'weather', color: '#fca5a5', orbit: 'LEO', altitude: '~850 km', nameFilter: '^NOAA' },
  { id: 'goes', label: 'GOES', celestrak: 'goes', color: '#fb923c', orbit: 'GEO', altitude: '35,786 km' },
  { id: 'weather', label: 'Weather', celestrak: 'weather', color: '#67e8f9', orbit: 'mixed', altitude: 'LEO–GEO' },
  { id: 'amateur', label: 'Amateur radio', celestrak: 'amateur', color: '#a3e635', orbit: 'LEO', altitude: 'LEO' },
  { id: 'science', label: 'Science', celestrak: 'science', color: '#f472b6', orbit: 'mixed', altitude: 'mixed' },
  { id: 'gps', label: 'GPS', celestrak: 'gps-ops', color: '#6ee7a8', orbit: 'MEO', altitude: '~20,200 km' },
  { id: 'galileo', label: 'Galileo', celestrak: 'galileo', color: '#c4b5fd', orbit: 'MEO', altitude: '~23,200 km' },
  { id: 'geo', label: 'Geostationary', celestrak: 'geo', color: '#facc15', orbit: 'GEO', altitude: '35,786 km' },
];

/** Elements are re-fetched at most this often; TLEs are only updated a few times a day. */
export const SATELLITE_TLE_TTL_MS = 6 * 60 * 60 * 1000;

export function celestrakTleUrl(group: SatelliteGroup): string {
  // TLE rather than JSON: same elements, roughly half the bytes over the wire.
  return `https://celestrak.org/NORAD/elements/gp.php?GROUP=${group.celestrak}&FORMAT=tle`;
}
