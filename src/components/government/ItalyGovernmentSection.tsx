import { memo, useMemo, useState, type ReactNode } from 'react';
import { CollapsibleFlagSection } from '../CollapsibleFlagSection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';
import { PolicyCarousel } from './PolicyCarousel';
import { ImmigrationPoliciesPanel } from './ImmigrationPoliciesPanel';
import { ItalyCitizenshipBlocks } from './ItalyCitizenshipBlocks';
import {
  ITALY_IMMIGRATION_POLICIES_SUBSECTION_COUNT,
  ITALY_IMMIGRATION_POLICY_AREAS,
  ITALY_IMMIGRATION_POLICY_CONTEXT,
} from '../../data/government/italyImmigrationPolicies';
import { ITALY_POLICY_INFOGRAPHICS } from '../../data/government/italyPolicyCards';
import {
  CAMERA_DEI_DEPUTATI,
  ELECTION_2022_TURNOUT,
  ELECTION_NOTE,
  ELECTION_SOURCE,
  GENERAL_ELECTION_2022,
  GENERAL_ELECTION_2022_SEATS,
  ITALY_DEMOCRATIC_SENTIMENT,
  ITALY_GOV_OVERVIEW,
  ITALY_TRUST,
  SENATE_LIFE_NOTE,
  SENATO_DELLA_REPUBBLICA,
  TRUST_SOURCE,
  type Chamber,
  type GovStat,
} from '../../data/government/italy';

/**
 * Italy — Government section.
 *
 * Rendered instead of `GermanyGovernmentSection` for ITA. All values come from
 * `data/government/italy.ts` (published Italian sources), and every chart in the
 * top blocks is hand-drawn SVG/CSS rather than recharts, so only the citizenship
 * subsection adds to the country-page chart bundle.
 */

const UC_TITLE = 'uppercase tracking-[0.05em]';
const UC_META = 'uppercase tracking-[0.03em]';
const GOV_POLICIES_GRID = 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3';
const LABEL = 'font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500';

/* ------------------------------------------------------------------ overview */

function StatCard({ stat }: { stat: GovStat }) {
  return (
    <div className="flex flex-col rounded-md border border-line bg-surface-metric p-3.5 shadow-card sm:p-4">
      <p className={LABEL}>{stat.label}</p>
      <p
        className="mt-2 font-sans text-lg font-semibold leading-tight tracking-tight text-neutral-50 sm:text-xl"
        style={{ color: stat.accent }}
      >
        {stat.value}
      </p>
      {stat.sub ? <p className="mt-1.5 font-sans text-[10px] leading-snug text-neutral-500">{stat.sub}</p> : null}
    </div>
  );
}

