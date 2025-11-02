import { useState } from 'react'
import { FileText, DollarSign, TrendingUp, TrendingDown, Download, X } from 'lucide-react'
import type { TaxReport } from '../../types/export'

interface TaxReportGeneratorProps {
  onClose: () => void
  onExport?: (report: TaxReport) => void
}

/**
 * Tax Report Generator
 * Year-end tax document preparation
 */
export default function TaxReportGenerator({ onClose, onExport }: TaxReportGeneratorProps) {
  const [year, setYear] = useState<number>(new Date().getFullYear())

  // Mock tax data
  const mockTaxReport: TaxReport = {
    year,
    totalGains: 45000,
    totalLosses: -8500,
    netGain: 36500,
    trades: [
      {
        date: '2024-01-15',
        symbol: 'AAPL',
        quantity: 100,
        costBasis: 15000,
        saleProceeds: 16500,
        gain: 1500,
        holdingPeriod: 'long',
      },
      {
        date: '2024-02-20',
        symbol: 'TSLA',
        quantity: 50,
        costBasis: 8000,
        saleProceeds: 7200,
        gain: -800,
        holdingPeriod: 'short',
      },
    ],
    totalTaxableIncome: 36500,
  }

  const handleExport = () => {
    if (onExport) {
      onExport(mockTaxReport)
    }
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

  // Calculate short/long term gains
  const longTermGains = mockTaxReport.trades.reduce((sum, trade) => {
    return trade.holdingPeriod === 'long' && trade.gain > 0 ? sum + trade.gain : sum
  }, 0)

  const shortTermGains = mockTaxReport.trades.reduce((sum, trade) => {
    return trade.holdingPeriod === 'short' && trade.gain > 0 ? sum + trade.gain : sum
  }, 0)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-3xl w-full shadow-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-secondary/50">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-green-500" />
            <h2 className="text-xl font-semibold text-foreground">Tax Report Generator</h2>
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
          {/* Year Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Tax Year</label>
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-border rounded-lg bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Tax Summary */}
          <div className="bg-secondary/50 rounded-lg p-6 space-y-4">
            <h3 className="font-semibold text-foreground text-lg">Tax Summary for {year}</h3>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background rounded-lg p-4 border border-green-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-muted-foreground">Total Gains</span>
                </div>
                <div className="text-2xl font-bold text-green-500">${mockTaxReport.totalGains.toLocaleString()}</div>
              </div>

              <div className="bg-background rounded-lg p-4 border border-red-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-xs text-muted-foreground">Total Losses</span>
                </div>
                <div className="text-2xl font-bold text-red-500">${Math.abs(mockTaxReport.totalLosses).toLocaleString()}</div>
              </div>

              <div className="bg-background rounded-lg p-4 border border-blue-500/30 col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-blue-500" />
                  <span className="text-xs text-muted-foreground">Net Taxable Income</span>
                </div>
                <div className="text-2xl font-bold text-blue-500">${mockTaxReport.totalTaxableIncome.toLocaleString()}</div>
              </div>
            </div>

            {/* Holding Period Breakdown */}
            <div className="border-t border-border pt-4 space-y-3">
              <h4 className="font-medium text-foreground">Holding Period Breakdown</h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background rounded p-3 border border-border">
                  <div className="text-xs text-muted-foreground mb-2">Long-Term Gains (>1 year)</div>
                  <div className="text-lg font-bold text-green-500">${longTermGains.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground mt-1">Preferential tax rate</div>
                </div>

                <div className="bg-background rounded p-3 border border-border">
                  <div className="text-xs text-muted-foreground mb-2">Short-Term Gains (<1 year)</div>
                  <div className="text-lg font-bold text-yellow-500">${shortTermGains.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground mt-1">Ordinary income tax rate</div>
                </div>
              </div>
            </div>

            {/* Trade Details */}
            <div className="border-t border-border pt-4 space-y-3">
              <h4 className="font-medium text-foreground">Trade Details</h4>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left py-2 px-2 text-xs font-semibold text-muted-foreground">Date</th>
                      <th className="text-left py-2 px-2 text-xs font-semibold text-muted-foreground">Symbol</th>
                      <th className="text-right py-2 px-2 text-xs font-semibold text-muted-foreground">Qty</th>
                      <th className="text-right py-2 px-2 text-xs font-semibold text-muted-foreground">Cost</th>
                      <th className="text-right py-2 px-2 text-xs font-semibold text-muted-foreground">Proceeds</th>
                      <th className="text-right py-2 px-2 text-xs font-semibold text-muted-foreground">Gain/Loss</th>
                      <th className="text-left py-2 px-2 text-xs font-semibold text-muted-foreground">Term</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {mockTaxReport.trades.map((trade, idx) => (
                      <tr key={idx} className="hover:bg-secondary/50">
                        <td className="py-2 px-2">{trade.date}</td>
                        <td className="py-2 px-2 font-medium">{trade.symbol}</td>
                        <td className="py-2 px-2 text-right">{trade.quantity}</td>
                        <td className="py-2 px-2 text-right">${trade.costBasis.toLocaleString()}</td>
                        <td className="py-2 px-2 text-right">${trade.saleProceeds.toLocaleString()}</td>
                        <td
                          className={`py-2 px-2 text-right font-medium ${trade.gain > 0 ? 'text-green-500' : 'text-red-500'}`}
                        >
                          ${trade.gain.toLocaleString()}
                        </td>
                        <td className="py-2 px-2">
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              trade.holdingPeriod === 'long'
                                ? 'bg-green-500/20 text-green-600'
                                : 'bg-yellow-500/20 text-yellow-600'
                            }`}
                          >
                            {trade.holdingPeriod === 'long' ? 'Long' : 'Short'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-700 dark:text-blue-300">
              <p className="font-medium mb-2">📋 Important Tax Information:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Long-term capital gains: Assets held >1 year (preferential rates)</li>
                <li>Short-term gains: Taxed as ordinary income</li>
                <li>You can deduct investment losses (up to $3,000/year)</li>
                <li>Consult a tax professional for your specific situation</li>
                <li>This report is for informational purposes only</li>
              </ul>
            </div>
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
            onClick={handleExport}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" />
            Download Tax Report
          </button>
        </div>
      </div>
    </div>
  )
}
