import { SPAIN_FISCAL_SUPPORT_BY_YEAR, spainFiscalSupportRowForYear } from './spainFiscalSupportByYear';

export type SpainCorruptionLostYearRow = {
  year: number;
  lostBnEur: number;
  pctGdp: number;
};

/**
 * Projection of the corruption columns carried on {@link SPAIN_FISCAL_SUPPORT_BY_YEAR},
 * shaped like the German and French rows so the shared tile and chart can read all three.
 * See that file for the model, its inputs, and the comparability caveat.
 */
export const SPAIN_CORRUPTION_LOST_BY_YEAR: readonly SpainCorruptionLostYearRow[] =
  SPAIN_FISCAL_SUPPORT_BY_YEAR.map((r) => ({
    year: r.year,
    lostBnEur: r.lostToCorruptionBn,
    pctGdp: r.corruptionPctGdp,
  }));

export function spainCorruptionLostRowForYear(year: number): SpainCorruptionLostYearRow {
  const row = spainFiscalSupportRowForYear(year);
  return {
    year,
    lostBnEur: row.lostToCorruptionBn,
    pctGdp: row.corruptionPctGdp,
  };
}
