import { memo, useState, type CSSProperties, type ReactNode } from 'react';
import { CollapsibleFlagSection } from './CollapsibleFlagSection';

/**
 * Germany military strength.
 *
 * Equipment counts, combat-ready figures, personnel, budget and the global
 * PowerIndex rank come from GlobalFirePower's 2026 Germany profile. Cyberspace
 * is NOT rated by GlobalFirePower — those figures are the Bundeswehr's Cyber and
 * Information Domain Service (CIR), which in 2024 was elevated to Germany's
 * fourth military branch alongside the Army, Navy and Air Force.
 *
 * Equipment photographs are hot-linked from Wikimedia Commons (CC BY-SA /
 * public domain). Each image degrades to an inline SVG silhouette if it fails
 * to load, so the layout never breaks.
 */

const GFP_SOURCE_URL = 'https://www.globalfirepower.com/country-military-strength-detail.php?country_id=germany';
const CIR_SOURCE_URL = 'https://www.bundeswehr.de/en/organization/the-cyber-and-information-domain-service';

type IconKind = 'tank' | 'afv' | 'artillery' | 'mlrs' | 'jet' | 'heli' | 'ship' | 'sub' | 'cyber';

type EquipItem = {
  key: string;
  name: string;
  platform: string;
  total: number;
  /** GlobalFirePower "combat-ready" count, where published. */
  ready?: number;
  image?: string;
  icon: IconKind;
  /** Broad support/transport category (e.g. GFP "armored vehicles") — excluded from fleet-share. */
  support?: boolean;
};

type Branch = {
  id: 'army' | 'navy' | 'airforce';
  title: string;
  accent: string;
  headline: string;
  blurb: string;
  items: EquipItem[];
};

const IMG = {
  leopard2:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Leopard_2_A7V_313_Bad_Frankenhausen_2024.JPG/960px-Leopard_2_A7V_313_Bad_Frankenhausen_2024.JPG',
  puma: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Puma%2C_first_series.jpg/960px-Puma%2C_first_series.jpg',
  pzh2000:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Lithuanian_PzH_2000_%282%29.jpg/960px-Lithuanian_PzH_2000_%282%29.jpg',
  m270: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/M270A1_Multiple_Launch_Rocket_System_South_Dakota_ANG.jpg/960px-M270A1_Multiple_Launch_Rocket_System_South_Dakota_ANG.jpg',
  frigate:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/BADEN-WURTTEMBERG_00257_%28cropped%29.jpg/960px-BADEN-WURTTEMBERG_00257_%28cropped%29.jpg',
  submarine: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/U_34_in_Fahrt.jpg/960px-U_34_in_Fahrt.jpg',
  corvette:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/F264_FGS_Ludwigshafen_am_Rhein_%2830156595011%29.jpg/960px-F264_FGS_Ludwigshafen_am_Rhein_%2830156595011%29.jpg',
  patrol: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Hafengeburtstag_2015_P_6122.jpg/960px-Hafengeburtstag_2015_P_6122.jpg',
  mine: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/M1064_Gr%C3%B6mitz_1.jpg/960px-M1064_Gr%C3%B6mitz_1.jpg',
  fighter:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/RAF_Eurofighter_EF-2000_Typhoon_F2_Lofting-1.jpg/960px-RAF_Eurofighter_EF-2000_Typhoon_F2_Lofting-1.jpg',
  tornado:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/RAF_Tornado_GR4_MOD_45155233.jpg/960px-RAF_Tornado_GR4_MOD_45155233.jpg',
  transport:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/German_Air_Force_Airbus_A400M_%28out_cropped%29.jpg/960px-German_Air_Force_Airbus_A400M_%28out_cropped%29.jpg',
  special:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/US_Navy_P-8_Poseidon_taking_off_at_Perth_Airport.jpg/960px-US_Navy_P-8_Poseidon_taking_off_at_Perth_Airport.jpg',
  tanker:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/KC-30_A39-002_refuelling_an_USAF_F-16_%28cropped%29.jpg/960px-KC-30_A39-002_refuelling_an_USAF_F-16_%28cropped%29.jpg',
  trainer:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Grob_120_TP-A_%E2%80%98D-ETPX%E2%80%99.jpg/960px-Grob_120_TP-A_%E2%80%98D-ETPX%E2%80%99.jpg',
  helicopter:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/French_Navy_NH90_lands_on_USS_Antietam_%28CG-54%29_in_the_Bay_of_Bengal_%28cropped%29.jpg/960px-French_Navy_NH90_lands_on_USS_Antietam_%28CG-54%29_in_the_Bay_of_Bengal_%28cropped%29.jpg',
  attackHeli:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/20170810034242%21Eurocopter_EC-665_Tiger_UHT%2C_Germany_-_Army_AN1547188_%282%29.jpg/960px-20170810034242%21Eurocopter_EC-665_Tiger_UHT%2C_Germany_-_Army_AN1547188_%282%29.jpg',
} as const;

