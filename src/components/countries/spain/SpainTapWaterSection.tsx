import { memo } from 'react';
import { HeavyMetalsSuppressionBlock, SuppressionBlock } from '../germany/GermanyHealthSuppressionSection';
import {
  SPAIN_ATRAZINE_BOTTOM_NOTE,
  SPAIN_ATRAZINE_CHART_CONFIG,
  SPAIN_ATRAZINE_SERIES,
  SPAIN_ATRAZINE_TOP_CITIES,
  SPAIN_BPA_BOTTOM_NOTE,
  SPAIN_BPA_CHART_CONFIG,
  SPAIN_BPA_SERIES,
  SPAIN_BPA_TOP_CITIES,
  SPAIN_DBP_BOTTOM_NOTE,
  SPAIN_DBP_THM_HAA_CHART_CONFIG,
  SPAIN_DBP_THM_HAA_SERIES,
  SPAIN_DBP_TOP_CITIES,
  SPAIN_EE2_BOTTOM_NOTE,
  SPAIN_EE2_CHART_CONFIG,
  SPAIN_EE2_SERIES,
  SPAIN_EE2_TOP_CITIES,
  SPAIN_FLUORIDE_BOTTOM_NOTE,
  SPAIN_FLUORIDE_CHART_CONFIG,
  SPAIN_FLUORIDE_SERIES,
  SPAIN_FLUORIDE_TOP_CITIES,
  SPAIN_HEAVY_METALS_BOTTOM_NOTE,
  SPAIN_HEAVY_METALS_CHART_CONFIG,
  SPAIN_HEAVY_METALS_SERIES,
  SPAIN_HEAVY_METALS_TOP_CITIES,
  SPAIN_MICROPLASTICS_BOTTOM_NOTE,
  SPAIN_MICROPLASTICS_CHART_CONFIG,
  SPAIN_MICROPLASTICS_SERIES,
  SPAIN_MICROPLASTICS_TOP_CITIES,
  SPAIN_PESTICIDE_RESIDUE_BOTTOM_NOTE,
  SPAIN_PESTICIDE_RESIDUE_CHART_CONFIG,
  SPAIN_PESTICIDE_RESIDUE_SERIES,
  SPAIN_PESTICIDE_RESIDUE_TOP_CITIES,
  SPAIN_PFAS_BOTTOM_NOTE,
  SPAIN_PFAS_CHART_CONFIG,
  SPAIN_PFAS_SERIES,
  SPAIN_PFAS_TOP_CITIES,
  SPAIN_PHARMA_RESIDUE_BOTTOM_NOTE,
  SPAIN_PHARMA_RESIDUE_CHART_CONFIG,
  SPAIN_PHARMA_RESIDUE_SERIES,
  SPAIN_PHARMA_RESIDUE_TOP_CITIES,
} from '../../../lib/countries/spain/spainTapWaterChemicals';

/**
 * Spain — Health → Tap Water.
 *
 * Block order follows Germany's section: main chemicals (EE2, PFAS, atrazine, fluoride,
 * BPA, pharmaceutical residues), then secondary (disinfection byproducts, microplastics,
 * heavy metals, total pesticide residues).
 *
 * Only blocks with Spanish data are rendered. France's section additionally carries a
 * national drinking-water indicators group; that is omitted here until Spanish figures
 * exist, rather than falling back to another country's chemistry.
 */
