import json
import sqlite3
from pathlib import Path

import pandas as pd


def ensure_dirs(*paths: Path) -> None:
    for path in paths:
        path.mkdir(parents=True, exist_ok=True)


def save_cleaned_csv(df: pd.DataFrame, csv_path: Path) -> None:
    df.to_csv(csv_path, index=False)


def save_sqlite(df: pd.DataFrame, sqlite_path: Path, table_name: str = "restaurants") -> None:
    conn = sqlite3.connect(sqlite_path)
    try:
        df.to_sql(table_name, conn, if_exists="replace", index=False)
    finally:
        conn.close()


def save_schema(df: pd.DataFrame, schema_path: Path) -> None:
    schema = {
        "columns": [{"name": col, "dtype": str(dtype)} for col, dtype in df.dtypes.items()],
        "row_count": int(len(df)),
    }
    schema_path.write_text(json.dumps(schema, indent=2), encoding="utf-8")


def save_quality_report(raw_df: pd.DataFrame, cleaned_df: pd.DataFrame, path: Path) -> None:
    report = {
        "raw_rows": int(len(raw_df)),
        "cleaned_rows": int(len(cleaned_df)),
        "dropped_rows": int(len(raw_df) - len(cleaned_df)),
        "null_rating_rows": int(cleaned_df["rating"].isna().sum()),
        "null_cost_rows": int(cleaned_df["cost_for_two"].isna().sum()),
        "unique_locations": int(cleaned_df["location"].nunique()),
        "unique_primary_cuisines": int(cleaned_df["primary_cuisine"].nunique()),
    }
    path.write_text(json.dumps(report, indent=2), encoding="utf-8")
