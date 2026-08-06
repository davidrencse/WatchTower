import { GermanyImmigrationSection } from '../germany/GermanyImmigrationSection';
import { parseGermanyTreemapCsv } from '../../../lib/countries/germany/germanyImmigrationTreemapData';
import spainImmigrationTreemapCsvRaw from '../../../../Assets/Data/countries/Spain/generated/esp_immigration_treemap.csv?raw';

const SPAIN_IMMIGRATION_TREEMAP_ITEMS = parseGermanyTreemapCsv(spainImmigrationTreemapCsvRaw);

/** Spain's immigration subsection — keeps Spain's treemap CSV + parse out of the shared chunk. */
export function SpainImmigrationSection() {
  return (
    <GermanyImmigrationSection
      countryLabel="Spain"
      treemapItems={SPAIN_IMMIGRATION_TREEMAP_ITEMS}
      treemapNote="Immigrant stock by country of origin for Spain. Source metadata is retained in the generated Spain dossier CSV; unsupported Germany-template panels remain reference placeholders."
    />
  );
}
