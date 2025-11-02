/**
 * Export & Reporting Types
 * Data export formats, reports, and scheduling
 */

/**
 * Export format options
 */
export type ExportFormat = 'csv' | 'excel' | 'pdf' | 'json'

/**
 * Report types
 */
export type ReportType =
  | 'performance'
  | 'trades'
  | 'portfolio'
  | 'tax'
  | 'signals'
  | 'risk'

/**
 * Report schedule frequency
 */
export type ReportFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly'

/**
 * Benchmark options for comparison
 */
export type BenchmarkType = 'sp500' | 'nasdaq' | 'btc' | 'eth' | 'custom'

/**
 * Trade export data
 */
export interface TradeExport {
  date: string
  symbol: string
  side: 'buy' | 'sell'
  quantity: number
  entryPrice: number
  exitPrice?: number
  pnl?: number
  pnlPercent?: number
  duration?: string
  notes?: string
}

/**
 * Portfolio snapshot for sharing
 */
export interface PortfolioSnapshot {
  date: string
  totalValue: number
  totalPnL: number
  pnlPercent: number
  positions: Array<{
    symbol: string
    quantity: number
    value: number
    pnl: number
    allocation: number
  }>
  showBalances: boolean
}

/**
 * Performance report
 */
export interface PerformanceReport {
  period: {
    startDate: string
    endDate: string
  }
  summary: {
    totalReturn: number
    totalReturnPercent: number
    sharpeRatio: number
    maxDrawdown: number
    winRate: number
    profitFactor: number
  }
  benchmark?: {
    type: BenchmarkType
    returnPercent: number
  }
  trades: TradeExport[]
  monthlyStats: Array<{
    month: string
    return: number
    returnPercent: number
  }>
}

/**
 * Tax report for year-end
 */
export interface TaxReport {
  year: number
  totalGains: number
  totalLosses: number
  netGain: number
  trades: Array<{
    date: string
    symbol: string
    quantity: number
    costBasis: number
    saleProceeds: number
    gain: number
    holdingPeriod: 'short' | 'long'
  }>
  totalTaxableIncome: number
}

/**
 * Email report configuration
 */
export interface EmailReportConfig {
  id: string
  frequency: ReportFrequency
  reportType: ReportType
  recipients: string[]
  enabled: boolean
  lastSent?: string
  nextScheduled?: string
}

/**
 * Social media share settings
 */
export interface SocialShareSettings {
  platform: 'twitter' | 'linkedin' | 'facebook'
  includeChart: boolean
  blurBalances: boolean
  includePerformance: boolean
  customMessage?: string
}

/**
 * Export job status
 */
export type ExportStatus = 'pending' | 'processing' | 'completed' | 'failed'

/**
 * Export job
 */
export interface ExportJob {
  id: string
  format: ExportFormat
  dataType: ReportType
  status: ExportStatus
  createdAt: string
  completedAt?: string
  filename?: string
  downloadUrl?: string
  error?: string
}
