import type { ImmigrationPolicyArea, ImmigrationPolicyContext } from './immigrationPolicies';

/**
 * Italy — immigration policy areas, mirroring the Germany / France panel.
 *
 * The defining feature of the Italian case under the Meloni government is
 * externalisation: the Italy–Albania protocol, repeated "safe country" decrees,
 * and record legal-migration quotas running alongside a sharp fall in sea
 * arrivals. Every figure below is published by the Ministero dell'Interno,
 * UNHCR, ISTAT, Eurostat or the courts.
 */

export const ITALY_IMMIGRATION_POLICIES_SUBSECTION_COUNT = 11;

export const ITALY_IMMIGRATION_POLICY_CONTEXT: ImmigrationPolicyContext = {
  headline: 'Italy — immigration policy overview',
  period: 'July 2026',
  government: 'PM Giorgia Meloni · Interior Minister Matteo Piantedosi',
  summary:
    'A restrictive, externalising turn. Sea arrivals have collapsed from ~157,000 in 2023 to ~66,000 in both 2024 and 2025, helped by the deal with Tunisia and Libyan interceptions. The flagship Italy–Albania protocol has been repeatedly blocked by judges and referred to the CJEU, then repurposed in 2025 as an offshore repatriation hub — its first transfers ran in February 2026. In parallel the government keeps legal migration high (497,550 work permits planned for 2026–2028) while tightening citizenship: the 2025 jure sanguinis reform and the failed June 2025 naturalisation referendum.',
};

