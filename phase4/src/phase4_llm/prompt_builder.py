import json


def build_recommendation_prompt(preference_profile: dict, candidates: list[dict], top_k: int = 5) -> str:
    trimmed = candidates[: min(len(candidates), 30)]
    payload = {
        "preference_profile": preference_profile,
        "candidate_restaurants": trimmed,
        "expected_top_k": top_k,
    }

    instructions = (
        "You are a restaurant recommendation assistant. "
        "Use only provided candidates and fields. "
        "Do not invent missing data. "
        "Return valid JSON only with this exact schema: "
        '{"summary": "string", "recommendations": [{"restaurant_name":"string","cuisine":"string","rating":number|null,'
        '"estimated_cost":number|null,"explanation":"string"}]}. '
        "Each explanation must mention at least two grounded factors (rating, budget fit, cuisine match, votes, service flags)."
    )
    return f"{instructions}\n\nINPUT_JSON:\n{json.dumps(payload, indent=2)}"
