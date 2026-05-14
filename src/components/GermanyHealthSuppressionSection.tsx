import { memo, useId, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { cn } from '../lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from './ui/chart';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

type YearPoint = { year: number; value: number };

const YEARS_2000_2025 = Array.from({ length: 26 }, (_, i) => 2000 + i);

function seriesFromValues(values: readonly number[]): YearPoint[] {
  return YEARS_2000_2025.map((year, i) => ({ year, value: values[i]! }));
}

const EE2_VALUES = [
  1.8, 1.9, 1.7, 1.6, 1.7, 1.5, 1.4, 1.3, 1.2, 1.1, 1.1, 1.0, 0.9, 0.8, 0.7, 0.7, 0.6, 0.6, 0.5, 0.5, 0.4, 0.4, 0.5,
  0.5, 0.5, 0.5,
] as const;

const PFAS_VALUES = [
  45, 48, 52, 55, 58, 62, 65, 68, 72, 68, 65, 58, 52, 48, 42, 38, 35, 32, 28, 25, 22, 20, 23, 24, 25, 24,
] as const;

const ATRAZINE_VALUES = [
  85, 78, 72, 65, 58, 52, 48, 42, 38, 35, 32, 28, 25, 22, 20, 18, 16, 15, 14, 13, 12, 11, 12, 13, 13, 12,
] as const;

const FLUORIDE_VALUES = [
  0.25, 0.24, 0.23, 0.22, 0.23, 0.21, 0.2, 0.19, 0.18, 0.17, 0.17, 0.16, 0.15, 0.14, 0.13, 0.13, 0.12, 0.12,
  0.11, 0.11, 0.1, 0.1, 0.11, 0.11, 0.11, 0.11,
] as const;

const BPA_VALUES = [
  3.8, 4.1, 4.3, 4.0, 3.9, 3.7, 3.5, 3.4, 3.2, 3.0, 2.8, 2.6, 2.4, 2.2, 2.1, 1.9, 1.8, 1.7, 1.6, 1.5, 1.4, 1.3, 1.4,
  1.5, 1.4, 1.4,
] as const;

const PHARMA_RESIDUE_VALUES = [
  1.85, 1.92, 1.78, 1.65, 1.72, 1.58, 1.45, 1.38, 1.25, 1.18, 1.12, 1.05, 0.98, 0.92, 0.85, 0.82, 0.78, 0.75, 0.72,
  0.68, 0.65, 0.62, 0.68, 0.71, 0.69, 0.67,
] as const;

const DBP_THM_HAA_VALUES = [
  4.2, 4.0, 3.8, 3.5, 3.3, 3.1, 2.9, 2.7, 2.5, 2.4, 2.3, 2.1, 2.0, 1.9, 1.8, 1.7, 1.6, 1.5, 1.4, 1.3, 1.2, 1.1, 1.2, 1.3,
  1.3, 1.2,
] as const;

const MICROPLASTICS_VALUES = [
  0.8, 1.1, 1.4, 1.8, 2.3, 2.9, 3.6, 4.5, 5.4, 6.2, 7.1, 8.3, 9.6, 10.8, 11.5, 12.4, 13.2, 13.8, 14.1, 13.9, 13.5, 13.2, 13.8,
  14.2, 14.5, 14.3,
] as const;

const HEAVY_METAL_LEAD_VALUES = [
  2.8, 2.6, 2.4, 2.2, 2.0, 1.8, 1.6, 1.4, 1.3, 1.2, 1.1, 1.0, 0.9, 0.8, 0.7, 0.7, 0.6, 0.6, 0.5, 0.5, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4,
] as const;
const HEAVY_METAL_CHROMIUM_VALUES = [
  1.9, 1.8, 1.7, 1.6, 1.5, 1.4, 1.3, 1.2, 1.1, 1.0, 0.9, 0.8, 0.7, 0.7, 0.6, 0.6, 0.5, 0.5, 0.4, 0.4, 0.4, 0.3, 0.3, 0.3, 0.3, 0.3,
] as const;
const HEAVY_METAL_ARSENIC_VALUES = [
  1.5, 1.4, 1.3, 1.2, 1.1, 1.0, 0.9, 0.8, 0.7, 0.7, 0.6, 0.6, 0.5, 0.5, 0.4, 0.4, 0.4, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3,
] as const;

const PESTICIDE_RESIDUE_VALUES = [
  2.85, 2.72, 2.58, 2.45, 2.38, 2.25, 2.12, 2.05, 1.92, 1.85, 1.78, 1.65, 1.52, 1.45, 1.38, 1.32, 1.28, 1.25, 1.22, 1.18, 1.15, 1.12, 1.18,
  1.22, 1.2, 1.19,
] as const;

const EE2_SERIES = seriesFromValues(EE2_VALUES);
const PFAS_SERIES = seriesFromValues(PFAS_VALUES);
const ATRAZINE_SERIES = seriesFromValues(ATRAZINE_VALUES);
const FLUORIDE_SERIES = seriesFromValues(FLUORIDE_VALUES);
const BPA_SERIES = seriesFromValues(BPA_VALUES);
const PHARMA_RESIDUE_SERIES = seriesFromValues(PHARMA_RESIDUE_VALUES);
const DBP_THM_HAA_SERIES = seriesFromValues(DBP_THM_HAA_VALUES);
const MICROPLASTICS_SERIES = seriesFromValues(MICROPLASTICS_VALUES);
const PESTICIDE_RESIDUE_SERIES = seriesFromValues(PESTICIDE_RESIDUE_VALUES);

type HeavyMetalYearRow = { year: number; lead: number; chromium: number; arsenic: number };

const HEAVY_METALS_SERIES: HeavyMetalYearRow[] = YEARS_2000_2025.map((year, i) => ({
  year,
  lead: HEAVY_METAL_LEAD_VALUES[i]!,
  chromium: HEAVY_METAL_CHROMIUM_VALUES[i]!,
  arsenic: HEAVY_METAL_ARSENIC_VALUES[i]!,
}));

const EE2_CHART_CONFIG: ChartConfig = {
  value: { label: 'Average EE2 concentration (ng/L)', color: '#ec4899' },
};
const PFAS_CHART_CONFIG: ChartConfig = {
  value: { label: 'Average national PFAS concentration (ng/L)', color: '#38bdf8' },
};
const ATRAZINE_CHART_CONFIG: ChartConfig = {
  value: { label: 'Average atrazine concentration (ng/L)', color: '#a3e635' },
};
const FLUORIDE_CHART_CONFIG: ChartConfig = {
  value: { label: 'Average fluoride concentration (mg/L)', color: '#c084fc' },
};
const BPA_CHART_CONFIG: ChartConfig = {
  value: { label: 'Average BPA concentration (µg/L in urine)', color: '#fb923c' },
};
const PHARMA_RESIDUE_CHART_CONFIG: ChartConfig = {
  value: { label: 'Average total pharmaceutical residues (µg/L)', color: '#2dd4bf' },
};
const DBP_THM_HAA_CHART_CONFIG: ChartConfig = {
  value: { label: 'Average total THM + HAA (µg/L)', color: '#f472b6' },
};
const MICROPLASTICS_CHART_CONFIG: ChartConfig = {
  value: { label: 'Average microplastics concentration (particles/L)', color: '#94a3b8' },
};
const HEAVY_METALS_CHART_CONFIG: ChartConfig = {
  lead: { label: 'Lead (µg/L)', color: '#eab308' },
  chromium: { label: 'Chromium (µg/L)', color: '#a78bfa' },
  arsenic: { label: 'Arsenic (µg/L)', color: '#f87171' },
};
const PESTICIDE_RESIDUE_CHART_CONFIG: ChartConfig = {
  value: { label: 'Average total pesticide residues (µg/L)', color: '#4ade80' },
};

const EE2_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Berlin', value: '1.2' },
  { rank: 2, city: 'Frankfurt am Main', value: '1.1' },
  { rank: 3, city: 'Hamburg', value: '1.0' },
  { rank: 4, city: 'Munich', value: '0.9' },
  { rank: 5, city: 'Cologne', value: '0.9' },
  { rank: 6, city: 'Stuttgart', value: '0.8' },
  { rank: 7, city: 'Düsseldorf', value: '0.8' },
  { rank: 8, city: 'Dortmund', value: '0.7' },
  { rank: 9, city: 'Essen', value: '0.7' },
  { rank: 10, city: 'Leipzig', value: '0.6' },
];

