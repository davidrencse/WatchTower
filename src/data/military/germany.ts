import {
  AIR_ACCENT,
  ARMY_ACCENT,
  CYBER_ACCENT,
  NAVY_ACCENT,
  type Branch,
  type MilitaryProfile,
} from './types';

/**
 * Germany — Bundeswehr.
 *
 * Equipment counts, combat-ready figures, personnel, budget and the global
 * PowerIndex rank come from GlobalFirePower's 2026 Germany profile. Cyberspace
 * is NOT rated by GlobalFirePower — those figures are the Bundeswehr's Cyber and
 * Information Domain Service (CIR), which in 2024 was elevated to Germany's
 * fourth military branch alongside the Army, Navy and Air Force.
 *
 * Equipment photographs are hot-linked from Wikimedia Commons (CC BY-SA /
 * public domain). Each image degrades to an inline SVG silhouette if it fails
 * to load, so the layout never breaks.
 */

const GFP_SOURCE_URL = 'https://www.globalfirepower.com/country-military-strength-detail.php?country_id=germany';
const CIR_SOURCE_URL = 'https://www.bundeswehr.de/en/organization/the-cyber-and-information-domain-service';

const IMG = {
  leopard2:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Leopard_2_A7V_313_Bad_Frankenhausen_2024.JPG/960px-Leopard_2_A7V_313_Bad_Frankenhausen_2024.JPG',
  puma: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Puma%2C_first_series.jpg/960px-Puma%2C_first_series.jpg',
  pzh2000:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Lithuanian_PzH_2000_%282%29.jpg/960px-Lithuanian_PzH_2000_%282%29.jpg',
  m270: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/M270A1_Multiple_Launch_Rocket_System_South_Dakota_ANG.jpg/960px-M270A1_Multiple_Launch_Rocket_System_South_Dakota_ANG.jpg',
  frigate:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/BADEN-WURTTEMBERG_00257_%28cropped%29.jpg/960px-BADEN-WURTTEMBERG_00257_%28cropped%29.jpg',
  submarine: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/U_34_in_Fahrt.jpg/960px-U_34_in_Fahrt.jpg',
  corvette:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/F264_FGS_Ludwigshafen_am_Rhein_%2830156595011%29.jpg/960px-F264_FGS_Ludwigshafen_am_Rhein_%2830156595011%29.jpg',
  patrol: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Hafengeburtstag_2015_P_6122.jpg/960px-Hafengeburtstag_2015_P_6122.jpg',
  mine: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/M1064_Gr%C3%B6mitz_1.jpg/960px-M1064_Gr%C3%B6mitz_1.jpg',
  fighter:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/RAF_Eurofighter_EF-2000_Typhoon_F2_Lofting-1.jpg/960px-RAF_Eurofighter_EF-2000_Typhoon_F2_Lofting-1.jpg',
  tornado:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/RAF_Tornado_GR4_MOD_45155233.jpg/960px-RAF_Tornado_GR4_MOD_45155233.jpg',
  transport:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/German_Air_Force_Airbus_A400M_%28out_cropped%29.jpg/960px-German_Air_Force_Airbus_A400M_%28out_cropped%29.jpg',
  special:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/US_Navy_P-8_Poseidon_taking_off_at_Perth_Airport.jpg/960px-US_Navy_P-8_Poseidon_taking_off_at_Perth_Airport.jpg',
  tanker:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/KC-30_A39-002_refuelling_an_USAF_F-16_%28cropped%29.jpg/960px-KC-30_A39-002_refuelling_an_USAF_F-16_%28cropped%29.jpg',
  trainer:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Grob_120_TP-A_%E2%80%98D-ETPX%E2%80%99.jpg/960px-Grob_120_TP-A_%E2%80%98D-ETPX%E2%80%99.jpg',
  helicopter:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/French_Navy_NH90_lands_on_USS_Antietam_%28CG-54%29_in_the_Bay_of_Bengal_%28cropped%29.jpg/960px-French_Navy_NH90_lands_on_USS_Antietam_%28CG-54%29_in_the_Bay_of_Bengal_%28cropped%29.jpg',
  attackHeli:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/20170810034242%21Eurocopter_EC-665_Tiger_UHT%2C_Germany_-_Army_AN1547188_%282%29.jpg/960px-20170810034242%21Eurocopter_EC-665_Tiger_UHT%2C_Germany_-_Army_AN1547188_%282%29.jpg',
} as const;

