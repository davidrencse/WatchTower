const LIVEUAMAP_ENDPOINT = 'https://a.liveuamap.com/api';
const UKRAINE_REGION_ID = 0;
const MAX_EVENTS = 24;

function cleanText(value) {
  return String(value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#(?:39|x27);/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function sourceUrl(value) {
  try {
    const url = new URL(String(value ?? ''), 'https://liveuamap.com/');
    if (url.protocol === 'https:' || url.protocol === 'http:') return url.toString();
  } catch {
    // Invalid upstream links are dropped below.
  }
  return 'https://liveuamap.com/';
}

function publishedAt(value) {
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds > 0) {
    return new Date(seconds * 1000).toISOString();
  }
  const parsed = new Date(String(value ?? ''));
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

function normalizeEvent(event, index) {
  const latitude = Number(event?.lat);
  const longitude = Number(event?.lng);
  const title = cleanText(event?.name);
  if (
    !title ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null;
  }

  return {
    id: String(event?.id ?? `${event?.timestamp ?? 'event'}-${index}`),
    title,
    publishedAt: publishedAt(event?.timestamp ?? event?.time),
    source: 'LiveUAmap',
    sourceUrl: sourceUrl(event?.link),
    locationLabel: cleanText(event?.location ?? event?.city) || 'Ukraine conflict zone',
    latitude,
    longitude,
  };
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  response.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=3600');

  const apiKey = process.env.LIVEUAMAP_API_KEY;
  if (!apiKey) {
    return response.status(200).json({
      events: [],
      configured: false,
      updatedAt: new Date().toISOString(),
      warnings: ['LIVEUAMAP_API_KEY is not configured. Curated coverage remains available.'],
    });
  }

  const upstream = new URL(LIVEUAMAP_ENDPOINT);
  upstream.searchParams.set('a', 'mpts');
  upstream.searchParams.set('resid', String(UKRAINE_REGION_ID));
  upstream.searchParams.set('time', String(Math.floor(Date.now() / 1000)));
  upstream.searchParams.set('count', String(MAX_EVENTS));
  upstream.searchParams.set('key', apiKey);

  try {
    const upstreamResponse = await fetch(upstream, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    });

    if (!upstreamResponse.ok) {
      throw new Error(`LiveUAmap returned ${upstreamResponse.status}`);
    }

    const payload = await upstreamResponse.json();
    if (payload?.success === false) {
      throw new Error(cleanText(payload?.message) || 'LiveUAmap rejected the request');
    }

    const upstreamEvents = Array.isArray(payload?.venues)
      ? payload.venues
      : Array.isArray(payload?.events)
        ? payload.events
        : [];
    const events = upstreamEvents
      .map(normalizeEvent)
      .filter(Boolean)
      .slice(0, MAX_EVENTS);

    return response.status(200).json({
      events,
      configured: true,
      updatedAt: new Date().toISOString(),
      warnings: events.length ? undefined : ['LiveUAmap returned no valid geolocated events.'],
    });
  } catch (error) {
    return response.status(200).json({
      events: [],
      configured: true,
      updatedAt: new Date().toISOString(),
      warnings: [
        error instanceof Error ? error.message : 'LiveUAmap is temporarily unavailable.',
      ],
    });
  }
}
