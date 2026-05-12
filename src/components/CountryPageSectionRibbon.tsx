import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';
import type { RibbonMainItem } from '../lib/countryRibbonNav';

type CountryPageSectionRibbonProps = {
  nav: RibbonMainItem[];
  /** Last chosen main section (pill highlight). */
  activeMainId: string | null;
  /** Which section’s subsection panel is open; null = closed. */
  bubbleMainId: string | null;
  /** Sub-item turns solid black only after user clicks that row. */
  pressedSubAnchorId?: string;
  onMainClick: (id: string) => void;
  onSubClick: (mainId: string, subsectionAnchorId: string) => void;
  onDismissBubble: () => void;
};

type PanelGeometry = {
  left: number;
  top: number;
  width: number;
  originX: number;
};

const PANEL_TRANSITION_MS = 240;

/**
 * Floats under the Watch Tower bar (same band as the old ribbon) with no full-width strip:
 * main pills hover above the page; subsections open in a panel anchored under the clicked pill.
 */
export const CountryPageSectionRibbon = memo(function CountryPageSectionRibbon({
  nav,
  activeMainId,
  bubbleMainId,
  pressedSubAnchorId,
  onMainClick,
  onSubClick,
  onDismissBubble,
}: CountryPageSectionRibbonProps) {
  const navRootRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const bubbleEntry = bubbleMainId ? nav.find((n) => n.id === bubbleMainId) : null;
  const bubbleSubs = bubbleEntry?.subsections ?? [];
  const bubbleOpen = bubbleSubs.length > 0 && bubbleMainId !== null;

  const [panelGeom, setPanelGeom] = useState<PanelGeometry | null>(null);
  /** True while panel is visually expanded (enter / hold); false during exit animation. */
  const [panelExpanded, setPanelExpanded] = useState(false);
  const dismissingRef = useRef(false);

  const setTabEl = useCallback((id: string, el: HTMLButtonElement | null) => {
    const m = tabRefs.current;
    if (el) m.set(id, el);
    else m.delete(id);
  }, []);

  const measurePanel = useCallback(() => {
    if (!bubbleMainId) return;
    const tabEl = tabRefs.current.get(bubbleMainId);
    if (!tabEl) return;
    const r = tabEl.getBoundingClientRect();
    const minW = 288;
    const maxW = Math.min(448, window.innerWidth - 24);
    const width = Math.min(Math.max(r.width, minW), maxW);
    const left = Math.min(
      Math.max(r.left + r.width / 2 - width / 2, 12),
      window.innerWidth - width - 12,
    );
    const top = r.bottom + 8;
    const tabCenterX = r.left + r.width / 2;
    const originX = tabCenterX - left;
    setPanelGeom({ left, top, width, originX });
  }, [bubbleMainId]);

  useLayoutEffect(() => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }

    if (!bubbleOpen || !bubbleMainId) {
      setPanelGeom(null);
      setPanelExpanded(false);
      dismissingRef.current = false;
      return;
    }

    dismissingRef.current = false;
    measurePanel();
    setPanelExpanded(false);
    let cancelled = false;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!cancelled) setPanelExpanded(true);
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, [bubbleOpen, bubbleMainId, measurePanel]);

  useLayoutEffect(() => {
    if (!bubbleOpen) return;
    const onResize = () => measurePanel();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [bubbleOpen, measurePanel]);

  const dismissWithCollapse = useCallback(() => {
    if (dismissingRef.current) return;
    dismissingRef.current = true;
    setPanelExpanded(false);
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    dismissTimerRef.current = setTimeout(() => {
      dismissTimerRef.current = null;
      dismissingRef.current = false;
      onDismissBubble();
    }, PANEL_TRANSITION_MS);
  }, [onDismissBubble]);

  useEffect(() => {
    if (!bubbleOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target;
      if (!(t instanceof Node)) return;
      if (navRootRef.current?.contains(t)) return;
      dismissWithCollapse();
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [bubbleOpen, dismissWithCollapse]);

  useEffect(() => {
    if (!bubbleOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismissWithCollapse();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [bubbleOpen, dismissWithCollapse]);

  const showPanel = bubbleOpen && panelGeom !== null;

  return (
    <>
      <nav
        className="pointer-events-none fixed left-0 right-0 top-16 z-[60] flex justify-center px-3 sm:px-4"
        aria-label="Country sections"
      >
        <div
          ref={navRootRef}
          className="pointer-events-auto flex w-full max-w-6xl flex-col items-center pt-2"
        >
          {/* Main pills — same horizontal slot as before; no ribbon background */}
          <div
            className={cn(
              'flex w-full flex-wrap items-stretch justify-center gap-1 rounded-full border border-white/15',
              'bg-[#d4d4d8]/95 p-1 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md',
              'sm:flex-nowrap sm:gap-0 sm:p-1',
            )}
          >
            {nav.map((item) => {
              const selected = activeMainId === item.id;
              return (
                <button
                  key={item.id}
                  ref={(el) => setTabEl(item.id, el)}
                  type="button"
                  className={cn(
                    'relative flex min-h-[44px] min-w-0 flex-1 items-center justify-center rounded-full px-3 py-2 font-sans text-[10px] font-semibold uppercase tracking-[0.08em] transition-colors duration-150 sm:min-h-[46px] sm:px-5 sm:text-[11px]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-600 focus-visible:ring-offset-2 focus-visible:ring-offset-[#d4d4d8]',
                    selected
                      ? 'bg-black text-white shadow-[0_6px_18px_rgba(0,0,0,0.5)]'
                      : 'bg-transparent text-neutral-900 hover:bg-black/[0.07]',
                  )}
                  onClick={() => onMainClick(item.id)}
                >
                  <span className="line-clamp-2 text-center leading-snug">{item.label}</span>
                </button>
              );
            })}
          </div>

          {showPanel && bubbleEntry ? (
            <div
              className="pointer-events-auto fixed z-[60] overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md"
              role="dialog"
              aria-label={`${bubbleEntry.label} subsections`}
              style={{
                left: panelGeom.left,
                top: panelGeom.top,
                width: panelGeom.width,
                transformOrigin: `${panelGeom.originX}px 0`,
                maxHeight: panelExpanded ? 'min(55vh, 22rem)' : 0,
                opacity: panelExpanded ? 1 : 0,
                transform: panelExpanded ? 'translateY(0) scaleY(1)' : 'translateY(-6px) scaleY(0.92)',
                transitionProperty: 'max-height, opacity, transform',
                transitionDuration: `${PANEL_TRANSITION_MS}ms`,
                transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <ul className="max-h-[min(55vh,22rem)] overflow-y-auto py-1">
                {bubbleSubs.map((sub, idx) => {
                  const pressed = pressedSubAnchorId === sub.anchorId && activeMainId === bubbleMainId;
                  return (
                    <li key={sub.anchorId} className="px-1 pb-1 last:pb-1">
                      <button
                        type="button"
                        className={cn(
                          'flex w-full items-center gap-3 rounded-full px-3 py-2.5 text-left font-sans text-[10px] font-semibold uppercase tracking-[0.08em] transition-colors duration-150 sm:px-4 sm:text-[11px]',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
                          pressed
                            ? 'bg-black text-white shadow-[0_6px_18px_rgba(0,0,0,0.35)]'
                            : 'bg-transparent text-neutral-900 hover:bg-black/[0.07]',
                        )}
                        onClick={() => onSubClick(bubbleMainId, sub.anchorId)}
                      >
                        <span
                          className={cn(
                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-sans text-[11px] font-bold tabular-nums',
                            pressed ? 'bg-white/15 text-white' : 'bg-[#d4d4d8]/90 text-neutral-800',
                          )}
                          aria-hidden
                        >
                          {idx + 1}
                        </span>
                        <span className="min-w-0 flex-1 leading-snug">{sub.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
      </nav>
    </>
  );
});
