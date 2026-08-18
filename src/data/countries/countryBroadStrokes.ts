import type {
  PoliticsLeftismData,
  LeftistGroup,
  LeftStatCard,
} from '../../components/countries/germany/GermanyPoliticsLeftismSection';
import type {
  PoliticsRightWingData,
  RightMetric,
  RightWingGroup,
} from '../../components/countries/germany/GermanyPoliticsRightWingSection';
import type { EstimateCard } from '../../components/countries/template/CountryEstimateCards';

/**
 * Broad-stroke orientation figures for the 45 countries whose dossier is still the Germany
 * template (see `lib/countryTemplateStatus`).
 *
 * **These are rough estimates, not sourced statistics.** They are compiled from general reference
 * knowledge as of mid-2026, rounded, and meant to give each dossier a defensible shape while the
 * real national sources are gathered. Every panel built from them is wrapped in an amber
 * `EstimateBlock`, and every figure carries its reference year so a stale one is obvious. Where a
 * value would be a guess rather than an estimate it is left out, and the slot renders as a red
 * "Data needed" tile instead.
 *
 * The curated dossiers (Germany, France, Italy, Spain) are deliberately absent — they have their
 * own sourced data modules and must never fall back to this table.
 */

export type PartyLine = {
  /** Party name as commonly written in English, with the native abbreviation. */
  name: string;
  /** Most recent national vote share, or seat count where share is not meaningful. */
  support: string;
  /** One line: what the party is and how it stands. */
  note: string;
};

export type CountryBroadStrokes = {
  iso3: string;
  name: string;
  /** Head of government, with party and the date they took office. */
  headOfGovernment: string;
  /** Governing arrangement in one line. */
  governingBloc: string;
  /** Chambers and seat counts. */
  legislature: string;
  /** Most recent national election this table reflects. */
  lastElection: string;
  /** Left/progressive bloc, strongest first. */
  left: readonly PartyLine[];
  /** Right/conservative/national-populist bloc, strongest first. */
  right: readonly PartyLine[];
  tax: {
    topIncome: string;
    corporate: string;
    vat: string;
    socialContributions: string;
    taxToGdp: string;
  };
  trade: {
    exportsPctGdp: string;
    exportPartners: string;
    importPartners: string;
    leadingExports: string;
  };
  migration: {
    foreignBornShare: string;
    topOrigins: string;
    netMigration: string;
    muslimShare: string;
  };
  family: {
    marriageRate: string;
    divorceRate: string;
    meanAgeFirstMarriage: string;
    birthsOutsideMarriage: string;
  };
  water: {
    fluoridation: string;
    regime: string;
  };
};

/** Reference year attached to every estimate card unless a field overrides it. */
const REF = '≈2024 · estimate';

