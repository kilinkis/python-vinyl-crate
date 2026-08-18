from typing import Dict
from fastapi.testclient import TestClient
from app.models.user import User


def test_register_user_success(client: TestClient):
    """Tests successful user registration."""
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "newuser@test.com",
            "username": "newuser",
            "password": "strongpassword123",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newuser@test.com"
    assert data["username"] == "newuser"
    assert "hashed_password" not in data
    assert "id" in data


def test_register_duplicate_email(client: TestClient, test_user: User):
    """Tests rejection of duplicate email registration."""
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": test_user.email,
            "username": "distinct_username",
            "password": "password123",
        },
    )
    assert response.status_code == 400
    assert "email already exists" in response.json()["detail"].lower()


def test_register_duplicate_username(client: TestClient, test_user: User):
    """Tests rejection of duplicate username registration."""
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "distinct_email@test.com",
            "username": test_user.username,
            "password": "password123",
        },
    )
    assert response.status_code == 400
    assert "username already exists" in response.json()["detail"].lower()


def test_login_with_username_success(client: TestClient, test_user: User):
    """Tests login using username."""
    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": test_user.username,
            "password": "password123",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_with_email_success(client: TestClient, test_user: User):
    """Tests login using email address."""
    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": test_user.email,
            "password": "password123",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data


def test_login_invalid_password(client: TestClient, test_user: User):
    """Tests login failure with wrong password."""
    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": test_user.username,
            "password": "wrongpassword",
        },
    )
    assert response.status_code == 400


def test_read_user_me_authenticated(
    client: TestClient,
    user_token_headers: Dict[str, str],
    test_user: User,
):
    """Tests accessing current user profile when authenticated."""
    response = client.get("/api/v1/auth/me", headers=user_token_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_user.email
    assert data["username"] == test_user.username
    assert "hashed_password" not in data


def test_read_user_me_unauthenticated(client: TestClient):
    """Tests rejection of unauthenticated /auth/me request."""
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401
