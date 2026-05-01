# Phase 4 Implementation (Separate Folder, Groq LLM)

Phase 4 has been implemented in `phase4/` using Groq as the LLM provider.

## Alignment with Architecture

Mapped from `docs/phase-wise-architecture.md`:

- **Prompt builder:** `phase4/src/phase4_llm/prompt_builder.py`
- **LLM inference service (Groq):** `phase4/src/phase4_llm/groq_client.py`
- **Response parser and formatter:** `phase4/src/phase4_llm/response_parser.py`

## Flow

1. Reads shortlisted candidates from Phase 3 output.
2. Builds constrained JSON prompt for recommendation reasoning.
3. Calls Groq model (if `GROQ_API_KEY` present).
4. Parses/validates structured recommendation output.
5. Falls back to deterministic recommendation formatting if needed.

## Entry Point

- Run: `python phase4/scripts/run_phase4.py`

## Input and Output

- Input: `phase3/output/phase3_shortlisted_candidates.json`
- Output: `phase4/output/phase4_recommendations.json`
