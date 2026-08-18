/**
 * Privacy Policy and EULA content.
 *
 * These are drafted against what the application **actually does**, which was audited from the
 * source rather than assumed: there are no accounts, cookies or analytics, but the optional
 * Recon deep scan uploads a sanitized image for server-side analysis and the browser contacts
 * a fixed set of third-party hosts. If you add analytics, a login or a new remote data source, the "What this
 * site does not do" and "Third-party services" sections below stop being true and
 * must be updated with it.
 *
 * `[[...]]` markers are deliberate placeholders — an operator name, a contact address and a
 * governing-law jurisdiction cannot be invented here. They render literally, so an incomplete
 * document is obvious on the page rather than silently wrong.
 *
 * Not legal advice; have counsel review before relying on these.
 */

import type { LegalDocId } from './legalLinks';

export type LegalSection = {
  heading: string;
  paragraphs?: readonly string[];
  bullets?: readonly string[];
};

export type LegalDocument = {
  id: LegalDocId;
  /** One-line description, also used as the meta description on the prerendered route. */
  summary: string;
  /** Human-readable effective date. */
  updated: string;
  sections: readonly LegalSection[];
};

const OPERATOR = '[[OPERATOR — legal entity or individual publishing WatchTower]]';
const CONTACT = '[[CONTACT EMAIL]]';
const JURISDICTION = '[[GOVERNING JURISDICTION]]';

/** Third-party services used by the application, shared by both documents. */
const THIRD_PARTY_SERVICES: readonly string[] = [
  'OpenFreeMap (tiles.openfreemap.org) — vector map tiles and label fonts for the globe.',
  'Amazon S3 elevation tiles (s3.amazonaws.com) — terrain elevation data used for relief shading.',
  'CelesTrak (celestrak.org) — public orbital elements for the satellite layer.',
  'NASA EONET (eonet.gsfc.nasa.gov) — natural-hazard event feed.',
  'Hacker News (hacker-news.firebaseio.com) — headline feed shown alongside the globe.',
  'Microlink (api.microlink.io) — resolves preview images for linked news articles.',
  'YouTube in no-cookie mode (youtube-nocookie.com) — video embeds, loaded only after you choose to play a clip.',
  'X / Twitter (platform.twitter.com) — post embeds, loaded only after you choose to open one.',
  'The operator-configured AI vision provider (Groq by default) — receives a sanitized JPEG only after you choose Recon Deep scan.',
  'Catbox (catbox.moe) — receives a sanitized JPEG only when the operator has explicitly enabled the optional public reverse-image-search upload.',
];

