import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {
  VERIFIED_EQUIPMENT_IMAGE_FILES,
  VERIFIED_EQUIPMENT_PAGES,
} from './military-equipment-overrides.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');
const militaryDataPath = path.join(projectRoot, 'src/data/military/globalFirepower.ts');
const catalogPath = path.join(projectRoot, 'Assets/Data/shared/country_military_equipment_visuals.json');
const outputPath = path.join(projectRoot, 'src/data/military/equipmentVisuals.ts');
const imageRoot = path.join(projectRoot, 'public/military/equipment');
const WIKIPEDIA_API = 'https://en.wikipedia.org/w/api.php';
const COMMONS_API = 'https://commons.wikimedia.org/w/api.php';
const USER_AGENT = 'WatchTowerMilitaryEquipment/1.0 (local educational country dashboard)';
const pageCache = new Map();
const downloadCache = new Map();

const CATEGORY_META = {
  tanks: { service: 'Army', query: 'main battle tank' },
  vehicles: { service: 'Army', query: 'armoured fighting vehicle' },
  selfPropelledArtillery: { service: 'Army', query: 'self-propelled howitzer' },
  towedArtillery: { service: 'Army', query: 'towed howitzer' },
  mlrs: { service: 'Army', query: 'multiple launch rocket system' },
  fighters: { service: 'Air Force', query: 'fighter aircraft' },
  attack: { service: 'Air Force', query: 'attack aircraft' },
  transports: { service: 'Air Force', query: 'military transport aircraft' },
  trainers: { service: 'Air Force', query: 'trainer aircraft' },
  special: { service: 'Air Force', query: 'special mission aircraft' },
  tankers: { service: 'Air Force', query: 'aerial refueling aircraft' },
  helicopters: { service: 'Armed Forces', query: 'military utility helicopter' },
  attackHelicopters: { service: 'Army', query: 'attack helicopter' },
  aircraftCarriers: { service: 'Navy', query: 'aircraft carrier' },
  helicopterCarriers: { service: 'Navy', query: 'helicopter carrier amphibious assault ship' },
  destroyers: { service: 'Navy', query: 'destroyer class' },
  frigates: { service: 'Navy', query: 'frigate class' },
  corvettes: { service: 'Navy', query: 'corvette class' },
  submarines: { service: 'Navy', query: 'submarine class' },
  patrolVessels: { service: 'Navy', query: 'offshore patrol vessel class' },
  mineWarfare: { service: 'Navy', query: 'minehunter minesweeper class' },
};

const BAD_TITLE = /(?:^list of|armed forces|\barmy\b|\bnavy\b|air force|air arm|military of|\bregiment\b|\bbrigade\b|\bbattalion\b|\bsquadron\b|\bwing\b|\bcorps\b|\bcommand\b|\bservice\b|\bhistory\b|\bproject\b|\bprogramme\b|\bprogram\b|\bequipment\b|\binventory\b|procurement|defence force|defense force)/i;
const GENERIC_TITLE = /^(?:tank|artillery|howitzer|fighter aircraft|attack aircraft|military aircraft|transport aircraft|trainer aircraft|helicopter|attack helicopter|aircraft carrier|destroyer|frigate|corvette|submarine|patrol boat|patrol vessel|minehunter|minesweeper|armoured fighting vehicle|armored fighting vehicle)$/i;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseMilitaryData(source) {
  const marker = 'export const COUNTRY_MILITARY_DATA: Record<string, MilitaryCountryData> = ';
  const start = source.indexOf(marker);
  if (start === -1) throw new Error('Could not find COUNTRY_MILITARY_DATA in generated module');
  return JSON.parse(source.slice(start + marker.length).trim().replace(/;\s*$/, ''));
}

function activeItems(country) {
  return [...country.army.items, ...country.navy.items, ...country.airForce.items].filter((item) => item.total > 0);
}

