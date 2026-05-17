/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Dark, low-noise editorial palette. Token names are retained for
        // backwards compat, but the actual values are now muted and neutral.
        ink: '#EDE7DC',
        paper: '#0A0D12',
        bone: '#141A22',
        ash: '#8B9199',
        rust: '#A98B69',
        kelp: '#25312C',
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'serif'],
        sans: ['"Geist"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.025em',
      },
      fontSize: {
        'display-xl': ['clamp(4rem, 14vw, 16rem)', { lineHeight: '0.85', letterSpacing: '-0.04em' }],
        'display-lg': ['clamp(3rem, 9vw, 9rem)', { lineHeight: '0.9', letterSpacing: '-0.03em' }],
      },
    },
  },
  plugins: [],
}
