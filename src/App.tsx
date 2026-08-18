import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { AppLayout } from './components/AppLayout';
import { CustomCursor } from './components/CustomCursor';
import { GalleryViewToggle, type GalleryView } from './components/GalleryViewToggle';
import { HomeHero } from './components/HomeHero';
import { WatchtowerSceneBackground } from './components/WatchtowerSceneBackground';
import { useTheme } from './context/themeContext';
import { FLAGS } from './data/flags';
import { usePrefetchFlagImages } from './hooks/usePrefetchFlagImages';
import { loadCountryStatsDashboard } from './lib/countryDashboardLoader';
import { flagIdHasCountryStats } from './lib/flagIsoMapping';
import { flagForPath, pathForFlag } from './lib/countryRoute';
import { legalLinkForPath } from './lib/legalRoute';
import type { LegalLink } from './data/legalLinks';
import type { FlagEntry } from './types/flag';

const HERO_EXIT_MS = 400;
const SITE_ORIGIN = (import.meta.env.VITE_SITE_URL || 'https://watchtower.app').replace(/\/+$/, '');
// MapGlobe loads MapLibre at mount time. Start both chunks together so entering the atlas does
// not serialize the globe module and the much larger map runtime into a network waterfall.
const loadCountryGlobe = () =>
  Promise.all([import('./components/MapGlobe'), import('maplibre-gl')]).then(
    ([globeModule]) => globeModule,
  );
const loadFlagGallery = () => import('./components/FlagGallery');
let selectedFlagViewPromise: Promise<typeof import('./components/SelectedFlagView')> | null = null;
const loadSelectedFlagView = () => {
  selectedFlagViewPromise ??= import('./components/SelectedFlagView');
  return selectedFlagViewPromise;
};
const CountryGlobe = lazy(() =>
  loadCountryGlobe().then((module) => ({ default: module.CountryGlobe })),
);
const FlagGallery = lazy(() =>
  loadFlagGallery().then((module) => ({ default: module.FlagGallery })),
);
const SelectedFlagView = lazy(() =>
  loadSelectedFlagView().then((module) => ({ default: module.SelectedFlagView })),
);
// Legal pages are static prose reached from the footer — code-split so they cost the atlas
// nothing, and rendered without the hero/gallery/globe machinery underneath them.
const LegalPage = lazy(() =>
  import('./components/LegalPage').then((module) => ({ default: module.LegalPage })),
);

function prefetchCountryDashboard(): void {
  void loadSelectedFlagView();
  void loadCountryStatsDashboard();
}

function GlobeLoadingState() {
  return (
    <div
      data-theme="dark"
      className="grid h-[100dvh] w-full place-items-center bg-black text-white"
      role="status"
      aria-live="polite"
    >
      <div className="w-48">
        <p className="mb-3 text-center font-mono text-xs uppercase tracking-[0.18em] text-white/70">
          Loading globe
        </p>
        <span className="block h-px w-full overflow-hidden bg-white/20">
          <span className="block h-full w-2/3 animate-pulse bg-white/80" />
        </span>
      </div>
    </div>
  );
}

/** Ignore gallery flag taps briefly after leaving the hero — avoids the same touch/click hitting a tile underneath. */
function gallerySelectGraceMs(): number {
  if (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) return 550;
  return 320;
}

