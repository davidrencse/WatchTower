import { createContext, useContext, useEffect, useLayoutEffect, useState, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { useCountryRibbonExpandOptional } from '../context/CountryRibbonExpandContext';
import { cn } from '../lib/utils';

type CollapsibleFlagSectionProps = {
  /** Plain string (truncated) or custom node (e.g. icon + label). */
  title: ReactNode;
  count: number;
  defaultOpen?: boolean;
  children: ReactNode;
  /** Optional controls rendered in header (e.g., move up/down). */
  headerControls?: ReactNode;
  /** When true, section title is shown in all caps (e.g. Germany Government subsections). */
  uppercaseTitle?: boolean;
  /** Anchor for in-page nav (`scrollIntoView`). Adds scroll margin for sticky header + ribbon. */
  anchorId?: string;
  /** Incrementing this value collapses the section. */
  collapseSignal?: number;
  /** Incrementing this value expands the section (e.g. “Expand all”). */
  expandSignal?: number;
  /** Incrementing expands only this section (e.g. country nav ribbon). */
  expandNonce?: number;
  /** Ribbon nav: expand when `CountryRibbonExpandProvider` fires this key (no parent re-render). */
  ribbonExpandKey?: string;
};

const CollapsibleDepthContext = createContext(0);

export function CollapsibleFlagSection({
  title,
  count,
  defaultOpen = true,
  children,
  headerControls,
  uppercaseTitle = false,
  anchorId,
  collapseSignal,
  expandSignal,
  expandNonce,
  ribbonExpandKey,
}: CollapsibleFlagSectionProps) {
  // Start collapsed when a collapse signal is already active (matches the dossier's
  // "all collapsed on open" default) so heavy content isn't mounted for every section at once.
  const initialOpen = defaultOpen && !(collapseSignal !== undefined && collapseSignal > 0);
  const [open, setOpen] = useState(initialOpen);
  // Wait for the opened details element to receive a measurable layout before mounting charts.
  const depth = useContext(CollapsibleDepthContext);
  const [contentReady, setContentReady] = useState(false);
  const ribbonExpand = useCountryRibbonExpandOptional();

  useLayoutEffect(() => {
    if (!open) {
      setContentReady(false);
      return;
    }
    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => setContentReady(true));
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      if (secondFrame) cancelAnimationFrame(secondFrame);
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!ribbonExpandKey || !ribbonExpand) return;
    return ribbonExpand.register(ribbonExpandKey, () => {
      flushSync(() => {
        setOpen(true);
      });
    });
  }, [ribbonExpand, ribbonExpandKey]);
  useEffect(() => {
    if (collapseSignal !== undefined && collapseSignal > 0) {
      setOpen(false);
    }
  }, [collapseSignal]);
  useEffect(() => {
    if (expandSignal !== undefined && expandSignal > 0) {
      setOpen(true);
    }
  }, [expandSignal]);
  useEffect(() => {
    if (expandNonce !== undefined && expandNonce > 0) {
      setOpen(true);
    }
  }, [expandNonce]);

  const details = (
    <details
      open={open}
      onToggle={(e) => {
        setOpen(e.currentTarget.open);
      }}
      className="group wt-collapsible-section overflow-hidden rounded-md border border-[var(--line)] bg-[var(--card)] shadow-card"
    >
      <summary className="flag-section-summary grid cursor-pointer grid-cols-[minmax(0,1fr)_4.75rem_5.5rem] items-center gap-x-3 px-4 py-3 text-left text-sm font-semibold text-white transition-colors hover:bg-[var(--card-hover)]">
        <span
          role="heading"
          aria-level={Math.min(6, depth + 2)}
          className={cn(
            'min-w-0',
            typeof title === 'string'
              ? cn('truncate', uppercaseTitle && 'uppercase tracking-[0.06em]')
              : 'flex min-w-0 items-center gap-2.5',
          )}
        >
          {title}
        </span>
        <div
          className="flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {headerControls ?? <span className="block h-px w-full" aria-hidden />}
        </div>
        <span className="flex min-w-0 shrink-0 items-center justify-end gap-2 text-xs font-normal text-neutral-400 tabular-nums">
          <span>{count}</span>
          <span
            className="text-neutral-400 transition-transform duration-200 group-open:rotate-180"
            aria-hidden
          >
            ▾
          </span>
        </span>
      </summary>
      {open && contentReady ? (
        <div className="wt-collapsible-content border-t border-[var(--line)] p-4">
          <CollapsibleDepthContext.Provider value={depth + 1}>
            {children}
          </CollapsibleDepthContext.Provider>
        </div>
      ) : null}
    </details>
  );

  if (anchorId) {
    return (
      <div id={anchorId} className="scroll-mt-[var(--country-nav-scroll-margin,11rem)]">
        {details}
      </div>
    );
  }

  return details;
}
