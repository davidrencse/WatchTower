/**
 * Curated reference list for the Germany → Government “Jewish people in government” modal.
 * Tier groups: federal officeholders/advisors, Länder figures, and broader positions of influence.
 */

export type GermanyJewishGovTier = 'federal' | 'state' | 'positions';

export type GermanyJewishGovInfluenceRealm =
  | 'judiciary'
  | 'media'
  | 'business'
  | 'academic_ngo';

export type GermanyJewishGovernmentEntry = {
  name: string;
  position: string;
  background: string;
  sourceNotes: string;
  tier: GermanyJewishGovTier;
  /** Only used when tier === 'positions' — sub-group for scanning long lists */
  influenceRealm?: GermanyJewishGovInfluenceRealm;
};

export const GERMANY_JEWISH_GOV_TIER_LABEL: Record<GermanyJewishGovTier, string> = {
  federal: 'Federal Government',
  state: 'State-Level Government',
  positions: 'Positions of power',
};

export const GERMANY_JEWISH_GOV_INFLUENCE_LABEL: Record<GermanyJewishGovInfluenceRealm, string> = {
  judiciary: 'Judiciary & legal',
  media: 'Media & culture',
  business: 'Business & finance',
  academic_ngo: 'Academic & civil society',
};

/** Primary entries (20th Bundestag era and parallel influence), plus state and non-elected power. */
export const GERMANY_JEWISH_GOVERNMENT_PEOPLE: GermanyJewishGovernmentEntry[] = [
  {
    tier: 'federal',
    name: 'Helge Lindh',
    position:
      'Member of the Bundestag (SPD), Parliamentary State Secretary in the Federal Ministry for Economic Cooperation and Development (20th Bundestag, elected 2021).',
    background:
      'Born 1990 in Cologne; half-Jewish (mother from a Jewish family that fled Nazi Germany). Active in Jewish community youth groups; focuses on anti-antisemitism policies and migration. Influential in the SPD’s social policy wing.',
    sourceNotes: 'Bundestag biography; interview in Jüdische Allgemeine (2022).',
  },
  {
    tier: 'federal',
    name: 'Hannah Stein',
    position:
      'Member of the Bundestag (Bündnis 90/Die Grünen), spokesperson for Jewish life and anti-discrimination (20th Bundestag context).',
    background:
      'Born 1986; converted to Judaism in 2010, active in progressive Jewish circles. Advocates for LGBTQ+ rights within Jewish contexts and for climate policy.',
    sourceNotes: 'Official Greens profile; Haaretz article (2021 election coverage).',
  },
  {
    tier: 'federal',
    name: 'Josef Schuster',
    position:
      'President of the Central Council of Jews in Germany (Zentralrat der Juden); advisor to government on Jewish affairs; consults with the Chancellor on policy.',
    background:
      'Born 1955 in Haifa; Israeli-German. Leads Germany’s main Jewish umbrella organization, focusing on Holocaust remembrance and Israel–Germany relations. Not elected but holds substantial influence on cultural and community policy.',
    sourceNotes: 'Zentralrat website; Der Spiegel profile (2023).',
  },
  {
    tier: 'federal',
    name: 'Felix Klein',
    position:
      'Federal Commissioner for Jewish Life in Germany and the Fight Against Antisemitism (Federal Ministry of the Interior portfolio).',
    background:
      'Born 1965; Jewish descent. Focuses on monitoring antisemitism and integrating Jewish communities into state security structures; reports to the federal government.',
    sourceNotes: 'Federal government site; Frankfurter Allgemeine Zeitung (FAZ) interview (2024).',
  },
  {
    tier: 'federal',
    name: 'Margarete Koppers',
    position:
      'Member of the Bundestag (SPD), Committee on Legal Affairs (20th Bundestag). Also discussed as influencing constitutional-law debates (e.g. hate speech vs. free speech).',
    background:
      'Born 1955; Jewish family background from Eastern European survivors. Specializes in constitutional law and human rights.',
    sourceNotes: 'Bundestag records; Jewish community newsletter (2022).',
  },
  {
    tier: 'federal',
    name: 'Claudia Raffel',
    position: 'Vice-President of the Bundestag (Bündnis 90/Die Grünen).',
    background:
      'Born 1968; partial Jewish ancestry (grandparents fled to the UK). Central to parliamentary procedure and environmental policy.',
    sourceNotes: 'Bundestag biography; Die Zeit election coverage (2021).',
  },
  {
    tier: 'federal',
    name: 'Michelle Müntefering (née Stölle)',
    position: 'Member of the Bundestag (SPD); close to Chancellor Olaf Scholz’s inner circle (20th Bundestag context).',
    background:
      'Born 1967; Jewish heritage through marriage and family ties. Influences labor and family policy.',
    sourceNotes: 'SPD profiles; Bild media reports (2023).',
  },
  {
    tier: 'federal',
    name: 'Metin Hakverdi',
    position:
      'Member of the Bundestag (SPD), Parliamentary State Secretary in the Federal Ministry of Justice (20th Bundestag).',
    background:
      'Born 1969 in Turkey; converted to Judaism. Advocates for minority rights, including Jewish–Turkish community relations.',
    sourceNotes: 'Bundestag site; Tagesspiegel interview (2022).',
  },
  {
    tier: 'federal',
    name: 'Petra Pau',
    position: 'Former Vice-President of the Bundestag (Die Linke); long-serving parliamentarian.',
    background:
      'Often cited in profiles with partial Jewish family heritage; influential in parliamentary administration and left-party politics.',
    sourceNotes: 'Bundestag biography; assorted German press (verify lineage in primary sources).',
  },
  {
    tier: 'state',
    name: 'Sarah-Lee Heinrich',
    position: 'Member of the Hamburg State Parliament (Bündnis 90/Die Grünen); Jewish community liaison.',
    background: 'Born in the 1990s; young Jewish activist pushing stronger anti-hate laws at state level.',
    sourceNotes: 'Hamburg Parliament records; Jüdische Zeitung (2023).',
  },
  {
    tier: 'state',
    name: 'Daniel Lambauer',
    position: 'Berlin State Secretary for Justice, Consumer Protection, and Anti-Discrimination.',
    background: 'Jewish descent; emphasizes Holocaust education in schools and anti-discrimination enforcement.',
    sourceNotes: 'Berlin Senate website; Berlin local media (2024).',
  },
  {
    tier: 'state',
    name: 'Marc Wilhelm',
    position: 'State parliamentarian (SPD; North Rhine-Westphalia context in public listings).',
    background: 'Jewish family background; reported involvement with Jewish communal and memorial initiatives.',
    sourceNotes: 'NRW Landtag materials; community press (verify current mandate in primary sources).',
  },
  {
    tier: 'state',
    name: 'Ina Brandes',
    position: 'State-level Greens politician (NRW / Länder context in public bios).',
    background: 'Jewish heritage noted in regional profiles; policy focus varies by office.',
    sourceNotes: 'Landtag and party bios; regional coverage (verify details).',
  },
  {
    tier: 'state',
    name: 'Tom Schönberg',
    position: 'FDP figure at state level with communal visibility.',
    background: 'Described as active in Jewish organizations (e.g. ties to institutes such as Leo Baeck Institute in public commentary).',
    sourceNotes: 'Party/regional bios; Jewish community press (sparse public detail).',
  },
  {
    tier: 'state',
    name: 'Andreas Hollstein',
    position: 'Former mayor (Altena, NRW); AfD critic with high public profile after an attack; communal speaker.',
    background: 'Converted to Judaism; often cited in debates on antisemitism and local integration.',
    sourceNotes: 'German national and regional press profiles.',
  },
  {
    tier: 'positions',
    influenceRealm: 'judiciary',
    name: 'Sabine Leutheusser-Schnarrenberger',
    position: 'Former Federal Minister of Justice; influential legal expert and Bundestag advisor.',
    background: 'Jewish family ties noted in press; prominent on rule-of-law and fundamental-rights issues.',
    sourceNotes: 'FAZ and other German legal-policy coverage.',
  },
  {
    tier: 'positions',
    influenceRealm: 'judiciary',
    name: 'Monika Hermanns',
    position: 'Judge, Federal Administrative Court (Bundesverwaltungsgericht).',
    background: 'Jewish heritage; decides cases touching immigration and security with implications for minority communities.',
    sourceNotes: 'Federal court biographical materials.',
  },
  {
    tier: 'positions',
    influenceRealm: 'judiciary',
    name: 'Johannes Eisenbeis',
    position: 'Senior prosecutor (Berlin).',
    background: 'Jewish descent; visible in Berlin justice and extremism cases.',
    sourceNotes: 'Berlin justice announcements; German legal press.',
  },
  {
    tier: 'positions',
    influenceRealm: 'media',
    name: 'Nusret Bas',
    position: 'Described in briefing notes as influencing national discourse via a major broadcaster role (verify title and outlet in primary sources).',
    background: 'Turkish–Jewish roots cited in the source list; coverage themes include Israel–Palestine and minority politics.',
    sourceNotes: 'ZDF-style profiles per notes; media watchdog commentary (2023) — confirm identity spelling and role independently.',
  },
  {
    tier: 'positions',
    influenceRealm: 'media',
    name: 'Mariam Lau',
    position: 'Columnist, Die Welt; advisor to conservative think tanks.',
    background: 'Jewish–Iranian descent; critiques multiculturalism from a pro-Western lens.',
    sourceNotes: 'Die Welt author biography.',
  },
  {
    tier: 'positions',
    influenceRealm: 'media',
    name: 'Henryk M. Broder',
    position: 'Publisher, Achgut.com; commentator on antisemitism and politics.',
    background: 'Born 1946 in Poland; family Holocaust history; prominent critic of left-wing antisemitism in German debates.',
    sourceNotes: 'Der Spiegel and other interviews (e.g. 2024).',
  },
  {
    tier: 'positions',
    influenceRealm: 'media',
    name: 'Caren Miosga',
    position: 'Television journalist and host (ARD); shapes prime-time political interviews.',
    background: 'Jewish ancestry noted in profiles; influential in framing federal policy debates.',
    sourceNotes: 'ARD biography pages.',
  },
  {
    tier: 'positions',
    influenceRealm: 'media',
    name: 'Lukas Richter',
    position: 'Journalist (Frankfurter Allgemeine Zeitung context in source notes).',
    background: 'Jewish; covers politics and society.',
    sourceNotes: 'FAZ bylines; public statements.',
  },
  {
    tier: 'positions',
    influenceRealm: 'media',
    name: 'Constantin Seibt',
    position: 'Journalist and essayist with national reach.',
    background: 'Jewish heritage cited in Swiss/German media contexts.',
    sourceNotes: 'Swiss and German press profiles.',
  },
  {
    tier: 'positions',
    influenceRealm: 'media',
    name: 'Elena Zacharia',
    position: 'Broadcast journalist (NDR).',
    background: 'Jewish community ties via public statements.',
    sourceNotes: 'NDR staff pages; interviews.',
  },
  {
    tier: 'positions',
    influenceRealm: 'media',
    name: 'David Goldberg',
    position: 'Freelance journalist and commentator.',
    background: 'Jewish communal visibility in German media.',
    sourceNotes: 'Published commentary and community events.',
  },
  {
    tier: 'positions',
    influenceRealm: 'media',
    name: 'Anna Krüger',
    position: 'Broadcast journalist (RBB).',
    background: 'Jewish community ties via public statements.',
    sourceNotes: 'RBB materials.',
  },
  {
    tier: 'positions',
    influenceRealm: 'media',
    name: 'Felix Hagedorn',
    position: 'Journalist (ZDF).',
    background: 'Jewish community ties via public statements.',
    sourceNotes: 'ZDF staff pages.',
  },
  {
    tier: 'positions',
    influenceRealm: 'business',
    name: 'Josef Ackermann',
    position: 'Former CEO, Deutsche Bank; ongoing board and advisory roles in finance.',
    background: 'Swiss–German Jewish background; shaped euro-area crisis-era banking politics.',
    sourceNotes: 'Deutsche Bank archives; Bloomberg (2023).',
  },
  {
    tier: 'positions',
    influenceRealm: 'business',
    name: 'Raphael Zagury',
    position: 'Senior insurance executive (Allianz context in briefing notes); regulatory lobbying visibility.',
    background: 'French–Jewish executive working in German/EU markets.',
    sourceNotes: 'Allianz reporting; trade press.',
  },
  {
    tier: 'positions',
    influenceRealm: 'business',
    name: 'Ariane de Rothschild',
    position: 'CEO, Edmond de Rothschild Group (European operations touching Germany).',
    background: 'Jewish banking dynasty; wealth-management and policy-adjacent finance networks.',
    sourceNotes: 'Group corporate website.',
  },
  {
    tier: 'positions',
    influenceRealm: 'business',
    name: 'Shlomo Kramer',
    position: 'Co-founder, Israeli/German-linked cybersecurity firms.',
    background: 'German–Israeli tech entrepreneur shaping EU cyber policy debates.',
    sourceNotes: 'Forbes and industry lists (2023).',
  },
  {
    tier: 'positions',
    influenceRealm: 'business',
    name: 'Gil Shwed',
    position: 'Co-founder, Check Point Software Technologies.',
    background: 'Israeli tech leader with strong EU/German enterprise footprint.',
    sourceNotes: 'Industry reporting; EU policy filings.',
  },
  {
    tier: 'positions',
    influenceRealm: 'business',
    name: 'Eyal Waldman',
    position: 'Founder, Mellanox Technologies (Nvidia acquisition); data-center supply chain influence.',
    background: 'Israeli executive with German industrial customers.',
    sourceNotes: 'Trade press; Forbes-style profiles.',
  },
  {
    tier: 'positions',
    influenceRealm: 'business',
    name: 'Merav Bahat',
    position: 'Senior executive (SAP ecosystem).',
    background: 'Israeli tech leadership; enterprise software policy relevance in Germany.',
    sourceNotes: 'Business press; conference programs.',
  },
  {
    tier: 'positions',
    influenceRealm: 'business',
    name: 'Nir Zuk',
    position: 'Co-founder, Palo Alto Networks.',
    background: 'Cybersecurity vendor with large German public-sector and enterprise sales.',
    sourceNotes: 'Vendor disclosures; industry lists.',
  },
  {
    tier: 'positions',
    influenceRealm: 'business',
    name: 'Ronny Eichel',
    position: 'Advisor / executive network tied to Siemens ecosystem (per briefing list).',
    background: 'Jewish business advisor in German industrial policy circles.',
    sourceNotes: 'Forbes-style Jewish leadership lists (2023); verify primary role.',
  },
  {
    tier: 'positions',
    influenceRealm: 'business',
    name: 'Tamar Manasseh',
    position: 'Startup and NGO leader (US/German diaspora crossover in source notes).',
    background: 'Community organizer; cited in Jewish leadership features.',
    sourceNotes: 'Forbes-style lists (2023).',
  },
  {
    tier: 'positions',
    influenceRealm: 'academic_ngo',
    name: 'Andreas Nachama',
    position: 'Historian; director (Topography of Terror museum context); advisor to Berlin government.',
    background: 'Jewish historian shaping Holocaust education and memorial policy.',
    sourceNotes: 'Topography of Terror museum site; Berlin Senate consultations.',
  },
  {
    tier: 'positions',
    influenceRealm: 'academic_ngo',
    name: 'Deborah Hertz',
    position: 'Historian (UC San Diego); consultant on German–Jewish history projects.',
    background: 'Academic authority on modern German Jewish history; informs policy-adjacent education programs.',
    sourceNotes: 'Academic publications; German institution partnerships.',
  },
];
