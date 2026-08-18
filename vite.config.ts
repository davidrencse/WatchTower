import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { PluginContext } from 'rollup';
import type { ViteDevServer } from 'vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const VIRTUAL_FLAG_FILENAMES = 'virtual:flag-filenames';
const RESOLVED_VIRTUAL = '\0' + VIRTUAL_FLAG_FILENAMES;

function listFlagFilenames(srcDir: string): string[] {
  if (!fs.existsSync(srcDir)) return [];
  return fs
    .readdirSync(srcDir)
    .filter((name) => name.toLowerCase().endsWith('.png'))
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
}

/**
 * Mirror CSV data from `Assets/Data` (the source of truth) into `public/data` so it is
 * served at `/data/<file>.csv` in dev and copied into `dist/data` for production.
 * Shared multi-country tables live in `Assets/Data/shared`; per-country files live under
 * `Assets/Data/countries/<Country>`. Output filenames are kept stable (the app fetches
 * fixed `/data/*.csv` URLs), so reorganising the source tree never changes runtime paths.
 */
function syncDataCsvToPublic() {
  return {
    name: 'sync-data-csv-to-public',
    enforce: 'pre' as const,
    buildStart() {
      const dataDir = path.join(__dirname, 'Assets', 'Data');
      const destDir = path.join(__dirname, 'public', 'data');
      const germanyDir = path.join(dataDir, 'countries', 'Germany');

      fs.mkdirSync(destDir, { recursive: true });

      // Clear previously-mirrored CSVs (source of truth is Assets/Data).
      for (const name of fs.readdirSync(destDir)) {
        if (name.toLowerCase().endsWith('.csv')) fs.unlinkSync(path.join(destDir, name));
      }

      // Shared multi-country tables → copied verbatim (same filename).
      const sharedDir = path.join(dataDir, 'shared');
      if (fs.existsSync(sharedDir)) {
        for (const name of fs.readdirSync(sharedDir)) {
          if (name.toLowerCase().endsWith('.csv')) {
            fs.copyFileSync(path.join(sharedDir, name), path.join(destDir, name));
          }
        }
      }

      // Germany per-country CSVs → stable public/data names the app fetches at runtime.
      const csvCopies: ReadonlyArray<readonly [string, string]> = [
        [path.join(germanyDir, 'foreign_students.csv'), 'germany_foreign_students.csv'],
        [
          path.join(germanyDir, 'germany_populationpyramid_2024_treemap_labeled_items.csv'),
          'germany_immigration_treemap_labeled_items.csv',
        ],
        [path.join(germanyDir, 'germany_birth_health_indicators.csv'), 'germany_birth_health_indicators.csv'],
        [path.join(germanyDir, 'germany_migrant_crime_requested_metrics.csv'), 'germany_migrant_crime_requested_metrics.csv'],
        [path.join(germanyDir, 'germany_migrant_crime_additional_metrics.csv'), 'germany_migrant_crime_additional_metrics.csv'],
        [path.join(germanyDir, 'germany_labor_statistics.csv'), 'germany_labor_statistics.csv'],
        [path.join(germanyDir, 'news.csv'), 'news.csv'],
        [path.join(germanyDir, 'government', 'germany_government_politics.csv'), 'germany_government_politics.csv'],
        [path.join(germanyDir, 'economy', 'table.csv'), 'germany_economic_expenditure_table.csv'],
        [path.join(germanyDir, 'health', 'germany_health_statistics_basic.csv'), 'germany_health_statistics_basic.csv'],
        [path.join(germanyDir, 'health', 'germany_abortion_statistics.csv'), 'germany_abortion_statistics.csv'],
        [path.join(germanyDir, 'health', 'germany_gender_care_statistics.csv'), 'germany_gender_care_statistics.csv'],
      ];
      for (const [src, destName] of csvCopies) {
        if (fs.existsSync(src)) fs.copyFileSync(src, path.join(destDir, destName));
      }

      // Generated per-country dossier CSVs (scripts/generate-country-dossiers.mjs) →
      // served at /data/<iso3>_<section>.csv for every non-Germany country.
      const countriesDir = path.join(dataDir, 'countries');
      if (fs.existsSync(countriesDir)) {
        for (const countryName of fs.readdirSync(countriesDir)) {
          const genDir = path.join(countriesDir, countryName, 'generated');
          if (!fs.existsSync(genDir)) continue;
          for (const file of fs.readdirSync(genDir)) {
            if (file.toLowerCase().endsWith('.csv')) {
              fs.copyFileSync(path.join(genDir, file), path.join(destDir, file));
            }
          }
        }
      }

      // Hand-curated country news feeds override the generic generated reference links.
      const newsOverrides: ReadonlyArray<readonly [string, string]> = [
        [path.join(countriesDir, 'France', 'news.csv'), 'fra_news.csv'],
      ];
      for (const [src, destName] of newsOverrides) {
        if (fs.existsSync(src)) fs.copyFileSync(src, path.join(destDir, destName));
      }
    },
  };
}

