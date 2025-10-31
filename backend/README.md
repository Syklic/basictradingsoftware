# Basic Trading Software - Backend API

FastAPI server powering the trading dashboard with real-time WebSocket updates and REST endpoints.

## Quick Start

```bash
# Install dependencies
uv pip install -r requirements.txt

# Run development server (auto-reload on changes)
python -m uvicorn src.api.main:app --reload --host 0.0.0.0 --port 8000

# Or from root: pnpm backend:dev
```

**API Documentation** (auto-generated):
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Architecture

```
backend/
├── src/
│   └── api/
│       ├── __init__.py
│       └── main.py          # FastAPI application
├── requirements.txt
└── pyproject.toml
```

## API Endpoints

### REST Endpoints

#### `GET /api/health`
Health check endpoint.
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

#### `GET /api/portfolio`
Get current portfolio/account data.
```json
{
  "total_value": 10000.00,
  "buying_power": 5000.00,
  "positions": [],
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

#### `GET /api/orders`
Get recent orders.
```json
{
  "orders": [
    {
      "id": "order_123",
      "symbol": "AAPL",
      "side": "BUY",
      "quantity": 10,
      "price": 150.00,
      "timestamp": "2025-01-15T09:00:00.000Z"
    }
  ],
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

#### `GET /api/signals`
Get active ML trading signals.
```json
{
  "signals": [
    {
      "symbol": "BTC/USD",
      "direction": "BUY",
      "confidence": 0.85,
      "model": "LSTM",
      "timestamp": "2025-01-15T10:30:00.000Z"
    }
  ],
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

### WebSocket Endpoint

#### `WS /ws/updates`
Real-time streaming of trading updates.

**Connect:**
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/updates');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data); // { type: 'ack', timestamp: ... }
};

ws.send(JSON.stringify({ action: 'subscribe', channel: 'prices' }));
```

## Features

- ✅ **Async I/O**: Non-blocking with Python asyncio
- ✅ **Real-time**: WebSocket support for live updates
- ✅ **CORS**: Enabled for web and Electron access
- ✅ **Auto-docs**: Swagger UI and ReDoc included
- ✅ **Type hints**: Full TypeScript-like type checking

## Integration with Trading Engine

The backend can import and use the trading engine from `src/basic_trading_software/`:

```python
# src/api/main.py
import sys
sys.path.insert(0, '../')

from basic_trading_software.trading.engine import TradingEngine
from basic_trading_software.ml.strategy import SignalGenerator

engine = TradingEngine()
signal_gen = SignalGenerator()

@app.get("/api/signals")
async def get_signals():
    signals = signal_gen.generate_signals()
    return {"signals": signals}
```

## Development

### Adding New Endpoints

```python
# src/api/main.py
@app.get("/api/my-endpoint")
async def my_endpoint():
    """My endpoint description."""
    return {"data": "value"}

@app.post("/api/place-order")
async def place_order(order: OrderSchema):
    """Place a trading order."""
    # Logic here
    return {"status": "success", "order_id": 123}
```

### Testing

```bash
# Install dev dependencies
uv pip install -r requirements.txt -e .[dev]

# Run tests
pytest

# Test with coverage
pytest --cov=src
```

## Deployment

### Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY backend/src ./src
EXPOSE 8000

CMD ["uvicorn", "src.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables

```bash
# .env
LOG_LEVEL=INFO
DATABASE_URL=postgresql://user:pass@localhost/db
REDIS_URL=redis://localhost:6379
```

## Troubleshooting

**Port 8000 in use:**
```bash
lsof -i :8000
kill -9 <PID>
```

**Module import errors:**
```bash
# Ensure PYTHONPATH includes root
export PYTHONPATH="${PYTHONPATH}:$(pwd)/.."
```

**Dependencies not found:**
```bash
uv pip install --force-reinstall -r requirements.txt
```

## Learn More

- [FastAPI Docs](https://fastapi.tiangolo.com)
- [Uvicorn Docs](https://www.uvicorn.org)
- [WebSocket Protocol](https://en.wikipedia.org/wiki/WebSocket)
