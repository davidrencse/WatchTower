import type { Map } from 'maplibre-gl';

/**
 * Monochrome recon icons for close-zoom basemap POIs (airports + major-road shields).
 * Registered at runtime — the style has no sprite sheet, matching the dark map aesthetic.
 */

export const RECON_AIRPORT_ICON = 'wt-airport';

export function reconRoadShieldIconId(refLength: number): string {
  return `wt-road-${refLength}`;
}

function airportImage(): ImageData | null {
  const size = 22;
  const scale = 2;
  const canvas = document.createElement('canvas');
  canvas.width = size * scale;
  canvas.height = size * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.scale(scale, scale);
  ctx.translate(size / 2, size / 2);

  // Soft disc so the glyph reads on dark terrain without a tourist-map pin.
  ctx.beginPath();
  ctx.arc(0, 0, 9.2, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(18, 18, 20, 0.72)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(235, 235, 235, 0.55)';
  ctx.lineWidth = 1;
  ctx.stroke();

  const plane = () => {
    ctx.beginPath();
    ctx.moveTo(0, -6.2);
    ctx.lineTo(-1.5, 1.4);
    ctx.lineTo(-5.4, 3.6);
    ctx.lineTo(-5.7, 2.1);
    ctx.lineTo(-1.85, -0.35);
    ctx.lineTo(-2.35, 5.1);
    ctx.lineTo(-1.15, 5.7);
    ctx.lineTo(0, 2.15);
    ctx.lineTo(1.15, 5.7);
    ctx.lineTo(2.35, 5.1);
    ctx.lineTo(1.85, -0.35);
    ctx.lineTo(5.7, 2.1);
    ctx.lineTo(5.4, 3.6);
    ctx.lineTo(1.5, 1.4);
    ctx.closePath();
  };

  plane();
  ctx.fillStyle = 'rgba(0,0,0,0.85)';
  ctx.fill();
  plane();
  ctx.fillStyle = '#f2f2f2';
  ctx.fill();

  return ctx.getImageData(0, 0, size * scale, size * scale);
}

function roadShieldImage(refLength: number): ImageData | null {
  const len = Math.max(1, Math.min(6, Math.round(refLength)));
  const height = 16;
  const width = 12 + len * 6;
  const scale = 2;
  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.scale(scale, scale);
  const r = 3;
  ctx.beginPath();
  ctx.moveTo(r, 0.5);
  ctx.lineTo(width - r, 0.5);
  ctx.quadraticCurveTo(width - 0.5, 0.5, width - 0.5, r);
  ctx.lineTo(width - 0.5, height - r);
  ctx.quadraticCurveTo(width - 0.5, height - 0.5, width - r, height - 0.5);
  ctx.lineTo(r, height - 0.5);
  ctx.quadraticCurveTo(0.5, height - 0.5, 0.5, height - r);
  ctx.lineTo(0.5, r);
  ctx.quadraticCurveTo(0.5, 0.5, r, 0.5);
  ctx.closePath();

  ctx.fillStyle = 'rgba(34, 34, 36, 0.92)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(220, 220, 220, 0.7)';
  ctx.lineWidth = 1;
  ctx.stroke();

  return ctx.getImageData(0, 0, width * scale, height * scale);
}

/** Resolve a missing style image id to a recon icon, or null if unrelated. */
export function resolveReconIcon(id: string): { image: ImageData; pixelRatio: number } | null {
  if (id === RECON_AIRPORT_ICON) {
    const image = airportImage();
    return image ? { image, pixelRatio: 2 } : null;
  }
  const match = /^wt-road-([1-6])$/.exec(id);
  if (match) {
    const image = roadShieldImage(Number(match[1]));
    return image ? { image, pixelRatio: 2 } : null;
  }
  return null;
}

/** Eagerly register all recon basemap icons (idempotent). */
export function registerReconIcons(map: Map) {
  const airport = airportImage();
  if (airport && !map.hasImage(RECON_AIRPORT_ICON)) {
    map.addImage(RECON_AIRPORT_ICON, airport, { pixelRatio: 2 });
  }
  for (let length = 1; length <= 6; length += 1) {
    const id = reconRoadShieldIconId(length);
    if (map.hasImage(id)) continue;
    const image = roadShieldImage(length);
    if (image) map.addImage(id, image, { pixelRatio: 2 });
  }
}
