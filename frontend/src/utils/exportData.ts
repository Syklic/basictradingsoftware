/**
 * Data Export Utilities
 * CSV, Excel, PDF exports and social media sharing
 */

import type {
  TradeExport,
  PerformanceReport,
  TaxReport,
  PortfolioSnapshot,
  SocialShareSettings,
} from '../types/export'

/**
 * Export trades to CSV
 */
export const exportTradesCSV = (trades: TradeExport[]): string => {
  const headers = ['Date', 'Symbol', 'Side', 'Quantity', 'Entry Price', 'Exit Price', 'P&L', 'P&L %', 'Duration', 'Notes']
  const rows = trades.map((trade) => [
    trade.date,
    trade.symbol,
    trade.side,
    trade.quantity.toString(),
    trade.entryPrice.toString(),
    trade.exitPrice?.toString() ?? '',
    trade.pnl?.toString() ?? '',
    trade.pnlPercent?.toString() ?? '',
    trade.duration ?? '',
    trade.notes ?? '',
  ])

  const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')
  return csv
}

/**
 * Export portfolio snapshot to CSV
 */
export const exportPortfolioCSV = (snapshot: PortfolioSnapshot): string => {
  const headers = ['Symbol', 'Quantity', 'Value', 'P&L', 'Allocation %']
  const rows = snapshot.positions.map((pos) => [
    pos.symbol,
    pos.quantity.toString(),
    pos.value.toFixed(2),
    pos.pnl.toFixed(2),
    pos.allocation.toFixed(2),
  ])

  const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')

  // Add summary
  csv += '\n\nPortfolio Summary\n'
  csv += `Date,${snapshot.date}\n`
  csv += `Total Value,$${snapshot.totalValue.toFixed(2)}\n`
  csv += `Total P&L,$${snapshot.totalPnL.toFixed(2)}\n`
  csv += `P&L %,${snapshot.pnlPercent.toFixed(2)}%\n`

  return csv
}

/**
 * Export performance report to CSV
 */
export const exportPerformanceCSV = (report: PerformanceReport): string => {
  let csv = 'Performance Report\n'
  csv += `Period,${report.period.startDate} to ${report.period.endDate}\n\n`

  csv += 'Summary\n'
  csv += `Total Return %,${(report.summary.totalReturnPercent * 100).toFixed(2)}%\n`
  csv += `Sharpe Ratio,${report.summary.sharpeRatio.toFixed(2)}\n`
  csv += `Max Drawdown,${(report.summary.maxDrawdown * 100).toFixed(2)}%\n`
  csv += `Win Rate,${(report.summary.winRate * 100).toFixed(2)}%\n`
  csv += `Profit Factor,${report.summary.profitFactor.toFixed(2)}\n`

  if (report.benchmark) {
    csv += `\nBenchmark (${report.benchmark.type}),${(report.benchmark.returnPercent * 100).toFixed(2)}%\n`
  }

  csv += '\nTrades\n'
  csv += exportTradesCSV(report.trades)

  csv += '\n\nMonthly Statistics\n'
  csv += 'Month,Return %\n'
  csv += report.monthlyStats.map((stat) => `${stat.month},${(stat.returnPercent * 100).toFixed(2)}%`).join('\n')

  return csv
}

/**
 * Export tax report to CSV
 */
export const exportTaxReportCSV = (report: TaxReport): string => {
  let csv = `Tax Report - ${report.year}\n\n`

  csv += 'Summary\n'
  csv += `Total Gains,$${report.totalGains.toFixed(2)}\n`
  csv += `Total Losses,$${Math.abs(report.totalLosses).toFixed(2)}\n`
  csv += `Net Gain/Loss,$${report.netGain.toFixed(2)}\n`
  csv += `Total Taxable Income,$${report.totalTaxableIncome.toFixed(2)}\n\n`

  csv += 'Trade Details\n'
  csv += 'Date,Symbol,Quantity,Cost Basis,Sale Proceeds,Gain,Holding Period\n'
  csv += report.trades
    .map(
      (trade) =>
        `${trade.date},"${trade.symbol}",${trade.quantity},$${trade.costBasis.toFixed(2)},$${trade.saleProceeds.toFixed(2)},$${trade.gain.toFixed(2)},${trade.holdingPeriod}`
    )
    .join('\n')

  return csv
}

/**
 * Download file helper
 */
