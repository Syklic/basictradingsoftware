import { X, RotateCcw, Save } from 'lucide-react'
import { useLayoutStore } from '../store/layoutStore'

interface WidgetManagerProps {
  onClose: () => void
}

const WIDGET_DESCRIPTIONS: Record<string, { name: string; description: string }> = {
  portfolio: { name: 'Portfolio Overview', description: 'Your total portfolio value and allocation' },
  stats: { name: 'Performance Metrics', description: 'Key trading statistics and performance' },
  chart: { name: 'Price Chart', description: 'Portfolio or asset price visualization' },
  orders: { name: 'Orders History', description: 'Recent trades and order status' },
  signals: { name: 'Trading Signals', description: 'ML-generated buy/sell signals' },
  indices: { name: 'Market Indices', description: 'S&P 500, Nasdaq, and other indices' },
  allocation: { name: 'Asset Allocation', description: 'Pie chart of portfolio composition' },
  returns: { name: 'Daily Returns', description: 'Bar chart of daily P&L' },
  correlation: { name: 'Correlation Matrix', description: 'Asset correlation analysis' },
  heatmap: { name: 'Performance Heatmap', description: 'Sector/asset performance visualization' },
  journal: { name: 'Trade Journal', description: 'Detailed trade log and notes' },
  model: { name: 'ML Model Status', description: 'Active model info and training progress' },
}

export default function WidgetManager({ onClose }: WidgetManagerProps) {
  const layout = useLayoutStore((state) => state.currentLayout())
  const toggleWidget = useLayoutStore((state) => state.toggleWidget)
  const resetToDefault = useLayoutStore((state) => state.resetToDefault)

  if (!layout) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold">Customize Dashboard</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-sm text-muted-foreground mb-6">
            Choose which widgets to display on your dashboard. Your preferences are saved automatically.
          </p>

          <div className="space-y-3">
            {layout.widgets.map((widget) => {
              const info = WIDGET_DESCRIPTIONS[widget.type] || { name: widget.type, description: '' }
              return (
                <label
                  key={widget.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={widget.enabled}
                    onChange={() => toggleWidget(widget.type)}
                    className="h-5 w-5 mt-0.5 rounded accent-accent"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{info.name}</div>
                    <div className="text-xs text-muted-foreground">{info.description}</div>
                  </div>
                </label>
              )
            })}
          </div>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              💡 <strong>Tip:</strong> You can customize widget size and position by clicking "Edit Layout" after saving.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-muted/30 p-6 space-y-3">
          <div className="flex gap-2">
            <button
              onClick={resetToDefault}
              className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg font-medium text-sm transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Reset to Default
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-accent text-accent-foreground hover:opacity-90 rounded-lg font-medium text-sm transition-opacity flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
