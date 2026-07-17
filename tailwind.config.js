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
        // Theme-aware core palette. These resolve to channel CSS variables (defined in
        // index.css) so `text-white`, `bg-white/10`, `text-neutral-400`, etc. flip between
        // light and dark automatically — the light theme inverts the neutral ramp so a
        // shade used as bright foreground in dark becomes dark foreground in light.
        white: 'rgb(var(--c-white) / <alpha-value>)',
        black: 'rgb(var(--c-black) / <alpha-value>)',
        neutral: {
          50: 'rgb(var(--n-50) / <alpha-value>)',
          100: 'rgb(var(--n-100) / <alpha-value>)',
          200: 'rgb(var(--n-200) / <alpha-value>)',
          300: 'rgb(var(--n-300) / <alpha-value>)',
          400: 'rgb(var(--n-400) / <alpha-value>)',
          500: 'rgb(var(--n-500) / <alpha-value>)',
          600: 'rgb(var(--n-600) / <alpha-value>)',
          700: 'rgb(var(--n-700) / <alpha-value>)',
          800: 'rgb(var(--n-800) / <alpha-value>)',
          900: 'rgb(var(--n-900) / <alpha-value>)',
          950: 'rgb(var(--n-950) / <alpha-value>)',
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
          // Progress highlight block is `w-1/4` of the container.
          // translateX(%) is relative to the element itself, so to move it from
          // left edge to right edge:
          //   distance = container - block = 3/4 container
          //   block width = 1/4 container => 3/4 ÷ 1/4 = 3 element-widths
          // => translateX(300%) puts the block at the right edge.
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '10%': { transform: 'translateX(0%)', opacity: '1' },
          '90%': { transform: 'translateX(300%)', opacity: '1' },
          '100%': { transform: 'translateX(300%)', opacity: '0' },
        },
      },
      animation: {
        'industrial-fill': 'industrial-fill 1.8s linear infinite',
      },
    },
  },
  plugins: [],
};
