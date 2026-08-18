/**
 * The evidence scale shared by the Recon panel and the globe reticle it drives.
 *
 * It lives in its own module for two reasons. Practically, `MapGlobe` needs the colour to draw
 * the reticle and importing a plain function out of `ReconLocator.tsx` would cost that file its
 * fast refresh. More usefully, it puts the ladder in one readable place: colour here encodes how
 * the coordinate was *obtained*, not which code path produced it, so cyan always means a device
 * measured it and violet always means a model guessed it — on the panel chip, in the candidate
 * list and on the reticle alike. A new rung must pick a side of that line.
 */

/** Which rung of the resolution ladder produced a fix, weakest evidence last. */
export type ReconOrigin = 'exif' | 'coordinates' | 'place' | 'geocoded' | 'vision';

export interface ReconOriginMeta {
  /** Short chip code shown next to the coordinate. */
  code: string;
  label: string;
  color: string;
}

export const RECON_ORIGIN_META: Record<ReconOrigin, ReconOriginMeta> = {
  exif: { code: 'EXIF', label: 'Device GPS fix', color: '#57c3d6' },
  coordinates: { code: 'COORD', label: 'Parsed coordinates', color: '#d8c24a' },
  place: { code: 'MATCH', label: 'Place-name match', color: '#e07b39' },
  geocoded: { code: 'GEO', label: 'Geocoded from image', color: '#5f8fd8' },
  vision: { code: 'VIS', label: 'AI visual estimate', color: '#b26bd8' },
};

export function reconOriginColor(origin: ReconOrigin): string {
  return RECON_ORIGIN_META[origin].color;
}
