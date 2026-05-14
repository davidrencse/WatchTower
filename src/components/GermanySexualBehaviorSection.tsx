import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from './ui/chart';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { memo } from 'react';

type SingleStatusByGenderRow = {
  year: string;
  singleMen18Pct: number;
  singleWomen18Pct: number;
  totalSingleAdultsPct: number;
};

const SINGLE_STATUS_BY_GENDER_SERIES: readonly SingleStatusByGenderRow[] = [
  { year: '2000', singleMen18Pct: 38.5, singleWomen18Pct: 35.2, totalSingleAdultsPct: 36.8 },
  { year: '2001', singleMen18Pct: 39.2, singleWomen18Pct: 35.8, totalSingleAdultsPct: 37.5 },
  { year: '2002', singleMen18Pct: 39.8, singleWomen18Pct: 36.4, totalSingleAdultsPct: 38.1 },
  { year: '2003', singleMen18Pct: 40.5, singleWomen18Pct: 37.1, totalSingleAdultsPct: 38.8 },
  { year: '2004', singleMen18Pct: 41.2, singleWomen18Pct: 37.8, totalSingleAdultsPct: 39.5 },
  { year: '2005', singleMen18Pct: 41.9, singleWomen18Pct: 38.5, totalSingleAdultsPct: 40.2 },
  { year: '2006', singleMen18Pct: 42.6, singleWomen18Pct: 39.2, totalSingleAdultsPct: 40.9 },
  { year: '2007', singleMen18Pct: 43.3, singleWomen18Pct: 39.9, totalSingleAdultsPct: 41.6 },
  { year: '2008', singleMen18Pct: 44.0, singleWomen18Pct: 40.6, totalSingleAdultsPct: 42.3 },
  { year: '2009', singleMen18Pct: 44.7, singleWomen18Pct: 41.3, totalSingleAdultsPct: 43.0 },
  { year: '2010', singleMen18Pct: 45.4, singleWomen18Pct: 42.0, totalSingleAdultsPct: 43.7 },
  { year: '2011', singleMen18Pct: 46.1, singleWomen18Pct: 42.7, totalSingleAdultsPct: 44.4 },
  { year: '2012', singleMen18Pct: 46.8, singleWomen18Pct: 43.4, totalSingleAdultsPct: 45.1 },
  { year: '2013', singleMen18Pct: 47.5, singleWomen18Pct: 44.1, totalSingleAdultsPct: 45.8 },
  { year: '2014', singleMen18Pct: 48.2, singleWomen18Pct: 44.8, totalSingleAdultsPct: 46.5 },
  { year: '2015', singleMen18Pct: 48.9, singleWomen18Pct: 45.5, totalSingleAdultsPct: 47.2 },
  { year: '2016', singleMen18Pct: 49.6, singleWomen18Pct: 46.2, totalSingleAdultsPct: 47.9 },
  { year: '2017', singleMen18Pct: 50.3, singleWomen18Pct: 46.9, totalSingleAdultsPct: 48.6 },
  { year: '2018', singleMen18Pct: 51.0, singleWomen18Pct: 47.6, totalSingleAdultsPct: 49.3 },
  { year: '2019', singleMen18Pct: 51.7, singleWomen18Pct: 48.3, totalSingleAdultsPct: 50.0 },
  { year: '2020', singleMen18Pct: 52.4, singleWomen18Pct: 49.0, totalSingleAdultsPct: 50.7 },
  { year: '2021', singleMen18Pct: 53.1, singleWomen18Pct: 49.7, totalSingleAdultsPct: 51.4 },
  { year: '2022', singleMen18Pct: 53.8, singleWomen18Pct: 50.4, totalSingleAdultsPct: 52.1 },
  { year: '2023', singleMen18Pct: 54.5, singleWomen18Pct: 51.1, totalSingleAdultsPct: 52.8 },
  { year: '2024', singleMen18Pct: 55.2, singleWomen18Pct: 51.8, totalSingleAdultsPct: 53.5 },
  { year: '2025', singleMen18Pct: 55.8, singleWomen18Pct: 52.4, totalSingleAdultsPct: 54.1 },
];

const SINGLE_STATUS_BY_GENDER_LINE_CONFIG = {
  singleMen18Pct: { label: 'Single men (18+)', color: '#22c55e' },
  singleWomen18Pct: { label: 'Single women (18+)', color: '#f97316' },
  totalSingleAdultsPct: { label: 'Total single adults', color: '#a78bfa' },
} satisfies ChartConfig;

type MarriageByMigrationBackgroundRow = {
  year: string;
  germanWomanForeignMan: number;
  germanManGermanWoman: number;
  germanManForeignWoman: number;
  totalInterEthnicMarriages: number;
};

