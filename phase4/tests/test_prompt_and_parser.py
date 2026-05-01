from pathlib import Path
import sys


PHASE4_ROOT = Path(__file__).resolve().parents[1]
SRC_PATH = PHASE4_ROOT / "src"
if str(SRC_PATH) not in sys.path:
    sys.path.insert(0, str(SRC_PATH))

from phase4_llm.prompt_builder import build_recommendation_prompt
from phase4_llm.response_parser import format_fallback_output, parse_recommendation_response


def test_prompt_builder_contains_schema_instruction() -> None:
    prompt = build_recommendation_prompt(
        preference_profile={"location": "Delhi", "budget": "low"},
        candidates=[{"restaurant_name": "A", "rating": 4.3}],
        top_k=5,
    )
    assert "Return valid JSON only" in prompt
    assert "candidate_restaurants" in prompt


def test_parse_recommendation_response_json() -> None:
    raw = """
    {
      "summary": "Best matches for your request.",
      "recommendations": [
        {
          "restaurant_name": "A",
          "cuisine": "Chinese",
          "rating": 4.5,
          "estimated_cost": 450,
          "explanation": "High rating and budget-friendly for your preference."
        }
      ]
    }
    """
    parsed = parse_recommendation_response(raw, model="groq-test", total_input_candidates=10)
    assert parsed.model == "groq-test"
    assert len(parsed.recommendations) == 1
    assert parsed.recommendations[0].restaurant_name == "A"


def test_fallback_output_generation() -> None:
    out = format_fallback_output(
        candidates=[
            {
                "restaurant_name": "B",
                "cuisine": "Italian",
                "rating": 4.2,
                "cost_for_two": 900,
            }
        ],
        model="groq-test",
    )
    assert out.model.endswith("_fallback")
    assert len(out.recommendations) == 1