const BROAD_STROKES: readonly CountryBroadStrokes[] = [
  {
    iso3: 'AUS',
    name: 'Australia',
    headOfGovernment: 'PM Anthony Albanese (Australian Labor Party), since May 2022',
    governingBloc: 'Labor majority government, re-elected with an increased majority',
    legislature: 'House of Representatives 150 · Senate 76',
    lastElection: 'May 2025 federal election',
    left: [
      { name: 'Australian Labor Party (ALP)', support: '~34.6%', note: 'Governing party; primary vote at the 2025 federal election' },
      { name: 'Australian Greens', support: '~12%', note: 'Left-environmentalist; strong Senate presence, lost most lower-house seats' },
    ],
    right: [
      { name: 'Liberal–National Coalition', support: '~32%', note: 'Main opposition; worst result in decades' },
      { name: "Pauline Hanson's One Nation", support: '~6%', note: 'Right-populist, anti-immigration; Senate representation' },
    ],
    tax: {
      topIncome: '45% + 2% Medicare levy',
      corporate: '30% (25% for small business)',
      vat: 'GST 10%',
      socialContributions: 'Superannuation guarantee ~11.5%',
      taxToGdp: '~29.5%',
    },
    trade: {
      exportsPctGdp: '~26%',
      exportPartners: 'China, Japan, South Korea, India, United States',
      importPartners: 'China, United States, Japan, South Korea, Thailand',
      leadingExports: 'Iron ore, coal, LNG, gold, education services',
    },
    migration: {
      foreignBornShare: '~30.7%',
      topOrigins: 'India, United Kingdom, China, New Zealand, Philippines',
      netMigration: '~+340,000/yr, easing from the post-COVID peak',
      muslimShare: '~3.2%',
    },
    family: {
      marriageRate: '~5.5 per 1,000',
      divorceRate: '~2.3 per 1,000',
      meanAgeFirstMarriage: '~32 men / ~30 women',
      birthsOutsideMarriage: '~38%',
    },
    water: { fluoridation: 'Fluoridated — ~89% of the population', regime: 'State schemes under NHMRC guidance' },
  },
  {
    iso3: 'AUT',
    name: 'Austria',
    headOfGovernment: 'Chancellor Christian Stocker (ÖVP), since March 2025',
    governingBloc: 'ÖVP–SPÖ–NEOS coalition, formed to exclude the FPÖ',
    legislature: 'Nationalrat 183 · Bundesrat 60',
    lastElection: 'September 2024 legislative election',
    left: [
      { name: 'Social Democratic Party (SPÖ)', support: '~21.1%', note: 'Historic centre-left; junior coalition partner' },
      { name: 'The Greens', support: '~8.2%', note: 'Left-environmentalist; left government in 2025' },
    ],
    right: [
      { name: 'Freedom Party (FPÖ)', support: '~28.8%', note: 'National-populist; won the election but was excluded from government' },
      { name: "Austrian People's Party (ÖVP)", support: '~26.3%', note: 'Christian-democratic; holds the chancellery' },
    ],
    tax: {
      topIncome: '55% above €1m',
      corporate: '23%',
      vat: '20% standard',
      socialContributions: '~18% employee / ~21% employer',
      taxToGdp: '~43%',
    },
    trade: {
      exportsPctGdp: '~57%',
      exportPartners: 'Germany, Italy, United States, Switzerland',
      importPartners: 'Germany, Italy, China, Czechia',
      leadingExports: 'Machinery, vehicles and parts, pharmaceuticals, iron and steel',
    },
    migration: {
      foreignBornShare: '~20.5%',
      topOrigins: 'Germany, Turkey, Serbia, Romania, Syria',
      netMigration: '~+50,000/yr',
      muslimShare: '~8%',
    },
    family: {
      marriageRate: '~5.0 per 1,000',
      divorceRate: '~1.7 per 1,000',
      meanAgeFirstMarriage: '~33 men / ~31 women',
      birthsOutsideMarriage: '~42%',
    },
    water: { fluoridation: 'Not fluoridated', regime: 'EU Drinking Water Directive; fluoridated salt available' },
  },
  {
    iso3: 'BEL',
    name: 'Belgium',
    headOfGovernment: 'PM Bart De Wever (N-VA), since February 2025',
    governingBloc: '"Arizona" coalition: N-VA, MR, Les Engagés, Vooruit, CD&V',
    legislature: 'Chamber of Representatives 150 · Senate 60',
    lastElection: 'June 2024 federal election',
    left: [
      { name: 'Workers’ Party (PVDA/PTB)', support: '~9.9%', note: 'Marxist; strongest far-left force in Western Europe' },
      { name: 'Socialist Party (PS)', support: '~8.4%', note: 'Francophone centre-left, dominant in Wallonia' },
      { name: 'Vooruit', support: '~7.1%', note: 'Flemish social democrats; in the federal coalition' },
    ],
    right: [
      { name: 'New Flemish Alliance (N-VA)', support: '~16.7%', note: 'Flemish-nationalist conservative; holds the premiership' },
      { name: 'Vlaams Belang', support: '~13.8%', note: 'Flemish separatist far right; excluded by the cordon sanitaire' },
      { name: 'Reformist Movement (MR)', support: '~10.6%', note: 'Francophone liberals; strongest result in decades' },
    ],
    tax: {
      topIncome: '50% plus municipal surcharge',
      corporate: '25%',
      vat: '21% standard',
      socialContributions: '13.07% employee / ~25% employer',
      taxToGdp: '~43%',
    },
    trade: {
      exportsPctGdp: '~85%',
      exportPartners: 'Germany, France, Netherlands, United States',
      importPartners: 'Netherlands, Germany, France, United States',
      leadingExports: 'Pharmaceuticals, chemicals, vehicles, diamonds, refined fuels',
    },
    migration: {
      foreignBornShare: '~18%',
      topOrigins: 'Morocco, France, Netherlands, Italy, Romania',
      netMigration: '~+60,000/yr',
      muslimShare: '~8%',
    },
    family: {
      marriageRate: '~3.9 per 1,000',
      divorceRate: '~2.0 per 1,000',
      meanAgeFirstMarriage: '~34 men / ~32 women',
      birthsOutsideMarriage: '~54%',
    },
    water: { fluoridation: 'Not fluoridated', regime: 'Regional water authorities under the EU directive' },
  },
  {
    iso3: 'BGR',
    name: 'Bulgaria',
    headOfGovernment: 'PM Rumen Radev, since May 2026 (verify — change is recent)',
    governingBloc: 'Post-2024 arrangement after seven elections in three years',
    legislature: 'National Assembly 240',
    lastElection: 'October 2024 parliamentary election',
    left: [{ name: 'Bulgarian Socialist Party (BSP)', support: '~7%', note: 'Post-communist left; much diminished' }],
    right: [
      { name: 'GERB-SDS', support: '~26%', note: 'Centre-right, EPP-aligned; largest party' },
      { name: 'Revival (Vazrazhdane)', support: '~13%', note: 'Nationalist, pro-Russian, anti-euro' },
    ],
    tax: {
      topIncome: '10% flat',
      corporate: '10%',
      vat: '20% standard',
      socialContributions: '~13.8% employee / ~18.9% employer',
      taxToGdp: '~30%',
    },
    trade: {
      exportsPctGdp: '~50%',
      exportPartners: 'Germany, Romania, Italy, Turkey, Greece',
      importPartners: 'Germany, Turkey, Romania, Italy',
      leadingExports: 'Refined fuels, copper, wheat, machinery, pharmaceuticals',
    },
    migration: {
      foreignBornShare: '~3%',
      topOrigins: 'Russia, Turkey, Ukraine, Syria',
      netMigration: 'Roughly balanced after decades of outflow',
      muslimShare: '~10% (long-established Turkish and Pomak communities)',
    },
    family: {
      marriageRate: '~3.6 per 1,000',
      divorceRate: '~1.4 per 1,000',
      meanAgeFirstMarriage: '~32 men / ~29 women',
      birthsOutsideMarriage: '~59%',
    },
    water: { fluoridation: 'Not fluoridated', regime: 'EU directive; regional supply quality varies' },
  },
  {
    iso3: 'BIH',
    name: 'Bosnia and Herzegovina',
    headOfGovernment: 'Chair of the Council of Ministers Borjana Krišto (HDZ BiH), since January 2023',
    governingBloc: 'Cross-entity coalition under the tripartite Presidency',
    legislature: 'House of Representatives 42 · House of Peoples 15',
    lastElection: 'October 2022 general election',
    left: [{ name: 'Social Democratic Party (SDP BiH)', support: '~7%', note: 'Multi-ethnic centre-left' }],
    right: [
      { name: 'Party of Democratic Action (SDA)', support: '~17%', note: 'Bosniak national-conservative' },
      { name: 'Alliance of Independent Social Democrats (SNSD)', support: 'Dominant in Republika Srpska', note: 'Serb-nationalist; secessionist rhetoric under Dodik' },
      { name: 'Croatian Democratic Union (HDZ BiH)', support: 'Dominant among Croats', note: 'Holds the Council of Ministers chair' },
    ],
    tax: {
      topIncome: '10% flat',
      corporate: '10%',
      vat: '17% standard',
      socialContributions: '~31–41% depending on entity',
      taxToGdp: '~36%',
    },
    trade: {
      exportsPctGdp: '~40%',
      exportPartners: 'Germany, Croatia, Serbia, Italy, Slovenia',
      importPartners: 'Croatia, Serbia, Germany, Italy',
      leadingExports: 'Base metals, furniture, electricity, footwear, machinery',
    },
    migration: {
      foreignBornShare: '~1%',
      topOrigins: 'Serbia, Croatia, Turkey — inflow is small; outflow dominates',
      netMigration: '~-20,000/yr; sustained emigration of working-age adults',
      muslimShare: '~51%',
    },
    family: {
      marriageRate: '~5.5 per 1,000',
      divorceRate: '~0.9 per 1,000',
      meanAgeFirstMarriage: '~31 men / ~28 women',
      birthsOutsideMarriage: '~14%',
    },
    water: { fluoridation: 'Not fluoridated', regime: 'Entity-level standards; rural supply gaps' },
  },
  {
    iso3: 'BLR',
    name: 'Belarus',
    headOfGovernment: 'PM Aleksandr Turchin (2025); President Alexander Lukashenko since 1994',
    governingBloc: 'Presidential authoritarian rule; no functioning opposition',
    legislature: 'House of Representatives 110 · Council of the Republic 64',
    lastElection: 'January 2025 presidential (Lukashenko ~86.8%); February 2024 parliamentary',
    left: [{ name: 'Communist Party of Belarus (KPB)', support: 'Regime-aligned', note: 'Loyal party, not an opposition force' }],
    right: [{ name: 'Belaya Rus', support: 'Regime party', note: 'Converted from a state movement into a party in 2023' }],
    tax: {
      topIncome: '13% flat',
      corporate: '20%',
      vat: '20% standard',
      socialContributions: '~35% (mostly employer)',
      taxToGdp: '~25%',
    },
    trade: {
      exportsPctGdp: '~65%',
      exportPartners: 'Russia (~65%), China, Ukraine (pre-war), Kazakhstan',
      importPartners: 'Russia, China, Germany',
      leadingExports: 'Potash, refined petroleum, trucks and tractors, dairy',
    },
    migration: {
      foreignBornShare: '~11% (largely post-Soviet)',
      topOrigins: 'Russia, Ukraine, Kazakhstan',
      netMigration: 'Politically driven emigration since 2020',
      muslimShare: '~0.5%',
    },
    family: {
      marriageRate: '~6.0 per 1,000',
      divorceRate: '~3.6 per 1,000',
      meanAgeFirstMarriage: '~28 men / ~26 women',
      birthsOutsideMarriage: '~13%',
    },
    water: { fluoridation: 'Not fluoridated', regime: 'State standards inherited from the Soviet system' },
  },
  {
    iso3: 'CAN',
    name: 'Canada',
    headOfGovernment: 'PM Mark Carney (Liberal Party), since March 2025',
    governingBloc: 'Liberal majority government after the April 2026 election',
    legislature: 'House of Commons 343 · Senate 105 (appointed)',
    lastElection: 'April 2026 federal election',
    left: [
      { name: 'Liberal Party', support: '~44%', note: 'Centre to centre-left; won a majority' },
      { name: 'New Democratic Party (NDP)', support: '~6%', note: 'Social democratic; reduced to a rump caucus' },
      { name: 'Bloc Québécois', support: '~6%', note: 'Quebec sovereigntist, socially left' },
    ],
    right: [
      { name: 'Conservative Party', support: '~41%', note: 'Official opposition; highest vote share since 1988 but short of power' },
      { name: "People's Party (PPC)", support: '~1%', note: 'Right-populist; no seats' },
    ],
    tax: {
      topIncome: '~53% combined federal + provincial',
      corporate: '15% federal (~26.5% with provincial)',
      vat: 'GST 5%; HST 13–15% in most provinces',
      socialContributions: 'CPP + EI ~12% combined',
      taxToGdp: '~34%',
    },
    trade: {
      exportsPctGdp: '~33%',
      exportPartners: 'United States (~75%), China, United Kingdom, Japan',
      importPartners: 'United States, China, Mexico',
      leadingExports: 'Crude oil, vehicles, gold, lumber, machinery',
    },
    migration: {
      foreignBornShare: '~23%',
      topOrigins: 'India, China, Philippines, Nigeria, Pakistan',
      netMigration: '~+400,000/yr after the 2024 caps cut the earlier surge',
      muslimShare: '~5%',
    },
    family: {
      marriageRate: '~4.7 per 1,000',
      divorceRate: '~1.6 per 1,000',
      meanAgeFirstMarriage: '~31 men / ~30 women',
      birthsOutsideMarriage: '~34%',
    },
    water: { fluoridation: 'Fluoridated — ~39% of the population; municipal decision', regime: 'Health Canada guideline 0.7 mg/L' },
  },
  {
    iso3: 'CHE',
    name: 'Switzerland',
    headOfGovernment: 'Collegial Federal Council of seven; the presidency rotates annually',
    governingBloc: 'Permanent grand coalition under the "magic formula"',
    legislature: 'National Council 200 · Council of States 46',
    lastElection: 'October 2023 federal election',
    left: [
      { name: 'Social Democratic Party (SP)', support: '~18.3%', note: 'Second-largest party; two Federal Council seats' },
      { name: 'Green Party', support: '~9.8%', note: 'Lost ground after the 2019 "climate election"' },
    ],
    right: [
      { name: "Swiss People's Party (SVP)", support: '~27.9%', note: 'National-conservative; largest party for three decades' },
      { name: 'FDP.The Liberals', support: '~14.3%', note: 'Classical liberal, business-aligned' },
      { name: 'The Centre', support: '~14.1%', note: 'Christian-democratic merger' },
    ],
    tax: {
      topIncome: '~40% combined federal, cantonal and municipal',
      corporate: '~14.9% average effective',
      vat: '8.1% standard — lowest in Europe',
      socialContributions: 'AHV/IV/EO 10.6% split employer/employee',
      taxToGdp: '~27%',
    },
    trade: {
      exportsPctGdp: '~75%',
      exportPartners: 'United States, Germany, China, India',
      importPartners: 'Germany, Italy, United States, France',
      leadingExports: 'Pharmaceuticals, gold, watches, precision machinery',
    },
    migration: {
      foreignBornShare: '~30%',
      topOrigins: 'Italy, Germany, Portugal, France, Kosovo',
      netMigration: '~+85,000/yr',
      muslimShare: '~5.5%',
    },
    family: {
      marriageRate: '~4.5 per 1,000',
      divorceRate: '~1.9 per 1,000',
      meanAgeFirstMarriage: '~32 men / ~30 women',
      birthsOutsideMarriage: '~32%',
    },
    water: { fluoridation: 'Not fluoridated — Basel ended the last programme in 2003', regime: 'Fluoridated salt is the national caries policy' },
  },
  {
    iso3: 'CHN',
    name: 'China',
    headOfGovernment: 'Premier Li Qiang; Xi Jinping as CCP General Secretary and President',
    governingBloc: 'Single-party rule by the Chinese Communist Party',
    legislature: 'National People’s Congress ~2,977 delegates (indirectly elected)',
    lastElection: 'March 2023 NPC session; no competitive national elections',
    left: [{ name: 'Chinese Communist Party (CCP)', support: '~99M members', note: 'Marxist-Leninist state party; the entire governing structure' }],
    right: [{ name: 'No legal opposition', support: '—', note: 'Eight minor parties operate only within the united-front system' }],
    tax: {
      topIncome: '45%',
      corporate: '25% (15% for encouraged high-tech)',
      vat: '13% standard',
      socialContributions: '~30% employer, ~11% employee (varies by city)',
      taxToGdp: '~20%',
    },
    trade: {
      exportsPctGdp: '~20%',
      exportPartners: 'United States, EU, ASEAN, Japan, South Korea',
      importPartners: 'Taiwan, South Korea, Japan, United States, Australia',
      leadingExports: 'Electronics, machinery, EVs and batteries, solar modules, textiles',
    },
    migration: {
      foreignBornShare: '<0.1%',
      topOrigins: 'South Korea, United States, Japan — foreign residency is tightly limited',
      netMigration: 'Persistently negative; net outflow of students and professionals',
      muslimShare: '~1.8% (Hui and Uyghur populations)',
    },
    family: {
      marriageRate: '~4.3 per 1,000; 2024 registrations fell to a modern low',
      divorceRate: '~2.6 per 1,000',
      meanAgeFirstMarriage: '~29 men / ~27 women',
      birthsOutsideMarriage: 'Very low; household registration discourages it',
    },
    water: { fluoridation: 'No national fluoridation', regime: 'Defluoridation is the priority in endemic-fluorosis regions' },
  },
  {
    iso3: 'CYP',
    name: 'Cyprus',
    headOfGovernment: 'President Nikos Christodoulides (independent), since February 2023',
    governingBloc: 'Presidential system; cabinet appointed outside party lines',
    legislature: 'House of Representatives 56 seats filled (80 nominal)',
    lastElection: 'May 2021 parliamentary; February 2023 presidential',
    left: [{ name: 'AKEL', support: '~22%', note: 'Communist; the largest left party in the EU by vote share' }],
    right: [
      { name: 'Democratic Rally (DISY)', support: '~27%', note: 'Centre-right, EPP-aligned' },
      { name: 'ELAM', support: '~6.8%', note: 'Far-right nationalist; grew sharply from a small base' },
    ],
    tax: {
      topIncome: '35%',
      corporate: '12.5%',
      vat: '19% standard',
      socialContributions: '~8.8% employee / ~8.8% employer',
      taxToGdp: '~35%',
    },
    trade: {
      exportsPctGdp: '~45% (services-dominated)',
      exportPartners: 'Greece, United Kingdom, Israel, Germany',
      importPartners: 'Greece, Italy, China, Germany',
      leadingExports: 'Shipping and ship management, tourism, financial services, pharmaceuticals',
    },
    migration: {
      foreignBornShare: '~22%',
      topOrigins: 'Greece, United Kingdom, Romania, Russia, Syria',
      netMigration: 'Positive; high per-capita asylum applications',
      muslimShare: '~25% including the northern third of the island',
    },
    family: {
      marriageRate: '~8.9 per 1,000 (inflated by destination weddings)',
      divorceRate: '~2.3 per 1,000',
      meanAgeFirstMarriage: '~32 men / ~30 women',
      birthsOutsideMarriage: '~23%',
    },
    water: { fluoridation: 'Not fluoridated', regime: 'Heavily desalination-dependent supply' },
  },
  {
    iso3: 'CZE',
    name: 'Czechia',
    headOfGovernment: 'PM Andrej Babiš (ANO), since December 2025',
    governingBloc: 'ANO with SPD and the Motorists',
    legislature: 'Chamber of Deputies 200 · Senate 81',
    lastElection: 'October 2025 legislative election',
    left: [{ name: 'Enough! (Stačilo!)', support: '~4.3%', note: 'Communist-led list; fell short of the threshold' }],
    right: [
      { name: 'ANO 2011', support: '~34.5%', note: 'Right-populist; returned Babiš to the premiership' },
      { name: 'Spolu (ODS-led)', support: '~23.4%', note: 'Conservative-liberal bloc, now in opposition' },
      { name: 'Freedom and Direct Democracy (SPD)', support: '~7.8%', note: 'Hard-right anti-immigration; coalition partner' },
    ],
    tax: {
      topIncome: '15% / 23%',
      corporate: '21%',
      vat: '21% standard',
      socialContributions: '11.6% employee / 33.8% employer',
      taxToGdp: '~36%',
    },
    trade: {
      exportsPctGdp: '~72%',
      exportPartners: 'Germany (~32%), Slovakia, Poland, France',
      importPartners: 'Germany, China, Poland, Slovakia',
      leadingExports: 'Vehicles, machinery, electronics, electrical equipment',
    },
    migration: {
      foreignBornShare: '~10%',
      topOrigins: 'Ukraine, Slovakia, Vietnam, Russia',
      netMigration: '~+70,000/yr, dominated by Ukrainian protection holders',
      muslimShare: '~0.2%',
    },
    family: {
      marriageRate: '~4.4 per 1,000',
      divorceRate: '~2.0 per 1,000',
      meanAgeFirstMarriage: '~32 men / ~30 women',
      birthsOutsideMarriage: '~49%',
    },
    water: { fluoridation: 'Discontinued in the 1990s', regime: 'EU directive; fluoridated salt available' },
  },
  {
    iso3: 'DNK',
    name: 'Denmark',
    headOfGovernment: 'PM Mette Frederiksen (Social Democrats), since June 2019',
    governingBloc: 'Cross-bloc coalition: Social Democrats, Venstre, Moderates',
    legislature: 'Folketing 179',
    lastElection: 'November 2022 general election',
    left: [
      { name: 'Social Democrats (A)', support: '~27.5%', note: 'Leads government on a restrictive migration line' },
      { name: 'Green Left (SF)', support: '~8.3%', note: 'Left-green; main left opposition' },
      { name: 'Red–Green Alliance', support: '~5.2%', note: 'Democratic socialist' },
    ],
    right: [
      { name: 'Venstre', support: '~13.3%', note: 'Liberal-conservative; in government' },
      { name: 'Denmark Democrats', support: '~8.1%', note: 'Right-populist split from the DF, founded 2022' },
      { name: 'Conservative People’s Party', support: '~5.5%', note: 'Traditional right' },
    ],
    tax: {
      topIncome: '~55.9% ceiling including labour-market contribution',
      corporate: '22%',
      vat: '25% standard, no reduced rate',
      socialContributions: 'AM-bidrag 8%; most welfare is tax-financed',
      taxToGdp: '~45% — among the highest in the OECD',
    },
    trade: {
      exportsPctGdp: '~68%',
      exportPartners: 'Germany, United States, Sweden, Norway',
      importPartners: 'Germany, Sweden, Netherlands, China',
      leadingExports: 'Pharmaceuticals, machinery, wind turbines, pork, shipping services',
    },
    migration: {
      foreignBornShare: '~14%',
      topOrigins: 'Turkey, Poland, Syria, Romania, Ukraine',
      netMigration: '~+30,000/yr',
      muslimShare: '~5.5%',
    },
    family: {
      marriageRate: '~5.6 per 1,000',
      divorceRate: '~2.3 per 1,000',
      meanAgeFirstMarriage: '~35 men / ~33 women',
      birthsOutsideMarriage: '~54%',
    },
    water: { fluoridation: 'Not fluoridated', regime: 'Untreated groundwater supply; naturally occurring fluoride only' },
  },
  {
    iso3: 'EST',
    name: 'Estonia',
    headOfGovernment: 'PM Kristen Michal (Reform Party), since July 2024',
    governingBloc: 'Reform with Eesti 200 after the Social Democrats were dropped',
    legislature: 'Riigikogu 101',
    lastElection: 'March 2023 parliamentary election',
    left: [
      { name: 'Centre Party', support: '~15.3%', note: 'Formerly dominant among Russian-speakers' },
      { name: 'Social Democratic Party (SDE)', support: '~9.3%', note: 'Left the coalition in 2024' },
    ],
    right: [
      { name: 'Reform Party', support: '~31.2%', note: 'Classical liberal; leads government' },
      { name: 'EKRE', support: '~16.1%', note: 'National-conservative; principal right opposition' },
      { name: 'Isamaa', support: '~8.2%', note: 'Conservative; polling far above its 2023 result' },
    ],
    tax: {
      topIncome: '22% flat',
      corporate: '22% — charged only on distributed profits',
      vat: '24% standard (raised in 2025)',
      socialContributions: '33% social tax on the employer',
      taxToGdp: '~34%',
    },
    trade: {
      exportsPctGdp: '~75%',
      exportPartners: 'Finland, Latvia, Sweden, United States',
      importPartners: 'Finland, Germany, Latvia, Lithuania',
      leadingExports: 'Electronics, wood and furniture, machinery, IT services',
    },
    migration: {
      foreignBornShare: '~15%',
      topOrigins: 'Russia, Ukraine, Finland, Latvia',
      netMigration: 'Positive since 2022 on Ukrainian arrivals',
      muslimShare: '~0.4%',
    },
    family: {
      marriageRate: '~4.7 per 1,000',
      divorceRate: '~2.1 per 1,000',
      meanAgeFirstMarriage: '~33 men / ~31 women',
      birthsOutsideMarriage: '~57%',
    },
    water: { fluoridation: 'Not fluoridated', regime: 'EU directive; naturally high fluoride in some coastal aquifers' },
  },
  {
    iso3: 'FIN',
    name: 'Finland',
    headOfGovernment: 'PM Petteri Orpo (National Coalition), since June 2023',
    governingBloc: 'NCP with the Finns Party, Swedish People’s Party and Christian Democrats',
    legislature: 'Eduskunta 200',
    lastElection: 'April 2023 parliamentary election',
    left: [
      { name: 'Social Democratic Party (SDP)', support: '~19.9%', note: 'Largest opposition party; leads most 2026 polling' },
      { name: 'Left Alliance', support: '~7.1%', note: 'Democratic socialist' },
      { name: 'Green League', support: '~7.0%', note: 'Left-environmentalist' },
    ],
    right: [
      { name: 'National Coalition Party (NCP)', support: '~20.8%', note: 'Liberal-conservative; holds the premiership' },
      { name: 'Finns Party', support: '~20.1%', note: 'National-populist; in government, polling down sharply' },
    ],
    tax: {
      topIncome: '~57% marginal including municipal tax',
      corporate: '20%',
      vat: '25.5% standard (raised in 2024)',
      socialContributions: '~10% employee / ~20% employer',
      taxToGdp: '~43%',
    },
    trade: {
      exportsPctGdp: '~40%',
      exportPartners: 'Germany, Sweden, United States, Netherlands',
      importPartners: 'Sweden, Germany, China, Netherlands',
      leadingExports: 'Paper and pulp, machinery, refined fuels, ships, electronics',
    },
    migration: {
      foreignBornShare: '~9%',
      topOrigins: 'Estonia, Russia, Ukraine, Iraq, Somalia',
      netMigration: '~+58,000/yr — a record high',
      muslimShare: '~2.7%',
    },
    family: {
      marriageRate: '~4.0 per 1,000',
      divorceRate: '~2.4 per 1,000',
      meanAgeFirstMarriage: '~34 men / ~32 women',
      birthsOutsideMarriage: '~57%',
    },
    water: { fluoridation: 'Ended in 1992 when Kuopio stopped', regime: 'EU directive; topical fluoride policy instead' },
  },
  {
    iso3: 'GBR',
    name: 'United Kingdom',
    headOfGovernment: 'PM Keir Starmer (Labour), since July 2024',
    governingBloc: 'Labour majority government',
    legislature: 'House of Commons 650 · House of Lords ~800 (appointed)',
    lastElection: 'July 2024 general election',
    left: [
      { name: 'Labour Party', support: '~33.7%', note: 'Large majority on a low vote share; well behind in 2026 polling' },
      { name: 'Liberal Democrats', support: '~12.2%', note: 'Best seat result in a century' },
      { name: 'Green Party', support: '~6.7%', note: 'Four seats; surging on the left under new leadership' },
    ],
    right: [
      { name: 'Conservative Party', support: '~23.7%', note: 'Worst result in the party’s history' },
      { name: 'Reform UK', support: '~14.3%', note: 'Right-populist; five seats but leading national polls through 2026' },
    ],
    tax: {
      topIncome: '45% above £125,140',
      corporate: '25% main rate',
      vat: '20% standard',
      socialContributions: 'National Insurance 8% employee / 15% employer',
      taxToGdp: '~35.3% — a post-war high',
    },
    trade: {
      exportsPctGdp: '~32%',
      exportPartners: 'United States, Germany, Netherlands, Ireland',
      importPartners: 'China, Germany, United States, Netherlands',
      leadingExports: 'Financial and business services, machinery, vehicles, pharmaceuticals, crude oil',
    },
    migration: {
      foreignBornShare: '~16.8%',
      topOrigins: 'India, Poland, Pakistan, Romania, Nigeria',
      netMigration: '~+430,000 in 2024, roughly halved from the 2023 peak',
      muslimShare: '~6.5%',
    },
    family: {
      marriageRate: '~4.4 per 1,000',
      divorceRate: '~1.7 per 1,000',
      meanAgeFirstMarriage: '~35 men / ~33 women',
      birthsOutsideMarriage: '~51%',
    },
    water: { fluoridation: 'Fluoridated — ~10% of the population, mainly the West Midlands and North East', regime: 'Expansion programme announced for the North East' },
  },
  {
    iso3: 'GRC',
    name: 'Greece',
    headOfGovernment: 'PM Kyriakos Mitsotakis (New Democracy), since July 2019',
    governingBloc: 'New Democracy single-party majority',
    legislature: 'Hellenic Parliament 300',
    lastElection: 'June 2023 legislative election',
    left: [
      { name: 'SYRIZA', support: '~17.8%', note: 'Left; badly fragmented since 2023' },
      { name: 'PASOK–KINAL', support: '~11.8%', note: 'Social democratic; now the main opposition' },
      { name: 'Communist Party (KKE)', support: '~7.7%', note: 'Orthodox communist, consistently represented' },
    ],
    right: [
      { name: 'New Democracy', support: '~40.6%', note: 'Liberal-conservative; governing majority' },
      { name: 'Spartans', support: '~4.6%', note: 'Far right, endorsed by an imprisoned Golden Dawn figure' },
      { name: 'Greek Solution', support: '~4.5%', note: 'Right-populist nationalist' },
    ],
    tax: {
      topIncome: '44%',
      corporate: '22%',
      vat: '24% standard',
      socialContributions: '~13.9% employee / ~22.3% employer',
      taxToGdp: '~41%',
    },
    trade: {
      exportsPctGdp: '~45%',
      exportPartners: 'Italy, Germany, Cyprus, Bulgaria, Turkey',
      importPartners: 'Germany, Italy, China, Iraq',
      leadingExports: 'Refined petroleum, aluminium, pharmaceuticals, tourism, shipping services',
    },
    migration: {
      foreignBornShare: '~13%',
      topOrigins: 'Albania, Georgia, Pakistan, Syria, Bulgaria',
      netMigration: 'Positive; a principal EU arrival route',
      muslimShare: '~5.7%',
    },
    family: {
      marriageRate: '~4.5 per 1,000',
      divorceRate: '~2.2 per 1,000',
      meanAgeFirstMarriage: '~33 men / ~31 women',
      birthsOutsideMarriage: '~13% — among the lowest in the EU',
    },
    water: { fluoridation: 'Not fluoridated', regime: 'EU directive; island supply is desalination-assisted' },
  },
  {
    iso3: 'HRV',
    name: 'Croatia',
    headOfGovernment: 'PM Andrej Plenković (HDZ), since October 2016',
    governingBloc: 'HDZ with the Homeland Movement and minority representatives',
    legislature: 'Sabor 151',
    lastElection: 'April 2024 parliamentary election',
    left: [
      { name: 'Rivers of Justice (SDP-led)', support: '~25.4%', note: 'Social-democratic opposition bloc' },
      { name: 'We Can! (Možemo!)', support: '~9%', note: 'Green-left; runs Zagreb' },
    ],
    right: [
      { name: 'Croatian Democratic Union (HDZ)', support: '~34.4%', note: 'Christian-democratic; in power almost continuously' },
      { name: 'Homeland Movement (DP)', support: '~9.6%', note: 'National-conservative; junior coalition partner' },
    ],
    tax: {
      topIncome: '~30–35.4% depending on municipality',
      corporate: '18% (10% for small firms)',
      vat: '25% standard — joint highest in the EU',
      socialContributions: '20% pension (employee) + 16.5% health (employer)',
      taxToGdp: '~37%',
    },
    trade: {
      exportsPctGdp: '~52%',
      exportPartners: 'Italy, Slovenia, Germany, Bosnia and Herzegovina',
      importPartners: 'Italy, Germany, Slovenia, Hungary',
      leadingExports: 'Tourism, refined fuels, ships, pharmaceuticals, food',
    },
    migration: {
      foreignBornShare: '~13%, mostly former-Yugoslav returnees',
      topOrigins: 'Bosnia and Herzegovina, Serbia, plus new labour migration from Nepal and the Philippines',
      netMigration: 'Turned positive on work-permit inflows after years of EU emigration',
      muslimShare: '~1.5%',
    },
    family: {
      marriageRate: '~4.9 per 1,000',
      divorceRate: '~1.4 per 1,000',
      meanAgeFirstMarriage: '~32 men / ~29 women',
      birthsOutsideMarriage: '~24%',
    },
    water: { fluoridation: 'Not fluoridated', regime: 'EU directive; karst-aquifer supply' },
  },
  {
    iso3: 'HUN',
    name: 'Hungary',
    headOfGovernment: 'PM Péter Magyar (Tisza), since May 2026',
    governingBloc: 'Tisza majority after Viktor Orbán’s 16-year run ended',
    legislature: 'National Assembly 199',
    lastElection: 'April 2026 parliamentary election',
    left: [
      { name: 'Democratic Coalition (DK)', support: 'Marginal', note: 'Squeezed out by the Tisza consolidation' },
      { name: 'Hungarian Socialist Party (MSZP)', support: 'Marginal', note: 'Post-communist left, now negligible' },
    ],
    right: [
      { name: 'Respect and Freedom (Tisza)', support: '~138 of 199 seats', note: 'Centre-right anti-Orbán movement; now governing' },
      { name: 'Fidesz–KDNP', support: '~55 seats', note: 'National-conservative; in opposition for the first time since 2010' },
      { name: 'Our Homeland (Mi Hazánk)', support: '~6%', note: 'Far right' },
    ],
    tax: {
      topIncome: '15% flat',
      corporate: '9% — the lowest in the EU',
      vat: '27% standard — the highest in the EU',
      socialContributions: '18.5% employee / 13% employer',
      taxToGdp: '~35%',
    },
    trade: {
      exportsPctGdp: '~80%',
      exportPartners: 'Germany, Slovakia, Italy, Romania, Austria',
      importPartners: 'Germany, China, Austria, Poland',
      leadingExports: 'Vehicles and parts, electronics, batteries, pharmaceuticals',
    },
    migration: {
      foreignBornShare: '~6%',
      topOrigins: 'Romania, Ukraine, Serbia, China',
      netMigration: 'Modestly positive, concentrated on ethnic-Hungarian returnees',
      muslimShare: '~0.4%',
    },
    family: {
      marriageRate: '~6.7 per 1,000 — among the highest in the EU after a decade of family subsidies',
      divorceRate: '~1.8 per 1,000',
      meanAgeFirstMarriage: '~33 men / ~31 women',
      birthsOutsideMarriage: '~30%',
    },
    water: { fluoridation: 'Not fluoridated', regime: 'EU directive; natural fluoride and arsenic mitigation in the Great Plain' },
  },
  {
    iso3: 'IRL',
    name: 'Ireland',
    headOfGovernment: 'Taoiseach Micheál Martin (Fianna Fáil), since January 2025',
    governingBloc: 'Fianna Fáil–Fine Gael with supporting independents',
    legislature: 'Dáil Éireann 174 · Seanad 60',
    lastElection: 'November 2024 general election',
    left: [
      { name: 'Sinn Féin', support: '~19%', note: 'Left-republican; largest opposition party' },
      { name: 'Social Democrats', support: '~4.8%', note: 'Progressive left' },
      { name: 'Labour Party', support: '~4.7%', note: 'Social democratic' },
    ],
    right: [
      { name: 'Fianna Fáil', support: '~21.9%', note: 'Centrist-populist; holds the Taoiseach’s office' },
      { name: 'Fine Gael', support: '~20.8%', note: 'Christian-democratic coalition partner' },
      { name: 'Independent Ireland', support: '~3.6%', note: 'Rural conservative grouping formed in 2023' },
    ],
    tax: {
      topIncome: '40% plus USC and PRSI — ~52% marginal',
      corporate: '12.5% trading rate; 15% for large multinationals',
      vat: '23% standard',
      socialContributions: 'PRSI ~4.1% employee / ~11.15% employer',
      taxToGdp: '~21% of GDP (GDP is distorted by multinational accounting)',
    },
    trade: {
      exportsPctGdp: '~130%',
      exportPartners: 'United States, Germany, Belgium, United Kingdom',
      importPartners: 'United Kingdom, United States, China, Germany',
      leadingExports: 'Pharmaceuticals, medical devices, software and IT services, aircraft leasing',
    },
    migration: {
      foreignBornShare: '~22%',
      topOrigins: 'United Kingdom, Poland, India, Romania, Ukraine',
      netMigration: '~+80,000/yr — the highest per capita in the EU',
      muslimShare: '~1.6%',
    },
    family: {
      marriageRate: '~4.2 per 1,000',
      divorceRate: '~0.7 per 1,000 — the lowest in the EU',
      meanAgeFirstMarriage: '~36 men / ~34 women',
      birthsOutsideMarriage: '~43%',
    },
    water: { fluoridation: 'Fluoridated — the only EU state with a statutory mandate; ~70%+ of the population', regime: 'Health (Fluoridation of Water Supplies) Act 1960' },
  },
  {
    iso3: 'ISL',
    name: 'Iceland',
    headOfGovernment: 'PM Kristrún Frostadóttir (Social Democratic Alliance), since December 2024',
    governingBloc: 'Social Democrats with the Liberal Reform Party and People’s Party',
    legislature: 'Althing 63',
    lastElection: 'November 2024 snap election',
    left: [
      { name: 'Social Democratic Alliance', support: '~20.8%', note: 'Won the snap election and leads government' },
      { name: 'Left-Green Movement', support: '~2.3%', note: 'Lost all seats after leading the previous coalition' },
    ],
    right: [
      { name: 'Independence Party', support: '~19.4%', note: 'Conservative; worst result in its history' },
      { name: 'Centre Party', support: '~12.1%', note: 'Right-populist' },
      { name: 'People’s Party', support: '~13.8%', note: 'Populist welfare-nationalist; in government' },
    ],
    tax: {
      topIncome: '~46.3% including municipal tax',
      corporate: '21%',
      vat: '24% standard',
      socialContributions: '6.35% insurance levy plus 15.5% pension',
      taxToGdp: '~33%',
    },
    trade: {
      exportsPctGdp: '~45%',
      exportPartners: 'Netherlands, United States, United Kingdom, Spain',
      importPartners: 'Norway, United States, Germany, China',
      leadingExports: 'Aluminium, fish and seafood, tourism, marine technology',
    },
    migration: {
      foreignBornShare: '~20% — the fastest growth in Europe',
      topOrigins: 'Poland, Lithuania, Ukraine, Venezuela',
      netMigration: 'Strongly positive relative to a population of ~400,000',
      muslimShare: '~0.4%',
    },
    family: {
      marriageRate: '~4.7 per 1,000',
      divorceRate: '~1.7 per 1,000',
      meanAgeFirstMarriage: '~35 men / ~33 women',
      birthsOutsideMarriage: '~69% — the highest in Europe',
    },
    water: { fluoridation: 'Not fluoridated', regime: 'Untreated glacial and spring water' },
  },
  {
    iso3: 'JPN',
    name: 'Japan',
    headOfGovernment: 'PM Sanae Takaichi (LDP), since October 2025 — Japan’s first woman prime minister',
    governingBloc: 'LDP supermajority after the 2026 snap general election',
    legislature: 'House of Representatives 465 · House of Councillors 248',
    lastElection: '2026 snap general election',
    left: [
      { name: 'Constitutional Democratic Party (CDP)', support: '~15%', note: 'Main centre-left opposition' },
      { name: 'Japanese Communist Party (JCP)', support: '~7%', note: 'Long-standing left party with an ageing base' },
      { name: 'Reiwa Shinsengumi', support: '~5%', note: 'Left-populist, anti-austerity' },
    ],
    right: [
      { name: 'Liberal Democratic Party (LDP)', support: 'Two-thirds supermajority', note: 'Dominant since 1955; Takaichi is on its nationalist wing' },
      { name: 'Sanseitō', support: 'Rising', note: 'Right-populist, anti-immigration; broke through in 2025' },
      { name: 'Ishin (Japan Innovation Party)', support: '~10%', note: 'Right-libertarian, Osaka-based' },
    ],
    tax: {
      topIncome: '45% national + 10% local',
      corporate: '23.2% national (~30% effective)',
      vat: 'Consumption tax 10% (8% on food)',
      socialContributions: '~15% employee, matched by employer',
      taxToGdp: '~34%',
    },
    trade: {
      exportsPctGdp: '~22%',
      exportPartners: 'United States, China, South Korea, Taiwan',
      importPartners: 'China, United States, Australia, Saudi Arabia',
      leadingExports: 'Vehicles, semiconductor equipment, machinery, electronic components',
    },
    migration: {
      foreignBornShare: '~2.5% — a record ~3.9m foreign residents',
      topOrigins: 'China, Vietnam, South Korea, Philippines, Nepal',
      netMigration: 'Positive and rising, but far below the natural decline',
      muslimShare: '~0.2%',
    },
    family: {
      marriageRate: '~3.9 per 1,000 — postwar low',
      divorceRate: '~1.5 per 1,000',
      meanAgeFirstMarriage: '~31 men / ~30 women',
      birthsOutsideMarriage: '~2.4% — the lowest in the OECD',
    },
    water: { fluoridation: 'No artificial fluoridation', regime: 'Waterworks Law quality standards; topical fluoride only' },
  },
  {
    iso3: 'KOR',
    name: 'South Korea',
    headOfGovernment: 'President Lee Jae-myung (Democratic Party), since June 2025; PM Kim Min-seok',
    governingBloc: 'Democratic Party control of both presidency and assembly',
    legislature: 'National Assembly 300',
    lastElection: 'June 2025 presidential; April 2024 legislative',
    left: [
      { name: 'Democratic Party (DPK)', support: '~50% / 175 seats', note: 'Centre-left; holds presidency and legislature' },
      { name: 'Rebuilding Korea Party', support: '~24% party list', note: 'Left-liberal ally' },
    ],
    right: [
      { name: 'People Power Party (PPP)', support: '~41% / 108 seats', note: 'Conservative; damaged by the 2024 martial-law crisis' },
      { name: 'Reform Party', support: '~3%', note: 'Younger-vote conservative splinter' },
    ],
    tax: {
      topIncome: '45% national + 10% local surtax',
      corporate: '24% top bracket',
      vat: '10% standard',
      socialContributions: '~9% employee across four insurances',
      taxToGdp: '~32%',
    },
    trade: {
      exportsPctGdp: '~44%',
      exportPartners: 'China, United States, Vietnam, Japan',
      importPartners: 'China, United States, Japan, Australia',
      leadingExports: 'Semiconductors, vehicles, ships, petrochemicals, displays',
    },
    migration: {
      foreignBornShare: '~4.6% — a record ~2.6m residents',
      topOrigins: 'China (largely ethnic Korean), Vietnam, Thailand, United States, Uzbekistan',
      netMigration: 'Positive on E-9 labour visas; policy is loosening',
      muslimShare: '~0.4%',
    },
    family: {
      marriageRate: '~4.4 per 1,000, up from the 2022 trough',
      divorceRate: '~1.8 per 1,000',
      meanAgeFirstMarriage: '~34 men / ~31 women',
      birthsOutsideMarriage: '~4.7% — rising from a very low base',
    },
    water: { fluoridation: 'Largely discontinued — under 2% of the population', regime: 'Programme wound down after local referendums' },
  },
  {
    iso3: 'LIE',
    name: 'Liechtenstein',
    headOfGovernment: 'PM Brigitte Haas (Patriotic Union), since April 2025',
    governingBloc: 'VU–FBP grand coalition, the country’s standing arrangement',
    legislature: 'Landtag 25',
    lastElection: 'February 2025 general election',
    left: [{ name: 'Free List (FL)', support: '~11%', note: 'Green-left; the only left party in the Landtag' }],
    right: [
      { name: 'Patriotic Union (VU)', support: '~38.3%', note: 'Conservative; holds the premiership' },
      { name: 'Progressive Citizens’ Party (FBP)', support: '~34.4%', note: 'Conservative-liberal coalition partner' },
      { name: 'The Independents (DpL)', support: '~12.9%', note: 'Right-populist' },
    ],
    tax: {
      topIncome: '~22.4% including municipal surcharge',
      corporate: '12.5%',
      vat: '8.1% (Swiss VAT union)',
      socialContributions: '~11% employee',
      taxToGdp: '~20%',
    },
    trade: {
      exportsPctGdp: 'Very high per capita; customs union with Switzerland',
      exportPartners: 'Switzerland, Germany, Austria, United States',
      importPartners: 'Switzerland, Germany, Austria',
      leadingExports: 'Precision instruments, dental products, machinery, fastening systems',
    },
    migration: {
      foreignBornShare: '~34%',
      topOrigins: 'Switzerland, Austria, Germany, Italy',
      netMigration: 'Tightly capped by residence quota',
      muslimShare: '~5.9%',
    },
    family: {
      marriageRate: '~5.0 per 1,000',
      divorceRate: '~2.1 per 1,000',
      meanAgeFirstMarriage: '~33 men / ~31 women',
      birthsOutsideMarriage: '~22%',
    },
    water: { fluoridation: 'Not fluoridated', regime: 'Alpine spring and groundwater supply' },
  },
  {
    iso3: 'LTU',
    name: 'Lithuania',
    headOfGovernment: 'PM Inga Ruginienė (LSDP), since September 2025',
    governingBloc: 'Social Democrat-led coalition',
    legislature: 'Seimas 141',
    lastElection: 'October 2024 parliamentary election',
    left: [{ name: 'Social Democratic Party (LSDP)', support: '~19.4%', note: 'Largest party; leads government' }],
    right: [
      { name: 'Homeland Union (TS-LKD)', support: '~18.1%', note: 'Conservative; lost power in 2024' },
      { name: 'Dawn of Nemunas', support: '~15%', note: 'Right-populist, founded 2024; controversy over antisemitic remarks' },
    ],
    tax: {
      topIncome: '20% / 32%',
      corporate: '16%',
      vat: '21% standard',
      socialContributions: '~19.5% employee / ~1.77% employer',
      taxToGdp: '~33%',
    },
    trade: {
      exportsPctGdp: '~75%',
      exportPartners: 'Latvia, Poland, Germany, United States',
      importPartners: 'Poland, Germany, Latvia, Netherlands',
      leadingExports: 'Refined fuels, furniture, food, lasers and photonics, transport services',
    },
    migration: {
      foreignBornShare: '~7%',
      topOrigins: 'Belarus, Ukraine, Russia',
      netMigration: 'Positive since 2019, reversing decades of emigration',
      muslimShare: '~0.1%',
    },
    family: {
      marriageRate: '~5.4 per 1,000',
      divorceRate: '~2.6 per 1,000',
      meanAgeFirstMarriage: '~32 men / ~29 women',
      birthsOutsideMarriage: '~30%',
    },
    water: { fluoridation: 'Not fluoridated', regime: 'EU directive; deep-groundwater supply' },
  },
  {
    iso3: 'LUX',
    name: 'Luxembourg',
    headOfGovernment: 'PM Luc Frieden (CSV), since November 2023',
    governingBloc: 'CSV–DP coalition',
    legislature: 'Chamber of Deputies 60',
    lastElection: 'October 2023 legislative election',
    left: [
      { name: 'Socialist Workers’ Party (LSAP)', support: '~18.9%', note: 'Social democratic; in opposition' },
      { name: 'The Greens', support: '~8.6%', note: 'Lost half its seats in 2023' },
      { name: 'The Left (déi Lénk)', support: '~3.6%', note: 'Democratic socialist' },
    ],
    right: [
      { name: 'Christian Social People’s Party (CSV)', support: '~29.2%', note: 'Christian-democratic; returned to power in 2023' },
      { name: 'Democratic Party (DP)', support: '~18.7%', note: 'Liberal coalition partner' },
      { name: 'ADR', support: '~9.5%', note: 'National-conservative' },
    ],
    tax: {
      topIncome: '42% plus solidarity surcharge',
      corporate: '~24.9% aggregate including municipal business tax',
      vat: '17% standard — the lowest in the EU',
      socialContributions: '~12% employee / ~13% employer',
      taxToGdp: '~40%',
    },
    trade: {
      exportsPctGdp: '~200% (financial services dominate)',
      exportPartners: 'Germany, France, Belgium, Netherlands',
      importPartners: 'Belgium, Germany, France',
      leadingExports: 'Financial services, steel, chemicals, satellites and space services',
    },
    migration: {
      foreignBornShare: '~50% — the highest in the EU',
      topOrigins: 'Portugal, France, Italy, Belgium, Germany',
      netMigration: 'Strongly positive; ~200,000 cross-border commuters daily',
      muslimShare: '~3%',
    },
    family: {
      marriageRate: '~3.3 per 1,000',
      divorceRate: '~1.9 per 1,000',
      meanAgeFirstMarriage: '~35 men / ~33 women',
      birthsOutsideMarriage: '~44%',
    },
    water: { fluoridation: 'Not fluoridated', regime: 'EU directive; spring and reservoir supply' },
  },
  {
    iso3: 'LVA',
    name: 'Latvia',
    headOfGovernment: 'PM Evika Siliņa (New Unity), since September 2023',
    governingBloc: 'New Unity with the Union of Greens and Farmers and the Progressives',
    legislature: 'Saeima 100',
    lastElection: 'October 2022 parliamentary election',
    left: [
      { name: 'The Progressives', support: '~6.2%', note: 'Left-green; in government' },
      { name: 'Harmony', support: 'Below threshold', note: 'Formerly the largest party; collapsed after 2022' },
    ],
    right: [
      { name: 'New Unity', support: '~19%', note: 'Centre-right; holds the premiership' },
      { name: 'United List', support: '~11%', note: 'Regionalist-conservative alliance' },
      { name: 'National Alliance', support: '~9.3%', note: 'National-conservative' },
    ],
    tax: {
      topIncome: '25.5% / 33% after the 2025 reform',
      corporate: '20% — charged only on distributed profits',
      vat: '21% standard',
      socialContributions: '10.5% employee / 23.59% employer',
      taxToGdp: '~31%',
    },
    trade: {
      exportsPctGdp: '~65%',
      exportPartners: 'Lithuania, Estonia, Germany, Sweden',
      importPartners: 'Lithuania, Germany, Poland, Estonia',
      leadingExports: 'Wood and wood products, food, machinery, transit and logistics',
    },
    migration: {
      foreignBornShare: '~12%',
      topOrigins: 'Russia, Ukraine, Belarus, Lithuania',
      netMigration: 'Near balance after long-run emigration',
      muslimShare: '~0.2%',
    },
    family: {
      marriageRate: '~5.2 per 1,000',
      divorceRate: '~2.5 per 1,000',
      meanAgeFirstMarriage: '~32 men / ~30 women',
      birthsOutsideMarriage: '~40%',
    },
    water: { fluoridation: 'Not fluoridated', regime: 'EU directive; artesian groundwater supply' },
  },
  {
    iso3: 'MCO',
    name: 'Monaco',
    headOfGovernment: 'Minister of State Isabelle Berro-Amadeï, since 2024; Prince Albert II is head of state',
    governingBloc: 'Principality; the Minister of State is appointed by the Prince',
    legislature: 'National Council 24',
    lastElection: 'February 2023 national election',
    left: [{ name: 'No organised left bloc', support: '—', note: 'Monegasque politics runs on national lists, not a left–right axis' }],
    right: [{ name: 'Monegasque National Union (UNM)', support: '~87%', note: 'Took every seat in 2023' }],
    tax: {
      topIncome: 'No personal income tax for residents (French nationals excepted by treaty)',
      corporate: '25%, charged only where over 25% of turnover is generated abroad',
      vat: '20% under the French system',
      socialContributions: '~13% employee / ~28–40% employer',
      taxToGdp: 'Not published on a comparable basis',
    },
    trade: {
      exportsPctGdp: 'Not separately reported; customs union with France',
      exportPartners: 'France, Italy, Germany',
      importPartners: 'France, Italy',
      leadingExports: 'Tourism, banking and wealth management, real estate, cosmetics',
    },
    migration: {
      foreignBornShare: '~68% — Monegasque citizens are about a quarter of residents',
      topOrigins: 'France, Italy, United Kingdom, Switzerland',
      netMigration: 'Constrained by land area, not by policy',
      muslimShare: '~1%',
    },
    family: {
      marriageRate: '~5 per 1,000',
      divorceRate: '~1.5 per 1,000',
      meanAgeFirstMarriage: 'Not separately published',
      birthsOutsideMarriage: 'Not separately published',
    },
    water: { fluoridation: 'Not fluoridated', regime: 'Supplied from the French network' },
  },
  {
    iso3: 'MDA',
    name: 'Moldova',
    headOfGovernment: 'PM Alexandru Munteanu, since November 2025; President Maia Sandu',
    governingBloc: 'PAS majority on an EU-accession platform',
    legislature: 'Parliament 101',
    lastElection: 'September 2025 parliamentary election',
    left: [{ name: 'Patriotic Bloc (Socialists and Communists)', support: '~24.2%', note: 'Pro-Russian left; main opposition' }],
    right: [
      { name: 'Party of Action and Solidarity (PAS)', support: '~50.2%', note: 'Pro-European liberal; retained its majority' },
      { name: 'Our Party', support: '~6.2%', note: 'Populist, Bălți-based' },
    ],
    tax: {
      topIncome: '12% flat',
      corporate: '12%',
      vat: '20% standard',
      socialContributions: '~9% employee / 24% employer',
      taxToGdp: '~31%',
    },
    trade: {
      exportsPctGdp: '~35%',
      exportPartners: 'Romania, Ukraine, Italy, Germany',
      importPartners: 'Romania, Ukraine, China, Turkey',
      leadingExports: 'Agri-food, wine, sunflower oil, textiles, wire harnesses',
    },
    migration: {
      foreignBornShare: '~4%',
      topOrigins: 'Ukraine, Russia, Romania',
      netMigration: '~-15,000/yr; one of Europe’s largest diasporas relative to population',
      muslimShare: '~0.5%',
    },
    family: {
      marriageRate: '~6.0 per 1,000',
      divorceRate: '~3.0 per 1,000',
      meanAgeFirstMarriage: '~29 men / ~26 women',
      birthsOutsideMarriage: '~23%',
    },
    water: { fluoridation: 'Not fluoridated', regime: 'Naturally high fluoride in parts of the rural well supply' },
  },
  {
    iso3: 'MLT',
    name: 'Malta',
    headOfGovernment: 'PM Robert Abela (Labour Party), since January 2020',
    governingBloc: 'Labour majority government',
    legislature: 'House of Representatives 79',
    lastElection: 'March 2022 general election',
    left: [{ name: 'Labour Party (PL)', support: '~55.1%', note: 'Dominant since 2013; socially liberal, business-friendly' }],
    right: [
      { name: 'Nationalist Party (PN)', support: '~41.7%', note: 'Christian-democratic opposition' },
      { name: 'ABBA / Imperium Europa', support: '~1%', note: 'Christian-nationalist and far-right fringe' },
    ],
    tax: {
      topIncome: '35%',
      corporate: '35% headline, ~5% effective after the shareholder refund',
      vat: '18% standard',
      socialContributions: '10% employee / 10% employer',
      taxToGdp: '~28%',
    },
    trade: {
      exportsPctGdp: '~140% (services-dominated)',
      exportPartners: 'Germany, France, Italy, United States',
      importPartners: 'Italy, Germany, China',
      leadingExports: 'Remote gaming, financial services, electronics, tourism, aviation services',
    },
    migration: {
      foreignBornShare: '~27% — the fastest population growth in the EU',
      topOrigins: 'Italy, United Kingdom, India, Philippines, Serbia',
      netMigration: 'Strongly positive on third-country work permits',
      muslimShare: '~3%',
    },
    family: {
      marriageRate: '~6.2 per 1,000',
      divorceRate: '~0.8 per 1,000 (divorce legalised only in 2011)',
      meanAgeFirstMarriage: '~32 men / ~30 women',
      birthsOutsideMarriage: '~34%',
    },
    water: { fluoridation: 'Not fluoridated', regime: 'Around half the supply is desalinated' },
  },
  {
    iso3: 'MNE',
    name: 'Montenegro',
    headOfGovernment: 'PM Milojko Spajić (Europe Now!), since October 2023',
    governingBloc: 'Europe Now! with a broad pro-accession coalition',
    legislature: 'Parliament 81',
    lastElection: 'June 2023 parliamentary election',
    left: [{ name: 'Social Democrats / SDP', support: '~6%', note: 'Small social-democratic bloc' }],
    right: [
      { name: 'Europe Now! (PES)', support: '~25.6%', note: 'Centre-right reformist; leads government' },
      { name: 'Democratic Party of Socialists (DPS)', support: '~23.2%', note: 'Đukanović’s former ruling party, now in opposition' },
      { name: 'For the Future of Montenegro', support: '~14.7%', note: 'Serb-nationalist, pro-Church' },
    ],
    tax: {
      topIncome: '9% / 15%',
      corporate: '9–15% progressive',
      vat: '21% standard',
      socialContributions: '~24% employee / ~10% employer',
      taxToGdp: '~37%',
    },
    trade: {
      exportsPctGdp: '~45%',
      exportPartners: 'Serbia, Bosnia and Herzegovina, Switzerland, Italy',
      importPartners: 'Serbia, China, Germany, Italy',
      leadingExports: 'Aluminium, electricity, tourism, wine',
    },
    migration: {
      foreignBornShare: '~13%',
      topOrigins: 'Serbia, Bosnia and Herzegovina, Russia, Ukraine',
      netMigration: 'Positive since 2022 on Russian and Ukrainian relocation',
      muslimShare: '~19%',
    },
    family: {
      marriageRate: '~5.5 per 1,000',
      divorceRate: '~1.3 per 1,000',
      meanAgeFirstMarriage: '~32 men / ~29 women',
      birthsOutsideMarriage: '~18%',
    },
    water: { fluoridation: 'Not fluoridated', regime: 'Karst spring supply; summer tourist-season stress' },
  },
  {
    iso3: 'NLD',
    name: 'Netherlands',
    headOfGovernment: 'PM Rob Jetten (D66), since February 2026',
    governingBloc: 'D66 with CDA, VVD and JA21',
    legislature: 'House of Representatives 150 · Senate 75',
    lastElection: 'October 2025 general election',
    left: [
      { name: 'GreenLeft–Labour (GL-PvdA)', support: '~20 seats', note: 'Merged left list; principal opposition on the left' },
      { name: 'Socialist Party (SP)', support: '~3 seats', note: 'Left-populist, much reduced' },
      { name: 'Party for the Animals (PvdD)', support: '~3 seats', note: 'Animal-rights left' },
    ],
    right: [
      { name: 'Party for Freedom (PVV)', support: '~26 seats', note: 'Wilders’ radical right; down sharply from 37 after collapsing its own coalition' },
      { name: 'VVD', support: '~22 seats', note: 'Conservative-liberal; in government' },
      { name: 'JA21', support: '~9 seats', note: 'National-conservative; entered government in 2026' },
    ],
    tax: {
      topIncome: '49.5%',
      corporate: '25.8% (19% on the first €200,000)',
      vat: '21% standard',
      socialContributions: '~27.65% folded into the first income bracket',
      taxToGdp: '~39%',
    },
    trade: {
      exportsPctGdp: '~87%',
      exportPartners: 'Germany, Belgium, France, United Kingdom',
      importPartners: 'China, Germany, Belgium, United States',
      leadingExports: 'Machinery and lithography equipment, chemicals, refined fuels, agri-food re-exports',
    },
    migration: {
      foreignBornShare: '~15.5%',
      topOrigins: 'Turkey, Morocco, Suriname, Poland, Syria',
      netMigration: '~+100,000/yr',
      muslimShare: '~6%',
    },
    family: {
      marriageRate: '~3.9 per 1,000',
      divorceRate: '~1.7 per 1,000',
      meanAgeFirstMarriage: '~35 men / ~33 women',
      birthsOutsideMarriage: '~55%',
    },
    water: { fluoridation: 'Ended in 1973 after the Supreme Court found it lacked a legal basis', regime: 'Drinking Water Act; no additives permitted' },
  },
  {
    iso3: 'NOR',
    name: 'Norway',
    headOfGovernment: 'PM Jonas Gahr Støre (Labour), since October 2021',
    governingBloc: 'Labour minority government with support from the left',
    legislature: 'Storting 169',
    lastElection: 'September 2025 parliamentary election',
    left: [
      { name: 'Labour Party (Ap)', support: '~28.2%', note: 'Won re-election on an oil-fund and cost-of-living platform' },
      { name: 'Socialist Left (SV)', support: '~5.6%', note: 'Confidence-and-supply partner' },
      { name: 'Red Party (Rødt)', support: '~5.3%', note: 'Socialist' },
    ],
    right: [
      { name: 'Progress Party (FrP)', support: '~23.9%', note: 'Right-populist; its best result ever, now the main opposition' },
      { name: 'Conservative Party (Høyre)', support: '~14.6%', note: 'Worst result in two decades' },
    ],
    tax: {
      topIncome: '~47.4% marginal',
      corporate: '22% (78% on petroleum, 25% on finance)',
      vat: '25% standard',
      socialContributions: '7.8% employee / 14.1% employer',
      taxToGdp: '~42%',
    },
    trade: {
      exportsPctGdp: '~45%',
      exportPartners: 'United Kingdom, Germany, Netherlands, France',
      importPartners: 'Sweden, Germany, China, United States',
      leadingExports: 'Natural gas, crude oil, seafood, aluminium, shipping services',
    },
    migration: {
      foreignBornShare: '~16.8%',
      topOrigins: 'Poland, Lithuania, Sweden, Syria, Ukraine',
      netMigration: '~+30,000/yr',
      muslimShare: '~4.5%',
    },
    family: {
      marriageRate: '~4.0 per 1,000',
      divorceRate: '~1.7 per 1,000',
      meanAgeFirstMarriage: '~36 men / ~34 women',
      birthsOutsideMarriage: '~58%',
    },
    water: { fluoridation: 'Not fluoridated — repeatedly rejected', regime: 'Surface-water supply; topical fluoride policy' },
  },
  {
    iso3: 'NZL',
    name: 'New Zealand',
    headOfGovernment: 'PM Christopher Luxon (National Party), since November 2023',
    governingBloc: 'National with ACT and New Zealand First',
    legislature: 'House of Representatives 123',
    lastElection: 'October 2023 general election',
    left: [
      { name: 'Labour Party', support: '~26.9%', note: 'Lost half its vote from 2020' },
      { name: 'Green Party', support: '~11.6%', note: 'Best result in party history' },
      { name: 'Te Pāti Māori', support: '~3.1%', note: 'Māori-rights left; overperformed in electorates' },
    ],
    right: [
      { name: 'National Party', support: '~38.1%', note: 'Centre-right; leads the coalition' },
      { name: 'ACT New Zealand', support: '~8.6%', note: 'Classical liberal / libertarian' },
      { name: 'New Zealand First', support: '~6.1%', note: 'Populist nationalist; returned to Parliament' },
    ],
    tax: {
      topIncome: '39% above NZ$180,000',
      corporate: '28%',
      vat: 'GST 15% on almost everything',
      socialContributions: 'ACC earners’ levy ~1.6%; KiwiSaver is voluntary',
      taxToGdp: '~34%',
    },
    trade: {
      exportsPctGdp: '~25%',
      exportPartners: 'China, Australia, United States, Japan',
      importPartners: 'China, Australia, United States, South Korea',
      leadingExports: 'Dairy, meat, wood, wine, tourism, horticulture',
    },
    migration: {
      foreignBornShare: '~28.8%',
      topOrigins: 'United Kingdom, China, India, Australia, Philippines',
      netMigration: '~+30,000/yr, sharply down from the 2023 record',
      muslimShare: '~1.5%',
    },
    family: {
      marriageRate: '~4.0 per 1,000',
      divorceRate: '~1.6 per 1,000',
      meanAgeFirstMarriage: '~32 men / ~31 women',
      birthsOutsideMarriage: '~48%',
    },
    water: { fluoridation: 'Fluoridated — ~51% of the population', regime: 'Director-General of Health can direct councils to fluoridate (2021 amendment)' },
  },
  {
    iso3: 'POL',
    name: 'Poland',
    headOfGovernment: 'PM Donald Tusk (Civic Coalition), since December 2023',
    governingBloc: 'Civic Coalition, Third Way and the Left — in cohabitation with President Karol Nawrocki',
    legislature: 'Sejm 460 · Senate 100',
    lastElection: 'October 2023 parliamentary; June 2025 presidential',
    left: [
      { name: 'The Left (Lewica)', support: '~8.6%', note: 'Social democratic; junior coalition partner' },
      { name: 'Civic Coalition (KO)', support: '~30.7%', note: 'Liberal-centrist; leads government' },
    ],
    right: [
      { name: 'Law and Justice (PiS)', support: '~35.4%', note: 'National-conservative; largest single party, in opposition' },
      { name: 'Confederation (Konfederacja)', support: '~7.2%', note: 'Right-libertarian nationalist; polling far higher in 2026' },
    ],
    tax: {
      topIncome: '12% / 32%',
      corporate: '19% (9% for small firms)',
      vat: '23% standard',
      socialContributions: '~13.7% employee / ~20.5% employer (ZUS)',
      taxToGdp: '~35%',
    },
    trade: {
      exportsPctGdp: '~62%',
      exportPartners: 'Germany (~28%), Czechia, France, United Kingdom',
      importPartners: 'Germany, China, Italy, Netherlands',
      leadingExports: 'Machinery, vehicles and parts, furniture, food, batteries',
    },
    migration: {
      foreignBornShare: '~3% formally registered, but roughly 1.5m Ukrainians are resident',
      topOrigins: 'Ukraine, Belarus, Georgia, India',
      netMigration: 'Strongly positive since 2022 for the first time in modern history',
      muslimShare: '~0.1%',
    },
    family: {
      marriageRate: '~4.0 per 1,000',
      divorceRate: '~1.6 per 1,000',
      meanAgeFirstMarriage: '~30 men / ~28 women',
      birthsOutsideMarriage: '~28%',
    },
    water: { fluoridation: 'Discontinued', regime: 'EU directive; no national fluoridation programme' },
  },
  {
    iso3: 'PRT',
    name: 'Portugal',
    headOfGovernment: 'PM Luís Montenegro (PSD / Democratic Alliance), since April 2024',
    governingBloc: 'AD minority government',
    legislature: 'Assembly of the Republic 230',
    lastElection: 'May 2025 snap legislative election',
    left: [
      { name: 'Socialist Party (PS)', support: '~23.4%', note: 'Fell to third place for the first time since 1987' },
      { name: 'Livre', support: '~4.2%', note: 'Green-left' },
      { name: 'Communist Party (PCP)', support: '~3.0%', note: 'Historic left, now marginal' },
    ],
    right: [
      { name: 'Democratic Alliance (PSD/CDS)', support: '~32.1%', note: 'Centre-right; governs in minority' },
      { name: 'Chega', support: '~22.8%', note: 'Radical right; became the largest opposition party in 2025' },
      { name: 'Liberal Initiative (IL)', support: '~5.5%', note: 'Classical liberal' },
    ],
    tax: {
      topIncome: '48% plus a solidarity surcharge up to 5%',
      corporate: '20% after the 2025 cut',
      vat: '23% standard',
      socialContributions: '11% employee / 23.75% employer',
      taxToGdp: '~36%',
    },
    trade: {
      exportsPctGdp: '~47%',
      exportPartners: 'Spain, France, Germany, United States',
      importPartners: 'Spain, Germany, France, Netherlands',
      leadingExports: 'Vehicles and parts, machinery, textiles and footwear, cork, tourism',
    },
    migration: {
      foreignBornShare: '~16%, after the sharpest rise in the EU',
      topOrigins: 'Brazil, Angola, Cape Verde, United Kingdom, India, Nepal',
      netMigration: '~+150,000/yr',
      muslimShare: '~0.6%',
    },
    family: {
      marriageRate: '~3.5 per 1,000',
      divorceRate: '~1.8 per 1,000',
      meanAgeFirstMarriage: '~34 men / ~33 women',
      birthsOutsideMarriage: '~62%',
    },
    water: { fluoridation: 'Not fluoridated', regime: 'School milk and salt fluoridation schemes only' },
  },
  {
    iso3: 'ROU',
    name: 'Romania',
    headOfGovernment: 'PM Ilie Bolojan (PNL), since June 2025; President Nicușor Dan',
    governingBloc: 'Pro-European grand coalition of PSD, PNL, USR and the Hungarian UDMR',
    legislature: 'Chamber of Deputies 330 · Senate 136',
    lastElection: 'December 2024 parliamentary; May 2025 presidential re-run',
    left: [{ name: 'Social Democratic Party (PSD)', support: '~21.9%', note: 'Largest single party; in the grand coalition' }],
    right: [
      { name: 'Alliance for the Union of Romanians (AUR)', support: '~18.0%', note: 'Nationalist far right; main opposition' },
      { name: 'National Liberal Party (PNL)', support: '~14.3%', note: 'Centre-right; holds the premiership' },
      { name: 'SOS Romania / POT', support: '~13.8% combined', note: 'Two further hard-right lists that entered Parliament in 2024' },
    ],
    tax: {
      topIncome: '10% flat',
      corporate: '16% (1–3% micro-enterprise regime)',
      vat: '21% standard after the August 2025 rise',
      socialContributions: '35% employee (25% pension + 10% health)',
      taxToGdp: '~27% — the lowest in the EU',
    },
    trade: {
      exportsPctGdp: '~40%',
      exportPartners: 'Germany, Italy, France, Hungary',
      importPartners: 'Germany, Italy, China, Hungary',
      leadingExports: 'Vehicles and parts, machinery, electrical equipment, cereals',
    },
    migration: {
      foreignBornShare: '~3%',
      topOrigins: 'Inbound labour from Nepal, Sri Lanka and Turkey; ~4m Romanians live abroad',
      netMigration: 'Negative overall, though returnees are rising',
      muslimShare: '~0.3%',
    },
    family: {
      marriageRate: '~6.5 per 1,000',
      divorceRate: '~1.4 per 1,000',
      meanAgeFirstMarriage: '~32 men / ~29 women',
      birthsOutsideMarriage: '~33%',
    },
    water: { fluoridation: 'Not fluoridated', regime: 'EU directive; rural well supply is a persistent quality gap' },
  },
  {
    iso3: 'RUS',
    name: 'Russia',
    headOfGovernment: 'PM Mikhail Mishustin; President Vladimir Putin, re-elected March 2024',
    governingBloc: 'United Russia dominance with a managed "systemic opposition"',
    legislature: 'State Duma 450 · Federation Council 178',
    lastElection: 'March 2024 presidential (~87%); September 2021 Duma',
    left: [{ name: 'Communist Party (CPRF)', support: '~18.9%', note: 'Largest systemic opposition party; supports the war' }],
    right: [
      { name: 'United Russia', support: '~49.8%', note: 'Ruling party; constitutional majority' },
      { name: 'LDPR', support: '~7.6%', note: 'Nationalist, historically Zhirinovsky’s vehicle' },
      { name: 'A Just Russia — For Truth', support: '~7.5%', note: 'Nominally social-democratic, reliably pro-Kremlin' },
    ],
    tax: {
      topIncome: '13–22% progressive after the 2025 reform',
      corporate: '25% from 2025',
      vat: '20% standard',
      socialContributions: '30% unified employer contribution',
      taxToGdp: '~35% including hydrocarbon rents',
    },
    trade: {
      exportsPctGdp: '~25%',
      exportPartners: 'China (~34%), India, Turkey, Belarus',
      importPartners: 'China, Belarus, Turkey, Kazakhstan',
      leadingExports: 'Crude oil and products, natural gas, coal, wheat, metals, fertiliser',
    },
    migration: {
      foreignBornShare: '~8%',
      topOrigins: 'Ukraine, Kazakhstan, Uzbekistan, Tajikistan, Kyrgyzstan',
      netMigration: 'Large labour inflow from Central Asia against sustained professional emigration',
      muslimShare: '~11–15%',
    },
    family: {
      marriageRate: '~6.8 per 1,000',
      divorceRate: '~4.7 per 1,000 — among the highest in the world',
      meanAgeFirstMarriage: '~28 men / ~26 women',
      birthsOutsideMarriage: '~21%',
    },
    water: { fluoridation: 'Very limited; a few municipal schemes', regime: 'State sanitary standards (SanPiN)' },
  },
  {
    iso3: 'SRB',
    name: 'Serbia',
    headOfGovernment: 'PM Đuro Macut, since April 2025; President Aleksandar Vučić',
    governingBloc: 'SNS-led coalition amid sustained anti-government protests',
    legislature: 'National Assembly 250',
    lastElection: 'December 2023 parliamentary election',
    left: [{ name: 'Socialist Party of Serbia (SPS)', support: '~6.6%', note: 'Milošević’s former party; junior coalition partner' }],
    right: [
      { name: 'Serbian Progressive Party (SNS)', support: '~46.7%', note: 'Vučić’s dominant party' },
      { name: 'NADA / national-conservative bloc', support: '~5%', note: 'Monarchist and pro-Russian right' },
    ],
    tax: {
      topIncome: '10% flat plus a 10–15% annual surtax',
      corporate: '15%',
      vat: '20% standard',
      socialContributions: '19.9% employee / 15.15% employer',
      taxToGdp: '~36%',
    },
    trade: {
      exportsPctGdp: '~55%',
      exportPartners: 'Germany, Italy, Bosnia and Herzegovina, Hungary',
      importPartners: 'Germany, China, Italy, Hungary',
      leadingExports: 'Vehicles, electrical equipment, rubber, cereals, non-ferrous metals',
    },
    migration: {
      foreignBornShare: '~9%, largely former-Yugoslav',
      topOrigins: 'Bosnia and Herzegovina, Croatia, Russia (post-2022 relocation), China',
      netMigration: 'Roughly balanced; Russian inflow offsets youth emigration',
      muslimShare: '~4%',
    },
    family: {
      marriageRate: '~5.3 per 1,000',
      divorceRate: '~1.5 per 1,000',
      meanAgeFirstMarriage: '~32 men / ~29 women',
      birthsOutsideMarriage: '~28%',
    },
    water: { fluoridation: 'Not fluoridated', regime: 'National standards; Vojvodina has natural arsenic issues' },
  },
  {
    iso3: 'SVK',
    name: 'Slovakia',
    headOfGovernment: 'PM Robert Fico (Smer-SD), since October 2023; President Peter Pellegrini',
    governingBloc: 'Smer with Hlas and the Slovak National Party',
    legislature: 'National Council 150',
    lastElection: 'September 2023 parliamentary election',
    left: [
      { name: 'Smer-SD', support: '~22.9%', note: 'Left-nationalist; leads government on an anti-Ukraine-aid line' },
      { name: 'Hlas-SD', support: '~14.7%', note: 'Social-democratic split from Smer; coalition partner' },
    ],
    right: [
      { name: 'Progressive Slovakia (PS)', support: '~18.0%', note: 'Liberal; main opposition, leads 2026 polling' },
      { name: 'Slovak National Party (SNS)', support: '~5.6%', note: 'Nationalist coalition partner' },
      { name: 'Republika', support: '~4.8%', note: 'Far right; fell just short of the threshold' },
    ],
    tax: {
      topIncome: '19% / 25%',
      corporate: '21% (24% for large firms from 2025)',
      vat: '23% standard after the 2025 rise',
      socialContributions: '13.4% employee / 36.2% employer',
      taxToGdp: '~35%',
    },
    trade: {
      exportsPctGdp: '~92%',
      exportPartners: 'Germany, Czechia, Poland, Hungary',
      importPartners: 'Germany, Czechia, China, Poland',
      leadingExports: 'Vehicles — the highest per-capita car output in the world — electronics, machinery',
    },
    migration: {
      foreignBornShare: '~4%',
      topOrigins: 'Czechia, Ukraine, Hungary, Romania, Serbia',
      netMigration: 'Modestly positive since 2022',
      muslimShare: '~0.1% — the lowest in the EU',
    },
    family: {
      marriageRate: '~4.9 per 1,000',
      divorceRate: '~1.6 per 1,000',
      meanAgeFirstMarriage: '~32 men / ~29 women',
      birthsOutsideMarriage: '~43%',
    },
    water: { fluoridation: 'Discontinued', regime: 'EU directive; abundant groundwater supply' },
  },
  {
    iso3: 'SVN',
    name: 'Slovenia',
    headOfGovernment: 'PM Robert Golob (Freedom Movement), since June 2022',
    governingBloc: 'Freedom Movement with the Social Democrats and the Left',
    legislature: 'National Assembly 90 · National Council 40',
    lastElection: 'April 2022 parliamentary election — a 2026 election is due; result not yet reflected here',
    left: [
      { name: 'Freedom Movement (GS)', support: '~34.5%', note: 'Green-liberal; leads government' },
      { name: 'Social Democrats (SD)', support: '~6.7%', note: 'Coalition partner' },
      { name: 'The Left (Levica)', support: '~4.4%', note: 'Democratic socialist coalition partner' },
    ],
    right: [
      { name: 'Slovenian Democratic Party (SDS)', support: '~23.5%', note: 'Janša’s national-conservative party; main opposition' },
      { name: 'New Slovenia (NSi)', support: '~6.9%', note: 'Christian-democratic' },
    ],
    tax: {
      topIncome: '50%',
      corporate: '22% from 2025',
      vat: '22% standard',
      socialContributions: '22.1% employee / 16.1% employer',
      taxToGdp: '~37%',
    },
    trade: {
      exportsPctGdp: '~85%',
      exportPartners: 'Germany, Italy, Croatia, Austria, Switzerland',
      importPartners: 'Germany, Italy, Austria, China',
      leadingExports: 'Vehicles and parts, pharmaceuticals, electrical machinery, refined fuels',
    },
    migration: {
      foreignBornShare: '~14%',
      topOrigins: 'Bosnia and Herzegovina, Kosovo, Serbia, Croatia, North Macedonia',
      netMigration: 'Positive, concentrated in construction and logistics labour',
      muslimShare: '~3.6%',
    },
    family: {
      marriageRate: '~3.2 per 1,000 — among the lowest in the EU',
      divorceRate: '~1.1 per 1,000',
      meanAgeFirstMarriage: '~33 men / ~31 women',
      birthsOutsideMarriage: '~59%',
    },
    water: { fluoridation: 'Not fluoridated', regime: 'EU directive; karst and alpine supply' },
  },
  {
    iso3: 'SWE',
    name: 'Sweden',
    headOfGovernment: 'PM Ulf Kristersson (Moderate Party), since October 2022',
    governingBloc: 'Moderates, Christian Democrats and Liberals, supported by the Sweden Democrats under the Tidö Agreement',
    legislature: 'Riksdag 349',
    lastElection: 'September 2022 general election — the next is scheduled for 13 September 2026',
    left: [
      { name: 'Social Democrats (S)', support: '~30.3%', note: 'Largest party; leads opinion polling into the 2026 election' },
      { name: 'Left Party (V)', support: '~6.8%', note: 'Democratic socialist' },
      { name: 'Green Party (MP)', support: '~5.1%', note: 'Environmentalist left' },
    ],
    right: [
      { name: 'Sweden Democrats (SD)', support: '~20.5%', note: 'National-conservative; supports the government from outside cabinet' },
      { name: 'Moderate Party (M)', support: '~19.1%', note: 'Conservative-liberal; holds the premiership' },
      { name: 'Christian Democrats (KD)', support: '~5.3%', note: 'Coalition partner' },
    ],
    tax: {
      topIncome: '~52% marginal including municipal tax',
      corporate: '20.6%',
      vat: '25% standard',
      socialContributions: '31.42% employer contribution',
      taxToGdp: '~42%',
    },
    trade: {
      exportsPctGdp: '~54%',
      exportPartners: 'Germany, Norway, United States, Denmark, Finland',
      importPartners: 'Germany, Netherlands, Norway, China',
      leadingExports: 'Machinery, vehicles, paper and pulp, iron ore, pharmaceuticals, telecoms equipment',
    },
    migration: {
      foreignBornShare: '~20.5%',
      topOrigins: 'Syria, Iraq, Finland, Poland, Somalia',
      netMigration: 'Near zero — the lowest in two decades, with emigration at a record high',
      muslimShare: '~8%',
    },
    family: {
      marriageRate: '~4.6 per 1,000',
      divorceRate: '~2.4 per 1,000',
      meanAgeFirstMarriage: '~37 men / ~34 women',
      birthsOutsideMarriage: '~55%',
    },
    water: { fluoridation: 'Not fluoridated — prohibited since 1971', regime: 'Naturally occurring fluoride only' },
  },
  {
    iso3: 'TWN',
    name: 'Taiwan',
    headOfGovernment: 'Premier Cho Jung-tai; President Lai Ching-te (DPP), since May 2024',
    governingBloc: 'DPP presidency facing a KMT–TPP legislative majority',
    legislature: 'Legislative Yuan 113',
    lastElection: 'January 2024 presidential and legislative elections',
    left: [
      { name: 'Democratic Progressive Party (DPP)', support: '~40.1% presidential / 51 seats', note: 'Centre-left, pro-sovereignty; holds the presidency but not the legislature' },
      { name: 'New Power Party / Green Party', support: '<3%', note: 'Progressive minor parties, currently unrepresented' },
    ],
    right: [
      { name: 'Kuomintang (KMT)', support: '~33.5% / 52 seats', note: 'Conservative, favours engagement with Beijing; largest legislative caucus' },
      { name: "Taiwan People's Party (TPP)", support: '~26.5% / 8 seats', note: 'Centrist-populist kingmaker' },
    ],
    tax: {
      topIncome: '40%',
      corporate: '20%',
      vat: 'Business tax 5%',
      socialContributions: '~12% labour and health insurance, mostly employer-paid',
      taxToGdp: '~14% — among the lowest of the advanced economies',
    },
    trade: {
      exportsPctGdp: '~70%',
      exportPartners: 'China and Hong Kong (~31%), United States, ASEAN, Japan',
      importPartners: 'China, Japan, United States, South Korea',
      leadingExports: 'Semiconductors, electronics, machinery, plastics, optical instruments',
    },
    migration: {
      foreignBornShare: '~3.6% — roughly 800,000 migrant workers',
      topOrigins: 'Indonesia, Vietnam, Philippines, Thailand',
      netMigration: 'Positive on labour permits; permanent settlement is rare',
      muslimShare: '~0.3%',
    },
    family: {
      marriageRate: '~5.3 per 1,000',
      divorceRate: '~2.2 per 1,000',
      meanAgeFirstMarriage: '~33 men / ~31 women',
      birthsOutsideMarriage: '~4%',
    },
    water: { fluoridation: 'No artificial fluoridation', regime: 'Drinking-water standards under the EPA; school fluoride rinse programmes' },
  },
  {
    iso3: 'UKR',
    name: 'Ukraine',
    headOfGovernment: 'PM Yulia Svyrydenko, since July 2025; President Volodymyr Zelensky',
    governingBloc: 'Wartime government under martial law; elections suspended',
    legislature: 'Verkhovna Rada 450',
    lastElection: 'July 2019 parliamentary — no national vote since the 2022 invasion',
    left: [{ name: 'Left parties', support: 'Marginal', note: 'Communist and pro-Russian parties banned or suspended since 2022' }],
    right: [
      { name: 'Servant of the People', support: '~43.2% (2019)', note: 'Zelensky’s party; holds the Rada majority' },
      { name: 'European Solidarity', support: '~8.1% (2019)', note: 'Poroshenko’s national-liberal opposition' },
      { name: 'Svoboda', support: '~2%', note: 'Far-right nationalist; no parliamentary group' },
    ],
    tax: {
      topIncome: '18% flat plus a 5% military levy',
      corporate: '18%',
      vat: '20% standard',
      socialContributions: '22% unified social contribution (employer)',
      taxToGdp: '~38% on a war-economy basis',
    },
    trade: {
      exportsPctGdp: '~30%',
      exportPartners: 'Poland, Romania, Turkey, China, Spain',
      importPartners: 'China, Poland, Germany, Turkey',
      leadingExports: 'Grain, sunflower oil, iron ore, IT services, electricity',
    },
    migration: {
      foreignBornShare: 'Not meaningfully measurable during the war',
      topOrigins: 'Inbound migration is negligible; ~6.9m refugees are abroad',
      netMigration: 'Heavily negative; ~3.7m internally displaced',
      muslimShare: '~1%',
    },
    family: {
      marriageRate: 'Distorted by wartime registration patterns',
      divorceRate: '~3.0 per 1,000',
      meanAgeFirstMarriage: '~30 men / ~27 women',
      birthsOutsideMarriage: '~20%',
    },
    water: { fluoridation: 'Not fluoridated', regime: 'Supply infrastructure damaged by the war; quality varies sharply by oblast' },
  },
  {
    iso3: 'USA',
    name: 'United States',
    headOfGovernment: 'President Donald Trump (Republican), second term since January 2025',
    governingBloc: 'Republican control of the presidency, Senate and House; midterms in November 2026',
    legislature: 'House of Representatives 435 · Senate 100',
    lastElection: 'November 2024 general election',
    left: [
      { name: 'Democratic Party', support: '~48.3% popular vote', note: 'Out of power federally; holds most large-state governments' },
      { name: 'Democratic Socialists of America', support: '~80,000 members', note: 'Left faction inside and alongside the Democratic Party' },
    ],
    right: [
      { name: 'Republican Party', support: '~49.8% popular vote', note: 'Won the presidency, Senate and House' },
      { name: 'Libertarian Party', support: '~0.4%', note: 'Largest third party by ballot access' },
    ],
    tax: {
      topIncome: '37% federal, plus state income tax up to ~13.3%',
      corporate: '21% federal plus state',
      vat: 'No federal VAT; state and local sales taxes 0–~10% combined',
      socialContributions: 'FICA 7.65% employee, matched by employer',
      taxToGdp: '~25.2% — among the lowest in the OECD',
    },
    trade: {
      exportsPctGdp: '~11%',
      exportPartners: 'Canada, Mexico, China, Netherlands, Japan',
      importPartners: 'Mexico, China, Canada, Germany',
      leadingExports: 'Refined fuels and crude, machinery, aircraft, semiconductors, agricultural goods',
    },
    migration: {
      foreignBornShare: '~15.6% — a record of roughly 53m people',
      topOrigins: 'Mexico, India, China, Philippines, El Salvador',
      netMigration: 'Turned sharply negative in 2025–26 under the enforcement and removal programme',
      muslimShare: '~1.3%',
    },
    family: {
      marriageRate: '~6.1 per 1,000',
      divorceRate: '~2.4 per 1,000',
      meanAgeFirstMarriage: '~30 men / ~28 women',
      birthsOutsideMarriage: '~40%',
    },
    water: {
      fluoridation: 'Fluoridated — ~63% of the population, about 72% of those on community systems',
      regime: 'CDC-recommended 0.7 mg/L; Utah and Florida enacted statewide bans in 2025',
    },
  },
  {
    iso3: 'ZAF',
    name: 'South Africa',
    headOfGovernment: 'President Cyril Ramaphosa (ANC), since February 2018',
    governingBloc: 'Government of National Unity — ANC with the DA and eight smaller parties',
    legislature: 'National Assembly 400 · National Council of Provinces 90',
    lastElection: 'May 2024 general election',
    left: [
      { name: 'African National Congress (ANC)', support: '~40.2%', note: 'Lost its majority for the first time since 1994' },
      { name: 'uMkhonto weSizwe (MK)', support: '~14.6%', note: 'Zuma’s breakaway; left-nationalist' },
      { name: 'Economic Freedom Fighters (EFF)', support: '~9.5%', note: 'Radical left, expropriation platform' },
    ],
    right: [
      { name: 'Democratic Alliance (DA)', support: '~21.8%', note: 'Liberal; joined the ANC in the unity government' },
      { name: 'Freedom Front Plus (FF+)', support: '~1.4%', note: 'Afrikaner minority-rights conservative' },
    ],
    tax: {
      topIncome: '45%',
      corporate: '27%',
      vat: '15% standard',
      socialContributions: 'UIF 1% employee, matched by employer',
      taxToGdp: '~27%',
    },
    trade: {
      exportsPctGdp: '~33%',
      exportPartners: 'China, United States, Germany, United Kingdom, India',
      importPartners: 'China, Germany, United States, India',
      leadingExports: 'Platinum-group metals, gold, iron ore, coal, vehicles, citrus',
    },
    migration: {
      foreignBornShare: '~4.8% — roughly 2.9m people',
      topOrigins: 'Zimbabwe, Mozambique, Lesotho, Malawi',
      netMigration: 'Positive regionally, against sustained skilled emigration',
      muslimShare: '~1.6%',
    },
    family: {
      marriageRate: '~2.6 per 1,000',
      divorceRate: '~0.4 per 1,000',
      meanAgeFirstMarriage: '~35 men / ~32 women',
      birthsOutsideMarriage: '~65%',
    },
    water: { fluoridation: 'Not fluoridated in practice — the 2000 regulation was never implemented', regime: 'SANS 241 drinking-water standard; municipal supply reliability is a live issue' },
  },
];

