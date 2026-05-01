from pathlib import Path
import sys

import pandas as pd


PHASE0_ROOT = Path(__file__).resolve().parents[1]
SRC_PATH = PHASE0_ROOT / "src"
if str(SRC_PATH) not in sys.path:
    sys.path.insert(0, str(SRC_PATH))

from phase0_data.preprocess import clean_dataset


def test_clean_dataset_keeps_expected_columns() -> None:
    data = pd.DataFrame(
        {
            "Restaurant Name": ["A", "B"],
            "City": ["Delhi", "Bangalore"],
            "Cuisines": ["Italian", "Chinese"],
            "Aggregate rating": ["4.5", "NEW"],
            "Cost for two": ["1200", "800"],
        }
    )

    cleaned = clean_dataset(data)

    assert list(cleaned.columns) == [
        "restaurant_name",
        "location",
        "cuisine",
        "cost_for_two",
        "rating",
    ]
    assert len(cleaned) == 2
    assert cleaned["rating"].isna().sum() == 1
