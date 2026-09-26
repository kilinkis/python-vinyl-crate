from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_active_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.recommendation import RecommendationResponse
from app.services import ai_curator

router = APIRouter()


@router.get(
    "/",
    response_model=RecommendationResponse,
    summary="Get AI 'What to Spin Next' Recommendations",
    description="Analyzes the authenticated user's current vinyl crate and returns 3 personalized album recommendations.",
)
async def get_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> RecommendationResponse:
    """Recommend albums for the authenticated collector's crate."""
    return await ai_curator.recommend_for_collector(db, current_user.id)
