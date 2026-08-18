import { memo, type ReactNode } from 'react';
import { ExternalLink } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '../../ui/chart';
import {
  SPAIN_2025_MONTHLY_BIRTHS,
  SPAIN_2025_REGIONAL_BIRTHS,
  SPAIN_BIRTH_SOURCES,
  SPAIN_FERTILITY_BY_NATIONALITY,
  SPAIN_MATERNITY_AGE_BY_NATIONALITY,
  SPAIN_MOTHER_AGE_COMPARISON,
  SPAIN_NATURAL_BALANCE,
  SPAIN_TOTAL_BIRTHS,
} from '../../../lib/countries/spain/spainBirthRates';

/**
 * THESIS: Spain's 2025 uptick is a provisional pause inside a much longer fertility contraction.
 * OWN-WORLD: WatchTower's dense evidence surface, using warm amber for births and cool blue for context.
 * STORY: Start with scale and trend, then explain fertility, delayed motherhood, maternal origin, and geography.
 * FIRST VIEWPORT: Four verified headline indicators and the complete 2000-2025 national series.
 * FORM: Country-specific extension of the existing analytical dashboard, not a route-level redesign.
 */

const LABEL = 'font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-500';
const NUMBER = new Intl.NumberFormat('en-US');
const BIRTH_COLOR = '#f0b44d';
const SPAIN_COLOR = '#e35f5f';
const FOREIGN_COLOR = '#4eb5c5';
const TOTAL_COLOR = '#ece7dc';

const birthsChartConfig: ChartConfig = {
  official: { label: 'Final births', color: BIRTH_COLOR },
  provisional: { label: 'Provisional estimate', color: '#f7d38b' },
};

const fertilityConfig: ChartConfig = {
  total: { label: 'All mothers', color: TOTAL_COLOR },
  spanish: { label: 'Spanish nationality', color: SPAIN_COLOR },
  foreign: { label: 'Foreign nationality', color: FOREIGN_COLOR },
};

const maternityAgeConfig: ChartConfig = {
  total: { label: 'All mothers', color: TOTAL_COLOR },
  spanish: { label: 'Spanish nationality', color: SPAIN_COLOR },
  foreign: { label: 'Foreign nationality', color: FOREIGN_COLOR },
};

const monthlyConfig: ChartConfig = {
  births: { label: 'Births', color: BIRTH_COLOR },
};

const balanceConfig: ChartConfig = {
  balance: { label: 'Natural population change', color: '#ef7b6f' },
};

function SourceLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 items-center gap-1.5 font-sans text-[10px] font-medium text-amber-200/80 transition-colors hover:text-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 motion-reduce:transition-none"
    >
      {children} <ExternalLink aria-hidden className="h-3 w-3" />
    </a>
  );
}

function Panel({
  title,
  description,
  children,
  className = '',
}: {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <article className={`min-w-0 overflow-hidden rounded-md border border-white/[0.07] bg-black/20 ${className}`}>
      <header className="border-b border-white/[0.06] px-4 py-4 sm:px-5">
        <h4 className="font-sans text-base font-semibold tracking-tight text-neutral-100">{title}</h4>
        <p className="mt-1 max-w-[72ch] font-sans text-[11px] leading-relaxed text-neutral-500">{description}</p>
      </header>
      <div className="p-4 sm:p-5">{children}</div>
    </article>
  );
}

function Legend({ items }: { items: ReadonlyArray<{ label: string; color: string; dashed?: boolean }> }) {
  return (
    <div className="mb-3 flex flex-wrap gap-x-4 gap-y-2" aria-label="Chart legend">
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-2 font-sans text-[10px] text-neutral-400">
          <span
            aria-hidden
            className="h-0 w-5 border-t-2"
            style={{ borderColor: item.color, borderTopStyle: item.dashed ? 'dashed' : 'solid' }}
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}

function AccessibleDataTable({
  caption,
  headers,
  rows,
}: {
  caption: string;
  headers: readonly string[];
  rows: ReadonlyArray<ReadonlyArray<string | number>>;
}) {
  return (
    <table className="sr-only">
      <caption>{caption}</caption>
      <thead><tr>{headers.map((header) => <th key={header} scope="col">{header}</th>)}</tr></thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={`${caption}-${rowIndex}`}>{row.map((value, index) => index === 0 ? <th key={headers[index]} scope="row">{value}</th> : <td key={headers[index]}>{value}</td>)}</tr>
        ))}
      </tbody>
    </table>
  );
}

