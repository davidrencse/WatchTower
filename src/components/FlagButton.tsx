import { memo } from 'react';
import type { FlagEntry } from '../types/flag';

type FlagButtonProps = {
  flag: FlagEntry;
  onSelect: (flag: FlagEntry) => void;
  /** First screen of tiles: eager + high fetch priority for faster first paint. */
  priority?: boolean;
};

/** Fixed-height card: equal image well + label strip so every tile aligns in the grid. */
function FlagButtonInner({ flag, onSelect, priority = false }: FlagButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(flag)}
      className="group flex h-full w-full flex-col border border-[var(--line)] bg-[var(--card)] text-left transition-colors hover:bg-[var(--card-hover)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-neutral-500"
    >
      <div className="flex h-28 w-full shrink-0 items-center justify-center bg-black/40 px-3 pt-4 sm:h-32">
        <img
          src={flag.src}
          alt=""
          className="max-h-full max-w-full object-contain"
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'low'}
        />
      </div>
      <div className="flex min-h-[3.25rem] flex-1 items-center border-t border-[var(--line)] px-2 py-3">
        <p className="w-full text-center text-[13px] font-normal leading-snug text-neutral-400 group-hover:text-neutral-200">
          {flag.label}
        </p>
      </div>
    </button>
  );
}

export const FlagButton = memo(FlagButtonInner);