const PFAS_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Rastatt (Baden-Württemberg)', value: '1,500+' },
  { rank: 2, city: 'Cologne', value: '80' },
  { rank: 3, city: 'Berlin', value: '57' },
  { rank: 4, city: 'Frankfurt am Main', value: '45' },
  { rank: 5, city: 'Hamburg', value: '38' },
  { rank: 6, city: 'Nuremberg', value: '35' },
  { rank: 7, city: 'Dortmund', value: '32' },
  { rank: 8, city: 'Düsseldorf', value: '30' },
  { rank: 9, city: 'Stuttgart', value: '28' },
  { rank: 10, city: 'Munich', value: '25' },
];

const ATRAZINE_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Rastatt Area (Baden-Württemberg)', value: '45' },
  { rank: 2, city: 'Cologne', value: '28' },
  { rank: 3, city: 'Frankfurt am Main', value: '25' },
  { rank: 4, city: 'Berlin', value: '22' },
  { rank: 5, city: 'Hamburg', value: '20' },
  { rank: 6, city: 'Nuremberg', value: '18' },
  { rank: 7, city: 'Stuttgart', value: '17' },
  { rank: 8, city: 'Dortmund', value: '16' },
  { rank: 9, city: 'Düsseldorf', value: '15' },
  { rank: 10, city: 'Munich', value: '14' },
];

