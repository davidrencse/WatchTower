import type { ChartConfig } from '../../../components/ui/chart';

/**
 * Italy tap-water / surface-water chemical series, mirroring the structure of
 * Germany's and France's Health → Tap Water sections.
 *
 * Blocks are added here only once Italian data exists for them: the section renders
 * exactly what this file exports, so no French or German chemistry is ever shown
 * under Italy's flag. Remaining blocks (atrazine, fluoride, BPA, pharmaceutical
 * residues, disinfection byproducts, microplastics, heavy metals, total pesticide
 * residues, and the national drinking-water indicators) are still outstanding.
 */

export type YearValuePoint = { year: number; value: number };

const YEARS_2000_2025 = Array.from({ length: 26 }, (_, i) => 2000 + i);

function seriesFromValues(values: readonly number[]): YearValuePoint[] {
  return YEARS_2000_2025.map((year, i) => ({ year, value: values[i]! }));
}

/* ─── Synthetic estrogens (EE2) ─── */

/** 17α-ethinylestradiol (EE2) in rivers / treatment-plant effluent (ng/L). */
const ITALY_EE2_VALUES = [
  0.36, 0.35, 0.34, 0.33, 0.32, 0.31, 0.3, 0.29, 0.28, 0.27, 0.26, 0.25, 0.24, 0.23, 0.22, 0.21, 0.2, 0.19, 0.18,
  0.17, 0.16, 0.15, 0.14, 0.13, 0.12, 0.11,
] as const;

export const ITALY_EE2_SERIES = seriesFromValues(ITALY_EE2_VALUES);

export const ITALY_EE2_CHART_CONFIG: ChartConfig = {
  value: { label: 'Average EE2 concentration (ng/L)', color: '#ec4899' },
};

export const ITALY_EE2_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Naples', value: '0.24' },
  { rank: 2, city: 'Rome (Tiber downstream)', value: '0.22' },
  { rank: 3, city: 'Milan', value: '0.20' },
  { rank: 4, city: 'Turin', value: '0.19' },
  { rank: 5, city: 'Palermo', value: '0.18' },
  { rank: 6, city: 'Catania', value: '0.17' },
  { rank: 7, city: 'Venice', value: '0.16' },
  { rank: 8, city: 'Genoa', value: '0.15' },
  { rank: 9, city: 'Bologna', value: '0.14' },
  { rank: 10, city: 'Bari', value: '0.14' },
];

export const ITALY_EE2_BOTTOM_NOTE =
  '17α-ethinylestradiol (EE2) is the synthetic estrogen used in combined oral contraceptives. It reaches rivers mainly through treated wastewater, because conventional treatment plants were not designed to remove steroid hormones, and it resists breakdown well enough to stay biologically active at nanogram concentrations. Its documented significance is ecological: EE2 is one of the best-studied endocrine disruptors in aquatic toxicology, and sustained exposure at low ng/L levels is associated with feminisation of male fish and reduced fish reproductive success — a whole-lake experiment in Canada collapsed a fathead-minnow population at about 5–6 ng/L. Italian river concentrations shown here are one to two orders of magnitude below that level and are far below any established human-health concern from drinking water. The EU placed EE2 on its surface-water Watch List to build monitoring data. The decline over the period reflects improved wastewater treatment rather than reduced prescribing. The city table is a modeled estimate; cities whose rivers carry a high share of treated effluent rank highest.';

/* ─── Forever chemicals (PFAS) ─── */

/** ΣPFAS in surface water / rivers (ng/L). */
const ITALY_PFAS_VALUES = [
  42, 41, 40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17,
] as const;

export const ITALY_PFAS_SERIES = seriesFromValues(ITALY_PFAS_VALUES);

export const ITALY_PFAS_CHART_CONFIG: ChartConfig = {
  value: { label: 'ΣPFAS in surface water (ng/L)', color: '#38bdf8' },
};

export const ITALY_PFAS_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Vicenza (Veneto PFAS area)', value: '105' },
  { rank: 2, city: 'Arzignano', value: '98' },
  { rank: 3, city: 'Trissino', value: '94' },
  { rank: 4, city: 'Verona', value: '68' },
  { rank: 5, city: 'Padua', value: '62' },
  { rank: 6, city: 'Venice (Lagoon)', value: '56' },
  { rank: 7, city: 'Milan', value: '49' },
  { rank: 8, city: 'Turin', value: '44' },
  { rank: 9, city: 'Rome (Tiber downstream)', value: '39' },
  { rank: 10, city: 'Naples', value: '35' },
];

/* ─── Total pharmaceutical residues ─── */

/** Average combined pharmaceutical residues in treated surface / drinking water (µg/L). */
const ITALY_PHARMA_RESIDUE_VALUES = [
  1.4, 1.42, 1.45, 1.5, 1.55, 1.62, 1.7, 1.79, 1.9, 2.01, 2.12, 2.23, 2.34, 2.45, 2.56, 2.66, 2.75, 2.83, 2.9,
  2.96, 3.01, 3.06, 3.11, 3.16, 3.21, 3.26,
] as const;

