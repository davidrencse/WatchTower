// Bakes Natural Earth 10m admin-0 boundary lines into compact globe border layers.
// Output: public/geo/world-borders.json + world-disputed-borders.json
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dir = dirname(fileURLToPath(import.meta.url));
const sourcePath = resolve(__dir, '_ne10_boundary_lines_land.json');
const sourceUrl =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_boundary_lines_land.geojson';
const geo = existsSync(sourcePath)
  ? JSON.parse(readFileSync(sourcePath, 'utf8'))
  : await fetch(sourceUrl).then((response) => {
      if (!response.ok) throw new Error(`Natural Earth download failed: ${response.status}`);
      return response.json();
    });

function perpendicularDistance(point, start, end) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared === 0) return Math.hypot(point[0] - start[0], point[1] - start[1]);
  let t =
    ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) / lengthSquared;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(
    point[0] - (start[0] + t * dx),
    point[1] - (start[1] + t * dy),
  );
}

function simplify(points, tolerance) {
  if (points.length < 4) return points;
  let maxDistance = 0;
  let index = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const distance = perpendicularDistance(points[i], points[0], points[points.length - 1]);
    if (distance > maxDistance) {
      maxDistance = distance;
      index = i;
    }
  }
  if (maxDistance <= tolerance) return [points[0], points[points.length - 1]];
  return simplify(points.slice(0, index + 1), tolerance)
    .slice(0, -1)
    .concat(simplify(points.slice(index), tolerance));
}

const quantize = (value) => Math.round(value * 1000) / 1000;
const borders = [];
const disputedBorders = [];

for (const feature of geo.features) {
  const lines =
    feature.geometry.type === 'LineString'
      ? [feature.geometry.coordinates]
      : feature.geometry.coordinates;
  const target = feature.properties.FEATURECLA === 'International boundary (verify)'
    ? borders
    : disputedBorders;

  for (const line of lines) {
    if (!line || line.length < 2) continue;
    const simplified = simplify(line, 0.018);
    if (simplified.length < 2) continue;
    target.push(
      simplified.flatMap(([longitude, latitude]) => [
        quantize(longitude),
        quantize(latitude),
      ]),
    );
  }
}

const bordersDest = resolve(__dir, '..', 'public', 'geo', 'world-borders.json');
mkdirSync(dirname(bordersDest), { recursive: true });
const output = JSON.stringify(borders);
writeFileSync(bordersDest, output);
writeFileSync(
  resolve(__dir, '..', 'public', 'geo', 'world-disputed-borders.json'),
  JSON.stringify(disputedBorders),
);
const vertices = [...borders, ...disputedBorders].reduce(
  (total, line) => total + line.length / 2,
  0,
);
console.log(
  `world borders: ${borders.length} primary + ${disputedBorders.length} disputed lines, ${vertices} vertices → public/geo/world-borders.json (${(
    output.length / 1024
  ).toFixed(1)} KB)`,
);
