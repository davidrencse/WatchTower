/**
 * World vitals — session-elapsed counters plus the 2025 births distribution.
 *
 * The counters are projections, not feeds. Each one is `published annual rate × seconds this
 * session has been open`, so what it measures is how long you have been here, expressed in a
 * demographic unit. The panel says that in the footer rather than leaving the number to imply
 * a live wire it does not have.
 *
 * The tick commits to React at ~5 Hz and pauses while the tab is hidden. A frame-rate loop would
 * wake the main thread 60 times a second for digits that only need five visible updates.
 */

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { Activity, ChevronDown, ExternalLink, X } from 'lucide-react';
import {
  BIRTHS_BY_COUNTRY_2025,
  BIRTHS_SOURCE,
  BIRTH_REGIONS,
  RATE_BASIS_NOTE,
  WORLD_BIRTHS_2025,
  WORLD_VITAL_RATES,
  perSecond,
  secondsBetween,
  type BirthRegionId,
  type CountryBirths,
} from '../data/worldVitalStatistics';
import { squarify } from '../lib/squarifiedTreemap';

const MONO = "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace";

/** State commit interval. Fast enough that the births digit never looks stuck. */
const TICK_MS = 200;

const CHART_WIDTH = 268;
const CHART_HEIGHT = 208;

function formatCount(value: number): string {
  return Math.floor(value).toLocaleString('en-US');
}

