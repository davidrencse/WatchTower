import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CountryPageSectionRibbon } from './CountryPageSectionRibbon';
import { useCountryRibbonScrollSpy } from '../hooks/useCountryRibbonScrollSpy';
import { scrollToCountryAnchor } from '../lib/countryRibbonScroll';
import type { CountryRibbonExpandApi } from '../context/CountryRibbonExpandContext';
import type { RibbonMainItem } from '../lib/countryRibbonNav';

type CountryRibbonNavControllerProps = {
  nav: RibbonMainItem[];
  /** Ribbon only appears once the dossier has metrics to navigate. */
  enabled: boolean;
  expandApi: CountryRibbonExpandApi;
};

/**
 * Owns every piece of ribbon state (active pill, open subsection bubble, pressed sub-item)
 * so the scroll spy's "active section changed" update re-renders **only the ribbon**.
 *
 * This state used to live in `CountryStatsDashboard`, whose render returns the entire dossier
 * tree — so each section boundary crossed while scrolling re-rendered every mounted chart.
 * Section expansion still travels through `expandApi`, a subscription that never re-renders
 * this component either.
 *
 * The sticky-anchor offset is published as a `:root` custom property rather than an inline
 * style on the dashboard element: it inherits to every `scroll-mt-[var(--country-nav-scroll-margin)]`
 * anchor exactly as before, without making the dashboard re-render when the bubble opens.
 */
export function CountryRibbonNavController({ nav, enabled, expandApi }: CountryRibbonNavControllerProps) {
  const [activeMainId, setActiveMainId] = useState<string | null>(null);
  const [bubbleMainId, setBubbleMainId] = useState<string | null>(null);
  const [pressedSubAnchorByMain, setPressedSubAnchorByMain] = useState<Record<string, string>>({});
  const scrollSpyQuietUntilRef = useRef(0);

  const navById = useMemo(() => new Map(nav.map((n) => [n.id, n])), [nav]);

  useCountryRibbonScrollSpy(enabled, nav, setActiveMainId, scrollSpyQuietUntilRef);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--country-nav-scroll-margin', bubbleMainId ? '14rem' : '7.5rem');
    return () => {
      root.style.removeProperty('--country-nav-scroll-margin');
    };
  }, [bubbleMainId]);

  const dismissBubble = useCallback(() => {
    setBubbleMainId(null);
  }, []);

  const navigateFromRibbon = useCallback(
    (mainSectionId: string, subsectionAnchorId?: string) => {
      const entry = navById.get(mainSectionId);
      if (!entry) return;

      if (subsectionAnchorId) {
        setPressedSubAnchorByMain((prev) => {
          if (prev[mainSectionId] === subsectionAnchorId) return prev;
          return { ...prev, [mainSectionId]: subsectionAnchorId };
        });
      } else {
        setPressedSubAnchorByMain((prev) => {
          if (!(mainSectionId in prev)) return prev;
          const next = { ...prev };
          delete next[mainSectionId];
          return next;
        });
      }

      const keys: string[] = [`main:${mainSectionId}`];
      if (subsectionAnchorId) {
        const sub = entry.subsections.find((s) => s.anchorId === subsectionAnchorId);
        if (sub) keys.push(`sub:${mainSectionId}:${sub.id}`);
      }
      expandApi.expand(keys);

      scrollSpyQuietUntilRef.current = performance.now() + 320;

      scrollToCountryAnchor(subsectionAnchorId ?? entry.anchorId);
    },
    [navById, expandApi],
  );

  const handleMainClick = useCallback(
    (id: string) => {
      const entry = navById.get(id);
      const hasSubs = Boolean(entry && entry.subsections.length > 0);

      if (activeMainId === id) {
        if (hasSubs) {
          setBubbleMainId((b) => (b === id ? null : id));
        }
        return;
      }
      setActiveMainId(id);
      setBubbleMainId(hasSubs ? id : null);
      navigateFromRibbon(id);
    },
    [activeMainId, navigateFromRibbon, navById],
  );

  const handleSubClick = useCallback(
    (mainId: string, subsectionAnchorId: string) => {
      setActiveMainId(mainId);
      setBubbleMainId(null);
      navigateFromRibbon(mainId, subsectionAnchorId);
    },
    [navigateFromRibbon],
  );

  if (!enabled) return null;

  return (
    <CountryPageSectionRibbon
      nav={nav}
      activeMainId={activeMainId}
      bubbleMainId={bubbleMainId}
      pressedSubAnchorId={activeMainId ? pressedSubAnchorByMain[activeMainId] : undefined}
      onMainClick={handleMainClick}
      onSubClick={handleSubClick}
      onDismissBubble={dismissBubble}
    />
  );
}
