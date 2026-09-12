import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    '../../packages/ds/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core Blacks
        black: {
          900: '#0B0B0B',
          800: '#141414',
          700: '#1A1A1A',
          600: '#232323',
          500: '#2A2A2A',
        },
        // Grays
        gray: {
          900: '#1F1F1F',
          800: '#2D2D2D',
          700: '#3C3C3C',
          600: '#4A4A4A',
          500: '#6B6B6B',
          400: '#8A8A8A',
          300: '#A3A3A3',
          200: '#D9D9D9',
          100: '#E8E8E8',
          50: '#F5F5F5',
        },
        // Brand Orange
        orange: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FF8C1A',
          500: '#FF6B00',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        // Semantic Colors
        critical: {
          DEFAULT: '#EF4444',
          light: '#FCA5A5',
          dark: '#DC2626',
        },
        success: {
          DEFAULT: '#22C55E',
          light: '#86EFAC',
          dark: '#16A34A',
        },
        warning: {
          DEFAULT: '#FACC15',
          light: '#FDE68A',
          dark: '#EAB308',
        },
        info: {
          DEFAULT: '#3B82F6',
          light: '#93C5FD',
          dark: '#2563EB',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in': 'slideIn 0.2s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(255, 107, 0, 0.2)' },
          '100%': { boxShadow: '0 0 40px rgba(255, 107, 0, 0.4)' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
