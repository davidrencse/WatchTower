import {
  AIR_ACCENT,
  ARMY_ACCENT,
  CYBER_ACCENT,
  GENDARMERIE_ACCENT,
  NAVY_ACCENT,
  NUCLEAR_ACCENT,
  type Branch,
  type MilitaryProfile,
} from './types';

/**
 * France — Armées françaises.
 *
 * Equipment counts, combat-ready figures, personnel, budget and the global
 * PowerIndex rank come from GlobalFirePower's 2026 France profile (the same
 * source and vintage used for Germany and for the generic country pages), so
 * the numbers stay comparable across the site.
 *
 * The three panels below are NOT scored by GlobalFirePower and come from French
 * sources instead:
 *   · Force de dissuasion — France is the EU's only nuclear-weapon state.
 *   · COMCYBER — the cyberdefence command, France's 4th operational domain.
 *   · Gendarmerie nationale — a full armed force (armée) that reports to the
 *     Interior Ministry for its policing duties, with no German equivalent.
 *
 * Platform photographs reuse the locally cached Wikimedia images already
 * generated for the FRA country page (scripts/generate-military-equipment.mjs),
 * so nothing new is hot-linked. Each image degrades to an inline SVG silhouette
 * if it fails to load.
 */

const GFP_SOURCE_URL = 'https://www.globalfirepower.com/country-military-strength-detail.php?country_id=france';
const DEFENSE_SOURCE_URL = 'https://www.defense.gouv.fr/ministere/politique-defense/loi-programmation-militaire-2024-2030';
const COMCYBER_SOURCE_URL = 'https://www.defense.gouv.fr/comcyber/commandement-cyberdefense-comcyber';
const GENDARMERIE_SOURCE_URL = 'https://www.gendarmerie.interieur.gouv.fr/';

/**
 * Locally cached platform photos, mirrored from the FRA block of the generated
 * `equipmentVisuals.ts`.
 *
 * They are copied rather than imported: that module is a single object literal
 * covering all 45 countries, so importing it here would pull ~2,800 lines of
 * other countries' data into the eagerly-loaded dashboard chunk for the sake of
 * 18 strings. A stale path here degrades to the inline SVG silhouette, so the
 * copy can never break the layout.
 */
const IMG: Readonly<Record<string, string>> = {
  tanks: '/military/equipment/models/375366.jpg',
  vehicles: '/military/equipment/models/3212725.jpg',
  selfPropelledArtillery: '/military/equipment/models/4545471.jpg',
  mlrs: '/military/equipment/models/932976.jpg',
  aircraftCarriers: '/military/equipment/models/639127.jpg',
  helicopterCarriers: '/military/equipment/models/1711151.jpg',
  destroyers: '/military/equipment/models/650837.jpg',
  frigates: '/military/equipment/models/1516963.jpg',
  patrolVessels: '/military/equipment/models/commons-4427456e7472656361737465.jpg',
  mineWarfare: '/military/equipment/models/6490047.jpg',
  fighters: '/military/equipment/models/33731380.jpg',
  transports: '/military/equipment/models/371265.jpg',
  trainers: '/military/equipment/models/921260.jpg',
  tankers: '/military/equipment/models/616482.jpg',
  special: '/military/equipment/models/10384.jpg',
  helicopters: '/military/equipment/models/513911.jpg',
  attackHelicopters: '/military/equipment/models/310780.jpg',
};

function img(key: string): string | undefined {
  return IMG[key];
}

/**
 * The generator resolved "Suffren-class submarine" to a 1955 photo of the US
 * Navy's unrelated Barracuda class, so the sea leg is pointed at the real boat.
 */
const SUFFREN_IMG =
  'https://upload.wikimedia.org/wikipedia/commons/d/d4/Suffren_at_Cape_Brun_off_Toulon_on_26_July_2020.jpg';

