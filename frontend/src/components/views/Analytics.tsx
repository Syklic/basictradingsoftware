import { BarChart3, TrendingUp, AlertCircle } from 'lucide-react'

export default function Analytics() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="h-8 w-8 text-accent" />
        <h1 className="text-3xl font-bold">Analytics</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Metrics
          </h2>
          <div className="space-y-3">
            {['Total Return', 'YTD Return', 'Win Rate', 'Avg Trade'].map((metric) => (
              <div key={metric} className="flex justify-between items-center p-2">
                <span className="text-sm text-muted-foreground">{metric}</span>
                <span className="font-medium">--</span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Analysis */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Risk Analysis
          </h2>
          <div className="space-y-3">
            {['Max Drawdown', 'Volatility', 'Sharpe Ratio', 'Risk/Reward'].map((metric) => (
              <div key={metric} className="flex justify-between items-center p-2">
                <span className="text-sm text-muted-foreground">{metric}</span>
                <span className="font-medium">--</span>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Returns Over Time</h2>
          <div className="bg-muted p-8 rounded-lg h-64 flex items-center justify-center text-center text-muted-foreground">
            <p>Performance Chart Placeholder</p>
          </div>
        </div>

        {/* Trade Journal */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Trade Journal</h2>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-muted p-3 rounded-lg flex justify-between text-sm">
                <span>Trade #{i}</span>
                <span className="text-muted-foreground">Placeholder entry</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
