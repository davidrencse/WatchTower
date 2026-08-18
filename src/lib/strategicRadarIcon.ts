import type { Map } from 'maplibre-gl';

import {
  STRATEGIC_RADAR_MISSION_META,
  type StrategicRadarMission,
} from '../data/strategicRadarStations';

const MISSIONS = Object.keys(STRATEGIC_RADAR_MISSION_META) as StrategicRadarMission[];

export function strategicRadarIconId(mission: StrategicRadarMission): string {
  return `wt-radar-${mission}`;
}

/** A tiny fixed reticle: standing sensor infrastructure, deliberately not a pulsing event pin. */
function radarImage(color: string): ImageData | null {
  const size = 22;
  const scale = 2;
  const canvas = document.createElement('canvas');
  canvas.width = size * scale;
  canvas.height = size * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.scale(scale, scale);
  ctx.translate(size / 2, size / 2);
  ctx.strokeStyle = 'rgba(0,0,0,0.9)';
  ctx.fillStyle = color;
  ctx.lineCap = 'round';

  // Dark casing first keeps the hairline glyph readable over terrain and country fills.
  ctx.lineWidth = 3.4;
  ctx.beginPath();
  ctx.arc(0, 0, 7.4, Math.PI, Math.PI * 2);
  ctx.moveTo(-4.2, 0);
  ctx.arc(0, 0, 4.2, Math.PI, Math.PI * 2);
  ctx.moveTo(0, 0);
  ctx.lineTo(5.4, -5.4);
  ctx.stroke();

  ctx.strokeStyle = color;
  ctx.lineWidth = 1.35;
  ctx.beginPath();
  ctx.arc(0, 0, 7.4, Math.PI, Math.PI * 2);
  ctx.moveTo(-4.2, 0);
  ctx.arc(0, 0, 4.2, Math.PI, Math.PI * 2);
  ctx.moveTo(0, 0);
  ctx.lineTo(5.4, -5.4);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, 1.65, 0, Math.PI * 2);
  ctx.fill();

  return ctx.getImageData(0, 0, size * scale, size * scale);
}

export function resolveStrategicRadarIcon(
  id: string,
): { image: ImageData; pixelRatio: number } | null {
  const match = /^wt-radar-(warning|defense|space)$/.exec(id);
  if (!match) return null;
  const mission = match[1] as StrategicRadarMission;
  const image = radarImage(STRATEGIC_RADAR_MISSION_META[mission].color);
  return image ? { image, pixelRatio: 2 } : null;
}

export function registerStrategicRadarIcons(map: Map) {
  for (const mission of MISSIONS) {
    const id = strategicRadarIconId(mission);
    if (map.hasImage(id)) continue;
    const image = radarImage(STRATEGIC_RADAR_MISSION_META[mission].color);
    if (image) map.addImage(id, image, { pixelRatio: 2 });
  }
}
