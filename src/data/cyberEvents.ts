/**
 * Cyberattack / data-breach micro-event layer.
 *
 * Curated incidents rendered as red pins in the same micro-event tier as the news, EONET and
 * OSINT layers (`EVENT_PIN_MIN_ZOOM`), so the world view stays clean and the pins only appear
 * once the camera is over a region.
 *
 * Unlike the OSINT layer this is a **static, hand-curated set**, not a live feed — every entry
 * carries the public reports it was drawn from so the hover card can link straight out, and
 * `impact` quotes the reported figure rather than an estimate of our own. Where a claim comes
 * from the attacker rather than the victim (ransomware leak-site listings), the summary says so.
 *
 * Placement is the affected organisation's headquarters or the operating unit named in the
 * report — these are network intrusions, so there is no incident coordinate in the usual sense.
 * Coordinates are the real HQ locations and are not nudged apart for legibility, so the two
 * Tokyo entries (Aflac Japan in Shinjuku, KDDI in Iidabashi) sit ~4 km apart and only separate
 * past roughly zoom 9 — the same behaviour as the OSINT and war-event pins at city scale.
 */

export type CyberCategoryId = 'breach' | 'ransomware' | 'supplyChain' | 'aiThreat';

export interface CyberCategoryMeta {
  id: CyberCategoryId;
  /** Human label on the hover card. */
  title: string;
  /** Three-letter tactical code, matching the other pin layers. */
  code: string;
  /** Marker colour — the whole taxonomy is red, so cyber reads as one family on the globe. */
  color: string;
}

export const CYBER_CATEGORIES: readonly CyberCategoryMeta[] = [
  { id: 'breach', title: 'Data Breach', code: 'BRC', color: '#ef4444' },
  { id: 'ransomware', title: 'Ransomware', code: 'RSM', color: '#b91c1c' },
  { id: 'supplyChain', title: 'Third-Party Compromise', code: 'TPC', color: '#fb7185' },
  { id: 'aiThreat', title: 'AI-Driven Attack', code: 'AIT', color: '#e11d48' },
];

export const CYBER_CATEGORY_BY_ID: Record<CyberCategoryId, CyberCategoryMeta> =
  CYBER_CATEGORIES.reduce(
    (map, category) => {
      map[category.id] = category;
      return map;
    },
    {} as Record<CyberCategoryId, CyberCategoryMeta>,
  );

export interface CyberEvent {
  id: string;
  categoryId: CyberCategoryId;
  /** Organisation or programme hit. */
  title: string;
  /** What happened, in one or two sentences. */
  summary: string;
  /** Reported losses / operational impact, as published. */
  impact: string;
  /** Where the affected unit sits — HQ or the named operating subsidiary. */
  placeName: string;
  latitude: number;
  longitude: number;
  /** Month the incident was reported. */
  reported: string;
  /** Primary public report — opened on click. */
  url: string;
  /** Every source consulted, primary first. */
  sources: readonly string[];
}

