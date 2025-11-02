# Coding Standards & Best Practices

## 🎯 Mission

Maintain a clean, well-organized, professional-grade codebase that scales efficiently and remains maintainable as the project grows.

---

## 📋 Core Principles

### 1. **DRY (Don't Repeat Yourself)**
- ❌ **Never** duplicate logic across files
- ✅ **Always** extract repeated code into utilities, constants, or hooks
- ✅ When you find yourself copy-pasting, create a shared function instead

### 2. **Single Responsibility Principle**
- ❌ Don't create god components
- ✅ Each function/component should do ONE thing well
- ✅ Break complex components into smaller, focused pieces

### 3. **KISS (Keep It Simple, Stupid)**
- ❌ Don't over-engineer solutions
- ✅ Write clear, readable code
- ✅ If it needs explaining, it's too complex

### 4. **YAGNI (You Aren't Gonna Need It)**
- ❌ Don't add features "just in case"
- ✅ Build what's needed now
- ✅ Refactor when requirements change

---

## 📁 File Organization

### Directory Structure
```
frontend/src/
├── components/
│   ├── common/              ← Reusable UI components
│   ├── navigation/          ← Navigation components
│   ├── trading/             ← Trading-specific components
│   ├── widgets/             ← Dashboard widgets
│   └── views/               ← Full page views
├── hooks/                   ← Custom React hooks (reusable logic)
├── utils/                   ← Utility functions (non-React)
├── constants/               ← Configuration and constants
├── types/                   ← TypeScript type definitions
├── store/                   ← State management (Zustand)
└── App.tsx                  ← Main app component
```

### File Naming Conventions
- **Components**: PascalCase (e.g., `PositionCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useTemporaryMessage.ts`)
- **Utils/Functions**: camelCase (e.g., `calculations.ts`)
- **Constants**: SCREAMING_SNAKE_CASE for values, PascalCase for files (e.g., `options.ts`)
- **Types**: PascalCase (e.g., `trading.ts`, `common.ts`)

---

## 🔍 Before Writing Code Checklist

Before implementing ANY new feature, ask yourself:

### ❓ Questions to Ask

- [ ] **Does this logic already exist somewhere?**
  - Search the codebase for similar implementations
  - If found, reuse it or extract it to a shared utility

- [ ] **Should this be a hook, utility, or constant?**
  - **Hook**: React-specific logic (state, effects, context)
  - **Utility**: Pure functions with no side effects
  - **Constant**: Configuration values, option lists, etc.

- [ ] **Can this be reused?**
  - If yes → put it in `utils/`, `hooks/`, or `constants/`
  - If no → keep it local to the component

- [ ] **Does this violate DRY?**
  - Check for duplicate patterns
  - Check for duplicate constants
  - Check for duplicate type definitions

- [ ] **Is this the simplest possible implementation?**
  - Avoid over-engineering
  - Don't add "nice-to-haves"
  - Focus on the core requirement

---

## 💾 Where to Put Code

### Use `utils/` for:
```typescript
// ✅ Pure functions with no side effects
export const calculatePnL = (value, shares, price) => { /* ... */ }
export const formatCurrency = (value) => { /* ... */ }
export const validateEmail = (email) => { /* ... */ }
```

### Use `hooks/` for:
```typescript
// ✅ React-specific logic
export const useTemporaryMessage = (duration) => { /* ... */ }
export const useApiCall = (url) => { /* ... */ }
export const useLocalStorage = (key) => { /* ... */ }
```

### Use `constants/` for:
```typescript
// ✅ Configuration values and option lists
export const STAKING_PROVIDERS = [...]
export const CHART_TIMEFRAMES = [...]
export const DEFAULT_SETTINGS = { /* ... */ }
```

### Use `types/` for:
```typescript
// ✅ Type definitions (interfaces, types)
export interface Position { /* ... */ }
export type OrderStatus = 'pending' | 'filled' | 'canceled'
export interface CloseableProps { onClose: () => void }
```

### Keep in `components/` for:
```typescript
// ✅ Component-specific logic only
// ❌ Don't put utility functions here
// ❌ Don't put constants here
```

---

## 🏗️ Component Architecture

### Component Structure Template
```typescript
// 1. Imports (organized by priority)
import { useState, useEffect } from 'react'
import { Button } from 'lucide-react'
import { calculatePnL } from '../utils/calculations'
import { useTemporaryMessage } from '../hooks/useTemporaryMessage'
import { ASSET_OPTIONS } from '../constants/options'
import type { Position } from '../types/trading'

// 2. Type definitions (if component-specific)
interface MyComponentProps {
  data: Position
  onClose: () => void
}

// 3. Component function
export default function MyComponent({ data, onClose }: MyComponentProps) {
  // 4. Hooks and state
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useTemporaryMessage()

  // 5. Logic and calculations
  const { pnl, pnlPercent } = calculatePnL(data.value, data.shares, data.price)

  // 6. Event handlers
  const handleSave = () => {
    setIsLoading(true)
    // Logic here
    setMessage('✓ Saved!')
  }

  // 7. Render
  return (
    <div>
      {/* JSX here */}
    </div>
  )
}
```

