import { useState, useEffect } from 'react'
import { AlertCircle, Calculator } from 'lucide-react'

interface PositionSizingProps {
  currentPrice: number
  buyingPower: number
  maxPositionSize?: number
  onSharesChange: (shares: number) => void
}

export default function PositionSizingCalculator({
  currentPrice,
  buyingPower,
  maxPositionSize = 100000,
  onSharesChange,
}: PositionSizingProps) {
  const [riskMode, setRiskMode] = useState<'fixed' | 'percent'>('fixed')
  const [riskAmount, setRiskAmount] = useState(100)
  const [riskPercent, setRiskPercent] = useState(1)
  const [entryPrice, setEntryPrice] = useState(currentPrice)
  const [stopPrice, setStopPrice] = useState(currentPrice * 0.98)
  const [calculatedShares, setCalculatedShares] = useState(0)
  const [totalCost, setTotalCost] = useState(0)

  // Recalculate on any change
  useEffect(() => {
    const pricePerShare = entryPrice || currentPrice
    let risk = 0

    if (riskMode === 'fixed') {
      risk = riskAmount
    } else {
      risk = (riskPercent / 100) * buyingPower
    }

    if (entryPrice > 0 && stopPrice > 0 && entryPrice !== stopPrice) {
      const priceRisk = Math.abs(entryPrice - stopPrice)
      const shares = Math.floor(risk / priceRisk)
      const maxShares = Math.floor(buyingPower / pricePerShare)
      const finalShares = Math.min(shares, maxShares)

      setCalculatedShares(finalShares)
      setTotalCost(finalShares * pricePerShare)
      onSharesChange(finalShares)
    }
  }, [riskAmount, riskPercent, riskMode, entryPrice, stopPrice, currentPrice, buyingPower, onSharesChange])

  const priceRisk = Math.abs(entryPrice - stopPrice)
  const rewardTarget = entryPrice + priceRisk * 2
  const riskRewardRatio = priceRisk > 0 ? (rewardTarget - entryPrice) / priceRisk : 0

  const isSufficientFunds = totalCost <= buyingPower
  const isValidSetup = entryPrice > 0 && stopPrice > 0 && entryPrice !== stopPrice

  return (
    <div className="space-y-4 bg-card border border-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Calculator className="h-5 w-5 text-accent" />
        <h3 className="font-semibold">Position Sizing Calculator</h3>
      </div>

      {/* Risk Mode Selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setRiskMode('fixed')}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            riskMode === 'fixed'
              ? 'bg-accent text-accent-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          Risk Amount ($)
        </button>
        <button
          onClick={() => setRiskMode('percent')}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            riskMode === 'percent'
              ? 'bg-accent text-accent-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          Risk Percent (%)
        </button>
      </div>

      {/* Risk Input */}
      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-2">
          {riskMode === 'fixed' ? 'Risk Amount' : 'Risk Percent'}
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={riskMode === 'fixed' ? riskAmount : riskPercent}
            onChange={(e) => {
              const value = parseFloat(e.target.value) || 0
              if (riskMode === 'fixed') {
                setRiskAmount(Math.max(0, value))
              } else {
                setRiskPercent(Math.max(0, Math.min(100, value)))
              }
            }}
            className="flex-1 px-3 py-2 bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
            placeholder="0"
          />
          <div className="px-3 py-2 bg-muted rounded-lg text-sm font-medium">
            {riskMode === 'fixed' ? '$' : '%'}
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Risking {riskMode === 'fixed' ? `$${riskAmount.toFixed(2)}` : `${riskPercent.toFixed(2)}% of $${buyingPower.toFixed(0)}`}
        </div>
      </div>

      {/* Entry Price */}
      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-2">
          Entry Price
        </label>
        <input
          type="number"
          value={entryPrice}
          onChange={(e) => setEntryPrice(parseFloat(e.target.value) || currentPrice)}
          className="w-full px-3 py-2 bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
          placeholder="0.00"
          step="0.01"
        />
      </div>

      {/* Stop Price */}
      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-2">
          Stop Price (Risk Level)
        </label>
        <input
          type="number"
          value={stopPrice}
          onChange={(e) => setStopPrice(parseFloat(e.target.value) || 0)}
          className="w-full px-3 py-2 bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
          placeholder="0.00"
          step="0.01"
        />
        <div className="text-xs text-muted-foreground mt-1">
          Risk per share: ${priceRisk.toFixed(4)}
        </div>
      </div>

      {/* Quick Presets */}
      <div className="grid grid-cols-4 gap-1 text-xs">
        <button
          onClick={() => setStopPrice(entryPrice * 0.95)}
          className="px-2 py-1 bg-muted hover:bg-muted/80 rounded transition-colors"
          title="5% below entry"
        >
          5%
        </button>
        <button
          onClick={() => setStopPrice(entryPrice * 0.98)}
          className="px-2 py-1 bg-muted hover:bg-muted/80 rounded transition-colors"
          title="2% below entry"
        >
          2%
        </button>
        <button
          onClick={() => setStopPrice(entryPrice * 0.99)}
          className="px-2 py-1 bg-muted hover:bg-muted/80 rounded transition-colors"
          title="1% below entry"
        >
          1%
        </button>
        <button
          onClick={() => setStopPrice(currentPrice)}
          className="px-2 py-1 bg-muted hover:bg-muted/80 rounded transition-colors"
          title="Reset to current"
        >
          Reset
        </button>
      </div>

      {/* Results */}
      {isValidSetup && (
        <div className="bg-accent/10 border border-accent/30 rounded-lg p-3 space-y-2">
          {/* Calculated Shares */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Calculated Shares</span>
            <span className="text-lg font-bold text-accent">{calculatedShares}</span>
          </div>

          {/* Total Cost */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Cost</span>
            <span className="font-mono font-semibold">
              ${totalCost.toFixed(2)}
            </span>
          </div>

          {/* Risk/Reward */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Risk/Reward</span>
            <span
              className={`font-semibold ${
                riskRewardRatio >= 1.5
                  ? 'text-green-600 dark:text-green-400'
                  : riskRewardRatio >= 1
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-red-600 dark:text-red-400'
              }`}
            >
              1:{riskRewardRatio.toFixed(2)}
            </span>
          </div>

          {/* Expected Profit/Loss */}
          <div className="border-t border-accent/20 pt-2 flex justify-between items-center">
            <span className="text-sm font-medium">Max Risk</span>
            <span className="text-sm font-mono text-red-600 dark:text-red-400">
              -${(calculatedShares * priceRisk).toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Potential Reward (2:1)</span>
            <span className="text-sm font-mono text-green-600 dark:text-green-400">
              +${(calculatedShares * priceRisk * 2).toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Warnings */}
      {isValidSetup && !isSufficientFunds && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-red-700 dark:text-red-400">
            <strong>Insufficient funds:</strong> Need ${totalCost.toFixed(2)}, have ${buyingPower.toFixed(2)}
          </div>
        </div>
      )}

      {!isValidSetup && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-700 dark:text-amber-400">
            <strong>Invalid setup:</strong> Entry and stop prices must be different
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2">
        <div className="text-xs text-blue-700 dark:text-blue-400">
          💡 <strong>Position sizing tip:</strong> Risk only what you can afford to lose. Recommended: 1-2% per trade.
        </div>
      </div>
    </div>
  )
}
