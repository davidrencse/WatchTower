import { memo, useMemo, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { cn } from '../../../lib/utils';
import {
  SPAIN_CONGRESS,
  SPAIN_PARLIAMENT_SOURCES,
  SPAIN_PARLIAMENT_UPDATED_AT,
  SPAIN_SENATE,
  type SpainParliamentChamber,
} from '../../../lib/countries/spain/spainParliament';

/**
 * THESIS: Spain's Parliament is understood through the power split between two chambers, not a wall of generic metrics.
 * OWN-WORLD: WatchTower's restrained dark evidence surface, with institutional blue, precise rules, and parliamentary arcs.
 * STORY: Read the current composition, inspect every group, then understand where governing power and majorities sit.
 * FIRST VIEWPORT: A bicameral masthead leads directly into two equally weighted interactive chamber diagrams.
 * FORM: Local extension of the established dense analytical dashboard; no new visual world or route-level redesign.
 */

const LABEL = 'font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-500';

type ArcSlice = SpainParliamentChamber['groups'][number] & { start: number; end: number };

function pointOnArc(cx: number, cy: number, radius: number, angle: number) {
  return { x: cx + radius * Math.cos(angle), y: cy - radius * Math.sin(angle) };
}

function arcPath(cx: number, cy: number, inner: number, outer: number, start: number, end: number): string {
  const outerStart = pointOnArc(cx, cy, outer, start);
  const outerEnd = pointOnArc(cx, cy, outer, end);
  const innerEnd = pointOnArc(cx, cy, inner, end);
  const innerStart = pointOnArc(cx, cy, inner, start);
  const largeArc = Math.abs(start - end) > Math.PI ? 1 : 0;
  return [
    `M ${innerStart.x} ${innerStart.y}`,
    `L ${outerStart.x} ${outerStart.y}`,
    `A ${outer} ${outer} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${inner} ${inner} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ');
}

function ChamberDiagram({ chamber }: { chamber: SpainParliamentChamber }) {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const slices = useMemo<ArcSlice[]>(() => {
    let seatsBefore = 0;
    return chamber.groups.map((group) => {
      const start = Math.PI - (Math.PI * seatsBefore) / chamber.totalSeats;
      seatsBefore += group.seats;
      const end = Math.PI - (Math.PI * seatsBefore) / chamber.totalSeats;
      return { ...group, start, end };
    });
  }, [chamber]);

  const selected = chamber.groups.find((group) => group.id === activeGroup) ?? null;
  const cx = 200;
  const cy = 190;
  const outer = 172;
  const inner = 103;
  const majorityAngle = Math.PI - (Math.PI * chamber.majorityThreshold) / chamber.totalSeats;
  const markerStart = pointOnArc(cx, cy, inner - 7, majorityAngle);
  const markerEnd = pointOnArc(cx, cy, outer + 7, majorityAngle);

  return (
    <article className="min-w-0 rounded-md border border-white/[0.07] bg-black/20 p-4 sm:p-5">
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="font-sans text-base font-semibold tracking-tight text-white">{chamber.title}</h4>
          <p className="mt-0.5 font-sans text-[11px] text-neutral-500">{chamber.spanishTitle}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-sans text-2xl font-semibold tabular-nums text-white">{chamber.totalSeats}</p>
          <p className={LABEL}>As of {chamber.compositionDate}</p>
        </div>
      </div>
      <p className="mt-3 max-w-[62ch] font-sans text-[11px] leading-relaxed text-neutral-400">{chamber.role}</p>

      <div className="mx-auto mt-3 w-full max-w-[460px]">
        <svg
          viewBox="0 0 400 205"
          className="h-auto w-full overflow-visible"
          role="img"
          aria-label={`${chamber.title}: ${chamber.totalSeats} seats across ${chamber.groups.length} parliamentary groups; ${chamber.majorityThreshold} seats required for an absolute majority.`}
          onMouseLeave={() => setActiveGroup(null)}
        >
          <line x1="21" y1={cy} x2="379" y2={cy} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          {slices.map((slice) => {
            const isActive = activeGroup === slice.id;
            const dimmed = activeGroup !== null && !isActive;
            return (
              <path
                key={slice.id}
                d={arcPath(cx, cy, inner, outer, slice.start, slice.end)}
                fill={slice.color}
                stroke="#111214"
                strokeWidth={isActive ? 2.4 : 1.25}
                opacity={dimmed ? 0.35 : 1}
                className="cursor-pointer transition-[opacity,filter] duration-150 motion-reduce:transition-none"
                style={{ filter: isActive ? 'brightness(1.16)' : undefined }}
                onMouseEnter={() => setActiveGroup(slice.id)}
                onFocus={() => setActiveGroup(slice.id)}
                tabIndex={0}
              >
                <title>{`${slice.name}: ${slice.seats} seats`}</title>
              </path>
            );
          })}
          <line
            x1={markerStart.x}
            y1={markerStart.y}
            x2={markerEnd.x}
            y2={markerEnd.y}
            stroke="#f5f5f5"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text x={cx} y="139" textAnchor="middle" className="fill-white font-sans text-[24px] font-semibold">
            {selected?.seats ?? chamber.majorityThreshold}
          </text>
          <text x={cx} y="157" textAnchor="middle" className="fill-neutral-400 font-sans text-[10px]">
            {selected ? selected.id : 'absolute majority'}
          </text>
        </svg>
      </div>

      <p className="-mt-1 min-h-8 text-center font-sans text-[10px] leading-relaxed text-neutral-400" aria-live="polite">
        {selected
          ? `${selected.name} · ${selected.seats} seats · ${((selected.seats / chamber.totalSeats) * 100).toFixed(1)}%`
          : `Dashed marker · ${chamber.majorityThreshold} seats required`}
      </p>

      <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
        {chamber.groups.map((group) => {
          const isActive = group.id === activeGroup;
          return (
            <button
              key={group.id}
              type="button"
              onMouseEnter={() => setActiveGroup(group.id)}
              onMouseLeave={() => setActiveGroup(null)}
              onFocus={() => setActiveGroup(group.id)}
              onBlur={() => setActiveGroup(null)}
              aria-pressed={isActive}
              className={cn(
                'flex min-h-11 items-center justify-between gap-2 rounded border px-2.5 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--uk-accent)] motion-reduce:transition-none',
                isActive ? 'border-white/25 bg-white/[0.08]' : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05]',
              )}
              title={group.name}
            >
              <span className="inline-flex min-w-0 items-center gap-2 font-sans text-[10px] text-neutral-300">
                <span className="h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: group.color }} />
                <span className="truncate">{group.id}</span>
              </span>
              <span className="font-sans text-[11px] font-semibold tabular-nums text-white">{group.seats}</span>
            </button>
          );
        })}
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-3 border-t border-white/[0.07] pt-4 sm:grid-cols-2">
        <div>
          <dt className={LABEL}>Chamber president</dt>
          <dd className="mt-1 font-sans text-[11px] text-neutral-200">
            {chamber.president} <span className="text-neutral-500">· {chamber.presidentParty}</span>
          </dd>
        </div>
        <div>
          <dt className={LABEL}>Composition note</dt>
          <dd className="mt-1 font-sans text-[10px] leading-relaxed text-neutral-400">{chamber.compositionNote}</dd>
        </div>
      </dl>

      <a
        href={chamber.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex min-h-11 items-center gap-1.5 font-sans text-[10px] text-[var(--uk-accent)] hover:text-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--uk-accent)]"
      >
        {chamber.sourceLabel} <ExternalLink aria-hidden className="h-3 w-3" />
      </a>
    </article>
  );
}

function MajorityBar({ label, seats, total, threshold, color, verdict }: {
  label: string;
  seats: number;
  total: number;
  threshold: number;
  color: string;
  verdict: string;
}) {
  const seatPercent = (seats / total) * 100;
  const thresholdPercent = (threshold / total) * 100;
  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="font-sans text-[11px] font-medium text-neutral-200">{label}</p>
          <p className="mt-1 font-sans text-[10px] text-neutral-500">{verdict}</p>
        </div>
        <p className="font-sans text-xl font-semibold tabular-nums text-white">
          {seats}<span className="ml-1 text-[10px] font-normal text-neutral-500">/ {total}</span>
        </p>
      </div>
      <div
        className="relative mt-3 h-3 overflow-visible rounded-sm bg-white/[0.07]"
        role="img"
        aria-label={`${label}: ${seats} of ${total} seats; absolute majority is ${threshold}. ${verdict}`}
      >
        <div className="h-full rounded-sm" style={{ width: `${seatPercent}%`, backgroundColor: color }} />
        <span className="absolute -top-1 h-5 w-px bg-white" style={{ left: `${thresholdPercent}%` }} aria-hidden />
      </div>
      <div className="mt-1 flex justify-between font-sans text-[9px] tabular-nums text-neutral-600">
        <span>0</span><span>{threshold} majority</span><span>{total}</span>
      </div>
    </div>
  );
}

export const SPAIN_PARLIAMENT_BLOCK_COUNT = 4;

export const SpainParliamentSection = memo(function SpainParliamentSection() {
  return (
    <section className="overflow-hidden rounded-md border border-line bg-surface-metric shadow-card" aria-labelledby="spain-parliament-title">
      <header className="border-b border-white/[0.07] bg-black/25 px-4 py-5 sm:px-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className={LABEL}>Spain · XV Legislature</p>
            <h3 id="spain-parliament-title" className="mt-2 font-sans text-2xl font-semibold tracking-tight text-white sm:text-3xl">Cortes Generales</h3>
            <p className="mt-2 max-w-[70ch] font-sans text-[11px] leading-relaxed text-neutral-400">
              Spain's bicameral parliament. The Congress determines confidence in the government; the Senate represents
              the territories and reviews legislation. Each chamber shows its latest verified composition date, not the
              2023 election-night result.
            </p>
          </div>
          <div className="grid min-w-0 grid-cols-1 gap-px overflow-hidden rounded border border-white/[0.07] bg-white/[0.07] sm:grid-cols-3 lg:min-w-[390px]">
            {[
              ['System', 'Bicameral'],
              ['Legislature', 'XV'],
              ['Reviewed', SPAIN_PARLIAMENT_UPDATED_AT],
            ].map(([label, value]) => (
              <div key={label} className="min-w-0 bg-neutral-950 px-3 py-2.5">
                <p className={LABEL}>{label}</p>
                <p className="mt-1 font-sans text-[11px] font-medium text-neutral-200">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="space-y-4 p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <ChamberDiagram chamber={SPAIN_CONGRESS} />
          <ChamberDiagram chamber={SPAIN_SENATE} />
        </div>

        <div className="grid grid-cols-1 gap-5 rounded-md border border-white/[0.07] bg-black/20 p-4 sm:p-5 lg:grid-cols-[0.8fr_1fr_1fr]">
          <div>
            <p className={LABEL}>Balance of power</p>
            <h4 className="mt-2 font-sans text-base font-semibold tracking-tight text-white">Two chambers, different arithmetic</h4>
            <p className="mt-2 max-w-[48ch] font-sans text-[10px] leading-relaxed text-neutral-400">
              PSOE and SUMAR govern without a Congress majority. The PP holds an absolute majority in the Senate, giving
              it control of that chamber while leaving the Congress as the decisive confidence chamber.
            </p>
          </div>
          <MajorityBar label="Government parties · Congress" seats={147} total={350} threshold={176} color="#d85a9b" verdict="29 seats short · agreements with other groups required" />
          <MajorityBar label="Popular Group · Senate" seats={141} total={265} threshold={133} color="#2f72d6" verdict="8 seats above the current absolute-majority threshold" />
        </div>

        <div className="grid grid-cols-1 gap-4 border-t border-white/[0.07] pt-4 lg:grid-cols-[1fr_auto] lg:items-start">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div><p className={LABEL}>Legislative power</p><p className="mt-1 font-sans text-[10px] leading-relaxed text-neutral-400">Makes national laws, approves the state budget and scrutinizes the government.</p></div>
            <div><p className={LABEL}>Congress primacy</p><p className="mt-1 font-sans text-[10px] leading-relaxed text-neutral-400">Invests or removes the prime minister and can ultimately override most Senate objections.</p></div>
            <div><p className={LABEL}>Senate design</p><p className="mt-1 font-sans text-[10px] leading-relaxed text-neutral-400">Combines directly elected senators with members designated by autonomous legislatures.</p></div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 lg:max-w-[260px] lg:justify-end">
            {Object.values(SPAIN_PARLIAMENT_SOURCES).map((source) => (
              <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 font-sans text-[10px] text-[var(--uk-accent)] hover:text-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--uk-accent)]">
                {source.label} <ExternalLink aria-hidden className="h-3 w-3" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});
