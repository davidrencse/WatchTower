import { useMemo, useState } from 'react';
import type { GermanyGovernmentPoliticsRow } from '../lib/germanyGovernmentPolitics';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const UC_TITLE = 'uppercase tracking-[0.05em]';
const UC_META = 'uppercase tracking-[0.03em]';

/** Display order (left → right in hemicycle). */
const SEAT_CHART_PARTY_ORDER = [
  'SPD',
  'CDU',
  'GRÜNE',
  'AfD',
  'CSU',
  'Die Linke',
  'SSW',
] as const;

/** Party colors and seat change vs 2021 — only these stay chromatic. */
const PARTY_CHART_META: Record<string, { color: string; deltaVs2021: number }> = {
  spd: { color: '#c0003d', deltaVs2021: -86 },
  cdu: { color: '#576164', deltaVs2021: 12 },
  grüne: { color: '#008549', deltaVs2021: -33 },
  gruene: { color: '#008549', deltaVs2021: -33 },
  grune: { color: '#008549', deltaVs2021: -33 },
  afd: { color: '#80cdec', deltaVs2021: 69 },
  csu: { color: '#004b76', deltaVs2021: -1 },
  'die linke': { color: '#5f316e', deltaVs2021: 25 },
  linke: { color: '#BE3075', deltaVs2021: 25 },
  ssw: { color: '#f9df3a', deltaVs2021: 0 },
};

