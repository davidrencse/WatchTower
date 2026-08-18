/**
 * Assert the shipped Content-Security-Policy still covers what the app actually loads.
 *
 * A CSP is written once and then silently outgrown: someone adds a fetch to a new API, it works
 * in `vite dev` (which serves no CSP) and fails only in production, where the breakage is easy
 * to miss because most of these features degrade to a fallback instead of erroring loudly. This
 * script closes that loop the way `check:trade-routes` does for lane geometry — it re-derives
 * the facts from source and compares them against what ships.
 *
 * Invariants:
 *   1. Every origin passed to `fetch()` in `src/` is allowed by `connect-src`.
 *   2. `connect-src` and RUNTIME_ENDPOINTS agree — neither grows a stale entry.
 *   3. The locked-down directives stay locked down, and the required headers stay present.
 *   4. `dist/index.html` carries no inline <script> and no inline event-handler attribute,
 *      because either would force `script-src 'unsafe-inline'` and gut the policy.
 *
 * Note on scope: the country datasets hold ~470 citation URLs in `url:`/`*_URL` fields that are
 * rendered as links, never fetched. Only `fetch()` call sites count as runtime origins here —
 * matching on constant *names* cannot tell a source citation from an endpoint.
 *
 * Run: node scripts/check-csp.mjs   (wired into `npm run build`)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const vercelConfigPath = path.join(projectRoot, 'vercel.json');
const distIndexPath = path.join(projectRoot, 'dist', 'index.html');
const srcDir = path.join(projectRoot, 'src');

/**
 * Remote origins the running app talks to, and why. Keep in step with `connect-src`; the check
 * below fails if the two drift apart in either direction.
 *
 * Origins reached through a URL built at runtime (so not statically visible at the `fetch()`
 * call site) are listed here with the module that builds them.
 */
const RUNTIME_ENDPOINTS = {
  'https://hacker-news.firebaseio.com': 'src/data/hackerNews.ts — front-page story feed',
  'https://eonet.gsfc.nasa.gov': 'src/data/eonetEvents.ts — NASA natural-event pins',
  'https://api.microlink.io': 'src/lib/countries/germany/germanyNewsPreviewImage.ts — og:image resolution',
  'https://celestrak.org': 'src/data/satelliteGroups.ts builds the GP URL; fetched in src/workers/satellites.worker.ts',
  'https://tiles.openfreemap.org': 'src/lib/maplibreReconStyle.ts — basemap vector tiles + glyphs',
  'https://s3.amazonaws.com': 'src/lib/maplibreReconStyle.ts — terrarium raster-DEM tiles',
};

