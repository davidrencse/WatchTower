export const SPAIN_UKRAINE_SECURITY_OPINION = [
  {
    label: 'Europe should continue military support for Ukraine',
    value: '75%',
    detail: 'Unchanged from the 2024 Elcano wave.',
  },
  {
    label: 'Spain should send troops to guarantee Ukrainian security',
    value: '52%',
    detail: 'Asked as a post-conflict security guarantee.',
  },
  {
    label: 'Spain should remain in NATO',
    value: '85%',
    detail: 'Support reaches 77% even among respondents on the left.',
  },
  {
    label: 'Sympathy toward Ukraine',
    value: '6.7 / 10',
    detail: 'Compared with 3.7 / 10 for Russia.',
  },
] as const;

export const SPAIN_EXTERNAL_THREAT_BY_IDEOLOGY = [
  { bloc: 'Left', moroccoPct: 27, russiaPct: 42, unitedStatesPct: 34 },
  { bloc: 'Centre', moroccoPct: 56, russiaPct: 34, unitedStatesPct: 18 },
  { bloc: 'Right', moroccoPct: 73, russiaPct: 24, unitedStatesPct: 10 },
] as const;

export const SPAIN_UKRAINE_SECURITY_SOURCE = {
  label: 'Real Instituto Elcano — 45th barometer, May–June 2025',
  url: 'https://media.realinstitutoelcano.org/wp-content/uploads/2025/07/45brie-informe-julio2025.pdf',
} as const;
