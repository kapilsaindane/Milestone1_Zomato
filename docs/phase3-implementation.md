# Phase 3 Implementation (Separate Folder)

Phase 3 has been implemented in `phase3/` as a dedicated Candidate Retrieval layer.

## Alignment with Architecture

Mapped from `docs/phase-wise-architecture.md`:

- **Rule-based filtering engine:** `phase3/src/phase3_candidate/retrieval.py`
- **Basic ranking/scoring logic:** `phase3/src/phase3_candidate/retrieval.py`
- **Candidate selector (Top-N):** `phase3/src/phase3_candidate/retrieval.py`

## Input and Output

- **Input:**  
  - `phase1/output/phase1_cleaned.csv`  
  - `phase2/output/latest_preference_profile.json`
- **Output:**  
  - `phase3/output/phase3_shortlisted_candidates.json`

## Entry Point

- Run: `python phase3/scripts/run_phase3.py`

## Validation

- Tests: `phase3/tests/test_retrieval.py`
- Coverage includes strict filtering, ranking/top-N, and fallback filtering behavior
