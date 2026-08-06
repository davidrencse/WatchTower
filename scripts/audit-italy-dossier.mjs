import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const failures = [];

function read(relativePath) {
  return readFileSync(resolve(root, relativePath), 'utf8');
}

function requireCondition(condition, message) {
  if (!condition) failures.push(message);
}

const selectedFlagView = read('src/components/SelectedFlagView.tsx');
requireCondition(
  !selectedFlagView.includes('FRANCE_SCAFFOLD_SLUGS'),
  'Italy must not be routed through the France scaffold.',
);
requireCondition(
  /iso3=\{iso3\}/.test(selectedFlagView),
  'The selected country ISO3 must be passed directly to CountryStatsDashboard.',
);

const dashboard = read('src/components/CountryStatsDashboard.tsx');
requireCondition(
  dashboard.includes("if (upper === 'ITA')"),
  'CountryStatsDashboard must have an Italy-native base-data branch.',
);
const zionism = read('src/lib/countries/italy/italyPoliticsZionism.ts');
const metricsBlock = zionism.match(
  /ITALY_ZIONISM_METRICS[\s\S]*?= \[([\s\S]*?)\] as const;/,
)?.[1] ?? '';
const metricCount = (metricsBlock.match(/\btitle:/g) ?? []).length;
const sourceCount = (metricsBlock.match(/\bsource:/g) ?? []).length;
requireCondition(metricCount === 12, `Expected 12 Italy Zionism metrics; found ${metricCount}.`);
requireCondition(
  sourceCount === metricCount,
  `Every Italy Zionism metric needs a source status; found ${sourceCount}/${metricCount}.`,
);
requireCondition(
  zionism.includes('ITALY_ZIONISM_EVIDENCE_NOTE') && zionism.includes('not independently verified'),
  'User-supplied estimates must carry an explicit unverified evidence note.',
);

const requiredDataFiles = [
  'ita_abortion_statistics.csv',
  'ita_gender_care_statistics.csv',
  'ita_government_politics.csv',
  'ita_health_statistics_basic.csv',
  'ita_immigration_treemap.csv',
  'ita_labor_statistics.csv',
  'ita_migrant_crime_additional_metrics.csv',
  'ita_migrant_crime_requested_metrics.csv',
  'ita_news.csv',
  'ita_population_pyramid.csv',
];

for (const filename of requiredDataFiles) {
  const publicPath = resolve(root, 'public/data', filename);
  const sourcePath = resolve(root, 'Assets/Data/countries/Italy/generated', filename);
  requireCondition(existsSync(publicPath) && statSync(publicPath).size > 0, `Missing public Italy data: ${filename}`);
  requireCondition(existsSync(sourcePath) && statSync(sourcePath).size > 0, `Missing generated Italy source data: ${filename}`);
}

if (failures.length > 0) {
  console.error(`Italy dossier audit failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Italy dossier audit passed: native ISO3, ${metricCount} Zionism metrics, evidence note, and ${requiredDataFiles.length} mirrored datasets.`);
}
