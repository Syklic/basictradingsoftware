import { useState } from 'react'
import { AlertTriangle, TrendingUp, Zap, BarChart3, X, ArrowRight } from 'lucide-react'
import type { SmartSuggestion } from '../../types/onboarding'

interface SmartSuggestionsProps {
  suggestions: SmartSuggestion[]
  onDismiss: (suggestionId: string) => void
  onAction: (suggestion: SmartSuggestion) => void
}

/**
 * Smart Suggestions Component
 * Contextual alerts and recommendations based on user activity
 */
export default function SmartSuggestions({
  suggestions,
  onDismiss,
  onAction,
}: SmartSuggestionsProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const toggleExpanded = (id: string) => {
    const updated = new Set(expanded)
    if (updated.has(id)) {
      updated.delete(id)
    } else {
      updated.add(id)
    }
    setExpanded(updated)
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'opportunity':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'achievement':
        return <Zap className="h-4 w-4 text-yellow-600" />
      default:
        return <BarChart3 className="h-4 w-4 text-blue-600" />
    }
  }

  const getCardStyle = (type: string, priority: string) => {
    const baseClass = 'rounded-lg border p-4 transition-all'
    const highPriority = priority === 'high' ? 'ring-1 ring-offset-1' : ''

    if (type === 'warning') {
      return `${baseClass} ${highPriority} bg-red-50 border-red-200 ring-red-300`
    } else if (type === 'opportunity') {
      return `${baseClass} ${highPriority} bg-green-50 border-green-200 ring-green-300`
    } else if (type === 'achievement') {
      return `${baseClass} ${highPriority} bg-yellow-50 border-yellow-200 ring-yellow-300`
    }
    return `${baseClass} ${highPriority} bg-blue-50 border-blue-200 ring-blue-300`
  }

  if (suggestions.length === 0) {
    return null
  }

  // Sort by priority
  const sortedSuggestions = [...suggestions].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
  })

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4 text-blue-600" />
        <h3 className="font-semibold text-sm">Smart Suggestions</h3>
        <span className="ml-auto text-xs text-muted-foreground">
          {suggestions.length} new
        </span>
      </div>

      {/* Suggestions List */}
      <div className="space-y-2">
        {sortedSuggestions.map((suggestion) => {
          const isExpanded = expanded.has(suggestion.id)

          return (
            <div
              key={suggestion.id}
              className={getCardStyle(suggestion.type, suggestion.priority)}
            >
              <div
                className="flex items-start justify-between cursor-pointer"
                onClick={() => toggleExpanded(suggestion.id)}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 mt-0.5">{getIcon(suggestion.type)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-sm">{suggestion.title}</h4>
                      {suggestion.priority === 'high' && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-200 text-red-800 font-medium">
                          High Priority
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {suggestion.message}
                    </p>

                    {isExpanded && (
                      <div className="mt-3 space-y-2 pt-3 border-t border-current/10">
                        <p className="text-xs text-foreground">{suggestion.message}</p>

                        {suggestion.action && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onAction(suggestion)
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-current/20 hover:bg-current/5 transition-colors"
                          >
                            {suggestion.action.label}
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {suggestion.dismissible && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDismiss(suggestion.id)
                    }}
                    className="flex-shrink-0 p-1 hover:bg-white/50 rounded text-current/60 hover:text-current"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Suggestion Generator Utilities
 * Functions to generate smart suggestions based on user activity
 */
export const generateSuggestions = {
  /**
   * Position risk warning
   */
  positionWithoutStopLoss: (symbol: string): SmartSuggestion => ({
    id: `stop-loss-${symbol}-${Date.now()}`,
    type: 'warning',
    title: '⚠️ No Stop-Loss Set',
    message: `Your ${symbol} position doesn't have a stop-loss. Consider adding one to protect against unexpected moves.`,
    context: 'trading-positions',
    dismissible: true,
    priority: 'high',
    action: {
      label: 'Add Stop-Loss',
      callback: () => {},
    },
  }),

  /**
   * Portfolio concentration warning
   */
  highConcentration: (sector: string, percentage: number): SmartSuggestion => ({
    id: `concentration-${sector}-${Date.now()}`,
    type: 'warning',
    title: '🎯 Portfolio Heavily Concentrated',
    message: `Your portfolio is ${percentage.toFixed(1)}% concentrated in ${sector} stocks. Consider diversifying to reduce risk.`,
    context: 'portfolio',
    dismissible: true,
    priority: 'medium',
    action: {
      label: 'View Allocation',
      callback: () => {},
    },
  }),

  /**
   * Profitable signal opportunity
   */
  historicallyProfitableSignal: (
    pattern: string,
    winRate: number
  ): SmartSuggestion => ({
    id: `signal-${pattern}-${Date.now()}`,
    type: 'opportunity',
    title: '📈 High-Probability Signal',
    message: `This ${pattern} pattern has a ${winRate.toFixed(1)}% historical win rate. This could be a good trading opportunity.`,
    context: 'signals',
    dismissible: true,
    priority: 'high',
    action: {
      label: 'View Details',
      callback: () => {},
    },
  }),

  /**
   * Completed tutorial achievement
   */
  tutorialCompleted: (tutorialName: string): SmartSuggestion => ({
    id: `achievement-${tutorialName}-${Date.now()}`,
    type: 'achievement',
    title: '🏆 Achievement Unlocked',
    message: `Great job completing the "${tutorialName}" tutorial! You've earned a badge.`,
    context: 'tutorials',
    dismissible: true,
    priority: 'low',
  }),

  /**
   * First trade achievement
   */
  firstTradeExecuted: (): SmartSuggestion => ({
    id: `first-trade-${Date.now()}`,
    type: 'achievement',
    title: '🎉 First Trade Executed',
    message: 'Congratulations on executing your first trade! You\'re on your way to becoming a successful trader.',
    context: 'milestones',
    dismissible: true,
    priority: 'low',
  }),

  /**
   * Strategy suggestion
   */
  suggestStrategy: (strategy: string): SmartSuggestion => ({
    id: `strategy-${strategy}-${Date.now()}`,
    type: 'tip',
    title: '💡 Strategy Suggestion',
    message: `Based on your trading style, the "${strategy}" strategy might work well for you. Would you like to learn more?`,
    context: 'strategies',
    dismissible: true,
    priority: 'medium',
    action: {
      label: 'Learn More',
      callback: () => {},
    },
  }),

  /**
   * Risk management tip
   */
  riskManagementTip: (tip: string): SmartSuggestion => ({
    id: `risk-tip-${Date.now()}`,
    type: 'tip',
    title: '🛡️ Risk Management Tip',
    message: tip,
    context: 'risk-management',
    dismissible: true,
    priority: 'medium',
  }),
}
