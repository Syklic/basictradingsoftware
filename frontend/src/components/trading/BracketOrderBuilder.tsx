import { useState } from 'react'
import { Lock, AlertCircle } from 'lucide-react'

interface BracketOrderBuilderProps {
  currentPrice: number
  onBracketChange?: (bracket: {
    entry: number
    stopLoss: number
    takeProfit: number
  }) => void
}

export default function BracketOrderBuilder({
  currentPrice,
  onBracketChange,
}: BracketOrderBuilderProps) {
  const [entryPrice, setEntryPrice] = useState(currentPrice)
  const [stopLossPrice, setStopLossPrice] = useState(currentPrice * 0.98)
  const [takeProfitPrice, setTakeProfitPrice] = useState(currentPrice * 1.02)
  const [linkPrices, setLinkPrices] = useState(true)

  const risk = Math.abs(entryPrice - stopLossPrice)
  const reward = Math.abs(takeProfitPrice - entryPrice)
  const ratio = risk > 0 ? reward / risk : 0

  // Notify parent when bracket changes
  const handleBracketUpdate = () => {
    onBracketChange?.({
      entry: entryPrice,
      stopLoss: stopLossPrice,
      takeProfit: takeProfitPrice,
    })
  }

  // Update entry price and adjust stops if linked
  const handleEntryChange = (newEntry: number) => {
    setEntryPrice(newEntry)
    if (linkPrices) {
      const entryRisk = Math.abs(stopLossPrice - entryPrice)
      const entryReward = Math.abs(takeProfitPrice - entryPrice)
      setStopLossPrice(newEntry - entryRisk)
      setTakeProfitPrice(newEntry + entryReward)
    }
    handleBracketUpdate()
  }

  // Quick preset adjustments
  const applyPreset = (riskPercent: number, rewardPercent: number) => {
    const newStop = entryPrice * (1 - riskPercent / 100)
    const newProfit = entryPrice * (1 + rewardPercent / 100)
    setStopLossPrice(newStop)
    setTakeProfitPrice(newProfit)
    handleBracketUpdate()
  }

  return (
    <div className="space-y-4 bg-card border border-border rounded-lg p-4">
      <div className="flex items-center gap-2">
        <Lock className="h-5 w-5 text-accent" />
        <h3 className="font-semibold">Bracket Order Builder</h3>
      </div>

      {/* Link Prices Toggle */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="linkPrices"
          checked={linkPrices}
          onChange={(e) => setLinkPrices(e.target.checked)}
          className="h-4 w-4 rounded"
        />
        <label htmlFor="linkPrices" className="text-sm text-muted-foreground">
          Link prices to entry point (adjust stops together)
        </label>
      </div>

      {/* Entry Price */}
      <div className="bg-accent/10 border border-accent/30 rounded-lg p-3 space-y-2">
        <label className="block text-xs font-semibold text-muted-foreground">
          Entry Price
        </label>
        <input
          type="number"
          value={entryPrice}
          onChange={(e) => handleEntryChange(parseFloat(e.target.value) || currentPrice)}
          className="w-full px-3 py-2 bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
          step="0.01"
        />
        <div className="text-xs text-muted-foreground">Current market: ${currentPrice.toFixed(2)}</div>
      </div>

      {/* Stop Loss Price */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 space-y-2">
        <label className="block text-xs font-semibold text-muted-foreground">
          Stop-Loss Price (Limit your loss)
        </label>
        <input
          type="number"
          value={stopLossPrice}
          onChange={(e) => {
            setStopLossPrice(parseFloat(e.target.value) || 0)
            handleBracketUpdate()
          }}
          className="w-full px-3 py-2 bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50"
          step="0.01"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Loss if triggered:</span>
          <span className="text-red-600 dark:text-red-400 font-mono">
            ${risk.toFixed(2)} per share
          </span>
        </div>
      </div>

      {/* Take Profit Price */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 space-y-2">
        <label className="block text-xs font-semibold text-muted-foreground">
          Take-Profit Price (Capture your gains)
        </label>
        <input
          type="number"
          value={takeProfitPrice}
          onChange={(e) => {
            setTakeProfitPrice(parseFloat(e.target.value) || 0)
            handleBracketUpdate()
          }}
          className="w-full px-3 py-2 bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50"
          step="0.01"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Profit if triggered:</span>
          <span className="text-green-600 dark:text-green-400 font-mono">
            ${reward.toFixed(2)} per share
          </span>
        </div>
      </div>

      {/* Quick Presets */}
      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-2">
          Quick Presets
        </label>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <button
            onClick={() => applyPreset(1, 2)}
            className="px-2 py-1 bg-muted hover:bg-muted/80 rounded transition-colors"
            title="1% risk for 2% reward"
          >
            Conservative (1:2)
          </button>
          <button
            onClick={() => applyPreset(2, 4)}
            className="px-2 py-1 bg-muted hover:bg-muted/80 rounded transition-colors"
            title="2% risk for 4% reward"
          >
            Moderate (2:4)
          </button>
          <button
            onClick={() => applyPreset(1.5, 3)}
            className="px-2 py-1 bg-muted hover:bg-muted/80 rounded transition-colors"
            title="1.5% risk for 3% reward"
          >
            Balanced (1.5:3)
          </button>
        </div>
      </div>

      {/* Risk/Reward Summary */}
      <div className="bg-muted/50 rounded-lg p-3 space-y-2">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">Risk/Reward Ratio</span>
            <div className={`text-lg font-bold ${
              ratio >= 2
                ? 'text-green-600 dark:text-green-400'
                : ratio >= 1
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : 'text-red-600 dark:text-red-400'
            }`}>
              1:{ratio.toFixed(2)}
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Bracket Spread</span>
            <div className="text-lg font-bold text-accent">
              ${(risk + reward).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Bracket Visualization */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-muted-foreground">
          Bracket Levels
        </label>
        <div className="space-y-1 text-xs">
          {/* Take Profit Level */}
          <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded px-3 py-2">
            <span className="text-green-700 dark:text-green-400 font-medium">
              Take Profit
            </span>
            <span className="font-mono text-green-600 dark:text-green-400 font-semibold">
              ${takeProfitPrice.toFixed(2)}
            </span>
          </div>

          {/* Entry Level */}
          <div className="flex items-center justify-between bg-accent/10 border border-accent/30 rounded px-3 py-2">
            <span className="text-accent font-medium">Entry</span>
            <span className="font-mono text-accent font-semibold">
              ${entryPrice.toFixed(2)}
            </span>
          </div>

          {/* Stop Level */}
          <div className="flex items-center justify-between bg-red-500/10 border border-red-500/30 rounded px-3 py-2">
            <span className="text-red-700 dark:text-red-400 font-medium">
              Stop-Loss
            </span>
            <span className="font-mono text-red-600 dark:text-red-400 font-semibold">
              ${stopLossPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2">
        <div className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
          <strong>How Bracket Orders Work:</strong>
          <ul className="list-disc list-inside">
            <li>Submit entry order to open position</li>
            <li>Stop-Loss closes at loss (protects capital)</li>
            <li>Take-Profit closes at gain (locks in profits)</li>
            <li>Only one exit executes (whichever hits first)</li>
          </ul>
        </div>
      </div>

      {/* Warnings */}
      {stopLossPrice > entryPrice && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-700 dark:text-amber-400">
            <strong>Note:</strong> Stop-Loss is above entry price. This would exit at a loss immediately. Did you intend this?
          </div>
        </div>
      )}

      {takeProfitPrice < entryPrice && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-700 dark:text-amber-400">
            <strong>Note:</strong> Take-Profit is below entry price. This would exit at a loss. Did you intend this?
          </div>
        </div>
      )}
    </div>
  )
}
