/**
 * Russo-Ukrainian War layer.
 *
 * A self-contained, curated conflict overlay for the globe. Unlike the OSINT layer
 * (live X pins) this data is static and shipped with the app:
 *
 *   • {@link WAR_CONTROL_ZONES} + {@link WAR_FRONTLINE} recreate the front-line control
 *     map (Russian-occupied south-east, occupied Crimea, and the contact line) as a
 *     schematic of publicly reported control — not a scrape of any proprietary map tile API.
 *   • {@link WAR_EVENTS} are 50 geopinned incidents — barrages, localized strikes, ground
 *     clashes, Ukrainian deep strikes into Russia, air/naval events and other incidents.
 *
 * Coordinates are hand-placed to their reported settlement / sector; where several events
 * share a city they are nudged apart a few hundred metres so the beacons stay legible.
 */

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

/** A `[longitude, latitude]` pair. */
export type LngLat = readonly [number, number];

export interface WarControlZone {
  id: string;
  label: string;
  /** Canvas fill for the shaded territory. */
  fill: string;
  /** Hairline outline colour. */
  stroke: string;
  /** Outer ring in `[lng, lat]`, drawn closed. */
  ring: LngLat[];
}

/**
 * The vintage of the control geometry below. It is a **static, hand-built schematic** — not a
 * live feed — so every consumer should present it as an approximation of publicly reported
 * control rather than current ground truth.
 *
 * As-of **2026-08** (Donbas revised to the user’s control-map frame): the contact line runs
 * west of Lyman, Kostiantynivka, Pokrovsk / Myrnohrad, Kurakhove and Vuhledar — all RU —
 * while Sloviansk / Kramatorsk / Druzhkivka and Dobropillia remain UA behind it. Kharkiv, Zaporizhzhia south,
 * and Kherson sectors remain schematic of open reporting outside that frame. Settlement
 * coordinates are real; interpolation between them is schematic and will lag fluid gray-zone
 * fighting by days–weeks. Not a scrape of any proprietary map tile API.
 */
/**
 * The contact line — the western / northern edge of assessed Russian control.
 *
 * North → south anchors (Aug 2026 schematic):
 *   • Vovchansk Russian salient off the Belgorod border
 *   • Contested Kupiansk / Oskil corridor (east of Izyum)
 *   • West of Svatove–Kreminna; Lyman salient (RU), closing back east of Sloviansk
 *   • West of Siversk (RU); Bakhmut deep RU; west of Kostiantynivka (RU), Druzhkivka UA
 *   • West of Toretsk / Horlivka approaches; west of Pokrovsk / Myrnohrad (RU), Dobropillia UA
 *   • West of Kurakhove and Vuhledar (both RU) down to the Velyka Novosilka sector
 *   • West of Velyka Novosilka (RU, south of frame); NW of Huliaipole (RU open reporting)
 *   • South of Orikhiv (UA) past Polohy / Tokmak (RU) to Vasylivka, then the Dnipro past
 *     Enerhodar / Nova Kakhovka / Kherson to the estuary
 *
 * Not survey-grade. Dense vertices track the jagged reference shape; they are not a digitised
 * ISW map layer.
 */