export const ITALY_IMMIGRATION_POLICY_AREAS: readonly ImmigrationPolicyArea[] = [
  {
    id: 'albania',
    title: 'Italy–Albania protocol',
    current:
      'Offshore centres at Shëngjin and Gjadër, repurposed in 2025 into a repatriation hub; first transfers ran on 17 February 2026.',
    details:
      'Signed in November 2023 and ratified in 2024, the €670m+ protocol was designed to process asylum seekers intercepted at sea on Albanian soil. Rome tribunal judges repeatedly refused to validate the detentions and referred the "safe country" question to the CJEU; DL 37/2025 then converted Gjadër into a CPR for people already in removal proceedings in Italy, where they can be held up to 18 months.',
    impact: 'Landmark externalisation model — legally contested, low throughput.',
    source: 'Protocollo Italia–Albania (Nov 2023); DL 37/2025; CJEU, 1 Aug 2025.',
  },
  {
    id: 'arrivals',
    title: 'Sea arrivals',
    current: 'About 66,300 people arrived by sea in 2025, roughly flat on 2024 (~66,600) and down ~58% on 2023 (~157,000).',
    details:
      'The steep drop followed the July 2023 memorandum with Tunisia and stepped-up interceptions by the Libyan and Tunisian coastguards. UNHCR and NGOs record continued high mortality on the central Mediterranean route despite the falling numbers.',
    impact: 'Fewer arrivals, the government’s headline claim.',
    source: 'Ministero dell’Interno, cruscotto statistico; UNHCR Italy.',
  },
  {
    id: 'asylum',
    title: 'Asylum & refugee policy',
    current: '151,120 first-time asylum applications were lodged in 2024, up on 2023 (136,836).',
    details:
      'Applications kept rising even as arrivals fell, driven by people already in Italy and by re-examinations. In 2024, 78,565 first-instance decisions were issued. Accelerated border procedures and the "safe countries of origin" list — repeatedly redrawn by decree and law — are central to the government’s strategy.',
    impact: 'Backlog pressure despite fewer landings.',
    source: 'EUAA / Ministero dell’Interno, Commissione nazionale asilo.',
  },
  {
    id: 'safe-countries',
    title: 'Safe countries & the courts',
    current: 'The "safe country of origin" list has been rewritten by decree, then primary law, after courts refused to apply it.',
    details:
      'When judges in Rome, Bologna and elsewhere declined to validate detentions of nationals from countries the government deemed safe, the executive moved the list from a ministerial decree into a law (October 2024) and referred the dispute upward. The CJEU’s Grand Chamber ruled on 1 August 2025 that national courts can review a safe-country designation, and the Rome Court of Appeal referred the whole Albania scheme in November 2025.',
    impact: 'A running executive-vs-judiciary conflict.',
    source: 'Legge 187/2024; CJEU C-758/24 & C-759/24 (1 Aug 2025).',
  },
  {
    id: 'legal',
    title: 'Legal migration — Decreto Flussi',
    current: '497,550 work permits planned for 2026–2028, after ~452,000 across 2023–2025.',
    details:
      'The 2026–2028 flow decree (published 15 October 2025) authorises 164,850 entries in 2026, 165,850 in 2027 and 166,850 in 2028 — 230,550 for non-seasonal and self-employed work and 267,000 for seasonal jobs in agriculture and tourism. It is the largest planned legal intake in Italian history, sitting oddly beside the restrictive rhetoric.',
    impact: 'Record legal quotas to fill labour shortages.',
    source: 'DPCM decreto flussi 2026–2028 (15 Oct 2025).',
  },
  {
    id: 'special-protection',
    title: 'Special protection (Cutro decree)',
    current: 'The Cutro decree (DL 20/2023) narrowed "protezione speciale", Italy’s domestic humanitarian status.',
    details:
      'Passed after the February 2023 Cutro shipwreck that killed at least 94 people, the decree cut back the special-protection route that had been widely granted, restricted its conversion into work permits, and expanded accelerated procedures. It continued the retrenchment begun by the 2018 Salvini "security decrees".',
    impact: 'Fewer routes to regular status from within Italy.',
    source: 'DL 20/2023 (decreto Cutro), converted by L. 50/2023.',
  },
  {
    id: 'returns',
    title: 'Returns & detention (CPR)',
    current: 'The government plans a CPR (repatriation detention centre) in every region and lengthened maximum detention.',
    details:
      'Executed returns remain a small share of removal orders, the perennial weakness of Italian enforcement. The 2023–2025 decrees extended maximum detention in CPRs and expanded capacity, and the Albania hub is explicitly framed as a way to raise the number of enforced repatriations.',
    impact: 'Enforcement still lags removal orders.',
    source: 'DL 20/2023; DL 37/2025; Corte dei conti audits.',
  },
  {
    id: 'citizenship-descent',
    title: 'Citizenship — jure sanguinis reform',
    current: 'Law 74/2025 (in force 24 May 2025) limits citizenship by descent to those with an Italian parent or grandparent.',
    details:
      'Converting DL 36/2025 of 28 March 2025, the reform ended the principle that citizenship passed down indefinitely through the male and (post-1948) female line. A "genuine link" is now required; great-grandparents no longer suffice. It responded to a surge in iure sanguinis recognitions, mainly from Brazil and Argentina, and was upheld by the Constitutional Court.',
    impact: 'Diaspora descent claims sharply curtailed.',
    source: 'Legge 74/2025 (ex DL 36/2025); Corte costituzionale.',
  },
  {
    id: 'citizenship-referendum',
    title: 'Citizenship — the 2025 referendum',
    current: 'A referendum to cut the naturalisation residence requirement from 10 to 5 years failed on turnout (30.6%).',
    details:
      'Held on 8–9 June 2025 alongside four labour-law questions, the citizenship question needed a 50%+1 quorum to be valid. Backed by the CGIL union and the centre-left and opposed by Meloni — who declined to collect a ballot — it drew only 30.6% turnout and was void. The 10-year requirement, among the strictest in the EU, stands.',
    impact: 'Naturalisation rules unchanged.',
    source: 'Referendum abrogativi dell’8–9 giugno 2025; Ministero dell’Interno.',
  },
  {
    id: 'acquisitions',
    title: 'Naturalisation outcomes',
    current: 'About 217,000 people acquired Italian citizenship in 2024 — the third-highest total in the EU.',
    details:
      'Italy granted 217,400 citizenships in 2024 (18.5% of the EU total), behind Germany and Spain, at a naturalisation rate of 4.1%. Albania (~31,700) and Morocco (~28,000) are by far the largest origins, reflecting long-settled communities; Indian and Bangladeshi acquisitions are rising fast.',
    impact: 'High volume, driven by long-resident communities.',
    source: 'Eurostat (27 Mar 2026); ISTAT, Indicatori demografici 2024.',
  },
  {
    id: 'tunisia',
    title: 'Bilateral deals — Tunisia & Libya',
    current: 'The July 2023 EU–Tunisia memorandum, pushed by Rome, underpins the fall in central-Mediterranean crossings.',
    details:
      'Italy brokered the EU’s memorandum of understanding with Tunisia — budget support and border funding in exchange for stemming departures — and continues to fund and train the Libyan coastguard. Human-rights bodies document abuses of intercepted migrants returned to both countries.',
    impact: 'Departures curbed at Europe’s external edge.',
    source: 'EU–Tunisia MoU (July 2023); Italy–Libya MoU renewal.',
  },
];
