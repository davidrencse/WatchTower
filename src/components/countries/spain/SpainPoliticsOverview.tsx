import { memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import {
  SPAIN_IDEOLOGY_BY_SEX,
  SPAIN_IDEOLOGY_METHOD_NOTE,
} from '../../../lib/countries/spain/spainPoliticalIdentification';
import {
  SPAIN_GAZA_OPINION,
  SPAIN_GAZA_OPINION_SOURCE,
  SPAIN_TWO_STATE_SUPPORT_BY_GENDER,
} from '../../../lib/countries/spain/spainIsraelSupportByGender';
import {
  SPAIN_EXTERNAL_THREAT_BY_IDEOLOGY,
  SPAIN_UKRAINE_SECURITY_OPINION,
  SPAIN_UKRAINE_SECURITY_SOURCE,
} from '../../../lib/countries/spain/spainRussiaUkraineSupport';

/*
 * THESIS: Spain's overview is a dated evidence brief, not a synthetic long-run polling story.
 * OWN-WORLD: WatchTower's flat black instrument surfaces, hairlines, condensed labels and visible sources.
 * STORY: Establish who governs, how the chamber was elected, then separate domestic ideology from foreign-policy opinion.
 * FIRST VIEWPORT: Government status and the 2023 chamber allocation appear before attitudinal evidence.
 * FORM: Four full-width evidence plates; measured values remain readable without hover and tables survive narrow screens.
 */

const TITLE = 'uppercase tracking-[0.05em]';
const META = 'uppercase tracking-[0.03em]';

const GOVERNMENT_SOURCE =
  'https://www.lamoncloa.gob.es/gobierno/composiciondelgobierno/Paginas/index.aspx?mode=Light';
const LEGISLATURE_SOURCE = 'https://www.congreso.es/es/cem/histxvleg';
const INVESTITURE_SOURCE = 'https://www.congreso.es/es/cem/sesiones-de-investidura';
const ELECTION_SOURCE = 'https://www.boe.es/buscar/doc.php?id=BOE-A-2023-18907';

const CHAMBER = [
  { label: 'PP', seats: 137, detail: 'largest elected bloc' },
  { label: 'Socialist lists', seats: 121, detail: 'PSOE 102 + PSC–PSOE 19' },
  { label: 'Vox', seats: 33, detail: 'national-conservative opposition' },
  { label: 'Sumar', seats: 31, detail: 'junior coalition partner' },
  { label: 'Regional & other lists', seats: 28, detail: 'ERC, Junts, EH Bildu, PNV, BNG, CC and UPN' },
] as const;

function SourceLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-11 items-center text-[11px] text-neutral-300 underline decoration-neutral-600 underline-offset-4 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
    >
      {children}
    </a>
  );
}

function EvidenceMetric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="border-t border-line pt-3 first:border-t-0 first:pt-0 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0 sm:first:border-l-0 sm:first:pl-0">
      <p className={`text-[11px] font-medium text-neutral-500 ${META}`}>{label}</p>
      <p className="mt-1 font-sans text-2xl font-semibold tabular-nums text-neutral-100">{value}</p>
      <p className="mt-1 max-w-[44ch] font-sans text-xs leading-relaxed text-neutral-400">{detail}</p>
    </div>
  );
}

function IdeologyBar({ left, right }: { left: number; right: number }) {
  const remainder = Math.max(0, 100 - left - right);
  return (
    <div
      className="flex h-2.5 min-w-32 overflow-hidden rounded-sm bg-white/[0.04]"
      role="img"
      aria-label={`${left}% left, ${right}% right, ${remainder.toFixed(1)}% centre, midpoint or non-response`}
    >
      <span className="bg-red-400/70" style={{ width: `${left}%` }} />
      <span className="bg-white/[0.08]" style={{ width: `${remainder}%` }} />
      <span className="bg-blue-400/70" style={{ width: `${right}%` }} />
    </div>
  );
}

export const SPAIN_POLITICS_OVERVIEW_GROUP_COUNT = 4;

