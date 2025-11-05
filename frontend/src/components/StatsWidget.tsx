import { TrendingUp, TrendingDown, Zap } from "lucide-react"

interface StatsWidgetProps {
  data?: {
    totalReturn?: number
    totalReturnPercent?: number
    winRate?: number
    winningTrades?: number
    losingTrades?: number
    averageTrade?: number
    maxDrawdown?: number
    sharpeRatio?: number
    profitFactor?: number
  }
}

export default function StatsWidget({ data }: StatsWidgetProps) {
  const stats = {
    totalReturn: data?.totalReturn ?? 0,
    totalReturnPercent: data?.totalReturnPercent ?? 0,
    winRate: data?.winRate ?? 0,
    winningTrades: data?.winningTrades ?? 0,
    losingTrades: data?.losingTrades ?? 0,
    averageTrade: data?.averageTrade ?? 0,
    maxDrawdown: data?.maxDrawdown ?? 0,
    sharpeRatio: data?.sharpeRatio ?? 0,
    profitFactor: data?.profitFactor ?? 0,
  }

  const isPositive = stats.totalReturn >= 0

  return (
    <div className="w-full h-full p-3 flex flex-col overflow-hidden">
      {/* Main metric */}
      <div className="mb-3 pb-2 border-b border-border">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Total Return
        </p>
        <div className="flex items-end gap-2 mt-1">
          <div className="flex-1 min-w-0">
            <p className={`text-lg sm:text-xl font-bold leading-tight ${
              isPositive
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}>
              {isPositive ? "+" : ""}${Math.abs(stats.totalReturn).toFixed(2)}
            </p>
          </div>
          <p className={`text-xs font-semibold flex-shrink-0 ${
            isPositive
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}>
            ({isPositive ? "+" : ""}{stats.totalReturnPercent.toFixed(1)}%)
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2 flex-1 overflow-y-auto">
        {/* Win Rate */}
        <div className="rounded border border-border/50 bg-muted/20 p-2">
          <p className="text-xs text-muted-foreground">Win Rate</p>
          <p className="text-base font-bold mt-0.5">{stats.winRate.toFixed(0)}%</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {stats.winningTrades}W {stats.losingTrades}L
          </p>
        </div>

        {/* Avg Trade */}
        <div className="rounded border border-border/50 bg-muted/20 p-2">
          <p className="text-xs text-muted-foreground">Avg Trade</p>
          <p className={`text-base font-bold mt-0.5 ${
            stats.averageTrade >= 0 ? "text-green-600" : "text-red-600"
          }`}>
            ${Math.abs(stats.averageTrade).toFixed(2)}
          </p>
        </div>

        {/* Max Drawdown */}
        <div className="rounded border border-border/50 bg-muted/20 p-2">
          <p className="text-xs text-muted-foreground">Max Drawdown</p>
          <p className="text-base font-bold text-red-600 mt-0.5">
            -{Math.abs(stats.maxDrawdown).toFixed(1)}%
          </p>
        </div>

        {/* Sharpe Ratio */}
        <div className="rounded border border-border/50 bg-muted/20 p-2">
          <p className="text-xs text-muted-foreground">Sharpe Ratio</p>
          <p className={`text-base font-bold mt-0.5 ${
            stats.sharpeRatio >= 1 ? "text-green-600" : "text-yellow-600"
          }`}>
            {stats.sharpeRatio.toFixed(2)}
          </p>
        </div>

        {/* Profit Factor */}
        <div className="rounded border border-border/50 bg-muted/20 p-2">
          <p className="text-xs text-muted-foreground">Profit Factor</p>
          <p className={`text-base font-bold mt-0.5 ${
            stats.profitFactor >= 1.5 ? "text-green-600" : "text-yellow-600"
          }`}>
            {stats.profitFactor.toFixed(2)}x
          </p>
        </div>

        {/* Daily Change */}
        <div className="rounded border border-border/50 bg-muted/20 p-2">
          <p className="text-xs text-muted-foreground">Daily Change</p>
          <p className="text-base font-bold text-green-600 mt-0.5">+$0.00</p>
        </div>
      </div>
    </div>
  )
}
