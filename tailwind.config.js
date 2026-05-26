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