const failures = [];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(ts|tsx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

function originOf(url) {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

// ── 1. Resolve the origin of every fetch() call site ──────────────────────────
// Handles the four shapes this codebase uses:
//   fetch('https://…')            fetch(`${CONST}/path`)
//   fetch(CONST)                  const u = new URL(CONST); … fetch(u)
const fetchOrigins = new Map(); // origin -> Set<"file (snippet)">

for (const file of walk(srcDir)) {
  const source = fs.readFileSync(file, 'utf8');
  if (!source.includes('fetch(')) continue;
  const rel = path.relative(projectRoot, file).replace(/\\/g, '/');

  // Every `const NAME = 'https://…'` in this file, plus `const NAME = new URL(OTHER)` aliases.
  const literals = new Map();
  for (const [, name, url] of source.matchAll(
    /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*(?::[^=\n]+)?=\s*[`'"](https:\/\/[^`'"\s${]+)/g,
  )) {
    literals.set(name, url);
  }
  for (const [, alias, target] of source.matchAll(
    /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*new URL\(\s*([A-Za-z_$][\w$]*)\s*[,)]/g,
  )) {
    if (literals.has(target)) literals.set(alias, literals.get(target));
  }

  const note = (url, snippet) => {
    const origin = originOf(url);
    if (!origin) return;
    if (!fetchOrigins.has(origin)) fetchOrigins.set(origin, new Set());
    fetchOrigins.get(origin).add(`${rel} — fetch(${snippet})`);
  };

  for (const match of source.matchAll(/fetch\(\s*([^,)\n]+)/g)) {
    const arg = match[1].trim();

    // Literal, possibly a template opening with the origin spelled out.
    const literal = arg.match(/^[`'"](https:\/\/[^`'"\s${]+)/);
    if (literal) {
      note(literal[1], literal[1]);
      continue;
    }

    // Template literal opening with an interpolated constant: `${HN_API_ROOT}/item/…`
    const interpolated = arg.match(/^`\$\{([A-Za-z_$][\w$]*)\}/);
    if (interpolated && literals.has(interpolated[1])) {
      note(literals.get(interpolated[1]), `\${${interpolated[1]}}…`);
      continue;
    }

    // Bare identifier — a constant, or a URL object aliased from one.
    const identifier = arg.match(/^([A-Za-z_$][\w$]*)$/);
    if (identifier && literals.has(identifier[1])) {
      note(literals.get(identifier[1]), identifier[1]);
      continue;
    }

    // Relative paths ('/geo/…', '/api/…') and runtime-built URLs resolve to 'self'.
  }
}

// ── 2. Parse the deployed CSP ─────────────────────────────────────────────────
if (!fs.existsSync(vercelConfigPath)) {
  console.error('✗ vercel.json is missing — the security headers ship from there.');
  process.exit(1);
}

const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
const allHeaders = (vercelConfig.headers ?? []).flatMap((rule) => rule.headers ?? []);
const csp = allHeaders.find((h) => h.key.toLowerCase() === 'content-security-policy')?.value;

if (!csp) {
  console.error('✗ No Content-Security-Policy header found in vercel.json.');
  process.exit(1);
}

const directives = new Map(
  csp
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [name, ...values] = part.split(/\s+/);
      return [name.toLowerCase(), values];
    }),
);

const REQUIRED_HEADERS = [
  'x-content-type-options',
  'referrer-policy',
  'strict-transport-security',
  'permissions-policy',
];
for (const required of REQUIRED_HEADERS) {
  if (!allHeaders.some((h) => h.key.toLowerCase() === required)) {
    failures.push(`vercel.json is missing the ${required} header.`);
  }
}

// Directives that must stay locked down for the policy to be worth having.
const MUST_EQUAL = {
  'object-src': "'none'",
  'base-uri': "'self'",
  'frame-ancestors': "'none'",
  'script-src': "'self'",
  'default-src': "'self'",
};
for (const [directive, expected] of Object.entries(MUST_EQUAL)) {
  const actual = (directives.get(directive) ?? []).join(' ');
  if (actual !== expected) {
    failures.push(`CSP ${directive} should be "${expected}" but is "${actual || '(absent)'}".`);
  }
}

// ── 3. connect-src must match both the fetch sites and the documented list ────
const connectSrc = directives.get('connect-src') ?? [];
const allowedRemote = connectSrc.filter((entry) => entry.startsWith('https://'));

for (const [origin, wheres] of [...fetchOrigins].sort()) {
  if (connectSrc.includes(origin)) continue;
  failures.push(
    `CSP connect-src does not allow ${origin}\n      reached from: ${[...wheres].join('; ')}`,
  );
}

for (const origin of Object.keys(RUNTIME_ENDPOINTS)) {
  if (!allowedRemote.includes(origin)) {
    failures.push(`RUNTIME_ENDPOINTS lists ${origin} but CSP connect-src does not allow it.`);
  }
}

for (const origin of allowedRemote) {
  if (!(origin in RUNTIME_ENDPOINTS)) {
    failures.push(
      `CSP connect-src allows ${origin}, but it is not documented in RUNTIME_ENDPOINTS ` +
        '(add it with the module that uses it, or drop it from the policy).',
    );
  }
}

// ── 4. The built HTML must stay free of inline script ─────────────────────────
if (fs.existsSync(distIndexPath)) {
  const html = fs.readFileSync(distIndexPath, 'utf8');
  if (/<script(?![^>]*\bsrc=)[^>]*>[\s\S]*?\S[\s\S]*?<\/script>/i.test(html)) {
    failures.push("dist/index.html contains an inline <script>, which script-src 'self' blocks.");
  }
  const inlineHandler = html.match(/\son[a-z]+\s*=\s*["']/i);
  if (inlineHandler) {
    failures.push(
      `dist/index.html contains an inline event handler (${inlineHandler[0].trim()}), ` +
        "which script-src 'self' blocks.",
    );
  }
} else {
  console.warn('! dist/index.html not found — skipping the inline-script check (build first).');
}

// ── Report ────────────────────────────────────────────────────────────────────
if (failures.length > 0) {
  console.error(`\n✗ CSP check failed (${failures.length} problem(s)):\n`);
  for (const failure of failures) console.error(`  • ${failure}`);
  console.error('');
  process.exit(1);
}

console.log(
  `✓ CSP check passed — ${fetchOrigins.size} remote fetch origin(s) resolved, ` +
    `${allowedRemote.length} allowed by connect-src, no inline script in dist.`,
);
