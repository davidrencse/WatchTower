# WatchTower — Project Guidance

## Installed skills — when to use them

These skills live in `.agents/skills/` (symlinked into Claude Code). Invoke a skill
with the `Skill` tool when a task matches its description below, or when the user asks
for it by name / slash command. They also auto-register by their own `SKILL.md`
descriptions, so treat this list as a reinforcement, not the only trigger.

| Skill | Reach for it when… | Manual trigger |
|---|---|---|
| **ui-ux-pro-max** | Designing, building, or reviewing any UI — pages, components, color schemes, typography, layout, accessibility, animation, data-viz. Local DB of styles, palettes, font pairings, GSAP/motion presets, chart types across many stacks. | "design this", "make it look good" |
| **web-artifacts-builder** | Building an elaborate multi-component claude.ai HTML artifact needing state, routing, or shadcn/ui. Not for simple single-file artifacts. | — |
| **improve-codebase-architecture** | Scanning the codebase for structural/"deepening" improvements and producing a visual HTML report to work through. | "improve architecture", `/improve-codebase-architecture` |
| **overkill** | The user wants the maximalist / frontier / future-proofed take — advanced data structures, distributed-systems algorithms, niche frameworks. NOT a pragmatic recommendation engine; skip it when they want the simplest sufficient answer. | "overkill", "make it enterprise", `/overkill` |
| **deep-research** | Autonomous multi-step external research (market analysis, competitive landscaping, literature review, due diligence). Uses Gemini Deep Research; takes minutes and **costs ~$2–5 per run** — confirm with the user before invoking. | "deep research on…" |
| **file-organizer** | Organizing files/folders by context, finding duplicates, suggesting structures, cleanup. | "organize my files" |
| **caveman** | Token-efficient output. Compresses responses ~65% by writing in terse "caveman" style while keeping full technical accuracy. Levels: lite / full / ultra. | "caveman mode", "be brief", `/caveman` |
| **find-skills** | The user wants a capability that might exist as an installable skill ("is there a skill for X", "find a skill that…"). Searches the skills.sh registry via `npx skills find`. | — |

**Security note:** `ui-ux-pro-max` and `overkill`/`deep-research` scored **Med–High** on the
`skills` CLI generative-risk check at install time (Socket: 0 alerts; Snyk: Low–Med). They run
with full agent permissions like any skill — review their `SKILL.md` before relying on them for
anything sensitive.

**Managing skills:** update with `npx skills update`; check for updates with `npx skills check`;
add more with `npx skills add <owner/repo@skill>`.

## Project structure

```
src/
  components/  (~87 files)
    countries/{germany,france,italy,spain}/  Country-specific sections
    government/ military/ statTiles/ ui/     Domain component groups
    *.tsx                                    Shared, multi-country components
  lib/  (~100 files)
    countries/{germany,france,italy}/  Country data transforms
    csv.ts / csvCache.ts               CSV parsing + session cache for /data/*.csv
    mapGlobeOverlays.ts                Every globe GeoJSON builder
    satelliteLayer.ts                  MapLibre custom WebGL layer (orbital shells)
    *.ts                               Shared helpers
  data/  (~48 files)
    countries/{germany,france,italy}/  Country datasets
    military/ government/              Domain datasets
    *.ts                               Globe layer datasets (war, OSINT, corridors, satellites)
  hooks/     useCsvText, useSatellites
  workers/   satellites.worker.ts — SGP4 propagation off the main thread
  context/   CountryRibbonExpandContext
  types/     Shared type declarations
```

Three layers, read as `data/` (facts) → `lib/` (transforms) → `components/` (render). One
deliberate inversion: ~28 modules under `lib/countries/{france,italy}/` import **types only**
from the Germany components they feed, because those components own the row shapes the other
countries reuse. No `lib/` module imports a component *value*, so nothing pulls React into a
data path.

Most `Germany*` components render Germany's own bundled data and are **reused as the layout** for
every other country. Only `GermanyPoliticsZionismSection` and `GermanyCrimeVictimsNotableIncidents`
branch on `iso3` internally.

### Curated dossiers vs. the Germany template

