/**
 * Recon — OSINT photo locator, overlaid on the globe.
 *
 * Drop a photo, get a coordinate, watch the camera fly to it. The resolution ladder runs
 * strongest-evidence-first and the panel always says which rung it landed on, because the
 * rungs are not equally trustworthy:
 *
 *  1. **EXIF GPS** — a fix written by the capturing device. This is a measurement.
 *  2. **Coordinates in text** — a pair parsed out of the filename or pasted by the operator.
 *  3. **Place match** — the filename matched against the known migration entry nodes. This is
 *     a name lookup, not image analysis, and the panel labels it as such.
 *
 * Rungs 1–3 run **entirely in this tab**: `readExifLocation` parses an ArrayBuffer locally and
 * nothing is uploaded. That property is the reason they are automatic.
 *
 *  4. **Deep scan** — a metadata-free raster surrogate is sent to the OSINT engine embedded at
 *     `osint/`, which independently validates and rewrites it, then reads
 *     the pixels (landmarks, sign text, architecture, vegetation, plate formats), geocodes any
 *     place names it recovers, and fuses the agreeing signals into ranked points.
 *
 * Rung 4 is different in kind, so it is different in the UI: it **uploads a sanitized copy** to a local
 * sidecar that may forward it to a vision provider, and what comes back is an *inference*, not a
 * measurement. It therefore never fires on its own — the operator asks for it by name — and its
 * results are never auto-applied. They are listed with their own accuracy radius and
 * corroboration count for the operator to accept or reject. A photo the platforms stripped can
 * still be placed; it just cannot be placed with the confidence of rung 1, and the panel says so.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { parseCoordinateText, readExifLocation } from '../lib/exifGeolocation';
import {
  prepareImageForDeepScan,
  type BrowserImageSecurityReport,
} from '../lib/imageSecurity';
import { reconSearchTargets } from '../lib/mapGlobeOverlays';
import {
  deepScanImage,
  type DeepScanFailure,
  type OsintFinding,
  type OsintGeoPoint,
  type OsintImageSecurityReport,
} from '../lib/osintGeolocate';
import { RECON_ORIGIN_META as ORIGIN_META, type ReconOrigin } from './reconOrigin';
import './ReconLocator.css';

const MONO = "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace";

export type { ReconOrigin };

export interface ReconTarget {
  longitude: number;
  latitude: number;
  label: string;
  detail: string;
  origin: ReconOrigin;
  /** EXIF compass bearing, when the photo carried one — used to orient the descent. */
  bearing?: number;
  capturedAt?: string;
  camera?: string;
  altitude?: number;
  /** Deep-scan only: how wide the claim is, in km. Absent means "a point, not an area". */
  accuracyKm?: number;
  /** Deep-scan only: the engine's fused 0..1 confidence. */
  confidence?: number;
  /** Deep-scan only: how many independent signals landed on this spot. */
  corroboration?: number;
}

/** Camera state pushed back from the globe so the panel can narrate the approach. */
export type ReconPhase = 'idle' | 'approach' | 'descent' | 'locked';

interface ReconLocatorProps {
  onLocate: (target: ReconTarget) => void;
  onClear: () => void;
  phase: ReconPhase;
}

/** What the operator should do about a deep scan that produced nothing. */
const FAILURE_HINT: Record<DeepScanFailure, string> = {
  offline: 'Start the engine: cd osint && npm run dev',
  unconfigured: 'Set VISION_API_KEY in osint/.env.local for the pixel-content estimate.',
  'too-large': 'Try a smaller image.',
  'unsafe-file': 'The file failed the image-security gate and was not analyzed.',
  error: 'The engine reported a problem.',
};

const PHASE_LABEL: Record<ReconPhase, string> = {
  idle: 'Standby',
  approach: 'Reorienting globe',
  descent: 'Descending to target',
  locked: 'Target locked',
};

