import { useState } from 'react'
import {
  Zap,
  TrendingUp,
  Clock,
  Briefcase,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from 'lucide-react'
import QuickTradeWidget from './QuickTradeWidget'
import PositionManagementPanel from './PositionManagementPanel'
import type { PendingOrder } from '../../types/orders'
import { MOCK_ORDERS } from '../../constants/mockData'

type TabType = 'quick-trade' | 'positions' | 'orders' | 'advanced'

export default function OrderManagementInterface() {
  const [activeTab, setActiveTab] = useState<TabType>('positions')
  const [expandedSection, setExpandedSection] = useState<TabType | null>('positions')
  const [orders, setOrders] = useState<PendingOrder[]>(MOCK_ORDERS)

  const tabConfig = {
    'quick-trade': {
      label: 'Quick Trade',
      icon: Zap,
      description: 'Fast market & limit orders',
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-500/10 border-yellow-500/30',
    },
    positions: {
      label: 'Positions',
      icon: Briefcase,
      description: 'Manage open positions',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10 border-blue-500/30',
    },
    orders: {
      label: 'Orders',
      icon: Clock,
      description: 'Pending & executed orders',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/30',
    },
    advanced: {
      label: 'Advanced',
      icon: TrendingUp,
      description: 'Advanced order types',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-500/10 border-green-500/30',
    },
  }

  const handleCancelOrder = (orderId: string) => {
    setOrders(orders.filter((o) => o.id !== orderId))
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)

    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    return `${hours}h ago`
  }

  const pendingOrderCount = orders.filter((o) => o.status === 'pending').length
  const partialOrderCount = orders.filter((o) => o.status === 'partial').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Zap className="h-8 w-8 text-accent" />
            Order Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all your orders, positions, and trades in one place
          </p>
        </div>
        {(pendingOrderCount > 0 || partialOrderCount > 0) && (
          <div className="flex gap-2">
            {pendingOrderCount > 0 && (
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg px-3 py-2">
                <div className="text-xs text-muted-foreground">Pending Orders</div>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {pendingOrderCount}
                </div>
              </div>
            )}
            {partialOrderCount > 0 && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-2">
                <div className="text-xs text-muted-foreground">Partial Fills</div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {partialOrderCount}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {(Object.entries(tabConfig) as [TabType, typeof tabConfig['quick-trade']][]).map(
          ([tabId, config]) => {
            const Icon = config.icon
            const isActive = activeTab === tabId
            const isExpanded = expandedSection === tabId

            return (
              <button
                key={tabId}
                onClick={() => {
                  setActiveTab(tabId)
                  setExpandedSection(isExpanded ? null : tabId)
                }}
                className={`p-4 rounded-lg border transition-all text-left ${
                  isActive
                    ? `${config.bgColor} border-current`
                    : 'bg-card border-border hover:border-accent/50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <Icon className={`h-5 w-5 ${isActive ? config.color : 'text-muted-foreground'}`} />
                  {isExpanded && <ChevronUp className="h-4 w-4" />}
                  {!isExpanded && <ChevronDown className="h-4 w-4" />}
                </div>
                <div className={`text-sm font-semibold ${isActive ? config.color : ''}`}>
                  {config.label}
                </div>
                <div className="text-xs text-muted-foreground">{config.description}</div>
              </button>
            )
          }
        )}
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        {/* Quick Trade Section */}
        {(activeTab === 'quick-trade' || expandedSection === 'quick-trade') && (
          <div className={`rounded-lg border p-6 ${tabConfig['quick-trade'].bgColor}`}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Trade
            </h2>
            <QuickTradeWidget position="embedded" />
          </div>
        )}

        {/* Positions Section */}
        {(activeTab === 'positions' || expandedSection === 'positions') && (
          <div className={`rounded-lg border p-6 ${tabConfig.positions.bgColor}`}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Position Management
            </h2>
            <PositionManagementPanel />
          </div>
        )}

        {/* Orders Section */}
        {(activeTab === 'orders' || expandedSection === 'orders') && (
          <div className={`rounded-lg border p-6 ${tabConfig.orders.bgColor}`}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Order History & Status
            </h2>

            {orders.length > 0 ? (
              <div className="space-y-3">
                {orders.map((order) => {
                  const statusColor =
                    order.status === 'pending'
                      ? 'bg-orange-500/10 border-orange-500/30 text-orange-700 dark:text-orange-400'
                      : order.status === 'partial'
                        ? 'bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400'
                        : 'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400'

                  return (
                    <div key={order.id} className="bg-card border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-3 w-3 rounded-full ${
                              order.side === 'buy'
                                ? 'bg-green-500'
                                : 'bg-red-500'
                            }`}
                          />
                          <div>
                            <div className="font-semibold">
                              {order.side === 'buy' ? 'BUY' : 'SELL'} {order.shares} {order.asset}
                            </div>
                            <div className="text-xs text-muted-foreground">{order.id}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-semibold">
                            ${order.price.toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatTime(order.createdAt)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded border ${statusColor}`}>
                            {order.status === 'pending' && '⏳ Pending'}
                            {order.status === 'partial' && '⚡ Partial'}
                            {order.status === 'filled' && '✓ Filled'}
                          </span>
                          <span className="text-xs px-2 py-1 bg-muted rounded">
                            {order.type === 'market' && 'Market'}
                            {order.type === 'limit' && 'Limit'}
                            {order.type === 'stop' && 'Stop'}
                            {order.type === 'bracket' && 'Bracket'}
                          </span>
                        </div>

                        {order.status !== 'filled' && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="text-xs px-3 py-1 bg-red-500/20 text-red-700 dark:text-red-400 hover:bg-red-500/30 rounded transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No pending orders</p>
              </div>
            )}
          </div>
        )}

        {/* Advanced Orders Section */}
        {(activeTab === 'advanced' || expandedSection === 'advanced') && (
          <div className={`rounded-lg border p-6 ${tabConfig.advanced.bgColor}`}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Advanced Order Types
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: 'Stop-Loss Orders',
                  description: 'Automatically sell when price drops below a level',
                  icon: '🛑',
                },
                {
                  title: 'Take-Profit Orders',
                  description: 'Automatically sell when price reaches your target',
                  icon: '📈',
                },
                {
                  title: 'Bracket Orders',
                  description: 'Set entry, stop-loss, and take-profit all at once',
                  icon: '📊',
                },
                {
                  title: 'Trailing Stop',
                  description: 'Protect gains by following the price upward',
                  icon: '📉',
                },
              ].map((order, idx) => (
                <div key={idx} className="bg-card border border-border rounded-lg p-4">
                  <div className="text-2xl mb-2">{order.icon}</div>
                  <h3 className="font-semibold mb-1">{order.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{order.description}</p>
                  <button className="w-full px-3 py-2 bg-accent text-accent-foreground rounded text-sm font-medium hover:opacity-90 transition-opacity">
                    Set Up
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-3">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-sm mb-2">Order Management Best Practices</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ Always use stop-loss orders to protect against unexpected moves</li>
              <li>✓ Set take-profit targets to lock in gains</li>
              <li>✓ Use bracket orders to automate your risk management</li>
              <li>✓ Monitor pending orders regularly and adjust as needed</li>
              <li>✓ Use position sizing to maintain consistent risk per trade</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
