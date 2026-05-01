from fastapi import FastAPI

from phase0_core.config import settings


app = FastAPI(title="AI Restaurant Recommender", version="0.1.0")


@app.get("/health")
def health() -> dict[str, str]:
    return {
        "status": "ok",
        "dataset": settings.hf_dataset_id,
        "phase": "phase0_bootstrap",
    }
