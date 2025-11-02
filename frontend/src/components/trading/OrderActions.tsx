import { useState } from 'react'
import { Trash2, Edit3, AlertCircle, X } from 'lucide-react'

interface OrderActionsProps {
  orderId: string
  orderStatus: 'submitted' | 'accepted' | 'partial-fill' | 'filled' | 'canceled' | 'rejected' | 'expired'
  currentPrice: number
  onCancel?: (orderId: string) => void
  onModify?: (orderId: string, newPrice: number) => void
  canCancel?: boolean
  canModify?: boolean
}

export default function OrderActions({
  orderId,
  orderStatus,
  currentPrice,
  onCancel,
  onModify,
  canCancel = true,
  canModify = true,
}: OrderActionsProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showModifyDialog, setShowModifyDialog] = useState(false)
  const [newPrice, setNewPrice] = useState(currentPrice)
  const [isCanceling, setIsCanceling] = useState(false)
  const [isModifying, setIsModifying] = useState(false)

  // Check if order can be canceled (not filled, rejected, expired, or already canceled)
  const canBeCanceled =
    canCancel &&
    !['filled', 'canceled', 'rejected', 'expired'].includes(orderStatus)

  // Check if order can be modified (only accepted or partial-fill)
  const canBeModified =
    canModify && ['accepted', 'partial-fill'].includes(orderStatus)

  const handleConfirmCancel = async () => {
    setIsCanceling(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      onCancel?.(orderId)
      setShowCancelDialog(false)
    } finally {
      setIsCanceling(false)
    }
  }

  const handleConfirmModify = async () => {
    setIsModifying(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      onModify?.(orderId, newPrice)
      setShowModifyDialog(false)
    } finally {
      setIsModifying(false)
    }
  }

  return (
    <div className="space-y-3 bg-card border border-border rounded-lg p-4">
      <h3 className="font-semibold">Order Actions</h3>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {/* Modify Button */}
        <button
          onClick={() => setShowModifyDialog(true)}
          disabled={!canBeModified}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
            canBeModified
              ? 'bg-blue-500/20 text-blue-700 dark:text-blue-400 hover:bg-blue-500/30'
              : 'bg-muted text-muted-foreground opacity-50 cursor-not-allowed'
          }`}
          title={canBeModified ? 'Modify order price' : 'Order cannot be modified in current state'}
        >
          <Edit3 className="h-4 w-4" />
          Modify
        </button>

        {/* Cancel Button */}
        <button
          onClick={() => setShowCancelDialog(true)}
          disabled={!canBeCanceled}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
            canBeCanceled
              ? 'bg-red-500/20 text-red-700 dark:text-red-400 hover:bg-red-500/30'
              : 'bg-muted text-muted-foreground opacity-50 cursor-not-allowed'
          }`}
          title={canBeCanceled ? 'Cancel this order' : 'Order cannot be canceled in current state'}
        >
          <Trash2 className="h-4 w-4" />
          Cancel
        </button>
      </div>

      {/* Status Info */}
      {!canBeCanceled && !canBeModified && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-700 dark:text-amber-400">
            <strong>No actions available:</strong> This order has reached a final state and cannot be
            modified or canceled.
          </div>
        </div>
      )}

      {/* Cancel Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg shadow-xl max-w-sm w-full mx-4 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold">Cancel Order?</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Are you sure you want to cancel this order?
                </p>
              </div>
              <button
                onClick={() => setShowCancelDialog(false)}
                disabled={isCanceling}
                className="p-1 hover:bg-muted rounded transition-colors disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Order Summary */}
            <div className="bg-muted p-3 rounded-lg space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-mono font-semibold">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Status</span>
                <span className="font-semibold capitalize">{orderStatus.replace('-', ' ')}</span>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-red-700 dark:text-red-400">
                Any shares already filled will remain in your portfolio.
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowCancelDialog(false)}
                disabled={isCanceling}
                className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Keep Order
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={isCanceling}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isCanceling ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Canceling...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Confirm Cancel
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modify Dialog */}
      {showModifyDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg shadow-xl max-w-sm w-full mx-4 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold">Modify Order</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Update the price for this order
                </p>
              </div>
              <button
                onClick={() => setShowModifyDialog(false)}
                disabled={isModifying}
                className="p-1 hover:bg-muted rounded transition-colors disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Price Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground">
                New Price
              </label>
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(parseFloat(e.target.value) || currentPrice)}
                className="w-full px-3 py-2 bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                step="0.01"
                disabled={isModifying}
              />
              <div className="text-xs text-muted-foreground">
                Current: ${currentPrice.toFixed(2)} → New: ${newPrice.toFixed(2)}
              </div>
            </div>

            {/* Difference */}
            {newPrice !== currentPrice && (
              <div
                className={`p-2 rounded-lg text-sm ${
                  newPrice > currentPrice
                    ? 'bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-400'
                    : 'bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-400'
                }`}
              >
                {newPrice > currentPrice ? '↑' : '↓'} Change: $
                {Math.abs(newPrice - currentPrice).toFixed(2)}
              </div>
            )}

            {/* Info */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2">
              <div className="text-xs text-blue-700 dark:text-blue-400">
                💡 <strong>Note:</strong> Modifying the order price will replace your current order.
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowModifyDialog(false)}
                disabled={isModifying}
                className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmModify}
                disabled={isModifying || newPrice === currentPrice}
                className="flex-1 px-4 py-2 bg-accent hover:opacity-90 text-accent-foreground rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isModifying ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Modifying...
                  </>
                ) : (
                  <>
                    <Edit3 className="h-4 w-4" />
                    Confirm Modify
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
