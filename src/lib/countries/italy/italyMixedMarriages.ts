import type {
  MarriageDetailedTableRow,
  MarriageTrendRow,
} from '../../../components/countries/germany/GermanyMarriagesSection';

export type ItalyMixedMarriageTrendRow = {
  year: string;
  totalMarriages: number;
  italianGroomForeignBride: number;
  foreignGroomItalianBride: number;
};

/** Exact headline counts from Istat's annual marriage releases. */
export const ITALY_MIXED_MARRIAGE_TREND: readonly ItalyMixedMarriageTrendRow[] = [
  { year: '2018', totalMarriages: 195_778, italianGroomForeignBride: 17_789, foreignGroomItalianBride: 6_127 },
  { year: '2019', totalMarriages: 184_088, italianGroomForeignBride: 17_924, foreignGroomItalianBride: 6_243 },
  { year: '2020', totalMarriages: 96_841, italianGroomForeignBride: 10_870, foreignGroomItalianBride: 3_453 },
  { year: '2021', totalMarriages: 180_416, italianGroomForeignBride: 13_703, foreignGroomItalianBride: 4_595 },
  { year: '2022', totalMarriages: 189_140, italianGroomForeignBride: 15_138, foreignGroomItalianBride: 5_540 },
  { year: '2023', totalMarriages: 184_207, italianGroomForeignBride: 15_389, foreignGroomItalianBride: 5_822 },
  { year: '2024', totalMarriages: 173_272, italianGroomForeignBride: 14_961, foreignGroomItalianBride: 6_041 },
];

