import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { GOV_POLITICS_CARD_GRID } from './GermanyGovernmentPoliticsBlocks';

const UC_TITLE = 'uppercase tracking-[0.05em]';
const UC_META = 'uppercase tracking-[0.03em]';

export const GERMANY_POLITICS_LEFTISM_GROUP_COUNT = 12;

type LeftistGroup = {
  rank: number;
  group: string;
  type: string;
  memberPopulation: string;
  notes: string;
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

function LeftistGroupWidget({ item }: { item: LeftistGroup }) {
  return (
    <div className="relative overflow-hidden rounded-[1.8rem] border border-red-500/25 bg-neutral-950 px-4 pb-4 pt-6 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
      <div className="absolute left-4 top-0 h-3 w-20 -translate-y-1/2 rounded-full border border-red-500/30 bg-neutral-900/95" />
      <div className="absolute right-4 top-3 flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-red-400/80" />
        <span className="h-1.5 w-1.5 rounded-full bg-red-400/80" />
        <span className="h-1.5 w-1.5 rounded-full bg-red-400/80" />
      </div>
      <div className="mb-3 rounded-xl bg-red-500/95 px-3 py-1.5 shadow-[0_0_14px_rgba(239,68,68,0.45)]">
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-white">Rank #{item.rank}</p>
      </div>
      <p className="pr-16 font-sans text-sm font-semibold leading-tight text-neutral-100">{item.group}</p>
      <p className="mt-2 font-sans text-[10px] uppercase tracking-[0.1em] text-neutral-400">{item.type}</p>
      <p className="mt-3 font-sans text-2xl font-semibold tabular-nums tracking-tight text-white">{item.memberPopulation}</p>
      <p className="mt-2 font-sans text-[11px] leading-relaxed text-neutral-400">{item.notes}</p>
    </div>
  );
}

export function GermanyPoliticsLeftismSection() {
  return (
    <div className="flex flex-col gap-3">
      <div className={GOV_POLITICS_CARD_GRID}>
        <Card className="border-red-500/20 bg-neutral-950/60">
          <CardHeader className="space-y-1 p-3 pb-2">
            <CardTitle className={`text-sm text-neutral-100 ${UC_TITLE}`}>
              Self-identified left-wing/progressive ideology share
            </CardTitle>
            <CardDescription className={`text-[10px] text-neutral-500 ${UC_META}`}>
              % identifying as left/very-left or supporting socialist policies
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <p className="font-sans text-2xl font-semibold text-red-300">25%</p>
            <p className={`mt-2 font-sans text-[10px] leading-relaxed text-neutral-500 ${UC_META}`}>18-29 year olds</p>
            <a
              href="https://www.bundeswahlleiterin.de/en/bundestagswahlen/2025.html"
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-2 block font-sans text-[10px] text-[var(--uk-accent)] hover:text-neutral-200 ${UC_META}`}
            >
              Source: 2025 German federal election results ↗
            </a>
          </CardContent>
        </Card>

        <Card className="border-red-500/20 bg-neutral-950/60">
          <CardHeader className="space-y-1 p-3 pb-2">
            <CardTitle className={`text-sm text-neutral-100 ${UC_TITLE}`}>Professors / self-identified left-leaning</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <p className="font-sans text-2xl font-semibold text-red-300">90%</p>
            <p className={`mt-2 font-sans text-[10px] leading-relaxed text-neutral-500 ${UC_META}`}>
              Source: Oxford-led analysis (Reuters Institute / academic studies summary)
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-500/20 bg-neutral-950/60">
          <CardHeader className="space-y-1 p-3 pb-2">
            <CardTitle className={`text-sm text-neutral-100 ${UC_TITLE}`}>
              Supporting gender-neutral language mandates, diversity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <p className="font-sans text-2xl font-semibold text-red-300">25%</p>
            <p className={`mt-2 font-sans text-[10px] leading-relaxed text-neutral-500 ${UC_META}`}>
              Source: Statista / YouGov polls
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-500/20 bg-neutral-950/60">
          <CardHeader className="space-y-1 p-3 pb-2">
            <CardTitle className={`text-sm text-neutral-100 ${UC_TITLE}`}>Diversity quotas in media/corporations</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <p className="font-sans text-2xl font-semibold text-red-300">39%</p>
            <p className={`mt-2 font-sans text-[10px] leading-relaxed text-neutral-500 ${UC_META}`}>
              Reserved for DEI
            </p>
            <p className={`mt-1 font-sans text-[10px] leading-relaxed text-neutral-500 ${UC_META}`}>
              Source: Corporate board quota enforcement data (German government reports 2024-2025)
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-500/20 bg-neutral-950/60">
          <CardHeader className="space-y-1 p-3 pb-2">
            <CardTitle className={`text-sm text-neutral-100 ${UC_TITLE}`}>Belief in Transgenderism</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <p className="font-sans text-2xl font-semibold text-red-300">90% (46% nationally)</p>
            <div className="mt-2 space-y-0.5">
              <a
                href="https://ilcuk.org.uk/german-election-results-2025/"
                target="_blank"
                rel="noopener noreferrer"
                className={`block font-sans text-[10px] text-[var(--uk-accent)] hover:text-neutral-200 ${UC_META}`}
              >
                Source: ILCUK analysis ↗
              </a>
              <a
                href="https://www.br.de/nachrichten/deutschland-welt/mehrheit-findet-deutschland-soll-weniger-fluechtlinge-aufnehmen,UbN1Ubk"
                target="_blank"
                rel="noopener noreferrer"
                className={`block font-sans text-[10px] text-[var(--uk-accent)] hover:text-neutral-200 ${UC_META}`}
              >
                Source: BR24 DeutschlandTrend article ↗
              </a>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-500/20 bg-neutral-950/60">
          <CardHeader className="space-y-1 p-3 pb-2">
            <CardTitle className={`text-sm text-neutral-100 ${UC_TITLE}`}>Belief in Open borders</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <p className="font-sans text-2xl font-semibold text-red-300">&gt;27% (3% nationally)</p>
            <div className="mt-2 space-y-0.5">
              <a
                href="https://ilcuk.org.uk/german-election-results-2025/"
                target="_blank"
                rel="noopener noreferrer"
                className={`block font-sans text-[10px] text-[var(--uk-accent)] hover:text-neutral-200 ${UC_META}`}
              >
                Source: ILCUK analysis ↗
              </a>
              <a
                href="https://www.br.de/nachrichten/deutschland-welt/mehrheit-findet-deutschland-soll-weniger-fluechtlinge-aufnehmen,UbN1Ubk"
                target="_blank"
                rel="noopener noreferrer"
                className={`block font-sans text-[10px] text-[var(--uk-accent)] hover:text-neutral-200 ${UC_META}`}
              >
                Source: BR24 DeutschlandTrend article ↗
              </a>
            </div>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-3 border-red-500/20 bg-neutral-950/60">
          <CardHeader className="space-y-1 p-3 pb-2">
            <CardTitle className={`text-sm text-neutral-100 ${UC_TITLE}`}>Cancel culture incidents</CardTitle>
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
                  <tr className="border-b border-white/[0.06]">
                    <td className="px-3 py-2 text-neutral-200">Annual reported deplatforming/firing/public-shaming incidents</td>
                    <td className="px-3 py-2 text-right tabular-nums text-white">200 incidents</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-neutral-200">People banned over social media posts</td>
                    <td className="px-3 py-2 text-right tabular-nums text-white">3,500 cases</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <a
              href="https://archiveofsilence.org/"
              target="_blank"
              rel="noopener noreferrer"
              className={`block font-sans text-[10px] text-[var(--uk-accent)] hover:text-neutral-200 ${UC_META}`}
            >
              Source: archiveofsilence.org ↗
            </a>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-3 border-red-500/20 bg-neutral-950/60">
          <CardHeader className="space-y-1 p-3 pb-2">
            <CardTitle className={`text-sm text-neutral-100 ${UC_TITLE}`}>
              LEFTIST GROUPS
            </CardTitle>
            <CardDescription className={`text-[10px] text-neutral-500 ${UC_META}`}>
              Ranked leftist groups and organizations (2000-2025 cumulative framing)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 p-3 pt-0">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {LEFTIST_GROUPS.map((item) => (
                <LeftistGroupWidget key={item.rank} item={item} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
