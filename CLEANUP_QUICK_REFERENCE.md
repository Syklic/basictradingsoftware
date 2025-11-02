# Cleanup Quick Reference Guide

## 📚 New Utilities at a Glance

### 1. **Calculations (`utils/calculations.ts`)**
```typescript
import { calculatePnL, calculatePortfolioStats, formatCurrency } from '../utils/calculations'

// Calculate P&L for a single position
const { pnl, pnlPercent } = calculatePnL(currentValue, shares, entryPrice)

// Calculate portfolio-wide statistics
const stats = calculatePortfolioStats(positions)
// Returns: { totalValue, totalCost, totalPnL, totalPnLPercent, winningPositions, losingPositions }

// Format numbers
formatCurrency(1234.56)      // "$1,234.56"
formatPercent(45.678, 2)     // "45.68%"
isPositive(-5)               // false
```

### 2. **Storage (`utils/storage.ts`)**
```typescript
import { getFromStorage, saveToStorage, removeFromStorage } from '../utils/storage'

// Get value with default fallback
const theme = getFromStorage<string>('theme', 'light')

// Save to storage
saveToStorage('user-settings', { darkMode: true })

// Remove item
removeFromStorage('session-token')

// Check if exists
if (hasInStorage('user-id')) { /* ... */ }
```

### 3. **Options Constants (`constants/options.ts`)**
```typescript
import {
  STAKING_PROVIDERS,
  ML_MODELS,
  CURRENCY_OPTIONS,
  LOG_LEVELS,
  CHART_TIMEFRAMES,
  TRADING_MODES,
  ALERT_TYPES,
  WIDGET_DESCRIPTIONS,
  ASSET_OPTIONS,
  ORDER_TYPES,
  TIME_IN_FORCE_OPTIONS
} from '../constants/options'

// Use in dropdowns
<select>
  {STAKING_PROVIDERS.map(p => (
    <option key={p.id} value={p.id}>{p.name}</option>
  ))}
</select>
```

### 4. **Temporary Messages Hook (`hooks/useTemporaryMessage.ts`)**
```typescript
import { useTemporaryMessage } from '../hooks/useTemporaryMessage'

export default function MyComponent() {
  const [message, setMessage] = useTemporaryMessage(2000) // Auto-dismiss after 2 seconds

  const handleSave = () => {
    saveData()
    setMessage('✓ Saved successfully!')
  }

  return (
    <div>
      {message && <div className="alert">{message}</div>}
      <button onClick={handleSave}>Save</button>
    </div>
  )
}
```

### 5. **Common Props (`types/common.ts`)**
```typescript
import type {
  CloseableProps,
  DismissableProps,
  LoadableProps,
  SelectableProps,
  EditableProps,
  ModalProps,
  FormProps
} from '../types/common'

// Use as base for component props
interface MyComponentProps extends CloseableProps {
  title: string
  onSubmit: (data: any) => void
}

interface MyModalProps extends ModalProps {
  onConfirm: () => void
}
```

---

## 🔄 Migration Guide

### Before (Old Way)
```typescript
// In PositionCard.tsx
const pnl = position.value - position.shares * position.entryPrice
const pnlPercent = (pnl / (position.shares * position.entryPrice)) * 100
const isProfit = pnl >= 0
```

### After (New Way)
```typescript
// In PositionCard.tsx
import { calculatePnL, isPositive } from '../../utils/calculations'

const { pnl, pnlPercent } = calculatePnL(position.value, position.shares, position.entryPrice)
const isProfit = isPositive(pnl)
```

---

## ✅ Components Already Updated

- ✅ **PositionCard.tsx** - Uses `calculatePnL()`
- ✅ **PositionManagementPanel.tsx** - Uses `calculatePortfolioStats()`
- ✅ **App.tsx** - Uses `getFromStorage()`

---

## ⏳ Ready to Update (Bonus)

