from pathlib import Path
import sys

from fastapi.testclient import TestClient


PHASE2_ROOT = Path(__file__).resolve().parents[1]
SRC_PATH = PHASE2_ROOT / "src"
if str(SRC_PATH) not in sys.path:
    sys.path.insert(0, str(SRC_PATH))

from phase2_input.app import app


def test_create_preference_profile_api() -> None:
    client = TestClient(app)
    response = client.post(
        "/api/preferences",
        json={
            "location": "delhi",
            "budget": "cheap",
            "cuisine": "chineese",
            "minimum_rating": 4.0,
            "additional_preferences": ["quick service", "family"],
        },
    )
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["profile"]["budget"] == "low"