`treatAsGermany` is now unconditional — **every** routable country renders the full Germany
structure (all sections, subsections and statistic slots). Provenance is a separate axis, owned by
`lib/countryTemplateStatus.ts`:

| | Countries | Behaviour |
|---|---|---|
| **Curated** | DEU · FRA · ITA · ESP | Every panel backed by that country's own sources. Never falls back to the broad-strokes table. |
| **Template** | the other 45 | Same layout, own generated CSVs where a panel takes a `csvUrl`, plus rough estimates from `data/countries/countryBroadStrokes.ts`. |

The governing rule for template dossiers: **never delete a box for want of data — mark it.**

- A panel whose content would still be German renders a red `TemplateGapBlock` (`components/TemplateGap.tsx`) instead.
- A statistic slot with no country figure becomes a red "Data needed" `MetricTile` — `asTemplateSlotMetric` blanks Germany's values, `fillMissingTemplateSlots` materialises slots Germany's builders never emit (median age, military-aged males, the M:F ratio).
- A per-country CSV that parses zero rows renders `EmptyCsvNotice`, not a grey line of text.
- Panels fed from the broad-strokes table get an amber `EstimateBlock`; those figures are **rounded orientation values, not sourced statistics**.

When adding real data for a template country, move it out of `countryBroadStrokes.ts` into a
`lib/countries/<country>/` module and drop the corresponding `TemplateGapBlock`.

### Loading data

Never hand-roll a `fetch` for a static table. Use `useCsvText(url, fallback)` from
`src/hooks/useCsvText.ts`, which reads through `src/lib/csvCache.ts`. This matters because
`CollapsibleFlagSection` **unmounts its children when collapsed** — without the cache, every
re-expand refetches and re-parses. Live APIs (HackerNews, EONET, OSINT) are deliberately uncached.

### The globe (`src/components/MapGlobe.tsx`)

A MapLibre map in **globe projection**, not a bespoke 3D scene. Layers are registered once inside
`installOverlays()` and are gated by zoom, which is the organising idea worth knowing before
editing it:

| Zoom | What appears |
|---|---|
| `MIN_ZOOM = -1` → ~3 | Orbital shells (satellites), fading in as the camera pulls **back** |
| `MIN_ZOOM` → 7 | Seaborne trade lanes, also fading out as the camera closes in (`TRADE_FADE_*`) |
| 1.6 / 2.6 (`TRADE_NODE_MIN_ZOOM`, `TRADE_LABEL_MIN_ZOOM`) | Trade chokepoint + port dots, then their labels |
| 3.2 (`WAR_REVEAL_ZOOM`) | Ukraine control fills / frontline |
| 2.8 / 4 (`OOB_GARRISON_*`) | Garrisons — home stations, which run wide-to-close because they span Odesa to the Pacific |
| 3.4 / 3.9 / 5 / 5.8 (`OOB_*`) | Order of battle: fortification belts, then fixed sites, then unit symbols, then their labels |
| 3.8 / 5 | War event dots · Israel–Iran dots |
| 4 (`MILITARY_BASE_MIN_ZOOM`) | Military installations |
| 4.2 (`ANCESTRY_REVEAL_ZOOM`) | Per-region ancestry choropleth (7 countries) |
| 5.5 (`EVENT_PIN_MIN_ZOOM`) | News / EONET / OSINT pins |

Two overlays sit behind a switch (`lib/globeLayerGroups.ts` → `GlobeLayerToggles`): **sea trade
routes** and the **Russo-Ukrainian war** (control, frontline, events and order of battle). They are
the only ones that are *always on* inside their zoom band rather than answering a hover, which is
what earns them a control. Toggling flips `visibility`, which also drops the layer out of
`queryRenderedFeatures`, so hover and click need no matching branch. `installOverlays()` re-applies
the current switch positions on every `styledata` pass, because it rebuilds every layer at its
default visibility. Adding a layer to a switched group means adding its id to `layerIds` — a typo
there fails silently, so cross-check against the `id: 'wt-…'` literals in `MapGlobe.tsx`.

Trade lanes and satellites are the two layers that run **backwards** to everything else: they are
planetary-scale, so they are lit at the widest camera and fade out as you close in on a country,
where the war / ancestry / base overlays own the frame. Because of that, `queryAt()` gives the
`wt-trade-*` layers an upper zoom bound as well as a lower one.

