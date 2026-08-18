/**
 * Representative migration corridors into China, Taiwan, South Korea, and Japan.
 * Regular routes combine national migrant-stock evidence with active border ports
 * and passenger links. Irregular routes are documented patterns or interdiction
 * cases, not flow-volume estimates or claims that every traveller uses one exact
 * itinerary. China origin detail uses the latest official nationality table the
 * NBS publishes (2010), cross-checked against UN DESA's 2024 stock framework.
 */

import type {
  MigrationCoordinate,
  MigrationCorridor,
  MigrationCorridorLeg,
  MigrationCorridorSource,
  MigrationTransitLabel,
  MigrationTargetIso,
} from './migrationCorridors';

const UN_MIGRANT_STOCK_2024: MigrationCorridorSource = {
  organization: 'UN DESA Population Division',
  title: 'International Migrant Stock 2024 — destination and origin dataset',
  url: 'https://www.un.org/development/desa/pd/content/international-migrant-stock',
};

const CHINA_NBS_FOREIGN_RESIDENTS: MigrationCorridorSource = {
  organization: 'National Bureau of Statistics of China',
  title: '2010 census — foreign residents by nationality and geographic distribution',
  url: 'https://www.stats.gov.cn/english/NewsEvents/201104/t20110429_26451.html',
};

const CHINA_NIA_ENTRY_PORTS: MigrationCorridorSource = {
  organization: 'National Immigration Administration of China',
  title: 'Border-inspection statistics — leading origin countries and entry ports',
  url: 'https://www.nia.gov.cn/n741440/n741567/c1176229/content.html',
};

const JAPAN_FOREIGN_RESIDENTS: MigrationCorridorSource = {
  organization: 'Immigration Services Agency of Japan',
  title: 'Foreign residents by nationality / region, end of 2025',
  url: 'https://www.moj.go.jp/isa/publications/press/13_00062.html',
};

const JAPAN_SKILLED_WORKERS: MigrationCorridorSource = {
  organization: 'Immigration Services Agency of Japan',
  title: 'Initiatives to accept foreign nationals — specified skilled workers by nationality',
  url: 'https://www.moj.go.jp/isa/content/930004452.pdf',
};

const KOREA_FOREIGN_RESIDENTS: MigrationCorridorSource = {
  organization: 'Ministry of Justice, Republic of Korea',
  title: 'Foreign residents by nationality, 2021–2025',
  url: 'https://www.moj.go.kr/moj/2412/subview.do',
};

const TAIWAN_FOREIGN_RESIDENTS: MigrationCorridorSource = {
  organization: 'National Immigration Agency, Taiwan',
  title: 'Foreign residents by nationality, May 2025',
  url: 'https://www.immigration.gov.tw/5475/5478/141478/141380/393679/cp_news',
};

const TAIWAN_FOREIGN_WORKERS: MigrationCorridorSource = {
  organization: 'Ministry of Labor, Taiwan',
  title: 'Foreign workers by industry and nationality',
  url: 'https://statdb.mol.gov.tw/html/mon/c12040.pdf',
};

const TAIWAN_FAMILY_MIGRATION: MigrationCorridorSource = {
  organization: 'National Immigration Agency, Taiwan',
  title: 'ICERD initial report — foreign and cross-strait spouses by origin',
  url: 'https://www.immigration.gov.tw/media/97270/roc-taiwan-icerd-initial-report-convention-specific-document.pdf',
};

const CHINA_VIETNAM_LAND_PORTS: MigrationCorridorSource = {
  organization: 'State Council of the People\'s Republic of China',
  title: 'China-Vietnam overland passenger border crossings, 2025',
  url: 'https://english.www.gov.cn/news/202502/26/content_WS67bf02d8c6d0868f4e8effce.html',
};

const CHINA_HEKOU_PASSENGERS: MigrationCorridorSource = {
  organization: 'State Council of the People\'s Republic of China',
  title: 'Hekou land-port passenger and rail connections with Vietnam',
  url: 'https://english.www.gov.cn/news/202506/20/content_WS6854c0a8c6d0868f4e8f37bb.html',
};

const UNESCAP_CROSS_BORDER_TRANSPORT: MigrationCorridorSource = {
  organization: 'United Nations ESCAP',
  title: 'Cross-border transport along the Asian Highway network',
  url: 'https://www.unescap.org/resources/handbook-cross-border-transport-along-asian-highway-network',
};

const UNODC_MIGRANT_SMUGGLING_ASIA: MigrationCorridorSource = {
  organization: 'United Nations Office on Drugs and Crime',
  title: 'Migrant Smuggling in Asia: Current Trends and Related Challenges',
  url: 'https://www.unodc.org/roseap/uploads/archive/documents/Publications/2015/som/Current_Trends_and_Related_Challenges_web.pdf',
};

const OHCHR_DPRK_CHINA: MigrationCorridorSource = {
  organization: 'Office of the UN High Commissioner for Human Rights',
  title: 'DPRK women and girls trafficked through China\'s border provinces',
  url: 'https://spcommreports.ohchr.org/TmSearch/SummaryPrint?id=28786',
};

const KOREA_INCHEON_FERRIES: MigrationCorridorSource = {
  organization: 'Incheon Port Authority',
  title: 'International passenger ferry routes between northern China and Incheon',
  url: 'https://eng.icpa.or.kr/eng/content/view.do?contentKey=869&menuKey=650',
};

