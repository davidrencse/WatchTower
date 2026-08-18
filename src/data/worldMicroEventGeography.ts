import type { WorldMicroEvent, WorldMicroEventPrecision } from './worldMicroEvents';

type GeographyOverride = {
  coordinate: readonly [longitude: number, latitude: number];
  precision?: WorldMicroEventPrecision;
  place?: string;
};

/**
 * European imported places that previously inherited their country's capital coordinate.
 * Settlement and region anchors were resolved against OpenStreetMap through Photon. Capital-city
 * entries preserve `national` precision; a capital can be the correct administrative anchor.
 */
const EUROPEAN_PLACE_OVERRIDES: Readonly<Record<string, GeographyOverride>> = {
  'Andalusia, Spain': { coordinate: [-4.5811614, 37.3399964], precision: 'area' },
  'Aude, France': { coordinate: [2.5124715, 43.0542733], precision: 'area' },
  'Avdiivka, Ukraine': { coordinate: [37.7466719, 48.1338824], precision: 'city' },
  'Baden-Wurttemberg, Germany': { coordinate: [9.041169, 48.53775], precision: 'area' },
  'Bakhmut, Ukraine': { coordinate: [38.0020994, 48.5894123], precision: 'city' },
  'Barajevo, Serbia': { coordinate: [20.4160478, 44.578035], precision: 'city' },
  'Belgorod, Russia': { coordinate: [36.5873394, 50.5955595], precision: 'city' },
  'Besancon, France': { coordinate: [6.0243622, 47.2380222], precision: 'city' },
  'Blatten, Switzerland': { coordinate: [7.8568832, 46.4435566], precision: 'city' },
  'Bologna, Italy': { coordinate: [11.3426327, 44.4938203], precision: 'city' },
  'Bratislava, Slovakia': { coordinate: [17.1077, 48.1486] },
  'Brno, Czech Republic': { coordinate: [16.6068, 49.1951], precision: 'city' },
  'Brussels, Belgium': { coordinate: [4.352493, 50.8467372] },
  'Bucharest, Romania': { coordinate: [26.102684, 44.4361414] },
  'Budapest, Hungary': { coordinate: [19.0402, 47.4979] },
  'Canary Islands, Spain': { coordinate: [-16.6214471, 28.2935785], precision: 'area' },
  'Cetinje, Montenegro': { coordinate: [18.9246085, 42.389633], precision: 'city' },
  'Chasiv Yar, Ukraine': { coordinate: [37.8373367, 48.5873911], precision: 'city' },
  'Chernobyl, Ukraine': { coordinate: [29.8984972, 51.3076238], precision: 'area' },
  'Chișinău, Moldova': { coordinate: [28.8322923, 47.0245117] },
  'Crete, Greece': { coordinate: [24.4633423, 35.3084952], precision: 'area' },
  'Dagestan, Russia': { coordinate: [47, 43], precision: 'area' },
  'Dobropillia, Ukraine': { coordinate: [37.0903243, 48.4683035], precision: 'city' },
  'Dresden, Germany': { coordinate: [13.7381437, 51.0493286], precision: 'city' },
  'Edinburgh, UK': { coordinate: [-3.1883, 55.9533], precision: 'city' },
  'Emilia-Romagna, Italy': { coordinate: [11.039437, 44.525696], precision: 'area' },
  'Engels, Russia': { coordinate: [46.1233093, 51.5013775], precision: 'city' },
  'Evros, Greece': { coordinate: [25.5713487, 40.4509174], precision: 'area' },
  'Geneva, Switzerland': { coordinate: [6.1466014, 46.2017559] },
  'Grindavik, Iceland': { coordinate: [-22.4317498, 63.844239], precision: 'city' },
  'Huntingdon, UK': { coordinate: [-0.1865, 52.3315], precision: 'city' },
  'Irkutsk, Russia': { coordinate: [104.279829, 52.2891225], precision: 'city' },
  'Izhevsk, Russia': { coordinate: [53.1977307, 56.8605175], precision: 'city' },
  'Kabardino-Balkaria, Russia': { coordinate: [43.4204809, 43.4428286], precision: 'area' },
  'Kamchatka, Russia': { coordinate: [160.0383819, 57.1914882], precision: 'area' },
  'Kemerovo, Russia': { coordinate: [86.0871213, 55.3550907], precision: 'city' },
  'Konin, Poland': { coordinate: [18.2678662, 52.2559021], precision: 'city' },
  'Kramatorsk, Ukraine': { coordinate: [37.5843812, 48.7389415], precision: 'city' },
  'Kryvyi Rih, Ukraine': { coordinate: [33.3917703, 47.9102734], precision: 'city' },
  'Lesbos, Greece': { coordinate: [25.9989135, 39.1758419], precision: 'area' },
  'Lombardy, Italy': { coordinate: [9.7732524, 45.5703694], precision: 'area' },
  'London, United Kingdom': { coordinate: [-0.1277653, 51.5074456] },
  'Makiivka, Ukraine': { coordinate: [37.9635093, 48.0448144], precision: 'city' },
  'Mannheim, Germany': { coordinate: [8.4673098, 49.4892913], precision: 'city' },
  'Mladenovac, Serbia': { coordinate: [20.6941535, 44.4401166], precision: 'city' },
  'Morozovsk, Russia': { coordinate: [41.828762, 48.352379], precision: 'city' },
  'Moscow, Russia': { coordinate: [37.6173, 55.7558] },
  'Murcia, Spain': { coordinate: [-1.1305431, 37.9923795], precision: 'city' },
  'Nikopol, Ukraine': { coordinate: [34.3917272, 47.5692061], precision: 'city' },
  'Nizhny Novgorod, Russia': { coordinate: [44.0051395, 56.3264816], precision: 'city' },
  'Novosibirsk, Russia': { coordinate: [82.9226887, 55.0288307], precision: 'city' },
  'Orebro, Sweden': { coordinate: [15.2151181, 59.2747287], precision: 'city' },
  'Orenburg, Russia': { coordinate: [55.0978517, 51.7671248], precision: 'city' },
  'Palermo, Italy': { coordinate: [13.3524434, 38.1112268], precision: 'city' },
  'Pardubice, Czech Republic': { coordinate: [15.785043, 50.0244211], precision: 'city' },
  'Paris, France': { coordinate: [2.3483915, 48.8534951] },
  'Pavlohrad, Ukraine': { coordinate: [35.8703695, 48.5316759], precision: 'city' },
  'Pokrovsk, Ukraine': { coordinate: [37.1772482, 48.2771086], precision: 'city' },
  'Poltava, Ukraine': { coordinate: [34.5507948, 49.5897423], precision: 'city' },
  'Primorsk, Russia': { coordinate: [28.616673, 60.366665], precision: 'city' },
  'Pryluky, Ukraine': { coordinate: [32.3866658, 50.5950864], precision: 'city' },
  'Radom, Poland': { coordinate: [21.1607392, 51.416727], precision: 'city' },
  'Ratingen, Germany': { coordinate: [6.8493503, 51.2973261], precision: 'city' },
  'Ryazan, Russia': { coordinate: [39.7425039, 54.6295687], precision: 'city' },
  'Salisbury, UK': { coordinate: [-1.7957, 51.0688], precision: 'city' },
  'Santorini, Greece': { coordinate: [25.4566637, 36.4071112], precision: 'area' },
  'Saxony, Germany': { coordinate: [13.4585052, 50.9295798], precision: 'area' },
  'Serres, Greece': { coordinate: [23.5498031, 41.0910711], precision: 'city' },
  'Sindelfingen, Germany': { coordinate: [9.0035455, 48.7084162], precision: 'city' },
  'Sochi, Russia': { coordinate: [39.723109, 43.5854823], precision: 'city' },
  'Sofia, Bulgaria': { coordinate: [23.3217359, 42.6977028] },
  'Soledar, Ukraine': { coordinate: [38.0671791, 48.6956698], precision: 'city' },
  'Sumy, Ukraine': { coordinate: [34.8027723, 50.9119775], precision: 'city' },
  'Sunderland, UK': { coordinate: [-1.3822, 54.9069], precision: 'city' },
  'Synelnykove, Ukraine': { coordinate: [35.5246984, 48.3269304], precision: 'city' },
  'Tampere, Finland': { coordinate: [23.7616335, 61.4977988], precision: 'city' },
  'Tatarstan, Russia': { coordinate: [50.4763591, 55.448217], precision: 'area' },
  'Ternopil, Ukraine': { coordinate: [25.5923753, 49.5557908], precision: 'city' },
  'Thessaly, Greece': { coordinate: [22.3191881, 39.5060878], precision: 'area' },
  'Tivoli, Italy': { coordinate: [12.798884, 41.960922], precision: 'city' },
  'Tuscany, Italy': { coordinate: [11.1389204, 43.4586541], precision: 'area' },
  'Tuzla, Bosnia and Herzegovina': { coordinate: [18.6749337, 44.539298], precision: 'city' },
  'Venice, Italy': { coordinate: [12.3345898, 45.4371908], precision: 'city' },
  'Vienna, Austria': { coordinate: [16.3725042, 48.2083537] },
  'Vilnius, Lithuania': { coordinate: [25.2829111, 54.6870458] },
  'Warsaw, Poland': { coordinate: [21.0067249, 52.2319581] },
};

