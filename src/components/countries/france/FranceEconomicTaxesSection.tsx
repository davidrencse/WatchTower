import { GermanyEconomicTaxesSection } from '../germany/GermanyEconomicTaxesSection';
import { FranceNetIncomeCalculator } from './FranceNetIncomeCalculator';
import {
  FRANCE_CORPORATE_TAXES,
  FRANCE_INCOME_BRACKETS,
  FRANCE_OTHER_TAXES,
  FRANCE_SOCIAL_SECURITY,
  FRANCE_VAT_RATES,
} from '../../../lib/countries/france/franceTaxes';

/** France's tax subsection — keeps France's barème/URSSAF tables in France's chunk. */
export function FranceEconomicTaxesSection() {
  return (
    <GermanyEconomicTaxesSection
      incomeBrackets={FRANCE_INCOME_BRACKETS}
      bracketsTitle="Income Tax Brackets 2026 (per part)"
      bracketsDescription="Barème IR on 2025 income, applied to the quotient familial (€)."
      socialSecurity={FRANCE_SOCIAL_SECURITY}
      socialTitle="Social Contributions 2026"
      socialDescription="Employee / employer shares (illustrative)."
      corporateTaxes={FRANCE_CORPORATE_TAXES}
      vatRates={FRANCE_VAT_RATES}
      otherTaxes={FRANCE_OTHER_TAXES}
      calculator={<FranceNetIncomeCalculator />}
      footnote="Reference figures are overview-only; verify against official impots.gouv.fr / URSSAF guidance for filing."
    />
  );
}
