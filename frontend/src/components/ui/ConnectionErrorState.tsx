import { AlertTriangle } from 'lucide-react'
import { useState, useEffect } from 'react'

interface ConnectionErrorStateProps {
  onRetry?: () => void
  serverUrl?: string
}

export default function ConnectionErrorState({ onRetry, serverUrl = 'http://localhost:8000' }: ConnectionErrorStateProps) {
  const [retryCountdown, setRetryCountdown] = useState(0)

  useEffect(() => {
    if (retryCountdown > 0) {
      const timer = setTimeout(() => setRetryCountdown(retryCountdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [retryCountdown])

  const handleRetry = () => {
    setRetryCountdown(5) // Start countdown
    onRetry?.()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg shadow-xl max-w-sm w-full mx-4 p-8">
        <div className="text-center">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-16 w-16 text-red-500" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold mb-2">Connection Lost</h2>

          {/* Description */}
          <p className="text-muted-foreground mb-4">
            Cannot reach the backend server. Check your connection and try again.
          </p>

          {/* Error Details */}
          <div className="bg-muted/50 p-3 rounded-lg mb-6 text-left">
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">Server URL:</span>
                <span className="font-mono text-xs text-muted-foreground">{serverUrl}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">Status:</span>
                <span className="text-red-500 font-medium">Unreachable</span>
              </div>
            </div>
          </div>

          {/* Troubleshooting Steps */}
          <div className="text-left mb-6">
            <h3 className="text-sm font-semibold mb-2 text-foreground">Troubleshooting:</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Check your internet connection</li>
              <li>• Verify backend server is running</li>
              <li>• Check server URL in Settings</li>
              <li>• Try again in a few moments</li>
            </ul>
          </div>

          {/* Retry Countdown */}
          {retryCountdown > 0 && (
            <div className="mb-4 text-sm text-amber-600 dark:text-amber-500">
              Auto-retry in {retryCountdown}s...
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleRetry}
              disabled={retryCountdown > 0}
              className="flex-1 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 disabled:opacity-50 font-medium transition-all"
            >
              {retryCountdown > 0 ? `Retrying (${retryCountdown}s)` : 'Retry Now'}
            </button>
            <button
              onClick={() => console.log('Open settings')}
              className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg font-medium transition-colors"
            >
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
