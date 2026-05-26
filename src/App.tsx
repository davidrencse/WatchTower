import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { AppLayout } from './components/AppLayout';
import { CustomCursor } from './components/CustomCursor';
import { HomeHero } from './components/HomeHero';
import { CountryPageIndustrialLoader } from './components/CountryPageIndustrialLoader';
import { SelectedFlagView } from './components/SelectedFlagView';
import { usePrefetchFlagImages } from './hooks/usePrefetchFlagImages';
import { flagIdHasCountryStats } from './lib/flagIsoMapping';
import type { FlagEntry } from './types/flag';

const FlagGallery = lazy(() =>
  import('./components/FlagGallery').then((m) => ({ default: m.FlagGallery })),
);

function GalleryLoadingFallback() {
  return (
    <CountryPageIndustrialLoader countryLabel="countries" />
  );
}

/** Ignore gallery flag taps briefly after leaving the hero — avoids the same touch/click hitting a tile underneath. */
function gallerySelectGraceMs(): number {
  if (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) return 550;
  return 320;
}

function App() {
  const [stage, setStage] = useState<'home' | 'gallery'>('home');
  const [selected, setSelected] = useState<FlagEntry | null>(null);
  const statsView = selected ? flagIdHasCountryStats(selected.id) : false;
  const openingGalleryFromHero = useRef(false);
  const suppressGallerySelectUntil = useRef(0);

  usePrefetchFlagImages();

  const openGalleryFromHero = useCallback(() => {
    openingGalleryFromHero.current = true;
    setStage('gallery');
  }, []);

  useEffect(() => {
    if (stage !== 'gallery' || !openingGalleryFromHero.current) return;
    openingGalleryFromHero.current = false;
    suppressGallerySelectUntil.current = Date.now() + gallerySelectGraceMs();
  }, [stage]);

  const selectFlag = useCallback((flag: FlagEntry) => {
    if (Date.now() < suppressGallerySelectUntil.current) return;
    if (flagIdHasCountryStats(flag.id)) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
    setSelected(flag);
  }, []);

  return (
    <>
      <CustomCursor />
      <AppLayout showHeader={!statsView && stage !== 'home'}>
      {stage === 'home' && !selected ? (
        <HomeHero onExplore={openGalleryFromHero} />
      ) : null}
      {stage === 'gallery' && !selected ? (
        <Suspense fallback={<GalleryLoadingFallback />}>
          <FlagGallery onSelectFlag={selectFlag} />
        </Suspense>
      ) : null}
      {selected ? (
        <SelectedFlagView flag={selected} onBack={() => setSelected(null)} />
      ) : null}
    </AppLayout>
    </>
  );
}

export default App;
