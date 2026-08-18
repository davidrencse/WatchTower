import { memo, useCallback, useMemo, useState, type ReactNode } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { cn } from '../../../lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '../../ui/chart';
import { Separator } from '../../ui/separator';
import { NotableIncidentThumb, type IncidentImage } from '../../NotableIncidentThumb';

const ISTAT_HOMICIDE_2024 =
  'https://www.istat.it/comunicato-stampa/le-vittime-di-omicidio-anno-2024/';
const INTERIOR_HOMICIDE_ARCHIVE =
  'https://www.interno.gov.it/it/stampa-e-comunicazione/dati-e-statistiche/omicidi-volontari-e-violenza-genere-archivio';
const INTERIOR_HOMICIDE_2014_2023_CSV =
  'https://www.interno.gov.it/sites/default/files/2024-12/omicidi_10anni.csv';
const INTERIOR_MINOR_VICTIMS =
  'https://www.interno.gov.it/it/stampa-e-comunicazione/dati-e-statistiche/reati-sfondo-sessuale-vittime-minorenni';
const INTERIOR_FEMALE_VICTIMS_2024_H1 =
  'https://www.interno.gov.it/sites/default/files/2024-12/d-a_ita-stra_vittime_donne.csv';

type Metric = {
  id: string;
  title: string;
  value?: string;
  period?: string;
  note: string;
  sourceUrl?: string;
  sourceLabel?: string;
  dataNeeded?: boolean;
};

const ADULT_METRICS: readonly Metric[] = [
  {
    id: 'italian-citizens-killed',
    title: 'Italian-citizen homicide victims',
    value: '≈243',
    period: '2024',
    note: 'Derived from ISTAT: 74.3% of all 327 homicide victims were Italian citizens. The percentage is published rounded, so the count is approximate.',
    sourceUrl: ISTAT_HOMICIDE_2024,
    sourceLabel: 'ISTAT',
  },
  {
    id: 'men-killed',
    title: 'Men killed',
    value: '211',
    period: '2024',
    note: 'Final national count of male homicide victims, all citizenships.',
    sourceUrl: ISTAT_HOMICIDE_2024,
    sourceLabel: 'ISTAT',
  },
  {
    id: 'women-killed',
    title: 'Women killed',
    value: '116',
    period: '2024',
    note: 'Final national count of female homicide victims, all citizenships. ISTAT reports that 78.4% were Italian citizens.',
    sourceUrl: ISTAT_HOMICIDE_2024,
    sourceLabel: 'ISTAT',
  },
  {
    id: 'italian-women-sexual-violence',
    title: 'Italian female sexual-violence victims',
    value: '1,358',
    period: 'January–June 2024',
    note: 'Calculated from 2,443 female victims minus 1,085 foreign female victims in the Interior Ministry extract. This is sexual violence, not a rape-only count.',
    sourceUrl: INTERIOR_FEMALE_VICTIMS_2024_H1,
    sourceLabel: 'Interior Ministry CSV',
  },
  {
    id: 'women-theft',
    title: 'Italian female theft victims',
    period: 'Annual national series',
    note: 'Data needed: police-recorded theft victims split simultaneously by sex and Italian citizenship under one stable definition.',
    dataNeeded: true,
  },
  {
    id: 'men-theft',
    title: 'Italian male theft victims',
    period: 'Annual national series',
    note: 'Data needed: police-recorded theft victims split simultaneously by sex and Italian citizenship under one stable definition.',
    dataNeeded: true,
  },
];

const CHILD_METRICS: readonly Metric[] = [
  {
    id: 'children-killed',
    title: 'Victims under 18 killed',
    value: '21',
    period: '2024',
    note: 'Final national homicide count: 13 victims were under 14 and eight were aged 14–17.',
    sourceUrl: ISTAT_HOMICIDE_2024,
    sourceLabel: 'ISTAT',
  },
  {
    id: 'minor-sexual-violence',
    title: 'Minor sexual-violence victims',
    value: '912',
    period: '2023 full year',
    note: 'Police-recorded victims under 18 for the base sexual-violence category. The same source reports 441 in January–June 2024.',
    sourceUrl: INTERIOR_MINOR_VICTIMS,
    sourceLabel: 'Interior Ministry',
  },
  {
    id: 'children-theft',
    title: 'Italian child theft victims',
    period: 'Annual national series',
    note: 'Data needed: police-recorded theft victims under 18 split by Italian citizenship, with a stable national definition.',
    dataNeeded: true,
  },
];

