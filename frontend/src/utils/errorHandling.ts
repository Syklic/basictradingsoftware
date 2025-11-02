/**
 * Error Handling & Edge Cases Utilities
 * Graceful degradation, validation, retry mechanisms, and offline support
 */

import type {
  AppError,
  ValidationError,
  ValidationResult,
  RetryConfig,
  RetryAttempt,
  OfflineState,
  ConnectivityStatus,
  ErrorType,
  ErrorSeverity,
} from '../types/errorHandling'

/**
 * Create application error
 */
export const createAppError = (
  type: ErrorType,
  message: string,
  userMessage: string,
  severity: ErrorSeverity = 'error',
  recoverable: boolean = true,
  context?: Record<string, unknown>
): AppError => ({
  id: `error-${Date.now()}-${Math.random()}`,
  type,
  severity,
  message,
  userMessage,
  timestamp: Date.now(),
  recoverable,
  context,
})

/**
 * Format error for user display
 */
export const formatErrorMessage = (error: AppError): string => {
  if (error.type === 'offline') {
    return '📡 You\'re offline. Viewing cached data from earlier.'
  }
  if (error.type === 'ml_model') {
    return '🤖 ML model failed. Switched to manual trading mode.'
  }
  if (error.type === 'chart') {
    return '📊 Chart failed to load. Showing table view instead.'
  }
  return error.userMessage || error.message
}

/**
 * Validate email address
 */
export const validateEmail = (email: string): ValidationError | null => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!regex.test(email)) {
    return {
      field: 'email',
      message: 'Invalid email format',
      value: email,
      rule: 'email',
      suggestion: 'Please use a valid email address (e.g., user@example.com)',
    }
  }
  return null
}

/**
 * Validate API key format
 */
export const validateApiKey = (key: string, format: 'alphanumeric' | 'hex' = 'alphanumeric'): ValidationError | null => {
  if (!key) {
    return {
      field: 'apiKey',
      message: 'API key is required',
      rule: 'required',
      suggestion: 'Enter your API key from your exchange account',
    }
  }

  if (key.length < 32) {
    return {
      field: 'apiKey',
      message: `API key too short (${key.length} characters)`,
      value: key,
      rule: 'length',
      suggestion: 'API keys are typically 32+ characters long',
    }
  }

  if (format === 'hex' && !/^[a-f0-9]+$/i.test(key)) {
    return {
      field: 'apiKey',
      message: 'API key should contain only hexadecimal characters',
      rule: 'format',
      suggestion: 'Check your API key for special characters or spaces',
    }
  }

  return null
}

/**
 * Validate buying power
 */
export const validateBuyingPower = (amount: number, available: number): ValidationError | null => {
  if (amount > available) {
    const needed = amount - available
    return {
      field: 'buyingPower',
      message: `Insufficient buying power`,
      value: amount,
      rule: 'sufficient_funds',
      suggestion: `You need $${needed.toFixed(2)} more to complete this order`,
    }
  }
  return null
}

/**
 * Validate order quantity
 */
export const validateOrderQuantity = (
  quantity: number,
  available: number,
  minQuantity: number = 1
): ValidationError | null => {
  if (quantity < minQuantity) {
    return {
      field: 'quantity',
      message: `Minimum quantity is ${minQuantity}`,
      value: quantity,
      rule: 'min_quantity',
      suggestion: `Order at least ${minQuantity} share(s)`,
    }
  }

  if (quantity > available) {
    return {
      field: 'quantity',
      message: 'Insufficient shares',
      value: quantity,
      rule: 'available_quantity',
      suggestion: `You only have ${available} shares available`,
    }
  }

  return null
}

/**
 * Validate order price
 */
export const validateOrderPrice = (
  price: number,
  currentPrice: number,
  maxPriceDeviation: number = 0.5 // 50% by default
): ValidationError | null => {
  if (price <= 0) {
    return {
      field: 'price',
      message: 'Price must be greater than 0',
      value: price,
      rule: 'positive_price',
      suggestion: 'Enter a valid price',
    }
  }

  const deviation = Math.abs((price - currentPrice) / currentPrice)
  if (deviation > maxPriceDeviation) {
    const percent = (deviation * 100).toFixed(1)
    return {
      field: 'price',
      message: `Price differs from market by ${percent}%`,
      value: price,
      rule: 'price_deviation',
      suggestion: `Current price is $${currentPrice.toFixed(2)}. Consider adjusting your limit price.`,
    }
  }

  return null
}

/**
 * Validate position size (risk management)
 */
export const validatePositionSize = (
  investmentAmount: number,
  portfolioValue: number,
  maxPositionPercent: number = 0.2 // 20% max per position
): ValidationError | null => {
  const percent = investmentAmount / portfolioValue
  if (percent > maxPositionPercent) {
    return {
      field: 'positionSize',
      message: `Position exceeds ${(maxPositionPercent * 100).toFixed(0)}% of portfolio`,
      value: investmentAmount,
      rule: 'position_size_limit',
      suggestion: `This position is ${(percent * 100).toFixed(1)}% of your portfolio. Consider reducing size for better diversification.`,
    }
  }
  return null
}

/**
 * Validate stop loss distance
 */
