import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Akira brand
        akira: {
          50:  '#f0ebff',
          100: '#ddd3ff',
          200: '#c4b0ff',
          300: '#a685ff',
          400: '#8b5cf6',
          500: '#7c3aed',
          600: '#6d28d9',
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#2e1065',
          950: '#1a0838',
        },
        // Surface tokens
        surface: {
          DEFAULT: 'rgba(255,255,255,0.06)',
          hover:   'rgba(255,255,255,0.10)',
          active:  'rgba(255,255,255,0.14)',
          border:  'rgba(255,255,255,0.12)',
          strong:  'rgba(255,255,255,0.18)',
        },
        // Semantic
        notes:  '#10b981',
        web:    '#3b82f6',
        mixed:  '#f59e0b',
      },
      fontFamily: {
        display: ['var(--font-syne)', 'sans-serif'],
        body:    ['var(--font-inter)', 'sans-serif'],
        mono:    ['var(--font-mono)', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'akira-gradient': 'linear-gradient(135deg, #0f0c29 0%, #1a0838 40%, #0d1b3e 100%)',
        'card-gradient':  'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(59,130,246,0.08) 100%)',
        'glow-purple':    'radial-gradient(ellipse at center, rgba(124,58,237,0.3) 0%, transparent 70%)',
        'glow-blue':      'radial-gradient(ellipse at center, rgba(59,130,246,0.2) 0%, transparent 70%)',
      },
      boxShadow: {
        'glass':       '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
        'glass-hover': '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
        'glow-sm':     '0 0 16px rgba(124,58,237,0.4)',
        'glow-md':     '0 0 32px rgba(124,58,237,0.3)',
        'glow-lg':     '0 0 64px rgba(124,58,237,0.2)',
        'inner-glow':  'inset 0 0 24px rgba(124,58,237,0.1)',
      },
      backdropBlur: {
        xs: '2px',
        glass: '20px',
      },
      animation: {
        'fade-in':     'fadeIn 0.3s ease-out',
        'slide-up':    'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-right': 'slideRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-slow':  'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer':     'shimmer 1.5s infinite',
        'dot-bounce':  'dotBounce 1.4s ease-in-out infinite',
        'glow-pulse':  'glowPulse 2s ease-in-out infinite',
        'float':       'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          '0%':   { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        dotBounce: {
          '0%, 80%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '40%':            { transform: 'translateY(-8px)', opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%':      { opacity: '1',   transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
      },
      borderRadius: {
        'glass': '16px',
        '2xl':   '1rem',
        '3xl':   '1.5rem',
        '4xl':   '2rem',
      },
      spacing: {
        'sidebar': '260px',
      },
    },
  },
  plugins: [],
}

export default config