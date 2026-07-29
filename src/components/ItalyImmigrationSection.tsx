import { memo } from 'react';
import { GermanyImmigrationSection } from './GermanyImmigrationSection';
import * as italy from '../lib/italyImmigrationContent';

export const ItalyImmigrationSection = memo(function ItalyImmigrationSection() {
  return (
    <GermanyImmigrationSection
      countryLabel="Italy"
      refugeesLabel="Refugees and refugee-like"
      refugeesValue={italy.ITALY_REFUGEES_VALUE}
      refugeesNote={italy.ITALY_REFUGEES_NOTE}
      workVisasLabel="First work permits"
      workVisasValue={italy.ITALY_WORK_VISAS_VALUE}
      workVisasNote={italy.ITALY_WORK_VISAS_NOTE}
      migrantBackgroundLabel="Foreign-born residents"
      migrantBackgroundValue={italy.ITALY_FOREIGN_BORN_VALUE}
      migrantBackgroundNote={italy.ITALY_FOREIGN_BORN_NOTE}
      migrationBackgroundByYear={italy.ITALY_FOREIGN_BORN_BY_YEAR}
      migrationBackgroundTitle="Foreign-born resident population (Italy, 2002–2025)"
      migrationBackgroundDesc="Foreign-born residents on 1 January of each year. Eurostat migr_pop3ctb; the series has a statistical break in 2019 and is a birthplace measure, not an ethnic-background count."
      migrationBackgroundSeriesLabel="Foreign-born residents"
      migrantArrivalsSeries={italy.ITALY_MIGRANT_ARRIVALS_SERIES}
      migrantArrivalsTitle="Foreign-citizen immigration to Italy (2008–2024)"
      migrantArrivalsDesc="Annual immigrants with foreign citizenship, grouped by citizenship region. Europe excludes Italian citizens; non-Europe is the residual outside Europe. Source: Eurostat migr_imm1ctz."
      deportationTrendSeries={italy.ITALY_DEPORTATION_TREND_SERIES}
      deportationReentrySeries={italy.ITALY_RETURN_ORDER_ENFORCEMENT_SERIES}
      deportationSourceNote={italy.ITALY_DEPORTATION_NOTE}
      deportationReentryTitle="Return-order enforcement in Italy (2008–2025)"
      deportationReentryDesc="Bars show third-country nationals recorded as returned following an order to leave; the line compares returns with orders issued in the same calendar year. This is not a measure of people re-entering Italy after deportation."
      deportationReentryBarLabel="Returns following an order"
      deportationReentryLineLabel="Returns / orders issued"
      deportationReentrySummaryCountLabel="returns following an order"
      deportationReentrySummaryPctLabel="same-year returns/orders"
      treemapItems={italy.ITALY_IMMIGRATION_TREEMAP_ITEMS}
      treemapNote={italy.ITALY_TREEMAP_NOTE}
      languageIntegrationSeries={italy.ITALY_LANGUAGE_INTEGRATION}
      languageIntegrationTitle={italy.ITALY_LANGUAGE_INTEGRATION_TITLE}
      languageIntegrationDesc={italy.ITALY_LANGUAGE_INTEGRATION_DESC}
      languageIntegrationMetricLabel="Uses Italian predominantly"
      healthcareHousingSeries={italy.ITALY_HOUSING_DISADVANTAGE}
      healthcareHousingTitle={italy.ITALY_HOUSING_TITLE}
      healthcareHousingDesc={italy.ITALY_HOUSING_DESC}
      healthcareHousingLabels={{
        first: 'Overcrowding rate',
        second: 'Housing-cost overburden',
      }}
      healthcareHousingYDomain={[0, 65]}
      publicOpinionSeries={italy.ITALY_PUBLIC_OPINION}
      publicOpinionTitle="Public opinion on immigration"
      publicOpinionDesc={italy.ITALY_PUBLIC_OPINION_DESC}
      publicOpinionLabels={{
        first: 'Public opinion on immigration',
        second: '',
        third: '',
      }}
      publicOpinionYDomain={[0, 50]}
      publicOpinionSeriesKeys={['publicOpinion']}
      contributionRows={italy.ITALY_CONTRIBUTION_ROWS}
      contributionNotes={italy.ITALY_CONTRIBUTION_NOTES}
      contributionTitle="Contribution"
      contributionDesc="Pooled annual mean per person, Italy 2007–2018. Positive values mean direct taxes and social contributions exceeded cash transfers; negative values mean the reverse."
      contributionTableTitle="1. Fiscal contributions (taxes + social security contributions)"
      contributionTableDesc="Mean values conditional on paying a positive amount (zeros excluded). The approximate overall averages include people who paid zero."
      contributionPeriodLabel="Definition and coverage"
      welfareTitle={italy.ITALY_WELFARE_TITLE}
      welfareDesc={italy.ITALY_WELFARE_DESC}
      welfareRows={italy.ITALY_WELFARE_ROWS}
      welfareNote={
        <p className="font-sans text-[10px] leading-relaxed text-neutral-500">
          {italy.ITALY_WELFARE_NOTE}
        </p>
      }
      welfareFirstColumnLabel="Benefit programme"
      welfareShareColumnLabel="% of all programme beneficiaries"
      refugeeOriginsTitle={italy.ITALY_REFUGEE_ORIGINS_TITLE}
      refugeeBreakdown={italy.ITALY_REFUGEE_BREAKDOWN}
      asylumByRegion={italy.ITALY_ASYLUM_BY_REGION}
      asylumSeekersTotal={italy.ITALY_ASYLUM_SEEKERS_TOTAL}
      asylumSeekersMen={italy.ITALY_ASYLUM_SEEKERS_MEN}
      asylumSeekersWomen={italy.ITALY_ASYLUM_SEEKERS_WOMEN}
      asylumSectionTitle="Asylum applications in Italy (2008–2025)"
      asylumSectionDesc="Eurostat annual applications grouped from citizenship records. Totals include first and subsequent applications. Male and female cumulative counts exclude 1,610 records whose sex was unknown."
      asylumTotalLabel="Applications (cumulative)"
      asylumMenLabel="Male applicants"
      asylumWomenLabel="Female applicants"
      asylumApplications={italy.ITALY_ASYLUM_APPLICATIONS_2025}
      asylumApplicationsTitle="Asylum applications by citizenship (Italy, 2025)"
      asylumApplicationsDesc="135,485 applications in total; the chart shows the ten largest citizenship groups and Other. Source: Eurostat migr_asyappctza."
      advocates={italy.ITALY_ADVOCATES}
      advocatesHeading={italy.ITALY_ADVOCATES_HEADING}
      advocatesIntro={italy.ITALY_ADVOCATES_INTRO}
      advocatesCoalition={italy.ITALY_ADVOCATES_COALITION}
    />
  );
});
