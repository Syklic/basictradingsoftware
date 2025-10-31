"""Application bootstrap."""

from __future__ import annotations

import asyncio

from loguru import logger
from PySide6.QtWidgets import QApplication
from qasync import QEventLoop
from qt_material import apply_stylesheet

from basic_trading_software.common.config import get_settings
from basic_trading_software.common.credentials import CredentialStore
from basic_trading_software.common.events import EventBus
from basic_trading_software.common.logging import configure_logging
from basic_trading_software.data.providers import LiveDataProvider
from basic_trading_software.ml.strategy import MLStrategy
from basic_trading_software.trading.adapters.crypto import BinanceAdapter
from basic_trading_software.trading.adapters.equity import AlpacaAdapter
from basic_trading_software.trading.engine import TradingEngine
from basic_trading_software.trading.staking import StakingService
from basic_trading_software.ui.main_window import MainWindow


def main() -> None:
    """Launch the application."""

    configure_logging()
    settings = get_settings()
    logger.info(f"[app] Starting Basic Trading Software in {settings.environment} mode")

    app = QApplication([])
    apply_stylesheet(app, theme="dark_teal.xml")

    loop = QEventLoop(app)
    asyncio.set_event_loop(loop)
    app.aboutToQuit.connect(loop.stop)

    credential_store = CredentialStore()
    event_bus = EventBus()
    adapters = [
        AlpacaAdapter(credentials=credential_store),
        BinanceAdapter(credentials=credential_store),
    ]
    trading_engine = TradingEngine(event_bus, adapters=adapters)
    strategy = MLStrategy(event_bus)
    data_provider = LiveDataProvider()
    staking_service = StakingService(event_bus)

    window = MainWindow(
        event_bus=event_bus,
        data_provider=data_provider,
        credential_store=credential_store,
    )
    window.show()

    async def start_components() -> None:
        await trading_engine.start()
        await strategy.start()

    with loop:
        loop.create_task(window.initialize())
        loop.create_task(start_components())
        loop.create_task(staking_service.start())
        loop.run_forever()
