from pathlib import Path


PHASE3_ROOT = Path(__file__).resolve().parents[2]
PROJECT_ROOT = PHASE3_ROOT.parents[0]

PHASE1_CLEANED_CSV = PROJECT_ROOT / "phase1" / "output" / "phase1_cleaned.csv"
PHASE2_PROFILE_JSON = PROJECT_ROOT / "phase2" / "output" / "latest_preference_profile.json"

OUTPUT_DIR = PHASE3_ROOT / "output"
SHORTLIST_JSON_PATH = OUTPUT_DIR / "phase3_shortlisted_candidates.json"
