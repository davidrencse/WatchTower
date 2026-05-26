import { forwardRef, type CSSProperties, type ReactNode } from 'react';

type CountryShadowCardProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  variant?: 'hero' | 'compact';
  interactive?: boolean;
  onClick?: () => void;
  'aria-label'?: string;
  role?: string;
  tabIndex?: number;
};

/**
 * Frosted glass panel with deep shadow — hero (center country) or compact (rail shell / tiles).
 */
export const CountryShadowCard = forwardRef<HTMLDivElement, CountryShadowCardProps>(
  function CountryShadowCard(
    { children, className, style, variant = 'hero', interactive, onClick, role, tabIndex, ...rest },
    ref,
  ) {
    const base = [
      'relative isolate overflow-hidden',
      'wt-glass-panel',
      variant === 'hero'
        ? 'wt-perfect-shadow rounded-[2rem] sm:rounded-[2.25rem]'
        : 'wt-glass-panel-compact wt-perfect-shadow-compact rounded-[20px]',
    ].join(' ');
    const focusable = interactive
      ? ' cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent'
      : '';
    return (
      <div
        ref={ref}
        className={[base, focusable, className].filter(Boolean).join(' ')}
        style={style}
        onClick={onClick}
        role={role ?? (interactive ? 'button' : undefined)}
        tabIndex={interactive ? (tabIndex ?? 0) : tabIndex}
        aria-label={rest['aria-label']}
      >
        {children}
      </div>
    );
  },
);
