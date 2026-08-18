/**
 * Russo-Ukrainian War — reported order of battle, fortification belts and known fixed sites.
 *
 * This is the standing-forces companion to `russoUkraineWar.ts`, which owns the control map and
 * the incident pins. Three datasets:
 *
 *   • {@link WAR_FORMATIONS} — the named operational formations both sides have publicly
 *     acknowledged, each anchored to the **axis it is reported to hold**, not to a headquarters.
 *   • {@link WAR_DEFENSIVE_LINES} — the fortification belts described in public reporting,
 *     drawn schematically between the settlements those reports name.
 *   • {@link WAR_MILITARY_SITES} — fixed installations that are long-established public
 *     infrastructure: airfields on published aeronautical charts, fleet bases, and the two
 *     general staffs.
 *
 * ## What the coordinates mean
 *
 * Formation and defensive-line coordinates are **sector anchors and schematic paths**, accurate
 * to tens of kilometres. They say "this formation is reported to hold this axis" and "a belt is
 * reported along these towns" — they are not unit positions, and nothing here is traced from
 * imagery. Every record carries `precision` so the globe can print that caveat on the card
 * rather than letting a dot be read as a location.
 *
 * Force dispositions move faster than any curated file. Read this as of {@link OOB_ASSESSED_AT},
 * alongside the dated control snapshot in `warFrontlineGeometry.ts` — never as live.
 */

/** The date this order of battle was compiled from the sources below. */
export const OOB_ASSESSED_AT = '2026-08-08';

export type WarSide = 'RUS' | 'UKR';

/**
 * `sector` — anchored to a reported axis of responsibility, good to tens of kilometres.
 * `facility` — a fixed, publicly charted installation at its published location.
 */
export type WarPrecision = 'sector' | 'facility';

/**
 * Command level, which drives the echelon marks drawn above the unit symbol — the APP-6
 * convention, so `XX` division, `XXX` corps, `XXXX` army, `XXXXX` front / grouping of forces,
 * `XXXXXX` theatre command.
 */
export type WarEchelon = 'division' | 'corps' | 'army' | 'grouping' | 'command';

export interface WarOobSource {
  organization: string;
  title: string;
  url: string;
}

export interface WarFormation {
  id: string;
  side: WarSide;
  echelon: WarEchelon;
  /** Formation name as publicly used. */
  name: string;
  /** Short tag for the marker card. */
  code: string;
  /** The axis or region this formation is reported to hold. */
  sector: string;
  /** Commander where publicly reported, with the year of the report. */
  commander?: string;
  /** Formations named as subordinate in public reporting. */
  subordinates: readonly string[];
  precision: WarPrecision;
  coordinate: readonly [longitude: number, latitude: number];
  note: string;
  sources: readonly WarOobSource[];
}

export interface WarDefensiveLine {
  id: string;
  side: WarSide;
  name: string;
  /** Reported state of the works, as of {@link OOB_ASSESSED_AT}. */
  status: 'established' | 'under construction';
  /** Schematic path through the settlements public reporting names. */
  path: readonly (readonly [longitude: number, latitude: number])[];
  note: string;
  sources: readonly WarOobSource[];
}

export type WarSiteKind = 'airbase' | 'naval' | 'hq';

export interface WarMilitarySite {
  id: string;
  side: WarSide;
  kind: WarSiteKind;
  name: string;
  /** Settlement / oblast, for the card footer. */
  place: string;
  coordinate: readonly [longitude: number, latitude: number];
  note: string;
  sources: readonly WarOobSource[];
}

// ── Sources ─────────────────────────────────────────────────────────────────

const ISW: WarOobSource = {
  organization: 'Institute for the Study of War',
  title: 'Russian Offensive Campaign Assessment',
  url: 'https://www.understandingwar.org/backgrounder/russian-offensive-campaign-assessment',
};

const JGF_WIKI: WarOobSource = {
  organization: 'Wikipedia',
  title: 'Joint Group of Forces in Ukraine',
  url: 'https://en.wikipedia.org/wiki/Joint_Group_of_Forces_in_Ukraine',
};

const JAMESTOWN_CORPS: WarOobSource = {
  organization: 'Jamestown Foundation',
  title: "Ukraine's Military Transitioning to Corps-Based Command Structure",
  url: 'https://jamestown.org/ukraines-military-transitioning-to-corps-based-command-structure/',
};

const KYIV_INDEPENDENT_CORPS: WarOobSource = {
  organization: 'Kyiv Independent',
  title: "'Second stage' of Ukrainian military's corps reform underway, Syrskyi says",
  url: 'https://kyivindependent.com/second-stage-of-ukrainian-militarys-corps-reform-underway-syrskyi-says/',
};

const MILITARYLAND: WarOobSource = {
  organization: 'MilitaryLand.net',
  title: 'Ukrainian Army Transitions from Brigade to Corps System',
  url: 'https://militaryland.net/news/ukrainian-army-transitions-from-brigade-to-corps-system/',
};

const SUROVIKIN_LINE: WarOobSource = {
  organization: 'Wikipedia',
  title: 'Surovikin line',
  url: 'https://en.wikipedia.org/wiki/Surovikin_line',
};

const AFRICK_FORTIFICATIONS: WarOobSource = {
  organization: 'Brady Africk',
  title: 'Russian field fortifications in Ukraine (satellite imagery analysis)',
  url: 'https://read.bradyafrick.com/p/russian-field-fortifications-in-ukraine',
};

const KYIV_INDEPENDENT_LINES: WarOobSource = {
  organization: 'Kyiv Independent',
  title: "Where does Russia expect Ukraine's counterattack? Overview of defensive lines",
  url: 'https://kyivindependent.com/where-does-russia-expect-ukraines-counterattack-overview-of-defensive-lines/',
};

const UKRINFORM_FORTS: WarOobSource = {
  organization: 'Ukrinform',
  title: 'Ukraine builds 2,130 platoon strongpoints in frontline regions',
  url: 'https://www.ukrinform.net/rubric-defense/4071742-ukraine-builds-2130-platoon-strongpoints-in-frontline-regions.html',
};

const UNITED24_NORTH_LINE: WarOobSource = {
  organization: 'UNITED24 Media',
  title: 'Ukraine Builds 100km Deep Defense Line From Kyiv Reservoir to Sumy',
  url: 'https://united24media.com/latest-news/ukraine-builds-100km-deep-defense-line-from-kyiv-reservoir-to-sumy-to-stop-any-new-advance-18291',
};

const NV_FORTS: WarOobSource = {
  organization: 'The New Voice of Ukraine',
  title: 'Ukraine builds fortifications in at least 45 cities for long-term defense',
  url: 'https://english.nv.ua/nation/ukraine-builds-fortifications-in-at-least-45-cities-for-long-term-defense-50605191.html',
};

