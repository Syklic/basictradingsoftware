import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WidgetConfig {
  id: string
  type: 'portfolio' | 'stats' | 'chart' | 'orders' | 'signals' | 'indices' | 'allocation' | 'returns' | 'correlation' | 'heatmap' | 'journal' | 'model' | 'candlestick'
  enabled: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
  settings?: Record<string, any>
}

export interface DashboardLayout {
  id: string
  name: string
  description?: string
  isDefault: boolean
  widgets: WidgetConfig[]
  gridSize: number
  createdAt: string
  lastModified: string
}

interface LayoutStore {
  // State
  layouts: DashboardLayout[]
  currentLayoutId: string
  editMode: boolean

  // Current layout helpers
  currentLayout: () => DashboardLayout | undefined
  widgetEnabled: (widgetType: string) => boolean

  // Layout actions
  createLayout: (name: string, description?: string) => string
  deleteLayout: (layoutId: string) => void
  setCurrentLayout: (layoutId: string) => void
  updateLayout: (layoutId: string, updates: Partial<DashboardLayout>) => void
  renameLayout: (layoutId: string, newName: string) => void

  // Widget actions
  toggleWidget: (widgetType: string) => void
  updateWidgetSettings: (widgetType: string, settings: Record<string, any>) => void
  updateWidgetPosition: (widgetType: string, x: number, y: number) => void
  updateWidgetSize: (widgetType: string, width: number, height: number) => void
  resetToDefault: () => void

  // Edit mode
  setEditMode: (enabled: boolean) => void
}

const DEFAULT_LAYOUT: DashboardLayout = {
  id: 'default',
  name: 'Default Layout',
  description: 'Default dashboard layout',
  isDefault: true,
  gridSize: 12,
  createdAt: new Date().toISOString(),
  lastModified: new Date().toISOString(),
  widgets: [
    // Row 1: Portfolio + Stats
    {
      id: 'portfolio',
      type: 'portfolio',
      enabled: true,
      position: { x: 0, y: 0 },
      size: { width: 8, height: 2 },
      settings: { showBuyingPower: true, showInvested: true },
    },
    {
      id: 'stats',
      type: 'stats',
      enabled: true,
      position: { x: 8, y: 0 },
      size: { width: 4, height: 2 },
      settings: {},
    },
    // Row 2: Charts
    {
      id: 'chart-portfolio',
      type: 'chart',
      enabled: true,
      position: { x: 0, y: 2 },
      size: { width: 6, height: 3 },
      settings: { chartType: 'area', timeframe: '1h' },
    },
    {
      id: 'chart-returns',
      type: 'chart',
      enabled: true,
      position: { x: 6, y: 2 },
      size: { width: 6, height: 3 },
      settings: { chartType: 'bar', timeframe: '1h' },
    },
    // Row 3: Orders + Signals
    {
      id: 'orders',
      type: 'orders',
      enabled: true,
      position: { x: 0, y: 5 },
      size: { width: 6, height: 2 },
      settings: { maxRows: 5 },
    },
    {
      id: 'signals',
      type: 'signals',
      enabled: true,
      position: { x: 6, y: 5 },
      size: { width: 6, height: 2 },
      settings: { minConfidence: 70 },
    },
    // Additional widgets (disabled by default)
    {
      id: 'indices',
      type: 'indices',
      enabled: false,
      position: { x: 0, y: 7 },
      size: { width: 4, height: 2 },
      settings: {},
    },
    {
      id: 'allocation',
      type: 'allocation',
      enabled: false,
      position: { x: 4, y: 7 },
      size: { width: 4, height: 2 },
      settings: {},
    },
    {
      id: 'model-status',
      type: 'model',
      enabled: false,
      position: { x: 8, y: 7 },
      size: { width: 4, height: 2 },
      settings: {},
    },
    {
      id: 'correlation',
      type: 'correlation',
      enabled: false,
      position: { x: 0, y: 9 },
      size: { width: 6, height: 3 },
      settings: {},
    },
    {
      id: 'heatmap',
      type: 'heatmap',
      enabled: false,
      position: { x: 6, y: 9 },
      size: { width: 6, height: 3 },
      settings: {},
    },
    {
      id: 'journal',
      type: 'journal',
      enabled: false,
      position: { x: 0, y: 12 },
      size: { width: 12, height: 3 },
      settings: {},
    },
  ],
}

