"""Curated catalogue of ML models for market prediction."""

from __future__ import annotations

from typing import Dict

import torch
from torch import Tensor, nn


class LSTMForecaster(nn.Module):
    """Stacked LSTM for sequence-to-one prediction."""

    def __init__(self, input_size: int, hidden_size: int = 128, num_layers: int = 2, dropout: float = 0.2) -> None:
        super().__init__()
        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            dropout=dropout,
            batch_first=True,
        )
        self.head = nn.Sequential(
            nn.LayerNorm(hidden_size),
            nn.Linear(hidden_size, hidden_size // 2),
            nn.ReLU(),
            nn.Linear(hidden_size // 2, 1),
            nn.Sigmoid(),
        )

    def forward(self, sequence: Tensor) -> Tensor:  # type: ignore[override]
        output, _ = self.lstm(sequence)
        last_hidden = output[:, -1, :]
        return self.head(last_hidden)


class TemporalConvNet(nn.Module):
    """Temporal convolutional network (dilated causal convolutions)."""

    def __init__(self, input_size: int, channels: list[int] | None = None, kernel_size: int = 3, dropout: float = 0.1) -> None:
        super().__init__()
        channels = channels or [32, 64, 128]
        layers: list[nn.Module] = []
        num_levels = len(channels)
        in_channels = input_size
        for i in range(num_levels):
            out_channels = channels[i]
            dilation = 2**i
            layers.append(
                nn.Sequential(
                    nn.ConstantPad1d(( (kernel_size - 1) * dilation, 0), 0),
                    nn.Conv1d(in_channels, out_channels, kernel_size, dilation=dilation),
                    nn.ReLU(),
                    nn.Dropout(dropout),
                )
            )
            in_channels = out_channels
        self.network = nn.Sequential(*layers)
        self.head = nn.Sequential(
            nn.AdaptiveAvgPool1d(1),
            nn.Flatten(),
            nn.Linear(channels[-1], 1),
            nn.Sigmoid(),
        )

    def forward(self, sequence: Tensor) -> Tensor:  # type: ignore[override]
        # sequence shape: (batch, time, features) -> transpose to (batch, features, time)
        sequence = sequence.transpose(1, 2)
        features = self.network(sequence)
        return self.head(features)


class TransformerSignalModel(nn.Module):
    """Transformer encoder focusing on temporal attention."""

    def __init__(self, input_size: int, d_model: int = 64, num_heads: int = 4, num_layers: int = 2, dropout: float = 0.1) -> None:
        super().__init__()
        self.input_projection = nn.Linear(input_size, d_model)
        encoder_layer = nn.TransformerEncoderLayer(
            d_model=d_model,
            nhead=num_heads,
            dim_feedforward=d_model * 4,
            dropout=dropout,
            batch_first=True,
        )
        self.encoder = nn.TransformerEncoder(
            encoder_layer=encoder_layer,
            num_layers=num_layers,
            norm=nn.LayerNorm(d_model),
        )
        self.head = nn.Sequential(
            nn.Linear(d_model, d_model // 2),
            nn.GELU(),
            nn.Linear(d_model // 2, 1),
            nn.Sigmoid(),
        )

    def forward(self, sequence: Tensor) -> Tensor:  # type: ignore[override]
        encoded = self.input_projection(sequence)
        encoded = self.encoder(encoded)
        pooled = encoded[:, -1, :]
        return self.head(pooled)


MODEL_REGISTRY: Dict[str, type[nn.Module]] = {
    "lstm": LSTMForecaster,
    "tcn": TemporalConvNet,
    "transformer": TransformerSignalModel,
}


def create_model(name: str, input_size: int) -> nn.Module:
    """Instantiate a model from the registry."""

    key = name.lower()
    if key not in MODEL_REGISTRY:
        raise ValueError(f"Unknown model '{name}'. Available: {', '.join(MODEL_REGISTRY)}")
    return MODEL_REGISTRY[key](input_size=input_size)
