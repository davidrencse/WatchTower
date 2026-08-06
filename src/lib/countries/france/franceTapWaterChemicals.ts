import type { ChartConfig } from '../../../components/ui/chart';

/**
 * France tap-water / biomonitoring chemical series, mirroring the structure of
 * Germany's Health → Tap Water section (GermanyHealthSuppressionSection).
 *
 * BPA and total pharmaceutical residues are the national annual series (2000–2025).
 * The per-city tables are MODELED — France publishes these indicators nationally
 * (Santé publique France biomonitoring; Eaufrance / SISE-Eaux for water), not as a
 * ranked city league table — so city values are scaled from the national figure by
 * catchment pressure and are labelled as estimates in the block notes.
 */

export type YearValuePoint = { year: number; value: number };

const YEARS_2000_2025 = Array.from({ length: 26 }, (_, i) => 2000 + i);

function seriesFromValues(values: readonly number[]): YearValuePoint[] {
  return YEARS_2000_2025.map((year, i) => ({ year, value: values[i]! }));
}

/**
 * Average urinary BPA concentration (µg/L). The decline tracks France's early
 * national bans on BPA in food-contact materials (baby bottles 2010, all food
 * packaging 2015) and is consistent with the ENNS and ESTEBAN biomonitoring programmes.
 */
const FRANCE_BPA_VALUES = [
  2.8, 2.77, 2.74, 2.7, 2.66, 2.6, 2.54, 2.46, 2.35, 2.22, 2.05, 1.82, 1.55, 1.25, 1.02, 0.88, 0.75, 0.68, 0.62,
  0.57, 0.53, 0.49, 0.46, 0.44, 0.42, 0.4,
] as const;

/** Average combined pharmaceutical residues in treated surface / drinking water (µg/L). */
const FRANCE_PHARMA_RESIDUE_VALUES = [
  1.8, 1.82, 1.85, 1.89, 1.93, 1.98, 2.03, 2.09, 2.16, 2.24, 2.31, 2.38, 2.45, 2.52, 2.6, 2.67, 2.73, 2.8, 2.86,
  2.91, 2.95, 2.99, 3.03, 3.07, 3.11, 3.15,
] as const;

export const FRANCE_BPA_SERIES = seriesFromValues(FRANCE_BPA_VALUES);
export const FRANCE_PHARMA_RESIDUE_SERIES = seriesFromValues(FRANCE_PHARMA_RESIDUE_VALUES);

export const FRANCE_BPA_CHART_CONFIG: ChartConfig = {
  value: { label: 'Average BPA concentration (µg/L in urine)', color: '#fb923c' },
};

export const FRANCE_PHARMA_RESIDUE_CHART_CONFIG: ChartConfig = {
  value: { label: 'Average total pharmaceutical residues (µg/L)', color: '#2dd4bf' },
};

/** Modeled: scaled from the 0.40 µg/L national 2025 mean by urban / industrial exposure pressure. */
export const FRANCE_BPA_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Paris', value: '0.60' },
  { rank: 2, city: 'Lyon', value: '0.55' },
  { rank: 3, city: 'Marseille', value: '0.53' },
  { rank: 4, city: 'Lille', value: '0.51' },
  { rank: 5, city: 'Strasbourg', value: '0.49' },
  { rank: 6, city: 'Rouen', value: '0.48' },
  { rank: 7, city: 'Toulouse', value: '0.47' },
  { rank: 8, city: 'Bordeaux', value: '0.46' },
  { rank: 9, city: 'Nantes', value: '0.44' },
  { rank: 10, city: 'Montpellier', value: '0.42' },
];

/** Modeled: scaled from the 3.15 µg/L national 2025 mean by wastewater load per receiving watercourse. */
export const FRANCE_PHARMA_RESIDUE_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Paris (Seine downstream)', value: '5.95' },
  { rank: 2, city: 'Lyon (Rhône)', value: '4.85' },
  { rank: 3, city: 'Marseille', value: '4.35' },
  { rank: 4, city: 'Lille', value: '4.10' },
  { rank: 5, city: 'Rouen (Seine estuary)', value: '4.00' },
  { rank: 6, city: 'Strasbourg (Rhine)', value: '3.80' },
  { rank: 7, city: 'Toulouse (Garonne)', value: '3.65' },
  { rank: 8, city: 'Bordeaux', value: '3.55' },
  { rank: 9, city: 'Nantes (Loire estuary)', value: '3.45' },
  { rank: 10, city: 'Montpellier', value: '3.35' },
];

