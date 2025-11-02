import { TrendingDown, TrendingUp, Target } from 'lucide-react'

interface RiskRewardVisualizerProps {
  entryPrice: number
  stopPrice: number
  targetPrice: number
}

export default function RiskRewardVisualizer({
  entryPrice,
  stopPrice,
  targetPrice,
}: RiskRewardVisualizerProps) {
  // Calculate metrics
  const risk = Math.abs(entryPrice - stopPrice)
  const reward = Math.abs(targetPrice - entryPrice)
  const ratio = risk > 0 ? reward / risk : 0
  const priceRange = Math.max(targetPrice, stopPrice) - Math.min(targetPrice, stopPrice)

  // Normalize positions for visualization (0-100%)
  const minPrice = Math.min(stopPrice, entryPrice, targetPrice)
  const maxPrice = Math.max(stopPrice, entryPrice, targetPrice)
  const totalRange = maxPrice - minPrice || 1

  const stopPosition = ((stopPrice - minPrice) / totalRange) * 100
  const entryPosition = ((entryPrice - minPrice) / totalRange) * 100
  const targetPosition = ((targetPrice - minPrice) / totalRange) * 100

  // Color coding based on ratio
  let ratioColor = 'text-red-600 dark:text-red-400' // < 1.0
  let ratioBgColor = 'bg-red-500/10'
  let ratioBorderColor = 'border-red-500/30'

  if (ratio >= 2.0) {
    ratioColor = 'text-green-600 dark:text-green-400'
    ratioBgColor = 'bg-green-500/10'
    ratioBorderColor = 'border-green-500/30'
  } else if (ratio >= 1.5) {
    ratioColor = 'text-lime-600 dark:text-lime-400'
    ratioBgColor = 'bg-lime-500/10'
    ratioBorderColor = 'border-lime-500/30'
  } else if (ratio >= 1.0) {
    ratioColor = 'text-yellow-600 dark:text-yellow-400'
    ratioBgColor = 'bg-yellow-500/10'
    ratioBorderColor = 'border-yellow-500/30'
  }

  return (
    <div className="space-y-4 bg-card border border-border rounded-lg p-4">
      <h3 className="font-semibold">Risk / Reward Analysis</h3>

      {/* Visual Representation */}
      <div className="space-y-4">
        {/* Price Scale */}
        <div className="relative h-48 bg-muted rounded-lg p-4 flex flex-col justify-between">
          {/* Target Price Line (Top) */}
          <div className="absolute left-0 right-0 top-0 px-4 pt-2">
            <div
              className="absolute flex items-center gap-2"
              style={{ left: `calc(${targetPosition}% - 20px)` }}
            >
              <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
              <div className="text-xs font-medium whitespace-nowrap text-green-600 dark:text-green-400">
                Target
              </div>
              <div className="text-xs font-mono font-semibold text-green-600 dark:text-green-400">
                ${targetPrice.toFixed(2)}
              </div>
            </div>
            <div
              className="absolute border-l-2 border-green-500/50 h-full"
              style={{ left: `${targetPosition}%` }}
            />
          </div>

          {/* Entry Price Line (Middle) */}
          <div className="absolute left-0 right-0 top-1/2 px-4 -translate-y-1/2">
            <div
              className="absolute flex items-center gap-2 -translate-y-1/2"
              style={{ left: `calc(${entryPosition}% - 20px)` }}
            >
              <div className="h-4 w-4 rounded-full bg-accent" />
              <div className="text-xs font-medium whitespace-nowrap text-accent">
                Entry
              </div>
              <div className="text-xs font-mono font-semibold text-accent">
                ${entryPrice.toFixed(2)}
              </div>
            </div>
            <div
              className="absolute border-l-2 border-accent h-full"
              style={{ left: `${entryPosition}%` }}
            />
          </div>

          {/* Stop Loss Line (Bottom) */}
          <div className="absolute left-0 right-0 bottom-0 px-4 pb-2">
            <div
              className="absolute flex items-center gap-2"
              style={{ left: `calc(${stopPosition}% - 20px)` }}
            >
              <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
              <div className="text-xs font-medium whitespace-nowrap text-red-600 dark:text-red-400">
                Stop
              </div>
              <div className="text-xs font-mono font-semibold text-red-600 dark:text-red-400">
                ${stopPrice.toFixed(2)}
              </div>
            </div>
            <div
              className="absolute border-l-2 border-red-500/50 h-full"
              style={{ left: `${stopPosition}%` }}
            />
          </div>

          {/* Risk Zone (Red) */}
          <div
            className="absolute bg-red-500/20 left-0 right-0 top-1/2"
            style={{
              left: `${Math.min(entryPosition, stopPosition)}%`,
              right: `${100 - Math.max(entryPosition, stopPosition)}%`,
              height: '50%',
            }}
          />

          {/* Reward Zone (Green) */}
          <div
            className="absolute bg-green-500/20 left-0 right-0 top-0"
            style={{
              left: `${Math.min(entryPosition, targetPosition)}%`,
              right: `${100 - Math.max(entryPosition, targetPosition)}%`,
              height: '50%',
            }}
          />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Risk */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
            <span className="text-xs font-medium text-muted-foreground">Risk</span>
          </div>
          <div className="text-lg font-bold text-red-600 dark:text-red-400">
            ${risk.toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground">Per share</div>
        </div>

        {/* Reward */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-xs font-medium text-muted-foreground">Reward</span>
          </div>
          <div className="text-lg font-bold text-green-600 dark:text-green-400">
            ${reward.toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground">Per share</div>
        </div>
      </div>

      {/* Risk/Reward Ratio */}
      <div className={`border rounded-lg p-4 ${ratioBgColor} ${ratioBorderColor}`}>
        <div className="text-xs text-muted-foreground mb-2">Risk / Reward Ratio</div>
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-bold ${ratioColor}`}>1 : {ratio.toFixed(2)}</span>
          <div className="text-xs text-muted-foreground">
            {ratio >= 2.0
              ? '✓ Excellent'
              : ratio >= 1.5
                ? '✓ Very Good'
                : ratio >= 1.0
                  ? '~ Fair'
                  : '✗ Poor'}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-muted/50 rounded-lg p-3 text-xs space-y-1 text-muted-foreground">
        <div className="flex justify-between">
          <span>If wrong: Lose</span>
          <span className="font-mono font-semibold text-red-600 dark:text-red-400">
            ${risk.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>If right: Gain</span>
          <span className="font-mono font-semibold text-green-600 dark:text-green-400">
            ${reward.toFixed(2)}
          </span>
        </div>
        <div className="border-t border-border pt-1 mt-1 flex justify-between font-medium">
          <span>Expected Value (50% win rate)</span>
          <span className={ratio > 1 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
            ${((reward - risk) / 2).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2">
        <div className="text-xs text-blue-700 dark:text-blue-400">
          💡 <strong>Tip:</strong> Aim for at least 1:1.5 ratio for positive expected value over time.
        </div>
      </div>
    </div>
  )
}
