# Repository Guidelines

## Project Structure & Module Organization
- Core package lives in `src/basic_trading_software/`, grouped by domain (`common`, `data`, `ml`, `trading`, `ui`).
- Configuration artifacts sit in `config/` (e.g., `credentials.json` created at runtime) and `.env` at repo root.
- Documentation resides in `README.md` and this guide; add design notes under `docs/` if needed.

## Build, Test, and Development Commands
- `uv pip install -r requirements.txt` — install runtime dependencies (PySide6, PyTorch, etc.).
- `python -m basic_trading_software` — launch the Qt desktop shell (remains in paper-trading mode).
- `uv pip install -r requirements.txt -e .[dev]` — add developer tools (pytest, ruff, mypy).
- `ruff check src` / `ruff format src` — lint and format Python sources.

## Coding Style & Naming Conventions
- Follow PEP 8 with a 100-character line limit (enforced via Ruff); prefer type hints everywhere.
- Use PascalCase for Qt widgets/classes, snake_case for functions and variables, and SCREAMING_SNAKE_CASE for constants.
- Keep docstrings concise; add targeted comments only where logic is non-obvious.

## Testing Guidelines
- Use `pytest` for unit/integration tests and `pytest-qt` for GUI interactions.
- Place tests under `tests/` mirroring the package layout (e.g., `tests/ui/test_main_window.py`).
- Name test functions `test_<behavior>` and ensure new features include coverage (aim for ≥80% on touched modules).

## Commit & Pull Request Guidelines
- Use imperative commit subjects (e.g., `Add staking settings dialog`) and include context-rich bodies when needed.
- Reference issue IDs in commits/PRs when applicable (`Fixes #42`).
- PRs should summarize changes, note testing performed, and attach screenshots/gifs for GUI updates.

## Security & Configuration Tips
- Keep credentials out of source control; use the Settings dialog to populate `config/credentials.json` locally.
- Paper-trading mode is enforced by default; opening real trading requires explicit configuration changes plus review.
- Store any additional secrets via environment variables (`.env`) with `APP__BROKER_*` overrides instead of hardcoding.
