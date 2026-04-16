import { useEffect, useState, type ReactNode } from 'react';
import { cn } from '../lib/utils';

type CollapsibleFlagSectionProps = {
  title: string;
  count: number;
  defaultOpen?: boolean;
  children: ReactNode;
  /** Optional controls rendered in header (e.g., move up/down). */
  headerControls?: ReactNode;
  /** When true, section title is shown in all caps (e.g. Germany Government subsections). */
  uppercaseTitle?: boolean;
  /** Incrementing this value collapses the section. */
  collapseSignal?: number;
  /** Incrementing this value expands the section. */
  expandSignal?: number;
};

export function CollapsibleFlagSection({
  title,
  count,
  defaultOpen = true,
  children,
  headerControls,
  uppercaseTitle = false,
  collapseSignal,
  expandSignal,
}: CollapsibleFlagSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
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
  return (
    <details
      open={open}
      onToggle={(e) => setOpen(e.currentTarget.open)}
      className="group overflow-hidden rounded-md border border-[var(--line)] bg-[var(--card)] shadow-card"
    >
      <summary className="flag-section-summary grid cursor-pointer grid-cols-[minmax(0,1fr)_4.75rem_5.5rem] items-center gap-x-3 px-4 py-3 text-left text-sm font-semibold text-white transition-colors hover:bg-[var(--card-hover)]">
        <span className={cn('min-w-0 truncate', uppercaseTitle && 'uppercase tracking-[0.06em]')}>{title}</span>
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
      <div className="border-t border-[var(--line)] p-4">{children}</div>
    </details>
  );
}
