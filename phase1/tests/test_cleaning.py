from pathlib import Path
import sys

import pandas as pd


PHASE1_ROOT = Path(__file__).resolve().parents[1]
SRC_PATH = PHASE1_ROOT / "src"
if str(SRC_PATH) not in sys.path:
    sys.path.insert(0, str(SRC_PATH))

from phase1_data.cleaning import clean_and_extract_features, parse_cost, parse_rating


def test_parse_rating_variants() -> None:
    assert parse_rating("4.2/5") == 4.2
    assert parse_rating("NEW") is None
    assert parse_rating("-") is None
    assert parse_rating("6.1") is None


def test_parse_cost_variants() -> None:
    assert parse_cost("Rs. 1,200 for two") == 1200.0
    assert parse_cost("800") == 800.0
    assert parse_cost("-") is None


def test_clean_and_extract_features() -> None:
    df = pd.DataFrame(
        {
            "Restaurant Name": ["A", "A", "B"],
            "City": ["delhi", "delhi", "bangalore"],
            "Cuisines": ["Italian, Pizza", "Italian, Pizza", "Chinese"],
            "Aggregate rating": ["4.5", "4.5", "NEW"],
            "Cost for two": ["1,200", "1,200", "600"],
            "Address": ["Street 1", "Street 1", "Street 2"],
            "Votes": ["100", "100", "50"],
        }
    )
    cleaned = clean_and_extract_features(df)

    assert len(cleaned) == 2
    assert "primary_cuisine" in cleaned.columns
    assert "rating_bucket" in cleaned.columns
    assert "cost_bucket" in cleaned.columns
