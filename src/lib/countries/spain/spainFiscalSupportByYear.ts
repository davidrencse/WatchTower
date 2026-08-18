export type SpainFiscalSupportYearRow = {
  year: number;
  immigrationWelfareBn: number;
  moneyToFamiliesBn: number;
  totalImmigrantsRefugeesBn: number;
  lostToCorruptionBn: number;
  corruptionPctGdp: number;
  foreignAidOdaBn: number;
};

/**
 * Spain fiscal-support series, € billions. Three of these six columns are published
 * statistics and three are modelled — the split matters, so the UI labels them apart.
 *
 * SOURCED — `foreignAidOdaBn`
 *   Net official development assistance provided, World Bank `DC.ODA.TOTL.CD`
 *   (the OECD-DAC series), current US$, converted at the ECB annual average USD/EUR
 *   reference rate (`EXR/A.USD.EUR.SP00.A`). Both pulled 10 Aug 2026. 2000–2024 are
 *   published; 2025 uses the OECD-DAC preliminary US$5.1bn (0.27% of GNI). Note the
 *   Spanish government quotes AOD on the DAC grant-equivalent basis and reports
 *   "over €4bn, +12%" for 2024 — the +12% matches this series exactly, the level sits
 *   ~5% higher because it is a different measure.
 *
 * SOURCED-INPUT MODEL — `lostToCorruptionBn` / `corruptionPctGdp`
 *   The repo's documented corruption model (see `lib/corruptionLost.ts`) applied per year:
 *     lost = GDP × 5% × ((100 − CPI) / 57)
 *   with GDP from Eurostat `nama_10_gdp` (B1GQ, CP_MEUR) and CPI from Transparency
 *   International's own country series. TI only publishes comparable scores from 2012, so
 *   2000–2011 carry the 2012 score (65) and vary with GDP alone — which is why
 *   `corruptionPctGdp` is flat before 2013. Independent cross-check: Spain's CNMC put the
 *   overcost of deficient public procurement at ~€48bn/yr, "close to 5% of GDP", in its
 *   2015 report; this model gives €40.1bn for 2015. These figures are an order-of-magnitude
 *   estimate of the economic cost of corruption, NOT money traced out of a budget, and they
 *   are not comparable with the other countries' corruption series in this dashboard, which
 *   are built on different bases.
 *
 * MODELLED — `immigrationWelfareBn`, `moneyToFamiliesBn`, `totalImmigrantsRefugeesBn`
 *   Spain publishes no consolidated annual series for any of these. The trend is
 *   interpolated between published anchor points and is NOT an official statistic:
 *     • Reception/humanitarian system (`totalImmigrantsRefugeesBn`) — Secretaría de Estado
 *       de Migraciones budget: €481.24M (2019), €631M (2022 initial), €814M (2023, of which
 *       >€630M for the Sistema de Acogida and Atención Humanitaria).
 *     • Minimum-income transfers (`immigrationWelfareBn`) — Ingreso Mínimo Vital annualised
 *       cost ~€2.5bn (2023) at a 17.52% foreign-national share of beneficiaries, plus the
 *       autonomous communities' Rentas Mínimas de Inserción (28.89% foreign). Pre-2020 years
 *       are RMI and non-contributory benefits only, since the IMV did not exist.
 *     • Family transfers (`moneyToFamiliesBn`) — the child-dependant component of the above.
 *   The dashboard tiles reading these three render an explicit "Modeled estimate" note.
 *   Replace with sourced IMV / Seguridad Social / PGE series before treating them as fact.
 */
