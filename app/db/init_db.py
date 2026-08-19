import sys
from pathlib import Path

# Ensure project root is in sys.path when script is executed directly
BASE_DIR = Path(__file__).resolve().parent.parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

import app.models  # noqa: F401
from app.db.base import Base
from app.db.session import engine


def init_db() -> None:
    """Initializes database tables based on registered SQLAlchemy models."""
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    print("Creating database tables...")
    init_db()
    print("Database tables created successfully.")
