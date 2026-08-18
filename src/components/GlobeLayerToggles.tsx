import { memo, useState } from 'react';
import { ExternalLink, Layers3, X } from 'lucide-react';

import { GLOBE_LAYER_GROUPS, type GlobeLayerGroupId } from '../lib/globeLayerGroups';

/**
 * On/off switches for standing thematic overlays, with their colour keys folded in.
 * Which layers each switch owns, and why they are switched, lives in
 * `lib/globeLayerGroups.ts`.
 */

type GlobeLayerTogglesProps = {
  enabled: Record<GlobeLayerGroupId, boolean>;
  onToggle: (id: GlobeLayerGroupId) => void;
};

/** Memoised: a sibling of the hover card, which re-renders on every pointer sample. */
export const GlobeLayerToggles = memo(function GlobeLayerToggles({
  enabled,
  onToggle,
}: GlobeLayerTogglesProps) {
  const [open, setOpen] = useState(
    () => typeof window === 'undefined' || !window.matchMedia('(max-width: 639px)').matches,
  );

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="pointer-events-auto absolute left-3 top-20 z-[70] inline-flex min-h-11 items-center gap-2 border border-white/20 bg-black/90 px-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white/75 shadow-[0_10px_30px_rgba(0,0,0,0.32)] backdrop-blur-md transition-colors hover:border-white/35 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:left-auto sm:right-[21.5rem] sm:top-4"
        aria-label="Open globe overlays"
      >
        <Layers3 aria-hidden size={14} strokeWidth={1.7} />
        Layers
      </button>
    );
  }

  return (
    <aside
      className="pointer-events-auto absolute left-3 top-20 z-[70] max-h-[calc(100dvh-6rem)] w-[240px] overflow-y-auto border border-white/[0.14] bg-black/90 p-3.5 shadow-[0_18px_48px_rgba(0,0,0,0.38)] backdrop-blur-md sm:left-auto sm:right-[21.5rem] sm:top-4"
      aria-label="Globe overlays"
    >
      <div className="mb-2 flex min-h-8 items-center justify-between">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
          Overlays
        </p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="-mr-2 inline-grid min-h-9 min-w-9 place-items-center text-white/45 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/70"
          aria-label="Close globe overlays"
        >
          <X aria-hidden size={15} strokeWidth={1.7} />
        </button>
      </div>

      <ul className="space-y-[6px]">
        {GLOBE_LAYER_GROUPS.map((group) => {
          const on = enabled[group.id];
          return (
            <li key={group.id}>
              <button
                type="button"
                onClick={() => onToggle(group.id)}
                aria-pressed={on}
                className="flex min-h-9 w-full items-start gap-2 rounded-[2px] px-1 py-2 text-left transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring-focus)]"
              >
                {/* A checkbox rather than a colour dot: each group carries several colours, so a
                    single swatch would have to pick one and misrepresent the rest. The colours
                    go in the key below instead. */}
                <span
                  aria-hidden
                  className="mt-[3px] h-[7px] w-[7px] shrink-0 rounded-[1px] border transition-colors"
                  style={{
                    borderColor: on ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.25)',
                    backgroundColor: on ? 'rgba(255,255,255,0.75)' : 'transparent',
                  }}
                />
                <span className="min-w-0 flex-1">
                  <span
                    className={`block truncate font-mono text-[11px] ${
                      on ? 'text-neutral-200' : 'text-neutral-600'
                    }`}
                  >
                    {group.label}
                  </span>
                  <span
                    className={`block truncate font-mono text-[11px] uppercase tracking-[0.08em] ${
                      on ? 'text-neutral-500' : 'text-neutral-700'
                    }`}
                  >
                    {group.detail}
                  </span>
                </span>
              </button>

              {on ? (
                <ul className="mt-[2px] space-y-[1px] pl-[19px]">
                  {group.keys.map((key) => (
                    <li key={key.label} className="flex items-center gap-[6px]">
                      <span
                        aria-hidden
                        className="h-[2px] w-[9px] shrink-0 rounded-full"
                        style={{ backgroundColor: key.color }}
                      />
                      <span className="truncate font-mono text-[11px] text-neutral-500">
                        {key.label}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {on && group.note ? (
                <div className="ml-[19px] mt-2 border-l border-white/10 pl-2.5 font-mono">
                  <p className="text-[11px] leading-relaxed text-white/48">{group.note}</p>
                  {group.sourceUrl ? (
                    <a
                      href={group.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex min-h-8 items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-white/65 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                    >
                      Browse incident list
                      <ExternalLink aria-hidden size={11} strokeWidth={1.7} />
                    </a>
                  ) : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </aside>
  );
});