const PRIVACY_POLICY: LegalDocument = {
  id: 'privacy',
  summary:
    'What WatchTower stores, what it does not collect, and which third-party services your browser contacts.',
  updated: '12 August 2026',
  sections: [
    {
      heading: 'In short',
      paragraphs: [
        'WatchTower is a public reference atlas. It has no accounts, sign-in or comment fields and does not build an advertising or behavioural profile. Recon includes an optional image picker; its automatic checks stay in your browser, while Deep scan uploads a sanitized copy only when you press that control.',
        'It is not, however, a closed system: displaying a globe, satellites and live feeds requires your browser to request data from a small, fixed set of outside services. Those services see your IP address, as they would for any website that loads content from them. Everything below is a plain description of that.',
      ],
    },
    {
      heading: 'What this site does not do',
      bullets: [
        'No user accounts, registration or authentication.',
        'No advertising and no advertising networks.',
        'No analytics, telemetry, or product-usage tracking of any kind.',
        'No cookies are set by this site.',
        'No account, contact or payment form, and no collection of names, email addresses or payment details.',
        'No sale of personal information and no use of uploaded images for advertising or behavioural profiling.',
      ],
    },
    {
      heading: 'Data stored on your device',
      paragraphs: [
        'A few small values are written to your own browser storage to make the site usable. They stay on your device, are readable only by this site, and are never transmitted to us or anyone else. You can clear them at any time through your browser settings.',
      ],
      bullets: [
        'Local storage — a single key (wt-theme) remembering whether you chose the light or dark theme.',
        'Session storage — resolved preview-image URLs for news articles, so reopening a section does not refetch them. Cleared when you close the tab.',
        'Cache storage — downloaded satellite orbital-element files. This cache is required for the satellite layer to work at all, because the upstream provider refuses repeat downloads within a two-hour window.',
      ],
    },
    {
      heading: 'Optional Recon photo analysis',
      paragraphs: [
        'Selecting a photo first runs EXIF, filename and image-safety checks in your browser. Those automatic checks do not upload the file. The preview is a newly decoded, metadata-free JPEG rather than the original byte stream.',
        'Deep scan is optional and clearly labelled. When you press it, the sanitized JPEG is sent to WatchTower\'s geolocation endpoint, rewritten again by the OSINT engine and held in memory for the request. If an AI vision provider is configured, that sanitized image is sent to the provider for analysis under that provider\'s terms. WatchTower does not intentionally persist the upload.',
        'Public reverse-image hosting is disabled by default. If the operator explicitly enables REVERSE_IMAGE_UPLOAD, the sanitized JPEG is published to Catbox so external reverse-search services can access it; the result screen states when that occurred. Do not use Deep scan for an image you are not permitted to upload or disclose.',
      ],
    },
    {
      heading: 'Third-party services',
      paragraphs: [
        'To render the map and live layers, your browser makes requests directly to the mapping, feed and embed services below. A Recon Deep scan may instead make server-side requests to the configured AI provider and, only when explicitly enabled, Catbox. We do not control those services; their own privacy policies apply.',
      ],
      bullets: THIRD_PARTY_SERVICES,
    },
    {
      heading: 'Embedded video and posts',
      paragraphs: [
        'Video and social-post embeds are not loaded when a page opens. They load only after you explicitly choose to view them, and YouTube embeds use its no-cookie domain. Until you click, those providers receive nothing from your visit.',
      ],
    },
    {
      heading: 'Server logs',
      paragraphs: [
        `The site is served by a hosting provider that may keep standard access logs — IP address, timestamp, requested path, user agent — for security and operational purposes. These are ordinary web-server records, not analytics, and ${OPERATOR} does not use them to identify or track individual visitors.`,
      ],
    },
    {
      heading: 'Links to external sources',
      paragraphs: [
        'WatchTower cites its sources heavily and links out to statistical agencies, news organisations and research bodies. Following a link takes you to a site governed by its own privacy policy, over which we have no control.',
      ],
    },
    {
      heading: 'Children',
      paragraphs: [
        'The site is a general-audience reference resource and is not directed at children. Children should not use Recon Deep scan or upload an image.',
      ],
    },
    {
      heading: 'Your rights',
      paragraphs: [
        'Rights under the GDPR, UK GDPR and comparable laws — access, correction, erasure, portability, objection — apply to personal data a controller holds about you. WatchTower does not intentionally retain Recon uploads, so there is normally nothing to retrieve beyond the browser storage described above; configured service providers may process a Deep scan as described above.',
        `If you believe personal data relating to you is nonetheless being processed here, contact ${CONTACT} and it will be addressed. You also have the right to complain to your local data protection authority.`,
      ],
    },
    {
      heading: 'Changes to this policy',
      paragraphs: [
        'If the site changes in a way that affects this description — a new data source, an embedded service, or any form of measurement — this policy will be updated and the date at the top revised.',
      ],
    },
    {
      heading: 'Contact',
      paragraphs: [`Questions about this policy: ${CONTACT}.`],
    },
  ],
};