/** Italian female mixed-marriage table, preserving supplied approximation and estimate notation. */
export const ITALY_FEMALE_MIXED_MARRIAGE_TABLE: readonly MarriageDetailedTableRow[] = [
  { year: '2000', totalMarriages: '~280,000', nonNativeCount: '~3,800', nonNativePct: '1.4%', europeanCount: '~1,500', europeanPct: '0.5%', nonEuropeanCount: '~2,300', nonEuropeanPct: '0.8%', africanCount: '~1,100', africanPct: '0.4%', arabCount: '~900', arabPct: '0.3%', asianIndianCount: '~150', asianIndianPct: '0.05%' },
  { year: '2001', totalMarriages: '~264,000', nonNativeCount: '~4,100', nonNativePct: '1.6%', europeanCount: '~1,600', europeanPct: '0.6%', nonEuropeanCount: '~2,500', nonEuropeanPct: '0.9%', africanCount: '~1,200', africanPct: '0.5%', arabCount: '~1,000', arabPct: '0.4%', asianIndianCount: '~180', asianIndianPct: '0.07%' },
  { year: '2002', totalMarriages: '~260,000', nonNativeCount: '~4,400', nonNativePct: '1.7%', europeanCount: '~1,700', europeanPct: '0.7%', nonEuropeanCount: '~2,700', nonEuropeanPct: '1.0%', africanCount: '~1,300', africanPct: '0.5%', arabCount: '~1,100', arabPct: '0.4%', asianIndianCount: '~200', asianIndianPct: '0.08%' },
  { year: '2003', totalMarriages: '~264,000', nonNativeCount: '~4,800', nonNativePct: '1.8%', europeanCount: '~1,900', europeanPct: '0.7%', nonEuropeanCount: '~2,900', nonEuropeanPct: '1.1%', africanCount: '~1,400', africanPct: '0.5%', arabCount: '~1,200', arabPct: '0.5%', asianIndianCount: '~220', asianIndianPct: '0.08%' },
  { year: '2004', totalMarriages: '~249,000', nonNativeCount: '~4,443', nonNativePct: '1.8%', europeanCount: '~1,975', europeanPct: '0.8%', nonEuropeanCount: '~2,468', nonEuropeanPct: '1.0%', africanCount: '~1,346', africanPct: '0.5%', arabCount: '~1,111', arabPct: '0.4%', asianIndianCount: '~167', asianIndianPct: '0.07%' },
  { year: '2005', totalMarriages: '~248,000', nonNativeCount: '~5,000', nonNativePct: '2.0%', europeanCount: '~2,000', europeanPct: '0.8%', nonEuropeanCount: '~3,000', nonEuropeanPct: '1.2%', africanCount: '~1,500', africanPct: '0.6%', arabCount: '~1,250', arabPct: '0.5%', asianIndianCount: '~250', asianIndianPct: '0.10%' },
  { year: '2006', totalMarriages: '~246,000', nonNativeCount: '~5,500', nonNativePct: '2.2%', europeanCount: '~2,200', europeanPct: '0.9%', nonEuropeanCount: '~3,300', nonEuropeanPct: '1.3%', africanCount: '~1,650', africanPct: '0.7%', arabCount: '~1,400', arabPct: '0.6%', asianIndianCount: '~280', asianIndianPct: '0.11%' },
  { year: '2007', totalMarriages: '~250,000', nonNativeCount: '~5,900', nonNativePct: '2.4%', europeanCount: '~2,400', europeanPct: '1.0%', nonEuropeanCount: '~3,500', nonEuropeanPct: '1.4%', africanCount: '~1,800', africanPct: '0.7%', arabCount: '~1,500', arabPct: '0.6%', asianIndianCount: '~300', asianIndianPct: '0.12%' },
  { year: '2008', totalMarriages: '~247,000', nonNativeCount: '~6,308', nonNativePct: '2.6%', europeanCount: '~2,500', europeanPct: '1.0%', nonEuropeanCount: '~3,800', nonEuropeanPct: '1.5%', africanCount: '~2,000', africanPct: '0.8%', arabCount: '~1,700', arabPct: '0.7%', asianIndianCount: '~350', asianIndianPct: '0.14%' },
  { year: '2009', totalMarriages: '~231,000', nonNativeCount: '~5,200', nonNativePct: '2.3%', europeanCount: '~2,100', europeanPct: '0.9%', nonEuropeanCount: '~3,100', nonEuropeanPct: '1.3%', africanCount: '~1,600', africanPct: '0.7%', arabCount: '~1,350', arabPct: '0.6%', asianIndianCount: '~300', asianIndianPct: '0.13%' },
  { year: '2010', totalMarriages: '~218,000', nonNativeCount: '~4,200', nonNativePct: '1.9%', europeanCount: '~1,700', europeanPct: '0.8%', nonEuropeanCount: '~2,500', nonEuropeanPct: '1.1%', africanCount: '~1,300', africanPct: '0.6%', arabCount: '~1,100', arabPct: '0.5%', asianIndianCount: '~250', asianIndianPct: '0.11%' },
  { year: '2011', totalMarriages: '~205,000', nonNativeCount: '~4,000', nonNativePct: '2.0%', europeanCount: '~1,600', europeanPct: '0.8%', nonEuropeanCount: '~2,400', nonEuropeanPct: '1.2%', africanCount: '~1,250', africanPct: '0.6%', arabCount: '~1,050', arabPct: '0.5%', asianIndianCount: '~240', asianIndianPct: '0.12%' },
  { year: '2012', totalMarriages: '~207,000', nonNativeCount: '~4,100', nonNativePct: '2.0%', europeanCount: '~1,650', europeanPct: '0.8%', nonEuropeanCount: '~2,450', nonEuropeanPct: '1.2%', africanCount: '~1,280', africanPct: '0.6%', arabCount: '~1,080', arabPct: '0.5%', asianIndianCount: '~250', asianIndianPct: '0.12%' },
  { year: '2013', totalMarriages: '~194,000', nonNativeCount: '~3,890', nonNativePct: '2.0%', europeanCount: '~1,550', europeanPct: '0.8%', nonEuropeanCount: '~2,340', nonEuropeanPct: '1.2%', africanCount: '~1,220', africanPct: '0.6%', arabCount: '~1,030', arabPct: '0.5%', asianIndianCount: '~240', asianIndianPct: '0.12%' },
  { year: '2014', totalMarriages: '~190,000', nonNativeCount: '~4,000', nonNativePct: '2.1%', europeanCount: '~1,600', europeanPct: '0.8%', nonEuropeanCount: '~2,400', nonEuropeanPct: '1.3%', africanCount: '~1,250', africanPct: '0.7%', arabCount: '~1,050', arabPct: '0.6%', asianIndianCount: '~250', asianIndianPct: '0.13%' },
  { year: '2015', totalMarriages: '~194,000', nonNativeCount: '~4,050', nonNativePct: '2.1%', europeanCount: '~1,620', europeanPct: '0.8%', nonEuropeanCount: '~2,430', nonEuropeanPct: '1.3%', africanCount: '~1,260', africanPct: '0.6%', arabCount: '~1,060', arabPct: '0.5%', asianIndianCount: '~260', asianIndianPct: '0.13%' },
  { year: '2016', totalMarriages: '~203,000', nonNativeCount: '~4,800', nonNativePct: '2.4%', europeanCount: '~1,850', europeanPct: '0.9%', nonEuropeanCount: '~2,950', nonEuropeanPct: '1.5%', africanCount: '~1,450', africanPct: '0.7%', arabCount: '~1,200', arabPct: '0.6%', asianIndianCount: '~300', asianIndianPct: '0.15%' },
  { year: '2017', totalMarriages: '~191,000', nonNativeCount: '~5,500', nonNativePct: '2.9%', europeanCount: '~2,000', europeanPct: '1.0%', nonEuropeanCount: '~3,500', nonEuropeanPct: '1.8%', africanCount: '~1,650', africanPct: '0.9%', arabCount: '~1,350', arabPct: '0.7%', asianIndianCount: '~350', asianIndianPct: '0.18%' },
  { year: '2018', totalMarriages: '195,778', nonNativeCount: '6,127', nonNativePct: '3.13%', europeanCount: '2,083', europeanPct: '1.06%', nonEuropeanCount: '4,044', nonEuropeanPct: '2.07%', africanCount: '306', africanPct: '0.16%', arabCount: '1,532', arabPct: '0.78%', asianIndianCount: '429', asianIndianPct: '0.22%' },
  { year: '2019', totalMarriages: '184,088', nonNativeCount: '6,243', nonNativePct: '3.39%', europeanCount: '2,133', europeanPct: '1.16%', nonEuropeanCount: '4,110', nonEuropeanPct: '2.23%', africanCount: '312', africanPct: '0.17%', arabCount: '1,613', arabPct: '0.88%', asianIndianCount: '437', asianIndianPct: '0.24%' },
  { year: '2020', totalMarriages: '96,841', nonNativeCount: '3,453', nonNativePct: '3.57%', europeanCount: '1,186', europeanPct: '1.22%', nonEuropeanCount: '2,267', nonEuropeanPct: '2.34%', africanCount: '173', africanPct: '0.18%', arabCount: '921', arabPct: '0.95%', asianIndianCount: '242', asianIndianPct: '0.25%' },
  { year: '2021', totalMarriages: '180,416', nonNativeCount: '4,595', nonNativePct: '2.55%', europeanCount: '1,585', europeanPct: '0.88%', nonEuropeanCount: '3,010', nonEuropeanPct: '1.67%', africanCount: '230', africanPct: '0.13%', arabCount: '1,264', arabPct: '0.70%', asianIndianCount: '322', asianIndianPct: '0.18%' },
  { year: '2022', totalMarriages: '189,140', nonNativeCount: '5,540', nonNativePct: '2.93%', europeanCount: '1,921', europeanPct: '1.02%', nonEuropeanCount: '3,619', nonEuropeanPct: '1.91%', africanCount: '277', africanPct: '0.15%', arabCount: '1,570', arabPct: '0.83%', asianIndianCount: '388', asianIndianPct: '0.21%' },
  { year: '2023', totalMarriages: '184,207', nonNativeCount: '5,822', nonNativePct: '3.16%', europeanCount: '2,028', europeanPct: '1.10%', nonEuropeanCount: '3,794', nonEuropeanPct: '2.06%', africanCount: '291', africanPct: '0.16%', arabCount: '1,698', arabPct: '0.92%', asianIndianCount: '408', asianIndianPct: '0.22%' },
  { year: '2024', totalMarriages: '173,272', nonNativeCount: '6,041', nonNativePct: '3.49%', europeanCount: '2,114', europeanPct: '1.22%', nonEuropeanCount: '3,927', nonEuropeanPct: '2.27%', africanCount: '302', africanPct: '0.17%', arabCount: '1,812', arabPct: '1.05%', asianIndianCount: '423', asianIndianPct: '0.24%' },
  { year: '2025', totalMarriages: '~165–170k (est.)', nonNativeCount: '~5,800–6,200 (est.)', nonNativePct: '~3.5%', europeanCount: '~2,050–2,200', europeanPct: '~1.25%', nonEuropeanCount: '~3,800–4,000', nonEuropeanPct: '~2.3%', africanCount: '~290–320', africanPct: '~0.18%', arabCount: '~1,750–1,900', arabPct: '~1.1%', asianIndianCount: '~410–450', asianIndianPct: '~0.25%' },
];

