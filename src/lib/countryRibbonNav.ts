import { getStatSections, treatAsGermany } from './countryDashboardSections';

export type RibbonSubItem = {
  id: string;
  label: string;
  anchorId: string;
};

export type RibbonMainItem = {
  id: string;
  label: string;
  anchorId: string;
  subsections: RibbonSubItem[];
};

/** Gallery countries that are not included in Global Firepower's 2026 review. */
const GFP_UNRANKED_ISO3 = new Set(['CYP', 'LIE', 'MLT', 'MCO']);

/** Stable subsection anchors aligned with CountryStatsDashboard + GermanyGovernmentSection. */
export function buildCountryRibbonNav(iso3: string): RibbonMainItem[] {
  const germanyLike = treatAsGermany(iso3);
  const statSections = getStatSections(iso3);

  const fromStats: RibbonMainItem[] = statSections.map((section) => ({
    id: section.id,
    label: section.title,
    anchorId: `country-section-${section.id}`,
    subsections: (section.subsections ?? []).map((sub) => ({
      id: sub.id,
      label: sub.title,
      anchorId: `country-sub-${section.id}-${sub.id}`,
    })),
  }));

  const crime: RibbonMainItem = {
    id: 'crime',
    label: 'Crime',
    anchorId: 'country-section-crime',
    subsections: [
      {
        id: 'crime_statistics',
        label: 'Statistics',
        anchorId: 'country-sub-crime-statistics',
      },
      ...(germanyLike
        ? [
            {
              id: 'crime_victims',
              label: 'Victims',
              anchorId: 'country-sub-crime-victims',
            } satisfies RibbonSubItem,
            {
              id: 'crime_migrant',
              label: 'Migrant data',
              anchorId: 'country-sub-crime-migrant',
            } satisfies RibbonSubItem,
          ]
        : []),
    ],
  };

  const military: RibbonMainItem = {
    id: 'military',
    label: 'Military',
    anchorId: 'country-section-military',
    subsections: GFP_UNRANKED_ISO3.has(iso3.toUpperCase())
      ? []
      : [
          { id: 'army', label: 'Army', anchorId: 'country-sub-military-army' },
          { id: 'navy', label: 'Navy', anchorId: 'country-sub-military-navy' },
          { id: 'airforce', label: 'Air Force', anchorId: 'country-sub-military-airforce' },
          ...(germanyLike
            ? [
                {
                  id: 'cyberspace',
                  label: 'Cyberspace',
                  anchorId: 'country-sub-military-cyberspace',
                } satisfies RibbonSubItem,
              ]
            : []),
        ],
  };

  if (germanyLike) {
    const government: RibbonMainItem = {
      id: 'government',
      label: 'Government',
      anchorId: 'country-section-government',
      subsections: [
        { id: 'parliament', label: 'Parliament', anchorId: 'country-sub-government-parliament' },
        { id: 'policies', label: 'Policies', anchorId: 'country-sub-government-policies' },
        { id: 'citizenship', label: 'Citizenship', anchorId: 'country-sub-government-citizenship' },
      ],
    };
    return [...fromStats, crime, government, military];
  }

  return [...fromStats, crime, military];
}