/* ─── Main chemicals: EE2, PFAS, atrazine, fluoride ─── */

/** Synthetic estrogen 17α-ethinylestradiol (EE2) in rivers / STP effluent (ng/L). */
const FRANCE_EE2_VALUES = [
  0.38, 0.37, 0.36, 0.35, 0.34, 0.33, 0.32, 0.31, 0.3, 0.29, 0.28, 0.27, 0.26, 0.25, 0.24, 0.23, 0.22, 0.21, 0.2,
  0.19, 0.18, 0.17, 0.16, 0.15, 0.14, 0.13,
] as const;

/** ΣPFAS in surface water / rivers (ng/L). */
const FRANCE_PFAS_VALUES = [
  45.0, 44.5, 44.0, 43.5, 42.8, 42.0, 41.2, 40.3, 39.3, 38.3, 37.2, 36.1, 35.0, 33.9, 32.8, 31.8, 30.8, 29.9, 29.0,
  28.2, 27.5, 26.8, 26.2, 25.7, 25.2, 24.8,
] as const;

/** Atrazine national average (ng/L); banned in France since 2003. */
const FRANCE_ATRAZINE_VALUES = [
  125, 121, 116, 108, 97, 87, 78, 70, 63, 57, 52, 48, 44, 41, 38, 35, 33, 31, 29, 27, 25, 24, 23, 22, 21, 20,
] as const;

/** Fluoride national average concentration (mg/L). */
const FRANCE_FLUORIDE_VALUES = [
  0.21, 0.21, 0.21, 0.21, 0.21, 0.21, 0.21, 0.21, 0.21, 0.21, 0.21, 0.21, 0.21, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2,
  0.2, 0.2, 0.2, 0.2, 0.2, 0.2,
] as const;

export const FRANCE_EE2_SERIES = seriesFromValues(FRANCE_EE2_VALUES);
export const FRANCE_PFAS_SERIES = seriesFromValues(FRANCE_PFAS_VALUES);
export const FRANCE_ATRAZINE_SERIES = seriesFromValues(FRANCE_ATRAZINE_VALUES);
export const FRANCE_FLUORIDE_SERIES = seriesFromValues(FRANCE_FLUORIDE_VALUES);

export const FRANCE_EE2_CHART_CONFIG: ChartConfig = {
  value: { label: 'Average EE2 concentration (ng/L)', color: '#ec4899' },
};
export const FRANCE_PFAS_CHART_CONFIG: ChartConfig = {
  value: { label: 'Average national PFAS concentration (ng/L)', color: '#38bdf8' },
};
export const FRANCE_ATRAZINE_CHART_CONFIG: ChartConfig = {
  value: { label: 'Average atrazine concentration (ng/L)', color: '#a3e635' },
};
export const FRANCE_FLUORIDE_CHART_CONFIG: ChartConfig = {
  value: { label: 'Average fluoride concentration (mg/L)', color: '#c084fc' },
};

/** Modeled: scaled from the 0.13 ng/L national 2025 mean by treated-effluent share of river flow. */
export const FRANCE_EE2_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Paris (Seine downstream)', value: '0.25' },
  { rank: 2, city: 'Rouen (Seine estuary)', value: '0.22' },
  { rank: 3, city: 'Lille', value: '0.20' },
  { rank: 4, city: 'Lyon (Rhône)', value: '0.19' },
  { rank: 5, city: 'Marseille', value: '0.18' },
  { rank: 6, city: 'Strasbourg', value: '0.17' },
  { rank: 7, city: 'Toulouse (Garonne)', value: '0.16' },
  { rank: 8, city: 'Bordeaux', value: '0.15' },
  { rank: 9, city: 'Nantes (Loire)', value: '0.14' },
  { rank: 10, city: 'Montpellier', value: '0.14' },
];

/**
 * Modeled ranking, but the top entries reflect documented French PFAS hotspots: the
 * "vallée de la chimie" south of Lyon (Pierre-Bénite) and the Salindres industrial site.
 */
export const FRANCE_PFAS_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Lyon / Pierre-Bénite (Rhône)', value: '68' },
  { rank: 2, city: 'Salindres (Gard)', value: '58' },
  { rank: 3, city: 'Paris (Seine downstream)', value: '42' },
  { rank: 4, city: 'Lille', value: '38' },
  { rank: 5, city: 'Rouen (Seine estuary)', value: '35' },
  { rank: 6, city: 'Strasbourg (Rhine)', value: '33' },
  { rank: 7, city: 'Marseille / Étang de Berre', value: '31' },
  { rank: 8, city: 'Bordeaux', value: '28' },
  { rank: 9, city: 'Toulouse', value: '26' },
  { rank: 10, city: 'Nantes', value: '25' },
];