export const downloadFile = (content: string, filename: string, mimeType: string = 'text/plain'): void => {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export trades to CSV file
 */
export const downloadTradesCSV = (trades: TradeExport[]): void => {
  const csv = exportTradesCSV(trades)
  const filename = `trades-${new Date().toISOString().split('T')[0]}.csv`
  downloadFile(csv, filename, 'text/csv')
}

/**
 * Export portfolio to CSV file
 */
export const downloadPortfolioCSV = (snapshot: PortfolioSnapshot): void => {
  const csv = exportPortfolioCSV(snapshot)
  const filename = `portfolio-${snapshot.date}.csv`
  downloadFile(csv, filename, 'text/csv')
}

/**
 * Export performance report to CSV file
 */
export const downloadPerformanceCSV = (report: PerformanceReport): void => {
  const csv = exportPerformanceCSV(report)
  const filename = `performance-${report.period.startDate}-to-${report.period.endDate}.csv`
  downloadFile(csv, filename, 'text/csv')
}

/**
 * Export tax report to CSV file
 */
export const downloadTaxReportCSV = (report: TaxReport): void => {
  const csv = exportTaxReportCSV(report)
  const filename = `tax-report-${report.year}.csv`
  downloadFile(csv, filename, 'text/csv')
}

/**
 * Generate JSON export
 */
export const exportToJSON = (data: unknown, filename: string): void => {
  const json = JSON.stringify(data, null, 2)
  downloadFile(json, filename, 'application/json')
}

/**
 * Blur balance in image (for social sharing)
 */
export const blurBalanceInCanvas = (canvas: HTMLCanvasElement, threshold: number = 0.3): void => {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  // Apply blur effect to high-value regions (simplified - blurs areas with numbers)
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    // Detect text-like regions and blur them slightly
    const brightness = (r + g + b) / 3
    if (brightness > 100 && brightness < 200) {
      // Apply pixelation effect
      data[i] = Math.floor(data[i] * 0.8)
      data[i + 1] = Math.floor(data[i + 1] * 0.8)
      data[i + 2] = Math.floor(data[i + 2] * 0.8)
    }
  }

  ctx.putImageData(imageData, 0, 0)
}

/**
 * Generate social media share link
 */
export const generateShareLink = (
  platform: 'twitter' | 'linkedin' | 'facebook',
  message: string,
  url?: string
): string => {
  const encodedMessage = encodeURIComponent(message)
  const encodedUrl = url ? encodeURIComponent(url) : ''

  switch (platform) {
    case 'twitter':
      return `https://twitter.com/intent/tweet?text=${encodedMessage}${url ? `&url=${encodedUrl}` : ''}`
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
  }
}

/**
 * Create performance snapshot for sharing
 */
export const createShareablePerformanceMessage = (
  report: PerformanceReport,
  blurBalance: boolean = true
): string => {
  const returnPercent = (report.summary.totalReturnPercent * 100).toFixed(2)
  const message = `
📊 Trading Performance Report
📅 ${report.period.startDate} to ${report.period.endDate}

📈 Return: ${returnPercent}%
📊 Sharpe Ratio: ${report.summary.sharpeRatio.toFixed(2)}
🎯 Win Rate: ${(report.summary.winRate * 100).toFixed(2)}%
📉 Max Drawdown: ${(report.summary.maxDrawdown * 100).toFixed(2)}%

${
  report.benchmark
    ? `🏆 vs ${report.benchmark.type.toUpperCase()}: ${(report.benchmark.returnPercent * 100).toFixed(2)}%`
    : ''
}

Powered by Trading Platform 🚀
`.trim()

  return message
}

/**
 * Format benchmark name
 */
export const formatBenchmarkName = (
  benchmark: 'sp500' | 'nasdaq' | 'btc' | 'eth' | 'custom'
): string => {
  const names: Record<typeof benchmark, string> = {
    sp500: 'S&P 500',
    nasdaq: 'NASDAQ',
    btc: 'Bitcoin',
    eth: 'Ethereum',
    custom: 'Custom Benchmark',
  }
  return names[benchmark]
}

/**
 * Calculate tax holding period
 */
export const calculateHoldingPeriod = (startDate: string, endDate: string): 'short' | 'long' => {
  const start = new Date(startDate).getTime()
  const end = new Date(endDate).getTime()
  const daysDiff = (end - start) / (1000 * 60 * 60 * 24)
  return daysDiff > 365 ? 'long' : 'short'
}

/**
 * Prepare tax report from trades
 */
export const prepareTaxReport = (trades: TradeExport[], year: number): TaxReport => {
  const yearTrades = trades.filter((trade) => new Date(trade.date).getFullYear() === year)

  let totalGains = 0
  let totalLosses = 0

  const taxTrades = yearTrades
    .filter((trade) => trade.exitPrice !== undefined && trade.pnl !== undefined)
    .map((trade) => {
      const gain = trade.pnl!
      if (gain > 0) {
        totalGains += gain
      } else {
        totalLosses += gain
      }

      return {
        date: trade.date,
        symbol: trade.symbol,
        quantity: trade.quantity,
        costBasis: trade.entryPrice * trade.quantity,
        saleProceeds: (trade.exitPrice ?? 0) * trade.quantity,
        gain: gain,
        holdingPeriod: calculateHoldingPeriod(trade.date, new Date().toISOString().split('T')[0]),
      }
    })

  const netGain = totalGains + totalLosses
  const totalTaxableIncome = Math.max(0, totalGains + Math.max(0, totalLosses))

  return {
    year,
    totalGains,
    totalLosses,
    netGain,
    trades: taxTrades,
    totalTaxableIncome,
  }
}
