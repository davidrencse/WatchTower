import { useCallback, useEffect, useRef, useState } from 'react';
import { AppLayout } from './components/AppLayout';
import { FlagGallery } from './components/FlagGallery';
import { HomeHero } from './components/HomeHero';
import { SelectedFlagView } from './components/SelectedFlagView';
import { usePrefetchFlagImages } from './hooks/usePrefetchFlagImages';
import { flagIdHasCountryStats } from './lib/flagIsoMapping';
import type { FlagEntry } from './types/flag';

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
    setSelected(flag);
  }, []);

  return (
    <AppLayout showHeader={!statsView && stage !== 'home'}>
      {stage === 'home' && !selected ? (
        <HomeHero onExplore={openGalleryFromHero} />
      ) : null}
      {/* Keep gallery mounted so flag <img> nodes stay in DOM and stay in the browser cache when viewing a country. */}
      <div
        className={selected || stage !== 'gallery' ? 'hidden' : undefined}
        aria-hidden={!!selected || stage !== 'gallery'}
      >
        <FlagGallery onSelectFlag={selectFlag} />
      </div>
      {selected ? (
        <SelectedFlagView flag={selected} onBack={() => setSelected(null)} />
      ) : null}
    </AppLayout>
  );
}

export default App;
