/**
 * Mock Data Constants
 * Centralized mock data for all components during development
 */

import type { Position, PositionStats } from '../types/trading'
import type { PendingOrder } from '../types/orders'

export const MOCK_POSITIONS: Position[] = [
  {
    id: 'btc-1',
    symbol: 'BTC',
    shares: 0.5,
    entryPrice: 43200,
    currentPrice: 45230,
    value: 22615,
    percentOfPortfolio: 45.2,
    priceHistory: [43200, 43500, 44200, 45100, 45230],
  },
  {
    id: 'eth-1',
    symbol: 'ETH',
    shares: 2,
    entryPrice: 2380,
    currentPrice: 2456,
    value: 4912,
    percentOfPortfolio: 9.8,
    priceHistory: [2380, 2410, 2435, 2445, 2456],
  },
  {
    id: 'spy-1',
    symbol: 'SPY',
    shares: 20,
    entryPrice: 445,
    currentPrice: 450,
    value: 9000,
    percentOfPortfolio: 18.0,
    priceHistory: [445, 446, 447, 449, 450],
  },
  {
    id: 'qqq-1',
    symbol: 'QQQ',
    shares: 10,
    entryPrice: 378,
    currentPrice: 375,
    value: 3750,
    percentOfPortfolio: 7.5,
    priceHistory: [378, 377.5, 376, 375.5, 375],
  },
  {
    id: 'aapl-1',
    symbol: 'AAPL',
    shares: 5,
    entryPrice: 175,
    currentPrice: 178.5,
    value: 892.5,
    percentOfPortfolio: 1.8,
    priceHistory: [175, 176, 177, 178, 178.5],
  },
]

export const MOCK_ORDERS: PendingOrder[] = [
  {
    id: 'ORD-001',
    asset: 'BTC',
    type: 'limit',
    side: 'buy',
    shares: 0.25,
    price: 44500,
    status: 'pending',
    createdAt: new Date(Date.now() - 900000).toISOString(),
  },
  {
    id: 'ORD-002',
    asset: 'ETH',
    type: 'market',
    side: 'sell',
    shares: 1,
    price: 2456,
    status: 'partial',
    createdAt: new Date(Date.now() - 300000).toISOString(),
  },
]

export const MOCK_PORTFOLIO_STATS: PositionStats = {
  totalValue: 50669.5,
  totalCost: 50400,
  totalPnL: 2269.5,
  totalPnLPercent: 4.7,
  winningPositions: 4,
  losingPositions: 1,
}

export const ASSET_PRICES: Record<string, number> = {
  BTC: 45230.5,
  ETH: 2456.8,
  SPY: 450.25,
  QQQ: 375.1,
  AAPL: 178.5,
  TSLA: 245.3,
  GLD: 198.75,
  TLT: 92.4,
}
