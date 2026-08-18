import {
  AIR_ACCENT,
  ARMY_ACCENT,
  CYBER_ACCENT,
  NAVY_ACCENT,
  NUCLEAR_ACCENT,
  type Branch,
  type MilitaryProfile,
} from './types';

const GFP_SOURCE_URL = 'https://www.globalfirepower.com/country-military-strength-detail.php?country_id=russia';
const FAS_NUCLEAR_SOURCE_URL = 'https://fas.org/initiative/status-world-nuclear-forces/';
const CRS_NUCLEAR_SOURCE_URL = 'https://www.congress.gov/crs-product/IF12672';
const CISA_RUSSIA_SOURCE_URL =
  'https://www.cisa.gov/sites/default/files/publications/AA22-110A_Joint_CSA_Russian_State-Sponsored_and_Criminal_Cyber_Threats_to_Critical_Infrastructure_4_20_22_Final.pdf';

const IMG: Readonly<Record<string, string>> = {
  tanks: '/military/equipment/models/446522.jpg',
  vehicles: '/military/equipment/models/201977.jpg',
  selfPropelledArtillery: '/military/equipment/models/1183904.jpg',
  towedArtillery: '/military/equipment/models/15874399.jpg',
  mlrs: '/military/equipment/models/6013575.jpg',
  aircraftCarriers: '/military/equipment/models/29307.jpg',
  destroyers: '/military/equipment/models/2702113.jpg',
  frigates: '/military/equipment/models/19576704.jpg',
  corvettes: '/military/equipment/models/5971264.jpg',
  submarines: '/military/equipment/models/6851551.jpg',
  mineWarfare: '/military/equipment/models/30711334.jpg',
  fighters: '/military/equipment/models/314292.jpg',
  attackAircraft: '/military/equipment/models/1213828.jpg',
  transports: '/military/equipment/models/229943.jpg',
  trainers: '/military/equipment/models/1513240.jpg',
  helicopters: '/military/equipment/models/957233.jpg',
  special: '/military/equipment/models/1251978.jpg',
  tankers: '/military/equipment/models/1493162.jpg',
  attackHelicopters: '/military/equipment/models/16917.jpg',
};

