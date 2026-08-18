/**
 * Russo-Ukrainian War layer.
 *
 * A conflict overlay for the globe, in two halves:
 *
 *   • {@link WAR_CONTROL_ZONES}, {@link WAR_FRONTLINE_SEGMENTS} and
 *     {@link WAR_CONTESTED_POCKETS} are the control map, styled here but traced in
 *     `warFrontlineGeometry.ts` from a dated DeepState snapshot — the same assessment
 *     LiveUAMap and militarysummary.com report against. See {@link FRONTLINE_SNAPSHOT} for
 *     the revision on screen; refresh it with `npm run update:frontline`.
 *   • {@link WAR_EVENTS} are 50 geopinned incidents — barrages, localized strikes, ground
 *     clashes, Ukrainian deep strikes into Russia, air/naval events and other incidents.
 *     These are hand-placed to their reported settlement / sector; where several events share
 *     a city they are nudged apart a few hundred metres so the beacons stay legible.
 *
 * The control geometry is OSINT, so it lags contested ground by days and shows an assessment
 * rather than ground truth. Present it as of its snapshot date, never as live.
 */

import {
  CONTACT_SEGMENTS,
  CONTROL_RINGS,
  CONTROL_SETTLEMENTS,
  CRIMEA_RINGS,
  GRAY_ZONE_RINGS,
  type ControlSide,
  type LngLat,
  type TracedSegment,
  type TracedSettlement,
} from './warFrontlineGeometry';

export type WarCategoryId =
  | 'barrage'
  | 'strike'
  | 'clash'
  | 'deep'
  | 'air'
  | 'incident';

export interface WarCategoryMeta {
  id: WarCategoryId;
  /** Human label in the layer picker. */
  title: string;
  /** Three-letter tactical code. */
  code: string;
  /** Marker colour. */
  color: string;
  /** On by default on first load. */
  defaultOn: boolean;
}

/** The war-layer taxonomy. Colours are distinct from the OSINT / EONET palettes. */
export const WAR_CATEGORIES: WarCategoryMeta[] = [
  { id: 'barrage', title: 'Missile / Drone Barrage', code: 'BRG', color: '#ff3b30', defaultOn: true },
  { id: 'strike', title: 'Strikes & Shelling', code: 'STK', color: '#ff8a3d', defaultOn: true },
  { id: 'clash', title: 'Frontline Clashes', code: 'GRD', color: '#f2c14e', defaultOn: true },
  { id: 'deep', title: 'Deep Strikes in Russia', code: 'DPS', color: '#39c0ff', defaultOn: true },
  { id: 'air', title: 'Air & Naval', code: 'AIR', color: '#4fd6c9', defaultOn: true },
  { id: 'incident', title: 'Other Incidents', code: 'INC', color: '#c98be5', defaultOn: true },
];

export const WAR_CATEGORY_BY_ID: Record<WarCategoryId, WarCategoryMeta> =
  WAR_CATEGORIES.reduce(
    (map, category) => {
      map[category.id] = category;
      return map;
    },
    {} as Record<WarCategoryId, WarCategoryMeta>,
  );

export interface WarEvent {
  id: string;
  categoryId: WarCategoryId;
  /** Short headline for the marker card. */
  title: string;
  /** One-to-two sentence summary shown on hover. */
  summary: string;
  /** Where it happened, shown as the card footer. */
  placeName: string;
  latitude: number;
  longitude: number;
}

