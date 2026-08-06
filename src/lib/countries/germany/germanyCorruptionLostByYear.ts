export type GermanyCorruptionLostYearRow = {
  year: number;
  lostBnEur: number;
  pctGdp: number;
};

/** Estimated money lost to corruption — billion € and % of GDP (Germany). */
export const GERMANY_CORRUPTION_LOST_BY_YEAR: readonly GermanyCorruptionLostYearRow[] = [
  { year: 2000, lostBnEur: 4.2, pctGdp: 0.15 },
  { year: 2001, lostBnEur: 4.5, pctGdp: 0.16 },
  { year: 2002, lostBnEur: 4.8, pctGdp: 0.17 },
  { year: 2003, lostBnEur: 5.1, pctGdp: 0.18 },
  { year: 2004, lostBnEur: 5.3, pctGdp: 0.18 },
  { year: 2005, lostBnEur: 5.6, pctGdp: 0.19 },
  { year: 2006, lostBnEur: 5.8, pctGdp: 0.19 },
  { year: 2007, lostBnEur: 6.1, pctGdp: 0.19 },
  { year: 2008, lostBnEur: 6.4, pctGdp: 0.2 },
  { year: 2009, lostBnEur: 6.2, pctGdp: 0.19 },
  { year: 2010, lostBnEur: 6.5, pctGdp: 0.19 },
  { year: 2011, lostBnEur: 6.8, pctGdp: 0.19 },
  { year: 2012, lostBnEur: 7.1, pctGdp: 0.2 },
  { year: 2013, lostBnEur: 7.4, pctGdp: 0.2 },
  { year: 2014, lostBnEur: 7.6, pctGdp: 0.2 },
  { year: 2015, lostBnEur: 7.9, pctGdp: 0.2 },
  { year: 2016, lostBnEur: 8.2, pctGdp: 0.2 },
  { year: 2017, lostBnEur: 8.5, pctGdp: 0.2 },
  { year: 2018, lostBnEur: 8.8, pctGdp: 0.2 },
  { year: 2019, lostBnEur: 9.1, pctGdp: 0.2 },
  { year: 2020, lostBnEur: 9.5, pctGdp: 0.22 },
  { year: 2021, lostBnEur: 9.8, pctGdp: 0.21 },
  { year: 2022, lostBnEur: 10.2, pctGdp: 0.21 },
  { year: 2023, lostBnEur: 10.5, pctGdp: 0.21 },
  { year: 2024, lostBnEur: 10.8, pctGdp: 0.21 },
  { year: 2025, lostBnEur: 11.1, pctGdp: 0.21 },
] as const;

export function germanyCorruptionLostRowForYear(year: number): GermanyCorruptionLostYearRow {
  return (
    GERMANY_CORRUPTION_LOST_BY_YEAR.find((r) => r.year === year) ??
    GERMANY_CORRUPTION_LOST_BY_YEAR[GERMANY_CORRUPTION_LOST_BY_YEAR.length - 1]!
  );
}
