import { memo } from 'react';
import { SuppressionBlock } from '../germany/GermanyHealthSuppressionSection';
import {
  ITALY_ATRAZINE_BOTTOM_NOTE,
  ITALY_ATRAZINE_CHART_CONFIG,
  ITALY_ATRAZINE_SERIES,
  ITALY_ATRAZINE_TOP_CITIES,
  ITALY_BPA_BOTTOM_NOTE,
  ITALY_BPA_CHART_CONFIG,
  ITALY_BPA_SERIES,
  ITALY_BPA_TOP_CITIES,
  ITALY_EE2_BOTTOM_NOTE,
  ITALY_EE2_CHART_CONFIG,
  ITALY_EE2_SERIES,
  ITALY_EE2_TOP_CITIES,
  ITALY_FLUORIDE_BOTTOM_NOTE,
  ITALY_FLUORIDE_CHART_CONFIG,
  ITALY_FLUORIDE_SERIES,
  ITALY_FLUORIDE_TOP_CITIES,
  ITALY_PFAS_BOTTOM_NOTE,
  ITALY_PFAS_CHART_CONFIG,
  ITALY_PFAS_SERIES,
  ITALY_PFAS_TOP_CITIES,
  ITALY_PHARMA_RESIDUE_BOTTOM_NOTE,
  ITALY_PHARMA_RESIDUE_CHART_CONFIG,
  ITALY_PHARMA_RESIDUE_SERIES,
  ITALY_PHARMA_RESIDUE_TOP_CITIES,
} from '../../../lib/countries/italy/italyTapWaterChemicals';

/**
 * Italy — Health → Tap Water.
 *
 * Only blocks with Italian data are rendered. The France/Germany sections also carry
 * disinfection byproducts, microplastics, heavy metals, total pesticide residues and
 * national drinking-water indicators; those are omitted here until Italian series
 * exist, rather than falling back to another country's chemistry.
 */
export const ItalyTapWaterSection = memo(function ItalyTapWaterSection() {
  return (
    <div className={'flex flex-col gap-6'}>
      <div>
        <h3 className={'font-sans text-lg font-semibold tracking-tight text-neutral-100'}>Main Chemicals</h3>
      </div>

      <SuppressionBlock
        subheading={'Synthetic Estrogens'}
        note={'17α-ethinylestradiol (EE2) from contraceptive pills, ng/L in rivers and treatment-plant effluent.'}
        chartConfig={ITALY_EE2_CHART_CONFIG}
        stroke={'#ec4899'}
        data={ITALY_EE2_SERIES}
        yTickFormatter={(v) => (Number.isInteger(v) ? String(v) : v.toFixed(2))}
        valueDecimals={2}
        tableTitle={'Top 10 Worst Cities'}
        locationHeader={'City'}
        estimateHeader={'Estimated average EE2 (ng/L) in local rivers / STP effluent'}
        rows={ITALY_EE2_TOP_CITIES}
        bottomNote={ITALY_EE2_BOTTOM_NOTE}
      />

      <SuppressionBlock
        subheading={'Forever Chemicals'}
        note={'ΣPFAS in surface water / rivers, ng/L – main indicator for endocrine-disrupting potential.'}
        chartConfig={ITALY_PFAS_CHART_CONFIG}
        stroke={'#38bdf8'}
        data={ITALY_PFAS_SERIES}
        yTickFormatter={(v) => (Number.isInteger(v) ? String(v) : v.toFixed(1))}
        valueDecimals={1}
        tableTitle={'Top 10 Worst Cities'}
        locationHeader={'City / area'}
        estimateHeader={'Estimated average PFAS level (ng/L in local rivers / groundwater)'}
        rows={ITALY_PFAS_TOP_CITIES}
        bottomNote={ITALY_PFAS_BOTTOM_NOTE}
      />

      <SuppressionBlock
        subheading={'Atrazine Concentrations in Italy'}
        note={'ng/L – average national levels; atrazine banned in Italy since 1990.'}
        chartConfig={ITALY_ATRAZINE_CHART_CONFIG}
        stroke={'#a3e635'}
        data={ITALY_ATRAZINE_SERIES}
        yTickFormatter={(v) => String(Math.round(v))}
        valueDecimals={0}
        tableTitle={'Top 10 Worst Cities'}
        locationHeader={'City / region'}
        estimateHeader={'Estimated average atrazine (ng/L)'}
        rows={ITALY_ATRAZINE_TOP_CITIES}
        bottomNote={ITALY_ATRAZINE_BOTTOM_NOTE}
      />

      <SuppressionBlock
        subheading={'Fluoride Levels'}
        note={'Average national concentration in mg/L; Italy does not fluoridate its water supply.'}
        chartConfig={ITALY_FLUORIDE_CHART_CONFIG}
        stroke={'#c084fc'}
        data={ITALY_FLUORIDE_SERIES}
        yTickFormatter={(v) => v.toFixed(2)}
        valueDecimals={2}
        tableTitle={'Top 10 Worst Cities'}
        locationHeader={'City / region'}
        estimateHeader={'Average fluoride (mg/L)'}
        rows={ITALY_FLUORIDE_TOP_CITIES}
        bottomNote={ITALY_FLUORIDE_BOTTOM_NOTE}
      />

      <SuppressionBlock
        subheading={'Bisphenol A (BPA) Levels'}
        note={'Average urinary BPA concentration (µg/L), 2000–2025.'}
        chartConfig={ITALY_BPA_CHART_CONFIG}
        stroke={'#fb923c'}
        data={ITALY_BPA_SERIES}
        yTickFormatter={(v) => (Number.isInteger(v) ? String(v) : v.toFixed(1))}
        valueDecimals={2}
        tableTitle={'Worst cities for BPA exposure'}
        locationHeader={'City / region'}
        estimateHeader={'Average BPA (µg/L in urine / local water)'}
        rows={ITALY_BPA_TOP_CITIES}
        bottomNote={ITALY_BPA_BOTTOM_NOTE}
      />

      <SuppressionBlock
        subheading={'Total Pharmaceutical Residues'}
        note={'Average combined pharmaceutical residues in treated surface/drinking water (µg/L), 2000–2025.'}
        chartConfig={ITALY_PHARMA_RESIDUE_CHART_CONFIG}
        stroke={'#2dd4bf'}
        data={ITALY_PHARMA_RESIDUE_SERIES}
        yTickFormatter={(v) => (Number.isInteger(v) ? String(v) : v.toFixed(2))}
        valueDecimals={2}
        tableTitle={'Top 10 worst cities / areas'}
        locationHeader={'City / region'}
        estimateHeader={'Estimated average total pharma residues (µg/L)'}
        rows={ITALY_PHARMA_RESIDUE_TOP_CITIES}
        bottomNote={ITALY_PHARMA_RESIDUE_BOTTOM_NOTE}
      />
    </div>
  );
});
