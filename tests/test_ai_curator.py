import asyncio
from types import SimpleNamespace

from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.record import Record
from app.models.user import User
from app.schemas.recommendation import RecommendationResponse
from app.services import ai_curator


def test_offline_recommendations_use_only_the_collectors_records(
    db: Session, test_user: User, other_user: User, monkeypatch
):
    monkeypatch.setattr(settings, "OPENAI_API_KEY", None)
    monkeypatch.setattr(settings, "ANTHROPIC_API_KEY", None)
    db.add_all(
        [
            Record(
                title="Kind of Blue",
                artist="Miles Davis",
                release_year=1959,
                price=45,
                user_id=test_user.id,
            ),
            Record(
                title="Other Collection",
                artist="Someone Else",
                release_year=1980,
                price=20,
                user_id=other_user.id,
            ),
        ]
    )
    db.commit()

    result = asyncio.run(ai_curator.recommend_for_collector(db, test_user.id))

    assert result.total_crate_size_analyzed == 1
    assert "Miles Davis" in result.curator_summary
    assert "Someone Else" not in result.curator_summary
    assert len(result.recommendations) == 3


def test_curator_limits_the_analyzed_crate(db: Session, test_user: User, monkeypatch):
    monkeypatch.setattr(settings, "OPENAI_API_KEY", None)
    monkeypatch.setattr(settings, "ANTHROPIC_API_KEY", None)
    db.add_all(
        Record(
            title=f"Album {number}",
            artist=f"Artist {number}",
            release_year=2000,
            price=20,
            user_id=test_user.id,
        )
        for number in range(ai_curator.MAX_RECORDS_ANALYZED + 1)
    )
    db.commit()

    result = asyncio.run(ai_curator.recommend_for_collector(db, test_user.id))

    assert result.total_crate_size_analyzed == ai_curator.MAX_RECORDS_ANALYZED


def test_provider_result_uses_collector_context_and_corrects_count(
    db: Session, sample_record: Record, monkeypatch
):
    monkeypatch.setattr(settings, "OPENAI_API_KEY", "test-key")
    prompts = []
    provider_output = RecommendationResponse(
        curator_summary="Provider response", recommendations=[], total_crate_size_analyzed=999
    )

    class FakeAgent:
        async def run(self, prompt: str):
            prompts.append(prompt)
            return SimpleNamespace(output=provider_output)

    monkeypatch.setattr(ai_curator, "_get_curator_agent", FakeAgent)

    result = asyncio.run(ai_curator.recommend_for_collector(db, sample_record.user_id))

    assert result.total_crate_size_analyzed == 1
    assert result.curator_summary == "Provider response"
    assert "Kind of Blue" in prompts[0]
    assert "Miles Davis" in prompts[0]


def test_provider_failure_returns_offline_recommendations(
    db: Session, sample_record: Record, monkeypatch
):
    monkeypatch.setattr(settings, "OPENAI_API_KEY", "test-key")

    class FailingAgent:
        async def run(self, prompt: str):
            raise RuntimeError("provider unavailable")

    monkeypatch.setattr(ai_curator, "_get_curator_agent", FailingAgent)

    result = asyncio.run(ai_curator.recommend_for_collector(db, sample_record.user_id))

    assert result.total_crate_size_analyzed == 1
    assert len(result.recommendations) == 3
    assert "Miles Davis" in result.curator_summary
