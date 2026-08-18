/**
 * Major seaborne trade lanes between the world's largest trading economies.
 *
 * Every waypoint is a point of open water, a marked traffic-separation scheme, or a canal
 * transit — the lanes are drawn as ships actually sail them, not as straight lines between
 * capitals. `scripts/check-trade-routes.mjs` densifies each lane and point-in-polygon tests
 * every vertex against the baked Natural Earth 10m land mask, so a lane that clips a coastline
 * fails the check rather than shipping.
 *
 * Figures are the standard public reference numbers (EIA world oil transit chokepoints,
 * UNCTAD Review of Maritime Transport, canal authority traffic reports) and each record
 * carries the source it came from. Volumes move year to year — the year is part of the text.
 */

export type TradeCoordinate = readonly [longitude: number, latitude: number];

/** Cargo family. Drives lane colour on the globe. */
export type TradeCommodity = 'container' | 'energy' | 'bulk';

/**
 * `primary` — the standing routing.
 * `diversion` — a re-route currently carrying traffic away from a primary lane.
 * `seasonal` — navigable only part of the year.
 */
export type TradeLaneStatus = 'primary' | 'diversion' | 'seasonal';

export interface TradeSource {
  organization: string;
  title: string;
  url: string;
}

export interface TradePort {
  code: string;
  name: string;
  country: string;
  iso3: string;
  coordinate: TradeCoordinate;
  /** One line of why this port is on the map — throughput, rank, or what it ships. */
  note: string;
}

export interface TradeChokepoint {
  id: string;
  code: string;
  name: string;
  coordinate: TradeCoordinate;
  /** Headline share of world trade or transit volume, with its year. */
  volume: string;
  note: string;
  sources: readonly TradeSource[];
}

export interface TradeLane {
  id: string;
  label: string;
  commodity: TradeCommodity;
  status: TradeLaneStatus;
  fromPort: string;
  toPort: string;
  /** Chokepoint ids the lane transits, in travel order. */
  chokepoints: readonly string[];
  /** Sea distance, nautical miles — the routing below, not great-circle point to point. */
  distanceNm: number;
  /** Headline volume or value carried on this lane. */
  volume: string;
  note: string;
  /** Open-water waypoints, in travel order, from berth to berth. */
  waypoints: readonly TradeCoordinate[];
  sources: readonly TradeSource[];
}

// ── Path helpers ────────────────────────────────────────────────────────────

type Path = readonly TradeCoordinate[];

/** Join segments end to end, dropping the duplicated junction at each seam. */
function join(...segments: Path[]): TradeCoordinate[] {
  const out: TradeCoordinate[] = [];
  for (const segment of segments) {
    for (const point of segment) {
      const prev = out[out.length - 1];
      if (prev && prev[0] === point[0] && prev[1] === point[1]) continue;
      out.push(point);
    }
  }
  return out;
}

/** A lane sailed the other way is the same water in reverse. */
function rev(segment: Path): TradeCoordinate[] {
  return [...segment].reverse();
}

// ── Sources ─────────────────────────────────────────────────────────────────

const EIA_CHOKEPOINTS: TradeSource = {
  organization: 'U.S. Energy Information Administration',
  title: 'World Oil Transit Chokepoints',
  url: 'https://www.eia.gov/international/analysis/special-topics/World_Oil_Transit_Chokepoints',
};

const UNCTAD_MARITIME: TradeSource = {
  organization: 'UNCTAD',
  title: 'Review of Maritime Transport',
  url: 'https://unctad.org/publication/review-maritime-transport-2024',
};

const SUEZ_AUTHORITY: TradeSource = {
  organization: 'Suez Canal Authority',
  title: 'Navigation Statistics',
  url: 'https://www.suezcanal.gov.eg/English/Navigation/Pages/NavigationStatistics.aspx',
};

const PANAMA_AUTHORITY: TradeSource = {
  organization: 'Panama Canal Authority',
  title: 'Canal de Panamá — Traffic and Transits',
  url: 'https://pancanal.com/en/maritime-services/',
};

const IMO_SHIPPING: TradeSource = {
  organization: 'International Maritime Organization',
  title: 'Maritime Security and Red Sea Shipping Advisories',
  url: 'https://www.imo.org/en/MediaCentre/HotTopics/Pages/Red-Sea-attacks.aspx',
};

const NSR_ADMIN: TradeSource = {
  organization: 'Northern Sea Route Administration',
  title: 'Navigation on the Northern Sea Route',
  url: 'https://www.nsra.ru/en/',
};

// ── Ports ───────────────────────────────────────────────────────────────────

/**
 * Berth coordinates sit on the water side of each terminal, so a lane's last leg ends in the
 * harbour basin rather than on the quay. River ports (Hamburg, New Orleans) are reached along
 * their navigation channel, not across the delta.
 */
