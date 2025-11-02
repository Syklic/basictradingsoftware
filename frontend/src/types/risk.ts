/**
 * Risk Management & Alert Types
 * Type definitions for risk metrics, alerts, and conditions
 */

/**
 * Risk Metrics
 */
export interface RiskMetrics {
  currentDrawdown: number // % from peak
  dailyPnL: number // Today's profit/loss
  dailyLimit: number // Daily loss limit in USD
  dailyLimitPercent: number // % of daily limit used
  leverageUsed: number // Current leverage multiplier
  leverageMax: number // Maximum allowed leverage
  concentrationRisk: number // % in single largest position
  concentrationLimit: number // Maximum allowed concentration
  var: number // Value at Risk estimate (USD)
  varPercent: number // VaR as % of portfolio
}

/**
 * Risk Alert Condition Types
 */
export type AlertConditionType =
  | 'price'
  | 'technical'
  | 'portfolio'
  | 'risk'
  | 'performance'

/**
 * Operator for alert conditions
 */
export type AlertOperator =
  | '>'
  | '<'
  | '='
  | '>='
  | '<='
  | 'cross_above'
  | 'cross_below'

/**
 * Logical operator for combining conditions
 */
export type LogicalOperator = 'AND' | 'OR'

/**
 * Single alert condition
 */
export interface AlertCondition {
  id: string
  type: AlertConditionType
  asset?: string // Optional: BTC, ETH, etc. (for price alerts)
  indicator?: string // For technical: RSI, MACD, Bollinger, etc.
  operator: AlertOperator
  value: number
  description: string // Human-readable description
}

/**
 * Compound alert with multiple conditions
 */
export interface Alert {
  id: string
  name: string
  description: string
  enabled: boolean
  conditions: AlertCondition[]
  conditionLogic: LogicalOperator // How to combine multiple conditions
  actions: AlertAction[]
  createdAt: string
  lastTriggered?: string
  triggerCount: number
  notificationSettings: {
    desktop: boolean
    email: boolean
    sound: boolean
  }
}

/**
 * Alert action
 */
export type AlertAction =
  | {
      type: 'notify'
      message: string
    }
  | {
      type: 'execute_trade'
      orderType: 'market' | 'limit'
      side: 'buy' | 'sell'
      asset: string
      quantity: number
      price?: number
    }
  | {
      type: 'pause_strategy'
      strategyId: string
      duration: number // minutes
    }

/**
 * Alert trigger event (when alert was triggered)
 */
export interface AlertTriggerEvent {
  id: string
  alertId: string
  alertName: string
  timestamp: string
  conditionsMet: boolean[]
  triggeredAction?: AlertAction
  actionResult?: 'success' | 'failed'
}

/**
 * Risk level
 */
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

/**
 * Risk status for UI display
 */
export interface RiskStatus {
  drawdown: {
    level: RiskLevel
    percent: number
  }
  dailyPnL: {
    level: RiskLevel
    used: number
    limit: number
  }
  leverage: {
    level: RiskLevel
    used: number
    max: number
  }
  concentration: {
    level: RiskLevel
    percent: number
    limit: number
  }
  overall: RiskLevel
  shouldPauseTrading: boolean
}