const BRANCHES: Branch[] = [
  {
    id: 'army',
    title: 'Army',
    accent: ARMY_ACCENT,
    headline: '427 tanks · 110,784 armored vehicles',
    blurb: 'Armée de Terre — armor, the Scorpion mechanised force and artillery.',
    items: [
      { key: 'tanks', name: 'Main Battle Tanks', platform: 'Leclerc / Leclerc XLR', total: 427, ready: 342, image: img('tanks'), icon: 'tank' },
      {
        key: 'afv',
        name: 'Armored Vehicles',
        platform: 'Griffon · Jaguar · Serval · VBCI',
        total: 110784,
        ready: 88627,
        image: img('vehicles'),
        icon: 'afv',
        support: true,
      },
      {
        key: 'spg',
        name: 'Self-Propelled Artillery',
        platform: 'CAESAR 6×6 / 8×8',
        total: 74,
        ready: 59,
        image: img('selfPropelledArtillery'),
        icon: 'artillery',
      },
      { key: 'mlrs', name: 'Rocket Artillery (MLRS)', platform: 'LRU (M270-based)', total: 9, ready: 7, image: img('mlrs'), icon: 'mlrs' },
    ],
  },
  {
    id: 'navy',
    title: 'Navy',
    accent: NAVY_ACCENT,
    headline: '166 naval assets · 1 nuclear carrier',
    blurb: 'Marine nationale — the only nuclear-powered carrier outside the US Navy, plus the sea-based deterrent.',
    items: [
      { key: 'patrol', name: 'Patrol Vessels', platform: 'Floréal · D’Entrecasteaux · PLG', total: 22, image: img('patrolVessels'), icon: 'ship' },
      { key: 'mine', name: 'Mine Warfare', platform: 'Tripartite-class minehunter', total: 19, image: img('mineWarfare'), icon: 'ship' },
      { key: 'destroyers', name: 'Destroyers', platform: 'Horizon · FREMM (1st-rank)', total: 11, image: img('destroyers'), icon: 'ship' },
      { key: 'subs', name: 'Submarines', platform: 'Triomphant SSBN · Suffren SSN', total: 9, image: SUFFREN_IMG, icon: 'sub' },
      { key: 'frigates', name: 'Frigates', platform: 'La Fayette-class', total: 5, image: img('frigates'), icon: 'ship' },
      { key: 'heliCarriers', name: 'Helicopter Carriers', platform: 'Mistral-class LHD', total: 3, image: img('helicopterCarriers'), icon: 'ship' },
      { key: 'carriers', name: 'Aircraft Carriers', platform: 'Charles de Gaulle (R91)', total: 1, image: img('aircraftCarriers'), icon: 'ship' },
    ],
  },
  {
    id: 'airforce',
    title: 'Air & Space Force',
    accent: AIR_ACCENT,
    headline: '974 aircraft & helicopters',
    blurb: 'Armée de l’Air et de l’Espace — fighters, strategic airlift, rotary and the Space Command (CDE).',
    items: [
      { key: 'heli', name: 'Helicopters', platform: 'NH90 Caïman · Caracal · H160M', total: 452, ready: 362, image: img('helicopters'), icon: 'heli' },
      { key: 'fighters', name: 'Fighters', platform: 'Rafale · Mirage 2000', total: 223, ready: 178, image: img('fighters'), icon: 'jet' },
      { key: 'trainer', name: 'Trainers', platform: 'Pilatus PC-21 · Alphajet', total: 140, ready: 112, image: img('trainers'), icon: 'jet' },
      { key: 'transport', name: 'Transport Aircraft', platform: 'A400M Atlas · C-130J', total: 118, ready: 94, image: img('transports'), icon: 'jet' },
      { key: 'attackHeli', name: 'Attack Helicopters', platform: 'Tigre HAD', total: 67, ready: 54, image: img('attackHelicopters'), icon: 'heli' },
      { key: 'special', name: 'Special-Mission', platform: 'E-3F AWACS · Atlantique 2', total: 44, ready: 35, image: img('special'), icon: 'jet' },
      { key: 'tanker', name: 'Tanker Fleet', platform: 'A330 MRTT Phénix', total: 15, ready: 12, image: img('tankers'), icon: 'jet' },
    ],
  },
];

