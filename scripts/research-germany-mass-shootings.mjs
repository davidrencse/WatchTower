/**
 * Builds the curated Germany mass-shooting globe layer from the cited Wikipedia index and the
 * coordinates on its linked place pages. This is an explicit research task, not part of `build`.
 *
 * Run: node scripts/research-germany-mass-shootings.mjs
 */
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SOURCE_PAGE = 'List_of_mass_shootings_in_Germany';
const SOURCE_PAGE_URL = 'https://en.wikipedia.org/wiki/List_of_mass_shootings_in_Germany';
const RESEARCHED_ON = '17 August 2026';
const EVENT_LIMIT = 60;

const raw = await fetch(
  `https://en.wikipedia.org/w/index.php?title=${SOURCE_PAGE}&action=raw`,
  { headers: { 'user-agent': 'WatchTower research/1.0' } },
).then((response) => {
  if (!response.ok) throw new Error(`Incident index failed: ${response.status}`);
  return response.text();
});

const stripRefs = (value) =>
  value.replace(/<ref\b[^>]*\/>/g, '').replace(/<ref\b[^>]*>[\s\S]*?<\/ref>/g, '');

const plain = (value) =>
  stripRefs(value)
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/'''?/g, '')
    .replace(/\{\{[^{}]*\}\}/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const rows = raw
  .split(/\r?\n\|-\r?\n/)
  .map((block) =>
    block
      .split(/\r?\n/)
      .filter((line) => line.startsWith('|'))
      .map((line) => line.slice(1)),
  )
  .filter((fields) => /^\d{1,2} [A-Z][a-z]+ \d{4}$/.test(fields[0] ?? ''))
  .slice(0, EVENT_LIMIT);

if (rows.length < EVENT_LIMIT) {
  throw new Error(`Expected ${EVENT_LIMIT} incidents, found ${rows.length}`);
}

const entries = rows.map((fields) => {
  const [date, location, dead, injured, , description] = fields;
  const placeLink = location.match(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/);
  const eventLink = stripRefs(description).match(/^\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/);
  const sourceUrl =
    description.match(/\|url\s*=\s*([^|}\s]+(?:[^|}]*?[^|}\s])?)(?=\s*\||\s*}})/)?.[1]?.trim() ??
    SOURCE_PAGE_URL;

  return {
    date,
    place: plain(location),
    placePage: placeLink?.[1],
    killed: Number(plain(dead)),
    injured: Number(plain(injured)),
    title: eventLink ? (eventLink[2] ?? eventLink[1]) : `${plain(location).split(',')[0]} mass shooting`,
    summary: plain(description),
    sourceUrl,
  };
});

const placePages = [...new Set(entries.map((entry) => entry.placePage).filter(Boolean))];
const coordinates = new Map();

// Short batches avoid URL-length limits while keeping this to three read-only API requests.
for (let start = 0; start < placePages.length; start += 20) {
  const chunk = placePages.slice(start, start + 20);
  const url = new URL('https://en.wikipedia.org/w/api.php');
  url.search = new URLSearchParams({
    action: 'query',
    prop: 'coordinates',
    colimit: 'max',
    titles: chunk.join('|'),
    redirects: '1',
    format: 'json',
    formatversion: '2',
    origin: '*',
  });

  const data = await fetch(url, { headers: { 'user-agent': 'WatchTower research/1.0' } }).then(
    (response) => {
      if (!response.ok) throw new Error(`Place coordinates failed: ${response.status}`);
      return response.json();
    },
  );
  const aliases = new Map([
    ...(data.query.normalized ?? []).map((item) => [item.from, item.to]),
    ...(data.query.redirects ?? []).map((item) => [item.from, item.to]),
  ]);

  for (const page of data.query.pages) {
    const coordinate = page.coordinates?.[0];
    if (coordinate) coordinates.set(page.title, [coordinate.lon, coordinate.lat]);
  }

  let changed = true;
  while (changed) {
    changed = false;
    for (const [from, to] of aliases) {
      const resolved = coordinates.get(to);
      if (resolved && !coordinates.has(from)) {
        coordinates.set(from, resolved);
        changed = true;
      }
    }
  }
}

const missingPlaces = entries.filter((entry) => !coordinates.has(entry.placePage));
if (missingPlaces.length) {
  throw new Error(`Missing coordinates: ${missingPlaces.map((entry) => entry.placePage).join(', ')}`);
}

const months = {
  January: '01',
  February: '02',
  March: '03',
  April: '04',
  May: '05',
  June: '06',
  July: '07',
  August: '08',
  September: '09',
  October: '10',
  November: '11',
  December: '12',
};

const isoDate = (value) => {
  const [day, month, year] = value.split(' ');
  return `${year}-${months[month]}-${day.padStart(2, '0')}`;
};

const slug = (value) =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const q = (value) => Math.round(value * 10000) / 10000;
const quoted = (value) => JSON.stringify(value);
const sourceLabel = (value) => {
  try {
    return new URL(value).hostname.replace(/^www\./, '');
  } catch {
    return 'Wikipedia';
  }
};

const records = entries.map((entry) => {
  const [longitude, latitude] = coordinates.get(entry.placePage);
  const date = isoDate(entry.date);
  const areaPlot = /district|near |\/| and /i.test(entry.place);
  return [
    '  {',
    `    id: ${quoted(`de-ms-${date}-${slug(entry.place.split(',')[0])}`)},`,
    `    date: ${quoted(date)},`,
    `    title: ${quoted(entry.title)},`,
    `    place: ${quoted(entry.place)},`,
    `    coordinate: [${q(longitude)}, ${q(latitude)}],`,
    `    precision: ${quoted(areaPlot ? 'area' : 'city')},`,
    `    killed: ${entry.killed},`,
    `    injured: ${entry.injured},`,
    `    summary: ${quoted(entry.summary)},`,
    `    source: ${quoted(sourceLabel(entry.sourceUrl))},`,
    `    url: ${quoted(entry.sourceUrl)},`,
    '  },',
  ].join('\n');
});

const output = `/**
 * Sixty documented mass-shooting incidents in Germany, May 2008–June 2026.
 *
 * Inclusion follows the source list's operational definition: firearm incidents with at least
 * four total casualties. The reported dead count can include the perpetrator where the source
 * table explicitly does so; summaries preserve that context. Coordinates are settlement or area
 * centroids from the linked Wikipedia place pages, never claimed as street-level incident sites.
 *
 * Research snapshot: ${RESEARCHED_ON}
 * Source index: ${SOURCE_PAGE_URL}
 */

export type GermanyMassShootingPrecision = 'city' | 'area';

export interface GermanyMassShooting {
  id: string;
  date: string;
  title: string;
  place: string;
  /** Settlement/area centroid in GeoJSON order, not an exact crime-scene address. */
  coordinate: readonly [number, number];
  precision: GermanyMassShootingPrecision;
  /** Reported count; may include the perpetrator when explained in the summary. */
  killed: number;
  injured: number;
  summary: string;
  source: string;
  url: string;
}

export const GERMANY_MASS_SHOOTINGS: readonly GermanyMassShooting[] = [
${records.join('\n')}
];
`;

const __dir = dirname(fileURLToPath(import.meta.url));
const destination = resolve(__dir, '..', 'src', 'data', 'germanyMassShootings.ts');
writeFileSync(destination, output);
console.log(`Wrote ${entries.length} sourced incidents to ${destination}`);
