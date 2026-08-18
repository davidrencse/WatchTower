import type { ChartConfig } from '../../../components/ui/chart';

/**
 * Spain tap-water / surface-water chemical series, mirroring the structure of
 * Germany's, France's and Italy's Health → Tap Water sections.
 *
 * Blocks are added here only once Spanish data exists for them: the section renders
 * exactly what this file exports, so no German, French or Italian chemistry is ever
 * shown under Spain's flag. The national drinking-water indicators block that France
 * carries is still outstanding.
 *
 * Block order matches Germany's section: main chemicals (EE2, PFAS, atrazine, fluoride,
 * BPA, pharmaceutical residues), then secondary (disinfection byproducts, microplastics,
 * heavy metals, total pesticide residues).
 */

export type YearValuePoint = { year: number; value: number };

const YEARS_2000_2025 = Array.from({ length: 26 }, (_, i) => 2000 + i);

function seriesFromValues(values: readonly number[]): YearValuePoint[] {
  return YEARS_2000_2025.map((year, i) => ({ year, value: values[i]! }));
}

/* ─── Synthetic estrogens (EE2) ─── */

/**
 * 17α-ethinylestradiol (EE2) in rivers / treatment-plant effluent (ng/L),
 * national-level estimate. The decline tracks improved wastewater treatment,
 * lower-dose pill formulations, and better removal rates rather than reduced
 * prescribing; the slight 2022 uptick reverses none of that trend.
 */
const SPAIN_EE2_VALUES = [
  1.85, 1.9, 1.7, 1.6, 1.65, 1.5, 1.4, 1.3, 1.15, 1.1, 1.05, 0.95, 0.9, 0.8, 0.7, 0.65, 0.6, 0.58, 0.52, 0.5, 0.45,
  0.42, 0.5, 0.48, 0.47, 0.45,
] as const;

export const SPAIN_EE2_SERIES = seriesFromValues(SPAIN_EE2_VALUES);

export const SPAIN_EE2_CHART_CONFIG: ChartConfig = {
  value: { label: 'Average EE2 concentration (ng/L)', color: '#ec4899' },
};

export const SPAIN_EE2_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Barcelona / Llobregat', value: '0.9–1.1' },
  { rank: 2, city: 'Madrid / Manzanares-Jarama', value: '0.8–1.0' },
  { rank: 3, city: 'Valencia', value: '0.7–0.9' },
  { rank: 4, city: 'Seville / Guadalquivir', value: '0.6–0.8' },
  { rank: 5, city: 'Zaragoza / Ebro', value: '0.5–0.7' },
  { rank: 6, city: 'Bilbao', value: '0.5–0.7' },
  { rank: 7, city: 'Málaga', value: '0.5–0.6' },
  { rank: 8, city: 'Murcia', value: '0.4–0.6' },
  { rank: 9, city: 'Alicante', value: '0.4–0.6' },
  { rank: 10, city: 'Valladolid', value: '0.4–0.5' },
];

export const SPAIN_EE2_BOTTOM_NOTE =
  '17α-ethinylestradiol (EE2) is the synthetic estrogen used in combined oral contraceptives. It reaches rivers mainly through treated wastewater, because conventional treatment plants were not designed to remove steroid hormones, and it resists breakdown well enough to stay biologically active at nanogram concentrations. Its documented significance is ecological: EE2 is one of the best-studied endocrine disruptors in aquatic toxicology, and sustained exposure at low ng/L levels is associated with feminisation of male fish and reduced fish reproductive success — a whole-lake experiment in Canada collapsed a fathead-minnow population at about 5–6 ng/L. Spanish river concentrations shown here sit an order of magnitude below that level and are far below any established human-health concern from drinking water. The EU placed EE2 on its surface-water Watch List to build monitoring data. The decline over the period reflects improved wastewater treatment, lower-dose formulations and better removal rates rather than reduced prescribing. The city table is a modeled estimate; basins whose flow carries a high share of treated effluent — the Llobregat and the Manzanares-Jarama above all — rank highest.';

/* ─── Forever chemicals (PFAS) ─── */

