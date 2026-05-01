# Phase 0 Implementation

This phase establishes the baseline engineering setup required to implement the architecture in `docs/phase-wise-architecture.md`.

## Scope

Phase 0 is a preparation phase before Phase 1 (Data Foundation).  
It ensures the codebase is runnable, configurable, and testable.
It also establishes a basic web UI as the source of user input for preference capture.

## Implemented Items

- Project directory scaffolding:
  - `phase0/src/phase0_core`, `phase0/src/phase0_data`, `phase0/src/phase0_models`, `phase0/tests`, `phase0/scripts`, `data/raw`, `data/processed`
- Dependency definition in `requirements.txt`
- Environment variable template in `.env.example`
- Data artifact handling in `.gitignore`
- Runtime configuration module: `phase0/src/phase0_core/config.py`
- Data ingestion module: `phase0/src/phase0_data/loader.py`
- Data preprocessing module: `phase0/src/phase0_data/preprocess.py`
- API skeleton: `phase0/src/phase0_main.py`
- Basic web UI input form for collecting user preferences
- Bootstrap runner for ingestion + preprocessing: `phase0/scripts/run_phase0.py`
- Basic preprocessing test: `phase0/tests/test_preprocess.py`
- Project runbooks: `README.md` and `phase0/README.md`

## Entry Commands

- Bootstrap data: `python phase0/scripts/run_phase0.py`
- Run API: `uvicorn phase0_main:app --app-dir phase0/src --reload`
- Run tests: `python -m pytest -q phase0/tests`

## Outputs Produced

- `data/raw/zomato_raw.csv`
- `data/processed/zomato_cleaned.csv`

## Completion Criteria

- Project installs with `pip install -r requirements.txt`
- Bootstrap script runs and creates raw + cleaned datasets
- Health endpoint returns status OK
- Basic web UI is available and usable for input collection
- Unit tests pass