const SEXUAL_VIOLENCE_METRICS: readonly Metric[] = [
  {
    id: 'italian-female-sexual-violence-total',
    title: 'Italian female sexual-violence victims',
    value: '1,358',
    period: 'January–June 2024',
    note: 'Italian-citizen female victims, derived by subtracting the published foreign-victim count from the published total.',
    sourceUrl: INTERIOR_FEMALE_VICTIMS_2024_H1,
    sourceLabel: 'Interior Ministry CSV',
  },
  {
    id: 'minor-sexual-violence-h1',
    title: 'Minor sexual-violence victims',
    value: '441',
    period: 'January–June 2024',
    note: 'Victims under 18, both sexes and all citizenships, for the base sexual-violence category.',
    sourceUrl: INTERIOR_MINOR_VICTIMS,
    sourceLabel: 'Interior Ministry',
  },
  {
    id: 'foreign-offenders-children',
    title: 'Foreign offenders against children',
    period: 'Annual national series',
    note: 'Data needed: identified or convicted foreign sexual offenders, uniquely counted and linked to victims under 18.',
    dataNeeded: true,
  },
  {
    id: 'foreign-offenders-women',
    title: 'Foreign offenders against women',
    period: 'Annual national series',
    note: 'Data needed: identified or convicted foreign sexual offenders linked to adult female victims, with citizenship and legal status.',
    dataNeeded: true,
  },
  {
    id: 'unique-foreign-offenders',
    title: 'Unique foreign sexual offenders',
    period: 'Annual national series',
    note: 'Data needed: a national person-level count deduplicated across reports, offences, and proceedings.',
    dataNeeded: true,
  },
  {
    id: 'not-deported',
    title: 'Foreign sexual offenders not deported',
    period: 'Cohort outcome',
    note: 'Data needed: a linked national cohort with final case outcome, citizenship or status, deportation eligibility, and completed removal.',
    dataNeeded: true,
  },
];

const HOMICIDE_SERIES = [
  { period: '2014', women: 153, men: 338 },
  { period: '2015', women: 145, men: 330 },
  { period: '2016', women: 152, men: 256 },
  { period: '2017', women: 132, men: 246 },
  { period: '2018', women: 142, men: 219 },
  { period: '2019', women: 113, men: 208 },
  { period: '2020', women: 119, men: 168 },
  { period: '2021', women: 123, men: 187 },
  { period: '2022', women: 130, men: 198 },
  { period: '2023', women: 118, men: 220 },
  { period: '2024', women: 116, men: 211 },
] as const;

const MINOR_SEXUAL_VIOLENCE_SERIES = [
  { period: '2022', victims: 906 },
  { period: '2023', victims: 912 },
  { period: 'H1 2024', victims: 441 },
] as const;

const FEMALE_AND_MINOR_SEXUAL_VIOLENCE_SERIES = [
  { period: 'H1 2023', italianWomen: 1070, minors: 441 },
  { period: 'H1 2024', italianWomen: 1358, minors: 441 },
] as const;

const HOMICIDE_CONFIG = {
  women: { label: 'Women killed', color: '#f472b6' },
  men: { label: 'Men killed', color: '#fb923c' },
} satisfies ChartConfig;

const MINOR_CONFIG = {
  victims: { label: 'Minor sexual-violence victims', color: '#e879f9' },
} satisfies ChartConfig;

const SEXUAL_VIOLENCE_CONFIG = {
  italianWomen: { label: 'Italian female victims', color: '#f472b6' },
  minors: { label: 'Minor victims (all citizenships)', color: '#a78bfa' },
} satisfies ChartConfig;