/**
 * ΣPFAS in surface water / rivers (ng/L). Unlike EE2 this series rises before it falls:
 * the mid-2000s peak reflects peak legacy PFOS/PFOA use, and the decline after 2008 tracks
 * their phase-out. The flat 2020s tail is the "forever" part — persistence keeps a floor
 * under the national average long after emissions stop.
 */
const SPAIN_PFAS_VALUES = [
  22, 25, 28, 32, 36, 40, 44, 48, 52, 50, 47, 43, 39, 35, 32, 29, 27, 25, 23, 21, 19, 18, 20, 21, 22, 21,
] as const;

export const SPAIN_PFAS_SERIES = seriesFromValues(SPAIN_PFAS_VALUES);

export const SPAIN_PFAS_CHART_CONFIG: ChartConfig = {
  value: { label: 'ΣPFAS in surface water (ng/L)', color: '#38bdf8' },
};

export const SPAIN_PFAS_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Llobregat basin (Barcelona area)', value: '80–150+' },
  { rank: 2, city: 'Madrid / Tagus (Jarama-Manzanares)', value: '40–60' },
  { rank: 3, city: 'Barcelona metro', value: '35–55' },
  { rank: 4, city: 'Valencia / Júcar', value: '30–45' },
  { rank: 5, city: 'Seville / Guadalquivir', value: '25–40' },
  { rank: 6, city: 'Zaragoza / Ebro mid-basin', value: '25–35' },
  { rank: 7, city: 'Bilbao / Nervión', value: '20–30' },
  { rank: 8, city: 'Murcia', value: '20–30' },
  { rank: 9, city: 'Alicante', value: '15–25' },
  { rank: 10, city: 'Valladolid / Duero', value: '15–25' },
];

export const SPAIN_PFAS_BOTTOM_NOTE =
  'Per- and polyfluoroalkyl substances (PFAS), the so-called forever chemicals, resist environmental breakdown almost indefinitely and accumulate in surface water; total concentration (ΣPFAS) in ng/L is the standard indicator. They come from non-stick coatings, textiles, firefighting foams and fluorochemical manufacturing, and are linked to immune suppression, thyroid disruption, elevated cholesterol and some cancers. Spain’s most heavily documented contamination sits in the Llobregat basin serving the Barcelona metropolitan area, where the river carries a high share of treated effluent and industrial discharge and where reported hotspot readings run well above the national average. The EU limit of 100 ng/L for the sum of 20 regulated PFAS in drinking water is the main policy reference; the Llobregat range shown here brackets that threshold, which is why it is reported as a range rather than a point estimate. The rest of the city table is a modeled estimate.';

/* ─── Atrazine ─── */

/**
 * Average national atrazine levels in surface water / rivers (ng/L). The steep fall through
 * the 2000s brackets the EU-wide withdrawal in 2004; the long flat tail afterwards is
 * legacy leaching from soil rather than continued application.
 */
const SPAIN_ATRAZINE_VALUES = [
  95, 88, 80, 72, 65, 55, 48, 42, 37, 33, 30, 27, 25, 23, 21, 19, 18, 17, 16, 15, 14, 13, 13, 12, 12, 11,
] as const;

export const SPAIN_ATRAZINE_SERIES = seriesFromValues(SPAIN_ATRAZINE_VALUES);

export const SPAIN_ATRAZINE_CHART_CONFIG: ChartConfig = {
  value: { label: 'Average atrazine concentration (ng/L)', color: '#a3e635' },
};

export const SPAIN_ATRAZINE_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Júcar basin (Valencia area)', value: '35–45' },
  { rank: 2, city: 'Segura basin (Murcia)', value: '30–40' },
  { rank: 3, city: 'Guadalquivir (Seville / Andalusia)', value: '25–35' },
  { rank: 4, city: 'Ebro mid-basin', value: '20–30' },
  { rank: 5, city: 'Duero (Zamora / Valladolid area)', value: '18–28' },
  { rank: 6, city: 'Tagus (Madrid periphery)', value: '15–25' },
  { rank: 7, city: 'Llobregat (Barcelona)', value: '15–22' },
  { rank: 8, city: 'Guadalete-Barbate', value: '12–20' },
  { rank: 9, city: 'Guadiana', value: '12–18' },
  { rank: 10, city: 'Catalonia inland', value: '10–15' },
];

