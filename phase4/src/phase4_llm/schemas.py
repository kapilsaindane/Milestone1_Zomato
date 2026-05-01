from pydantic import BaseModel, Field


class Candidate(BaseModel):
    restaurant_name: str
    location: str
    cuisine: str
    primary_cuisine: str | None = None
    rating: float | None = None
    cost_for_two: float | None = None
    votes: float | None = None
    online_order: str | None = None
    table_booking: str | None = None
    score: float | None = None


class Recommendation(BaseModel):
    restaurant_name: str
    cuisine: str
    rating: float | None = None
    estimated_cost: float | None = None
    explanation: str = Field(min_length=5)


class RecommendationOutput(BaseModel):
    model: str
    total_input_candidates: int
    recommendations: list[Recommendation]
    summary: str
