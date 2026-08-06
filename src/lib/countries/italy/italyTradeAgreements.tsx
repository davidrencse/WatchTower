import type {
  AgreementInsight,
  FtaImpactRow,
  TradeSectionData,
} from '../../../components/countries/germany/GermanyTradeSection';

const linkClass =
  'font-medium text-sky-400/95 underline decoration-sky-500/50 underline-offset-2 transition hover:text-sky-300';

const ITALY_TRADE_AGREEMENTS: readonly AgreementInsight[] = [
  {
    headerLead: 'Deep integration',
    headerSub: 'EU27 · goods & services',
    title: 'EU Single Market & Customs Union',
    tags: ['EU', 'Customs union', 'Tariffs: 0%', 'Active'],
    summary:
      'Italy is part of the EU Single Market and Customs Union: goods circulate without internal customs duties, while common EU trade rules apply at the external border.',
    impact:
      'The EU27 received 50.9% of Italian goods exports and supplied 56.8% of imports in 2024. Italy recorded a €5.501B intra-EU goods deficit in 2025.',
    status: 'Fully active · Italy joined the founding customs-union framework',
  },
  {
    headerLead: 'Bilateral EPA',
    headerSub: 'In force · February 2019',
    title: 'EU–Japan Economic Partnership Agreement',
    tags: ['Japan', 'EPA', 'Italian GIs', 'Active'],
    summary:
      'The EPA removes or reduces almost all tariffs and protects Italian geographical indications, including Prosecco, Parmigiano Reggiano and Prosciutto di Parma.',
    impact:
      'Istat recorded a €4.434B Italian goods surplus with Japan in 2025. The Commission’s last Italy-specific snapshot counted 14,921 exporters (2015 data) and 88,806 supported jobs (2014 estimate).',
    status: 'Active · strong fit for machinery, food, wine and pharmaceuticals',
  },
  {
    headerLead: 'Transatlantic FTA',
    headerSub: 'CETA · provisional since 2017',
    title: 'EU–Canada Comprehensive Economic and Trade Agreement',
    tags: ['Canada', 'CETA', '99% tariff lines', 'Provisional'],
    summary:
      'CETA provisionally applies most trade chapters and eliminates duties on 99% of tariff lines. It also protects European geographical indications and opens Canadian services and procurement markets.',
    impact:
      'Italy remains one of ten EU members that have not completed national ratification. The trade provisions apply; investment protection and the Investment Court System do not yet apply.',
    status: 'Provisionally active · Italian ratification still outstanding',
  },
  {
    headerLead: 'Asia FTA',
    headerSub: 'In force · July 2011',
    title: 'EU–South Korea Free Trade Agreement',
    tags: ['South Korea', 'Industrial goods', 'Customs', 'Active'],
    summary:
      'The agreement removed industrial tariffs and simplified customs. A complementary EU–Korea Digital Trade Agreement was signed in June 2026 and is still going through adoption.',
    impact:
      'For Italian medical-imaging producer IMD Generators, Korea rose from 3% of turnover in 2022 to 11% in 2024 after tariff removal and streamlined exporter procedures.',
    status: 'FTA active · digital agreement signed, not yet in force',
  },
  {
    headerLead: 'Post-Brexit deal',
    headerSub: 'TCA · in force May 2021',
    title: 'EU–UK Trade and Cooperation Agreement',
    tags: ['United Kingdom', 'TCA', 'Rules of origin', 'Active'],
    summary:
      'The TCA provides zero tariffs and zero quotas for qualifying goods, but customs declarations and rules-of-origin checks make access narrower than EU Single Market membership.',
    impact:
      'The United Kingdom remained one of Italy’s strongest surplus markets: Istat recorded a €19.482B Italian goods surplus in 2025.',
    status: 'Active · preferential trade with additional border formalities',
  },
  {
    headerLead: 'South America bloc',
    headerSub: 'Provisional · from May 2026',
    title: 'EU–Mercosur Interim Trade Agreement',
    tags: ['Mercosur', '91% of products', '57 Italian GIs', 'Active'],
    summary:
      'Provisionally applied from 1 May 2026. The agreement removes tariffs on 91% of products and protects 57 Italian geographical indications across the Mercosur markets.',
    impact:
      'Italy–Mercosur trade was €16.4B before application. Italian machinery and electrical exports were €3.1B in 2024; the 2025 goods balance was a €454M surplus.',
    status: 'Provisionally active · 2025 balance is the pre-application baseline',
  },
];

const ITALY_TRADE_REGIME_BALANCES: readonly FtaImpactRow[] = [
  { agreement: 'EU27 Single Market', netBenefit: -5.501, jobsSupported: 2025 },
  { agreement: 'EU–UK TCA', netBenefit: 19.482, jobsSupported: 2025 },
  { agreement: 'EU–Japan EPA', netBenefit: 4.434, jobsSupported: 2025 },
  { agreement: 'EU–Mercosur', netBenefit: 0.454, jobsSupported: 2025 },
];

const ITALY_TRADE_AGREEMENT_NOTES = (
  <>
    <p>
      Italy applies the EU common commercial policy. Agreement status and tariff rules:{' '}
      <a
        href="https://policy.trade.ec.europa.eu/eu-trade-relationships-country-and-region/negotiations-and-agreements_en"
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        European Commission agreements hub
      </a>
      .
    </p>
    <p>
      Italy-specific evidence:{' '}
      <a
        href="https://www.istat.it/wp-content/uploads/2026/02/Foreign-trade-and-Import-prices_December2025.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        Istat 2025 trade balances
      </a>
      {' · '}
      <a
        href="https://policy.trade.ec.europa.eu/eu-trade-relationships-country-and-region/countries-and-regions/mercosur/eu-mercosur-agreement/factsheet-eu-mercosur-partnership-agreement-italy_en"
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        Mercosur country factsheet
      </a>
      {' · '}
      <a
        href="https://policy.trade.ec.europa.eu/eu-trade-relationships-country-and-region/countries-and-regions/japan/eu-japan-trade-your-town/italy-japan-trade-your-town_en"
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        Japan country factsheet
      </a>
      {' · '}
      <a
        href="https://policy.trade.ec.europa.eu/eu-trade-relationships-country-and-region/exporters-stories/italy-medical-x-ray-imaging-technology-breaks-south-korea_en"
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        South Korea exporter case
      </a>
      .
    </p>
    <p>
      The comparison chart reports observed goods balances, not estimated GDP gains caused by
      each agreement. The Mercosur value is a pre-application baseline because provisional
      application began on 1 May 2026. Check product-level eligibility and origin rules in{' '}
      <a
        href="https://trade.ec.europa.eu/access-to-markets/en/home"
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        Access2Markets
      </a>
      .
    </p>
  </>
);

export const ITALY_TRADE_AGREEMENTS_DATA = {
  agreements: ITALY_TRADE_AGREEMENTS,
  ftaImpacts: ITALY_TRADE_REGIME_BALANCES,
  ftaTitle: 'Observed Italian goods balances under selected trade regimes (2025)',
  ftaDescription:
    'Official Istat balances in billions of euros—not causal estimates of agreement effects. Mercosur is the pre-application baseline.',
  ftaSeriesLabel: 'Observed goods balance (B€)',
  ftaValueFormatter: (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(3)} B€`,
  ftaSecondaryFormatter: () => 'Istat · full-year 2025',
  notes: ITALY_TRADE_AGREEMENT_NOTES,
} satisfies Partial<TradeSectionData>;
