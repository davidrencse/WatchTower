export type GermanyPolicyItem = {
  name: string;
  whatChanged: string;
  details: string;
  status: string;
  source: string;
};

export type GermanyPolicyInfographic = {
  sectorTitle: string;
  description: string;
  policies: GermanyPolicyItem[];
};

export const GERMANY_POLICY_INFOGRAPHICS: GermanyPolicyInfographic[] = [
  {
    sectorTitle: 'Economy & Growth',
    description: 'Industrial competitiveness, tax relief, and investment package agenda.',
    policies: [
      {
        name: '30% Super-Depreciation for Big Corporations',
        whatChanged:
          'Temporary 30% immediate tax write-off for new investments in machinery and digital infrastructure.',
        details:
          'This policy allows large companies to immediately deduct 30% of investment costs in the first year. Critics from the left call it a shameless giveaway to corporations while working Germans struggle with high taxes and inflation. Many see it as proof that the government prioritizes big business over ordinary citizens.',
        status: 'Planned for 2026',
        source: 'BMWK Growth Package 2026',
      },
      {
        name: 'Electricity Tax Cuts for Industry',
        whatChanged: 'Electricity tax reduced from 2.05 to 0.5 cents/kWh and grid fees lowered for industrial users.',
        details:
          'The measure significantly lowers energy costs for large energy-intensive companies. It is widely attacked as corporate welfare that subsidizes polluting industries while normal households continue paying some of the highest energy bills in Europe.',
        status: 'In Progress',
        source: 'BMWK Energy Relief Package 2025-2026',
      },
      {
        name: 'Bureaucracy Reduction Programme ("Bureaucracy Brake")',
        whatChanged:
          'New law requiring every new regulation to be offset by removing at least two existing ones.',
        details:
          'The government claims this will cut red tape. Opponents accuse it of dismantling worker protections and environmental safeguards to please big business, calling it a dangerous attack on social and ecological standards.',
        status: 'Implemented',
        source: 'Entbuerokratisierungspaket 2025',
      },
      {
        name: 'EUR 500 Billion Infrastructure & Climate Fund',
        whatChanged: 'Creation of a massive EUR 500 billion special fund largely exempt from the debt brake.',
        details:
          'This fund finances infrastructure and green projects. Critics from the right call it reckless debt that burdens future generations, while the left says it mostly benefits corporations and green lobbyists instead of ordinary people.',
        status: 'Implemented',
        source: 'Federal Budget 2026',
      },
      {
        name: 'Corporate Tax Competitiveness Reform',
        whatChanged: 'Planned reduction of the effective corporate tax rate toward 25% by 2028.',
        details:
          'The reform aims to make Germany more attractive for international companies. It is heavily criticized as yet another tax cut for the rich and corporations while the middle class and small businesses get nothing.',
        status: 'Planned 2026-2028',
        source: 'BMWK Competitiveness Agenda 2025',
      },
    ],
  },
  {
    sectorTitle: 'Defence & Security',
    description: 'Rearmament, procurement acceleration, and military-force expansion measures.',
    policies: [
      {
        name: 'Defence Spending Explosion',
        whatChanged: 'Defence budget raised to EUR 52-55 billion in 2026, exceeding 2% of GDP.',
        details:
          'Germany is dramatically increasing military spending. The left calls it warmongering and a betrayal of Germany’s pacifist tradition, while many citizens are angry their taxes are going to the military instead of schools and pensions.',
        status: 'Implemented',
        source: 'Federal Budget 2026',
      },
      {
        name: 'EUR 11.5 Billion Military Aid to Ukraine',
        whatChanged: 'Record EUR 11.5 billion military aid package to Ukraine approved for 2026.',
        details:
          'This makes Germany one of the largest military donors. Critics accuse the government of dragging Germany into a foreign war and wasting billions that should be spent on German citizens.',
        status: 'Implemented',
        source: 'Federal Government Ukraine Support Tracker, February 2026',
      },
      {
        name: 'Military Travel Approval for Men (17-45)',
        whatChanged:
          'Men aged 17-45 now require official Bundeswehr approval to leave Germany for longer than 3 months.',
        details:
          'This controversial rule, introduced in January 2026, has sparked massive outrage. Many call it authoritarian and a return to conscription-style control over citizens’ freedom of movement.',
        status: 'Implemented (with heavy backlash)',
        source: 'Defence Ministry, January 2026',
      },
      {
        name: 'Bundeswehr Modernization & Fast-Track Procurement',
        whatChanged: 'New law allowing fast-track military purchases without normal oversight.',
        details:
          'Critics say this gives the arms industry a blank cheque and weakens democratic control over military spending.',
        status: 'In Progress',
        source: 'Defence Ministry Modernization Plan 2025-2026',
      },
      {
        name: 'Expansion of Voluntary Military Service',
        whatChanged: 'Voluntary military service expanded with better pay and incentives.',
        details:
          'Opponents fear this is the first step toward reintroducing mandatory conscription and militarizing German society.',
        status: 'In Progress',
        source: 'Defence Ministry Press Releases 2025-2026',
      },
    ],
  },
  {
    sectorTitle: 'Foreign Policy',
    description: 'Alignment posture, sanctions strategy, and external support commitments.',
    policies: [
      {
        name: 'Unwavering Support for Ukraine',
        whatChanged: 'Continued high military and financial support for Ukraine.',
        details:
          'Many Germans are furious that billions are being sent abroad while domestic problems like housing and pensions are ignored.',
        status: 'Ongoing',
        source: 'Federal Government Ukraine Support Update, Feb 2026',
      },
      {
        name: 'Strong Pro-Israel Stance',
        whatChanged: 'Continued strong diplomatic and military support for Israel.',
        details:
          'This position has caused deep division, with the left accusing the government of ignoring Palestinian suffering and being biased.',
        status: 'Ongoing',
        source: 'Foreign Office Statements 2025-2026',
      },
      {
        name: 'EU Competitiveness Pact',
        whatChanged: 'Germany pushing for an EU-wide deregulation and competitiveness pact.',
        details:
          'Left-wing critics call it a neoliberal attack on workers’ rights and environmental protections.',
        status: 'Proposed',
        source: 'Coalition Agreement 2025',
      },
      {
        name: 'Transatlantic Relations Strengthening',
        whatChanged: 'Renewed close alignment with the United States.',
        details:
          'Accused by some of making Germany a vassal to American foreign policy interests.',
        status: 'In Progress',
        source: 'Chancellor Merz Statements 2025-2026',
      },
      {
        name: 'Harsh Sanctions on Russia & Iran',
        whatChanged: 'Maintained and tightened sanctions against Russia and Iran.',
        details:
          'Widely blamed for driving up energy prices and harming German workers and industry.',
        status: 'Ongoing',
        source: 'Foreign Office Sanctions Report 2025-2026',
      },
    ],
  },
  {
    sectorTitle: 'Migration & Integration',
    description: 'Citizenship, border control, removals, and integration-rule tightening.',
    policies: [
      {
        name: 'Abolition of Turbo Naturalization',
        whatChanged: 'Removed the 3-year fast-track citizenship route.',
        details:
          'Naturalization now requires at least 5 years. The left calls this racist and anti-immigrant, while the right celebrates it as long-overdue common sense.',
        status: 'Implemented',
        source: 'Sixth Act Amending Citizenship Law, October 2025',
      },
      {
        name: 'Stricter Asylum & Border Controls',
        whatChanged: 'Reintroduced systematic border checks and faster asylum rejections.',
        details:
          'Strongly condemned by NGOs and the left as cruel and inhumane.',
        status: 'In Progress',
        source: 'Federal Ministry of the Interior, 2025-2026',
      },
      {
        name: 'Mass Deportations Resumed',
        whatChanged: 'Large-scale deportations to Syria and Afghanistan restarted.',
        details:
          'Hailed by the right but labeled "deportation terror" by the left and migrant organizations.',
        status: 'Implemented',
        source: 'BAMF & Interior Ministry Reports 2026',
      },
      {
        name: 'Tightened Family Reunification',
        whatChanged: 'Family reunification for subsidiary protection heavily restricted.',
        details:
          'Accused of breaking up families and violating basic human rights.',
        status: 'Implemented',
        source: 'Immigration Law Amendments 2025',
      },
      {
        name: 'Harsher Integration Requirements',
        whatChanged: 'B2 language level and proof of self-sufficiency made mandatory.',
        details:
          'Critics say this discriminates against refugees and makes integration nearly impossible for many.',
        status: 'Implemented',
        source: 'Coalition Agreement 2025',
      },
    ],
  },
  {
    sectorTitle: 'Social Policy & Welfare',
    description: 'Welfare sanctions, pensions, care financing, and social-benefit targeting.',
    policies: [
      {
        name: 'Buergergeld Crackdown',
        whatChanged: 'Harsher sanctions for refusing reasonable job offers.',
        details:
          'The left calls this a heartless attack on the poor and vulnerable.',
        status: 'In Progress',
        source: 'Federal Ministry of Labour, 2025-2026',
      },
      {
        name: 'Pension Cuts & Retirement Age Increase',
        whatChanged: 'Gradual increase in retirement age and adjustments to pension formula.',
        details:
          'Many older Germans see this as a betrayal after paying into the system their entire lives.',
        status: 'Proposed',
        source: 'Coalition Agreement 2025',
      },
      {
        name: 'Long-Term Care (Pflege) Reform',
        whatChanged: 'New package with higher contributions and cost controls.',
        details:
          'Accused of making elderly care more expensive for ordinary families.',
        status: 'In Progress',
        source: 'Health Ministry Pflege Reform 2025-2026',
      },
      {
        name: 'Healthcare Austerity Measures',
        whatChanged: 'New cost-control measures on hospitals and drugs.',
        details:
          'Critics warn this will lead to worse healthcare and longer waiting times for patients.',
        status: 'Proposed',
        source: 'Federal Health Ministry 2025-2026',
      },
      {
        name: 'Family Benefits Tightening',
        whatChanged: 'Benefits increased for working families but cut for non-working households.',
        details:
          'Labeled as punishing the poor and single parents by the left.',
        status: 'In Progress',
        source: 'Family Ministry Announcements 2025-2026',
      },
    ],
  },
];
