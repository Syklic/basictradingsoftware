/**
 * Advanced UX Patterns Types
 * Undo/Redo, bulk actions, search, comparison, and focus mode
 */

/**
 * Action type for undo/redo history
 */
export type ActionType =
  | 'layout_change'
  | 'setting_update'
  | 'position_close'
  | 'signal_approve'
  | 'signal_reject'
  | 'widget_add'
  | 'widget_remove'
  | 'theme_change'

/**
 * History entry for undo/redo
 */
export interface HistoryEntry {
  id: string
  action: ActionType
  timestamp: number
  description: string
  state: unknown
  previousState?: unknown
}

/**
 * Undo/Redo manager state
 */
export interface UndoRedoState {
  history: HistoryEntry[]
  currentIndex: number
  maxSize: number
}

/**
 * Bulk action operation
 */
export interface BulkAction {
  id: string
  type: 'close_positions' | 'approve_signals' | 'reject_signals' | 'place_orders'
  items: string[] // Position/signal IDs
  status: 'pending' | 'processing' | 'completed' | 'failed'
  createdAt: string
  completedAt?: string
  results?: {
    successful: number
    failed: number
    errors?: string[]
  }
}

/**
 * Search result
 */
export interface SearchResult {
  id: string
  type: 'trade' | 'signal' | 'position' | 'asset' | 'setting' | 'layout'
  title: string
  description?: string
  icon?: string
  tags?: string[]
  relevance: number
  metadata?: Record<string, unknown>
}

/**
 * Search filters
 */
export interface SearchFilters {
  type?: 'trade' | 'signal' | 'position' | 'asset'
  dateRange?: {
    start: string
    end: string
  }
  asset?: string
  status?: string
  minValue?: number
  maxValue?: number
  tags?: string[]
}

/**
 * Saved search query
 */
export interface SavedSearch {
  id: string
  query: string
  filters: SearchFilters
  createdAt: string
  lastUsed: string
  count: number
}

/**
 * Comparison item
 */
export interface ComparisonItem {
  id: string
  label: string
  type: 'period' | 'asset' | 'strategy'
  metrics: Record<string, number | string>
  color?: string
}

/**
 * Comparison view configuration
 */
export interface ComparisonConfig {
  items: ComparisonItem[]
  metrics: string[]
  chartType: 'line' | 'bar' | 'area' | 'table'
  showDifference: boolean
}

/**
 * Focus mode settings
 */
export interface FocusModeSettings {
  enabled: boolean
  hideNavigation: boolean
  hideSidebar: boolean
  hideWatchlist: boolean
  showOnlyChart: boolean
  showQuickTrade: boolean
  chartFullScreen: boolean
  hiddenElements?: string[]
}

/**
 * Multi-select state
 */
export interface MultiSelectState {
  selectedIds: Set<string>
  allIds: Set<string>
  isSelectAll: boolean
  lastSelectedId?: string
}

/**
 * Global search state
 */
export interface GlobalSearchState {
  query: string
  results: SearchResult[]
  isLoading: boolean
  filters: SearchFilters
  recentSearches: SavedSearch[]
}
