from pathlib import Path


PHASE1_ROOT = Path(__file__).resolve().parents[2]
PROJECT_ROOT = PHASE1_ROOT.parents[0]

DEFAULT_DATASET_ID = "ManikaSaini/zomato-restaurant-recommendation"
RAW_DATA_FALLBACK = PROJECT_ROOT / "data" / "raw" / "zomato_raw.csv"

OUTPUT_DIR = PHASE1_ROOT / "output"
STORAGE_DIR = PHASE1_ROOT / "storage"

CLEANED_CSV_PATH = OUTPUT_DIR / "phase1_cleaned.csv"
SCHEMA_JSON_PATH = OUTPUT_DIR / "phase1_schema.json"
QUALITY_REPORT_PATH = OUTPUT_DIR / "phase1_quality_report.json"
SQLITE_PATH = STORAGE_DIR / "phase1_restaurants.db"