const BRANCHES: Branch[] = [
  {
    id: 'ground-forces',
    title: 'Ground Forces',
    accent: ARMY_ACCENT,
    headline: '5,630 tanks · 126,512 armored vehicles',
    blurb: 'Russian Ground Forces — massed armor, tube artillery and one of the world’s largest rocket-artillery inventories.',
    items: [
      { key: 'tanks', name: 'Main Battle Tanks', platform: 'T-90 · T-80 · T-72', total: 5630, ready: 3941, image: IMG.tanks, icon: 'tank' },
      { key: 'afv', name: 'Armored Vehicles', platform: 'BMP-3 · BTR-82A · support fleet', total: 126512, ready: 88558, image: IMG.vehicles, icon: 'afv', support: true },
      { key: 'spg', name: 'Self-Propelled Artillery', platform: '2S19 Msta-S · 2S3 Akatsiya', total: 3603, ready: 2522, image: IMG.selfPropelledArtillery, icon: 'artillery' },
      { key: 'towed', name: 'Towed Artillery', platform: '2A65 Msta-B · D-30', total: 5920, ready: 4144, image: IMG.towedArtillery, icon: 'artillery' },
      { key: 'mlrs', name: 'Rocket Artillery (MLRS)', platform: 'Tornado · Smerch · Grad', total: 2486, ready: 1740, image: IMG.mlrs, icon: 'mlrs' },
    ],
  },
  {
    id: 'navy',
    title: 'Navy',
    accent: NAVY_ACCENT,
    headline: '747 naval assets · 66 submarines',
    blurb: 'Russian Navy — submarine-heavy fleet split across Northern, Pacific, Baltic, Black Sea and Caspian formations.',
    items: [
      { key: 'corvettes', name: 'Corvettes', platform: 'Steregushchiy · Buyan-M · Karakurt', total: 79, image: IMG.corvettes, icon: 'ship' },
      { key: 'patrol', name: 'Patrol Vessels', platform: 'Bykov-class · coastal patrol fleet', total: 70, icon: 'ship' },
      { key: 'subs', name: 'Submarines', platform: 'Borei SSBN · Yasen SSN · Kilo SSK', total: 66, image: IMG.submarines, icon: 'sub' },
      { key: 'mine', name: 'Mine Warfare', platform: 'Alexandrit-class mine countermeasures', total: 45, image: IMG.mineWarfare, icon: 'ship' },
      { key: 'destroyers', name: 'Destroyers', platform: 'Udaloy · Sovremenny', total: 13, image: IMG.destroyers, icon: 'ship' },
      { key: 'frigates', name: 'Frigates', platform: 'Admiral Gorshkov · Admiral Grigorovich', total: 12, image: IMG.frigates, icon: 'ship' },
      { key: 'carrier', name: 'Aircraft Carrier', platform: 'Admiral Kuznetsov', total: 1, image: IMG.aircraftCarriers, icon: 'ship' },
    ],
  },
  {
    id: 'aerospace-forces',
    title: 'Aerospace Forces',
    accent: AIR_ACCENT,
    headline: '4,237 aircraft & helicopters',
    blurb: 'VKS — tactical aviation, long-range aviation, rotary-wing forces, air defense and military space operations.',
    showShare: false,
    items: [
      { key: 'helicopters', name: 'Helicopters', platform: 'Mi-8 · Mi-26 · Ansat', total: 1643, ready: 1068, image: IMG.helicopters, icon: 'heli' },
      { key: 'fighters', name: 'Fighters', platform: 'Su-35 · Su-30SM · MiG-31', total: 861, ready: 560, image: IMG.fighters, icon: 'jet' },
      { key: 'attack', name: 'Attack Aircraft', platform: 'Su-34 · Su-24 · Su-25', total: 698, ready: 454, image: IMG.attackAircraft, icon: 'jet' },
      { key: 'attack-heli', name: 'Attack Helicopters', platform: 'Ka-52 · Mi-28N · Mi-24', total: 556, ready: 361, image: IMG.attackHelicopters, icon: 'heli' },
      { key: 'trainers', name: 'Trainers', platform: 'Yak-130 · L-39', total: 530, ready: 345, image: IMG.trainers, icon: 'jet' },
      { key: 'transport', name: 'Transport Aircraft', platform: 'Il-76 · An-124 · An-12', total: 458, ready: 298, image: IMG.transports, icon: 'jet' },
      { key: 'special', name: 'Special-Mission', platform: 'A-50 AEW&C · Il-20 reconnaissance', total: 137, ready: 89, image: IMG.special, icon: 'jet' },
      { key: 'tankers', name: 'Aerial Tankers', platform: 'Il-78 Midas', total: 18, ready: 12, image: IMG.tankers, icon: 'jet' },
    ],
  },
];

