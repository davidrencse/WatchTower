import { GermanyImmigrationSection } from '../germany/GermanyImmigrationSection';
import { parseGermanyTreemapCsv } from '../../../lib/countries/germany/germanyImmigrationTreemapData';
import {
  SPAIN_ADVOCATES,
  SPAIN_ADVOCATES_COALITION,
  SPAIN_ADVOCATES_HEADING,
  SPAIN_ADVOCATES_INTRO,
} from '../../../lib/countries/spain/spainImmigrationAdvocates';
import {
  SPAIN_ASYLUM_APPLICATIONS_2025_SOURCE_URL,
  SPAIN_ASYLUM_APPLICATIONS_BY_ORIGIN_2025,
  SPAIN_ASYLUM_APPLICATIONS_BY_GENDER,
  SPAIN_ASYLUM_CUMULATIVE_SUMMARY,
  SPAIN_ASYLUM_STACK_KEYS,
  SPAIN_ASYLUM_TREND_CHART_CONFIG,
  SPAIN_CONTRIBUTION_NOTES,
  SPAIN_CONTRIBUTION_ROWS,
  SPAIN_DEPORTATION_REENTRY_SERIES,
  SPAIN_DEPORTATION_TREND_SERIES,
  SPAIN_FOREIGN_BORN_POPULATION_SERIES,
  SPAIN_HEALTHCARE_SOCIAL_HOUSING_USAGE,
  SPAIN_IMV_SOURCE_URL,
  SPAIN_IMV_WELFARE_ROWS,
  SPAIN_LANGUAGE_INTEGRATION_2025,
  SPAIN_MIGRANT_BACKGROUND_2025,
  SPAIN_MIGRANT_BACKGROUND_NOTE,
  SPAIN_MIGRANT_ARRIVALS_SERIES,
  SPAIN_PUBLIC_OPINION_IMMIGRATION_2025,
  SPAIN_WORK_RELATED_RESIDENCE_NOTE,
  SPAIN_WORK_RELATED_RESIDENCE_PERMITS,
} from '../../../lib/countries/spain/spainImmigrationSeries';
import {
  SPAIN_REFUGEE_BREAKDOWN_2025,
  SPAIN_REFUGEE_NOTE,
  SPAIN_REFUGEES_2025,
} from '../../../lib/countries/spain/spainRefugees';
import spainImmigrationTreemapCsvRaw from '../../../../Assets/Data/countries/Spain/generated/esp_immigration_treemap.csv?raw';

const SPAIN_IMMIGRATION_TREEMAP_ITEMS = parseGermanyTreemapCsv(spainImmigrationTreemapCsvRaw);

