import { useState } from 'react'
import { Briefcase, TrendingUp, TrendingDown, AlertCircle, Filter } from 'lucide-react'
import PositionCard from './PositionCard'
import type { Position, PositionFilter, PositionSort } from '../../types/trading'
import { MOCK_POSITIONS } from '../../constants/mockData'
import { calculatePortfolioStats } from '../../utils/calculations'

interface PositionManagementPanelProps {
  positions?: Position[]
  onClose?: (id: string) => void
  onAdd?: (id: string) => void
  onReduce?: (id: string) => void
  onSetStops?: (id: string) => void
}

export default function PositionManagementPanel({
  positions = MOCK_POSITIONS,
  onClose,
  onAdd,
  onReduce,
  onSetStops,
}: PositionManagementPanelProps) {
  const [filterType, setFilterType] = useState<PositionFilter>('all')
  const [sortBy, setSortBy] = useState<PositionSort>('value')

  // Calculate statistics using utility function
  const stats = calculatePortfolioStats(positions)
  const totalPnLPercent = stats.totalPnLPercent
  const totalPnL = stats.totalPnL

  const filtered = positions.filter((p) => {
    const pnl = p.value - p.shares * p.entryPrice
    if (filterType === 'winning') return pnl >= 0
    if (filterType === 'losing') return pnl < 0
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'symbol') return a.symbol.localeCompare(b.symbol)
    if (sortBy === 'value') return b.value - a.value
    const aPnL = a.value - a.shares * a.entryPrice
    const bPnL = b.value - b.shares * b.entryPrice
    return bPnL - aPnL
  })

  positions.forEach((p) => {
    const pnl = p.value - p.shares * p.entryPrice
    if (pnl >= 0) stats.winningPositions++
    else stats.losingPositions++
  })

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Value */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-xs text-muted-foreground mb-1">Portfolio Value</div>
          <div className="text-2xl font-bold">${stats.totalValue.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {positions.length} position{positions.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Total P&L */}
        <div
          className={`bg-card border border-border rounded-lg p-4 ${
            stats.totalPnL >= 0 ? 'border-green-500/30' : 'border-red-500/30'
          }`}
        >
          <div className="text-xs text-muted-foreground mb-1">Total P&L</div>
          <div
            className={`text-2xl font-bold ${
              stats.totalPnL >= 0
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {stats.totalPnL >= 0 ? '+' : ''} ${Math.abs(stats.totalPnL).toFixed(2)}
          </div>
          <div
            className={`text-xs font-semibold ${
              stats.totalPnL >= 0
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            ({stats.totalPnL >= 0 ? '+' : ''}{totalPnLPercent.toFixed(2)}%)
          </div>
        </div>

        {/* Winning Positions */}
        <div className="bg-card border border-border rounded-lg p-4 border-green-500/30">
          <div className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
            <TrendingUp className="h-3 w-3" />
            Winning
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.winningPositions}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {((stats.winningPositions / positions.length) * 100 || 0).toFixed(0)}% of portfolio
          </div>
        </div>

        {/* Losing Positions */}
        <div className="bg-card border border-border rounded-lg p-4 border-red-500/30">
          <div className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
            <TrendingDown className="h-3 w-3" />
            Losing
          </div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {stats.losingPositions}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {((stats.losingPositions / positions.length) * 100 || 0).toFixed(0)}% of portfolio
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-5 w-5 text-accent" />
          <h3 className="font-semibold">Filters & Sorting</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Filter */}
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-2">
              Filter Positions
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === 'all'
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                All ({positions.length})
              </button>
              <button
                onClick={() => setFilterType('winning')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === 'winning'
                    ? 'bg-green-500/20 text-green-700 dark:text-green-400'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                Winning
              </button>
              <button
                onClick={() => setFilterType('losing')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === 'losing'
                    ? 'bg-red-500/20 text-red-700 dark:text-red-400'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                Losing
              </button>
            </div>
          </div>

          {/* Sort */}
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 bg-muted border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            >
              <option value="value">Portfolio Value</option>
              <option value="pnl">P&L Amount</option>
              <option value="symbol">Symbol (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Positions Grid */}
      {sorted.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((position) => (
            <PositionCard
              key={position.id}
              position={position}
              onClose={onClose}
              onAdd={onAdd}
              onReduce={onReduce}
              onSetStops={onSetStops}
            />
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-lg font-semibold mb-2">No Open Positions</p>
          <p className="text-sm text-muted-foreground">
            {filterType !== 'all'
              ? `No ${filterType} positions found`
              : 'Start trading to see your positions here'}
          </p>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700 dark:text-blue-400">
          <strong>Position Management Tips:</strong>
          <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
            <li>Use Stop-Loss (Lock icon) to protect against major losses</li>
            <li>Add to winning positions to maximize gains</li>
            <li>Close entire positions with a single click</li>
            <li>Monitor P&L percentage to track performance</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
