import {
  FRANCE_GOV_SPENDING_SERIES,
  franceCorruptionPctOfGdp,
  franceGovSpendRowForYear,
} from './franceGovernmentSpendingByYear';

export type FranceCorruptionLostYearRow = {
  year: number;
  lostBnEur: number;
  pctGdp: number;
};

export const FRANCE_CORRUPTION_LOST_BY_YEAR: readonly FranceCorruptionLostYearRow[] =
  FRANCE_GOV_SPENDING_SERIES.map((r) => ({
    year: Number(r.year),
    lostBnEur: r.lostToCorruptionBn,
    pctGdp: franceCorruptionPctOfGdp(r.lostToCorruptionBn, r.gdpPerCapitaUsd),
  }));

export function franceCorruptionLostRowForYear(year: number): FranceCorruptionLostYearRow {
  const row = franceGovSpendRowForYear(year);
  return {
    year,
    lostBnEur: row.lostToCorruptionBn,
    pctGdp: franceCorruptionPctOfGdp(row.lostToCorruptionBn, row.gdpPerCapitaUsd),
  };
}
