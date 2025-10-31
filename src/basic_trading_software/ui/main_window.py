"""Primary Qt window with live dashboards."""

from __future__ import annotations

import asyncio
from collections import deque
from datetime import datetime
from typing import Deque, Dict, Iterable, List, Tuple

import pyqtgraph as pg
from loguru import logger
from PySide6.QtCore import Qt
from PySide6.QtGui import QCloseEvent
from PySide6.QtWidgets import (
    QAction,
    QGridLayout,
    QGroupBox,
    QLabel,
    QListWidget,
    QListWidgetItem,
    QMainWindow,
    QProgressBar,
    QTabWidget,
    QWidget,
)

from basic_trading_software.common.events import EventBus
from basic_trading_software.common.credentials import CredentialStore
from basic_trading_software.data.providers import LiveDataProvider
from basic_trading_software.ui.settings_dialog import SettingsDialog


class MainWindow(QMainWindow):
    """Top-level window with a dashboard, strategy view, and activity log."""

    def __init__(
        self,
        event_bus: EventBus,
        data_provider: LiveDataProvider,
        credential_store: CredentialStore,
    ) -> None:
        super().__init__()
        self.setWindowTitle("Basic Trading Software")
        self.resize(1280, 720)

        self._event_bus = event_bus
        self._data_provider = data_provider
        self._credential_store = credential_store
        self._settings_dialog: SettingsDialog | None = None
        self._tasks: List[asyncio.Task[None]] = []

        self._price_points: Deque[Tuple[float, float]] = deque(maxlen=240)
        self._symbol = "DEMO"

        self._orders_list = QListWidget()
        self._price_label = QLabel("--")
        self._spread_label = QLabel("-- / --")
        self._timestamp_label = QLabel("--:--:--")
        self._confidence_bar = QProgressBar()
        self._confidence_bar.setRange(0, 100)
        self._staking_list = QListWidget()

        self._chart_widget = pg.PlotWidget()
        self._chart_widget.setBackground("#121212")
        self._chart_widget.setLabel("left", "Last Price")
        self._chart_widget.setLabel("bottom", "Time")
        self._price_curve = self._chart_widget.plot(pen=pg.mkPen("#00e676", width=2))

        self.setCentralWidget(self._build_tabs())
        self._build_menus()

    def _build_tabs(self) -> QWidget:
        tabs = QTabWidget()
        tabs.addTab(self._build_dashboard_tab(), "Dashboard")
        tabs.addTab(self._build_strategy_tab(), "Strategy")
        tabs.addTab(self._build_activity_tab(), "Activity")
        tabs.addTab(self._build_staking_tab(), "Staking")
        return tabs

    def _build_dashboard_tab(self) -> QWidget:
        widget = QWidget()
        layout = QGridLayout(widget)
        layout.setColumnStretch(0, 1)
        layout.setColumnStretch(1, 2)

        header_group = QGroupBox("Live Quote")
        header_layout = QGridLayout(header_group)
        header_layout.addWidget(QLabel("Symbol:"), 0, 0)
        symbol_value = QLabel(self._symbol)
        symbol_value.setStyleSheet("font-size: 22px; font-weight: 600;")
        header_layout.addWidget(symbol_value, 0, 1)

        header_layout.addWidget(QLabel("Last:"), 1, 0)
        self._price_label.setStyleSheet("font-size: 28px; font-weight: 700;")
        header_layout.addWidget(self._price_label, 1, 1)

        header_layout.addWidget(QLabel("Bid / Ask:"), 2, 0)
        self._spread_label.setStyleSheet("font-size: 18px;")
        header_layout.addWidget(self._spread_label, 2, 1)

        header_layout.addWidget(QLabel("Updated:"), 3, 0)
        header_layout.addWidget(self._timestamp_label, 3, 1)

        header_layout.addWidget(QLabel("Signal Confidence:"), 4, 0)
        self._confidence_bar.setFormat("%p%")
        header_layout.addWidget(self._confidence_bar, 4, 1)

        layout.addWidget(header_group, 0, 0)
        layout.addWidget(self._chart_widget, 0, 1, 2, 1)

        return widget

    def _build_strategy_tab(self) -> QWidget:
        widget = QWidget()
        layout = QGridLayout(widget)
        layout.addWidget(QLabel("Strategy metrics coming soon..."), 0, 0)
        return widget

    def _build_activity_tab(self) -> QWidget:
        widget = QWidget()
        layout = QGridLayout(widget)
        layout.addWidget(QLabel("Recent Orders"), 0, 0)
        layout.addWidget(self._orders_list, 1, 0)
        return widget

    def _build_staking_tab(self) -> QWidget:
        widget = QWidget()
        layout = QGridLayout(widget)
        layout.addWidget(QLabel("Staking Positions"), 0, 0)
        layout.addWidget(self._staking_list, 1, 0)
        return widget

    def _build_menus(self) -> None:
        settings_menu = self.menuBar().addMenu("Settings")
        credentials_action = QAction("API Credentials…", self)
        credentials_action.triggered.connect(self._show_credentials_dialog)  # type: ignore[arg-type]
        settings_menu.addAction(credentials_action)

    def _show_credentials_dialog(self) -> None:
        if self._settings_dialog is None:
            venues = [
                ("alpaca", "Alpaca Paper Trading"),
                ("binance", "Binance Testnet"),
            ]
            self._settings_dialog = SettingsDialog(
                store=self._credential_store,
                event_bus=self._event_bus,
                venues=venues,
                parent=self,
            )
        self._settings_dialog.show()
        self._settings_dialog.raise_()
        self._settings_dialog.activateWindow()

    async def initialize(self) -> None:
        """Start background tasks and subscriptions."""

        logger.debug("[ui] Initializing main window")
        await self._event_bus.subscribe("order.submitted", self._on_order_submitted)
        await self._event_bus.subscribe("staking.position_updated", self._on_staking_updated)
        await self._event_bus.subscribe("settings.credentials_updated", self._on_credentials_updated)
        task = asyncio.create_task(self._consume_quotes(self._symbol), name="quote-stream")
        self._tasks.append(task)

    async def _consume_quotes(self, symbol: str) -> None:
        async for quote in self._data_provider.stream_quotes(symbol):
            self._update_quote_display(quote)

    def _update_quote_display(self, quote: Dict[str, object]) -> None:
        last = float(quote["last"])
        bid = float(quote["bid"])
        ask = float(quote["ask"])
        timestamp = str(quote["timestamp"])

        self._price_label.setText(f"{last:.2f}")
        self._spread_label.setText(f"{bid:.2f} / {ask:.2f}")
        try:
            parsed_time = datetime.fromisoformat(timestamp)
            self._timestamp_label.setText(parsed_time.strftime("%H:%M:%S"))
        except ValueError:
            self._timestamp_label.setText(timestamp)

        self._append_price_point(datetime.utcnow().timestamp(), last)

    def _append_price_point(self, timestamp: float, price: float) -> None:
        self._price_points.append((timestamp, price))
        times, prices = self._split_price_points(self._price_points)
        if times:
            self._price_curve.setData(times, prices, connect="finite")

    @staticmethod
    def _split_price_points(points: Iterable[Tuple[float, float]]) -> Tuple[List[float], List[float]]:
        times: List[float] = []
        prices: List[float] = []
        for ts, price in points:
            times.append(ts)
            prices.append(price)
        return times, prices

    async def _on_order_submitted(self, payload: Dict[str, object]) -> None:
        """Render order events in the activity log."""

        symbol = str(payload.get("symbol"))
        side = str(payload.get("side")).upper()
        status = str(payload.get("status")).upper()
        confidence = payload.get("confidence")
        size = payload.get("size", 0)
        venue = str(payload.get("venue") or "-")
        model = str(payload.get("model") or "-")

        text = f"{symbol} {side} x{size} – {status} [{venue}] via {model}"
        if confidence is not None:
            text += f" (confidence {float(confidence):.2f})"
            self._confidence_bar.setValue(int(float(confidence) * 100))
        item = QListWidgetItem(text)
        item.setTextAlignment(Qt.AlignmentFlag.AlignLeft | Qt.AlignmentFlag.AlignVCenter)
        self._orders_list.insertItem(0, item)

    async def _on_staking_updated(self, payload: Dict[str, object]) -> None:
        asset = str(payload.get("asset"))
        amount = float(payload.get("amount", 0))
        apr = float(payload.get("apr", 0))
        status = str(payload.get("status", ""))
        provider = str(payload.get("provider", ""))
        text = f"{asset}: {amount:.4f} staked @ {apr:.2f}% APR via {provider} ({status})"
        self._staking_list.insertItem(0, QListWidgetItem(text))

    async def _on_credentials_updated(self, payload: Dict[str, object]) -> None:
        venue = str(payload.get("venue", "")).title()
        self.statusBar().showMessage(f"Credentials updated for {venue}", 5000)

    def closeEvent(self, event: QCloseEvent) -> None:  # noqa: N802 (Qt naming)
        """Ensure tasks are cancelled when window closes."""

        for task in self._tasks:
            task.cancel()
        self._data_provider.stop()
        super().closeEvent(event)