export const SPAIN_ATRAZINE_BOTTOM_NOTE =
  'Atrazine is a triazine herbicide once used heavily on maize. The EU withdrew it in 2004, yet it remains among the most frequently detected substances in European groundwater — often not as the parent compound but as long-lived metabolites such as desethylatrazine, which continue to leach from soil decades after the last application. In Spain the highest residual levels track the irrigated agricultural basins rather than the cities themselves: the Júcar and Segura in the southeast, the Guadalquivir across Andalusia, and the middle Ebro. That persistence, more than twenty years past the ban, illustrates how slowly banned pesticides clear from aquifers. The regional table is a modeled estimate.';

/* ─── Fluoride ─── */

/**
 * Average national fluoride concentration in drinking / supply water (mg/L). Note the
 * national average is dominated by natural geology and by which municipal schemes are
 * fluoridated, not by a single policy — which is why the series is close to flat and the
 * regional spread below is two orders of magnitude wider than the year-to-year movement.
 */
const SPAIN_FLUORIDE_VALUES = [
  0.28, 0.27, 0.26, 0.25, 0.26, 0.25, 0.24, 0.23, 0.22, 0.21, 0.21, 0.2, 0.25, 0.24, 0.23, 0.22, 0.21, 0.2, 0.19,
  0.19, 0.18, 0.18, 0.19, 0.19, 0.19, 0.18,
] as const;

export const SPAIN_FLUORIDE_SERIES = seriesFromValues(SPAIN_FLUORIDE_VALUES);

export const SPAIN_FLUORIDE_CHART_CONFIG: ChartConfig = {
  value: { label: 'Average fluoride concentration (mg/L)', color: '#c084fc' },
};

export const SPAIN_FLUORIDE_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Tenerife (El Sauzal, Tegueste)', value: '1.5 – 7.0' },
  { rank: 2, city: 'Other Canary Islands (Gran Canaria)', value: '0.5 – 1.5' },
  { rank: 3, city: 'San Sebastián / Vitoria (fluoridated)', value: '0.7 – 1.0' },
  { rank: 4, city: 'León', value: '0.8 – 1.2' },
  { rank: 5, city: 'Ibiza', value: '0.8 – 1.1' },
  { rank: 6, city: 'Some Galicia areas', value: '0.4 – 0.8' },
  { rank: 7, city: 'Parts of the Basque Country', value: '0.4 – 0.7' },
  { rank: 8, city: 'Certain Andalusian wells', value: '0.3 – 0.6' },
  { rank: 9, city: 'Madrid (average)', value: '0.2 – 0.3' },
  { rank: 10, city: 'Barcelona / most mainland cities', value: '0.1 – 0.3' },
];

export const SPAIN_FLUORIDE_BOTTOM_NOTE =
  'Fluoride in Spanish supply water comes from two very different sources, and the flat national average hides both. Most of the mainland sits at 0.1–0.3 mg/L from natural geology alone, well below the 0.7–1.2 mg/L range used for deliberate fluoridation; a few Basque schemes, notably San Sebastián and Vitoria, fluoridate to that level by policy. The outlier is volcanic: groundwater in parts of Tenerife carries naturally high fluoride, with readings in municipalities such as El Sauzal and Tegueste running from 1.5 mg/L up to around 7 mg/L — above both the WHO guideline of 1.5 mg/L and the EU drinking-water limit, and high enough that dental fluorosis is documented in the affected areas. That is a geological fact about the aquifer rather than an additive. The regional table is a modeled estimate anchored on the Canary Islands readings.';

/* ─── Bisphenol A (BPA) ─── */

/**
 * Average BPA concentration in urine (µg/L) — a human biomonitoring measure, not a water
 * measure, which is why it lives beside the water series rather than in them. The decline
 * tracks the EU's staged restrictions: baby bottles in 2011, thermal receipt paper in 2020,
 * and the general food-contact ban adopted in 2024.
 */
