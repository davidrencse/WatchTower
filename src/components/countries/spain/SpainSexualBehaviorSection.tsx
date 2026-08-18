import { memo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '../../ui/chart';

const SOURCE_URL =
  'https://www.sanidad.gob.es/areas/DCVIHT/saludSexual/docs/encSalSexu/Resumen_Ejecutivo_Encuesta_de_Salud_Sexual_2025_v4.pdf';

const SEX_COLORS = ['#38bdf8', '#e879f9', '#a78bfa'] as const;

type SimpleRow = { label: string; value: number; fill: string };

const simpleConfig = {
  value: { label: 'Value', color: SEX_COLORS[2] },
} satisfies ChartConfig;

function SourceLink() {
  return (
    <a
      href={SOURCE_URL}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-11 items-center font-sans text-[10px] text-cyan-400 underline decoration-cyan-400/40 underline-offset-4 hover:text-cyan-300"
    >
      Source: Spain Ministry of Health, 2025 National Sexual Health Survey
    </a>
  );
}

function SimpleBarCard({
  title,
  description,
  data,
  unit = '%',
}: {
  title: string;
  description: string;
  data: readonly SimpleRow[];
  unit?: '%' | ' years';
}) {
  return (
    <Card className="col-span-full overflow-hidden border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-3 pb-2">
        <CardTitle className="font-sans text-sm font-semibold uppercase tracking-[0.05em] text-neutral-100">
          {title}
        </CardTitle>
        <CardDescription className="font-sans text-[10px] leading-relaxed text-neutral-500">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <ChartContainer config={simpleConfig} className="h-[260px] w-full font-sans">
          <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 320, height: 220 }}>
            <BarChart accessibilityLayer data={[...data]} layout="vertical" margin={{ top: 8, right: 24, left: 16, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" horizontal={false} />
              <XAxis
                type="number"
                domain={unit === '%' ? [0, 100] : [0, 'dataMax + 2']}
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                tickFormatter={(value) => `${Number(value).toFixed(unit === '%' ? 0 : 1)}${unit}`}
              />
              <YAxis
                type="category"
                dataKey="label"
                axisLine={false}
                tickLine={false}
                width={88}
                tick={{ fill: 'rgba(212,212,212,0.95)', fontSize: 11, fontFamily: 'ui-sans-serif' }}
              />
              <ChartTooltip
                cursor={{ fill: 'rgba(255,255,255,0.06)' }}
                content={<ChartTooltipContent formatter={(value) => `${Number(value).toFixed(1)}${unit}`} />}
              />
              <Bar dataKey="value" name="Value" radius={[0, 6, 6, 0]} isAnimationActive={false}>
                {data.map((row) => <Cell key={row.label} fill={row.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        <SourceLink />
      </CardContent>
    </Card>
  );
}

const groupedConfig = {
  men: { label: 'Men', color: SEX_COLORS[0] },
  women: { label: 'Women', color: SEX_COLORS[1] },
  total: { label: 'Total', color: SEX_COLORS[2] },
} satisfies ChartConfig;

function GroupedBarCard({
  title,
  description,
  data,
  height = 340,
}: {
  title: string;
  description: string;
  data: readonly { label: string; men: number; women: number; total: number }[];
  height?: number;
}) {
  return (
    <Card className="col-span-full overflow-hidden border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-3 pb-2">
        <CardTitle className="font-sans text-sm font-semibold uppercase tracking-[0.05em] text-neutral-100">
          {title}
        </CardTitle>
        <CardDescription className="font-sans text-[10px] leading-relaxed text-neutral-500">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <ChartContainer
          config={groupedConfig}
          className={`${height >= 400 ? 'h-[420px]' : 'h-[340px]'} w-full font-sans`}
        >
          <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 320, height: 280 }}>
            <BarChart accessibilityLayer data={[...data]} margin={{ top: 8, right: 8, left: 2, bottom: 68 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                interval={0}
                angle={-32}
                textAnchor="end"
                height={76}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
              />
              <YAxis
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                width={38}
                tickFormatter={(value) => `${value}%`}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
              />
              <ChartTooltip content={<ChartTooltipContent formatter={(value) => `${Number(value).toFixed(1)}%`} />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="men" name="Men" fill={SEX_COLORS[0]} radius={[3, 3, 0, 0]} isAnimationActive={false} />
              <Bar dataKey="women" name="Women" fill={SEX_COLORS[1]} radius={[3, 3, 0, 0]} isAnimationActive={false} />
              <Bar dataKey="total" name="Total" fill={SEX_COLORS[2]} radius={[3, 3, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        <SourceLink />
      </CardContent>
    </Card>
  );
}

const sexRows = (men: number, women: number, total?: number): readonly SimpleRow[] => [
  { label: 'Men', value: men, fill: SEX_COLORS[0] },
  { label: 'Women', value: women, fill: SEX_COLORS[1] },
  ...(total == null ? [] : [{ label: 'Total', value: total, fill: SEX_COLORS[2] }]),
];

export const SpainSexualBehaviorSection = memo(function SpainSexualBehaviorSection() {
  return (
    <div className="flex flex-col gap-3">
      <SimpleBarCard
        title="Average age at first sexual experience"
        description="Mean reported age in Spain's 2025 national survey."
        data={sexRows(17.1, 18.1, 17.6)}
        unit=" years"
      />
      <SimpleBarCard
        title="First sexual experience before age 18"
        description="Share of respondents with sexual experience who reported a first experience before age 18."
        data={sexRows(75.8, 66.5)}
      />
      <SimpleBarCard
        title="Sexually active in the last 12 months"
        description="Share reporting at least one sexual relationship with another person in the previous year."
        data={sexRows(82.1, 71.0, 76.4)}
      />
      <GroupedBarCard
        title="Frequency of sexual experiences in the last 12 months"
        description="Survey distribution by sex and overall; percentages of respondents with lifetime sexual experience or no answer."
        height={420}
        data={[
          { label: 'Daily', men: 3.7, women: 2.4, total: 3.0 },
          { label: 'Every 2–3 days', men: 20.7, women: 18.9, total: 19.8 },
          { label: 'Weekly', men: 24.6, women: 21.9, total: 23.2 },
          { label: 'Every 2–3 weeks', men: 14.2, women: 12.5, total: 13.3 },
          { label: 'Monthly', men: 10.2, women: 7.8, total: 9.0 },
          { label: 'Less than monthly', men: 8.7, women: 7.5, total: 8.1 },
          { label: 'None', men: 17.5, women: 28.4, total: 23.1 },
        ]}
      />
      <GroupedBarCard
        title="Number of sexual partners in the last 12 months"
        description="Among 6,793 respondents who reported sex with another person during the previous year."
        data={[
          { label: 'One person', men: 75.2, women: 86.8, total: 80.8 },
          { label: 'Two or more', men: 23.3, women: 12.1, total: 17.9 },
        ]}
      />
      <SimpleBarCard
        title="Satisfied with sexual life"
        description="Overall share reporting satisfaction with their sexual life in the 2025 survey."
        data={[{ label: 'Total', value: 77.2, fill: SEX_COLORS[2] }]}
      />
      <SimpleBarCard
        title="Last sexual relationship was with a stable partner"
        description="Overall share whose most recent vaginal, anal or oral sexual relationship was with a stable partner."
        data={[{ label: 'Total', value: 83.1, fill: SEX_COLORS[2] }]}
      />
      <SimpleBarCard
        title="Ever paid for sexual services"
        description="Calculated from the survey's once and more-than-once responses; women are the complement of the reported 99.7% who never paid."
        data={sexRows(27.5, 0.3, 13.6)}
      />
      <SimpleBarCard
        title="Viewed pornography in the last 12 months"
        description="Share of all respondents reporting pornography consumption during the previous year."
        data={sexRows(71.9, 24.9, 47.8)}
      />
    </div>
  );
});
