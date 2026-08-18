export type SpainZionismMetric = {
  title: string;
  value: string;
  notes: string;
  source?: string;
  sourceUrl?: string;
  status?: 'estimate' | 'measured' | 'institutional' | 'not-published';
};

export type SpainZionismGroup = {
  rank: number;
  group: string;
  type: string;
  size: string;
  notes: string;
};

export type SpainIsraelCorporateTie = {
  label: string;
  url: string;
};

/**
 * The Spain panel differs from Germany's in kind, not just in figures, and the evidence
 * note says so up front: Spain has no Zentralrat-equivalent membership register. Its
 * Observatorio de Antisemitismo does publish a national incident series, but on a broader
 * reporting basis than Germany's RIAS. Since the May 2024
 * recognition of Palestine and the 2025 arms-embargo decree — a state posture that makes
 * "corporate ties to Israel" a shrinking rather than a growing category. Community-size
 * figures come from the FCJE's own estimate, which the federation revised sharply upward
 * in recent years; treat the range, not the point value, as the finding.
 */
export const SPAIN_ZIONISM_EVIDENCE_NOTE =
  'Spain has no religious census or state-recognised community membership register. The FCJE estimates ' +
  'roughly 70,000 Jewish residents, while the Jewish Policy Research core-population estimate is 12,900 — ' +
  'different definitions, not interchangeable counts. Where Spain publishes no national figure—for academics, ' +
  'student groups, political networks, community opinion or dual citizenship—the equivalent card says so rather ' +
  'than converting an institutional position or a handful of examples into a population estimate.';

