from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict


class UserBase(BaseModel):
    """Base schema with shared user fields."""
    email: EmailStr = Field(..., description="Valid email address")
    username: str = Field(..., min_length=3, max_length=50, description="Unique username")


class UserCreate(UserBase):
    """
    Schema for user registration.
    Requires plain-text password (will be hashed with bcrypt before storing).
    """
    password: str = Field(..., min_length=6, max_length=128, description="Password (min 6 characters)")


class UserResponse(UserBase):
    """
    Schema returned to clients.
    CRITICAL SECURITY PRACTICE:
    Notice `hashed_password` is NOT included here, ensuring password hashes are never exposed.
    """
    id: int
    is_active: bool
    is_superuser: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
