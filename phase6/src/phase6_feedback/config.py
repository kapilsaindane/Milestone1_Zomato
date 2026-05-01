from pathlib import Path
import os

# Phase 6 Configuration
PHASE6_ROOT = Path(__file__).resolve().parents[2]
PROJECT_ROOT = PHASE6_ROOT.parents[0]

# Feedback Data Storage
FEEDBACK_DATABASE_PATH = PROJECT_ROOT / "phase6" / "data" / "feedback.db"
FEEDBACK_EXPORT_PATH = PROJECT_ROOT / "phase6" / "output" / "feedback_analytics.json"
IMPROVEMENT_REPORT_PATH = PROJECT_ROOT / "phase6" / "output" / "improvement_report.json"

# Analytics Configuration
ANALYTICS_RETENTION_DAYS = int(os.getenv("ANALYTICS_RETENTION_DAYS", "90"))
MIN_FEEDBACK_SAMPLES = int(os.getenv("MIN_FEEDBACK_SAMPLES", "50"))
PROMPT_TUNING_THRESHOLD = float(os.getenv("PROMPT_TUNING_THRESHOLD", "0.7"))

# Feedback Types
FEEDBACK_TYPES = ["like", "dislike", "neutral", "selected", "ignored"]
INTERACTION_TYPES = ["view", "click", "bookmark", "share", "rate"]

# Improvement Metrics
RANKING_METRICS = ["click_through_rate", "satisfaction_score", "conversion_rate"]
PROMPT_METRICS = ["explanation_quality", "relevance_score", "user_engagement"]
