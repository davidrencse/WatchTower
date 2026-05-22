import { useEffect, useRef, type RefObject } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { RibbonMainItem } from '../lib/countryRibbonNav';

/** Only sync after scroll settles — avoids cancelling the pill animation every frame. */
const SCROLL_SETTLE_MS = 100;

/**
 * Syncs the active main ribbon pill after scroll **settles** (`scrollend` when supported,
 * otherwise trailing debounce). Sections are sorted by visual `getBoundingClientRect().top`.
 *
 * When the activation line sits in a gap (e.g. hero / padding) above every section anchor,
 * we **do not** update — avoids snapping the highlight to the first tab.
 *
 * `quietUntilMsRef`: while `performance.now()` is below that value, picks are skipped
 * (e.g. after ribbon `scrollIntoView` so `scrollend` does not fight the clicked tab).
 */
export function useCountryRibbonScrollSpy(
  enabled: boolean,
  nav: RibbonMainItem[],
  setActiveMainId: Dispatch<SetStateAction<string | null>>,
  quietUntilMsRef?: RefObject<number>,
): void {
  const navRef = useRef(nav);
  navRef.current = nav;

  const navKey = nav.map((n) => `${n.id}:${n.anchorId}`).join('|');

  useEffect(() => {
    if (!enabled || nav.length === 0) return;

    const activationLineY = () => {
      const ribbon = document.querySelector<HTMLElement>('[data-country-ribbon-nav]');
      if (ribbon) return ribbon.getBoundingClientRect().bottom + 8;
      const hdr = document.querySelector('header');
      const bottom = hdr ? hdr.getBoundingClientRect().bottom : 64;
      return bottom + 80;
    };

    const pickMain = () => {
      if (quietUntilMsRef?.current && performance.now() < quietUntilMsRef.current) {
        return;
      }

      const items = navRef.current;
      const line = activationLineY();

      const measured = items
        .map((item) => {
          const el = document.getElementById(item.anchorId);
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return { id: item.id, top: r.top, bottom: r.bottom };
        })
        .filter((x): x is { id: string; top: number; bottom: number } => x != null)
        .sort((a, b) => a.top - b.top);

      if (measured.length === 0) return;

      let activeMain: string | null = null;
      for (const row of measured) {
        if (row.top <= line && line < row.bottom) {
          activeMain = row.id;
          break;
        }
      }
      if (activeMain == null) {
        for (let i = measured.length - 1; i >= 0; i -= 1) {
          if (measured[i]!.top <= line) {
            activeMain = measured[i]!.id;
            break;
          }
        }
      }
      // No fallback to measured[0]: when the line is above all anchors (hero gap), that
      // would incorrectly force the first ribbon tab.

      if (activeMain == null) {
        return;
      }

      setActiveMainId((prev) => (prev === activeMain ? prev : activeMain));
    };

    pickMain();

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    const scheduleDebounced = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        debounceTimer = null;
        pickMain();
      }, SCROLL_SETTLE_MS);
    };

    const onScrollEnd = () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
      }
      requestAnimationFrame(() => {
        requestAnimationFrame(pickMain);
      });
    };

    const w = window;
    w.addEventListener('resize', scheduleDebounced, { passive: true });

    let supportsScrollEnd = false;
    try {
      supportsScrollEnd = 'onscrollend' in w;
    } catch {
      supportsScrollEnd = false;
    }

    if (supportsScrollEnd) {
      w.addEventListener('scrollend', onScrollEnd, { passive: true });
    } else {
      w.addEventListener('scroll', scheduleDebounced, { passive: true, capture: true });
    }

    return () => {
      w.removeEventListener('resize', scheduleDebounced);
      if (supportsScrollEnd) {
        w.removeEventListener('scrollend', onScrollEnd);
      } else {
        w.removeEventListener('scroll', scheduleDebounced, { capture: true });
      }
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [enabled, navKey, nav.length, quietUntilMsRef, setActiveMainId]);
}