async function fetchJson(url, attempt = 0) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  let response;
  try {
    response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
      signal: controller.signal,
    });
  } catch (error) {
    if (attempt < 4) {
      await sleep(1000 * 2 ** attempt);
      return fetchJson(url, attempt + 1);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
  if ((response.status === 429 || response.status === 503) && attempt < 2) {
    const retryAfter = Number(response.headers.get('retry-after')) || 2 ** attempt;
    await sleep(Math.min(30_000, retryAfter * 1000));
    return fetchJson(url, attempt + 1);
  }
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.json();
}

function candidateScore(page, countryName) {
  if (!page.thumbnail?.source || !page.title) return Number.NEGATIVE_INFINITY;
  let score = 1000 - (page.index ?? 100) * 10;
  if (BAD_TITLE.test(page.title)) score -= 1000;
  if (GENERIC_TITLE.test(page.title)) score -= 1000;
  if (/class|type|model|mark|mk\.?|m\d|f-?\d|c-?\d|su-?\d|mig-?\d|uh-?\d|ch-?\d|ah-?\d/i.test(page.title)) score += 80;
  if (/\d/.test(page.title)) score += 30;
  if (page.extract?.toLowerCase().includes(countryName.toLowerCase())) score += 35;
  return score;
}

function commonsFileUrl(filename) {
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(filename.replace(/ /g, '_'))}`;
}

async function commonsImageForTitle(title) {
  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: title,
    gsrnamespace: '6',
    gsrlimit: '8',
    prop: 'imageinfo|info',
    iiprop: 'url|mime',
    iiurlwidth: '720',
    inprop: 'url',
    format: 'json',
    formatversion: '2',
    origin: '*',
  });
  const data = await fetchJson(`${COMMONS_API}?${params}`);
  const page = (data.query?.pages ?? []).find((candidate) => {
    const info = candidate.imageinfo?.[0];
    return info?.thumburl && info.mime?.startsWith('image/') && info.mime !== 'image/svg+xml';
  });
  const info = page?.imageinfo?.[0];
  return info?.thumburl
    ? {
        imageRemoteUrl: info.thumburl,
        imageSourceUrl: page.fullurl ?? commonsFileUrl(page.title.replace(/^File:/, '')),
      }
    : undefined;
}

async function commonsImageByFilename(filename) {
  const params = new URLSearchParams({
    action: 'query',
    titles: `File:${filename}`,
    prop: 'imageinfo|info',
    iiprop: 'url|mime',
    iiurlwidth: '640',
    inprop: 'url',
    format: 'json',
    formatversion: '2',
    origin: '*',
  });
  const data = await fetchJson(`${COMMONS_API}?${params}`);
  const page = data.query?.pages?.[0];
  const info = page?.imageinfo?.[0];
  return info?.thumburl
    ? {
        imageRemoteUrl: info.thumburl,
        imageSourceUrl: page.fullurl ?? commonsFileUrl(filename),
      }
    : undefined;
}

async function wikipediaCandidates(query) {
  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: query,
    gsrnamespace: '0',
    gsrlimit: '10',
    prop: 'pageimages|info|extracts',
    piprop: 'thumbnail|name',
    pithumbsize: '720',
    inprop: 'url',
    exintro: '1',
    explaintext: '1',
    exchars: '900',
    format: 'json',
    formatversion: '2',
    origin: '*',
  });
  const data = await fetchJson(`${WIKIPEDIA_API}?${params}`);
  return data.query?.pages ?? [];
}

async function wikipediaPage(title) {
  if (!pageCache.has(title)) {
    const request = (async () => {
        const params = new URLSearchParams({
          action: 'query',
          titles: title,
          prop: 'pageimages|info|extracts',
          piprop: 'thumbnail|name',
          pithumbsize: '720',
          inprop: 'url',
          exintro: '1',
          explaintext: '1',
          exchars: '900',
          redirects: '1',
          format: 'json',
          formatversion: '2',
          origin: '*',
        });
        const data = await fetchJson(`${WIKIPEDIA_API}?${params}`);
        return data.query?.pages?.[0];
      })().catch((error) => {
        pageCache.delete(title);
        throw error;
      });
    pageCache.set(title, request);
  }
  return pageCache.get(title);
}

async function prefetchWikipediaPages(titles) {
  const uniqueTitles = [...new Set(titles)];
  for (let start = 0; start < uniqueTitles.length; start += 40) {
    const batch = uniqueTitles.slice(start, start + 40);
    const params = new URLSearchParams({
      action: 'query',
      titles: batch.join('|'),
      prop: 'pageimages|info|extracts',
      piprop: 'thumbnail|name',
      pithumbsize: '720',
      inprop: 'url',
      exintro: '1',
      explaintext: '1',
      exchars: '900',
      redirects: '1',
      format: 'json',
      formatversion: '2',
      origin: '*',
    });
    const data = await fetchJson(`${WIKIPEDIA_API}?${params}`);
    const aliases = new Map(batch.map((title) => [title, title]));
    for (const normalized of data.query?.normalized ?? []) aliases.set(normalized.from, normalized.to);
    for (const redirect of data.query?.redirects ?? []) aliases.set(redirect.from, redirect.to);
    const pagesByTitle = new Map((data.query?.pages ?? []).map((page) => [page.title, page]));
    for (const requestedTitle of batch) {
      let resolvedTitle = aliases.get(requestedTitle) ?? requestedTitle;
      for (let i = 0; i < 4 && aliases.has(resolvedTitle); i += 1) resolvedTitle = aliases.get(resolvedTitle);
      const page = pagesByTitle.get(resolvedTitle) ?? pagesByTitle.get(requestedTitle);
      if (page) pageCache.set(requestedTitle, Promise.resolve(page));
    }
  }
}

async function resolveWikipediaPage(country, item) {
  const meta = CATEGORY_META[item.key];
  if (!meta) throw new Error(`No equipment query metadata for ${item.key}`);
  const overrideTitle = VERIFIED_EQUIPMENT_PAGES[country.iso3]?.[item.key];
  if (overrideTitle) {
    const selected = await wikipediaPage(overrideTitle);
    const verifiedFilename = VERIFIED_EQUIPMENT_IMAGE_FILES[country.iso3]?.[item.key];
    const fallbackImage = selected?.thumbnail?.source
      ? undefined
      : verifiedFilename
        ? await commonsImageByFilename(verifiedFilename)
        : await commonsImageForTitle(overrideTitle);
    const imageRemoteUrl = selected?.thumbnail?.source ?? fallbackImage?.imageRemoteUrl;
    const imageSourceUrl = selected?.pageimage
      ? commonsFileUrl(selected.pageimage)
      : fallbackImage?.imageSourceUrl;
    if (!imageRemoteUrl || !imageSourceUrl) throw new Error(`No image found for verified page ${overrideTitle}`);
    return {
      platform: selected?.missing ? overrideTitle : selected.title,
      pageId: selected?.pageid ?? `commons-${Buffer.from(overrideTitle).toString('hex').slice(0, 24)}`,
      pageUrl:
        selected?.fullurl ??
        `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(overrideTitle)}`,
      imageRemoteUrl,
      imageSourceUrl,
      query: `verified:${overrideTitle}`,
    };
  }
  const searchQuery = overrideTitle
    ? `intitle:"${overrideTitle}"`
    : `"${country.name} ${meta.service}" "${meta.query}" -intitle:List`;
  const pages = await wikipediaCandidates(searchQuery);
  const sorted = pages
    .map((page) => ({ page, score: overrideTitle ? 10_000 - (page.index ?? 100) : candidateScore(page, country.name) }))
    .sort((a, b) => b.score - a.score);
  const selected = sorted.find(({ score }) => score > 0)?.page;
  if (!selected) throw new Error(`No usable equipment page for ${country.name} ${item.key} (${searchQuery})`);
  return {
    platform: selected.title,
    pageId: selected.pageid,
    pageUrl: selected.fullurl,
    imageRemoteUrl: selected.thumbnail.source,
    imageSourceUrl: selected.pageimage ? commonsFileUrl(selected.pageimage) : selected.fullurl,
    query: searchQuery,
  };
}

function imageExtension(url) {
  const match = decodeURIComponent(new URL(url).pathname).match(/\.(jpe?g|png|webp|gif)(?:\/|$)/i);
  return (match?.[1] ?? 'jpg').toLowerCase().replace('jpeg', 'jpg');
}

function wikimediaThumbnailUrl(url, width = 960) {
  const parsed = new URL(url);
  const prefix = '/wikipedia/commons/';
  if (parsed.hostname !== 'upload.wikimedia.org' || !parsed.pathname.startsWith(prefix)) return url;
  if (parsed.pathname.startsWith(`${prefix}thumb/`)) return url;
  const relativePath = parsed.pathname.slice(prefix.length);
  const filename = path.posix.basename(relativePath);
  parsed.pathname = `${prefix}thumb/${relativePath}/${width}px-${filename}`;
  return parsed.toString();
}

async function downloadImage(url, outputPath, attempt = 0) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);
  let response;
  try {
    response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'image/*' },
      signal: controller.signal,
    });
  } catch (error) {
    if (attempt < 4) {
      await sleep(1000 * 2 ** attempt);
      return downloadImage(url, outputPath, attempt + 1);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
  if ((response.status === 429 || response.status === 503) && attempt < 6) {
    await sleep(Math.min(30_000, 1000 * 2 ** attempt));
    return downloadImage(url, outputPath, attempt + 1);
  }
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  await writeFile(outputPath, Buffer.from(await response.arrayBuffer()));
}

async function downloadImageOnce(url, outputPath) {
  if (!downloadCache.has(outputPath)) {
    const request = (async () => {
        try {
          await access(outputPath);
          return;
        } catch {
          // The shared model image has not been downloaded yet.
        }
        await mkdir(path.dirname(outputPath), { recursive: true });
        await downloadImage(url, outputPath);
      })().catch((error) => {
        downloadCache.delete(outputPath);
        throw error;
      });
    downloadCache.set(outputPath, request);
  }
  return downloadCache.get(outputPath);
}

async function readCatalog() {
  let catalog;
  try {
    catalog = JSON.parse(await readFile(catalogPath, 'utf8'));
  } catch (error) {
    if (error?.code === 'ENOENT') catalog = {};
    else throw error;
  }

  try {
    const moduleSource = await readFile(outputPath, 'utf8');
    const marker =
      'export const COUNTRY_MILITARY_EQUIPMENT: Record<string, Record<string, CountryEquipmentVisual>> = ';
    const markerIndex = moduleSource.indexOf(marker);
    if (markerIndex !== -1) {
      const moduleCatalog = JSON.parse(
        moduleSource.slice(markerIndex + marker.length).trim().replace(/;\s*$/, ''),
      );
      for (const [iso3, entries] of Object.entries(moduleCatalog)) {
        catalog[iso3] ??= {};
        for (const [key, entry] of Object.entries(entries)) catalog[iso3][key] ??= entry;
      }
    }
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }

  return catalog;
}

async function saveCatalog(catalog) {
  await mkdir(path.dirname(catalogPath), { recursive: true });
  await writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
}

function renderModule(catalog) {
  const publicCatalog = {};
  for (const [iso3, equipment] of Object.entries(catalog)) {
    publicCatalog[iso3] = {};
    for (const [key, entry] of Object.entries(equipment)) {
      const { imageRemoteUrl: _imageRemoteUrl, query: _query, pageId: _pageId, ...publicEntry } = entry;
      publicCatalog[iso3][key] = publicEntry;
    }
  }
  return `/** Generated by scripts/generate-military-equipment.mjs. */
