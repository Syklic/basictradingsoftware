"""Staking orchestration module."""

from __future__ import annotations

import asyncio
from dataclasses import dataclass
from typing import Dict, Optional

import aiohttp
from loguru import logger

from basic_trading_software.common.config import get_settings
from basic_trading_software.common.events import EventBus


@dataclass
class StakingPosition:
    asset: str
    amount: float
    apr: float
    provider: str
    status: str = "staked"


class StakingService:
    """Handles staking/unstaking workflow for supported providers."""

    def __init__(self, event_bus: EventBus) -> None:
        self._event_bus = event_bus
        settings = get_settings().staking
        self._provider = settings.provider
        self._base_url = settings.api_base_url.rstrip("/")
        self._cooldown_days = settings.cooldown_days
        self._auto_compound = settings.auto_compound
        self._session: Optional[aiohttp.ClientSession] = None
        self._lock = asyncio.Lock()

    async def start(self) -> None:
        if not self._session:
            self._session = aiohttp.ClientSession()
        await self._event_bus.subscribe("staking.requested", self._handle_staking_request)
        await self._event_bus.subscribe("staking.unstake_requested", self._handle_unstake_request)
        logger.info(f"[staking] Service ready for provider {self._provider}")

    async def stop(self) -> None:
        if self._session:
            await self._session.close()
            self._session = None

    async def _handle_staking_request(self, payload: Dict[str, object]) -> None:
        asset = str(payload.get("asset"))
        amount = float(payload.get("amount", 0))
        async with self._lock:
            position = await self._stake(asset, amount)
            await self._event_bus.publish(
                "staking.position_updated",
                {
                    "asset": position.asset,
                    "amount": position.amount,
                    "apr": position.apr,
                    "provider": position.provider,
                    "status": position.status,
                },
            )

    async def _handle_unstake_request(self, payload: Dict[str, object]) -> None:
        asset = str(payload.get("asset"))
        amount = float(payload.get("amount", 0))
        async with self._lock:
            position = await self._unstake(asset, amount)
            await self._event_bus.publish(
                "staking.position_updated",
                {
                    "asset": position.asset,
                    "amount": position.amount,
                    "apr": position.apr,
                    "provider": position.provider,
                    "status": position.status,
                },
            )

    async def _stake(self, asset: str, amount: float) -> StakingPosition:
        """Placeholder stake call; integrate with provider REST."""

        logger.info(f"[staking] Staking {amount} {asset} via {self._provider}")
        apr = await self._fetch_current_apr(asset)
        return StakingPosition(asset=asset, amount=amount, apr=apr, provider=self._provider)

    async def _unstake(self, asset: str, amount: float) -> StakingPosition:
        logger.info(f"[staking] Unstaking {amount} {asset} via {self._provider}")
        apr = await self._fetch_current_apr(asset)
        return StakingPosition(
            asset=asset,
            amount=amount,
            apr=apr,
            provider=self._provider,
            status=f"cooldown ({self._cooldown_days}d)",
        )

    async def _fetch_current_apr(self, asset: str) -> float:
        if not self._session:
            self._session = aiohttp.ClientSession()
        url = f"{self._base_url}/apr/{asset.lower()}"
        try:
            async with self._session.get(url, timeout=5) as resp:
                data = await resp.json()
                return float(data.get("apr", 0.0))
        except aiohttp.ClientError:
            logger.warning("[staking] APR fetch failed; defaulting to 0")
            return 0.0

