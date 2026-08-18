/**
 * Street- and quay-level migration entry nodes, plus the media microevents pinned to them.
 *
 * The corridor layer stops at city resolution because that is the resolution its evidence
 * has: Frontex and IOM publish routes, not addresses. But the globe zooms to building level,
 * and at that zoom a line ending on "Dover" is useless. This file supplies the terminal
 * detail — the actual quay, beach, border station, reception centre or district a corridor
 * resolves into — so the map keeps saying something true as the camera comes down.
 *
 * ## What these coordinates are, and what they are not
 *
 * Every node is a **publicly documented, fixed installation or named district**: a ferry
 * terminal, a border station, an airport terminal, a government reception centre, a market
 * quarter. They are the places named in agency statistics, court records, parliamentary
 * evidence and mainstream reporting. Each carries a `precision` field that says how literally
 * to read its coordinate:
 *
 * - `facility` — a specific installation. The coordinate is the building, quay or gate.
 * - `sector`   — a documented stretch of coast, border or district. The coordinate is a
 *                representative point inside it, not a spot where anything happens.
 *
 * There are deliberately **no invented street addresses for live smuggling activity**. Nothing
 * here is a departure schedule, a meeting point, a gap in a patrol, or a guess at where an
 * individual crossing will occur. Producing that would be operational targeting information —
 * useful to smugglers and to people who hunt migrants, and unsupportable as a factual claim.
 * The city-level detail this file delivers is the documented infrastructure of migration, which
 * is what the public record actually contains.
 *
 * ## Microevents
 *
 * `MIGRATION_MICROEVENTS` pins reporting to those nodes — mostly broadcast video, since that is
 * what reads well in a hover card. Each carries the real outlet URL. `videoId` is set only where
 * an embeddable YouTube id is known; everything else opens its source page.
 */

import type {
  MigrationCoordinate,
  MigrationTargetIso,
  MigrationCorridorSource,
} from './migrationCorridors';

/** How literally to read a node's coordinate. */
export type EntryNodePrecision = 'facility' | 'sector';

export type EntryNodeKind =
  | 'port'
  | 'beach'
  | 'border'
  | 'airport'
  | 'rail'
  | 'reception'
  | 'detention'
  | 'district';

/** Three-letter tactical code + colour per node kind, denormalised into feature properties. */
export const ENTRY_NODE_KINDS: Record<
  EntryNodeKind,
  { code: string; title: string; color: string }
> = {
  port: { code: 'PRT', title: 'Port / terminal', color: '#4f9bd0' },
  beach: { code: 'BCH', title: 'Coastal launch sector', color: '#57c3d6' },
  border: { code: 'BDR', title: 'Land border station', color: '#e07b39' },
  airport: { code: 'AIR', title: 'Airport terminal', color: '#8fb4d9' },
  rail: { code: 'RAI', title: 'Rail / transit control', color: '#b9a4d8' },
  reception: { code: 'RCP', title: 'Reception / processing', color: '#7fc99a' },
  detention: { code: 'DET', title: 'Detention / removal', color: '#e0483b' },
  district: { code: 'DST', title: 'Settlement district', color: '#d8c24a' },
};

export interface MigrationEntryNode {
  id: string;
  /** Destination country the node belongs to — matches the latched corridor overlay. */
  targetIso: MigrationTargetIso;
  /** Corridor ids this node terminates or transits, for cross-highlighting. */
  corridorIds: readonly string[];
  /** Installation name as it appears in the record. */
  name: string;
  /** Street / quay / gate detail where the record names one. */
  address?: string;
  city: string;
  kind: EntryNodeKind;
  precision: EntryNodePrecision;
  coordinate: MigrationCoordinate;
  /** One or two sentences on what the record says happens here. */
  summary: string;
  sources: readonly MigrationCorridorSource[];
}

export interface MigrationMicroEvent {
  id: string;
  /** Node this report is pinned to. */
  nodeId: string;
  targetIso: MigrationTargetIso;
  /** Month + year of publication. */
  date: string;
  headline: string;
  outlet: string;
  url: string;
  format: 'video' | 'article';
  /** Set only where an embeddable YouTube id is known; otherwise the card opens `url`. */
  videoId?: string;
  summary: string;
}

// --- Sources ---------------------------------------------------------------

const src = (organization: string, title: string, url: string): MigrationCorridorSource => ({
  organization,
  title,
  url,
});