export type CountryEquipmentVisual = {
  platform: string;
  image: string;
  pageUrl: string;
  imageSourceUrl: string;
};

export const COUNTRY_MILITARY_EQUIPMENT: Record<string, Record<string, CountryEquipmentVisual>> = ${JSON.stringify(publicCatalog, null, 2)};
`;
}

function selectedIso3() {
  const arg = process.argv.find((value) => value.startsWith('--iso='));
  return arg ? new Set(arg.slice('--iso='.length).toUpperCase().split(',').filter(Boolean)) : null;
}

async function localizeRemoteImages(catalog) {
  const pendingByOutputPath = new Map();

  for (const equipment of Object.values(catalog)) {
    for (const entry of Object.values(equipment)) {
      if (!entry.imageRemoteUrl || !/^https?:\/\//i.test(entry.image)) continue;
      const extension = imageExtension(entry.imageRemoteUrl);
      const relativeImage = `/military/equipment/models/${entry.pageId}.${extension}`;
      const absoluteImage = path.join(projectRoot, 'public', relativeImage.replace(/^\//, ''));
      const pending = pendingByOutputPath.get(absoluteImage) ?? {
        url: wikimediaThumbnailUrl(entry.imageRemoteUrl),
        absoluteImage,
        entries: [],
        relativeImage,
      };
      pending.entries.push(entry);
      pendingByOutputPath.set(absoluteImage, pending);
    }
  }

  const tasks = [...pendingByOutputPath.values()];
  if (tasks.length === 0) {
    process.stdout.write('All equipment photos are already stored locally.\n');
    return;
  }

  process.stdout.write(`Localizing ${tasks.length} remaining equipment photos…\n`);
  for (const task of tasks) {
    try {
      await downloadImageOnce(task.url, task.absoluteImage);
      for (const entry of task.entries) entry.image = task.relativeImage;
      process.stdout.write(`Stored ${path.basename(task.absoluteImage)}\n`);
    } catch (error) {
      process.stdout.write(`Could not localize ${task.url}: ${error.message}\n`);
    }
    await sleep(500);
  }
}

async function main() {
  const militaryData = parseMilitaryData(await readFile(militaryDataPath, 'utf8'));
  const catalog = await readCatalog();
  const isoFilter = selectedIso3();
  const refresh = process.argv.includes('--refresh');
  const localizeRemote = process.argv.includes('--localize-remote');
  let completed = 0;
  let saveChain = Promise.resolve();
  const tasks = [];

  for (const country of Object.values(militaryData)) {
    if (country.status !== 'ranked' || (isoFilter && !isoFilter.has(country.iso3))) continue;
    catalog[country.iso3] ??= {};
    for (const item of activeItems(country)) {
      if (!refresh && catalog[country.iso3][item.key]) continue;
      tasks.push({ country, item });
    }
  }

  const titlesToPrefetch = tasks
    .map(({ country, item }) => VERIFIED_EQUIPMENT_PAGES[country.iso3]?.[item.key])
    .filter(Boolean);
  if (titlesToPrefetch.length > 0) {
    process.stdout.write(`Prefetching ${new Set(titlesToPrefetch).size} model pages in batches…\n`);
    await prefetchWikipediaPages(titlesToPrefetch);
  }

  async function worker() {
    while (tasks.length > 0) {
      const task = tasks.shift();
      if (!task) return;
      const { country, item } = task;
      process.stdout.write(`Resolving ${country.name} · ${item.label}… `);
      try {
        const resolved = await resolveWikipediaPage(country, item);
        const extension = imageExtension(resolved.imageRemoteUrl);
        const relativeImage = `/military/equipment/models/${resolved.pageId}.${extension}`;
        const absoluteImage = path.join(projectRoot, 'public', relativeImage.replace(/^\//, ''));
        let image = relativeImage;
        try {
          await downloadImageOnce(resolved.imageRemoteUrl, absoluteImage);
        } catch {
          image = resolved.imageRemoteUrl;
        }
        catalog[country.iso3][item.key] = { ...resolved, image };
        process.stdout.write(`${resolved.platform}${image === relativeImage ? '' : ' (remote image fallback)'}\n`);
      } catch (error) {
        if (refresh) delete catalog[country.iso3][item.key];
        process.stdout.write(`FAILED: ${error.message}\n`);
      }
      completed += 1;
      if (completed % 20 === 0) {
        saveChain = saveChain.then(() => saveCatalog(catalog));
        await saveChain;
      }
      await sleep(100);
    }
  }

  await Promise.all(Array.from({ length: 3 }, () => worker()));
  await saveChain;

  if (localizeRemote) await localizeRemoteImages(catalog);

  await saveCatalog(catalog);
  await writeFile(outputPath, renderModule(catalog), 'utf8');
  process.stdout.write(`Wrote equipment visuals for ${Object.keys(catalog).length} countries.\n`);
}

await main();
