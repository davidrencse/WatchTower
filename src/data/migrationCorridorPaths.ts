/**
 * Named place waypoints for schematic migration corridor densification.
 * Coordinates are real cities, ports, border crossings, and coastal sea points
 * used by documented Frontex / IOM / UNHCR route geographies — not turn-by-turn
 * instructions. Arrays are ordered for travel; consecutive legs must share junctions.
 */

import type { MigrationCoordinate } from './migrationCorridors';

type Path = readonly MigrationCoordinate[];

/** Join path segments, dropping the duplicate junction at each join. */
export function joinPaths(...segments: Path[]): MigrationCoordinate[] {
  const out: MigrationCoordinate[] = [];
  for (const segment of segments) {
    for (let i = 0; i < segment.length; i++) {
      const point = segment[i]!;
      if (out.length === 0) {
        out.push(point);
        continue;
      }
      const prev = out[out.length - 1]!;
      if (prev[0] === point[0] && prev[1] === point[1]) continue;
      out.push(point);
    }
  }
  return out;
}

// --- Named hubs (lon, lat) -------------------------------------------------

export const P = {
  // West / Central Africa → Libya
  lagos: [3.3792, 6.5244],
  kano: [8.5167, 12.0022],
  zinder: [8.9881, 13.8053],
  agadez: [7.9865, 16.9742],
  dirkou: [12.893, 18.999],
  madama: [13.45, 21.95],
  alQatrun: [14.63, 24.95],
  sabha: [14.4283, 27.0377],
  baniWalid: [14.024, 31.756],
  tripoli: [13.1913, 32.8872],
  zuwara: [12.0847, 32.9335],
  mitiga: [13.159, 32.8972],

  // Horn / Sudan → eastern Libya
  asmara: [38.9251, 15.3229],
  khartoum: [32.5599, 15.5007],
  dongola: [30.4833, 19.1667],
  elFasher: [25.3499, 13.6279],
  abeche: [20.8347, 13.8291],
  faya: [19.1, 17.93],
  alKufra: [23.313, 24.198],
  ajdabiya: [20.2263, 30.7554],
  benghazi: [20.0685, 32.1167],
  tobruk: [23.9767, 32.0835],

  // Egypt
  cairo: [31.2357, 30.0444],
  marsaMatruh: [27.2453, 31.3543],
  sollum: [25.158, 31.567],

  // Tunisia / Algeria departures
  sfax: [10.7603, 34.7406],
  kerkennahOffshore: [11.2, 34.95],
  annaba: [7.7667, 36.9],
  oran: [-0.6417, 35.6969],

  // Italy landings / hubs
  lampedusa: [12.62, 35.5019],
  pantelleria: [11.992, 36.787],
  portoEmpedocle: [13.526, 37.289],
  augusta: [15.219, 37.236],
  pozzoallo: [14.8467, 36.7306],
  calabriaCoast: [16.05, 38.45],
  catania: [15.0873, 37.5079],
  messina: [15.5542, 38.1938],
  villaSanGiovanni: [15.65, 38.216],
  reggioCalabria: [15.6508, 38.1105],
  naples: [14.2681, 40.8518],
  rome: [12.4964, 41.9028],
  fiumicino: [12.2508, 41.8003],
  florence: [11.2558, 43.7696],
  bologna: [11.3426, 44.4949],
  milan: [9.19, 45.4642],
  genoa: [8.9463, 44.4056],
  ventimiglia: [7.6102, 43.7904],
  turin: [7.6869, 45.0703],
  oulx: [6.832, 45.032],
  bari: [16.875, 41.137],
  santAntioco: [8.452, 39.066],
  trieste: [13.7768, 45.6495],
  gorizia: [13.6197, 45.9409],

  // Adriatic / Albania
  durres: [19.456, 41.318],
  adriaticMid: [18.2, 41.22],

  // France borders / Channel
  menton: [7.5055, 43.7852],
  montgenevre: [6.7214, 44.931],
  briancon: [6.643, 44.896],
  lyon: [4.8357, 45.764],
  paris: [2.3522, 48.8566],
  cdg: [2.55, 49.0097],
  lille: [3.0573, 50.6292],
  calais: [1.8587, 50.9513],
  dunkirk: [2.3768, 51.0344],
  channelMidCalais: [1.57, 51.04],
  channelMidDunkirk: [1.85, 51.08],
  dover: [1.3134, 51.126],
  cerbere: [3.165, 42.442],
  figueres: [2.961, 42.266],
  hendaye: [-1.773, 43.3582],
  sanSebastian: [-1.9812, 43.3183],

  // Spain
  almeria: [-2.4637, 36.834],
  granada: [-3.5986, 37.1773],
  madrid: [-3.7038, 40.4168],
  barajas: [-3.5676, 40.4719],
  zaragoza: [-0.8773, 41.6488],
  barcelona: [2.1734, 41.3851],
  girona: [2.8245, 41.9794],
  valencia: [-0.3763, 39.4699],
  malaga: [-4.4214, 36.7213],
  seville: [-5.9845, 37.3891],
  cordoba: [-4.7794, 37.8882],
  burgos: [-3.6969, 42.3439],
  vitoria: [-2.6728, 42.8467],
  algeciras: [-5.453, 36.1275],
  straitMid: [-5.55, 35.95],
  ceuta: [-5.3213, 35.8894],
  fnideq: [-5.35, 35.84],
  melilla: [-2.9383, 35.2923],
  nador: [-2.9273, 35.1688],
  elHierro: [-17.98, 27.64],
  lasPalmas: [-15.4134, 28.1235],
  lanzarote: [-13.536, 28.963],
  tanTan: [-11.148, 28.438],
  cartagenaEs: [-0.9864, 37.6009],
  vilarFormoso: [-6.834, 40.613],
  salamanca: [-5.6635, 40.9701],
  conakry: [-13.5784, 9.5095],
  bissau: [-15.595, 11.863],

  // West Africa / Maghreb land
  bamako: [-8.0029, 12.6392],
  gao: [-0.0447, 16.2717],
  tamanrasset: [5.5228, 22.785],
  inSalah: [2.483, 27.193],
  ghardaia: [3.673, 32.49],
  dakar: [-17.4677, 14.7167],
  saintLouis: [-16.49, 16.03],
  nouakchott: [-15.9582, 18.0735],
  nouadhibou: [-17.04, 20.93],
  dakhla: [-15.937, 23.6848],
  laayoune: [-13.2033, 27.1536],
  agadir: [-9.5981, 30.4278],
  marrakech: [-7.9811, 31.6295],
  casablanca: [-7.5898, 33.5731],
  rabat: [-6.8498, 33.9716],
  tangier: [-5.8128, 35.7595],

  // Levant / Türkiye / Iran / Afghanistan
  damascus: [36.2765, 33.5138],
  aleppo: [37.1343, 36.2021],
  latakia: [35.7831, 35.5317],
  beirut: [35.5018, 33.8938],
  tripoliLeb: [35.8497, 34.4367],
  amman: [35.9106, 31.9539],
  baghdad: [44.3661, 33.3152],
  gaziantep: [37.3781, 37.0662],
  ankara: [32.8597, 39.9334],
  istanbul: [28.9784, 41.0082],
  edirne: [26.5557, 41.6771],
  izmir: [27.1428, 38.4237],
  kabul: [69.2075, 34.5553],
  herat: [62.2042, 34.3482],
  mashhad: [59.568, 36.26],
  tehran: [51.389, 35.6892],
  tabriz: [46.2919, 38.0962],
  van: [43.3833, 38.5012],

  // Greece / Evros / islands
  orestiada: [26.5297, 41.5031],
  kipoi: [26.331, 40.96],
  alexandroupoli: [25.874, 40.8457],
  kavala: [24.412, 40.939],
  thessaloniki: [22.9444, 40.6401],
  idomeni: [22.5167, 41.1267],
  mytilene: [26.555, 39.106],
  chios: [26.137, 38.368],
  samos: [26.978, 37.755],
  heraklion: [25.1803, 35.3397],
  athensAirport: [23.9445, 37.9364],
  cesme: [26.3367, 38.3242],
  dikili: [26.89, 39.07],
  kusadasi: [27.256, 37.858],

  // Western Balkans
  gevgelija: [22.5025, 41.1403],
  skopje: [21.4314, 41.9981],
  presevo: [21.5142, 42.3071],
  nis: [21.8958, 43.3209],
  belgrade: [20.4489, 44.7866],
  noviSad: [19.8335, 45.2671],
  subotica: [19.667, 46.1003],
  horgos: [19.972, 46.155],
  roszke: [20.043, 46.187],
  sid: [19.2264, 45.1283],
  bajakovo: [19.106, 45.19],
  vinkovci: [18.801, 45.288],
  zagreb: [15.9819, 45.815],
  karlovac: [15.556, 45.493],
  ljubljana: [14.5058, 46.0569],
  postojna: [14.215, 45.775],
  sezana: [13.873, 45.705],
  obrezje: [15.695, 45.86],
  spielfeld: [15.633, 46.705],
  maribor: [15.6467, 46.5547],
  bihac: [15.87, 44.817],
  velikaKladusa: [15.787, 45.185],
  maljevac: [15.78, 45.12],
  tuzla: [18.6735, 44.5384],
  banjaLuka: [17.191, 44.772],
  loznica: [19.225, 44.533],
  dimitrovgrad: [22.778, 43.015],
  sofia: [23.3219, 42.6977],
  kapitanAndreevo: [26.707, 41.718],
  plovdiv: [24.745, 42.135],
  ruse: [25.9657, 43.8356],
  giurgiu: [25.969, 43.904],

  // Hungary / Austria / Czech / Slovakia
  szeged: [20.1414, 46.253],
  budapest: [19.0402, 47.4979],
  gyor: [17.635, 47.687],
  hegyeshalom: [17.149, 47.914],
  nickelsdorf: [17.069, 47.94],
  vienna: [16.3738, 48.2082],
  viennaAirport: [16.5697, 48.1103],
  salzburg: [13.055, 47.8095],
  linz: [14.2858, 48.3069],
  innsbruck: [11.4041, 47.2692],
  brenner: [11.5047, 47.007],
  kiefersfelden: [12.169, 47.613],
  freilassing: [12.9784, 47.8409],
  passau: [13.4319, 48.5667],
  bratislava: [17.1077, 48.1486],
  cunovo: [17.18, 48.03],
  mikulov: [16.6377, 48.8056],
  breclav: [16.882, 48.759],
  prague: [14.4378, 50.0755],
  pragueAirport: [14.2632, 50.1008],
  plzen: [13.3776, 49.7384],
  waidhaus: [12.4952, 49.6422],
  zahony: [22.176, 48.405],
  chop: [22.2, 48.43],
  uzhhorod: [22.288, 48.62],
  vysneNemecke: [22.26, 48.655],
  budapestAirport: [19.2611, 47.4394],

  // Germany / Benelux / Nordics
  munich: [11.582, 48.1351],
  nuremberg: [11.0767, 49.4521],
  frankfurtOder: [14.5506, 52.3471],
  frankfurtAirport: [8.5706, 50.0333],
  hamburg: [9.9937, 53.5511],
  aachen: [6.0839, 50.7753],
  cologne: [6.9603, 50.9375],
  padborg: [9.357, 54.826],
  copenhagen: [12.5683, 55.6761],
  copenhagenAirport: [12.6508, 55.618],
  malmo: [13.0038, 55.605],
  gothenburg: [11.9746, 57.7089],
  svinesund: [11.266, 59.091],
  oslo: [10.7522, 59.9139],
  osloAirport: [11.1004, 60.1939],
  arlanda: [17.9186, 59.6519],
  brussels: [4.3517, 50.8503],
  brusselsAirport: [4.4844, 50.9014],
  tournai: [3.388, 50.605],
  hazeldonk: [4.738, 51.55],
  schiphol: [4.7683, 52.3105],
  luxembourgAirport: [6.2044, 49.6233],
  zoufftgen: [6.133, 49.502],
  metz: [6.1757, 49.1193],

  // Poland / Belarus / Baltics / Finland
  minsk: [27.5615, 53.9045],
  brest: [23.6878, 52.0976],
  terespol: [23.616, 52.075],
  grodno: [23.8, 53.4],
  kuznica: [23.655, 53.522],
  medininkai: [25.638, 54.539],
  vilnius: [25.2797, 54.6872],
  riga: [24.1052, 56.9496],
  paternieki: [27.67, 55.823],
  daugavpils: [26.548, 55.875],
  valga: [26.0473, 57.7778],
  tallinn: [24.7536, 59.437],
  narva: [28.19, 59.379],
  ivangorod: [28.216, 59.375],
  saintPetersburg: [30.3351, 59.9311],
  murmansk: [33.0925, 68.9585],
  rajaJooseppi: [28.83, 68.476],
  nuijamaa: [28.83, 60.86],
  vyborg: [28.9, 60.7],
  helsinkiWest: [24.921, 60.151],
  helsinkiAirport: [24.9633, 60.3172],
  gulfOfFinlandMid: [24.88, 59.78],
  warsaw: [21.0122, 52.2297],
  warsawAirport: [20.9679, 52.1657],
  poznan: [16.9252, 52.4064],
  medyka: [22.93, 49.803],
  przemysl: [22.7673, 49.784],
  lviv: [24.0316, 49.8397],
  lvivAirport: [23.9561, 49.8125],
  kyiv: [30.5234, 50.4501],
  boryspil: [30.8947, 50.345],
  zhuliany: [30.4519, 50.412],
  chernivtsi: [25.935, 48.292],
  siret: [26.07, 47.953],
  gomel: [30.9754, 52.4345],
  chernihiv: [31.2849, 51.4982],
  kharkiv: [36.2304, 49.9935],
  odesa: [30.7233, 46.4825],
  bucharest: [26.1025, 44.4268],
  otopeni: [26.085, 44.5711],
  iasi: [27.6014, 47.1585],
  chisinau: [28.8638, 47.0105],
  ungheni: [27.8, 47.21],
  // Russia / Caucasus / Central Asia hubs (destination corridors)
  moscow: [37.6173, 55.7558],
  sheremetyevo: [37.4146, 55.9726],
  domodedovo: [37.9061, 55.4088],
  vnukovo: [37.2615, 55.5915],
  orenburg: [55.1019, 51.7682],
  samara: [50.1018, 53.1959],
  kazan: [49.1221, 55.7887],
  rostovOnDon: [39.7015, 47.2357],
  voronezh: [39.2003, 51.672],
  vladikavkaz: [44.6678, 43.0244],
  verkhnyLars: [44.64, 42.74],
  stepantsminda: [44.6417, 42.6575],
  yerevan: [44.5152, 40.1872],
  tashkent: [69.2401, 41.2995],
  shymkent: [69.5901, 42.3419],
  aktobe: [57.1667, 50.2833],
  astana: [71.4304, 51.1282],
  almaty: [76.8512, 43.222],
  bishkek: [74.5698, 42.8746],
  dushanbe: [68.787, 38.5598],
  beijing: [116.4074, 39.9042],

  // Cyprus / Malta / Ireland / UK air
  capeGreco: [34.075, 34.96],
  larnaca: [33.6249, 34.8751],
  ercan: [33.4961, 35.1597],
  nicosiaGreenLine: [33.3823, 35.1856],
  maltaMarsa: [14.495, 35.87],
  maltaAirport: [14.4775, 35.8575],
  dublinAirport: [-6.2701, 53.4213],
  heathrow: [-0.4543, 51.47],

  // Other air hubs
  dubai: [55.3644, 25.2532],
  abuDhabi: [54.6511, 24.433],
  addis: [38.7613, 8.9806],
  nairobi: [36.8219, -1.2921],
  niamey: [2.1833, 13.5116],
  islamabad: [73.0479, 33.6844],
  manila: [121.0198, 14.5086],
  hanoi: [105.8342, 21.0278],
  tbilisi: [44.8146, 41.7151],
  caracas: [-66.9036, 10.4806],
  bogota: [-74.0721, 4.711],
  saoPaulo: [-46.6553, -23.5505],
  praia: [-23.5133, 14.933],
  luanda: [13.2344, -8.8147],
  lisbonAirport: [-9.1359, 38.7742],
  tirana: [19.8187, 41.3275],
  mogadishu: [45.3182, 2.0469],

  // Switzerland
  como: [9.0852, 45.8081],
  chiasso: [9.031, 45.833],
  lugano: [8.9511, 46.0037],
  zurich: [8.5417, 47.3769],
  zurichAirport: [8.5493, 47.4647],
  basel: [7.5886, 47.5596],
  geneva: [6.1432, 46.2044],
  genevaAirport: [6.1092, 46.2381],
  stMargrethen: [9.638, 47.453],
  buchs: [9.469, 47.168],
  bregenz: [9.7471, 47.5031],

  // Iceland
  keflavik: [-22.6056, 63.985],
  reykjavik: [-21.8174, 64.1466],

  // Serbia / Bosnia hubs (airports + Sarajevo corridor)
  belgradeAirport: [20.3091, 44.8184],
  zenica: [17.9077, 44.2017],
  sarajevo: [18.4131, 43.8563],
  sarajevoAirport: [18.3315, 43.8246],

  // Americas — ports of entry / hubs
  mexicoCity: [-99.0721, 19.4361],
  monterrey: [-100.3161, 25.6866],
  tapachula: [-92.263, 14.903],
  guatemalaCity: [-90.5069, 14.6349],
  sanSalvador: [-89.2182, 13.6929],
  tegucigalpa: [-87.2068, 14.0723],
  managua: [-86.2514, 12.1364],
  sanJoseCr: [-84.0877, 9.9281],
  panamaCity: [-79.5199, 8.9824],
  necocli: [-76.789, 8.426],
  turbo: [-76.728, 8.095],
  medellin: [-75.5636, 6.2518],
  darienGap: [-77.55, 8.05],
  ciudadJuarez: [-106.485, 31.6904],
  elPaso: [-106.485, 31.7619],
  hidalgo: [-98.263, 26.1],
  mcallen: [-98.23, 26.2034],
  eaglePass: [-100.5134, 28.7091],
  sanYsidro: [-117.031, 32.542],
  tijuana: [-117.0382, 32.5149],
  miamiAirport: [-80.287, 25.7959],
  jfk: [-73.7781, 40.6413],
  lax: [-118.4085, 33.9416],
  houston: [-95.3414, 29.9902],
  chicagoOHare: [-87.9073, 41.9742],
  detroitWindsor: [-83.037, 42.314],
  niagaraFalls: [-79.0669, 43.0896],
  albanyNy: [-73.7562, 42.6526],
  roxham: [-73.463, 45.006],
  montreal: [-73.5673, 45.5017],
  montrealAirport: [-73.7408, 45.4706],
  toronto: [-79.3832, 43.6532],
  torontoPearson: [-79.6306, 43.6777],
  vancouver: [-123.1207, 49.2827],
  vancouverAirport: [-123.184, 49.1947],
  delhi: [77.1025, 28.5562],
  havana: [-82.3666, 23.1136],
  portAuPrince: [-72.3074, 18.5944],
  keyWest: [-81.78, 24.5551],
  nassau: [-77.3554, 25.0443],
  floridaStraitsMid: [-81.2, 24.2],
  caribbeanMid: [-75.5, 22.5],
  piedrasNegras: [-100.515, 28.7],
  laredo: [-99.5075, 27.5064],
  nuevoLaredo: [-99.5167, 27.4767],
  tiranaLand: [19.8187, 41.3275],
  shkoder: [19.5186, 42.0683],
  podgorica: [19.2624, 42.4304],

  // India — departure regions behind the largest single non-EU migration flow.
  // `delhi` above is the shared IGI departure point; these are the other documented
  // sending hubs (Punjab/Doab for farm labour, the southern IT and nursing belts).
  mumbai: [72.8777, 19.076],
  amritsar: [74.8723, 31.634],
  jalandhar: [75.5762, 31.326],
  chandigarh: [76.7794, 30.7333],
  ahmedabad: [72.5714, 23.0225],
  hyderabad: [78.4867, 17.385],
  bengaluru: [77.5946, 12.9716],
  chennai: [80.2707, 13.0827],
  kochi: [76.2673, 9.9312],
  kolkata: [88.3639, 22.5726],

  // Gulf air hub used by most India → Europe itineraries alongside dubai / abuDhabi
  doha: [51.531, 25.286],

  // Arrival airports for destinations that previously had no air corridor
  sofiaAirport: [23.4114, 42.6952],
  zagrebAirport: [16.0688, 45.7429],
  tallinnAirport: [24.7986, 59.4133],
  rigaAirport: [23.9711, 56.9236],
  vilniusAirport: [25.2858, 54.6341],
  bratislavaAirport: [17.2127, 48.1702],
  ljubljanaAirport: [14.4576, 46.2237],
  milanMalpensa: [8.7281, 45.6306],
  munichAirport: [11.7861, 48.3538],

  // Pakistan — departure hubs and the Balochistan / Iran overland staging points.
  // `islamabad` above is the shared air departure point.
  karachi: [67.0011, 24.8607],
  lahore: [74.3436, 31.5497],
  mirpur: [73.7517, 33.1487],
  sialkot: [74.5229, 32.4945],
  peshawar: [71.5785, 34.0151],
  quetta: [67.0011, 30.1798],
  taftan: [61.5833, 28.95],
  zahedan: [60.8629, 29.4963],
  kerman: [57.0788, 30.2839],

  // Documented South Asian labour clusters reached overland from the airport of entry
  latina: [12.9033, 41.4676],
  manolada: [21.3667, 38.0333],
  odemira: [-8.6417, 37.598],
  birmingham: [-1.8904, 52.4862],

  // Pylos maritime approach — the Adriana sinking (June 2023) put this stretch on the
  // Libya → Italy track used from Tobruk by Pakistani and Egyptian passengers.
  pylos: [21.6959, 36.9139],

  // Additional US ports of entry for South Asian corridors
  sfo: [-122.379, 37.6213],
  newark: [-74.1687, 40.6895],
} as const satisfies Record<string, MigrationCoordinate>;

