import type { PolicyInfographic } from './policyCards';

/**
 * Italy — government policy agenda by sector, for the Policies carousel.
 *
 * Mirrors `francePolicyCards.ts`. Every measure is a real, dated act of the
 * Meloni government, Parliament, the Constitutional Court or the electorate,
 * with a named source; nothing is modelled or inferred.
 */
export const ITALY_POLICY_INFOGRAPHICS: PolicyInfographic[] = [
  {
    sectorTitle: 'Immigration & Border',
    description: 'Externalisation to Albania, a collapse in sea arrivals, and record legal-migration quotas.',
    policies: [
      {
        name: 'Italy–Albania protocol',
        whatChanged:
          'Offshore centres in Albania, blocked by judges as asylum sites, were repurposed in 2025 into a repatriation hub; first transfers ran February 2026.',
        details:
          'Signed in November 2023 and ratified in 2024, the protocol was meant to process at-sea asylum seekers on Albanian soil at Shëngjin and Gjadër. Rome tribunal judges repeatedly refused to validate the detentions and referred the "safe country" question to the CJEU. In March 2025 the government reworked the scheme (DL 37/2025) so Gjadër holds people already in removal proceedings in Italy for up to 18 months. A chartered flight moved the first 30–40 migrants there on 17 February 2026. Cost estimates run above €670 million over five years.',
        status: 'Repurposed as a return hub',
        source: 'Protocollo Italia–Albania; DL 37/2025; ANSA, Feb 2026',
      },
      {
        name: 'Sea arrivals down ~58% from 2023',
        whatChanged:
          'Arrivals fell from ~157,000 in 2023 to roughly 66,000 in both 2024 and 2025.',
        details:
          'The government credits the July 2023 EU–Tunisia memorandum it brokered, plus stepped-up Libyan and Tunisian coastguard interceptions, for the drop. Human-rights organisations document abuses against migrants returned to both countries and continued high mortality on the central Mediterranean route.',
        status: 'Sustained decline',
        source: 'Ministero dell’Interno; UNHCR Italy',
      },
      {
        name: 'Decreto Flussi 2026–2028',
        whatChanged:
          '497,550 work permits planned over three years — the largest legal intake in Italian history.',
        details:
          'Published on 15 October 2025, the flow decree authorises 164,850 entries in 2026, 165,850 in 2027 and 166,850 in 2028: 230,550 for non-seasonal and self-employed work and 267,000 for seasonal jobs in agriculture and tourism. It follows ~452,000 planned across 2023–2025 and sits pointedly beside the government’s restrictive rhetoric, reflecting acute labour shortages.',
        status: 'In force',
        source: 'DPCM decreto flussi 2026–2028',
      },
      {
        name: 'Cutro decree — special protection cut back',
        whatChanged:
          'DL 20/2023 narrowed "protezione speciale", Italy’s domestic humanitarian status, after the Cutro shipwreck.',
        details:
          'The February 2023 Cutro wreck killed at least 94 people. The decree that followed restricted the widely granted special-protection route and its conversion into work permits, and expanded accelerated border procedures — continuing the line of the 2018 Salvini security decrees.',
        status: 'In force (L. 50/2023)',
        source: 'DL 20/2023, decreto Cutro',
      },
    ],
  },
  {
    sectorTitle: 'Economy & Public Finances',
    description: 'A record debt, a missed deficit target, and €190bn of EU recovery money to spend.',
    policies: [
      {
        name: 'Public debt above 137% of GDP',
        whatChanged:
          'Debt reached 137.1% of GDP at end-2025, up from 134.7% in 2024; the government pencils in 137.4% for 2026.',
        details:
          'Italy’s debt ratio is the second-highest in the euro area after Greece, and the IMF projects Italy will overtake Greece during 2026 at ~138.4% of GDP. The Superbonus building-renovation credit continues to weigh on the accounts years after being curtailed.',
        status: '≈137% of GDP',
        source: 'ISTAT; MEF, DPB 2026; IMF',
      },
      {
        name: '2025 deficit missed the 3% target',
        whatChanged:
          'The 2025 deficit came in at 3.1% of GDP, just above the EU limit, as growth slowed to 0.5%.',
        details:
          'Hitting 3.0% would have let Italy exit the EU excessive-deficit procedure a year early. Parliament approved a ~€22 billion 2026 budget in December aimed at cutting the deficit to 2.8%. GDP growth for 2025 was revised down to 0.5%, confirming a fragile recovery.',
        status: 'EDP ongoing',
        source: 'ISTAT; Reuters, Apr 2026',
      },
      {
        name: 'PNRR — €194bn recovery plan',
        whatChanged:
          'Italy is the largest recipient of the EU Recovery and Resilience Facility, with ~€194 billion in grants and loans to 2026.',
        details:
          'The plan funds digital, green and infrastructure investment against a demanding schedule of milestones. Rome has repeatedly renegotiated targets with Brussels and struggled with the pace of spending, making PNRR execution a central test of the government’s economic record before the 2027 election.',
        status: 'In execution to 2026',
        source: 'Commissione europea; MEF',
      },
    ],
  },
  {
    sectorTitle: 'Institutional & Constitutional Reform',
    description: 'Three flagship reforms — direct election of the PM, regional autonomy, judicial careers — all stalled or defeated.',
    policies: [
      {
        name: 'Premierato — direct election of the PM',
        whatChanged:
          'The constitutional bill for a directly elected prime minister passed the Senate on 18 June 2024, then stalled.',
        details:
          'Billed by Meloni as "the mother of all reforms", the premierato would have voters elect the prime minister directly and guarantee a governing majority. It cleared the Senate in first reading but has sat in the Chamber’s Constitutional Affairs Committee since July 2024, with no clear path through the further readings and likely confirmatory referendum.',
        status: 'Stalled in the Chamber',
        source: 'DDL cost. A.S. 935; Senato, 18 June 2024',
      },
      {
        name: 'Autonomia differenziata struck down',
        whatChanged:
          'The Constitutional Court gutted the 2024 differentiated-autonomy law (ruling 192/2024).',
        details:
          'Law 86/2024, championed by the Lega, would have devolved wide powers to individual regions. In November 2024 the Constitutional Court declared several core provisions unconstitutional, and in January 2025 admitted little of the abrogative referendum against it — leaving the reform hollowed out and its future uncertain.',
        status: 'Largely unconstitutional',
        source: 'Corte costituzionale, sent. 192/2024; L. 86/2024',
      },
      {
        name: 'Judicial-careers reform rejected',
        whatChanged:
          'Voters rejected the separation of judges’ and prosecutors’ careers in the 22–23 March 2026 referendum (No 53.2%).',
        details:
          'Parliament had approved the constitutional change without the two-thirds majority that avoids a referendum, so a confirmatory vote was required. With record referendum turnout near 59%, No won 53.2%, blocking the split of the CSM into two councils and a separate disciplinary court. Meloni said she respected the result; the opposition read it as evidence of an "alternative majority".',
        status: 'Rejected by referendum',
        source: 'Referendum costituzionale 22–23 marzo 2026',
      },
    ],
  },
  {
    sectorTitle: 'Justice & Security',
    description: 'A tougher public-order code and a landmark defeat on the courts.',
    policies: [
      {
        name: 'Security decree (DL sicurezza)',
        whatChanged:
          'A 2025 security decree created new offences and stiffer penalties around protests, occupations and public order.',
        details:
          'The package added or toughened crimes covering road-blocking protests, occupations of buildings, resistance inside prisons and migrant detention centres, and revolts in penal institutions. Rights groups and parts of the judiciary warned it criminalised dissent and marginalised groups; the government framed it as restoring authority and protecting the police.',
        status: 'In force',
        source: 'DL sicurezza 2025, converted into law',
      },
      {
        name: 'Separation of careers — the reform and its defeat',
        whatChanged:
          'The government’s central justice reform was blocked at the ballot box in March 2026.',
        details:
          'Long sought by the centre-right, the reform would have separated the career tracks of judges and prosecutors, split the self-governing council (CSM) in two and created an autonomous High Disciplinary Court. Magistrates’ associations campaigned hard against it. The 53.2% No vote leaves the unified magistracy and single CSM in place.',
        status: 'Blocked',
        source: 'Referendum 22–23 marzo 2026; CSM',
      },
    ],
  },
  {
    sectorTitle: 'Society & Rights',
    description: 'A conservative family agenda — a global surrogacy ban and citizenship tightened at both ends.',
    policies: [
      {
        name: 'Surrogacy made a "universal crime"',
        whatChanged:
          'A law in force from November 2024 lets Italy prosecute citizens who use surrogacy abroad, even where it is legal.',
        details:
          'The measure amended Article 12(6) of Law 40/2004, extending Italy’s existing surrogacy ban to acts committed abroad by Italian nationals, with prison terms of three months to two years and fines of €600,000–€1 million. Critics call it symbolic and warn it can leave children born abroad in legal limbo; the government presents it as a stand against the commodification of women and a push for an international ban.',
        status: 'In force',
        source: 'Legge 169/2024 (reato universale)',
      },
      {
        name: 'Citizenship tightened by descent and by residence',
        whatChanged:
          'Law 74/2025 curbed jure sanguinis to two generations; a June 2025 referendum to ease naturalisation failed on turnout.',
        details:
          'The 2025 reform (in force 24 May 2025) ended indefinite citizenship by descent, requiring an Italian parent or grandparent and a "genuine link", after a surge in claims from Brazil and Argentina. Separately, the 8–9 June 2025 referendum to cut the naturalisation residence requirement from ten to five years drew only 30.6% turnout — below the 50% quorum — so the ten-year rule, among the EU’s strictest, stands.',
        status: 'Descent curbed; residence unchanged',
        source: 'Legge 74/2025; referendum 8–9 giugno 2025',
      },
    ],
  },
  {
    sectorTitle: 'Defence & Foreign Policy',
    description: 'Reaching NATO’s 2% on paper, steady support for Ukraine, and a new 5% horizon.',
    policies: [
      {
        name: 'Defence spending hits 2% of GDP',
        whatChanged:
          'Italy reported defence spending of ~2.01% of GDP (~€45bn) to NATO for 2025, up from ~1.5% in 2024.',
        details:
          'Rome reached the long-missed 2% target partly by reclassifying outlays — pensions and parts of the Carabinieri — as defence; analysts put "core" military spending closer to €31 billion. At the 2025 Hague summit NATO adopted a new headline goal of 5% of GDP by 2035, sharply raising the pressure on a high-debt Italy.',
        status: '2% reached (reclassified)',
        source: 'NATO; Difesa, DPP 2025; Defense News',
      },
      {
        name: 'Support for Ukraine',
        whatChanged:
          'Italy has maintained military and financial support for Ukraine across successive aid packages since 2022.',
        details:
          'The Meloni government kept Italy firmly in the Atlanticist camp, sending air-defence systems (including SAMP/T) and other materiel and backing EU sanctions, despite periodic scepticism from parts of the League and public opinion. Foreign policy under Meloni has been notably more pro-NATO and pro-Ukraine than her coalition partners’ past positions suggested.',
        status: 'Ongoing',
        source: 'Ministero della Difesa; Kiel Institute Ukraine Support Tracker',
      },
    ],
  },
];
