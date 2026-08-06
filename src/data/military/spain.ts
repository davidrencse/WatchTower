import {
  AIR_ACCENT,
  ARMY_ACCENT,
  CYBER_ACCENT,
  GENDARMERIE_ACCENT,
  NAVY_ACCENT,
  type Branch,
  type MilitaryProfile,
} from './types';

/**
 * THESIS: Replace Spain's generic inventory with a national-force dossier that
 * explains what the numbers belong to. OWN-WORLD: Inherit WatchTower's dark,
 * compact evidence cards and branch-coded signals. STORY: Read readiness at a
 * glance, inspect each service, then understand cyber, emergency-response and
 * Guardia Civil structures. FIRST VIEWPORT: Five comparable GFP indicators
 * lead directly into the Army inventory. FORM: Existing
 * NationalMilitarySection profile extension; a concept seed is not applicable
 * to this narrowly scoped incumbent surface.
 *
 * Equipment, personnel, budget and ranking figures use GlobalFirePower's 2026
 * Spain profile so they remain comparable with every other country dossier.
 * The MCCE, UME and Guardia Civil panels use Spanish government sources and are
 * reported separately because GlobalFirePower does not score them.
 */

const GFP_SOURCE_URL = 'https://www.globalfirepower.com/country-military-strength-detail.php?country_id=spain';
const DEFENSA_SOURCE_URL = 'https://www.defensa.gob.es/fuerzasarmadas/';
const MCCE_SOURCE_URL = 'https://www.defensa.gob.es/ministerio/organigrama/emad/mcce/';
const UME_SOURCE_URL = 'https://www.defensa.gob.es/ume/CONOCENOS/Historial/Historial.html';
const GUARDIA_CIVIL_SOURCE_URL =
  'https://web.guardiacivil.es/es/institucional/conocenos/idcorporativa/naturalezami-00001/';
const INTERIOR_GUARDIA_CIVIL_STRENGTH_URL =
  'https://www.interior.gob.es/opencms/en/detail-pages/article/Grande-Marlaska-destaca-la-ejemplar-reaccion-de-la-Guardia-Civil-ante-las-catastrofes-naturales-como-la-dana-y-los-incendios-forestales/';

/** Spain's locally cached equipment photographs from equipmentVisuals.ts. */
const IMG: Readonly<Record<string, string>> = {
  tanks: '/military/equipment/models/17969235.jpg',
  vehicles: '/military/equipment/models/2838895.jpg',
  selfPropelledArtillery: '/military/equipment/models/38022.jpg',
  towedArtillery: '/military/equipment/models/67466859.jpg',
  aircraftCarriers: '/military/equipment/models/2598788.jpg',
  frigates: '/military/equipment/models/963377.jpg',
  submarines: '/military/equipment/models/23853018.jpg',
  patrolVessels: '/military/equipment/models/29138660.jpg',
  mineWarfare: '/military/equipment/models/commons-5365677572612d636c617373.jpg',
  fighters: '/military/equipment/models/167667.jpg',
  transports: '/military/equipment/models/371265.jpg',
  trainers: '/military/equipment/models/921260.jpg',
  special: '/military/equipment/models/7175494.jpg',
  helicopters: '/military/equipment/models/513911.jpg',
  attackHelicopters: '/military/equipment/models/310780.jpg',
};

function img(key: string): string | undefined {
  return IMG[key];
}

