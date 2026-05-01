from pydantic import BaseModel, Field


class UserPreference(BaseModel):
    location: str = Field(min_length=2)
    budget: str = Field(description="One of: low, medium, high")
    cuisine: str = Field(min_length=2)
    minimum_rating: float = Field(ge=0.0, le=5.0, default=0.0)
    additional_preferences: list[str] = Field(default_factory=list)


class RestaurantRecord(BaseModel):
    restaurant_name: str
    location: str
    cuisine: str
    cost_for_two: float | None = None
    rating: float | None = None


class Recommendation(BaseModel):
    restaurant_name: str
    cuisine: str
    rating: float | None = None
    estimated_cost: float | None = None
    explanation: str