const BRANCHES: Branch[] = [
  {
    id: 'army',
    title: 'Army',
    accent: ARMY_ACCENT,
    headline: '296 tanks · 87,338 armored vehicles',
    blurb: 'Heer land forces — armor, mechanized infantry and artillery.',
    items: [
      { key: 'tanks', name: 'Main Battle Tanks', platform: 'Leopard 2 A7V', total: 296, ready: 222, image: IMG.leopard2, icon: 'tank' },
      {
        key: 'afv',
        name: 'Armored Vehicles',
        platform: 'Puma · Boxer · APC/IFV',
        total: 87338,
        ready: 65504,
        image: IMG.puma,
        icon: 'afv',
        support: true,
      },
      { key: 'spg', name: 'Self-Propelled Artillery', platform: 'PzH 2000', total: 134, ready: 101, image: IMG.pzh2000, icon: 'artillery' },
      { key: 'mlrs', name: 'Rocket Artillery (MLRS)', platform: 'MARS II / M270', total: 33, ready: 25, image: IMG.m270, icon: 'mlrs' },
    ],
  },
  {
    id: 'navy',
    title: 'Navy',
    accent: NAVY_ACCENT,
    headline: '96 naval assets',
    blurb: 'Deutsche Marine — surface fleet, submarines and mine warfare.',
    items: [
      { key: 'patrol', name: 'Patrol Vessels', platform: 'Fast attack / patrol craft', total: 54, image: IMG.patrol, icon: 'ship' },
      { key: 'mine', name: 'Mine Warfare', platform: 'Frankenthal-class', total: 12, image: IMG.mine, icon: 'ship' },
      { key: 'frigates', name: 'Frigates', platform: 'F125 · F123 · F124', total: 11, image: IMG.frigate, icon: 'ship' },
      { key: 'subs', name: 'Submarines', platform: 'Type 212A', total: 6, image: IMG.submarine, icon: 'sub' },
      { key: 'corvettes', name: 'Corvettes', platform: 'K130 Braunschweig', total: 6, image: IMG.corvette, icon: 'ship' },
    ],
  },
  {
    id: 'airforce',
    title: 'Air Force',
    accent: AIR_ACCENT,
    headline: '569 aircraft & helicopters',
    blurb: 'Luftwaffe — fighters, transport, rotary and support aviation.',
    items: [
      { key: 'heli', name: 'Helicopters', platform: 'NH90 · CH-53 · H145M', total: 292, ready: 219, image: IMG.helicopter, icon: 'heli' },
      { key: 'fighters', name: 'Fighters', platform: 'Eurofighter Typhoon', total: 127, ready: 95, image: IMG.fighter, icon: 'jet' },
      { key: 'attack', name: 'Attack Aircraft', platform: 'Panavia Tornado', total: 63, ready: 47, image: IMG.tornado, icon: 'jet' },
      { key: 'transport', name: 'Transport Aircraft', platform: 'A400M Atlas', total: 55, ready: 41, image: IMG.transport, icon: 'jet' },
      { key: 'attackHeli', name: 'Attack Helicopters', platform: 'Eurocopter Tiger', total: 49, ready: 37, image: IMG.attackHeli, icon: 'heli' },
      { key: 'special', name: 'Special-Mission', platform: 'P-8A Poseidon', total: 27, ready: 20, image: IMG.special, icon: 'jet' },
      { key: 'trainer', name: 'Trainers', platform: 'Grob G 120TP', total: 16, ready: 12, image: IMG.trainer, icon: 'jet' },
      { key: 'tanker', name: 'Tanker Fleet', platform: 'A330 MRTT', total: 3, ready: 2, image: IMG.tanker, icon: 'jet' },
    ],
  },
];

const CYBER_PERSONNEL = 14028;
const ACTIVE_PERSONNEL = 184324;

export const GERMANY_MILITARY_PROFILE: MilitaryProfile = {
  iso3: 'DEU',
  countryName: 'Germany',
  overview: [
    { label: 'Global rank', value: '#12', sub: 'of 145 (GlobalFirePower 2026)' },
    { label: 'Power Index', value: '0.2463', sub: 'Lower is stronger (0 = perfect)' },
    { label: 'Active personnel', value: '184,324', sub: '+ 860,000 reserve' },
    { label: 'Reserve', value: '860,000', sub: 'Trained reserve force' },
    { label: 'Defense budget', value: '$127.4B', sub: 'Annual (2026)', accent: '#4ade80' },
  ],
  branches: BRANCHES,
  panels: [
    {
      id: 'cyberspace',
      title: 'Cyberspace',
      accent: CYBER_ACCENT,
      icon: 'cyber',
      headline: 'Cyber & Information Domain Service (CIR)',
      blurb: 'Germany’s 4th military branch since 2024 — not rated by GlobalFirePower.',
      stats: [
        { label: 'Personnel', value: '~14,000', sub: 'Active CIR soldiers (Jan 2024); ~16k incl. civilians' },
        {
          label: 'Share of active force',
          value: `${((CYBER_PERSONNEL / ACTIVE_PERSONNEL) * 100).toFixed(1)}%`,
          sub: 'of 184,324 active Bundeswehr personnel',
        },
        { label: 'Established', value: '2017', sub: 'Elevated to full service branch in 2024' },
        { label: 'Locations', value: '18 + 1', sub: 'Across Germany, plus one in the UK' },
      ],
      listTitle: 'Mission domains',
      items: [
        { name: 'Cyber defense', note: 'Network & weapons-system security' },
        { name: 'Electronic warfare', note: 'Jamming, spectrum & signals' },
        { name: 'Military intelligence', note: 'SIGINT & analysis' },
        { name: 'Geoinformation', note: 'Mapping, geodata & environment' },
        { name: 'Operational comms', note: 'Command & IT networks' },
      ],
      footnote:
        'Cyberspace figures: Bundeswehr / Cyber and Information Domain Service. GlobalFirePower does not score cyber forces, so these are reported separately.',
    },
  ],
  sources: [
    { label: 'GlobalFirePower — Germany (2026)', url: GFP_SOURCE_URL },
    { label: 'Bundeswehr CIR', url: CIR_SOURCE_URL },
  ],
  footnote:
    'Equipment photos via Wikimedia Commons contributors (CC BY-SA / public domain); representative platforms shown per category.',
  branchFootnote:
    'Counts & combat-ready figures: GlobalFirePower 2026. “Share of fleet” is each system’s percentage of its branch’s combat platforms (broad support/transport vehicles excluded).',
};
