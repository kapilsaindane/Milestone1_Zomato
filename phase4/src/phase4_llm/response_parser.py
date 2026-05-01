import json

from phase4_llm.schemas import Recommendation, RecommendationOutput


def _extract_json_block(raw_text: str) -> str:
    start = raw_text.find("{")
    end = raw_text.rfind("}")
    if start == -1 or end == -1 or end <= start:
        raise ValueError("LLM output does not contain a valid JSON object.")
    return raw_text[start : end + 1]


def parse_recommendation_response(
    raw_text: str,
    model: str,
    total_input_candidates: int,
) -> RecommendationOutput:
    payload = json.loads(_extract_json_block(raw_text))
    recs = [Recommendation(**item) for item in payload.get("recommendations", [])]

    if not recs:
        raise ValueError("No recommendations returned by LLM.")

    return RecommendationOutput(
        model=model,
        total_input_candidates=total_input_candidates,
        recommendations=recs,
        summary=payload.get("summary", "").strip() or "Top recommendations generated.",
    )


def format_fallback_output(
    candidates: list[dict],
    model: str,
    top_k: int = 5,
) -> RecommendationOutput:
    picked = candidates[: min(len(candidates), top_k)]
    recs = []
    for row in picked:
        recs.append(
            Recommendation(
                restaurant_name=row.get("restaurant_name", "Unknown"),
                cuisine=row.get("cuisine", "Unknown"),
                rating=row.get("rating"),
                estimated_cost=row.get("cost_for_two"),
                explanation=(
                    "Selected using deterministic ranking fallback due to unavailable LLM output."
                ),
            )
        )

    return RecommendationOutput(
        model=f"{model}_fallback",
        total_input_candidates=len(candidates),
        recommendations=recs,
        summary="Fallback recommendations generated from ranked candidates.",
    )
