export type ItalyRemittanceOutflowRow = {
  originGroup: string;
  remittances: number;
};

export const ITALY_REMITTANCES_OUTFLOW_TITLE = 'Remittances Outflow by Immigrant Origin - Italy, 2025';

export const ITALY_REMITTANCES_OUTFLOW_NOTE =
  'Banca d’Italia, 2025: €8.608bn sent through authorized payment institutions and other reporting intermediaries. The figures cover recorded person-to-person transfers settled in cash or similar instruments; informal channels and transfers through payer or beneficiary payment accounts are outside this series.';

/**
 * Sum of Banca d'Italia's four quarterly 2025 recipient-country observations,
 * converted from EUR millions to EUR billions. The 14 largest recipients are
 * shown individually; "Other" is the exact remainder across 233 countries and
 * territories.
 *
 * Source (workbook: trimestrali_paese):
 * https://www.bancaditalia.it/statistiche/tematiche/rapporti-estero/rimesse-immigrati/
 */
export const ITALY_REMITTANCES_OUTFLOW_2025: readonly ItalyRemittanceOutflowRow[] = [
  { originGroup: 'Bangladeshi', remittances: 1.685568 },
  { originGroup: 'Indian', remittances: 0.59402 },
  { originGroup: 'Moroccan', remittances: 0.579265 },
  { originGroup: 'Filipino', remittances: 0.566276 },
  { originGroup: 'Georgian', remittances: 0.539394 },
  { originGroup: 'Pakistani', remittances: 0.479346 },
  { originGroup: 'Sri Lankan', remittances: 0.399318 },
  { originGroup: 'Peruvian', remittances: 0.385406 },
  { originGroup: 'Romanian', remittances: 0.338377 },
  { originGroup: 'Senegalese', remittances: 0.309165 },
  { originGroup: 'Ukrainian', remittances: 0.214162 },
  { originGroup: 'Nigerian', remittances: 0.199451 },
  { originGroup: 'Egyptian', remittances: 0.187587 },
  { originGroup: 'Albanian', remittances: 0.174843 },
  { originGroup: 'Other', remittances: 1.955952 },
] as const;