function MetricCard({ metric }: { metric: Metric }) {
  return (
    <Card
      className={cn(
        'flex min-w-0 flex-col overflow-hidden border-line bg-surface-metric shadow-card',
        metric.dataNeeded && 'border-dashed border-amber-400/25',
      )}
    >
      <CardHeader className="space-y-1 pb-0">
        <CardTitle className="text-sm font-semibold leading-snug text-white">{metric.title}</CardTitle>
        {metric.period ? (
          <CardDescription className="font-sans text-[10px] leading-snug text-neutral-500">
            {metric.period}
          </CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col pt-3">
        <p
          className={cn(
            'font-sans font-semibold tracking-tight',
            metric.dataNeeded
              ? 'text-sm leading-snug text-amber-200/90'
              : 'text-2xl tabular-nums text-white',
          )}
        >
          {metric.dataNeeded ? 'Data needed' : metric.value}
        </p>
        <p className="mt-2 break-words font-sans text-[11px] leading-relaxed text-neutral-500">{metric.note}</p>
        {metric.sourceUrl ? (
          <a
            href={metric.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex w-fit font-sans text-[10px] text-[var(--uk-accent)] hover:text-neutral-200"
          >
            {metric.sourceLabel ?? 'Source'} ↗
          </a>
        ) : null}
      </CardContent>
    </Card>
  );
}

function SourceNote({
  children,
  href,
  label,
}: {
  children: ReactNode;
  href: string;
  label: string;
}) {
  return (
    <p className="font-sans text-[10px] leading-relaxed text-neutral-500">
      {children}{' '}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--uk-accent)] hover:text-neutral-200"
      >
        {label} ↗
      </a>
    </p>
  );
}

function HomicideVictimsChart() {
  return (
    <Card className="col-span-full border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2 sm:p-5 sm:pb-3">
        <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          Homicide victims by sex
        </CardTitle>
        <CardDescription className="font-sans text-[10px] leading-snug text-neutral-500">
          National victims, all citizenships. 2014–2023 Interior Ministry series; final 2024 ISTAT count.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-0 sm:p-5 sm:pt-0">
        <ChartContainer config={HOMICIDE_CONFIG} className="h-[360px] w-full font-sans">
          <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 320, height: 240 }}>
            <LineChart data={HOMICIDE_SERIES} margin={{ top: 8, right: 12, left: 0, bottom: 16 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="period"
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 9 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={34}
              />
              <ChartTooltip
                cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                content={<ChartTooltipContent className="rounded-md" />}
              />
              <Legend wrapperStyle={{ fontSize: '10px', color: 'rgba(212,212,212,0.9)' }} iconType="line" />
              <Line
                type="monotone"
                dataKey="women"
                name="Women killed"
                stroke="#f472b6"
                strokeWidth={2.5}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="men"
                name="Men killed"
                stroke="#fb923c"
                strokeWidth={2.5}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        <SourceNote href={INTERIOR_HOMICIDE_2014_2023_CSV} label="Interior Ministry CSV">
          The historical extract does not split every year simultaneously by sex and Italian citizenship.
        </SourceNote>
      </CardContent>
    </Card>
  );
}

function MinorVictimsChart() {
  return (
    <Card className="col-span-full border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2 sm:p-5 sm:pb-3">
        <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          Minor sexual-violence victims
        </CardTitle>
        <CardDescription className="font-sans text-[10px] leading-snug text-neutral-500">
          Police-recorded victims under 18, both sexes and all citizenships. H1 2024 is a half-year value and is not annualized.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-0 sm:p-5 sm:pt-0">
        <ChartContainer config={MINOR_CONFIG} className="h-[330px] w-full font-sans">
          <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 320, height: 240 }}>
            <LineChart data={MINOR_SEXUAL_VIOLENCE_SERIES} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="period"
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={34}
              />
              <ChartTooltip
                cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                content={<ChartTooltipContent className="rounded-md" />}
              />
              <Legend wrapperStyle={{ fontSize: '10px', color: 'rgba(212,212,212,0.9)' }} iconType="line" />
              <Line
                type="monotone"
                dataKey="victims"
                name="Minor sexual-violence victims"
                stroke="#e879f9"
                strokeWidth={2.5}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        <SourceNote href={INTERIOR_MINOR_VICTIMS} label="Interior Ministry">
          The source also reports aggravated and group sexual violence as separate categories; they are not added here to avoid double counting.
        </SourceNote>
      </CardContent>
    </Card>
  );
}

