import { memo, useCallback, useMemo, useState, type ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { cn } from '../lib/utils';

type SourceLink = { label: string; url: string };

type NotableIncident = {
  id: string;
  rank: number;
  year: string;
  location: string;
  dateDetail?: string;
  locationDetail?: string;
  description: string;
  expandedOverview?: string;
  perpetrators: string;
  perpetratorsExpanded?: string;
  victims: string;
  victimsExpanded?: string;
  outcome?: string;
  sourceLinks?: readonly SourceLink[];
  sourceFallback?: string;
  aggregateContext?: string;
};

const NOTABLE_INCIDENTS: readonly NotableIncident[] = [
  {
    id: 'cologne-nye',
    rank: 1,
    year: '2015/2016',
    location: 'Cologne (NYE)',
    dateDetail: 'Night of 31 December 2015 into 1 January 2016',
    locationDetail: 'Cologne city centre — main train station and cathedral square',
    description: 'Coordinated mass sexual assaults and gang rapes; 1,200+ criminal complaints.',
    expandedOverview:
      'Large groups of men — predominantly North African and Arab asylum seekers — carried out coordinated mass sexual assaults and gang rapes in Cologne’s city center around the main train station and cathedral square. Over 1,200 criminal complaints were filed by women and girls, including dozens of confirmed rapes. Women were surrounded by groups of 20–50 men, groped, robbed, and sexually assaulted, with similar incidents reported in Hamburg, Stuttgart, and Düsseldorf the same night. This event became a national turning point in the German migration debate.',
    perpetrators: 'Predominantly North African and Arab asylum seekers; coordinated groups of 20–50 men cited in many accounts.',
    victims: 'Women and girls who filed 1,200+ complaints; numerous sexual assaults and robberies.',
    sourceLinks: [
      {
        label: 'Wikipedia',
        url: 'https://en.wikipedia.org/wiki/2015%E2%80%9316_New_Year%27s_Eve_sexual_assaults',
      },
      { label: 'BBC', url: 'https://www.bbc.com/news/world-europe-35231046' },
    ],
  },
  {
    id: 'freiburg-2018',
    rank: 2,
    year: '2018',
    location: 'Freiburg',
    dateDetail: '13 October 2018',
    locationDetail: 'Freiburg — outside a nightclub after drugging inside',
    description: '18-year-old German woman drugged and gang-raped for several hours.',
    expandedOverview:
      'An 18-year-old German woman was drugged with ecstasy in a Freiburg nightclub, taken outside, and brutally gang-raped for several hours by a group of men who took turns assaulting her. The attack was extremely violent and prolonged.',
    perpetrators: 'Group of men acting together after isolating the victim outside the club.',
    victims: 'One 18-year-old German woman.',
    outcome: 'Multiple convictions followed in subsequent trials (widely covered 2019–2020).',
    sourceLinks: [
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/2018_Freiburg_gang_rape' },
      { label: 'BBC', url: 'https://www.bbc.com/news/world-europe-53517022' },
    ],
  },
  {
    id: 'hamburg-stadtpark-2020',
    rank: 3,
    year: '2020',
    location: 'Hamburg Stadtpark',
    dateDetail: '19 September 2020',
    locationDetail: 'Hamburg Stadtpark (bushes / park area)',
    description: '15-year-old girl gang-raped for hours; assault filmed on phones.',
    expandedOverview:
      'A heavily intoxicated 15-year-old German girl was dragged into bushes in Hamburg’s Stadtpark and gang-raped for more than two hours by a group of young men who also filmed the assault on their phones. The case caused massive public outrage due to the extremely lenient court sentences.',
    perpetrators: 'Group of young men; widely reported as majority migration background (e.g. Afghanistan, Iran, Egypt in press summaries).',
    victims: 'One 15-year-old German girl.',
    outcome: 'Later trials drew heavy criticism over suspended sentences for most defendants (widely reported 2023).',
    sourceLinks: [
      {
        label: 'News.com.au',
        url: 'https://www.news.com.au/lifestyle/real-life/news-life/outrage-as-eight-of-nine-men-convicted-of-park-gangrape-15yearold-in-germany-receive-no-prison-time/news-story/353bcbf9437ea62eea0ee3c6cc0c2cc7',
      },
    ],
  },
  {
    id: 'heinsberg-2025',
    rank: 4,
    year: '2025',
    location: 'Heinsberg (NRW)',
    dateDetail: 'Mid-October 2025',
    locationDetail: 'Heinsberg, North Rhine-Westphalia — apartment',
    description: '17-year-old German girl lured to an apartment and gang-raped by five Syrian asylum seekers.',
    expandedOverview:
      'In mid-October 2025 in Heinsberg, North Rhine-Westphalia, a 17-year-old German girl was lured to an apartment under false pretenses and gang-raped by five Syrian asylum seekers. The case quickly made national headlines as one of the most recent high-profile gang rape incidents.',
    perpetrators: 'Five Syrian asylum seekers (ages reported in the mid-to-late teens and twenties in press coverage).',
    victims: 'One 17-year-old German girl.',
    outcome: 'Suspects arrested; follow national reporting for trial updates.',
    sourceLinks: [
      {
        label: 'The Sun',
        url: 'https://www.the-sun.com/news/15391369/teenage-girl-gang-raped-syrian-asylum-seekers-germany/',
      },
    ],
  },
  {
    id: 'kandel-2018',
    rank: 5,
    year: '2017–2018',
    location: 'Kandel',
    dateDetail: '2017 through 27 December 2017 (fatal attack)',
    locationDetail: 'Kandel, Rhineland-Palatinate — drugstore',
    description: 'Afghan ex-boyfriend stalked and assaulted Mia Valentin; murdered her in a drugstore.',
    expandedOverview:
      'Between 2017 and December 27, 2017, an Afghan asylum seeker named Abdul D. repeatedly sexually assaulted and stalked his 15-year-old German ex-girlfriend Mia Valentin. On December 27, he stabbed her to death in a drugstore in Kandel after she tried to end the relationship.',
    perpetrators: 'Abdul D., Afghan asylum seeker (tried as a juvenile in German proceedings).',
    victims: 'Mia Valentin — 15-year-old German girl.',
    outcome: 'Convicted of murder; sentenced to 8 years and 6 months under juvenile law (per DW).',
    sourceLinks: [
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Murder_of_Mia_Valentin' },
      {
        label: 'DW',
        url: 'https://www.dw.com/en/germany-refugee-sentenced-to-8-years-and-6-months-for-teen-murder/a-45329347',
      },
    ],
  },
  {
    id: 'berlin-2022',
    rank: 6,
    year: '2022',
    location: 'Berlin youth center',
    dateDetail: '2022 (reporting period per German press)',
    locationDetail: 'Berlin — youth center facility',
    description: 'German teenage girl gang-raped at a youth center by a group of migrant men.',
    expandedOverview:
      'In 2022, a German teenage girl was gang-raped at a Berlin youth center by a group of Arab/Muslim migrant men. The attack occurred in a facility meant to be a safe space for young people.',
    perpetrators: 'Group of Arab/Muslim migrant men (per widespread German media characterization).',
    victims: 'One German teenage girl.',
    sourceFallback: 'Local Berlin police reports and Bild coverage (widely reported in German media 2022).',
  },
  {
    id: 'pools-parks-2016-2020',
    rank: 7,
    year: '2016–2020',
    location: 'Swimming pools & parks (Germany)',
    dateDetail: '2016–2020 (multiple jurisdictions and dates)',
    locationDetail: 'Public swimming pools and parks — e.g. Cologne, Düsseldorf, Berlin (pattern cited in reporting)',
    description: 'Numerous pool and park gang rapes and sexual assaults; migrant perpetrators repeatedly reported.',
    expandedOverview:
      'Between 2016 and 2020, numerous gang rapes and sexual assaults occurred in public swimming pools and parks across Germany, particularly in cities like Cologne, Düsseldorf, and Berlin. Perpetrators were predominantly Afghan, Syrian, and Iraqi migrants targeting young German girls.',
    perpetrators: 'Predominantly Afghan, Syrian, and Iraqi migrants (as described in BKA and local reporting summaries).',
    victims: 'Young German girls and women (counts vary by incident and jurisdiction).',
    sourceFallback: 'BKA annual crime reports and numerous local police press releases.',
  },
  {
    id: 'nrw-2024',
    rank: 8,
    year: '2024',
    location: 'Various NRW cities',
    dateDetail: 'Throughout 2024',
    locationDetail: 'North Rhine-Westphalia — multiple cities',
    description: 'Multiple NRW gang rape cases; Syrian and Afghan groups reported.',
    expandedOverview:
      'Throughout 2024, multiple gang rape cases were reported in cities across North Rhine-Westphalia (NRW), with groups of Syrian and Afghan men attacking German women and girls.',
    perpetrators: 'Groups of Syrian and Afghan men (as described in regional reporting).',
    victims: 'German women and girls (case-specific).',
    sourceFallback: 'NRW police reports and Bild / Welt coverage (2024).',
  },
  {
    id: 'cologne-duesseldorf-stations',
    rank: 9,
    year: '2017–2025',
    location: 'Cologne & Düsseldorf stations',
    dateDetail: 'From 2017 onward (ongoing pattern in reporting through 2025)',
    locationDetail: 'Cologne and Düsseldorf main train stations',
    description: 'Repeated group sexual assaults and gang rapes at major Rhine-Ruhr stations.',
    expandedOverview:
      'From 2017 onward, repeated group sexual assaults and gang rapes have occurred at Cologne and Düsseldorf main train stations, primarily committed by North African and Arab migrant groups targeting lone women.',
    perpetrators: 'North African and Arab migrant groups (per police and press summaries).',
    victims: 'Lone women and girls using station environments (counts vary by incident).',
    sourceFallback: 'Cologne Police annual reports and DW investigations.',
  },
  {
    id: 'munich-2023',
    rank: 10,
    year: '2023',
    location: 'Munich area',
    dateDetail: '2023 (multiple files across the year)',
    locationDetail: 'Greater Munich / Bavaria',
    description: 'Several 2023 gang rape cases; mixed migrant perpetrator groups.',
    expandedOverview:
      'In 2023, several gang rape cases involving mixed migrant perpetrator groups were reported in the Munich area, following the same pattern of group attacks on German women and girls.',
    perpetrators: 'Mixed migrant perpetrator groups (per Bavarian local reporting).',
    victims: 'German women and girls (case-specific).',
    sourceFallback: 'Bavarian police reports and local media (Süddeutsche Zeitung, Bild).',
  },
];

type SortKey = 'rank' | 'year' | 'location' | 'perpetrators' | 'victims';

function yearSortValue(year: string): number {
  const m = year.match(/(\d{4})/);
  return m ? parseInt(m[1]!, 10) : 0;
}

function compareLocale(a: string, b: string): number {
  return a.localeCompare(b, 'en', { sensitivity: 'base' });
}

/** Matches `MetricTile` / dashboard definition copy rhythm. */
function DetailBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">{label}</p>
      <div className="font-sans text-[11px] leading-relaxed text-neutral-400">{children}</div>
    </div>
  );
}

