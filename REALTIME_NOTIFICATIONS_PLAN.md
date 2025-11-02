# Real-time Updates & Notifications - Complete Plan

**Date:** November 1, 2025  
**Status:** Planning Phase  
**Total Phases:** 4  
**Estimated Scope:** 5-7 days of development  

---

## 📋 Overview

This is a complete notification and real-time update system that keeps traders informed with smart, non-intrusive notifications and smooth, engaging live data animations. The system prioritizes critical alerts while gracefully delivering informational updates without overwhelming the user.

---

## 🎯 Phase Breakdown

### **Phase 1: Smart Notification System** ⏳ PENDING

**Files:**
- `frontend/src/store/notificationStore.ts` (NEW)
- `frontend/src/components/notifications/NotificationCenter.tsx` (NEW)
- `frontend/src/components/notifications/ToastNotification.tsx` (NEW)
- `frontend/src/components/notifications/NotificationHistory.tsx` (NEW)

#### Notification Types & Priority Levels

**Critical Priority (Red - 🔴)**
```typescript
interface CriticalNotification {
  type: 'large_loss' | 'risk_breach' | 'api_error' | 'connection_lost'
  title: string
  description: string
  action?: () => void
  actionLabel?: string
}

Examples:
- "Large Loss Alert: $5,000 loss in TSLA position"
- "Risk Limit Breached: Max daily loss of $10,000 reached"
- "API Connection Lost: Unable to reach Alpaca API"
- "WebSocket Disconnected: Real-time updates paused"
```

**High Priority (Amber - 🟠)**
```typescript
interface HighNotification {
  type: 'order_filled' | 'signal_generated' | 'threshold_reached'
  title: string
  description: string
  details?: {
    asset?: string
    price?: number
    quantity?: number
    confidence?: number
  }
}

Examples:
- "Order Filled: BUY 100 AAPL @ $150.25"
- "Strong Signal: BUY TSLA (89% confidence)"
- "Threshold Reached: RSI oversold on SPY"
```

**Medium Priority (Blue - 🔵)**
```typescript
interface MediumNotification {
  type: 'daily_summary' | 'report_ready' | 'milestone'
  title: string
  description: string
  metadata?: Record<string, string | number>
}

Examples:
- "Daily Summary: +$2,500 profit, 8 trades"
- "Weekly Report Ready: View your performance analysis"
- "Milestone: 100 profitable trades in a row!"
```

**Low Priority (Gray - ⚪)**
```typescript
interface LowNotification {
  type: 'settings_saved' | 'data_synced' | 'info'
  title: string
  description: string
}

Examples:
- "Settings saved successfully"
- "Dashboard synced with latest data"
- "Chart updated"
```

#### Notification Center Features

**1. Zustand Store for Notifications**
```typescript
interface NotificationStore {
  // State
  notifications: Notification[]
  unreadCount: number
  filterType: 'all' | 'critical' | 'high' | 'medium' | 'low'
  
  // Actions
  addNotification(notification: Notification): void
  removeNotification(id: string): void
  markAsRead(id: string): void
  markAllAsRead(): void
  clearAll(): void
  setFilter(type: NotificationType): void
  groupSimilar(): Notification[]
}
```

**2. Toast Notifications**
- Bottom-right corner position
- Auto-dismiss after 5-10 seconds (configurable by priority)
- Dismissible X button
- Stack vertically (max 3-4 visible)
- Smooth fade in/out animations
- Sound notification option (user preference)

**3. Notification Dropdown/History**
- Bell icon in navbar with badge count
- Dropdown shows last 20 notifications
- Grouped by type: "5 orders filled in last hour"
- Search/filter by type, priority, date
- Mark individual or all as read
- Clear history button

**4. Grouping Logic**
```typescript
// Group notifications
- Same type + same asset = group
- Same type + within 5 minutes = group
- Show count badge: "5 orders"
- Click to expand and see details
```

#### Implementation Details

- **Storage:** Persist to localStorage (last 50 notifications)
- **Real-time:** WebSocket events trigger notifications
- **Sounds:** Optional audio cues for critical alerts
- **Accessibility:** ARIA announcements for screen readers
- **Mobile:** Full-width toasts on mobile, drawer on tablet

---

### **Phase 2: Visual Notification Indicators** ⏳ PENDING

**Files:**
- `frontend/src/components/notifications/AlertIndicator.tsx` (NEW)
- `frontend/src/components/notifications/NotificationBadge.tsx` (NEW)
- `frontend/src/hooks/useNotificationAnimation.ts` (NEW)