const KYIV_INDEPENDENT_ENGELS: WarOobSource = {
  organization: 'Kyiv Independent',
  title: "Russia's Engels air base reportedly struck in Ukrainian drone attack",
  url: 'https://kyivindependent.com/russias-engels-air-base-reportedly-struck-in-ukrainian-drone-attack/',
};

const NEWSWEEK_CRIMEA: WarOobSource = {
  organization: 'Newsweek',
  title: 'Crimea Airfields Left Without Russian Aircraft After Strikes, Ukraine Says',
  url: 'https://www.newsweek.com/crimea-airfields-russia-aircraft-strikes-ukraine-1934279',
};

const WIKI_RGF: WarOobSource = {
  organization: 'Wikipedia',
  title: 'Russian Ground Forces — structure and army headquarters',
  url: 'https://en.wikipedia.org/wiki/Russian_Ground_Forces',
};

const WIKI_POKROVSK_OOB: WarOobSource = {
  organization: 'Wikipedia',
  title: 'Pokrovsk offensive order of battle',
  url: 'https://en.wikipedia.org/wiki/Pokrovsk_offensive_order_of_battle',
};

const WIKI_KUPIANSK: WarOobSource = {
  organization: 'Wikipedia',
  title: 'Kupiansk offensive',
  url: 'https://en.wikipedia.org/wiki/Kupiansk_offensive',
};

const WIKI_HULIAIPOLE: WarOobSource = {
  organization: 'Wikipedia',
  title: 'Huliaipole offensive',
  url: 'https://en.wikipedia.org/wiki/Huliaipole_offensive',
};

const WIKI_6TH_CAA: WarOobSource = {
  organization: 'Wikipedia',
  title: '6th Guards Combined Arms Army',
  url: 'https://en.wikipedia.org/wiki/6th_Guards_Combined_Arms_Army',
};

/** MilitaryLand publishes a garrison town for each Ukrainian corps; `corps` fills in the number. */
const militaryLandCorps = (slug: string, corps: string): WarOobSource => ({
  organization: 'MilitaryLand.net',
  title: `${corps} — unit page`,
  url: `https://militaryland.net/ukraine/armed-forces/${slug}/`,
});

const WIKI_15TH_CORPS: WarOobSource = {
  organization: 'Wikipedia',
  title: '15th Army Corps (Ukraine)',
  url: 'https://en.wikipedia.org/wiki/15th_Army_Corps_(Ukraine)',
};

const MILITARYLAND_ALL_CORPS: WarOobSource = {
  organization: 'MilitaryLand.net',
  title: 'All known Army Corps',
  url: 'https://militaryland.net/news/all-known-army-corps-as-of-april-2025/',
};

// ── Formations ──────────────────────────────────────────────────────────────

/**
 * Russia fights the war through six named groupings of forces under the Joint Group of Forces at
 * Rostov-on-Don; Ukraine reorganised from operational-strategic groups into a corps structure
 * across 2025–2026, with four operational commands above eighteen corps. The anchors below sit
 * on each formation's reported axis, on its own side of the line of contact.
 */
