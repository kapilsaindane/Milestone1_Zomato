# Phase 4: LLM Reasoning and Recommendation Layer (Groq)

This folder contains the standalone implementation of Phase 4 using Groq as the LLM provider.

## Includes

- Prompt builder for candidate ranking/reasoning
- Groq client integration
- Response parser and output formatter
- Fallback deterministic formatter when API key is missing or call fails

## Input

- `phase3/output/phase3_shortlisted_candidates.json`

## Environment Variables

- `GROQ_API_KEY` (required for real LLM call)
- `GROQ_MODEL` (optional, default: `llama-3.3-70b-versatile`)

## Run

From project root:

```bash
python phase4/scripts/run_phase4.py
```

## Output

- `phase4/output/phase4_recommendations.json`
