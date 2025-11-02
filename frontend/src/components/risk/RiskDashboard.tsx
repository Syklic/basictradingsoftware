import { AlertTriangle, TrendingDown, Zap, BarChart3, Activity } from 'lucide-react'
import { useMemo } from 'react'
import type { RiskMetrics, RiskStatus } from '../../types/risk'
import { calculateRiskStatus, getRiskStatusDescription } from '../../utils/riskCalculations'
import { formatCurrency, formatPercent } from '../../utils/calculations'

interface RiskDashboardProps {
  metrics: RiskMetrics
}

/**
 * Risk Dashboard Widget
 * Displays real-time risk metrics with visual indicators
 */
export default function RiskDashboard({ metrics }: RiskDashboardProps) {
  const riskStatus = useMemo(() => calculateRiskStatus(metrics), [metrics])

  const getRiskColor = (level: string) => {
    const colors = {
      low: 'text-green-600 bg-green-50',
      medium: 'text-yellow-600 bg-yellow-50',
      high: 'text-orange-600 bg-orange-50',
      critical: 'text-red-600 bg-red-50',
    }
    return colors[level as keyof typeof colors] || colors.low
  }

  const getProgressBarColor = (percent: number) => {
    if (percent >= 90) return 'bg-red-500'
    if (percent >= 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const MetricCard = ({
    icon: Icon,
    title,
    value,
    unit,
    level,
    warning,
  }: {
    icon: React.ElementType
    title: string
    value: number
    unit: string
    level: string
    warning?: string
  }) => (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <Icon className={`h-4 w-4 ${getRiskColor(level).split(' ')[0]}`} />
            <span className="text-xs font-medium text-muted-foreground">
              {title}
            </span>
          </div>
          <div className="mb-1 text-2xl font-bold">
            {value.toFixed(1)}
            <span className="text-lg text-muted-foreground">{unit}</span>
          </div>
          {warning && (
            <p className="text-xs text-orange-600">{warning}</p>
          )}
        </div>
        <div className={`rounded-full px-2 py-1 text-xs font-semibold ${getRiskColor(level)}`}>
          {level.toUpperCase()}
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Overall Risk Status */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Overall Risk Status</h2>
          <div
            className={`rounded-full px-3 py-1 text-sm font-bold ${getRiskColor(riskStatus.overall)}`}
          >
            {riskStatus.overall.toUpperCase()}
          </div>
        </div>
        <p className={`text-sm ${getRiskColor(riskStatus.overall).split(' ')[0]}`}>
          {getRiskStatusDescription(riskStatus.overall)}
        </p>

        {riskStatus.shouldPauseTrading && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-red-600">
              Trading has been paused due to critical risk levels
            </span>
          </div>
        )}
      </div>

      {/* Risk Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <MetricCard
          icon={TrendingDown}
          title="Current Drawdown"
          value={riskStatus.drawdown.percent}
          unit="%"
          level={riskStatus.drawdown.level}
          warning={
            riskStatus.drawdown.percent < -10 ? 'Significant drawdown detected' : undefined
          }
        />

        <MetricCard
          icon={Activity}
          title="Daily P&L vs Limit"
          value={riskStatus.dailyPnL.used}
          unit={`/${riskStatus.dailyPnL.limit}$`}
          level={riskStatus.dailyPnL.level}
          warning={
            riskStatus.dailyPnL.used > riskStatus.dailyPnL.limit * 0.7
              ? 'Approaching daily limit'
              : undefined
          }
        />

        <MetricCard
          icon={Zap}
          title="Leverage Usage"
          value={riskStatus.leverage.used}
          unit={`x/${riskStatus.leverage.max}x`}
          level={riskStatus.leverage.level}
          warning={
            riskStatus.leverage.used > riskStatus.leverage.max * 0.7
              ? 'High leverage detected'
              : undefined
          }
        />

        <MetricCard
          icon={BarChart3}
          title="Concentration Risk"
          value={riskStatus.concentration.percent}
          unit="%"
          level={riskStatus.concentration.level}
          warning={
            riskStatus.concentration.percent > riskStatus.concentration.limit * 0.8
              ? 'High concentration in single asset'
              : undefined
          }
        />
      </div>

      {/* Progress Bars */}
      <div className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h3 className="font-semibold">Risk Limits Progress</h3>

        {/* Daily P&L Limit */}
        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-muted-foreground">Daily Loss Limit</span>
            <span className="font-medium">
              {formatCurrency(riskStatus.dailyPnL.used)} / {formatCurrency(riskStatus.dailyPnL.limit)}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full transition-all duration-300 ${getProgressBarColor(
                (riskStatus.dailyPnL.used / riskStatus.dailyPnL.limit) * 100
              )}`}
              style={{
                width: `${Math.min(
                  (riskStatus.dailyPnL.used / riskStatus.dailyPnL.limit) * 100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Leverage Limit */}
        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-muted-foreground">Leverage Limit</span>
            <span className="font-medium">
              {riskStatus.leverage.used.toFixed(1)}x / {riskStatus.leverage.max}x
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full transition-all duration-300 ${getProgressBarColor(
                (riskStatus.leverage.used / riskStatus.leverage.max) * 100
              )}`}
              style={{
                width: `${Math.min(
                  (riskStatus.leverage.used / riskStatus.leverage.max) * 100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Concentration Limit */}
        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-muted-foreground">Concentration Limit</span>
            <span className="font-medium">
              {riskStatus.concentration.percent.toFixed(1)}% / {riskStatus.concentration.limit}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full transition-all duration-300 ${getProgressBarColor(
                (riskStatus.concentration.percent / riskStatus.concentration.limit) * 100
              )}`}
              style={{
                width: `${Math.min(
                  (riskStatus.concentration.percent / riskStatus.concentration.limit) * 100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Legend and Tips */}
      <div className="grid grid-cols-3 gap-3 rounded-lg border border-border bg-card p-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-2 w-4 rounded-full bg-green-500" />
          <span className="text-muted-foreground">Low Risk (&lt;50%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-4 rounded-full bg-yellow-500" />
          <span className="text-muted-foreground">Medium (50-70%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-4 rounded-full bg-red-500" />
          <span className="text-muted-foreground">High (&gt;70%)</span>
        </div>
      </div>
    </div>
  )
}
