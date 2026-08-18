import { CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import {
  SPAIN_CITIZENSHIP_AGE_GROUPS,
  SPAIN_CITIZENSHIP_OPERATIONS_2025,
  SPAIN_CITIZENSHIP_PENDING_2026_H1,
  SPAIN_CITIZENSHIP_ROUTES,
  SPAIN_CITIZENSHIP_SERIES,
  SPAIN_CITIZENSHIP_SOURCES,
  SPAIN_CITIZENSHIP_TOTAL_2013_2025,
  SPAIN_PRIOR_NATIONALITY_DATA,
  SPAIN_PRIOR_NATIONALITY_RING_COLORS,
  SPAIN_RESIDENCE_GRANT_ROUTES,
} from '../../data/government/spainCitizenship';
import type { GermanyGovernmentPoliticsRow } from '../../lib/countries/germany/germanyGovernmentPolitics';
import { cn } from '../../lib/utils';
import { GOV_POLITICS_CARD_GRID, GovStatCard } from '../countries/germany/GermanyGovernmentPoliticsBlocks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '../ui/chart';

const UC_TITLE = 'uppercase tracking-[0.05em]';
const UC_LABEL = 'uppercase tracking-[0.04em]';
const UC_META = 'uppercase tracking-[0.03em]';

function statRow(
  metric: string,
  value: string,
  unit: string,
  referenceYear: string,
  sourceName: string,
  sourceUrl: string,
  notes: string,
): GermanyGovernmentPoliticsRow {
  return {
    section: 'Government',
    subsection: 'Citizenship',
    metric,
    submetric: '',
    breakdown: '',
    value,
    unit,
    referenceYear,
    sourceName,
    sourceUrl,
    notes,
  };
}

const seriesConfig = {
  total: { label: 'Resident acquisitions', color: '#60a5fa' },
} satisfies ChartConfig;

const ageConfig = SPAIN_CITIZENSHIP_AGE_GROUPS.reduce(
  (config, row) => {
    config[row.group] = { label: row.group, color: row.fill };
    return config;
  },
  { count: { label: 'Acquisitions' } } as ChartConfig,
);

const routeConfig = SPAIN_CITIZENSHIP_ROUTES.reduce(
  (config, row) => {
    config[row.group] = { label: row.group, color: row.fill };
    return config;
  },
  { count: { label: 'Acquisitions' } } as ChartConfig,
);

const residenceGrantRouteConfig = SPAIN_RESIDENCE_GRANT_ROUTES.reduce(
  (config, row) => {
    config[row.group] = { label: row.group, color: row.fill };
    return config;
  },
  { count: { label: 'Residence grants' } } as ChartConfig,
);

function DistributionCard({
  title,
  description,
  data,
  config,
}: {
  title: string;
  description: string;
  data: readonly { group: string; count: number; percentage: string; fill: string }[];
  config: ChartConfig;
}) {
  return (
    <Card className="overflow-hidden border-line bg-surface-metric">
      <CardHeader className="space-y-1 p-3 pb-2">
        <CardTitle className={`text-sm font-semibold text-neutral-100 ${UC_TITLE}`}>{title}</CardTitle>
        <CardDescription className={`text-[10px] leading-relaxed text-neutral-500 ${UC_META}`}>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <ChartContainer config={config} className="h-[230px] w-full">
          <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 320, height: 230 }}>
            <PieChart>
              <Pie
                data={[...data]}
                dataKey="count"
                nameKey="group"
                innerRadius="50%"
                outerRadius="78%"
                paddingAngle={1.5}
                stroke="rgba(0,0,0,0.4)"
                strokeWidth={1}
                isAnimationActive={false}
              >
                {data.map((row) => (
                  <Cell key={row.group} fill={row.fill} />
                ))}
              </Pie>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, _name, item) => {
                      const payload = (item as { payload?: { percentage?: string } })?.payload;
                      return `${Number(value).toLocaleString('en-US')} (${payload?.percentage ?? ''})`;
                    }}
                  />
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
          {data.map((row) => (
            <div key={row.group} className="flex items-center justify-between gap-3 font-sans text-[10px] text-neutral-400">
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <span className="h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: row.fill }} />
                <span className="truncate" title={row.group}>{row.group}</span>
              </span>
              <span className="shrink-0 tabular-nums text-neutral-200">
                {row.count.toLocaleString('en-US')} · {row.percentage}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PriorNationalityDataGrid() {
  const topTenTotal = SPAIN_PRIOR_NATIONALITY_DATA.reduce((sum, row) => sum + row.count, 0);
  const chartConfig = SPAIN_PRIOR_NATIONALITY_DATA.reduce(
    (config, row, index) => {
      config[row.name] = {
        label: row.name,
        color: SPAIN_PRIOR_NATIONALITY_RING_COLORS[index % SPAIN_PRIOR_NATIONALITY_RING_COLORS.length],
      };
      return config;
    },
    { count: { label: 'Acquisitions' } } as ChartConfig,
  );

  return (
    <Card className="overflow-hidden border-neutral-800 bg-black sm:col-span-2 lg:col-span-3">
      <CardHeader className="border-b border-neutral-800/90 p-4 pb-3">
        <CardTitle className={`text-sm font-semibold text-neutral-100 ${UC_TITLE}`}>
          Acquisitions by prior nationality
        </CardTitle>
        <CardDescription className={`text-[10px] leading-relaxed text-neutral-500 ${UC_META}`}>
          Top 10 prior nationalities · 2025 · shares use all 299,732 resident acquisitions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        <div className="relative mx-auto w-full max-w-md">
          <ChartContainer config={chartConfig} className="h-[min(56vw,280px)] min-h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 320, height: 240 }}>
              <PieChart>
                <Pie
                  data={[...SPAIN_PRIOR_NATIONALITY_DATA]}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="52%"
                  outerRadius="78%"
                  paddingAngle={1.2}
                  stroke="rgba(0,0,0,0.4)"
                  strokeWidth={1}
                  isAnimationActive={false}
                >
                  {SPAIN_PRIOR_NATIONALITY_DATA.map((row, index) => (
                    <Cell
                      key={row.name}
                      fill={SPAIN_PRIOR_NATIONALITY_RING_COLORS[index % SPAIN_PRIOR_NATIONALITY_RING_COLORS.length]}
                    />
                  ))}
                </Pie>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, _name, item) => {
                        const payload = (item as { payload?: { percentage?: string } })?.payload;
                        return `${Number(value).toLocaleString('en-US')} (${payload?.percentage ?? ''} of all acquisitions)`;
                      }}
                    />
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
            <p className="font-sans text-xl font-semibold tabular-nums text-white sm:text-2xl">
              {topTenTotal.toLocaleString('en-US')}
            </p>
            <p className={`mt-0.5 text-[10px] text-neutral-500 ${UC_META}`}>Top 10 · 70.4%</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded border border-neutral-800/80">
          <table className="w-full min-w-[420px] border-collapse text-[11px]">
            <thead>
              <tr className="text-left text-neutral-200">
                <th className="border border-neutral-800/90 bg-white/[0.04] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-neutral-400">Prior nationality</th>
                <th className="border border-neutral-800/90 bg-white/[0.04] px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.08em] text-neutral-400">Acquisitions</th>
                <th className="border border-neutral-800/90 bg-white/[0.04] px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.08em] text-neutral-400">Share of all</th>
              </tr>
            </thead>
            <tbody>
              {SPAIN_PRIOR_NATIONALITY_DATA.map((row, index) => (
                <tr key={row.name} className="bg-black/20 text-neutral-100">
                  <td className={cn('border border-neutral-800/90 px-4 py-3 font-medium', UC_LABEL)}>
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                        style={{ backgroundColor: SPAIN_PRIOR_NATIONALITY_RING_COLORS[index % SPAIN_PRIOR_NATIONALITY_RING_COLORS.length] }}
                      />
                      {row.name}
                    </span>
                  </td>
                  <td className="border border-neutral-800/90 px-4 py-3 text-right tabular-nums text-neutral-50">{row.count.toLocaleString('en-US')}</td>
                  <td className="border border-neutral-800/90 px-4 py-3 text-right tabular-nums text-neutral-300">{row.percentage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="font-sans text-[10px] leading-relaxed text-neutral-500">
          Source:{' '}
          <a href={SPAIN_CITIZENSHIP_SOURCES.ine.url} target="_blank" rel="noopener noreferrer" className="text-[var(--uk-accent)] hover:text-neutral-200">
            {SPAIN_CITIZENSHIP_SOURCES.ine.name} ↗
          </a>
        </p>
      </CardContent>
    </Card>
  );
}

export function SpainCitizenshipBlocks() {
  const ine = SPAIN_CITIZENSHIP_SOURCES.ine;
  const justice = SPAIN_CITIZENSHIP_SOURCES.justice;
  const civilCode = SPAIN_CITIZENSHIP_SOURCES.civilCode;
  const operations = SPAIN_CITIZENSHIP_OPERATIONS_2025;

  return (
    <div className="flex flex-col gap-4">
      <div className={GOV_POLITICS_CARD_GRID}>
        <GovStatCard
          row={statRow('Total resident acquisitions', String(SPAIN_CITIZENSHIP_TOTAL_2013_2025), 'acquisitions', '2013–2025', ine.name, ine.url, 'Sum of the complete comparable INE EANER series. The statistic covers foreign nationals resident in Spain who acquired Spanish nationality and excludes residents abroad and nationality of origin.')}
          title="Total Resident Acquisitions"
        />
        <GovStatCard
          row={statRow('Residence naturalization rate', '3.1', 'percent', '2025', SPAIN_CITIZENSHIP_SOURCES.opi.name, SPAIN_CITIZENSHIP_SOURCES.opi.url, 'Official OPI rate: residence-route grants in 2025 divided by people holding valid residence documentation at 31 December 2024.')}
          title="Residence Naturalization Rate"
        />
        <GovStatCard
          row={statRow('Statutory decision period', '12', 'months', 'Current law', SPAIN_CITIZENSHIP_SOURCES.procedure.name, SPAIN_CITIZENSHIP_SOURCES.procedure.url, 'The official maximum is one year from receipt by the competent directorate. This is a legal deadline, not a published observed average; silence after the deadline is treated as a rejection.')}
          title="Statutory Decision Period"
        />
      </div>

      <Card className="overflow-hidden border-line bg-surface-metric">
        <CardHeader className="space-y-1 p-3 pb-2">
          <CardTitle className={`text-sm font-semibold text-neutral-100 ${UC_TITLE}`}>Acquisitions per year</CardTitle>
          <CardDescription className={`text-[10px] leading-relaxed text-neutral-500 ${UC_META}`}>
            Definitive INE resident-acquisition series · 2013–2025 · 2025 was the series high
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <ChartContainer config={seriesConfig} className="h-[270px] w-full">
            <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 320, height: 270 }}>
              <LineChart data={[...SPAIN_CITIZENSHIP_SERIES]} margin={{ top: 10, right: 12, left: 8, bottom: 6 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={8} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} width={58} tick={{ fill: '#9ca3af', fontSize: 10 }} tickFormatter={(value) => `${Math.round(Number(value) / 1000)}k`} />
                <Line type="monotone" dataKey="total" stroke="#60a5fa" strokeWidth={2.3} dot={false} activeDot={{ r: 3.5 }} name="Resident acquisitions" isAnimationActive={false} />
                <ChartTooltip content={<ChartTooltipContent labelFormatter={(label) => `Year ${String(label ?? '')}`} formatter={(value) => Number(value).toLocaleString('en-US')} />} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
        <DistributionCard title="Acquisitions by age group" description="INE · all resident acquisitions · 2025" data={SPAIN_CITIZENSHIP_AGE_GROUPS} config={ageConfig} />
        <DistributionCard title="Acquisitions by legal route" description="INE · residence, option, and other routes · 2025" data={SPAIN_CITIZENSHIP_ROUTES} config={routeConfig} />
        <DistributionCard title="Residence grants by qualifying period" description="OPI · 221,176 residence-route grants · 2025" data={SPAIN_RESIDENCE_GRANT_ROUTES} config={residenceGrantRouteConfig} />
      </div>

      <div className={GOV_POLITICS_CARD_GRID}>
        <PriorNationalityDataGrid />
      </div>

      <div className={GOV_POLITICS_CARD_GRID}>
        <GovStatCard row={statRow('Latest resident acquisitions', '299732', 'people', '2025', ine.name, ine.url, 'Up 18.7% from 2024 and the highest annual total in the INE series. Women accounted for 55.4%.')} title="Latest Resident Acquisitions" />
        <GovStatCard row={statRow('Residence applications', String(operations.applications), 'applications', '2025', justice.name, justice.url, 'Full-year operational intake as revised in the Ministry of Justice extract dated 30 June 2026. Operational figures can be revised as paper files are digitized.')} title="Residence Applications" />
        <GovStatCard row={statRow('Pending residence cases', String(SPAIN_CITIZENSHIP_PENDING_2026_H1), 'cases', '30 June 2026', justice.name, justice.url, 'Unresolved residence-nationality files by application year. Of these, 143,655 were filed in 2026 and 90,120 in 2025.')} title="Pending Residence Cases" />
        <GovStatCard row={statRow('Granted decisions', String(operations.grants), '86.4% of resolutions', '2025', justice.name, justice.url, '221,284 grants among 256,219 formal resolutions in the Ministry operational extract. This is a same-year decision mix, not a cohort approval probability.')} title="Granted Decisions" />
        <GovStatCard row={statRow('Denied decisions', String(operations.denials), '9.7% of resolutions', '2025', justice.name, justice.url, '24,910 denials among 256,219 formal resolutions. A further 10,025 cases (3.9%) were formally archived.')} title="Denied Decisions" />
        <GovStatCard row={statRow('Average age at grant', '35', 'years', '2025 residence grants', SPAIN_CITIZENSHIP_SOURCES.opi.name, SPAIN_CITIZENSHIP_SOURCES.opi.url, 'Average age among recipients of Spanish nationality by residence in 2025; 66% were aged 18–49 and 56% were women.')} title="Average Age at Grant" />
        <GovStatCard row={statRow('Modal time in Spain', '6', 'years', '2025 acquisitions', ine.name, ine.url, 'The most frequent arrival year among 2025 acquirers who had lived abroad was 2019. This is a modal elapsed time, not an average residence duration.')} title="Modal Time in Spain" />
      </div>

      <div className={GOV_POLITICS_CARD_GRID}>
        <GovStatCard row={statRow('Residence requirements', '1 / 2 / 5 / 10', 'years', 'Current law', civilCode.name, civilCode.url, 'General route: 10 years. Refugees: 5. Nationals by origin of Ibero-American countries, Andorra, the Philippines, Equatorial Guinea or Portugal, and Sephardim: 2. Specified connections to Spain, including birth in Spain or one year of marriage to a Spanish citizen: 1.')} title="Residence Requirements" />
        <GovStatCard row={statRow('Dual nationality', 'Eligible groups', 'legal rule', 'Current law', civilCode.name, civilCode.url, 'Applicants generally declare renunciation of their prior nationality. Nationals of Ibero-American countries, Andorra, the Philippines, Equatorial Guinea or Portugal, and Sephardim, are exempt. Spain does not publish a complete annual count of retained prior nationalities.')} title="Dual Nationality" />
        <GovStatCard row={statRow('Loss / annulment count', 'Not published', 'national annual series', 'Current law', civilCode.name, civilCode.url, 'The Constitution bars deprivation of Spanish nationality of origin. Articles 24–25 regulate loss for other circumstances and annulment for fraud, but the official sources reviewed do not publish a consolidated annual national count.')} title="Loss / Annulment Count" />
      </div>
    </div>
  );
}
