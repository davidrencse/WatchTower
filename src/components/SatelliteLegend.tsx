import { memo } from 'react';

import { SATELLITE_GROUPS } from '../data/satelliteGroups';

/**
 * Compact colour key for the orbital shells: one row per constellation with its live loaded
 * count and orbit class, and a checkbox to drop it out of the render. Sits on the globe HUD and
 * only appears once the camera is far enough out for the shells to be visible.
 */

type SatelliteLegendProps = {
  visible: boolean[];
  countsByGroup: number[];
  total: number;
  status: 'idle' | 'loading' | 'ready' | 'error';
  onToggle: (index: number) => void;
  onAll: (on: boolean) => void;
};

/** Memoised: it is a sibling of the satellite badge, which re-renders on every hover sample. */
export const SatelliteLegend = memo(function SatelliteLegend({
  visible,
  countsByGroup,
  total,
  status,
  onToggle,
  onAll,
}: SatelliteLegendProps) {
  return (
    <aside
      className="pointer-events-auto absolute right-3 top-1/2 z-20 w-[186px] -translate-y-1/2 rounded-sm border border-white/10 bg-black/70 p-3 backdrop-blur-sm"
      aria-label="Orbital shells"
    >
      <div className="mb-2 flex items-baseline justify-between">
        <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
          Orbits
        </p>
        <span className="font-mono text-[9px] tabular-nums text-neutral-500">
          {status === 'loading' ? 'loading…' : status === 'error' ? 'no data' : total.toLocaleString()}
        </span>
      </div>

      <ul className="space-y-[3px]">
        {SATELLITE_GROUPS.map((group, index) => {
          const count = countsByGroup[index] ?? 0;
          const on = visible[index] ?? true;
          return (
            <li key={group.id}>
              <button
                type="button"
                onClick={() => onToggle(index)}
                aria-pressed={on}
                className="flex w-full items-center gap-2 rounded-[2px] px-1 py-[3px] text-left transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring-focus)]"
              >
                <span
                  aria-hidden
                  className="h-[7px] w-[7px] shrink-0 rounded-full transition-opacity"
                  style={{ backgroundColor: group.color, opacity: on ? 1 : 0.22 }}
                />
                <span
                  className={`flex-1 truncate font-mono text-[10px] ${on ? 'text-neutral-200' : 'text-neutral-600'}`}
                >
                  {group.label}
                </span>
                <span className="font-mono text-[9px] tabular-nums text-neutral-500">
                  {count ? count.toLocaleString() : '—'}
                </span>
                <span className="w-[26px] shrink-0 text-right font-mono text-[8px] uppercase tracking-[0.1em] text-neutral-600">
                  {group.orbit}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-2 flex gap-2 border-t border-white/10 pt-2">
        <button
          type="button"
          onClick={() => onAll(true)}
          className="font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500 transition-colors hover:text-neutral-200"
        >
          All
        </button>
        <button
          type="button"
          onClick={() => onAll(false)}
          className="font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500 transition-colors hover:text-neutral-200"
        >
          None
        </button>
      </div>
    </aside>
  );
});
