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
    return [...fromStats, crime, government];
  }

  return [...fromStats, crime];
}