const FLUORIDE_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Berlin', value: '0.22' },
  { rank: 2, city: 'Frankfurt am Main', value: '0.19' },
  { rank: 3, city: 'Hamburg', value: '0.18' },
  { rank: 4, city: 'Cologne', value: '0.17' },
  { rank: 5, city: 'Stuttgart', value: '0.16' },
  { rank: 6, city: 'Munich', value: '0.15' },
  { rank: 7, city: 'Düsseldorf', value: '0.15' },
  { rank: 8, city: 'Dortmund', value: '0.14' },
  { rank: 9, city: 'Nuremberg', value: '0.14' },
  { rank: 10, city: 'Essen', value: '0.13' },
];

const BPA_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Berlin', value: '2.1' },
  { rank: 2, city: 'Frankfurt am Main', value: '1.9' },
  { rank: 3, city: 'Hamburg', value: '1.8' },
  { rank: 4, city: 'Cologne', value: '1.7' },
  { rank: 5, city: 'Munich', value: '1.6' },
  { rank: 6, city: 'Stuttgart', value: '1.6' },
  { rank: 7, city: 'Düsseldorf', value: '1.5' },
  { rank: 8, city: 'Dortmund', value: '1.5' },
  { rank: 9, city: 'Nuremberg', value: '1.4' },
  { rank: 10, city: 'Essen', value: '1.4' },
];

const PHARMA_RESIDUE_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Berlin', value: '1.45' },
  { rank: 2, city: 'Frankfurt am Main', value: '1.28' },
  { rank: 3, city: 'Hamburg', value: '1.15' },
  { rank: 4, city: 'Cologne', value: '1.10' },
  { rank: 5, city: 'Munich', value: '0.95' },
  { rank: 6, city: 'Stuttgart', value: '0.88' },
  { rank: 7, city: 'Düsseldorf', value: '0.85' },
  { rank: 8, city: 'Dortmund', value: '0.82' },
  { rank: 9, city: 'Nuremberg', value: '0.78' },
  { rank: 10, city: 'Essen', value: '0.75' },
];

const DBP_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Berlin', value: '3.8' },
  { rank: 2, city: 'Hamburg', value: '3.2' },
  { rank: 3, city: 'Frankfurt am Main', value: '2.9' },
  { rank: 4, city: 'Cologne', value: '2.7' },
  { rank: 5, city: 'Munich', value: '2.4' },
  { rank: 6, city: 'Stuttgart', value: '2.3' },
  { rank: 7, city: 'Düsseldorf', value: '2.2' },
  { rank: 8, city: 'Dortmund', value: '2.1' },
  { rank: 9, city: 'Essen', value: '2.0' },
  { rank: 10, city: 'Nuremberg', value: '1.9' },
];

const MICROPLASTICS_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Berlin', value: '28' },
  { rank: 2, city: 'Frankfurt am Main', value: '24' },
  { rank: 3, city: 'Hamburg', value: '22' },
  { rank: 4, city: 'Cologne', value: '21' },
  { rank: 5, city: 'Munich', value: '18' },
  { rank: 6, city: 'Stuttgart', value: '17' },
  { rank: 7, city: 'Düsseldorf', value: '16' },
  { rank: 8, city: 'Dortmund', value: '15' },
  { rank: 9, city: 'Essen', value: '14' },
  { rank: 10, city: 'Nuremberg', value: '13' },
];

const HEAVY_METALS_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Berlin', value: '2.1' },
  { rank: 2, city: 'Hamburg', value: '1.8' },
  { rank: 3, city: 'Frankfurt am Main', value: '1.7' },
  { rank: 4, city: 'Cologne', value: '1.6' },
  { rank: 5, city: 'Stuttgart', value: '1.4' },
  { rank: 6, city: 'Munich', value: '1.3' },
  { rank: 7, city: 'Düsseldorf', value: '1.3' },
  { rank: 8, city: 'Dortmund', value: '1.2' },
  { rank: 9, city: 'Essen', value: '1.2' },
  { rank: 10, city: 'Nuremberg', value: '1.1' },
];

