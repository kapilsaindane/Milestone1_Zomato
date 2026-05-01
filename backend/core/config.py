from pydantic_settings import BaseSettings
from pathlib import Path
import os

class Settings(BaseSettings):
    # API Configuration
    api_title: str = "AI Restaurant Recommender"
    api_version: str = "1.0.0"
    debug: bool = False
    
    # Database Configuration
    database_url: str = "sqlite:///./restaurant_recommender.db"
    
    # Groq Configuration
    groq_api_key: str = ""
    groq_model: str = "llama-3.3-70b-versatile"
    
    # Data Configuration
    hf_dataset_id: str = "ManikaSaini/zomato-restaurant-recommendation"
    data_dir: Path = Path(__file__).parent.parent.parent / "data"
    output_dir: Path = Path(__file__).parent.parent / "outputs"
    
    # Phase Configuration
    top_n_candidates: int = 30
    top_n_recommendations: int = 5
    
    # CORS Configuration
    allowed_origins: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

# Global settings instance
settings = Settings()
