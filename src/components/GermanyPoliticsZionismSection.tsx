import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { memo } from 'react';
import { GOV_POLITICS_CARD_GRID } from './GermanyGovernmentPoliticsBlocks';
import { GermanyJewishGovernmentCarousel } from './GermanyJewishGovernmentCarousel';
import { GermanyPoliticsSecretSocietiesSection } from './GermanyPoliticsSecretSocietiesSection';
import { PoliticsGroupLeaderboard } from './PoliticsGroupLeaderboard';
import { FRANCE_ZIONISM_GROUPS, FRANCE_ZIONISM_METRICS } from '../lib/francePoliticsZionism';
import { FRANCE_JEWISH_GOVERNMENT_PEOPLE } from '../data/franceJewishGovernmentPeople';
import {
  ITALY_ISRAEL_CORPORATE_TIES,
  ITALY_ZIONISM_GROUPS,
  ITALY_ZIONISM_METRICS,
} from '../lib/italyPoliticsZionism';

const UC_TITLE = 'uppercase tracking-[0.05em]';
const UC_META = 'uppercase tracking-[0.03em]';

type ZionGroup = {
  rank: number;
  group: string;
  type: string;
  size: string;
  notes: string;
};

const ZION_GROUPS: readonly ZionGroup[] = [
  {
    rank: 1,
    group: 'Zentralrat der Juden in Deutschland',
    type: 'Umbrella organization',
    size: '105 local communities, ~118,000 members',
    notes: 'Official representative body of Jews in Germany; recognized by the state',
  },
  {
    rank: 2,
    group: 'Deutsch-Israelische Gesellschaft (DIG)',
    type: 'German-Israeli friendship society',
    size: '9,229 members',
    notes: 'Largest pro-Israel network; includes many politicians',
  },
  {
    rank: 3,
    group: 'Zentralwohlfahrtsstelle der Juden in Deutschland (ZWST)',
    type: 'Jewish welfare & social services',
    size: 'National umbrella',
    notes: 'Main social welfare organization for Jewish communities',
  },
  {
    rank: 4,
    group: 'Hillel Deutschland',
    type: 'Jewish student & young adult',
    size: 'Reaches ~1,700+ young Jews annually',
    notes: 'Campus and youth engagement across multiple cities',
  },
  {
    rank: 5,
    group: 'Makkabi Deutschland',
    type: 'Jewish sports organization',
    size: '6,600 members',
    notes: 'Largest Jewish sports federation',
  },
  {
    rank: 6,
    group: "B'nai B'rith (various lodges)",
    type: 'Jewish service & advocacy',
    size: '5 German lodges',
    notes: 'Long-established international Jewish organization',
  },
  {
    rank: 7,
    group: "WIZO Germany (Women's International Zionist Org.)",
    type: "Zionist women's organization",
    size: '>10,000 members',
    notes: 'Focus on women, family, and Israel support',
  },
  {
    rank: 8,
    group: 'Union of Progressive Jews in Germany',
    type: 'Liberal / Reform Judaism',
    size: '5,200 members',
    notes: 'Umbrella for progressive/liberal Jewish communities',
  },
  {
    rank: 9,
    group: 'AJC Berlin (American Jewish Committee)',
    type: 'Advocacy & transatlantic relations',
    size: 'Berlin-based institute',
    notes: 'Promotes German-Jewish and German-Israeli relations',
  },
  {
    rank: 10,
    group: 'Juedische Studierendenunion Deutschland (JSUD)',
    type: 'Jewish students',
    size: '~14 local student groups',
    notes: 'National Jewish student union',
  },
  {
    rank: 11,
    group: 'Leo Baeck Institute (Berlin / New York)',
    type: 'Research & archives',
    size: 'Major archive in Berlin',
    notes: 'Focus on history of German-speaking Jewry',
  },
  {
    rank: 12,
    group: 'Masorti Germany',
    type: 'Conservative / Masorti Judaism',
    size: '2 congregations',
    notes: 'Traditional but non-Orthodox Jewish communities',
  },
];

