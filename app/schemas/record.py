from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field


class RecordBase(BaseModel):
    """
    Base Schema with shared fields and validation rules.
    """
    title: str = Field(..., min_length=1, max_length=255, description="Title of the vinyl album")
    artist: str = Field(..., min_length=1, max_length=255, description="Artist or band name")
    release_year: int = Field(..., ge=1880, le=2100, description="Year of release (>= 1880)")
    condition: Optional[str] = Field(None, max_length=50, description="Condition (e.g., Mint, Near Mint, VG+, VG, Fair, Poor)")
    price: float = Field(..., ge=0.0, description="Price in USD (must be non-negative)")


class RecordCreate(RecordBase):
    """Schema for creating a new record (user_id is automatically assigned from the JWT token)."""
    pass


class RecordUpdate(BaseModel):
    """Schema for updating an existing record (all fields optional for partial updates)."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    artist: Optional[str] = Field(None, min_length=1, max_length=255)
    release_year: Optional[int] = Field(None, ge=1880, le=2100)
    condition: Optional[str] = Field(None, max_length=50)
    price: Optional[float] = Field(None, ge=0.0)


class RecordResponse(RecordBase):
    """
    Schema returned to API clients.
    """
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class RecordListResponse(BaseModel):
    """Paginated response wrapper."""
    items: List[RecordResponse]
    total: int
    skip: int
    limit: int
