import { memo, type CSSProperties, type ReactNode } from 'react';
import {
  COUNTRY_MILITARY_DATA,
  type MilitaryCountryImages,
  type MilitaryInventoryItem,
  type RankedMilitaryCountryData,
} from '../../data/military/globalFirepower';
import {
  COUNTRY_MILITARY_EQUIPMENT,
  type CountryEquipmentVisual,
} from '../../data/military/equipmentVisuals';
import { CollapsibleFlagSection } from '../CollapsibleFlagSection';

const ARMY_ACCENT = '#8aa35b';
const NAVY_ACCENT = '#4f8ff0';
const AIR_ACCENT = '#38bdf8';

type IconKind = 'tank' | 'vehicle' | 'artillery' | 'jet' | 'helicopter' | 'ship' | 'submarine';
type BranchId = 'army' | 'navy' | 'airforce';

type BranchView = {
  id: BranchId;
  title: string;
  accent: string;
  headline: string;
  blurb: string;
  items: MilitaryInventoryItem[];
  shareBase?: number;
};

const numberFormatter = new Intl.NumberFormat('en-US');
const compactUsdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
});

function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

function itemIcon(key: string): IconKind {
  if (key === 'tanks') return 'tank';
  if (key === 'vehicles') return 'vehicle';
  if (key.includes('Artillery') || key === 'mlrs') return 'artillery';
  if (key === 'helicopters' || key === 'attackHelicopters') return 'helicopter';
  if (key === 'submarines') return 'submarine';
  if (
    key === 'aircraftCarriers' ||
    key === 'helicopterCarriers' ||
    key === 'destroyers' ||
    key === 'frigates' ||
    key === 'corvettes' ||
    key === 'patrolVessels' ||
    key === 'mineWarfare'
  ) {
    return 'ship';
  }
  return 'jet';
}

function EquipmentIcon({
  kind,
  className,
  style,
}: {
  kind: IconKind;
  className?: string;
  style?: CSSProperties;
}) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.55,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true">
      {kind === 'tank' ? (
        <>
          <path {...common} d="M3 14h15l2-3h1v3M3 14v3h17v-3M7 11h6l-1-2H8zM13 12h8" />
          <circle cx="6" cy="18.5" r="1.4" {...common} />
          <circle cx="10" cy="18.5" r="1.4" {...common} />
          <circle cx="14" cy="18.5" r="1.4" {...common} />
        </>
      ) : null}
      {kind === 'vehicle' ? (
        <>
          <path {...common} d="M2 15l3-4h10l4 4v2H2zM6 11V8h5v3" />
          <circle cx="6" cy="18" r="1.4" {...common} />
          <circle cx="16" cy="18" r="1.4" {...common} />
        </>
      ) : null}
      {kind === 'artillery' ? (
        <>
          <path {...common} d="M3 15h9l1-2h2v2h4M3 15v2h13v-2M12 13l9-5" />
          <circle cx="6" cy="18" r="1.3" {...common} />
          <circle cx="11" cy="18" r="1.3" {...common} />
        </>
      ) : null}
      {kind === 'jet' ? (
        <path {...common} d="M2 12l8-1 4-6h1l-1.5 6h6l2-2h1L21 12l1.5 3h-1l-2-2h-6l1.5 6h-1l-4-6z" />
      ) : null}
      {kind === 'helicopter' ? (
        <>
          <path {...common} d="M3 7h18M12 7v3M5 13c0-1.5 2-3 6-3s7 1 8 2v2c0 1-1 2-3 2H8c-3 0-5-1-5-3z" />
          <path {...common} d="M12 16v3H9m3-3h4M6 12V9" />
        </>
      ) : null}
      {kind === 'ship' ? (
        <>
          <path {...common} d="M3 15h16l-2 4H6zM6 15V8h4l3 4M13 12h4v3M10 8V5" />
          <path {...common} d="M4 21c1-.6 2-.6 3 0s2 .6 3 0 2-.6 3 0 2 .6 3 0 2-.6 3 0" />
        </>
      ) : null}
      {kind === 'submarine' ? (
        <>
          <path {...common} d="M3 13c3-3 14-3 18 0-4 3-15 3-18 0zM12 10V6h2v4M6 13v2M18 12.5l2-1M20 13.5l-2-1" />
        </>
      ) : null}
    </svg>
  );
}

