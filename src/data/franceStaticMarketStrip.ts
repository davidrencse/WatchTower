import type { GermanyStockStripRow } from './germanyStaticMarketStrip';

function history(last: number, changePercent: number, phase: number): { close: number }[] {
  const previous = last / (1 + changePercent / 100);
  return Array.from({ length: 7 }, (_, index) => {
    const progress = index / 6;
    const trend = previous + (last - previous) * progress;
    const wave = index === 6 ? 0 : Math.sin(index * 1.9 + phase) * last * 0.003;
    return { close: Math.round((trend + wave) * 100) / 100 };
  });
}

function stock(
  ticker: string,
  companyName: string,
  priceEur: number,
  changeEur: number,
  changePercent: number,
  highlight: string,
): GermanyStockStripRow {
  const phase = ticker.split('').reduce((sum, character) => sum + character.charCodeAt(0), 0) * 0.01;
  return { ticker, companyName, priceEur, changeEur, changePercent, highlight, history: history(priceEur, changePercent, phase) };
}

/**
 * Static Euronext snapshot, researched 20 July 2026.
 * Quote observations span 19 June to 18 July 2026 and are not a live feed.
 */
export const FRANCE_STATIC_MARKET_STRIP: GermanyStockStripRow[] = [
  stock('MC', 'LVMH Moet Hennessy Louis Vuitton', 495.10, -8.00, -1.59, 'CAC 40 constituent; Euronext snapshot.'),
  stock('OR', 'L\'Oreal', 378.00, -4.45, -1.16, 'Beauty leader; 6 July Euronext close.'),
  stock('RMS', 'Hermes International', 1626.00, 12.50, 0.77, 'Luxury leader; 26 June Euronext close.'),
  stock('TTE', 'TotalEnergies SE', 70.51, 0.92, 1.32, 'Energy major; Euronext market snapshot.'),
  stock('SU', 'Schneider Electric SE', 262.45, -1.90, -0.72, 'Energy management and industrial automation.'),
  stock('AIR', 'Airbus SE', 189.42, -2.52, -1.31, 'Aerospace leader; 19 June Euronext close.'),
  stock('SAF', 'Safran SA', 329.50, 0.40, 0.12, 'Aerospace propulsion and equipment.'),
  stock('AI', 'L\'Air Liquide SA', 172.86, 1.46, 0.85, 'Industrial and medical gases; 26 June close.'),
  stock('SAN', 'Sanofi SA', 75.07, 1.31, 1.78, 'Pharmaceuticals and vaccines; 26 June close.'),
  stock('STMPA', 'STMicroelectronics NV', 53.80, -2.19, -3.91, 'Semiconductors; Euronext market snapshot.'),
  stock('BN', 'Danone SA', 71.76, -0.62, -0.86, 'Food and nutrition group; Euronext snapshot.'),
  stock('HO', 'Thales SA', 227.00, -6.10, -2.62, 'Defence, aerospace and digital security.'),
];
