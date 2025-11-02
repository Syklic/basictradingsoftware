import { TrendingUp } from 'lucide-react'

interface OrderProgressBarProps {
  totalShares: number
  filledShares: number
  showPercentage?: boolean
  showValues?: boolean
}

export default function OrderProgressBar({
  totalShares,
  filledShares,
  showPercentage = true,
  showValues = true,
}: OrderProgressBarProps) {
  const fillPercentage = totalShares > 0 ? (filledShares / totalShares) * 100 : 0
  const pendingShares = totalShares - filledShares
  const isFullyFilled = fillPercentage >= 100
  const isPartiallyFilled = fillPercentage > 0 && fillPercentage < 100

  return (
    <div className="space-y-3 bg-card border border-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp className="h-5 w-5 text-accent" />
        <h3 className="font-semibold">Fill Status</h3>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        {/* Main Progress Bar */}
        <div className="relative h-3 bg-muted rounded-full overflow-hidden">
          {/* Filled Portion */}
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isFullyFilled
                ? 'bg-green-500'
                : isPartiallyFilled
                  ? 'bg-yellow-500'
                  : 'bg-accent'
            }`}
            style={{ width: `${fillPercentage}%` }}
          />
        </div>

        {/* Percentage Display */}
        {showPercentage && (
          <div className="text-sm font-semibold text-center">
            {fillPercentage.toFixed(1)}% Filled
          </div>
        )}
      </div>

      {/* Share Breakdown */}
      {showValues && (
        <div className="space-y-2 text-sm">
          {/* Filled Shares */}
          <div className="flex items-center justify-between p-2 bg-green-500/10 border border-green-500/30 rounded-lg">
            <span className="text-muted-foreground">Filled Shares</span>
            <span className="font-semibold text-green-600 dark:text-green-400">
              {filledShares} / {totalShares}
            </span>
          </div>

          {/* Pending Shares */}
          {!isFullyFilled && (
            <div className="flex items-center justify-between p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <span className="text-muted-foreground">Pending Shares</span>
              <span className="font-semibold text-amber-600 dark:text-amber-400">
                {pendingShares}
              </span>
            </div>
          )}

          {/* Status Badge */}
          <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
            <span className="text-muted-foreground">Status</span>
            <span
              className={`text-xs px-2 py-1 rounded font-medium ${
                isFullyFilled
                  ? 'bg-green-500/20 text-green-700 dark:text-green-400'
                  : isPartiallyFilled
                    ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                    : 'bg-accent/20 text-accent'
              }`}
            >
              {isFullyFilled
                ? 'Fully Filled'
                : isPartiallyFilled
                  ? 'Partially Filled'
                  : 'Pending'}
            </span>
          </div>
        </div>
      )}

      {/* Visual Indicators */}
      {isPartiallyFilled && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2">
          <div className="text-xs text-blue-700 dark:text-blue-400">
            💡 <strong>Tip:</strong> Your order is partially filled. Remaining shares
            will be filled as market conditions allow.
          </div>
        </div>
      )}

      {isFullyFilled && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-2">
          <div className="text-xs text-green-700 dark:text-green-400">
            ✓ <strong>Complete:</strong> Order fully executed
          </div>
        </div>
      )}
    </div>
  )
}
