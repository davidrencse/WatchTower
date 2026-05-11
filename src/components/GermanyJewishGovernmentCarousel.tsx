import { useMemo } from 'react';
import jewishGovernmentCsvRaw from '../../Assets/Data/Europe/Germany/jewish.csv?raw';
import starImage from '../../Assets/star.png';
import {
  GERMANY_JEWISH_GOVERNMENT_PEOPLE,
  GERMANY_JEWISH_GOV_INFLUENCE_LABEL,
  GERMANY_JEWISH_GOV_TIER_LABEL,
  type GermanyJewishGovTier,
  type GermanyJewishGovernmentEntry,
} from '../data/germanyJewishGovernmentPeople';
import { mergeCuratedAndLegacyJewishGovernment, parseGermanyJewishGovernmentCsv } from '../lib/germanyJewishGovernment';
import { Card, CardContent } from './ui/card';
import { CollapsibleFlagSection } from './CollapsibleFlagSection';

const UC_TITLE = 'uppercase tracking-[0.05em]';
const UC_META = 'uppercase tracking-[0.03em]';

const TIER_ORDER: GermanyJewishGovTier[] = ['federal', 'state', 'positions'];

function groupByTier(entries: GermanyJewishGovernmentEntry[]): Map<GermanyJewishGovTier, GermanyJewishGovernmentEntry[]> {
  const m = new Map<GermanyJewishGovTier, GermanyJewishGovernmentEntry[]>();
  for (const t of TIER_ORDER) m.set(t, []);
  for (const e of entries) {
    const list = m.get(e.tier);
    if (list) list.push(e);
  }
  for (const t of TIER_ORDER) {
    m.set(
      t,
      (m.get(t) ?? []).sort((a, b) => a.name.localeCompare(b.name, 'de', { sensitivity: 'base' })),
    );
  }
  return m;
}

function groupPositionsByRealm(entries: GermanyJewishGovernmentEntry[]): GermanyJewishGovernmentEntry[][] {
  const order = ['judiciary', 'media', 'business', 'academic_ngo'] as const;
  const buckets = new Map<string, GermanyJewishGovernmentEntry[]>();
  for (const k of order) buckets.set(k, []);
  const uncategorized: GermanyJewishGovernmentEntry[] = [];
  for (const e of entries) {
    if (e.tier !== 'positions') continue;
    const r = e.influenceRealm;
    if (r && buckets.has(r)) buckets.get(r)!.push(e);
    else uncategorized.push(e);
  }
  const out: GermanyJewishGovernmentEntry[][] = [];
  for (const k of order) {
    const g = buckets.get(k)!;
    if (g.length) out.push(g);
  }
  if (uncategorized.length) out.push(uncategorized);
  return out;
}

function PersonBlock({ entry }: { entry: GermanyJewishGovernmentEntry }) {
  return (
    <article
      className="rounded-lg border border-white/[0.08] bg-neutral-950/50 p-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
      aria-label={entry.name}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h4 className="font-sans text-[13px] font-semibold leading-snug text-neutral-100">{entry.name}</h4>
        {entry.influenceRealm ? (
          <span
            className={`shrink-0 rounded border border-white/[0.1] bg-white/[0.04] px-2 py-0.5 font-sans text-[9px] text-neutral-400 ${UC_META}`}
          >
            {GERMANY_JEWISH_GOV_INFLUENCE_LABEL[entry.influenceRealm]}
          </span>
        ) : null}
      </div>
      <p className={`mt-2 font-sans text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--uk-accent)]`}>
        Position / role
      </p>
      <p className="mt-1 font-sans text-[11px] leading-relaxed text-neutral-200">{entry.position}</p>
      <p className={`mt-3 font-sans text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-500`}>Background</p>
      <p className="mt-1 whitespace-pre-wrap font-sans text-[11px] leading-relaxed text-neutral-300">{entry.background}</p>
      <p className={`mt-3 font-sans text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-500`}>Sources</p>
      <p className="mt-1 whitespace-pre-wrap font-sans text-[10px] leading-relaxed text-neutral-500">{entry.sourceNotes}</p>
    </article>
  );
}

