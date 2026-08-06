import { getStatSections, treatAsGermany } from './countryDashboardSections';
import { militaryProfileFor } from '../data/military';

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

/**
 * Stable subsection anchors aligned with CountryStatsDashboard + GermanyGovernmentSection.
 *
 * `militaryIso3` defaults to `iso3` and can be supplied explicitly for older callers. The
 * ribbon's Military subsections mirror the profile that is actually on screen.
 */
export function buildCountryRibbonNav(iso3: string, militaryIso3: string = iso3): RibbonMainItem[] {
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

  // Curated profiles (Germany, France…) name their own branches and panels, so
  // the ribbon mirrors the profile rather than assuming Army/Navy/Air Force.
  const militaryProfile = militaryProfileFor(militaryIso3);
  const militarySubsections: RibbonSubItem[] = militaryProfile
    ? [
        ...militaryProfile.branches.map((b) => ({
          id: b.id,
          label: b.title,
          anchorId: `country-sub-military-${b.id}`,
        })),
        ...militaryProfile.panels.map((p) => ({
          id: p.id,
          label: p.title,
          anchorId: `country-sub-military-${p.id}`,
        })),
      ]
    : GFP_UNRANKED_ISO3.has(militaryIso3.toUpperCase())
      ? []
      : [
          { id: 'army', label: 'Army', anchorId: 'country-sub-military-army' },
          { id: 'navy', label: 'Navy', anchorId: 'country-sub-military-navy' },
          { id: 'airforce', label: 'Air Force', anchorId: 'country-sub-military-airforce' },
        ];

  const military: RibbonMainItem = {
    id: 'military',
    label: 'Military',
    anchorId: 'country-section-military',
    subsections: militarySubsections,
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
