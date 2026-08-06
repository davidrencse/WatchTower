import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(projectRoot, 'dist');
const indexPath = path.join(distDir, 'index.html');
const flagsDir = path.join(projectRoot, 'Assets', 'Flags');
const siteOrigin = (process.env.VITE_SITE_URL || 'https://watchtower.app').replace(/\/+$/, '');

const excludedFlags = new Set([
  'flag-of-Albania.png',
  'flag-of-Andorra.png',
  'flag-of-Armenia.png',
  'flag-of-Azerbaijan.png',
  'flag-of-Georgia.png',
  'flag-of-North-Macedonia.png',
  'flag-of-San-Marino.png',
]);

if (!fs.existsSync(indexPath)) throw new Error('dist/index.html is missing; run Vite before prerendering SEO routes.');
if (!fs.existsSync(flagsDir)) throw new Error('Assets/Flags is missing; country routes cannot be discovered.');

const rootHtml = fs.readFileSync(indexPath, 'utf8');
const countries = fs
  .readdirSync(flagsDir)
  .filter((filename) => /^flag-of-.+\.png$/i.test(filename) && !excludedFlags.has(filename))
  .map((filename) => {
    const name = filename.replace(/^flag-of-/i, '').replace(/\.png$/i, '');
    return { label: name.replace(/-/g, ' '), slug: name.toLowerCase() };
  })
  .sort((a, b) => a.label.localeCompare(b.label));

function countryHtml(country) {
  const title = `${country.label} · WatchTower`;
  const canonicalUrl = `${siteOrigin}/${country.slug}`;
  return rootHtml
    .replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`)
    .replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/i, `$1${canonicalUrl}$2`)
    .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/i, `$1${title}$2`)
    .replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/i, `$1${canonicalUrl}$2`);
}

for (const country of countries) {
  const routeDir = path.join(distDir, country.slug);
  fs.mkdirSync(routeDir, { recursive: true });
  fs.writeFileSync(path.join(routeDir, 'index.html'), countryHtml(country));
}

const sitemapUrls = ['/', ...countries.map((country) => `/${country.slug}`)];
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...sitemapUrls.map((route) => `  <url><loc>${siteOrigin}${route}</loc></url>`),
  '</urlset>',
  '',
].join('\n');
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);

console.log(`Prerendered SEO metadata for ${countries.length} country routes and generated sitemap.xml.`);