export const TRADE_PORTS: readonly TradePort[] = [
  {
    code: 'CNSHA',
    name: 'Shanghai — Yangshan',
    country: 'China',
    iso3: 'CHN',
    coordinate: [122.07, 30.62],
    note: "World's busiest container port — over 49m TEU (2023).",
  },
  {
    code: 'CNNGB',
    name: 'Ningbo-Zhoushan',
    country: 'China',
    iso3: 'CHN',
    coordinate: [122.15, 29.93],
    note: "World's largest port by cargo tonnage; China's main crude import cluster.",
  },
  {
    code: 'CNTAO',
    name: 'Qingdao',
    country: 'China',
    iso3: 'CHN',
    coordinate: [120.24, 36.03],
    note: 'Primary discharge port for Australian and Brazilian iron ore.',
  },
  {
    code: 'SGSIN',
    name: 'Singapore',
    country: 'Singapore',
    iso3: 'SGP',
    coordinate: [103.76, 1.24],
    note: "World's largest transhipment hub and bunkering port.",
  },
  {
    code: 'KRPUS',
    name: 'Busan',
    country: 'South Korea',
    iso3: 'KOR',
    coordinate: [129.06, 35.04],
    note: 'North-east Asia transhipment hub; top-10 container port worldwide.',
  },
  {
    code: 'JPCHB',
    name: 'Chiba — Tokyo Bay',
    country: 'Japan',
    iso3: 'JPN',
    coordinate: [140.05, 35.55],
    note: "Japan's largest LNG and crude receiving complex.",
  },
  {
    code: 'JPYOK',
    name: 'Yokohama',
    country: 'Japan',
    iso3: 'JPN',
    coordinate: [139.68, 35.44],
    note: 'Principal container gateway for the Tokyo industrial belt.',
  },
  {
    code: 'INNSA',
    name: 'Nhava Sheva (JNPA)',
    country: 'India',
    iso3: 'IND',
    coordinate: [72.94, 18.95],
    note: "India's largest container port — roughly half of national container traffic.",
  },
  {
    code: 'INVAD',
    name: 'Vadinar',
    country: 'India',
    iso3: 'IND',
    coordinate: [69.73, 22.35],
    note: 'Single-point moorings serving the Jamnagar refinery complex.',
  },
  {
    code: 'SARTA',
    name: 'Ras Tanura',
    country: 'Saudi Arabia',
    iso3: 'SAU',
    coordinate: [50.16, 26.72],
    note: "World's largest crude oil export terminal.",
  },
  {
    code: 'QARLF',
    name: 'Ras Laffan',
    country: 'Qatar',
    iso3: 'QAT',
    coordinate: [51.61, 25.94],
    note: "Qatar's LNG export terminal — among the largest single LNG complexes on earth.",
  },
  {
    code: 'NLRTM',
    name: 'Rotterdam — Maasvlakte',
    country: 'Netherlands',
    iso3: 'NLD',
    coordinate: [4.03, 51.95],
    note: "Europe's largest port by tonnage and its main crude and container gateway.",
  },
  {
    code: 'DEHAM',
    name: 'Hamburg',
    country: 'Germany',
    iso3: 'DEU',
    coordinate: [9.93, 53.53],
    note: "Germany's largest port, 100 km up the Elbe navigation channel.",
  },
  {
    code: 'USLAX',
    name: 'Los Angeles / Long Beach',
    country: 'United States',
    iso3: 'USA',
    coordinate: [-118.22, 33.72],
    note: 'The San Pedro Bay complex — the largest US container gateway.',
  },
  {
    code: 'USNYC',
    name: 'New York / New Jersey',
    country: 'United States',
    iso3: 'USA',
    coordinate: [-74.13, 40.66],
    note: 'Largest container port on the US East Coast.',
  },
  {
    code: 'USSAB',
    name: 'Sabine Pass',
    country: 'United States',
    iso3: 'USA',
    coordinate: [-93.86, 29.73],
    note: 'First and largest US LNG export terminal on the Gulf Coast.',
  },
  {
    code: 'USMSR',
    name: 'Mississippi River — Southwest Pass',
    country: 'United States',
    iso3: 'USA',
    coordinate: [-89.42, 28.93],
    note: 'Sea entrance to the Mississippi grain elevators — the US soybean and corn outlet.',
  },
  {
    code: 'BRSSZ',
    name: 'Santos',
    country: 'Brazil',
    iso3: 'BRA',
    coordinate: [-46.31, -23.99],
    note: 'Largest container and agricultural export port in Latin America.',
  },
  {
    code: 'BRPDM',
    name: 'Ponta da Madeira',
    country: 'Brazil',
    iso3: 'BRA',
    coordinate: [-44.37, -2.57],
    note: 'Vale iron-ore terminal at São Luís; loads Valemax ore carriers for Asia.',
  },
  {
    code: 'AUPHE',
    name: 'Port Hedland',
    country: 'Australia',
    iso3: 'AUS',
    coordinate: [118.57, -20.31],
    note: "World's largest bulk export port — Pilbara iron ore.",
  },
  {
    code: 'AUGLT',
    name: 'Gladstone',
    country: 'Australia',
    iso3: 'AUS',
    coordinate: [151.25, -23.83],
    note: 'Queensland coal and LNG export terminal on the inner Barrier Reef route.',
  },
  {
    code: 'RUNVS',
    name: 'Novorossiysk',
    country: 'Russia',
    iso3: 'RUS',
    coordinate: [37.79, 44.7],
    note: "Russia's principal Black Sea crude and grain export port.",
  },
  {
    code: 'RUKOZ',
    name: 'Kozmino',
    country: 'Russia',
    iso3: 'RUS',
    coordinate: [132.4, 42.71],
    note: 'Pacific terminus of the ESPO pipeline; loads crude for East Asia.',
  },
  {
    code: 'RUMMK',
    name: 'Murmansk',
    country: 'Russia',
    iso3: 'RUS',
    coordinate: [33.06, 69.06],
    note: 'Ice-free Arctic port and western gateway to the Northern Sea Route.',
  },
  {
    code: 'NGBON',
    name: 'Bonny',
    country: 'Nigeria',
    iso3: 'NGA',
    coordinate: [7.17, 4.32],
    note: 'Nigeria’s main crude export terminal and LNG loading point.',
  },
] as const;

export const TRADE_PORT_BY_CODE: Record<string, TradePort> = Object.fromEntries(
  TRADE_PORTS.map((port) => [port.code, port]),
);

// ── Chokepoints ─────────────────────────────────────────────────────────────

