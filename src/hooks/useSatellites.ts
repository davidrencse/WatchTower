import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  celestrakTleUrl,
  SATELLITE_GROUPS,
  SATELLITE_TLE_TTL_MS,
  type SatelliteGroup,
} from '../data/satelliteGroups';

/**
 * Owns the satellite worker: loads every constellation's elements once, then asks for a fresh
 * propagation on a slow tick. Positions never enter React state — they go straight to the GL
 * layer through `onPositions`, because re-rendering a component tree around a 12,000-element
 * Float32Array twice a second would be silly.
 */

/** Re-propagate this often. Fast enough to read as motion, cheap enough to ignore. */
const TICK_MS = 1000;
/** Samples in a selected satellite's orbit polyline. */
const TRACK_SAMPLES = 240;

export interface SatelliteCatalogue {
  count: number;
  names: string[];
  norads: number[];
  groups: Uint8Array;
  /** Per-group loaded counts, indexed like `SATELLITE_GROUPS`. */
  countsByGroup: number[];
  failures: string[];
}

interface Options {
  enabled: boolean;
  onPositions: (positions: Float32Array) => void;
  onCatalogue: (catalogue: SatelliteCatalogue) => void;
  onTrack: (index: number, track: Float32Array) => void;
}

export function useSatellites({ enabled, onPositions, onCatalogue, onTrack }: Options) {
  const workerRef = useRef<Worker | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [catalogue, setCatalogue] = useState<SatelliteCatalogue | null>(null);

  // Keep callbacks in refs so a re-render never tears down the worker.
  const positionsRef = useRef(onPositions);
  const catalogueRef = useRef(onCatalogue);
  const trackRef = useRef(onTrack);
  positionsRef.current = onPositions;
  catalogueRef.current = onCatalogue;
  trackRef.current = onTrack;

  useEffect(() => {
    if (!enabled || workerRef.current) return;
    let disposed = false;
    setStatus('loading');

    const worker = new Worker(new URL('../workers/satellites.worker.ts', import.meta.url), {
      type: 'module',
    });
    workerRef.current = worker;

    worker.onmessage = (event: MessageEvent) => {
      if (disposed) return;
      const message = event.data;
      if (message.type === 'loaded') {
        const countsByGroup = SATELLITE_GROUPS.map(() => 0);
        for (const group of message.groups as Uint8Array) countsByGroup[group] += 1;
        const next: SatelliteCatalogue = {
          count: message.count,
          names: message.names,
          norads: message.norads,
          groups: message.groups,
          countsByGroup,
          failures: message.failures ?? [],
        };
        setCatalogue(next);
        setStatus(message.count > 0 ? 'ready' : 'error');
        catalogueRef.current(next);
        worker.postMessage({ type: 'tick', time: Date.now() });
      } else if (message.type === 'positions') {
        positionsRef.current(message.positions as Float32Array);
      } else if (message.type === 'track') {
        trackRef.current(message.index as number, message.track as Float32Array);
      }
    };

    worker.onerror = () => {
      if (!disposed) setStatus('error');
    };

    worker.postMessage({
      type: 'load',
      ttlMs: SATELLITE_TLE_TTL_MS,
      groups: SATELLITE_GROUPS.map((group: SatelliteGroup, index) => ({
        id: group.id,
        index,
        url: celestrakTleUrl(group),
        nameFilter: group.nameFilter,
      })),
    });

    return () => {
      disposed = true;
      worker.terminate();
      workerRef.current = null;
    };
  }, [enabled]);

  // Propagation tick — only while the shells are actually on screen.
  useEffect(() => {
    if (!enabled || status !== 'ready') return;
    const timer = window.setInterval(() => {
      workerRef.current?.postMessage({ type: 'tick', time: Date.now() });
    }, TICK_MS);
    return () => window.clearInterval(timer);
  }, [enabled, status]);

  const requestTrack = useCallback((index: number | null) => {
    if (index === null) return;
    workerRef.current?.postMessage({
      type: 'track',
      index,
      samples: TRACK_SAMPLES,
      time: Date.now(),
    });
  }, []);

  return useMemo(
    () => ({ status, catalogue, requestTrack }),
    [status, catalogue, requestTrack],
  );
}
