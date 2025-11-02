import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export type OrderType = 'market' | 'limit' | 'stop' | 'stop-limit' | 'trailing-stop'
export type TimeInForce = 'day' | 'gtc' | 'ioc' | 'fok'

interface OrderTypeInfo {
  id: OrderType
  label: string
  description: string
  fields: string[]
}

const ORDER_TYPES: OrderTypeInfo[] = [
  {
    id: 'market',
    label: 'Market',
    description: 'Execute immediately at best available price',
    fields: [],
  },
  {
    id: 'limit',
    label: 'Limit',
    description: 'Execute only at specified price or better',
    fields: ['limitPrice'],
  },
  {
    id: 'stop',
    label: 'Stop',
    description: 'Convert to market order when price reaches trigger',
    fields: ['stopPrice'],
  },
  {
    id: 'stop-limit',
    label: 'Stop-Limit',
    description: 'Combine stop and limit for precise control',
    fields: ['stopPrice', 'limitPrice'],
  },
  {
    id: 'trailing-stop',
    label: 'Trailing Stop',
    description: 'Stop loss follows price as it moves up',
    fields: ['trailAmount', 'trailPercent'],
  },
]

const TIME_IN_FORCE_OPTIONS = [
  {
    id: 'day' as TimeInForce,
    label: 'Day',
    description: 'Expires at market close',
  },
  {
    id: 'gtc' as TimeInForce,
    label: 'GTC',
    description: 'Good-til-Canceled',
  },
  {
    id: 'ioc' as TimeInForce,
    label: 'IOC',
    description: 'Immediate or Cancel',
  },
  {
    id: 'fok' as TimeInForce,
    label: 'FOK',
    description: 'Fill or Kill',
  },
]

interface OrderTypeSelectorProps {
  orderType: OrderType
  timeInForce: TimeInForce
  onOrderTypeChange: (type: OrderType) => void
  onTimeInForceChange: (tif: TimeInForce) => void
  currentPrice: number
}

export default function OrderTypeSelector({
  orderType,
  timeInForce,
  onOrderTypeChange,
  onTimeInForceChange,
  currentPrice,
}: OrderTypeSelectorProps) {
  const [showOrderTypeDropdown, setShowOrderTypeDropdown] = useState(false)
  const [showTifDropdown, setShowTifDropdown] = useState(false)

  const selectedOrderType = ORDER_TYPES.find((t) => t.id === orderType)
  const selectedTif = TIME_IN_FORCE_OPTIONS.find((t) => t.id === timeInForce)

  return (
    <div className="space-y-4">
      {/* Order Type Selector */}
      <div className="relative">
        <label className="block text-xs font-semibold text-muted-foreground mb-2">
          Order Type
        </label>

        <button
          onClick={() => setShowOrderTypeDropdown(!showOrderTypeDropdown)}
          className="w-full px-3 py-2 bg-muted border border-input rounded-lg flex items-center justify-between hover:bg-muted/80 transition-colors"
        >
          <div className="text-left">
            <div className="font-semibold text-sm">{selectedOrderType?.label}</div>
            <div className="text-xs text-muted-foreground line-clamp-1">
              {selectedOrderType?.description}
            </div>
          </div>
          <ChevronDown className="h-4 w-4 flex-shrink-0" />
        </button>

        {/* Dropdown */}
        {showOrderTypeDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
            {ORDER_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => {
                  onOrderTypeChange(type.id)
                  setShowOrderTypeDropdown(false)
                }}
                className={`w-full text-left px-3 py-3 transition-colors border-b border-border last:border-b-0 ${
                  orderType === type.id
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                <div className="font-medium text-sm">{type.label}</div>
                <div className="text-xs text-muted-foreground">{type.description}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Order Type Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
        <div className="text-xs text-blue-700 dark:text-blue-400">
          <strong>{selectedOrderType?.label} Order:</strong> {selectedOrderType?.description}
        </div>
      </div>

      {/* Time in Force */}
      <div className="relative">
        <label className="block text-xs font-semibold text-muted-foreground mb-2">
          Time in Force
        </label>

        <button
          onClick={() => setShowTifDropdown(!showTifDropdown)}
          className="w-full px-3 py-2 bg-muted border border-input rounded-lg flex items-center justify-between hover:bg-muted/80 transition-colors"
        >
          <div className="text-left">
            <div className="font-semibold text-sm">{selectedTif?.label}</div>
            <div className="text-xs text-muted-foreground">{selectedTif?.description}</div>
          </div>
          <ChevronDown className="h-4 w-4 flex-shrink-0" />
        </button>

        {/* Dropdown */}
        {showTifDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
            {TIME_IN_FORCE_OPTIONS.map((tif) => (
              <button
                key={tif.id}
                onClick={() => {
                  onTimeInForceChange(tif.id)
                  setShowTifDropdown(false)
                }}
                className={`w-full text-left px-3 py-3 transition-colors border-b border-border last:border-b-0 ${
                  timeInForce === tif.id
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                <div className="font-medium text-sm">{tif.label}</div>
                <div className="text-xs text-muted-foreground">{tif.description}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TIF Info */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-muted p-2 rounded">
          <div className="font-medium text-foreground">DAY</div>
          <div className="text-muted-foreground">Market close</div>
        </div>
        <div className="bg-muted p-2 rounded">
          <div className="font-medium text-foreground">GTC</div>
          <div className="text-muted-foreground">Persistent</div>
        </div>
        <div className="bg-muted p-2 rounded">
          <div className="font-medium text-foreground">IOC</div>
          <div className="text-muted-foreground">Fill/Cancel</div>
        </div>
        <div className="bg-muted p-2 rounded">
          <div className="font-medium text-foreground">FOK</div>
          <div className="text-muted-foreground">All or none</div>
        </div>
      </div>
    </div>
  )
}
