"""Market data providers and adapters."""

from __future__ import annotations

import asyncio
from datetime import datetime
from typing import Any, AsyncIterator, Dict, Protocol

from loguru import logger

from basic_trading_software.common.config import get_settings


class Quote(Protocol):
    symbol: str
    bid: float
    ask: float
    timestamp: datetime


class LiveDataProvider:
    """Mock live-stream provider that yields synthetic quotes."""

    def __init__(self) -> None:
        self._settings = get_settings().data
        self._running = False

    async def stream_quotes(self, symbol: str) -> AsyncIterator[Dict[str, Any]]:
        """Yield synthetic quotes to bootstrap UI."""

        logger.info(f"[data] Starting synthetic stream for {symbol}")
        self._running = True
        price = 100.0
        while self._running:
            await asyncio.sleep(1)
            price += 0.5
            yield {
                "symbol": symbol,
                "last": price,
                "bid": price - 0.1,
                "ask": price + 0.1,
                "timestamp": datetime.utcnow().isoformat(),
            }

    def stop(self) -> None:
        """Stop streaming."""

        self._running = False

