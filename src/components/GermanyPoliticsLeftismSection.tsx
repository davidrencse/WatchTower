import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { GOV_POLITICS_CARD_GRID } from './GermanyGovernmentPoliticsBlocks';

const UC_TITLE = 'uppercase tracking-[0.05em]';
const UC_META = 'uppercase tracking-[0.03em]';

export const GERMANY_POLITICS_LEFTISM_GROUP_COUNT = 8;

export function GermanyPoliticsLeftismSection() {
  return (
    <div className="flex flex-col gap-3">
      <div className={GOV_POLITICS_CARD_GRID}>
        <Card>
          <CardHeader className="space-y-1 p-3 pb-2">
            <CardTitle className={`text-sm text-neutral-100 ${UC_TITLE}`}>
              Self-identified left-wing/progressive ideology share
            </CardTitle>
            <CardDescription className={`text-[10px] text-neutral-500 ${UC_META}`}>
              % identifying as left/very-left or supporting socialist policies
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <p className="font-sans text-2xl font-semibold text-white">25%</p>
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

        <Card>
          <CardHeader className="space-y-1 p-3 pb-2">
            <CardTitle className={`text-sm text-neutral-100 ${UC_TITLE}`}>Professors / self-identified left-leaning</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <p className="font-sans text-2xl font-semibold text-white">90%</p>
            <p className={`mt-2 font-sans text-[10px] leading-relaxed text-neutral-500 ${UC_META}`}>
              Source: Oxford-led analysis (Reuters Institute / academic studies summary)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1 p-3 pb-2">
            <CardTitle className={`text-sm text-neutral-100 ${UC_TITLE}`}>
              Supporting gender-neutral language mandates, diversity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <p className="font-sans text-2xl font-semibold text-white">25%</p>
            <p className={`mt-2 font-sans text-[10px] leading-relaxed text-neutral-500 ${UC_META}`}>
              Source: Statista / YouGov polls
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1 p-3 pb-2">
            <CardTitle className={`text-sm text-neutral-100 ${UC_TITLE}`}>Diversity quotas in media/corporations</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <p className="font-sans text-2xl font-semibold text-white">39%</p>
            <p className={`mt-2 font-sans text-[10px] leading-relaxed text-neutral-500 ${UC_META}`}>
              Reserved for DEI
            </p>
            <p className={`mt-1 font-sans text-[10px] leading-relaxed text-neutral-500 ${UC_META}`}>
              Source: Corporate board quota enforcement data (German government reports 2024-2025)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1 p-3 pb-2">
            <CardTitle className={`text-sm text-neutral-100 ${UC_TITLE}`}>Belief in Transgenderism</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <p className="font-sans text-2xl font-semibold text-white">90% (46% nationally)</p>
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

        <Card>
          <CardHeader className="space-y-1 p-3 pb-2">
            <CardTitle className={`text-sm text-neutral-100 ${UC_TITLE}`}>Belief in Open borders</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <p className="font-sans text-2xl font-semibold text-white">&gt;27% (3% nationally)</p>
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

        <Card className="sm:col-span-2 lg:col-span-3">
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

        <Card className="sm:col-span-2 lg:col-span-3">
          <CardHeader className="space-y-1 p-3 pb-2">
            <CardTitle className={`text-sm text-neutral-100 ${UC_TITLE}`}>
              Membership in left-wing NGOs / activist groups
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-3 pt-0">
            <div className="overflow-x-auto rounded border border-line">
              <table className="w-full min-w-[280px] border-collapse font-sans text-[11px]">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.03] text-left text-[10px] uppercase tracking-[0.1em] text-neutral-500">
                    <th className="px-3 py-2 font-medium">Group</th>
                    <th className="px-3 py-2 font-medium text-right">Membership</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/[0.06]">
                    <td className="px-3 py-2 text-neutral-200">BUND</td>
                    <td className="px-3 py-2 text-right tabular-nums text-white">674,000 members</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-neutral-200">Greenpeace Germany</td>
                    <td className="px-3 py-2 text-right tabular-nums text-white">&gt;200,000 members</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <a
              href="https://en.wikipedia.org/wiki/Bund_f%C3%BCr_Umwelt_und_Naturschutz_Deutschland"
              target="_blank"
              rel="noopener noreferrer"
              className={`block font-sans text-[10px] text-[var(--uk-accent)] hover:text-neutral-200 ${UC_META}`}
            >
              Source: BUND page ↗
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
