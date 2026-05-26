import { useCallback, useEffect, useRef, useState } from 'react';
import { AppLayout } from './components/AppLayout';
import { CustomCursor } from './components/CustomCursor';
import { FlagGallery } from './components/FlagGallery';
import { HomeHero } from './components/HomeHero';
import { SelectedFlagView } from './components/SelectedFlagView';
import { WatchtowerSceneBackground } from './components/WatchtowerSceneBackground';
import { usePrefetchFlagImages } from './hooks/usePrefetchFlagImages';
import { flagIdHasCountryStats } from './lib/flagIsoMapping';
import type { FlagEntry } from './types/flag';

const HERO_EXIT_MS = 720;

/** Ignore gallery flag taps briefly after leaving the hero — avoids the same touch/click hitting a tile underneath. */
function gallerySelectGraceMs(): number {
  if (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) return 550;
  return 320;
}

function App() {
  const [stage, setStage] = useState<'home' | 'gallery'>('home');
  const [heroExiting, setHeroExiting] = useState(false);
  const [selected, setSelected] = useState<FlagEntry | null>(null);
  const statsView = selected ? flagIdHasCountryStats(selected.id) : false;
  const openingGalleryFromHero = useRef(false);
  const suppressGallerySelectUntil = useRef(0);

  usePrefetchFlagImages();

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

  const selectFlag = useCallback((flag: FlagEntry) => {
    if (Date.now() < suppressGallerySelectUntil.current) return;
    if (flagIdHasCountryStats(flag.id)) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
    setSelected(flag);
  }, []);

  const showGallery = stage === 'gallery' && !selected;
  const showHeroOverlay = (stage === 'home' || heroExiting) && !selected;
  const showScene = !selected && (stage === 'home' || stage === 'gallery' || heroExiting);

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
        <div
          className={`fixed inset-0 z-50 ${heroExiting ? 'wt-hero-exit' : ''}`}
          aria-hidden={heroExiting}
        >
          <HomeHero onExplore={openGalleryFromHero} />
        </div>
      ) : null}
    </>
  );
}

export default App;
