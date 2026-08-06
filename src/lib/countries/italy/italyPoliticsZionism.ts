export type ItalyZionismMetric = {
  title: string;
  value: string;
  notes: string;
  source: string;
  sourceUrl?: string;
};

export type ItalyZionismGroup = {
  rank: number;
  group: string;
  type: string;
  size: string;
  notes: string;
};

export const ITALY_ZIONISM_EVIDENCE_NOTE =
  'These 12 ranges were supplied for this dossier and are not independently verified. Treat them as estimates until a linked primary source is added.';

export const ITALY_ZIONISM_METRICS: readonly ItalyZionismMetric[] = [
  {
    title: 'JEWISH IDENTITY SHARE',
    value: '~0.05% (~27k)',
    notes: 'Approximate share and population count for Italy.',
    source: 'User-supplied estimate',
  },
  {
    title: 'JEWISH ACADEMICS',
    value: '~150–300',
    notes: 'Estimated number of Jewish academics in Italy.',
    source: 'User-supplied estimate',
  },
  {
    title: 'STRONG JEWISH IDENTITY / PRO-ISRAEL',
    value: '~60–70%',
    notes: 'Estimated share within Italy’s Jewish community.',
    source: 'User-supplied estimate',
  },
  {
    title: 'ANTISEMITISM BELIEF',
    value: '~20–25%',
    notes: 'Estimated share of the Italian public holding antisemitic beliefs.',
    source: 'User-supplied estimate',
  },
  {
    title: 'SUPPORT FOR ISRAEL',
    value: '~40–50% favorable',
    notes: 'Estimated favorable share among the Italian public.',
    source: 'User-supplied estimate',
  },
  {
    title: 'JEWISH STUDENT / ACADEMIC CLUBS',
    value: '~20',
    notes: 'Estimated number of Jewish student and academic clubs in Italy.',
    source: 'User-supplied estimate',
  },
  {
    title: 'ECONOMIC TIES / BILATERAL TRADE',
    value: '~€5.5–6B / year',
    notes: 'Estimated annual trade between Italy and Israel.',
    source: 'User-supplied estimate',
  },
  {
    title: 'ITALIAN FIRMS WITH ISRAEL R&D / INVESTMENT',
    value: '~20–30',
    notes: 'Estimated number of Italian firms with research, development, or investment ties in Israel.',
    source: 'User-supplied estimate',
  },
  {
    title: 'ITALIAN POLITICIANS WITH ISRAEL TIES',
    value: '~80–120',
    notes: 'Estimated number of Italian politicians with institutional or political ties to Israel.',
    source: 'User-supplied estimate',
  },
  {
    title: 'ARMS EXPORTS',
    value: '~€120–150M',
    notes: 'Estimated value of Italian arms exports in 2023.',
    source: 'User-supplied 2023 estimate',
  },
  {
    title: 'HOLOCAUST REPARATIONS PAID',
    value: '~€150–250M total',
    notes: 'Estimated cumulative amount paid by Italy.',
    source: 'User-supplied estimate',
  },
  {
    title: 'ITALIAN–ISRAELI DUAL CITIZENS',
    value: '~12–18k',
    notes: 'Estimated number of people holding both Italian and Israeli citizenship.',
    source: 'User-supplied estimate',
  },
] as const;

export const ITALY_ZIONISM_GROUPS: readonly ItalyZionismGroup[] = [
  {
    rank: 1,
    group: 'Unione Giovani Ebrei d’Italia (UGEI)',
    type: 'National Jewish youth and student union',
    size: 'National umbrella',
    notes: 'Coordinates Jewish youth organizations and local university activity across Italy.',
  },
  {
    rank: 2,
    group: 'Bocconi Jewish Students Association (BJSA)',
    type: 'University student association',
    size: 'Bocconi University',
    notes: 'Listed in UGEI’s public university directory.',
  },
  {
    rank: 3,
    group: 'Campus Chabad House, Rome',
    type: 'Jewish campus organization',
    size: 'Serves 3 Rome universities',
    notes: 'Serves Sapienza, Tor Vergata, and the American University of Rome.',
  },
  {
    rank: 4,
    group: 'Unione delle Comunità Ebraiche Italiane (UCEI)',
    type: 'Jewish community umbrella',
    size: 'National institution',
    notes: 'National representative framework in which UGEI participates.',
  },
] as const;

export const ITALY_ISRAEL_CORPORATE_TIES = [
  {
    label: 'Enel — Tel Aviv Innovation Hub and Haifa Infralab',
    url: 'https://www.enel.com/media/explore/search-press-releases/press/2016/07/enel-launches-tel-aviv-innovation-hub-in-israel',
  },
  {
    label: 'Leonardo — agreements with the Israel Innovation Authority and Tel Aviv University',
    url: 'https://www.leonardo.com/en/press-release-detail/-/detail/03-02-2023-leonardo-signs-two-agreements-with-israeli-innovation-authority-and-ramot-tel-aviv-university-in-the-field-of-innovation',
  },
  {
    label: 'Stellantis / FCA Italy — R&D cooperation with the Israel Innovation Authority',
    url: 'https://www.media.stellantis.com/em-en/corporate/press/stellantis-and-israel-innovation-authority-announce-the-signing-of-a-memorandum-of-understanding',
  },
] as const;
