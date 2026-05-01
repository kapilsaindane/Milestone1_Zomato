from pathlib import Path
import sys

import pandas as pd


PHASE3_ROOT = Path(__file__).resolve().parents[1]
SRC_PATH = PHASE3_ROOT / "src"
if str(SRC_PATH) not in sys.path:
    sys.path.insert(0, str(SRC_PATH))

from phase3_candidate.retrieval import filter_candidates, score_candidates, select_top_n
from phase3_candidate.schemas import PreferenceProfile
from phase3_candidate.service import build_shortlist


def _profile() -> PreferenceProfile:
    return PreferenceProfile(
        location="Delhi",
        budget="medium",
        cuisine="chinese",
        minimum_rating=4.0,
        additional_preferences=[],
        budget_range=(501, 1500),
        normalized_tags=[],
    )


def test_filter_candidates_strict() -> None:
    df = pd.DataFrame(
        {
            "restaurant_name": ["A", "B", "C"],
            "location": ["Delhi", "Delhi", "Mumbai"],
            "cuisine": ["Chinese", "Italian", "Chinese"],
            "primary_cuisine": ["Chinese", "Italian", "Chinese"],
            "rating": [4.3, 4.7, 4.4],
            "cost_for_two": [900, 900, 900],
            "votes": [120, 200, 80],
        }
    )
    filtered = filter_candidates(df, _profile())
    assert len(filtered) == 1
    assert filtered.iloc[0]["restaurant_name"] == "A"


def test_score_candidates_and_top_n() -> None:
    df = pd.DataFrame(
        {
            "restaurant_name": ["A", "B"],
            "location": ["Delhi", "Delhi"],
            "cuisine": ["Chinese", "Chinese"],
            "primary_cuisine": ["Chinese", "Chinese"],
            "rating": [4.6, 4.1],
            "cost_for_two": [1000, 700],
            "votes": [200, 50],
        }
    )
    scored = score_candidates(df, _profile())
    top = select_top_n(scored, 1)
    assert len(top) == 1
    assert top.iloc[0]["restaurant_name"] == "A"


def test_build_shortlist_uses_fallback() -> None:
    df = pd.DataFrame(
        {
            "restaurant_name": ["A"],
            "location": ["Delhi"],
            "cuisine": ["Chinese"],
            "primary_cuisine": ["Chinese"],
            "rating": [3.7],
            "cost_for_two": [1600],
            "votes": [80],
        }
    )
    payload = build_shortlist(df, _profile(), top_n=5)
    assert payload["metadata"]["used_fallback"] is True
    assert payload["metadata"]["final_candidates"] == 1
