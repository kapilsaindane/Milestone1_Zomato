from pathlib import Path
import json
import sys

from fastapi import FastAPI, Form, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from starlette.requests import Request


PHASE2_ROOT = Path(__file__).resolve().parents[2]
if str(PHASE2_ROOT) not in sys.path:
    sys.path.insert(0, str(PHASE2_ROOT))

from phase2_input.normalization import build_preference_profile
from phase2_input.schemas import PreferenceInput


OUTPUT_PATH = PHASE2_ROOT / "output" / "latest_preference_profile.json"
TEMPLATES = Jinja2Templates(directory=str(PHASE2_ROOT / "templates"))

app = FastAPI(title="Phase 2 - Preference Capture", version="0.1.0")


def _save_profile(profile: dict) -> None:
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(profile, indent=2), encoding="utf-8")


@app.get("/", response_class=HTMLResponse)
def form_page(request: Request) -> HTMLResponse:
    return TEMPLATES.TemplateResponse(
        request=request,
        name="input_form.html",
        context={"result": None, "error": None},
    )


@app.post("/submit", response_class=HTMLResponse)
def submit_form(
    request: Request,
    location: str = Form(...),
    budget: str = Form(...),
    cuisine: str = Form(...),
    minimum_rating: float = Form(0.0),
    additional_preferences: str = Form(""),
) -> HTMLResponse:
    try:
        payload = PreferenceInput(
            location=location,
            budget=budget,
            cuisine=cuisine,
            minimum_rating=minimum_rating,
            additional_preferences=[
                item.strip() for item in additional_preferences.split(",") if item.strip()
            ],
        )
        profile = build_preference_profile(payload).model_dump()
        _save_profile(profile)
        return TEMPLATES.TemplateResponse(
            request=request,
            name="input_form.html",
            context={"result": profile, "error": None},
        )
    except Exception as exc:
        return TEMPLATES.TemplateResponse(
            request=request,
            name="input_form.html",
            context={"result": None, "error": str(exc)},
        )


@app.post("/api/preferences")
def create_preference_profile(payload: PreferenceInput) -> dict:
    try:
        profile = build_preference_profile(payload).model_dump()
        _save_profile(profile)
        return {"status": "ok", "profile": profile}
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
