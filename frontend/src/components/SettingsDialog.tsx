import { useState, useEffect } from 'react'
import { X, Eye, EyeOff, Save, Zap, Lock, Bell, Brain, TrendingUp, Settings as SettingsIcon, Coins, Sliders } from 'lucide-react'

interface SettingsDialogProps {
  isOpen: boolean
  onClose: () => void
}

interface Credentials {
  [key: string]: {
    apiKey: string
    apiSecret: string
  }
}

interface GeneralSettings {
  tradingMode: 'paper' | 'live'
  maxDailyLossPercent: number
  maxPositionSizeUsd: number
  maxConcurrentPositions: number
  maxLeverage: number
  emailAlertsEnabled: boolean
  soundAlertsEnabled: boolean
  desktopNotificationsEnabled: boolean
  alertConfidenceThreshold: number
  selectedModel: string
  assetsToMonitor: string[]
  currency: string
  chartTimeframe: string
  stakingProvider: string
  stakingAutoCompound: boolean
  minimumStakingApr: number
  webhookUrl: string
  logLevel: string
  apiRateLimit: number
}

interface Section {
  id: string
  name: string
  description: string
  icon: any
  type: 'general' | 'provider' | 'advanced'
}

const sections: Section[] = [
  { id: 'general', name: 'General Settings', description: 'Trading mode & risk', icon: Zap, type: 'general' },
  { id: 'risks', name: 'Risk Management', description: 'Daily loss & position limits', icon: Lock, type: 'general' },
  { id: 'notifications', name: 'Notifications', description: 'Alerts & email', icon: Bell, type: 'general' },
  { id: 'ml', name: 'ML Models', description: 'AI model selection', icon: Brain, type: 'advanced' },
  { id: 'assets', name: 'Assets to Monitor', description: 'Stocks & crypto pairs', icon: TrendingUp, type: 'advanced' },
  { id: 'display', name: 'Display Settings', description: 'Currency & charts', icon: SettingsIcon, type: 'advanced' },
  { id: 'staking', name: 'Staking Config', description: 'Crypto staking setup', icon: Coins, type: 'advanced' },
  { id: 'advanced', name: 'Advanced', description: 'Webhooks & logging', icon: Sliders, type: 'advanced' },
  { id: 'alpaca', name: 'Alpaca', description: 'Equity trading broker', icon: null, type: 'provider' },
  { id: 'binance', name: 'Binance', description: 'Crypto exchange', icon: null, type: 'provider' },
  { id: 'coinbase', name: 'Coinbase Advanced Trade', description: 'Crypto exchange', icon: null, type: 'provider' },
  { id: 'kraken', name: 'Kraken', description: 'Crypto exchange', icon: null, type: 'provider' },
  { id: 'ibkr', name: 'Interactive Brokers', description: 'Multi-asset broker', icon: null, type: 'provider' },
]

const mlModels = [
  { id: 'transformer_v1', name: 'Transformer v1', description: 'Advanced deep learning for both stocks & crypto' },
  { id: 'lstm_v2', name: 'LSTM v2', description: 'Recurrent neural network, good for sequences' },
  { id: 'arima', name: 'ARIMA', description: 'Statistical model, fast & lightweight' },
  { id: 'ensemble', name: 'Ensemble', description: 'Combines multiple models for robustness' },
]

const defaultAssets = [
  { symbol: 'AAPL', type: 'stock', name: 'Apple' },
  { symbol: 'TSLA', type: 'stock', name: 'Tesla' },
  { symbol: 'MSFT', type: 'stock', name: 'Microsoft' },
  { symbol: 'BTC', type: 'crypto', name: 'Bitcoin' },
  { symbol: 'ETH', type: 'crypto', name: 'Ethereum' },
  { symbol: 'SOL', type: 'crypto', name: 'Solana' },
  { symbol: 'SPY', type: 'etf', name: 'S&P 500 ETF' },
  { symbol: 'QQQ', type: 'etf', name: 'Nasdaq ETF' },
]

const stakingProviders = [
  { id: 'lido', name: 'Lido', description: 'Ethereum staking (liquid staking)' },
  { id: 'rocketpool', name: 'RocketPool', description: 'Ethereum staking alternative' },
  { id: 'coinbase', name: 'Coinbase Staking', description: 'Built-in staking via Coinbase' },
  { id: 'kraken', name: 'Kraken Staking', description: 'Built-in staking via Kraken' },
  { id: 'none', name: 'None', description: 'Disable staking' },
]

