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
      keyframes: {
        'industrial-fill': {
          '0%, 100%': { transform: 'scaleX(0.32)', opacity: '0.85' },
          '50%': { transform: 'scaleX(0.78)', opacity: '1' },
        },
      },
      animation: {
        'industrial-fill': 'industrial-fill 2.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
