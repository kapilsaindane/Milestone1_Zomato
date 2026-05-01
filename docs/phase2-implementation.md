# Phase 2 Implementation (Separate Folder)

Phase 2 has been implemented in the dedicated folder `phase2/`.

## Alignment with Architecture

Mapped from `docs/phase-wise-architecture.md`:

- **User interface form/API endpoint:**  
  - Web form: `phase2/templates/input_form.html`  
  - FastAPI endpoints: `phase2/src/phase2_input/app.py`
- **Input validation and normalization:**  
  - Schemas: `phase2/src/phase2_input/schemas.py`  
  - Normalization logic: `phase2/src/phase2_input/normalization.py`
- **Preference profile builder:**  
  - `build_preference_profile()` in `normalization.py`

## Entry Point

- Run: `python phase2/scripts/run_phase2.py`
- URL: `http://127.0.0.1:8002/`

## Output

- Standardized profile written to:
  - `phase2/output/latest_preference_profile.json`

## Validation

- Tests in `phase2/tests/test_phase2_normalization.py`
- Covers budget alias mapping and full profile creation behavior
