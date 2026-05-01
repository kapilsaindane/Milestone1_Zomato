from pydantic import BaseModel, Field


class PreferenceProfile(BaseModel):
    location: str
    budget: str
    cuisine: str
    minimum_rating: float = Field(ge=0.0, le=5.0, default=0.0)
    additional_preferences: list[str] = Field(default_factory=list)
    budget_range: tuple[int, int]
    normalized_tags: list[str] = Field(default_factory=list)


class CandidateRecord(BaseModel):
    restaurant_name: str
    location: str
    cuisine: str
    primary_cuisine: str | None = None
    rating: float | None = None
    cost_for_two: float | None = None
    votes: float | None = None
    online_order: str | None = None
    table_booking: str | None = None
    score: float