function normPartyKey(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function wedgePath(
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  t0: number,
  t1: number,
): string {
  const pt = (r: number, t: number) => ({
    x: cx + r * Math.cos(t),
    y: cy - r * Math.sin(t),
  });
  const o0 = pt(rOuter, t0);
  const o1 = pt(rOuter, t1);
  const i1 = pt(rInner, t1);
  const i0 = pt(rInner, t0);
  const large = Math.abs(t1 - t0) > Math.PI ? 1 : 0;
  const sweepOuter = t0 > t1 ? 1 : 0;
  const sweepInner = t0 > t1 ? 0 : 1;
  return [
    `M ${i0.x} ${i0.y}`,
    `L ${o0.x} ${o0.y}`,
    `A ${rOuter} ${rOuter} 0 ${large} ${sweepOuter} ${o1.x} ${o1.y}`,
    `L ${i1.x} ${i1.y}`,
    `A ${rInner} ${rInner} 0 ${large} ${sweepInner} ${i0.x} ${i0.y}`,
    'Z',
  ].join(' ');
}

export type BundestagSeatRow = {
  label: string;
  seats: number;
  color: string;
  deltaVs2021: number | null;
};

function buildSeatRows(rows: GermanyGovernmentPoliticsRow[]): BundestagSeatRow[] {
  const byLabel = new Map<string, number>();
  for (const r of rows) {
    const label = (r.breakdown || r.submetric || '').trim();
    if (!label) continue;
    const n = Number(String(r.value).replace(/,/g, ''));
    if (!Number.isFinite(n)) continue;
    byLabel.set(label, n);
  }

  const ordered: BundestagSeatRow[] = [];
  const used = new Set<string>();

  for (const key of SEAT_CHART_PARTY_ORDER) {
    const seats = byLabel.get(key);
    if (seats == null) continue;
    const meta = PARTY_CHART_META[normPartyKey(key)] ?? { color: '#525252', deltaVs2021: null };
    ordered.push({ label: key, seats, color: meta.color, deltaVs2021: meta.deltaVs2021 });
    used.add(key);
  }

  const rest = [...byLabel.keys()]
    .filter((k) => !used.has(k))
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  for (const label of rest) {
    const seats = byLabel.get(label)!;
    const meta = PARTY_CHART_META[normPartyKey(label)] ?? { color: '#525252', deltaVs2021: null };
    ordered.push({ label, seats, color: meta.color, deltaVs2021: meta.deltaVs2021 });
  }

  return ordered;
}

type Props = {
  rows: GermanyGovernmentPoliticsRow[];
};

export function GermanyBundestagSeatsVisualization({ rows }: Props) {
  const parties = useMemo(() => buildSeatRows(rows), [rows]);
  const [activeParty, setActiveParty] = useState<string | null>(null);
  const total = useMemo(() => parties.reduce((s, p) => s + p.seats, 0), [parties]);
  const refYear = rows[0]?.referenceYear?.trim() ?? '2025';
  const sourceUrl = rows[0]?.sourceUrl?.trim() ?? '';
  const sourceName = rows[0]?.sourceName?.trim() ?? 'Bundeswahlleiterin';

  const slices = useMemo(() => {
    if (total <= 0) return [];
    let cum = 0;
    return parties.map((p) => {
      const t0 = Math.PI * (1 - (2 * cum) / total);
      cum += p.seats;
      const t1 = Math.PI * (1 - (2 * cum) / total);
      return { ...p, t0, t1 };
    });
  }, [parties, total]);

  const cx = 200;
  const cy = 198;
  const rOuter = 175;
  const rInner = 108;
  const selected = parties.find((p) => p.label === activeParty) ?? null;

  return (
    <Card className="overflow-hidden border-neutral-800 bg-neutral-950 text-neutral-200 ring-1 ring-neutral-800/60 sm:col-span-2 lg:col-span-3">
      <CardHeader className="space-y-2 border-b border-neutral-800 bg-black/30 pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle className={`text-lg font-semibold tracking-tight text-white sm:text-xl ${UC_TITLE}`}>
              Seat distribution
            </CardTitle>
            <CardDescription className={`font-mono text-[11px] text-neutral-500 ${UC_META}`}>
              {refYear} Federal Election, Germany
            </CardDescription>
            <CardDescription className={`font-mono text-[11px] text-neutral-500 ${UC_META}`}>Final Result</CardDescription>
          </div>
          <Badge variant="outline" className={`w-fit shrink-0 border-neutral-700 text-neutral-400 ${UC_META}`}>
            Final Result
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="px-4 py-5 sm:px-6">
        <div className="mx-auto w-full max-w-[420px]">
          <svg
            viewBox="0 0 400 220"
            className="h-auto w-full"
            role="img"
            aria-label="Seat distribution hemicycle chart"
            onMouseLeave={() => setActiveParty(null)}
          >
            <line x1={cx - rOuter} y1={cy} x2={cx + rOuter} y2={cy} stroke="#2a2a2a" strokeWidth={1} />
            {slices.map((p) => {
              const d = wedgePath(cx, cy, rInner, rOuter, p.t0, p.t1);
              const active = activeParty === p.label;
              return (
                <path
                  key={p.label}
                  d={d}
                  fill={p.color}
                  stroke="#111"
                  strokeWidth={active ? 2.2 : 1.2}
                  onMouseEnter={() => setActiveParty(p.label)}
                  className="cursor-pointer transition-[filter,opacity] duration-150"
                  style={{ filter: active ? 'brightness(1.14)' : 'none', opacity: activeParty && !active ? 0.65 : 1 }}
                >
                  <title>{`${p.label}: ${p.seats} seats`}</title>
                </path>
              );
            })}
            <text x={cx} y={cy - rInner + 2} textAnchor="middle" className="fill-white font-mono text-[22px] font-semibold">
              {total.toLocaleString('de-DE')}
            </text>
            <text x={cx} y={cy - rInner + 22} textAnchor="middle" className={`fill-neutral-400 font-mono text-[11px] ${UC_META}`}>
              Sitze
            </text>
          </svg>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {parties.map((p) => (
            <button
              key={p.label}
              type="button"
              onMouseEnter={() => setActiveParty(p.label)}
              onFocus={() => setActiveParty(p.label)}
              className="flex items-center justify-between gap-2 rounded border border-neutral-800 px-2 py-1 text-left hover:bg-neutral-900/60"
            >
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-neutral-300">
                <span className="h-2.5 w-2.5 rounded-[2px]" style={{ backgroundColor: p.color }} />
                {p.label}
              </span>
              <span className="font-mono text-[10px] tabular-nums text-white">{p.seats}</span>
            </button>
          ))}
        </div>

        <p className={`mt-3 text-center font-mono text-[11px] leading-relaxed text-neutral-400 ${UC_META}`}>
          {selected ? `${selected.label}: ${selected.seats.toLocaleString('de-DE')} seats` : 'Hover a party segment to inspect seat counts'}
        </p>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className={`font-mono text-[10px] leading-relaxed text-neutral-600 ${UC_META}`}>© Die Bundeswahlleiterin, Wiesbaden {refYear}</p>
          {sourceUrl ? (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`font-mono text-[10px] text-neutral-500 underline-offset-4 transition-colors hover:text-white hover:underline ${UC_META}`}
            >
              {sourceName} ↗
            </a>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
