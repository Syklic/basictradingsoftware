"""Local credential store for paper trading adapters."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Dict, Optional, Tuple

from loguru import logger


class CredentialStore:
    """Simple JSON-backed credential manager."""

    def __init__(self, path: Path | None = None) -> None:
        self._path = path or Path("./config/credentials.json")
        self._path.parent.mkdir(parents=True, exist_ok=True)
        self._cache: Dict[str, Dict[str, str]] = {}
        self._load()

    def _load(self) -> None:
        if self._path.exists():
            try:
                data = json.loads(self._path.read_text())
                if isinstance(data, dict):
                    self._cache = {k: dict(v) for k, v in data.items()}
            except json.JSONDecodeError:
                logger.warning("[credentials] Failed to parse credentials file; starting fresh")
                self._cache = {}

    def save(self) -> None:
        self._path.write_text(json.dumps(self._cache, indent=2))

    def get(self, venue: str) -> Tuple[Optional[str], Optional[str]]:
        creds = self._cache.get(venue.lower(), {})
        return creds.get("api_key"), creds.get("api_secret")

    def set(self, venue: str, api_key: str | None, api_secret: str | None) -> None:
        venue = venue.lower()
        if api_key or api_secret:
            self._cache[venue] = {
                "api_key": api_key or "",
                "api_secret": api_secret or "",
            }
        elif venue in self._cache:
            del self._cache[venue]
        self.save()
        logger.info(f"[credentials] Updated credentials for venue '{venue}'")
