import re

import pandas as pd


COLUMN_MAP = {
    "restaurant_name": ["name", "restaurant_name", "Restaurant Name"],
    "location": ["location", "city", "City"],
    "cuisine": ["cuisine", "cuisines", "Cuisines"],
    "cost_for_two": ["cost", "approx_cost", "average_cost_for_two", "Cost for two"],
    "rating": ["rating", "aggregate_rating", "Aggregate rating"],
    "votes": ["votes", "Votes"],
    "address": ["address", "Address"],
    "online_order": ["online_order", "Has Online delivery", "has_online_delivery"],
    "table_booking": ["book_table", "Has Table booking", "has_table_booking"],
}


def _first_present(df: pd.DataFrame, keys: list[str]) -> str | None:
    for key in keys:
        if key in df.columns:
            return key
    return None


def normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    normalized = {}
    for target, candidates in COLUMN_MAP.items():
        source = _first_present(df, candidates)
        normalized[target] = df[source] if source else None
    return pd.DataFrame(normalized)


def parse_rating(value: object) -> float | None:
    if value is None:
        return None
    text = str(value).strip()
    if text == "" or text in {"-", "NEW", "nan", "NaN"}:
        return None

    match = re.search(r"(\d+(\.\d+)?)", text)
    if not match:
        return None

    rating = float(match.group(1))
    if rating > 5.0:
        return None
    return rating


def parse_cost(value: object) -> float | None:
    if value is None:
        return None
    text = str(value).strip()
    if text == "" or text.lower() in {"nan", "none", "-"}:
        return None

    match = re.search(r"\d[\d,]*\.?\d*", text)
    if not match:
        return None

    cleaned = match.group(0).replace(",", "")
    try:
        return float(cleaned)
    except ValueError:
        return None


def _normalize_flag(value: object) -> str:
    text = str(value).strip().lower()
    if text in {"yes", "y", "true", "1"}:
        return "yes"
    if text in {"no", "n", "false", "0"}:
        return "no"
    return "unknown"


def clean_and_extract_features(df: pd.DataFrame) -> pd.DataFrame:
    cleaned = normalize_columns(df).copy()

    for field in ["restaurant_name", "location", "cuisine", "address"]:
        cleaned[field] = cleaned[field].astype(str).str.strip()

    cleaned["location"] = cleaned["location"].str.title()
    cleaned["cuisine"] = cleaned["cuisine"].str.replace(r"\s+", " ", regex=True)
    cleaned["rating"] = pd.to_numeric(cleaned["rating"].apply(parse_rating), errors="coerce")
    cleaned["cost_for_two"] = pd.to_numeric(cleaned["cost_for_two"].apply(parse_cost), errors="coerce")
    cleaned["votes"] = pd.to_numeric(cleaned["votes"], errors="coerce")
    cleaned["online_order"] = cleaned["online_order"].apply(_normalize_flag)
    cleaned["table_booking"] = cleaned["table_booking"].apply(_normalize_flag)

    # Feature extraction fields used in later ranking stages.
    cleaned["primary_cuisine"] = cleaned["cuisine"].str.split(",").str[0].str.strip()
    cleaned["rating_bucket"] = pd.cut(
        cleaned["rating"],
        bins=[-0.01, 2.5, 3.5, 4.2, 5.0],
        labels=["low", "average", "good", "excellent"],
    )
    cleaned["cost_bucket"] = pd.cut(
        cleaned["cost_for_two"],
        bins=[-1, 500, 1200, 2500, 50000],
        labels=["low", "medium", "high", "premium"],
    )

    # Drop unusable rows and remove duplicates.
    cleaned = cleaned.dropna(subset=["restaurant_name", "location", "cuisine"])
    cleaned = cleaned[cleaned["restaurant_name"] != ""]
    cleaned = cleaned.drop_duplicates(subset=["restaurant_name", "location", "address"])

    return cleaned.reset_index(drop=True)
