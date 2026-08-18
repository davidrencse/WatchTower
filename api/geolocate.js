/**
 * `/api/geolocate` — forwards a Recon deep scan to the OSINT image-geolocation engine.
 *
 * The engine lives at `osint/` in this repo and runs as its own Node process (it needs `sharp`,
 * `exifr` and the vision-provider key). This handler is the seam between the two: it takes the
 * browser's already-rasterized multipart upload, caps it, and re-posts it to
 * `OSINT_API_URL`. The engine independently validates and rewrites it again.
 *
 *   cd osint && npm install && npm run dev     # engine on :3000
 *   OSINT_API_URL=http://127.0.0.1:3000/api/geolocate   # the default, so usually unset
 *
 * Written against **plain Node `req`/`res`** rather than the framework helpers used by
 * `conflict-events.js`, because `vite.config.ts` mounts this exact module as dev middleware. One
 * handler, one behaviour, in `npm run dev` and in production.
 *
 * A stopped engine is an ordinary state, not a crash: it comes back as 503 with
 * `reason: "offline"` so the panel can tell the operator to start the sidecar instead of showing
 * a stack trace.
 */

const DEFAULT_OSINT_URL = 'http://127.0.0.1:3000/api/geolocate';

/** Matches the engine's own per-file cap (`osint/src/app/api/geolocate/route.ts`). */
const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
const MAX_REQUEST_BYTES = MAX_UPLOAD_BYTES + 256 * 1024; // multipart boundary/headers

/** The engine's vision + refine passes are slow; its route allows 120 s. Outlast it slightly. */
const UPSTREAM_TIMEOUT_MS = 125_000;
const MAX_UPSTREAM_RESPONSE_BYTES = 10 * 1024 * 1024;

// Vercel would otherwise try to parse the multipart body for us and hand over a mangled stream.
export const config = { api: { bodyParser: false } };

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.end(body);
}

function isCrossSiteRequest(req) {
  if (req.headers['sec-fetch-site'] === 'cross-site') return true;

  const origin = req.headers.origin;
  const forwardedHost = String(req.headers['x-forwarded-host'] || '').split(',')[0].trim();
  const requestHost = forwardedHost || req.headers.host;
  if (!origin || !requestHost) return false;

  try {
    return new URL(origin).host !== requestHost;
  } catch {
    return true;
  }
}

function configuredUpstream() {
  let url;
  try {
    url = new URL(process.env.OSINT_API_URL || DEFAULT_OSINT_URL);
  } catch {
    return null;
  }

  if (url.username || url.password) return null;
  if (url.protocol === 'https:') return url;
  if (url.protocol !== 'http:') return null;
  return ['127.0.0.1', 'localhost', '::1', '[::1]'].includes(url.hostname) ? url : null;
}

/**
 * Buffer the request body, refusing anything over the cap.
 *
 * The size is enforced as bytes arrive rather than trusting `content-length`, since the header is
 * client-controlled and a chunked upload need not send one at all.
 */
function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    let settled = false;

    req.on('data', (chunk) => {
      if (settled) return;
      total += chunk.length;
      if (total > MAX_REQUEST_BYTES) {
        settled = true;
        chunks.length = 0;
        reject(Object.assign(new Error('Upload too large'), { code: 'TOO_LARGE' }));
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (!settled) {
        settled = true;
        resolve(Buffer.concat(chunks));
      }
    });
    req.on('error', (error) => {
      if (!settled) {
        settled = true;
        reject(error);
      }
    });
  });
}

async function readResponseText(response) {
  const declaredLength = Number(response.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_UPSTREAM_RESPONSE_BYTES) {
    throw new Error('Upstream response too large');
  }
  if (!response.body) return '';

  const reader = response.body.getReader();
  const chunks = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_UPSTREAM_RESPONSE_BYTES) {
      await reader.cancel();
      throw new Error('Upstream response too large');
    }
    chunks.push(Buffer.from(value));
  }
  return Buffer.concat(chunks).toString('utf8');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Use POST with a multipart/form-data image.' });
  }

  if (isCrossSiteRequest(req)) {
    return sendJson(res, 403, { error: 'Cross-site uploads are not allowed.' });
  }

  const contentType = req.headers['content-type'] || '';
  if (!/^multipart\/form-data(?:;|$)/i.test(contentType) || !/boundary=/i.test(contentType)) {
    return sendJson(res, 400, { error: 'Upload the image as multipart/form-data.' });
  }
  const declaredLength = Number(req.headers['content-length']);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) {
    return sendJson(res, 413, {
      error: `Image exceeds the ${MAX_UPLOAD_BYTES / 1e6} MB limit.`,
      reason: 'too-large',
    });
  }

  let body;
  try {
    body = await readBody(req);
  } catch (error) {
    if (error && error.code === 'TOO_LARGE') {
      return sendJson(res, 413, {
        error: `Image exceeds the ${MAX_UPLOAD_BYTES / 1e6} MB limit.`,
        reason: 'too-large',
      });
    }
    return sendJson(res, 400, { error: 'Could not read the upload.' });
  }

  if (!body.length) {
    return sendJson(res, 400, { error: 'No image in the request.' });
  }

  const upstream = configuredUpstream();
  if (!upstream) {
    return sendJson(res, 503, {
      error: 'The OSINT engine is not configured securely.',
      reason: 'unconfigured',
    });
  }

  let response;
  try {
    const headers = { 'Content-Type': contentType, Accept: 'application/json' };
    if (process.env.OSINT_API_SECRET) headers['X-OSINT-Secret'] = process.env.OSINT_API_SECRET;
    response = await fetch(upstream, {
      method: 'POST',
      // Forward the boundary exactly as received — re-encoding the form would break it.
      headers,
      body,
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'TimeoutError';
    return sendJson(res, 503, {
      error: timedOut
        ? 'The OSINT engine did not answer in time.'
        : 'The OSINT engine is unavailable.',
      reason: timedOut ? 'error' : 'offline',
    });
  }

  let text;
  try {
    text = await readResponseText(response);
  } catch {
    return sendJson(res, 502, { error: 'The OSINT engine returned too much data.', reason: 'error' });
  }

  if (!response.ok) {
    let message = `The OSINT engine returned ${response.status}.`;
    let reason = 'error';
    try {
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed.error === 'string') message = parsed.error;
      if (parsed && typeof parsed.reason === 'string') reason = parsed.reason;
    } catch {
      // Non-JSON upstream error (a framework error page) — keep the status-code message.
    }
    return sendJson(res, response.status, { error: message, reason });
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.end(text);
}
