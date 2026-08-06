import { GermanyImmigrationSection } from '../germany/GermanyImmigrationSection';
import { parseGermanyTreemapCsv } from '../../../lib/countries/germany/germanyImmigrationTreemapData';
import franceImmigrationTreemapCsvRaw from '../../../../Assets/Data/countries/France/france_immigration_treemap_2024.csv?raw';
import {
  FRANCE_DEPORTATION_REENTRY_BY_YEAR,
  FRANCE_DEPORTATION_TREND_SERIES,
  FRANCE_MIGRANT_ARRIVALS_SERIES,
  FRANCE_MIGRATION_BACKGROUND_BY_YEAR,
} from '../../../lib/countries/france/franceImmigrationSeries';
import {
  FRANCE_ASYLUM_APPLICATIONS_2025,
  FRANCE_ASYLUM_BY_REGION,
  FRANCE_ASYLUM_SEEKERS_MEN,
  FRANCE_ASYLUM_SEEKERS_TOTAL,
  FRANCE_ASYLUM_SEEKERS_WOMEN,
  FRANCE_CONTRIBUTION_NOTES,
  FRANCE_CONTRIBUTION_ROWS,
  FRANCE_HEALTHCARE_SOCIAL_HOUSING_USAGE,
  FRANCE_LANGUAGE_INTEGRATION,
  FRANCE_LANGUAGE_INTEGRATION_DESC,
  FRANCE_PUBLIC_OPINION_IMMIGRATION,
  FRANCE_REFUGEE_BREAKDOWN,
  FRANCE_REFUGEE_ORIGINS_TITLE,
  FRANCE_WELFARE_DESC,
  FRANCE_WELFARE_NOTE,
  FRANCE_WELFARE_ROWS,
  FRANCE_WELFARE_TITLE,
} from '../../../lib/countries/france/franceImmigrationContent';
import {
  FRANCE_ADVOCATES,
  FRANCE_ADVOCATES_COALITION,
  FRANCE_ADVOCATES_HEADING,
  FRANCE_ADVOCATES_INTRO,
} from '../../../lib/countries/france/franceImmigrationAdvocates';

/** France immigrant-origin treemap (PopulationPyramid.net / UN DESA 2024), parsed once. */
const FRANCE_IMMIGRATION_TREEMAP_ITEMS = parseGermanyTreemapCsv(franceImmigrationTreemapCsvRaw);
const FRANCE_TREEMAP_NOTE =
  'Immigrant counts by country of birth (foreign-born stock, 2024). Source: PopulationPyramid.net France Immigration Statistics; underlying reference UN DESA International Migrant Stock 2024. Chart scales to the panel width so the full treemap is visible without horizontal scrolling.';

/**
 * France's immigration subsection. Living here rather than inline in the dashboard keeps
 * France's content modules — and the module-scope treemap CSV parse — out of the shared
 * dashboard chunk that every country downloads.
 */
export function FranceImmigrationSection() {
  return (
    <GermanyImmigrationSection
      countryLabel="France"
      refugeesValue={639324}
      refugeesNote="France, 31 Dec 2024 — valid humanitarian (protection) permits."
      workVisasValue={260000}
      workVisasNote="Economic residence permits issued 2021–2025 (~55.6k/yr, est.)."
      migrantBackgroundValue={15300000}
      migrantBackgroundNote="France, 2024 — 7.3M immigrants + 8.0M descendants of immigrants (INSEE)."
      migrationBackgroundByYear={FRANCE_MIGRATION_BACKGROUND_BY_YEAR}
      migrantArrivalsSeries={FRANCE_MIGRANT_ARRIVALS_SERIES}
      deportationTrendSeries={FRANCE_DEPORTATION_TREND_SERIES}
      deportationReentrySeries={FRANCE_DEPORTATION_REENTRY_BY_YEAR}
      treemapItems={FRANCE_IMMIGRATION_TREEMAP_ITEMS}
      treemapNote={FRANCE_TREEMAP_NOTE}
      healthcareHousingSeries={FRANCE_HEALTHCARE_SOCIAL_HOUSING_USAGE}
      publicOpinionSeries={FRANCE_PUBLIC_OPINION_IMMIGRATION}
      publicOpinionDesc="Share agreeing with key immigration statements in France, 2000-2025."
      languageIntegrationSeries={FRANCE_LANGUAGE_INTEGRATION}
      languageIntegrationDesc={FRANCE_LANGUAGE_INTEGRATION_DESC}
      contributionRows={FRANCE_CONTRIBUTION_ROWS}
      contributionNotes={FRANCE_CONTRIBUTION_NOTES}
      welfareTitle={FRANCE_WELFARE_TITLE}
      welfareDesc={FRANCE_WELFARE_DESC}
      welfareRows={FRANCE_WELFARE_ROWS}
      welfareNote={
        <p className="font-sans text-[11px] leading-relaxed text-neutral-500">{FRANCE_WELFARE_NOTE}</p>
      }
      refugeeOriginsTitle={FRANCE_REFUGEE_ORIGINS_TITLE}
      refugeeBreakdown={FRANCE_REFUGEE_BREAKDOWN}
      asylumByRegion={FRANCE_ASYLUM_BY_REGION}
      asylumSeekersTotal={FRANCE_ASYLUM_SEEKERS_TOTAL}
      asylumSeekersMen={FRANCE_ASYLUM_SEEKERS_MEN}
      asylumSeekersWomen={FRANCE_ASYLUM_SEEKERS_WOMEN}
      asylumApplications={FRANCE_ASYLUM_APPLICATIONS_2025}
      advocates={FRANCE_ADVOCATES}
      advocatesHeading={FRANCE_ADVOCATES_HEADING}
      advocatesIntro={FRANCE_ADVOCATES_INTRO}
      advocatesCoalition={FRANCE_ADVOCATES_COALITION}
    />
  );
}