function Meter({
  label,
  note,
  percent,
  color,
}: {
  label: string;
  note: string;
  percent: number;
  color: string;
}) {
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between font-sans text-[9px] font-medium uppercase tracking-[0.08em] text-neutral-500">
        <span>{label}</span>
        <span className="tabular-nums text-neutral-300">{note}</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.min(100, Math.max(percent, 2))}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function EquipmentCard({
  item,
  accent,
  shareBase,
  visual,
}: {
  item: MilitaryInventoryItem;
  accent: string;
  shareBase?: number;
  visual?: CountryEquipmentVisual;
}) {
  const readyPercent = item.ready == null || item.total === 0 ? null : Math.round((item.ready / item.total) * 100);
  const share = shareBase && item.total > 0 ? Number(((item.total / shareBase) * 100).toFixed(1)) : null;
  const icon = itemIcon(item.key);

  return (
    <div className="group flex min-h-[238px] flex-col overflow-hidden rounded-md border border-line bg-surface-metric shadow-card">
      <div
        className="relative grid h-32 place-items-center overflow-hidden border-b border-white/[0.05] bg-neutral-950"
        style={{
          color: accent,
          backgroundImage: `linear-gradient(145deg, ${accent}22, transparent 62%), linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)`,
          backgroundSize: 'auto, 18px 18px, 18px 18px',
        }}
      >
        {visual ? (
          <>
            <img
              src={visual.image}
              alt={`${visual.platform} — representative ${item.label.toLowerCase()} platform`}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/20" />
            <a
              href={visual.imageSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute right-2 top-2 rounded bg-black/65 px-1.5 py-1 font-sans text-[8px] font-semibold uppercase tracking-[0.1em] text-neutral-300 backdrop-blur-sm hover:text-white"
              aria-label={`View image source for ${visual.platform}`}
            >
              Photo source ↗
            </a>
            <a
              href={visual.pageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-2 left-3 right-3 line-clamp-2 font-sans text-[10px] font-semibold uppercase tracking-[0.1em] text-white drop-shadow hover:text-[var(--uk-accent)]"
            >
              {visual.platform}
            </a>
          </>
        ) : (
          <>
            <EquipmentIcon kind={icon} className="h-14 w-14 opacity-75 transition duration-300 group-hover:scale-105 group-hover:opacity-100" />
            <span className="absolute bottom-2 left-3 font-sans text-[8px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Equipment image pending
            </span>
          </>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3">
        <p className="font-sans text-[12px] font-semibold leading-tight text-neutral-100">{item.label}</p>
        {visual ? <p className="mt-0.5 truncate font-sans text-[9px] text-neutral-500">{visual.platform}</p> : null}
        <div className="mt-1 flex items-baseline justify-between gap-2">
          <span className="font-sans text-[26px] font-semibold leading-none tracking-tight tabular-nums text-neutral-50">
            {formatNumber(item.total)}
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
          {readyPercent != null && item.ready != null ? (
            <Meter
              label="Estimated ready"
              note={`${formatNumber(item.ready)} · ${readyPercent}%`}
              percent={readyPercent}
              color="#4ade80"
            />
          ) : null}
          {share != null ? (
            <Meter label="Share of branch" note={`${share}%`} percent={share} color={accent} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent,
  title,
}: {
  label: string;
  value: string;
  sub: string;
  accent?: string;
  title?: string;
}) {
  return (
    <div className="flex flex-col rounded-md border border-line bg-surface-metric p-3.5 shadow-card sm:p-4" title={title}>
      <p className="font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-500">{label}</p>
      <p
        className="mt-2 font-sans text-2xl font-semibold leading-none tracking-tight tabular-nums sm:text-3xl"
        style={{ color: accent ?? 'var(--fg)' }}
      >
        {value}
      </p>
      <p className="mt-1.5 font-sans text-[10px] font-medium leading-snug text-neutral-500">{sub}</p>
    </div>
  );
}

function CountryProfileImages({
  countryName,
  images,
  rankLabel,
  sourceUrl,
}: {
  countryName: string;
  images: Partial<MilitaryCountryImages>;
  rankLabel: string;
  sourceUrl: string;
}) {
  return (
    <div className="grid overflow-hidden rounded-md border border-line bg-surface-metric shadow-card lg:grid-cols-[minmax(0,3fr)_minmax(230px,2fr)]">
      {images.map ? (
        <div className="relative min-h-56 overflow-hidden bg-neutral-950 lg:min-h-64">
          <img
            src={images.map}
            alt={`${countryName} geographic military profile map from Global Firepower`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
          <span className="absolute bottom-3 left-3 rounded bg-black/60 px-2 py-1 font-sans text-[9px] font-semibold uppercase tracking-[0.14em] text-neutral-200 backdrop-blur-sm">
            Strategic profile map
          </span>
        </div>
      ) : null}

      <div className="flex min-h-44 flex-col justify-between gap-5 p-4 sm:p-5">
        <div>
          <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Global Firepower · 2026
          </p>
          <p className="mt-2 font-sans text-xl font-semibold tracking-tight text-neutral-100">{countryName}</p>
          <p className="mt-1 font-sans text-[11px] leading-relaxed text-neutral-500">{rankLabel}</p>
        </div>

        <div className="flex items-end justify-between gap-3">
          {images.flag ? (
            <img
              src={images.flag}
              alt={`${countryName} national flag from Global Firepower`}
              loading="lazy"
              decoding="async"
              className="h-[42px] w-[66px] rounded-sm border border-white/15 object-cover shadow-lg"
            />
          ) : (
            <span />
          )}
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--uk-accent)] hover:text-neutral-200"
          >
            Image source ↗
          </a>
        </div>
      </div>
    </div>
  );
}

function branchViews(data: RankedMilitaryCountryData): BranchView[] {
  const airItems = data.airForce.items.filter((item) => item.total > 0);
  const armyItems = data.army.items.filter((item) => item.total > 0);
  const navyItems = data.navy.items.filter((item) => item.total > 0);
  const tanks = data.army.items.find((item) => item.key === 'tanks')?.total ?? 0;
  const vehicles = data.army.items.find((item) => item.key === 'vehicles')?.total ?? 0;
  const armyCombatBase = data.army.items
    .filter((item) => item.key !== 'vehicles')
    .reduce((sum, item) => sum + item.total, 0);

  return [
    {
      id: 'army',
      title: 'Army',
      accent: ARMY_ACCENT,
      headline: `${formatNumber(tanks)} tanks · ${formatNumber(vehicles)} armored vehicles`,
      blurb: 'Land warfare inventory, armor and artillery.',
      items: armyItems,
      shareBase: armyCombatBase || undefined,
    },
    {
      id: 'navy',
      title: 'Navy',
      accent: NAVY_ACCENT,
      headline: `${formatNumber(data.navy.total)} naval assets`,
      blurb: data.navy.total > 0 ? 'Commissioned surface, submarine and mine-warfare assets.' : 'No standing naval assets reported.',
      items: navyItems,
      shareBase: data.navy.total || undefined,
    },
    {
      id: 'airforce',
      title: 'Air Force',
      accent: AIR_ACCENT,
      headline: `${formatNumber(data.airForce.total)} aircraft & helicopters`,
      blurb: 'Fixed-wing, rotary-wing and mission-support aviation.',
      items: airItems,
      shareBase: data.airForce.total || undefined,
    },
  ];
}

function BranchSection({
  branch,
  equipment,
  collapseSignal,
  expandSignal,
}: {
  branch: BranchView;
  equipment: Record<string, CountryEquipmentVisual>;
  collapseSignal?: number;
  expandSignal?: number;
}) {
  const branchIcon = branch.id === 'army' ? 'tank' : branch.id === 'navy' ? 'ship' : 'jet';
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
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-line bg-surface-metric/60 px-3.5 py-2.5">
          <div className="flex items-center gap-2.5">
            <span
              className="grid h-8 w-8 place-items-center rounded-md"
              style={{ backgroundColor: `${branch.accent}1f`, color: branch.accent }}
            >
              <EquipmentIcon kind={branchIcon} className="h-5 w-5" />
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
            {branch.items.length} active categories
          </span>
        </div>

        {branch.items.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {branch.items.map((item) => (
              <EquipmentCard
                key={item.key}
                item={item}
                accent={branch.accent}
                shareBase={item.key === 'vehicles' ? undefined : branch.shareBase}
                visual={equipment[item.key]}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-line bg-white/[0.015] px-4 py-8 text-center">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500">
              No assets reported in this branch
            </p>
          </div>
        )}
      </div>
    </CollapsibleFlagSection>
  );
}

function RankedMilitarySection({
  data,
  collapseSignal,
  expandSignal,
  headerControls,
}: {
  data: RankedMilitaryCountryData;
  collapseSignal?: number;
  expandSignal?: number;
  headerControls?: ReactNode;
}) {
  const branches = branchViews(data);
  const equipment = COUNTRY_MILITARY_EQUIPMENT[data.iso3] ?? {};
  const categoryCount = branches.reduce((sum, branch) => sum + branch.items.length, 0);

  return (
    <CollapsibleFlagSection
      title="Military"
      count={categoryCount}
      defaultOpen
      anchorId="country-section-military"
      ribbonExpandKey="main:military"
      headerControls={headerControls}
      collapseSignal={collapseSignal}
      expandSignal={expandSignal}
    >
      <div className="flex flex-col gap-4">
        <CountryProfileImages
          countryName={data.name}
          images={data.images}
          rankLabel={`Ranked #${data.rank} of ${data.rankTotal} military powers`}
          sourceUrl={data.sourceUrl}
        />

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          <StatCard label="Global rank" value={`#${data.rank}`} sub={`of ${data.rankTotal} (GFP 2026)`} />
          <StatCard label="Power Index" value={data.powerIndex.toFixed(4)} sub="Lower is stronger (0 = perfect)" />
          <StatCard label="Active personnel" value={formatNumber(data.activePersonnel)} sub="Current active service" />
          <StatCard label="Reserve" value={formatNumber(data.reservePersonnel)} sub="Active reserve personnel" />
          <StatCard
            label="Defense budget"
            value={compactUsdFormatter.format(data.defenseBudgetUsd)}
            sub="Annual budget (USD)"
            accent="#4ade80"
            title={`$${formatNumber(data.defenseBudgetUsd)} USD`}
          />
        </div>

        {branches.map((branch) => (
          <BranchSection
            key={branch.id}
            branch={branch}
            equipment={equipment}
            collapseSignal={collapseSignal}
            expandSignal={expandSignal}
          />
        ))}

        <p className="font-sans text-[10px] leading-relaxed text-neutral-600">
          Source:{' '}
          <a
            href={data.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--uk-accent)] hover:text-neutral-200"
          >
            Global Firepower — {data.name} (2026)
          </a>
          {data.reviewed ? ` · profile reviewed ${data.reviewed}` : ''}. GFP readiness values are modeled estimates; equipment
          categories can overlap (for example, attack helicopters are included in the helicopter fleet).
        </p>
      </div>
    </CollapsibleFlagSection>
  );
}

export const CountryMilitarySection = memo(function CountryMilitarySection({
  iso3,
  countryName,
  collapseSignal,
  expandSignal,
  headerControls,
}: {
  iso3: string;
  countryName: string;
  collapseSignal?: number;
  expandSignal?: number;
  headerControls?: ReactNode;
}) {
  const data = COUNTRY_MILITARY_DATA[iso3.toUpperCase()];
  if (data?.status === 'ranked') {
    return (
      <RankedMilitarySection
        data={data}
        collapseSignal={collapseSignal}
        expandSignal={expandSignal}
        headerControls={headerControls}
      />
    );
  }

  const sourceUrl = data?.sourceUrl ?? 'https://www.globalfirepower.com/countries-listing.php';
  const displayName = data?.name ?? countryName;
  return (
    <CollapsibleFlagSection
      title="Military"
      count={0}
      defaultOpen
      anchorId="country-section-military"
      ribbonExpandKey="main:military"
      headerControls={headerControls}
      collapseSignal={collapseSignal}
      expandSignal={expandSignal}
    >
      <div className="flex flex-col gap-4">
        {data?.images ? (
          <CountryProfileImages
            countryName={displayName}
            images={data.images}
            rankLabel="Not included in the 2026 Global Firepower ranking"
            sourceUrl={sourceUrl}
          />
        ) : null}
        <div className="rounded-md border border-line bg-surface-metric p-5 shadow-card sm:p-6">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-white/[0.04] text-neutral-500">
              <EquipmentIcon kind="tank" className="h-6 w-6" />
            </span>
            <div>
              <p className="font-sans text-sm font-semibold text-neutral-100">Not ranked by Global Firepower</p>
              <p className="mt-1 max-w-2xl font-sans text-[11px] leading-relaxed text-neutral-500">
                {displayName} is not included in Global Firepower&rsquo;s 2026 review of 145 military powers, so no GFP
                Power Index, readiness, personnel, or equipment figures are available for this page.
              </p>
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--uk-accent)] hover:text-neutral-200"
              >
                View the 2026 Global Firepower country list ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </CollapsibleFlagSection>
  );
});