type Status =
  | { kind: 'idle' }
  | { kind: 'scanning'; name: string }
  | { kind: 'located'; target: ReconTarget; name: string }
  | { kind: 'nofix'; name: string; suggestions: readonly PlaceSuggestion[] }
  | { kind: 'deep'; name: string }
  | {
      kind: 'candidates';
      name: string;
      targets: readonly ReconTarget[];
      findings: readonly OsintFinding[];
      /** Engine sources that sat out for want of a key — usually the vision estimate. */
      skipped: readonly string[];
      elapsedMs: number;
    }
  | { kind: 'error'; message: string; hint?: string };

interface PlaceSuggestion {
  id: string;
  label: string;
  detail: string;
  longitude: number;
  latitude: number;
}

/** Format a signed decimal degree as a hemisphere-suffixed readout. */
function formatDegrees(value: number, axis: 'lat' | 'lng'): string {
  const hemisphere = axis === 'lat' ? (value >= 0 ? 'N' : 'S') : value >= 0 ? 'E' : 'W';
  return `${Math.abs(value).toFixed(5)}° ${hemisphere}`;
}

/**
 * Score a filename against the known entry nodes. Scoring is word-overlap rather than substring
 * so `dover_western_jet_foil.jpg` matches without `dover` alone dragging in every Kent node.
 */
function matchPlaces(text: string, limit: number): PlaceSuggestion[] {
  const words = text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length >= 3);
  if (!words.length) return [];

  return reconSearchTargets()
    .map((target) => {
      let score = 0;
      for (const word of words) if (target.haystack.includes(word)) score += word.length;
      return { target, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ target }) => ({
      id: target.id,
      label: target.label,
      detail: target.detail,
      longitude: target.coordinate[0],
      latitude: target.coordinate[1],
    }));
}

/**
 * Turn one fused engine point into a target the globe can fly to.
 *
 * The engine's `kind` is the honest label, so it — not the source id — picks the rung: a landmark
 * the vision model spotted and Nominatim then resolved is `geocoded` (a real place, coarsely
 * located), while a model's holistic guess at a city is `estimate`. Only a device fix relayed by
 * the engine is allowed to claim `exif`.
 */
function targetFromGeoPoint(point: OsintGeoPoint): ReconTarget {
  const origin: ReconOrigin =
    point.kind === 'gps' ? 'exif' : point.kind === 'geocoded' ? 'geocoded' : 'vision';

  const agreeing = point.sources?.length ? point.sources.join(' + ') : point.source;
  const detail =
    origin === 'exif'
      ? `GPS fix read by the engine · ${agreeing}`
      : origin === 'geocoded'
        ? `Place name recovered from the image, geocoded · ${agreeing}`
        : `Model inference from pixel content · ${agreeing}`;

  return {
    longitude: point.lon,
    latitude: point.lat,
    label: point.label,
    detail,
    origin,
    altitude: point.elevationM,
    accuracyKm: point.radiusKm,
    confidence: point.confidence,
    corroboration: point.corroboration,
  };
}

/** Render an accuracy radius at a precision the number actually supports. */
function formatAccuracy(km: number): string {
  if (km < 1) return `±${Math.max(10, Math.round(km * 1000))} m`;
  if (km < 10) return `±${km.toFixed(1)} km`;
  return `±${Math.round(km)} km`;
}