export const SpainTapWaterSection = memo(function SpainTapWaterSection() {
  return (
    <div className={'flex flex-col gap-6'}>
      <div>
        <h3 className={'font-sans text-lg font-semibold tracking-tight text-neutral-100'}>Main Chemicals</h3>
      </div>

      <SuppressionBlock
        subheading={'Synthetic Estrogens'}
        note={'17α-ethinylestradiol (EE2) from contraceptive pills, ng/L in rivers and treatment-plant effluent.'}
        chartConfig={SPAIN_EE2_CHART_CONFIG}
        stroke={'#ec4899'}
        data={SPAIN_EE2_SERIES}
        yTickFormatter={(v) => (Number.isInteger(v) ? String(v) : v.toFixed(2))}
        valueDecimals={2}
        tableTitle={'Top 10 Worst Cities'}
        locationHeader={'City / basin'}
        estimateHeader={'Estimated average EE2 (ng/L) in local rivers / STP effluent'}
        rows={SPAIN_EE2_TOP_CITIES}
        bottomNote={SPAIN_EE2_BOTTOM_NOTE}
      />

      <SuppressionBlock
        subheading={'Forever Chemicals'}
        note={'ΣPFAS in surface water / rivers, ng/L – main indicator for endocrine-disrupting potential.'}
        chartConfig={SPAIN_PFAS_CHART_CONFIG}
        stroke={'#38bdf8'}
        data={SPAIN_PFAS_SERIES}
        yTickFormatter={(v) => (Number.isInteger(v) ? String(v) : v.toFixed(1))}
        valueDecimals={1}
        tableTitle={'Top 10 Worst Areas'}
        locationHeader={'City / area'}
        estimateHeader={'Estimated average ΣPFAS level (ng/L in local rivers / groundwater)'}
        rows={SPAIN_PFAS_TOP_CITIES}
        bottomNote={SPAIN_PFAS_BOTTOM_NOTE}
      />

      <SuppressionBlock
        subheading={'Atrazine Concentrations in Spain'}
        note={'ng/L – average national levels; atrazine withdrawn EU-wide in 2004.'}
        chartConfig={SPAIN_ATRAZINE_CHART_CONFIG}
        stroke={'#a3e635'}
        data={SPAIN_ATRAZINE_SERIES}
        yTickFormatter={(v) => (Number.isInteger(v) ? String(v) : v.toFixed(1))}
        valueDecimals={1}
        tableTitle={'Top 10 Worst Areas'}
        locationHeader={'City / region'}
        estimateHeader={'Estimated average atrazine (ng/L) in local rivers / groundwater'}
        rows={SPAIN_ATRAZINE_TOP_CITIES}
        bottomNote={SPAIN_ATRAZINE_BOTTOM_NOTE}
      />

      <SuppressionBlock
        subheading={'Fluoride Levels'}
        note={'mg/L – average national concentration in drinking / supply water.'}
        chartConfig={SPAIN_FLUORIDE_CHART_CONFIG}
        stroke={'#c084fc'}
        data={SPAIN_FLUORIDE_SERIES}
        yTickFormatter={(v) => v.toFixed(2)}
        valueDecimals={2}
        tableTitle={'Top 10 Highest Areas'}
        locationHeader={'City / region'}
        estimateHeader={'Average fluoride (mg/L) in local supply water'}
        rows={SPAIN_FLUORIDE_TOP_CITIES}
        bottomNote={SPAIN_FLUORIDE_BOTTOM_NOTE}
      />

      <SuppressionBlock
        subheading={'Bisphenol A (BPA)'}
        note={'µg/L in urine – population biomonitoring measure of BPA exposure.'}
        chartConfig={SPAIN_BPA_CHART_CONFIG}
        stroke={'#fb923c'}
        data={SPAIN_BPA_SERIES}
        yTickFormatter={(v) => (Number.isInteger(v) ? String(v) : v.toFixed(1))}
        valueDecimals={1}
        tableTitle={'Worst Areas for BPA Exposure'}
        locationHeader={'City / region'}
        estimateHeader={'Estimated average urinary BPA (µg/L)'}
        rows={SPAIN_BPA_TOP_CITIES}
        bottomNote={SPAIN_BPA_BOTTOM_NOTE}
      />

      <SuppressionBlock
        subheading={'Total Pharmaceutical Residues'}
        note={'µg/L – average combined pharmaceutical residues in surface water / rivers.'}
        chartConfig={SPAIN_PHARMA_RESIDUE_CHART_CONFIG}
        stroke={'#2dd4bf'}
        data={SPAIN_PHARMA_RESIDUE_SERIES}
        yTickFormatter={(v) => (Number.isInteger(v) ? String(v) : v.toFixed(2))}
        valueDecimals={2}
        tableTitle={'Top 10 Worst Cities / Areas'}
        locationHeader={'City / region'}
        estimateHeader={'Estimated average total pharma residues (µg/L)'}
        rows={SPAIN_PHARMA_RESIDUE_TOP_CITIES}
        bottomNote={SPAIN_PHARMA_RESIDUE_BOTTOM_NOTE}
      />

      <div>
        <h3 className={'font-sans text-lg font-semibold tracking-tight text-neutral-100'}>Secondary Chemicals</h3>
      </div>

      <SuppressionBlock
        subheading={'Disinfection Byproducts'}
        note={'Average total THM + HAA (µg/L) in drinking water, 2000–2025.'}
        chartConfig={SPAIN_DBP_THM_HAA_CHART_CONFIG}
        stroke={'#f472b6'}
        data={SPAIN_DBP_THM_HAA_SERIES}
        yTickFormatter={(v) => (Number.isInteger(v) ? String(v) : v.toFixed(1))}
        valueDecimals={1}
        tableTitle={'Top 10 Worst Cities / Areas'}
        locationHeader={'City / region'}
        estimateHeader={'Average THM + HAA (µg/L)'}
        rows={SPAIN_DBP_TOP_CITIES}
        bottomNote={SPAIN_DBP_BOTTOM_NOTE}
      />

      <SuppressionBlock
        subheading={'Microplastics'}
        note={'Average microplastics concentration (particles/L), 2000–2025.'}
        chartConfig={SPAIN_MICROPLASTICS_CHART_CONFIG}
        stroke={'#94a3b8'}
        data={SPAIN_MICROPLASTICS_SERIES}
        yTickFormatter={(v) => (Number.isInteger(v) ? String(v) : v.toFixed(1))}
        valueDecimals={1}
        tableTitle={'Top 10 Worst Cities / Areas'}
        locationHeader={'City / region'}
        estimateHeader={'Estimated average concentration (particles/L)'}
        rows={SPAIN_MICROPLASTICS_TOP_CITIES}
        bottomNote={SPAIN_MICROPLASTICS_BOTTOM_NOTE}
      />

      <HeavyMetalsSuppressionBlock
        subheading={'Heavy Metals'}
        note={'National averages in tap water: lead, chromium, and arsenic (µg/L), 2000–2025.'}
        chartConfig={SPAIN_HEAVY_METALS_CHART_CONFIG}
        data={SPAIN_HEAVY_METALS_SERIES}
        yTickFormatter={(v) => (Number.isInteger(v) ? String(v) : v.toFixed(2))}
        valueDecimals={2}
        tableTitle={'Top 10 Worst Areas'}
        locationHeader={'City / region'}
        estimateHeader={'Combined heavy metals level (µg/L)'}
        rows={SPAIN_HEAVY_METALS_TOP_CITIES}
        bottomNote={SPAIN_HEAVY_METALS_BOTTOM_NOTE}
      />

      <SuppressionBlock
        subheading={'Total Pesticide Residues'}
        note={'Average total pesticide residues in surface water / rivers (µg/L), 2000–2025.'}
        chartConfig={SPAIN_PESTICIDE_RESIDUE_CHART_CONFIG}
        stroke={'#4ade80'}
        data={SPAIN_PESTICIDE_RESIDUE_SERIES}
        yTickFormatter={(v) => (Number.isInteger(v) ? String(v) : v.toFixed(2))}
        valueDecimals={2}
        tableTitle={'Top 10 Worst Areas'}
        locationHeader={'City / region'}
        estimateHeader={'Average total pesticide residues (µg/L)'}
        rows={SPAIN_PESTICIDE_RESIDUE_TOP_CITIES}
        bottomNote={SPAIN_PESTICIDE_RESIDUE_BOTTOM_NOTE}
      />
    </div>
  );
});