function syncFlagsToPublic() {
  return {
    name: 'sync-flags-to-public',
    enforce: 'pre' as const,
    buildStart() {
      const srcDir = path.join(__dirname, 'Assets', 'Flags');
      const destDir = path.join(__dirname, 'public', 'flags');
      if (!fs.existsSync(srcDir)) {
        console.warn(`[vite] No flags at ${srcDir} — place PNGs in Assets/Flags.`);
        if (fs.existsSync(destDir)) {
          for (const name of fs.readdirSync(destDir)) {
            if (name.endsWith('.png')) fs.unlinkSync(path.join(destDir, name));
          }
        }
        return;
      }
      fs.mkdirSync(destDir, { recursive: true });
      for (const name of fs.readdirSync(destDir)) {
        // `force` so a file that vanished between the readdir and the unlink (a parallel build,
        // or the dev server restarting mid-sync) cannot take the whole server down with ENOENT.
        if (name.endsWith('.png')) fs.rmSync(path.join(destDir, name), { force: true });
      }
      for (const name of fs.readdirSync(srcDir)) {
        if (!name.toLowerCase().endsWith('.png')) continue;
        fs.copyFileSync(path.join(srcDir, name), path.join(destDir, name));
      }
    },
  };
}

function syncHeroAssetsToPublic() {
  return {
    name: 'sync-hero-assets-to-public',
    enforce: 'pre' as const,
    buildStart() {
      const destDir = path.join(__dirname, 'public', 'hero');
      fs.mkdirSync(destDir, { recursive: true });

      // Clear stale hero backdrops (source of truth is Assets/). Avoids shipping an older,
      // heavier format beside the optimized asset selected below.
      for (const name of fs.readdirSync(destDir)) {
        if (/^europe\.(avif|png|jpe?g|svg|webp)$/i.test(name)) fs.unlinkSync(path.join(destDir, name));
      }

      // Prefer the optimized AVIF backdrop, with older source formats as build-time fallbacks.
      const candidates = [
        { src: path.join(__dirname, 'Assets', 'europe.avif'), dest: 'europe.avif' },
        { src: path.join(__dirname, 'Assets', 'europe.jpg'), dest: 'europe.jpg' },
        { src: path.join(__dirname, 'Assets', 'europe.png'), dest: 'europe.png' },
        { src: path.join(__dirname, 'Assets', 'europe_countries.svg'), dest: 'europe.svg' },
        { src: path.join(__dirname, 'Assets', 'eu.svg'), dest: 'europe.svg' },
      ];

      for (const c of candidates) {
        if (!fs.existsSync(c.src)) continue;
        fs.copyFileSync(c.src, path.join(destDir, c.dest));
        break;
      }
    },
  };
}

/**
 * Serve `/api/geolocate` during `npm run dev`.
 *
 * The route only exists as a serverless function in production, so without this the Recon deep
 * scan would be a production-only feature — the one place it is least convenient to debug. It
 * mounts `api/geolocate.js` itself rather than re-implementing the forward: that handler is
 * written against plain Node `req`/`res` precisely so it can be reused here unchanged.
 *
 * The import is deferred to the first request so a syntax error in the handler surfaces as a
 * failed fetch rather than a dev server that will not boot.
 */
