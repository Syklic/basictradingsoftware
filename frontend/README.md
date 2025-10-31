# Basic Trading Software - Frontend

Modern React + TypeScript dashboard with Electron desktop app and remote web access.

## Quick Start

```bash
# Install dependencies
pnpm install

# Development mode
pnpm dev

# Electron app
pnpm electron:dev

# Build for production
pnpm build
pnpm electron:build
```

## Architecture

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── Navbar.tsx       # Top navigation
│   │   ├── PortfolioCard.tsx    # Portfolio display
│   │   ├── OrdersPanel.tsx      # Orders list
│   │   └── SignalsPanel.tsx     # Signals display
│   ├── App.tsx              # App wrapper
│   ├── main.tsx             # React entry point
│   └── index.css            # Global styles
├── electron/
│   └── main.ts              # Electron main process
├── public/                  # Static assets
├── index.html              # HTML template
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

## Technologies

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast bundler & dev server
- **TailwindCSS** - Utility-first CSS
- **Shadcn/ui** - Component library
- **Lucide React** - Icons
- **Recharts** - Charts & visualization
- **Zustand** - State management
- **TanStack Query** - Data fetching
- **Electron** - Desktop app wrapper

## Running Modes

### 1. Web Browser (Development)

```bash
pnpm dev

# App available at: http://localhost:5173
```

**Features:**
- Hot module replacement (HMR)
- Fast refresh on code changes
- Browser DevTools
- Remote access possible

### 2. Desktop App (Electron)

```bash
# Terminal 1: Start backend
pnpm backend:dev

# Terminal 2: Start Electron
pnpm electron:dev
```

**Features:**
- Native window
- System menu
- File system access
- System tray integration
- Auto-updates (when deployed)

### 3. Production Build

```bash
# Web build
pnpm build
# Output: dist/

# Electron app + installers
pnpm electron:build
# Output: dist-electron/ + installers (dmg, exe, deb, etc.)
```

## Key Components

### Dashboard (`Dashboard.tsx`)
Main dashboard layout that:
- Fetches portfolio, orders, and signals data
- Polls backend every 5 seconds
- Displays cards with key metrics
- Responsive grid layout

```tsx
<Dashboard />
```

### Portfolio Card (`PortfolioCard.tsx`)
Shows:
- Total portfolio value
- Buying power
- Color-coded indicators

### Orders Panel (`OrdersPanel.tsx`)
Lists recent trades with:
- Symbol
- Buy/Sell side
- Quantity and price
- Timestamp

### Signals Panel (`SignalsPanel.tsx`)
Displays ML trading signals:
- Asset symbol
- Buy/Sell direction
- Confidence level
- Model name

### Navbar (`Navbar.tsx`)
Top navigation with:
- App title and logo
- Connection status indicator
- Settings menu (future)

## State Management

Using **Zustand** for minimal boilerplate:

```tsx
import create from 'zustand'

const useStore = create((set) => ({
  portfolio: null,
  setPortfolio: (data) => set({ portfolio: data }),
}))
```

## API Communication

### REST Endpoints

The app fetches from `http://localhost:8000/api/`:

```tsx
const response = await fetch('http://localhost:8000/api/portfolio')
const data = await response.json()
```

### WebSocket

Real-time updates via `ws://localhost:8000/ws/updates`:

```tsx
const ws = new WebSocket('ws://localhost:8000/ws/updates')
ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  // Handle real-time update
}
```

## Styling

### TailwindCSS

All styling uses Tailwind utility classes:

```tsx
<div className="flex items-center justify-between px-6 py-4">
  <h1 className="text-xl font-bold">Title</h1>
</div>
```

### CSS Variables

Custom theme variables in `index.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.6%;
  --accent: 0 0% 9.0%;
}

.dark {
  --background: 0 0% 3.6%;
  --foreground: 0 0% 98.2%;
}
```

### Dark Mode

Add `dark` class to `<html>` element:

```tsx
document.documentElement.classList.add('dark')
```

## Development Workflow

### Creating a New Component

```tsx
// src/components/MyComponent.tsx
interface MyComponentProps {
  title: string
  value: number
}

export default function MyComponent({ title, value }: MyComponentProps) {
  return (
    <div className="p-4 border border-border rounded-lg">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  )
}
```

### Adding an API Endpoint

Backend changes in `backend/src/api/main.py`:

```python
@app.get("/api/my-data")
async def get_my_data():
    return {"data": "value"}
```

Frontend usage:

```tsx
const [data, setData] = useState(null)

useEffect(() => {
  fetch('http://localhost:8000/api/my-data')
    .then(r => r.json())
    .then(setData)
}, [])
```

### Updating Styles

1. Modify `src/index.css` for global styles
2. Use `className` prop with Tailwind utilities
3. For components, use `tailwind.config.js`

## Building & Deployment

### Web Deployment

```bash
# Build static files
pnpm build

# Deploy dist/ to hosting:
# - Netlify
# - Vercel
# - AWS S3 + CloudFront
# - GitHub Pages
```

### Electron App

```bash
# Build installers
pnpm electron:build

# Creates:
# - Windows: .exe installer
# - macOS: .dmg installer
# - Linux: .deb package
```

### Docker

```dockerfile
FROM node:18 AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm i -g pnpm && pnpm install
COPY . .
RUN pnpm build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Troubleshooting

### Port 5173 in use
Vite automatically uses the next available port. Check console output.

### Module not found
```bash
# Clear cache and reinstall
rm -rf node_modules
pnpm install
```

### TypeScript errors
```bash
# Type check
pnpm type-check

# ESLint
pnpm lint
```

### Electron won't start
- Ensure backend is running (`pnpm backend:dev`)
- Check console for errors: `pnpm electron:dev 2>&1 | grep -i error`

### Hot reload not working
- Restart dev server
- Check that `vite.config.ts` has `react()` plugin

## Performance Tips

### Code Splitting

Vite handles this automatically. For manual splitting:

```tsx
const HeavyComponent = lazy(() => import('./HeavyComponent'))

<Suspense fallback={<Skeleton />}>
  <HeavyComponent />
</Suspense>
```

### Image Optimization

Place images in `public/` and reference with relative paths:

```tsx
<img src="/images/logo.png" alt="Logo" />
```

### Memoization

Use `memo` for expensive components:

```tsx
const PortfolioCard = memo(function PortfolioCard({ data }) {
  return <div>{data.value}</div>
})
```

## Learn More

- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org)
- [Vite Guide](https://vitejs.dev/guide)
- [TailwindCSS](https://tailwindcss.com)
- [Electron Docs](https://www.electronjs.org)