### Do's and Don'ts

**DO:**
- ✅ Extract repeated logic into utilities
- ✅ Use hooks for stateful logic
- ✅ Type all props and return values
- ✅ Keep components focused and small
- ✅ Use meaningful variable names
- ✅ Add JSDoc comments for public functions

**DON'T:**
- ❌ Put utility functions in components
- ❌ Define constants inside components (unless absolutely necessary)
- ❌ Create duplicate type definitions
- ❌ Use `any` type (use `unknown` or proper typing)
- ❌ Create mega-components (>300 lines)
- ❌ Hardcode values repeated in code

---

## 📝 Code Quality Standards

### TypeScript

```typescript
// ✅ Always use types
function calculateTotal(items: Item[], tax: number): number {
  return items.reduce((sum, item) => sum + item.price, 0) * (1 + tax)
}

// ❌ Never use any
function calculateTotal(items: any, tax: any): any { }
```

### Function Length

```typescript
// ✅ Keep functions focused (ideally < 50 lines)
export const validateOrder = (order: Order): ValidationError[] => {
  const errors = []
  if (!order.symbol) errors.push('Symbol required')
  if (order.shares <= 0) errors.push('Shares must be positive')
  return errors
}

// ❌ Don't create massive functions
export const processOrderData = (data: any) => {
  // 200+ lines of mixed logic
}
```

### Line Length

```typescript
// ✅ Keep lines under 100 characters
const message = `Total P&L: ${formatCurrency(total)}`

// ❌ Avoid long lines
const message = `Your portfolio total profit and loss is: ${formatCurrency(totalProfitAndLossAmount)}`;
```

### Naming

```typescript
// ✅ Clear, descriptive names
const calculateOrderTotal = (items: Item[]) => { }
const isOrderValid = (order: Order) => boolean
const TRADING_MODES = ['paper', 'live']

// ❌ Cryptic or vague names
const calc = (i: any) => { }
const ok = (o: any) => boolean
const MODES = ['p', 'l']
```

---

## 🔄 Refactoring Checklist

When code starts to feel messy, refactor using this checklist:

- [ ] **Consolidate Duplicates**
  - Find repeated code patterns
  - Extract to utility or component

- [ ] **Organize Imports**
  - External libraries first
  - Local imports second
  - Organized by feature

- [ ] **Review File Size**
  - Split if > 300 lines
  - Separate concerns

- [ ] **Check Type Safety**
  - No `any` types
  - All parameters typed
  - All return values typed

- [ ] **Review Names**
  - Clear and descriptive
  - Consistent with codebase
  - Self-documenting

- [ ] **Remove Dead Code**
  - Unused imports
  - Unused variables
  - Commented-out code

---

## 📚 Documentation Requirements

### Required Documentation

1. **JSDoc for Public Functions**
```typescript
/**
 * Calculate P&L and P&L percentage for a position
 * @param currentValue - Current position value
 * @param shares - Number of shares held
 * @param entryPrice - Original entry price per share
 * @returns Object with pnl and pnlPercent
 */
export const calculatePnL = (
  currentValue: number,
  shares: number,
  entryPrice: number
): { pnl: number; pnlPercent: number } => { /* ... */ }
```

2. **Comments for Complex Logic**
```typescript
// Only highlight if confidence > threshold
const importantSignals = signals.filter(s => s.confidence > 0.8)
```

3. **README.md for Features**
- Feature description
- Usage examples
- Configuration options

---

## 🚀 Performance Guidelines

### Optimization Rules

1. **Don't Optimize Prematurely**
   - Write clear code first
   - Profile before optimizing
   - Fix real bottlenecks

2. **Common Optimizations**
```typescript
// ✅ Memoize expensive calculations
const stats = useMemo(() => calculatePortfolioStats(positions), [positions])

// ✅ Memoize components
const MemoizedCard = memo(PositionCard)

// ✅ Use constants for arrays used in deps
const assets = useMemo(() => ASSET_OPTIONS, [])
```

3. **Avoid These**
```typescript
// ❌ Creating objects in render
<Component style={{ color: 'red' }} />  // Instead: use className

// ❌ Creating functions in render
<button onClick={() => handleClick()}>  // Instead: use callback ref
```

---

## 🧪 Testing Practices

### What to Test

- ✅ Utility functions
- ✅ Calculations
- ✅ Type validation
- ✅ Error cases
- ✅ Edge cases

### Test Organization
```typescript
// tests/utils/calculations.test.ts
describe('calculatePnL', () => {
  it('should calculate positive P&L correctly', () => {
    const result = calculatePnL(1000, 10, 90)
    expect(result.pnl).toBe(100)
  })
})
```

---

## ⚠️ Common Mistakes to Avoid

### Mistake 1: Duplicating Logic
```typescript
// ❌ BAD: Same logic in multiple files
// In PositionCard.tsx
const pnl = value - shares * price

// In Dashboard.tsx
const pnl = value - shares * price

// ✅ GOOD: Shared utility
import { calculatePnL } from '../utils/calculations'
```

