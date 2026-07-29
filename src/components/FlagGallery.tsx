import { useCallback } from 'react';
import { FLAGS } from '../data/flags';
import { flagIdHasCountryStats } from '../lib/flagIsoMapping';
import type { FlagEntry } from '../types/flag';
import { CountryFocusCarousel } from './CountryFocusCarousel';

type FlagGalleryProps = {
  activeFlagId: string;
  onActiveFlagChange: (flagId: string) => void;
  onSelectFlag: (flag: FlagEntry) => void;
};

/**
 * Top-level Countries view: centerpiece "perfect shadow" panel + vertical
 * scroll-snap rail of flags. The Open-dossier action only fires for countries
 * that actually have a dossier dataset.
 */
export function FlagGallery({
  activeFlagId,
  onActiveFlagChange,
  onSelectFlag,
}: FlagGalleryProps) {
  const handleActiveChange = useCallback(
    (flag: FlagEntry) => onActiveFlagChange(flag.id),
    [onActiveFlagChange],
  );

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
      activeFlagId={activeFlagId}
      onActiveChange={handleActiveChange}
      onSelect={handleOpen}
      showOpenAction
    />
  );
}
