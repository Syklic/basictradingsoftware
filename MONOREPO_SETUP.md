# Basic Trading Software - Monorepo Setup

Welcome to the new modern architecture! This document explains the monorepo structure and how to get started.

## 📁 Project Structure

```
basictradingsoftware/
├── frontend/                    # React + Electron desktop app
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── App.tsx             # Main app component
│   │   ├── main.tsx            # React entry point
│   │   └── index.css           # Global styles
│   ├── electron/
│   │   └── main.ts             # Electron main process
│   ├── public/                 # Static assets
│   ├── index.html              # HTML entry point
│   ├── package.json            # Frontend dependencies
│   ├── tsconfig.json           # TypeScript config
│   ├── vite.config.ts          # Vite config
│   ├── tailwind.config.js      # Tailwind CSS config
│   └── postcss.config.js       # PostCSS config
│
├── backend/                     # Python FastAPI + Trading Engine
│   ├── src/
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── main.py         # FastAPI application
│   │   └── basic_trading_software/  # (symlink/reference to root src/)
│   ├── requirements.txt         # Python dependencies
│   ├── pyproject.toml          # Python project config
│   └── README.md               # Backend documentation
│
├── src/basic_trading_software/  # Original trading engine (kept for fallback)
│   ├── __main__.py
│   ├── app.py
│   ├── common/
│   ├── data/
│   ├── ml/
│   ├── trading/
│   └── ui/                     # PySide6 UI (fallback)
│
├── docs/                        # Shared documentation
├── config/                      # Runtime configs (credentials.json, etc.)
├── pnpm-workspace.yaml         # Monorepo configuration
├── package.json                # Root scripts
└── README.md                   # Main project README
```

## 🎯 What is a Monorepo?

A **monorepo** is a single Git repository containing multiple independent projects:
- **Frontend**: React app (runs as web + Electron desktop)
- **Backend**: FastAPI API server (Python)
- **Trading Engine**: Python trading logic (shared)

**Benefits:**
✅ Coordinated development between frontend and backend  
✅ Single CI/CD pipeline  
✅ Atomic commits across multiple packages  
✅ Easy code sharing  
✅ Simplified deployment  

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+
- **pnpm** (faster npm alternative): `npm install -g pnpm`
- **Python** 3.11+
- **uv** (Python package manager): `curl -LsSf https://astral.sh/uv/install.sh | sh`

### Installation

```bash
# Install all dependencies
pnpm install

# This installs:
# - Frontend dependencies (React, Vite, Electron, Tailwind, etc.)
# - Backend dependencies (FastAPI, WebSockets, etc.)
```

### Running the App

#### Option 1: Web Browser (Development)
```bash
# Terminal 1 - Start FastAPI backend
pnpm backend:dev
# API runs at http://localhost:8000
# Swagger docs at http://localhost:8000/docs

# Terminal 2 - Start React frontend
pnpm frontend:dev
# App runs at http://localhost:5173
# Open browser to http://localhost:5173
```

#### Option 2: Desktop App (Electron)
```bash
# Terminal 1 - Start FastAPI backend
pnpm backend:dev

# Terminal 2 - Start Electron + dev server
pnpm electron:dev
# Native desktop window opens with hot reload
```

#### Option 3: Fallback - PySide6 GUI
```bash
# Original PyQt desktop app (still available)
python -m basic_trading_software
```

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Vite**: Lightning-fast dev server and bundler
- **TailwindCSS**: Utility-first CSS framework for beautiful UI
- **Lucide React**: Elegant icon library
- **Recharts**: Data visualization for trading charts
- **Zustand**: Lightweight state management
- **TanStack Query**: Real-time data fetching
- **Electron**: Native desktop wrapper

**Key Files:**
- `src/main.tsx` — Entry point
- `src/App.tsx` — Main component with backend connection
- `src/components/` — Dashboard components
- `electron/main.ts` — Electron main process

### Backend (FastAPI + Python)
- **FastAPI**: Modern async web framework
- **WebSockets**: Real-time data streaming
- **CORS**: Enables cross-origin requests for remote access
- **Async/await**: Non-blocking I/O

**Key Endpoints:**
- `GET /api/health` — Health check
- `GET /api/portfolio` — Portfolio data
- `GET /api/orders` — Recent orders
- `GET /api/signals` — ML trading signals
- `WS /ws/updates` — Real-time streaming

**Next Steps:**
1. Connect to trading engine (in `src/basic_trading_software/`)
2. Stream real market data
3. Broadcast ML signals to frontend

### Trading Engine (Python)
Located in `src/basic_trading_software/`:
- ML models for signal generation
- Risk management
- Multi-venue trading (equities, crypto, futures)
- Paper trading by default

The FastAPI backend imports and uses this engine to power live signals.

## 💻 Development Workflow

### Making Changes

**React Component:**
```tsx
// frontend/src/components/MyComponent.tsx
export default function MyComponent() {
  // Component code
}
```

**FastAPI Endpoint:**
```python
# backend/src/api/main.py
@app.get("/api/my-endpoint")
async def my_endpoint():
    return {"data": "value"}
```

**Python Trading Logic:**
```python
# src/basic_trading_software/trading/engine.py
# Changes are reflected in backend when it imports
```

### Building for Production

```bash
# Build frontend for web
pnpm frontend:build
# Output: frontend/dist/

# Build desktop app (Electron + installer)
pnpm electron:build
# Output: frontend/dist-electron/ and installers

# Backend is containerized (Docker coming soon)
```

## 🌐 Remote Access

The app is accessible locally and remotely:

**Local (Desktop):**
```bash
pnpm electron:dev  # Native app with full system access
```

**Local (Web):**
```bash
http://localhost:5173  # Browser access
```

**Remote:**
- Deploy backend to cloud (AWS, DigitalOcean, etc.)
- Update frontend `API_URL` to remote server
- Access dashboard from anywhere

## 🔒 Security Notes

- **Paper Trading**: Default mode (no real money)
- **Credentials**: Stored in `config/credentials.json` (not in git)
- **CORS**: Currently allows all origins (restrict in production)
- **WebSocket**: No authentication yet (add OAuth2/JWT when needed)

## 🛠️ Troubleshooting

### Backend won't start
```bash
# Install Python dependencies
cd backend
uv pip install -r requirements.txt
```

### Frontend won't load
```bash
# Clear node modules and reinstall
rm -rf frontend/node_modules
pnpm install
```

### Port already in use
- Backend (8000): `lsof -i :8000` and kill the process
- Frontend (5173): Vite will use next available port automatically

## 📚 Next Steps

1. **Step 2:** Integrate trading engine → FastAPI backend
2. **Step 3:** Create chart/price update components
3. **Step 4:** Add real market data feeds
4. **Step 5:** Implement WebSocket streaming
5. **Step 6:** Deploy to cloud + package Electron app

## 🔗 Useful Commands

```bash
# Development
pnpm dev                    # Run all services
pnpm backend:dev           # FastAPI only
pnpm frontend:dev          # React dev server only
pnpm electron:dev          # Electron app

# Building
pnpm build                 # Build frontend + backend
pnpm frontend:build        # React app only
pnpm electron:build        # Electron installer

# Linting
pnpm lint                  # TypeScript lint
pnpm type-check            # Type check

# Backend
python -m basic_trading_software  # Original PySide6 app
```

## 📖 Learn More

- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [Electron Documentation](https://www.electronjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com)

---

**Questions?** Check existing GitHub issues or create a new one!