#### Pulsing Animations

**Critical Alert Pulse**
```css
@keyframes criticalPulse {
  0% { 
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
    background-color: rgb(239, 68, 68);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
    background-color: rgb(239, 68, 68);
  }
}
```

**High Priority Pulse**
```css
@keyframes highPulse {
  0% { 
    box-shadow: 0 0 0 0 rgba(251, 146, 60, 0.7);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(251, 146, 60, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(251, 146, 60, 0);
  }
}
```

#### Badge Count System

- Show unread notification count on bell icon
- Red badge for critical alerts (>0)
- Orange badge for high priority
- Blue badge for all unread
- Animated +1 pop animation when new notification arrives
- Number disappears when marked as read

#### Color-Coded Severity

```
🔴 Critical (Red): #ef4444
  - Immediate attention required
  - Pulsing, loud, prominent
  
🟠 High (Orange): #f97316
  - Important but not urgent
  - Clear animation, distinct
  
🔵 Medium (Blue): #3b82f6
  - Informational, can wait
  - Subtle appearance
  
⚪ Low (Gray): #9ca3af
  - Background info
  - Minimal animation
```

#### Visual Components

**1. Alert Indicator Component**
- Position: Top-right of navbar (above bell icon)
- Shows highest priority notification
- Auto-collapse after 10 seconds
- Click to open notification center

**2. Notification Badge**
- On bell icon showing unread count
- Color matches highest priority
- Animated pop on new notification
- Animated shrink when cleared

**3. Toast Container**
- Stack management (max 4 visible)
- Spacing between toasts
- Z-index layering
- Responsive positioning

---

### **Phase 3: Live Data Animations** ⏳ PENDING

**Files:**
- `frontend/src/hooks/useAnimatedValue.ts` (NEW)
- `frontend/src/components/common/AnimatedNumber.tsx` (NEW)
- `frontend/src/components/common/FlashingValue.tsx` (NEW)

#### Subtle Value Changes

**1. Flash Animation on Value Change**
```typescript
interface FlashingValueProps {
  value: number
  format?: (v: number) => string
  duration?: number // milliseconds
}

Behavior:
- Value updates → Flash green (increase) or red (decrease)
- Hold color for 300ms
- Fade to normal color over 500ms
- Use opacity transition for smooth effect
```

**Example CSS:**
```css
@keyframes flashGreen {
  0% { 
    background-color: rgba(16, 185, 129, 0.3);
    color: rgb(16, 185, 129);
  }
  100% { 
    background-color: transparent;
    color: inherit;
  }
}
```

**2. Animated Number Counting**
```typescript
interface AnimatedNumberProps {
  from: number
  to: number
  duration?: number // default 500ms
  decimals?: number
  prefix?: string // "$", "€"
  suffix?: string // "%", " units"
}

Behavior:
- Don't show intermediate values visually
- Animate the value smoothly in background
- Display exact value at end
- Use easing for natural feel
```

**Use Cases:**
- Portfolio value: $10,250 → $10,500
- Daily P&L: +$250.50
- Position size: 100 → 150 shares
- Win rate: 65% → 68%

**3. Smooth Chart Updates**
```typescript
// When data updates:
- Don't redraw immediately
- Animate transition over 300-500ms
- Use easing: easeInOutQuad
- Preserve user interactions (hover, zoom)

// Price lines:
- New candles slide in from right
- Existing candles stay steady
- Volume bars animate height
- Grid lines fade smoothly
```

#### Animation Utilities

**useAnimatedValue Hook**
```typescript
const { displayValue, isAnimating } = useAnimatedValue(
  actualValue,
  { duration: 500, decimals: 2 }
)
```

**useFlash Hook**
```typescript
const { flashColor, flash } = useFlash()
// Use: flash('success') or flash('error')
```

#### Performance Optimization

- Use `requestAnimationFrame` for smooth 60fps
- Throttle value updates to prevent animation stacking
- Use CSS transitions where possible (GPU-accelerated)
- Memoize animated components
- Cancel animations on component unmount

---

### **Phase 4: Connection Status System** ⏳ PENDING

**Files:**
- `frontend/src/store/connectionStore.ts` (NEW)
- `frontend/src/components/status/ConnectionIndicator.tsx` (NEW)
- `frontend/src/components/status/SyncingIndicator.tsx` (NEW)
- `frontend/src/components/status/StaleDataWarning.tsx` (NEW)

