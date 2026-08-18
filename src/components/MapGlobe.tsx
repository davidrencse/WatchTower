import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Map, MapGeoJSONFeature, MapMouseEvent, GeoJSONSource } from 'maplibre-gl';
import type {
  GlobeEventAnchorMap,
  GlobeNewsAnchorMap,
} from './GlobeAnalysisPanels';
import { GlobeLayerToggles } from './GlobeLayerToggles';
import { applyLayerGroups, type GlobeLayerGroupId } from '../lib/globeLayerGroups';
import type {
  ReconPhase,
  ReconTarget,
} from './ReconLocator';
import { reconOriginColor } from './reconOrigin';
import { SATELLITE_GROUPS } from '../data/satelliteGroups';
import { STRATEGIC_RADAR_ASSESSED_AT } from '../data/strategicRadarStations';
import { GERMANY_MASS_SHOOTING_META } from '../data/germanyMassShootingMeta';
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
import { registerReconIcons, resolveReconIcon } from '../lib/maplibreReconIcons';
import { registerMilitaryBaseIcons, resolveMilitaryBaseIcon } from '../lib/militaryBaseIcon';
import {
  registerStrategicRadarIcons,
  resolveStrategicRadarIcon,
} from '../lib/strategicRadarIcon';
import { registerWarUnitIcons, resolveWarUnitIcon } from '../lib/warUnitIcon';
import { OOB_ASSESSED_AT, WAR_SIDE_META } from '../data/warOrderOfBattle';
import { RECON_STYLE } from '../lib/maplibreReconStyle';
import { syncTerrain } from '../lib/maplibreTerrain';
import { scheduleIdleTask } from '../lib/idleTask';
import {
  createMigrationVehicleLayer,
  type MigrationVehicleLayer,
  type MigrationVehicleUnit,
} from '../lib/migrationVehicleLayer';
import {
  buildCorridorPaths,
  cyberEventsGeoJson,
  countryShapesGeoJson,
  disputedBordersGeoJson,
  eonetPointsGeoJson,
  EMPTY_FEATURE_COLLECTION,
  germanyMassShootingsGeoJson,
  hasMigrationCorridors,
  migrationCorridorsGeoJson,
  migrationEntryNodesGeoJson,
  migrationLabelsGeoJson,
  migrationMicroEventsGeoJson,
  militaryBasesGeoJson,
  MILITARY_BLOC_COLOR,
  osintPointsGeoJson,
  regionAncestryGeoJson,
  sampleCorridor,
  sphericalDepth,
  strategicRadarStationsGeoJson,
  tradeChokepointsGeoJson,
  tradePortsGeoJson,
  tradeRoutesGeoJson,
  warDefensiveLinesGeoJson,
  warFormationsGeoJson,
  warGarrisonsGeoJson,
  warMilitarySitesGeoJson,
  warContestedGeoJson,
  warControlZonesGeoJson,
  warEventsGeoJson,
  worldMicroEventsGeoJson,
  warFrontlineGeoJson,
  warSettlementsGeoJson,
  israelIranEventsGeoJson,
  worldBordersGeoJson,
  type CorridorPath,
} from '../lib/mapGlobeOverlays';
import type { FlagEntry } from '../types/flag';

const GlobeAnalysisPanels = lazy(() =>
  import('./GlobeAnalysisPanels').then((module) => ({ default: module.GlobeAnalysisPanels })),
);
const HackerNewsCarousel = lazy(() =>
  import('./HackerNewsCarousel').then((module) => ({ default: module.HackerNewsCarousel })),
);
const SatelliteLegend = lazy(() =>
  import('./SatelliteLegend').then((module) => ({ default: module.SatelliteLegend })),
);
const WorldVitalsPanel = lazy(() => import('./WorldVitalsPanel'));
let reconModulePromise: Promise<typeof import('./ReconLocator')> | null = null;
const loadReconModule = () => {
  reconModulePromise ??= import('./ReconLocator');
  return reconModulePromise;
};
const ReconLocator = lazy(() =>
  loadReconModule().then((module) => ({ default: module.default })),
);
const ReconReticle = lazy(() =>
  loadReconModule().then((module) => ({ default: module.ReconReticle })),
);

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

/**
 * Facility-precision migration entry nodes — quays, beach sectors, border stations, reception
 * centres, districts. A corridor label reads "Dover"; the node under it reads "Western Jet
 * Foil". That distinction only pays off once the camera is inside a city, and drawing it any
 * earlier would stack a second marker on every corridor endpoint, so it waits for z8.5.
 * Unlike the corridor layers these are **not** filtered by the latched destination: at this
 * zoom only one place is on screen anyway, so the hover state is irrelevant.
 */
const ENTRY_NODE_MIN_ZOOM = 8.5;

/** Reporting pinned to a node — one step tighter again, so nodes land before their media. */
const MICROEVENT_MIN_ZOOM = 9.2;

/**
 * Worldwide 2026 news microevents. Unlike the node-pinned reporting above these are scattered
 * across every continent, so they reveal early — just past the camera's opening zoom — and act
 * as the globe's "what happened this year" layer. Their labels wait a further step so a dense
 * cluster (the Gulf, eastern Ukraine) resolves into dots first and text only once you commit.
 */
const WORLD_MICROEVENT_MIN_ZOOM = 2.2;

/**
 * Sixty Germany incidents occupy a country-sized footprint. Reveal once Germany is a committed
 * regional view: earlier they merge into one patch, later they would be hard to discover.
 */
const GERMANY_MASS_SHOOTING_MIN_ZOOM = 3.7;

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
 * Thirteen curated strategic sensors can carry the opening world view without merging into a
 * texture. Reticles arrive immediately; names wait until a regional camera to preserve coastlines.
 */
const STRATEGIC_RADAR_MIN_ZOOM = 1.1;
const STRATEGIC_RADAR_LABEL_MIN_ZOOM = 3.1;

/**
 * Per-region ancestry choropleth (Germany / France / Italy). It only means anything once a
 * single country fills the view — at continent scale the regions are a few pixels each and
 * the fills read as noise over western Europe. Revealed just past the military-base layer so
 * zooming into one country is what brings its internal composition up.
 */
const ANCESTRY_REVEAL_ZOOM = 4.2;

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

/**
 * Seaborne trade lanes are a planetary-scale layer: they mean the most at globe zoom, where the
 * whole Suez-versus-Cape question is visible in one frame. So unlike the pin layers they are lit
 * from the widest camera and fade *down* as you close in on a country, where they would
 * otherwise cross the war, ancestry and base overlays that own that scale.
 */
const TRADE_FADE_START_ZOOM = 4.5;
const TRADE_FADE_END_ZOOM = 7;
/** Chokepoint and port dots stay hidden at the very widest camera, where they merge into the lanes. */
const TRADE_NODE_MIN_ZOOM = 1.6;
/** Chokepoint / port names — one step tighter again, so the dots land before their labels. */
const TRADE_LABEL_MIN_ZOOM = 2.6;

/**
 * Order of battle — reported formations, fortification belts and known fixed sites.
 *
 * Revealed with the war theatre rather than before it: at globe zoom the two orders of battle
 * would stack into one smear over the Donbas. Belts are long linear features that stay readable
 * at theatre scale, so they come up with the control map. Fixed sites wait one step further in,
 * because several sit far outside the theatre (Engels, Olenya) and would otherwise scatter
 * symbols across Russia at continent scale.
 */
const OOB_REVEAL_ZOOM = 3.4;
const OOB_SITE_MIN_ZOOM = 3.9;
/**
 * Unit symbols come last of the three. A formation marker is a sector anchor accurate to tens of
 * kilometres, so at theatre zoom the two sides' boxes overlap into a wall of symbols that reads
 * as far more precision than the data has. Holding them until roughly one oblast fills the frame
 * means a symbol only appears once the ground it refers to is big enough to place it on.
 */
const OOB_FORMATION_MIN_ZOOM = 5;
/** Formation names — one step tighter again, so the symbols land before their codes. */
const OOB_LABEL_MIN_ZOOM = 5.8;
/**
 * Garrisons — home stations, which are the one order-of-battle layer that is *not* about the
 * theatre. They are scattered from Odesa to Ussuriysk, so they read best at continental zoom and
 * would be meaningless clutter over the Donbas; hence earlier than the sector layers, and paired
 * with their own label gate.
 */
const OOB_GARRISON_MIN_ZOOM = 2.8;
const OOB_GARRISON_LABEL_MIN_ZOOM = 4;

/** Icon palette, keyed by the lowercase side key `warUnitIcon` parses out of a sprite id. */
const WAR_SIDE_ICON_COLOR: Record<string, string> = {
  rus: WAR_SIDE_META.RUS.color,
  ukr: WAR_SIDE_META.UKR.color,
};

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

/** 3D vehicles per corridor, spread evenly around the loop so a route reads as flow. */
const TRAVELLERS_PER_CORRIDOR = 3;
/** Samples drawn behind each traveller, fading out — the canvas globe's comet tail. */
const TRAIL_SAMPLES = 5;
/** Fraction of a corridor the trail spans. */
const TRAIL_SPAN = 0.045;
/** Seconds for one traveller to traverse a corridor end to end. */
const TRAVERSAL_MS = 14000;

/**
 * Idle cinematic globe spin — center longitude crawl in deg/min.
 *
 * 30°/min (0.5°/sec) is one full turn every 12 minutes: a drift you notice within a couple of
 * seconds of watching, but that never competes with the pins for attention. Raise for a more
 * obvious rotation, lower for a subtler one — this constant is the only knob.
 *
 * Suppressed entirely under `prefers-reduced-motion`, paused during interaction, and skipped
 * past {@link IDLE_SPIN_MAX_ZOOM} so it never fights a user who has zoomed into a region.
 */
const IDLE_SPIN_DEG_PER_MIN = 30;
/** 24 fps keeps the slow rotation visually continuous without forcing a 60 fps map repaint. */
const IDLE_SPIN_FRAME_MS = 1000 / 24;
/** Pulses invalidate the full map paint; 12 fps still reads smoothly for a slow breathing halo. */
const OVERLAY_EFFECT_FRAME_MS = 1000 / 12;
/** Picking traverses rendered-feature indexes and the satellite catalogue; 20 fps tracks a pointer cleanly. */
const HOVER_PICK_FRAME_MS = 1000 / 20;
/** At city zoom, pulsing off-screen theatre layers only forces wasteful full-map repaints. */
const PULSE_ANIMATION_MAX_ZOOM = 8;
/** Resume spin this long after the last user camera interaction. */
const IDLE_SPIN_RESUME_MS = 6000;
/** Skip spin once the camera leaves globe / wide-continent scale. */
const IDLE_SPIN_MAX_ZOOM = 5;

