import { useState, useEffect } from 'react'
import {
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from 'lucide-react'
import { useQuickTradeStore } from '../../hooks/useQuickTrade'
import TradeConfirmationModal from './TradeConfirmationModal'

interface QuickTradeWidgetProps {
  position?: 'fab' | 'sidebar'
  onTradeExecuted?: (order: any) => void
}

// Mock asset prices - In production, these would come from WebSocket
const ASSET_PRICES: Record<string, number> = {
  BTC: 45230.5,
  ETH: 2456.8,
  SPY: 450.25,
  QQQ: 380.1,
  AAPL: 178.5,
  TSLA: 245.3,
  GLD: 198.75,
  TLT: 92.4,
}

const FAVORITES = ['BTC', 'ETH', 'SPY']

export default function QuickTradeWidget({ position = 'fab', onTradeExecuted }: QuickTradeWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(position === 'sidebar')
  const [currentPrice, setCurrentPrice] = useState(ASSET_PRICES['BTC'])
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [showAssetDropdown, setShowAssetDropdown] = useState(false)

  const state = useQuickTradeStore()

  // Update current price when asset changes
  useEffect(() => {
    const price = ASSET_PRICES[state.selectedAsset] || 100
    setCurrentPrice(price)
    state.calculateTotal(price)
  }, [state.selectedAsset])

  // Recalculate total when shares or limit price changes
  useEffect(() => {
    state.calculateTotal(currentPrice)
  }, [state.shares, state.limitPrice])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowConfirmation(false)
      } else if (e.key === 'Enter' && showConfirmation) {
        handleExecuteTrade()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showConfirmation])

  const handleQuickTrade = (type: typeof state.orderType) => {
    state.setOrderType(type)
    state.calculateTotal(currentPrice)
    setShowConfirmation(true)
  }

  const handleExecuteTrade = async () => {
    setIsExecuting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock order response
      const order = {
        id: `ORD-${Date.now()}`,
        asset: state.selectedAsset,
        side: state.orderType.includes('buy') ? 'buy' : 'sell',
        shares: state.shares,
        price: state.limitPrice || currentPrice,
        total: state.estimatedTotal,
        status: 'filled',
        timestamp: new Date().toISOString(),
      }

      onTradeExecuted?.(order)
      setShowConfirmation(false)
      state.reset()
    } finally {
      setIsExecuting(false)
    }
  }

  const availableShares = Math.floor(state.buyingPower / currentPrice)

  // FAB Position
  if (position === 'fab') {
    return (
      <>
        {/* Floating Action Button */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-4 rounded-full shadow-lg transition-all transform ${
              isExpanded
                ? 'bg-accent text-accent-foreground scale-110'
                : 'bg-accent hover:bg-accent/90 text-accent-foreground'
            }`}
            aria-label="Quick Trade"
            title="Quick Trade (Q)"
          >
            <ShoppingCart className="h-6 w-6" />
          </button>

          {/* Expanded Panel */}
          {isExpanded && (
            <div className="absolute bottom-20 right-0 w-80 bg-card border border-border rounded-lg shadow-xl p-4 space-y-4 animate-in fade-in slide-in-from-bottom-2">
              {/* Asset Selector */}
              <div className="relative">
                <label className="block text-xs font-semibold text-muted-foreground mb-2">
                  Asset
                </label>
                <button
                  onClick={() => setShowAssetDropdown(!showAssetDropdown)}
                  className="w-full px-3 py-2 bg-muted border border-input rounded-lg flex items-center justify-between hover:bg-muted/80 transition-colors"
                >
                  <span className="font-semibold">{state.selectedAsset}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* Dropdown Menu */}
                {showAssetDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                    {/* Favorites */}
                    <div className="px-2 py-2 border-b border-border">
                      <div className="text-xs font-semibold text-muted-foreground px-2 py-1">
                        Favorites
                      </div>
                      <div className="space-y-1">
                        {FAVORITES.map((asset) => (
                          <button
                            key={asset}
                            onClick={() => {
                              state.setSelectedAsset(asset)
                              setShowAssetDropdown(false)
                            }}
                            className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
                              state.selectedAsset === asset
                                ? 'bg-accent text-accent-foreground'
                                : 'hover:bg-muted'
                            }`}
                          >
                            <div className="font-medium">{asset}</div>
                            <div className="text-xs text-muted-foreground">
                              ${ASSET_PRICES[asset]?.toFixed(2)}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* All Assets */}
                    <div className="px-2 py-2">
                      <div className="text-xs font-semibold text-muted-foreground px-2 py-1">
                        All Assets
                      </div>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {Object.entries(ASSET_PRICES).map(([asset, price]) => (
                          <button
                            key={asset}
                            onClick={() => {
                              state.setSelectedAsset(asset)
                              setShowAssetDropdown(false)
                            }}
                            className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
                              state.selectedAsset === asset
                                ? 'bg-accent text-accent-foreground'
                                : 'hover:bg-muted'
                            }`}
                          >
                            <div className="font-medium">{asset}</div>
                            <div className="text-xs text-muted-foreground">
                              ${price?.toFixed(2)}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Current Price & Buying Power */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">Current Price</div>
                  <div className="text-lg font-bold font-mono">${currentPrice.toFixed(2)}</div>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">Buying Power</div>
                  <div className="text-lg font-bold font-mono text-green-600 dark:text-green-400">
                    ${state.buyingPower.toFixed(0)}
                  </div>
                </div>
              </div>

              {/* Quantity Input */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-2">
                  Quantity
                  <span className="text-muted-foreground ml-1">
                    (Max: {availableShares})
                  </span>
                </label>
                <input
                  type="number"
                  value={state.shares}
                  onChange={(e) => state.setShares(parseFloat(e.target.value) || 0)}
                  min="0"
                  max={availableShares}
                  className="w-full px-3 py-2 bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                  placeholder="0"
                />
              </div>

              {/* Estimated Total */}
              <div className="bg-accent/10 border border-accent/30 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Estimated Total</span>
                  <span className="text-lg font-bold font-mono text-accent">
                    ${state.estimatedTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Quick Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleQuickTrade('market-buy')}
                  className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <TrendingUp className="h-4 w-4" />
                  Market Buy
                </button>
                <button
                  onClick={() => handleQuickTrade('market-sell')}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <TrendingDown className="h-4 w-4" />
                  Market Sell
                </button>
              </div>

              {/* Limit Order Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleQuickTrade('limit-buy')}
                  className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-700 dark:text-blue-400 rounded-lg font-medium transition-colors text-sm"
                >
                  Limit Buy
                </button>
                <button
                  onClick={() => handleQuickTrade('limit-sell')}
                  className="px-3 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-700 dark:text-orange-400 rounded-lg font-medium transition-colors text-sm"
                >
                  Limit Sell
                </button>
              </div>

              {/* Warning */}
              {state.estimatedTotal > state.buyingPower && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    Insufficient buying power for this order
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Confirmation Modal */}
        <TradeConfirmationModal
          isOpen={showConfirmation}
          orderDetails={{
            asset: state.selectedAsset,
            side: state.orderType.includes('buy') ? 'buy' : 'sell',
            shares: state.shares,
            price: state.limitPrice || currentPrice,
            total: state.estimatedTotal,
            orderType: state.orderType.includes('limit') ? 'limit' : 'market',
          }}
          onConfirm={handleExecuteTrade}
          onCancel={() => setShowConfirmation(false)}
          isLoading={isExecuting}
        />
      </>
    )
  }

  // Sidebar Position
  return (
    <>
      <div className="fixed right-0 top-20 h-screen w-96 bg-card border-l border-border shadow-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-accent" />
            <h2 className="font-semibold">Quick Trade</h2>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Content */}
        {isExpanded && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Asset Selector */}
            <div className="relative">
              <label className="block text-xs font-semibold text-muted-foreground mb-2">
                Asset
              </label>
              <button
                onClick={() => setShowAssetDropdown(!showAssetDropdown)}
                className="w-full px-3 py-2 bg-muted border border-input rounded-lg flex items-center justify-between hover:bg-muted/80 transition-colors"
              >
                <span className="font-semibold">{state.selectedAsset}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {/* Dropdown Menu */}
              {showAssetDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                  {/* Favorites */}
                  <div className="px-2 py-2 border-b border-border">
                    <div className="text-xs font-semibold text-muted-foreground px-2 py-1">
                      Favorites
                    </div>
                    <div className="space-y-1">
                      {FAVORITES.map((asset) => (
                        <button
                          key={asset}
                          onClick={() => {
                            state.setSelectedAsset(asset)
                            setShowAssetDropdown(false)
                          }}
                          className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
                            state.selectedAsset === asset
                              ? 'bg-accent text-accent-foreground'
                              : 'hover:bg-muted'
                          }`}
                        >
                          <div className="font-medium">{asset}</div>
                          <div className="text-xs text-muted-foreground">
                            ${ASSET_PRICES[asset]?.toFixed(2)}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* All Assets */}
                  <div className="px-2 py-2">
                    <div className="text-xs font-semibold text-muted-foreground px-2 py-1">
                      All Assets
                    </div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {Object.entries(ASSET_PRICES).map(([asset, price]) => (
                        <button
                          key={asset}
                          onClick={() => {
                            state.setSelectedAsset(asset)
                            setShowAssetDropdown(false)
                          }}
                          className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
                            state.selectedAsset === asset
                              ? 'bg-accent text-accent-foreground'
                              : 'hover:bg-muted'
                          }`}
                        >
                          <div className="font-medium">{asset}</div>
                          <div className="text-xs text-muted-foreground">
                            ${price?.toFixed(2)}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Current Price & Buying Power */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Current Price</div>
                <div className="text-lg font-bold font-mono">${currentPrice.toFixed(2)}</div>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Buying Power</div>
                <div className="text-lg font-bold font-mono text-green-600 dark:text-green-400">
                  ${state.buyingPower.toFixed(0)}
                </div>
              </div>
            </div>

            {/* Quantity Input */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-2">
                Quantity
                <span className="text-muted-foreground ml-1">
                  (Max: {availableShares})
                </span>
              </label>
              <input
                type="number"
                value={state.shares}
                onChange={(e) => state.setShares(parseFloat(e.target.value) || 0)}
                min="0"
                max={availableShares}
                className="w-full px-3 py-2 bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                placeholder="0"
              />
            </div>

            {/* Estimated Total */}
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Estimated Total</span>
                <span className="text-lg font-bold font-mono text-accent">
                  ${state.estimatedTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Quick Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleQuickTrade('market-buy')}
                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                Buy
              </button>
              <button
                onClick={() => handleQuickTrade('market-sell')}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <TrendingDown className="h-4 w-4" />
                Sell
              </button>
            </div>

            {/* Limit Order Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleQuickTrade('limit-buy')}
                className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-700 dark:text-blue-400 rounded-lg font-medium transition-colors text-sm"
              >
                Limit Buy
              </button>
              <button
                onClick={() => handleQuickTrade('limit-sell')}
                className="px-3 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-700 dark:text-orange-400 rounded-lg font-medium transition-colors text-sm"
              >
                Limit Sell
              </button>
            </div>

            {/* Warning */}
            {state.estimatedTotal > state.buyingPower && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  Insufficient buying power for this order
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <TradeConfirmationModal
        isOpen={showConfirmation}
        orderDetails={{
          asset: state.selectedAsset,
          side: state.orderType.includes('buy') ? 'buy' : 'sell',
          shares: state.shares,
          price: state.limitPrice || currentPrice,
          total: state.estimatedTotal,
          orderType: state.orderType.includes('limit') ? 'limit' : 'market',
        }}
        onConfirm={handleExecuteTrade}
        onCancel={() => setShowConfirmation(false)}
        isLoading={isExecuting}
      />
    </>
  )
}
