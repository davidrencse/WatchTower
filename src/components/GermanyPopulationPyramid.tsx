import { memo, useEffect, useMemo, useState } from 'react';
import germanyPopulationByAgeCsvRaw from '../../Assets/Data/countries/Germany/germany_2025_population_by_age_and_gender.csv?raw';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ChartContainer, type ChartConfig, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { Bar, BarChart, CartesianGrid, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from 'recharts';

type PyramidRow = {
  ageGroup: string;
  male: number;
  female: number;
  total: number;
};

function parseGermanyPopulationCsv(text: string): PyramidRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length < 2) return [];

  const rows: PyramidRow[] = [];
  for (let i = 1; i < lines.length; i += 1) {
    const parts = lines[i]!.split(',');
    if (parts.length < 6) continue;
    const ageGroup = parts[2]?.trim() ?? '';
    const male = Number(parts[3]);
    const female = Number(parts[4]);
    const total = Number(parts[5]);
    if (!ageGroup || !Number.isFinite(male) || !Number.isFinite(female)) continue;
    rows.push({ ageGroup, male, female, total: Number.isFinite(total) ? total : male + female });
  }
  return rows;
}

const chartConfig: ChartConfig = {
  male: { label: 'Male', color: '#3b82f6' },
  female: { label: 'Female', color: '#ec4899' },
};

type GermanyPopulationPyramidProps = {
  /** Per-country pyramid CSV (same columns); omitted for Germany (bundled data). */
  csvUrl?: string;
  /** Bundled CSV text (same columns) for a non-Germany country — avoids a network fetch. */
  rawCsv?: string;
  countryLabel?: string;
};

export const GermanyPopulationPyramid = memo(function GermanyPopulationPyramid({
  csvUrl,
  rawCsv,
  countryLabel = 'Germany',
}: GermanyPopulationPyramidProps) {
  const isGermany = !csvUrl && !rawCsv;
  const [raw, setRaw] = useState(isGermany ? germanyPopulationByAgeCsvRaw : rawCsv ?? '');

  useEffect(() => {
    if (!csvUrl) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(csvUrl);
        const text = res.ok ? await res.text() : '';
        if (!cancelled && text.trim()) setRaw(text);
      } catch {
        /* leave empty; renders nothing meaningful */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [csvUrl]);

  const rows = useMemo(() => parseGermanyPopulationCsv(raw), [raw]);

  const totals = useMemo(() => {
    let male = 0;
    let female = 0;
    for (const r of rows) {
      male += r.male;
      female += r.female;
    }
    const total = male + female;
    return {
      male,
      female,
      total,
      malePct: total ? ((male / total) * 100).toFixed(1) : '0.0',
      femalePct: total ? ((female / total) * 100).toFixed(1) : '0.0',
    };
  }, [rows]);

  const data = useMemo(
    () =>
      [...rows]
        .reverse()
        .map((r) => ({ ...r, maleLeft: -Math.abs(r.male), femaleRight: Math.abs(r.female) })),
    [rows],
  );

  const maxSide = useMemo(() => {
    let max = 0;
    for (const row of rows) {
      max = Math.max(max, row.male, row.female);
    }
    return max > 0 ? Math.ceil(max / 100_000) * 100_000 : 1_000_000;
  }, [rows]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="font-sans text-xs uppercase tracking-[0.18em]">{countryLabel} population pyramid (2025)</CardTitle>
        <CardDescription>Hover any age bar to view male and female population counts.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[560px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 8, right: 24, left: 24, bottom: 20 }}
              barCategoryGap={2}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2f2f2f" horizontal={false} />
              <ReferenceLine x={0} stroke="#595959" />
              <XAxis
                type="number"
                domain={[-maxSide, maxSide]}
                allowDataOverflow
                stroke="#8a8a8a"
                tick={{ fontSize: 11, fill: '#8a8a8a' }}
                tickFormatter={(v: number) => Math.abs(v).toLocaleString('en-US')}
              />
              <YAxis
                type="category"
                dataKey="ageGroup"
                stroke="#8a8a8a"
                width={48}
                tick={{ fontSize: 10, fill: '#d4d4d4' }}
              />
              <ChartTooltip
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => `Age group: ${String(label)}`}
                    formatter={(_, name, item) => {
                      const payload = (item as { payload?: { male?: number; female?: number; total?: number } }).payload;
                      if (!payload) return '';
                      if (String(name).toLowerCase().includes('male')) return payload.male?.toLocaleString('en-US') ?? '';
                      if (String(name).toLowerCase().includes('female')) return payload.female?.toLocaleString('en-US') ?? '';
                      return payload.total?.toLocaleString('en-US') ?? '';
                    }}
                  />
                }
              />
              <Bar dataKey="maleLeft" name="Male" fill="#3b82f6" radius={[3, 0, 0, 3]} />
              <Bar dataKey="femaleRight" name="Female" fill="#ec4899" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="mt-3 flex items-center gap-4 font-sans text-[10px] text-neutral-400">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-[2px] bg-[#3b82f6]" />
            Male
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-[2px] bg-[#ec4899]" />
            Female
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="rounded-md border border-line bg-surface-metric/80 px-3 py-2 shadow-inset">
            <div className="font-sans text-[10px] uppercase tracking-[0.18em] text-neutral-500">Total</div>
            <div className="mt-1 font-sans text-sm font-semibold tabular-nums text-neutral-100">
              {isGermany ? '83,491,249' : totals.total.toLocaleString('en-US')}
            </div>
            <div className="mt-0.5 font-sans text-[10px] text-neutral-500">
              {isGermany ? 'As of 30 June 2025' : '2025 estimate'}
            </div>
          </div>

          <div className="rounded-md border border-line bg-surface-metric/80 px-3 py-2 shadow-inset">
            <div className="font-sans text-[10px] uppercase tracking-[0.18em] text-neutral-500">Male</div>
            <div className="mt-1 flex items-baseline gap-2 font-sans tabular-nums text-sm font-semibold text-neutral-100">
              <span>{isGermany ? '41,202,173' : totals.male.toLocaleString('en-US')}</span>
              <span className="text-neutral-500">{isGermany ? '49.4%' : `${totals.malePct}%`}</span>
            </div>
          </div>

          <div className="rounded-md border border-line bg-surface-metric/80 px-3 py-2 shadow-inset">
            <div className="font-sans text-[10px] uppercase tracking-[0.18em] text-neutral-500">Female</div>
            <div className="mt-1 flex items-baseline gap-2 font-sans tabular-nums text-sm font-semibold text-neutral-100">
              <span>{isGermany ? '42,289,076' : totals.female.toLocaleString('en-US')}</span>
              <span className="text-neutral-500">{isGermany ? '50.6%' : `${totals.femalePct}%`}</span>
            </div>
          </div>
        </div>

        <p className="mt-2 font-sans text-[10px] leading-relaxed text-neutral-500">
          {isGermany
            ? 'Source data: germany_2025_population_by_age_and_gender.csv (Germany, 2025 age-group population by sex).'
            : `Source data: ${csvUrl?.split('/').pop() ?? `${countryLabel.toLowerCase()}_2025_population_by_age_and_gender.csv`} (${countryLabel}, modeled 2025 age-group population by sex, INSEE-based).`}
        </p>
      </CardContent>
    </Card>
  );
});