const PIN_LAYERS = [
  'wt-oob-formations',
  'wt-oob-sites',
  'wt-oob-garrisons',
  'wt-trade-chokepoints',
  'wt-trade-ports',
  'wt-migration-microevents',
  'wt-migration-entry-nodes',
  'wt-migration-hit',
  'wt-world-microevents',
  'wt-germany-mass-shootings',
  'wt-osint-pins',
  'wt-eonet-pins',
  'wt-cyber-events',
  'wt-war-events',
  'wt-iran-israel-events',
  'wt-strategic-radars',
  'wt-military-bases',
  'wt-event-markers',
  // Wide invisible strokes, queried after every dot so a symbol sitting on a line still wins the
  // hover: the order-of-battle belts first, then the trade lanes out at sea.
  'wt-oob-lines-hit',
  'wt-trade-hit',
] as const;

/** Invisible country polygons under every overlay — the dossier click target and hover latch. */
const COUNTRY_HIT_LAYER = 'wt-country-hit';

/**
 * Bound the WebGL back buffer independently from CSS pixels.
 *
 * A full-viewport globe at 1.5x DPR shades 2.25x as many pixels as a 1x canvas. Integrated GPUs
 * and touch devices are usually fill-rate bound here, so they stay at native CSS resolution;
 * stronger desktops retain a modest supersampling step without paying the old 1.5x cost.
 */
function globePixelRatio(): number {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return 1;
  const dpr = window.devicePixelRatio || 1;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const constrained = navigator.maxTouchPoints > 0 || cores <= 4 || memory <= 4;
  return Math.min(dpr, constrained ? 1 : 1.25);
}

