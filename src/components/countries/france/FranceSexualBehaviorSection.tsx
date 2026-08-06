import { memo, type ReactNode } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '../../ui/chart';

const ACTIVITY_SOURCE = 'https://csf.inserm.fr/resultats/activites-sexuelles/';
const DIGITAL_SOURCE = 'https://csf.inserm.fr/resultats/sexualites-et-numerique/';
const HEALTH_SOURCE = 'https://csf.inserm.fr/resultats/sante-sexuelle/';
const METHOD_SOURCE = 'https://csf.inserm.fr/enquete/';
const DYSFUNCTION_SOURCE = 'https://www.santepubliquefrance.fr/sante-sexuelle/article/dysfonctions-sexuelles-chez-les-personnes-sexuellement-actives-en-france-et-impact-sur-la';

const genderConfig = {
  women: { label: 'Women', color: '#e879f9' },
  men: { label: 'Men', color: '#38bdf8' },
} satisfies ChartConfig;

const firstSex = [
  { period: '1959-63', women: 20.1, men: 18.8 },
  { period: '2004-08', women: 17.3, men: 17.3 },
  { period: '2019-23', women: 18.2, men: 17.7 },
] as const;

const lifetimePartners = [
  { year: '1992', women: 3.4, men: 11.2 },
  { year: '2006', women: 4.5, men: 11.9 },
  { year: '2023', women: 7.9, men: 16.4 },
] as const;

const multiplePartners = [
  { year: '1992', women: 9.6, men: 22.9 },
  { year: '2006', women: 19.3, men: 29.0 },
  { year: '2023', women: 23.9, men: 32.3 },
] as const;

const activePastYear = [
  { year: '1992', women: 86.4, men: 92.1 },
  { year: '2006', women: 82.9, men: 89.1 },
  { year: '2023', women: 77.2, men: 81.6 },
] as const;

const frequencyFourWeeks = [
  { year: '1992', women: 8.1, men: 9.0 },
  { year: '2006', women: 8.6, men: 8.7 },
  { year: '2023', women: 6.0, men: 6.7 },
] as const;

const practiceRepertoire = [
  { label: 'Masturbation', women: 72.9, men: 92.6 },
  { label: 'Fellatio', women: 84.4, men: 90.5 },
  { label: 'Cunnilingus', women: 86.9, men: 87.7 },
  { label: 'Anal intercourse', women: 38.9, men: 57.4 },
] as const;

const digitalExperiences = [
  { label: 'Any online sexual experience', women: 33.0, men: 46.6 },
  { label: 'Met a sexual partner online', women: 17.9, men: 23.7 },
  { label: 'Sent an intimate image', women: 13.8, men: 17.9 },
  { label: 'Harmful online experience', women: 13.1, men: 12.8 },
] as const;

const healthIndicators = [
  { label: 'Condom with a new partner', women: 49.4, men: 52.6 },
  { label: 'Very satisfied with sex life', women: 45.3, men: 39.0 },
  { label: 'Persistent sexual dysfunction', women: 36.4, men: 18.9 },
  { label: 'Dysfunction causing distress', women: 21.2, men: 10.9 },
] as const;

function SourceLink({ href, label = 'Inserm / ANRS-MIE, CSF-2023' }: { href: string; label?: string }) {
  return (
    <a
      href={href}
      target={'_blank'}
      rel={'noreferrer'}
      className={'inline-flex min-h-11 items-center text-xs text-[var(--uk-accent)] underline-offset-2 transition-colors hover:text-neutral-100 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--uk-accent)]'}
    >
      {label} - source
    </a>
  );
}

function SectionCard({ title, description, children, source = ACTIVITY_SOURCE }: {
  title: string;
  description: string;
  children: ReactNode;
  source?: string;
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
        <SourceLink href={source} />
      </CardContent>
    </Card>
  );
}

