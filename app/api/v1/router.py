from fastapi import APIRouter
from app.api.v1.endpoints import records, auth

api_router = APIRouter()

# Authentication routes: /api/v1/auth/register, /api/v1/auth/login, /api/v1/auth/me
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# Records routes: /api/v1/records
api_router.include_router(records.router, prefix="/records", tags=["Records"])
