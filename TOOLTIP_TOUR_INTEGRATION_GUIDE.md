# 📚 TOOLTIP & TOUR INTEGRATION GUIDE

## Quick Start Overview

Your trading platform already has **5 fully-built tooltip and tour components**. This guide shows you how to integrate them into your existing views.

---

## 🎯 Components Overview

### 1. **InfoTooltip** - Metric Explanations
**File:** `frontend/src/components/dashboard/InfoTooltip.tsx`

Show helpful tooltips when users hover over metrics.

```typescript
import { InfoTooltip, MetricInfo } from './dashboard/InfoTooltip'

// Simple usage
<InfoTooltip 
  label="Sharpe Ratio" 
  tooltip="Risk-adjusted return metric"
  learnMore="Higher is better (>1.0 is good)"
/>

// Pre-built metric info
<MetricInfo metricKey="sharpe_ratio" />
<MetricInfo metricKey="max_drawdown" />
<MetricInfo metricKey="win_rate" />
```

**Available Metrics:**
- `sharpe_ratio` - Risk-adjusted returns
- `max_drawdown` - Largest peak-to-trough decline
- `win_rate` - % of profitable trades
- `volatility` - Return fluctuation
- `sortino_ratio` - Downside risk focus
- `correlation` - Asset movement relationship
- `allocation` - Portfolio distribution
- `returns` - Profit/loss generated

---

### 2. **Dashboard Tour** - Widget Guide
**File:** `frontend/src/components/dashboard/WidgetSuggestions.tsx`

Interactive tour of dashboard features with step-by-step guidance.

```typescript
import WidgetSuggestions from './dashboard/WidgetSuggestions'

// Add to your dashboard view
export function DashboardView() {
  return (
    <div>
      {/* Existing widgets */}
      <PortfolioCard />
      <OrdersPanel />
      <SignalsPanel />
      
      {/* Add the tour component */}
      <WidgetSuggestions />
    </div>
  )
}
```

**Tour Features:**
- 5 interactive steps
- Previous/Next navigation
- Visual step indicators
- Widget suggestions for unused features
- Smart enable/disable actions

---

### 3. **Welcome Wizard** - First-Time User
**File:** `frontend/src/components/onboarding/WelcomeWizard.tsx`

Comprehensive onboarding flow for new users.

```typescript
import WelcomeWizard from './components/onboarding/WelcomeWizard'
import { getFromStorage, saveToStorage } from './utils/storage'

export default function App() {
  const [isFirstTime, setIsFirstTime] = useState(
    !getFromStorage('hasCompleteOnboarding', false)
  )

  if (isFirstTime) {
    return (
      <WelcomeWizard 
        onComplete={(profile) => {
          // Save user preferences
          saveToStorage('userProfile', profile)
          saveToStorage('hasCompleteOnboarding', true)
          setIsFirstTime(false)
        }} 
      />
    )
  }

  return <MainApp />
}
```

**Wizard Steps:**
1. Trading Style selection (Day trader, Swing, Long-term, ML researcher)
2. Asset preferences (Stocks, Crypto, Forex, Commodities, Mix)
3. Risk tolerance (Conservative, Moderate, Aggressive, Very Aggressive)
4. Layout recommendation (4 starter layouts)
5. Tour introduction

---

### 4. **Interactive Tutorial** - Feature Guides
**File:** `frontend/src/components/onboarding/InteractiveTutorial.tsx`

Step-by-step overlay tutorials for complex features.

```typescript
import InteractiveTutorial from './components/onboarding/InteractiveTutorial'

// Show tutorial for first trade
const [showTutorial, setShowTutorial] = useState(false)

<InteractiveTutorial 
  tutorial={firstTradeTutorial}
  onComplete={() => setShowTutorial(false)}
  onClose={() => setShowTutorial(false)}
/>

// Tutorial definition example
const firstTradeTutorial = {
  id: 'first-trade',
  name: 'Place Your First Trade',
  description: 'Learn how to execute a trade',
  category: 'Trading Basics',
  difficulty: 'Beginner',
  duration: '5 minutes',
  steps: [
    {
      title: 'Open Trade Execution',
      description: 'Click the Trade Execution button',
      element: '[data-tour="trade-exec-btn"]'
    },
    // ... more steps
  ]
}
```

---

### 5. **Contextual Help** - Feature-Specific Help
**File:** `frontend/src/components/onboarding/ContextualHelp.tsx`

"?" help icon with multi-tab assistance panels.

```typescript
import ContextualHelp from './components/onboarding/ContextualHelp'

// Add help icon to complex features
<div className="flex items-center gap-2">
  <label>Stop Loss Order</label>
  <ContextualHelp 
    feature="Stop-Loss Order"
    explanation="Automatically sells when price drops below..."
    videoUrl="https://..."
  />
</div>
```

**Help Tabs:**
- Overview - What is this feature?
- Video - Watch how it works
- Shortcuts - Keyboard shortcuts
- Guide - Detailed documentation

---

### 6. **Smart Suggestions** - Contextual Tips
**File:** `frontend/src/components/onboarding/SmartSuggestions.tsx`

Context-aware suggestions and alerts.

```typescript
import SmartSuggestions from './components/onboarding/SmartSuggestions'
import { 
  positionWithoutStopLoss,
  highConcentration,
  riskManagementTip 
} from './utils/onboarding'

const suggestions = [
  positionWithoutStopLoss('AAPL', 100),
  highConcentration('Technology', 35),
  riskManagementTip('Always use stop-losses')
]

<SmartSuggestions 
  suggestions={suggestions}
  onDismiss={handleDismiss}
  onAction={handleAction}
/>
```