export const WAR_FORMATIONS: readonly WarFormation[] = [
  // ── Russian groupings of forces ──────────────────────────────────────────
  {
    id: 'rus-sever',
    side: 'RUS',
    echelon: 'grouping',
    name: 'Grouping of Forces "Sever" (North)',
    code: 'SEVER',
    sector: 'Kursk and Kharkiv directions',
    commander: 'Col. Gen. Alexander Lapin (reported on formation, 2024)',
    subordinates: ['Belgorod group', 'Kursk group', 'Bryansk group'],
    precision: 'sector',
    coordinate: [35.5, 51.15],
    note: 'Formed in 2024 to hold the border axis; covers the Kursk and northern Kharkiv directions. Anchored on its own side of the international border, in Kursk Oblast.',
    sources: [JGF_WIKI, ISW],
  },
  {
    id: 'rus-zapad',
    side: 'RUS',
    echelon: 'grouping',
    name: 'Grouping of Forces "Zapad" (West)',
    code: 'ZAPAD',
    sector: 'Kupiansk direction — state border to Svatove',
    subordinates: ['1st Guards Tank Army', '6th Combined Arms Army', '20th Combined Arms Army'],
    precision: 'sector',
    coordinate: [38.15, 49.6],
    note: 'Holds the Kupiansk–Svatove axis between the international border and the Oskil.',
    sources: [JGF_WIKI, ISW],
  },
  {
    id: 'rus-tsentr',
    side: 'RUS',
    echelon: 'grouping',
    name: 'Grouping of Forces "Tsentr" (Center)',
    code: 'TSENTR',
    sector: 'Lyman and Pokrovsk directions',
    commander: 'Col. Gen. Andrey Ivanaev (reported 2026)',
    subordinates: ['2nd Combined Arms Army', '41st Combined Arms Army', '90th Guards Tank Division'],
    precision: 'sector',
    coordinate: [37.55, 48.35],
    note: 'The main effort grouping through 2026, pressing the Pokrovsk and Dobropillia axes.',
    sources: [JGF_WIKI, ISW],
  },
  {
    id: 'rus-yug',
    side: 'RUS',
    echelon: 'grouping',
    name: 'Grouping of Forces "Yug" (South)',
    code: 'YUG',
    sector: 'Donetsk direction, including the Bakhmut area',
    subordinates: ['3rd Combined Arms Army', '8th Guards Combined Arms Army', '51st Combined Arms Army'],
    precision: 'sector',
    coordinate: [38.15, 48.6],
    note: 'Holds the Donetsk city and Bakhmut–Chasiv Yar sector.',
    sources: [JGF_WIKI, ISW],
  },
  {
    id: 'rus-vostok',
    side: 'RUS',
    echelon: 'grouping',
    name: 'Grouping of Forces "Vostok" (East)',
    code: 'VOSTOK',
    sector: 'South Donetsk direction toward Robotyne–Verbove',
    subordinates: ['5th Combined Arms Army', '35th Combined Arms Army', '36th Combined Arms Army'],
    precision: 'sector',
    coordinate: [36.6, 47.7],
    note: 'Runs the seam between the Donetsk and Zaporizhzhia axes.',
    sources: [JGF_WIKI, ISW],
  },
  {
    id: 'rus-dnepr',
    side: 'RUS',
    echelon: 'grouping',
    name: 'Grouping of Forces "Dnepr"',
    code: 'DNEPR',
    sector: 'Kherson direction, along the Dnipro',
    subordinates: ['18th Combined Arms Army', '49th Combined Arms Army', 'Airborne elements'],
    precision: 'sector',
    coordinate: [33.6, 46.7],
    note: 'Holds the Dnipro left bank and the western Zaporizhzhia flank; ISW has described it as increasingly made up of disparate elements.',
    sources: [JGF_WIKI, ISW],
  },
  {
    id: 'rus-jgf',
    side: 'RUS',
    echelon: 'command',
    name: 'Joint Group of Forces in Ukraine',
    code: 'JGF',
    sector: 'Theatre command, all six groupings',
    commander: 'Gen. Valery Gerasimov (since January 2023)',
    subordinates: ['Sever', 'Zapad', 'Tsentr', 'Yug', 'Vostok', 'Dnepr'],
    precision: 'facility',
    coordinate: [39.72, 47.24],
    note: 'Theatre headquarters at Rostov-on-Don, co-located with the Southern Military District.',
    sources: [JGF_WIKI],
  },

  // ── Ukrainian commands and corps ─────────────────────────────────────────
  {
    id: 'ukr-general-staff',
    side: 'UKR',
    echelon: 'command',
    name: 'General Staff of the Armed Forces of Ukraine',
    code: 'GENSTAFF',
    sector: 'Theatre command, four operational commands',
    commander: 'Gen. Oleksandr Syrskyi (Commander-in-Chief)',
    subordinates: [
      'Operational Command North',
      'Operational Command East',
      'Operational Command South',
      'Operational Command West',
    ],
    precision: 'facility',
    coordinate: [30.53, 50.45],
    note: 'Kyiv. Directed the 2025–2026 reform from operational-strategic groups to a corps structure — 18 corps formed, two of them National Guard.',
    sources: [JAMESTOWN_CORPS, KYIV_INDEPENDENT_CORPS],
  },
  {
    id: 'ukr-oc-north',
    side: 'UKR',
    echelon: 'command',
    name: 'Operational Command North',
    code: 'OC-NORTH',
    sector: 'Kharkiv oblast and parts of Luhansk oblast',
    subordinates: [
      '3rd Army Corps',
      '10th Army Corps',
      '12th Army Corps',
      '16th Army Corps',
      '2nd Khartiia Corps (National Guard)',
    ],
    precision: 'sector',
    coordinate: [36.5, 49.85],
    note: 'Holds the northern half of the theatre, from the Sumy border down to the Oskil.',
    sources: [JAMESTOWN_CORPS, MILITARYLAND],
  },
  {
    id: 'ukr-oc-east',
    side: 'UKR',
    echelon: 'command',
    name: 'Operational Command East',
    code: 'OC-EAST',
    sector: 'Donetsk axis — Pokrovsk, Kostiantynivka, south Donetsk',
    subordinates: [
      '9th Army Corps',
      '11th Army Corps',
      '19th Army Corps',
      '20th Army Corps',
      '7th Rapid Response Corps (Air Assault Forces)',
      '1st Azov Corps (National Guard)',
    ],
    precision: 'sector',
    coordinate: [36.8, 48.45],
    note: 'The heaviest-committed command, facing the Tsentr and Yug groupings.',
    sources: [JAMESTOWN_CORPS, MILITARYLAND],
  },
  {
    id: 'ukr-3rd-corps',
    side: 'UKR',
    echelon: 'corps',
    name: '3rd Army Corps',
    code: '3 AC',
    sector: 'Kharkiv–Kupiansk axis',
    subordinates: ['3rd Assault Brigade', 'Attached unmanned systems regiment'],
    precision: 'sector',
    coordinate: [37.1, 49.75],
    note: 'Grown out of the 3rd Assault Brigade; one of five corps under the northern grouping.',
    sources: [JAMESTOWN_CORPS, MILITARYLAND],
  },
  {
    id: 'ukr-2nd-khartiia',
    side: 'UKR',
    echelon: 'corps',
    name: '2nd Khartiia Corps (National Guard)',
    code: '2 NGU',
    sector: 'Kharkiv axis',
    subordinates: ['13th Khartiia Brigade'],
    precision: 'sector',
    coordinate: [36.75, 50.05],
    note: 'One of the two National Guard corps raised in the reform.',
    sources: [JAMESTOWN_CORPS, MILITARYLAND],
  },
  {
    id: 'ukr-7th-rrc',
    side: 'UKR',
    echelon: 'corps',
    name: '7th Rapid Response Corps (Air Assault Forces)',
    code: '7 RRC',
    sector: 'Pokrovsk',
    subordinates: ['Air assault brigades of the DShV'],
    precision: 'sector',
    coordinate: [37.0, 48.32],
    note: "The corps' first assigned mission was the defence of Pokrovsk; anchored on the held ground behind that axis, not on the town.",
    sources: [KYIV_INDEPENDENT_CORPS, MILITARYLAND],
  },
  {
    id: 'ukr-1st-azov',
    side: 'UKR',
    echelon: 'corps',
    name: '1st Azov Corps (National Guard)',
    code: '1 NGU',
    sector: 'Northern Donetsk axis, adjacent to the 7th Corps',
    subordinates: ['12th Azov Brigade'],
    precision: 'sector',
    coordinate: [37.15, 48.6],
    note: 'Runs joint command-post exercises with the 7th Corps because their sectors adjoin.',
    sources: [JAMESTOWN_CORPS, MILITARYLAND],
  },
  {
    id: 'ukr-30th-marine',
    side: 'UKR',
    echelon: 'corps',
    name: '30th Marine Corps',
    code: '30 MC',
    sector: 'Kherson front, Dnipro right bank',
    subordinates: ['35th, 36th, 37th, 38th Marine Brigades'],
    precision: 'sector',
    coordinate: [32.7, 46.68],
    note: 'Holds the Dnipro river line opposite the Dnepr grouping.',
    sources: [JAMESTOWN_CORPS, MILITARYLAND],
  },

  // ── Russian armies and divisions, by the axis their commitment is reported on ──────────
  //
  // Only formations whose axis a published order of battle actually attributes appear here.
  // Several more armies are committed to the war without a public axis attribution; those are
  // in WAR_GARRISONS at their home station instead of being guessed onto a sector.
  {
    id: 'rus-2nd-caa',
    side: 'RUS',
    echelon: 'army',
    name: '2nd Guards Combined Arms Army',
    code: '2 CAA',
    sector: 'Pokrovsk axis',
    commander: 'Maj. Gen. Vyacheslav Gurov (reported)',
    subordinates: ['15th, 21st, 30th Motor Rifle Brigades'],
    precision: 'sector',
    coordinate: [37.42, 48.22],
    note: 'Central Military District army, home-stationed at Samara, listed in the Pokrovsk order of battle. Anchored on the axis east of Pokrovsk, not on a headquarters.',
    sources: [WIKI_POKROVSK_OOB, WIKI_RGF],
  },
  {
    id: 'rus-41st-caa',
    side: 'RUS',
    echelon: 'army',
    name: '41st Guards Combined Arms Army',
    code: '41 CAA',
    sector: 'Pokrovsk axis',
    commander: 'Lt. Gen. Sergey Ryzhkov (reported)',
    subordinates: ['35th and 74th Guards Motor Rifle Brigades', '55th Mountain Motor Rifle Brigade'],
    precision: 'sector',
    coordinate: [37.3, 48.1],
    note: 'Central Military District army, home-stationed at Novosibirsk. Sector anchor west of Donetsk on the Pokrovsk axis.',
    sources: [WIKI_POKROVSK_OOB, WIKI_RGF],
  },
  {
    id: 'rus-51st-caa',
    side: 'RUS',
    echelon: 'army',
    name: '51st Guards Combined Arms Army',
    code: '51 CAA',
    sector: 'Pokrovsk axis',
    commander: 'Lt. Gen. Sergei Milchakov (reported)',
    subordinates: ['Formerly the 1st Donetsk Army Corps'],
    precision: 'sector',
    coordinate: [37.6, 48.15],
    note: 'Raised from the 1st Donetsk Army Corps and headquartered in occupied Donetsk. Sector anchor on its reported Pokrovsk-axis frontage.',
    sources: [WIKI_POKROVSK_OOB, WIKI_RGF],
  },
  {
    id: 'rus-8th-caa',
    side: 'RUS',
    echelon: 'army',
    name: '8th Guards Combined Arms Army',
    code: '8 CAA',
    sector: 'Toretsk–Kostiantynivka axis',
    subordinates: ['20th and 150th Guards Motor Rifle Divisions'],
    precision: 'sector',
    coordinate: [37.9, 48.42],
    note: 'Home-stationed at Novocherkassk; named in the Pokrovsk order of battle and reported to hold the Toretsk approaches toward Kostiantynivka.',
    sources: [WIKI_POKROVSK_OOB, WIKI_RGF, ISW],
  },
  {
    id: 'rus-68th-corps',
    side: 'RUS',
    echelon: 'corps',
    name: '68th Guards Army Corps',
    code: '68 AC',
    sector: 'South of Pokrovsk',
    commander: 'Lt. Gen. Dmitry Glushenkov (reported)',
    subordinates: ['Eastern Military District rifle formations'],
    precision: 'sector',
    coordinate: [37.05, 47.95],
    note: 'Eastern Military District corps listed in the Pokrovsk order of battle. Anchored on the southern shoulder of that axis.',
    sources: [WIKI_POKROVSK_OOB],
  },
  {
    id: 'rus-90th-tank',
    side: 'RUS',
    echelon: 'division',
    name: '90th Guards Tank Division',
    code: '90 TD',
    sector: 'North of Pokrovsk',
    subordinates: ['6th, 80th and 239th Tank Regiments'],
    precision: 'sector',
    coordinate: [37.25, 48.4],
    note: 'Central Military District armoured division committed on the Pokrovsk axis. A division symbol, not a unit position.',
    sources: [WIKI_POKROVSK_OOB],
  },
  {
    id: 'rus-1st-gta',
    side: 'RUS',
    echelon: 'army',
    name: '1st Guards Tank Army',
    code: '1 GTA',
    sector: 'Kupiansk axis',
    subordinates: ['2nd Guards Motor Rifle Division', '4th Guards Tank Division'],
    precision: 'sector',
    coordinate: [37.95, 49.75],
    note: 'Moscow Military District tank army, home-stationed at Odintsovo, reported committed on the Kupiansk axis. Anchored east of the Oskil.',
    sources: [WIKI_KUPIANSK, WIKI_RGF],
  },
  {
    id: 'rus-6th-caa',
    side: 'RUS',
    echelon: 'army',
    name: '6th Combined Arms Army',
    code: '6 CAA',
    sector: 'Kupiansk–Oskil axis',
    subordinates: ['25th and 27th Motor Rifle Brigades', '69th Motor Rifle Division'],
    precision: 'sector',
    coordinate: [38.05, 49.9],
    note: 'Leningrad Military District army, home-stationed at Agalatovo. Fought the Svatove–Kreminna line and is reported on the Kupiansk axis.',
    sources: [WIKI_6TH_CAA, WIKI_KUPIANSK],
  },
  {
    id: 'rus-127th-mrd',
    side: 'RUS',
    echelon: 'division',
    name: '127th Motor Rifle Division',
    code: '127 MRD',
    sector: 'Huliaipole axis',
    subordinates: ['114th Motor Rifle Regiment'],
    precision: 'sector',
    coordinate: [36.35, 47.55],
    note: 'Eastern Military District division named in the Huliaipole order of battle, alongside the 36th–38th Guards Motor Rifle Brigades.',
    sources: [WIKI_HULIAIPOLE],
  },

  // ── Further Ukrainian corps with a publicly reported sector ────────────────────────────
  {
    id: 'ukr-11th-corps',
    side: 'UKR',
    echelon: 'corps',
    name: '11th Army Corps',
    code: '11 AC',
    sector: 'Chasiv Yar–Siversk',
    subordinates: ['Mechanised brigades of Operational Command East'],
    precision: 'sector',
    coordinate: [37.45, 48.7],
    note: 'Garrisoned at Rivne; took over the Chasiv Yar and Siversk sector when Tactical Group Luhansk was disbanded in July 2025. Anchored behind that frontage.',
    sources: [militaryLandCorps('11th-army-corps', '11th Army Corps')],
  },
  {
    id: 'ukr-17th-corps',
    side: 'UKR',
    echelon: 'corps',
    name: '17th Army Corps',
    code: '17 AC',
    sector: 'Zaporizhzhia direction',
    subordinates: ['Brigades of Operational Command South'],
    precision: 'sector',
    coordinate: [35.3, 47.7],
    note: 'Garrisoned in Zaporizhzhia city and assigned to the Zaporizhzhia direction of the front.',
    sources: [militaryLandCorps('17th-army-corps', '17th Army Corps')],
  },
  {
    id: 'ukr-19th-corps',
    side: 'UKR',
    echelon: 'corps',
    name: '19th Army Corps',
    code: '19 AC',
    sector: 'Dobropillia–Pokrovsk',
    subordinates: ['Brigades of Operational Command South'],
    precision: 'sector',
    coordinate: [36.95, 48.45],
    note: 'Garrisoned at Odesa; redeployed to the Dobropillia and Pokrovsk sector between late 2025 and early 2026.',
    sources: [militaryLandCorps('19th-army-corps', '19th Army Corps')],
  },
  {
    id: 'ukr-20th-corps',
    side: 'UKR',
    echelon: 'corps',
    name: '20th Army Corps',
    code: '20 AC',
    sector: 'Huliaipole',
    subordinates: [
      '17th Heavy Mechanised Brigade',
      '23rd, 31st, 33rd and 141st Mechanised Brigades',
      '60th Artillery Brigade',
    ],
    precision: 'sector',
    coordinate: [35.95, 47.85],
    note: 'Garrisoned at Kryvyi Rih under Operational Command East, and named in the Huliaipole order of battle. Anchored in the rear of that axis.',
    sources: [WIKI_HULIAIPOLE, militaryLandCorps('20th-army-corps', '20th Army Corps')],
  },
];