function FemaleAndMinorSexualViolenceChart() {
  return (
    <Card className="col-span-full border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2 sm:p-5 sm:pb-3">
        <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          Available female and minor sexual-violence victim counts
        </CardTitle>
        <CardDescription className="font-sans text-[10px] leading-snug text-neutral-500">
          Italian-citizen female victims compared with minor victims of all citizenships. Both periods cover January–June.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-0 sm:p-5 sm:pt-0">
        <ChartContainer config={SEXUAL_VIOLENCE_CONFIG} className="h-[330px] w-full font-sans">
          <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 320, height: 240 }}>
            <LineChart
              data={FEMALE_AND_MINOR_SEXUAL_VIOLENCE_SERIES}
              margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
            >
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="period"
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={38}
              />
              <ChartTooltip
                cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                content={<ChartTooltipContent className="rounded-md" />}
              />
              <Legend wrapperStyle={{ fontSize: '10px', color: 'rgba(212,212,212,0.9)' }} iconType="line" />
              <Line
                type="monotone"
                dataKey="italianWomen"
                name="Italian female victims"
                stroke="#f472b6"
                strokeWidth={2.5}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="minors"
                name="Minor victims (all citizenships)"
                stroke="#a78bfa"
                strokeWidth={2.5}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        <SourceNote href={INTERIOR_HOMICIDE_ARCHIVE} label="Interior Ministry archive">
          These lines have different population coverage, stated in the legend, and should not be summed.
        </SourceNote>
      </CardContent>
    </Card>
  );
}

type Incident = {
  id: string;
  rank: number;
  year: string;
  location: string;
  description: string;
  perpetrators: string;
  victims: string;
  outcome: string;
  sourceLabel: string;
  sourceUrl: string;
  /** Photo of the public LOCATION (Wikimedia Commons, credited) — never people or press images. */
  image?: IncidentImage;
};

