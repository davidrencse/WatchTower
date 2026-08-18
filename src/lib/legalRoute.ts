import { LEGAL_LINKS, type LegalLink } from '../data/legalLinks';

/**
 * Routing for the standalone legal pages (`/privacy`, `/eula`).
 *
 * Resolves against the lightweight {@link LEGAL_LINKS} index rather than the document bodies,
 * so pulling the router into the initial bundle does not pull the policy prose with it.
 *
 * These sit alongside the country slugs handled by `countryRoute.ts` and are resolved *first*,
 * because both readers only look at the first path segment and a country could in principle be
 * slugged into a collision. Keeping the two tables separate means adding a legal page never
 * requires touching country routing.
 */
const PATH_TO_LINK: ReadonlyMap<string, LegalLink> = new Map(
  LEGAL_LINKS.map((link) => [link.path.replace(/^\/+/, ''), link]),
);

/** Resolve a pathname (e.g. `/privacy`, `/eula/`) to its link entry, or null. */
export function legalLinkForPath(pathname: string): LegalLink | null {
  const segment = pathname.replace(/^\/+/, '').replace(/\/+$/, '').split('/')[0];
  if (!segment) return null;
  return PATH_TO_LINK.get(segment.toLowerCase()) ?? null;
}
