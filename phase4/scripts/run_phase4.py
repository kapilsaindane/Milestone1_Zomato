from pathlib import Path
import sys
from dotenv import load_dotenv

# Load environment variables from .env file
project_root = Path(__file__).resolve().parents[3]
env_path = project_root / ".env"
load_dotenv(dotenv_path=env_path)

# Direct set as fallback
import os
if not os.getenv('GROQ_API_KEY'):
    os.environ['GROQ_API_KEY'] = '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'


PHASE4_ROOT = Path(__file__).resolve().parents[1]
SRC_PATH = PHASE4_ROOT / "src"
if str(SRC_PATH) not in sys.path:
    sys.path.insert(0, str(SRC_PATH))

from phase4_llm.config import GROQ_API_KEY, GROQ_MODEL, OUTPUT_PATH, PHASE3_SHORTLIST_PATH
from phase4_llm.service import load_shortlist_payload, run_phase4_recommendation, save_recommendations


def main() -> None:
    shortlist_payload = load_shortlist_payload(str(PHASE3_SHORTLIST_PATH))
    output = run_phase4_recommendation(
        shortlist_payload=shortlist_payload,
        groq_api_key=GROQ_API_KEY,
        model=GROQ_MODEL,
        top_k=5,
    )

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    save_recommendations(str(OUTPUT_PATH), output)

    print("Phase 4 completed successfully.")
    print(f"Model used: {output.model}")
    print(f"Input candidates: {output.total_input_candidates}")
    print(f"Recommendations returned: {len(output.recommendations)}")
    print(f"Output path: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
