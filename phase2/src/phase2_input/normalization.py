import re

from phase2_input.schemas import PreferenceInput, PreferenceProfile


BUDGET_ALIASES = {
    "low": {"low", "budget", "cheap", "economical"},
    "medium": {"medium", "mid", "moderate"},
    "high": {"high", "premium", "expensive", "luxury"},
}

BUDGET_RANGES = {
    "low": (0, 500),
    "medium": (501, 1500),
    "high": (1501, 10000),
}

CUISINE_ALIASES = {
    "chinese": {"chinese", "chineese", "indo chinese", "indochinese"},
    "italian": {"italian", "italian food", "pasta"},
    "north indian": {"north indian", "punjabi"},
    "south indian": {"south indian", "dosa", "idli"},
}

PREFERENCE_TAGS = {
    "family-friendly": {"family", "family-friendly", "kids"},
    "quick-service": {"quick", "fast", "quick service"},
    "romantic": {"date", "romantic", "couple"},
    "veg-options": {"veg", "vegetarian", "vegan"},
}


def _normalize_text(value: str) -> str:
    return re.sub(r"\s+", " ", value.strip().lower())


def normalize_budget(value: str) -> str:
    text = _normalize_text(value)
    for canonical, aliases in BUDGET_ALIASES.items():
        if text in aliases:
            return canonical
    raise ValueError("Unsupported budget. Use low, medium, or high.")


def normalize_cuisine(value: str) -> str:
    text = _normalize_text(value)
    for canonical, aliases in CUISINE_ALIASES.items():
        if text in aliases:
            return canonical
    return text


def normalize_additional_preferences(values: list[str]) -> list[str]:
    normalized = []
    for raw in values:
        text = _normalize_text(raw)
        mapped = None
        for canonical, aliases in PREFERENCE_TAGS.items():
            if text in aliases:
                mapped = canonical
                break
        normalized.append(mapped or text)
    return sorted(list(dict.fromkeys([item for item in normalized if item])))


def build_preference_profile(payload: PreferenceInput) -> PreferenceProfile:
    budget = normalize_budget(payload.budget)
    cuisine = normalize_cuisine(payload.cuisine)
    location = payload.location.strip().title()
    additional = normalize_additional_preferences(payload.additional_preferences)

    return PreferenceProfile(
        location=location,
        budget=budget,
        cuisine=cuisine,
        minimum_rating=payload.minimum_rating,
        additional_preferences=additional,
        budget_range=BUDGET_RANGES[budget],
        normalized_tags=additional,
    )
