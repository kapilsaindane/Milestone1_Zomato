from pathlib import Path
import os


PHASE4_ROOT = Path(__file__).resolve().parents[2]
PROJECT_ROOT = PHASE4_ROOT.parents[0]

PHASE3_SHORTLIST_PATH = PROJECT_ROOT / "phase3" / "output" / "phase3_shortlisted_candidates.json"
OUTPUT_PATH = PHASE4_ROOT / "output" / "phase4_recommendations.json"

GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