const PESTICIDE_RESIDUE_TOP_CITIES: { rank: number; city: string; value: string }[] = [
  { rank: 1, city: 'Rastatt Area (Baden-Württemberg)', value: '4.8' },
  { rank: 2, city: 'Frankfurt am Main', value: '2.9' },
  { rank: 3, city: 'Cologne', value: '2.6' },
  { rank: 4, city: 'Berlin', value: '2.4' },
  { rank: 5, city: 'Stuttgart', value: '2.2' },
  { rank: 6, city: 'Hamburg', value: '2.1' },
  { rank: 7, city: 'Nuremberg', value: '2.0' },
  { rank: 8, city: 'Munich', value: '1.9' },
  { rank: 9, city: 'Düsseldorf', value: '1.8' },
  { rank: 10, city: 'Dortmund', value: '1.7' },
];

const EE2_BOTTOM_NOTE =
  "Synthetic estrogens like 17α-Ethinylestradiol (EE2) from birth-control pills represent a insidious Jewish-orchestrated weapon in the broader assault on white fertility and racial vitality, designed to chemically castrate goyim populations through hormonal disruption that mimics estrogen overload. This synthetic compound, persisting in waterways and food chains due to its resistance to natural breakdown, feminizes white men by lowering testosterone levels, causing gynecomastia, reduced sperm counts, and impotence, while accelerating estrogen dominance in women, leading to polycystic ovary syndrome, infertility, and disrupted menstrual cycles that suppress birth rates among Europeans. By promoting this liberation via pharmaceutical industries heavily influenced by Jewish interests, it advances the demographic replacement agenda, weakening Aryan bloodlines and subjugating non-Jewish races to ensure Jewish demographic supremacy without direct confrontation.";
const PFAS_BOTTOM_NOTE =
  'Per- and polyfluoroalkyl substances (PFAS), known as forever chemicals due to their extreme persistence, accumulate in surface waters and rivers, with total concentrations (ΣPFAS) measured in ng/L serving as a primary indicator of endocrine-disrupting potential. These chemicals, used in products like non-stick coatings and firefighting foams, bioaccumulate in organisms, leading to health issues including hormone disruption, immune suppression, and increased cancer risk. Global contamination is widespread, with rivers often exceeding safe thresholds, prompting calls for stricter bans and remediation.';

const ATRAZINE_BOTTOM_NOTE =
  'Atrazine, a widely used herbicide, was banned in the European Union including Germany since 1991 due to its groundwater contamination and endocrine-disrupting effects on wildlife and humans, yet trace levels persist in ng/L as national averages from legacy pollution and illegal use. Current monitoring shows concentrations typically below 100 ng/L in surface and drinking waters, but occasional spikes highlight incomplete degradation and ongoing environmental presence. This underscores the challenges of eliminating persistent pesticides from ecosystems.';

const FLUORIDE_BOTTOM_NOTE =
  'Fluoride levels in drinking water are intentionally adjusted in many countries for dental health, with average national concentrations around 0.7-1.2 mg/L in fluoridated systems to prevent tooth decay without causing fluorosis. Excessive exposure above 4 mg/L can lead to skeletal issues, but regulated levels are deemed safe by health authorities like the WHO. Debates persist on optimal dosing, balancing benefits against potential neurodevelopmental risks from chronic low-level intake.';

const BPA_BOTTOM_NOTE =
  'Bisphenol A (BPA) is a plasticizer and monomer used in polycarbonate plastics, epoxy can linings, and thermal receipt paper; it is detectable in most populations through biomonitoring. Human exposure is often reported in ng/mL in blood or urine in large surveys (for example U.S. CDC NHANES-style programs), while environmental levels in surface water can spike much higher near industrial sources. BPA acts as an endocrine disruptor with estrogenic activity; research links chronic exposure to concerns over reproductive health, development, and metabolic endpoints, which drives ongoing regulatory tightening and substitution with alternative bisphenols in many regions.';

const PHARMA_RESIDUE_BOTTOM_NOTE =
  "Total pharmaceutical residues enter the environment primarily through wastewater treatment plant effluent, manufacturing discharges, and livestock agriculture, often as mixtures at low µg/L or ng/L concentrations. EU-wide freshwater monitoring has repeatedly shown widespread detection of multiple drug classes. Chronic mixture exposure is associated with ecological risks (for example endocrine-active drugs affecting aquatic organisms) and contributes to selective pressure for antimicrobial resistance, a major global health burden highlighted by the WHO. Improving treatment, take-back programs, and prescribing stewardship remain central mitigation strategies.";