const BRANCHES: Branch[] = [
  {
    id: 'army',
    title: 'Army',
    accent: ARMY_ACCENT,
    headline: '298 tanks · 49,324 armored vehicles',
    blurb: 'Ejército de Tierra — armor, mechanized infantry and tube artillery.',
    items: [
      {
        key: 'tanks',
        name: 'Main Battle Tanks',
        platform: 'Leopard 2E · Leopard 2A4',
        total: 298,
        ready: 209,
        image: img('tanks'),
        icon: 'tank',
      },
      {
        key: 'afv',
        name: 'Armored Vehicles',
        platform: 'Pizarro · VCR 8×8 Dragón · APC/IFV',
        total: 49324,
        ready: 34527,
        image: img('vehicles'),
        icon: 'afv',
        support: true,
      },
      {
        key: 'spg',
        name: 'Self-Propelled Artillery',
        platform: 'M109A5E',
        total: 96,
        ready: 67,
        image: img('selfPropelledArtillery'),
        icon: 'artillery',
      },
      {
        key: 'towed',
        name: 'Towed Artillery',
        platform: 'Santa Bárbara SIAC 155/52',
        total: 188,
        ready: 132,
        image: img('towedArtillery'),
        icon: 'artillery',
      },
    ],
  },
  {
    id: 'navy',
    title: 'Navy',
    accent: NAVY_ACCENT,
    headline: '175 naval assets · 1 aviation-capable flagship',
    blurb: 'Armada Española — ocean escort, amphibious lift, submarines and maritime security.',
    items: [
      {
        key: 'patrol',
        name: 'Patrol Vessels',
        platform: 'Meteoro class · coastal patrol fleet',
        total: 112,
        image: img('patrolVessels'),
        icon: 'ship',
      },
      {
        key: 'frigates',
        name: 'Frigates',
        platform: 'Álvaro de Bazán · Santa María',
        total: 11,
        image: img('frigates'),
        icon: 'ship',
      },
      {
        key: 'mine',
        name: 'Mine Warfare',
        platform: 'Segura-class minehunter',
        total: 6,
        image: img('mineWarfare'),
        icon: 'ship',
      },
      {
        key: 'subs',
        name: 'Submarines',
        platform: 'S-80 Plus · Galerna class',
        total: 2,
        image: img('submarines'),
        icon: 'sub',
      },
      {
        key: 'carrier',
        name: 'Aircraft Carrier',
        platform: 'Juan Carlos I (L61) LHD',
        total: 1,
        image: img('aircraftCarriers'),
        icon: 'ship',
      },
    ],
  },
  {
    id: 'airforce',
    title: 'Air & Space Force',
    accent: AIR_ACCENT,
    headline: '440 aircraft & helicopters',
    blurb: 'Ejército del Aire y del Espacio, with other-service aviation included in the GFP inventory.',
    showShare: false,
    items: [
      {
        key: 'heli',
        name: 'Helicopters',
        platform: 'NH90 · CH-47F Chinook · Super Puma',
        total: 169,
        ready: 110,
        image: img('helicopters'),
        icon: 'heli',
      },
      {
        key: 'fighters',
        name: 'Fighters',
        platform: 'Eurofighter Typhoon · EF-18M Hornet',
        total: 136,
        ready: 88,
        image: img('fighters'),
        icon: 'jet',
      },
      {
        key: 'trainers',
        name: 'Trainers',
        platform: 'Pilatus PC-21 · F-5M',
        total: 108,
        ready: 70,
        image: img('trainers'),
        icon: 'jet',
      },
      {
        key: 'transport',
        name: 'Transport Aircraft',
        platform: 'A400M Atlas · C295',
        total: 51,
        ready: 33,
        image: img('transports'),
        icon: 'jet',
      },
      {
        key: 'attackHeli',
        name: 'Attack Helicopters',
        platform: 'Tiger HAD',
        total: 17,
        ready: 11,
        image: img('attackHelicopters'),
        icon: 'heli',
      },
      {
        key: 'attack',
        name: 'Attack Aircraft',
        platform: 'AV-8B Harrier II Plus',
        total: 12,
        ready: 8,
        icon: 'jet',
      },
      {
        key: 'special',
        name: 'Special-Mission',
        platform: 'C295 MPA · electronic / surveillance fleet',
        total: 8,
        ready: 5,
        image: img('special'),
        icon: 'jet',
      },
    ],
  },
];