export const WAR_FRONTLINE: LngLat[] = [
  // International border → Vovchansk salient (RU pocket into Kharkiv Oblast).
  [37.55, 50.36],
  [37.38, 50.34],
  [37.22, 50.33],
  [37.08, 50.32],
  [36.98, 50.3],
  [36.92, 50.27],
  [36.88, 50.24],
  [36.9, 50.2],
  [36.94, 50.16],
  [37.0, 50.12],
  [37.08, 50.06],
  [37.16, 50.0],
  // SE toward Kupiansk — Kharkiv / Chuhuiv / Velykyi Burluk remain well to the west (UA).
  [37.28, 49.94],
  [37.38, 49.9],
  [37.48, 49.86],
  [37.55, 49.82],
  [37.58, 49.78],
  [37.6, 49.74],
  // Kupiansk contested — line threads the town / Oskil crossings.
  [37.62, 49.71],
  [37.66, 49.68],
  [37.7, 49.64],
  [37.74, 49.6],
  [37.78, 49.56],
  [37.82, 49.52],
  // Svatove (RU to the east) / Borova approaches; Izyum stays west (UA).
  [37.86, 49.48],
  [37.9, 49.44],
  [37.94, 49.4],
  [37.98, 49.35],
  [38.0, 49.3],
  [38.02, 49.24],
  [38.04, 49.18],
  // Kreminna / Siverskodonetsk (RU) → Lyman salient: the line bends west of Lyman (37.8) so the
  // town sits inside RU control, then closes back east of Sloviansk (37.6, UA).
  [38.04, 49.12],
  [38.0, 49.09],
  [37.94, 49.07],
  [37.88, 49.06],
  [37.82, 49.05],
  [37.76, 49.04],
  [37.72, 49.02],
  [37.71, 48.99],
  [37.73, 48.97],
  [37.78, 48.96],
  [37.84, 48.95],
  [37.9, 48.94],
  [37.95, 48.93],
  // Jagged west of Siversk (RU); Sloviansk / Kramatorsk well west (UA).
  [38.0, 48.9],
  [37.98, 48.87],
  [37.96, 48.84],
  [37.94, 48.81],
  [37.92, 48.78],
  [37.9, 48.75],
  [37.88, 48.72],
  [37.9, 48.69],
  [37.88, 48.66],
  // Bakhmut sector — Bakhmut deep RU; Chasiv Yar on / just east of line; Druzhkivka UA west.
  [37.86, 48.64],
  [37.85, 48.62],
  [37.84, 48.6],
  [37.83, 48.58],
  // Kostiantynivka sector — the city (37.72) sits inside RU control; Druzhkivka / Kramatorsk
  // stay UA to the north-west.
  [37.82, 48.56],
  [37.76, 48.56],
  [37.7, 48.55],
  [37.64, 48.54],
  [37.6, 48.52],
  [37.58, 48.49],
  [37.56, 48.46],
  [37.54, 48.43],
  // West of Toretsk (RU); Horlivka / Yenakiieve well east (RU). Dobropillia (37.08) stays UA.
  [37.5, 48.41],
  [37.45, 48.4],
  [37.4, 48.39],
  [37.34, 48.38],
  [37.28, 48.37],
  [37.22, 48.36],
  [37.16, 48.35],
  // Pokrovsk / Myrnohrad agglomeration inside RU control — the line runs west of Pokrovsk (37.17).
  [37.1, 48.34],
  [37.06, 48.32],
  [37.03, 48.3],
  [37.02, 48.28],
  [37.02, 48.25],
  [37.03, 48.22],
  [37.04, 48.18],
  [37.05, 48.14],
  [37.06, 48.1],
  // Kurakhove pocket — the line stays west of the town (37.28) and its reservoir.
  [37.06, 48.06],
  [37.05, 48.02],
  [37.04, 47.98],
  [37.03, 47.94],
  [37.03, 47.9],
  [37.04, 47.87],
  // Vuhledar inside RU control — the line passes west of the town (37.25).
  [37.04, 47.84],
  [37.03, 47.81],
  [37.02, 47.79],
  [36.99, 47.78],
  [36.95, 47.78],
  [36.9, 47.8],
  // West of Velyka Novosilka (RU ~36.85/47.81, south of user frame).
  [36.88, 47.82],
  [36.82, 47.83],
  [36.76, 47.82],
  [36.72, 47.81],
  [36.68, 47.8],
  [36.62, 47.78],
  [36.54, 47.76],
  [36.46, 47.74],
  [36.38, 47.72],
  [36.32, 47.71],
  [36.26, 47.7],
  [36.2, 47.69],
  [36.14, 47.67],
  [36.06, 47.65],
  [35.98, 47.63],
  [35.9, 47.61],
  // South fringe of Orikhiv (UA) — Polohy / Tokmak remain south (RU).
  [35.82, 47.58],
  [35.78, 47.55],
  [35.76, 47.52],
  [35.72, 47.5],
  [35.66, 47.48],
  [35.58, 47.47],
  [35.48, 47.46],
  [35.38, 47.45],
  [35.3, 47.44],
  // Vasylivka (RU) — line meets the Dnipro and follows the river west / south.
  [35.25, 47.44],
  [35.16, 47.43],
  [35.06, 47.42],
  [34.96, 47.45],
  [34.84, 47.48],
  [34.72, 47.5],
  [34.6, 47.52],
  [34.5, 47.54],
  [34.4, 47.55],
  [34.28, 47.54],
  [34.16, 47.5],
  [34.04, 47.44],
  [33.94, 47.36],
  [33.84, 47.28],
  [33.74, 47.18],
  [33.66, 47.08],
  [33.58, 46.98],
  [33.5, 46.88],
  // Nova Kakhovka → Kherson (city UA, left bank RU) → estuary.
  [33.42, 46.8],
  [33.32, 46.74],
  [33.2, 46.7],
  [33.08, 46.68],
  [32.96, 46.66],
  [32.84, 46.65],
  [32.72, 46.64],
  [32.6, 46.62],
  [32.48, 46.6],
  [32.36, 46.58],
  [32.24, 46.56],
  [32.12, 46.54],
  [32.0, 46.5],
];