function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">{label}</p>
      <p className="font-sans text-[11px] leading-relaxed text-neutral-400">{value}</p>
    </div>
  );
}

export const GermanyCrimeVictimsNotableIncidents = memo(function GermanyCrimeVictimsNotableIncidents() {
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sorted = useMemo(() => {
    const rows = [...NOTABLE_INCIDENTS];
    const dir = sortDir === 'asc' ? 1 : -1;
    rows.sort((x, y) => {
      let cmp = 0;
      switch (sortKey) {
        case 'rank':
          cmp = x.rank - y.rank;
          break;
        case 'year':
          cmp = yearSortValue(x.year) - yearSortValue(y.year);
          break;
        case 'location':
          cmp = compareLocale(x.location, y.location);
          break;
        case 'perpetrators':
          cmp = compareLocale(x.perpetrators, y.perpetrators);
          break;
        case 'victims':
          cmp = compareLocale(x.victims, y.victims);
          break;
        default:
          cmp = 0;
      }
      return cmp * dir;
    });
    return rows;
  }, [sortKey, sortDir]);

  const toggleSort = useCallback((key: SortKey) => {
    setSortKey((prev) => {
      if (prev === key) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        return prev;
      }
      setSortDir('asc');
      return key;
    });
  }, []);

  const researchHref = useCallback((row: NotableIncident) => {
    const q = `${row.location} ${row.year} Germany`;
    return `https://duckduckgo.com/?q=${encodeURIComponent(q)}`;
  }, []);

  return (
    <Card className="col-span-full overflow-hidden border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 border-b border-[var(--line)] p-4 pb-3 sm:p-5 sm:pb-3">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 space-y-1">
            <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
              Notable incidents (reported)
            </CardTitle>
            <CardDescription className="font-sans text-[10px] leading-snug text-neutral-500">
              Sort by column. Expand a case for timeline, narrative, outcome, and sources.
            </CardDescription>
          </div>
          <div
            className="flex flex-wrap gap-2 sm:shrink-0 sm:justify-end"
            role="toolbar"
            aria-label="Sort incidents"
          >
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
                    'rounded-md border px-2.5 py-1.5 font-sans text-[10px] font-medium uppercase tracking-[0.08em] transition-colors',
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
      <CardContent className="flex flex-col gap-4 p-4 pt-4 sm:p-5 sm:pt-4">
        <ul className="flex flex-col gap-4">
          {sorted.map((row) => {
            const open = expandedId === row.id;
            const overview = row.expandedOverview ?? row.description;
            const perpLong = row.perpetratorsExpanded ?? row.perpetrators;
            const vicLong = row.victimsExpanded ?? row.victims;
            return (
              <li key={row.id}>
                <article
                  className={cn(
                    'flex flex-col rounded-md border border-line bg-surface-metric p-4 shadow-card sm:p-5',
                    open && 'ring-1 ring-white/[0.06]',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedId((id) => (id === row.id ? null : row.id))}
                    className="flex w-full flex-col text-left"
                    aria-expanded={open}
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                        Case #{row.rank}
                        <span className="mx-1.5 text-neutral-600">·</span>
                        <span className="tabular-nums text-neutral-500">{row.year}</span>
                      </p>
                    </div>
                    <h3 className="mt-2 font-sans text-lg font-medium leading-snug text-neutral-100 sm:text-xl">
                      {row.location}
                    </h3>
                    {!open ? (
                      <p className="mt-3 font-sans text-[11px] leading-relaxed text-neutral-400 line-clamp-2">
                        {row.description}
                      </p>
                    ) : null}
                    <div className="mt-4 divide-y divide-white/[0.06] border-t border-white/[0.06] pt-4">
                      <div className="grid gap-4 pb-4 sm:grid-cols-2">
                        <MetaField label="Perpetrators" value={row.perpetrators} />
                        <MetaField label="Victims" value={row.victims} />
                      </div>
                      <div className="flex items-center justify-between gap-2 pt-3">
                        <span className="font-sans text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-500">
                          {open ? 'Hide full brief' : 'Full brief & sources'}
                        </span>
                        <span
                          className={cn(
                            'font-sans text-[10px] text-neutral-400 transition-transform duration-200',
                            open && 'rotate-180',
                          )}
                          aria-hidden
                        >
                          ▾
                        </span>
                      </div>
                    </div>
                  </button>
                  {open ? (
                    <div className="mt-0 border-t border-[var(--line)] px-0 pb-0 pt-4">
                      <div className="space-y-4">
                        {row.dateDetail ? <DetailBlock label="When">{row.dateDetail}</DetailBlock> : null}
                        {row.locationDetail ? <DetailBlock label="Where">{row.locationDetail}</DetailBlock> : null}
                        <DetailBlock label="What happened">{overview}</DetailBlock>
                        <DetailBlock label="Perpetrators (detail)">{perpLong}</DetailBlock>
                        <DetailBlock label="Victims (detail)">{vicLong}</DetailBlock>
                        {row.outcome ? <DetailBlock label="Legal / public outcome">{row.outcome}</DetailBlock> : null}
                        {row.aggregateContext ? (
                          <>
                            <Separator className="bg-white/[0.06]" />
                            <DetailBlock label="Context">{row.aggregateContext}</DetailBlock>
                          </>
                        ) : null}
                      </div>
                      <div className="mt-4 border-t border-white/[0.06] pt-4">
                        <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                          Sources
                        </p>
                        {row.sourceLinks && row.sourceLinks.length > 0 ? (
                          <ul className="mt-2 flex flex-col gap-1.5">
                            {row.sourceLinks.map((s) => (
                              <li key={s.url}>
                                <a
                                  href={s.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex w-fit font-sans text-[10px] text-[var(--uk-accent)] hover:text-neutral-200"
                                >
                                  {s.label} ↗
                                </a>
                              </li>
                            ))}
                          </ul>
                        ) : row.sourceFallback ? (
                          <p className="mt-2 font-sans text-[11px] leading-relaxed text-neutral-500">
                            {row.sourceFallback}
                          </p>
                        ) : null}
                        <a
                          href={researchHref(row)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex w-fit items-center gap-1 font-sans text-[10px] text-[var(--uk-accent)] hover:text-neutral-200"
                        >
                          Search coverage ↗
                        </a>
                      </div>
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
});
