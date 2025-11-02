import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ViewType = 
  | 'dashboard' 
  | 'portfolio' 
  | 'trade-execution' 
  | 'signals-strategy' 
  | 'analytics' 
  | 'watchlists' 
  | 'settings'

export interface BreadcrumbItem {
  label: string
  view: ViewType
  params?: Record<string, string>
}

export interface NavigationState {
  currentView: ViewType
  breadcrumbs: BreadcrumbItem[]
  viewHistory: ViewType[]
  selectedAsset?: string
}

interface NavigationStore {
  // State
  currentView: ViewType
  breadcrumbs: BreadcrumbItem[]
  viewHistory: ViewType[]
  selectedAsset?: string

  // Navigation actions
  setView: (view: ViewType, assetId?: string) => void
  goBack: () => void
  addBreadcrumb: (item: BreadcrumbItem) => void
  clearBreadcrumbs: () => void
  resetNavigation: () => void
  setSelectedAsset: (assetId: string | undefined) => void
}

const DEFAULT_STATE: NavigationState = {
  currentView: 'dashboard',
  breadcrumbs: [{ label: 'Dashboard', view: 'dashboard' }],
  viewHistory: ['dashboard'],
  selectedAsset: undefined,
}

export const useNavigationStore = create<NavigationStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentView: 'dashboard',
      breadcrumbs: [{ label: 'Dashboard', view: 'dashboard' }],
      viewHistory: ['dashboard'],
      selectedAsset: undefined,

      // Navigation actions
      setView: (view: ViewType, assetId?: string) => {
        const state = get()

        // Add to history if different from current
        const newHistory = state.viewHistory
        if (state.currentView !== view) {
          newHistory.push(view)
        }

        // Update breadcrumbs
        const breadcrumbLabel = VIEW_LABELS[view]
        const newBreadcrumb: BreadcrumbItem = {
          label: assetId ? `${breadcrumbLabel} - ${assetId}` : breadcrumbLabel,
          view,
          params: assetId ? { assetId } : undefined,
        }

        set({
          currentView: view,
          viewHistory: newHistory.slice(-10), // Keep last 10 items
          breadcrumbs:
            view === 'dashboard'
              ? [{ label: 'Dashboard', view: 'dashboard' }]
              : [
                  { label: 'Dashboard', view: 'dashboard' },
                  newBreadcrumb,
                ],
          selectedAsset: assetId,
        })
      },

      goBack: () => {
        const state = get()
        const history = [...state.viewHistory]
        history.pop() // Remove current view

        if (history.length > 0) {
          const previousView = history[history.length - 1]
          set({
            currentView: previousView,
            viewHistory: history,
            breadcrumbs: [{ label: 'Dashboard', view: 'dashboard' }],
          })
        }
      },

      addBreadcrumb: (item: BreadcrumbItem) => {
        const state = get()
        const newBreadcrumbs = state.breadcrumbs.filter(
          (b) => b.view !== 'dashboard' || state.breadcrumbs[0] === b
        )
        newBreadcrumbs.push(item)

        set({ breadcrumbs: newBreadcrumbs })
      },

      clearBreadcrumbs: () => {
        set({
          breadcrumbs: [{ label: 'Dashboard', view: 'dashboard' }],
          currentView: 'dashboard',
          viewHistory: ['dashboard'],
          selectedAsset: undefined,
        })
      },

      resetNavigation: () => {
        set(DEFAULT_STATE)
      },

      setSelectedAsset: (assetId: string | undefined) => {
        set({ selectedAsset: assetId })
      },
    }),
    {
      name: 'navigation-store',
      version: 1,
    }
  )
)

// View labels for display
export const VIEW_LABELS: Record<ViewType, string> = {
  dashboard: 'Dashboard',
  portfolio: 'Portfolio',
  'trade-execution': 'Trade Execution',
  'signals-strategy': 'Signals & Strategy',
  analytics: 'Analytics',
  watchlists: 'Watchlists',
  settings: 'Settings',
}

// View descriptions for UI
export const VIEW_DESCRIPTIONS: Record<ViewType, string> = {
  dashboard: 'Overview of everything',
  portfolio: 'Deep dive into positions, P&L history, allocation breakdowns',
  'trade-execution':
    'Dedicated order entry interface with quick-access ticket',
  'signals-strategy': 'ML model insights, signal history, backtesting results',
  analytics: 'Performance metrics, risk analysis, trade journal',
  watchlists: 'Monitor specific assets with custom lists',
  settings: 'Comprehensive settings and preferences',
}

// View icons mapping
export const VIEW_ICONS: Record<ViewType, string> = {
  dashboard: 'LayoutDashboard',
  portfolio: 'Briefcase',
  'trade-execution': 'Zap',
  'signals-strategy': 'TrendingUp',
  analytics: 'BarChart3',
  watchlists: 'Eye',
  settings: 'Settings',
}