**Suggestion Types:**
- ⚠️ Warning - Risk alerts
- 💡 Opportunity - Trading opportunities  
- 🏆 Achievement - Milestone celebrations
- 📝 Tip - Educational tips

---

## 📍 Integration Checklist

### Step 1: Dashboard Integration
- [ ] Add `WidgetSuggestions` to Dashboard view
- [ ] Add `MetricInfo` tooltips to stats display
- [ ] Add `InfoTooltip` to risk metrics
- [ ] Test hover interactions

### Step 2: First-Time User Flow
- [ ] Detect first-time users with `getFromStorage`
- [ ] Show `WelcomeWizard` on first visit
- [ ] Save user profile after completion
- [ ] Route to appropriate layout based on trading style

### Step 3: Onboarding Features
- [ ] Add help icons (`?`) to complex features
- [ ] Use `ContextualHelp` for feature explanations
- [ ] Show `SmartSuggestions` on relevant actions
- [ ] Track `InteractiveTutorial` completion

### Step 4: Testing
- [ ] Test hover behavior on tooltips
- [ ] Test tour navigation (prev/next)
- [ ] Test wizard form validation
- [ ] Test accessibility (keyboard nav, screen reader)
- [ ] Test on mobile devices

---

## 🚀 Implementation Examples

### Example 1: Risk Dashboard with Tooltips

```typescript
import { MetricInfo } from './dashboard/InfoTooltip'

export function RiskDashboard() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <MetricInfo metricKey="sharpe_ratio" />
        <span className="text-lg font-bold">1.85</span>
      </div>
      
      <div className="flex items-center justify-between">
        <MetricInfo metricKey="max_drawdown" />
        <span className="text-lg font-bold">-8.7%</span>
      </div>
      
      <div className="flex items-center justify-between">
        <MetricInfo metricKey="win_rate" />
        <span className="text-lg font-bold">62%</span>
      </div>
    </div>
  )
}
```

### Example 2: Trading Page with Tour

```typescript
import WidgetSuggestions from './dashboard/WidgetSuggestions'

export function TradingView() {
  return (
    <div>
      <h1>Trade Execution</h1>
      
      {/* Main trading interface */}
      <QuickTradeWidget />
      <OrderEntryPanel />
      <PositionCards />
      
      {/* Add tour at bottom */}
      <WidgetSuggestions />
    </div>
  )
}
```

### Example 3: Settings with Help

```typescript
import ContextualHelp from './components/onboarding/ContextualHelp'

export function APIKeySettings() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label>API Key</label>
        <ContextualHelp 
          feature="API Key"
          explanation="Your exchange API key for placing trades"
          videoUrl="https://..."
        />
      </div>
      <input type="password" placeholder="Enter API key" />
    </div>
  )
}
```

---

## 🎨 Styling & Customization

### Tooltip Colors
```typescript
// Modify InfoTooltip.tsx for custom colors
<div className="bg-card border border-border rounded-lg p-2">
  {/* Change to your theme */}
</div>
```

### Tour Colors
```typescript
// Modify WidgetSuggestions.tsx
<div className="bg-blue-500/5 border border-blue-500/30">
  {/* Customize tour styling */}
</div>
```

### Theme Variables
All components use CSS custom properties:
- `--background` - Background color
- `--foreground` - Text color
- `--primary` - Primary accent
- `--secondary` - Secondary accent
- `--border` - Border color
- `--muted-foreground` - Muted text

---

## ♿ Accessibility Features

All components include:
- ✅ ARIA labels for screen readers
- ✅ Keyboard navigation support
- ✅ High contrast mode support
- ✅ Reduced motion support
- ✅ Focus indicators

---

## 📱 Mobile Responsiveness

All components are mobile-responsive:
- ✅ Touch-friendly controls (44px min)
- ✅ Responsive tooltips
- ✅ Mobile-optimized modals
- ✅ Safe area support (notched devices)

---

## 🔄 State Management

Components integrate with existing stores:

```typescript
// Uses layoutStore for dashboard state
import { useLayoutStore } from '../store/layoutStore'

// Uses storage utils for persistence
import { getFromStorage, saveToStorage } from '../utils/storage'
```

---

## 🎯 Best Practices

1. **Tour First-Time Only**
   - Show tour only on first visit
   - Allow users to skip or dismiss
   - Remember dismissal preference

2. **Contextual Help**
   - Place help icons near complex features
   - Keep explanations concise
   - Link to detailed documentation

3. **Accessibility First**
   - Test with keyboard only
   - Test with screen reader
   - Test with high contrast mode

4. **Performance**
   - Lazy load tour components
   - Memoize suggestion lists
   - Debounce suggestion updates

---

## 🐛 Troubleshooting

### Tooltips Not Showing
- Check z-index: should be `z-40` or higher
- Verify parent container isn't `overflow: hidden`
- Test hover on desktop (not mobile)

### Tour Navigation Issues
- Ensure step buttons have proper `onClick` handlers
- Check state management integration
- Verify localStorage is working

### First-Time Detection Not Working
- Check `getFromStorage` is imported
- Verify `localStorage` is enabled
- Check browser dev tools for storage

---

## 📚 Related Documentation

- Accessibility Guide: `COMPREHENSIVE_SYSTEM_AUDIT.md`
- Animation Utils: `frontend/src/utils/animations.ts`
- Storage Utils: `frontend/src/utils/storage.ts`
- Onboarding Types: `frontend/src/types/onboarding.ts`

---

## ✨ Summary

Your platform has **production-ready** tooltip and tour components that integrate seamlessly with your existing codebase. Just add them to your views and they'll work out of the box!

**Status:** 🟢 Ready to Integrate
**Quality:** ⭐⭐⭐⭐⭐
**Complexity:** Low (plug and play)

Happy integrating! 🚀
