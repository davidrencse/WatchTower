/**
 * Section header counts for the Germany/France dashboard layout.
 *
 * These are hand-maintained layout constants (how many stat cards a section
 * shows in its collapsed header badge). They live here — in a light-weight
 * module — rather than inside their (chart-heavy) section components so that
 * `CountryStatsDashboard` can read them synchronously while the components
 * themselves are code-split via `React.lazy`. Importing a count from a heavy
 * component would pull that whole component into the dashboard's entry chunk
 * and defeat the split.
 *
 * Counts that derive from data arrays already live beside that data in `lib/`
 * (e.g. `germanyHealthCsv.ts`, `germanyGovernmentPolitics.ts`); only the
 * literal, in-component counts moved here.
 */

export const GERMANY_ECONOMIC_STRUCTURAL_GROUP_COUNT = 9;
export const GERMANY_ECONOMIC_TAXES_GROUP_COUNT = 7;
export const GERMANY_TRADE_GROUP_COUNT = 11;
export const GERMANY_MARRIAGES_GROUP_COUNT = 11;
export const GERMANY_SEXUAL_BEHAVIOR_GROUP_COUNT = 9;
export const GERMANY_POLITICS_LEFTISM_GROUP_COUNT = 12;
export const GERMANY_POLITICS_RIGHT_WING_GROUP_COUNT = 18;
/** ACTIVE_FREEMASONRY (5) + ILLUMINATI_GROUPS (2) in `GermanyPoliticsSecretSocietiesSection`. */
export const GERMANY_POLITICS_SECRET_SOCIETIES_GROUP_COUNT = 7;
export const GERMANY_POLITICS_ZIONISM_GROUP_COUNT = 24 + GERMANY_POLITICS_SECRET_SOCIETIES_GROUP_COUNT;
export const GERMANY_POLITICS_OVERVIEW_CHART_COUNT = 6;
