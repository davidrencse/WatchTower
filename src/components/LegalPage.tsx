import { LEGAL_DOCUMENT_BY_ID } from '../data/legalDocuments';
import { LEGAL_LINKS, type LegalDocId } from '../data/legalLinks';

type LegalPageProps = {
  docId: LegalDocId;
  onBack: () => void;
  /** Navigate to the other legal document without a full page load. */
  onNavigate: (path: string) => void;
};

/**
 * Renders a legal document. Styling follows `CountryToBeCompletedPage` — the same dark stage,
 * mono eyebrow type and 1360px measure — so these pages read as part of the archive rather
 * than a bolted-on legal boilerplate page.
 *
 * Body copy deliberately breaks from the site's uppercase mono into sentence-case sans at a
 * comfortable reading size: these are the only long-form prose pages on the site, and tracked
 * uppercase is unreadable at paragraph length.
 */
export function LegalPage({ docId, onBack, onNavigate }: LegalPageProps) {
  // The body text lives in this code-split chunk; the router only carries the link index.
  const doc = LEGAL_DOCUMENT_BY_ID[docId];
  const link = LEGAL_LINKS.find((entry) => entry.id === docId)!;
  const others = LEGAL_LINKS.filter((entry) => entry.id !== docId);

  return (
    <div className="wt-dark-stage min-h-screen min-h-[100dvh] overflow-x-hidden">
      <div className="relative z-10 flex min-h-screen min-h-[100dvh] flex-col">
        <header className="mx-auto flex w-full max-w-[1360px] items-center justify-between px-6 py-6 sm:px-10">
          <button
            type="button"
            onClick={onBack}
            className="min-h-11 rounded-sm px-2 font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-500 transition-colors hover:text-neutral-200 active:text-neutral-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-focus)]"
          >
            ← Back
          </button>
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.3em] text-neutral-600 sm:text-[10px]">
            Legal
          </p>
        </header>

        <main className="mx-auto w-full max-w-[1360px] flex-1 px-6 pb-24 pt-6 sm:px-10">
          <div className="border-t border-white/10 pt-10">
            <div className="mb-8 flex items-center gap-4">
              <span className="h-px w-10 bg-white/40" aria-hidden="true" />
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-neutral-500">
                Last updated {doc.updated}
              </p>
            </div>

            <h1 className="max-w-4xl font-sans text-[clamp(2.4rem,6vw,4.8rem)] font-black uppercase leading-[0.88] tracking-[-0.045em] text-neutral-100">
              {link.title}
            </h1>

            <p className="mt-6 max-w-2xl font-sans text-sm leading-relaxed text-neutral-400">
              {doc.summary}
            </p>

            <div className="mt-14 max-w-3xl">
              {doc.sections.map((section) => (
                <section key={section.heading} className="mb-11 last:mb-0">
                  <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-300">
                    {section.heading}
                  </h2>

                  {section.paragraphs?.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="mt-4 font-sans text-[13px] leading-[1.75] text-neutral-400"
                    >
                      {paragraph}
                    </p>
                  ))}

                  {section.bullets ? (
                    <ul className="mt-4 space-y-2.5">
                      {section.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex gap-3 font-sans text-[13px] leading-[1.7] text-neutral-400"
                        >
                          <span aria-hidden="true" className="mt-[0.6em] h-px w-3 shrink-0 bg-white/25" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </div>

            {others.length > 0 ? (
              <nav
                aria-label="Other legal documents"
                className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-7"
              >
                <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-neutral-600">
                  See also
                </span>
                {others.map((entry) => (
                  <a
                    key={entry.id}
                    href={entry.path}
                    onClick={(event) => {
                      // Plain left-click navigates in-app; modified clicks and middle-click keep
                      // their native "open in a new tab" behaviour.
                      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                      if (event.button !== 0) return;
                      event.preventDefault();
                      onNavigate(entry.path);
                    }}
                    className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400 underline-offset-4 transition-colors hover:text-neutral-100 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-focus)]"
                  >
                    {entry.title}
                  </a>
                ))}
              </nav>
            ) : null}
          </div>
        </main>

        <footer className="mx-auto flex w-full max-w-[1360px] justify-between px-6 pb-7 font-mono text-[8px] uppercase tracking-[0.2em] text-neutral-600 sm:px-10">
          <span>WatchTower archive</span>
          <span>{link.navLabel}</span>
        </footer>
      </div>
    </div>
  );
}