function TotalBirthsPanel() {
  const data = SPAIN_TOTAL_BIRTHS.map((point) => ({
    ...point,
    official: point.provisional ? null : point.births,
    provisional: point.year >= 2024 ? point.births : null,
  }));
  const declineFromPeak = ((321_164 / 519_779 - 1) * 100).toFixed(1);

  return (
    <Panel
      title="Births occurring in Spain"
      description="Annual registered births, 2000-2024 final; 2025 is the INE civil-register estimate and may be revised."
      className="lg:col-span-2"
    >
      <Legend items={[{ label: 'Final INE series', color: BIRTH_COLOR }, { label: '2025 provisional', color: '#f7d38b', dashed: true }]} />
      <ChartContainer config={birthsChartConfig} className="h-[285px] w-full sm:h-[320px]">
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 640, height: 300 }}>
          <LineChart accessibilityLayer data={data} margin={{ top: 12, right: 14, bottom: 2, left: 2 }}>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.07)" />
            <XAxis
              dataKey="year"
              ticks={[2000, 2004, 2008, 2012, 2016, 2020, 2024, 2025]}
              tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[280_000, 550_000]}
              ticks={[300_000, 400_000, 500_000]}
              tickFormatter={(value) => `${Math.round(Number(value) / 1_000)}k`}
              tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <ChartTooltip
              cursor={{ stroke: 'rgba(255,255,255,0.14)' }}
              content={<ChartTooltipContent formatter={(value) => NUMBER.format(Number(value))} labelFormatter={(label) => `Year ${String(label)}`} />}
            />
            <Line type="monotone" dataKey="official" stroke={BIRTH_COLOR} strokeWidth={2.4} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} connectNulls={false} />
            <Line tooltipType="none" type="linear" dataKey="provisional" stroke="#f7d38b" strokeWidth={2.4} strokeDasharray="5 4" dot={{ r: 3, fill: '#f7d38b' }} activeDot={{ r: 4 }} isAnimationActive={false} connectNulls={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
      <AccessibleDataTable
        caption="Births occurring in Spain, 2000 to 2025"
        headers={['Year', 'Births', 'Status']}
        rows={SPAIN_TOTAL_BIRTHS.map((point) => [point.year, NUMBER.format(point.births), point.provisional ? 'Provisional' : 'Final'])}
      />
      <div className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded border border-white/[0.07] bg-white/[0.07] sm:grid-cols-3">
        {[
          ['2008 peak', '519,779', 'Highest point in this series'],
          ['2025 vs peak', `${declineFromPeak}%`, 'Despite the provisional rebound'],
          ['2025 annual change', '+1.0%', 'First increase after a decade down'],
        ].map(([label, value, detail]) => (
          <div key={label} className="bg-neutral-950 px-3 py-3">
            <p className={LABEL}>{label}</p>
            <p className="mt-1 font-sans text-lg font-semibold tabular-nums text-white">{value}</p>
            <p className="mt-0.5 font-sans text-[10px] text-neutral-500">{detail}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4">
        <SourceLink href={SPAIN_BIRTH_SOURCES.historical}>Source: INE historical births series</SourceLink>
        <SourceLink href={SPAIN_BIRTH_SOURCES.provisional2025}>2025 estimate and methodology</SourceLink>
      </div>
    </Panel>
  );
}

function FertilityPanel() {
  return (
    <Panel title="Fertility by mother's nationality" description="Average children per woman. Nationality is an official legal category; it is not race or ethnicity.">
      <Legend items={[{ label: 'All', color: TOTAL_COLOR }, { label: 'Spanish', color: SPAIN_COLOR }, { label: 'Foreign', color: FOREIGN_COLOR }]} />
      <ChartContainer config={fertilityConfig} className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 420, height: 250 }}>
          <LineChart accessibilityLayer data={[...SPAIN_FERTILITY_BY_NATIONALITY]} margin={{ top: 8, right: 12, left: 0, bottom: 2 }}>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.07)" />
            <XAxis dataKey="year" ticks={[2014, 2016, 2018, 2020, 2022, 2024]} tick={{ fill: '#a3a3a3', fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis domain={[0.9, 2.2]} ticks={[1, 1.3, 1.6, 2.1]} tick={{ fill: '#a3a3a3', fontSize: 10 }} tickLine={false} axisLine={false} width={30} />
            <ReferenceLine y={2.1} stroke="rgba(255,255,255,0.24)" strokeDasharray="3 4" />
            <ChartTooltip content={<ChartTooltipContent formatter={(value) => Number(value).toFixed(2)} labelFormatter={(label) => `Year ${String(label)}`} />} />
            <Line type="monotone" dataKey="total" stroke={TOTAL_COLOR} strokeWidth={2.3} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="spanish" stroke={SPAIN_COLOR} strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="foreign" stroke={FOREIGN_COLOR} strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
      <AccessibleDataTable
        caption="Spain fertility rate by mother's nationality, 2014 to 2024"
        headers={['Year', 'All mothers', 'Spanish nationality', 'Foreign nationality']}
        rows={SPAIN_FERTILITY_BY_NATIONALITY.map((point) => [point.year, point.total.toFixed(2), point.spanish.toFixed(2), point.foreign.toFixed(2)])}
      />
      <p className="mt-3 font-sans text-[10px] leading-relaxed text-neutral-500">Dashed guide: 2.1 replacement-level reference. Spain's 1.10 was the EU's second-lowest rate in 2024.</p>
      <SourceLink href={SPAIN_BIRTH_SOURCES.final2024}>Source: INE, final 2024 vital statistics</SourceLink>
    </Panel>
  );
}

function MaternityAgePanel() {
  return (
    <Panel title="Motherhood is shifting later" description="Mean age at maternity, with the official Spanish/foreign-nationality split.">
      <Legend items={[{ label: 'All', color: TOTAL_COLOR }, { label: 'Spanish', color: SPAIN_COLOR }, { label: 'Foreign', color: FOREIGN_COLOR }]} />
      <ChartContainer config={maternityAgeConfig} className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 420, height: 250 }}>
          <LineChart accessibilityLayer data={[...SPAIN_MATERNITY_AGE_BY_NATIONALITY]} margin={{ top: 8, right: 12, left: 0, bottom: 2 }}>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.07)" />
            <XAxis dataKey="year" ticks={[2014, 2016, 2018, 2020, 2022, 2024]} tick={{ fill: '#a3a3a3', fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis domain={[28, 34]} tickFormatter={(value) => `${value}`} tick={{ fill: '#a3a3a3', fontSize: 10 }} tickLine={false} axisLine={false} width={26} />
            <ChartTooltip content={<ChartTooltipContent formatter={(value) => `${Number(value).toFixed(1)} years`} labelFormatter={(label) => `Year ${String(label)}`} />} />
            <Line type="monotone" dataKey="total" stroke={TOTAL_COLOR} strokeWidth={2.3} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="spanish" stroke={SPAIN_COLOR} strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="foreign" stroke={FOREIGN_COLOR} strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
      <AccessibleDataTable
        caption="Mean age at maternity in Spain by mother's nationality, 2014 to 2024"
        headers={['Year', 'All mothers', 'Spanish nationality', 'Foreign nationality']}
        rows={SPAIN_MATERNITY_AGE_BY_NATIONALITY.map((point) => [point.year, point.total.toFixed(1), point.spanish.toFixed(1), point.foreign.toFixed(1)])}
      />
      <p className="mt-3 font-sans text-[10px] leading-relaxed text-neutral-500">In 2024 the mean was 32.6 years overall, 33.2 for Spanish nationals and 30.5 for foreign nationals.</p>
      <SourceLink href={SPAIN_BIRTH_SOURCES.eurostatDemography}>Context: Eurostat Demography of Europe 2026</SourceLink>
    </Panel>
  );
}

