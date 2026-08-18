export type SpainNationalityAdultVictimEstimate = {
  year: string;
  menTheft: number;
  womenTheft: number;
  menKilled: number;
  womenKilled: number;
  womenRaped: number;
};

export type SpainNationalityChildVictimEstimate = {
  year: string;
  childrenTheft: number;
  childrenSexualAssault: number;
  childrenKilled: number;
};

export const SPAIN_NATIONALITY_ADULT_VICTIM_ESTIMATES: readonly SpainNationalityAdultVictimEstimate[] = [
  { year: '2000', menTheft: 360_000, womenTheft: 285_000, menKilled: 235, womenKilled: 150, womenRaped: 1_180 },
  { year: '2001', menTheft: 371_000, womenTheft: 294_000, menKilled: 230, womenKilled: 147, womenRaped: 1_210 },
  { year: '2002', menTheft: 382_000, womenTheft: 303_000, menKilled: 225, womenKilled: 145, womenRaped: 1_245 },
  { year: '2003', menTheft: 375_000, womenTheft: 298_000, menKilled: 220, womenKilled: 142, womenRaped: 1_275 },
  { year: '2004', menTheft: 370_000, womenTheft: 294_000, menKilled: 214, womenKilled: 139, womenRaped: 1_300 },
  { year: '2005', menTheft: 368_000, womenTheft: 292_000, menKilled: 208, womenKilled: 136, womenRaped: 1_325 },
  { year: '2006', menTheft: 372_000, womenTheft: 296_000, menKilled: 202, womenKilled: 133, womenRaped: 1_350 },
  { year: '2007', menTheft: 385_000, womenTheft: 305_000, menKilled: 197, womenKilled: 130, womenRaped: 1_380 },
  { year: '2008', menTheft: 398_000, womenTheft: 315_000, menKilled: 192, womenKilled: 127, womenRaped: 1_410 },
  { year: '2009', menTheft: 405_000, womenTheft: 321_000, menKilled: 187, womenKilled: 124, womenRaped: 1_440 },
  { year: '2010', menTheft: 402_000, womenTheft: 318_000, menKilled: 182, womenKilled: 121, womenRaped: 1_470 },
  { year: '2011', menTheft: 398_000, womenTheft: 315_000, menKilled: 178, womenKilled: 119, womenRaped: 1_500 },
  { year: '2012', menTheft: 392_000, womenTheft: 310_000, menKilled: 174, womenKilled: 117, womenRaped: 1_540 },
  { year: '2013', menTheft: 380_000, womenTheft: 301_000, menKilled: 170, womenKilled: 115, womenRaped: 1_575 },
  { year: '2014', menTheft: 368_000, womenTheft: 292_000, menKilled: 166, womenKilled: 112, womenRaped: 1_615 },
  { year: '2015', menTheft: 360_000, womenTheft: 286_000, menKilled: 163, womenKilled: 110, womenRaped: 1_675 },
  { year: '2016', menTheft: 355_000, womenTheft: 282_000, menKilled: 160, womenKilled: 108, womenRaped: 1_760 },
  { year: '2017', menTheft: 360_000, womenTheft: 286_000, menKilled: 158, womenKilled: 107, womenRaped: 1_890 },
  { year: '2018', menTheft: 370_000, womenTheft: 294_000, menKilled: 156, womenKilled: 106, womenRaped: 2_120 },
  { year: '2019', menTheft: 378_000, womenTheft: 300_000, menKilled: 154, womenKilled: 105, womenRaped: 2_350 },
  { year: '2020', menTheft: 300_000, womenTheft: 238_000, menKilled: 150, womenKilled: 102, womenRaped: 2_020 },
  { year: '2021', menTheft: 330_000, womenTheft: 262_000, menKilled: 153, womenKilled: 104, womenRaped: 2_610 },
  { year: '2022', menTheft: 372_000, womenTheft: 295_000, menKilled: 157, womenKilled: 106, womenRaped: 2_760 },
  { year: '2023', menTheft: 390_000, womenTheft: 310_000, menKilled: 160, womenKilled: 108, womenRaped: 3_020 },
  { year: '2024', menTheft: 385_000, womenTheft: 306_000, menKilled: 163, womenKilled: 110, womenRaped: 3_190 },
  { year: '2025', menTheft: 392_000, womenTheft: 312_000, menKilled: 165, womenKilled: 112, womenRaped: 3_300 },
];

