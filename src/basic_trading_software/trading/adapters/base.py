"""Shared broker/exchange adapter interfaces."""

from __future__ import annotations

import abc
from dataclasses import dataclass
from typing import Any, Dict, List, Optional


@dataclass
class OrderRequest:
    symbol: str
    side: str  # BUY / SELL
    quantity: float
    order_type: str = "MARKET"
    time_in_force: str = "GTC"
    client_order_id: Optional[str] = None
    extra: Dict[str, Any] | None = None


@dataclass
class OrderResponse:
    order_id: str
    status: str
    filled_qty: float
    avg_price: float | None = None
    raw: Dict[str, Any] | None = None


@dataclass
class PositionSnapshot:
    symbol: str
    quantity: float
    average_price: float
    venue: str


class BrokerAdapter(abc.ABC):
    """Abstract interface for all trading adapters."""

    venue: str

    @abc.abstractmethod
    async def authenticate(self) -> None:
        """Perform any required authentication handshake."""

    @abc.abstractmethod
    async def place_order(self, order: OrderRequest) -> OrderResponse:
        """Submit an order to the venue."""

    @abc.abstractmethod
    async def cancel_order(self, order_id: str) -> None:
        """Cancel an existing order."""

    @abc.abstractmethod
    async def fetch_positions(self) -> List[PositionSnapshot]:
        """Retrieve current open positions."""

    @abc.abstractmethod
    async def stream_market_data(self, symbol: str) -> Any:
        """Return async iterator for real-time data (implementation-specific)."""
