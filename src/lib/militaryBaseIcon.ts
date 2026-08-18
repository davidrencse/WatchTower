import type { Map } from 'maplibre-gl';

/**
 * Bloc-coloured icons for the military-installation overlay.
 *
 * The layer used to be a plain `circle`, which read as one more dot among the event pins. A
 * five-pointed star is the conventional map mark for a military installation and stays legible at
 * the ~9 px the layer draws at when it first fades in.
 *
 * Colour still carries the bloc, exactly as `circle-color` did. Rather than one SDF image tinted
 * by `icon-color`, a sprite is baked per bloc: the sprite is uploaded at the pixel values it was
 * drawn with, so there is no SDF edge convention to get subtly wrong on a canvas that is awkward
 * to eyeball in review.
 *
 * Registered at runtime alongside the recon basemap icons — the style ships no sprite sheet.
 * Ids are `wt-base-<blocKey>`, and `mapGlobeOverlays` stamps a `blocKey` already narrowed to
 * {@link MILITARY_BLOC_KEYS}: an unrecognised bloc would otherwise hit the map's
 * `styleimagemissing` fallback and drop the base to a 1×1 transparent pixel.
 */

/** Bloc keys with a sprite. Must stay in step with `MILITARY_BLOC_COLOR`. */
export const MILITARY_BLOC_KEYS = ['us', 'nato', 'cn', 'ru', 'prk', 'other'] as const;

export type MilitaryBlocKey = (typeof MILITARY_BLOC_KEYS)[number];

export function militaryBaseIconId(blocKey: string): string {
  return `wt-base-${blocKey}`;
}

/** Trace a five-pointed star of radius `outer` around the current origin, one point up. */
function starPath(ctx: CanvasRenderingContext2D, outer: number) {
  const inner = outer * 0.44;
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const radius = i % 2 === 0 ? outer : inner;
    // Start at -90° so a point faces up rather than a valley.
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function baseStarImage(color: string): ImageData | null {
  const size = 18;
  const scale = 2;
  const canvas = document.createElement('canvas');
  canvas.width = size * scale;
  canvas.height = size * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.scale(scale, scale);
  ctx.translate(size / 2, size / 2);

  // Outline stroked first and left under the fill, so the dark edge separates the star from
  // terrain without eating into its coloured area.
  starPath(ctx, 7.6);
  ctx.lineJoin = 'round';
  ctx.lineWidth = 2.6;
  ctx.strokeStyle = 'rgba(0,0,0,0.85)';
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.fill();

  return ctx.getImageData(0, 0, size * scale, size * scale);
}

/**
 * Resolve a missing style image id to a base sprite, or null if unrelated. `colors` is
 * `MILITARY_BLOC_COLOR`, passed in so the palette stays owned by the overlay module that also
 * stamps the colour onto each feature.
 */
export function resolveMilitaryBaseIcon(
  id: string,
  colors: Record<string, string>,
): { image: ImageData; pixelRatio: number } | null {
  const match = /^wt-base-([a-z]+)$/.exec(id);
  if (!match) return null;
  const key = match[1]!;
  if (!(MILITARY_BLOC_KEYS as readonly string[]).includes(key)) return null;
  const image = baseStarImage(colors[key] ?? colors.other ?? '#9aa2ad');
  return image ? { image, pixelRatio: 2 } : null;
}

/** Eagerly register every bloc sprite (idempotent). */
export function registerMilitaryBaseIcons(map: Map, colors: Record<string, string>) {
  for (const key of MILITARY_BLOC_KEYS) {
    const id = militaryBaseIconId(key);
    if (map.hasImage(id)) continue;
    const image = baseStarImage(colors[key] ?? colors.other ?? '#9aa2ad');
    if (image) map.addImage(id, image, { pixelRatio: 2 });
  }
}
