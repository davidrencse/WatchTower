/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        line: 'var(--line)',
        surface: {
          app: 'var(--surface-app)',
          metric: 'var(--surface-metric)',
          rail: 'var(--rail-bg)',
        },
        card: {
          DEFAULT: 'var(--card)',
          hover: 'var(--card-hover)',
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        header: 'var(--shadow-header)',
        soft: 'var(--shadow-soft)',
        inset: 'var(--shadow-inset)',
      },
    },
  },
  plugins: [],
};
