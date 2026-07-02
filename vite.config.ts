import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
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
      const germanyDirPublic = path.join(__dirname, 'public', 'germany');
      const germanyDir = path.join(dataDir, 'countries', 'Germany');

      fs.mkdirSync(destDir, { recursive: true });
      fs.mkdirSync(germanyDirPublic, { recursive: true });

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

      // Germany images served from /germany/*.png.
      const imageCopies: ReadonlyArray<readonly [string, string]> = [
        [path.join(germanyDir, 'poppyra.png'), 'poppyra.png'],
        [path.join(germanyDir, 'government', 'politics.png'), 'politics.png'],
      ];
      for (const [src, destName] of imageCopies) {
        if (fs.existsSync(src)) fs.copyFileSync(src, path.join(germanyDirPublic, destName));
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
        if (name.endsWith('.png')) fs.unlinkSync(path.join(destDir, name));
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

      const candidates = [
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
  plugins: [react(), syncDataCsvToPublic(), syncFlagsToPublic(), syncHeroAssetsToPublic(), virtualFlagFilenames()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/recharts')) return 'vendor-recharts';
          if (id.includes('node_modules/react-dom')) return 'vendor-react-dom';
          if (id.includes('node_modules/react')) return 'vendor-react';
        },
      },
    },
  },
});