const UK_BORDER_FORCE = src(
  'UK Home Office / Border Force',
  'Small boat arrivals: reception and processing arrangements in Kent',
  'https://www.gov.uk/government/collections/migrants-detected-crossing-the-english-channel-in-small-boats',
);
const UK_ICIBI = src(
  'Independent Chief Inspector of Borders and Immigration',
  'Inspection of contingency asylum accommodation and small-boat intake sites',
  'https://www.gov.uk/government/organisations/independent-chief-inspector-of-borders-and-immigration',
);
const FRENCH_MARITIME_PREFECTURE = src(
  'Préfecture maritime de la Manche et de la mer du Nord',
  'Operations on the Nord / Pas-de-Calais coastline',
  'https://www.premar-manche.gouv.fr/',
);
const UK_PARLIAMENT_CHANNEL = src(
  'UK Parliament, House of Commons Library',
  'Asylum accommodation and Channel crossings briefings',
  'https://commonslibrary.parliament.uk/research-briefings/cbp-9075/',
);
const SWEDEN_MIGRATIONSVERKET = src(
  'Swedish Migration Agency (Migrationsverket)',
  'Reception units and application locations',
  'https://www.migrationsverket.se/en/about-us/statistics.html',
);
const SWEDEN_ID_CHECKS = src(
  'Government Offices of Sweden',
  'Identity checks on travel by bus, train and passenger ship to Sweden',
  'https://www.government.se/press-releases/2015/12/id-checks-for-travel-to-sweden/',
);
const NORWAY_UDI_NODES = src(
  'Norwegian Directorate of Immigration (UDI)',
  'National arrival centre and border registration procedure',
  'https://www.udi.no/en/word-definitions/national-arrival-centre/',
);
const NORWAY_ARCTIC_ROUTE = src(
  'Barents Observer / Norwegian Police',
  'Storskog Arctic route crossings from Murmansk oblast, 2015–2016',
  'https://thebarentsobserver.com/en/borders/2016/01/norway-closes-storskog-border-asylum-seekers',
);
const RUSSIA_MVD = src(
  'Ministry of Internal Affairs of the Russian Federation',
  'Migration situation statistics — arrivals by purpose and citizenship',
  'https://xn--b1aew.xn--p1ai/dejatelnost/statistics/migracionnaya',
);
const RUSSIA_STUDY_EXPORT = src(
  'Ministry of Science and Higher Education of Russia',
  'Export of Russian education — foreign students by country of origin',
  'https://minobrnauki.gov.ru/action/priority/eksport-obrazovaniya/',
);
const CHINA_AFRICAN_TRADERS = src(
  'Adams Bodomo, University of Vienna',
  'Africans in China — the Guangzhou trading communities',
  'https://www.cambridge.org/core/journals/china-quarterly',
);
const CHINA_NIA = src(
  'National Immigration Administration of China',
  'Border-inspection statistics — leading origin countries and entry ports',
  'https://www.nia.gov.cn/n741440/n741567/c1176229/content.html',
);
const KOREA_MOJ = src(
  'Ministry of Justice, Republic of Korea',
  'Immigration offices, ports of entry and refugee status determination',
  'https://www.immigration.go.kr/immigration/index.do',
);
const KOREA_ANSAN = src(
  'Ansan City / Ministry of Justice',
  'Ansan multicultural special zone — resident foreign population',
  'https://www.ansan.go.kr/',
);
const JAPAN_ISA = src(
  'Immigration Services Agency of Japan',
  'Regional immigration bureaus, ports of entry and detention facilities',
  'https://www.moj.go.jp/isa/',
);
const JAPAN_TIMES_NIGERIANS = src(
  'The Japan Times',
  'Sincerely, Little Nigeria — the Nigerian community in Shinjuku',
  'https://features.japantimes.co.jp/nigerians-in-japan/',
);

// --- Nodes -----------------------------------------------------------------

const node = (n: MigrationEntryNode) => n;

