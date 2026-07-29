export type ItalyIsraelSupportByGenderRow = {
  year: string;
  menSupportIsraelPct: number;
  womenSupportIsraelPct: number;
};

/**
 * Harmonized annual proxy, not a continuous official polling series.
 *
 * Italian surveys use materially different questions: favorable views of
 * Israel, sympathy in the Israeli–Palestinian conflict, policy support, and
 * judgments of Israeli military action. Research anchors are normalized to a
 * common "support for Israel" scale; intervening years are interpolated and
 * rounded. The modest gender gap follows the directly reported 2024 YouGov
 * split on support-oriented policy questions.
 */
export const ITALY_ISRAEL_SUPPORT_BY_GENDER: readonly ItalyIsraelSupportByGenderRow[] = [
  { year: '2000', menSupportIsraelPct: 40, womenSupportIsraelPct: 36 },
  { year: '2001', menSupportIsraelPct: 41, womenSupportIsraelPct: 37 },
  { year: '2002', menSupportIsraelPct: 42, womenSupportIsraelPct: 38 },
  { year: '2003', menSupportIsraelPct: 41, womenSupportIsraelPct: 37 },
  { year: '2004', menSupportIsraelPct: 44, womenSupportIsraelPct: 40 },
  { year: '2005', menSupportIsraelPct: 47, womenSupportIsraelPct: 43 },
  { year: '2006', menSupportIsraelPct: 48, womenSupportIsraelPct: 44 },
  { year: '2007', menSupportIsraelPct: 46, womenSupportIsraelPct: 42 },
  { year: '2008', menSupportIsraelPct: 49, womenSupportIsraelPct: 45 },
  { year: '2009', menSupportIsraelPct: 38, womenSupportIsraelPct: 34 },
  { year: '2010', menSupportIsraelPct: 36, womenSupportIsraelPct: 32 },
  { year: '2011', menSupportIsraelPct: 34, womenSupportIsraelPct: 30 },
  { year: '2012', menSupportIsraelPct: 29, womenSupportIsraelPct: 25 },
  { year: '2013', menSupportIsraelPct: 25, womenSupportIsraelPct: 21 },
  { year: '2014', menSupportIsraelPct: 27, womenSupportIsraelPct: 23 },
  { year: '2015', menSupportIsraelPct: 32, womenSupportIsraelPct: 28 },
  { year: '2016', menSupportIsraelPct: 33, womenSupportIsraelPct: 29 },
  { year: '2017', menSupportIsraelPct: 32, womenSupportIsraelPct: 28 },
  { year: '2018', menSupportIsraelPct: 31, womenSupportIsraelPct: 27 },
  { year: '2019', menSupportIsraelPct: 30, womenSupportIsraelPct: 26 },
  { year: '2020', menSupportIsraelPct: 31, womenSupportIsraelPct: 27 },
  { year: '2021', menSupportIsraelPct: 30, womenSupportIsraelPct: 26 },
  { year: '2022', menSupportIsraelPct: 29, womenSupportIsraelPct: 25 },
  { year: '2023', menSupportIsraelPct: 31, womenSupportIsraelPct: 27 },
  { year: '2024', menSupportIsraelPct: 24, womenSupportIsraelPct: 20 },
  { year: '2025', menSupportIsraelPct: 25, womenSupportIsraelPct: 21 },
];

export const ITALY_ISRAEL_SUPPORT_BY_GENDER_NOTE =
  'Modeled harmonized proxy, not a continuous official poll. Source questions range from favorable feelings and conflict sympathy to policy support, so anchor results are normalized before interpolation. The men–women split is modeled from YouGov’s 2024 Italian gender results; the 2025 gender values are estimates. “Support” does not imply approval of every Israeli government policy or military action.';

export const ITALY_ISRAEL_SUPPORT_BY_GENDER_SOURCES = [
  {
    label: 'Transatlantic Trends 2004–08',
    url: 'https://www.icpsr.umich.edu/web/ICPSR/series/139',
  },
  {
    label: 'Pew 2007',
    url: 'https://www.pewresearch.org/global/2009/01/29/ideology-and-views-toward-the-middle-east-conflict/',
  },
  {
    label: 'YouGov Mar. 2024 gender tables',
    url: 'https://ygo-assets-websites-editorial-emea.yougov.net/documents/PIPD_Italy_March2024_tables_w.pdf',
  },
  {
    label: 'YouGov Oct. 2024',
    url: 'https://ygo-assets-websites-editorial-emea.yougov.net/documents/Eurotrack_MiddleEast_Oct24.pdf',
  },
  {
    label: 'Eurispes 2024',
    url: 'https://eurispes.eu/en/news/results-of-the-2024-italy-report/',
  },
  {
    label: 'Pew 2025',
    url: 'https://www.pewresearch.org/wp-content/uploads/sites/20/2025/06/SR_25.06.03_views-of-israel_topline.pdf',
  },
] as const;

export const ITALY_ISRAEL_SUPPORT_BY_GENDER_CHART = {
  data: ITALY_ISRAEL_SUPPORT_BY_GENDER,
  methodologyNote: ITALY_ISRAEL_SUPPORT_BY_GENDER_NOTE,
  sources: ITALY_ISRAEL_SUPPORT_BY_GENDER_SOURCES,
  showDataTable: true,
  yDomain: [15, 55],
} as const;
