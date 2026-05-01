# Phase 1: Data Foundation

This folder contains a standalone implementation of Phase 1 from `docs/phase-wise-architecture.md`.

## Scope

- Dataset loading from Hugging Face or local CSV
- Data cleaning and normalization
- Feature extraction for key restaurant fields
- Storage outputs in CSV and SQLite
- Data schema export and quality report

## Folder Structure

- `src/phase1_data`: Phase 1 data pipeline modules
- `scripts/run_phase1.py`: Entry point
- `output`: Generated artifacts
- `tests`: Unit tests for parsing and cleaning

## Run

From project root:

```bash
python phase1/scripts/run_phase1.py
```

## Artifacts

- `phase1/output/phase1_cleaned.csv`
- `phase1/output/phase1_schema.json`
- `phase1/output/phase1_quality_report.json`
- `phase1/storage/phase1_restaurants.db`