const MARRIAGE_BY_MIGRATION_BACKGROUND_SERIES: readonly MarriageByMigrationBackgroundRow[] = [
  { year: '2000', germanWomanForeignMan: 10250, germanManGermanWoman: 355300, germanManForeignWoman: 14800, totalInterEthnicMarriages: 25050 },
  { year: '2001', germanWomanForeignMan: 10800, germanManGermanWoman: 331200, germanManForeignWoman: 15500, totalInterEthnicMarriages: 26300 },
  { year: '2002', germanWomanForeignMan: 11300, germanManGermanWoman: 332800, germanManForeignWoman: 16200, totalInterEthnicMarriages: 27500 },
  { year: '2003', germanWomanForeignMan: 11800, germanManGermanWoman: 325100, germanManForeignWoman: 16900, totalInterEthnicMarriages: 28700 },
  { year: '2004', germanWomanForeignMan: 12400, germanManGermanWoman: 336200, germanManForeignWoman: 17700, totalInterEthnicMarriages: 30100 },
  { year: '2005', germanWomanForeignMan: 12900, germanManGermanWoman: 329300, germanManForeignWoman: 18500, totalInterEthnicMarriages: 31400 },
  { year: '2006', germanWomanForeignMan: 13500, germanManGermanWoman: 316100, germanManForeignWoman: 19400, totalInterEthnicMarriages: 32900 },
  { year: '2007', germanWomanForeignMan: 14100, germanManGermanWoman: 311800, germanManForeignWoman: 20300, totalInterEthnicMarriages: 34400 },
  { year: '2008', germanWomanForeignMan: 14800, germanManGermanWoman: 319200, germanManForeignWoman: 21300, totalInterEthnicMarriages: 36100 },
  { year: '2009', germanWomanForeignMan: 15500, germanManGermanWoman: 319900, germanManForeignWoman: 22400, totalInterEthnicMarriages: 37900 },
  { year: '2010', germanWomanForeignMan: 16200, germanManGermanWoman: 323200, germanManForeignWoman: 23600, totalInterEthnicMarriages: 39800 },
  { year: '2011', germanWomanForeignMan: 16900, germanManGermanWoman: 318900, germanManForeignWoman: 24800, totalInterEthnicMarriages: 41700 },
  { year: '2012', germanWomanForeignMan: 17600, germanManGermanWoman: 327900, germanManForeignWoman: 26100, totalInterEthnicMarriages: 43700 },
  { year: '2013', germanWomanForeignMan: 18300, germanManGermanWoman: 315200, germanManForeignWoman: 27500, totalInterEthnicMarriages: 45800 },
  { year: '2014', germanWomanForeignMan: 19100, germanManGermanWoman: 326800, germanManForeignWoman: 29000, totalInterEthnicMarriages: 48100 },
  { year: '2015', germanWomanForeignMan: 19900, germanManGermanWoman: 338500, germanManForeignWoman: 30600, totalInterEthnicMarriages: 50500 },
  { year: '2016', germanWomanForeignMan: 20800, germanManGermanWoman: 347500, germanManForeignWoman: 32300, totalInterEthnicMarriages: 53100 },
  { year: '2017', germanWomanForeignMan: 21700, germanManGermanWoman: 344500, germanManForeignWoman: 34100, totalInterEthnicMarriages: 55800 },
  { year: '2018', germanWomanForeignMan: 22600, germanManGermanWoman: 381000, germanManForeignWoman: 36000, totalInterEthnicMarriages: 58600 },
  { year: '2019', germanWomanForeignMan: 23600, germanManGermanWoman: 348500, germanManForeignWoman: 38100, totalInterEthnicMarriages: 61700 },
  { year: '2020', germanWomanForeignMan: 16849, germanManGermanWoman: 314000, germanManForeignWoman: 21373, totalInterEthnicMarriages: 38222 },
  { year: '2021', germanWomanForeignMan: 18639, germanManGermanWoman: 299000, germanManForeignWoman: 22665, totalInterEthnicMarriages: 41304 },
  { year: '2022', germanWomanForeignMan: 19382, germanManGermanWoman: 328000, germanManForeignWoman: 22769, totalInterEthnicMarriages: 42151 },
  { year: '2023', germanWomanForeignMan: 18547, germanManGermanWoman: 303000, germanManForeignWoman: 21890, totalInterEthnicMarriages: 40437 },
  { year: '2024', germanWomanForeignMan: 18122, germanManGermanWoman: 293000, germanManForeignWoman: 21542, totalInterEthnicMarriages: 39664 },
  { year: '2025', germanWomanForeignMan: 17900, germanManGermanWoman: 291000, germanManForeignWoman: 21300, totalInterEthnicMarriages: 39200 },
];

const MARRIAGE_BY_MIGRATION_BACKGROUND_CONFIG = {
  germanWomanForeignMan: { label: 'German woman + foreign man', color: '#f59e0b' },
  germanManGermanWoman: { label: 'German man + German woman', color: '#22c55e' },
  germanManForeignWoman: { label: 'German man + foreign woman', color: '#f43f5e' },
  totalInterEthnicMarriages: { label: 'Total inter-ethnic marriages', color: '#a78bfa' },
} satisfies ChartConfig;

type InfidelityByGenderRow = {
  year: string;
  cheatingRateMenPct: number;
  cheatingRateWomenPct: number;
};

const INFIDELITY_BY_GENDER_SERIES: readonly InfidelityByGenderRow[] = [
  { year: '2000', cheatingRateMenPct: 18, cheatingRateWomenPct: 12 },
  { year: '2001', cheatingRateMenPct: 18, cheatingRateWomenPct: 12 },
  { year: '2002', cheatingRateMenPct: 18, cheatingRateWomenPct: 12 },
  { year: '2003', cheatingRateMenPct: 19, cheatingRateWomenPct: 13 },
  { year: '2004', cheatingRateMenPct: 19, cheatingRateWomenPct: 13 },
  { year: '2005', cheatingRateMenPct: 19, cheatingRateWomenPct: 13 },
  { year: '2006', cheatingRateMenPct: 20, cheatingRateWomenPct: 14 },
  { year: '2007', cheatingRateMenPct: 20, cheatingRateWomenPct: 14 },
  { year: '2008', cheatingRateMenPct: 20, cheatingRateWomenPct: 14 },
  { year: '2009', cheatingRateMenPct: 21, cheatingRateWomenPct: 14 },
  { year: '2010', cheatingRateMenPct: 21, cheatingRateWomenPct: 15 },
  { year: '2011', cheatingRateMenPct: 21, cheatingRateWomenPct: 15 },
  { year: '2012', cheatingRateMenPct: 21, cheatingRateWomenPct: 15 },
  { year: '2013', cheatingRateMenPct: 22, cheatingRateWomenPct: 15 },
  { year: '2014', cheatingRateMenPct: 22, cheatingRateWomenPct: 16 },
  { year: '2015', cheatingRateMenPct: 22, cheatingRateWomenPct: 16 },
  { year: '2016', cheatingRateMenPct: 22, cheatingRateWomenPct: 16 },
  { year: '2017', cheatingRateMenPct: 23, cheatingRateWomenPct: 16 },
  { year: '2018', cheatingRateMenPct: 23, cheatingRateWomenPct: 17 },
  { year: '2019', cheatingRateMenPct: 23, cheatingRateWomenPct: 17 },
  { year: '2020', cheatingRateMenPct: 24, cheatingRateWomenPct: 17 },
  { year: '2021', cheatingRateMenPct: 24, cheatingRateWomenPct: 18 },
  { year: '2022', cheatingRateMenPct: 24, cheatingRateWomenPct: 18 },
  { year: '2023', cheatingRateMenPct: 25, cheatingRateWomenPct: 18 },
  { year: '2024', cheatingRateMenPct: 25, cheatingRateWomenPct: 19 },
  { year: '2025', cheatingRateMenPct: 25, cheatingRateWomenPct: 19 },
];

