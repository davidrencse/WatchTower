export type ItalyNetFiscalContributionPoint = {
  year: number;
  nativeBorn: number;
  intraEuMigrant: number;
  extraEuMigrant: number;
};

/**
 * Italy — annual mean direct net fiscal position per resident.
 *
 * Definition: personal income taxes and social-security contributions paid,
 * minus cash welfare benefits received. The study adjusts values for inflation
 * and purchasing-power parity; it does not allocate indirect taxes or in-kind
 * public services such as health care and education.
 *
 * The paper publishes the annual series graphically in Figure 22. Values below
 * are digitised from that figure and rounded to the nearest €10. Its exact
 * pooled 2007–2018 means are native-born −€1,672, intra-EU migrants +€580, and
 * extra-EU migrants +€767.
 *
 * Source: Boffi, Suari-Andreu & van Vliet, "The Net Fiscal Position of
 * Migrants in Europe: Trends and Insights" (2024), EU-SILC and OECD data.
 */
export const ITALY_NET_FISCAL_CONTRIBUTION_TITLE =
  'Net Fiscal Contribution per Year per Capita (€)';

export const ITALY_NET_FISCAL_CONTRIBUTION_SOURCE_LABEL =
  'European Commission · Boffi, Suari-Andreu & van Vliet (2024), Figure 22';

export const ITALY_NET_FISCAL_CONTRIBUTION_SOURCE_URL =
  'https://home-affairs.ec.europa.eu/whats-new/publications/net-fiscal-position-migrants-europe-trends-and-insights_en';

export const ITALY_NET_FISCAL_CONTRIBUTION_NOTE =
  'Annual mean direct fiscal position: personal taxes and social contributions minus cash welfare benefits. Real PPP-adjusted euros; excludes indirect taxes and in-kind public services. Figure values digitised to the nearest €10.';

export const ITALY_NET_FISCAL_CONTRIBUTION_SERIES = [
  { key: 'nativeBorn', label: 'Native-born', color: '#38bdf8' },
  {
    key: 'intraEuMigrant',
    label: 'Intra-EU migrants',
    color: '#fb7185',
    strokeDasharray: '8 5',
  },
  {
    key: 'extraEuMigrant',
    label: 'Extra-EU migrants',
    color: '#a3e635',
    strokeDasharray: '2 5',
  },
] as const;

export const ITALY_NET_FISCAL_CONTRIBUTION_BY_MIGRATION_BACKGROUND: readonly ItalyNetFiscalContributionPoint[] = [
  { year: 2007, nativeBorn: -1440, intraEuMigrant: 80, extraEuMigrant: 820 },
  { year: 2008, nativeBorn: -1680, intraEuMigrant: 480, extraEuMigrant: 770 },
  { year: 2009, nativeBorn: -1620, intraEuMigrant: 520, extraEuMigrant: 710 },
  { year: 2010, nativeBorn: -1720, intraEuMigrant: 350, extraEuMigrant: 610 },
  { year: 2011, nativeBorn: -1740, intraEuMigrant: 460, extraEuMigrant: 470 },
  { year: 2012, nativeBorn: -1680, intraEuMigrant: 1170, extraEuMigrant: 730 },
  { year: 2013, nativeBorn: -1550, intraEuMigrant: 620, extraEuMigrant: 600 },
  { year: 2014, nativeBorn: -1610, intraEuMigrant: 700, extraEuMigrant: 630 },
  { year: 2015, nativeBorn: -1370, intraEuMigrant: 550, extraEuMigrant: 800 },
  { year: 2016, nativeBorn: -1590, intraEuMigrant: 400, extraEuMigrant: 880 },
  { year: 2017, nativeBorn: -1910, intraEuMigrant: 680, extraEuMigrant: 990 },
  { year: 2018, nativeBorn: -2100, intraEuMigrant: 610, extraEuMigrant: 930 },
] as const;