/**
 * Front-line control zones. The Russian-held mainland ring is the frontline above, closed
 * along the real Black Sea and Azov coastlines and the Russia–Ukraine international border;
 * Crimea is a separate ring so it can be shaded as longer-standing occupation.
 */
export const WAR_CONTROL_ZONES: WarControlZone[] = [
  {
    id: 'russian-mainland',
    label: 'Russian-controlled',
    fill: 'rgba(196,52,38,0.30)',
    stroke: 'rgba(232,86,66,0.5)',
    ring: [
      // Contact line, north → south-west (mirrors WAR_FRONTLINE).
      ...WAR_FRONTLINE,
      // Black Sea coast, east toward the Perekop isthmus.
      [32.05, 46.4],
      [32.3, 46.3],
      [32.6, 46.22],
      [33.0, 46.15],
      [33.4, 46.1],
      [33.69, 46.11],
      // North shore of the Syvash, east to Henichesk.
      [34.0, 46.2],
      [34.4, 46.2],
      [34.8, 46.17],
      // Sea of Azov coast, west → east past Berdiansk and Mariupol.
      [35.1, 46.3],
      [35.4, 46.45],
      [35.8, 46.6],
      [36.2, 46.68],
      [36.79, 46.76],
      [37.2, 46.9],
      [37.55, 47.1],
      [37.9, 47.1],
      [38.22, 47.1],
      // Russia–Ukraine international border, south → north around occupied Luhansk.
      [38.4, 47.3],
      [38.6, 47.6],
      [39.1, 47.85],
      [39.55, 48.05],
      [39.75, 48.3],
      [40.1, 48.55],
      [39.95, 48.8],
      [40.05, 49.1],
      [40.15, 49.35],
      [39.8, 49.55],
      [39.3, 49.72],
      [38.9, 49.9],
      [38.4, 50.0],
      [37.9, 50.1],
      [37.7, 50.22],
      [37.6, 50.3],
      // Closes near the Vovchansk-sector start of WAR_FRONTLINE.
    ],
  },
  {
    id: 'crimea',
    label: 'Crimea (occupied 2014)',
    fill: 'rgba(140,28,32,0.45)',
    stroke: 'rgba(210,70,64,0.5)',
    ring: [
      // Perekop isthmus, then the southern shore of the Syvash eastward.
      [33.69, 46.16],
      [34.2, 45.98],
      [34.6, 45.85],
      [35.0, 45.75],
      // Arabat / Azov shore to Kerch.
      [35.3, 45.6],
      [35.6, 45.5],
      [35.9, 45.45],
      [36.25, 45.45],
      [36.62, 45.38],
      // Kerch strait, then the south coast westward.
      [36.4, 45.2],
      [36.1, 45.1],
      [35.7, 45.0],
      [35.38, 45.0],
      [35.0, 44.85],
      [34.6, 44.75],
      [34.17, 44.5],
      [33.75, 44.4],
      [33.53, 44.6],
      // West coast north past Yevpatoria and the Tarkhankut peninsula.
      [33.35, 44.85],
      [33.3, 45.15],
      [32.6, 45.35],
      [32.5, 45.45],
      [33.0, 45.6],
      [33.35, 45.75],
      [33.55, 45.95],
    ],
  },
];

/**
 * Ground that neither side holds cleanly — the slivers of recent advance and active assault
 * that sit directly on the line. Deliberately coarse blobs centred on the settlement each
 * pocket is named for: the point is to show the line is *not* clean, not to claim block-level
 * accuracy.
 */
