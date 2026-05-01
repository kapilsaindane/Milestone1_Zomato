# Phase 1 Implementation (Separate Folder)

Phase 1 has been implemented in the dedicated folder `phase1/` as requested.

## Alignment with Architecture

Mapped from `docs/phase-wise-architecture.md`:

- **Dataset loader:** `phase1/src/phase1_data/loader.py`
- **Data cleaning and preprocessing:** `phase1/src/phase1_data/cleaning.py`
- **Feature extraction:** `primary_cuisine`, `rating_bucket`, `cost_bucket`
- **Local storage:** CSV (`phase1/output`) and SQLite (`phase1/storage`)

## Entry Point

- Run: `python phase1/scripts/run_phase1.py`

## Generated Outputs

- `phase1/output/phase1_cleaned.csv`
- `phase1/output/phase1_schema.json`
- `phase1/output/phase1_quality_report.json`
- `phase1/storage/phase1_restaurants.db`

## Validation

- Unit tests in `phase1/tests/test_cleaning.py`
- Parse checks for rating and cost variants
- Deduplication and feature extraction checks
