import {
  Baby,
  ExternalLink,
  ChevronUp,
  Globe2,
  GripVertical,
  Minus,
  Play,
  Plus,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MutableRefObject,
  type PointerEvent,
  type ReactNode,
} from 'react';
import {
  GLOBE_NEWS,
  GLOBE_NEWS_CHANNELS,
  type GlobeNewsChannel,
  type GlobeNewsIso,
} from '../data/globeNews';
import {
  GLOBAL_EVENT_NEWS,
  GLOBAL_EVENT_TOPICS,
  type GlobalEventStory,
} from '../data/globalEventNews';
import {
  conflictEventToStory,
  UKRAINE_MAP_SOURCES,
  type ConflictEvent,
} from '../data/conflictEvents';
import './GlobeAnalysisPanels.css';

type PanelPlacement = 'movement' | 'economy' | 'demography';

type Metric = {
  label: string;
  value: string;
  unit?: string;
};

export type GlobeNewsAnchor = {
  x: number;
  y: number;
  depth: number;
  visible: boolean;
};

export type GlobeNewsAnchorMap = Record<GlobeNewsIso, GlobeNewsAnchor>;
export type GlobeEventAnchorMap = Record<string, GlobeNewsAnchor>;
/** Read-only view onto the globe's current zoom level (`view.current.scale` in CountryGlobe). */
export type GlobeZoomRef = MutableRefObject<{ scale: number }>;

type GlobeAnalysisPanelsProps = {
  newsAnchors: MutableRefObject<GlobeNewsAnchorMap>;
  eventAnchors: MutableRefObject<GlobeEventAnchorMap>;
  conflictEvents: ConflictEvent[];
  zoomRef: GlobeZoomRef;
};

const NEWS_COUNTRIES: GlobeNewsIso[] = ['DEU', 'FRA', 'ITA'];

// ── Regional statistics ──────────────────────────────────────────────────────
// Each region aggregates only the countries this atlas actually covers — the Western bloc
// (Europe · North America · Oceania) and the four East Asia dossiers. Scope is stated on the
// panel so a reading is never passed off as global; regions we have not compiled stay `null`.
type StatRegionId = 'western' | 'eastAsia';
type StatDomainId = 'migration' | 'demography';

type StatDomain = {
  id: StatDomainId;
  label: string;
  icon: LucideIcon;
  /** First entry is the headline reading shown large by default. */
  metrics: Metric[];
};

type StatRegion = {
  id: StatRegionId;
  label: string;
  /** Human scope caption shown under the region switch. */
  scope: string;
  /** Domains with data, or `null` when the region has no data yet. */
  domains: StatDomain[] | null;
};

const STAT_REGIONS: StatRegion[] = [
  {
    id: 'western',
    label: 'Western',
    scope: 'Europe · North America · Oceania',
    domains: [
      {
        id: 'migration',
        label: 'Migration',
        icon: UsersRound,
        metrics: [
          { label: 'Immigrants', value: '165,200,000' },
          { label: 'Refugees', value: '12,480,000' },
          { label: 'Foreign students', value: '4,850,000' },
        ],
      },
      {
        id: 'demography',
        label: 'Demographics',
        icon: Baby,
        metrics: [
          { label: 'Births per year', value: '12,800,000' },
          { label: 'Fertility rate', value: '1.55', unit: 'children per woman' },
          { label: 'Birth rate', value: '10.2', unit: 'per 1,000 population' },
        ],
      },
    ],
  },
  {
    id: 'eastAsia',
    label: 'East Asia',
    scope: 'China · Japan · South Korea · Taiwan',
    // Sum of the four East Asia dossier countries, latest national releases (2024 unless noted):
    //   Foreign residents — CHN ~1.00M (UN DESA migrant stock 2020), JPN 3.77M (MOJ, end-2024),
    //     KOR 2.65M (MOJ registered foreigners), TWN 0.85M (NIA, incl. ~0.80M migrant workers).
    //   Refugees — dominated by CHN ~303k (UNHCR, long-standing Vietnamese refugee-like
    //     population); JPN, KOR and TWN together contribute only low tens of thousands.
    //   Foreign students — CHN ~400k, JPN 337k (JASSO 2024), KOR ~230k, TWN ~120k.
    //   Births — CHN 9.54M, JPN 686k, KOR 238k, TWN 135k. Fertility is births-weighted;
    //     birth rate is total births over a combined population of ~1.61bn.
    domains: [
      {
        id: 'migration',
        label: 'Migration',
        icon: UsersRound,
        metrics: [
          { label: 'Foreign residents', value: '8,270,000' },
          { label: 'Refugees', value: '310,000' },
          { label: 'Foreign students', value: '1,090,000' },
        ],
      },
      {
        id: 'demography',
        label: 'Demographics',
        icon: Baby,
        metrics: [
          { label: 'Births per year', value: '10,600,000' },
          { label: 'Fertility rate', value: '1.08', unit: 'children per woman' },
          { label: 'Birth rate', value: '6.6', unit: 'per 1,000 population' },
        ],
      },
    ],
  },
];

