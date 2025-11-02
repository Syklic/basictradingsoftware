/**
 * Trading Types
 * Centralized type definitions for all trading-related components
 */

export interface Position {
  id: string
  symbol: string
  shares: number
  entryPrice: number
  currentPrice: number
  value: number
  percentOfPortfolio: number
  priceHistory: number[]
}

export interface PositionStats {
  totalValue: number
  totalCost: number
  totalPnL: number
  totalPnLPercent: number
  winningPositions: number
  losingPositions: number
}

export type PositionFilter = 'all' | 'winning' | 'losing'
export type PositionSort = 'value' | 'pnl' | 'symbol'