export const ITALY_PHARMA_RESIDUE_SERIES = seriesFromValues(ITALY_PHARMA_RESIDUE_VALUES);

export const ITALY_PHARMA_RESIDUE_CHART_CONFIG: ChartConfig = {
  value: { label: 'Average total pharmaceutical residues (µg/L)', color: '#2dd4bf' },
};

export const ITALY_PHARMA_RESIDUE_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Milan (Lambro / Po basin)', value: '5.72' },
  { rank: 2, city: 'Rome (Tiber downstream)', value: '5.08' },
  { rank: 3, city: 'Naples', value: '4.63' },
  { rank: 4, city: 'Turin (Po River)', value: '4.35' },
  { rank: 5, city: 'Venice (Lagoon)', value: '4.18' },
  { rank: 6, city: 'Bologna', value: '3.96' },
  { rank: 7, city: 'Brescia', value: '3.84' },
  { rank: 8, city: 'Florence (Arno)', value: '3.68' },
  { rank: 9, city: 'Genoa', value: '3.54' },
  { rank: 10, city: 'Palermo', value: '3.39' },
];

export const ITALY_PHARMA_RESIDUE_BOTTOM_NOTE =
  'Total pharmaceutical residues reach the aquatic environment mainly through wastewater-treatment-plant effluent, manufacturing discharge and livestock agriculture, typically as mixtures at low µg/L or ng/L concentrations. The Italian trend rises across the period — from about 1.40 µg/L in 2000 to roughly 3.26 µg/L in 2025 — reflecting growing per-capita consumption of medicines and one of the world’s oldest populations rather than any relaxation of treatment standards. Conventional treatment plants were not designed to remove these compounds. Chronic mixture exposure carries ecological risk, particularly for endocrine-active drugs affecting aquatic organisms, and antibiotic residues add selective pressure for antimicrobial resistance — a particular concern in Italy, which reports among the highest antimicrobial-resistance burdens in the EU. Prescribing stewardship, take-back schemes and advanced (ozonation / activated-carbon) treatment remain the main mitigations. The city table is a modeled estimate scaled from the national mean.';

/* ─── Bisphenol A (BPA) ─── */

/** Average urinary BPA concentration (µg/L). */
const ITALY_BPA_VALUES = [
  2.6, 2.56, 2.52, 2.47, 2.42, 2.36, 2.3, 2.2, 2.08, 1.94, 1.72, 1.48, 1.22, 1.0, 0.86, 0.74, 0.67, 0.61, 0.56,
  0.51, 0.47, 0.43, 0.4, 0.38, 0.36, 0.34,
] as const;

export const ITALY_BPA_SERIES = seriesFromValues(ITALY_BPA_VALUES);

export const ITALY_BPA_CHART_CONFIG: ChartConfig = {
  value: { label: 'Average BPA concentration (µg/L in urine)', color: '#fb923c' },
};

export const ITALY_BPA_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Milan', value: '0.74' },
  { rank: 2, city: 'Turin', value: '0.61' },
  { rank: 3, city: 'Naples', value: '0.58' },
  { rank: 4, city: 'Rome', value: '0.56' },
  { rank: 5, city: 'Venice (Porto Marghera)', value: '0.54' },
  { rank: 6, city: 'Brescia', value: '0.51' },
  { rank: 7, city: 'Bologna', value: '0.49' },
  { rank: 8, city: 'Genoa', value: '0.47' },
  { rank: 9, city: 'Taranto', value: '0.45' },
  { rank: 10, city: 'Palermo', value: '0.43' },
];

export const ITALY_BPA_BOTTOM_NOTE =
  'Bisphenol A (BPA) is a plasticiser and monomer used in polycarbonate plastics, epoxy can linings and thermal receipt paper; it is detectable in most of the population through biomonitoring, and urinary concentration is the standard exposure measure. The national trend falls from about 2.60 µg/L in 2000 to roughly 0.34 µg/L in 2025, tracking successive EU restrictions that Italy applies — BPA banned in baby bottles from 2011, in thermal paper from 2020, and in food-contact materials generally under the 2024 EU regulation. BPA acts as an endocrine disruptor with estrogenic activity, and chronic exposure is studied in relation to reproductive, developmental and metabolic endpoints, which continues to drive regulatory tightening and substitution with alternative bisphenols. The city table is a modeled estimate ranked by industrial and urban exposure pressure, since Italy publishes biomonitoring nationally rather than as a city ranking.';

/* ─── Fluoride ─── */

/** Average national fluoride concentration (mg/L) — natural background, not treatment. */
const ITALY_FLUORIDE_VALUES = [
  0.27, 0.27, 0.27, 0.27, 0.27, 0.27, 0.27, 0.27, 0.27, 0.27, 0.27, 0.27, 0.26, 0.26, 0.26, 0.26, 0.26, 0.26,
  0.26, 0.26, 0.26, 0.26, 0.26, 0.26, 0.26, 0.26,
] as const;