/** Imported country-only records whose report still identifies a defensible site or impact area. */
const EUROPEAN_EVENT_OVERRIDES: Readonly<Record<string, GeographyOverride>> = {
  'wme-2025-03-05-a-bridge-collapse-on-the': { coordinate: [4.1872, 50.4748], precision: 'city', place: 'La Louvière, Belgium' },
  'wme-2025-04-04-death-toll-from-the-kocani': { coordinate: [22.4128, 41.9164], precision: 'city', place: 'Kočani, North Macedonia' },
  'wme-2025-03-16-a-nightclub-fire-in-kocani': { coordinate: [22.4128, 41.9164], precision: 'city', place: 'Kočani, North Macedonia' },
  'wme-2025-10-04-at-least-two-killed-as': { coordinate: [2.8, 50.2], precision: 'area', place: 'Northern France' },
  'wme-2025-10-04-man-killed-and-hundreds-of': { coordinate: [-8.1, 53.4], precision: 'area', place: 'Ireland · Storm Amy impact area' },
  'wme-2025-11-01-an-avalanche-in-the-ortler': { coordinate: [10.544, 46.51], precision: 'area', place: 'Ortler Alps, Italy' },
  'wme-2025-11-20-two-trains-collide-near-ceske': { coordinate: [14.4747, 48.9745], precision: 'city', place: 'České Budějovice, Czech Republic' },
  'wme-2025-10-28-the-government-culls-500-000': { coordinate: [10.4515, 51.1657], precision: 'area', place: 'Germany · distributed outbreak area' },
  'wme-2025-04-28-a-widespread-power-outage-shuts': { coordinate: [-3.5, 40], precision: 'area', place: 'Iberian Peninsula' },
  'wme-2025-07-28-three-killed-and-hundreds-evacuated': { coordinate: [26.25, 47.45], precision: 'area', place: 'Northeastern Romania' },
  'wme-2025-01-09-a-snowstorm-in-northern-france': { coordinate: [2.8, 50.25], precision: 'area', place: 'Northern France' },
  'wme-2025-03-30-a-german-spectrum-orbital-rocket': { coordinate: [15.6469, 69.2944], precision: 'area', place: 'Andøya Spaceport, Norway' },
  'wme-2024-01-04-a-hospital-fire-in-uelzen': { coordinate: [10.5586, 52.9658], precision: 'city', place: 'Uelzen, Germany' },
  'wme-2024-04-02-a-student-is-killed-in': { coordinate: [25.0409, 60.2941], precision: 'city', place: 'Vantaa, Finland' },
  'wme-2024-08-06-a-hotel-collapse-in-krov': { coordinate: [7.0862, 49.9786], precision: 'city', place: 'Kröv, Germany' },
  'wme-2024-10-04-sixteen-people-are-killed-in': { coordinate: [17.7617, 43.6603], precision: 'area', place: 'Jablanica, Bosnia and Herzegovina' },
  'wme-2024-12-06-storm-darragh-prepares-to-make': { coordinate: [-4.5, 52.2], precision: 'area', place: 'Western United Kingdom · Storm Darragh impact area' },
  'wme-2023-02-08-munster-technological-university-confirms-a': { coordinate: [-8.5332, 51.886], precision: 'city', place: 'Cork, Ireland' },
  'wme-2023-02-05-a-series-of-avalanches-in': { coordinate: [10.35, 47.15], precision: 'area', place: 'Eastern Alps · Austria–Switzerland' },
  'wme-2023-04-09-an-avalanche-near-mont-blanc': { coordinate: [6.8652, 45.8326], precision: 'area', place: 'Mont Blanc massif, France' },
  'wme-2023-07-01-riots-continue-across-france-with': { coordinate: [2.206, 48.8924], precision: 'area', place: 'Nanterre and Île-de-France, France' },
  'wme-2023-08-04-three-people-are-killed-in': { coordinate: [14.7, 46.25], precision: 'area', place: 'Northern Slovenia flood zone' },
  'wme-2023-08-09-a-guesthouse-fire-in-wintzenheim': { coordinate: [7.2901, 48.0727], precision: 'city', place: 'Wintzenheim, France' },
  'wme-2023-09-04-floods-kill-five-people-in': { coordinate: [-3.8, 39.9], precision: 'area', place: 'Central Spain flood zone' },
  'wme-2023-09-05-the-world-s-longest-submarine': { coordinate: [-0.289, 52.984], precision: 'area', place: 'Viking Link converter · Bicker Fen, UK' },
  'wme-2023-11-02-storm-ciaran-kills-six-people': { coordinate: [-3, 49], precision: 'area', place: 'English Channel and northwestern France' },
  'wme-2023-12-04-britain-reports-russia-likely-controls': { coordinate: [37.5054, 47.9425], precision: 'city', place: 'Marinka, Donetsk Oblast, Ukraine' },
};

/** Apply corrections only to imported fallbacks; already-geolocated records remain untouched. */
export function geolocateEuropeanCapitalFallback(event: WorldMicroEvent): WorldMicroEvent {
  if (event.precision !== 'national') return event;
  const override = EUROPEAN_EVENT_OVERRIDES[event.id] ?? EUROPEAN_PLACE_OVERRIDES[event.place];
  return override ? { ...event, ...override } : event;
}

export const EUROPEAN_GEOLOCATED_EVENT_IDS = new Set(Object.keys(EUROPEAN_EVENT_OVERRIDES));
export const EUROPEAN_GEOLOCATED_PLACES = new Set(Object.keys(EUROPEAN_PLACE_OVERRIDES));