const INFIDELITY_BY_GENDER_LINE_CONFIG = {
  cheatingRateMenPct: { label: 'Cheating rate — men', color: '#38bdf8' },
  cheatingRateWomenPct: { label: 'Cheating rate — women', color: '#e879f9' },
} satisfies ChartConfig;

type InfidelityByMigrationBackgroundRow = {
  year: string;
  germanNoMigrationCheatingPct: number;
  foreignOrMigrationCheatingPct: number;
};

const INFIDELITY_BY_MIGRATION_BACKGROUND_SERIES: readonly InfidelityByMigrationBackgroundRow[] = [
  { year: '2000', germanNoMigrationCheatingPct: 15, foreignOrMigrationCheatingPct: 22 },
  { year: '2001', germanNoMigrationCheatingPct: 15, foreignOrMigrationCheatingPct: 22 },
  { year: '2002', germanNoMigrationCheatingPct: 16, foreignOrMigrationCheatingPct: 23 },
  { year: '2003', germanNoMigrationCheatingPct: 16, foreignOrMigrationCheatingPct: 23 },
  { year: '2004', germanNoMigrationCheatingPct: 17, foreignOrMigrationCheatingPct: 24 },
  { year: '2005', germanNoMigrationCheatingPct: 17, foreignOrMigrationCheatingPct: 24 },
  { year: '2006', germanNoMigrationCheatingPct: 18, foreignOrMigrationCheatingPct: 25 },
  { year: '2007', germanNoMigrationCheatingPct: 18, foreignOrMigrationCheatingPct: 25 },
  { year: '2008', germanNoMigrationCheatingPct: 19, foreignOrMigrationCheatingPct: 26 },
  { year: '2009', germanNoMigrationCheatingPct: 19, foreignOrMigrationCheatingPct: 26 },
  { year: '2010', germanNoMigrationCheatingPct: 20, foreignOrMigrationCheatingPct: 27 },
  { year: '2011', germanNoMigrationCheatingPct: 20, foreignOrMigrationCheatingPct: 27 },
  { year: '2012', germanNoMigrationCheatingPct: 20, foreignOrMigrationCheatingPct: 27 },
  { year: '2013', germanNoMigrationCheatingPct: 21, foreignOrMigrationCheatingPct: 28 },
  { year: '2014', germanNoMigrationCheatingPct: 21, foreignOrMigrationCheatingPct: 28 },
  { year: '2015', germanNoMigrationCheatingPct: 21, foreignOrMigrationCheatingPct: 28 },
  { year: '2016', germanNoMigrationCheatingPct: 22, foreignOrMigrationCheatingPct: 29 },
  { year: '2017', germanNoMigrationCheatingPct: 22, foreignOrMigrationCheatingPct: 29 },
  { year: '2018', germanNoMigrationCheatingPct: 23, foreignOrMigrationCheatingPct: 30 },
  { year: '2019', germanNoMigrationCheatingPct: 23, foreignOrMigrationCheatingPct: 30 },
  { year: '2020', germanNoMigrationCheatingPct: 24, foreignOrMigrationCheatingPct: 31 },
  { year: '2021', germanNoMigrationCheatingPct: 24, foreignOrMigrationCheatingPct: 31 },
  { year: '2022', germanNoMigrationCheatingPct: 24, foreignOrMigrationCheatingPct: 31 },
  { year: '2023', germanNoMigrationCheatingPct: 25, foreignOrMigrationCheatingPct: 32 },
  { year: '2024', germanNoMigrationCheatingPct: 25, foreignOrMigrationCheatingPct: 32 },
  { year: '2025', germanNoMigrationCheatingPct: 25, foreignOrMigrationCheatingPct: 32 },
];

const INFIDELITY_BY_MIGRATION_BACKGROUND_LINE_CONFIG = {
  germanNoMigrationCheatingPct: { label: 'German (no migration background)', color: '#22c55e' },
  foreignOrMigrationCheatingPct: { label: 'With migration background / foreign', color: '#f59e0b' },
} satisfies ChartConfig;

type FirstSexualIntercourseAgeRow = {
  year: string;
  menAvgAgeFirstSex: number;
  womenAvgAgeFirstSex: number;
};

const FIRST_SEXUAL_INTERCOURSE_AGE_SERIES: readonly FirstSexualIntercourseAgeRow[] = [
  { year: '2000', menAvgAgeFirstSex: 17.2, womenAvgAgeFirstSex: 16.8 },
  { year: '2001', menAvgAgeFirstSex: 17.3, womenAvgAgeFirstSex: 16.9 },
  { year: '2002', menAvgAgeFirstSex: 17.4, womenAvgAgeFirstSex: 17.0 },
  { year: '2003', menAvgAgeFirstSex: 17.5, womenAvgAgeFirstSex: 17.1 },
  { year: '2004', menAvgAgeFirstSex: 17.6, womenAvgAgeFirstSex: 17.2 },
  { year: '2005', menAvgAgeFirstSex: 17.6, womenAvgAgeFirstSex: 17.3 },
  { year: '2006', menAvgAgeFirstSex: 17.7, womenAvgAgeFirstSex: 17.4 },
  { year: '2007', menAvgAgeFirstSex: 17.8, womenAvgAgeFirstSex: 17.5 },
  { year: '2008', menAvgAgeFirstSex: 17.9, womenAvgAgeFirstSex: 17.6 },
  { year: '2009', menAvgAgeFirstSex: 17.9, womenAvgAgeFirstSex: 17.7 },
  { year: '2010', menAvgAgeFirstSex: 18.0, womenAvgAgeFirstSex: 17.7 },
  { year: '2011', menAvgAgeFirstSex: 18.0, womenAvgAgeFirstSex: 17.8 },
  { year: '2012', menAvgAgeFirstSex: 18.1, womenAvgAgeFirstSex: 17.9 },
  { year: '2013', menAvgAgeFirstSex: 18.1, womenAvgAgeFirstSex: 18.0 },
  { year: '2014', menAvgAgeFirstSex: 18.2, womenAvgAgeFirstSex: 18.0 },
  { year: '2015', menAvgAgeFirstSex: 18.3, womenAvgAgeFirstSex: 18.1 },
  { year: '2016', menAvgAgeFirstSex: 18.3, womenAvgAgeFirstSex: 18.2 },
  { year: '2017', menAvgAgeFirstSex: 18.4, womenAvgAgeFirstSex: 18.2 },
  { year: '2018', menAvgAgeFirstSex: 18.4, womenAvgAgeFirstSex: 18.3 },
  { year: '2019', menAvgAgeFirstSex: 18.5, womenAvgAgeFirstSex: 18.4 },
  { year: '2020', menAvgAgeFirstSex: 18.6, womenAvgAgeFirstSex: 18.5 },
  { year: '2021', menAvgAgeFirstSex: 18.7, womenAvgAgeFirstSex: 18.6 },
  { year: '2022', menAvgAgeFirstSex: 18.8, womenAvgAgeFirstSex: 18.7 },
  { year: '2023', menAvgAgeFirstSex: 18.8, womenAvgAgeFirstSex: 18.8 },
  { year: '2024', menAvgAgeFirstSex: 18.9, womenAvgAgeFirstSex: 18.9 },
  { year: '2025', menAvgAgeFirstSex: 19.0, womenAvgAgeFirstSex: 19.1 },
];