const BY_ISO3 = new Map(BROAD_STROKES.map((entry) => [entry.iso3, entry]));

/** Broad-stroke estimates for a template country, or `null` for the curated dossiers. */
export function broadStrokesFor(iso3: string): CountryBroadStrokes | null {
  return BY_ISO3.get(iso3.trim().toUpperCase()) ?? null;
}

/* ------------------------------------------------------------------ *
 * Card builders — one per dossier panel that would otherwise show
 * Germany-bundled content.
 * ------------------------------------------------------------------ */

export function taxEstimateCards(bs: CountryBroadStrokes): EstimateCard[] {
  return [
    { title: 'Top personal income tax rate', value: bs.tax.topIncome, meta: REF },
    { title: 'Corporate income tax rate', value: bs.tax.corporate, meta: REF },
    { title: 'Value added / sales tax', value: bs.tax.vat, meta: REF },
    { title: 'Social contributions', value: bs.tax.socialContributions, meta: REF },
    {
      title: 'Total tax revenue',
      value: bs.tax.taxToGdp,
      meta: `${REF} · share of GDP`,
      note: 'Headline rates only. Effective burden depends on brackets, credits and local surcharges.',
    },
  ];
}

export function tradeEstimateCards(bs: CountryBroadStrokes): EstimateCard[] {
  return [
    { title: 'Exports as share of GDP', value: bs.trade.exportsPctGdp, meta: REF },
    { title: 'Main export destinations', value: bs.trade.exportPartners, meta: REF },
    { title: 'Main import origins', value: bs.trade.importPartners, meta: REF },
    {
      title: 'Leading exports',
      value: bs.trade.leadingExports,
      meta: REF,
      note: 'Ordered by value; composition shifts year to year with commodity prices.',
    },
  ];
}

