import { useTheme } from '../context/ThemeContext';

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === 'light' ? 'dark' : 'light';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} mode`}
      aria-pressed={theme === 'light'}
      className={[
        'inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-metric)] px-3 py-2',
        'font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-500 shadow-inset transition-colors',
        'hover:border-neutral-400/50 hover:text-[var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="text-neutral-500">Theme</span>
      <span className="rounded-full bg-[var(--bg)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--fg)] shadow-card">
        {theme}
      </span>
    </button>
  );
}