Every point layer is a `circle` layer fed by a builder in `lib/mapGlobeOverlays.ts`, with the
category colour **denormalised into feature properties** so paint is `['get','color']` and no
per-frame JS runs. Adding a hoverable pin layer means three touchpoints: `PIN_LAYERS`, a zoom
branch in `pinAt()`, and a branch in `describePin()`.

**The order-of-battle layer is deliberately coarse.** `src/data/warOrderOfBattle.ts` holds reported
formations, fortification belts, known fixed sites and **garrisons** for both sides. Formation
coordinates are **sector anchors**, accurate to tens of kilometres — they say "this formation is
reported to hold this axis", never where a unit is; belts are schematic paths through the
settlements reporting names, not traced from imagery. A formation only gets an anchor when a
published order of battle attributes it to an axis; the rest appear only as garrisons. Garrisons
are **home stations** — where a formation is administratively based, which is reference data, not
a disposition — so they are the one dataset that leaves the theatre, since half the Russian armies
committed are based in Siberia and the Far East. Every record carries `precision`/status and a
source, and the hover cards print that caveat. Re-date `OOB_ASSESSED_AT` whenever the records are
refreshed. `npm run check:war-oob` asserts the invariant that keeps a typo from becoming a claim:
each sector anchor, belt vertex and garrison must fall on its own side of the dated control
snapshot, on land (harbours excepted for fleet bases), inside its bounding box — the theatre for
everything except garrisons, which get Russia's own extent instead.

**Trade lanes must stay on water.** `src/data/maritimeTradeRoutes.ts` plots each lane through real
traffic-separation schemes, canals and straits; `npm run check:trade-routes` densifies every lane
the way the globe does and point-in-polygon tests each vertex against `public/geo/world-land.json`.
Canal and river transits (Suez, Panama, the Elbe) are land in Natural Earth, so they are
whitelisted as named corridor boxes in the script rather than skipped. Run it after touching any
waypoint — a lane drawn across Arabia looks plausible in a diff and obvious on the globe.

**Satellites are the exception** — MapLibre has no concept of a point at altitude, so they are a
raw WebGL custom layer (`lib/satelliteLayer.ts`). It leans on MapLibre's own shader prelude:
`projectTileFor3D(mercatorXY, elevationMetres)` does `spherePos * (1 + elevation/GLOBE_RADIUS)`
under globe projection, so the whole catalogue draws at true altitude in one call. That 3D path
skips the horizon clip the 2D path applies, so the layer culls far-side satellites itself with a
ray/sphere test mirrored in both the shader and CPU picking.

CelesTrak **refuses a repeat download inside its two-hour window** (HTTP 403, plain-text body), so
the worker's Cache Storage layer is required for correctness, not speed — without it a reload
inside that window yields an empty sky. It also answers an unknown group with **HTTP 200** and an
`Invalid query` body, so payloads are validated before caching.

### Recon — the photo locator (`src/components/ReconLocator.tsx`)

Drop a photo on the globe, get a coordinate, watch the camera fly to it. It is anchored bottom-left
inside `.wt-globe-map`; note that the HackerNews rail is a `6.25rem` band at `z-index: 60` pinned to
the same edge, so anything down there must clear it via `--wt-hn-rail-height` the way
`.wt-recon-anchor` and `.wt-globe-hud-bottom` do — a plain `bottom: 1.5rem` is invisible, not merely
overlapped.

Four rungs, ordered strongest-evidence-first, and the panel always names the one it landed on
because they are not equally trustworthy. Colour encodes the evidence class and is shared with the
globe reticle through `components/reconOrigin.ts`:

| Rung | Origin | Runs | Evidence |
|---|---|---|---|
| 1 | `exif` | in-tab (`lib/exifGeolocation.ts`) | Device GPS fix — a **measurement** |
| 2 | `coordinates` | in-tab | A pair parsed from the filename or typed in |
| 3 | `place` | in-tab | Filename matched against the known entry nodes — a name lookup |
| 4 | `geocoded` / `vision` | **the `osint/` sidecar** | Pixel content — an **inference** |

