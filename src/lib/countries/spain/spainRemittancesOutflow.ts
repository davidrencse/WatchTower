export type SpainRemittanceOutflowRow = {
  originGroup: string;
  remittances: number;
};

export const SPAIN_REMITTANCES_OUTFLOW_TITLE =
  'Remittances Outflow by Destination Country — Spain, 2024';

export const SPAIN_REMITTANCES_OUTFLOW_NOTE =
  'Published figures, not a model. Banco de España balance-of-payments remittance payments by ' +
  'destination country, 2024: €11.46bn total, of which €6.85bn to the Americas. Colombia alone has ' +
  'grown 173% in ten years. Totals for context: €5.83bn (2014) · €8.13bn (2019) · €10.76bn (2023). ' +
  'Note these are destination countries, not the sender\'s nationality — the two differ where a ' +
  'diaspora has naturalised.';

export const SPAIN_REMITTANCES_OUTFLOW_SOURCE_URL =
  'https://www.bde.es/wbe/en/publicaciones/analisis-economico-investigacion/boletin-economico/2025t2-articulo-01-las-remesas-enviadas-desde-espana-hacia-america-latina-algunas-cifras-basicas.html';

/**
 * Spain — remittances sent abroad by destination country, € billions, 2024.
 * Source: Banco de España (balance of payments, secondary income), reported in its
 * Economic Bulletin 2025/Q2 article on remittances to Latin America and in the published
 * country detail for 2024. Retrieved 10 Aug 2026.
 *
 * The named countries are the published top ten; "Other destinations" is the residual
 * against the €11.46bn national total (11.46 − 8.207 = 3.253), not a separate figure.
 */
export const SPAIN_REMITTANCES_OUTFLOW_2024: readonly SpainRemittanceOutflowRow[] = [
  { originGroup: 'Colombia', remittances: 1.906 },
  { originGroup: 'Morocco', remittances: 1.502 },
  { originGroup: 'Ecuador', remittances: 0.956 },
  { originGroup: 'Dominican Republic', remittances: 0.688 },
  { originGroup: 'Peru', remittances: 0.606 },
  { originGroup: 'Paraguay', remittances: 0.604 },
  { originGroup: 'Honduras', remittances: 0.553 },
  { originGroup: 'Pakistan', remittances: 0.494 },
  { originGroup: 'Senegal', remittances: 0.478 },
  { originGroup: 'Bolivia', remittances: 0.42 },
  { originGroup: 'Other destinations', remittances: 3.253 },
] as const;
