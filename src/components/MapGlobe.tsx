import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Map, MapMouseEvent, GeoJSONSource } from 'maplibre-gl';
import {
  GlobeAnalysisPanels,
  type GlobeEventAnchorMap,
  type GlobeNewsAnchorMap,
} from './GlobeAnalysisPanels';
import { HackerNewsCarousel } from './HackerNewsCarousel';
import { SatelliteLegend } from './SatelliteLegend';
import { SATELLITE_GROUPS } from '../data/satelliteGroups';
import { createSatelliteLayer, type SatelliteLayer } from '../lib/satelliteLayer';
import { useSatellites, type SatelliteCatalogue } from '../hooks/useSatellites';
import {
  GLOBE_MARKERS,
  type GlobeMarker,
} from '../data/globeCountries';
import { GLOBAL_EVENT_NEWS } from '../data/globalEventNews';
import {
  conflictEventToStory,
  type ConflictEvent,
  type ConflictEventsResponse,
} from '../data/conflictEvents';
import {
  EONET_CATEGORIES,
  fetchEonetCategory,
  formatEonetDate,
  type EonetEventPoint,
} from '../data/eonetEvents';
import {
  fetchOsintFeed,
  formatOsintAge,
  OSINT_CATEGORIES,
  type OsintEventPoint,
} from '../data/osintEvents';
import type { MigrationLegMode } from '../data/migrationCorridors';
import { registerReconIcons, resolveReconIcon } from '../lib/maplibreReconIcons';
import { RECON_STYLE } from '../lib/maplibreReconStyle';
import { syncTerrain } from '../lib/maplibreTerrain';
import {
  buildCorridorPaths,
  countryShapesGeoJson,
  disputedBordersGeoJson,
  eonetPointsGeoJson,
  EMPTY_FEATURE_COLLECTION,
  hasMigrationCorridors,
  migrationCorridorsGeoJson,
  migrationLabelsGeoJson,
  militaryBasesGeoJson,
  osintPointsGeoJson,
  sampleCorridor,
  sphericalDepth,
  warContestedGeoJson,
  warControlZonesGeoJson,
  warEventsGeoJson,
  warFrontlineGeoJson,
  warSettlementsGeoJson,
  israelIranEventsGeoJson,
  worldBordersGeoJson,
  type CorridorPath,
} from '../lib/mapGlobeOverlays';
import type { FlagEntry } from '../types/flag';

const MONO = "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace";
const NEWS_ISOS = ['DEU', 'FRA', 'ITA'] as const;

/** Globe fills the frame on load — zoom in for cities / 3D buildings (z14+). */
const INITIAL_CENTER: [number, number] = [15, 48];
const INITIAL_ZOOM = 1.4;
/**
 * Pulled below zero so the camera can retreat far enough to frame the orbital shells: MapLibre's
 * globe draws the planet at `worldSize / 2π` pixels, so the GEO belt (6.6 Earth radii) only fits
 * on screen once the Earth itself is ~50 px across. See {@link SATELLITE_FADE_IN_ZOOM}.
 */
const MIN_ZOOM = -1;
const MAX_ZOOM = 20;

/**
 * During active pan/zoom at city scales, hide collision-heavy symbol / DEM layers so
 * vector building tiles and extrusions win the GPU and network. Restored on moveend.
 */
const INTERACTION_HIDE_LAYERS = [
  'hillshade',
  'highway-shield',
  'airport',
  'label-street',
  'label-place-minor',
  'label-water',
] as const;
const INTERACTION_HIDE_MIN_ZOOM = 10;

/**
 * The old canvas globe measured zoom as a linear `scale` where 2 fitted the sphere to the
 * viewport; MapLibre's zoom is log2. `GlobeAnalysisPanels` still gates its event cards on
 * canvas units, so convert map zoom → scale rather than re-tuning the panel separately.
 */
const toCanvasScale = (zoom: number) => 2 * 2 ** (zoom - INITIAL_ZOOM);

/**
 * News / hazard / intel pins are unreadable as a world smear. Hide them until the camera
 * is past continent view (~z5.5); MapLibre `minzoom` skips draw entirely.
 * Keep `GlobeAnalysisPanels` EVENT_REVEAL_ZOOM in lockstep via toCanvasScale(this).
 * Russo-Ukraine war event dots use {@link WAR_EVENT_MIN_ZOOM} instead.
 * Israel–Iran / Gulf conflict dots use {@link IRAN_ISRAEL_EVENT_MIN_ZOOM}.
 */
const EVENT_PIN_MIN_ZOOM = 5.5;

/** The war territory/frontline layer is dense; below this it would be an unreadable smear. */
const WAR_REVEAL_ZOOM = 3.2;

/**
 * War event dots appear shortly after the theatre fills/frontline, so incident pins stay
 * readable while zoomed out over Ukraine — without lighting up the whole globe at z0.
 */
const WAR_EVENT_MIN_ZOOM = 3.8;

/**
 * Israel–Iran conflict pins span the Gulf / Levant region (wider than Ukraine's contact line).
 * Reveal at regional zoom — after Ukraine theatre pins, before general news/EONET/OSINT.
 */
const IRAN_ISRAEL_EVENT_MIN_ZOOM = 5;

/**
 * 1,525 installations worldwide — at globe scale the dense clusters (Japan/Korea, the Gulf,
 * eastern Europe) merge into solid blobs. Revealed after the Ukraine theatre
 * ({@link WAR_EVENT_MIN_ZOOM}) and before news/EONET/OSINT ({@link EVENT_PIN_MIN_ZOOM}), so
 * zooming in reads as territory → conflict → standing infrastructure → live incidents.
 */
const MILITARY_BASE_MIN_ZOOM = 4;

/**
 * Satellites work the opposite way to every other layer: they fade in as the camera pulls *back*.
 * Fully lit at {@link SATELLITE_FULL_ZOOM} and below, gone by here — the LEO halo hugs the limb at
 * around z2, MEO opens up near z1, and the GEO ring only fits inside the viewport below z0.
 */
const SATELLITE_FADE_IN_ZOOM = 3;
const SATELLITE_FULL_ZOOM = 1.8;

function satelliteOpacityForZoom(zoom: number): number {
  if (zoom >= SATELLITE_FADE_IN_ZOOM) return 0;
  if (zoom <= SATELLITE_FULL_ZOOM) return 1;
  return (SATELLITE_FADE_IN_ZOOM - zoom) / (SATELLITE_FADE_IN_ZOOM - SATELLITE_FULL_ZOOM);
}

const MIGRATION_MODES = ['land', 'sea', 'air'] as const;
const MIGRATION_STATUSES = ['irregular', 'regular'] as const;

/**
 * Mode-primary corridor palette for the dark recon globe (`#0b0b0d`).
 * Regular = solid mode colours; irregular = shared alert coral (dashed as a secondary cue).
 */
const MIGRATION_IRREGULAR_COLOR = '#e85d4c';
const MIGRATION_LINE_COLOR = {
  land: { regular: '#f5c14a', irregular: MIGRATION_IRREGULAR_COLOR },
  sea: { regular: '#7dd3fc', irregular: MIGRATION_IRREGULAR_COLOR },
  air: { regular: '#c4b5fd', irregular: MIGRATION_IRREGULAR_COLOR },
} as const;

/** Glyph / trail / label accents — mode hue for regular; alert coral for irregular. */
const MIGRATION_ACCENT = {
  land: '#f5c14a',
  sea: '#7dd3fc',
  air: '#c4b5fd',
  irregular: MIGRATION_IRREGULAR_COLOR,
} as const;

/** MapLibre paint: irregular status wins; otherwise mode accent. */
const MIGRATION_ACCENT_EXPR: [
  'case',
  ['==', ['get', 'status'], 'irregular'],
  string,
  ['match', ['get', 'mode'], 'sea', string, 'air', string, string],
] = [
  'case',
  ['==', ['get', 'status'], 'irregular'],
  MIGRATION_ACCENT.irregular,
  [
    'match',
    ['get', 'mode'],
    'sea',
    MIGRATION_ACCENT.sea,
    'air',
    MIGRATION_ACCENT.air,
    MIGRATION_ACCENT.land,
  ],
];

/** Travellers per corridor, spread evenly around the loop so a route reads as flow. */
const TRAVELLERS_PER_CORRIDOR = 3;
/** Samples drawn behind each traveller, fading out — the canvas globe's comet tail. */
const TRAIL_SAMPLES = 5;
/** Fraction of a corridor the trail spans. */
const TRAIL_SPAN = 0.045;
/** Seconds for one traveller to traverse a corridor end to end. */
const TRAVERSAL_MS = 14000;

/**
 * Idle cinematic globe spin — center longitude crawl in deg/min.
 * ~1.5°/min ≈ a full turn every 4 hours; perceptible as "alive" without reading as motion.
 */
const IDLE_SPIN_DEG_PER_MIN = 1.5;
/** Resume spin this long after the last user camera interaction. */
const IDLE_SPIN_RESUME_MS = 6000;
/** Skip spin once the camera leaves globe / wide-continent scale. */
const IDLE_SPIN_MAX_ZOOM = 5;