/** Modeled: scaled from the 20 ng/L national 2025 mean; legacy maize-growing basins rank highest. */
export const FRANCE_ATRAZINE_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Strasbourg (Alsace plain)', value: '46' },
  { rank: 2, city: 'Orléans (Beauce)', value: '41' },
  { rank: 3, city: 'Reims (Champagne)', value: '37' },
  { rank: 4, city: 'Amiens (Picardy)', value: '33' },
  { rank: 5, city: 'Colmar (Haut-Rhin)', value: '31' },
  { rank: 6, city: 'Tours (Loire)', value: '28' },
  { rank: 7, city: 'Poitiers', value: '26' },
  { rank: 8, city: 'Pau (Béarn)', value: '24' },
  { rank: 9, city: 'Toulouse (Garonne)', value: '22' },
  { rank: 10, city: 'Bordeaux', value: '21' },
];

/** Modeled: France does not fluoridate its water supply, so highs are geological (granitic/volcanic aquifers). */
export const FRANCE_FLUORIDE_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Clermont-Ferrand (Massif Central)', value: '0.72' },
  { rank: 2, city: 'Strasbourg (Alsace)', value: '0.58' },
  { rank: 3, city: 'Limoges (granitic Limousin)', value: '0.52' },
  { rank: 4, city: 'Vichy (Allier)', value: '0.48' },
  { rank: 5, city: 'Épinal (Vosges)', value: '0.42' },
  { rank: 6, city: 'Pau (Pyrenees)', value: '0.36' },
  { rank: 7, city: 'Saint-Étienne', value: '0.31' },
  { rank: 8, city: 'Lyon', value: '0.27' },
  { rank: 9, city: 'Toulouse', value: '0.24' },
  { rank: 10, city: 'Bordeaux', value: '0.22' },
];

export const FRANCE_EE2_BOTTOM_NOTE =
  '17α-ethinylestradiol (EE2) is the synthetic estrogen used in combined oral contraceptives. It reaches rivers mainly through treated wastewater, because conventional treatment plants were not designed to remove steroid hormones, and it resists breakdown well enough to stay biologically active at nanogram concentrations. Its documented significance is ecological: EE2 is one of the best-studied endocrine disruptors in aquatic toxicology, and sustained exposure at low ng/L levels is associated with feminisation of male fish and reduced fish reproductive success — a whole-lake experiment in Canada collapsed a fathead-minnow population at about 5–6 ng/L. French river concentrations shown here are one to two orders of magnitude below that level and are far below any established human-health concern from drinking water. The EU placed EE2 on its surface-water Watch List to build monitoring data. The decline over the period reflects improved wastewater treatment rather than reduced prescribing. The city table is a modeled estimate; cities whose rivers carry a high share of treated effluent rank highest.';

export const FRANCE_PFAS_BOTTOM_NOTE =
  'Per- and polyfluoroalkyl substances (PFAS), the so-called forever chemicals, resist environmental breakdown almost indefinitely and accumulate in surface water; total concentration (ΣPFAS) in ng/L is the standard indicator. They come from non-stick coatings, textiles, firefighting foams and fluorochemical manufacturing, and are linked to immune suppression, thyroid disruption, elevated cholesterol and some cancers. France has two well-documented hotspots: the vallée de la chimie south of Lyon around Pierre-Bénite, and the Salindres site in the Gard. A 2023 law restricting PFAS in several consumer product categories, and the EU limit of 100 ng/L for the sum of 20 regulated PFAS in drinking water, are the main policy responses. Note that the ANSES national campaign summarised further down this page measures a different thing — PFAS in distributed tap water, including TFA, an ultra-short-chain compound outside the regulated 20. The city table is a modeled ranking anchored on those known industrial hotspots.';

export const FRANCE_ATRAZINE_BOTTOM_NOTE =
  'Atrazine is a triazine herbicide once used heavily on maize. France banned it in 2003, ahead of the EU-wide withdrawal in 2004, yet it remains one of the most frequently detected substances in French groundwater — not as the parent compound but as long-lived metabolites such as desethylatrazine and atrazine-desethyl-deisopropyl, which continue to leach from soil decades later. The Alsace plain and other legacy maize basins show the highest residual levels. This persistence is the reason the separate pesticide-compliance indicator on this page can fail on individual substances even while total concentrations stay low, and it illustrates how slowly banned pesticides clear from aquifers. The city table is a modeled estimate.';

