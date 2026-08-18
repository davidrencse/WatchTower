import type { Map } from 'maplibre-gl';

/**
 * Map symbols for the Russo-Ukrainian order-of-battle layer.
 *
 * Two families, both baked as sprites the way `militaryBaseIcon.ts` bakes its bloc stars — the
 * style ships no sprite sheet, and a pre-coloured image avoids getting an SDF edge convention
 * subtly wrong on a canvas that is awkward to review.
 *
 *   • **Formations** get the APP-6 land-unit frame: a plain rectangle with echelon marks above
 *     it (`XXX` corps, `XXXX` army group / theatre command). That is the conventional mark for a
 *     formation and, unlike a dot, says at a glance that it denotes a *command*, not a place.
 *   • **Fixed sites** get a kind glyph inside a circle — runway, anchor, or pennant.
 *
 * Colour carries the side and nothing else, so the two orders of battle stay readable when they
 * interleave along the line of contact.
 *
 * Ids are `wt-unit-<side>-<echelon>` and `wt-warsite-<side>-<kind>`, both lowercase.
 */

export const WAR_UNIT_SIDES = ['rus', 'ukr'] as const;
export const WAR_UNIT_ECHELONS = ['division', 'corps', 'army', 'grouping', 'command'] as const;
export const WAR_SITE_KINDS = ['airbase', 'naval', 'hq', 'garrison'] as const;

export type WarUnitSideKey = (typeof WAR_UNIT_SIDES)[number];
export type WarUnitEchelonKey = (typeof WAR_UNIT_ECHELONS)[number];
export type WarSiteKindKey = (typeof WAR_SITE_KINDS)[number];

export function warUnitIconId(side: string, echelon: string): string {
  return `wt-unit-${side.toLowerCase()}-${echelon.toLowerCase()}`;
}

export function warSiteIconId(side: string, kind: string): string {
  return `wt-warsite-${side.toLowerCase()}-${kind.toLowerCase()}`;
}

const SCALE = 2;

function canvasOf(width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width * SCALE;
  canvas.height = height * SCALE;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.scale(SCALE, SCALE);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  return ctx;
}

/** One echelon `X`, centred on (x, y). */
function echelonMark(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x - r, y - r);
  ctx.lineTo(x + r, y + r);
  ctx.moveTo(x + r, y - r);
  ctx.lineTo(x - r, y + r);
  ctx.stroke();
}

const ECHELON_MARKS: Record<WarUnitEchelonKey, number> = {
  division: 2,
  corps: 3,
  army: 4,
  grouping: 5,
  command: 6,
};

function formationImage(color: string, echelon: WarUnitEchelonKey): ImageData | null {
  const width = 34;
  const height = 26;
  const ctx = canvasOf(width, height);
  if (!ctx) return null;

  ctx.translate(width / 2, height / 2);

  // Frame sits low in the canvas so the echelon marks have room above it without the sprite
  // needing a different anchor per echelon.
  const boxW = 22;
  const boxH = 13;
  const boxTop = -1.5;

  // Dark backing first: the frame has to stay legible over both the terrain and the war
  // control fills it will usually be drawn on top of.
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(-boxW / 2, boxTop, boxW, boxH);

  ctx.strokeStyle = 'rgba(0,0,0,0.9)';
  ctx.lineWidth = 3.4;
  ctx.strokeRect(-boxW / 2, boxTop, boxW, boxH);

  ctx.strokeStyle = color;
  ctx.lineWidth = 1.8;
  ctx.strokeRect(-boxW / 2, boxTop, boxW, boxH);

  // APP-6 echelon marks: XX division, XXX corps, XXXX army, XXXXX front, XXXXXX theatre.
  const marks = ECHELON_MARKS[echelon];
  const r = 2.1;
  // Five and six marks would overrun the 34 px sprite at the normal spacing, so they tighten up.
  const gap = marks >= 5 ? 4.6 : 5.4;
  const y = boxTop - 5.4;
  const start = -((marks - 1) * gap) / 2;

  ctx.strokeStyle = 'rgba(0,0,0,0.9)';
  ctx.lineWidth = 3.2;
  for (let i = 0; i < marks; i++) echelonMark(ctx, start + i * gap, y, r);

  ctx.strokeStyle = color;
  ctx.lineWidth = 1.6;
  for (let i = 0; i < marks; i++) echelonMark(ctx, start + i * gap, y, r);

  return ctx.getImageData(0, 0, width * SCALE, height * SCALE);
}

