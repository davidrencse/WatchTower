import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const GFP_BASE_URL = 'https://www.globalfirepower.com';
const GFP_LIST_URL = `${GFP_BASE_URL}/countries-listing.php`;
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const militaryImageRoot = path.resolve(scriptDir, '../public/military/global-firepower');

/**
 * Countries currently exposed by the WatchTower flag gallery. Germany is
 * intentionally omitted because its hand-curated military section is kept as-is.
 */
const rankedCountries = [
  ['AUS', 'Australia', 'australia'],
  ['AUT', 'Austria', 'austria'],
  ['BLR', 'Belarus', 'belarus'],
  ['BEL', 'Belgium', 'belgium'],
  ['BIH', 'Bosnia and Herzegovina', 'bosnia-and-herzegovina'],
  ['BGR', 'Bulgaria', 'bulgaria'],
  ['CAN', 'Canada', 'canada'],
  ['HRV', 'Croatia', 'croatia'],
  ['CZE', 'Czech Republic', 'czech-republic'],
  ['DNK', 'Denmark', 'denmark'],
  ['EST', 'Estonia', 'estonia'],
  ['FIN', 'Finland', 'finland'],
  ['FRA', 'France', 'france'],
  ['GRC', 'Greece', 'greece'],
  ['HUN', 'Hungary', 'hungary'],
  ['ISL', 'Iceland', 'iceland'],
  ['IRL', 'Ireland', 'ireland'],
  ['ITA', 'Italy', 'italy'],
  ['LVA', 'Latvia', 'latvia'],
  ['LTU', 'Lithuania', 'lithuania'],
  ['LUX', 'Luxembourg', 'luxembourg'],
  ['MDA', 'Moldova', 'moldova'],
  ['MNE', 'Montenegro', 'montenegro'],
  ['NLD', 'Netherlands', 'netherlands'],
  ['NZL', 'New Zealand', 'new-zealand'],
  ['NOR', 'Norway', 'norway'],
  ['POL', 'Poland', 'poland'],
  ['PRT', 'Portugal', 'portugal'],
  ['ROU', 'Romania', 'romania'],
  ['RUS', 'Russia', 'russia'],
  ['SRB', 'Serbia', 'serbia'],
  ['SVK', 'Slovakia', 'slovakia'],
  ['SVN', 'Slovenia', 'slovenia'],
  ['ZAF', 'South Africa', 'south-africa'],
  ['ESP', 'Spain', 'spain'],
  ['SWE', 'Sweden', 'sweden'],
  ['CHE', 'Switzerland', 'switzerland'],
  ['UKR', 'Ukraine', 'ukraine'],
  ['GBR', 'United Kingdom', 'united-kingdom'],
  ['USA', 'United States of America', 'united-states-of-america'],
];

const unrankedCountries = [
  ['CYP', 'Cyprus', 'cyprus'],
  ['LIE', 'Liechtenstein', 'liechtenstein'],
  ['MLT', 'Malta', 'malta'],
  ['MCO', 'Monaco', 'monaco'],
];

const airMetrics = [
  ['fighters', 'Fighters', 'Fighters'],
  ['attack', 'Attack Aircraft', 'Attack Types'],
  ['transports', 'Transport Aircraft', 'Transports (Fixed-Wing)'],
  ['trainers', 'Trainers', 'Trainers'],
  ['special', 'Special-Mission Aircraft', 'Special-Mission'],
  ['tankers', 'Tanker Fleet', 'Tanker Fleet'],
  ['helicopters', 'Helicopters', 'Helicopters'],
  ['attackHelicopters', 'Attack Helicopters', 'Attack Helicopters'],
];

const landMetrics = [
  ['tanks', 'Tanks', 'Tanks'],
  ['vehicles', 'Armored Vehicles', 'Vehicles'],
  ['selfPropelledArtillery', 'Self-Propelled Artillery', 'Self-Propelled Artillery'],
  ['towedArtillery', 'Towed Artillery', 'Towed Artillery'],
  ['mlrs', 'Rocket Artillery (MLRS)', 'MLRS (Rocket Artillery)'],
];

const navyMetrics = [
  ['aircraftCarriers', 'Aircraft Carriers', 'Aircraft Carriers'],
  ['helicopterCarriers', 'Helicopter Carriers', 'Helicopter Carriers'],
  ['destroyers', 'Destroyers', 'Destroyers'],
  ['frigates', 'Frigates', 'Frigates'],
  ['corvettes', 'Corvettes', 'Corvettes'],
  ['submarines', 'Submarines', 'Submarines'],
  ['patrolVessels', 'Patrol Vessels', 'Patrol Vessels'],
  ['mineWarfare', 'Mine Warfare', 'Mine Warfare'],
];