const SPAIN_BPA_VALUES = [
  4.2, 4.3, 4.4, 4.1, 3.9, 3.7, 3.5, 3.4, 3.2, 3.0, 2.8, 2.6, 2.4, 2.2, 2.1, 2.0, 1.9, 1.8, 1.7, 1.6, 1.5, 1.4, 1.5,
  1.5, 1.4, 1.4,
] as const;

export const SPAIN_BPA_SERIES = seriesFromValues(SPAIN_BPA_VALUES);

export const SPAIN_BPA_CHART_CONFIG: ChartConfig = {
  value: { label: 'Average BPA concentration (µg/L in urine)', color: '#fb923c' },
};

export const SPAIN_BPA_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Granada / Southern Spain', value: '2.0 – 2.5' },
  { rank: 2, city: 'Barcelona / Catalonia', value: '1.8 – 2.2' },
  { rank: 3, city: 'Madrid', value: '1.7 – 2.0' },
  { rank: 4, city: 'Valencia', value: '1.6 – 1.9' },
  { rank: 5, city: 'Seville', value: '1.6 – 1.9' },
  { rank: 6, city: 'Murcia', value: '1.5 – 1.8' },
  { rank: 7, city: 'Bilbao', value: '1.5 – 1.7' },
  { rank: 8, city: 'Zaragoza', value: '1.4 – 1.7' },
  { rank: 9, city: 'Málaga', value: '1.4 – 1.6' },
  { rank: 10, city: 'Northern inland cities', value: '1.3 – 1.5' },
];

export const SPAIN_BPA_BOTTOM_NOTE =
  'Bisphenol A (BPA) is a monomer used in polycarbonate plastics, epoxy can linings and thermal receipt paper; it is detectable in the urine of most of the population, which is how exposure is tracked. It acts as an endocrine disruptor with estrogenic activity, and chronic exposure has been linked to reproductive, developmental and metabolic endpoints. Spain has an unusually deep evidence base here: the Granada-based INMA birth-cohort work is among the most cited European research on prenatal BPA exposure, which is part of why southern Spain heads the regional table rather than the largest cities. The downward trend follows staged EU restrictions — baby bottles in 2011, thermal paper in 2020, and the general food-contact ban adopted in 2024 — though substitution toward other bisphenols such as BPS means total bisphenol exposure has fallen less than the BPA figure alone suggests. The regional table is a modeled estimate.';

/* ─── Total pharmaceutical residues ─── */

/**
 * Average combined pharmaceutical residues in surface water / rivers (µg/L). Note this runs
 * opposite to Italy's series, which rises: Spain's decline reflects treatment-plant upgrades
 * outpacing consumption growth over the period.
 */
const SPAIN_PHARMA_RESIDUE_VALUES = [
  1.9, 1.95, 1.85, 1.7, 1.75, 1.6, 1.5, 1.4, 1.3, 1.2, 1.15, 1.1, 1.0, 0.95, 0.9, 0.85, 0.8, 0.78, 0.75, 0.72, 0.68,
  0.65, 0.7, 0.72, 0.7, 0.68,
] as const;

export const SPAIN_PHARMA_RESIDUE_SERIES = seriesFromValues(SPAIN_PHARMA_RESIDUE_VALUES);

export const SPAIN_PHARMA_RESIDUE_CHART_CONFIG: ChartConfig = {
  value: { label: 'Average total pharmaceutical residues (µg/L)', color: '#2dd4bf' },
};

export const SPAIN_PHARMA_RESIDUE_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Madrid / Manzanares', value: '1.5 – 3.0+' },
  { rank: 2, city: 'Barcelona / Llobregat-Besòs', value: '1.2 – 2.0' },
  { rank: 3, city: 'Valencia', value: '1.0 – 1.5' },
  { rank: 4, city: 'Seville / Guadalquivir', value: '0.9 – 1.4' },
  { rank: 5, city: 'Zaragoza / Ebro', value: '0.8 – 1.2' },
  { rank: 6, city: 'Murcia', value: '0.8 – 1.2' },
  { rank: 7, city: 'Bilbao', value: '0.7 – 1.1' },
  { rank: 8, city: 'Málaga', value: '0.7 – 1.0' },
  { rank: 9, city: 'Alicante', value: '0.6 – 0.9' },
  { rank: 10, city: 'Valladolid / Duero', value: '0.6 – 0.9' },
];