const PIN_LAYERS = [
  'wt-osint-pins',
  'wt-eonet-pins',
  'wt-war-events',
  'wt-iran-israel-events',
  'wt-military-bases',
  'wt-event-markers',
] as const;

interface MapGlobeProps {
  markers?: GlobeMarker[];
  onSelect: (flag: FlagEntry) => void;
  onPrefetchDossier?: () => void;
}

interface HoverCard {
  x: number;
  y: number;
  color: string;
  code: string;
  kind: string;
  title: string;
  body: string;
  footer: string;
  url?: string;
}

function markersGeoJson(markers: GlobeMarker[]) {
  return {
    type: 'FeatureCollection' as const,
    features: markers.map((m) => ({
      type: 'Feature' as const,
      properties: { id: m.id, label: m.label, status: m.status },
      geometry: { type: 'Point' as const, coordinates: [m.lng, m.lat] },
    })),
  };
}

/**
 * White SDF silhouettes for corridor travellers. MapLibre tints them with `icon-color`
 * (mode accents) and a dark `icon-halo` so they stay readable on bright terrain.
 * Icon-up is the travel nose for air/sea; land walkers stay viewport-upright via layer alignment.
 */
function glyphImage(mode: MigrationLegMode): ImageData | null {
  // 64px @ pixelRatio 2 → 32 logical px; shapes sit inside ±9 so the SDF halo is not clipped.
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const unit = size / 24;
  ctx.translate(size / 2, size / 2);
  ctx.scale(unit, unit);
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffffff';
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const limb = (x1: number, y1: number, x2: number, y2: number, width: number) => {
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  if (mode === 'air') {
    // Top-down jet; nose = icon up so `icon-rotate` bearing points the aircraft forward.
    ctx.beginPath();
    ctx.moveTo(0, -9.1);
    ctx.lineTo(1.2, -3.1);
    ctx.lineTo(8.7, 1.35);
    ctx.lineTo(8.5, 2.95);
    ctx.lineTo(1.35, 0.95);
    ctx.lineTo(1.45, 4.7);
    ctx.lineTo(3.85, 7.05);
    ctx.lineTo(3.45, 8.15);
    ctx.lineTo(0.75, 6.55);
    ctx.lineTo(0, 8.7);
    ctx.lineTo(-0.75, 6.55);
    ctx.lineTo(-3.45, 8.15);
    ctx.lineTo(-3.85, 7.05);
    ctx.lineTo(-1.45, 4.7);
    ctx.lineTo(-1.35, 0.95);
    ctx.lineTo(-8.5, 2.95);
    ctx.lineTo(-8.7, 1.35);
    ctx.lineTo(-1.2, -3.1);
    ctx.closePath();
    ctx.fill();
  } else if (mode === 'sea') {
    // Top-down skiff; bow = icon up so rotation matches travel direction.
    ctx.beginPath();
    ctx.moveTo(0, -9.2);
    ctx.lineTo(2.85, -3.6);
    ctx.lineTo(3.45, 2.4);
    ctx.lineTo(2.75, 7.0);
    ctx.lineTo(1.35, 8.5);
    ctx.lineTo(-1.35, 8.5);
    ctx.lineTo(-2.75, 7.0);
    ctx.lineTo(-3.45, 2.4);
    ctx.lineTo(-2.85, -3.6);
    ctx.closePath();
    ctx.fill();
    // Midships cabin — widens the silhouette so it reads as a vessel, not a needle.
    ctx.beginPath();
    ctx.moveTo(-2.15, -0.15);
    ctx.lineTo(2.15, -0.15);
    ctx.lineTo(2.15, 3.85);
    ctx.lineTo(-2.15, 3.85);
    ctx.closePath();
    ctx.fill();
  } else {
    // Compact striding walker (viewport-upright). Thick capsules beat stick strokes at ~12–20px.
    ctx.beginPath();
    ctx.arc(0, -6.35, 2.2, 0, Math.PI * 2);
    ctx.fill();
    limb(0, -4.0, 0, 1.15, 2.85);
    limb(0, -2.55, -4.05, -0.45, 2.2);
    limb(0, -2.35, 3.9, 1.0, 2.2);
    limb(0, 1.15, -3.45, 7.45, 2.5);
    limb(0, 1.15, 3.55, 7.25, 2.5);
  }

  return ctx.getImageData(0, 0, size, size);
}

export function MapGlobe({
  markers = GLOBE_MARKERS,
  onSelect,
  onPrefetchDossier,
}: MapGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const onSelectRef = useRef(onSelect);
  const onPrefetchRef = useRef(onPrefetchDossier);
  const markersRef = useRef(markers);
  const activeMigrationIso = useRef<string | null>(null);
  const corridorPaths = useRef(buildCorridorPaths());
  const [ready, setReady] = useState(false);
  const [conflictEvents, setConflictEvents] = useState<ConflictEvent[]>([]);
  const [eonetPoints, setEonetPoints] = useState<EonetEventPoint[]>([]);
  const [osintPoints, setOsintPoints] = useState<OsintEventPoint[]>([]);
  const [hoverCard, setHoverCard] = useState<HoverCard | null>(null);

  // ── Orbital shells
  const satelliteLayerRef = useRef<SatelliteLayer | null>(null);
  const satelliteVisibleRef = useRef<boolean[]>(SATELLITE_GROUPS.map(() => true));
  const [satelliteVisible, setSatelliteVisible] = useState<boolean[]>(() =>
    SATELLITE_GROUPS.map(() => true),
  );
  const [satellitesInView, setSatellitesInView] = useState(false);
  const [satelliteHover, setSatelliteHover] = useState<{
    index: number;
    x: number;
    y: number;
  } | null>(null);
  const [satelliteSelected, setSatelliteSelected] = useState<number | null>(null);
  /**
   * Mirror the satellite overlay state so the per-frame `move` handler can decide whether there
   * is anything to do with two ref reads, instead of calling setState on every pan frame.
   */
  const satelliteHoverIndexRef = useRef<number | null>(null);
  const satelliteSelectedRef = useRef<number | null>(null);
  const catalogueRef = useRef<SatelliteCatalogue | null>(null);

  const handleSatellitePositions = useCallback((positions: Float32Array) => {
    satelliteLayerRef.current?.setPositions(positions);
  }, []);
  const handleSatelliteCatalogue = useCallback((next: SatelliteCatalogue) => {
    catalogueRef.current = next;
    satelliteLayerRef.current?.setGroups(next.groups);
  }, []);
  const handleSatelliteTrack = useCallback((_index: number, track: Float32Array) => {
    satelliteLayerRef.current?.setTrack(track);
  }, []);

  const { status: satelliteStatus, catalogue, requestTrack } = useSatellites({
    // Elements only start downloading once the camera has been out far enough to see them.
    enabled: satellitesInView,
    onPositions: handleSatellitePositions,
    onCatalogue: handleSatelliteCatalogue,
    onTrack: handleSatelliteTrack,
  });

  // The map effect runs once, so its click handler reaches the current propagator through a ref.
  const requestTrackRef = useRef<(index: number | null) => void>(() => {});
  requestTrackRef.current = requestTrack;

  const toggleSatelliteGroup = useCallback((index: number) => {
    setSatelliteVisible((current) => {
      const next = current.map((on, i) => (i === index ? !on : on));
      satelliteVisibleRef.current = next;
      satelliteLayerRef.current?.setVisibleGroups(next);
      return next;
    });
  }, []);

  const setAllSatelliteGroups = useCallback((on: boolean) => {
    const next = SATELLITE_GROUPS.map(() => on);
    satelliteVisibleRef.current = next;
    satelliteLayerRef.current?.setVisibleGroups(next);
    setSatelliteVisible(next);
  }, []);

  const zoomRef = useRef({ scale: toCanvasScale(INITIAL_ZOOM) });
  const newsAnchors = useRef<GlobeNewsAnchorMap>({
    DEU: { x: 0, y: 0, depth: -1, visible: false },
    FRA: { x: 0, y: 0, depth: -1, visible: false },
    ITA: { x: 0, y: 0, depth: -1, visible: false },
  });
  const eventAnchors = useRef<GlobeEventAnchorMap>({});

  const eventStories = useMemo(
    () => [
      ...Object.values(GLOBAL_EVENT_NEWS).flat(),
      ...conflictEvents.map(conflictEventToStory),
    ],
    [conflictEvents],
  );
  const eventStoriesRef = useRef(eventStories);
  eventStoriesRef.current = eventStories;

  onSelectRef.current = onSelect;
  onPrefetchRef.current = onPrefetchDossier;
  markersRef.current = markers;

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/conflict-events', { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Conflict feed returned ${response.status}`);
        return (await response.json()) as ConflictEventsResponse;
      })
      .then((payload) => {
        if (Array.isArray(payload.events)) setConflictEvents(payload.events);
      })
      .catch(() => {
        /* Vite dev has no serverless routes */
      });
    return () => controller.abort();
  }, []);

  // NASA EONET natural-hazard layers — the default-on categories only, same as the old globe.
  useEffect(() => {
    const controller = new AbortController();
    const wanted = EONET_CATEGORIES.filter((category) => category.defaultOn);
    Promise.allSettled(
      wanted.map((category) => fetchEonetCategory(category.id, controller.signal)),
    ).then((results) => {
      if (controller.signal.aborted) return;
      const points = results.flatMap((result) =>
        result.status === 'fulfilled' ? result.value : [],
      );
      if (points.length) setEonetPoints(points);
    });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const defaultOn = new Set(
      OSINT_CATEGORIES.filter((category) => category.defaultOn).map((category) => category.id),
    );
    fetchOsintFeed(controller.signal)
      .then((feed) => {
        if (controller.signal.aborted) return;
        setOsintPoints(feed.points.filter((point) => defaultOn.has(point.categoryId)));
      })
      .catch(() => {
        /* the feed already falls back to its bundled fixture */
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let cancelled = false;
    let frame = 0;
    let idleSpinResumeTimer = 0;

    (async () => {
      const maplibregl = (await import('maplibre-gl')).default;
      if (cancelled || !containerRef.current) return;

      // 16 is MapLibre's default; 32 saturated bandwidth against building vector tiles.
      maplibregl.setMaxParallelImageRequests(16);

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: RECON_STYLE,
        center: INITIAL_CENTER,
        zoom: INITIAL_ZOOM,
        minZoom: MIN_ZOOM,
        maxZoom: MAX_ZOOM,
        pitch: 0,
        maxPitch: 85,
        attributionControl: false,
        fadeDuration: 0,
        refreshExpiredTiles: false,
        localIdeographFontFamily: 'sans-serif',
        renderWorldCopies: false,
        maxTileCacheSize: 192,
        maxTileCacheZoomLevels: 4,
        crossSourceCollisions: false,
        // Retina 3x canvases crush fill-extrusion fill rate; cap without looking soft on 2x.
        pixelRatio: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 1.5),
        canvasContextAttributes: {
          antialias: false,
          preserveDrawingBuffer: false,
          powerPreference: 'high-performance',
        },
      });

      map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-right');
      mapRef.current = map;

      map.on('styleimagemissing', (e) => {
        if (map.hasImage(e.id)) return;
        const recon = resolveReconIcon(e.id);
        if (recon) {
          map.addImage(e.id, recon.image, { pixelRatio: recon.pixelRatio });
          return;
        }
        map.addImage(e.id, { width: 1, height: 1, data: new Uint8Array(4) });
      });

      map.on('error', (e) => {
        const msg: string = e.error?.message || String(e.error || '');
        if (/could not load image|image|tile|sprite|glyph|decode/i.test(msg)) return;
        console.warn('[map]', msg);
      });

      // Terrain used to sync only on pitchend — pitched dive-ins kept the DEM mesh attached
      // all the way into building zooms. Re-evaluate on zoom so city detail can detach it.
      map.on('pitchend', () => syncTerrain(map));

      let mapInteracting = false;
      /** True only while our idle-spin `setCenter` is in flight — must not trip interaction pause. */
      let applyingIdleSpin = false;
      let idleSpinPaused = false;
      let lastSpinNow = 0;

      const pauseIdleSpin = () => {
        idleSpinPaused = true;
        if (idleSpinResumeTimer) {
          window.clearTimeout(idleSpinResumeTimer);
          idleSpinResumeTimer = 0;
        }
      };

      const scheduleIdleSpinResume = () => {
        if (idleSpinResumeTimer) window.clearTimeout(idleSpinResumeTimer);
        idleSpinResumeTimer = window.setTimeout(() => {
          idleSpinPaused = false;
          idleSpinResumeTimer = 0;
          lastSpinNow = 0;
        }, IDLE_SPIN_RESUME_MS);
      };

      const setInteractionHeavyLayers = (hidden: boolean) => {
        const next = hidden ? 'none' : 'visible';
        for (const id of INTERACTION_HIDE_LAYERS) {
          if (!map.getLayer(id)) continue;
          const current = map.getLayoutProperty(id, 'visibility') ?? 'visible';
          if (current !== next) map.setLayoutProperty(id, 'visibility', next);
        }
      };
      map.on('movestart', () => {
        // Programmatic idle spin must not look like a user drag (layer hide / RAF pause / resume timer).
        if (applyingIdleSpin) return;
        mapInteracting = true;
        pauseIdleSpin();
        if (map.getZoom() >= INTERACTION_HIDE_MIN_ZOOM) setInteractionHeavyLayers(true);
      });
      /**
       * Keeps the hover badge (and any selection) honest against the camera.
       *
       * The badge is anchored to the satellite's projected dot, not the cursor, so it has to be
       * re-projected whenever the camera moves — and dropped outright once the shells fade out,
       * otherwise it hangs over an empty globe until the next mousemove that happens to land at
       * satellite zoom. `project()` returns null for far-side satellites, which clears it too.
       */
      const syncSatelliteOverlays = (opacity: number) => {
        const layer = satelliteLayerRef.current;

        if (opacity <= 0.01) {
          if (satelliteHoverIndexRef.current !== null) {
            satelliteHoverIndexRef.current = null;
            setSatelliteHover(null);
          }
          // The dot and its orbit track are invisible at this zoom, so the readout that
          // describes them can no longer be dismissed by clicking empty sky — retire it here.
          if (satelliteSelectedRef.current !== null) {
            satelliteSelectedRef.current = null;
            layer?.setSelected(null);
            layer?.setTrack(null);
            setSatelliteSelected(null);
          }
          return;
        }

        const index = satelliteHoverIndexRef.current;
        if (index === null || !layer) return;
        const screen = layer.project(index);
        if (!screen) {
          satelliteHoverIndexRef.current = null;
          setSatelliteHover(null);
          return;
        }
        setSatelliteHover((current) =>
          current && current.index === index && current.x === screen.x && current.y === screen.y
            ? current
            : { index, x: screen.x, y: screen.y },
        );
      };

      const syncSatelliteShells = () => {
        const opacity = satelliteOpacityForZoom(map.getZoom());
        satelliteLayerRef.current?.setOpacity(opacity);
        syncSatelliteOverlays(opacity);
        // Drives both the legend and the worker: nothing is fetched or propagated until the
        // camera has actually pulled back far enough to show a shell.
        setSatellitesInView((current) => (current === opacity > 0 ? current : opacity > 0));
      };

      // Panning and rotating move the dot without changing zoom, so the badge has to follow.
      map.on('move', () => {
        syncSatelliteOverlays(satelliteOpacityForZoom(map.getZoom()));
      });

      map.on('zoom', () => {
        syncTerrain(map);
        syncSatelliteShells();
        // Dive-ins often start below city zoom; hide heavies once the threshold is crossed.
        if (mapInteracting && map.getZoom() >= INTERACTION_HIDE_MIN_ZOOM) {
          setInteractionHeavyLayers(true);
        }
      });
      map.on('moveend', () => {
        if (applyingIdleSpin) return;
        mapInteracting = false;
        setInteractionHeavyLayers(false);
        syncTerrain(map);
        scheduleIdleSpinResume();
      });

      const syncAnchors = () => {
        zoomRef.current.scale = toCanvasScale(map.getZoom());
        const w = map.getCanvas().clientWidth;
        const h = map.getCanvas().clientHeight;
        const center = map.getCenter();
        const centerPosition: [number, number] = [center.lng, center.lat];

        const place = (
          target: { x: number; y: number; depth: number; visible: boolean },
          lng: number,
          lat: number,
        ) => {
          const p = map.project([lng, lat]);
          target.x = p.x;
          target.y = p.y;
          // On a globe the far hemisphere still projects to on-screen pixels, so the panels
          // need the same "is it facing me" test the canvas globe used.
          target.depth = sphericalDepth(centerPosition, [lng, lat]);
          target.visible =
            target.depth > 0 && p.x >= -40 && p.x <= w + 40 && p.y >= -40 && p.y <= h + 40;
        };

        for (const iso of NEWS_ISOS) {
          const marker = markersRef.current.find((m) => m.iso === iso);
          const target = newsAnchors.current[iso];
          if (!marker) {
            target.visible = false;
            continue;
          }
          place(target, marker.lng, marker.lat);
        }

        for (const story of eventStoriesRef.current) {
          const target =
            eventAnchors.current[story.id] ??
            (eventAnchors.current[story.id] = { x: 0, y: 0, depth: -1, visible: false });
          place(target, story.pinpoint.longitude, story.pinpoint.latitude);
        }
      };

      map.on('move', syncAnchors);
      map.on('zoom', syncAnchors);
      map.on('rotate', syncAnchors);
      map.on('pitch', syncAnchors);

      // ── Latched migration overlay ──────────────────────────────────────────
      // Once a European destination is hovered, its corridors stay visible until another
      // destination with its own corridors is hovered. Ocean / non-EU land / mouse leave
      // never clear the latch — matching the old canvas globe.
      const NO_ISO = '\u0000';
      /** With motion reduced the markers are static, so only rebuild them on target changes. */
      let renderedStaticFor: string | null = null;

      const showMigrationTarget = (iso: string | null | undefined) => {
        // Only latch onto destinations that actually have corridors — hovering a European
        // country with none (or ocean / non-EU land) leaves the previous set on screen.
        if (!iso || !hasMigrationCorridors(iso)) return;
        if (iso === activeMigrationIso.current) return;
        activeMigrationIso.current = iso;
        renderedStaticFor = null;
        if (!map.getLayer('wt-migration-casing')) return;

        map.setFilter('wt-migration-casing', ['==', ['get', 'targetIso'], iso]);
        map.setFilter('wt-migration-labels', ['==', ['get', 'targetIso'], iso]);
        map.setFilter('wt-migration-label-dots', ['==', ['get', 'targetIso'], iso]);
        for (const mode of MIGRATION_MODES) {
          for (const status of MIGRATION_STATUSES) {
            map.setFilter(`wt-migration-${mode}-${status}`, [
              'all',
              ['==', ['get', 'targetIso'], iso],
              ['==', ['get', 'mode'], mode],
              ['==', ['get', 'status'], status],
            ]);
          }
        }
      };

      // ── Pins beat countries ────────────────────────────────────────────────
      // Event / war / hazard / intel pins sit on top of the country hit polygons, so both a
      // click and a hover must resolve against them first — otherwise brushing a marker would
      // silently swap the migration overlay underneath it.
      const pinAt = (event: MapMouseEvent) => {
        // Pins are minzoom-gated; war theatres reveal earlier than news/EONET/OSINT.
        const zoom = map.getZoom();
        const layers = PIN_LAYERS.filter((layer) => {
          if (!map.getLayer(layer)) return false;
          if (layer === 'wt-war-events') return zoom >= WAR_EVENT_MIN_ZOOM;
          if (layer === 'wt-iran-israel-events') return zoom >= IRAN_ISRAEL_EVENT_MIN_ZOOM;
          if (layer === 'wt-military-bases') return zoom >= MILITARY_BASE_MIN_ZOOM;
          return zoom >= EVENT_PIN_MIN_ZOOM;
        });
        if (!layers.length) return undefined;
        return map.queryRenderedFeatures(event.point, { layers })[0];
      };

      const describePin = (
        feature: NonNullable<ReturnType<typeof pinAt>>,
        event: MapMouseEvent,
      ): HoverCard => {
        const p = feature.properties ?? {};
        const layer = feature.layer.id;
        const base = { x: event.point.x, y: event.point.y };

        if (layer === 'wt-osint-pins') {
          return {
            ...base,
            color: String(p.color ?? '#ffffff'),
            code: String(p.code ?? 'OSINT'),
            kind: String(p.categoryTitle ?? 'Intel'),
            title: p.handle ? `@${p.handle}` : 'OSINT report',
            body: String(p.text ?? ''),
            footer: [p.placeName, formatOsintAge(String(p.date ?? ''))]
              .filter(Boolean)
              .join(' · '),
            url: p.sourceUrl ? String(p.sourceUrl) : undefined,
          };
        }
        if (layer === 'wt-eonet-pins') {
          return {
            ...base,
            color: String(p.color ?? '#ffffff'),
            code: String(p.code ?? 'EONET'),
            kind: String(p.categoryTitle ?? 'Natural hazard'),
            title: String(p.title ?? ''),
            body: '',
            footer: `NASA EONET · ${formatEonetDate(String(p.date ?? ''))}`,
          };
        }
        if (layer === 'wt-war-events' || layer === 'wt-iran-israel-events') {
          return {
            ...base,
            color: String(p.color ?? '#ffffff'),
            code: String(p.code ?? 'WAR'),
            kind: String(p.categoryTitle ?? 'War event'),
            title: String(p.title ?? ''),
            body: String(p.summary ?? ''),
            footer: String(p.placeName ?? ''),
          };
        }
        if (layer === 'wt-military-bases') {
          // Host first, operator second — the operator is already carried by the chip colour.
          return {
            ...base,
            color: String(p.color ?? '#9aa2ad'),
            code: String(p.operatorCode ?? 'BASE'),
            kind: String(p.typeLabel ?? 'Installation'),
            title: String(p.name ?? ''),
            body: [p.aka ? `AKA ${p.aka}` : '', p.note].filter(Boolean).join(' · '),
            footer: [
              p.hostName,
              p.operatorName,
              p.sharedWith ? `shared with ${p.sharedWith}` : '',
            ]
              .filter(Boolean)
              .join(' · '),
            url: p.url ? String(p.url) : undefined,
          };
        }
        return {
          ...base,
          color: '#e8e8ec',
          code: 'EVT',
          kind: 'Global event',
          title: String(p.headline ?? ''),
          body: '',
          footer: String(p.source ?? ''),
          url: p.url ? String(p.url) : undefined,
        };
      };

      map.on('mousemove', (event) => {
        // Satellites own the pointer whenever the shells are lit — at that zoom every ground pin
        // is already hidden, so there is nothing to compete with.
        const satelliteLayer = satelliteLayerRef.current;
        if (satelliteLayer && satelliteOpacityForZoom(map.getZoom()) > 0.01) {
          const hit = satelliteLayer.pick(event.point.x, event.point.y, 7);
          if (hit !== null) {
            const screen = satelliteLayer.project(hit);
            satelliteHoverIndexRef.current = screen ? hit : null;
            setSatelliteHover(screen ? { index: hit, x: screen.x, y: screen.y } : null);
            setHoverCard(null);
            map.getCanvas().style.cursor = 'pointer';
            return;
          }
          satelliteHoverIndexRef.current = null;
          setSatelliteHover(null);
        } else if (satelliteHoverIndexRef.current !== null) {
          // Shells are dark (zoomed in past the fade): drop any badge left over from wider zoom.
          satelliteHoverIndexRef.current = null;
          setSatelliteHover(null);
        }

        const pin = pinAt(event);
        if (pin) {
          setHoverCard(describePin(pin, event));
          map.getCanvas().style.cursor = 'pointer';
          // Pins win the cursor/card, but still latch migration if a destination sits under them.
          const under = map.getLayer('wt-country-hit')
            ? map.queryRenderedFeatures(event.point, { layers: ['wt-country-hit'] })[0]
            : undefined;
          showMigrationTarget(under?.properties?.iso as string | undefined);
          return;
        }
        setHoverCard(null);

        const country = map.getLayer('wt-country-hit')
          ? map.queryRenderedFeatures(event.point, { layers: ['wt-country-hit'] })[0]
          : undefined;
        const iso = country?.properties?.iso as string | undefined;
        showMigrationTarget(iso);
        map.getCanvas().style.cursor = country ? 'pointer' : 'grab';
        if (country) onPrefetchRef.current?.();
      });

      map.on('mouseout', () => {
        setHoverCard(null);
        // The badge tracks the cursor's target, so it leaves with the cursor.
        if (satelliteHoverIndexRef.current !== null) {
          satelliteHoverIndexRef.current = null;
          setSatelliteHover(null);
        }
        // Keep latched migration corridors; only clear the pin hover card.
      });

      map.on('click', (event) => {
        const satelliteLayer = satelliteLayerRef.current;
        if (satelliteLayer && satelliteOpacityForZoom(map.getZoom()) > 0.01) {
          const hit = satelliteLayer.pick(event.point.x, event.point.y, 7);
          // Clicking empty sky clears the selection and its orbit track.
          satelliteLayer.setSelected(hit);
          satelliteSelectedRef.current = hit;
          setSatelliteSelected(hit);
          if (hit === null) satelliteLayer.setTrack(null);
          else requestTrackRef.current(hit);
          if (hit !== null) return;
        }

        const pin = pinAt(event);
        if (pin) {
          const url = pin.properties?.sourceUrl || pin.properties?.url;
          if (typeof url === 'string' && /^https?:\/\//.test(url)) {
            window.open(url, '_blank', 'noopener,noreferrer');
          }
          return;
        }
        const country = map.getLayer('wt-country-hit')
          ? map.queryRenderedFeatures(event.point, { layers: ['wt-country-hit'] })[0]
          : undefined;
        const id = country?.properties?.id as string | undefined;
        if (!id) return;
        const marker = markersRef.current.find((m) => m.id === id);
        if (marker?.status === 'live' && marker.flag) onSelectRef.current(marker.flag);
      });

      // Inline styles can emit their first `styledata` event during construction, before a
      // listener can be attached. Install immediately and retry on later style updates so the
      // borders/routes cannot silently disappear when remote DEM tiles are slow.
      const installOverlays = () => {
        if (map.getLayer('wt-world-borders')) return;
        if (!map.getStyle()) {
          window.setTimeout(installOverlays, 50);
          return;
        }

        // A retry must be able to pick up where a failed attempt left off, so every source
        // add is idempotent — re-adding one throws and would spin the retry loop forever.
        const source = (id: string, data: GeoJSON.FeatureCollection | object) => {
          if (map.getSource(id)) return;
          map.addSource(id, { type: 'geojson', data: data as GeoJSON.FeatureCollection });
        };

        try {
          registerReconIcons(map);

          for (const mode of MIGRATION_MODES) {
            const image = glyphImage(mode);
            if (image && !map.hasImage(`wt-glyph-${mode}`)) {
              map.addImage(`wt-glyph-${mode}`, image, { pixelRatio: 2, sdf: true });
            }
          }

          // Geometry below is fetched from /geo — register the sources empty so the layers
          // can be built synchronously, then fill them in when each payload lands.
          source('wt-country-shapes', EMPTY_FEATURE_COLLECTION);
          source('wt-world-borders', EMPTY_FEATURE_COLLECTION);
          source('wt-disputed-borders', EMPTY_FEATURE_COLLECTION);
          source('wt-military-bases', EMPTY_FEATURE_COLLECTION);
          const fillSource = (id: string, load: () => Promise<GeoJSON.FeatureCollection>) => {
            void load()
              .then((data) => {
                (mapRef.current?.getSource(id) as GeoJSONSource | undefined)?.setData(data);
              })
              .catch((error) => {
                console.error(`[globe] ${id} geometry failed to load`, error);
              });
          };
          fillSource('wt-country-shapes', () => countryShapesGeoJson(markersRef.current));
          fillSource('wt-world-borders', worldBordersGeoJson);
          fillSource('wt-disputed-borders', disputedBordersGeoJson);
          fillSource('wt-military-bases', militaryBasesGeoJson);
          source('wt-migration-corridors', migrationCorridorsGeoJson());
          source('wt-migration-labels', migrationLabelsGeoJson());
          source('wt-migration-travellers', EMPTY_FEATURE_COLLECTION);
          source('wt-war-zones', warControlZonesGeoJson());
          source('wt-war-contested', warContestedGeoJson());
          source('wt-war-frontline', warFrontlineGeoJson());
          source('wt-war-events', warEventsGeoJson());
          source('wt-war-settlements', warSettlementsGeoJson());
          source('wt-iran-israel-events', israelIranEventsGeoJson());
          source('wt-events', EMPTY_FEATURE_COLLECTION);
          source('wt-eonet', EMPTY_FEATURE_COLLECTION);
          source('wt-osint', EMPTY_FEATURE_COLLECTION);
          source('wt-countries', markersGeoJson(markersRef.current));

          map.addLayer({
            id: 'wt-country-hit',
            type: 'fill',
            source: 'wt-country-shapes',
            paint: {
              'fill-color': [
                'case',
                ['==', ['get', 'status'], 'live'],
                'rgba(255,255,255,0.025)',
                'rgba(255,255,255,0.008)',
              ],
            },
          });

          // ── Russo-Ukraine war layer ──────────────────────────────────────
          // Below WAR_REVEAL_ZOOM the whole thing collapses into a smudge over Ukraine, so it
          // fades in as the camera closes on the theatre.
          const warFade: import('maplibre-gl').ExpressionSpecification = [
            'interpolate',
            ['linear'],
            ['zoom'],
            WAR_REVEAL_ZOOM - 0.9,
            0,
            WAR_REVEAL_ZOOM,
            1,
          ];

          map.addLayer({
            id: 'wt-war-zone-fill',
            type: 'fill',
            source: 'wt-war-zones',
            paint: {
              'fill-color': [
                'case',
                ['==', ['get', 'id'], 'crimea'],
                'rgba(122,26,30,0.42)',
                'rgba(150,38,30,0.32)',
              ],
              'fill-opacity': warFade,
            },
          });

          map.addLayer({
            id: 'wt-war-zone-edge',
            type: 'line',
            source: 'wt-war-zones',
            layout: { 'line-join': 'round' },
            paint: {
              'line-color': 'rgba(226,96,74,0.55)',
              'line-width': ['interpolate', ['linear'], ['zoom'], 3, 0.8, 8, 1.4],
              'line-opacity': warFade,
            },
          });

          map.addLayer({
            id: 'wt-war-contested-fill',
            type: 'fill',
            source: 'wt-war-contested',
            paint: { 'fill-color': 'rgba(238,214,120,0.22)', 'fill-opacity': warFade },
          });

          map.addLayer({
            id: 'wt-war-contested-edge',
            type: 'line',
            source: 'wt-war-contested',
            layout: { 'line-join': 'round' },
            paint: {
              'line-color': 'rgba(246,228,152,0.75)',
              'line-width': ['interpolate', ['linear'], ['zoom'], 3, 0.7, 8, 1.3],
              'line-dasharray': [1.6, 1.4],
              'line-opacity': warFade,
            },
          });

          // The single most important element: read it as a hard war border, not a hairline.
          map.addLayer({
            id: 'wt-war-frontline-glow',
            type: 'line',
            source: 'wt-war-frontline',
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
              'line-color': 'rgba(255,72,48,0.30)',
              'line-width': ['interpolate', ['linear'], ['zoom'], 2.5, 5, 6, 12, 10, 22],
              'line-blur': ['interpolate', ['linear'], ['zoom'], 2.5, 3, 8, 9],
              'line-opacity': warFade,
            },
          });

          map.addLayer({
            id: 'wt-war-frontline',
            type: 'line',
            source: 'wt-war-frontline',
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
              'line-color': '#ff5138',
              'line-width': ['interpolate', ['linear'], ['zoom'], 2.5, 1.6, 5, 2.8, 10, 4.4],
              'line-opacity': warFade,
            },
          });

          // ── Borders ──────────────────────────────────────────────────────
          map.addLayer({
            id: 'wt-world-borders',
            type: 'line',
            source: 'wt-world-borders',
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
              'line-color': 'rgba(255,255,255,0.68)',
              'line-width': ['interpolate', ['linear'], ['zoom'], 0, 0.9, 6, 1.2, 12, 1.65],
            },
          });

          map.addLayer({
            id: 'wt-disputed-borders',
            type: 'line',
            source: 'wt-disputed-borders',
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
              'line-color': 'rgba(255,255,255,0.4)',
              'line-width': ['interpolate', ['linear'], ['zoom'], 0, 0.7, 6, 0.95, 12, 1.3],
              'line-dasharray': [2.4, 2],
            },
          });

          // Vector boundaries carry per-zoom detail the baked Natural Earth rings cannot, so
          // they take over once the camera is close enough for the difference to show.
          if (map.getSource('openmaptiles')) {
            map.addLayer({
              id: 'wt-vector-borders',
              type: 'line',
              source: 'openmaptiles',
              'source-layer': 'boundary',
              filter: ['all', ['<=', ['get', 'admin_level'], 2], ['!=', ['get', 'maritime'], 1]],
              layout: { 'line-cap': 'round', 'line-join': 'round' },
              paint: {
                'line-color': 'rgba(255,255,255,0.72)',
                'line-width': ['interpolate', ['linear'], ['zoom'], 1, 0.7, 6, 1.3, 12, 1.9],
                'line-opacity': ['interpolate', ['linear'], ['zoom'], 1.6, 0, 2.6, 1],
              },
            });
          }

          map.addLayer({
            id: 'wt-country-borders',
            type: 'line',
            source: 'wt-country-shapes',
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
              'line-color': [
                'case',
                ['==', ['get', 'status'], 'live'],
                'rgba(255,255,255,0.95)',
                'rgba(255,255,255,0.58)',
              ],
              'line-width': ['interpolate', ['linear'], ['zoom'], 0, 1.25, 6, 1.6, 12, 2.1],
            },
          });

          // ── Migration corridors (latched on destination hover) ─────────────
          map.addLayer({
            id: 'wt-migration-casing',
            type: 'line',
            source: 'wt-migration-corridors',
            filter: ['==', ['get', 'targetIso'], NO_ISO],
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
              'line-color': 'rgba(0,0,0,0.92)',
              'line-width': ['interpolate', ['linear'], ['zoom'], 0, 5.6, 8, 7.6, 15, 10.5],
              'line-opacity': 0.95,
              'line-blur': 0.15,
            },
          });

          // Regular = mode colour + solid; irregular = alert coral + dashed.
          // The lines never animate — only the traffic on them does.
          const modeWidth = {
            land: [2.35, 3, 3.7],
            sea: [2.5, 3.2, 3.9],
            air: [2.15, 2.8, 3.5],
          } as const;

          for (const mode of MIGRATION_MODES) {
            for (const status of MIGRATION_STATUSES) {
              const width = modeWidth[mode];
              map.addLayer({
                id: `wt-migration-${mode}-${status}`,
                type: 'line',
                source: 'wt-migration-corridors',
                filter: [
                  'all',
                  ['==', ['get', 'targetIso'], NO_ISO],
                  ['==', ['get', 'mode'], mode],
                  ['==', ['get', 'status'], status],
                ],
                layout: {
                  'line-cap': status === 'regular' ? 'round' : 'butt',
                  'line-join': 'round',
                },
                paint: {
                  'line-color': MIGRATION_LINE_COLOR[mode][status],
                  'line-width': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    0,
                    width[0],
                    8,
                    width[1],
                    15,
                    width[2],
                  ],
                  'line-opacity': status === 'regular' ? 0.96 : 0.88,
                  ...(status === 'irregular' ? { 'line-dasharray': [2.2, 2.4] } : {}),
                },
              });
            }
          }

          map.addLayer({
            id: 'wt-migration-trail',
            type: 'circle',
            source: 'wt-migration-travellers',
            filter: ['==', ['get', 'role'], 'trail'],
            paint: {
              'circle-radius': [
                '*',
                ['get', 'fade'],
                ['interpolate', ['linear'], ['zoom'], 0, 1.8, 5, 2.8, 12, 4],
              ],
              'circle-color': [...MIGRATION_ACCENT_EXPR],
              'circle-opacity': ['*', ['get', 'fade'], 0.6],
              'circle-blur': 0.35,
            },
          });

          // Planes and boats point where they are going; a walking figure would just look
          // like it had fallen over, so land travellers stay upright against the viewport.
          // SDF icons: tint from status/mode accent; dark halo for contrast on bright terrain.
          for (const alignment of ['map', 'viewport'] as const) {
            map.addLayer({
              id: `wt-migration-glyphs-${alignment}`,
              type: 'symbol',
              source: 'wt-migration-travellers',
              filter: [
                'all',
                ['==', ['get', 'role'], 'traveller'],
                alignment === 'viewport'
                  ? ['==', ['get', 'mode'], 'land']
                  : ['!=', ['get', 'mode'], 'land'],
              ],
              layout: {
                'icon-image': ['concat', 'wt-glyph-', ['get', 'mode']],
                'icon-size': ['interpolate', ['linear'], ['zoom'], 0, 0.48, 5, 0.7, 12, 0.95],
                'icon-rotate': alignment === 'map' ? ['get', 'bearing'] : 0,
                'icon-rotation-alignment': alignment,
                'icon-allow-overlap': true,
                'icon-ignore-placement': true,
              },
              paint: {
                'icon-color': [...MIGRATION_ACCENT_EXPR],
                'icon-halo-color': 'rgba(0,0,0,0.92)',
                'icon-halo-width': 1.35,
                'icon-halo-blur': 0.2,
                'icon-opacity': 0.96,
              },
            });
          }

          // Departure city, curated transit ports / airports, and the port or airport of
          // entry — the researched labels carried on each corridor record.
          map.addLayer({
            id: 'wt-migration-label-dots',
            type: 'circle',
            source: 'wt-migration-labels',
            filter: ['==', ['get', 'targetIso'], NO_ISO],
            paint: {
              'circle-radius': [
                'match',
                ['get', 'kind'],
                'entry',
                4.2,
                'origin',
                3.4,
                2.6,
              ],
              'circle-color': [...MIGRATION_ACCENT_EXPR],
              'circle-opacity': [
                'match',
                ['get', 'kind'],
                'entry',
                0.95,
                'origin',
                0.88,
                0.72,
              ],
              'circle-stroke-color': '#000000',
              'circle-stroke-width': 1.4,
            },
          });

          map.addLayer({
            id: 'wt-migration-labels',
            type: 'symbol',
            source: 'wt-migration-labels',
            filter: ['==', ['get', 'targetIso'], NO_ISO],
            layout: {
              'text-field': [
                'format',
                ['get', 'title'],
                {},
                '\n',
                {},
                ['get', 'detail'],
                { 'font-scale': 0.78 },
              ],
              'text-font': ['Noto Sans Regular'],
              'text-size': ['interpolate', ['linear'], ['zoom'], 1, 9, 6, 11.5, 12, 13],
              'text-offset': [0, 1.1],
              'text-anchor': 'top',
              'text-letter-spacing': 0.06,
              'text-max-width': 14,
              'text-allow-overlap': false,
              'symbol-sort-key': ['get', 'sort'],
            },
            paint: {
              'text-color': [...MIGRATION_ACCENT_EXPR],
              'text-halo-color': '#000000',
              'text-halo-width': 1.6,
              'text-opacity': [
                'match',
                ['get', 'kind'],
                'entry',
                0.96,
                'origin',
                0.9,
                0.78,
              ],
            },
          });

          // ── Country pins ─────────────────────────────────────────────────
          map.addLayer({
            id: 'wt-country-soon',
            type: 'circle',
            source: 'wt-countries',
            filter: ['==', ['get', 'status'], 'soon'],
            paint: {
              'circle-radius': ['interpolate', ['linear'], ['zoom'], 0.5, 3, 4, 5, 8, 7],
              'circle-color': 'rgba(232,232,236,0.35)',
              'circle-stroke-color': 'rgba(255,255,255,0.25)',
              'circle-stroke-width': 1,
            },
          });

          map.addLayer({
            id: 'wt-country-live',
            type: 'circle',
            source: 'wt-countries',
            filter: ['==', ['get', 'status'], 'live'],
            paint: {
              'circle-radius': ['interpolate', ['linear'], ['zoom'], 0.5, 4, 4, 6, 8, 9],
              'circle-color': 'rgba(244,244,246,0.92)',
              'circle-stroke-color': '#000000',
              'circle-stroke-width': 1.5,
              'circle-blur': 0.1,
            },
          });

          map.addLayer({
            id: 'wt-country-label',
            type: 'symbol',
            source: 'wt-countries',
            filter: ['==', ['get', 'status'], 'live'],
            minzoom: 3,
            layout: {
              'text-field': ['get', 'label'],
              'text-font': ['Noto Sans Regular'],
              'text-size': ['interpolate', ['linear'], ['zoom'], 3, 9, 8, 12],
              'text-offset': [0, 1.2],
              'text-anchor': 'top',
              'text-max-width': 10,
            },
            paint: {
              'text-color': '#f4f4f6',
              'text-halo-color': '#000000',
              'text-halo-width': 1.2,
            },
          });

          // ── Military installations ───────────────────────────────────────
          // Added before the event pins so bases sit above the country fills and war geometry
          // but beneath every live pin: `queryRenderedFeatures` returns topmost-first, so an
          // incident sharing a coordinate with a base still wins the hover card. One flat dot
          // per base — no pulse halo, which is what keeps standing infrastructure visually
          // distinct from "something happened here", and keeps dense clusters legible.
          map.addLayer({
            id: 'wt-military-bases',
            type: 'circle',
            source: 'wt-military-bases',
            minzoom: MILITARY_BASE_MIN_ZOOM,
            paint: {
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                MILITARY_BASE_MIN_ZOOM,
                2.2,
                7,
                3.6,
                12,
                5.4,
              ],
              'circle-color': ['get', 'color'],
              'circle-stroke-color': 'rgba(0,0,0,0.85)',
              'circle-stroke-width': 0.9,
              'circle-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                MILITARY_BASE_MIN_ZOOM,
                0,
                MILITARY_BASE_MIN_ZOOM + 0.8,
                0.85,
              ],
            },
          });

          // ── Event / hazard / intel pins ──────────────────────────────────
          // News / EONET / OSINT stay at EVENT_PIN_MIN_ZOOM so world view stays clean.
          // Russo-Ukraine war dots use WAR_EVENT_MIN_ZOOM; Israel–Iran uses
          // IRAN_ISRAEL_EVENT_MIN_ZOOM (regional, between theatre and micro-events).
          const eventPinFade: import('maplibre-gl').ExpressionSpecification = [
            'interpolate',
            ['linear'],
            ['zoom'],
            EVENT_PIN_MIN_ZOOM,
            0,
            EVENT_PIN_MIN_ZOOM + 0.6,
            0.9,
          ];

          map.addLayer({
            id: 'wt-event-markers',
            type: 'circle',
            source: 'wt-events',
            minzoom: EVENT_PIN_MIN_ZOOM,
            paint: {
              'circle-radius': ['interpolate', ['linear'], ['zoom'], 2, 2.4, 8, 4.6],
              'circle-color': 'rgba(240,240,244,0.9)',
              'circle-stroke-color': 'rgba(0,0,0,0.85)',
              'circle-stroke-width': 1.2,
              'circle-opacity': eventPinFade,
            },
          });

          for (const [id, source] of [
            ['wt-eonet-pins', 'wt-eonet'],
            ['wt-osint-pins', 'wt-osint'],
          ] as const) {
            map.addLayer({
              id,
              type: 'circle',
              source,
              minzoom: EVENT_PIN_MIN_ZOOM,
              paint: {
                'circle-radius': ['interpolate', ['linear'], ['zoom'], 0.5, 2.6, 5, 4.2, 10, 6.5],
                'circle-color': ['get', 'color'],
                'circle-stroke-color': 'rgba(0,0,0,0.9)',
                'circle-stroke-width': 1.2,
                'circle-opacity': eventPinFade,
              },
            });
          }

          // Larger / brighter when first revealed over the theatre; settle as the camera closes in.
          const warEventRadius: import('maplibre-gl').ExpressionSpecification = [
            'interpolate',
            ['linear'],
            ['zoom'],
            WAR_EVENT_MIN_ZOOM,
            5.6,
            5.5,
            4.2,
            8,
            5.4,
            12,
            6.5,
          ];
          const warEventOpacity: import('maplibre-gl').ExpressionSpecification = [
            'interpolate',
            ['linear'],
            ['zoom'],
            WAR_EVENT_MIN_ZOOM,
            0.88,
            WAR_EVENT_MIN_ZOOM + 0.5,
            0.96,
          ];

          map.addLayer({
            id: 'wt-war-events-pulse',
            type: 'circle',
            source: 'wt-war-events',
            minzoom: WAR_EVENT_MIN_ZOOM,
            paint: {
              'circle-radius': 7,
              'circle-color': ['get', 'color'],
              'circle-opacity': 0.2,
              'circle-blur': 0.6,
            },
          });

          map.addLayer({
            id: 'wt-war-events',
            type: 'circle',
            source: 'wt-war-events',
            minzoom: WAR_EVENT_MIN_ZOOM,
            paint: {
              'circle-radius': warEventRadius,
              'circle-color': ['get', 'color'],
              'circle-stroke-color': 'rgba(0,0,0,0.9)',
              'circle-stroke-width': [
                'interpolate',
                ['linear'],
                ['zoom'],
                WAR_EVENT_MIN_ZOOM,
                1.7,
                6.5,
                1.2,
              ],
              'circle-opacity': warEventOpacity,
            },
          });

          // Israel–Iran / Gulf pins — same visual weight as war events at reveal, but later.
          const iranIsraelRadius: import('maplibre-gl').ExpressionSpecification = [
            'interpolate',
            ['linear'],
            ['zoom'],
            IRAN_ISRAEL_EVENT_MIN_ZOOM,
            5.6,
            7,
            4.2,
            10,
            5.4,
            14,
            6.5,
          ];
          const iranIsraelOpacity: import('maplibre-gl').ExpressionSpecification = [
            'interpolate',
            ['linear'],
            ['zoom'],
            IRAN_ISRAEL_EVENT_MIN_ZOOM,
            0.88,
            IRAN_ISRAEL_EVENT_MIN_ZOOM + 0.5,
            0.96,
          ];

          map.addLayer({
            id: 'wt-iran-israel-events-pulse',
            type: 'circle',
            source: 'wt-iran-israel-events',
            minzoom: IRAN_ISRAEL_EVENT_MIN_ZOOM,
            paint: {
              'circle-radius': 7,
              'circle-color': ['get', 'color'],
              'circle-opacity': 0.2,
              'circle-blur': 0.6,
            },
          });

          map.addLayer({
            id: 'wt-iran-israel-events',
            type: 'circle',
            source: 'wt-iran-israel-events',
            minzoom: IRAN_ISRAEL_EVENT_MIN_ZOOM,
            paint: {
              'circle-radius': iranIsraelRadius,
              'circle-color': ['get', 'color'],
              'circle-stroke-color': 'rgba(0,0,0,0.9)',
              'circle-stroke-width': [
                'interpolate',
                ['linear'],
                ['zoom'],
                IRAN_ISRAEL_EVENT_MIN_ZOOM,
                1.7,
                7.5,
                1.2,
              ],
              'circle-opacity': iranIsraelOpacity,
            },
          });

          map.addLayer({
            id: 'wt-war-settlement-labels',
            type: 'symbol',
            source: 'wt-war-settlements',
            minzoom: WAR_REVEAL_ZOOM,
            filter: ['<=', ['get', 'priority'], 2],
            layout: {
              'text-field': ['get', 'name'],
              'text-font': ['Noto Sans Regular'],
              'text-size': ['interpolate', ['linear'], ['zoom'], 3.2, 8.5, 8, 12],
              'text-letter-spacing': 0.08,
              'text-offset': [0, 0.9],
              'text-anchor': 'top',
              'symbol-sort-key': ['get', 'priority'],
            },
            paint: {
              'text-color': [
                'match',
                ['get', 'side'],
                'russian',
                '#f0a89a',
                'contested',
                '#f2e2a0',
                '#dfe4ea',
              ],
              'text-halo-color': '#000000',
              'text-halo-width': 1.4,
              'text-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                WAR_REVEAL_ZOOM,
                0,
                WAR_REVEAL_ZOOM + 0.5,
                1,
              ],
            },
          });

          // Orbital shells last, so satellites draw over every ground layer. The layer is a raw
          // GL custom layer (MapLibre has no notion of a point at altitude), added once and then
          // fed position buffers by the propagation worker.
          if (!map.getLayer('wt-satellites')) {
            const satelliteLayer = createSatelliteLayer('wt-satellites', map);
            map.addLayer(satelliteLayer);
            satelliteLayerRef.current = satelliteLayer;
            satelliteLayer.setVisibleGroups(satelliteVisibleRef.current);
            if (catalogueRef.current) satelliteLayer.setGroups(catalogueRef.current.groups);
            satelliteLayer.setOpacity(satelliteOpacityForZoom(map.getZoom()));
          }

          syncTerrain(map);
          syncAnchors();
          syncSatelliteShells();
          setReady(true);
        } catch (error) {
          console.warn('[map] Retrying overlay installation', error);
          window.setTimeout(installOverlays, 100);
        }
      };

      map.on('styledata', installOverlays);
      window.setTimeout(installOverlays, 0);

      // Baked Natural Earth borders are the guaranteed floor: they stay up until the vector
      // boundary layer is demonstrably drawing something, and come back if it stops.
      map.on('idle', () => {
        if (!map.getLayer('wt-vector-borders') || !map.getLayer('wt-world-borders')) return;
        const vectorDrawn = map.queryRenderedFeatures({ layers: ['wt-vector-borders'] }).length > 0;
        const visibility = vectorDrawn && map.getZoom() > 2.6 ? 'none' : 'visible';
        const current = map.getLayoutProperty('wt-world-borders', 'visibility') ?? 'visible';
        if (current !== visibility) {
          map.setLayoutProperty('wt-world-borders', 'visibility', visibility);
        }
      });

      // ── Animation ────────────────────────────────────────────────────────
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let lastFrame = 0;

      const animate = (now: number) => {
        frame = window.requestAnimationFrame(animate);
        // During pan/zoom, skip GeoJSON churn and paint updates so the camera owns the main thread.
        if (mapInteracting) {
          lastSpinNow = now;
          return;
        }
        if (now - lastFrame < 1000 / 30) return;
        lastFrame = now;

        // Idle cinematic spin: crawl center longitude. Flag keeps setCenter out of the
        // interaction path so travellers / war pulse keep ticking and layers stay visible.
        if (!reduceMotion && !idleSpinPaused && map.getZoom() < IDLE_SPIN_MAX_ZOOM) {
          const dt = lastSpinNow ? Math.min(now - lastSpinNow, 100) : 0;
          lastSpinNow = now;
          if (dt > 0) {
            const deltaLng = (IDLE_SPIN_DEG_PER_MIN / 60_000) * dt;
            applyingIdleSpin = true;
            try {
              const center = map.getCenter();
              map.setCenter([center.lng - deltaLng, center.lat]);
            } finally {
              applyingIdleSpin = false;
            }
          }
        } else {
          lastSpinNow = now;
        }

        if (map.getLayer('wt-war-events-pulse')) {
          const pulse = reduceMotion ? 0.5 : (Math.sin(now / 620) + 1) / 2;
          const z = map.getZoom();
          // Keep the halo readable at theatre zoom without flooding the frame.
          const zoomT = Math.min(1, Math.max(0, (z - WAR_EVENT_MIN_ZOOM) / 0.6));
          const baseR = z < 5.5 ? 8 : 6;
          const expand = z < 5.5 ? 6.5 : 9;
          map.setPaintProperty('wt-war-events-pulse', 'circle-radius', baseR + pulse * expand);
          map.setPaintProperty(
            'wt-war-events-pulse',
            'circle-opacity',
            (0.2 - pulse * 0.12) * (0.65 + 0.35 * zoomT),
          );
        }

        if (map.getLayer('wt-iran-israel-events-pulse')) {
          const pulse = reduceMotion ? 0.5 : (Math.sin(now / 620) + 1) / 2;
          const z = map.getZoom();
          const zoomT = Math.min(1, Math.max(0, (z - IRAN_ISRAEL_EVENT_MIN_ZOOM) / 0.6));
          const baseR = z < 7 ? 8 : 6;
          const expand = z < 7 ? 6.5 : 9;
          map.setPaintProperty(
            'wt-iran-israel-events-pulse',
            'circle-radius',
            baseR + pulse * expand,
          );
          map.setPaintProperty(
            'wt-iran-israel-events-pulse',
            'circle-opacity',
            (0.2 - pulse * 0.12) * (0.65 + 0.35 * zoomT),
          );
        }

        const iso = activeMigrationIso.current;
        const travellers = map.getSource('wt-migration-travellers') as GeoJSONSource | undefined;
        if (!iso || !travellers) return;
        if (reduceMotion && renderedStaticFor === iso) return;

        const paths: CorridorPath[] = corridorPaths.current.get(iso) ?? [];
        const features: GeoJSON.Feature[] = [];

        for (const [pathIndex, path] of paths.entries()) {
          // Stagger corridors against each other as well as travellers within a corridor, so
          // routes that share a leg do not march in lockstep.
          const phase = (pathIndex * 0.37) % 1;

          if (reduceMotion) {
            const sample = sampleCorridor(path, 0.5);
            features.push({
              type: 'Feature',
              properties: {
                role: 'traveller',
                mode: sample.mode,
                status: path.status,
                bearing: sample.bearing,
              },
              geometry: { type: 'Point', coordinates: sample.coordinates },
            });
            continue;
          }

          for (let index = 0; index < TRAVELLERS_PER_CORRIDOR; index++) {
            const t =
              (now / TRAVERSAL_MS + phase + index / TRAVELLERS_PER_CORRIDOR) % 1;
            const sample = sampleCorridor(path, t);
            features.push({
              type: 'Feature',
              properties: {
                role: 'traveller',
                mode: sample.mode,
                status: path.status,
                bearing: sample.bearing,
              },
              geometry: { type: 'Point', coordinates: sample.coordinates },
            });

            for (let step = 1; step <= TRAIL_SAMPLES; step++) {
              const behind = t - (step / TRAIL_SAMPLES) * TRAIL_SPAN;
              if (behind < 0) break;
              const trail = sampleCorridor(path, behind);
              features.push({
                type: 'Feature',
                properties: {
                  role: 'trail',
                  mode: trail.mode,
                  status: path.status,
                  fade: 1 - step / (TRAIL_SAMPLES + 1),
                },
                geometry: { type: 'Point', coordinates: trail.coordinates },
              });
            }
          }
        }

        travellers.setData({ type: 'FeatureCollection', features });
        renderedStaticFor = reduceMotion ? iso : null;
      };

      frame = window.requestAnimationFrame(animate);
    })();

    return () => {
      cancelled = true;
      if (frame) window.cancelAnimationFrame(frame);
      if (idleSpinResumeTimer) window.clearTimeout(idleSpinResumeTimer);
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map?.getSource('wt-countries')) return;
    (map.getSource('wt-countries') as GeoJSONSource).setData(markersGeoJson(markers));

    // Country rings are fetched from /geo, so a marker change that lands mid-flight must not
    // overwrite a newer payload — and the map may be gone by the time this resolves.
    let cancelled = false;
    void countryShapesGeoJson(markers).then((data) => {
      if (cancelled) return;
      (mapRef.current?.getSource('wt-country-shapes') as GeoJSONSource | undefined)?.setData(data);
    });
    return () => {
      cancelled = true;
    };
  }, [markers]);

  useEffect(() => {
    const source = mapRef.current?.getSource('wt-events') as GeoJSONSource | undefined;
    if (!source) return;
    source.setData({
      type: 'FeatureCollection',
      features: eventStories.map((story) => ({
        type: 'Feature' as const,
        properties: { id: story.id, headline: story.headline, source: story.source, url: story.url },
        geometry: {
          type: 'Point' as const,
          coordinates: [story.pinpoint.longitude, story.pinpoint.latitude],
        },
      })),
    });
  }, [eventStories, ready]);

  useEffect(() => {
    const source = mapRef.current?.getSource('wt-eonet') as GeoJSONSource | undefined;
    source?.setData(eonetPointsGeoJson(eonetPoints));
  }, [eonetPoints, ready]);

  useEffect(() => {
    const source = mapRef.current?.getSource('wt-osint') as GeoJSONSource | undefined;
    source?.setData(osintPointsGeoJson(osintPoints));
  }, [osintPoints, ready]);

  return (
    <div
      data-theme="dark"
      className="wt-globe-map relative h-[100dvh] w-full select-none overflow-hidden bg-black"
    >
      {/* No grayscale filter: the base style is already monochrome, and the war frontline,
          hazard and intel markers rely on being the only colour on the globe. */}
      <div
        ref={containerRef}
        className="absolute inset-0 h-full w-full [filter:contrast(1.02)_brightness(1.18)]"
        style={{ cursor: 'grab' }}
      />

      {hoverCard && (
        <div
          className="pointer-events-none absolute z-30 max-w-[280px] border border-white/15 bg-black/85 px-3 py-2 backdrop-blur-sm"
          style={{
            left: Math.min(hoverCard.x + 16, window.innerWidth - 300),
            top: Math.max(12, hoverCard.y - 12),
            fontFamily: MONO,
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: hoverCard.color }}
            />
            <span
              className="text-[9px] uppercase tracking-[0.24em]"
              style={{ color: hoverCard.color }}
            >
              {hoverCard.code}
            </span>
            <span className="text-[9px] uppercase tracking-[0.18em] text-white/40">
              {hoverCard.kind}
            </span>
          </div>
          <p className="mt-1.5 text-[11px] leading-snug text-white/90">{hoverCard.title}</p>
          {hoverCard.body && (
            <p className="mt-1 line-clamp-4 text-[10px] leading-relaxed text-white/55">
              {hoverCard.body}
            </p>
          )}
          {hoverCard.footer && (
            <p className="mt-1.5 text-[9px] uppercase tracking-[0.16em] text-white/35">
              {hoverCard.footer}
            </p>
          )}
          {hoverCard.url && (
            <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-white/30">
              Click to open source
            </p>
          )}
        </div>
      )}

      {/* Satellite name badge — anchored to the dot itself, not the cursor. */}
      {satelliteHover && catalogue && (
        <div
          className="pointer-events-none absolute z-30 -translate-y-1/2 whitespace-nowrap rounded-full border border-white/20 bg-black/80 px-2 py-[3px] backdrop-blur-sm"
          style={{
            left: satelliteHover.x + 10,
            top: satelliteHover.y,
            fontFamily: MONO,
          }}
        >
          <span className="text-[10px] tracking-wide text-white/90">
            {catalogue.names[satelliteHover.index] ?? '—'}
          </span>
        </div>
      )}

      {satelliteSelected !== null && catalogue && (
        <div
          className="pointer-events-none absolute bottom-6 left-1/2 z-30 w-[260px] -translate-x-1/2 border border-white/15 bg-black/85 px-3 py-2 backdrop-blur-sm"
          style={{ fontFamily: MONO }}
        >
          <div className="flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background:
                  SATELLITE_GROUPS[catalogue.groups[satelliteSelected] ?? 0]?.color ?? '#fff',
              }}
            />
            <span className="text-[9px] uppercase tracking-[0.24em] text-white/50">
              {SATELLITE_GROUPS[catalogue.groups[satelliteSelected] ?? 0]?.label ?? 'Satellite'}
            </span>
          </div>
          <p className="mt-1.5 text-[11px] leading-snug text-white/90">
            {catalogue.names[satelliteSelected]}
          </p>
          <p className="mt-1.5 text-[9px] uppercase tracking-[0.16em] text-white/35">
            NORAD {catalogue.norads[satelliteSelected]} ·{' '}
            {SATELLITE_GROUPS[catalogue.groups[satelliteSelected] ?? 0]?.altitude ?? ''}
          </p>
        </div>
      )}

      {satellitesInView && (
        <SatelliteLegend
          visible={satelliteVisible}
          countsByGroup={catalogue?.countsByGroup ?? SATELLITE_GROUPS.map(() => 0)}
          total={catalogue?.count ?? 0}
          status={satelliteStatus}
          onToggle={toggleSatelliteGroup}
          onAll={setAllSatelliteGroups}
        />
      )}

      <GlobeAnalysisPanels
        newsAnchors={newsAnchors}
        eventAnchors={eventAnchors}
        conflictEvents={conflictEvents}
        zoomRef={zoomRef}
      />
      <HackerNewsCarousel />

      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-1000"
        style={{ opacity: ready ? 1 : 0, fontFamily: MONO }}
      >
        <div className="absolute left-6 top-6 sm:left-9 sm:top-8">
          <div className="flex items-baseline gap-3">
            <span className="text-[11px] font-medium uppercase tracking-[0.42em] text-white/95">
              WATCHTOWER
            </span>
            <span className="text-[11px] tracking-[0.2em] text-white/35">v1.0</span>
          </div>
          <p className="mt-2 text-[11px] uppercase leading-relaxed tracking-[0.18em] text-white/40">
            Globe · MapLibre · 3D buildings
          </p>
        </div>

        <div className="wt-globe-hud-bottom wt-globe-hud-bottom--center absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-[11px] uppercase tracking-[0.28em] text-white/30 md:block">
          © OpenStreetMap · OpenFreeMap · Elevation © AWS
        </div>
      </div>
    </div>
  );
}

/** Drop-in alias so App.tsx can lazy-load the same export name. */
export const CountryGlobe = MapGlobe;
