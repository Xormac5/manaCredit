import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'mana': {
          'bg': '#0B0C10',          // Charcoal scuro (sfondo)
          'card': '#14161C',        // Card dark
          'card-hover': '#1f222b',  // Card hover
          'primary': '#8B5CF6',     // Viola elettrico
          'primary-hover': '#7C3AED',
          'green': '#10B981',       // Verde smeraldo (carico +)
          'green-hover': '#059669',
          'orange': '#F97316',      // Arancione caldo (scarico -)
          'orange-hover': '#EA580C',
          'danger': '#EF4444',      // Rosso errore/scala
          'danger-hover': '#DC2626',
        },
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'spin-slow': {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'spin-slow': 'spin-slow 1s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
