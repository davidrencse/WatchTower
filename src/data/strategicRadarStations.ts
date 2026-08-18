/**
 * THESIS: Public strategic sensors should read as a network, not as incident noise.
 * OWN-WORLD: Small radar reticles, restrained mission colours, square technical labels.
 * STORY: A visitor sees where allied missile-warning, missile-defence, and space-surveillance
 * infrastructure is publicly acknowledged, then opens the primary source behind each marker.
 * FIRST VIEWPORT: Reticles are visible at globe scale; collision-managed names wait until the
 * camera commits to a region.
 * FORM: A local extension of WatchTower's cartographic situation room; no new visual world.
 */

export type StrategicRadarMission = 'warning' | 'defense' | 'space';

export const STRATEGIC_RADAR_MISSION_META: Record<
  StrategicRadarMission,
  { label: string; color: string }
> = {
  warning: { label: 'Missile warning', color: '#d6ad68' },
  defense: { label: 'Missile defence', color: '#c97d6d' },
  space: { label: 'Space surveillance', color: '#72aeb2' },
};

export const STRATEGIC_RADAR_ASSESSED_AT = '17 Aug 2026';

export interface StrategicRadarStation {
  id: string;
  name: string;
  shortName: string;
  system: string;
  mission: StrategicRadarMission;
  operator: string;
  host: string;
  /** Approximate public landmark coordinate: [longitude, latitude]. */
  coordinates: readonly [number, number];
  note: string;
  sourceOrg: string;
  sourceUrl: string;
}

/**
 * Curated fixed-site catalogue, not a claim of global completeness. Every entry is an
 * operational site acknowledged by its operator or host government. Coordinates are deliberately
 * presented as approximate public landmark locations; the linked source establishes the station
 * and mission, not surveyed antenna coordinates.
 */
