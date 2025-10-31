"""Settings dialog for managing paper trading API credentials."""

from __future__ import annotations

import asyncio
from typing import Iterable, Tuple

from PySide6.QtCore import Qt
from PySide6.QtWidgets import (
    QDialog,
    QDialogButtonBox,
    QFormLayout,
    QGridLayout,
    QLabel,
    QLineEdit,
    QPushButton,
    QWidget,
)

from basic_trading_software.common.credentials import CredentialStore
from basic_trading_software.common.events import EventBus


class CredentialEditor(QWidget):
    """UI component for editing a single venue's credentials."""

    def __init__(self, venue: str, display_name: str, store: CredentialStore) -> None:
        super().__init__()
        self.venue = venue
        self._store = store
        self._api_key = QLineEdit()
        self._api_secret = QLineEdit()
        self._api_secret.setEchoMode(QLineEdit.EchoMode.Password)

        api_key, api_secret = self._store.get(venue)
        if api_key:
            self._api_key.setText(api_key)
        if api_secret:
            self._api_secret.setText(api_secret)

        layout = QFormLayout(self)
        layout.addRow(QLabel(f"<b>{display_name}</b>"))
        layout.addRow("API Key", self._api_key)
        layout.addRow("API Secret", self._api_secret)

        clear_button = QPushButton("Clear")
        clear_button.clicked.connect(self._clear_fields)  # type: ignore[arg-type]
        layout.addRow(clear_button)

    def values(self) -> Tuple[str, str]:
        return self._api_key.text().strip(), self._api_secret.text().strip()

    def _clear_fields(self) -> None:
        self._api_key.clear()
        self._api_secret.clear()


class SettingsDialog(QDialog):
    """Modal dialog housing credential editors."""

    def __init__(
        self,
        store: CredentialStore,
        event_bus: EventBus,
        venues: Iterable[Tuple[str, str]],
        parent: QWidget | None = None,
    ) -> None:
        super().__init__(parent)
        self.setWindowTitle("Settings · API Credentials")
        self.setModal(True)
        self.resize(480, 320)

        self._store = store
        self._event_bus = event_bus
        self._editors: list[CredentialEditor] = []

        container = QWidget(self)
        container_layout = QGridLayout(container)

        for row, (venue, name) in enumerate(venues):
            editor = CredentialEditor(venue, name, self._store)
            self._editors.append(editor)
            container_layout.addWidget(editor, row, 0)

        buttons = QDialogButtonBox(QDialogButtonBox.StandardButton.Save | QDialogButtonBox.StandardButton.Cancel)
        buttons.accepted.connect(self._on_accept)  # type: ignore[arg-type]
        buttons.rejected.connect(self.reject)

        layout = QGridLayout(self)
        layout.addWidget(container, 0, 0)
        layout.addWidget(buttons, 1, 0, alignment=Qt.AlignmentFlag.AlignRight)

    def _on_accept(self) -> None:
        publish_tasks = []
        for editor in self._editors:
            key, secret = editor.values()
            self._store.set(editor.venue, key or None, secret or None)
            publish_tasks.append(
                self._event_bus.publish(
                    "settings.credentials_updated",
                    {
                        "venue": editor.venue,
                        "api_key": key or None,
                        "api_secret": secret or None,
                    },
                )
            )
        for task in publish_tasks:
            asyncio.create_task(task)
        self.accept()
