from typing import Optional

from pydantic import BaseModel, Field


class AlbumRecommendation(BaseModel):
    """
    Schema for an individual AI-curated album recommendation.
    """

    title: str = Field(..., min_length=1, description="Title of the recommended vinyl album")
    artist: str = Field(..., min_length=1, description="Artist or band name")
    release_year: int = Field(
        ..., ge=1880, le=2100, description="Year the album was originally released"
    )
    genre: str = Field(
        ..., description="Primary musical genre or style (e.g. Jazz, Electronic, Prog Rock)"
    )
    estimated_price: float = Field(
        ..., ge=0.0, description="Estimated market price in USD for a standard pressing"
    )
    reason_for_recommendation: str = Field(
        ...,
        description="Audiophile curator explanation connecting this album to the collector's current crate",
    )
    suggested_condition: str = Field(
        default="Near Mint",
        description="Recommended Goldmine condition grade (e.g., Mint, Near Mint, VG+)",
    )
    cover_url: Optional[str] = Field(
        default=None,
        description="Image URL of the album artwork",
    )


class RecommendationResponse(BaseModel):
    """
    Wrapper schema containing AI recommendations and taste profile assessment.
    """

    curator_summary: str = Field(
        ...,
        description="1-2 sentence audiophile assessment of the collector's taste profile based on their crate",
    )
    recommendations: list[AlbumRecommendation] = Field(
        ...,
        description="List of complementary album recommendations",
    )
    total_crate_size_analyzed: int = Field(
        default=0,
        description="Total number of records from the user's collection analyzed by the AI",
    )