export function immigrationEstimateCards(bs: CountryBroadStrokes): EstimateCard[] {
  return [
    { title: 'Foreign-born share of population', value: bs.migration.foreignBornShare, meta: REF },
    { title: 'Largest origin countries', value: bs.migration.topOrigins, meta: REF },
    { title: 'Net migration', value: bs.migration.netMigration, meta: REF },
    {
      title: 'Muslim share of population',
      value: bs.migration.muslimShare,
      meta: REF,
      note: 'Survey- and census-based estimates differ widely; treat as an order of magnitude.',
    },
  ];
}

export function marriageEstimateCards(bs: CountryBroadStrokes): EstimateCard[] {
  return [
    { title: 'Marriage rate', value: bs.family.marriageRate, meta: REF },
    { title: 'Divorce rate', value: bs.family.divorceRate, meta: REF },
    { title: 'Mean age at first marriage', value: bs.family.meanAgeFirstMarriage, meta: REF },
    {
      title: 'Births outside marriage',
      value: bs.family.birthsOutsideMarriage,
      meta: REF,
      note: 'Cohabitation is counted as outside marriage, which drives most of the cross-country spread.',
    },
  ];
}

export function tapWaterEstimateCards(bs: CountryBroadStrokes): EstimateCard[] {
  return [
    { title: 'Water fluoridation', value: bs.water.fluoridation, meta: REF },
    {
      title: 'Regulatory regime',
      value: bs.water.regime,
      meta: REF,
      note: 'Contaminant-level data (PFAS, EE2, atrazine, BPA, pharmaceutical residues) is still outstanding for this country.',
    },
  ];
}

