from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class FeedbackType(str, Enum):
    LIKE = "like"
    DISLIKE = "dislike"
    NEUTRAL = "neutral"
    SELECTED = "selected"
    IGNORED = "ignored"

class InteractionType(str, Enum):
    VIEW = "view"
    CLICK = "click"
    BOOKMARK = "bookmark"
    SHARE = "share"
    RATE = "rate"

class UserFeedback(BaseModel):
    """Individual user feedback on a restaurant recommendation"""
    user_id: Optional[str] = None
    session_id: str
    restaurant_name: str
    recommendation_id: str
    feedback_type: FeedbackType
    interaction_type: InteractionType
    rating: Optional[int] = Field(None, ge=1, le=5)
    timestamp: datetime
    preference_profile: Dict[str, Any]
    recommendation_context: Dict[str, Any]
    explanation_quality: Optional[int] = Field(None, ge=1, le=5)
    comments: Optional[str] = None

class FeedbackAnalytics(BaseModel):
    """Aggregated feedback analytics"""
    total_feedback_count: int
    feedback_distribution: Dict[str, int]
    average_rating: Optional[float]
    satisfaction_score: float
    click_through_rate: float
    conversion_rate: float
    top_performing_restaurants: List[Dict[str, Any]]
    underperforming_restaurants: List[Dict[str, Any]]
    cuisine_performance: Dict[str, Dict[str, float]]
    location_performance: Dict[str, Dict[str, float]]
    time_period: Dict[str, datetime]

class ImprovementInsight(BaseModel):
    """Insight for system improvement"""
    insight_type: str
    description: str
    confidence: float
    actionable_recommendation: str
    expected_impact: str
    priority: str  # high, medium, low

class PromptTuningSuggestion(BaseModel):
    """Suggestion for prompt improvement"""
    current_prompt_version: str
    suggested_changes: List[str]
    reasoning: str
    expected_improvement: float
    test_hypothesis: str

class RankingAdjustment(BaseModel):
    """Suggestion for ranking algorithm adjustment"""
    factor_name: str
    current_weight: float
    suggested_weight: float
    reasoning: str
    expected_improvement: float
    confidence: float

class ImprovementReport(BaseModel):
    """Comprehensive improvement report"""
    report_period: Dict[str, datetime]
    total_recommendations: int
    total_feedback: int
    overall_satisfaction: float
    key_insights: List[ImprovementInsight]
    prompt_suggestions: List[PromptTuningSuggestion]
    ranking_adjustments: List[RankingAdjustment]
    performance_trends: Dict[str, List[float]]
    next_steps: List[str]

class FeedbackSession(BaseModel):
    """Session-based feedback collection"""
    session_id: str
    user_preferences: Dict[str, Any]
    recommendations_shown: List[Dict[str, Any]]
    user_interactions: List[UserFeedback]
    session_duration: float
    conversion: bool
    satisfaction_score: Optional[int]
