import { Settings, Eye, EyeOff } from "lucide-react"
import { useLayoutStore } from "../store/layoutStore"

const WIDGET_DESCRIPTIONS: Record<string, { name: string; description: string }> = {
  portfolio: { name: "Portfolio Overview", description: "Your total portfolio value and allocation" },
  stats: { name: "Performance Metrics", description: "Key trading statistics and performance" },
  chart: { name: "Price Chart", description: "Portfolio or asset price visualization" },
  candlestick: { name: "Candlestick Chart", description: "OHLC candlestick chart for price action" },
  orders: { name: "Orders History", description: "Recent trades and order status" },
  signals: { name: "Trading Signals", description: "ML-generated buy/sell signals" },
  indices: { name: "Market Indices", description: "S&P 500, Nasdaq, and other indices" },
  allocation: { name: "Asset Allocation", description: "Pie chart of portfolio composition" },
  returns: { name: "Daily Returns", description: "Bar chart of daily P&L" },
  correlation: { name: "Correlation Matrix", description: "Asset correlation analysis" },
  heatmap: { name: "Performance Heatmap", description: "Sector/asset performance visualization" },
  journal: { name: "Trade Journal", description: "Detailed trade log and notes" },
  model: { name: "ML Model Status", description: "Active model info and training progress" },
}

export default function CurrentWidgetsDisplay() {
  const layout = useLayoutStore((state) => state.currentLayout())
  const toggleWidget = useLayoutStore((state) => state.toggleWidget)

  if (!layout) return null

  return (
    <div className="mt-8 border border-border rounded-lg bg-muted/30 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-6 w-6 text-accent" />
        <h2 className="text-lg font-semibold">Dashboard Widgets</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {layout.widgets.map((widget) => {
          const info = WIDGET_DESCRIPTIONS[widget.type] || { name: widget.type, description: "" }
          return (
            <div
              key={widget.id}
              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                widget.enabled
                  ? "border-accent/50 bg-accent/5 hover:border-accent/80"
                  : "border-border/50 bg-muted/20 hover:border-border/80 opacity-60"
              }`}
              onClick={() => toggleWidget(widget.type)}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{info.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{info.description}</p>
                </div>
                <button
                  className="flex-shrink-0 p-1.5 rounded-lg hover:bg-muted transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleWidget(widget.type)
                  }}
                >
                  {widget.enabled ? (
                    <Eye className="h-4 w-4 text-accent" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              <div className="text-xs text-muted-foreground pt-2 border-t border-border/30">
                Size: {widget.size.width}x{widget.size.height} cells
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-400">
          💡 <strong>Tip:</strong> Click any widget card to show/hide it. The layout will update instantly.
        </p>
      </div>
    </div>
  )
}