export const TRADE_CHOKEPOINTS: readonly TradeChokepoint[] = [
  {
    id: 'malacca',
    code: 'MLC',
    name: 'Strait of Malacca',
    coordinate: [100.4, 2.9],
    volume: '≈23.7m barrels/day of oil (2023)',
    note: 'The Indian Ocean–Pacific gate. Narrows to 1.7 nautical miles at Phillips Channel; every Gulf-to-East-Asia cargo passes through it or takes the longer Lombok detour.',
    sources: [EIA_CHOKEPOINTS, UNCTAD_MARITIME],
  },
  {
    id: 'hormuz',
    code: 'HRZ',
    name: 'Strait of Hormuz',
    coordinate: [56.4, 26.57],
    volume: '≈20.9m barrels/day of oil (2023)',
    note: 'The only sea route out of the Persian Gulf — roughly a fifth of global petroleum liquids consumption transits a 21-nautical-mile-wide channel.',
    sources: [EIA_CHOKEPOINTS],
  },
  {
    id: 'suez',
    code: 'SUZ',
    name: 'Suez Canal',
    coordinate: [32.35, 30.5],
    volume: '≈12–15% of world trade in normal years',
    note: 'The Asia–Europe short cut. Traffic collapsed after the Red Sea attacks began in late 2023, pushing container lines around the Cape of Good Hope.',
    sources: [SUEZ_AUTHORITY, UNCTAD_MARITIME],
  },
  {
    id: 'bab-el-mandeb',
    code: 'BAB',
    name: 'Bab el-Mandeb',
    coordinate: [43.4, 12.6],
    volume: '≈8.7m barrels/day of oil (2023)',
    note: 'The southern door to the Red Sea, 18 nautical miles wide. Houthi missile and drone attacks from Yemen made it the pinch point of the Suez lane.',
    sources: [EIA_CHOKEPOINTS, IMO_SHIPPING],
  },
  {
    id: 'panama',
    code: 'PAN',
    name: 'Panama Canal',
    coordinate: [-79.68, 9.1],
    volume: '≈5% of world seaborne trade',
    note: 'Atlantic–Pacific lock transit. Draught and daily-transit limits tighten whenever Gatún Lake runs low, rationing slots for US Gulf LNG and grain.',
    sources: [PANAMA_AUTHORITY, UNCTAD_MARITIME],
  },
  {
    id: 'good-hope',
    code: 'GDH',
    name: 'Cape of Good Hope',
    coordinate: [19.6, -35.6],
    volume: 'Absorbed most diverted Asia–Europe traffic from 2024',
    note: 'No canal fee and no missile risk, at the cost of roughly 10 extra days and 3,500 nautical miles per Asia–Europe voyage.',
    sources: [UNCTAD_MARITIME, IMO_SHIPPING],
  },
  {
    id: 'gibraltar',
    code: 'GIB',
    name: 'Strait of Gibraltar',
    coordinate: [-5.6, 35.95],
    volume: 'Sole sea entrance to the Mediterranean',
    note: 'Eight nautical miles wide at its narrowest; every Suez-routed cargo bound for northern Europe passes through it.',
    sources: [UNCTAD_MARITIME],
  },
  {
    id: 'dover',
    code: 'DVR',
    name: 'Dover Strait',
    coordinate: [1.55, 51.02],
    volume: 'Busiest shipping lane in the world by transits',
    note: 'Around 400 vessel movements a day funnel between the Channel and the North Sea approaches to Rotterdam, Antwerp and Hamburg.',
    sources: [UNCTAD_MARITIME],
  },
  {
    id: 'turkish-straits',
    code: 'BOS',
    name: 'Turkish Straits',
    coordinate: [29.05, 41.1],
    volume: '≈3m barrels/day of oil',
    note: 'Bosphorus and Dardanelles — the outlet for Black Sea crude and Ukrainian and Russian grain, under Montreux Convention transit rules.',
    sources: [EIA_CHOKEPOINTS],
  },
  {
    id: 'taiwan-strait',
    code: 'TWS',
    name: 'Taiwan Strait',
    coordinate: [119.5, 24.4],
    volume: 'Over a fifth of world container traffic passes through',
    note: 'The default routing between the South China Sea and the ports of eastern China, Korea and Japan.',
    sources: [UNCTAD_MARITIME],
  },
  {
    id: 'lombok',
    code: 'LMB',
    name: 'Lombok Strait',
    coordinate: [115.75, -8.7],
    volume: 'Deep-draught alternative to Malacca',
    note: 'Capesize ore carriers too deep for Malacca run Australia–China through Lombok and the Makassar Strait.',
    sources: [EIA_CHOKEPOINTS],
  },
  {
    id: 'bering',
    code: 'BRG',
    name: 'Bering Strait',
    coordinate: [-169.0, 65.8],
    volume: 'Pacific gate of the Northern Sea Route',
    note: '51 nautical miles wide between Siberia and Alaska; open to commercial convoys only in the summer melt window.',
    sources: [NSR_ADMIN],
  },
] as const;

export const TRADE_CHOKEPOINT_BY_ID: Record<string, TradeChokepoint> = Object.fromEntries(
  TRADE_CHOKEPOINTS.map((point) => [point.id, point]),
);

// ── Shared water ────────────────────────────────────────────────────────────
// Corridors used by more than one lane are declared once and joined, so the Suez run or the
// Malacca approach is literally the same geometry on every lane that sails it.

/** Maasvlakte out through the Dover Strait and the Channel to the Atlantic off Ushant. */
const ROTTERDAM_TO_USHANT: Path = [
  [4.03, 51.95],
  [3.6, 51.93],
  [2.7, 51.6],
  [1.9, 51.25],
  [1.55, 51.02],
  [1.0, 50.6],
  [0.0, 50.35],
  [-1.6, 50.05],
  [-3.4, 49.9],
  [-5.2, 49.4],
  [-5.9, 48.45],
];

/** Ushant across Biscay and down the Iberian coast to the Strait of Gibraltar. */
const USHANT_TO_GIBRALTAR: Path = [
  [-5.9, 48.45],
  [-8.3, 46.6],
  [-9.7, 44.5],
  [-9.9, 42.9],
  [-9.7, 40.5],
  [-9.6, 38.6],
  [-9.4, 36.9],
  [-7.3, 36.1],
  [-5.6, 35.95],
];

/** Gibraltar through the Alboran Sea, the Sicily Channel and the eastern Med to Port Said. */
const GIBRALTAR_TO_PORT_SAID: Path = [
  [-5.6, 35.95],
  [-3.5, 36.15],
  [-0.5, 37.3],
  [2.5, 37.9],
  [6.0, 37.9],
  [9.5, 37.6],
  [11.6, 37.2],
  [13.5, 35.9],
  [16.5, 34.6],
  [21.0, 33.4],
  [25.5, 32.7],
  [29.5, 31.8],
  [32.3, 31.4],
];

/**
 * Port Said, the canal cut, the Great Bitter Lake and the Gulf of Suez to the Red Sea.
 * The Gulf of Suez points track its axis: it is barely 20 km wide at the northern end, so a
 * straight run from Suez city to the Red Sea puts the lane on the Sinai shore.
 */
const SUEZ_TRANSIT: Path = [
  [32.3, 31.4],
  [32.32, 31.15],
  [32.33, 30.85],
  [32.35, 30.5],
  [32.36, 30.2],
  [32.55, 29.9],
  [32.62, 29.6],
  [32.72, 29.3],
  [32.9, 29.0],
  [33.2, 28.6],
  [33.5, 28.2],
  [33.85, 27.8],
  [34.25, 27.3],
];

/** Red Sea axis from the Gulf of Suez down to Bab el-Mandeb. */
const RED_SEA: Path = [
  [34.25, 27.3],
  [35.6, 25.4],
  [36.8, 23.6],
  [37.9, 21.6],
  [38.9, 19.8],
  [39.9, 18.0],
  [40.9, 16.2],
  [42.2, 14.4],
  [43.15, 13.1],
  [43.4, 12.6],
];

/** Bab el-Mandeb through the Gulf of Aden and past Socotra into the Arabian Sea. */
const BAB_TO_ARABIAN_SEA: Path = [
  [43.4, 12.6],
  [45.5, 12.3],
  [48.5, 12.1],
  [51.5, 12.4],
  [54.5, 13.3],
  [58.0, 14.6],
];

/**
 * Arabian Sea south of Sri Lanka and across the Bay of Bengal to the Malacca approach.
 * The last legs stay north of 6°N: the strait is entered around the top of Sumatra, not
 * across the Aceh peninsula.
 */
const ARABIAN_SEA_TO_MALACCA: Path = [
  [58.0, 14.6],
  [63.0, 12.5],
  [68.0, 9.5],
  [73.0, 7.2],
  [77.5, 5.6],
  [80.8, 5.3],
  [85.0, 5.4],
  [90.0, 6.0],
  [94.0, 6.5],
  [96.5, 6.6],
  [98.3, 5.6],
];

