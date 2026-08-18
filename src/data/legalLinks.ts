/**
 * Lightweight index of the legal pages: just enough to render a footer link, resolve a route
 * and set a document title.
 *
 * Deliberately separate from `legalDocuments.ts`. The footer and the router both live in the
 * **initial** bundle, so importing the full prose from there dragged every word of the policy
 * text into the first payload — ~5 KB gzip that almost no visitor reads. The bodies now load
 * only with the code-split `LegalPage` chunk, which looks them up by `id`.
 *
 * Adding a document means adding it in both places; `legalDocuments.ts` is typed against
 * {@link LegalDocId} so a missing body is a compile error rather than a blank page.
 */

export type LegalDocId = 'privacy' | 'eula';

export type LegalLink = {
  id: LegalDocId;
  /** URL path, without a trailing slash. */
  path: string;
  /** Short label used in the footer. */
  navLabel: string;
  /** Full document title, used for `<title>` and headings. */
  title: string;
};

export const LEGAL_LINKS: readonly LegalLink[] = [
  { id: 'privacy', path: '/privacy', navLabel: 'Privacy', title: 'Privacy Policy' },
  { id: 'eula', path: '/eula', navLabel: 'EULA', title: 'End-User Licence Agreement' },
];