### SettingsDialog.tsx
```typescript
// Replace this:
const stakingProviders = [...]
const mlModels = [...]

// With this:
import { STAKING_PROVIDERS, ML_MODELS } from '../constants/options'
```

### WidgetManager.tsx
```typescript
// Replace this:
const WIDGET_DESCRIPTIONS: Record<string, ...> = {...}

// With this:
import { WIDGET_DESCRIPTIONS } from '../constants/options'
```

---

## 📋 File Structure

```
frontend/src/
├── utils/
│   ├── calculations.ts      ✨ NEW - Financial calculations
│   └── storage.ts           ✨ NEW - localStorage helpers
├── constants/
│   └── options.ts           ✨ NEW - Configuration options
├── hooks/
│   └── useTemporaryMessage.ts ✨ NEW - Message hook
└── types/
    └── common.ts            ✨ NEW - Common interfaces
```

---

## 🎯 Usage Patterns

### Pattern 1: Calculations in Components
```typescript
import { calculatePortfolioStats, formatCurrency } from '../utils/calculations'

const stats = calculatePortfolioStats(positions)
return <div>Value: {formatCurrency(stats.totalValue)}</div>
```

### Pattern 2: Storage in Hooks
```typescript
import { getFromStorage, saveToStorage } from '../utils/storage'

const [settings, setSettings] = useState(() => 
  getFromStorage('app-settings', DEFAULT_SETTINGS)
)

// Later...
saveToStorage('app-settings', settings)
```

### Pattern 3: Constants in Selects
```typescript
import { ASSET_OPTIONS, ORDER_TYPES } from '../constants/options'

<select>
  {ASSET_OPTIONS.map(asset => (
    <option key={asset.symbol}>{asset.name}</option>
  ))}
</select>
```

### Pattern 4: Messages in Forms
```typescript
import { useTemporaryMessage } from '../hooks/useTemporaryMessage'

const [message, setMessage] = useTemporaryMessage()

const handleSubmit = async (data) => {
  try {
    await submitForm(data)
    setMessage('✓ Saved!')
  } catch (err) {
    setMessage('✗ Error saving')
  }
}
```

### Pattern 5: Props Extension
```typescript
import type { CloseableProps } from '../types/common'

interface DialogProps extends CloseableProps {
  title: string
}

export default function MyDialog({ title, onClose }: DialogProps) {
  return (
    <div>
      <h2>{title}</h2>
      <button onClick={onClose}>Close</button>
    </div>
  )
}
```

---

## 💡 Tips & Tricks

### Tip 1: Type-safe Storage
```typescript
// This will error if key doesn't match:
const value = getFromStorage<UserSettings>('user-settings', defaultSettings)
//                                        ↑ Must be correct key
```

### Tip 2: Automatic Message Dismissal
```typescript
// No manual cleanup needed - hook handles it!
const [msg, setMsg] = useTemporaryMessage(3000) // 3 seconds

setMsg('Loading...')  // Will auto-clear after 3 seconds
```

### Tip 3: Reuse Option Constants
```typescript
// Use in multiple places without duplication
export const ASSET_DROPDOWN = ASSET_OPTIONS
export const ASSET_SELECT_PROPS = ASSET_OPTIONS.map(a => ({
  value: a.symbol,
  label: a.name
}))
```

---

## 🚀 Performance Benefits

- ✅ **Calculations**: Pure functions, can be memoized
- ✅ **Storage**: Centralized error handling
- ✅ **Constants**: Single source of truth (no duplication)
- ✅ **Hook**: Cleanup handled automatically
- ✅ **Types**: Better IDE autocomplete

---

## 📞 Questions?

Refer to:
- `CLEANUP_IMPLEMENTATION_COMPLETE.md` - Detailed implementation guide
- `CLEANUP_IMPLEMENTATION_SUMMARY.txt` - Visual overview
- `ADDITIONAL_CLEANUP_OPPORTUNITIES.md` - Full analysis

---

Generated: November 2, 2025
Status: Complete
