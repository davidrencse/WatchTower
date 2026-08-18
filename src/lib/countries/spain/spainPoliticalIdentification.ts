export type SpainIdeologyBySexRow = {
  period: string;
  study: string;
  menLeftPct: number;
  menRightPct: number;
  womenLeftPct: number;
  womenRightPct: number;
  sourceUrl: string;
};

/**
 * Observed CIS ideology snapshots reconstructed from the published cross-tabs.
 *
 * CIS publishes the sample size for every 1–10 ideology cell and the male/female
 * composition of that cell. Multiplying those two values reconstructs the weighted
 * count by sex; dividing by the published total for each sex gives the shares below.
 * "Left" is positions 1–4 and "right" is 6–10. Position 5, NS and NC remain in the
 * denominator but in neither bloc. Published inputs are rounded to one decimal place,
 * so the derived shares should also be read to one decimal place.
 */
export const SPAIN_IDEOLOGY_BY_SEX: readonly SpainIdeologyBySexRow[] = [
  {
    period: 'Jan 25',
    study: 'CIS 3492',
    menLeftPct: 37.4,
    menRightPct: 35.9,
    womenLeftPct: 39.3,
    womenRightPct: 27.8,
    sourceUrl: 'https://www.cis.es/documents/d/guest/es3492creencias_a',
  },
  {
    period: 'Feb 25',
    study: 'CIS 3496',
    menLeftPct: 34.8,
    menRightPct: 36.3,
    womenLeftPct: 42.9,
    womenRightPct: 27.2,
    sourceUrl: 'https://www.cis.es/documents/d/guest/es3496creenciasMT_a',
  },
  {
    period: 'Apr 25',
    study: 'CIS 3505',
    menLeftPct: 39.7,
    menRightPct: 34.3,
    womenLeftPct: 40.9,
    womenRightPct: 28.7,
    sourceUrl: 'https://www.cis.es/documents/d/cis/es3505creencias_a',
  },
  {
    period: 'Jun 25',
    study: 'CIS 3522',
    menLeftPct: 39.3,
    menRightPct: 32.0,
    womenLeftPct: 39.4,
    womenRightPct: 30.1,
    sourceUrl: 'https://www.cis.es/documents/d/cis/es3522creencias_a',
  },
  {
    period: 'Oct 25',
    study: 'CIS 3528',
    menLeftPct: 42.7,
    menRightPct: 32.3,
    womenLeftPct: 45.5,
    womenRightPct: 27.5,
    sourceUrl: 'https://www.cis.es/documents/d/guest/es3528creencias_a',
  },
  {
    period: 'Dec 25',
    study: 'CIS 3536',
    menLeftPct: 42.3,
    menRightPct: 31.9,
    womenLeftPct: 44.1,
    womenRightPct: 27.9,
    sourceUrl: 'https://www.cis.es/documents/d/guest/es3536creencias_a-pdf',
  },
  {
    period: 'Jan 26',
    study: 'CIS 3540',
    menLeftPct: 41.7,
    menRightPct: 32.5,
    womenLeftPct: 43.9,
    womenRightPct: 28.0,
    sourceUrl: 'https://www.cis.es/documents/d/guest/es3540creencias_a-pdf',
  },
  {
    period: 'Feb 26',
    study: 'CIS 3544',
    menLeftPct: 39.9,
    menRightPct: 32.5,
    womenLeftPct: 43.4,
    womenRightPct: 28.3,
    sourceUrl: 'https://www.cis.es/documents/d/guest/es3544creenciasMT_a-pdf',
  },
  {
    period: 'Mar 26',
    study: 'CIS 3546',
    menLeftPct: 41.5,
    menRightPct: 32.4,
    womenLeftPct: 43.2,
    womenRightPct: 29.9,
    sourceUrl: 'https://www.cis.es/documents/d/guest/es3546creenciasMT_a-pdf',
  },
] as const;

export const SPAIN_IDEOLOGY_METHOD_NOTE =
  'Observed CIS cross-tabs, not a modeled trend. Shares are derived from each published ideology-cell sample size and its sex composition. Left = 1–4; right = 6–10; position 5 and non-response remain in the denominator but in neither bloc.';
