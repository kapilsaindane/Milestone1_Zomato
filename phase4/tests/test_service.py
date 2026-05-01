from pathlib import Path
import sys


PHASE4_ROOT = Path(__file__).resolve().parents[1]
SRC_PATH = PHASE4_ROOT / "src"
if str(SRC_PATH) not in sys.path:
    sys.path.insert(0, str(SRC_PATH))

from phase4_llm.service import run_phase4_recommendation


def test_service_uses_fallback_without_api_key() -> None:
    payload = {
        "preference_profile": {"location": "Delhi", "budget": "low"},
        "candidates": [
            {
                "restaurant_name": "A",
                "cuisine": "Chinese",
                "rating": 4.4,
                "cost_for_two": 400,
            }
        ],
    }
    out = run_phase4_recommendation(payload, groq_api_key=None, model="groq-model", top_k=5)
    assert out.model.endswith("_fallback")
    assert len(out.recommendations) == 1
