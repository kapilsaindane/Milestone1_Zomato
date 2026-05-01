import pandas as pd

from phase3_candidate.schemas import PreferenceProfile


def _contains_token(value: object, token: str) -> bool:
    return token.lower() in str(value).lower()


def filter_candidates(df: pd.DataFrame, profile: PreferenceProfile) -> pd.DataFrame:
    filtered = df.copy()

    # Hard filters aligned with user constraints.
    filtered = filtered[
        filtered["location"].astype(str).str.lower() == profile.location.lower()
    ]
    filtered = filtered[
        pd.to_numeric(filtered["rating"], errors="coerce").fillna(0) >= profile.minimum_rating
    ]

    min_budget, max_budget = profile.budget_range
    filtered = filtered[
        pd.to_numeric(filtered["cost_for_two"], errors="coerce").fillna(max_budget + 1).between(
            min_budget, max_budget
        )
    ]

    cuisine_token = profile.cuisine.strip().lower()
    if cuisine_token:
        filtered = filtered[
            filtered["cuisine"].apply(lambda x: _contains_token(x, cuisine_token))
            | filtered.get("primary_cuisine", pd.Series("", index=filtered.index))
            .astype(str)
            .str.lower()
            .eq(cuisine_token)
        ]

    return filtered.reset_index(drop=True)


def fallback_filter_candidates(df: pd.DataFrame, profile: PreferenceProfile) -> pd.DataFrame:
    """
    Fallback path when strict filters return empty:
    1) Keep location and cuisine.
    2) Lower rating by 0.5.
    3) Expand budget by 25%.
    """
    filtered = df.copy()
    filtered = filtered[
        filtered["location"].astype(str).str.lower() == profile.location.lower()
    ]

    cuisine_token = profile.cuisine.strip().lower()
    if cuisine_token:
        filtered = filtered[
            filtered["cuisine"].apply(lambda x: _contains_token(x, cuisine_token))
            | filtered.get("primary_cuisine", pd.Series("", index=filtered.index))
            .astype(str)
            .str.lower()
            .eq(cuisine_token)
        ]

    min_budget, max_budget = profile.budget_range
    expanded_max = int(max_budget * 1.25)
    min_rating = max(0.0, profile.minimum_rating - 0.5)

    filtered = filtered[
        pd.to_numeric(filtered["rating"], errors="coerce").fillna(0) >= min_rating
    ]
    filtered = filtered[
        pd.to_numeric(filtered["cost_for_two"], errors="coerce")
        .fillna(expanded_max + 1)
        .between(min_budget, expanded_max)
    ]
    return filtered.reset_index(drop=True)


def score_candidates(df: pd.DataFrame, profile: PreferenceProfile) -> pd.DataFrame:
    scored = df.copy()
    scored["rating"] = pd.to_numeric(scored["rating"], errors="coerce").fillna(0)
    scored["cost_for_two"] = pd.to_numeric(scored["cost_for_two"], errors="coerce")
    scored["votes"] = pd.to_numeric(scored.get("votes", 0), errors="coerce").fillna(0)

    budget_mid = (profile.budget_range[0] + profile.budget_range[1]) / 2
    scored["budget_proximity"] = (
        1
        - (scored["cost_for_two"].fillna(budget_mid) - budget_mid).abs() / max(budget_mid, 1)
    ).clip(lower=0, upper=1)
    scored["rating_norm"] = (scored["rating"] / 5).clip(lower=0, upper=1)
    scored["votes_norm"] = (scored["votes"] / scored["votes"].max()) if scored["votes"].max() > 0 else 0

    scored["score"] = (
        0.55 * scored["rating_norm"] + 0.30 * scored["budget_proximity"] + 0.15 * scored["votes_norm"]
    )
    return scored.sort_values(by=["score", "rating", "votes"], ascending=False).reset_index(drop=True)


def select_top_n(df: pd.DataFrame, top_n: int = 30) -> pd.DataFrame:
    return df.head(top_n).copy()
