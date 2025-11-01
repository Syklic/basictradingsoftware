import { Zap } from 'lucide-react'
import EmptyState from './ui/EmptyState'

interface SignalsPanelProps {
  signals: any[]
}

export default function SignalsPanel({ signals }: SignalsPanelProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-5 w-5 text-accent" />
        <h3 className="font-semibold">Active Signals</h3>
        {signals && signals.length > 0 && (
          <span className="ml-auto text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
            {signals.length}
          </span>
        )}
      </div>

      {signals && signals.length > 0 ? (
        <div className="space-y-3 flex-1 overflow-y-auto">
          {signals.map((signal, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between border-b border-border pb-3 last:border-0 hover:bg-muted/50 p-2 rounded transition-colors"
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
                      ? 'text-green-600 dark:text-green-500'
                      : 'text-red-600 dark:text-red-500'
                  }`}
                >
                  {signal.direction}
                </p>
                <p className="text-sm text-muted-foreground">{signal.model}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            icon={<Zap className="h-12 w-12" />}
            title="Waiting for Signals"
            description="The ML model is analyzing market data and will generate Buy/Sell signals when conditions are met"
            size="md"
            progress={65}
            metadata={{
              'Model Status': 'Training',
              'Assets Analyzed': '47',
            }}
            tip="💡 Signals appear here when the ML model identifies promising trading opportunities"
          />
        </div>
      )}
    </div>
  )
}
