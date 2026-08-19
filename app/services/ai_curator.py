import logging
from typing import List, Optional

from pydantic_ai import Agent
from pydantic_ai.models.test import TestModel

from app.core.config import settings
from app.models.record import Record
from app.schemas.recommendation import AlbumRecommendation, RecommendationResponse

logger = logging.getLogger("vinyl_crate.ai")

# System prompt for the audiophile vinyl curator agent
CURATOR_SYSTEM_PROMPT = """
You are a legendary record store owner and world-class audiophile vinyl curator.
Your task is to analyze a collector's current vinyl crate and recommend exactly 3 distinct, complementary albums they should acquire next.

Guidelines:
1. Examine the user's existing artists, eras, genres, and pressing conditions.
2. Recommend 3 complementary records that bridge genres, introduce iconic pressing masterpieces, or fill gaps in their collection.
3. For each album:
   - Provide the exact album title, artist, and original release year.
   - Specify the primary musical genre.
   - Estimate the realistic market price (USD) for a quality vinyl pressing.
   - Write a rich, persuasive, 1-2 sentence audiophile explanation connecting the recommendation directly to specific albums or artists in their crate.
   - Suggest a target Goldmine condition grade (e.g., Near Mint, Mint, VG+).
4. Provide a warm, personalized 1-2 sentence curator summary evaluating their taste profile.
"""


def _get_curator_agent() -> Agent[None, RecommendationResponse]:
    """
    Factory function to initialize the pydantic-ai Agent.
    Uses TestModel if no API keys are present in the environment to avoid startup crashes.
    """
    has_api_key = bool(settings.OPENAI_API_KEY or settings.ANTHROPIC_API_KEY)
    model: Optional[str | TestModel] = settings.AI_MODEL if has_api_key else TestModel()

    return Agent(
        model=model,
        output_type=RecommendationResponse,
        system_prompt=CURATOR_SYSTEM_PROMPT,
    )


def _get_fallback_recommendations(records: List[Record]) -> RecommendationResponse:
    """
    Provides curated audiophile starter recommendations when API keys are not configured
    or when running in offline demo / test mode.
    """
    total_records = len(records)

    # Contextualize fallback based on collection size
    if total_records == 0:
        summary = (
            "Your crate is currently a blank canvas! Here are three timeless audiophile cornerstones "
            "essential for any foundational vinyl collection."
        )
    else:
        sample_artists = ", ".join([r.artist for r in records[:3]])
        summary = (
            f"Based on your collection featuring {sample_artists}, you have a discerning ear for rich analog sound. "
            "Here are three essential records to expand your acoustic horizons."
        )

    return RecommendationResponse(
        curator_summary=summary,
        total_crate_size_analyzed=total_records,
        recommendations=[
            AlbumRecommendation(
                title="Sunday at the Village Vanguard",
                artist="Bill Evans Trio",
                release_year=1961,
                genre="Modal Jazz",
                estimated_price=48.00,
                reason_for_recommendation="An acoustic masterwork with breathtaking spatial depth and delicate piano textures recorded live in New York.",
                suggested_condition="Near Mint",
                cover_url="https://upload.wikimedia.org/wikipedia/en/2/25/Sunday_at_the_Village_Vanguard.jpg",
            ),
            AlbumRecommendation(
                title="Wish You Were Here",
                artist="Pink Floyd",
                release_year=1975,
                genre="Progressive Rock",
                estimated_price=42.50,
                reason_for_recommendation="Unmatched dynamic range and lush analog synthesizer layers that showcase the warmth of high-end vinyl pressings.",
                suggested_condition="Near Mint",
                cover_url="https://upload.wikimedia.org/wikipedia/en/a/a4/Pink_Floyd%2C_Wish_You_Were_Here_%281975%29.png",
            ),
            AlbumRecommendation(
                title="Innervisions",
                artist="Stevie Wonder",
                release_year=1973,
                genre="Soul / Funk",
                estimated_price=36.00,
                reason_for_recommendation="Groundbreaking TONTO synthesizer sequencing and tight polyrhythms that come alive on rich analog vinyl grooves.",
                suggested_condition="VG+",
                cover_url="https://upload.wikimedia.org/wikipedia/en/5/52/StevieWonderInnervisions.jpg",
            ),
        ],
    )


async def get_crate_recommendations(records: List[Record]) -> RecommendationResponse:
    """
    Asynchronously invokes the pydantic-ai agent to analyze records and return structured recommendations.
    Falls back gracefully if LLM provider keys are not configured.
    """
    has_api_key = bool(settings.OPENAI_API_KEY or settings.ANTHROPIC_API_KEY)

    if not has_api_key:
        logger.info(
            "No AI API key detected in environment. Serving curated audiophile recommendations."
        )
        return _get_fallback_recommendations(records)

    try:
        agent = _get_curator_agent()

        # Build prompt from user's actual collection
        if records:
            crate_items_text = "\n".join(
                [
                    f"- '{r.title}' by {r.artist} ({r.release_year}, {r.condition or 'VG+'}, ${r.price:.2f})"
                    for r in records
                ]
            )
            prompt = (
                f"Here is the collector's current vinyl crate ({len(records)} records):\n"
                f"{crate_items_text}\n\n"
                "Please analyze their taste and recommend 3 complementary records they should spin next."
            )
        else:
            prompt = (
                "The collector currently has 0 records in their crate. "
                "Please recommend 3 essential foundational audiophile albums across distinct genres."
            )

        logger.info(
            f"Invoking pydantic-ai agent ({settings.AI_MODEL}) for {len(records)} records..."
        )
        result = await agent.run(prompt)
        response_data: RecommendationResponse = result.output
        response_data.total_crate_size_analyzed = len(records)
        return response_data

    except Exception as e:
        logger.error(
            f"Error executing pydantic-ai agent: {e}. Falling back to curated starter set."
        )
        return _get_fallback_recommendations(records)