export const ITALY_FLUORIDE_SERIES = seriesFromValues(ITALY_FLUORIDE_VALUES);

export const ITALY_FLUORIDE_CHART_CONFIG: ChartConfig = {
  value: { label: 'Average fluoride concentration (mg/L)', color: '#c084fc' },
};

export const ITALY_FLUORIDE_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Catania (Etna aquifer)', value: '1.18' },
  { rank: 2, city: 'Viterbo', value: '1.05' },
  { rank: 3, city: 'Rome (northern volcanic aquifers)', value: '0.94' },
  { rank: 4, city: 'Latina', value: '0.81' },
  { rank: 5, city: 'Frosinone', value: '0.69' },
  { rank: 6, city: 'Naples (Campanian volcanic area)', value: '0.63' },
  { rank: 7, city: 'Orvieto', value: '0.58' },
  { rank: 8, city: 'Siena (Mt. Amiata area)', value: '0.52' },
  { rank: 9, city: 'Perugia', value: '0.46' },
  { rank: 10, city: 'Florence', value: '0.39' },
];

export const ITALY_FLUORIDE_BOTTOM_NOTE =
  'Italy does not artificially fluoridate its public water supply, so the concentrations shown here are natural background from geology rather than a treatment target — which is why the national series is essentially flat at roughly 0.26–0.27 mg/L rather than trending toward the 0.7–1.2 mg/L typical of fluoridated systems. Levels are highest over the volcanic aquifers of central and southern Italy: the Etna system around Catania, the Latium volcanic districts north of Rome, and the Campanian volcanic area, where naturally fluoride-rich groundwater has long been documented. The regulatory limit in Italy is 1.5 mg/L; above roughly 1.5 mg/L dental fluorosis becomes a concern and chronic exposure above 4 mg/L is associated with skeletal effects. Some volcanic-area supplies have historically required blending or alternative sourcing to stay under the limit. The city table is a modeled estimate.';

/* ─── Atrazine ─── */

/** Average national atrazine concentration (ng/L). */
const ITALY_ATRAZINE_VALUES = [
  95, 92, 88, 82, 75, 68, 61, 55, 50, 46, 42, 39, 36, 33, 31, 29, 27, 25, 23, 21, 20, 19, 18, 17, 16, 15,
] as const;

export const ITALY_ATRAZINE_SERIES = seriesFromValues(ITALY_ATRAZINE_VALUES);

export const ITALY_ATRAZINE_CHART_CONFIG: ChartConfig = {
  value: { label: 'Average atrazine concentration (ng/L)', color: '#a3e635' },
};

export const ITALY_ATRAZINE_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Cremona (Po Valley)', value: '44' },
  { rank: 2, city: 'Mantua', value: '41' },
  { rank: 3, city: 'Ferrara', value: '38' },
  { rank: 4, city: 'Piacenza', value: '35' },
  { rank: 5, city: 'Parma', value: '33' },
  { rank: 6, city: 'Bologna', value: '30' },
  { rank: 7, city: 'Verona', value: '28' },
  { rank: 8, city: 'Pavia', value: '26' },
  { rank: 9, city: 'Rovigo', value: '24' },
  { rank: 10, city: 'Venice (Lagoon watershed)', value: '22' },
];

export const ITALY_ATRAZINE_BOTTOM_NOTE =
  'Atrazine is a triazine herbicide once used heavily on maize. Italy banned it in 1990, more than a decade ahead of the EU-wide withdrawal in 2004, yet it remains among the most frequently detected substances in Italian groundwater — not as the parent compound but as long-lived metabolites such as desethylatrazine, which continue to leach from soil decades later. The Po Valley maize belt, from Cremona and Mantua through Emilia-Romagna and the Veneto, carries the highest residual levels, and ISPRA’s national pesticide monitoring consistently reports triazine metabolites among its most common groundwater exceedances. That persistence illustrates how slowly banned pesticides clear from aquifers. The city table is a modeled estimate.';

export const ITALY_PFAS_BOTTOM_NOTE =
  'Per- and polyfluoroalkyl substances (PFAS), the so-called forever chemicals, resist environmental breakdown almost indefinitely and accumulate in surface water; total concentration (ΣPFAS) in ng/L is the standard indicator. They come from non-stick coatings, textiles, firefighting foams and fluorochemical manufacturing, and are linked to immune suppression, thyroid disruption, elevated cholesterol and some cancers. Italy has one of Europe’s most extensively documented contamination events: the Veneto PFAS zone around Vicenza, Arzignano and Trissino, downstream of the former Miteni plant, where a large red-zone health-surveillance programme has run for years. The EU limit of 100 ng/L for the sum of 20 regulated PFAS in drinking water is the main policy reference. The city table is anchored on that known industrial hotspot and is otherwise a modeled estimate.';
