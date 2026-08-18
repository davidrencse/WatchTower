import { GermanyLaborIncomeSection } from '../germany/GermanyLaborIncomeSection';
import { SPAIN_LABOR_MIGRATION_ENFORCEMENT_ROWS } from '../../../lib/countries/spain/spainLaborMigrationEnforcement';
import { SPAIN_LABOR_STATISTICS_ROWS } from '../../../lib/countries/spain/spainLaborStatistics';
import {
  SPAIN_INCOME_CONCENTRATION_INDICATORS,
  SPAIN_INCOME_DISTRIBUTION_CAPTION,
  SPAIN_INCOME_DISTRIBUTION_GROUPS,
} from '../../../lib/countries/spain/spainIncomeDistribution';
import {
  SPAIN_EARNINGS_BY_NATIONALITY,
  SPAIN_EARNINGS_BY_NATIONALITY_NOTE,
  SPAIN_EARNINGS_BY_NATIONALITY_SERIES,
  SPAIN_EARNINGS_BY_NATIONALITY_SOURCE_URL,
  SPAIN_EARNINGS_BY_NATIONALITY_TITLE,
} from '../../../lib/countries/spain/spainEarningsByNationality';
import {
  SPAIN_NET_FISCAL_CONTRIBUTION_BY_ORIGIN,
  SPAIN_NET_FISCAL_CONTRIBUTION_NOTE,
  SPAIN_NET_FISCAL_CONTRIBUTION_SERIES,
  SPAIN_NET_FISCAL_CONTRIBUTION_SOURCE_LABEL,
  SPAIN_NET_FISCAL_CONTRIBUTION_SOURCE_URL,
  SPAIN_NET_FISCAL_CONTRIBUTION_TITLE,
} from '../../../lib/countries/spain/spainNetFiscalContributionByOrigin';
import {
  SPAIN_REMITTANCES_OUTFLOW_2024,
  SPAIN_REMITTANCES_OUTFLOW_NOTE,
  SPAIN_REMITTANCES_OUTFLOW_TITLE,
} from '../../../lib/countries/spain/spainRemittancesOutflow';
import { SPAIN_IMMIGRANT_BENEFITS } from '../../../lib/countries/spain/spainImmigrantBenefits';

/**
 * Spain's labour & income subsection.
 *
 * Same wrapper shape as France's: it keeps Spain's tables in Spain's chunk and hands the
 * Germany layout its own data. The CSV props stay wired so the generated
 * `esp_labor_statistics.csv` / `esp_government_politics.csv` rows still render — the
 * overrides replace matching metrics and leave everything else in place.
 *
 * The net-fiscal chart is the one panel here with no Spanish source behind it, so it alone
 * turns on `showLegend`/`showDataTable` and carries a note saying so.
 */
export function SpainLaborIncomeSection({
  govCsvUrl,
  laborCsvUrl,
}: {
  govCsvUrl?: string;
  laborCsvUrl?: string;
}) {
  return (
    <GermanyLaborIncomeSection
      isGermany={false}
      govCsvUrl={govCsvUrl}
      laborCsvUrl={laborCsvUrl}
      govRowsOverride={SPAIN_LABOR_MIGRATION_ENFORCEMENT_ROWS}
      laborRowsOverride={SPAIN_LABOR_STATISTICS_ROWS}
      incomeDistribution={{
        groups: SPAIN_INCOME_DISTRIBUTION_GROUPS,
        caption: SPAIN_INCOME_DISTRIBUTION_CAPTION,
        concentrationIndicators: SPAIN_INCOME_CONCENTRATION_INDICATORS,
      }}
      incomeNationalityChart={{
        title: SPAIN_EARNINGS_BY_NATIONALITY_TITLE,
        data: SPAIN_EARNINGS_BY_NATIONALITY,
        series: SPAIN_EARNINGS_BY_NATIONALITY_SERIES,
        note: SPAIN_EARNINGS_BY_NATIONALITY_NOTE,
        sourceUrl: SPAIN_EARNINGS_BY_NATIONALITY_SOURCE_URL,
      }}
      fiscalNationalityChart={{
        title: SPAIN_NET_FISCAL_CONTRIBUTION_TITLE,
        data: SPAIN_NET_FISCAL_CONTRIBUTION_BY_ORIGIN,
        series: SPAIN_NET_FISCAL_CONTRIBUTION_SERIES,
        note: SPAIN_NET_FISCAL_CONTRIBUTION_NOTE,
        sourceLabel: SPAIN_NET_FISCAL_CONTRIBUTION_SOURCE_LABEL,
        sourceUrl: SPAIN_NET_FISCAL_CONTRIBUTION_SOURCE_URL,
        showLegend: true,
        showDataTable: true,
      }}
      remittancesChart={{
        title: SPAIN_REMITTANCES_OUTFLOW_TITLE,
        data: SPAIN_REMITTANCES_OUTFLOW_2024,
        note: SPAIN_REMITTANCES_OUTFLOW_NOTE,
      }}
      immigrantBenefits={SPAIN_IMMIGRANT_BENEFITS}
    />
  );
}