/** Malacca Strait proper — One Fathom Bank, Phillips Channel, Singapore Strait. */
const MALACCA_TRANSIT: Path = [
  [98.3, 5.6],
  [99.2, 4.6],
  [100.4, 2.9],
  [101.6, 2.2],
  [103.0, 1.35],
  [103.55, 1.22],
  [103.76, 1.24],
];

/** Singapore Strait east into the South China Sea. */
const SINGAPORE_TO_SOUTH_CHINA_SEA: Path = [
  [103.76, 1.24],
  [104.3, 1.25],
  [105.2, 2.1],
  [106.5, 4.0],
  [108.5, 7.5],
];

/** South China Sea up to the Taiwan Strait and the Yangtze estuary approaches. */
const SOUTH_CHINA_SEA_TO_SHANGHAI: Path = [
  [108.5, 7.5],
  [110.5, 11.0],
  [112.5, 15.0],
  [114.5, 18.5],
  [117.0, 21.5],
  [119.5, 24.4],
  [121.3, 26.3],
  [122.4, 28.6],
  [122.6, 30.0],
  [122.07, 30.62],
];

/** Hormuz out through the Gulf of Oman into the Arabian Sea. */
const HORMUZ_TO_ARABIAN_SEA: Path = [
  [56.4, 26.57],
  [57.4, 25.6],
  [58.8, 24.6],
  [60.5, 23.4],
  [62.0, 21.0],
  [62.5, 18.0],
  [61.5, 15.5],
  [58.0, 14.6],
];

/** Ras Tanura out through the Gulf to the Strait of Hormuz. */
const GULF_TO_HORMUZ: Path = [
  [50.16, 26.72],
  [50.9, 26.6],
  [52.0, 26.3],
  [53.5, 26.0],
  [55.0, 26.1],
  [56.4, 26.57],
];

/** Canaries down the West African offing to the Cape of Good Hope. */
const CANARIES_TO_GOOD_HOPE: Path = [
  [-13.0, 28.5],
  [-17.5, 22.0],
  [-19.0, 15.0],
  [-16.0, 8.0],
  [-9.0, 2.0],
  [-2.0, -6.0],
  [4.0, -14.0],
  [9.0, -22.0],
  [13.0, -29.0],
  [17.0, -34.0],
  [19.6, -35.6],
];

/** Cape of Good Hope across the southern Indian Ocean and round the top of Sumatra. */
const GOOD_HOPE_TO_MALACCA: Path = [
  [19.6, -35.6],
  [28.0, -35.5],
  [38.0, -33.0],
  [50.0, -28.0],
  [62.0, -20.0],
  [72.0, -12.0],
  [80.0, -6.0],
  [88.0, -1.0],
  [93.0, 2.0],
  [94.5, 5.2],
  [95.3, 6.6],
  [96.5, 6.8],
  [98.3, 5.6],
];

/** Caribbean approaches, the lock transit, and out into the Gulf of Panama. */
const PANAMA_TRANSIT_SOUTHBOUND: Path = [
  [-79.9, 9.55],
  [-79.92, 9.37],
  [-79.8, 9.25],
  [-79.68, 9.1],
  [-79.6, 8.95],
  [-79.55, 8.85],
  [-79.4, 8.6],
];

/** Gulf of Panama out around the Azuero peninsula to the open eastern Pacific. */
const PANAMA_TO_PACIFIC: Path = [
  [-79.4, 8.6],
  [-79.3, 8.0],
  [-79.8, 6.9],
  [-82.0, 6.6],
  [-86.0, 7.5],
  [-92.0, 10.5],
  [-100.0, 14.0],
  [-110.0, 17.5],
];

/** Colón out across the Caribbean and up the US eastern seaboard to the New York approaches. */
const PANAMA_TO_US_EAST: Path = [
  [-79.9, 9.55],
  [-78.5, 12.5],
  [-76.0, 15.5],
  [-74.2, 19.0],
  [-73.6, 21.5],
  [-74.5, 25.0],
  [-76.5, 29.0],
  [-77.5, 32.5],
  [-75.5, 35.0],
  [-73.9, 38.5],
  [-73.85, 40.45],
  [-74.05, 40.6],
  [-74.13, 40.66],
];

/** New York approaches across the North Atlantic to the western Channel. */
const US_EAST_TO_USHANT: Path = [
  [-74.13, 40.66],
  [-74.05, 40.6],
  [-73.85, 40.45],
  [-71.0, 40.6],
  [-66.0, 42.0],
  [-58.0, 43.5],
  [-48.0, 45.5],
  [-38.0, 47.5],
  [-28.0, 49.0],
  [-18.0, 49.5],
  [-9.5, 49.0],
  [-5.9, 48.45],
];

/**
 * Yangshan out through the Osumi gap south of Kyushu, then the North Pacific great circle
 * along the Aleutian offing into San Pedro Bay. Japan is passed on its Pacific side — a
 * straight Shanghai-to-Los-Angeles line would run over Kyushu and Shikoku.
 */
const SHANGHAI_TO_LOS_ANGELES: Path = [
  [122.07, 30.62],
  [123.5, 30.6],
  [126.0, 30.2],
  [129.0, 29.6],
  [131.5, 29.8],
  [134.5, 31.0],
  [138.0, 32.6],
  [141.5, 34.3],
  [145.0, 36.5],
  [150.0, 39.5],
  [157.0, 43.0],
  [166.0, 46.5],
  [176.0, 49.0],
  [-174.0, 50.5],
  [-165.0, 51.0],
  [-155.0, 49.5],
  [-145.0, 46.5],
  [-135.0, 42.0],
  [-126.0, 36.8],
  [-121.0, 34.1],
  [-118.5, 33.5],
  [-118.22, 33.72],
];

/** Sabine Pass out across the Gulf of Mexico and through the Florida Straits. */
const US_GULF_TO_FLORIDA_STRAITS: Path = [
  [-93.86, 29.73],
  [-93.8, 29.35],
  [-92.0, 28.4],
  [-89.0, 27.6],
  [-85.5, 26.5],
  [-83.0, 25.2],
  [-80.6, 24.6],
  [-79.5, 25.5],
];

/** Florida Straits north-east across the Atlantic to the western Channel. */
const FLORIDA_STRAITS_TO_USHANT: Path = [
  [-79.5, 25.5],
  [-76.5, 30.0],
  [-71.0, 35.0],
  [-62.0, 40.0],
  [-50.0, 44.0],
  [-38.0, 46.5],
  [-26.0, 48.0],
  [-15.0, 48.5],
  [-8.5, 48.4],
  [-5.9, 48.45],
];

