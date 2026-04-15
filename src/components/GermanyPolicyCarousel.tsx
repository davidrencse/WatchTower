import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { GERMANY_POLICY_INFOGRAPHICS } from '../data/germanyPolicyInfographicCards';
import type { GermanyGovernmentPoliticsRow } from '../lib/germanyGovernmentPolitics';
import { Badge } from './ui/badge';

const POLICY_CARD_SHADOW =
  '0px 0px 0px 1px rgba(165, 165, 165, 0.04), -9px 9px 9px -0.5px rgba(0, 0, 0, 0.04), -18px 18px 18px -1.5px rgba(0, 0, 0, 0.08), -37px 37px 37px -3px rgba(0, 0, 0, 0.16), -75px 75px 75px -6px rgba(0, 0, 0, 0.24), -150px 150px 150px -12px rgba(0, 0, 0, 0.48)';

const UC_TITLE = 'uppercase tracking-[0.05em]';
const UC_LABEL = 'uppercase tracking-[0.04em]';
const UC_META = 'uppercase tracking-[0.03em]';

/** >1 = same pointer movement scrolls farther (easier to move between slides). */
const DRAG_SENSITIVITY = 2.4;

type Props = {
  policyRows: GermanyGovernmentPoliticsRow[];
};

export function GermanyPolicyCarousel({ policyRows }: Props) {
  const scRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const drag = useRef({ on: false, startX: 0, startScroll: 0 });
  void policyRows;

  const count = GERMANY_POLICY_INFOGRAPHICS.length;

  const snapToIndex = useCallback(
    (idx: number) => {
      const el = scRef.current;
      if (!el) return;
      const w = el.clientWidth;
      const clamped = Math.max(0, Math.min(count - 1, idx));
      el.scrollTo({ left: clamped * w, behavior: 'smooth' });
      setActive(clamped);
    },
    [count],
  );

  const syncActiveFromScroll = useCallback(() => {
    const el = scRef.current;
    if (!el) return;
    const w = el.clientWidth;
    if (w <= 0) return;
    setActive(Math.min(count - 1, Math.max(0, Math.round(el.scrollLeft / w))));
  }, [count]);

  useEffect(() => {
    const el = scRef.current;
    if (!el) return;
    const onScroll = () => syncActiveFromScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [syncActiveFromScroll]);

  const isInteractiveTarget = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) return false;
    return Boolean(target.closest('button, a, summary, details, input, select, textarea, label'));
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!e.isPrimary || !scRef.current) return;
    if (isInteractiveTarget(e.target)) return;
    drag.current = { on: true, startX: e.clientX, startScroll: scRef.current.scrollLeft };
    scRef.current.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current.on || !scRef.current) return;
    const el = scRef.current;
    const w = el.clientWidth;
    const maxScroll = Math.max(0, el.scrollWidth - w);
    const delta = (e.clientX - drag.current.startX) * DRAG_SENSITIVITY;
    el.scrollLeft = Math.max(0, Math.min(maxScroll, drag.current.startScroll - delta));
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!scRef.current) return;
    if (drag.current.on) {
      drag.current.on = false;
      try {
        scRef.current.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      const el = scRef.current;
      const w = el.clientWidth;
      const idx = Math.max(0, Math.min(count - 1, Math.round(el.scrollLeft / w)));
      el.scrollTo({ left: idx * w, behavior: 'smooth' });
      setActive(idx);
    }
  };

  return (
    <div className="sm:col-span-2 lg:col-span-3">
      <div className="mb-3 flex items-center justify-between gap-3 px-1">
        <p className={`font-mono text-[10px] text-neutral-500 ${UC_META}`}>
          Drag (sensitive) or arrows · {active + 1} / {count}
        </p>
        <div className="flex gap-1.5">
          {GERMANY_POLICY_INFOGRAPHICS.map((c, i) => (
            <button
              key={c.sectorTitle}
              type="button"
              aria-label={`Show ${c.sectorTitle}`}
              onClick={() => snapToIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === active ? 'w-6 bg-white' : 'w-1.5 bg-neutral-600 hover:bg-neutral-500'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex items-stretch gap-1.5 sm:gap-2">
        <button
          type="button"
          aria-label="Previous policy"
          disabled={active <= 0}
          onClick={() => snapToIndex(active - 1)}
          className="flex shrink-0 items-center justify-center self-center rounded-xl border border-neutral-700 bg-neutral-900/90 px-2.5 py-6 font-mono text-sm text-white shadow-sm transition-colors hover:border-neutral-500 hover:bg-neutral-800 disabled:pointer-events-none disabled:opacity-25 sm:px-3.5 sm:py-8 sm:text-base"
        >
          {'<-'}
        </button>

        <div
          ref={scRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Federal policy changes"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="flex min-w-0 flex-1 flex-row cursor-grab touch-pan-x snap-x snap-mandatory overflow-x-auto scroll-smooth active:cursor-grabbing select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
        {GERMANY_POLICY_INFOGRAPHICS.map((card) => {
          return (
            <div
              key={card.sectorTitle}
              className="box-border min-w-full shrink-0 snap-start px-1 pb-2"
              aria-roledescription="slide"
            >
              <article
                className="mx-auto flex max-h-[min(72vh,680px)] min-h-[420px] max-w-2xl flex-col overflow-hidden rounded-[1.5rem] border border-neutral-800/90 bg-[#121212] text-neutral-200"
                style={{ boxShadow: POLICY_CARD_SHADOW }}
              >
                <div className="border-b border-neutral-800/80 px-6 pb-4 pt-6">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className={`max-w-[85%] text-base font-semibold leading-snug text-white sm:text-lg ${UC_TITLE}`}>
                      {card.sectorTitle}
                    </h3>
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-neutral-300">{card.description}</p>
                </div>

                <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-5">
                  <section>
                    <h4 className={`mb-2 text-[10px] font-semibold text-neutral-500 ${UC_LABEL}`}>Key policies</h4>
                    <div className="space-y-2">
                      {card.policies.map((policy) => (
                        <details key={policy.name} open className="rounded-lg border border-neutral-800/80 bg-black/30 px-3 py-2">
                          <summary
                            className={`cursor-pointer list-none font-mono text-[11px] text-neutral-300 hover:text-neutral-100 ${UC_META}`}
                          >
                            {policy.name}
                          </summary>
                          <div className="mt-3 space-y-3">
                            <p className="text-[12px] leading-relaxed text-neutral-300">
                              <strong className="text-neutral-100">Policy:</strong> {policy.name}
                            </p>
                            <p className="text-[12px] leading-relaxed text-neutral-300">
                              <strong className="text-neutral-100">What Changed:</strong> {policy.whatChanged}
                            </p>
                            <p className="text-[12px] leading-relaxed text-neutral-400">{policy.details}</p>
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="outline" className={`border-neutral-600 text-neutral-200 ${UC_META}`}>
                                {policy.status}
                              </Badge>
                            </div>
                            <p className={`font-mono text-[10px] text-neutral-500 ${UC_META}`}>Source: {policy.source}</p>
                          </div>
                        </details>
                      ))}
                    </div>
                  </section>
                </div>
              </article>
            </div>
          );
        })}
        </div>

        <button
          type="button"
          aria-label="Next policy"
          disabled={active >= count - 1}
          onClick={() => snapToIndex(active + 1)}
          className="flex shrink-0 items-center justify-center self-center rounded-xl border border-neutral-700 bg-neutral-900/90 px-2.5 py-6 font-mono text-sm text-white shadow-sm transition-colors hover:border-neutral-500 hover:bg-neutral-800 disabled:pointer-events-none disabled:opacity-25 sm:px-3.5 sm:py-8 sm:text-base"
        >
          {'->'}
        </button>
      </div>
    </div>
  );
}
