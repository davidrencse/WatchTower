import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type KeyboardEvent,
} from 'react';
import type { FlagEntry } from '../types/flag';
import { CountryHeroContent } from './CountryHeroContent';
import { CountrySearchBar } from './CountrySearchBar';
import { CountryShadowCard } from './CountryShadowCard';

type CountryFocusCarouselProps = {
  flags: FlagEntry[];
  activeFlagId: string;
  onActiveChange: (flag: FlagEntry) => void;
  onSelect?: (flag: FlagEntry) => void;
  /** When true, the centerpiece shows an "Open dossier" CTA wired to `onSelect`. */
  showOpenAction?: boolean;
};

const RAIL_ITEM_HEIGHT = 132;
const RAIL_GAP = 14;
const RAIL_STEP = RAIL_ITEM_HEIGHT + RAIL_GAP;

/**
 * Two-pane country browser:
 *  - LEFT: large "hero" panel with the active country's flag + brief (perfect shadow stack)
 *  - RIGHT: vertical scroll-snap rail of every flag. Whichever tile is centered
 *           in the rail's viewport becomes active. Wheel/touch/keyboard all work.
 */
export function CountryFocusCarousel({
  flags,
  activeFlagId,
  onActiveChange,
  onSelect,
  showOpenAction = false,
}: CountryFocusCarouselProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);
  const programmaticEndTimer = useRef<number | null>(null);
  const didInit = useRef(false);
  const lastReportedIndex = useRef<number>(0);

  const activeIndex = useMemo(() => {
    const i = flags.findIndex((f) => f.id === activeFlagId);
    return i >= 0 ? i : 0;
  }, [flags, activeFlagId]);

  const activeFlag = flags[activeIndex] ?? flags[0];

  const scrollIndexIntoCenter = useCallback((index: number, smooth: boolean) => {
    const rail = railRef.current;
    if (!rail) return;
    const item = rail.querySelector<HTMLElement>(`[data-rail-index='${index}']`);
    if (!item) return;
    const target = item.offsetTop - (rail.clientHeight - item.offsetHeight) / 2;
    if (Math.abs(rail.scrollTop - target) < 1) return;
    isProgrammaticScroll.current = true;
    rail.scrollTo({ top: Math.max(0, target), behavior: smooth ? 'smooth' : 'auto' });
    if (programmaticEndTimer.current) window.clearTimeout(programmaticEndTimer.current);
    programmaticEndTimer.current = window.setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, smooth ? 520 : 80);
  }, []);

  // Sync rail → only on first mount or when active changes externally (not via our own scroll handler).
  useLayoutEffect(() => {
    if (!didInit.current) {
      didInit.current = true;
      lastReportedIndex.current = activeIndex;
      scrollIndexIntoCenter(activeIndex, false);
      return;
    }
    if (lastReportedIndex.current === activeIndex) return;
    lastReportedIndex.current = activeIndex;
    scrollIndexIntoCenter(activeIndex, true);
  }, [activeIndex, scrollIndexIntoCenter]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    let frame = 0;
    const onScroll = () => {
      if (isProgrammaticScroll.current) return;
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const center = rail.scrollTop + rail.clientHeight / 2;
        let nearest = lastReportedIndex.current;
        let nearestDist = Infinity;
        rail.querySelectorAll<HTMLElement>('[data-rail-index]').forEach((el) => {
          const itemCenter = el.offsetTop + el.offsetHeight / 2;
          const dist = Math.abs(itemCenter - center);
          if (dist < nearestDist) {
            nearestDist = dist;
            nearest = Number(el.dataset.railIndex) || 0;
          }
        });
        if (nearest === lastReportedIndex.current) return;
        lastReportedIndex.current = nearest;
        const next = flags[nearest];
        if (next && next.id !== activeFlagId) onActiveChange(next);
      });
    };

    rail.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      rail.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [flags, activeFlagId, onActiveChange]);

  useEffect(() => () => {
    if (programmaticEndTimer.current) window.clearTimeout(programmaticEndTimer.current);
  }, []);

  // Global wheel → discrete one-country navigation. Avoids the feedback loop
  // between native scroll, scroll-snap, and the state-driven re-center effect.
  const nudgeRef = useRef<(delta: number) => void>(() => undefined);
  useEffect(() => {
    let acc = 0;
    let lastFireAt = 0;
    const onWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      if (target) {
        if (target.closest('input, textarea, select')) return;
        if (target.closest('[data-wt-scrollable="true"]')) return;
      }
      e.preventDefault();
      const now = performance.now();
      if (now - lastFireAt > 250) acc = 0;
      acc += e.deltaY;
      const THRESHOLD = 32;
      const COOLDOWN_MS = 90;
      while (Math.abs(acc) >= THRESHOLD && now - lastFireAt >= COOLDOWN_MS) {
        const dir = acc > 0 ? 1 : -1;
        acc -= dir * THRESHOLD;
        lastFireAt = now;
        nudgeRef.current(dir);
      }
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  const nudge = useCallback(
    (delta: number) => {
      const next = Math.max(0, Math.min(flags.length - 1, activeIndex + delta));
      if (next === activeIndex) return;
      const flag = flags[next];
      if (!flag) return;
      lastReportedIndex.current = next;
      onActiveChange(flag);
      scrollIndexIntoCenter(next, true);
    },
    [activeIndex, flags, onActiveChange, scrollIndexIntoCenter],
  );

  useEffect(() => {
    nudgeRef.current = nudge;
  }, [nudge]);

  const onRailKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        nudge(1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        nudge(-1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        nudge(-activeIndex);
      } else if (e.key === 'End') {
        e.preventDefault();
        nudge(flags.length - 1 - activeIndex);
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (activeFlag) {
          e.preventDefault();
          onSelect?.(activeFlag);
        }
      }
    },
    [activeFlag, activeIndex, flags.length, nudge, onSelect],
  );

  const onTileClick = useCallback(
    (flag: FlagEntry, index: number) => {
      if (index === activeIndex) {
        onSelect?.(flag);
        return;
      }
      lastReportedIndex.current = index;
      onActiveChange(flag);
      scrollIndexIntoCenter(index, true);
    },
    [activeIndex, onActiveChange, onSelect, scrollIndexIntoCenter],
  );

  const focusFlag = useCallback(
    (flag: FlagEntry) => {
      const index = flags.findIndex((f) => f.id === flag.id);
      if (index < 0) return;
      lastReportedIndex.current = index;
      onActiveChange(flag);
      scrollIndexIntoCenter(index, true);
    },
    [flags, onActiveChange, scrollIndexIntoCenter],
  );

  const heroHeight = 'h-[min(420px,55dvh)] sm:h-[min(520px,calc(100dvh-7rem))] lg:h-[min(560px,calc(100dvh-6.5rem))]';
  const railHeight = 'h-[300px] sm:h-[420px] lg:h-[min(560px,calc(100dvh-6.5rem))]';

  return (
    <div className="relative z-10 flex min-h-[100dvh] w-full items-center justify-center">
      <div
        className={[
          'relative mx-auto flex w-full max-w-[1200px] flex-col items-stretch justify-center gap-5 px-4 pb-20',
          'sm:px-7 lg:flex-row lg:items-center lg:gap-8 lg:pb-24',
        ].join(' ')}
      >
        <CountryShadowCard
          variant="hero"
          className={`relative flex w-full max-w-[720px] flex-col ${heroHeight}`}
        >
          {activeFlag ? (
            <CountryHeroContent
              flag={activeFlag}
              onOpen={onSelect}
              showOpenAction={showOpenAction}
            />
          ) : null}
        </CountryShadowCard>

        <aside className={`relative flex w-full shrink-0 flex-col lg:w-[260px] ${railHeight}`}>
          <div className="relative min-h-0 flex-1">
            <div
              ref={railRef}
              role="listbox"
              aria-label="Countries"
              tabIndex={0}
              onKeyDown={onRailKeyDown}
              className="wt-country-rail h-full overflow-y-scroll outline-none focus-visible:ring-2 focus-visible:ring-white/15"
            >
              <ul className="flex flex-col gap-[14px] px-2 py-2">
                {flags.map((flag, i) => {
                  const distance = Math.abs(i - activeIndex);
                  const state =
                    distance === 0 ? 'active' : distance <= 2 ? 'near' : 'far';
                  return (
                    <li
                      key={flag.id}
                      data-rail-index={i}
                      className="wt-country-rail-item"
                      style={{ height: RAIL_ITEM_HEIGHT }}
                    >
                      <RailTile
                        flag={flag}
                        state={state}
                        isActive={i === activeIndex}
                        onClick={() => onTileClick(flag, i)}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>

            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16"
              style={{
                background:
                  'linear-gradient(180deg, rgba(5,5,8,0.82) 0%, rgba(5,5,8,0.4) 55%, rgba(5,5,8,0) 100%)',
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16"
              style={{
                background:
                  'linear-gradient(0deg, rgba(5,5,8,0.82) 0%, rgba(5,5,8,0.4) 55%, rgba(5,5,8,0) 100%)',
              }}
            />
          </div>
        </aside>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-5 pt-10 sm:pb-6">
        <div
          aria-hidden
          className="wt-glass-fade-bottom pointer-events-none absolute inset-x-0 bottom-0 h-24"
        />
        <CountrySearchBar
          flags={flags}
          activeFlagId={activeFlagId}
          onPick={focusFlag}
        />
      </div>
    </div>
  );
}

function RailTile({
  flag,
  state,
  isActive,
  onClick,
}: {
  flag: FlagEntry;
  state: 'active' | 'near' | 'far';
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? 'true' : undefined}
      role="option"
      aria-selected={isActive}
      className={[
        'wt-rail-card wt-glass-panel wt-glass-panel-compact wt-perfect-shadow-compact',
        'group flex h-full w-full items-center gap-3 overflow-hidden rounded-[18px] px-3 py-2 text-left',
        'outline-none focus-visible:border-white/30',
      ].join(' ')}
      data-state={state}
    >
      <div className="wt-glass-inset relative flex h-full w-[104px] shrink-0 items-center justify-center overflow-hidden rounded-[12px]">
        <img
          src={flag.src}
          alt=""
          className="max-h-[80%] max-w-[80%] object-contain"
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      </div>
      <p
        className={[
          'min-w-0 flex-1 truncate font-sans text-[14px] font-semibold leading-tight transition-colors',
          isActive ? 'text-neutral-100' : 'text-neutral-400 group-hover:text-neutral-200',
        ].join(' ')}
      >
        {flag.label}
      </p>
    </button>
  );
}