const KOREA_COAST_GUARD_SEA_ENTRY: MigrationCorridorSource = {
  organization: 'Korea Coast Guard',
  title: 'Response to maritime illegal-entry attempts from China, 2023',
  url: 'https://www.kcg.go.kr/kcg/na/ntt/selectNttInfo.do?nttSn=49158',
};

const KOREA_COAST_GUARD_SHANDONG_CASE: MigrationCorridorSource = {
  organization: 'Incheon Coast Guard',
  title: 'Interdiction of an attempted small-boat entry from Shandong, 2025',
  url: 'https://kcg.go.kr/inchoncgs/na/ntt/selectNttInfo.do?nttSn=59715',
};

const KOREA_DPRK_ESCAPE_ROUTE: MigrationCorridorSource = {
  organization: 'Office of the UN High Commissioner for Human Rights',
  title: 'Documented irregular crossings of the inter-Korean armistice line',
  url: 'https://seoul.ohchr.org/sites/default/files/2021-12/N1825174.pdf',
};

const TAIWAN_MINI_THREE_LINKS: MigrationCorridorSource = {
  organization: 'Maritime and Port Bureau, Taiwan',
  title: 'Kinmen and Matsu Mini Three Links passenger routes',
  url: 'https://www.motcmpb.gov.tw/Information/Detail/68173c5b-6b25-401f-ab32-62a7d902bd95?NodeId=334&SiteId=1',
};

const TAIWAN_CGA_VIETNAM_CASE: MigrationCorridorSource = {
  organization: 'Coast Guard Administration, Taiwan',
  title: 'Interdiction of 24 Vietnamese nationals in a maritime smuggling case, 2025',
  url: 'https://www.cga.gov.tw/GipOpen/wSite/ct?ctNode=8195&mp=9996&xItem=165792',
};

const TAIWAN_CGA_CHINA_CASE: MigrationCorridorSource = {
  organization: 'Coast Guard Administration, Taiwan',
  title: 'Interception of a maritime illegal-entry attempt near Kinmen, 2025',
  url: 'https://www.cga.gov.tw/GipOpen/wSite/ct?ctNode=13400&mp=eng&xItem=167573',
};

const TAIWAN_CGA_TAMSUI_CASE: MigrationCorridorSource = {
  organization: 'Coast Guard Administration, Taiwan',
  title: 'Mainland China small-boat illegal-entry cases and interdictions',
  url: 'https://www.cga.gov.tw/GipOpen/wSite/ct?ctNode=10843&mp=9998A&xItem=160648',
};

const JAPAN_HAKATA_BUSAN_FERRY: MigrationCorridorSource = {
  organization: 'City of Fukuoka Port and Airport Bureau',
  title: 'Scheduled Busan-Hakata international passenger ferry route',
  url: 'https://www.city.fukuoka.lg.jp/kowan/koei/hakata-port/terminal.html',
};

const JAPAN_COAST_GUARD_ILLEGAL_ENTRY: MigrationCorridorSource = {
  organization: 'Japan Coast Guard',
  title: 'Enforcement against maritime smuggling and illegal-entry offenses',
  url: 'https://www.kaiho.mlit.go.jp/seisaku/shisaku/mikkou.html',
};

const JAPAN_KOREA_SMUGGLING_CASE: MigrationCorridorSource = {
  organization: 'Japan Coast Guard',
  title: 'Interdiction of a Korea-Japan small-boat illegal-entry operation, 2010',
  url: 'https://www.kaiho.mlit.go.jp/info/books/report2011/html/honpen/p052_01_c04.html',
};

const JAPAN_CHINA_SMUGGLING_CASE: MigrationCorridorSource = {
  organization: 'National Police Agency of Japan',
  title: 'Documented Fujian-Osaka group-smuggling case',
  url: 'https://www.npa.go.jp/hakusyo/h15/html/E1101041.html',
};

const JAPAN_IRREGULAR_STAY: MigrationCorridorSource = {
  organization: 'Immigration Services Agency of Japan',
  title: 'Foreign nationals overstaying as of 1 January 2025, by nationality',
  url: 'https://www.moj.go.jp/isa/publications/press/13_00053.html',
};

const MEA_OVERSEAS_INDIANS: MigrationCorridorSource = {
  organization: 'Ministry of External Affairs (India)',
  title: 'Population of Overseas Indians — country-wise NRI and PIO estimates',
  url: 'https://www.mea.gov.in/images/attach/NRIs-and-PIOs_1.pdf',
};

