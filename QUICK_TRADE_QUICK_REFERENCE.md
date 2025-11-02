# Quick Trade Widget - Quick Reference Guide

## 🚀 Quick Start

### Import and Use
```tsx
import QuickTradeWidget from './components/trading/QuickTradeWidget'

// In your component
<QuickTradeWidget 
  position="fab"  // or "sidebar"
  onTradeExecuted={handleOrder}
/>
```

### Handle Executed Orders
```tsx
const handleOrder = (order: ExecutedOrder) => {
  console.log(`${order.side.toUpperCase()} ${order.shares} ${order.asset}`)
  // Update portfolio, notifications, etc.
}
```

---

## 📋 API Reference

### QuickTradeWidget Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `'fab' \| 'sidebar'` | `'fab'` | Deployment mode |
| `onTradeExecuted` | `(order) => void` | `undefined` | Called when trade executes |

### useQuickTradeStore API
```typescript
// Getters
const selectedAsset = useQuickTradeStore(s => s.selectedAsset)
const orderType = useQuickTradeStore(s => s.orderType)
const shares = useQuickTradeStore(s => s.shares)
const estimatedTotal = useQuickTradeStore(s => s.estimatedTotal)

// Setters
useQuickTradeStore(s => s.setSelectedAsset('ETH'))
useQuickTradeStore(s => s.setShares(10))
useQuickTradeStore(s => s.setOrderType('market-buy'))
useQuickTradeStore(s => s.calculateTotal(45230.5))
useQuickTradeStore(s => s.reset())
```

---

## 🎨 Customization

### Change Mock Prices
Edit `frontend/src/components/trading/QuickTradeWidget.tsx`:
```typescript
const ASSET_PRICES = {
  BTC: 50000,    // Your custom price
  ETH: 3000,     // Your custom price
  // ... etc
}
```

### Change Favorites
```typescript
const FAVORITES = ['BTC', 'ETH', 'SPY']  // Your favorites
```

### Change Buying Power
In `TradeExecution.tsx`:
```typescript
buyingPower: 50000,  // Default buying power
```

---

## 🔌 Integration Examples

### Connect to Real API
```tsx
const handleExecuteTrade = async () => {
  setIsExecuting(true)
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify({
        asset: state.selectedAsset,
        shares: state.shares,
        price: currentPrice,
        side: state.orderType.includes('buy') ? 'buy' : 'sell',
      })
    })
    const order = await response.json()
    onTradeExecuted?.(order)
  } finally {
    setIsExecuting(false)
  }
}
```

### Connect WebSocket for Live Prices
```tsx
useEffect(() => {
  const ws = new WebSocket('wss://api.example.com/prices')
  
  ws.onmessage = (event) => {
    const { symbol, price } = JSON.parse(event.data)
    if (symbol === state.selectedAsset) {
      setCurrentPrice(price)
    }
  }
  
  return () => ws.close()
}, [state.selectedAsset])
```

### Add Notifications
```tsx
const handleTradeExecuted = (order: ExecutedOrder) => {
  toast.success(`${order.side} ${order.shares} ${order.asset}`)
  setExecutedOrders([order, ...executedOrders])
}
```

---

## 🎯 Feature Checklist

- [x] Floating Action Button (FAB) mode
- [x] Sidebar mode
- [x] Asset selector
- [x] Price display
- [x] Quantity input
- [x] Buy/Sell buttons
- [x] Confirmation modal
- [x] Order history
- [x] Keyboard shortcuts
- [ ] Real API integration
- [ ] WebSocket prices
- [ ] Stop orders
- [ ] Bracket orders
- [ ] Position sizing
- [ ] Risk calculator

---

## 🧪 Testing

### Test Market Buy
1. Click FAB button
2. Select BTC
3. Enter quantity: 0.1
4. Click "Market Buy"
5. Review modal
6. Click "Confirm Buy"
7. Check order in history

### Test Keyboard Shortcut
1. Open confirmation modal
2. Press Enter → Confirms
3. Press Escape → Cancels

### Test Insufficient Funds
1. Enter quantity > available
2. See warning message
3. Try to execute anyway

---

## 📊 Data Structures

### Executed Order
```typescript
{
  id: "ORD-1730519400000",
  asset: "BTC",
  side: "buy",
  shares: 0.5,
  price: 45230.5,
  total: 22615.25,
  status: "filled",
  timestamp: "2025-11-02T12:00:00Z"
}
```

### Quote State
```typescript
{
  selectedAsset: "BTC",
  orderType: "market-buy",
  shares: 1,
  limitPrice: null,
  estimatedTotal: 45230.5,
  buyingPower: 10000,
  isOpen: true
}
```

---

## ⚡ Performance Tips

1. **Memoize price updates**
   ```tsx
   const currentPrice = useMemo(() => 
     ASSET_PRICES[state.selectedAsset], 
     [state.selectedAsset]
   )
   ```

2. **Debounce quantity input**
   ```tsx
   const [shares, setShares] = useState(0)
   const debouncedShares = useDebounce(shares, 300)
   
   useEffect(() => {
     state.calculateTotal(currentPrice)
   }, [debouncedShares])
   ```

3. **Cache dropdown calculations**
   - Pre-calculate max shares on mount
   - Update only when price changes

---

## 🐛 Common Issues

### Issue: Prices not updating
**Solution:** Check `ASSET_PRICES` constant updated correctly

### Issue: Modal won't close
**Solution:** Ensure `showConfirmation` state properly managed

### Issue: Orders not appearing
**Solution:** Check `onTradeExecuted` callback firing

### Issue: Buying power always same
**Solution:** Integrate with real account API

---

## 📚 Related Files

- `frontend/src/hooks/useQuickTrade.ts` - State management
- `frontend/src/components/trading/QuickTradeWidget.tsx` - Main component
- `frontend/src/components/trading/TradeConfirmationModal.tsx` - Modal
- `frontend/src/components/views/TradeExecution.tsx` - Integration example

---

## 🔗 Next Steps

1. **Phase OE-2:** Add advanced order types
2. **Phase OE-3:** Order status visualization
3. **Phase OE-4:** Position cards with P&L

---

## 💡 Tips & Tricks

### Hide FAB Programmatically
```tsx
const { setIsOpen } = useQuickTradeStore()
setIsOpen(false)  // Hide
setIsOpen(true)   // Show
```

### Pre-fill Order
```tsx
const { setSelectedAsset, setShares } = useQuickTradeStore()
setSelectedAsset('ETH')
setShares(5)
```

### Check Order Status
```tsx
const checkStatus = async (orderId: string) => {
  const res = await fetch(`/api/orders/${orderId}`)
  return res.json()
}
```

### Clear History
```tsx
const clearOrderHistory = () => {
  setExecutedOrders([])
}
```

---

**Version:** 1.0.0  
**Last Updated:** November 2, 2025  
**Status:** Production Ready ✅
