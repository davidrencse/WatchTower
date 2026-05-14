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
const PERSON_BLOCK_GRID = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3';

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
      className="relative overflow-visible rounded-lg border border-white/[0.08] bg-neutral-950/50 p-3 pr-12 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
      aria-label={entry.name}
    >
      <img
        src={starImage}
        alt=""
        width={36}
        height={36}
        className="pointer-events-none absolute -top-0.5 right-1.5 z-10 h-9 w-9 object-contain opacity-95 drop-shadow-[0_1px_6px_rgba(0,0,0,0.65)]"
        loading="lazy"
        aria-hidden
      />
      <div className="relative z-0 flex flex-wrap items-start justify-between gap-2">
        <h4 className="min-w-0 flex-1 font-sans text-[13px] font-semibold leading-snug text-neutral-100 pr-1">
          {entry.name}
        </h4>
        {entry.influenceRealm ? (
          <span
            className={`mr-10 shrink-0 rounded border border-white/[0.1] bg-white/[0.04] px-2 py-0.5 font-sans text-[9px] text-neutral-400 ${UC_META}`}
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

  const sectionTitle = (
    <>
      <img
        src={starImage}
        alt=""
        width={22}
        height={22}
        className="h-[22px] w-[22px] shrink-0 object-contain opacity-95"
        loading="lazy"
        aria-hidden
      />
      <span className="min-w-0 truncate">Jewish People in Government</span>
    </>
  );

  return (
    <div className="col-span-1 sm:col-span-2 lg:col-span-3">
      <CollapsibleFlagSection title={sectionTitle} count={entries.length} defaultOpen={false}>
        <div className="flex flex-col gap-4">
          <Card className="border-line bg-card/40">
            <CardContent className="p-3">
              <p className={`font-sans text-[10px] leading-relaxed text-neutral-400 ${UC_META}`}>
                {entries.length} profiles · Federal {federalN} · State {stateN} · Positions of power {posN}
              </p>
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
                          <div className={PERSON_BLOCK_GRID}>
                            {group.map((e) => (
                              <PersonBlock key={`${e.name}-${e.position.slice(0, 24)}`} entry={e} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={PERSON_BLOCK_GRID}>
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