const INCIDENTS: readonly Incident[] = [
  {
    id: 'yara-gambirasio',
    rank: 1,
    year: '2010',
    location: 'Brembate di Sopra / Chignolo d’Isola',
    description: 'Thirteen-year-old Yara Gambirasio disappeared after leaving a gym and was found dead three months later.',
    perpetrators: 'Massimo Giuseppe Bossetti; convicted after a case centered on DNA evidence.',
    victims: 'Yara Gambirasio, 13.',
    outcome: 'The Court of Cassation confirmed Bossetti’s life sentence in 2018.',
    sourceLabel: 'ANSA',
    sourceUrl: 'https://www.ansa.it/lombardia/notizie/2018/10/07/yara-cassazione-conferma-lergastolo-per-bossetti_f25227e8-a395-45f9-9f35-0f3e8fad121c.html',
  },
  {
    id: 'rimini-attacks',
    rank: 2,
    year: '2017',
    location: 'Rimini',
    description: 'A group assaulted and robbed a Polish tourist couple and sexually assaulted the woman and a Peruvian transgender woman.',
    perpetrators: 'Guerlin Butungu, the only adult defendant, and three defendants tried as minors.',
    victims: 'A Polish tourist, her partner, and a Peruvian transgender woman.',
    outcome: 'Butungu’s 16-year sentence was confirmed on appeal in 2018.',
    sourceLabel: 'ANSA',
    sourceUrl: 'https://www.ansa.it/sito/notizie/cronaca/2018/10/19/stupri-rimini-conferma-16-anni-butungu_f30dcd7c-42b6-4494-910c-46fb2ecda197.html',
    image: {
      src: '/incidents/rimini-attacks.webp',
      alt: 'The Rimini seafront',
      credit: 'Rimini seafront — RiminiCity, CC BY-SA 3.0 / Wikimedia Commons',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Rimini_Montage.jpg',
    },
  },
  {
    id: 'pamela-mastropietro',
    rank: 3,
    year: '2018',
    location: 'Macerata',
    description: 'Eighteen-year-old Pamela Mastropietro was sexually assaulted and killed; her body was dismembered.',
    perpetrators: 'Innocent Oseghale.',
    victims: 'Pamela Mastropietro, 18.',
    outcome: 'The Court of Cassation rejected a further defence challenge in 2025, leaving the life sentence in place.',
    sourceLabel: 'ANSA',
    sourceUrl: 'https://www.ansa.it/marche/notizie/2025/01/17/omicidio-di-pamela-cassazione-conferma-lergastolo_fec54d6d-ed0f-4a8b-9e54-bb5ebd10035d.html',
  },
  {
    id: 'desiree-mariottini',
    rank: 4,
    year: '2018',
    location: 'Rome — San Lorenzo',
    description: 'Sixteen-year-old Desirée Mariottini was found dead in an abandoned building after sexual abuse and drug administration.',
    perpetrators: 'Four defendants; charges and responsibility varied by position.',
    victims: 'Desirée Mariottini, 16.',
    outcome: 'The Court of Cassation made the remaining sentences definitive in 2024: 18, 22, and 26 years, plus one life sentence.',
    sourceLabel: 'ANSA',
    sourceUrl: 'https://www.ansa.it/sito/notizie/cronaca/2024/10/17/definitive-le-condanne-per-la-morte-di-desiree_5862085d-2db1-415c-b3da-b8f267985929.html',
  },
  {
    id: 'saman-abbas',
    rank: 5,
    year: '2021',
    location: 'Novellara',
    description: 'Prosecutors said Saman Abbas was killed after rejecting an arranged marriage and asserting her independence.',
    perpetrators: 'Five family members were convicted, including her parents, uncle, and two cousins.',
    victims: 'Saman Abbas, 18, a Pakistani-Italian woman.',
    outcome: 'In July 2026, the Court of Cassation confirmed life terms for her parents and cousins and 22 years for her uncle.',
    sourceLabel: 'ANSA',
    sourceUrl: 'https://www.ansa.it/sito/notizie/cronaca/2026/07/15/lomicidio-di-saman-abbas-definitive-le-condanne-per-i-familiari_b2a74743-83dd-4a62-b866-650208f4c9a1.html',
  },
  {
    id: 'diana-pifferi',
    rank: 6,
    year: '2022',
    location: 'Milan',
    description: 'Eighteen-month-old Diana died after being left alone at home for six days.',
    perpetrators: 'Her mother, Alessia Pifferi.',
    victims: 'Diana Pifferi, 18 months old.',
    outcome: 'The Court of Cassation made the 24-year sentence definitive in June 2026.',
    sourceLabel: 'ANSA',
    sourceUrl: 'https://www.ansa.it/sito/notizie/cronaca/2026/06/25/la-cassazione-chiede-lappello-bis-per-il-caso-pifferi-non-riconoscere-attenuanti_23fb8347-7521-4136-a1ab-049f7bc8f949.html',
  },
  {
    id: 'palermo-group-assault',
    rank: 7,
    year: '2023',
    location: 'Palermo — Foro Italico',
    description: 'A 19-year-old woman reported being sexually assaulted by a group at an abandoned construction site.',
    perpetrators: 'Six adult defendants and one defendant who was a minor at the time.',
    victims: 'One 19-year-old woman.',
    outcome: 'All six adult defendants were convicted in 2024; the minor defendant had already received an eight-year-eight-month sentence.',
    sourceLabel: 'ANSA',
    sourceUrl: 'https://www.ansa.it/english/news/2024/11/08/all-six-defendants-convicted-of-palermo-gang-rape_96e53e84-6457-4296-a65c-ec84a27ac7b4.html',
    image: {
      src: '/incidents/palermo-group-assault.webp',
      alt: 'The Foro Italico seafront park in Palermo',
      credit: 'Foro Italico, Palermo — Dedda71, CC BY 3.0 / Wikimedia Commons',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Foro_Italico_10.jpg',
    },
  },
  {
    id: 'caivano-abuse',
    rank: 8,
    year: '2023',
    location: 'Caivano',
    description: 'Two cousins aged 10 and 12 were subjected to repeated sexual abuse by groups of young people.',
    perpetrators: 'Two adult and eight minor suspects were involved in the proceedings.',
    victims: 'Two girls, aged 10 and 12.',
    outcome: 'In June 2026, the Court of Cassation made the two adult defendants’ sentences definitive.',
    sourceLabel: 'ANSA',
    sourceUrl: 'https://www.ansa.it/campania/notizie/2026/06/17/stupri-a-caivano-definitive-le-condanne-per-i-due-maggiorenni-del-gruppo_a59930a0-90ae-4bea-9553-4d1033e5ae4f.html',
  },
  {
    id: 'giulia-cecchettin',
    rank: 9,
    year: '2023',
    location: 'Fossò / Barcis',
    description: 'Giulia Cecchettin was killed by her former boyfriend shortly before her university graduation.',
    perpetrators: 'Filippo Turetta, her former boyfriend.',
    victims: 'Giulia Cecchettin, 22.',
    outcome: 'Turetta received a life sentence in 2024; it became definitive in 2025 after both sides withdrew appeals.',
    sourceLabel: 'ANSA',
    sourceUrl: 'https://www.ansa.it/sito/notizie/cronaca/2025/11/06/termina-la-vicenda-processuale-di-turetta-lergastolo-e-definitivo_fa1dbfda-2589-44aa-9760-ddadbd8b0b13.html',
  },
  {
    id: 'catania-villa-bellini',
    rank: 10,
    year: '2024',
    location: 'Catania — Villa Bellini',
    description: 'A 13-year-old girl was sexually assaulted in public toilets while her 17-year-old boyfriend was restrained.',
    perpetrators: 'Seven suspects were identified in the investigation; proceedings were split between adult and juvenile courts.',
    victims: 'One 13-year-old girl; her boyfriend was also assaulted and restrained.',
    outcome: 'In April 2026, one adult-court branch produced three convictions and one acquittal; other defendants were handled in separate proceedings.',
    sourceLabel: 'ANSA',
    sourceUrl: 'https://www.ansa.it/sicilia/notizie/2026/04/10/violenza-sessuale-di-gruppo-a-catania-tre-condanne-e-unassoluzione_da768ba5-72ee-49f8-bf8d-adb7bc9527a2.html',
    image: {
      src: '/incidents/catania-villa-bellini.webp',
      alt: 'Villa Bellini park in Catania',
      credit: 'Villa Bellini, Catania — Unukorno, CC BY 3.0 / Wikimedia Commons',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Catania_Parco_Villa_Bellini.jpg',
    },
  },
];

