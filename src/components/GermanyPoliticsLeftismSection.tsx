import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { memo } from 'react';
import { GOV_POLITICS_CARD_GRID } from './GermanyGovernmentPoliticsBlocks';
import { PoliticsGroupLeaderboard } from './PoliticsGroupLeaderboard';

const UC_TITLE = 'uppercase tracking-[0.05em]';
const UC_META = 'uppercase tracking-[0.03em]';

export type LeftSource = { label: string; href?: string };
export type LeftStatCard = {
  title: string;
  value: string;
  subtitle?: string;
  sources?: readonly LeftSource[];
  colSpanFull?: boolean;
};
export type CancelCultureRow = { category: string; value: string };
export type LeftistGroup = {
  rank: number;
  group: string;
  type: string;
  memberPopulation: string;
  notes: string;
};

/** Full per-country payload for this section (defaults to Germany's when omitted). */
export type PoliticsLeftismData = {
  statCards: readonly LeftStatCard[];
  cancelCultureTitle: string;
  cancelCultureRows: readonly CancelCultureRow[];
  cancelCultureSource: LeftSource;
  groupsTitle: string;
  groupsDescription: string;
  groups: readonly LeftistGroup[];
};

const LEFTIST_GROUPS: readonly LeftistGroup[] = [
  {
    rank: 1,
    group: 'Die Linke (The Left)',
    type: 'Political party',
    memberPopulation: '123126',
    notes: 'Largest leftist party; parliamentary work and mass mobilization',
  },
  {
    rank: 2,
    group: 'Autonome Szene (Autonomists / Black Bloc)',
    type: 'Militant decentralized scene',
    memberPopulation: '8600',
    notes: 'Street clashes, direct action, property damage',
  },
  {
    rank: 3,
    group: 'Rote Hilfe e.V. (Red Aid)',
    type: 'Solidarity / legal support',
    memberPopulation: '19000',
    notes: 'Legal and financial aid for leftist activists',
  },
  {
    rank: 4,
    group: 'Interventionistische Linke (IL)',
    type: 'Post-autonomous network',
    memberPopulation: '1000',
    notes: 'Large campaigns, blockades, and interventions',
  },
  {
    rank: 5,
    group: 'Antifa Ost (incl. Hammerbande)',
    type: 'Militant Antifa group',
    memberPopulation: '450',
    notes: 'Targeted actions in eastern Germany',
  },
  {
    rank: 6,
    group: 'Antifaschistische Aktion (various local groups)',
    type: 'Decentralized Antifa',
    memberPopulation: '3500',
    notes: 'Street-level anti-fascist actions across cities',
  },
  {
    rank: 7,
    group: 'VVN-BdA',
    type: 'Anti-fascist organization',
    memberPopulation: '7500',
    notes: 'Memorials, education, and anti-fascist demos',
  },
  {
    rank: 8,
    group: 'Ende Gelaende',
    type: 'Climate direct action',
    memberPopulation: '2500',
    notes: 'Infrastructure blockades (coal, Tesla, etc.)',
  },
  {
    rank: 9,
    group: '...ums Ganze!',
    type: 'Anti-capitalist / communist',
    memberPopulation: '400',
    notes: 'Theoretical work and joint radical actions',
  },
  {
    rank: 10,
    group: 'Young Struggle',
    type: 'Youth organization',
    memberPopulation: '350',
    notes: 'Pro-Palestinian and anti-imperialist protests',
  },
  {
    rank: 11,
    group: 'MLPD (Marxistisch-Leninistische Partei Deutschlands)',
    type: 'Communist political party',
    memberPopulation: '2800',
    notes: 'Marxist-Leninist party active in protests and elections',
  },
  {
    rank: 12,
    group: 'SDAJ (Sozialistische Deutsche Arbeiterjugend)',
    type: 'Communist youth organization',
    memberPopulation: '670',
    notes: 'Youth wing of the DKP; organises youth campaigns and festivals',
  },
];

const GERMANY_STAT_CARDS: readonly LeftStatCard[] = [
  {
    title: 'Self-identified left-wing/progressive ideology share',
    value: '25%',
    subtitle: '18-29 year olds',
    sources: [
      { label: 'Source: 2025 German federal election results ↗', href: 'https://www.bundeswahlleiterin.de/en/bundestagswahlen/2025.html' },
    ],
  },
  {
    title: 'Professors / self-identified left-leaning',
    value: '90%',
    sources: [{ label: 'Source: Oxford-led analysis (Reuters Institute / academic studies summary)' }],
  },
  {
    title: 'Supporting gender-neutral language mandates, diversity',
    value: '25%',
    sources: [{ label: 'Source: Statista / YouGov polls' }],
  },
  {
    title: 'Diversity quotas in media/corporations',
    value: '39%',
    subtitle: 'Reserved for DEI',
    sources: [{ label: 'Source: Corporate board quota enforcement data (German government reports 2024-2025)' }],
  },
  {
    title: 'Belief in Transgenderism',
    value: '90% (46% nationally)',
    sources: [
      { label: 'Source: ILCUK analysis ↗', href: 'https://ilcuk.org.uk/german-election-results-2025/' },
      { label: 'Source: BR24 DeutschlandTrend article ↗', href: 'https://www.br.de/nachrichten/deutschland-welt/mehrheit-findet-deutschland-soll-weniger-fluechtlinge-aufnehmen,UbN1Ubk' },
    ],
  },
  {
    title: 'Belief in Open borders',
    value: '>27% (3% nationally)',
    sources: [
      { label: 'Source: ILCUK analysis ↗', href: 'https://ilcuk.org.uk/german-election-results-2025/' },
      { label: 'Source: BR24 DeutschlandTrend article ↗', href: 'https://www.br.de/nachrichten/deutschland-welt/mehrheit-findet-deutschland-soll-weniger-fluechtlinge-aufnehmen,UbN1Ubk' },
    ],
  },
];

