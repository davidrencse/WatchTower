/**
 * Source-of-truth copy for Government → Policies infographic cards.
 * Values / years / units align with the user-provided specification (not invented).
 */
export type GermanyPolicyInfographic = {
  /** Matches `metric` in germany_government_politics.csv (Policies subsection). */
  metricKey: string;
  value: string;
  year: string;
  unit: string;
  /** When true, show a visible “Proxy” badge per UI rules. */
  showProxyBadge: boolean;
  lawOrMeasure: string;
  whatChanged: string;
  details: string;
};

export const GERMANY_POLICY_INFOGRAPHICS: GermanyPolicyInfographic[] = [
  {
    metricKey: 'immigration law changes',
    showProxyBadge: false,
    value: '1',
    year: '2025',
    unit: 'major federal law/package',
    lawOrMeasure:
      'Gesetz zur Bestimmung sicherer Herkunftsstaaten durch Rechtsverordnung und Abschaffung des anwaltlichen Vertreters bei Abschiebungshaft und Ausreisegewahrsam',
    whatChanged:
      'Germany created a framework to designate safe countries of origin by regulation instead of requiring a full formal law each time, and removed the mandatory appointment of a lawyer in deportation detention and departure custody cases.',
    details:
      'The stated purpose was to speed up procedures and make returns more effective. The safe-country-origin rule starts in February 2026. The lawyer-related change starts in July 2026.',
  },
  {
    metricKey: 'asylum law changes',
    showProxyBadge: true,
    value: '1',
    year: '2025',
    unit: 'major federal law/package',
    lawOrMeasure: 'Same migration package as above, plus broader GEAS implementation context',
    whatChanged:
      'The counted asylum-policy change reflects the same federal migration package because it affects asylum processing, especially faster handling for applicants from safe countries of origin.',
    details:
      'This card is a compressed category count, not a standalone named asylum law. It also sits within the broader implementation of the EU asylum reform framework intended to create faster and more uniform asylum procedures.',
  },
  {
    metricKey: 'citizenship law changes',
    showProxyBadge: false,
    value: '1',
    year: '2025',
    unit: 'major federal law',
    lawOrMeasure: 'Sixth Act Amending Citizenship Law',
    whatChanged: 'Germany removed the 3-year fast-track naturalization route known as “Turboeinbürgerung.”',
    details:
      'Naturalization is again possible at the earliest after 5 years, subject to the usual requirements such as language and self-sufficiency. Effective date: 30 October 2025.',
  },
  {
    metricKey: 'criminal justice reforms',
    showProxyBadge: true,
    value: '0',
    year: '2025',
    unit: 'major federal reforms',
    lawOrMeasure: 'Proxy / classification',
    whatChanged: 'No major federal criminal-justice reform law was identified in the source set used for this card.',
    details:
      'Justice-related legal changes may still have occurred, but none were classified here as a major federal criminal-justice reform.',
  },
  {
    metricKey: 'education reforms',
    showProxyBadge: true,
    value: '0',
    year: '2025',
    unit: 'major federal reforms',
    lawOrMeasure: 'Proxy / classification',
    whatChanged: 'No major new federal education-law reform was identified in the source set used for this card.',
    details:
      'Education policy in Germany is often driven at the Länder level, so a federal zero does not mean no education policy changed anywhere.',
  },
  {
    metricKey: 'family policy reforms',
    showProxyBadge: false,
    value: '1',
    year: '2026',
    unit: 'major federal reform',
    lawOrMeasure:
      'Gesetz zur Neuregelung der Vormünder- und Betreuervergütung und zur Entlastung von Betreuungsgerichten und Betreuern …',
    whatChanged: 'The reform raised compensation for guardians, legal carers, and related family-law / care actors.',
    details:
      'This card reflects a counted family-law-adjacent federal reform package. It is separate from other family-related changes such as the Kindergeld increase.',
  },
  {
    metricKey: 'free speech / assembly restrictions',
    showProxyBadge: true,
    value: '0',
    year: '2025',
    unit: 'new federal legal restrictions',
    lawOrMeasure: 'Proxy / classification',
    whatChanged:
      'No new federal statutory restriction on free speech or freedom of assembly was identified in the official source set used for this card.',
    details:
      'This should be displayed clearly as a zero-result classification, not as a hidden law.',
  },
  {
    metricKey: 'constitutional court rulings',
    showProxyBadge: true,
    value: '1',
    year: '2025',
    unit: 'major ruling count',
    lawOrMeasure: 'Proxy / classification based on major politically salient constitutional rulings',
    whatChanged:
      'This is not a precise official total. It indicates that at least one major politically relevant constitutional court ruling occurred in the period.',
    details:
      'Treat this as a minimum tracked count, not a complete exhaustive number. The card should visually signal that it is a proxy metric.',
  },
  {
    metricKey: 'emergency powers usage',
    showProxyBadge: false,
    value: '0',
    year: '2025',
    unit: 'federal constitutional emergency declarations',
    lawOrMeasure: 'Article 115a Basic Law framework',
    whatChanged: 'No federal constitutional emergency / defence state was declared in the tracked period.',
    details: 'This is a valid zero and should be presented as “no emergency declaration recorded.”',
  },
];
