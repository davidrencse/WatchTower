import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { useCountryRibbonExpandOptional } from '../context/CountryRibbonExpandContext';
import { cn } from '../lib/utils';

/**
 * Distance (px) ahead of the viewport at which a section's contents are mounted.
 * Large enough that charts finish mounting before the user scrolls them into view.
 */
const MOUNT_AHEAD_MARGIN = '900px';

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
  const [open, setOpen] = useState(defaultOpen);
  // Defer mounting the (chart-heavy) children until the section is both near the viewport
  // and open. Collapsed sections stay unmounted even when scrolled past. Once mounted it stays
  // mounted (one-way latch) so internal state, scroll position, and chart animations persist.
  const detailsRef = useRef<HTMLDetailsElement | null>(null);
  const ioUnsupported = typeof IntersectionObserver === 'undefined';
  const [near, setNear] = useState(ioUnsupported);
  const [mounted, setMounted] = useState(ioUnsupported);
  const ribbonExpand = useCountryRibbonExpandOptional();

  useEffect(() => {
    if (near) return;
    const el = detailsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          obs.disconnect();
        }
      },
      { rootMargin: `${MOUNT_AHEAD_MARGIN} 0px` },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [near]);
  // Latch: mount the contents the first time the section is both open and near the viewport.
  useEffect(() => {
    if (open && near) setMounted(true);
  }, [open, near]);
  useLayoutEffect(() => {
    if (!ribbonExpandKey || !ribbonExpand) return;
    return ribbonExpand.register(ribbonExpandKey, () => {
      flushSync(() => {
        setNear(true);
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
      setNear(true);
      setOpen(true);
    }
  }, [expandSignal]);
  useEffect(() => {
    if (expandNonce !== undefined && expandNonce > 0) {
      setNear(true);
      setOpen(true);
    }
  }, [expandNonce]);

  const details = (
    <details
      ref={detailsRef}
      open={open}
      onToggle={(e) => {
        const isOpen = e.currentTarget.open;
        if (isOpen) setNear(true);
        setOpen(isOpen);
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
        {mounted ? children : <div aria-hidden style={{ minHeight: 240 }} />}
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
