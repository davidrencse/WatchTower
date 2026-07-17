export type FranceRemittanceOutflowRow = {
  originGroup: string;
  remittances: number;
};

export const FRANCE_REMITTANCES_OUTFLOW_TITLE = 'Remittances Outflow by Immigrant Origin - France, 2025';

export const FRANCE_REMITTANCES_OUTFLOW_NOTE =
  'Research estimates scaling the World Bank/KNOMAD 2021 bilateral allocation pattern to an estimated €16.8 billion total French outflow in 2025.';

export const FRANCE_REMITTANCES_OUTFLOW_2025: readonly FranceRemittanceOutflowRow[] = [
  { originGroup: 'Moroccan', remittances: 3.1 },
  { originGroup: 'Algerian', remittances: 2.5 },
  { originGroup: 'Portuguese', remittances: 1.7 },
  { originGroup: 'Tunisian', remittances: 1.2 },
  { originGroup: 'Senegalese', remittances: 0.85 },
  { originGroup: 'Malian', remittances: 0.65 },
  { originGroup: 'Turkish', remittances: 0.55 },
  { originGroup: 'Chinese', remittances: 0.45 },
  { originGroup: 'Romanian', remittances: 0.38 },
  { originGroup: 'Ivorian', remittances: 0.36 },
  { originGroup: 'Cameroonian', remittances: 0.34 },
  { originGroup: 'Congolese (DRC)', remittances: 0.3 },
  { originGroup: 'Malagasy', remittances: 0.25 },
  { originGroup: 'Indian', remittances: 0.22 },
  { originGroup: 'Other', remittances: 3.9 },
] as const;
