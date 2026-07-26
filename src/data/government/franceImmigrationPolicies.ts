import type { ImmigrationPolicyArea, ImmigrationPolicyContext } from './immigrationPolicies';

/**
 * France — immigration policy areas, mirroring the Germany panel.
 *
 * The distinctive feature of the French case is that the restrictive turn has
 * happened almost entirely *outside* primary legislation: the January 2024 law
 * was gutted by the Conseil constitutionnel, no adaptation law for the EU Pact
 * was ever voted, and the tightening has instead come through ministerial
 * circulars and decrees. Every figure below is published by OFPRA, the DGEF
 * (Ministère de l'Intérieur), INSEE or the Sénat.
 */

export const FRANCE_IMMIGRATION_POLICIES_SUBSECTION_COUNT = 11;

export const FRANCE_IMMIGRATION_POLICY_CONTEXT: ImmigrationPolicyContext = {
  headline: 'France — immigration policy overview',
  period: 'July 2026',
  government: 'President Emmanuel Macron · PM Sébastien Lecornu · Interior Minister Laurent Nuñez',
  summary:
    'A restrictive turn delivered without a parliamentary majority. The January 2024 immigration law lost 35 of its 86 articles to the Conseil constitutionnel, and no adaptation law for the EU Pact was ever voted — so tightening has come through circulars and decrees instead: 7 years’ residence for regularisation, B2 French for naturalisation, and the EU Pact applied by circular from 12 June 2026. Asylum claims fell 5.5% in 2025, yet the protection rate rose above one in two.',
};

