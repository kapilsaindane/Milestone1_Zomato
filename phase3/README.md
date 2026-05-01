# Phase 3: Candidate Retrieval Layer

Standalone implementation of Phase 3 from `docs/phase-wise-architecture.md`.

## Includes

- Rule-based filtering engine
- Basic ranking/scoring logic
- Top-N candidate selector
- Fallback filtering when strict criteria return zero rows

## Inputs

- Cleaned dataset from Phase 1: `phase1/output/phase1_cleaned.csv`
- Preference profile from Phase 2: `phase2/output/latest_preference_profile.json`

## Run

From project root:

```bash
python phase3/scripts/run_phase3.py
```

## Output

- `phase3/output/phase3_shortlisted_candidates.json`