export const SPAIN_FISCAL_SUPPORT_BY_YEAR: readonly SpainFiscalSupportYearRow[] = [
  { year: 2000, immigrationWelfareBn: 0.12, moneyToFamiliesBn: 0.05, totalImmigrantsRefugeesBn: 0.05, lostToCorruptionBn: 19.9, corruptionPctGdp: 3.07, foreignAidOdaBn: 1.29 },
  { year: 2001, immigrationWelfareBn: 0.15, moneyToFamiliesBn: 0.06, totalImmigrantsRefugeesBn: 0.07, lostToCorruptionBn: 21.5, corruptionPctGdp: 3.07, foreignAidOdaBn: 1.94 },
  { year: 2002, immigrationWelfareBn: 0.18, moneyToFamiliesBn: 0.07, totalImmigrantsRefugeesBn: 0.08, lostToCorruptionBn: 23.0, corruptionPctGdp: 3.07, foreignAidOdaBn: 1.81 },
  { year: 2003, immigrationWelfareBn: 0.22, moneyToFamiliesBn: 0.09, totalImmigrantsRefugeesBn: 0.1, lostToCorruptionBn: 24.6, corruptionPctGdp: 3.07, foreignAidOdaBn: 1.73 },
  { year: 2004, immigrationWelfareBn: 0.25, moneyToFamiliesBn: 0.1, totalImmigrantsRefugeesBn: 0.11, lostToCorruptionBn: 26.4, corruptionPctGdp: 3.07, foreignAidOdaBn: 1.96 },
  { year: 2005, immigrationWelfareBn: 0.28, moneyToFamiliesBn: 0.11, totalImmigrantsRefugeesBn: 0.13, lostToCorruptionBn: 28.5, corruptionPctGdp: 3.07, foreignAidOdaBn: 2.43 },
  { year: 2006, immigrationWelfareBn: 0.33, moneyToFamiliesBn: 0.13, totalImmigrantsRefugeesBn: 0.17, lostToCorruptionBn: 30.9, corruptionPctGdp: 3.07, foreignAidOdaBn: 3.04 },
  { year: 2007, immigrationWelfareBn: 0.37, moneyToFamiliesBn: 0.15, totalImmigrantsRefugeesBn: 0.17, lostToCorruptionBn: 33.1, corruptionPctGdp: 3.07, foreignAidOdaBn: 3.75 },
  { year: 2008, immigrationWelfareBn: 0.42, moneyToFamiliesBn: 0.17, totalImmigrantsRefugeesBn: 0.17, lostToCorruptionBn: 34.2, corruptionPctGdp: 3.07, foreignAidOdaBn: 4.67 },
  { year: 2009, immigrationWelfareBn: 0.41, moneyToFamiliesBn: 0.17, totalImmigrantsRefugeesBn: 0.17, lostToCorruptionBn: 32.9, corruptionPctGdp: 3.07, foreignAidOdaBn: 4.72 },
  { year: 2010, immigrationWelfareBn: 0.4, moneyToFamiliesBn: 0.16, totalImmigrantsRefugeesBn: 0.17, lostToCorruptionBn: 33.1, corruptionPctGdp: 3.07, foreignAidOdaBn: 4.49 },
  { year: 2011, immigrationWelfareBn: 0.38, moneyToFamiliesBn: 0.15, totalImmigrantsRefugeesBn: 0.17, lostToCorruptionBn: 32.8, corruptionPctGdp: 3.07, foreignAidOdaBn: 3.0 },
  { year: 2012, immigrationWelfareBn: 0.36, moneyToFamiliesBn: 0.14, totalImmigrantsRefugeesBn: 0.17, lostToCorruptionBn: 31.8, corruptionPctGdp: 3.07, foreignAidOdaBn: 1.59 },
  { year: 2013, immigrationWelfareBn: 0.34, moneyToFamiliesBn: 0.13, totalImmigrantsRefugeesBn: 0.18, lostToCorruptionBn: 36.9, corruptionPctGdp: 3.6, foreignAidOdaBn: 1.77 },
  { year: 2014, immigrationWelfareBn: 0.36, moneyToFamiliesBn: 0.14, totalImmigrantsRefugeesBn: 0.18, lostToCorruptionBn: 36.5, corruptionPctGdp: 3.51, foreignAidOdaBn: 1.41 },
  { year: 2015, immigrationWelfareBn: 0.38, moneyToFamiliesBn: 0.14, totalImmigrantsRefugeesBn: 0.18, lostToCorruptionBn: 40.1, corruptionPctGdp: 3.68, foreignAidOdaBn: 1.26 },
  { year: 2016, immigrationWelfareBn: 0.4, moneyToFamiliesBn: 0.15, totalImmigrantsRefugeesBn: 0.26, lostToCorruptionBn: 41.4, corruptionPctGdp: 3.68, foreignAidOdaBn: 3.82 },
  { year: 2017, immigrationWelfareBn: 0.43, moneyToFamiliesBn: 0.16, totalImmigrantsRefugeesBn: 0.33, lostToCorruptionBn: 44.1, corruptionPctGdp: 3.77, foreignAidOdaBn: 2.27 },
  { year: 2018, immigrationWelfareBn: 0.47, moneyToFamiliesBn: 0.18, totalImmigrantsRefugeesBn: 0.41, lostToCorruptionBn: 44.7, corruptionPctGdp: 3.68, foreignAidOdaBn: 2.19 },
  { year: 2019, immigrationWelfareBn: 0.5, moneyToFamiliesBn: 0.19, totalImmigrantsRefugeesBn: 0.48, lostToCorruptionBn: 41.8, corruptionPctGdp: 3.33, foreignAidOdaBn: 2.42 },
  { year: 2020, immigrationWelfareBn: 0.45, moneyToFamiliesBn: 0.18, totalImmigrantsRefugeesBn: 0.54, lostToCorruptionBn: 37.6, corruptionPctGdp: 3.33, foreignAidOdaBn: 2.4 },
  { year: 2021, immigrationWelfareBn: 0.75, moneyToFamiliesBn: 0.28, totalImmigrantsRefugeesBn: 0.6, lostToCorruptionBn: 42.3, corruptionPctGdp: 3.42, foreignAidOdaBn: 2.84 },
  { year: 2022, immigrationWelfareBn: 0.95, moneyToFamiliesBn: 0.35, totalImmigrantsRefugeesBn: 0.63, lostToCorruptionBn: 48.3, corruptionPctGdp: 3.51, foreignAidOdaBn: 3.84 },
  { year: 2023, immigrationWelfareBn: 1.15, moneyToFamiliesBn: 0.42, totalImmigrantsRefugeesBn: 0.81, lostToCorruptionBn: 52.6, corruptionPctGdp: 3.51, foreignAidOdaBn: 3.38 },
  { year: 2024, immigrationWelfareBn: 1.3, moneyToFamiliesBn: 0.48, totalImmigrantsRefugeesBn: 0.95, lostToCorruptionBn: 61.5, corruptionPctGdp: 3.86, foreignAidOdaBn: 3.82 },
  { year: 2025, immigrationWelfareBn: 1.42, moneyToFamiliesBn: 0.53, totalImmigrantsRefugeesBn: 1.05, lostToCorruptionBn: 66.6, corruptionPctGdp: 3.95, foreignAidOdaBn: 4.51 },
] as const;

export function spainFiscalSupportRowForYear(year: number): SpainFiscalSupportYearRow {
  return (
    SPAIN_FISCAL_SUPPORT_BY_YEAR.find((row) => row.year === year) ??
    SPAIN_FISCAL_SUPPORT_BY_YEAR[SPAIN_FISCAL_SUPPORT_BY_YEAR.length - 1]!
  );
}
