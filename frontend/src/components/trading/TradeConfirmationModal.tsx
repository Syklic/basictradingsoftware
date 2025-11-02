import { X, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react'
import { QuickTradeState } from '../../hooks/useQuickTrade'

interface TradeConfirmationModalProps {
  isOpen: boolean
  orderDetails: {
    asset: string
    side: 'buy' | 'sell'
    shares: number
    price: number
    total: number
    orderType: 'market' | 'limit'
  }
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

export default function TradeConfirmationModal({
  isOpen,
  orderDetails,
  onConfirm,
  onCancel,
  isLoading = false,
}: TradeConfirmationModalProps) {
  if (!isOpen) return null

  const isBuy = orderDetails.side === 'buy'
  const Icon = isBuy ? TrendingUp : TrendingDown
  const sideColor = isBuy ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
  const sideBackground = isBuy
    ? 'bg-green-500/10 border-green-500/30'
    : 'bg-red-500/10 border-red-500/30'
  const buttonColor = isBuy
    ? 'bg-green-600 hover:bg-green-700'
    : 'bg-red-600 hover:bg-red-700'

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg shadow-xl max-w-sm w-full mx-4 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${sideBackground}`}>
              <Icon className={`h-6 w-6 ${sideColor}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Confirm Trade</h2>
              <p className="text-sm text-muted-foreground">
                {isBuy ? 'Market Buy' : 'Market Sell'} Order
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="p-1 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Order Details */}
        <div className={`border rounded-lg p-4 ${sideBackground}`}>
          <div className="space-y-3">
            {/* Asset */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Asset</span>
              <span className="font-semibold">{orderDetails.asset}</span>
            </div>

            {/* Quantity */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Quantity</span>
              <span className="font-semibold">{orderDetails.shares.toFixed(2)}</span>
            </div>

            {/* Price */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Price</span>
              <span className="font-semibold font-mono">
                ${orderDetails.price.toFixed(2)}
              </span>
            </div>

            {/* Order Type */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Order Type</span>
              <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded-full font-medium">
                {orderDetails.orderType.toUpperCase()}
              </span>
            </div>

            {/* Divider */}
            <div className="border-t border-current opacity-20"></div>

            {/* Total */}
            <div className="flex justify-between items-center pt-1">
              <span className="font-semibold">Estimated Total</span>
              <span className={`text-lg font-bold font-mono ${sideColor}`}>
                ${orderDetails.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Warning for Market Orders */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-700 dark:text-amber-400">
            <strong>Market Order:</strong> Executes immediately at the best available price.
            Final price may differ from displayed price.
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-muted hover:bg-muted/80 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2.5 ${buttonColor} text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2`}
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <Icon className="h-4 w-4" />
                {isBuy ? 'Confirm Buy' : 'Confirm Sell'}
              </>
            )}
          </button>
        </div>

        {/* Keyboard Hints */}
        <div className="text-xs text-muted-foreground text-center">
          Press <kbd className="px-2 py-1 bg-muted rounded text-foreground font-mono">Enter</kbd> to confirm or{' '}
          <kbd className="px-2 py-1 bg-muted rounded text-foreground font-mono">Esc</kbd> to cancel
        </div>
      </div>
    </div>
  )
}
