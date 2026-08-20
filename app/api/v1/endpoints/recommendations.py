from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_active_user
from app.crud import record as crud_record
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
    """
    Fetches all records in the user's crate and runs the pydantic-ai curator agent.
    """
    # Fetch user's collection (up to 200 items for rich context)
    records, _ = crud_record.get_records(db, user_id=current_user.id, limit=200)

    # Invoke AI curator
    recommendations = await ai_curator.get_crate_recommendations(records)
    return recommendations
