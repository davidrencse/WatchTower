import { FRANCE_FISCAL_SUPPORT_BY_YEAR, franceFiscalSupportRowForYear } from './franceFiscalSupportByYear';

export type FranceCorruptionLostYearRow = {
  year: number;
  lostBnEur: number;
  pctGdp: number;
};

export const FRANCE_CORRUPTION_LOST_BY_YEAR: readonly FranceCorruptionLostYearRow[] =
  FRANCE_FISCAL_SUPPORT_BY_YEAR.map((r) => ({
    year: r.year,
    lostBnEur: r.lostToCorruptionBn,
    pctGdp: r.corruptionPctGdp,
  }));

export function franceCorruptionLostRowForYear(year: number): FranceCorruptionLostYearRow {
  const row = franceFiscalSupportRowForYear(year);
  return {
    year,
    lostBnEur: row.lostToCorruptionBn,
    pctGdp: row.corruptionPctGdp,
  };
}
