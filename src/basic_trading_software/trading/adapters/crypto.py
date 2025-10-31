"""Crypto exchange adapter (Binance example)."""

from __future__ import annotations

import asyncio
import hmac
import time
from hashlib import sha256
from typing import Any, AsyncIterator, Dict, List, Optional

import aiohttp
from aiohttp import ClientSession, ClientWebSocketResponse
from loguru import logger

from basic_trading_software.common.config import get_settings
from basic_trading_software.common.credentials import CredentialStore

from .base import BrokerAdapter, OrderRequest, OrderResponse, PositionSnapshot


class BinanceAdapter(BrokerAdapter):
    """Partial Binance Spot API integration."""

    def __init__(self, credentials: CredentialStore) -> None:
        settings = get_settings().broker_crypto
        self.venue = settings.name
        self._rest_url = settings.rest_base_url.rstrip("/")
        self._ws_url = settings.websocket_url
        self._credentials = credentials
        self._api_key = settings.api_key or ""
        self._api_secret = settings.api_secret or ""
        self._session: Optional[ClientSession] = None

    async def authenticate(self) -> None:
        stored_key, stored_secret = self._credentials.get(self.venue)
        self._api_key = stored_key or self._api_key
        self._api_secret = stored_secret or self._api_secret
        if not self._session:
            headers = {"X-MBX-APIKEY": self._api_key}
            self._session = aiohttp.ClientSession(headers=headers)
        logger.info("[binance] Session initialised")

    async def place_order(self, order: OrderRequest) -> OrderResponse:
        await self.authenticate()
        assert self._session is not None
        params: Dict[str, Any] = {
            "symbol": order.symbol.upper(),
            "side": order.side.upper(),
            "type": order.order_type.upper(),
            "quantity": order.quantity,
            "timestamp": int(time.time() * 1000),
        }
        if order.extra:
            params.update(order.extra)

        params["signature"] = self._sign(params)
        async with self._session.post(f"{self._rest_url}/api/v3/order", params=params) as resp:
            data = await resp.json()
            return OrderResponse(
                order_id=str(data.get("orderId", "")),
                status=str(data.get("status", "")),
                filled_qty=float(data.get("executedQty", 0)),
                avg_price=float(data.get("price", 0)),
                raw=data,
            )

    async def cancel_order(self, order_id: str) -> None:
        await self.authenticate()
        assert self._session is not None
        params = {
            "orderId": order_id,
            "timestamp": int(time.time() * 1000),
        }
        params["signature"] = self._sign(params)
        async with self._session.delete(f"{self._rest_url}/api/v3/order", params=params):
            logger.info(f"[binance] Cancelled order {order_id}")

    async def fetch_positions(self) -> List[PositionSnapshot]:
        await self.authenticate()
        assert self._session is not None
        params = {"timestamp": int(time.time() * 1000)}
        params["signature"] = self._sign(params)
        async with self._session.get(f"{self._rest_url}/api/v3/account", params=params) as resp:
            data = await resp.json()
            balances = data.get("balances", [])
            positions: List[PositionSnapshot] = []
            for entry in balances:
                free = float(entry["free"])
                locked = float(entry["locked"])
                quantity = free + locked
                if quantity == 0:
                    continue
                symbol = entry["asset"]
                positions.append(
                    PositionSnapshot(
                        symbol=symbol,
                        quantity=quantity,
                        average_price=0.0,
                        venue=self.venue,
                    )
                )
            return positions

    async def stream_market_data(self, symbol: str) -> AsyncIterator[Dict[str, Any]]:
        await self.authenticate()
        assert self._session is not None
        stream_name = symbol.lower() + "@ticker"
        async with self._session.ws_connect(f"{self._ws_url}/{stream_name}") as ws:
            async for msg in ws:
                if msg.type == aiohttp.WSMsgType.TEXT:
                    yield msg.json()
                elif msg.type == aiohttp.WSMsgType.ERROR:
                    break
                await asyncio.sleep(0)  # Allow event loop to breathe

    async def close(self) -> None:
        if self._session:
            await self._session.close()
            self._session = None

    def _sign(self, params: Dict[str, Any]) -> str:
        query = "&".join(f"{key}={params[key]}" for key in sorted(params))
        signature = hmac.new(self._api_secret.encode(), query.encode(), sha256).hexdigest()
        return signature

    async def update_credentials(self, api_key: str | None, api_secret: str | None) -> None:
        self._api_key = api_key or ""
        self._api_secret = api_secret or ""
        if self._session:
            await self._session.close()
            self._session = None
