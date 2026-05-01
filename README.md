# AI-Powered Restaurant Recommendation System

Phase-wise implementation for the Zomato-style recommendation project.

## Phase-wise Layout

- `phase0/`: bootstrap and readiness (`src`, `tests`, `scripts`)
- `phase1/`: data foundation (`src`, `tests`, `scripts`, storage/output)
- `phase2/`: preference capture layer (`src`, `tests`, `templates`, `scripts`)
- `phase3/`: candidate retrieval layer (`src`, `tests`, `scripts`, output)
- `phase4/`: LLM reasoning layer with Groq (`src`, `tests`, `scripts`, output)

## Setup

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## Run Phase 0 Bootstrap

```bash
python phase0/scripts/run_phase0.py
```

This creates:
- `data/raw/zomato_raw.csv`
- `data/processed/zomato_cleaned.csv`

## Run API

```bash
uvicorn phase0_main:app --app-dir phase0/src --reload
```

Health check:
- `GET /health`

## Run Tests

```bash
python -m pytest -q phase0/tests phase1/tests phase2/tests phase3/tests phase4/tests
```
