import { memo } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '../../ui/chart';
import { HeavyMetalsSuppressionBlock, SuppressionBlock } from '../germany/GermanyHealthSuppressionSection';
import {
  FRANCE_ATRAZINE_BOTTOM_NOTE,
  FRANCE_ATRAZINE_CHART_CONFIG,
  FRANCE_ATRAZINE_SERIES,
  FRANCE_ATRAZINE_TOP_CITIES,
  FRANCE_BPA_BOTTOM_NOTE,
  FRANCE_BPA_CHART_CONFIG,
  FRANCE_BPA_SERIES,
  FRANCE_BPA_TOP_CITIES,
  FRANCE_DBP_BOTTOM_NOTE,
  FRANCE_DBP_THM_HAA_CHART_CONFIG,
  FRANCE_DBP_THM_HAA_SERIES,
  FRANCE_DBP_TOP_CITIES,
  FRANCE_EE2_BOTTOM_NOTE,
  FRANCE_EE2_CHART_CONFIG,
  FRANCE_EE2_SERIES,
  FRANCE_EE2_TOP_CITIES,
  FRANCE_FLUORIDE_BOTTOM_NOTE,
  FRANCE_FLUORIDE_CHART_CONFIG,
  FRANCE_FLUORIDE_SERIES,
  FRANCE_FLUORIDE_TOP_CITIES,
  FRANCE_HEAVY_METALS_BOTTOM_NOTE,
  FRANCE_HEAVY_METALS_CHART_CONFIG,
  FRANCE_HEAVY_METALS_SERIES,
  FRANCE_HEAVY_METALS_TOP_CITIES,
  FRANCE_MICROPLASTICS_BOTTOM_NOTE,
  FRANCE_MICROPLASTICS_CHART_CONFIG,
  FRANCE_MICROPLASTICS_SERIES,
  FRANCE_MICROPLASTICS_TOP_CITIES,
  FRANCE_PESTICIDE_RESIDUE_BOTTOM_NOTE,
  FRANCE_PESTICIDE_RESIDUE_CHART_CONFIG,
  FRANCE_PESTICIDE_RESIDUE_SERIES,
  FRANCE_PESTICIDE_RESIDUE_TOP_CITIES,
  FRANCE_PFAS_BOTTOM_NOTE,
  FRANCE_PFAS_CHART_CONFIG,
  FRANCE_PFAS_SERIES,
  FRANCE_PFAS_TOP_CITIES,
  FRANCE_PHARMA_RESIDUE_BOTTOM_NOTE,
  FRANCE_PHARMA_RESIDUE_CHART_CONFIG,
  FRANCE_PHARMA_RESIDUE_SERIES,
  FRANCE_PHARMA_RESIDUE_TOP_CITIES,
} from '../../../lib/countries/france/franceTapWaterChemicals';

type CompliancePoint = { year: number; value: number };

const MICROBIOLOGICAL_COMPLIANCE: CompliancePoint[] = [
  [2012, 96.7], [2013, 97.2], [2014, 97.1], [2015, 97.6], [2016, 97.5], [2017, 97.8],
  [2018, 97.6], [2019, 98.0], [2020, 98.2], [2021, 98.3], [2022, 98.2], [2023, 98.4],
  [2024, 98.1],
].map(([year, value]) => ({ year, value }));

const NITRATE_COMPLIANCE: CompliancePoint[] = [
  [2012, 99.1], [2013, 98.6], [2014, 99.0], [2015, 99.3], [2016, 99.2], [2017, 99.4],
  [2018, 99.3], [2019, 99.2], [2020, 99.1], [2021, 99.3], [2022, 98.8], [2023, 99.5],
].map(([year, value]) => ({ year, value }));

const PESTICIDE_COMPLIANCE: CompliancePoint[] = [
  [2012, 95.5], [2013, 93.1], [2014, 94.0], [2015, 96.0], [2016, 86.1], [2017, 92.5],
  [2018, 90.6], [2019, 91.9], [2020, 94.1], [2021, 82.6], [2022, 84.6], [2023, 74.7],
].map(([year, value]) => ({ year, value }));