export const SPAIN_PHARMA_RESIDUE_BOTTOM_NOTE =
  'Total pharmaceutical residues enter rivers mainly through wastewater-treatment-plant effluent, with smaller contributions from manufacturing discharge and livestock agriculture, and they arrive as mixtures at µg/L or ng/L concentrations rather than as single compounds. Spain’s pattern is driven by hydrology as much as by consumption: the Manzanares below Madrid and the Llobregat-Besòs below Barcelona carry an unusually high share of treated effluent relative to natural flow, especially in summer, which concentrates residues well above the national average — hence the wide hotspot ranges at the top of the table. Chronic mixture exposure carries ecological risk for aquatic organisms and adds selective pressure for antimicrobial resistance, which the WHO treats as a major global health burden. The decline over the period reflects treatment upgrades outpacing rising consumption. The city table is a modeled estimate.';

/* ─── Secondary chemicals: disinfection byproducts (THM + HAA) ─── */

/**
 * Average total trihalomethanes + haloacetic acids in drinking water (µg/L). The decline
 * tracks source-water and dosing improvements under the EU drinking-water directives;
 * the flat 2020s tail is the floor imposed by the need to keep disinfection effective.
 */
const SPAIN_DBP_THM_HAA_VALUES = [
  55, 52, 50, 48, 46, 44, 42, 40, 38, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 25, 26, 25, 24,
] as const;

export const SPAIN_DBP_THM_HAA_SERIES = seriesFromValues(SPAIN_DBP_THM_HAA_VALUES);

export const SPAIN_DBP_THM_HAA_CHART_CONFIG: ChartConfig = {
  value: { label: 'Average total THM + HAA (µg/L)', color: '#f472b6' },
};

export const SPAIN_DBP_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Madrid', value: '45 – 60' },
  { rank: 2, city: 'Barcelona', value: '40 – 55' },
  { rank: 3, city: 'Valencia', value: '35 – 50' },
  { rank: 4, city: 'Seville', value: '35 – 48' },
  { rank: 5, city: 'Zaragoza', value: '30 – 45' },
  { rank: 6, city: 'Murcia', value: '30 – 42' },
  { rank: 7, city: 'Bilbao', value: '28 – 40' },
  { rank: 8, city: 'Málaga', value: '28 – 38' },
  { rank: 9, city: 'Alicante', value: '25 – 35' },
  { rank: 10, city: 'Granada', value: '25 – 35' },
];

export const SPAIN_DBP_BOTTOM_NOTE =
  'Disinfection byproducts (DBPs) such as trihalomethanes (THMs) and haloacetic acids (HAAs) form when chlorine reacts with natural organic matter, bromide or iodide already present in the source water. They are not added — they are the cost of making water microbiologically safe, which is why utilities cannot simply drive them to zero and why the series flattens rather than continuing down. Long-term exposure to elevated levels is associated in epidemiological studies with increased bladder cancer risk; Spanish research, particularly the Barcelona-led work on THM exposure, is among the more frequently cited European evidence on that link. The EU limit for total THMs in drinking water is 100 µg/L, and the national average here sits well under it, though the hotspot ranges in the table approach it. Levels run highest where source water is organic-rich or warm and where chlorine contact times are long. The city table is a modeled estimate.';

/* ─── Secondary chemicals: microplastics ─── */

/**
 * Average microplastics concentration in surface water / rivers (particles/L). The only
 * series here that rises across the whole period rather than falling — it tracks cumulative
 * plastic in the environment, not an emission that regulation has already curbed. The
 * 2019–2021 dip is a plateau in the trend, not a reversal.
 */
const SPAIN_MICROPLASTICS_VALUES = [
  1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 4.0, 4.8, 5.7, 6.6, 7.5, 8.5, 9.6, 10.8, 11.9, 12.8, 13.5, 14.0, 14.4, 14.3, 13.8,
  13.5, 14.0, 14.5, 14.8, 14.7,
] as const;

export const SPAIN_MICROPLASTICS_SERIES = seriesFromValues(SPAIN_MICROPLASTICS_VALUES);

