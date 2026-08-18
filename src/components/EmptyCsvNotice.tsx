import { memo } from 'react';

/**
 * Shown where a section's per-country CSV exists in the layout but has no rows yet.
 *
 * Red rather than grey, and deliberately never collapses the section: the dossier's rule is that a
 * missing statistic is marked, not hidden. Pairs with `TemplateGapBlock`, which covers panels whose
 * content is Germany's rather than absent.
 */
export const EmptyCsvNotice = memo(function EmptyCsvNotice({ csvUrl }: { csvUrl: string }) {
  const file = csvUrl.split('/').pop();
  return (
    <div className="flex flex-col gap-1.5 rounded-md border border-dashed border-red-500/45 bg-red-500/[0.04] p-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <p className="font-sans text-[11px] leading-relaxed text-red-200/85">
        <span className="font-semibold text-red-200">No data in this table yet.</span>{' '}
        <code className="text-red-200/70">{file}</code> parsed zero rows, so every statistic in this
        panel is outstanding. The panel is kept in place rather than removed.
      </p>
      <span className="w-fit shrink-0 rounded-sm border border-red-500/45 bg-red-500/[0.12] px-2 py-0.5 font-sans text-[9px] font-semibold uppercase tracking-[0.14em] text-red-300">
        Data needed
      </span>
    </div>
  );
});
