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
  /**
   * Provenance of the section's contents. `'template'` outlines it in red and adds a "Data needed"
   * chip — the section is structurally present but has no country source yet; `'estimate'` marks
   * it amber for rough researched figures. Omitted means fully sourced.
   */
  dataStatus?: 'template' | 'estimate';
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
  dataStatus,
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
      className={cn(
        'group wt-collapsible-section overflow-hidden rounded-md border bg-[var(--card)] shadow-card',
        dataStatus === 'template'
          ? 'border-red-500/45'
          : dataStatus === 'estimate'
            ? 'border-amber-400/35'
            : 'border-[var(--line)]',
      )}
    >
      <summary className="flag-section-summary grid cursor-pointer grid-cols-[minmax(0,1fr)_4.75rem_5.5rem] items-center gap-x-3 px-4 py-3 text-left text-sm font-semibold text-white transition-colors hover:bg-[var(--card-hover)]">
        <span
          role="heading"
          aria-level={Math.min(6, depth + 2)}
          className={cn(
            'min-w-0',
            typeof title === 'string' && !dataStatus
              ? cn('truncate', uppercaseTitle && 'uppercase tracking-[0.06em]')
              : 'flex min-w-0 items-center gap-2.5',
          )}
        >
          {typeof title === 'string' && dataStatus ? (
            <span className={cn('min-w-0 truncate', uppercaseTitle && 'uppercase tracking-[0.06em]')}>
              {title}
            </span>
          ) : (
            title
          )}
          {dataStatus ? (
            <span
              className={cn(
                'w-fit shrink-0 rounded-sm border px-1.5 py-0.5 font-sans text-[9px] font-semibold uppercase tracking-[0.14em]',
                dataStatus === 'template'
                  ? 'border-red-500/45 bg-red-500/[0.12] text-red-300'
                  : 'border-amber-400/40 bg-amber-400/[0.1] text-amber-200',
              )}
            >
              {dataStatus === 'template' ? 'Data needed' : 'Estimate'}
            </span>
          ) : null}
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
