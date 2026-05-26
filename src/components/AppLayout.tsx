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
      {showHeader ? (
        <header
          className={[
            'relative z-50 border-b border-[var(--line)] bg-[var(--bg)] shadow-header',
            headerClassName,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <Header />
        </header>
      ) : null}
      <main className={showHeader ? '' : 'min-h-screen'}>{children}</main>
    </div>
  );
}