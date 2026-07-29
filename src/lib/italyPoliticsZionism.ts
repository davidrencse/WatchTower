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

export const ITALY_ZIONISM_METRICS: readonly ItalyZionismMetric[] = [
  {
    title: 'SELF-IDENTIFIED JEWISH IDENTITY SHARE',
    value: '~26,700–36,000 (0.045–0.06%)',
    notes:
      'Estimated Italian Jewish population range. Italy does not enumerate religion in its population census, so this is not an official count.',
    source: 'User-supplied range; DellaPergola 2024 baseline',
    sourceUrl: 'https://www.cbs.gov.il/he/Documents/World%20DellaPergola%202024%20complete.pdf',
  },
  {
    title: 'PROFESSORS / SELF-IDENTIFIED JEWISH ACADEMICS',
    value: 'No reliable %',
    notes:
      'User-supplied guess: 1–3%+ at elite institutions. This is not a measured national statistic; Italian university personnel data do not classify academics by religion.',
    source: 'User-supplied estimate; MUR USTAT limitation',
    sourceUrl: 'https://ustat.mur.gov.it/attivit%C3%A0/personale-universitario/',
  },
  {
    title: 'SUPPORTING ISRAEL / STRONG JEWISH IDENTITY',
    value: '13–17% public',
    notes:
      'Post–7 October public sympathy estimate. Support within Italy’s Jewish community is expected to be higher, but no directly comparable current community percentage is supplied.',
    source: 'User-supplied synthesis of post–7 October polling',
    sourceUrl: 'https://it.yougov.com/politics/articles/48229-israele-e-palestina-lopinione-pubblica-in-europa-occidentale-nel-terzo-del-conflitto',
  },
  {
    title: 'BELIEF IN JEWISH CONSPIRACY THEORIES / ANTISEMITISM',
    value: '~15% severe; 26% 6+ tropes',
    notes:
      'User-supplied indicators: about 15% severe antisemitism, 26% agreeing with six or more antisemitic tropes, 14% favoring expulsion, and 7% Holocaust denial.',
    source: 'User-supplied Italian antisemitism indicators',
    sourceUrl: 'https://eurispes.eu/en/news/results-of-the-2024-italy-report/',
  },
  {
    title: 'BELIEF IN / SUPPORT FOR STRONG JEWISH SECURITY AND ISRAEL',
    value: '~15–25% public',
    notes:
      'Public support for strong Israeli security or military actions is mixed and low. Support within the Jewish community is expected to be higher.',
    source: 'User-supplied public-opinion range',
  },
  {
    title: 'JEWISH ACADEMIC CLUBS / STUDENT ORGANIZATIONS',
    value: 'Limited / small',
    notes:
      'No authoritative national tally is available. Publicly documented activity includes UGEI and a small number of local university or campus organizations.',
    source: 'UGEI university directory',
    sourceUrl: 'https://www.ugei.it/universita',
  },
  {
    title: 'ECONOMIC TIES WITH ISRAEL',
    value: '€4–5B / year',
    notes:
      'Approximate annual bilateral goods-trade range. ICE reported €4.4B for 2023: €3.2B from Italy to Israel and €1.2B from Israel to Italy.',
    source: 'Italian Trade Agency (ICE), Israel country brief',
    sourceUrl: 'https://www.ice.it/it/sites/default/files/inline-files/ISRAELE%20NOTA%20PAESE%20071024.pdf',
  },
  {
    title: 'MAJOR GERMAN CORPORATIONS WITH R&D / INVESTMENT IN ISRAEL',
    value: 'N/A',
    notes:
      'Germany-specific category; it is not applicable to Italy. Verified Italian corporate examples are shown separately below.',
    source: 'Category applicability note',
  },
  {
    title: 'NUMBER OF GERMAN POLITICIANS WITH TIES TO ISRAEL',
    value: 'N/A',
    notes:
      'Germany-specific category; it is not applicable to Italy. No guessed religion- or “ties”-based count of Italian politicians is substituted.',
    source: 'Category applicability note',
  },
  {
    title: 'ARMS EXPORTS AND DEALS',
    value: '€22.6M (2025)',
    notes:
      'User-supplied value for shipments under previously issued licences. New Italian export licences to Israel were suspended; earlier-authorized shipments are a separate measure.',
    source: 'User-supplied 2025 prior-licence shipment figure',
  },
  {
    title: 'HOLOCAUST REPARATIONS',
    value: 'N/A',
    notes:
      'The requested cumulative reparations category is primarily German and has no directly comparable Italian total in the supplied data.',
    source: 'Category applicability note',
  },
  {
    title: 'NUMBER OF ITALIAN–ISRAELI DUAL CITIZENSHIPS',
    value: 'No official total',
    notes:
      'User-supplied proxies: about 828–928 dual/multiple nationals in the IDF during 2023–2025 and about 18,000 Italians in Israel, many of whom may be dual citizens. Neither proxy is a complete dual-citizenship count.',
    source: 'User-supplied IDF proxy; Italian Foreign Ministry resident count',
    sourceUrl: 'https://www.esteri.it/wp-content/uploads/2025/07/ANNUARIO_STATISTICO_luglio_2025.pdf',
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