Rungs 1–3 never upload anything, which is why they are automatic. **Rung 4 uploads the photo** to
the OSINT engine embedded at `osint/` (a separate Next app: `sharp`, `exifr`, and a vision key), so
it fires only when the operator asks, and its results are listed for acceptance rather than applied.

```bash
cd osint && npm install && npm run dev   # engine on :3000 — also a `.claude/launch.json` config
```

`src/lib/osintGeolocate.ts` is the transport; `api/geolocate.js` forwards the multipart upload to
`OSINT_API_URL` (default `http://127.0.0.1:3000/api/geolocate`). That handler is written against
**plain Node `req`/`res`, not the framework helpers `conflict-events.js` uses**, because
`vite.config.ts` mounts the very same module as dev middleware — one handler, one behaviour, in
`npm run dev` and on Vercel. A stopped engine is an ordinary state: it answers 503 with
`reason: "offline"` and the panel prints the command to start it. Without `VISION_API_KEY` in
`osint/.env.local` the engine still returns EXIF and geocoded points and reports the AI sources as
skipped — the panel says which.

### Generated assets — do not hand-edit

| Output | Generator |
|---|---|
| `public/geo/*.json`, `src/data/countryAnchors.ts` | `npm run update:globe-geometry` |
| `public/data/*.csv` | Vite plugin, mirrored from `Assets/Data` at build |
| `src/data/military/*` | `npm run update:military-data`, `update:military-equipment` |
| East Asia flags in `Assets/Flags` | `node scripts/generate-flag-art.mjs` |
| `public/geo/military-bases.json` | `npm run update:military-bases` (third-party source — see script header) |
| `public/geo/admin1-regions.json` | `npm run update:admin1-regions` |
| `src/data/warFrontlineGeometry.ts` | `npm run update:frontline` (DeepState snapshot — see script header) |

Globe geometry is served as JSON from `/geo/`, not imported — keeping ~1.2 MB of coordinates
out of the JavaScript bundle. Add geometry to the bake scripts, never as a `.ts` data module.

Satellite elements are **not** baked: CelesTrak sends CORS headers, so `satellites.worker.ts`
fetches them live and caches them. `npm run build` enforces the bundle budget
(`scripts/check-bundle-size.mjs`) — initial JS must stay under 200 KB gzip.

### Security headers and the CSP

Production headers ship from `vercel.json`, and the Content-Security-Policy there is strict
enough to break the app if it drifts from the code. `npm run check:csp`
(`scripts/check-csp.mjs`, wired into `npm run build`) is what keeps them in step — it resolves
every `fetch()` origin in `src/` and fails when one is not in `connect-src`. Two things trip
people up:

- **`script-src 'self'` — no inline script, ever.** The pre-paint theme resolution lives in
  `public/theme.js`, not inline in `index.html`, and the webfont's old `onload="this.media='all'"`
  attribute is now a capture-phase `load` listener in that same file keyed off `data-swap-media`.
  Both would need `'unsafe-inline'` back, which would forfeit most of the policy's value. The
  check greps `dist/index.html` for either and fails the build.
- **A new remote origin needs three edits**, not one: the `fetch`, the `connect-src` entry, and
  the `RUNTIME_ENDPOINTS` note in the check script saying which module uses it. Origins built at
  runtime (CelesTrak's GP URL, the MapLibre style's tile and glyph hosts) are invisible to the
  static scan, so they live only in `RUNTIME_ENDPOINTS` — the check fails if that list and
  `connect-src` disagree in either direction.

`VITE_OSINT_PINS_URL` is the one runtime origin the policy cannot know in advance. It is unset
by default (the layer falls back to its bundled sample fixture), and `vite dev` serves no CSP —
so a **production** deployment that points it at a real host must add that origin to
`connect-src` and `RUNTIME_ENDPOINTS`, or the globe will silently fall back to samples.

URLs that arrive over the network — Hacker News submissions, OSINT pins, Microlink's `og:image` —
are vetted through `src/lib/safeUrl.ts` at the point they are normalised, not at each render
site. React escapes text but not URL schemes, so `href="javascript:…"` would otherwise still
execute on click.
