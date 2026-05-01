from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class BudgetLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class PreferenceProfileRequest(BaseModel):
    location: str = Field(..., description="Preferred location/area")
    budget: BudgetLevel = Field(..., description="Budget level")
    cuisine: str = Field(default="any", description="Preferred cuisine type")
    minimum_rating: float = Field(default=4.0, ge=1.0, le=5.0, description="Minimum rating")
    additional_preferences: List[str] = Field(default_factory=list, description="Additional preferences")
    max_budget_amount: Optional[int] = Field(None, description="Maximum budget amount in rupees")

class PreferenceProfileResponse(BaseModel):
    location: str
    budget: BudgetLevel
    cuisine: str
    minimum_rating: float
    additional_preferences: List[str]
    budget_range: List[int]
    normalized_tags: List[str]
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class RestaurantInfo(BaseModel):
    restaurant_name: str
    location: str
    cuisine: str
    primary_cuisine: str
    rating: Optional[float]
    cost_for_two: Optional[int]
    votes: int
    online_order: str
    table_booking: str
    score: Optional[float] = None

class Recommendation(BaseModel):
    restaurant_name: str
    cuisine: str
    rating: Optional[float]
    estimated_cost: Optional[int]
    explanation: str
    confidence_score: Optional[float] = None

class RecommendationResponse(BaseModel):
    model: str
    total_input_candidates: int
    recommendations: List[Recommendation]
    summary: str
    processing_time: Optional[float] = None
    created_at: Optional[str] = None

class PhaseStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"

class PhaseInfo(BaseModel):
    name: str
    status: PhaseStatus
    input_count: Optional[int] = None
    output_count: Optional[int] = None
    error_message: Optional[str] = None
    last_run: Optional[str] = None
    processing_time: Optional[float] = None

class PhaseStatusResponse(BaseModel):
    system_status: str
    phases: List[PhaseInfo]
    total_restaurants: int
    last_updated: str

class SearchRequest(BaseModel):
    query: Optional[str] = None
    location: Optional[str] = None
    cuisine: Optional[str] = None
    limit: int = Field(default=10, ge=1, le=100)

class SearchResult(BaseModel):
    restaurants: List[RestaurantInfo]
    total_found: int
    search_time: float

class AnalyticsSummary(BaseModel):
    total_restaurants: int
    total_recommendations_generated: int
    popular_locations: List[Dict[str, Any]]
    popular_cuisines: List[Dict[str, Any]]
    average_ratings: Dict[str, float]
    system_performance: Dict[str, float]