export function governmentEstimateCards(bs: CountryBroadStrokes): EstimateCard[] {
  return [
    { title: 'Head of government', value: bs.headOfGovernment, meta: 'As of mid-2026 · estimate' },
    { title: 'Governing arrangement', value: bs.governingBloc, meta: 'As of mid-2026 · estimate' },
    { title: 'Legislature', value: bs.legislature },
    { title: 'Most recent national election', value: bs.lastElection },
  ];
}

/* ------------------------------------------------------------------ *
 * Politics section payloads — reuse the Germany components' own prop
 * shapes so the layout is identical, only the content is the country's.
 * ------------------------------------------------------------------ */

const ESTIMATE_NOTE = 'Broad-stroke estimate — replace with a national source.';

export function broadStrokesLeftism(bs: CountryBroadStrokes): PoliticsLeftismData {
  const statCards: LeftStatCard[] = [
    {
      title: 'Combined left / progressive vote',
      value: bs.left[0]?.support ?? 'Data needed',
      subtitle: `Strongest left force at the ${bs.lastElection}`,
      sources: [{ label: ESTIMATE_NOTE }],
    },
    {
      title: 'Governing arrangement',
      value: bs.governingBloc,
      subtitle: bs.headOfGovernment,
      sources: [{ label: ESTIMATE_NOTE }],
      colSpanFull: true,
    },
    {
      title: 'Legislature',
      value: bs.legislature,
      subtitle: `Most recent national vote: ${bs.lastElection}`,
      sources: [{ label: ESTIMATE_NOTE }],
    },
  ];

  const groups: LeftistGroup[] = bs.left.map((party, index) => ({
    rank: index + 1,
    group: party.name,
    type: 'Political party',
    memberPopulation: party.support,
    notes: party.note,
  }));

  return {
    statCards,
    cancelCultureTitle: 'Cancel culture incidents',
    cancelCultureRows: [
      { category: 'Recorded deplatforming / dismissal incidents', value: 'Data needed' },
      { category: 'Prosecutions or bans over social-media posts', value: 'Data needed' },
    ],
    cancelCultureSource: { label: `No ${bs.name} registry identified yet — slot retained for a national source.` },
    groupsTitle: 'LEFT PARTIES AND MOVEMENTS',
    groupsDescription: `${bs.name} left bloc by most recent national vote share. Membership figures and militant-network counts are still outstanding.`,
    groups,
  };
}

