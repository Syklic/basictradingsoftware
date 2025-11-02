/**
 * Enhanced Empty States Types
 * Actionable empty states with illustrations and guided actions
 */

/**
 * Empty state type
 */
export type EmptyStateType =
  | 'no_signals'
  | 'no_trades'
  | 'no_positions'
  | 'no_orders'
  | 'no_watchlist'
  | 'no_data'
  | 'no_connection'
  | 'no_activity'
  | 'no_analytics'

/**
 * Empty state action
 */
export interface EmptyStateAction {
  id: string
  label: string
  description?: string
  icon?: string
  color?: 'primary' | 'success' | 'warning' | 'info'
  onClick: () => void | Promise<void>
  variant?: 'primary' | 'secondary' | 'outline'
}

/**
 * Empty state with illustration
 */
export interface EnhancedEmptyState {
  type: EmptyStateType
  title: string
  description: string
  illustration?: string | React.ReactNode // SVG string or React component
  illustrationAlt?: string
  actions?: EmptyStateAction[]
  tips?: string[]
  estimatedTime?: string // e.g., "~2 seconds"
  showFilledStatePreview?: boolean
  previewImage?: string
  metadata?: {
    context?: string // e.g., "signals_panel"
    userTier?: 'free' | 'pro' | 'enterprise'
    isFirstTime?: boolean
  }
}

/**
 * Empty state context
 */
export type EmptyStateContext =
  | 'signals'
  | 'trades'
  | 'positions'
  | 'orders'
  | 'watchlist'
  | 'analytics'
  | 'data'
  | 'connection'
  | 'activity'

/**
 * Empty state configuration
 */
export interface EmptyStateConfig {
  showIllustration: boolean
  showActions: boolean
  showTips: boolean
  animateIllustration: boolean
  allowDismiss: boolean
}

/**
 * Filled state preview
 */
export interface FilledStatePreview {
  title: string
  description: string
  items: Array<{
    label: string
    value: string
    icon?: string
  }>
  image?: string
}
