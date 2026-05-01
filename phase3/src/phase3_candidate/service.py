import pandas as pd

from phase3_candidate.retrieval import (
    fallback_filter_candidates,
    filter_candidates,
    score_candidates,
    select_top_n,
)
from phase3_candidate.schemas import PreferenceProfile


def build_shortlist(
    df: pd.DataFrame,
    profile: PreferenceProfile,
    top_n: int = 30,
) -> dict:
    strict = filter_candidates(df, profile)
    used_fallback = False
    working_set = strict

    if working_set.empty:
        working_set = fallback_filter_candidates(df, profile)
        used_fallback = True

    # Final fallback: location-only candidates to avoid empty result sets.
    if working_set.empty:
        location_only = df[
            df["location"].astype(str).str.lower() == profile.location.lower()
        ].reset_index(drop=True)
        working_set = location_only
        used_fallback = True

    ranked = score_candidates(working_set, profile) if not working_set.empty else working_set
    shortlist = select_top_n(ranked, top_n=top_n)

    columns = [
        "restaurant_name",
        "location",
        "cuisine",
        "primary_cuisine",
        "rating",
        "cost_for_two",
        "votes",
        "online_order",
        "table_booking",
        "score",
    ]
    for col in columns:
        if col not in shortlist.columns:
            shortlist[col] = None

    return {
        "metadata": {
            "input_rows": int(len(df)),
            "strict_filtered_rows": int(len(strict)),
            "used_fallback": used_fallback,
            "final_candidates": int(len(shortlist)),
            "top_n": top_n,
        },
        "preference_profile": profile.model_dump(),
        "candidates": shortlist[columns].to_dict(orient="records"),
    }
