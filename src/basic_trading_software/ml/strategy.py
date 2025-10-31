"""Strategy layer connecting ML outputs to the event bus."""

from __future__ import annotations

import asyncio
from typing import Dict

import torch
from loguru import logger

from basic_trading_software.common.events import EventBus
from basic_trading_software.common.config import get_settings
from basic_trading_software.ml.pipeline import build_sequence_dataset, create_default_model, predict_direction


class MLStrategy:
    """Continuously produces trade signals from streaming features."""

    def __init__(self, event_bus: EventBus) -> None:
        self._event_bus = event_bus
        settings = get_settings().model
        self._model = create_default_model(input_size=5)
        self._model.eval()
        self._sequence_window = 32
        self._model_name = settings.default_model_name
        self._task: asyncio.Task[None] | None = None

    async def start(self) -> None:
        """Spin up processing loop."""

        if self._task is not None:
            return
        self._task = asyncio.create_task(self._run(), name="ml-strategy")

    async def _run(self) -> None:
        """Mock inference loop emitting demo signals."""

        logger.info("[strategy] Starting ML strategy loop")
        while True:
            await asyncio.sleep(5)
            mock_bars = [{"open": 100, "high": 101, "low": 99, "close": 100.5, "volume": 1_000_000}]
            sequences = build_sequence_dataset(mock_bars, window=min(self._sequence_window, len(mock_bars)))
            if sequences.nelement() == 0:
                continue
            probs, _preds = predict_direction(self._model, sequences)
            confidence = float(torch.mean(probs).item())
            signal: Dict[str, object] = {
                "symbol": "DEMO",
                "side": "BUY" if confidence > 0.5 else "SELL",
                "confidence": confidence,
                "model": self._model_name,
            }
            await self._event_bus.publish("signal.generated", signal)
