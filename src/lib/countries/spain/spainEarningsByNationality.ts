export type SpainEarningsByNationalityPoint = {
  year: number;
  spanish: number;
  eu?: number;
  nonEuEurope?: number;
  america?: number;
  africa?: number;
  otherCountries?: number;
};

export const SPAIN_EARNINGS_BY_NATIONALITY_TITLE =
  'Average Gross Annual Earnings (€) by Nationality — INE Encuesta de Estructura Salarial';

export const SPAIN_EARNINGS_BY_NATIONALITY_NOTE =
  'Published figures, not a model. INE Encuesta Anual de Estructura Salarial, average gross annual ' +
  'earnings per worker, both sexes, national total. The EU27 and non-EU-Europe series begin in 2020 — ' +
  'before that INE published only a single "other countries" aggregate, which is carried throughout. ' +
  'These are gross earnings of employees, so they are not comparable with the net equivalised household ' +
  'income used in the distribution table above.';

export const SPAIN_EARNINGS_BY_NATIONALITY_SOURCE_URL =
  'https://www.ine.es/dyngs/INEbase/es/operacion.htm?c=Estadistica_C&cid=1254736177025&menu=ultiDatos&idp=1254735976596';

export const SPAIN_EARNINGS_BY_NATIONALITY_SERIES = [
  { key: 'spanish', label: 'Spanish nationality', color: '#64748b' },
  { key: 'eu', label: 'EU27 (excl. Spain)', color: '#22d3ee' },
  { key: 'nonEuEurope', label: 'Europe outside the EU27', color: '#a3e635' },
  { key: 'america', label: 'Americas', color: '#f59e0b' },
  { key: 'africa', label: 'Africa', color: '#f43f5e' },
  { key: 'otherCountries', label: 'All non-Spanish (aggregate)', color: '#c084fc', strokeDasharray: '5 3' },
] as const;

/**
 * Spain — average gross annual earnings by nationality group, euros, 2008–2024.
 *
 * Source: INE, Encuesta Anual de Estructura Salarial, table 28190 ("Sexo y nacionalidad"),
 * pulled from the INE Tempus API (`servicios.ine.es/wstempus`) on 10 Aug 2026. Every value
 * is a published INE figure; none is interpolated.
 *
 * Two caveats carried from the source:
 *  - INE flags low-reliability cells with a negative sign. The pre-2017 `otherCountries`
 *    values arrive flagged that way and are stored here as their absolute value; read them
 *    as indicative.
 *  - The EU27 / non-EU-Europe split only exists from 2020 onward. Earlier years leave those
 *    keys undefined so the chart draws a gap rather than inventing a level.
 *
 * For orientation, the 2024 national average across all workers was €29,540.
 */
export const SPAIN_EARNINGS_BY_NATIONALITY: readonly SpainEarningsByNationalityPoint[] = [
  { year: 2008, spanish: 22486, america: 13962, africa: 14745, otherCountries: 11897 },
  { year: 2009, spanish: 23019, america: 14158, africa: 15565, otherCountries: 11868 },
  { year: 2010, spanish: 23335, america: 14884, africa: 15387, otherCountries: 13965 },
  { year: 2011, spanish: 23429, america: 14894, africa: 15722, otherCountries: 12269 },
  { year: 2012, spanish: 23232, america: 14606, africa: 14938, otherCountries: 12440 },
  { year: 2013, spanish: 23181, america: 14235, africa: 14463, otherCountries: 11961 },
  { year: 2014, spanish: 23238, america: 15033, africa: 14870, otherCountries: 13455 },
  { year: 2015, spanish: 23543, america: 14650, africa: 14756, otherCountries: 12520 },
  { year: 2016, spanish: 23606, america: 14796, africa: 14083, otherCountries: 13409 },
  { year: 2017, spanish: 24117, america: 15284, africa: 14637, otherCountries: 13874 },
  { year: 2018, spanish: 24440, america: 16574, africa: 16315, otherCountries: 16443 },
  { year: 2019, spanish: 24936, america: 15794, africa: 16423, otherCountries: 16061 },
  { year: 2020, spanish: 25691, eu: 21936, nonEuEurope: 20049, america: 16101, africa: 16784, otherCountries: 16433 },
  { year: 2021, spanish: 26428, eu: 22839, nonEuEurope: 22599, america: 16747, africa: 17100, otherCountries: 16129 },
  { year: 2022, spanish: 27500, eu: 24865, nonEuEurope: 26283, america: 18215, africa: 18583, otherCountries: 18232 },
  { year: 2023, spanish: 28662, eu: 25951, nonEuEurope: 26572, america: 18726, africa: 18951, otherCountries: 18721 },
  { year: 2024, spanish: 30181, eu: 27846, nonEuEurope: 25673, america: 19906, africa: 20032, otherCountries: 20568 },
] as const;
