import type { GermanyStockStripRow } from '../germany/germanyStaticMarketStrip';

function stock(
  ticker: string,
  companyName: string,
  price: number,
  change: number,
  changePercent: number,
  history: readonly number[],
  highlight: string,
): GermanyStockStripRow {
  return {
    ticker,
    companyName,
    price,
    change,
    changePercent,
    highlight,
    history: history.map((close) => ({ close })),
  };
}

/**
 * Static Moscow Exchange TQBR snapshot from 13 August 2026.
 * Closing prices, daily changes, and seven-session histories come from MOEX ISS;
 * this is a dated reference strip, not a live quote feed.
 */
export const RUSSIA_STATIC_MARKET_STRIP: GermanyStockStripRow[] = [
  stock('SBER', 'Sberbank PJSC', 277.51, -6.48, -2.28, [287.69, 284.75, 282.5, 284.3, 286.2, 283.99, 277.51], 'Banking heavyweight; MOEX close.'),
  stock('GAZP', 'Gazprom PJSC', 88.53, -3.15, -3.44, [95.41, 93.19, 91.64, 93.39, 93.53, 91.68, 88.53], 'Integrated gas producer; MOEX close.'),
  stock('LKOH', 'Lukoil PJSC', 4528, -136, -2.92, [4612.5, 4651.5, 4621.5, 4709.5, 4706.5, 4664, 4528], 'Oil major; MOEX close.'),
  stock('NVTK', 'Novatek PJSC', 980.7, -41.7, -4.08, [1040.3, 1032.2, 1008.1, 1040.1, 1041.5, 1022.4, 980.7], 'Independent natural-gas producer.'),
  stock('ROSN', 'Rosneft Oil Co.', 332.3, -13.2, -3.82, [350.7, 354.65, 347.25, 354.5, 352.7, 345.5, 332.3], 'State-controlled oil producer.'),
  stock('TATN', 'Tatneft PJSC', 544.7, -21.8, -3.85, [527.4, 541.4, 534.8, 560.5, 571, 566.5, 544.7], 'Integrated oil producer; ordinary shares.'),
  stock('YDEX', 'Yandex NV', 3824, -144, -3.63, [4043.5, 4039.5, 3947.5, 3999.5, 4008, 3968, 3824], 'Technology and internet services.'),
  stock('MOEX', 'Moscow Exchange', 153.15, -4.77, -3.02, [161.9, 160.14, 158.22, 161.73, 160.4, 157.92, 153.15], 'National exchange operator.'),
  stock('MTSS', 'Mobile TeleSystems PJSC', 188.2, -6.7, -3.44, [195, 195.5, 192.95, 194.25, 195.7, 194.9, 188.2], 'Telecommunications operator.'),
  stock('PHOR', 'PhosAgro PJSC', 5564, -21, -0.38, [5946, 5828, 5577, 5717, 5701, 5585, 5564], 'Phosphate fertilizer producer.'),
  stock('GMKN', 'Nornickel PJSC', 120.26, -1.88, -1.54, [127.7, 125.2, 122.66, 125.68, 124.92, 122.14, 120.26], 'Nickel and palladium producer.'),
  stock('CHMF', 'Severstal PJSC', 644.4, -23.6, -3.53, [667, 660.8, 639.4, 665, 686.4, 668, 644.4], 'Vertically integrated steelmaker.'),
  stock('NLMK', 'NLMK PJSC', 70.94, -2.66, -3.61, [75.28, 73.78, 71.96, 74.72, 76.48, 73.6, 70.94], 'Steel producer; MOEX close.'),
  stock('PLZL', 'Polyus PJSC', 1154.6, -107, -8.48, [1367, 1344.6, 1322.6, 1344.2, 1324.2, 1261.6, 1154.6], 'Gold producer; MOEX close.'),
  stock('SNGS', 'Surgutneftegas PJSC', 16.36, -0.57, -3.37, [16.315, 16.495, 16.765, 17.08, 17.045, 16.93, 16.36], 'Oil and gas producer; ordinary shares.'),
  stock('SBERP', 'Sberbank PJSC Preferred', 278.15, -6.78, -2.38, [289.45, 286.3, 282.74, 284.98, 286.52, 284.93, 278.15], 'Preferred share listing; MOEX close.'),
];
