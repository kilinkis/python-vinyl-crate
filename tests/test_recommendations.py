from typing import Dict

from fastapi.testclient import TestClient

from app.models.record import Record


def test_get_recommendations_authenticated_with_records(
    client: TestClient,
    user_token_headers: Dict[str, str],
    sample_record: Record,
):
    """
    Tests fetching AI recommendations when authenticated with existing crate records.
    """
    response = client.get("/api/v1/recommendations/", headers=user_token_headers)
    assert response.status_code == 200
    data = response.json()

    assert "curator_summary" in data
    assert "recommendations" in data
    assert len(data["recommendations"]) == 3
    assert data["total_crate_size_analyzed"] >= 1

    first = data["recommendations"][0]
    assert "title" in first
    assert "artist" in first
    assert "release_year" in first
    assert "estimated_price" in first
    assert "reason_for_recommendation" in first
    assert "genre" in first


def test_get_recommendations_empty_crate(
    client: TestClient,
    user_token_headers: Dict[str, str],
):
    """
    Tests fetching AI recommendations when the user's crate is empty.
    """
    response = client.get("/api/v1/recommendations/", headers=user_token_headers)
    assert response.status_code == 200
    data = response.json()

    assert "curator_summary" in data
    assert len(data["recommendations"]) == 3
    assert data["total_crate_size_analyzed"] == 0


def test_get_recommendations_unauthenticated(client: TestClient):
    """
    Tests rejection of unauthenticated recommendations request.
    """
    response = client.get("/api/v1/recommendations/")
    assert response.status_code == 401