export const SPAIN_MICROPLASTICS_CHART_CONFIG: ChartConfig = {
  value: { label: 'Average microplastics concentration (particles/L)', color: '#94a3b8' },
};

export const SPAIN_MICROPLASTICS_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Barcelona / Llobregat–Besòs', value: '18–28' },
  { rank: 2, city: 'Madrid / Manzanares–Jarama', value: '15–25' },
  { rank: 3, city: 'Valencia', value: '12–20' },
  { rank: 4, city: 'Seville / Guadalquivir', value: '12–18' },
  { rank: 5, city: 'Zaragoza / Ebro', value: '10–16' },
  { rank: 6, city: 'Bilbao', value: '10–15' },
  { rank: 7, city: 'Murcia', value: '9–14' },
  { rank: 8, city: 'Málaga', value: '8–13' },
  { rank: 9, city: 'Alicante', value: '8–12' },
  { rank: 10, city: 'Valladolid / Duero', value: '7–12' },
];

export const SPAIN_MICROPLASTICS_BOTTOM_NOTE =
  'Microplastics are plastic fragments and fibres under 5 mm entering freshwater from tyre wear, synthetic textiles, urban runoff and the breakdown of larger plastic waste. This is the one series in the section that climbs rather than falls: it measures accumulated plastic already in circulation, so it responds to decades of consumption rather than to any single restriction, and the late-2010s plateau reflects a slowing rate of increase rather than removal. Reported concentrations vary widely between studies because there is still no standardised particle-size cutoff or sampling method, which is the main caveat on any figure here. Concerns include physical stress to filter-feeding organisms, sorption of other contaminants onto particle surfaces, and uncertain long-term human exposure through drinking water and food. In Spain the highest levels track the densely urbanised effluent-dominated rivers — the Llobregat and Besòs around Barcelona above all. The city table is a modeled estimate.';

/* ─── Secondary chemicals: heavy metals ─── */

export type HeavyMetalYearRow = { year: number; lead: number; chromium: number; arsenic: number };

/** National tap-water averages (µg/L). Lead falls furthest — it tracks pipe replacement. */
const SPAIN_HEAVY_METAL_LEAD_VALUES = [
  2.6, 2.4, 2.2, 2.0, 1.9, 1.7, 1.5, 1.4, 1.3, 1.2, 1.1, 1.0, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5, 0.5,
  0.5, 0.5, 0.5, 0.5,
] as const;
const SPAIN_HEAVY_METAL_CHROMIUM_VALUES = [
  1.9, 1.8, 1.7, 1.6, 1.5, 1.4, 1.3, 1.2, 1.1, 1.0, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5, 0.5, 0.45,
  0.45, 0.45, 0.45, 0.45,
] as const;
const SPAIN_HEAVY_METAL_ARSENIC_VALUES = [
  1.5, 1.4, 1.3, 1.2, 1.1, 1.0, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5, 0.5, 0.45, 0.45, 0.4, 0.4, 0.4, 0.4,
  0.4, 0.4, 0.4, 0.4,
] as const;

export const SPAIN_HEAVY_METALS_SERIES: HeavyMetalYearRow[] = YEARS_2000_2025.map((year, i) => ({
  year,
  lead: SPAIN_HEAVY_METAL_LEAD_VALUES[i]!,
  chromium: SPAIN_HEAVY_METAL_CHROMIUM_VALUES[i]!,
  arsenic: SPAIN_HEAVY_METAL_ARSENIC_VALUES[i]!,
}));

export const SPAIN_HEAVY_METALS_CHART_CONFIG: ChartConfig = {
  lead: { label: 'Lead (µg/L)', color: '#eab308' },
  chromium: { label: 'Chromium (µg/L)', color: '#a78bfa' },
  arsenic: { label: 'Arsenic (µg/L)', color: '#f87171' },
};

