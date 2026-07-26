import { memo, useState, type CSSProperties, type ReactNode } from 'react';
import { CollapsibleFlagSection } from '../CollapsibleFlagSection';
import type {
  Branch,
  EquipItem,
  IconKind,
  MilitaryPanel,
  MilitaryProfile,
  OverviewStat,
} from '../../data/military/types';

/**
 * Renders a hand-curated national military profile (see `src/data/military/`).
 *
 * The component is presentation-only: branch naming, equipment, personnel and
 * the country-specific panels (cyber command, nuclear deterrent, gendarmerie…)
 * all come from the profile, so Germany and France render the same layout from
 * completely separate data.
 */

function EquipIcon({ kind, className, style }: { kind: IconKind; className?: string; style?: CSSProperties }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const paths: Record<IconKind, ReactNode> = {
    tank: (
      <>
        <path {...common} d="M3 14h15l2-3h1v3M3 14v3h17v-3" />
        <circle cx="6" cy="18.5" r="1.4" {...common} />
        <circle cx="10" cy="18.5" r="1.4" {...common} />
        <circle cx="14" cy="18.5" r="1.4" {...common} />
        <path {...common} d="M7 11h6l-1-2H8zM13 12h8" />
      </>
    ),
    afv: (
      <>
        <path {...common} d="M2 15l3-4h10l4 4v2H2z" />
        <circle cx="6" cy="18" r="1.4" {...common} />
        <circle cx="16" cy="18" r="1.4" {...common} />
        <path {...common} d="M6 11V8h5v3" />
      </>
    ),
    artillery: (
      <>
        <path {...common} d="M3 15h9l1-2h2v2h4M3 15v2h13v-2" />
        <circle cx="6" cy="18" r="1.3" {...common} />
        <circle cx="11" cy="18" r="1.3" {...common} />
        <path {...common} d="M12 13l9-5" />
      </>
    ),
    mlrs: (
      <>
        <path {...common} d="M3 15h9v2H3zM3 15l2-3h6v3" />
        <circle cx="6" cy="18" r="1.3" {...common} />
        <circle cx="10" cy="18" r="1.3" {...common} />
        <path {...common} d="M11 9l10-1M11 11l10 1" />
      </>
    ),
    jet: (
      <>
        <path {...common} d="M2 12l8-1 4-6 1 0-1.5 6 6 0 2-2h1l-1.5 3 1.5 3h-1l-2-2-6 0 1.5 6-1 0-4-6z" />
      </>
    ),
    heli: (
      <>
        <path {...common} d="M3 7h18M12 7v3M5 13c0-1.5 2-3 6-3s7 1 8 2v2c0 1-1 2-3 2H8c-3 0-5-1-5-3z" />
        <path {...common} d="M12 16v3H9m3-3h4M6 12V9" />
      </>
    ),
    ship: (
      <>
        <path {...common} d="M3 15h16l-2 4H6zM6 15V8h4l3 4M13 12h4v3" />
        <path {...common} d="M10 8V5" />
      </>
    ),
    sub: (
      <>
        <path {...common} d="M3 13c3-3 14-3 18 0-4 3-15 3-18 0z" />
        <path {...common} d="M12 10V6h2v4M6 13v2M18 12.5l2-1M20 13.5l-2-1" />
      </>
    ),
    cyber: (
      <>
        <rect x="4" y="5" width="16" height="11" rx="1.5" {...common} />
        <path {...common} d="M9 20h6M12 16v4M8 9l-2 2 2 2M16 9l2 2-2 2M13 8l-2 6" />
      </>
    ),
    nuclear: (
      <>
        <circle cx="12" cy="12" r="9" {...common} />
        <circle cx="12" cy="12" r="1.8" {...common} />
        <path {...common} d="M12 10.2L9 5.2M12 10.2l3-5M10.4 13l-5.2 2.6M13.6 13l5.2 2.6" />
      </>
    ),
    shield: (
      <>
        <path {...common} d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z" />
        <path {...common} d="M9 12l2 2 4-4" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true">
      {paths[kind]}
    </svg>
  );
}

function EquipImage({ src, alt, icon, accent }: { src?: string; alt: string; icon: IconKind; accent: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className="grid h-full w-full place-items-center bg-neutral-900">
        <EquipIcon kind={icon} className="h-12 w-12 opacity-60" style={{ color: accent }} />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      decoding="async"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
    />
  );
}

function Meter({ label, note, pct, width, color }: { label: string; note: string; pct: number; width?: number; color: string }) {
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between font-sans text-[9px] font-medium uppercase tracking-[0.08em] text-neutral-500">
        <span>{label}</span>
        <span className="tabular-nums text-neutral-300">{note}</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div className="h-full rounded-full" style={{ width: `${Math.min(100, Math.max(width ?? pct, 2))}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function EquipCard({ item, accent, shareBase }: { item: EquipItem; accent: string; shareBase: number }) {
  const readyPct = item.ready != null ? Math.round((item.ready / item.total) * 100) : null;
  const share = item.support || shareBase <= 0 ? null : Number(((item.total / shareBase) * 100).toFixed(1));
  return (
    <div className="group flex flex-col overflow-hidden rounded-md border border-line bg-surface-metric shadow-card">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
        <EquipImage src={item.image} alt={`${item.name} — ${item.platform}`} icon={item.icon} accent={accent} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <span
          className="absolute bottom-1.5 left-2.5 font-sans text-[9px] font-semibold uppercase tracking-[0.14em] drop-shadow"
          style={{ color: accent }}
        >
          {item.platform}
        </span>
        {item.support ? (
          <span className="absolute right-2 top-2 rounded-full border border-white/20 bg-black/50 px-1.5 py-0.5 font-sans text-[8px] font-semibold uppercase tracking-[0.1em] text-neutral-200">
            Support fleet
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-3">
        <p className="font-sans text-[12px] font-semibold leading-tight text-neutral-100">{item.name}</p>
        <div className="mt-1 flex items-baseline justify-between gap-2">
          <span className="font-sans text-[26px] font-semibold leading-none tracking-tight tabular-nums text-neutral-50">
            {item.total.toLocaleString('en-US')}
          </span>
          {share != null ? (
            <span
              className="shrink-0 rounded px-1.5 py-0.5 font-sans text-[10px] font-semibold tabular-nums"
              style={{ color: accent, backgroundColor: `${accent}1f` }}
            >
              {share}%
            </span>
          ) : null}
        </div>
        <div className="mt-auto">
          {readyPct != null && item.ready != null ? (
            <Meter
              label="Combat-ready"
              note={`${item.ready.toLocaleString('en-US')} · ${readyPct}%`}
              pct={readyPct}
              color="#4ade80"
            />
          ) : null}
          {share != null ? (
            <Meter label="Share of fleet" note={`${share}%`} pct={share} width={share} color={accent} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div className="flex flex-col rounded-md border border-line bg-surface-metric p-3.5 shadow-card sm:p-4">
      <p className="font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-500">{label}</p>
      <p
        className="mt-2 font-sans text-2xl font-semibold leading-none tracking-tight tabular-nums sm:text-3xl"
        style={{ color: accent ?? 'var(--fg)' }}
      >
        {value}
      </p>
      {sub ? <p className="mt-1.5 font-sans text-[10px] font-medium leading-snug text-neutral-500">{sub}</p> : null}
    </div>
  );
}

function BranchHeader({ branch }: { branch: Branch }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-line bg-surface-metric/60 px-3.5 py-2.5">
      <div className="flex items-center gap-2.5">
        <span className="grid h-8 w-8 place-items-center rounded-md" style={{ backgroundColor: `${branch.accent}1f`, color: branch.accent }}>
          <EquipIcon kind={branch.items[0]!.icon} className="h-5 w-5" />
        </span>
        <div>
          <p className="font-sans text-[13px] font-semibold leading-tight text-neutral-100">{branch.headline}</p>
          <p className="font-sans text-[10px] leading-snug text-neutral-500">{branch.blurb}</p>
        </div>
      </div>
      <span
        className="rounded-full px-2 py-0.5 font-sans text-[9px] font-semibold uppercase tracking-[0.12em]"
        style={{ color: branch.accent, backgroundColor: `${branch.accent}1a` }}
      >
        {branch.items.length} systems
      </span>
    </div>
  );
}

function BranchSection({
  branch,
  footnote,
  collapseSignal,
  expandSignal,
}: {
  branch: Branch;
  footnote: string;
  collapseSignal?: number;
  expandSignal?: number;
}) {
  const shareBase = branch.items.filter((i) => !i.support).reduce((n, i) => n + i.total, 0);
  return (
    <CollapsibleFlagSection
      title={branch.title}
      count={branch.items.length}
      defaultOpen
      uppercaseTitle
      anchorId={`country-sub-military-${branch.id}`}
      ribbonExpandKey={`sub:military:${branch.id}`}
      collapseSignal={collapseSignal}
      expandSignal={expandSignal}
    >
      <div className="flex flex-col gap-3">
        <BranchHeader branch={branch} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {branch.items.map((item) => (
            <EquipCard key={item.key} item={item} accent={branch.accent} shareBase={shareBase} />
          ))}
        </div>
        <p className="font-sans text-[10px] leading-relaxed text-neutral-600">{footnote}</p>
      </div>
    </CollapsibleFlagSection>
  );
}

function PanelSection({
  panel,
  collapseSignal,
  expandSignal,
}: {
  panel: MilitaryPanel;
  collapseSignal?: number;
  expandSignal?: number;
}) {
  return (
    <CollapsibleFlagSection
      title={panel.title}
      count={panel.items.length}
      defaultOpen
      uppercaseTitle
      anchorId={`country-sub-military-${panel.id}`}
      ribbonExpandKey={`sub:military:${panel.id}`}
      collapseSignal={collapseSignal}
      expandSignal={expandSignal}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2.5 rounded-md border border-line bg-surface-metric/60 px-3.5 py-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-md" style={{ backgroundColor: `${panel.accent}1f`, color: panel.accent }}>
            <EquipIcon kind={panel.icon} className="h-5 w-5" />
          </span>
          <div>
            <p className="font-sans text-[13px] font-semibold leading-tight text-neutral-100">{panel.headline}</p>
            <p className="font-sans text-[10px] leading-snug text-neutral-500">{panel.blurb}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {panel.stats.map((s) => (
            <StatCard key={s.label} label={s.label} value={s.value} sub={s.sub} accent={panel.accent} />
          ))}
        </div>

        <div className="rounded-md border border-line bg-surface-metric p-3.5 shadow-card">
          <p className="font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-500">{panel.listTitle}</p>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {panel.items.map((d) => (
              <div key={d.name} className="flex items-start gap-2 rounded border border-white/[0.06] bg-white/[0.02] px-2.5 py-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: panel.accent }} />
                <div>
                  <p className="font-sans text-[11px] font-semibold leading-tight text-neutral-200">{d.name}</p>
                  <p className="font-sans text-[9px] leading-snug text-neutral-500">{d.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="font-sans text-[10px] leading-relaxed text-neutral-600">{panel.footnote}</p>
      </div>
    </CollapsibleFlagSection>
  );
}

function MilitaryOverview({ stats }: { stats: readonly OverviewStat[] }) {
  // 6 cards split 3×2 on large screens; the 5-card layout stays a single row.
  const cols = stats.length === 6 ? 'lg:grid-cols-3 xl:grid-cols-6' : 'lg:grid-cols-5';
  return (
    <div className="flex flex-col gap-3">
      <div className={`grid grid-cols-2 gap-3 ${cols}`}>
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} sub={s.sub} accent={s.accent} />
        ))}
      </div>
    </div>
  );
}

export const NationalMilitarySection = memo(function NationalMilitarySection({
  profile,
  collapseSignal,
  expandSignal,
  headerControls,
}: {
  profile: MilitaryProfile;
  collapseSignal?: number;
  expandSignal?: number;
  headerControls?: ReactNode;
}) {
  const totalSystems =
    profile.branches.reduce((n, b) => n + b.items.length, 0) +
    profile.panels.reduce((n, p) => n + p.items.length, 0);
  return (
    <CollapsibleFlagSection
      title="Military"
      count={totalSystems}
      defaultOpen
      anchorId="country-section-military"
      ribbonExpandKey="main:military"
      headerControls={headerControls}
      collapseSignal={collapseSignal}
      expandSignal={expandSignal}
    >
      <div className="flex flex-col gap-4">
        <MilitaryOverview stats={profile.overview} />
        {profile.branches.map((branch) => (
          <BranchSection
            key={branch.id}
            branch={branch}
            footnote={profile.branchFootnote}
            collapseSignal={collapseSignal}
            expandSignal={expandSignal}
          />
        ))}
        {profile.panels.map((panel) => (
          <PanelSection key={panel.id} panel={panel} collapseSignal={collapseSignal} expandSignal={expandSignal} />
        ))}
        <p className="font-sans text-[10px] leading-relaxed text-neutral-600">
          Sources:{' '}
          {profile.sources.map((s, i) => (
            <span key={s.url}>
              {i > 0 ? ' · ' : null}
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[var(--uk-accent)] hover:text-neutral-200">
                {s.label}
              </a>
            </span>
          ))}
          . {profile.footnote}
        </p>
      </div>
    </CollapsibleFlagSection>
  );
});
