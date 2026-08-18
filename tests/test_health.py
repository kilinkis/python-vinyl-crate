from fastapi.testclient import TestClient


def test_read_root(client: TestClient):
    """Tests the root greeting endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "docs" in data


def test_health_check(client: TestClient):
    """Tests the /health monitoring endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}