const EULA: LegalDocument = {
  id: 'eula',
  summary:
    'The terms on which WatchTower is made available, including data accuracy limits and permitted use.',
  updated: '7 August 2026',
  sections: [
    {
      heading: 'Acceptance',
      paragraphs: [
        `This Agreement is between you and ${OPERATOR} ("we", "us"), and governs your access to and use of WatchTower (the "Service"). By using the Service you accept these terms. If you do not accept them, do not use the Service.`,
      ],
    },
    {
      heading: 'Licence',
      paragraphs: [
        'We grant you a limited, personal, non-exclusive, non-transferable, revocable licence to access and use the Service for informational and research purposes, including ordinary citation of figures with attribution.',
        'This licence covers use of the Service as presented. It does not transfer ownership of anything, and all rights not expressly granted are reserved.',
      ],
    },
    {
      heading: 'Restrictions',
      bullets: [
        'Do not use automated means to bulk-download, scrape or mirror the Service in a way that imposes an unreasonable load on it.',
        'Do not redistribute the compiled datasets or visualisations as though they were your own work, or strip the source attributions they carry.',
        'Do not reverse engineer, decompile or attempt to derive source code beyond what is publicly served to your browser.',
        'Do not use the Service to break the law, to harass anyone, or to attack, probe or disrupt the Service or its infrastructure.',
        'Do not remove or obscure any proprietary, source or attribution notices.',
      ],
    },
    {
      heading: 'Third-party data and attribution',
      paragraphs: [
        'The Service compiles material from national statistical agencies, intergovernmental bodies, news organisations, open geographic datasets and public satellite catalogues. That material remains subject to the licence and terms of its originating source, which are cited throughout the Service. Map geometry derives from open data whose attribution requirements travel with it.',
        'Where a source restricts reuse, that restriction applies to you as it applies to us. Nothing in this Agreement grants you rights in third-party material beyond what its own licence allows.',
      ],
    },
    {
      heading: 'Accuracy, models and estimates',
      paragraphs: [
        'This is the most important section of this Agreement, so it is stated plainly.',
        'The Service mixes measured official statistics with figures that are modelled, apportioned or illustrative, and it says so at the point of display. Some breakdowns are estimates constructed to sit within published national ranges rather than counts from any single official table. Where a live intelligence feed is unavailable, the interface substitutes clearly-labelled sample material rather than presenting a blank layer, and flags it as such.',
        'Reported incident figures — particularly casualty, loss and breach numbers — are frequently contested, and some originate from parties with an interest in the number, including attackers claiming credit. The Service reproduces what its cited sources report; it does not independently verify them.',
        'Treat everything here as a starting point for research, to be confirmed against the primary sources cited before being relied upon.',
      ],
    },
    {
      heading: 'Not professional advice',
      paragraphs: [
        'Nothing in the Service is legal, financial, investment, medical, security or policy advice, and it must not be relied upon as the basis for any decision with real consequences. Obtain qualified professional advice for that.',
      ],
    },
    {
      heading: 'No warranty',
      paragraphs: [
        'The Service is provided "as is" and "as available", without warranty of any kind, whether express, implied or statutory, including any implied warranty of merchantability, fitness for a particular purpose, accuracy, or non-infringement. We do not warrant that the Service will be uninterrupted, timely, complete or error-free.',
      ],
    },
    {
      heading: 'Limitation of liability',
      paragraphs: [
        'To the fullest extent permitted by law, we are not liable for any indirect, incidental, special, consequential or punitive damages, or for any loss of profits, data, goodwill or opportunity, arising from your use of or inability to use the Service — including any decision taken in reliance on figures presented here.',
        'Nothing in this Agreement excludes or limits liability that cannot lawfully be excluded or limited, including liability for death or personal injury caused by negligence, or for fraud.',
      ],
    },
    {
      heading: 'Availability and changes',
      paragraphs: [
        'The Service is offered without any commitment to availability, and may be modified, suspended or discontinued at any time without notice. Datasets, layers and countries may be added, revised or removed as sources change.',
        'We may amend this Agreement; the revised version takes effect when posted, and the date at the top will be updated. Continuing to use the Service after that constitutes acceptance.',
      ],
    },
    {
      heading: 'Termination',
      paragraphs: [
        'This licence terminates automatically if you breach these terms. The sections on accuracy, warranties, liability and governing law survive termination.',
      ],
    },
    {
      heading: 'Governing law',
      paragraphs: [
        `This Agreement is governed by the laws of ${JURISDICTION}, and the courts of that jurisdiction have exclusive jurisdiction over any dispute, without prejudice to mandatory consumer protections available to you where you live.`,
      ],
    },
    {
      heading: 'Contact',
      paragraphs: [`Questions about these terms: ${CONTACT}.`],
    },
  ],
};

/** Bodies keyed by id. Exhaustive over {@link LegalDocId}, so a new link needs a new body. */
export const LEGAL_DOCUMENT_BY_ID: Readonly<Record<LegalDocId, LegalDocument>> = {
  privacy: PRIVACY_POLICY,
  eula: EULA,
};
