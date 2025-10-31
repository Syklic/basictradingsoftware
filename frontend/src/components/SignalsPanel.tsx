import { Zap } from 'lucide-react'

interface SignalsPanelProps {
  signals: any[]
}

export default function SignalsPanel({ signals }: SignalsPanelProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-5 w-5 text-accent" />
        <h3 className="font-semibold">Active Signals</h3>
      </div>
      <div className="space-y-3">
        {signals && signals.length > 0 ? (
          signals.map((signal, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between border-b border-border pb-3 last:border-0"
            >
              <div>
                <p className="font-medium">{signal.symbol}</p>
                <p className="text-xs text-muted-foreground">
                  Confidence: {(signal.confidence * 100).toFixed(1)}%
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`font-semibold ${
                    signal.direction === 'BUY'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {signal.direction}
                </p>
                <p className="text-sm text-muted-foreground">{signal.model}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-6">
            Waiting for signals...
          </p>
        )}
      </div>
    </div>
  )
}