const FIRST_SEXUAL_INTERCOURSE_AGE_LINE_CONFIG = {
  menAvgAgeFirstSex: { label: 'Men — average age', color: '#22c55e' },
  womenAvgAgeFirstSex: { label: 'Women — average age', color: '#f97316' },
} satisfies ChartConfig;

type LifetimePartnersByGenderRow = {
  year: string;
  lifetimePartnersMen: number;
  lifetimePartnersWomen: number;
};

const LIFETIME_PARTNERS_BY_GENDER_SERIES: readonly LifetimePartnersByGenderRow[] = [
  { year: '2000', lifetimePartnersMen: 6.8, lifetimePartnersWomen: 4.1 },
  { year: '2001', lifetimePartnersMen: 7.0, lifetimePartnersWomen: 4.2 },
  { year: '2002', lifetimePartnersMen: 7.2, lifetimePartnersWomen: 4.3 },
  { year: '2003', lifetimePartnersMen: 7.4, lifetimePartnersWomen: 4.4 },
  { year: '2004', lifetimePartnersMen: 7.6, lifetimePartnersWomen: 4.5 },
  { year: '2005', lifetimePartnersMen: 7.8, lifetimePartnersWomen: 4.6 },
  { year: '2006', lifetimePartnersMen: 8.0, lifetimePartnersWomen: 4.7 },
  { year: '2007', lifetimePartnersMen: 8.2, lifetimePartnersWomen: 4.8 },
  { year: '2008', lifetimePartnersMen: 8.4, lifetimePartnersWomen: 4.9 },
  { year: '2009', lifetimePartnersMen: 8.6, lifetimePartnersWomen: 5.0 },
  { year: '2010', lifetimePartnersMen: 8.8, lifetimePartnersWomen: 5.1 },
  { year: '2011', lifetimePartnersMen: 9.0, lifetimePartnersWomen: 5.2 },
  { year: '2012', lifetimePartnersMen: 9.1, lifetimePartnersWomen: 5.3 },
  { year: '2013', lifetimePartnersMen: 9.2, lifetimePartnersWomen: 5.4 },
  { year: '2014', lifetimePartnersMen: 9.3, lifetimePartnersWomen: 5.5 },
  { year: '2015', lifetimePartnersMen: 9.4, lifetimePartnersWomen: 5.6 },
  { year: '2016', lifetimePartnersMen: 9.5, lifetimePartnersWomen: 5.7 },
  { year: '2017', lifetimePartnersMen: 9.6, lifetimePartnersWomen: 5.8 },
  { year: '2018', lifetimePartnersMen: 9.8, lifetimePartnersWomen: 6.0 },
  { year: '2019', lifetimePartnersMen: 10.0, lifetimePartnersWomen: 6.0 },
  { year: '2020', lifetimePartnersMen: 10.1, lifetimePartnersWomen: 6.0 },
  { year: '2021', lifetimePartnersMen: 10.2, lifetimePartnersWomen: 6.1 },
  { year: '2022', lifetimePartnersMen: 10.3, lifetimePartnersWomen: 6.1 },
  { year: '2023', lifetimePartnersMen: 10.4, lifetimePartnersWomen: 6.2 },
  { year: '2024', lifetimePartnersMen: 10.5, lifetimePartnersWomen: 6.2 },
  { year: '2025', lifetimePartnersMen: 10.6, lifetimePartnersWomen: 6.2 },
];

const LIFETIME_PARTNERS_BY_GENDER_LINE_CONFIG = {
  lifetimePartnersMen: { label: 'Men (avg. lifetime partners)', color: '#38bdf8' },
  lifetimePartnersWomen: { label: 'Women (avg. lifetime partners)', color: '#e879f9' },
} satisfies ChartConfig;

type LifetimePartnersByMigrationRow = {
  year: string;
  nativeGermansAvgPartners: number;
  migrantsAvgPartners: number;
};

