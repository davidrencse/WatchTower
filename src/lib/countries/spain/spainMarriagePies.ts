export type SpainMarriagePieSlice = {
  name: string;
  value: number;
  fill: string;
};

export const SPAIN_FEMALE_MARRIAGE_PIE: readonly SpainMarriagePieSlice[] = [
  { name: 'Spanish F + Spanish M', value: 82.0, fill: '#22c55e' },
  { name: 'Spanish F + European (non-Spanish) M', value: 3.1, fill: '#f59e0b' },
  { name: 'Spanish F + African M', value: 1.7, fill: '#60a5fa' },
  { name: 'Spanish F + Arab / North African M', value: 1.3, fill: '#c084fc' },
  { name: 'Spanish F + Asian / Indian M', value: 0.5, fill: '#f43f5e' },
  { name: 'Spanish F + Latin American M', value: 3.0, fill: '#38bdf8' },
  { name: 'Other non-European spouse', value: 1.2, fill: '#f97316' },
  { name: 'Other marriages / foreign female / same-sex', value: 7.2, fill: '#737373' },
];

export const SPAIN_MALE_MARRIAGE_PIE: readonly SpainMarriagePieSlice[] = [
  { name: 'Spanish M + Spanish F', value: 82.0, fill: '#22c55e' },
  { name: 'Spanish M + European (non-Spanish) F', value: 3.7, fill: '#f59e0b' },
  { name: 'Spanish M + African F', value: 0.8, fill: '#60a5fa' },
  { name: 'Spanish M + Arab / North African F', value: 0.5, fill: '#c084fc' },
  { name: 'Spanish M + Asian / Indian F', value: 0.8, fill: '#f43f5e' },
  { name: 'Spanish M + Latin American F', value: 5.0, fill: '#38bdf8' },
  { name: 'Other non-European spouse', value: 1.4, fill: '#f97316' },
  { name: 'Other marriages / foreign male / same-sex', value: 5.8, fill: '#737373' },
];

export const SPAIN_MARRIAGES_BY_NATIONALITY_URL =
  'https://www.ine.es/jaxiT3/Tabla.htm?L=0&t=32002';

export const SPAIN_MARRIAGES_LATEST_DATA_URL =
  'https://www.ine.es/dyngs/INEbase/es/operacion.htm?c=Estadistica_C&cid=1254736176999&idp=1254735573002&menu=ultiDatos';
