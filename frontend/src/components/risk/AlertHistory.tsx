import { Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import type { AlertTriggerEvent, Alert } from '../../types/risk'

interface AlertHistoryProps {
  alerts: Alert[]
  triggeredEvents: AlertTriggerEvent[]
  onClear?: () => void
  onEdit?: (alert: Alert) => void
  onToggle?: (alertId: string, enabled: boolean) => void
}

/**
 * Alert History Component
 * Displays alert definitions and triggered alert events
 */
export default function AlertHistory({
  alerts,
  triggeredEvents,
  onClear,
  onEdit,
  onToggle,
}: AlertHistoryProps) {
  const getActionBadge = (event: AlertTriggerEvent) => {
    if (!event.triggeredAction) return null

    const actionTypes = {
      notify: 'Notification',
      execute_trade: 'Trade Executed',
      pause_strategy: 'Strategy Paused',
    }

    const statusColor =
      event.actionResult === 'success'
        ? 'bg-green-100 text-green-800'
        : 'bg-red-100 text-red-800'

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor}`}>
        {actionTypes[event.triggeredAction.type] || 'Unknown'} •{' '}
        {event.actionResult?.toUpperCase() || 'Pending'}
      </span>
    )
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Get latest triggered events (limit to 50)
  const recentEvents = triggeredEvents.slice(0, 50)

  return (
    <div className="space-y-6">
      {/* Active Alerts */}
      {alerts.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-4 font-semibold">Active Alerts ({alerts.length})</h3>

          <div className="space-y-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between rounded-lg border border-muted bg-muted/50 p-3"
              >
                <div className="flex-1">
                  <div className="font-medium">{alert.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {alert.conditions.length} condition{alert.conditions.length !== 1 ? 's' : ''} •
                    Triggered {alert.triggerCount} time{alert.triggerCount !== 1 ? 's' : ''}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {alert.conditionLogic === 'AND' ? 'All conditions must' : 'Any condition must'}{' '}
                    be true
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={alert.enabled}
                      onChange={(e) => onToggle?.(alert.id, e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-xs">Enabled</span>
                  </label>

                  <button
                    onClick={() => onEdit?.(alert)}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Triggered Alert Events */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">
            Alert Triggers ({recentEvents.length})
          </h3>
          {recentEvents.length > 0 && onClear && (
            <button
              onClick={onClear}
              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3" />
              Clear History
            </button>
          )}
        </div>

        {recentEvents.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
            <Clock className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No triggered alerts yet</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {recentEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3 rounded-lg border border-muted bg-muted/50 p-3"
              >
                {/* Status Icon */}
                <div className="mt-1">
                  {event.actionResult === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : event.actionResult === 'failed' ? (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-yellow-600" />
                  )}
                </div>

                {/* Event Details */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{event.alertName}</div>

                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {event.conditionsMet.every((met) => met) ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                        All Conditions Met
                      </span>
                    ) : event.conditionsMet.some((met) => met) ? (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                        Some Conditions Met
                      </span>
                    ) : null}

                    {getActionBadge(event)}
                  </div>

                  <div className="mt-1 text-xs text-muted-foreground">
                    {formatTime(event.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {alerts.length > 0 && (
        <div className="grid grid-cols-3 gap-3 rounded-lg border border-border bg-card p-4">
          <div className="text-center">
            <div className="text-2xl font-bold">
              {alerts.filter((a) => a.enabled).length}
            </div>
            <div className="text-xs text-muted-foreground">Enabled</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {alerts.reduce((sum, a) => sum + a.triggerCount, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Total Triggers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {recentEvents.filter((e) => e.actionResult === 'success').length}
            </div>
            <div className="text-xs text-muted-foreground">Successful</div>
          </div>
        </div>
      )}
    </div>
  )
}