function osintGeolocateDevApi() {
  const handlerPath = pathToFileURL(path.join(__dirname, 'api', 'geolocate.js')).href;

  return {
    name: 'osint-geolocate-dev-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(
        '/api/geolocate',
        (req: IncomingMessage, res: ServerResponse, next: (err?: unknown) => void) => {
          void (async () => {
            try {
              const mod = await import(handlerPath);
              await mod.default(req, res);
            } catch (error) {
              next(error);
            }
          })();
        },
      );
    },
  };
}

function virtualFlagFilenames() {
  const flagsDir = path.join(__dirname, 'Assets', 'Flags');

  return {
    name: 'virtual-flag-filenames',
    enforce: 'pre' as const,
    resolveId(id: string) {
      if (id === VIRTUAL_FLAG_FILENAMES) return RESOLVED_VIRTUAL;
    },
    load(this: PluginContext, id: string) {
      if (id !== RESOLVED_VIRTUAL) return;
      const names = listFlagFilenames(flagsDir);
      for (const n of names) {
        this.addWatchFile(path.join(flagsDir, n));
      }
      // Do not addWatchFile(flagsDir): Vite import-analysis treats that path like an import and crashes.
      return `export const FLAG_FILENAMES = ${JSON.stringify(names)};`;
    },
    configureServer(server: ViteDevServer) {
      server.watcher.add(flagsDir);
      const invalidateVirtual = () => {
        const mod = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL);
        if (mod) server.moduleGraph.invalidateModule(mod, new Set(), Date.now(), true);
      };
      server.watcher.on('all', (_event: string, file: string | null) => {
        if (typeof file !== 'string') return;
        const rel = path.relative(flagsDir, file);
        if (!rel.startsWith('..') && !path.isAbsolute(rel)) {
          invalidateVirtual();
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    syncDataCsvToPublic(),
    syncFlagsToPublic(),
    syncHeroAssetsToPublic(),
    virtualFlagFilenames(),
    osintGeolocateDevApi(),
  ],
  optimizeDeps: {
    // Vite's esbuild pre-bundler scans satellite.js and trips over the top-level await in its
    // Emscripten pthreads build, which killed the dev server's dependency optimisation. The
    // package is only used inside a worker, where it does not need pre-bundling anyway.
    exclude: ['satellite.js'],
  },
  resolve: {
    alias: [
      // Keep satellite.js's optional Emscripten builds out of the browser bundle — see the stub.
      { find: '#wasm-single-thread', replacement: '/src/workers/satelliteWasmStub.ts' },
      { find: '#wasm-multi-thread', replacement: '/src/workers/satelliteWasmStub.ts' },
    ],
  },
  worker: {
    // The satellite propagator is a module worker, and satellite.js reaches its optional WASM
    // runtimes through dynamic imports that use top-level await — which Vite's default `iife`
    // worker format cannot represent. Those runtimes are never invoked (we only use the JS SGP4
    // entry points), but the format still has to be ES for the build to emit them.
    format: 'es',
  },
  build: {
    // Vite warns on raw bytes, which overstates the deferred MapLibre transport cost.
    // The post-build budget checks every compressed JS chunk and the initial JS payload.
    chunkSizeWarningLimit: 1100,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Recharts also reaches the shared class-name helpers. Give those tiny utilities an
          // explicit home or Rollup can absorb them into vendor-recharts, making every country
          // dossier download the full chart runtime just to evaluate `cn()`.
          if (
            id.includes('node_modules/clsx') ||
            id.includes('node_modules/tailwind-merge') ||
            id.includes('node_modules/class-variance-authority')
          ) {
            return 'vendor-ui-utils';
          }
          if (id.includes('node_modules/recharts')) return 'vendor-recharts';
          if (id.includes('node_modules/react-dom')) return 'vendor-react-dom';
          if (id.includes('node_modules/react')) return 'vendor-react';
        },
      },
    },
  },
});
