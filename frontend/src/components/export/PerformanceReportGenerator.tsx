import { useState } from 'react'
import { TrendingUp, Calendar, BarChart3, Download, Share2, X } from 'lucide-react'
import type { PerformanceReport, BenchmarkType } from '../../types/export'
import { prepareTaxReport, formatBenchmarkName } from '../../utils/exportData'

interface PerformanceReportGeneratorProps {
  onClose: () => void
  onExport?: (report: PerformanceReport) => void
}

/**
 * Performance Report Generator
 * Create and view performance reports with benchmark comparison
 */
export default function PerformanceReportGenerator({ onClose, onExport }: PerformanceReportGeneratorProps) {
  const [startDate, setStartDate] = useState<string>(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [selectedBenchmark, setSelectedBenchmark] = useState<BenchmarkType>('sp500')
  const [includeMonthly, setIncludeMonthly] = useState(true)

  const benchmarks: Array<{ id: BenchmarkType; label: string; description: string }> = [
    { id: 'sp500', label: 'S&P 500', description: 'US Large Cap' },
    { id: 'nasdaq', label: 'NASDAQ', description: 'US Tech Heavy' },
    { id: 'btc', label: 'Bitcoin', description: 'Crypto Benchmark' },
    { id: 'eth', label: 'Ethereum', description: 'Alt Crypto' },
    { id: 'custom', label: 'Custom', description: 'Your baseline' },
  ]

  // Mock performance data
  const mockReport: PerformanceReport = {
    period: { startDate, endDate },
    summary: {
      totalReturn: 15200,
      totalReturnPercent: 0.152,
      sharpeRatio: 1.85,
      maxDrawdown: -0.087,
      winRate: 0.62,
      profitFactor: 2.15,
    },
    benchmark: {
      type: selectedBenchmark,
      returnPercent: 0.098,
    },
    trades: [
      {
        date: startDate,
        symbol: 'AAPL',
        side: 'buy',
        quantity: 100,
        entryPrice: 150,
        exitPrice: 165,
        pnl: 1500,
        pnlPercent: 0.1,
        duration: '15 days',
      },
    ],
    monthlyStats: [
      { month: 'Jan', return: 4200, returnPercent: 0.042 },
      { month: 'Feb', return: 3800, returnPercent: 0.038 },
      { month: 'Mar', return: 7200, returnPercent: 0.072 },
    ],
  }

  const handleGenerateReport = () => {
    if (onExport) {
      onExport(mockReport)
    }
  }

  const meatsOutperforms =
    mockReport.summary.totalReturnPercent > (mockReport.benchmark?.returnPercent || 0)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-2xl w-full shadow-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-secondary/50">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Performance Report</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Benchmark Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Benchmark</label>
            <div className="grid grid-cols-2 gap-3">
              {benchmarks.map((benchmark) => (
                <button
                  key={benchmark.id}
                  onClick={() => setSelectedBenchmark(benchmark.id)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    selectedBenchmark === benchmark.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="font-medium text-sm text-foreground">{benchmark.label}</div>
                  <div className="text-xs text-muted-foreground">{benchmark.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={includeMonthly}
              onChange={(e) => setIncludeMonthly(e.target.checked)}
              className="w-4 h-4 rounded accent-primary cursor-pointer"
            />
            <span className="text-sm text-foreground">Include monthly breakdown</span>
          </label>

          {/* Report Preview */}
          <div className="bg-secondary/50 rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Report Summary
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background rounded p-3 border border-border">
                <div className="text-xs text-muted-foreground">Total Return</div>
                <div className={`text-lg font-bold ${mockReport.summary.totalReturnPercent > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {(mockReport.summary.totalReturnPercent * 100).toFixed(2)}%
                </div>
              </div>

              <div className="bg-background rounded p-3 border border-border">
                <div className="text-xs text-muted-foreground">Sharpe Ratio</div>
                <div className="text-lg font-bold text-blue-500">{mockReport.summary.sharpeRatio.toFixed(2)}</div>
              </div>

              <div className="bg-background rounded p-3 border border-border">
                <div className="text-xs text-muted-foreground">Max Drawdown</div>
                <div className="text-lg font-bold text-yellow-500">{(mockReport.summary.maxDrawdown * 100).toFixed(2)}%</div>
              </div>

              <div className="bg-background rounded p-3 border border-border">
                <div className="text-xs text-muted-foreground">Win Rate</div>
                <div className="text-lg font-bold text-green-500">{(mockReport.summary.winRate * 100).toFixed(1)}%</div>
              </div>
            </div>

            {/* Benchmark Comparison */}
            <div className="bg-background rounded p-3 border border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">vs {formatBenchmarkName(selectedBenchmark)}</span>
                <span
                  className={`font-bold ${meatsOutperforms ? 'text-green-500' : 'text-red-500'}`}
                >
                  {meatsOutperforms ? '+' : ''}
                  {(
                    (mockReport.summary.totalReturnPercent -
                      (mockReport.benchmark?.returnPercent || 0)) *
                    100
                  ).toFixed(2)}
                  %
                </span>
              </div>
            </div>

            {/* Monthly Stats */}
            {includeMonthly && (
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-2">Monthly Returns</div>
                <div className="space-y-2">
                  {mockReport.monthlyStats.map((stat) => (
                    <div key={stat.month} className="flex items-center justify-between text-sm">
                      <span>{stat.month}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full ${stat.returnPercent > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.min(Math.abs(stat.returnPercent * 100), 100)}%` }}
                          />
                        </div>
                        <span className={stat.returnPercent > 0 ? 'text-green-500' : 'text-red-500'}>
                          {(stat.returnPercent * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border bg-secondary/50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerateReport}
            className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" />
            Generate Report
          </button>
        </div>
      </div>
    </div>
  )
}
