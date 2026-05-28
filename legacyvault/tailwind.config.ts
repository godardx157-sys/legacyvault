import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-body)', 'Georgia', 'serif'],
        display: ['var(--font-display)', 'Palatino', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        vault: {
          50:  '#f5f0eb',
          100: '#e8ddd0',
          200: '#d4bc9f',
          300: '#be996d',
          400: '#a97848',
          500: '#8b5e35',
          600: '#6e4928',
          700: '#52361d',
          800: '#362413',
          900: '#1c120a',
        },
        gold: {
          300: '#f5d78e',
          400: '#e9be5a',
          500: '#c9972a',
          600: '#a07420',
        },
        ink: {
          50:  '#f7f5f2',
          100: '#ede8e0',
          200: '#d6cdbf',
          300: '#b8a99a',
          400: '#967e6b',
          500: '#7a5f4c',
          600: '#5e4537',
          700: '#432f24',
          800: '#2c1e17',
          900: '#160f0b',
        }
      },
      backgroundImage: {
        'paper': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        'fade-in': { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'glow': { '0%,100%': { boxShadow: '0 0 20px rgba(201,151,42,0.3)' }, '50%': { boxShadow: '0 0 40px rgba(201,151,42,0.6)' } },
        'shimmer': { from: { backgroundPosition: '-200% center' }, to: { backgroundPosition: '200% center' } },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'glow': 'glow 3s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
      },
    },
  },
  plugins: [],
}
export default config
