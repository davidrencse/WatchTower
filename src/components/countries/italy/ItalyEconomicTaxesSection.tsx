import { GermanyEconomicTaxesSection } from '../germany/GermanyEconomicTaxesSection';
import { ItalyNetIncomeCalculator } from './ItalyNetIncomeCalculator';
import {
  ITALY_CORPORATE_TAXES,
  ITALY_INCOME_BRACKETS,
  ITALY_OTHER_TAXES,
  ITALY_SOCIAL_SECURITY,
  ITALY_VAT_RATES,
} from '../../../lib/countries/italy/italyTaxes';

/** Italy's tax subsection — keeps Italy's IRPEF/INPS tables in Italy's chunk. */
export function ItalyEconomicTaxesSection() {
  return (
    <GermanyEconomicTaxesSection
      incomeBrackets={ITALY_INCOME_BRACKETS}
      bracketsTitle="IRPEF Brackets 2026"
      bracketsDescription="Taxable income (reddito complessivo, €); middle rate cut 35% → 33%."
      socialSecurity={ITALY_SOCIAL_SECURITY}
      socialTitle="Social Contributions 2026 (INPS)"
      socialDescription="Employee / employer shares (private sector, illustrative)."
      corporateTaxes={ITALY_CORPORATE_TAXES}
      vatRates={ITALY_VAT_RATES}
      otherTaxes={ITALY_OTHER_TAXES}
      calculator={<ItalyNetIncomeCalculator />}
      footnote="Reference figures are overview-only; verify against official Agenzia delle Entrate / INPS guidance for filing."
    />
  );
}