export const RUSSIA_MILITARY_PROFILE: MilitaryProfile = {
  iso3: 'RUS',
  countryName: 'Russia',
  overview: [
    { label: 'Global rank', value: '#2', sub: 'of 145 (GlobalFirePower 2026)' },
    { label: 'Power Index', value: '0.0791', sub: 'Lower is stronger (0 = perfect)' },
    { label: 'Active personnel', value: '1.32M', sub: 'GlobalFirePower estimate' },
    { label: 'Reserve', value: '2.00M', sub: 'GlobalFirePower estimate' },
    { label: 'Defense budget', value: '$212.6B', sub: 'Annual (2026)', accent: '#4ade80' },
    { label: 'Nuclear inventory', value: '~5,420', sub: 'FAS estimate (2026)', accent: NUCLEAR_ACCENT },
  ],
  branches: BRANCHES,
  panels: [
    {
      id: 'deterrent',
      title: 'Nuclear forces',
      accent: NUCLEAR_ACCENT,
      icon: 'nuclear',
      headline: 'Strategic triad and the world’s largest estimated nuclear inventory',
      blurb: 'Warhead estimates combine deployed, reserve and retired weapons; delivery-system counts come from Congressional Research Service reporting.',
      stats: [
        { label: 'Total inventory', value: '5,420', sub: 'Includes ~1,020 retired warheads awaiting dismantlement' },
        { label: 'Military stockpile', value: '4,400', sub: 'Deployed plus reserve / nondeployed' },
        { label: 'Deployed strategic', value: '1,796', sub: 'FAS estimate, 2026' },
        { label: 'Reserve / nondeployed', value: '2,604', sub: 'Strategic and nonstrategic weapons' },
      ],
      listTitle: 'Force components',
      items: [
        { name: 'Land-based leg', note: 'Approximately 324 intercontinental ballistic missiles, including road-mobile and silo-based systems.' },
        { name: 'Sea-based leg', note: '13 ballistic-missile submarines carrying a reported 208 submarine-launched ballistic missiles.' },
        { name: 'Air-based leg', note: 'Approximately 60 nuclear-capable strategic bombers assigned to long-range aviation.' },
        { name: 'Nonstrategic stockpile', note: 'FAS estimates roughly 1,794 nonstrategic warheads held in central storage.' },
      ],
      footnote: 'Warhead estimates: Federation of American Scientists, Status of World Nuclear Forces (2026). Delivery-system estimates: Congressional Research Service, Russian Nuclear Weapons.',
    },
    {
      id: 'cyber-operations',
      title: 'Cybersecurity & operations',
      accent: CYBER_ACCENT,
      icon: 'cyber',
      headline: 'Selected GRU, SVR and FSB-linked intrusion clusters',
      blurb: 'A non-exhaustive register of major publicly attributed Russian state-linked APT clusters and their documented campaigns.',
      stats: [
        { label: 'Attributed services', value: '3', sub: 'GRU · SVR · FSB' },
        { label: 'Selected clusters', value: '8', sub: 'Aliases consolidated to avoid double-counting' },
        { label: 'Mission sets', value: '3', sub: 'Espionage · disruption · influence' },
        { label: 'Operating scope', value: 'Global', sub: 'Government, defense and critical infrastructure' },
      ],
      listTitle: 'Publicly attributed actor register',
      items: [
        {
          name: 'APT28',
          aliases: 'Fancy Bear · Forest Blizzard · Sofacy · Pawn Storm · Sednit',
          attribution: 'GRU 26165',
          note: 'Military-intelligence cluster focused on credential theft, strategic espionage and influence-support operations.',
          operations: [
            'Compromise and release operation targeting the US Democratic National Committee in 2016.',
            'Long-running targeting of government, defense and security organizations; compromised routers used for collection and traffic interception.',
          ],
          sourceUrl: 'https://attack.mitre.org/groups/G0007/',
        },
        {
          name: 'Sandworm Team',
          aliases: 'Seashell Blizzard · APT44 · Voodoo Bear · ELECTRUM',
          attribution: 'GRU 74455',
          note: 'Disruptive and destructive operations unit with a sustained focus on Ukraine and critical infrastructure.',
          operations: [
            'Ukraine power-grid disruptions in 2015 and 2016 and renewed electric-sector attacks during the full-scale invasion.',
            'NotPetya global destructive campaign in 2017; Olympic Destroyer disruption at the 2018 Winter Games.',
          ],
          sourceUrl: 'https://attack.mitre.org/groups/G0034/',
        },
        {
          name: 'Ember Bear',
          aliases: 'Cadet Blizzard · DEV-0586 · UNC2589 · Bleeding Bear · Frozenvista',
          attribution: 'GRU 29155',
          note: 'Military-intelligence cluster conducting destructive, espionage and access operations against Ukraine, NATO members and other targets.',
          operations: [
            'WhisperGate destructive malware deployed against Ukrainian organizations in January 2022.',
            'Coordinated defacement of Ukrainian government websites before the full-scale invasion.',
          ],
          sourceUrl: 'https://attack.mitre.org/groups/G1003/',
        },
        {
          name: 'APT29',
          aliases: 'Midnight Blizzard · Cozy Bear · NOBELIUM · The Dukes',
          attribution: 'SVR',
          note: 'Foreign-intelligence service cluster specializing in patient diplomatic, policy and cloud-identity espionage.',
          operations: [
            'SolarWinds Orion supply-chain compromise, attributed by the US and UK to the SVR in 2021.',
            'Compromise of the US Democratic National Committee beginning in 2015 and persistent targeting of governments and think tanks.',
          ],
          sourceUrl: 'https://attack.mitre.org/groups/G0016/',
        },
        {
          name: 'Turla',
          aliases: 'Secret Blizzard · Snake · Venomous Bear · Waterbug · Krypton',
          attribution: 'FSB',
          note: 'Long-running cyber-espionage platform associated with Russia’s Federal Security Service and high-value diplomatic targets.',
          operations: [
            'Compromised government, diplomatic, military and research networks in more than 50 countries since at least 2004.',
            'Operated the Snake peer-to-peer malware infrastructure disrupted by US authorities in 2023.',
          ],
          sourceUrl: 'https://attack.mitre.org/groups/G0010/',
        },
        {
          name: 'Star Blizzard',
          aliases: 'COLDRIVER · Callisto Group · SEABORGIUM · TA446',
          attribution: 'FSB-linked',
          note: 'Credential-phishing and influence cluster targeting people with access to Russia-related policy and defense information.',
          operations: [
            'Persistent spear-phishing of government, defense, academic, NGO and think-tank targets in NATO countries.',
            'Use of impersonation, adversary-in-the-middle phishing and the Spica backdoor for targeted collection.',
          ],
          sourceUrl: 'https://attack.mitre.org/groups/G1033/',
        },
        {
          name: 'Gamaredon Group',
          aliases: 'Aqua Blizzard · Primitive Bear · Armageddon · Shuckworm',
          attribution: 'FSB 18',
          note: 'High-tempo espionage cluster primarily focused on Ukrainian government, military, law-enforcement and civil-society networks.',
          operations: [
            'Sustained Ukraine-focused intrusion activity since at least 2013, using large-volume spear-phishing and rapidly changing infrastructure.',
            'Repeated deployment of Pterodo-family tools for access, collection and exfiltration.',
          ],
          sourceUrl: 'https://attack.mitre.org/groups/G0047/',
        },
        {
          name: 'Dragonfly',
          aliases: 'Energetic Bear · Berserk Bear · Ghost Blizzard · Crouching Yeti',
          attribution: 'FSB 16',
          note: 'Critical-infrastructure espionage cluster associated with FSB Center 16 and operational-technology targeting.',
          operations: [
            'Supply-chain, spear-phishing and watering-hole campaigns against energy and industrial-control organizations.',
            'Worldwide targeting of government, aviation, defense and critical-infrastructure networks since at least 2010.',
          ],
          sourceUrl: 'https://attack.mitre.org/groups/G0035/',
        },
      ],
      footnote: 'APT names are defender tracking labels, not official unit names. Vendors may split or merge the same activity differently, so no public list can be exhaustive. This register consolidates major clusters with public government or MITRE attribution; criminal groups and loosely aligned hacktivists are excluded.',
    },
  ],
  sources: [
    { label: 'GlobalFirePower — Russia (2026)', url: GFP_SOURCE_URL },
    { label: 'FAS — Status of World Nuclear Forces (2026)', url: FAS_NUCLEAR_SOURCE_URL },
    { label: 'Congressional Research Service — Russian Nuclear Weapons', url: CRS_NUCLEAR_SOURCE_URL },
    { label: 'CISA — Russian state-sponsored cyber threats', url: CISA_RUSSIA_SOURCE_URL },
    { label: 'MITRE ATT&CK — Group knowledge base', url: 'https://attack.mitre.org/groups/' },
  ],
  footnote: 'Equipment photographs are representative platform images from Wikimedia Commons contributors; inventory and readiness figures are estimates and may change with losses, repair, storage status and reclassification.',
  branchFootnote: 'Counts and estimated combat-ready figures: GlobalFirePower 2026. Air-role categories overlap, so fleet-share meters are suppressed for the Aerospace Forces. The carrier count reflects listed inventory, not operational availability.',
};