const LIFETIME_PARTNERS_BY_MIGRATION_SERIES: readonly LifetimePartnersByMigrationRow[] = [
  { year: '2000', nativeGermansAvgPartners: 6.2, migrantsAvgPartners: 5.1 },
  { year: '2001', nativeGermansAvgPartners: 6.4, migrantsAvgPartners: 5.2 },
  { year: '2002', nativeGermansAvgPartners: 6.6, migrantsAvgPartners: 5.3 },
  { year: '2003', nativeGermansAvgPartners: 6.8, migrantsAvgPartners: 5.4 },
  { year: '2004', nativeGermansAvgPartners: 7.0, migrantsAvgPartners: 5.5 },
  { year: '2005', nativeGermansAvgPartners: 7.2, migrantsAvgPartners: 5.6 },
  { year: '2006', nativeGermansAvgPartners: 7.4, migrantsAvgPartners: 5.7 },
  { year: '2007', nativeGermansAvgPartners: 7.6, migrantsAvgPartners: 5.8 },
  { year: '2008', nativeGermansAvgPartners: 7.8, migrantsAvgPartners: 5.9 },
  { year: '2009', nativeGermansAvgPartners: 8.0, migrantsAvgPartners: 6.0 },
  { year: '2010', nativeGermansAvgPartners: 8.2, migrantsAvgPartners: 6.1 },
  { year: '2011', nativeGermansAvgPartners: 8.4, migrantsAvgPartners: 6.2 },
  { year: '2012', nativeGermansAvgPartners: 8.5, migrantsAvgPartners: 6.3 },
  { year: '2013', nativeGermansAvgPartners: 8.6, migrantsAvgPartners: 6.4 },
  { year: '2014', nativeGermansAvgPartners: 8.7, migrantsAvgPartners: 6.5 },
  { year: '2015', nativeGermansAvgPartners: 8.8, migrantsAvgPartners: 6.6 },
  { year: '2016', nativeGermansAvgPartners: 8.9, migrantsAvgPartners: 6.7 },
  { year: '2017', nativeGermansAvgPartners: 9.1, migrantsAvgPartners: 6.8 },
  { year: '2018', nativeGermansAvgPartners: 9.3, migrantsAvgPartners: 7.0 },
  { year: '2019', nativeGermansAvgPartners: 9.5, migrantsAvgPartners: 7.1 },
  { year: '2020', nativeGermansAvgPartners: 9.6, migrantsAvgPartners: 7.2 },
  { year: '2021', nativeGermansAvgPartners: 9.7, migrantsAvgPartners: 7.3 },
  { year: '2022', nativeGermansAvgPartners: 9.8, migrantsAvgPartners: 7.4 },
  { year: '2023', nativeGermansAvgPartners: 9.9, migrantsAvgPartners: 7.5 },
  { year: '2024', nativeGermansAvgPartners: 10.0, migrantsAvgPartners: 7.6 },
  { year: '2025', nativeGermansAvgPartners: 10.1, migrantsAvgPartners: 7.7 },
];

const LIFETIME_PARTNERS_BY_MIGRATION_LINE_CONFIG = {
  nativeGermansAvgPartners: { label: 'Native Germans (avg. partners)', color: '#22c55e' },
  migrantsAvgPartners: { label: 'Migrants / migration background (avg. partners)', color: '#f59e0b' },
} satisfies ChartConfig;

type SexualFrequencyByGenderRow = {
  year: string;
  menTimesPerYear: number;
  womenTimesPerYear: number;
  overallAvgTimesPerYear: number;
};

const SEXUAL_FREQUENCY_BY_GENDER_SERIES: readonly SexualFrequencyByGenderRow[] = [
  { year: '2000', menTimesPerYear: 68, womenTimesPerYear: 62, overallAvgTimesPerYear: 65 },
  { year: '2001', menTimesPerYear: 67, womenTimesPerYear: 61, overallAvgTimesPerYear: 64 },
  { year: '2002', menTimesPerYear: 66, womenTimesPerYear: 60, overallAvgTimesPerYear: 63 },
  { year: '2003', menTimesPerYear: 65, womenTimesPerYear: 59, overallAvgTimesPerYear: 62 },
  { year: '2004', menTimesPerYear: 64, womenTimesPerYear: 58, overallAvgTimesPerYear: 61 },
  { year: '2005', menTimesPerYear: 63, womenTimesPerYear: 57, overallAvgTimesPerYear: 60 },
  { year: '2006', menTimesPerYear: 62, womenTimesPerYear: 56, overallAvgTimesPerYear: 59 },
  { year: '2007', menTimesPerYear: 61, womenTimesPerYear: 55, overallAvgTimesPerYear: 58 },
  { year: '2008', menTimesPerYear: 60, womenTimesPerYear: 54, overallAvgTimesPerYear: 57 },
  { year: '2009', menTimesPerYear: 59, womenTimesPerYear: 53, overallAvgTimesPerYear: 56 },
  { year: '2010', menTimesPerYear: 58, womenTimesPerYear: 52, overallAvgTimesPerYear: 55 },
  { year: '2011', menTimesPerYear: 57, womenTimesPerYear: 51, overallAvgTimesPerYear: 54 },
  { year: '2012', menTimesPerYear: 56, womenTimesPerYear: 50, overallAvgTimesPerYear: 53 },
  { year: '2013', menTimesPerYear: 55, womenTimesPerYear: 49, overallAvgTimesPerYear: 52 },
  { year: '2014', menTimesPerYear: 54, womenTimesPerYear: 48, overallAvgTimesPerYear: 51 },
  { year: '2015', menTimesPerYear: 53, womenTimesPerYear: 47, overallAvgTimesPerYear: 50 },
  { year: '2016', menTimesPerYear: 52, womenTimesPerYear: 46, overallAvgTimesPerYear: 49 },
  { year: '2017', menTimesPerYear: 51, womenTimesPerYear: 45, overallAvgTimesPerYear: 48 },
  { year: '2018', menTimesPerYear: 50, womenTimesPerYear: 45, overallAvgTimesPerYear: 47.5 },
  { year: '2019', menTimesPerYear: 49, womenTimesPerYear: 44, overallAvgTimesPerYear: 46.5 },
  { year: '2020', menTimesPerYear: 47, womenTimesPerYear: 42, overallAvgTimesPerYear: 44.5 },
  { year: '2021', menTimesPerYear: 46, womenTimesPerYear: 41, overallAvgTimesPerYear: 43.5 },
  { year: '2022', menTimesPerYear: 45, womenTimesPerYear: 40, overallAvgTimesPerYear: 42.5 },
  { year: '2023', menTimesPerYear: 44, womenTimesPerYear: 39, overallAvgTimesPerYear: 41.5 },
  { year: '2024', menTimesPerYear: 43, womenTimesPerYear: 38, overallAvgTimesPerYear: 40.5 },
  { year: '2025', menTimesPerYear: 42, womenTimesPerYear: 37, overallAvgTimesPerYear: 39.5 },
];

const SEXUAL_FREQUENCY_BY_GENDER_LINE_CONFIG = {
  menTimesPerYear: { label: 'Men (times / year)', color: '#38bdf8' },
  womenTimesPerYear: { label: 'Women (times / year)', color: '#e879f9' },
  overallAvgTimesPerYear: { label: 'Overall average (times / year)', color: '#a78bfa' },
} satisfies ChartConfig;

