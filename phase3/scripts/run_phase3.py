from pathlib import Path
import sys


PHASE3_ROOT = Path(__file__).resolve().parents[1]
SRC_PATH = PHASE3_ROOT / "src"
if str(SRC_PATH) not in sys.path:
    sys.path.insert(0, str(SRC_PATH))

from phase3_candidate.config import (
    PHASE1_CLEANED_CSV,
    PHASE2_PROFILE_JSON,
    SHORTLIST_JSON_PATH,
)
from phase3_candidate.io import load_cleaned_dataset, load_preference_profile, save_shortlist
from phase3_candidate.service import build_shortlist


def main() -> None:
    df = load_cleaned_dataset(PHASE1_CLEANED_CSV)
    profile = load_preference_profile(PHASE2_PROFILE_JSON)
    shortlist_payload = build_shortlist(df, profile, top_n=30)
    save_shortlist(SHORTLIST_JSON_PATH, shortlist_payload)

    meta = shortlist_payload["metadata"]
    print("Phase 3 completed successfully.")
    print(f"Shortlist output: {SHORTLIST_JSON_PATH}")
    print(f"Input rows: {meta['input_rows']}")
    print(f"Strict filtered rows: {meta['strict_filtered_rows']}")
    print(f"Used fallback: {meta['used_fallback']}")
    print(f"Final candidates: {meta['final_candidates']}")


if __name__ == "__main__":
    main()
