import type {
  MigrantArrivalsRow,
  MigrationBackgroundRow,
} from '../components/GermanyImmigrationSection';

/**
 * Foreign-born population resident in Italy.
 *
 * Eurostat publishes the comparable stock from 2002 onward (dataset migr_pop3ctb).
 * The 2000-2001 points are back-cast estimates so the shared chart can retain its
 * requested 2000-2025 span.
 */
export const ITALY_MIGRATION_BACKGROUND_BY_YEAR: readonly MigrationBackgroundRow[] = [
  { year: '2000', migrants: 1_930_000 },
  { year: '2001', migrants: 2_090_000 },
  { year: '2002', migrants: 2_261_729 },
  { year: '2003', migrants: 2_417_218 },
  { year: '2004', migrants: 2_817_326 },
  { year: '2005', migrants: 3_169_038 },
  { year: '2006', migrants: 3_384_810 },
  { year: '2007', migrants: 3_563_728 },
  { year: '2008', migrants: 3_989_058 },
  { year: '2009', migrants: 4_358_808 },
  { year: '2010', migrants: 4_597_046 },
  { year: '2011', migrants: 4_834_495 },
  { year: '2012', migrants: 5_022_967 },
  { year: '2013', migrants: 5_220_823 },
  { year: '2014', migrants: 5_355_018 },
  { year: '2015', migrants: 5_383_252 },
  { year: '2016', migrants: 5_656_510 },
  { year: '2017', migrants: 5_770_263 },
  { year: '2018', migrants: 5_888_837 },
  { year: '2019', migrants: 6_069_000 },
  { year: '2020', migrants: 6_161_391 },
  { year: '2021', migrants: 6_262_207 },
  { year: '2022', migrants: 6_161_003 },
  { year: '2023', migrants: 6_417_206 },
  { year: '2024', migrants: 6_673_604 },
  { year: '2025', migrants: 6_928_045 },
];

type ArrivalsInput = {
  year: string;
  total: number;
  europe: number;
  africa: number;
  estimated?: boolean;
};

/**
 * Immigration into Italy by citizenship region.
 *
 * Totals are Eurostat observations for 2000-2024. Europe/Africa are Eurostat
 * observations from 2008 onward; their 2000-2007 splits are estimates because
 * the harmonised continent aggregates are unavailable for those years.
 * 2025 is Istat provisional (about 440,000 total, 110,000 from Africa).
 */
const ITALY_ARRIVALS_INPUT: readonly ArrivalsInput[] = [
  { year: '2000', total: 226_968, europe: 150_000, africa: 45_000, estimated: true },
  { year: '2001', total: 208_252, europe: 137_000, africa: 42_000, estimated: true },
  { year: '2002', total: 213_202, europe: 143_000, africa: 41_000, estimated: true },
  { year: '2003', total: 440_301, europe: 327_000, africa: 65_000, estimated: true },
  { year: '2004', total: 414_880, europe: 302_000, africa: 64_000, estimated: true },
  { year: '2005', total: 304_960, europe: 218_000, africa: 51_000, estimated: true },
  { year: '2006', total: 279_714, europe: 194_000, africa: 50_000, estimated: true },
  { year: '2007', total: 527_123, europe: 390_000, africa: 75_000, estimated: true },
  { year: '2008', total: 534_712, europe: 353_990, africa: 75_831 },
  { year: '2009', total: 442_940, europe: 258_197, africa: 72_361 },
  { year: '2010', total: 458_856, europe: 251_314, africa: 75_669 },
  { year: '2011', total: 385_793, europe: 207_753, africa: 64_283 },
  { year: '2012', total: 350_772, europe: 179_630, africa: 65_025 },
  { year: '2013', total: 307_454, europe: 151_635, africa: 62_827 },
  { year: '2014', total: 277_631, europe: 132_416, africa: 57_644 },
  { year: '2015', total: 280_078, europe: 127_220, africa: 66_491 },
  { year: '2016', total: 300_823, europe: 134_519, africa: 78_666 },
  { year: '2017', total: 343_440, europe: 139_045, africa: 107_193 },
  { year: '2018', total: 332_324, europe: 142_300, africa: 89_866 },
  { year: '2019', total: 332_778, europe: 169_133, africa: 61_055 },
  { year: '2020', total: 247_526, europe: 135_170, africa: 45_878 },
  { year: '2021', total: 318_366, europe: 163_433, africa: 57_456 },
  { year: '2022', total: 410_985, europe: 200_562, africa: 71_572 },
  { year: '2023', total: 439_658, europe: 190_273, africa: 94_192 },
  { year: '2024', total: 451_583, europe: 169_765, africa: 113_572 },
  { year: '2025', total: 440_000, europe: 154_000, africa: 110_000, estimated: true },
];

const format = (value: number, approximate = false): string =>
  `${approximate ? '~' : ''}${value.toLocaleString('en-US')}`;

export const ITALY_MIGRANT_ARRIVALS_SERIES: readonly MigrantArrivalsRow[] =
  ITALY_ARRIVALS_INPUT.map((row) => {
    const nonEurope = row.total - row.europe;
    return {
      year: row.year,
      total: row.total,
      totalDisplay: format(row.total, row.estimated && row.year === '2025'),
      europe: row.europe,
      europeDisplay: format(row.europe, row.estimated),
      nonEurope,
      nonEuropeDisplay: format(nonEurope, row.estimated),
      africa: row.africa,
      africaDisplay: format(row.africa, row.estimated),
    };
  });

