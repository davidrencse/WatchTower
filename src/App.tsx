import { useCallback, useEffect, useRef, useState } from 'react';
import { AppLayout } from './components/AppLayout';
import { CountryGlobe } from './components/CountryGlobe';
import { CustomCursor } from './components/CustomCursor';
import { FlagGallery } from './components/FlagGallery';
import { GalleryViewToggle, type GalleryView } from './components/GalleryViewToggle';
import { HomeHero } from './components/HomeHero';
import { SelectedFlagView, prefetchCountryDashboard } from './components/SelectedFlagView';
import { WatchtowerSceneBackground } from './components/WatchtowerSceneBackground';
import { useTheme } from './context/ThemeContext';
import { FLAGS } from './data/flags';
import { GLOBE_MARKERS } from './data/globeCountries';
import { usePrefetchFlagImages } from './hooks/usePrefetchFlagImages';
import { flagIdHasCountryStats } from './lib/flagIsoMapping';
import { flagForPath, pathForFlag } from './lib/countryRoute';
import { scheduleIdleTask } from './lib/idleTask';
import type { FlagEntry } from './types/flag';

const HERO_EXIT_MS = 400;

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
  const [galleryView, setGalleryView] = useState<GalleryView>('globe');
  const [activeFlagId, setActiveFlagId] = useState(
    () =>
      initialFlag?.id ??
      FLAGS.find((flag) => flagIdHasCountryStats(flag.id))?.id ??
      FLAGS[0]?.id ??
      '',
  );
  const openingGalleryFromHero = useRef(false);
  const suppressGallerySelectUntil = useRef(0);
  const { theme } = useTheme();

  usePrefetchFlagImages(stage !== 'home');

  const openGalleryFromHero = useCallback(() => {
    openingGalleryFromHero.current = true;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    setStage('gallery');
    setHeroExiting(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
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
    return scheduleIdleTask(() => prefetchCountryDashboard(), 2000);
  }, [stage]);

  useEffect(() => {
    if (stage !== 'gallery' || !openingGalleryFromHero.current) return;
    openingGalleryFromHero.current = false;
    suppressGallerySelectUntil.current = Date.now() + gallerySelectGraceMs();
  }, [stage]);

  useEffect(() => {
    // Home splash and the full-screen globe both own the viewport — no page scroll. Only a
    // selected country dossier scrolls normally.
    if (!selected) {
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
      if (flag) {
        setActiveFlagId(flag.id);
        setStage('gallery');
      }
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
    setActiveFlagId(flag.id);
    setSelected(flag);
  }, []);

  const showGallery = stage === 'gallery' && !selected;
  const showHeroOverlay = (stage === 'home' || heroExiting) && !selected;

  return (
    <>
      <CustomCursor />
      {showGallery ? (
        <div
          className={[
            heroExiting ? 'wt-gallery-enter' : '',
            galleryView === 'flags' ? 'wt-gallery-flags' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {galleryView === 'globe' ? (
            <CountryGlobe markers={GLOBE_MARKERS} onSelect={selectFlag} />
          ) : (
            <>
              {theme === 'dark' ? <WatchtowerSceneBackground fixed /> : null}
              <AppLayout showHeader={false} transparent={theme === 'dark'}>
                <FlagGallery
                  activeFlagId={activeFlagId}
                  onActiveFlagChange={setActiveFlagId}
                  onSelectFlag={selectFlag}
                />
              </AppLayout>
            </>
          )}
          {!heroExiting ? (
            <GalleryViewToggle
              view={galleryView}
              onToggle={() =>
                setGalleryView((current) => (current === 'globe' ? 'flags' : 'globe'))
              }
            />
          ) : null}
        </div>
      ) : null}
      {selected ? (
        <AppLayout showHeader={false}>
          <SelectedFlagView flag={selected} onBack={() => setSelected(null)} />
        </AppLayout>
      ) : null}
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