export function GermanyJewishGovernmentCarousel() {
  const entries = useMemo(() => {
    const legacy = parseGermanyJewishGovernmentCsv(jewishGovernmentCsvRaw);
    return mergeCuratedAndLegacyJewishGovernment(GERMANY_JEWISH_GOVERNMENT_PEOPLE, legacy);
  }, []);

  const byTier = useMemo(() => groupByTier(entries), [entries]);

  if (entries.length === 0) return null;

  const federalN = byTier.get('federal')?.length ?? 0;
  const stateN = byTier.get('state')?.length ?? 0;
  const posN = byTier.get('positions')?.length ?? 0;

  return (
    <div className="col-span-1 sm:col-span-2 lg:col-span-3">
      <CollapsibleFlagSection title="Jewish people in government" count={entries.length} defaultOpen={false}>
        <div className="flex flex-col gap-4">
          <Card className="border-line bg-card/40">
            <CardContent className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-white/[0.08] bg-black/25">
                <img src={starImage} alt="" className="h-9 w-auto object-contain opacity-95" loading="lazy" />
              </div>
              <div className="min-w-0">
                <p className="font-sans text-sm text-neutral-200">
                  Reference: federal Bundestag and cabinet figures, Länder politics, and other positions of public
                  influence (20th Bundestag era and legacy profiles).
                </p>
                <p className={`mt-2 font-sans text-[10px] text-neutral-500 ${UC_META}`}>
                  {entries.length} profiles · Federal {federalN} · State {stateN} · Positions of power {posN}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-10">
            {TIER_ORDER.map((tier) => {
              const tierEntries = byTier.get(tier) ?? [];
              if (tierEntries.length === 0) return null;
              return (
                <section key={tier} aria-label={GERMANY_JEWISH_GOV_TIER_LABEL[tier]}>
                  <header className="mb-4 border-b border-white/[0.06] pb-2">
                    <h3 className={`font-sans text-xs font-semibold text-neutral-200 ${UC_TITLE}`}>
                      {GERMANY_JEWISH_GOV_TIER_LABEL[tier]}
                    </h3>
                    <p className={`mt-1 font-sans text-[10px] text-neutral-500 ${UC_META}`}>
                      {tierEntries.length} {tierEntries.length === 1 ? 'entry' : 'entries'}
                    </p>
                  </header>
                  {tier === 'positions' ? (
                    <div className="flex flex-col gap-8">
                      {groupPositionsByRealm(tierEntries).map((group, gi) => (
                        <div key={gi} className="flex flex-col gap-3">
                          {group[0]?.influenceRealm ? (
                            <p className={`font-sans text-[10px] font-medium text-neutral-400 ${UC_META}`}>
                              {GERMANY_JEWISH_GOV_INFLUENCE_LABEL[group[0].influenceRealm]}
                            </p>
                          ) : null}
                          <div className="flex flex-col gap-3">
                            {group.map((e) => (
                              <PersonBlock key={`${e.name}-${e.position.slice(0, 24)}`} entry={e} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {tierEntries.map((e) => (
                        <PersonBlock key={`${e.name}-${e.position.slice(0, 24)}`} entry={e} />
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>

          <div className="shrink-0 border-t border-white/[0.08] px-1 pt-3">
              <p className={`font-sans text-[10px] text-neutral-600 ${UC_META}`}>
                Curated dataset: <code className="text-neutral-500">src/data/germanyJewishGovernmentPeople.ts</code> ·
                Legacy CSV: <code className="text-neutral-500">Assets/Data/Europe/Germany/jewish.csv</code>
              </p>
          </div>
        </div>
      </CollapsibleFlagSection>
    </div>
  );
}
