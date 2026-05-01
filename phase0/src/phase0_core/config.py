from pathlib import Path

from dotenv import load_dotenv
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


PROJECT_ROOT = Path(__file__).resolve().parents[3]
load_dotenv(PROJECT_ROOT / ".env")


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    hf_dataset_id: str = Field(
        default="ManikaSaini/zomato-restaurant-recommendation",
        alias="HF_DATASET_ID",
    )
    top_n_candidates: int = Field(default=30, alias="TOP_N_CANDIDATES")
    log_level: str = Field(default="INFO", alias="LOG_LEVEL")

    raw_data_dir: Path = PROJECT_ROOT / "data" / "raw"
    processed_data_dir: Path = PROJECT_ROOT / "data" / "processed"


settings = Settings()
