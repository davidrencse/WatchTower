import { useCallback, useEffect, useRef, useState } from 'react';
import { AppLayout } from './components/AppLayout';
import { CustomCursor } from './components/CustomCursor';
import { FlagGallery } from './components/FlagGallery';
import { HomeHero } from './components/HomeHero';
import { SelectedFlagView, prefetchCountryDashboard } from './components/SelectedFlagView';
import { WatchtowerSceneBackground } from './components/WatchtowerSceneBackground';
import { usePrefetchFlagImages } from './hooks/usePrefetchFlagImages';
import { flagIdHasCountryStats } from './lib/flagIsoMapping';
import { flagForPath, pathForFlag } from './lib/countryRoute';
import { useTheme } from './context/ThemeContext';
import type { FlagEntry } from './types/flag';

const HERO_EXIT_MS = 720;

/** Ignore gallery flag taps briefly after leaving the hero — avoids the same touch/click hitting a tile underneath. */
function gallerySelectGraceMs(): number {
  if (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) return 550;
  return 320;
}

function App() {
  // Restore the view from the URL on first paint so a refresh or a shared `/france` link opens
  // straight to that dossier (with the gallery behind it for Back), skipping the intro hero.
  const initialFlag = typeof window !== 'undefined' ? flagForPath(window.location.pathname) : null;
  const [stage, setStage] = useState<'home' | 'gallery'>(initialFlag ? 'gallery' : 'home');
  const [heroExiting, setHeroExiting] = useState(false);
  const [selected, setSelected] = useState<FlagEntry | null>(initialFlag);
  const openingGalleryFromHero = useRef(false);
  const suppressGallerySelectUntil = useRef(0);
  const { theme } = useTheme();

  usePrefetchFlagImages(stage !== 'home');

  const openGalleryFromHero = useCallback(() => {
    openingGalleryFromHero.current = true;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    setStage('gallery');
    setHeroExiting(true);
  }, []);

  useEffect(() => {
    if (!heroExiting) return;
    const t = window.setTimeout(() => setHeroExiting(false), HERO_EXIT_MS);
    return () => window.clearTimeout(t);
  }, [heroExiting]);

  // Once the gallery is shown, warm the country-dossier chunk (dashboard + recharts) during
  // idle so the first country opens instantly instead of waiting on a large download.
  useEffect(() => {
    if (stage !== 'gallery') return;
    const idleId = requestIdleCallback(() => prefetchCountryDashboard(), { timeout: 2000 });
    return () => {
      if (typeof cancelIdleCallback === 'function') cancelIdleCallback(idleId);
    };
  }, [stage]);

  useEffect(() => {
    if (stage !== 'gallery' || !openingGalleryFromHero.current) return;
    openingGalleryFromHero.current = false;
    suppressGallerySelectUntil.current = Date.now() + gallerySelectGraceMs();
  }, [stage]);

  useEffect(() => {
    if (stage === 'home' && !selected) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [stage, selected]);

  // Keep the browser URL in step with the selected country so every dossier is a shareable,
  // refreshable page (`/germany`, `/france`, …). Selecting a country pushes a history entry;
  // returning to the gallery replaces it (so Back doesn't bounce through country pages). The
  // path guard skips redundant writes and prevents a feedback loop with the popstate handler.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const targetPath = selected ? pathForFlag(selected) : '/';
    if (window.location.pathname === targetPath) return;
    if (selected) {
      window.history.pushState({ flagId: selected.id }, '', targetPath);
    } else {
      window.history.replaceState({ flagId: null }, '', targetPath);
    }
  }, [selected]);

  // Browser back/forward (and any external history navigation) restore the matching country.
  useEffect(() => {
    const onPopState = () => {
      const flag = flagForPath(window.location.pathname);
      setSelected(flag);
      if (flag) setStage('gallery');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Reflect the current country in the tab title so shared/bookmarked pages are recognisable.
  useEffect(() => {
    document.title = selected ? `${selected.label} · WatchTower` : 'WatchTower';
  }, [selected]);

  const selectFlag = useCallback((flag: FlagEntry) => {
    if (Date.now() < suppressGallerySelectUntil.current) return;
    if (flagIdHasCountryStats(flag.id)) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
    setSelected(flag);
  }, []);

  const showGallery = stage === 'gallery' && !selected;
  const showHeroOverlay = (stage === 'home' || heroExiting) && !selected;
  // The dark cinematic scene backs the (always-dark) home splash in both themes. The gallery
  // only keeps it in dark mode; in light mode the gallery sits on the light app background.
  const showScene = !selected && (stage === 'home' || (theme === 'dark' && stage === 'gallery'));

  return (
    <>
      <CustomCursor />
      {showScene ? <WatchtowerSceneBackground fixed /> : null}
      <AppLayout showHeader={false} transparent={showScene}>
        {showGallery ? (
          <div className={heroExiting ? 'wt-gallery-enter' : undefined}>
            <FlagGallery onSelectFlag={selectFlag} />
          </div>
        ) : null}
        {selected ? (
          <SelectedFlagView flag={selected} onBack={() => setSelected(null)} />
        ) : null}
      </AppLayout>
      {showHeroOverlay ? (
        <div data-theme="dark" className="fixed inset-0 z-50" aria-hidden={heroExiting}>
          <div className={heroExiting ? 'wt-hero-exit' : undefined}>
            <HomeHero onExplore={openGalleryFromHero} />
          </div>
        </div>
      ) : null}
    </>
  );
}

export default App;
