import { useEffect, useLayoutEffect, useState, type ReactNode } from 'react';
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
  // Mount the (chart-heavy) children the first time the section is opened, then keep them
  // mounted (one-way latch) so state, scroll position, and chart animations persist. No
  // scroll/visibility gating — an opened section renders its content immediately and in full.
  const [hasOpened, setHasOpened] = useState(initialOpen);
  const ribbonExpand = useCountryRibbonExpandOptional();

  useEffect(() => {
    if (open) setHasOpened(true);
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
      className="group overflow-hidden rounded-md border border-[var(--line)] bg-[var(--card)] shadow-card"
    >
      <summary className="flag-section-summary grid cursor-pointer grid-cols-[minmax(0,1fr)_4.75rem_5.5rem] items-center gap-x-3 px-4 py-3 text-left text-sm font-semibold text-white transition-colors hover:bg-[var(--card-hover)]">
        <span
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
        <span className="flex min-w-0 shrink-0 items-center justify-end gap-2 text-[13px] font-normal text-neutral-500 tabular-nums">
          <span>{count}</span>
          <span
            className="text-neutral-400 transition-transform duration-200 group-open:rotate-180"
            aria-hidden
          >
            ▾
          </span>
        </span>
      </summary>
      <div className="border-t border-[var(--line)] p-4">
        {hasOpened ? children : <div aria-hidden style={{ minHeight: 240 }} />}
      </div>
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