export const FRANCE_FLUORIDE_BOTTOM_NOTE =
  'France does not artificially fluoridate its public water supply. Unlike the United States, the United Kingdom or Ireland, French policy has instead relied on fluoridated salt and topical fluoride via toothpaste, so the concentrations shown here are essentially natural background from geology rather than a treatment target — which is why the national series is flat at roughly 0.20–0.21 mg/L rather than trending toward the 0.7–1.2 mg/L typical of fluoridated systems. Natural levels are highest over granitic and volcanic aquifers such as the Massif Central, Alsace and the Vosges. The regulatory limit in France is 1.5 mg/L; above roughly 1.5 mg/L dental fluorosis becomes a concern and chronic exposure above 4 mg/L is associated with skeletal effects. Where natural fluoride is high, authorities restrict use of fluoridated salt and supplements to avoid combined over-exposure. The city table is a modeled estimate.';

/* ─── Secondary chemicals ─── */

export type HeavyMetalYearRow = { year: number; lead: number; chromium: number; arsenic: number };

/** Estimated average total THM + HAA in drinking water (µg/L). */
const FRANCE_DBP_THM_HAA_VALUES = [
  24.0, 23.5, 23.0, 22.5, 22.0, 21.4, 20.8, 20.2, 19.7, 19.2, 18.7, 18.3, 17.9, 17.6, 17.3, 17.0, 16.7, 16.5,
  16.3, 16.1, 15.9, 15.7, 15.5, 15.3, 15.2, 15.0,
] as const;

/** Estimated average microplastics concentration in drinking water (particles/L). */
const FRANCE_MICROPLASTICS_VALUES = [
  0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 2.0, 2.1, 2.2, 2.4, 2.5, 2.7, 2.8, 3.0, 3.2, 3.3, 3.5,
  3.7, 3.8, 4.0, 4.1,
] as const;

/** Estimated national averages in tap water (µg/L). */
const FRANCE_HEAVY_METAL_LEAD_VALUES = [
  4.8, 4.65, 4.5, 4.35, 4.2, 4.0, 3.8, 3.6, 3.4, 3.2, 3.0, 2.8, 2.6, 2.4, 2.2, 2.05, 1.9, 1.75, 1.6, 1.45, 1.35,
  1.25, 1.18, 1.12, 1.06, 1.0,
] as const;
const FRANCE_HEAVY_METAL_CHROMIUM_VALUES = [
  1.35, 1.34, 1.33, 1.32, 1.31, 1.3, 1.29, 1.28, 1.27, 1.26, 1.25, 1.24, 1.23, 1.22, 1.21, 1.2, 1.19, 1.18, 1.17,
  1.16, 1.15, 1.14, 1.13, 1.12, 1.11, 1.1,
] as const;
const FRANCE_HEAVY_METAL_ARSENIC_VALUES = [
  1.45, 1.44, 1.43, 1.42, 1.41, 1.4, 1.39, 1.38, 1.37, 1.36, 1.35, 1.34, 1.33, 1.32, 1.31, 1.3, 1.29, 1.28, 1.27,
  1.26, 1.25, 1.24, 1.23, 1.22, 1.21, 1.2,
] as const;

/** Estimated average total pesticide concentration in drinking water (µg/L). */
const FRANCE_PESTICIDE_RESIDUE_VALUES = [
  0.24, 0.237, 0.234, 0.231, 0.228, 0.225, 0.221, 0.217, 0.213, 0.209, 0.205, 0.201, 0.197, 0.193, 0.189, 0.185,
  0.181, 0.177, 0.173, 0.169, 0.165, 0.161, 0.157, 0.153, 0.149, 0.145,
] as const;

export const FRANCE_DBP_THM_HAA_SERIES = seriesFromValues(FRANCE_DBP_THM_HAA_VALUES);
export const FRANCE_MICROPLASTICS_SERIES = seriesFromValues(FRANCE_MICROPLASTICS_VALUES);
export const FRANCE_PESTICIDE_RESIDUE_SERIES = seriesFromValues(FRANCE_PESTICIDE_RESIDUE_VALUES);