const CONTESTED_POCKET_SEEDS: Array<{
  id: string;
  label: string;
  center: LngLat;
  radius: number;
}> = [
  { id: 'vovchansk', label: 'Vovchansk', center: [36.94, 50.29], radius: 0.15 },
  { id: 'kupiansk', label: 'Kupiansk', center: [37.62, 49.71], radius: 0.16 },
  { id: 'lyman', label: 'W of Lyman', center: [37.72, 49.0], radius: 0.11 },
  { id: 'siversk-west', label: 'West of Siversk', center: [37.96, 48.86], radius: 0.1 },
  { id: 'chasiv-yar', label: 'Chasiv Yar', center: [37.83, 48.59], radius: 0.11 },
  // West approaches to Kostiantynivka (city itself RU, just behind the line).
  { id: 'kostiantynivka-west', label: 'W of Kostiantynivka', center: [37.58, 48.5], radius: 0.1 },
  // Gray zone west of the Pokrovsk / Myrnohrad agglomeration (both RU).
  { id: 'pokrovsk-west', label: 'W of Pokrovsk', center: [37.03, 48.28], radius: 0.11 },
  { id: 'vuhledar-west', label: 'W of Vuhledar', center: [37.03, 47.81], radius: 0.09 },
  { id: 'vozdvyzhivka', label: 'NW Huliaipole', center: [36.2, 47.7], radius: 0.13 },
  { id: 'orikhiv', label: 'Orikhiv', center: [35.79, 47.57], radius: 0.13 },
];

export const WAR_CONTESTED_POCKETS: WarControlZone[] = CONTESTED_POCKET_SEEDS.map(
  ({ id, label, center, radius }) => ({
    id,
    label,
    fill: 'rgba(238,214,120,0.24)',
    stroke: 'rgba(244,226,150,0.62)',
    ring: contestedRing(center, radius),
  }),
);

/** A squashed circle in degrees; longitude is widened so it reads round at Ukraine's latitude. */
function contestedRing(center: LngLat, radius: number): LngLat[] {
  const lonScale = 1 / Math.cos((center[1] * Math.PI) / 180);
  return Array.from({ length: 18 }, (_, index) => {
    const angle = (index / 18) * Math.PI * 2;
    return [
      center[0] + Math.cos(angle) * radius * lonScale,
      center[1] + Math.sin(angle) * radius,
    ] as LngLat;
  });
}

export type WarControlSide = 'ukrainian' | 'russian' | 'contested';

export interface WarSettlement {
  name: string;
  coordinate: LngLat;
  side: WarControlSide;
  /** 1 = always label once the war layer is readable; 3 = only at close zoom. */
  priority: 1 | 2 | 3;
}