export default function ReconLocator({ onLocate, onClear, phase }: ReconLocatorProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [preview, setPreview] = useState<string | null>(null);
  const [manual, setManual] = useState('');
  const [dragging, setDragging] = useState(false);
  const [clientSecurity, setClientSecurity] = useState<BrowserImageSecurityReport | null>(null);
  const [engineSecurity, setEngineSecurity] = useState<OsintImageSecurityReport | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Only a decoded/re-encoded surrogate is retained for preview or upload. The
  // original exists just long enough for the in-tab metadata read.
  const fileRef = useRef<{
    upload: File;
    originalName: string;
    report: BrowserImageSecurityReport;
  } | null>(null);
  const inspectionRef = useRef(0);
  const deepScanRef = useRef<AbortController | null>(null);

  // Object URLs are per-file; revoke on replacement so a long session does not leak blobs.
  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  // A deep scan can be in flight for a minute or more; drop it if the panel goes away.
  useEffect(() => () => deepScanRef.current?.abort(), []);

  const commit = useCallback(
    (target: ReconTarget, name: string) => {
      setStatus({ kind: 'located', target, name });
      onLocate(target);
    },
    [onLocate],
  );

  /**
   * Rung 4. Upload the held file to the embedded engine and list what it fuses.
   *
   * Nothing here auto-commits: even a single high-confidence point is offered, not applied,
   * because a model's best guess and a device fix should not enter the globe the same way.
   */
  const runDeepScan = useCallback(async () => {
    const held = fileRef.current;
    if (!held) return;

    deepScanRef.current?.abort();
    const controller = new AbortController();
    deepScanRef.current = controller;
    setEngineSecurity(null);
    setStatus({ kind: 'deep', name: held.originalName });

    let outcome;
    try {
      outcome = await deepScanImage(held.upload, controller.signal);
    } catch {
      return; // Aborted by a reset or unmount — that state is owned by whoever aborted.
    }
    if (controller.signal.aborted) return;

    if (!outcome.ok) {
      setStatus({
        kind: 'error',
        message: outcome.message,
        hint: FAILURE_HINT[outcome.reason],
      });
      return;
    }

    const { result } = outcome;
    const serverReport = result.security[0];
    setEngineSecurity(serverReport ?? null);
    if (!serverReport || serverReport.originalSha256 !== held.report.sanitizedSha256) {
      setStatus({
        kind: 'error',
        message: 'The engine could not attest the exact sanitized file that was uploaded.',
        hint: 'Transport SHA-256 mismatch. Results were discarded.',
      });
      return;
    }
    const targets = result.geo.map(targetFromGeoPoint);

    if (!targets.length) {
      setStatus({
        kind: 'error',
        message: `The engine found no locatable signal in ${held.originalName}.`,
        hint: result.skipped.length
          ? FAILURE_HINT.unconfigured
          : 'No GPS, no place tags, and nothing the model could pin down.',
      });
      return;
    }

    setStatus({
      kind: 'candidates',
      name: held.originalName,
      targets,
      findings: result.findings.filter((finding) => finding.url || finding.detail).slice(0, 4),
      skipped: result.skipped.map((entry) => entry.source),
      elapsedMs: result.durationMs,
    });
  }, []);

  const handleFile = useCallback(
    async (file: File) => {
      const inspection = ++inspectionRef.current;
      fileRef.current = null;
      deepScanRef.current?.abort();
      setClientSecurity(null);
      setEngineSecurity(null);
      setPreview((current) => {
        if (current) URL.revokeObjectURL(current);
        return null;
      });
      setStatus({ kind: 'scanning', name: file.name });

      let buffer: ArrayBuffer;
      try {
        buffer = await file.arrayBuffer();
      } catch {
        setStatus({ kind: 'error', message: 'Could not read that file.' });
        return;
      }

      let prepared;
      try {
        prepared = await prepareImageForDeepScan(file, buffer);
      } catch (error) {
        if (inspection !== inspectionRef.current) return;
        setStatus({
          kind: 'error',
          message: error instanceof Error ? error.message : 'The image failed the security check.',
          hint: FAILURE_HINT['unsafe-file'],
        });
        return;
      }
      if (inspection !== inspectionRef.current) return;
      fileRef.current = { upload: prepared.file, originalName: file.name, report: prepared.report };
      setClientSecurity(prepared.report);
      setPreview(URL.createObjectURL(prepared.file));

      // Rung 1 — a fix the camera itself recorded.
      const exif = readExifLocation(buffer);
      if (exif) {
        commit(
          {
            longitude: exif.longitude,
            latitude: exif.latitude,
            label: file.name,
            detail: 'GPS tag embedded by the capturing device',
            origin: 'exif',
            bearing: exif.bearing,
            capturedAt: exif.capturedAt,
            camera: exif.camera,
            altitude: exif.altitude,
          },
          file.name,
        );
        return;
      }

      // Rung 2 — a coordinate pair sitting in the filename.
      const fromName = parseCoordinateText(file.name);
      if (fromName) {
        commit(
          {
            longitude: fromName.longitude,
            latitude: fromName.latitude,
            label: file.name,
            detail: 'Coordinates parsed from the filename',
            origin: 'coordinates',
          },
          file.name,
        );
        return;
      }

      // Rung 3 — offered, never auto-applied: a name match is weak evidence and the operator
      // should be the one to accept it.
      setStatus({
        kind: 'nofix',
        name: file.name,
        suggestions: matchPlaces(file.name, 4),
      });
    },
    [commit],
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setDragging(false);
      const file = event.dataTransfer.files?.[0];
      if (file) void handleFile(file);
    },
    [handleFile],
  );

  const submitManual = useCallback(() => {
    const text = manual.trim();
    if (!text) return;

    const parsed = parseCoordinateText(text);
    if (parsed) {
      commit(
        {
          longitude: parsed.longitude,
          latitude: parsed.latitude,
          label: text,
          detail: 'Coordinates entered by the operator',
          origin: 'coordinates',
        },
        text,
      );
      return;
    }

    const [best] = matchPlaces(text, 1);
    if (best) {
      commit(
        {
          longitude: best.longitude,
          latitude: best.latitude,
          label: best.label,
          detail: best.detail,
          origin: 'place',
        },
        text,
      );
      return;
    }

    setStatus({ kind: 'error', message: 'No coordinate or known place in that text.' });
  }, [commit, manual]);

  const reset = useCallback(() => {
    inspectionRef.current += 1;
    deepScanRef.current?.abort();
    deepScanRef.current = null;
    fileRef.current = null;
    setStatus({ kind: 'idle' });
    setManual('');
    setClientSecurity(null);
    setEngineSecurity(null);
    setPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
    onClear();
  }, [onClear]);

  const manualSuggestions = useMemo(
    () => (manual.trim().length >= 3 ? matchPlaces(manual, 4) : []),
    [manual],
  );

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="wt-recon-anchor pointer-events-auto absolute left-6 flex items-center gap-2 border border-white/15 bg-black/80 px-3 py-2 backdrop-blur-sm transition-colors hover:border-white/35 sm:left-9"
        style={{ fontFamily: MONO }}
      >
        <ReticleGlyph className="h-3 w-3 text-[#57c3d6]" />
        <span className="text-[10px] uppercase tracking-[0.28em] text-white/80">Recon</span>
        <span className="text-[9px] uppercase tracking-[0.18em] text-white/35">
          Photo locator
        </span>
      </button>
    );
  }

  const originMeta = status.kind === 'located' ? ORIGIN_META[status.target.origin] : null;
  // Read during render so the error and result views know whether a deep scan is still possible.
  const heldFile = fileRef.current;

  return (
    <div
      className="wt-recon-panel wt-recon-anchor pointer-events-auto absolute left-6 max-h-[min(70vh,640px)] w-[292px] overflow-y-auto border border-white/15 bg-black/85 backdrop-blur-sm sm:left-9"
      style={{ fontFamily: MONO }}
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
        <ReticleGlyph className="h-3 w-3 text-[#57c3d6]" />
        <span className="text-[10px] uppercase tracking-[0.28em] text-white/90">Recon</span>
        <span className="ml-auto text-[9px] uppercase tracking-[0.18em] text-white/35">
          {PHASE_LABEL[phase]}
        </span>
        <button
          type="button"
          onClick={() => {
            reset();
            setOpen(false);
          }}
          aria-label="Close Recon"
          className="-mr-1 px-1 text-[12px] leading-none text-white/40 transition-colors hover:text-white/90"
        >
          ×
        </button>
      </div>

      <div className="px-3 py-2.5">
        {(status.kind === 'idle' || status.kind === 'error') && (
          <>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={`flex w-full flex-col items-center gap-1.5 border border-dashed px-3 py-5 transition-colors ${
                dragging ? 'border-[#57c3d6]/70 bg-[#57c3d6]/5' : 'border-white/20 hover:border-white/40'
              }`}
            >
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/70">
                Drop photo · or click
              </span>
              <span className="text-[9px] uppercase tracking-[0.14em] text-white/30">
                Reads EXIF GPS in this tab · no upload
              </span>
            </button>
            {status.kind === 'error' && (
              <div className="mt-2">
                <p className="text-[10px] leading-relaxed text-[#e0483b]">{status.message}</p>
                {status.hint && (
                  <p className="mt-1 text-[9px] leading-relaxed text-white/40">{status.hint}</p>
                )}
                {heldFile && (
                  <DeepScanButton onClick={() => void runDeepScan()} label="Retry deep scan" />
                )}
              </div>
            )}
          </>
        )}

        {status.kind === 'scanning' && (
          <div className="flex items-center gap-3">
            <div className="wt-recon-scan relative h-14 w-14 shrink-0 overflow-hidden border border-white/15 bg-white/5">
              {preview && (
                <img src={preview} alt="" className="h-full w-full object-cover opacity-70" />
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[10px] text-white/80">{status.name}</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-[#57c3d6]">
                Reading EXIF block…
              </p>
            </div>
          </div>
        )}

        {status.kind === 'deep' && (
          <div>
            <div className="flex items-center gap-3">
              <div className="wt-recon-scan relative h-14 w-14 shrink-0 overflow-hidden border border-white/15 bg-white/5">
                {preview && (
                  <img src={preview} alt="" className="h-full w-full object-cover opacity-70" />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[10px] text-white/80">{status.name}</p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-[#b26bd8]">
                  Deep scan running…
                </p>
                <p className="mt-1 text-[9px] leading-relaxed text-white/35">
                  Pixels · landmarks · sign text · geocoding
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={reset}
              className="mt-2.5 w-full border border-white/10 px-2 py-1.5 text-[9px] uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-white/80"
            >
              Abort
            </button>
          </div>
        )}

        {status.kind === 'located' && originMeta && (
          <div>
            <div className="flex items-start gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden border border-white/15 bg-white/5">
                {preview && (
                  <img src={preview} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: originMeta.color }}
                  />
                  <span
                    className="text-[9px] uppercase tracking-[0.2em]"
                    style={{ color: originMeta.color }}
                  >
                    {originMeta.code}
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.14em] text-white/35">
                    {originMeta.label}
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] leading-tight text-white/95">
                  {formatDegrees(status.target.latitude, 'lat')}
                </p>
                <p className="text-[11px] leading-tight text-white/95">
                  {formatDegrees(status.target.longitude, 'lng')}
                </p>
              </div>
            </div>

            <dl className="mt-2.5 space-y-1 border-t border-white/10 pt-2">
              <Row label="Source" value={status.target.detail} />
              {status.target.camera && <Row label="Device" value={status.target.camera} />}
              {status.target.capturedAt && (
                <Row label="Captured" value={status.target.capturedAt} />
              )}
              {status.target.altitude !== undefined && (
                <Row label="Altitude" value={`${Math.round(status.target.altitude)} m`} />
              )}
              {status.target.accuracyKm !== undefined && (
                <Row label="Accuracy" value={formatAccuracy(status.target.accuracyKm)} />
              )}
              {status.target.confidence !== undefined && (
                <Row
                  label="Confidence"
                  value={`${Math.round(status.target.confidence * 100)}%${
                    status.target.corroboration && status.target.corroboration > 1
                      ? ` · ${status.target.corroboration} sources agree`
                      : ''
                  }`}
                />
              )}
            </dl>

            {heldFile && status.target.origin !== 'vision' && (
              <DeepScanButton
                onClick={() => void runDeepScan()}
                label={status.target.origin === 'exif' ? 'Corroborate — deep scan' : 'Deep scan'}
              />
            )}

            <div className="mt-2.5 flex gap-2">
              <button
                type="button"
                onClick={() => onLocate(status.target)}
                className="flex-1 border border-white/20 px-2 py-1.5 text-[9px] uppercase tracking-[0.2em] text-white/80 transition-colors hover:border-white/45 hover:text-white"
              >
                Re-run approach
              </button>
              <button
                type="button"
                onClick={reset}
                className="border border-white/10 px-2 py-1.5 text-[9px] uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-white/80"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {status.kind === 'nofix' && (
          <div>
            <p className="text-[10px] leading-relaxed text-white/70">
              No GPS fix embedded in{' '}
              <span className="text-white/95">{status.name}</span>. Most platforms strip EXIF on
              upload, so this is the usual result for a saved image.
            </p>

            <DeepScanButton onClick={() => void runDeepScan()} label="Deep scan the pixels" />

            {status.suggestions.length > 0 && (
              <>
                <p className="mt-2.5 text-[9px] uppercase tracking-[0.18em] text-white/35">
                  Filename matches these places
                </p>
                <div className="mt-1.5 space-y-1">
                  {status.suggestions.map((suggestion) => (
                    <SuggestionRow
                      key={suggestion.id}
                      suggestion={suggestion}
                      onPick={() =>
                        commit(
                          {
                            longitude: suggestion.longitude,
                            latitude: suggestion.latitude,
                            label: suggestion.label,
                            detail: suggestion.detail,
                            origin: 'place',
                          },
                          status.name,
                        )
                      }
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {status.kind === 'candidates' && (
          <div>
            <div className="flex items-start gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden border border-white/15 bg-white/5">
                {preview && <img src={preview} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[10px] text-white/80">{status.name}</p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-[#b26bd8]">
                  {status.targets.length} candidate{status.targets.length === 1 ? '' : 's'} ·{' '}
                  {(status.elapsedMs / 1000).toFixed(1)}s
                </p>
                <p className="mt-1 text-[9px] leading-relaxed text-white/35">
                  Inferred, not measured. Pick one to fly the globe to it.
                </p>
              </div>
            </div>

            <div className="mt-2.5 space-y-1">
              {status.targets.map((target, index) => (
                <CandidateRow
                  key={`${target.latitude},${target.longitude},${index}`}
                  target={target}
                  onPick={() => commit(target, status.name)}
                />
              ))}
            </div>

            {status.skipped.length > 0 && (
              <p className="mt-2 border-t border-white/10 pt-2 text-[9px] leading-relaxed text-white/35">
                Skipped for a missing key: {status.skipped.join(', ')}. {FAILURE_HINT.unconfigured}
              </p>
            )}

            {status.findings.length > 0 && (
              <div className="mt-2 border-t border-white/10 pt-2">
                <p className="text-[9px] uppercase tracking-[0.18em] text-white/35">Notes</p>
                <ul className="mt-1 space-y-1">
                  {status.findings.map((finding, index) => (
                    <li key={`${finding.source}-${index}`} className="text-[9px] leading-relaxed">
                      {finding.url ? (
                        <a
                          href={finding.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-[#57c3d6] underline-offset-2 hover:underline"
                        >
                          {finding.title}
                        </a>
                      ) : (
                        <span className="text-white/65">{finding.title}</span>
                      )}
                      {finding.detail && (
                        <span className="block text-white/35">{finding.detail}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              type="button"
              onClick={reset}
              className="mt-2.5 w-full border border-white/10 px-2 py-1.5 text-[9px] uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-white/80"
            >
              Clear
            </button>
          </div>
        )}

        {clientSecurity && (
          <SecurityStrip client={clientSecurity} engine={engineSecurity} />
        )}

        {(status.kind === 'idle' || status.kind === 'error' || status.kind === 'nofix') && (
          <div className="mt-2.5 border-t border-white/10 pt-2.5">
            <label className="text-[9px] uppercase tracking-[0.18em] text-white/35">
              Or enter coordinates / place
            </label>
            <div className="mt-1.5 flex gap-1.5">
              <input
                value={manual}
                onChange={(event) => setManual(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') submitManual();
                }}
                placeholder="51.1256, 1.3226"
                className="min-w-0 flex-1 border border-white/15 bg-transparent px-2 py-1.5 text-[10px] text-white/90 placeholder:text-white/25 focus:border-white/40 focus:outline-none"
              />
              <button
                type="button"
                onClick={submitManual}
                className="border border-white/20 px-2.5 text-[9px] uppercase tracking-[0.2em] text-white/80 transition-colors hover:border-white/45 hover:text-white"
              >
                Go
              </button>
            </div>
            {manualSuggestions.length > 0 && (
              <div className="mt-1.5 space-y-1">
                {manualSuggestions.map((suggestion) => (
                  <SuggestionRow
                    key={suggestion.id}
                    suggestion={suggestion}
                    onPick={() =>
                      commit(
                        {
                          longitude: suggestion.longitude,
                          latitude: suggestion.latitude,
                          label: suggestion.label,
                          detail: suggestion.detail,
                          origin: 'place',
                        },
                        suggestion.label,
                      )
                    }
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleFile(file);
          event.target.value = '';
        }}
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-[62px] shrink-0 text-[9px] uppercase tracking-[0.14em] text-white/30">
        {label}
      </dt>
      <dd className="min-w-0 flex-1 text-[9px] leading-relaxed text-white/65">{value}</dd>
    </div>
  );
}

function SuggestionRow({
  suggestion,
  onPick,
}: {
  suggestion: PlaceSuggestion;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onPick}
      className="block w-full border border-white/10 px-2 py-1.5 text-left transition-colors hover:border-white/30 hover:bg-white/5"
    >
      <span className="block truncate text-[10px] text-white/85">{suggestion.label}</span>
      {suggestion.detail && (
        <span className="block truncate text-[9px] text-white/35">{suggestion.detail}</span>
      )}
    </button>
  );
}

/**
 * The one control that sends the photo off this machine. Styled apart from the panel's other
 * buttons and captioned with what it does, so it can never be mistaken for the offline pass.
 */
function DeepScanButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-2.5 flex w-full flex-col items-center gap-0.5 border border-[#b26bd8]/40 bg-[#b26bd8]/5 px-2 py-2 transition-colors hover:border-[#b26bd8]/80 hover:bg-[#b26bd8]/10"
    >
      <span className="text-[9px] uppercase tracking-[0.2em] text-[#d4a5ea]">{label}</span>
      <span className="text-[8px] uppercase tracking-[0.14em] text-white/30">
        Uploads sanitized JPEG · may use configured AI provider
      </span>
    </button>
  );
}

function SecurityStrip({
  client,
  engine,
}: {
  client: BrowserImageSecurityReport;
  engine: OsintImageSecurityReport | null;
}) {
  const review = client.steganography === 'review' || engine?.steganography === 'review';
  const scanner = engine?.malwareScan ?? 'pending';
  const transportVerified = engine?.originalSha256 === client.sanitizedSha256;
  return (
    <div className="mt-2.5 border-t border-white/10 pt-2.5 text-[9px] leading-relaxed text-white/40">
      <p className="uppercase tracking-[0.18em] text-[#57c3d6]">File security</p>
      <p className="mt-1 text-white/55">
        Signature {client.detectedType.toUpperCase()} · {client.width}×{client.height} · SHA-256{' '}
        <span title={client.originalSha256}>{client.originalSha256.slice(0, 12)}…</span>
      </p>
      <p>
        Metadata stripped · raster rewritten{engine ? ' twice' : ''} · stego {review ? 'review' : 'clear'}
      </p>
      {engine && (
        <>
          <p>Transport hash {transportVerified ? 'verified' : 'MISMATCH'}</p>
          <p>AV {scanner} · hash reputation {engine.hashReputation}</p>
        </>
      )}
    </div>
  );
}

/** One fused engine candidate, with the width of its claim shown next to the claim itself. */
function CandidateRow({ target, onPick }: { target: ReconTarget; onPick: () => void }) {
  const meta = ORIGIN_META[target.origin];
  return (
    <button
      type="button"
      onClick={onPick}
      className="block w-full border border-white/10 px-2 py-1.5 text-left transition-colors hover:border-white/30 hover:bg-white/5"
    >
      <span className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: meta.color }} />
        <span
          className="shrink-0 text-[8px] uppercase tracking-[0.18em]"
          style={{ color: meta.color }}
        >
          {meta.code}
        </span>
        <span className="min-w-0 flex-1 truncate text-[10px] text-white/85">{target.label}</span>
        {target.confidence !== undefined && (
          <span className="shrink-0 text-[9px] text-white/45">
            {Math.round(target.confidence * 100)}%
          </span>
        )}
      </span>
      <span className="mt-0.5 block truncate text-[9px] text-white/35">
        {formatDegrees(target.latitude, 'lat')} · {formatDegrees(target.longitude, 'lng')}
        {target.accuracyKm !== undefined && ` · ${formatAccuracy(target.accuracyKm)}`}
        {target.corroboration && target.corroboration > 1 ? ` · ×${target.corroboration}` : ''}
      </span>
    </button>
  );
}

function ReticleGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden>
      <circle cx="8" cy="8" r="5.2" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="8" cy="8" r="1.1" fill="currentColor" />
      <path d="M8 0v3M8 13v3M0 8h3M13 8h3" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

/**
 * Targeting reticle drawn at the projected screen position of the resolved coordinate.
 * `MapGlobe` owns the projection and re-renders this on every camera move.
 */
export function ReconReticle({
  x,
  y,
  label,
  phase,
  color,
}: {
  x: number;
  y: number;
  label: string;
  phase: ReconPhase;
  color: string;
}) {
  const locked = phase === 'locked';
  return (
    <div
      className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2"
      style={{ left: x, top: y, fontFamily: MONO }}
    >
      <svg width="140" height="140" viewBox="0 0 140 140" fill="none" aria-hidden>
        <circle
          className="wt-recon-reticle-ring"
          cx="70"
          cy="70"
          r="62"
          stroke={color}
          strokeWidth="1"
        />
        <circle
          className="wt-recon-reticle-ring wt-recon-reticle-ring--delayed"
          cx="70"
          cy="70"
          r="62"
          stroke={color}
          strokeWidth="1"
        />
        <circle cx="70" cy="70" r="22" stroke={color} strokeWidth="1.1" opacity="0.75" />
        <circle className="wt-recon-reticle-core" cx="70" cy="70" r="3" fill={color} />
        <path
          d="M70 38v-14M70 116v-14M38 70H24M116 70h-14"
          stroke={color}
          strokeWidth="1.1"
          opacity="0.8"
        />
        {locked && (
          <g className="wt-recon-bracket" style={{ transformOrigin: '70px 70px' }}>
            <path
              d="M34 48V34h14M106 48V34H92M34 92v14h14M106 92v14H92"
              stroke={color}
              strokeWidth="1.5"
            />
          </g>
        )}
      </svg>
      <div
        className="absolute left-1/2 top-full -translate-x-1/2 whitespace-nowrap border px-2 py-1 text-[9px] uppercase tracking-[0.18em] backdrop-blur-sm"
        style={{ borderColor: `${color}55`, background: 'rgba(0,0,0,0.8)', color }}
      >
        {label}
      </div>
    </div>
  );
}
