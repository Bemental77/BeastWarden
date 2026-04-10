/**
 * Medievalcore Theme System
 * A cohesive palette and typography system for the BeastWarden's medieval aesthetic
 */

export const medievalColors = {
  // Primary palette (Medievalcore)
  parchment: '#F2E3C6',
  iron: '#2D2926',
  ironBackground: '#3D3931',
  royalBurgundy: '#4A0E0E',
  burnishedGold: '#D4AF37',
  
  // Extended palette
  darkOak: '#3E2723',
  tarnishedSilver: '#78909C',
  bloodRed: '#B71C1C',
  alchemyGreen: '#1B5E20',
  vialBlue: '#0D3680',
  
  // Functional colors
  success: '#2E7D32',
  danger: '#C62828',
  warning: '#E65100',
  info: '#1565C0',
  
  // Neutral overlay
  blackOverlay: 'rgba(0, 0, 0, 0.05)', // 5% noise overlay
};

export const medievalTypography = {
  // Blackletter/Gothic for headers (fallback to system serif)
  headerFamily: 'GaramondPremiumPro, Georgia, serif',
  
  // EB Garamond-like serif for body (fallback to system serif)
  bodyFamily: 'Georgia, serif',
  
  // Monospace for UI elements
  monoFamily: 'Menlo, monospace',
  
  // Font sizes
  h1: { fontSize: 32, fontWeight: '700' } as const,
  h2: { fontSize: 24, fontWeight: '600' } as const,
  h3: { fontSize: 20, fontWeight: '600' } as const,
  body: { fontSize: 14, fontWeight: '400' } as const,
  caption: { fontSize: 12, fontWeight: '400' } as const,
  tiny: { fontSize: 10, fontWeight: '400' } as const,
};

export const medievalSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const medievalBorders = {
  radiusSmall: 2,
  radiusMedium: 4,
  radiusLarge: 8,
  radiusCircle: 999,
};

export const medievalShadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  heavy: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const medievalTheme = {
  colors: medievalColors,
  typography: medievalTypography,
  spacing: medievalSpacing,
  borders: medievalBorders,
  shadows: medievalShadows,
};

export type MedievalTheme = typeof medievalTheme;
