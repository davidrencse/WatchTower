import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(projectRoot, 'dist');
const htmlPath = path.join(distDir, 'index.html');
const assetsDir = path.join(distDir, 'assets');

const KB = 1024;
const limits = {
  initialFileGzip: 200 * KB,
  initialTotalGzip: 250 * KB,
  asyncFileGzip: 300 * KB,
};

if (!fs.existsSync(htmlPath) || !fs.existsSync(assetsDir)) {
  throw new Error('dist output is missing; run the production build before checking bundle sizes.');
}

const html = fs.readFileSync(htmlPath, 'utf8');
const initialAssetNames = new Set(
  [...html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)=["']\/assets\/([^"']+\.js)["'][^>]*>/gi)]
    .map((match) => match[1]),
);

const javascriptFiles = fs.readdirSync(assetsDir).filter((name) => name.endsWith('.js'));
const measurements = javascriptFiles.map((name) => {
  const bytes = fs.readFileSync(path.join(assetsDir, name));
  return {
    name,
    raw: bytes.length,
    gzip: gzipSync(bytes, { level: 9 }).length,
    initial: initialAssetNames.has(name),
  };
});

const initial = measurements.filter((asset) => asset.initial);
const initialTotal = initial.reduce((total, asset) => total + asset.gzip, 0);
const failures = [];

if (initial.length === 0) failures.push('No initial JavaScript assets were found in dist/index.html.');
if (initialTotal > limits.initialTotalGzip) {
  failures.push(`Initial JavaScript totals ${(initialTotal / KB).toFixed(1)} KB gzip (limit: ${limits.initialTotalGzip / KB} KB).`);
}

for (const asset of measurements) {
  const limit = asset.initial ? limits.initialFileGzip : limits.asyncFileGzip;
  if (asset.gzip > limit) {
    failures.push(`${asset.name} is ${(asset.gzip / KB).toFixed(1)} KB gzip (limit: ${limit / KB} KB).`);
  }
}

const largest = [...measurements].sort((a, b) => b.gzip - a.gzip).slice(0, 5);
console.log(`Initial JavaScript: ${(initialTotal / KB).toFixed(1)} KB gzip across ${initial.length} files.`);
console.log('Largest JavaScript chunks (gzip):');
for (const asset of largest) {
  console.log(`  ${(asset.gzip / KB).toFixed(1).padStart(6)} KB  ${asset.initial ? 'initial ' : 'async   '}  ${asset.name}`);
}

if (failures.length > 0) {
  console.error('\nBundle budget failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log('Bundle budget passed.');
}
