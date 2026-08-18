from typing import Generator, Dict
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool

from app.main import app
from app.db.base import Base
from app.db.session import get_db
from app.core.security import create_access_token, get_password_hash
from app.models.user import User
from app.models.record import Record

# Use in-memory SQLite with StaticPool for isolated fast test runs
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db() -> Generator[Session, None, None]:
    """Provides a fresh, isolated database session per test function."""
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db: Session) -> Generator[TestClient, None, None]:
    """Provides a TestClient with overridden get_db dependency."""
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def test_user(db: Session) -> User:
    """Creates a standard test user (Alice)."""
    user = User(
        email="alice@test.com",
        username="alice",
        hashed_password=get_password_hash("password123"),
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture(scope="function")
def user_token_headers(test_user: User) -> Dict[str, str]:
    """Returns Bearer authorization header for test_user."""
    token = create_access_token(subject=test_user.id)
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="function")
def other_user(db: Session) -> User:
    """Creates a second test user (Bob) for multi-tenancy verification."""
    user = User(
        email="bob@test.com",
        username="bob",
        hashed_password=get_password_hash("password123"),
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture(scope="function")
def other_user_headers(other_user: User) -> Dict[str, str]:
    """Returns Bearer authorization header for other_user."""
    token = create_access_token(subject=other_user.id)
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="function")
def sample_record(db: Session, test_user: User) -> Record:
    """Creates a pre-populated record owned by test_user."""
    record = Record(
        title="Kind of Blue",
        artist="Miles Davis",
        release_year=1959,
        condition="Mint",
        price=45.00,
        cover_url="https://example.com/kind-of-blue.jpg",
        user_id=test_user.id,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record