const ARMY_ACCENT = '#8aa35b';
const NAVY_ACCENT = '#4f8ff0';
const AIR_ACCENT = '#38bdf8';
const CYBER_ACCENT = '#a78bfa';

const BRANCHES: Branch[] = [
  {
    id: 'army',
    title: 'Army',
    accent: ARMY_ACCENT,
    headline: '296 tanks · 87,338 armored vehicles',
    blurb: 'Heer land forces — armor, mechanized infantry and artillery.',
    items: [
      { key: 'tanks', name: 'Main Battle Tanks', platform: 'Leopard 2 A7V', total: 296, ready: 222, image: IMG.leopard2, icon: 'tank' },
      {
        key: 'afv',
        name: 'Armored Vehicles',
        platform: 'Puma · Boxer · APC/IFV',
        total: 87338,
        ready: 65504,
        image: IMG.puma,
        icon: 'afv',
        support: true,
      },
      { key: 'spg', name: 'Self-Propelled Artillery', platform: 'PzH 2000', total: 134, ready: 101, image: IMG.pzh2000, icon: 'artillery' },
      { key: 'mlrs', name: 'Rocket Artillery (MLRS)', platform: 'MARS II / M270', total: 33, ready: 25, image: IMG.m270, icon: 'mlrs' },
    ],
  },
  {
    id: 'navy',
    title: 'Navy',
    accent: NAVY_ACCENT,
    headline: '96 naval assets',
    blurb: 'Deutsche Marine — surface fleet, submarines and mine warfare.',
    items: [
      { key: 'patrol', name: 'Patrol Vessels', platform: 'Fast attack / patrol craft', total: 54, image: IMG.patrol, icon: 'ship' },
      { key: 'mine', name: 'Mine Warfare', platform: 'Frankenthal-class', total: 12, image: IMG.mine, icon: 'ship' },
      { key: 'frigates', name: 'Frigates', platform: 'F125 · F123 · F124', total: 11, image: IMG.frigate, icon: 'ship' },
      { key: 'subs', name: 'Submarines', platform: 'Type 212A', total: 6, image: IMG.submarine, icon: 'sub' },
      { key: 'corvettes', name: 'Corvettes', platform: 'K130 Braunschweig', total: 6, image: IMG.corvette, icon: 'ship' },
    ],
  },
  {
    id: 'airforce',
    title: 'Air Force',
    accent: AIR_ACCENT,
    headline: '569 aircraft & helicopters',
    blurb: 'Luftwaffe — fighters, transport, rotary and support aviation.',
    items: [
      { key: 'heli', name: 'Helicopters', platform: 'NH90 · CH-53 · H145M', total: 292, ready: 219, image: IMG.helicopter, icon: 'heli' },
      { key: 'fighters', name: 'Fighters', platform: 'Eurofighter Typhoon', total: 127, ready: 95, image: IMG.fighter, icon: 'jet' },
      { key: 'attack', name: 'Attack Aircraft', platform: 'Panavia Tornado', total: 63, ready: 47, image: IMG.tornado, icon: 'jet' },
      { key: 'transport', name: 'Transport Aircraft', platform: 'A400M Atlas', total: 55, ready: 41, image: IMG.transport, icon: 'jet' },
      { key: 'attackHeli', name: 'Attack Helicopters', platform: 'Eurocopter Tiger', total: 49, ready: 37, image: IMG.attackHeli, icon: 'heli' },
      { key: 'special', name: 'Special-Mission', platform: 'P-8A Poseidon', total: 27, ready: 20, image: IMG.special, icon: 'jet' },
      { key: 'trainer', name: 'Trainers', platform: 'Grob G 120TP', total: 16, ready: 12, image: IMG.trainer, icon: 'jet' },
      { key: 'tanker', name: 'Tanker Fleet', platform: 'A330 MRTT', total: 3, ready: 2, image: IMG.tanker, icon: 'jet' },
    ],
  },
];

const CYBER_PERSONNEL = 14028;
const ACTIVE_PERSONNEL = 184324;

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
  const share = item.support ? null : Number(((item.total / shareBase) * 100).toFixed(1));
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
  collapseSignal,
  expandSignal,
}: {
  branch: Branch;
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
        <p className="font-sans text-[10px] leading-relaxed text-neutral-600">
          Counts &amp; combat-ready figures: GlobalFirePower 2026. &ldquo;Share of fleet&rdquo; is each system&rsquo;s
          percentage of its branch&rsquo;s combat platforms (broad support/transport vehicles excluded).
        </p>
      </div>
    </CollapsibleFlagSection>
  );
}

