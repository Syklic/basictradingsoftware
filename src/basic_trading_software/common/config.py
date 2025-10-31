"""Application configuration management."""

from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import Optional

from pydantic import BaseSettings, Field


class DataSettings(BaseSettings):
    """Endpoints and credentials for market data providers."""

    historical_data_path: Path = Field(default=Path("./data/historical"))
    live_data_ws_url: str = Field(default="wss://example-data-provider")
    max_concurrent_streams: int = Field(default=4)


class EquityBrokerSettings(BaseSettings):
    """Equity/futures broker credentials."""

    paper_trading: bool = Field(default=True)
    api_key: Optional[str] = Field(default=None)
    api_secret: Optional[str] = Field(default=None)
    base_url: str = Field(default="https://paper-api.example-broker.com/v2")


class CryptoExchangeSettings(BaseSettings):
    """Crypto exchange API configuration."""

    name: str = Field(default="binance")
    api_key: Optional[str] = Field(default=None)
    api_secret: Optional[str] = Field(default=None)
    rest_base_url: str = Field(default="https://testnet.binance.vision")
    websocket_url: str = Field(default="wss://testnet.binance.vision/ws")
    staking_enabled: bool = Field(default=True)


class StakingSettings(BaseSettings):
    """Staking provider configuration."""

    provider: str = Field(default="lido")
    api_base_url: str = Field(default="https://stake.example-provider.com")
    cooldown_days: int = Field(default=7)
    auto_compound: bool = Field(default=False)


class ModelSettings(BaseSettings):
    """Machine learning configuration."""

    model_registry_path: Path = Field(default=Path("./artifacts/models"))
    default_model_name: str = Field(default="transformer_v1")
    device: str = Field(default="cuda")


class AppSettings(BaseSettings):
    """Top-level application settings."""

    environment: str = Field(default="development")
    log_level: str = Field(default="INFO")
    trading_mode: str = Field(default="paper")
    data: DataSettings = DataSettings()
    broker_equity: EquityBrokerSettings = EquityBrokerSettings()
    broker_crypto: CryptoExchangeSettings = CryptoExchangeSettings()
    staking: StakingSettings = StakingSettings()
    model: ModelSettings = ModelSettings()

    class Config:
        env_nested_delimiter = "__"
        case_sensitive = False
        env_file = ".env"


@lru_cache(maxsize=1)
def get_settings() -> AppSettings:
    """Return cached application settings."""

    return AppSettings()
