import type { ReactNode } from 'react';
import { Header } from './Header';

type AppLayoutProps = {
  children: ReactNode;
  /** Hide main gallery header (e.g. full-screen country data view). */
  showHeader?: boolean;
};

export function AppLayout({ children, showHeader = true }: AppLayoutProps) {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-[var(--bg)] text-[var(--fg)]">
      {showHeader ? (
        <header className="relative z-50 border-b border-[var(--line)] bg-[var(--bg)]">
          <Header />
        </header>
      ) : null}
      <main className={showHeader ? '' : 'min-h-screen'}>{children}</main>
    </div>
  );
}