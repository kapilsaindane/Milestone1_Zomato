from pathlib import Path
import sys


PHASE1_ROOT = Path(__file__).resolve().parents[1]
SRC_PATH = PHASE1_ROOT / "src"
if str(SRC_PATH) not in sys.path:
    sys.path.insert(0, str(SRC_PATH))

from phase1_data.cleaning import clean_and_extract_features
from phase1_data.config import (
    CLEANED_CSV_PATH,
    DEFAULT_DATASET_ID,
    OUTPUT_DIR,
    QUALITY_REPORT_PATH,
    RAW_DATA_FALLBACK,
    SCHEMA_JSON_PATH,
    SQLITE_PATH,
    STORAGE_DIR,
)
from phase1_data.loader import load_source_data
from phase1_data.storage import (
    ensure_dirs,
    save_cleaned_csv,
    save_quality_report,
    save_schema,
    save_sqlite,
)


def main() -> None:
    ensure_dirs(OUTPUT_DIR, STORAGE_DIR)
    raw_df = load_source_data(DEFAULT_DATASET_ID, RAW_DATA_FALLBACK)
    cleaned_df = clean_and_extract_features(raw_df)

    save_cleaned_csv(cleaned_df, CLEANED_CSV_PATH)
    save_sqlite(cleaned_df, SQLITE_PATH)
    save_schema(cleaned_df, SCHEMA_JSON_PATH)
    save_quality_report(raw_df, cleaned_df, QUALITY_REPORT_PATH)

    print("Phase 1 completed successfully.")
    print(f"Cleaned CSV: {CLEANED_CSV_PATH}")
    print(f"SQLite DB: {SQLITE_PATH}")
    print(f"Schema: {SCHEMA_JSON_PATH}")
    print(f"Quality report: {QUALITY_REPORT_PATH}")
    print(f"Rows: raw={len(raw_df)}, cleaned={len(cleaned_df)}")


if __name__ == "__main__":
    main()
