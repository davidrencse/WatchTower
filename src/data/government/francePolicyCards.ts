import type { PolicyInfographic } from './policyCards';

/**
 * France — government policy agenda by sector, for the Policies carousel.
 *
 * Mirrors the structure of `germanyPolicyInfographicCards.ts`. Every measure
 * here is a real, dated act of the French government or Parliament with a
 * named source; nothing is modelled or inferred.
 */
export const FRANCE_POLICY_INFOGRAPHICS: PolicyInfographic[] = [
  {
    sectorTitle: 'Immigration & Integration',
    description: 'Border control, deportation enforcement and the collapse of the removal channel to Algeria.',
    policies: [
      {
        name: 'Loi du 26 janvier 2024 — "contrôler l’immigration, améliorer l’intégration"',
        whatChanged:
          'The Conseil constitutionnel struck down 35 of the law’s 86 articles the day before promulgation.',
        details:
          'Passed in December 2023 only after Les Républicains rewrote it in the Senate, the law was referred to the Conseil constitutionnel by President Macron himself and by Assembly President Braun-Pivet. On 25 January 2024 the Council censured 35 of 86 articles — migration quotas, tighter family reunification, delayed access of foreigners to welfare benefits — mostly as "cavaliers législatifs" with no link to the original bill rather than on substance. Supporters of the hard line argue the core of what Parliament actually voted for was gutted on a technicality.',
        status: '35 of 86 articles struck down',
        source: 'Conseil constitutionnel, decision of 25 January 2024',
      },
      {
        name: 'Regularisation for shortage occupations (métiers en tension)',
        whatChanged:
          'Undocumented workers in listed shortage occupations can obtain a residence permit; the article survived censure.',
        details:
          'One of the few substantive provisions left standing, and the one the government wanted most. It creates a route to a "travail dans des métiers en tension" residence permit for undocumented workers already employed in sectors short of labour. Critics on the right call it an amnesty that rewards illegal entry; the government frames it as regularising work that is already happening.',
        status: 'In force',
        source: 'Loi n° 2024-42 du 26 janvier 2024',
      },
      {
        name: 'OQTF enforcement and the Algeria stand-off',
        whatChanged:
          'Around 22,000 deportation orders were issued against Algerian nationals in 2025 while Algiers refused the consular passes needed to execute them.',
        details:
          'An OQTF (obligation de quitter le territoire français) cannot be carried out without a laissez-passer consulaire from the country of origin. Algeria repeatedly refused to issue them, and removals halted for roughly a year. In February 2025 PM Bayrou gave Algiers six weeks to accept a priority list and threatened to denounce the 1968 Franco-Algerian migration agreement. The dispute escalated in April 2025 into reciprocal expulsions of twelve diplomats on each side. The non-execution of OQTFs is the single most cited failure in French immigration debate — the killers of Lola Daviet and Philippine Le Noir de Carlan were both under unenforced orders.',
        status: 'Removals resumed 2026',
        source: 'Ministère de l’Intérieur; France 24, December 2025',
      },
      {
        name: '1968 Franco-Algerian agreement reopened',
        whatChanged:
          'France and Algeria agreed on 2 June 2026 to renegotiate the 1968 accord that gives Algerians a separate immigration regime.',
        details:
          'The 1968 agreement exempts Algerian nationals from parts of ordinary French immigration law, granting easier residence and family rights. The right has demanded its repeal for years. Rather than denouncing it outright, the two governments agreed to "make it evolve", and expulsions of Algerians under OQTF restarted after a one-year freeze.',
        status: 'Under renegotiation',
        source: 'Ministère de l’Intérieur, 2 June 2026',
      },
    ],
  },
  {
    sectorTitle: 'Economy & Public Finances',
    description: 'A hung Assembly, a budget passed without a vote, and the fastest-rising debt service in thirty years.',
    policies: [
      {
        name: '2026 budget forced through under Article 49.3',
        whatChanged:
          'Lecornu abandoned his pledge never to use 49.3 and engaged the government’s responsibility to adopt the budget without a vote.',
        details:
          'Article 49.3 adopts a text without a vote unless the Assembly censures the government. On taking office Lecornu promised not to use it — a concession to an Assembly where no bloc is near the 289-seat majority. He reversed course to get a slimmed-down 2026 budget through, and survived the resulting censure motions. A limited reshuffle followed on 26 February 2026, ahead of the March municipal elections.',
        status: 'Adopted without a vote',
        source: 'franceinfo, 2026',
      },
      {
        name: 'Public debt above €3.5 trillion',
        whatChanged:
          'Maastricht debt is heading for about 118.3% of GDP in 2026, after 115.6% in 2025.',
        details:
          'French public debt passed €3,500 billion and stood at roughly €3,545 billion in July 2026. The public deficit is running near 5% of GDP for 2026 — above the 4.7% written into the finance bill — or around €140 billion. France remains under an EU excessive-deficit procedure and has been downgraded by ratings agencies during the political instability.',
        status: '≈118% of GDP',
        source: 'Sénat, PLF 2026; Cour des comptes, début 2026',
      },
      {
        name: 'Debt service overtaking major budget lines',
        whatChanged:
          'Interest on the debt costs €58 billion in 2026, against €38 billion in 2021.',
        details:
          'The fastest increase in thirty years, driven directly by the rise in interest rates since 2022. Debt service is now among the largest single items in the state budget — comparable to entire ministries — and crowds out spending decisions regardless of which coalition governs.',
        status: '€58bn in 2026',
        source: 'Fondation IFRAP; Sénat budget report',
      },
    ],
  },
  {
    sectorTitle: 'Social Policy & Welfare',
    description: 'The pension reform frozen to buy parliamentary survival, and welfare tied to mandatory activity.',
    policies: [
      {
        name: 'Pension reform suspended until 2027',
        whatChanged:
          'The 2023 increase of the retirement age from 62 to 64 is frozen until the presidential election.',
        details:
          'Suspending Macron’s flagship reform was the Socialists’ explicit condition for not bringing down the Lecornu government in the autumn 2025 censure votes. The freeze is costed at €400 million in 2026 and €1.8 billion in 2027, to be offset by savings elsewhere. The reform was originally imposed in 2023 using Article 49.3 against months of mass strikes, so its suspension is treated by opponents as an admission that it never had democratic consent.',
        status: 'Suspended to 2027',
        source: 'BBC News; déclaration de politique générale, October 2025',
      },
      {
        name: 'RSA conditionality — 15 to 20 hours of activity',
        whatChanged:
          'From 1 January 2025 the basic income allowance requires 15–20 hours of weekly activity and automatic registration with France Travail.',
        details:
          'Every RSA recipient is now automatically enrolled with France Travail and must sign a "contrat d’engagement" setting social and professional integration targets. By 2026 no recipient is exempt from the hours requirement, apart from carved-out cases — disability, invalidity, health problems, or lone parents without childcare for children under 12. Secours Catholique and ATD Quart Monde reported that the pilot results were far from conclusive, and the national anti-poverty council warned of social exclusion, stigmatisation and impoverishment.',
        status: 'Universal from 2026',
        source: 'Loi pour le plein emploi; CNLE',
      },
    ],
  },
  {
    sectorTitle: 'Security & Justice',
    description: 'A cross-party crackdown on organised drug crime, partly reined in by the constitutional court.',
    policies: [
      {
        name: 'Loi narcotrafic — "sortir la France du piège du narcotrafic"',
        whatChanged:
          'Adopted unanimously in the Senate and by 396 votes to 68 in the Assembly on 29 April 2025; promulgated 13 June 2025.',
        details:
          'A rare consensus text in a hung Parliament, creating new procedural tools against organised crime from investigation through to sentence execution. It is one of the few laws of this legislature to pass with support across almost the entire chamber.',
        status: 'In force since June 2025',
        source: 'Loi n° 2025-532 du 13 juin 2025',
      },
      {
        name: 'PNACO — national organised-crime prosecutor’s office',
        whatChanged:
          'A specialised national prosecution office for top-tier organised crime, operational from January 2026.',
        details:
          'Modelled on the existing national financial and anti-terrorist prosecution offices, the Parquet national anti-criminalité organisée handles the highest tier of organised crime including its economic and financial dimensions. The same law turns OFAST, the anti-narcotics office, into a "French DEA" under the joint authority of the Interior and Finance ministries.',
        status: 'Operational January 2026',
        source: 'Ministère de la Justice',
      },
      {
        name: 'Algorithmic intelligence gathering struck down',
        whatChanged:
          'The Conseil constitutionnel censured the use of algorithmic surveillance for narcotics investigations in full.',
        details:
          'In its decision of 12 June 2025 the Council upheld most of the law, including the contested solitary-confinement regime for drug kingpins, but entirely struck down the extension of algorithmic intelligence techniques — previously reserved for counter-terrorism — to drug trafficking.',
        status: 'Censured',
        source: 'Conseil constitutionnel, 12 June 2025',
      },
    ],
  },
  {
    sectorTitle: 'Society & Rights',
    description: 'Two landmark social laws — one already constitutional, one waiting on the constitutional court.',
    policies: [
      {
        name: 'Abortion written into the Constitution',
        whatChanged:
          'Parliament in Congress adopted the revision by 780 votes to 72 on 4 March 2024.',
        details:
          'France became the first country in the world to constitutionalise abortion. Meeting at Versailles, deputies and senators cleared the three-fifths threshold of 512 votes by a wide margin. Article 34 now provides that the law determines the conditions in which the "liberté garantie" of women to have recourse to abortion is exercised.',
        status: 'In force',
        source: 'Congrès de Versailles, 4 March 2024',
      },
      {
        name: 'Right to assisted dying (aide à mourir)',
        whatChanged:
          'Adopted on the Assembly’s final word on 15 July 2026 after the Senate rejected it three times.',
        details:
          'Tabled in April 2025 alongside a companion bill on palliative care, the text passed the Assemblée nationale in May 2025, February 2026 and June 2026, and was rejected by the Sénat in January, May and July 2026. A joint committee failed to agree on 2 June 2026, and the Senate carried a question préalable on 7 July. The government then gave the Assembly the last word in a solemn vote on 15 July 2026. The Prime Minister has announced he will refer the text to the Conseil constitutionnel before promulgation.',
        status: 'Pending constitutional review',
        source: 'Sénat, dossier législatif PPL24-661',
      },
    ],
  },
  {
    sectorTitle: 'Defence & Foreign Policy',
    description: 'Rearmament under the military programming law, and a nuclear umbrella offered to Europe.',
    policies: [
      {
        name: 'Loi de programmation militaire 2024–2030',
        whatChanged: '€400 billion of budget credits over seven years; 2026 is the third year of execution.',
        details:
          'The 2026 defence budget rises by €6.7 billion to €57.1 billion excluding pensions, reaching €66.7 billion with additional credits — of which €3.5 billion is supplementary spending beyond the LPM trajectory. Nearly €14 billion goes to armament programmes, over 30% more than 2025, alongside the recruitment of close to 40,000 personnel including 14,000 reservists.',
        status: 'Year 3 of 7',
        source: 'Ministère des Armées, PLF 2026',
      },
      {
        name: 'Extension of the nuclear deterrent to European allies',
        whatChanged:
          'Macron announced in March 2026 that the French arsenal would grow, and opened discussions on extending deterrence to European partners.',
        details:
          'France is the European Union’s only nuclear-weapon state, with roughly 290 warheads across a sea-based leg of four Le Triomphant-class SSBNs and an air-launched ASMPA-R leg. Faced with doubts about the American guarantee, Macron announced an increase in the arsenal and talks on a European dimension to French deterrence — a significant departure from the doctrine of strictly national vital interests.',
        status: 'Announced March 2026',
        source: 'IISS; Bulletin of the Atomic Scientists',
      },
    ],
  },
];
