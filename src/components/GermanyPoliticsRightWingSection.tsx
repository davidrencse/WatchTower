import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { memo } from 'react';
import { GOV_POLITICS_CARD_GRID } from './GermanyGovernmentPoliticsBlocks';
import { PoliticsGroupLeaderboard } from './PoliticsGroupLeaderboard';

const UC_TITLE = 'uppercase tracking-[0.05em]';
const UC_META = 'uppercase tracking-[0.03em]';

export type RightMetric = { title: string; value: string; notes: string };
export type RightWingGroup = {
  rank: number;
  group: string;
  type: string;
  memberPopulation: string;
  notes: string;
};

export type RightWingSource = {
  label: string;
  url: string;
};

/** Full per-country payload for this section (defaults to Germany's when omitted). */
export type PoliticsRightWingData = {
  metrics: readonly RightMetric[];
  groupsTitle: string;
  groupsDescription: string;
  groups: readonly RightWingGroup[];
  sources?: readonly RightWingSource[];
};

const RIGHT_WING_GROUPS: readonly RightWingGroup[] = [
  {
    rank: 1,
    group: 'AfD (Alternative fuer Deutschland)',
    type: 'Political party',
    memberPopulation: '70000',
    notes: 'Largest right-wing party; parliamentary opposition with strong electoral support',
  },
  {
    rank: 2,
    group: 'Die Heimat (formerly NPD)',
    type: 'Political party',
    memberPopulation: '2800',
    notes: 'Neo-Nazi / ultranationalist party; organises demonstrations',
  },
  {
    rank: 3,
    group: 'Active Clubs',
    type: 'Militant fitness / activist network',
    memberPopulation: '1500',
    notes: 'Decentralised network focused on physical training and right-wing networking',
  },
  {
    rank: 4,
    group: 'Freie Kraefte / Kameradschaften',
    type: 'Decentralised neo-Nazi scene',
    memberPopulation: '1200',
    notes: 'Loose network of neo-Nazi comradeships and free forces',
  },
  {
    rank: 5,
    group: 'Pegida (core organised supporters)',
    type: 'Protest movement',
    memberPopulation: '1100',
    notes: 'Anti-Islam / anti-immigration street protests',
  },
  {
    rank: 6,
    group: 'Identitaere Bewegung Deutschland (IBD)',
    type: 'Identitarian activist group',
    memberPopulation: '1000',
    notes: '"New Right" campaigns and border actions',
  },
  {
    rank: 7,
    group: 'Junge Alternative (AfD youth wing)',
    type: 'Youth organisation',
    memberPopulation: '2100',
    notes: 'Youth wing of AfD; active in protests and recruitment',
  },
  {
    rank: 8,
    group: 'Freie Sachsen',
    type: 'Regional political group',
    memberPopulation: '1200',
    notes: 'Active in eastern Germany with protests and coordination',
  },
  {
    rank: 9,
    group: 'Ein Prozent',
    type: 'New Right network',
    memberPopulation: '1200',
    notes: 'Intellectual "New Right" focused on metapolitics and cultural influence',
  },
  {
    rank: 10,
    group: 'Compact-Magazin network',
    type: 'Media / activist circle',
    memberPopulation: '1500',
    notes: 'Right-wing media outlet and associated activist events',
  },
  {
    rank: 11,
    group: 'Der III. Weg (The Third Way)',
    type: 'Political party',
    memberPopulation: '950',
    notes: 'Neo-Nazi party; uniformed actions and propaganda (closest to 1000)',
  },
  {
    rank: 12,
    group: 'DIE RECHTE (The Right)',
    type: 'Political party',
    memberPopulation: '600',
    notes: 'Neo-Nazi oriented party; local activities',
  },
];