/** The 50 curated events. */
export const WAR_EVENTS: WarEvent[] = [
  {
    id: 'kyiv-barrage',
    categoryId: 'barrage',
    title: 'Ballistic & drone barrage on Kyiv',
    summary:
      'Dozens of ballistic missiles and ~190 drones overnight; 9+ killed, 30+ wounded, residential buildings ablaze.',
    placeName: 'Kyiv · Darnytskyi & Solomyanskyi',
    latitude: 50.42,
    longitude: 30.63,
  },
  {
    id: 'zaporizhzhia-region-strikes',
    categoryId: 'strike',
    title: 'Strikes across Zaporizhzhia region',
    summary:
      '1,000+ attacks — airstrikes, FPV, MLRS and artillery on dozens of settlements in 24h; 1 killed, 2 injured.',
    placeName: 'Zaporizhzhia Oblast',
    latitude: 47.84,
    longitude: 35.14,
  },
  {
    id: 'pavlohrad-bombardment',
    categoryId: 'strike',
    title: 'Bombardment of Pavlohrad',
    summary: 'Strikes wounded 8; a separate strike on a shopping mall wounded 1.',
    placeName: 'Pavlohrad, Dnipropetrovsk',
    latitude: 48.535,
    longitude: 35.87,
  },
  {
    id: 'nikopol-grenade',
    categoryId: 'incident',
    title: 'Grenade explosion in Nikopol',
    summary: 'A hand-grenade explosion wounded 2.',
    placeName: 'Nikopol, Dnipropetrovsk',
    latitude: 47.571,
    longitude: 34.393,
  },
  {
    id: 'khartiya-assassination',
    categoryId: 'incident',
    title: 'Assassination attempt on commander',
    summary:
      'Attempt on Khartiya commander Ihor Obolensky; the attacker and an accomplice were detained.',
    placeName: 'Ukraine · location undisclosed',
    latitude: 49.99,
    longitude: 36.23,
  },
  {
    id: 'kharkiv-uav',
    categoryId: 'strike',
    title: 'Explosion & UAV strike in Kharkiv',
    summary: 'Explosions reported; a UAV strike wounded 2 in the Nemyshlyanskyi district.',
    placeName: 'Kharkiv · Nemyshlyanskyi',
    latitude: 49.98,
    longitude: 36.35,
  },
  {
    id: 'kherson-airstrike-1',
    categoryId: 'strike',
    title: 'Airstrike on Kherson',
    summary: 'A Russian airstrike wounded at least 4.',
    placeName: 'Kherson',
    latitude: 46.6354,
    longitude: 32.6169,
  },
  {
    id: 'odesa-missile-1',
    categoryId: 'strike',
    title: 'Explosions & missile strike in Odesa',
    summary: 'Explosions and rising smoke; a missile strike wounded 2.',
    placeName: 'Odesa',
    latitude: 46.4825,
    longitude: 30.7233,
  },
  {
    id: 'sumy-drone-1',
    categoryId: 'strike',
    title: 'Drone raid on Sumy',
    summary: 'An explosion was reported amid drone activity.',
    placeName: 'Sumy',
    latitude: 50.9077,
    longitude: 34.7981,
  },
  {
    id: 'lublin-missile',
    categoryId: 'incident',
    title: 'Missile crash near Lublin, Poland',
    summary:
      'A missile crashed overnight; the Polish PM said there was no indication it was aimed at Poland.',
    placeName: 'Tarnawa-Kolonia, E Poland',
    latitude: 50.72,
    longitude: 22.95,
  },
  {
    id: 'kushugum-fpv',
    categoryId: 'strike',
    title: 'FPV drone strike in Kushugum',
    summary: 'An FPV drone targeted a car.',
    placeName: 'Kushugum, Zaporizhzhia',
    latitude: 47.72,
    longitude: 35.28,
  },
  {
    id: 'bilozerka-drone',
    categoryId: 'strike',
    title: 'Drone strike on car in Bilozerka',
    summary: 'A drone strike on a vehicle killed 2.',
    placeName: 'Bilozerka, Kherson',
    latitude: 46.61,
    longitude: 32.42,
  },
  {
    id: 'kerch-bridge',
    categoryId: 'deep',
    title: 'Kerch Bridge rail section damaged',
    summary: 'The railway part of the Kerch Bridge was reportedly damaged by an earlier drone strike.',
    placeName: 'Kerch Bridge, Kerch Strait',
    latitude: 45.3,
    longitude: 36.52,
  },
  {
    id: 'sloviansk-airstrike',
    categoryId: 'strike',
    title: 'Airstrikes on Sloviansk',
    summary: 'Airstrikes wounded 14.',
    placeName: 'Sloviansk, Donetsk',
    latitude: 48.8556,
    longitude: 37.6061,
  },
  {
    id: 'pavlohrad-earlier',
    categoryId: 'strike',
    title: 'Earlier strike on Pavlohrad',
    summary: 'A strike killed 3 and wounded 10.',
    placeName: 'Pavlohrad, Dnipropetrovsk',
    latitude: 48.52,
    longitude: 35.85,
  },
  {
    id: 'huliaipole-clashes',
    categoryId: 'clash',
    title: 'Clashes on the Huliaipole axis',
    summary: 'Fighting near Vozdvyzhivka, Dobropillya and surrounding settlements.',
    placeName: 'Huliaipole sector, Zaporizhzhia',
    latitude: 47.66,
    longitude: 36.2,
  },
  {
    id: 'orikhiv-clashes',
    categoryId: 'clash',
    title: 'Clashes on the Orikhiv axis',
    summary: 'Clashes near Mala Tokmachka, Mali Shcherbaky and nearby villages.',
    placeName: 'Orikhiv sector, Zaporizhzhia',
    latitude: 47.57,
    longitude: 35.79,
  },
  {
    id: 'lyman-clashes',
    categoryId: 'clash',
    title: 'Clashes on the Lyman axis',
    summary: 'Fighting near Drobysheve, Lyman, Ozerne and related areas.',
    placeName: 'Lyman sector, Donetsk',
    latitude: 49.0,
    longitude: 37.75,
  },
  {
    id: 'kramatorsk-clashes',
    categoryId: 'clash',
    title: 'Clashes on the Kramatorsk axis',
    summary: 'Clashes near Minkivka, Tykhonivka and surrounding villages.',
    placeName: 'Kramatorsk sector, Donetsk',
    latitude: 48.66,
    longitude: 37.5,
  },
  {
    id: 'nizhnekamsk-deep',
    categoryId: 'deep',
    title: 'Long-range strikes inside Russia',
    summary: 'Fires at oil infrastructure including the Nizhnekamsk refinery and other sites.',
    placeName: 'Nizhnekamsk, Tatarstan',
    latitude: 55.6386,
    longitude: 51.8106,
  },
  {
    id: 'overnight-package-1',
    categoryId: 'barrage',
    title: 'Overnight missile & drone package',
    summary:
      'Ballistic and cruise missiles plus hundreds of drones launched at multiple regions.',
    placeName: 'Kyiv–Kharkiv–Odesa axes',
    latitude: 49.8,
    longitude: 32.0,
  },
  {
    id: 'zaporizhzhia-explosion',
    categoryId: 'strike',
    title: 'Explosion in Zaporizhzhia',
    summary: 'An explosion was heard in the city.',
    placeName: 'Zaporizhzhia',
    latitude: 47.85,
    longitude: 35.1,
  },
  {
    id: 'sumy-strikes-2',
    categoryId: 'strike',
    title: 'Strikes in Sumy',
    summary: 'Strikes wounded 7.',
    placeName: 'Sumy',
    latitude: 50.92,
    longitude: 34.78,
  },
  {
    id: 'mykolaiv-explosions',
    categoryId: 'strike',
    title: 'Explosions in Mykolaiv',
    summary: 'A series of explosions was reported.',
    placeName: 'Mykolaiv',
    latitude: 46.975,
    longitude: 31.9946,
  },
  {
    id: 'bilopillia-drone',
    categoryId: 'strike',
    title: 'Drone strike in Bilopillia',
    summary: 'A drone strike wounded 3, including 2 children.',
    placeName: 'Bilopillia, Sumy',
    latitude: 51.1466,
    longitude: 34.3097,
  },
  {
    id: 'zaporizhzhia-bombardment',
    categoryId: 'strike',
    title: 'Bombardment of Zaporizhzhia',
    summary: 'The number wounded from the bombardment rose to 7.',
    placeName: 'Zaporizhzhia',
    latitude: 47.82,
    longitude: 35.18,
  },
  {
    id: 'odesa-explosions-2',
    categoryId: 'strike',
    title: 'Explosions across Odesa region',
    summary: 'Multiple explosions were heard across the city and region.',
    placeName: 'Odesa Oblast',
    latitude: 46.5,
    longitude: 30.7,
  },
  {
    id: 'kherson-airstrike-2',
    categoryId: 'strike',
    title: 'Airstrikes in Kherson',
    summary: 'An airstrike wounded 5.',
    placeName: 'Kherson',
    latitude: 46.65,
    longitude: 32.6,
  },
  {
    id: 'su57-crash',
    categoryId: 'air',
    title: 'Su-57 crash near Moscow',
    summary: 'A Russian Su-57 aircraft crashed in the Odintsovo district.',
    placeName: 'Odintsovo, Moscow Oblast',
    latitude: 55.676,
    longitude: 37.279,
  },
  {
    id: 'oleksandrivka-clashes',
    categoryId: 'clash',
    title: 'Clashes on the Oleksandrivka axis',
    summary: 'Fighting near Ternove and Kalynivske.',
    placeName: 'Oleksandrivka sector, Dnipropetrovsk',
    latitude: 47.95,
    longitude: 36.65,
  },
  {
    id: 'overnight-package-2',
    categoryId: 'barrage',
    title: 'Overnight strike package',
    summary: '1 Iskander-M ballistic missile, guided missiles and 168 drones launched.',
    placeName: 'Odesa region and beyond',
    latitude: 46.45,
    longitude: 30.8,
  },
  {
    id: 'ulyanovsk-depot',
    categoryId: 'deep',
    title: 'Oil depot attack in Ulyanovsk',
    summary: 'An oil depot was attacked near Novospasskoye.',
    placeName: 'Novospasskoye, Ulyanovsk',
    latitude: 53.15,
    longitude: 47.75,
  },
  {
    id: 'dnipro-explosions',
    categoryId: 'strike',
    title: 'Explosions near Dnipro',
    summary: 'Explosions were reported in the area.',
    placeName: 'Dnipro',
    latitude: 48.47,
    longitude: 35.05,
  },
  {
    id: 'sloviansk-glide',
    categoryId: 'strike',
    title: 'Glide-bomb strikes on Sloviansk',
    summary: 'Two glide bombs killed 5 and wounded 9.',
    placeName: 'Sloviansk, Donetsk',
    latitude: 48.87,
    longitude: 37.58,
  },
  {
    id: 'kyiv-region-missile',
    categoryId: 'strike',
    title: 'Missile strike in Kyiv region',
    summary: 'A missile strike killed 6 and wounded several people.',
    placeName: 'Kyiv Oblast',
    latitude: 50.1,
    longitude: 30.2,
  },
  {
    id: 'kirov-missile',
    categoryId: 'deep',
    title: 'Missile strike in Kirov',
    summary: 'A strike killed 6 and wounded 32.',
    placeName: 'Kirov, Russia',
    latitude: 58.6035,
    longitude: 49.6679,
  },
  {
    id: 'sudak-blackout',
    categoryId: 'deep',
    title: 'Drone strike blackout in Sudak',
    summary: 'A strike on a substation caused a power blackout and an ongoing fire.',
    placeName: 'Sudak, occupied Crimea',
    latitude: 44.8492,
    longitude: 34.9749,
  },
  {
    id: 'belgorod-explosions',
    categoryId: 'deep',
    title: 'Explosions in Belgorod',
    summary: 'Explosions were heard in the city.',
    placeName: 'Belgorod, Russia',
    latitude: 50.5997,
    longitude: 36.5983,
  },
  {
    id: 'zaporizhzhia-warehouse',
    categoryId: 'strike',
    title: 'Warehouse fire in Zaporizhzhia',
    summary: 'A large fire broke out after a Russian strike on a warehouse.',
    placeName: 'Zaporizhzhia',
    latitude: 47.8,
    longitude: 35.2,
  },
  {
    id: 'sumy-strikes-3',
    categoryId: 'strike',
    title: 'Strikes in Sumy',
    summary: 'Strikes killed 3 and wounded 3 more.',
    placeName: 'Sumy',
    latitude: 50.9,
    longitude: 34.82,
  },
  {
    id: 'slobozhansky-clashes',
    categoryId: 'clash',
    title: 'Clashes on the South Slobozhansky axis',
    summary: 'Fighting near Starytsya, Zapadne and other villages.',
    placeName: 'N Kharkiv Oblast',
    latitude: 50.28,
    longitude: 36.95,
  },
  {
    id: 'chernihiv-drone',
    categoryId: 'strike',
    title: 'Drone strike on a store in Chernihiv',
    summary: 'A drone strike killed 2 and wounded 3.',
    placeName: 'Chernihiv',
    latitude: 51.4982,
    longitude: 31.2893,
  },
  {
    id: 'romania-f16',
    categoryId: 'air',
    title: 'Romanian F-16 downs a drone',
    summary: 'A Romanian F-16 shot down a Shahed-type drone over territorial waters.',
    placeName: 'Sulina–Kiliya, Black Sea',
    latitude: 45.3,
    longitude: 29.6,
  },
  {
    id: 'chornomorsk-oniks',
    categoryId: 'strike',
    title: 'Oniks missiles toward Chornomorsk',
    summary: 'Two Oniks missiles were directed toward Chornomorsk.',
    placeName: 'Chornomorsk, Odesa',
    latitude: 46.302,
    longitude: 30.656,
  },
  {
    id: 'kharkiv-slobidskyi',
    categoryId: 'strike',
    title: 'Strike on Kharkiv (Slobidskyi)',
    summary: 'A strike wounded 9 in the Slobidskyi district.',
    placeName: 'Kharkiv · Slobidskyi',
    latitude: 49.95,
    longitude: 36.28,
  },
  {
    id: 'overnight-package-3',
    categoryId: 'barrage',
    title: 'Overnight launch package',
    summary: 'A Kh-59/69 missile, 7 ballistic missiles and 136 drones were launched.',
    placeName: 'Multiple regions, Ukraine',
    latitude: 49.5,
    longitude: 32.5,
  },
  {
    id: 'kryvyi-rih-mall',
    categoryId: 'strike',
    title: 'Epicenter mall fire, Kryvyi Rih',
    summary: 'The mall was set on fire after a Russian drone strike.',
    placeName: 'Kryvyi Rih, Dnipropetrovsk',
    latitude: 47.9105,
    longitude: 33.3918,
  },
  {
    id: 'kostiantynivka-clashes',
    categoryId: 'clash',
    title: 'Clashes on the Kostiantynivka axis',
    summary: 'Fighting near Kostyantynivka, Illinivka and surrounding areas.',
    placeName: 'Kostiantynivka sector, Donetsk',
    latitude: 48.53,
    longitude: 37.7,
  },
  {
    id: 'deep-strikes-multi',
    categoryId: 'deep',
    title: 'Deep strikes on Russian industry',
    summary:
      'Long-range strikes hit Kirov, a Tyumen refinery, Yekaterinburg logistics and other targets.',
    placeName: 'Multiple deep-rear sites, Russia',
    latitude: 56.8389,
    longitude: 60.6057,
  },
  {
    id: 'blacksea-aviation',
    categoryId: 'air',
    title: 'Russian tactical aviation over Black Sea',
    summary: 'Russian tactical aircraft were reported active over the Black Sea.',
    placeName: 'NW Black Sea',
    latitude: 44.0,
    longitude: 31.5,
  },
];

