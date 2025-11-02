/**
 * Orders Types
 * Centralized type definitions for all order-related components
 */

export type OrderType = 'market' | 'limit' | 'stop' | 'stop-limit' | 'trailing-stop'
export type OrderStatus = 'pending' | 'partial' | 'filled' | 'canceled'
export type OrderSide = 'buy' | 'sell'
export type TimeInForce = 'day' | 'gtc' | 'ioc' | 'fok'

export interface PendingOrder {
  id: string
  asset: string
  type: OrderType
  side: OrderSide
  shares: number
  price: number
  status: OrderStatus
  createdAt: string
}

export interface OrderTimelineStep {
  status: OrderStatus
  timestamp: string
  description: string
  progress?: number
}

export interface BracketOrder {
  entryPrice: number
  stopLossPrice: number
  takeProfitPrice: number
  shares: number
}
