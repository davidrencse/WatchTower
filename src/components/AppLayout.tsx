import type { ReactNode } from 'react';
import { Header } from './Header';

type AppLayoutProps = {
  children: ReactNode;
  /** Hide main gallery header (e.g. full-screen country data view). */
  showHeader?: boolean;
  headerClassName?: string;
  /** Transparent shell so a shared scene background shows through (landing / countries). */
  transparent?: boolean;
};

export function AppLayout({
  children,
  showHeader = true,
  headerClassName,
  transparent = false,
}: AppLayoutProps) {
  return (
    <div
      className={[
        'relative min-h-screen min-h-[100dvh] text-[var(--fg)]',
        transparent ? 'bg-transparent' : 'bg-[var(--bg)]',
      ].join(' ')}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[1000] focus:rounded-md focus:bg-[var(--card)] focus:px-4 focus:py-3 focus:text-sm focus:text-[var(--fg)] focus:shadow-soft"
      >
        Skip to content
      </a>
      {showHeader ? (
        <header
          className={[
            'sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--shell-header)] shadow-header',
            headerClassName,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <Header />
        </header>
      ) : null}
      <main id="main-content" tabIndex={-1} className={showHeader ? '' : 'min-h-screen'}>
        {children}
      </main>
    </div>
  );
}