/** Italian male mixed-marriage table, preserving supplied approximation, range and estimate notation. */
export const ITALY_MALE_MIXED_MARRIAGE_TABLE: readonly MarriageDetailedTableRow[] = [
  { year: '2000', totalMarriages: '~280,000', nonNativeCount: '~10,500', nonNativePct: '3.8%', europeanCount: '~5,800', europeanPct: '2.1%', nonEuropeanCount: '~4,700', nonEuropeanPct: '1.7%', africanCount: '~400', africanPct: '0.14%', arabCount: '~500', arabPct: '0.18%', asianIndianCount: '~600', asianIndianPct: '0.21%' },
  { year: '2001', totalMarriages: '~264,000', nonNativeCount: '~11,500', nonNativePct: '4.4%', europeanCount: '~6,300', europeanPct: '2.4%', nonEuropeanCount: '~5,200', nonEuropeanPct: '2.0%', africanCount: '~450', africanPct: '0.17%', arabCount: '~550', arabPct: '0.21%', asianIndianCount: '~650', asianIndianPct: '0.25%' },
  { year: '2002', totalMarriages: '~260,000', nonNativeCount: '~12,500', nonNativePct: '4.8%', europeanCount: '~6,800', europeanPct: '2.6%', nonEuropeanCount: '~5,700', nonEuropeanPct: '2.2%', africanCount: '~500', africanPct: '0.19%', arabCount: '~600', arabPct: '0.23%', asianIndianCount: '~700', asianIndianPct: '0.27%' },
  { year: '2003', totalMarriages: '~264,000', nonNativeCount: '~13,500', nonNativePct: '5.1%', europeanCount: '~7,300', europeanPct: '2.8%', nonEuropeanCount: '~6,200', nonEuropeanPct: '2.3%', africanCount: '~550', africanPct: '0.21%', arabCount: '~650', arabPct: '0.25%', asianIndianCount: '~750', asianIndianPct: '0.28%' },
  { year: '2004', totalMarriages: '~249,000', nonNativeCount: '~17,379', nonNativePct: '7.0%', europeanCount: '~11,350', europeanPct: '4.6%', nonEuropeanCount: '~6,029', nonEuropeanPct: '2.4%', africanCount: '~1,195', africanPct: '0.48%', arabCount: '~641', arabPct: '0.26%', asianIndianCount: '~788', asianIndianPct: '0.32%' },
  { year: '2005', totalMarriages: '~248,000', nonNativeCount: '~16,500', nonNativePct: '6.7%', europeanCount: '~10,500', europeanPct: '4.2%', nonEuropeanCount: '~6,000', nonEuropeanPct: '2.4%', africanCount: '~700', africanPct: '0.28%', arabCount: '~750', arabPct: '0.30%', asianIndianCount: '~800', asianIndianPct: '0.32%' },
  { year: '2006', totalMarriages: '~246,000', nonNativeCount: '~17,000', nonNativePct: '6.9%', europeanCount: '~10,800', europeanPct: '4.4%', nonEuropeanCount: '~6,200', nonEuropeanPct: '2.5%', africanCount: '~750', africanPct: '0.30%', arabCount: '~800', arabPct: '0.33%', asianIndianCount: '~850', asianIndianPct: '0.35%' },
  { year: '2007', totalMarriages: '~250,000', nonNativeCount: '~17,663', nonNativePct: '7.1%', europeanCount: '~11,000', europeanPct: '4.4%', nonEuropeanCount: '~6,663', nonEuropeanPct: '2.7%', africanCount: '~800', africanPct: '0.32%', arabCount: '~850', arabPct: '0.34%', asianIndianCount: '~900', asianIndianPct: '0.36%' },
  { year: '2008', totalMarriages: '~247,000', nonNativeCount: '~18,240', nonNativePct: '7.4%', europeanCount: '~11,500', europeanPct: '4.7%', nonEuropeanCount: '~6,740', nonEuropeanPct: '2.7%', africanCount: '~850', africanPct: '0.34%', arabCount: '~900', arabPct: '0.36%', asianIndianCount: '~950', asianIndianPct: '0.38%' },
  { year: '2009', totalMarriages: '~231,000', nonNativeCount: '~15,500', nonNativePct: '6.7%', europeanCount: '~9,800', europeanPct: '4.2%', nonEuropeanCount: '~5,700', nonEuropeanPct: '2.5%', africanCount: '~700', africanPct: '0.30%', arabCount: '~750', arabPct: '0.32%', asianIndianCount: '~800', asianIndianPct: '0.35%' },
  { year: '2010', totalMarriages: '~218,000', nonNativeCount: '~14,215', nonNativePct: '6.5%', europeanCount: '~9,000', europeanPct: '4.1%', nonEuropeanCount: '~5,215', nonEuropeanPct: '2.4%', africanCount: '~600', africanPct: '0.28%', arabCount: '~650', arabPct: '0.30%', asianIndianCount: '~750', asianIndianPct: '0.34%' },
  { year: '2011', totalMarriages: '~205,000', nonNativeCount: '~14,799', nonNativePct: '7.2%', europeanCount: '~9,300', europeanPct: '4.5%', nonEuropeanCount: '~5,499', nonEuropeanPct: '2.7%', africanCount: '~650', africanPct: '0.32%', arabCount: '~700', arabPct: '0.34%', asianIndianCount: '~800', asianIndianPct: '0.39%' },
  { year: '2012', totalMarriages: '~207,000', nonNativeCount: '~16,340', nonNativePct: '7.9%', europeanCount: '~10,200', europeanPct: '4.9%', nonEuropeanCount: '~6,140', nonEuropeanPct: '3.0%', africanCount: '~700', africanPct: '0.34%', arabCount: '~750', arabPct: '0.36%', asianIndianCount: '~850', asianIndianPct: '0.41%' },
  { year: '2013', totalMarriages: '~194,000', nonNativeCount: '~14,383 / ~15,363', nonNativePct: '7.4–7.9%', europeanCount: '~9,000', europeanPct: '4.6%', nonEuropeanCount: '~5,400–6,000', nonEuropeanPct: '2.8–3.1%', africanCount: '~650', africanPct: '0.34%', arabCount: '~700', arabPct: '0.36%', asianIndianCount: '~800', asianIndianPct: '0.41%' },
  { year: '2014', totalMarriages: '~190,000', nonNativeCount: '~15,454', nonNativePct: '8.1%', europeanCount: '~9,500', europeanPct: '5.0%', nonEuropeanCount: '~5,954', nonEuropeanPct: '3.1%', africanCount: '~700', africanPct: '0.37%', arabCount: '~750', arabPct: '0.39%', asianIndianCount: '~850', asianIndianPct: '0.45%' },
  { year: '2015', totalMarriages: '~194,000', nonNativeCount: '~13,642 / ~16,113', nonNativePct: '7.0–8.3%', europeanCount: '~8,800', europeanPct: '4.5%', nonEuropeanCount: '~5,000–6,500', nonEuropeanPct: '2.6–3.3%', africanCount: '~650', africanPct: '0.34%', arabCount: '~700', arabPct: '0.36%', asianIndianCount: '~850', asianIndianPct: '0.44%' },
  { year: '2016', totalMarriages: '~203,000', nonNativeCount: '~17,137', nonNativePct: '8.4%', europeanCount: '~10,500', europeanPct: '5.2%', nonEuropeanCount: '~6,637', nonEuropeanPct: '3.3%', africanCount: '~750', africanPct: '0.37%', arabCount: '~800', arabPct: '0.39%', asianIndianCount: '~950', asianIndianPct: '0.47%' },
  { year: '2017', totalMarriages: '~191,000', nonNativeCount: '~17,487', nonNativePct: '9.2%', europeanCount: '~10,700', europeanPct: '5.6%', nonEuropeanCount: '~6,787', nonEuropeanPct: '3.6%', africanCount: '~780', africanPct: '0.41%', arabCount: '~830', arabPct: '0.43%', asianIndianCount: '~1,000', asianIndianPct: '0.52%' },
  { year: '2018', totalMarriages: '195,778', nonNativeCount: '17,789', nonNativePct: '9.09%', europeanCount: '9,962', europeanPct: '5.09%', nonEuropeanCount: '7,827', nonEuropeanPct: '4.00%', africanCount: '356', africanPct: '0.18%', arabCount: '712', arabPct: '0.36%', asianIndianCount: '1,067', asianIndianPct: '0.55%' },
  { year: '2019', totalMarriages: '184,088', nonNativeCount: '17,924', nonNativePct: '9.74%', europeanCount: '9,918', europeanPct: '5.39%', nonEuropeanCount: '8,006', nonEuropeanPct: '4.35%', africanCount: '358', africanPct: '0.19%', arabCount: '747', arabPct: '0.41%', asianIndianCount: '1,105', asianIndianPct: '0.60%' },
  { year: '2020', totalMarriages: '96,841', nonNativeCount: '10,870', nonNativePct: '11.22%', europeanCount: '5,942', europeanPct: '6.14%', nonEuropeanCount: '4,928', nonEuropeanPct: '5.09%', africanCount: '217', africanPct: '0.22%', arabCount: '471', arabPct: '0.49%', asianIndianCount: '688', asianIndianPct: '0.71%' },
  { year: '2021', totalMarriages: '180,416', nonNativeCount: '13,703', nonNativePct: '7.60%', europeanCount: '7,400', europeanPct: '4.10%', nonEuropeanCount: '6,303', nonEuropeanPct: '3.49%', africanCount: '274', africanPct: '0.15%', arabCount: '617', arabPct: '0.34%', asianIndianCount: '891', asianIndianPct: '0.49%' },
  { year: '2022', totalMarriages: '189,140', nonNativeCount: '15,138', nonNativePct: '8.00%', europeanCount: '8,074', europeanPct: '4.27%', nonEuropeanCount: '7,064', nonEuropeanPct: '3.73%', africanCount: '303', africanPct: '0.16%', arabCount: '706', arabPct: '0.37%', asianIndianCount: '1,009', asianIndianPct: '0.53%' },
  { year: '2023', totalMarriages: '184,207', nonNativeCount: '15,389', nonNativePct: '8.35%', europeanCount: '8,105', europeanPct: '4.40%', nonEuropeanCount: '7,284', nonEuropeanPct: '3.95%', africanCount: '308', africanPct: '0.17%', arabCount: '744', arabPct: '0.40%', asianIndianCount: '1,052', asianIndianPct: '0.57%' },
  { year: '2024', totalMarriages: '173,272', nonNativeCount: '14,961', nonNativePct: '8.63%', europeanCount: '7,780', europeanPct: '4.49%', nonEuropeanCount: '7,181', nonEuropeanPct: '4.14%', africanCount: '299', africanPct: '0.17%', arabCount: '748', arabPct: '0.43%', asianIndianCount: '1,047', asianIndianPct: '0.60%' },
  { year: '2025', totalMarriages: '~165–170k (est.)', nonNativeCount: '~14,500–15,500 (est.)', nonNativePct: '~8.7–9.1%', europeanCount: '~7,600–8,100', europeanPct: '~4.5–4.8%', nonEuropeanCount: '~6,900–7,400', nonEuropeanPct: '~4.1–4.4%', africanCount: '~290–320', africanPct: '~0.17–0.19%', arabCount: '~730–780', arabPct: '~0.43–0.46%', asianIndianCount: '~1,000–1,100', asianIndianPct: '~0.60–0.65%' },
];

