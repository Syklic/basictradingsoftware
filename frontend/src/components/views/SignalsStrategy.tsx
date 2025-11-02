import { TrendingUp, Brain } from 'lucide-react'

export default function SignalsStrategy() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <TrendingUp className="h-8 w-8 text-accent" />
        <h1 className="text-3xl font-bold">Signals & Strategy</h1>
      </div>

      <div className="space-y-6">
        {/* ML Model Status */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Brain className="h-5 w-5" />
            ML Model Status
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted p-4 rounded-lg text-center">
              <div className="text-sm text-muted-foreground">Model</div>
              <div className="text-2xl font-bold">--</div>
            </div>
            <div className="bg-muted p-4 rounded-lg text-center">
              <div className="text-sm text-muted-foreground">Accuracy</div>
              <div className="text-2xl font-bold">--</div>
            </div>
            <div className="bg-muted p-4 rounded-lg text-center">
              <div className="text-sm text-muted-foreground">Status</div>
              <div className="text-2xl font-bold">--</div>
            </div>
          </div>
        </div>

        {/* Active Signals */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Active Signals</h2>
          <div className="space-y-2">
            {['BTC - BUY', 'ETH - HOLD', 'SPY - SELL'].map((signal, i) => (
              <div key={i} className="bg-muted p-3 rounded-lg flex justify-between items-center">
                <span className="font-medium">{signal}</span>
                <span className="text-xs text-muted-foreground">Confidence: --</span>
              </div>
            ))}
          </div>
        </div>

        {/* Backtesting Results */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Backtesting Results</h2>
          <div className="bg-muted p-4 rounded-lg h-48 flex items-center justify-center text-center text-muted-foreground">
            <p>Backtest Chart Placeholder</p>
          </div>
        </div>
      </div>
    </div>
  )
}
