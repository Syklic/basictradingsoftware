# Basic Trading Software

Next-generation desktop trading workstation that blends machine learning for signal generation with a modern, high-performance GUI.

## Technology Stack

- **Core language:** Python 3.11 — provides first-class ML ecosystem and rapid iteration.
- **GUI framework:** Qt 6 via PySide6 — native-accelerated widgets, modern styling, and excellent desktop ergonomics.
- **Machine learning:** PyTorch — flexible research-to-production workflow for deep learning models.
- **Data plumbing:** `pandas`, `polars`, and `aiohttp` for asynchronous market-data ingestion.
- **Packaging:** `pyproject.toml` + `uv`/`pip` — straightforward dependency management and reproducible environments.
- **Testing:** `pytest`, `pytest-qt` for GUI behavior, and `ruff` for linting/formatting.

This combination balances modern tooling with proven production support, making it simple to prototype strategies while keeping a path to performance-critical optimization (C++/Rust extensions) if ever required.

## High-Level Architecture

```
┌────────────────┐
│ GUI (Qt / QML) │
├────────────────┤
│ Presentation   │   Reactive view-models, charts, order tickets.
│ Layer          │
└─────┬──────────┘
      │ Signals / Events
┌─────▼──────────┐
│ Trading Engine │   Position management, risk checks, execution adapters.
├────────────────┤
│ Strategy Layer │   ML-driven signal generation, feature pipelines, backtests.
├────────────────┤
│ Data Services  │   Live feeds, historical storage, broker bridges.
└─────┬──────────┘
      │ Async I/O
┌─────▼──────────┐
│ Infra & Shared │   Config, logging, task scheduling, persistence.
└────────────────┘
```

### Application Flow

1. **Data ingestion** pulls live and historical data via async tasks.
2. **Feature pipelines** clean and transform streams into model-ready tensors.
3. **ML models** produce signals that flow into the strategy layer.
4. **Trading engine** evaluates signals against risk rules and routes to brokers/exchanges. Crypto trading runs through unified adapters that support REST + WebSocket APIs (e.g., Binance, Coinbase Advanced Trade). Equity brokers (e.g., Alpaca, IBKR) follow the same interface.
5. **Staking module** manages yield workflows (delegation, APR tracking, cooldown windows) for networks that expose programmatic APIs (e.g., Ethereum liquid staking providers).
6. **GUI** receives state updates to render dashboards, charts, and controls in real time.

### Multi-venue Trading & Staking

- **Unified broker interface** abstracts equities, futures, and crypto exchanges (paper mode by default). Each adapter implements:
  - REST client for account management, order placement, and staking actions (when available).
  - WebSocket streaming for trades/order-book updates.
- **Staking orchestrator** coordinates stake/unstake flows, tracks validator/APR data, and feeds positions back into the portfolio view.
- **Risk guardrails** enforce per-venue limits (max leverage, max daily loss) and fall back to paper mode if limits are breached.
- **Credential store** keeps paper-trading API keys locally (`config/credentials.json`) and propagates updates through the app in real time.

### Supported ML Model Blueprints

- **Statistical baselines**: ARIMA, Prophet (via optional extras) provide fast benchmarks.
- **Sequence models**: LSTM/GRU stacks, Temporal Convolutional Networks (TCN), and Transformer encoders tuned for minute/hour bars.
- **Volatility-aware models**: Gated Temporal ConvNets and cross-asset correlation features to inform crypto pairs.
- **Regime detection**: Clustering (HDBSCAN/KMeans) combined with Hidden Markov Models to switch between sub-strategies.

Each blueprint includes training scripts, feature pipelines, and evaluation metrics geared toward both equities and crypto datasets.

## Initial Roadmap

1. **MVP Scaffolding**
   - Project layout, dependency manifests, base configuration.
   - Async data provider and mock broker adapters.
   - Qt-based shell with navigation, chart placeholder, and logs.
2. **ML Foundations**
   - Historical data loader, feature engineering workflows.
   - PyTorch Lightning pipeline for training/evaluation.
   - Model registry with on-disk artifacts and versioning.
3. **Execution Layer**
   - Risk limits, portfolio accounting, order management.
   - Paper trading adapter; plug-in architecture for live brokers (e.g., Alpaca, IBKR) and crypto exchanges (e.g., Binance, Coinbase, Kraken).
   - Staking module with support for providers that expose HTTP/JSON RPC (e.g., Lido, RocketPool) and exchange-staking endpoints.
4. **Productization**
   - Backtesting UI, scenario replays, hyperparameter sweeps.
   - Deployment packaging (PyInstaller / Briefcase) for Win/macOS/Linux.
   - Automated tests and CI workflows.

## Development Environment

```bash
# Install uv (recommended Python package manager)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Create and activate a local environment
uv venv
source .venv/bin/activate

# Install dependencies
uv pip install -r requirements.txt
```

## Running the App

```bash
python -m basic_trading_software
```

## License

TBD – choose when ready to distribute.
