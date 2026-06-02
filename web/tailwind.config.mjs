/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces Variable"', 'ui-serif', 'Georgia', 'serif'],
        serif: ['"Newsreader Variable"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Newsreader Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        parchment: {
          50: '#FBF8F1',
          100: '#F5F0E6',
          200: '#EDE5D3',
          300: '#DCD0B6',
          400: '#C2B393',
          500: '#A89770',
          600: '#7E7050',
          700: '#564B36',
        },
        ink: {
          50: '#F4F3F0',
          100: '#E4E1DA',
          200: '#C2BDB1',
          300: '#8B857A',
          400: '#56504A',
          500: '#36322C',
          600: '#26221E',
          700: '#1A1814',
          800: '#100E0B',
          900: '#080705',
        },
        terracotta: {
          50: '#FBE9E5',
          100: '#F4C8BD',
          200: '#E89F8C',
          300: '#D87860',
          400: '#C44536',
          500: '#A63526',
          600: '#822919',
          700: '#5C1C11',
        },
        gold: {
          50: '#FBF3DC',
          100: '#F2DFA2',
          200: '#E5C466',
          300: '#D8A82B',
          400: '#B8860B',
          500: '#8E6708',
        },
        ocean: {
          50: '#E5EAF0',
          100: '#B7C4D2',
          200: '#7E94AB',
          300: '#4A6786',
          400: '#264666',
          500: '#0E1420',
        },
      },
      fontSize: {
        'micro': ['0.6875rem', { lineHeight: '1.2' }],
        'display-xl': ['clamp(3.5rem, 8vw, 7rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '1.0', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(1.75rem, 3vw, 2.5rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
      },
      maxWidth: {
        'reading': '68ch',
        'wide': '88ch',
      },
      keyframes: {
        'reveal': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'breath': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'reveal': 'reveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        'marquee': 'marquee 40s linear infinite',
        'shimmer': 'shimmer 8s linear infinite',
        'breath': 'breath 4s ease-in-out infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
