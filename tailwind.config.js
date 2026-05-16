/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Core background system
        void:    '#030508',
        abyss:   '#05080f',
        deep:    '#080e1a',
        surface: '#0d1526',
        panel:   '#111d33',
        // Accent palette — refined neon-cyan / electric-indigo
        neon: {
          cyan:    '#00e5ff',
          blue:    '#4361ee',
          violet:  '#7b2fff',
          gold:    '#f5a623',
          green:   '#00d68f',
          pink:    '#ff3e9d',
        },
        // Muted text hierarchy
        muted:  '#64748b',
        subtle: '#94a3b8',
        body:   '#cbd5e1',
        bright: '#e2e8f0',
        pure:   '#f8fafc',
      },
      fontFamily: {
        sans:    ['"Inter"', '"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Syne"', '"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
        '6xl': ['3.75rem',  { lineHeight: '1', letterSpacing: '-0.02em' }],
        '7xl': ['4.5rem',   { lineHeight: '1', letterSpacing: '-0.025em' }],
        '8xl': ['6rem',     { lineHeight: '1', letterSpacing: '-0.03em' }],
        '9xl': ['8rem',     { lineHeight: '1', letterSpacing: '-0.04em' }],
      },
      spacing: {
        '4.5':   '1.125rem',
        '18':    '4.5rem',
        section: '8rem',
        'section-sm': '5rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      boxShadow: {
        'glow-xs':  '0 0 12px rgba(0, 229, 255, 0.25)',
        'glow-sm':  '0 0 24px rgba(0, 229, 255, 0.22)',
        'glow':     '0 0 48px rgba(0, 229, 255, 0.18)',
        'glow-lg':  '0 0 96px rgba(67, 97, 238, 0.25)',
        'glow-xl':  '0 0 180px rgba(67, 97, 238, 0.2)',
        'glass':    'inset 0 1px 0 rgba(255,255,255,0.07), 0 32px 80px rgba(3,5,8,0.55)',
        'glass-lg': 'inset 0 1px 0 rgba(255,255,255,0.05), 0 64px 140px rgba(3,5,8,0.65)',
        'inner-glow': 'inset 0 0 40px rgba(0, 229, 255, 0.06)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':  'conic-gradient(var(--tw-gradient-stops))',
        'hero-mesh':       'radial-gradient(circle at 20% 50%, rgba(0,229,255,0.12) 0%, transparent 40%), radial-gradient(circle at 80% 20%, rgba(67,97,238,0.15) 0%, transparent 40%), radial-gradient(circle at 50% 100%, rgba(123,47,255,0.1) 0%, transparent 40%)',
        'card-gradient':   'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 100%)',
        'cta-gradient':    'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(67,97,238,0.2), rgba(123,47,255,0.15))',
      },
      animation: {
        'pulse-slow':    'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'spin-slow':     'spin 12s linear infinite',
        'float':         'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'shimmer':       'shimmer 2s linear infinite',
        'scan':          'scan 4s linear infinite',
        'aurora':        'aurora 12s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        scan: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        aurora: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
      },
      transitionTimingFunction: {
        'smooth-spring': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'snappy':        'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
