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
 * Italy — Forze armate italiane.
 *
 * Equipment counts, combat-ready figures, personnel, budget and the global
 * PowerIndex rank come from GlobalFirePower's 2026 Italy profile (the same
 * source and vintage used for Germany and France), so the numbers stay
 * comparable across the site.
 *
 * The three panels below are NOT scored by GlobalFirePower and come from
 * Italian / allied sources instead:
 *   · NATO nuclear sharing — Italy holds no national arsenal but hosts US B61
 *     bombs and would deliver them with its own aircraft.
 *   · Comando per le Operazioni in Rete (COR) — the joint cyber / networks
 *     command, Italy's cyber domain.
 *   · Arma dei Carabinieri — a full armed force (the fourth) that also carries
 *     out nationwide civil policing, with no German equivalent.
 *
 * Platform photographs reuse the locally cached Wikimedia images already
 * generated for the ITA country page (scripts/generate-military-equipment.mjs),
 * so nothing new is hot-linked. Each image degrades to an inline SVG silhouette
 * if it fails to load. They are copied rather than imported from
 * `equipmentVisuals.ts` to keep that ~2,800-line all-country literal out of the
 * eagerly-loaded dashboard chunk; a stale path here degrades to the silhouette.
 */

const GFP_SOURCE_URL = 'https://www.globalfirepower.com/country-military-strength-detail.php?country_id=italy';
const DIFESA_SOURCE_URL = 'https://www.difesa.it/';
const CARABINIERI_SOURCE_URL = 'https://www.carabinieri.it/';
const FAS_SOURCE_URL = 'https://thebulletin.org/premium/2024-05/nuclear-notebook-united-states-nuclear-weapons-2024/';

const IMG: Readonly<Record<string, string>> = {
  tanks: '/military/equipment/models/1057065.jpg',
  vehicles: '/military/equipment/models/39536242.jpg',
  selfPropelledArtillery: '/military/equipment/models/892329.jpg',
  towedArtillery: '/military/equipment/models/2119123.jpg',
  mlrs: '/military/equipment/models/932976.jpg',
  aircraftCarriers: '/military/equipment/models/599053.jpg',
  destroyers: '/military/equipment/models/650837.jpg',
  frigates: '/military/equipment/models/1516963.jpg',
  submarines: '/military/equipment/models/195728.jpg',
  patrolVessels: '/military/equipment/models/52260473.jpg',
  mineWarfare: '/military/equipment/models/19929488.jpg',
  fighters: '/military/equipment/models/167667.jpg',
  attack: '/military/equipment/models/168682.jpg',
  transports: '/military/equipment/models/16172717.jpg',
  trainers: '/military/equipment/models/948485.jpg',
  special: '/military/equipment/models/511713.jpg',
  tankers: '/military/equipment/models/682143.jpg',
  helicopters: '/military/equipment/models/513911.jpg',
  attackHelicopters: '/military/equipment/models/523378.jpg',
};

function img(key: string): string | undefined {
  return IMG[key];
}