function GenderLineChart({ data, xKey, valueSuffix = '', domain, ariaLabel }: {
  data: readonly Record<string, string | number>[];
  xKey: string;
  valueSuffix?: string;
  domain?: [number, number];
  ariaLabel: string;
}) {
  return (
    <div role={'img'} aria-label={ariaLabel}>
      <ChartContainer config={genderConfig} className={'h-[260px] w-full'}>
      <ResponsiveContainer width={'100%'} height={'100%'} initialDimension={{ width: 320, height: 240 }}>
        <LineChart data={[...data]} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
          <CartesianGrid stroke={'rgba(255,255,255,0.06)'} vertical={false} />
          <XAxis
            dataKey={xKey}
            tick={{ fill: 'rgba(163,163,163,0.95)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={domain}
            tick={{ fill: 'rgba(163,163,163,0.95)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={38}
          />
          <ChartTooltip
            cursor={{ stroke: 'rgba(255,255,255,0.16)' }}
            content={
              <ChartTooltipContent
                className={'rounded-md'}
                formatter={(value) => String(Number(value).toFixed(1)) + valueSuffix}
              />
            }
          />
          <Legend wrapperStyle={{ fontSize: '12px', color: 'rgba(212,212,212,0.95)' }} iconType={'line'} />
          <Line type={'monotone'} dataKey={'women'} name={'Women'} stroke={'#e879f9'} strokeWidth={2.4} dot={{ r: 3 }} isAnimationActive={false} />
          <Line type={'monotone'} dataKey={'men'} name={'Men'} stroke={'#38bdf8'} strokeWidth={2.4} dot={{ r: 3 }} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}

function GenderBarChart({ data, ariaLabel }: {
  data: readonly { label: string; women: number; men: number }[];
  ariaLabel: string;
}) {
  return (
    <div role={'img'} aria-label={ariaLabel}>
      <ChartContainer config={genderConfig} className={'h-[300px] w-full'}>
      <ResponsiveContainer width={'100%'} height={'100%'} initialDimension={{ width: 320, height: 240 }}>
        <BarChart data={[...data]} margin={{ top: 8, right: 10, left: 0, bottom: 52 }}>
          <CartesianGrid stroke={'rgba(255,255,255,0.06)'} vertical={false} />
          <XAxis
            dataKey={'label'}
            interval={0}
            angle={-22}
            textAnchor={'end'}
            height={72}
            tick={{ fill: 'rgba(163,163,163,0.95)', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(value) => String(value) + '%'}
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
                formatter={(value) => String(Number(value).toFixed(1)) + '%'}
              />
            }
          />
          <Legend wrapperStyle={{ fontSize: '12px', color: 'rgba(212,212,212,0.95)' }} />
          <Bar dataKey={'women'} name={'Women'} fill={'#e879f9'} radius={[3, 3, 0, 0]} isAnimationActive={false} />
          <Bar dataKey={'men'} name={'Men'} fill={'#38bdf8'} radius={[3, 3, 0, 0]} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}

function SurveyOverviewCard() {
  const facts = [
    ['31,518', 'participants aged 15-89'],
    ['21,259', 'participants in metropolitan France'],
    ['2022-23', '12-month data collection'],
  ] as const;

  return (
    <Card className={'border-line bg-surface-metric shadow-card lg:col-span-2'}>
      <CardHeader className={'space-y-1 p-4 pb-2 sm:p-5'}>
        <CardTitle className={'text-sm font-semibold uppercase tracking-[0.06em] text-neutral-100'}>
          France national sexuality survey
        </CardTitle>
        <CardDescription className={'text-xs leading-relaxed text-neutral-400'}>
          CSF-2023 is France&apos;s largest national sexuality study. Indicators below are weighted estimates for
          metropolitan France and use published observation years only.
        </CardDescription>
      </CardHeader>
      <CardContent className={'grid gap-3 p-4 pt-0 sm:grid-cols-3 sm:p-5 sm:pt-0'}>
        {facts.map(([value, label]) => (
          <div key={label} className={'rounded-md border border-white/[0.07] bg-black/10 p-3'}>
            <div className={'text-xl font-semibold tabular-nums text-neutral-50'}>{value}</div>
            <div className={'mt-1 text-xs leading-relaxed text-neutral-400'}>{label}</div>
          </div>
        ))}
        <div className={'sm:col-span-3'}>
          <SourceLink href={METHOD_SOURCE} label={'Inserm CSF-2023 methodology'} />
        </div>
      </CardContent>
    </Card>
  );
}

export const FranceSexualBehaviorSection = memo(function FranceSexualBehaviorSection() {
  return (
    <div className={'grid grid-cols-1 gap-3 lg:grid-cols-2'}>
      <SurveyOverviewCard />
      <SectionCard
        title={'Median age at first intercourse'}
        description={'Age by cohort period; population total.'}
      >
        <GenderLineChart
          data={firstSex}
          xKey={'period'}
          ariaLabel={'Median age at first intercourse in France by sex and cohort period'}
        />
      </SectionCard>
      <SectionCard
        title={'Lifetime sexual partners'}
        description={'Mean among sexually experienced adults aged 18-69.'}
      >
        <GenderLineChart
          data={lifetimePartners}
          xKey={'year'}
          ariaLabel={'Mean lifetime sexual partners in France by sex'}
        />
      </SectionCard>
      <SectionCard
        title={'Multiple partners in the past year'}
        description={'Share of adults aged 18-29 reporting more than one partner.'}
      >
        <GenderLineChart
          data={multiplePartners}
          xKey={'year'}
          valueSuffix={'%'}
          domain={[0, 40]}
          ariaLabel={'Multiple sexual partners in the past year among French adults aged 18 to 29'}
        />
      </SectionCard>
      <SectionCard
        title={'Sexually active in the past year'}
        description={'Share of adults aged 18-69 with partnered sexual activity.'}
      >
        <GenderLineChart
          data={activePastYear}
          xKey={'year'}
          valueSuffix={'%'}
          domain={[70, 100]}
          ariaLabel={'Sexual activity in the past year among French adults aged 18 to 69'}
        />
      </SectionCard>
      <SectionCard
        title={'Frequency in the past four weeks'}
        description={'Mean encounters among adults aged 18-69 active in the past year.'}
      >
        <GenderLineChart
          data={frequencyFourWeeks}
          xKey={'year'}
          domain={[0, 10]}
          ariaLabel={'Mean sexual frequency during the past four weeks in France by sex'}
        />
      </SectionCard>
      <SectionCard
        title={'Lifetime practice repertoire'}
        description={'Share of adults aged 18-69 who have ever reported each practice, 2023.'}
      >
        <GenderBarChart data={practiceRepertoire} ariaLabel={'Lifetime sexual practices in France in 2023 by sex'} />
      </SectionCard>
      <SectionCard
        title={'Sexuality and digital spaces'}
        description={'Lifetime prevalence among adults aged 18-89, 2023.'}
        source={DIGITAL_SOURCE}
      >
        <GenderBarChart data={digitalExperiences} ariaLabel={'Online sexual experiences in France in 2023 by sex'} />
      </SectionCard>
      <SectionCard
        title={'Sexual health and satisfaction'}
        description={'Selected CSF-2023 indicators; the condom measure concerns a new partner in the past year.'}
        source={HEALTH_SOURCE}
      >
        <GenderBarChart data={healthIndicators} ariaLabel={'Sexual health and satisfaction indicators in France by sex'} />
        <p className={'text-xs leading-relaxed text-neutral-500'}>
          Dysfunction estimates use CSF-2023 and are reported by Sante publique France.
        </p>
        <SourceLink href={DYSFUNCTION_SOURCE} label={'Sante publique France: sexual dysfunctions'} />
      </SectionCard>
    </div>
  );
});
