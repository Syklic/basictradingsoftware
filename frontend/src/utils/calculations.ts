/**
 * Financial Calculations Utility
 * Centralized place for all P&L, percentage, and portfolio calculations
 */

import type { Position } from '../types/trading'

/**
 * Calculate P&L and P&L percentage for a position
 */
export const calculatePnL = (
  currentValue: number,
  shares: number,
  entryPrice: number
): { pnl: number; pnlPercent: number } => {
  const pnl = currentValue - shares * entryPrice
  const pnlPercent = (pnl / (shares * entryPrice)) * 100
  return { pnl, pnlPercent }
}

/**
 * Calculate percentage of a value relative to total
 */
export const calculatePercentage = (
  value: number,
  total: number,
  decimals = 1
): string => {
  return total > 0 ? ((value / total) * 100).toFixed(decimals) : '0'
}

/**
 * Calculate portfolio statistics from positions
 */
export const calculatePortfolioStats = (positions: Position[]) => {
  const totalValue = positions.reduce((sum, p) => sum + p.value, 0)
  const totalCost = positions.reduce((sum, p) => sum + p.shares * p.entryPrice, 0)
  const totalPnL = totalValue - totalCost
  const totalPnLPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0

  let winningPositions = 0
  let losingPositions = 0

  positions.forEach((p) => {
    const pnl = p.value - p.shares * p.entryPrice
    if (pnl >= 0) winningPositions++
    else losingPositions++
  })

  return {
    totalValue,
    totalCost,
    totalPnL,
    totalPnLPercent,
    winningPositions,
    losingPositions,
  }
}

/**
 * Format a number as currency
 */
export const formatCurrency = (value: number, decimals = 2): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

/**
 * Format a percentage value
 */
export const formatPercent = (value: number, decimals = 2): string => {
  return `${value.toFixed(decimals)}%`
}

/**
 * Determine if value is positive or negative for styling
 */
export const isPositive = (value: number): boolean => {
  return value >= 0
}
