/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ivory:    '#F7F0E6',
        ivory2:   '#EEE5D3',
        warm:     '#D4B896',
        gold:     '#C5A055',
        'gold-dark': '#B08A3E',
        blush:    '#D4A5A5',
        sage:     '#8BA89A',
        charcoal: '#3D3530',
        muted:    '#7A6E68',
        faint:    '#A09488',
        // logo thread colours — used sparingly as accents
        'thread-pink':   '#D4537E',
        'thread-amber':  '#EF9F27',
        'thread-purple': '#7F77DD',
        'thread-teal':   '#1D9E75',
        'thread-green':  '#639922',
      },
      fontFamily: {
        serif:  ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans:   ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.2em',
        widest3: '0.25em',
      },
      animation: {
        'marquee':      'marquee 22s linear infinite',
        'fadeUp':       'fadeUp 0.8s ease forwards',
        'threadDrift':  'threadDrift 12s ease-in-out infinite',
        'scrollHint':   'scrollHint 2s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        scrollHint: {
          '0%,100%': { opacity: '0.3', transform: 'scaleY(1)' },
          '50%':     { opacity: '0.7', transform: 'scaleY(1.15)' },
        },
      },
    },
  },
  plugins: [],
};
