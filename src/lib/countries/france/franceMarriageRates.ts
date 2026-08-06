import type { MarriageRatesRow } from '../../../components/countries/germany/GermanyMarriagesSection';

/**
 * France "Marriage rates" series (2000–2025).
 *
 * Sourced (INSEE, séries longues MAR1/MAR2, Bilan démographique):
 *  - Number of marriages: 305,234 (2000), 283,036 (2005), 251,654 (2010), 236,316 (2015),
 *    224,740 (2019), 154,581 (2020 COVID low), rebound to ~242,000 (2022), 241,080 (2023).
 *  - Crude marriage rate is computed here from counts ÷ population (France entière,
 *    ~60.9M in 2000 → ~68.6M in 2025) → ~5.0 (2000) down to ~3.4 (2024).
 *  - Mean age at marriage (all marriages, INSEE MAR2) rises steadily and is high in France
 *    (remarriages + PACS-first culture): men ~35 → ~39.6, women ~32 → ~37.4. Intermediate
 *    years are modeled on that trajectory (INSEE stopped some age series after 2022).
 */

/** Real / anchored INSEE marriage counts; interpolated where not directly published. */
const FRANCE_MARRIAGE_COUNTS: Record<string, number> = {
  '2000': 305234, '2001': 295720, '2002': 286169, '2003': 282756, '2004': 278439,
  '2005': 283036, '2006': 273914, '2007': 273669, '2008': 265404, '2009': 251478,
  '2010': 251654, '2011': 236826, '2012': 245930, '2013': 231225, '2014': 241292,
  '2015': 236316, '2016': 232725, '2017': 233915, '2018': 234735, '2019': 224740,
  '2020': 154581, '2021': 220000, '2022': 242000, '2023': 241080, '2024': 232000, '2025': 230000,
};

/** France entière mid-year population (millions), for the crude-rate computation. */
function frPopulationMillions(year: number): number {
  // Linear ~60.9M (2000) → ~68.6M (2025).
  return 60.9 + ((68.6 - 60.9) * (year - 2000)) / 25;
}

export const FRANCE_MARRIAGE_RATES_SERIES: readonly MarriageRatesRow[] = Object.entries(FRANCE_MARRIAGE_COUNTS).map(
  ([yearStr, totalMarriages]) => {
    const year = Number(yearStr);
    const t = (year - 2000) / 25;
    const pop = frPopulationMillions(year) * 1_000_000;
    const crudeMarriageRate = Math.round((totalMarriages / pop) * 1000 * 10) / 10;
    const avgAgeMen = Math.round((35.0 + t * (39.6 - 35.0)) * 10) / 10;
    const avgAgeWomen = Math.round((32.3 + t * (37.4 - 32.3)) * 10) / 10;
    return { year: yearStr, totalMarriages, crudeMarriageRate, avgAgeMen, avgAgeWomen };
  },
);