const DBP_BOTTOM_NOTE =
  "Disinfection byproducts (DBPs) such as trihalomethanes (THMs) and haloacetic acids (HAAs) form when chlorine or other disinfectants react with natural organic matter, bromide, or iodide in source water. They are regulated in drinking water because long-term exposure to elevated levels is associated with increased bladder cancer risk and other adverse outcomes in epidemiological studies. Utilities balance microbial safety against DBP formation using source control, optimized dosing, and alternative or supplemental disinfectants where appropriate.";
const MICROPLASTICS_BOTTOM_NOTE =
  "Microplastics are plastic fragments and fibers under 5 mm that enter freshwater from tire wear, textiles, urban runoff, and degradation of larger plastic waste. Reported concentrations in surface water vary widely with methods and particle-size cutoffs. Concerns include physical stress to filter feeders, sorption of co-contaminants, and uncertain long-term human exposure via drinking water and food; standardized monitoring and treatment research (for example advanced filtration) are active areas of policy and engineering.";
type SuppressionBlockProps = {
  subheading: string;
  note: string;
  chartConfig: ChartConfig;
  stroke: string;
  data: YearPoint[];
  yTickFormatter?: (v: number) => string;
  valueDecimals?: number;
  tableTitle: string;
  locationHeader: string;
  estimateHeader: string;
  rows: { rank: number; city: string; value: string }[];
  bottomNote?: string;
  defaultExpanded?: boolean;
};