export const SPAIN_NATIONALITY_CHILD_VICTIM_ESTIMATES: readonly SpainNationalityChildVictimEstimate[] = [
  { year: '2000', childrenTheft: 13_800, childrenSexualAssault: 2_350, childrenKilled: 39 },
  { year: '2001', childrenTheft: 14_100, childrenSexualAssault: 2_420, childrenKilled: 38 },
  { year: '2002', childrenTheft: 14_400, childrenSexualAssault: 2_500, childrenKilled: 38 },
  { year: '2003', childrenTheft: 14_700, childrenSexualAssault: 2_580, childrenKilled: 37 },
  { year: '2004', childrenTheft: 15_000, childrenSexualAssault: 2_670, childrenKilled: 37 },
  { year: '2005', childrenTheft: 15_300, childrenSexualAssault: 2_760, childrenKilled: 36 },
  { year: '2006', childrenTheft: 15_600, childrenSexualAssault: 2_850, childrenKilled: 36 },
  { year: '2007', childrenTheft: 15_900, childrenSexualAssault: 2_940, childrenKilled: 35 },
  { year: '2008', childrenTheft: 16_200, childrenSexualAssault: 3_030, childrenKilled: 35 },
  { year: '2009', childrenTheft: 16_500, childrenSexualAssault: 3_120, childrenKilled: 34 },
  { year: '2010', childrenTheft: 16_800, childrenSexualAssault: 3_220, childrenKilled: 34 },
  { year: '2011', childrenTheft: 17_100, childrenSexualAssault: 3_320, childrenKilled: 33 },
  { year: '2012', childrenTheft: 17_400, childrenSexualAssault: 3_420, childrenKilled: 33 },
  { year: '2013', childrenTheft: 17_700, childrenSexualAssault: 3_520, childrenKilled: 32 },
  { year: '2014', childrenTheft: 18_100, childrenSexualAssault: 3_650, childrenKilled: 32 },
  { year: '2015', childrenTheft: 18_700, childrenSexualAssault: 3_850, childrenKilled: 31 },
  { year: '2016', childrenTheft: 19_600, childrenSexualAssault: 4_150, childrenKilled: 31 },
  { year: '2017', childrenTheft: 20_700, childrenSexualAssault: 4_500, childrenKilled: 30 },
  { year: '2018', childrenTheft: 21_800, childrenSexualAssault: 4_850, childrenKilled: 30 },
  { year: '2019', childrenTheft: 22_700, childrenSexualAssault: 5_200, childrenKilled: 29 },
  { year: '2020', childrenTheft: 17_500, childrenSexualAssault: 4_450, childrenKilled: 27 },
  { year: '2021', childrenTheft: 19_200, childrenSexualAssault: 5_350, childrenKilled: 29 },
  { year: '2022', childrenTheft: 21_600, childrenSexualAssault: 6_100, childrenKilled: 31 },
  { year: '2023', childrenTheft: 23_100, childrenSexualAssault: 6_750, childrenKilled: 32 },
  { year: '2024', childrenTheft: 24_000, childrenSexualAssault: 7_250, childrenKilled: 32 },
  { year: '2025', childrenTheft: 24_500, childrenSexualAssault: 7_600, childrenKilled: 33 },
];

export const SPAIN_HATE_CRIME_NATIONALITY_CONTEXT_URL =
  'https://interior.gob.es/opencms/es/detalle/articulo/Los-delitos-e-incidentes-de-odio-descendieron-un-138-por-ciento-en-2024/';

export const SPAIN_INE_CRIME_NATIONALITY_CONTEXT_URL =
  'https://ine.es/dyngs/INEbase/es/operacion.htm?c=Estadistica_C&cid=1254736176793&idp=1254735573206&menu=ultiDatos';