const BRANCHES: Branch[] = [
  {
    id: 'army',
    title: 'Army',
    accent: ARMY_ACCENT,
    headline: '203 tanks · 87,364 armored vehicles',
    blurb: 'Esercito Italiano — armor, the medium mechanised brigades and artillery.',
    items: [
      { key: 'tanks', name: 'Main Battle Tanks', platform: 'C1 Ariete', total: 203, ready: 142, image: img('tanks'), icon: 'tank' },
      {
        key: 'afv',
        name: 'Armored Vehicles',
        platform: 'Freccia · Centauro · Dardo · VBM',
        total: 87364,
        ready: 61155,
        image: img('vehicles'),
        icon: 'afv',
        support: true,
      },
      { key: 'spg', name: 'Self-Propelled Artillery', platform: 'PzH 2000', total: 64, ready: 45, image: img('selfPropelledArtillery'), icon: 'artillery' },
      { key: 'towed', name: 'Towed Artillery', platform: 'FH70 155 mm', total: 108, ready: 76, image: img('towedArtillery'), icon: 'artillery' },
      { key: 'mlrs', name: 'Rocket Artillery (MLRS)', platform: 'M270 MLRS', total: 21, ready: 15, image: img('mlrs'), icon: 'mlrs' },
    ],
  },
  {
    id: 'navy',
    title: 'Navy',
    accent: NAVY_ACCENT,
    headline: '285 naval assets · 2 carriers',
    blurb: 'Marina Militare — two F-35B-capable flat-tops, the FREMM frigate line and the submarine flotilla.',
    items: [
      { key: 'patrol', name: 'Patrol Vessels', platform: 'Thaon di Revel-class (PPA)', total: 15, image: img('patrolVessels'), icon: 'ship' },
      { key: 'frigates', name: 'Frigates', platform: 'FREMM (Bergamini-class)', total: 14, image: img('frigates'), icon: 'ship' },
      { key: 'mine', name: 'Mine Warfare', platform: 'Lerici / Gaeta-class minehunter', total: 10, image: img('mineWarfare'), icon: 'ship' },
      { key: 'subs', name: 'Submarines', platform: 'Type 212A (Todaro-class)', total: 8, image: img('submarines'), icon: 'sub' },
      { key: 'destroyers', name: 'Destroyers', platform: 'Horizon (Andrea Doria-class)', total: 3, image: img('destroyers'), icon: 'ship' },
      { key: 'carriers', name: 'Aircraft Carriers', platform: 'Cavour (C550) · Trieste (L9890)', total: 2, image: img('aircraftCarriers'), icon: 'ship' },
    ],
  },
  {
    id: 'airforce',
    title: 'Air Force',
    accent: AIR_ACCENT,
    headline: '714 aircraft & helicopters',
    blurb: 'Aeronautica Militare — Typhoon and F-35 fighters, strategic airlift and rotary aviation.',
    items: [
      { key: 'heli', name: 'Helicopters', platform: 'NH90 · AW139 · HH-101 Caesar', total: 352, ready: 246, image: img('helicopters'), icon: 'heli' },
      { key: 'trainer', name: 'Trainers', platform: 'M-346 Master · M-345', total: 152, ready: 106, image: img('trainers'), icon: 'jet' },
      { key: 'fighters', name: 'Fighters', platform: 'Eurofighter Typhoon · F-35A', total: 88, ready: 62, image: img('fighters'), icon: 'jet' },
      { key: 'attack', name: 'Attack Aircraft', platform: 'Tornado IDS/ECR · F-35B', total: 65, ready: 46, image: img('attack'), icon: 'jet' },
      { key: 'attackHeli', name: 'Attack Helicopters', platform: 'A129 Mangusta / AW249', total: 37, ready: 26, image: img('attackHelicopters'), icon: 'heli' },
      { key: 'transport', name: 'Transport Aircraft', platform: 'C-130J · C-27J Spartan', total: 31, ready: 22, image: img('transports'), icon: 'jet' },
      { key: 'special', name: 'Special-Mission', platform: 'G550 CAEW · P-72A', total: 22, ready: 15, image: img('special'), icon: 'jet' },
      { key: 'tanker', name: 'Tanker Fleet', platform: 'KC-767A · KC-130J', total: 8, ready: 6, image: img('tankers'), icon: 'jet' },
    ],
  },
];

