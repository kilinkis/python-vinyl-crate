from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.core.config import settings

# For SQLite, check_same_thread=False is needed because FastAPI handles requests across multiple threads.
# For PostgreSQL/MySQL, this argument is omitted.
connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    # pool_pre_ping checks connection liveness before using it (best practice in production)
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI Dependency that provides a database session per request.
    
    Analogy:
    - In Express / Node.js: Like a request-scoped middleware initializing a DB client.
    - In PHP / Laravel: Similar to how Laravel manages DB transactions per request lifecycle.
    
    The 'yield' passes the session to the route handler, and 'finally' ensures
    the session is always closed and returned to the pool, even if an exception occurs.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