function ZionMetricCard({
  title,
  value,
  notes,
  source,
  sourceUrl,
}: {
  title: string;
  value: string;
  notes: string;
  source?: string;
  sourceUrl?: string;
}) {
  return (
    <Card className="border-blue-500/20 bg-neutral-950/60">
      <CardHeader className="space-y-1 p-3 pb-2">
        <CardTitle className={`text-sm text-neutral-100 ${UC_TITLE}`}>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <p className="font-sans text-2xl font-semibold text-blue-300">{value}</p>
        <p className={`mt-2 font-sans text-[10px] leading-relaxed text-neutral-400 ${UC_META}`}>{notes}</p>
        {source ? (
          <p className={`mt-1 font-sans text-[10px] leading-relaxed text-neutral-500 ${UC_META}`}>
            Source:{' '}
            {sourceUrl ? (
              <a className="underline decoration-white/20 underline-offset-2 hover:text-blue-300" href={sourceUrl} target="_blank" rel="noreferrer">
                {source}
              </a>
            ) : (
              source
            )}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export const GermanyPoliticsZionismSection = memo(function GermanyPoliticsZionismSection({
  iso3 = 'DEU',
  actualIso3,
}: {
  iso3?: string;
  actualIso3?: string;
}) {
  const effectiveIso3 = (actualIso3 ?? iso3).toUpperCase();
  const isItaly = effectiveIso3 === 'ITA';
  const isFrance = effectiveIso3 === 'FRA';

  if (isItaly) {
    return (
      <div className="flex flex-col gap-3">
        <div className={GOV_POLITICS_CARD_GRID}>
          {ITALY_ZIONISM_METRICS.map((metric) => (
            <ZionMetricCard
              key={metric.title}
              title={metric.title}
              value={metric.value}
              notes={metric.notes}
              source={metric.source}
              sourceUrl={metric.sourceUrl}
            />
          ))}

          <Card className="sm:col-span-2 lg:col-span-3 border-blue-500/20 bg-neutral-950/60">
            <CardHeader className="space-y-1 p-3 pb-2">
              <CardTitle className={`text-sm text-neutral-100 ${UC_TITLE}`}>JEWISH STUDENT / COMMUNITY ORGANIZATIONS</CardTitle>
              <CardDescription className={`text-[10px] text-neutral-500 ${UC_META}`}>
                Publicly documented national, university, and campus organizations in Italy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 p-3 pt-0">
              <PoliticsGroupLeaderboard
                accent="blue"
                items={ITALY_ZIONISM_GROUPS.map((g) => ({
                  rank: g.rank,
                  group: g.group,
                  type: g.type,
                  value: g.size,
                  notes: g.notes,
                }))}
              />
              <p className={`font-sans text-[10px] leading-relaxed text-neutral-500 ${UC_META}`}>
                Sources:{' '}
                <a
                  className="underline decoration-white/20 underline-offset-2 hover:text-blue-300"
                  href="https://www.ugei.it/universita"
                  target="_blank"
                  rel="noreferrer"
                >
                  UGEI
                </a>
                {' · '}
                <a
                  className="underline decoration-white/20 underline-offset-2 hover:text-blue-300"
                  href="https://www.chabad.org/jewish-centers/1541294/Rome/Campus-Chabad-House/Chabad-on-Campus"
                  target="_blank"
                  rel="noreferrer"
                >
                  Chabad on Campus
                </a>
              </p>
            </CardContent>
          </Card>

          <Card className="sm:col-span-2 lg:col-span-3 border-blue-500/20 bg-neutral-950/60">
            <CardHeader className="space-y-1 p-3 pb-2">
              <CardTitle className={`text-sm text-neutral-100 ${UC_TITLE}`}>MAJOR CORPORATE / INNOVATION TIES</CardTitle>
              <CardDescription className={`text-[10px] text-neutral-500 ${UC_META}`}>
                Italian companies with directly documented Israel-based programs or partnerships
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {ITALY_ISRAEL_CORPORATE_TIES.map((item) => (
                  <a
                    key={item.label}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border border-white/[0.06] bg-white/[0.02] p-2 font-sans text-[10px] leading-relaxed text-neutral-300"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isFrance) {
    return (
      <div className="flex flex-col gap-3">
        <div className={GOV_POLITICS_CARD_GRID}>
          <GermanyJewishGovernmentCarousel
            entriesOverride={FRANCE_JEWISH_GOVERNMENT_PEOPLE}
            sourceCaption="Curated dataset: src/data/franceJewishGovernmentPeople.ts - Source: attached pasted-text.txt"
          />

          {FRANCE_ZIONISM_METRICS.map((metric) => (
            <ZionMetricCard
              key={metric.title}
              title={metric.title}
              value={metric.value}
              notes={metric.notes}
              source={metric.source}
            />
          ))}

          <Card className="sm:col-span-2 lg:col-span-3 border-blue-500/20 bg-neutral-950/60">
            <CardHeader className="space-y-1 p-3 pb-2">
              <CardTitle className={`text-sm text-neutral-100 ${UC_TITLE}`}>ZIONIST GROUPS / ORGANIZATIONS</CardTitle>
              <CardDescription className={`text-[10px] text-neutral-500 ${UC_META}`}>
                Jewish academic clubs and student organizations in France
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 p-3 pt-0">
              <PoliticsGroupLeaderboard
                accent="blue"
                items={FRANCE_ZIONISM_GROUPS.map((g) => ({
                  rank: g.rank,
                  group: g.group,
                  type: g.type,
                  value: g.size,
                  notes: g.notes,
                }))}
              />
            </CardContent>
          </Card>

          <Card className="sm:col-span-2 lg:col-span-3 border-blue-500/20 bg-neutral-950/60">
            <CardHeader className="space-y-1 p-3 pb-2">
              <CardTitle className={`text-sm text-neutral-100 ${UC_TITLE}`}>MAJOR CORPORATE TIES</CardTitle>
              <CardDescription className={`text-[10px] text-neutral-500 ${UC_META}`}>
                French corporations with R&amp;D or investment links in Israel
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  'Thales Group - R&D center in Haifa (cyber, radar)',
                  'Dassault Systemes - development lab in Tel Aviv',
                  'Sanofi - joint biotech research with Teva',
                  'TotalEnergies - stake in NewMed Energy',
                  'Airbus Defence & Space - collaboration with IAI',
                  'Veolia - water tech joint venture with Mekorot',
                  "L'Oreal - innovation labs in Netanya",
                  'Orange - indirect network services contract',
                  'Capgemini - R&D outsourcing in Herzliya',
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-md border border-white/[0.06] bg-white/[0.02] p-2 font-sans text-[10px] leading-relaxed text-neutral-300"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className={GOV_POLITICS_CARD_GRID}>
        <GermanyJewishGovernmentCarousel />
        <ZionMetricCard
          title="SELF-IDENTIFIED JEWISH IDENTITY SHARE"
          value="0.15% (~118,000-125,000)"
          notes="Share of total German population."
          source="Zentralrat der Juden in Deutschland / official community statistics 2025"
        />
        <ZionMetricCard
          title="PROFESSORS / SELF-IDENTIFIED JEWISH ACADEMICS"
          value="~150-200"
          notes="Netzwerk Juedischer Hochschullehrender in Germany/Austria/Switzerland; almost all in Germany."
          source="Official website of the Netzwerk Juedischer Hochschullehrender (2025)"
        />
        <ZionMetricCard
          title="SUPPORTING ISRAEL / STRONG JEWISH IDENTITY"
          value="~85-90%"
          notes="Within the Jewish community."
          source="Zentralrat der Juden surveys and community studies"
        />
        <ZionMetricCard
          title="BELIEF IN JEWISH CONSPIRACY THEORIES / ANTISEMITISM"
          value="15-25%"
          notes="General population share holding at least some antisemitic views."
          source="RIAS / Verfassungsschutz / ADL studies 2024-2025"
        />
        <ZionMetricCard
          title="BELIEF IN / SUPPORT FOR STRONG JEWISH SECURITY AND ISRAEL"
          value=">90%"
          notes="Within the Jewish community."
          source="Zentralrat der Juden and community polls"
        />
        <ZionMetricCard
          title="JEWISH ACADEMIC CLUBS / STUDENT ORGANIZATIONS"
          value="14 active groups"
          notes="Active Jewish student organizations/groups in Germany."
          source="JSUD official website and community reports"
        />
        <ZionMetricCard
          title="ECONOMIC TIES WITH ISRAEL"
          value=">7,000 companies"
          notes="Around 800 Bavarian companies operate with Israel; 240 Israeli companies have branches/subsidiaries in Germany."
        />
        <ZionMetricCard
          title="MAJOR GERMAN CORPORATIONS WITH R&D/INVESTMENT IN ISRAEL"
          value="Dozens (estimated 50-100+)"
          notes="Examples include SAP, Siemens, Bosch, VW, and Telekom."
        />
        <ZionMetricCard
          title="NUMBER OF GERMAN POLITICIANS WITH TIES TO ISRAEL"
          value="9,229 members (2024)"
          notes="Membership figure linked to political and public-network reach."
          source="The Deutsch-Israelische Gesellschaft (DIG)"
        />
        <ZionMetricCard
          title="ARMS EXPORTS AND DEALS"
          value="~$6.5-6.6 billion (2025)"
          notes="Arms export licenses and associated deal value."
        />
        <ZionMetricCard
          title="HOLOCAUST REPARATIONS"
          value="$90 billion"
          notes="Cumulative reparations figure."
        />
        <ZionMetricCard
          title="NUMBER OF GERMAN-ISRAELI DUAL CITIZENSHIPS"
          value="50,000"
          notes="Estimated dual-citizenship population."
        />

        <Card className="sm:col-span-2 lg:col-span-3 border-blue-500/20 bg-neutral-950/60">
          <CardHeader className="space-y-1 p-3 pb-2">
            <CardTitle className={`text-sm text-neutral-100 ${UC_TITLE}`}>ANTISEMITIC INCIDENTS</CardTitle>
            <CardDescription className={`text-[10px] text-neutral-500 ${UC_META}`}>
              Reported incidents and impact overview
            </CardDescription>
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
                    <td className="px-3 py-2 text-neutral-200">Annual reported antisemitic incidents</td>
                    <td className="px-3 py-2 text-right tabular-nums text-white">8,627 (2024) - record high in 2025</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-neutral-200">
                      People facing threats, vandalism, or violence due to Jewish identity
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-white">Several thousand cases annually</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={`font-sans text-[10px] text-neutral-500 ${UC_META}`}>
              Source: RIAS Bundesverband + police statistics
            </p>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-3 border-blue-500/20 bg-neutral-950/60">
          <CardHeader className="space-y-1 p-3 pb-2">
            <CardTitle className={`text-sm text-neutral-100 ${UC_TITLE}`}>ZIONIST GROUPS / ORGANIZATIONS</CardTitle>
            <CardDescription className={`text-[10px] text-neutral-500 ${UC_META}`}>
              Ranked organizations and institutional networks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 p-3 pt-0">
            <PoliticsGroupLeaderboard
              accent="blue"
              items={ZION_GROUPS.map((g) => ({ rank: g.rank, group: g.group, type: g.type, value: g.size, notes: g.notes }))}
            />
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex flex-col gap-4 border-t border-blue-500/20 pt-8">
        <h2 className={`font-sans text-sm font-semibold text-neutral-100 ${UC_TITLE}`}>Secret Societies</h2>
        <GermanyPoliticsSecretSocietiesSection />
      </div>
    </div>
  );
});