export const FRANCE_MILITARY_PROFILE: MilitaryProfile = {
  iso3: 'FRA',
  countryName: 'France',
  overview: [
    { label: 'Global rank', value: '#6', sub: 'of 145 (GlobalFirePower 2026)' },
    { label: 'Power Index', value: '0.1798', sub: 'Lower is stronger (0 = perfect)' },
    { label: 'Active personnel', value: '264,000', sub: '+ 43,444 reserve' },
    { label: 'Reserve', value: '43,444', sub: 'Trained reserve force' },
    { label: 'Defense budget', value: '$67.2B', sub: 'Annual (2026)', accent: '#4ade80' },
    { label: 'Nuclear warheads', value: '~290', sub: 'Sole nuclear power in the EU', accent: NUCLEAR_ACCENT },
  ],
  branches: BRANCHES,
  panels: [
    {
      id: 'deterrent',
      title: 'Nuclear deterrent',
      accent: NUCLEAR_ACCENT,
      icon: 'nuclear',
      headline: 'Force de dissuasion — the EU’s only sovereign nuclear arsenal',
      blurb: 'Two independent legs under sole presidential authority; not rated by GlobalFirePower.',
      stats: [
        { label: 'Warheads', value: '~290', sub: 'Macron announced an increase in March 2026' },
        { label: 'SSBN fleet', value: '4', sub: 'Le Triomphant-class; at least one at sea at all times' },
        { label: 'Continuous patrol since', value: '1972', sub: 'Unbroken sea-based deterrent posture' },
        { label: 'First test', value: '1960', sub: 'Gerboise Bleue, Algerian Sahara' },
      ],
      listTitle: 'Force components',
      items: [
        { name: 'FOST', note: 'Force océanique stratégique — SSBNs based at Île Longue' },
        { name: 'M51.3 SLBM', note: 'Operational since Oct 2025; TNO-2 warhead' },
        { name: 'FAS', note: 'Forces aériennes stratégiques — Rafale B nuclear squadrons' },
        { name: 'ASMPA-R', note: 'Air-launched cruise missile, in service since 2023' },
        { name: 'FANu', note: 'Carrier air nuclear force flown from Charles de Gaulle' },
        { name: 'Invincible-class', note: 'Third-generation SSBN, first boat due 2036' },
      ],
      footnote:
        'Warhead and delivery-system figures: Bulletin of the Atomic Scientists (French nuclear weapons, 2025) and the French Ministry of the Armed Forces. GlobalFirePower does not score nuclear forces.',
    },
    {
      id: 'cyberspace',
      title: 'Cyberspace',
      accent: CYBER_ACCENT,
      icon: 'cyber',
      headline: 'Commandement de la cyberdéfense (COMCYBER)',
      blurb: 'France’s cyber domain command, reporting directly to the Chief of the Defence Staff.',
      stats: [
        { label: 'Cybercombattants', value: '4,000+', sub: 'Across the Ministry of the Armed Forces' },
        { label: '2025 target', value: '5,000+', sub: 'Trajectory set by the 2024–2030 LPM' },
        { label: 'Cyber funding', value: '€4B', sub: 'LPM 2024–2030, up from €1.6B in 2019–2025' },
        { label: 'Established', value: '2017', sub: 'Cyber recognised as an operational domain' },
      ],
      listTitle: 'Mission domains',
      items: [
        { name: 'Lutte informatique défensive', note: 'LID — defence of networks and weapons systems' },
        { name: 'Lutte informatique offensive', note: 'LIO — offensive cyber effects in operations' },
        { name: 'Lutte informatique d’influence', note: 'L2I — countering information operations' },
        { name: '807e CTRS', note: 'Cyber Defence Regiment, Rennes-Bruz' },
        { name: 'DEFNET', note: 'Annual ministry-wide cyber-crisis exercise' },
      ],
      footnote:
        'Cyberspace figures: Ministère des Armées / COMCYBER and the Sénat report on the 2024–2030 LPM. GlobalFirePower does not score cyber forces.',
    },
    {
      id: 'gendarmerie',
      title: 'Gendarmerie',
      accent: GENDARMERIE_ACCENT,
      icon: 'shield',
      headline: 'Gendarmerie nationale — a fourth armed force',
      blurb: 'Military status with civil policing duties; under the Interior Ministry for employment since 2009. Germany has no equivalent.',
      stats: [
        { label: 'Personnel', value: '~102,000', sub: 'Gendarmes and civilian staff (2023)' },
        { label: 'Territory policed', value: '95%', sub: 'of French territory' },
        { label: 'Population covered', value: '~50%', sub: 'Mostly rural and peri-urban France' },
        { label: 'Founded', value: '1791', sub: 'Successor to the maréchaussée' },
      ],
      listTitle: 'Formations',
      items: [
        { name: 'Gendarmerie départementale', note: 'Territorial policing brigades' },
        { name: 'Gendarmerie mobile', note: 'Public-order and riot squadrons' },
        { name: 'GIGN', note: 'Counter-terrorist and hostage-rescue unit' },
        { name: 'Garde républicaine', note: 'State protocol and Paris institutions' },
        { name: 'Specialised gendarmeries', note: 'Maritime, air, air transport and armament' },
      ],
      footnote:
        'Personnel figures: Gendarmerie nationale and Sénat budget reporting. The Gendarmerie is a component of the armed forces but is not counted in GlobalFirePower’s active-personnel total.',
    },
  ],
  sources: [
    { label: 'GlobalFirePower — France (2026)', url: GFP_SOURCE_URL },
    { label: 'Ministère des Armées — LPM 2024–2030', url: DEFENSE_SOURCE_URL },
    { label: 'COMCYBER', url: COMCYBER_SOURCE_URL },
    { label: 'Gendarmerie nationale', url: GENDARMERIE_SOURCE_URL },
  ],
  footnote:
    'Equipment photos via Wikimedia Commons contributors (CC BY-SA / public domain); representative platforms shown per category.',
  branchFootnote:
    'Counts & combat-ready figures: GlobalFirePower 2026. GFP files France’s Horizon and FREMM first-rank frigates under “destroyers” and the La Fayette class under “frigates”. “Share of fleet” is each system’s percentage of its branch’s combat platforms (broad support/transport vehicles excluded).',
};
