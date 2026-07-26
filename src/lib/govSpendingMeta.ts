/**
 * Layout constant read by the dashboard's section counter.
 *
 * Kept out of `CountryGovSpendingSection` so the dashboard does not have to
 * statically import that component (and, through it, recharts) just to count
 * how many cards a subsection renders.
 */

/** Charts + category block + context metric row below the lead row (excludes lead-row corruption tile). */
export const GERMANY_GOV_SPENDING_EXTRA_CARD_COUNT = 19;