export const CYBER_EVENTS: readonly CyberEvent[] = [
  {
    id: 'dhs-hsin',
    categoryId: 'breach',
    title: 'DHS Homeland Security Information Network',
    summary:
      'Attackers compromised the US Department of Homeland Security’s sensitive information-sharing platform used by federal, state, local and private-sector partners. Servers and an associated SharePoint environment were targeted.',
    impact:
      'Access to sensitive but unclassified data; full scope of data theft still under investigation. No confirmed financial losses published.',
    placeName: 'Washington, DC · United States',
    latitude: 38.8977,
    longitude: -77.0365,
    reported: 'Jul 2026',
    url: 'https://www.kaseya.com/blog/the-week-in-breach-news-07-08-26/',
    sources: [
      'https://www.kaseya.com/blog/the-week-in-breach-news-07-08-26/',
      'https://www.esecurityplanet.com/weekly-roundup/ai-driven-attacks-critical-exploits-and-global-breaches-define-this-week-in-july-2026-in-cybersecurity/',
    ],
  },
  {
    id: 'accenture',
    categoryId: 'breach',
    title: 'Accenture data-theft claim',
    summary:
      'A threat actor listed 35 GB of alleged Accenture data for sale — source code, RSA/SSH keys, Azure tokens and configuration files. Accenture confirmed an isolated security incident.',
    impact:
      'Potential exposure of source code and credentials. Company stated operations and service delivery were not impacted.',
    placeName: 'Dublin · Ireland',
    latitude: 53.3498,
    longitude: -6.2603,
    reported: 'Jul 2026',
    url: 'https://cyberrecaps.com/news/cybersecurity-news-july-08-2026',
    sources: [
      'https://cyberrecaps.com/news/cybersecurity-news-july-08-2026',
      'https://threatintel.cc/2026/07/08/hour-breach-round-up-jul.html',
    ],
  },
  {
    id: 'deutsche-bank',
    categoryId: 'supplyChain',
    title: 'Deutsche Bank third-party incident',
    summary:
      'Ransomware group “Unsafe” claimed a breach and posted alleged employee database extracts. Deutsche Bank confirmed an incident at an external German service provider running a marketing/incentive platform.',
    impact:
      'Alleged employee emails, password hashes and addresses exposed. Bank stated its own internal systems and network were not affected.',
    placeName: 'Frankfurt · Germany',
    latitude: 50.1109,
    longitude: 8.6821,
    reported: 'Jul 2026',
    url: 'https://cybernews.com/security/deutsche-bank-ransomware-data-breach/',
    sources: ['https://cybernews.com/security/deutsche-bank-ransomware-data-breach/'],
  },
  {
    id: 'aflac-japan',
    categoryId: 'breach',
    title: 'Aflac Japan',
    summary:
      'Attackers compromised systems at Aflac’s Japan subsidiary and accessed the policyholder portal.',
    impact:
      'Personal and bank account information of approximately 4.38 million customers stolen.',
    placeName: 'Tokyo · Japan',
    latitude: 35.6938,
    longitude: 139.7036,
    reported: 'Jul 2026',
    url: 'https://www.kaseya.com/blog/the-week-in-breach-news-07-08-26/',
    sources: [
      'https://www.kaseya.com/blog/the-week-in-breach-news-07-08-26/',
      'https://www.blackfog.com/the-state-of-ransomware-july-2026/',
    ],
  },
  {
    id: 'fairlife',
    categoryId: 'ransomware',
    title: 'Fairlife (Coca-Cola)',
    summary:
      'The Anubis ransomware group attacked Fairlife, Coca-Cola’s dairy subsidiary.',
    impact:
      'Temporary suspension of US milk production at key facilities. Data theft claimed; volume not fully confirmed publicly.',
    placeName: 'Chicago, IL · United States',
    latitude: 41.8781,
    longitude: -87.6298,
    reported: 'Jul 2026',
    url: 'https://strobes.co/blog/top-8-data-breaches-july-2026/',
    sources: [
      'https://strobes.co/blog/top-8-data-breaches-july-2026/',
      'https://www.swktech.com/swk-cybersecurity-news-recap-july-2026/',
    ],
  },
  {
    id: 'indra-group',
    categoryId: 'ransomware',
    title: 'Indra Group',
    summary:
      'The Gentlemen ransomware gang claimed an attack on a subsidiary of Indra Group — a major Spanish defence/aerospace firm and NATO contractor — and threatened to leak data.',
    impact:
      'Incident contained; company stated service continuity was maintained. Exact data volume not publicly confirmed.',
    placeName: 'Madrid · Spain',
    latitude: 40.5405,
    longitude: -3.6417,
    reported: 'Jul 2026',
    url: 'https://cybernews.com/security/indra-group-ransomware-attack-data-leak/',
    sources: [
      'https://cybernews.com/security/indra-group-ransomware-attack-data-leak/',
      'https://research.checkpoint.com/2026/6th-july-threat-intelligence-report-2/',
    ],
  },
  {
    id: 'lidl',
    categoryId: 'supplyChain',
    title: 'Lidl customer data theft',
    summary:
      'Attackers breached an IT service provider used by Lidl across Germany, Belgium and the Netherlands.',
    impact:
      'Customer names, dates of birth, phone numbers, email addresses and customer numbers stolen. Possible exposure of additional personal data. Online shop itself not affected.',
    placeName: 'Neckarsulm · Germany',
    latitude: 49.1917,
    longitude: 9.2237,
    reported: 'Jul 2026',
    url: 'https://www.helpnetsecurity.com/2026/07/13/lidl-data-breach-customer-data/',
    sources: ['https://www.helpnetsecurity.com/2026/07/13/lidl-data-breach-customer-data/'],
  },
  {
    id: 'jadepuffer',
    categoryId: 'aiThreat',
    title: 'JadePuffer — first autonomous AI ransomware',
    summary:
      'Researchers documented a ransomware attack carried out almost entirely by an autonomous AI agent: it exploited a Langflow vulnerability, ran reconnaissance, stole credentials, moved laterally and encrypted data with minimal human direction.',
    impact:
      'Production database and configuration data encrypted/wiped in the tested environment. Signals a new class of AI-driven threats.',
    placeName: 'Sysdig research disclosure · United States',
    latitude: 37.7749,
    longitude: -122.4194,
    reported: 'Jul 2026',
    url: 'https://www.esecurityplanet.com/weekly-roundup/ai-driven-attacks-critical-exploits-and-global-breaches-define-this-week-in-july-2026-in-cybersecurity/',
    sources: [
      'https://www.esecurityplanet.com/weekly-roundup/ai-driven-attacks-critical-exploits-and-global-breaches-define-this-week-in-july-2026-in-cybersecurity/',
      'https://innovatecybersecurity.com/security-threat-advisory/top-10-cybersecurity-news-july-07-2026-sysdig-documents-first-end-to-end-ai-agent-ransomware-attack-dhs-confirms-breach-of-homeland-security-information-network-and-more/',
    ],
  },
  {
    id: 'kddi',
    categoryId: 'breach',
    title: 'KDDI email platform',
    summary:
      'Unauthorized access to a shared email platform used by KDDI and other Japanese ISPs.',
    impact:
      'Approximately 12.2 million email addresses and passwords linked to 7.6 million accounts exposed.',
    placeName: 'Tokyo · Japan',
    latitude: 35.701,
    longitude: 139.7458,
    reported: 'Jul 2026',
    url: 'https://cyberrecaps.com/news/cybersecurity-news-july-08-2026',
    sources: [
      'https://cyberrecaps.com/news/cybersecurity-news-july-08-2026',
      'https://securityboulevard.com/2026/07/top-10-breaches-of-the-week/',
    ],
  },
  {
    id: 'abbott',
    categoryId: 'breach',
    title: 'Abbott Laboratories',
    summary:
      'The healthcare giant was compromised, reportedly via voice phishing. ShinyHunters and another group claimed involvement.',
    impact:
      'Claims of 30M+ PII records, over 1 million Social Security numbers, clinical notes and medical orders stolen.',
    placeName: 'Abbott Park, IL · United States',
    latitude: 42.3161,
    longitude: -87.9331,
    reported: 'Jul 2026',
    url: 'https://strobes.co/blog/top-8-data-breaches-july-2026/',
    sources: [
      'https://strobes.co/blog/top-8-data-breaches-july-2026/',
      'https://www.swktech.com/swk-cybersecurity-news-recap-july-2026/',
    ],
  },
];
