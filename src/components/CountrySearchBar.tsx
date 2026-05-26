import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { searchFlags } from '../lib/searchFlags';
import type { FlagEntry } from '../types/flag';

type CountrySearchBarProps = {
  flags: FlagEntry[];
  activeFlagId: string;
  onPick: (flag: FlagEntry) => void;
};

export function CountrySearchBar({ flags, activeFlagId, onPick }: CountrySearchBarProps) {
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);

  const results = useMemo(() => searchFlags(flags, query), [flags, query]);
  const showDropdown = open && query.trim().length > 0;

  useEffect(() => {
    setHighlight(0);
  }, [results]);

  const pick = useCallback(
    (flag: FlagEntry) => {
      onPick(flag);
      setQuery('');
      setOpen(false);
      inputRef.current?.blur();
    },
    [onPick],
  );

  useEffect(() => {
    if (!showDropdown) return;
    const onDocPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDocPointer);
    return () => document.removeEventListener('pointerdown', onDocPointer);
  }, [showDropdown]);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || results.length === 0) {
      if (e.key === 'Escape') {
        setQuery('');
        setOpen(false);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => Math.min(results.length - 1, h + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(0, h - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const flag = results[highlight];
      if (flag) pick(flag);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setQuery('');
      setOpen(false);
    }
  };

  return (
    <div
      ref={rootRef}
      className="pointer-events-auto mx-auto w-full max-w-xl px-4 sm:px-0"
    >
      <label htmlFor={listId} className="sr-only">
        Search countries
      </label>
      <div className="relative">
        {showDropdown ? (
          <ul
            role="listbox"
            aria-label="Search results"
            data-wt-scrollable="true"
            className={[
              'wt-glass-panel wt-glass-panel-compact absolute bottom-full left-0 right-0 z-30 mb-2 max-h-[min(320px,40vh)] overflow-y-auto',
              'rounded-[18px] py-1.5 scrollbar-none',
            ].join(' ')}
          >
            {results.length === 0 ? (
              <li className="px-4 py-3 font-sans text-[12px] text-neutral-500">
                No countries match &ldquo;{query.trim()}&rdquo;
              </li>
            ) : (
              results.map((flag, i) => {
                const isActive = flag.id === activeFlagId;
                const isHighlighted = i === highlight;
                return (
                  <li key={flag.id} role="option" aria-selected={isHighlighted}>
                    <button
                      type="button"
                      onMouseEnter={() => setHighlight(i)}
                      onClick={() => pick(flag)}
                      className={[
                        'flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors',
                        isHighlighted
                          ? 'bg-white/[0.06] text-neutral-100'
                          : 'text-neutral-300 hover:bg-white/[0.04]',
                      ].join(' ')}
                    >
                      <span className="flex h-9 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/[0.06] bg-black/50">
                        <img src={flag.src} alt="" className="max-h-full max-w-full object-contain" />
                      </span>
                      <span className="min-w-0 flex-1 truncate font-sans text-[13px] font-medium">
                        {flag.label}
                        {isActive ? (
                          <span className="ml-2 text-[10px] font-normal uppercase tracking-wider text-neutral-500">
                            current
                          </span>
                        ) : null}
                      </span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        ) : null}

        <div
          className={[
            'wt-glass-panel wt-glass-panel-compact wt-perfect-shadow-compact',
            'flex items-center gap-3 rounded-[18px] px-4 py-3 transition-[border-color]',
            showDropdown ? 'border-white/[0.26]' : 'hover:border-white/[0.24]',
          ].join(' ')}
        >
          <SearchIcon />
          <input
            ref={inputRef}
            id={listId}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder="Search countries…"
            autoComplete="off"
            spellCheck={false}
            className={[
              'min-w-0 flex-1 bg-transparent font-sans text-[14px] text-neutral-100',
              'placeholder:text-neutral-600',
              'outline-none',
              '[&::-webkit-search-cancel-button]:hidden',
            ].join(' ')}
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="shrink-0 rounded-md px-2 py-1 font-sans text-[10px] uppercase tracking-wider text-neutral-500 transition hover:bg-white/[0.06] hover:text-neutral-300"
            >
              Clear
            </button>
          ) : (
            <span className="hidden shrink-0 font-sans text-[10px] uppercase tracking-[0.16em] text-neutral-600 sm:inline">
              Enter to go
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-neutral-500"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" />
    </svg>
  );
}