export const SpainPoliticsOverview = memo(function SpainPoliticsOverview() {
  const latestIdeology = SPAIN_IDEOLOGY_BY_SEX.at(-1)!;

  return (
    <div className="flex flex-col gap-4">
      <Card className="overflow-hidden border-line bg-surface-metric shadow-card">
        <CardHeader className="space-y-1 p-4 pb-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className={`text-sm font-semibold text-neutral-100 ${TITLE}`}>
                Executive & mandate
              </CardTitle>
              <CardDescription className="mt-1 max-w-[72ch] font-sans text-xs leading-relaxed text-neutral-400">
                Current institutional snapshot, assessed 11 August 2026. Spain remains in the XV Legislature.
              </CardDescription>
            </div>
            <span className={`border border-cyan-400/25 bg-cyan-400/[0.06] px-2 py-1 text-[11px] text-cyan-200 ${META}`}>
              Current government
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="grid gap-4 border-y border-line py-4 sm:grid-cols-2 lg:grid-cols-4">
            <EvidenceMetric label="Head of state" value="Felipe VI" detail="Constitutional monarch since 19 June 2014." />
            <EvidenceMetric label="Prime minister" value="Pedro Sánchez" detail="PSOE; invested for the current term on 16 November 2023." />
            <EvidenceMetric label="Executive" value="PSOE + Sumar" detail="Progressive coalition governing without its own parliamentary majority." />
            <EvidenceMetric label="Investiture" value="179–171" detail="Majority secured with support from regional and nationalist parties." />
          </div>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
            <SourceLink href={GOVERNMENT_SOURCE}>La Moncloa — current cabinet</SourceLink>
            <SourceLink href={LEGISLATURE_SOURCE}>Congress — XV Legislature</SourceLink>
            <SourceLink href={INVESTITURE_SOURCE}>Congress — 2023 investiture vote</SourceLink>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-line bg-surface-metric shadow-card">
        <CardHeader className="space-y-1 p-4 pb-3">
          <CardTitle className={`text-sm font-semibold text-neutral-100 ${TITLE}`}>
            Congreso elected composition
          </CardTitle>
          <CardDescription className="font-sans text-xs leading-relaxed text-neutral-400">
            Seat allocation from the 23 July 2023 general election. This is the election result, not a claim that every current group total is unchanged after replacements and affiliation changes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 p-4 pt-0">
          {CHAMBER.map((party) => (
            <div key={party.label} className="grid items-center gap-2 sm:grid-cols-[11rem_minmax(0,1fr)_3rem]">
              <div>
                <p className="font-sans text-xs font-semibold text-neutral-200">{party.label}</p>
                <p className="font-sans text-[11px] leading-relaxed text-neutral-500">{party.detail}</p>
              </div>
              <div className="h-2.5 overflow-hidden rounded-sm bg-white/[0.04]" aria-hidden="true">
                <div className="h-full bg-neutral-300/70" style={{ width: `${(party.seats / 137) * 100}%` }} />
              </div>
              <p className="text-right font-mono text-xs tabular-nums text-neutral-200">{party.seats}</p>
            </div>
          ))}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-2">
            <p className={`text-[11px] text-neutral-500 ${META}`}>350 seats · 176 for an absolute majority</p>
            <SourceLink href={ELECTION_SOURCE}>BOE / Junta Electoral Central — definitive result</SourceLink>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-line bg-surface-metric shadow-card">
        <CardHeader className="space-y-1 p-4 pb-3">
          <CardTitle className={`text-sm font-semibold text-neutral-100 ${TITLE}`}>
            Left–right self-placement by sex
          </CardTitle>
          <CardDescription className="font-sans text-xs leading-relaxed text-neutral-400">
            Nine observed CIS snapshots from January 2025 to March 2026. Latest: men {latestIdeology.menLeftPct}% left / {latestIdeology.menRightPct}% right; women {latestIdeology.womenLeftPct}% left / {latestIdeology.womenRightPct}% right.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-neutral-400">
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 bg-red-400/70" />Left (1–4)</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 bg-blue-400/70" />Right (6–10)</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 bg-white/[0.08]" />Midpoint / other</span>
          </div>
          <div className="overflow-x-auto rounded-md border border-line">
            <table className="w-full min-w-[720px] border-collapse font-sans text-[11px] tabular-nums">
              <caption className="sr-only">Observed Spanish ideology shares by sex, January 2025 to March 2026</caption>
              <thead className="bg-white/[0.03] text-left text-[11px] text-neutral-500">
                <tr>
                  <th className="px-3 py-2 font-medium" scope="col">Period</th>
                  <th className="px-3 py-2 font-medium" scope="col">Men</th>
                  <th className="px-3 py-2 text-right font-medium" scope="col">L / R</th>
                  <th className="px-3 py-2 font-medium" scope="col">Women</th>
                  <th className="px-3 py-2 text-right font-medium" scope="col">L / R</th>
                  <th className="px-3 py-2 text-right font-medium" scope="col">Study</th>
                </tr>
              </thead>
              <tbody>
                {SPAIN_IDEOLOGY_BY_SEX.map((row) => (
                  <tr key={row.study} className="border-t border-line text-neutral-300">
                    <th className="whitespace-nowrap px-3 py-2 text-left font-medium" scope="row">{row.period}</th>
                    <td className="px-3 py-2"><IdeologyBar left={row.menLeftPct} right={row.menRightPct} /></td>
                    <td className="whitespace-nowrap px-3 py-2 text-right">{row.menLeftPct}% / {row.menRightPct}%</td>
                    <td className="px-3 py-2"><IdeologyBar left={row.womenLeftPct} right={row.womenRightPct} /></td>
                    <td className="whitespace-nowrap px-3 py-2 text-right">{row.womenLeftPct}% / {row.womenRightPct}%</td>
                    <td className="px-3 py-0 text-right">
                      <a
                        href={row.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-11 items-center underline decoration-neutral-600 underline-offset-4 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                      >
                        {row.study}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 max-w-[90ch] font-sans text-[11px] leading-relaxed text-neutral-500">
            {SPAIN_IDEOLOGY_METHOD_NOTE}
          </p>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-line bg-surface-metric shadow-card">
        <CardHeader className="space-y-1 p-4 pb-3">
          <CardTitle className={`text-sm font-semibold text-neutral-100 ${TITLE}`}>
            Foreign-policy opinion
          </CardTitle>
          <CardDescription className="font-sans text-xs leading-relaxed text-neutral-400">
            Direct findings from Elcano’s 45th barometer (1,000 interviews, fieldwork 19–29 May 2025; ±3.2 points for the full sample).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 p-4 pt-0">
          <section aria-labelledby="spain-gaza-opinion">
            <h3 id="spain-gaza-opinion" className={`mb-3 text-[11px] font-semibold text-neutral-300 ${TITLE}`}>
              Israel, Gaza & Palestine
            </h3>
            <div className="grid gap-4 border-y border-line py-4 sm:grid-cols-2 lg:grid-cols-5">
              {SPAIN_GAZA_OPINION.map((metric) => <EvidenceMetric key={metric.label} {...metric} />)}
            </div>
            <p className="mt-3 font-sans text-xs leading-relaxed text-neutral-400">
              A two-state solution was preferred by {SPAIN_TWO_STATE_SUPPORT_BY_GENDER.overallPct}% overall — {SPAIN_TWO_STATE_SUPPORT_BY_GENDER.menPct}% of men and {SPAIN_TWO_STATE_SUPPORT_BY_GENDER.womenPct}% of women.
            </p>
          </section>

          <section aria-labelledby="spain-security-opinion">
            <h3 id="spain-security-opinion" className={`mb-3 text-[11px] font-semibold text-neutral-300 ${TITLE}`}>
              Ukraine, NATO & security
            </h3>
            <div className="grid gap-4 border-y border-line py-4 sm:grid-cols-2 lg:grid-cols-4">
              {SPAIN_UKRAINE_SECURITY_OPINION.map((metric) => <EvidenceMetric key={metric.label} {...metric} />)}
            </div>
            <div className="mt-4 overflow-x-auto rounded-md border border-line">
              <table className="w-full min-w-[460px] border-collapse font-sans text-[11px] tabular-nums">
                <caption className="px-3 py-2 text-left text-[11px] text-neutral-500">
                  Share naming each country as a threat to Spain, among respondents who perceive an external threat
                </caption>
                <thead className="border-t border-line bg-white/[0.03] text-left text-[11px] text-neutral-500">
                  <tr>
                    <th className="px-3 py-2 font-medium" scope="col">Ideology</th>
                    <th className="px-3 py-2 text-right font-medium" scope="col">Morocco</th>
                    <th className="px-3 py-2 text-right font-medium" scope="col">Russia</th>
                    <th className="px-3 py-2 text-right font-medium" scope="col">United States</th>
                  </tr>
                </thead>
                <tbody>
                  {SPAIN_EXTERNAL_THREAT_BY_IDEOLOGY.map((row) => (
                    <tr key={row.bloc} className="border-t border-line text-neutral-300">
                      <th className="px-3 py-2 text-left font-medium" scope="row">{row.bloc}</th>
                      <td className="px-3 py-2 text-right">{row.moroccoPct}%</td>
                      <td className="px-3 py-2 text-right">{row.russiaPct}%</td>
                      <td className="px-3 py-2 text-right">{row.unitedStatesPct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="flex flex-wrap gap-x-5 gap-y-1 border-t border-line pt-2">
            <SourceLink href={SPAIN_GAZA_OPINION_SOURCE.url}>{SPAIN_GAZA_OPINION_SOURCE.label}</SourceLink>
            <SourceLink href={SPAIN_UKRAINE_SECURITY_SOURCE.url}>{SPAIN_UKRAINE_SECURITY_SOURCE.label}</SourceLink>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