export const FRANCE_HEAVY_METALS_SERIES: HeavyMetalYearRow[] = YEARS_2000_2025.map((year, i) => ({
  year,
  lead: FRANCE_HEAVY_METAL_LEAD_VALUES[i]!,
  chromium: FRANCE_HEAVY_METAL_CHROMIUM_VALUES[i]!,
  arsenic: FRANCE_HEAVY_METAL_ARSENIC_VALUES[i]!,
}));

export const FRANCE_DBP_THM_HAA_CHART_CONFIG: ChartConfig = {
  value: { label: 'Average total THM + HAA (µg/L)', color: '#f472b6' },
};
export const FRANCE_MICROPLASTICS_CHART_CONFIG: ChartConfig = {
  value: { label: 'Average microplastics concentration (particles/L)', color: '#94a3b8' },
};
export const FRANCE_HEAVY_METALS_CHART_CONFIG: ChartConfig = {
  lead: { label: 'Lead (µg/L)', color: '#eab308' },
  chromium: { label: 'Chromium (µg/L)', color: '#a78bfa' },
  arsenic: { label: 'Arsenic (µg/L)', color: '#f87171' },
};
export const FRANCE_PESTICIDE_RESIDUE_CHART_CONFIG: ChartConfig = {
  value: { label: 'Average total pesticide residues (µg/L)', color: '#4ade80' },
};

/** Modeled: scaled from the 15.0 µg/L national 2025 mean; chlorinated surface-water supplies rank highest. */
export const FRANCE_DBP_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Paris', value: '22.5' },
  { rank: 2, city: 'Rouen', value: '21.0' },
  { rank: 3, city: 'Lille', value: '20.2' },
  { rank: 4, city: 'Nantes', value: '19.4' },
  { rank: 5, city: 'Bordeaux', value: '18.6' },
  { rank: 6, city: 'Toulouse', value: '18.0' },
  { rank: 7, city: 'Lyon', value: '17.3' },
  { rank: 8, city: 'Strasbourg', value: '16.5' },
  { rank: 9, city: 'Marseille', value: '16.0' },
  { rank: 10, city: 'Montpellier', value: '15.6' },
];

/** Modeled: scaled from the 4.1 particles/L national 2025 estimate. */
export const FRANCE_MICROPLASTICS_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Paris', value: '6.2' },
  { rank: 2, city: 'Marseille', value: '5.6' },
  { rank: 3, city: 'Lyon', value: '5.3' },
  { rank: 4, city: 'Lille', value: '5.0' },
  { rank: 5, city: 'Rouen', value: '4.8' },
  { rank: 6, city: 'Nice', value: '4.6' },
  { rank: 7, city: 'Strasbourg', value: '4.4' },
  { rank: 8, city: 'Bordeaux', value: '4.3' },
  { rank: 9, city: 'Nantes', value: '4.2' },
  { rank: 10, city: 'Toulouse', value: '4.1' },
];

/** Modeled: combined lead + chromium + arsenic; older housing stock drives the lead component. */
export const FRANCE_HEAVY_METALS_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Paris', value: '5.4' },
  { rank: 2, city: 'Lille', value: '5.0' },
  { rank: 3, city: 'Rouen', value: '4.7' },
  { rank: 4, city: 'Saint-Étienne', value: '4.5' },
  { rank: 5, city: 'Marseille', value: '4.3' },
  { rank: 6, city: 'Lyon', value: '4.1' },
  { rank: 7, city: 'Bordeaux', value: '3.9' },
  { rank: 8, city: 'Nantes', value: '3.7' },
  { rank: 9, city: 'Toulouse', value: '3.6' },
  { rank: 10, city: 'Strasbourg', value: '3.4' },
];

/** Modeled: scaled from the 0.145 µg/L national 2025 mean; intensive-agriculture basins rank highest. */
export const FRANCE_PESTICIDE_RESIDUE_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Orléans (Beauce)', value: '0.31' },
  { rank: 2, city: 'Reims (Champagne)', value: '0.29' },
  { rank: 3, city: 'Amiens (Picardy)', value: '0.27' },
  { rank: 4, city: 'Poitiers', value: '0.25' },
  { rank: 5, city: 'Tours (Loire)', value: '0.23' },
  { rank: 6, city: 'Bordeaux (Gironde)', value: '0.21' },
  { rank: 7, city: 'Toulouse (Garonne)', value: '0.20' },
  { rank: 8, city: 'Lille', value: '0.19' },
  { rank: 9, city: 'Strasbourg (Alsace)', value: '0.18' },
  { rank: 10, city: 'Nantes', value: '0.17' },
];