export const validateStopLossDistance = (
  entryPrice: number,
  stopLossPrice: number,
  minLossPercent: number = 0.01 // 1% minimum
): ValidationError | null => {
  if (stopLossPrice >= entryPrice) {
    return {
      field: 'stopLoss',
      message: 'Stop loss must be below entry price',
      value: stopLossPrice,
      rule: 'stop_loss_below_entry',
      suggestion: 'Set stop loss to protect against losses',
    }
  }

  const lossPercent = (entryPrice - stopLossPrice) / entryPrice
  if (lossPercent < minLossPercent) {
    return {
      field: 'stopLoss',
      message: `Stop loss too close to entry (${(lossPercent * 100).toFixed(2)}%)`,
      value: stopLossPrice,
      rule: 'stop_loss_distance',
      suggestion: `Set stop loss at least ${(minLossPercent * 100).toFixed(1)}% below entry price`,
    }
  }

  return null
}

/**
 * Validate form with multiple fields
 */
export const validateForm = (
  formData: Record<string, unknown>,
  validators: Record<string, (value: unknown) => ValidationError | null>
): ValidationResult => {
  const errors: ValidationError[] = []

  Object.entries(validators).forEach(([field, validator]) => {
    const error = validator(formData[field])
    if (error) {
      errors.push(error)
    }
  })

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Retry configuration defaults
 */
export const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 30000,
  backoffMultiplier: 2,
  jitter: true,
}

/**
 * Calculate exponential backoff with optional jitter
 */
export const calculateBackoffDelay = (config: RetryConfig, attempt: number): number => {
  let delay = config.initialDelay * Math.pow(config.backoffMultiplier, attempt - 1)
  delay = Math.min(delay, config.maxDelay)

  if (config.jitter) {
    delay = delay * (0.5 + Math.random() * 0.5)
  }

  return Math.round(delay)
}

/**
 * Retry function with exponential backoff
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  config: RetryConfig = defaultRetryConfig,
  onRetry?: (attempt: RetryAttempt) => void
): Promise<T> => {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt < config.maxRetries) {
        const delay = calculateBackoffDelay(config, attempt)
        onRetry?.({
          attempt,
          maxRetries: config.maxRetries,
          nextRetryIn: delay,
          lastError,
        })

        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError || new Error('Max retries exceeded')
}

/**
 * Check offline state
 */
export const getOfflineState = (): OfflineState => {
  const isOnline = navigator.onLine
  const lastOnlineTime = localStorage.getItem('lastOnlineTime')
  const cacheTime = lastOnlineTime ? parseInt(lastOnlineTime) : Date.now()
  const cacheAgeMinutes = Math.floor((Date.now() - cacheTime) / 1000 / 60)

  return {
    isOnline,
    lastOnlineTime: cacheTime,
    cachedDataAvailable: !isOnline,
    cacheAgeMinutes,
    showWarning: !isOnline && cacheAgeMinutes > 5,
  }
}

/**
 * Get connectivity status
 */
export const getConnectivityStatus = (): ConnectivityStatus => {
  const offlineState = getOfflineState()

  return {
    online: offlineState.isOnline,
    apiConnected: offlineState.isOnline,
    exchangeConnected: offlineState.isOnline,
    mlModelsReady: offlineState.isOnline,
    chartsReady: true, // Charts can show offline
    dataStale: offlineState.cacheAgeMinutes ? offlineState.cacheAgeMinutes > 10 : false,
    staleSinceMinutes: offlineState.cacheAgeMinutes,
  }
}

/**
 * Format cache age for display
 */
export const formatCacheAge = (minutes?: number): string => {
  if (!minutes) return 'Just now'
  if (minutes === 1) return '1 minute ago'
  if (minutes < 60) return `${minutes} minutes ago`
  const hours = Math.floor(minutes / 60)
  if (hours === 1) return '1 hour ago'
  return `${hours} hours ago`
}

/**
 * Graceful fallback for ML models
 */
export const getFallbackForMLModel = (reason: string): string => {
  return `🤖 ML model unavailable (${reason}). Switched to manual trading mode. You can still place trades and manage positions.`
}

/**
 * Graceful fallback for charts
 */
export const getFallbackForChart = (reason: string): string => {
  return `📊 Charts unavailable (${reason}). Showing data in table format instead.`
}

/**
 * Create offline cache key
 */
export const createCacheKey = (scope: string, identifier: string): string => {
  return `cache_${scope}_${identifier}_${new Date().toDateString()}`
}

/**
 * Save data to offline cache
 */
export const saveToOfflineCache = (key: string, data: unknown): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    localStorage.setItem('lastOnlineTime', Date.now().toString())
    return true
  } catch (error) {
    console.warn('Failed to save to offline cache:', error)
    return false
  }
}

/**
 * Get data from offline cache
 */
export const getFromOfflineCache = (key: string): unknown | null => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.warn('Failed to read from offline cache:', error)
    return null
  }
}

/**
 * Create error recovery action
 */
export const createErrorRecoveryAction = (
  label: string,
  action: () => Promise<void>,
  isPrimary: boolean = true
) => ({
  id: `action-${Date.now()}`,
  label,
  action,
  isPrimary,
})
