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
  return { ticker, companyName, price, change, changePercent, highlight, history: history(price, changePercent, phase) };
}

/**
 * Static Borsa Italiana (Euronext Milan) snapshot, researched July 2026.
 * Quote observations span roughly 7 to 21 July 2026 and are not a live feed;
 * they reflect the FTSE MIB near a multi-decade high on financial-sector strength.
 */
export const ITALY_STATIC_MARKET_STRIP: GermanyStockStripRow[] = [
  stock('UCG', 'UniCredit SpA', 80.90, 0.55, 0.68, 'FTSE MIB bank leader; 7 July Milan close.'),
  stock('ISP', 'Intesa Sanpaolo SpA', 6.37, 0.04, 0.63, 'Largest Italian bank; 21 July Milan close.'),
  stock('ENI', 'Eni SpA', 21.87, 0.23, 1.06, 'Energy major; 21 July Milan close.'),
  stock('ENEL', 'Enel SpA', 9.95, -0.12, -1.19, 'Utility heavyweight; Borsa Italiana snapshot.'),
  stock('RACE', 'Ferrari NV', 385.00, 3.10, 0.81, 'Luxury automaker; FTSE MIB constituent.'),
  stock('G', 'Assicurazioni Generali SpA', 42.94, 0.28, 0.66, 'Insurance leader; early-July Milan close.'),
  stock('LDO', 'Leonardo SpA', 51.37, -0.45, -0.87, 'Defence and aerospace; 13 July Milan close.'),
  stock('STLAM', 'Stellantis NV', 8.45, -0.15, -1.74, 'Automaker; Euronext Milan listing.'),
  stock('MONC', 'Moncler SpA', 52.50, 0.42, 0.80, 'Luxury outerwear; Borsa Italiana snapshot.'),
  stock('PRY', 'Prysmian SpA', 58.00, -0.46, -0.79, 'Cables and energy systems; Milan snapshot.'),
  stock('SRG', 'Snam SpA', 5.20, 0.03, 0.58, 'Gas infrastructure; Borsa Italiana snapshot.'),
  stock('CPR', 'Davide Campari-Milano NV', 6.30, -0.05, -0.79, 'Global spirits group; Milan snapshot.'),
];