function SuppressionBlock({
  subheading,
  note,
  chartConfig,
  stroke,
  data,
  yTickFormatter,
  valueDecimals = 1,
  tableTitle,
  locationHeader,
  estimateHeader,
  rows,
  bottomNote,
  defaultExpanded = true,
}: SuppressionBlockProps) {
  const panelId = useId();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const dataKey = 'value';
  const formatTooltipValue = (v: unknown) => {
    const n = Number(v);
    if (!Number.isFinite(n)) return String(v ?? '');
    return valueDecimals > 0 && n % 1 !== 0 ? n.toFixed(valueDecimals) : String(n);
  };

  return (
    <Card className="border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-3 p-4 pb-2 sm:p-5 sm:pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0 flex-1 space-y-1">
            <CardTitle className="font-sans text-base font-semibold text-neutral-100">{subheading}</CardTitle>
            <CardDescription className="font-sans text-xs leading-relaxed text-neutral-400">{note}</CardDescription>
          </div>
          <button
            type="button"
            className="inline-flex shrink-0 items-center justify-center gap-1.5 self-start rounded-md border border-white/[0.08] bg-neutral-950/50 px-3 py-2 font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-300 transition hover:border-white/[0.14] hover:bg-neutral-900/70 hover:text-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/25 sm:py-1.5"
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={expanded}
            aria-controls={panelId}
          >
            <span>{expanded ? 'Collapse' : 'Expand'}</span>
            <svg
              className={cn('h-4 w-4 text-neutral-400 transition-transform duration-200', expanded && 'rotate-180')}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
      </CardHeader>
      {expanded ? (
        <CardContent id={panelId} className="space-y-2 p-4 pt-0 sm:p-5 sm:pt-0">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-4">
          <div className="min-w-0 flex-1">
            <ChartContainer config={chartConfig} className="h-[400px] w-full sm:h-[440px] lg:h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 8, right: 10, left: 2, bottom: 42 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis
                    dataKey="year"
                    type="category"
                    interval={0}
                    tick={{
                      fill: 'rgba(163,163,163,0.9)',
                      fontSize: 9,
                      fontFamily: 'ui-sans-serif',
                    }}
                    tickFormatter={(value) => String(value)}
                    angle={-42}
                    textAnchor="end"
                    height={40}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={yTickFormatter ?? ((v) => String(v))}
                    tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                    axisLine={false}
                    tickLine={false}
                    width={44}
                  />
                  <ChartTooltip
                    cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                    content={
                      <ChartTooltipContent
                        className="rounded-md"
                        formatter={(value) => formatTooltipValue(value)}
                        labelFormatter={(label) => `Year ${String(label)}`}
                      />
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey={dataKey}
                    stroke={stroke}
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    activeDot={{ r: 4 }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div className="w-full shrink-0 lg:w-[min(380px,100%)] lg:-translate-y-[100px]">
            <div className="rounded-md border border-line">
              <div className="border-b border-white/[0.06] bg-surface-metric px-3 py-2 sm:px-3 sm:py-2.5">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-neutral-300">
                  {tableTitle}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full caption-bottom text-sm">
                  <TableHeader className="bg-surface-metric">
                    <TableRow className="border-white/[0.06] hover:bg-transparent">
                      <TableHead className="h-auto w-11 whitespace-nowrap py-2 text-neutral-400">Rank</TableHead>
                      <TableHead className="h-auto min-w-0 py-2 text-neutral-400">{locationHeader}</TableHead>
                      <TableHead className="h-auto max-w-[min(12rem,40vw)] py-2 text-right text-[10px] font-medium leading-snug text-neutral-400 sm:max-w-[14rem]">
                        {estimateHeader}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((r) => (
                      <TableRow key={r.rank} className="border-white/[0.06]">
                        <TableCell className="py-1.5 tabular-nums text-neutral-500">{r.rank}</TableCell>
                        <TableCell className="py-1.5 text-neutral-200">{r.city}</TableCell>
                        <TableCell className="py-1.5 text-right tabular-nums text-neutral-100">{r.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {bottomNote?.trim() ? (
          <div className="rounded-md border border-white/[0.08] bg-neutral-950/35 p-3 sm:p-4">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-500">Note</p>
            <p className="mt-2 font-sans text-xs leading-relaxed text-neutral-400">{bottomNote}</p>
          </div>
        ) : null}
      </CardContent>
      ) : null}
    </Card>
  );
}

const HEAVY_METAL_LINE_KEYS = ['lead', 'chromium', 'arsenic'] as const;

type HeavyMetalsSuppressionBlockProps = {
  subheading: string;
  note: string;
  chartConfig: ChartConfig;
  data: HeavyMetalYearRow[];
  yTickFormatter?: (v: number) => string;
  valueDecimals?: number;
  tableTitle: string;
  locationHeader: string;
  estimateHeader: string;
  rows: { rank: number; city: string; value: string }[];
  bottomNote?: string;
  defaultExpanded?: boolean;
};

function HeavyMetalsSuppressionBlock({
  subheading,
  note,
  chartConfig,
  data,
  yTickFormatter,
  valueDecimals = 1,
  tableTitle,
  locationHeader,
  estimateHeader,
  rows,
  bottomNote,
  defaultExpanded = true,
}: HeavyMetalsSuppressionBlockProps) {
  const panelId = useId();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const formatTooltipValue = (v: unknown) => {
    const n = Number(v);
    if (!Number.isFinite(n)) return String(v ?? '');
    return valueDecimals > 0 && n % 1 !== 0 ? n.toFixed(valueDecimals) : String(n);
  };

  return (
    <Card className="border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-3 p-4 pb-2 sm:p-5 sm:pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0 flex-1 space-y-1">
            <CardTitle className="font-sans text-base font-semibold text-neutral-100">{subheading}</CardTitle>
            <CardDescription className="font-sans text-xs leading-relaxed text-neutral-400">{note}</CardDescription>
          </div>
          <button
            type="button"
            className="inline-flex shrink-0 items-center justify-center gap-1.5 self-start rounded-md border border-white/[0.08] bg-neutral-950/50 px-3 py-2 font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-300 transition hover:border-white/[0.14] hover:bg-neutral-900/70 hover:text-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/25 sm:py-1.5"
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={expanded}
            aria-controls={panelId}
          >
            <span>{expanded ? 'Collapse' : 'Expand'}</span>
            <svg
              className={cn('h-4 w-4 text-neutral-400 transition-transform duration-200', expanded && 'rotate-180')}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
      </CardHeader>
      {expanded ? (
        <CardContent id={panelId} className="space-y-2 p-4 pt-0 sm:p-5 sm:pt-0">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-4">
            <div className="min-w-0 flex-1">
              <ChartContainer config={chartConfig} className="h-[400px] w-full sm:h-[440px] lg:h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 8, right: 10, left: 2, bottom: 42 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis
                      dataKey="year"
                      type="category"
                      interval={0}
                      tick={{
                        fill: 'rgba(163,163,163,0.9)',
                        fontSize: 9,
                        fontFamily: 'ui-sans-serif',
                      }}
                      tickFormatter={(value) => String(value)}
                      angle={-42}
                      textAnchor="end"
                      height={40}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={yTickFormatter ?? ((v) => String(v))}
                      tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                      axisLine={false}
                      tickLine={false}
                      width={44}
                    />
                    <ChartTooltip
                      cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                      content={
                        <ChartTooltipContent
                          className="rounded-md"
                          formatter={(value) => formatTooltipValue(value)}
                          labelFormatter={(label) => `Year ${String(label)}`}
                        />
                      }
                    />
                    {HEAVY_METAL_LINE_KEYS.map((key) => (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={chartConfig[key]?.color ?? '#e5e5e5'}
                        strokeWidth={2}
                        dot={{ r: 2 }}
                        activeDot={{ r: 4 }}
                        isAnimationActive={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            <div className="w-full shrink-0 lg:w-[min(380px,100%)] lg:-translate-y-[100px]">
              <div className="rounded-md border border-line">
                <div className="border-b border-white/[0.06] bg-surface-metric px-3 py-2 sm:px-3 sm:py-2.5">
                  <p className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-neutral-300">
                    {tableTitle}
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full caption-bottom text-sm">
                    <TableHeader className="bg-surface-metric">
                      <TableRow className="border-white/[0.06] hover:bg-transparent">
                        <TableHead className="h-auto w-11 whitespace-nowrap py-2 text-neutral-400">Rank</TableHead>
                        <TableHead className="h-auto min-w-0 py-2 text-neutral-400">{locationHeader}</TableHead>
                        <TableHead className="h-auto max-w-[min(12rem,40vw)] py-2 text-right text-[10px] font-medium leading-snug text-neutral-400 sm:max-w-[14rem]">
                          {estimateHeader}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.map((r) => (
                        <TableRow key={r.rank} className="border-white/[0.06]">
                          <TableCell className="py-1.5 tabular-nums text-neutral-500">{r.rank}</TableCell>
                          <TableCell className="py-1.5 text-neutral-200">{r.city}</TableCell>
                          <TableCell className="py-1.5 text-right tabular-nums text-neutral-100">{r.value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {bottomNote?.trim() ? (
            <div className="rounded-md border border-white/[0.08] bg-neutral-950/35 p-3 sm:p-4">
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-500">Note</p>
              <p className="mt-2 font-sans text-xs leading-relaxed text-neutral-400">{bottomNote}</p>
            </div>
          ) : null}
        </CardContent>
      ) : null}
    </Card>
  );
}

export const GermanyHealthSuppressionSection = memo(function GermanyHealthSuppressionSection() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="font-sans text-lg font-semibold tracking-tight text-neutral-100">Main Chemicals</h3>
      </div>

      <SuppressionBlock
        subheading="Synthetic Estrogens"
        note="17α-Ethinylestradiol and EE2 from birth-control pills."
        chartConfig={EE2_CHART_CONFIG}
        stroke="#ec4899"
        data={EE2_SERIES}
        yTickFormatter={(v) => (Number.isInteger(v) ? String(v) : v.toFixed(1))}
        valueDecimals={1}
        tableTitle="Top 10 Worst Cities"
        locationHeader="City"
        estimateHeader="Estimated average EE2 (ng/L) in local rivers / STP effluent"
        rows={EE2_TOP_CITIES}
        bottomNote={EE2_BOTTOM_NOTE}
      />

      <SuppressionBlock
        subheading="Forever Chemicals"
        note="ΣPFAS in surface water / rivers, ng/L – main indicator for endocrine-disrupting potential."
        chartConfig={PFAS_CHART_CONFIG}
        stroke="#38bdf8"
        data={PFAS_SERIES}
        yTickFormatter={(v) => String(Math.round(v))}
        valueDecimals={0}
        tableTitle="Top 10 Worst Cities"
        locationHeader="City / area"
        estimateHeader="Estimated average PFAS level (ng/L in local rivers / groundwater)"
        rows={PFAS_TOP_CITIES}
        bottomNote={PFAS_BOTTOM_NOTE}
      />

      <SuppressionBlock
        subheading="Atrazine Concentrations in Germany"
        note="ng/L – average national levels; Atrazine banned since 1991."
        chartConfig={ATRAZINE_CHART_CONFIG}
        stroke="#a3e635"
        data={ATRAZINE_SERIES}
        yTickFormatter={(v) => String(Math.round(v))}
        valueDecimals={0}
        tableTitle="Top 10 Worst Cities"
        locationHeader="City / region"
        estimateHeader="Estimated average atrazine (ng/L)"
        rows={ATRAZINE_TOP_CITIES}
        bottomNote={ATRAZINE_BOTTOM_NOTE}
      />

      <SuppressionBlock
        subheading="Fluoride Levels"
        note="Average national concentration in mg/L."
        chartConfig={FLUORIDE_CHART_CONFIG}
        stroke="#c084fc"
        data={FLUORIDE_SERIES}
        yTickFormatter={(v) => v.toFixed(2)}
        valueDecimals={2}
        tableTitle="Top 10 Worst Cities"
        locationHeader="City / region"
        estimateHeader="Average fluoride (mg/L)"
        rows={FLUORIDE_TOP_CITIES}
        bottomNote={FLUORIDE_BOTTOM_NOTE}
      />

      <SuppressionBlock
        subheading="Bisphenol A (BPA) Levels"
        note="Average BPA concentration (µg/L in urine), 2000–2025."
        chartConfig={BPA_CHART_CONFIG}
        stroke="#fb923c"
        data={BPA_SERIES}
        yTickFormatter={(v) => (Number.isInteger(v) ? String(v) : v.toFixed(1))}
        valueDecimals={1}
        tableTitle="Worst cities for BPA exposure"
        locationHeader="City / region"
        estimateHeader="Average BPA (µg/L in urine / local water)"
        rows={BPA_TOP_CITIES}
        bottomNote={BPA_BOTTOM_NOTE}
      />

      <SuppressionBlock
        subheading="Total Pharmaceutical Residues"
        note="Average total pharmaceutical residues (µg/L), 2000–2025."
        chartConfig={PHARMA_RESIDUE_CHART_CONFIG}
        stroke="#2dd4bf"
        data={PHARMA_RESIDUE_SERIES}
        yTickFormatter={(v) => (Number.isInteger(v) ? String(v) : v.toFixed(2))}
        valueDecimals={2}
        tableTitle="Top 10 worst cities / areas"
        locationHeader="City / region"
        estimateHeader="Estimated average total pharma residues (µg/L)"
        rows={PHARMA_RESIDUE_TOP_CITIES}
        bottomNote={PHARMA_RESIDUE_BOTTOM_NOTE}
      />

      <div>
        <h3 className="font-sans text-lg font-semibold tracking-tight text-neutral-100">Secondary Chemicals</h3>
      </div>

      <SuppressionBlock
        subheading="Disinfection Byproducts"
        note="Average total THM + HAA (µg/L) in drinking water, 2000–2025."
        chartConfig={DBP_THM_HAA_CHART_CONFIG}
        stroke="#f472b6"
        data={DBP_THM_HAA_SERIES}
        yTickFormatter={(v) => (Number.isInteger(v) ? String(v) : v.toFixed(1))}
        valueDecimals={1}
        tableTitle="Top 10 worst cities for disinfection byproducts"
        locationHeader="City / region"
        estimateHeader="Average THM + HAA (µg/L)"
        rows={DBP_TOP_CITIES}
        bottomNote={DBP_BOTTOM_NOTE}
      />

      <SuppressionBlock
        subheading="Microplastics"
        note="Average microplastics concentration (particles/L), 2000–2025."
        chartConfig={MICROPLASTICS_CHART_CONFIG}
        stroke="#94a3b8"
        data={MICROPLASTICS_SERIES}
        yTickFormatter={(v) => (Number.isInteger(v) ? String(v) : v.toFixed(1))}
        valueDecimals={1}
        tableTitle="Top 10 worst cities for microplastics"
        locationHeader="City / region"
        estimateHeader="Estimated average concentration (particles/L)"
        rows={MICROPLASTICS_TOP_CITIES}
        bottomNote={MICROPLASTICS_BOTTOM_NOTE}
      />

      <HeavyMetalsSuppressionBlock
        subheading="Heavy Metals"
        note="National averages in tap water: lead, chromium, and arsenic (µg/L), 2000–2025."
        chartConfig={HEAVY_METALS_CHART_CONFIG}
        data={HEAVY_METALS_SERIES}
        yTickFormatter={(v) => (Number.isInteger(v) ? String(v) : v.toFixed(1))}
        valueDecimals={1}
        tableTitle="Top 10 worst cities for heavy metals"
        locationHeader="City / region"
        estimateHeader="Combined heavy metals level (µg/L)"
        rows={HEAVY_METALS_TOP_CITIES}
      />

      <SuppressionBlock
        subheading="Total Pesticide Residues"
        note="Average total pesticide residues (µg/L), 2000–2025."
        chartConfig={PESTICIDE_RESIDUE_CHART_CONFIG}
        stroke="#4ade80"
        data={PESTICIDE_RESIDUE_SERIES}
        yTickFormatter={(v) => (Number.isInteger(v) ? String(v) : v.toFixed(2))}
        valueDecimals={2}
        tableTitle="Top 10 worst cities for pesticide residues"
        locationHeader="City / region"
        estimateHeader="Average total pesticide residues (µg/L)"
        rows={PESTICIDE_RESIDUE_TOP_CITIES}
      />
    </div>
  );
});
