"""Equity broker adapter (Alpaca example)."""

from __future__ import annotations

from typing import Any, AsyncIterator, Dict, List, Optional

import aiohttp
from loguru import logger

from basic_trading_software.common.config import get_settings
from basic_trading_software.common.credentials import CredentialStore

from .base import BrokerAdapter, OrderRequest, OrderResponse, PositionSnapshot


class AlpacaAdapter(BrokerAdapter):
    """Minimal Alpaca REST/WebSocket client."""

    def __init__(self, credentials: CredentialStore) -> None:
        settings = get_settings().broker_equity
        self.venue = "alpaca"
        self._base_url = settings.base_url.rstrip("/")
        self._credentials = credentials
        self._api_key = settings.api_key or ""
        self._api_secret = settings.api_secret or ""
        self._session: Optional[aiohttp.ClientSession] = None

    async def authenticate(self) -> None:
        stored_key, stored_secret = self._credentials.get(self.venue)
        api_key = stored_key or self._api_key
        api_secret = stored_secret or self._api_secret
        if not self._session:
            headers = {
                "APCA-API-KEY-ID": api_key or "",
                "APCA-API-SECRET-KEY": api_secret or "",
            }
            self._session = aiohttp.ClientSession(headers=headers)
        logger.info("[alpaca] Session initialised")
        self._api_key = api_key or ""
        self._api_secret = api_secret or ""

    async def place_order(self, order: OrderRequest) -> OrderResponse:
        await self.authenticate()
        assert self._session is not None
        payload = {
            "symbol": order.symbol,
            "qty": order.quantity,
            "side": order.side.lower(),
            "type": order.order_type.lower(),
            "time_in_force": order.time_in_force.lower(),
        }
        if order.client_order_id:
            payload["client_order_id"] = order.client_order_id
        if order.extra:
            payload.update(order.extra)

        async with self._session.post(f"{self._base_url}/orders", json=payload) as resp:
            data = await resp.json()
            return OrderResponse(
                order_id=str(data.get("id", "")),
                status=str(data.get("status", "")),
                filled_qty=float(data.get("filled_qty", 0)),
                avg_price=float(data["filled_avg_price"]) if data.get("filled_avg_price") else None,
                raw=data,
            )

    async def cancel_order(self, order_id: str) -> None:
        await self.authenticate()
        assert self._session is not None
        async with self._session.delete(f"{self._base_url}/orders/{order_id}"):
            logger.info(f"[alpaca] Cancelled order {order_id}")

    async def fetch_positions(self) -> List[PositionSnapshot]:
        await self.authenticate()
        assert self._session is not None
        async with self._session.get(f"{self._base_url}/positions") as resp:
            data = await resp.json()
            positions: List[PositionSnapshot] = []
            for entry in data:
                positions.append(
                    PositionSnapshot(
                        symbol=str(entry["symbol"]),
                        quantity=float(entry["qty"]),
                        average_price=float(entry["avg_entry_price"]),
                        venue=self.venue,
                    )
                )
            return positions

    async def stream_market_data(self, symbol: str) -> AsyncIterator[Dict[str, Any]]:
        """Placeholder generator until full data API is wired."""

        raise NotImplementedError("Use data providers module for Alpaca market data streaming.")

    async def close(self) -> None:
        if self._session:
            await self._session.close()
            self._session = None

    async def update_credentials(self, api_key: str | None, api_secret: str | None) -> None:
        self._api_key = api_key or ""
        self._api_secret = api_secret or ""
        if self._session:
            await self._session.close()
            self._session = None
