import { Briefcase, TrendingUp } from 'lucide-react'

export default function Portfolio() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Briefcase className="h-8 w-8 text-accent" />
        <h1 className="text-3xl font-bold">Portfolio</h1>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <p className="text-muted-foreground mb-6">
          Deep dive into positions, P&L history, and allocation breakdowns
        </p>

        {/* Portfolio sections */}
        <div className="space-y-6">
          {/* Holdings */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Your Holdings</h2>
            <div className="space-y-2">
              {['BTC', 'ETH', 'SPY', 'QQQ'].map((asset) => (
                <div key={asset} className="bg-muted p-3 rounded-lg flex justify-between">
                  <span className="font-medium">{asset}</span>
                  <span className="text-muted-foreground">Placeholder data</span>
                </div>
              ))}
            </div>
          </div>

          {/* P&L History */}
          <div>
            <h2 className="text-lg font-semibold mb-3">P&L History</h2>
            <div className="bg-muted p-4 rounded-lg flex items-center justify-center h-48">
              <div className="text-center text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>P&L Chart Placeholder</p>
              </div>
            </div>
          </div>

          {/* Allocation */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Asset Allocation</h2>
            <div className="grid grid-cols-3 gap-3">
              {['Stocks', 'Crypto', 'Cash'].map((category) => (
                <div key={category} className="bg-muted p-3 rounded-lg text-center">
                  <div className="text-sm text-muted-foreground">{category}</div>
                  <div className="text-2xl font-bold">0%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