export const SPAIN_ZIONISM_METRICS: readonly SpainZionismMetric[] = [
  {
    title: 'JEWISH COMMUNITY SIZE',
    value: '~70,000 (0.14%)',
    notes:
      'FCJE resident-population estimate. Spain has no religious census, so this is a federation estimate rather than a count.',
    source: 'Federación de Comunidades Judías de España (FCJE)',
    sourceUrl: 'https://www.fcje.org/quienes-somos/',
    status: 'estimate',
  },
  {
    title: 'JEWISH CORE POPULATION',
    value: '12,900 (0.026%)',
    notes:
      'Institute for Jewish Policy Research estimate for 2024, reported by the World Jewish Congress. It uses a narrower core-population definition than FCJE\'s resident estimate.',
    source: 'World Jewish Congress / Institute for Jewish Policy Research',
    sourceUrl: 'https://www.worldjewishcongress.org/es/about/communities/ES',
    status: 'estimate',
  },
  {
    title: 'JEWISH ACADEMICS',
    value: 'No national count',
    notes:
      'Spanish universities do not publish a religion-based faculty register. Naming or counting academics from surnames, ancestry or public positions would not measure self-identified Jewish identity.',
    source: 'No national dataset published',
    status: 'not-published',
  },
  {
    title: 'JEWISH COMMUNITY OPINION ON ISRAEL',
    value: 'No representative poll',
    notes:
      'FCJE statements support Israel\'s security and the release of hostages, while also calling for peace. Those institutional positions cannot be reported as the measured opinion of Spain\'s Jewish population.',
    source: 'FCJE — public statements, October 2025',
    sourceUrl: 'https://www.fcje.org/2025/10/',
    status: 'institutional',
  },
  {
    title: 'ADL ANTISEMITISM INDEX',
    value: '26% (2023)',
    notes:
      'Share meeting ADL\'s composite threshold: accepting at least 6 of 11 antisemitic stereotypes. This is not the response to one conspiracy-belief question and is not interchangeable with Elcano\'s sympathy scale.',
    source: 'ADL Global 100 — Western Europe survey',
    sourceUrl:
      'https://www.adl.org/resources/press-release/adl-survey-finds-harmful-antisemitic-stereotypes-remain-deeply-entrenched',
    status: 'measured',
  },
  {
    title: 'SYMPATHY TOWARD JEWISH PEOPLE',
    value: '5.7 / 10',
    notes:
      'Mean score in Elcano\'s 2025 survey. Twenty-three percent scored 0–4 and 56% scored 6–10; the question explicitly separated Jewish people from the Israeli government.',
    source: 'Barómetro del Real Instituto Elcano, 45th wave (May–June 2025)',
    sourceUrl:
      'https://media.realinstitutoelcano.org/wp-content/uploads/2025/07/45brie-informe-julio2025.pdf',
    status: 'measured',
  },
  {
    title: 'REPORTED ANTISEMITIC INCIDENTS',
    value: '193 (2024)',
    notes:
      'The Observatorio recorded 60 in 2023 and 34 in 2022. Its 193 cases include reported hate incidents and expressions, not only criminal convictions.',
    source: 'Observatorio de Antisemitismo — 2024 report',
    sourceUrl: 'https://observatorioantisemitismo.fcje.org/wp-content/uploads/2025/07/Informe-2024-1.pdf',
    status: 'measured',
  },
  {
    title: 'JEWISH STUDENT ORGANISATIONS',
    value: 'No national count',
    notes:
      'Active Jewish life is concentrated around Madrid and Barcelona, but no national directory supports a Germany-style count. “A handful” remains a description, not a statistic.',
    source: 'No national membership dataset published',
    status: 'not-published',
  },
  {
    title: 'REGULAR EXPORTERS TO ISRAEL',
    value: '2,585 (2022)',
    notes:
      'Spanish companies exporting regularly to Israel, stable since 2019. This measures recurring exporters—not subsidiaries, investment holdings or companies physically established in Israel.',
    source: 'Spanish Ministry of Foreign Affairs — Israel country brief',
    sourceUrl: 'https://www.exteriores.gob.es/Documents/FichasPais/ISRAEL_FICHA%20PAIS.pdf',
    status: 'measured',
  },
  {
    title: 'SPANISH R&D / INVESTMENT TIES',
    value: 'No central company count',
    notes:
      'The foreign ministry documents activity across transport, water, renewable energy, engineering and infrastructure, but does not publish an audited list or a “dozens” total for current R&D and investment ties.',
    source: 'Spanish Ministry of Foreign Affairs — Israel country brief',
    sourceUrl: 'https://www.exteriores.gob.es/Documents/FichasPais/ISRAEL_FICHA%20PAIS.pdf',
    status: 'not-published',
  },
  {
    title: 'POLITICAL / FRIENDSHIP NETWORK TIES',
    value: 'No public member roll',
    notes:
      'Parliamentary friendship activity and advocacy organisations exist, but Spain has no published membership figure comparable with Germany\'s Deutsch-Israelische Gesellschaft.',
    source: 'No comparable national membership register published',
    status: 'not-published',
  },
  {
    title: 'PUBLIC SUPPORT FOR ISRAEL',
    value: '23%',
    notes:
      'Down from 28% a year earlier. In the same wave 82% described Israel\'s conduct in Gaza as genocide, 70% backed EU sanctions and 15% backed unconditional EU support for Israel.',
    source: 'Barómetro del Real Instituto Elcano, 45th wave (May–June 2025)',
    sourceUrl:
      'https://www.realinstitutoelcano.org/encuestas/45-oleada-barometro-del-real-instituto-elcano-julio-2025/',
    status: 'measured',
  },
  {
    title: 'DEFENCE EXPORTS TO ISRAEL',
    value: '0 new sale licences',
    notes:
      'No new sale licence with Israel as final destination was authorised after 7 October 2023. Five 2024 licences covered repairs, maintenance or programmes for Spain\'s own armed forces; executed exports came from earlier approvals. A statutory import-and-export embargo followed in September 2025.',
    source: 'Ministry of Economy — 2024 defence-export report',
    sourceUrl:
      'https://comercio.gob.es/ImportacionExportacion/Informes_Estadisticas/Material%20Defansa%20Doble%20Uso/2024/260223-Informe-Anual-2024.pdf',
    status: 'measured',
  },
  {
    title: 'HOLOCAUST REPARATIONS',
    value: 'No analogous programme',
    notes:
      'Spain has no cumulative state compensation programme comparable with Germany\'s. Law 12/2015 instead created a nationality route for Sephardic descendants—a citizenship measure, not cash reparations.',
    source: 'BOE — Law 12/2015 for Sephardic descendants',
    sourceUrl: 'https://www.boe.es/buscar/doc.php?id=BOE-A-2015-7045',
    status: 'institutional',
  },
  {
    title: 'RESIDENTS WITH ISRAELI NATIONALITY',
    value: '4,660 (2025)',
    notes:
      'INE annual-census count by country of nationality. It does not identify the combined Spanish–Israeli dual-citizen population, so “several thousand dual citizens” is not a verified total.',
    source: 'INE — annual census, population by country of nationality',
    sourceUrl: 'https://www.ine.es/jaxiT3/Tabla.htm?t=68527',
    status: 'measured',
  },
  {
    title: 'STATE RECOGNITION OF PALESTINE',
    value: '28 May 2024',
    notes:
      'Spain recognised the State of Palestine jointly with Ireland and Norway, with 78% domestic support. Israel recalled its ambassador and restricted the Spanish consulate in Jerusalem.',
    source: 'Government of Spain / La Moncloa',
    sourceUrl:
      'https://www.lamoncloa.gob.es/consejodeministros/resumenes/paginas/2024/280524-rueda-de-prensa-ministros.aspx',
    status: 'institutional',
  },
];