const GERMANY_CANCEL_ROWS: readonly CancelCultureRow[] = [
  { category: 'Annual reported deplatforming/firing/public-shaming incidents', value: '200 incidents' },
  { category: 'People banned over social media posts', value: '3,500 cases' },
];

function StatCardView({ card }: { card: LeftStatCard }) {
  return (
    <Card className={`border-red-500/20 bg-neutral-950/60 ${card.colSpanFull ? 'sm:col-span-2 lg:col-span-3' : ''}`}>
      <CardHeader className="space-y-1 p-3 pb-2">
        <CardTitle className={`text-sm text-neutral-100 ${UC_TITLE}`}>{card.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <p className="font-sans text-2xl font-semibold text-red-300">{card.value}</p>
        {card.subtitle ? (
          <p className={`mt-2 font-sans text-[10px] leading-relaxed text-neutral-500 ${UC_META}`}>{card.subtitle}</p>
        ) : null}
        {card.sources && card.sources.length > 0 ? (
          <div className="mt-2 space-y-0.5">
            {card.sources.map((s) =>
              s.href ? (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block font-sans text-[10px] text-[var(--uk-accent)] hover:text-neutral-200 ${UC_META}`}
                >
                  {s.label}
                </a>
              ) : (
                <p key={s.label} className={`font-sans text-[10px] leading-relaxed text-neutral-500 ${UC_META}`}>
                  {s.label}
                </p>
              ),
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export const GermanyPoliticsLeftismSection = memo(function GermanyPoliticsLeftismSection({
  statCards = GERMANY_STAT_CARDS,
  cancelCultureTitle = 'Cancel culture incidents',
  cancelCultureRows = GERMANY_CANCEL_ROWS,
  cancelCultureSource = { label: 'Source: archiveofsilence.org ↗', href: 'https://archiveofsilence.org/' },
  groupsTitle = 'LEFTIST GROUPS',
  groupsDescription = 'Ranked leftist groups and organizations (2000-2025 cumulative framing)',
  groups = LEFTIST_GROUPS,
}: Partial<PoliticsLeftismData> = {}) {
  return (
    <div className="flex flex-col gap-3">
      <div className={GOV_POLITICS_CARD_GRID}>
        {statCards.map((card) => (
          <StatCardView key={card.title} card={card} />
        ))}

        <Card className="sm:col-span-2 lg:col-span-3 border-red-500/20 bg-neutral-950/60">
          <CardHeader className="space-y-1 p-3 pb-2">
            <CardTitle className={`text-sm text-neutral-100 ${UC_TITLE}`}>{cancelCultureTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-3 pt-0">
            <div className="overflow-x-auto rounded border border-line">
              <table className="w-full min-w-[280px] border-collapse font-sans text-[11px]">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.03] text-left text-[10px] uppercase tracking-[0.1em] text-neutral-500">
                    <th className="px-3 py-2 font-medium">Category</th>
                    <th className="px-3 py-2 font-medium text-right">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {cancelCultureRows.map((row, i) => (
                    <tr key={row.category} className={i < cancelCultureRows.length - 1 ? 'border-b border-white/[0.06]' : ''}>
                      <td className="px-3 py-2 text-neutral-200">{row.category}</td>
                      <td className="px-3 py-2 text-right tabular-nums text-white">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {cancelCultureSource.href ? (
              <a
                href={cancelCultureSource.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`block font-sans text-[10px] text-[var(--uk-accent)] hover:text-neutral-200 ${UC_META}`}
              >
                {cancelCultureSource.label}
              </a>
            ) : (
              <p className={`font-sans text-[10px] leading-relaxed text-neutral-500 ${UC_META}`}>{cancelCultureSource.label}</p>
            )}
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-3 border-red-500/20 bg-neutral-950/60">
          <CardHeader className="space-y-1 p-3 pb-2">
            <CardTitle className={`text-sm text-neutral-100 ${UC_TITLE}`}>{groupsTitle}</CardTitle>
            <CardDescription className={`text-[10px] text-neutral-500 ${UC_META}`}>{groupsDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 p-3 pt-0">
            <PoliticsGroupLeaderboard
              accent="red"
              items={groups.map((g) => ({ rank: g.rank, group: g.group, type: g.type, value: g.memberPopulation, notes: g.notes }))}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
});