export const MIGRATION_ENTRY_NODES: readonly MigrationEntryNode[] = [
  // ── United Kingdom ──────────────────────────────────────────────────────
  node({
    id: 'gbr-dover-western-jet-foil',
    targetIso: 'GBR',
    corridorIds: [
      'afr-sudan-libya-channel-dover',
      'afr-eritrea-libya-channel-dover',
      'afr-nigeria-libya-channel-dover',
      'afr-algeria-spain-channel-dover',
    ],
    name: 'Dover Western Jet Foil',
    address: 'Western Docks, Dover, Kent CT17',
    city: 'Dover',
    kind: 'port',
    precision: 'facility',
    coordinate: [1.3226, 51.1256],
    summary:
      'Border Force disembarkation and first-registration site for people picked up in the Channel. Arrivals are landed here before onward transfer to Manston.',
    sources: [UK_BORDER_FORCE, UK_ICIBI],
  }),
  node({
    id: 'gbr-manston-processing',
    targetIso: 'GBR',
    corridorIds: ['afr-sudan-libya-channel-dover', 'afr-eritrea-libya-channel-dover'],
    name: 'Manston short-term holding facility',
    address: 'Former RAF Manston, Ramsgate, Kent CT12',
    city: 'Ramsgate',
    kind: 'reception',
    precision: 'facility',
    coordinate: [1.346, 51.342],
    summary:
      'Short-term holding site where small-boat arrivals are screened, security-checked and given an asylum-screening interview before dispersal.',
    sources: [UK_BORDER_FORCE, UK_ICIBI, UK_PARLIAMENT_CHANNEL],
  }),
  node({
    id: 'gbr-loon-plage',
    targetIso: 'GBR',
    corridorIds: ['afr-sudan-libya-channel-dover', 'afr-nigeria-libya-channel-dover'],
    name: 'Loon-Plage / Plage du Clipon coastal sector',
    address: 'Dunkirk western foreshore, Nord, France',
    city: 'Dunkirk',
    kind: 'beach',
    precision: 'sector',
    coordinate: [2.1854, 51.0283],
    summary:
      'Documented small-boat launch sector west of Dunkirk — flat sand with road access screened by dune and industrial land. Representative point for a several-kilometre stretch, not a launch site.',
    sources: [FRENCH_MARITIME_PREFECTURE, UK_PARLIAMENT_CHANNEL],
  }),
  node({
    id: 'gbr-gravelines',
    targetIso: 'GBR',
    corridorIds: ['afr-nigeria-libya-channel-dover'],
    name: 'Gravelines / Petit-Fort-Philippe coastal sector',
    address: 'Aa estuary foreshore, Nord, France',
    city: 'Gravelines',
    kind: 'beach',
    precision: 'sector',
    coordinate: [2.1229, 51.0104],
    summary:
      'Estuary and beach sector between Dunkirk and Calais repeatedly named in French maritime prefecture rescue reporting. Representative point only.',
    sources: [FRENCH_MARITIME_PREFECTURE],
  }),
  node({
    id: 'gbr-calais-port',
    targetIso: 'GBR',
    corridorIds: ['afr-eritrea-libya-channel-dover', 'afr-algeria-spain-channel-dover'],
    name: 'Port of Calais ferry terminal',
    address: 'Terminal Est, Boulevard des Alliés, 62100 Calais',
    city: 'Calais',
    kind: 'port',
    precision: 'facility',
    coordinate: [1.8677, 50.9684],
    summary:
      'Juxtaposed-controls ferry terminal. UK border checks are performed on French soil here, which is the reason the small-boat route exists alongside it.',
    sources: [UK_BORDER_FORCE, UK_PARLIAMENT_CHANNEL],
  }),
  node({
    id: 'gbr-coquelles-eurotunnel',
    targetIso: 'GBR',
    corridorIds: ['afr-eritrea-libya-channel-dover'],
    name: 'Coquelles Eurotunnel freight terminal',
    address: 'Terminal de Coquelles, 62231 Coquelles',
    city: 'Coquelles',
    kind: 'rail',
    precision: 'facility',
    coordinate: [1.8163, 50.9256],
    summary:
      'Channel Tunnel shuttle terminal with juxtaposed UK controls — the freight-vehicle clandestine-entry route that predates and continues alongside small boats.',
    sources: [UK_BORDER_FORCE, UK_PARLIAMENT_CHANNEL],
  }),
  node({
    id: 'gbr-napier-barracks',
    targetIso: 'GBR',
    corridorIds: ['afr-sudan-libya-channel-dover'],
    name: 'Napier Barracks asylum accommodation',
    address: 'Sir John Moore Barracks, Folkestone, Kent CT20',
    city: 'Folkestone',
    kind: 'reception',
    precision: 'facility',
    coordinate: [1.1462, 51.1077],
    summary:
      'Contingency asylum accommodation site inspected repeatedly by the ICIBI and litigated in the High Court over conditions.',
    sources: [UK_ICIBI, UK_PARLIAMENT_CHANNEL],
  }),
  node({
    id: 'gbr-heathrow-t3',
    targetIso: 'GBR',
    corridorIds: [
      'afr-nigeria-heathrow-study-work',
      'afr-ghana-heathrow-study-work',
      'afr-kenya-heathrow-care',
      'afr-zimbabwe-heathrow-care',
      'afr-somalia-uk-resettlement',
    ],
    name: 'Heathrow Terminal 3 arrivals',
    address: 'Terminal 3, Heathrow Airport, Hounslow TW6',
    city: 'London',
    kind: 'airport',
    precision: 'facility',
    coordinate: [-0.4589, 51.4713],
    summary:
      'Principal long-haul arrivals hall for African carriers into the UK, and the arrival point named in UNHCR resettlement case reporting.',
    sources: [UK_BORDER_FORCE],
  }),

  // ── Sweden ──────────────────────────────────────────────────────────────
  node({
    id: 'swe-malmo-hyllie',
    targetIso: 'SWE',
    corridorIds: [
      'afr-eritrea-italy-denmark-malmo',
      'afr-somalia-italy-malmo-irregular',
      'afr-morocco-spain-sweden-irregular',
    ],
    name: 'Malmö Hyllie station — Öresund identity-check point',
    address: 'Hyllie stationstorg, 215 32 Malmö',
    city: 'Malmö',
    kind: 'rail',
    precision: 'facility',
    coordinate: [12.9761, 55.5652],
    summary:
      'First Swedish station across the Öresund bridge. Sweden imposed carrier identity checks here in January 2016, the single measure that most visibly closed the Denmark–Sweden leg.',
    sources: [SWEDEN_ID_CHECKS, SWEDEN_MIGRATIONSVERKET],
  }),
  node({
    id: 'swe-oresund-lernacken',
    targetIso: 'SWE',
    corridorIds: ['afr-eritrea-italy-denmark-malmo'],
    name: 'Öresund Bridge — Lernacken toll and control plaza',
    address: 'Lernacken, Malmö',
    city: 'Malmö',
    kind: 'border',
    precision: 'facility',
    coordinate: [12.8918, 55.5716],
    summary:
      'Road-side landfall of the Öresund fixed link and the location of reintroduced Schengen internal border controls.',
    sources: [SWEDEN_ID_CHECKS],
  }),
  node({
    id: 'swe-trelleborg-port',
    targetIso: 'SWE',
    corridorIds: ['afr-gambia-italy-trelleborg'],
    name: 'Trelleborg ferry port',
    address: 'Hamngatan, 231 42 Trelleborg',
    city: 'Trelleborg',
    kind: 'port',
    precision: 'facility',
    coordinate: [13.1568, 55.3684],
    summary:
      'Sweden\'s main German and Polish ferry link. Named in Migrationsverket reporting as an arrival point for unaccompanied minors during the 2015 peak.',
    sources: [SWEDEN_MIGRATIONSVERKET],
  }),
  node({
    id: 'swe-arlanda-t5',
    targetIso: 'SWE',
    corridorIds: [
      'afr-somalia-sweden-family',
      'afr-ethiopia-arlanda-study-work',
      'afr-egypt-arlanda-work',
    ],
    name: 'Stockholm Arlanda Terminal 5 arrivals',
    address: 'Terminal 5, Arlanda Airport, 190 45 Stockholm-Arlanda',
    city: 'Stockholm',
    kind: 'airport',
    precision: 'facility',
    coordinate: [17.9186, 59.6519],
    summary:
      'Sweden\'s international arrivals terminal and the point of entry for family-reunification and quota-refugee arrivals.',
    sources: [SWEDEN_MIGRATIONSVERKET],
  }),
  node({
    id: 'swe-rinkeby-tensta',
    targetIso: 'SWE',
    corridorIds: ['afr-somalia-sweden-family', 'afr-eritrea-italy-denmark-malmo'],
    name: 'Rinkeby–Tensta district',
    address: 'Järvafältet, Stockholm',
    city: 'Stockholm',
    kind: 'district',
    precision: 'sector',
    coordinate: [17.9276, 59.3886],
    summary:
      'Stockholm district with one of the highest foreign-born shares in Sweden and a large Somali and Eritrean population. District centroid, not a specific address.',
    sources: [SWEDEN_MIGRATIONSVERKET],
  }),

  // ── Norway ──────────────────────────────────────────────────────────────
  node({
    id: 'nor-storskog',
    targetIso: 'NOR',
    corridorIds: ['afr-horn-arctic-storskog'],
    name: 'Storskog border station',
    address: 'E105, 9915 Kirkenes, Sør-Varanger',
    city: 'Kirkenes',
    kind: 'border',
    precision: 'facility',
    coordinate: [30.1697, 69.6558],
    summary:
      'The only road crossing on the 196 km Norway–Russia border. Russia bars pedestrian crossing and Norway penalises carriers, which is why the 2015 Arctic route arrived by bicycle.',
    sources: [NORWAY_ARCTIC_ROUTE, NORWAY_UDI_NODES],
  }),
  node({
    id: 'nor-nikel-staging',
    targetIso: 'NOR',
    corridorIds: ['afr-horn-arctic-storskog'],
    name: 'Nikel — Russian-side staging town',
    address: 'Pechengsky District, Murmansk Oblast',
    city: 'Nikel',
    kind: 'district',
    precision: 'sector',
    coordinate: [30.2231, 69.4128],
    summary:
      'Last Russian town before the Storskog crossing and the documented point at which travellers acquired the bicycles required to cross. Town centroid.',
    sources: [NORWAY_ARCTIC_ROUTE],
  }),
  node({
    id: 'nor-raade-arrival-centre',
    targetIso: 'NOR',
    corridorIds: ['afr-horn-arctic-storskog', 'afr-eritrea-italy-norway-onward'],
    name: 'Nasjonalt ankomstsenter Råde (national arrival centre)',
    address: 'Mosseveien, 1640 Råde, Østfold',
    city: 'Råde',
    kind: 'reception',
    precision: 'facility',
    coordinate: [10.8479, 59.351],
    summary:
      'Norway\'s single national arrival centre. Every asylum applicant is registered, health-screened and interviewed here regardless of which border they entered by.',
    sources: [NORWAY_UDI_NODES],
  }),
  node({
    id: 'nor-gardermoen-arrivals',
    targetIso: 'NOR',
    corridorIds: [
      'afr-somalia-norway-family',
      'afr-eritrea-oslo-resettlement',
      'afr-ethiopia-oslo-study',
    ],
    name: 'Oslo Gardermoen international arrivals',
    address: 'Edvard Munchs veg, 2061 Gardermoen',
    city: 'Oslo',
    kind: 'airport',
    precision: 'facility',
    coordinate: [11.1004, 60.1939],
    summary:
      'Point of entry for quota refugees and family-reunification arrivals, who transfer directly to the Råde arrival centre.',
    sources: [NORWAY_UDI_NODES],
  }),
  node({
    id: 'nor-toyen-gronland',
    targetIso: 'NOR',
    corridorIds: ['afr-somalia-norway-family'],
    name: 'Grønland–Tøyen district',
    address: 'Gamle Oslo, Oslo',
    city: 'Oslo',
    kind: 'district',
    precision: 'sector',
    coordinate: [10.7628, 59.9127],
    summary:
      'Inner-east Oslo district with the city\'s largest Somali and East African settlement. District centroid.',
    sources: [NORWAY_UDI_NODES],
  }),

  // ── Russia ──────────────────────────────────────────────────────────────
  node({
    id: 'rus-sheremetyevo-f',
    targetIso: 'RUS',
    corridorIds: [
      'afr-egypt-moscow-study',
      'afr-nigeria-moscow-study',
      'afr-cameroon-moscow-belarus-transit',
      'afr-horn-moscow-murmansk-transit',
    ],
    name: 'Sheremetyevo Terminal F — international transit zone',
    address: 'Terminal F, Sheremetyevo International Airport, Khimki',
    city: 'Moscow',
    kind: 'airport',
    precision: 'facility',
    coordinate: [37.4146, 55.9736],
    summary:
      'Moscow\'s legacy international terminal and the transit zone where travellers without Russian entry clearance are held. The entry point for most African arrivals into Russia.',
    sources: [RUSSIA_MVD],
  }),
  node({
    id: 'rus-rudn-campus',
    targetIso: 'RUS',
    corridorIds: [
      'afr-egypt-moscow-study',
      'afr-nigeria-moscow-study',
      'afr-ghana-moscow-study',
      'afr-ethiopia-moscow-study',
    ],
    name: 'RUDN University (Patrice Lumumba) campus',
    address: 'Ulitsa Miklukho-Maklaya 6, Moscow 117198',
    city: 'Moscow',
    kind: 'district',
    precision: 'facility',
    coordinate: [37.524, 55.6503],
    summary:
      'Founded in 1960 to educate students from newly independent African states, and still the single largest destination institution in the Africa–Russia study corridor.',
    sources: [RUSSIA_STUDY_EXPORT, RUSSIA_MVD],
  }),
  node({
    id: 'rus-sadovod-market',
    targetIso: 'RUS',
    corridorIds: ['afr-cameroon-moscow-belarus-transit'],
    name: 'Sadovod market',
    address: '14 km MKAD, Vernadskogo district approach, Moscow',
    city: 'Moscow',
    kind: 'district',
    precision: 'sector',
    coordinate: [37.7997, 55.6065],
    summary:
      'Large wholesale market complex on the Moscow ring road, repeatedly the subject of MVD migration-enforcement raids. Complex centroid.',
    sources: [RUSSIA_MVD],
  }),
  node({
    id: 'rus-murmansk-station',
    targetIso: 'RUS',
    corridorIds: ['afr-horn-moscow-murmansk-transit'],
    name: 'Murmansk railway station',
    address: 'Ploshchad Privokzalnaya 1, Murmansk 183038',
    city: 'Murmansk',
    kind: 'rail',
    precision: 'facility',
    coordinate: [33.0856, 68.9707],
    summary:
      'Northern railhead of the Arctic route. The 2015 movement toward Storskog arrived here by rail from St Petersburg before continuing by road to Nikel.',
    sources: [NORWAY_ARCTIC_ROUTE, RUSSIA_MVD],
  }),

  // ── China ───────────────────────────────────────────────────────────────
  node({
    id: 'chn-guangzhou-xiaobei',
    targetIso: 'CHN',
    corridorIds: [
      'afr-nigeria-guangzhou-trade',
      'afr-westafrica-guangzhou-overstay',
      'afr-mali-guangzhou-trade',
    ],
    name: 'Tianxiu Building, Xiaobei Lu — "Little Africa"',
    address: 'Xiaobei Road, Dengfeng, Yuexiu District, Guangzhou',
    city: 'Guangzhou',
    kind: 'district',
    precision: 'facility',
    coordinate: [113.2634, 23.1461],
    summary:
      'The wholesale tower at the centre of Guangzhou\'s African trading quarter — the most documented African commercial community in Asia, and the focus of the periodic visa-overstay crackdowns.',
    sources: [CHINA_AFRICAN_TRADERS, CHINA_NIA],
  }),
  node({
    id: 'chn-guangzhou-sanyuanli',
    targetIso: 'CHN',
    corridorIds: ['afr-ghana-guangzhou-trade', 'afr-westafrica-guangzhou-overstay'],
    name: 'Canaan Export Clothes Wholesale Trading Center, Sanyuanli',
    address: 'Guangyuan Xi Lu, Baiyun District, Guangzhou',
    city: 'Guangzhou',
    kind: 'district',
    precision: 'facility',
    coordinate: [113.2634, 23.1706],
    summary:
      'Wholesale garment complex serving West African buyers, and the second pole of the Guangzhou trading community alongside Xiaobei.',
    sources: [CHINA_AFRICAN_TRADERS],
  }),
  node({
    id: 'chn-baiyun-t2',
    targetIso: 'CHN',
    corridorIds: [
      'afr-nigeria-guangzhou-trade',
      'afr-ghana-guangzhou-trade',
      'afr-kenya-guangzhou-trade',
      'afr-congo-guangzhou-trade',
    ],
    name: 'Guangzhou Baiyun Airport Terminal 2 arrivals',
    address: 'Terminal 2, Baiyun International Airport, Guangzhou',
    city: 'Guangzhou',
    kind: 'airport',
    precision: 'facility',
    coordinate: [113.3072, 23.3959],
    summary:
      'Arrivals hall for the Addis Ababa, Nairobi and Gulf services that carry most of the Africa–China trade corridor.',
    sources: [CHINA_NIA],
  }),
  node({
    id: 'chn-yiwu-futian',
    targetIso: 'CHN',
    corridorIds: ['afr-egypt-yiwu-trade', 'ind-mumbai-yiwu-trade'],
    name: 'Yiwu International Trade City (Futian Market)',
    address: 'Chouzhou North Road, Futian, Yiwu, Zhejiang',
    city: 'Yiwu',
    kind: 'district',
    precision: 'facility',
    coordinate: [120.0721, 29.3068],
    summary:
      'The world\'s largest small-commodities wholesale market and the terminus of the North African and South Asian trader corridors into China.',
    sources: [CHINA_AFRICAN_TRADERS, CHINA_NIA],
  }),
  node({
    id: 'chn-shenzhen-huaqiangbei',
    targetIso: 'CHN',
    corridorIds: ['ind-chennai-shenzhen-electronics', 'afr-westafrica-guangzhou-overstay'],
    name: 'Huaqiangbei electronics market',
    address: 'Huaqiang North Road, Futian District, Shenzhen',
    city: 'Shenzhen',
    kind: 'district',
    precision: 'facility',
    coordinate: [114.0857, 22.5446],
    summary:
      'Electronics wholesale district drawing Indian and African buyer traffic across the Hong Kong land boundary.',
    sources: [CHINA_NIA],
  }),

  // ── South Korea ─────────────────────────────────────────────────────────
  node({
    id: 'kor-incheon-t1-arrivals',
    targetIso: 'KOR',
    corridorIds: [
      'afr-egypt-incheon-asylum',
      'afr-nigeria-incheon-resident',
      'afr-ghana-incheon-worker',
      'afr-jeju-visa-free-asylum',
    ],
    name: 'Incheon Airport Terminal 1 — arrivals and refugee application desk',
    address: 'Terminal 1, 272 Gonghang-ro, Jung-gu, Incheon',
    city: 'Incheon',
    kind: 'airport',
    precision: 'facility',
    coordinate: [126.4407, 37.4491],
    summary:
      'Korea\'s principal port of entry and the site of the port-of-entry refugee application procedure, including the transit-zone waiting area litigated before the Supreme Court.',
    sources: [KOREA_MOJ],
  }),
  node({
    id: 'kor-jeju-airport',
    targetIso: 'KOR',
    corridorIds: ['afr-jeju-visa-free-asylum'],
    name: 'Jeju International Airport — visa-free entry point',
    address: '2 Gonghang-ro, Jeju-si, Jeju',
    city: 'Jeju',
    kind: 'airport',
    precision: 'facility',
    coordinate: [126.493, 33.5113],
    summary:
      'Jeju\'s visa-waiver regime is the documented entry channel for the 2018 asylum caseload that prompted Korea to restrict the scheme and bar onward travel to the mainland.',
    sources: [KOREA_MOJ],
  }),
  node({
    id: 'kor-incheon-passenger-terminal',
    targetIso: 'KOR',
    corridorIds: ['ind-incheon-busan-seafarer'],
    name: 'Incheon Port International Passenger Terminal',
    address: '188 Hangdong 7-ga, Jung-gu, Incheon',
    city: 'Incheon',
    kind: 'port',
    precision: 'facility',
    coordinate: [126.6146, 37.4536],
    summary:
      'Ferry terminal for the Shandong and Liaoning services — the sea leg of the China–Korea corridor and the interdiction focus of the Korea Coast Guard.',
    sources: [KOREA_MOJ],
  }),
  node({
    id: 'kor-ansan-wongok',
    targetIso: 'KOR',
    corridorIds: ['afr-nigeria-incheon-resident', 'afr-ghana-incheon-worker'],
    name: 'Wongok-dong multicultural special zone',
    address: 'Wongok-dong, Danwon-gu, Ansan, Gyeonggi',
    city: 'Ansan',
    kind: 'district',
    precision: 'sector',
    coordinate: [126.7981, 37.3197],
    summary:
      'Korea\'s designated multicultural district and the largest concentration of migrant workers in the country. District centroid.',
    sources: [KOREA_ANSAN, KOREA_MOJ],
  }),
  node({
    id: 'kor-hwaseong-detention',
    targetIso: 'KOR',
    corridorIds: ['afr-jeju-visa-free-asylum', 'afr-egypt-incheon-asylum'],
    name: 'Hwaseong Immigration Detention Centre',
    address: 'Maesong-myeon, Hwaseong, Gyeonggi',
    city: 'Hwaseong',
    kind: 'detention',
    precision: 'facility',
    coordinate: [126.8299, 37.1898],
    summary:
      'Korea\'s principal immigration detention facility, holding people pending removal or refugee-status appeal.',
    sources: [KOREA_MOJ],
  }),

  // ── Japan ───────────────────────────────────────────────────────────────
  node({
    id: 'jpn-kabukicho',
    targetIso: 'JPN',
    corridorIds: ['afr-nigeria-tokyo-resident', 'afr-tokyo-overstay-pattern'],
    name: 'Kabukichō — "Little Nigeria"',
    address: 'Kabukichō 1-chōme, Shinjuku, Tokyo',
    city: 'Tokyo',
    kind: 'district',
    precision: 'sector',
    coordinate: [139.703, 35.695],
    summary:
      'The Shinjuku nightlife quarter where Japan\'s Nigerian community concentrated from the late 1980s, documented at length by The Japan Times. District centroid.',
    sources: [JAPAN_TIMES_NIGERIANS, JAPAN_ISA],
  }),
  node({
    id: 'jpn-narita-t1',
    targetIso: 'JPN',
    corridorIds: [
      'afr-nigeria-tokyo-resident',
      'afr-ghana-tokyo-resident',
      'afr-egypt-tokyo-study',
      'afr-tokyo-overstay-pattern',
    ],
    name: 'Narita Terminal 1 arrivals',
    address: 'Terminal 1, Narita International Airport, Chiba',
    city: 'Narita',
    kind: 'airport',
    precision: 'facility',
    coordinate: [140.3853, 35.7653],
    summary:
      'Principal long-haul port of entry into Japan and the landing point for the Gulf-routed African corridors.',
    sources: [JAPAN_ISA],
  }),
  node({
    id: 'jpn-tokyo-immigration-konan',
    targetIso: 'JPN',
    corridorIds: ['afr-tokyo-overstay-pattern', 'afr-nigeria-tokyo-resident'],
    name: 'Tokyo Regional Immigration Services Bureau',
    address: '5-5-30 Konan, Minato-ku, Tokyo 108-8255',
    city: 'Tokyo',
    kind: 'reception',
    precision: 'facility',
    coordinate: [139.75, 35.618],
    summary:
      'Where status-of-residence applications, renewals and provisional-release reporting are handled for the Tokyo region.',
    sources: [JAPAN_ISA],
  }),
  node({
    id: 'jpn-ushiku-detention',
    targetIso: 'JPN',
    corridorIds: ['afr-tokyo-overstay-pattern'],
    name: 'Higashi-Nihon Immigration Centre, Ushiku',
    address: '1766-1 Onozaki-machi, Ushiku, Ibaraki',
    city: 'Ushiku',
    kind: 'detention',
    precision: 'facility',
    coordinate: [140.1667, 35.9667],
    summary:
      'Japan\'s largest long-term immigration detention facility, holding people whose deportation orders are unexecuted.',
    sources: [JAPAN_ISA],
  }),
  node({
    id: 'jpn-hakata-port-terminal',
    targetIso: 'JPN',
    corridorIds: ['ind-tokyo-hakata-worker'],
    name: 'Hakata Port International Terminal',
    address: '14-1 Okihamamachi, Hakata-ku, Fukuoka',
    city: 'Fukuoka',
    kind: 'port',
    precision: 'facility',
    coordinate: [130.3979, 33.6068],
    summary:
      'Japan\'s busiest international passenger port, carrying the Busan services and the Kyushu labour-intake corridor.',
    sources: [JAPAN_ISA],
  }),
];

