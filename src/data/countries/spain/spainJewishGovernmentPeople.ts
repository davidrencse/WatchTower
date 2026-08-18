import type { GermanyJewishGovernmentEntry } from '../germany/germanyJewishGovernmentPeople';

/**
 * Public-office profiles for which both the office and Jewish identity/background
 * are explicitly documented. Surname inference, rumours, and political affinity
 * with Israel are deliberately excluded.
 */
export const SPAIN_JEWISH_GOVERNMENT_PEOPLE: GermanyJewishGovernmentEntry[] = [
  {
    tier: 'federal',
    name: 'Enrique Múgica Herzog',
    position:
      'Defensor del Pueblo (Spanish Ombudsman), July 2000–June 2010; constitutional high commissioner elected by the Cortes Generales. Previously Minister of Justice (1988–1991).',
    background:
      'Publicly recalled discovering Jewish roots that his family had concealed out of fear, and described his subsequent commitment to Jewish and Israel-related causes. His cabinet service predates this dataset’s 2000 start, while both terms as Ombudsman fall inside it.',
    sourceNotes:
      'Office: Congreso de los Diputados, designation records (2000 and 2005) and Defensor del Pueblo reports. Background: FCJE account of his remarks at its 2 June 2008 event; Jewish Telegraphic Agency obituary, 4 May 2020.',
  },
  {
    tier: 'state',
    name: 'Maxo Benalal Bendrihem',
    position:
      'Member of the Parliament of the Balearic Islands for Ibiza, June 2019–April 2023; elected for Ciudadanos and later served as a non-attached deputy.',
    background:
      'Publicly identified as Sephardic Jewish. He has served as secretary general of the Federation of Jewish Communities of Spain and as vice-president of the Jewish Community of the Balearic Islands.',
    sourceNotes:
      'Office: Parliament of the Balearic Islands, 10th legislature records. Identity and communal roles: FCJE profile/interviews and La Voz de Ibiza, 10 Nov 2023.',
  },
];

export const SPAIN_JEWISH_GOVERNMENT_METHODOLOGY =
  'Inclusion requires reliable public documentation of both the office and the person’s Jewish identity or family background. A surname, an alleged converso line, support for Israel, work on Jewish history, or an unattributed ancestry claim is not treated as evidence. The supplied claims about Josep Borrell, Pablo Iglesias, Margarita Robles, Isabel Celaá, Fernando Grande-Marlaska, Arancha González Laya, Reyes Maroto, and the listed regional, media, business, and academic figures did not meet that standard and are not presented as fact.';
