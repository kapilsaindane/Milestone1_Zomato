from pydantic import BaseModel, Field


class PreferenceInput(BaseModel):
    location: str = Field(min_length=2)
    budget: str = Field(min_length=2)
    cuisine: str = Field(min_length=2)
    minimum_rating: float = Field(ge=0.0, le=5.0, default=0.0)
    additional_preferences: list[str] = Field(default_factory=list)


class PreferenceProfile(BaseModel):
    location: str
    budget: str
    cuisine: str
    minimum_rating: float
    additional_preferences: list[str]
    budget_range: tuple[int, int]
    normalized_tags: list[str]