// ── Control geometry ─────────────────────────────────────────────────────────
//
// Everything below is styling over `warFrontlineGeometry.ts`, which is regenerated from the
// DeepState snapshot by `npm run update:frontline`. Nothing here is hand-placed: this file used
// to carry a hand-drawn schematic that had drifted — it put Lyman and Kostiantynivka inside
// Russian control and drew the gray zone as ten circles — so the shapes, the contact line and
// each settlement's side are all derived from the snapshot now.

export type { LngLat } from './warFrontlineGeometry';
export { FRONTLINE_SNAPSHOT } from './warFrontlineGeometry';

export interface WarControlZone {
  id: string;
  label: string;
  /** Canvas fill for the shaded territory. */
  fill: string;
  /** Hairline outline colour. */
  stroke: string;
  /** Outer ring in `[lng, lat]`, drawn closed. */
  ring: readonly LngLat[];
}

const slug = (id: string) =>
  id
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/**
 * Russian-controlled territory. The mainland mass and Crimea are separate rings so Crimea can be
 * shaded as longer-standing occupation; the mainland ring already encloses it, so the two overlap
 * deliberately and the darker fill reads as the older annexation.
 */
export const WAR_CONTROL_ZONES: WarControlZone[] = [
  ...CONTROL_RINGS.map((shape) => ({
    id: slug(shape.id),
    label: `${shape.id} · ${shape.areaKm2.toLocaleString('en-US')} km²`,
    fill: 'rgba(196,52,38,0.30)',
    stroke: 'rgba(232,86,66,0.5)',
    ring: shape.ring,
  })),
  ...CRIMEA_RINGS.map((ring, index) => ({
    id: index === 0 ? 'crimea' : `crimea-${index + 1}`,
    label: 'Crimea (occupied 2014)',
    fill: 'rgba(140,28,32,0.45)',
    stroke: 'rgba(210,70,64,0.5)',
    ring,
  })),
];

