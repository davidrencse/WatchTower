import { FRANCE_GOV_SPENDING_SERIES } from './franceGovernmentSpendingByYear';

export type FranceGeneralGovExpenditureRow = {
  year: string;
  total: number;
};

export const FRANCE_GENERAL_GOVERNMENT_EXPENDITURE_SERIES: readonly FranceGeneralGovExpenditureRow[] =
  FRANCE_GOV_SPENDING_SERIES.map((r) => ({ year: r.year, total: r.total }));

export function franceGeneralGovExpenditureForYear(year: number): FranceGeneralGovExpenditureRow {
  return (
    FRANCE_GENERAL_GOVERNMENT_EXPENDITURE_SERIES.find((r) => Number(r.year) === year) ??
    FRANCE_GENERAL_GOVERNMENT_EXPENDITURE_SERIES.at(-1)!
  );
}
