import { useState } from 'react'
import { X, ChevronRight, Lightbulb, BookOpen } from 'lucide-react'
import { useLayoutStore } from '../../store/layoutStore'

interface Suggestion {
  id: string
  widgetType: string
  title: string
  description: string
  icon: string
  reason: string
}

const WIDGET_SUGGESTIONS: Suggestion[] = [
  {
    id: 'alloc-1',
    widgetType: 'allocation',
    title: 'Allocation Widget',
    description: 'Visualize your portfolio diversification across asset classes',
    icon: 'PieChart',
    reason: 'You haven\'t enabled this yet. It shows how well diversified your portfolio is.',
  },
  {
    id: 'corr-1',
    widgetType: 'correlation',
    title: 'Correlation Matrix',
    description: 'Understand how your assets move together',
    icon: 'Grid3x3',
    reason: 'Great for understanding asset relationships and reducing correlation risk.',
  },
  {
    id: 'heat-1',
    widgetType: 'heatmap',
    title: 'Performance Heatmap',
    description: 'See sector and asset performance at a glance',
    icon: 'Activity',
    reason: 'Visual way to identify hot and cold sectors in your portfolio.',
  },
]

export default function WidgetSuggestions() {
  const [suggestions, setSuggestions] = useState(WIDGET_SUGGESTIONS)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState(0)
  const currentLayout = useLayoutStore((state) => state.currentLayout())
  const toggleWidget = useLayoutStore((state) => state.toggleWidget)

  const disabledSuggestions = suggestions.filter((s) => {
    const widget = currentLayout?.widgets.find((w) => w.type === s.widgetType)
    return widget && !widget.enabled
  })

  const handleEnableWidget = (widgetType: string) => {
    toggleWidget(widgetType)
    setSuggestions(suggestions.filter((s) => s.widgetType !== widgetType))
  }

  const handleDismiss = (id: string) => {
    setSuggestions(suggestions.filter((s) => s.id !== id))
  }

  if (disabledSuggestions.length === 0 && !showOnboarding) {
    return null
  }

  return (
    <div className="space-y-3">
      {/* Widget Suggestions */}
      {disabledSuggestions.map((suggestion) => (
        <div
          key={suggestion.id}
          className="bg-blue-500/5 border border-blue-500/30 rounded-lg p-4 flex items-start gap-3"
        >
          {/* Icon */}
          <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-semibold text-sm text-foreground">
                {suggestion.title}
              </h3>
              <button
                onClick={() => handleDismiss(suggestion.id)}
                className="p-1 hover:bg-blue-500/10 rounded transition-colors flex-shrink-0"
                title="Dismiss suggestion"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground mb-2">{suggestion.reason}</p>
            <p className="text-xs text-muted-foreground mb-3">{suggestion.description}</p>

            <div className="flex gap-2">
              <button
                onClick={() => handleEnableWidget(suggestion.widgetType)}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors"
              >
                <ChevronRight className="h-3 w-3" />
                Enable Widget
              </button>
              <button
                onClick={() => handleDismiss(suggestion.id)}
                className="px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-400 rounded text-xs font-medium transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Onboarding Hint */}
      {suggestions.length > 0 && (
        <button
          onClick={() => setShowOnboarding(!showOnboarding)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg transition-colors text-sm font-medium"
        >
          <BookOpen className="h-4 w-4" />
          {showOnboarding ? 'Hide' : 'Take Dashboard Tour'}
        </button>
      )}

      {/* Onboarding Tour */}
      {showOnboarding && (
        <div className="bg-card border-2 border-accent rounded-lg p-4 space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-accent" />
            Dashboard Tour
          </h3>

          <div className="space-y-3">
            {[
              {
                title: 'Customize Your Dashboard',
                description:
                  'Click "Customize" in the navbar to toggle widgets on/off and choose what to see.',
              },
              {
                title: 'Edit Layout',
                description:
                  'Click "Edit" to arrange widgets exactly how you want them. Drag to reposition and resize.',
              },
              {
                title: 'Multiple Layouts',
                description:
                  'Create different dashboard layouts for different trading styles using the layout switcher.',
              },
              {
                title: 'Widget Settings',
                description:
                  'Each widget has its own settings. Click the settings icon to customize timeframes and assets.',
              },
              {
                title: 'Real-time Insights',
                description:
                  'Your dashboard updates in real-time with market data, signals, and performance metrics.',
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg transition-all ${
                  onboardingStep === idx
                    ? 'bg-accent/20 border border-accent'
                    : 'bg-muted border border-transparent'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-accent/30 flex items-center justify-center text-xs font-bold text-accent">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{step.title}</h4>
                    {onboardingStep === idx && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <button
              onClick={() => setOnboardingStep(Math.max(0, onboardingStep - 1))}
              disabled={onboardingStep === 0}
              className="px-3 py-1 bg-muted hover:bg-muted/80 disabled:opacity-50 rounded text-xs font-medium transition-colors"
            >
              Previous
            </button>

            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <button
                  key={i}
                  onClick={() => setOnboardingStep(i)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    i === onboardingStep ? 'bg-accent w-4' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setOnboardingStep(Math.min(4, onboardingStep + 1))}
              disabled={onboardingStep === 4}
              className="px-3 py-1 bg-accent hover:opacity-90 disabled:opacity-50 text-accent-foreground rounded text-xs font-medium transition-opacity"
            >
              {onboardingStep === 4 ? 'Done' : 'Next'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