// ── Defensive lines ─────────────────────────────────────────────────────────

/**
 * Schematic belts, drawn between the settlements public reporting names — not traced from
 * imagery. Where a source describes "three belts across Zaporizhzhia", that is three paths here.
 */
export const WAR_DEFENSIVE_LINES: readonly WarDefensiveLine[] = [
  {
    id: 'rus-surovikin-zap-first',
    side: 'RUS',
    name: 'Surovikin Line — Zaporizhzhia first belt',
    status: 'established',
    path: [
      [35.35, 47.5],
      [35.45, 47.48],
      [35.83, 47.44],
      [36.03, 47.47],
      [36.26, 47.48],
      [36.62, 47.55],
    ],
    note: 'Vasylivka–Robotyne–Verbove–Polohy. The forward belt of trenches, anti-tank ditches and dragon\'s teeth that stopped the 2023 counteroffensive; Robotyne was its hinge.',
    sources: [SUROVIKIN_LINE, KYIV_INDEPENDENT_LINES, AFRICK_FORTIFICATIONS],
  },
  {
    id: 'rus-surovikin-zap-second',
    side: 'RUS',
    name: 'Surovikin Line — Zaporizhzhia second belt',
    status: 'established',
    path: [
      [35.18, 47.3],
      [35.45, 47.27],
      [35.71, 47.25],
      [36.0, 47.26],
      [36.3, 47.3],
    ],
    note: 'The Tokmak belt — the deeper of the two main lines across the oblast, anchored on the town itself.',
    sources: [SUROVIKIN_LINE, AFRICK_FORTIFICATIONS],
  },
  {
    id: 'rus-surovikin-zap-third',
    side: 'RUS',
    name: 'Surovikin Line — Zaporizhzhia rear belt',
    status: 'established',
    path: [
      [35.3, 47.05],
      [35.72, 47.03],
      [36.1, 47.06],
      [36.45, 47.12],
    ],
    note: 'Molochansk–Chernihivka. The rearmost of the three Zaporizhzhia subsystems.',
    sources: [SUROVIKIN_LINE, AFRICK_FORTIFICATIONS],
  },
  {
    id: 'rus-dnipro-bank',
    side: 'RUS',
    name: 'Dnipro left-bank line (Kherson)',
    status: 'established',
    path: [
      [33.37, 46.75],
      [33.0, 46.7],
      [32.71, 46.62],
      [32.52, 46.52],
      [32.1, 46.48],
    ],
    note: 'Kherson relies on the river rather than layered belts: the Dnipro and its delta are the obstacle, with positions dug along the left bank.',
    sources: [SUROVIKIN_LINE, KYIV_INDEPENDENT_LINES],
  },
  {
    id: 'rus-crimea-isthmus',
    side: 'RUS',
    name: 'Crimean isthmus fortifications',
    status: 'established',
    path: [
      [33.62, 46.17],
      [33.69, 46.11],
      [34.02, 46.08],
      [34.32, 46.05],
      [34.62, 46.1],
    ],
    note: 'Perekop–Armiansk–Chonhar. The land bridge onto the peninsula, fortified across all three crossings.',
    sources: [SUROVIKIN_LINE, AFRICK_FORTIFICATIONS],
  },
  {
    id: 'rus-luhansk-rear',
    side: 'RUS',
    name: 'Luhansk rear line',
    status: 'established',
    path: [
      [38.9, 49.4],
      [39.0, 49.0],
      [39.15, 48.75],
      [39.31, 48.57],
    ],
    note: 'Starobilsk–Luhansk. Depth positions behind the Svatove–Kreminna axis, part of the Luhansk subsystem of the wider line.',
    sources: [SUROVIKIN_LINE, KYIV_INDEPENDENT_LINES],
  },
  {
    id: 'ukr-donbas-line-sloviansk',
    side: 'UKR',
    name: 'New Donbas Line — Sloviansk–Kramatorsk belt',
    status: 'under construction',
    path: [
      [37.28, 48.98],
      [37.3, 48.8],
      [37.32, 48.64],
      [37.3, 48.5],
    ],
    note: 'The western face of the Sloviansk–Kramatorsk agglomeration. Part of the 350 km "New Donbas Line" begun in 2025 across Donetsk, Dnipropetrovsk and Kharkiv oblasts.',
    sources: [UKRINFORM_FORTS, NV_FORTS],
  },
  {
    id: 'ukr-donbas-line-pokrovsk',
    side: 'UKR',
    name: 'New Donbas Line — Pokrovsk–Dobropillia sector',
    status: 'under construction',
    path: [
      [37.05, 48.62],
      [37.0, 48.42],
      [36.92, 48.24],
      [36.75, 48.08],
    ],
    note: 'Depth positions behind the most heavily pressed axis of 2026, held by the 7th Rapid Response Corps.',
    sources: [UKRINFORM_FORTS, NV_FORTS],
  },
  {
    id: 'ukr-donbas-line-dnipropetrovsk',
    side: 'UKR',
    name: 'New Donbas Line — Dnipropetrovsk sector',
    status: 'under construction',
    path: [
      [36.35, 48.55],
      [35.9, 48.52],
      [35.5, 48.5],
      [35.05, 48.48],
    ],
    note: 'The westward extension of the line, covering the Pavlohrad approaches.',
    sources: [UKRINFORM_FORTS, NV_FORTS],
  },
  {
    id: 'ukr-zaporizhzhia-belt',
    side: 'UKR',
    name: 'Zaporizhzhia city belt',
    status: 'established',
    path: [
      [34.92, 47.98],
      [35.12, 47.85],
      [35.3, 47.76],
      [35.52, 47.74],
    ],
    note: 'Reported as one of the closest to complete of the 2025–2026 works, together with the Novomykolaivka area.',
    sources: [UKRINFORM_FORTS, NV_FORTS],
  },
  {
    id: 'ukr-kharkiv-belt',
    side: 'UKR',
    name: 'Kharkiv city belt',
    status: 'under construction',
    path: [
      [35.98, 50.12],
      [36.15, 50.28],
      [36.42, 50.25],
      [36.62, 50.18],
    ],
    note: 'One of at least 45 cities where Ukraine has built fortification lines around the centre itself, not only forward of it.',
    sources: [NV_FORTS, UKRINFORM_FORTS],
  },
  {
    id: 'ukr-northern-border-line',
    side: 'UKR',
    name: 'Northern border line (Kyiv Reservoir – Chernihiv – Sumy)',
    status: 'under construction',
    path: [
      [30.55, 51.12],
      [31.3, 51.52],
      [32.4, 51.72],
      [33.6, 51.55],
      [34.3, 51.2],
      [34.8, 50.95],
    ],
    note: 'A continuous line along the Belarusian and Russian borders, reported in April 2026 as being built at priority to close off any renewed northern advance.',
    sources: [UNITED24_NORTH_LINE, UKRINFORM_FORTS],
  },
];

