import { GermanyLaborIncomeSection } from '../germany/GermanyLaborIncomeSection';
import { FRANCE_LABOR_MIGRATION_ENFORCEMENT_ROWS } from '../../../lib/countries/france/franceLaborMigrationEnforcement';
import { FRANCE_LABOR_STATISTICS_ROWS } from '../../../lib/countries/france/franceLaborStatistics';
import {
  FRANCE_INCOME_DISTRIBUTION_CAPTION,
  FRANCE_INCOME_DISTRIBUTION_GROUPS,
} from '../../../lib/countries/france/franceIncomeDistribution';
import {
  FRANCE_MEDIAN_MONTHLY_NET_INCOME_BY_ETHNIC_GROUP,
  FRANCE_MEDIAN_MONTHLY_NET_INCOME_SERIES,
  FRANCE_MEDIAN_MONTHLY_NET_INCOME_TITLE,
} from '../../../lib/countries/france/franceMedianIncomeByEthnicGroup';
import {
  FRANCE_NET_FISCAL_CONTRIBUTION_BY_ETHNIC_GROUP,
  FRANCE_NET_FISCAL_CONTRIBUTION_SERIES,
  FRANCE_NET_FISCAL_CONTRIBUTION_TITLE,
} from '../../../lib/countries/france/franceNetFiscalContributionByEthnicGroup';
import {
  FRANCE_REMITTANCES_OUTFLOW_2025,
  FRANCE_REMITTANCES_OUTFLOW_NOTE,
  FRANCE_REMITTANCES_OUTFLOW_TITLE,
} from '../../../lib/countries/france/franceRemittancesOutflow';
import { FRANCE_IMMIGRANT_BENEFITS } from '../../../lib/countries/france/franceImmigrantBenefits';

/** France's labour & income subsection — keeps France's income/fiscal tables in France's chunk. */
export function FranceLaborIncomeSection() {
  return (
    <GermanyLaborIncomeSection
      govRowsOverride={FRANCE_LABOR_MIGRATION_ENFORCEMENT_ROWS}
      laborRowsOverride={FRANCE_LABOR_STATISTICS_ROWS}
      incomeDistribution={{
        groups: FRANCE_INCOME_DISTRIBUTION_GROUPS,
        caption: FRANCE_INCOME_DISTRIBUTION_CAPTION,
      }}
      incomeNationalityChart={{
        title: FRANCE_MEDIAN_MONTHLY_NET_INCOME_TITLE,
        data: FRANCE_MEDIAN_MONTHLY_NET_INCOME_BY_ETHNIC_GROUP,
        series: FRANCE_MEDIAN_MONTHLY_NET_INCOME_SERIES,
      }}
      fiscalNationalityChart={{
        title: FRANCE_NET_FISCAL_CONTRIBUTION_TITLE,
        data: FRANCE_NET_FISCAL_CONTRIBUTION_BY_ETHNIC_GROUP,
        series: FRANCE_NET_FISCAL_CONTRIBUTION_SERIES,
      }}
      remittancesChart={{
        title: FRANCE_REMITTANCES_OUTFLOW_TITLE,
        data: FRANCE_REMITTANCES_OUTFLOW_2025,
        note: FRANCE_REMITTANCES_OUTFLOW_NOTE,
      }}
      immigrantBenefits={FRANCE_IMMIGRANT_BENEFITS}
    />
  );
}
