import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <div className="flex items-center justify-end gap-4 px-6 py-5 sm:py-6">
      <ThemeToggle />
    </div>
  );
}
