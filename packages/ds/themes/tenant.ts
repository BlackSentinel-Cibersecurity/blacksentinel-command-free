// ============================================================================
// BlackSentinel Command - Tenant Theming System
// Customizable colors and branding per tenant
// ============================================================================

import { TenantTier, TenantBranding } from '../types/tenant';

// ============================================================================
// Default Theme (BlackSentinel Brand)
// ============================================================================

export interface ThemeColors {
  // Core
  background: string;
  foreground: string;
  
  // Primary
  primary: string;
  primaryHover: string;
  primaryForeground: string;
  
  // Secondary
  secondary: string;
  secondaryHover: string;
  secondaryForeground: string;
  
  // Accent
  accent: string;
  accentHover: string;
  accentForeground: string;
  
  // Semantic
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  critical: string;
  criticalLight: string;
  info: string;
  infoLight: string;
  
  // Surface
  surface: string;
  surfaceHover: string;
  surfaceBorder: string;
  
  // Card
  card: string;
  cardHover: string;
  cardBorder: string;
  
  // Sidebar
  sidebar: string;
  sidebarBorder: string;
  sidebarActive: string;
  
  // Header
  header: string;
  headerBorder: string;
}

export const DEFAULT_THEME: ThemeColors = {
  // Core
  background: '#0B0B0B',
  foreground: '#FFFFFF',
  
  // Primary (Orange)
  primary: '#FF6B00',
  primaryHover: '#FF8C1A',
  primaryForeground: '#FFFFFF',
  
  // Secondary (Gray)
  secondary: '#1A1A1A',
  secondaryHover: '#232323',
  secondaryForeground: '#FFFFFF',
  
  // Accent (Orange Light)
  accent: '#FF6B00',
  accentHover: '#FF8C1A',
  accentForeground: '#FFFFFF',
  
  // Semantic
  success: '#22C55E',
  successLight: '#86EFAC',
  warning: '#FACC15',
  warningLight: '#FDE68A',
  critical: '#EF4444',
  criticalLight: '#FCA5A5',
  info: '#3B82F6',
  infoLight: '#93C5FD',
  
  // Surface
  surface: '#141414',
  surfaceHover: '#1A1A1A',
  surfaceBorder: '#232323',
  
  // Card
  card: '#1F1F1F',
  cardHover: '#2D2D2D',
  cardBorder: '#3C3C3C',
  
  // Sidebar
  sidebar: '#141414',
  sidebarBorder: '#232323',
  sidebarActive: '#FF6B00',
  
  // Header
  header: '#141414',
  headerBorder: '#232323',
};

// ============================================================================
// Predefined Tenant Themes
// ============================================================================

export const TENANT_THEMES: Record<TenantTier, Partial<ThemeColors>> = {
  starter: {
    // Default theme
  },
  professional: {
    // Default theme
  },
  enterprise: {
    // Default theme with enhanced visuals
  },
  government: {
    // More conservative, darker theme
    primary: '#3B82F6',
    primaryHover: '#2563EB',
    accent: '#3B82F6',
    accentHover: '#2563EB',
    sidebarActive: '#3B82F6',
  },
};

// ============================================================================
// Industry-Specific Themes
// ============================================================================

export interface IndustryTheme {
  name: string;
  description: string;
  colors: Partial<ThemeColors>;
}

export const INDUSTRY_THEMES: Record<string, IndustryTheme> = {
  financial: {
    name: 'Financial Services',
    description: 'Professional blue theme for banking and finance',
    colors: {
      primary: '#1E40AF',
      primaryHover: '#1D4ED8',
      accent: '#1E40AF',
      accentHover: '#1D4ED8',
      sidebarActive: '#1E40AF',
    },
  },
  healthcare: {
    name: 'Healthcare',
    description: 'Clean, calming theme for healthcare organizations',
    colors: {
      primary: '#059669',
      primaryHover: '#047857',
      accent: '#059669',
      accentHover: '#047857',
      sidebarActive: '#059669',
    },
  },
  government: {
    name: 'Government',
    description: 'Official, conservative theme for government agencies',
    colors: {
      primary: '#1D4ED8',
      primaryHover: '#1E40AF',
      accent: '#1D4ED8',
      accentHover: '#1E40AF',
      sidebarActive: '#1D4ED8',
    },
  },
  technology: {
    name: 'Technology',
    description: 'Modern, vibrant theme for tech companies',
    colors: {
      primary: '#8B5CF6',
      primaryHover: '#7C3AED',
      accent: '#8B5CF6',
      accentHover: '#7C3AED',
      sidebarActive: '#8B5CF6',
    },
  },
  energy: {
    name: 'Energy & Utilities',
    description: 'Industrial theme for energy sector',
    colors: {
      primary: '#F59E0B',
      primaryHover: '#D97706',
      accent: '#F59E0B',
      accentHover: '#D97706',
      sidebarActive: '#F59E0B',
    },
  },
  manufacturing: {
    name: 'Manufacturing',
    description: 'Industrial theme for manufacturing',
    colors: {
      primary: '#6366F1',
      primaryHover: '#4F46E5',
      accent: '#6366F1',
      accentHover: '#4F46E5',
      sidebarActive: '#6366F1',
    },
  },
};

