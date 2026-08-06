import { memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';

const SPAIN_VICTIM_TEMPLATE_SLOTS = [
  'Total native victims',
  'Female native victims',
  'Male native victims',
  'Native victims by year',
  'Child victims — total',
  'Girl victims',
  'Boy victims',
  'Child victims by year',
  'Sexual-assault victims — total',
  'Female sexual-assault victims',
  'Male sexual-assault victims',
  'Adult sexual-assault victims',
  'Minor sexual-assault victims',
  'Sexual-assault victims by year',
  'Notable incident 1',
  'Notable incident 2',
  'Notable incident 3',
  'Notable incident 4',
  'Victim sources and methodology',
] as const;

export const SPAIN_VICTIM_TEMPLATE_SLOT_COUNT = SPAIN_VICTIM_TEMPLATE_SLOTS.length;

export const SpainDossierTemplateNotice = memo(function SpainDossierTemplateNotice() {
  return (
    <aside
      className="mb-8 border border-amber-600/35 bg-amber-100/70 px-4 py-4 shadow-card dark:border-amber-300/25 dark:bg-amber-300/[0.06] sm:px-5"
      aria-label="Spain dossier template status"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="max-w-3xl">
          <h2 className="text-sm font-semibold text-neutral-950 dark:text-amber-100">Spain dossier scaffold is active</h2>
          <p className="mt-1 font-sans text-xs leading-relaxed text-neutral-700 dark:text-amber-100/80">
            Every Germany dossier section and statistic slot has been retained. Spain’s existing country CSVs are
            loaded where the component supports them; panels that still show Germany-labelled content are template
            references only and must be replaced with Spanish sources before publication.
          </p>
        </div>
        <span className="w-fit border border-amber-700/25 bg-amber-200/70 px-2.5 py-1 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-amber-950 dark:border-amber-200/20 dark:bg-black/20 dark:text-amber-100/85">
          Data build in progress
        </span>
      </div>
    </aside>
  );
});

export const SpainRecordedCrimesTemplate = memo(function SpainRecordedCrimesTemplate() {
  return (
    <Card className="border-dashed border-amber-300/25 bg-surface-metric shadow-card">
      <CardHeader className="space-y-1">
        <CardTitle className="text-sm font-semibold text-white">Recorded crimes and sexual violence — Spain</CardTitle>
        <CardDescription className="text-xs leading-relaxed text-neutral-400">
          Germany’s trend-chart slot is preserved here. Add a Spain year series when a comparable official table is
          selected; the panel has intentionally not been removed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="font-sans text-2xl font-semibold tracking-tight text-amber-100">Data needed</p>
      </CardContent>
    </Card>
  );
});

export const SpainVictimsTemplate = memo(function SpainVictimsTemplate() {
  return (
    <section className="space-y-3" aria-labelledby="spain-victim-template-heading">
      <div className="space-y-1 px-1">
        <h3 id="spain-victim-template-heading" className="text-base font-semibold text-white">
          Victim statistics template
        </h3>
        <p className="max-w-3xl text-xs leading-relaxed text-neutral-400">
          All {SPAIN_VICTIM_TEMPLATE_SLOT_COUNT} Germany-derived victim slots remain available for Spanish data.
          Empty values are labeled instead of hiding the cards.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {SPAIN_VICTIM_TEMPLATE_SLOTS.map((title) => (
          <Card key={title} className="border-dashed border-line bg-surface-metric shadow-card">
            <CardHeader className="space-y-1 pb-0">
              <CardTitle className="text-sm font-semibold leading-snug text-white">{title}</CardTitle>
              <CardDescription className="text-[11px] leading-snug text-neutral-400">
                Spain source pending
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-3">
              <p className="font-sans text-xl font-semibold tracking-tight text-neutral-300">Data needed</p>
              <p className="mt-2 text-[11px] leading-relaxed text-neutral-500">
                Germany-template statistic retained for later Spanish research and entry.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
});