// ── Fixed sites ─────────────────────────────────────────────────────────────

/**
 * Long-established installations that appear on published aeronautical charts and in years of
 * open reporting — not newly identified locations.
 */
export const WAR_MILITARY_SITES: readonly WarMilitarySite[] = [
  {
    id: 'rus-engels-2',
    side: 'RUS',
    kind: 'airbase',
    name: 'Engels-2 air base',
    place: 'Saratov Oblast, Russia',
    coordinate: [46.21, 51.48],
    note: 'Strategic bomber base for the Tu-95 and Tu-160 fleets used in long-range missile salvos; repeatedly struck by Ukrainian drones.',
    sources: [KYIV_INDEPENDENT_ENGELS],
  },
  {
    id: 'rus-olenya',
    side: 'RUS',
    kind: 'airbase',
    name: 'Olenya air base',
    place: 'Murmansk Oblast, Russia',
    coordinate: [33.46, 68.15],
    note: 'Arctic dispersal field for strategic bombers, far beyond the front but inside Ukrainian long-range drone reach.',
    sources: [KYIV_INDEPENDENT_ENGELS],
  },
  {
    id: 'rus-millerovo',
    side: 'RUS',
    kind: 'airbase',
    name: 'Millerovo air base',
    place: 'Rostov Oblast, Russia',
    coordinate: [40.3, 48.95],
    note: 'Tactical fighter base close to the border; struck in the opening weeks of the 2022 invasion and repeatedly since.',
    sources: [
      {
        organization: 'Wikipedia',
        title: 'Millerovo air base attack',
        url: 'https://en.wikipedia.org/wiki/Millerovo_air_base_attack',
      },
    ],
  },
  {
    id: 'rus-morozovsk',
    side: 'RUS',
    kind: 'airbase',
    name: 'Morozovsk air base',
    place: 'Rostov Oblast, Russia',
    coordinate: [41.79, 48.31],
    note: 'Su-34 base and a main store for the glide bombs used against frontline cities.',
    sources: [KYIV_INDEPENDENT_ENGELS],
  },
  {
    id: 'rus-saky',
    side: 'RUS',
    kind: 'airbase',
    name: 'Saky (Novofedorivka) air base',
    place: 'Crimea',
    coordinate: [33.6, 45.09],
    note: 'Naval aviation field on the west coast of the peninsula.',
    sources: [NEWSWEEK_CRIMEA],
  },
  {
    id: 'rus-belbek',
    side: 'RUS',
    kind: 'airbase',
    name: 'Belbek air base',
    place: 'Sevastopol, Crimea',
    coordinate: [33.57, 44.69],
    note: 'Fighter base covering Sevastopol and the Black Sea Fleet anchorage.',
    sources: [NEWSWEEK_CRIMEA],
  },
  {
    id: 'rus-dzhankoi',
    side: 'RUS',
    kind: 'airbase',
    name: 'Dzhankoi air base',
    place: 'Crimea',
    coordinate: [34.42, 45.7],
    note: 'Helicopter and air-defence hub at the northern end of the peninsula, behind the isthmus fortifications.',
    sources: [NEWSWEEK_CRIMEA],
  },
  {
    id: 'rus-hvardiiske',
    side: 'RUS',
    kind: 'airbase',
    name: 'Hvardiiske air base',
    place: 'Central Crimea',
    coordinate: [34.02, 45.1],
    note: 'Central Crimean field, one of the five airbases Ukrainian reporting names on the peninsula.',
    sources: [NEWSWEEK_CRIMEA],
  },
  {
    id: 'rus-sevastopol',
    side: 'RUS',
    kind: 'naval',
    name: 'Sevastopol naval base',
    place: 'Crimea',
    coordinate: [33.53, 44.62],
    note: 'Historic main base of the Black Sea Fleet; surface units were dispersed east after repeated missile and USV attacks.',
    sources: [NEWSWEEK_CRIMEA],
  },
  {
    id: 'rus-novorossiysk',
    side: 'RUS',
    kind: 'naval',
    name: 'Novorossiysk naval base',
    place: 'Krasnodar Krai, Russia',
    coordinate: [37.79, 44.72],
    note: 'The Black Sea Fleet\'s fallback anchorage, and a major crude export terminal alongside it.',
    sources: [ISW],
  },
  {
    id: 'rus-rostov-hq',
    side: 'RUS',
    kind: 'hq',
    name: 'Southern Military District / Joint Group of Forces HQ',
    place: 'Rostov-on-Don, Russia',
    coordinate: [39.72, 47.24],
    note: 'Theatre headquarters for the whole Ukrainian operation.',
    sources: [JGF_WIKI],
  },
  {
    id: 'ukr-genstaff',
    side: 'UKR',
    kind: 'hq',
    name: 'General Staff of the Armed Forces of Ukraine',
    place: 'Kyiv, Ukraine',
    coordinate: [30.53, 50.45],
    note: 'Directs the four operational commands and the corps under them.',
    sources: [JAMESTOWN_CORPS],
  },
  {
    id: 'ukr-starokostiantyniv',
    side: 'UKR',
    kind: 'airbase',
    name: 'Starokostiantyniv air base',
    place: 'Khmelnytskyi Oblast, Ukraine',
    coordinate: [27.18, 49.75],
    note: 'Su-24M base, the field associated with Ukraine\'s air-launched cruise missiles and a standing Russian target.',
    sources: [ISW],
  },
  {
    id: 'ukr-myrhorod',
    side: 'UKR',
    kind: 'airbase',
    name: 'Myrhorod air base',
    place: 'Poltava Oblast, Ukraine',
    coordinate: [33.65, 49.93],
    note: 'Tactical aviation field in the centre of the country.',
    sources: [ISW],
  },
  {
    id: 'ukr-vasylkiv',
    side: 'UKR',
    kind: 'airbase',
    name: 'Vasylkiv air base',
    place: 'Kyiv Oblast, Ukraine',
    coordinate: [30.33, 50.24],
    note: 'Air base south of Kyiv, struck in the first hours of the 2022 invasion.',
    sources: [ISW],
  },
  {
    id: 'ukr-ozerne',
    side: 'UKR',
    kind: 'airbase',
    name: 'Ozerne air base',
    place: 'Zhytomyr Oblast, Ukraine',
    coordinate: [28.74, 50.16],
    note: 'Western-approaches field serving the Kyiv and Zhytomyr axis.',
    sources: [ISW],
  },
  {
    id: 'ukr-kulbakino',
    side: 'UKR',
    kind: 'airbase',
    name: 'Kulbakino air base',
    place: 'Mykolaiv, Ukraine',
    coordinate: [32.03, 46.94],
    note: 'Southern field behind the Kherson sector.',
    sources: [ISW],
  },
];

