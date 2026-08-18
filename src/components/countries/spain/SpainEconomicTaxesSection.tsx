import { GermanyEconomicTaxesSection } from '../germany/GermanyEconomicTaxesSection';
import { SpainNetIncomeCalculator } from './SpainNetIncomeCalculator';
import {
  SPAIN_CORPORATE_TAXES,
  SPAIN_INCOME_BRACKETS,
  SPAIN_OTHER_TAXES,
  SPAIN_SOCIAL_SECURITY,
  SPAIN_VAT_RATES,
} from '../../../lib/countries/spain/spainTaxes';

/** Spain's complete Economy → Taxes subsection. */
export function SpainEconomicTaxesSection() {
  return (
    <GermanyEconomicTaxesSection
      incomeBrackets={SPAIN_INCOME_BRACKETS}
      bracketsTitle="IRPF reference scale (2025 income)"
      bracketsDescription="Combined state + equal regional reference (€); the autonomous-community half varies."
      socialSecurity={SPAIN_SOCIAL_SECURITY}
      socialTitle="Social Security contributions 2026"
      socialDescription="General Scheme, indefinite contract; work-injury rate excluded."
      corporateTaxes={SPAIN_CORPORATE_TAXES}
      vatRates={SPAIN_VAT_RATES}
      otherTaxes={SPAIN_OTHER_TAXES}
      calculator={<SpainNetIncomeCalculator />}
      footnote="Official reference set: Agencia Tributaria (IRPF 2025, VAT and company-tax rates) and BOE Order PJC/297/2026 (Social Security). Overview only; autonomous-community rules and personal circumstances can materially change the result."
    />
  );
}