const SOURCE_URLS = {
  microbiology: 'https://www.eaufrance.fr/chiffres-cles/part-de-la-population-alimentee-par-une-eau-conforme-au-regard-de-la-microbiologie-10',
  nitrates: 'https://www.eaufrance.fr/chiffres-cles/part-de-la-population-alimentee-par-une-eau-conforme-au-regard-des-nitrates-en-2023',
  pesticides: 'https://www.eaufrance.fr/chiffres-cles/part-de-la-population-alimentee-par-une-eau-conforme-au-regard-des-pesticides-en-2023',
  pfas: 'https://www.anses.fr/fr/content/pfas-les-resultats-de-la-campagne-nationale-de-mesure-dans-leau-destinee-la-consommation',
  monitoring: 'https://sante.gouv.fr/sante-et-environnement/eaux/article/le-controle-de-la-qualite-de-l-eau-du-robinet',
} as const;

const SUMMARY = [
  { value: '98.1%', label: 'Microbiologically compliant', detail: 'Population supplied · 2024' },
  { value: '99.5%', label: 'Nitrate compliant', detail: 'Population supplied · 2023' },
  { value: '74.7%', label: 'Pesticide compliant all year', detail: 'Population supplied · 2023' },
  { value: '92%', label: 'TFA detected', detail: 'ANSES distributed-water samples · 2023–2025' },
] as const;

const chartConfig: ChartConfig = {
  value: { label: 'Population supplied with compliant water (%)', color: '#38bdf8' },
};

function ComplianceChart({
  title,
  description,
  data,
  color,
  sourceUrl,
  note,
}: {
  title: string;
  description: string;
  data: CompliancePoint[];
  color: string;
  sourceUrl: string;
  note?: string;
}) {
  const values = data.map((point) => point.value);
  const lowerBound = Math.max(0, Math.floor(Math.min(...values) - 2));

  return (
    <Card className={'overflow-hidden border-line bg-surface-card'}>
      <CardHeader className={'border-b border-white/[0.06] pb-4'}>
        <CardTitle className={'font-sans text-base text-neutral-100'}>{title}</CardTitle>
        <CardDescription className={'text-xs leading-relaxed text-neutral-400'}>{description}</CardDescription>
      </CardHeader>
      <CardContent className={'pt-5'}>
        <ChartContainer config={chartConfig} className={'h-[250px] w-full'}>
          <ResponsiveContainer width={'100%'} height={'100%'} initialDimension={{ width: 320, height: 240 }}>
            <LineChart data={data} margin={{ top: 10, right: 14, bottom: 5, left: 0 }}>
              <CartesianGrid vertical={false} stroke={'rgba(255,255,255,0.07)'} />
              <XAxis
                dataKey={'year'}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[lowerBound, 100]}
                tickFormatter={(value) => `${value}%`}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                width={42}
              />
              <ChartTooltip
                cursor={{ stroke: 'rgba(255,255,255,0.14)' }}
                content={
                  <ChartTooltipContent
                    formatter={(value) => `${Number(value).toFixed(1)}%`}
                    labelFormatter={(label) => `Year ${String(label)}`}
                  />
                }
              />
              <Line
                type={'monotone'}
                dataKey={'value'}
                stroke={color}
                strokeWidth={2.25}
                dot={{ r: 2.5, fill: color }}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        {note ? <p className={'mt-3 text-xs leading-relaxed text-amber-200/75'}>{note}</p> : null}
        <a
          href={sourceUrl}
          target={'_blank'}
          rel={'noreferrer'}
          className={'mt-3 inline-flex text-xs font-medium text-sky-300 transition-colors hover:text-sky-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400'}
        >
          Source: Eaufrance / Ministry of Health
        </a>
      </CardContent>
    </Card>
  );
}