// ── Garrisons ───────────────────────────────────────────────────────────────

export interface WarGarrison {
  id: string;
  side: WarSide;
  /** Formation the garrison is the home station of. */
  formation: string;
  /** Short tag for the marker card. */
  code: string;
  /** Settlement and oblast / region, as the source gives it. */
  place: string;
  coordinate: readonly [longitude: number, latitude: number];
  /** Where the formation is reported committed, when that is public. */
  committedTo?: string;
  note: string;
  sources: readonly WarOobSource[];
}

/**
 * Permanent home stations — the garrison a formation is *administratively based* at, which is
 * published reference data rather than a field disposition.
 *
 * This is the one dataset here that leaves the theatre on purpose. Half the Russian armies fighting
 * in Ukraine are home-stationed in Siberia and the Far East, and plotting Belogorsk or Ussuriysk
 * next to a Donbas sector anchor is the whole point: it shows how far the commitment reaches back.
 * A garrison marker says "this formation's peacetime base is here" — never "this formation is
 * here". Coordinates are the settlement centre, not an installation.
 */
export const WAR_GARRISONS: readonly WarGarrison[] = [
  // ── Russian army headquarters ────────────────────────────────────────────
  {
    id: 'gar-rus-1-gta',
    side: 'RUS',
    formation: '1st Guards Tank Army',
    code: '1 GTA',
    place: 'Odintsovo, Moscow Oblast',
    coordinate: [37.28, 55.68],
    committedTo: 'Kupiansk axis',
    note: 'Moscow Military District tank army.',
    sources: [WIKI_RGF, WIKI_KUPIANSK],
  },
  {
    id: 'gar-rus-20-caa',
    side: 'RUS',
    formation: '20th Guards Combined Arms Army',
    code: '20 CAA',
    place: 'Voronezh, Voronezh Oblast',
    coordinate: [39.18, 51.67],
    note: 'Moscow Military District army, based on the Ukrainian border axis.',
    sources: [WIKI_RGF],
  },
  {
    id: 'gar-rus-6-caa',
    side: 'RUS',
    formation: '6th Combined Arms Army',
    code: '6 CAA',
    place: 'Agalatovo, Leningrad Oblast',
    coordinate: [30.23, 60.17],
    committedTo: 'Kupiansk–Oskil axis',
    note: 'Leningrad Military District army — the longest redeployment of any army on the northern axes.',
    sources: [WIKI_RGF, WIKI_6TH_CAA],
  },
  {
    id: 'gar-rus-3-caa',
    side: 'RUS',
    formation: '3rd Guards Combined Arms Army',
    code: '3 CAA',
    place: 'Luhansk, occupied Luhansk Oblast',
    coordinate: [39.31, 48.57],
    note: 'Raised from the 2nd Luhansk Army Corps; headquartered inside occupied territory.',
    sources: [WIKI_RGF],
  },
  {
    id: 'gar-rus-8-caa',
    side: 'RUS',
    formation: '8th Guards Combined Arms Army',
    code: '8 CAA',
    place: 'Novocherkassk, Rostov Oblast',
    coordinate: [40.09, 47.42],
    committedTo: 'Toretsk–Kostiantynivka axis',
    note: 'Southern Military District army, based one step behind the Donbas front.',
    sources: [WIKI_RGF, WIKI_POKROVSK_OOB],
  },
  {
    id: 'gar-rus-18-caa',
    side: 'RUS',
    formation: '18th Combined Arms Army',
    code: '18 CAA',
    place: 'Sevastopol, occupied Crimea',
    // Inland of the naval base's coordinate, which is deliberately the harbour water.
    coordinate: [33.6, 44.58],
    note: 'Southern Military District army headquartered in occupied Crimea.',
    sources: [WIKI_RGF],
  },
  {
    id: 'gar-rus-49-caa',
    side: 'RUS',
    formation: '49th Combined Arms Army',
    code: '49 CAA',
    place: 'Stavropol, Stavropol Krai',
    coordinate: [41.97, 45.04],
    note: 'Southern Military District army.',
    sources: [WIKI_RGF],
  },
  {
    id: 'gar-rus-51-caa',
    side: 'RUS',
    formation: '51st Guards Combined Arms Army',
    code: '51 CAA',
    place: 'Donetsk, occupied Donetsk Oblast',
    coordinate: [37.8, 48.01],
    committedTo: 'Pokrovsk axis',
    note: 'Raised from the 1st Donetsk Army Corps; headquartered inside occupied territory.',
    sources: [WIKI_RGF, WIKI_POKROVSK_OOB],
  },
  {
    id: 'gar-rus-58-caa',
    side: 'RUS',
    formation: '58th Guards Combined Arms Army',
    code: '58 CAA',
    place: 'Vladikavkaz, North Ossetia',
    coordinate: [44.68, 43.04],
    note: 'Southern Military District army, home-stationed in the North Caucasus.',
    sources: [WIKI_RGF],
  },
  {
    id: 'gar-rus-2-caa',
    side: 'RUS',
    formation: '2nd Guards Combined Arms Army',
    code: '2 CAA',
    place: 'Samara, Samara Oblast',
    coordinate: [50.1, 53.2],
    committedTo: 'Pokrovsk axis',
    note: 'Central Military District army.',
    sources: [WIKI_RGF, WIKI_POKROVSK_OOB],
  },
  {
    id: 'gar-rus-41-caa',
    side: 'RUS',
    formation: '41st Guards Combined Arms Army',
    code: '41 CAA',
    place: 'Novosibirsk, Novosibirsk Oblast',
    coordinate: [82.92, 55.03],
    committedTo: 'Pokrovsk axis',
    note: 'Central Military District army — home-stationed 4,500 km from the axis it fights on.',
    sources: [WIKI_RGF, WIKI_POKROVSK_OOB],
  },
  {
    id: 'gar-rus-5-caa',
    side: 'RUS',
    formation: '5th Guards Combined Arms Army',
    code: '5 CAA',
    place: 'Ussuriysk, Primorsky Krai',
    coordinate: [131.95, 43.8],
    note: 'Eastern Military District army, home-stationed near the Chinese and North Korean borders.',
    sources: [WIKI_RGF],
  },
  {
    id: 'gar-rus-29-caa',
    side: 'RUS',
    formation: '29th Guards Combined Arms Army',
    code: '29 CAA',
    place: 'Chita, Zabaykalsky Krai',
    coordinate: [113.5, 52.03],
    note: 'Eastern Military District army.',
    sources: [WIKI_RGF],
  },
  {
    id: 'gar-rus-35-caa',
    side: 'RUS',
    formation: '35th Combined Arms Army',
    code: '35 CAA',
    place: 'Belogorsk, Amur Oblast',
    coordinate: [128.47, 50.92],
    note: 'Eastern Military District army.',
    sources: [WIKI_RGF],
  },
  {
    id: 'gar-rus-36-caa',
    side: 'RUS',
    formation: '36th Combined Arms Army',
    code: '36 CAA',
    place: 'Ulan-Ude, Buryatia',
    coordinate: [107.58, 51.83],
    note: 'Eastern Military District army.',
    sources: [WIKI_RGF],
  },

  // ── Ukrainian corps garrisons ────────────────────────────────────────────
  //
  // Three corps are garrisoned in Kyiv and two in Rivne. Where a garrison is shared the markers
  // are nudged a few hundred metres apart, the same way the incident pins are, so a stack of
  // symbols does not hide the ones underneath.
  {
    id: 'gar-ukr-3-ac',
    side: 'UKR',
    formation: '3rd Army Corps',
    code: '3 AC',
    place: 'Kyiv',
    coordinate: [30.5, 50.46],
    committedTo: 'Kharkiv–Kupiansk axis',
    note: 'Grown out of the 3rd Assault Brigade.',
    sources: [militaryLandCorps('3rd-army-corps', '3rd Army Corps')],
  },
  {
    id: 'gar-ukr-12-ac',
    side: 'UKR',
    formation: '12th Army Corps',
    code: '12 AC',
    place: 'Kyiv',
    coordinate: [30.55, 50.44],
    note: 'One of the four corps stood up first in the reform.',
    sources: [militaryLandCorps('12th-army-corps', '12th Army Corps')],
  },
  {
    id: 'gar-ukr-14-ac',
    side: 'UKR',
    formation: '14th Army Corps',
    code: '14 AC',
    place: 'Kyiv',
    coordinate: [30.47, 50.42],
    note: 'Under Operational Command West.',
    sources: [militaryLandCorps('14th-army-corps', '14th Army Corps')],
  },
  {
    id: 'gar-ukr-9-ac',
    side: 'UKR',
    formation: '9th Army Corps',
    code: '9 AC',
    place: 'Lutsk, Volyn Oblast',
    coordinate: [25.34, 50.75],
    note: 'Mechanised troops under Operational Command East, garrisoned on the western border.',
    sources: [militaryLandCorps('9th-army-corps', '9th Army Corps')],
  },
  {
    id: 'gar-ukr-10-ac',
    side: 'UKR',
    formation: '10th Army Corps',
    code: '10 AC',
    place: 'Poltava, Poltava Oblast',
    coordinate: [34.55, 49.59],
    note: 'Mechanised troops under Operational Command North.',
    sources: [militaryLandCorps('10th-army-corps', '10th Army Corps')],
  },
  {
    id: 'gar-ukr-11-ac',
    side: 'UKR',
    formation: '11th Army Corps',
    code: '11 AC',
    place: 'Rivne, Rivne Oblast',
    coordinate: [26.25, 50.62],
    committedTo: 'Chasiv Yar–Siversk',
    note: 'Mechanised troops under Operational Command East.',
    sources: [militaryLandCorps('11th-army-corps', '11th Army Corps')],
  },
  {
    id: 'gar-ukr-15-ac',
    side: 'UKR',
    formation: '15th Army Corps',
    code: '15 AC',
    place: 'Rivne Oblast',
    coordinate: [26.3, 50.58],
    note: 'Fields the 10th Mountain Assault, 129th Heavy Mechanised and 143rd/144th/158th Mechanised Brigades among others.',
    sources: [WIKI_15TH_CORPS],
  },
  {
    id: 'gar-ukr-16-ac',
    side: 'UKR',
    formation: '16th Army Corps',
    code: '16 AC',
    place: 'Kharkiv Oblast',
    coordinate: [36.23, 49.99],
    note: 'Mechanised troops under Operational Command North. The source gives the oblast, not a town.',
    sources: [militaryLandCorps('16th-army-corps', '16th Army Corps')],
  },
  {
    id: 'gar-ukr-17-ac',
    side: 'UKR',
    formation: '17th Army Corps',
    code: '17 AC',
    place: 'Zaporizhzhia, Zaporizhzhia Oblast',
    coordinate: [35.14, 47.84],
    committedTo: 'Zaporizhzhia direction',
    note: 'Under Operational Command South, garrisoned in the city it defends.',
    sources: [militaryLandCorps('17th-army-corps', '17th Army Corps')],
  },
  {
    id: 'gar-ukr-18-ac',
    side: 'UKR',
    formation: '18th Army Corps',
    code: '18 AC',
    place: 'Cherkasy Oblast',
    coordinate: [32.06, 49.44],
    note: 'Under Operational Command West. The source gives the oblast, not a town.',
    sources: [militaryLandCorps('18th-army-corps', '18th Army Corps')],
  },
  {
    id: 'gar-ukr-19-ac',
    side: 'UKR',
    formation: '19th Army Corps',
    code: '19 AC',
    place: 'Odesa, Odesa Oblast',
    coordinate: [30.72, 46.48],
    committedTo: 'Dobropillia–Pokrovsk',
    note: 'Under Operational Command South; redeployed east across late 2025 and early 2026.',
    sources: [militaryLandCorps('19th-army-corps', '19th Army Corps')],
  },
  {
    id: 'gar-ukr-20-ac',
    side: 'UKR',
    formation: '20th Army Corps',
    code: '20 AC',
    place: 'Kryvyi Rih, Dnipropetrovsk Oblast',
    coordinate: [33.39, 47.91],
    committedTo: 'Huliaipole',
    note: 'Under Operational Command East; its combat core was reported complete at the start of 2026.',
    sources: [militaryLandCorps('20th-army-corps', '20th Army Corps')],
  },
  {
    id: 'gar-ukr-1-azov',
    side: 'UKR',
    formation: '1st Azov Corps (National Guard)',
    code: '1 NGU',
    place: 'Bucha, Kyiv Oblast',
    coordinate: [30.21, 50.55],
    committedTo: 'Dobropillia area',
    note: 'National Guard corps built on the 12th Azov Brigade; its command element moved to the Dobropillia area in August 2025.',
    sources: [militaryLandCorps('1st-azov-corps', '1st Azov Corps'), MILITARYLAND_ALL_CORPS],
  },
];

/** Side palette. Deliberately not the war-event palette — these are standing forces, not incidents. */
export const WAR_SIDE_META: Record<WarSide, { label: string; color: string }> = {
  UKR: { label: 'Ukraine', color: '#4ea8ff' },
  RUS: { label: 'Russia', color: '#ff5a52' },
};
