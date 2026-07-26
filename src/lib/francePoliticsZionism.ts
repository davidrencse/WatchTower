export type FranceZionismMetric = {
  title: string;
  value: string;
  notes: string;
  source?: string;
};

export type FranceZionismGroup = {
  rank: number;
  group: string;
  type: string;
  size: string;
  notes: string;
};

export const FRANCE_ZIONISM_METRICS: readonly FranceZionismMetric[] = [
  {
    title: 'SELF-IDENTIFIED JEWISH IDENTITY SHARE',
    value: '0.7% (~470,000)',
    notes:
      'Population share estimate. Another 200,000-300,000 persons of Jewish ancestry no longer self-identify, yielding a broader ethnic Jewish pool of ~1.1% of the French population.',
    source: 'INED/CNRS adjusted estimates, 2023',
  },
  {
    title: 'PROFESSORS / SELF-IDENTIFIED JEWISH ACADEMICS',
    value: '~8%',
    notes:
      'Overall estimate for all tenured French academics with a Jewish background. Humanities/social sciences full professors at top 10 universities: 10-14%; law/medicine: 7-9%; STEM: 3-5%.',
    source: "L'Observatoire des elites, 2022; CNRS internal data, 2021",
  },
  {
    title: 'SUPPORTING ISRAEL / STRONG JEWISH IDENTITY',
    value: '72%',
    notes:
      '72% state that support for Israel security is essential to their identity. This is the best direct measure of strong Jewish identity combined with support for Israel within the Jewish community.',
    source: 'CFCA survey, 2023',
  },
  {
    title: 'BELIEF IN JEWISH CONSPIRACY THEORIES / ANTISEMITISM',
    value: '20-42%',
    notes:
      '42% agree Jews have too much power in the economy and media; 35% think Jews are more loyal to Israel than to France; 28% say Jews exploit the Holocaust; 20% believe Jews control the French government.',
    source: 'ADL Global 100, 2023; IFOP, 2024; Fondapol, 2022; Viavoice, 2023',
  },
  {
    title: 'BELIEF IN / SUPPORT FOR STRONG JEWISH SECURITY AND ISRAEL',
    value: '72% / 55% / 77%',
    notes:
      '72% of French Jews say support for Israel security is essential to their identity; 55% of the general population view Israel favorably; 77% of French MPs voted for the 2023 resolution condemning Hamas and affirming Israel right to self-defense.',
    source: 'CFCA, 2023; IFOP, 2024; National Assembly records',
  },
  {
    title: 'JEWISH ACADEMIC CLUBS / STUDENT ORGANIZATIONS',
    value: '~65 active groups',
    notes:
      'UEJF 35 local chapters, Hillel France 12 campus branches, Chabad-France 8 university-adjacent centers, Bnei Akiva France 6 student chapters, Betar France 4 activist clubs, plus informal WhatsApp/Telegram networks.',
  },
  {
    title: 'ECONOMIC TIES WITH ISRAEL',
    value: '€8.2B trade',
    notes:
      'Bilateral trade in 2023: French exports to Israel €4.1B and Israeli exports to France €4.1B. French FDI in Israel: €3.4B cumulative. Top sectors: cybersecurity, agritech, water management, defense electronics.',
    source: 'French customs data; Bank of Israel, 2023',
  },
  {
    title: 'MAJOR FRENCH CORPORATIONS WITH R&D/INVESTMENT IN ISRAEL',
    value: '9 named firms',
    notes:
      "Thales, Dassault Systemes, Sanofi, TotalEnergies, Airbus Defence & Space, Veolia, L'Oreal, Orange, and Capgemini.",
  },
  {
    title: 'NUMBER OF FRENCH POLITICIANS WITH TIES TO ISRAEL',
    value: '~55-60',
    notes:
      'Includes 12 National Assembly France-Israel Friendship Group members, 8 Senate members in the equivalent group, 4 former ministers with advisory roles, and 27 mayors of cities over 100,000 with Israeli sister-city agreements.',
  },
  {
    title: 'ARMS EXPORTS AND DEALS',
    value: '€387M licenses',
    notes:
      'Arms export licenses granted in 2023. Major items include missile components, drone surveillance systems, cyber-weapons, and radar subsystems. Ongoing contracts: €1.2B over 2024-2027.',
    source: 'DGA report',
  },
  {
    title: 'HOLOCAUST REPARATIONS',
    value: '€4.2B',
    notes:
      'Total paid since 1945, including property restitution, forced labor compensation, and social welfare payments. Annual ongoing payouts: ~€120M. Art restitution: 2,800 pieces returned or compensated, value ~€400M.',
    source: 'CIVS, 2024',
  },
  {
    title: 'NUMBER OF FRENCH-ISRAELI DUAL CITIZENSHIPS',
    value: '~210,000-250,000',
    notes:
      'French-born Israelis retaining French passport: ~180,000. Israeli-born residents of France with French citizenship: ~95,000. Total overlap accounts for unreported cases.',
    source: 'Israeli Ministry of Aliyah, 2024; French consular estimates',
  },
] as const;

export const FRANCE_ZIONISM_GROUPS: readonly FranceZionismGroup[] = [
  {
    rank: 1,
    group: 'Union des Etudiants Juifs de France (UEJF)',
    type: 'Jewish student organization',
    size: '35 local chapters',
    notes: 'University chapters across France.',
  },
  {
    rank: 2,
    group: 'Hillel France',
    type: 'Jewish campus organization',
    size: '12 campus branches',
    notes: 'Campus branches and student programming.',
  },
  {
    rank: 3,
    group: 'Chabad-France',
    type: 'Jewish religious / campus-adjacent centers',
    size: '8 university-adjacent centers',
    notes: 'Centers near university communities.',
  },
  {
    rank: 4,
    group: 'Bnei Akiva France',
    type: 'Jewish student chapters',
    size: '6 student chapters',
    notes: 'Student chapters and youth programming.',
  },
  {
    rank: 5,
    group: 'Betar France',
    type: 'Activist clubs',
    size: '4 activist clubs',
    notes: 'Student and activist clubs.',
  },
  {
    rank: 6,
    group: 'Informal WhatsApp/Telegram networks',
    type: 'Informal student networks',
    size: 'Included in ~65 active total',
    notes: 'Informal campus and community networks.',
  },
] as const;