function MaternalOriginPanel() {
  const rows = [
    { label: 'Born abroad', value: 33.3, count: '105,814', color: FOREIGN_COLOR, detail: 'mother\'s country of birth' },
    { label: 'Foreign nationality', value: 25.6, count: '81,339', color: '#7a9fe6', detail: 'mother\'s citizenship' },
  ];
  return (
    <Panel title="Maternal origin, two different measures" description="Birthplace and nationality answer different questions. The dashboard keeps them separate rather than treating either as ethnicity.">
      <div className="space-y-6">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="font-sans text-[11px] font-medium text-neutral-200">{row.label}</p>
                <p className="mt-0.5 font-sans text-[10px] text-neutral-500">{row.detail}</p>
              </div>
              <div className="text-right">
                <p className="font-sans text-xl font-semibold tabular-nums text-white">{row.value}%</p>
                <p className="font-sans text-[10px] tabular-nums text-neutral-500">{row.count} births</p>
              </div>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-sm bg-white/[0.07]" role="img" aria-label={`${row.label}: ${row.value}% of births in 2024`}>
              <div className="h-full rounded-sm" style={{ width: `${row.value}%`, backgroundColor: row.color }} />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 border-l-2 border-amber-300/60 pl-3 font-sans text-[10px] leading-relaxed text-neutral-400">2023 to 2024: the foreign-born-mother share rose from 31.3% to 33.3%; the foreign-nationality share rose from 24.4% to 25.6%.</p>
      <SourceLink href={SPAIN_BIRTH_SOURCES.final2024}>Source: INE, final 2024 vital statistics</SourceLink>
    </Panel>
  );
}

