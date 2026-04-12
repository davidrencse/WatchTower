import { parseCsvRows } from './csv';

export type GermanyNewsTopic = 'economy' | 'immigration' | 'crime' | 'health';

export const GERMANY_NEWS_TOPIC_LABEL: Record<GermanyNewsTopic, string> = {
  economy: 'Economy',
  immigration: 'Immigration',
  crime: 'Crime',
  health: 'Health',
};

export type GermanyNewsItem = {
  title: string;
  url: string;
  hostname: string;
  topic: GermanyNewsTopic;
  /** Optional direct image URL from CSV (no runtime fetch). */
  imageUrl?: string;
};

function normalizeTopicCell(raw: string): GermanyNewsTopic | null {
  const x = raw.trim().toLowerCase();
  if (x === 'economy') return 'economy';
  if (x === 'immigration') return 'immigration';
  if (x === 'crime') return 'crime';
  if (x === 'health') return 'health';
  return null;
}

/** When CSV has no Topic cell, bucket from title + URL keywords (order matters). */
export function inferGermanyNewsTopic(title: string, url: string): GermanyNewsTopic | null {
  const t = `${title} ${url}`.toLowerCase();
  if (
    /immigration|refugee|asylum|migrant|citizenship|naturalis|naturalization|border control|deport|syria|returning home|workforce.*asylum/.test(
      t,
    )
  ) {
    return 'immigration';
  }
  if (
    /health insurance|healthcare|pharma|hospital|dentist|lung cancer|screening|bayer|fresenius|digital health|public health|smokers.*germany/.test(
      t,
    )
  ) {
    return 'health';
  }
  if (
    /crime|police|court|trial|arrest|spying|spy|bomb|deepfake|organised crime|organized crime|vandalism|violence|money laundering|murder|attack threat|fan violence|prosecutor|indict|raid/.test(
      t,
    )
  ) {
    return 'crime';
  }
  if (
    /business|economy|market|inflation|export|industrial|pmi|gdp|trade|oil price|debt brake|forecast|euro|refinery|orders|service sector|iran war.*price|price shock/.test(
      t,
    )
  ) {
    return 'economy';
  }
  return null;
}

/** Infer category line under title (legacy / path-based). */
export function categoryFromNewsUrl(url: string, title: string): string {
  const u = url.toLowerCase();
  const t = title.toLowerCase();
  try {
    const path = new URL(url).pathname.toLowerCase();
    if (path.includes('/business')) return 'Business';
    if (path.includes('/world/china') && (t.includes('export') || t.includes('trade') || t.includes('industrial')))
      return 'Business';
    if (path.includes('/world/europe') || path.includes('/world/')) return 'Politics';
    if (u.includes('dw.com') || u.includes('amp.dw.com')) return 'Politics';
    if (u.includes('apnews.com') && (t.includes('whale') || t.includes('baltic') || t.includes('environment')))
      return 'Environment';
    if (u.includes('apnews.com')) return 'News';
  } catch {
    /* ignore */
  }
  return 'News';
}

export function faviconUrlForHostname(hostname: string): string {
  const h = hostname.replace(/^www\./i, '');
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(h)}&sz=128`;
}

export function wordpressMshotsImageUrl(articleUrl: string): string {
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(articleUrl)}`;
}

export type GermanyNewsBuckets = {
  economy: GermanyNewsItem[];
  immigration: GermanyNewsItem[];
  crime: GermanyNewsItem[];
  health: GermanyNewsItem[];
};

export function bucketGermanyNewsItems(items: GermanyNewsItem[]): GermanyNewsBuckets {
  const empty: GermanyNewsBuckets = { economy: [], immigration: [], crime: [], health: [] };
  for (const item of items) {
    empty[item.topic].push(item);
  }
  return empty;
}

export function parseGermanyNewsCsv(raw: string): GermanyNewsItem[] {
  const rows = parseCsvRows(raw.replace(/^\uFEFF/, '').trim());
  if (rows.length < 2) return [];
  const headers = rows[0]!.map((h) => h.trim().toLowerCase());
  const ti = headers.indexOf('title');
  const ui = headers.indexOf('url');
  if (ti < 0 || ui < 0) return [];
  const topicIdx = headers.indexOf('topic');
  const ii = headers.indexOf('image');

  const out: GermanyNewsItem[] = [];
  const seen = new Set<string>();
  for (let r = 1; r < rows.length; r++) {
    const cells = rows[r]!;
    const title = (cells[ti] ?? '').trim();
    const url = (cells[ui] ?? '').trim();
    if (!title || !url) continue;
    if (seen.has(url)) continue;
    seen.add(url);
    let hostname = '';
    try {
      hostname = new URL(url).hostname;
    } catch {
      continue;
    }
    const imageRaw = ii >= 0 ? (cells[ii] ?? '').trim() : '';
    let topic: GermanyNewsTopic | null =
      topicIdx >= 0 ? normalizeTopicCell(cells[topicIdx] ?? '') : null;
    if (!topic) topic = inferGermanyNewsTopic(title, url);
    if (!topic) continue;

    out.push({
      title,
      url,
      hostname,
      topic,
      imageUrl: imageRaw.length > 0 ? imageRaw : undefined,
    });
  }
  return out;
}