export const FRANCE_IMMIGRATION_POLICY_AREAS: readonly ImmigrationPolicyArea[] = [
  {
    id: 'border',
    title: 'Border control & enforcement',
    current:
      'EU Pact border procedures apply from 12 June 2026 — introduced by circular, with no adaptation law voted by Parliament.',
    details:
      'Six decrees, four texts and a circular in four days; the 10 June circular signed by Laurent Nuñez refers to ~150 pages of technical guidance. The Conseil d’État warned the circular cannot fill the legislator’s gaps, notably on detention appeal deadlines and the border asylum procedure.',
    impact: 'New EU rules in force but on contested legal footing.',
    source: 'DGEF circular (10–11 June 2026); Conseil d’État; Sénat, projet de loi n° 526.',
  },
  {
    id: 'asylum',
    title: 'Asylum & refugee policy',
    current: '145,210 protection claims registered in 2025, down 5.5% on 2024; first-time claims fell 14.4%.',
    details:
      'Re-examinations rose 43%. Top origins: Afghanistan (13,800), DR Congo (13,240), Haiti (12,600). OFPRA issued 156,590 decisions and granted 63,594 first-instance protections, against 54,430 in 2024.',
    impact: 'Fewer new claims, record OFPRA throughput.',
    source: 'OFPRA, bilan 2025; DGEF, demandes d’asile 2025.',
  },
  {
    id: 'protection-rate',
    title: 'Protection rate',
    current: 'OFPRA protection rate of 41.2% in 2025, up 2.4 points; 50.3% once CNDA appeals are counted.',
    details:
      'More than one applicant in two is protected by the end of the procedure — the opposite trajectory to the claim count, and driven partly by the origin mix shifting toward Afghanistan and Sudan.',
    impact: 'Majority of claimants now obtain status.',
    source: 'OFPRA, bilan 2025; Forum réfugiés.',
  },
  {
    id: 'legal',
    title: 'Legal migration pathways',
    current: '384,230 first residence permits issued in 2025, up 11.2% on 2024 (345,587).',
    details:
      'Students are the single largest motive at about a third. The entire increase comes from humanitarian permits, up 65% to ~36,000 — subsidiary protection more than doubled (+133%) and refugee/stateless statuses rose 44.5%. Renewals reached 955,080 (+7.6%).',
    impact: 'Record legal intake despite restrictive rhetoric.',
    source: 'DGEF, titres de séjour en 2025 (published 27 Jan 2026).',
  },
  {
    id: 'regularisation',
    title: 'Regularisation (admission exceptionnelle)',
    current: 'The Retailleau circular of 23 January 2025 replaced the 2012 Valls circular; residence requirement raised from 5 to 7 years.',
    details:
      'Regularisation is refocused on economic integration — chiefly employment in shortage occupations. Length of presence or children’s schooling alone no longer suffices. Implementation waited on regional shortage-occupation lists until May 2025.',
    impact: 'Regularisations fell 42% in the following year.',
    source: 'Circulaire du 23 janvier 2025; La Cimade; Amnesty International France.',
  },
  {
    id: 'labour',
    title: 'Labour migration & work rights',
    current: 'The "métiers en tension" permit created by the 2024 law survived censure — but only 1,655 were issued in 2025.',
    details:
      'This was the government’s flagship concession to the left in the 2024 law and the provision the right attacked hardest as an amnesty. The take-up figure is a small fraction of the undocumented workforce it was designed for.',
    impact: 'Headline route, marginal in practice.',
    source: 'Ministère de l’Intérieur, cited franceinfo 2026; Loi n° 2024-42.',
  },
  {
    id: 'family',
    title: 'Family reunification',
    current: 'The 2024 law’s tightening of family reunion was struck down; ordinary regroupement familial rules still apply.',
    details:
      'Longer residence requirements, tougher income and housing tests and a language precondition were among the 35 articles censured on 25 January 2024, largely as "cavaliers législatifs" unrelated to the bill rather than on substance. Family remains one of the largest permit motives.',
    impact: 'Restriction blocked; pressure to relegislate persists.',
    source: 'Conseil constitutionnel, decision of 25 January 2024.',
  },
  {
    id: 'citizenship',
    title: 'Citizenship & naturalization',
    current: 'B2 French required for every naturalisation application filed from 1 January 2026, up from B1.',
    details:
      'Decree n° 2025-648 of 15 July 2025 raised the threshold in both speech and writing, including for spouses of French nationals. Prefectures must now require an official test (TCF IRN or DELF B2) — university certificates, foreign diplomas and professional experience are no longer accepted. The Retailleau circular of 2 May 2025 separately tightened how prefectures assess income, professional stability and administrative history.',
    impact: 'Naturalisation markedly harder to obtain.',
    source: 'Décret n° 2025-648 du 15 juillet 2025; circulaire du 2 mai 2025.',
  },
  {
    id: 'acquisitions',
    title: 'Naturalization outcomes',
    current: '103,661 acquisitions of French nationality in 2024; 98,139 in 2025.',
    details:
      'The 2024 figure was a recovery from the 2023 dip caused by the digitalisation of the procedure, with naturalisations by decree up 21.9% to 48,829. Morocco (14,454), Algeria (12,002) and Tunisia (7,250) supplied close to a third of all acquisitions.',
    impact: 'Volumes falling again as the B2 rule lands.',
    source: 'INSEE, acquisitions de la nationalité française (2025 total published 9 July 2026).',
  },
  {
    id: 'deportation',
    title: 'Deportation & removal',
    current: 'Around 130,000 OQTF issued in 2024, of which roughly 12% were executed.',
    details:
      'Forced removals reached 15,569 in 2025, up 21.1% and 62% of all removals. Execution rises to 40% for those held in a detention centre (CRA). Most-removed nationalities: Algerians 2,539 (−15.3%), Moroccans 2,002 (+20.7%), Tunisians 1,627 (+25.6%).',
    impact: 'Nine in ten removal orders go unenforced.',
    source: 'Sénat, June 2025; DGEF, lutte contre l’immigration irrégulière.',
  },
  {
    id: 'algeria',
    title: 'Consular cooperation — Algeria',
    current: 'Removals to Algeria stalled for about a year as Algiers refused the consular passes required to execute OQTFs.',
    details:
      'An OQTF cannot be carried out without a laissez-passer consulaire. In February 2025 PM Bayrou gave Algiers six weeks to accept a priority list and threatened to denounce the 1968 migration agreement; April 2025 brought reciprocal expulsions of twelve diplomats. Expulsions resumed in 2026 and on 2 June 2026 both governments agreed to reopen the 1968 accord.',
    impact: 'The binding constraint on French removals.',
    source: 'Ministère de l’Intérieur (2 June 2026); France 24, December 2025.',
  },
];