function MotherAgeMixPanel() {
  return (
    <Panel title="Age mix of mothers" description="Share of all births by broad maternal-age group, 2015 versus provisional 2025.">
      <div className="space-y-5">
        {SPAIN_MOTHER_AGE_COMPARISON.map((row) => (
          <div key={row.age}>
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-sans text-[11px] font-medium text-neutral-200">{row.age}</p>
              <p className="font-sans text-[10px] tabular-nums text-neutral-500">{NUMBER.format(row.births2025)} births in 2025</p>
            </div>
            <div className="mt-2 grid grid-cols-[34px_1fr_42px] items-center gap-2">
              <span className="font-sans text-[9px] text-neutral-600">2015</span>
              <div className="h-2 rounded-sm bg-white/[0.06]"><div className="h-full rounded-sm bg-neutral-500" style={{ width: `${row.share2015}%` }} /></div>
              <span className="text-right font-sans text-[10px] tabular-nums text-neutral-400">{row.share2015}%</span>
              <span className="font-sans text-[9px] text-neutral-500">2025</span>
              <div className="h-2 rounded-sm bg-white/[0.06]"><div className="h-full rounded-sm bg-amber-300" style={{ width: `${row.share2025}%` }} /></div>
              <span className="text-right font-sans text-[10px] tabular-nums text-amber-100">{row.share2025}%</span>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 font-sans text-[10px] leading-relaxed text-neutral-500">Births to mothers aged 40+ increased in number even as total births fell by nearly 100,000.</p>
      <SourceLink href={SPAIN_BIRTH_SOURCES.provisional2025}>Source: INE monthly births estimate, 2025</SourceLink>
    </Panel>
  );
}

function MonthlyPanel() {
  return (
    <Panel title="2025 monthly pulse" description="Provisional births registered by month. October was the year's high; February was the low.">
      <ChartContainer config={monthlyConfig} className="h-[245px] w-full">
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 420, height: 245 }}>
          <BarChart accessibilityLayer data={[...SPAIN_2025_MONTHLY_BIRTHS]} margin={{ top: 8, right: 8, left: 0, bottom: 2 }}>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.07)" />
            <XAxis dataKey="month" interval={1} tick={{ fill: '#a3a3a3', fontSize: 9 }} tickLine={false} axisLine={false} />
            <YAxis domain={[20_000, 30_000]} ticks={[20_000, 25_000, 30_000]} tickFormatter={(value) => `${Number(value) / 1_000}k`} tick={{ fill: '#a3a3a3', fontSize: 10 }} tickLine={false} axisLine={false} width={32} />
            <ChartTooltip content={<ChartTooltipContent formatter={(value) => NUMBER.format(Number(value))} />} />
            <Bar dataKey="births" radius={[2, 2, 0, 0]} isAnimationActive={false}>
              {SPAIN_2025_MONTHLY_BIRTHS.map((point) => <Cell key={point.month} fill={point.month === 'Oct' ? '#f7d38b' : BIRTH_COLOR} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
      <AccessibleDataTable
        caption="Provisional monthly births in Spain, 2025"
        headers={['Month', 'Births']}
        rows={SPAIN_2025_MONTHLY_BIRTHS.map((point) => [point.month, NUMBER.format(point.births)])}
      />
      <SourceLink href={SPAIN_BIRTH_SOURCES.provisional2025}>Source: INE monthly births estimate, 2025</SourceLink>
    </Panel>
  );
}

function NaturalBalancePanel() {
  return (
    <Panel title="Births are below deaths" description="National births minus deaths as shown in INE's 2025 regional table. The latest year remains provisional.">
      <ChartContainer config={balanceConfig} className="h-[245px] w-full">
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 420, height: 245 }}>
          <BarChart accessibilityLayer data={[...SPAIN_NATURAL_BALANCE]} margin={{ top: 8, right: 8, left: 0, bottom: 2 }}>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.07)" />
            <XAxis dataKey="year" ticks={[2015, 2017, 2019, 2021, 2023, 2025]} tick={{ fill: '#a3a3a3', fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis domain={[-170_000, 20_000]} ticks={[-150_000, -100_000, -50_000, 0]} tickFormatter={(value) => value === 0 ? '0' : `${Number(value) / 1_000}k`} tick={{ fill: '#a3a3a3', fontSize: 10 }} tickLine={false} axisLine={false} width={44} />
            <ReferenceLine y={0} stroke="rgba(255,255,255,0.28)" />
            <ChartTooltip content={<ChartTooltipContent formatter={(value) => NUMBER.format(Number(value))} labelFormatter={(label) => `Year ${String(label)}`} />} />
            <Bar dataKey="balance" radius={[2, 2, 0, 0]} isAnimationActive={false}>
              {SPAIN_NATURAL_BALANCE.map((point) => <Cell key={point.year} fill={point.balance >= 0 ? '#57b89a' : 'provisional' in point && point.provisional ? '#f0a79f' : '#d9685f'} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
      <AccessibleDataTable
        caption="Natural population change in Spain, 2015 to 2025"
        headers={['Year', 'Births minus deaths', 'Status']}
        rows={SPAIN_NATURAL_BALANCE.map((point) => [point.year, NUMBER.format(point.balance), 'provisional' in point && point.provisional ? 'Provisional' : 'Final'])}
      />
      <p className="mt-3 font-sans text-[10px] leading-relaxed text-neutral-500">Spain's population can still grow through net migration; this panel isolates only births minus deaths.</p>
      <SourceLink href={SPAIN_BIRTH_SOURCES.provisional2025}>Source: INE, natural population change</SourceLink>
    </Panel>
  );
}

function RegionalPanel() {
  const maxBirths = Math.max(...SPAIN_2025_REGIONAL_BIRTHS.map((row) => row.births));
  return (
    <Panel title="Where the 2025 births were registered" description="Ten largest autonomous-community totals. Bars show volume; the right column shows annual change." className="lg:col-span-2">
      <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
        {SPAIN_2025_REGIONAL_BIRTHS.map((row) => (
          <div key={row.region} className="grid grid-cols-[minmax(0,1fr)_58px] items-end gap-3">
            <div className="min-w-0">
              <div className="flex items-baseline justify-between gap-3">
                <p className="truncate font-sans text-[10px] font-medium text-neutral-300">{row.region}</p>
                <p className="font-sans text-[10px] tabular-nums text-neutral-500">{NUMBER.format(row.births)}</p>
              </div>
              <div className="mt-1.5 h-1.5 rounded-sm bg-white/[0.06]">
                <div className="h-full rounded-sm bg-amber-300/80" style={{ width: `${(row.births / maxBirths) * 100}%` }} />
              </div>
            </div>
            <p className={`text-right font-sans text-[11px] font-semibold tabular-nums ${row.change >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
              {row.change >= 0 ? '+' : ''}{row.change.toFixed(1)}%
            </p>
          </div>
        ))}
      </div>
      <p className="mt-5 font-sans text-[10px] leading-relaxed text-neutral-500">Largest increases across all regions: Madrid +3.3% and Basque Country +3.0%. Largest decreases: Melilla -10.1%, Ceuta -6.6%, Balearic Islands -2.6%.</p>
      <SourceLink href={SPAIN_BIRTH_SOURCES.provisional2025}>Source: INE, 2025 autonomous-community estimates</SourceLink>
    </Panel>
  );
}

export const SpainBirthRatesSection = memo(function SpainBirthRatesSection() {
  return (
    <section className="overflow-hidden rounded-md border border-line bg-surface-metric shadow-card" aria-labelledby="spain-birth-rates-title">
      <header className="border-b border-white/[0.07] bg-black/25 px-4 py-5 sm:px-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className={LABEL}>Spain · Demography · 2000-2025</p>
            <h3 id="spain-birth-rates-title" className="mt-2 font-sans text-2xl font-semibold tracking-tight text-white sm:text-3xl">Births &amp; fertility</h3>
            <p className="mt-2 max-w-[72ch] font-sans text-[11px] leading-relaxed text-neutral-400">A final-data baseline through 2024 plus the latest 2025 civil-register estimate. Official nationality and country-of-birth categories are shown as published; no racial proxy or modeled series is used.</p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded border border-amber-300/20 bg-amber-300/[0.07] px-3 py-2 font-sans text-[10px] text-amber-100">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-300" aria-hidden /> 2025 data provisional
          </span>
        </div>
        <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded border border-white/[0.07] bg-white/[0.07] lg:grid-cols-4">
          {[
            ['Births', '321,164', '+1.0% vs 2024 · provisional'],
            ['Crude birth rate', '6.5', 'per 1,000 people · 2024'],
            ['Fertility rate', '1.10', 'children per woman · 2024'],
            ['Mean maternity age', '32.6', 'years · 2024'],
          ].map(([label, value, detail]) => (
            <div key={label} className="min-w-0 bg-neutral-950 px-3 py-3.5 sm:px-4">
              <dt className={LABEL}>{label}</dt>
              <dd className="mt-1.5 font-sans text-2xl font-semibold tabular-nums tracking-tight text-white">{value}</dd>
              <p className="mt-0.5 font-sans text-[9px] leading-relaxed text-neutral-500">{detail}</p>
            </div>
          ))}
        </dl>
      </header>

      <div className="grid grid-cols-1 gap-4 p-4 sm:p-5 lg:grid-cols-2">
        <TotalBirthsPanel />
        <FertilityPanel />
        <MaternityAgePanel />
        <MaternalOriginPanel />
        <MotherAgeMixPanel />
        <MonthlyPanel />
        <NaturalBalancePanel />
        <RegionalPanel />
      </div>

      <footer className="border-t border-white/[0.07] bg-black/20 px-4 py-4 sm:px-5">
        <p className="font-sans text-[10px] leading-relaxed text-neutral-500"><span className="font-medium text-neutral-300">Method.</span> Annual totals count births occurring in Spain. Fertility, maternity-age, crude-rate and natural-change indicators follow each official source's stated population scope. Final INE data are not mixed with the 2025 estimate without an explicit provisional label.</p>
      </footer>
    </section>
  );
});