type ItalyOriginShares = {
  european: number;
  african: number;
  arab: number;
  asianIndian: number;
};

function interpolateShares(
  year: number,
  start: ItalyOriginShares,
  end: ItalyOriginShares,
): ItalyOriginShares {
  const t = (year - 2018) / 6;
  const between = (a: number, b: number) => a + (b - a) * t;
  return {
    european: between(start.european, end.european),
    african: between(start.african, end.african),
    arab: between(start.arab, end.arab),
    asianIndian: between(start.asianIndian, end.asianIndian),
  };
}

function buildItalySeries(
  countFor: (row: ItalyMixedMarriageTrendRow) => number,
  start: ItalyOriginShares,
  end: ItalyOriginShares,
): readonly MarriageTrendRow[] {
  return ITALY_MIXED_MARRIAGE_TREND.map((row) => {
    const nonItalianCount = countFor(row);
    const shares = interpolateShares(Number(row.year), start, end);
    const count = (share: number) => Math.round(nonItalianCount * share);
    const europeanCount = count(shares.european);
    const africanCount = count(shares.african);
    const arabCount = count(shares.arab);
    const asianIndianCount = count(shares.asianIndian);
    const nonEuropeanCount = nonItalianCount - europeanCount;
    const asPct = (value: number) =>
      Math.round((value / row.totalMarriages) * 10_000) / 100;

    return {
      year: row.year,
      totalMarriages: row.totalMarriages,
      nonGermanCount: nonItalianCount,
      nonGermanPct: asPct(nonItalianCount),
      europeanCount,
      europeanPct: asPct(europeanCount),
      nonEuropeanCount,
      nonEuropeanPct: asPct(nonEuropeanCount),
      africanCount,
      africanPct: asPct(africanCount),
      arabCount,
      arabPct: asPct(arabCount),
      asianIndianCount,
      asianIndianPct: asPct(asianIndianCount),
    };
  });
}

