from pathlib import Path
import sys


PHASE2_ROOT = Path(__file__).resolve().parents[1]
SRC_PATH = PHASE2_ROOT / "src"
if str(SRC_PATH) not in sys.path:
    sys.path.insert(0, str(SRC_PATH))

from phase2_input.normalization import build_preference_profile, normalize_budget
from phase2_input.schemas import PreferenceInput


def test_normalize_budget_alias() -> None:
    assert normalize_budget("cheap") == "low"
    assert normalize_budget("premium") == "high"


def test_build_preference_profile() -> None:
    payload = PreferenceInput(
        location="delhi",
        budget="budget",
        cuisine="chineese",
        minimum_rating=4.0,
        additional_preferences=["quick service", "family"],
    )
    profile = build_preference_profile(payload)
    assert profile.location == "Delhi"
    assert profile.budget == "low"
    assert profile.cuisine == "chinese"
    assert profile.budget_range == (0, 500)
    assert "family-friendly" in profile.normalized_tags
