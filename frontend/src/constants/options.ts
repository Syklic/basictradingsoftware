/**
 * Configuration Options Constants
 * Centralized place for all dropdown options and configuration values
 */

export const STAKING_PROVIDERS = [
  { id: 'lido', name: 'Lido', description: 'Ethereum staking via Lido' },
  { id: 'rocket_pool', name: 'Rocket Pool', description: 'Self-sovereign ETH staking' },
  { id: 'none', name: 'None', description: 'Disable staking' },
]

export const ML_MODELS = [
  { id: 'transformer_v1', name: 'Transformer V1', accuracy: '82%' },
  { id: 'lstm_v2', name: 'LSTM V2', accuracy: '78%' },
  { id: 'ensemble_v1', name: 'Ensemble V1', accuracy: '85%' },
]

export const CURRENCY_OPTIONS = ['USD', 'EUR', 'GBP']

export const LOG_LEVELS = ['DEBUG', 'INFO', 'WARN', 'ERROR']

export const CHART_TIMEFRAMES = ['1m', '5m', '15m', '1h', '4h', '1d']

export const TRADING_MODES = ['paper', 'live']

export const ALERT_TYPES = ['email', 'sound', 'desktop']

export const WIDGET_DESCRIPTIONS: Record<string, { name: string; description: string }> = {
  portfolio: { name: 'Portfolio Overview', description: 'Your total portfolio value and allocation' },
  stats: { name: 'Performance Metrics', description: 'Key trading statistics and performance' },
  chart: { name: 'Price Chart', description: 'Portfolio or asset price visualization' },
  orders: { name: 'Orders History', description: 'Recent trades and order status' },
  signals: { name: 'Trading Signals', description: 'ML-generated buy/sell signals' },
  indices: { name: 'Market Indices', description: 'S&P 500, Nasdaq, and other indices' },
  allocation: { name: 'Asset Allocation', description: 'Pie chart of portfolio composition' },
  returns: { name: 'Daily Returns', description: 'Bar chart of daily P&L' },
  correlation: { name: 'Correlation Matrix', description: 'Asset correlation analysis' },
  heatmap: { name: 'Performance Heatmap', description: 'Sector/asset performance visualization' },
  journal: { name: 'Trade Journal', description: 'Detailed trade log and notes' },
  model: { name: 'ML Model Status', description: 'Active model info and training progress' },
}

export const ASSET_OPTIONS = [
  { symbol: 'BTC', name: 'Bitcoin', exchange: 'Crypto' },
  { symbol: 'ETH', name: 'Ethereum', exchange: 'Crypto' },
  { symbol: 'SPY', name: 'S&P 500 ETF', exchange: 'NYSE' },
  { symbol: 'QQQ', name: 'Nasdaq ETF', exchange: 'NYSE' },
  { symbol: 'AAPL', name: 'Apple', exchange: 'NASDAQ' },
  { symbol: 'TSLA', name: 'Tesla', exchange: 'NASDAQ' },
  { symbol: 'GLD', name: 'Gold ETF', exchange: 'NYSE' },
  { symbol: 'TLT', name: '20+ Year T-Bond', exchange: 'NYSE' },
]

export const ORDER_TYPES = ['market', 'limit', 'stop', 'stop-limit', 'trailing-stop']

export const TIME_IN_FORCE_OPTIONS = [
  { id: 'day', name: 'Day', description: 'Order expires at end of day' },
  { id: 'gtc', name: 'GTC', description: 'Good-Till-Canceled' },
  { id: 'ioc', name: 'IOC', description: 'Immediate-Or-Cancel' },
  { id: 'fok', name: 'FOK', description: 'Fill-Or-Kill' },
]
