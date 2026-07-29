import { memo, type ReactNode } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from './ui/chart';

const CENSIS_RELEASE_SOURCE =
  'https://www.censis.it/il-sesso-e-gli-italiani-sperimentare-si-ma-meglio-se-in-una-relazione-stabile/';
const CENSIS_INFOGRAPHIC_SOURCE =
  'https://www.censis.it/wp-content/uploads/2026/03/Sito-Il-piacere-degli-italiani.pdf';
const ISS_HBSC_SOURCE =
  'https://www.epicentro.iss.it/hbsc/rapporto-internazionale2021-2022-salute-sessuale';

const genderConfig = {
  women: { label: 'Women', color: '#e879f9' },
  men: { label: 'Men', color: '#38bdf8' },
} satisfies ChartConfig;

const yearConfig = {
  year2000: { label: '2000', color: '#737373' },
  year2025: { label: '2025', color: '#38bdf8' },
} satisfies ChartConfig;

const ageConfig = {
  adults: { label: 'All adults 18-60', color: '#a78bfa' },
  youngAdults: { label: 'Adults 18-34', color: '#38bdf8' },
} satisfies ChartConfig;

const digitalAgeConfig = {
  age18to34: { label: '18-34', color: '#38bdf8' },
  age35to44: { label: '35-44', color: '#a78bfa' },
  age45to60: { label: '45-60', color: '#f59e0b' },
} satisfies ChartConfig;

const adolescentConfig = {
  intercourse: { label: 'Had sexual intercourse', color: '#e879f9' },
  condom: { label: 'Condom at last intercourse', color: '#22c55e' },
} satisfies ChartConfig;

const firstIntercourseBefore18 = [
  { year: '2000', women: 29.3, men: 46.7 },
  { year: '2025', women: 35.8, men: 29.4 },
] as const;

const womenLifetimePartners = [
  { category: 'One', year2000: 59.6, year2025: 27.6 },
  { category: '2-5', year2000: 32.0, year2025: 46.8 },
  { category: '6+', year2000: 8.4, year2025: 21.8 },
] as const;

const menLifetimePartners = [
  { category: 'One', year2000: 24.9, year2025: 15.2 },
  { category: '2-5', year2000: 42.3, year2025: 46.0 },
  { category: '6+', year2000: 32.8, year2025: 33.7 },
] as const;

const groupSexExperience = [
  { year: '2000', women: 0.7, men: 3.2 },
  { year: '2025', women: 6.8, men: 20.1 },
] as const;

const partnerArrangement = [
  { category: 'Stable partner only', value: 80.4 },
  { category: 'Occasional only', value: 12.0 },
  { category: 'Stable + occasional', value: 6.2 },
] as const;

const sexualFrequency = [
  { category: 'Every day', adults: 7.9, youngAdults: 5.3 },
  { category: '2-3× weekly', adults: 34.4, youngAdults: 29.9 },
  { category: 'Weekly', adults: 30.1, youngAdults: 27.3 },
  { category: 'Every 1-4 months', adults: 17.4, youngAdults: 21.9 },
  { category: 'Every 5-6+ months', adults: 3.8, youngAdults: 7.1 },
  { category: 'Never', adults: 6.4, youngAdults: 8.5 },
] as const;

const digitalBehavior = [
  { category: 'Received explicit images', age18to34: 37.0, age35to44: 32.2, age45to60: 26.9 },
  { category: 'Sexting', age18to34: 43.4, age35to44: 33.6, age45to60: 19.2 },
  { category: 'Sent explicit images', age18to34: 31.2, age35to44: 21.8, age45to60: 14.3 },
  { category: 'Remote mutual activity', age18to34: 28.3, age35to44: 23.8, age45to60: 14.5 },
  { category: 'Recorded during sex', age18to34: 15.9, age35to44: 17.9, age45to60: 11.6 },
] as const;

const adolescentSexualHealth = [
  { group: 'Boys, 15', intercourse: 21.6, condom: 69.4 },
  { group: 'Girls, 15', intercourse: 18.4, condom: 61.6 },
  { group: 'Boys, 17', intercourse: 42.5, condom: 65.9 },
  { group: 'Girls, 17', intercourse: 43.6, condom: 56.8 },
] as const;

function SourceLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target={'_blank'}
      rel={'noreferrer'}
      className={
        'inline-flex min-h-11 items-center text-xs text-[var(--uk-accent)] underline-offset-2 transition-colors hover:text-neutral-100 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--uk-accent)]'
      }
    >
      {label} - source
    </a>
  );
}

function SectionCard({
  title,
  description,
  children,
  source = CENSIS_INFOGRAPHIC_SOURCE,
  sourceLabel = 'Censis, Il piacere degli italiani (2025)',
}: {
  title: string;
  description: string;
  children: ReactNode;
  source?: string;
  sourceLabel?: string;
}) {
  return (
    <Card className={'overflow-hidden border-line bg-surface-metric shadow-card'}>
      <CardHeader className={'space-y-1 p-4 pb-2 sm:p-5 sm:pb-3'}>
        <CardTitle className={'font-sans text-sm font-semibold uppercase tracking-[0.06em] text-neutral-100'}>
          {title}
        </CardTitle>
        <CardDescription className={'font-sans text-xs leading-relaxed text-neutral-400'}>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className={'space-y-3 p-4 pt-0 sm:p-5 sm:pt-0'}>
        {children}
        <SourceLink href={source} label={sourceLabel} />
      </CardContent>
    </Card>
  );
}

function PercentLineChart({
  data,
  ariaLabel,
  domain = [0, 60],
}: {
  data: readonly { year: string; women: number; men: number }[];
  ariaLabel: string;
  domain?: [number, number];
}) {
  return (
    <div role={'img'} aria-label={ariaLabel}>
      <ChartContainer config={genderConfig} className={'h-[260px] w-full'}>
        <ResponsiveContainer width={'100%'} height={'100%'}>
          <LineChart data={[...data]} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
            <CartesianGrid stroke={'rgba(255,255,255,0.06)'} vertical={false} />
            <XAxis
              dataKey={'year'}
              tick={{ fill: 'rgba(163,163,163,0.95)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={domain}
              tickFormatter={(value) => `${value}%`}
              tick={{ fill: 'rgba(163,163,163,0.95)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={42}
            />
            <ChartTooltip
              cursor={{ stroke: 'rgba(255,255,255,0.16)' }}
              content={
                <ChartTooltipContent
                  className={'rounded-md'}
                  formatter={(value) => `${Number(value).toFixed(1)}%`}
                />
              }
            />
            <Legend wrapperStyle={{ fontSize: '12px', color: 'rgba(212,212,212,0.95)' }} iconType={'line'} />
            <Line type={'linear'} dataKey={'women'} name={'Women'} stroke={'#e879f9'} strokeWidth={2.4} dot={{ r: 4 }} isAnimationActive={false} />
            <Line type={'linear'} dataKey={'men'} name={'Men'} stroke={'#38bdf8'} strokeWidth={2.4} dot={{ r: 4 }} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}

function GroupedPercentBarChart({
  data,
  config,
  bars,
  ariaLabel,
  height = 300,
  angle = -18,
}: {
  data: readonly Record<string, string | number>[];
  config: ChartConfig;
  bars: readonly { key: string; label: string; color: string }[];
  ariaLabel: string;
  height?: number;
  angle?: number;
}) {
  return (
    <div role={'img'} aria-label={ariaLabel}>
      <div style={{ height }}>
        <ChartContainer config={config} className={'h-full w-full'}>
          <ResponsiveContainer width={'100%'} height={'100%'}>
            <BarChart data={[...data]} margin={{ top: 8, right: 10, left: 0, bottom: angle === 0 ? 8 : 58 }}>
              <CartesianGrid stroke={'rgba(255,255,255,0.06)'} vertical={false} />
              <XAxis
                dataKey={'category'}
                interval={0}
                angle={angle}
                textAnchor={angle === 0 ? 'middle' : 'end'}
                height={angle === 0 ? 30 : 76}
                tick={{ fill: 'rgba(163,163,163,0.95)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                tick={{ fill: 'rgba(163,163,163,0.95)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={42}
              />
              <ChartTooltip
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                content={
                  <ChartTooltipContent
                    className={'rounded-md'}
                    formatter={(value) => `${Number(value).toFixed(1)}%`}
                  />
                }
              />
              <Legend wrapperStyle={{ fontSize: '12px', color: 'rgba(212,212,212,0.95)' }} />
              {bars.map((bar) => (
                <Bar
                  key={bar.key}
                  dataKey={bar.key}
                  name={bar.label}
                  fill={bar.color}
                  radius={[3, 3, 0, 0]}
                  isAnimationActive={false}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}

function SurveyOverviewCard() {
  const facts = [
    ['1,000', 'statistically representative respondents'],
    ['18-60', 'adult age range'],
    ['2000 / 2025', 'comparison years where available'],
  ] as const;

  return (
    <Card className={'border-line bg-surface-metric shadow-card lg:col-span-2'}>
      <CardHeader className={'space-y-1 p-4 pb-2 sm:p-5'}>
        <CardTitle className={'text-sm font-semibold uppercase tracking-[0.06em] text-neutral-100'}>
          Italy adult sexuality survey
        </CardTitle>
        <CardDescription className={'max-w-[72ch] text-xs leading-relaxed text-neutral-400'}>
          Censis&apos;s 2025 national survey supplies the adult indicators below. Published comparison values are
          shown only for 2000 and 2025; no intervening years are estimated.
        </CardDescription>
      </CardHeader>
      <CardContent className={'grid gap-3 p-4 pt-0 sm:grid-cols-3 sm:p-5 sm:pt-0'}>
        {facts.map(([value, label]) => (
          <div key={label} className={'rounded-md border border-white/[0.07] bg-black/10 p-3'}>
            <div className={'text-xl font-semibold tabular-nums text-neutral-50'}>{value}</div>
            <div className={'mt-1 text-xs leading-relaxed text-neutral-400'}>{label}</div>
          </div>
        ))}
        <div className={'flex flex-wrap gap-x-5 sm:col-span-3'}>
          <SourceLink href={CENSIS_RELEASE_SOURCE} label={'Censis press release and methodology'} />
          <SourceLink href={CENSIS_INFOGRAPHIC_SOURCE} label={'Censis published infographic'} />
        </div>
      </CardContent>
    </Card>
  );
}

export const ItalySexualBehaviorSection = memo(function ItalySexualBehaviorSection() {
  return (
    <div className={'grid grid-cols-1 gap-3 lg:grid-cols-2'}>
      <SurveyOverviewCard />

      <SectionCard
        title={'First intercourse before age 18'}
        description={'Share of adults aged 18-60 reporting sexual initiation before their 18th birthday.'}
      >
        <PercentLineChart
          data={firstIntercourseBefore18}
          ariaLabel={'Share of Italian adults reporting first sexual intercourse before age 18 by sex in 2000 and 2025'}
        />
      </SectionCard>

      <SectionCard
        title={'Women: lifetime partner count'}
        description={'Distribution of reported lifetime sexual partners among women; published categories do not sum to 100% in 2025 because “do not remember” is omitted.'}
      >
        <GroupedPercentBarChart
          data={womenLifetimePartners}
          config={yearConfig}
          bars={[
            { key: 'year2000', label: '2000', color: '#737373' },
            { key: 'year2025', label: '2025', color: '#38bdf8' },
          ]}
          ariaLabel={'Lifetime sexual partner count among Italian women in 2000 and 2025'}
          angle={0}
        />
      </SectionCard>

      <SectionCard
        title={'Men: lifetime partner count'}
        description={'Distribution of reported lifetime sexual partners among men; published categories do not sum to 100% in 2025 because “do not remember” is omitted.'}
      >
        <GroupedPercentBarChart
          data={menLifetimePartners}
          config={yearConfig}
          bars={[
            { key: 'year2000', label: '2000', color: '#737373' },
            { key: 'year2025', label: '2025', color: '#38bdf8' },
          ]}
          ariaLabel={'Lifetime sexual partner count among Italian men in 2000 and 2025'}
          angle={0}
        />
      </SectionCard>

      <SectionCard
        title={'Sex involving three or more people'}
        description={'Share of adults aged 18-60 who reported ever having had the experience.'}
      >
        <PercentLineChart
          data={groupSexExperience}
          ariaLabel={'Italian adults reporting sex involving three or more people by sex in 2000 and 2025'}
          domain={[0, 25]}
        />
      </SectionCard>

      <SectionCard
        title={'Partner pattern and sexual satisfaction'}
        description={'Current sexual-partner pattern among adults aged 18-60 in 2025. Satisfaction figures are shown separately below.'}
        source={CENSIS_RELEASE_SOURCE}
      >
        <GroupedPercentBarChart
          data={partnerArrangement}
          config={{ value: { label: 'Adults', color: '#a78bfa' } }}
          bars={[{ key: 'value', label: 'Adults', color: '#a78bfa' }]}
          ariaLabel={'Current sexual partner arrangements among Italian adults in 2025'}
          height={320}
        />
        <div className={'grid gap-3 sm:grid-cols-2'}>
          <div className={'rounded-md border border-white/[0.07] bg-black/10 p-3'}>
            <div className={'text-xl font-semibold tabular-nums text-neutral-50'}>68.9%</div>
            <div className={'mt-1 text-xs leading-relaxed text-neutral-400'}>satisfied, stable relationship</div>
          </div>
          <div className={'rounded-md border border-white/[0.07] bg-black/10 p-3'}>
            <div className={'text-xl font-semibold tabular-nums text-neutral-50'}>29.8%</div>
            <div className={'mt-1 text-xs leading-relaxed text-neutral-400'}>satisfied, single</div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title={'Sexual frequency'}
        description={'Self-reported frequency in 2025. “Sexual relations” includes complete and incomplete encounters.'}
      >
        <GroupedPercentBarChart
          data={sexualFrequency}
          config={ageConfig}
          bars={[
            { key: 'adults', label: 'All adults 18-60', color: '#a78bfa' },
            { key: 'youngAdults', label: 'Adults 18-34', color: '#38bdf8' },
          ]}
          ariaLabel={'Self-reported sexual frequency among Italian adults in 2025'}
          height={360}
        />
      </SectionCard>

      <SectionCard
        title={'Sexuality in digital spaces'}
        description={'Share of adults reporting each behavior in 2025, by age group.'}
        source={CENSIS_RELEASE_SOURCE}
      >
        <GroupedPercentBarChart
          data={digitalBehavior}
          config={digitalAgeConfig}
          bars={[
            { key: 'age18to34', label: '18-34', color: '#38bdf8' },
            { key: 'age35to44', label: '35-44', color: '#a78bfa' },
            { key: 'age45to60', label: '45-60', color: '#f59e0b' },
          ]}
          ariaLabel={'Digital sexual behaviors among Italian adults by age group in 2025'}
          height={360}
        />
        <p className={'text-xs leading-relaxed text-neutral-500'}>
          Separately, 32.5% of adults reported meeting a sexual partner through social media.
        </p>
      </SectionCard>

      <SectionCard
        title={'Adolescent sexual activity and condom use'}
        description={'HBSC Italy 2022. “Had intercourse” uses all respondents; condom use uses only sexually active respondents.'}
        source={ISS_HBSC_SOURCE}
        sourceLabel={'Istituto Superiore di Sanità / WHO HBSC Italy 2022'}
      >
        <GroupedPercentBarChart
          data={adolescentSexualHealth.map(({ group, ...values }) => ({ category: group, ...values }))}
          config={adolescentConfig}
          bars={[
            { key: 'intercourse', label: 'Had sexual intercourse', color: '#e879f9' },
            { key: 'condom', label: 'Condom at last intercourse', color: '#22c55e' },
          ]}
          ariaLabel={'Sexual intercourse and condom use among Italian adolescents by age and sex in 2022'}
          height={340}
        />
      </SectionCard>
    </div>
  );
});
