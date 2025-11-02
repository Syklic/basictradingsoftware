/**
 * Risk Calculations Utility
 * Functions for calculating and evaluating risk metrics
 */

import type { RiskMetrics, RiskStatus, RiskLevel } from '../types/risk'

/**
 * Calculate risk level based on percentage used
 */
export const calculateRiskLevel = (percentUsed: number): RiskLevel => {
  if (percentUsed >= 90) return 'critical'
  if (percentUsed >= 70) return 'high'
  if (percentUsed >= 50) return 'medium'
  return 'low'
}

/**
 * Calculate Value at Risk (VaR) using parametric method
 * Assumes 95% confidence level, normal distribution
 */
export const calculateVaR = (
  portfolioValue: number,
  volatility: number,
  confidence = 0.95
): number => {
  // Z-score for 95% confidence = 1.645
  const zScore = 1.645
  const varPercent = (zScore * volatility) / 100
  return portfolioValue * varPercent
}

/**
 * Calculate current drawdown percentage
 */
export const calculateDrawdown = (
  currentValue: number,
  peakValue: number
): number => {
  if (peakValue === 0) return 0
  return ((currentValue - peakValue) / peakValue) * 100
}

/**
 * Calculate concentration risk
 */
export const calculateConcentrationRisk = (
  largestPositionValue: number,
  totalPortfolioValue: number
): number => {
  if (totalPortfolioValue === 0) return 0
  return (largestPositionValue / totalPortfolioValue) * 100
}

/**
 * Evaluate daily P&L against limit
 */
export const evaluateDailyLimit = (
  dailyPnL: number,
  dailyLimit: number
): number => {
  if (dailyLimit === 0) return 0
  return Math.abs((dailyPnL / dailyLimit) * 100)
}

/**
 * Evaluate leverage usage
 */
export const evaluateLeverageUsage = (
  leverageUsed: number,
  leverageMax: number
): number => {
  if (leverageMax === 0) return 0
  return (leverageUsed / leverageMax) * 100
}

/**
 * Calculate overall risk status from all metrics
 */
export const calculateRiskStatus = (metrics: RiskMetrics): RiskStatus => {
  const drawdownLevel = calculateRiskLevel(Math.abs(metrics.currentDrawdown))
  const dailyPnLPercent = evaluateDailyLimit(
    metrics.dailyPnL,
    metrics.dailyLimit
  )
  const dailyPnLLevel = calculateRiskLevel(dailyPnLPercent)
  const leveragePercent = evaluateLeverageUsage(
    metrics.leverageUsed,
    metrics.leverageMax
  )
  const leverageLevel = calculateRiskLevel(leveragePercent)
  const concentrationLevel = calculateRiskLevel(metrics.concentrationRisk)

  // Determine overall risk level (highest component)
  const levels = [
    drawdownLevel,
    dailyPnLLevel,
    leverageLevel,
    concentrationLevel,
  ]
  const levelHierarchy = { low: 0, medium: 1, high: 2, critical: 3 }
  const overallLevel = levels.reduce((max, current) =>
    levelHierarchy[current] > levelHierarchy[max] ? current : max
  )

  const shouldPauseTrading =
    overallLevel === 'critical' || dailyPnLPercent >= 100

  return {
    drawdown: {
      level: drawdownLevel,
      percent: metrics.currentDrawdown,
    },
    dailyPnL: {
      level: dailyPnLLevel,
      used: Math.abs(metrics.dailyPnL),
      limit: metrics.dailyLimit,
    },
    leverage: {
      level: leverageLevel,
      used: metrics.leverageUsed,
      max: metrics.leverageMax,
    },
    concentration: {
      level: concentrationLevel,
      percent: metrics.concentrationRisk,
      limit: metrics.concentrationLimit,
    },
    overall: overallLevel as RiskLevel,
    shouldPauseTrading,
  }
}

/**
 * Evaluate if alert conditions are met
 */
export const evaluateAlertCondition = (
  currentValue: number,
  operator: string,
  threshold: number
): boolean => {
  switch (operator) {
    case '>':
      return currentValue > threshold
    case '<':
      return currentValue < threshold
    case '=':
      return currentValue === threshold
    case '>=':
      return currentValue >= threshold
    case '<=':
      return currentValue <= threshold
    default:
      return false
  }
}

/**
 * Get human-readable description of risk status
 */
export const getRiskStatusDescription = (level: RiskLevel): string => {
  const descriptions = {
    low: 'Risk levels are healthy',
    medium: 'Monitor risk metrics closely',
    high: 'Risk levels are elevated',
    critical: 'Critical risk! Immediate action required',
  }
  return descriptions[level]
}

/**
 * Calculate emergency stop recommendation
 */
export const shouldEmergencyStop = (riskStatus: RiskStatus): boolean => {
  return (
    riskStatus.shouldPauseTrading ||
    riskStatus.overall === 'critical' ||
    riskStatus.dailyPnL.used >= riskStatus.dailyPnL.limit
  )
}