#### Connection Monitoring

**Connection States**
```typescript
type ConnectionState = 
  | 'connected'      // All systems running
  | 'syncing'        // Fetching latest data
  | 'reconnecting'   // Lost connection, trying to restore
  | 'disconnected'   // Connection lost, data stale
  | 'degraded'       // Partial connection loss
```

#### Syncing Indicator

**Visual Indicator:**
```typescript
// Location: Right side of navbar or status bar
// Shows when:
- Initial data load
- After refresh/refocus
- When new real-time data arriving
- WebSocket reconnecting

// Animation:
- Rotating circular icon (smooth 2s rotation)
- Pulsing opacity while syncing
- Disappear/green checkmark when done
- Show duration: "Syncing... (2s)"
```

**Component Structure:**
```tsx
<SyncingIndicator 
  isActive={isDataLoading}
  message="Syncing market data..."
  duration={elapsedTime}
/>
```

#### Pulse Effect for Real-time Streaming

**Visual Feedback:**
```css
@keyframes streamPulse {
  0%, 100% { 
    opacity: 0.6;
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
  }
  50% { 
    opacity: 1;
    box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
  }
}

// Shows connection is live and receiving data
// Green pulse indicates healthy WebSocket
// Red pulse indicates connection issues
```

**Connected State Indicator:**
- Green dot with pulse animation
- Label: "Live" or "Live: 2.3s latency"
- In navbar or status area
- Click to see connection details

#### Stale Data Warning

**When to Show:**
```typescript
if (lastDataUpdate > 30_000) {  // 30 seconds
  return <StaleDataWarning />
}

if (connectionState === 'disconnected') {
  return <StaleDataWarning severity="critical" />
}
```

**Warning Component:**
```tsx
<StaleDataWarning 
  severity="warning" // 'warning' or 'critical'
  lastUpdate={timestamp}
  message="Data may be outdated. Reconnecting..."
  onRetry={handleRetry}
/>

// Styling:
// - Warning: Yellow/amber background, border
// - Critical: Red background, border with animation
// - Dismissible: Optional X button
// - Auto-dismiss: When connection restored
```

**Message Examples:**
- ⚠️ "Warning: Market data is 45 seconds old"
- 🔴 "Critical: Disconnected from data feed (2 min)"
- ✅ "Live: Real-time data connected"

#### Connection Details Modal

**Show when user clicks on connection indicator:**
```
Connection Status
├─ API (REST)
│  └─ Status: Connected (45ms latency)
├─ WebSocket
│  └─ Status: Connected (12ms latency)
├─ ML Models
│  └─ Status: Connected (89ms latency)
└─ Last full sync: 5 seconds ago
```

---

## 🛠️ Technical Stack

### Core Libraries
- `zustand` - Notification state management
- `framer-motion` - Smooth animations
- `react-hot-toast` - Toast notifications (alternative to custom)
- `audio` - HTML5 audio for notification sounds
- `requestAnimationFrame` - Performance-critical animations

### Custom Hooks
- `useAnimatedValue` - Number animations
- `useFlash` - Color flash effects
- `useNotificationSound` - Audio playback
- `useConnectionStatus` - Monitor connection health
- `useDebounce` - Throttle value updates

### Styling
- Tailwind CSS for base styles
- CSS animations for performance
- Custom keyframes for complex animations
- CSS variables for theme colors

---

## 📊 Component Architecture

```
frontend/src/components/notifications/
├── NotificationCenter.tsx (main container)
├── ToastNotification.tsx (individual toast)
├── NotificationHistory.tsx (dropdown/modal)
├── AlertIndicator.tsx (navbar indicator)
└── NotificationBadge.tsx (unread count)

frontend/src/components/status/
├── ConnectionIndicator.tsx (connection dot)
├── SyncingIndicator.tsx (loading animation)
├── StaleDataWarning.tsx (warning banner)
└── ConnectionDetailsModal.tsx (info modal)

frontend/src/components/common/
├── AnimatedNumber.tsx (counting numbers)
└── FlashingValue.tsx (color flash effect)

frontend/src/store/
├── notificationStore.ts (Zustand store)
└── connectionStore.ts (Connection status)

frontend/src/hooks/
├── useAnimatedValue.ts
├── useFlash.ts
├── useNotificationSound.ts
├── useConnectionStatus.ts
└── useDebounce.ts
```