export const FranceTapWaterSection = memo(function FranceTapWaterSection() {
  return (
    <div className={'flex flex-col gap-6'}>
      <div>
        <h3 className={'font-sans text-lg font-semibold tracking-tight text-neutral-100'}>Main Chemicals</h3>
      </div>

      <SuppressionBlock
        subheading={'Synthetic Estrogens'}
        note={'17α-ethinylestradiol (EE2) from contraceptive pills, ng/L in rivers and treatment-plant effluent.'}
        chartConfig={FRANCE_EE2_CHART_CONFIG}
        stroke={'#ec4899'}
        data={FRANCE_EE2_SERIES}
        yTickFormatter={(v) => (Number.isInteger(v) ? String(v) : v.toFixed(2))}
        valueDecimals={2}
        tableTitle={'Top 10 Worst Cities'}
        locationHeader={'City'}
        estimateHeader={'Estimated average EE2 (ng/L) in local rivers / STP effluent'}
        rows={FRANCE_EE2_TOP_CITIES}
        bottomNote={FRANCE_EE2_BOTTOM_NOTE}
      />

      <SuppressionBlock
        subheading={'Forever Chemicals'}
        note={'ΣPFAS in surface water / rivers, ng/L – main indicator for endocrine-disrupting potential.'}
        chartConfig={FRANCE_PFAS_CHART_CONFIG}
        stroke={'#38bdf8'}
        data={FRANCE_PFAS_SERIES}
        yTickFormatter={(v) => (Number.isInteger(v) ? String(v) : v.toFixed(1))}
        valueDecimals={1}
        tableTitle={'Top 10 Worst Cities'}
        locationHeader={'City / area'}
        estimateHeader={'Estimated average PFAS level (ng/L in local rivers / groundwater)'}
        rows={FRANCE_PFAS_TOP_CITIES}
        bottomNote={FRANCE_PFAS_BOTTOM_NOTE}
      />

      <SuppressionBlock
        subheading={'Atrazine Concentrations in France'}
        note={'ng/L – average national levels; atrazine banned in France since 2003.'}
        chartConfig={FRANCE_ATRAZINE_CHART_CONFIG}
        stroke={'#a3e635'}
        data={FRANCE_ATRAZINE_SERIES}
        yTickFormatter={(v) => String(Math.round(v))}
        valueDecimals={0}
        tableTitle={'Top 10 Worst Cities'}
        locationHeader={'City / region'}
        estimateHeader={'Estimated average atrazine (ng/L)'}
        rows={FRANCE_ATRAZINE_TOP_CITIES}
        bottomNote={FRANCE_ATRAZINE_BOTTOM_NOTE}
      />

      <SuppressionBlock
        subheading={'Fluoride Levels'}
        note={'Average national concentration in mg/L; France does not fluoridate its water supply.'}
        chartConfig={FRANCE_FLUORIDE_CHART_CONFIG}
        stroke={'#c084fc'}
        data={FRANCE_FLUORIDE_SERIES}
        yTickFormatter={(v) => v.toFixed(2)}
        valueDecimals={2}
        tableTitle={'Top 10 Worst Cities'}
        locationHeader={'City / region'}
        estimateHeader={'Average fluoride (mg/L)'}
        rows={FRANCE_FLUORIDE_TOP_CITIES}
        bottomNote={FRANCE_FLUORIDE_BOTTOM_NOTE}
      />

      <SuppressionBlock
        subheading={'Bisphenol A (BPA) Levels'}
        note={'Average urinary BPA concentration (µg/L), 2000–2025.'}
        chartConfig={FRANCE_BPA_CHART_CONFIG}
        stroke={'#fb923c'}
        data={FRANCE_BPA_SERIES}
        yTickFormatter={(v) => (Number.isInteger(v) ? String(v) : v.toFixed(1))}
        valueDecimals={2}
        tableTitle={'Worst cities for BPA exposure'}
        locationHeader={'City / region'}
        estimateHeader={'Average BPA (µg/L in urine / local water)'}
        rows={FRANCE_BPA_TOP_CITIES}
        bottomNote={FRANCE_BPA_BOTTOM_NOTE}
      />

      <SuppressionBlock
        subheading={'Total Pharmaceutical Residues'}
        note={'Average combined pharmaceutical residues in treated surface/drinking water (µg/L), 2000–2025.'}
        chartConfig={FRANCE_PHARMA_RESIDUE_CHART_CONFIG}
        stroke={'#2dd4bf'}
        data={FRANCE_PHARMA_RESIDUE_SERIES}
        yTickFormatter={(v) => (Number.isInteger(v) ? String(v) : v.toFixed(2))}
        valueDecimals={2}
        tableTitle={'Top 10 worst cities / areas'}
        locationHeader={'City / region'}
        estimateHeader={'Estimated average total pharma residues (µg/L)'}
        rows={FRANCE_PHARMA_RESIDUE_TOP_CITIES}
        bottomNote={FRANCE_PHARMA_RESIDUE_BOTTOM_NOTE}
      />

      <div>
        <h3 className={'font-sans text-lg font-semibold tracking-tight text-neutral-100'}>Secondary Chemicals</h3>
      </div>

      <SuppressionBlock
        subheading={'Disinfection byproducts'}
        note={'Estimated average total THM + HAA in drinking water (µg/L), 2000–2025.'}
        chartConfig={FRANCE_DBP_THM_HAA_CHART_CONFIG}
        stroke={'#f472b6'}
        data={FRANCE_DBP_THM_HAA_SERIES}
        yTickFormatter={(v) => (Number.isInteger(v) ? String(v) : v.toFixed(1))}
        valueDecimals={1}
        tableTitle={'Top 10 worst cities for disinfection byproducts'}
        locationHeader={'City / region'}
        estimateHeader={'Average THM + HAA (µg/L)'}
        rows={FRANCE_DBP_TOP_CITIES}
        bottomNote={FRANCE_DBP_BOTTOM_NOTE}
      />

      <SuppressionBlock
        subheading={'Microplastics'}
        note={'Estimated average concentration in drinking water (particles/L), 2000–2025.'}
        chartConfig={FRANCE_MICROPLASTICS_CHART_CONFIG}
        stroke={'#94a3b8'}
        data={FRANCE_MICROPLASTICS_SERIES}
        yTickFormatter={(v) => (Number.isInteger(v) ? String(v) : v.toFixed(1))}
        valueDecimals={1}
        tableTitle={'Top 10 worst cities for microplastics'}
        locationHeader={'City / region'}
        estimateHeader={'Estimated average concentration (particles/L)'}
        rows={FRANCE_MICROPLASTICS_TOP_CITIES}
        bottomNote={FRANCE_MICROPLASTICS_BOTTOM_NOTE}
      />

      <HeavyMetalsSuppressionBlock
        subheading={'Heavy metals'}
        note={'Estimated national averages in tap water: lead, chromium, and arsenic (µg/L), 2000–2025.'}
        chartConfig={FRANCE_HEAVY_METALS_CHART_CONFIG}
        data={FRANCE_HEAVY_METALS_SERIES}
        yTickFormatter={(v) => (Number.isInteger(v) ? String(v) : v.toFixed(1))}
        valueDecimals={2}
        tableTitle={'Top 10 worst cities for heavy metals'}
        locationHeader={'City / region'}
        estimateHeader={'Combined heavy metals level (µg/L)'}
        rows={FRANCE_HEAVY_METALS_TOP_CITIES}
        bottomNote={FRANCE_HEAVY_METALS_BOTTOM_NOTE}
      />

      <SuppressionBlock
        subheading={'Total pesticide residues'}
        note={'Estimated average total concentration in drinking water (µg/L), 2000–2025.'}
        chartConfig={FRANCE_PESTICIDE_RESIDUE_CHART_CONFIG}
        stroke={'#4ade80'}
        data={FRANCE_PESTICIDE_RESIDUE_SERIES}
        yTickFormatter={(v) => v.toFixed(2)}
        valueDecimals={3}
        tableTitle={'Top 10 worst cities for pesticide residues'}
        locationHeader={'City / region'}
        estimateHeader={'Average total pesticide residues (µg/L)'}
        rows={FRANCE_PESTICIDE_RESIDUE_TOP_CITIES}
        bottomNote={FRANCE_PESTICIDE_RESIDUE_BOTTOM_NOTE}
      />

      <div>
        <h3 className={'font-sans text-lg font-semibold tracking-tight text-neutral-100'}>National drinking-water indicators</h3>
        <p className={'mt-1 max-w-4xl text-xs leading-relaxed text-neutral-400'}>
          Official population-based indicators for metropolitan France and the overseas departments. Compliance describes the share of people supplied by water meeting the stated criterion, not an average contaminant concentration.
        </p>
      </div>

      <div className={'grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4'}>
        {SUMMARY.map((item) => (
          <div key={item.label} className={'rounded-lg border border-line bg-surface-card p-4'}>
            <p className={'font-sans text-2xl font-semibold tabular-nums text-neutral-50'}>{item.value}</p>
            <p className={'mt-1 text-sm font-medium text-neutral-200'}>{item.label}</p>
            <p className={'mt-1 text-xs leading-relaxed text-neutral-500'}>{item.detail}</p>
          </div>
        ))}
      </div>

      <div className={'grid grid-cols-1 gap-6 xl:grid-cols-2'}>
        <ComplianceChart
          title={'Microbiological quality'}
          description={'Share of the population supplied with water free of E. coli and enterococci in a 100 mL sample.'}
          data={MICROBIOLOGICAL_COMPLIANCE}
          color={'#38bdf8'}
          sourceUrl={SOURCE_URLS.microbiology}
        />
        <ComplianceChart
          title={'Nitrate compliance'}
          description={'Share of the population whose maximum measured nitrate concentration was no more than 50 mg/L.'}
          data={NITRATE_COMPLIANCE}
          color={'#a3e635'}
          sourceUrl={SOURCE_URLS.nitrates}
        />
      </div>

      <ComplianceChart
        title={'Pesticide compliance'}
        description={'Share of the population supplied all year with water meeting pesticide quality limits: 0.1 µg/L per substance and 0.5 µg/L for the measured total.'}
        data={PESTICIDE_COMPLIANCE}
        color={'#f59e0b'}
        sourceUrl={SOURCE_URLS.pesticides}
        note={'The fall since 2021 does not by itself establish a sudden deterioration. French authorities attribute much of it to expanded monitoring that began detecting additional long-present pesticide metabolites.'}
      />

      <Card className={'border-line bg-surface-card'}>
        <CardHeader>
          <CardTitle className={'font-sans text-base text-neutral-100'}>PFAS national measurement campaign</CardTitle>
          <CardDescription className={'text-xs leading-relaxed text-neutral-400'}>
            ANSES campaign conducted from 2023 to 2025 across mainland and overseas France.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={'grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4'}>
            {[
              ['600+', 'distributed-water samples'],
              ['~20%', 'of water distributed represented'],
              ['19 of 35', 'PFAS detected in tap-water samples'],
              ['780 ng/L', 'median TFA in distributed water'],
            ].map(([value, label]) => (
              <div key={label} className={'rounded-md border border-white/[0.07] bg-neutral-950/30 p-3'}>
                <p className={'text-lg font-semibold tabular-nums text-neutral-100'}>{value}</p>
                <p className={'mt-1 text-xs leading-relaxed text-neutral-400'}>{label}</p>
              </div>
            ))}
          </div>
          <div className={'mt-4 rounded-md border border-amber-300/20 bg-amber-300/[0.05] p-3'}>
            <p className={'text-xs leading-relaxed text-amber-100/80'}>
              TFA was detected in 92% of distributed-water samples. It is an ultra-short-chain PFAS outside the EU list of 20 regulated PFAS, so its 780 ng/L median must not be compared with the 100 ng/L limit for the sum of those 20 substances. ANSES says only a small proportion of samples exceeded that regulated sum.
            </p>
          </div>
          <a href={SOURCE_URLS.pfas} target={'_blank'} rel={'noreferrer'} className={'mt-4 inline-flex text-xs font-medium text-sky-300 hover:text-sky-200'}>
            Source: ANSES national PFAS campaign
          </a>
        </CardContent>
      </Card>

      <Card className={'border-line bg-surface-card'}>
        <CardHeader>
          <CardTitle className={'font-sans text-base text-neutral-100'}>How France monitors tap water</CardTitle>
          <CardDescription className={'text-xs leading-relaxed text-neutral-400'}>
            National controls are administered through the Ministry of Health, regional health agencies and the SISE-Eaux database.
          </CardDescription>
        </CardHeader>
        <CardContent className={'space-y-4'}>
          <div className={'grid grid-cols-1 gap-3 md:grid-cols-3'}>
            {[
              ['130M+', 'analysis results in the national database'],
              ['33,500', 'water catchments modelled'],
              ['25,300', 'drinking-water distribution units'],
            ].map(([value, label]) => (
              <div key={label} className={'rounded-md border border-white/[0.07] bg-neutral-950/30 p-3'}>
                <p className={'text-lg font-semibold tabular-nums text-neutral-100'}>{value}</p>
                <p className={'mt-1 text-xs text-neutral-400'}>{label}</p>
              </div>
            ))}
          </div>
          <p className={'text-xs leading-relaxed text-neutral-400'}>
            Regulatory controls cover microbiological parameters and roughly thirty undesirable or toxic substances, including nitrates, metals, chlorinated solvents, aromatic hydrocarbons, pesticides and disinfection by-products. Local results vary by distribution unit and should be checked by commune.
          </p>
          <a href={SOURCE_URLS.monitoring} target={'_blank'} rel={'noreferrer'} className={'inline-flex text-xs font-medium text-sky-300 hover:text-sky-200'}>
            Source: French Ministry of Health monitoring overview
          </a>
        </CardContent>
      </Card>
    </div>
  );
});