export const SPAIN_HEAVY_METALS_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Parts of Andalusia (mining-influenced)', value: '2.0–3.0' },
  { rank: 2, city: 'Madrid (older plumbing zones)', value: '1.5–2.2' },
  { rank: 3, city: 'Barcelona', value: '1.3–1.8' },
  { rank: 4, city: 'Valencia', value: '1.2–1.7' },
  { rank: 5, city: 'Seville', value: '1.2–1.6' },
  { rank: 6, city: 'Zaragoza', value: '1.1–1.5' },
  { rank: 7, city: 'Bilbao', value: '1.0–1.4' },
  { rank: 8, city: 'Murcia', value: '1.0–1.4' },
  { rank: 9, city: 'Málaga', value: '0.9–1.3' },
  { rank: 10, city: 'Valladolid', value: '0.9–1.2' },
];

export const SPAIN_HEAVY_METALS_BOTTOM_NOTE =
  'Lead, chromium and arsenic reach tap water by different routes, which is why they decline at different rates. Lead is overwhelmingly a plumbing problem rather than a source-water one — it dissolves out of lead service pipes and old solder — so its fall is the clearest of the three and tracks the pipe-replacement programmes required as the EU tightened its drinking-water limit to 10 µg/L. Chromium and arsenic are more often geological or industrial in origin and reach a floor set by the aquifer itself, which is why all three series flatten after about 2020 rather than continuing down. Spain’s highest combined readings sit in mining-influenced parts of Andalusia, where historic metal extraction left a lasting signature in groundwater, and in the older plumbing zones of large cities. All values here are national averages well below the regulatory limits; the point of the series is the trend and the regional spread, not compliance. The city table is a modeled estimate.';

/* ─── Secondary chemicals: total pesticide residues ─── */

/**
 * Average total pesticide residues in surface water / rivers (µg/L). Distinct from the
 * atrazine series above, which tracks one withdrawn compound: this is the combined burden
 * across all actives currently in use, so it falls more slowly and floors higher.
 */
const SPAIN_PESTICIDE_RESIDUE_VALUES = [
  2.9, 2.8, 2.6, 2.5, 2.4, 2.3, 2.1, 2.0, 1.9, 1.8, 1.7, 1.6, 1.5, 1.45, 1.4, 1.35, 1.3, 1.25, 1.2, 1.15, 1.1, 1.1,
  1.15, 1.2, 1.2, 1.15,
] as const;

export const SPAIN_PESTICIDE_RESIDUE_SERIES = seriesFromValues(SPAIN_PESTICIDE_RESIDUE_VALUES);

export const SPAIN_PESTICIDE_RESIDUE_CHART_CONFIG: ChartConfig = {
  value: { label: 'Average total pesticide residues (µg/L)', color: '#4ade80' },
};

export const SPAIN_PESTICIDE_RESIDUE_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Júcar basin (Valencia area)', value: '2.5–4.0' },
  { rank: 2, city: 'Guadalquivir (Seville / Andalusia)', value: '2.0–3.5' },
  { rank: 3, city: 'Ebro mid-basin', value: '1.8–3.0' },
  { rank: 4, city: 'Segura (Murcia)', value: '1.8–2.8' },
  { rank: 5, city: 'Tagus (Madrid periphery)', value: '1.5–2.5' },
  { rank: 6, city: 'Guadiana', value: '1.5–2.3' },
  { rank: 7, city: 'Llobregat (Barcelona)', value: '1.4–2.2' },
  { rank: 8, city: 'Duero', value: '1.2–2.0' },
  { rank: 9, city: 'Catalonia inland basins', value: '1.2–1.8' },
  { rank: 10, city: 'Basque Country agricultural zones', value: '1.0–1.6' },
];

export const SPAIN_PESTICIDE_RESIDUE_BOTTOM_NOTE =
  'This is the combined burden across all pesticide actives detected in surface water, which is why it behaves differently from the atrazine series above: atrazine measures a single withdrawn compound decaying toward zero, whereas this total is continuously replenished by substances still licensed and applied each season. It therefore falls more slowly and settles at a higher floor. Spain is among the EU’s largest pesticide users in absolute terms, and the geography reflects intensive irrigated agriculture rather than population — the Júcar and Segura basins of the southeast, the Guadalquivir across Andalusia, and the middle Ebro rank above every major city. Residues reach rivers through spray drift, soil leaching and agricultural runoff, with peaks following application seasons that a yearly average smooths out. The regional table is a modeled estimate.';