/** Named places that make the line legible. Coordinates are real; control side is schematic. */
export const WAR_SETTLEMENTS: WarSettlement[] = [
  { name: 'Kharkiv', coordinate: [36.23, 49.99], side: 'ukrainian', priority: 1 },
  { name: 'Zaporizhzhia', coordinate: [35.14, 47.84], side: 'ukrainian', priority: 1 },
  { name: 'Kherson', coordinate: [32.62, 46.64], side: 'ukrainian', priority: 1 },
  { name: 'Donetsk', coordinate: [37.8, 48.0], side: 'russian', priority: 1 },
  { name: 'Luhansk', coordinate: [39.3, 48.57], side: 'russian', priority: 1 },
  { name: 'Mariupol', coordinate: [37.55, 47.1], side: 'russian', priority: 1 },
  { name: 'Melitopol', coordinate: [35.37, 46.84], side: 'russian', priority: 1 },
  { name: 'Simferopol', coordinate: [34.1, 44.95], side: 'russian', priority: 1 },
  { name: 'Sevastopol', coordinate: [33.53, 44.62], side: 'russian', priority: 1 },
  { name: 'Kramatorsk', coordinate: [37.55, 48.73], side: 'ukrainian', priority: 2 },
  { name: 'Sloviansk', coordinate: [37.6, 48.85], side: 'ukrainian', priority: 2 },
  { name: 'Druzhkivka', coordinate: [37.53, 48.62], side: 'ukrainian', priority: 2 },
  { name: 'Lyman', coordinate: [37.8, 48.99], side: 'russian', priority: 2 },
  { name: 'Izyum', coordinate: [37.25, 49.21], side: 'ukrainian', priority: 2 },
  { name: 'Nikopol', coordinate: [34.4, 47.57], side: 'ukrainian', priority: 2 },
  { name: 'Dobropillia', coordinate: [37.08, 48.47], side: 'ukrainian', priority: 2 },
  // Donbas frame: Pokrovsk / Myrnohrad / Kurakhove / Vuhledar all inside RU control; the line
  // now runs west of them, with Dobropillia and Kramatorsk / Sloviansk still UA.
  { name: 'Pokrovsk', coordinate: [37.17, 48.28], side: 'russian', priority: 2 },
  { name: 'Myrnohrad', coordinate: [37.27, 48.31], side: 'russian', priority: 2 },
  { name: 'Kurakhove', coordinate: [37.28, 47.99], side: 'russian', priority: 2 },
  { name: 'Vuhledar', coordinate: [37.25, 47.78], side: 'russian', priority: 2 },
  { name: 'Kupiansk', coordinate: [37.62, 49.71], side: 'contested', priority: 2 },
  { name: 'Huliaipole', coordinate: [36.26, 47.66], side: 'russian', priority: 2 },
  { name: 'Orikhiv', coordinate: [35.79, 47.57], side: 'contested', priority: 2 },
  { name: 'Kostiantynivka', coordinate: [37.72, 48.53], side: 'russian', priority: 2 },
  { name: 'Bakhmut', coordinate: [38.0, 48.6], side: 'russian', priority: 2 },
  { name: 'Horlivka', coordinate: [38.05, 48.33], side: 'russian', priority: 2 },
  { name: 'Berdiansk', coordinate: [36.79, 46.76], side: 'russian', priority: 2 },
  { name: 'Nova Kakhovka', coordinate: [33.37, 46.75], side: 'russian', priority: 2 },
  { name: 'Kerch', coordinate: [36.47, 45.36], side: 'russian', priority: 2 },
  { name: 'Svatove', coordinate: [38.15, 49.41], side: 'russian', priority: 3 },
  { name: 'Kreminna', coordinate: [38.22, 49.05], side: 'russian', priority: 3 },
  { name: 'Siverskodonetsk', coordinate: [38.49, 48.95], side: 'russian', priority: 3 },
  { name: 'Siversk', coordinate: [38.1, 48.87], side: 'russian', priority: 3 },
  { name: 'Chasiv Yar', coordinate: [37.83, 48.59], side: 'contested', priority: 3 },
  { name: 'Toretsk', coordinate: [37.85, 48.4], side: 'russian', priority: 3 },
  { name: 'Yenakiieve', coordinate: [38.21, 48.23], side: 'russian', priority: 3 },
  { name: 'Ilovaisk', coordinate: [38.0, 47.93], side: 'russian', priority: 3 },
  { name: 'Alchevsk', coordinate: [38.8, 48.48], side: 'russian', priority: 3 },
  { name: 'Vovchansk', coordinate: [36.94, 50.29], side: 'contested', priority: 3 },
  { name: 'Velyka Novosilka', coordinate: [36.85, 47.81], side: 'russian', priority: 3 },
  { name: 'Polohy', coordinate: [36.25, 47.48], side: 'russian', priority: 3 },
  { name: 'Tokmak', coordinate: [35.71, 47.25], side: 'russian', priority: 3 },
  { name: 'Enerhodar', coordinate: [34.63, 47.5], side: 'russian', priority: 3 },
  { name: 'Henichesk', coordinate: [34.8, 46.17], side: 'russian', priority: 3 },
  { name: 'Feodosia', coordinate: [35.38, 45.03], side: 'russian', priority: 3 },
  { name: 'Yalta', coordinate: [34.17, 44.5], side: 'russian', priority: 3 },
  { name: 'Dzhankoi', coordinate: [34.39, 45.71], side: 'russian', priority: 3 },
  { name: 'Yevpatoria', coordinate: [33.37, 45.19], side: 'russian', priority: 3 },
  { name: 'Armiansk', coordinate: [33.69, 46.11], side: 'russian', priority: 3 },
];
