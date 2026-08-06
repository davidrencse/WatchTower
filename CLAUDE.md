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

Most `Germany*` components render Germany's own bundled data and are **reused as the fallback
layout** for other countries (see `treatAsGermany`). Only `GermanyPoliticsZionismSection` and
`GermanyCrimeVictimsNotableIncidents` branch on `iso3` internally.

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
| 3.2 (`WAR_REVEAL_ZOOM`) | Ukraine control fills / frontline |
| 3.8 / 5 | War event dots · Israel–Iran dots |
| 4 (`MILITARY_BASE_MIN_ZOOM`) | Military installations |
| 5.5 (`EVENT_PIN_MIN_ZOOM`) | News / EONET / OSINT pins |

Every point layer is a `circle` layer fed by a builder in `lib/mapGlobeOverlays.ts`, with the
category colour **denormalised into feature properties** so paint is `['get','color']` and no
per-frame JS runs. Adding a hoverable pin layer means three touchpoints: `PIN_LAYERS`, a zoom
branch in `pinAt()`, and a branch in `describePin()`.

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

### Generated assets — do not hand-edit

| Output | Generator |
|---|---|
| `public/geo/*.json`, `src/data/countryAnchors.ts` | `npm run update:globe-geometry` |
| `public/data/*.csv` | Vite plugin, mirrored from `Assets/Data` at build |
| `src/data/military/*` | `npm run update:military-data`, `update:military-equipment` |
| East Asia flags in `Assets/Flags` | `node scripts/generate-flag-art.mjs` |
| `public/geo/military-bases.json` | `npm run update:military-bases` (third-party source — see script header) |

Globe geometry is served as JSON from `/geo/`, not imported — keeping ~1.2 MB of coordinates
out of the JavaScript bundle. Add geometry to the bake scripts, never as a `.ts` data module.

Satellite elements are **not** baked: CelesTrak sends CORS headers, so `satellites.worker.ts`
fetches them live and caches them. `npm run build` enforces the bundle budget
(`scripts/check-bundle-size.mjs`) — initial JS must stay under 200 KB gzip.