const C = {
  beijing: [116.4074, 39.9042],
  shanghai: [121.4737, 31.2304],
  guangzhou: [113.2644, 23.1291],
  kunming: [102.8329, 24.8801],
  seoul: [126.978, 37.5665],
  tokyo: [139.6917, 35.6895],
  taipei: [121.5654, 25.033],
  losAngeles: [-118.2437, 34.0522],
  yangon: [96.1951, 16.8661],
  hanoi: [105.8342, 21.0278],
  delhi: [77.1025, 28.7041],
  mumbai: [72.8777, 19.076],
  bengaluru: [77.5946, 12.9716],
  kochi: [76.2673, 9.9312],
  frankfurt: [8.6821, 50.1109],
  manila: [120.9842, 14.5995],
  kathmandu: [85.324, 27.7172],
  jakarta: [106.8456, -6.2088],
  saoPaulo: [-46.6333, -23.5505],
  bangkok: [100.5018, 13.7563],
  tashkent: [69.2401, 41.2995],
  kualaLumpur: [101.6869, 3.139],
  beijingCapital: [116.5975, 40.0799],
  shanghaiPudong: [121.8052, 31.1443],
  guangzhouBaiyun: [113.2988, 23.3924],
  kunmingChangshui: [102.9292, 25.1019],
  tokyoNarita: [140.3929, 35.772],
  seoulIncheon: [126.4505, 37.4602],
  taiwanTaoyuan: [121.2328, 25.0777],
  vientiane: [102.6331, 17.9757],
  mandalay: [96.0891, 21.9588],
  pyongyang: [125.7625, 39.0392],
  kaesong: [126.5544, 37.9708],
  paju: [126.7799, 37.7599],
  nanning: [108.3669, 22.817],
  shenyang: [123.4315, 41.8057],
  yanji: [129.5089, 42.8913],
  laoCai: [103.9707, 22.4809],
  hekou: [103.9615, 22.5075],
  dongDang: [106.598, 21.945],
  youyiPass: [106.711, 21.976],
  mongCai: [107.966, 21.529],
  dongxing: [107.971, 21.547],
  boten: [101.679, 21.171],
  mohan: [101.677, 21.185],
  muse: [97.901, 23.986],
  ruili: [97.855, 24.012],
  sinuiju: [124.398, 40.1],
  dandong: [124.394, 40.125],
  namyang: [129.85, 42.95],
  tumen: [129.843, 42.967],
  qingdaoPort: [120.316, 36.065],
  weihaiPort: [122.12, 37.51],
  dalianPort: [121.65, 38.93],
  incheonPort: [126.6, 37.45],
  boryeongCoast: [126.51, 36.33],
  xiamenPort: [118.0894, 24.4798],
  quanzhouPort: [118.6757, 24.8741],
  kinmenShuitou: [118.292, 24.412],
  fuzhouLangqi: [119.55, 26.14],
  matsuNangan: [119.943, 26.154],
  fujianCoast: [119.72, 25.45],
  kinmenMaritimeApproach: [118.2, 24.42],
  tamsui: [121.43, 25.17],
  tamsuiMaritimeApproach: [121.18, 25.19],
  taiwanOffshoreApproach: [119.45, 22.65],
  taiwanWestCoast: [120.12, 23.0],
  busanPort: [129.04, 35.1],
  hakataPort: [130.4, 33.6],
  koreaSouthCoast: [128.5, 34.7],
  hirado: [129.55, 33.37],
  osakaPort: [135.43, 34.65],
} as const satisfies Record<string, MigrationCoordinate>;

type CorridorArgs = {
  id: string;
  label: string;
  status: MigrationCorridor['status'];
  originLabel: string;
  originCode: string;
  destinationLabel: string;
  destinationType: MigrationCorridor['destinationType'];
  legs: readonly MigrationCorridorLeg[];
  transitLabels?: readonly MigrationTransitLabel[];
  sources: readonly MigrationCorridorSource[];
};

function corridor(args: CorridorArgs): MigrationCorridor {
  return args;
}

type DirectCorridorArgs = Omit<CorridorArgs, 'legs'> & {
  mode: MigrationCorridorLeg['mode'];
  origin: MigrationCoordinate;
  destination: MigrationCoordinate;
  waypoints?: readonly MigrationCoordinate[];
};

function directCorridor({ mode, origin, destination, waypoints, ...args }: DirectCorridorArgs): MigrationCorridor {
  return corridor({
    ...args,
    legs: [{ mode, waypoints: waypoints ?? [origin, destination] }],
  });
}

type AirCorridorArgs = {
  id: string;
  label: string;
  originLabel: string;
  originCode: string;
  origin: MigrationCoordinate;
  destinationLabel: string;
  destination: MigrationCoordinate;
  sources: readonly MigrationCorridorSource[];
};

function airCorridor({
  id,
  label,
  originLabel,
  originCode,
  origin,
  destinationLabel,
  destination,
  sources,
}: AirCorridorArgs): MigrationCorridor {
  return directCorridor({
    id,
    label,
    status: 'regular',
    originLabel,
    originCode,
    destinationLabel,
    destinationType: 'airport entry',
    mode: 'air',
    origin,
    destination,
    sources,
  });
}

type EastAsiaTargetIso = Extract<MigrationTargetIso, 'CHN' | 'TWN' | 'KOR' | 'JPN'>;

const CHINA_SOURCES = [CHINA_NBS_FOREIGN_RESIDENTS, CHINA_NIA_ENTRY_PORTS, UN_MIGRANT_STOCK_2024] as const;
const JAPAN_SOURCES = [JAPAN_FOREIGN_RESIDENTS, UN_MIGRANT_STOCK_2024] as const;
const JAPAN_LABOR_SOURCES = [JAPAN_FOREIGN_RESIDENTS, JAPAN_SKILLED_WORKERS, UN_MIGRANT_STOCK_2024] as const;
const KOREA_SOURCES = [KOREA_FOREIGN_RESIDENTS, UN_MIGRANT_STOCK_2024] as const;
const TAIWAN_LABOR_SOURCES = [TAIWAN_FOREIGN_RESIDENTS, TAIWAN_FOREIGN_WORKERS, UN_MIGRANT_STOCK_2024] as const;