/** Elbe navigation channel from the German Bight up to the Hamburg basins. */
const ELBE_CHANNEL: Path = [
  [8.05, 54.05],
  [8.4, 53.98],
  [8.72, 53.89],
  [9.14, 53.89],
  [9.42, 53.79],
  [9.53, 53.65],
  [9.72, 53.56],
  [9.93, 53.53],
];

// ── Lanes ───────────────────────────────────────────────────────────────────

export const TRADE_LANES: readonly TradeLane[] = [
  // ── Container ────────────────────────────────────────────────────────────
  {
    id: 'asia-europe-suez',
    label: 'Asia – North Europe (Suez)',
    commodity: 'container',
    status: 'primary',
    fromPort: 'CNSHA',
    toPort: 'NLRTM',
    chokepoints: ['taiwan-strait', 'malacca', 'bab-el-mandeb', 'suez', 'gibraltar', 'dover'],
    distanceNm: 10500,
    volume: 'The largest container trade lane by value in normal years',
    note: 'Yangshan to Maasvlakte via the Malacca Strait, the Red Sea and the Suez Canal — the routing the whole Asia–Europe schedule was built around.',
    waypoints: join(
      rev(SOUTH_CHINA_SEA_TO_SHANGHAI),
      rev(SINGAPORE_TO_SOUTH_CHINA_SEA),
      rev(MALACCA_TRANSIT),
      rev(ARABIAN_SEA_TO_MALACCA),
      rev(BAB_TO_ARABIAN_SEA),
      rev(RED_SEA),
      rev(SUEZ_TRANSIT),
      rev(GIBRALTAR_TO_PORT_SAID),
      rev(USHANT_TO_GIBRALTAR),
      rev(ROTTERDAM_TO_USHANT),
    ),
    sources: [UNCTAD_MARITIME, SUEZ_AUTHORITY],
  },
  {
    id: 'asia-europe-cape',
    label: 'Asia – North Europe (Cape diversion)',
    commodity: 'container',
    status: 'diversion',
    fromPort: 'SGSIN',
    toPort: 'NLRTM',
    chokepoints: ['malacca', 'good-hope', 'dover'],
    distanceNm: 11800,
    volume: 'Carried the bulk of diverted Asia–Europe boxes from 2024',
    note: 'The Red Sea re-route: south of Africa instead of through Suez, adding roughly ten days and a full extra vessel to each service loop.',
    waypoints: join(
      rev(MALACCA_TRANSIT),
      rev(GOOD_HOPE_TO_MALACCA),
      rev(CANARIES_TO_GOOD_HOPE),
      [
        [-13.0, 28.5],
        [-11.0, 33.0],
        [-9.9, 37.5],
        [-9.9, 40.5],
        [-9.9, 42.9],
        [-9.7, 44.5],
        [-8.3, 46.6],
        [-5.9, 48.45],
      ],
      rev(ROTTERDAM_TO_USHANT),
    ),
    sources: [UNCTAD_MARITIME, IMO_SHIPPING],
  },
  {
    id: 'transpacific-east',
    label: 'Trans-Pacific East (China – US West Coast)',
    commodity: 'container',
    status: 'primary',
    fromPort: 'CNSHA',
    toPort: 'USLAX',
    chokepoints: [],
    distanceNm: 5700,
    volume: "The United States' largest single import lane",
    note: 'Great-circle track past the Kuril arc and south of the Aleutians into San Pedro Bay — the shortest water between Chinese factories and US shelves.',
    waypoints: join(SHANGHAI_TO_LOS_ANGELES),
    sources: [UNCTAD_MARITIME],
  },
  {
    id: 'transpacific-panama',
    label: 'Asia – US East Coast (Panama)',
    commodity: 'container',
    status: 'primary',
    fromPort: 'CNSHA',
    toPort: 'USNYC',
    chokepoints: ['panama'],
    distanceNm: 11000,
    volume: 'The all-water alternative to US West Coast rail bridges',
    note: 'Neopanamax boxships leave the East China Sea through the Ryukyus, cross the Pacific to Balboa, lock through to Colón, then run up the eastern seaboard — sensitive to every Gatún Lake draught restriction.',
    waypoints: join(
      [
        [122.07, 30.62],
        [122.8, 30.2],
        [124.5, 29.0],
        [126.5, 27.5],
        [128.5, 25.5],
        [130.5, 23.5],
        [134.0, 21.0],
        [140.0, 18.5],
        [150.0, 15.5],
        [162.0, 13.5],
        [175.0, 12.0],
        [-172.0, 11.0],
        [-158.0, 11.0],
        [-144.0, 11.5],
        [-130.0, 13.0],
        [-120.0, 15.0],
        [-110.0, 17.5],
      ],
      rev(PANAMA_TO_PACIFIC),
      rev(PANAMA_TRANSIT_SOUTHBOUND),
      PANAMA_TO_US_EAST,
    ),
    sources: [UNCTAD_MARITIME, PANAMA_AUTHORITY],
  },
  {
    id: 'transatlantic',
    label: 'North Atlantic (Europe – US East Coast)',
    commodity: 'container',
    status: 'primary',
    fromPort: 'NLRTM',
    toPort: 'USNYC',
    chokepoints: ['dover'],
    distanceNm: 3300,
    volume: 'The densest high-value liner trade outside Asia',
    note: 'Rotterdam out through the Dover Strait and the Channel, then the northern great circle past the Grand Banks to the Ambrose approaches.',
    waypoints: join(ROTTERDAM_TO_USHANT, rev(US_EAST_TO_USHANT)),
    sources: [UNCTAD_MARITIME],
  },
  {
    id: 'korea-uswc',
    label: 'Korea / Japan – US West Coast',
    commodity: 'container',
    status: 'primary',
    fromPort: 'KRPUS',
    toPort: 'USLAX',
    chokepoints: [],
    distanceNm: 5100,
    volume: 'Korean and Japanese manufactured exports to North America',
    note: 'Busan through the Korea Strait, down the East China Sea and round the Osumi islands, then onto the same North Pacific great circle as the China lane.',
    waypoints: join(
      [
        [129.06, 35.04],
        [129.2, 34.5],
        [129.6, 33.4],
        [130.0, 32.3],
        [130.0, 31.4],
        [130.2, 30.4],
        [130.6, 29.7],
        [132.0, 29.8],
      ],
      SHANGHAI_TO_LOS_ANGELES.slice(5),
    ),
    sources: [UNCTAD_MARITIME],
  },
  {
    id: 'india-europe',
    label: 'India – North Europe (Suez)',
    commodity: 'container',
    status: 'primary',
    fromPort: 'INNSA',
    toPort: 'DEHAM',
    chokepoints: ['bab-el-mandeb', 'suez', 'gibraltar', 'dover'],
    distanceNm: 6400,
    volume: "India's principal container link to the EU single market",
    note: 'Nhava Sheva across the Arabian Sea, up the Red Sea and through Suez, then the Channel and the Elbe navigation channel to Hamburg.',
    waypoints: join(
      [
        [72.94, 18.95],
        [72.6, 18.85],
        [71.0, 18.2],
        [66.0, 16.5],
        [61.0, 15.2],
        [58.0, 14.6],
      ],
      rev(BAB_TO_ARABIAN_SEA),
      rev(RED_SEA),
      rev(SUEZ_TRANSIT),
      rev(GIBRALTAR_TO_PORT_SAID),
      rev(USHANT_TO_GIBRALTAR),
      rev(ROTTERDAM_TO_USHANT).slice(0, 9),
      [
        [2.7, 51.6],
        [3.2, 52.4],
        [4.6, 53.2],
        [6.6, 53.9],
        [8.05, 54.05],
      ],
      ELBE_CHANNEL,
    ),
    sources: [UNCTAD_MARITIME, SUEZ_AUTHORITY],
  },
  {
    id: 'europe-south-america',
    label: 'North Europe – South America East Coast',
    commodity: 'container',
    status: 'primary',
    fromPort: 'NLRTM',
    toPort: 'BRSSZ',
    chokepoints: ['dover'],
    distanceNm: 5400,
    volume: 'Reefer and manufactured goods between the EU and Mercosur',
    note: 'Rotterdam down past Finisterre and the Canaries, across the equator off Recife, and into Santos.',
    waypoints: join(
      ROTTERDAM_TO_USHANT,
      [
        [-5.9, 48.45],
        [-8.3, 46.6],
        [-9.7, 44.5],
        [-9.9, 42.9],
        [-9.9, 40.0],
        [-11.0, 35.0],
        [-13.0, 28.5],
        [-19.0, 20.0],
        [-22.0, 12.0],
        [-25.0, 4.0],
        [-30.0, -3.0],
        [-33.0, -8.0],
        [-35.5, -13.0],
        [-37.5, -17.0],
        [-39.5, -20.0],
        [-40.5, -22.5],
        [-43.0, -24.0],
        [-45.5, -24.5],
        [-46.0, -24.4],
        [-46.31, -23.99],
      ],
    ),
    sources: [UNCTAD_MARITIME],
  },

  // ── Energy ───────────────────────────────────────────────────────────────
  {
    id: 'gulf-east-asia-crude',
    label: 'Persian Gulf – East Asia crude',
    commodity: 'energy',
    status: 'primary',
    fromPort: 'SARTA',
    toPort: 'CNNGB',
    chokepoints: ['hormuz', 'malacca', 'taiwan-strait'],
    distanceNm: 6300,
    volume: 'The largest crude oil flow on earth',
    note: 'VLCCs from Ras Tanura through Hormuz and Malacca to the Chinese refinery belt — the reason both straits are counted as strategic.',
    waypoints: join(
      GULF_TO_HORMUZ,
      HORMUZ_TO_ARABIAN_SEA,
      ARABIAN_SEA_TO_MALACCA,
      MALACCA_TRANSIT,
      SINGAPORE_TO_SOUTH_CHINA_SEA,
      SOUTH_CHINA_SEA_TO_SHANGHAI.slice(0, -1),
      [[122.15, 29.93]],
    ),
    sources: [EIA_CHOKEPOINTS],
  },
  {
    id: 'gulf-europe-crude',
    label: 'Persian Gulf – Europe crude',
    commodity: 'energy',
    status: 'primary',
    fromPort: 'SARTA',
    toPort: 'NLRTM',
    chokepoints: ['hormuz', 'bab-el-mandeb', 'suez', 'gibraltar', 'dover'],
    distanceNm: 6500,
    volume: 'Gulf barrels into the Rotterdam refining and storage hub',
    note: 'Hormuz, the Gulf of Aden and the Red Sea to Suez — Suezmax cargoes for Europe, with the SUMED pipeline carrying the rest overland past the canal.',
    waypoints: join(
      GULF_TO_HORMUZ,
      HORMUZ_TO_ARABIAN_SEA,
      rev(BAB_TO_ARABIAN_SEA),
      rev(RED_SEA),
      rev(SUEZ_TRANSIT),
      rev(GIBRALTAR_TO_PORT_SAID),
      rev(USHANT_TO_GIBRALTAR),
      rev(ROTTERDAM_TO_USHANT),
    ),
    sources: [EIA_CHOKEPOINTS],
  },
  {
    id: 'qatar-japan-lng',
    label: 'Qatar – Japan LNG',
    commodity: 'energy',
    status: 'primary',
    fromPort: 'QARLF',
    toPort: 'JPCHB',
    chokepoints: ['hormuz', 'malacca', 'taiwan-strait'],
    distanceNm: 6600,
    volume: 'Long-term contracted LNG for the Japanese power grid',
    note: 'Ras Laffan through Hormuz and Malacca, then up the East China Sea to the Tokyo Bay receiving terminals.',
    waypoints: join(
      [
        [51.61, 25.94],
        [52.4, 26.0],
        [53.8, 25.9],
        [55.2, 26.0],
        [56.4, 26.57],
      ],
      HORMUZ_TO_ARABIAN_SEA,
      ARABIAN_SEA_TO_MALACCA,
      MALACCA_TRANSIT,
      SINGAPORE_TO_SOUTH_CHINA_SEA,
      SOUTH_CHINA_SEA_TO_SHANGHAI.slice(0, 6),
      [
        [121.3, 26.3],
        [123.5, 27.5],
        [126.0, 28.5],
        [129.0, 29.3],
        [131.5, 29.8],
        [134.5, 31.0],
        [138.0, 32.6],
        [139.8, 34.6],
        [139.75, 35.1],
        [139.9, 35.4],
        [140.05, 35.55],
      ],
    ),
    sources: [EIA_CHOKEPOINTS],
  },
  {
    id: 'us-gulf-europe-lng',
    label: 'US Gulf – Europe LNG',
    commodity: 'energy',
    status: 'primary',
    fromPort: 'USSAB',
    toPort: 'NLRTM',
    chokepoints: ['dover'],
    distanceNm: 4900,
    volume: 'The replacement for piped Russian gas into the EU',
    note: 'Sabine Pass across the Gulf of Mexico, through the Florida Straits and over the Atlantic to the Dutch and German import terminals.',
    waypoints: join(
      US_GULF_TO_FLORIDA_STRAITS,
      FLORIDA_STRAITS_TO_USHANT,
      rev(ROTTERDAM_TO_USHANT),
    ),
    sources: [EIA_CHOKEPOINTS, UNCTAD_MARITIME],
  },
  {
    id: 'us-gulf-asia-lng',
    label: 'US Gulf – East Asia LNG (Panama)',
    commodity: 'energy',
    status: 'primary',
    fromPort: 'USSAB',
    toPort: 'JPCHB',
    chokepoints: ['panama'],
    distanceNm: 9200,
    volume: 'US LNG into the Japanese and Korean contract market',
    note: 'The short way is through the Panama locks; when slot auctions or draught limits bite, the same cargoes sail Suez or the Cape instead.',
    waypoints: join(
      [
        [-93.86, 29.73],
        [-93.8, 29.35],
        [-92.0, 28.0],
        [-88.0, 25.0],
        [-85.0, 21.5],
        [-83.0, 18.0],
        [-81.5, 14.0],
        [-80.5, 11.0],
        [-79.9, 9.55],
      ],
      PANAMA_TRANSIT_SOUTHBOUND,
      PANAMA_TO_PACIFIC,
      [
        [-110.0, 17.5],
        [-125.0, 19.0],
        [-140.0, 20.0],
        [-155.0, 22.0],
        [-170.0, 24.0],
        [175.0, 27.0],
        [160.0, 30.0],
        [150.0, 32.5],
        [143.0, 34.0],
        [140.5, 34.6],
        [139.9, 35.2],
        [140.05, 35.55],
      ],
    ),
    sources: [EIA_CHOKEPOINTS, PANAMA_AUTHORITY],
  },
  {
    id: 'russia-india-crude',
    label: 'Russia – India crude',
    commodity: 'energy',
    status: 'primary',
    fromPort: 'RUNVS',
    toPort: 'INVAD',
    chokepoints: ['turkish-straits', 'suez', 'bab-el-mandeb'],
    distanceNm: 4600,
    volume: 'The post-2022 redirection of Urals crude away from Europe',
    note: 'Novorossiysk out through the Bosphorus and Dardanelles, across the Med to Suez, and down to the Jamnagar refinery moorings at Vadinar.',
    waypoints: join(
      [
        [37.79, 44.7],
        [37.4, 44.4],
        [35.5, 43.5],
        [33.0, 42.6],
        [31.0, 42.0],
        [29.6, 41.5],
        [29.05, 41.1],
        [28.9, 40.9],
        [27.6, 40.6],
        [26.5, 40.25],
        [26.2, 40.0],
        [25.6, 39.6],
        [25.0, 38.0],
        [26.0, 35.5],
        [27.5, 33.8],
        [29.5, 32.4],
        [32.3, 31.4],
      ],
      SUEZ_TRANSIT,
      RED_SEA,
      BAB_TO_ARABIAN_SEA,
      [
        [58.0, 14.6],
        [61.0, 16.0],
        [64.0, 18.5],
        [66.5, 20.8],
        [68.0, 22.0],
        [68.8, 22.6],
        [69.4, 22.5],
        [69.73, 22.35],
      ],
    ),
    sources: [EIA_CHOKEPOINTS, UNCTAD_MARITIME],
  },
  {
    id: 'russia-china-crude',
    label: 'Russia Pacific – China crude',
    commodity: 'energy',
    status: 'primary',
    fromPort: 'RUKOZ',
    toPort: 'CNNGB',
    chokepoints: [],
    distanceNm: 1450,
    volume: 'ESPO blend from the Pacific pipeline terminus',
    note: 'A short Sea of Japan run through the Korea Strait to the Chinese east-coast refineries — no chokepoint outside Russian and Chinese reach.',
    waypoints: [
      [132.4, 42.71],
      [132.2, 42.4],
      [131.5, 41.5],
      [130.6, 39.5],
      [130.0, 37.5],
      [129.7, 35.6],
      [129.9, 34.4],
      [128.5, 33.2],
      [126.0, 31.5],
      [124.0, 30.6],
      [122.6, 30.0],
      [122.15, 29.93],
    ],
    sources: [EIA_CHOKEPOINTS],
  },
  {
    id: 'nigeria-europe-crude',
    label: 'Nigeria – Europe crude',
    commodity: 'energy',
    status: 'primary',
    fromPort: 'NGBON',
    toPort: 'NLRTM',
    chokepoints: ['dover'],
    distanceNm: 4200,
    volume: 'Light sweet Atlantic crude for north-west European refineries',
    note: 'Bonny out of the Gulf of Guinea, up the West African offing past the Canaries, and into the Channel — an Atlantic route with no canal on it.',
    waypoints: join(
      [
        [7.17, 4.32],
        [7.1, 4.0],
        [6.0, 3.0],
        [3.0, 2.0],
        [-1.0, 2.0],
        [-6.0, 3.0],
        [-12.0, 4.5],
        [-17.5, 10.0],
        [-19.0, 16.0],
        [-17.5, 22.0],
        [-13.0, 28.5],
        [-11.0, 33.0],
        [-9.9, 37.5],
        [-9.9, 42.9],
      ],
      rev([
        [-5.9, 48.45],
        [-8.3, 46.6],
        [-9.7, 44.5],
        [-9.9, 42.9],
      ]),
      rev(ROTTERDAM_TO_USHANT),
    ),
    sources: [EIA_CHOKEPOINTS],
  },

  // ── Dry bulk ─────────────────────────────────────────────────────────────
  {
    id: 'australia-china-ore',
    label: 'Australia – China iron ore',
    commodity: 'bulk',
    status: 'primary',
    fromPort: 'AUPHE',
    toPort: 'CNTAO',
    chokepoints: ['lombok', 'taiwan-strait'],
    distanceNm: 3900,
    volume: "The largest dry bulk trade in the world",
    note: 'Capesize carriers out of the Pilbara through the Lombok and Makassar straits — deep enough for loaded Valemax and Newcastlemax hulls that Malacca is not.',
    waypoints: [
      [118.57, -20.31],
      [118.3, -20.1],
      [117.8, -18.0],
      [117.0, -15.0],
      [116.3, -11.5],
      [115.9, -9.6],
      [115.75, -8.7],
      [116.2, -7.5],
      [117.3, -5.5],
      [118.5, -3.5],
      [119.0, 0.0],
      [119.5, 1.5],
      [121.0, 2.5],
      [124.0, 2.5],
      [126.5, 3.0],
      [128.5, 5.5],
      [129.0, 9.0],
      [128.0, 13.0],
      [126.0, 18.0],
      [123.0, 21.0],
      [120.5, 21.3],
      [119.5, 22.5],
      [119.5, 24.4],
      [120.5, 26.0],
      [122.0, 28.5],
      [122.5, 31.5],
      [122.0, 33.5],
      [121.0, 35.2],
      [120.24, 36.03],
    ],
    sources: [UNCTAD_MARITIME],
  },
  {
    id: 'brazil-china-ore',
    label: 'Brazil – China iron ore',
    commodity: 'bulk',
    status: 'primary',
    fromPort: 'BRPDM',
    toPort: 'CNTAO',
    chokepoints: ['good-hope', 'malacca', 'taiwan-strait'],
    distanceNm: 11200,
    volume: 'Valemax ore carriers on the longest bulk haul in regular service',
    note: 'São Luís across the South Atlantic, round the Cape of Good Hope, over the southern Indian Ocean and up through Malacca to Shandong.',
    waypoints: join(
      [
        [-44.37, -2.57],
        [-44.0, -1.8],
        [-41.0, -2.0],
        [-38.0, -2.5],
        [-35.0, -4.0],
        [-33.5, -8.0],
        [-32.0, -14.0],
        [-28.0, -20.0],
        [-20.0, -26.0],
        [-10.0, -31.0],
        [0.0, -34.5],
        [10.0, -35.5],
        [19.6, -35.6],
      ],
      GOOD_HOPE_TO_MALACCA,
      MALACCA_TRANSIT,
      SINGAPORE_TO_SOUTH_CHINA_SEA,
      [
        [108.5, 7.5],
        [110.5, 11.0],
        [112.5, 15.0],
        [114.5, 18.5],
        [117.0, 21.5],
        [119.5, 24.4],
        [121.5, 26.5],
        [122.5, 29.0],
        [122.5, 31.5],
        [122.0, 33.5],
        [121.0, 35.2],
        [120.24, 36.03],
      ],
    ),
    sources: [UNCTAD_MARITIME],
  },
  {
    id: 'australia-japan-coal',
    label: 'Australia – Japan coal & LNG',
    commodity: 'bulk',
    status: 'primary',
    fromPort: 'AUGLT',
    toPort: 'JPCHB',
    chokepoints: [],
    distanceNm: 3900,
    volume: 'Queensland coking coal and LNG for Japanese steel and power',
    note: 'Gladstone out through the Capricorn Channel, up the Coral Sea and past the Philippine Sea to Tokyo Bay.',
    waypoints: [
      [151.25, -23.83],
      [151.8, -23.7],
      [153.0, -22.5],
      [154.5, -20.0],
      [155.5, -16.0],
      [156.0, -10.0],
      [154.0, -5.0],
      [152.0, -2.0],
      [149.0, 1.0],
      [145.0, 4.0],
      [141.0, 8.0],
      [138.0, 13.0],
      [136.0, 19.0],
      [136.5, 25.0],
      [138.0, 31.0],
      [139.8, 34.6],
      [139.75, 35.1],
      [139.9, 35.4],
      [140.05, 35.55],
    ],
    sources: [UNCTAD_MARITIME],
  },
  {
    id: 'us-gulf-china-grain',
    label: 'US Gulf – China grain (Panama)',
    commodity: 'bulk',
    status: 'primary',
    fromPort: 'USMSR',
    toPort: 'CNTAO',
    chokepoints: ['panama', 'taiwan-strait'],
    distanceNm: 9800,
    volume: 'US soybeans and corn out of the Mississippi elevators',
    note: 'Panamax bulkers load at the river terminals, run the Gulf to Colón, lock through Panama and cross the Pacific to northern China.',
    waypoints: join(
      [
        [-89.42, 28.93],
        [-89.2, 28.5],
        [-87.5, 26.5],
        [-86.5, 23.5],
        [-85.5, 21.5],
        [-83.5, 18.5],
        [-81.5, 14.5],
        [-80.2, 11.0],
        [-79.9, 9.55],
      ],
      PANAMA_TRANSIT_SOUTHBOUND,
      PANAMA_TO_PACIFIC,
      [
        [-110.0, 17.5],
        [-125.0, 19.5],
        [-140.0, 21.0],
        [-155.0, 23.0],
        [-170.0, 25.0],
        [175.0, 27.5],
        [160.0, 30.0],
        [145.0, 31.0],
        [135.0, 30.0],
        [129.0, 30.0],
        [126.0, 31.0],
        [124.0, 32.5],
        [122.0, 34.0],
        [121.0, 35.2],
        [120.24, 36.03],
      ],
    ),
    sources: [UNCTAD_MARITIME],
  },
  {
    id: 'northern-sea-route',
    label: 'Northern Sea Route (Murmansk – Shanghai)',
    commodity: 'bulk',
    status: 'seasonal',
    fromPort: 'RUMMK',
    toPort: 'CNSHA',
    chokepoints: ['bering'],
    distanceNm: 6500,
    volume: 'Roughly a third shorter than the Suez route, for part of the year',
    note: 'Out of the Kola Inlet, through the Kara Gate and the Vilkitsky Strait, north of the New Siberian Islands to the Bering Strait, then down the Pacific side of the Kurils and Japan — escorted, ice-class only, and open for a summer window that ice conditions set each year.',
    waypoints: [
      [33.06, 69.06],
      [33.2, 69.8],
      [36.0, 70.5],
      [42.0, 70.4],
      [48.0, 70.3],
      [55.0, 70.3],
      [58.4, 70.55],
      [62.0, 71.5],
      [66.0, 72.8],
      [70.0, 74.0],
      [76.0, 75.0],
      [82.0, 76.0],
      [90.0, 76.9],
      [98.0, 77.4],
      [104.5, 77.95],
      [110.0, 77.3],
      [122.0, 76.9],
      [133.0, 76.9],
      [143.0, 76.8],
      [152.0, 76.0],
      [160.0, 74.5],
      [168.0, 72.0],
      [175.0, 70.0],
      [-179.0, 69.5],
      [-174.0, 68.5],
      [-171.0, 67.3],
      [-169.0, 65.8],
      [-172.5, 64.2],
      [-176.0, 61.5],
      [-179.5, 58.0],
      [176.0, 54.0],
      [172.0, 52.5],
      [166.0, 49.0],
      [160.0, 46.0],
      [155.0, 43.0],
      [150.0, 40.0],
      [145.0, 36.5],
      [141.5, 34.3],
      [138.0, 32.6],
      [134.5, 31.0],
      [131.5, 29.8],
      [129.0, 29.6],
      [126.0, 30.2],
      [123.5, 30.6],
      [122.07, 30.62],
    ],
    sources: [NSR_ADMIN, UNCTAD_MARITIME],
  },
] as const;

/** Commodity families in legend order, with the label the globe shows. */
export const TRADE_COMMODITY_META: Record<
  TradeCommodity,
  { label: string; color: string }
> = {
  container: { label: 'Containerised goods', color: '#2fd4bf' },
  energy: { label: 'Crude oil & LNG', color: '#f59f4a' },
  bulk: { label: 'Dry bulk & grain', color: '#a7d94b' },
};
