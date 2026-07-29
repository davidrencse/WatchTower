export type ItalyMonthlyNetIncomePoint = {
  year: number;
  italianCitizens: number;
  otherEuCitizens: number;
  nonEuCitizens: number;
};

/**
 * Italy — average net monthly pay for full-time employees, by citizenship.
 *
 * Source: Table 2.12 of the Italian Ministry of Labour's Seventh Annual
 * Report on Foreigners in the Italian Labour Market. The ministry's SAS
 * directorate produced the estimates from Istat Labour Force Survey (RCFL)
 * microdata. The report notes that this comparable series begins in 2010.
 *
 * These are published means, not medians. Italy's official series uses
 * citizenship groups rather than ethnic categories.
 */
export const ITALY_AVERAGE_MONTHLY_NET_PAY_TITLE =
  'Average Monthly Net Pay (€) by Citizenship, Full-Time Employees';

export const ITALY_AVERAGE_MONTHLY_NET_PAY_SOURCE_URL =
  'https://www.lavoro.gov.it/documenti-e-norme/studi-e-statistiche/Documents/Settimo%20Rapporto%20Annuale%20-%20Gli%20stranieri%20nel%20mercato%20del%20lavoro%20in%20Italia%202017/Settimo-Rapporto-Annuale-Gli-stranieri-nel-mercato-del-lavoro-in-Italia-DEF.pdf';

export const ITALY_AVERAGE_MONTHLY_NET_PAY_NOTE =
  'Italy · 2010–2016 · official estimates from Istat Labour Force Survey microdata (Ministry of Labour, Table 2.12). Mean—not median—net monthly pay; full-time employees only. Italy reports citizenship, not ethnicity.';

export const ITALY_AVERAGE_MONTHLY_NET_PAY_SERIES = [
  { key: 'italianCitizens', label: 'Italian citizens', color: '#64748b' },
  { key: 'otherEuCitizens', label: 'Other EU citizens', color: '#22d3ee' },
  { key: 'nonEuCitizens', label: 'Non-EU citizens', color: '#f59e0b' },
] as const;

export const ITALY_AVERAGE_MONTHLY_NET_PAY_BY_CITIZENSHIP: readonly ItalyMonthlyNetIncomePoint[] = [
  { year: 2010, italianCitizens: 1384, otherEuCitizens: 1133, nonEuCitizens: 1060 },
  { year: 2011, italianCitizens: 1402, otherEuCitizens: 1137, nonEuCitizens: 1080 },
  { year: 2012, italianCitizens: 1417, otherEuCitizens: 1133, nonEuCitizens: 1078 },
  { year: 2013, italianCitizens: 1430, otherEuCitizens: 1139, nonEuCitizens: 1088 },
  { year: 2014, italianCitizens: 1463, otherEuCitizens: 1159, nonEuCitizens: 1098 },
  { year: 2015, italianCitizens: 1486, otherEuCitizens: 1185, nonEuCitizens: 1111 },
  { year: 2016, italianCitizens: 1501, otherEuCitizens: 1203, nonEuCitizens: 1124 },
] as const;
