export const GLOBE_NEWS_CHANNELS = [
  'Economic',
  'Immigration',
  'Geopolitical',
  'Tech',
  'Military',
] as const;

export type GlobeNewsChannel = (typeof GLOBE_NEWS_CHANNELS)[number];
export type GlobeNewsIso = 'DEU' | 'FRA' | 'ITA';

export type GlobeNewsStory = {
  country: 'Germany' | 'France' | 'Italy';
  iso: GlobeNewsIso;
  published: string;
  headline: string;
  source: string;
  url: string;
};

export const GLOBE_NEWS: Record<GlobeNewsChannel, readonly GlobeNewsStory[]> = {
  Economic: [
    {
      country: 'Germany',
      iso: 'DEU',
      published: '11 Apr 2026',
      headline: "German debt brake reform won't happen during current government term",
      source: 'Reuters',
      url: 'https://www.reuters.com/business/german-debt-brake-reform-wont-happen-during-current-government-term-bild-reports-2026-04-11/',
    },
    {
      country: 'France',
      iso: 'FRA',
      published: '17 Jul 2026',
      headline: "France's budget process increases the risk of a debt crisis, Olivier Blanchard says",
      source: 'Le Monde',
      url: 'https://www.lemonde.fr/en/opinion/article/2026/07/17/economist-olivier-blanchard-france-s-budget-process-is-flawed-and-increases-the-risk-of-a-debt-crisis_6755563_23.html',
    },
    {
      country: 'Italy',
      iso: 'ITA',
      published: '17 Jul 2026',
      headline: 'Inflation in 2026 at 3.1%, price expectations rise, Bank of Italy says',
      source: 'ANSA',
      url: 'https://www.ansa.it/english/news/business/2026/07/17/inflation-in-2026-at-3.1-price-expectations-rise-says-boi_0dc82f0a-d65c-4716-90e8-816519e150fd.html',
    },
  ],
  Immigration: [
    {
      country: 'Germany',
      iso: 'DEU',
      published: '31 Mar 2026',
      headline: 'German chancellor clarifies Syrian refugee comments after backlash',
      source: 'Reuters',
      url: 'https://www.reuters.com/world/german-chancellor-clarifies-syrian-refugee-comments-after-backlash-2026-03-31/',
    },
    {
      country: 'France',
      iso: 'FRA',
      published: '23 Jun 2026',
      headline: 'Europe moves toward a shared approach to Channel crossings',
      source: 'Le Monde',
      url: 'https://www.lemonde.fr/en/international/article/2026/06/23/europe-moves-toward-a-shared-approach-to-channel-crossings_6754798_4.html',
    },
    {
      country: 'Italy',
      iso: 'ITA',
      published: '8 Jul 2026',
      headline: "Meloni's party proposes swift deportation of foreign offenders",
      source: 'Reuters',
      url: 'https://www.internazionale.it/ultime-notizie-reuters/2026/07/08/italian-pm-meloni-s-party-proposes-swift-deportation-of-foreign-offenders',
    },
  ],
  Geopolitical: [
    {
      country: 'Germany',
      iso: 'DEU',
      published: '1 Jul 2026',
      headline: 'NATO must become more European to remain transatlantic, Merz says',
      source: 'Reuters',
      url: 'https://www.reutersconnect.com/item/nato-must-become-more-european-in-order-to-remain-transatlantic-germanys-merz-says/dGFnOnJldXRlcnMuY29tLDIwMjY6bmV3c21sX1ZBNDA2NjAxMDcyMDI2UlAx/dGFnOnJldXRlcnMuY29tLDIwMjY6bmV3c21sX0xWQTAwMjQwNjYwMTA3MjAyNlJQMQ',
    },
    {
      country: 'France',
      iso: 'FRA',
      published: '24 Jul 2026',
      headline: 'France expresses concern after two diplomats were violently detained in Tehran',
      source: 'Le Monde',
      url: 'https://www.lemonde.fr/en/international/article/2026/07/24/after-two-diplomats-were-violently-detained-in-tehran-france-expresses-concern-for-its-nationals-in-iran_6755780_4.html',
    },
    {
      country: 'Italy',
      iso: 'ITA',
      published: '7 Jul 2026',
      headline: "Italy's government seeks to avoid escalation after renewed tension with Trump",
      source: 'Reuters',
      url: 'https://www.internazionale.it/ultime-notizie-reuters/2026/07/07/italy-will-no-longer-respond-to-trump-s-provocations-foreign-minister-says',
    },
  ],
  Tech: [
    {
      country: 'Germany',
      iso: 'DEU',
      published: '14 Jul 2026',
      headline: "Google's AI Overviews and Perplexity are subject to German media law",
      source: 'Reuters',
      url: 'https://www.investing.com/news/stock-market-news/german-media-regulator-says-googles-ai-overviews-subject-to-german-media-law-4790891',
    },
    {
      country: 'France',
      iso: 'FRA',
      published: '27 Jul 2026',
      headline: 'France strives to keep up in the global data-center race',
      source: 'Le Monde',
      url: 'https://www.lemonde.fr/en/economy/article/2026/07/27/france-strives-to-keep-up-in-global-data-center-race-as-opposition-mounts_6755896_19.html',
    },
    {
      country: 'Italy',
      iso: 'ITA',
      published: '30 Apr 2026',
      headline: "Italy closes probes into AI firms after commitments on 'hallucination' risks",
      source: 'Reuters',
      url: 'https://www.investing.com/news/stock-market-news/italy-closes-antitrust-probes-into-ai-firms-after-commitments-on-hallucination-risks-4648110',
    },
  ],
  Military: [
    {
      country: 'Germany',
      iso: 'DEU',
      published: '17 Jul 2026',
      headline: 'Germany and France expand their defence partnership',
      source: 'Reuters',
      url: 'https://www.internazionale.it/ultime-notizie-reuters/2026/07/17/france-germany-expand-defence-partnership-as-europe-seeks-more-military-autonomy',
    },
    {
      country: 'France',
      iso: 'FRA',
      published: '17 Jul 2026',
      headline: 'France and Germany pursue greater European military autonomy',
      source: 'Reuters',
      url: 'https://www.internazionale.it/ultime-notizie-reuters/2026/07/17/france-germany-expand-defence-partnership-as-europe-seeks-more-military-autonomy',
    },
    {
      country: 'Italy',
      iso: 'ITA',
      published: '28 Jul 2026',
      headline: 'Italy will use the EU SAFE scheme to fund defence spending',
      source: 'Reuters',
      url: 'https://in.marketscreener.com/news/italy-to-use-eu-safe-scheme-to-fund-defence-spending-foreign-minister-says-ce7f51ddda8ff22d',
    },
  ],
};