type AnalysisPanelProps = {
  title: string;
  code: string;
  placement: PanelPlacement;
  icon: LucideIcon;
  children: ReactNode;
};

type DragOrigin = {
  pointerX: number;
  pointerY: number;
  panelLeft: number;
  panelTop: number;
  panelWidth: number;
  panelHeight: number;
  offsetX: number;
  offsetY: number;
};

function isCompactPanelLayout() {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 860px)').matches;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.max(minimum, Math.min(value, maximum));
}

function AnalysisPanel({
  title,
  code,
  placement,
  icon: Icon,
  children,
}: AnalysisPanelProps) {
  const panelRef = useRef<HTMLElement>(null);
  const dragOrigin = useRef<DragOrigin | null>(null);
  const [collapsed, setCollapsed] = useState(() => isCompactPanelLayout());
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const constrainToViewport = useCallback(() => {
    const panel = panelRef.current;
    if (!panel || isCompactPanelLayout()) return;
    const rect = panel.getBoundingClientRect();
    const margin = 12;
    const left = clamp(rect.left, margin, window.innerWidth - rect.width - margin);
    const top = clamp(rect.top, margin, window.innerHeight - rect.height - margin);
    setOffset((current) => ({
      x: current.x + left - rect.left,
      y: current.y + top - rect.top,
    }));
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(constrainToViewport);
    window.addEventListener('resize', constrainToViewport);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', constrainToViewport);
    };
  }, [collapsed, constrainToViewport]);

  const beginDrag = (event: PointerEvent<HTMLButtonElement>) => {
    if (isCompactPanelLayout()) return;
    const panel = panelRef.current;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    dragOrigin.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      panelLeft: rect.left,
      panelTop: rect.top,
      panelWidth: rect.width,
      panelHeight: rect.height,
      offsetX: offset.x,
      offsetY: offset.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    event.preventDefault();
  };

  const dragPanel = (event: PointerEvent<HTMLButtonElement>) => {
    const origin = dragOrigin.current;
    if (!origin) return;
    const margin = 12;
    const desiredLeft = origin.panelLeft + event.clientX - origin.pointerX;
    const desiredTop = origin.panelTop + event.clientY - origin.pointerY;
    const left = clamp(desiredLeft, margin, window.innerWidth - origin.panelWidth - margin);
    const top = clamp(desiredTop, margin, window.innerHeight - origin.panelHeight - margin);
    setOffset({
      x: origin.offsetX + left - origin.panelLeft,
      y: origin.offsetY + top - origin.panelTop,
    });
  };

  const endDrag = (event: PointerEvent<HTMLButtonElement>) => {
    if (!dragOrigin.current) return;
    dragOrigin.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const nudgePanel = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (isCompactPanelLayout()) return;
    const directions: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    const direction = directions[event.key];
    if (!direction) return;
    event.preventDefault();
    const distance = event.shiftKey ? 32 : 12;
    const panel = panelRef.current;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    const margin = 12;
    const left = clamp(
      rect.left + direction[0] * distance,
      margin,
      window.innerWidth - rect.width - margin,
    );
    const top = clamp(
      rect.top + direction[1] * distance,
      margin,
      window.innerHeight - rect.height - margin,
    );
    setOffset((current) => ({
      x: current.x + left - rect.left,
      y: current.y + top - rect.top,
    }));
  };

  return (
    <section
      ref={panelRef}
      className={[
        'wt-analysis-panel',
        `wt-analysis-panel--${placement}`,
        collapsed ? 'wt-analysis-panel--collapsed' : '',
        dragging ? 'wt-analysis-panel--dragging' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
      aria-label={`${title} analysis panel`}
    >
      <header className="wt-analysis-panel__header">
        <button
          type="button"
          className="wt-analysis-panel__drag"
          aria-label={`Move ${title} panel. Use arrow keys for precise movement.`}
          title="Drag panel"
          onPointerDown={beginDrag}
          onPointerMove={dragPanel}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={nudgePanel}
        >
          <GripVertical aria-hidden />
        </button>

        <div className="wt-analysis-panel__identity">
          <Icon aria-hidden />
          <span>
            <strong>{title}</strong>
            <small>{code}</small>
          </span>
        </div>

        <button
          type="button"
          className="wt-analysis-panel__collapse"
          aria-expanded={!collapsed}
          aria-label={`${collapsed ? 'Expand' : 'Collapse'} ${title} panel`}
          onClick={() => setCollapsed((current) => !current)}
        >
          {collapsed ? <Plus aria-hidden /> : <Minus aria-hidden />}
        </button>
      </header>

      {!collapsed ? <div className="wt-analysis-panel__body">{children}</div> : null}
    </section>
  );
}

/**
 * The statistics console — an instrument readout, not a marketing stat card. A region switch
 * (Western / East Asia) scopes the numbers so they are never implied to be global; domain tabs
 * swap the ledger; the primary channel reads large with the supporting channels beneath. Steel
 * signal marks state only. Regions without data show an explicit "awaiting data" plate.
 */
function RegionalStatsPanel() {
  const [regionId, setRegionId] = useState<StatRegionId>('western');
  const [domainId, setDomainId] = useState<StatDomainId>('migration');

  const region = STAT_REGIONS.find((r) => r.id === regionId) ?? STAT_REGIONS[0];
  const domain =
    region.domains?.find((d) => d.id === domainId) ?? region.domains?.[0] ?? null;

  return (
    <AnalysisPanel title="Statistics" code={region.label} placement="movement" icon={Globe2}>
      <div className="wt-stats">
        <div className="wt-stats__regions" role="tablist" aria-label="Statistics region">
          {STAT_REGIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={option.id === regionId}
              className={option.id === regionId ? 'is-selected' : undefined}
              onClick={() => setRegionId(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <p className="wt-stats__scope">
          <span>{region.scope}</span>
          <em className={region.domains ? 'is-live' : 'is-soon'}>
            {region.domains ? 'Aggregate' : 'No data'}
          </em>
        </p>

        {region.domains && domain ? (
          <>
            {region.domains.length > 1 ? (
              <div className="wt-stats__domains" role="tablist" aria-label="Statistics domain">
                {region.domains.map((option) => {
                  const DomainIcon = option.icon;
                  const active = option.id === domain.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      className={active ? 'is-selected' : undefined}
                      onClick={() => setDomainId(option.id)}
                    >
                      <DomainIcon aria-hidden />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            ) : null}

            <ul className="wt-stats__ledger" aria-label={`${domain.label} readings`}>
              {domain.metrics.map((metric, index) => (
                <li
                  key={metric.label}
                  className={
                    index === 0
                      ? 'wt-stats__reading wt-stats__reading--primary'
                      : 'wt-stats__reading'
                  }
                >
                  <span className="wt-stats__reading-label">{metric.label}</span>
                  <span className="wt-stats__reading-value">
                    <b>{metric.value}</b>
                    {metric.unit ? <small>{metric.unit}</small> : null}
                  </span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="wt-stats__empty">
            <p className="wt-stats__empty-code">Awaiting data</p>
            <p className="wt-stats__empty-caption">
              {region.label} coverage is in progress — readings appear here once compiled.
            </p>
          </div>
        )}
      </div>
    </AnalysisPanel>
  );
}

type GlobeNewsMonitorProps = {
  newsAnchors: MutableRefObject<GlobeNewsAnchorMap>;
};

type NewsMode = 'events' | 'countries';
type NewsModeChange = (mode: NewsMode) => void;

function CountryNewsToggle({
  mode,
  onChange,
}: {
  mode: NewsMode;
  onChange: NewsModeChange;
}) {
  return (
    <div className="wt-globe-news__mode-switch">
      <button
        type="button"
        aria-pressed={mode === 'countries'}
        className={mode === 'countries' ? 'is-selected' : undefined}
        onClick={() => onChange(mode === 'countries' ? 'events' : 'countries')}
      >
        Country news
      </button>
    </div>
  );
}

function CountryNewsMonitor({
  newsAnchors,
  onModeChange,
}: GlobeNewsMonitorProps & { onModeChange: NewsModeChange }) {
  const [channel, setChannel] = useState<GlobeNewsChannel>('Economic');
  const [mobileCountry, setMobileCountry] = useState<GlobeNewsIso>('DEU');
  const boxRefs = useRef<Record<GlobeNewsIso, HTMLAnchorElement | null>>({
    DEU: null,
    FRA: null,
    ITA: null,
  });
  const lineRefs = useRef<Record<GlobeNewsIso, SVGPathElement | null>>({
    DEU: null,
    FRA: null,
    ITA: null,
  });
  const boxSizes = useRef<Record<GlobeNewsIso, { width: number; height: number }>>({
    DEU: { width: 312, height: 132 },
    FRA: { width: 312, height: 132 },
    ITA: { width: 312, height: 132 },
  });
  const lastTransforms = useRef<Record<GlobeNewsIso, string>>({
    DEU: '',
    FRA: '',
    ITA: '',
  });

  useEffect(() => {
    lastTransforms.current = { DEU: '', FRA: '', ITA: '' };
    const observer = new ResizeObserver(() => {
      for (const iso of NEWS_COUNTRIES) {
        const box = boxRefs.current[iso];
        if (!box) continue;
        const rect = box.getBoundingClientRect();
        boxSizes.current[iso] = { width: rect.width, height: rect.height };
      }
    });
    for (const iso of NEWS_COUNTRIES) {
      const box = boxRefs.current[iso];
      if (box) observer.observe(box);
    }
    return () => observer.disconnect();
  }, [channel]);

  useEffect(() => {
    let frame = 0;
    let lastPositionedAt = 0;

    const positionStories = (now: number) => {
      if (now - lastPositionedAt < 32) {
        frame = window.requestAnimationFrame(positionStories);
        return;
      }
      lastPositionedAt = now;
      const compact = window.innerWidth <= 860;
      const offsets: Record<GlobeNewsIso, { x: number; y: number }> = {
        DEU: { x: 76, y: -184 },
        FRA: { x: -356, y: -104 },
        ITA: { x: 96, y: 72 },
      };

      for (const iso of NEWS_COUNTRIES) {
        const box = boxRefs.current[iso];
        const line = lineRefs.current[iso];
        const anchor = newsAnchors.current[iso];
        if (!box || !line) continue;

        const mobileHidden = compact && iso !== mobileCountry;
        if (!anchor.visible || mobileHidden || (!compact && anchor.depth < 0.22)) {
          box.style.opacity = '0';
          box.style.pointerEvents = 'none';
          line.style.opacity = '0';
          continue;
        }

        const { width: boxWidth, height: boxHeight } = boxSizes.current[iso];
        const x = compact
          ? (window.innerWidth - boxWidth) / 2
          : anchor.x + offsets[iso].x;
        const y = compact
          ? 92
          : anchor.y + offsets[iso].y;

        const layerScale = compact ? 1 : 0.9 + clamp(anchor.depth, 0, 1) * 0.1;
        const transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0) scale(${layerScale.toFixed(3)})`;
        if (lastTransforms.current[iso] !== transform) {
          box.style.transform = transform;
          lastTransforms.current[iso] = transform;
        }
        box.style.opacity = String(compact ? 1 : 0.68 + clamp(anchor.depth, 0, 1) * 0.32);
        box.style.pointerEvents = 'auto';

        const targetX = clamp(anchor.x, x, x + boxWidth);
        const targetY = clamp(anchor.y, y, y + boxHeight);
        const elbowX = anchor.x + (targetX - anchor.x) * 0.55;
        line.setAttribute(
          'd',
          `M ${anchor.x.toFixed(1)} ${anchor.y.toFixed(1)} L ${elbowX.toFixed(1)} ${anchor.y.toFixed(1)} L ${targetX.toFixed(1)} ${targetY.toFixed(1)}`,
        );
        line.style.opacity = '1';
      }

      frame = window.requestAnimationFrame(positionStories);
    };

    frame = window.requestAnimationFrame(positionStories);
    return () => window.cancelAnimationFrame(frame);
  }, [channel, mobileCountry, newsAnchors]);

  return (
    <section className="wt-globe-news" aria-label="Country news">
      <svg className="wt-globe-news__lines" aria-hidden>
        {NEWS_COUNTRIES.map((iso) => (
          <path
            key={iso}
            ref={(node) => {
              lineRefs.current[iso] = node;
            }}
          />
        ))}
      </svg>

      <div className="wt-globe-news__stories" role="tabpanel" aria-live="polite">
        {GLOBE_NEWS[channel].map((story) => (
          <a
            key={`${channel}-${story.iso}`}
            ref={(node) => {
              boxRefs.current[story.iso] = node;
            }}
            className="wt-globe-news__story"
            href={story.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${story.country}: ${story.headline}. Opens ${story.source} in a new tab.`}
          >
            <span className="wt-globe-news__story-meta">
              <strong>{story.country}</strong>
              <span>{story.published}</span>
            </span>
            <span className="wt-globe-news__story-headline">{story.headline}</span>
            <span className="wt-globe-news__story-source">
              {story.source}
              <ExternalLink aria-hidden />
            </span>
          </a>
        ))}
      </div>

      <footer className="wt-globe-news__footer">
        <CountryNewsToggle mode="countries" onChange={onModeChange} />
        <div className="wt-globe-news__country-switcher" aria-label="Choose a country story">
          {GLOBE_NEWS[channel].map((story) => (
            <button
              key={story.iso}
              type="button"
              className={mobileCountry === story.iso ? 'is-selected' : undefined}
              aria-pressed={mobileCountry === story.iso}
              onClick={() => setMobileCountry(story.iso)}
            >
              {story.country}
            </button>
          ))}
        </div>

        <div className="wt-globe-news__channels" role="tablist" aria-label="News categories">
          {GLOBE_NEWS_CHANNELS.map((option) => (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={channel === option}
              className={channel === option ? 'is-selected' : undefined}
              onClick={() => setChannel(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </footer>
    </section>
  );
}

/**
 * News / conflict story cards stay hidden until the viewer zooms in close enough to read
 * them — see the reveal check in {@link EventNewsMonitor}'s positioning loop. With no topic
 * filter, every story from every topic is on the globe at once; this gate is what keeps
 * that from reading as a smear of dots instead of precise, readable annotations.
 *
 * Must stay in lockstep with MapGlobe's EVENT_PIN_MIN_ZOOM (map z=5.5) for news/EONET/OSINT
 * pins. Russo-Ukraine war event dots + hover cards use MapGlobe's WAR_EVENT_MIN_ZOOM (~3.8)
 * and are not gated here. Israel–Iran conflict dots use IRAN_ISRAEL_EVENT_MIN_ZOOM (~5)
 * on MapGlobe and are likewise not gated by this news-card reveal.
 *
 * MapGlobe writes canvas-scale via `2 * 2^(zoom - 1.4)` into zoomRef; this is that scale at
 * z=5.5. Keep the 1.4 offset in lockstep with MapGlobe's INITIAL_ZOOM.
 */
const EVENT_REVEAL_ZOOM = 2 * 2 ** (5.5 - 1.4);
const EVENT_REVEAL_DEPTH = 0.62;

const TWEET_EMBED_ORIGIN = 'https://platform.twitter.com';
const TWEET_EMBED_FALLBACK_HEIGHT = 420;

/**
 * X posts are framed straight from platform.twitter.com rather than through the widgets
 * script, so no third-party JS runs on the globe. The frame reports its rendered height back
 * over postMessage; until it does, the fallback height keeps the card from collapsing.
 */
function TweetEmbed({ tweetId, title }: { tweetId: string; title: string }) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(TWEET_EMBED_FALLBACK_HEIGHT);

  useEffect(() => {
    const readHeight = (event: MessageEvent) => {
      if (event.origin !== TWEET_EMBED_ORIGIN) return;
      const frame = frameRef.current;
      if (!frame || event.source !== frame.contentWindow) return;

      let payload: unknown = event.data;
      if (typeof payload === 'string') {
        try {
          payload = JSON.parse(payload);
        } catch {
          return;
        }
      }
      const measured = (
        payload as { 'twttr.embed'?: { params?: Array<{ height?: number }> } } | null
      )?.['twttr.embed']?.params?.[0]?.height;
      if (typeof measured === 'number' && measured > 0) {
        setHeight(clamp(Math.round(measured), 220, 540));
      }
    };

    window.addEventListener('message', readHeight);
    return () => window.removeEventListener('message', readHeight);
  }, []);

  return (
    <div className="wt-event-news__tweet" style={{ height }}>
      <iframe
        ref={frameRef}
        src={`${TWEET_EMBED_ORIGIN}/embed/Tweet.html?id=${tweetId}&theme=dark&dnt=true&lang=en`}
        title={title}
        loading="lazy"
        scrolling="no"
        allow="autoplay; encrypted-media; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}

function EventStoryBlock({
  story,
  elementRef,
  dragging,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onKeyDown,
}: {
  story: GlobalEventStory;
  elementRef: (node: HTMLElement | null) => void;
  dragging: boolean;
  onPointerDown: (event: PointerEvent<HTMLElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLElement>) => void;
  onPointerCancel: (event: PointerEvent<HTMLElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}) {
  const [clipOpen, setClipOpen] = useState(false);
  // Every marker is tiny now, so a live YouTube frame gets the same click-to-expand
  // treatment as an X clip — auto-embedding it at 112px wide would be unreadable and,
  // with dozens of markers potentially in view, wasteful to load unprompted.
  const hasClip = Boolean(story.tweetId || story.videoId);

  return (
    <article
      ref={elementRef}
      className={[
        'wt-event-news__story',
        'wt-event-news__story--compact',
        hasClip ? 'wt-event-news__story--clip' : '',
        clipOpen ? 'is-open' : '',
        dragging ? 'is-dragging' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      tabIndex={0}
      aria-label={`${story.headline}. Draggable event annotation; use arrow keys to reposition.`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onKeyDown={onKeyDown}
    >
      <div className="wt-globe-news__story-meta">
        <strong>
          {story.tweetId ? 'X clip' : story.format === 'video' ? 'Video' : 'Report'}
        </strong>
        <span>{story.published}</span>
      </div>

      <a
        className="wt-event-news__headline"
        href={story.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {story.headline}
      </a>

      {hasClip ? (
        <div className="wt-event-news__clip">
          <button
            type="button"
            className="wt-event-news__clip-toggle"
            aria-expanded={clipOpen}
            onClick={() => setClipOpen((open) => !open)}
          >
            {clipOpen ? <ChevronUp aria-hidden /> : <Play aria-hidden />}
            {clipOpen ? 'Hide clip' : 'Watch clip'}
          </button>
          {clipOpen && story.tweetId ? (
            <TweetEmbed tweetId={story.tweetId} title={story.headline} />
          ) : null}
          {clipOpen && !story.tweetId && story.videoId ? (
            <div className="wt-event-news__video">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${story.videoId}`}
                title={story.headline}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
              {story.duration ? <span>{story.duration}</span> : null}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="wt-event-news__source">
        <span>{story.source}</span>
        <span>{story.pinpoint.label}</span>
        <ExternalLink aria-hidden />
      </div>
    </article>
  );
}

function EventNewsMonitor({
  eventAnchors,
  conflictEvents,
  onModeChange,
  zoomRef,
}: {
  eventAnchors: MutableRefObject<GlobeEventAnchorMap>;
  conflictEvents: ConflictEvent[];
  onModeChange: NewsModeChange;
  zoomRef: GlobeZoomRef;
}) {
  const [compact, setCompact] = useState(false);
  const boxRefs = useRef<(HTMLElement | null)[]>([]);
  const lineRefs = useRef<(SVGPathElement | null)[]>([]);
  const boxSizes = useRef<Array<{ width: number; height: number }>>([]);
  const lastTransforms = useRef<string[]>([]);
  const lastPresentations = useRef<string[]>([]);
  const dragOffsets = useRef(new Map<string, { x: number; y: number }>());
  const activeDrag = useRef<{
    storyId: string;
    index: number;
    pointerId: number;
    pointerX: number;
    pointerY: number;
    cardLeft: number;
    cardTop: number;
    cardWidth: number;
    cardHeight: number;
    footerClearance: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const [draggingStoryId, setDraggingStoryId] = useState<string | null>(null);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 860px)');
    const sync = () => setCompact(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  const liveStories = useMemo(
    () => conflictEvents.map(conflictEventToStory),
    [conflictEvents],
  );
  // No topic filter — every story from every topic is on the globe at once, each a tiny
  // marker at its own geographic anchor that only reveals up close (see the reveal gate
  // below), so there is nothing to page or filter through.
  const activeStories = useMemo(
    () => [...liveStories, ...GLOBAL_EVENT_TOPICS.flatMap((t) => GLOBAL_EVENT_NEWS[t])],
    [liveStories],
  );

  const beginStoryDrag = useCallback(
    (storyId: string, index: number, event: PointerEvent<HTMLElement>) => {
      if (event.button !== 0 || event.pointerType === 'mouse' && event.buttons !== 1) return;
      const target = event.target as Element;
      if (target.closest('a, button, iframe, input, select, textarea')) return;

      const offset = dragOffsets.current.get(storyId) ?? { x: 0, y: 0 };
      const rect = event.currentTarget.getBoundingClientRect();
      activeDrag.current = {
        storyId,
        index,
        pointerId: event.pointerId,
        pointerX: event.clientX,
        pointerY: event.clientY,
        cardLeft: rect.left,
        cardTop: rect.top,
        cardWidth: rect.width,
        cardHeight: rect.height,
        footerClearance: 170 + (compact ? 116 : 100),
        offsetX: offset.x,
        offsetY: offset.y,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
      setDraggingStoryId(storyId);
      event.preventDefault();
      event.stopPropagation();
    },
    [compact],
  );

  const moveStory = useCallback((event: PointerEvent<HTMLElement>) => {
    const drag = activeDrag.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const left = clamp(
      drag.cardLeft + event.clientX - drag.pointerX,
      8,
      Math.max(8, window.innerWidth - drag.cardWidth - 8),
    );
    const top = clamp(
      drag.cardTop + event.clientY - drag.pointerY,
      8,
      Math.max(8, window.innerHeight - drag.cardHeight - drag.footerClearance),
    );
    dragOffsets.current.set(drag.storyId, {
      x: drag.offsetX + left - drag.cardLeft,
      y: drag.offsetY + top - drag.cardTop,
    });
    lastTransforms.current[drag.index] = '';
    lastPresentations.current[drag.index] = '';
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const endStoryDrag = useCallback((event: PointerEvent<HTMLElement>) => {
    const drag = activeDrag.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    activeDrag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDraggingStoryId(null);
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const nudgeStory = useCallback(
    (storyId: string, index: number, event: KeyboardEvent<HTMLElement>) => {
      if (event.target !== event.currentTarget) return;
      const directions: Partial<Record<string, readonly [number, number]>> = {
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
      };
      const direction = directions[event.key];
      if (!direction) return;
      const distance = event.shiftKey ? 24 : 8;
      const box = boxRefs.current[index];
      if (!box) return;
      const rect = box.getBoundingClientRect();
      const footerClearance = 170 + (compact ? 116 : 100);
      const left = clamp(
        rect.left + direction[0] * distance,
        8,
        Math.max(8, window.innerWidth - rect.width - 8),
      );
      const top = clamp(
        rect.top + direction[1] * distance,
        8,
        Math.max(8, window.innerHeight - rect.height - footerClearance),
      );
      const offset = dragOffsets.current.get(storyId) ?? { x: 0, y: 0 };
      dragOffsets.current.set(storyId, {
        x: offset.x + left - rect.left,
        y: offset.y + top - rect.top,
      });
      lastTransforms.current[index] = '';
      lastPresentations.current[index] = '';
      event.preventDefault();
      event.stopPropagation();
    },
    [compact],
  );

  useEffect(() => {
    boxRefs.current = boxRefs.current.slice(0, activeStories.length);
    lineRefs.current = lineRefs.current.slice(0, activeStories.length);
    lastTransforms.current = [];
    lastPresentations.current = [];
    const observer = new ResizeObserver(() => {
      boxRefs.current.forEach((box, index) => {
        if (!box) return;
        const rect = box.getBoundingClientRect();
        boxSizes.current[index] = { width: rect.width, height: rect.height };
      });
    });
    boxRefs.current.forEach((box) => {
      if (box) observer.observe(box);
    });
    return () => observer.disconnect();
  }, [activeStories]);

  useEffect(() => {
    let frame = 0;
    let lastPositionedAt = 0;

    const positionStories = (now: number) => {
      if (now - lastPositionedAt < 32) {
        frame = window.requestAnimationFrame(positionStories);
        return;
      }
      lastPositionedAt = now;
      activeStories.forEach((story, index) => {
        const box = boxRefs.current[index];
        const line = lineRefs.current[index];
        const anchor = eventAnchors.current[story.id];
        // Every marker is tiny by design and only worth reading once the viewer has
        // zoomed in close on that spot — otherwise 80+ simultaneous markers would read as
        // an unreadable smear of dots.
        const eventHidden = !(
          zoomRef.current.scale >= EVENT_REVEAL_ZOOM &&
          (anchor?.depth ?? -1) >= EVENT_REVEAL_DEPTH
        );
        if (!box || !line || !anchor?.visible || eventHidden) {
          if (lastPresentations.current[index] !== 'hidden') {
            if (box) {
              box.style.opacity = '0';
              box.style.pointerEvents = 'none';
              box.inert = true;
              box.setAttribute('aria-hidden', 'true');
            }
            if (line) line.style.opacity = '0';
            lastPresentations.current[index] = 'hidden';
          }
          return;
        }

        const measured = boxSizes.current[index] ?? { width: 112, height: 54 };
        const orbitOffsets = [
          { x: 72, y: -130 },
          { x: -360, y: -78 },
          { x: 104, y: 92 },
        ];
        const footerClearance = 170 + (compact ? 116 : 100);
        let x: number;
        let y: number;

        if (compact) {
          x = clamp(
            anchor.x - measured.width / 2 + 28,
            12,
            window.innerWidth - measured.width - 12,
          );
          y = clamp(
            anchor.y - measured.height - 42,
            86,
            window.innerHeight - measured.height - footerClearance,
          );
        } else {
          // Dozens of markers can be visible at once — cycle through the orbit slots,
          // since each box sits at its own story's anchor anyway.
          const orbit = orbitOffsets[index % orbitOffsets.length];
          x = clamp(
            anchor.x + orbit.x,
            -measured.width,
            window.innerWidth,
          );
          y = clamp(
            anchor.y + orbit.y,
            -measured.height,
            window.innerHeight - footerClearance,
          );
        }
        const dragOffset = dragOffsets.current.get(story.id);
        if (dragOffset) {
          x = clamp(
            x + dragOffset.x,
            8,
            Math.max(8, window.innerWidth - measured.width - 8),
          );
          y = clamp(
            y + dragOffset.y,
            8,
            Math.max(8, window.innerHeight - measured.height - footerClearance),
          );
        }
        const layerScale = compact ? 1 : 0.88 + clamp(anchor.depth, 0, 1) * 0.12;
        const transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0) scale(${layerScale.toFixed(3)})`;
        if (lastTransforms.current[index] !== transform) {
          box.style.transform = transform;
          lastTransforms.current[index] = transform;
        }
        const opacity = String(compact ? 1 : 0.65 + clamp(anchor.depth, 0, 1) * 0.35);

        if (box.inert) {
          box.inert = false;
          box.removeAttribute('aria-hidden');
        }

        const targetX = clamp(anchor.x, x, x + measured.width);
        const targetY = clamp(anchor.y, y, y + measured.height);
        const elbowX = anchor.x + (targetX - anchor.x) * 0.55;
        const linePath = `M ${anchor.x.toFixed(1)} ${anchor.y.toFixed(1)} L ${elbowX.toFixed(1)} ${anchor.y.toFixed(1)} L ${targetX.toFixed(1)} ${targetY.toFixed(1)}`;
        const presentation = `${transform}|${opacity}|${linePath}`;
        if (lastPresentations.current[index] === presentation) return;

        box.style.opacity = opacity;
        box.style.pointerEvents = 'auto';
        line.setAttribute('d', linePath);
        line.style.opacity = '1';
        lastPresentations.current[index] = presentation;
      });

      frame = window.requestAnimationFrame(positionStories);
    };

    frame = window.requestAnimationFrame(positionStories);
    return () => window.cancelAnimationFrame(frame);
  }, [activeStories, compact, eventAnchors, zoomRef]);

  return (
    <section className="wt-globe-news wt-event-news" aria-label="Global event coverage">
      <svg className="wt-globe-news__lines" aria-hidden>
        {activeStories.map((story, index) => (
          <path
            key={story.id}
            ref={(node) => {
              lineRefs.current[index] = node;
            }}
          />
        ))}
      </svg>

      <div role="tabpanel" aria-live="polite">
        {activeStories.map((story, index) => (
          <EventStoryBlock
            key={story.id}
            story={story}
            dragging={draggingStoryId === story.id}
            elementRef={(node) => {
              boxRefs.current[index] = node;
              if (
                node &&
                (!lastPresentations.current[index] ||
                  lastPresentations.current[index] === 'hidden')
              ) {
                node.inert = true;
                node.setAttribute('aria-hidden', 'true');
              }
            }}
            onPointerDown={(event) => beginStoryDrag(story.id, index, event)}
            onPointerMove={moveStory}
            onPointerUp={endStoryDrag}
            onPointerCancel={endStoryDrag}
            onKeyDown={(event) => nudgeStory(story.id, index, event)}
          />
        ))}
      </div>

      <footer className="wt-globe-news__footer wt-event-news__footer">
        <CountryNewsToggle mode="events" onChange={onModeChange} />
        <nav className="wt-event-news__sources" aria-label="Ukraine map sources">
          {UKRAINE_MAP_SOURCES.map((source) => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              title={`${source.label} — ${source.provider}`}
            >
              <span>{source.label}</span>
              <ExternalLink aria-hidden />
            </a>
          ))}
        </nav>
      </footer>
    </section>
  );
}

function GlobeNewsMonitor({
  newsAnchors,
  eventAnchors,
  conflictEvents,
  zoomRef,
}: GlobeAnalysisPanelsProps) {
  const [mode, setMode] = useState<NewsMode>('events');

  return mode === 'events' ? (
    <EventNewsMonitor
      eventAnchors={eventAnchors}
      conflictEvents={conflictEvents}
      onModeChange={setMode}
      zoomRef={zoomRef}
    />
  ) : (
    <CountryNewsMonitor newsAnchors={newsAnchors} onModeChange={setMode} />
  );
}

export function GlobeAnalysisPanels({
  newsAnchors,
  eventAnchors,
  conflictEvents,
  zoomRef,
}: GlobeAnalysisPanelsProps) {
  return (
    <aside className="wt-analysis-layer" aria-label="Regional statistics">
      <div className="wt-analysis-panels">
        <RegionalStatsPanel />
      </div>

      <GlobeNewsMonitor
        newsAnchors={newsAnchors}
        eventAnchors={eventAnchors}
        conflictEvents={conflictEvents}
        zoomRef={zoomRef}
      />
    </aside>
  );
}