function siteGlyph(ctx: CanvasRenderingContext2D, kind: WarSiteKindKey) {
  if (kind === 'airbase') {
    // Crossed runways — the ICAO-style aerodrome mark, not an aircraft silhouette, which turns
    // to mush at the ~10 px these draw at.
    ctx.beginPath();
    ctx.moveTo(-4.6, 1.8);
    ctx.lineTo(4.6, -1.8);
    ctx.moveTo(-2.6, -4.2);
    ctx.lineTo(2.6, 4.2);
    ctx.stroke();
    return;
  }
  if (kind === 'naval') {
    // Anchor: shank, stock, and a curved crown.
    ctx.beginPath();
    ctx.moveTo(0, -4.4);
    ctx.lineTo(0, 3.4);
    ctx.moveTo(-3.0, -2.2);
    ctx.lineTo(3.0, -2.2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 1.4, 3.6, Math.PI * 0.15, Math.PI * 0.85);
    ctx.stroke();
    return;
  }
  if (kind === 'garrison') {
    // Barracks: a gabled block. Deliberately a *building*, because a garrison marker denotes a
    // home station — somewhere a formation is based, not somewhere it is deployed.
    ctx.beginPath();
    ctx.moveTo(-4.4, 4.0);
    ctx.lineTo(-4.4, -0.8);
    ctx.lineTo(0, -4.4);
    ctx.lineTo(4.4, -0.8);
    ctx.lineTo(4.4, 4.0);
    ctx.closePath();
    ctx.stroke();
    return;
  }
  // hq — a pennant on a staff.
  ctx.beginPath();
  ctx.moveTo(-2.6, 4.6);
  ctx.lineTo(-2.6, -4.6);
  ctx.lineTo(4.4, -2.6);
  ctx.lineTo(-2.6, -0.6);
  ctx.stroke();
}

function siteImage(color: string, kind: WarSiteKindKey): ImageData | null {
  const size = 22;
  const ctx = canvasOf(size, size);
  if (!ctx) return null;

  ctx.translate(size / 2, size / 2);

  ctx.beginPath();
  ctx.arc(0, 0, 8.2, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.72)';
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.6;
  ctx.stroke();

  ctx.strokeStyle = 'rgba(0,0,0,0.9)';
  ctx.lineWidth = 3.2;
  siteGlyph(ctx, kind);

  ctx.strokeStyle = color;
  ctx.lineWidth = 1.7;
  siteGlyph(ctx, kind);

  return ctx.getImageData(0, 0, size * SCALE, size * SCALE);
}

const UNIT_ID = /^wt-unit-([a-z]+)-([a-z]+)$/;
const SITE_ID = /^wt-warsite-([a-z]+)-([a-z]+)$/;

/**
 * Resolve a missing style image id to an order-of-battle sprite, or null if unrelated.
 * `colors` is keyed by the lowercase side key, so the palette stays owned by the overlay module
 * that also stamps the colour onto each feature.
 */
export function resolveWarUnitIcon(
  id: string,
  colors: Record<string, string>,
): { image: ImageData; pixelRatio: number } | null {
  const unit = UNIT_ID.exec(id);
  if (unit) {
    const [, side, echelon] = unit;
    if (!(WAR_UNIT_SIDES as readonly string[]).includes(side!)) return null;
    if (!(WAR_UNIT_ECHELONS as readonly string[]).includes(echelon!)) return null;
    const image = formationImage(colors[side!] ?? '#ffffff', echelon as WarUnitEchelonKey);
    return image ? { image, pixelRatio: SCALE } : null;
  }

  const site = SITE_ID.exec(id);
  if (site) {
    const [, side, kind] = site;
    if (!(WAR_UNIT_SIDES as readonly string[]).includes(side!)) return null;
    if (!(WAR_SITE_KINDS as readonly string[]).includes(kind!)) return null;
    const image = siteImage(colors[side!] ?? '#ffffff', kind as WarSiteKindKey);
    return image ? { image, pixelRatio: SCALE } : null;
  }

  return null;
}

/** Eagerly register every order-of-battle sprite (idempotent). */
export function registerWarUnitIcons(map: Map, colors: Record<string, string>) {
  for (const side of WAR_UNIT_SIDES) {
    const color = colors[side] ?? '#ffffff';
    for (const echelon of WAR_UNIT_ECHELONS) {
      const id = warUnitIconId(side, echelon);
      if (map.hasImage(id)) continue;
      const image = formationImage(color, echelon);
      if (image) map.addImage(id, image, { pixelRatio: SCALE });
    }
    for (const kind of WAR_SITE_KINDS) {
      const id = warSiteIconId(side, kind);
      if (map.hasImage(id)) continue;
      const image = siteImage(color, kind);
      if (image) map.addImage(id, image, { pixelRatio: SCALE });
    }
  }
}
