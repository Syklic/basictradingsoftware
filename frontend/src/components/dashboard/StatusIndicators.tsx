import { useState, useEffect } from 'react'
import { AlertCircle, Clock, Zap, Wifi, WifiOff } from 'lucide-react'

type MarketStatus = 'open' | 'closed' | 'pre-market' | 'after-hours'
type StrategyStatus = 'running' | 'paused' | 'paper' | 'live'
type ConnectionStatus = 'connected' | 'disconnected' | 'warning'

interface ConnectionHealth {
  api: { status: ConnectionStatus; latency: number }
  websocket: { status: ConnectionStatus; latency: number }
  mlModels: { status: ConnectionStatus; latency: number }
}

export default function StatusIndicators() {
  const [marketStatus, setMarketStatus] = useState<MarketStatus>('closed')
  const [timeUntilChange, setTimeUntilChange] = useState(0)
  const [strategyStatus, setStrategyStatus] = useState<StrategyStatus>('paper')
  const [connectionHealth, setConnectionHealth] = useState<ConnectionHealth>({
    api: { status: 'connected', latency: 45 },
    websocket: { status: 'connected', latency: 12 },
    mlModels: { status: 'connected', latency: 89 },
  })

  // Update market status based on time
  useEffect(() => {
    const updateMarketStatus = () => {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const seconds = now.getSeconds()

      // Market hours: 9:30 AM - 4:00 PM ET (simplified for demo)
      let status: MarketStatus = 'closed'
      let nextChange = 0

      if (hours === 9 && minutes >= 30) {
        status = 'open'
        // Time until 4 PM
        nextChange = ((16 - hours - 1) * 3600 + (60 - minutes - 1) * 60 + (60 - seconds))
      } else if (hours < 9 || (hours === 9 && minutes < 30)) {
        status = 'pre-market'
        // Time until 9:30 AM
        nextChange = ((9 - hours - 1) * 3600 + (30 - minutes - 1) * 60 + (60 - seconds))
      } else if (hours >= 16) {
        status = 'after-hours'
        // Time until tomorrow 9:30 AM
        nextChange = ((24 - hours + 9) * 3600 + (60 - minutes) * 60 + (60 - seconds))
      }

      setMarketStatus(status)
      setTimeUntilChange(nextChange)
    }

    updateMarketStatus()
    const interval = setInterval(updateMarketStatus, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m ${secs}s`
  }

  const getMarketStatusColor = (status: MarketStatus) => {
    switch (status) {
      case 'open':
        return 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30'
      case 'closed':
        return 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30'
      case 'pre-market':
        return 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30'
      case 'after-hours':
        return 'bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/30'
    }
  }

  const getStrategyStatusColor = (status: StrategyStatus) => {
    switch (status) {
      case 'running':
        return 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30'
      case 'paused':
        return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30'
      case 'paper':
        return 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30'
      case 'live':
        return 'bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30'
    }
  }

  const getConnectionColor = (status: ConnectionStatus) => {
    switch (status) {
      case 'connected':
        return 'text-green-500'
      case 'disconnected':
        return 'text-red-500'
      case 'warning':
        return 'text-yellow-500'
    }
  }

  return (
    <div className="space-y-4 bg-card border border-border rounded-lg p-4">
      {/* Market Status */}
      <div className={`border rounded-lg p-3 ${getMarketStatusColor(marketStatus)}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm">Market Status</h3>
          <Clock className="h-4 w-4" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold capitalize">{marketStatus.replace('-', ' ')}</div>
            <div className="text-xs opacity-75">Next change in {formatTime(timeUntilChange)}</div>
          </div>
          <div className={`h-3 w-3 rounded-full ${marketStatus === 'open' ? 'bg-green-500 animate-pulse' : 'bg-current'}`} />
        </div>
      </div>

      {/* Strategy Status */}
      <div className={`border rounded-lg p-3 ${getStrategyStatusColor(strategyStatus)}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm">Strategy Status</h3>
          <Zap className="h-4 w-4" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold capitalize">{strategyStatus}</div>
            <div className="text-xs opacity-75">Paper trading mode</div>
          </div>
          <button
            onClick={() => setStrategyStatus(strategyStatus === 'running' ? 'paused' : 'running')}
            className="px-2 py-1 bg-current/20 hover:bg-current/30 rounded text-xs font-medium transition-colors"
          >
            {strategyStatus === 'running' ? 'Pause' : 'Resume'}
          </button>
        </div>
      </div>

      {/* Connection Health */}
      <div className="border border-border rounded-lg p-3">
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
          Connection Health
        </h3>
        <div className="space-y-2">
          {/* API Connection */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              {connectionHealth.api.status === 'connected' ? (
                <Wifi className={`h-4 w-4 ${getConnectionColor(connectionHealth.api.status)}`} />
              ) : (
                <WifiOff className={`h-4 w-4 ${getConnectionColor(connectionHealth.api.status)}`} />
              )}
              <span className="font-medium">API</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {connectionHealth.api.status === 'connected' ? (
                <span className="text-green-500">{connectionHealth.api.latency}ms</span>
              ) : (
                <span className="text-red-500">Disconnected</span>
              )}
            </div>
          </div>

          {/* WebSocket Connection */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              {connectionHealth.websocket.status === 'connected' ? (
                <Wifi className={`h-4 w-4 ${getConnectionColor(connectionHealth.websocket.status)}`} />
              ) : (
                <WifiOff className={`h-4 w-4 ${getConnectionColor(connectionHealth.websocket.status)}`} />
              )}
              <span className="font-medium">WebSocket</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {connectionHealth.websocket.status === 'connected' ? (
                <span className="text-green-500">{connectionHealth.websocket.latency}ms</span>
              ) : (
                <span className="text-red-500">Disconnected</span>
              )}
            </div>
          </div>

          {/* ML Models Connection */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              {connectionHealth.mlModels.status === 'connected' ? (
                <Wifi className={`h-4 w-4 ${getConnectionColor(connectionHealth.mlModels.status)}`} />
              ) : (
                <WifiOff className={`h-4 w-4 ${getConnectionColor(connectionHealth.mlModels.status)}`} />
              )}
              <span className="font-medium">ML Models</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {connectionHealth.mlModels.status === 'connected' ? (
                <span className={connectionHealth.mlModels.latency > 100 ? 'text-yellow-500' : 'text-green-500'}>
                  {connectionHealth.mlModels.latency}ms
                </span>
              ) : (
                <span className="text-red-500">Disconnected</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Connection Warning */}
      {Object.values(connectionHealth).some(conn => conn.status !== 'connected') && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-yellow-700 dark:text-yellow-400">
            <strong>Connection Issue:</strong> Some services may be experiencing connectivity problems.
          </div>
        </div>
      )}
    </div>
  )
}
