"""Centralized logging configuration."""

from __future__ import annotations

from loguru import logger

from .config import get_settings


def configure_logging() -> None:
    """Configure global logger sinks."""

    settings = get_settings()
    logger.remove()
    logger.add(
        sink=lambda msg: print(msg, end=""),
        level=settings.log_level.upper(),
        colorize=True,
        enqueue=True,
    )

