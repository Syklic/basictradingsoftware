import { useState } from 'react'
import { Plus, Trash2, Save, X } from 'lucide-react'
import type { Alert, AlertCondition, LogicalOperator, AlertConditionType } from '../../types/risk'
import { ASSET_OPTIONS } from '../../constants/options'

interface AlertBuilderProps {
  onSave: (alert: Alert) => void
  onCancel: () => void
  initialAlert?: Alert
}

/**
 * Custom Alert Builder Component
 * Build complex multi-condition alerts with AND/OR logic
 */
export default function AlertBuilder({
  onSave,
  onCancel,
  initialAlert,
}: AlertBuilderProps) {
  const [name, setName] = useState(initialAlert?.name || '')
  const [description, setDescription] = useState(initialAlert?.description || '')
  const [conditions, setConditions] = useState<AlertCondition[]>(
    initialAlert?.conditions || []
  )
  const [conditionLogic, setConditionLogic] = useState<LogicalOperator>(
    initialAlert?.conditionLogic || 'AND'
  )
  const [notifyDesktop, setNotifyDesktop] = useState(
    initialAlert?.notificationSettings.desktop ?? true
  )
  const [notifyEmail, setNotifyEmail] = useState(
    initialAlert?.notificationSettings.email ?? false
  )
  const [notifySound, setNotifySound] = useState(
    initialAlert?.notificationSettings.sound ?? true
  )

  const addCondition = () => {
    const newCondition: AlertCondition = {
      id: `cond-${Date.now()}`,
      type: 'price',
      operator: '>',
      value: 0,
      description: '',
    }
    setConditions([...conditions, newCondition])
  }

  const updateCondition = (id: string, updates: Partial<AlertCondition>) => {
    setConditions(
      conditions.map((c) => (c.id === id ? { ...c, ...updates } : c))
    )
  }

  const removeCondition = (id: string) => {
    setConditions(conditions.filter((c) => c.id !== id))
  }

  const generateDescription = (condition: AlertCondition): string => {
    const typeLabels = {
      price: 'Price',
      technical: 'Technical',
      portfolio: 'Portfolio',
      risk: 'Risk',
      performance: 'Performance',
    }

    const operatorLabels = {
      '>': 'exceeds',
      '<': 'falls below',
      '=': 'equals',
      '>=': 'is at least',
      '<=': 'is at most',
      cross_above: 'crosses above',
      cross_below: 'crosses below',
    }

    let desc = `${typeLabels[condition.type]}`

    if (condition.asset) {
      desc += ` ${condition.asset}`
    }
    if (condition.indicator) {
      desc += ` ${condition.indicator}`
    }

    desc += ` ${operatorLabels[condition.operator]} ${condition.value}`

    return desc
  }

  const handleSave = () => {
    if (!name.trim() || conditions.length === 0) {
      alert('Please enter a name and add at least one condition')
      return
    }

    const alert: Alert = {
      id: initialAlert?.id || `alert-${Date.now()}`,
      name,
      description,
      enabled: true,
      conditions,
      conditionLogic,
      actions: [{ type: 'notify', message: `Alert: ${name}` }],
      createdAt: initialAlert?.createdAt || new Date().toISOString(),
      triggerCount: initialAlert?.triggerCount || 0,
      notificationSettings: {
        desktop: notifyDesktop,
        email: notifyEmail,
        sound: notifySound,
      },
    }

    onSave(alert)
  }

  const ConditionBuilder = ({ condition }: { condition: AlertCondition }) => (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium">{generateDescription(condition)}</p>
        </div>
        <button
          onClick={() => removeCondition(condition.id)}
          className="ml-2 p-1 text-red-600 hover:bg-red-50 rounded"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        {/* Condition Type */}
        <div>
          <label className="text-xs font-medium">Condition Type</label>
          <select
            value={condition.type}
            onChange={(e) =>
              updateCondition(condition.id, { type: e.target.value as AlertConditionType })
            }
            className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="price">Price Alert</option>
            <option value="technical">Technical Indicator</option>
            <option value="portfolio">Portfolio Metric</option>
            <option value="risk">Risk Level</option>
            <option value="performance">Performance</option>
          </select>
        </div>

        {/* Asset Selection (for price alerts) */}
        {condition.type === 'price' && (
          <div>
            <label className="text-xs font-medium">Asset</label>
            <select
              value={condition.asset || ''}
              onChange={(e) => updateCondition(condition.id, { asset: e.target.value })}
              className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select asset...</option>
              {ASSET_OPTIONS.map((asset) => (
                <option key={asset.symbol} value={asset.symbol}>
                  {asset.name} ({asset.symbol})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Indicator Selection (for technical alerts) */}
        {condition.type === 'technical' && (
          <div>
            <label className="text-xs font-medium">Indicator</label>
            <select
              value={condition.indicator || ''}
              onChange={(e) =>
                updateCondition(condition.id, { indicator: e.target.value })
              }
              className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select indicator...</option>
              <option value="RSI">RSI (Relative Strength Index)</option>
              <option value="MACD">MACD (Moving Average Convergence)</option>
              <option value="Bollinger">Bollinger Bands</option>
              <option value="EMA">EMA (Exponential Moving Average)</option>
              <option value="MA">MA (Moving Average)</option>
            </select>
          </div>
        )}

        {/* Operator */}
        <div>
          <label className="text-xs font-medium">Condition</label>
          <select
            value={condition.operator}
            onChange={(e) =>
              updateCondition(condition.id, { operator: e.target.value as any })
            }
            className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-sm"
          >
            <option value=">">Greater than (&gt;)</option>
            <option value="<">Less than (&lt;)</option>
            <option value="=">=Equals (=)</option>
            <option value=">=">=Greater or equal (&gt;=)</option>
            <option value="<=">=Less or equal (&lt;=)</option>
            <option value="cross_above">Crosses above</option>
            <option value="cross_below">Crosses below</option>
          </select>
        </div>

        {/* Value */}
        <div>
          <label className="text-xs font-medium">Value/Threshold</label>
          <input
            type="number"
            value={condition.value}
            onChange={(e) =>
              updateCondition(condition.id, { value: parseFloat(e.target.value) })
            }
            className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-sm"
            placeholder="Enter threshold value"
          />
        </div>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-background p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {initialAlert ? 'Edit Alert' : 'Create New Alert'}
          </h2>
          <button onClick={onCancel} className="p-1 hover:bg-muted rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Alert Details */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Alert Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded border border-input bg-background px-3 py-2"
                placeholder="e.g., BTC Price Alert"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full rounded border border-input bg-background px-3 py-2"
                placeholder="Describe what this alert does..."
                rows={2}
              />
            </div>
          </div>

          {/* Conditions */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Conditions</h3>
              <button
                onClick={addCondition}
                className="flex items-center gap-2 px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Add Condition
              </button>
            </div>

            {conditions.length > 0 && (
              <div className="mb-4 p-3 rounded-lg border border-border bg-muted/50">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">Combine with:</span>
                  <select
                    value={conditionLogic}
                    onChange={(e) => setConditionLogic(e.target.value as LogicalOperator)}
                    className="rounded border border-input bg-background px-2 py-1 text-xs"
                  >
                    <option value="AND">AND (all must be true)</option>
                    <option value="OR">OR (any can be true)</option>
                  </select>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {conditions.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-center text-sm text-muted-foreground">
                  No conditions yet. Add one to get started.
                </p>
              ) : (
                conditions.map((condition) => (
                  <ConditionBuilder key={condition.id} condition={condition} />
                ))
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-2 rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold">Notifications</h3>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={notifyDesktop}
                onChange={(e) => setNotifyDesktop(e.target.checked)}
                className="rounded border-border"
              />
              <span className="text-sm">Desktop Notification</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.checked)}
                className="rounded border-border"
              />
              <span className="text-sm">Email Notification</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={notifySound}
                onChange={(e) => setNotifySound(e.target.checked)}
                className="rounded border-border"
              />
              <span className="text-sm">Sound Alert</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              Save Alert
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border border-input hover:bg-muted"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