export const ITALY_MILITARY_PROFILE: MilitaryProfile = {
  iso3: 'ITA',
  countryName: 'Italy',
  overview: [
    { label: 'Global rank', value: '#10', sub: 'of 145 (GlobalFirePower 2026)' },
    { label: 'Power Index', value: '0.2211', sub: 'Lower is stronger (0 = perfect)' },
    { label: 'Active personnel', value: '165,500', sub: '+ 18,300 reserve' },
    { label: 'Reserve', value: '18,300', sub: 'Trained reserve force' },
    { label: 'Defense budget', value: '$37.3B', sub: 'Annual (2026)', accent: '#4ade80' },
    { label: 'Nuclear sharing', value: '~35', sub: 'US B61 bombs hosted; no national arsenal', accent: NUCLEAR_ACCENT },
  ],
  branches: BRANCHES,
  panels: [
    {
      id: 'deterrent',
      title: 'Nuclear sharing',
      accent: NUCLEAR_ACCENT,
      icon: 'nuclear',
      headline: 'NATO nuclear sharing — US B61 bombs on Italian soil',
      blurb: 'Italy holds no national arsenal; under NATO sharing it hosts US warheads and would deliver them with its own aircraft. Not rated by GlobalFirePower.',
      stats: [
        { label: 'Warheads hosted', value: '~35', sub: 'US B61 gravity bombs (Aviano & Ghedi)' },
        { label: 'Host air bases', value: '2', sub: 'Aviano (USAFE) · Ghedi (6° Stormo)' },
        { label: 'Sharing states', value: '5', sub: 'Italy is one of five NATO nuclear-sharing nations' },
        { label: 'Delivery aircraft', value: 'F-35A', sub: 'Replacing the Tornado IDS at Ghedi' },
      ],
      listTitle: 'How it works',
      items: [
        { name: 'Dual-key control', note: 'US retains custody; release needs US and NATO authorisation' },
        { name: 'Ghedi — 6° Stormo', note: 'Italian nuclear-strike wing, converting to the F-35A' },
        { name: 'Aviano AB', note: 'US 31st Fighter Wing; USAFE weapons storage vaults' },
        { name: 'B61-12', note: 'Modernised guided bomb replacing older B61 variants' },
        { name: 'Nuclear Planning Group', note: 'Italy sits on NATO’s nuclear-policy body' },
      ],
      footnote:
        'Warhead estimates: Bulletin of the Atomic Scientists / Federation of American Scientists (Nuclear Notebook). GlobalFirePower does not score nuclear forces, and Italy operates no weapons of its own.',
    },
    {
      id: 'cyberspace',
      title: 'Cyberspace',
      accent: CYBER_ACCENT,
      icon: 'cyber',
      headline: 'Comando per le Operazioni in Rete (COR)',
      blurb: 'The Defence Staff’s joint command for networks, C4 and cyber defence, stood up in 2020.',
      stats: [
        { label: 'Established', value: '2020', sub: 'Merged C4 and cyber under the Defence General Staff' },
        { label: 'Domain', value: 'Cyber', sub: 'Recognised alongside land, sea, air and space' },
        { label: 'National agency', value: 'ACN', sub: 'Civilian Agenzia per la Cybersicurezza Nazionale (2021)' },
        { label: 'Framework', value: 'NATO / EU', sub: 'Aligned with allied cyber-defence structures' },
      ],
      listTitle: 'Mission domains',
      items: [
        { name: 'Network operations', note: 'Defence of military networks and weapon systems' },
        { name: 'C4 systems', note: 'Command, control, communications and computers' },
        { name: 'Cyber defence', note: 'Monitoring, incident response and resilience' },
        { name: 'CIOC', note: 'Cyber-operations element folded under the COR' },
        { name: 'ACN liaison', note: 'Coordination with the national cyber agency' },
      ],
      footnote:
        'Cyberspace figures: Italian Ministry of Defence (Difesa.it) and the Agenzia per la Cybersicurezza Nazionale. GlobalFirePower does not score cyber forces, so these are reported separately.',
    },
    {
      id: 'carabinieri',
      title: 'Carabinieri',
      accent: GENDARMERIE_ACCENT,
      icon: 'shield',
      headline: 'Arma dei Carabinieri — a fourth armed force',
      blurb: 'A gendarmerie with full military status and nationwide policing duties; an autonomous armed force since 2000. Answers to Defence for military matters and Interior for public security. Germany has no equivalent.',
      stats: [
        { label: 'Personnel', value: '~100,000', sub: 'Carabinieri across Italy (2023)' },
        { label: 'Founded', value: '1814', sub: 'Oldest corps of the Italian armed forces' },
        { label: 'Autonomous force since', value: '2000', sub: 'Fourth force alongside Army, Navy, Air Force' },
        { label: 'Territorial stations', value: '4,600+', sub: 'Stazioni covering the whole country' },
      ],
      listTitle: 'Formations',
      items: [
        { name: 'Organizzazione territoriale', note: 'Stazioni and provincial commands — everyday policing' },
        { name: 'GIS', note: 'Gruppo di Intervento Speciale — counter-terror / hostage rescue' },
        { name: 'ROS', note: 'Raggruppamento Operativo Speciale — anti-mafia and terrorism' },
        { name: 'Tutela Patrimonio Culturale', note: 'Art-crime and cultural-heritage protection unit' },
        { name: 'MSU', note: 'Multinational Specialised Units for NATO / EU peacekeeping' },
      ],
      footnote:
        'Personnel figures: Arma dei Carabinieri and the Italian Ministry of Defence. The Carabinieri are an armed force but are not counted in GlobalFirePower’s active-personnel total.',
    },
  ],
  sources: [
    { label: 'GlobalFirePower — Italy (2026)', url: GFP_SOURCE_URL },
    { label: 'Ministero della Difesa', url: DIFESA_SOURCE_URL },
    { label: 'Arma dei Carabinieri', url: CARABINIERI_SOURCE_URL },
    { label: 'Bulletin of the Atomic Scientists — Nuclear Notebook', url: FAS_SOURCE_URL },
  ],
  footnote:
    'Equipment photos via Wikimedia Commons contributors (CC BY-SA / public domain); representative platforms shown per category.',
  branchFootnote:
    'Counts & combat-ready figures: GlobalFirePower 2026. GFP files Italy’s FREMM ships under “frigates” and counts both the carrier Cavour and the LHD Trieste under “aircraft carriers”. “Share of fleet” is each system’s percentage of its branch’s combat platforms (broad support/transport vehicles excluded).',
};
