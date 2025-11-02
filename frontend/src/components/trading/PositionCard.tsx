import { useState } from 'react'
import { TrendingUp, TrendingDown, X, Plus, Minus, Lock, MoreVertical } from 'lucide-react'
import type { Position } from '../../types/trading'
import { calculatePnL, isPositive } from '../../utils/calculations'

interface PositionCardProps {
  position: Position
  onClose?: (id: string) => void
  onAdd?: (id: string) => void
  onReduce?: (id: string) => void
  onSetStops?: (id: string) => void
}

export default function PositionCard({
  position,
  onClose,
  onAdd,
  onReduce,
  onSetStops,
}: PositionCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const { pnl, pnlPercent } = calculatePnL(position.value, position.shares, position.entryPrice)
  const isProfit = isPositive(pnl)

  // Mini chart data (normalized for visual)
  const chartMin = Math.min(...position.priceHistory)
  const chartMax = Math.max(...position.priceHistory)
  const chartRange = chartMax - chartMin || 1

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-accent/50 transition-colors">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent/5 to-transparent p-4 border-b border-border flex items-start justify-between">
        <div className="flex-1">
          <div className="text-lg font-bold">{position.symbol}</div>
          <div className="text-xs text-muted-foreground">
            {position.shares} shares @ ${position.entryPrice.toFixed(2)}
          </div>
        </div>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1 hover:bg-muted rounded transition-colors relative"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      {/* Mini Chart */}
      <div className="h-20 bg-muted/30 relative overflow-hidden p-2">
        <svg className="w-full h-full" preserveAspectRatio="none">
          {/* Grid lines */}
          <line
            x1="0"
            y1="50%"
            x2="100%"
            y2="50%"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.1"
            className="text-foreground"
          />

          {/* Price line */}
          <polyline
            points={position.priceHistory
              .map((price, idx) => {
                const x = (idx / (position.priceHistory.length - 1)) * 100
                const y = 100 - ((price - chartMin) / chartRange) * 100
                return `${x},${y}`
              })
              .join(' ')}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className={isProfit ? 'text-green-500' : 'text-red-500'}
          />

          {/* Entry price line */}
          <line
            x1="0"
            y1={`${100 - ((position.entryPrice - chartMin) / chartRange) * 100}%`}
            x2="100%"
            y2={`${100 - ((position.entryPrice - chartMin) / chartRange) * 100}%`}
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="2,2"
            opacity="0.5"
            className="text-accent"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-xs font-mono text-muted-foreground bg-background/50 px-1 rounded">
            ${position.currentPrice.toFixed(2)}
          </span>
        </div>
      </div>

      {/* P&L Information */}
      <div className="p-4 space-y-3">
        {/* P&L Display */}
        <div
          className={`rounded-lg p-3 ${
            isProfit
              ? 'bg-green-500/10 border border-green-500/30'
              : 'bg-red-500/10 border border-red-500/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isProfit ? (
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
              )}
              <span className="text-xs text-muted-foreground">P&L</span>
            </div>
            <div className="text-right">
              <div
                className={`font-bold font-mono ${
                  isProfit
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {isProfit ? '+' : ''}{Math.abs(pnl).toFixed(2)}
              </div>
              <div
                className={`text-xs font-semibold ${
                  isProfit
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                ({isProfit ? '+' : ''}{pnlPercent.toFixed(2)}%)
              </div>
            </div>
          </div>
        </div>

        {/* Position Stats */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-muted p-2 rounded text-center">
            <div className="text-muted-foreground">Current</div>
            <div className="font-mono font-semibold">${position.currentPrice.toFixed(2)}</div>
          </div>
          <div className="bg-muted p-2 rounded text-center">
            <div className="text-muted-foreground">Value</div>
            <div className="font-mono font-semibold">${position.value.toFixed(2)}</div>
          </div>
          <div className="bg-muted p-2 rounded text-center">
            <div className="text-muted-foreground">% Alloc</div>
            <div className="font-mono font-semibold">{position.percentOfPortfolio.toFixed(1)}%</div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-4 gap-1">
          <button
            onClick={() => onClose?.(position.id)}
            className="flex items-center justify-center gap-1 px-2 py-2 bg-red-500/20 text-red-700 dark:text-red-400 hover:bg-red-500/30 rounded text-xs font-medium transition-colors"
            title="Close entire position"
          >
            <X className="h-3 w-3" />
            <span className="hidden sm:inline">Close</span>
          </button>

          <button
            onClick={() => onAdd?.(position.id)}
            className="flex items-center justify-center gap-1 px-2 py-2 bg-green-500/20 text-green-700 dark:text-green-400 hover:bg-green-500/30 rounded text-xs font-medium transition-colors"
            title="Add to position"
          >
            <Plus className="h-3 w-3" />
            <span className="hidden sm:inline">Add</span>
          </button>

          <button
            onClick={() => onReduce?.(position.id)}
            className="flex items-center justify-center gap-1 px-2 py-2 bg-orange-500/20 text-orange-700 dark:text-orange-400 hover:bg-orange-500/30 rounded text-xs font-medium transition-colors"
            title="Reduce position"
          >
            <Minus className="h-3 w-3" />
            <span className="hidden sm:inline">Reduce</span>
          </button>

          <button
            onClick={() => onSetStops?.(position.id)}
            className="flex items-center justify-center gap-1 px-2 py-2 bg-blue-500/20 text-blue-700 dark:text-blue-400 hover:bg-blue-500/30 rounded text-xs font-medium transition-colors"
            title="Set stop-loss and take-profit"
          >
            <Lock className="h-3 w-3" />
            <span className="hidden sm:inline">Stops</span>
          </button>
        </div>
      </div>

      {/* Menu */}
      {showMenu && (
        <div className="border-t border-border bg-muted/50 p-2 space-y-1">
          <button className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded transition-colors">
            View History
          </button>
          <button className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded transition-colors">
            Set Alert
          </button>
          <button className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded transition-colors">
            Export
          </button>
        </div>
      )}
    </div>
  )
}