/** Stable identity so the legend's `memo` holds while the catalogue is still downloading. */
const EMPTY_SATELLITE_COUNTS = SATELLITE_GROUPS.map(() => 0);

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
  /**
   * Densifying every corridor costs ~3 ms and allocates ~14k coordinate pairs, and nothing reads
   * it until a destination is latched by hover — which may never happen. So it is built on first
   * use, not on mount, keeping that work off the path between "globe mounted" and "globe drawn".
   *
   * (`useRef(build())` would be worse still: it evaluates its argument on *every* render and
   * throws all but the first result away, and the hover handlers call setState on mousemove.)
   */
  // `Map` here would resolve to MapLibre's, which this module imports as a type.
  const corridorPaths = useRef<ReturnType<typeof buildCorridorPaths> | null>(null);
  const getCorridorPaths = useCallback(() => {
    if (corridorPaths.current === null) corridorPaths.current = buildCorridorPaths();
    return corridorPaths.current;
  }, []);
  const getCorridorPathsRef = useRef(getCorridorPaths);
  getCorridorPathsRef.current = getCorridorPaths;
  const [ready, setReady] = useState(false);
  const [conflictEvents, setConflictEvents] = useState<ConflictEvent[]>([]);
  const [eonetPoints, setEonetPoints] = useState<EonetEventPoint[]>([]);
  const [osintPoints, setOsintPoints] = useState<OsintEventPoint[]>([]);
  const [hoverCard, setHoverCard] = useState<HoverCard | null>(null);
  const [selectedIncidentCard, setSelectedIncidentCard] = useState<HoverCard | null>(null);

  // ── Overlay switches
  // Mirrored into a ref because `installOverlays` reruns on every `styledata` and rebuilds the
  // layers from scratch — it has to re-apply the current choice, and it cannot read state.
  const [layerGroups, setLayerGroups] = useState<Record<GlobeLayerGroupId, boolean>>({
    trade: true,
    war: true,
    radar: true,
    crime: true,
  });
  const layerGroupsRef = useRef(layerGroups);
  layerGroupsRef.current = layerGroups;

  const toggleLayerGroup = useCallback((id: GlobeLayerGroupId) => {
    if (id === 'crime') setSelectedIncidentCard(null);
    setLayerGroups((current) => ({ ...current, [id]: !current[id] }));
  }, []);

  // ── Recon photo locator
  const [reconTarget, setReconTarget] = useState<ReconTarget | null>(null);
  const [reconPhase, setReconPhase] = useState<ReconPhase>('idle');
  const [reconScreen, setReconScreen] = useState<{ x: number; y: number } | null>(null);
  /** Read by the idle-spin branch of `animate` so the drift never fights an approach. */
  const reconActiveRef = useRef(false);
  const reconTimersRef = useRef<number[]>([]);

  const clearReconTimers = useCallback(() => {
    for (const timer of reconTimersRef.current) window.clearTimeout(timer);
    reconTimersRef.current = [];
  }, []);

  /**
   * Two-stage approach to a Recon fix.
   *
   * Stage one pulls the camera *out* to globe view and swings the target under it; stage two
   * descends to building level with pitch. Flying straight in from wherever the camera happens
   * to sit would read as a map pan — the pull-back is what makes it read as a planet rotating
   * to present the target, which is the whole point of doing this on a globe.
   */
  const handleReconLocate = useCallback(
    (target: ReconTarget) => {
      const map = mapRef.current;
      if (!map) return;
      const center: [number, number] = [target.longitude, target.latitude];

      clearReconTimers();
      map.stop();
      setReconTarget(target);
      reconActiveRef.current = true;

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduceMotion) {
        map.jumpTo({ center, zoom: 15.5, pitch: 0, bearing: 0 });
        setReconPhase('locked');
        reconActiveRef.current = false;
        return;
      }

      setReconPhase('approach');
      map.easeTo({
        center,
        zoom: 2.4,
        pitch: 0,
        bearing: 0,
        duration: 1500,
        essential: true,
      });

      reconTimersRef.current.push(
        window.setTimeout(() => {
          setReconPhase('descent');
          map.flyTo({
            center,
            zoom: 16.2,
            // An EXIF compass bearing means the photo was taken facing that way, so orienting
            // the descent to it lands the camera looking at roughly what the photographer saw.
            bearing: target.bearing ?? 28,
            pitch: 62,
            duration: 4200,
            curve: 1.5,
            essential: true,
          });
        }, 1560),
        window.setTimeout(() => setReconPhase('locked'), 5820),
      );
    },
    [clearReconTimers],
  );

  const handleReconClear = useCallback(() => {
    clearReconTimers();
    reconActiveRef.current = false;
    setReconTarget(null);
    setReconPhase('idle');
    setReconScreen(null);
  }, [clearReconTimers]);

  useEffect(() => clearReconTimers, [clearReconTimers]);

  // Keep the reticle pinned to its coordinate as the camera moves, and drop it once the
  // target rotates to the far side of the globe.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !reconTarget) {
      setReconScreen(null);
      return;
    }
    const sync = () => {
      const point = map.project([reconTarget.longitude, reconTarget.latitude]);
      const { width, height } = map.getCanvas();
      const ratio = window.devicePixelRatio || 1;
      const offscreen =
        point.x < -80 ||
        point.y < -80 ||
        point.x > width / ratio + 80 ||
        point.y > height / ratio + 80;
      setReconScreen(offscreen ? null : { x: point.x, y: point.y });
    };
    sync();
    map.on('move', sync);
    map.on('zoom', sync);
    return () => {
      map.off('move', sync);
      map.off('zoom', sync);
    };
  }, [reconTarget, ready]);

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
    let controller: AbortController | null = null;
    const cancelIdle = scheduleIdleTask(() => {
      controller = new AbortController();
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
    }, 800);
    return () => {
      cancelIdle();
      controller?.abort();
    };
  }, []);

  // NASA EONET natural-hazard layers — the default-on categories only, same as the old globe.
  useEffect(() => {
    let controller: AbortController | null = null;
    const cancelIdle = scheduleIdleTask(() => {
      const requestController = new AbortController();
      controller = requestController;
      const wanted = EONET_CATEGORIES.filter((category) => category.defaultOn);
      Promise.allSettled(
        wanted.map((category) => fetchEonetCategory(category.id, requestController.signal)),
      ).then((results) => {
        if (requestController.signal.aborted) return;
        const points = results.flatMap((result) =>
          result.status === 'fulfilled' ? result.value : [],
        );
        if (points.length) setEonetPoints(points);
      });
    }, 1200);
    return () => {
      cancelIdle();
      controller?.abort();
    };
  }, []);

  useEffect(() => {
    let controller: AbortController | null = null;
    const cancelIdle = scheduleIdleTask(() => {
      controller = new AbortController();
      const defaultOn = new Set(
        OSINT_CATEGORIES.filter((category) => category.defaultOn).map((category) => category.id),
      );
      fetchOsintFeed(controller.signal)
        .then((feed) => {
          if (controller?.signal.aborted) return;
          setOsintPoints(feed.points.filter((point) => defaultOn.has(point.categoryId)));
        })
        .catch(() => {
          /* the feed already falls back to its bundled fixture */
        });
    }, 1600);
    return () => {
      cancelIdle();
      controller?.abort();
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let cancelled = false;
    let frame = 0;
    let hoverFrame = 0;
    let idleSpinResumeTimer = 0;
    let dismissMigrationOnEscape: ((event: KeyboardEvent) => void) | null = null;
    let migrationVehicleLayer: MigrationVehicleLayer | null = null;

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
        // Keep the full-viewport back buffer inside a sustainable fill-rate budget.
        pixelRatio: globePixelRatio(),
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
        const base = resolveMilitaryBaseIcon(e.id, MILITARY_BLOC_COLOR);
        if (base) {
          map.addImage(e.id, base.image, { pixelRatio: base.pixelRatio });
          return;
        }
        const radar = resolveStrategicRadarIcon(e.id);
        if (radar) {
          map.addImage(e.id, radar.image, { pixelRatio: radar.pixelRatio });
          return;
        }
        const unit = resolveWarUnitIcon(e.id, WAR_SIDE_ICON_COLOR);
        if (unit) {
          map.addImage(e.id, unit.image, { pixelRatio: unit.pixelRatio });
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
      /**
       * Bumped once per animation frame by {@link animate}. MapLibre fires `move`, `zoom`,
       * `rotate` and `pitch` from the same `_render` pass, so a single wheel notch used to run
       * the anchor projection and the satellite badge sync two to four times for one painted
       * frame. Handlers compare against this instead, which collapses them to one — and works
       * regardless of whether our RAF callback is scheduled before or after MapLibre's, since
       * all the events in one frame observe the same value either way.
       */
      let frameTick = 0;

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
        if (satelliteHoverIndexRef.current !== null) {
          satelliteHoverIndexRef.current = null;
          setSatelliteHover(null);
        }
        setHoverCard(null);
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
        const targetOpacity = satelliteOpacityForZoom(map.getZoom());
        // Keep the orbital shells rendered while wheel, drag and touch gestures move the camera.
        // `movestart` fires for every wheel sequence; hiding the custom layer there made the
        // entire catalogue blink out until MapLibre eventually emitted `moveend`.
        satelliteLayerRef.current?.setOpacity(targetOpacity);
        if (!mapInteracting) syncSatelliteOverlays(targetOpacity);
        // Drives both the legend and the worker: nothing is fetched or propagated until the
        // camera has actually pulled back far enough to show a shell.
        setSatellitesInView((current) =>
          current === targetOpacity > 0 ? current : targetOpacity > 0,
        );
      };

      // Panning and rotating move the dot without changing zoom, so the badge has to follow.
      let satelliteOverlayFrame = -1;
      map.on('move', () => {
        if (mapInteracting) return;
        if (satelliteOverlayFrame === frameTick) return;
        satelliteOverlayFrame = frameTick;
        syncSatelliteOverlays(satelliteOpacityForZoom(map.getZoom()));
      });

      map.on('zoom', () => {
        syncTerrain(map);
        satelliteOverlayFrame = frameTick;
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
        syncSatelliteShells();
        scheduleIdleSpinResume();
      });

      let anchorFrame = -1;
      /** Marker lookup for {@link NEWS_ISOS}, rebuilt only when the marker list itself changes. */
      let newsMarkers: Array<GlobeMarker | undefined> = [];
      let newsMarkersFor: GlobeMarker[] | null = null;

      const syncAnchors = () => {
        // `move` + `zoom` + `rotate` + `pitch` all fire for one camera change; project once.
        if (anchorFrame === frameTick) return;
        anchorFrame = frameTick;

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

        if (newsMarkersFor !== markersRef.current) {
          newsMarkersFor = markersRef.current;
          newsMarkers = NEWS_ISOS.map((iso) => newsMarkersFor?.find((m) => m.iso === iso));
        }

        for (let index = 0; index < NEWS_ISOS.length; index++) {
          const marker = newsMarkers[index];
          const target = newsAnchors.current[NEWS_ISOS[index]];
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
      /** Corridor + label geometry is built on the first latch — see {@link showMigrationTarget}. */
      let migrationSourcesFilled = false;
      /** After Escape, require the pointer to leave this destination before it may latch again. */
      let dismissedMigrationIso: string | null = null;

      const setMigrationFilters = (iso: string) => {
        if (!map.getLayer('wt-migration-casing')) return false;

        map.setFilter('wt-migration-casing', ['==', ['get', 'targetIso'], iso]);
        map.setFilter('wt-migration-hit', ['==', ['get', 'targetIso'], iso]);
        map.setFilter('wt-migration-route-labels', [
          'all',
          ['==', ['get', 'targetIso'], iso],
          ['==', ['get', 'labelLeg'], true],
        ]);
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
        return true;
      };

      const showMigrationTarget = (iso: string | null | undefined) => {
        // Only latch onto destinations that actually have corridors — hovering a European
        // country with none (or ocean / non-EU land) leaves the previous set on screen.
        if (!iso || !hasMigrationCorridors(iso)) {
          dismissedMigrationIso = null;
          return;
        }
        if (iso === dismissedMigrationIso) return;
        dismissedMigrationIso = null;
        if (iso === activeMigrationIso.current) return;
        if (!map.getLayer('wt-migration-casing')) return;

        // First latch pays for the corridor geometry; every later one is just a filter swap.
        if (!migrationSourcesFilled) {
          migrationSourcesFilled = true;
          (map.getSource('wt-migration-corridors') as GeoJSONSource | undefined)?.setData(
            migrationCorridorsGeoJson(),
          );
          (map.getSource('wt-migration-labels') as GeoJSONSource | undefined)?.setData(
            migrationLabelsGeoJson(),
          );
        }

        if (!setMigrationFilters(iso)) return;
        activeMigrationIso.current = iso;
        renderedStaticFor = null;
      };

      const dismissMigrationTarget = () => {
        const iso = activeMigrationIso.current;
        if (!iso || !setMigrationFilters(NO_ISO)) return;

        dismissedMigrationIso = iso;
        activeMigrationIso.current = null;
        renderedStaticFor = null;
        migrationVehicleLayer?.setUnits([]);
        (map.getSource('wt-migration-travellers') as GeoJSONSource | undefined)?.setData(
          EMPTY_FEATURE_COLLECTION,
        );
      };

      dismissMigrationOnEscape = (event) => {
        if (event.key !== 'Escape' || event.defaultPrevented || event.isComposing) return;
        setSelectedIncidentCard(null);
        dismissMigrationTarget();
      };
      window.addEventListener('keydown', dismissMigrationOnEscape);

      // ── Pins beat countries ────────────────────────────────────────────────
      // Event / war / hazard / intel pins sit on top of the country hit polygons, so both a
      // click and a hover must resolve against them first — otherwise brushing a marker would
      // silently swap the migration overlay underneath it.
      /**
       * Both tiers in a single query. `queryRenderedFeatures` is by far the costliest part of a
       * hover, and it already returns topmost-first, so asking for the pin layers and the
       * country hit polygons together resolves "which pin" and "which destination sits under
       * it" in one pass — the handlers used to run this two or three times per pointer sample.
       */
      const queryAt = (point: MapMouseEvent['point']) => {
        // Pins are minzoom-gated; war theatres reveal earlier than news/EONET/OSINT.
        const zoom = map.getZoom();
        const revealZoom = (layer: (typeof PIN_LAYERS)[number]) => {
          if (layer === 'wt-war-events') return WAR_EVENT_MIN_ZOOM;
          if (layer === 'wt-iran-israel-events') return IRAN_ISRAEL_EVENT_MIN_ZOOM;
          if (layer === 'wt-strategic-radars') return STRATEGIC_RADAR_MIN_ZOOM;
          if (layer === 'wt-military-bases') return MILITARY_BASE_MIN_ZOOM;
          if (layer === 'wt-migration-entry-nodes') return ENTRY_NODE_MIN_ZOOM;
          if (layer === 'wt-migration-microevents') return MICROEVENT_MIN_ZOOM;
          if (layer === 'wt-migration-hit') return MIN_ZOOM;
          if (layer === 'wt-world-microevents') return WORLD_MICROEVENT_MIN_ZOOM;
          if (layer === 'wt-germany-mass-shootings') return GERMANY_MASS_SHOOTING_MIN_ZOOM;
          if (layer === 'wt-trade-hit') return MIN_ZOOM;
          if (layer === 'wt-trade-chokepoints' || layer === 'wt-trade-ports') {
            return TRADE_NODE_MIN_ZOOM;
          }
          if (layer === 'wt-oob-formations') return OOB_FORMATION_MIN_ZOOM;
          if (layer === 'wt-oob-lines-hit') return OOB_REVEAL_ZOOM;
          if (layer === 'wt-oob-sites') return OOB_SITE_MIN_ZOOM;
          if (layer === 'wt-oob-garrisons') return OOB_GARRISON_MIN_ZOOM;
          return EVENT_PIN_MIN_ZOOM;
        };
        // Trade is the one layer family that switches off as the camera closes in, so it needs an
        // upper bound too — without it the lanes stay hoverable long after they have faded out.
        const hideZoom = (layer: (typeof PIN_LAYERS)[number]) =>
          layer.startsWith('wt-trade-') ? TRADE_FADE_END_ZOOM : Infinity;

        const layers: string[] = [];
        for (const layer of PIN_LAYERS) {
          if (!map.getLayer(layer)) continue;
          if (zoom < revealZoom(layer) || zoom >= hideZoom(layer)) continue;
          layers.push(layer);
        }
        if (map.getLayer(COUNTRY_HIT_LAYER)) layers.push(COUNTRY_HIT_LAYER);
        if (!layers.length) return { pin: undefined, country: undefined };

        let pin: MapGeoJSONFeature | undefined;
        let country: MapGeoJSONFeature | undefined;
        for (const feature of map.queryRenderedFeatures(point, { layers })) {
          if (feature.layer.id === COUNTRY_HIT_LAYER) country ??= feature;
          else pin ??= feature;
          if (pin && country) break;
        }
        return { pin, country };
      };

      const describePin = (
        feature: MapGeoJSONFeature,
        event: MapMouseEvent,
      ): HoverCard => {
        const p = feature.properties ?? {};
        const layer = feature.layer.id;
        const base = { x: event.point.x, y: event.point.y };

        if (layer === 'wt-oob-formations') {
          // The precision caveat goes in the footer, next to the source and the assessment date,
          // so a sector anchor can never be read off the card as a unit location.
          return {
            ...base,
            color: String(p.color ?? '#ffffff'),
            code: String(p.code ?? 'UNIT'),
            kind: `${p.sideLabel ?? ''} · ${p.sector ?? ''}`,
            title: String(p.name ?? ''),
            body: [p.note, p.subordinates ? `Reported subordinates: ${p.subordinates}` : '']
              .filter(Boolean)
              .join(' '),
            footer: [p.commander, p.precisionLabel, `Assessed ${OOB_ASSESSED_AT}`, p.sourceOrg]
              .filter(Boolean)
              .join(' · '),
            url: p.sourceUrl ? String(p.sourceUrl) : undefined,
          };
        }
        if (layer === 'wt-oob-lines-hit') {
          return {
            ...base,
            color: String(p.color ?? '#ffffff'),
            code: 'FORT',
            kind: `${p.sideLabel ?? ''} · ${
              p.status === 'under construction' ? 'Under construction' : 'Established'
            }`,
            title: String(p.name ?? ''),
            body: String(p.note ?? ''),
            footer: [
              'Schematic — reported belt, not traced from imagery',
              `Assessed ${OOB_ASSESSED_AT}`,
              p.sourceOrg,
            ]
              .filter(Boolean)
              .join(' · '),
            url: p.sourceUrl ? String(p.sourceUrl) : undefined,
          };
        }
        if (layer === 'wt-oob-sites') {
          return {
            ...base,
            color: String(p.color ?? '#ffffff'),
            code: String(p.kindLabel ?? 'SITE').slice(0, 4).toUpperCase(),
            kind: `${p.sideLabel ?? ''} · ${p.kindLabel ?? ''}`,
            title: String(p.name ?? ''),
            body: String(p.note ?? ''),
            footer: [p.place, p.sourceOrg].filter(Boolean).join(' · '),
            url: p.sourceUrl ? String(p.sourceUrl) : undefined,
          };
        }
        if (layer === 'wt-oob-garrisons') {
          // "Home station" leads the card, because the one way to misread this marker is as a
          // deployment. Where the axis is public it follows as a separate line.
          return {
            ...base,
            color: String(p.color ?? '#ffffff'),
            code: String(p.code ?? 'GAR'),
            kind: `${p.sideLabel ?? ''} · Home station`,
            title: String(p.formation ?? ''),
            body: [p.note, p.committedTo ? `Reported committed: ${p.committedTo}` : '']
              .filter(Boolean)
              .join(' '),
            footer: [p.place, `Assessed ${OOB_ASSESSED_AT}`, p.sourceOrg]
              .filter(Boolean)
              .join(' · '),
            url: p.sourceUrl ? String(p.sourceUrl) : undefined,
          };
        }
        if (layer === 'wt-trade-hit') {
          // Route direction is the point of the card, so the endpoints lead and the cargo
          // family and chokepoints follow as the reason the lane runs where it does.
          const status =
            p.status === 'diversion'
              ? 'Diversion'
              : p.status === 'seasonal'
                ? 'Seasonal route'
                : 'Trade lane';
          return {
            ...base,
            color: String(p.color ?? '#2fd4bf'),
            code: 'LANE',
            kind: `${status} · ${p.commodityLabel ?? ''}`,
            title: `${p.fromName} → ${p.toName}`,
            body: String(p.note ?? ''),
            footer: [
              p.volume,
              p.distanceNm ? `${Number(p.distanceNm).toLocaleString()} nm` : '',
              p.chokepoints,
            ]
              .filter(Boolean)
              .join(' · '),
            url: p.sourceUrl ? String(p.sourceUrl) : undefined,
          };
        }
        if (layer === 'wt-migration-hit') {
          const isIrregular = p.status === 'irregular';
          const mode = String(p.mode ?? 'land') as keyof typeof MIGRATION_ACCENT;
          return {
            ...base,
            color: isIrregular
              ? MIGRATION_ACCENT.irregular
              : MIGRATION_ACCENT[mode] ?? MIGRATION_ACCENT.land,
            code: String(p.mode ?? 'route').slice(0, 4).toUpperCase(),
            kind: `${isIrregular ? 'Irregular' : 'Regular'} · ${p.mode ?? 'mixed'} route`,
            title: String(p.label ?? p.shortRouteName ?? 'Migration route'),
            body: [
              `Estimated annual flow: ${p.annualEstimateLabel ?? 'not available'}.`,
              p.annualEstimateRange ? `Plausible range: ${p.annualEstimateRange}.` : '',
              'Modeled allocation—not a count of unique people.',
            ]
              .filter(Boolean)
              .join(' '),
            footer: [
              p.estimateYear ? `${p.estimateYear} estimate` : '',
              p.estimateMethod,
              p.estimateSourceOrg,
            ]
              .filter(Boolean)
              .join(' · '),
            url: p.sourceUrl ? String(p.sourceUrl) : undefined,
          };
        }
        if (layer === 'wt-trade-chokepoints') {
          return {
            ...base,
            color: String(p.color ?? '#ff8f5e'),
            code: String(p.code ?? 'CHK'),
            kind: 'Chokepoint',
            title: String(p.name ?? ''),
            body: String(p.note ?? ''),
            footer: [
              p.volume,
              p.laneCount ? `${p.laneCount} lanes on this map` : '',
              p.sourceOrg,
            ]
              .filter(Boolean)
              .join(' · '),
            url: p.sourceUrl ? String(p.sourceUrl) : undefined,
          };
        }
        if (layer === 'wt-trade-ports') {
          return {
            ...base,
            color: String(p.color ?? '#dbe4ec'),
            code: String(p.portCode ?? 'PORT'),
            kind: 'Port',
            title: String(p.name ?? ''),
            body: String(p.note ?? ''),
            footer: [p.country, p.laneCount ? `${p.laneCount} lanes on this map` : '']
              .filter(Boolean)
              .join(' · '),
          };
        }
        if (layer === 'wt-migration-entry-nodes') {
          // The precision tag goes in the footer next to the source, so a sector centroid can
          // never be read off the card as a location.
          return {
            ...base,
            color: String(p.color ?? '#ffffff'),
            code: String(p.code ?? 'NODE'),
            kind: String(p.kindTitle ?? 'Entry node'),
            title: [p.name, p.address].filter(Boolean).join(' — '),
            body: String(p.summary ?? ''),
            footer: [p.detail, p.sourceOrg].filter(Boolean).join(' · '),
            url: p.sourceUrl ? String(p.sourceUrl) : undefined,
          };
        }
        if (layer === 'wt-migration-microevents') {
          return {
            ...base,
            color: String(p.color ?? '#e0483b'),
            code: String(p.code ?? 'RPT'),
            kind: p.format === 'video' ? 'Video report' : 'Report',
            title: String(p.headline ?? ''),
            body: String(p.summary ?? ''),
            footer: [p.outlet, p.date, p.place].filter(Boolean).join(' · '),
            url: p.url ? String(p.url) : undefined,
          };
        }
        if (layer === 'wt-world-microevents') {
          // The precision caveat rides in the footer next to the source, so an `area` or
          // `national` record can never be read off the globe as a place where something
          // happened — same contract as the order-of-battle sector anchors.
          return {
            ...base,
            color: String(p.color ?? '#ffffff'),
            code: String(p.code ?? 'NEWS'),
            kind: String(p.categoryLabel ?? 'Event'),
            title: String(p.headline ?? ''),
            body: String(p.summary ?? ''),
            footer: [p.dateLabel, p.place, p.precisionLabel, p.outlet]
              .filter(Boolean)
              .join(' · '),
            url: p.url ? String(p.url) : undefined,
          };
        }
        if (layer === 'wt-germany-mass-shootings') {
          return {
            ...base,
            color: String(p.color ?? GERMANY_MASS_SHOOTING_META.fatal.color),
            code: String(p.code ?? 'FAT'),
            kind: String(p.categoryLabel ?? 'Mass shooting'),
            title: String(p.title ?? ''),
            body: String(p.summary ?? ''),
            footer: [
              p.dateLabel,
              p.place,
              p.casualtyLabel,
              p.precisionLabel,
              p.outlet,
            ]
              .filter(Boolean)
              .join(' · '),
            url: p.url ? String(p.url) : undefined,
          };
        }
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
        if (layer === 'wt-cyber-events') {
          // Impact carries the reported loss figure, which is the point of the layer — keep it
          // in the body next to the summary rather than losing it in the dimmed footer.
          return {
            ...base,
            color: String(p.color ?? '#ef4444'),
            code: String(p.code ?? 'CYB'),
            kind: String(p.categoryTitle ?? 'Cyber incident'),
            title: String(p.title ?? ''),
            body: [p.summary, p.impact ? `Impact: ${p.impact}` : ''].filter(Boolean).join(' '),
            footer: [p.placeName, p.reported].filter(Boolean).join(' · '),
            url: p.sourceUrl ? String(p.sourceUrl) : undefined,
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
        if (layer === 'wt-strategic-radars') {
          return {
            ...base,
            color: String(p.color ?? '#72aeb2'),
            code: 'RADR',
            kind: String(p.missionLabel ?? 'Strategic radar'),
            title: String(p.name ?? ''),
            body: [p.system, p.note].filter(Boolean).join(' · '),
            footer: [
              p.host,
              p.operator,
              'Approximate public location',
              `Assessed ${STRATEGIC_RADAR_ASSESSED_AT}`,
              p.sourceOrg,
            ]
              .filter(Boolean)
              .join(' · '),
            url: p.sourceUrl ? String(p.sourceUrl) : undefined,
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

      /** Writing `style.cursor` invalidates style even when the value is unchanged. */
      const setCursor = (next: 'pointer' | 'grab') => {
        const canvas = map.getCanvas();
        if (canvas.style.cursor !== next) canvas.style.cursor = next;
      };

      const processHover = (event: MapMouseEvent) => {
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
            setCursor('pointer');
            return;
          }
          satelliteHoverIndexRef.current = null;
          setSatelliteHover(null);
        } else if (satelliteHoverIndexRef.current !== null) {
          // Shells are dark (zoomed in past the fade): drop any badge left over from wider zoom.
          satelliteHoverIndexRef.current = null;
          setSatelliteHover(null);
        }

        const { pin, country } = queryAt(event.point);
        if (pin) {
          setHoverCard(describePin(pin, event));
          setCursor('pointer');
          // Pins win the cursor/card, but still latch migration if a destination sits under them.
          showMigrationTarget(country?.properties?.iso as string | undefined);
          return;
        }
        setHoverCard(null);

        showMigrationTarget(country?.properties?.iso as string | undefined);
        setCursor(country ? 'pointer' : 'grab');
        if (country) onPrefetchRef.current?.();
      };

      let pendingHoverEvent: MapMouseEvent | null = null;
      let lastHoverSample = 0;
      const flushHover = (now: number) => {
        if (mapInteracting) {
          hoverFrame = 0;
          return;
        }

        if (now - lastHoverSample < HOVER_PICK_FRAME_MS) {
          hoverFrame = window.requestAnimationFrame(flushHover);
          return;
        }

        hoverFrame = 0;
        const latest = pendingHoverEvent;
        pendingHoverEvent = null;
        if (!latest) return;

        lastHoverSample = now;
        processHover(latest);
      };

      map.on('mousemove', (event) => {
        pendingHoverEvent = event;
        // Pointer hardware can report hundreds of samples per second. Satellite picking scans
        // the whole catalogue and rendered-feature queries hit MapLibre's spatial index, so do
        // both at most thirty times per second and never while drag/zoom already owns the thread.
        if (mapInteracting || hoverFrame) return;
        hoverFrame = window.requestAnimationFrame(flushHover);
      });

      map.on('mouseout', () => {
        pendingHoverEvent = null;
        if (hoverFrame) {
          window.cancelAnimationFrame(hoverFrame);
          hoverFrame = 0;
        }
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

        const { pin, country } = queryAt(event.point);
        if (pin) {
          if (pin.layer.id === 'wt-germany-mass-shootings') {
            setSelectedIncidentCard(describePin(pin, event));
            setHoverCard(null);
            return;
          }
          setSelectedIncidentCard(null);
          const url = pin.properties?.sourceUrl || pin.properties?.url;
          if (typeof url === 'string' && /^https?:\/\//.test(url)) {
            window.open(url, '_blank', 'noopener,noreferrer');
          }
          return;
        }
        setSelectedIncidentCard(null);
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

          // Geometry below is fetched from /geo — register the sources empty so the layers
          // can be built synchronously, then fill them in when each payload lands.
          source('wt-country-shapes', EMPTY_FEATURE_COLLECTION);
          source('wt-world-borders', EMPTY_FEATURE_COLLECTION);
          source('wt-disputed-borders', EMPTY_FEATURE_COLLECTION);
          source('wt-military-bases', EMPTY_FEATURE_COLLECTION);
          source('wt-strategic-radars', strategicRadarStationsGeoJson());
          const fillSource = (id: string, load: () => Promise<GeoJSON.FeatureCollection>) => {
            void load()
              .then((data) => {
                (mapRef.current?.getSource(id) as GeoJSONSource | undefined)?.setData(data);
              })
              .catch((error) => {
                console.error(`[globe] ${id} geometry failed to load`, error);
              });
          };

          /**
           * Fill a source the first time the camera reaches `startZoom`. Callers pass a zoom a
           * level *below* the layer's own reveal so the payload is in flight before anything
           * needs it, and it listens on `zoom` rather than `zoomend` so a single long dive-in
           * starts the fetch on the way down instead of after it lands. Checked immediately too,
           * so a deep link that opens straight into a city still gets its geometry.
           */
          const deferUntilZoom = (
            id: string,
            startZoom: number,
            load: () => Promise<GeoJSON.FeatureCollection>,
          ) => {
            const check = () => {
              if (map.getZoom() < startZoom) return;
              map.off('zoom', check);
              fillSource(id, load);
            };
            map.on('zoom', check);
            check();
          };
          source('wt-region-ancestry', EMPTY_FEATURE_COLLECTION);
          fillSource('wt-country-shapes', () => countryShapesGeoJson(markersRef.current));
          fillSource('wt-world-borders', worldBordersGeoJson);
          fillSource('wt-disputed-borders', disputedBordersGeoJson);
          // The choropleth (795 KB / 54k coordinates) and the installation catalogue (257 KB)
          // are the two largest payloads on the globe, and neither layer draws below its reveal
          // zoom — the camera opens at z1.4. Fetching, parsing and densifying them on mount cost
          // roughly a megabyte and tens of milliseconds of main thread for nothing visible, so
          // each waits until the camera is actually approaching the zoom that reveals it.
          deferUntilZoom('wt-region-ancestry', ANCESTRY_REVEAL_ZOOM - 1.6, regionAncestryGeoJson);
          deferUntilZoom('wt-military-bases', MILITARY_BASE_MIN_ZOOM - 1, militaryBasesGeoJson);
          // Both corridor sources are filtered to `NO_ISO` until a destination is hovered, so
          // building them up front only delays first paint; `showMigrationTarget` fills them in
          // on the first latch, before the filters that would reveal them are applied.
          source('wt-migration-corridors', EMPTY_FEATURE_COLLECTION);
          source('wt-migration-labels', EMPTY_FEATURE_COLLECTION);
          // Facility-precision nodes and their reporting are city-zoom detail; building them at
          // z1.4 is work for layers seven zoom levels away.
          source('wt-migration-entry-nodes', EMPTY_FEATURE_COLLECTION);
          source('wt-migration-microevents', EMPTY_FEATURE_COLLECTION);
          deferUntilZoom('wt-migration-entry-nodes', ENTRY_NODE_MIN_ZOOM - 1, async () =>
            migrationEntryNodesGeoJson(),
          );
          deferUntilZoom('wt-migration-microevents', MICROEVENT_MIN_ZOOM - 1, async () =>
            migrationMicroEventsGeoJson(),
          );
          // 1,100+ records (~87 KB gzip) live in their own dynamically-imported chunk so the globe
          // boot bundle stays lean. The layer reveals at WORLD_MICROEVENT_MIN_ZOOM, above the z1.4
          // opening camera, so the data downloads as the camera approaches it, not on mount.
          source('wt-world-microevents', EMPTY_FEATURE_COLLECTION);
          deferUntilZoom(
            'wt-world-microevents',
            WORLD_MICROEVENT_MIN_ZOOM - 0.4,
            worldMicroEventsGeoJson,
          );
          source('wt-germany-mass-shootings', EMPTY_FEATURE_COLLECTION);
          deferUntilZoom(
            'wt-germany-mass-shootings',
            GERMANY_MASS_SHOOTING_MIN_ZOOM - 0.5,
            germanyMassShootingsGeoJson,
          );
          source('wt-migration-travellers', EMPTY_FEATURE_COLLECTION);
          source('wt-oob-formations', warFormationsGeoJson());
          source('wt-oob-lines', warDefensiveLinesGeoJson());
          source('wt-oob-sites', warMilitarySitesGeoJson());
          source('wt-oob-garrisons', warGarrisonsGeoJson());
          source('wt-trade-routes', tradeRoutesGeoJson());
          source('wt-trade-chokepoints', tradeChokepointsGeoJson());
          source('wt-trade-ports', tradePortsGeoJson());
          source('wt-war-zones', warControlZonesGeoJson());
          source('wt-war-contested', warContestedGeoJson());
          source('wt-war-frontline', warFrontlineGeoJson());
          source('wt-war-events', warEventsGeoJson());
          source('wt-war-settlements', warSettlementsGeoJson());
          source('wt-iran-israel-events', israelIranEventsGeoJson());
          source('wt-events', EMPTY_FEATURE_COLLECTION);
          source('wt-eonet', EMPTY_FEATURE_COLLECTION);
          source('wt-osint', EMPTY_FEATURE_COLLECTION);
          source('wt-cyber', cyberEventsGeoJson());
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

          // ── Per-region ancestry choropleth (DEU / FRA / ITA) ─────────────
          // Sits directly above the country hit-test fill so every other overlay — war,
          // corridors, bases, pins — still draws on top of it.
          const ancestryFade: import('maplibre-gl').ExpressionSpecification = [
            'interpolate',
            ['linear'],
            ['zoom'],
            ANCESTRY_REVEAL_ZOOM - 0.6,
            0,
            ANCESTRY_REVEAL_ZOOM,
            1,
          ];

          map.addLayer({
            id: 'wt-region-ancestry-fill',
            type: 'fill',
            source: 'wt-region-ancestry',
            minzoom: ANCESTRY_REVEAL_ZOOM - 0.6,
            paint: {
              'fill-color': ['get', 'color'],
              // A region that is 5% non-European should read far fainter than one at 40%, so
              // opacity tracks the minority total rather than being flat per group.
              //
              // The zoom fade has to BE the outer interpolate: MapLibre rejects a `['zoom']`
              // expression nested inside any other expression ("zoom expression may only be
              // used as input to a top-level step or interpolate"), and a throw here is
              // swallowed by installOverlays' retry, which silently drops every overlay.
              // A top-level zoom interpolate whose outputs are data expressions is allowed.
              'fill-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                ANCESTRY_REVEAL_ZOOM - 0.6,
                0,
                ANCESTRY_REVEAL_ZOOM,
                [
                  'interpolate',
                  ['linear'],
                  ['get', 'minorityShare'],
                  0,
                  0.06,
                  10,
                  0.24,
                  25,
                  0.42,
                  50,
                  0.6,
                  90,
                  0.72,
                ],
              ],
            },
          });

          map.addLayer({
            id: 'wt-region-ancestry-edge',
            type: 'line',
            source: 'wt-region-ancestry',
            minzoom: ANCESTRY_REVEAL_ZOOM - 0.6,
            layout: { 'line-join': 'round' },
            paint: {
              'line-color': 'rgba(255,255,255,0.28)',
              'line-width': ['interpolate', ['linear'], ['zoom'], 4, 0.4, 8, 1.1],
              'line-opacity': ancestryFade,
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

          // ── Seaborne trade lanes ──────────────────────────────────────────
          // Drawn under the migration corridors: migration is a hover-latched answer to "who
          // comes here", trade is the standing background of "what moves where", and when both
          // are lit the hovered one should win.
          //
          // The fade has to BE the outer expression every time it is used. MapLibre rejects a
          // `['zoom']` expression nested inside any other expression, and a throw here is
          // swallowed by installOverlays' retry, which silently drops *every* overlay — the same
          // trap documented on the ancestry fill above. So `tradeFade` takes the opacity at full
          // strength and interpolates it to zero, rather than being multiplied into one.
          const tradeFade = (
            full: number | import('maplibre-gl').ExpressionSpecification,
          ): import('maplibre-gl').ExpressionSpecification => [
            'interpolate',
            ['linear'],
            ['zoom'],
            TRADE_FADE_START_ZOOM,
            full,
            TRADE_FADE_END_ZOOM,
            0,
          ];

          map.addLayer({
            id: 'wt-trade-casing',
            type: 'line',
            source: 'wt-trade-routes',
            maxzoom: TRADE_FADE_END_ZOOM,
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
              'line-color': 'rgba(0,0,0,0.75)',
              'line-width': ['interpolate', ['linear'], ['zoom'], 0, 3.4, 4, 5.2, 7, 7.0],
              'line-opacity': tradeFade(0.8),
              'line-blur': 0.4,
            },
          });

          map.addLayer({
            id: 'wt-trade-lanes',
            type: 'line',
            source: 'wt-trade-routes',
            maxzoom: TRADE_FADE_END_ZOOM,
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
              'line-color': ['get', 'color'],
              'line-width': ['interpolate', ['linear'], ['zoom'], 0, 1.15, 4, 1.9, 7, 2.8],
              // A diverted or seasonal lane is not the standing routing, so it reads fainter as
              // well as dashed — the dash alone disappears at globe zoom.
              'line-opacity': tradeFade(['match', ['get', 'status'], 'primary', 0.92, 0.7]),
              'line-dasharray': [
                'match',
                ['get', 'status'],
                'primary',
                ['literal', [1, 0]],
                ['literal', [2.6, 2.0]],
              ],
            },
          });

          // Invisible wide stroke: a 2 px lane is nearly impossible to hover at globe zoom.
          map.addLayer({
            id: 'wt-trade-hit',
            type: 'line',
            source: 'wt-trade-routes',
            maxzoom: TRADE_FADE_END_ZOOM,
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
              'line-color': 'rgba(0,0,0,0)',
              'line-width': ['interpolate', ['linear'], ['zoom'], 0, 9, 6, 14],
            },
          });

          map.addLayer({
            id: 'wt-trade-ports',
            type: 'circle',
            source: 'wt-trade-ports',
            minzoom: TRADE_NODE_MIN_ZOOM,
            maxzoom: TRADE_FADE_END_ZOOM,
            paint: {
              // Hub ports anchor several lanes; single-lane berths stay small so the map does not
              // read as 25 equally important dots.
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                2,
                ['interpolate', ['linear'], ['get', 'laneCount'], 1, 1.8, 6, 3.4],
                6,
                ['interpolate', ['linear'], ['get', 'laneCount'], 1, 3.2, 6, 5.6],
              ],
              'circle-color': ['get', 'color'],
              'circle-opacity': tradeFade(0.9),
              'circle-stroke-color': '#000000',
              'circle-stroke-width': 1.1,
              'circle-stroke-opacity': tradeFade(1),
            },
          });

          map.addLayer({
            id: 'wt-trade-chokepoints',
            type: 'circle',
            source: 'wt-trade-chokepoints',
            minzoom: TRADE_NODE_MIN_ZOOM,
            maxzoom: TRADE_FADE_END_ZOOM,
            paint: {
              'circle-radius': ['interpolate', ['linear'], ['zoom'], 2, 3.6, 6, 6.4],
              'circle-color': 'rgba(0,0,0,0.55)',
              'circle-opacity': tradeFade(1),
              'circle-stroke-color': ['get', 'color'],
              'circle-stroke-width': ['interpolate', ['linear'], ['zoom'], 2, 1.6, 6, 2.2],
              'circle-stroke-opacity': tradeFade(1),
            },
          });

          map.addLayer({
            id: 'wt-trade-chokepoint-labels',
            type: 'symbol',
            source: 'wt-trade-chokepoints',
            minzoom: TRADE_LABEL_MIN_ZOOM,
            maxzoom: TRADE_FADE_END_ZOOM,
            layout: {
              'text-field': ['get', 'name'],
              'text-font': ['Noto Sans Regular'],
              'text-size': ['interpolate', ['linear'], ['zoom'], 2.6, 9.5, 6, 12],
              'text-offset': [0, 1.2],
              'text-anchor': 'top',
              'text-letter-spacing': 0.08,
              'text-allow-overlap': false,
            },
            paint: {
              'text-color': ['get', 'color'],
              'text-halo-color': 'rgba(0,0,0,0.9)',
              'text-halo-width': 1.5,
              'text-opacity': tradeFade(1),
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

          // Wide transparent stroke makes every researched corridor inspectable without forcing
          // the user to hit a 2–4 px line exactly. It carries the route name and estimate card.
          map.addLayer({
            id: 'wt-migration-hit',
            type: 'line',
            source: 'wt-migration-corridors',
            filter: ['==', ['get', 'targetIso'], NO_ISO],
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
              // A mathematically zero alpha can be culled from rendered-feature queries on some
              // MapLibre/WebGL paths; 1% black remains imperceptible but preserves hit testing.
              'line-color': '#000000',
              'line-opacity': 0.01,
              'line-width': ['interpolate', ['linear'], ['zoom'], 0, 10, 7, 16],
            },
          });

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

          // Procedural low-poly Airbus, ferry and car meshes. The custom layer uses the same
          // sampled positions as the tails, but renders real depth-tested geometry above them.
          if (!map.getLayer('wt-migration-vehicles')) {
            migrationVehicleLayer = createMigrationVehicleLayer('wt-migration-vehicles', map);
            map.addLayer(migrationVehicleLayer);
          }

          // One collision-aware label at the centre of each corridor's longest leg. Short route
          // names keep the atlas scannable; the hover card preserves the full researched chain.
          map.addLayer({
            id: 'wt-migration-route-labels',
            type: 'symbol',
            source: 'wt-migration-corridors',
            filter: [
              'all',
              ['==', ['get', 'targetIso'], NO_ISO],
              ['==', ['get', 'labelLeg'], true],
            ],
            layout: {
              'symbol-placement': 'line-center',
              'text-field': [
                'format',
                ['get', 'shortRouteName'],
                {},
                '\n',
                {},
                ['get', 'annualEstimateLabel'],
                { 'font-scale': 0.78 },
              ],
              'text-font': ['Noto Sans Regular'],
              'text-size': ['interpolate', ['linear'], ['zoom'], 1, 8.5, 6, 10.5, 12, 12.5],
              'text-letter-spacing': 0.04,
              'text-max-width': 18,
              'text-keep-upright': true,
              'text-allow-overlap': false,
              'text-ignore-placement': false,
            },
            paint: {
              'text-color': [...MIGRATION_ACCENT_EXPR],
              'text-halo-color': 'rgba(0,0,0,0.96)',
              'text-halo-width': 1.8,
              'text-halo-blur': 0.25,
              'text-opacity': ['interpolate', ['linear'], ['zoom'], 0.8, 0, 1.5, 0.92, 5, 1],
            },
          });

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

          // ── Facility-precision entry nodes (city zoom) ────────────────────
          // Deliberately unfiltered by the latched destination: past z8.5 only one place is
          // on screen, so gating these on a country hover would just make them flicker.
          map.addLayer({
            id: 'wt-migration-entry-nodes',
            type: 'circle',
            source: 'wt-migration-entry-nodes',
            minzoom: ENTRY_NODE_MIN_ZOOM,
            paint: {
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                ENTRY_NODE_MIN_ZOOM,
                3.4,
                13,
                7,
                16,
                10,
              ],
              'circle-color': ['get', 'color'],
              // A representative sector point should not read as hard as a quay, so it draws
              // hollower — the visual carries the precision claim, not just the label.
              'circle-opacity': [
                'match',
                ['get', 'precision'],
                'facility',
                0.95,
                0.35,
              ],
              'circle-stroke-color': ['get', 'color'],
              'circle-stroke-width': 1.6,
              'circle-stroke-opacity': 0.9,
            },
          });

          map.addLayer({
            id: 'wt-migration-entry-node-labels',
            type: 'symbol',
            source: 'wt-migration-entry-nodes',
            minzoom: ENTRY_NODE_MIN_ZOOM + 0.4,
            layout: {
              'text-field': [
                'format',
                ['concat', ['get', 'code'], ' · ', ['get', 'name']],
                {},
                '\n',
                {},
                ['get', 'detail'],
                { 'font-scale': 0.76 },
              ],
              'text-font': ['Noto Sans Regular'],
              'text-size': ['interpolate', ['linear'], ['zoom'], 9, 10, 14, 12.5],
              'text-offset': [0, 1.05],
              'text-anchor': 'top',
              'text-letter-spacing': 0.05,
              'text-max-width': 16,
              'text-allow-overlap': false,
            },
            paint: {
              'text-color': ['get', 'color'],
              'text-halo-color': '#000000',
              'text-halo-width': 1.7,
              'text-opacity': ['match', ['get', 'precision'], 'facility', 0.97, 0.7],
            },
          });

          // ── Media microevents pinned to those nodes ──────────────────────
          map.addLayer({
            id: 'wt-migration-microevents',
            type: 'circle',
            source: 'wt-migration-microevents',
            minzoom: MICROEVENT_MIN_ZOOM,
            paint: {
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                MICROEVENT_MIN_ZOOM,
                4,
                14,
                7.5,
                17,
                11,
              ],
              'circle-color': ['get', 'color'],
              'circle-opacity': 0.9,
              'circle-stroke-color': '#000000',
              'circle-stroke-width': 1.5,
            },
          });

          map.addLayer({
            id: 'wt-migration-microevent-labels',
            type: 'symbol',
            source: 'wt-migration-microevents',
            minzoom: MICROEVENT_MIN_ZOOM + 0.6,
            layout: {
              'text-field': ['concat', ['get', 'code'], ' · ', ['get', 'outlet']],
              'text-font': ['Noto Sans Regular'],
              'text-size': 10,
              'text-offset': [0.9, 0],
              'text-anchor': 'left',
              'text-letter-spacing': 0.07,
              'text-allow-overlap': false,
            },
            paint: {
              'text-color': ['get', 'color'],
              'text-halo-color': '#000000',
              'text-halo-width': 1.7,
              'text-opacity': 0.92,
            },
          });

          // ── Worldwide 2026 news microevents ──────────────────────────────
          // Six themes, one dot each, colour denormalised into the feature so paint never runs
          // JS. Small and translucent at reveal so 130 dots read as a scatter over the planet
          // rather than a rash, growing into individually clickable targets as you close in.
          map.addLayer({
            id: 'wt-world-microevents',
            type: 'circle',
            source: 'wt-world-microevents',
            minzoom: WORLD_MICROEVENT_MIN_ZOOM,
            paint: {
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                WORLD_MICROEVENT_MIN_ZOOM,
                2.4,
                4,
                4.5,
                7,
                7,
                12,
                10,
              ],
              'circle-color': ['get', 'color'],
              'circle-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                WORLD_MICROEVENT_MIN_ZOOM,
                0.55,
                4,
                0.9,
              ],
              'circle-stroke-color': '#000000',
              'circle-stroke-width': ['interpolate', ['linear'], ['zoom'], 2.5, 0.6, 6, 1.4],
            },
          });

          map.addLayer({
            id: 'wt-world-microevent-labels',
            type: 'symbol',
            source: 'wt-world-microevents',
            minzoom: 4.4,
            layout: {
              'text-field': ['concat', ['get', 'code'], ' · ', ['get', 'dateLabel']],
              'text-font': ['Noto Sans Regular'],
              'text-size': 10,
              'text-offset': [0.9, 0],
              'text-anchor': 'left',
              'text-letter-spacing': 0.07,
              // Dense theatres (the Gulf, the Donbas) would otherwise stack a dozen labels on
              // top of each other; letting MapLibre drop the collisions keeps them readable.
              'text-allow-overlap': false,
            },
            paint: {
              'text-color': ['get', 'color'],
              'text-halo-color': '#000000',
              'text-halo-width': 1.7,
              'text-opacity': 0.92,
            },
          });

          // ── Germany mass-shooting record ─────────────────────────────────
          // Fatal and non-fatal incidents remain distinct so a four-injury shooting is never
          // visually presented as a mass murder.
          map.addLayer({
            id: 'wt-germany-mass-shootings-halo',
            type: 'circle',
            source: 'wt-germany-mass-shootings',
            minzoom: GERMANY_MASS_SHOOTING_MIN_ZOOM,
            paint: {
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                GERMANY_MASS_SHOOTING_MIN_ZOOM,
                5,
                7,
                10,
                12,
                15,
              ],
              'circle-color': ['get', 'color'],
              'circle-opacity': [
                'case',
                ['==', ['get', 'severity'], 'fatal'],
                0.16,
                0.08,
              ],
              'circle-blur': 0.7,
            },
          });

          map.addLayer({
            id: 'wt-germany-mass-shootings',
            type: 'circle',
            source: 'wt-germany-mass-shootings',
            minzoom: GERMANY_MASS_SHOOTING_MIN_ZOOM,
            paint: {
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                GERMANY_MASS_SHOOTING_MIN_ZOOM,
                2.8,
                7,
                6.5,
                12,
                9,
              ],
              'circle-color': ['get', 'color'],
              'circle-stroke-color': 'rgba(0,0,0,0.92)',
              'circle-stroke-width': ['interpolate', ['linear'], ['zoom'], 3.7, 0.8, 8, 1.4],
              'circle-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                GERMANY_MASS_SHOOTING_MIN_ZOOM,
                0.68,
                GERMANY_MASS_SHOOTING_MIN_ZOOM + 0.7,
                0.96,
              ],
            },
          });

          map.addLayer({
            id: 'wt-germany-mass-shooting-labels',
            type: 'symbol',
            source: 'wt-germany-mass-shootings',
            minzoom: 6.2,
            layout: {
              'text-field': ['concat', ['get', 'code'], ' · ', ['get', 'dateLabel']],
              'text-font': ['Noto Sans Regular'],
              'text-size': ['interpolate', ['linear'], ['zoom'], 6.2, 9, 10, 11],
              'text-offset': [0.9, 0],
              'text-anchor': 'left',
              'text-letter-spacing': 0.07,
              'text-allow-overlap': false,
              'text-optional': true,
            },
            paint: {
              'text-color': ['get', 'color'],
              'text-halo-color': '#000000',
              'text-halo-width': 1.7,
              'text-opacity': 0.94,
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

          // ── Order of battle ──────────────────────────────────────────────
          // Fortification belts, then formation symbols, then fixed sites — drawn above the war
          // control geometry they annotate and below the live incident pins, so an event on the
          // same coordinate as a formation still wins the hover card.
          registerWarUnitIcons(map, WAR_SIDE_ICON_COLOR);

          const oobFade: import('maplibre-gl').ExpressionSpecification = [
            'interpolate',
            ['linear'],
            ['zoom'],
            OOB_REVEAL_ZOOM - 0.5,
            0,
            OOB_REVEAL_ZOOM,
            1,
          ];

          // Unit symbols come in a step and a half later than the belts, on their own ramp.
          const oobFormationFade: import('maplibre-gl').ExpressionSpecification = [
            'interpolate',
            ['linear'],
            ['zoom'],
            OOB_FORMATION_MIN_ZOOM - 0.5,
            0,
            OOB_FORMATION_MIN_ZOOM,
            1,
          ];

          map.addLayer({
            id: 'wt-oob-lines-casing',
            type: 'line',
            source: 'wt-oob-lines',
            minzoom: OOB_REVEAL_ZOOM - 0.5,
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
              'line-color': 'rgba(0,0,0,0.85)',
              'line-width': ['interpolate', ['linear'], ['zoom'], 3.4, 5.5, 8, 11],
              'line-opacity': oobFade,
              'line-blur': 0.3,
            },
          });

          map.addLayer({
            id: 'wt-oob-lines',
            type: 'line',
            source: 'wt-oob-lines',
            minzoom: OOB_REVEAL_ZOOM - 0.5,
            layout: { 'line-cap': 'butt', 'line-join': 'round' },
            paint: {
              'line-color': ['get', 'color'],
              'line-width': ['interpolate', ['linear'], ['zoom'], 3.4, 2.2, 8, 4.4],
              'line-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                OOB_REVEAL_ZOOM - 0.5,
                0,
                OOB_REVEAL_ZOOM,
                ['match', ['get', 'status'], 'established', 0.95, 0.75],
              ],
              // Works still going up read as an intent, not a wall — dashed says so at any zoom
              // the belt is legible at.
              'line-dasharray': [
                'match',
                ['get', 'status'],
                'established',
                ['literal', [1, 0]],
                ['literal', [2.4, 1.8]],
              ],
            },
          });

          map.addLayer({
            id: 'wt-oob-lines-hit',
            type: 'line',
            source: 'wt-oob-lines',
            minzoom: OOB_REVEAL_ZOOM,
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
              'line-color': 'rgba(0,0,0,0)',
              'line-width': ['interpolate', ['linear'], ['zoom'], 3.4, 12, 8, 20],
            },
          });

          map.addLayer({
            id: 'wt-oob-sites',
            type: 'symbol',
            source: 'wt-oob-sites',
            minzoom: OOB_SITE_MIN_ZOOM,
            layout: {
              'icon-image': ['get', 'icon'],
              'icon-size': ['interpolate', ['linear'], ['zoom'], 4, 0.62, 8, 0.95],
              'icon-allow-overlap': true,
              'icon-ignore-placement': true,
            },
            paint: {
              'icon-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                OOB_SITE_MIN_ZOOM - 0.4,
                0,
                OOB_SITE_MIN_ZOOM,
                0.95,
              ],
            },
          });

          map.addLayer({
            id: 'wt-oob-formations',
            type: 'symbol',
            source: 'wt-oob-formations',
            minzoom: OOB_FORMATION_MIN_ZOOM,
            layout: {
              'icon-image': ['get', 'icon'],
              'icon-size': ['interpolate', ['linear'], ['zoom'], OOB_FORMATION_MIN_ZOOM, 0.6, 8, 1],
              'icon-allow-overlap': true,
              'icon-ignore-placement': true,
              // The frame sits 5 px below the sprite's centre so the echelon marks have room
              // above it; offsetting by that much puts the box itself on the sector it denotes.
              // `icon-offset` is in icon pixels and is scaled by `icon-size`, so it tracks zoom.
              'icon-offset': [0, -5],
            },
            paint: {
              'icon-opacity': oobFormationFade,
            },
          });

          map.addLayer({
            id: 'wt-oob-formation-labels',
            type: 'symbol',
            source: 'wt-oob-formations',
            minzoom: OOB_LABEL_MIN_ZOOM,
            layout: {
              'text-field': ['get', 'code'],
              'text-font': ['Noto Sans Regular'],
              'text-size': ['interpolate', ['linear'], ['zoom'], OOB_LABEL_MIN_ZOOM, 9.5, 8, 12],
              'text-offset': [0, 1.5],
              'text-anchor': 'top',
              'text-letter-spacing': 0.12,
              'text-allow-overlap': false,
            },
            paint: {
              'text-color': ['get', 'color'],
              'text-halo-color': 'rgba(0,0,0,0.9)',
              'text-halo-width': 1.6,
              'text-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                OOB_LABEL_MIN_ZOOM - 0.3,
                0,
                OOB_LABEL_MIN_ZOOM,
                1,
              ],
            },
          });

          // ── Garrisons ────────────────────────────────────────────────────
          // Home stations, so these run on the opposite logic to the sector layers: visible at
          // continental zoom, where the spread from Odesa to the Pacific is the readable fact,
          // and unremarkable once the camera is inside one oblast.
          map.addLayer({
            id: 'wt-oob-garrisons',
            type: 'symbol',
            source: 'wt-oob-garrisons',
            minzoom: OOB_GARRISON_MIN_ZOOM,
            layout: {
              'icon-image': ['get', 'icon'],
              'icon-size': ['interpolate', ['linear'], ['zoom'], OOB_GARRISON_MIN_ZOOM, 0.5, 7, 0.9],
              'icon-allow-overlap': true,
              'icon-ignore-placement': true,
            },
            paint: {
              'icon-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                OOB_GARRISON_MIN_ZOOM - 0.4,
                0,
                OOB_GARRISON_MIN_ZOOM,
                0.9,
              ],
            },
          });

          map.addLayer({
            id: 'wt-oob-garrison-labels',
            type: 'symbol',
            source: 'wt-oob-garrisons',
            minzoom: OOB_GARRISON_LABEL_MIN_ZOOM,
            layout: {
              'text-field': ['get', 'code'],
              'text-font': ['Noto Sans Regular'],
              'text-size': ['interpolate', ['linear'], ['zoom'], OOB_GARRISON_LABEL_MIN_ZOOM, 9, 8, 11.5],
              'text-offset': [0, 1.1],
              'text-anchor': 'top',
              'text-letter-spacing': 0.1,
              'text-allow-overlap': false,
            },
            paint: {
              'text-color': ['get', 'color'],
              'text-halo-color': 'rgba(0,0,0,0.9)',
              'text-halo-width': 1.5,
              'text-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                OOB_GARRISON_LABEL_MIN_ZOOM - 0.3,
                0,
                OOB_GARRISON_LABEL_MIN_ZOOM,
                1,
              ],
            },
          });

          // ── Military installations ───────────────────────────────────────
          // Added before the event pins so bases sit above the country fills and war geometry
          // but beneath every live pin: `queryRenderedFeatures` returns topmost-first, so an
          // incident sharing a coordinate with a base still wins the hover card. One flat dot
          // per base — no pulse halo, which is what keeps standing infrastructure visually
          // distinct from "something happened here", and keeps dense clusters legible.
          registerMilitaryBaseIcons(map, MILITARY_BLOC_COLOR);

          map.addLayer({
            id: 'wt-military-bases',
            type: 'symbol',
            source: 'wt-military-bases',
            minzoom: MILITARY_BASE_MIN_ZOOM,
            layout: {
              'icon-image': ['concat', 'wt-base-', ['get', 'blocKey']],
              // Symbol layers cull colliding labels by default. Bases are dense enough that
              // MapLibre would drop most of a cluster, so placement is forced the way the
              // circle layer implicitly behaved.
              'icon-allow-overlap': true,
              'icon-ignore-placement': true,
              'icon-size': [
                'interpolate',
                ['linear'],
                ['zoom'],
                MILITARY_BASE_MIN_ZOOM,
                0.55,
                7,
                0.85,
                12,
                1.25,
              ],
            },
            paint: {
              'icon-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                MILITARY_BASE_MIN_ZOOM,
                0,
                MILITARY_BASE_MIN_ZOOM + 0.8,
                0.9,
              ],
            },
          });

          // ── Strategic radar stations ───────────────────────────────────────
          // A purpose-built reticle separates sensors from the installation stars below them.
          // These are only publicly acknowledged, fixed strategic sites; no coverage radius is
          // invented, and labels are collision-managed at regional zoom.
          registerStrategicRadarIcons(map);

          map.addLayer({
            id: 'wt-strategic-radars',
            type: 'symbol',
            source: 'wt-strategic-radars',
            minzoom: STRATEGIC_RADAR_MIN_ZOOM,
            layout: {
              'icon-image': ['concat', 'wt-radar-', ['get', 'mission']],
              'icon-allow-overlap': true,
              'icon-ignore-placement': true,
              'icon-size': [
                'interpolate',
                ['linear'],
                ['zoom'],
                STRATEGIC_RADAR_MIN_ZOOM,
                0.62,
                4,
                0.85,
                8,
                1.1,
              ],
            },
            paint: {
              'icon-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                STRATEGIC_RADAR_MIN_ZOOM,
                0,
                STRATEGIC_RADAR_MIN_ZOOM + 0.5,
                0.95,
              ],
            },
          });

          map.addLayer({
            id: 'wt-strategic-radar-labels',
            type: 'symbol',
            source: 'wt-strategic-radars',
            minzoom: STRATEGIC_RADAR_LABEL_MIN_ZOOM,
            layout: {
              'text-field': ['get', 'shortName'],
              'text-font': ['Noto Sans Regular'],
              'text-size': ['interpolate', ['linear'], ['zoom'], 3, 8, 7, 10.5],
              'text-offset': [0, 1.35],
              'text-anchor': 'top',
              'text-letter-spacing': 0.12,
              'text-allow-overlap': false,
              'text-optional': true,
            },
            paint: {
              'text-color': ['get', 'color'],
              'text-halo-color': 'rgba(0,0,0,0.92)',
              'text-halo-width': 1.5,
              'text-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                STRATEGIC_RADAR_LABEL_MIN_ZOOM,
                0,
                STRATEGIC_RADAR_LABEL_MIN_ZOOM + 0.5,
                0.9,
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

          // Cyberattacks / breaches. Same micro-event zoom tier as news / EONET / OSINT, but
          // the whole taxonomy is red, so a soft halo under the dot keeps it separable from the
          // hazard and intel pins it shares that tier with.
          map.addLayer({
            id: 'wt-cyber-events-halo',
            type: 'circle',
            source: 'wt-cyber',
            minzoom: EVENT_PIN_MIN_ZOOM,
            paint: {
              'circle-radius': ['interpolate', ['linear'], ['zoom'], 5, 7, 10, 12],
              'circle-color': ['get', 'color'],
              'circle-opacity': 0.16,
              'circle-blur': 0.7,
            },
          });

          map.addLayer({
            id: 'wt-cyber-events',
            type: 'circle',
            source: 'wt-cyber',
            minzoom: EVENT_PIN_MIN_ZOOM,
            paint: {
              'circle-radius': ['interpolate', ['linear'], ['zoom'], 0.5, 2.8, 5, 4.4, 10, 6.8],
              'circle-color': ['get', 'color'],
              'circle-stroke-color': 'rgba(0,0,0,0.9)',
              'circle-stroke-width': 1.2,
              'circle-opacity': eventPinFade,
            },
          });

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
          // Every layer above was just (re)built at its default visibility, so the user's
          // current switch positions have to be stamped back on before the frame is shown.
          applyLayerGroups(map, layerGroupsRef.current);
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
      //
      // The check is a full-viewport `queryRenderedFeatures`, which is one of the most
      // expensive calls in the API — and `idle` fires after every tile batch, so a dive-in
      // used to run it a dozen times in a second. Once every {@link BORDER_CHECK_MIN_MS} is
      // still far quicker than a human notices the swap.
      const BORDER_CHECK_MIN_MS = 500;
      let lastBorderCheck = 0;
      map.on('idle', () => {
        if (!map.getLayer('wt-vector-borders') || !map.getLayer('wt-world-borders')) return;
        const now = performance.now();
        if (now - lastBorderCheck < BORDER_CHECK_MIN_MS) return;
        lastBorderCheck = now;
        const vectorDrawn = map.queryRenderedFeatures({ layers: ['wt-vector-borders'] }).length > 0;
        const visibility = vectorDrawn && map.getZoom() > 2.6 ? 'none' : 'visible';
        const current = map.getLayoutProperty('wt-world-borders', 'visibility') ?? 'visible';
        if (current !== visibility) {
          map.setLayoutProperty('wt-world-borders', 'visibility', visibility);
        }
      });

      // ── Animation ────────────────────────────────────────────────────────
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let lastIdleSpinFrame = 0;
      let lastOverlayEffectFrame = 0;
      const lastWarPulse = { radius: NaN, opacity: NaN };
      const lastIranPulse = { radius: NaN, opacity: NaN };

      const animate = (now: number) => {
        frame = window.requestAnimationFrame(animate);
        frameTick++;
        // During pan/zoom, skip GeoJSON churn and paint updates so the camera owns the main thread.
        if (mapInteracting) {
          lastSpinNow = now;
          return;
        }

        // Idle cinematic spin: crawl center longitude. Flag keeps setCenter out of the
        // interaction path so travellers / war pulse keep ticking and layers stay visible.
        // A Recon approach suppresses it outright — the first stage sits at z2.4, well inside
        // the spin band, and a drifting centre would drag the target back out of frame.
        const idleSpinEnabled =
          !reduceMotion &&
          !idleSpinPaused &&
          !reconActiveRef.current &&
          map.getZoom() < IDLE_SPIN_MAX_ZOOM;
        if (idleSpinEnabled) {
          if (now - lastIdleSpinFrame >= IDLE_SPIN_FRAME_MS) {
            const dt = lastSpinNow ? Math.min(now - lastSpinNow, 150) : 0;
            lastIdleSpinFrame = now;
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
          }
        } else {
          lastIdleSpinFrame = now;
          lastSpinNow = now;
        }

        if (now - lastOverlayEffectFrame < OVERLAY_EFFECT_FRAME_MS) return;
        lastOverlayEffectFrame = now;

        // Every `setPaintProperty` schedules a full repaint. Both halos are `minzoom`-gated, so
        // writing them while the camera is wider than their reveal used to keep the whole map
        // repainting 30×/s for two layers that draw nothing — and under reduced motion the
        // value is constant, so re-writing it is pure waste. Gate on both.
        const pulseZoom = map.getZoom();
        const pulse = reduceMotion ? 0.5 : (Math.sin(now / 620) + 1) / 2;

        if (
          pulseZoom >= WAR_EVENT_MIN_ZOOM &&
          pulseZoom <= PULSE_ANIMATION_MAX_ZOOM &&
          map.getLayer('wt-war-events-pulse')
        ) {
          // Keep the halo readable at theatre zoom without flooding the frame.
          const zoomT = Math.min(1, Math.max(0, (pulseZoom - WAR_EVENT_MIN_ZOOM) / 0.6));
          const baseR = pulseZoom < 5.5 ? 8 : 6;
          const expand = pulseZoom < 5.5 ? 6.5 : 9;
          const radius = baseR + pulse * expand;
          const opacity = (0.2 - pulse * 0.12) * (0.65 + 0.35 * zoomT);
          if (radius !== lastWarPulse.radius || opacity !== lastWarPulse.opacity) {
            lastWarPulse.radius = radius;
            lastWarPulse.opacity = opacity;
            map.setPaintProperty('wt-war-events-pulse', 'circle-radius', radius);
            map.setPaintProperty('wt-war-events-pulse', 'circle-opacity', opacity);
          }
        }

        if (
          pulseZoom >= IRAN_ISRAEL_EVENT_MIN_ZOOM &&
          pulseZoom <= PULSE_ANIMATION_MAX_ZOOM &&
          map.getLayer('wt-iran-israel-events-pulse')
        ) {
          const zoomT = Math.min(1, Math.max(0, (pulseZoom - IRAN_ISRAEL_EVENT_MIN_ZOOM) / 0.6));
          const baseR = pulseZoom < 7 ? 8 : 6;
          const expand = pulseZoom < 7 ? 6.5 : 9;
          const radius = baseR + pulse * expand;
          const opacity = (0.2 - pulse * 0.12) * (0.65 + 0.35 * zoomT);
          if (radius !== lastIranPulse.radius || opacity !== lastIranPulse.opacity) {
            lastIranPulse.radius = radius;
            lastIranPulse.opacity = opacity;
            map.setPaintProperty('wt-iran-israel-events-pulse', 'circle-radius', radius);
            map.setPaintProperty('wt-iran-israel-events-pulse', 'circle-opacity', opacity);
          }
        }

        const iso = activeMigrationIso.current;
        const travellers = map.getSource('wt-migration-travellers') as GeoJSONSource | undefined;
        if (!iso || !travellers) return;
        if (reduceMotion && renderedStaticFor === iso) return;

        const paths: CorridorPath[] = getCorridorPathsRef.current().get(iso) ?? [];
        const features: GeoJSON.Feature[] = [];
        const vehicleUnits: MigrationVehicleUnit[] = [];

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
            vehicleUnits.push({
              coordinates: sample.coordinates,
              bearing: sample.bearing,
              mode: sample.mode,
              status: path.status,
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
            vehicleUnits.push({
              coordinates: sample.coordinates,
              bearing: sample.bearing,
              mode: sample.mode,
              status: path.status,
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
        migrationVehicleLayer?.setUnits(vehicleUnits);
        renderedStaticFor = reduceMotion ? iso : null;
      };

      frame = window.requestAnimationFrame(animate);
    })();

    return () => {
      cancelled = true;
      if (frame) window.cancelAnimationFrame(frame);
      if (hoverFrame) window.cancelAnimationFrame(hoverFrame);
      if (idleSpinResumeTimer) window.clearTimeout(idleSpinResumeTimer);
      if (dismissMigrationOnEscape) {
        window.removeEventListener('keydown', dismissMigrationOnEscape);
      }
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
    const map = mapRef.current;
    if (!map || !ready) return;
    applyLayerGroups(map, layerGroups);
  }, [layerGroups, ready]);

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
        className="absolute inset-0 h-full w-full"
        style={{ cursor: 'grab' }}
      />

      {hoverCard && !selectedIncidentCard && (
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

      {selectedIncidentCard && (
        <section
          className="pointer-events-auto absolute bottom-4 left-1/2 z-[70] w-[calc(100%-2rem)] max-w-[380px] -translate-x-1/2 border border-white/20 bg-black/95 px-4 py-3 shadow-[0_18px_48px_rgba(0,0,0,0.45)] backdrop-blur-md sm:bottom-6"
          style={{ fontFamily: MONO }}
          aria-label="Selected Germany mass-shooting incident"
          aria-live="polite"
        >
          <div className="flex items-start gap-2">
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: selectedIncidentCard.color }}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className="text-[11px] uppercase tracking-[0.22em]"
                  style={{ color: selectedIncidentCard.color }}
                >
                  {selectedIncidentCard.code}
                </span>
                <span className="text-[11px] uppercase tracking-[0.14em] text-white/45">
                  {selectedIncidentCard.kind}
                </span>
              </div>
              <h2 className="mt-1.5 text-xs leading-snug text-white/95">
                {selectedIncidentCard.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setSelectedIncidentCard(null)}
              className="-mr-2 -mt-2 inline-grid min-h-11 min-w-11 place-items-center text-white/45 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/70"
              aria-label="Close incident details"
            >
              ×
            </button>
          </div>
          {selectedIncidentCard.body && (
            <p className="mt-2 text-[11px] leading-relaxed text-white/60">
              {selectedIncidentCard.body}
            </p>
          )}
          {selectedIncidentCard.footer && (
            <p className="mt-2 text-[11px] uppercase leading-relaxed tracking-[0.12em] text-white/40">
              {selectedIncidentCard.footer}
            </p>
          )}
          {selectedIncidentCard.url && (
            <a
              href={selectedIncidentCard.url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex min-h-9 items-center border border-white/15 px-3 text-[11px] uppercase tracking-[0.16em] text-white/72 transition-colors hover:border-white/35 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              Open source
            </a>
          )}
        </section>
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

      {ready && <GlobeLayerToggles enabled={layerGroups} onToggle={toggleLayerGroup} />}

      {satellitesInView && (
        <Suspense fallback={null}>
          <SatelliteLegend
            visible={satelliteVisible}
            countsByGroup={catalogue?.countsByGroup ?? EMPTY_SATELLITE_COUNTS}
            total={catalogue?.count ?? 0}
            status={satelliteStatus}
            onToggle={toggleSatelliteGroup}
            onAll={setAllSatelliteGroups}
          />
        </Suspense>
      )}

      {ready && (
        <>
          <Suspense fallback={null}>
            <GlobeAnalysisPanels
              newsAnchors={newsAnchors}
              eventAnchors={eventAnchors}
              conflictEvents={conflictEvents}
              zoomRef={zoomRef}
            />
          </Suspense>
          <Suspense fallback={null}>
            <HackerNewsCarousel />
          </Suspense>
        </>
      )}

      {reconScreen && reconTarget && (
        <Suspense fallback={null}>
          <ReconReticle
            x={reconScreen.x}
            y={reconScreen.y}
            label={reconTarget.label}
            phase={reconPhase}
            color={reconOriginColor(reconTarget.origin)}
          />
        </Suspense>
      )}

      {ready && (
        <Suspense fallback={null}>
          <ReconLocator
            onLocate={handleReconLocate}
            onClear={handleReconClear}
            phase={reconPhase}
          />
        </Suspense>
      )}

      {ready && (
        <Suspense fallback={null}>
          <WorldVitalsPanel />
        </Suspense>
      )}

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
