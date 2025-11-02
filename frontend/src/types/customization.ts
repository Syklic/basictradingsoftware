/**
 * Customization & Personalization Types
 * Type definitions for layouts, themes, and user preferences
 */

/**
 * Layout Definition
 */
export interface Layout {
  id: string
  name: string
  description: string
  widgets: LayoutWidget[]
  gridSize: number
  createdAt: string
  updatedAt: string
  isDefault: boolean
  thumbnail?: string // Base64 or URL
  tags: string[]
  isShared: boolean
  shareCode?: string
}

/**
 * Layout Widget Configuration
 */
export interface LayoutWidget {
  id: string
  type: string
  enabled: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
  settings?: Record<string, any>
  isPinned: boolean
  refreshRate?: number // seconds
  colorOverride?: string
}

/**
 * Theme Definition
 */
export interface Theme {
  id: string
  name: string
  description: string
  isBuiltIn: boolean
  colors: ThemeColors
  typography: ThemeTypography
  density: 'compact' | 'comfortable' | 'spacious'
  createdAt: string
  updatedAt: string
  exportable: boolean
}

/**
 * Theme Colors Configuration
 */
export interface ThemeColors {
  background: string
  foreground: string
  card: string
  cardForeground: string
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  accent: string
  accentForeground: string
  muted: string
  mutedForeground: string
  destructive: string
  destructiveForeground: string
  border: string
  input: string
  ring: string
  // Chart colors
  chart: {
    bullish: string
    bearish: string
    neutral: string
    positive: string
    negative: string
  }
}

/**
 * Theme Typography Configuration
 */
export interface ThemeTypography {
  fontSize: 'small' | 'medium' | 'large'
  fontFamily: {
    sans: string
    mono: string
  }
  lineHeight: {
    tight: number
    normal: number
    relaxed: number
  }
  letterSpacing: {
    tight: number
    normal: number
    wide: number
  }
}

/**
 * Favorite Asset
 */
export interface FavoriteAsset {
  symbol: string
  name: string
  exchange: string
  addedAt: string
  order: number // For custom sorting
}

/**
 * Widget Preference
 */
export interface WidgetPreference {
  widgetId: string
  widgetType: string
  isPinned: boolean
  isFavorited: boolean
  refreshRate: number // seconds
  customColor?: string
  customSettings?: Record<string, any>
}

/**
 * User Customization Settings
 */
export interface CustomizationSettings {
  activeThemeId: string
  activeLayoutId: string
  autoSaveLayouts: boolean
  favoriteAssets: FavoriteAsset[]
  pinnedWidgets: string[]
  widgetPreferences: WidgetPreference[]
  lastUpdated: string
}

/**
 * Pre-built Themes
 */
export const PREBUILT_THEMES = {
  DARK_PRO: 'dark-pro',
  LIGHT_MINIMAL: 'light-minimal',
  SOLARIZED: 'solarized',
  HIGH_CONTRAST: 'high-contrast',
} as const

/**
 * Layout Export/Import Format
 */
export interface LayoutExport {
  version: string
  layout: Layout
  theme?: Theme
  settings?: CustomizationSettings
  exportedAt: string
  exportedBy?: string
}

/**
 * Density Options
 */
export type DensityOption = 'compact' | 'comfortable' | 'spacious'

/**
 * Font Size Options
 */
export type FontSizeOption = 'small' | 'medium' | 'large'
