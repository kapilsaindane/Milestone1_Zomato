import pandas as pd


EXPECTED_COLUMNS = {
    "restaurant_name": ["name", "restaurant_name", "Restaurant Name"],
    "location": ["location", "city", "City"],
    "cuisine": ["cuisine", "cuisines", "Cuisines"],
    "cost_for_two": ["cost", "approx_cost", "average_cost_for_two", "Cost for two"],
    "rating": ["rating", "aggregate_rating", "Aggregate rating"],
}


def _pick_column(df: pd.DataFrame, candidates: list[str]) -> str | None:
    for column in candidates:
        if column in df.columns:
            return column
    return None


def normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    mapped = {}
    for target_col, candidates in EXPECTED_COLUMNS.items():
        src_col = _pick_column(df, candidates)
        mapped[target_col] = df[src_col] if src_col else None
    return pd.DataFrame(mapped)


def clean_dataset(df: pd.DataFrame) -> pd.DataFrame:
    cleaned = normalize_columns(df)
    cleaned["restaurant_name"] = cleaned["restaurant_name"].astype(str).str.strip()
    cleaned["location"] = cleaned["location"].astype(str).str.strip()
    cleaned["cuisine"] = cleaned["cuisine"].astype(str).str.strip()
    cleaned["rating"] = pd.to_numeric(cleaned["rating"], errors="coerce")
    cleaned["cost_for_two"] = pd.to_numeric(cleaned["cost_for_two"], errors="coerce")

    cleaned = cleaned.dropna(subset=["restaurant_name", "location", "cuisine"])
    cleaned = cleaned[cleaned["restaurant_name"] != ""]
    return cleaned.reset_index(drop=True)
