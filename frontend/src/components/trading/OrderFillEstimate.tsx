import { Clock, TrendingUp, AlertCircle, Zap } from 'lucide-react'

interface OrderFillEstimateProps {
  orderSize: number
  currentPrice: number
  spreadWidth: number
  liquidityLevel: 'high' | 'medium' | 'low'
  isMarketHours: boolean
  estimatedFillSeconds?: number
}

export default function OrderFillEstimate({
  orderSize,
  currentPrice,
  spreadWidth,
  liquidityLevel,
  isMarketHours,
  estimatedFillSeconds = 30,
}: OrderFillEstimateProps) {
  // Calculate estimated fill time based on factors
  let baseEstimate = estimatedFillSeconds
  let description = ''
  let confidence = 'High'

  // Adjust for liquidity
  if (liquidityLevel === 'low') {
    baseEstimate *= 4
    confidence = 'Low'
  } else if (liquidityLevel === 'medium') {
    baseEstimate *= 2
    confidence = 'Medium'
  }

  // Adjust for order size (larger orders take longer)
  const spreadPercentage = (spreadWidth / currentPrice) * 100
  if (spreadPercentage > 0.1) {
    baseEstimate *= 1.5
  }

  // Adjust for market hours
  if (!isMarketHours) {
    baseEstimate *= 3
  }

  // Format time
  const minutes = Math.floor(baseEstimate / 60)
  const seconds = baseEstimate % 60

  const formatTime = (ms: number) => {
    if (ms < 60) return `< ${seconds}s`
    return `${minutes}m ${seconds}s`
  }

  const getConfidenceColor = (conf: string) => {
    switch (conf) {
      case 'High':
        return 'text-green-600 dark:text-green-400'
      case 'Medium':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'Low':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-muted-foreground'
    }
  }

  const getLiquidityColor = (liq: string) => {
    switch (liq) {
      case 'high':
        return 'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400'
      case 'medium':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-700 dark:text-yellow-400'
      case 'low':
        return 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400'
      default:
        return 'bg-muted'
    }
  }

  return (
    <div className="space-y-4 bg-card border border-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="h-5 w-5 text-accent" />
        <h3 className="font-semibold">Fill Estimate</h3>
      </div>

      {/* Main Estimate */}
      <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 text-center">
        <div className="text-sm text-muted-foreground mb-1">Estimated Fill Time</div>
        <div className="text-3xl font-bold text-accent mb-1">
          {formatTime(baseEstimate)}
        </div>
        <div className={`text-xs font-medium ${getConfidenceColor(confidence)}`}>
          {confidence} Confidence
        </div>
      </div>

      {/* Factors Affecting Fill */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground">
          Factors Affecting Fill Speed
        </label>

        {/* Liquidity */}
        <div className={`border rounded-lg p-3 ${getLiquidityColor(liquidityLevel)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium text-sm capitalize">
                {liquidityLevel} Liquidity
              </span>
            </div>
            <span className="text-xs">
              {liquidityLevel === 'high'
                ? 'Fastest'
                : liquidityLevel === 'medium'
                  ? 'Moderate'
                  : 'Slowest'}
            </span>
          </div>
        </div>

        {/* Spread */}
        <div className={`border rounded-lg p-3 ${
          spreadPercentage > 0.1
            ? 'bg-red-500/10 border-red-500/30'
            : 'bg-green-500/10 border-green-500/30'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap
                className={`h-4 w-4 ${
                  spreadPercentage > 0.1
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-green-600 dark:text-green-400'
                }`}
              />
              <span className="font-medium text-sm">Spread: {spreadPercentage.toFixed(3)}%</span>
            </div>
            <span className="text-xs">
              {spreadPercentage > 0.1 ? 'Wide (Slower)' : 'Tight (Faster)'}
            </span>
          </div>
        </div>

        {/* Market Hours */}
        <div
          className={`border rounded-lg p-3 ${
            isMarketHours
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-yellow-500/10 border-yellow-500/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock
                className={`h-4 w-4 ${
                  isMarketHours
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-yellow-600 dark:text-yellow-400'
                }`}
              />
              <span className="font-medium text-sm">
                {isMarketHours ? 'Regular Hours' : 'After Hours'}
              </span>
            </div>
            <span className="text-xs">
              {isMarketHours ? 'Faster' : 'Slower'}
            </span>
          </div>
        </div>

        {/* Order Size */}
        <div className="border border-border rounded-lg p-3 bg-muted">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">Order Size</span>
            </div>
            <span className="text-xs font-mono">{orderSize} shares</span>
          </div>
        </div>
      </div>

      {/* Tips Based on Conditions */}
      {liquidityLevel === 'low' && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-700 dark:text-amber-400">
            <strong>Low Liquidity:</strong> This asset has few buyers/sellers. Consider
            using a limit order or splitting your trade.
          </div>
        </div>
      )}

      {!isMarketHours && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-blue-700 dark:text-blue-400">
            <strong>After Hours:</strong> Trading is slower with wider spreads. Your
            order may take longer to fill.
          </div>
        </div>
      )}

      {spreadPercentage > 0.1 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-red-700 dark:text-red-400">
            <strong>Wide Spread:</strong> The bid-ask spread is large. You may get worse
            pricing than expected.
          </div>
        </div>
      )}

      {liquidityLevel === 'high' && isMarketHours && spreadPercentage <= 0.1 && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-2 flex items-start gap-2">
          <Zap className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-green-700 dark:text-green-400">
            <strong>Optimal Conditions:</strong> High liquidity during market hours.
            Your order should fill quickly!
          </div>
        </div>
      )}
    </div>
  )
}