function decodeEntities(value) {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&ndash;|&#8211;/gi, '–')
    .replace(/&mdash;|&#8212;/gi, '—')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
}

function plainText(html) {
  return decodeEntities(
    html
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' '),
  ).trim();
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function metricText(html, label) {
  const exactWithColon = new RegExp(`>${escapeRegex(label)}:<\\/span>`, 'i').exec(html);
  const match = exactWithColon ?? new RegExp(`>${escapeRegex(label)}<\\/span>`, 'i').exec(html);
  if (!match) throw new Error(`Could not locate metric “${label}”`);
  return plainText(html.slice(match.index, match.index + 700));
}

function hasDetailedMetric(html, label) {
  return new RegExp(`>${escapeRegex(label)}:<\\/span>`, 'i').test(html);
}

function parseInteger(value) {
  return Number(value.replace(/,/g, ''));
}

function readNumberMetric(html, label) {
  const text = metricText(html, label);
  const match = new RegExp(`${escapeRegex(label)}:?\\s*([0-9,]+)`, 'i').exec(text);
  if (!match) throw new Error(`Could not parse numeric metric “${label}” from: ${text}`);
  return parseInteger(match[1]);
}

function readStockMetric(html, [key, label, sourceLabel]) {
  const text = metricText(html, sourceLabel);
  const stock = /Stock:\s*([0-9,]+)/i.exec(text);
  const readiness = /Readiness:\s*([0-9,]+)/i.exec(text);
  if (!stock) throw new Error(`Could not parse stock for “${sourceLabel}” from: ${text}`);
  return {
    key,
    label,
    total: parseInteger(stock[1]),
    ready: readiness ? parseInteger(readiness[1]) : undefined,
  };
}

function readStockTotal(html, label) {
  const text = metricText(html, label);
  const stock = /Stock:\s*([0-9,]+)/i.exec(text);
  if (!stock) throw new Error(`Could not parse stock for “${label}” from: ${text}`);
  return parseInteger(stock[1]);
}

function readCountMetric(html, [key, label, sourceLabel]) {
  return { key, label, total: hasDetailedMetric(html, sourceLabel) ? readNumberMetric(html, sourceLabel) : 0 };
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      Accept: 'text/html,application/xhtml+xml',
      'User-Agent': 'WatchTower military-data updater (source attribution included)',
    },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.text();
}

function firstCountryImagePath(html, kind) {
  const match = new RegExp(`<img[^>]+src=["']([^"']*/imgs/${kind}/med/[^"']+)["'][^>]*>`, 'i').exec(html);
  if (!match) throw new Error(`Could not locate ${kind} image on Global Firepower profile`);
  return match[1];
}

async function downloadImage(remotePath, outputPath, optional = false) {
  const url = new URL(remotePath, GFP_BASE_URL).href;
  const response = await fetch(url, {
    headers: {
      Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      'User-Agent': 'WatchTower military-data updater (source attribution included)',
    },
  });
  if (!response.ok) {
    if (optional) return false;
    throw new Error(`${response.status} ${response.statusText}: ${url}`);
  }
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().startsWith('image/')) {
    if (optional) return false;
    throw new Error(`Expected an image but received ${contentType || 'an unknown content type'}: ${url}`);
  }
  await writeFile(outputPath, Buffer.from(await response.arrayBuffer()));
  return true;
}

async function saveProfileImages(iso3, html) {
  const folderName = iso3.toLowerCase();
  const outputDir = path.join(militaryImageRoot, folderName);
  await mkdir(outputDir, { recursive: true });
  const flagPath = firstCountryImagePath(html, 'flags');
  const mapPath = firstCountryImagePath(html, 'maps');
  await Promise.all([
    downloadImage(flagPath, path.join(outputDir, 'flag.jpg')),
    downloadImage(mapPath, path.join(outputDir, 'map.jpg')),
  ]);
  return {
    flag: `/military/global-firepower/${folderName}/flag.jpg`,
    map: `/military/global-firepower/${folderName}/map.jpg`,
  };
}

async function saveOptionalImages(iso3, slug) {
  const folderName = iso3.toLowerCase();
  const outputDir = path.join(militaryImageRoot, folderName);
  await mkdir(outputDir, { recursive: true });
  const [hasFlag, hasMap] = await Promise.all([
    downloadImage(`/imgs/flags/med/${slug}.jpg`, path.join(outputDir, 'flag.jpg'), true),
    downloadImage(`/imgs/maps/med/${slug}.jpg`, path.join(outputDir, 'map.jpg'), true),
  ]);
  return hasFlag || hasMap
    ? {
        ...(hasFlag ? { flag: `/military/global-firepower/${folderName}/flag.jpg` } : {}),
        ...(hasMap ? { map: `/military/global-firepower/${folderName}/map.jpg` } : {}),
      }
    : undefined;
}