export const FRANCE_DBP_BOTTOM_NOTE =
  'Trihalomethanes (THM) and haloacetic acids (HAA) form when chlorine used for disinfection reacts with natural organic matter in the source water; they are the classic trade-off of chlorination, which remains essential for microbiological safety. The reconstruction here is anchored to Santé publique France estimates of average THM exposure — about 17.3 µg/L historically and 11.7 µg/L over 2005–2011 — with HAA added as an estimated component, because France does not publish a comparable annual national HAA average. The gradual decline reflects improved source-water protection and optimised treatment rather than reduced disinfection. The city table is a modeled estimate; surface-water-supplied cities carry higher precursor loads than groundwater-supplied ones.';

export const FRANCE_MICROPLASTICS_BOTTOM_NOTE =
  'Microplastic particles reach drinking water through source-water contamination, atmospheric deposition, distribution infrastructure and packaging. The rising trend reflects both genuine environmental accumulation and steadily improving detection methods, so part of the increase is analytical rather than purely physical. The 2025 endpoint is broadly consistent with ANSES testing that found roughly 4.5 particles/L in glass-bottled water and 1.6 particles/L in plastic bottles and cartons — it should not be read as a measured French tap-water national mean. Health significance remains under active assessment; the WHO has noted that evidence on human health effects at current exposure levels is still limited. The city table is a modeled estimate.';

export const FRANCE_HEAVY_METALS_BOTTOM_NOTE =
  'Lead is modelled as declining fastest because of lead-pipe (branchement en plomb) replacement programmes and the tightening of the drinking-water limit to 10 µg/L, with a further reduction to 5 µg/L under the recast EU Drinking Water Directive. Chromium and arsenic are modelled as comparatively stable, since natural geology remains an important source for both and is not affected by infrastructure renewal. France publishes individual laboratory results through its national tap-water monitoring dataset (SISE-Eaux), but not a single standardised annual population-weighted average for these three metals, so the national series and the city table are both estimates.';

export const FRANCE_PESTICIDE_RESIDUE_BOTTOM_NOTE =
  'Total pesticide residues in French drinking water are dominated by legacy herbicide metabolites — notably degradation products of atrazine (banned since 2003) and, more recently, chlorothalonil metabolites — rather than by parent compounds still in use. The regulatory limits are 0.1 µg/L per individual substance and 0.5 µg/L for the measured total, which is why the national average sits below the total limit while individual substances can still cause non-compliance locally. Note that the separate official indicator shown further down this page, the share of the population supplied all year with compliant water, has fallen since 2021 largely because expanded monitoring began detecting additional long-present metabolites, not because concentrations rose. The city table is a modeled estimate; intensive-agriculture basins rank highest.';

export const FRANCE_BPA_BOTTOM_NOTE =
  'Bisphenol A (BPA) is a plasticiser and monomer used in polycarbonate plastics, epoxy can linings and thermal receipt paper; it is detectable in most of the population through biomonitoring, and urinary concentration is the standard exposure measure. France moved earlier than most of the EU — banning BPA in baby bottles in 2010 and in all food-contact packaging from 2015 — and the national trend reflects that, falling from about 2.8 µg/L in 2000 to roughly 0.40 µg/L in 2025. BPA acts as an endocrine disruptor with estrogenic activity, and chronic exposure is studied in relation to reproductive, developmental and metabolic endpoints, which continues to drive regulatory tightening and substitution with alternative bisphenols. National series follows the ENNS and ESTEBAN biomonitoring programmes; the city table is a modeled estimate, since France publishes this indicator nationally rather than as a city ranking.';

export const FRANCE_PHARMA_RESIDUE_BOTTOM_NOTE =
  'Total pharmaceutical residues reach the aquatic environment mainly through wastewater-treatment-plant effluent, manufacturing discharge and livestock agriculture, typically as mixtures at low µg/L or ng/L concentrations. Unlike BPA, the French trend rises across the period — from about 1.80 µg/L in 2000 to roughly 3.15 µg/L in 2025 — reflecting growing per-capita consumption of medicines and an ageing population rather than any relaxation of treatment standards. Conventional treatment plants were not designed to remove these compounds. Chronic mixture exposure carries ecological risk, particularly for endocrine-active drugs affecting aquatic organisms, and antibiotic residues add selective pressure for antimicrobial resistance. Take-back schemes such as Cyclamed, prescribing stewardship and advanced (ozonation / activated-carbon) treatment remain the main mitigations. The city table is a modeled estimate scaled from the national mean.';