function CyberspaceSection({
  collapseSignal,
  expandSignal,
}: {
  collapseSignal?: number;
  expandSignal?: number;
}) {
  const shareOfForces = ((CYBER_PERSONNEL / ACTIVE_PERSONNEL) * 100).toFixed(1);
  const domains = [
    { name: 'Cyber defense', note: 'Network & weapons-system security' },
    { name: 'Electronic warfare', note: 'Jamming, spectrum & signals' },
    { name: 'Military intelligence', note: 'SIGINT & analysis' },
    { name: 'Geoinformation', note: 'Mapping, geodata & environment' },
    { name: 'Operational comms', note: 'Command & IT networks' },
  ];
  return (
    <CollapsibleFlagSection
      title="Cyberspace"
      count={5}
      defaultOpen
      uppercaseTitle
      anchorId="country-sub-military-cyberspace"
      ribbonExpandKey="sub:military:cyberspace"
      collapseSignal={collapseSignal}
      expandSignal={expandSignal}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2.5 rounded-md border border-line bg-surface-metric/60 px-3.5 py-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-md" style={{ backgroundColor: `${CYBER_ACCENT}1f`, color: CYBER_ACCENT }}>
            <EquipIcon kind="cyber" className="h-5 w-5" />
          </span>
          <div>
            <p className="font-sans text-[13px] font-semibold leading-tight text-neutral-100">
              Cyber &amp; Information Domain Service (CIR)
            </p>
            <p className="font-sans text-[10px] leading-snug text-neutral-500">
              Germany&rsquo;s 4th military branch since 2024 — not rated by GlobalFirePower.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Personnel" value="~14,000" sub="Active CIR soldiers (Jan 2024); ~16k incl. civilians" accent={CYBER_ACCENT} />
          <StatCard label="Share of active force" value={`${shareOfForces}%`} sub="of 184,324 active Bundeswehr personnel" accent={CYBER_ACCENT} />
          <StatCard label="Established" value="2017" sub="Elevated to full service branch in 2024" accent={CYBER_ACCENT} />
          <StatCard label="Locations" value="18 + 1" sub="Across Germany, plus one in the UK" accent={CYBER_ACCENT} />
        </div>

        <div className="rounded-md border border-line bg-surface-metric p-3.5 shadow-card">
          <p className="font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-500">Mission domains</p>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {domains.map((d) => (
              <div key={d.name} className="flex items-start gap-2 rounded border border-white/[0.06] bg-white/[0.02] px-2.5 py-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: CYBER_ACCENT }} />
                <div>
                  <p className="font-sans text-[11px] font-semibold leading-tight text-neutral-200">{d.name}</p>
                  <p className="font-sans text-[9px] leading-snug text-neutral-500">{d.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="font-sans text-[10px] leading-relaxed text-neutral-600">
          Cyberspace figures: Bundeswehr / Cyber and Information Domain Service. GlobalFirePower does not score cyber
          forces, so these are reported separately.
        </p>
      </div>
    </CollapsibleFlagSection>
  );
}

function MilitaryOverview() {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard label="Global rank" value="#12" sub="of 145 (GlobalFirePower 2026)" />
        <StatCard label="Power Index" value="0.2463" sub="Lower is stronger (0 = perfect)" />
        <StatCard label="Active personnel" value="184,324" sub="+ 860,000 reserve" />
        <StatCard label="Reserve" value="860,000" sub="Trained reserve force" />
        <StatCard label="Defense budget" value="$127.4B" sub="Annual (2026)" accent="#4ade80" />
      </div>
    </div>
  );
}

export const GermanyMilitarySection = memo(function GermanyMilitarySection({
  collapseSignal,
  expandSignal,
  headerControls,
}: {
  collapseSignal?: number;
  expandSignal?: number;
  headerControls?: ReactNode;
}) {
  const totalSystems = BRANCHES.reduce((n, b) => n + b.items.length, 0) + 5;
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
        <MilitaryOverview />
        {BRANCHES.map((branch) => (
          <BranchSection key={branch.id} branch={branch} collapseSignal={collapseSignal} expandSignal={expandSignal} />
        ))}
        <CyberspaceSection collapseSignal={collapseSignal} expandSignal={expandSignal} />
        <p className="font-sans text-[10px] leading-relaxed text-neutral-600">
          Sources:{' '}
          <a href={GFP_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="text-[var(--uk-accent)] hover:text-neutral-200">
            GlobalFirePower — Germany (2026)
          </a>{' '}
          ·{' '}
          <a href={CIR_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="text-[var(--uk-accent)] hover:text-neutral-200">
            Bundeswehr CIR
          </a>
          . Equipment photos via Wikimedia Commons contributors (CC BY-SA / public domain); representative platforms
          shown per category.
        </p>
      </div>
    </CollapsibleFlagSection>
  );
});
