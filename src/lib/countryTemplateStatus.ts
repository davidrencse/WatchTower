import type { CountryStatMetric } from '../types/countryStats';

/**
 * Which dossiers are hand-researched, and which are still running on the Germany template.
 *
 * Every routable country renders the *same* dossier structure — see `treatAsGermany` in
 * `countryDashboardSections.ts`, which is now true for all of them. What differs is provenance:
 *
 *  - **Curated** (Germany, France, Italy, Spain): every panel is backed by that country's own
 *    sources. Nothing here applies to them.
 *  - **Template**: the country renders the identical Germany layout with its own generated CSVs
 *    wired in wherever a component supports a `csvUrl`, plus the broad-stroke estimates in
 *    `src/data/countries/countryBroadStrokes.ts`. Panels that still carry Germany-bundled content
 *    are wrapped in a red `TemplateGapBlock` and statistic slots become red "Data needed" tiles.
 *    Nothing is deleted — a missing figure is marked, never hidden.
 */
export const CURATED_DOSSIER_ISO3: ReadonlySet<string> = new Set(['DEU', 'FRA', 'ITA', 'ESP']);

export function isCuratedDossier(iso3: string): boolean {
  return CURATED_DOSSIER_ISO3.has(iso3.trim().toUpperCase());
}

/** True for the 45 countries whose dossier is the Germany layout awaiting its own sources. */
export function usesGermanyTemplate(iso3: string): boolean {
  return !isCuratedDossier(iso3);
}

/** Value written into a statistic slot that has no country figure yet. */
export const TEMPLATE_SLOT_VALUE = 'Data needed';
/** `source_name` marking a slot as carried over from the Germany template. */
export const TEMPLATE_SLOT_SOURCE = 'Germany-template slot';

/** A tile the dashboard should render in the red "pending" style rather than as a real figure. */
export function isTemplateSlot(row: Pick<CountryStatMetric, 'value' | 'source_name'>): boolean {
  return row.value.trim() === TEMPLATE_SLOT_VALUE || row.source_name.trim() === TEMPLATE_SLOT_SOURCE;
}

/**
 * Germany's metric slots renamed for `countryLabel` and blanked of their German values.
 *
 * The Germany foreign-student and birth-health CSVs are what establish the *order and identity*
 * of several dashboard slots, so template countries still load them — but every value is replaced
 * here so no German figure is ever shown under another flag.
 */
export function asTemplateSlotMetric(
  metric: CountryStatMetric,
  countryLabel: string,
): CountryStatMetric {
  return {
    ...metric,
    metric: retitleGermanySlot(metric.metric, countryLabel),
    value: TEMPLATE_SLOT_VALUE,
    value_subtitle: undefined,
    reference_period: `${countryLabel} source pending`,
    geography_used: countryLabel,
    source_name: TEMPLATE_SLOT_SOURCE,
    source_url: '',
    source_publication_or_access_date: '',
    notes: `Statistic slot retained for a comparable ${countryLabel} source.`,
  };
}

/** An empty red slot for a statistic the template expects but the country has no source for. */
export function templateSlotMetric(metric: string, countryLabel: string): CountryStatMetric {
  return {
    metric,
    value: TEMPLATE_SLOT_VALUE,
    reference_period: `${countryLabel} source pending`,
    geography_used: countryLabel,
    source_name: TEMPLATE_SLOT_SOURCE,
    source_url: '',
    source_publication_or_access_date: '',
    notes: `Statistic slot retained for a comparable ${countryLabel} source.`,
  };
}

/** Appends a red placeholder for each expected metric the list is missing. */
export function fillMissingTemplateSlots(
  metrics: CountryStatMetric[],
  expected: readonly string[],
  countryLabel: string,
): void {
  const present = new Set(metrics.map((m) => m.metric));
  for (const name of expected) {
    if (!present.has(name)) metrics.push(templateSlotMetric(name, countryLabel));
  }
}

/**
 * Slot names that name Germany explicitly become country-neutral when reused as a template — the
 * neutral form is what `BIRTH_RATES_SUBSECTION_METRICS_TEMPLATE` looks up, and it avoids a Poland
 * dossier listing a statistic titled "…(Germany)".
 */
function retitleGermanySlot(metric: string, _countryLabel: string): string {
  if (metric === 'Childhood overweight and obesity (Germany)') {
    return 'Childhood overweight and obesity';
  }
  return metric;
}