// --- Reusable path segments ------------------------------------------------

export const PATH = {
  nigeriaToTripoli: [
    P.lagos,
    P.kano,
    P.zinder,
    P.agadez,
    P.dirkou,
    P.madama,
    P.alQatrun,
    P.sabha,
    P.baniWalid,
    P.tripoli,
  ] as const,

  sudanToBenghazi: [
    P.khartoum,
    P.dongola,
    P.alKufra,
    P.ajdabiya,
    P.benghazi,
  ] as const,

  eritreaToTripoli: [
    P.asmara,
    P.khartoum,
    P.dongola,
    P.alKufra,
    P.ajdabiya,
    P.sabha,
    P.baniWalid,
    P.tripoli,
  ] as const,

  eritreaToTripoliViaFasher: [
    P.asmara,
    P.khartoum,
    P.elFasher,
    P.faya,
    P.alKufra,
    P.ajdabiya,
    P.sabha,
    P.baniWalid,
    P.tripoli,
  ] as const,

  cairoToBenghazi: [P.cairo, P.marsaMatruh, P.sollum, P.tobruk, P.benghazi] as const,

  // Sea: western Libya → Lampedusa (stay over water)
  tripoliToLampedusaSea: [
    P.tripoli,
    [12.85, 33.7] as MigrationCoordinate,
    [12.7, 34.5] as MigrationCoordinate,
    P.lampedusa,
  ] as const,

  zuwaraToLampedusaSea: [
    P.zuwara,
    [12.4, 33.8] as MigrationCoordinate,
    [12.55, 34.6] as MigrationCoordinate,
    P.lampedusa,
  ] as const,

  // Sea: Lampedusa → Sicily disembarkation (Porto Empedocle / Augusta arc)
  lampedusaToPortoEmpedocleSea: [
    P.lampedusa,
    [12.95, 36.2] as MigrationCoordinate,
    [13.3, 36.85] as MigrationCoordinate,
    P.portoEmpedocle,
  ] as const,

  lampedusaToAugustaSea: [
    P.lampedusa,
    [13.4, 36.1] as MigrationCoordinate,
    [14.4, 36.55] as MigrationCoordinate,
    P.pozzoallo,
    P.augusta,
  ] as const,

  benghaziToAugustaSea: [
    P.benghazi,
    [19.0, 33.6] as MigrationCoordinate,
    [17.6, 34.9] as MigrationCoordinate,
    [16.4, 36.1] as MigrationCoordinate,
    P.augusta,
  ] as const,

  tobrukToCreteSea: [
    P.tobruk,
    [24.2, 33.3] as MigrationCoordinate,
    [24.7, 34.2] as MigrationCoordinate,
    [25.0, 34.8] as MigrationCoordinate,
    P.heraklion,
  ] as const,

  sfaxToLampedusaSea: [
    P.sfax,
    P.kerkennahOffshore,
    [11.55, 35.15] as MigrationCoordinate,
    [12.05, 35.35] as MigrationCoordinate,
    P.lampedusa,
  ] as const,

  sfaxToMaltaSea: [
    P.sfax,
    [11.8, 35.05] as MigrationCoordinate,
    [12.9, 35.35] as MigrationCoordinate,
    [13.8, 35.55] as MigrationCoordinate,
    P.maltaMarsa,
  ] as const,

  tripoliToMaltaSea: [
    P.tripoli,
    [13.5, 33.9] as MigrationCoordinate,
    [14.0, 34.8] as MigrationCoordinate,
    [14.3, 35.4] as MigrationCoordinate,
    P.maltaMarsa,
  ] as const,

  benghaziToMaltaSea: [
    P.benghazi,
    [17.5, 33.8] as MigrationCoordinate,
    [15.8, 34.8] as MigrationCoordinate,
    [14.9, 35.4] as MigrationCoordinate,
    P.maltaMarsa,
  ] as const,

  annabaToSardiniaSea: [
    P.annaba,
    [8.05, 37.6] as MigrationCoordinate,
    [8.25, 38.3] as MigrationCoordinate,
    P.santAntioco,
  ] as const,

  // Messina Strait hop
  messinaStrait: [P.messina, P.villaSanGiovanni] as const,

  italySicilyToRome: [P.augusta, P.catania, P.messina, P.villaSanGiovanni, P.naples, P.rome] as const,

  italyPortoEmpedocleToRome: [
    P.portoEmpedocle,
    P.catania,
    P.messina,
    P.villaSanGiovanni,
    P.naples,
    P.rome,
  ] as const,

  italyRomeToMenton: [P.rome, P.florence, P.bologna, P.milan, P.genoa, P.ventimiglia, P.menton] as const,

  italyRomeToMontgenevre: [P.rome, P.florence, P.bologna, P.milan, P.turin, P.oulx, P.montgenevre] as const,

  italyRomeToBrenner: [P.rome, P.florence, P.bologna, P.brenner, P.innsbruck] as const,

  // Western Balkans: Greece → Serbia (Idomeni / Preševo corridor)
  thessalonikiToBelgrade: [
    P.thessaloniki,
    P.idomeni,
    P.gevgelija,
    P.skopje,
    P.presevo,
    P.nis,
    P.belgrade,
  ] as const,

  // Evros approach into Greece then west
  istanbulToThessaloniki: [
    P.istanbul,
    P.edirne,
    P.orestiada,
    P.alexandroupoli,
    P.kavala,
    P.thessaloniki,
  ] as const,

  belgradeToRoszke: [P.belgrade, P.noviSad, P.subotica, P.horgos, P.roszke] as const,

  belgradeToBajakovo: [P.belgrade, P.sid, P.bajakovo] as const,

  belgradeToBihac: [P.belgrade, P.loznica, P.tuzla, P.banjaLuka, P.bihac] as const,

  bihacToZagreb: [P.bihac, P.velikaKladusa, P.maljevac, P.karlovac, P.zagreb] as const,

  bajakovoToZagreb: [P.bajakovo, P.vinkovci, P.zagreb] as const,

  zagrebToTrieste: [P.zagreb, P.ljubljana, P.postojna, P.sezana, P.trieste] as const,

  zagrebToSpielfeld: [P.zagreb, P.maribor, P.spielfeld] as const,

  zagrebToObrezje: [P.zagreb, P.obrezje] as const,

  roszkeToBudapest: [P.roszke, P.szeged, P.budapest] as const,

  budapestToNickelsdorf: [P.budapest, P.gyor, P.hegyeshalom, P.nickelsdorf] as const,

  budapestToVienna: [P.budapest, P.gyor, P.hegyeshalom, P.nickelsdorf, P.vienna] as const,

  budapestToCunovo: [P.budapest, P.cunovo] as const,

  // Syria / Afghanistan land approaches to Istanbul
  damascusToIstanbul: [P.damascus, P.gaziantep, P.ankara, P.istanbul] as const,

  aleppoToIzmir: [P.aleppo, [36.1572, 36.2021] as MigrationCoordinate, P.gaziantep, P.ankara, P.izmir] as const,

  kabulToIstanbul: [P.kabul, P.herat, P.mashhad, P.tehran, P.tabriz, P.van, P.ankara, P.istanbul] as const,

  baghdadToIstanbul: [P.baghdad, P.gaziantep, P.ankara, P.istanbul] as const,

  tehranToIstanbul: [P.tehran, P.tabriz, P.van, P.ankara, P.istanbul] as const,

  // Bulgaria Kapitan Andreevo
  istanbulToKapitanAndreevo: [P.istanbul, P.edirne, P.kapitanAndreevo] as const,

  kapitanAndreevoToSofiaToGiurgiu: [
    P.kapitanAndreevo,
    P.plovdiv,
    P.sofia,
    P.ruse,
    P.giurgiu,
  ] as const,

  // Spain / Maghreb
  bamakoToOran: [P.bamako, P.gao, P.tamanrasset, P.inSalah, P.ghardaia, P.oran] as const,

  oranToAlmeriaSea: [
    P.oran,
    [-1.2, 36.05] as MigrationCoordinate,
    [-1.9, 36.45] as MigrationCoordinate,
    P.almeria,
  ] as const,

  dakarToTangier: [
    P.dakar,
    P.saintLouis,
    P.nouakchott,
    P.nouadhibou,
    P.laayoune,
    P.agadir,
    P.marrakech,
    P.rabat,
    P.tangier,
  ] as const,

  tangierToAlgecirasSea: [P.tangier, P.straitMid, P.algeciras] as const,

  almeriaToCerbere: [
    P.almeria,
    P.granada,
    P.madrid,
    P.zaragoza,
    P.barcelona,
    P.girona,
    P.figueres,
    P.cerbere,
  ] as const,

  algecirasToHendaye: [
    P.algeciras,
    P.malaga,
    P.cordoba,
    P.madrid,
    P.burgos,
    P.vitoria,
    P.sanSebastian,
    P.hendaye,
  ] as const,

  algecirasToBarcelona: [
    P.algeciras,
    P.malaga,
    P.cordoba,
    P.madrid,
    P.zaragoza,
    P.barcelona,
  ] as const,

  atlanticCanaries: [
    P.dakar,
    P.saintLouis,
    P.nouakchott,
    P.dakhla,
    [-16.8, 24.8] as MigrationCoordinate,
    [-17.5, 26.2] as MigrationCoordinate,
    P.elHierro,
  ] as const,

  // Atlantic / Canaries densification (Frontex West African Atlantic route)
  nouadhibouToLasPalmasSea: [
    P.nouadhibou,
    [-16.9, 22.4] as MigrationCoordinate,
    [-16.6, 24.5] as MigrationCoordinate,
    [-16.1, 26.3] as MigrationCoordinate,
    [-15.7, 27.4] as MigrationCoordinate,
    P.lasPalmas,
  ] as const,

  laayouneToLanzaroteSea: [
    P.laayoune,
    P.tanTan,
    [-12.4, 28.1] as MigrationCoordinate,
    [-13.0, 28.55] as MigrationCoordinate,
    P.lanzarote,
  ] as const,

  conakryToElHierroSea: [
    P.conakry,
    P.bissau,
    P.dakar,
    P.saintLouis,
    [-16.6, 18.5] as MigrationCoordinate,
    [-17.2, 22.0] as MigrationCoordinate,
    [-17.6, 25.0] as MigrationCoordinate,
    [-17.9, 26.8] as MigrationCoordinate,
    P.elHierro,
  ] as const,

  // Western Med Alboran / Levantine Spanish coast
  nadorToAlmeriaSea: [
    P.nador,
    [-2.6, 35.55] as MigrationCoordinate,
    [-2.55, 36.15] as MigrationCoordinate,
    P.almeria,
  ] as const,

  oranToCartagenaSea: [
    P.oran,
    [-0.9, 36.3] as MigrationCoordinate,
    [-0.95, 36.95] as MigrationCoordinate,
    P.cartagenaEs,
  ] as const,

  // Central Med densification
  sfaxToPozzalloSea: [
    P.sfax,
    P.kerkennahOffshore,
    [12.0, 35.4] as MigrationCoordinate,
    [13.2, 35.9] as MigrationCoordinate,
    [14.2, 36.35] as MigrationCoordinate,
    P.pozzoallo,
  ] as const,

  zuwaraToCalabriaSea: [
    P.zuwara,
    [13.2, 34.0] as MigrationCoordinate,
    [14.0, 35.2] as MigrationCoordinate,
    [15.2, 36.6] as MigrationCoordinate,
    [15.9, 37.8] as MigrationCoordinate,
    P.calabriaCoast,
    P.reggioCalabria,
  ] as const,

  // Channel
  parisToCalais: [P.paris, P.lille, P.calais] as const,

  parisToDunkirk: [P.paris, P.lille, P.dunkirk] as const,

  calaisToDoverSea: [P.calais, P.channelMidCalais, P.dover] as const,

  dunkirkToDoverSea: [P.dunkirk, P.channelMidDunkirk, P.dover] as const,

  // Menton / Italy → Paris → Channel
  mentonToParis: [P.menton, P.lyon, P.paris] as const,

  triesteToMenton: [P.trieste, P.milan, P.genoa, P.ventimiglia, P.menton] as const,

  // Germany approaches
  viennaToFreilassing: [P.vienna, P.salzburg, P.freilassing] as const,

  viennaToPassau: [P.vienna, P.linz, P.passau] as const,

  innsbruckToKiefersfelden: [P.innsbruck, P.kiefersfelden] as const,

  // Belarus land approaches
  minskToTerespol: [P.minsk, P.brest, P.terespol] as const,

  minskToKuznica: [P.minsk, P.grodno, P.kuznica] as const,

  minskToMedininkai: [P.minsk, [26.05, 54.3] as MigrationCoordinate, P.medininkai] as const,

  minskToPaternieki: [P.minsk, P.daugavpils, P.paternieki] as const,

  // Ukraine TPD corridors (outbound toward EU)
  lvivToMedyka: [P.lviv, P.przemysl, P.medyka] as const,

  medykaToWarsaw: [P.medyka, P.warsaw] as const,

  warsawToFrankfurtOder: [P.warsaw, P.poznan, P.frankfurtOder] as const,

  // Ukraine inbound — reverse of western TPD POEs (pendular / return mobility)
  medykaToLviv: [P.medyka, P.przemysl, P.lviv] as const,

  warsawToMedyka: [P.warsaw, P.medyka] as const,

  frankfurtOderToWarsaw: [P.frankfurtOder, P.poznan, P.warsaw] as const,

  lvivToKyiv: [
    P.lviv,
    [26.25, 50.62] as MigrationCoordinate, // Rivne
    [28.66, 50.25] as MigrationCoordinate, // Zhytomyr
    P.kyiv,
  ] as const,

  siretToChernivtsi: [P.siret, P.chernivtsi] as const,

  zahonyToUzhhorod: [P.zahony, P.chop, P.uzhhorod] as const,

  vysneNemeckeToUzhhorod: [P.vysneNemecke, P.uzhhorod] as const,

  chisinauToKyiv: [
    P.chisinau,
    P.ungheni,
    [28.48, 49.23] as MigrationCoordinate, // Vinnytsia corridor
    P.kyiv,
  ] as const,

  // Limited northern approaches (not a mass irregular inflow; western POEs dominate returns)
  minskToKyivNorth: [P.minsk, P.gomel, P.chernihiv, P.kyiv] as const,

  // Russia — Central Asia land labor densification (via Kazakhstan hubs → Orenburg → Volga → Moscow)
  tashkentToMoscowLand: [
    P.tashkent,
    P.shymkent,
    P.aktobe,
    P.orenburg,
    P.samara,
    P.kazan,
    P.moscow,
  ] as const,

  astanaToMoscowLand: [P.astana, P.orenburg, P.samara, P.kazan, P.moscow] as const,

  bishkekToMoscowLand: [
    P.bishkek,
    P.almaty,
    P.astana,
    P.orenburg,
    P.samara,
    P.moscow,
  ] as const,

  // Russia — Caucasus land via Verkhny Lars (only open GEO–RUS road POE) → Vladikavkaz → Moscow
  tbilisiToVladikavkaz: [
    P.tbilisi,
    P.stepantsminda,
    P.verkhnyLars,
    P.vladikavkaz,
  ] as const,

  vladikavkazToMoscow: [
    P.vladikavkaz,
    P.rostovOnDon,
    P.voronezh,
    P.moscow,
  ] as const,

  // Lebanon / Cyprus sea
  tripoliLebToCapeGrecoSea: [
    P.tripoliLeb,
    [34.85, 34.62] as MigrationCoordinate,
    [34.3, 34.8] as MigrationCoordinate,
    P.capeGreco,
  ] as const,

  latakiaToCapeGrecoSea: [
    P.latakia,
    [34.9, 35.0] as MigrationCoordinate,
    [34.4, 34.85] as MigrationCoordinate,
    P.capeGreco,
  ] as const,

  // Aegean short hops (over water)
  izmirToLesbosSea: [
    P.izmir,
    P.dikili,
    [26.75, 38.85] as MigrationCoordinate,
    P.mytilene,
  ] as const,

  izmirToChiosSea: [
    P.izmir,
    P.cesme,
    [26.4, 38.3] as MigrationCoordinate,
    P.chios,
  ] as const,

  izmirToSamosSea: [
    P.izmir,
    P.kusadasi,
    [27.1, 37.85] as MigrationCoordinate,
    P.samos,
  ] as const,

  durresToBariSea: [P.durres, P.adriaticMid, P.bari] as const,

  // Northbound Germany / Denmark / Sweden / Norway
  munichToPadborg: [P.munich, P.nuremberg, P.hamburg, P.padborg] as const,

  padborgToMalmo: [P.padborg, P.copenhagen, P.malmo] as const,

  freilassingToMunich: [P.freilassing, P.munich] as const,

  malmoToOslo: [P.malmo, P.gothenburg, P.svinesund, P.oslo] as const,

  padborgToOslo: [P.padborg, P.copenhagen, P.malmo, P.gothenburg, P.svinesund, P.oslo] as const,

  // Switzerland approaches
  milanToChiasso: [P.milan, P.como, P.chiasso] as const,

  romeToChiasso: [P.rome, P.florence, P.bologna, P.milan, P.como, P.chiasso] as const,

  viennaToBasel: [
    P.vienna,
    P.salzburg,
    P.innsbruck,
    P.bregenz,
    P.stMargrethen,
    P.zurich,
    P.basel,
  ] as const,

  viennaToZurich: [
    P.vienna,
    P.salzburg,
    P.innsbruck,
    P.bregenz,
    P.stMargrethen,
    P.zurich,
  ] as const,

  lyonToGeneva: [P.lyon, P.geneva] as const,

  mentonToGeneva: [P.menton, P.lyon, P.geneva] as const,

  // Bosnia interior
  belgradeToSarajevo: [P.belgrade, P.loznica, P.tuzla, P.zenica, P.sarajevo] as const,

  // Americas land / corridor densification
  necocliToTapachula: [
    P.necocli,
    P.turbo,
    P.darienGap,
    P.panamaCity,
    P.sanJoseCr,
    P.managua,
    P.tegucigalpa,
    P.sanSalvador,
    P.guatemalaCity,
    P.tapachula,
  ] as const,

  tapachulaToElPaso: [
    P.tapachula,
    P.mexicoCity,
    P.monterrey,
    P.ciudadJuarez,
    P.elPaso,
  ] as const,

  tapachulaToSanYsidro: [
    P.tapachula,
    P.mexicoCity,
    [-110.97, 29.1] as MigrationCoordinate,
    P.tijuana,
    P.sanYsidro,
  ] as const,

  tapachulaToMcAllen: [
    P.tapachula,
    P.mexicoCity,
    P.monterrey,
    P.mcallen,
    P.hidalgo,
  ] as const,

  elPasoToRoxham: [
    P.elPaso,
    P.houston,
    P.chicagoOHare,
    P.detroitWindsor,
    P.niagaraFalls,
    P.albanyNy,
    P.roxham,
  ] as const,

  miamiToRoxham: [P.miamiAirport, P.albanyNy, P.roxham] as const,

  jfkToRoxham: [P.jfk, P.albanyNy, P.roxham] as const,

  roxhamToMontreal: [P.roxham, P.montreal] as const,

  bogotaToNecocli: [P.bogota, P.medellin, P.necocli] as const,

  // US southern maritime (CBP / USCG documented Florida Straits & Caribbean approaches)
  cubaToKeyWestSea: [
    P.havana,
    P.floridaStraitsMid,
    P.keyWest,
  ] as const,

  haitiToFloridaSea: [
    P.portAuPrince,
    [-74.2, 20.2] as MigrationCoordinate,
    P.caribbeanMid,
    P.nassau,
    [-79.5, 25.2] as MigrationCoordinate,
    P.miamiAirport,
  ] as const,

  mexicoToLaredoLand: [
    P.mexicoCity,
    P.monterrey,
    P.nuevoLaredo,
    P.laredo,
  ] as const,

  mexicoToPiedrasNegrasLand: [
    P.mexicoCity,
    P.monterrey,
    P.piedrasNegras,
    P.eaglePass,
  ] as const,

  // Albania → Western Balkans → Italy → France Channel approach
  tiranaToBelgradeLand: [
    P.tiranaLand,
    P.shkoder,
    P.podgorica,
    [19.5, 43.0] as MigrationCoordinate, // northern Montenegro / Sandžak approach
    P.noviSad,
    P.belgrade,
  ] as const,

  // Italy alpine secondary (Briançon / Montgenèvre approach densification)
  milanToBriancon: [P.milan, P.turin, P.oulx, P.montgenevre, P.briancon] as const,

  // India → Belgrade air hop. Serbia's visa-free regime for Indian nationals (2017
  // until its suspension on 1 January 2023) put India among the top nationalities
  // Frontex detected on the Western Balkans route; onward legs reuse the existing
  // belgradeTo* segments below.
  delhiToBelgradeAir: [P.delhi, P.dubai, P.belgradeAirport] as const,

  belgradeAirportToBelgrade: [P.belgradeAirport, P.belgrade] as const,

  // Airport-of-entry → documented Indian labour cluster
  fiumicinoToLatina: [P.fiumicino, P.latina] as const,

  athensToManolada: [P.athensAirport, P.manolada] as const,

  lisbonToOdemira: [P.lisbonAirport, P.odemira] as const,

  heathrowToBirmingham: [P.heathrow, P.birmingham] as const,

  // Pakistan overland staging to Türkiye: Balochistan → the Taftan/Mirjaveh crossing →
  // Iranian plateau, joining tehranToIstanbul at Tehran.
  pakistanToTehranLand: [
    P.karachi,
    P.quetta,
    P.taftan,
    P.zahedan,
    P.kerman,
    P.tehran,
  ] as const,

  // Eastern Libya → the Pylos approach on the Tobruk departure track
  tobrukToPylosSea: [
    P.tobruk,
    [22.6, 33.2] as MigrationCoordinate,
    [22.0, 34.6] as MigrationCoordinate,
    [21.8, 35.8] as MigrationCoordinate,
    P.pylos,
  ] as const,

  // Canada → US northern-border approach (documented South Asian northern-border cases)
  torontoToNiagara: [P.torontoPearson, P.toronto, P.niagaraFalls] as const,
} as const;
