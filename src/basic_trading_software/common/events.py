"""Lightweight async event bus for decoupled messaging."""

from __future__ import annotations

import asyncio
from collections import defaultdict
from collections.abc import Awaitable, Callable
from typing import Any, DefaultDict, Dict, List

EventHandler = Callable[[Dict[str, Any]], Awaitable[None]]


class EventBus:
    """Publish/subscribe event dispatcher."""

    def __init__(self) -> None:
        self._subscribers: DefaultDict[str, List[EventHandler]] = defaultdict(list)
        self._lock = asyncio.Lock()

    async def subscribe(self, event_type: str, handler: EventHandler) -> None:
        """Register handler for event type."""

        async with self._lock:
            self._subscribers[event_type].append(handler)

    async def unsubscribe(self, event_type: str, handler: EventHandler) -> None:
        """Remove handler."""

        async with self._lock:
            handlers = self._subscribers[event_type]
            if handler in handlers:
                handlers.remove(handler)

    async def publish(self, event_type: str, payload: Dict[str, Any]) -> None:
        """Send event to subscribers."""

        async with self._lock:
            handlers = list(self._subscribers[event_type])

        coros = [handler(payload) for handler in handlers]
        if coros:
            await asyncio.gather(*coros, return_exceptions=False)

