from typing import Dict

from fastapi.testclient import TestClient

from app.models.record import Record


def test_create_record_authenticated(
    client: TestClient,
    user_token_headers: Dict[str, str],
):
    """Tests creating a record when authenticated."""
    response = client.post(
        "/api/v1/records/",
        headers=user_token_headers,
        json={
            "title": "Random Access Memories",
            "artist": "Daft Punk",
            "release_year": 2013,
            "condition": "Mint",
            "price": 49.99,
            "cover_url": "https://upload.wikimedia.org/wikipedia/en/a/a7/Random_Access_Memories.jpg",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Random Access Memories"
    assert data["artist"] == "Daft Punk"
    assert data["release_year"] == 2013
    assert data["condition"] == "Mint"
    assert data["price"] == 49.99
    assert (
        data["cover_url"]
        == "https://upload.wikimedia.org/wikipedia/en/a/a7/Random_Access_Memories.jpg"
    )
    assert "id" in data
    assert "user_id" in data


def test_create_record_unauthenticated(client: TestClient):
    """Tests rejection of unauthenticated record creation."""
    response = client.post(
        "/api/v1/records/",
        json={
            "title": "Abbey Road",
            "artist": "The Beatles",
            "release_year": 1969,
            "price": 30.00,
        },
    )
    assert response.status_code == 401


def test_get_record_by_id(
    client: TestClient,
    user_token_headers: Dict[str, str],
    sample_record: Record,
):
    """Tests fetching a single record by ID."""
    response = client.get(
        f"/api/v1/records/{sample_record.id}",
        headers=user_token_headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == sample_record.id
    assert data["title"] == sample_record.title
    assert data["artist"] == sample_record.artist


def test_get_record_not_found(
    client: TestClient,
    user_token_headers: Dict[str, str],
):
    """Tests 404 response for nonexistent record ID."""
    response = client.get(
        "/api/v1/records/999999",
        headers=user_token_headers,
    )
    assert response.status_code == 404


def test_list_records_pagination_and_search(
    client: TestClient,
    user_token_headers: Dict[str, str],
):
    """Tests listing records with pagination and search queries."""
    # Create 3 test records
    albums = [
        ("A Love Supreme", "John Coltrane", 1965, 35.0),
        ("Blue Train", "John Coltrane", 1957, 40.0),
        ("Head Hunters", "Herbie Hancock", 1973, 28.0),
    ]
    for title, artist, year, price in albums:
        client.post(
            "/api/v1/records/",
            headers=user_token_headers,
            json={
                "title": title,
                "artist": artist,
                "release_year": year,
                "price": price,
            },
        )

    # 1. List all
    res_all = client.get("/api/v1/records/", headers=user_token_headers)
    assert res_all.status_code == 200
    data_all = res_all.json()
    assert data_all["total"] == 3
    assert len(data_all["items"]) == 3

    # 2. Search by artist 'Coltrane'
    res_search = client.get("/api/v1/records/?search=Coltrane", headers=user_token_headers)
    assert res_search.status_code == 200
    data_search = res_search.json()
    assert data_search["total"] == 2
    assert all("Coltrane" in r["artist"] for r in data_search["items"])

    # 3. Test pagination limit
    res_page = client.get("/api/v1/records/?limit=2", headers=user_token_headers)
    assert res_page.status_code == 200
    assert len(res_page.json()["items"]) == 2


def test_update_record(
    client: TestClient,
    user_token_headers: Dict[str, str],
    sample_record: Record,
):
    """Tests updating a record's details."""
    response = client.put(
        f"/api/v1/records/{sample_record.id}",
        headers=user_token_headers,
        json={
            "price": 55.00,
            "condition": "Mint (Sealed)",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["price"] == 55.00
    assert data["condition"] == "Mint (Sealed)"
    assert data["title"] == sample_record.title  # Unchanged field preserved


def test_delete_record(
    client: TestClient,
    user_token_headers: Dict[str, str],
    sample_record: Record,
):
    """Tests deleting a record."""
    response = client.delete(
        f"/api/v1/records/{sample_record.id}",
        headers=user_token_headers,
    )
    assert response.status_code == 204

    # Verify record is deleted
    get_res = client.get(
        f"/api/v1/records/{sample_record.id}",
        headers=user_token_headers,
    )
    assert get_res.status_code == 404


def test_multi_tenant_isolation(
    client: TestClient,
    user_token_headers: Dict[str, str],
    other_user_headers: Dict[str, str],
    sample_record: Record,
):
    """
    Verifies multi-tenancy security:
    User 2 cannot view, edit, or delete User 1's records.
    """
    # 1. User 2 lists records -> should see 0 records (sample_record belongs to User 1)
    other_crate = client.get("/api/v1/records/", headers=other_user_headers)
    assert other_crate.status_code == 200
    assert other_crate.json()["total"] == 0

    # 2. User 2 attempts to get User 1's record -> 404
    cross_get = client.get(
        f"/api/v1/records/{sample_record.id}",
        headers=other_user_headers,
    )
    assert cross_get.status_code == 404

    # 3. User 2 attempts to update User 1's record -> 404
    cross_put = client.put(
        f"/api/v1/records/{sample_record.id}",
        headers=other_user_headers,
        json={"price": 1.00},
    )
    assert cross_put.status_code == 404

    # 4. User 2 attempts to delete User 1's record -> 404
    cross_del = client.delete(
        f"/api/v1/records/{sample_record.id}",
        headers=other_user_headers,
    )
    assert cross_del.status_code == 404