// --- Microevents -----------------------------------------------------------

export const MIGRATION_MICROEVENTS: readonly MigrationMicroEvent[] = [
  {
    id: 'mev-channel-bbc-reporter',
    nodeId: 'gbr-loon-plage',
    targetIso: 'GBR',
    date: 'Aug 2020',
    headline: 'BBC reporter speaks to migrants crossing the Channel',
    outlet: 'BBC News',
    url: 'https://feeds.bbci.co.uk/news/uk-53722861',
    format: 'video',
    summary:
      'Filmed mid-Channel with a dinghy that had launched from the Nord coastline, showing the crossing as it happens rather than at the point of landing.',
  },
  {
    id: 'mev-channel-two-boats-86',
    nodeId: 'gbr-dover-western-jet-foil',
    targetIso: 'GBR',
    date: 'Sep 2019',
    headline: 'Channel migrants: two boats found after 86 attempted crossing',
    outlet: 'BBC News',
    url: 'https://feeds.bbci.co.uk/news/uk-england-kent-49662172',
    format: 'article',
    summary:
      'Border Force landing at Dover after interception, illustrating the Western Jet Foil disembarkation and registration sequence.',
  },
  {
    id: 'mev-channel-border-force-28',
    nodeId: 'gbr-dover-western-jet-foil',
    targetIso: 'GBR',
    date: 'Aug 2019',
    headline: 'Border Force find boats carrying 28 people',
    outlet: 'BBC News',
    url: 'https://feeds.bbci.co.uk/news/uk-england-kent-49476524',
    format: 'article',
    summary: 'Interception and landing at Dover following a night crossing from the Nord coast.',
  },
  {
    id: 'mev-arctic-bbc-cycling',
    nodeId: 'nor-storskog',
    targetIso: 'NOR',
    date: 'Oct 2015',
    headline: 'Migrant crisis: the people cycling into Norway',
    outlet: 'BBC News',
    url: 'https://feeds.bbci.co.uk/news/av/world-europe-34612325',
    format: 'video',
    summary:
      'Filmed at Storskog as arrivals cross the Russian border by bicycle — the legal loophole that defined the Arctic route.',
  },
  {
    id: 'mev-arctic-euronews',
    nodeId: 'nor-nikel-staging',
    targetIso: 'NOR',
    date: 'Oct 2015',
    headline: 'Taking the Arctic route: migrants cycle from Russia to Norway',
    outlet: 'Euronews',
    url: 'https://www.euronews.com/2015/10/07/taking-the-arctic-route-migrants-cycle-from-russia-to-norway',
    format: 'video',
    summary:
      'Reporting from the Russian side of the crossing on how the bicycle requirement was met and priced.',
  },
  {
    id: 'mev-arctic-cnn-bikes',
    nodeId: 'nor-storskog',
    targetIso: 'NOR',
    date: 'Oct 2015',
    headline: 'From Russia to Norway: refugees ride bikes to freedom',
    outlet: 'CNN',
    url: 'https://www.cnn.com/2015/10/28/europe/norway-russia-middle-east-refugees-bicycles/index.html',
    format: 'article',
    summary:
      'Documents the scale of the 2015 Storskog movement and the Murmansk-side logistics that fed it.',
  },
  {
    id: 'mev-arctic-bbc-fence',
    nodeId: 'nor-storskog',
    targetIso: 'NOR',
    date: 'Oct 2016',
    headline: 'Norwegians laugh at new fence on Russian border',
    outlet: 'BBC News',
    url: 'https://feeds.bbci.co.uk/news/world-europe-37577547',
    format: 'article',
    summary:
      'The physical barrier Norway built at Storskog after the 2015 crossings, and the local reaction to it.',
  },
  {
    id: 'mev-arctic-murmansk-rail',
    nodeId: 'rus-murmansk-station',
    targetIso: 'RUS',
    date: 'Jan 2016',
    headline: 'Norway closes Storskog border to asylum seekers arriving from Russia',
    outlet: 'The Barents Observer',
    url: 'https://thebarentsobserver.com/en/borders/2016/01/norway-closes-storskog-border-asylum-seekers',
    format: 'article',
    summary:
      'Local reporting on the Russian side of the route, including the Murmansk rail leg and the closure that ended it.',
  },
  {
    id: 'mev-guangzhou-cctv-little-africa',
    nodeId: 'chn-guangzhou-xiaobei',
    targetIso: 'CHN',
    date: 'Feb 2017',
    headline: "Guangzhou's 'Little Africa' ep. 1: visas a major problem for African migrants",
    outlet: 'CCTV News',
    url: 'https://english.cctv.com/2017/02/13/VIDEPeyDtMSARikIJfFBoanu170213.shtml',
    format: 'video',
    summary:
      'Chinese state broadcaster\'s five-part series filmed in Xiaobei and Dengfeng, focused on the visa regime that governs the trading community.',
  },
  {
    id: 'mev-guangzhou-inside-little-africa',
    nodeId: 'chn-guangzhou-sanyuanli',
    targetIso: 'CHN',
    date: '2023',
    headline: "Inside China's Little Africa — Muslim and African life in Guangzhou",
    outlet: 'YouTube documentary',
    url: 'https://www.youtube.com/watch?v=gkneHR4W9c8',
    format: 'video',
    videoId: 'gkneHR4W9c8',
    summary:
      'Walk-through of the Xiaobei and Sanyuanli quarters, showing the wholesale-market economy the corridor exists to serve.',
  },
  {
    id: 'mev-guangzhou-dream-factory',
    nodeId: 'chn-guangzhou-xiaobei',
    targetIso: 'CHN',
    date: 'Apr 2017',
    headline: 'A new documentary shows how wrong China is about its African immigrants',
    outlet: 'Quartz Africa',
    url: 'https://qz.com/africa/945800/documentary-guangzhou-dream-factory-shows-the-lives-and-aspirations-of-african-migrants-in-china',
    format: 'article',
    summary:
      'On the documentary *Guangzhou Dream Factory* and the gap between the official account of the community and its own.',
  },
  {
    id: 'mev-guangzhou-fading',
    nodeId: 'chn-guangzhou-xiaobei',
    targetIso: 'CHN',
    date: 'Mar 2019',
    headline: "'Little Africa' in China",
    outlet: 'New Internationalist',
    url: 'https://newint.org/features/2019/03/11/%E2%80%98little-africa%E2%80%99-china',
    format: 'article',
    summary:
      'On the contraction of the Guangzhou community as visa rules tightened and overstay enforcement intensified.',
  },
  {
    id: 'mev-japan-little-nigeria',
    nodeId: 'jpn-kabukicho',
    targetIso: 'JPN',
    date: '2020',
    headline: 'Sincerely, Little Nigeria',
    outlet: 'The Japan Times',
    url: 'https://features.japantimes.co.jp/nigerians-in-japan/',
    format: 'article',
    summary:
      'Long-form feature on the Nigerian community in Kabukichō — how it formed, how it works, and its relationship with the immigration regime.',
  },
  {
    id: 'mev-japan-africa-hometown',
    nodeId: 'jpn-narita-t1',
    targetIso: 'JPN',
    date: 'Sep 2025',
    headline: 'Japan cuts Africa exchange programme amid fake immigration claims',
    outlet: 'Al Jazeera',
    url: 'https://www.aljazeera.com/economy/2025/9/25/japan-cuts-africa-exchange-programme-amid-fake-immigration-claims',
    format: 'article',
    summary:
      'The Africa Hometown initiative was withdrawn after a misinformation wave recast a cultural-exchange scheme as a migration route.',
  },
];

/** Nodes indexed by id, for resolving a microevent to its coordinate. */
export const ENTRY_NODE_BY_ID: ReadonlyMap<string, MigrationEntryNode> = new Map(
  MIGRATION_ENTRY_NODES.map((n) => [n.id, n]),
);