export const STRATEGIC_RADAR_STATIONS: readonly StrategicRadarStation[] = [
  {
    id: 'cape-cod-uewr',
    name: 'Cape Cod Space Force Station',
    shortName: 'CAPE COD',
    system: 'AN/FPS-132 UEWR',
    mission: 'warning',
    operator: 'U.S. Space Force · 6 SWS',
    host: 'Massachusetts, United States',
    coordinates: [-70.54, 41.75],
    note: 'Detects and reports missile launches while tracking high-interest satellite passes.',
    sourceOrg: 'U.S. Space Force',
    sourceUrl:
      'https://www.spaceforce.mil/About-Us/Fact-Sheets/Fact-Sheet-Display/Article/3687880/6th-space-warning-squadron/',
  },
  {
    id: 'beale-uewr',
    name: 'Beale Air Force Base radar site',
    shortName: 'BEALE',
    system: 'AN/FPS-132 UEWR',
    mission: 'warning',
    operator: 'U.S. Space Force · 7 SWS',
    host: 'California, United States',
    coordinates: [-121.35, 39.14],
    note: 'Provides strategic missile warning, missile defence data, and space-domain awareness.',
    sourceOrg: 'U.S. Space Force',
    sourceUrl:
      'https://www.buckley.spaceforce.mil/About-Us/Fact-Sheets/Display/Article/322395/space-delta-4-missile-warning/',
  },
  {
    id: 'clear-uewr-lrdr',
    name: 'Clear Space Force Station',
    shortName: 'CLEAR',
    system: 'UEWR / LRDR',
    mission: 'warning',
    operator: 'U.S. Space Force · 13 SWS',
    host: 'Alaska, United States',
    coordinates: [-149.19, 64.29],
    note: 'Hosts early-warning and long-range discrimination radars supporting warning and defence.',
    sourceOrg: 'U.S. Space Force',
    sourceUrl:
      'https://www.buckley.spaceforce.mil/About-Us/Fact-Sheets/Display/Article/322395/space-delta-4-missile-warning/',
  },
  {
    id: 'pituffik-uewr',
    name: 'Pituffik Space Base radar site',
    shortName: 'PITUFFIK',
    system: 'AN/FPS-132 UEWR',
    mission: 'warning',
    operator: 'U.S. Space Force · 12 SWS',
    host: 'Greenland, Kingdom of Denmark',
    coordinates: [-68.3, 76.57],
    note: 'Performs missile warning, missile defence, and space surveillance from Greenland.',
    sourceOrg: 'U.S. Space Force',
    sourceUrl:
      'https://www.petersonschriever.spaceforce.mil/Pituffik-SB-Greenland/About-Us/Fact-Sheets/Display/Article/326224/12th-space-warning-squadron/About-Us/Fact-Sheets/Display/Article/326240/821st-air-base-group/',
  },
  {
    id: 'fylingdales-uewr',
    name: 'RAF Fylingdales',
    shortName: 'FYLINGDALES',
    system: 'AN/FPS-132 UEWR',
    mission: 'warning',
    operator: 'Royal Air Force · 2 Space Warning Squadron',
    host: 'North Yorkshire, United Kingdom',
    coordinates: [-0.67, 54.36],
    note: 'Provides continuous ballistic-missile warning and space surveillance for the UK and allies.',
    sourceOrg: 'Royal Air Force',
    sourceUrl: 'https://www.raf.mod.uk/our-organisation/stations/raf-fylingdales/',
  },
  {
    id: 'cavalier-parcs',
    name: 'Cavalier Space Force Station',
    shortName: 'CAVALIER',
    system: 'AN/FPQ-16 PARCS',
    mission: 'warning',
    operator: 'U.S. Space Force · 10 SWS',
    host: 'North Dakota, United States',
    coordinates: [-97.9, 48.72],
    note: 'Tracks ballistic-missile threats and supplies collateral space-surveillance data.',
    sourceOrg: 'U.S. Space Force',
    sourceUrl:
      'https://www.ussf-cfc.spaceforce.mil/About-Us/Fact-Sheets/Display/Article/2381658/perimeter-acquisition-radar-attack-characterization-system',
  },
  {
    id: 'eareckson-cobra-dane',
    name: 'Eareckson Air Station radar site',
    shortName: 'COBRA DANE',
    system: 'AN/FPS-108 Cobra Dane',
    mission: 'defense',
    operator: 'U.S. Space Force · 13 SWS',
    host: 'Shemya Island, Alaska, United States',
    coordinates: [174.09, 52.73],
    note: 'Supplies missile tracking to the Ballistic Missile Defense System and tracks space objects.',
    sourceOrg: 'U.S. Space Force',
    sourceUrl:
      'https://www.petersonschriever.spaceforce.mil/Newsroom/Commentaries/Display/Article/734515/cobra-dane-a-piece-of-history-transitions-to-afspc/',
  },
  {
    id: 'eglin-fps85',
    name: 'Eglin Site C-6',
    shortName: 'EGLIN C-6',
    system: 'AN/FPS-85',
    mission: 'space',
    operator: 'U.S. Space Force · 20 SPSS',
    host: 'Florida, United States',
    coordinates: [-86.21, 30.57],
    note: 'Phased-array deep-space radar used to detect and track objects in Earth orbit.',
    sourceOrg: 'U.S. Space Force',
    sourceUrl:
      'https://www.spaceforce.mil/About-Us/Fact-Sheets/Fact-Sheet-Display/Article/3741067/20th-space-surveillance-squadron/',
  },
  {
    id: 'kwajalein-space-fence',
    name: 'Kwajalein Space Fence',
    shortName: 'SPACE FENCE',
    system: 'AN/FSY-3 Space Fence',
    mission: 'space',
    operator: 'U.S. Space Force · 20 SPSS OL-A',
    host: 'Kwajalein Atoll, Marshall Islands',
    coordinates: [167.73, 8.72],
    note: 'Equatorial S-band radar dedicated to detecting and tracking orbital objects and debris.',
    sourceOrg: 'U.S. Space Force',
    sourceUrl:
      'https://www.spaceforce.mil/About-Us/Fact-Sheets/Fact-Sheet-Display/Article/3741067/20th-space-surveillance-squadron/',
  },
  {
    id: 'kurecik-tpy2',
    name: 'Kürecik radar station',
    shortName: 'KÜRECİK',
    system: 'AN/TPY-2 FBM',
    mission: 'defense',
    operator: 'United States / NATO BMD',
    host: 'Malatya Province, Türkiye',
    coordinates: [37.79, 38.35],
    note: 'Forward-based sensor contributing early tracking data to NATO ballistic-missile defence.',
    sourceOrg: 'NATO',
    sourceUrl: 'https://www.nato.int/en/what-we-do/deterrence-and-defence/ballistic-missile-defence',
  },
  {
    id: 'shariki-tpy2',
    name: 'Shariki radar site',
    shortName: 'SHARIKI',
    system: 'AN/TPY-2 FBM',
    mission: 'defense',
    operator: 'U.S. Army / U.S. Missile Defense Agency',
    host: 'Aomori Prefecture, Japan',
    coordinates: [140.34, 40.88],
    note: 'Forward-based X-band sensor supporting regional and U.S. homeland missile defence.',
    sourceOrg: 'U.S. Missile Defense Agency',
    sourceUrl: 'https://www.mda.mil/about/history.html',
  },
  {
    id: 'kyogamisaki-tpy2',
    name: 'Kyogamisaki radar site',
    shortName: 'KYOGAMISAKI',
    system: 'AN/TPY-2 FBM',
    mission: 'defense',
    operator: 'U.S. Army / U.S. Missile Defense Agency',
    host: 'Kyoto Prefecture, Japan',
    coordinates: [135.2, 35.76],
    note: 'Forward-based X-band sensor improving tracking coverage for launches from North Korea.',
    sourceOrg: 'U.S. Missile Defense Agency',
    sourceUrl: 'https://www.mda.mil/about/history.html',
  },
  {
    id: 'exmouth-cband',
    name: 'Harold E. Holt C-Band Radar',
    shortName: 'EXMOUTH C-BAND',
    system: 'AN/FPQ-15 C-Band Radar',
    mission: 'space',
    operator: 'Australian Defence Force / U.S. Space Force',
    host: 'Exmouth, Western Australia',
    coordinates: [114.16, -21.82],
    note: 'Southern-hemisphere sensor that tracks satellites and orbital debris.',
    sourceOrg: 'Australian Department of Defence',
    sourceUrl:
      'https://www.minister.defence.gov.au/media-releases/2017-03-07/australias-space-surveillance-radar-reaches-full-operational-capability',
  },
];
