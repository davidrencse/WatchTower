import type { ReactNode } from 'react';

type CountryPageIndustrialLoaderProps = {
  /** Shown in the cargo spec readout (e.g. country name). */
  countryLabel?: string;
};

function IconFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center border border-white/90 bg-black text-white [&_svg]:h-3.5 [&_svg]:w-3.5">
      {children}
    </div>
  );
}

function BarcodeStrip() {
  return (
    <div
      className="mb-2 flex h-2 w-full gap-px overflow-hidden border border-white/40 bg-white/10"
      aria-hidden
    >
      {Array.from({ length: 24 }).map((_, i) => (
        <span
          key={i}
          className="h-full bg-white"
          style={{ width: i % 3 === 0 ? 3 : i % 2 === 0 ? 1 : 2, opacity: i % 4 === 0 ? 1 : 0.35 }}
        />
      ))}
    </div>
  );
}

function cargoHash(label: string): number {
  let h = 0;
  for (let i = 0; i < label.length; i += 1) h = (h * 31 + label.charCodeAt(i)) >>> 0;
  return 100_000 + (h % 900_000);
}

/**
 * Industrial “shipping manifest” style loader (high-contrast white on black) for country pages.
 */
export function CountryPageIndustrialLoader({ countryLabel }: CountryPageIndustrialLoaderProps) {
  const label = (countryLabel ?? 'DATASET').toUpperCase();
  const cargoNo = cargoHash(label);

  return (
    <div
      className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading country statistics"
    >
      <div className="rounded-sm border border-white/15 bg-black p-5 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06)] sm:p-7">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap gap-1.5">
              <IconFrame>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                  <path d="M8 16V8l4-4 4 4v8" />
                  <path d="M8 8h8M12 4v4" />
                </svg>
              </IconFrame>
              <IconFrame>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
                  <path d="M8 10h2v2H8zM11 10h2v2h-2zM14 10h2v2h-2zM8 14h8" />
                  <path d="M6 6h12v12H6z" />
                </svg>
              </IconFrame>
              <IconFrame>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                  <path d="M12 5l8 14H4L12 5z" />
                  <path d="M12 10v5M12 17h.01" />
                </svg>
              </IconFrame>
              <IconFrame>
                <span className="font-mono text-[7px] font-bold leading-none tracking-tighter">EAC</span>
              </IconFrame>
              <IconFrame>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M12 5c-2 3-5 5-5 9a5 5 0 0010 0c0-4-3-6-5-9z" />
                </svg>
              </IconFrame>
            </div>
            <p className="font-mono text-[10px] font-bold uppercase leading-snug tracking-[0.08em] text-white/95">
              ///////WATCHTOWER · COUNTRY MANIFEST · {label}
            </p>
          </div>

          <div className="flex shrink-0 flex-row items-end gap-3 lg:gap-4">
            <div className="hidden flex-col gap-0.5 text-right font-mono text-[9px] font-semibold uppercase leading-tight tracking-[0.14em] text-white/80 sm:flex">
              <span>STATS</span>
              <span>MERGE</span>
              <span>LIVE</span>
            </div>
            <div className="w-[9.5rem] shrink-0 border border-white/80 bg-black px-2.5 py-2 font-mono text-white">
              <div className="mb-2 h-2 w-full overflow-hidden border border-white/30 bg-[repeating-linear-gradient(135deg,white_0px,white_2px,transparent_2px,transparent_5px)]" />
              <p className="text-[11px] font-bold uppercase leading-none">GRADE A</p>
              <p className="mt-1 text-[8px] font-semibold uppercase tracking-wider text-white/70">MILITARY GRADE</p>
              <BarcodeStrip />
              <p className="text-[7px] uppercase leading-relaxed tracking-wide text-white/55">
                Special Cargo item number: #{cargoNo}
              </p>
            </div>
            <div
              className="flex h-14 w-11 shrink-0 flex-col items-center justify-center border border-white/80 bg-black py-1 font-mono text-[6px] font-bold uppercase leading-tight text-white/90"
              aria-hidden
            >
              <div className="mb-0.5 h-5 w-7 rounded-sm border border-white/50 bg-white/10" />
              <span className="mt-1 scale-90">WT</span>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="relative h-1 overflow-hidden bg-white/25">
            <div
              className="absolute inset-y-0 left-0 h-full w-1/4 bg-white shadow-[0_0_12px_rgba(255,255,255,0.85)] animate-industrial-fill will-change-transform motion-reduce:animate-none motion-reduce:opacity-90"
            />
          </div>
          <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-white/45">Hydrating tiles · streaming CSV</p>
        </div>
      </div>
    </div>
  );
}
