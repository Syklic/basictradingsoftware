"""Trading engine coordinating strategies and execution."""

from __future__ import annotations

import asyncio
from dataclasses import dataclass
from typing import Dict

from loguru import logger

from basic_trading_software.common.config import get_settings
from basic_trading_software.common.events import EventBus
from basic_trading_software.trading.adapters.base import BrokerAdapter, OrderRequest, OrderResponse


@dataclass
class Position:
    symbol: str
    quantity: float
    average_price: float


class TradingEngine:
    """Simplified event-driven trading engine."""

    def __init__(self, event_bus: EventBus, adapters: list[BrokerAdapter]) -> None:
        self._event_bus = event_bus
        self._positions: Dict[str, Position] = {}
        self._lock = asyncio.Lock()
        self._adapters = adapters
        self._adapter_map = {adapter.venue.lower(): adapter for adapter in adapters}
        self._paper_mode = True

    async def start(self) -> None:
        """Register to listen for signals."""

        settings = get_settings()
        if settings.trading_mode != "paper":
            logger.warning("[engine] Trading mode set to '%s'; forcing paper execution.", settings.trading_mode)
        self._paper_mode = True

        await self._event_bus.subscribe("signal.generated", self._on_signal)
        await self._event_bus.subscribe("order.cancel", self._on_cancel)
        await self._event_bus.subscribe("settings.credentials_updated", self._on_credentials_updated)

        for adapter in self._adapters:
            try:
                await adapter.authenticate()
            except Exception as exc:  # noqa: BLE001
                logger.error(f"[engine] Adapter {adapter.venue} authentication failed: {exc}")

    async def _on_signal(self, payload: Dict[str, object]) -> None:
        """Handle incoming strategy signals."""

        symbol = str(payload.get("symbol"))
        side = str(payload.get("side"))
        confidence = float(payload.get("confidence", 0.0))
        model = payload.get("model")
        logger.info(f"[engine] Received signal {symbol} {side} confidence={confidence:0.2f}")

        order = OrderRequest(symbol=symbol, side=side, quantity=1)
        response: OrderResponse | None = None
        async with self._lock:
            for adapter in self._adapters:
                try:
                    response = await adapter.place_order(order)
                    logger.info(f"[engine] Routed order to {adapter.venue} -> {response.status}")
                    break
                except Exception as exc:  # noqa: BLE001
                    logger.error(f"[engine] Order failed on {adapter.venue}: {exc}")

            await self._event_bus.publish(
                "order.submitted",
                {
                    "symbol": symbol,
                    "side": side,
                    "size": order.quantity,
                    "status": response.status if response else "rejected",
                    "confidence": confidence,
                    "venue": response.raw.get("exchange") if response and response.raw else None,
                    "model": model,
                },
            )

    async def _on_cancel(self, payload: Dict[str, object]) -> None:
        order_id = str(payload.get("order_id"))
        async with self._lock:
            for adapter in self._adapters:
                try:
                    await adapter.cancel_order(order_id)
                    await self._event_bus.publish(
                        "order.cancelled",
                        {"order_id": order_id, "venue": adapter.venue},
                    )
                    break
                except Exception as exc:  # noqa: BLE001
                    logger.error(f"[engine] Cancel failed on {adapter.venue}: {exc}")

    async def _on_credentials_updated(self, payload: Dict[str, object]) -> None:
        venue = str(payload.get("venue", "")).lower()
        adapter = self._adapter_map.get(venue)
        if not adapter:
            logger.debug("[engine] No adapter registered for venue '%s'", venue)
            return

        updater = getattr(adapter, "update_credentials", None)
        if updater is None:
            logger.debug("[engine] Adapter '%s' does not support credential updates", venue)
            return

        api_key = payload.get("api_key")
        api_secret = payload.get("api_secret")
        try:
            await updater(api_key, api_secret)  # type: ignore[arg-type]
            await adapter.authenticate()
            logger.info("[engine] Refreshed credentials for adapter '%s'", venue)
        except Exception as exc:  # noqa: BLE001
            logger.error(f"[engine] Failed to refresh credentials for {venue}: {exc}")

    def snapshot_positions(self) -> Dict[str, Position]:
        """Return a copy of open positions."""

        return dict(self._positions)
