import { GermanyMarriagesSection } from '../germany/GermanyMarriagesSection';
import { FRANCE_MARRIAGE_RATES_SERIES } from '../../../lib/countries/france/franceMarriageRates';
import {
  FRANCE_FEMALE_SERIES,
  FRANCE_LGBT_SERIES,
  FRANCE_MALE_SERIES,
} from '../../../lib/countries/france/franceMarriageDetail';

/**
 * France's marriage subsection. Wrapping the props here keeps France's marriage series in
 * France's chunk rather than the dashboard chunk every country downloads.
 */
export function FranceMarriagesSection() {
  return (
    <GermanyMarriagesSection
      marriageRatesSeries={FRANCE_MARRIAGE_RATES_SERIES}
      femaleSeries={FRANCE_FEMALE_SERIES}
      maleSeries={FRANCE_MALE_SERIES}
      lgbtSeries={FRANCE_LGBT_SERIES}
      nativeAdj="French"
    />
  );
}
