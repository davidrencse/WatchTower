import { FLAGS } from './flags';
import { flagIdHasCountryStats, getIso3ForFlagId } from '../lib/flagIsoMapping';
import { COUNTRY_ANCHORS } from './countryAnchors';
import type { FlagEntry } from '../types/flag';

/**
 * Data for the interactive globe on the landing page. Markers come in two flavours:
 *  - `live`: a country that already has a dossier page. Sourced from `FLAGS` so clicking one
 *    routes through the exact same `FlagEntry` the gallery used — no parallel table to keep in
 *    sync.
 *  - `soon`: a country whose page is "in the works" (flag art exists but no dossier yet). These
 *    are intentionally excluded from `FLAGS`, so they're listed explicitly here and are not
 *    clickable into a page.
 *
 * Each marker is joined to a label anchor in `COUNTRY_ANCHORS` by ISO-3 code; the
 * polygon centroid doubles as the label anchor.
 */
export type GlobeStatus = 'live' | 'soon';

export interface GlobeMarker {
  id: string;
  label: string;
  /** Flag PNG under `/flags/…`, used for the hover card. */
  src: string;
  /** ISO 3166-1 alpha-3 — key into `COUNTRY_ANCHORS` and `/geo/country-shapes.json`. */
  iso: string;
  /** Label anchor [lat, lng] (polygon centroid). */
  lat: number;
  lng: number;
  status: GlobeStatus;
  /** Real gallery entry for `live` markers (drives routing); `null` for `soon`. */
  flag: FlagEntry | null;
}

/** Countries whose pages are being built (flag exists, no dossier yet). */
const SOON: { id: string; label: string; iso: string }[] = [
  { id: 'flag-of-Albania.png', label: 'Albania', iso: 'ALB' },
  { id: 'flag-of-Andorra.png', label: 'Andorra', iso: 'AND' },
  { id: 'flag-of-Armenia.png', label: 'Armenia', iso: 'ARM' },
  { id: 'flag-of-Azerbaijan.png', label: 'Azerbaijan', iso: 'AZE' },
  { id: 'flag-of-Georgia.png', label: 'Georgia', iso: 'GEO' },
  { id: 'flag-of-North-Macedonia.png', label: 'North Macedonia', iso: 'MKD' },
  { id: 'flag-of-Russia.png', label: 'Russia', iso: 'RUS' },
  { id: 'flag-of-San-Marino.png', label: 'San Marino', iso: 'SMR' },
  { id: 'flag-of-Ukraine.png', label: 'Ukraine', iso: 'UKR' },
];

function anchorFor(iso: string): [number, number] | null {
  const a = COUNTRY_ANCHORS[iso];
  if (!a) return null;
  return [a[1], a[0]]; // stored [lng, lat] → return [lat, lng]
}

function buildMarkers(): GlobeMarker[] {
  const out: GlobeMarker[] = [];

  for (const flag of FLAGS) {
    if (!flagIdHasCountryStats(flag.id)) continue;
    const iso = getIso3ForFlagId(flag.id);
    if (!iso) continue;
    const anchor = anchorFor(iso);
    if (!anchor) continue;
    out.push({
      id: flag.id,
      label: flag.label,
      src: flag.src,
      iso,
      lat: anchor[0],
      lng: anchor[1],
      status: 'live',
      flag,
    });
  }

  for (const s of SOON) {
    const anchor = anchorFor(s.iso);
    if (!anchor) continue;
    out.push({
      id: s.id,
      label: s.label,
      src: `/flags/${encodeURIComponent(s.id)}`,
      iso: s.iso,
      lat: anchor[0],
      lng: anchor[1],
      status: 'soon',
      flag: null,
    });
  }

  return out;
}

export const GLOBE_MARKERS: GlobeMarker[] = buildMarkers();
