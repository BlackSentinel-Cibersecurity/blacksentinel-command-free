// BlackSentinel Command - Design Tokens
// The foundation of the visual system

export const colors = {
  // Core Blacks
  black: {
    900: '#0B0B0B', // Primary black
    800: '#141414', // Secondary black
    700: '#1A1A1A', // Elevated black
    600: '#232323', // Dark gray
    500: '#2A2A2A', // Surface dark
  },

  // Grays
  gray: {
    900: '#1F1F1F',
    800: '#2D2D2D',
    700: '#3C3C3C', // Medium gray
    600: '#4A4A4A',
    500: '#6B6B6B',
    400: '#8A8A8A',
    300: '#A3A3A3',
    200: '#D9D9D9', // Light gray
    100: '#E8E8E8',
    50: '#F5F5F5',
  },

  // Brand Orange
  orange: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FF8C1A', // Bright orange
    500: '#FF6B00', // Primary orange
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
    bg: '#FEF2F2',
  },

  success: {
    DEFAULT: '#22C55E',
    light: '#86EFAC',
    dark: '#16A34A',
    bg: '#F0FDF4',
  },

  warning: {
    DEFAULT: '#FACC15',
    light: '#FDE68A',
    dark: '#EAB308',
    bg: '#FEFCE8',
  },

  info: {
    DEFAULT: '#3B82F6',
    light: '#93C5FD',
    dark: '#2563EB',
    bg: '#EFF6FF',
  },

  // Status Colors
  status: {
    online: '#22C55E',
    offline: '#6B7280',
    warning: '#F59E0B',
    critical: '#EF4444',
    maintenance: '#8B5CF6',
  },
} as const;

export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
} as const;

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
    display: ['Inter', 'system-ui', 'sans-serif'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }],
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  glow: '0 0 20px rgb(255 107 0 / 0.3)',
  'glow-lg': '0 0 40px rgb(255 107 0 / 0.4)',
  'inner-glow': 'inset 0 0 20px rgb(255 107 0 / 0.1)',
} as const;

export const radii = {
  none: '0px',
  sm: '4px',
  DEFAULT: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  full: '9999px',
} as const;

export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
  command: 9000,
} as const;

export const animation = {
  duration: {
    instant: '50ms',
    fast: '100ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  easing: {
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  '3xl': '1920px',
  '4xl': '2560px',
} as const;
