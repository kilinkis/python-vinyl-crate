from fastapi import APIRouter
from app.api.v1.endpoints import records

api_router = APIRouter()

# Records route group: /api/v1/records
api_router.include_router(records.router, prefix="/records", tags=["Records"])

# Step 2 will add:
# api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
