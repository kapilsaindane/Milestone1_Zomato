# Phase 2: Preference Capture Layer

This folder contains a standalone implementation for Phase 2 from `docs/phase-wise-architecture.md`.

## Included Components

- Basic web UI input form
- API endpoint for preference submission
- Input validation with Pydantic
- Preference normalization and profile builder
- Output export of standardized preference profile

## Run Phase 2 Web App

From project root:

```bash
python phase2/scripts/run_phase2.py
```

Open:
- `http://127.0.0.1:8002/`

## API Endpoint

- `POST /api/preferences`

Request body example:

```json
{
  "location": "Delhi",
  "budget": "cheap",
  "cuisine": "chineese",
  "minimum_rating": 4.0,
  "additional_preferences": ["quick service", "family"]
}
```

## Generated Output

- `phase2/output/latest_preference_profile.json`