export function broadStrokesRightWing(bs: CountryBroadStrokes): PoliticsRightWingData {
  const metrics: RightMetric[] = [
    {
      title: 'STRONGEST RIGHT-WING PARTY',
      value: bs.right[0]?.support ?? 'Data needed',
      notes: bs.right[0] ? `${bs.right[0].name} — ${bs.right[0].note}` : ESTIMATE_NOTE,
    },
    {
      title: 'GOVERNING ARRANGEMENT',
      value: bs.governingBloc,
      notes: bs.headOfGovernment,
    },
    {
      title: 'MOST RECENT NATIONAL ELECTION',
      value: bs.lastElection,
      notes: bs.legislature,
    },
    {
      title: 'SELF-IDENTIFIED RIGHT-WING SHARE',
      value: 'Data needed',
      notes: `No comparable ${bs.name} ideology survey selected yet; the slot is retained rather than removed.`,
    },
    {
      title: 'OPPOSITION TO OPEN BORDERS',
      value: 'Data needed',
      notes: `Awaiting a ${bs.name} polling series on immigration control.`,
    },
    {
      title: 'TRADITIONAL GENDER ROLES / OPPOSITION TO GENDER MANDATES',
      value: 'Data needed',
      notes: `Awaiting a ${bs.name} polling series.`,
    },
  ];

  const groups: RightWingGroup[] = bs.right.map((party, index) => ({
    rank: index + 1,
    group: party.name,
    type: 'Political party',
    memberPopulation: party.support,
    notes: party.note,
  }));

  return {
    metrics,
    groupsTitle: 'RIGHT-WING PARTIES AND MOVEMENTS',
    groupsDescription: `${bs.name} right bloc by most recent national vote share. Extra-parliamentary and militant groups are not yet catalogued.`,
    groups,
  };
}