// ============================================================================
// Theme Generator
// ============================================================================

export function generateTenantTheme(
  branding: TenantBranding,
  baseTheme: ThemeColors = DEFAULT_THEME
): ThemeColors {
  const primaryColor = branding.primaryColor || baseTheme.primary;
  
  return {
    ...baseTheme,
    primary: primaryColor,
    primaryHover: adjustColor(primaryColor, 10),
    accent: primaryColor,
    accentHover: adjustColor(primaryColor, 10),
    sidebarActive: primaryColor,
  };
}

// ============================================================================
// CSS Variable Generator
// ============================================================================

export function generateCSSVariables(theme: ThemeColors): string {
  return `
:root {
  /* Core */
  --background: ${theme.background};
  --foreground: ${theme.foreground};
  
  /* Primary */
  --primary: ${theme.primary};
  --primary-hover: ${theme.primaryHover};
  --primary-foreground: ${theme.primaryForeground};
  
  /* Secondary */
  --secondary: ${theme.secondary};
  --secondary-hover: ${theme.secondaryHover};
  --secondary-foreground: ${theme.secondaryForeground};
  
  /* Accent */
  --accent: ${theme.accent};
  --accent-hover: ${theme.accentHover};
  --accent-foreground: ${theme.accentForeground};
  
  /* Semantic */
  --success: ${theme.success};
  --success-light: ${theme.successLight};
  --warning: ${theme.warning};
  --warning-light: ${theme.warningLight};
  --critical: ${theme.critical};
  --critical-light: ${theme.criticalLight};
  --info: ${theme.info};
  --info-light: ${theme.infoLight};
  
  /* Surface */
  --surface: ${theme.surface};
  --surface-hover: ${theme.surfaceHover};
  --surface-border: ${theme.surfaceBorder};
  
  /* Card */
  --card: ${theme.card};
  --card-hover: ${theme.cardHover};
  --card-border: ${theme.cardBorder};
  
  /* Sidebar */
  --sidebar: ${theme.sidebar};
  --sidebar-border: ${theme.sidebarBorder};
  --sidebar-active: ${theme.sidebarActive};
  
  /* Header */
  --header: ${theme.header};
  --header-border: ${theme.headerBorder};
}
`;
}

// ============================================================================
// Tailwind Config Generator
// ============================================================================

export function generateTailwindConfig(theme: ThemeColors): Record<string, any> {
  return {
    theme: {
      extend: {
        colors: {
          background: theme.background,
          foreground: theme.foreground,
          primary: {
            DEFAULT: theme.primary,
            hover: theme.primaryHover,
            foreground: theme.primaryForeground,
          },
          secondary: {
            DEFAULT: theme.secondary,
            hover: theme.secondaryHover,
            foreground: theme.secondaryForeground,
          },
          accent: {
            DEFAULT: theme.accent,
            hover: theme.accentHover,
            foreground: theme.accentForeground,
          },
          success: {
            DEFAULT: theme.success,
            light: theme.successLight,
          },
          warning: {
            DEFAULT: theme.warning,
            light: theme.warningLight,
          },
          critical: {
            DEFAULT: theme.critical,
            light: theme.criticalLight,
          },
          info: {
            DEFAULT: theme.info,
            light: theme.infoLight,
          },
          surface: {
            DEFAULT: theme.surface,
            hover: theme.surfaceHover,
            border: theme.surfaceBorder,
          },
          card: {
            DEFAULT: theme.card,
            hover: theme.cardHover,
            border: theme.cardBorder,
          },
          sidebar: {
            DEFAULT: theme.sidebar,
            border: theme.sidebarBorder,
            active: theme.sidebarActive,
          },
          header: {
            DEFAULT: theme.header,
            border: theme.headerBorder,
          },
        },
      },
    },
  };
}

// ============================================================================
// Logo & Branding Assets
// ============================================================================

export interface BrandingAssets {
  logo: {
    dark: string; // URL for dark background
    light: string; // URL for light background
    icon: string; // Favicon/icon
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
}

export const DEFAULT_BRANDING: BrandingAssets = {
  logo: {
    dark: '/icons/logo.png',
    light: '/icons/logo-light.png',
    icon: '/favicon.svg',
  },
  colors: {
    primary: '#FF6B00',
    secondary: '#0B0B0B',
    accent: '#FF6B00',
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter',
    mono: 'JetBrains Mono',
  },
};

// ============================================================================
// Helper Functions
// ============================================================================

function adjustColor(color: string, amount: number): string {
  // Simple color adjustment (in production, use a proper color library)
  const hex = color.replace('#', '');
  const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + amount);
  const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + amount);
  const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function generateThemeCSS(tenantId: string, branding: TenantBranding): string {
  const theme = generateTenantTheme(branding);
  return `
/* Tenant: ${tenantId} */
${generateCSSVariables(theme)}
`;
}
