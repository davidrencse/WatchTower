import { Globe2, LayoutGrid } from 'lucide-react';

export type GalleryView = 'globe' | 'flags';

type GalleryViewToggleProps = {
  view: GalleryView;
  onToggle: () => void;
};

export function GalleryViewToggle({ view, onToggle }: GalleryViewToggleProps) {
  const showsGlobe = view === 'globe';
  const label = showsGlobe ? 'Flag gallery' : 'Globe map';
  const Icon = showsGlobe ? LayoutGrid : Globe2;

  return (
    <button
      type="button"
      data-theme={showsGlobe ? 'dark' : undefined}
      onClick={onToggle}
      aria-label={`Switch to ${label.toLowerCase()}`}
      className={[
        'fixed right-[max(1rem,env(safe-area-inset-right))] z-[70]',
        'bottom-[max(1.25rem,env(safe-area-inset-bottom))]',
        'sm:bottom-[max(1.5rem,env(safe-area-inset-bottom))]',
        'sm:right-[max(1.75rem,env(safe-area-inset-right))]',
        'inline-flex min-h-11 items-center gap-2 rounded-[12px] border border-white/20',
        'bg-black/85 px-3.5 font-sans text-[11px] font-medium tracking-[0.02em] text-white shadow-soft',
        'backdrop-blur-xl transition-[transform,background-color,border-color] duration-200',
        'hover:border-white/35 hover:bg-neutral-900 active:translate-y-px',
        'focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black',
      ].join(' ')}
    >
      <Icon aria-hidden size={15} strokeWidth={1.7} />
      <span>{label}</span>
    </button>
  );
}
