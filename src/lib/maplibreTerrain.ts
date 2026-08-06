import type { Map } from 'maplibre-gl';

/** Mild mesh — less vertex work than a dramatic exaggeration. */
const TERRAIN_EXAGGERATION = 1.15;

/** Require a real tilt before paying for the DEM mesh (was pitch > 1). */
const TERRAIN_MIN_PITCH = 12;

/**
 * Detach terrain before city / building zooms. DEM mesh + fill-extrusion together
 * are the main hitch when diving in; buildings own the GPU from here.
 */
export const TERRAIN_DETACH_ZOOM = 11.5;

/** Attach 3D terrain mesh only while tilted and still regional — not at city detail. */
export function syncTerrain(map: Map) {
  if (!map.getSource('terrain-dem')) return;
  const want = map.getPitch() > TERRAIN_MIN_PITCH && map.getZoom() < TERRAIN_DETACH_ZOOM;
  const has = !!map.getTerrain();
  if (want && !has) {
    map.setTerrain({ source: 'terrain-dem', exaggeration: TERRAIN_EXAGGERATION });
  } else if (!want && has) {
    map.setTerrain(null);
  }
}