function formatBirths(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 1 : 2)}M`;
  return `${Math.round(value / 1000)}K`;
}

function formatInterval(seconds: number): string {
  if (seconds < 1) return `${(1 / seconds).toFixed(1)}/sec`;
  if (seconds < 60) return `1 every ${seconds.toFixed(1)}s`;
  return `1 every ${(seconds / 60).toFixed(1)}min`;
}

interface Cell {
  country: CountryBirths;
  region: BirthRegionId;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Two-level layout: regions get the frame, then each region's countries get its rect. Laying
 * all ~60 countries out flat would scatter each continent across the chart and lose the
 * comparison the graphic exists to make.
 */
function layoutBirths(): Cell[] {
  const regionRects = squarify(
    BIRTH_REGIONS.map((region) => ({ value: region.total, datum: region })),
    { x: 0, y: 0, width: CHART_WIDTH, height: CHART_HEIGHT },
  );

  const cells: Cell[] = [];
  for (const rect of regionRects) {
    const region = rect.datum;
    const countries = BIRTHS_BY_COUNTRY_2025.filter((c) => c.region === region.id);
    // Countries listed individually never sum to the regional total — the source folds the
    // remainder into its "Rest of" row, which is already in this list. Lay out what we have
    // and let it fill the region rect.
    const inner = squarify(
      countries.map((country) => ({ value: country.births, datum: country })),
      { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
    );
    for (const cell of inner) {
      cells.push({
        country: cell.datum,
        region: region.id,
        color: region.color,
        x: cell.x,
        y: cell.y,
        width: cell.width,
        height: cell.height,
      });
    }
  }
  return cells;
}

export default function WorldVitalsPanel() {
  const [open, setOpen] = useState(
    () => typeof window === 'undefined' || !window.matchMedia('(max-width: 639px)').matches,
  );
  const [showChart, setShowChart] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [activeCellIndex, setActiveCellIndex] = useState(0);
  const startRef = useRef(performance.now());

  useEffect(() => {
    if (!open) return;
    let timer = 0;
    const commit = () => setElapsed((performance.now() - startRef.current) / 1000);
    const stop = () => {
      if (!timer) return;
      window.clearInterval(timer);
      timer = 0;
    };
    const start = () => {
      if (document.hidden || timer) return;
      commit();
      timer = window.setInterval(commit, TICK_MS);
    };
    const syncVisibility = () => (document.hidden ? stop() : start());

    start();
    document.addEventListener('visibilitychange', syncVisibility);
    return () => {
      document.removeEventListener('visibilitychange', syncVisibility);
      stop();
    };
  }, [open]);

  const cells = useMemo(() => (showChart ? layoutBirths() : []), [showChart]);
  const activeCell = cells[activeCellIndex] ?? null;

  const handleChartKeyDown = (event: KeyboardEvent<SVGSVGElement>) => {
    if (!cells.length) return;

    let nextIndex = activeCellIndex;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (activeCellIndex + 1) % cells.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (activeCellIndex - 1 + cells.length) % cells.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = cells.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    setActiveCellIndex(nextIndex);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open world vitals"
        className="pointer-events-auto absolute right-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] z-[60] inline-flex min-h-11 items-center gap-2 border border-white/20 bg-black/90 px-3.5 text-[11px] uppercase tracking-[0.18em] text-white/75 shadow-[0_10px_30px_rgba(0,0,0,0.32)] backdrop-blur-md transition-[color,border-color,background-color] hover:border-white/35 hover:bg-neutral-950 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        style={{ fontFamily: MONO }}
      >
        <Activity aria-hidden size={14} strokeWidth={1.7} />
        Vitals
      </button>
    );
  }

  return (
    // The satellite legend owns the vertical centre of the same rail, so cap this at the space
    // above it and let the chart scroll rather than collide on a short viewport.
    <div
      className="pointer-events-auto absolute right-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] z-[60] flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-[320px] flex-col overflow-hidden border border-white/[0.14] bg-black/90 shadow-[0_18px_48px_rgba(0,0,0,0.38)] backdrop-blur-md sm:max-h-[calc(50dvh-1.5rem)]"
      style={{ fontFamily: MONO }}
    >
      <div className="flex shrink-0 items-center gap-3 border-b border-white/10 px-4 py-2.5">
        <Activity aria-hidden className="shrink-0 text-white/65" size={16} strokeWidth={1.6} />
        <span className="min-w-0 font-sans">
          <strong className="block truncate text-xs font-semibold uppercase tracking-[0.12em] text-white/95">
            World vitals
          </strong>
          <small className="mt-0.5 block text-[11px] uppercase tracking-[0.1em] text-white/48">
            Session projection
          </small>
        </span>
        <span className="ml-auto shrink-0 text-right">
          <span className="block text-[11px] uppercase tracking-[0.14em] text-white/40">Elapsed</span>
          <span className="mt-0.5 block text-[11px] tabular-nums tracking-[0.08em] text-white/72">
            T+{Math.floor(elapsed / 60)}m {String(Math.floor(elapsed % 60)).padStart(2, '0')}s
          </span>
        </span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Collapse world vitals"
          className="-mr-2 inline-grid min-h-11 min-w-11 place-items-center text-white/48 transition-[color,background-color] hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/70"
        >
          <X aria-hidden size={16} strokeWidth={1.6} />
        </button>
      </div>

      <div className="min-h-0 overflow-y-auto overscroll-contain">
        <div className="divide-y divide-white/[0.07]">
          {WORLD_VITAL_RATES.map((rate) => {
            const count = perSecond(rate) * elapsed;
            return (
              <div key={rate.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3">
                <span className="flex min-w-0 items-start gap-2.5">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: rate.color }}
                  />
                  <span className="min-w-0">
                    <span className="block text-[11px] uppercase tracking-[0.16em] text-white/76">
                      {rate.label}
                    </span>
                    <span className="mt-1 block whitespace-nowrap text-[11px] tracking-[0.03em] text-white/48">
                      {formatInterval(secondsBetween(rate))}
                    </span>
                  </span>
                </span>
                <span
                  className="text-right text-xl font-medium leading-none tabular-nums tracking-[-0.02em]"
                  style={{ color: rate.color }}
                >
                  {formatCount(count)}
                </span>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setShowChart((value) => !value)}
          aria-expanded={showChart}
          aria-controls="world-vitals-births-chart"
          className="flex min-h-11 w-full items-center gap-2 border-t border-white/10 px-4 text-left transition-colors hover:bg-white/[0.045] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/70"
        >
          <span className="font-sans text-[11px] font-medium tracking-[0.01em] text-white/78">
            Births by country
          </span>
          <span className="text-[11px] tracking-[0.08em] text-white/45">2025</span>
          <ChevronDown
            aria-hidden
            className={`ml-auto text-white/48 transition-transform duration-200 ${showChart ? 'rotate-180' : ''}`}
            size={15}
            strokeWidth={1.7}
          />
        </button>

        {showChart && (
          <div id="world-vitals-births-chart" className="border-t border-white/[0.07] px-4 pb-3 pt-3">
            <svg
              viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
              width="100%"
              className="block cursor-crosshair focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              role="img"
              tabIndex={0}
              aria-label={`Treemap of world births by country in 2025, grouped by region. ${
                activeCell
                  ? `${activeCell.country.label}: ${formatBirths(activeCell.country.births)} births.`
                  : ''
              } Use arrow keys to inspect countries.`}
              onFocus={() => setActiveCellIndex((index) => Math.min(index, cells.length - 1))}
              onKeyDown={handleChartKeyDown}
            >
              {cells.map((cell, index) => {
              // Only cells with room for two lines of 5px type get labelled; the rest rely on
              // the detail readout, which is better than a chart of clipped words.
              const labelled = cell.width > 30 && cell.height > 20;
              const active = activeCellIndex === index;
              return (
                <g
                  key={`${cell.region}-${cell.country.iso3}`}
                  onPointerEnter={() => setActiveCellIndex(index)}
                  onClick={() => setActiveCellIndex(index)}
                >
                  <title>{`${cell.country.label}: ${formatBirths(cell.country.births)} births`}</title>
                  <rect
                    x={cell.x}
                    y={cell.y}
                    width={Math.max(0, cell.width - 0.8)}
                    height={Math.max(0, cell.height - 0.8)}
                    fill={cell.color}
                    fillOpacity={active ? 0.95 : 0.62}
                    stroke="#0b0b0d"
                    strokeWidth="0.8"
                  />
                  {labelled && (
                    <>
                      <text
                        x={cell.x + 3}
                        y={cell.y + 9}
                        fill="#ffffff"
                        fillOpacity="0.92"
                        style={{ fontSize: 7, letterSpacing: 0.3 }}
                      >
                        {cell.country.iso3}
                      </text>
                      <text
                        x={cell.x + 3}
                        y={cell.y + 17}
                        fill="#ffffff"
                        fillOpacity="0.62"
                        style={{ fontSize: 6.4 }}
                      >
                        {formatBirths(cell.country.births)}
                      </text>
                    </>
                  )}
                </g>
              );
              })}
            </svg>

            <div
              className="mt-2 flex min-h-[38px] items-start gap-2.5 border-t border-white/[0.08] pt-2"
              aria-live="polite"
            >
            {activeCell ? (
              <>
                <span
                  className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: activeCell.color }}
                />
                <div className="min-w-0">
                  <p className="truncate font-sans text-[11px] font-medium text-white/92">
                    {activeCell.country.label}
                  </p>
                  <p className="mt-0.5 text-[11px] tracking-[0.04em] text-white/52">
                    {formatBirths(activeCell.country.births)} births ·{' '}
                    {((activeCell.country.births / WORLD_BIRTHS_2025) * 100).toFixed(1)}% of world
                  </p>
                </div>
              </>
            ) : (
              <p className="text-[11px] uppercase tracking-[0.1em] text-white/48">
                World total {formatBirths(WORLD_BIRTHS_2025)}
              </p>
            )}
            </div>

            <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-white/[0.07] pt-2">
              {BIRTH_REGIONS.map((region) => (
                <span key={region.id} className="flex min-w-0 items-center gap-1.5">
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-[1px]"
                    style={{ background: region.color }}
                  />
                  <span className="truncate text-[11px] uppercase tracking-[0.08em] text-white/52">
                    {region.label} · {formatBirths(region.total)}
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-white/10 px-4 py-3 font-sans">
          <p className="text-[11px] leading-relaxed text-white/52">{RATE_BASIS_NOTE}</p>
          <a
            href={BIRTHS_SOURCE.url}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex min-h-6 items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-white/58 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            UN WPP 2024 source
            <ExternalLink aria-hidden size={11} strokeWidth={1.7} />
          </a>
        </div>
      </div>
    </div>
  );
}
