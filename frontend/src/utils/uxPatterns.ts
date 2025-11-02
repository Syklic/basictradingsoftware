/**
 * Advanced UX Patterns Utilities
 * Bulk actions, search, comparison, and focus mode helpers
 */

import type {
  BulkAction,
  SearchResult,
  SearchFilters,
  MultiSelectState,
  ComparisonConfig,
  ComparisonItem,
  FocusModeSettings,
} from '../types/uxPatterns'

/**
 * Create bulk action
 */
export const createBulkAction = (
  type: BulkAction['type'],
  items: string[]
): BulkAction => {
  return {
    id: `bulk-${Date.now()}-${Math.random()}`,
    type,
    items,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
}

/**
 * Execute bulk action
 */
export const executeBulkAction = async (action: BulkAction): Promise<BulkAction> => {
  const updated = { ...action, status: 'processing' as const }

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const successful = Math.floor(action.items.length * 0.95)
    const failed = action.items.length - successful

    return {
      ...updated,
      status: 'completed',
      completedAt: new Date().toISOString(),
      results: {
        successful,
        failed,
        errors: failed > 0 ? [`${failed} items failed to process`] : undefined,
      },
    }
  } catch (error) {
    return {
      ...updated,
      status: 'failed',
      results: {
        successful: 0,
        failed: action.items.length,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      },
    }
  }
}

/**
 * Multi-select state manager
 */
export const createMultiSelectState = (allIds: string[]): MultiSelectState => ({
  selectedIds: new Set(),
  allIds: new Set(allIds),
  isSelectAll: false,
  lastSelectedId: undefined,
})

/**
 * Toggle selection
 */
export const toggleSelection = (state: MultiSelectState, id: string): MultiSelectState => {
  const newState = { ...state, selectedIds: new Set(state.selectedIds) }

  if (newState.selectedIds.has(id)) {
    newState.selectedIds.delete(id)
  } else {
    newState.selectedIds.add(id)
  }

  newState.isSelectAll = newState.selectedIds.size === newState.allIds.size
  newState.lastSelectedId = id

  return newState
}

/**
 * Select all
 */
export const selectAll = (state: MultiSelectState): MultiSelectState => ({
  ...state,
  selectedIds: new Set(state.allIds),
  isSelectAll: true,
})

/**
 * Deselect all
 */
export const deselectAll = (state: MultiSelectState): MultiSelectState => ({
  ...state,
  selectedIds: new Set(),
  isSelectAll: false,
})

/**
 * Search trades, signals, and positions
 */
export const performSearch = (
  query: string,
  items: unknown[],
  filters?: SearchFilters
): SearchResult[] => {
  const results: SearchResult[] = []
  const lowerQuery = query.toLowerCase()

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: 'trade-1',
      type: 'trade',
      title: 'BTC Long Trade',
      description: '100 BTC @ $45,000',
      relevance: 0.95,
      tags: ['btc', 'long', 'profitable'],
    },
    {
      id: 'signal-1',
      type: 'signal',
      title: 'Golden Cross Signal - AAPL',
      description: 'Buy signal generated',
      relevance: 0.85,
      tags: ['aapl', 'bullish', 'technical'],
    },
    {
      id: 'position-1',
      type: 'position',
      title: 'TSLA Position',
      description: '50 shares @ $240',
      relevance: 0.75,
      tags: ['tsla', 'tech'],
    },
  ]

  return mockResults.filter((result) => {
    const matchesQuery =
      result.title.toLowerCase().includes(lowerQuery) ||
      result.description?.toLowerCase().includes(lowerQuery)

    if (!matchesQuery) return false

    if (filters?.type && result.type !== filters.type) return false
    if (filters?.asset && !result.tags?.includes(filters.asset.toLowerCase())) return false

    return true
  })
}

/**
 * Save search query
 */
export const saveSearch = (query: string, filters: SearchFilters) => {
  const saved = {
    id: `search-${Date.now()}`,
    query,
    filters,
    createdAt: new Date().toISOString(),
    lastUsed: new Date().toISOString(),
    count: 1,
  }

  try {
    const searches = JSON.parse(localStorage.getItem('savedSearches') || '[]')
    searches.push(saved)
    localStorage.setItem('savedSearches', JSON.stringify(searches.slice(-20))) // Keep last 20
  } catch (error) {
    console.warn('Failed to save search:', error)
  }

  return saved
}

/**
 * Get saved searches
 */
export const getSavedSearches = () => {
  try {
    return JSON.parse(localStorage.getItem('savedSearches') || '[]')
  } catch {
    return []
  }
}

/**
 * Create comparison
 */
export const createComparison = (
  items: ComparisonItem[],
  metrics: string[]
): ComparisonConfig => ({
  items,
  metrics,
  chartType: 'line',
  showDifference: true,
})

/**
 * Calculate difference between comparison items
 */
export const calculateComparison = (config: ComparisonConfig) => {
  if (config.items.length < 2) return null

  const item1 = config.items[0]
  const item2 = config.items[1]

  const differences: Record<string, number | string> = {}

  config.metrics.forEach((metric) => {
    const val1 = item1.metrics[metric]
    const val2 = item2.metrics[metric]

    if (typeof val1 === 'number' && typeof val2 === 'number') {
      differences[metric] = val2 - val1
    }
  })

  return differences
}

/**
 * Focus mode settings
 */
export const defaultFocusMode: FocusModeSettings = {
  enabled: false,
  hideNavigation: false,
  hideSidebar: false,
  hideWatchlist: false,
  showOnlyChart: false,
  showQuickTrade: true,
  chartFullScreen: false,
}

/**
 * Apply focus mode
 */
export const applyFocusMode = (settings: FocusModeSettings) => {
  if (!settings.enabled) {
    document.body.classList.remove('focus-mode')
    return
  }

  document.body.classList.add('focus-mode')

  if (settings.hideNavigation) {
    document.body.style.setProperty('--hide-nav', '1')
  }
  if (settings.hideSidebar) {
    document.body.style.setProperty('--hide-sidebar', '1')
  }
  if (settings.chartFullScreen) {
    document.body.style.setProperty('--chart-fullscreen', '1')
  }
}

/**
 * Create keyboard shortcut helper
 */
export const createKeyboardShortcut = (
  key: string,
  callback: () => void,
  options?: { ctrl?: boolean; shift?: boolean; alt?: boolean; meta?: boolean }
) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    const matchesCtrl = options?.ctrl ? event.ctrlKey || event.metaKey : true
    const matchesShift = options?.shift ? event.shiftKey : !event.shiftKey
    const matchesAlt = options?.alt ? event.altKey : !event.altKey
    const matchesMeta = options?.meta ? event.metaKey : true

    if (
      event.key.toLowerCase() === key.toLowerCase() &&
      matchesCtrl &&
      matchesShift &&
      matchesAlt &&
      matchesMeta
    ) {
      event.preventDefault()
      callback()
    }
  }

  document.addEventListener('keydown', handleKeyDown)

  return () => document.removeEventListener('keydown', handleKeyDown)
}

/**
 * Create focus trap
 */
export const createFocusTrap = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  const firstElement = focusableElements[0] as HTMLElement
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }
  }

  element.addEventListener('keydown', handleKeyDown)

  return () => element.removeEventListener('keydown', handleKeyDown)
}

/**
 * Format search highlight
 */
export const highlightSearchMatch = (text: string, query: string): string => {
  if (!query) return text
  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}