export const useLayoutStore = create<LayoutStore>()(
  persist(
    (set, get) => ({
      // Initial state
      layouts: [DEFAULT_LAYOUT],
      currentLayoutId: 'default',
      editMode: false,

      // Helpers
      currentLayout: () => {
        const { layouts, currentLayoutId } = get()
        return layouts.find((l) => l.id === currentLayoutId)
      },

      widgetEnabled: (widgetType: string) => {
        const layout = get().currentLayout()
        return layout?.widgets.some((w) => w.type === widgetType && w.enabled) ?? false
      },

      // Layout actions
      createLayout: (name: string, description?: string) => {
        const currentLayout = get().currentLayout()
        if (!currentLayout) return ''

        const newLayoutId = `layout-${Date.now()}`
        const newLayout: DashboardLayout = {
          id: newLayoutId,
          name,
          description,
          isDefault: false,
          widgets: JSON.parse(JSON.stringify(currentLayout.widgets)), // Deep copy
          gridSize: currentLayout.gridSize,
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
        }

        set((state) => ({
          layouts: [...state.layouts, newLayout],
          currentLayoutId: newLayoutId,
        }))

        return newLayoutId
      },

      deleteLayout: (layoutId: string) => {
        set((state) => {
          const filtered = state.layouts.filter((l) => l.id !== layoutId)
          let newCurrentId = state.currentLayoutId

          // If we delete the current layout, switch to default
          if (state.currentLayoutId === layoutId) {
            newCurrentId = 'default'
          }

          return {
            layouts: filtered,
            currentLayoutId: newCurrentId,
          }
        })
      },

      setCurrentLayout: (layoutId: string) => {
        set({ currentLayoutId: layoutId })
      },

      updateLayout: (layoutId: string, updates: Partial<DashboardLayout>) => {
        set((state) => ({
          layouts: state.layouts.map((l) =>
            l.id === layoutId
              ? {
                  ...l,
                  ...updates,
                  lastModified: new Date().toISOString(),
                }
              : l
          ),
        }))
      },

      renameLayout: (layoutId: string, newName: string) => {
        get().updateLayout(layoutId, { name: newName })
      },

      // Widget actions
      toggleWidget: (widgetType: string) => {
        const layout = get().currentLayout()
        if (!layout) return

        const updatedWidgets = layout.widgets.map((w) =>
          w.type === widgetType ? { ...w, enabled: !w.enabled } : w
        )

        get().updateLayout(layout.id, { widgets: updatedWidgets })
      },

      updateWidgetSettings: (widgetType: string, settings: Record<string, any>) => {
        const layout = get().currentLayout()
        if (!layout) return

        const updatedWidgets = layout.widgets.map((w) =>
          w.type === widgetType
            ? { ...w, settings: { ...w.settings, ...settings } }
            : w
        )

        get().updateLayout(layout.id, { widgets: updatedWidgets })
      },

      updateWidgetPosition: (widgetType: string, x: number, y: number) => {
        const layout = get().currentLayout()
        if (!layout) return

        // Get the widget being moved
        const movingWidget = layout.widgets.find((w) => w.type === widgetType)
        if (!movingWidget) return

        // Clamp position to grid bounds
        const clampedX = Math.max(0, Math.min(x, Math.max(0, layout.gridSize - movingWidget.size.width)))
        const clampedY = Math.max(0, y)

        // Simply update the widget position - allow overlaps
        const updatedWidgets = layout.widgets.map((w) =>
          w.type === widgetType
            ? { ...w, position: { x: clampedX, y: clampedY } }
            : w
        )

        get().updateLayout(layout.id, { widgets: updatedWidgets })
      },

      updateWidgetSize: (widgetType: string, width: number, height: number) => {
        const layout = get().currentLayout()
        if (!layout) return

        const updatedWidgets = layout.widgets.map((w) =>
          w.type === widgetType
            ? { ...w, size: { width, height } }
            : w
        )

        get().updateLayout(layout.id, { widgets: updatedWidgets })
      },

      resetToDefault: () => {
        set({
          layouts: [DEFAULT_LAYOUT],
          currentLayoutId: 'default',
          editMode: false,
        })
      },

      // Edit mode
      setEditMode: (enabled: boolean) => {
        set({ editMode: enabled })
      },
    }),
    {
      name: 'layout-store',
      version: 1,
    }
  )
)