type SortKey = 'rank' | 'year' | 'location' | 'perpetrators' | 'victims';

function IncidentField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 space-y-1">
      <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">{label}</p>
      <p className="break-words font-sans text-[11px] leading-relaxed text-neutral-400">{value}</p>
    </div>
  );
}

function ItalyNotableIncidents() {
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sorted = useMemo(() => {
    const direction = sortDir === 'asc' ? 1 : -1;
    return [...INCIDENTS].sort((a, b) => {
      if (sortKey === 'rank') return (a.rank - b.rank) * direction;
      const left = sortKey === 'year' ? Number.parseInt(a.year, 10) : a[sortKey];
      const right = sortKey === 'year' ? Number.parseInt(b.year, 10) : b[sortKey];
      return String(left).localeCompare(String(right), 'en', { sensitivity: 'base', numeric: true }) * direction;
    });
  }, [sortDir, sortKey]);

  const toggleSort = useCallback((key: SortKey) => {
    setSortKey((current) => {
      if (current === key) {
        setSortDir((direction) => (direction === 'asc' ? 'desc' : 'asc'));
        return current;
      }
      setSortDir('asc');
      return key;
    });
  }, []);

  return (
    <Card className="col-span-full overflow-hidden border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 border-b border-[var(--line)] p-4 pb-3 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 space-y-1">
            <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
              Notable incidents (reported)
            </CardTitle>
            <CardDescription className="font-sans text-[10px] leading-snug text-neutral-500">
              Ten documented cases. Sort the index and expand a case for the legal outcome and source.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2" role="toolbar" aria-label="Sort Italian victim incidents">
            {(
              [
                ['rank', 'Rank'],
                ['year', 'Year'],
                ['location', 'Location'],
                ['perpetrators', 'Perpetrators'],
                ['victims', 'Victims'],
              ] as const
            ).map(([key, label]) => {
              const active = sortKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleSort(key)}
                  className={cn(
                    'rounded-md border px-2.5 py-1.5 font-sans text-[10px] font-medium uppercase tracking-[0.08em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--uk-accent)]',
                    active
                      ? 'border-line bg-surface-metric text-neutral-100 shadow-sm ring-1 ring-white/[0.04]'
                      : 'border-white/[0.08] bg-neutral-950/35 text-neutral-500 hover:border-white/[0.12] hover:bg-neutral-900/50 hover:text-neutral-300',
                  )}
                >
                  {label}
                  {active ? (sortDir === 'asc' ? ' · asc' : ' · desc') : ''}
                </button>
              );
            })}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-5">
        <ul className="flex flex-col gap-4">
          {sorted.map((incident) => {
            const open = expandedId === incident.id;
            return (
              <li key={incident.id}>
                <article
                  className={cn(
                    'rounded-md border border-line bg-surface-metric p-4 shadow-card sm:p-5',
                    open && 'ring-1 ring-white/[0.06]',
                  )}
                >
                  <NotableIncidentThumb image={incident.image} />
                  <button
                    type="button"
                    onClick={() => setExpandedId((current) => (current === incident.id ? null : incident.id))}
                    className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--uk-accent)]"
                    aria-expanded={open}
                  >
                    <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                      Case #{incident.rank} · <span className="tabular-nums">{incident.year}</span>
                    </p>
                    <h3 className="mt-2 break-words font-sans text-lg font-medium leading-snug text-neutral-100 sm:text-xl">
                      {incident.location}
                    </h3>
                    <p className={cn('mt-3 font-sans text-[11px] leading-relaxed text-neutral-400', !open && 'line-clamp-2')}>
                      {incident.description}
                    </p>
                    <div className="mt-4 grid gap-4 border-t border-white/[0.06] pt-4 sm:grid-cols-2">
                      <IncidentField label="Perpetrators" value={incident.perpetrators} />
                      <IncidentField label="Victims" value={incident.victims} />
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
                      <span className="font-sans text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-500">
                        {open ? 'Hide outcome' : 'Outcome & source'}
                      </span>
                      <span
                        className={cn('text-[10px] text-neutral-400 transition-transform', open && 'rotate-180')}
                        aria-hidden
                      >
                        ▾
                      </span>
                    </div>
                  </button>
                  {open ? (
                    <div className="mt-4 border-t border-[var(--line)] pt-4">
                      <IncidentField label="Legal outcome" value={incident.outcome} />
                      <a
                        href={incident.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex w-fit font-sans text-[10px] text-[var(--uk-accent)] hover:text-neutral-200"
                      >
                        {incident.sourceLabel} ↗
                      </a>
                    </div>
                  ) : null}
                </article>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

export const ItalyCrimeVictimsSection = memo(function ItalyCrimeVictimsSection() {
  return (
    <div className="flex flex-col gap-4">
      <Card className="border-line bg-surface-metric shadow-card">
        <CardContent className="p-4 sm:p-5">
          <p className="font-sans text-[11px] leading-relaxed text-neutral-400">
            Italy’s official crime systems classify victims by sex, age, and citizenship—not by race. “Italian
            citizen” is used only where the source publishes citizenship. Counts with different periods or populations
            are kept separate.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {ADULT_METRICS.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      <HomicideVictimsChart />
      <MinorVictimsChart />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {CHILD_METRICS.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      <FemaleAndMinorSexualViolenceChart />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {SEXUAL_VIOLENCE_METRICS.slice(0, 3).map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {SEXUAL_VIOLENCE_METRICS.slice(3).map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      <Separator className="bg-white/[0.06]" />
      <ItalyNotableIncidents />
    </div>
  );
});
