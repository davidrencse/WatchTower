import { memo, type ReactNode } from 'react';

/**
 * Red markers for dossier panels that are structurally complete but not yet backed by the
 * country's own sources.
 *
 * The rule these implement: **never delete a box for want of data.** A panel with no country
 * figures keeps its full Germany-template layout and gets outlined in red, so a reader can see at
 * a glance which parts of a dossier are real and which are still scaffolding.
 */

/** Small red chip; sits in a `CollapsibleFlagSection` header or above a panel. */
export const TemplateGapBadge = memo(function TemplateGapBadge({ label = 'Data needed' }: { label?: string }) {
  return (
    <span className="w-fit shrink-0 rounded-sm border border-red-500/45 bg-red-500/[0.12] px-2 py-0.5 font-sans text-[9px] font-semibold uppercase tracking-[0.14em] text-red-300">
      {label}
    </span>
  );
});

/** Amber chip for panels showing rough researched estimates rather than official figures. */
export const EstimateBadge = memo(function EstimateBadge({ label = 'Rough estimate' }: { label?: string }) {
  return (
    <span className="w-fit shrink-0 rounded-sm border border-amber-400/40 bg-amber-400/[0.1] px-2 py-0.5 font-sans text-[9px] font-semibold uppercase tracking-[0.14em] text-amber-200">
      {label}
    </span>
  );
});

/**
 * Page-level banner at the top of a template dossier. Amber rather than red: the page as a whole
 * is a working scaffold, while the red outlines below pick out the individual gaps.
 */
export const TemplateDossierNotice = memo(function TemplateDossierNotice({
  countryLabel,
}: {
  countryLabel: string;
}) {
  return (
    <aside
      className="mb-8 rounded-md border border-amber-600/35 bg-amber-100/70 px-4 py-4 shadow-card dark:border-amber-300/25 dark:bg-amber-300/[0.06] sm:px-5"
      aria-label={`${countryLabel} dossier template status`}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="max-w-3xl">
          <h2 className="text-sm font-semibold text-neutral-950 dark:text-amber-100">
            {countryLabel} dossier scaffold is active
          </h2>
          <p className="mt-1 font-sans text-xs leading-relaxed text-neutral-700 dark:text-amber-100/80">
            Every Germany dossier section, subsection and statistic slot has been retained.{' '}
            {countryLabel}’s own generated CSVs are loaded wherever the panel supports them, and the
            broad-stroke figures are <strong>rough estimates</strong> gathered for orientation — not
            official statistics. Panels outlined in <span className="font-semibold text-red-500 dark:text-red-300">red</span>{' '}
            still carry the Germany template and need a {countryLabel} source before publication.
          </p>
        </div>
        <span className="w-fit rounded-sm border border-amber-700/25 bg-amber-200/70 px-2.5 py-1 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-amber-950 dark:border-amber-200/20 dark:bg-black/20 dark:text-amber-100/85">
          Data build in progress
        </span>
      </div>
    </aside>
  );
});

/**
 * Red-outlined wrapper around a panel whose content is still the Germany template.
 *
 * `children` renders unchanged underneath the notice — the layout is deliberately preserved so the
 * dossier keeps the same shape it will have once real data lands.
 */
export const TemplateGapBlock = memo(function TemplateGapBlock({
  countryLabel,
  panel,
  detail,
  children,
}: {
  countryLabel: string;
  /** What this panel is, e.g. "Trade" — used in the notice sentence. */
  panel: string;
  /** Optional extra sentence about what specifically is missing. */
  detail?: string;
  children?: ReactNode;
}) {
  return (
    <section
      className="rounded-md border border-dashed border-red-500/45 bg-red-500/[0.03] p-3 sm:p-4"
      aria-label={`${panel} — ${countryLabel} data pending`}
    >
      <div className="mb-3 flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <p className="max-w-3xl font-sans text-[11px] leading-relaxed text-red-200/85">
          <span className="font-semibold text-red-200">{panel} — no {countryLabel} source yet.</span>{' '}
          {detail ??
            `The Germany template panel below is kept in place so the slot is visible, not deleted. Every figure it shows is German and must be replaced with ${countryLabel} data.`}
        </p>
        <TemplateGapBadge />
      </div>
      {children ? <div className="opacity-70">{children}</div> : null}
    </section>
  );
});

/**
 * Amber-outlined wrapper for a panel filled from the broad-stroke estimate set — real research,
 * but rounded orientation figures rather than an official national series.
 */
export const EstimateBlock = memo(function EstimateBlock({
  countryLabel,
  panel,
  detail,
  children,
}: {
  countryLabel: string;
  panel: string;
  detail?: string;
  children?: ReactNode;
}) {
  return (
    <section
      className="rounded-md border border-amber-400/30 bg-amber-400/[0.03] p-3 sm:p-4"
      aria-label={`${panel} — ${countryLabel} rough estimates`}
    >
      <div className="mb-3 flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <p className="max-w-3xl font-sans text-[11px] leading-relaxed text-amber-100/80">
          <span className="font-semibold text-amber-100">{panel} — broad-stroke estimates.</span>{' '}
          {detail ??
            `Rounded orientation figures for ${countryLabel}, compiled from general reference knowledge rather than a single official table. Treat every number as approximate.`}
        </p>
        <EstimateBadge />
      </div>
      {children}
    </section>
  );
});
