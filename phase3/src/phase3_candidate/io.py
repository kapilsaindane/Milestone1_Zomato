import json
from pathlib import Path

import pandas as pd

from phase3_candidate.schemas import PreferenceProfile


def load_cleaned_dataset(path: Path) -> pd.DataFrame:
    if not path.exists():
        raise FileNotFoundError(f"Phase 1 dataset not found: {path}")
    return pd.read_csv(path)


def load_preference_profile(path: Path) -> PreferenceProfile:
    if not path.exists():
        raise FileNotFoundError(f"Phase 2 profile not found: {path}")
    payload = json.loads(path.read_text(encoding="utf-8"))
    return PreferenceProfile(**payload)


def save_shortlist(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