/**
 * The line of contact. It arrives as several segments because the traced boundary is split
 * wherever it runs onto an international border or a shoreline: one ~960 km run from the Oskil
 * down to the Dnipro estuary, plus short arcs around the border salients north of Kharkiv and
 * in Sumy Oblast.
 */
export const WAR_FRONTLINE_SEGMENTS: readonly TracedSegment[] = CONTACT_SEGMENTS;

/** The main run, for consumers that want one continuous front rather than every segment. */
export const WAR_FRONTLINE: readonly LngLat[] = CONTACT_SEGMENTS[0]?.path ?? [];

/**
 * Ground that neither side holds cleanly — DeepState's `unknown status` polygons, which are the
 * gray zone between the two forward edges rather than a claim about who will end up holding it.
 */
export const WAR_CONTESTED_POCKETS: WarControlZone[] = GRAY_ZONE_RINGS.map((shape) => ({
  id: slug(shape.id),
  label: shape.id.replace(/ \d+$/, ''),
  fill: 'rgba(238,214,120,0.24)',
  stroke: 'rgba(244,226,150,0.62)',
  ring: shape.ring,
}));

export type WarControlSide = ControlSide;
export type WarSettlement = TracedSettlement;

/** Named places that make the line legible. Both the coordinate and the side come from the data. */
export const WAR_SETTLEMENTS: readonly WarSettlement[] = CONTROL_SETTLEMENTS;