/**
 * Exact annual mixed-marriage totals allocated into the Germany component's
 * buckets using Italy's Istat-published spouse-citizenship profile.
 */
export const ITALY_FEMALE_MIXED_MARRIAGE_SERIES = buildItalySeries(
  (row) => row.foreignGroomItalianBride,
  { european: 0.34, african: 0.05, arab: 0.25, asianIndian: 0.07 },
  { european: 0.35, african: 0.05, arab: 0.30, asianIndian: 0.07 },
);

export const ITALY_MALE_MIXED_MARRIAGE_SERIES = buildItalySeries(
  (row) => row.italianGroomForeignBride,
  { european: 0.56, african: 0.02, arab: 0.04, asianIndian: 0.06 },
  { european: 0.52, african: 0.02, arab: 0.05, asianIndian: 0.07 },
);

export const ITALY_MIXED_MARRIAGES_ISTAT_URL =
  'https://www.istat.it/comunicato-stampa/matrimoni-unioni-civili-separazioni-e-divorzi-anno-2024/';

export const ITALY_MIXED_MARRIAGES_ISTAT_TABLES_URL =
  'https://www.istat.it/wp-content/uploads/2026/01/Tavole-e-grafici_matrimoni-unioni-separazioni-divorzi_2024.xlsx';

export const ITALY_MIXED_MARRIAGES_ISTAT_HISTORY_URL =
  'https://webpub.istat.it/progetto/i-comportamenti-familiari-dei-nuovi-italiani/documento';
