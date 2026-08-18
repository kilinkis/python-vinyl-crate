"""
Vinyl Crate API - Root Entry Point

Allows running either:
    uvicorn main:app --reload
or:
    uvicorn app.main:app --reload
"""
from app.main import app

__all__ = ["app"]
