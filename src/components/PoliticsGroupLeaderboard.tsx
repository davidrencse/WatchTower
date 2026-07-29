import { memo, useMemo } from 'react';

export type LeaderboardItem = {
  rank: number;
  group: string;
  type: string;
  /** Raw member/size string (e.g. "~110000", "9,229 members", "dissolved", "National umbrella"). */
  value: string;
  notes: string;
};

type Accent = 'red' | 'neutral' | 'blue';

const ACCENT: Record<
  Accent,
  { badge: string; bar: string; track: string; mark: string; number: string; rowBorder: string }
> = {
  red: {
    badge: 'bg-red-500/95 text-white',
    bar: 'bg-red-500/80',
    track: 'bg-red-500/10',
    mark: 'bg-red-400/80',
    number: 'text-red-300',
    rowBorder: 'border-red-500/15',
  },
  neutral: {
    badge: 'bg-neutral-800 text-neutral-100 border border-white/[0.12]',
    bar: 'bg-neutral-300/80',
    track: 'bg-white/[0.06]',
    mark: 'bg-neutral-400/80',
    number: 'text-neutral-100',
    rowBorder: 'border-white/[0.08]',
  },
  blue: {
    badge: 'bg-blue-500/95 text-white',
    bar: 'bg-blue-500/80',
    track: 'bg-blue-500/10',
    mark: 'bg-blue-400/80',
    number: 'text-blue-300',
    rowBorder: 'border-blue-500/15',
  },
};

/** Largest plain integer in the string (commas stripped); null if none (e.g. "dissolved"). */
function parseCount(value: string): number | null {
  const matches = value.replace(/[,\s\u00a0\u202f]/g, '').match(/\d+(?:\.\d+)?/g);
  if (!matches) return null;
  const nums = matches.map(Number).filter((n) => Number.isFinite(n));
  if (nums.length === 0) return null;
  return Math.max(...nums);
}

/** Short display: formatted count if numeric, else the raw label (e.g. "dissolved"). */
function displayValue(value: string, count: number | null): string {
  if (count === null) return value;
  if (value.includes('%')) return value;
  return count.toLocaleString('en-US');
}

function LeaderboardRow({
  item,
  accent,
  widthPct,
  isLast,
}: {
  item: LeaderboardItem;
  accent: (typeof ACCENT)[Accent];
  widthPct: number | null;
  isLast: boolean;
}) {
  const count = parseCount(item.value);
  return (
    <li
      className={`flex flex-col gap-1.5 py-2.5 ${isLast ? '' : `border-b ${accent.rowBorder}`}`}
      title={item.notes}
    >
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`shrink-0 rounded-md px-1.5 py-0.5 font-sans text-[10px] font-semibold tabular-nums ${accent.badge}`}
          >
            #{item.rank}
          </span>
          <span className="truncate font-sans text-[13px] font-semibold text-neutral-100">{item.group}</span>
          <span className="hidden shrink-0 truncate font-sans text-[10px] uppercase tracking-[0.08em] text-neutral-500 sm:inline">
            {item.type}
          </span>
        </div>
        <span className={`shrink-0 font-sans text-[13px] font-semibold tabular-nums ${count === null ? 'italic text-neutral-500' : accent.number}`}>
          {displayValue(item.value, count)}
        </span>
      </div>
      <div className={`flex items-center gap-2`}>
        <span className={`h-1 w-1 shrink-0 rounded-full ${accent.mark}`} />
        <div className={`h-1.5 min-w-0 flex-1 overflow-hidden rounded-full ${accent.track}`}>
          {widthPct !== null ? (
            <div className={`h-full rounded-full ${accent.bar}`} style={{ width: `${widthPct}%` }} />
          ) : null}
        </div>
      </div>
      <p className="truncate font-sans text-[10px] leading-relaxed text-neutral-500 sm:hidden">{item.type}</p>
      <p className="line-clamp-1 font-sans text-[10px] leading-relaxed text-neutral-500">{item.notes}</p>
    </li>
  );
}

/**
 * Compact ranked leaderboard for the Politics "GROUPS" sub-subsections
 * (Leftism / Right-wing / Zionism). Bar width is proportional to the largest
 * membership count in the set; non-numeric entries (e.g. "dissolved") show no bar.
 */
export const PoliticsGroupLeaderboard = memo(function PoliticsGroupLeaderboard({
  items,
  accent,
}: {
  items: readonly LeaderboardItem[];
  accent: Accent;
}) {
  const cfg = ACCENT[accent];
  const maxCount = useMemo(() => {
    const counts = items.map((i) => parseCount(i.value)).filter((n): n is number => n !== null);
    return counts.length ? Math.max(...counts) : 0;
  }, [items]);

  return (
    <ul className="flex flex-col">
      {items.map((item, i) => {
        const count = parseCount(item.value);
        const widthPct = count !== null && maxCount > 0 ? Math.max(3, Math.round((count / maxCount) * 100)) : null;
        return (
          <LeaderboardRow key={item.rank} item={item} accent={cfg} widthPct={widthPct} isLast={i === items.length - 1} />
        );
      })}
    </ul>
  );
});
