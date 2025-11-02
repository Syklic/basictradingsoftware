import { Zap, TrendingUp, Brain, AlertCircle } from 'lucide-react'
import { useLayoutStore } from '../../store/layoutStore'

interface Preset {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  widgetTypes: string[]
  audience: string
}

const PRESETS: Preset[] = [
  {
    id: 'day-trader',
    name: 'Day Trader',
    description: 'Focus on charts, order flow, and quick execution',
    icon: <Zap className="h-5 w-5" />,
    widgetTypes: ['chart', 'orders', 'stats', 'portfolio'],
    audience: 'Active traders making quick decisions',
  },
  {
    id: 'investor',
    name: 'Long-term Investor',
    description: 'Portfolio overview, allocation, performance metrics',
    icon: <TrendingUp className="h-5 w-5" />,
    widgetTypes: ['portfolio', 'allocation', 'returns', 'stats'],
    audience: 'Buy-and-hold investors tracking long-term growth',
  },
  {
    id: 'researcher',
    name: 'ML Researcher',
    description: 'Signals, model performance, correlation matrices',
    icon: <Brain className="h-5 w-5" />,
    widgetTypes: ['signals', 'model', 'correlation', 'heatmap'],
    audience: 'ML engineers and quant researchers',
  },
  {
    id: 'risk-mgr',
    name: 'Risk Manager',
    description: 'Risk metrics, exposure, drawdown charts',
    icon: <AlertCircle className="h-5 w-5" />,
    widgetTypes: ['stats', 'heatmap', 'portfolio', 'returns'],
    audience: 'Portfolio managers focused on risk',
  },
]

export default function WidgetPresets() {
  const currentLayout = useLayoutStore((state) => state.currentLayout())
  const createLayout = useLayoutStore((state) => state.createLayout)
  const updateLayout = useLayoutStore((state) => state.updateLayout)

  const handleApplyPreset = (preset: Preset) => {
    if (!currentLayout) return

    // Create a new layout from the preset
    const newLayoutId = createLayout(`${preset.name} Layout`)

    // Enable only the preset widgets
    if (currentLayout) {
      const updatedWidgets = currentLayout.widgets.map((w) => ({
        ...w,
        enabled: preset.widgetTypes.includes(w.type),
      }))

      updateLayout(newLayoutId, { widgets: updatedWidgets })
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Dashboard Presets</h2>
        <p className="text-sm text-muted-foreground">
          Start with a pre-configured layout tailored to your trading style
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handleApplyPreset(preset)}
            className="text-left p-4 bg-muted hover:bg-muted/80 rounded-lg border border-transparent hover:border-accent transition-all"
          >
            {/* Header with icon */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="text-accent">{preset.icon}</div>
                <h3 className="font-semibold">{preset.name}</h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
              {preset.description}
            </p>

            {/* Audience */}
            <p className="text-xs text-muted-foreground mb-3 italic">
              {preset.audience}
            </p>

            {/* Widgets */}
            <div className="mb-3">
              <div className="text-xs font-medium text-muted-foreground mb-1">
                Includes:
              </div>
              <div className="flex flex-wrap gap-1">
                {preset.widgetTypes.map((type) => (
                  <span
                    key={type}
                    className="px-2 py-1 bg-accent/20 text-accent text-xs rounded"
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </span>
                ))}
              </div>
            </div>

            {/* Apply Button */}
            <button className="w-full px-3 py-2 bg-accent text-accent-foreground rounded hover:opacity-90 transition-opacity text-sm font-medium">
              Apply Preset
            </button>
          </button>
        ))}
      </div>

      {/* Info box */}
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-xs text-blue-700 dark:text-blue-400">
          💡 <strong>Tip:</strong> Applying a preset creates a new layout. You can customize it
          further using the "Customize" and "Edit Layout" buttons in the navbar.
        </p>
      </div>
    </div>
  )
}
