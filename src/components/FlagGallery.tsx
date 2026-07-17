import { useCallback, useState } from 'react';
import { FLAGS } from '../data/flags';
import { flagIdHasCountryStats } from '../lib/flagIsoMapping';
import type { FlagEntry } from '../types/flag';
import { CountryFocusCarousel } from './CountryFocusCarousel';

type FlagGalleryProps = {
  onSelectFlag: (flag: FlagEntry) => void;
};

/**
 * Top-level Countries view: centerpiece "perfect shadow" panel + vertical
 * scroll-snap rail of flags. The Open-dossier action only fires for countries
 * that actually have a dossier dataset.
 */
export function FlagGallery({ onSelectFlag }: FlagGalleryProps) {
  const initial = FLAGS.find((f) => flagIdHasCountryStats(f.id)) ?? FLAGS[0];
  const [activeId, setActiveId] = useState(initial?.id ?? '');

  const handleOpen = useCallback(
    (flag: FlagEntry) => {
      if (!flagIdHasCountryStats(flag.id)) return;
      onSelectFlag(flag);
    },
    [onSelectFlag],
  );

  return (
    <CountryFocusCarousel
      flags={FLAGS}
      activeFlagId={activeId}
      onActiveChange={(flag) => setActiveId(flag.id)}
      onSelect={handleOpen}
      showOpenAction
    />
  );
}
