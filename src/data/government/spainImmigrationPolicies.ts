import type { ImmigrationPolicyArea, ImmigrationPolicyContext } from './immigrationPolicies';

export const SPAIN_IMMIGRATION_POLICY_CONTEXT: ImmigrationPolicyContext = {
  headline: 'Spain — immigration policy overview',
  period: 'August 2026',
  government: 'PM Pedro Sánchez · PSOE–Sumar coalition · Inclusion Minister Elma Saiz',
  summary:
    'Spain combines broader regular migration routes with EU-pact border and asylum implementation. Royal Decree 1155/2024 shortened most arraigo residence thresholds to two years and expanded work, study, and family pathways. A separate 2026 extraordinary process then registered 1,174,978 applications from people already resident in Spain; applications closed on 30 June and processing continues.',
};

export const SPAIN_IMMIGRATION_POLICY_AREAS: readonly ImmigrationPolicyArea[] = [
  {
    id: 'regularisation-2026',
    title: 'Extraordinary regularisation',
    current:
      'The 16 April–30 June 2026 application window closed with 1,174,978 applications; 609,737 had been processed by 2 July.',
    details:
      'Eligibility covered qualifying irregular residents and people who had sought international protection before 1 January 2026. Applicants needed five months of continuous presence, no criminal record, and no public-order, security, or public-health threat.',
    impact: 'Successful applicants receive a one-year residence and work permit and then move into ordinary routes.',
    source: 'Royal Decree 316/2026; Ministerio de Inclusión, 2 July 2026.',
  },
  {
    id: 'arraigo',
    title: 'Arraigo pathways',
    current: 'Five routes: social, socio-labour, family, socio-training, and second chance.',
    details:
      'The normal continuous-presence requirement fell from three years to two. The second-chance route covers people who held a residence authorisation during the previous two years but could not renew it; the routes generally authorise work from the outset.',
    impact: 'A broader, faster route from irregularity into lawful residence and employment.',
    source: 'Royal Decree 1155/2024; Ministerio de Inclusión.',
  },
  {
    id: 'work',
    title: 'Work permits & renewals',
    current: 'Most initial authorisations last one year and renewals last four years, with work rights made more flexible.',
    details:
      'The regulation reduces duplication between residence and work procedures, strengthens protection against labour exploitation, and lets more permit holders work both as employees and on a self-employed basis.',
    impact: 'Fewer repeat procedures and greater employment continuity.',
    source: 'Royal Decree 1155/2024, Foreign Nationals Regulation.',
  },
  {
    id: 'job-search',
    title: 'Job-search visas',
    current: 'The job-search visa lasts up to twelve months, replacing the previous three-month window.',
    details:
      'Searches can be targeted to occupations and territories identified by the labour market. Graduates of Spanish institutions also retain routes to seek work or start a business after study.',
    impact: 'More time to match foreign workers and graduates with employers.',
    source: 'Ministerio de Inclusión — regulation briefing, 19 November 2024.',
  },
  {
    id: 'students',
    title: 'Students & training',
    current: 'Study authorisations track the full programme and more clearly connect education with employment.',
    details:
      'The rules streamline the move from study to work, clarify part-time work compatibility, and use the socio-training arraigo route to link qualifying training with regular status.',
    impact: 'A more direct education-to-employment pathway.',
    source: 'Royal Decree 1155/2024; Ministerio de Inclusión.',
  },
  {
    id: 'family',
    title: 'Family reunification',
    current: 'Family definitions and residence routes were expanded, including a distinct permit for relatives of Spanish citizens.',
    details:
      'The framework raises the age covered for children in the Spanish-family route, recognises additional dependent relatives in defined circumstances, and aims to reduce overlapping procedures.',
    impact: 'Broader family unity with a clearer standalone route.',
    source: 'Royal Decree 1155/2024, family residence provisions.',
  },
  {
    id: 'asylum',
    title: 'Asylum & international protection',
    current: 'Spain is applying the EU Migration and Asylum Pact from June 2026 while retaining national protection procedures.',
    details:
      'The national implementation plan covers screening, border procedures, responsibility rules, reception, information systems, and solidarity arrangements. Recognised refugees and subsidiary-protection beneficiaries receive permanent residence and work rights under Spain’s framework.',
    impact: 'More EU-standardised processing and stronger operational demands at the border.',
    source: 'Ministerio del Interior — Spain National Implementation Plan; Asilo y Refugio portal.',
  },
  {
    id: 'unaccompanied-minors',
    title: 'Unaccompanied minors',
    current: 'Protection remains an autonomous-community responsibility coordinated with the state.',
    details:
      'Age assessment, guardianship, documentation, and transfers between territories remain politically contested, especially where arrivals place concentrated pressure on the Canary Islands, Ceuta, and Melilla.',
    impact: 'Uneven reception capacity and recurring state–regional disputes.',
    source: 'Organic Law 4/2000; child-protection law; sectoral conference agreements.',
  },
  {
    id: 'citizenship',
    title: 'Citizenship & naturalisation',
    current: 'The general residence requirement remains ten years, with shorter periods for specified nationalities and protected groups.',
    details:
      'Two years generally applies to nationals of Ibero-American countries, Andorra, the Philippines, Equatorial Guinea, Portugal, and people of Sephardic origin; refugees generally qualify after five years. Language and constitutional/cultural knowledge tests apply subject to exemptions.',
    impact: 'Long general route but substantially faster access for historically linked countries.',
    source: 'Spanish Civil Code arts. 21–23; Ministerio de Justicia.',
  },
  {
    id: 'integration',
    title: 'Integration & local access',
    current: 'The municipal register remains central to proving residence and accessing local public services.',
    details:
      'Registration on the padrón supports access to schooling and regional healthcare and provides dated evidence often used in arraigo cases. The 2026 regularisation is the first measure under the Integration and Intercultural Coexistence Plan.',
    impact: 'Local registration links day-to-day inclusion with later residence claims.',
    source: 'Organic Law 4/2000; Royal Decree 316/2026; Ministerio de Inclusión.',
  },
];

/** Context card plus the ten policy-area cards. */
export const SPAIN_IMMIGRATION_POLICIES_SUBSECTION_COUNT = SPAIN_IMMIGRATION_POLICY_AREAS.length + 1;
