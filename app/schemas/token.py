from typing import Optional

from pydantic import BaseModel


class Token(BaseModel):
    """Schema returned after successful login."""

    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    """Schema representing JWT decoded payload."""

    sub: Optional[str] = None
