export type SpainGazaOpinionMetric = {
  label: string;
  value: string;
  detail: string;
};

export const SPAIN_GAZA_OPINION: readonly SpainGazaOpinionMetric[] = [
  {
    label: 'Support for Israel',
    value: '23%',
    detail: 'Down from 28% in the 2024 wave.',
  },
  {
    label: 'Calls the Gaza campaign genocide',
    value: '82%',
    detail: 'Agreement with Elcano’s survey statement.',
  },
  {
    label: 'Backs recognition of Palestine',
    value: '78%',
    detail: 'Spain formally recognised Palestine on 28 May 2024.',
  },
  {
    label: 'Backs EU sanctions on Israel',
    value: '70%',
    detail: 'May–June 2025 fieldwork.',
  },
  {
    label: 'Backs unconditional EU support for Israel',
    value: '15%',
    detail: 'The lowest-support statement in the question battery.',
  },
] as const;

export const SPAIN_TWO_STATE_SUPPORT_BY_GENDER = {
  menPct: 63,
  womenPct: 57,
  overallPct: 60,
} as const;

export const SPAIN_GAZA_OPINION_SOURCE = {
  label: 'Real Instituto Elcano — 45th barometer, May–June 2025',
  url: 'https://media.realinstitutoelcano.org/wp-content/uploads/2025/07/45brie-informe-julio2025.pdf',
} as const;
