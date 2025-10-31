"""FastAPI application for Basic Trading Software dashboard."""

import asyncio
import json
from datetime import datetime
from typing import Set

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Basic Trading Software API",
    description="Real-time trading dashboard backend",
    version="0.1.0",
)

# Enable CORS for desktop app and remote access
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket manager for broadcasting updates
class ConnectionManager:
    """Manages active WebSocket connections."""

    def __init__(self):
        self.active_connections: Set[WebSocket] = set()

    async def connect(self, websocket: WebSocket):
        """Accept and register a new WebSocket connection."""
        await websocket.accept()
        self.active_connections.add(websocket)

    def disconnect(self, websocket: WebSocket):
        """Remove a disconnected WebSocket."""
        self.active_connections.discard(websocket)

    async def broadcast(self, message: dict):
        """Broadcast a message to all connected clients."""
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass


manager = ConnectionManager()


# REST API Endpoints
@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
    }


@app.get("/api/portfolio")
async def get_portfolio():
    """Get current portfolio data (placeholder)."""
    return {
        "total_value": 10000.00,
        "buying_power": 5000.00,
        "positions": [],
        "timestamp": datetime.utcnow().isoformat(),
    }


@app.get("/api/orders")
async def get_orders():
    """Get recent orders (placeholder)."""
    return {
        "orders": [],
        "timestamp": datetime.utcnow().isoformat(),
    }


@app.get("/api/signals")
async def get_signals():
    """Get active trading signals (placeholder)."""
    return {
        "signals": [],
        "timestamp": datetime.utcnow().isoformat(),
    }


# WebSocket Endpoint for Real-time Updates
@app.websocket("/ws/updates")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time trading updates."""
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive and listen for messages
            data = await websocket.receive_text()
            message = json.loads(data)
            # Echo back or handle specific message types
            await websocket.send_json({
                "type": "ack",
                "message": message,
                "timestamp": datetime.utcnow().isoformat(),
            })
    except WebSocketDisconnect:
        manager.disconnect(websocket)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