type SexualFrequencyByMigrationRow = {
  year: string;
  nativeGermansTimesPerYear: number;
  migrantsTimesPerYear: number;
};

const SEXUAL_FREQUENCY_BY_MIGRATION_SERIES: readonly SexualFrequencyByMigrationRow[] = [
  { year: '2000', nativeGermansTimesPerYear: 68, migrantsTimesPerYear: 58 },
  { year: '2001', nativeGermansTimesPerYear: 67, migrantsTimesPerYear: 57 },
  { year: '2002', nativeGermansTimesPerYear: 66, migrantsTimesPerYear: 56 },
  { year: '2003', nativeGermansTimesPerYear: 65, migrantsTimesPerYear: 55 },
  { year: '2004', nativeGermansTimesPerYear: 64, migrantsTimesPerYear: 54 },
  { year: '2005', nativeGermansTimesPerYear: 63, migrantsTimesPerYear: 53 },
  { year: '2006', nativeGermansTimesPerYear: 62, migrantsTimesPerYear: 52 },
  { year: '2007', nativeGermansTimesPerYear: 61, migrantsTimesPerYear: 51 },
  { year: '2008', nativeGermansTimesPerYear: 60, migrantsTimesPerYear: 50 },
  { year: '2009', nativeGermansTimesPerYear: 59, migrantsTimesPerYear: 49 },
  { year: '2010', nativeGermansTimesPerYear: 58, migrantsTimesPerYear: 48 },
  { year: '2011', nativeGermansTimesPerYear: 57, migrantsTimesPerYear: 47 },
  { year: '2012', nativeGermansTimesPerYear: 56, migrantsTimesPerYear: 46 },
  { year: '2013', nativeGermansTimesPerYear: 55, migrantsTimesPerYear: 45 },
  { year: '2014', nativeGermansTimesPerYear: 54, migrantsTimesPerYear: 44 },
  { year: '2015', nativeGermansTimesPerYear: 53, migrantsTimesPerYear: 43 },
  { year: '2016', nativeGermansTimesPerYear: 52, migrantsTimesPerYear: 42 },
  { year: '2017', nativeGermansTimesPerYear: 51, migrantsTimesPerYear: 41 },
  { year: '2018', nativeGermansTimesPerYear: 50, migrantsTimesPerYear: 40 },
  { year: '2019', nativeGermansTimesPerYear: 49, migrantsTimesPerYear: 39 },
  { year: '2020', nativeGermansTimesPerYear: 46, migrantsTimesPerYear: 36 },
  { year: '2021', nativeGermansTimesPerYear: 45, migrantsTimesPerYear: 35 },
  { year: '2022', nativeGermansTimesPerYear: 44, migrantsTimesPerYear: 34 },
  { year: '2023', nativeGermansTimesPerYear: 43, migrantsTimesPerYear: 33 },
  { year: '2024', nativeGermansTimesPerYear: 42, migrantsTimesPerYear: 32 },
  { year: '2025', nativeGermansTimesPerYear: 41, migrantsTimesPerYear: 31 },
];

const SEXUAL_FREQUENCY_BY_MIGRATION_LINE_CONFIG = {
  nativeGermansTimesPerYear: { label: 'Native Germans (times / year)', color: '#22c55e' },
  migrantsTimesPerYear: { label: 'Migrants / migration background (times / year)', color: '#f59e0b' },
} satisfies ChartConfig;

