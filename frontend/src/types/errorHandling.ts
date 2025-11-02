/**
 * Error Handling & Edge Cases Types
 * Graceful degradation, validation, and retry mechanisms
 */

/**
 * Error severity levels
 */
export type ErrorSeverity = 'critical' | 'error' | 'warning' | 'info'

/**
 * Error type
 */
export type ErrorType =
  | 'network'
  | 'validation'
  | 'auth'
  | 'permission'
  | 'not_found'
  | 'api'
  | 'ml_model'
  | 'chart'
  | 'offline'
  | 'unknown'

/**
 * Application error
 */
export interface AppError {
  id: string
  type: ErrorType
  severity: ErrorSeverity
  message: string
  userMessage: string // User-friendly message
  technicalDetails?: string
  code?: string | number
  timestamp: number
  context?: Record<string, unknown>
  recoverable: boolean
  suggestedAction?: string
}

/**
 * Validation error with field-level details
 */
export interface ValidationError {
  field: string
  message: string
  value?: unknown
  rule?: string
  suggestion?: string
}

/**
 * Form validation result
 */
export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings?: string[]
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxRetries: number
  initialDelay: number // ms
  maxDelay: number // ms
  backoffMultiplier: number
  jitter: boolean
}

/**
 * Retry attempt
 */
export interface RetryAttempt {
  attempt: number
  maxRetries: number
  nextRetryIn?: number // ms
  lastError?: Error
}

/**
 * Fallback mode
 */
export type FallbackMode = 'manual_trading' | 'table_view' | 'cached_data' | 'limited_features'

/**
 * Graceful degradation configuration
 */
export interface GracefulDegradationConfig {
  enabledModes: FallbackMode[]
  cacheDataOffline: boolean
  showCacheWarning: boolean
  autoDowngrade: boolean
  retryFailedFeatures: boolean
}

/**
 * Offline state
 */
export interface OfflineState {
  isOnline: boolean
  lastOnlineTime?: number
  cachedDataAvailable: boolean
  cacheAgeMinutes?: number
  showWarning: boolean
}

/**
 * Connectivity status
 */
export interface ConnectivityStatus {
  online: boolean
  apiConnected: boolean
  exchangeConnected: boolean
  mlModelsReady: boolean
  chartsReady: boolean
  dataStale: boolean
  staleSinceMinutes?: number
}

/**
 * Error recovery action
 */
export interface ErrorRecoveryAction {
  id: string
  label: string
  description?: string
  action: () => Promise<void>
  icon?: string
  isPrimary?: boolean
}

/**
 * Error boundary state
 */
export interface ErrorBoundaryState {
  hasError: boolean
  error?: AppError
  errorCount: number
  recoveryAttempts: number
  lastErrorTime?: number
}