export const EAST_ASIA_MIGRATION_CORRIDORS_BY_ISO = {
  CHN: [
    airCorridor({ id: 'korea-beijing-resident', label: 'South Korea · Beijing resident corridor', originLabel: 'Seoul, South Korea', originCode: 'KOR', origin: C.seoul, destinationLabel: 'Beijing Capital Airport', destination: C.beijingCapital, sources: CHINA_SOURCES }),
    airCorridor({ id: 'usa-shanghai-resident', label: 'United States · Shanghai resident corridor', originLabel: 'Los Angeles, United States', originCode: 'USA', origin: C.losAngeles, destinationLabel: 'Shanghai Pudong Airport', destination: C.shanghaiPudong, sources: CHINA_SOURCES }),
    airCorridor({ id: 'japan-shanghai-resident', label: 'Japan · Shanghai resident corridor', originLabel: 'Tokyo, Japan', originCode: 'JPN', origin: C.tokyo, destinationLabel: 'Shanghai Pudong Airport', destination: C.shanghaiPudong, sources: CHINA_SOURCES }),
    airCorridor({ id: 'taiwan-shanghai-resident', label: 'Taiwan · Shanghai resident corridor', originLabel: 'Taipei, Taiwan', originCode: 'TWN', origin: C.taipei, destinationLabel: 'Shanghai Pudong Airport', destination: C.shanghaiPudong, sources: CHINA_SOURCES }),
    airCorridor({ id: 'myanmar-kunming-resident', label: 'Myanmar · Kunming resident corridor', originLabel: 'Yangon, Myanmar', originCode: 'MMR', origin: C.yangon, destinationLabel: 'Kunming Changshui Airport', destination: C.kunmingChangshui, sources: CHINA_SOURCES }),
    airCorridor({ id: 'vietnam-guangzhou-resident', label: 'Vietnam · Guangzhou resident corridor', originLabel: 'Hanoi, Vietnam', originCode: 'VNM', origin: C.hanoi, destinationLabel: 'Guangzhou Baiyun Airport', destination: C.guangzhouBaiyun, sources: CHINA_SOURCES }),
    airCorridor({ id: 'india-shanghai-resident', label: 'India · Shanghai resident corridor', originLabel: 'Delhi, India', originCode: 'IND', origin: C.delhi, destinationLabel: 'Shanghai Pudong Airport', destination: C.shanghaiPudong, sources: CHINA_SOURCES }),
    airCorridor({ id: 'germany-shanghai-resident', label: 'Germany · Shanghai resident corridor', originLabel: 'Frankfurt, Germany', originCode: 'DEU', origin: C.frankfurt, destinationLabel: 'Shanghai Pudong Airport', destination: C.shanghaiPudong, sources: CHINA_SOURCES }),
    airCorridor({ id: 'india-guangzhou-trader', label: 'India · Guangzhou trade / resident corridor', originLabel: 'Mumbai, India', originCode: 'IND', origin: C.mumbai, destinationLabel: 'Guangzhou Baiyun Airport', destination: C.guangzhouBaiyun, sources: [...CHINA_SOURCES, MEA_OVERSEAS_INDIANS] }),
    directCorridor({ id: 'vietnam-hekou-land', label: 'Vietnam · Hekou regular land corridor', status: 'regular', originLabel: 'Hanoi, Vietnam', originCode: 'VNM', origin: C.hanoi, destinationLabel: 'Hekou land port', destinationType: 'land entry', destination: C.hekou, mode: 'land', waypoints: [C.hanoi, C.laoCai, C.hekou], transitLabels: [{ code: 'VNM', label: 'Lao Cai border', coordinate: C.laoCai }], sources: [CHINA_HEKOU_PASSENGERS, CHINA_VIETNAM_LAND_PORTS, UNESCAP_CROSS_BORDER_TRANSPORT] }),
    directCorridor({ id: 'vietnam-youyi-land', label: 'Vietnam · Friendship Pass regular land corridor', status: 'regular', originLabel: 'Hanoi, Vietnam', originCode: 'VNM', origin: C.hanoi, destinationLabel: 'Friendship Pass land port', destinationType: 'land entry', destination: C.youyiPass, mode: 'land', waypoints: [C.hanoi, C.dongDang, C.youyiPass], transitLabels: [{ code: 'VNM', label: 'Dong Dang', coordinate: C.dongDang }], sources: [CHINA_VIETNAM_LAND_PORTS, UNESCAP_CROSS_BORDER_TRANSPORT] }),
    directCorridor({ id: 'laos-mohan-land', label: 'Laos · Mohan regular land corridor', status: 'regular', originLabel: 'Vientiane, Laos', originCode: 'LAO', origin: C.vientiane, destinationLabel: 'Mohan land port', destinationType: 'land entry', destination: C.mohan, mode: 'land', waypoints: [C.vientiane, C.boten, C.mohan], transitLabels: [{ code: 'LAO', label: 'Boten border', coordinate: C.boten }], sources: [UNESCAP_CROSS_BORDER_TRANSPORT, UN_MIGRANT_STOCK_2024] }),
    directCorridor({ id: 'myanmar-ruili-land', label: 'Myanmar · Ruili regular land corridor', status: 'regular', originLabel: 'Mandalay, Myanmar', originCode: 'MMR', origin: C.mandalay, destinationLabel: 'Ruili land port', destinationType: 'land entry', destination: C.ruili, mode: 'land', waypoints: [C.mandalay, C.muse, C.ruili], transitLabels: [{ code: 'MMR', label: 'Muse border', coordinate: C.muse }], sources: [UNESCAP_CROSS_BORDER_TRANSPORT, UN_MIGRANT_STOCK_2024] }),
    directCorridor({ id: 'korea-weihai-ferry', label: 'South Korea · Weihai regular sea corridor', status: 'regular', originLabel: 'Incheon, South Korea', originCode: 'KOR', origin: C.incheonPort, destinationLabel: 'Weihai passenger port', destinationType: 'sea entry', destination: C.weihaiPort, mode: 'sea', sources: [KOREA_INCHEON_FERRIES, UN_MIGRANT_STOCK_2024] }),
    directCorridor({ id: 'taiwan-xiamen-ferry', label: 'Taiwan · Xiamen Mini Three Links sea corridor', status: 'regular', originLabel: 'Kinmen, Taiwan', originCode: 'TWN', origin: C.kinmenShuitou, destinationLabel: 'Xiamen Wutong passenger port', destinationType: 'sea entry', destination: C.xiamenPort, mode: 'sea', sources: [TAIWAN_MINI_THREE_LINKS, UN_MIGRANT_STOCK_2024] }),
    directCorridor({ id: 'dprk-dandong-irregular-land', label: 'DPRK · Dandong irregular escape / trafficking corridor', status: 'irregular', originLabel: 'Sinuiju, DPRK', originCode: 'PRK', origin: C.sinuiju, destinationLabel: 'Dandong border area', destinationType: 'land entry', destination: C.dandong, mode: 'land', sources: [OHCHR_DPRK_CHINA, UNODC_MIGRANT_SMUGGLING_ASIA] }),
    directCorridor({ id: 'dprk-tumen-irregular-land', label: 'DPRK · Tumen River irregular escape corridor', status: 'irregular', originLabel: 'Namyang, DPRK', originCode: 'PRK', origin: C.namyang, destinationLabel: 'Tumen border area', destinationType: 'land entry', destination: C.tumen, mode: 'land', sources: [OHCHR_DPRK_CHINA, UNODC_MIGRANT_SMUGGLING_ASIA] }),
    directCorridor({ id: 'vietnam-dongxing-irregular-land', label: 'Vietnam · Guangxi irregular land corridor', status: 'irregular', originLabel: 'Mong Cai, Vietnam', originCode: 'VNM', origin: C.mongCai, destinationLabel: 'Dongxing border area', destinationType: 'land entry', destination: C.dongxing, mode: 'land', sources: [UNODC_MIGRANT_SMUGGLING_ASIA, CHINA_VIETNAM_LAND_PORTS] }),
  ],
  JPN: [
    airCorridor({ id: 'china-tokyo-resident', label: 'China · Tokyo resident corridor', originLabel: 'Shanghai, China', originCode: 'CHN', origin: C.shanghai, destinationLabel: 'Tokyo Narita Airport', destination: C.tokyoNarita, sources: JAPAN_SOURCES }),
    airCorridor({ id: 'vietnam-tokyo-worker', label: 'Vietnam · Tokyo work / residence corridor', originLabel: 'Hanoi, Vietnam', originCode: 'VNM', origin: C.hanoi, destinationLabel: 'Tokyo Narita Airport', destination: C.tokyoNarita, sources: JAPAN_LABOR_SOURCES }),
    airCorridor({ id: 'korea-tokyo-resident', label: 'South Korea · Tokyo resident corridor', originLabel: 'Seoul, South Korea', originCode: 'KOR', origin: C.seoul, destinationLabel: 'Tokyo Narita Airport', destination: C.tokyoNarita, sources: JAPAN_SOURCES }),
    airCorridor({ id: 'philippines-tokyo-worker', label: 'Philippines · Tokyo work / residence corridor', originLabel: 'Manila, Philippines', originCode: 'PHL', origin: C.manila, destinationLabel: 'Tokyo Narita Airport', destination: C.tokyoNarita, sources: JAPAN_LABOR_SOURCES }),
    airCorridor({ id: 'nepal-tokyo-study-work', label: 'Nepal · Tokyo study / work corridor', originLabel: 'Kathmandu, Nepal', originCode: 'NPL', origin: C.kathmandu, destinationLabel: 'Tokyo Narita Airport', destination: C.tokyoNarita, sources: JAPAN_SOURCES }),
    airCorridor({ id: 'indonesia-tokyo-worker', label: 'Indonesia · Tokyo work / residence corridor', originLabel: 'Jakarta, Indonesia', originCode: 'IDN', origin: C.jakarta, destinationLabel: 'Tokyo Narita Airport', destination: C.tokyoNarita, sources: JAPAN_LABOR_SOURCES }),
    airCorridor({ id: 'brazil-tokyo-resident', label: 'Brazil · Tokyo long-term resident corridor', originLabel: 'São Paulo, Brazil', originCode: 'BRA', origin: C.saoPaulo, destinationLabel: 'Tokyo Narita Airport', destination: C.tokyoNarita, sources: JAPAN_SOURCES }),
    airCorridor({ id: 'myanmar-tokyo-worker', label: 'Myanmar · Tokyo work / residence corridor', originLabel: 'Yangon, Myanmar', originCode: 'MMR', origin: C.yangon, destinationLabel: 'Tokyo Narita Airport', destination: C.tokyoNarita, sources: JAPAN_LABOR_SOURCES }),
    airCorridor({ id: 'india-tokyo-engineer', label: 'India · Tokyo IT engineer / residence corridor', originLabel: 'Bengaluru, India', originCode: 'IND', origin: C.bengaluru, destinationLabel: 'Tokyo Narita Airport', destination: C.tokyoNarita, sources: [...JAPAN_LABOR_SOURCES, MEA_OVERSEAS_INDIANS] }),
    airCorridor({ id: 'india-tokyo-care-worker', label: 'India · Tokyo specified-skilled / care worker corridor', originLabel: 'Kochi, India', originCode: 'IND', origin: C.kochi, destinationLabel: 'Tokyo Narita Airport', destination: C.tokyoNarita, sources: [...JAPAN_LABOR_SOURCES, MEA_OVERSEAS_INDIANS] }),
    directCorridor({ id: 'korea-hakata-ferry', label: 'South Korea · Hakata regular sea corridor', status: 'regular', originLabel: 'Busan, South Korea', originCode: 'KOR', origin: C.busanPort, destinationLabel: 'Hakata international passenger port', destinationType: 'sea entry', destination: C.hakataPort, mode: 'sea', sources: [JAPAN_HAKATA_BUSAN_FERRY, JAPAN_FOREIGN_RESIDENTS] }),
    directCorridor({ id: 'korea-hirado-irregular-sea', label: 'Historical South Korea · Hirado irregular sea case (2010)', status: 'irregular', originLabel: 'South Korean coast (documented case)', originCode: 'KOR', origin: C.koreaSouthCoast, destinationLabel: 'Hirado coastal entry', destinationType: 'sea entry', destination: C.hirado, mode: 'sea', sources: [JAPAN_KOREA_SMUGGLING_CASE, JAPAN_COAST_GUARD_ILLEGAL_ENTRY] }),
    directCorridor({ id: 'china-osaka-irregular-sea', label: 'Historical China · Osaka group-smuggling case (2001–02)', status: 'irregular', originLabel: 'Fujian coast, China', originCode: 'CHN', origin: C.fujianCoast, destinationLabel: 'Osaka coastal entry', destinationType: 'sea entry', destination: C.osakaPort, mode: 'sea', sources: [JAPAN_CHINA_SMUGGLING_CASE, JAPAN_COAST_GUARD_ILLEGAL_ENTRY, UNODC_MIGRANT_SMUGGLING_ASIA] }),
    directCorridor({ id: 'vietnam-narita-overstay', label: 'Vietnam · schematic Japan air-entry-to-overstay pattern', status: 'irregular', originLabel: 'Vietnam (schematic departure)', originCode: 'VNM', origin: C.hanoi, destinationLabel: 'Japan air-entry / overstay pattern', destinationType: 'airport entry', destination: C.tokyoNarita, mode: 'air', sources: [JAPAN_IRREGULAR_STAY, JAPAN_FOREIGN_RESIDENTS] }),
    directCorridor({ id: 'thailand-narita-overstay', label: 'Thailand · Japan air-entry-to-overstay pattern', status: 'irregular', originLabel: 'Bangkok, Thailand', originCode: 'THA', origin: C.bangkok, destinationLabel: 'Japan air-entry / overstay pattern', destinationType: 'airport entry', destination: C.tokyoNarita, mode: 'air', sources: [JAPAN_IRREGULAR_STAY] }),
  ],
  KOR: [
    airCorridor({ id: 'china-incheon-resident', label: 'China · Incheon resident corridor', originLabel: 'Beijing, China', originCode: 'CHN', origin: C.beijing, destinationLabel: 'Incheon Airport / Seoul', destination: C.seoulIncheon, sources: KOREA_SOURCES }),
    airCorridor({ id: 'vietnam-incheon-resident', label: 'Vietnam · Incheon resident corridor', originLabel: 'Hanoi, Vietnam', originCode: 'VNM', origin: C.hanoi, destinationLabel: 'Incheon Airport / Seoul', destination: C.seoulIncheon, sources: KOREA_SOURCES }),
    airCorridor({ id: 'usa-incheon-resident', label: 'United States · Incheon resident corridor', originLabel: 'Los Angeles, United States', originCode: 'USA', origin: C.losAngeles, destinationLabel: 'Incheon Airport / Seoul', destination: C.seoulIncheon, sources: KOREA_SOURCES }),
    airCorridor({ id: 'thailand-incheon-resident', label: 'Thailand · Incheon resident corridor', originLabel: 'Bangkok, Thailand', originCode: 'THA', origin: C.bangkok, destinationLabel: 'Incheon Airport / Seoul', destination: C.seoulIncheon, sources: KOREA_SOURCES }),
    airCorridor({ id: 'uzbekistan-incheon-worker', label: 'Uzbekistan · Incheon work / residence corridor', originLabel: 'Tashkent, Uzbekistan', originCode: 'UZB', origin: C.tashkent, destinationLabel: 'Incheon Airport / Seoul', destination: C.seoulIncheon, sources: KOREA_SOURCES }),
    airCorridor({ id: 'philippines-incheon-resident', label: 'Philippines · Incheon resident corridor', originLabel: 'Manila, Philippines', originCode: 'PHL', origin: C.manila, destinationLabel: 'Incheon Airport / Seoul', destination: C.seoulIncheon, sources: KOREA_SOURCES }),
    airCorridor({ id: 'japan-incheon-resident', label: 'Japan · Incheon resident corridor', originLabel: 'Tokyo, Japan', originCode: 'JPN', origin: C.tokyo, destinationLabel: 'Incheon Airport / Seoul', destination: C.seoulIncheon, sources: KOREA_SOURCES }),
    airCorridor({ id: 'india-incheon-resident', label: 'India · Incheon skilled / study corridor', originLabel: 'Delhi, India', originCode: 'IND', origin: C.delhi, destinationLabel: 'Incheon Airport / Seoul', destination: C.seoulIncheon, sources: [...KOREA_SOURCES, MEA_OVERSEAS_INDIANS] }),
    directCorridor({ id: 'qingdao-incheon-ferry', label: 'China · Qingdao-Incheon regular sea corridor', status: 'regular', originLabel: 'Qingdao, China', originCode: 'CHN', origin: C.qingdaoPort, destinationLabel: 'Incheon international passenger port', destinationType: 'sea entry', destination: C.incheonPort, mode: 'sea', sources: [KOREA_INCHEON_FERRIES, KOREA_FOREIGN_RESIDENTS] }),
    directCorridor({ id: 'weihai-incheon-ferry', label: 'China · Weihai-Incheon regular sea corridor', status: 'regular', originLabel: 'Weihai, China', originCode: 'CHN', origin: C.weihaiPort, destinationLabel: 'Incheon international passenger port', destinationType: 'sea entry', destination: C.incheonPort, mode: 'sea', sources: [KOREA_INCHEON_FERRIES, KOREA_FOREIGN_RESIDENTS] }),
    directCorridor({ id: 'dalian-incheon-ferry', label: 'China · Dalian-Incheon regular sea corridor', status: 'regular', originLabel: 'Dalian, China', originCode: 'CHN', origin: C.dalianPort, destinationLabel: 'Incheon international passenger port', destinationType: 'sea entry', destination: C.incheonPort, mode: 'sea', sources: [KOREA_INCHEON_FERRIES, KOREA_FOREIGN_RESIDENTS] }),
    directCorridor({ id: 'shandong-boryeong-irregular-sea', label: 'China · Boryeong documented irregular sea corridor', status: 'irregular', originLabel: 'Shandong coast, China', originCode: 'CHN', origin: C.weihaiPort, destinationLabel: 'Boryeong coastal entry', destinationType: 'sea entry', destination: C.boryeongCoast, mode: 'sea', sources: [KOREA_COAST_GUARD_SEA_ENTRY] }),
    directCorridor({ id: 'shandong-socheongdo-irregular-sea', label: 'China · Socheongdo documented irregular sea corridor', status: 'irregular', originLabel: 'Shandong coast, China', originCode: 'CHN', origin: C.weihaiPort, destinationLabel: 'Socheongdo maritime approach', destinationType: 'sea entry', destination: [124.75, 37.76], mode: 'sea', sources: [KOREA_COAST_GUARD_SHANDONG_CASE] }),
    directCorridor({ id: 'dprk-dmz-irregular-land', label: 'DPRK · DMZ irregular escape / asylum corridor', status: 'irregular', originLabel: 'Kaesong area, DPRK', originCode: 'PRK', origin: C.kaesong, destinationLabel: 'Paju / southern armistice line', destinationType: 'safe entry', destination: C.paju, mode: 'land', sources: [KOREA_DPRK_ESCAPE_ROUTE] }),
  ],
  TWN: [
    airCorridor({ id: 'indonesia-taoyuan-worker', label: 'Indonesia · Taoyuan work / residence corridor', originLabel: 'Jakarta, Indonesia', originCode: 'IDN', origin: C.jakarta, destinationLabel: 'Taoyuan Airport / Taipei', destination: C.taiwanTaoyuan, sources: TAIWAN_LABOR_SOURCES }),
    airCorridor({ id: 'vietnam-taoyuan-worker', label: 'Vietnam · Taoyuan work / residence corridor', originLabel: 'Hanoi, Vietnam', originCode: 'VNM', origin: C.hanoi, destinationLabel: 'Taoyuan Airport / Taipei', destination: C.taiwanTaoyuan, sources: TAIWAN_LABOR_SOURCES }),
    airCorridor({ id: 'philippines-taoyuan-worker', label: 'Philippines · Taoyuan work / residence corridor', originLabel: 'Manila, Philippines', originCode: 'PHL', origin: C.manila, destinationLabel: 'Taoyuan Airport / Taipei', destination: C.taiwanTaoyuan, sources: TAIWAN_LABOR_SOURCES }),
    airCorridor({ id: 'thailand-taoyuan-worker', label: 'Thailand · Taoyuan work / residence corridor', originLabel: 'Bangkok, Thailand', originCode: 'THA', origin: C.bangkok, destinationLabel: 'Taoyuan Airport / Taipei', destination: C.taiwanTaoyuan, sources: TAIWAN_LABOR_SOURCES }),
    airCorridor({ id: 'china-taoyuan-family', label: 'Mainland China · Taoyuan family / reunification corridor', originLabel: 'Shanghai, China', originCode: 'CHN', origin: C.shanghai, destinationLabel: 'Taoyuan Airport / Taipei', destination: C.taiwanTaoyuan, sources: [TAIWAN_FAMILY_MIGRATION, TAIWAN_FOREIGN_RESIDENTS] }),
    airCorridor({ id: 'malaysia-taoyuan-resident', label: 'Malaysia · Taoyuan professional / resident corridor', originLabel: 'Kuala Lumpur, Malaysia', originCode: 'MYS', origin: C.kualaLumpur, destinationLabel: 'Taoyuan Airport / Taipei', destination: C.taiwanTaoyuan, sources: [TAIWAN_FOREIGN_RESIDENTS, UN_MIGRANT_STOCK_2024] }),
    airCorridor({ id: 'japan-taoyuan-resident', label: 'Japan · Taoyuan professional / resident corridor', originLabel: 'Tokyo, Japan', originCode: 'JPN', origin: C.tokyo, destinationLabel: 'Taoyuan Airport / Taipei', destination: C.taiwanTaoyuan, sources: [TAIWAN_FOREIGN_RESIDENTS, UN_MIGRANT_STOCK_2024] }),
    airCorridor({ id: 'korea-taoyuan-resident', label: 'South Korea · Taoyuan professional / resident corridor', originLabel: 'Seoul, South Korea', originCode: 'KOR', origin: C.seoul, destinationLabel: 'Taoyuan Airport / Taipei', destination: C.taiwanTaoyuan, sources: [TAIWAN_FOREIGN_RESIDENTS, UN_MIGRANT_STOCK_2024] }),
    airCorridor({ id: 'india-taoyuan-worker', label: 'India · Taoyuan labour-mobility / professional corridor', originLabel: 'Delhi, India', originCode: 'IND', origin: C.delhi, destinationLabel: 'Taoyuan Airport / Taipei', destination: C.taiwanTaoyuan, sources: [...TAIWAN_LABOR_SOURCES, MEA_OVERSEAS_INDIANS] }),
    directCorridor({ id: 'xiamen-kinmen-ferry', label: 'Mainland China · Kinmen Mini Three Links sea corridor', status: 'regular', originLabel: 'Xiamen, China', originCode: 'CHN', origin: C.xiamenPort, destinationLabel: 'Kinmen Shuitou passenger port', destinationType: 'sea entry', destination: C.kinmenShuitou, mode: 'sea', sources: [TAIWAN_MINI_THREE_LINKS, TAIWAN_FOREIGN_RESIDENTS] }),
    directCorridor({ id: 'quanzhou-kinmen-ferry', label: 'Mainland China · Quanzhou-Kinmen regular sea corridor', status: 'regular', originLabel: 'Quanzhou, China', originCode: 'CHN', origin: C.quanzhouPort, destinationLabel: 'Kinmen Shuitou passenger port', destinationType: 'sea entry', destination: C.kinmenShuitou, mode: 'sea', sources: [TAIWAN_MINI_THREE_LINKS, TAIWAN_FOREIGN_RESIDENTS] }),
    directCorridor({ id: 'fuzhou-matsu-ferry', label: 'Mainland China · Matsu Mini Three Links sea corridor', status: 'regular', originLabel: 'Fuzhou Langqi, China', originCode: 'CHN', origin: C.fuzhouLangqi, destinationLabel: 'Matsu Nangan passenger port', destinationType: 'sea entry', destination: C.matsuNangan, mode: 'sea', sources: [TAIWAN_MINI_THREE_LINKS, TAIWAN_FOREIGN_RESIDENTS] }),
    directCorridor({ id: 'fujian-kinmen-irregular-sea', label: 'Mainland China · Kinmen documented irregular small-boat approach', status: 'irregular', originLabel: 'Kinmen western maritime approach', originCode: 'CHN', origin: C.kinmenMaritimeApproach, destinationLabel: 'Kinmen coastal entry', destinationType: 'sea entry', destination: C.kinmenShuitou, mode: 'sea', sources: [TAIWAN_CGA_CHINA_CASE] }),
    directCorridor({ id: 'fujian-tamsui-irregular-sea', label: 'Mainland China · Tamsui documented irregular small-boat approach', status: 'irregular', originLabel: 'Tamsui offshore approach', originCode: 'CHN', origin: C.tamsuiMaritimeApproach, destinationLabel: 'Tamsui coastal entry', destinationType: 'sea entry', destination: C.tamsui, mode: 'sea', sources: [TAIWAN_CGA_TAMSUI_CASE] }),
    directCorridor({ id: 'vietnam-taiwan-irregular-sea', label: 'Vietnamese nationals · documented Taiwan offshore smuggling case', status: 'irregular', originLabel: 'Documented offshore interception area', originCode: 'VNM', origin: C.taiwanOffshoreApproach, destinationLabel: 'Taiwan western maritime approach', destinationType: 'sea entry', destination: C.taiwanWestCoast, mode: 'sea', sources: [TAIWAN_CGA_VIETNAM_CASE, TAIWAN_FOREIGN_WORKERS] }),
  ],
} satisfies Record<EastAsiaTargetIso, readonly MigrationCorridor[]>;
