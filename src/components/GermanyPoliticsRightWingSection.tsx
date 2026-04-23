import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { GOV_POLITICS_CARD_GRID } from './GermanyGovernmentPoliticsBlocks';

const UC_TITLE = 'uppercase tracking-[0.05em]';
const UC_META = 'uppercase tracking-[0.03em]';

export const GERMANY_POLITICS_RIGHT_WING_GROUP_COUNT = 18;

type RightWingGroup = {
  rank: number;
  group: string;
  type: string;
  memberPopulation: string;
  notes: string;
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

function RightWingGroupWidget({ item }: { item: RightWingGroup }) {
  return (
    <div className="relative overflow-hidden rounded-[1.8rem] border border-white/[0.1] bg-black px-4 pb-4 pt-6 shadow-[0_10px_28px_rgba(0,0,0,0.6)]">
      <div className="absolute left-4 top-0 h-3 w-20 -translate-y-1/2 rounded-full border border-white/[0.14] bg-neutral-900/95" />
      <div className="absolute right-4 top-3 flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-neutral-400/80" />
        <span className="h-1.5 w-1.5 rounded-full bg-neutral-400/80" />
        <span className="h-1.5 w-1.5 rounded-full bg-neutral-400/80" />
      </div>
      <div className="mb-3 rounded-xl border border-white/[0.1] bg-neutral-900 px-3 py-1.5">
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-200">Rank #{item.rank}</p>
      </div>
      <p className="pr-16 font-sans text-sm font-semibold leading-tight text-neutral-100">{item.group}</p>
      <p className="mt-2 font-sans text-[10px] uppercase tracking-[0.1em] text-neutral-400">{item.type}</p>
      <p className="mt-3 font-sans text-2xl font-semibold tabular-nums tracking-tight text-white">{item.memberPopulation}</p>
      <p className="mt-2 font-sans text-[11px] leading-relaxed text-neutral-400">{item.notes}</p>
    </div>
  );
}

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

export function GermanyPoliticsRightWingSection() {
  return (
    <div className="flex flex-col gap-3">
      <div className={GOV_POLITICS_CARD_GRID}>
        <RightMetricCard
          title="SELF-IDENTIFIED RIGHT-WING / CONSERVATIVE IDEOLOGY SHARE"
          value="32%"
          notes="Identifying as right-wing/conservative or strongly supporting AfD and strict immigration control (18-29: ~21-25% for AfD alone in 2025)."
        />
        <RightMetricCard
          title="PROFESSORS / SELF-IDENTIFIED RIGHT-LEANING"
          value="8-12%"
          notes="Very low in German academia; conservatives remain a small minority."
        />
        <RightMetricCard
          title="SUPPORTING TRADITIONAL GENDER ROLES / OPPOSITION TO GENDER-NEUTRAL MANDATES"
          value="45-55%"
          notes="Significant opposition to mandatory gender-neutral language and support for biological sex distinctions."
        />
        <RightMetricCard
          title="OPPOSITION TO DIVERSITY QUOTAS IN MEDIA/CORPORATIONS"
          value="55-65%"
          notes="Majority opposition to enforced DEI and board quotas, especially among conservatives and AfD voters."
        />
        <RightMetricCard
          title="BELIEF IN BIOLOGICAL SEX / OPPOSITION TO TRANSGENDER IDEOLOGY"
          value="~60-70% nationally"
          notes="Strong majority support for binary biological sex in sports, spaces, and policy."
        />
        <RightMetricCard
          title="BELIEF IN CONTROLLED BORDERS / OPPOSITION TO OPEN BORDERS"
          value=">70% (often 75-80%)"
          notes="Overwhelming support for reduced asylum immigration, stronger border controls, and deportations."
        />

        <Card className="sm:col-span-2 lg:col-span-3 border-white/[0.1] bg-black/80">
          <CardHeader className="space-y-1 p-3 pb-2">
            <CardTitle className={`text-sm text-neutral-100 ${UC_TITLE}`}>RIGHT-WING GROUPS</CardTitle>
            <CardDescription className={`text-[10px] text-neutral-500 ${UC_META}`}>
              Ranked right-wing groups and organizations (sleek black theme)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 p-3 pt-0">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {RIGHT_WING_GROUPS.map((item) => (
                <RightWingGroupWidget key={item.rank} item={item} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