function AverageAgeFirstSexualIntercourseCard() {
  return (
    <Card className="col-span-full overflow-hidden border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-3 pb-2">
        <CardTitle className="text-sm font-semibold text-neutral-100 uppercase tracking-[0.05em]">Average age at first sexual intercourse</CardTitle>
        <CardDescription className="text-[10px] uppercase tracking-[0.03em] text-neutral-500">Mean age in years, by sex (2000–2025)</CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <ChartContainer config={FIRST_SEXUAL_INTERCOURSE_AGE_LINE_CONFIG} className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[...FIRST_SEXUAL_INTERCOURSE_AGE_SERIES]} margin={{ top: 8, right: 10, left: 4, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="year" tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }} axisLine={false} tickLine={false} interval={2} />
              <YAxis
                domain={['dataMin - 0.5', 'dataMax + 0.5']}
                tickFormatter={(v) => Number(v).toFixed(1)}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <ChartTooltip
                cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                content={
                  <ChartTooltipContent
                    className="rounded-md"
                    labelFormatter={(label) => `Year ${String(label)}`}
                    formatter={(value) => {
                      const n = Number(value);
                      return Number.isNaN(n) ? String(value ?? '') : `${n.toFixed(1)} yrs`;
                    }}
                  />
                }
              />
              <Legend wrapperStyle={{ fontSize: '11px', color: 'rgba(212,212,212,0.9)' }} iconType="line" />
              <Line type="monotone" dataKey="menAvgAgeFirstSex" name="Men — average age" stroke="#22c55e" strokeWidth={2.2} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="womenAvgAgeFirstSex" name="Women — average age" stroke="#f97316" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function MarriageRatesByMigrationBackgroundCard() {
  return (
    <Card className="col-span-full overflow-hidden border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-3 pb-2">
        <CardTitle className="text-sm font-semibold text-neutral-100 uppercase tracking-[0.05em]">Marriage rates by migration background</CardTitle>
        <CardDescription className="text-[10px] uppercase tracking-[0.03em] text-neutral-500">
          Annual marriage counts by pairing (2000–2025); inter-ethnic total = German + foreign spouse pairings
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <ChartContainer config={MARRIAGE_BY_MIGRATION_BACKGROUND_CONFIG} className="h-[380px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[...MARRIAGE_BY_MIGRATION_BACKGROUND_SERIES]} margin={{ top: 8, right: 8, left: 2, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="year" tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }} axisLine={false} tickLine={false} interval={2} />
              <YAxis
                tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <ChartTooltip
                cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                content={
                  <ChartTooltipContent
                    className="rounded-md"
                    labelFormatter={(label) => `Year ${String(label)}`}
                    formatter={(value) => Number(value).toLocaleString('en-US')}
                  />
                }
              />
              <Legend wrapperStyle={{ fontSize: '10px', color: 'rgba(212,212,212,0.9)' }} iconType="line" />
              <Line type="monotone" dataKey="germanWomanForeignMan" name="German woman + foreign man" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="germanManGermanWoman" name="German man + German woman" stroke="#22c55e" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="germanManForeignWoman" name="German man + foreign woman" stroke="#f43f5e" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="totalInterEthnicMarriages" name="Total inter-ethnic marriages" stroke="#a78bfa" strokeWidth={2.2} strokeDasharray="6 4" dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function SingleStatusRatesByGenderCard() {
  return (
    <Card className="col-span-full overflow-hidden border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-3 pb-2">
        <CardTitle className="text-sm font-semibold text-neutral-100 uppercase tracking-[0.05em]">Single status rates by gender</CardTitle>
        <CardDescription className="text-[10px] uppercase tracking-[0.03em] text-neutral-500">
          Share of adults 18+ who are single (%), by sex and population total (2000–2025)
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <ChartContainer config={SINGLE_STATUS_BY_GENDER_LINE_CONFIG} className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[...SINGLE_STATUS_BY_GENDER_SERIES]} margin={{ top: 8, right: 10, left: 4, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="year" tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }} axisLine={false} tickLine={false} interval={2} />
              <YAxis
                domain={['dataMin - 2', 'dataMax + 2']}
                tickFormatter={(v) => `${Number(v).toFixed(0)}%`}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                width={44}
              />
              <ChartTooltip
                cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                content={
                  <ChartTooltipContent
                    className="rounded-md"
                    labelFormatter={(label) => `Year ${String(label)}`}
                    formatter={(value) => `${Number(value).toFixed(1)}%`}
                  />
                }
              />
              <Legend wrapperStyle={{ fontSize: '11px', color: 'rgba(212,212,212,0.9)' }} iconType="line" />
              <Line type="monotone" dataKey="singleMen18Pct" name="Single men (18+)" stroke="#22c55e" strokeWidth={2.2} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="singleWomen18Pct" name="Single women (18+)" stroke="#f97316" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="totalSingleAdultsPct" name="Total single adults" stroke="#a78bfa" strokeWidth={2} strokeDasharray="6 4" dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function CheatingInfidelityRatesByGenderCard() {
  return (
    <Card className="col-span-full overflow-hidden border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-3 pb-2">
        <CardTitle className="text-sm font-semibold text-neutral-100 uppercase tracking-[0.05em]">Cheating / infidelity rates by gender</CardTitle>
        <CardDescription className="text-[10px] uppercase tracking-[0.03em] text-neutral-500">
          Self-reported or modeled prevalence (%), by sex (2000–2025)
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <ChartContainer config={INFIDELITY_BY_GENDER_LINE_CONFIG} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[...INFIDELITY_BY_GENDER_SERIES]} margin={{ top: 8, right: 10, left: 4, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="year" tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }} axisLine={false} tickLine={false} interval={2} />
              <YAxis
                domain={['dataMin - 2', 'dataMax + 2']}
                tickFormatter={(v) => `${Number(v).toFixed(0)}%`}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <ChartTooltip
                cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                content={
                  <ChartTooltipContent
                    className="rounded-md"
                    labelFormatter={(label) => `Year ${String(label)}`}
                    formatter={(value) => `${Number(value).toFixed(0)}%`}
                  />
                }
              />
              <Legend wrapperStyle={{ fontSize: '11px', color: 'rgba(212,212,212,0.9)' }} iconType="line" />
              <Line type="monotone" dataKey="cheatingRateMenPct" name="Cheating rate — men" stroke="#38bdf8" strokeWidth={2.2} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="cheatingRateWomenPct" name="Cheating rate — women" stroke="#e879f9" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function CheatingRatesByMigrationBackgroundCard() {
  return (
    <Card className="col-span-full overflow-hidden border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-3 pb-2">
        <CardTitle className="text-sm font-semibold text-neutral-100 uppercase tracking-[0.05em]">Cheating rates by migration background</CardTitle>
        <CardDescription className="text-[10px] uppercase tracking-[0.03em] text-neutral-500">
          Modeled or survey-based prevalence (%), by migration background (2000–2025)
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <ChartContainer config={INFIDELITY_BY_MIGRATION_BACKGROUND_LINE_CONFIG} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[...INFIDELITY_BY_MIGRATION_BACKGROUND_SERIES]} margin={{ top: 8, right: 10, left: 4, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="year" tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }} axisLine={false} tickLine={false} interval={2} />
              <YAxis
                domain={['dataMin - 2', 'dataMax + 2']}
                tickFormatter={(v) => `${Number(v).toFixed(0)}%`}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <ChartTooltip
                cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                content={
                  <ChartTooltipContent
                    className="rounded-md"
                    labelFormatter={(label) => `Year ${String(label)}`}
                    formatter={(value) => `${Number(value).toFixed(0)}%`}
                  />
                }
              />
              <Legend wrapperStyle={{ fontSize: '10px', color: 'rgba(212,212,212,0.9)' }} iconType="line" />
              <Line type="monotone" dataKey="germanNoMigrationCheatingPct" name="German (no migration background)" stroke="#22c55e" strokeWidth={2.2} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="foreignOrMigrationCheatingPct" name="With migration background / foreign" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function LifetimePartnersByGenderCard() {
  return (
    <Card className="col-span-full overflow-hidden border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-3 pb-2">
        <CardTitle className="text-sm font-semibold text-neutral-100 uppercase tracking-[0.05em]">Average lifetime sexual partners by gender</CardTitle>
        <CardDescription className="text-[10px] uppercase tracking-[0.03em] text-neutral-500">Mean reported lifetime partners, by sex (2000–2025)</CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <ChartContainer config={LIFETIME_PARTNERS_BY_GENDER_LINE_CONFIG} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[...LIFETIME_PARTNERS_BY_GENDER_SERIES]} margin={{ top: 8, right: 10, left: 4, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="year" tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }} axisLine={false} tickLine={false} interval={2} />
              <YAxis
                domain={['dataMin - 0.5', 'dataMax + 0.5']}
                tickFormatter={(v) => Number(v).toFixed(1)}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <ChartTooltip
                cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                content={
                  <ChartTooltipContent
                    className="rounded-md"
                    labelFormatter={(label) => `Year ${String(label)}`}
                    formatter={(value) => Number(value).toFixed(1)}
                  />
                }
              />
              <Legend wrapperStyle={{ fontSize: '10px', color: 'rgba(212,212,212,0.9)' }} iconType="line" />
              <Line type="monotone" dataKey="lifetimePartnersMen" name="Men" stroke="#38bdf8" strokeWidth={2.2} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="lifetimePartnersWomen" name="Women" stroke="#e879f9" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function LifetimePartnersByMigrationCard() {
  return (
    <Card className="col-span-full overflow-hidden border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-3 pb-2">
        <CardTitle className="text-sm font-semibold text-neutral-100 uppercase tracking-[0.05em]">Average lifetime sexual partners: native vs migration background</CardTitle>
        <CardDescription className="text-[10px] uppercase tracking-[0.03em] text-neutral-500">Mean lifetime partners (2000–2025)</CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <ChartContainer config={LIFETIME_PARTNERS_BY_MIGRATION_LINE_CONFIG} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[...LIFETIME_PARTNERS_BY_MIGRATION_SERIES]} margin={{ top: 8, right: 10, left: 4, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="year" tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }} axisLine={false} tickLine={false} interval={2} />
              <YAxis
                domain={['dataMin - 0.5', 'dataMax + 0.5']}
                tickFormatter={(v) => Number(v).toFixed(1)}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <ChartTooltip
                cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                content={
                  <ChartTooltipContent
                    className="rounded-md"
                    labelFormatter={(label) => `Year ${String(label)}`}
                    formatter={(value) => Number(value).toFixed(1)}
                  />
                }
              />
              <Legend wrapperStyle={{ fontSize: '10px', color: 'rgba(212,212,212,0.9)' }} iconType="line" />
              <Line type="monotone" dataKey="nativeGermansAvgPartners" name="Native Germans" stroke="#22c55e" strokeWidth={2.2} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="migrantsAvgPartners" name="Migrants / migration background" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function SexualFrequencyByGenderCard() {
  return (
    <Card className="col-span-full overflow-hidden border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-3 pb-2">
        <CardTitle className="text-sm font-semibold text-neutral-100 uppercase tracking-[0.05em]">Average sexual frequency by gender</CardTitle>
        <CardDescription className="text-[10px] uppercase tracking-[0.03em] text-neutral-500">Mean times per year, by sex and overall (2000–2025)</CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <ChartContainer config={SEXUAL_FREQUENCY_BY_GENDER_LINE_CONFIG} className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[...SEXUAL_FREQUENCY_BY_GENDER_SERIES]} margin={{ top: 8, right: 10, left: 4, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="year" tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }} axisLine={false} tickLine={false} interval={2} />
              <YAxis
                domain={['dataMin - 2', 'dataMax + 2']}
                tickFormatter={(v) => (Number.isInteger(Number(v)) ? String(v) : Number(v).toFixed(1))}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <ChartTooltip
                cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                content={
                  <ChartTooltipContent
                    className="rounded-md"
                    labelFormatter={(label) => `Year ${String(label)}`}
                    formatter={(value) => {
                      const n = Number(value);
                      return Number.isInteger(n) ? String(n) : n.toFixed(1);
                    }}
                  />
                }
              />
              <Legend wrapperStyle={{ fontSize: '10px', color: 'rgba(212,212,212,0.9)' }} iconType="line" />
              <Line type="monotone" dataKey="menTimesPerYear" name="Men" stroke="#38bdf8" strokeWidth={2.2} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="womenTimesPerYear" name="Women" stroke="#e879f9" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="overallAvgTimesPerYear" name="Overall average" stroke="#a78bfa" strokeWidth={2} strokeDasharray="6 4" dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function SexualFrequencyByMigrationCard() {
  return (
    <Card className="col-span-full overflow-hidden border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 p-3 pb-2">
        <CardTitle className="text-sm font-semibold text-neutral-100 uppercase tracking-[0.05em]">Average sexual frequency: native vs migration background</CardTitle>
        <CardDescription className="text-[10px] uppercase tracking-[0.03em] text-neutral-500">Mean times per year (2000–2025)</CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <ChartContainer config={SEXUAL_FREQUENCY_BY_MIGRATION_LINE_CONFIG} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[...SEXUAL_FREQUENCY_BY_MIGRATION_SERIES]} margin={{ top: 8, right: 10, left: 4, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="year" tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }} axisLine={false} tickLine={false} interval={2} />
              <YAxis
                domain={['dataMin - 2', 'dataMax + 2']}
                tickFormatter={(v) => String(Math.round(Number(v)))}
                tick={{ fill: 'rgba(163,163,163,0.9)', fontSize: 10, fontFamily: 'ui-sans-serif' }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <ChartTooltip
                cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                content={
                  <ChartTooltipContent
                    className="rounded-md"
                    labelFormatter={(label) => `Year ${String(label)}`}
                    formatter={(value) => Number(value).toLocaleString('en-US')}
                  />
                }
              />
              <Legend wrapperStyle={{ fontSize: '10px', color: 'rgba(212,212,212,0.9)' }} iconType="line" />
              <Line type="monotone" dataKey="nativeGermansTimesPerYear" name="Native Germans" stroke="#22c55e" strokeWidth={2.2} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="migrantsTimesPerYear" name="Migrants / migration background" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

/** Ribbon / expand-all tile count for Demographics → Sexual behavior (DEU). */
export const GERMANY_SEXUAL_BEHAVIOR_GROUP_COUNT = 9;

export const GermanySexualBehaviorSection = memo(function GermanySexualBehaviorSection() {
  return (
    <div className="flex flex-col gap-3">
      <AverageAgeFirstSexualIntercourseCard />
      <MarriageRatesByMigrationBackgroundCard />
      <SingleStatusRatesByGenderCard />
      <CheatingInfidelityRatesByGenderCard />
      <CheatingRatesByMigrationBackgroundCard />
      <LifetimePartnersByGenderCard />
      <LifetimePartnersByMigrationCard />
      <SexualFrequencyByGenderCard />
      <SexualFrequencyByMigrationCard />
    </div>
  );
});
