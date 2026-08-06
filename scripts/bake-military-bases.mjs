// Bakes ALC Press's world military-installation markers into a compact globe point layer.
// Output: public/geo/military-bases.json   Run: npm run update:military-bases
//
// Source: https://alcpress.org/military/world/world.xml — © 2016, 2026 ALC Press. No open licence
// is stated (there is no terms page; robots.txt is permissive). The base coordinates are facts,
// but the compilation is theirs — credit them if this ships anywhere public.
//
// The source sends no CORS headers, so the browser can never read it directly; that is why this
// runs at author time and commits its output, rather than the app fetching the XML at runtime.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dir = dirname(fileURLToPath(import.meta.url));
const sourcePath = resolve(__dir, '_alc_world_military.xml');
const sourceUrl = 'https://alcpress.org/military/world/world.xml';
const xml = existsSync(sourcePath)
  ? readFileSync(sourcePath, 'utf8')
  : await fetch(sourceUrl).then((response) => {
      if (!response.ok) throw new Error(`ALC Press download failed: ${response.status}`);
      return response.text();
    });

// --- Parsing.
// No XML dependency: the file is machine-generated and strictly two levels deep (a <bases> root of
// flat <marker> records), with no nesting, namespaces, or CDATA. The known field tallies below let
// us assert the parse rather than trust it, which is what makes hand-parsing safe here.
function decodeEntities(value) {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&(?:apos|#39);/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&amp;/g, '&') // last, so "&amp;lt;" does not decode twice
    .trim();
}

function field(chunk, tag) {
  const match = chunk.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`));
  return match ? decodeEntities(match[1]) : '';
}

/**
 * Some markers repeat a tag — 103 carry more than one `<aka>`, 15 more than one `<note>` — so
 * taking only the first would quietly drop alternate names. Join them instead.
 */
function fieldList(chunk, tag) {
  const matches = chunk.matchAll(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, 'g'));
  return [...matches]
    .map((match) => decodeEntities(match[1]))
    .filter(Boolean)
    .join(' · ');
}

// Strip XML comments first — the file keeps commented-out <marker> templates (an empty <geo>
// stub near the top among them), and a naive split would parse those as real records.
const chunks = xml
  .replace(/<!--[\s\S]*?-->/g, '')
  .split('<marker>')
  .slice(1)
  .map((chunk) => chunk.split('</marker>')[0]);

// --- Normalisation.
// `<c>` is entered by hand and inconsistent: mixed case, non-ISO shorthand, and a few full country
// names. Case-fold first (collapses au/AU, jp/JP, syr), then alias the rest onto ISO-2.
const OPERATOR_ALIAS = {
  NK: 'KP', // the source's own shorthand for North Korea
  UK: 'GB',
  SYR: 'SY',
  GUAM: 'US', // a US territory — the operator is the United States
  JAPAN: 'JP',
  ETHIOPIA: 'ET',
  IRAQ: 'IQ',
  NIGER: 'NE',
  PAKISTAN: 'PK',
  ROMANIA: 'RO',
  // Typos, each identified from the marker's own <adr>:
  ND: 'MD', // "Mărculești Air Force Base / Dubasari, Moldova"
  LM: 'LY', // "Al Jufra Airbase / Houn, Libya"
};

function normalizeOperator(raw) {
  const key = raw.trim().toUpperCase();
  return OPERATOR_ALIAS[key] ?? key;
}

/** Every ISO 3166-1 alpha-2 code the source actually uses, for the unmapped-code report. */
const ISO2 = new Set(
  ('AE AF AL AM AO AR AT AU AZ BA BF BG BN BO BR BY CA CD CL CN CO CU CY CZ DE DK DO DZ EC EG ER ES ET FI FR GA GB GF GR HN HR HU ID IE IL IN IQ IR IS IT JM JO JP KE KG KH KP KR KZ LA LB LK LT LV LY MA MD MM MX MY MZ NA NC NE NG NL NO NZ OM PE PG PH PK PL PT PY RO RU SA SD SE SG SK SN SR SY TH TJ TM TN TR TW TZ UA US UY UZ VE VN YE ZA ZM')
    .split(' '),
);

const NATO = new Set([
  'GB', 'FR', 'DE', 'IT', 'ES', 'TR', 'NL', 'BE', 'PT', 'GR', 'PL', 'CZ', 'HU', 'RO', 'BG',
  'SK', 'SI', 'HR', 'AL', 'ME', 'MK', 'EE', 'LV', 'LT', 'DK', 'NO', 'IS', 'LU', 'CA', 'FI', 'SE',
]);

/** `us` and `nato` stay distinct in the data even though the globe paints both blue. */
function blocFor(operator) {
  if (operator === 'US') return 'us';
  if (NATO.has(operator)) return 'nato';
  if (operator === 'CN') return 'cn';
  if (operator === 'RU') return 'ru';
  if (operator === 'KP') return 'prk';
  return 'other';
}

// The page legend advertises A/D/N/T, but the data only ever uses A, N and I — plus 85 markers
// with no <t> at all. Those stay explicitly typeless rather than being guessed from the name.
const TYPE_BY_CODE = { A: 'air', N: 'naval', I: 'missile' };

const quantize = (value) => Math.round(value * 1e4) / 1e4; // ~11 m — points are landmarks

const records = [];
const badGeo = [];
const unmapped = new Map();
const typeTally = { air: 0, naval: 0, missile: 0, other: 0 };
const blocTally = { us: 0, nato: 0, cn: 0, ru: 0, prk: 0, other: 0 };

for (const chunk of chunks) {
  const [latRaw, lngRaw] = field(chunk, 'geo').split(',');
  const lat = Number(latRaw);
  const lng = Number(lngRaw);
  const name = field(chunk, 'name');
  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    Math.abs(lat) > 90 ||
    Math.abs(lng) > 180
  ) {
    badGeo.push(name || '(unnamed)');
    continue;
  }

  const operator = normalizeOperator(field(chunk, 'c'));
  const bloc = blocFor(operator);
  const type = TYPE_BY_CODE[field(chunk, 't')] ?? 'other';
  if (!ISO2.has(operator)) {
    const seen = unmapped.get(operator) ?? [];
    seen.push(`${name} / ${field(chunk, 'adr')}`);
    unmapped.set(operator, seen);
  }

  const record = {
    g: [quantize(lng), quantize(lat)],
    n: name,
    o: operator,
    b: bloc,
    t: type,
  };
  const host = field(chunk, 'adr');
  const wiki = field(chunk, 'w');
  const aka = fieldList(chunk, 'aka');
  const note = fieldList(chunk, 'note');
  const url = field(chunk, 'url');
  if (host) record.h = host;
  if (wiki) record.w = wiki;
  if (aka) record.a = aka;
  if (note) record.x = note;
  // Only carry the raw source link when there is no Wikipedia slug to build one from.
  if (!wiki && /^https?:\/\//.test(url)) record.u = url;
  records.push(record);
}

// Collapse records that share a position and name. Some are plain double-entries, but three are
// shared bases the source deliberately lists twice — Lielvārde (US + LV), Ovda (US + IL) and Camp
// Zama (US + JP) — so a blanket dedupe would silently drop one operator's claim. Merge instead:
// the bloc-bearing operator takes the dot (it is the more informative reading of who is there),
// and any co-operator is preserved in `s` for the hover card.
const groups = new Map();
for (const record of records) {
  const key = `${record.g[0]},${record.g[1]},${record.n}`;
  const group = groups.get(key);
  if (group) group.push(record);
  else groups.set(key, [record]);
}

let plainDuplicates = 0;
let sharedBases = 0;
const deduped = [...groups.values()].map((group) => {
  if (group.length === 1) return group[0];
  const operators = [...new Set(group.map((record) => record.o))];
  if (operators.length === 1) plainDuplicates += group.length - 1;
  else sharedBases += 1;

  // Prefer the record whose operator belongs to a named bloc, then the one carrying the most
  // detail; a defined type always beats the 'other' fallback.
  const ranked = [...group].sort((a, b) => {
    const bloc = (record) => (record.b === 'other' ? 1 : 0);
    if (bloc(a) !== bloc(b)) return bloc(a) - bloc(b);
    return Object.keys(b).length - Object.keys(a).length;
  });
  const merged = { ...ranked[0] };
  if (merged.t === 'other') merged.t = ranked.find((record) => record.t !== 'other')?.t ?? 'other';
  for (const key of ['h', 'w', 'a', 'x', 'u']) {
    if (!merged[key]) merged[key] = ranked.find((record) => record[key])?.[key];
    if (!merged[key]) delete merged[key];
  }
  const others = operators.filter((operator) => operator !== merged.o);
  if (others.length) merged.s = others;
  return merged;
});

for (const record of deduped) {
  typeTally[record.t] += 1;
  blocTally[record.b] += 1;
}

if (chunks.length < 1500) throw new Error(`marker parse regressed: ${chunks.length} markers`);
if (badGeo.length) throw new Error(`${badGeo.length} unparseable <geo> values: ${badGeo.slice(0, 5)}`);
const unnamed = deduped.filter((record) => !record.n).length;
if (unnamed) throw new Error(`${unnamed} markers are missing <name>`);

const dest = resolve(__dir, '..', 'public', 'geo', 'military-bases.json');
mkdirSync(dirname(dest), { recursive: true });
const output = JSON.stringify(deduped);
writeFileSync(dest, output);

const counts = (tally) =>
  Object.entries(tally)
    .filter(([, n]) => n)
    .map(([key, n]) => `${key} ${n}`)
    .join(', ');
console.log(
  `military bases: ${chunks.length} markers → ${deduped.length} records (${counts(blocTally)})`,
);
console.log(
  `types: ${counts(typeTally)} · ${plainDuplicates} duplicate merged, ${sharedBases} shared-operator merged, ${badGeo.length} dropped`,
);
if (unmapped.size) {
  console.log('UNMAPPED operator codes — review before shipping:');
  for (const [code, examples] of unmapped) {
    console.log(`  ${code} (${examples.length}) — ${examples.slice(0, 3).join(' | ')}`);
  }
}
console.log(
  `→ public/geo/military-bases.json (${(output.length / 1024).toFixed(1)} KB)`,
);