---

## 🎨 Animation Reference

### Notification Animations
| Animation | Duration | Trigger | Effect |
|-----------|----------|---------|--------|
| Toast fade in | 300ms | New toast | Smooth appearance |
| Toast fade out | 300ms | Auto-dismiss | Smooth disappearance |
| Critical pulse | 1000ms | Critical alert | Pulsing red glow |
| Badge pop | 400ms | New notification | Pop in/out effect |
| Slide up | 200ms | Toast stack | Stack position |

### Data Animations
| Animation | Duration | Use Case | Effect |
|-----------|----------|----------|--------|
| Flash green | 500ms | Value increase | Green highlight fade |
| Flash red | 500ms | Value decrease | Red highlight fade |
| Number count | 500ms | Large updates | Smooth number transition |
| Chart transition | 300ms | Data refresh | Smooth chart update |

### Connection Animations
| Animation | Duration | Meaning | Effect |
|-----------|----------|---------|--------|
| Sync spin | 2000ms | Loading data | Rotating circle |
| Pulse green | 1500ms | Live connected | Green pulse ring |
| Pulse red | 1500ms | Connection issue | Red pulse ring |
| Fade warning | 300ms | Show/hide | Warning fade |

---

## 🔄 Data Flow

### Notification Flow
```
Event occurs (order filled, loss limit breached)
  ↓
Create notification object
  ↓
Add to notificationStore
  ↓
Toast renders (auto-dismiss)
  ↓
Add to history (persists in store)
  ↓
Update badge count
  ↓
Play sound (if enabled)
```

### Animation Flow
```
Data value changes
  ↓
Check if animation enabled
  ↓
Calculate from/to values
  ↓
Start requestAnimationFrame loop
  ↓
Animate over duration
  ↓
Complete and show final value
```

### Connection Flow
```
WebSocket connects
  ↓
Set connectionStore.state = 'connected'
  ↓
Show green indicator with pulse
  ↓
Start receiving data
  ↓
Update lastDataUpdate timestamp
  ↓
Hide stale data warning (if shown)
```

---

## 🧪 Testing Scenarios

### Notification Testing
- [ ] Critical alert displays immediately with sound
- [ ] Multiple toasts stack vertically
- [ ] Notifications group correctly
- [ ] Badge count updates accurately
- [ ] Mark as read functionality works
- [ ] Clear all button clears history
- [ ] Notifications persist across page reload
- [ ] Mobile layout works (full-width toast)

### Animation Testing
- [ ] Number counting animates smoothly
- [ ] Flash effect shows correct colors
- [ ] Animations perform at 60fps
- [ ] No animation stacking issues
- [ ] Animations cancel on unmount
- [ ] Animations respect user preferences

### Connection Testing
- [ ] Connection indicator shows correct state
- [ ] Syncing spinner shows while loading
- [ ] Stale data warning shows >30s
- [ ] Auto-reconnect works
- [ ] Connection details modal shows info
- [ ] Recovery from disconnection smooth

---

## 🚀 Implementation Timeline

### Day 1: Smart Notification System
- Build Zustand notification store
- Create NotificationCenter component
- Implement toast notifications
- Add notification history dropdown

### Day 2: Visual Indicators
- Implement pulsing animations
- Create notification badge
- Add color-coded severity
- Polish animations

### Day 3: Live Data Animations
- Create AnimatedNumber component
- Implement FlashingValue component
- Add chart animation support
- Create custom hooks

### Day 4: Connection Status
- Build ConnectionIndicator
- Create SyncingIndicator
- Implement StaleDataWarning
- Add connection details modal

### Day 5-7: Polish & Testing
- Test all animations at 60fps
- Verify accessibility
- Mobile responsiveness
- Sound notification testing
- Performance optimization

---

## ✅ Delivery Checklist

- [ ] All 4 phases implemented
- [ ] Zero performance issues
- [ ] Accessibility compliant
- [ ] Mobile responsive
- [ ] Persistence working
- [ ] Sounds optional and working
- [ ] Animations smooth at 60fps
- [ ] Error handling complete
- [ ] Tests passing
- [ ] Documentation complete

---

## 🎁 Expected Outcomes

✨ **Professional Notification System**
- Users never miss critical alerts
- Non-intrusive but clear design
- Beautiful, smooth animations
- Mobile-optimized experience
- Accessible to all users

---

**Ready to start Phase 1: Smart Notification System?** 🚀