### Mistake 2: Duplicating Constants
```typescript
// ❌ BAD: Duplicated in multiple files
const ASSETS = ['BTC', 'ETH', 'SPY']

// ✅ GOOD: Single source of truth
import { ASSET_OPTIONS } from '../constants/options'
```

### Mistake 3: Unclear Component Responsibilities
```typescript
// ❌ BAD: Does too many things
function OrderWidget() {
  // Fetches data, validates, calculates, renders, etc.
}

// ✅ GOOD: Single responsibility
function OrderWidget() {
  const orders = useOrders()
  const { valid, errors } = useValidation(orders)
  return <OrderDisplay orders={orders} />
}
```

### Mistake 4: No Type Safety
```typescript
// ❌ BAD: No types
function processData(data) {
  return data.map(d => d.value)
}

// ✅ GOOD: Full types
function processData(data: DataItem[]): number[] {
  return data.map((d) => d.value)
}
```

### Mistake 5: Magic Numbers
```typescript
// ❌ BAD: What does 0.8 mean?
const important = signals.filter(s => s.confidence > 0.8)

// ✅ GOOD: Clear constant
const SIGNAL_CONFIDENCE_THRESHOLD = 0.8
const important = signals.filter(s => s.confidence > SIGNAL_CONFIDENCE_THRESHOLD)
```

---

## 🎯 Code Review Checklist

Before committing code, verify:

- [ ] **DRY**: No duplicate logic, constants, or types
- [ ] **Organization**: Code in correct folder/file
- [ ] **Naming**: Clear, consistent, descriptive
- [ ] **Types**: All parameters and returns typed
- [ ] **Documentation**: Functions have JSDoc
- [ ] **Size**: Components < 300 lines, functions < 50 lines
- [ ] **Tests**: New logic has tests
- [ ] **Performance**: No unnecessary renders or calculations
- [ ] **Accessibility**: Proper semantic HTML, ARIA labels
- [ ] **Linting**: Passes ruff/eslint without errors

---

## 📊 Metrics to Track

Monitor these to maintain code health:

- **Code Duplication**: Should be < 1%
- **File Size**: Avg component < 200 lines
- **Test Coverage**: Aim for > 80%
- **Type Coverage**: 100% (no `any` types)
- **Linting Score**: 0 errors, 0 warnings

---

## 🔄 Workflow for New Features

1. **Design Phase**
   - [ ] Define requirements
   - [ ] Check if logic exists
   - [ ] Plan component structure
   - [ ] Identify reusable pieces

2. **Implementation Phase**
   - [ ] Extract utilities first
   - [ ] Create constants for config
   - [ ] Define types
   - [ ] Build components using utilities

3. **Testing Phase**
   - [ ] Test utilities
   - [ ] Test components
   - [ ] Test integration
   - [ ] Manual QA

4. **Review Phase**
   - [ ] Self-review with checklist
   - [ ] Check for duplicates
   - [ ] Verify organization
   - [ ] Confirm documentation

5. **Commit Phase**
   - [ ] Write clear commit message
   - [ ] Reference any issues
   - [ ] Run linter/tests
   - [ ] Commit with confidence

---

## 💬 Common Patterns

### Pattern 1: Feature with Utility + Hook + Component
```
Step 1: Create util function
        frontend/src/utils/myFeature.ts
        
Step 2: Create custom hook
        frontend/src/hooks/useMyFeature.ts
        
Step 3: Use in component
        frontend/src/components/MyFeature.tsx
```

### Pattern 2: Reusable Component
```
Step 1: Create component
        frontend/src/components/common/MyComponent.tsx
        
Step 2: Define prop interface
        Extend CloseableProps or common base types
        
Step 3: Export and use
        import MyComponent from '../components/common/MyComponent'
```

### Pattern 3: Configuration Options
```
Step 1: Add to constants/options.ts
        export const MY_OPTIONS = [...]
        
Step 2: Use in components
        import { MY_OPTIONS } from '../constants/options'
```

---

## 🎓 Learning Resources

### Within This Codebase
- `CLEANUP_QUICK_REFERENCE.md` - Quick reference for utilities
- `CLEANUP_IMPLEMENTATION_COMPLETE.md` - Implementation details
- Existing components - Study patterns in well-organized files

### Best Practices
- TypeScript Handbook: https://www.typescriptlang.org/
- React Documentation: https://react.dev
- Code Organization: https://clean-code-javascript.com/

---

## ✅ Enforcement

This document is **required reading** for all development:

- ✅ **New Features**: Follow all guidelines
- ✅ **Bug Fixes**: Follow all guidelines
- ✅ **Refactoring**: Follow all guidelines
- ✅ **Code Review**: Check against this document

---

## 📝 Questions?

When in doubt:
1. Check existing patterns in the codebase
2. Refer to this document
3. Ask yourself: "Is there a better way to organize this?"
4. Prioritize: **clarity > cleverness**

---

Generated: November 2, 2025
Status: Active Standards
Compliance: Required for all development
Last Updated: Post-Cleanup Phase 3