export const SPAIN_MILITARY_PROFILE: MilitaryProfile = {
  iso3: 'ESP',
  countryName: 'Spain',
  overview: [
    { label: 'Global rank', value: '#18', sub: 'of 145 (GlobalFirePower 2026)' },
    { label: 'Power Index', value: '0.3247', sub: 'Lower is stronger (0 = perfect)' },
    { label: 'Active personnel', value: '121,802', sub: '+ 24,033 reserve' },
    { label: 'Reserve', value: '24,033', sub: 'Trained reserve force' },
    { label: 'Defense budget', value: '$39.0B', sub: 'Annual (2026)', accent: '#4ade80' },
  ],
  branches: BRANCHES,
  panels: [
    {
      id: 'cyberspace',
      title: 'Cyberspace',
      accent: CYBER_ACCENT,
      icon: 'cyber',
      headline: 'Mando Conjunto del Ciberespacio (MCCE)',
      blurb: 'The joint command responsible for Spain’s military operations in and through cyberspace.',
      stats: [
        { label: 'Established', value: '2020', sub: 'MCCD and JCISFAS merged into one joint command' },
        { label: 'Domain', value: 'Cyber', sub: 'Integrated with operations across the physical domains' },
        { label: 'Headquarters', value: 'Retamares', sub: 'Pozuelo de Alarcón, Madrid' },
        { label: 'Command level', value: 'Joint', sub: 'Subordinate to the Defence Staff (EMAD)' },
      ],
      listTitle: 'Mission domains',
      items: [
        { name: 'Cyber operations', note: 'Plan, direct, coordinate, control and execute military cyber operations' },
        { name: 'Freedom of action', note: 'Protect Defence networks and critical physical, logical and virtual systems' },
        { name: 'CIS & command', note: 'Joint requirements for information systems, telecommunications and C2' },
        { name: 'Electronic warfare', note: 'Operational coordination for the electromagnetic environment' },
        { name: 'Force generation', note: 'Joint training and specialist preparation for cyber missions' },
      ],
      footnote:
        'Structure and mission: Spanish Defence Staff and Ministry of Defence. GlobalFirePower does not score military cyber capability.',
    },
    {
      id: 'ume',
      title: 'Military Emergencies Unit',
      accent: '#f59e0b',
      icon: 'shield',
      headline: 'Unidad Militar de Emergencias (UME)',
      blurb: 'A joint military force for rapid intervention in major disasters at home and abroad.',
      stats: [
        { label: 'Personnel', value: '3,500', sub: 'Current authorized force' },
        { label: 'Response battalions', value: '5', sub: 'BIEM I–V distributed across Spain' },
        { label: 'National deployment', value: '<4h', sub: 'Target reach across Spanish territory' },
        { label: 'Established', value: '2005', sub: 'Twenty years of service in 2025' },
      ],
      listTitle: 'Response capabilities',
      items: [
        { name: 'Wildfires', note: 'Direct attack, containment and large-scale military support' },
        { name: 'Floods & severe weather', note: 'Rescue, pumping, engineering and access restoration' },
        { name: 'Earthquakes & volcanic events', note: 'Urban search and rescue plus population support' },
        { name: 'Technological hazards', note: 'Response to industrial, environmental and CBRN emergencies' },
        { name: 'RAIEM & BTUME', note: 'Specialist intervention, logistics and deployable communications' },
      ],
      footnote:
        'Personnel, organization and deployment figures: Unidad Militar de Emergencias / Spanish Ministry of Defence. UME personnel are part of the armed forces, not an additional GFP personnel category.',
    },
    {
      id: 'guardia-civil',
      title: 'Guardia Civil',
      accent: GENDARMERIE_ACCENT,
      icon: 'shield',
      headline: 'Guardia Civil — an armed institute of military character',
      blurb: 'A national police force distinct from the armed forces, with military organization and Defence duties defined by law.',
      stats: [
        { label: 'Personnel', value: '83,000+', sub: 'Agents reported by Interior in 2025' },
        { label: 'Founded', value: '1844', sub: 'Spain’s oldest nationwide police force' },
        { label: 'Character', value: 'Military', sub: 'Hierarchy, discipline and organization' },
        { label: 'Oversight', value: 'Dual', sub: 'Interior generally; Defence for military missions' },
      ],
      listTitle: 'National capabilities',
      items: [
        { name: 'Seguridad Ciudadana', note: 'Territorial public security and rural policing' },
        { name: 'Agrupación de Tráfico', note: 'Road safety and traffic enforcement' },
        { name: 'SEPRONA', note: 'Environmental and natural-resource protection' },
        { name: 'UCO', note: 'Central unit for serious and organized crime investigations' },
        { name: 'GAR & UEI', note: 'High-risk counter-terrorist and special intervention units' },
      ],
      footnote:
        'Institutional status: Guardia Civil. Staffing figure: Spanish Ministry of the Interior. The corps is not part of the armed forces and is not included in GlobalFirePower’s active-personnel figure.',
    },
  ],
  sources: [
    { label: 'GlobalFirePower — Spain (2026)', url: GFP_SOURCE_URL },
    { label: 'Ministerio de Defensa — Fuerzas Armadas', url: DEFENSA_SOURCE_URL },
    { label: 'Mando Conjunto del Ciberespacio', url: MCCE_SOURCE_URL },
    { label: 'Unidad Militar de Emergencias', url: UME_SOURCE_URL },
    { label: 'Guardia Civil — military character', url: GUARDIA_CIVIL_SOURCE_URL },
    { label: 'Ministerio del Interior — Guardia Civil strength (2025)', url: INTERIOR_GUARDIA_CIVIL_STRENGTH_URL },
  ],
  footnote:
    'Equipment photos via Wikimedia Commons contributors (CC BY-SA / public domain); representative platforms shown per category.',
  branchFootnote:
    'Counts & estimated readiness figures: GlobalFirePower 2026. GFP counts Juan Carlos I as an aircraft carrier, aggregates patrol craft into a broad patrol-vessel total, and includes other-service aviation in the national air inventory. “Share of fleet” is each displayed system’s percentage of its branch’s displayed combat platforms (broad support vehicles excluded); it is omitted for aviation because GFP role categories overlap.',
};