async function readCountry([iso3, name, slug]) {
  const sourceUrl = `${GFP_BASE_URL}/country-military-strength-detail.php?country_id=${slug}`;
  const html = await fetchHtml(sourceUrl);
  const summary = plainText(html.slice(0, Math.min(html.length, 70_000)));
  const rankMatch = /ranked\s+(\d+)\s+of\s+(\d+).*?PwrIndx\*?\s+score\s+of\s+([0-9.]+)/i.exec(summary);
  if (!rankMatch) throw new Error(`Could not parse rank and PowerIndex for ${name}`);

  const budgetText = metricText(html, 'Defense Budget');
  const budgetMatch = /Defense Budget:?\s*\$([0-9,]+)\s*USD/i.exec(budgetText);
  if (!budgetMatch) throw new Error(`Could not parse defense budget for ${name}`);

  const reviewedMatch = /This entry last reviewed on\s+([0-9/]+)/i.exec(summary);
  const images = await saveProfileImages(iso3, html);
  return {
    iso3,
    name,
    status: 'ranked',
    rank: Number(rankMatch[1]),
    rankTotal: Number(rankMatch[2]),
    powerIndex: Number(rankMatch[3]),
    activePersonnel: readNumberMetric(html, 'Active Personnel'),
    reservePersonnel: readNumberMetric(html, 'Reserve Personnel'),
    defenseBudgetUsd: parseInteger(budgetMatch[1]),
    reviewed: reviewedMatch?.[1] ?? null,
    images,
    airForce: {
      total: readStockTotal(html, 'Aircraft Total'),
      items: airMetrics.map((metric) => readStockMetric(html, metric)),
    },
    army: {
      items: landMetrics.map((metric) => readStockMetric(html, metric)),
    },
    navy: {
      total: hasDetailedMetric(html, 'Total Assets') ? readNumberMetric(html, 'Total Assets') : 0,
      items: navyMetrics.map((metric) => readCountMetric(html, metric)),
    },
    sourceUrl,
  };
}

function renderModule(records) {
  const json = JSON.stringify(Object.fromEntries(records.map((record) => [record.iso3, record])), null, 2);
  return `/**
 * Global Firepower 2026 country profiles used by the generic military section.
 * Generated by scripts/generate-military-data.mjs; do not hand-edit.
 */

export type MilitaryInventoryItem = {
  key: string;
  label: string;
  total: number;
  ready?: number;
};

export type MilitaryCountryImages = {
  flag: string;
  map: string;
};

export type RankedMilitaryCountryData = {
  iso3: string;
  name: string;
  status: 'ranked';
  rank: number;
  rankTotal: number;
  powerIndex: number;
  activePersonnel: number;
  reservePersonnel: number;
  defenseBudgetUsd: number;
  reviewed: string | null;
  images: MilitaryCountryImages;
  airForce: { total: number; items: MilitaryInventoryItem[] };
  army: { items: MilitaryInventoryItem[] };
  navy: { total: number; items: MilitaryInventoryItem[] };
  sourceUrl: string;
};

export type UnrankedMilitaryCountryData = {
  iso3: string;
  name: string;
  status: 'unranked';
  images?: Partial<MilitaryCountryImages>;
  sourceUrl: string;
};

export type MilitaryCountryData = RankedMilitaryCountryData | UnrankedMilitaryCountryData;

export const COUNTRY_MILITARY_DATA: Record<string, MilitaryCountryData> = ${json};
`;
}

async function main() {
  const records = [];
  for (const country of rankedCountries) {
    process.stdout.write(`Fetching ${country[1]}… `);
    records.push(await readCountry(country));
    process.stdout.write('ok\n');
  }
  for (const [iso3, name, slug] of unrankedCountries) {
    process.stdout.write(`Fetching ${name} imagery… `);
    const images = await saveOptionalImages(iso3, slug);
    records.push({ iso3, name, status: 'unranked', images, sourceUrl: GFP_LIST_URL });
    process.stdout.write(images ? 'ok\n' : 'not available\n');
  }
  records.sort((a, b) => a.name.localeCompare(b.name));

  const outputPath = path.resolve(scriptDir, '../src/data/countryMilitaryData.ts');
  await writeFile(outputPath, renderModule(records), 'utf8');
  process.stdout.write(`Wrote ${records.length} country records to ${outputPath}\n`);
}

await main();
