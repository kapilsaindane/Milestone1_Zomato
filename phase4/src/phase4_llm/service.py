import json

from phase4_llm.groq_client import generate_with_groq
from phase4_llm.prompt_builder import build_recommendation_prompt
from phase4_llm.response_parser import (
    format_fallback_output,
    parse_recommendation_response,
)
from phase4_llm.schemas import RecommendationOutput


def run_phase4_recommendation(
    shortlist_payload: dict,
    groq_api_key: str | None,
    model: str,
    top_k: int = 5,
) -> RecommendationOutput:
    candidates = shortlist_payload.get("candidates", [])
    preference_profile = shortlist_payload.get("preference_profile", {})

    if not candidates:
        return RecommendationOutput(
            model=f"{model}_fallback",
            total_input_candidates=0,
            recommendations=[],
            summary="No candidates available from Phase 3. Please rerun Phase 3 with broader constraints.",
        )

    prompt = build_recommendation_prompt(preference_profile, candidates, top_k=top_k)
    if not groq_api_key:
        return format_fallback_output(candidates, model=model, top_k=top_k)

    try:
        raw_text = generate_with_groq(groq_api_key, model, prompt)
        return parse_recommendation_response(
            raw_text=raw_text,
            model=model,
            total_input_candidates=len(candidates),
        )
    except Exception:
        return format_fallback_output(candidates, model=model, top_k=top_k)


def load_shortlist_payload(path: str) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_recommendations(path: str, output: RecommendationOutput) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(output.model_dump(), f, indent=2)
