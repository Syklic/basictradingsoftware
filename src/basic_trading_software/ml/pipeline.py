"""ML pipeline scaffolding."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, Sequence, Tuple

import torch
from torch import nn

from basic_trading_software.common.config import get_settings
from basic_trading_software.ml.models import create_model


@dataclass
class ModelArtifact:
    name: str
    version: str
    path: Path


class ModelRegistry:
    """Local filesystem-backed registry."""

    def __init__(self) -> None:
        settings = get_settings().model
        self._root = settings.model_registry_path
        self._root.mkdir(parents=True, exist_ok=True)

    def latest(self, name: str) -> ModelArtifact | None:
        artifact_path = self._root / name
        if not artifact_path.exists():
            return None
        versions = sorted(artifact_path.glob("*.pt"))
        if not versions:
            return None
        latest_path = versions[-1]
        return ModelArtifact(name=name, version=latest_path.stem, path=latest_path)

    def save(self, name: str, version: str, model_state: Dict[str, torch.Tensor]) -> ModelArtifact:
        artifact_dir = self._root / name
        artifact_dir.mkdir(parents=True, exist_ok=True)
        artifact_path = artifact_dir / f"{version}.pt"
        torch.save(model_state, artifact_path)
        return ModelArtifact(name=name, version=version, path=artifact_path)


def generate_features(raw_bars: Iterable[Dict[str, float]]) -> torch.Tensor:
    """Convert raw OHLCV records into model-ready features."""

    feature_rows = []
    for bar in raw_bars:
        feature_rows.append(
            [
                bar["open"],
                bar["high"],
                bar["low"],
                bar["close"],
                bar["volume"],
            ]
        )
    return torch.tensor(feature_rows, dtype=torch.float32)


def predict_direction(model: nn.Module, features: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor]:
    """Return probabilities and class predictions."""

    with torch.no_grad():
        probs = model(features)
    predictions = (probs > 0.5).float()
    return probs, predictions


def build_sequence_dataset(
    bars: Sequence[Dict[str, float]], window: int, feature_keys: Sequence[str] | None = None
) -> torch.Tensor:
    """Create sliding-window tensor for sequence models."""

    feature_keys = feature_keys or ["open", "high", "low", "close", "volume"]
    sequences: list[list[list[float]]] = []
    for idx in range(len(bars) - window + 1):
        window_slice = bars[idx : idx + window]
        sequence: list[list[float]] = []
        for bar in window_slice:
            sequence.append([float(bar[key]) for key in feature_keys])
        sequences.append(sequence)
    return torch.tensor(sequences, dtype=torch.float32)


def create_default_model(input_size: int) -> nn.Module:
    """Instantiate default model specified in settings."""

    settings = get_settings().model
    return create_model(settings.default_model_name, input_size=input_size)
