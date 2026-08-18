import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import {
  SPAIN_FEMALE_MARRIAGE_CATEGORY_SHARES,
  type SpainFemaleMarriageCategoryShareRow as SpainMarriageCategoryShareRow,
} from '../../../lib/countries/spain/spainFemaleMarriageCategoryShares';
import { SPAIN_MALE_MARRIAGE_CATEGORY_SHARES } from '../../../lib/countries/spain/spainMaleMarriageCategoryShares';
import { SPAIN_FEMALE_MARRIAGE_PIE, SPAIN_MALE_MARRIAGE_PIE } from '../../../lib/countries/spain/spainMarriagePies';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '../../ui/chart';

const CATEGORY_CONFIG = {
  african: { label: 'African spouse', color: '#60a5fa' },
  arabNorthAfrican: { label: 'Arab / North African spouse', color: '#c084fc' },
  asianIndian: { label: 'Asian / Indian spouse', color: '#f43f5e' },
  europeanNonSpanish: { label: 'European non-Spanish spouse', color: '#f59e0b' },
  otherNonEuropean: { label: 'Other non-European spouse', color: '#f97316' },
  latinAmerican: { label: 'Latin American spouse', color: '#38bdf8' },
} satisfies ChartConfig;

const CATEGORY_KEYS = Object.keys(CATEGORY_CONFIG) as (keyof typeof CATEGORY_CONFIG)[];

function CategoryPieCard({
  sex,
  data,
}: {
  sex: 'Female' | 'Male';
  data: typeof SPAIN_FEMALE_MARRIAGE_PIE | typeof SPAIN_MALE_MARRIAGE_PIE;
}) {
  const config = data.reduce((result, slice, index) => {
    result[`slice_${index}`] = { label: slice.name, color: slice.fill };
    return result;
  }, {} as ChartConfig);

  return (
    <Card className="overflow-hidden border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-3 pb-2">
        <CardTitle className="text-sm font-semibold uppercase tracking-[0.05em] text-neutral-100">
          Spanish {sex.toLowerCase()} marriages (pie)
        </CardTitle>
        <CardDescription className="text-[10px] uppercase tracking-[0.03em] text-neutral-500">
          Approximate 2000–2024 nationality / origin breakdown · share of all marriages
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <ChartContainer config={config} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 320, height: 240 }}>
            <PieChart>
              <Pie data={[...data]} dataKey="value" nameKey="name" outerRadius={94} stroke="none" isAnimationActive={false}>
                {data.map((slice) => <Cell key={slice.name} fill={slice.fill} />)}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent className="rounded-md" formatter={(value) => `${Number(value).toFixed(1)}%`} />} />
              <Legend wrapperStyle={{ fontSize: '11px', color: 'rgba(212,212,212,0.9)' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function CategoryShareLineCard({
  sex,
  data,
}: {
  sex: 'Female' | 'Male';
  data: readonly SpainMarriageCategoryShareRow[];
}) {
  return (
    <Card className="col-span-full overflow-hidden border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-3 pb-2">
        <CardTitle className="text-sm font-semibold uppercase tracking-[0.05em] text-neutral-100">
          Spanish {sex.toLowerCase()} marriages by category
        </CardTitle>
        <CardDescription className="text-[10px] uppercase tracking-[0.03em] text-neutral-500">
          Reconstructed yearly share of all marriages (%) · nationality / origin · 2000–2025
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <ChartContainer config={CATEGORY_CONFIG} className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 320, height: 260 }}>
            <LineChart data={[...data]} margin={{ top: 8, right: 10, left: 4, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="year" tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }} axisLine={false} tickLine={false} interval={2} />
              <YAxis tickFormatter={(value) => `${Number(value).toFixed(0)}%`} tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }} axisLine={false} tickLine={false} width={44} domain={[0, 'dataMax + 0.5']} />
              <ChartTooltip
                cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                content={<ChartTooltipContent className="rounded-md" labelFormatter={(label) => `Year ${String(label)}`} formatter={(value) => `${Number(value).toFixed(2)}%`} />}
              />
              <Legend wrapperStyle={{ fontSize: '11px', color: 'rgba(212,212,212,0.9)' }} iconType="line" />
              {CATEGORY_KEYS.map((key) => (
                <Line key={key} type="monotone" dataKey={key} name={CATEGORY_CONFIG[key].label} stroke={CATEGORY_CONFIG[key].color} strokeWidth={key === 'latinAmerican' ? 2.4 : 1.8} dot={false} isAnimationActive={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function CategoryShareTable({
  sex,
  data,
}: {
  sex: 'Female' | 'Male';
  data: readonly SpainMarriageCategoryShareRow[];
}) {
  return (
    <Card className="col-span-full overflow-hidden border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-3 pb-2">
        <CardTitle className="text-sm font-semibold uppercase tracking-[0.05em] text-neutral-100">
          Spanish {sex.toLowerCase()} marriages table
        </CardTitle>
        <CardDescription className="text-[10px] uppercase tracking-[0.03em] text-neutral-500">
          Reconstructed share of all marriages (%) · nationality / origin · 2000–2025
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="overflow-x-auto rounded border border-neutral-800/80">
          <table className="w-full min-w-[840px] border-collapse font-sans text-[11px]">
            <thead>
              <tr className="bg-white/[0.04] text-neutral-400">
                <th scope="col" className="border border-neutral-800/90 px-3 py-2 text-left">Year</th>
                {CATEGORY_KEYS.map((key) => (
                  <th key={key} scope="col" className="border border-neutral-800/90 px-3 py-2 text-right font-medium">
                    {CATEGORY_CONFIG[key].label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.year} className="bg-black/20 text-neutral-200">
                  <th scope="row" className="border border-neutral-800/90 px-3 py-2 text-left font-medium text-neutral-100">{row.year}</th>
                  {CATEGORY_KEYS.map((key) => (
                    <td key={key} className="border border-neutral-800/90 px-3 py-2 text-right tabular-nums">{row[key].toFixed(2)}%</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export function SpainMarriageCategoryDetail() {
  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <CategoryPieCard sex="Female" data={SPAIN_FEMALE_MARRIAGE_PIE} />
        <CategoryPieCard sex="Male" data={SPAIN_MALE_MARRIAGE_PIE} />
      </div>
      <CategoryShareLineCard sex="Female" data={SPAIN_FEMALE_MARRIAGE_CATEGORY_SHARES} />
      <CategoryShareLineCard sex="Male" data={SPAIN_MALE_MARRIAGE_CATEGORY_SHARES} />
      <CategoryShareTable sex="Female" data={SPAIN_FEMALE_MARRIAGE_CATEGORY_SHARES} />
      <CategoryShareTable sex="Male" data={SPAIN_MALE_MARRIAGE_CATEGORY_SHARES} />
    </>
  );
}