function OverviewBlock() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {ITALY_GOV_OVERVIEW.map((s) => (
        <StatCard key={s.label} stat={s} />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- hemicycle */

function wedgePath(cx: number, cy: number, rInner: number, rOuter: number, t0: number, t1: number): string {
  const pt = (r: number, t: number) => ({ x: cx + r * Math.cos(t), y: cy - r * Math.sin(t) });
  const o0 = pt(rOuter, t0);
  const o1 = pt(rOuter, t1);
  const i1 = pt(rInner, t1);
  const i0 = pt(rInner, t0);
  const large = Math.abs(t1 - t0) > Math.PI ? 1 : 0;
  return [
    `M ${i0.x} ${i0.y}`,
    `L ${o0.x} ${o0.y}`,
    `A ${rOuter} ${rOuter} 0 ${large} ${t0 > t1 ? 1 : 0} ${o1.x} ${o1.y}`,
    `L ${i1.x} ${i1.y}`,
    `A ${rInner} ${rInner} 0 ${large} ${t0 > t1 ? 0 : 1} ${i0.x} ${i0.y}`,
    'Z',
  ].join(' ');
}

function ChamberHemicycle({ chamber }: { chamber: Chamber }) {
  const [active, setActive] = useState<string | null>(null);
  const total = useMemo(() => chamber.groups.reduce((n, g) => n + g.seats, 0), [chamber.groups]);

  const slices = useMemo(() => {
    let cum = 0;
    return chamber.groups.map((g) => {
      const t0 = Math.PI * (1 - (2 * cum) / total);
      cum += g.seats;
      const t1 = Math.PI * (1 - (2 * cum) / total);
      return { ...g, t0, t1 };
    });
  }, [chamber.groups, total]);

  const selected = chamber.groups.find((g) => g.id === active) ?? null;
  const cx = 200;
  const cy = 198;
  const rOuter = 175;
  const rInner = 108;

  // Majority marker: angle at which the threshold seat is reached, measured from the left.
  const majorityAngle =
    chamber.majorityThreshold != null ? Math.PI * (1 - (2 * chamber.majorityThreshold) / total) : null;

  return (
    <Card className="overflow-hidden border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 border-b border-line bg-black/25 p-4 pb-3 shadow-inset">
        <CardTitle className={`font-sans text-base font-semibold tracking-tight text-white ${UC_TITLE}`}>
          {chamber.title}
        </CardTitle>
        <CardDescription className={`font-sans text-[10px] text-neutral-500 ${UC_META}`}>
          {chamber.subtitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-5">
        <div className="mx-auto w-full max-w-[420px]">
          <svg
            viewBox="0 0 400 220"
            className="h-auto w-full"
            role="img"
            aria-label={`${chamber.title} seat distribution`}
            onMouseLeave={() => setActive(null)}
          >
            <line x1={cx - rOuter} y1={cy} x2={cx + rOuter} y2={cy} stroke="#2a2a2a" strokeWidth={1} />
            {slices.map((g) => {
              const isActive = active === g.id;
              return (
                <path
                  key={g.id}
                  d={wedgePath(cx, cy, rInner, rOuter, g.t0, g.t1)}
                  fill={g.color}
                  stroke="#111"
                  strokeWidth={isActive ? 2.2 : 1.1}
                  onMouseEnter={() => setActive(g.id)}
                  className="cursor-pointer transition-[filter,opacity] duration-150"
                  style={{ filter: isActive ? 'brightness(1.16)' : 'none', opacity: active && !isActive ? 0.6 : 1 }}
                >
                  <title>{`${g.id} — ${g.name}: ${g.seats} seats`}</title>
                </path>
              );
            })}
            {majorityAngle != null ? (
              <line
                x1={cx + (rInner - 6) * Math.cos(majorityAngle)}
                y1={cy - (rInner - 6) * Math.sin(majorityAngle)}
                x2={cx + (rOuter + 6) * Math.cos(majorityAngle)}
                y2={cy - (rOuter + 6) * Math.sin(majorityAngle)}
                stroke="#fafafa"
                strokeWidth={1.5}
                strokeDasharray="3 3"
              />
            ) : null}
            <text x={cx} y={cy - rInner + 2} textAnchor="middle" className="fill-white font-sans text-[22px] font-semibold">
              {total}
            </text>
            <text x={cx} y={cy - rInner + 22} textAnchor="middle" className={`fill-neutral-400 font-sans text-[10px] ${UC_META}`}>
              seggi
            </text>
          </svg>
        </div>

        {chamber.majorityThreshold != null ? (
          <p className="mt-1 text-center font-sans text-[10px] text-neutral-500">
            Dashed line = {chamber.majorityThreshold}-seat majority
          </p>
        ) : null}

        <div className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
          {chamber.groups.map((g) => (
            <button
              key={g.id}
              type="button"
              onMouseEnter={() => setActive(g.id)}
              onFocus={() => setActive(g.id)}
              onBlur={() => setActive(null)}
              className={cn(
                'flex items-center justify-between gap-2 rounded border border-line px-2 py-1 text-left transition-colors hover:bg-neutral-900/60',
                active === g.id && 'bg-neutral-900/60',
              )}
            >
              <span className="inline-flex min-w-0 items-center gap-1.5 font-sans text-[10px] text-neutral-300">
                <span className="h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: g.color }} />
                <span className="truncate">{g.id}</span>
              </span>
              <span className="shrink-0 font-sans text-[10px] tabular-nums text-white">{g.seats}</span>
            </button>
          ))}
        </div>

        <p className="mt-3 min-h-[2.5em] text-center font-sans text-[10px] leading-relaxed text-neutral-400">
          {selected
            ? `${selected.name} — ${selected.seats} seats (${((selected.seats / total) * 100).toFixed(1)}%)`
            : 'Hover a segment or group to inspect it'}
        </p>

        <dl className="mt-3 grid grid-cols-1 gap-2 border-t border-white/[0.06] pt-3 sm:grid-cols-2">
          <div>
            <dt className={LABEL}>President</dt>
            <dd className="font-sans text-[11px] text-neutral-300">
              {chamber.president} <span className="text-neutral-500">· {chamber.presidentSince}</span>
            </dd>
          </div>
          <div>
            <dt className={LABEL}>Next election</dt>
            <dd className="font-sans text-[11px] text-neutral-300">{chamber.nextElection}</dd>
          </div>
        </dl>

        <a
          href={chamber.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex font-sans text-[10px] text-[var(--uk-accent)] hover:text-neutral-200"
        >
          {chamber.sourceLabel} ↗
        </a>
      </CardContent>
    </Card>
  );
}

/* ---------------------------------------------------------------- elections */

function ShareBar({ label, value, color, max }: { label: string; value: number; color: string; max: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-sans text-[10px] text-neutral-400">{label}</span>
        <span className="font-sans text-[10px] font-semibold tabular-nums text-neutral-200">{value.toFixed(1)}%</span>
      </div>
      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div className="h-full rounded-full" style={{ width: `${(value / max) * 100}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function ElectionBlock() {
  const totalSeats = GENERAL_ELECTION_2022_SEATS.reduce((n, s) => n + s.seats, 0);
  return (
    <Card className="border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2">
        <CardTitle className={`font-sans text-base font-semibold tracking-tight text-white ${UC_TITLE}`}>
          2022 general election
        </CardTitle>
        <CardDescription className={`font-sans text-[10px] text-neutral-500 ${UC_META}`}>
          Held 25 September 2022 · turnout {ELECTION_2022_TURNOUT}%
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-4 pt-2">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {GENERAL_ELECTION_2022.map((section) => (
            <div key={section.label} className="space-y-2.5 rounded-md border border-white/[0.06] bg-white/[0.02] p-3">
              <p className={LABEL}>{section.label}</p>
              {section.shares.map((s) => (
                <ShareBar key={s.label} label={s.label} value={s.value} color={s.color} max={section.max} />
              ))}
            </div>
          ))}
        </div>

        <div>
          <p className={LABEL}>Seats won by coalition — Chamber ({totalSeats})</p>
          <div className="mt-2 flex h-6 w-full overflow-hidden rounded-md">
            {GENERAL_ELECTION_2022_SEATS.map((s) => (
              <div
                key={s.label}
                className="group relative h-full"
                style={{ width: `${(s.seats / totalSeats) * 100}%`, backgroundColor: s.color }}
                title={`${s.label}: ${s.seats} seats`}
              />
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            {GENERAL_ELECTION_2022_SEATS.map((s) => (
              <span key={s.label} className="inline-flex items-center gap-1.5 font-sans text-[10px] text-neutral-400">
                <span className="h-2 w-2 rounded-[2px]" style={{ backgroundColor: s.color }} />
                {s.label}
                <span className="tabular-nums text-neutral-200">{s.seats}</span>
              </span>
            ))}
          </div>
        </div>

        <p className="font-sans text-[10px] leading-relaxed text-neutral-500">{ELECTION_NOTE}</p>

        <a
          href={ELECTION_SOURCE.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex font-sans text-[10px] text-[var(--uk-accent)] hover:text-neutral-200"
        >
          {ELECTION_SOURCE.label} ↗
        </a>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------- trust */

function TrustRow({ label, value, delta }: { label: string; value: number; delta?: number }) {
  const tone = value >= 60 ? '#4ade80' : value >= 35 ? '#fbbf24' : '#f87171';
  return (
    <div className="flex items-center gap-3">
      <span className="w-[42%] shrink-0 truncate font-sans text-[11px] text-neutral-300" title={label}>
        {label}
      </span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: tone }} />
      </div>
      <span className="w-11 shrink-0 text-right font-sans text-[11px] font-semibold tabular-nums text-neutral-100">
        {value}%
      </span>
      <span className="w-8 shrink-0 text-right font-sans text-[10px] tabular-nums text-neutral-500">
        {delta != null ? (delta > 0 ? `+${delta}` : delta) : ''}
      </span>
    </div>
  );
}

function TrustBlock() {
  const institutions = ITALY_TRUST.filter((t) => t.group === 'institutions');
  const political = ITALY_TRUST.filter((t) => t.group === 'political');
  return (
    <Card className="border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-4 pb-2">
        <CardTitle className={`font-sans text-base font-semibold tracking-tight text-white ${UC_TITLE}`}>
          Trust in institutions
        </CardTitle>
        <CardDescription className={`font-sans text-[10px] text-neutral-500 ${UC_META}`}>
          Share of respondents who trust each institution — Eurispes, Rapporto Italia 2026
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-4 pt-2">
        <div className="space-y-2">
          <p className={LABEL}>Services, security & society</p>
          {institutions.map((t) => (
            <TrustRow key={t.label} label={t.label} value={t.value} delta={t.delta} />
          ))}
        </div>
        <div className="space-y-2 border-t border-white/[0.06] pt-3">
          <p className={LABEL}>National politics</p>
          {political.map((t) => (
            <TrustRow key={t.label} label={t.label} value={t.value} delta={t.delta} />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 border-t border-white/[0.06] pt-3 lg:grid-cols-3">
          {ITALY_DEMOCRATIC_SENTIMENT.map((s) => (
            <div key={s.label} className="rounded border border-white/[0.06] bg-white/[0.02] px-2.5 py-2">
              <p className="font-sans text-lg font-semibold leading-none tabular-nums text-neutral-100">{s.value}</p>
              <p className="mt-1 font-sans text-[9px] leading-snug text-neutral-500">{s.label}</p>
            </div>
          ))}
        </div>

        <a
          href={TRUST_SOURCE.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex font-sans text-[10px] text-[var(--uk-accent)] hover:text-neutral-200"
        >
          {TRUST_SOURCE.label} ↗
        </a>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ section */

export const ItalyGovernmentSection = memo(function ItalyGovernmentSection({
  collapseSignal,
  expandSignal,
  headerControls,
}: {
  collapseSignal?: number;
  expandSignal?: number;
  headerControls?: ReactNode;
}) {
  const parliamentCount = 4;
  const policiesCount = ITALY_POLICY_INFOGRAPHICS.length + ITALY_IMMIGRATION_POLICIES_SUBSECTION_COUNT;
  const citizenshipCount = 4;

  return (
    <CollapsibleFlagSection
      title="Government"
      count={ITALY_GOV_OVERVIEW.length + parliamentCount + policiesCount + citizenshipCount}
      defaultOpen
      anchorId="country-section-government"
      ribbonExpandKey="main:government"
      headerControls={headerControls}
      collapseSignal={collapseSignal}
      expandSignal={expandSignal}
    >
      <div className="flex flex-col gap-4">
        <OverviewBlock />

        <CollapsibleFlagSection
          title="Parliament"
          count={parliamentCount}
          defaultOpen
          uppercaseTitle
          anchorId="country-sub-government-parliament"
          ribbonExpandKey="sub:government:parliament"
          collapseSignal={collapseSignal}
          expandSignal={expandSignal}
        >
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
              <ChamberHemicycle chamber={CAMERA_DEI_DEPUTATI} />
              <ChamberHemicycle chamber={SENATO_DELLA_REPUBBLICA} />
            </div>
            <p className="font-sans text-[10px] leading-relaxed text-neutral-600">{SENATE_LIFE_NOTE}</p>
            <ElectionBlock />
            <TrustBlock />
          </div>
        </CollapsibleFlagSection>

        <CollapsibleFlagSection
          title="Policies"
          count={policiesCount}
          defaultOpen
          uppercaseTitle
          anchorId="country-sub-government-policies"
          ribbonExpandKey="sub:government:policies"
          collapseSignal={collapseSignal}
          expandSignal={expandSignal}
        >
          <div className="flex flex-col gap-3">
            <div className={GOV_POLICIES_GRID}>
              <PolicyCarousel cards={ITALY_POLICY_INFOGRAPHICS} label="Italian policy changes by sector" />
            </div>
            <CollapsibleFlagSection
              title="Immigration Policies"
              count={ITALY_IMMIGRATION_POLICIES_SUBSECTION_COUNT}
              defaultOpen
              uppercaseTitle
              collapseSignal={collapseSignal}
              expandSignal={expandSignal}
            >
              <ImmigrationPoliciesPanel
                context={ITALY_IMMIGRATION_POLICY_CONTEXT}
                areas={ITALY_IMMIGRATION_POLICY_AREAS}
              />
            </CollapsibleFlagSection>
          </div>
        </CollapsibleFlagSection>

        <CollapsibleFlagSection
          title="Citizenship"
          count={citizenshipCount}
          defaultOpen
          uppercaseTitle
          anchorId="country-sub-government-citizenship"
          ribbonExpandKey="sub:government:citizenship"
          collapseSignal={collapseSignal}
          expandSignal={expandSignal}
        >
          <ItalyCitizenshipBlocks />
        </CollapsibleFlagSection>

        <p className={`font-sans text-[10px] leading-relaxed text-neutral-600 ${UC_META}`}>
          All values are published figures from Italian and EU sources (Camera dei Deputati, Senato della Repubblica,
          Ministero dell’Interno, ISTAT, Eurostat, Eurispes, Transparency International). This section does not use the
          generated ita_government_politics.csv, whose government rows were modelled estimates.
        </p>
      </div>
    </CollapsibleFlagSection>
  );
});