/** Spain's immigration subsection — keeps Spain's treemap CSV + parse out of the shared chunk. */
export function SpainImmigrationSection() {
  return (
    <GermanyImmigrationSection
      countryLabel="Spain"
      refugeesLabel="UNHCR refugee population"
      refugeesValue={SPAIN_REFUGEES_2025}
      refugeesNote={SPAIN_REFUGEE_NOTE}
      workVisasLabel="Work visas / work-related residence permits"
      workVisasValue={SPAIN_WORK_RELATED_RESIDENCE_PERMITS}
      workVisasNote={SPAIN_WORK_RELATED_RESIDENCE_NOTE}
      migrantBackgroundLabel="Foreign-born population"
      migrantBackgroundValue={SPAIN_MIGRANT_BACKGROUND_2025}
      migrantBackgroundNote={SPAIN_MIGRANT_BACKGROUND_NOTE}
      migrationBackgroundByYear={SPAIN_FOREIGN_BORN_POPULATION_SERIES}
      migrationBackgroundTitle="Foreign-born population in Spain"
      migrationBackgroundDesc="Official INE Annual Population Census observation at 1 January 2025. No longer series is shown because Spain's published country-of-birth measure is not interchangeable with broader ancestry concepts."
      migrationBackgroundSeriesLabel="Foreign-born residents"
      migrantArrivalsSeries={SPAIN_MIGRANT_ARRIVALS_SERIES}
      deportationTrendSeries={SPAIN_DEPORTATION_TREND_SERIES}
      deportationTrendTitle="Migrant deportations (Spain, 2000–2025)"
      deportationTrendDesc="Cumulative deported migrants (left axis) and deportation rate per 100k migrants (right axis). Hover a series to focus it."
      deportationReentrySeries={SPAIN_DEPORTATION_REENTRY_SERIES}
      deportationReentryTitle="Immigrants who returned to Spain after deportation"
      deportationReentryDesc="Bars show the number of deported immigrants who returned; line shows the percentage of deported who returned that year."
      healthcareHousingSeries={SPAIN_HEALTHCARE_SOCIAL_HOUSING_USAGE}
      healthcareHousingTitle="Healthcare and social-housing usage share by recent immigrants"
      healthcareHousingDesc="Spain, 2000–2025: social-housing usage share and healthcare-spending share. Values use the supplied long-run series."
      healthcareHousingLabels={{
        first: 'Social housing share',
        second: 'Healthcare spending share',
      }}
      publicOpinionSeries={SPAIN_PUBLIC_OPINION_IMMIGRATION_2025}
      publicOpinionTitle="Immigration named as Spain's main problem"
      publicOpinionDesc="4.0% gave immigration as their first spontaneous answer in the CIS July 2025 Barometer (Study 3517). Only this directly comparable Spanish observation is shown."
      publicOpinionLabels={{
        first: 'Immigration named first',
        second: 'Not used',
        third: 'Not used',
      }}
      publicOpinionSeriesKeys={['publicOpinion']}
      publicOpinionYDomain={[0, 10]}
      languageIntegrationSeries={SPAIN_LANGUAGE_INTEGRATION_2025}
      languageIntegrationTitle="Language proficiency and integration rates by origin (2025)"
      languageIntegrationDesc="Share of each origin group reaching B1 Spanish or higher after 5 years."
      languageIntegrationMetricLabel="Spanish proficiency after 5 years"
      contributionRows={SPAIN_CONTRIBUTION_ROWS}
      contributionNotes={SPAIN_CONTRIBUTION_NOTES}
      contributionTitle="Contribution"
      contributionDesc="Estimated taxes and social contributions paid, transfers received and net contribution per group."
      contributionTableTitle="Spain fiscal contribution by group"
      contributionTableDesc="Dashboard estimates — not an official Spanish government dataset."
      contributionPeriodLabel="Evidence status"
      welfareTitle="2025 Ingreso Mínimo Vital (IMV) — Foreign holders"
      welfareDesc="Spain's national minimum-income benefit. The 17.6% foreign-nationality share is official; the nationality breakdown is estimated."
      welfareRows={SPAIN_IMV_WELFARE_ROWS}
      welfareFirstColumnLabel="Nationality"
      welfareShareColumnLabel="% of foreign holders"
      welfareNote={
        <div className="space-y-2 font-sans text-[10px] leading-relaxed text-neutral-500">
          <p>
            Official anchor: 82.4% of IMV holders were Spanish nationals in January 2025, so
            17.6% were foreign nationals. The benefit reached about 2.05 million people in
            671,849 households.
          </p>
          <p>
            The ≈138,000 foreign-holder total and country rows are dashboard estimates, not
            official INSS nationality counts. Source:{' '}
            <a
              className="underline underline-offset-2 hover:text-neutral-300"
              href={SPAIN_IMV_SOURCE_URL}
              target="_blank"
              rel="noreferrer"
            >
              Ministry of Inclusion, Social Security and Migration
            </a>
          </p>
        </div>
      }
      treemapItems={SPAIN_IMMIGRATION_TREEMAP_ITEMS}
      treemapNote="Immigrant stock by country of origin for Spain. Source metadata is retained in the generated Spain dossier CSV; unsupported panels remain clearly identified placeholders."
      refugeeOriginsTitle="Refugee origins in Spain (mid-2025)"
      refugeeBreakdown={SPAIN_REFUGEE_BREAKDOWN_2025}
      asylumByRegion={SPAIN_ASYLUM_APPLICATIONS_BY_GENDER}
      asylumStackKeys={SPAIN_ASYLUM_STACK_KEYS}
      asylumTrendChartConfig={SPAIN_ASYLUM_TREND_CHART_CONFIG}
      asylumSeekersTotal={SPAIN_ASYLUM_CUMULATIVE_SUMMARY.total}
      asylumSeekersMen={SPAIN_ASYLUM_CUMULATIVE_SUMMARY.men}
      asylumSeekersWomen={SPAIN_ASYLUM_CUMULATIVE_SUMMARY.women}
      asylumSummaryApproximate
      asylumTotalLabel="Total asylum applications"
      asylumSectionTitle="Illegal Asylum Seekers in Spain"
      asylumSectionDesc="Annual asylum applications in Spain by region of origin (2000–2025). Stacked bars show regional composition; the line marks reported total applications."
      asylumApplications={SPAIN_ASYLUM_APPLICATIONS_BY_ORIGIN_2025}
      asylumApplicationsTitle="Asylum applications — Spain (provisional 2025)"
      asylumApplicationsDesc="Applicants by country of origin, including Other countries (counts + share %)."
      asylumApplicationsNote={
        <p className="font-sans text-xs leading-relaxed text-neutral-500">
          Total: 144,396 applications. Official provisional figures closed on 31 December 2025. Source:{' '}
          <a
            className="underline underline-offset-2 hover:text-neutral-300"
            href={SPAIN_ASYLUM_APPLICATIONS_2025_SOURCE_URL}
            target="_blank"
            rel="noreferrer"
          >
            Spain Ministry of the Interior via La Moncloa
          </a>
          .
        </p>
      }
      advocates={SPAIN_ADVOCATES}
      advocatesHeading={SPAIN_ADVOCATES_HEADING}
      advocatesIntro={SPAIN_ADVOCATES_INTRO}
      advocatesCoalition={SPAIN_ADVOCATES_COALITION}
    />
  );
}