export default function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
  const [credentials, setCredentials] = useState<Credentials>({})
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    tradingMode: 'paper',
    maxDailyLossPercent: 5,
    maxPositionSizeUsd: 10000,
    maxConcurrentPositions: 5,
    maxLeverage: 1,
    emailAlertsEnabled: false,
    soundAlertsEnabled: true,
    desktopNotificationsEnabled: true,
    alertConfidenceThreshold: 70,
    selectedModel: 'transformer_v1',
    assetsToMonitor: ['BTC', 'ETH', 'AAPL'],
    currency: 'USD',
    chartTimeframe: '1h',
    stakingProvider: 'none',
    stakingAutoCompound: false,
    minimumStakingApr: 5,
    webhookUrl: '',
    logLevel: 'INFO',
    apiRateLimit: 100,
  })
  const [selectedSection, setSelectedSection] = useState<string>('general')
  const [showSecrets, setShowSecrets] = useState<{ [key: string]: boolean }>({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string>('')
  const [assetSearch, setAssetSearch] = useState('')

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedCreds = localStorage.getItem('api-credentials')
    if (savedCreds) {
      try {
        setCredentials(JSON.parse(savedCreds))
      } catch (e) {
        console.error('Failed to load credentials:', e)
      }
    }

    const savedSettings = localStorage.getItem('general-settings')
    if (savedSettings) {
      try {
        setGeneralSettings(JSON.parse(savedSettings))
      } catch (e) {
        console.error('Failed to load general settings:', e)
      }
    }
  }, [])

  // Clear message after 2 seconds
  useEffect(() => {
    if (saveMessage) {
      const timer = setTimeout(() => setSaveMessage(''), 2000)
      return () => clearTimeout(timer)
    }
  }, [saveMessage])

  const handleGeneralSettingChange = (field: keyof GeneralSettings, value: any) => {
    setGeneralSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAssetToggle = (symbol: string) => {
    setGeneralSettings((prev) => {
      const current = prev.assetsToMonitor || []
      if (current.includes(symbol)) {
        return {
          ...prev,
          assetsToMonitor: current.filter((s) => s !== symbol),
        }
      } else {
        return {
          ...prev,
          assetsToMonitor: [...current, symbol],
        }
      }
    })
  }

  const handleInputChange = (provider: string, field: 'apiKey' | 'apiSecret', value: string) => {
    setCredentials((prev) => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        [field]: value,
      },
    }))
  }

  const toggleShowSecret = (provider: string) => {
    setShowSecrets((prev) => ({
      ...prev,
      [provider]: !prev[provider],
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      localStorage.setItem('api-credentials', JSON.stringify(credentials))
      localStorage.setItem('general-settings', JSON.stringify(generalSettings))

      try {
        await fetch('/api/settings/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            credentials,
            generalSettings,
          }),
        })
      } catch (e) {
        console.log('Backend settings endpoint not available yet')
      }

      setSaveMessage('✓ Settings saved successfully!')
    } catch (error) {
      setSaveMessage('✗ Failed to save settings')
      console.error('Save error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleClearProvider = (provider: string) => {
    setCredentials((prev) => {
      const updated = { ...prev }
      delete updated[provider]
      return updated
    })
  }

  const currentProvider = credentials[selectedSection] || { apiKey: '', apiSecret: '' }
  const selectedSectionData = sections.find((s) => s.id === selectedSection)
  const filteredAssets = defaultAssets.filter(
    (asset) =>
      asset.symbol.toLowerCase().includes(assetSearch.toLowerCase()) ||
      asset.name.toLowerCase().includes(assetSearch.toLowerCase())
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex">
            
            {/* Section List - Left Sidebar */}
            <div className="w-56 bg-muted/30 border-r border-border p-4 space-y-1 overflow-y-auto">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">Core Settings</p>
              {sections.slice(0, 3).map((section) => (
                <button
                  key={section.id}
                  onClick={() => setSelectedSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedSection === section.id
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="font-medium text-sm">{section.name}</div>
                  <div className="text-xs text-muted-foreground">{section.description}</div>
                </button>
              ))}

              <div className="my-3 border-t border-border" />

              <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">Advanced</p>
              {sections.slice(3, 8).map((section) => (
                <button
                  key={section.id}
                  onClick={() => setSelectedSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedSection === section.id
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="font-medium text-sm">{section.name}</div>
                  <div className="text-xs text-muted-foreground">{section.description}</div>
                </button>
              ))}

              <div className="my-3 border-t border-border" />

              <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">API Credentials</p>
              {sections.slice(8).map((section) => (
                <button
                  key={section.id}
                  onClick={() => setSelectedSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedSection === section.id
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="font-medium text-sm">{section.name}</div>
                  <div className="text-xs text-muted-foreground">{section.description}</div>
                </button>
              ))}
            </div>

            {/* Settings Content - Right Side */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-130px)]">
              <div>
                <h3 className="text-lg font-semibold mb-1">{selectedSectionData?.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedSectionData?.description}</p>
              </div>

              {/* GENERAL SETTINGS */}
              {selectedSection === 'general' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-3">Trading Mode</label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleGeneralSettingChange('tradingMode', 'paper')}
                        className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                          generalSettings.tradingMode === 'paper'
                            ? 'bg-green-500/20 text-green-700 dark:text-green-400 border border-green-500/50'
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                      >
                        📝 Paper Trading (Safe)
                      </button>
                      <button
                        onClick={() => handleGeneralSettingChange('tradingMode', 'live')}
                        className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                          generalSettings.tradingMode === 'live'
                            ? 'bg-red-500/20 text-red-700 dark:text-red-400 border border-red-500/50'
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                      >
                        💰 Live Trading (Real $)
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {generalSettings.tradingMode === 'paper'
                        ? '✓ No real money at risk. Perfect for testing strategies.'
                        : '⚠️ WARNING: Real money is at risk. Ensure you understand the risks.'}
                    </p>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-sm text-blue-700 dark:text-blue-400">
                    <strong>Info:</strong> Paper trading simulates real market conditions without risking actual funds.
                  </div>
                </div>
              )}

              {/* RISK MANAGEMENT */}
              {selectedSection === 'risks' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Daily Loss: <span className="text-accent">{generalSettings.maxDailyLossPercent}%</span></label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={generalSettings.maxDailyLossPercent}
                      onChange={(e) => handleGeneralSettingChange('maxDailyLossPercent', parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-2">Stop trading if daily loss exceeds this percentage.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Max Position Size: <span className="text-accent">${generalSettings.maxPositionSizeUsd.toLocaleString()}</span></label>
                    <input
                      type="number"
                      min="100"
                      step="100"
                      value={generalSettings.maxPositionSizeUsd}
                      onChange={(e) => handleGeneralSettingChange('maxPositionSizeUsd', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-2">Maximum dollar amount per individual position.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Max Concurrent Positions: <span className="text-accent">{generalSettings.maxConcurrentPositions}</span></label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={generalSettings.maxConcurrentPositions}
                      onChange={(e) => handleGeneralSettingChange('maxConcurrentPositions', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-2">How many positions can be open at the same time.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Max Leverage: <span className="text-accent">{generalSettings.maxLeverage}x</span></label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="0.1"
                      value={generalSettings.maxLeverage}
                      onChange={(e) => handleGeneralSettingChange('maxLeverage', parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-2">1x = no leverage, 2x = can borrow 2x your account.</p>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-sm text-amber-700 dark:text-amber-400">
                    <strong>Risk Warning:</strong> These limits help protect your account but do not guarantee losses won't occur.
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS */}
              {selectedSection === 'notifications' && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={generalSettings.emailAlertsEnabled}
                        onChange={(e) => handleGeneralSettingChange('emailAlertsEnabled', e.target.checked)}
                        className="h-4 w-4"
                      />
                      <div>
                        <div className="font-medium text-sm">Email Alerts</div>
                        <div className="text-xs text-muted-foreground">Send email when trades execute or signals generated</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={generalSettings.soundAlertsEnabled}
                        onChange={(e) => handleGeneralSettingChange('soundAlertsEnabled', e.target.checked)}
                        className="h-4 w-4"
                      />
                      <div>
                        <div className="font-medium text-sm">Sound Alerts</div>
                        <div className="text-xs text-muted-foreground">Play beep sound when important events occur</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={generalSettings.desktopNotificationsEnabled}
                        onChange={(e) => handleGeneralSettingChange('desktopNotificationsEnabled', e.target.checked)}
                        className="h-4 w-4"
                      />
                      <div>
                        <div className="font-medium text-sm">Desktop Notifications</div>
                        <div className="text-xs text-muted-foreground">Browser pop-up notifications for alerts</div>
                      </div>
                    </label>
                  </div>

                  <div className="border-t border-border pt-4">
                    <label className="block text-sm font-medium mb-2">Signal Confidence Threshold: <span className="text-accent">{generalSettings.alertConfidenceThreshold}%</span></label>
                    <input
                      type="range"
                      min="50"
                      max="99"
                      value={generalSettings.alertConfidenceThreshold}
                      onChange={(e) => handleGeneralSettingChange('alertConfidenceThreshold', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-2">Only generate alerts for signals above this confidence level.</p>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-sm text-blue-700 dark:text-blue-400">
                    <strong>Info:</strong> Higher confidence thresholds = fewer alerts but higher quality signals.
                  </div>
                </div>
              )}

              {/* ML MODELS */}
              {selectedSection === 'ml' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-3">Select ML Model</label>
                    <div className="space-y-2">
                      {mlModels.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => handleGeneralSettingChange('selectedModel', model.id)}
                          className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                            generalSettings.selectedModel === model.id
                              ? 'bg-accent/20 border-accent text-accent-foreground'
                              : 'bg-muted border-border hover:border-accent/50'
                          }`}
                        >
                          <div className="font-medium text-sm">{model.name}</div>
                          <div className="text-xs text-muted-foreground">{model.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-sm text-blue-700 dark:text-blue-400">
                    <strong>Info:</strong> Different models have different strengths. Experiment to find the best for your trading style.
                  </div>
                </div>
              )}

              {/* ASSETS TO MONITOR */}
              {selectedSection === 'assets' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-3">Assets to Monitor</label>
                    <input
                      type="text"
                      placeholder="Search assets..."
                      value={assetSearch}
                      onChange={(e) => setAssetSearch(e.target.value)}
                      className="w-full px-3 py-2 bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm mb-3"
                    />
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {filteredAssets.map((asset) => (
                        <label key={asset.symbol} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={generalSettings.assetsToMonitor.includes(asset.symbol)}
                            onChange={() => handleAssetToggle(asset.symbol)}
                            className="h-4 w-4"
                          />
                          <div>
                            <div className="font-medium text-sm">{asset.symbol}</div>
                            <div className="text-xs text-muted-foreground">{asset.name} ({asset.type})</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-sm text-blue-700 dark:text-blue-400">
                    <strong>Info:</strong> Only selected assets will generate trading signals. Focus on assets you understand well.
                    <br />
                    <strong>Currently monitoring:</strong> {generalSettings.assetsToMonitor.join(', ')}
                  </div>
                </div>
              )}

              {/* DISPLAY SETTINGS */}
              {selectedSection === 'display' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Currency</label>
                    <select
                      value={generalSettings.currency}
                      onChange={(e) => handleGeneralSettingChange('currency', e.target.value)}
                      className="w-full px-3 py-2 bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                    >
                      <option value="USD">US Dollar (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                      <option value="GBP">British Pound (GBP)</option>
                      <option value="JPY">Japanese Yen (JPY)</option>
                      <option value="CAD">Canadian Dollar (CAD)</option>
                      <option value="AUD">Australian Dollar (AUD)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Chart Timeframe</label>
                    <select
                      value={generalSettings.chartTimeframe}
                      onChange={(e) => handleGeneralSettingChange('chartTimeframe', e.target.value)}
                      className="w-full px-3 py-2 bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                    >
                      <option value="1m">1 Minute</option>
                      <option value="5m">5 Minutes</option>
                      <option value="15m">15 Minutes</option>
                      <option value="1h">1 Hour</option>
                      <option value="4h">4 Hours</option>
                      <option value="1d">1 Day</option>
                    </select>
                    <p className="text-xs text-muted-foreground mt-2">Default timeframe for price charts.</p>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-sm text-blue-700 dark:text-blue-400">
                    <strong>Info:</strong> These settings affect how data is displayed in your dashboard.
                  </div>
                </div>
              )}

              {/* STAKING CONFIG */}
              {selectedSection === 'staking' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-3">Staking Provider</label>
                    <div className="space-y-2">
                      {stakingProviders.map((provider) => (
                        <button
                          key={provider.id}
                          onClick={() => handleGeneralSettingChange('stakingProvider', provider.id)}
                          className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                            generalSettings.stakingProvider === provider.id
                              ? 'bg-accent/20 border-accent'
                              : 'bg-muted border-border hover:border-accent/50'
                          }`}
                        >
                          <div className="font-medium text-sm">{provider.name}</div>
                          <div className="text-xs text-muted-foreground">{provider.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {generalSettings.stakingProvider !== 'none' && (
                    <>
                      <div>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={generalSettings.stakingAutoCompound}
                            onChange={(e) => handleGeneralSettingChange('stakingAutoCompound', e.target.checked)}
                            className="h-4 w-4"
                          />
                          <div>
                            <div className="font-medium text-sm">Auto-Compound Rewards</div>
                            <div className="text-xs text-muted-foreground">Automatically restake earned rewards</div>
                          </div>
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Minimum APR: <span className="text-accent">{generalSettings.minimumStakingApr}%</span></label>
                        <input
                          type="range"
                          min="1"
                          max="20"
                          value={generalSettings.minimumStakingApr}
                          onChange={(e) => handleGeneralSettingChange('minimumStakingApr', parseFloat(e.target.value))}
                          className="w-full"
                        />
                        <p className="text-xs text-muted-foreground mt-2">Only auto-stake if APR is above this level.</p>
                      </div>
                    </>
                  )}

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-sm text-blue-700 dark:text-blue-400">
                    <strong>Info:</strong> Staking lets you earn yield on your crypto holdings. Different providers have different rewards.
                  </div>
                </div>
              )}

              {/* ADVANCED SETTINGS */}
              {selectedSection === 'advanced' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Webhook URL (Optional)</label>
                    <input
                      type="url"
                      value={generalSettings.webhookUrl}
                      onChange={(e) => handleGeneralSettingChange('webhookUrl', e.target.value)}
                      placeholder="https://discordapp.com/api/webhooks/..."
                      className="w-full px-3 py-2 bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-2">Send alerts to Discord, Slack, or custom services. Leave blank to disable.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Log Level</label>
                    <select
                      value={generalSettings.logLevel}
                      onChange={(e) => handleGeneralSettingChange('logLevel', e.target.value)}
                      className="w-full px-3 py-2 bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                    >
                      <option value="DEBUG">DEBUG (Very detailed, for troubleshooting)</option>
                      <option value="INFO">INFO (Normal operation)</option>
                      <option value="WARNING">WARNING (Only important messages)</option>
                      <option value="ERROR">ERROR (Only errors)</option>
                    </select>
                    <p className="text-xs text-muted-foreground mt-2">Controls how much detail is logged for debugging.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">API Rate Limit: <span className="text-accent">{generalSettings.apiRateLimit} req/min</span></label>
                    <input
                      type="range"
                      min="10"
                      max="500"
                      step="10"
                      value={generalSettings.apiRateLimit}
                      onChange={(e) => handleGeneralSettingChange('apiRateLimit', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-2">Limit API requests to avoid broker throttling. Lower = safer, higher = faster.</p>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-sm text-amber-700 dark:text-amber-400">
                    <strong>Advanced Warning:</strong> These settings affect system performance and stability. Only modify if you know what you're doing.
                  </div>
                </div>
              )}

              {/* API CREDENTIAL INPUTS */}
              {['alpaca', 'binance', 'coinbase', 'kraken', 'ibkr'].includes(selectedSection) && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">API Key</label>
                    <input
                      type="text"
                      value={currentProvider.apiKey || ''}
                      onChange={(e) => handleInputChange(selectedSection, 'apiKey', e.target.value)}
                      placeholder="Enter your API key"
                      className="w-full px-3 py-2 bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">API Secret</label>
                    <div className="flex gap-2">
                      <input
                        type={showSecrets[selectedSection] ? 'text' : 'password'}
                        value={currentProvider.apiSecret || ''}
                        onChange={(e) => handleInputChange(selectedSection, 'apiSecret', e.target.value)}
                        placeholder="Enter your API secret"
                        className="flex-1 px-3 py-2 bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                      />
                      <button
                        onClick={() => toggleShowSecret(selectedSection)}
                        className="px-3 py-2 bg-muted border border-input rounded-lg hover:bg-muted/80 transition-colors"
                        title={showSecrets[selectedSection] ? 'Hide' : 'Show'}
                      >
                        {showSecrets[selectedSection] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-sm text-amber-700 dark:text-amber-400">
                    <strong>Security Note:</strong> Your credentials are stored locally in your browser. Never share your API keys or secrets.
                  </div>

                  {(currentProvider.apiKey || currentProvider.apiSecret) && (
                    <button
                      onClick={() => handleClearProvider(selectedSection)}
                      className="w-full px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors font-medium text-sm"
                    >
                      Clear Credentials
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-muted/30 p-4 space-y-3">
          {saveMessage && (
            <div className={`text-sm px-3 py-2 rounded-lg text-center ${
              saveMessage.startsWith('✓')
                ? 'bg-green-500/10 text-green-700 dark:text-green-400'
                : 'bg-red-500/10 text-red-700 dark:text-red-400'
            }`}>
              {saveMessage}
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg font-medium text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 font-medium text-sm transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