function App() {
  // Restore the view from the URL on first paint so a refresh or a shared `/france` link opens
  // straight to that dossier (with the gallery behind it for Back), skipping the intro hero.
  const initialFlag = typeof window !== 'undefined' ? flagForPath(window.location.pathname) : null;
  const initialLegal =
    typeof window !== 'undefined' ? legalLinkForPath(window.location.pathname) : null;
  const [legalDoc, setLegalDoc] = useState<LegalLink | null>(initialLegal);
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

  usePrefetchFlagImages(stage === 'gallery' && !selected && galleryView === 'flags');

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

  useEffect(() => {
    if (stage !== 'gallery' || !openingGalleryFromHero.current) return;
    openingGalleryFromHero.current = false;
    suppressGallerySelectUntil.current = Date.now() + gallerySelectGraceMs();
  }, [stage]);

  useEffect(() => {
    // The home surface and globe own a fixed viewport. Country dossiers and the legal
    // pages are long-form and return scrolling to the document.
    if (!selected && !legalDoc) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [stage, selected, legalDoc]);

  // Keep the browser URL in step with the selected country so every dossier is a shareable,
  // refreshable page (`/germany`, `/france`, …). Selecting a country pushes a history entry;
  // returning to the gallery replaces it (so Back doesn't bounce through country pages). The
  // path guard skips redundant writes and prevents a feedback loop with the popstate handler.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Legal pages own the URL while open, so they are resolved ahead of the country slug —
    // otherwise this effect would immediately rewrite `/privacy` back to `/`.
    const targetPath = legalDoc ? legalDoc.path : selected ? pathForFlag(selected) : '/';
    if (window.location.pathname === targetPath) return;
    if (legalDoc) {
      window.history.pushState({ legalId: legalDoc.id }, '', targetPath);
    } else if (selected) {
      window.history.pushState({ flagId: selected.id }, '', targetPath);
    } else {
      window.history.replaceState({ flagId: null }, '', targetPath);
    }
  }, [selected, legalDoc]);

  // Browser back/forward (and any external history navigation) restore the matching country.
  useEffect(() => {
    const onPopState = () => {
      const doc = legalLinkForPath(window.location.pathname);
      setLegalDoc(doc);
      if (doc) return;
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

  // Keep route-specific discovery metadata aligned with the shareable country URL.
  useEffect(() => {
    const title = legalDoc
      ? `${legalDoc.title} · WatchTower`
      : selected
        ? `${selected.label} · WatchTower`
        : 'WatchTower';
    const routePath = legalDoc ? legalDoc.path : selected ? pathForFlag(selected) : '/';
    const canonicalUrl = `${SITE_ORIGIN}${routePath}`;
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const openGraphUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
    const openGraphTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');

    document.title = title;
    canonical?.setAttribute('href', canonicalUrl);
    openGraphUrl?.setAttribute('content', canonicalUrl);
    openGraphTitle?.setAttribute('content', title);
  }, [selected, legalDoc]);

  const openLegal = useCallback((path: string) => {
    const doc = legalLinkForPath(path);
    if (!doc) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    setLegalDoc(doc);
  }, []);

  const closeLegal = useCallback(() => setLegalDoc(null), []);

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

  // A legal page replaces the whole surface: no hero, gallery or globe underneath it, so
  // dismissing it restores whichever stage the reader came from.
  if (legalDoc) {
    return (
      <>
        <CustomCursor />
        <AppLayout showHeader={false}>
          <Suspense fallback={<div className="min-h-[100dvh] bg-black" aria-hidden />}>
            <LegalPage docId={legalDoc.id} onBack={closeLegal} onNavigate={openLegal} />
          </Suspense>
        </AppLayout>
      </>
    );
  }

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
          <Suspense fallback={<GlobeLoadingState />}>
            {galleryView === 'globe' ? (
              <CountryGlobe
                onSelect={selectFlag}
                onPrefetchDossier={prefetchCountryDashboard}
              />
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
          </Suspense>
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
          <Suspense fallback={<div className="min-h-[100dvh] bg-black" aria-hidden />}>
            <SelectedFlagView flag={selected} onBack={() => setSelected(null)} />
          </Suspense>
        </AppLayout>
      ) : null}
      {showHeroOverlay ? (
        <div data-theme="dark" className="fixed inset-0 z-50" aria-hidden={heroExiting}>
          <div className={heroExiting ? 'wt-hero-exit' : undefined}>
            <HomeHero
              onExplore={openGalleryFromHero}
              onPrefetchAtlas={() => {
                void loadCountryGlobe();
              }}
              onOpenLegal={openLegal}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}

export default App;
