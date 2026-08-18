import type { PolicyInfographic } from './policyCards';

/**
 * Spain — current government policy agenda by sector.
 *
 * Each measure is tied to a published act or an official government programme;
 * the generated CSV's modeled policy-change counts are not used in the carousel.
 */
export const SPAIN_POLICY_INFOGRAPHICS: PolicyInfographic[] = [
  {
    sectorTitle: 'Housing & Affordability',
    description: 'A larger permanent public-housing system, rent protection, and a five-year investment plan.',
    policies: [
      {
        name: 'State Housing Plan 2026–2030',
        whatChanged:
          'The government approved a five-year plan mobilising €7 billion, with central government providing 60% and autonomous communities 40%.',
        details:
          'At least 40% is reserved for construction and acquisition, 30% for rehabilitation, and 30% for vulnerable households and territories. Housing supported by the plan must remain permanently protected rather than later returning to the speculative market.',
        status: 'Approved April 2026',
        source: 'Council of Ministers — State Housing Plan 2026–2030',
      },
      {
        name: 'CASA47 state housing entity',
        whatChanged:
          'SEPES became CASA47, a national entity responsible for land, construction, allocation, and management of affordable homes.',
        details:
          'The programme sets out €13 billion of investment over ten years, aims to build a permanently protected public stock, and caps rents in its homes at 30% of average local income.',
        status: 'Operating since 2026',
        source: 'Ministerio de Vivienda — CASA47',
      },
      {
        name: 'Housing Act pressure-area controls',
        whatChanged:
          'Autonomous communities can designate stressed housing markets and apply rent-limitation and tenant-protection measures under the State Housing Act.',
        details:
          'Implementation is territorial rather than automatic nationwide. By the end of 2025, the government reported 304 municipalities with designated high-pressure areas, while several autonomous communities continued to reject the mechanism.',
        status: 'In force; regionally applied',
        source: 'Ley 12/2023 por el derecho a la vivienda; Government Accountability Report 2025',
      },
    ],
  },
  {
    sectorTitle: 'Work, Pay & Growth',
    description: 'Higher wage floors and continued investment-led modernisation of the economy.',
    policies: [
      {
        name: '2026 minimum-wage increase',
        whatChanged: 'The minimum wage rose 3.1% to €1,221 per month in 14 payments, or €17,094 annually.',
        details:
          'The measure applies retroactively from 1 January 2026, is exempt from personal income tax at that level, and is expected by the government to benefit about 2.5 million workers. The cumulative increase since 2018 is 66%.',
        status: 'In force',
        source: 'Royal Decree 126/2026; Ministerio de Trabajo',
      },
      {
        name: 'Recovery and Resilience Plan delivery',
        whatChanged:
          'Spain continued deploying EU recovery funds through digitalisation, clean-energy, industrial, housing, and labour-market reforms.',
        details:
          'The programme combines public investment with milestones covering vocational training, business digitalisation, renewable energy, sustainable mobility, housing rehabilitation, and public-administration reform.',
        status: 'Implementation through 2026',
        source: 'European Commission — Spain Recovery and Resilience Plan',
      },
      {
        name: 'Industrialisation of housing',
        whatChanged:
          'A strategic recovery project was established to scale modular and industrial construction and reduce delivery times for new housing.',
        details:
          'The programme links national financing, a construction-systems platform, and a Valencia innovation hub to improve productivity and expand affordable supply.',
        status: 'In implementation',
        source: 'Government of Spain Accountability Report, December 2025',
      },
    ],
  },
  {
    sectorTitle: 'Migration & Integration',
    description: 'Expanded regular pathways, shorter arraigo timelines, and a large one-off regularisation.',
    policies: [
      {
        name: 'New Foreign Nationals Regulation',
        whatChanged:
          'Royal Decree 1155/2024 recast residence and work routes around employment, training, and family links from 20 May 2025.',
        details:
          'It created five arraigo routes, reduced the usual residence threshold from three years to two, introduced a second-chance route, extended job-search visas from three months to one year, and generally paired one-year initial permits with four-year renewals.',
        status: 'In force',
        source: 'Royal Decree 1155/2024; Ministerio de Inclusión',
      },
      {
        name: 'Extraordinary regularisation of 2026',
        whatChanged:
          'A time-limited route offered one-year residence and work permission to qualifying people already in Spain before 1 January 2026.',
        details:
          'Applicants needed at least five months of continuous presence and no criminal record. The window ran from 16 April to 30 June 2026; 1,174,978 applications were registered, with minor children eligible for five-year permits.',
        status: 'Applications closed; processing',
        source: 'Royal Decree 316/2026; Ministerio de Inclusión, 2 July 2026',
      },
      {
        name: 'EU Migration and Asylum Pact implementation',
        whatChanged:
          'Spain prepared new screening, asylum-procedure, reception, and solidarity systems for the EU pact’s application from June 2026.',
        details:
          'The national plan requires changes to border screening, responsibility allocation, reception capacity, information systems, and asylum legislation while preserving Spain’s international-protection framework.',
        status: 'Implementation under way',
        source: 'Ministerio del Interior — Spain National Implementation Plan',
      },
    ],
  },
  {
    sectorTitle: 'Climate & Energy',
    description: 'A socially buffered energy transition focused on resilience, renewables, and lower fossil-fuel exposure.',
    policies: [
      {
        name: '€9.099bn Social Climate Plan',
        whatChanged:
          'A 2026–2032 draft plan directs EU and national funding toward vulnerable households and micro-businesses.',
        details:
          'Investment focuses on efficient buildings and cleaner road transport, complementing the energy-poverty strategy, State Housing Plan, sustainable-mobility law, and Spain’s national energy and climate plan.',
        status: 'Draft submitted for consultation',
        source: 'MITECO — Plan Social para el Clima, May 2026',
      },
      {
        name: '2026 energy resilience package',
        whatChanged:
          'Emergency relief was paired with structural measures to reduce imported-fuel exposure and accelerate electrification and renewable deployment.',
        details:
          'Measures included vulnerable-consumer electricity discounts, a higher minimum thermal social bonus, utility-supply protection through 2026, support for energy-intensive industry, and tax incentives for solar panels, charging points, and heat pumps.',
        status: 'In force and extended',
        source: 'Council of Ministers, 20 March and 29 June 2026',
      },
    ],
  },
  {
    sectorTitle: 'Institutions & Foreign Policy',
    description: 'Contentious constitutional legislation, gender-parity rules, and a more distinctive external posture.',
    policies: [
      {
        name: 'Catalonia amnesty law',
        whatChanged:
          'Organic Law 1/2024 created an amnesty framework for acts linked to the Catalan independence process.',
        details:
          'The law sought institutional and political normalisation in Catalonia and triggered extensive judicial review. The Constitutional Court upheld its central architecture in 2025 while resolving challenges to particular provisions.',
        status: 'In force; judicial application ongoing',
        source: 'Organic Law 1/2024; Constitutional Court STC 137/2025',
      },
      {
        name: 'Parity Representation Law',
        whatChanged:
          'Organic Law 2/2024 established balanced representation requirements across electoral lists and major public and corporate bodies.',
        details:
          'The act extends the 40/60 balance principle to government composition, electoral candidacies, constitutional bodies, listed companies, and other decision-making institutions, with phased application.',
        status: 'In force',
        source: 'Organic Law 2/2024 on parity representation',
      },
      {
        name: 'Recognition of the State of Palestine',
        whatChanged: 'Spain formally recognised the State of Palestine on 28 May 2024.',
        details:
          'The government framed recognition as support for a viable two-state solution based on international law, alongside rejection of Hamas and continued recognition of Israel’s security.',
        status: 'Implemented',
        source: 'Council of Ministers, 28 May 2024',
      },
      {
        name: 'Security and Defence Industrial Plan',
        whatChanged:
          'The government approved an additional €10.47 billion for defence capabilities and industrial and technological capacity.',
        details:
          'The package supports equipment, dual-use technology, cyber capabilities, personnel, and domestic defence production as Spain moves toward its NATO spending commitments.',
        status: 'In implementation',
        source: 'Industrial and Technological Plan for Security and Defence, 2025',
      },
    ],
  },
];