export const SPAIN_ZIONISM_GROUPS: readonly SpainZionismGroup[] = [
  {
    rank: 1,
    group: 'Federación de Comunidades Judías de España (FCJE)',
    type: 'Umbrella organisation',
    size: 'No audited membership roll',
    notes: 'Official interlocutor with the Spanish state; its ~70,000 resident estimate is not a membership count',
  },
  {
    rank: 2,
    group: 'Comunidad Judía de Madrid',
    type: 'Local community',
    size: 'Largest single community',
    notes: 'Synagogue, school (Colegio Ibn Gabirol) and community centre',
  },
  {
    rank: 3,
    group: 'Comunitat Israelita de Barcelona (CIB)',
    type: 'Local community',
    size: 'Second largest',
    notes: 'Founded 1918 — the first Jewish community re-established in modern Spain',
  },
  {
    rank: 4,
    group: 'Observatorio de Antisemitismo (FCJE)',
    type: 'Incident monitor',
    size: 'National monitoring project',
    notes: 'Publishes annual national incident reporting; its methodology is not directly comparable with Germany\'s RIAS',
  },
  {
    rank: 5,
    group: 'Movimiento contra la Intolerancia',
    type: 'Anti-racism NGO',
    size: 'National',
    notes: 'Publishes the Raxen reports covering antisemitic alongside other hate incidents',
  },
  {
    rank: 6,
    group: 'Centro Sefarad-Israel',
    type: 'Public diplomacy institution',
    size: 'State-funded',
    notes: 'Consortium of the Foreign Ministry, the Madrid regional government and the city of Madrid',
  },
  {
    rank: 7,
    group: 'Chabad Spain',
    type: 'Religious outreach network',
    size: 'Centres in Madrid, Barcelona, Marbella and the islands',
    notes: 'Concentrated where the resident and expatriate communities are largest',
  },
  {
    rank: 8,
    group: 'ACOM',
    type: 'Pro-Israel advocacy group',
    size: 'Not disclosed',
    notes: 'Litigates against municipal BDS motions; has had a large number of them annulled in court',
  },
];

export const SPAIN_ISRAEL_CORPORATE_TIES: readonly SpainIsraelCorporateTie[] = [
  {
    label: 'Foreign Ministry — bilateral trade and 2,585 regular Spanish exporters',
    url: 'https://www.exteriores.gob.es/Documents/FichasPais/ISRAEL_FICHA%20PAIS.pdf',
  },
  {
    label: 'Ministry of Economy — 2024 defence-export authorisations and deliveries',
    url: 'https://comercio.gob.es/ImportacionExportacion/Informes_Estadisticas/Material%20Defansa%20Doble%20Uso/2024/260223-Informe-Anual-2024.pdf',
  },
  {
    label: 'BOE — Real Decreto-ley 10/2025 arms embargo and Gaza measures',
    url: 'https://www.boe.es/buscar/doc.php?id=BOE-A-2025-18831',
  },
  {
    label: 'La Moncloa — recognition of the State of Palestine, 28 May 2024',
    url: 'https://www.lamoncloa.gob.es/consejodeministros/resumenes/paginas/2024/280524-rueda-de-prensa-ministros.aspx',
  },
  {
    label: 'Elcano — 45th public-opinion barometer, May–June 2025',
    url: 'https://media.realinstitutoelcano.org/wp-content/uploads/2025/07/45brie-informe-julio2025.pdf',
  },
  {
    label: 'ADL Global 100 — Spain antisemitism index methodology and result',
    url: 'https://www.adl.org/resources/press-release/adl-survey-finds-harmful-antisemitic-stereotypes-remain-deeply-entrenched',
  },
  {
    label: 'INE — 2025 residents by country of nationality',
    url: 'https://www.ine.es/jaxiT3/Tabla.htm?t=68527',
  },
  {
    label: 'FCJE — official representative body and community estimate',
    url: 'https://www.fcje.org/quienes-somos/',
  },
  {
    label: 'Observatorio — 2024 antisemitism incident report',
    url: 'https://observatorioantisemitismo.fcje.org/wp-content/uploads/2025/07/Informe-2024-1.pdf',
  },
  {
    label: 'Centro Sefarad-Israel — public diplomacy and cultural institution',
    url: 'https://www.sefarad-israel.es/',
  },
  {
    label: 'BOE — Law 12/2015 nationality route for Sephardic descendants',
    url: 'https://www.boe.es/buscar/doc.php?id=BOE-A-2015-7045',
  },
];

export const SPAIN_ISRAEL_CORPORATE_TIES_NOTE =
  'Spain publishes a count of regular exporters, but not an audited total of companies with current Israeli ' +
  'subsidiaries, R&D, investment or defence contracts. These links separate trade, arms policy, public opinion, ' +
  'community estimates and incident reporting instead of presenting them as one measure of “ties”.';

/** Metrics, Jewish-government subsection, organisations, and state-policy links. */
export const SPAIN_POLITICS_ZIONISM_GROUP_COUNT = SPAIN_ZIONISM_METRICS.length + 3;
