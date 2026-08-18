import type { GermanyStockStripRow } from '../germany/germanyStaticMarketStrip';

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
  price: number,
  change: number,
  changePercent: number,
  highlight: string,
): GermanyStockStripRow {
  const phase = ticker.split('').reduce((sum, character) => sum + character.charCodeAt(0), 0) * 0.01;
  return {
    ticker,
    companyName,
    price,
    change,
    changePercent,
    highlight,
    history: history(price, changePercent, phase),
  };
}

/**
 * Static IBEX 35 snapshot from 27 July 2026.
 * Prices and daily changes are not a live feed.
 */
export const SPAIN_STATIC_MARKET_STRIP: GermanyStockStripRow[] = [
  stock('SAN', 'Banco Santander SA', 12.256, 0.28, 2.30, 'IBEX 35 banking heavyweight; 27 July Madrid close.'),
  stock('IBE', 'Iberdrola SA', 21.23, 0.02, 0.09, 'Electric utility leader; 27 July Madrid close.'),
  stock('BBVA', 'Banco Bilbao Vizcaya Argentaria SA', 23.20, 0.34, 1.49, 'Global Spanish bank; 27 July Madrid close.'),
  stock('ITX', 'Industria de Dise\u00f1o Textil SA', 55.48, 1.02, 1.87, 'Inditex retail group; 27 July Madrid close.'),
  stock('CABK', 'CaixaBank SA', 13.29, -0.01, -0.08, 'Domestic banking leader; 27 July Madrid close.'),
  stock('FER', 'Ferrovial SE', 54.88, -0.82, -1.47, 'Transport infrastructure group; 27 July Madrid close.'),
  stock('AMS', 'Amadeus IT Group SA', 51.36, 1.63, 3.28, 'Travel technology provider; 27 July Madrid close.'),
  stock('AENA', 'Aena SME SA', 27.20, 0.50, 1.87, 'Airport operator; 27 July Madrid close.'),
  stock('TEF', 'Telef\u00f3nica SA', 3.657, 0.06, 1.64, 'Telecommunications group; 27 July Madrid close.'),
  stock('IAG', 'International Consolidated Airlines Group SA', 5.158, 0.08, 1.50, 'Airline group; 27 July Madrid close.'),
  stock('REP', 'Repsol SA', 25.54, -0.28, -1.08, 'Integrated energy group; 27 July Madrid close.'),
  stock('ACS', 'ACS Actividades de Construcci\u00f3n y Servicios SA', 108.90, -5.81, -5.06, 'Construction and services group; 27 July Madrid close.'),
];