function RightMetricCard({ title, value, notes }: { title: string; value: string; notes: string }) {
  return (
    <Card className="border-white/[0.1] bg-black/80">
      <CardHeader className="space-y-1 p-3 pb-2">
        <CardTitle className={`text-sm text-neutral-100 ${UC_TITLE}`}>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <p className="font-sans text-2xl font-semibold text-white">{value}</p>
        <p className={`mt-2 font-sans text-[10px] leading-relaxed text-neutral-400 ${UC_META}`}>{notes}</p>
      </CardContent>
    </Card>
  );
}

const GERMANY_METRICS: readonly RightMetric[] = [
  {
    title: 'SELF-IDENTIFIED RIGHT-WING / CONSERVATIVE IDEOLOGY SHARE',
    value: '32%',
    notes:
      'Identifying as right-wing/conservative or strongly supporting AfD and strict immigration control (18-29: ~21-25% for AfD alone in 2025).',
  },
  {
    title: 'PROFESSORS / SELF-IDENTIFIED RIGHT-LEANING',
    value: '8-12%',
    notes: 'Very low in German academia; conservatives remain a small minority.',
  },
  {
    title: 'SUPPORTING TRADITIONAL GENDER ROLES / OPPOSITION TO GENDER-NEUTRAL MANDATES',
    value: '45-55%',
    notes:
      'Significant opposition to mandatory gender-neutral language and support for biological sex distinctions.',
  },
  {
    title: 'OPPOSITION TO DIVERSITY QUOTAS IN MEDIA/CORPORATIONS',
    value: '55-65%',
    notes: 'Majority opposition to enforced DEI and board quotas, especially among conservatives and AfD voters.',
  },
  {
    title: 'BELIEF IN BIOLOGICAL SEX / OPPOSITION TO TRANSGENDER IDEOLOGY',
    value: '~60-70% nationally',
    notes: 'Strong majority support for binary biological sex in sports, spaces, and policy.',
  },
  {
    title: 'BELIEF IN CONTROLLED BORDERS / OPPOSITION TO OPEN BORDERS',
    value: '>70% (often 75-80%)',
    notes: 'Overwhelming support for reduced asylum immigration, stronger border controls, and deportations.',
  },
];

export const GermanyPoliticsRightWingSection = memo(function GermanyPoliticsRightWingSection({
  metrics = GERMANY_METRICS,
  groupsTitle = 'RIGHT-WING GROUPS',
  groupsDescription = 'Ranked right-wing groups and organizations (sleek black theme)',
  groups = RIGHT_WING_GROUPS,
  sources = [],
}: Partial<PoliticsRightWingData> = {}) {
  return (
    <div className="flex flex-col gap-3">
      <div className={GOV_POLITICS_CARD_GRID}>
        {metrics.map((m) => (
          <RightMetricCard key={m.title} title={m.title} value={m.value} notes={m.notes} />
        ))}

        <Card className="sm:col-span-2 lg:col-span-3 border-white/[0.1] bg-black/80">
          <CardHeader className="space-y-1 p-3 pb-2">
            <CardTitle className={`text-sm text-neutral-100 ${UC_TITLE}`}>{groupsTitle}</CardTitle>
            <CardDescription className={`text-[10px] text-neutral-500 ${UC_META}`}>
              {groupsDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 p-3 pt-0">
            <PoliticsGroupLeaderboard
              accent="neutral"
              items={groups.map((g) => ({ rank: g.rank, group: g.group, type: g.type, value: g.memberPopulation, notes: g.notes }))}
            />
            {sources.length > 0 ? (
              <p className="border-t border-white/[0.08] pt-2 font-sans text-[10px] leading-relaxed text-neutral-500">
                <span className="font-semibold text-neutral-400">Sources: </span>
                {sources.map((source, index) => (
                  <span key={source.url}>
                    {index > 0 ? ' · ' : null}
                    <a
                      className="text-neutral-300 underline decoration-neutral-600 underline-offset-2 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {source.label}
                    </a>
                  </span>
                ))}
              </p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
});
